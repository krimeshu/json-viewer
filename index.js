/**
 * Created by krimeshu on 2016/4/2.
 */

var JSONViewer = {
    toJSON: function (obj, _last) {
        var buffer = [],
            type = Object.prototype.toString.call(obj),
            last = _last || [];
        if (last.indexOf(obj) >= 0) {
            throw new Error('Converting circular structure to JSON');
        }
        last.push(obj);
        switch (type) {
            case '[object Function]':
                // 函数不编码
                break;
            case '[object Array]':
                buffer.push('[');
                for (var i = 0, l = obj.length; i < l; i++) {
                    buffer.push(this.toJSON(obj[i], last));
                    buffer.push(',');
                }
                if (buffer[buffer.length - 1] == ',') {
                    buffer.pop();
                }
                buffer.push(']');
                break;
            case '[object Object]':
                buffer.push('{');
                for (var k in obj) {
                    if (obj.hasOwnProperty(k)) {
                        buffer.push('"');
                        buffer.push(k);
                        buffer.push('":');
                        buffer.push(this.toJSON(obj[k], last));
                        buffer.push(',');
                    }
                }
                if (buffer[buffer.length - 1] == ',') {
                    buffer.pop();
                }
                buffer.push('}');
                break;
            case '[object String]':
                buffer.push('"');
                buffer.push(obj.replace(/"/g, '\\"'));
                buffer.push('"');
                break;
            default:
                buffer.push(String(obj));
                break;
        }
        last.pop();
        return buffer.join('');
    }
};

module.exports = JSONViewer;