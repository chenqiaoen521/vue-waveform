export default class Mse {

  constructor() {
    this.initMediaSource()
  }

  initMediaSource() {
    let dom = new Audio()
    this.dom = dom
    this.mediaSource = new MediaSource()
    dom.src = window.URL.createObjectURL(this.mediaSource)
    this.mediaSource.addEventListener('sourceopen', this.onSourceOpen.bind(this))
  }

  onSourceOpen() {
    this.sourceBuffer = this.mediaSource.addSourceBuffer('audio/aac')
  }
  play() {
    this.dom && (this.dom.play())
  }

  pause() {
    this.dom && (this.dom.pause())
  }

  appendBuffer (buffer) {
    this.sourceBuffer.appendBuffer(buffer)
  }

  stop() {
    this.dom = null
    this.mediaSource = null
    this.initMediaSource()
  }
}