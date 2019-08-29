/**
 *
 *
 * @export
 * @param {*} callback
 * @param {*} delay
 * @returns
 */
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

/**
 *
 *
 * @export
 * @param {*} options
 */
export function load (options) {
  let opt = {
    url: options.url,
    type: 'get',
    data: {},
    success: options.success,
    error: options.error
  }
  if (opt.url) {
    let xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP') // eslint-disable-line
    let data = opt.data
    let url = opt.url
    let type = opt.type.toUpperCase()
    let dataArr = []
    for (let k in data) {
      dataArr.push(k + '=' + data[k])
    }
    xhr.responseType = 'arraybuffer'
    if (type === 'GET') {
      url = url + '?' + dataArr.join('&')
      xhr.open(type, url.replace(/\?$/g, ''), true)
      xhr.send()
    }
    xhr.onload = function () {
      let res = xhr.response
      if (xhr.status === 200 || xhr.status === 304 || xhr.status === 206) {
        if (opt.success && opt.success instanceof Function) {
          opt.success.call(xhr, res)
        }
      } else {
        if (opt.error && opt.error instanceof Function) {
          opt.error.call(xhr, res)
        }
      }
    }
  }
}

/**
 *
 *
 * @export
 * @param {*} dst
 * @param {*} obj
 */
export function extend (dst, obj) {
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      dst[i] = obj[i]
    }
  }
}