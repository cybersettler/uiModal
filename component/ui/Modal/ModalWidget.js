const d3 = require('d3');

function ModalWidget(view, scope) {
    this.view = view;
    this.scope = scope;
    this.display = {};
    this.modal = view.shadowRoot.querySelector('.modal');
    var backdrop = document.createElement('div');
    backdrop.classList.add('modal-backdrop', 'fade');
    this.backdrop = backdrop;
}

ModalWidget.prototype.close = function() {
    this.modal.classList.remove('in');
    this.view.setAttribute('style', 'display:none');
    var backdrop = this.backdrop;
    backdrop.classList.remove('in');
    document.body.removeChild(backdrop);
};

ModalWidget.prototype.render = function() {
    return this.fetchData()
        .then(render);
};

ModalWidget.prototype.fetchData = function() {
    var promises = [];
    var widget = this;

    promises.push(widget.scope.onAppReady);

    if (this.view.hasAttribute('data-model')) {
        promises.push(
            this.scope.getModel().then(function(result) {
                widget.model = result;
            })
        );
    }

    if (this.view.hasAttribute('data-display')) {
        promises.push(
            this.scope.getDisplay().then(function(result) {
                widget.display = result;
            })
        );
    }

    return Promise.all(promises).then(function() {
        return widget;
    });
};

function render(widget) {
    var modal = widget.view.shadowRoot.querySelector('.modal');
    console.log('modal', modal);
    renderTitle(widget, modal);
    renderBody(widget, modal);
    renderFooter(widget, modal);
}

function renderTitle(widget, modal) {
    var title = modal.querySelector('.modal-title');
    title.innerHTML = widget.scope.templateEngine.render(
        widget.display.title, {model: widget.model});
}

function renderBody(widget, modal) {
    var body = modal.querySelector('.modal-body');
    body.innerHTML = widget.scope.templateEngine.render(
        widget.display.body, {model: widget.model});
}

function renderFooter(widget, modal) {
    var footer = modal.querySelector('.modal-footer');
    var data = widget.display.options;

    // Update…
    var button = d3.select(footer)
        .selectAll("button")
        .data(data)
        .html(function(d) {
            return widget.scope.templateEngine.render(
                d.label, widget);
        });

    // Enter…
    button.enter()
        .append("button")
        .classed("btn", true)
        .classed("btn-default", function(d) {
            return d.styleClass === 'default' || !d.styleClass;
        })
        .classed("btn-primary", function(d) {
            return d.styleClass === 'primary';
        })
        .on('click', function(d) {
            if (d.type === 'confirm' && widget.scope.onConfirm) {
                widget.scope.onConfirm(d);
            } else if (d.type === 'reject' && widget.scope.onReject) {
                widget.scope.onReject(d);
            }
            widget.close();
        })
        .html(function(d) {
            return widget.scope.templateEngine.render(d.label, widget);
        });

    // Exit…
    button.exit()
        .remove();
}


module.exports = ModalWidget;