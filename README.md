# js-md4
[![Build Status](https://travis-ci.org/emn178/js-md4.svg?branch=master)](https://travis-ci.org/emn178/js-md4)
[![Coverage Status](https://coveralls.io/repos/emn178/js-md4/badge.svg?branch=master)](https://coveralls.io/r/emn178/js-md4?branch=master)  
[![NPM](https://nodei.co/npm/js-md4.png?stars&downloads)](https://nodei.co/npm/js-md4/)  
A simple MD4 hash function for JavaScript supports UTF-8 encoding.

## Demo
[MD4 Online](http://emn178.github.io/online-tools/md4.html)  

## Download
[Compress](https://raw.github.com/emn178/js-md4/master/build/md4.min.js)  
[Uncompress](https://raw.github.com/emn178/js-md4/master/src/md4.js)

## Installation
You can also install js-md4 by using Bower.

    bower install js-md4

For node.js, you can use this command to install:

    npm install js-md4

## Usage
You could use like this:
```JavaScript
md4('Message to hash');
```
If you use node.js, you should require the module first:
```JavaScript
md4 = require('js-md4');
```

## Example
Code
```JavaScript
md4('');
md4('The quick brown fox jumps over the lazy dog');
md4('The quick brown fox jumps over the lazy dog.');
```
Output

    31d6cfe0d16ae931b73c59d7e0c089c0
    1bee69a46ba811185c194762abaeae90
    2812c6c7136898c51f6f6739ad08750e

It also supports UTF-8 encoding:

Code
```JavaScript
md4('中文');
```
Output

    223088bf7bd45a16436b15360c5fc5a0

## Extensions
### jQuery
If you prefer jQuery style, you can add following code to add a jQuery extension.

Code
```JavaScript
jQuery.md4 = md4
```
And then you could use like this:
```JavaScript
$.md4('message');
```
### Prototype
If you prefer prototype style, you can add following code to add a prototype extension.

Code
```JavaScript
String.prototype.md4 = function() {
  return md4(this);
};
```
And then you could use like this:
```JavaScript
'message'.md4();
```
## License
The project is released under the [MIT license](http://www.opensource.org/licenses/MIT).

## Contact
The project's website is located at https://github.com/emn178/js-md4  
Author: emn178@gmail.com
