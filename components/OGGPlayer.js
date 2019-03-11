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

const noop = () => {}
const OGGPlayerContext = React.createContext({
  isLoading: false,
  init: noop,
})
export const OGGPlayer = ({src, isPlaying, onEnd = noop, children}) => {
  const [isLoading, setIsLoading] = React.useState(true)

  const onEndRef = React.useRef('')
  const handleLoadeddata = () => setIsLoading(false)

  const mediaRef = React.useRef()
  const containerRef = React.useRef()
  React.useEffect(() => {
    const media = createMediaElement()
    mediaRef.current = media
    containerRef.current.appendChild(media)
    media.addEventListener('loadeddata', handleLoadeddata)
    return () => media.removeEventListener('loadeddata', handleLoadeddata)
  }, [])

  React.useEffect(() => {
    const media = mediaRef.current
    media.addEventListener('ended', onEnd)
    return () => media.removeEventListener('ended', onEnd)
  }, [onEnd])

  const mediaSrc = React.useRef()
  const setSrc = src => {
    if (src && mediaSrc.current !== src) {
      mediaSrc.current = src
      mediaRef.current.src = src
      setIsLoading(true)
    }
  }

  React.useEffect(() => {
    setSrc(src)
    isPlaying ? mediaRef.current.play() : mediaRef.current.pause()
  }, [src, isPlaying])

  const isInited = React.useRef(false)
  const init = (isPlaying, firstSrc) => {
    if (isPlaying && !isInited.current) {
      setSrc(firstSrc)
      mediaRef.current.play()
      isInited.current = true
    }
  }

  return (
    <>
      <div hidden ref={containerRef} />
      <OGGPlayerContext.Provider value={{isLoading, init}}>
        {children}
      </OGGPlayerContext.Provider>
    </>
  )
}

export const useOGGPlayerContext = () => React.useContext(OGGPlayerContext)
