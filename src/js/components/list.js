import {Observable} from 'rxjs'
import SnabbdomElement from 'utils/snabbdom-element.js'
import {ul, li} from 'utils/snabbdom-ext.js'

class List extends SnabbdomElement {

  connectedCallback() {
    super.connectedCallback()
  }

  rendered() {
    this.setStream('click$', Observable.fromEvent(this, 'click'))
  }

  template() {
    return ul(
      this.data('list').map(this.buildListItem)
    )
  }

  buildListItem(item) {
    return li(item)
  }

}

List.define('app-list')

export default List
