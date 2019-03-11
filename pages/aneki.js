import {IoMdPlay, IoMdPause} from 'react-icons/io'
import axios from 'axios'
import random from 'random'

import {OGGPlayer, useOGGPlayerContext} from '../components/OGGPlayer'

const ANIMATION_PHASES = 12

const Button = ({isPlaying, setIsPlaying}) => {
  const {isLoading, init} = useOGGPlayerContext()

  const handleClick = () => {
    init(!isPlaying)
    setIsPlaying(!isPlaying)
  }

  return (
    <>
      <button
        className={isLoading ? 'loading' : ''}
        type="button"
        onClick={handleClick}
      >
        {isPlaying ? <IoMdPause size="100%" /> : <IoMdPlay size="100%" />}
      </button>
      <style jsx>{`
        :global(body) {
          margin: 0;
        }
        button {
          position: relative;
          appearance: none;
          background: none;
          border: none;
          cursor: pointer;
          outline: none;
          height: 100vh;
          width: 100vw;
        }
        @keyframes progress {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-512px);
          }
        }
        .loading::before {
          content: '';
          position: absolute;
          top: 0;
          right: -512px;
          bottom: 0;
          left: 0;
          z-index: -1;
          animation: progress 2s linear infinite;
          background-image: linear-gradient(
            to right,
            ${Array(ANIMATION_PHASES + 1)
              .fill()
              .map((_, i) => i / ANIMATION_PHASES)
              .map(
                phase =>
                  `rgba(212, 237, 255, ${0.5 *
                    (1 + Math.cos(2 * Math.PI * phase))}) ${100 * phase}%`,
              )
              .join(',\n')}
          );
          background-size: 512px;
          background-repeat: repeat;
        }
      `}</style>
    </>
  )
}

const Aneki = ({count}) => {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [index, setIndex] = React.useState()

  const unread = React.useRef()
  const updateIndex = () => {
    const newIndex = unread.current[random.int(0, unread.current.length - 1)]
    unread.current = unread.current.filter(x => x !== newIndex)
    setIsPlaying(false)
    setIndex(newIndex)
  }
  React.useEffect(() => {
    unread.current = Array(count)
      .fill()
      .map((_, i) => i)
    updateIndex()
  }, [count])

  return (
    <OGGPlayer
      src={index != null ? `/anek.ogg?index=${index}` : null}
      isPlaying={isPlaying}
      onEnd={updateIndex}
    >
      <Button isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
    </OGGPlayer>
  )
}
Aneki.getInitialProps = async ({req}) => {
  const origin = req
    ? `${req.connection.encrypted ? 'https' : 'http'}://${req.headers.host}`
    : ''
  const {data} = await axios(`${origin}/api/aneksCount`)
  return {count: data}
}

export default Aneki
