# vue-waveform 如何使用


### 安装

* import {waveform} from './vue-waveform'
* Vue.use(waveform)


### 使用说明

* <vue-waveform ref="mycom" :range="0.6" :WIDTH="800" :HEIGHT="100" websocketURL="ws://192.168.6.48:8082/ws/websocket/socketServer.do" :id="selectid" :arraybuffer="arraybuffer"></vue-waveform> 组件全局引入

* WIDTH  宽度
* HEIGHT  高度
* websocketURL websock连接
* range 柱状图高度显示的比率
* arraybuffer 字节数组