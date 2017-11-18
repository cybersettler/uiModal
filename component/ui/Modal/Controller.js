const ModalWidget = require('./ModalWidget.js');

function ModalController(view, scope) {

    // Controller constructor is called when an instance
    // of the html element is created

    // Controllers are stateless, the model is used to
    // store state data instead.

    // This class extends component/view/AbstractController
    // so we need to call the super constructor
    this.super(view, scope);
    var controller = this;

    scope.onAttached.then(function () {

        var bindingAttributes = [];
        if (view.hasAttribute('data-model')) {
            bindingAttributes.push('model');
        }

        if (view.hasAttribute('data-display')) {
            bindingAttributes.push('display');
        }

        if (view.hasAttribute('data-confirm')) {
            bindingAttributes.push('confirm');
        }

        if (view.hasAttribute('data-reject')) {
            bindingAttributes.push('reject');
        }

        scope.bindAttributes(bindingAttributes);
        controller.modalWidget = new ModalWidget(view, scope);

        view.addEventListener('open', openDialog);
    });

    this.render = function () {
        this.modalWidget.render();
    };

    function openDialog() {
        controller.modalWidget.open();
    }
}

module.exports = ModalController;
