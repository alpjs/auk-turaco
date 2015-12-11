# auk-turaco

```js
import Koa from 'koa';
import turaco from 'auk-turaco';

const app = new Koa();
turaco(__dirname + '/views')(app);
```

```js
    index(ctx) {
        ctx.body = ctx.render(IndexView, { propName: null }, { dataName: null });
    },
```
