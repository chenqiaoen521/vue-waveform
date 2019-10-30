export default class Tween {
  animate(options) {
    clearInterval(window.timerId)
    let timerId
    const startTime = this.createTime()
    let _this = this
    let count = options.count
    let sliceWidth = options.sliceWidth
    let x = options.x
    let first = true
    let last_count
    let tick = function () {
      let remaining = Math.max(0, startTime + options.duration - _this.createTime())
      let temp = remaining / options.duration || 0
      let percent = 1 - temp
      let stop = function() {
        //停止动画
        clearInterval(timerId)
        timerId = null
      }
      if (percent === 1) {
        let currentCount = Math.floor(count * percent)
        for (let i = last_count + 1; i < currentCount + 1; i++) {
          x = options.callback(i, x, sliceWidth)
        }
        stop()
      } else {
        if (first) {
          last_count = 0
          first = false
          x = options.callback(0, x, sliceWidth)
        } else {
          let currentCount = Math.floor(count * percent)
          for (let i = last_count + 1; i < currentCount + 1; i++) {
            x = options.callback(i, x, sliceWidth)
          }
          last_count = currentCount
        }
      }
    }
    timerId = setInterval(tick, 13)
    window.timerId = timerId
  }
  createTime() {
    /* eslint-disable */
    return (+ new Date)
  }
}