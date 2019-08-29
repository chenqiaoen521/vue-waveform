import {extend} from './util'

export default class Timeline {
  params = {
    canvas: undefined,
    ctx: undefined,
    canvasW: 0,
    canVansH: 0,
    timecell: undefined,
    minutes_per_step: [1, 2, 5, 10, 15, 20, 30, 60, 120, 180, 240, 360, 720, 1440], // min/格
    graduation_step: 20, //刻度间最小宽度，单位px
    hours_per_ruler: 24, //时间轴显示24小时
    start_timestamp: new Date().getTime() - 12 * 60 * 60 * 1000,
    distance_between_gtitle: 80,
    zoom: 24,
    g_isMousedown: false, //拖动mousedown标记
    g_isMousemove: false, //拖动mousemove标记
    g_mousedownCursor: null, //拖动mousedown的位置
    returnTime: null, //mouseup返回时间
    on_before_click_ruler_callback: null
  }

  constructor(options) {
    extend(this.params, options)
    if (this.params.canvas) {
      this.params.ctx = this.params.canvas.getContext('2d')
      this.params.canvasW = this.params.canvas.width
      this.params.canVansH = this.params.canvas.height
    }
    extend(this, this.params)
    this.init(this.start_timestamp, this.timecell, false)
  }

  /**
   *
   *
   * @param {*} start_left_timestamp
   * @param {*} time_cell
   * @param {*} redraw_flag
   * @memberof Timeline
   */
  init(start_left_timestamp, time_cell, redraw_flag) {
    this.draw_cell_bg()
    this.add_graduations(start_left_timestamp)
    this.add_cells(time_cell)
    this.drawLine(0, this.canVansH, this.canvasW, this.canVansH, `rgb(151, 158, 167)`, 1) //底线
    this.drawLine(this.canvasW / 2, 0, this.canvasW / 2, 33, `rgb(64, 196, 255)`, 2) //中间播放点时间线
    if (!redraw_flag) { //只有第一次进入才需要添加事件
      this.add_events()
    }
    let time = start_left_timestamp + (this.hours_per_ruler * 3600 * 1000) / 2
    this.ctx.fillStyle = `rgb(64, 196, 255)`
    this.ctx.fillText(this.changeTime(time), this.canvasW / 2 - 60, 50)
  }

  draw_cell_bg() {
    this.ctx.fillStyle = `rgba(69, 72, 76, 0.5)`
    this.ctx.fillRect(0, 0, this.canvasW, 15)
  }

  /**
   *
   *
   * @param {*} start_left_timestamp
   * @memberof Timeline
   */
  add_graduations(start_left_timestamp) {
    let px_per_min = this.canvasW / (this.hours_per_ruler * 60) // px/min
    let px_per_ms = this.canvasW / (this.hours_per_ruler * 60 * 60 * 1000) // px/ms
    let px_per_step = this.graduation_step  // px/格 默认最小值20px
    let min_per_step = px_per_step / px_per_min // min/格
    for (let i = 0; i < this.minutes_per_step.length; i++) {
      if (min_per_step <= this.minutes_per_step[i]) { //让每格时间在minutes_per_step规定的范围内
        min_per_step = this.minutes_per_step[i]
        px_per_step = px_per_min * min_per_step
        break
      }
    }

    let medium_step = 30
    for (let i = 0; i < this.minutes_per_step.length; i++) {
      if (this.distance_between_gtitle / px_per_min <= this.minutes_per_step[i]) {
        medium_step = this.minutes_per_step[i]
        break
      }
    }
    let num_steps = this.canvasW / px_per_step //总格数
    let graduation_left
    let graduation_time
    let lineH
    let ms_offset = this.ms_to_next_step(start_left_timestamp, min_per_step * 60 * 1000) //开始的偏移时间 ms
    let px_offset = ms_offset * px_per_ms //开始的偏移距离 px
    let ms_per_step = px_per_step / px_per_ms // ms/step
    for (let i = 0; i < num_steps; i++) {
      graduation_left = px_offset + i * px_per_step // 距离=开始的偏移距离+格数*px/格
      graduation_time = start_left_timestamp + ms_offset + i * ms_per_step //时间=左侧开始时间+偏移时间+格数*ms/格
      let date = new Date(graduation_time)
      if (date.getUTCHours() === 0 && date.getUTCMinutes() === 0) {
        lineH = 25
        let big_date = this.graduation_title(date)
        this.ctx.fillText(big_date, graduation_left - 20, 30)
        this.ctx.fillStyle = `rgba(151,158,167,1)`
      } else if (graduation_time / (60 * 1000) % medium_step === 0) {
        lineH = 15
        let middle_date = this.graduation_title(date)
        this.ctx.fillText(middle_date, graduation_left - 20, 30)
        this.ctx.fillStyle = `rgba(151,158,167,1)`
      } else {
        lineH = 10
      }
      this.drawLine(graduation_left, 0, graduation_left, lineH, `rgba(151,158,167,1)`, 1)
    }
  }

