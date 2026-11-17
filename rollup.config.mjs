import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default [
  {
    input: 'src/md4.mjs',
    output: {
      file: 'build/md4.mjs',
      format: 'es'
    },
    plugins: [commonjs({
      strictRequires: false
    })]
  },
  {
    input: 'build/md4.mjs',
    output: {
      file: 'build/md4.min.mjs',
      format: 'es'
    },
    plugins: [terser()]
  }
];
