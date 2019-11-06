<template>
  <div id="app">
    <select v-model="web">
      <option value ="./static/1.aac">./static/1.aac</option>
      <option value ="./static/3.aac">./static/3.aac</option>
      <option value ="./static/4.aac">./static/4.aac</option>
      <option value ="./static/2866.aac">./static/2866.aac</option>
    </select>
    <button @click="getsound">click me</button>
    <audio ref="waveAudio" :src="web"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import { getBytes } from './test/decode'
import {load} from './plugin/util'
export default {
  name: 'app',
  data() {
    return {
      web: null
    }
  },
  mounted() {
    this.web = './static/1.aac'
  },
  methods: {
    getsound() {
      let _this = this
      load({
        url: this.web,
        success: function (e) {
          _this.$refs.waveAudio.src = _this.web
          _this.$refs.waveAudio.oncanplay = function () {
            console.log('canplay= ' + this.duration)
          }
          getBytes(e)
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
