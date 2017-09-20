import SnabbdomElement from 'utils/snabbdom-element.js'
import {h, div} from 'utils/snabbdom-ext.js'
import AppActions from 'actions/app.js'

class App extends SnabbdomElement {

  rendered() {
    this.setElms({
      sidebar: this.find('app-sidebar')
    })
  }

  childrenRendered() {
    this.setStream('click$', 
     this.elms.sidebar.getStream('click$')
      .map(e => e.target.textContent)
    )
    this.setActions()
  }
  
  setActions() {
    AppActions()
  }

  template() {
    return div('#app',
      h('app-sidebar')()
    )
  }

}

App.define('app-root')

export default App
