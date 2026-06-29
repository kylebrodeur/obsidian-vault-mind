var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../node_modules/.pnpm/json5@2.2.3/node_modules/json5/lib/unicode.js
var require_unicode = __commonJS({
  "../../node_modules/.pnpm/json5@2.2.3/node_modules/json5/lib/unicode.js"(exports2, module2) {
    module2.exports.Space_Separator = /[\u1680\u2000-\u200A\u202F\u205F\u3000]/;
    module2.exports.ID_Start = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE83\uDE86-\uDE89\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]/;
    module2.exports.ID_Continue = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09FC\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D00-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF9\u1D00-\u1DF9\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDE00-\uDE3E\uDE47\uDE50-\uDE83\uDE86-\uDE99\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/;
  }
});

// ../../node_modules/.pnpm/json5@2.2.3/node_modules/json5/lib/util.js
var require_util = __commonJS({
  "../../node_modules/.pnpm/json5@2.2.3/node_modules/json5/lib/util.js"(exports2, module2) {
    var unicode = require_unicode();
    module2.exports = {
      isSpaceSeparator(c) {
        return typeof c === "string" && unicode.Space_Separator.test(c);
      },
      isIdStartChar(c) {
        return typeof c === "string" && (c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c === "$" || c === "_" || unicode.ID_Start.test(c));
      },
      isIdContinueChar(c) {
        return typeof c === "string" && (c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c >= "0" && c <= "9" || c === "$" || c === "_" || c === "\u200C" || c === "\u200D" || unicode.ID_Continue.test(c));
      },
      isDigit(c) {
        return typeof c === "string" && /[0-9]/.test(c);
      },
      isHexDigit(c) {
        return typeof c === "string" && /[0-9A-Fa-f]/.test(c);
      }
    };
  }
});

// ../../node_modules/.pnpm/json5@2.2.3/node_modules/json5/lib/parse.js
var require_parse = __commonJS({
  "../../node_modules/.pnpm/json5@2.2.3/node_modules/json5/lib/parse.js"(exports2, module2) {
    var util = require_util();
    var source;
    var parseState;
    var stack;
    var pos;
    var line;
    var column;
    var token;
    var key;
    var root;
    module2.exports = function parse(text, reviver) {
      source = String(text);
      parseState = "start";
      stack = [];
      pos = 0;
      line = 1;
      column = 0;
      token = void 0;
      key = void 0;
      root = void 0;
      do {
        token = lex();
        parseStates[parseState]();
      } while (token.type !== "eof");
      if (typeof reviver === "function") {
        return internalize({ "": root }, "", reviver);
      }
      return root;
    };
    function internalize(holder, name, reviver) {
      const value = holder[name];
      if (value != null && typeof value === "object") {
        if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            const key2 = String(i);
            const replacement = internalize(value, key2, reviver);
            if (replacement === void 0) {
              delete value[key2];
            } else {
              Object.defineProperty(value, key2, {
                value: replacement,
                writable: true,
                enumerable: true,
                configurable: true
              });
            }
          }
        } else {
          for (const key2 in value) {
            const replacement = internalize(value, key2, reviver);
            if (replacement === void 0) {
              delete value[key2];
            } else {
              Object.defineProperty(value, key2, {
                value: replacement,
                writable: true,
                enumerable: true,
                configurable: true
              });
            }
          }
        }
      }
      return reviver.call(holder, name, value);
    }
    var lexState;
    var buffer;
    var doubleQuote;
    var sign;
    var c;
    function lex() {
      lexState = "default";
      buffer = "";
      doubleQuote = false;
      sign = 1;
      for (; ; ) {
        c = peek();
        const token2 = lexStates[lexState]();
        if (token2) {
          return token2;
        }
      }
    }
    function peek() {
      if (source[pos]) {
        return String.fromCodePoint(source.codePointAt(pos));
      }
    }
    function read() {
      const c2 = peek();
      if (c2 === "\n") {
        line++;
        column = 0;
      } else if (c2) {
        column += c2.length;
      } else {
        column++;
      }
      if (c2) {
        pos += c2.length;
      }
      return c2;
    }
    var lexStates = {
      default() {
        switch (c) {
          case "	":
          case "\v":
          case "\f":
          case " ":
          case "\xA0":
          case "\uFEFF":
          case "\n":
          case "\r":
          case "\u2028":
          case "\u2029":
            read();
            return;
          case "/":
            read();
            lexState = "comment";
            return;
          case void 0:
            read();
            return newToken("eof");
        }
        if (util.isSpaceSeparator(c)) {
          read();
          return;
        }
        return lexStates[parseState]();
      },
      comment() {
        switch (c) {
          case "*":
            read();
            lexState = "multiLineComment";
            return;
          case "/":
            read();
            lexState = "singleLineComment";
            return;
        }
        throw invalidChar(read());
      },
      multiLineComment() {
        switch (c) {
          case "*":
            read();
            lexState = "multiLineCommentAsterisk";
            return;
          case void 0:
            throw invalidChar(read());
        }
        read();
      },
      multiLineCommentAsterisk() {
        switch (c) {
          case "*":
            read();
            return;
          case "/":
            read();
            lexState = "default";
            return;
          case void 0:
            throw invalidChar(read());
        }
        read();
        lexState = "multiLineComment";
      },
      singleLineComment() {
        switch (c) {
          case "\n":
          case "\r":
          case "\u2028":
          case "\u2029":
            read();
            lexState = "default";
            return;
          case void 0:
            read();
            return newToken("eof");
        }
        read();
      },
      value() {
        switch (c) {
          case "{":
          case "[":
            return newToken("punctuator", read());
          case "n":
            read();
            literal("ull");
            return newToken("null", null);
          case "t":
            read();
            literal("rue");
            return newToken("boolean", true);
          case "f":
            read();
            literal("alse");
            return newToken("boolean", false);
          case "-":
          case "+":
            if (read() === "-") {
              sign = -1;
            }
            lexState = "sign";
            return;
          case ".":
            buffer = read();
            lexState = "decimalPointLeading";
            return;
          case "0":
            buffer = read();
            lexState = "zero";
            return;
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
            buffer = read();
            lexState = "decimalInteger";
            return;
          case "I":
            read();
            literal("nfinity");
            return newToken("numeric", Infinity);
          case "N":
            read();
            literal("aN");
            return newToken("numeric", NaN);
          case '"':
          case "'":
            doubleQuote = read() === '"';
            buffer = "";
            lexState = "string";
            return;
        }
        throw invalidChar(read());
      },
      identifierNameStartEscape() {
        if (c !== "u") {
          throw invalidChar(read());
        }
        read();
        const u = unicodeEscape();
        switch (u) {
          case "$":
          case "_":
            break;
          default:
            if (!util.isIdStartChar(u)) {
              throw invalidIdentifier();
            }
            break;
        }
        buffer += u;
        lexState = "identifierName";
      },
      identifierName() {
        switch (c) {
          case "$":
          case "_":
          case "\u200C":
          case "\u200D":
            buffer += read();
            return;
          case "\\":
            read();
            lexState = "identifierNameEscape";
            return;
        }
        if (util.isIdContinueChar(c)) {
          buffer += read();
          return;
        }
        return newToken("identifier", buffer);
      },
      identifierNameEscape() {
        if (c !== "u") {
          throw invalidChar(read());
        }
        read();
        const u = unicodeEscape();
        switch (u) {
          case "$":
          case "_":
          case "\u200C":
          case "\u200D":
            break;
          default:
            if (!util.isIdContinueChar(u)) {
              throw invalidIdentifier();
            }
            break;
        }
        buffer += u;
        lexState = "identifierName";
      },
      sign() {
        switch (c) {
          case ".":
            buffer = read();
            lexState = "decimalPointLeading";
            return;
          case "0":
            buffer = read();
            lexState = "zero";
            return;
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
            buffer = read();
            lexState = "decimalInteger";
            return;
          case "I":
            read();
            literal("nfinity");
            return newToken("numeric", sign * Infinity);
          case "N":
            read();
            literal("aN");
            return newToken("numeric", NaN);
        }
        throw invalidChar(read());
      },
      zero() {
        switch (c) {
          case ".":
            buffer += read();
            lexState = "decimalPoint";
            return;
          case "e":
          case "E":
            buffer += read();
            lexState = "decimalExponent";
            return;
          case "x":
          case "X":
            buffer += read();
            lexState = "hexadecimal";
            return;
        }
        return newToken("numeric", sign * 0);
      },
      decimalInteger() {
        switch (c) {
          case ".":
            buffer += read();
            lexState = "decimalPoint";
            return;
          case "e":
          case "E":
            buffer += read();
            lexState = "decimalExponent";
            return;
        }
        if (util.isDigit(c)) {
          buffer += read();
          return;
        }
        return newToken("numeric", sign * Number(buffer));
      },
      decimalPointLeading() {
        if (util.isDigit(c)) {
          buffer += read();
          lexState = "decimalFraction";
          return;
        }
        throw invalidChar(read());
      },
      decimalPoint() {
        switch (c) {
          case "e":
          case "E":
            buffer += read();
            lexState = "decimalExponent";
            return;
        }
        if (util.isDigit(c)) {
          buffer += read();
          lexState = "decimalFraction";
          return;
        }
        return newToken("numeric", sign * Number(buffer));
      },
      decimalFraction() {
        switch (c) {
          case "e":
          case "E":
            buffer += read();
            lexState = "decimalExponent";
            return;
        }
        if (util.isDigit(c)) {
          buffer += read();
          return;
        }
        return newToken("numeric", sign * Number(buffer));
      },
      decimalExponent() {
        switch (c) {
          case "+":
          case "-":
            buffer += read();
            lexState = "decimalExponentSign";
            return;
        }
        if (util.isDigit(c)) {
          buffer += read();
          lexState = "decimalExponentInteger";
          return;
        }
        throw invalidChar(read());
      },
      decimalExponentSign() {
        if (util.isDigit(c)) {
          buffer += read();
          lexState = "decimalExponentInteger";
          return;
        }
        throw invalidChar(read());
      },
      decimalExponentInteger() {
        if (util.isDigit(c)) {
          buffer += read();
          return;
        }
        return newToken("numeric", sign * Number(buffer));
      },
      hexadecimal() {
        if (util.isHexDigit(c)) {
          buffer += read();
          lexState = "hexadecimalInteger";
          return;
        }
        throw invalidChar(read());
      },
      hexadecimalInteger() {
        if (util.isHexDigit(c)) {
          buffer += read();
          return;
        }
        return newToken("numeric", sign * Number(buffer));
      },
      string() {
        switch (c) {
          case "\\":
            read();
            buffer += escape();
            return;
          case '"':
            if (doubleQuote) {
              read();
              return newToken("string", buffer);
            }
            buffer += read();
            return;
          case "'":
            if (!doubleQuote) {
              read();
              return newToken("string", buffer);
            }
            buffer += read();
            return;
          case "\n":
          case "\r":
            throw invalidChar(read());
          case "\u2028":
          case "\u2029":
            separatorChar(c);
            break;
          case void 0:
            throw invalidChar(read());
        }
        buffer += read();
      },
      start() {
        switch (c) {
          case "{":
          case "[":
            return newToken("punctuator", read());
        }
        lexState = "value";
      },
      beforePropertyName() {
        switch (c) {
          case "$":
          case "_":
            buffer = read();
            lexState = "identifierName";
            return;
          case "\\":
            read();
            lexState = "identifierNameStartEscape";
            return;
          case "}":
            return newToken("punctuator", read());
          case '"':
          case "'":
            doubleQuote = read() === '"';
            lexState = "string";
            return;
        }
        if (util.isIdStartChar(c)) {
          buffer += read();
          lexState = "identifierName";
          return;
        }
        throw invalidChar(read());
      },
      afterPropertyName() {
        if (c === ":") {
          return newToken("punctuator", read());
        }
        throw invalidChar(read());
      },
      beforePropertyValue() {
        lexState = "value";
      },
      afterPropertyValue() {
        switch (c) {
          case ",":
          case "}":
            return newToken("punctuator", read());
        }
        throw invalidChar(read());
      },
      beforeArrayValue() {
        if (c === "]") {
          return newToken("punctuator", read());
        }
        lexState = "value";
      },
      afterArrayValue() {
        switch (c) {
          case ",":
          case "]":
            return newToken("punctuator", read());
        }
        throw invalidChar(read());
      },
      end() {
        throw invalidChar(read());
      }
    };
    function newToken(type, value) {
      return {
        type,
        value,
        line,
        column
      };
    }
    function literal(s) {
      for (const c2 of s) {
        const p = peek();
        if (p !== c2) {
          throw invalidChar(read());
        }
        read();
      }
    }
    function escape() {
      const c2 = peek();
      switch (c2) {
        case "b":
          read();
          return "\b";
        case "f":
          read();
          return "\f";
        case "n":
          read();
          return "\n";
        case "r":
          read();
          return "\r";
        case "t":
          read();
          return "	";
        case "v":
          read();
          return "\v";
        case "0":
          read();
          if (util.isDigit(peek())) {
            throw invalidChar(read());
          }
          return "\0";
        case "x":
          read();
          return hexEscape();
        case "u":
          read();
          return unicodeEscape();
        case "\n":
        case "\u2028":
        case "\u2029":
          read();
          return "";
        case "\r":
          read();
          if (peek() === "\n") {
            read();
          }
          return "";
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          throw invalidChar(read());
        case void 0:
          throw invalidChar(read());
      }
      return read();
    }
    function hexEscape() {
      let buffer2 = "";
      let c2 = peek();
      if (!util.isHexDigit(c2)) {
        throw invalidChar(read());
      }
      buffer2 += read();
      c2 = peek();
      if (!util.isHexDigit(c2)) {
        throw invalidChar(read());
      }
      buffer2 += read();
      return String.fromCodePoint(parseInt(buffer2, 16));
    }
    function unicodeEscape() {
      let buffer2 = "";
      let count = 4;
      while (count-- > 0) {
        const c2 = peek();
        if (!util.isHexDigit(c2)) {
          throw invalidChar(read());
        }
        buffer2 += read();
      }
      return String.fromCodePoint(parseInt(buffer2, 16));
    }
    var parseStates = {
      start() {
        if (token.type === "eof") {
          throw invalidEOF();
        }
        push();
      },
      beforePropertyName() {
        switch (token.type) {
          case "identifier":
          case "string":
            key = token.value;
            parseState = "afterPropertyName";
            return;
          case "punctuator":
            pop();
            return;
          case "eof":
            throw invalidEOF();
        }
      },
      afterPropertyName() {
        if (token.type === "eof") {
          throw invalidEOF();
        }
        parseState = "beforePropertyValue";
      },
      beforePropertyValue() {
        if (token.type === "eof") {
          throw invalidEOF();
        }
        push();
      },
      beforeArrayValue() {
        if (token.type === "eof") {
          throw invalidEOF();
        }
        if (token.type === "punctuator" && token.value === "]") {
          pop();
          return;
        }
        push();
      },
      afterPropertyValue() {
        if (token.type === "eof") {
          throw invalidEOF();
        }
        switch (token.value) {
          case ",":
            parseState = "beforePropertyName";
            return;
          case "}":
            pop();
        }
      },
      afterArrayValue() {
        if (token.type === "eof") {
          throw invalidEOF();
        }
        switch (token.value) {
          case ",":
            parseState = "beforeArrayValue";
            return;
          case "]":
            pop();
        }
      },
      end() {
      }
    };
    function push() {
      let value;
      switch (token.type) {
        case "punctuator":
          switch (token.value) {
            case "{":
              value = {};
              break;
            case "[":
              value = [];
              break;
          }
          break;
        case "null":
        case "boolean":
        case "numeric":
        case "string":
          value = token.value;
          break;
      }
      if (root === void 0) {
        root = value;
      } else {
        const parent = stack[stack.length - 1];
        if (Array.isArray(parent)) {
          parent.push(value);
        } else {
          Object.defineProperty(parent, key, {
            value,
            writable: true,
            enumerable: true,
            configurable: true
          });
        }
      }
      if (value !== null && typeof value === "object") {
        stack.push(value);
        if (Array.isArray(value)) {
          parseState = "beforeArrayValue";
        } else {
          parseState = "beforePropertyName";
        }
      } else {
        const current = stack[stack.length - 1];
        if (current == null) {
          parseState = "end";
        } else if (Array.isArray(current)) {
          parseState = "afterArrayValue";
        } else {
          parseState = "afterPropertyValue";
        }
      }
    }
    function pop() {
      stack.pop();
      const current = stack[stack.length - 1];
      if (current == null) {
        parseState = "end";
      } else if (Array.isArray(current)) {
        parseState = "afterArrayValue";
      } else {
        parseState = "afterPropertyValue";
      }
    }
    function invalidChar(c2) {
      if (c2 === void 0) {
        return syntaxError(`JSON5: invalid end of input at ${line}:${column}`);
      }
      return syntaxError(`JSON5: invalid character '${formatChar(c2)}' at ${line}:${column}`);
    }
    function invalidEOF() {
      return syntaxError(`JSON5: invalid end of input at ${line}:${column}`);
    }
    function invalidIdentifier() {
      column -= 5;
      return syntaxError(`JSON5: invalid identifier character at ${line}:${column}`);
    }
    function separatorChar(c2) {
      console.warn(`JSON5: '${formatChar(c2)}' in strings is not valid ECMAScript; consider escaping`);
    }
    function formatChar(c2) {
      const replacements = {
        "'": "\\'",
        '"': '\\"',
        "\\": "\\\\",
        "\b": "\\b",
        "\f": "\\f",
        "\n": "\\n",
        "\r": "\\r",
        "	": "\\t",
        "\v": "\\v",
        "\0": "\\0",
        "\u2028": "\\u2028",
        "\u2029": "\\u2029"
      };
      if (replacements[c2]) {
        return replacements[c2];
      }
      if (c2 < " ") {
        const hexString = c2.charCodeAt(0).toString(16);
        return "\\x" + ("00" + hexString).substring(hexString.length);
      }
      return c2;
    }
    function syntaxError(message) {
      const err = new SyntaxError(message);
      err.lineNumber = line;
      err.columnNumber = column;
      return err;
    }
  }
});

// ../../node_modules/.pnpm/json5@2.2.3/node_modules/json5/lib/stringify.js
var require_stringify = __commonJS({
  "../../node_modules/.pnpm/json5@2.2.3/node_modules/json5/lib/stringify.js"(exports2, module2) {
    var util = require_util();
    module2.exports = function stringify(value, replacer, space) {
      const stack = [];
      let indent = "";
      let propertyList;
      let replacerFunc;
      let gap = "";
      let quote;
      if (replacer != null && typeof replacer === "object" && !Array.isArray(replacer)) {
        space = replacer.space;
        quote = replacer.quote;
        replacer = replacer.replacer;
      }
      if (typeof replacer === "function") {
        replacerFunc = replacer;
      } else if (Array.isArray(replacer)) {
        propertyList = [];
        for (const v of replacer) {
          let item;
          if (typeof v === "string") {
            item = v;
          } else if (typeof v === "number" || v instanceof String || v instanceof Number) {
            item = String(v);
          }
          if (item !== void 0 && propertyList.indexOf(item) < 0) {
            propertyList.push(item);
          }
        }
      }
      if (space instanceof Number) {
        space = Number(space);
      } else if (space instanceof String) {
        space = String(space);
      }
      if (typeof space === "number") {
        if (space > 0) {
          space = Math.min(10, Math.floor(space));
          gap = "          ".substr(0, space);
        }
      } else if (typeof space === "string") {
        gap = space.substr(0, 10);
      }
      return serializeProperty("", { "": value });
      function serializeProperty(key, holder) {
        let value2 = holder[key];
        if (value2 != null) {
          if (typeof value2.toJSON5 === "function") {
            value2 = value2.toJSON5(key);
          } else if (typeof value2.toJSON === "function") {
            value2 = value2.toJSON(key);
          }
        }
        if (replacerFunc) {
          value2 = replacerFunc.call(holder, key, value2);
        }
        if (value2 instanceof Number) {
          value2 = Number(value2);
        } else if (value2 instanceof String) {
          value2 = String(value2);
        } else if (value2 instanceof Boolean) {
          value2 = value2.valueOf();
        }
        switch (value2) {
          case null:
            return "null";
          case true:
            return "true";
          case false:
            return "false";
        }
        if (typeof value2 === "string") {
          return quoteString(value2, false);
        }
        if (typeof value2 === "number") {
          return String(value2);
        }
        if (typeof value2 === "object") {
          return Array.isArray(value2) ? serializeArray(value2) : serializeObject(value2);
        }
        return void 0;
      }
      function quoteString(value2) {
        const quotes = {
          "'": 0.1,
          '"': 0.2
        };
        const replacements = {
          "'": "\\'",
          '"': '\\"',
          "\\": "\\\\",
          "\b": "\\b",
          "\f": "\\f",
          "\n": "\\n",
          "\r": "\\r",
          "	": "\\t",
          "\v": "\\v",
          "\0": "\\0",
          "\u2028": "\\u2028",
          "\u2029": "\\u2029"
        };
        let product = "";
        for (let i = 0; i < value2.length; i++) {
          const c = value2[i];
          switch (c) {
            case "'":
            case '"':
              quotes[c]++;
              product += c;
              continue;
            case "\0":
              if (util.isDigit(value2[i + 1])) {
                product += "\\x00";
                continue;
              }
          }
          if (replacements[c]) {
            product += replacements[c];
            continue;
          }
          if (c < " ") {
            let hexString = c.charCodeAt(0).toString(16);
            product += "\\x" + ("00" + hexString).substring(hexString.length);
            continue;
          }
          product += c;
        }
        const quoteChar = quote || Object.keys(quotes).reduce((a, b) => quotes[a] < quotes[b] ? a : b);
        product = product.replace(new RegExp(quoteChar, "g"), replacements[quoteChar]);
        return quoteChar + product + quoteChar;
      }
      function serializeObject(value2) {
        if (stack.indexOf(value2) >= 0) {
          throw TypeError("Converting circular structure to JSON5");
        }
        stack.push(value2);
        let stepback = indent;
        indent = indent + gap;
        let keys = propertyList || Object.keys(value2);
        let partial = [];
        for (const key of keys) {
          const propertyString = serializeProperty(key, value2);
          if (propertyString !== void 0) {
            let member = serializeKey(key) + ":";
            if (gap !== "") {
              member += " ";
            }
            member += propertyString;
            partial.push(member);
          }
        }
        let final;
        if (partial.length === 0) {
          final = "{}";
        } else {
          let properties;
          if (gap === "") {
            properties = partial.join(",");
            final = "{" + properties + "}";
          } else {
            let separator = ",\n" + indent;
            properties = partial.join(separator);
            final = "{\n" + indent + properties + ",\n" + stepback + "}";
          }
        }
        stack.pop();
        indent = stepback;
        return final;
      }
      function serializeKey(key) {
        if (key.length === 0) {
          return quoteString(key, true);
        }
        const firstChar = String.fromCodePoint(key.codePointAt(0));
        if (!util.isIdStartChar(firstChar)) {
          return quoteString(key, true);
        }
        for (let i = firstChar.length; i < key.length; i++) {
          if (!util.isIdContinueChar(String.fromCodePoint(key.codePointAt(i)))) {
            return quoteString(key, true);
          }
        }
        return key;
      }
      function serializeArray(value2) {
        if (stack.indexOf(value2) >= 0) {
          throw TypeError("Converting circular structure to JSON5");
        }
        stack.push(value2);
        let stepback = indent;
        indent = indent + gap;
        let partial = [];
        for (let i = 0; i < value2.length; i++) {
          const propertyString = serializeProperty(String(i), value2);
          partial.push(propertyString !== void 0 ? propertyString : "null");
        }
        let final;
        if (partial.length === 0) {
          final = "[]";
        } else {
          if (gap === "") {
            let properties = partial.join(",");
            final = "[" + properties + "]";
          } else {
            let separator = ",\n" + indent;
            let properties = partial.join(separator);
            final = "[\n" + indent + properties + ",\n" + stepback + "]";
          }
        }
        stack.pop();
        indent = stepback;
        return final;
      }
    };
  }
});

// ../../node_modules/.pnpm/json5@2.2.3/node_modules/json5/lib/index.js
var require_lib = __commonJS({
  "../../node_modules/.pnpm/json5@2.2.3/node_modules/json5/lib/index.js"(exports2, module2) {
    var parse = require_parse();
    var stringify = require_stringify();
    var JSON52 = {
      parse,
      stringify
    };
    module2.exports = JSON52;
  }
});

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => VaultMindPlugin
});
module.exports = __toCommonJS(main_exports);
var import_node_child_process3 = require("node:child_process");
var import_node_fs3 = require("node:fs");
var import_node_path3 = __toESM(require("node:path"), 1);
var import_node_util = require("node:util");
var import_view = require("@codemirror/view");
var import_obsidian18 = require("obsidian");

// ../../node_modules/.pnpm/@arrow-js+core@1.0.6/node_modules/@arrow-js/core/dist/chunks/internal-DchK7S7v.mjs
var queueMarker = Symbol();
var queueStack = [];
var nextTicks = [];
var cleanupCollector = null;
function nextTick(fn) {
  return !queueStack.length ? Promise.resolve(fn?.()) : new Promise((resolve) => nextTicks.push(() => {
    fn?.();
    resolve();
  }));
}
function isTpl(template) {
  return typeof template === "function" && !!template.isT;
}
function isO(obj) {
  return obj !== null && typeof obj === "object";
}
function isR(obj) {
  return isO(obj) && "$on" in obj;
}
function isChunk(chunk) {
  return isO(chunk) && "ref" in chunk;
}
function queue(fn) {
  const queued = fn;
  return (newValue, oldValue) => {
    if (!queued[queueMarker]) {
      queued[queueMarker] = true;
      queued._n = newValue;
      queued._o = oldValue;
      if (!queueStack.length) {
        queueMicrotask(executeQueue);
      }
      queueStack.push(queued);
    }
  };
}
function executeQueue() {
  const queue2 = queueStack;
  queueStack = [];
  const ticks = nextTicks;
  nextTicks = [];
  for (let i = 0; i < queue2.length; i++) {
    const fn = queue2[i];
    const newValue = fn._n;
    const oldValue = fn._o;
    fn._n = void 0;
    fn._o = void 0;
    fn[queueMarker] = false;
    fn(newValue, oldValue);
  }
  for (let i = 0; i < ticks.length; i++)
    ticks[i]();
  if (queueStack.length) {
    queueMicrotask(executeQueue);
  }
}
function swapCleanupCollector(collector) {
  const previous = cleanupCollector;
  cleanupCollector = collector;
  return previous;
}
function registerCleanup(fn) {
  cleanupCollector?.push(fn);
}
function setAttr(node, attrName, value) {
  if (attrName === ".innerhtml")
    attrName = ".innerHTML";
  const isIDL = attrName === "value" && "value" in node || attrName === "checked" || attrName[0] === "." && (attrName = attrName.slice(1));
  if (isIDL) {
    node[attrName] = value;
    if (node.getAttribute(attrName) != value)
      value = false;
  }
  value !== false ? node.setAttribute(attrName, value) : node.removeAttribute(attrName);
}
var expressionPool = [];
var expressionObservers = [];
var expressionObserverAttrs = [];
var freeExpressionPointers = [];
var cursor = 0;
function createExpressionBlock(len) {
  const bucket = freeExpressionPointers[len];
  const pointer = bucket?.length ? bucket.pop() : cursor;
  expressionPool[pointer] = len;
  if (pointer === cursor)
    cursor += len + 1;
  return pointer;
}
function writeExpressions(expSlots, pointer, offset = 0) {
  const len = expressionPool[pointer];
  for (let i = 1; i <= len; i++) {
    const nextValue = expSlots[offset + i - 1];
    const target = pointer + i;
    if (Object.is(expressionPool[target], nextValue))
      continue;
    expressionPool[target] = nextValue;
    const observer = expressionObservers[target];
    if (!observer)
      continue;
    const attr = expressionObserverAttrs[target];
    if (attr !== void 0)
      setAttr(observer, attr, nextValue);
    else if (typeof observer === "function")
      observer(nextValue);
    else
      observer.data = nextValue || nextValue === 0 ? nextValue : "";
  }
}
function onExpressionUpdate(pointer, observer, attrName) {
  expressionObservers[pointer] = observer;
  expressionObserverAttrs[pointer] = attrName;
}
function releaseExpressions(pointer) {
  const len = expressionPool[pointer];
  if (len === void 0)
    return;
  for (let i = 0; i <= len; i++) {
    expressionPool[pointer + i] = void 0;
    expressionObservers[pointer + i] = void 0;
    expressionObserverAttrs[pointer + i] = void 0;
  }
  (freeExpressionPointers[len] ??= []).push(pointer);
}
var ids = /* @__PURE__ */ new WeakMap();
var computedIds = [];
var listeners = [];
var getId = (target) => ids.get(target);
var index = -1;
var watchIndex = 0;
var trackKey = 0;
var trackedDependencies = [];
var watchedDependencies = [];
var dependencyPool = [];
var arrayMutationWrappers = [];
var arrayMutations = {
  push: 1,
  pop: 1,
  shift: 1,
  unshift: 1,
  splice: 1,
  sort: 1,
  copyWithin: 1,
  fill: 1,
  reverse: 1
};
var parents = [];
function reactive(data) {
  if (typeof data === "function") {
    const state = reactive({
      value: void 0
    });
    computedIds[getId(state)] = true;
    watch(data, (value) => state.value = value);
    return state;
  }
  if (isR(data))
    return data;
  if (!isO(data))
    throw Error("Expected object");
  const id = ++index;
  listeners[id] = {};
  const proxy = new Proxy(data, proxyHandler);
  ids.set(data, id).set(proxy, id);
  return proxy;
}
function trackArray(id, key, target, value) {
  if (typeof value === "function" && arrayMutations[key]) {
    let wrappers = arrayMutationWrappers[id];
    if (!wrappers)
      wrappers = arrayMutationWrappers[id] = {};
    let wrapper = wrappers[key];
    if (!wrapper) {
      wrapper = (...args) => {
        const result = Reflect.apply(value, target, args);
        emitParents(id);
        return result;
      };
      wrappers[key] = wrapper;
    }
    return wrapper;
  }
  if (isComputed(value))
    return readComputed(value, id, key);
  if (key !== "length" && typeof value !== "function") {
    track(id, key);
  }
  return value;
}
var proxyHandler = {
  has(target, key) {
    if (key in api)
      return true;
    track(getId(target), key);
    return key in target;
  },
  get(target, key, receiver) {
    const id = getId(target);
    if (key in api)
      return api[key];
    const result = Reflect.get(target, key, receiver);
    let child;
    if (isO(result) && !isR(result)) {
      child = createChild(result, id, key);
      target[key] = child;
    }
    const value = child ?? result;
    if (Array.isArray(target))
      return trackArray(id, key, target, value);
    if (isComputed(value))
      return readComputed(value, id, key);
    track(id, key);
    return value;
  },
  set(target, key, value, receiver) {
    const id = getId(target);
    const isNewProperty = !(key in target);
    const newReactive = isO(value) && !isR(value) ? createChild(value, id, key) : null;
    const oldValue = target[key];
    const newValue = newReactive ?? value;
    if (isR(newValue) && computedIds[getId(newValue)]) {
      linkParent(getId(newValue), id, key);
    }
    const didSucceed = Reflect.set(target, key, newValue, receiver);
    if (oldValue !== newValue && isR(oldValue) && isR(newValue)) {
      const oldParents = parents[getId(oldValue)];
      if (oldParents) {
        let index2 = -1;
        for (let i = 0; i < oldParents.length; i++) {
          const [parent, property] = oldParents[i];
          if (parent == id && property == key) {
            index2 = i;
            break;
          }
        }
        if (index2 > -1)
          oldParents.splice(index2, 1);
      }
      linkParent(getId(newValue), id, key);
    }
    emit(id, key, value, oldValue, isNewProperty || key === "value" && computedIds[id]);
    if (Array.isArray(target) && key === "length") {
      emitParents(id);
    }
    return didSucceed;
  }
};
function createChild(child, parentId, key) {
  const r = reactive(child);
  linkParent(getId(child), parentId, key);
  return r;
}
function isComputed(value) {
  return isR(value) && computedIds[getId(value)];
}
function readComputed(value, parentId, key) {
  const computedId = getId(value);
  track(parentId, key);
  linkParent(computedId, parentId, key);
  track(computedId, "value");
  return value.value;
}
function linkParent(childId, parentId, key) {
  const entries = parents[childId];
  if (entries) {
    for (let i = 0; i < entries.length; i++) {
      const [parent, property] = entries[i];
      if (parent === parentId && property === key)
        return;
    }
  } else {
    parents[childId] = [];
  }
  parents[childId].push([parentId, key]);
}
function emit(id, key, newValue, oldValue, notifyParents) {
  const targetListeners = listeners[id];
  const propertyListeners = targetListeners[key];
  if (propertyListeners) {
    if (Array.isArray(propertyListeners)) {
      for (let i = 0; i < propertyListeners.length; i++) {
        propertyListeners[i](newValue, oldValue);
      }
    } else {
      propertyListeners(newValue, oldValue);
    }
  }
  if (notifyParents) {
    emitParents(id);
  }
}
function emitParents(id) {
  const parentEntries = parents[id];
  if (!parentEntries)
    return;
  for (let i = 0; i < parentEntries.length; i++) {
    const [parentId, property] = parentEntries[i];
    emit(parentId, property);
  }
}
function reactiveOn(property, callback) {
  addListener(listeners[getId(this)], property, callback);
}
function reactiveOff(property, callback) {
  removeListener(listeners[getId(this)], property, callback);
}
var api = {
  $on: reactiveOn,
  $off: reactiveOff
};
function track(id, property) {
  if (!trackKey)
    return;
  trackedDependencies[trackKey].push(id, property);
}
function startTracking() {
  trackedDependencies[++trackKey] = dependencyPool.pop() ?? [];
}
function stopTracking(watchKey, callback) {
  const key = trackKey--;
  const deps = trackedDependencies[key];
  const previousDeps = watchedDependencies[watchKey];
  const previousLength = previousDeps?.length;
  if (previousLength && previousLength === deps.length) {
    let matched = true;
    for (let i = 0; i < previousLength; i++) {
      if (previousDeps[i] === deps[i])
        continue;
      matched = false;
      break;
    }
    if (matched) {
      watchedDependencies[watchKey] = previousDeps;
      deps.length = 0;
      dependencyPool.push(deps);
      trackedDependencies[key] = void 0;
      return;
    }
  }
  flushListeners(previousDeps, callback);
  for (let i = 0; i < deps.length; i += 2) {
    addListener(listeners[deps[i]], deps[i + 1], callback);
  }
  watchedDependencies[watchKey] = deps;
  trackedDependencies[key] = void 0;
}
function flushListeners(deps, callback) {
  if (!deps)
    return;
  for (let i = 0; i < deps.length; i += 2) {
    removeListener(listeners[deps[i]], deps[i + 1], callback);
  }
  deps.length = 0;
  dependencyPool.push(deps);
}
function addListener(targetListeners, key, callback) {
  const slot = targetListeners[key];
  if (!slot) {
    targetListeners[key] = callback;
    return;
  }
  if (Array.isArray(slot)) {
    if (!slot.includes(callback))
      slot.push(callback);
    return;
  }
  if (slot !== callback)
    targetListeners[key] = [slot, callback];
}
function removeListener(targetListeners, key, callback) {
  const slot = targetListeners[key];
  if (!slot)
    return;
  if (Array.isArray(slot)) {
    const index2 = slot.indexOf(callback);
    if (index2 < 0)
      return;
    if (slot.length === 2) {
      targetListeners[key] = slot[index2 ? 0 : 1];
      return;
    }
    slot.splice(index2, 1);
    return;
  }
  if (slot === callback) {
    delete targetListeners[key];
  }
}
function watch(effect, afterEffect) {
  const watchKey = ++watchIndex;
  const isPointer = typeof effect === "number";
  let rerun = queue(runEffect);
  function runEffect() {
    startTracking();
    const effectValue = isPointer ? expressionPool[effect]() : effect();
    stopTracking(watchKey, rerun);
    return afterEffect ? afterEffect(effectValue) : effectValue;
  }
  const stop = () => {
    flushListeners(watchedDependencies[watchKey], rerun);
    watchedDependencies[watchKey] = void 0;
    if (isPointer)
      onExpressionUpdate(effect);
    rerun = null;
  };
  if (!isPointer)
    registerCleanup(stop);
  if (isPointer)
    onExpressionUpdate(effect, runEffect);
  return [runEffect(), stop];
}
var AsyncFunction = (async () => {
}).constructor;
var propsProxyHandler = {
  get(target, key) {
    return target[0]?.[key];
  },
  has(target, key) {
    return key in (target[0] || {});
  },
  ownKeys(target) {
    return Reflect.ownKeys(target[0] || {});
  },
  getOwnPropertyDescriptor(target, key) {
    const source = target[0];
    return source && {
      configurable: true,
      enumerable: true,
      writable: true,
      value: source[key]
    };
  },
  set(target, key, value) {
    return !!target[0] && Reflect.set(target[0], key, value);
  }
};
function isCmp(value) {
  return !!value && typeof value === "object" && "h" in value;
}
function createPropsProxy(source, factory, events) {
  const box = reactive({ 0: source, 1: factory, 2: events });
  const emit2 = ((event, payload) => {
    const handler = box[2]?.[event];
    if (typeof handler === "function")
      handler(payload);
  });
  return [
    new Proxy(box, propsProxyHandler),
    emit2,
    box
  ];
}
var hydrationCaptureProvider = null;
function getHydrationCapture() {
  return hydrationCaptureProvider?.() ?? null;
}
function registerHydrationHook(chunk, hook) {
  const capture = getHydrationCapture();
  if (!capture)
    return;
  const hooks = capture.hooks.get(chunk);
  if (hooks) {
    hooks.push(hook);
  } else {
    capture.hooks.set(chunk, [hook]);
  }
}
function adoptCapturedChunk(capture, chunk, map, visited = /* @__PURE__ */ new WeakSet()) {
  if (visited.has(chunk))
    return;
  visited.add(chunk);
  const ref = chunk.ref;
  if (ref.f)
    ref.f = map.get(ref.f) ?? ref.f;
  if (ref.l)
    ref.l = map.get(ref.l) ?? ref.l;
  capture.hooks.get(chunk)?.forEach((hook) => hook(map, visited));
}

