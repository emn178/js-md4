expect = require('expect.js');

function unset() {
  delete require.cache[require.resolve('../src/md4.js')];
  delete require.cache[require.resolve('./test.js')];
  md4 = null;
  JS_MD4_NO_WINDOW = undefined;
  JS_MD4_NO_NODE_JS = undefined;
  JS_MD4_NO_COMMON_JS = undefined;
  JS_MD4_NO_ARRAY_BUFFER = undefined;
  JS_MD4_NO_ARRAY_BUFFER_IS_VIEW = undefined;
  window = undefined;
  self = undefined;
}

function runCommonJsTest() {
  md4 = require('../src/md4.js');
  require('./test.js');
  unset();
}

function runWindowTest() {
  window = global;
  require('../src/md4.js');
  require('./test.js');
  unset();
}

// Node.js env
runCommonJsTest();

// Webpack browser env
JS_MD4_NO_NODE_JS = true;
window = global;
runCommonJsTest();

// browser env
JS_MD4_NO_NODE_JS = true;
JS_MD4_NO_COMMON_JS = true;
runWindowTest();

// browser env and no array buffer
JS_MD4_NO_NODE_JS = true;
JS_MD4_NO_COMMON_JS = true;
JS_MD4_NO_ARRAY_BUFFER = true;
runWindowTest();

// browser env and no isView
JS_MD4_NO_NODE_JS = true;
JS_MD4_NO_COMMON_JS = true;
JS_MD4_NO_ARRAY_BUFFER_IS_VIEW = true;
runWindowTest();

// browser AMD
JS_MD4_NO_NODE_JS = true;
JS_MD4_NO_COMMON_JS = true;
window = global;
define = function (func) {
  md4 = func();
  require('./test.js');
};
define.amd = true;
require('../src/md4.js');
define = undefined;
unset();

// browser with a process polyfill (e.g. BrowserFS)
window = global;
runCommonJsTest();

// Electron renderer
process.type = 'renderer';
md4 = require('../src/md4.js');
delete process.type;
require('./test.js');
unset();

// web worker
JS_MD4_NO_WINDOW = true;
JS_MD4_NO_NODE_JS = true;
JS_MD4_NO_COMMON_JS = true;
window = global;
self = global;
require('../src/md4.js');
require('./test.js');
unset();

// environment detection in isolated contexts (no Node.js globals)
describe('environment detection', function () {
  var vm = require('vm');
  var fs = require('fs');
  var path = require('path');
  var source = fs.readFileSync(path.join(__dirname, '../src/md4.js'), 'utf8');

  function run(sandbox) {
    sandbox.ArrayBuffer = ArrayBuffer;
    sandbox.Uint8Array = Uint8Array;
    sandbox.Uint32Array = Uint32Array;
    vm.runInContext(source, vm.createContext(sandbox));
    return sandbox.md4;
  }

  function check(md4) {
    expect(md4('abc')).to.be('a448017aaf21d8525fc10ae87aa6729d');
    expect(md4('中文')).to.be('223088bf7bd45a16436b15360c5fc5a0');
  }

  it('should not treat a browser with a process polyfill as Node.js', function () {
    var sandbox = { process: { versions: { node: '18.0.0' }, env: {} } };
    sandbox.window = sandbox.self = sandbox;
    check(run(sandbox));
  });

  it('should not treat an Electron renderer as Node.js', function () {
    var sandbox = { process: { type: 'renderer', versions: { node: '20.0.0' } } };
    sandbox.window = sandbox.self = sandbox;
    check(run(sandbox));
  });

  it('should expose to the global scope in a web worker', function () {
    var sandbox = {};
    sandbox.self = sandbox;
    check(run(sandbox));
  });
});
