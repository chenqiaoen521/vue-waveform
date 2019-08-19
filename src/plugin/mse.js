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
    this.count = 0
  }

  onSourceOpen() {
    // let _this = this
    if (this.count !== 0) {
      return
    }
    this.count ++
    URL.revokeObjectURL(this.dom.src)
    this.sourceBuffer = this.mediaSource.addSourceBuffer('audio/aac')
    /*this.sourceBuffer.addEventListener('updateend', function() {
      _this.mediaSource.endOfStream()
    })*/
  }
  play() {
    this.dom && (this.dom.play())
  }

  pause() {
    this.dom && (this.dom.pause())
  }

  event() {
    let self = this
    self.sourceBuffer.addEventListener('updateend', function () {
      self.dom.play()
    })
  }

  appendBuffer (buffer) {
    try {
      this.sourceBuffer.appendBuffer(buffer)
    } catch (e) {
      // 1
    }
  }

  stop() {
    this.count = 0
    this.dom = null
    this.mediaSource = null
    this.initMediaSource()
  }

}