// ../../node_modules/.pnpm/@arrow-js+core@1.0.6/node_modules/@arrow-js/core/dist/index.mjs
var eventBindingsKey = Symbol();
var bindingStackPos = -1;
var bindingStack = [];
var nodeStack = [];
var delimiter = "\xA4";
var delimiterComment = `<!--${delimiter}-->`;
var initialChunkPoolSize = 1024;
var chunkMemo = /* @__PURE__ */ new WeakMap();
var chunkMemoByRef = /* @__PURE__ */ new WeakMap();
var staleById = /* @__PURE__ */ new Map();
var staleBySignature = /* @__PURE__ */ new Map();
var chunkPoolHead;
var renderedMark = 0;
growChunkPool(initialChunkPoolSize);
function moveDOMRef(ref, parent, before) {
  let node = ref.f;
  if (!parent || !node)
    return;
  const last = ref.l;
  while (true) {
    const next = node === last ? null : node.nextSibling;
    parent.insertBefore(node, before || null);
    if (!next)
      return;
    node = next;
  }
}
function canSyncTemplateChunk(template, chunk) {
  return chunk.g === getChunkProto(template).g;
}
function getChunkProto(template) {
  const cached = template._p;
  if (cached)
    return cached;
  return template._p = resolveChunkProto(template._s);
}
function resolveChunkProto(rawStrings, svg) {
  const doc = document;
  let memoByRef = svg ? void 0 : chunkMemoByRef.get(rawStrings);
  const cachedByRef = memoByRef?.get(doc);
  if (cachedByRef)
    return cachedByRef;
  const signature = rawStrings.join(delimiterComment);
  const cacheKey = svg ? `${delimiter}${signature}` : signature;
  let signatureMemo = chunkMemo.get(doc);
  if (!signatureMemo) {
    signatureMemo = {};
    chunkMemo.set(doc, signatureMemo);
  }
  const cached = signatureMemo[cacheKey];
  if (cached) {
    if (!svg) {
      memoByRef ??= /* @__PURE__ */ new WeakMap();
      memoByRef.set(doc, cached);
      chunkMemoByRef.set(rawStrings, memoByRef);
    }
    return cached;
  }
  const template = document.createElement("template");
  if (svg) {
    template.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">${signature}</svg>`;
    const root = template.content.firstChild;
    if (root) {
      const content = template.content;
      while (root.firstChild)
        content.appendChild(root.firstChild);
      content.removeChild(root);
    }
  } else {
    template.innerHTML = signature;
  }
  const paths = createPaths(template.content);
  normalizeNodePlaceholders(template.content);
  const expressions = rawStrings.length - 1;
  let count = 0;
  for (let i = 0; i < paths[0].length; ) {
    i += (paths[0][i + 1] ?? 0) + 3;
    count++;
  }
  if (count !== expressions) {
    throw Error("Invalid HTML position");
  }
  const created = {
    template,
    paths,
    g: cacheKey,
    expressions
  };
  if (!svg) {
    memoByRef ??= /* @__PURE__ */ new WeakMap();
    memoByRef.set(doc, created);
    chunkMemoByRef.set(rawStrings, memoByRef);
  }
  signatureMemo[cacheKey] = created;
  return created;
}
function syncTemplateToChunk(template, chunk, mounted = false) {
  if (chunk._t === template) {
    chunk.k = template._k;
    chunk.i = template._i;
    template._h = chunk;
    template._m = mounted;
    return;
  }
  if (chunk._t && chunk._t !== template) {
    const current = chunk._t;
    if (current._h === chunk) {
      current._m = false;
      current._h = void 0;
    }
  }
  chunk._t = template;
  chunk.k = template._k;
  chunk.i = template._i;
  template._h = chunk;
  template._m = mounted;
  writeExpressions(template._a, chunk.e);
}
function releaseTemplate(chunk) {
  const template = chunk._t;
  if (template._h === chunk) {
    template._m = false;
    template._h = void 0;
  }
}
function growChunkPool(size) {
  let head;
  let tail;
  for (let i = 0; i < size; i++) {
    const chunk = {
      paths: [[], []],
      dom: null,
      ref: { f: null, l: null },
      _t: null,
      e: -1,
      g: "",
      b: false,
      r: true,
      st: false,
      u: null,
      v: null,
      s: void 0,
      k: void 0,
      i: void 0,
      bkn: void 0,
      next: void 0
    };
    if (tail)
      tail.next = chunk;
    else
      head = chunk;
    tail = chunk;
  }
  if (tail)
    tail.next = chunkPoolHead;
  chunkPoolHead = head;
}
function freeChunk(chunk) {
  chunk.next = chunkPoolHead;
  chunkPoolHead = chunk;
}
function configureChunk(chunk, proto, template) {
  chunk.paths = proto.paths;
  chunk.g = proto.g;
  chunk.dom = proto.template.content.cloneNode(true);
  chunk.ref.f = chunk.dom.firstChild;
  chunk.ref.l = chunk.dom.lastChild;
  chunk.e = createExpressionBlock(proto.expressions);
  chunk.b = chunk.st = false;
  chunk.r = true;
  chunk.u = chunk.v = null;
  chunk.s = chunk.bkn = void 0;
  syncTemplateToChunk(template, chunk);
}
function acquireChunk(template) {
  const proto = getChunkProto(template);
  const exact = staleById.get(template._i);
  if (exact) {
    if (exact.g !== proto.g)
      throw Error("shape mismatch");
    if (exact.r) {
      removeStaleChunk(exact);
      syncTemplateToChunk(template, exact);
      return exact;
    }
  }
  const bucket = staleBySignature.get(proto.g);
  const reused = bucket?.h;
  if (reused) {
    removeStaleChunk(reused);
    syncTemplateToChunk(template, reused);
    return reused;
  }
  if (!chunkPoolHead)
    growChunkPool(initialChunkPoolSize);
  const chunk = chunkPoolHead;
  chunkPoolHead = chunk.next;
  chunk.next = void 0;
  configureChunk(chunk, proto, template);
  return chunk;
}
function removeStaleChunk(chunk) {
  if (!chunk.st)
    return;
  const bucket = staleBySignature.get(chunk.g);
  if (bucket) {
    let previous;
    let current = bucket.h;
    while (current && current !== chunk) {
      previous = current;
      current = current.bkn;
    }
    if (current) {
      if (previous)
        previous.bkn = current.bkn;
      else
        bucket.h = current.bkn;
      if (!bucket.h)
        staleBySignature.delete(chunk.g);
    }
  }
  if (chunk.i !== void 0 && staleById.get(chunk.i) === chunk) {
    staleById.delete(chunk.i);
  }
  chunk.st = false;
  chunk.bkn = void 0;
}
function dispatchChunkEvent(evt) {
  const binding = this[eventBindingsKey]?.[evt.type];
  if (!binding)
    return;
  const chunk = binding.c;
  if (!chunk._t._m)
    return;
  expressionPool[binding.p]?.(evt);
}
function getRenderableKey(renderable) {
  return isCmp(renderable) ? renderable.k : renderable._k;
}
function html(strings2, ...expSlots) {
  const template = ((el) => renderTemplate(template, el));
  template.isT = true;
  template._a = expSlots;
  template._c = ensureChunk;
  template._m = false;
  template._s = strings2;
  template.key = setTemplateKey;
  template.id = setTemplateId;
  return template;
}
function ensureChunk() {
  let chunk = this._h;
  if (!chunk) {
    chunk = acquireChunk(this);
    this._h = chunk;
  }
  return chunk;
}
function setTemplateKey(key) {
  this._k = key;
  if (this._h)
    this._h.k = key;
  return this;
}
function setTemplateId(id) {
  this._i = id;
  if (this._h)
    this._h.i = id;
  return this;
}
function renderTemplate(template, el) {
  const chunk = template._c();
  if (!template._m) {
    template._m = true;
    if (!chunk.b) {
      return createBindings(chunk, el);
    }
    moveDOMRef(chunk.ref, el ?? chunk.dom);
    return el ?? chunk.dom;
  }
  moveDOMRef(chunk.ref, chunk.dom);
  return el ? el.appendChild(chunk.dom) : chunk.dom;
}
function createBindings(chunk, el) {
  const expressionPointer = chunk.e;
  const totalPaths = expressionPool[expressionPointer];
  const [pathTape, attrNames] = chunk.paths;
  const stackStart = bindingStackPos + 1;
  let tapePos = 0;
  nodeStack[0] = chunk.dom;
  for (let i = 0; i < totalPaths; i++) {
    const sharedDepth = pathTape[tapePos++];
    let remaining = pathTape[tapePos++];
    let depth = sharedDepth;
    let node = nodeStack[depth];
    while (remaining--) {
      node = node.childNodes[pathTape[tapePos++]];
      nodeStack[++depth] = node;
    }
    bindingStack[++bindingStackPos] = node;
    bindingStack[++bindingStackPos] = pathTape[tapePos++];
  }
  const stackEnd = bindingStackPos;
  for (let s = stackStart, e = expressionPointer + 1; s < stackEnd; s++, e++) {
    const node = bindingStack[s];
    const segment = bindingStack[++s];
    if (segment)
      createAttrBinding(node, attrNames[segment - 1], e, chunk);
    else
      createNodeBinding(node, e, chunk);
  }
  bindingStack.length = stackStart;
  bindingStackPos = stackStart - 1;
  chunk.b = true;
  return el ? el.appendChild(chunk.dom) && el : chunk.dom;
}
function createNodeBinding(node, expressionPointer, parentChunk) {
  let fragment;
  const expression = expressionPool[expressionPointer];
  const capture = getHydrationCapture();
  const textNode = node.nodeType === 3 ? node : null;
  if (isCmp(expression) || isTpl(expression) || Array.isArray(expression)) {
    parentChunk.r = false;
    const render = createRenderFn(capture);
    fragment = render(expression);
    if (capture) {
      registerHydrationHook(parentChunk, (map, visited) => {
        render.adopt(map, visited);
      });
    }
  } else if (typeof expression === "function") {
    let target = textNode;
    let render = null;
    const [frag, stop] = watch(expressionPointer, (value) => {
      if (!render) {
        if (isCmp(value) || isTpl(value) || Array.isArray(value)) {
          parentChunk.r = false;
          render = createRenderFn(capture);
          const next2 = render(value);
          if (target) {
            target.parentNode?.replaceChild(next2, target);
            target = null;
          }
          return next2;
        }
        if (!target)
          target = document.createTextNode("");
        const next = renderText(value);
        if (target.nodeValue !== next)
          target.nodeValue = next;
        return target;
      }
      return render(value);
    });
    (parentChunk.u ??= []).push(stop);
    fragment = frag;
    if (capture) {
      registerHydrationHook(parentChunk, (map, visited) => {
        if (target) {
          const adopted = map.get(target);
          if (adopted)
            target = adopted;
        }
        render?.adopt(map, visited);
      });
    }
  } else {
    let target = textNode ?? document.createTextNode("");
    target.data = renderText(expression);
    fragment = target;
    if (capture) {
      onExpressionUpdate(expressionPointer, (value) => target.data = renderText(value));
      registerHydrationHook(parentChunk, (map) => {
        const adopted = map.get(target);
        if (adopted)
          target = adopted;
      });
    } else {
      onExpressionUpdate(expressionPointer, target);
    }
  }
  if (node === parentChunk.ref.f || node === parentChunk.ref.l) {
    const last = fragment.nodeType === 11 ? fragment.lastChild : fragment;
    if (node === parentChunk.ref.f) {
      parentChunk.ref.f = fragment.nodeType === 11 ? fragment.firstChild : fragment;
    }
    if (node === parentChunk.ref.l)
      parentChunk.ref.l = last;
  }
  if (fragment !== node)
    node.parentNode?.replaceChild(fragment, node);
}
function createAttrBinding(node, attrName, expressionPointer, parentChunk) {
  if (node.nodeType !== 1)
    return;
  let target = node;
  const expression = expressionPool[expressionPointer];
  const capture = getHydrationCapture();
  if (attrName[0] === "@") {
    const event = attrName.slice(1);
    const bindings = target[eventBindingsKey] ??= {};
    bindings[event] = { c: parentChunk, p: expressionPointer };
    const record = [target, event];
    target.addEventListener(event, dispatchChunkEvent);
    target.removeAttribute(attrName);
    (parentChunk.v ??= []).push(record);
    if (capture) {
      registerHydrationHook(parentChunk, (map) => {
        const adopted = map.get(target);
        if (!adopted)
          return;
        const previousTarget = target;
        const previousBindings = previousTarget[eventBindingsKey];
        if (previousBindings) {
          delete previousBindings[event];
          let hasBindings = false;
          for (const key in previousBindings) {
            hasBindings = true;
            break;
          }
          if (!hasBindings)
            delete previousTarget[eventBindingsKey];
        }
        target.removeEventListener(event, dispatchChunkEvent);
        target = adopted;
        record[0] = target;
        const nextBindings = target[eventBindingsKey] ??= {};
        nextBindings[event] = { c: parentChunk, p: expressionPointer };
        target.addEventListener(event, dispatchChunkEvent);
        target.removeAttribute(attrName);
      });
    }
  } else if (typeof expression === "function" && !isTpl(expression)) {
    const [, stop] = watch(expressionPointer, (value) => setAttr(target, attrName, value));
    (parentChunk.u ??= []).push(stop);
    if (capture) {
      registerHydrationHook(parentChunk, (map) => {
        const adopted = map.get(target);
        if (adopted)
          target = adopted;
      });
    }
  } else {
    setAttr(target, attrName, expression);
    if (capture) {
      onExpressionUpdate(expressionPointer, (value) => setAttr(target, attrName, value));
    } else {
      onExpressionUpdate(expressionPointer, target, attrName);
    }
  }
}
function createRenderFn(capture) {
  let previous;
  let keyedChunks = /* @__PURE__ */ Object.create(null);
  const render = function render2(renderable) {
    if (!previous) {
      if (isCmp(renderable)) {
        const [fragment, chunk] = renderComponent(renderable);
        previous = mountChunkFragment(fragment, chunk);
        return fragment;
      }
      if (isTpl(renderable)) {
        const fragment = renderable();
        previous = mountChunkFragment(fragment, renderable._h);
        return fragment;
      }
      if (Array.isArray(renderable)) {
        const [fragment, rendered] = renderList(renderable);
        previous = rendered;
        return fragment;
      }
      return previous = document.createTextNode(renderText(renderable));
    }
    if (Array.isArray(renderable)) {
      if (!Array.isArray(previous)) {
        const [fragment, nextList] = renderList(renderable);
        getNode(previous).after(fragment);
        forgetChunk(previous);
        unmount(previous);
        previous = nextList;
      } else {
        let i = 0;
        const renderableLength = renderable.length;
        const previousLength = previous.length;
        if (renderableLength && previousLength === 1 && !isChunk(previous[0]) && !previous[0].data) {
          const [fragment, rendered] = renderList(renderable);
          previous[0].replaceWith(fragment);
          previous = rendered;
          return;
        }
        if (renderableLength === previousLength) {
          const renderedList2 = new Array(renderableLength);
          for (; i < renderableLength; i++) {
            const item = renderable[i];
            if (isCmp(item) && item.k !== void 0 || isTpl(item) && item._k !== void 0) {
              i = -1;
              break;
            }
            const prev = previous[i];
            if (isTpl(item) && isChunk(prev) && prev._t === item && item._h === prev && item._m) {
              renderedList2[i] = prev;
              continue;
            }
            if (isTpl(item) && isChunk(prev)) {
              const template = item;
              const proto = template._p ?? getChunkProto(template);
              if (prev.g === proto.g) {
                syncTemplateToChunk(template, prev, true);
                renderedList2[i] = prev;
                continue;
              }
            }
            renderedList2[i] = patch(item, prev);
          }
          if (i === renderableLength) {
            previous = renderedList2;
            return;
          }
          i = 0;
        }
        const keyedList = patchKeyedList(renderable, previous);
        if (keyedList) {
          previous = keyedList;
          return;
        }
        if (renderableLength > previousLength && previousLength) {
          for (; i < previousLength; i++) {
            const item = renderable[i];
            const prev = previous[i];
            if (isTpl(item) && isChunk(prev) && prev._t === item && item._h === prev && item._m) {
              continue;
            }
            i = -1;
            break;
          }
          if (i === previousLength) {
            const fragment = document.createDocumentFragment();
            const renderedList2 = previous.slice();
            for (i = previousLength; i < renderableLength; i++) {
              renderedList2[i] = mountItem(renderable[i], fragment);
            }
            getNode(previous[previousLength - 1]).after(fragment);
            previous = renderedList2;
            return;
          }
          i = 0;
        }
        let anchor;
        const renderedList = [];
        const mark = ++renderedMark;
        const updaterFrag = renderableLength > previousLength ? document.createDocumentFragment() : null;
        for (; i < renderableLength; i++) {
          let item = renderable[i];
          const prev = previous[i];
          let key;
          if (isTpl(item) && (key = item._k) !== void 0 && key in keyedChunks) {
            const keyedChunk = keyedChunks[key];
            if (canSyncTemplateChunk(item, keyedChunk)) {
              syncTemplateToChunk(item, keyedChunk, true);
              item = keyedChunk._t;
            }
          }
          if (i > previousLength - 1) {
            renderedList[i] = mountItem(item, updaterFrag);
            continue;
          }
          if (isTpl(item) && isChunk(prev) && prev._t === item && item._h === prev && item._m) {
            anchor = getNode(prev);
            renderedList[i] = prev;
            prev.mk = mark;
            continue;
          }
          const used = patch(item, prev, anchor);
          anchor = getNode(used);
          renderedList[i] = used;
          used.mk = mark;
        }
        if (!renderableLength) {
          const placeholder = renderedList[0] = document.createTextNode("");
          const sync = canSyncUnmount(previous);
          const detached = sync && replaceListWithPlaceholder(previous, placeholder);
          if (!detached)
            getNode(previous).after(placeholder);
          keyedChunks = /* @__PURE__ */ Object.create(null);
          if (sync)
            removeUnmounted(previous, detached);
          else
            unmount(previous);
          previous = renderedList;
          return;
        } else if (renderableLength > previousLength) {
          anchor?.after(updaterFrag);
        }
        for (i = 0; i < previousLength; i++) {
          const stale = previous[i];
          if (stale.mk === mark)
            continue;
          forgetChunk(stale);
          unmount(stale);
        }
        previous = renderedList;
      }
    } else {
      if (Array.isArray(previous))
        keyedChunks = /* @__PURE__ */ Object.create(null);
      previous = patch(renderable, previous);
    }
  };
  render.adopt = capture ? (map, visited) => {
    previous = adoptRenderedValue(previous, capture, map, visited);
  } : () => {
  };
  function renderList(renderable) {
    const fragment = document.createDocumentFragment();
    if (!renderable.length) {
      const placeholder = document.createTextNode("");
      fragment.appendChild(placeholder);
      return [fragment, [placeholder]];
    }
    const renderedItems = new Array(renderable.length);
    for (let i = 0; i < renderable.length; i++) {
      renderedItems[i] = mountItem(renderable[i], fragment);
    }
    return [fragment, renderedItems];
  }
  function syncComponentChunk(renderable, chunk) {
    if (chunk.s?.[1] !== renderable.h)
      return false;
    if (chunk.s[0] !== renderable.p)
      chunk.s[0] = renderable.p;
    if (chunk.s[2] !== renderable.e)
      chunk.s[2] = renderable.e;
    return true;
  }
  function syncKeyedRenderable(renderable, chunk) {
    if (isCmp(renderable))
      return syncComponentChunk(renderable, chunk);
    if (!canSyncTemplateChunk(renderable, chunk))
      return false;
    syncTemplateToChunk(renderable, chunk, true);
    return true;
  }
  function moveChunkIntoPlace(chunk, prev, anchor) {
    if (anchor) {
      moveDOMRef(chunk.ref, anchor.parentNode, anchor.nextSibling);
      return;
    }
    const target = getNode(prev, void 0, true);
    moveDOMRef(chunk.ref, target.parentNode, target);
  }
  function patchKeyedList(renderable, previousList) {
    const renderableLength = renderable.length;
    const previousLength = previousList.length;
    if (!renderableLength) {
      const placeholder = document.createTextNode("");
      const sync = canSyncUnmount(previousList);
      const detached = sync && replaceListWithPlaceholder(previousList, placeholder);
      if (!detached)
        getNode(previousList).after(placeholder);
      keyedChunks = /* @__PURE__ */ Object.create(null);
      if (sync)
        removeUnmounted(previousList, detached);
      else
        unmount(previousList);
      return [placeholder];
    }
    const renderedList = new Array(renderableLength);
    const parent = getNode(previousList[0]).parentNode;
    if (!parent)
      return null;
    let sharedPrefix = 0;
    const sharedPrefixKeys = /* @__PURE__ */ Object.create(null);
    for (; sharedPrefix < previousLength && sharedPrefix < renderableLength; sharedPrefix++) {
      const rendered = previousList[sharedPrefix];
      if (!isChunk(rendered) || rendered.k === void 0)
        return null;
      const item = renderable[sharedPrefix];
      if (!isCmp(item) && !isTpl(item))
        return null;
      const key = getRenderableKey(item);
      if (key === void 0 || key !== rendered.k)
        break;
      sharedPrefixKeys[key] = 1;
      if (!(isTpl(item) && rendered._t === item && item._h === rendered && item._m) && !syncKeyedRenderable(item, rendered)) {
        return null;
      }
      renderedList[sharedPrefix] = rendered;
    }
    if (sharedPrefix === previousLength) {
      if (sharedPrefix === renderableLength)
        return renderedList;
      const fragment = document.createDocumentFragment();
      for (let i = sharedPrefix; i < renderableLength; i++) {
        const item = renderable[i];
        if (!isCmp(item) && !isTpl(item))
          return null;
        const key = getRenderableKey(item);
        if (key === void 0 || key in sharedPrefixKeys)
          return null;
        sharedPrefixKeys[key] = 1;
        renderedList[i] = mountItem(item, fragment);
      }
      parent.insertBefore(fragment, previousLength ? getNode(previousList[previousLength - 1]).nextSibling : null);
      return renderedList;
    }
    if (sharedPrefix === renderableLength) {
      for (let i = sharedPrefix; i < previousLength; i++) {
        const stale = previousList[i];
        forgetChunk(stale);
        unmount(stale);
      }
      return renderedList;
    }
    let oldStart = sharedPrefix;
    let newStart = sharedPrefix;
    let oldEnd = previousLength - 1;
    let newEnd = renderableLength - 1;
    while (oldStart <= oldEnd && newStart <= newEnd) {
      const startChunk = previousList[oldStart];
      const endChunk = previousList[oldEnd];
      const startKey = startChunk.k;
      const endKey = endChunk.k;
      const nextStart = renderable[newStart];
      const nextEnd = renderable[newEnd];
      const nextStartKey = isCmp(nextStart) || isTpl(nextStart) ? getRenderableKey(nextStart) : void 0;
      const nextEndKey = isCmp(nextEnd) || isTpl(nextEnd) ? getRenderableKey(nextEnd) : void 0;
      if (nextStartKey === void 0 || nextEndKey === void 0)
        return null;
      if (startKey === nextStartKey) {
        if (!(isTpl(nextStart) && startChunk._t === nextStart && nextStart._h === startChunk && nextStart._m) && !syncKeyedRenderable(nextStart, startChunk)) {
          return null;
        }
        renderedList[newStart++] = startChunk;
        oldStart++;
        continue;
      }
      if (endKey === nextEndKey) {
        if (!(isTpl(nextEnd) && endChunk._t === nextEnd && nextEnd._h === endChunk && nextEnd._m) && !syncKeyedRenderable(nextEnd, endChunk)) {
          return null;
        }
        renderedList[newEnd--] = endChunk;
        oldEnd--;
        continue;
      }
      if (startKey === nextEndKey) {
        if (!(isTpl(nextEnd) && startChunk._t === nextEnd && nextEnd._h === startChunk && nextEnd._m) && !syncKeyedRenderable(nextEnd, startChunk)) {
          return null;
        }
        moveDOMRef(startChunk.ref, parent, getNode(endChunk).nextSibling);
        renderedList[newEnd--] = startChunk;
        oldStart++;
        continue;
      }
      if (endKey === nextStartKey) {
        if (!(isTpl(nextStart) && endChunk._t === nextStart && nextStart._h === endChunk && nextStart._m) && !syncKeyedRenderable(nextStart, endChunk)) {
          return null;
        }
        moveDOMRef(endChunk.ref, parent, getNode(startChunk, void 0, true));
        renderedList[newStart++] = endChunk;
        oldEnd--;
        continue;
      }
      break;
    }
    if (newStart > newEnd) {
      for (let i = oldStart; i <= oldEnd; i++) {
        const stale = previousList[i];
        forgetChunk(stale);
        unmount(stale);
      }
      return renderedList;
    }
    if (oldStart > oldEnd) {
      const fragment = document.createDocumentFragment();
      for (let i = newStart; i <= newEnd; i++) {
        const item = renderable[i];
        if (!isCmp(item) && !isTpl(item))
          return null;
        renderedList[i] = mountItem(item, fragment);
      }
      parent.insertBefore(fragment, newEnd + 1 < renderableLength ? getNode(renderedList[newEnd + 1], void 0, true) : null);
      return renderedList;
    }
    const previousIndexByKey = /* @__PURE__ */ Object.create(null);
    for (let i = oldStart; i <= oldEnd; i++) {
      const rendered = previousList[i];
      if (!isChunk(rendered) || rendered.k === void 0)
        return null;
      const key = rendered.k;
      if (key in previousIndexByKey)
        return null;
      previousIndexByKey[key] = i + 1;
    }
    const middleIndexByKey = /* @__PURE__ */ Object.create(null);
    let overlaps = 0;
    for (let i = newStart; i <= newEnd; i++) {
      const item = renderable[i];
      const key = isCmp(item) || isTpl(item) ? getRenderableKey(item) : void 0;
      if (key === void 0 || key in middleIndexByKey)
        return null;
      middleIndexByKey[key] = i + 1;
      if (key in previousIndexByKey)
        overlaps++;
    }
    if (!overlaps) {
      const first = getNode(previousList[oldStart], void 0, true);
      const last = getNode(previousList[oldEnd]);
      const fragment = document.createDocumentFragment();
      for (let i = newStart; i <= newEnd; i++) {
        const item = renderable[i];
        if (!isCmp(item) && !isTpl(item))
          return null;
        renderedList[i] = mountItem(item, fragment);
      }
      const parent2 = first.parentNode;
      if (parent2 && first === parent2.firstChild && last === parent2.lastChild) {
        parent2.replaceChildren(fragment);
      } else {
        const range = document.createRange();
        range.setStartBefore(first);
        range.setEndAfter(last);
        range.deleteContents();
        range.insertNode(fragment);
      }
      for (let i = oldStart; i <= oldEnd; i++) {
        const stale = previousList[i];
        forgetChunk(stale);
        destroyChunk(stale, true);
      }
      return renderedList;
    }
    for (let i = oldStart; i <= oldEnd; i++) {
      const stale = previousList[i];
      const nextIndex = middleIndexByKey[stale.k];
      if (nextIndex === void 0) {
        forgetChunk(stale);
        unmount(stale);
        continue;
      }
      const item = renderable[nextIndex - 1];
      if (!syncKeyedRenderable(item, stale))
        return null;
      renderedList[nextIndex - 1] = stale;
    }
    let before = newEnd + 1 < renderableLength ? getNode(renderedList[newEnd + 1], void 0, true) : getNode(previousList[previousLength - 1]).nextSibling;
    for (let i = newEnd; i >= newStart; i--) {
      const existing = renderedList[i];
      if (!existing) {
        const item = renderable[i];
        if (!isCmp(item) && !isTpl(item))
          return null;
        const fragment = document.createDocumentFragment();
        const mounted = mountItem(item, fragment);
        renderedList[i] = mounted;
        parent.insertBefore(fragment, before);
        before = getNode(mounted, void 0, true);
        continue;
      }
      const start = getNode(existing, void 0, true);
      if (start.parentNode !== parent || start.nextSibling !== before) {
        moveDOMRef(existing.ref, parent, before);
      }
      before = start;
    }
    return renderedList;
  }
  function patch(renderable, prev, anchor) {
    const nodeType = prev.nodeType ?? 0;
    if (isCmp(renderable)) {
      const key = renderable.k;
      if (key !== void 0 && key in keyedChunks) {
        const keyedChunk = keyedChunks[key];
        if (syncComponentChunk(renderable, keyedChunk)) {
          if (keyedChunk === prev)
            return prev;
          moveChunkIntoPlace(keyedChunk, prev, anchor);
          return keyedChunk;
        }
      } else if (isChunk(prev) && syncComponentChunk(renderable, prev)) {
        if (prev.k !== renderable.k) {
          forgetChunk(prev);
          prev.k = renderable.k;
          rememberKeyedChunk(prev);
        }
        return prev;
      }
      const [fragment, chunk] = renderComponent(renderable);
      const mounted = mountChunkFragment(fragment, chunk);
      getNode(prev, anchor).after(fragment);
      forgetChunk(prev);
      unmount(prev);
      rememberKeyedChunk(chunk);
      return mounted;
    }
    if (!isTpl(renderable) && nodeType === 3) {
      const value = renderText(renderable);
      if (prev.data !== value)
        prev.data = value;
      return prev;
    }
    if (isTpl(renderable)) {
      const template = renderable;
      const key = template._k;
      if (key !== void 0 && key in keyedChunks) {
        const keyedChunk = keyedChunks[key];
        if (canSyncTemplateChunk(template, keyedChunk)) {
          syncTemplateToChunk(template, keyedChunk, true);
          if (keyedChunk === prev)
            return prev;
          moveChunkIntoPlace(keyedChunk, prev, anchor);
          return keyedChunk;
        }
      }
      const proto = getChunkProto(template);
      if (isChunk(prev) && prev.g === proto.g) {
        syncTemplateToChunk(template, prev, true);
        return prev;
      }
      const fragment = renderable();
      const chunk = template._h;
      const mounted = mountChunkFragment(fragment, chunk);
      getNode(prev, anchor).after(fragment);
      forgetChunk(prev);
      unmount(prev);
      rememberKeyedChunk(chunk);
      return mounted;
    }
    const text = document.createTextNode(renderText(renderable));
    getNode(prev, anchor).after(text);
    forgetChunk(prev);
    unmount(prev);
    return text;
  }
  function mountItem(item, fragment) {
    if (isCmp(item)) {
      const [inner, chunk] = renderComponent(item);
      fragment.appendChild(inner);
      rememberKeyedChunk(chunk);
      return mountChunkFragment(fragment, chunk);
    }
    if (isTpl(item)) {
      item(fragment);
      const chunk = item._h;
      rememberKeyedChunk(chunk);
      return mountChunkFragment(fragment, chunk);
    }
    const node = document.createTextNode(renderText(item));
    fragment.appendChild(node);
    return node;
  }
  function mountChunkFragment(fragment, chunk) {
    if (chunk.ref.f)
      return chunk;
    const placeholder = document.createTextNode("");
    fragment.appendChild(placeholder);
    return placeholder;
  }
  function rememberKeyedChunk(chunk) {
    if (chunk.k !== void 0)
      keyedChunks[chunk.k] = chunk;
  }
  function forgetChunk(item) {
    if (isChunk(item) && item.k !== void 0 && keyedChunks[item.k] === item) {
      delete keyedChunks[item.k];
    }
  }
  function renderComponent(renderable) {
    const [props, emit2, box] = createPropsProxy(renderable.p, renderable.h, renderable.e);
    const cleanups = [];
    const previousCollector = swapCleanupCollector(cleanups);
    let template;
    let fragment;
    try {
      template = renderable.h(props, emit2);
      fragment = template();
    } finally {
      swapCleanupCollector(previousCollector);
    }
    const chunk = template._c();
    if (cleanups.length) {
      (chunk.u ??= []).push(...cleanups);
    }
    chunk.r = false;
    chunk.s = box;
    chunk.k = renderable.k;
    return [fragment, chunk];
  }
  return render;
}
var unmountStack = [];
function destroyChunk(chunk, detached = false) {
  if (chunk.st)
    removeStaleChunk(chunk);
  releaseTemplate(chunk);
  if (chunk.v) {
    for (let i = 0; i < chunk.v.length; i++) {
      const [target, event] = chunk.v[i];
      const bindings = target[eventBindingsKey];
      if (bindings) {
        delete bindings[event];
        let hasBindings = false;
        for (const key in bindings) {
          hasBindings = true;
          break;
        }
        if (!hasBindings)
          delete target[eventBindingsKey];
      }
      target.removeEventListener(event, dispatchChunkEvent);
    }
  }
  if (chunk.u) {
    for (let i = 0; i < chunk.u.length; i++)
      chunk.u[i]();
    chunk.u = null;
  }
  if (chunk.e + 1) {
    releaseExpressions(chunk.e);
    chunk.e = -1;
  }
  let node = chunk.ref.f;
  if (!detached && node) {
    const last = chunk.ref.l;
    if (node === last)
      node.remove();
    else {
      while (node) {
        const next = node === last ? null : node.nextSibling;
        node.remove();
        if (!next)
          break;
        node = next;
      }
    }
  }
  chunk.dom.textContent = "";
  chunk.ref.f = chunk.ref.l = null;
  chunk.k = chunk.i = chunk.s = void 0;
  chunk.u = chunk.v = null;
  chunk.b = chunk.st = false;
  chunk.r = true;
  chunk.g = "";
  freeChunk(chunk);
}
function recycleChunk(chunk, detached = false) {
  if (!detached)
    moveDOMRef(chunk.ref, chunk.dom);
  releaseTemplate(chunk);
  if (chunk.st || !chunk.r)
    return;
  chunk.st = true;
  let bucket = staleBySignature.get(chunk.g);
  if (!bucket) {
    bucket = {};
    staleBySignature.set(chunk.g, bucket);
  }
  chunk.bkn = bucket.h;
  bucket.h = chunk;
  if (chunk.i !== void 0)
    staleById.set(chunk.i, chunk);
}
var unmountQueued = false;
function canSyncUnmount(chunk) {
  for (let i = 0; i < chunk.length; i++) {
    const item = chunk[i];
    if (isChunk(item) && !item.r)
      return false;
  }
  return true;
}
function replaceListWithPlaceholder(chunk, placeholder) {
  if (!chunk.length)
    return false;
  const first = getNode(chunk[0], void 0, true);
  const last = getNode(chunk[chunk.length - 1]);
  const parent = first.parentNode;
  if (!parent || first !== parent.firstChild || last !== parent.lastChild) {
    return false;
  }
  parent.replaceChildren(placeholder);
  return true;
}
function removeUnmounted(chunk, detached = false) {
  if (isChunk(chunk)) {
    if (chunk.r)
      recycleChunk(chunk, detached);
    else
      destroyChunk(chunk, detached);
    return;
  }
  if (Array.isArray(chunk)) {
    if (!detached && chunk.length) {
      const first = getNode(chunk[0], void 0, true);
      const last = getNode(chunk[chunk.length - 1]);
      const parent = first.parentNode;
      if (parent) {
        if (first === parent.firstChild && last === parent.lastChild) {
          parent.textContent = "";
        } else {
          const range = document.createRange();
          range.setStartBefore(first);
          range.setEndAfter(last);
          range.deleteContents();
        }
        detached = true;
      }
    }
    let bucket;
    let signature = "";
    for (let i = 0; i < chunk.length; i++) {
      const item = chunk[i];
      if (isChunk(item)) {
        if (!item.r) {
          destroyChunk(item, detached);
          continue;
        }
        if (!detached)
          moveDOMRef(item.ref, item.dom);
        releaseTemplate(item);
        if (item.st)
          continue;
        item.st = true;
        if (signature !== item.g) {
          signature = item.g;
          bucket = staleBySignature.get(signature);
          if (!bucket) {
            bucket = {};
            staleBySignature.set(signature, bucket);
          }
        }
        item.bkn = bucket.h;
        bucket.h = item;
        if (item.i !== void 0)
          staleById.set(item.i, item);
      } else if (!detached) {
        item.remove();
      }
    }
    return;
  }
  if (!detached)
    chunk.remove();
}
function drainUnmountStack() {
  unmountQueued = false;
  const stack = unmountStack;
  unmountStack = [];
  for (let i = 0; i < stack.length; i++)
    removeUnmounted(stack[i]);
  if (unmountStack.length)
    scheduleUnmountDrain();
}
function scheduleUnmountDrain() {
  if (unmountQueued)
    return;
  unmountQueued = true;
  queueMicrotask(drainUnmountStack);
}
function unmount(chunk) {
  if (!chunk)
    return;
  unmountStack.push(chunk);
  scheduleUnmountDrain();
}
function renderText(value) {
  return value || value === 0 ? value : "";
}
function getNode(chunk, anchor, first) {
  if (isChunk(chunk)) {
    return first ? chunk.ref.f : chunk.ref.l;
  }
  if (Array.isArray(chunk)) {
    return getNode(chunk[first ? 0 : chunk.length - 1], anchor, first);
  }
  return chunk;
}
function adoptRenderedValue(value, capture, map, visited) {
  if (!value)
    return value;
  if (isChunk(value)) {
    adoptCapturedChunk(capture, value, map, visited);
    return value;
  }
  if (Array.isArray(value)) {
    const next = new Array(value.length);
    for (let i = 0; i < value.length; i++) {
      next[i] = adoptRenderedValue(value[i], capture, map, visited);
    }
    return next;
  }
  return map.get(value) ?? value;
}
function createPaths(dom) {
  const pathTape = [];
  const attrNames = [];
  const path6 = [];
  const previous = [];
  const pushPath = (attrName) => {
    const pathLen = path6.length;
    const previousLen = previous.length;
    const limit = pathLen < previousLen ? pathLen : previousLen;
    let sharedDepth = 0;
    while (sharedDepth < limit && previous[sharedDepth] === path6[sharedDepth]) {
      sharedDepth++;
    }
    pathTape.push(sharedDepth, pathLen - sharedDepth);
    for (let i = sharedDepth; i < pathLen; i++)
      pathTape.push(path6[i]);
    pathTape.push(attrName ? attrNames.push(attrName) : 0);
    previous.length = pathLen;
    for (let i = 0; i < pathLen; i++)
      previous[i] = path6[i];
  };
  const walk = (node) => {
    if (node.nodeType === 1) {
      const attrs = node.attributes;
      for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        if (attr.value === delimiterComment)
          pushPath(attr.name);
      }
    } else if (node.nodeType === 8) {
      pushPath();
    } else if (node.nodeType === 3 && node.nodeValue === delimiterComment) {
      pushPath();
    }
    const children2 = node.childNodes;
    for (let i = 0; i < children2.length; i++) {
      path6.push(i);
      walk(children2[i]);
      path6.pop();
    }
  };
  const children = dom.childNodes;
  for (let i = 0; i < children.length; i++) {
    path6.push(i);
    walk(children[i]);
    path6.pop();
  }
  return [pathTape, attrNames];
}
function normalizeNodePlaceholders(dom) {
  const walk = (node) => {
    const children = node.childNodes;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.nodeType === 8 && child.data === delimiter) {
        node.replaceChild(document.createTextNode(""), child);
        continue;
      }
      if (child.nodeType === 3 && child.nodeValue === delimiterComment) {
        child.nodeValue = "";
      }
      if (child.firstChild)
        walk(child);
    }
  };
  walk(dom);
}

