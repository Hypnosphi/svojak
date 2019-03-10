import axios from 'axios'
import {IoMdPlay, IoMdPause, IoMdRefresh} from 'react-icons/io'
import {PlayerContextGroup, PlayerContextProvider} from '@cassette/core'
import {usePlayerContext} from '@cassette/hooks'
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
    .map(text => ({
      url: `/tts.ogg?text=${encodeURIComponent(text)}`,
      title: text,
    }))

const Theme = ({
  id,
  title,
  date,
  tournament,
  author,
  isSelected,
  isInited,
  setSelected,
}) => {
  const {
    paused,
    awaitingPlayResume,
    trackLoading,
    onTogglePause,
  } = usePlayerContext([
    'paused',
    'awaitingPlayResume',
    'trackLoading',
    'onTogglePause',
  ])

  const [isPlaying, setIsPlaying] = React.useState(false)
  const rafRef = React.useRef()
  const shouldPause =
    isPlaying && paused && !awaitingPlayResume && !trackLoading

  React.useEffect(() => {
    if (shouldPause) {
      rafRef.current = requestAnimationFrame(() => setIsPlaying(false))
      return () => cancelAnimationFrame(rafRef.current)
    }
  }, [shouldPause])

  React.useEffect(() => {
    if (isInited) {
      setTimeout(() => onTogglePause(false), 0)
    }
  }, [isInited])

  React.useEffect(() => {
    cancelAnimationFrame(rafRef.current)
    onTogglePause(!isPlaying)
  }, [isPlaying])

  const handleClick = () => {
    setIsPlaying(!isPlaying)
    if (!isSelected) {
      setSelected(id)
    }
  }

  return (
    <>
      <button
        type="button"
        className={classNames({
          selected: isSelected,
          loading: trackLoading,
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

const emptyArray = []
const ThemeContainer = props => {
  const [isInited, setIsInited] = React.useState(false)
  if (!isInited && props.isSelected) {
    setIsInited(true)
  }

  return (
    <PlayerContextProvider
      playlist={isInited ? getPlayList(props) : emptyArray}
    >
      <Theme {...props} isInited={isInited} />
    </PlayerContextProvider>
  )
}

const Index = ({data}) => {
  const [selected, setSelected] = React.useState()
  return (
    <PlayerContextGroup
      createMediaElement={() => document.createElement('audio')}
      defaultRepeatStrategy="none"
    >
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
          {data.map(theme => {
            const isSelected = selected === theme.id
            return (
              <ThemeContainer
                key={theme.id}
                isSelected={isSelected}
                setSelected={setSelected}
                {...theme}
              />
            )
          })}
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
    </PlayerContextGroup>
  )
}

Index.getInitialProps = async ({req}) => {
  const origin = req
    ? `${req.connection.encrypted ? 'https' : 'http'}://${req.headers.host}`
    : ''
  return {data: await fetchData(origin)}
}

export default Index
