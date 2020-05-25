<template>
  <div id="app">
    <div v-show="isshow">
      <vue-waveplayer @updateTimeEnded="updateTimeEnded"  @ready=ready ref="mycom" :range="0.1" :openAudioContext="false" :WIDTH="rangeV" :HEIGHT="60" bgColor="#fff" :playType="playtype" :URL="URL"  ></vue-waveplayer>
    </div>
     <button @click="stop1">stop</button>
     <button @click="pause">pause</button>
    <select v-model="web">
      <option value ="./static/1.aac">./static/1.aac</option>
      <option value ="./static/3.aac">./static/3.aac</option>
      <option value ="./static/4.aac">./static/4.aac</option>
      <option value ="./static/2866.aac">./static/2866.aac</option>
      <option value ="./static/ppp.aac">./static/ppp.aac</option>
      <option value ="http://192.168.6.41:8081/api/audio/dataFile/14946">14946</option>
    </select>
    <div style="height: 300px"></div>
    <button @click="attack">点击切换音频地址</button>
    <button @click="stop">点击关闭音频地址</button>
    <input type="range" v-model="inputV" @change="change" max=1900 min=500>
    <button @click="click">点击显示音频插件</button>
    <div>
      <wsy></wsy>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import wsy from './ws'
export default {
  name: 'app',
  components: {
    wsy
  },
  data() {
    return {
      isshow: true,
      selectid: 8082,
      web: '',
      arraybuffer: undefined,
      type: 'line2',
      rangeV: 1255,
      inputV: 0,
      playtype: 2,
      URL: ''
    }
  },
  methods: {
    pause() {
      this.$refs.mycom.pause()
    },
    stop1() {
      this.$refs.mycom.stop()
    },
    updateTimeEnded(e) {
      console.log(e)
    },
    attack() {
      this.URL = this.web
    },
    stop() {
      this.$refs.mycom.stop()
    },
    change(e) {
      this.rangeV = this.inputV
      this.$nextTick(() => {
        this.$refs.mycom.init()
      })
    },
    click() {
      this.isshow = true
      this.web = './static/1.aac'
    },
    ready() {
      // this.$refs.mycom.seekTo(this.timeline)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