// src/chat/pi-config-reader.ts
var import_obsidian = require("obsidian");
var fs;
var os;
var path;
var JSON5;
if (import_obsidian.Platform.isDesktop) {
  fs = require("node:fs");
  os = require("node:os");
  path = require("node:path");
  JSON5 = require_lib();
}
function readPiModelsConfig(projectPath) {
  if (!import_obsidian.Platform.isDesktop) {
    return { providers: [] };
  }
  const providers = {};
  let error;
  let configExists = false;
  try {
    const homeDir = os.homedir();
    const userModelsPath = path.join(homeDir, ".pi", "agent", "models.json");
    if (fs.existsSync(userModelsPath)) {
      configExists = true;
      const content = fs.readFileSync(userModelsPath, "utf-8");
      const userConfig = JSON5.parse(content);
      if (userConfig.providers) {
        Object.assign(providers, userConfig.providers);
      }
    }
  } catch (err) {
    error = `Failed to read ~/.pi/agent/models.json: ${err instanceof Error ? err.message : String(err)}`;
    console.warn("[Pi Plugin]", error);
  }
  if (projectPath) {
    try {
      const projectModelsPath = path.join(projectPath, ".pi", "models.json");
      if (fs.existsSync(projectModelsPath)) {
        configExists = true;
        const content = fs.readFileSync(projectModelsPath, "utf-8");
        const projectConfig = JSON5.parse(content);
        if (projectConfig.providers) {
          Object.assign(providers, projectConfig.providers);
        }
      }
    } catch (err) {
      error = `Failed to read project models.json: ${err instanceof Error ? err.message : String(err)}`;
      console.warn("[Pi Plugin]", error);
    }
  }
  if (configExists && Object.keys(providers).length === 0 && error) {
    return { providers: [], error };
  }
  const result = [];
  for (const [providerName, config] of Object.entries(providers)) {
    const models = (config.models || []).map((m) => ({
      id: m.id,
      name: m.name || m.id,
      reasoning: m.reasoning,
      contextWindow: m.contextWindow
    }));
    const rawApiKey = (config.apiKey || "").trim();
    const envVarName = rawApiKey.startsWith("$") ? rawApiKey.slice(1) : rawApiKey;
    result.push({
      name: providerName,
      envVarName,
      baseUrl: config.baseUrl,
      api: config.api,
      models
    });
  }
  result.sort((a, b) => a.name.localeCompare(b.name));
  return { providers: result, error };
}
function readProviders(projectPath) {
  return readPiModelsConfig(projectPath).providers;
}

// src/chat/arrow/model-sequence-picker.ts
function ModelSequencePicker(props) {
  let searchInputEl = null;
  const local = reactive({
    query: "",
    models: [],
    sequence: [...props.sequence],
    /** Model ID currently being dragged, null when idle. */
    dragModelId: null
  });
  void (async () => {
    try {
      const providers = readProviders(props.projectPath);
      const flat = [];
      for (const provider of providers) {
        for (const model of provider.models) {
          flat.push({ id: model.id, name: model.name, provider: provider.name });
        }
      }
      flat.sort((a, b) => a.name.localeCompare(b.name));
      local.models = flat;
    } catch {
    }
  })();
  function filtered() {
    const q = local.query.trim().toLowerCase();
    if (!q) return [];
    return local.models.filter(
      (m) => m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q) || m.provider.toLowerCase().includes(q)
    );
  }
  function addModel(id) {
    if (local.sequence.includes(id)) return;
    local.sequence = [...local.sequence, id];
    local.query = "";
    if (searchInputEl) searchInputEl.value = "";
    props.onSequenceChange(local.sequence);
  }
  function removeModel(id) {
    local.sequence = local.sequence.filter((m) => m !== id);
    props.onSequenceChange(local.sequence);
  }
  function onDragStart(id) {
    local.dragModelId = id;
  }
  function onDragOver(e) {
    e.preventDefault();
  }
  function onDrop(e, targetId) {
    e.preventDefault();
    const fromId = local.dragModelId;
    if (!fromId || fromId === targetId) {
      local.dragModelId = null;
      return;
    }
    const seq = [...local.sequence];
    const fromIdx = seq.indexOf(fromId);
    const toIdx = seq.indexOf(targetId);
    if (fromIdx === -1 || toIdx === -1) {
      local.dragModelId = null;
      return;
    }
    seq.splice(fromIdx, 1);
    seq.splice(toIdx, 0, fromId);
    local.sequence = seq;
    local.dragModelId = null;
    props.onSequenceChange(local.sequence);
  }
  return html`<div class="pi-model-seq-picker">
		<div class="pi-model-seq-search-row">
			<input
				type="text"
				class="pi-model-seq-search"
				placeholder="Search models to add…"
				@input="${(e) => {
    const el = e.target;
    searchInputEl = el;
    local.query = el.value;
  }}"
			/>
		</div>
		${() => filtered().length > 0 ? html`<div class="pi-model-seq-suggestions" role="listbox">
						${() => filtered().map(
    (m) => html`<button
									type="button"
									class="pi-model-seq-suggestion"
									role="option"
									@click="${() => addModel(m.id)}"
								>
									<span class="pi-model-seq-suggestion-name">${() => m.name}</span>
									<span class="pi-model-seq-suggestion-provider">${() => m.provider}</span>
								</button>`.key(m.id)
  )}
					</div>` : false}
		<div class="pi-model-seq-list">
			${() => local.sequence.length === 0 ? html`<p class="pi-model-seq-empty">No models — defaults will be used.</p>` : local.sequence.map(
    (modelId) => html`<div
								class="pi-model-seq-row"
								draggable="true"
								@dragstart="${() => onDragStart(modelId)}"
								@dragover="${(e) => onDragOver(e)}"
								@drop="${(e) => onDrop(e, modelId)}"
							>
								<span class="pi-model-seq-handle" aria-hidden="true">≡</span>
								<span class="pi-model-seq-name">${() => modelId}</span>
								${() => local.sequence[0] === modelId ? html`<span class="pi-model-seq-badge">primary</span>` : false}
								<button
									type="button"
									class="pi-model-seq-remove"
									aria-label="Remove"
									@click="${() => removeModel(modelId)}"
								>×</button>
							</div>`.key(modelId)
  )}
		</div>
	</div>`;
}

// src/chat/message-store.ts
var MAX_MESSAGES_PER_SESSION = 500;
var MessageStore = class {
  data;
  dirty = false;
  constructor() {
    this.data = { sessions: {} };
  }
  /**
   * Load from serialized data (call with plugin.loadData() result).
   */
  load(raw) {
    if (raw && typeof raw === "object" && raw.sessions) {
      this.data = raw;
    } else {
      this.data = { sessions: {} };
    }
    this.dirty = false;
  }
  /**
   * Get serializable data (pass to plugin.saveData()).
   */
  serialize() {
    this.dirty = false;
    return this.data;
  }
  /**
   * Check if there are unsaved changes.
   */
  isDirty() {
    return this.dirty;
  }
  /**
   * Get messages for a session.
   */
  getMessages(sessionPath) {
    return this.data.sessions[sessionPath] || [];
  }
  /**
   * Set all messages for a session (e.g. on save/clear).
   */
  setMessages(sessionPath, messages) {
    this.data.sessions[sessionPath] = messages.slice(-MAX_MESSAGES_PER_SESSION);
    this.dirty = true;
  }
  /**
   * Append a single message to a session.
   */
  appendMessage(sessionPath, message) {
    if (!this.data.sessions[sessionPath]) {
      this.data.sessions[sessionPath] = [];
    }
    this.data.sessions[sessionPath].push(message);
    if (this.data.sessions[sessionPath].length > MAX_MESSAGES_PER_SESSION) {
      this.data.sessions[sessionPath] = this.data.sessions[sessionPath].slice(
        -MAX_MESSAGES_PER_SESSION
      );
    }
    this.dirty = true;
  }
  /**
   * Remove a session's messages.
   */
  removeSession(sessionPath) {
    delete this.data.sessions[sessionPath];
    this.dirty = true;
  }
  /**
   * Get the last active session path.
   */
  getLastSession() {
    return this.data.lastSession;
  }
  /**
   * Set the last active session path.
   */
  setLastSession(sessionPath) {
    this.data.lastSession = sessionPath;
    this.dirty = true;
  }
  /**
   * List all session paths that have stored messages, sorted by most recent message.
   */
  listSessions() {
    return Object.keys(this.data.sessions).filter((key) => this.data.sessions[key].length > 0).sort((a, b) => {
      const aLast = this.data.sessions[a].slice(-1)[0]?.timestamp ?? 0;
      const bLast = this.data.sessions[b].slice(-1)[0]?.timestamp ?? 0;
      return bLast - aLast;
    });
  }
};

// src/client.ts
var VaultMindClient = class {
  config;
  ws = null;
  reconnectTimer = null;
  reconnectDelay = 1e3;
  intentionalClose = false;
  eventHandlers = /* @__PURE__ */ new Set();
  stateHandlers = /* @__PURE__ */ new Set();
  _state = { connected: false };
  constructor(config) {
    this.config = config;
  }
  get baseUrl() {
    return `http://${this.config.host}:${this.config.port}`;
  }
  get wsUrl() {
    return `ws://${this.config.host}:${this.config.port}/agent/stream`;
  }
  get authHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.config.token}`
    };
  }
  setState(state) {
    this._state = state;
    for (const h of this.stateHandlers) h(state);
  }
  get state() {
    return this._state;
  }
  subscribeEvents(handler) {
    this.eventHandlers.add(handler);
    return () => this.eventHandlers.delete(handler);
  }
  subscribeState(handler) {
    this.stateHandlers.add(handler);
    return () => this.stateHandlers.delete(handler);
  }
  emit(event) {
    for (const h of this.eventHandlers) {
      try {
        h(event);
      } catch {
      }
    }
  }
  connect() {
    if (this.ws) return;
    try {
      this.ws = new WebSocket(this.wsUrl, [`Authorization: Bearer ${this.config.token}`]);
    } catch (err) {
      this.setState({ connected: false, error: String(err), reconnecting: true });
      this.scheduleReconnect();
      return;
    }
    this.ws.onopen = () => {
      this.reconnectDelay = 1e3;
      this.setState({ connected: true, reconnecting: false });
    };
    this.ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        this.emit(parsed);
      } catch {
      }
    };
    this.ws.onclose = (event) => {
      this.ws = null;
      if (this.intentionalClose) {
        this.setState({ connected: false, error: void 0, reconnecting: false });
        return;
      }
      const wasConnected = this._state.connected;
      this.setState({ connected: false, error: `closed ${event.code}`, reconnecting: true });
      if (wasConnected || event.code !== 4401) {
        this.scheduleReconnect();
      }
    };
    this.ws.onerror = () => {
      this.setState({ connected: this.ws?.readyState === WebSocket.OPEN, error: "socket error" });
    };
  }
  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.intentionalClose = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.setState({ connected: false, error: void 0, reconnecting: false });
    this.intentionalClose = false;
  }
  scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, this.reconnectDelay);
    this.reconnectDelay = Math.min(this.reconnectDelay * 2, 3e4);
  }
  async httpJson(method, path6, body) {
    const res = await fetch(`${this.baseUrl}${path6}`, {
      method,
      headers: this.authHeaders,
      body: body ? JSON.stringify(body) : void 0
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`${res.status} ${text}`);
    return text ? JSON.parse(text) : void 0;
  }
  async status() {
    return await this.httpJson("GET", "/vm/status");
  }
  async init(vaultPath) {
    return await this.httpJson("POST", "/vm/init", vaultPath ? { vaultPath } : void 0);
  }
  async setup(body) {
    return await this.httpJson("POST", "/vm/setup", body);
  }
  async startServer() {
    return await this.httpJson("POST", "/server/start");
  }
  async toggleWatcher() {
    return await this.httpJson("POST", "/vm/watcher/toggle");
  }
  async listQueue(status) {
    const query = status ? `?status=${status}` : "";
    return await this.httpJson("GET", `/agent/queue${query}`);
  }
  async retryJob(id) {
    return await this.httpJson("POST", `/agent/jobs/${encodeURIComponent(id)}/retry`);
  }
  async cancelJob(id) {
    return await this.httpJson(
      "POST",
      `/agent/jobs/${encodeURIComponent(id)}/cancel`
    );
  }
  async search(query, collection = "main", limit = 5) {
    return await this.httpJson("POST", "/vm/search", {
      collection,
      query,
      limit
    });
  }
  async ftsSearch(query, collection = "main", limit = 10) {
    const res = await this.httpJson("POST", "/vm/fts-search", { query, collection, limit });
    return res.hits;
  }
  async graphQuery(entity, depth = 1) {
    const res = await this.httpJson("POST", "/vm/graph", { entity, depth });
    return res.results;
  }
  async listPending() {
    const res = await this.httpJson("GET", "/vm/pending");
    return res.pending;
  }
  async approveEntry(id, collection, action) {
    await this.httpJson("POST", "/vm/approve", { id, collection, action });
  }
  async pushContext(filePath, selection, cursor2) {
    return await this.httpJson("POST", "/vault-mind/context", {
      filePath,
      selection,
      cursor: cursor2
    });
  }
  async scan(file, vault) {
    try {
      return await this.httpJson("POST", "/vault-mind/scan", { file, vault });
    } catch (err) {
      return { error: String(err) };
    }
  }
  async dispatch(role, instruction, file, vault) {
    try {
      return await this.httpJson("POST", "/vault-mind/dispatch", {
        role,
        instruction,
        file,
        vault
      });
    } catch (err) {
      return { error: String(err) };
    }
  }
  async vmStats() {
    return await this.httpJson("GET", "/vm/stats");
  }
};

// src/config.ts
var import_node_fs = require("node:fs");
var import_node_os = require("node:os");
var import_node_path = __toESM(require("node:path"), 1);
function extractConfigLayer(cfg) {
  const wiki = cfg.wiki ?? {};
  const vaultMind = cfg.vaultMind ?? {};
  const source = Object.keys(wiki).length > 0 ? wiki : vaultMind;
  const embedding = source.embedding ?? {};
  const modal = embedding.modal ?? {};
  const ollamaHost = typeof embedding.ollamaHost === "string" ? embedding.ollamaHost : void 0;
  const ollamaModel = typeof embedding.ollamaModel === "string" ? embedding.ollamaModel : void 0;
  return {
    remoteUrl: typeof embedding.remoteUrl === "string" ? embedding.remoteUrl : void 0,
    localUrl: typeof embedding.localUrl === "string" ? embedding.localUrl : ollamaHost ? `${ollamaHost.replace(/\/$/, "")}/v1` : void 0,
    model: typeof embedding.model === "string" ? embedding.model : ollamaModel,
    dim: typeof embedding.dim === "number" ? embedding.dim : void 0,
    collections: typeof cfg.collections === "object" && cfg.collections !== null ? Object.keys(cfg.collections) : void 0,
    workspace: typeof modal.workspace === "string" ? modal.workspace : void 0,
    useTransformers: typeof embedding.useTransformers === "boolean" ? embedding.useTransformers : void 0
  };
}
function mergeConfigLayers(globalCfg, projectCfg) {
  const global = extractConfigLayer(globalCfg);
  const project = extractConfigLayer(projectCfg);
  return {
    remoteUrl: project.remoteUrl ?? global.remoteUrl,
    localUrl: project.localUrl ?? global.localUrl,
    model: project.model ?? global.model,
    dim: project.dim ?? global.dim,
    collections: project.collections ?? global.collections,
    workspace: project.workspace ?? global.workspace,
    useTransformers: project.useTransformers ?? global.useTransformers
  };
}
function readExtensionConfig(vaultPath) {
  const globalPath = import_node_path.default.join((0, import_node_os.homedir)(), ".pi", "agent", "vault-mind.config.json");
  const projectPath = import_node_path.default.join(vaultPath, "pi-vault-mind.config.json");
  let globalCfg = {};
  let projectCfg = {};
  try {
    globalCfg = JSON.parse((0, import_node_fs.readFileSync)(globalPath, "utf-8"));
  } catch {
  }
  try {
    projectCfg = JSON.parse((0, import_node_fs.readFileSync)(projectPath, "utf-8"));
  } catch {
  }
  const merged = mergeConfigLayers(globalCfg, projectCfg);
  return Object.keys(merged).length > 0 ? merged : null;
}
function readServerPort(vaultPath) {
  const serverJsonPath = import_node_path.default.join(vaultPath, ".vault-mind", "server.json");
  try {
    const raw = (0, import_node_fs.readFileSync)(serverJsonPath, "utf-8");
    const data = JSON.parse(raw);
    const port = data.port;
    return typeof port === "number" && port > 0 ? port : void 0;
  } catch {
    return void 0;
  }
}

// src/modals.ts
var import_obsidian2 = require("obsidian");
var VAULT_MIND_ROLES = [
  "Manager",
  "Miner",
  "Broadcaster",
  "Heavy-Lifter",
  "Watcher"
];
var RolePickerModal = class extends import_obsidian2.FuzzySuggestModal {
  onChooseRole;
  constructor(app, onChooseRole) {
    super(app);
    this.onChooseRole = onChooseRole;
    this.setPlaceholder("Pick a Vault Mind agent role");
    this.setInstructions([
      { command: "\u2191\u2193", purpose: "navigate" },
      { command: "\u21B5", purpose: "select" }
    ]);
  }
  getItems() {
    return [...VAULT_MIND_ROLES];
  }
  getItemText(role) {
    return role;
  }
  onChooseItem(role) {
    this.onChooseRole(role);
  }
};
var InstructionInputModal = class extends import_obsidian2.Modal {
  titleText;
  onSubmit;
  constructor(app, title, onSubmit) {
    super(app);
    this.titleText = title;
    this.onSubmit = onSubmit;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", { text: this.titleText });
    const textarea = new import_obsidian2.TextAreaComponent(contentEl);
    textarea.setPlaceholder("Describe what the agent should do...");
    textarea.inputEl.rows = 8;
    textarea.inputEl.addClass("vault-mind-instruction-input");
    textarea.inputEl.style.width = "100%";
    const buttonRow = contentEl.createDiv({ cls: "vault-mind-modal-buttons" });
    buttonRow.style.display = "flex";
    buttonRow.style.justifyContent = "flex-end";
    buttonRow.style.gap = "0.5rem";
    buttonRow.style.marginTop = "1rem";
    new import_obsidian2.ButtonComponent(buttonRow).setButtonText("Cancel").onClick(() => {
      this.onSubmit(null);
      this.close();
    });
    new import_obsidian2.ButtonComponent(buttonRow).setButtonText("Dispatch").setCta().onClick(() => {
      this.onSubmit(textarea.getValue());
      this.close();
    });
    textarea.inputEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        this.onSubmit(textarea.getValue());
        this.close();
      }
      if (event.key === "Escape") {
        event.preventDefault();
        this.onSubmit(null);
        this.close();
      }
    });
  }
  onClose() {
    this.contentEl.empty();
  }
};

// src/pi-detect.ts
var import_node_child_process = require("node:child_process");
var fs2 = __toESM(require("node:fs"), 1);
var os2 = __toESM(require("node:os"), 1);
var path3 = __toESM(require("node:path"), 1);
function resolvePnpmHome() {
  if (process.env.PNPM_HOME) return process.env.PNPM_HOME;
  if (process.platform === "darwin") return path3.join(os2.homedir(), "Library", "pnpm");
  return path3.join(os2.homedir(), ".local", "share", "pnpm");
}
function detectFnm() {
  const fnmRoot = path3.join(os2.homedir(), ".local", "share", "fnm");
  if (!fs2.existsSync(fnmRoot)) return null;
  const binDir = path3.join(fnmRoot, "aliases", "default", "bin");
  const node = path3.join(binDir, "node");
  if (!fs2.existsSync(node)) return null;
  return {
    node,
    pnpm: fs2.existsSync(path3.join(binDir, "pnpm")) ? path3.join(binDir, "pnpm") : null,
    binDir,
    source: "fnm",
    pnpmHome: resolvePnpmHome()
  };
}
function detectNvm() {
  const nvmDir = process.env.NVM_DIR || path3.join(os2.homedir(), ".nvm");
  const aliasFile = path3.join(nvmDir, "alias", "default");
  let version;
  try {
    version = fs2.readFileSync(aliasFile, "utf-8").trim();
  } catch {
    return null;
  }
  if (!version.startsWith("v") && /^\d/.test(version)) version = `v${version}`;
  if (!version.startsWith("v")) return null;
  const binDir = path3.join(nvmDir, "versions", "node", version, "bin");
  if (!fs2.existsSync(path3.join(binDir, "node"))) return null;
  return {
    node: path3.join(binDir, "node"),
    pnpm: fs2.existsSync(path3.join(binDir, "pnpm")) ? path3.join(binDir, "pnpm") : null,
    binDir,
    source: `nvm (${version})`,
    pnpmHome: resolvePnpmHome(),
    nvmDir,
    nvmBin: binDir
  };
}
function detectFallback() {
  const pnpmHome = resolvePnpmHome();
  if (fs2.existsSync(path3.join(pnpmHome, "pnpm")) || fs2.existsSync(path3.join(pnpmHome, "pi"))) {
    return {
      pnpm: path3.join(pnpmHome, "pnpm"),
      node: null,
      binDir: pnpmHome,
      source: "PNPM_HOME",
      pnpmHome
    };
  }
  return null;
}
function detectRuntime() {
  return detectFnm() || detectNvm() || detectFallback();
}
function buildExecPath() {
  const dirs = [];
  const runtime = detectRuntime();
  if (runtime) {
    dirs.push(runtime.binDir);
    if (runtime.pnpmHome && runtime.pnpmHome !== runtime.binDir) {
      dirs.push(runtime.pnpmHome);
    }
  }
  const pnpmHome = resolvePnpmHome();
  if (!dirs.includes(pnpmHome)) dirs.push(pnpmHome);
  const homeLocalBin = path3.join(os2.homedir(), ".local", "bin");
  dirs.push(
    homeLocalBin,
    "/opt/homebrew/bin",
    "/usr/local/bin",
    "/usr/bin",
    "/bin",
    "/usr/sbin",
    "/sbin"
  );
  const existing = (process.env.PATH || "").split(":");
  for (const p of existing) {
    if (p && !dirs.includes(p)) dirs.push(p);
  }
  return dirs.join(":");
}
function buildExecEnv() {
  const env = { ...process.env, PATH: buildExecPath() };
  const runtime = detectRuntime();
  if (runtime) {
    env.PNPM_HOME = runtime.pnpmHome;
    if (runtime.nvmDir) env.NVM_DIR = runtime.nvmDir;
    if (runtime.nvmBin) env.NVM_BIN = runtime.nvmBin;
  }
  return env;
}
function detectModalBinary() {
  const candidates = [
    path3.join(os2.homedir(), ".local", "bin", "modal"),
    "/opt/homebrew/bin/modal",
    "/usr/local/bin/modal"
  ];
  for (const c of candidates) {
    if (fs2.existsSync(c)) return c;
  }
  try {
    const result = (0, import_node_child_process.execSync)(`${process.env.SHELL || "/bin/zsh"} -lc "which modal 2>/dev/null"`, {
      timeout: 3e3,
      env: buildExecEnv()
    }).toString().trim();
    return result || null;
  } catch {
    return null;
  }
}
function detectOpBinary() {
  const candidates = [
    path3.join(os2.homedir(), ".local", "bin", "op"),
    "/opt/homebrew/bin/op",
    "/usr/local/bin/op",
    "/usr/bin/op"
  ];
  for (const c of candidates) {
    if (fs2.existsSync(c)) return c;
  }
  try {
    const result = (0, import_node_child_process.execSync)(`${process.env.SHELL || "/bin/zsh"} -lc "which op 2>/dev/null"`, {
      timeout: 3e3,
      env: buildExecEnv()
    }).toString().trim();
    return result || null;
  } catch {
    return null;
  }
}
function resolveNodeBinDir() {
  return detectRuntime()?.binDir ?? null;
}
function detectPiBinary(configured, vaultPath) {
  if (path3.isAbsolute(configured) && fs2.existsSync(configured)) {
    return configured;
  }
  const shellPath = whichPi(configured);
  if (shellPath) return shellPath;
  const home = os2.homedir();
  const pnpmHome = process.env.PNPM_HOME || (process.platform === "darwin" ? path3.join(home, "Library", "pnpm") : path3.join(home, ".local", "share", "pnpm"));
  const candidates = [
    // System npm global installs (base case — no version manager)
    "/usr/local/bin/pi",
    "/opt/homebrew/bin/pi",
    path3.join(home, ".npm-global", "bin", "pi"),
    path3.join(home, ".local", "bin", "pi"),
    // pnpm global (PNPM_HOME)
    path3.join(pnpmHome, "pi")
  ];
  const nodeBin = resolveNodeBinDir();
  if (nodeBin && nodeBin !== "/usr/local/bin" && nodeBin !== "/opt/homebrew/bin") {
    candidates.push(path3.join(nodeBin, "pi"));
  }
  candidates.push(
    // Less common locations
    path3.join(home, ".pi", "bin", "pi")
  );
  if (vaultPath) {
    candidates.unshift(path3.join(vaultPath, "node_modules", ".bin", "pi"));
  }
  for (const candidate of candidates) {
    if (fs2.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}
function whichPi(name) {
  const shell = process.env.SHELL || (process.platform === "darwin" ? "/bin/zsh" : "/bin/bash");
  const cmd = process.platform === "win32" ? `where ${name}` : `which ${name}`;
  try {
    const result = (0, import_node_child_process.execSync)(cmd, {
      encoding: "utf-8",
      shell,
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 5e3,
      env: { ...process.env }
    });
    const resolved = result.trim().split("\n")[0];
    if (resolved && fs2.existsSync(resolved)) {
      return resolved;
    }
  } catch {
  }
  return null;
}

// src/protocol.ts
var import_obsidian3 = require("obsidian");
var isString = (value) => typeof value === "string";
var DiffModal = class extends import_obsidian3.Modal {
  path;
  oldContent;
  newContent;
  onAccept;
  constructor(app, { path: path6, old, new: newContent }, onAccept) {
    super(app);
    this.path = path6;
    this.oldContent = old;
    this.newContent = newContent;
    this.onAccept = onAccept;
  }
  onOpen() {
    this.titleEl.setText(`Proposed edit: ${this.path}`);
    const oldSection = this.contentEl.createEl("div");
    oldSection.createEl("h3", { text: "Current content" });
    const oldPre = oldSection.createEl("pre", { cls: "vault-mind-diff vault-mind-diff-old" });
    oldPre.textContent = this.oldContent;
    const newSection = this.contentEl.createEl("div");
    newSection.createEl("h3", { text: "Proposed content" });
    const newPre = newSection.createEl("pre", { cls: "vault-mind-diff vault-mind-diff-new" });
    newPre.textContent = this.newContent;
    new import_obsidian3.Setting(this.contentEl).addButton(
      (btn) => btn.setButtonText("Accept").setCta().onClick(() => {
        this.onAccept();
        this.close();
      })
    ).addButton(
      (btn) => btn.setButtonText("Reject").onClick(() => {
        this.close();
      })
    );
  }
};
function registerVaultMindProtocolHandlers(plugin) {
  plugin.registerObsidianProtocolHandler("vault-mind/open-file", (params) => {
    const path6 = params?.path;
    if (!isString(path6)) {
      new import_obsidian3.Notice("Vault Mind: missing path parameter");
      return;
    }
    plugin.app.workspace.openLinkText(path6, "", true);
  });
  plugin.registerObsidianProtocolHandler("vault-mind/show-diff", (params) => {
    const path6 = params?.path;
    const oldContent = params?.old;
    const newContent = params?.new;
    if (!isString(path6) || !isString(oldContent) || !isString(newContent)) {
      new import_obsidian3.Notice("Vault Mind: missing path, old, or new parameter");
      return;
    }
    new DiffModal(plugin.app, { path: path6, old: oldContent, new: newContent }, async () => {
      const file = plugin.app.vault.getAbstractFileByPath(path6);
      if (!(file instanceof import_obsidian3.TFile)) {
        new import_obsidian3.Notice(`Vault Mind: file not found: ${path6}`);
        return;
      }
      try {
        await plugin.app.vault.modify(file, newContent);
        new import_obsidian3.Notice(`Vault Mind: accepted changes to ${path6}`);
      } catch (err) {
        new import_obsidian3.Notice(`Vault Mind: failed to write ${path6}: ${err.message}`);
      }
    }).open();
  });
  plugin.registerObsidianProtocolHandler("vault-mind/notify", (params) => {
    const message = params?.message;
    if (!isString(message)) {
      new import_obsidian3.Notice("Vault Mind: missing message parameter");
      return;
    }
    new import_obsidian3.Notice(message);
  });
  plugin.registerObsidianProtocolHandler("vault-mind/search", async (params) => {
    const query = params?.query;
    if (!isString(query)) {
      new import_obsidian3.Notice("Vault Mind: missing query parameter");
      return;
    }
    const searchLeaf = await plugin.app.workspace.ensureSideLeaf("search", "left");
    if (searchLeaf.view?.setQuery) {
      searchLeaf.view.setQuery(query);
    }
  });
}

// src/token.ts
var PVM_TOKEN_SECRET_ID = "vault-mind-pvm-token";
async function resolveToken(app) {
  const envToken = process.env.PVM_API_TOKEN;
  if (envToken) return envToken;
  return app.secretStorage.getSecret(PVM_TOKEN_SECRET_ID) ?? void 0;
}

// src/views/panel.ts
var import_node_fs2 = require("node:fs");
var import_node_path2 = __toESM(require("node:path"), 1);
var import_obsidian17 = require("obsidian");

// src/chat/rpc.ts
var import_obsidian4 = require("obsidian");
var spawn;
var createInterface;
if (import_obsidian4.Platform.isDesktop) {
  const childProcessModule = require("node:child_process");
  const readlineModule = require("node:readline");
  spawn = childProcessModule.spawn;
  createInterface = readlineModule.createInterface;
}
var PiConnection = class {
  piBinaryPath;
  cwd;
  extraArgs;
  timeout;
  apiKeys;
  piConfigDir;
  sessionsDir;
  buildEnv;
  process = null;
  readline = null;
  handlers = [];
  disconnectHandler = null;
  connected = false;
  requestId = 0;
  pendingRequests = /* @__PURE__ */ new Map();
  intentionallyDestroyed = false;
  constructor(opts) {
    this.piBinaryPath = opts.piBinaryPath;
    this.cwd = opts.cwd;
    this.extraArgs = opts.extraArgs ?? [];
    this.apiKeys = opts.apiKeys ?? {};
    this.timeout = opts.timeout ?? 6e4;
    this.piConfigDir = opts.piConfigDir ?? null;
    this.sessionsDir = opts.sessionsDir ?? null;
    this.buildEnv = opts.buildEnv ?? null;
  }
  /**
   * Spawn the Pi process and set up JSON line parsing on stdout.
   */
  connect() {
    if (this.process) {
      this.destroy();
    }
    this.intentionallyDestroyed = false;
    if (!this.piBinaryPath || this.piBinaryPath.trim() === "") {
      throw new Error("Pi binary path is not configured. Please set the path in plugin settings.");
    }
    const baseEnv = this.buildEnv ? this.buildEnv() : { PATH: process.env.PATH || "/usr/bin:/bin" };
    const env = { ...baseEnv };
    for (const [envVarName, key] of Object.entries(this.apiKeys)) {
      if (key?.trim()) {
        env[envVarName] = key;
      }
    }
    if (this.piConfigDir) {
      env.PI_CODING_AGENT_DIR = this.piConfigDir;
    }
    if (this.sessionsDir) {
      env.PI_SESSIONS_DIR = this.sessionsDir;
    }
    this.process = spawn(this.piBinaryPath, ["--mode", "rpc", ...this.extraArgs], {
      cwd: this.cwd,
      stdio: ["pipe", "pipe", "pipe"],
      env
    });
    this.connected = true;
    const stderrBuffer = [];
    if (this.process.stdout) {
      this.readline = createInterface({
        input: this.process.stdout,
        crlfDelay: Number.POSITIVE_INFINITY
      });
      this.readline.on("line", (line) => {
        const trimmed = line.trim();
        if (!trimmed) return;
        try {
          const event = JSON.parse(trimmed);
          this.dispatch(event);
        } catch {
          console.warn("[Pi RPC] Non-JSON line from stdout:", trimmed);
        }
      });
      this.readline.on("close", () => {
        if (this.intentionallyDestroyed) return;
      });
    }
    if (this.process.stderr) {
      this.process.stderr.on("data", (data) => {
        const text = data.toString();
        stderrBuffer.push(text);
        console.warn("[Pi RPC] stderr:", text);
      });
    }
    this.process.on("exit", (code, signal) => {
      if (this.intentionallyDestroyed) {
        this.connected = false;
        this.cleanup();
        return;
      }
      if (code !== 0) {
        console.warn("[Pi RPC] Process exited with code", code, "signal", signal);
        if (stderrBuffer.length > 0) {
          console.warn("[Pi RPC] stderr output:", stderrBuffer.join(""));
        }
      }
      this.connected = false;
      this.dispatch({
        type: "error",
        error: `Pi process exited (code=${code}, signal=${signal})`
      });
      this.cleanup();
    });
    this.process.on("error", (err) => {
      this.connected = false;
      console.error("[Pi RPC] Process error:", err.message);
      if (stderrBuffer.length > 0) {
        console.error("[Pi RPC] stderr output:", stderrBuffer.join(""));
      }
      this.dispatch({
        type: "error",
        error: `Pi process error: ${err.message}`
      });
      this.cleanup();
    });
  }
  /**
   * Send a command to Pi via stdin as a JSON line.
   * Automatically injects a request ID and returns a Promise that resolves
   * when Pi sends a matching response (type === "response" with same id).
   * Streaming events still go to onEvent handlers.
   */
  send(command) {
    if (!this.process || !this.process.stdin || !this.connected) {
      throw new Error("Pi is not connected");
    }
    const id = `req-${this.requestId++}`;
    const line = `${JSON.stringify({ ...command, id })}
