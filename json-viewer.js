/**
 * Created by krimeshu on 2016/4/2.
 */

var JSONViewer = function (opts) {
    var box = this._getUsefulDOM(opts.box);
    this.setBox(box);
};

JSONViewer.prototype = {
    _getUsefulDOM: function (unknown) {
        if (this._isDOM(unknown) ||
            (unknown.length && typeof(unknown.append) === 'function')) {
            return unknown;
        }
        return (document.querySelector && document.querySelector(unknown)) ||
            document.getElementById(unknown);
    },
    _isThis: function (el, selector) {
        var _matches = (el.matches || el.matchesSelector
        || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector);
        if (_matches) {
            return _matches.call(el, selector);
        } else if (el.parentNode) {
            var nodes = el.parentNode.querySelectorAll(selector);
            for (var i = nodes.length; i--;)
                if (nodes[i] === el) {
                    return true;
                }
            return false;
        }
        return false;
    },
    _refluxToFind: function (el, selector, excludeThis) {
        if (!excludeThis && this._isThis(el, selector)) {
            return el;
        } else if (el.parentNode) {
            return this._refluxToFind(el.parentNode, selector);
        } else {
            return null;
        }
    },
    _isDOM: ( typeof HTMLElement === 'object' ) ?
        function (unknown) {
            return unknown instanceof HTMLElement;
        } :
        function (unknown) {
            return (unknown && typeof unknown === 'object'
            && unknown.nodeType === 1 && typeof unknown.nodeName === 'string');
        },
    setBox: function (box) {
        if (this.box && this.boxListener) {
            this.box.removeEventListener('click', this.boxListener);
        }
        this.boxListener = function (e) {

        };
        this.box = box;
    },
    indentSize: 14,
    toJSON: function (obj, _depth, _unfinished, _isLast) {
        var buffer = [],
            type = Object.prototype.toString.call(obj),
            unfinished = _unfinished || [],
            depth = _depth | 0,
            indentSize = this.indentSize | 0,
            child, childType,
            i, l;
        if (unfinished.indexOf(obj) >= 0) {
            throw new Error('Converting circular structure to JSON');
        }
        unfinished.push(obj);
        switch (type) {
            case '[object Function]':
                // 函数不编码
                break;
            case '[object Array]':
                buffer.push('<div class="json-viewer-bracket">[</div>');
                if (depth > 0) {
                    buffer.push('</div>');  // <div class="json-viewer-row">
                }
                buffer.push('<div class="json-viewer-array">');
                buffer.push('<div class="json-viewer-indent" style="padding-left:' + indentSize + 'px;">');
                for (i = 0, l = obj.length - 1; i <= l; i++) {
                    buffer.push('<div class="json-viewer-row">');
                    child = this.toJSON(obj[i], depth + 1, unfinished, i < l);
                    buffer.push(child);
                }
                buffer.push('</div>');      // <div class="json-viewer-indent">
                buffer.push('</div>');      // <div class="json-viewer-array">
                if (_isLast) {
                    buffer.push('<div class="json-viewer-bracket end-bracket">], </div>');
                } else {
                    buffer.push('<div class="json-viewer-bracket end-bracket">]</div>');
                }
                break;
            case '[object Object]':
                buffer.push('<div class="json-viewer-bracket">{</div>');
                if (depth > 0) {
                    buffer.push('</div>');  // <div class="json-viewer-row">
                }
                buffer.push('<div class="json-viewer-object">');
                buffer.push('<div class="json-viewer-indent" style="padding-left:' + indentSize + 'px;">');
                var keys = [];
                for (var k in obj) {
                    if (obj.hasOwnProperty(k)) {
                        keys.push(k);
                    }
                }
                for (i = 0, l = keys.length - 1; i <= l; i++) {
                    k = keys[i];
                    buffer.push('<div class="json-viewer-row">');
                    buffer.push('<div class="json-viewer-key">"');
                    buffer.push(k);
                    buffer.push('"</div>: ');
                    child = this.toJSON(obj[k], depth + 1, unfinished, i < l);
                    buffer.push(child);
                }
                buffer.push('</div>');      // <div class="json-viewer-indent">
                buffer.push('</div>');      // <div class="json-viewer-object">
                if (_isLast) {
                    buffer.push('<div class="json-viewer-bracket end-bracket">}, </div>');
                } else {
                    buffer.push('<div class="json-viewer-bracket end-bracket">}</div>');
                }
                break;
            case '[object String]':
                buffer.push('<div class="json-viewer-string">');
                buffer.push('"');
                buffer.push(obj.replace(/"/g, '\\"'));
                buffer.push('"');
                if (depth > 0) {
                    if (_isLast) {
                        buffer.push(', ');
                    }
                    buffer.push('</div>');  // <div class="json-viewer-row">
                }
                buffer.push('</div>');
                break;
            case '[object Number]':
                childType = 'number';
                break;
            case '[object Boolean]':
                childType = 'boolean';
                break;
            case '[object Null]':
                childType = 'null';
                break;
            case '[object Undefined]':
                childType = 'undefined';
                break;
            default:
                childType = childType || 'value';
                break;
        }
        if (childType) {
            buffer.push('<div class="json-viewer-' + childType + '">');
            buffer.push(String(obj));
            if (depth > 0) {
                if (_isLast) {
                    buffer.push(', ');
                }
                buffer.push('</div>');  // <div class="json-viewer-row">
            }
            buffer.push('</div>');
        }
        unfinished.pop();
        return buffer.join('');
    }
};
