export default class Mse {

  constructor() {
    this.initMediaSource()
    this.buffer = []
  }

  initMediaSource() {
    let dom = new Audio()
    this.dom = dom
    this.mediaSource = new MediaSource()
    dom.src = window.URL.createObjectURL(this.mediaSource)
    this.mediaSource.addEventListener('sourceopen', this.onSourceOpen.bind(this))
    this.count = 0
    this.first = true
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
    this.event()
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
      let file = new Uint8Array(self.buffer).buffer
      this.appendBuffer(file)
      self.buffer = []
    })
  }

  appendBuffer (buffer) {
    if (this.first) {
      this.sourceBuffer.appendBuffer(buffer)
      this.first = false
    } else {
      let array = Array.prototype.slice.call(new Uint8Array(buffer))
      this.buffer.push.apply(this.buffer, array)
    }
  }

  stop() {
    this.count = 0
    this.dom = null
    this.mediaSource = null
    this.initMediaSource()
    this.buffer = []
  }

}