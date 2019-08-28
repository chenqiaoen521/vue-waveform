
export default class WebAudio {
  constructor(params) {
    this.params = params
    this.ac = params.audioContext || this.getAudioContext()
  }

  init() {
    this.createScriptNode()
  }

  createScriptNode() {
    if (this.params.audioScriptProcessor) {
      this.scriptNode = this.params.audioScriptProcessor
    } else {
      if (this.ac.createScriptProcessor) {
        this.scriptNode = this.ac.createScriptProcessor(
          WebAudio.scriptBufferSize
        )
      } else {
        this.scriptNode = this.ac.createJavaScriptNode(
          WebAudio.scriptBufferSize
        )
      }
    }
    this.scriptNode.connect(this.ac.destination)
  }

  addOnAudioProcess() {
    this.scriptNode.onaudioprocess = () => {
      const time = this.getCurrentTime()

      if (time >= this.getDuration()) {
        this.setState(FINISHED)
        this.fireEvent('pause')
      } else if (time >= this.scheduledPause) {
        this.pause()
      } else if (this.state === this.states[PLAYING]) {
        this.fireEvent('audioprocess', time)
      }
    }
  }
}