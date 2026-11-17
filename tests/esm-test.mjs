import { createRequire } from 'module';
import expect from 'expect.js';
import * as esm from '../build/md4.mjs';
import * as esmMin from '../build/md4.min.mjs';
import * as pkg from 'js-md4';

const require = createRequire(import.meta.url);

globalThis.expect = expect;

[['build/md4.mjs', esm], ['build/md4.min.mjs', esmMin], ['js-md4', pkg]].forEach(([name, mod]) => {
  describe('ESM ' + name, () => {
    it('should export the named member matching the default export', () => {
      expect(mod.md4).to.be(mod.default);
      expect(mod.default('abc')).to.be('a448017aaf21d8525fc10ae87aa6729d');
    });
  });

  globalThis.md4 = mod.default;
  delete require.cache[require.resolve('./test.js')];
  require('./test.js');
});
