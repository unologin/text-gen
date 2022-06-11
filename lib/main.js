"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.evalFileContents = exports.tokenize = void 0;
var vm_1 = __importDefault(require("vm"));
var path_1 = __importDefault(require("path"));
var fs_1 = require("fs");
/**
 *
 * @param file file contents
 * @returns text blocks, code blocks
 */
function tokenize(file) {
    var starterLength = 2;
    var enderLength = 2;
    var starts = Array.from(file.matchAll(/<\?/g));
    var ends = Array.from(file.matchAll(/\?>/g));
    if (starts.length !== ends.length) {
        throw new SyntaxError('Unmatched code start/end tags!');
    }
    var text = [];
    var code = [];
    starts.forEach(function (start, i) {
        var end = ends[i];
        if (start.index === undefined || end.index === undefined) {
            throw new SyntaxError('Undefined start/end position.');
        }
        var lastEnd = i > 0 ? (ends[i - 1].index + enderLength) :
            0;
        text.push(file.substr(lastEnd, start.index - lastEnd));
        var isOutput = file[start.index + starterLength] == '=';
        var codeStart = start.index +
            (isOutput ? starterLength + 1 : starterLength);
        code.push([
            file.substr(codeStart, end.index - codeStart),
            isOutput,
        ]);
    });
    text.push(file.substr(ends[ends.length - 1].index + enderLength, file.length));
    return [text, code];
}
exports.tokenize = tokenize;
/**
 * @param filePath path of the file to load
 * @param importer load function
 * @returns function which allows to evaluate with args
 */
function importFile(filePath, importer) {
    return function (args) { return evalTokens(tokenize(importer(filePath)), path_1.default.dirname(filePath), args, importer); };
}
/**
 *
 * @param param0 tokens
 * @param pwd pwd
 * @param vars optional context variables
 * @param importer load function
 * @returns text
 */
function evalTokens(_a, pwd, vars, importer) {
    var text = _a[0], code = _a[1];
    if (vars === void 0) { vars = {}; }
    var result = '';
    var context = __assign(__assign({}, vars), { write: function (s) { return s; }, writeln: function (s) { return s; }, load: function (p) { return importFile(path_1.default.resolve(pwd, p), importer); }, loadRaw: function (p) { return importer(path_1.default.resolve(pwd, p)); } });
    vm_1.default.createContext(context);
    text.forEach(function (t, i) {
        // if a text block after a code block starts with a line break
        if (i > 0 &&
            (t.startsWith('\n') || t.startsWith('\r'))) {
            // remove \r\n
            if (t.length >= 2 && t.charAt(0) == '\r' && t.charAt(1) == '\n') {
                result += t.substr(2, t.length);
            }
            // remove single \r or \n
            else {
                result += t.substr(1, t.length);
            }
        }
        else {
            result += t;
        }
        if (i < text.length - 1) {
            var _a = code[i], js = _a[0], isOutput_1 = _a[1];
            context.write = function (str) {
                if (!isOutput_1) {
                    result += str;
                }
                return str;
            };
            context.writeln = function (s) { return context.write(s + '\n'); };
            var evalResult = vm_1.default.runInContext(js, context);
            if (isOutput_1) {
                result += evalResult;
            }
        }
    });
    return result;
}
/**
 * @param file file contents
 * @param pwd containing dir of the file
 * @param vars context variables
 * @param importer load function
 * @returns evaluated file
 */
function evalFileContents(file, pwd, vars, importer) {
    if (pwd === void 0) { pwd = process.env.PWD || '/'; }
    if (vars === void 0) { vars = {}; }
    if (importer === void 0) { importer = (function (str) { return (0, fs_1.readFileSync)(str).toString(); }); }
    return evalTokens(tokenize(file), pwd, vars, importer);
}
exports.evalFileContents = evalFileContents;
/**
 * @param filePath file contents
 * @param vars context vars
 * @param importer load function
 * @returns evaluated file
 */
function evalFile(filePath, vars, importer) {
    if (vars === void 0) { vars = {}; }
    if (importer === void 0) { importer = (function (str) { return (0, fs_1.readFileSync)(str).toString(); }); }
    return evalTokens(tokenize(importer(filePath)), path_1.default.dirname(filePath), vars, importer);
}
exports.default = evalFile;
