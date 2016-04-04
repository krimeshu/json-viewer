# json-viewer

提供纯javascript的简单json可视化处理，兼容性大致是ES5，建议用于web app内。

> 效果预览：
>
> ![basic-intro](https://github.com/Moonshell/json-viewer/raw/master/preview.png)

## 示例

```javascript
var viewers = {
    default:new JSONViewer({
        eventHandler: document.body,
        indentSize: 20,
        expand: 1,
        quoteKeys: true
    }),
    dark: new JSONViewer({
        eventHandler: document.body,
        indentSize: 20,
        expand: 1,
        quoteKeys: false,
        theme: 'dark'
    })
};

var frags = [
    document.createDocumentFragment(),
    document.createDocumentFragment()
];

var obj = { /* ... */ };

frags[0].innerHTML = viewers.default.toJSON(obj);
frags[1].innerHTML = viewers.dark.toJSON(obj);
```
