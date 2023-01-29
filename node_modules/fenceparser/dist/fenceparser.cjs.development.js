'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

var isQuoted = function isQuoted(s) {
  var first = s[0];
  var last = s[s.length - 1];
  return s.length > 1 && first === last && (first === '"' || last === "'");
};
var Iterator = /*#__PURE__*/function () {
  function Iterator(input) {
    this.input = input;
    this.start = 0;
    this.current = 0;
  }

  var _proto = Iterator.prototype;

  _proto.error = function error(err) {
    throw new Error("Fenceparser: " + err + ".");
  };

  _proto.peek = function peek(n) {
    return this.input[this.current + (n != null ? n : 0)];
  };

  _proto.advance = function advance() {
    return this.input[this.current++];
  };

  _proto.isAtEnd = function isAtEnd() {
    return this.current >= this.input.length;
  };

  return Iterator;
}();

var lex = function lex(input) {
  return new Lexer(input).scan();
};
var KEYWORDS = {
  "true": true,
  "false": false
};

var isAlpha = function isAlpha(s) {
  return /[a-zA-Z_$-]/.test(s);
};

var isNumeric = function isNumeric(s) {
  return /[0-9]/.test(s);
};

var isAlphaNumeric = function isAlphaNumeric(s) {
  return isAlpha(s) || isNumeric(s);
};

var Lexer = /*#__PURE__*/function (_Iterator) {
  _inheritsLoose(Lexer, _Iterator);

  function Lexer() {
    var _this;

    _this = _Iterator.apply(this, arguments) || this;
    _this.output = [];
    return _this;
  }

  var _proto = Lexer.prototype;

  _proto.string = function string(quote) {
    while (this.peek() !== quote && !this.isAtEnd()) {
      this.advance();
    }

    if (this.isAtEnd()) {
      this.error('Unterminated string');
    }

    this.advance();
    this.output.push(this.input.substring(this.start, this.current));
  };

  _proto.number = function number() {
    while (isNumeric(this.peek()) && !this.isAtEnd()) {
      this.advance();
    }

    if (this.peek() === '-' && isNumeric(this.peek(1))) {
      this.advance();

      while (isNumeric(this.peek())) {
        this.advance();
      }

      this.output.push(this.input.substring(this.start, this.current));
      return;
    } else if (this.peek() === '.' && isNumeric(this.peek(1))) {
      this.advance();

      while (isNumeric(this.peek())) {
        this.advance();
      }
    }

    this.output.push(parseFloat(this.input.substring(this.start, this.current)));
  };

  _proto.identifier = function identifier() {
    while (isAlphaNumeric(this.peek()) && !this.isAtEnd()) {
      this.advance();
    }

    var text = this.input.substring(this.start, this.current);

    if (Object.keys(KEYWORDS).includes(text)) {
      this.output.push(KEYWORDS[text]);
    } else {
      this.output.push(text);
    }
  };

  _proto.scan = function scan() {
    while (!this.isAtEnd()) {
      this.start = this.current;
      var next = this.advance();

      switch (next) {
        case '{':
        case '}':
        case '=':
        case ',':
        case ':':
        case '[':
        case ']':
          this.output.push(next);
          break;

        case '"':
        case "'":
          this.string(next);
          break;

        case ' ':
        case '\r':
        case '\t':
        case '\n':
          break;

        default:
          if (isNumeric(next)) {
            this.number();
          } else if (isAlpha(next)) {
            this.identifier();
          } else {
            this.error("Unexpected character " + next);
          }

      }
    }

    return this.output;
  };

  return Lexer;
}(Iterator);

var parse = function parse(input) {
  return new Parser(input).parse();
};

var Parser = /*#__PURE__*/function (_Iterator) {
  _inheritsLoose(Parser, _Iterator);

  function Parser() {
    var _this;

    _this = _Iterator.apply(this, arguments) || this;
    _this.output = {};
    return _this;
  }

  var _proto = Parser.prototype;

  _proto.object = function object() {
    var _this2 = this;

    var result = {};

    var parseValue = function parseValue() {
      var identifier = _this2.advance();

      if (typeof identifier === 'number') {
        identifier = identifier;
      } else if (typeof identifier === 'string' && isQuoted(identifier)) {
        identifier = identifier.slice(1, -1);
      }

      identifier = identifier;

      if (_this2.peek() === ':') {
        _this2.advance();

        result[identifier] = _this2.value();
      } else {
        result[identifier] = true;
      }
    };

    this.advance();

    if (this.peek() !== '}') {
      parseValue();

      while (this.peek() === ',') {
        this.advance();

        if (this.peek() === '}') {
          this.error('Trailing comma');
        }

        parseValue();
      }
    }

    if (this.advance() !== '}') {
      this.error('Unterminated object');
    }

    return result;
  };

  _proto.array = function array() {
    var result = [];
    this.advance();

    if (this.peek() !== ']') {
      result.push(this.value());

      while (this.peek() === ',') {
        this.advance();

        if (this.peek() === ']') {
          this.error('Trailing comma');
        }

        result.push(this.value());
      }
    }

    if (this.advance() !== ']') {
      this.error('Unterminated array');
    }

    return result;
  };

  _proto.value = function value() {
    if (this.peek() === '{') {
      return this.object();
    } else if (this.peek() === '[') {
      return this.array();
    } else if (typeof this.peek() === 'string' && isQuoted(this.peek())) {
      return this.advance().slice(1, -1);
    } else {
      return this.advance();
    }
  };

  _proto.parse = function parse() {
    if (this.input.length < 1) {
      return null;
    }

    while (!this.isAtEnd()) {
      var peeked = this.peek();

      if (peeked === '{') {
        if (!this.output.highlight) {
          this.output.highlight = {};
        }

        this.output.highlight = _extends({}, this.output.highlight, this.object());
      } else {
        var identifier = this.advance();

        if (this.peek() === '=') {
          this.advance();
          this.output[identifier] = this.value();
        } else {
          this.output[identifier] = true;
        }
      }
    }

    return this.output;
  };

  return Parser;
}(Iterator);

var index = (function (input) {
  return parse(lex(input));
});

exports.default = index;
exports.lex = lex;
exports.parse = parse;
//# sourceMappingURL=fenceparser.cjs.development.js.map
