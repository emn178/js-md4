md4 = require('../src/md4.js');
expect = require('expect.js');
require('./test.js');

delete require.cache[require.resolve('../src/md4.js')]
delete require.cache[require.resolve('./test.js')]
md4 = null

JS_MD4_TEST = true;
require('../src/md4.js');
require('./test.js');

delete require.cache[require.resolve('../src/md4.js')];
delete require.cache[require.resolve('./test.js')];
md4 = null;

define = function(func) {
  md4 = func();
  require('./test.js');
};
define.amd = true;

require('../src/md4.js');
