import {ReplaySubject} from 'rxjs'
import Store from 'utils/store.js'
import {fromPath} from 'utils/object.js'

class CustomElement extends HTMLElement {

  static define(name) {
    window.customElements.define(name, this)
  }
  
  constructor(styles = false) {
    super()
    this.root = this
    if (styles) {
      this.attachShadow({mode: 'open'})
      this.root = this.shadowRoot
      if (styles.substring) {
        const style = document.createElement('style')
        style.innerHTML = styles
        this.styles = style
        this.root.appendChild(style)
      }
    }
  }
  
  connectedCallback() {
    this._data = new WeakMap()
    this._data.set(this, {})
    this._elms = new WeakMap()
    this.props = {}
    this.streams = {}
    this.subscriptions = []
    this.paused = false
  }

  disconnectedCallback() {
    [...Object.values(this.streams)].map(stream => {
      console.log(stream)
      stream.stop$.next(false)
      delete this[stream.name]
      delete this.streams[stream.name][stream]
    })
    this.subscriptions.map(sub => {
      sub.unsubscribe()
    })
  }

  pause() {
    this.paused = true
  }

  resume() {
    this.paused = false
  }

  get elms() {
    return this._elms.get(this)
  }

  setElms(elms) {
    this._elms.set(this, elms)
  }

  data(path) {
    if (!path) {
      return this._data.get(this)
    }
    return fromPath(path, this._data.get(this))
  }
  
  find(selection) {
    return this.root.querySelector(selection)
  }

  findAll(selection) {
    return this.root.querySelectorAll(selection)
  }

  setStream(name, stream) {
    this[name] = stream
    const stop$ = new ReplaySubject(true)
    this.streams[name] = {
      name,
      stop$,
      stream: stream.takeUntil(stop$)//.do(() => console.log(this.tagName))
    }
  }

  getStream(name) {
    return this.streams[name].stream
  }

  bind(params) {
    this.subscriptions.push(
      Store.fetch(params.store).stream
        .subscribe(this.applyUpdates(params))
    )
  }

  applyUpdates(params) {
    return (data) => {
      this._data.get(this)[params.name] =
        params.filter(Store.fetch(params.store))
        this.render()
    }
  }

  template() {}

  beforeRender() {}

  rendered() {}

  childrenRendered() {}
  
  render(delay) {
    return new Promise((resolve, reject) => {
      if (delay) {
        this.delayRender(resolve)
      } else {
        this.doRender(resolve)
      }
    })
  }

  delayRender(resolve) {
    window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() => {
        this.doRender(resolve)
      })
    )
  }

  doRender(resolve) {
    this.beforeRender()
    if (!this.paused) {
      this.update = this.template()
      this.root.innerHTML = this.update
      if (this.styles) {
        this.root.appendChild(this.styles)
      }
      resolve()
    }
  }

}

export default CustomElement;
