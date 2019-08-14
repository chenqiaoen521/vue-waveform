import payload from './plugin/payload'

export let _Vue
export function waveform (Vue) {
  if (waveform.installed && _Vue === Vue) return
  waveform.installed = true

  _Vue = Vue

  Vue.component('vue-waveform', payload)
}