`;
    return new Promise((resolve, reject) => {
      const timeoutId = window.setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error(`Request ${id} timed out after ${this.timeout / 1e3}s`));
        }
      }, this.timeout);
      this.pendingRequests.set(id, {
        resolve: (value) => {
          window.clearTimeout(timeoutId);
          resolve(value);
        },
        reject: (reason) => {
          window.clearTimeout(timeoutId);
          reject(reason);
        },
        timeoutId
      });
      this.process?.stdin?.write(line);
    });
  }
  /**
   * Send a raw JSON line without request tracking.
   * Used for extension UI responses in RPC mode.
   */
  sendRaw(command) {
    if (!this.process || !this.process.stdin || !this.connected) {
      throw new Error("Pi is not connected");
    }
    this.process.stdin.write(`${JSON.stringify(command)}
`);
  }
  /**
   * Register a handler for events received from Pi.
   * Each JSON line parsed from stdout is dispatched to all handlers.
   */
  onEvent(handler) {
    this.handlers.push(handler);
  }
  /**
   * Remove a previously registered event handler.
   */
  offEvent(handler) {
    const idx = this.handlers.indexOf(handler);
    if (idx !== -1) {
      this.handlers.splice(idx, 1);
    }
  }
  /**
   * Register a handler called when the Pi process disconnects unexpectedly.
   */
  onDisconnect(handler) {
    this.disconnectHandler = handler;
  }
  /**
   * Kill the child process and clean up.
   */
  destroy() {
    this.intentionallyDestroyed = true;
    this.disconnectHandler = null;
    this.handlers = [];
    if (this.readline) {
      this.readline.close();
      this.readline = null;
    }
    if (this.process) {
      this.process.kill();
    }
    this.cleanup();
  }
  /**
   * Check if the Pi process is alive.
   */
  isConnected() {
    return this.connected;
  }
  /**
   * Return the vault-scoped session directory override, if any.
   */
  getSessionsDir() {
    return this.sessionsDir;
  }
  dispatch(event) {
    if (this.intentionallyDestroyed) {
      return;
    }
    if (event.type === "error" && this.intentionallyDestroyed) {
      return;
    }
    if (event.type === "response" && typeof event.id === "string") {
      const pending = this.pendingRequests.get(event.id);
      if (pending) {
        this.pendingRequests.delete(event.id);
        if (event.success === false) {
          pending.reject(new Error(String(event.error || "Request failed")));
        } else {
          pending.resolve(event);
        }
        return;
      }
    }
    for (const handler of this.handlers) {
      try {
        handler(event);
      } catch (err) {
        console.error("[Pi RPC] Handler error:", err);
      }
    }
  }
  cleanup() {
    const wasConnected = this.connected;
    this.connected = false;
    if (this.readline) {
      this.readline.close();
      this.readline = null;
    }
    this.process = null;
    for (const [, pending] of this.pendingRequests) {
      window.clearTimeout(pending.timeoutId);
      pending.reject(new Error("Pi connection closed"));
    }
    this.pendingRequests.clear();
    if (wasConnected && this.disconnectHandler) {
      this.disconnectHandler();
    }
  }
};

// src/chat/vault-mind-chat-view.ts
var import_promises = require("node:fs/promises");
var import_obsidian13 = require("obsidian");

// src/chat/arrow/input.ts
var import_obsidian6 = require("obsidian");

// src/chat/strings.ts
var strings = {
  "attachment.attached": "Attached: {{names}}",
  "attachment.imagesAttached": "{{count}} image(s) attached",
  "commands.browseSessions": "Browse sessions",
  "commands.newSession": "New session",
  "commands.openChat": "Open chat",
  "commands.piPrefix": "Pi: /{{name}}{{desc}}",
  "commands.saveSession": "Save conversation",
  "commands.sendPrompt": "Send prompt",
  "commands.switchModel": "Switch model",
  "modals.cancel": "Cancel",
  "modals.confirmNo": "No",
  "modals.confirmYes": "Yes",
  "modals.selectCommand": "Select a command\u2026",
  "modals.selectModel": "Select a model\u2026",
  "modals.submit": "Submit",
  "notices.abortConnectionLost": "Connection lost \u2014 resetting the view",
  "notices.cannotRewind": "Cannot rewind a saved session",
  "notices.compacted": "Pi conversation compacted",
  "notices.copied": "Copied to clipboard",
  "notices.copyFailed": "Failed to copy the message",
  "notices.deleteFailed": "Failed to delete session",
  "notices.deletedSession": "Deleted session: {{name}}",
  "notices.disconnected": "Pi disconnected. Use the send prompt command to reconnect.",
  "notices.exportFailed": "Export failed \u2014 persistence may be disabled",
  "notices.exportFailedGeneral": "Export failed",
  "notices.exportedTo": "Exported to {{path}}",
  "notices.fileReadFailed": "Failed to read the file",
  "notices.loadFailed": "Failed to load session: {{msg}}",
  "notices.loadedSession": "Loaded session: {{date}}",
  "notices.messagesLoadFailed": "Failed to load messages from Pi",
  "notices.mobileUnsupported": "Pi requires desktop Obsidian.",
  "notices.modelSwitchFailed": "Failed to switch the model: {{msg}}",
  "notices.modelSwitched": "Switched to {{name}}",
  "notices.modelsFetchFailed": "Failed to fetch models: {{msg}}",
  "notices.newSession": "New session started",
  "notices.newSessionCancelled": "New session was cancelled",
  "notices.newSessionFailed": "Failed to create a new session: {{msg}}",
  "notices.noActiveChat": "No active Pi chat",
  "notices.noConversation": "No conversation to save",
  "notices.noExportMessages": "No messages to export",
  "notices.noModels": "No models available",
  "notices.noSavedSessions": "No saved sessions found",
  "notices.noSession": "No active session",
  "notices.notConnected": "Not connected to Pi",
  "notices.notRewindable": "This message cannot be rewound",
  "notices.onlyUserRewind": "Only user messages can be rewound",
  "notices.piError": "Pi error: {{msg}}",
  "notices.readOnly": "This is a saved session (read-only). Start a new session to chat.",
  "notices.reconnected": "Pi reconnected.",
  "notices.renameFailed": "Failed to rename the session",
  "notices.renamedSession": "Renamed session to {{name}}",
  "notices.renderError": "\u26A0\uFE0F Failed to render the message",
  "notices.returnCancelled": "Return was cancelled",
  "notices.returnFailed": "Return failed: {{msg}}",
  "notices.returnSuccess": "Returned to latest",
  "notices.rewindCancelled": "Rewind was cancelled by Pi",
  "notices.rewindFailed": "Rewind failed: {{msg}}",
  "notices.rewindSuccess": "Rewound. Edit the message or return to latest.",
  "notices.saveDisabled": "Session not saved (persistence disabled or empty)",
  "notices.saveFailed": "Failed to save session: {{msg}}",
  "notices.savedTo": "Session saved to {{path}}",
  "notices.sendFailed": "Failed to send the message to Pi",
  "notices.sending": "Sending a prompt to Pi\u2026",
  "notices.startFailed": "Failed to start Pi: {{msg}}. Check the binary path in settings.",
  "notices.switchCancelled": "Session switch was cancelled",
  "notices.switchFailed": "Failed to switch session",
  "notices.switchedTo": "Switched to {{name}}",
  "notices.waitRewind": "Wait for Pi to finish before rewinding",
  "notices.waitReturn": "Wait for Pi to finish before returning",
  "renderer.errorLabel": "Error: ",
  "renderer.infoCost": "Cost",
  "renderer.infoModel": "Model",
  "renderer.infoTitle": "Message info",
  "renderer.infoTokens": "Tokens",
  "renderer.infoTooltip": "Info",
  "renderer.infoUnavailable": "No stats available",
  "renderer.result": "Result",
  "renderer.rewindTooltip": "Rewind to this message",
  "renderer.thinkingSummary": "Thinking\u2026",
  "sessionList.emptyPreview": "(Empty session)",
  "sessionList.placeholder": "Browse saved sessions\u2026",
  "sessionPanel.close.tooltip": "Close panel",
  "sessionPanel.confirmDelete": "Delete session '{{name}}'?\nThis cannot be undone.",
  "sessionPanel.delete.tooltip": "Delete session",
  "sessionPanel.empty": "No sessions found",
  "sessionPanel.export.tooltip": "Export to vault",
  "sessionPanel.failedLoad": "Failed to load sessions",
  "sessionPanel.filterPlaceholder": "Filter sessions\u2026",
  "sessionPanel.msgCount": "{{count}} messages",
  "sessionPanel.noMatch": "No matching sessions",
  "sessionPanel.rename.tooltip": "Rename session",
  "sessionPanel.title": "Sessions",
  "sessionPanel.today": "Today {{time}}",
  "sessionPanel.yesterday": "Yesterday {{time}}",
  "sessionPopover.cancel": "Cancel",
  "sessionPopover.confirmDelete": "Delete",
  "sessionPopover.current": "current",
  "sessionPopover.deleteConfirm": "Delete this session?",
  "sessionPopover.empty": "No sessions found",
  "sessionPopover.failedLoad": "Failed to load sessions",
  "sessionPopover.renamePlaceholder": "Session name",
  "sessionPopover.save": "Save name",
  "sessionPopover.title": "Sessions",
  "statusBar.default": "Pi",
  "statusBar.streaming": "\u23F3",
  "view.abort": "Abort",
  "view.newBtn.tooltip": "New session",
  "view.newSession": "New session",
  "view.readOnlyBanner": "\u{1F4D6} Viewing saved session",
  "view.returnBanner.button": "Return to latest",
  "view.returnBanner.text": "You are viewing a rewind fork.",
  "view.returnBanner.tooltip": "Return to the session state before rewind",
  "view.rewind": "Rewind",
  "view.sessionName.tooltip": "Click to rename the session",
  "view.sessionsBtn.tooltip": "Browse sessions",
  "view.thinking": "Thinking\u2026",
  "view.title": "Pi chat"
};
function t(key, vars) {
  let str = strings[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replaceAll(`{{${k}}}`, String(v));
    }
  }
  return str;
}

// src/chat/attachment.ts
function formatAttachmentSize(bytes) {
  const kb = bytes / 1024;
  if (kb >= 1024) {
    return `${(kb / 1024).toFixed(1)} MB`;
  }
  return `${kb.toFixed(1)} KB`;
}

// src/chat/arrow/reactive.ts
function createChatReactiveState(initial = {}) {
  return reactive({
    model: initial.model ?? "",
    currentModel: initial.currentModel ?? "",
    fallbackNotice: initial.fallbackNotice ?? null,
    thinkingLevel: initial.thinkingLevel ?? "medium",
    streaming: initial.streaming ?? false,
    tokens: initial.tokens ?? 0,
    cost: initial.cost ?? 0,
    messages: initial.messages ?? [],
    mentionables: initial.mentionables ?? [],
    focusedMentionableIndex: initial.focusedMentionableIndex ?? null,
    sessionName: initial.sessionName ?? "",
    text: initial.text ?? "",
    placeholder: initial.placeholder ?? "",
    statusText: initial.statusText ?? ""
  });
}
function appendMessage(state, msg) {
  state.messages = [...state.messages, msg];
}
function updateLastMessage(state, content) {
  const last = state.messages[state.messages.length - 1];
  if (last) {
    last.content = content;
  }
}
function clearMessages(state) {
  state.messages = [];
}
function addMentionable(state, mentionable) {
  state.mentionables = [...state.mentionables, mentionable];
}
function removeMentionable(state, index2) {
  const focused = state.focusedMentionableIndex;
  state.mentionables = state.mentionables.filter((_, i) => i !== index2);
  if (focused === null) return;
  if (focused === index2) {
    state.focusedMentionableIndex = null;
  } else if (focused > index2) {
    state.focusedMentionableIndex = focused - 1;
  }
}
function resetComposer(state) {
  state.mentionables = [];
  state.focusedMentionableIndex = null;
  state.tokens = 0;
  state.cost = 0;
}
function setFocusedMentionableIndex(state, index2) {
  state.focusedMentionableIndex = state.focusedMentionableIndex === index2 ? null : index2;
}
function clearFocusedMentionable(state) {
  state.focusedMentionableIndex = null;
}

// src/chat/arrow/mentionable-badges.ts
function openAttachmentFile(app, attachment) {
  app.workspace.openLinkText(attachment.name, "", true);
}
function handleChipClick(props, attachment, index2, e) {
  e.stopPropagation();
  const state = props.state;
  if (state.focusedMentionableIndex === index2) {
    if (props.app) {
      openAttachmentFile(props.app, attachment);
    }
    clearFocusedMentionable(state);
  } else {
    setFocusedMentionableIndex(state, index2);
  }
}
function handleRemove(props, index2, e) {
  e.stopPropagation();
  removeMentionable(props.state, index2);
}
function MentionableBadges(props) {
  return html`<div class="pi-attachments">
		${() => props.state.mentionables.length > 0 ? props.state.mentionables.map((attachment, index2) => {
    const isFocused = () => props.state.focusedMentionableIndex === index2;
    return html`<div
							class="${() => isFocused() ? "pi-attachment-chip pi-mentionable-chip is-focused" : "pi-attachment-chip pi-mentionable-chip"}"
							title="${() => attachment.name}"
							@click="${(e) => handleChipClick(props, attachment, index2, e)}"
						>
							${() => attachment.type === "image" ? html`<img
											class="pi-attachment-thumb"
											src="data:${() => attachment.mimeType ?? "image/png"};base64,${() => attachment.content}"
											alt="${() => attachment.name}"
										/>` : ""}
								<span class="pi-attachment-name">${() => attachment.name}</span>
								${() => attachment.size != null ? html`<span class="pi-attachment-size"
											> (${() => formatAttachmentSize(attachment.size)})</span
										>` : ""}
								<button
									class="pi-attachment-remove"
									type="button"
									aria-label="Remove attachment"
									@click="${(e) => handleRemove(props, index2, e)}"
								>
									×
								</button>
							</div>`.key(`${attachment.name}-${index2}`);
  }) : ""}
	</div>`;
}

// src/chat/arrow/model-select.ts
var import_obsidian5 = require("obsidian");
function ModelSelect(props) {
  const local = reactive({
    open: false
  });
  async function handleSequenceChange(seq) {
    if (seq.length === 0) return;
    const newPrimary = seq[0];
    if (newPrimary === props.state.model) return;
    const conn = props.connection;
    const previousModel = props.state.model;
    props.state.model = newPrimary;
    if (!conn?.isConnected()) {
      new import_obsidian5.Notice(t("notices.notConnected"));
      props.state.model = previousModel;
      return;
    }
    try {
      await conn.send({ type: "switch_model", model: newPrimary });
      new import_obsidian5.Notice(t("notices.modelSwitched", { name: newPrimary }));
    } catch (err) {
      props.state.model = previousModel;
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[Pi Chat] switch_model failed:", err);
      new import_obsidian5.Notice(t("notices.modelSwitchFailed", { msg }));
    }
  }
  function chipLabel() {
    const model = props.state.model || t("notices.noModels");
    const thinking = props.state.thinkingLevel;
    if (thinking && thinking !== "off") {
      return `${model} :${thinking}`;
    }
    return model;
  }
  function toggleOpen() {
    if (!import_obsidian5.Platform.isDesktop) {
      new import_obsidian5.Notice(t("notices.mobileUnsupported"));
      return;
    }
    local.open = !local.open;
  }
  return html`<div class="pi-model-select">
		<button
			class="pi-model-chip"
			type="button"
			@click="${toggleOpen}"
			aria-haspopup="dialog"
			aria-expanded="${() => local.open}"
		>
			${() => chipLabel()}
			<span class="pi-model-chip-caret">▾</span>
		</button>
		${() => local.open ? html`<div class="pi-model-dropdown pi-model-dropdown--picker" role="dialog">
						${ModelSequencePicker({
    sequence: props.state.model ? [props.state.model] : [],
    projectPath: props.projectPath,
    onSequenceChange: (seq) => {
      void handleSequenceChange(seq);
    }
  })}
					</div>` : false}
	</div>`;
}

// src/chat/arrow/input.ts
var MAX_IMAGE_SIZE = 5 * 1024 * 1024;
function buildChatInput(props) {
  let textareaEl = null;
  let isComposing = false;
  let outsideCleanup = null;
  const fileInputId = `pi-composer-file-${Math.random().toString(36).slice(2)}`;
  function adjustHeight() {
    if (!textareaEl) return;
    textareaEl.style.height = "auto";
    textareaEl.style.height = `${Math.min(textareaEl.scrollHeight, 200)}px`;
  }
  function canSend() {
    return props.state.text.trim().length > 0 || props.state.mentionables.length > 0;
  }
  function focus() {
    textareaEl?.focus();
  }
  function send() {
    const text = props.state.text.trim();
    if (!text && props.state.mentionables.length === 0) return;
    props.onSend(text, [...props.state.mentionables]);
    resetComposer(props.state);
    props.state.text = "";
    adjustHeight();
    focus();
  }
  function handleInput(e) {
    const target = e.target;
    textareaEl = target;
    props.state.text = target.value;
  }
  function handleKeydown(e) {
    if (e.key === "Escape") {
      if (props.state.focusedMentionableIndex != null) {
        e.preventDefault();
        clearFocusedMentionable(props.state);
        return;
      }
    }
    if (props.state.streaming) return;
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      send();
      return;
    }
    if (e.key === "/" && props.onSlashTyped) {
      window.setTimeout(() => {
        if (textareaEl?.value.startsWith("/")) {
          props.onSlashTyped?.();
        }
      }, 0);
    }
    if (e.key === "@" && props.onAtTyped) {
      window.setTimeout(() => props.onAtTyped?.(), 0);
    }
  }
  function startComposition() {
    isComposing = true;
  }
  function endComposition() {
    isComposing = false;
  }
  function handlePaste(e) {
    if (!e.clipboardData) return;
    for (const item of e.clipboardData.items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          attachImage(file);
        }
        break;
      }
    }
  }
  function handleFileSelect(e) {
    const target = e.target;
    const files = target.files;
    if (!files) return;
    for (const file of files) {
      if (file.type.startsWith("image/")) {
        attachImage(file);
      }
    }
    target.value = "";
  }
  function attachImage(file) {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        console.error("[ChatInput] Failed to read image as data URL");
        return;
      }
      const parts = result.split(",");
      if (parts.length < 2) {
        console.error("[ChatInput] Invalid data URL format");
        return;
      }
      const base64 = parts[1];
      const sizeBytes = base64.length * 3 / 4;
      if (sizeBytes > MAX_IMAGE_SIZE) {
        new import_obsidian6.Notice(`Image too large (${(sizeBytes / (1024 * 1024)).toFixed(1)}MB). Max 5MB.`);
        return;
      }
      addMentionable(props.state, {
        type: "image",
        name: file.name || `pasted-image-${Date.now()}.png`,
        content: base64,
        mimeType: file.type || "image/png",
        size: sizeBytes
      });
    };
    reader.onerror = () => {
      console.error("[ChatInput] FileReader error:", reader.error);
    };
    reader.readAsDataURL(file);
  }
  function attachOutsideListener() {
    if (outsideCleanup) return;
    const handler = (e) => {
      if (props.state.focusedMentionableIndex == null) return;
      const target = e.target;
      const previewEl = document.querySelector(".pi-mentionable-preview-panel");
      const chipsEl = document.querySelector(".pi-attachments");
      if (previewEl?.contains(target) || chipsEl?.contains(target)) {
        return;
      }
      clearFocusedMentionable(props.state);
    };
    document.addEventListener("mousedown", handler, true);
    outsideCleanup = () => document.removeEventListener("mousedown", handler, true);
  }
  function detachOutsideListener() {
    outsideCleanup?.();
    outsideCleanup = null;
  }
  function renderPreviewContent(attachment) {
    if (attachment.type === "image") {
      const src = `data:${attachment.mimeType ?? "image/png"};base64,${attachment.content}`;
      return html`<img class="pi-mentionable-preview-image" src="${src}" alt="${attachment.name}" />`;
    }
    const body = attachment.content.split(/\r?\n/).slice(0, 10);
    const trimmed = attachment.content.trim();
    let hostname = "";
    if (/^https?:\/\//.test(trimmed)) {
      try {
        hostname = new URL(trimmed).hostname;
      } catch {
      }
    }
    return html`<div class="pi-mentionable-preview-body">
			${hostname ? html`<p class="pi-mentionable-preview-hostname">${hostname}</p>` : ""}
			${body.length === 0 ? html`<p class="pi-mentionable-preview-empty">(empty file)</p>` : body.map((line) => html`<p>${line}</p>`)}
		</div>`;
  }
  const [, stopWatchingText] = watch(() => props.state.text, adjustHeight);
  const [, stopWatchingFocus] = watch(
    () => props.state.focusedMentionableIndex,
    (index2) => {
      if (index2 != null) attachOutsideListener();
      else detachOutsideListener();
    }
  );
  const template = html`<div class="pi-composer" @paste="${handlePaste}">
		<div class="pi-composer-attachments">
			${MentionableBadges({ state: props.state, app: props.app })}
		</div>

		${() => {
    const index2 = props.state.focusedMentionableIndex;
    if (index2 == null) return "";
    const attachment = props.state.mentionables[index2];
    if (!attachment) return "";
    return html`<div
				class="pi-mentionable-preview-panel"
				role="region"
				aria-label="Mentionable preview"
			>
				<div class="pi-mentionable-preview-title">${attachment.name}</div>
				${renderPreviewContent(attachment)}
			</div>`;
  }}

		<textarea
			class="${() => props.state.streaming ? "pi-composer-textarea pi-input-disabled" : "pi-composer-textarea"}"
			rows="1"
			.placeholder="${() => props.state.placeholder}"
			.disabled="${() => props.state.streaming}"
			@input="${handleInput}"
			@keydown="${handleKeydown}"
			@compositionstart="${startComposition}"
			@compositionend="${endComposition}"
			.value="${() => props.state.text}"
		></textarea>

		<div class="pi-composer-controls">
			${ModelSelect({
    state: props.state,
    connection: props.connection,
    projectPath: props.projectPath
  })}

			<div class="pi-composer-spacer" style="flex: 1;"></div>

			<input
				id="${fileInputId}"
				type="file"
				accept="image/*"
				class="pi-composer-file-input"
				@change="${handleFileSelect}"
			/>
			<label
				class="pi-composer-upload"
				for="${fileInputId}"
				aria-label="Attach image"
			>
				🖼
			</label>

			${() => props.state.streaming ? html`<button
							class="pi-composer-abort"
							type="button"
							aria-label="${t("view.abort")}"
							@click="${() => props.onAbort?.()}"
						>
							${t("view.abort")}
						</button>` : html`<button
							class="pi-composer-send"
							type="button"
							disabled="${() => !canSend()}"
							@click="${send}"
						>
						Send
					</button>`}

			<button
				class="pi-composer-vaultchat"
				type="button"
				disabled="${() => props.state.streaming}"
				aria-label="Vault search mode"
				title="Vault search mode"
				@click="${() => props.onVaultChat?.()}"
			>
				⌘↑↵
			</button>
		</div>
	</div>`;
  return {
    template,
    stopWatch: () => {
      stopWatchingText();
      stopWatchingFocus();
      detachOutsideListener();
    }
  };
}
var ArrowChatInput = class {
  containerEl;
  unmount = null;
  stopWatch = null;
  textareaEl = null;
  constructor(containerEl, props) {
    this.containerEl = containerEl;
    this.containerEl.empty();
    const { template, stopWatch } = buildChatInput(props);
    this.stopWatch = stopWatch;
    const result = template(this.containerEl);
    this.unmount = typeof result === "function" ? result : null;
    this.textareaEl = this.containerEl.querySelector(".pi-composer-textarea");
  }
  /** Move focus to the composer textarea. */
  focus() {
    this.textareaEl?.focus();
  }
  /** Enable or disable the composer textarea. */
  setEnabled(enabled) {
    if (!this.textareaEl) return;
    this.textareaEl.disabled = !enabled;
    this.textareaEl.classList.toggle("pi-input-disabled", !enabled);
  }
  /** Tear down the Arrow component and clear the container. */
  destroy() {
    if (this.unmount) {
      this.unmount();
      this.unmount = null;
    }
    this.stopWatch?.();
    this.stopWatch = null;
    this.textareaEl = null;
    this.containerEl.empty();
  }
};

// src/chat/arrow/message-feed.ts
var import_obsidian8 = require("obsidian");

// src/chat/arrow/message-actions.ts
var import_obsidian7 = require("obsidian");
function mountMessageActions(container, options) {
  const state = reactive({
    content: options.content,
    tokens: options.tokens,
    cost: options.cost,
    model: options.model
  });
  const ui = reactive({ copied: false, infoOpen: false });
  let currentRewind = options.onRewind;
  let popoverEl = null;
  let outsideClose = null;
  function closeInfo() {
    if (popoverEl) {
      popoverEl.remove();
      popoverEl = null;
    }
    if (outsideClose) {
      document.removeEventListener("mousedown", outsideClose);
      outsideClose = null;
    }
    ui.infoOpen = false;
  }
  function openInfo(anchor) {
    closeInfo();
    popoverEl = document.body.createDiv({ cls: "pi-message-actions-popover" });
    popoverEl.setAttribute("role", "dialog");
    popoverEl.setAttribute("aria-label", "Message info");
    const title = popoverEl.createDiv({ cls: "pi-message-actions-popover-title" });
    title.setText(t("renderer.infoTitle"));
    const body = popoverEl.createDiv({ cls: "pi-message-actions-popover-body" });
    if (state.model) {
      body.createEl("p", {
        text: `${t("renderer.infoModel")}: ${state.model}`
      });
    }
    if (state.tokens > 0) {
      body.createEl("p", {
        text: `${t("renderer.infoTokens")}: ${state.tokens.toLocaleString()}`
      });
    }
    if (state.cost > 0) {
      body.createEl("p", {
        text: `${t("renderer.infoCost")}: $${state.cost.toFixed(4)}`
      });
    }
    if (!state.model && state.tokens === 0 && state.cost === 0) {
      body.createEl("p", { text: t("renderer.infoUnavailable") });
    }
    document.body.appendChild(popoverEl);
    const rect = anchor.getBoundingClientRect();
    const gap = 4;
    let top = rect.bottom + gap;
    let left = rect.left;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const popoverRect = popoverEl.getBoundingClientRect();
    if (left + popoverRect.width > viewportWidth) {
      left = Math.max(8, viewportWidth - popoverRect.width - 8);
    }
    if (top + popoverRect.height > viewportHeight) {
      top = Math.max(8, rect.top - popoverRect.height - gap);
    }
    popoverEl.style.position = "fixed";
    popoverEl.style.left = `${left}px`;
    popoverEl.style.top = `${top}px`;
    popoverEl.style.zIndex = "1000";
    ui.infoOpen = true;
    outsideClose = (e) => {
      if (!popoverEl?.contains(e.target) && !container.contains(e.target)) {
        closeInfo();
      }
    };
    document.addEventListener("mousedown", outsideClose);
  }
  function toggleInfo(e) {
    const anchor = e.currentTarget;
    if (ui.infoOpen) {
      closeInfo();
    } else {
      openInfo(anchor);
    }
  }
  async function copyContent() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(state.content);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = state.content;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
      ui.copied = true;
      window.setTimeout(() => {
        ui.copied = false;
      }, 1500);
    } catch (err) {
      console.warn("[Pi Chat] Failed to copy message:", err);
      new import_obsidian7.Notice(t("notices.copyFailed"));
    }
  }
  function handleRewind() {
    currentRewind?.();
  }
  const template = html`<div class="pi-message-action-row" role="toolbar" aria-label="Message actions">
		<button
			class="pi-message-action-btn pi-message-action-copy"
			type="button"
			aria-label="${() => ui.copied ? t("notices.copied") : t("renderer.copyTooltip")}"
			@click="${copyContent}"
		>
			${() => ui.copied ? "\u2713" : t("renderer.copyTooltip")}
		</button>
		<button
			class="pi-message-action-btn pi-message-action-info"
			type="button"
			aria-label="${t("renderer.infoTooltip")}"
			@click="${toggleInfo}"
		>
			${t("renderer.infoTooltip")}
		</button>
		${() => currentRewind ? html`<button
						class="pi-message-action-btn pi-message-action-rewind"
						type="button"
						aria-label="${t("renderer.rewindTooltip")}"
						@click="${handleRewind}"
					>
						${t("view.rewind")}
					</button>` : ""}
	</div>`;
  const result = template(container);
  const unmountFn = typeof result === "function" ? result : () => container.empty();
  return {
    update(opts) {
      if (opts.content !== void 0) state.content = opts.content;
      if (opts.tokens !== void 0) state.tokens = opts.tokens;
      if (opts.cost !== void 0) state.cost = opts.cost;
      if (opts.model !== void 0) state.model = opts.model;
      if (opts.onRewind !== void 0) currentRewind = opts.onRewind;
    },
    unmount() {
      closeInfo();
      unmountFn();
    }
  };
}

// src/chat/arrow/message-feed.ts
function MessageRow(msg, state, options) {
  const roleClass = "vault-mind-message";
  const steerClass = msg.isSteering ? " pi-message-steer" : "";
  const toolErrorClass = msg.role === "tool" && msg.isError ? " pi-message-tool-error" : "";
  const wrapperClass = `${roleClass}${steerClass}${toolErrorClass}`;
  const shouldShowLabel = (index3) => {
    if (index3 === 0) return true;
    return state.messages[index3 - 1].role !== msg.role;
  };
  const index2 = state.messages.indexOf(msg);
  return html`
		<div class="${wrapperClass}">
			${shouldShowLabel(index2) ? html`
						<div class="vault-mind-message-role">
							<span>
								${msg.role === "user" ? msg.isSteering ? "You (steer)" : "You" : msg.role === "assistant" ? "Pi" : msg.role === "tool" ? `\u2699 ${msg.toolName || "tool"}` : "Unknown"}
							</span>
							${msg.role === "assistant" ? html`<span class="pi-message-action-row"></span>` : msg.role === "user" && options.onRewind ? html`<span class="pi-message-actions"></span>` : ""}
						</div>
					` : ""}
			<div class="vault-mind-message-body"></div>
		</div>
	`;
}
function MessageFeed(container, state, app, options) {
  const unmountResult = renderRows();
  const unmountTemplate = typeof unmountResult === "function" ? unmountResult : () => {
  };
  const renderedComponents = /* @__PURE__ */ new Map();
  const renderedContent = /* @__PURE__ */ new Map();
  const renderMessageContent = (row, msg) => {
    const contentEl = row.querySelector(".vault-mind-message-body");
    if (!contentEl || !(contentEl instanceof HTMLElement)) return;
    if (renderedContent.get(msg.id) === msg.content && msg.role !== "assistant") return;
    if (msg.role === "assistant" && state.messages[state.messages.length - 1].id !== msg.id) {
      if (renderedContent.get(msg.id) === msg.content) return;
    }
    const oldComponent = renderedComponents.get(msg.id);
    if (oldComponent) {
      oldComponent.unload();
      renderedComponents.delete(msg.id);
    }
    contentEl.empty();
    const component2 = new import_obsidian8.Component();
    component2.load();
    renderedComponents.set(msg.id, component2);
    renderedContent.set(msg.id, msg.content);
    if (msg.role === "user") {
      contentEl.createEl("p", { text: msg.content });
      if (options.onRewind) {
        const actionBar = row.querySelector(".pi-message-actions");
        if (actionBar && actionBar instanceof HTMLElement) {
          const btn = actionBar.createEl("button", {
            cls: "pi-message-rewind-btn",
            text: t("view.rewind"),
            attr: { title: t("renderer.rewindTooltip") }
          });
          btn.addEventListener("click", () => options.onRewind?.(msg));
        }
      }
    } else if (msg.role === "assistant") {
      if (msg.thinkingContent) {
        const thinkingEl = contentEl.createEl("details", { cls: "pi-thinking" });
        thinkingEl.createEl("summary", { text: t("renderer.thinkingSummary") });
        const thinkingContentEl = thinkingEl.createDiv({ cls: "pi-thinking-content" });
        import_obsidian8.MarkdownRenderer.render(app, msg.thinkingContent, thinkingContentEl, "", component2);
      }
      import_obsidian8.MarkdownRenderer.render(app, msg.content, contentEl, "", component2);
      const actionRow = row.querySelector(".pi-message-action-row");
      if (actionRow && actionRow instanceof HTMLElement) {
        mountMessageActions(actionRow, {
          content: msg.content,
          tokens: msg.tokens ?? 0,
          cost: msg.cost ?? 0,
          model: msg.model ?? state.model,
          onRewind: () => {
          }
        });
      }
    } else if (msg.role === "tool") {
      const details = contentEl.createEl("details");
      const summary = details.createEl("summary");
      summary.createSpan({ text: `\u2699 ${msg.toolName || "tool"}`, cls: "pi-tool-name" });
      if (msg.isError) summary.createSpan({ text: " \u2717", cls: "pi-tool-error-indicator" });
      const body = details.createDiv({ cls: "pi-tool-body" });
      const resultSection = body.createDiv({ cls: "pi-tool-result" });
      resultSection.createEl("div", {
        text: t("renderer.result"),
        cls: "pi-tool-section-label"
      });
      const resultContent = resultSection.createDiv({ cls: "pi-tool-result-content" });
      import_obsidian8.MarkdownRenderer.render(app, msg.content, resultContent, "", component2);
    }
  };
  const syncMessages = () => {
    const rows = container.querySelectorAll(".msg-row-wrapper");
    let i = 0;
    for (const row of rows) {
      const msg = state.messages[i];
      if (msg && row instanceof HTMLElement) {
        renderMessageContent(row, msg);
      }
      i++;
    }
  };
  function renderRows() {
    const template = html`
			<div class="vault-mind-messages">
				${state.messages.map((msg) => {
      return html`<div class="msg-row-wrapper" data-id="${msg.id}">
						${MessageRow(msg, state, options)}
					</div>`.key(msg.id);
    })}
			</div>
		`;
    return template(container);
  }
  const [, stopWatchMessages] = watch(
    () => ({
      len: state.messages.length,
      lastRole: state.messages.at(-1)?.role
    }),
    () => {
      renderRows();
      syncMessages();
    }
  );
  const [, stopWatchStreaming] = watch(
    () => ({
      len: state.messages.length,
      contents: state.messages.map((m) => m.content).join("\0"),
      streaming: state.streaming
    }),
    () => {
      nextTick(syncMessages);
    }
  );
  nextTick(syncMessages);
  return {
    unmount: () => {
      unmountTemplate();
      stopWatchMessages();
      stopWatchStreaming();
      for (const c of renderedComponents.values()) c.unload();
      renderedComponents.clear();
      renderedContent.clear();
    }
  };
}

// src/chat/arrow/modals.ts
var import_obsidian9 = require("obsidian");
function moveFocusWithin(container, selector, direction) {
  const items = Array.from(container.querySelectorAll(selector));
  if (items.length === 0) return;
  const active = container.ownerDocument.activeElement;
  const index2 = active ? items.indexOf(active) : -1;
  let next = index2 + direction;
  if (next < 0) next = items.length - 1;
  if (next >= items.length) next = 0;
  items[next]?.focus();
}
var PermissionSelectModal = class extends import_obsidian9.Modal {
  titleText;
  options;
  onResponse;
  selectedOption = null;
  unmount = null;
  responded = false;
  constructor(app, title, options, onResponse) {
    super(app);
    this.titleText = title;
    this.options = options;
    this.onResponse = onResponse;
  }
  onOpen() {
    this.contentEl.addClass("pi-permission-modal");
    const state = reactive({ selected: null });
    const select = (option) => {
      state.selected = option;
      this.selectedOption = option;
      this.close();
    };
    const template = html`<h2>${this.titleText}</h2>
			<div class="pi-permission-options">
				${() => this.options.map(
      (option) => html`<button
							class="pi-permission-option-btn"
							type="button"
							aria-label="${option}"
							@click="${() => select(option)}"
							@keydown="${(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          select(option);
        }
      }}"
						>
							${option}
						</button>`.key(option)
    )}
			</div>
			<button
				class="pi-permission-cancel-btn"
				type="button"
				@click="${() => this.close()}"
			>
				${t("modals.cancel")}
			</button>`;
    const result = template(this.contentEl);
    this.unmount = typeof result === "function" ? result : null;
    const first = this.contentEl.querySelector(".pi-permission-option-btn");
    first?.focus();
    this.contentEl.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        moveFocusWithin(this.contentEl, ".pi-permission-option-btn, .pi-permission-cancel-btn", 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        moveFocusWithin(this.contentEl, ".pi-permission-option-btn, .pi-permission-cancel-btn", -1);
      }
    });
  }
  onClose() {
    this.unmount?.();
    this.contentEl.empty();
    if (this.responded) return;
    this.responded = true;
    if (this.selectedOption) {
      this.onResponse({ value: this.selectedOption });
    } else {
      this.onResponse({ cancelled: true });
    }
  }
};
var PermissionConfirmModal = class extends import_obsidian9.Modal {
  titleText;
  messageText;
  onResponse;
  confirmed = false;
  unmount = null;
  responded = false;
  constructor(app, title, message, onResponse) {
    super(app);
    this.titleText = title;
    this.messageText = message;
    this.onResponse = onResponse;
  }
  onOpen() {
    this.contentEl.addClass("pi-permission-modal");
    const confirm = () => {
      this.confirmed = true;
      this.close();
    };
    const template = html`<h2>${this.titleText}</h2>
			${() => this.messageText ? html`<p>${this.messageText}</p>` : false}
			<div class="pi-permission-buttons">
				<button
					class="pi-permission-confirm-btn"
					type="button"
					aria-label="${t("modals.confirmYes")}"
					@click="${confirm}"
					@keydown="${(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        confirm();
      }
    }}"
				>
					${t("modals.confirmYes")}
				</button>
				<button
					class="pi-permission-cancel-btn"
					type="button"
					aria-label="${t("modals.confirmNo")}"
					@click="${() => this.close()}"
					@keydown="${(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.close();
      }
    }}"
				>
					${t("modals.confirmNo")}
				</button>
			</div>`;
    const result = template(this.contentEl);
    this.unmount = typeof result === "function" ? result : null;
    const confirmBtn = this.contentEl.querySelector(
      ".pi-permission-confirm-btn"
    );
    confirmBtn?.focus();
  }
  onClose() {
    this.unmount?.();
    this.contentEl.empty();
    if (this.responded) return;
    this.responded = true;
    this.onResponse({ confirmed: this.confirmed });
  }
};
var PermissionInputModal = class extends import_obsidian9.Modal {
  titleText;
  messageText;
  placeholderText;
  initialValue;
  isEditor;
  onResponse;
  submittedValue = null;
  unmount = null;
  responded = false;
  constructor(app, title, message, placeholder, initialValue, onResponse, isEditor = false) {
    super(app);
    this.titleText = title;
    this.messageText = message;
    this.placeholderText = placeholder;
    this.initialValue = initialValue;
    this.isEditor = isEditor;
    this.onResponse = onResponse;
  }
  onOpen() {
    this.contentEl.addClass("pi-permission-modal");
    const state = reactive({ value: this.initialValue });
    const submit = () => {
      this.submittedValue = state.value;
      this.close();
    };
    const cancel = () => {
      this.submittedValue = null;
      this.close();
    };
    const template = html`<h2>${this.titleText}</h2>
			${() => this.messageText ? html`<p>${this.messageText}</p>` : false}
			<textarea
				class="pi-permission-input"
				rows="${this.isEditor ? 4 : 1}"
				placeholder="${this.placeholderText}"
				aria-label="${this.titleText}"
				.value="${() => state.value}"
				@input="${(e) => {
      state.value = e.target.value;
    }}"
				@keydown="${(e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cancel();
      } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        submit();
      } else if (e.key === "Enter" && !this.isEditor) {
        e.preventDefault();
        submit();
      }
    }}"
			></textarea>
			<div class="pi-permission-buttons">
				<button
					class="pi-permission-confirm-btn"
					type="button"
					aria-label="${t("modals.submit")}"
					@click="${submit}"
					@keydown="${(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        submit();
      }
    }}"
				>
					${t("modals.submit")}
				</button>
				<button
					class="pi-permission-cancel-btn"
					type="button"
					aria-label="${t("modals.cancel")}"
					@click="${cancel}"
					@keydown="${(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        cancel();
      }
    }}"
				>
					${t("modals.cancel")}
				</button>
			</div>`;
    const result = template(this.contentEl);
    this.unmount = typeof result === "function" ? result : null;
    const input = this.contentEl.querySelector(
      ".pi-permission-input"
    );
    input?.focus();
  }
  onClose() {
    this.unmount?.();
    this.contentEl.empty();
    if (this.responded) return;
    this.responded = true;
    if (this.submittedValue !== null) {
      this.onResponse({ value: this.submittedValue });
    } else {
      this.onResponse({ cancelled: true });
    }
  }
};

// src/chat/arrow/session-list-popover.ts
var import_obsidian11 = require("obsidian");

// src/chat/session-scanner.ts
var import_obsidian10 = require("obsidian");
var _readFile;
var _readdir;
var _stat;
var _join;
var _basename;
var _homedir;
if (import_obsidian10.Platform.isDesktop) {
  const fsPromisesModule = require("node:fs/promises");
  const pathModule = require("node:path");
  const osModule = require("node:os");
  _readFile = (...args) => fsPromisesModule.readFile(...args);
  _readdir = (...args) => fsPromisesModule.readdir(...args);
  _stat = (...args) => fsPromisesModule.stat(...args);
  _join = (...args) => pathModule.join(...args);
  _basename = (...args) => pathModule.basename(...args);
  _homedir = () => osModule.homedir();
}
var SessionScanner = class {
  sessionsDir;
  constructor(sessionsDir) {
    this.sessionsDir = sessionsDir || (import_obsidian10.Platform.isDesktop ? _join(_homedir(), ".pi", "agent", "sessions") : "");
  }
  /**
   * Scan the sessions directory and return metadata for all sessions,
   * sorted by most recent first.
   */
  async scan() {
    const sessions = [];
    let cwdDirs;
    try {
      cwdDirs = await _readdir(this.sessionsDir);
    } catch {
      return [];
    }
    for (const cwdSlug of cwdDirs) {
      const cwdPath = _join(this.sessionsDir, cwdSlug);
      try {
        const cwdStat = await _stat(cwdPath);
        if (!cwdStat.isDirectory()) continue;
      } catch {
        continue;
      }
      let files;
      try {
        files = await _readdir(cwdPath);
      } catch {
        continue;
      }
      for (const file of files) {
        if (!file.endsWith(".jsonl")) continue;
        const filePath = _join(cwdPath, file);
        try {
          const session = await this.readSessionMetadata(filePath, cwdSlug);
          if (session) sessions.push(session);
        } catch (err) {
          console.warn(`[SessionScanner] Failed to read ${filePath}:`, err);
        }
      }
    }
    sessions.sort((a, b) => b.mtime - a.mtime);
    return sessions;
  }
  /**
   * Read metadata from a single .jsonl session file.
   */
  async readSessionMetadata(filePath, cwdSlug) {
    const fileStat = await _stat(filePath);
    if (fileStat.size === 0) return null;
    const content = await _readFile(filePath, "utf-8");
    const lines = content.split("\n").filter((l) => l.trim());
    if (lines.length === 0) return null;
    let name = _basename(filePath, ".jsonl");
    let preview = "";
    let cwd = this.unslugCwd(cwdSlug);
    let messageCount = 0;
    let sessionName = "";
    for (const line of lines) {
      try {
        const entry = JSON.parse(line);
        if (entry.type === "session") {
          if (entry.cwd) cwd = entry.cwd;
          if (entry.id) name = entry.id;
          continue;
        }
        if (entry.type === "session_name" && entry.name) {
          sessionName = entry.name;
          continue;
        }
        if (entry.type === "message" && entry.message) {
          const msg = entry.message;
          if (msg.role === "user" || msg.role === "assistant") {
            messageCount++;
          }
          if (!preview && msg.role === "user") {
            preview = this.extractText(msg.content);
            if (preview.length > 80) {
              preview = `${preview.slice(0, 80)}\u2026`;
            }
          }
        }
      } catch {
      }
    }
    if (sessionName) {
      name = sessionName;
    } else {
      const dateMatch = _basename(filePath).match(/^(\d{4}-\d{2}-\d{2})T(\d{2})-(\d{2})/);
      if (dateMatch) {
        name = `${dateMatch[1]} ${dateMatch[2]}:${dateMatch[3]}`;
      }
    }
    return {
      path: filePath,
      name,
      cwd,
      mtime: fileStat.mtimeMs,
      messageCount,
      preview: preview || "(empty session)"
    };
  }
  /**
   * Extract plain text from a message content field.
   * Content can be a string or an array of content blocks.
   */
  extractText(content) {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
      return content.filter((b) => b.type === "text" && b.text).map((b) => b.text).join(" ");
    }
    return "";
  }
  /**
   * Convert a cwd slug back to a readable path.
   * Pi slugs: --home-user-Projects-- → /home/user/Projects
   */
  unslugCwd(slug) {
    let inner = slug;
    if (inner.startsWith("--")) inner = inner.slice(2);
    if (inner.endsWith("--")) inner = inner.slice(0, -2);
    const path6 = `/${inner.replace(/-/g, "/")}`;
    return path6;
  }
};

// src/chat/arrow/session-list-popover.ts
function formatSessionDate(mtime) {
  if (mtime <= 0) return "";
  try {
    return new Date(mtime).toLocaleString(void 0, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return "";
  }
}
function SessionRow(props) {
  return html`<div
		class="${() => [
    "pi-session-popover-item",
    props.isCurrent ? "is-current" : "",
    props.isSelected ? "is-selected" : ""
  ].join(" ")}"
		@click="${() => {
    if (!props.isEditing && !props.isDeleting) {
      props.onSelect();
    }
  }}"
	>
		<div class="pi-session-popover-item-main">
			${() => props.isEditing ? html`<div class="pi-session-popover-rename-row">
							<input
								class="pi-session-popover-rename-input"
								type="text"
								.value="${() => props.editName}"
								placeholder="${t("sessionPopover.renamePlaceholder")}"
								@input="${(e) => props.onEditInput(e.target.value)}"
								@keydown="${(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      props.onCommitRename();
    } else if (e.key === "Escape") {
      e.preventDefault();
      props.onCancelRename();
    }
  }}"
							/>
							<button
								class="pi-session-popover-action-btn pi-session-popover-confirm-btn"
								type="button"
								aria-label="${t("sessionPopover.save")}"
								@click="${(e) => {
    e.stopPropagation();
    props.onCommitRename();
  }}"
							>
								✓
							</button>
							<button
								class="pi-session-popover-action-btn pi-session-popover-cancel-btn"
								type="button"
								aria-label="${t("sessionPopover.cancel")}"
								@click="${(e) => {
    e.stopPropagation();
    props.onCancelRename();
  }}"
							>
								×
							</button>
						  </div>` : html`<div class="pi-session-popover-name-row">
								<span class="pi-session-popover-name">${props.session.name}</span>
								${() => props.isCurrent ? html`<span class="pi-session-popover-current-badge">${t(
    "sessionPopover.current"
  )}</span>` : false}
							  </div>`}
			<div class="pi-session-popover-meta">
				${() => formatSessionDate(props.session.mtime)}
				${() => props.session.messageCount > 0 ? ` \xB7 ${t("sessionPanel.msgCount", { count: props.session.messageCount })}` : ""}
				${() => props.session.cwd ? ` \xB7 ${props.session.cwd}` : ""}
			</div>
			${() => props.isDeleting ? html`<div class="pi-session-popover-delete-confirm">
								<span class="pi-session-popover-delete-confirm-text">${t(
    "sessionPopover.deleteConfirm"
  )}</span>
								<button
									class="pi-session-popover-action-btn pi-session-popover-delete-confirm-btn"
									type="button"
									aria-label="${t("sessionPopover.confirmDelete")}"
									@click="${(e) => {
    e.stopPropagation();
    props.onConfirmDelete();
  }}"
								>
									✓
								</button>
								<button
									class="pi-session-popover-action-btn pi-session-popover-cancel-btn"
									type="button"
									aria-label="${t("sessionPopover.cancel")}"
									@click="${(e) => {
    e.stopPropagation();
    props.onCancelDelete();
  }}"
								>
									×
								</button>
							  </div>` : html`<div class="pi-session-popover-preview">${props.session.preview}</div>`}
		</div>
		${() => !props.isEditing && !props.isDeleting ? html`<div class="pi-session-popover-actions">
						${() => props.onExport ? html`<button
										class="pi-session-popover-action-btn pi-session-popover-export-btn"
										type="button"
										aria-label="${t("sessionPanel.export.tooltip")}"
										data-tooltip-position="top"
										@click="${(e) => {
    e.stopPropagation();
    props.onExport?.();
  }}"
									>
										⤓
									</button>` : false}
						<button
							class="pi-session-popover-action-btn pi-session-popover-rename-btn"
							type="button"
							aria-label="${t("sessionPanel.rename.tooltip")}"
							data-tooltip-position="top"
							@click="${(e) => {
    e.stopPropagation();
    props.onStartRename();
  }}"
						>
							✎
						</button>
						<button
							class="pi-session-popover-action-btn pi-session-popover-delete-btn"
							type="button"
							aria-label="${t("sessionPanel.delete.tooltip")}"
							data-tooltip-position="top"
							@click="${(e) => {
    e.stopPropagation();
    props.onStartDelete();
  }}"
						>
							🗑
						</button>
					  </div>` : false}
	</div>`;
}
var SessionListPopover = class {
  containerEl;
  anchorEl;
  callbacks;
  scanner;
  unmount = null;
  state;
  docClickHandler;
  docKeyHandler;
  constructor(parentEl, anchorEl, callbacks, sessionsDir) {
    this.anchorEl = anchorEl;
    this.callbacks = callbacks;
    this.scanner = new SessionScanner(sessionsDir);
    this.containerEl = parentEl.createDiv({ cls: "pi-session-popover is-hidden" });
    this.containerEl.setAttribute("role", "dialog");
    this.containerEl.setAttribute("aria-label", t("sessionPopover.title"));
    this.containerEl.tabIndex = -1;
    this.state = reactive({
      open: false,
      sessions: [],
      loading: false,
      error: null,
      currentPath: null,
      selectedIndex: -1,
      editingPath: null,
      editingName: "",
      deleteConfirmPath: null
    });
    this.docClickHandler = (e) => {
      const target = e.target;
      if (!this.containerEl.contains(target) && !this.anchorEl.contains(target)) {
        this.close();
      }
    };
    this.docKeyHandler = (e) => {
      if (!this.state.open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        if (this.state.editingPath) {
          this.cancelRename();
        } else if (this.state.deleteConfirmPath) {
          this.cancelDelete();
        } else {
          this.close();
        }
        return;
      }
      if (this.state.editingPath || this.state.deleteConfirmPath) {
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        this.moveSelection(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        this.moveSelection(-1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        void this.selectSelected();
      }
    };
    const { template } = this.buildTemplate();
    const result = template(this.containerEl);
    this.unmount = typeof result === "function" ? result : null;
    this.containerEl.addEventListener("keydown", this.docKeyHandler);
  }
  /**
   * Open the popover and refresh the session list.
   */
  async open() {
    if (this.state.open) {
      this.containerEl.focus();
      return;
    }
    this.state.open = true;
    this.containerEl.removeClass("is-hidden");
    this.anchorEl.addClass("is-active");
    await this.refreshSessions();
    this.state.selectedIndex = this.state.sessions.length > 0 ? 0 : -1;
    this.containerEl.focus();
    this.containerEl.ownerDocument.addEventListener("mousedown", this.docClickHandler);
  }
  /**
   * Close the popover without changing the session.
   */
  close() {
    if (!this.state.open) return;
    this.state.open = false;
    this.state.editingPath = null;
    this.state.deleteConfirmPath = null;
    this.containerEl.addClass("is-hidden");
    this.anchorEl.removeClass("is-active");
    this.containerEl.ownerDocument.removeEventListener("mousedown", this.docClickHandler);
    this.anchorEl.focus();
  }
  /**
   * Toggle open/closed.
   */
  toggle() {
    if (this.state.open) {
      this.close();
    } else {
      void this.open();
    }
  }
  /**
   * Set the path of the current session so it can be highlighted.
   */
  setCurrentPath(path6) {
    this.state.currentPath = path6;
  }
  /**
   * Re-scan the session directory and update the list.
   */
  async refreshSessions() {
    if (!import_obsidian11.Platform.isDesktop) {
      this.state.sessions = [];
      return;
    }
    this.state.loading = true;
    this.state.error = null;
    try {
      this.state.sessions = await this.scanner.scan();
    } catch (err) {
      console.error("[SessionPopover] Failed to scan sessions:", err);
      this.state.error = t("sessionPopover.failedLoad");
      this.state.sessions = [];
    } finally {
      this.state.loading = false;
    }
  }
  /**
   * Tear down the popover and remove it from the DOM.
   */
  destroy() {
    this.close();
    this.containerEl.removeEventListener("keydown", this.docKeyHandler);
    if (this.unmount) {
      this.unmount();
      this.unmount = null;
    }
    this.containerEl.remove();
  }
  buildTemplate() {
    const state = this.state;
    const container = this.containerEl;
    const template = html`<div class="pi-session-popover-header">
				<span class="pi-session-popover-title">${t("sessionPopover.title")}</span>
				${() => state.loading ? html`<span class="pi-session-popover-spinner" aria-label="Loading">⟳</span>` : false}
			</div>
			<div class="pi-session-popover-list" role="listbox" aria-label="${t("sessionPopover.title")}">
				${() => state.error ? html`<div class="pi-session-popover-empty">${state.error}</div>` : state.sessions.length === 0 && !state.loading ? html`<div class="pi-session-popover-empty">${t("sessionPopover.empty")}</div>` : state.sessions.map((session, index2) => {
      const isCurrent = session.path === state.currentPath;
      const isSelected = index2 === state.selectedIndex;
      const isEditing = state.editingPath === session.path;
      const isDeleting = state.deleteConfirmPath === session.path;
      return SessionRow({
        session,
        isCurrent,
        isSelected,
        isEditing,
        isDeleting,
        editName: isEditing ? state.editingName : session.name,
        onSelect: () => {
          state.selectedIndex = index2;
          void this.selectSession(session);
        },
        onStartRename: () => {
          state.editingPath = session.path;
          state.editingName = session.name;
          state.selectedIndex = index2;
          void nextTick().then(() => {
            const input = container.querySelector(
              ".pi-session-popover-rename-input"
            );
            input?.focus();
            input?.select();
          });
        },
        onCommitRename: () => {
          void this.commitRename(session);
        },
        onCancelRename: () => {
          this.cancelRename();
        },
        onStartDelete: () => {
          state.deleteConfirmPath = session.path;
          state.selectedIndex = index2;
        },
        onConfirmDelete: () => {
          void this.confirmDelete(session);
        },
        onCancelDelete: () => {
          this.cancelDelete();
        },
        onExport: this.callbacks.onExport ? () => {
          void this.callbacks.onExport?.(session);
        } : void 0,
        onEditInput: (value) => {
          state.editingName = value;
        }
      }).key(session.path);
    })}
			</div>`;
    return { template };
  }
  moveSelection(delta) {
    const length = this.state.sessions.length;
    if (length === 0) return;
    let next = this.state.selectedIndex + delta;
    if (next < 0) next = length - 1;
    if (next >= length) next = 0;
    this.state.selectedIndex = next;
    this.scrollSelectedIntoView();
  }
  scrollSelectedIntoView() {
    const item = this.containerEl.querySelector(
      ".pi-session-popover-item.is-selected"
    );
    item?.scrollIntoView({ block: "nearest" });
  }
  async selectSelected() {
    const session = this.state.sessions[this.state.selectedIndex];
    if (!session) return;
    await this.selectSession(session);
  }
  async selectSession(session) {
    try {
      await this.callbacks.onSelect(session);
      this.close();
    } catch (err) {
      console.error("[SessionPopover] Failed to switch session:", err);
      new import_obsidian11.Notice(t("notices.switchFailed"));
    }
  }
  async commitRename(session) {
    const newName = this.state.editingName.trim();
    if (!newName || newName === session.name) {
      this.cancelRename();
      return;
    }
    try {
      await this.callbacks.onRename(session, newName);
      this.state.editingPath = null;
      this.state.editingName = "";
      await this.refreshSessions();
    } catch (err) {
      console.error("[SessionPopover] Rename failed:", err);
      new import_obsidian11.Notice(t("notices.renameFailed"));
    }
  }
  cancelRename() {
    this.state.editingPath = null;
    this.state.editingName = "";
  }
  async confirmDelete(session) {
    try {
      await this.callbacks.onDelete(session);
      this.state.deleteConfirmPath = null;
      new import_obsidian11.Notice(t("notices.deletedSession", { name: session.name }));
      await this.refreshSessions();
      if (this.state.selectedIndex >= this.state.sessions.length) {
        this.state.selectedIndex = Math.max(0, this.state.sessions.length - 1);
      }
    } catch (err) {
      console.error("[SessionPopover] Delete failed:", err);
      new import_obsidian11.Notice(t("notices.deleteFailed"));
    }
  }
  cancelDelete() {
    this.state.deleteConfirmPath = null;
  }
};

// src/chat/arrow/statusbar.ts
function ChatStatusBar(state) {
  function renderText2() {
    const parts = [];
    if (state.thinkingLevel && state.thinkingLevel !== "off") {
      parts.push(`:${state.thinkingLevel}`);
    }
    if (state.streaming) {
      parts.push(t("statusBar.streaming"));
    }
    if (state.tokens > 0) {
      const tokenStr = state.tokens > 1e3 ? `${(state.tokens / 1e3).toFixed(1)}k tokens` : `${state.tokens} tokens`;
      parts.push(tokenStr);
    }
    if (state.cost > 0) {
      parts.push(`$${state.cost.toFixed(2)}`);
    }
    if (state.statusText) {
      parts.push(state.statusText);
    }
    return parts.join(" \xB7 ");
  }
  return html`<div class="pi-chat-statusbar" aria-live="polite">
		${() => renderText2()}
	</div>`;
}
function mountChatStatusBar(container, state) {
  const unmount2 = ChatStatusBar(state)(container);
  return typeof unmount2 === "function" ? unmount2 : () => container.empty();
}

// src/chat/message-types.ts
function generateMessageId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// src/chat/notices.ts
var import_obsidian12 = require("obsidian");
function showCriticalNotice(message) {
  new import_obsidian12.Notice(message, 0);
}

// src/chat/stream-handler.ts
var StreamHandler = class {
  currentMessage = null;
  currentText = "";
  currentThinking = "";
  callbacks;
  // Track tool calls the model is generating (from message_update toolcall events)
  pendingToolCalls = /* @__PURE__ */ new Map();
  constructor(callbacks) {
    this.callbacks = callbacks;
  }
  /**
   * Process a single RPC event from PiConnection.
   * Call this for every event received via PiConnection.onEvent().
   */
  handleEvent(event) {
    const type = event.type;
    switch (type) {
      case "message_start":
        this.handleMessageStart(event);
        break;
      case "message_update":
        this.handleMessageUpdate(event);
        break;
      case "message_end":
        this.handleMessageEnd(event);
        break;
      case "model_change": {
        const provider = event.provider ?? "";
        const modelId = event.modelId ?? "";
        if (provider && modelId && this.callbacks.onModelChange) {
          this.callbacks.onModelChange(`${provider}/${modelId}`);
        }
        break;
      }
      case "extension_ui_request": {
        const method = event.method;
        if (method === "notify" && this.callbacks.onNotice) {
          const message = event.message ?? "";
          if (message) {
            this.callbacks.onNotice({
              message,
              notifyType: event.notifyType ?? "info"
            });
          }
        }
        break;
      }
      case "tool_execution_start":
        this.handleToolExecutionStart(event);
        break;
      case "tool_execution_update":
        this.handleToolExecutionUpdate(event);
        break;
      case "tool_execution_end":
        this.handleToolExecutionEnd(event);
        break;
      case "agent_end":
        break;
      case "auto_compaction_end":
        if (this.callbacks.onCompaction) {
          this.callbacks.onCompaction();
        }
        break;
      case "error":
        if (this.callbacks.onError) {
          this.callbacks.onError(String(event.error || "Unknown error"));
        }
        break;
    }
  }
  /**
   * Get the current in-progress message, if any.
   */
  getCurrentMessage() {
    return this.currentMessage ? { ...this.currentMessage } : null;
  }
  /**
   * Check if we're currently streaming a message.
   */
  isStreaming() {
    return this.currentMessage !== null && (this.currentMessage.isStreaming ?? false);
  }
  /**
   * Reset streaming state. Call this when aborting or starting a new session.
   */
  reset() {
    this.currentMessage = null;
    this.currentText = "";
    this.currentThinking = "";
    this.pendingToolCalls.clear();
  }
  // --- Event handlers ---
  handleMessageStart(event) {
    const message = event.message;
    if (message && message.role !== "assistant") return;
    this.currentText = "";
    this.currentThinking = "";
    this.pendingToolCalls.clear();
    this.currentMessage = {
      id: generateMessageId(),
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      isStreaming: true
    };
    this.callbacks.onMessageUpdate(this.buildCurrentMessage());
  }
  handleMessageUpdate(event) {
    if (!this.currentMessage) return;
    const ame = event.assistantMessageEvent;
    if (!ame) {
      console.warn(
        "[StreamHandler] Invalid message_update event: missing assistantMessageEvent",
        event
      );
      return;
    }
    const deltaType = ame.type;
    if (!deltaType) {
      console.warn("[StreamHandler] Invalid assistantMessageEvent: missing type", ame);
      return;
    }
    switch (deltaType) {
      case "text_delta": {
        const delta = ame.delta;
        if (delta) {
          this.currentText += delta;
          this.callbacks.onMessageUpdate(this.buildCurrentMessage());
        }
        break;
      }
      case "thinking_delta": {
        const delta = ame.delta;
        if (delta) {
          this.currentThinking += delta;
          this.callbacks.onMessageUpdate(this.buildCurrentMessage());
        }
        break;
      }
      case "toolcall_start": {
        const contentIndex = typeof ame.contentIndex === "number" ? String(ame.contentIndex) : "";
        const partial = ame.partial;
        const toolName = partial?.name ?? "";
        this.pendingToolCalls.set(contentIndex, { name: toolName, arguments: "" });
        break;
      }
      case "toolcall_delta": {
        const contentIndex = typeof ame.contentIndex === "number" ? String(ame.contentIndex) : "";
        const delta = ame.delta;
        const pending = this.pendingToolCalls.get(contentIndex);
        if (pending && delta) {
          pending.arguments += delta;
        }
        break;
      }
      case "toolcall_end": {
        const contentIndex = typeof ame.contentIndex === "number" ? String(ame.contentIndex) : "";
        const toolCall = ame.toolCall;
        if (toolCall) {
          const name = toolCall.name ?? "";
          this.pendingToolCalls.set(contentIndex, {
            name,
            arguments: JSON.stringify(toolCall.arguments ?? {})
          });
        }
        break;
      }
      case "done": {
        break;
      }
      case "error": {
        const reason = ame.reason;
        if (this.currentMessage) {
          this.currentMessage.isError = true;
          if (reason === "aborted") {
            this.currentText += "\n\n*[Aborted]*";
          } else {
            this.currentText += "\n\n*[Error]*";
          }
          this.currentMessage.isStreaming = false;
          this.currentMessage.content = this.currentText;
          this.currentMessage.thinkingContent = this.currentThinking || void 0;
          this.callbacks.onMessageComplete(this.buildCurrentMessage());
          this.currentMessage = null;
        }
        break;
      }
      case "start":
      case "text_start":
      case "text_end":
      case "thinking_start":
      case "thinking_end":
        break;
      default:
        console.warn("[StreamHandler] Unknown assistantMessageEvent type:", deltaType, ame);
    }
  }
  handleMessageEnd(event) {
    if (!this.currentMessage) return;
    this.currentMessage.isStreaming = false;
    if (!this.currentText) {
      const message2 = event.message;
      if (message2) {
        this.currentText = this.extractTextFromMessage(message2);
      }
    }
    this.currentMessage.content = this.currentText;
    const message = event.message;
    if (message?.errorMessage) {
      const errMsg = typeof message.errorMessage === "string" ? message.errorMessage : JSON.stringify(message.errorMessage);
      this.currentMessage.error = errMsg;
      if (this.callbacks.onError) {
        this.callbacks.onError(errMsg);
      }
    }
    let thinking = this.currentThinking;
    if (!thinking) {
      const message2 = event.message;
      if (message2) {
        thinking = this.extractThinkingFromMessage(message2);
      }
    }
    this.currentMessage.thinkingContent = thinking || void 0;
    this.callbacks.onMessageComplete(this.buildCurrentMessage());
    this.currentMessage = null;
  }
  handleToolExecutionStart(event) {
    const toolCallId = event.toolCallId;
    const toolName = event.toolName;
    if (!toolCallId || !toolName) {
      console.warn(
        "[StreamHandler] Invalid tool_execution_start: missing toolCallId or toolName",
        event
      );
      return;
    }
    const args = event.args ?? {};
    if (this.callbacks.onToolExecutionStart) {
      this.callbacks.onToolExecutionStart(toolCallId, toolName, args);
    }
  }
  handleToolExecutionUpdate(event) {
    const toolCallId = event.toolCallId;
    const toolName = event.toolName;
    if (!toolCallId || !toolName) {
      console.warn(
        "[StreamHandler] Invalid tool_execution_update: missing toolCallId or toolName",
        event
      );
      return;
    }
    const partialResult = event.partialResult;
    const resultText = this.extractResultText(partialResult);
    if (this.callbacks.onToolExecutionUpdate) {
      this.callbacks.onToolExecutionUpdate(toolCallId, toolName, resultText);
    }
  }
  handleToolExecutionEnd(event) {
    const toolCallId = event.toolCallId;
    const toolName = event.toolName;
    if (!toolCallId || !toolName) {
      console.warn(
        "[StreamHandler] Invalid tool_execution_end: missing toolCallId or toolName",
        event
      );
      return;
    }
    const isError = event.isError ?? false;
    const result = event.result;
    const resultText = this.extractResultText(result);
    const toolMessage = {
      id: generateMessageId(),
      role: "tool",
      content: resultText,
      timestamp: Date.now(),
      toolName,
      toolCallId,
      isError: isError || void 0
    };
    this.callbacks.onToolResult(toolMessage);
  }
  // --- Helpers ---
  /**
   * Build a snapshot of the current message with accumulated text.
   * Returns a copy so the view can safely store it.
   */
  buildCurrentMessage() {
    const base = this.currentMessage ?? {
      id: "",
      role: "assistant",
      content: "",
      timestamp: Date.now()
    };
    return {
      ...base,
      content: this.currentText,
      thinkingContent: this.currentThinking || void 0
    };
  }
  /**
   * Extract thinking content from a complete AssistantMessage.
   * The message's content array may include {type: "thinking", thinking: "..."} blocks
   * that weren't delivered via streaming thinking_delta events.
   */
  extractThinkingFromMessage(message) {
    const content = message.content;
    if (!Array.isArray(content)) return "";
    return content.filter((block) => block.type === "thinking").map((block) => block.thinking).filter(Boolean).join("\n\n");
  }
  /**
   * Extract text content from a complete AssistantMessage.
   * The message's content array includes {type: "text", text: "..."} blocks.
   */
  extractTextFromMessage(message) {
    const content = message.content;
    if (!Array.isArray(content)) return "";
    return content.filter((block) => block.type === "text").map((block) => block.text).filter(Boolean).join("\n\n");
  }
  /**
   * Extract text from a result/partialResult object.
   * Result content is an array of {type: "text", text: "..."} blocks.
   */
  extractResultText(result) {
    if (!result) return "";
    const content = result.content;
    if (!Array.isArray(content)) return "";
    return content.filter((block) => block.type === "text").map((block) => block.text).join("");
  }
};

// src/chat/vault-mind-chat-view.ts
var VaultMindChatView = class extends import_obsidian13.Component {
  constructor(container, plugin) {
    super();
    this.container = container;
    this.plugin = plugin;
    this.state = createChatReactiveState();
    this.streamHandler = new StreamHandler({
      onMessageUpdate: (msg) => {
        const last = this.state.messages[this.state.messages.length - 1];
        if (last && last.id === msg.id) {
          updateLastMessage(this.state, msg.content);
          if (msg.thinkingContent) {
            last.thinkingContent = msg.thinkingContent;
          }
        } else {
          appendMessage(this.state, msg);
        }
      },
      onMessageComplete: (msg) => {
        this.state.streaming = false;
        this.state.placeholder = "Message Pi\u2026 (/ for commands, @ for files)";
        if (this.state.messages.length > 0) {
          const last = this.state.messages[this.state.messages.length - 1];
          if (last && last.id === msg.id) {
            last.tokens = msg.tokens;
            last.cost = msg.cost;
            last.model = msg.model;
          }
        }
      },
      onToolResult: (msg) => appendMessage(this.state, msg),
      onError: (err) => showCriticalNotice(t("notices.piError", { msg: err })),
      onModelChange: (model) => {
        this.state.currentModel = model;
        if (this.state.fallbackNotice && this.state.model === model) {
          this.state.fallbackNotice = null;
          this.updateFallbackBanner();
        }
      },
      onNotice: (notice) => {
        const message = notice.message;
        const isFallbackLike = message.toLowerCase().includes("fallback") || message.toLowerCase().includes("switched to") || message.toLowerCase().includes("rate limit") || message.toLowerCase().includes("auto-fallback");
        if (!isFallbackLike) return;
        this.state.fallbackNotice = message;
        this.updateFallbackBanner();
        window.setTimeout(() => {
          if (this.state.fallbackNotice === message) {
            this.state.fallbackNotice = null;
            this.updateFallbackBanner();
          }
        }, 5e3);
      }
    });
    this.setupUi();
  }
  state;
  streamHandler;
  feed;
  chatInput;
  sessionPopover = null;
  statusBarUnmount = null;
  fallbackBanner = null;
  setupUi() {
    this.container.empty();
    this.container.addClass("pi-chat-container");
    const header = this.container.createDiv({ cls: "pi-header-bar" });
    const left = header.createDiv({ cls: "pi-header-left" });
    left.createSpan({
      cls: "pi-header-session-name",
      text: t("view.newSession")
    });
    const right = header.createDiv({ cls: "pi-header-right" });
    const sessionsBtn = right.createEl("button", { cls: "pi-header-sessions-btn" });
    sessionsBtn.setText("\u{1F4CB}");
    this.sessionPopover = new SessionListPopover(
      right,
      sessionsBtn,
      {
        onSelect: (session) => this.switchToSession(session),
        onDelete: (session) => this.deleteSession(session),
        onRename: (session, newName) => this.renameSession(session, newName)
      },
      this.plugin.sessionsDir
    );
    const chatBody = this.container.createDiv({ cls: "pi-chat-body" });
    this.feed = MessageFeed(chatBody, this.state, this.plugin.app, {
      onRewind: (msg) => this.rewindToMessage(msg)
    });
    this.fallbackBanner = this.container.createDiv({ cls: "pi-fallback-banner is-hidden" });
    const inputContainer = this.container.createDiv({ cls: "pi-input-container" });
    this.chatInput = new ArrowChatInput(inputContainer, {
      state: this.state,
      connection: this.plugin.connection,
      app: this.plugin.app,
      onSend: (text, attachments) => {
        void this.sendMessage(text, attachments);
      },
      onVaultChat: () => {
        void this.handleVaultChat();
      },
      onAbort: () => {
        void this.plugin.connection.send({ type: "abort" });
        this.state.streaming = false;
        this.state.placeholder = "Message Pi\u2026 (/ for commands, @ for files)";
      }
    });
    const statusBarContainer = this.container.createDiv({ cls: "pi-chat-statusbar-container" });
    this.statusBarUnmount = mountChatStatusBar(statusBarContainer, this.state);
  }
  updateFallbackBanner() {
    if (!this.fallbackBanner) return;
    this.fallbackBanner.setText(this.state.fallbackNotice || "");
    this.fallbackBanner.classList.toggle("is-hidden", !this.state.fallbackNotice);
  }
  async sendMessage(text, attachments = []) {
    if (!this.plugin.connection.isConnected()) {
      new import_obsidian13.Notice(t("notices.notConnected"));
      return;
    }
    const isSteering = this.state.streaming;
    let displayText = text;
    const fileAttachments = attachments.filter((a) => a.type === "file");
    if (fileAttachments.length > 0) {
      displayText += `

