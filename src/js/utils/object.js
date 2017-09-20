const remove = (path, data) => {
  const parts = path.split('.')
  let c = data
  let last
  let result = true
  parts.forEach((item, index) => {
    if (!c[item]) {
      result = false
      return void 0
    }
    if (index === parts.length - 1) {
      delete c[item]
    } else {
      c = c[item]
    }
  })
  return data
}

const getObj = (path, data) => {
  const parts = path.split('.')
  let c = data
  let last
  let result = true
  parts.forEach((item, index) => {
    if (!c[item]) {
      result = false
      return void 0
    }
    if (index === parts.length - 1) {
      last = item
    } else {
      c = c[item]
    }
  })
  if (result === false) {
    return false
  }
  return {obj: c, item: last}
}

/**
* Appends a nested property to the supplied object
*
* @param object data
* @param string path
* @param mixed value
* @return void
*/
const append = (path, value, data) => {
  let obj
  let key
  let c = data
  const parts = path.split('.')
  parts.forEach(part => {
    obj = c
    key = part
    if (!c[part]) {
      c[part] = {}
    }
    c = c[part]
  })
  obj[key] = value
  return data
}

/**
* Takes a . separated string and
* maps it to an object and returns the object
* relating to the path.
*
* @param data object  The object to operate on
* @param path string  The forward slash separated string
* @return object      The object found at the string path
*/
const fromPath = (path, data) => {
  if (!path) {
    return data
  }
  const parts = path.split('.')
  let c = Object.assign({}, data)
  let result = true
  parts.map(item => {
    if (!c[item]) {
      result = false
      return void 0
    }
    c = c[item]
  })
  if (result === false) {
    return false
  }
  return c
}

export {remove, append, fromPath, getObj}
export default {remove, append, fromPath, getObj}
