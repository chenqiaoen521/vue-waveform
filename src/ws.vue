<template>
  <div id="app">
    <vue-waveform v-if="isshow" ref="mycom" :range="0.5" :WIDTH="800" :HEIGHT="100" :type="type" websocketURL="ws://192.168.6.41:8081/ws/websocket/socketServer.do" :id="selectid" :arraybuffer="arraybuffer"></vue-waveform>
    插入文件<input type="file"  @change="addFile" ref="file">
    选择设备id<select v-model="selectid">
      <option :value="16">38</option>
      <option :value="2">37</option>
      <option :value="8">36</option>
    </select>
    选择类型<select v-model="type">
      <option value="line">line</option>
      <option value="bar">bar</option>
    </select>
    <button @click="load">load</button>
    <button @click="play">play</button>
    <button @click="pause">pause</button>
    <button @click="stop">stop</button>
    <button @click="show">show</button>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
  name: 'wsy',
  data() {
    return {
      selectid: 4,
      arraybuffer: undefined,
      type: 'bar',
      isshow: true
    }
  },
  methods: {
    show() {
      this.isshow = !this.isshow
    },
    addFile() {
      let myfile = this.$refs.file.files[0]
      let _this = this
      if (myfile) {
        let fileReader = new FileReader()
        fileReader.onload = function(e) {
          let fileContent = e.target.result
          _this.arraybuffer = fileContent
        }
        fileReader.readAsArrayBuffer(myfile)
      }
    },
    load() {
      this.$refs.mycom.openWS()
    },
    play() {
      this.$refs.mycom.play()
    },
    pause() {
      this.$refs.mycom.pause()
    },
    stop() {
      this.$refs.mycom.stop()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
