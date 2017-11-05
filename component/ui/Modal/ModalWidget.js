const d3 = require('d3');
const Handlebars = require('Handlebars');

function ModalWidget(view, scope) {
    this.view = view;
    this.scope = scope;
    this.display = {};
}

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
    var renderTemplate = Handlebars.compile(widget.display.title);
    title.innerHTML = renderTemplate({model: widget.model});
}

function renderBody(widget, modal) {
    var body = modal.querySelector('.modal-body');
    var renderTemplate = Handlebars.compile(widget.display.body);
    body.innerHTML = renderTemplate({model: widget.model});
}

function renderFooter(widget, modal) {
    var footer = modal.querySelector('.modal-footer');
    var data = widget.display.options;

    // Update…
    var button = d3.select(footer)
        .selectAll("button")
        .data(data)
        .classed("btn-default", function(d) {
            return d.type !== 'confirm';
        })
        .classed("btn-primary", function(d) {
            return d.type === 'confirm';
        })
        .html(function(d) {
            let renderLabel = Handlebars.compile(d.label);
            return renderLabel(widget);
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
        .html(function(d) {
            let renderLabel = Handlebars.compile(d.label);
            return renderLabel(widget);
        });

    // Exit…
    button.exit()
        .remove();
}


module.exports = ModalWidget;