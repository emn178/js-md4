(function(md4) {
  describe('md4', function() {
    describe('ascii', function() {
      describe('less than 64 bytes', function() {
        it('should be successful', function() {
          expect(md4('')).to.be('31d6cfe0d16ae931b73c59d7e0c089c0');
          expect(md4('The quick brown fox jumps over the lazy dog')).to.be('1bee69a46ba811185c194762abaeae90');
          expect(md4('The quick brown fox jumps over the lazy dog.')).to.be('2812c6c7136898c51f6f6739ad08750e');
        });
      });

      describe('more than 64 bytes', function() {
        it('should be successful', function() {
          expect(md4('The MD5 message-digest algorithm is a widely used cryptographic hash function producing a 128-bit (16-byte) hash value, typically expressed in text format as a 32 digit hexadecimal number. MD5 has been utilized in a wide variety of cryptographic applications, and is also commonly used to verify data integrity.')).to.be('e995876fc5a7870c478d20312edf17da');
        });
      });
    });

    describe('UTF8', function() {
      describe('less than 64 bytes', function() {
        it('should be successful', function() {
          expect(md4('中文')).to.be('223088bf7bd45a16436b15360c5fc5a0');
          expect(md4('aécio')).to.be('0b1f6347ef0be74383f7ae7547359a4c');
          expect(md4('𠜎')).to.be('cb17a223ccf45757d08260b6bfab78ab');
        });
      });

      describe('more than 64 bytes', function() {
        it('should be successful', function() {
          expect(md4('訊息摘要演算法第五版（英語：Message-Digest Algorithm 5，縮寫為MD5），是當前電腦領域用於確保資訊傳輸完整一致而廣泛使用的雜湊演算法之一')).to.be('968bd34f00469adbddbe6d803b28cff9');
          expect(md4('訊息摘要演算法第五版（英語：Message-Digest Algorithm 5，縮寫為MD5），是當前電腦領域用於確保資訊傳輸完整一致而廣泛使用的雜湊演算法之一（又譯雜湊演算法、摘要演算法等），主流程式語言普遍已有MD5的實作。')).to.be('2e03bd374f7be036d4fa838cb9662597');
        });
      });
    });

    describe('special length', function() {
      it('should be successful', function() {
        expect(md4('0123456780123456780123456780123456780123456780123456780')).to.be('91df808c37b8c5544391a3aa2196114e');
        expect(md4('01234567801234567801234567801234567801234567801234567801')).to.be('3825a0afe234b8029ccad9a31ec5f8ee');
        expect(md4('0123456780123456780123456780123456780123456780123456780123456780')).to.be('f9b968c94ec709be9f306d90cd424228');
        expect(md4('01234567801234567801234567801234567801234567801234567801234567801234567')).to.be('08b0ded59615dc18407569a9ceb263ba');
        expect(md4('012345678012345678012345678012345678012345678012345678012345678012345678')).to.be('9c637e494a39f7920c7e83b665284f03');
        expect(md4('012345678012345678012345678012345678012345678012345678012345678012345678012345678012345678012345678012345678012345678012345678012345678012345678')).to.be('47eebbaaa1fca842a7bff2d3b7c9f0c6');
      });
    });
  });
})(md4);
