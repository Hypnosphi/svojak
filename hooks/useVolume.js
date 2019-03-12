import React from 'react'

export const useAudioAPI = () => {
  const [API, setAPI] = React.useState({supported: false})
  React.useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    const getUserMedia = (
      navigator.mediaDevices.getUserMedia ||
      navigator.mediaDevices.webkitGetUserMedia
    ).bind(navigator.mediaDevices)
    setAPI({
      AudioContext,
      getUserMedia,
      supported:
        AudioContext != null &&
        getUserMedia != null &&
        navigator.mediaDevices.getSupportedConstraints().echoCancellation,
    })
  }, [])

  return API
}

export const useVolume = () => {
  const [volume, setVolume] = React.useState(0)
  const API = useAudioAPI()

  React.useEffect(() => {
    const {AudioContext, getUserMedia, supported} = API
    if (!supported) {
      return
    }

    const context = new AudioContext()
    const analyser = context.createAnalyser()
    const sampleLength = (analyser.fftSize / context.sampleRate) * 1000
    console.log(sampleLength)
    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    let cleanup = () => {}
    getUserMedia({audio: {echoCancellationType: 'system'}}).then(stream => {
      const source = context.createMediaStreamSource(stream)
      source.connect(analyser)
      const intervalID = setInterval(() => {
        analyser.getByteFrequencyData(dataArray)
        setVolume(
          Math.round(
            Math.sqrt(
              dataArray.reduce((acc, x) => acc + x * x, 0) / dataArray.length,
            ),
          ),
        )
      }, sampleLength)
      cleanup = () => clearInterval(intervalID)
    })
    return cleanup
  }, [API])

  return volume
}
