const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame
export default class Media {
  constructor(params) {
    this.params = params
    this.params.duration = this.getDuration()
    this.process = this.process.bind(this)
    this.params.media.onplay = () => {
      this.createTimer()
    }
  }

  createTimer() {
    const onAudioProcess = () => {
      if (this.isPaused()) {
        return
      }
      let time = this.getCurrentTime()
      this.process(time)
      requestAnimationFrame(onAudioProcess)
    }
    onAudioProcess()
  }

  getCurrentTime() {
    return this.params.media && this.params.media.currentTime
  }

  getDuration() {
    return this.params.duration
  }

  process(time) {
    let dom = this.params.dom
    let p = time / this.params.duration
    dom.style = `width: ${this.params.length * p}px`
  }

  isPaused() {
    return !this.params.media || this.params.media.paused
  }
  play() {
    this.params.media.play()
  }
}