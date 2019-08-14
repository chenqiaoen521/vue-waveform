<template>
  <div id="app">
    <waveform ref="mycom" :range="0.6" :WIDTH="800" :HEIGHT="100" websocketURL="ws://192.168.6.48:8082/ws/websocket/socketServer.do" :id="selectid" :arraybuffer="arraybuffer"></waveform>
    <input type="file"  @change="addFile" ref="file">插入文件
    <select v-model="selectid">
      <option value="8084">8084</option>
      <option value="8082">8082</option>
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
      arraybuffer: undefined
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
