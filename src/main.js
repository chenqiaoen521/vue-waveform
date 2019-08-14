import Vue from 'vue'
import App from './App'

import {install} from './install'

Vue.use(install)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
