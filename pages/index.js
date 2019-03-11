import axios from 'axios'
import {IoMdPlay, IoMdPause, IoMdRefresh} from 'react-icons/io'
import classNames from 'classnames'
import Head from 'next/head'
import Link from 'next/link'

const ICON_SIZE = 80
const ANIMATION_PHASES = 12

const fetchData = async origin => {
  const {data} = await axios(`${origin}/api/themes`)
  return data
}

const getPlayList = ({questions, title}) =>
  []
    .concat(
      ...questions.map(({question, answer, comment}, i) =>
        [
          `${title} за ${(i + 1) * 10}. ${question}`,
          `-Ответ: ${answer}`,
          comment & `Комментарий: ${comment}`,
        ].filter(Boolean),
      ),
    )
    .map(text => `/tts.ogg?text=${encodeURIComponent(text)}`)

const Theme = ({
  id,
  title,
  date,
  tournament,
  author,
  isSelected,
  isPlaying,
  isLoading,
  togglePlay,
}) => {
  const handleClick = () => {
    togglePlay({id, isPlaying: !isPlaying})
  }

  return (
    <>
      <button
        type="button"
        className={classNames({
          selected: isSelected,
          loading: isLoading,
          playing: isPlaying,
        })}
        onClick={handleClick}
      >
        <h2>{title}</h2>
        {date}
        <br />
        {tournament}
        <br />
        {author && `Автор: ${author}`}
        <div className={classNames('icon', isPlaying ? 'pause' : 'play')}>
          {isPlaying ? (
            <IoMdPause size={ICON_SIZE} />
          ) : (
            <IoMdPlay size={ICON_SIZE} />
          )}
        </div>
      </button>
      <style jsx>{`
        button {
          position: relative;
          z-index: 1;
          overflow: hidden;
          appearance: none;
          background: none;
          border: none;
          text-align: left;
          padding: 8px 16px 16px;
          font-size: 12px;
          cursor: pointer;
          border-radius: 3px;
          color: #737577;
        }
        button::before {
          content: '';
          position: absolute;
          top: 0;
          right: -128px;
          bottom: 0;
          left: 0;
          z-index: -1;
          transition: background-color 0.3s ease-out;
        }
        button:hover::before,
        button:focus::before {
          background-color: #f2f9ff;
          transition: none;
        }
        button:active::before,
        button.selected.selected::before {
          background-color: #d4edff;
        }
        button:focus {
          outline: none;
          box-shadow: 0 0 0 2px #80c6ff;
        }
        @keyframes progress {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-128px);
          }
        }
        .loading::before {
          animation: progress 2s linear infinite;
          background-image: linear-gradient(
            to right,
            ${Array(ANIMATION_PHASES + 1)
              .fill()
              .map((_, i) => i / ANIMATION_PHASES)
              .map(
                phase =>
                  `rgba(256, 256, 256, ${0.5 *
                    (1 + Math.cos(2 * Math.PI * phase))}) ${100 * phase}%`,
              )
              .join(',\n')}
          );
          background-size: 128px;
          background-repeat: repeat;
        }
        h2 {
          font-size: 20px;
          line-height: 24px;
          margin: 0 0 8px;
          color: #1f2326;
        }
        .icon {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.3;
          color: #444;
        }
        button:active .icon {
          opacity: 0.5;
        }
        button:not(.selected):not(:hover) .icon {
          opacity: 0;
          transition: opacity 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

let OGVPlayer
const createMediaElement = params => {
  const audio = document.createElement('audio')
  if (audio.canPlayType('audio/ogg')) {
    return audio
  }

  if (OGVPlayer == null) {
    const ogv = require('ogv')
    ogv.OGVLoader.base = 'static'
    OGVPlayer = ogv.OGVPlayer
    window.OVGPlayer = OGVPlayer
  }
  return new OGVPlayer(params)
}

const Themes = ({data}) => {
  const [{selected, isPlaying, trackIndex}, dispatch] = React.useReducer(
    (state, action) => {
      switch (action.type) {
        case 'TOGGLE':
          return {
            ...state,
            selected: action.id != null ? action.id : state.selected,
            isPlaying: action.isPlaying,
            trackIndex:
              action.id != null && action.id !== state.selected
                ? 0
                : state.trackIndex,
          }
        case 'NEXT_TRACK': {
          const nextIndex = state.trackIndex + 1
          if (nextIndex >= action.playlistLength) {
            return {
              ...state,
              trackIndex: 0,
              isPlaying: false,
            }
          }
          return {
            ...state,
            trackIndex: nextIndex,
          }
        }
        default:
          return state
      }
    },
    {
      selected: null,
      isPlaying: false,
      trackIndex: 0,
    },
  )
  const [isLoading, setIsLoading] = React.useState('false')

  const playlist = React.useRef()
  const getCurrentPlaylist = id => {
    const selectedTheme = id && data.find(theme => theme.id === id)
    return selectedTheme ? getPlayList(selectedTheme) : []
  }
  React.useEffect(() => {
    playlist.current = getCurrentPlaylist(selected)
  }, [selected])

  const handleEnd = () => {
    dispatch({type: 'NEXT_TRACK', playlistLength: playlist.current.length})
  }
  const handleLoadstart = () => {
    console.log('LOADSTARTA')
    setIsLoading(true)
  }
  const handleLoadeddata = () => {
    console.log('LOADEDDATAA')
    setIsLoading(false)
  }
  const mediaRef = React.useRef()
  const containerRef = React.useRef()
  React.useEffect(() => {
    const media = createMediaElement()
    mediaRef.current = media
    containerRef.current.appendChild(media)
    media.addEventListener('ended', handleEnd)
    media.addEventListener('loadstart', handleLoadstart)
    media.addEventListener('loadeddata', handleLoadeddata)
    return () => {
      media.removeEventListener('ended', handleEnd)
      media.removeEventListener('loadstart', handleLoadstart)
      media.removeEventListener('loadeddata', handleLoadeddata)
    }
  }, [])

  const mediaSrc = React.useRef()
  const setSrc = src => {
    if (src && mediaSrc.current !== src) {
      mediaSrc.current = src
      mediaRef.current.src = src
    }
  }

  React.useEffect(() => {
    setSrc(playlist.current[trackIndex])
    if (isPlaying) {
      mediaRef.current.play()
    }
  }, [selected, trackIndex])

  const togglePlay = ({id, isPlaying}) => {
    if (isPlaying && !mediaSrc.current) {
      setSrc(getCurrentPlaylist(id)[trackIndex])
    }
    isPlaying ? mediaRef.current.play() : mediaRef.current.pause()
    dispatch({type: 'TOGGLE', id, isPlaying})
  }

  return (
    <>
      {data.map(theme => {
        const isSelected = selected === theme.id
        return (
          <Theme
            key={theme.id}
            isSelected={isSelected}
            isPlaying={isSelected && isPlaying}
            isLoading={isSelected && isLoading}
            togglePlay={togglePlay}
            {...theme}
          />
        )
      })}
      <div hidden ref={containerRef} />
    </>
  )
}

const Index = props => (
  <>
    <Head>
      <title>Своя игра</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <div className="container">
      <Link href=".">
        <a title="refresh" className="refresh">
          <IoMdRefresh size={ICON_SIZE} />
        </a>
      </Link>
      <div className="themes">
        <Themes {...props} />
      </div>
    </div>
    <style jsx>{`
      .container {
        display: flex;
        flex-direction: row-reverse;
        padding: 12px;
      }
      @media (max-width: 640px) {
        .container {
          flex-direction: column;
        }
      }
      .themes {
        flex-grow: 1;
        display: grid;
        align-items: baseline;
        grid-gap: 16px 8px;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        grid-template-rows: auto;
        padding: 4px;
      }
      .refresh {
        color: inherit;
        text-align: center;
        border-radius: 3px;
        transition: background-color 0.3s ease-out;
        margin: 4px;
      }
      .refresh > :global(svg) {
        position: sticky;
        top: 0;
        opacity: 0.1;
        transition: opacity 0.3s ease-out;
      }
      .refresh:hover,
      .refresh:focus {
        background-color: #f2f9ff;
      }
      .refresh:hover > :global(svg),
      .refresh:focus > :global(svg) {
        opacity: 0.3;
        transition: none;
      }
      .refresh:focus {
        outline: none;
        box-shadow: 0 0 0 2px #80c6ff;
      }
      .refresh:active {
        background-color: #d4edff;
      }
      .refresh:active > :global(svg) {
        opacity: 0.5;
      }
    `}</style>
  </>
)

Index.getInitialProps = async ({req}) => {
  const origin = req
    ? `${req.connection.encrypted ? 'https' : 'http'}://${req.headers.host}`
    : ''
  return {data: await fetchData(origin)}
}

export default Index
