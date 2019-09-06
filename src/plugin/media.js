const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame
import bus from './event'
export default class Media {
  constructor(params) {
    this.init(params)
  }

  init(params) {
    this.params = params
    this.params.duration = this.getDuration()
    this.process = this.process.bind(this)
    this.params.media.src = params.url
    let _this = this
    this.params.media.oncanplay = () => {
      _this.params.media.play()
    }
    this.params.media.onerror = function (e) {
      console.log(e)
    }
    this.params.media.onplay = () => {
      _this.createTimer()
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
    bus.$emit('process', this.params.length * p)
  }

  isPaused() {
    return !this.params.media || this.params.media.paused
  }
  play() {
    this.params.media.play()
  }

  stop() {
    this.params.media && this.params.media.pause()
  }
}