\u{1F4CE} ${t("attachment.attached", { names: fileAttachments.map((a) => a.name).join(", ") })}`;
    }
    const imageAttachments = attachments.filter((a) => a.type === "image");
    if (imageAttachments.length > 0) {
      displayText += `

\u{1F5BC} ${t("attachment.imagesAttached", { count: imageAttachments.length })}`;
    }
    const userMsg = {
      id: generateMessageId(),
      role: "user",
      content: displayText,
      timestamp: Date.now(),
      isSteering: isSteering || void 0
    };
    appendMessage(this.state, userMsg);
    if (!isSteering) {
      this.state.streaming = true;
      this.state.placeholder = "Send a message to steer Pi\u2026";
    }
    let rpcMessage = text;
    for (const att of fileAttachments) {
      rpcMessage += `

<file path="${att.name}">
${att.content}
</file>`;
    }
    const command = {
      type: isSteering ? "steer" : "prompt",
      message: rpcMessage
    };
    if (imageAttachments.length > 0) {
      command.images = imageAttachments.map((img) => ({
        type: "image",
        data: img.content,
        mimeType: img.mimeType || "image/png"
      }));
    }
    try {
      await this.plugin.connection.send(command);
    } catch (err) {
      showCriticalNotice(t("notices.sendFailed"));
      this.state.streaming = false;
      this.state.placeholder = "Message Pi\u2026 (/ for commands, @ for files)";
    }
  }
  async handleVaultChat() {
    const text = this.state.text.trim();
    if (!text || this.state.streaming) return;
    try {
      this.state.statusText = "Searching vault\u2026";
      const token = await resolveToken(this.plugin.app);
      const client = new VaultMindClient({
        host: this.plugin.settings.host,
        port: this.plugin.settings.port,
        token
      });
      const result = await client.search(text, "main", 5);
      for (const hit of result.hits) {
        const record = hit;
        const name = String(record.title ?? record.source ?? record.path ?? "Vault result");
        const content = String(record.content ?? record.text ?? record.snippet ?? "");
        addMentionable(this.state, { type: "file", name: `\u{1F50D} ${name}`, content });
      }
      this.state.statusText = "";
      await this.sendMessage(text, [...this.state.mentionables]);
      resetComposer(this.state);
      this.state.text = "";
    } catch (err) {
      this.state.statusText = "";
      new import_obsidian13.Notice(`Vault search failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  async __handleRpcEvent(event) {
    if (event.type === "extension_ui_request") {
      const req = event;
      const dialogMethods = {
        select: true,
        confirm: true,
        input: true,
        editor: true
      };
      if (dialogMethods[req.method]) {
        this.handleExtensionUiRequest(req);
        return;
      }
    }
    this.streamHandler.handleEvent(event);
    if (event.type === "agent_end") {
    }
  }
  handleExtensionUiRequest(event) {
    switch (event.method) {
      case "select": {
        const options = Array.isArray(event.options) ? event.options : [];
        new PermissionSelectModal(this.plugin.app, event.title || "Choose", options, (res) => {
          this.sendUiResponse(event.id, res.cancelled ? { cancelled: true } : { value: res.value });
        }).open();
        break;
      }
      case "confirm": {
        new PermissionConfirmModal(
          this.plugin.app,
          event.title || "Confirm",
          event.message || "",
          (res) => {
            this.sendUiResponse(event.id, { confirmed: res.confirmed });
          }
        ).open();
        break;
      }
      case "input":
      case "editor": {
        new PermissionInputModal(
          this.plugin.app,
          event.title || "Input",
          event.message || "",
          event.placeholder || "",
          event.initialValue || "",
          (res) => {
            this.sendUiResponse(
              event.id,
              res.cancelled ? { cancelled: true } : { value: res.value }
            );
          },
          event.method === "editor"
        ).open();
        break;
      }
    }
  }
  sendUiResponse(id, payload) {
    void this.plugin.connection.sendRaw({ type: "extension_ui_response", id, ...payload });
  }
  async rewindToMessage(msg) {
    try {
      await this.plugin.connection.send({ type: "fork", entryId: msg.piEntryId });
      this.state.text = msg.content;
    } catch (err) {
      new import_obsidian13.Notice("Rewind failed");
    }
  }
  async switchToSession(session) {
    await this.plugin.connection.send({ type: "switch_session", sessionPath: session.path });
    clearMessages(this.state);
    this.sessionPopover?.setCurrentPath(session.path);
  }
  async deleteSession(_session) {
    await (0, import_promises.unlink)(_session.path);
  }
  async renameSession(session, newName) {
    await this.plugin.connection.send({ type: "set_session_name", name: newName });
  }
  destroy() {
    this.feed.unmount();
    this.chatInput.destroy();
    this.statusBarUnmount?.();
    this.sessionPopover?.destroy();
    this.plugin.connection.destroy();
    super.unload();
  }
};

