/*
 * js-md4 v0.2.0
 * https://github.com/emn178/js-md4
 *
 * Copyright 2015, emn178@gmail.com
 *
 * @license under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */
;(function(root) {
  'use strict';

  var NODE_JS = typeof process == 'object' && process.versions && process.versions.node;
  if(NODE_JS) {
    root = global;
  }
  var COMMON_JS = !root.JS_MD4_TEST && typeof module == 'object' && module.exports;
  var AMD = typeof define == 'function' && define.amd;

  var ARRAY_BUFFER = !root.JS_MD4_TEST && typeof ArrayBuffer != 'undefined';
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
    var notString = typeof(message) != 'string';
    if(notString && message.constructor == ArrayBuffer) {
      message = new Uint8Array(message);
    }

    var h0, h1, h2, h3, a, b, c, d, ab, bc, cd, da, code, first = true, end = false,
        index = 0, i, start = 0, bytes = 0, length = message.length || 0;

    blocks[16] = 0;
    do {
      blocks[0] = blocks[16];
      blocks[16] = blocks[1] = blocks[2] = blocks[3] =
      blocks[4] = blocks[5] = blocks[6] = blocks[7] =
      blocks[8] = blocks[9] = blocks[10] = blocks[11] =
      blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      if(notString) {
        if(ARRAY_BUFFER) {
          for (i = start;index < length && i < 64; ++index) {
            buffer8[i++] = message[index];
          }
        } else {
          for (i = start;index < length && i < 64; ++index) {
            blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
          }
        }
      } else {
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

      if(first) {
        a = blocks[0] - 1;
        a = (a << 3) | (a >>> 29);
        d = ((a & 0xefcdab89) | (~a & 0x98badcfe)) + blocks[1] + 271733878;
        d = (d << 7) | (d >>> 25);
        c = ((d & a) | (~d & 0xefcdab89)) + blocks[2] - 1732584194;
        c = (c << 11) | (c >>> 21);
        b = ((c & d) | (~c & a)) + blocks[3] - 271733879;
        b = (b << 19) | (b >>> 13);
      } else {
        a = h0;
        b = h1;
        c = h2;
        d = h3;
        a += ((b & c) | (~b & d)) + blocks[0];
        a = (a << 3) | (a >>> 29);
        d += ((a & b) | (~a & c)) + blocks[1];
        d = (d << 7) | (d >>> 25);
        c += ((d & a) | (~d & b)) + blocks[2];
        c = (c << 11) | (c >>> 21);
        b += ((c & d) | (~c & a)) + blocks[3];
        b = (b << 19) | (b >>> 13);
      }
      a += ((b & c) | (~b & d)) + blocks[4];
      a = (a << 3) | (a >>> 29);
      d += ((a & b) | (~a & c)) + blocks[5];
      d = (d << 7) | (d >>> 25);
      c += ((d & a) | (~d & b)) + blocks[6];
      c = (c << 11) | (c >>> 21);
      b += ((c & d) | (~c & a)) + blocks[7];
      b = (b << 19) | (b >>> 13);
      a += ((b & c) | (~b & d)) + blocks[8];
      a = (a << 3) | (a >>> 29);
      d += ((a & b) | (~a & c)) + blocks[9];
      d = (d << 7) | (d >>> 25);
      c += ((d & a) | (~d & b)) + blocks[10];
      c = (c << 11) | (c >>> 21);
      b += ((c & d) | (~c & a)) + blocks[11];
      b = (b << 19) | (b >>> 13);
      a += ((b & c) | (~b & d)) + blocks[12];
      a = (a << 3) | (a >>> 29);
      d += ((a & b) | (~a & c)) + blocks[13];
      d = (d << 7) | (d >>> 25);
      c += ((d & a) | (~d & b)) + blocks[14];
      c = (c << 11) | (c >>> 21);
      b += ((c & d) | (~c & a)) + blocks[15];
      b = (b << 19) | (b >>> 13);

      bc = b & c;
      a += (bc | (b & d) | (c & d)) + blocks[0] + 1518500249;
      a = (a << 3) | (a >>> 29);
      ab = a & b;
      d += (ab | (a & c) | bc) + blocks[4] + 1518500249;
      d = (d << 5) | (d >>> 27);
      da = d & a;
      c += (da | (d & b) | ab) + blocks[8] + 1518500249;
      c = (c << 9) | (c >>> 23);
      cd = c & d;
      b += (cd | (c & a) | da) + blocks[12] + 1518500249;
      b = (b << 13) | (b >>> 19);
      bc = b & c;
      a += (bc | (b & d) | cd) + blocks[1] + 1518500249;
      a = (a << 3) | (a >>> 29);
      ab = a & b;
      d += (ab | (a & c) | bc) + blocks[5] + 1518500249;
      d = (d << 5) | (d >>> 27);
      da = d & a;
      c += (da | (d & b) | ab) + blocks[9] + 1518500249;
      c = (c << 9) | (c >>> 23);
      cd = c & d;
      b += (cd | (c & a) | da) + blocks[13] + 1518500249;
      b = (b << 13) | (b >>> 19);
      bc = b & c;
      a += (bc | (b & d) | cd) + blocks[2] + 1518500249;
      a = (a << 3) | (a >>> 29);
      ab = a & b;
      d += (ab | (a & c) | bc) + blocks[6] + 1518500249;
      d = (d << 5) | (d >>> 27);
      da = d & a;
      c += (da | (d & b) | ab) + blocks[10] + 1518500249;
      c = (c << 9) | (c >>> 23);
      cd = c & d;
      b += (cd | (c & a) | da) + blocks[14] + 1518500249;
      b = (b << 13) | (b >>> 19);
      bc = b & c;
      a += (bc | (b & d) | cd) + blocks[3] + 1518500249;
      a = (a << 3) | (a >>> 29);
      ab = a & b;
      d += (ab | (a & c) | bc) + blocks[7] + 1518500249;
      d = (d << 5) | (d >>> 27);
      da = d & a;
      c += (da | (d & b) | ab) + blocks[11] + 1518500249;
      c = (c << 9) | (c >>> 23);
      b += ((c & d) | (c & a) | da) + blocks[15] + 1518500249;
      b = (b << 13) | (b >>> 19);

      bc = b ^ c;
      a += (bc ^ d) + blocks[0] + 1859775393;
      a = (a << 3) | (a >>> 29);
      d += (bc ^ a) + blocks[8] + 1859775393;
      d = (d << 9) | (d >>> 23);
      da = d ^ a;
      c += (da ^ b) + blocks[4] + 1859775393;
      c = (c << 11) | (c >>> 21);
      b += (da ^ c) + blocks[12] + 1859775393;
      b = (b << 15) | (b >>> 17);
      bc = b ^ c;
      a += (bc ^ d) + blocks[2] + 1859775393;
      a = (a << 3) | (a >>> 29);
      d += (bc ^ a) + blocks[10] + 1859775393;
      d = (d << 9) | (d >>> 23);
      da = d ^ a;
      c += (da ^ b) + blocks[6] + 1859775393;
      c = (c << 11) | (c >>> 21);
      b += (da ^ c) + blocks[14] + 1859775393;
      b = (b << 15) | (b >>> 17);
      bc = b ^ c;
      a += (bc ^ d) + blocks[1] + 1859775393;
      a = (a << 3) | (a >>> 29);
      d += (bc ^ a) + blocks[9] + 1859775393;
      d = (d << 9) | (d >>> 23);
      da = d ^ a;
      c += (da ^ b) + blocks[5] + 1859775393;
      c = (c << 11) | (c >>> 21);
      b += (da ^ c) + blocks[13] + 1859775393;
      b = (b << 15) | (b >>> 17);
      bc = b ^ c;
      a += (bc ^ d) + blocks[3] + 1859775393;
      a = (a << 3) | (a >>> 29);
      d += (bc ^ a) + blocks[11] + 1859775393;
      d = (d << 9) | (d >>> 23);
      da = d ^ a;
      c += (da ^ b) + blocks[7] + 1859775393;
      c = (c << 11) | (c >>> 21);
      b += (da ^ c) + blocks[15] + 1859775393;
      b = (b << 15) | (b >>> 17);

      if(first) {
        h0 = a + 1732584193 << 0;
        h1 = b - 271733879 << 0;
        h2 = c - 1732584194 << 0;
        h3 = d + 271733878 << 0;
        first = false;
      } else {
        h0 = h0 + a << 0;
        h1 = h1 + b << 0;
        h2 = h2 + c << 0;
        h3 = h3 + d << 0;
      }
    } while(!end);

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
  };

  if(COMMON_JS) {
    module.exports = md4;
  } else {
    root.md4 = md4;
    if(AMD) {
      define(function() {
        return md4;
      });
    }
  }
}(this));