  /**
   *
   *
   * @param {*} beginX
   * @param {*} beginY
   * @param {*} endX
   * @param {*} endY
   * @param {*} color
   * @param {*} width
   * @memberof Timeline
   */
  drawLine(beginX, beginY, endX, endY, color, width) {
    this.ctx.beginPath()
    this.ctx.moveTo(beginX, beginY)
    this.ctx.lineTo(endX, endY)
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = width
    this.ctx.stroke()
  }

  add_cells(cells) {
    if (Array.isArray(cells)) {
      cells.forEach(cell => {
        this.draw_cell(cell)
      })
    }
  }

  draw_cell(cell) {
    let px_per_ms = this.canvasW / (this.hours_per_ruler * 60 * 60 * 1000) // px/ms
    let beginX = (cell.beginTime - this.start_timestamp) * px_per_ms
    let cell_width = (cell.endTime - cell.beginTime) * px_per_ms
    this.ctx.fillStyle = cell.style.background
    this.ctx.fillRect(beginX, 0, cell_width, 15)
  }

  add_events() {
    if (this.canvas.addEventListener) {
      this.canvas.addEventListener('mousewheel', this.mousewheelFunc.bind(this))
      this.canvas.addEventListener('mousedown', this.mousedownFunc.bind(this))
      this.canvas.addEventListener('mousemove', this.mousemoveFunc.bind(this))
      this.canvas.addEventListener('mouseup', this.mouseupFunc.bind(this))
      this.canvas.addEventListener('mouseout', this.mouseoutFunc.bind(this))
    }
  }

  /**
   *
   *
   * @param {*} e
   * @memberof Timeline
   */
  mousedownFunc(e) {
    this.g_isMousedown = true
    this.g_mousedownCursor = this.get_cursor_x_position(e) //记住mousedown的位置
  }

  /**
   *
   *
   * @param {*} e
   * @memberof Timeline
   */
  mousemoveFunc(e) {
    let pos_x = this.get_cursor_x_position(e)
    let px_per_ms = this.canvasW / (this.hours_per_ruler * 60 * 60 * 1000) // px/ms
    this.clearCanvas()
    if (this.g_isMousedown) {
      let diff_x = pos_x - this.g_mousedownCursor
      this.start_timestamp = this.start_timestamp - Math.round(diff_x / px_per_ms)
      this.init(this.start_timestamp, this.timecell, true)
      this.g_isMousemove = true
      this.g_mousedownCursor = pos_x
    } else {
      let time = this.start_timestamp + pos_x / px_per_ms
      this.init(this.start_timestamp, this.timecell, true)
      this.drawLine(pos_x, 0, pos_x, 50, `rgb(194, 202, 215)`, 1)
      this.ctx.fillStyle = `rgb(194, 202, 215)`
      this.ctx.fillText(this.changeTime(time), pos_x - 50, 60)
    }
  }

  /**
   *
   *
   * @param {*} e
   * @memberof Timeline
   */
  mouseupFunc(e) {
    if (this.g_isMousemove) { //拖动 事件
      this.g_isMousemove = false
      this.g_isMousedown = false
      this.returnTime = this.start_timestamp + (this.hours_per_ruler * 3600 * 1000) / 2
    } else { // click 事件
      this.g_isMousedown = false
      let posx = this.get_cursor_x_position(e) //鼠标距离 px
      let ms_per_px = (this.zoom * 3600 * 1000) / this.canvasW // ms/px
      this.returnTime = this.start_timestamp + posx * ms_per_px
      this.set_time_to_middle(this.returnTime)
    }
  }