// src/tabs/chat-tab.ts
var ChatTab = class {
  view = null;
  connection = null;
  messageStore;
  deps;
  constructor(deps) {
    this.deps = deps;
    this.messageStore = deps.messageStore ?? new MessageStore();
  }
  async mount(container) {
    const { deps } = this;
    const piBinary = detectPiBinary(deps.settings.piBinaryPath, deps.vaultPath) ?? deps.settings.piBinaryPath;
    const token = await resolveToken(deps.app);
    const path6 = await import("node:path");
    const sessionsDir = path6.join(deps.piConfigDir, "sessions");
    this.connection = new PiConnection({
      piBinaryPath: piBinary,
      cwd: deps.vaultPath,
      piConfigDir: deps.piConfigDir,
      sessionsDir,
      buildEnv: () => buildExecEnv(),
      apiKeys: {
        PVM_API_TOKEN: token
      }
    });
    const pluginRef = {
      app: deps.app,
      connection: this.connection,
      ensureConnection: () => {
        if (!this.connection) {
          this.connection = new PiConnection({
            piBinaryPath: piBinary,
            cwd: deps.vaultPath,
            piConfigDir: deps.piConfigDir,
            sessionsDir,
            buildEnv: () => buildExecEnv(),
            apiKeys: {
              PVM_API_TOKEN: token
            }
          });
        }
        if (!this.connection.isConnected()) {
          this.connection.connect();
        }
        return this.connection;
      },
      messageStore: this.messageStore,
      scheduleStoreFlush: () => {
        void deps.onStoreFlush?.();
      },
      statusBar: null,
      piConfigDir: deps.piConfigDir,
      sessionsDir,
      settings: { host: deps.host, port: deps.port }
    };
    this.view = new VaultMindChatView(container, pluginRef);
    this.view.load();
    this.connection?.onEvent((e) => void this.view.__handleRpcEvent(e));
    if (this.connection && !this.connection.isConnected()) {
      this.connection.connect();
    }
    if (deps.initialCommand && this.connection) {
      const cmd = deps.initialCommand;
      const conn = this.connection;
      const view = this.view;
      const waitAndSend = async () => {
        try {
          await conn.send({ type: "get_state" });
          window.setTimeout(() => {
            if (view) void view.sendMessage(cmd, []);
          }, 3e3);
        } catch {
          window.setTimeout(() => void waitAndSend(), 2e3);
        }
      };
      window.setTimeout(() => void waitAndSend(), 3e3);
    }
  }
  destroy() {
    this.view?.destroy();
    this.connection = null;
    this.view = null;
  }
};

// src/tabs/collection-tab.ts
var import_obsidian14 = require("obsidian");
var CollectionTab = class {
  deps;
  client = null;
  root = null;
  listEl = null;
  collections = [];
  expandedName = null;
  constructor(deps) {
    this.deps = deps;
  }
  async mount(container) {
    const token = await resolveToken(this.deps.app);
    const port = readServerPort(this.deps.vaultPath) ?? this.deps.settings.port;
    this.client = new VaultMindClient({
      host: this.deps.settings.host,
      port,
      token: token ?? ""
    });
    this.root = container.createEl("div", { cls: "vault-mind-container" });
    this.renderShell();
    await this.refresh();
  }
  destroy() {
    this.client = null;
    this.root = null;
    this.listEl = null;
    this.collections = [];
    this.expandedName = null;
  }
  renderShell() {
    if (!this.root) return;
    this.root.empty();
    const header = this.root.createEl("div", { cls: "vault-mind-status-bar" });
    header.createEl("span", { cls: "vault-mind-status-dot" });
    header.createEl("span", { text: "Collections" });
    const refreshBtn = header.createEl("button", { title: "Refresh" });
    (0, import_obsidian14.setIcon)(refreshBtn, "refresh-cw");
    refreshBtn.addEventListener("click", () => {
      void this.refresh();
    });
    this.listEl = this.root.createEl("div", { cls: "vault-mind-collection-list" });
  }
  async refresh() {
    if (!this.client || !this.listEl) return;
    this.listEl.empty();
    this.listEl.createEl("p", {
      cls: "vault-mind-collection-loading",
      text: "Loading\u2026"
    });
    try {
      const result = await this.client.vmStats();
      this.collections = result.collections;
      this.renderList();
    } catch (err) {
      if (!this.listEl) return;
      this.listEl.empty();
      this.listEl.createEl("p", {
        cls: "vault-mind-error",
        text: `Failed to load collections: ${String(err)}`
      });
    }
  }
  renderList() {
    if (!this.listEl) return;
    this.listEl.empty();
    if (this.collections.length === 0) {
      this.listEl.createEl("p", {
        cls: "vault-mind-empty",
        text: "No collections configured."
      });
      return;
    }
    for (const col of this.collections) {
      this.renderCollectionRow(col);
    }
  }
  renderCollectionRow(col) {
    if (!this.listEl) return;
    const isExpanded = this.expandedName === col.name;
    const card = this.listEl.createEl("div", { cls: "vault-mind-collection-card" });
    if (isExpanded) card.addClass("is-expanded");
    const rowEl = card.createEl("div", { cls: "vault-mind-collection-row" });
    const chevron = rowEl.createEl("span", { cls: "vault-mind-collection-chevron" });
    (0, import_obsidian14.setIcon)(chevron, isExpanded ? "chevron-down" : "chevron-right");
    rowEl.createEl("span", { cls: "vault-mind-collection-name", text: col.name });
    const badge = rowEl.createEl("span", { cls: "vault-mind-count-chip" });
    badge.setText(String(col.count));
    badge.title = `${col.count} entries`;
    if (col.malformed > 0) {
      const warn = rowEl.createEl("span", { cls: "vault-mind-count-chip vault-mind-chip-warn" });
      warn.setText(`${col.malformed} malformed`);
    }
    const detail = card.createEl("div", { cls: "vault-mind-collection-detail" });
    detail.style.display = isExpanded ? "" : "none";
    if (isExpanded) this.populateDetail(detail, col);
    rowEl.addEventListener("click", () => {
      const nowExpanded = this.expandedName === col.name;
      this.expandedName = nowExpanded ? null : col.name;
      this.renderList();
    });
  }
  populateDetail(el, col) {
    const dl = el.createEl("dl", { cls: "vault-mind-collection-dl" });
    const addRow = (label, value) => {
      dl.createEl("dt", { text: label });
      dl.createEl("dd", { text: value });
    };
    addRow("Path", col.path);
    addRow("Entries", String(col.count));
    addRow("Size", col.size > 0 ? `${col.size.toLocaleString()} bytes` : "empty");
    if (col.malformed > 0) addRow("Malformed", String(col.malformed));
    addRow("Schema", col.schema.length > 0 ? col.schema.join(", ") : "(none)");
  }
};

// src/tabs/queue-tab.ts
var import_obsidian15 = require("obsidian");
var QueueTab = class {
  deps;
  client = null;
  root = null;
  chips = null;
  list = null;
  jobs = [];
  unsubState = null;
  unsubEvents = null;
  connectionState = { connected: false };
  explicitError = null;
  pendingContainer = null;
  pendingEntries = [];
  constructor(deps) {
    this.deps = deps;
  }
  async mount(container) {
    this.root = container.createEl("div", { cls: "vault-mind-container" });
    this.render();
    await this.connect();
  }
  destroy() {
    this.disconnect();
  }
  render() {
    if (!this.root) return;
    this.root.empty();
    const header = this.root.createEl("div", { cls: "vault-mind-status-bar" });
    header.createEl("span", { cls: "vault-mind-status-dot" });
    header.createEl("span", { text: "Queue" });
    const refresh = header.createEl("button", { title: "Refresh" });
    (0, import_obsidian15.setIcon)(refresh, "refresh-cw");
    refresh.addEventListener("click", () => this.refresh());
    this.chips = this.root.createEl("div", { cls: "vault-mind-count-chips" });
    this.list = this.root.createEl("ul", { cls: "vault-mind-queue-list" });
    this.pendingContainer = this.root.createEl("div");
  }
  async connect() {
    this.disconnect();
    const token = await resolveToken(this.deps.app);
    if (!token) {
      this.setError("No token configured.");
      return;
    }
    this.client = new VaultMindClient({
      host: this.deps.settings.host,
      port: readServerPort(this.deps.vaultPath) ?? this.deps.settings.port,
      token
    });
    this.unsubState = this.client.subscribeState((state) => this.updateState(state));
    this.unsubEvents = this.client.subscribeEvents((event) => this.handleEvent(event));
    this.client.connect();
    await this.refresh();
  }
  disconnect() {
    if (this.unsubState) {
      this.unsubState();
      this.unsubState = null;
    }
    if (this.unsubEvents) {
      this.unsubEvents();
      this.unsubEvents = null;
    }
    if (this.client) {
      this.client.disconnect();
      this.client = null;
    }
  }
  updateState(state) {
    this.connectionState = state;
    if (state.connected || state.reconnecting) {
      this.explicitError = null;
    }
    const dot = this.root?.querySelector(".vault-mind-status-dot");
    if (dot) {
      dot.classList.remove("connected", "error", "reconnecting");
      if (state.connected) dot.classList.add("connected");
      else if (state.reconnecting) dot.classList.add("reconnecting");
      else if (state.error) dot.classList.add("error");
    }
    this.updateRootStateClasses();
    this.renderList();
  }
  updateRootStateClasses() {
    if (!this.root) return;
    this.root.classList.remove(
      "vault-mind-queue-empty",
      "vault-mind-queue-error",
      "vault-mind-queue-reconnecting"
    );
    if (this.connectionState.reconnecting) {
      this.root.classList.add("vault-mind-queue-reconnecting");
    } else if (this.connectionState.error && !this.connectionState.connected) {
      this.root.classList.add("vault-mind-queue-error");
    } else if (this.connectionState.connected && this.jobs.length === 0) {
      this.root.classList.add("vault-mind-queue-empty");
    }
  }
  handleEvent(event) {
    switch (event.type) {
      case "queue/snapshot":
        this.jobs = event.jobs;
        break;
      case "job-created":
        this.jobs.unshift(event.job);
        break;
      case "job-updated": {
        const idx = this.jobs.findIndex((j) => j.id === event.job.id);
        if (idx >= 0) this.jobs[idx] = event.job;
        break;
      }
      case "job-completed": {
        const idx = this.jobs.findIndex((j) => j.id === event.job.id);
        if (idx >= 0) this.jobs[idx] = event.job;
        break;
      }
      case "job-notification":
        new import_obsidian15.Notice(`Vault Mind job ${event.jobId}: ${event.status} \u2014 ${event.message}`);
        break;
      case "vault-edit-proposed":
        break;
      case "context-request":
        break;
    }
    this.renderList();
  }
  async refresh() {
    if (!this.client) return;
    try {
      this.jobs = await this.client.listQueue();
      this.renderList();
    } catch (err) {
      this.setError(`Refresh failed: ${err.message}`);
      return;
    }
    try {
      this.pendingEntries = await this.client.listPending();
    } catch {
      this.pendingEntries = [];
    }
    this.renderPending();
  }
  renderList() {
    if (!this.list) return;
    this.list.empty();
    this.renderChips();
    this.updateRootStateClasses();
    if (this.explicitError || this.connectionState.error && !this.connectionState.connected && !this.connectionState.reconnecting) {
      const message = this.explicitError ?? "Connection lost. Retrying...";
      const li = this.list.createEl("li", {
        cls: "vault-mind-empty vault-mind-queue-error-state"
      });
      li.createEl("span", { text: message });
      if (!this.explicitError) {
        const retryBtn = li.createEl("button", {
          title: "Retry now",
          attr: { "aria-label": "Retry connection" }
        });
        (0, import_obsidian15.setIcon)(retryBtn, "refresh-cw");
        retryBtn.addEventListener("click", () => this.connect());
      }
      return;
    }
    if (this.connectionState.reconnecting) {
      const li = this.list.createEl("li", {
        cls: "vault-mind-empty vault-mind-queue-reconnecting-state"
      });
      const spinner = li.createEl("span", { cls: "vault-mind-spinner" });
      (0, import_obsidian15.setIcon)(spinner, "loader");
      li.createEl("span", { text: "Reconnecting..." });
      return;
    }
    if (!this.connectionState.connected) {
      this.list.createEl("li", { cls: "vault-mind-empty", text: "Connecting..." });
      return;
    }
    if (this.jobs.length === 0) {
      this.list.createEl("li", {
        cls: "vault-mind-empty",
        text: "No jobs queued. Add @agent markers to your notes to create jobs."
      });
      return;
    }
    for (const job of this.jobs) {
      const li = this.list.createEl("li", { cls: `vault-mind-job-row status-${job.status}` });
      li.setAttribute("tabindex", "0");
      li.setAttribute("role", "button");
      li.setAttribute("aria-label", `${job.role} job, ${job.status}: ${job.filePath}`);
      const header = li.createEl("div", { cls: "vault-mind-job-header" });
      header.createEl("span", { cls: "vault-mind-job-role", text: job.role });
      header.createEl("span", { cls: "vault-mind-job-status", text: job.status });
      header.createEl("span", { cls: "vault-mind-job-attempts", text: `${job.attempts}x` });
      li.createEl("div", { cls: "vault-mind-job-path", text: job.filePath });
      li.createEl("div", {
        cls: "vault-mind-job-instruction",
        text: this.truncate(job.instruction, 80)
      });
      const detail = li.createEl("div", { cls: "vault-mind-job-detail" });
      detail.createEl("div", { cls: "vault-mind-job-detail-section", text: job.instruction });
      if (job.lastError) {
        detail.createEl("div", { cls: "vault-mind-job-error", text: job.lastError });
      }
      detail.createEl("div", {
        cls: "vault-mind-job-meta-line",
        text: `File: ${job.filePath}`
      });
      detail.createEl("div", {
        cls: "vault-mind-job-meta-line",
        text: `Created: ${job.createdAt}`
      });
      if (job.dispatchedAt) {
        detail.createEl("div", {
          cls: "vault-mind-job-meta-line",
          text: `Dispatched: ${job.dispatchedAt}`
        });
      }
      if (job.completedAt) {
        detail.createEl("div", {
          cls: "vault-mind-job-meta-line",
          text: `Completed: ${job.completedAt}`
        });
      }
      li.addEventListener("click", () => {
        li.classList.toggle("vault-mind-job-expanded");
      });
      li.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          li.classList.toggle("vault-mind-job-expanded");
        }
      });
      li.addEventListener("contextmenu", (evt) => {
        evt.preventDefault();
        this.showContextMenu(evt, job);
      });
    }
  }
  renderChips() {
    if (!this.chips) return;
    this.chips.empty();
    const counts = this.countByStatus();
    const statuses = ["pending", "running", "done", "failed", "cancelled"];
    for (const status of statuses) {
      const chip = this.chips.createEl("span", {
        cls: `vault-mind-count-chip status-${status}`
      });
      chip.createEl("span", { cls: "vault-mind-count-chip-label", text: status });
      chip.createEl("span", {
        cls: "vault-mind-count-chip-value",
        text: String(counts[status] ?? 0)
      });
    }
  }
  countByStatus() {
    const counts = {
      pending: 0,
      running: 0,
      done: 0,
      failed: 0,
      cancelled: 0
    };
    for (const job of this.jobs) {
      counts[job.status] = (counts[job.status] ?? 0) + 1;
    }
    return counts;
  }
  truncate(text, max) {
    if (text.length <= max) return text;
    return `${text.slice(0, max).trim()}\u2026`;
  }
  renderPending() {
    if (!this.pendingContainer) return;
    this.pendingContainer.empty();
    if (this.pendingEntries.length === 0) return;
    const section = this.pendingContainer.createEl("details", {
      cls: "vault-mind-pending-section"
    });
    section.setAttribute("open", "");
    section.createEl("summary", {
      cls: "vault-mind-pending-summary",
      text: `Pending Review (${this.pendingEntries.length})`
    });
    for (const item of this.pendingEntries) {
      const row = section.createEl("div", { cls: "vault-mind-pending-item" });
      row.createEl("span", { cls: "vault-mind-pending-collection", text: item.collection });
      const preview = String(item.entry.fact ?? item.entry.source ?? "");
      row.createEl("span", {
        cls: "vault-mind-pending-entry-text",
        text: this.truncate(preview, 80)
      });
      const actions = row.createEl("div", { cls: "vault-mind-pending-actions" });
      const approveBtn = actions.createEl("button", {
        text: "Approve",
        cls: "vault-mind-pending-approve"
      });
      approveBtn.addEventListener("click", async () => {
        try {
          await this.client?.approveEntry(item.id, item.collection, "approve");
          await this.refresh();
        } catch (err) {
          new import_obsidian15.Notice(`Vault Mind: ${err.message}`);
        }
      });
      const rejectBtn = actions.createEl("button", {
        text: "Reject",
        cls: "vault-mind-pending-reject"
      });
      rejectBtn.addEventListener("click", async () => {
        try {
          await this.client?.approveEntry(item.id, item.collection, "reject");
          await this.refresh();
        } catch (err) {
          new import_obsidian15.Notice(`Vault Mind: ${err.message}`);
        }
      });
    }
  }
  showContextMenu(evt, job) {
    const menu = new import_obsidian15.Menu();
    menu.addItem(
      (item) => item.setTitle("Retry").setIcon("rotate-cw").onClick(async () => {
        try {
          await this.client?.retryJob(job.id);
        } catch (err) {
          new import_obsidian15.Notice(`Vault Mind: ${err.message}`);
        }
      })
    );
    menu.addItem(
      (item) => item.setTitle("Cancel").setIcon("x").onClick(async () => {
        try {
          await this.client?.cancelJob(job.id);
        } catch (err) {
          new import_obsidian15.Notice(`Vault Mind: ${err.message}`);
        }
      })
    );
    menu.showAtMouseEvent(evt);
  }
  setError(message) {
    this.explicitError = message;
    this.connectionState = { connected: false, error: message };
    this.chips?.empty();
    if (!this.list) return;
    this.list.empty();
    this.renderList();
    new import_obsidian15.Notice(`Vault Mind: ${message}`);
  }
};

