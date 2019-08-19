export let extend = function (dst, obj) {
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      dst[i] = obj[i]
    }
  }
}

export function debounce (callback, delay) {
  let timer = null
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function () {
      callback.apply(this, args)
    }, delay)
  }
}