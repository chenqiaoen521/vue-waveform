<template>
  <div ref="wavePlayer" class="wave-player">
    <div ref="waveContainer" class="wave-container">
      <canvas ref="canvas" id="canvas"  :width="WIDTH" :height="HEIGHT"></canvas>
      <div v-show="!isLoad" ref="waveMask" class="wave-mask-wrapper"></div>
      <img v-show="isLoad" class="load" src="./loading.gif" alt="">
    </div>
    <div v-show="playType === 1" class="wave-audio">
      <audio ref="waveAudio" volume="100" preload="true" controls :src="URL"></audio>
    </div>
    <canvas v-show="playType === 2" ref="timeline" :width="WIDTH" height="38" class="wave-canvas" ondragstart="return false;"></canvas>
  </div>
</template>
<script type="text/ecmascript-6">
import Drawer from './drawer.js'
import {load} from './util'
import bus from './event'
import Media from './media'
import Timeline from './timeline'
export default {
  name: '',
  mounted() {
    this.init()
  },
  data() {
    return {
      arraybuffer: null,
      isLoad: false
    }
  },
  props: {
    URL: {
      default: '',
      type: String
    },
    range: {
      type: Number,
      default: 1
    },
    playType: {
      default: 2 // 1 audio标签 2 时间轴
    },
    openAudioContext: {
      default: true // 使用audioContext false 为使用audio 去播放
    },
    type: {
      type: String,
      default: 'line'
    },
    WIDTH: {
      default: 500
    },
    HEIGHT: {
      type: Number,
      default: 300
    },
    bgColor: {
      type: String,
      default: 'rgb(0, 0, 0)'
    },
    websocketURL: {
      type: String
    },
    id: {
      type: Number
    },
    fftSize: {
      type: Number,
      default: 256
    }
  },
  watch: {
    URL(vnew, old) {
      if (vnew === '') return
      let _this = this
      this.isLoad = true
      if (vnew !== old) {
        load({
          url: vnew,
          success: function (e) {
            _this.arraybuffer = e
            _this.myab = e.slice()
            _this.$refs.waveMask.style = 'width: 0px'
            _this.timeline && _this.timeline.clearCanvas()
          },
          error: function () {
            this.isLoad = false
          }
        })
      }
    },
    arraybuffer(vnew, old) {
      if (vnew === null) return
      if (typeof vnew === 'object') {
        this.media && this.media.stop() // 先关闭
        this.drawer && this.drawer.destory() // 先关闭
        this.buffer = this.drawer.receive(vnew)
        this.media && this.media.source && this.media.source.stop()
        let _this = this
        this.$nextTick(() => {
          _this.buffer.then(res => {
            _this.isLoad = false
            if (_this.playType === 1) {
              _this.media = new Media({media: _this.$refs.waveAudio, duration: res.duration, length: _this.WIDTH, dom: _this.$refs.waveMask, url: _this.URL})
            } else if (_this.playType === 2) {
              if (_this.openAudioContext) {
                _this.media = new Media({byteArray: res, hasAudioContext: true, length: _this.WIDTH, dom: _this.$refs.waveMask, duration: res.duration})
              } else {
                _this.media = new Media({media: new Audio(), duration: res.duration, length: _this.WIDTH, dom: _this.$refs.waveMask, url: _this.URL})
              }
            }
            _this.$emit('ready', res.duration)
          })
        })
      }
    },
    type(vnew, old) {
      if (vnew !== old) {
        this.drawer.receive = this.drawer.warpperReceive(vnew)
      }
    },
    WIDTH(vnew, old) {
      if (vnew !== old) {
        this.drawer.setWidth(vnew)
        if (Object.prototype.toString.call(this.myab) === '[object ArrayBuffer]') {
          this.media && this.media.setWidth(vnew)
          let ab = this.myab.slice()
          this.buffer = this.drawer.review(ab)
          this.isLoad = true
          bus.$off('process')
          this.buffer.then(res => {
            this.isLoad = false
            this.timeline && this.timeline.clearCanvas()
            this.$emit('ready', res.duration)
          })
        }
      }
    }
  },
  destroyed() {
    this.wsPlayer && this.wsPlayer.stop()
    this.wsPlayer = null
  },
  methods: {
    stop() {
      this.media && this.media.stop() // 先关闭
      this.drawer && this.drawer.destory() // 先关闭
    },
    seekTo(start) {
      start = start / 1000
      this.$refs.waveAudio.currentTime = start
      let p = start / this.media.getDuration()
      this.$refs.waveMask.style = `width: ${this.WIDTH * p}px`
      if (this.media.isPaused()) {
        this.media.play()
      }
    },
    init() {
      let canvasCtx = this.$refs.canvas.getContext('2d')
      let {WIDTH, HEIGHT, range, fftSize, type, bgColor} = this
      this.drawer = new Drawer({
        canvasCtx,
        WIDTH,
        HEIGHT,
        range,
        fftSize,
        type,
        bgColor
      })
      this.addEvent()
    },
    addEvent() {
      let _this = this
      this.$refs.wavePlayer.style = `width: ${this.WIDTH}px;height: ${this.HEIGHT + 38}px;`
      this.$on('ready', function (e) {
        if (_this.playType === 2) {
          _this.timeline = new Timeline({
            canvas: this.$refs.timeline,
            hours_per_ruler: e / 3600,
            sec_per_my: e
          })
          bus.$on('process', function (e) {
            let event = {}
            event.pageX = e
            _this.timeline.mousemoveFunc(event)
          })
        }
        this.$refs.waveContainer.addEventListener('click', function (e) {
          let pos = e.clientX - this.getBoundingClientRect().left
          if (_this.openAudioContext) {
            if (_this.media.isPaused()) {
              _this.$refs.waveMask.style = `width: ${pos}px`
            }
          } else {
            if (_this.media.isStop) {
              _this.$refs.waveMask.style = `width: ${pos}px`
            }
            _this.media.params.media.currentTime = (pos / _this.WIDTH) * _this.media.getDuration()
          }
        }, false)
      })
      bus.$on('sourceEnded', function () {
        _this.arraybuffer = null
      })
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.wave-container
  position relative
  .load
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
  .wave-mask-wrapper
    position absolute
    top 0
    left 0
    bottom 0
    width 0
    border-right 1px solid red
    background rgba(172, 181, 176, 0.5)
.wave-audio
  width 100%
  height 40px
  pos
  audio
    width 100%
    height 100%
.wave-canvas
  cursor: pointer;
  border:1px solid #2b2f33;
  background-color: #2b2f33;
</style>