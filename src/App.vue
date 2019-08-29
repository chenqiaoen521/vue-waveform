<template>
  <div id="app">
    <vue-waveplayer @ready=ready ref="mycom" :range="0.1" :WIDTH="rangeV" :HEIGHT="100" bgColor="#fff" :type="type" :URL="web" :id="selectid" ></vue-waveplayer>
    <h1>1111</h1>
    <input type="text" v-model="timeline">
    <button @click="click">seek</button>
    <div style="margin-top: 100px;">
      <canvas ref="timeline" width="800" height="62" style="cursor: pointer;border:1px solid #2b2f33;background-color: #2b2f33;"  ondragstart="return false;"></canvas>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Timeline from './plugin/timeline'
export default {
  name: 'app',
  data() {
    return {
      timeline: '25000',
      selectid: 8082,
      web: '',
      arraybuffer: undefined,
      type: 'line',
      rangeV: 800
    }
  },
  mounted() {
    this.web = './static/1.aac'
    this.t = new Timeline({
      canvas: this.$refs.timeline
    })
  },
  methods: {
    click() {
      this.$refs.mycom.seekTo(this.timeline)
    },
    ready() {
      this.$refs.mycom.seekTo(this.timeline)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
