export let extend = function (dst, obj) {
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      dst[i] = obj[i]
    }
  }
}