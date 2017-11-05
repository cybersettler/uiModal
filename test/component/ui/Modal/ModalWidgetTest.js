const {JSDOM} = require('jsdom');
const i18next = require('i18next');
const Handlebars = require('Handlebars');
const expect = require('chai').expect;
const ModalWidget = require('../../../../component/ui/Modal/ModalWidget.js');
const Given = require("./Given.js");

const translations = Given.translation();

describe('ModalWidget', function () {
    describe('#render()', function () {
        before(function (done) {
            var dom = new JSDOM('<!DOCTYPE html><html><bod></body></html>');
            document = dom.window.document;
            i18next.init(translations, (err, t) => {
                Handlebars.registerHelper('i18n', function (key, opt) {
                    return t(key, opt);
                });
                done(err);
            });
        });

        // Scenario 1: items and content from model
        it.only('should generate dialog from model and display', function (done) {
            var scope = Given.scope();
            var view;

            Given.emptyView()
                .then(function(result) {
                    view = result;
                    Given.objectModel();
                    Given.display();
                    var widget = new ModalWidget(view, scope);
                    return widget.render()
                })
                .then(function () {
                    let modal = view.shadowRoot.querySelector('.modal');
                    let title = modal.querySelector('.modal-title').textContent;
                    let body = modal.querySelector('.modal-body').textContent;
                    let footer = modal.querySelector('.modal-footer');
                    let buttons = footer.querySelectorAll('button');
                    expect(title).to.equal('Profile');
                    expect(body).to.equal('Wayne, Bruce');
                    expect(buttons.length).to.equal(2);
                    expect(buttons[0].textContent).to.equal('ok');
                    expect(buttons[1].textContent).to.equal('cancel');
                    done();
                }).catch(done);
        });

        // Scenario 3: items and content from HTML
        it('should generate list from View content', function (done) {
            var view = Given.itemsView();
            var scope = Given.scope();
            var widget = new ModalWidget(view, scope);
            widget.render()
                .then(function () {
                    console.log('html result', view.shadowRoot.innerHTML);
                    let items = view.shadowRoot.querySelectorAll('.list-group-item');
                    expect(items.length).to.equal(3);
                    expect(items[0].textContent).to.equal('Profile');
                    expect(items[1].textContent).to.equal('Settings');
                    expect(items[2].textContent).to.equal('Log out');
                    done();
                }).catch(done);
        });

        // Scenario x: items and content from display
        it('should generate list from display', function (done) {
            var view = Given.emptyView();
            var scope = Given.scope();
            Given.displayWithItems();

            var widget = new ModalWidget(view, scope);
            widget.render()
                .then(function () {
                    console.log('html result', view.shadowRoot.innerHTML);
                    let items = view.shadowRoot.querySelectorAll('.list-group-item');
                    expect(items.length).to.equal(3);
                    expect(items[0].textContent).to.equal('Profile');
                    expect(items[1].textContent).to.equal('Settings');
                    expect(items[2].textContent).to.equal('Log out');
                    done();
                }).catch(done);
        });

        // Scenario x: items from model and template from display
        it('should generate list from model and display template', function (done) {
            var view = Given.emptyView();
            var scope = Given.scope();
            Given.arrayModel();
            Given.displayWithTemplate();

            var widget = new ModalWidget(view, scope);
            widget.render()
                .then(function () {
                    console.log('html result', view.shadowRoot.innerHTML);
                    let items = view.shadowRoot.querySelectorAll('.list-group-item');
                    expect(items.length).to.equal(2);
                    expect(items[0].textContent).to.equal('Parker, Peter');
                    expect(items[1].textContent).to.equal('Wayne, Bruce');
                    done();
                }).catch(done);
        });

        // Scenario x: items from model and template from HTML
        it('should generate list from model items and content template', function (done) {
            var view = Given.templateView();
            var scope = Given.scope();
            Given.arrayModel();

            var widget = new ModalWidget(view, scope);
            widget.render()
                .then(function () {
                    console.log('html result', view.shadowRoot.innerHTML);
                    let items = view.shadowRoot.querySelectorAll('.list-group-item');
                    expect(items.length).to.equal(2);
                    expect(items[0].textContent).to.equal('Parker, Peter');
                    expect(items[1].textContent).to.equal('Wayne, Bruce');
                    done();
                }).catch(done);
        });
    });
});
