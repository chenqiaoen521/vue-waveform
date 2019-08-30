import {extend} from './util'

export default class TimeAxis {

  params = {
    canvas: undefined,
    ctx: undefined,
    canvasW: 0,
    canVansH: 0
  }

  constructor(options) {
    extend(this.params, options)
    if (this.params.canvas) {
      this.params.ctx = this.params.canvas.getContext('2d')
      this.params.canvasW = this.params.canvas.width
      this.params.canVansH = this.params.canvas.height
    }
    extend(this, this.params)
  }

  drawLine(beginX, beginY, endX, endY, color, width) {
    this.ctx.beginPath()
    this.ctx.moveTo(beginX, beginY)
    this.ctx.lineTo(endX, endY)
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = width
    this.ctx.stroke()
  }

}