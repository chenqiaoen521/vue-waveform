import Analysis from './analysis'
import { extend, debounce } from './util'
import Tween from './animation'

let defaultOpt = {
  WIDTH: 500,
  HEIGHT: 300
}

const AudioContext = window.AudioContext || window.webkitAudioContext
const audioContext = new AudioContext()
const analyser = audioContext.createAnalyser()

export default class Drawer {
  constructor (options) {
    this.opts = Object.assign({}, defaultOpt)
    this.tween = new Tween()
    extend(this.opts, options || {})
    analyser.fftSize = this.opts.fftSize
    this.analysisLine = new Analysis({WIDTH: this.opts.WIDTH, audioContext: audioContext})
    this.receive = this.warpperReceive(this.opts.type)
    this.drawBar = this.drawBar.bind(this)
    this.mybuffer = undefined
    this.animationStart = false
  }

  setWidth(v, buffer) {
    this.clear()
    this.opts.WIDTH = v
  }

  review(buffer) { // 设置重新绘制
    this.analysisLine = new Analysis({WIDTH: this.opts.WIDTH, audioContext: audioContext})
    return this.receive(buffer)
  }

  destory() {
    if (this.opts && this.opts.canvasCtx) {
      this.opts.canvasCtx.clearRect(0, 0, this.opts.WIDTH, this.opts.HEIGHT)
    }
  }

  warpperReceive(type) {
    let _this = this
    if (type === 'bar') {
      return function (arraybuffer) {
        return new Promise((resolve, reject) => {
          audioContext.decodeAudioData(arraybuffer, function(buffer) {
            _this.analysisBar(buffer)
            resolve(buffer)
          })
        })
      }
    } else if (type === 'line') {
      return function (arraybuffer) {
        return new Promise((resolve, reject) => {
          audioContext.decodeAudioData(arraybuffer, function(buffer) {
            _this.mybuffer = buffer
            _this.analysisLine.getPeaks(buffer)
            _this.drawLine2()
            resolve(buffer)
          })
        })
      }
    }
  }

  analysisBar(buffer) {
    this.audioBufferSourceNode = audioContext.createBufferSource()
    this.audioBufferSourceNode.connect(analyser)
    // this.analyser.connect(this.audioContext.destination)
    this.audioBufferSourceNode.buffer = buffer
    this.audioBufferSourceNode.start(0)
    this.bufferLength = analyser.frequencyBinCount
    this.dataArray = new Uint8Array(this.bufferLength)
    this.drawBar()
  }

  drawBar() {
    if (!this.animationStart) return
    if (this.dataArray === null) return

    analyser.getByteFrequencyData(this.dataArray)

    this.opts.canvasCtx.fillStyle = this.opts.bgColor
    this.opts.canvasCtx.fillRect(0, 0, this.opts.WIDTH, this.opts.HEIGHT)

    let barWidth = (this.opts.WIDTH / this.bufferLength) * 1.2
    let barHeight
    let x = 0
    let grd = this.opts.canvasCtx.createLinearGradient(0, 0, 0, this.opts.HEIGHT)

    grd.addColorStop(0, '#0f0')

    grd.addColorStop(0.5, '#ff0')

  /* grd.addColorStop(0.5,"rgb(59, 234, 66)");
     grd.addColorStop(0.5,"rgb(59, 234, 66)"); */

    grd.addColorStop(1, '#f00')
    for (var i = 0; i < this.bufferLength; i++) {
      barHeight = this.dataArray[i] * this.opts.range
      this.opts.canvasCtx.fillStyle = grd
      this.opts.canvasCtx.fillRect(x, this.opts.HEIGHT - barHeight, barWidth, barHeight)
      x += barWidth + 1
    }

    window.requestAnimationFrame(debounce(this.drawBar, 60))
  }

  drawLine() {
    if (!this.animationStart) return
    if (this.dataArray === null) return

    analyser.getByteTimeDomainData(this.dataArray)

    this.opts.canvasCtx.fillStyle = 'rgb(0, 0, 0)'
    this.opts.canvasCtx.fillRect(0, 0, this.opts.WIDTH, this.opts.HEIGHT)
    this.opts.canvasCtx.lineWidth = 1
    this.opts.canvasCtx.strokeStyle = 'rgb(59, 234, 46)'
    this.opts.canvasCtx.beginPath()
    let sliceWidth = this.opts.WIDTH * 1.0 / this.bufferLength
    let x = 0
    for (let i = 0; i < this.bufferLength; i++) {
      let v = this.dataArray[i] / 128.0
      let y = v * this.opts.HEIGHT / 2
      if (i === 0) {
        this.opts.canvasCtx.moveTo(x, y)
      } else {
        this.opts.canvasCtx.lineTo(x, y)
      }
      x += sliceWidth
    }
    this.opts.canvasCtx.lineTo(this.opts.WIDTH, this.opts.HEIGHT / 2)
    this.opts.canvasCtx.stroke()
    // this.opts.canvasCtx.beginPath()
    // this.opts.canvasCtx.strokeStyle = 'rgb(229, 65, 119)'
    window.requestAnimationFrame(this.drawLine.bind(this))
  }

  stopAnimation() {
    this.animationStart = false
    this.clear()
  }

  openAnimation() {
    this.animationStart = true
  }
  clear() {
    this.opts.canvasCtx.clearRect(0, 0, this.opts.WIDTH, this.opts.HEIGHT)
  }

  drawLine2() {
    let _this = this
    let arr = this.analysisLine.mergedPeaks.map(function(item, i) { return item * 1000 })
    this.opts.canvasCtx.fillStyle = this.opts.bgColor
    this.opts.canvasCtx.fillRect(0, 0, this.opts.WIDTH, this.opts.HEIGHT)
    this.opts.canvasCtx.lineWidth = 1
    this.opts.canvasCtx.strokeStyle = 'rgb(59, 234, 46)'
    this.opts.canvasCtx.beginPath()
    let sliceWidth = this.opts.WIDTH * 1.0 / arr.length
    let x = 0
    let len = arr.length
    this.tween.animate({
      x: x,
      duration: 2000,
      sliceWidth,
      count: len,
      callback: function (i, x, sliceWidth) {
        let y = arr[i] * _this.opts.range + (_this.opts.HEIGHT / 2)
        if (i === 0) {
          _this.opts.canvasCtx.moveTo(x, y)
        } else {
          _this.opts.canvasCtx.lineTo(x, y)
        }
        x += sliceWidth
        _this.opts.canvasCtx.stroke()
        return x
      }
    })
    /*for (let i = 0; i < len; i++) {
      let y = arr[i] * this.opts.range + (this.opts.HEIGHT / 2)
      if (i === 0) {
        this.opts.canvasCtx.moveTo(x, y)
      } else {
        this.opts.canvasCtx.lineTo(x, y)
      }
      x += sliceWidth
    }*/
    this.opts.canvasCtx.lineTo(this.opts.WIDTH, this.opts.HEIGHT / 2)
    this.opts.canvasCtx.stroke()
  }
}