// src/tabs/search-tab.ts
var SearchTab = class {
  deps;
  client = null;
  root = null;
  modeBar = null;
  inputEl = null;
  collectionEl = null;
  resultsEl = null;
  mode = "vector";
  debounceTimer = null;
  constructor(deps) {
    this.deps = deps;
  }
  async mount(container) {
    const token = await resolveToken(this.deps.app);
    const port = readServerPort(this.deps.vaultPath) ?? this.deps.settings.port;
    this.client = new VaultMindClient({
      host: this.deps.settings.host,
      port,
      token: token ?? ""
    });
    this.root = container.createEl("div", { cls: "vault-mind-search-container" });
    this.render();
  }
  destroy() {
    if (this.debounceTimer !== null) {
      activeWindow.clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    this.client = null;
    this.root = null;
    this.modeBar = null;
    this.inputEl = null;
    this.collectionEl = null;
    this.resultsEl = null;
  }
  render() {
    if (!this.root) return;
    this.root.empty();
    this.modeBar = this.root.createEl("div", { cls: "vault-mind-search-mode-bar" });
    const modeLabels = { vector: "Vector", fts: "FTS", graph: "Graph" };
    for (const mode of ["vector", "fts", "graph"]) {
      const btn = this.modeBar.createEl("button", {
        cls: `vault-mind-search-mode-btn${mode === this.mode ? " is-active" : ""}`,
        text: modeLabels[mode],
        attr: { "aria-label": `Switch to ${modeLabels[mode]} search mode` }
      });
      btn.addEventListener("click", () => {
        this.mode = mode;
        this.updateModeBar();
        void this.runSearch();
      });
    }
    const inputRow = this.root.createEl("div", { cls: "vault-mind-search-input-row" });
    this.collectionEl = inputRow.createEl("select", {
      cls: "vault-mind-search-collection",
      attr: { "aria-label": "Collection" }
    });
    this.collectionEl.createEl("option", { value: "main", text: "main" });
    this.inputEl = inputRow.createEl("input", {
      cls: "vault-mind-search-input",
      type: "text",
      placeholder: "Search\u2026",
      attr: { "aria-label": "Search query" }
    });
    this.inputEl.addEventListener("input", () => {
      if (this.debounceTimer !== null) {
        activeWindow.clearTimeout(this.debounceTimer);
      }
      this.debounceTimer = activeWindow.setTimeout(() => {
        this.debounceTimer = null;
        void this.runSearch();
      }, 300);
    });
    this.resultsEl = this.root.createEl("div", { cls: "vault-mind-search-results" });
    this.showEmpty();
  }
  updateModeBar() {
    if (!this.modeBar) return;
    const modes = ["vector", "fts", "graph"];
    const btns = this.modeBar.querySelectorAll(".vault-mind-search-mode-btn");
    btns.forEach((btn, i) => {
      btn.classList.toggle("is-active", modes[i] === this.mode);
    });
  }
  showEmpty(message = "No results") {
    if (!this.resultsEl) return;
    this.resultsEl.empty();
    this.resultsEl.createEl("div", { cls: "vault-mind-search-empty", text: message });
  }
  showLoading() {
    if (!this.resultsEl) return;
    this.resultsEl.empty();
    this.resultsEl.createEl("div", { cls: "vault-mind-search-loading", text: "Searching\u2026" });
  }
  renderHits(hits) {
    if (!this.resultsEl) return;
    this.resultsEl.empty();
    if (hits.length === 0) {
      this.showEmpty();
      return;
    }
    for (const hit of hits) {
      const item = this.resultsEl.createEl("div", { cls: "vault-mind-search-result-item" });
      const source = hit.source ?? hit._source;
      const domain = hit.domain ?? hit._domain;
      const fact = hit.fact ?? hit._fact ?? hit.entity ?? hit._entity;
      const tags = hit.tags ?? hit._tags;
      if (source) {
        item.createEl("div", {
          cls: "vault-mind-search-result-source",
          text: String(source)
        });
      }
      if (domain) {
        item.createEl("div", {
          cls: "vault-mind-search-result-domain",
          text: String(domain)
        });
      }
      if (fact) {
        item.createEl("div", {
          cls: "vault-mind-search-result-fact",
          text: String(fact)
        });
      }
      if (Array.isArray(tags) && tags.length > 0) {
        const chipsRow = item.createEl("div", { cls: "vault-mind-search-tag-chips" });
        for (const tag of tags) {
          chipsRow.createEl("span", {
            cls: "vault-mind-search-tag-chip",
            text: String(tag)
          });
        }
      }
    }
  }
  async runSearch() {
    if (!this.client || !this.inputEl) return;
    const query = this.inputEl.value.trim();
    if (!query) {
      this.showEmpty();
      return;
    }
    const collection = this.collectionEl?.value ?? "main";
    this.showLoading();
    try {
      let result;
      if (this.mode === "vector") {
        result = await this.client.search(query, collection, 20);
      } else if (this.mode === "fts") {
        result = await this.client.ftsSearch(
          query,
          collection,
          20
        );
      } else {
        result = await this.client.graphQuery(query, 2);
      }
      this.renderHits(result.hits);
    } catch (err) {
      this.showEmpty(`Error: ${String(err)}`);
    }
  }
};

// src/tabs/status-tab.ts
var import_node_child_process2 = require("node:child_process");
var import_obsidian16 = require("obsidian");
function shellQuote(value) {
  return `'${value.replace(/'/g, "'\\''")}'`;
}
function winQuote(value) {
  return `"${value.replace(/"/g, '""')}"`;
}
var StatusTab = class {
  deps;
  client = null;
  root = null;
  statusBar = null;
  tokenSourceEl = null;
  providerEl = null;
  modelEl = null;
  watcherStatusEl = null;
  watcherBtn = null;
  resultsBox = null;
  unsubState = null;
  unsubEvents = null;
  discoveredConfig = null;
  embeddingConfigEl = null;
  syncStatusEl = null;
  component = null;
  constructor(deps) {
    this.deps = deps;
  }
  async mount(container) {
    this.component = new import_obsidian16.Component();
    this.component.load();
    this.root = container.createEl("div", { cls: "vault-mind-container" });
    this.render();
    await this.connect();
  }
  destroy() {
    this.disconnect();
    this.component?.unload();
    this.component = null;
  }
  render() {
    if (!this.root) return;
    this.root.empty();
    this.statusBar = this.root.createEl("div", { cls: "vault-mind-status-bar" });
    this.statusBar.createEl("span", { cls: "vault-mind-status-dot" });
    this.statusBar.createEl("span", { text: "Vault Mind" });
    this.statusBar.createEl("span", { cls: "vault-mind-version", text: "" });
    const tokenBar = this.root.createEl("div", { cls: "vault-mind-status-bar" });
    this.tokenSourceEl = tokenBar.createEl("span", { text: "Token: checking..." });
    void this.refreshTokenSource();
    const detailsBar = this.root.createEl("div", { cls: "vault-mind-status-bar" });
    this.providerEl = detailsBar.createEl("span", {
      cls: "vault-mind-provider",
      text: "Provider: \u2014"
    });
    this.modelEl = detailsBar.createEl("span", { cls: "vault-mind-model", text: "Model: \u2014" });
    this.watcherStatusEl = detailsBar.createEl("span", { text: "Watcher: \u2014" });
    this.watcherBtn = detailsBar.createEl("button", {
      text: "Start watcher",
      attr: { "aria-label": "Start file watcher" }
    });
    this.watcherBtn.addEventListener("click", () => this.toggleWatcher());
    const configSection = this.root.createEl("div", { cls: "vault-mind-config-section" });
    configSection.createEl("div", { cls: "vault-mind-config-heading", text: "Embedding config" });
    this.embeddingConfigEl = configSection.createEl("div", { cls: "vault-mind-config-details" });
    const cloudSection = this.root.createEl("div", { cls: "vault-mind-config-section" });
    cloudSection.createEl("div", { cls: "vault-mind-config-heading", text: "Cloud / Sync" });
    this.syncStatusEl = cloudSection.createEl("div", { cls: "vault-mind-config-details" });
    const reindexBtn = cloudSection.createEl("button", {
      text: "Remote reindex",
      attr: { "aria-label": "Rebuild the remote index" }
    });
    reindexBtn.addEventListener("click", () => this.triggerRemoteReindex());
    const launchBtn = this.root.createEl("button", {
      text: import_obsidian16.Platform.isMacOS ? "Open in Terminal" : "Open in Console",
      attr: { "aria-label": "Open pi TUI in external terminal" }
    });
    launchBtn.addEventListener("click", () => this.launchPiTui());
    const searchBox = this.root.createEl("div", { cls: "vault-mind-search-box" });
    const input = searchBox.createEl("input", {
      type: "text",
      placeholder: "Search vault...",
      attr: { "aria-label": "Search vault" }
    });
    const searchBtn = searchBox.createEl("button", {
      title: "Search",
      attr: { "aria-label": "Search vault" }
    });
    (0, import_obsidian16.setIcon)(searchBtn, "search");
    searchBtn.addEventListener("click", () => this.runSearch(input.value));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.runSearch(input.value);
    });
    this.resultsBox = this.root.createEl("div");
  }
  async connect() {
    this.disconnect();
    this.discoveredConfig = readExtensionConfig(this.deps.vaultPath);
    const token = await resolveToken(this.deps.app);
    if (!token) {
      this.setError(
        "No token configured. Set PVM_API_TOKEN or store one in Obsidian secret storage."
      );
      return;
    }
    this.client = new VaultMindClient({
      host: this.deps.settings.host,
      port: readServerPort(this.deps.vaultPath) ?? this.deps.settings.port,
      token
    });
    this.unsubState = this.client.subscribeState((state) => this.updateConnectionState(state));
    this.unsubEvents = this.client.subscribeEvents((event) => this.handleEvent(event));
    this.client.connect();
    await this.refreshStatus();
  }
  disconnect() {
    if (this.unsubState) {
      this.unsubState();
      this.unsubState = null;
    }
    if (this.unsubEvents) {
      this.unsubEvents();
      this.unsubEvents = null;
    }
    if (this.client) {
      this.client.disconnect();
      this.client = null;
    }
  }
  updateConnectionState(state) {
    const dot = this.statusBar?.querySelector(".vault-mind-status-dot");
    if (dot) {
      dot.classList.remove("connected", "error");
      if (state.connected) dot.classList.add("connected");
      else if (state.error) dot.classList.add("error");
    }
    this.deps.updateStatusBar(state.connected, Boolean(state.error));
  }
  handleEvent(event) {
    switch (event.type) {
      case "vault-edit-proposed": {
        new import_obsidian16.Notice(`Vault Mind: proposed edit for ${event.path}`);
        const file = this.deps.app.vault.getAbstractFileByPath(event.path);
        if (file) {
          new DiffModal(
            this.deps.app,
            { path: event.path, old: event.oldContent, new: event.newContent },
            async () => {
              if (!(file instanceof import_obsidian16.TFile)) {
                new import_obsidian16.Notice(`Vault Mind: file not found: ${event.path}`);
                return;
              }
              try {
                await this.deps.app.vault.modify(file, event.newContent);
                new import_obsidian16.Notice(`Vault Mind: accepted changes to ${event.path}`);
              } catch (err) {
                new import_obsidian16.Notice(`Vault Mind: failed to write ${event.path}: ${err.message}`);
              }
            }
          ).open();
        }
        break;
      }
      case "job-notification":
        new import_obsidian16.Notice(`Vault Mind job ${event.jobId}: ${event.status} \u2014 ${event.message}`);
        break;
      case "context-request":
        break;
    }
  }
  async refreshStatus() {
    if (!this.client) return;
    try {
      const status = await this.client.status();
      this.renderStatus(status);
    } catch (err) {
      this.setError(`Status refresh failed: ${err.message}`);
    }
  }
  renderStatus(status) {
    const versionEl = this.statusBar?.querySelector(".vault-mind-version");
    if (versionEl) versionEl.textContent = `v${status.version}`;
    const model = this.discoveredConfig?.model ?? status.embedding?.model ?? "\u2014";
    if (this.providerEl) this.providerEl.textContent = `Model: ${model}`;
    if (this.modelEl) this.modelEl.textContent = `Dim: ${status.embedding?.dim ?? "\u2014"}`;
    if (this.watcherStatusEl) {
      this.watcherStatusEl.textContent = status.watcher ? "Watcher active" : "Watcher: stopped";
    }
    if (this.watcherBtn) {
      this.watcherBtn.textContent = status.watcher ? "Stop" : "Start watcher";
      this.watcherBtn.setAttribute(
        "aria-label",
        status.watcher ? "Stop file watcher" : "Start file watcher"
      );
      this.watcherBtn.classList.toggle("connected", status.watcher);
    }
    if (this.embeddingConfigEl) {
      this.embeddingConfigEl.empty();
      const embModel = this.discoveredConfig?.model ?? status.embedding?.model ?? "\u2014";
      const embDim = this.discoveredConfig?.dim ?? status.embedding?.dim ?? "\u2014";
      const localUrl = this.discoveredConfig?.localUrl ?? "\u2014";
      const serverText = status.server?.running ? `running on port ${status.server.port}` : "stopped";
      this.embeddingConfigEl.createEl("span", { text: `Model: ${embModel}` });
      this.embeddingConfigEl.createEl("span", { text: `Dim: ${embDim}` });
      this.embeddingConfigEl.createEl("span", { text: `Local: ${localUrl}` });
      this.embeddingConfigEl.createEl("span", { text: `Server: ${serverText}` });
    }
    if (this.syncStatusEl) {
      this.syncStatusEl.empty();
      const statusRecord = status;
      const sync = statusRecord.sync;
      const remote = statusRecord.remote;
      const dot = this.syncStatusEl.createEl("span", { cls: "vault-mind-status-dot" });
      const label = this.syncStatusEl.createEl("span", { text: "Sync: \u2014" });
      if (sync !== void 0 && sync !== null) {
        dot.classList.add("connected");
        label.textContent = `Sync: ${typeof sync === "object" ? JSON.stringify(sync) : String(sync)}`;
      } else if (remote !== void 0 && remote !== null) {
        dot.classList.add("connected");
        label.textContent = `Remote: ${typeof remote === "object" ? JSON.stringify(remote) : String(remote)}`;
      } else {
        label.textContent = "Sync: not configured";
      }
    }
  }
  setError(message) {
    this.resultsBox?.empty();
    this.resultsBox?.createEl("p", { cls: "vault-mind-empty", text: message });
    new import_obsidian16.Notice(`Vault Mind: ${message}`);
  }
  async refreshTokenSource() {
    const token = await resolveToken(this.deps.app);
    const source = process.env.PVM_API_TOKEN ? "environment" : token ? "Obsidian secret storage" : "not configured";
    this.tokenSourceEl?.setText(`Token: ${source}`);
  }
  async runSearch(query) {
    if (!this.client || !query.trim()) return;
    this.resultsBox?.empty();
    try {
      const res = await this.client.search(query.trim());
      await this.renderSearchResults(res);
    } catch (err) {
      this.setError(`Search failed: ${err.message}`);
    }
  }
  async renderSearchResults(res) {
    this.resultsBox?.empty();
    if (res.hits.length === 0) {
      this.resultsBox?.createEl("p", { cls: "vault-mind-empty", text: "No results." });
      return;
    }
    const list = this.resultsBox?.createEl("ul");
    if (!list) return;
    for (const hit of res.hits) {
      const source = typeof hit.source === "string" ? hit.source : "";
      const fact = typeof hit.fact === "string" ? hit.fact : "";
      const display = (fact || source).replace(/\|/g, "\\|").replace(/\]\]/g, "");
      const markdown = source ? `[[${source}|${display}]]` : display || JSON.stringify(hit);
      const li = list.createEl("li");
      if (this.component) {
        await import_obsidian16.MarkdownRenderer.render(this.deps.app, markdown, li, "", this.component);
      }
    }
  }
  async toggleWatcher() {
    if (!this.client) return;
    try {
      const res = await this.client.toggleWatcher();
      new import_obsidian16.Notice(`Vault Mind: watcher ${res.watcher ? "started" : "stopped"}`);
      await this.refreshStatus();
    } catch (err) {
      this.setError(`Watcher toggle failed: ${err.message}`);
    }
  }
  triggerRemoteReindex() {
    new import_obsidian16.Notice("Run /vm reindex in chat to rebuild the remote index");
  }
  launchPiTui() {
    if (!import_obsidian16.Platform.isDesktop) {
      new import_obsidian16.Notice("Vault Mind: TUI launcher is only available on desktop");
      return;
    }
    const cwd = this.deps.vaultPath;
    const piConfigDir = this.deps.piConfigDir;
    const piBinary = this.deps.piBinaryPath;
    const env = { ...process.env, PI_CODING_AGENT_DIR: piConfigDir };
    try {
      if (import_obsidian16.Platform.isMacOS) {
        const script = `cd ${shellQuote(cwd)} && export PI_CODING_AGENT_DIR=${shellQuote(piConfigDir)} && ${piBinary} --cwd ${shellQuote(cwd)}`;
        const appleScript = `tell application "Terminal" to do script "${script.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
        (0, import_node_child_process2.spawn)("osascript", ["-e", appleScript]);
      } else if (import_obsidian16.Platform.isLinux) {
        const cmd = `cd ${shellQuote(cwd)} && export PI_CODING_AGENT_DIR=${shellQuote(piConfigDir)} && ${piBinary} --cwd ${shellQuote(cwd)}`;
        (0, import_node_child_process2.spawn)("x-terminal-emulator", ["-e", "bash", "-c", cmd], { env });
      } else if (import_obsidian16.Platform.isWin) {
        const cmd = `cd /d ${winQuote(cwd)} && set PI_CODING_AGENT_DIR=${winQuote(piConfigDir)} && ${piBinary} --cwd ${winQuote(cwd)}`;
        (0, import_node_child_process2.spawn)("cmd", ["/c", "start", "cmd", "/k", cmd], { env, shell: false });
      } else {
        new import_obsidian16.Notice("Vault Mind: unsupported platform for TUI launcher");
      }
    } catch (err) {
      new import_obsidian16.Notice(`Vault Mind: failed to launch pi TUI: ${err.message}`);
    }
  }
};

// src/views/panel.ts
var VIEW_TYPE_PANEL = "vault-mind-panel";
var TAB_CONFIG = [
  { id: "chat", label: "Chat", icon: "message-circle" },
  { id: "queue", label: "Queue", icon: "list" },
  { id: "status", label: "Status", icon: "activity" },
  { id: "search", label: "Search", icon: "search" },
  { id: "collections", label: "Collections", icon: "layers" }
];
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function openPluginSettingsTab(app, tabId) {
  const host = app;
  host.setting.open();
  host.setting.openTabById(tabId);
}
var VaultMindPanel = class extends import_obsidian17.ItemView {
  deps;
  tabs = [];
  activeTab = "chat";
  personalized = true;
  constructor(leaf, deps) {
    super(leaf);
    this.deps = deps;
  }
  getViewType() {
    return VIEW_TYPE_PANEL;
  }
  getDisplayText() {
    return "Vault Mind";
  }
  getIcon() {
    return "vault-mind";
  }
  async onOpen() {
    const container = this.contentEl;
    container.empty();
    container.addClass("vault-mind-panel");
    const hasExtensions = (0, import_node_fs2.existsSync)(
      import_node_path2.default.join(this.deps.vaultPath, ".pi", "agent", "npm", "node_modules", "pi-vault-mind")
    );
    if (!hasExtensions) {
      this.renderSetupPrompt(container);
      return;
    }
    const tabBar = container.createEl("div", { cls: "vault-mind-tab-bar" });
    for (const cfg of TAB_CONFIG) {
      const tabContainer = container.createEl("div", { cls: "vault-mind-tab-content" });
      tabContainer.style.display = "none";
      const button = tabBar.createEl("button", {
        cls: "vault-mind-tab-button",
        attr: {
          "aria-label": cfg.label,
          "aria-selected": "false",
          role: "tab"
        }
      });
      (0, import_obsidian17.setIcon)(button, cfg.icon);
      button.createEl("span", { text: cfg.label });
      const entry = {
        id: cfg.id,
        label: cfg.label,
        icon: cfg.icon,
        container: tabContainer,
        button,
        tab: null,
        mounted: false
      };
      this.tabs.push(entry);
      button.addEventListener("click", () => {
        void this.switchTab(cfg.id);
      });
    }
    this.personalized = await this.checkPersonalized();
    await this.switchTab(this.activeTab);
  }
  async onClose() {
    for (const entry of this.tabs) {
      if (entry.tab) {
        entry.tab.destroy();
        entry.tab = null;
        entry.mounted = false;
      }
    }
    this.tabs = [];
  }
  /** Switch to a tab. Lazily mounts on first visit. */
  async switchTab(id) {
    this.activeTab = id;
    if (this.tabs.length === 0) {
      await this.onOpen();
      return;
    }
    for (const entry of this.tabs) {
      const isActive = entry.id === id;
      entry.container.style.display = isActive ? "" : "none";
      entry.button.classList.toggle("is-active", isActive);
      entry.button.setAttribute("aria-selected", String(isActive));
      if (isActive && !entry.mounted) {
        if (entry.id === "chat" && !this.personalized) {
          this.renderPersonalizationPrompt(entry.container);
          entry.mounted = true;
          continue;
        }
        entry.tab = this.createTab(entry.id);
        await entry.tab.mount(entry.container);
        entry.mounted = true;
      }
    }
  }
  renderSetupPrompt(container) {
    const prompt = container.createEl("div", { cls: "vault-mind-setup-prompt" });
    prompt.createEl("h3", { text: "Vault Mind" });
    prompt.createEl("p", {
      text: "This vault hasn't been initialized yet. Open Settings to set up pi-vault-mind."
    });
    const btn = prompt.createEl("button", { text: "Open Settings", cls: "mod-cta" });
    btn.addEventListener("click", () => {
      openPluginSettingsTab(this.app, this.deps.plugin.manifest.id);
    });
  }
  renderPersonalizationPrompt(container) {
    container.empty();
    const prompt = container.createEl("div", { cls: "vault-mind-personalization-prompt" });
    prompt.createEl("h3", { text: "Vault Mind" });
    prompt.createEl("p", {
      text: "Run `/vm personalize` in Settings to finish setup."
    });
    const btn = prompt.createEl("button", { text: "Open Settings", cls: "mod-cta" });
    btn.addEventListener("click", () => {
      openPluginSettingsTab(this.app, this.deps.plugin.manifest.id);
    });
  }
  /**
   * Determine whether the vault has completed personalization.
   *
   * Sources are checked in order. The default is `true` (allow chat) so that
   * existing vaults are not locked out while the backend personalization flow
   * is still rolling out. Only an explicit `personalizationComplete: false`
   * or a status field saying `false` will gate the chat tab. The tab bar is
   * rendered synchronously before this async check runs, so a slow or down
   * server does not freeze the whole panel.
   */
  async checkPersonalized() {
    const configPath = import_node_path2.default.join(this.deps.vaultPath, "pi-vault-mind.config.json");
    try {
      const raw = (0, import_node_fs2.readFileSync)(configPath, "utf-8");
      const cfg = JSON.parse(raw);
      if (isRecord(cfg)) {
        const extensionCompatibility = cfg.extensionCompatibility;
        if (isRecord(extensionCompatibility)) {
          const piContext = extensionCompatibility["pi-context"];
          if (isRecord(piContext) && "personalizationComplete" in piContext) {
            if (piContext.personalizationComplete === false) return false;
            if (piContext.personalizationComplete === true) return true;
          }
        }
      }
    } catch {
    }
    const markerPath = import_node_path2.default.join(this.deps.piConfigDir, ".personalized");
    if ((0, import_node_fs2.existsSync)(markerPath)) return true;
    const statusPersonalized = await this.fetchPersonalizationStatus();
    if (statusPersonalized === true) return true;
    if (statusPersonalized === false) return false;
    return true;
  }
  async fetchPersonalizationStatus() {
    const token = await resolveToken(this.app);
    const { host, port } = this.deps.settings;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 1500);
    try {
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;
      const response = await fetch(`http://${host}:${port}/vm/status`, {
        headers,
        signal: controller.signal
      });
      if (!response.ok) return null;
      const data = await response.json();
      if (!isRecord(data)) return null;
      if ("personalized" in data && data.personalized === true) return true;
      if ("personalization_complete" in data && data.personalization_complete === true) return true;
      if ("personalized" in data && data.personalized === false) return false;
      if ("personalization_complete" in data && data.personalization_complete === false)
        return false;
      return null;
    } catch {
      return null;
    } finally {
      window.clearTimeout(timeout);
    }
  }
  createTab(id) {
    const { deps } = this;
    switch (id) {
      case "chat": {
        const initialCommand = deps.plugin.pendingChatMessage;
        deps.plugin.pendingChatMessage = null;
        return new ChatTab({
          app: this.app,
          leaf: this.leaf,
          vaultPath: deps.vaultPath,
          piConfigDir: deps.piConfigDir,
          settings: deps.chatSettings,
          host: deps.settings.host,
          port: deps.settings.port,
          messageStore: deps.messageStore,
          onStoreFlush: () => deps.plugin.flushMessageStore(),
          initialCommand: initialCommand ?? void 0
        });
      }
      case "queue":
        return new QueueTab({
          app: this.app,
          settings: deps.settings,
          vaultPath: deps.vaultPath
        });
      case "status":
        return new StatusTab({
          app: this.app,
          settings: deps.settings,
          vaultPath: deps.vaultPath,
          piConfigDir: deps.piConfigDir,
          systemMdPath: deps.systemMdPath,
          piBinaryPath: deps.piBinaryPath,
          updateStatusBar: (connected, error) => {
            deps.plugin.updateStatusBar(connected, error);
          }
        });
      case "search":
        return new SearchTab({
          app: this.app,
          settings: deps.settings,
          vaultPath: deps.vaultPath
        });
      case "collections":
        return new CollectionTab({
          app: this.app,
          settings: deps.settings,
          vaultPath: deps.vaultPath
        });
    }
  }
};

