<template>
  <div id="app">
    <vue-waveform ref="mycom" :range="0.5" :WIDTH="800" :HEIGHT="100" :type="type" websocketURL="ws://192.168.6.48:8082/ws/websocket/socketServer.do" :id="selectid" :arraybuffer="arraybuffer"></vue-waveform>
    插入文件<input type="file"  @change="addFile" ref="file">
    选择设备id<select v-model="selectid">
      <option value="8084">8084</option>
      <option value="8082">8082</option>
    </select>
    选择类型<select v-model="type">
      <option value="line">line</option>
      <option value="bar">bar</option>
    </select>
    <button @click="load">load</button>
    <button @click="play">play</button>
    <button @click="pause">pause</button>
    <button @click="stop">stop</button>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
  name: 'app',
  data() {
    return {
      selectid: 8082,
      arraybuffer: undefined,
      type: 'bar'
    }
  },
  methods: {
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
