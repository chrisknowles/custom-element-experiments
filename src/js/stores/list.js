import Store from 'utils/store.js'

const store = Store('list', {
  current: null,
  list: [1, 2, 3]
})

setTimeout(() => {
  store.set('list', [1,3,5,6])
  store.update()
}, 2000)

export default store
