# Usage


### install

* npm -i vue-waveform


* import {waveform} from 'vue-waveform' 
* Vue.use(waveform)


### Instructions

#### scene
websocket arraybuffer file mp3 aac blob arraybuffer

#### 组件的使用 全局引入的组件
 
#####  vue-waveform
```
<vue-waveform ref="mycom" :range="0.6" :WIDTH="800" :HEIGHT="100" websocketURL="ws://192.168.6.48:8082/ws/websocket/socketServer.do" :id="selectid" :arraybuffer="arraybuffer"></vue-waveform> 
```

![效果](https://github.com/chenqiaoen521/vue-waveform/blob/master/example.png)

![效果2](https://github.com/chenqiaoen521/vue-waveform/blob/master/ex2.png)

##### props
* WIDTH  宽度 动态改变宽度
* HEIGHT  高度
* websocketURL websock连接
* id 设备id
* type 类型  'line' 曲线图 'bar' 柱状图
* range 柱状图高度显示的比率
* arraybuffer 字节数组
* bgColor 波形图背景色

##### method：

* openWS() // 无参数 创建连接初始化对象  支持promise接口调用 
* play() // 无参数 播放
* pause() // 无参数 暂停
* stop() // 无参数 停止 并销毁对象 支持promise接口调用

调用方式 例如： 
```
this.$refs.mycom.openWS()
```


#### scene
### audioplayer
##### audioUI：
![效果3](https://github.com/chenqiaoen521/vue-waveform/blob/master/ex3.png)
##### timelineUI:
![效果3](https://github.com/chenqiaoen521/vue-waveform/blob/master/ex4.png)

```
import {waveform} from 'vue-waveform'
import 'vue-waveform/dist/static/css/app.css'

<vue-waveplayer @ready=ready :range="0.3" ref="mycom" :WIDTH="800" :HEIGHT="100" bgColor="#fff" :URL="URL"></vue-waveplayer>

```
##### props ：
* WIDTH  宽度 
* HEIGHT  高度
* range 高度显示的比率
* bgColor 波形图背景色
* playType 1.是audio标签 2.是 时间轴
* URL 播放文件地址

##### method 方法：
* stop  参数 无
* seekTo 参数 毫秒
```
mounted() {
  this.URL = './static/3.aac'
},
  methods: {
    click() {
      this.$refs.mycom.seekTo(this.timeline)
    },
    ready() {
      this.$refs.mycom.seekTo(this.timeline)
    }
  }

```