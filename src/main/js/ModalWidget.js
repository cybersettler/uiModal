let d3;

class ModalWidget {
  constructor(view, scope) {
    var modal = this;
    this.view = view;
    this.scope = scope;
    this.display = {};

    this.modal = view.shadowRoot.querySelector('.modal');
    var backdrop = document.createElement('div');
    backdrop.classList.add('modal-backdrop', 'fade');
    this.backdrop = backdrop;

    let header = view.querySelector('header');
    let body = view.querySelector(':scope>div');
    let options = view.querySelectorAll('footer button');

    if (header) {
      this.renderTitleTemplate = scope.templateEngine.compile(
          header.innerHTML);
      this.display.header = {
        closebtn: header.dataset.closebtn === 'true' ? true : false
      };
    }

    if (body) {
      this.renderBodyTemplate = scope.templateEngine.compile(body.innerHTML);
    }

    if (options) {
      this.optionsTemplate = Array.from(options, item => { return {
        type: item.dataset.role,
        renderLabel: scope.templateEngine.compile(item.innerHTML),
        styleClass: item.getAttribute('class')
      }; })
    }
  }

  close() {
    this.modal.classList.remove('in');
    this.view.setAttribute('style', 'display:none');
    var backdrop = this.backdrop;
    backdrop.classList.remove('in');
    document.body.removeChild(backdrop);
  }

  render() {
    let widget = this;
    return this.scope.importESModule('d3')
      .then(function(module) {
        d3 = module;
        return widget.fetchData();
      })
      .then(render);
  }

  fetchData() {
    let promises = [];
    let widget = this;

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
        this.scope.getDisplay()
          .then(function(result) {
            widget.display = result;
            initDisplay(widget);
          })
      );
    }

    return Promise.all(promises).then(function() {
      return widget;
    });
  }
}

function render(widget) {
  let modal = widget.view.shadowRoot.querySelector('.modal');
  renderHeader(widget, modal);
  renderBody(widget, modal);
  renderFooter(widget, modal);
}

function renderHeader(widget, modal) {
  let title = modal.querySelector('.modal-title');
  if (widget.renderTitleTemplate) {
    title.innerHTML = widget.renderTitleTemplate(widget.model);
  }

  let header = modal.querySelector('.modal-header');
  let data = widget.display && widget.display.header
    && widget.display.header.closebtn ? [true] : [];

  // Update
  let button = d3.select(header)
      .selectAll("button")
      .data(data);

  // Enter
  button.enter()
    .insert("button", ':first-child')
    .attr('type', 'button')
    .attr('data-dismiss', 'modal')
    .attr('aria-label', 'Close')
    .classed('close', true)
    .append('span')
    .attr('aria-hidden', 'true')
    .html('&times;')
    .on('click', function() {
      widget.close();
    });

    // Exit…
    button.exit()
      .remove();
}

function renderBody(widget, modal) {
  let body = modal.querySelector('.modal-body');
  if (widget.renderBodyTemplate) {
    body.innerHTML = widget.renderBodyTemplate({model: widget.model});
  }
}

function renderFooter(widget, modal) {
  let footer = modal.querySelector('.modal-footer');
  let data = widget.optionsTemplate || [];

  // Update…
  let button = d3.select(footer)
      .selectAll("button")
      .data(data)
      .html(function(d) {
        return d.renderLabel(widget);
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
        return d.renderLabel(widget);
      });

      // Exit…
      button.exit()
        .remove();
}

function initDisplay(widget) {
  let display = widget.display;
  let scope = widget.scope;

  if (display.header) {
    widget.renderTitleTemplate = scope.templateEngine.compile(
        display.header.title);
  }

  if (display.body) {
    widget.renderBodyTemplate = scope.templateEngine.compile(display.body);
  }

  if (display.footer && display.footer.options) {
    widget.optionsTemplate = display.footer.options.map(item => { return {
      type: item.type,
      renderLabel: scope.templateEngine.compile(item.label),
      styleClass: item.styleClass
    }; })
  }
}


export default ModalWidget;
