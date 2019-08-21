import Analysis from './analysis'
import { extend, debounce } from './util'

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
    extend(this.opts, options || {})
    analyser.fftSize = this.opts.fftSize
    this.analysisLine = new Analysis({WIDTH: this.opts.WIDTH})
    this.receive = this.warpperReceive(this.opts.type)
    this.drawBar = this.drawBar.bind(this)
  }

  setWidth(v) {
    this.opts.WIDTH = v
  }

  warpperReceive(type) {
    let _this = this
    if (type === 'bar') {
      return function (arraybuffer) {
        audioContext.decodeAudioData(arraybuffer, function(buffer) {
          _this.analysisBar(buffer)
        })
      }
    } else if (type === 'line') {
      return function (arraybuffer) {
        audioContext.decodeAudioData(arraybuffer, function(buffer) {
          // _this.analysis(buffer)
          _this.analysisLine.getPeaks(buffer)
          _this.drawLine2()
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

  drawLine2() {
    let arr = this.analysisLine.mergedPeaks.map(function(item, i) { return item * 1000 })
    this.opts.canvasCtx.fillStyle = this.opts.bgColor
    this.opts.canvasCtx.fillRect(0, 0, this.opts.WIDTH, this.opts.HEIGHT)
    this.opts.canvasCtx.lineWidth = 1
    this.opts.canvasCtx.strokeStyle = 'rgb(59, 234, 46)'
    this.opts.canvasCtx.beginPath()
    let sliceWidth = this.opts.WIDTH * 1.0 / arr.length
    let x = 0
    let len = arr.length
    for (let i = 0; i < len; i++) {
      let y = arr[i] + (this.opts.HEIGHT / 2)
      if (i === 0) {
        this.opts.canvasCtx.moveTo(x, y)
      } else {
        this.opts.canvasCtx.lineTo(x, y)
      }
      x += sliceWidth
    }
    this.opts.canvasCtx.lineTo(this.opts.WIDTH, this.opts.HEIGHT / 2)
    this.opts.canvasCtx.stroke()
  }
}
