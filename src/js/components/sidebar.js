import SnabbdomElement from 'utils/snabbdom-element.js'
import {h, div} from 'utils/snabbdom-ext.js'

class Sidebar extends SnabbdomElement {

  connectedCallback() {
    super.connectedCallback()
  }
  
  rendered() {
    this.setElms({
      list: this.find('app-list')
    })
    this.elms.list.bind({
      name: 'list', 
      store: 'list', 
      filter: store => store.get('list')
    })
  }

  childrenRendered() {
    this.setStream('click$', this.elms.list.getStream('click$'))
  }

  template() {
    return div(
      h('app-list')()
    )
  }

}

Sidebar.define('app-sidebar')

export default Sidebar
