<template>
  <div ref="wavePlayer" class="wave-player">
    <div ref="waveContainer" class="wave-container">
      <canvas ref="canvas" id="canvas"  :width="WIDTH" :height="HEIGHT"></canvas>
      <div  ref="waveMask" class="wave-mask-wrapper"></div>
      <img v-show="isLoad" class="load" src="./loading.gif" alt="">
    </div>
    <div class="wave-audio">
      <audio ref="waveAudio" volume="100" preload="true" controls :src="URL"></audio>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import Drawer from './drawer.js'
import {load} from './util'
import Media from './media'
export default {
  name: '',
  mounted() {
    this.init()
    let _this = this
    this.$refs.wavePlayer.style = `width: ${this.WIDTH}px;height: ${this.HEIGHT + 40}px;`
    this.$on('ready', function () {
      this.$refs.waveContainer.addEventListener('click', function (e) {
        let pos = e.clientX - this.getBoundingClientRect().left
        if (_this.media.isPaused()) {
          _this.$refs.waveMask.style = `width: ${pos}px`
        }
        _this.$refs.waveAudio.currentTime = (pos / _this.WIDTH) * _this.media.getDuration()
      }, false)
    })
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
      let _this = this
      if (vnew !== old) {
        this.isLoad = true
        load({
          url: vnew,
          success: function (e) {
            _this.arraybuffer = e
          }
        })
      }
    },
    arraybuffer(vnew, old) {
      if (typeof vnew === 'object') {
        this.buffer = this.drawer.receive(vnew)
        let _this = this
        this.$nextTick(() => {
          _this.buffer.then(res => {
            _this.isLoad = false
            _this.media = new Media({media: _this.$refs.waveAudio, duration: res.duration, length: _this.WIDTH, dom: _this.$refs.waveMask})
            _this.$emit('ready')
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
      }
    }
  },
  destroyed() {
    this.wsPlayer && this.wsPlayer.stop()
    this.wsPlayer = null
  },
  methods: {
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
</style>