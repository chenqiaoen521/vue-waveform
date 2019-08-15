# vue-waveform 如何使用


### 安装

-全局引入安装-
* import {waveform} from './vue-waveform' 
* Vue.use(waveform)


### 使用说明

#### 组件的使用 全局引入的组件
 
#####  vue-waveform

* <vue-waveform ref="mycom" :range="0.6" :WIDTH="800" :HEIGHT="100" websocketURL="ws://192.168.6.48:8082/ws/websocket/socketServer.do" :id="selectid" :arraybuffer="arraybuffer"></vue-waveform> 

##### props 属性：
* WIDTH  宽度
* HEIGHT  高度
* websocketURL websock连接
* id 设备id
* range 柱状图高度显示的比率
* arraybuffer 字节数组