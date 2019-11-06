
const AudioContext = window.AudioContext || window.webkitAudioContext
const audioContext = new AudioContext()
// const analyser = audioContext.createAnalyser()
const scriptNode = audioContext.createScriptProcessor(4096, 1, 1)
const source = audioContext.createBufferSource()

const analyser = audioContext.createAnalyser()
source.connect(analyser)

export function getBytes(arraybuffer) {
  audioContext.decodeAudioData(arraybuffer, function(buffer) {
    console.log(buffer.duration)
    scriptNode.connect(audioContext.destination)
    source.buffer = buffer
    source.connect(scriptNode)
    analyser.connect(audioContext.destination)
    console.log(new Date().getTime())
    source.start(0)

    scriptNode.onaudioprocess = () => {
      let time = audioContext.currentTime
      console.log(time)
    }
  })

  source.onended = function() {
    console.log(new Date().getTime())
    source.disconnect(scriptNode)
    scriptNode.disconnect(audioContext.destination)
  }
}