/*
 * js-md4 v0.1.0
 * https://github.com/emn178/js-md4
 *
 * Copyright 2015, emn178@gmail.com
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */
;(function(root, undefined) {
  'use strict';

  var NODE_JS = typeof(module) != 'undefined';
  if(NODE_JS) {
    root = global;
    if(root.JS_MD4_TEST) {
      root.navigator = { userAgent: 'Firefox'};
    }
  }
  var FIREFOX = (root.JS_MD4_TEST || !NODE_JS) && navigator.userAgent.indexOf('Firefox') != -1;
  var ARRAY_BUFFER = !root.JS_MD4_TEST && typeof(ArrayBuffer) != 'undefined';
  var HEX_CHARS = '0123456789abcdef'.split('');
  var EXTRA = [128, 32768, 8388608, -2147483648];
  var SHIFT = [0, 8, 16, 24];

  var blocks = [], buffer8;
  if(ARRAY_BUFFER) {
    var buffer = new ArrayBuffer(68);
    buffer8 = new Uint8Array(buffer);
    blocks = new Uint32Array(buffer);
  }

  var md4 = function(message) {
    var h0, h1, h2, h3, a, b, c, d, code, end = false,
        index = 0, i, start = 0, bytes = 0, length = message.length;

    h0 = 0x67452301;
    h1 = 0xefcdab89;
    h2 = 0x98badcfe;
    h3 = 0x10325476;
    blocks[16] = 0;
    do {
      blocks[0] = blocks[16];
      blocks[16] = blocks[1] = blocks[2] = blocks[3] =
      blocks[4] = blocks[5] = blocks[6] = blocks[7] =
      blocks[8] = blocks[9] = blocks[10] = blocks[11] =
      blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      if(ARRAY_BUFFER) {
        for (i = start;index < length && i < 64; ++index) {
          code = message.charCodeAt(index);
          if (code < 0x80) {
            buffer8[i++] = code;
          } else if (code < 0x800) {
            buffer8[i++] = 0xc0 | (code >> 6);
            buffer8[i++] = 0x80 | (code & 0x3f);
          } else if (code < 0xd800 || code >= 0xe000) {
            buffer8[i++] = 0xe0 | (code >> 12);
            buffer8[i++] = 0x80 | ((code >> 6) & 0x3f);
            buffer8[i++] = 0x80 | (code & 0x3f);
          } else {
            code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
            buffer8[i++] = 0xf0 | (code >> 18);
            buffer8[i++] = 0x80 | ((code >> 12) & 0x3f);
            buffer8[i++] = 0x80 | ((code >> 6) & 0x3f);
            buffer8[i++] = 0x80 | (code & 0x3f);
          }
        }
      } else {
        for (i = start;index < length && i < 64; ++index) {
          code = message.charCodeAt(index);
          if (code < 0x80) {
            blocks[i >> 2] |= code << SHIFT[i++ & 3];
          } else if (code < 0x800) {
            blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else if (code < 0xd800 || code >= 0xe000) {
            blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else {
            code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
            blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          }
        }
      }
      bytes += i - start;
      start = i - 64;
      if(index == length) {
        blocks[i >> 2] |= EXTRA[i & 3];
        ++index;
      }
      if(index > length && i < 56) {
        blocks[14] = bytes << 3;
        end = true;
      }

      a = h0;
      b = h1;
      c = h2;
      d = h3;

      a = r1(a, b, c, d, blocks[0], 3);
      d = r1(d, a, b, c, blocks[1], 7);
      c = r1(c, d, a, b, blocks[2], 11);
      b = r1(b, c, d, a, blocks[3], 19);
      a = r1(a, b, c, d, blocks[4], 3);
      d = r1(d, a, b, c, blocks[5], 7);
      c = r1(c, d, a, b, blocks[6], 11);
      b = r1(b, c, d, a, blocks[7], 19);
      a = r1(a, b, c, d, blocks[8], 3);
      d = r1(d, a, b, c, blocks[9], 7);
      c = r1(c, d, a, b, blocks[10], 11);
      b = r1(b, c, d, a, blocks[11], 19);
      a = r1(a, b, c, d, blocks[12], 3);
      d = r1(d, a, b, c, blocks[13], 7);
      c = r1(c, d, a, b, blocks[14], 11);
      b = r1(b, c, d, a, blocks[15], 19);

      a = r2(a, b, c, d, blocks[0], 3);
      d = r2(d, a, b, c, blocks[4], 5);
      c = r2(c, d, a, b, blocks[8], 9);
      b = r2(b, c, d, a, blocks[12], 13);
      a = r2(a, b, c, d, blocks[1], 3);
      d = r2(d, a, b, c, blocks[5], 5);
      c = r2(c, d, a, b, blocks[9], 9);
      b = r2(b, c, d, a, blocks[13], 13);
      a = r2(a, b, c, d, blocks[2], 3);
      d = r2(d, a, b, c, blocks[6], 5);
      c = r2(c, d, a, b, blocks[10], 9);
      b = r2(b, c, d, a, blocks[14], 13);
      a = r2(a, b, c, d, blocks[3], 3);
      d = r2(d, a, b, c, blocks[7], 5);
      c = r2(c, d, a, b, blocks[11], 9);
      b = r2(b, c, d, a, blocks[15], 13);

      a = r3(a, b, c, d, blocks[0], 3);
      d = r3(d, a, b, c, blocks[8], 9);
      c = r3(c, d, a, b, blocks[4], 11);
      b = r3(b, c, d, a, blocks[12], 15);
      a = r3(a, b, c, d, blocks[2], 3);
      d = r3(d, a, b, c, blocks[10], 9);
      c = r3(c, d, a, b, blocks[6], 11);
      b = r3(b, c, d, a, blocks[14], 15);
      a = r3(a, b, c, d, blocks[1], 3);
      d = r3(d, a, b, c, blocks[9], 9);
      c = r3(c, d, a, b, blocks[5], 11);
      b = r3(b, c, d, a, blocks[13], 15);
      a = r3(a, b, c, d, blocks[3], 3);
      d = r3(d, a, b, c, blocks[11], 9);
      c = r3(c, d, a, b, blocks[7], 11);
      b = r3(b, c, d, a, blocks[15], 15);

      h0 = h0 + a << 0;
      h1 = h1 + b << 0;
      h2 = h2 + c << 0;
      h3 = h3 + d << 0;
    } while(!end);

    if(FIREFOX) {
      var hex = HEX_CHARS[(h0 >> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F];
      hex += HEX_CHARS[(h0 >> 12) & 0x0F] + HEX_CHARS[(h0 >> 8) & 0x0F];
      hex += HEX_CHARS[(h0 >> 20) & 0x0F] + HEX_CHARS[(h0 >> 16) & 0x0F];
      hex += HEX_CHARS[(h0 >> 28) & 0x0F] + HEX_CHARS[(h0 >> 24) & 0x0F];
      hex += HEX_CHARS[(h1 >> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F];
      hex += HEX_CHARS[(h1 >> 12) & 0x0F] + HEX_CHARS[(h1 >> 8) & 0x0F];
      hex += HEX_CHARS[(h1 >> 20) & 0x0F] + HEX_CHARS[(h1 >> 16) & 0x0F];
      hex += HEX_CHARS[(h1 >> 28) & 0x0F] + HEX_CHARS[(h1 >> 24) & 0x0F];
      hex += HEX_CHARS[(h2 >> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F];
      hex += HEX_CHARS[(h2 >> 12) & 0x0F] + HEX_CHARS[(h2 >> 8) & 0x0F];
      hex += HEX_CHARS[(h2 >> 20) & 0x0F] + HEX_CHARS[(h2 >> 16) & 0x0F];
      hex += HEX_CHARS[(h2 >> 28) & 0x0F] + HEX_CHARS[(h2 >> 24) & 0x0F];
      hex += HEX_CHARS[(h3 >> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F];
      hex += HEX_CHARS[(h3 >> 12) & 0x0F] + HEX_CHARS[(h3 >> 8) & 0x0F];
      hex += HEX_CHARS[(h3 >> 20) & 0x0F] + HEX_CHARS[(h3 >> 16) & 0x0F];
      hex += HEX_CHARS[(h3 >> 28) & 0x0F] + HEX_CHARS[(h3 >> 24) & 0x0F];
      return hex;
    } else {
      return HEX_CHARS[(h0 >> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F] +
         HEX_CHARS[(h0 >> 12) & 0x0F] + HEX_CHARS[(h0 >> 8) & 0x0F] +
         HEX_CHARS[(h0 >> 20) & 0x0F] + HEX_CHARS[(h0 >> 16) & 0x0F] +
         HEX_CHARS[(h0 >> 28) & 0x0F] + HEX_CHARS[(h0 >> 24) & 0x0F] +
         HEX_CHARS[(h1 >> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F] +
         HEX_CHARS[(h1 >> 12) & 0x0F] + HEX_CHARS[(h1 >> 8) & 0x0F] +
         HEX_CHARS[(h1 >> 20) & 0x0F] + HEX_CHARS[(h1 >> 16) & 0x0F] +
         HEX_CHARS[(h1 >> 28) & 0x0F] + HEX_CHARS[(h1 >> 24) & 0x0F] +
         HEX_CHARS[(h2 >> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F] +
         HEX_CHARS[(h2 >> 12) & 0x0F] + HEX_CHARS[(h2 >> 8) & 0x0F] +
         HEX_CHARS[(h2 >> 20) & 0x0F] + HEX_CHARS[(h2 >> 16) & 0x0F] +
         HEX_CHARS[(h2 >> 28) & 0x0F] + HEX_CHARS[(h2 >> 24) & 0x0F] +
         HEX_CHARS[(h3 >> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F] +
         HEX_CHARS[(h3 >> 12) & 0x0F] + HEX_CHARS[(h3 >> 8) & 0x0F] +
         HEX_CHARS[(h3 >> 20) & 0x0F] + HEX_CHARS[(h3 >> 16) & 0x0F] +
         HEX_CHARS[(h3 >> 28) & 0x0F] + HEX_CHARS[(h3 >> 24) & 0x0F];
    }
  };

  function rotate(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  function f(x, y, z) {
    return (x & y) | (~x & z);
  }

  function g(x, y, z) {
    return (x & y) | (x & z) | (y & z);
  }

  function h(x, y, z) {
    return x ^ y ^ z;
  }

  function r1(a, b, c, d, x, s) {
    return rotate((a + f(b, c, d) + x), s);
  }

  function r2(a, b, c, d, x, s) {
    return rotate((a + g(b, c, d) + x + 0x5A827999), s);
  }

  function r3(a, b, c, d, x, s) {
    return rotate((a + h(b, c, d) + x + 0x6ED9EBA1), s);
  }

  if(!root.JS_MD4_TEST && NODE_JS) {
    module.exports = md4;
  } else if(root) {
    root.md4 = md4;
  }
}(this));
