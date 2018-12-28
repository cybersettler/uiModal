import {FragmentElement} from '/node_modules/weldkit/index.js';
import ModalWidget from './src/main/js/ModalWidget.js';

class ModalElement extends FragmentElement {
  /**
   * Get observed dynamic attributes.
   * If attributes are not specified here
   * the attributeChangedCallback wont be triggered
   * @return {string[]}
   */
  static get observedAttributes() {
    return ['data-model', 'data-display', 'data-confirm', 'data-reject'];
  }

  /**
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * Connected callback
   */
  connectedCallback() {
    let bindingAttributes = [];
    let element = this;
    let scope = this.scope;
    if (this.hasAttribute('data-model')) {
        bindingAttributes.push('model');
    }

    if (this.hasAttribute('data-display')) {
        bindingAttributes.push('display');
    }

    if (this.hasAttribute('data-confirm')) {
        bindingAttributes.push('confirm');
    }

    if (this.hasAttribute('data-reject')) {
        bindingAttributes.push('reject');
    }

    scope.bindAttributes(bindingAttributes);
    scope.appendShadowViewFromTemplate(scope.getModuleDir() + 'dist/view/view.html')
      .then((template) => {
          console.log('Template imported', template.id);
          element.modalWidget = new ModalWidget(element, scope);
          element.addEventListener('openDialog', (e) => element.openDialog(e));
          element.addEventListener('closeDialog', (e) => element.closeDialog(e));
        });
  }

  render() {
      this.modalWidget.render();
  };

  openDialog(e) {
      let widget = this.modalWidget;
      let scope = this.scope;
      if (e && e.detail && typeof e.detail.model === 'object') {
          widget.model = e.detail.model;
      }else if (e && e.detail && typeof e.detail.model === 'string'
      && /^\//.test(e.detail.model)) {
          widget.view.dataset.model = e.detail.model;
          scope.bindAttribute('model');
      } else if (e && e.detail && typeof e.detail.model === 'string') {
          widget.view.dataset.model = '{' + e.detail.model + '}';
          scope.bindAttribute('model');
      }
      if (e && e.detail && typeof e.detail.display === 'object') {
          widget.display = e.detail.display;
      }
      if (e && e.detail && typeof e.detail.confirm === 'string') {
          widget.view.dataset.confirm = '{' + e.detail.confirm + '}';
          scope.bindAttribute('confirm');
      }
      if (e && e.detail && typeof e.detail.reject === 'string') {
          widget.view.dataset.reject = '{' + e.detail.reject + '}';
          scope.bindAttribute('reject');
      }
      widget.render()
          .then(function () {
              widget.backdrop.classList.add('in');
              document.body.appendChild(widget.backdrop);
              widget.view.setAttribute('style', 'display:block');
              widget.modal.classList.add('in');
          });
  }

  closeDialog() {
      this.modalWidget.close();
  }
}

customElements.define('ui-modal', ModalElement);

export default ModalElement;
