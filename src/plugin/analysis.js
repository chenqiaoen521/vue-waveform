export default class Analysis {
  constructor (options) {
    this.WIDTH = options.WIDTH
    this.init()
    this.pixelRatio = 1
  }

  init() {
    this.setLength(0)
  }

  setLength(length) {
    if (this.mergedPeaks && length === 2 * this.mergedPeaks.length - 1 + 2) {
      return
    }
    this.splitPeaks = []
    this.mergedPeaks = []
    const channels = 1
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
    this.setLength(this.WIDTH)
    let parentWidth = this.getWidth()
    const sampleSize = buffer.length / parentWidth
    const sampleStep = ~~(sampleSize / 10) || 1
    const first = 0
    const last = parentWidth
    const channels = 1
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