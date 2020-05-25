const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame

import bus from './event'
export default class Media {
  constructor(params) {
    this.init(params)
  }

  init(params) {
    this.params = params
    if (params.hasAudioContext) {
      this.createPlayer()
    } else {
      this.params.duration = this.getDuration()
      this.process = this.process.bind(this)
      this.params.media.src = params.url
      let _this = this
      this.params.media.oncanplay = () => {
        _this.params.media.play()
      }
      this.params.media.loop = 'loop'
      this.params.media.onplay = () => {
        _this.createTimer()
      }
      this.params.media.ontimeupdate = () => {
        bus.$emit('updateTimeEnded', this.params.media.currentTime)
      }
    }
  }

  createPlayer() {
    this.isStop = true //是否已经停止播放
    this.AudioContext = window.AudioContext || window.webkitAudioContext
    this.audioContext = new AudioContext()
    this.source = this.audioContext.createBufferSource()
    this.analyser = this.audioContext.createAnalyser()
    this.scriptNode = this.audioContext.createScriptProcessor(4096, 1, 1)
    this.analyser.connect(this.audioContext.destination)
    this.scriptNode.connect(this.audioContext.destination)
    this.source.connect(this.analyser)
    this.source.connect(this.scriptNode)
    this.source.buffer = this.params.byteArray
    this.isStop = false
    // this.source.loop = true
    this.source.start(0)
    let _this = this
    this.source.onended = function() {
      _this.source.disconnect(_this.scriptNode)
      _this.scriptNode.disconnect(_this.audioContext.destination)
      bus.$emit('sourceEnded')
      setTimeout(function () {
        _this.isStop = true
      }, 0)
    }
    this.createTimerToAudioContext()
  }

  createTimerToAudioContext() {
    const onAudioProcess = () => {
      if (this.isStop) {
        return
      }
      let time = this.audioContext.currentTime
      this.process(time)
      requestAnimationFrame(onAudioProcess)
    }
    onAudioProcess()
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

  setWidth(width) {
    this.params.length = width
    this.params.dom.style = `width: 0px`
  }

  isPaused() {
    return !this.params.media || this.params.media.paused
  }
  play() {
    this.params.media.play()
  }

  stop() {
    this.params.media && this.params.media.pause()
    this.source && this.source.stop()
  }

  pause() {
    this.params.media.pause()
  }
}