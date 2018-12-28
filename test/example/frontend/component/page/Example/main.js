import {PageElement} from '/node_modules/weldkit/index.js';

class IndexElement extends PageElement {

  constructor() {
    super();
  }

  connectedCallback() {
    console.log('Example page element attached');
    let element = this;
    this.scope.appendViewFromTemplate('frontend/component/page/Example/view.html')
    .then((template) => {
      console.log("Template imported", template.id);
    });
  }
}

customElements.define('page-example', IndexElement);

export default IndexElement;
