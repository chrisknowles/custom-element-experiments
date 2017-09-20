import {Subject} from 'rxjs'
import CustomElement from 'utils/custom-element.js'
import {SnabbdomPatch} from 'utils/snabbdom-ext.js'

// gets children that are custom elements
const getChildren =  (elm) => {
  let customChildren = []
  const map = (elm) => 
    [...elm.children].map(child => {
      if (child.tagName.match(/-/)) {
        customChildren.push(child)
      } else if (child.children) {
        map(child)
      }
    })
  map(elm)
  return customChildren
}

class SnabbdomElement extends CustomElement {
  
  constructor(styles = false) {
    super(styles)
    this.loaded$ = new Subject()
  }

  async connectedCallback() {
    super.connectedCallback()
    this.tmp = document.createElement('tmp')
    this.root.appendChild(this.tmp)
    this.current = this.root.querySelector('tmp')
    await this.beforeRender()
    await this.render()
    const children = getChildren(this.root)
    if (children.length) {
      let loaded = children.length
      children.map(child => {
        child.loaded$.subscribe(null, null, val => {
          loaded--
          if (loaded === 0) {
            this.childrenRendered()
            if (this.loaded$.observers.length > 0) {
              this.loaded$.complete()
            }
          }
        })
      })
    } else {
      this.childrenRendered()
      this.loaded$.complete()
    }
  }

  async doRender(resolve) {
    if (!this.paused) {
      this.update = this.template()
      if (this.current && this.update) {
        SnabbdomPatch(this.current, this.update)
        this.current = this.update
      }
      this.rendered()
      resolve()
    }
  }

}

export default SnabbdomElement
