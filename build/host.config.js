exports.config = {
  headers: {
    'Content-Type': 'application/octet-stream;charset:utf-8',
    'Content-Disposition': 'form-data'
  },
  transformRequest: [function (data) {
    let formData = new FormData()
    formData.append('jsoninfo', JSON.stringify(data))
    return formData
  }]
}
exports.config2 = {
  headers: {
    'Content-Type': 'application/octet-stream;charset:utf-8',
    'Content-Disposition': 'form-data'
  }
}
exports.config3 = {
  headers: {
    'Content-Type': 'application/octet-stream;charset:utf-8',
    'Content-Disposition': 'form-data'
  },
  transformRequest: [function (data) {
    let formData = new FormData()
    formData.append('file', data.file)
    delete data.file
    formData.append('jsoninfo', JSON.stringify(data))
    return formData
  }]
}
