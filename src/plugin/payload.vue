<template>
  <div>
    <canvas ref="canvas" id="canvas" :width="WIDTH" :height="HEIGHT"></canvas>
  </div>
</template>
<script type="text/ecmascript-6">
import Drawer from './drawer.js'
import WsPlayer from './websocket.js'
import Mse from './mse.js'
export default {
  name: '',
  mounted() {
    this.init()
  },
  props: {
    range: {
      type: Number,
      default: 1
    },
    type: {
      type: String,
      default: 'bar'
    },
    WIDTH: {
      type: Number,
      default: 500
    },
    HEIGHT: {
      type: Number,
      default: 300
    },
    arraybuffer: {
      type: ArrayBuffer
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
    arraybuffer(vnew, old) {
      if (typeof vnew === 'object') {
        this.drawer.receive(vnew)
      }
    },
    type(vnew, old) {
      if (vnew !== old) {
        this.drawer.receive = this.drawer.warpperReceive(vnew)
      }
    }
  },
  methods: {
    openWS() {
      this.wsPlayer.openWs(this.websocketURL, this.id)
    },
    play() {
      this.wsPlayer.play()
    },
    pause() {
      this.wsPlayer.pause()
    },
    stop() {
      this.wsPlayer.stop()
    },
    init() {
      let canvasCtx = this.$refs.canvas.getContext('2d')
      let {WIDTH, HEIGHT, range, fftSize, type} = this
      this.drawer = new Drawer({
        canvasCtx,
        WIDTH,
        HEIGHT,
        range,
        fftSize,
        type
      })
      this.wsPlayer = new WsPlayer({
        Mse: new Mse(),
        Drawer: this.drawer
      })
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>