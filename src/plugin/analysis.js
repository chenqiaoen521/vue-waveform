export default class Analysis {
  static scriptBufferSize = 256
  constructor (options) {
    this.WIDTH = options.WIDTH
    this.pixelRatio = 1
    this.params = options
    this.ac = options.audioContext || this.getAudioContext()
    this.init()
  }

  init() {
    this.setLength(0)
    // this.createVolumeNode()
    // this.createScriptNode()
    // this.createAnalyserNode()
    // this.addOnAudioProcess()
  }

  createSource() {
    this.disconnectSource()
    this.source = this.ac.createBufferSource()
    this.source.buffer = this.buffer
    this.source.connect(this.analyser)
  }

  createVolumeNode() {
    if (this.ac.createGain) {
      this.gainNode = this.ac.createGain()
    } else {
      this.gainNode = this.ac.createGainNode()
    }
    this.gainNode.connect(this.ac.destination)
  }

  play() {
    if (!this.buffer) {
      return
    }
    this.createSource()
    this.source.start(0)
  }

  pause() {
    this.source && this.source.stop(0)
  }

  disconnectSource() {
    if (this.source) {
      this.source.disconnect()
    }
  }

  createAnalyserNode() {
    this.analyser = this.ac.createAnalyser()
    this.analyser.connect(this.gainNode)
  }

  createScriptNode() {
    if (this.params.audioScriptProcessor) {
      this.scriptNode = this.params.audioScriptProcessor
    } else {
      if (this.ac.createScriptProcessor) {
        this.scriptNode = this.ac.createScriptProcessor(
          Analysis.scriptBufferSize
        )
      } else {
        this.scriptNode = this.ac.createJavaScriptNode(
          Analysis.scriptBufferSize
        )
      }
    }
    this.scriptNode.connect(this.ac.destination)
  }

  addOnAudioProcess() {
    let dom = document.querySelector('.wave-mask-wrapper')
    this.scriptNode.onaudioprocess = () => {
      let time = this.ac.currentTime
      let p = time / this.buffer.duration
      dom.style = `width: ${p * 100}%`
    }
  }
  removeOnAudioProcess() {
    this.scriptNode.onaudioprocess = null
  }

  setLength(length) {
    if (this.mergedPeaks && length === 2 * this.mergedPeaks.length - 1 + 2) {
      return
    }
    this.splitPeaks = []
    this.mergedPeaks = []
    const channels = this.buffer ? this.buffer.numberOfChannels : 1
    let c
    for (c = 0; c < channels; c++) {
      this.splitPeaks[c] = []
      this.splitPeaks[c][2 * (length - 1)] = 0
      this.splitPeaks[c][2 * (length - 1) + 1] = 0
    }
    this.mergedPeaks[2 * (length - 1)] = 0
    this.mergedPeaks[2 * (length - 1) + 1] = 0
  }

  getWidth() {
    return Math.round(this.WIDTH * this.pixelRatio)
  }

  getPeaks(buffer) {
    this.buffer = buffer
    this.setLength(this.WIDTH)
    let parentWidth = this.getWidth()
    const sampleSize = buffer.length / parentWidth
    const sampleStep = ~~(sampleSize / 10) || 1
    const first = 0
    const last = parentWidth - 1
    const channels = this.buffer.numberOfChannels
    let c
    for (c = 0; c < channels; c++) {
      const peaks = this.splitPeaks[c]
      const chan = buffer.getChannelData(c)
      let i
      for (i = first; i <= last; i++) {
        const start = ~~(i * sampleSize)
        const end = ~~(start + sampleSize)
        let min = 0
        let max = 0
        let j
        for (j = start; j < end; j += sampleStep) {
          const value = chan[j]
          if (value > max) {
            max = value
          }
          if (value < min) {
            min = value
          }
        }
        peaks[2 * i] = max
        peaks[2 * i + 1] = min
        if (c === 0 || max > this.mergedPeaks[2 * i]) {
          this.mergedPeaks[2 * i] = max
        }
        if (c === 0 || min < this.mergedPeaks[2 * i + 1]) {
          this.mergedPeaks[2 * i + 1] = min
        }
      }
    }
    this.len = this.splitChannels ? this.splitPeaks.length : this.mergedPeaks.length
    return this.splitChannels ? this.splitPeaks : this.mergedPeaks
  }
}