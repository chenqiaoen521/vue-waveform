<template>
  <div id="app">
    <div v-show="isshow">
      <vue-waveplayer  @ready=ready ref="mycom" :range="0.4" :WIDTH="rangeV" :HEIGHT="100" bgColor="#fff" :type="type" :playType="playtype" :URL="web"  ></vue-waveplayer>
    </div>
    <h1>1111</h1>
     <h1>1111</h1>
      <h1>1111</h1>
       <h1>1111</h1>
        <h1>1111</h1>
         <h1>1111</h1>
    <select v-model="web">
      <option value ="./static/1.aac">./static/1.aac</option>
      <option value ="./static/3.aac">./static/3.aac</option>
      <option value ="./static/4.aac">./static/4.aac</option>
    </select>
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
      isshow: false,
      selectid: 8082,
      web: '',
      arraybuffer: undefined,
      type: 'line',
      rangeV: 800,
      playtype: 2
    }
  },
  mounted() {
    // this.web = './static/1.aac'
  },
  methods: {
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
