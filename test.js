/**
 * Created by krimeshu on 2016/4/3.
 */

var obj = require('./package.json'),
    jsonViewer = require('./');

console.log(jsonViewer.toJSON(obj));
