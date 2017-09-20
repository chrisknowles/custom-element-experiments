import {Observable, BehaviorSubject} from 'rxjs'
import {isEqual} from 'lodash-fp'
import {append} from './object.js'

const store = {}
const subjects = {}

const mapSort = name => (path, sortField) => {
  const s = get(name)(path)
  const map = new Map([...s.entries()].sort((a, b) => {
    if (a[1][sortField].toLowerCase() < b[1][sortField].toLowerCase()) {
      return -1
    }
    if (a[1][sortField].toLowerCase() > b[1][sortField].toLowerCase()) {
      return 1
    }
    return 0
  }))
  set(name)(path, map)
}

const mapSet = name => (path, key, val) => {
  const map = get(name)(path)
  const current = map.get(key)
  if (!isEqual(current, val)) {
    map.set(key, val)
    set(name)(path, map)
    return true
  }
  return false
}

const mapGet = name => (path, key = false) => {
  const map = get(name)(path)
  if (!key) {
    return map
  }
  if (map) {
    const item = map.get(key)
    if (item) {
      return item
    }
  }
  return false
}

const mapDelete = name => (path, key) => {
  const map = get(name)(path)
  if (map) {
    map.delete(key)
    return true
  }
  return false
}

const map = name => ({
    set: mapSet(name)
  , get: mapGet(name)
  , delete: mapDelete(name)
  , sort: mapSort(name)
})

function addPath(subs, ...path) {
  const add = (a, b) => {
    return !a[b] ? (a[b] = {}) : a[b]
  }
  path.map(p => {
    subs = add(subs, p)
  })
}

const set = name => (path, val) => {
  append(name + '.' + path, val, store)
}

const remove = name => key => {
  delete store[name].data[key]
}

const destroy = name => {
  delete store[name]
}

const get = name => (path) => {
  if (!path) {
    return store[name]
  }
  let obj = Object.assign({}, store[name])
  let success = true
  path.split('.').map(p => {
    if (success) {
      if (!obj[p]) {
        success = false
      } else {
        obj = obj[p]
      }
    }
  })
  return success ? obj : false
}

const update = name => () => {
  subjects[name].next(get(name)())
  if (window.__debug) {
    console.info(name.toUpperCase() + ' store updated')
    console.log(get(name)())
  }
}

const delayUpdate = name => (milliseconds) => {
  setTimeout(() => {
    update(name)()
  }, milliseconds)
}

function logCreateWarnings(name) {
  console.warn('Store name "' + name + '" already exists')
  console.warn('--- existing ---')
  console.info(Object.assign({}, get(name)()))
  console.warn('--- overwriting with ---')
  console.info(get(name)())
}

function Store(name, data = {}) {
  if (store[name]) {
    logCreateWarnings(name)
  }
  store[name] = data
  subjects[name] = new BehaviorSubject(data)
  return Store.fetch(name)
}

Store.fetch = function fetch(name) {
  return {
      get: get(name)
    , set: set(name)
    , remove: remove(name)
    , update: update(name)
    , delayUpdate: delayUpdate(name)
    , map: map(name)
    , stream: subjects[name].asObservable()
  }
}

export default Store
