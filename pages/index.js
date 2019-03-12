import axios from 'axios'
import {IoMdPause, IoMdPlay, IoMdRefresh, IoMdMic} from 'react-icons/io'
import classNames from 'classnames'
import Head from 'next/head'
import Link from 'next/link'

import {OGGPlayer, useOGGPlayerContext} from '../components/OGGPlayer'
import {useAudioAPI, useVolume} from '../hooks/useVolume'

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
          `Раз, -два, -три. -Ответ: ${answer}`,
          comment && `Комментарий. ${comment}`,
        ].filter(Boolean),
      ),
    )
    .map(text => `/tts.ogg?text=${encodeURIComponent(text)}`)

const DispatchContext = React.createContext()
const useDispatch = () => React.useContext(DispatchContext)

const Theme = ({
  id,
  questions,
  title,
  date,
  tournament,
  author,
  isSelected,
  isPlaying,
}) => {
  const dispatch = useDispatch()
  const {isLoading, init} = useOGGPlayerContext()

  const handleClick = () => {
    init(!isPlaying, getPlayList({questions, title})[0])
    dispatch({type: 'TOGGLE', id, isPlaying: !isPlaying})
  }

  return (
    <>
      <button
        type="button"
        className={classNames({
          selected: isSelected,
          loading: isSelected && isLoading,
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

const Themes = ({data, state}) => {
  const {selected, isPlaying, trackIndex} = state
  const dispatch = useDispatch()

  const playlist = React.useMemo(() => {
    const selectedTheme = selected && data.find(theme => theme.id === selected)
    return selectedTheme ? getPlayList(selectedTheme) : []
  }, [data, selected])

  const handleEnd = React.useCallback(() => {
    dispatch({type: 'NEXT_TRACK', playlistLength: playlist.length})
  }, [dispatch, playlist])

  return (
    <OGGPlayer
      src={playlist[trackIndex]}
      isPlaying={isPlaying}
      onEnd={handleEnd}
    >
      {data.map(theme => {
        const isSelected = selected === theme.id
        return (
          <Theme
            key={theme.id}
            isSelected={isSelected}
            isPlaying={isSelected && isPlaying}
            {...theme}
          />
        )
      })}
    </OGGPlayer>
  )
}

const MAX_VOLUME = 255
const VolumeBar = React.memo(({volume}) => {
  const dispatch = useDispatch()
  const [threshold, setThreshold] = React.useState(64)
  const thresholdReached = volume >= threshold

  React.useEffect(() => {
    if (thresholdReached) {
      dispatch({type: 'TOGGLE', isPlaying: false})
    }
  }, [dispatch, thresholdReached])

  return (
    <div className="container">
      <input
        className={thresholdReached ? 'thresholdReached' : ''}
        type="range"
        max={MAX_VOLUME}
        value={threshold}
        onChange={e => setThreshold(e.target.value)}
      />
      <progress max={MAX_VOLUME} value={volume} />
      <style jsx>{`
        .container {
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
        }
        progress {
          width: 100%;
        }
        input {
          -webkit-appearance: none;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          background: transparent;
          border-radius: 3px;
        }
        input::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background-color: #fff;
          box-shadow: 0 0 0 1px #b8d1e5;
        }
        input:hover::-webkit-slider-thumb {
          box-shadow: 0 0 0 1px #80c6ff;
        }
        input:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 2px #80c6ff;
        }
        input:active::-webkit-slider-thumb,
        .thresholdReached::-webkit-slider-thumb {
          background-color: #d4edff;
          box-shadow: 0 0 0 1px #80c6ff;
        }
        input:focus {
          outline: none;
        }
      `}</style>
    </div>
  )
})

const Volume = () => {
  const volume = useVolume()
  return <VolumeBar volume={volume} />
}

const reducer = (state, action) => {
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
}

const initialState = {
  selected: null,
  isPlaying: false,
  trackIndex: 0,
}

const Index = props => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const [useMic, setUseMic] = React.useState()
  const {supported} = useAudioAPI()

  return (
    <DispatchContext.Provider value={dispatch}>
      <Head>
        <title>Своя игра</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          httpEquiv="origin-trial"
          content={process.env.GOOGLE_TRIAL_TOKEN}
        />
      </Head>
      <div className="container">
        <div className="controls">
          {supported && (
            <div className="use-mic-container">
              <button
                className={classNames('control', 'use-mic', {
                  'use-mic-on': useMic,
                })}
                title="Use microphone"
                type="button"
                onClick={() => setUseMic(use => !use)}
              >
                <IoMdMic size={ICON_SIZE} />
              </button>
              {useMic && <Volume />}
            </div>
          )}
          <Link href=".">
            <a title="refresh" className="control refresh">
              <IoMdRefresh size={ICON_SIZE} />
            </a>
          </Link>
        </div>
        <div className="themes">
          <Themes state={state} {...props} />
        </div>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: row-reverse;
          padding: 12px;
        }
        .controls {
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 640px) {
          .container {
            flex-direction: column;
          }
          .controls {
            flex-direction: row;
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
        .control {
          -webkit-appearance: none;
          background: none;
          border: none;
          color: inherit;
          text-align: center;
          border-radius: 3px;
          transition: background-color 0.3s ease-out;
          margin: 4px;
          cursor: pointer;
        }
        .control > :global(svg) {
          opacity: 0.1;
          transition: opacity 0.3s ease-out;
        }
        .control:hover,
        .control:focus {
          background-color: #f2f9ff;
        }
        .control:hover > :global(svg),
        .control:focus > :global(svg) {
          opacity: 0.3;
          transition: none;
        }
        .control:focus {
          outline: none;
          box-shadow: 0 0 0 2px #80c6ff;
        }
        .control:active,
        .control.use-mic-on {
          background-color: #d4edff;
        }
        .control:active > :global(svg),
        .control.use-mic-on > :global(svg) {
          opacity: 0.5;
        }
        .refresh {
          flex-grow: 1;
        }
        .refresh > :global(svg) {
          position: sticky;
          top: 0;
        }
        .use-mic-container {
          position: relative;
          padding-bottom: 24px;
        }
      `}</style>
    </DispatchContext.Provider>
  )
}

Index.getInitialProps = async ({req}) => {
  const origin = req
    ? `${req.connection.encrypted ? 'https' : 'http'}://${req.headers.host}`
    : ''
  return {data: await fetchData(origin)}
}

export default Index
