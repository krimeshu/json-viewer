/**
 * Created by krimeshu on 2016/4/2.
 */

var JSONViewer = {
    indentSize: 2,
    toJSON: function (obj, _depth, _unfinished) {
        var buffer = [],
            type = Object.prototype.toString.call(obj),
            unfinished = _unfinished || [],
            depth = _depth | 0,
            indentSize = this.indentSize,
            indentStr = new Array(depth * indentSize + 1).join(' '),
            subIndentStr = new Array(indentSize + 1).join(' ') + indentStr,
            child;
        if (unfinished.indexOf(obj) >= 0) {
            throw new Error('Converting circular structure to JSON');
        }
        unfinished.push(obj);
        switch (type) {
            case '[object Function]':
                // 函数不编码
                break;
            case '[object Array]':
                buffer.push(indentStr);
                buffer.push('[\n');
                for (var i = 0, l = obj.length; i < l; i++) {
                    buffer.push(subIndentStr);
                    child = this.toJSON(obj[i], depth + 1, unfinished);
                    buffer.push(child.replace(/(^\s+|\n+$)/g, ''));
                    buffer.push(',\n');
                }
                if (buffer[buffer.length - 1] === ',\n') {
                    buffer[buffer.length - 1] = '\n';
                }
                buffer.push(indentStr);
                buffer.push(']\n');
                break;
            case '[object Object]':
                buffer.push(indentStr);
                buffer.push('{\n');
                for (var k in obj) {
                    if (obj.hasOwnProperty(k)) {
                        buffer.push(subIndentStr);
                        buffer.push('"');
                        buffer.push(k);
                        buffer.push('": ');
                        child = this.toJSON(obj[k], depth + 1, unfinished);
                        buffer.push(child.replace(/(^\s+|\n+$)/g, ''));
                        buffer.push(',\n');
                    }
                }
                if (buffer[buffer.length - 1] === ',\n') {
                    buffer[buffer.length - 1] = '\n';
                }
                buffer.push(indentStr);
                buffer.push('}\n');
                break;
            case '[object String]':
                buffer.push(indentStr);
                buffer.push('"');
                buffer.push(obj.replace(/"/g, '\\"'));
                buffer.push('"');
                break;
            default:
                buffer.push(indentStr);
                buffer.push(String(obj));
                break;
        }
        unfinished.pop();
        return buffer.join('');
    }
};

module.exports = JSONViewer;