// src/main.ts
var execAsync = (0, import_node_util.promisify)(import_node_child_process3.exec);
var DEFAULT_EMBEDDING_MODEL = "embeddinggemma";
var DEFAULT_OLLAMA_EMBEDDING_URL = "http://127.0.0.1:11434/v1";
var MODAL_APP_BASE_URL_SUFFIX = "--pi-vault-mind-embed-embeddingservice-fastapi-app.modal.run";
function defaultModelRouterChoices() {
  const isMacOS = process.platform === "darwin";
  return {
    primary: "ollama/gemma4:31b-cloud",
    fallbackSequence: isMacOS ? ["ollama/gemma4:e4b", "ollama/gemma4:12b-mlx", "ollama/gemma3:4b", "ollama/*"] : ["ollama/gemma4:e4b", "ollama/gemma4:12b", "ollama/gemma3:4b", "ollama/*"]
  };
}
var modalRemoteUrlForWorkspace = (workspace) => `https://${workspace}${MODAL_APP_BASE_URL_SUFFIX}`;
var isRecord2 = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var VAULT_MIND_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"/><path d="M9 21h6"/><path d="M10 9a2 2 0 0 1 4 0"/><path d="M8 12h1"/><path d="M15 12h1"/><circle cx="12" cy="6" r="1"/></svg>`;
var DEFAULT_SETTINGS = {
  host: "127.0.0.1",
  port: 11435,
  piBinaryPath: "pi",
  checkExtensionOnStartup: true,
  includeEditorContext: true,
  includeFilePicker: true,
  includeSlashCommands: true,
  resumeSession: true
};
var VaultMindSettingTab = class extends import_obsidian18.PluginSettingTab {
  plugin;
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  renderReconfigureForm(containerEl) {
    const configPath = import_node_path3.default.join(this.plugin.vaultPath, "pi-vault-mind.config.json");
    if (!(0, import_node_fs3.existsSync)(configPath)) return;
    const config = JSON.parse((0, import_node_fs3.readFileSync)(configPath, "utf-8"));
    const vaultMind = isRecord2(config.vaultMind) ? config.vaultMind : {};
    const embedding = isRecord2(vaultMind.embedding) ? vaultMind.embedding : {};
    new import_obsidian18.Setting(containerEl).setName("Vault Mind").setHeading();
    let provider = embedding.remoteUrl || embedding.localUrl ? embedding.remoteUrl ? "modal" : "ollama" : "skip";
    let ollamaUrl = embedding.localUrl || DEFAULT_OLLAMA_EMBEDDING_URL;
    let ollamaModel = embedding.model || DEFAULT_EMBEDDING_MODEL;
    let modalWorkspace = "";
    let modalRemoteUrl = embedding.remoteUrl || "";
    let modalToken = "";
    if (provider === "modal") {
      const modal = isRecord2(embedding.modal) ? embedding.modal : {};
      modalWorkspace = modal.workspace || "";
      if (modalWorkspace) modalRemoteUrl = modalRemoteUrlForWorkspace(modalWorkspace);
    }
    const extensionCompatibility = isRecord2(config.extensionCompatibility) ? config.extensionCompatibility : {};
    const piContext = isRecord2(extensionCompatibility["pi-context"]) ? extensionCompatibility["pi-context"] : {};
    let enableContextAutomation = piContext.enabled ?? true;
    const vaultKey = import_node_path3.default.basename(this.plugin.vaultPath);
    const vaults = isRecord2(config.vaults) ? config.vaults : {};
    const vaultCfg = isRecord2(vaults[vaultKey]) ? vaults[vaultKey] : {};
    let autoStart = vaultCfg.autoStart ?? false;
    const routerPath = import_node_path3.default.join(this.plugin.vaultPath, ".pi", "model-router.json");
    let primaryModel;
    let fallbackSequence;
    if ((0, import_node_fs3.existsSync)(routerPath)) {
      const router = JSON.parse((0, import_node_fs3.readFileSync)(routerPath, "utf-8"));
      const profiles = isRecord2(router.profiles) ? router.profiles : {};
      const auto = isRecord2(profiles.auto) ? profiles.auto : {};
      const medium = isRecord2(auto.medium) ? auto.medium : {};
      primaryModel = medium.model || defaultModelRouterChoices().primary;
      const rf = isRecord2(router.rateLimitFallback) ? router.rateLimitFallback : {};
      fallbackSequence = Array.isArray(rf.fallbackSequence) ? rf.fallbackSequence : defaultModelRouterChoices().fallbackSequence;
    } else {
      const defaults = defaultModelRouterChoices();
      primaryModel = defaults.primary;
      fallbackSequence = [...defaults.fallbackSequence];
    }
    const providerFields = containerEl.createEl("div", { cls: "vault-mind-init-config-fields" });
    const renderProviderFields = () => {
      providerFields.empty();
      if (provider === "ollama") {
        new import_obsidian18.Setting(providerFields).setName("Ollama").setDesc("Local OpenAI-compatible endpoint and embedding model.").addText(
          (text) => text.setValue(ollamaUrl).onChange((v) => {
            ollamaUrl = v;
          })
        ).addText(
          (text) => text.setValue(ollamaModel).onChange((v) => {
            ollamaModel = v;
          })
        );
      } else if (provider === "modal") {
        new import_obsidian18.Setting(providerFields).setName("Workspace").setDesc("Your Modal workspace slug.").addText((text) => {
          text.setValue(modalWorkspace).onChange((v) => {
            modalWorkspace = v;
            modalRemoteUrl = v.trim() ? modalRemoteUrlForWorkspace(v.trim()) : "";
          });
        });
        new import_obsidian18.Setting(providerFields).setName("API Token").addText((text) => {
          text.inputEl.type = "password";
          text.setValue(modalToken).onChange((v) => {
            modalToken = v;
          });
        });
      } else {
        providerFields.createEl("p", {
          cls: "setting-item-description",
          text: "Embedding setup is skipped."
        });
      }
    };
    new import_obsidian18.Setting(containerEl).setName("Embedding provider").addDropdown((dropdown) => {
      dropdown.addOption("ollama", "Local Ollama");
      dropdown.addOption("modal", "Modal (cloud)");
      dropdown.addOption("skip", "Skip for now");
      dropdown.setValue(provider);
      dropdown.onChange((v) => {
        provider = v;
        renderProviderFields();
      });
    });
    containerEl.appendChild(providerFields);
    renderProviderFields();
    new import_obsidian18.Setting(containerEl).setName("Chat models").setHeading();
    const modelPickerEl = containerEl.createEl("div", { cls: "vault-mind-init-model-picker" });
    ModelSequencePicker({
      sequence: [primaryModel, ...fallbackSequence],
      projectPath: this.plugin.vaultPath,
      onSequenceChange: (seq) => {
        if (seq.length === 0) {
          const defaults = defaultModelRouterChoices();
          primaryModel = defaults.primary;
          fallbackSequence = [...defaults.fallbackSequence];
        } else {
          primaryModel = seq[0];
          fallbackSequence = seq.slice(1);
        }
      }
    })(modelPickerEl);
    new import_obsidian18.Setting(containerEl).setName("Context automation").addToggle((toggle) => {
      toggle.setValue(enableContextAutomation).onChange((v) => {
        enableContextAutomation = v;
      });
    });
    new import_obsidian18.Setting(containerEl).setName("Auto-start").setDesc("Automatically start Vault Mind for this vault on plugin load.").addToggle((toggle) => {
      toggle.setValue(autoStart).onChange((v) => {
        autoStart = v;
      });
    });
    new import_obsidian18.Setting(containerEl).addButton(
      (btn) => btn.setButtonText("Save configuration").setCta().onClick(async () => {
        btn.setDisabled(true);
        try {
          await this.writeInitEmbeddingConfig({
            provider,
            ollamaUrl,
            ollamaModel,
            modalWorkspace,
            modalRemoteUrl,
            modalToken,
            enableContextAutomation
          });
          this.writeModelRouterConfig(this.plugin.vaultPath, primaryModel, fallbackSequence);
          const finalConfig = JSON.parse((0, import_node_fs3.readFileSync)(configPath, "utf-8"));
          const vaults2 = isRecord2(finalConfig.vaults) ? finalConfig.vaults : {};
          const vaultCfg2 = isRecord2(vaults2[vaultKey]) ? vaults2[vaultKey] : {};
          vaultCfg2.autoStart = autoStart;
          vaults2[vaultKey] = vaultCfg2;
          (0, import_node_fs3.writeFileSync)(configPath, `${JSON.stringify(finalConfig, null, 2)}
`, "utf-8");
          this.plugin.showNotice("Configuration saved");
        } catch (err) {
          this.plugin.showNotice(
            `Failed to save config: ${err instanceof Error ? err.message : String(err)}`
          );
        } finally {
          btn.setDisabled(false);
        }
      })
    );
    new import_obsidian18.Setting(containerEl).setName("Personalize vault").setDesc("Run /vm personalize to finish vault setup.").addButton(
      (btn) => btn.setButtonText("Personalize vault").onClick(() => {
        this.plugin.pendingChatMessage = "/vm personalize";
        void this.plugin.openPanel("chat");
      })
    );
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    const piDir = import_node_path3.default.join(this.plugin.vaultPath, ".pi");
    const hasExtensions = (0, import_node_fs3.existsSync)(
      import_node_path3.default.join(piDir, "agent", "npm", "node_modules", "pi-vault-mind")
    );
    this.renderInitSection(containerEl, hasExtensions);
    new import_obsidian18.Setting(containerEl).setName("Connection").setHeading();
    new import_obsidian18.Setting(containerEl).setName("Host").setDesc("HTTP server host").addText(
      (text) => text.setValue(this.plugin.settings.host).onChange(async (v) => {
        this.plugin.settings.host = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian18.Setting(containerEl).setName("Port").setDesc("HTTP server port").addText(
      (text) => text.setValue(String(this.plugin.settings.port)).onChange(async (v) => {
        const n = Number.parseInt(v, 10);
        this.plugin.settings.port = Number.isNaN(n) ? 11435 : n;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian18.Setting(containerEl).setName("Pi binary path").setDesc("Path to the pi executable for the chat view").addText(
      (text) => text.setValue(this.plugin.settings.piBinaryPath).onChange(async (v) => {
        this.plugin.settings.piBinaryPath = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian18.Setting(containerEl).setName("Check extension on startup").setDesc("Detect whether pi-vault-mind is installed in your pi session when Obsidian starts").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.checkExtensionOnStartup).onChange(async (v) => {
        this.plugin.settings.checkExtensionOnStartup = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian18.Setting(containerEl).setName("Include editor context").setDesc("Send the active note path and selection with chat messages").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.includeEditorContext).onChange(async (v) => {
        this.plugin.settings.includeEditorContext = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian18.Setting(containerEl).setName("Include file picker").setDesc("Allow @ references in the chat input to attach vault files as context").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.includeFilePicker).onChange(async (v) => {
        this.plugin.settings.includeFilePicker = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian18.Setting(containerEl).setName("Include slash commands").setDesc("Allow / references in the chat input to run Pi commands").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.includeSlashCommands).onChange(async (v) => {
        this.plugin.settings.includeSlashCommands = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian18.Setting(containerEl).setName("Resume session on startup").setDesc("Automatically resume the last chat session when opening the panel").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.resumeSession).onChange(async (v) => {
        this.plugin.settings.resumeSession = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian18.Setting(containerEl).setName("Folder layout").setHeading();
    new import_obsidian18.Setting(containerEl).setName("Inbox").setDesc("Agent input folder (default: Agent/Inbox)").addText(
      (text) => text.setPlaceholder("Agent/Inbox").onChange(async (v) => await this.saveFolderSetting("inbox", v))
    );
    new import_obsidian18.Setting(containerEl).setName("Library").setDesc("Knowledge output folder (default: Agent/Library)").addText(
      (text) => text.setPlaceholder("Agent/Library").onChange(async (v) => await this.saveFolderSetting("library", v))
    );
    new import_obsidian18.Setting(containerEl).setName("Presentations").setDesc("Broadcaster output folder (default: Agent/Presentations)").addText(
      (text) => text.setPlaceholder("Agent/Presentations").onChange(async (v) => await this.saveFolderSetting("presentations", v))
    );
    new import_obsidian18.Setting(containerEl).setName("Journal").setDesc("Audit/checkpoint trail folder (default: Agent/Journal)").addText(
      (text) => text.setPlaceholder("Agent/Journal").onChange(async (v) => await this.saveFolderSetting("journal", v))
    );
    new import_obsidian18.Setting(containerEl).setName("Token storage").setHeading();
    const tokenStatus = new import_obsidian18.Setting(containerEl).setName("API token").setDesc("Checking token source...");
    void this.getTokenSourceDescription().then((d) => tokenStatus.setDesc(d)).catch(() => tokenStatus.setDesc("Not configured."));
    if (hasExtensions) {
      this.renderReconfigureForm(containerEl);
    } else {
      new import_obsidian18.Setting(containerEl).setName("Vault Mind").setDesc("Vault not initialized. Run the init flow from the panel first.").addButton(
        (btn) => btn.setButtonText("Open Vault Mind panel").setIcon("layout-template").onClick(async () => {
          this.app.setting?.close();
          await this.plugin.openPanel("chat");
        })
      );
    }
  }
  async saveFolderSetting(key, value) {
    const token = await resolveToken(this.app);
    if (!token) {
      this.plugin.showNotice("no API token configured");
      return;
    }
    const client = new VaultMindClient({
      host: this.plugin.settings.host,
      port: readServerPort(this.plugin.vaultPath) ?? this.plugin.settings.port,
      token
    });
    try {
      await client.setup({
        folders: { [key]: value || void 0 }
      });
      this.plugin.showNotice(`${key} folder saved`);
    } catch (err) {
      this.plugin.showNotice(`failed to save ${key} folder \u2014 ${err.message}`);
    }
  }
  async getTokenSourceDescription() {
    if (process.env.PVM_API_TOKEN) {
      return "Configured from PVM_API_TOKEN environment variable.";
    }
    if (await resolveToken(this.app)) {
      return "Configured in Obsidian keychain.";
    }
    if ((0, import_node_fs3.existsSync)(import_node_path3.default.join(this.plugin.vaultPath, ".env.1pass"))) {
      return ".env.1pass is present; pi-1password resolves the token when pi starts.";
    }
    return "Not configured. Set PVM_API_TOKEN, store a token in Obsidian keychain, or add .env.1pass.";
  }
  getInstalledExtensionVersion() {
    const packageJsonPath = import_node_path3.default.join(
      this.plugin.vaultPath,
      ".pi",
      "agent",
      "npm",
      "node_modules",
      "pi-vault-mind",
      "package.json"
    );
    if (!(0, import_node_fs3.existsSync)(packageJsonPath)) return null;
    try {
      const manifest = JSON.parse((0, import_node_fs3.readFileSync)(packageJsonPath, "utf-8"));
      return typeof manifest.version === "string" && manifest.version.length > 0 ? manifest.version : null;
    } catch {
      return null;
    }
  }
  renderInitSection(containerEl, configured) {
    new import_obsidian18.Setting(containerEl).setName("Vault initialization").setHeading();
    const piBinary = detectPiBinary(this.plugin.settings.piBinaryPath, this.plugin.vaultPath);
    if (!configured && !piBinary) {
      containerEl.createEl("p", {
        cls: "setting-item-description",
        text: "Could not find the pi binary. Install pi first, then reopen settings."
      });
      return;
    }
    const initSection = containerEl.createEl("div");
    const runInitialization = async (btn) => {
      btn.setButtonText("Initializing...");
      btn.setDisabled(true);
      const progress = initSection.createEl("div", {
        cls: "vault-mind-init-progress"
      });
      if (!piBinary) {
        this.addStep(
          progress,
          "error",
          "Could not find the pi binary. Install pi first, then reopen settings."
        );
        this.plugin.showNotice("could not find the pi binary");
        btn.setButtonText(configured ? "Reinitialize" : "Retry");
        btn.setDisabled(false);
        return;
      }
      try {
        await this.runInit(piBinary, progress);
        this.plugin.showNotice("vault initialized \u2014 configure embedding");
        const step6 = this.addStep(progress, "active", "Configure embedding...");
        this.renderInitConfigForm(progress, step6);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        this.addStep(progress, "error", `Failed: ${message}`);
        this.plugin.showNotice(`${message}`);
        btn.setButtonText(configured ? "Reinitialize" : "Retry");
        btn.setDisabled(false);
      }
    };
    if (configured) {
      const version = this.getInstalledExtensionVersion();
      const statusDesc = version ? `\u2713 Initialized \u2014 extensions installed (pi-vault-mind v${version})` : "\u2713 Initialized \u2014 extensions installed";
      new import_obsidian18.Setting(initSection).setName("Vault status").setDesc(statusDesc).addButton((btn) => {
        btn.setButtonText("Reinitialize").setIcon("refresh-cw").onClick(async () => {
          await runInitialization(btn);
        });
      }).addButton((btn) => {
        btn.setButtonText("Open Chat").setIcon("messages-square").onClick(async () => {
          this.app.setting?.close();
          await this.plugin.openPanel("chat");
        });
      });
      return;
    }
    new import_obsidian18.Setting(initSection).setName("Initialize vault").setDesc(
      "Install pi-vault-mind and pi-context extensions, scaffold config, and write the system prompt."
    ).addButton((btn) => {
      btn.setButtonText("Initialize vault").setIcon("plus-circle").setCta().onClick(async () => {
        await runInitialization(btn);
      });
    });
  }
  renderInitConfigForm(progress, step) {
    const configSection = progress.createEl("div", { cls: "vault-mind-init-config" });
    configSection.createEl("p", { text: "Configure embedding (optional):" });
    let provider = "ollama";
    let ollamaUrl = DEFAULT_OLLAMA_EMBEDDING_URL;
    let ollamaModel = DEFAULT_EMBEDDING_MODEL;
    let modalWorkspace = "";
    let modalRemoteUrl = "";
    let modalToken = "";
    let enableContextAutomation = true;
    const { primary: defaultPrimaryModel, fallbackSequence: defaultFallbackSequence } = defaultModelRouterChoices();
    let primaryModel = defaultPrimaryModel;
    let fallbackSequence = [...defaultFallbackSequence];
    const providerFields = configSection.createEl("div", {
      cls: "vault-mind-init-config-fields"
    });
    const renderProviderFields = () => {
      providerFields.empty();
      if (provider === "ollama") {
        new import_obsidian18.Setting(providerFields).setName("Ollama").setDesc("Local OpenAI-compatible endpoint and embedding model.").addText(
          (text) => text.setPlaceholder(DEFAULT_OLLAMA_EMBEDDING_URL).setValue(ollamaUrl).onChange((value) => {
            ollamaUrl = value;
          })
        ).addText(
          (text) => text.setPlaceholder(DEFAULT_EMBEDDING_MODEL).setValue(ollamaModel).onChange((value) => {
            ollamaModel = value;
          })
        );
        return;
      }
      if (provider === "modal") {
        const statusEl = providerFields.createEl("p", {
          cls: "setting-item-description vault-mind-modal-status",
          text: "Detecting Modal CLI..."
        });
        let workspaceSetting = null;
        new import_obsidian18.Setting(providerFields).setName("Workspace").setDesc("Your Modal workspace slug (auto-detected if modal CLI is available).").addText((text) => {
          workspaceSetting = text;
          text.setPlaceholder("workspace-slug").setValue(modalWorkspace).onChange((value) => {
            modalWorkspace = value;
            modalRemoteUrl = value.trim() ? modalRemoteUrlForWorkspace(value.trim()) : "";
          });
        });
        const tokenSection = providerFields.createEl("div");
        const testStatusEl = providerFields.createEl("p", {
          cls: "setting-item-description vault-mind-modal-app-status",
          text: ""
        });
        new import_obsidian18.Setting(providerFields).setName("").addButton(
          (btn) => btn.setButtonText("Test connection").onClick(async () => {
            const url = modalRemoteUrl || (modalWorkspace.trim() ? modalRemoteUrlForWorkspace(modalWorkspace.trim()) : "");
            if (!url) {
              testStatusEl.setText("Enter a workspace slug first.");
              testStatusEl.removeClass("vault-mind-status-ok");
              testStatusEl.addClass("vault-mind-status-warn");
              return;
            }
            if (!modalToken.trim()) {
              testStatusEl.setText("Enter an API token first.");
              testStatusEl.removeClass("vault-mind-status-ok");
              testStatusEl.addClass("vault-mind-status-warn");
              return;
            }
            btn.setDisabled(true);
            testStatusEl.setText("Testing...");
            let testToken = modalToken.trim();
            if (testToken.startsWith("op://")) {
              const resolved = await this.resolveOpReference(testToken);
              if (!resolved) {
                testStatusEl.setText(
                  "\u26A0 Could not resolve op:// reference. Check 1Password CLI is signed in."
                );
                testStatusEl.removeClass("vault-mind-status-ok");
                testStatusEl.addClass("vault-mind-status-warn");
                btn.setDisabled(false);
                return;
              }
              testToken = resolved;
            }
            try {
              const resp = await fetch(`${url}/models`, {
                headers: { Authorization: `Bearer ${testToken}` },
                signal: AbortSignal.timeout(5e3)
              });
              if (resp.ok) {
                testStatusEl.setText("\u2713 Connection successful");
                testStatusEl.removeClass("vault-mind-status-warn");
                testStatusEl.addClass("vault-mind-status-ok");
              } else {
                let detail = "";
                try {
                  const body = await resp.text();
                  if (body) detail = `: ${body.slice(0, 120)}`;
                } catch {
                }
                testStatusEl.setText(`\u26A0 Server responded ${resp.status}${detail}`);
                testStatusEl.removeClass("vault-mind-status-ok");
                testStatusEl.addClass("vault-mind-status-warn");
              }
            } catch (err) {
              const message = err instanceof Error ? err.message : String(err);
              testStatusEl.setText(`\u26A0 Could not reach server: ${message}`);
              testStatusEl.removeClass("vault-mind-status-ok");
              testStatusEl.addClass("vault-mind-status-warn");
            } finally {
              btn.setDisabled(false);
            }
          })
        );
        void (async () => {
          try {
            const modalBin = detectModalBinary();
            if (modalBin) {
              try {
                const { stdout } = await execAsync(`"${modalBin}" token info`, {
                  timeout: 5e3,
                  env: buildExecEnv()
                });
                const workspace = /Workspace:\s+(\S+)/.exec(stdout)?.[1] ?? null;
                if (workspace) {
                  modalWorkspace = workspace;
                  modalRemoteUrl = modalRemoteUrlForWorkspace(workspace);
                  workspaceSetting?.setValue(workspace);
                  statusEl.setText(`\u2713 Modal CLI detected \u2014 workspace: ${workspace}`);
                  statusEl.addClass("vault-mind-status-ok");
                } else {
                  statusEl.setText("Modal CLI found \u2014 enter workspace slug manually.");
                }
              } catch {
                statusEl.setText(
                  "Modal CLI found but not authenticated \u2014 enter workspace slug manually."
                );
              }
            } else {
              statusEl.setText("Modal CLI not found \u2014 enter workspace slug manually.");
            }
            tokenSection.empty();
            const existingEnvToken = process.env.PVM_API_TOKEN;
            const existingResolvedToken = await resolveToken(this.app);
            const env1passPath = import_node_path3.default.join(this.plugin.vaultPath, ".pi", "agent", ".env.1pass");
            const hasEnvFile = (0, import_node_fs3.existsSync)(env1passPath);
            if (existingEnvToken) {
              tokenSection.createEl("p", {
                cls: "setting-item-description vault-mind-status-ok",
                text: "\u2713 PVM_API_TOKEN found in environment \u2014 no token entry needed."
              });
            } else if (existingResolvedToken) {
              tokenSection.createEl("p", {
                cls: "setting-item-description vault-mind-status-ok",
                text: "\u2713 Token stored in Obsidian keychain."
              });
              new import_obsidian18.Setting(tokenSection).setName("Replace token").setDesc(
                "Enter a new token to replace the stored one, or leave blank. op:// references are resolved via 1Password and stored in the Obsidian keychain; raw tokens are stored directly in the keychain."
              ).addText((text) => {
                text.inputEl.type = "password";
                text.setPlaceholder("new token or op:// reference").setValue("").onChange((v) => {
                  modalToken = v;
                });
              });
            } else if (hasEnvFile) {
              tokenSection.createEl("p", {
                cls: "setting-item-description vault-mind-status-ok",
                text: "\u2713 op:// reference found in .env.1pass."
              });
            } else {
              const opBin = detectOpBinary();
              const pi1passDir = import_node_path3.default.join(
                this.plugin.vaultPath,
                ".pi",
                "agent",
                "npm",
                "node_modules",
                "pi-1password"
              );
              const pi1passInstalled = (0, import_node_fs3.existsSync)(pi1passDir);
              if (opBin) {
                new import_obsidian18.Setting(tokenSection).setName("API token").setDesc(
                  pi1passInstalled ? "Enter an op:// reference and it will be resolved via 1Password, with the actual token stored in the Obsidian keychain. Paste a raw PVM_API_TOKEN to store it directly in the keychain." : "1Password CLI detected. op:// references will be resolved and the token stored in the Obsidian keychain; raw tokens are stored directly. If 1Password is unavailable, the op:// reference falls back to .env.1pass."
                ).addText((text) => {
                  text.inputEl.type = "password";
                  text.setPlaceholder("op://Private/pi-vault-mind-auth/password").setValue(modalToken).onChange((v) => {
                    modalToken = v;
                  });
                });
              } else {
                new import_obsidian18.Setting(tokenSection).setName("API token").setDesc(
                  "Paste your PVM_API_TOKEN. Stored in Obsidian's secure keychain \u2014 never written to disk in plaintext."
                ).addText((text) => {
                  text.inputEl.type = "password";
                  text.setPlaceholder("PVM_API_TOKEN").setValue(modalToken).onChange((v) => {
                    modalToken = v;
                  });
                });
              }
            }
          } catch {
            tokenSection.empty();
            new import_obsidian18.Setting(tokenSection).setName("API token").setDesc("Paste your PVM_API_TOKEN.").addText((text) => {
              text.inputEl.type = "password";
              text.setPlaceholder("PVM_API_TOKEN").setValue(modalToken).onChange((v) => {
                modalToken = v;
              });
            });
          }
        })();
        return;
      }
      providerFields.createEl("p", {
        cls: "setting-item-description",
        text: "Embedding setup will be skipped for now."
      });
    };
    new import_obsidian18.Setting(configSection).setName("Embedding provider").setDesc("Choose where Vault Mind should send embedding requests.").addDropdown((dropdown) => {
      dropdown.addOption("ollama", "Local Ollama");
      dropdown.addOption("modal", "Modal (cloud)");
      dropdown.addOption("skip", "Skip for now");
      dropdown.setValue(provider);
      dropdown.onChange((value) => {
        provider = value;
        renderProviderFields();
      });
    });
    configSection.appendChild(providerFields);
    renderProviderFields();
    new import_obsidian18.Setting(configSection).setName("Chat models").setHeading();
    const modelPickerEl = configSection.createEl("div", {
      cls: "vault-mind-init-model-picker"
    });
    ModelSequencePicker({
      sequence: [primaryModel, ...fallbackSequence],
      projectPath: this.plugin.vaultPath,
      onSequenceChange: (seq) => {
        if (seq.length === 0) {
          const defaults = defaultModelRouterChoices();
          primaryModel = defaults.primary;
          fallbackSequence = [...defaults.fallbackSequence];
        } else {
          primaryModel = seq[0];
          fallbackSequence = seq.slice(1);
        }
      }
    })(modelPickerEl);
    new import_obsidian18.Setting(configSection).setName("Context automation").setDesc("Enable pi-context ACM after setup.").addToggle(
      (toggle) => toggle.setValue(enableContextAutomation).onChange((value) => {
        enableContextAutomation = value;
      })
    ).addButton(
      (btn) => btn.setButtonText("Continue").setCta().onClick(async () => {
        btn.setDisabled(true);
        try {
          await this.writeInitEmbeddingConfig({
            provider,
            ollamaUrl,
            ollamaModel,
            modalWorkspace,
            modalRemoteUrl,
            modalToken,
            enableContextAutomation
          });
          this.writeModelRouterConfig(this.plugin.vaultPath, primaryModel, fallbackSequence);
          this.markDone(step);
          this.plugin.pendingChatMessage = null;
          this.plugin.showNotice("vault initialized \u2014 launching pi");
          this.app.setting?.close();
          await this.plugin.openPanel("chat");
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          this.addStep(progress, "error", `Failed to save config: ${message}`);
          this.plugin.showNotice(`failed to save config \u2014 ${message}`);
          btn.setDisabled(false);
        }
      })
    );
  }
  async writeInitEmbeddingConfig(options) {
    const configPath = import_node_path3.default.join(this.plugin.vaultPath, "pi-vault-mind.config.json");
    const config = (0, import_node_fs3.existsSync)(configPath) ? JSON.parse((0, import_node_fs3.readFileSync)(configPath, "utf-8")) : {};
    const vaultMind = isRecord2(config.vaultMind) ? config.vaultMind : {};
    const embedding = {};
    if (options.provider === "ollama") {
      embedding.localUrl = options.ollamaUrl.trim() || DEFAULT_OLLAMA_EMBEDDING_URL;
      embedding.model = options.ollamaModel.trim() || DEFAULT_EMBEDDING_MODEL;
    } else if (options.provider === "modal") {
      const workspace = options.modalWorkspace.trim();
      const remoteUrl = options.modalRemoteUrl.trim() || (workspace ? modalRemoteUrlForWorkspace(workspace) : "");
      if (!remoteUrl) {
        throw new Error("Enter a Modal workspace slug or choose Skip for now.");
      }
      const modalToken = options.modalToken.trim();
      if (modalToken) await this.writeModalToken(modalToken);
      const modal = {
        baseUrl: remoteUrl,
        model: DEFAULT_EMBEDDING_MODEL
      };
      if (workspace) modal.workspace = workspace;
      embedding.remoteUrl = remoteUrl;
      embedding.modal = modal;
    }
    vaultMind.embedding = embedding;
    config.vaultMind = vaultMind;
    const extensionCompatibility = isRecord2(config.extensionCompatibility) ? config.extensionCompatibility : {};
    const currentPiContext = isRecord2(extensionCompatibility["pi-context"]) ? extensionCompatibility["pi-context"] : {};
    extensionCompatibility["pi-context"] = {
      tagPatterns: [],
      enhanceInjectors: false,
      autoEnableAcm: true,
      indexContextEvents: true,
      ...currentPiContext,
      enabled: options.enableContextAutomation
    };
    config.extensionCompatibility = extensionCompatibility;
    (0, import_node_fs3.writeFileSync)(configPath, `${JSON.stringify(config, null, 2)}
`, "utf-8");
  }
  async resolveOpReference(ref) {
    const opBin = detectOpBinary();
    if (!opBin) return void 0;
    try {
      const { stdout } = await execAsync(`"${opBin}" read "${ref}"`, {
        timeout: 1e4,
        env: buildExecEnv()
      });
      return stdout.trim() || void 0;
    } catch {
      return void 0;
    }
  }
  async writeModalToken(token) {
    const trimmed = token.trim();
    if (!trimmed) return;
    if (trimmed.startsWith("op://")) {
      const resolved = await this.resolveOpReference(trimmed);
      if (resolved) {
        await this.app.secretStorage.setSecret(PVM_TOKEN_SECRET_ID, resolved);
        return;
      }
      this.appendEnvAssignment(
        import_node_path3.default.join(this.plugin.vaultPath, ".env.1pass"),
        "PVM_API_TOKEN",
        trimmed
      );
      return;
    }
    await this.app.secretStorage.setSecret(PVM_TOKEN_SECRET_ID, trimmed);
  }
  appendEnvAssignment(filePath, key, value) {
    const existing = (0, import_node_fs3.existsSync)(filePath) ? (0, import_node_fs3.readFileSync)(filePath, "utf-8") : "";
    const separator = existing.length > 0 && !existing.endsWith("\n") ? "\n" : "";
    const escapedValue = value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    (0, import_node_fs3.writeFileSync)(filePath, `${existing}${separator}${key}="${escapedValue}"
`, "utf-8");
  }
  async runInit(piBinary, progress) {
    const vaultPath = this.plugin.vaultPath;
    const agentDir = import_node_path3.default.join(vaultPath, ".pi", "agent");
    const shell = process.env.SHELL || (process.platform === "darwin" ? "/bin/zsh" : "/bin/bash");
    const options = {
      shell,
      timeout: 12e4,
      env: buildExecEnv()
    };
    const step1 = this.addStep(progress, "active", "Creating .pi/agent...");
    await execAsync(`mkdir -p '${agentDir.replace(/'/g, "'\\''")}'`, options);
    this.markDone(step1);
    const step2 = this.addStep(progress, "active", "Installing pi-vault-mind...");
    const q = (s) => `'${s.replace(/'/g, "'\\''")}'`;
    await execAsync(
      `PI_CODING_AGENT_DIR=${q(agentDir)} ${q(piBinary)} install npm:pi-vault-mind`,
      options
    );
    this.markDone(step2);
    const step3 = this.addStep(progress, "active", "Installing pi-context...");
    await execAsync(
      `PI_CODING_AGENT_DIR=${q(agentDir)} ${q(piBinary)} install npm:pi-context`,
      options
    );
    this.markDone(step3);
    const step3b = this.addStep(progress, "active", "Installing model discovery...");
    await execAsync(
      `PI_CODING_AGENT_DIR=${q(agentDir)} ${q(piBinary)} install npm:@kylebrodeur/pi-model-discovery`,
      options
    );
    this.markDone(step3b);
    const step3c = this.addStep(progress, "active", "Installing model router...");
    await execAsync(
      `PI_CODING_AGENT_DIR=${q(agentDir)} ${q(piBinary)} install npm:@kylebrodeur/pi-model-router`,
      options
    );
    this.markDone(step3c);
    const pi1passDir = import_node_path3.default.join(agentDir, "npm", "node_modules", "pi-1password");
    if (!(0, import_node_fs3.existsSync)(pi1passDir)) {
      const opBin = detectOpBinary();
      if (opBin) {
        const step3d = this.addStep(progress, "active", "Installing 1Password support...");
        try {
          await execAsync(
            `PI_CODING_AGENT_DIR=${q(agentDir)} ${q(piBinary)} install npm:pi-1password`,
            options
          );
        } catch {
        }
        this.markDone(step3d);
      }
    }
    const step4 = this.addStep(progress, "active", "Scaffolding config...");
    this.scaffoldConfig(vaultPath);
    this.scaffoldModelRouterConfig(agentDir);
    this.markDone(step4);
    const step5 = this.addStep(progress, "active", "Writing system prompt...");
    this.seedPiConfig(vaultPath, agentDir);
    this.markDone(step5);
  }
  scaffoldConfig(vaultPath) {
    const configPath = import_node_path3.default.join(vaultPath, "pi-vault-mind.config.json");
    const collectionsDir = import_node_path3.default.join(vaultPath, "collections");
    if (!(0, import_node_fs3.existsSync)(configPath)) {
      const config = {
        version: 2,
        collections: {
          main: {
            path: "collections/main.jsonl",
            schema: ["id", "domain", "source", "fact", "tag", "artifact"],
            dedupField: "fact"
          }
        },
        vaultMind: {
          dataDir: ".lancedb",
          embedding: {},
          ftsEnabled: true,
          graph: { enabled: true, canvasSync: true }
        }
      };
      (0, import_node_fs3.writeFileSync)(configPath, `${JSON.stringify(config, null, 2)}
`, "utf-8");
    }
    if (!(0, import_node_fs3.existsSync)(collectionsDir)) (0, import_node_fs3.mkdirSync)(collectionsDir, { recursive: true });
    const mainJsonl = import_node_path3.default.join(collectionsDir, "main.jsonl");
    if (!(0, import_node_fs3.existsSync)(mainJsonl)) (0, import_node_fs3.writeFileSync)(mainJsonl, "", "utf-8");
  }
  scaffoldModelRouterConfig(agentDir) {
    const piDir = import_node_path3.default.dirname(agentDir);
    const configPath = import_node_path3.default.join(piDir, "model-router.json");
    if ((0, import_node_fs3.existsSync)(configPath)) return;
    const { primary: mediumModel, fallbackSequence } = defaultModelRouterChoices();
    const config = {
      defaultProfile: "auto",
      features: {
        rateLimitFallback: true,
        ollamaSync: false,
        scopeShim: true,
        perTurnRouting: false,
        intentClassifier: false,
        costBudgeting: false,
        phaseMemory: false,
        contextCompression: false
      },
      rateLimitFallback: {
        enabled: true,
        shortDelayThreshold: 30,
        autoFallback: true,
        autoRestore: true,
        restoreCheckInterval: 300,
        fallbackSequence
      },
      profiles: {
        auto: {
          high: { model: "ollama/gemma4:31b-cloud", thinking: "medium" },
          medium: { model: mediumModel, thinking: "low" },
          low: { model: "ollama/gemma4:e4b", thinking: "off" }
        }
      }
    };
    (0, import_node_fs3.writeFileSync)(configPath, `${JSON.stringify(config, null, 2)}
`, "utf-8");
  }
  /** Update `.pi/model-router.json` with the user's primary/fallback choices. */
  writeModelRouterConfig(vaultPath, primaryModel, fallbackSequence) {
    const configPath = import_node_path3.default.join(vaultPath, ".pi", "model-router.json");
    if (!(0, import_node_fs3.existsSync)(configPath)) return;
    const config = JSON.parse((0, import_node_fs3.readFileSync)(configPath, "utf-8"));
    const profiles = isRecord2(config.profiles) ? config.profiles : {};
    const auto = isRecord2(profiles.auto) ? profiles.auto : {};
    const medium = isRecord2(auto.medium) ? auto.medium : {};
    medium.model = primaryModel;
    auto.medium = medium;
    profiles.auto = auto;
    config.profiles = profiles;
    const rateLimitFallback = isRecord2(config.rateLimitFallback) ? config.rateLimitFallback : {};
    rateLimitFallback.fallbackSequence = fallbackSequence;
    config.rateLimitFallback = rateLimitFallback;
    (0, import_node_fs3.writeFileSync)(configPath, `${JSON.stringify(config, null, 2)}
`, "utf-8");
  }
  seedPiConfig(vaultPath, agentDir) {
    const vaultName = this.app.vault.getName();
    const systemMdPath = import_node_path3.default.join(agentDir, "system.md");
    (0, import_node_fs3.mkdirSync)(agentDir, { recursive: true });
    if (!(0, import_node_fs3.existsSync)(systemMdPath)) {
      (0, import_node_fs3.writeFileSync)(
        systemMdPath,
        `You are an AI assistant working inside the ${vaultName} Obsidian vault. Use search and context tools to ground your answers in vault content whenever relevant.`,
        "utf-8"
      );
    }
    const configYamlPath = import_node_path3.default.join(agentDir, "config.yaml");
    if (!(0, import_node_fs3.existsSync)(configYamlPath)) {
      (0, import_node_fs3.writeFileSync)(
        configYamlPath,
        `# pi configuration for the ${vaultName} vault
# Generated by the Vault Mind Obsidian plugin.
`,
        "utf-8"
      );
    }
  }
  addStep(container, status, text) {
    const step = container.createEl("div", {
      cls: `vault-mind-init-step vault-mind-init-step-${status}`
    });
    const iconEl = step.createEl("span", { cls: "vault-mind-init-step-icon" });
    const icon = status === "done" ? "check" : status === "error" ? "x" : "loader";
    (0, import_obsidian18.setIcon)(iconEl, icon);
    step.createEl("span", { text });
    return step;
  }
  markDone(step) {
    step.classList.replace("vault-mind-init-step-active", "vault-mind-init-step-done");
    const icon = step.querySelector(".vault-mind-init-step-icon");
    if (icon) (0, import_obsidian18.setIcon)(icon, "check");
  }
};
var VaultMindPlugin = class extends import_obsidian18.Plugin {
  editorContext = { filePath: null, cursor: null, selection: null };
  connectionState = { connected: false, error: false };
  statusBarItem = null;
  /** Message to auto-send in chat after next panel open (set by init flow) */
  pendingChatMessage = null;
  activeNotices = [];
  contextPushTimer = null;
  async onload() {
    (0, import_obsidian18.addIcon)("vault-mind", VAULT_MIND_ICON);
    for (const staleType of [
      "pi-chat-view",
      "vault-mind-chat",
      "vault-mind-queue",
      "vault-mind-status",
      "vault-mind-setup"
    ]) {
      this.app.workspace.detachLeavesOfType(staleType);
    }
    const existingPanels = this.app.workspace.getLeavesOfType("vault-mind-panel");
    for (let i = 1; i < existingPanels.length; i++) {
      existingPanels[i].detach();
    }
    for (const el of activeDocument.querySelectorAll(".notice")) {
      if (el.textContent?.includes("Vault Mind")) el.remove();
    }
    await this.loadSettings();
    const rawData = await this.loadData() ?? {};
    const savedData = this.withoutLegacyToken(rawData);
    if (isRecord2(rawData) && "token" in rawData) {
      await this.saveData(savedData);
    }
    this.messageStore = new MessageStore();
    this.messageStore.load(savedData.messages ?? null);
    this.registerEditorExtension(
      import_view.EditorView.updateListener.of((update) => {
        if (!update.selectionSet) return;
        const info = update.state.field(import_obsidian18.editorInfoField, false);
        const activeFile = this.app.workspace.getActiveFile();
        if (!info?.file || activeFile?.path !== info.file.path) {
          return;
        }
        const sel = update.state.selection.main;
        this.editorContext.filePath = info.file.path;
        this.editorContext.cursor = sel.from;
        this.editorContext.selection = update.state.doc.sliceString(sel.from, sel.to);
        this.scheduleContextPush();
      })
    );
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", () => {
        const active = this.app.workspace.getActiveViewOfType(import_obsidian18.MarkdownView);
        if (!active?.file) {
          this.editorContext.filePath = null;
          this.editorContext.cursor = null;
          this.editorContext.selection = null;
          this.scheduleContextPush();
          return;
        }
        this.editorContext.filePath = active.file.path;
        this.editorContext.selection = active.editor.getSelection();
        const from = active.editor.getCursor("from");
        this.editorContext.cursor = active.editor.posToOffset(from);
        this.scheduleContextPush();
      })
    );
    const vaultPath = this.app.vault.adapter.getBasePath?.() || this.app.vault.getName();
    this.vaultPath = vaultPath;
    const piConfigDir = import_node_path3.default.join(vaultPath, ".pi", "agent");
    const systemMdPath = import_node_path3.default.join(piConfigDir, "system.md");
    const panelDeps = {
      vaultPath,
      piConfigDir,
      systemMdPath,
      settings: this.settings,
      piBinaryPath: this.settings.piBinaryPath,
      plugin: this,
      chatSettings: {
        piBinaryPath: this.settings.piBinaryPath,
        workingDirectory: vaultPath,
        defaultProvider: "",
        defaultModel: "",
        sessionSaveDir: "Pi-Sessions",
        persistSessions: true,
        thinkingLevel: "medium",
        rpcTimeout: 6e4
      },
      messageStore: this.messageStore,
      resumeSession: this.settings.resumeSession
    };
    this.registerView(VIEW_TYPE_PANEL, (leaf) => new VaultMindPanel(leaf, panelDeps));
    this.statusBarItem = this.addStatusBarItem();
    this.statusBarItem.addClass("vault-mind-status-bar-item");
    this.statusBarItem.setAttribute("tabindex", "0");
    this.statusBarItem.setAttribute("role", "button");
    this.statusBarItem.setAttribute("aria-label", "Open Vault Mind status");
    this.statusBarItem.createEl("span", { cls: "vault-mind-status-dot" });
    this.statusBarItem.createEl("span", { text: "Vault Mind" });
    this.statusBarItem.addEventListener("click", () => this.openPanel("status"));
    this.statusBarItem.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        void this.openPanel("status");
      }
    });
    const ribbonIconEl = this.addRibbonIcon("vault-mind", "Vault Mind", () => {
      this.openPanel("chat");
    });
    ribbonIconEl.addClass("vault-mind-ribbon-icon");
    ribbonIconEl.setAttribute("tabindex", "0");
    ribbonIconEl.setAttribute("role", "button");
    ribbonIconEl.setAttribute("aria-label", "Open Vault Mind");
    ribbonIconEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        void this.openPanel("chat");
      }
    });
    (0, import_obsidian18.setIcon)(ribbonIconEl, "vault-mind");
    this.addCommand({
      id: "open-panel",
      name: "Open panel",
      callback: () => this.openPanel("chat")
    });
    this.addCommand({
      id: "open-queue",
      name: "Open queue",
      callback: () => this.openPanel("queue")
    });
    this.addCommand({
      id: "open-status",
      name: "Open status",
      callback: () => this.openPanel("status")
    });
    this.addCommand({
      id: "open-chat",
      name: "Open chat",
      callback: () => this.openPanel("chat")
    });
    this.addCommand({
      id: "dispatch-agent",
      name: "Dispatch agent",
      callback: () => void this.runDispatchAgentFlow()
    });
    this.addCommand({
      id: "scan-current-file",
      name: "Scan current file for @agent markers",
      callback: () => void this.runScanCurrentFile()
    });
    this.addCommand({
      id: "ingest-current-note",
      name: "Ingest current note into vault collection",
      callback: () => void this.runIngestCurrentNote()
    });
    this.addSettingTab(new VaultMindSettingTab(this.app, this));
    registerVaultMindProtocolHandlers(this);
  }
  onunload() {
    void this.flushMessageStore();
    for (const notice of this.activeNotices) notice.hide();
    this.activeNotices = [];
  }
  /** Create a Notice tracked for cleanup. Auto-dismisses after timeout (default 5s). */
  showNotice(message, timeout = 5e3) {
    const notice = new import_obsidian18.Notice(`Vault Mind: ${message}`, timeout);
    this.activeNotices.push(notice);
    activeWindow.setTimeout(() => {
      const idx = this.activeNotices.indexOf(notice);
      if (idx !== -1) this.activeNotices.splice(idx, 1);
    }, timeout + 200);
    return notice;
  }
  scheduleContextPush() {
    if (this.contextPushTimer) {
      clearTimeout(this.contextPushTimer);
    }
    this.contextPushTimer = activeWindow.setTimeout(() => {
      this.contextPushTimer = null;
      void this.flushContextPush();
    }, 100);
  }
  async flushContextPush() {
    const token = await resolveToken(this.app);
    if (!token) return;
    const client = new VaultMindClient({
      host: this.settings.host,
      port: readServerPort(this.vaultPath) ?? this.settings.port,
      token
    });
    try {
      await client.pushContext(
        this.editorContext.filePath,
        this.editorContext.selection,
        this.editorContext.cursor
      );
    } catch {
    }
  }
  async flushMessageStore() {
    if (!this.messageStore.isDirty()) return;
    const existing = this.withoutLegacyToken(await this.loadData());
    await this.saveData({ ...existing, messages: this.messageStore.serialize() });
  }
  /**
   * Opens the unified panel and switches to the given tab.
   */
  async openPanel(tabId) {
    const { workspace } = this.app;
    let leaf = null;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE_PANEL);
    if (leaves.length > 0) {
      leaf = leaves[0];
    } else {
      leaf = workspace.getRightLeaf(false);
      if (!leaf) {
        leaf = workspace.getLeaf(false);
      }
      await leaf.setViewState({ type: VIEW_TYPE_PANEL, active: true });
    }
    if (leaf) {
      workspace.revealLeaf(leaf);
      if (leaf.view instanceof VaultMindPanel) {
        await leaf.view.switchTab(tabId);
      }
    }
  }
  /**
   * Builds a configured VaultMindClient using the current token, host and port.
   * Returns null if no token can be resolved.
   */
  async getVaultMindClient() {
    const token = await resolveToken(this.app);
    if (!token) {
      this.showNotice("No API token configured");
      return null;
    }
    return new VaultMindClient({
      host: this.settings.host,
      port: readServerPort(this.vaultPath) ?? this.settings.port,
      token
    });
  }
  /**
   * Command flow: pick a role, enter an instruction, and dispatch a manual
   * agent job for the active file.
   */
  async runDispatchAgentFlow() {
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) {
      this.showNotice("No active file");
      return;
    }
    const client = await this.getVaultMindClient();
    if (!client) return;
    new RolePickerModal(this.app, async (role) => {
      const instruction = await new Promise((resolve) => {
        new InstructionInputModal(this.app, `Instruction for ${role}`, resolve).open();
      });
      if (instruction === null || instruction.trim() === "") {
        this.showNotice("No instruction provided");
        return;
      }
      const result = await client.dispatch(role, instruction, activeFile.path);
      if ("error" in result) {
        this.showNotice(`Dispatch failed: ${result.error}`);
      } else {
        this.showNotice(`Dispatched ${role}: ${result.jobId}`);
      }
    }).open();
  }
  /**
   * Command flow: scan the active file for @agent markers and report how many
   * groups were found.
   */
  async runScanCurrentFile() {
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) {
      this.showNotice("No active file");
      return;
    }
    const client = await this.getVaultMindClient();
    if (!client) return;
    const result = await client.scan(activeFile.path);
    if ("error" in result) {
      this.showNotice(`Scan failed: ${result.error}`);
    } else if (result.groups === 0) {
      this.showNotice("No @agent markers found");
    } else {
      const roles = result.details.map((d) => d.role).join(", ");
      this.showNotice(`Found ${result.groups} @agent group(s): ${roles}`);
    }
  }
  async runIngestCurrentNote() {
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) {
      this.showNotice("No active file");
      return;
    }
    const content = await this.app.vault.cachedRead(activeFile);
    if (!content.trim()) {
      this.showNotice("Active note is empty");
      return;
    }
    const source = content.slice(0, 8e3);
    const path6 = activeFile.path;
    this.pendingChatMessage = `Ingest the following note into the vault collection "main" using vm_ingest:

<file path="${path6}">
${source}
</file>`;
    await this.openPanel("chat");
  }
  withoutLegacyToken(data) {
    if (!isRecord2(data)) return {};
    const existing = {};
    for (const [key, value] of Object.entries(data)) {
      if (key !== "token") existing[key] = value;
    }
    return existing;
  }
  async loadSettings() {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      this.withoutLegacyToken(await this.loadData())
    );
  }
  async saveSettings() {
    const existing = this.withoutLegacyToken(await this.loadData());
    await this.saveData({ ...existing, ...this.settings });
  }
  updateStatusBar(connected, error) {
    this.connectionState = { connected, error };
    const dot = this.statusBarItem?.querySelector(".vault-mind-status-dot");
    if (!dot) return;
    dot.classList.remove("connected", "error");
    if (connected) dot.classList.add("connected");
    else if (error) dot.classList.add("error");
  }
  async openView(type) {
    const { workspace } = this.app;
    let leaf = null;
    const leaves = workspace.getLeavesOfType(type);
    if (leaves.length > 0) {
      leaf = leaves[0];
    } else {
      leaf = workspace.getRightLeaf(false);
      if (leaf) {
        await leaf.setViewState({ type, active: true });
      }
    }
    if (leaf) {
      workspace.revealLeaf(leaf);
    }
  }
};
