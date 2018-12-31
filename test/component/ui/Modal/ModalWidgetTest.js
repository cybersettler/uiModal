const {JSDOM} = require('jsdom');
const i18next = require('i18next');
const Handlebars = require('Handlebars');
const expect = require('chai').expect;
const ModalWidget = require('../../../../src/main/js/ModalWidget.js').default;
const Given = require("./Given.js");
const d3 = require("d3");

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
            Given.scope().templateEngine = {
                render: function(template, data) {
                    var doRender = Handlebars.compile(template);
                    return doRender(data);
                },
                compile: function(template) {
                  return Handlebars.compile(template);
                }
            };
            Given.scope().importESModule = function(moduleName) {
              if (moduleName === 'd3') {
                return Promise.resolve(d3);
              }
            };
        });

        // Scenario 1: items and content from model
        it('should generate dialog from model and display', function (done) {
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
                    expect(buttons[0].classList.contains('btn-primary'), 'Expect confirm button to have primary style')
                        .to.equal(true);
                    expect(buttons[1].textContent).to.equal('cancel');
                    expect(buttons[1].classList.contains('btn-default'), 'Expect cancel button to have default style')
                        .to.equal(true);
                    done();
                }).catch(done);
        });
    });
});