  /**
   *
   *
   * @param {*} e
   * @memberof Timeline
   */
  mouseoutFunc(e) {
    this.clearCanvas()
    this.init(this.start_timestamp, this.timecell, true)
  }

  /**
   *
   *
   * @param {*} e
   * @returns
   * @memberof Timeline
   */
  mousewheelFunc(e) {
    if (e && e.preventDefault) {
      e.preventDefault()
    } else {
      window.event.returnValue = false
      return false
    }

    let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)))
    let middle_time = this.start_timestamp + (this.hours_per_ruler * 3600 * 1000) / 2 //ms 记住当前中间的时间
    if (delta < 0) {
      this.zoom = this.zoom + 4
      if (this.zoom >= 24) {
        this.zoom = 24 //放大最大24小时
      }
      this.hours_per_ruler = this.zoom
    } else if (delta > 0) { // 放大
      this.zoom = this.zoom - 4
      if (this.zoom <= 1) {
        this.zoom = 1 //缩小最小1小时
      }
      this.hours_per_ruler = this.zoom
    }
    this.clearCanvas()
    this.start_timestamp = middle_time - (this.hours_per_ruler * 3600 * 1000) / 2 //start_timestamp = 当前中间的时间 - zoom/2
    this.init(this.start_timestamp, this.timecell, true)
  }

  /**
   *
   *
   * @param {*} e
   * @returns
   * @memberof Timeline
   */
  get_cursor_x_position(e) {
    let posx = 0
    if (!e) {
      e = window.event
    }
    if (e.pageX || e.pageY) {
      posx = e.pageX
    } else if (e.clientX || e.clientY) {
      posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
    }
    return posx
  }

  /**
   *
   *
   * @param {*} datetime
   * @returns datetime
   * @memberof Timeline
   */
  graduation_title(datetime) {
    if (datetime.getHours() === 0 && datetime.getMinutes() === 0 && datetime.getMilliseconds() === 0) {
      return ('0' + datetime.getDate().toString()).substr(-2) + '.' + ('0' + (datetime.getMonth() + 1).toString()).substr(-2) + '.' + datetime.getFullYear()
    }
    return datetime.getHours() + ':' + ('0' + datetime.getMinutes().toString()).substr(-2)
  }

  /**
   *
   *
   * @param {*} time
   * @returns
   * @memberof Timeline
   */
  changeTime(time) {
    let newTime = new Date(time)
    let year = newTime.getFullYear()
    let month = newTime.getMonth() + 1
    if (month < 10) {
      let month = '0' + month
    }
    let date = newTime.getDate()
    if (date < 10) {
      let date = '0' + date
    }
    let hour = newTime.getHours()
    if (hour < 10) {
      let hour = '0' + hour
    }
    let minute = newTime.getMinutes()
    if (minute < 10) {
      let minute = '0' + minute
    }
    let second = newTime.getSeconds()
    if (second < 10) {
      let second = '0' + second
    }
    return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
  }

  /**
   *
   *
   * @param {*} timestamp
   * @param {*} step
   * @returns
   * @memberof Timeline
   */
  ms_to_next_step(timestamp, step) {
    let remainder = timestamp % step
    return remainder ? step - remainder : 0
  }

  /**
   *
   *
   * @param {*} time
   * @memberof Timeline
   */
  set_time_to_middle(time) {
    this.clearCanvas()
    this.start_timestamp = time - (this.hours_per_ruler * 60 * 60 * 1000) / 2
    this.init(this.start_timestamp, this.timecell, true)
  }

  /**
   *
   *
   * @param {*} callback
   * @memberof Timeline
   */
  returnMouseupTime(callback) {
    if (this.returnTime) {
      if (callback) {
        callback.call(this, this.returnTime)
      }
    }
  }

  /**
   *
   *
   * @memberof Timeline
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, 1500, 150)
  }
}