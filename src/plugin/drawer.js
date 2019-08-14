let defaultOpt = {
  WIDTH: 500,
  HEIGHT: 300,
  fftSize: 256
}

const AudioContext = window.AudioContext || window.webkitAudioContext
const audioContext = new AudioContext()
const analyser = audioContext.createAnalyser()

let extend = function (dst, obj) {
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      dst[i] = obj[i]
    }
  }
}
export default class Drawer {
  constructor (options) {
    this.opts = Object.assign({}, defaultOpt)
    extend(this.opts, options || {})
    analyser.fftSize = this.opts.fftSize
  }

  receive(arraybuffer) {
    let _this = this
    audioContext.decodeAudioData(arraybuffer, function(buffer) {
      _this.analysis(buffer)
    })
  }

  analysis(buffer) {
    this.audioBufferSourceNode = audioContext.createBufferSource()
    this.audioBufferSourceNode.connect(analyser)
    // this.analyser.connect(this.audioContext.destination)
    this.audioBufferSourceNode.buffer = buffer
    this.audioBufferSourceNode.start(0)
    this.bufferLength = analyser.frequencyBinCount
    this.dataArray = new Uint8Array(this.bufferLength)
    this.draw()
  }

  draw() {
    if (this.dataArray === null) return

    analyser.getByteFrequencyData(this.dataArray)

    this.opts.canvasCtx.fillStyle = 'rgb(0, 0, 0)'
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

    window.requestAnimationFrame(this.draw.bind(this))
  }
}
