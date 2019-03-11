
var OGVDecoderAudioVorbisW = (function() {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  return (
function(OGVDecoderAudioVorbisW) {
  OGVDecoderAudioVorbisW = OGVDecoderAudioVorbisW || {};

var a;a||(a=typeof OGVDecoderAudioVorbisW !== 'undefined' ? OGVDecoderAudioVorbisW : {});var h=a;a.memoryLimit&&(a.TOTAL_MEMORY=h.memoryLimit);var k={},l;for(l in a)a.hasOwnProperty(l)&&(k[l]=a[l]);a.arguments=[];a.thisProgram="./this.program";a.quit=function(b,c){throw c;};a.preRun=[];a.postRun=[];var m=!1,n=!1,p=!1,q=!1;m="object"===typeof window;n="function"===typeof importScripts;p="object"===typeof process&&"function"===typeof require&&!m&&!n;q=!m&&!p&&!n;var r="";
if(p){r=__dirname+"/";var t,u;a.read=function(b,c){t||(t=require("fs"));u||(u=require("path"));b=u.normalize(b);b=t.readFileSync(b);return c?b:b.toString()};a.readBinary=function(b){b=a.read(b,!0);b.buffer||(b=new Uint8Array(b));b.buffer||v("Assertion failed: undefined");return b};1<process.argv.length&&(a.thisProgram=process.argv[1].replace(/\\/g,"/"));a.arguments=process.argv.slice(2);process.on("unhandledRejection",v);a.quit=function(b){process.exit(b)};a.inspect=function(){return"[Emscripten Module object]"}}else if(q)"undefined"!=
typeof read&&(a.read=function(b){return read(b)}),a.readBinary=function(b){if("function"===typeof readbuffer)return new Uint8Array(readbuffer(b));b=read(b,"binary");"object"===typeof b||v("Assertion failed: undefined");return b},"undefined"!=typeof scriptArgs?a.arguments=scriptArgs:"undefined"!=typeof arguments&&(a.arguments=arguments),"function"===typeof quit&&(a.quit=function(b){quit(b)});else if(m||n)n?r=self.location.href:document.currentScript&&(r=document.currentScript.src),_scriptDir&&(r=_scriptDir),
0!==r.indexOf("blob:")?r=r.substr(0,r.lastIndexOf("/")+1):r="",a.read=function(b){var c=new XMLHttpRequest;c.open("GET",b,!1);c.send(null);return c.responseText},n&&(a.readBinary=function(b){var c=new XMLHttpRequest;c.open("GET",b,!1);c.responseType="arraybuffer";c.send(null);return new Uint8Array(c.response)}),a.readAsync=function(b,c,d){var e=new XMLHttpRequest;e.open("GET",b,!0);e.responseType="arraybuffer";e.onload=function(){200==e.status||0==e.status&&e.response?c(e.response):d()};e.onerror=
d;e.send(null)},a.setWindowTitle=function(b){document.title=b};var w=a.print||("undefined"!==typeof console?console.log.bind(console):"undefined"!==typeof print?print:null),y=a.printErr||("undefined"!==typeof printErr?printErr:"undefined"!==typeof console&&console.warn.bind(console)||w);for(l in k)k.hasOwnProperty(l)&&(a[l]=k[l]);k=void 0;var aa={"f64-rem":function(b,c){return b%c},"debugger":function(){debugger}};"object"!==typeof WebAssembly&&y("no native wasm support detected");var z,A=!1;
"undefined"!==typeof TextDecoder&&new TextDecoder("utf8");"undefined"!==typeof TextDecoder&&new TextDecoder("utf-16le");function B(b){0<b%65536&&(b+=65536-b%65536);return b}var buffer,C,D,E;function F(){a.HEAP8=new Int8Array(buffer);a.HEAP16=new Int16Array(buffer);a.HEAP32=D=new Int32Array(buffer);a.HEAPU8=C=new Uint8Array(buffer);a.HEAPU16=new Uint16Array(buffer);a.HEAPU32=E=new Uint32Array(buffer);a.HEAPF32=new Float32Array(buffer);a.HEAPF64=new Float64Array(buffer)}var G=a.TOTAL_MEMORY||16777216;
5242880>G&&y("TOTAL_MEMORY should be larger than TOTAL_STACK, was "+G+"! (TOTAL_STACK=5242880)");a.buffer?buffer=a.buffer:("object"===typeof WebAssembly&&"function"===typeof WebAssembly.Memory?(z=new WebAssembly.Memory({initial:G/65536}),buffer=z.buffer):buffer=new ArrayBuffer(G),a.buffer=buffer);F();D[15184]=5303872;
function H(b){for(;0<b.length;){var c=b.shift();if("function"==typeof c)c();else{var d=c.u;"number"===typeof d?void 0===c.s?a.dynCall_v(d):a.dynCall_vi(d,c.s):d(void 0===c.s?null:c.s)}}}var I=[],ba=[],ca=[],J=[],L=!1;function da(){var b=a.preRun.shift();I.unshift(b)}var M=0,N=null,O=null;a.preloadedImages={};a.preloadedAudios={};function P(){var b=Q;return String.prototype.startsWith?b.startsWith("data:application/octet-stream;base64,"):0===b.indexOf("data:application/octet-stream;base64,")}
var Q="ogv-decoder-audio-vorbis-wasm.wasm";if(!P()){var R=Q;Q=a.locateFile?a.locateFile(R,r):r+R}function S(){try{if(a.wasmBinary)return new Uint8Array(a.wasmBinary);if(a.readBinary)return a.readBinary(Q);throw"both async and sync fetching of the wasm failed";}catch(b){v(b)}}
function ea(){return a.wasmBinary||!m&&!n||"function"!==typeof fetch?new Promise(function(b){b(S())}):fetch(Q,{credentials:"same-origin"}).then(function(b){if(!b.ok)throw"failed to load wasm binary file at '"+Q+"'";return b.arrayBuffer()}).catch(function(){return S()})}
function fa(b){function c(b){a.asm=b.exports;M--;a.monitorRunDependencies&&a.monitorRunDependencies(M);0==M&&(null!==N&&(clearInterval(N),N=null),O&&(b=O,O=null,b()))}function d(b){c(b.instance)}function e(b){ea().then(function(b){return WebAssembly.instantiate(b,g)}).then(b,function(b){y("failed to asynchronously prepare wasm: "+b);v(b)})}var g={env:b,global:{NaN:NaN,Infinity:Infinity},"global.Math":Math,asm2wasm:aa};M++;a.monitorRunDependencies&&a.monitorRunDependencies(M);if(a.instantiateWasm)try{return a.instantiateWasm(g,
c)}catch(x){return y("Module.instantiateWasm callback failed with error: "+x),!1}a.wasmBinary||"function"!==typeof WebAssembly.instantiateStreaming||P()||"function"!==typeof fetch?e(d):WebAssembly.instantiateStreaming(fetch(Q,{credentials:"same-origin"}),g).then(d,function(b){y("wasm streaming compile failed: "+b);y("falling back to ArrayBuffer instantiation");e(d)});return{}}
a.asm=function(b,c){c.memory=z;c.table=new WebAssembly.Table({initial:52,maximum:52,element:"anyfunc"});c.__memory_base=1024;c.__table_base=0;return fa(c)};
var U=a.asm({},{b:v,c:function(b){a.___errno_location&&(D[a.___errno_location()>>2]=b);return b},j:function(){return G},i:function(b,c,d){C.set(C.subarray(c,c+d),b)},h:function(b){if(2147418112<b)return!1;for(var c=Math.max(G,16777216);c<b;)536870912>=c?c=B(2*c):c=Math.min(B((3*c+2147483648)/4),2147418112);var d=B(c);var e=a.buffer.byteLength;try{var g=-1!==z.grow((d-e)/65536)?a.buffer=z.buffer:null}catch(x){g=null}if(!g||g.byteLength!=c)return!1;a.buffer=buffer=g;F();G=c;E[15184]=b;return!0},g:function(b){if(!a.noExitRuntime&&
(A=!0,a.onExit))a.onExit(b);a.quit(b,new T(b))},f:function(b,c,d){var e=a.HEAPU32,g=a.HEAPF32,x=[];if(0!==b)for(var f,K=0;K<c;K++)f=e[b/4+K],g.buffer.slice?(f=g.buffer.slice(f,f+4*d),f=new Float32Array(f)):(f=g.subarray(f/4,f/4+d),f=new Float32Array(f)),x.push(f);a.audioBuffer=x},e:function(b,c){a.audioFormat={channels:b,rate:c};a.loadedMetadata=!0},d:function(){v("OOM")},a:60736},buffer);a.asm=U;a._free=function(){return a.asm.k.apply(null,arguments)};
a._malloc=function(){return a.asm.l.apply(null,arguments)};a._ogv_audio_decoder_destroy=function(){return a.asm.m.apply(null,arguments)};a._ogv_audio_decoder_init=function(){return a.asm.n.apply(null,arguments)};a._ogv_audio_decoder_process_audio=function(){return a.asm.o.apply(null,arguments)};a._ogv_audio_decoder_process_header=function(){return a.asm.p.apply(null,arguments)};a.dynCall_vi=function(){return a.asm.q.apply(null,arguments)};a.asm=U;
a.then=function(b){if(a.calledRun)b(a);else{var c=a.onRuntimeInitialized;a.onRuntimeInitialized=function(){c&&c();b(a)}}return a};function T(b){this.name="ExitStatus";this.message="Program terminated with exit("+b+")";this.status=b}T.prototype=Error();T.prototype.constructor=T;O=function ha(){a.calledRun||V();a.calledRun||(O=ha)};
function V(){function b(){if(!a.calledRun&&(a.calledRun=!0,!A)){L||(L=!0,H(ba));H(ca);if(a.onRuntimeInitialized)a.onRuntimeInitialized();if(a.postRun)for("function"==typeof a.postRun&&(a.postRun=[a.postRun]);a.postRun.length;){var b=a.postRun.shift();J.unshift(b)}H(J)}}if(!(0<M)){if(a.preRun)for("function"==typeof a.preRun&&(a.preRun=[a.preRun]);a.preRun.length;)da();H(I);0<M||a.calledRun||(a.setStatus?(a.setStatus("Running..."),setTimeout(function(){setTimeout(function(){a.setStatus("")},1);b()},
1)):b())}}a.run=V;function v(b){if(a.onAbort)a.onAbort(b);void 0!==b?(w(b),y(b),b=JSON.stringify(b)):b="";A=!0;throw"abort("+b+"). Build with -s ASSERTIONS=1 for more info.";}a.abort=v;if(a.preInit)for("function"==typeof a.preInit&&(a.preInit=[a.preInit]);0<a.preInit.length;)a.preInit.pop()();a.noExitRuntime=!0;V();var W,X;function ia(b){if(W&&X>=b)return W;W&&a._free(W);X=b;return W=a._malloc(X)}var Y;Y="undefined"===typeof performance||"undefined"===typeof performance.now?Date.now:performance.now.bind(performance);
function Z(b){var c=Y();b=b();a.cpuTime+=Y()-c;return b}a.loadedMetadata=!!h.audioFormat;a.audioFormat=h.audioFormat||null;a.audioBuffer=null;a.cpuTime=0;Object.defineProperty(a,"processing",{get:function(){return!1}});a.init=function(b){Z(function(){a._ogv_audio_decoder_init()});b()};a.processHeader=function(b,c){var d=Z(function(){var c=b.byteLength,d=ia(c);a.HEAPU8.set(new Uint8Array(b),d);return a._ogv_audio_decoder_process_header(d,c)});c(d)};
a.processAudio=function(b,c){var d=Z(function(){var c=b.byteLength,d=ia(c);a.HEAPU8.set(new Uint8Array(b),d);return a._ogv_audio_decoder_process_audio(d,c)});c(d)};a.close=function(){};


  return OGVDecoderAudioVorbisW
}
);
})();
if (typeof exports === 'object' && typeof module === 'object')
      module.exports = OGVDecoderAudioVorbisW;
    else if (typeof define === 'function' && define['amd'])
      define([], function() { return OGVDecoderAudioVorbisW; });
    else if (typeof exports === 'object')
      exports["OGVDecoderAudioVorbisW"] = OGVDecoderAudioVorbisW;
    