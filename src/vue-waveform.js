import payload from './plugin/payload'
import waveplayer from './plugin/waveplayer'

export let _Vue
export function waveform (Vue) {
  if (waveform.installed && _Vue === Vue) return
  waveform.installed = true

  _Vue = Vue

  Vue.component('vue-waveform', payload)
  Vue.component('vue-waveplayer', waveplayer)
}

