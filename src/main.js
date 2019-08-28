import './css.styl'
import Vue from 'vue'
import App from './App'
import {waveform} from './vue-waveform'

Vue.use(waveform)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
