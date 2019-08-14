export default class WsPlayer {
  constructor(options) {
    if (typeof options.Mse !== 'object') {
      console.log('MSE is not a object')
    }
    if (typeof options.Drawer !== 'object') {
      console.log('drawer is not a object')
    }
    this.mse = options.Mse
    this.drawer = options.Drawer
    this.frames = 0
    this.buffer = []
  }
  openWs(url, id, name, socketUrl = '/ws/websocket/socketServer.do') {
    if (!url.startsWith('ws://')) {
      url = 'ws://' + url + socketUrl
    }
    let self = this
    let ws = new WebSocket(url)
    self.ws = ws
    self.id = id
    ws.binaryType = 'arraybuffer'
    ws.onopen = function() {
      console.log('-- WebSocket is opened! --')
      console.log(`-- LISTEN id : ${id}`)
    }
    ws.onmessage = function (event) {
      if (Object.prototype.toString.call(event.data) === '[object ArrayBuffer]') {
        self.mse.appendBuffer(event.data)
        let array = Array.prototype.slice.call(new Uint8Array(event.data))
        self.buffer.push.apply(self.buffer, array)
        self.frames ++
        if (self.frames > 3) {
          var file = new Uint8Array(self.buffer).buffer
          self.drawer.receive(file)
          self.frames = 0
          self.buffer.length = 0
        }
      }
    }
  }
  play() {
    this.ws && this.ws.send('LISTEN:' + this.id)
    this.mse.play()
  }
  pause() {
    this.mse.pause()
    this.ws && this.ws.send('STOP_LISTEN')
  }
  stop() {
    this.ws && this.ws.send('STOP_LISTEN')
    this.ws && this.ws.close()
    this.pause()
  }
}