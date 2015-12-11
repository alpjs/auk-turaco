'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TopLayout = exports.Layout = exports.View = exports.Fragment = exports.Component = undefined;
exports.default = aukTuraco;

require('html-document/lib/global');

var _springbokjsDom = require('springbokjs-dom');

var _springbokjsDom2 = _interopRequireDefault(_springbokjsDom);

var _ComponentRenderer = require('turaco/lib/renderers/ComponentRenderer');

var _ComponentRenderer2 = _interopRequireDefault(_ComponentRenderer);

var _ViewRenderer = require('turaco/lib/renderers/ViewRenderer');

var _ViewRenderer2 = _interopRequireDefault(_ViewRenderer);

var _turaco = require('turaco');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

global.React = global.$ = _springbokjsDom2.default;

const oldViewComponent = _turaco.View.prototype.component;

_turaco.View.prototype.component = function (componentClass) {
    return oldViewComponent.call(this, {
        name: componentClass.name,
        nameOrClass: componentClass,
        context: this.context
    });
};

const oldComponentComponent = _turaco.Component.prototype.component;

_turaco.Component.prototype.component = function (componentClass) {
    return oldComponentComponent.call(this, {
        name: componentClass.name,
        nameOrClass: componentClass,
        context: this.context
    });
};

_ViewRenderer2.default.prototype._internalRender = function (sourceView, nameOrClass, properties, data) {
    return this.createThenRender({
        name: nameOrClass.name,
        nameOrClass: nameOrClass,
        context: sourceView.context
    }, properties, data);
};

exports.Component = _turaco.Component;
exports.Fragment = _turaco.Fragment;
exports.View = _turaco.View;
exports.Layout = _turaco.Layout;
exports.TopLayout = _turaco.TopLayout;

function instanceFactory(dirname, suffix) {
    return _ref => {
        let nameOrClass = _ref.nameOrClass;
        let context = _ref.context;

        if (nameOrClass === undefined) {
            throw new Error('Cannot instanciate undefined');
        }

        if (typeof nameOrClass !== 'function') {
            const path = dirname + nameOrClass + (suffix || '');
            let nameOrClass = require(path);

            if (typeof nameOrClass !== 'function') {
                nameOrClass = nameOrClass.default;
            }
        }

        // const instance = Object.create(nameOrClass.prototype);
        // nameOrClass.call(instance);
        const instance = new nameOrClass(); // jscs:ignore requireCapitalizedConstructors
        instance.context = context;
        return instance;
    };
}

function aukTuraco(viewDirectory) {
    return app => {
        app.componentRenderer = new _ComponentRenderer2.default(instanceFactory(viewDirectory + 'components/', 'Component'));

        app.viewRenderer = new _ViewRenderer2.default(instanceFactory(viewDirectory, 'View'), app.componentRenderer);

        app.context.render = function (View, properties, data) {
            if (!View) {
                throw new Error('View is undefined, class expected');
            }

            return this.app.viewRenderer.createThenRender({
                name: View.name,
                nameOrClass: View,
                context: this
            }, properties, data).then(view => this.body = view.toHtmlString());
        };
    };
}
//# sourceMappingURL=index.js.map