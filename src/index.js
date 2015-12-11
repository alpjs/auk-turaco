import 'html-document/lib/global';
import $ from 'springbokjs-dom';
global.React = global.$ = $;
import ComponentRenderer from 'turaco/lib/renderers/ComponentRenderer';
import ViewRenderer from 'turaco/lib/renderers/ViewRenderer';

import { Component, Fragment, View, Layout, TopLayout } from 'turaco';

const oldViewComponent = View.prototype.component;

View.prototype.component = function (componentClass) {
    return oldViewComponent.call(this, {
        name: componentClass.name,
        nameOrClass: componentClass,
        context: this.context,
    });
};

const oldComponentComponent = Component.prototype.component;

Component.prototype.component = function (componentClass) {
    return oldComponentComponent.call(this, {
        name: componentClass.name,
        nameOrClass: componentClass,
        context: this.context,
    });
};

ViewRenderer.prototype._internalRender = function (sourceView, nameOrClass, properties, data) {
    return this.createThenRender({
        name: nameOrClass.name,
        nameOrClass: nameOrClass,
        context: sourceView.context,
    }, properties, data);
};

export { Component, Fragment, View, Layout, TopLayout };

function instanceFactory(dirname, suffix) {
    return ({ nameOrClass, context }) => {
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
        const instance = new nameOrClass();// jscs:ignore requireCapitalizedConstructors
        instance.context = context;
        return instance;
    };
}

export default function aukTuraco(viewDirectory) {
    return (app) => {
        app.componentRenderer = new ComponentRenderer(
            instanceFactory(viewDirectory + 'components/', 'Component')
        );

        app.viewRenderer = new ViewRenderer(
            instanceFactory(viewDirectory, 'View'),
            app.componentRenderer
        );

        app.context.render = function (View, properties, data) {
            if (!View) {
                throw new Error('View is undefined, class expected');
            }

            return this.app.viewRenderer.createThenRender({
                name: View.name,
                nameOrClass: View,
                context: this,
            }, properties, data)
                .then(view => this.body = view.toHtmlString());
        };
    };
}
