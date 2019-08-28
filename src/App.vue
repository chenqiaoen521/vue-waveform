<template>
  <div id="app">
    <vue-waveplayer @ready=ready ref="mycom" :range="0.5" :WIDTH="rangeV" :HEIGHT="100" bgColor="#fff" :type="type" :URL="web" :id="selectid" ></vue-waveplayer>
    <h1>1111</h1>
    <input type="text" v-model="timeline">
    <button @click="click">seek</button>
  </div>
</template>

<script type="text/ecmascript-6">
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
    this.web = './static/3.aac'
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
