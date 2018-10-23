var renderer = (function (exports) {
            'use strict';

            var global$1 = (typeof global !== "undefined" ? global :
                        typeof self !== "undefined" ? self :
                        typeof window !== "undefined" ? window : {});

            /*! *****************************************************************************
            Copyright (c) Microsoft Corporation. All rights reserved.
            Licensed under the Apache License, Version 2.0 (the "License"); you may not use
            this file except in compliance with the License. You may obtain a copy of the
            License at http://www.apache.org/licenses/LICENSE-2.0

            THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
            KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
            WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
            MERCHANTABLITY OR NON-INFRINGEMENT.

            See the Apache Version 2.0 License for specific language governing permissions
            and limitations under the License.
            ***************************************************************************** */
            /* global Reflect, Promise */

            var extendStatics = function(d, b) {
                extendStatics = Object.setPrototypeOf ||
                    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
                return extendStatics(d, b);
            };

            function __extends(d, b) {
                extendStatics(d, b);
                function __() { this.constructor = d; }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            }

            function __awaiter(thisArg, _arguments, P, generator) {
                return new (P || (P = Promise))(function (resolve, reject) {
                    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
                    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
                    function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
                    step((generator = generator.apply(thisArg, _arguments || [])).next());
                });
            }

            function __generator(thisArg, body) {
                var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
                return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
                function verb(n) { return function (v) { return step([n, v]); }; }
                function step(op) {
                    if (f) throw new TypeError("Generator is already executing.");
                    while (_) try {
                        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                        if (y = 0, t) op = [op[0] & 2, t.value];
                        switch (op[0]) {
                            case 0: case 1: t = op; break;
                            case 4: _.label++; return { value: op[1], done: false };
                            case 5: _.label++; y = op[1]; op = [0]; continue;
                            case 7: op = _.ops.pop(); _.trys.pop(); continue;
                            default:
                                if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                                if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                                if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                                if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                                if (t[2]) _.ops.pop();
                                _.trys.pop(); continue;
                        }
                        op = body.call(thisArg, _);
                    } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
                    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
                }
            }

            var GLProgram = /** @class */ (function () {
                function GLProgram(gl, program) {
                    this.Attributes = {};
                    this.Uniforms = {};
                    this.UniformsInfo = {};
                    this.UniformBlock = {};
                    this.Program = program;
                    var numAttrs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
                    for (var i = 0; i < numAttrs; i++) {
                        var attrInfo = gl.getActiveAttrib(program, i);
                        if (attrInfo == null)
                            continue;
                        var attrLoca = gl.getAttribLocation(program, attrInfo.name);
                        this.Attributes[attrInfo.name] = attrLoca;
                    }
                    var numUniform = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
                    for (var i = 0; i < numUniform; i++) {
                        var uniformInfo = gl.getActiveUniform(program, i);
                        if (uniformInfo == null)
                            continue;
                        var uname = uniformInfo.name;
                        this.UniformsInfo[uname] = uniformInfo;
                        var uniformLoca = gl.getUniformLocation(program, uname);
                        this.Uniforms[uname] = uniformLoca;
                    }
                    var numublock = gl.getProgramParameter(program, gl.ACTIVE_UNIFORM_BLOCKS);
                    for (var i = 0; i < numublock; i++) {
                        var ublockName = gl.getActiveUniformBlockName(program, i);
                        if (ublockName != null) {
                            this.UniformBlock[ublockName] = i;
                        }
                    }
                }
                GLProgram.prototype.GetUniform = function (key) {
                    return this.Uniforms[key];
                };
                GLProgram.prototype.GetAttribute = function (key) {
                    return this.Attributes[key];
                };
                return GLProgram;
            }());


            (function (GLSL) {
                GLSL[GLSL["vs"] = 0] = "vs";
                GLSL[GLSL["ps"] = 1] = "ps";
                GLSL[GLSL["vec2"] = 2] = "vec2";
                GLSL[GLSL["vec3"] = 3] = "vec3";
                GLSL[GLSL["vec4"] = 4] = "vec4";
                GLSL[GLSL["float"] = 5] = "float";
                GLSL[GLSL["int"] = 6] = "int";
                GLSL[GLSL["sampler2D"] = 7] = "sampler2D";
                GLSL[GLSL["void"] = 8] = "void";
                GLSL[GLSL["in"] = 9] = "in";
                GLSL[GLSL["out"] = 10] = "out";
                GLSL[GLSL["inout"] = 11] = "inout";
                GLSL[GLSL["lowp"] = 12] = "lowp";
                GLSL[GLSL["mediump"] = 13] = "mediump";
                GLSL[GLSL["highp"] = 14] = "highp";
                GLSL[GLSL["mat3"] = 15] = "mat3";
                GLSL[GLSL["mat4"] = 16] = "mat4";
            })(exports.GLSL || (exports.GLSL = {}));
            var GLSL_STRUCT = /** @class */ (function () {
                function GLSL_STRUCT() {
                    this.parameters = [];
                }
                GLSL_STRUCT.prototype.parameter = function (t, name) {
                    this.parameters.push({ type: t, symbol: name });
                };
                GLSL_STRUCT.prototype.mergeCode = function () {
                    var source = "struct " + this.name + " {";
                    this.parameters.forEach(function (p) {
                        source += " " + exports.GLSL[p.type] + " " + p.symbol + ";";
                    });
                    source += '};\n';
                    return source;
                };
                return GLSL_STRUCT;
            }());
            var GLSL_FUNC = /** @class */ (function () {
                function GLSL_FUNC(name) {
                    this.rettype = exports.GLSL.void;
                    this.code = '';
                    this.parameters = [];
                    this.name = name;
                }
                GLSL_FUNC.prototype.line = function () {
                    var code = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        code[_i] = arguments[_i];
                    }
                    var codel = code.join(' ');
                    codel = codel.trim();
                    if (!codel.endsWith(';')) {
                        codel += ';';
                    }
                    codel += '\n';
                    this.code += codel;
                    return this;
                };
                GLSL_FUNC.prototype.params = function (plist) {
                    this.parameters = plist;
                    return this;
                };
                GLSL_FUNC.prototype.parameter = function (t, name, prefix) {
                    this.parameters.push({ type: t, symbol: name, prefix: prefix });
                    return this;
                };
                GLSL_FUNC.prototype.body = function (code) {
                    this.code = code;
                    return this;
                };
                GLSL_FUNC.prototype.ret = function (rettype) {
                    this.rettype = rettype;
                    return this;
                };
                GLSL_FUNC.prototype.mergeCode = function () {
                    var source = exports.GLSL[this.rettype] + " " + this.name + " (";
                    for (var i = 0, len = this.parameters.length; i < len; i++) {
                        var p = this.parameters[i];
                        source += (p.prefix == null ? '' : exports.GLSL[p.prefix]) + " " + exports.GLSL[p.type] + " " + p.symbol;
                        if (i != len - 1)
                            source += ',';
                    }
                    source += '){\n';
                    source += this.code + '}\n';
                    return source;
                };
                return GLSL_FUNC;
            }());
            var GLShaderComposerBase = /** @class */ (function () {
                function GLShaderComposerBase(type) {
                    this.m_attrs = [];
                    this.m_varys = [];
                    this.m_varysStruct = [];
                    this.m_uniform = [];
                    this.m_precisions = [];
                    this.m_main = new GLSL_FUNC('main');
                    this.m_funcs = [];
                    this.m_defines = [];
                    this.m_shadertype = type;
                }
                GLShaderComposerBase.prototype.attr = function (type, sym, prefix) {
                    if (prefix === void 0) { prefix = exports.GLSL.in; }
                    this.m_attrs.push({ symbol: sym, type: type });
                    return this.composer;
                };
                GLShaderComposerBase.prototype.vary = function (type, sym, prefix) {
                    var p = prefix;
                    if (p == null) {
                        p = this.m_shadertype == exports.GLSL.vs ? exports.GLSL.out : exports.GLSL.in;
                    }
                    this.m_varys.push({ type: type, symbol: sym, prefix: p });
                    return this.composer;
                };
                GLShaderComposerBase.prototype.varyStruct = function (s, sym, prefix) {
                    var p = prefix;
                    if (p == null) {
                        p = this.m_shadertype == exports.GLSL.vs ? exports.GLSL.out : exports.GLSL.in;
                    }
                    this.m_varysStruct.push({ type: s.name, symbol: sym, prefix: p });
                    return this.composer;
                };
                GLShaderComposerBase.prototype.uniform = function (type, sym) {
                    this.m_uniform.push({ type: type, symbol: sym });
                    return this.composer;
                };
                GLShaderComposerBase.prototype.attrs = function (attr) {
                    this.m_attrs = this.m_attrs.concat(attr);
                    return this.composer;
                };
                GLShaderComposerBase.prototype.define = function (code) {
                    this.m_defines.push(code);
                    return this.composer;
                };
                GLShaderComposerBase.prototype.struct = function (s) {
                    this.m_defines.push(s.mergeCode());
                    return this.composer;
                };
                GLShaderComposerBase.prototype.main = function (init) {
                    init(this.m_main);
                    return this.composer;
                };
                GLShaderComposerBase.prototype.func = function (name, init) {
                    var f = new GLSL_FUNC(name);
                    init(f);
                    this.m_funcs.push(f);
                    return this.composer;
                };
                GLShaderComposerBase.prototype.precision = function (type, level) {
                    this.m_precisions.push({ type: type, level: level });
                    return this.composer;
                };
                GLShaderComposerBase.prototype.compile = function () {
                    this.mergeShaderSource();
                    return this.m_shaderSource;
                };
                GLShaderComposerBase.prototype.mergeShaderSource = function () {
                    var _this = this;
                    var source = "#version 300 es\n";
                    this.m_precisions.forEach(function (p) {
                        source += "precision " + exports.GLSL[p.level] + " " + exports.GLSL[p.type] + ";\n";
                    });
                    this.m_attrs.forEach(function (a) {
                        source += exports.GLSL[a.prefix == null ? exports.GLSL.in : a.prefix] + " " + exports.GLSL[a.type] + " " + a.symbol + ";\n";
                    });
                    this.m_varys.forEach(function (v) {
                        var prefix = v.prefix == null ? (_this.m_shadertype == exports.GLSL.vs ? exports.GLSL.out : exports.GLSL.in) : v.prefix;
                        var vtype = v.type;
                        var vstr = vtype;
                        if (Number.isInteger(vtype)) {
                            vstr = exports.GLSL[vtype];
                        }
                        source += exports.GLSL[prefix] + " " + vstr + " " + v.symbol + ";\n";
                    });
                    this.m_uniform.forEach(function (u) {
                        source += "uniform " + exports.GLSL[u.type] + " " + u.symbol + ";\n";
                    });
                    this.m_defines.forEach(function (d) {
                        source += d + "\n";
                    });
                    this.m_varysStruct.forEach(function (v) {
                        var prefix = v.prefix == null ? (_this.m_shadertype == exports.GLSL.vs ? exports.GLSL.out : exports.GLSL.in) : v.prefix;
                        var vtype = v.type;
                        var vstr = vtype;
                        if (Number.isInteger(vtype)) {
                            vstr = exports.GLSL[vtype];
                        }
                        source += exports.GLSL[prefix] + " " + vstr + " " + v.symbol + ";\n";
                    });
                    this.m_funcs.forEach(function (f) {
                        source += f.mergeCode();
                    });
                    source += this.m_main.mergeCode();
                    this.m_shaderSource = source;
                };
                GLShaderComposerBase.createStruct = function (structname) {
                    var s = new GLSL_STRUCT();
                    s.name = structname;
                    return s;
                };
                return GLShaderComposerBase;
            }());
            var GLShaderComposer = /** @class */ (function (_super) {
                __extends(GLShaderComposer, _super);
                function GLShaderComposer(type) {
                    var _this = _super.call(this, type) || this;
                    _this.composer = _this;
                    return _this;
                }
                GLShaderComposer.create = function (type) {
                    return new GLShaderComposer(type);
                };
                return GLShaderComposer;
            }(GLShaderComposerBase));

            var GLFrameBuffer = /** @class */ (function () {
                function GLFrameBuffer() {
                    this.m_valid = false;
                }
                GLFrameBuffer.create = function (retain, glctx, colorInternalFormat, depthInternalFormat, width, height, glfb) {
                    var gl = glctx.gl;
                    if (width == null)
                        width = gl.canvas.width;
                    if (height == null)
                        height = gl.canvas.height;
                    if (glfb == null) {
                        glfb = new GLFrameBuffer();
                    }
                    else {
                        if (glfb.isvalid) {
                            glfb.release(glctx);
                        }
                    }
                    var fb = gl.createFramebuffer();
                    if (fb == null)
                        return null;
                    var state = retain ? glctx.savePipeline(gl.FRAMEBUFFER_BINDING, gl.TEXTURE_BINDING_2D) : null;
                    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
                    var colortex = gl.createTexture();
                    gl.bindTexture(gl.TEXTURE_2D, colortex);
                    gl.texStorage2D(gl.TEXTURE_2D, 1, colorInternalFormat, width, height);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    gl.bindTexture(gl.TEXTURE_2D, null);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colortex, 0);
                    var depthTex = null;
                    if (depthInternalFormat != null) {
                        depthTex = gl.createTexture();
                        gl.bindTexture(gl.TEXTURE_2D, depthTex);
                        gl.texStorage2D(gl.TEXTURE_2D, 1, depthInternalFormat, width, height);
                        gl.bindTexture(gl.TEXTURE_2D, null);
                        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTex, 0);
                    }
                    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                    glfb.colorTex0 = colortex;
                    glfb.depthTex0 = depthTex;
                    glfb.frambuffer = fb;
                    glfb.width = width;
                    glfb.height = height;
                    glfb.colorFormat = colorInternalFormat;
                    glfb.depthFormat = depthInternalFormat;
                    if (state != null) {
                        glctx.restorePipeline(state);
                    }
                    glfb.m_valid = true;
                    return glfb;
                };
                GLFrameBuffer.prototype.release = function (glctx) {
                    var gl = glctx.gl;
                    gl.deleteFramebuffer(this.frambuffer);
                    this.frambuffer = null;
                    gl.deleteTexture(this.colorTex0);
                    gl.deleteTexture(this.depthTex0);
                    this.colorTex0 = null;
                    this.depthTex0 = null;
                    this.m_valid = false;
                };
                Object.defineProperty(GLFrameBuffer.prototype, "isvalid", {
                    get: function () {
                        return this.m_valid;
                    },
                    enumerable: true,
                    configurable: true
                });
                GLFrameBuffer.prototype.bind = function (gl) {
                    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frambuffer);
                };
                return GLFrameBuffer;
            }());

            var GLPipelineState = /** @class */ (function () {
                function GLPipelineState(gl) {
                    var type = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        type[_i - 1] = arguments[_i];
                    }
                    this.m_state = [];
                    if (gl == null)
                        return;
                    for (var i = 0, len = type.length; i < len; i++) {
                        var glkey = type[i];
                        var tarobj = gl.getParameter(glkey);
                        this.m_state.push({ type: glkey, data: tarobj });
                    }
                }
                GLPipelineState.prototype.restore = function (gl) {
                    var state = this.m_state;
                    for (var i = 0, len = state.length; i < len; i++) {
                        this.restoreParamter(gl, state[i]);
                    }
                };
                GLPipelineState.prototype.restoreParamter = function (gl, p) {
                    var data = p.data;
                    switch (p.type) {
                        case gl.VIEWPORT:
                            gl.viewport(data[0], data[1], data[2], data[3]);
                            break;
                        case gl.COLOR_CLEAR_VALUE:
                            gl.clearColor(data[0], data[1], data[2], data[3]);
                            break;
                        case gl.DEPTH_CLEAR_VALUE:
                            gl.clearDepth(data);
                            break;
                        case gl.STENCIL_CLEAR_VALUE:
                            gl.clearStencil(data);
                            break;
                        case gl.TEXTURE_BINDING_2D:
                            gl.bindTexture(gl.TEXTURE_2D, data);
                            break;
                        case gl.FRAMEBUFFER_BINDING:
                            gl.bindFramebuffer(gl.FRAMEBUFFER, data);
                            break;
                        case gl.ARRAY_BUFFER_BINDING:
                            gl.bindBuffer(gl.ARRAY_BUFFER, data);
                            break;
                        case gl.ELEMENT_ARRAY_BUFFER:
                            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, data);
                            break;
                        case gl.CULL_FACE:
                            if (data) {
                                gl.enable(gl.CULL_FACE);
                            }
                            else {
                                gl.disable(gl.CULL_FACE);
                            }
                            break;
                    }
                };
                return GLPipelineState;
            }());

            var global$1$1 = (typeof global$1 !== "undefined" ? global$1 :
                        typeof self !== "undefined" ? self :
                        typeof window !== "undefined" ? window : {});

            var lookup = [];
            var revLookup = [];
            var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
            var inited = false;
            function init () {
              inited = true;
              var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
              for (var i = 0, len = code.length; i < len; ++i) {
                lookup[i] = code[i];
                revLookup[code.charCodeAt(i)] = i;
              }

              revLookup['-'.charCodeAt(0)] = 62;
              revLookup['_'.charCodeAt(0)] = 63;
            }

            function toByteArray (b64) {
              if (!inited) {
                init();
              }
              var i, j, l, tmp, placeHolders, arr;
              var len = b64.length;

              if (len % 4 > 0) {
                throw new Error('Invalid string. Length must be a multiple of 4')
              }

              // the number of equal signs (place holders)
              // if there are two placeholders, than the two characters before it
              // represent one byte
              // if there is only one, then the three characters before it represent 2 bytes
              // this is just a cheap hack to not do indexOf twice
              placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

              // base64 is 4/3 + up to two characters of the original data
              arr = new Arr(len * 3 / 4 - placeHolders);

              // if there are placeholders, only get up to the last complete 4 chars
              l = placeHolders > 0 ? len - 4 : len;

              var L = 0;

              for (i = 0, j = 0; i < l; i += 4, j += 3) {
                tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
                arr[L++] = (tmp >> 16) & 0xFF;
                arr[L++] = (tmp >> 8) & 0xFF;
                arr[L++] = tmp & 0xFF;
              }

              if (placeHolders === 2) {
                tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
                arr[L++] = tmp & 0xFF;
              } else if (placeHolders === 1) {
                tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
                arr[L++] = (tmp >> 8) & 0xFF;
                arr[L++] = tmp & 0xFF;
              }

              return arr
            }

            function tripletToBase64 (num) {
              return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
            }

            function encodeChunk (uint8, start, end) {
              var tmp;
              var output = [];
              for (var i = start; i < end; i += 3) {
                tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
                output.push(tripletToBase64(tmp));
              }
              return output.join('')
            }

            function fromByteArray (uint8) {
              if (!inited) {
                init();
              }
              var tmp;
              var len = uint8.length;
              var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
              var output = '';
              var parts = [];
              var maxChunkLength = 16383; // must be multiple of 3

              // go through the array every three bytes, we'll deal with trailing stuff later
              for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
                parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
              }

              // pad the end with zeros, but make sure to not forget the extra bytes
              if (extraBytes === 1) {
                tmp = uint8[len - 1];
                output += lookup[tmp >> 2];
                output += lookup[(tmp << 4) & 0x3F];
                output += '==';
              } else if (extraBytes === 2) {
                tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
                output += lookup[tmp >> 10];
                output += lookup[(tmp >> 4) & 0x3F];
                output += lookup[(tmp << 2) & 0x3F];
                output += '=';
              }

              parts.push(output);

              return parts.join('')
            }

            function read (buffer, offset, isLE, mLen, nBytes) {
              var e, m;
              var eLen = nBytes * 8 - mLen - 1;
              var eMax = (1 << eLen) - 1;
              var eBias = eMax >> 1;
              var nBits = -7;
              var i = isLE ? (nBytes - 1) : 0;
              var d = isLE ? -1 : 1;
              var s = buffer[offset + i];

              i += d;

              e = s & ((1 << (-nBits)) - 1);
              s >>= (-nBits);
              nBits += eLen;
              for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

              m = e & ((1 << (-nBits)) - 1);
              e >>= (-nBits);
              nBits += mLen;
              for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

              if (e === 0) {
                e = 1 - eBias;
              } else if (e === eMax) {
                return m ? NaN : ((s ? -1 : 1) * Infinity)
              } else {
                m = m + Math.pow(2, mLen);
                e = e - eBias;
              }
              return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
            }

            function write (buffer, value, offset, isLE, mLen, nBytes) {
              var e, m, c;
              var eLen = nBytes * 8 - mLen - 1;
              var eMax = (1 << eLen) - 1;
              var eBias = eMax >> 1;
              var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
              var i = isLE ? 0 : (nBytes - 1);
              var d = isLE ? 1 : -1;
              var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

              value = Math.abs(value);

              if (isNaN(value) || value === Infinity) {
                m = isNaN(value) ? 1 : 0;
                e = eMax;
              } else {
                e = Math.floor(Math.log(value) / Math.LN2);
                if (value * (c = Math.pow(2, -e)) < 1) {
                  e--;
                  c *= 2;
                }
                if (e + eBias >= 1) {
                  value += rt / c;
                } else {
                  value += rt * Math.pow(2, 1 - eBias);
                }
                if (value * c >= 2) {
                  e++;
                  c /= 2;
                }

                if (e + eBias >= eMax) {
                  m = 0;
                  e = eMax;
                } else if (e + eBias >= 1) {
                  m = (value * c - 1) * Math.pow(2, mLen);
                  e = e + eBias;
                } else {
                  m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
                  e = 0;
                }
              }

              for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

              e = (e << mLen) | m;
              eLen += mLen;
              for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

              buffer[offset + i - d] |= s * 128;
            }

            var toString = {}.toString;

            var isArray = Array.isArray || function (arr) {
              return toString.call(arr) == '[object Array]';
            };

            var INSPECT_MAX_BYTES = 50;

            /**
             * If `Buffer.TYPED_ARRAY_SUPPORT`:
             *   === true    Use Uint8Array implementation (fastest)
             *   === false   Use Object implementation (most compatible, even IE6)
             *
             * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
             * Opera 11.6+, iOS 4.2+.
             *
             * Due to various browser bugs, sometimes the Object implementation will be used even
             * when the browser supports typed arrays.
             *
             * Note:
             *
             *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
             *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
             *
             *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
             *
             *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
             *     incorrect length in some situations.

             * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
             * get the Object implementation, which is slower but behaves correctly.
             */
            Buffer.TYPED_ARRAY_SUPPORT = global$1$1.TYPED_ARRAY_SUPPORT !== undefined
              ? global$1$1.TYPED_ARRAY_SUPPORT
              : true;

            function kMaxLength () {
              return Buffer.TYPED_ARRAY_SUPPORT
                ? 0x7fffffff
                : 0x3fffffff
            }

            function createBuffer (that, length) {
              if (kMaxLength() < length) {
                throw new RangeError('Invalid typed array length')
              }
              if (Buffer.TYPED_ARRAY_SUPPORT) {
                // Return an augmented `Uint8Array` instance, for best performance
                that = new Uint8Array(length);
                that.__proto__ = Buffer.prototype;
              } else {
                // Fallback: Return an object instance of the Buffer class
                if (that === null) {
                  that = new Buffer(length);
                }
                that.length = length;
              }

              return that
            }

            /**
             * The Buffer constructor returns instances of `Uint8Array` that have their
             * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
             * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
             * and the `Uint8Array` methods. Square bracket notation works as expected -- it
             * returns a single octet.
             *
             * The `Uint8Array` prototype remains unmodified.
             */

            function Buffer (arg, encodingOrOffset, length) {
              if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
                return new Buffer(arg, encodingOrOffset, length)
              }

              // Common case.
              if (typeof arg === 'number') {
                if (typeof encodingOrOffset === 'string') {
                  throw new Error(
                    'If encoding is specified then the first argument must be a string'
                  )
                }
                return allocUnsafe(this, arg)
              }
              return from(this, arg, encodingOrOffset, length)
            }

            Buffer.poolSize = 8192; // not used by this implementation

            // TODO: Legacy, not needed anymore. Remove in next major version.
            Buffer._augment = function (arr) {
              arr.__proto__ = Buffer.prototype;
              return arr
            };

            function from (that, value, encodingOrOffset, length) {
              if (typeof value === 'number') {
                throw new TypeError('"value" argument must not be a number')
              }

              if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
                return fromArrayBuffer(that, value, encodingOrOffset, length)
              }

              if (typeof value === 'string') {
                return fromString(that, value, encodingOrOffset)
              }

              return fromObject(that, value)
            }

            /**
             * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
             * if value is a number.
             * Buffer.from(str[, encoding])
             * Buffer.from(array)
             * Buffer.from(buffer)
             * Buffer.from(arrayBuffer[, byteOffset[, length]])
             **/
            Buffer.from = function (value, encodingOrOffset, length) {
              return from(null, value, encodingOrOffset, length)
            };

            if (Buffer.TYPED_ARRAY_SUPPORT) {
              Buffer.prototype.__proto__ = Uint8Array.prototype;
              Buffer.__proto__ = Uint8Array;
            }

            function assertSize (size) {
              if (typeof size !== 'number') {
                throw new TypeError('"size" argument must be a number')
              } else if (size < 0) {
                throw new RangeError('"size" argument must not be negative')
              }
            }

            function alloc (that, size, fill, encoding) {
              assertSize(size);
              if (size <= 0) {
                return createBuffer(that, size)
              }
              if (fill !== undefined) {
                // Only pay attention to encoding if it's a string. This
                // prevents accidentally sending in a number that would
                // be interpretted as a start offset.
                return typeof encoding === 'string'
                  ? createBuffer(that, size).fill(fill, encoding)
                  : createBuffer(that, size).fill(fill)
              }
              return createBuffer(that, size)
            }

            /**
             * Creates a new filled Buffer instance.
             * alloc(size[, fill[, encoding]])
             **/
            Buffer.alloc = function (size, fill, encoding) {
              return alloc(null, size, fill, encoding)
            };

            function allocUnsafe (that, size) {
              assertSize(size);
              that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
              if (!Buffer.TYPED_ARRAY_SUPPORT) {
                for (var i = 0; i < size; ++i) {
                  that[i] = 0;
                }
              }
              return that
            }

            /**
             * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
             * */
            Buffer.allocUnsafe = function (size) {
              return allocUnsafe(null, size)
            };
            /**
             * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
             */
            Buffer.allocUnsafeSlow = function (size) {
              return allocUnsafe(null, size)
            };

            function fromString (that, string, encoding) {
              if (typeof encoding !== 'string' || encoding === '') {
                encoding = 'utf8';
              }

              if (!Buffer.isEncoding(encoding)) {
                throw new TypeError('"encoding" must be a valid string encoding')
              }

              var length = byteLength(string, encoding) | 0;
              that = createBuffer(that, length);

              var actual = that.write(string, encoding);

              if (actual !== length) {
                // Writing a hex string, for example, that contains invalid characters will
                // cause everything after the first invalid character to be ignored. (e.g.
                // 'abxxcd' will be treated as 'ab')
                that = that.slice(0, actual);
              }

              return that
            }

            function fromArrayLike (that, array) {
              var length = array.length < 0 ? 0 : checked(array.length) | 0;
              that = createBuffer(that, length);
              for (var i = 0; i < length; i += 1) {
                that[i] = array[i] & 255;
              }
              return that
            }

            function fromArrayBuffer (that, array, byteOffset, length) {
              array.byteLength; // this throws if `array` is not a valid ArrayBuffer

              if (byteOffset < 0 || array.byteLength < byteOffset) {
                throw new RangeError('\'offset\' is out of bounds')
              }

              if (array.byteLength < byteOffset + (length || 0)) {
                throw new RangeError('\'length\' is out of bounds')
              }

              if (byteOffset === undefined && length === undefined) {
                array = new Uint8Array(array);
              } else if (length === undefined) {
                array = new Uint8Array(array, byteOffset);
              } else {
                array = new Uint8Array(array, byteOffset, length);
              }

              if (Buffer.TYPED_ARRAY_SUPPORT) {
                // Return an augmented `Uint8Array` instance, for best performance
                that = array;
                that.__proto__ = Buffer.prototype;
              } else {
                // Fallback: Return an object instance of the Buffer class
                that = fromArrayLike(that, array);
              }
              return that
            }

            function fromObject (that, obj) {
              if (internalIsBuffer(obj)) {
                var len = checked(obj.length) | 0;
                that = createBuffer(that, len);

                if (that.length === 0) {
                  return that
                }

                obj.copy(that, 0, 0, len);
                return that
              }

              if (obj) {
                if ((typeof ArrayBuffer !== 'undefined' &&
                    obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
                  if (typeof obj.length !== 'number' || isnan(obj.length)) {
                    return createBuffer(that, 0)
                  }
                  return fromArrayLike(that, obj)
                }

                if (obj.type === 'Buffer' && isArray(obj.data)) {
                  return fromArrayLike(that, obj.data)
                }
              }

              throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
            }

            function checked (length) {
              // Note: cannot use `length < kMaxLength()` here because that fails when
              // length is NaN (which is otherwise coerced to zero.)
              if (length >= kMaxLength()) {
                throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                                     'size: 0x' + kMaxLength().toString(16) + ' bytes')
              }
              return length | 0
            }
            Buffer.isBuffer = isBuffer;
            function internalIsBuffer (b) {
              return !!(b != null && b._isBuffer)
            }

            Buffer.compare = function compare (a, b) {
              if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
                throw new TypeError('Arguments must be Buffers')
              }

              if (a === b) return 0

              var x = a.length;
              var y = b.length;

              for (var i = 0, len = Math.min(x, y); i < len; ++i) {
                if (a[i] !== b[i]) {
                  x = a[i];
                  y = b[i];
                  break
                }
              }

              if (x < y) return -1
              if (y < x) return 1
              return 0
            };

            Buffer.isEncoding = function isEncoding (encoding) {
              switch (String(encoding).toLowerCase()) {
                case 'hex':
                case 'utf8':
                case 'utf-8':
                case 'ascii':
                case 'latin1':
                case 'binary':
                case 'base64':
                case 'ucs2':
                case 'ucs-2':
                case 'utf16le':
                case 'utf-16le':
                  return true
                default:
                  return false
              }
            };

            Buffer.concat = function concat (list, length) {
              if (!isArray(list)) {
                throw new TypeError('"list" argument must be an Array of Buffers')
              }

              if (list.length === 0) {
                return Buffer.alloc(0)
              }

              var i;
              if (length === undefined) {
                length = 0;
                for (i = 0; i < list.length; ++i) {
                  length += list[i].length;
                }
              }

              var buffer = Buffer.allocUnsafe(length);
              var pos = 0;
              for (i = 0; i < list.length; ++i) {
                var buf = list[i];
                if (!internalIsBuffer(buf)) {
                  throw new TypeError('"list" argument must be an Array of Buffers')
                }
                buf.copy(buffer, pos);
                pos += buf.length;
              }
              return buffer
            };

            function byteLength (string, encoding) {
              if (internalIsBuffer(string)) {
                return string.length
              }
              if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
                  (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
                return string.byteLength
              }
              if (typeof string !== 'string') {
                string = '' + string;
              }

              var len = string.length;
              if (len === 0) return 0

              // Use a for loop to avoid recursion
              var loweredCase = false;
              for (;;) {
                switch (encoding) {
                  case 'ascii':
                  case 'latin1':
                  case 'binary':
                    return len
                  case 'utf8':
                  case 'utf-8':
                  case undefined:
                    return utf8ToBytes(string).length
                  case 'ucs2':
                  case 'ucs-2':
                  case 'utf16le':
                  case 'utf-16le':
                    return len * 2
                  case 'hex':
                    return len >>> 1
                  case 'base64':
                    return base64ToBytes(string).length
                  default:
                    if (loweredCase) return utf8ToBytes(string).length // assume utf8
                    encoding = ('' + encoding).toLowerCase();
                    loweredCase = true;
                }
              }
            }
            Buffer.byteLength = byteLength;

            function slowToString (encoding, start, end) {
              var loweredCase = false;

              // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
              // property of a typed array.

              // This behaves neither like String nor Uint8Array in that we set start/end
              // to their upper/lower bounds if the value passed is out of range.
              // undefined is handled specially as per ECMA-262 6th Edition,
              // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
              if (start === undefined || start < 0) {
                start = 0;
              }
              // Return early if start > this.length. Done here to prevent potential uint32
              // coercion fail below.
              if (start > this.length) {
                return ''
              }

              if (end === undefined || end > this.length) {
                end = this.length;
              }

              if (end <= 0) {
                return ''
              }

              // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
              end >>>= 0;
              start >>>= 0;

              if (end <= start) {
                return ''
              }

              if (!encoding) encoding = 'utf8';

              while (true) {
                switch (encoding) {
                  case 'hex':
                    return hexSlice(this, start, end)

                  case 'utf8':
                  case 'utf-8':
                    return utf8Slice(this, start, end)

                  case 'ascii':
                    return asciiSlice(this, start, end)

                  case 'latin1':
                  case 'binary':
                    return latin1Slice(this, start, end)

                  case 'base64':
                    return base64Slice(this, start, end)

                  case 'ucs2':
                  case 'ucs-2':
                  case 'utf16le':
                  case 'utf-16le':
                    return utf16leSlice(this, start, end)

                  default:
                    if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
                    encoding = (encoding + '').toLowerCase();
                    loweredCase = true;
                }
              }
            }

            // The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
            // Buffer instances.
            Buffer.prototype._isBuffer = true;

            function swap (b, n, m) {
              var i = b[n];
              b[n] = b[m];
              b[m] = i;
            }

            Buffer.prototype.swap16 = function swap16 () {
              var len = this.length;
              if (len % 2 !== 0) {
                throw new RangeError('Buffer size must be a multiple of 16-bits')
              }
              for (var i = 0; i < len; i += 2) {
                swap(this, i, i + 1);
              }
              return this
            };

            Buffer.prototype.swap32 = function swap32 () {
              var len = this.length;
              if (len % 4 !== 0) {
                throw new RangeError('Buffer size must be a multiple of 32-bits')
              }
              for (var i = 0; i < len; i += 4) {
                swap(this, i, i + 3);
                swap(this, i + 1, i + 2);
              }
              return this
            };

            Buffer.prototype.swap64 = function swap64 () {
              var len = this.length;
              if (len % 8 !== 0) {
                throw new RangeError('Buffer size must be a multiple of 64-bits')
              }
              for (var i = 0; i < len; i += 8) {
                swap(this, i, i + 7);
                swap(this, i + 1, i + 6);
                swap(this, i + 2, i + 5);
                swap(this, i + 3, i + 4);
              }
              return this
            };

            Buffer.prototype.toString = function toString () {
              var length = this.length | 0;
              if (length === 0) return ''
              if (arguments.length === 0) return utf8Slice(this, 0, length)
              return slowToString.apply(this, arguments)
            };

            Buffer.prototype.equals = function equals (b) {
              if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer')
              if (this === b) return true
              return Buffer.compare(this, b) === 0
            };

            Buffer.prototype.inspect = function inspect () {
              var str = '';
              var max = INSPECT_MAX_BYTES;
              if (this.length > 0) {
                str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
                if (this.length > max) str += ' ... ';
              }
              return '<Buffer ' + str + '>'
            };

            Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
              if (!internalIsBuffer(target)) {
                throw new TypeError('Argument must be a Buffer')
              }

              if (start === undefined) {
                start = 0;
              }
              if (end === undefined) {
                end = target ? target.length : 0;
              }
              if (thisStart === undefined) {
                thisStart = 0;
              }
              if (thisEnd === undefined) {
                thisEnd = this.length;
              }

              if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
                throw new RangeError('out of range index')
              }

              if (thisStart >= thisEnd && start >= end) {
                return 0
              }
              if (thisStart >= thisEnd) {
                return -1
              }
              if (start >= end) {
                return 1
              }

              start >>>= 0;
              end >>>= 0;
              thisStart >>>= 0;
              thisEnd >>>= 0;

              if (this === target) return 0

              var x = thisEnd - thisStart;
              var y = end - start;
              var len = Math.min(x, y);

              var thisCopy = this.slice(thisStart, thisEnd);
              var targetCopy = target.slice(start, end);

              for (var i = 0; i < len; ++i) {
                if (thisCopy[i] !== targetCopy[i]) {
                  x = thisCopy[i];
                  y = targetCopy[i];
                  break
                }
              }

              if (x < y) return -1
              if (y < x) return 1
              return 0
            };

            // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
            // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
            //
            // Arguments:
            // - buffer - a Buffer to search
            // - val - a string, Buffer, or number
            // - byteOffset - an index into `buffer`; will be clamped to an int32
            // - encoding - an optional encoding, relevant is val is a string
            // - dir - true for indexOf, false for lastIndexOf
            function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
              // Empty buffer means no match
              if (buffer.length === 0) return -1

              // Normalize byteOffset
              if (typeof byteOffset === 'string') {
                encoding = byteOffset;
                byteOffset = 0;
              } else if (byteOffset > 0x7fffffff) {
                byteOffset = 0x7fffffff;
              } else if (byteOffset < -0x80000000) {
                byteOffset = -0x80000000;
              }
              byteOffset = +byteOffset;  // Coerce to Number.
              if (isNaN(byteOffset)) {
                // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
                byteOffset = dir ? 0 : (buffer.length - 1);
              }

              // Normalize byteOffset: negative offsets start from the end of the buffer
              if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
              if (byteOffset >= buffer.length) {
                if (dir) return -1
                else byteOffset = buffer.length - 1;
              } else if (byteOffset < 0) {
                if (dir) byteOffset = 0;
                else return -1
              }

              // Normalize val
              if (typeof val === 'string') {
                val = Buffer.from(val, encoding);
              }

              // Finally, search either indexOf (if dir is true) or lastIndexOf
              if (internalIsBuffer(val)) {
                // Special case: looking for empty string/buffer always fails
                if (val.length === 0) {
                  return -1
                }
                return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
              } else if (typeof val === 'number') {
                val = val & 0xFF; // Search for a byte value [0-255]
                if (Buffer.TYPED_ARRAY_SUPPORT &&
                    typeof Uint8Array.prototype.indexOf === 'function') {
                  if (dir) {
                    return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
                  } else {
                    return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
                  }
                }
                return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
              }

              throw new TypeError('val must be string, number or Buffer')
            }

            function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
              var indexSize = 1;
              var arrLength = arr.length;
              var valLength = val.length;

              if (encoding !== undefined) {
                encoding = String(encoding).toLowerCase();
                if (encoding === 'ucs2' || encoding === 'ucs-2' ||
                    encoding === 'utf16le' || encoding === 'utf-16le') {
                  if (arr.length < 2 || val.length < 2) {
                    return -1
                  }
                  indexSize = 2;
                  arrLength /= 2;
                  valLength /= 2;
                  byteOffset /= 2;
                }
              }

              function read$$1 (buf, i) {
                if (indexSize === 1) {
                  return buf[i]
                } else {
                  return buf.readUInt16BE(i * indexSize)
                }
              }

              var i;
              if (dir) {
                var foundIndex = -1;
                for (i = byteOffset; i < arrLength; i++) {
                  if (read$$1(arr, i) === read$$1(val, foundIndex === -1 ? 0 : i - foundIndex)) {
                    if (foundIndex === -1) foundIndex = i;
                    if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
                  } else {
                    if (foundIndex !== -1) i -= i - foundIndex;
                    foundIndex = -1;
                  }
                }
              } else {
                if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
                for (i = byteOffset; i >= 0; i--) {
                  var found = true;
                  for (var j = 0; j < valLength; j++) {
                    if (read$$1(arr, i + j) !== read$$1(val, j)) {
                      found = false;
                      break
                    }
                  }
                  if (found) return i
                }
              }

              return -1
            }

            Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
              return this.indexOf(val, byteOffset, encoding) !== -1
            };

            Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
              return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
            };

            Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
              return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
            };

            function hexWrite (buf, string, offset, length) {
              offset = Number(offset) || 0;
              var remaining = buf.length - offset;
              if (!length) {
                length = remaining;
              } else {
                length = Number(length);
                if (length > remaining) {
                  length = remaining;
                }
              }

              // must be an even number of digits
              var strLen = string.length;
              if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

              if (length > strLen / 2) {
                length = strLen / 2;
              }
              for (var i = 0; i < length; ++i) {
                var parsed = parseInt(string.substr(i * 2, 2), 16);
                if (isNaN(parsed)) return i
                buf[offset + i] = parsed;
              }
              return i
            }

            function utf8Write (buf, string, offset, length) {
              return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
            }

            function asciiWrite (buf, string, offset, length) {
              return blitBuffer(asciiToBytes(string), buf, offset, length)
            }

            function latin1Write (buf, string, offset, length) {
              return asciiWrite(buf, string, offset, length)
            }

            function base64Write (buf, string, offset, length) {
              return blitBuffer(base64ToBytes(string), buf, offset, length)
            }

            function ucs2Write (buf, string, offset, length) {
              return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
            }

            Buffer.prototype.write = function write$$1 (string, offset, length, encoding) {
              // Buffer#write(string)
              if (offset === undefined) {
                encoding = 'utf8';
                length = this.length;
                offset = 0;
              // Buffer#write(string, encoding)
              } else if (length === undefined && typeof offset === 'string') {
                encoding = offset;
                length = this.length;
                offset = 0;
              // Buffer#write(string, offset[, length][, encoding])
              } else if (isFinite(offset)) {
                offset = offset | 0;
                if (isFinite(length)) {
                  length = length | 0;
                  if (encoding === undefined) encoding = 'utf8';
                } else {
                  encoding = length;
                  length = undefined;
                }
              // legacy write(string, encoding, offset, length) - remove in v0.13
              } else {
                throw new Error(
                  'Buffer.write(string, encoding, offset[, length]) is no longer supported'
                )
              }

              var remaining = this.length - offset;
              if (length === undefined || length > remaining) length = remaining;

              if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
                throw new RangeError('Attempt to write outside buffer bounds')
              }

              if (!encoding) encoding = 'utf8';

              var loweredCase = false;
              for (;;) {
                switch (encoding) {
                  case 'hex':
                    return hexWrite(this, string, offset, length)

                  case 'utf8':
                  case 'utf-8':
                    return utf8Write(this, string, offset, length)

                  case 'ascii':
                    return asciiWrite(this, string, offset, length)

                  case 'latin1':
                  case 'binary':
                    return latin1Write(this, string, offset, length)

                  case 'base64':
                    // Warning: maxLength not taken into account in base64Write
                    return base64Write(this, string, offset, length)

                  case 'ucs2':
                  case 'ucs-2':
                  case 'utf16le':
                  case 'utf-16le':
                    return ucs2Write(this, string, offset, length)

                  default:
                    if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
                    encoding = ('' + encoding).toLowerCase();
                    loweredCase = true;
                }
              }
            };

            Buffer.prototype.toJSON = function toJSON () {
              return {
                type: 'Buffer',
                data: Array.prototype.slice.call(this._arr || this, 0)
              }
            };

            function base64Slice (buf, start, end) {
              if (start === 0 && end === buf.length) {
                return fromByteArray(buf)
              } else {
                return fromByteArray(buf.slice(start, end))
              }
            }

            function utf8Slice (buf, start, end) {
              end = Math.min(buf.length, end);
              var res = [];

              var i = start;
              while (i < end) {
                var firstByte = buf[i];
                var codePoint = null;
                var bytesPerSequence = (firstByte > 0xEF) ? 4
                  : (firstByte > 0xDF) ? 3
                  : (firstByte > 0xBF) ? 2
                  : 1;

                if (i + bytesPerSequence <= end) {
                  var secondByte, thirdByte, fourthByte, tempCodePoint;

                  switch (bytesPerSequence) {
                    case 1:
                      if (firstByte < 0x80) {
                        codePoint = firstByte;
                      }
                      break
                    case 2:
                      secondByte = buf[i + 1];
                      if ((secondByte & 0xC0) === 0x80) {
                        tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
                        if (tempCodePoint > 0x7F) {
                          codePoint = tempCodePoint;
                        }
                      }
                      break
                    case 3:
                      secondByte = buf[i + 1];
                      thirdByte = buf[i + 2];
                      if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
                        tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
                        if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                          codePoint = tempCodePoint;
                        }
                      }
                      break
                    case 4:
                      secondByte = buf[i + 1];
                      thirdByte = buf[i + 2];
                      fourthByte = buf[i + 3];
                      if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
                        tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
                        if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                          codePoint = tempCodePoint;
                        }
                      }
                  }
                }

                if (codePoint === null) {
                  // we did not generate a valid codePoint so insert a
                  // replacement char (U+FFFD) and advance only 1 byte
                  codePoint = 0xFFFD;
                  bytesPerSequence = 1;
                } else if (codePoint > 0xFFFF) {
                  // encode to utf16 (surrogate pair dance)
                  codePoint -= 0x10000;
                  res.push(codePoint >>> 10 & 0x3FF | 0xD800);
                  codePoint = 0xDC00 | codePoint & 0x3FF;
                }

                res.push(codePoint);
                i += bytesPerSequence;
              }

              return decodeCodePointsArray(res)
            }

            // Based on http://stackoverflow.com/a/22747272/680742, the browser with
            // the lowest limit is Chrome, with 0x10000 args.
            // We go 1 magnitude less, for safety
            var MAX_ARGUMENTS_LENGTH = 0x1000;

            function decodeCodePointsArray (codePoints) {
              var len = codePoints.length;
              if (len <= MAX_ARGUMENTS_LENGTH) {
                return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
              }

              // Decode in chunks to avoid "call stack size exceeded".
              var res = '';
              var i = 0;
              while (i < len) {
                res += String.fromCharCode.apply(
                  String,
                  codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
                );
              }
              return res
            }

            function asciiSlice (buf, start, end) {
              var ret = '';
              end = Math.min(buf.length, end);

              for (var i = start; i < end; ++i) {
                ret += String.fromCharCode(buf[i] & 0x7F);
              }
              return ret
            }

            function latin1Slice (buf, start, end) {
              var ret = '';
              end = Math.min(buf.length, end);

              for (var i = start; i < end; ++i) {
                ret += String.fromCharCode(buf[i]);
              }
              return ret
            }

            function hexSlice (buf, start, end) {
              var len = buf.length;

              if (!start || start < 0) start = 0;
              if (!end || end < 0 || end > len) end = len;

              var out = '';
              for (var i = start; i < end; ++i) {
                out += toHex(buf[i]);
              }
              return out
            }

            function utf16leSlice (buf, start, end) {
              var bytes = buf.slice(start, end);
              var res = '';
              for (var i = 0; i < bytes.length; i += 2) {
                res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
              }
              return res
            }

            Buffer.prototype.slice = function slice (start, end) {
              var len = this.length;
              start = ~~start;
              end = end === undefined ? len : ~~end;

              if (start < 0) {
                start += len;
                if (start < 0) start = 0;
              } else if (start > len) {
                start = len;
              }

              if (end < 0) {
                end += len;
                if (end < 0) end = 0;
              } else if (end > len) {
                end = len;
              }

              if (end < start) end = start;

              var newBuf;
              if (Buffer.TYPED_ARRAY_SUPPORT) {
                newBuf = this.subarray(start, end);
                newBuf.__proto__ = Buffer.prototype;
              } else {
                var sliceLen = end - start;
                newBuf = new Buffer(sliceLen, undefined);
                for (var i = 0; i < sliceLen; ++i) {
                  newBuf[i] = this[i + start];
                }
              }

              return newBuf
            };

            /*
             * Need to make sure that buffer isn't trying to write out of bounds.
             */
            function checkOffset (offset, ext, length) {
              if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
              if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
            }

            Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
              offset = offset | 0;
              byteLength = byteLength | 0;
              if (!noAssert) checkOffset(offset, byteLength, this.length);

              var val = this[offset];
              var mul = 1;
              var i = 0;
              while (++i < byteLength && (mul *= 0x100)) {
                val += this[offset + i] * mul;
              }

              return val
            };

            Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
              offset = offset | 0;
              byteLength = byteLength | 0;
              if (!noAssert) {
                checkOffset(offset, byteLength, this.length);
              }

              var val = this[offset + --byteLength];
              var mul = 1;
              while (byteLength > 0 && (mul *= 0x100)) {
                val += this[offset + --byteLength] * mul;
              }

              return val
            };

            Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
              if (!noAssert) checkOffset(offset, 1, this.length);
              return this[offset]
            };

            Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
              if (!noAssert) checkOffset(offset, 2, this.length);
              return this[offset] | (this[offset + 1] << 8)
            };

            Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
              if (!noAssert) checkOffset(offset, 2, this.length);
              return (this[offset] << 8) | this[offset + 1]
            };

            Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
              if (!noAssert) checkOffset(offset, 4, this.length);

              return ((this[offset]) |
                  (this[offset + 1] << 8) |
                  (this[offset + 2] << 16)) +
                  (this[offset + 3] * 0x1000000)
            };

            Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
              if (!noAssert) checkOffset(offset, 4, this.length);

              return (this[offset] * 0x1000000) +
                ((this[offset + 1] << 16) |
                (this[offset + 2] << 8) |
                this[offset + 3])
            };

            Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
              offset = offset | 0;
              byteLength = byteLength | 0;
              if (!noAssert) checkOffset(offset, byteLength, this.length);

              var val = this[offset];
              var mul = 1;
              var i = 0;
              while (++i < byteLength && (mul *= 0x100)) {
                val += this[offset + i] * mul;
              }
              mul *= 0x80;

              if (val >= mul) val -= Math.pow(2, 8 * byteLength);

              return val
            };

            Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
              offset = offset | 0;
              byteLength = byteLength | 0;
              if (!noAssert) checkOffset(offset, byteLength, this.length);

              var i = byteLength;
              var mul = 1;
              var val = this[offset + --i];
              while (i > 0 && (mul *= 0x100)) {
                val += this[offset + --i] * mul;
              }
              mul *= 0x80;

              if (val >= mul) val -= Math.pow(2, 8 * byteLength);

              return val
            };

            Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
              if (!noAssert) checkOffset(offset, 1, this.length);
              if (!(this[offset] & 0x80)) return (this[offset])
              return ((0xff - this[offset] + 1) * -1)
            };

            Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
              if (!noAssert) checkOffset(offset, 2, this.length);
              var val = this[offset] | (this[offset + 1] << 8);
              return (val & 0x8000) ? val | 0xFFFF0000 : val
            };

            Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
              if (!noAssert) checkOffset(offset, 2, this.length);
              var val = this[offset + 1] | (this[offset] << 8);
              return (val & 0x8000) ? val | 0xFFFF0000 : val
            };

            Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
              if (!noAssert) checkOffset(offset, 4, this.length);

              return (this[offset]) |
                (this[offset + 1] << 8) |
                (this[offset + 2] << 16) |
                (this[offset + 3] << 24)
            };

            Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
              if (!noAssert) checkOffset(offset, 4, this.length);

              return (this[offset] << 24) |
                (this[offset + 1] << 16) |
                (this[offset + 2] << 8) |
                (this[offset + 3])
            };

            Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
              if (!noAssert) checkOffset(offset, 4, this.length);
              return read(this, offset, true, 23, 4)
            };

            Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
              if (!noAssert) checkOffset(offset, 4, this.length);
              return read(this, offset, false, 23, 4)
            };

            Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
              if (!noAssert) checkOffset(offset, 8, this.length);
              return read(this, offset, true, 52, 8)
            };

            Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
              if (!noAssert) checkOffset(offset, 8, this.length);
              return read(this, offset, false, 52, 8)
            };

            function checkInt (buf, value, offset, ext, max, min) {
              if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
              if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
              if (offset + ext > buf.length) throw new RangeError('Index out of range')
            }

            Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
              value = +value;
              offset = offset | 0;
              byteLength = byteLength | 0;
              if (!noAssert) {
                var maxBytes = Math.pow(2, 8 * byteLength) - 1;
                checkInt(this, value, offset, byteLength, maxBytes, 0);
              }

              var mul = 1;
              var i = 0;
              this[offset] = value & 0xFF;
              while (++i < byteLength && (mul *= 0x100)) {
                this[offset + i] = (value / mul) & 0xFF;
              }

              return offset + byteLength
            };

            Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
              value = +value;
              offset = offset | 0;
              byteLength = byteLength | 0;
              if (!noAssert) {
                var maxBytes = Math.pow(2, 8 * byteLength) - 1;
                checkInt(this, value, offset, byteLength, maxBytes, 0);
              }

              var i = byteLength - 1;
              var mul = 1;
              this[offset + i] = value & 0xFF;
              while (--i >= 0 && (mul *= 0x100)) {
                this[offset + i] = (value / mul) & 0xFF;
              }

              return offset + byteLength
            };

            Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
              value = +value;
              offset = offset | 0;
              if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
              if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
              this[offset] = (value & 0xff);
              return offset + 1
            };

            function objectWriteUInt16 (buf, value, offset, littleEndian) {
              if (value < 0) value = 0xffff + value + 1;
              for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
                buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
                  (littleEndian ? i : 1 - i) * 8;
              }
            }

            Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
              value = +value;
              offset = offset | 0;
              if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
              if (Buffer.TYPED_ARRAY_SUPPORT) {
                this[offset] = (value & 0xff);
                this[offset + 1] = (value >>> 8);
              } else {
                objectWriteUInt16(this, value, offset, true);
              }
              return offset + 2
            };

            Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
              value = +value;
              offset = offset | 0;
              if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
              if (Buffer.TYPED_ARRAY_SUPPORT) {
                this[offset] = (value >>> 8);
                this[offset + 1] = (value & 0xff);
              } else {
                objectWriteUInt16(this, value, offset, false);
              }
              return offset + 2
            };

            function objectWriteUInt32 (buf, value, offset, littleEndian) {
              if (value < 0) value = 0xffffffff + value + 1;
              for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
                buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
              }
            }

            Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
              value = +value;
              offset = offset | 0;
              if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
              if (Buffer.TYPED_ARRAY_SUPPORT) {
                this[offset + 3] = (value >>> 24);
                this[offset + 2] = (value >>> 16);
                this[offset + 1] = (value >>> 8);
                this[offset] = (value & 0xff);
              } else {
                objectWriteUInt32(this, value, offset, true);
              }
              return offset + 4
            };

            Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
              value = +value;
              offset = offset | 0;
              if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
              if (Buffer.TYPED_ARRAY_SUPPORT) {
                this[offset] = (value >>> 24);
                this[offset + 1] = (value >>> 16);
                this[offset + 2] = (value >>> 8);
                this[offset + 3] = (value & 0xff);
              } else {
                objectWriteUInt32(this, value, offset, false);
              }
              return offset + 4
            };

            Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
              value = +value;
              offset = offset | 0;
              if (!noAssert) {
                var limit = Math.pow(2, 8 * byteLength - 1);

                checkInt(this, value, offset, byteLength, limit - 1, -limit);
              }

              var i = 0;
              var mul = 1;
              var sub = 0;
              this[offset] = value & 0xFF;
              while (++i < byteLength && (mul *= 0x100)) {
                if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
                  sub = 1;
                }
                this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
              }

              return offset + byteLength
            };

            Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
              value = +value;
              offset = offset | 0;
              if (!noAssert) {
                var limit = Math.pow(2, 8 * byteLength - 1);

                checkInt(this, value, offset, byteLength, limit - 1, -limit);
              }

              var i = byteLength - 1;
              var mul = 1;
              var sub = 0;
              this[offset + i] = value & 0xFF;
              while (--i >= 0 && (mul *= 0x100)) {
                if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
                  sub = 1;
                }
                this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
              }

              return offset + byteLength
            };

            Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
              value = +value;
              offset = offset | 0;
              if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
              if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
              if (value < 0) value = 0xff + value + 1;
              this[offset] = (value & 0xff);
              return offset + 1
            };

            Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
              value = +value;
              offset = offset | 0;
              if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
              if (Buffer.TYPED_ARRAY_SUPPORT) {
                this[offset] = (value & 0xff);
                this[offset + 1] = (value >>> 8);
              } else {
                objectWriteUInt16(this, value, offset, true);
              }
              return offset + 2
            };

            Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
              value = +value;
              offset = offset | 0;
              if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
              if (Buffer.TYPED_ARRAY_SUPPORT) {
                this[offset] = (value >>> 8);
                this[offset + 1] = (value & 0xff);
              } else {
                objectWriteUInt16(this, value, offset, false);
              }
              return offset + 2
            };

            Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
              value = +value;
              offset = offset | 0;
              if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
              if (Buffer.TYPED_ARRAY_SUPPORT) {
                this[offset] = (value & 0xff);
                this[offset + 1] = (value >>> 8);
                this[offset + 2] = (value >>> 16);
                this[offset + 3] = (value >>> 24);
              } else {
                objectWriteUInt32(this, value, offset, true);
              }
              return offset + 4
            };

            Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
              value = +value;
              offset = offset | 0;
              if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
              if (value < 0) value = 0xffffffff + value + 1;
              if (Buffer.TYPED_ARRAY_SUPPORT) {
                this[offset] = (value >>> 24);
                this[offset + 1] = (value >>> 16);
                this[offset + 2] = (value >>> 8);
                this[offset + 3] = (value & 0xff);
              } else {
                objectWriteUInt32(this, value, offset, false);
              }
              return offset + 4
            };

            function checkIEEE754 (buf, value, offset, ext, max, min) {
              if (offset + ext > buf.length) throw new RangeError('Index out of range')
              if (offset < 0) throw new RangeError('Index out of range')
            }

            function writeFloat (buf, value, offset, littleEndian, noAssert) {
              if (!noAssert) {
                checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
              }
              write(buf, value, offset, littleEndian, 23, 4);
              return offset + 4
            }

            Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
              return writeFloat(this, value, offset, true, noAssert)
            };

            Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
              return writeFloat(this, value, offset, false, noAssert)
            };

            function writeDouble (buf, value, offset, littleEndian, noAssert) {
              if (!noAssert) {
                checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
              }
              write(buf, value, offset, littleEndian, 52, 8);
              return offset + 8
            }

            Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
              return writeDouble(this, value, offset, true, noAssert)
            };

            Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
              return writeDouble(this, value, offset, false, noAssert)
            };

            // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
            Buffer.prototype.copy = function copy (target, targetStart, start, end) {
              if (!start) start = 0;
              if (!end && end !== 0) end = this.length;
              if (targetStart >= target.length) targetStart = target.length;
              if (!targetStart) targetStart = 0;
              if (end > 0 && end < start) end = start;

              // Copy 0 bytes; we're done
              if (end === start) return 0
              if (target.length === 0 || this.length === 0) return 0

              // Fatal error conditions
              if (targetStart < 0) {
                throw new RangeError('targetStart out of bounds')
              }
              if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
              if (end < 0) throw new RangeError('sourceEnd out of bounds')

              // Are we oob?
              if (end > this.length) end = this.length;
              if (target.length - targetStart < end - start) {
                end = target.length - targetStart + start;
              }

              var len = end - start;
              var i;

              if (this === target && start < targetStart && targetStart < end) {
                // descending copy from end
                for (i = len - 1; i >= 0; --i) {
                  target[i + targetStart] = this[i + start];
                }
              } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
                // ascending copy from start
                for (i = 0; i < len; ++i) {
                  target[i + targetStart] = this[i + start];
                }
              } else {
                Uint8Array.prototype.set.call(
                  target,
                  this.subarray(start, start + len),
                  targetStart
                );
              }

              return len
            };

            // Usage:
            //    buffer.fill(number[, offset[, end]])
            //    buffer.fill(buffer[, offset[, end]])
            //    buffer.fill(string[, offset[, end]][, encoding])
            Buffer.prototype.fill = function fill (val, start, end, encoding) {
              // Handle string cases:
              if (typeof val === 'string') {
                if (typeof start === 'string') {
                  encoding = start;
                  start = 0;
                  end = this.length;
                } else if (typeof end === 'string') {
                  encoding = end;
                  end = this.length;
                }
                if (val.length === 1) {
                  var code = val.charCodeAt(0);
                  if (code < 256) {
                    val = code;
                  }
                }
                if (encoding !== undefined && typeof encoding !== 'string') {
                  throw new TypeError('encoding must be a string')
                }
                if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
                  throw new TypeError('Unknown encoding: ' + encoding)
                }
              } else if (typeof val === 'number') {
                val = val & 255;
              }

              // Invalid ranges are not set to a default, so can range check early.
              if (start < 0 || this.length < start || this.length < end) {
                throw new RangeError('Out of range index')
              }

              if (end <= start) {
                return this
              }

              start = start >>> 0;
              end = end === undefined ? this.length : end >>> 0;

              if (!val) val = 0;

              var i;
              if (typeof val === 'number') {
                for (i = start; i < end; ++i) {
                  this[i] = val;
                }
              } else {
                var bytes = internalIsBuffer(val)
                  ? val
                  : utf8ToBytes(new Buffer(val, encoding).toString());
                var len = bytes.length;
                for (i = 0; i < end - start; ++i) {
                  this[i + start] = bytes[i % len];
                }
              }

              return this
            };

            // HELPER FUNCTIONS
            // ================

            var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

            function base64clean (str) {
              // Node strips out invalid characters like \n and \t from the string, base64-js does not
              str = stringtrim(str).replace(INVALID_BASE64_RE, '');
              // Node converts strings with length < 2 to ''
              if (str.length < 2) return ''
              // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
              while (str.length % 4 !== 0) {
                str = str + '=';
              }
              return str
            }

            function stringtrim (str) {
              if (str.trim) return str.trim()
              return str.replace(/^\s+|\s+$/g, '')
            }

            function toHex (n) {
              if (n < 16) return '0' + n.toString(16)
              return n.toString(16)
            }

            function utf8ToBytes (string, units) {
              units = units || Infinity;
              var codePoint;
              var length = string.length;
              var leadSurrogate = null;
              var bytes = [];

              for (var i = 0; i < length; ++i) {
                codePoint = string.charCodeAt(i);

                // is surrogate component
                if (codePoint > 0xD7FF && codePoint < 0xE000) {
                  // last char was a lead
                  if (!leadSurrogate) {
                    // no lead yet
                    if (codePoint > 0xDBFF) {
                      // unexpected trail
                      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                      continue
                    } else if (i + 1 === length) {
                      // unpaired lead
                      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                      continue
                    }

                    // valid lead
                    leadSurrogate = codePoint;

                    continue
                  }

                  // 2 leads in a row
                  if (codePoint < 0xDC00) {
                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                    leadSurrogate = codePoint;
                    continue
                  }

                  // valid surrogate pair
                  codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
                } else if (leadSurrogate) {
                  // valid bmp char, but last char was a lead
                  if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                }

                leadSurrogate = null;

                // encode utf8
                if (codePoint < 0x80) {
                  if ((units -= 1) < 0) break
                  bytes.push(codePoint);
                } else if (codePoint < 0x800) {
                  if ((units -= 2) < 0) break
                  bytes.push(
                    codePoint >> 0x6 | 0xC0,
                    codePoint & 0x3F | 0x80
                  );
                } else if (codePoint < 0x10000) {
                  if ((units -= 3) < 0) break
                  bytes.push(
                    codePoint >> 0xC | 0xE0,
                    codePoint >> 0x6 & 0x3F | 0x80,
                    codePoint & 0x3F | 0x80
                  );
                } else if (codePoint < 0x110000) {
                  if ((units -= 4) < 0) break
                  bytes.push(
                    codePoint >> 0x12 | 0xF0,
                    codePoint >> 0xC & 0x3F | 0x80,
                    codePoint >> 0x6 & 0x3F | 0x80,
                    codePoint & 0x3F | 0x80
                  );
                } else {
                  throw new Error('Invalid code point')
                }
              }

              return bytes
            }

            function asciiToBytes (str) {
              var byteArray = [];
              for (var i = 0; i < str.length; ++i) {
                // Node's code seems to be doing this and not & 0x7F..
                byteArray.push(str.charCodeAt(i) & 0xFF);
              }
              return byteArray
            }

            function utf16leToBytes (str, units) {
              var c, hi, lo;
              var byteArray = [];
              for (var i = 0; i < str.length; ++i) {
                if ((units -= 2) < 0) break

                c = str.charCodeAt(i);
                hi = c >> 8;
                lo = c % 256;
                byteArray.push(lo);
                byteArray.push(hi);
              }

              return byteArray
            }


            function base64ToBytes (str) {
              return toByteArray(base64clean(str))
            }

            function blitBuffer (src, dst, offset, length) {
              for (var i = 0; i < length; ++i) {
                if ((i + offset >= dst.length) || (i >= src.length)) break
                dst[i + offset] = src[i];
              }
              return i
            }

            function isnan (val) {
              return val !== val // eslint-disable-line no-self-compare
            }


            // the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
            // The _isBuffer check is for Safari 5-7 support, because it's missing
            // Object.prototype.constructor. Remove this eventually
            function isBuffer(obj) {
              return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
            }

            function isFastBuffer (obj) {
              return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
            }

            // For Node v0.10 support. Remove this eventually.
            function isSlowBuffer (obj) {
              return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
            }

            if (typeof global$1$1.setTimeout === 'function') ;
            if (typeof global$1$1.clearTimeout === 'function') ;

            // from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
            var performance = global$1$1.performance || {};
            var performanceNow =
              performance.now        ||
              performance.mozNow     ||
              performance.msNow      ||
              performance.oNow       ||
              performance.webkitNow  ||
              function(){ return (new Date()).getTime() };

            function isNumber(arg) {
              return typeof arg === 'number';
            }

            var DEG2RAD_HALF = Math.PI / 360.0;
            var DEG2RAD = Math.PI / 180.0;
            var RAD2DEG = 180.0 / Math.PI;
            var glmath = /** @class */ (function () {
                function glmath() {
                }
                glmath.vec3 = function (x, y, z) {
                    return new vec3([x, y, z]);
                };
                glmath.vec4 = function (x, y, z, w) {
                    return new vec4([x, y, z, w]);
                };
                glmath.quat = function (x, y, z, w) {
                    return new quat([x, y, z, w]);
                };
                glmath.clamp = function (v, min, max) {
                    return v > max ? max : (v < min ? min : v);
                };
                glmath.Deg2Rad = DEG2RAD;
                glmath.Rad2Deg = RAD2DEG;
                return glmath;
            }());
            var vec4 = /** @class */ (function () {
                function vec4(v) {
                    if (v != null) {
                        this.raw = v;
                    }
                    else {
                        this.raw = [0, 0, 0, 0];
                    }
                }
                Object.defineProperty(vec4.prototype, "x", {
                    get: function () { return this.raw[0]; },
                    set: function (v) { this.raw[0] = v; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(vec4.prototype, "y", {
                    get: function () { return this.raw[1]; },
                    set: function (v) { this.raw[1] = v; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(vec4.prototype, "z", {
                    get: function () { return this.raw[2]; },
                    set: function (v) { this.raw[2] = v; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(vec4.prototype, "w", {
                    get: function () { return this.raw[3]; },
                    set: function (v) { this.raw[3] = v; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(vec4.prototype, "length", {
                    get: function () {
                        return Math.sqrt(this.dot(this));
                    },
                    enumerable: true,
                    configurable: true
                });
                vec4.prototype.add = function (v) {
                    if (v instanceof vec3 || v instanceof vec4) {
                        this.x += v.x;
                        this.y += v.y;
                        this.z += v.z;
                        this.w += ((v instanceof vec4) ? v.w : 0);
                    }
                    else if (v instanceof Array) {
                        this.x += v[0];
                        this.y += v[1];
                        this.z += v[2];
                        this.w += v[3];
                    }
                    else {
                        this.x += v;
                        this.y += v;
                        this.z += v;
                        this.w += v;
                    }
                    return this;
                };
                vec4.prototype.addToRef = function (v) {
                    if (v instanceof vec3 || v instanceof vec4) {
                        var x = v.x + this.x;
                        var y = v.y + this.y;
                        var z = v.z + this.z;
                        var w = ((v instanceof vec4) ? v.w : 0) + this.w;
                        return glmath.vec4(x, y, z, w);
                    }
                    else if (v instanceof Array) {
                        var x = v[0] + this.x;
                        var y = v[1] + this.y;
                        var z = v[2] + this.z;
                        var w = v[3] + this.w;
                        return glmath.vec4(x, y, z, w);
                    }
                    else {
                        return glmath.vec4(this.x + v, this.y + v, this.z + v, this.w + v);
                    }
                };
                vec4.prototype.sub = function (v) {
                    if (v instanceof vec3 || v instanceof vec4) {
                        this.x -= v.x;
                        this.y -= v.y;
                        this.z -= v.z;
                        this.w -= ((v instanceof vec4) ? v.w : 0);
                    }
                    else if (v instanceof Array) {
                        this.x -= v[0];
                        this.y -= v[1];
                        this.z -= v[2];
                        this.w -= v[3];
                    }
                    else {
                        this.x -= v;
                        this.y -= v;
                        this.z -= v;
                        this.w -= v;
                    }
                    return this;
                };
                vec4.prototype.subToRef = function (v) {
                    if (v instanceof vec3 || v instanceof vec4) {
                        var x = v.x - this.x;
                        var y = v.y - this.y;
                        var z = v.z - this.z;
                        var w = ((v instanceof vec4) ? v.w : 0) - this.w;
                        return glmath.vec4(x, y, z, w);
                    }
                    else if (v instanceof Array) {
                        var x = v[0] - this.x;
                        var y = v[1] - this.y;
                        var z = v[2] - this.z;
                        var w = v[3] - this.w;
                        return glmath.vec4(x, y, z, w);
                    }
                    else {
                        return glmath.vec4(this.x - v, this.y - v, this.z - v, this.w - v);
                    }
                };
                vec4.prototype.mulNum = function (v) {
                    this.x *= v;
                    this.y *= v;
                    this.z *= v;
                    this.w *= v;
                    return this;
                };
                vec4.prototype.mulNumToRef = function (v) {
                    return glmath.vec4(this.x * v, this.y * v, this.z * v, this.w * v);
                };
                vec4.prototype.mul = function (v) {
                    if (v instanceof vec4) {
                        this.x *= v.x;
                        this.y *= v.y;
                        this.z *= v.z;
                        this.w *= v.w;
                    }
                    else if (v instanceof Array) {
                        this.x *= v[0];
                        this.y *= v[1];
                        this.z *= v[2];
                        this.w *= v[3];
                    }
                    else if (v instanceof mat4) {
                        this.raw = v.mulvec(this).raw;
                    }
                    else if (v instanceof quat) {
                        this.raw = v.rota(new vec3([this.x, this.y, this.z])).raw;
                    }
                    else if (isNumber(v)) {
                        this.x *= v;
                        this.y *= v;
                        this.z *= v;
                        this.w *= v;
                    }
                    return this;
                };
                vec4.prototype.mulToRef = function (v) {
                    if (v instanceof vec4) {
                        return glmath.vec4(v.x * this.x, v.y * this.y, v.z * this.z, v.w * this.w);
                    }
                    else if (v instanceof Array) {
                        return glmath.vec4(v[0] * this.x, v[1] * this.y, v[2] * this.z, v[3] * this.w);
                    }
                    else if (v instanceof mat4) {
                        return v.mulvec(this);
                    }
                    else if (v instanceof quat) {
                        return null;
                    }
                    else if (isNumber(v)) {
                        return glmath.vec4(this.x * v, this.y * v, this.z * v, this.w * v);
                    }
                };
                vec4.prototype.div = function (v) {
                    this.x /= v;
                    this.y /= v;
                    this.z /= v;
                    this.w /= v;
                    return this;
                };
                vec4.prototype.divToRef = function (v) {
                    return glmath.vec4(this.x / v, this.y / v, this.z / v, this.w / v);
                };
                vec4.prototype.vec3 = function () {
                    return glmath.vec3(this.x, this.y, this.z);
                };
                vec4.prototype.dot = function (v) {
                    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
                };
                vec4.prototype.clone = function () {
                    return new vec4([this.x, this.y, this.z, this.w]);
                };
                vec4.prototype.normalize = function () {
                    return this.div(this.length);
                };
                /** return new vec4 ref */
                vec4.prototype.normalized = function () {
                    return this.divToRef(this.length);
                };
                vec4.Random = function () {
                    return new vec4([Math.random(), Math.random(), Math.random(), Math.random()]);
                };
                vec4.prototype.equals = function (v) {
                    var r = this.raw;
                    var rv = v.raw;
                    for (var i = 0; i < 4; i++) {
                        if (r[i] != rv[i])
                            return false;
                    }
                    return true;
                };
                vec4.prototype.set = function (v) {
                    this.x = v.x;
                    this.y = v.y;
                    this.z = v.z;
                    this.w = v.w;
                };
                vec4.zero = new vec4([0, 0, 0, 0]);
                vec4.one = new vec4([1, 1, 1, 1]);
                return vec4;
            }());
            var vec3 = /** @class */ (function () {
                function vec3(v) {
                    if (v != null) {
                        this.raw = v;
                    }
                    else {
                        this.raw = [0, 0, 0];
                    }
                }
                Object.defineProperty(vec3.prototype, "x", {
                    get: function () { return this.raw[0]; },
                    set: function (v) { this.raw[0] = v; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(vec3.prototype, "y", {
                    get: function () { return this.raw[1]; },
                    set: function (v) { this.raw[1] = v; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(vec3.prototype, "z", {
                    get: function () { return this.raw[2]; },
                    set: function (v) { this.raw[2] = v; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(vec3.prototype, "length", {
                    get: function () {
                        return Math.sqrt(this.dot(this));
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(vec3.prototype, "length2", {
                    get: function () {
                        var x = this.x;
                        var y = this.y;
                        var z = this.z;
                        return x * x + y * y + z * z;
                    },
                    enumerable: true,
                    configurable: true
                });
                vec3.prototype.add = function (v) {
                    if (v instanceof vec3 || v instanceof vec4) {
                        this.x += v.x;
                        this.y += v.y;
                        this.z += v.z;
                    }
                    else if (v instanceof Array) {
                        this.x += v[0];
                        this.x += v[1];
                        this.x += v[2];
                    }
                    else {
                        this.x += v;
                        this.y += v;
                        this.z += v;
                    }
                    return this;
                };
                vec3.prototype.addToRef = function (v) {
                    if (v instanceof vec3 || v instanceof vec4) {
                        var x = v.x + this.x;
                        var y = v.y + this.y;
                        var z = v.z + this.z;
                        return glmath.vec3(x, y, z);
                    }
                    else if (v instanceof Array) {
                        var x = v[0] + this.x;
                        var y = v[1] + this.y;
                        var z = v[2] + this.z;
                        return glmath.vec3(x, y, z);
                    }
                    else {
                        return glmath.vec3(this.x + v, this.y + v, this.z + v);
                    }
                };
                vec3.prototype.sub = function (v) {
                    if (v instanceof vec3 || v instanceof vec4) {
                        this.x -= v.x;
                        this.y -= v.y;
                        this.z -= v.z;
                    }
                    else if (v instanceof Array) {
                        this.x -= v[0];
                        this.y -= v[1];
                        this.z -= v[2];
                    }
                    else {
                        this.x -= v;
                        this.y -= v;
                        this.z -= v;
                    }
                    return this;
                };
                vec3.prototype.subToRef = function (v) {
                    if (v instanceof vec3 || v instanceof vec4) {
                        var x = this.x - v.x;
                        var y = this.y - v.y;
                        var z = this.z - v.z;
                        return glmath.vec3(x, y, z);
                    }
                    else if (v instanceof Array) {
                        var x = this.x - v[0];
                        var y = this.y - v[1];
                        var z = this.z - v[2];
                        return glmath.vec3(x, y, z);
                    }
                    else {
                        return glmath.vec3(this.x - v, this.y - v, this.z - v);
                    }
                };
                /**
                 * multiply a number
                 * @param n
                 */
                vec3.prototype.mulNum = function (n) {
                    this.x *= n;
                    this.y *= n;
                    this.z *= n;
                    return this;
                };
                vec3.prototype.mulNumToRef = function (n) {
                    return glmath.vec3(this.x * n, this.y * n, this.z * n);
                };
                vec3.prototype.mul = function (v) {
                    if (v instanceof vec3 || v instanceof vec4) {
                        this.x *= v.x;
                        this.y *= v.y;
                        this.z *= v.z;
                    }
                    else if (v instanceof Array) {
                        this.x *= v[0];
                        this.y *= v[1];
                        this.z *= v[2];
                    }
                    else if (v instanceof mat3) {
                        this.raw = v.mulvec(this).raw;
                    }
                    else if (v instanceof quat) {
                        this.raw = v.rota(this).raw;
                    }
                    else {
                        this.x *= v;
                        this.y *= v;
                        this.z *= v;
                    }
                    return this;
                };
                vec3.prototype.mulToRef = function (v) {
                    if (v instanceof vec3 || v instanceof vec4) {
                        var x = v.x * this.x;
                        var y = v.y * this.y;
                        var z = v.z * this.z;
                        return glmath.vec3(x, y, z);
                    }
                    else if (v instanceof Array) {
                        var x = v[0] * this.x;
                        var y = v[1] * this.y;
                        var z = v[2] * this.z;
                        return glmath.vec3(x, y, z);
                    }
                    else if (v instanceof mat3) {
                        return vec3.zero;
                    }
                    else if (v instanceof quat) {
                        return v.rota(this);
                    }
                    else {
                        return glmath.vec3(this.x * v, this.y * v, this.z * v);
                    }
                };
                vec3.prototype.div = function (v) {
                    this.x /= v;
                    this.y /= v;
                    this.z /= v;
                    return this;
                };
                vec3.prototype.divToRef = function (v) {
                    return glmath.vec3(this.x / v, this.y / v, this.z / v);
                };
                vec3.prototype.vec4 = function (w) {
                    if (w === void 0) { w = 0; }
                    return glmath.vec4(this.x, this.y, this.z, w);
                };
                vec3.prototype.dot = function (v) {
                    return this.x * v.x + this.y * v.y + this.z * v.z;
                };
                vec3.prototype.clone = function () {
                    return new vec3([this.x, this.y, this.z]);
                };
                /**
                 * CrossProduct operation
                 * @param rhs right hand side
                 */
                vec3.prototype.cross = function (rhs) {
                    return vec3.Cross(this, rhs);
                };
                /**
                 * Reverse CrossProduct operation
                 * @param lhs left hand side
                 */
                vec3.prototype.crossRev = function (lhs) {
                    return vec3.Cross(lhs, this);
                };
                vec3.Cross = function (lhs, rhs) {
                    return new vec3([
                        lhs.y * rhs.z - lhs.z * rhs.y,
                        lhs.z * rhs.x - lhs.x * rhs.z,
                        lhs.x * rhs.y - lhs.y * rhs.x
                    ]);
                };
                vec3.Dot = function (v1, v2) {
                    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
                };
                vec3.Add = function (v1, v2) {
                    return new vec3([v1.x + v2.x, v1.y + v2.y, v1.z + v2.z]);
                };
                Object.defineProperty(vec3.prototype, "normalize", {
                    get: function () {
                        return this.div(this.length);
                    },
                    enumerable: true,
                    configurable: true
                });
                vec3.prototype.normalized = function () {
                    return this.divToRef(this.length);
                };
                vec3.Random = function () {
                    return new vec3([Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]);
                };
                vec3.prototype.set = function (v) {
                    this.x = v.x;
                    this.y = v.y;
                    this.z = v.z;
                };
                Object.defineProperty(vec3, "zero", {
                    get: function () { return new vec3([0, 0, 0]); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(vec3, "one", {
                    get: function () { return new vec3([1, 1, 1]); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(vec3, "up", {
                    get: function () { return new vec3([0, 1, 0]); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(vec3, "forward", {
                    get: function () { return new vec3([0, 0, 1]); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(vec3, "back", {
                    get: function () { return new vec3([0, 0, -1]); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(vec3, "left", {
                    get: function () { return new vec3([-1, 0, 0]); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(vec3, "right", {
                    get: function () { return new vec3([1, 0, 0]); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(vec3, "down", {
                    get: function () { return new vec3([0, -1, 0]); },
                    enumerable: true,
                    configurable: true
                });
                return vec3;
            }());
            var quat = /** @class */ (function () {
                function quat(v) {
                    if (v != null) {
                        this.raw = v;
                    }
                    else {
                        this.raw = [0, 0, 0, 0];
                    }
                }
                Object.defineProperty(quat.prototype, "x", {
                    get: function () { return this.raw[0]; },
                    set: function (v) { this.raw[0] = v; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(quat.prototype, "y", {
                    get: function () { return this.raw[1]; },
                    set: function (v) { this.raw[1] = v; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(quat.prototype, "z", {
                    get: function () { return this.raw[2]; },
                    set: function (v) { this.raw[2] = v; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(quat.prototype, "w", {
                    get: function () { return this.raw[3]; },
                    set: function (v) { this.raw[3] = v; },
                    enumerable: true,
                    configurable: true
                });
                quat.prototype.conjugate = function () {
                    return quat.Conjugate(this);
                };
                quat.prototype.mul = function (r) {
                    var l = this;
                    var rw = r.w;
                    var rx = r.x;
                    var ry = r.y;
                    var rz = r.z;
                    var lx = l.x;
                    var ly = l.y;
                    var lz = l.z;
                    var lw = l.w;
                    return new quat([
                        rw * lx + lw * rx + ly * rz - lz * ry,
                        rw * ly + lw * ry + lz * rx - lx * rz,
                        rw * lz + lw * rz + lx * ry - ly * rx,
                        rw * lw - lx * rx - ly * ry - lz * rz
                    ]);
                };
                /**
                 * Multiply self with quat <param l>, then return self
                 * @param l
                 */
                quat.prototype.selfRota = function (l) {
                    var rw = this.w;
                    var rx = this.x;
                    var ry = this.y;
                    var rz = this.z;
                    var lx = l.x;
                    var ly = l.y;
                    var lz = l.z;
                    var lw = l.w;
                    this.x = rw * lx + lw * rx + ly * rz - lz * ry;
                    this.y = rw * ly + lw * ry + lz * rx - lx * rz;
                    this.z = rw * lz + lw * rz + lx * ry - ly * rx;
                    this.w = rw * lw - lx * rx - ly * ry - lz * rz;
                    return this;
                };
                Object.defineProperty(quat, "Identity", {
                    /**
                     * Identity quaternion [0,0,0,1]
                     */
                    get: function () {
                        return new quat([
                            0, 0, 0, 1
                        ]);
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Rotate vector by self
                 * @param v
                 */
                quat.prototype.rota = function (v) {
                    var q = new vec3([this.x, this.y, this.z]);
                    var t = q.cross(v).mul(2);
                    return v.clone().add(t.mulToRef(this.w)).add(q.cross(t));
                };
                /**
                 * Convert euler angle (degree) to quaternion
                 * width order Z-X-Y
                 * @param degx
                 * @param degy
                 * @param degz
                 */
                quat.fromEulerDeg = function (degx, degy, degz) {
                    var rx = degx * DEG2RAD_HALF;
                    var ry = degy * DEG2RAD_HALF;
                    var rz = degz * DEG2RAD_HALF;
                    var cosx = Math.cos(rx);
                    var cosy = Math.cos(ry);
                    var cosz = Math.cos(rz);
                    var sinx = Math.sin(rx);
                    var siny = Math.sin(ry);
                    var sinz = Math.sin(rz);
                    return new quat([
                        sinx * cosy * cosz + cosx * siny * sinz,
                        cosx * siny * cosz - sinx * cosy * sinz,
                        cosx * cosy * sinz - sinx * siny * cosz,
                        cosx * cosy * cosz + sinx * siny * sinz
                    ]);
                };
                /**
                 * Convert euler angle (radians) to quaternion
                 * width order Z-X-Y
                 * @param rx
                 * @param ry
                 * @param rz
                 */
                quat.fromEuler = function (rx, ry, rz) {
                    var rxh = rx / 2.0;
                    var ryh = ry / 2.0;
                    var rzh = rz / 2.0;
                    var cosx = Math.cos(rxh);
                    var cosy = Math.cos(ryh);
                    var cosz = Math.cos(rzh);
                    var sinx = Math.sin(rxh);
                    var siny = Math.sin(ryh);
                    var sinz = Math.sin(rzh);
                    return new quat([
                        sinx * cosy * cosz + cosx * siny * sinz,
                        cosx * siny * cosz - sinx * cosy * sinz,
                        cosx * cosy * sinz - sinx * siny * cosz,
                        cosx * cosy * cosz + sinx * siny * sinz
                    ]);
                };
                /**
                 * Convert quaternion to Euler angle (radians).
                 * Z-X-Y order
                 */
                quat.prototype.toEuler = function () {
                    var v = new vec3();
                    var x = this.z;
                    var y = this.x;
                    var z = this.y;
                    var w = this.w;
                    var t0 = 2.0 * (w * x + y * z);
                    var t1 = 1.0 - 2.0 * (x * x + y * y);
                    v.z = Math.atan2(t0, t1);
                    var t2 = 2.0 * (w * y - z * x);
                    if (t2 > 1.0) {
                        t2 = 1.0;
                    }
                    else if (t2 < -1.0) {
                        t2 = -1.0;
                    }
                    v.x = Math.asin(t2);
                    var t3 = 2.0 * (w * z + x * y);
                    var t4 = 1.0 - 2.0 * (y * y + z * z);
                    v.y = Math.atan2(t3, t4);
                    return v;
                };
                /**
                 * Covert quaternion to Euler angle (degree).
                 */
                quat.prototype.toEulerDeg = function () {
                    var v = new vec3();
                    var x = this.z;
                    var y = this.x;
                    var z = this.y;
                    var w = this.w;
                    var t0 = 2.0 * (w * x + y * z);
                    var t1 = 1.0 - 2.0 * (x * x + y * y);
                    v.z = Math.atan2(t0, t1) * RAD2DEG;
                    var t2 = 2.0 * (w * y - z * x);
                    if (t2 > 1.0) {
                        t2 = 1.0;
                    }
                    else if (t2 < -1.0) {
                        t2 = -1.0;
                    }
                    v.x = Math.asin(t2) * RAD2DEG;
                    var t3 = 2.0 * (w * z + x * y);
                    var t4 = 1.0 - 2.0 * (y * y + z * z);
                    v.y = Math.atan2(t3, t4) * RAD2DEG;
                    return v;
                };
                quat.axisRotation = function (axis, angle) {
                    var d = 1.0 / axis.length;
                    var sin = Math.sin(angle / 2);
                    var cos = Math.cos(angle / 2);
                    var v4 = axis.mulToRef(d * sin).vec4(cos);
                    return new quat(v4.raw);
                };
                quat.axisRotationDeg = function (axis, deg) {
                    var angle = deg * DEG2RAD;
                    var d = 1.0 / axis.length;
                    var sin = Math.sin(angle / 2);
                    var cos = Math.cos(angle / 2);
                    var v4 = axis.mulToRef(d * sin).vec4(cos);
                    return new quat(v4.raw);
                };
                /**
                 * Calculate quaternion of rotation of vec3[from] -> vec3[to]
                 * @param from
                 * @param to
                 * @param normal
                 */
                quat.FromToNormal = function (from, to, normal) {
                    var f = from.normalized();
                    var t = to.normalized();
                    var n = normal.normalized();
                    var cross = vec3.Cross(f, t);
                    var croosLen2 = cross.length2;
                    if (croosLen2 == 0) {
                        var dot = f.dot(t);
                        if (dot == 1) {
                            return quat.Identity;
                        }
                        var cr = vec3.Cross(n, f);
                        var cu = vec3.Cross(f, cr);
                        var nor = cu.normalize;
                        return new quat([nor.x, nor.y, nor.z, 0]);
                    }
                    cross.div(Math.sqrt(croosLen2));
                    var cos = f.dot(t);
                    var cosh = Math.sqrt((1 + cos) / 2.0);
                    var sinh = Math.sqrt((1 - cos) / 2.0);
                    var cdotn = cross.dot(n);
                    if (cdotn < 0) {
                        cross.mul(-1.0);
                        cosh *= -1.0;
                    }
                    return new quat([cross.x * sinh, cross.y * sinh, cross.z * sinh, cosh]);
                };
                quat.Coordinate = function (forward, up) {
                    if (forward.dot(up) > Number.EPSILON) {
                        throw new Error("<forward> must be perpendicular ot <up>");
                    }
                    var f = forward.normalized();
                    var u = up.normalized();
                    var qf = quat.FromToNormal(vec3.forward, f, u);
                    var u1 = qf.rota(vec3.up);
                    var qu = quat.FromToNormal(u1, up, f);
                    return qu.mul(qf);
                };
                quat.QuatToMtx = function (q) {
                    var x = q.x;
                    var y = q.y;
                    var z = q.z;
                    var w = q.w;
                    var x2 = 2 * x * x;
                    var y2 = 2 * y * y;
                    var z2 = 2 * z * z;
                    var xy2 = x * y * 2;
                    var yz2 = y * z * 2;
                    var zx2 = z * x * 2;
                    var wx2 = w * x * 2;
                    var wy2 = w * y * 2;
                    var wz2 = w * z * 2;
                    return new mat3([
                        1 - y2 - z2, xy2 + wz2, zx2 - wy2,
                        xy2 - wz2, 1 - x2 - z2, yz2 + wx2,
                        zx2 + wy2, yz2 - wx2, 1 - x2 - y2
                    ]);
                };
                quat.Conjugate = function (q) {
                    return new quat([-q.x, -q.y, -q.z, q.w]);
                };
                quat.Div = function (q1, q2) {
                    return q1.mul(q2.conjugate());
                };
                quat.MtxToQuat = function (mtx) {
                    var raw = mtx.raw;
                    var a1 = raw[1];
                    var a3 = raw[3];
                    var a5 = raw[5];
                    var a7 = raw[7];
                    var a8 = raw[8];
                    var a0 = raw[0];
                    var a4 = raw[4];
                    var w2 = (a0 + a4 + 1 + a8) / 4;
                    var x2 = (a0 + 1 - 2 * w2) / 2;
                    var x = Math.sqrt(x2);
                    var y = (a1 + a3) / 4.0 / x;
                    var z = (a5 + a7) / 4.0 / y;
                    var w = (a1 - a3) / 4.0 / z;
                    return w < 0 ? new quat([-x, -y, -z, -w]) : new quat([x, y, z, w]);
                };
                quat.prototype.equals = function (q) {
                    var qraw = (q.w * this.w < 0) ? [-q.x, -q.y, -q.z, -q.w] : q.raw;
                    for (var i = 0; i < 4; i++) {
                        if (Math.abs(qraw[i] - this.raw[i]) > 0.001)
                            return false;
                    }
                    return true;
                };
                quat.prototype.determination = function () {
                    var x = this.x;
                    var y = this.y;
                    var z = this.z;
                    var w = this.w;
                    return x * x + y * y + z * z + w * w;
                };
                quat.prototype.clone = function () {
                    return new quat([this.x, this.y, this.z, this.w]);
                };
                quat.Random = function () {
                    return quat.axisRotation(glmath.vec3(Math.random(), Math.random(), Math.random()), Math.PI * 2 * Math.random());
                };
                quat.prototype.set = function (q) {
                    this.x = q.x;
                    this.y = q.y;
                    this.z = q.z;
                    this.w = q.w;
                };
                return quat;
            }());
            var mat4 = /** @class */ (function () {
                function mat4(v) {
                    if (v != null) {
                        this.raw = v;
                    }
                    else {
                        this.raw = new Array(16);
                    }
                }
                mat4.prototype.column = function (index) {
                    var raw = this.raw;
                    var o = index * 4;
                    return new vec4([raw[o], raw[o + 1], raw[o + 2], raw[o + 3]]);
                };
                mat4.prototype.row = function (index) {
                    var raw = this.raw;
                    var o = index;
                    return new vec4([raw[o], raw[o + 4], raw[o + 8], raw[o + 12]]);
                };
                Object.defineProperty(mat4, "Identity", {
                    get: function () {
                        return new mat4([
                            1, 0, 0, 0,
                            0, 1, 0, 0,
                            0, 0, 1, 0,
                            0, 0, 0, 1
                        ]);
                    },
                    enumerable: true,
                    configurable: true
                });
                mat4.lookAt = function (eye, target, up) {
                    var vz = eye.subToRef(target).normalize;
                    var vx = up.cross(vz).normalize;
                    var vy = vz.cross(vx).normalize;
                    return mat4.inverse(new mat4([
                        vx.x, vx.y, vx.z, 0,
                        vy.x, vy.y, vy.z, 0,
                        vz.x, vz.y, vz.z, 0,
                        -vx.dot(eye),
                        -vy.dot(eye),
                        -vz.dot(eye),
                        1
                    ]));
                };
                /**
                 * Build coordinate change matrix RH->RH LH->LH
                 * @param pos pos
                 * @param forward dir
                 * @param up dir
                 */
                mat4.coord = function (pos, forward, up) {
                    var f = forward.normalized();
                    var u = up.normalized();
                    var r = u.cross(f).normalize;
                    u = f.cross(r).normalize;
                    return new mat4([
                        r.x, u.x, f.x, 0,
                        r.y, u.y, f.y, 0,
                        r.z, u.z, f.z, 0,
                        -r.dot(pos), -u.dot(pos), -f.dot(pos), 1
                    ]);
                };
                /**
                 * Build matrix for coordinate conversion RH->LH LH->RH
                 * @param pos pos
                 * @param forward dir
                 * @param up dir
                 */
                mat4.coordCvt = function (pos, forward, up) {
                    var f = forward.normalized();
                    var u = up.normalized();
                    var r = u.crossRev(f).normalize;
                    u = f.crossRev(r).normalize;
                    return new mat4([
                        r.x, u.x, f.x, 0,
                        r.y, u.y, f.y, 0,
                        r.z, u.z, f.z, 0,
                        -r.dot(pos), -u.dot(pos), -f.dot(pos), 1
                    ]);
                };
                /**
                 * Left Hand Coordinate
                 * @param w
                 * @param h
                 * @param n
                 * @param f
                 */
                mat4.perspective = function (w, h, n, f) {
                    return new mat4([
                        2 * n / w, 0, 0, 0,
                        0, 2 * n / h, 0, 0,
                        0, 0, (n + f) / (n - f), -1,
                        0, 0, 2 * n * f / (n - f), 0
                    ]);
                };
                /**
                 * Left Hand Coordinate
                 * @param fov
                 * @param aspect
                 * @param n
                 * @param f
                 */
                mat4.perspectiveFoV = function (fov, aspect, n, f) {
                    var h = Math.tan(fov / 360.0 * Math.PI) * n * 2;
                    var w = h * aspect;
                    return this.perspective(w, h, n, f);
                };
                /**
                 * Left Hand coordinate
                 * @param w
                 * @param h
                 * @param n
                 * @param f
                 */
                mat4.orthographic = function (w, h, n, f) {
                    var d = f - n;
                    return new mat4([
                        2.0 / w, 0, 0, 0,
                        0, 2.0 / h, 0, 0,
                        0, 0, 2.0 / d, 0,
                        0, 0, -(n + f) / d, 1
                    ]);
                };
                mat4.prototype.inverse = function () {
                    return mat4.inverse(this);
                };
                mat4.inverse = function (mtx) {
                    var m = mtx.raw;
                    var dst = new Array(16);
                    var m00 = m[0 * 4 + 0];
                    var m01 = m[0 * 4 + 1];
                    var m02 = m[0 * 4 + 2];
                    var m03 = m[0 * 4 + 3];
                    var m10 = m[1 * 4 + 0];
                    var m11 = m[1 * 4 + 1];
                    var m12 = m[1 * 4 + 2];
                    var m13 = m[1 * 4 + 3];
                    var m20 = m[2 * 4 + 0];
                    var m21 = m[2 * 4 + 1];
                    var m22 = m[2 * 4 + 2];
                    var m23 = m[2 * 4 + 3];
                    var m30 = m[3 * 4 + 0];
                    var m31 = m[3 * 4 + 1];
                    var m32 = m[3 * 4 + 2];
                    var m33 = m[3 * 4 + 3];
                    var tmp_0 = m22 * m33;
                    var tmp_1 = m32 * m23;
                    var tmp_2 = m12 * m33;
                    var tmp_3 = m32 * m13;
                    var tmp_4 = m12 * m23;
                    var tmp_5 = m22 * m13;
                    var tmp_6 = m02 * m33;
                    var tmp_7 = m32 * m03;
                    var tmp_8 = m02 * m23;
                    var tmp_9 = m22 * m03;
                    var tmp_10 = m02 * m13;
                    var tmp_11 = m12 * m03;
                    var tmp_12 = m20 * m31;
                    var tmp_13 = m30 * m21;
                    var tmp_14 = m10 * m31;
                    var tmp_15 = m30 * m11;
                    var tmp_16 = m10 * m21;
                    var tmp_17 = m20 * m11;
                    var tmp_18 = m00 * m31;
                    var tmp_19 = m30 * m01;
                    var tmp_20 = m00 * m21;
                    var tmp_21 = m20 * m01;
                    var tmp_22 = m00 * m11;
                    var tmp_23 = m10 * m01;
                    var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
                        (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
                    var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
                        (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
                    var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
                        (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
                    var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
                        (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
                    var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
                    dst[0] = d * t0;
                    dst[1] = d * t1;
                    dst[2] = d * t2;
                    dst[3] = d * t3;
                    dst[4] = d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
                        (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
                    dst[5] = d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
                        (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
                    dst[6] = d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
                        (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
                    dst[7] = d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
                        (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
                    dst[8] = d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
                        (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
                    dst[9] = d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
                        (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
                    dst[10] = d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
                        (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
                    dst[11] = d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
                        (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
                    dst[12] = d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
                        (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
                    dst[13] = d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
                        (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
                    dst[14] = d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
                        (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
                    dst[15] = d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
                        (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));
                    return new mat4(dst);
                };
                mat4.Translate = function (v) {
                    return new mat4([
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        v.x, v.y, v.z, 1
                    ]);
                };
                mat4.mul = function (mtx, v) {
                    return new vec4([
                        v.dot(mtx.row(0)),
                        v.dot(mtx.row(1)),
                        v.dot(mtx.row(2)),
                        v.dot(mtx.row(3))
                    ]);
                };
                mat4.prototype.add = function (m) {
                    return mat4.add(this, m);
                };
                mat4.add = function (m1, m2) {
                    var ary = [];
                    var raw1 = m1.raw;
                    var raw2 = m2.raw;
                    for (var i = 0; i < 16; i++) {
                        ary.push(raw1[i] + raw2[i]);
                    }
                    return new mat4(ary);
                };
                mat4.prototype.mulvec = function (v) {
                    return mat4.mul(this, v);
                };
                mat4.prototype.mulnum = function (n) {
                    var nary = [];
                    var raw = this.raw;
                    for (var i = 0; i < 16; i++) {
                        nary.push(raw[i] * n);
                    }
                    return new mat4(nary);
                };
                mat4.Scale = function (scale) {
                    return new mat4([
                        scale.x, 0, 0, 0,
                        0, scale.y, 0, 0,
                        0, 0, scale.z, 0,
                        0, 0, 0, 1
                    ]);
                };
                mat4.Rotation = function (q) {
                    var mtx = quat.QuatToMtx(q).toMat4();
                    return mtx;
                };
                mat4.RotationEler = function (rad) {
                    return mat3.Rotation(quat.fromEuler(rad.x, rad.y, rad.z)).toMat4();
                };
                mat4.TRS = function (translate, rota, scale) {
                    var mtxr = quat.QuatToMtx(rota).raw;
                    var x = scale.x;
                    var y = scale.y;
                    var z = scale.z;
                    return new mat4([
                        mtxr[0] * x, mtxr[1] * x, mtxr[2] * x, 0,
                        mtxr[3] * y, mtxr[4] * y, mtxr[5] * y, 0,
                        mtxr[6] * z, mtxr[7] * z, mtxr[8] * z, 0,
                        translate.x, translate.y, translate.z, 1
                    ]);
                };
                mat4.prototype.setTRS = function (translate, rota, scale) {
                    var raw = this.raw;
                    var r = quat.QuatToMtx(rota).raw;
                    var x = scale.x;
                    var y = scale.y;
                    var z = scale.z;
                    raw[0] = r[0] * x;
                    raw[1] = r[1] * x;
                    raw[2] = r[2] * x;
                    raw[3] = 0;
                    raw[4] = r[3] * y;
                    raw[5] = r[4] * y;
                    raw[6] = r[5] * y;
                    raw[7] = 0;
                    raw[8] = r[6] * z;
                    raw[9] = r[7] * z;
                    raw[10] = r[8] * z;
                    raw[11] = 0;
                    raw[12] = translate.x;
                    raw[13] = translate.y;
                    raw[14] = translate.z;
                    raw[15] = 1;
                };
                mat4.prototype.set = function (mtx) {
                    var raw = this.raw;
                    var mraw = mtx.raw;
                    for (var i = 0; i < 16; i++) {
                        raw[i] = mraw[i];
                    }
                };
                mat4.prototype.mul = function (rhs) {
                    var m0 = this.row(0);
                    var m1 = this.row(1);
                    var m2 = this.row(2);
                    var m3 = this.row(3);
                    var n0 = rhs.column(0);
                    var n1 = rhs.column(1);
                    var n2 = rhs.column(2);
                    var n3 = rhs.column(3);
                    return new mat4([
                        m0.dot(n0), m1.dot(n0), m2.dot(n0), m3.dot(n0),
                        m0.dot(n1), m1.dot(n1), m2.dot(n1), m3.dot(n1),
                        m0.dot(n2), m1.dot(n2), m2.dot(n2), m3.dot(n2),
                        m0.dot(n3), m1.dot(n3), m2.dot(n3), m3.dot(n3)
                    ]);
                };
                mat4.prototype.transpose = function () {
                    return mat4.Transpose(this);
                };
                mat4.Transpose = function (m) {
                    var raw = m.raw;
                    return new mat4([
                        raw[0], raw[4], raw[8], raw[10],
                        raw[1], raw[5], raw[7], raw[11],
                        raw[2], raw[6], raw[8], raw[12],
                        raw[3], raw[7], raw[9], raw[13],
                    ]);
                };
                /**
                 * Decompose mat4 into translation rotation and scale
                 * Scale component must be positive
                 * @param mat
                 * @returns [T,R,S]
                 */
                mat4.Decompose = function (mat) {
                    var raw = mat.raw;
                    var t = glmath.vec3(raw[12], raw[13], raw[14]);
                    var c0 = glmath.vec3(raw[0], raw[1], raw[2]);
                    var c1 = glmath.vec3(raw[4], raw[5], raw[6]);
                    var c2 = glmath.vec3(raw[8], raw[9], raw[10]);
                    var scale = glmath.vec3(c0.length, c1.length, c2.length);
                    var rota = quat.MtxToQuat(mat3.fromColumns(c0.div(scale.x), c1.div(scale.y), c2.div(scale.z)));
                    return [t, rota, scale];
                };
                mat4.prototype.clone = function () {
                    var ary = this.raw.splice(0);
                    return new mat4(ary);
                };
                return mat4;
            }());
            var mat3 = /** @class */ (function () {
                function mat3(v) {
                    if (v != null) {
                        this.raw = v;
                    }
                    else {
                        this.raw = new Array(9);
                    }
                }
                /**
                 * Get column of matrix
                 * @param index
                 */
                mat3.prototype.column = function (index) {
                    var raw = this.raw;
                    var o = index * 3;
                    return new vec3([raw[o], raw[o + 1], raw[o + 2]]);
                };
                /**
                 * Get row of matrix
                 * @param index
                 */
                mat3.prototype.row = function (index) {
                    var raw = this.raw;
                    var o = index;
                    return new vec3([raw[o], raw[o + 3], raw[o + 6]]);
                };
                Object.defineProperty(mat3, "Identity", {
                    get: function () {
                        return new mat3([1, 0, 0, 0, 1, 0, 0, 0, 1]);
                    },
                    enumerable: true,
                    configurable: true
                });
                mat3.Transpose = function (m) {
                    var raw = m.raw;
                    return new mat3([
                        raw[0], raw[3], raw[6],
                        raw[1], raw[4], raw[7],
                        raw[2], raw[5], raw[8]
                    ]);
                };
                mat3.prototype.transpose = function () {
                    return mat3.Transpose(this);
                };
                mat3.prototype.toMat4 = function () {
                    return mat3.ToMat4(this);
                };
                mat3.ToMat4 = function (m) {
                    var r = m.raw;
                    return new mat4([
                        r[0], r[1], r[2], 0,
                        r[3], r[4], r[5], 0,
                        r[6], r[7], r[8], 0,
                        0, 0, 0, 1
                    ]);
                };
                mat3.Cross = function (lhs) {
                    return new mat3([
                        0, lhs.z, -lhs.y,
                        -lhs.z, 0, lhs.x,
                        lhs.y, -lhs.x, 0
                    ]);
                };
                /**
                 * Create mat3 from composition of scaling and rotation.
                 * @param rota
                 * @param s
                 */
                mat3.fromRS = function (rota, s) {
                    return mat3.Mul(quat.QuatToMtx(rota), mat3.Scale(s.x, s.y, s.z));
                };
                mat3.Mul = function (lhs, rhs) {
                    var m0 = lhs.row(0);
                    var m1 = lhs.row(1);
                    var m2 = lhs.row(2);
                    var n0 = rhs.column(0);
                    var n1 = rhs.column(1);
                    var n2 = rhs.column(2);
                    return new mat3([
                        m0.dot(n0), m1.dot(n0), m2.dot(n0),
                        m0.dot(n1), m1.dot(n1), m2.dot(n1),
                        m0.dot(n2), m1.dot(n2), m2.dot(n2)
                    ]);
                };
                mat3.fromRows = function (r0, r1, r2) {
                    return new mat3([
                        r0.x, r1.x, r2.x,
                        r0.y, r1.y, r2.y,
                        r0.z, r1.z, r2.z
                    ]);
                };
                mat3.fromColumns = function (c0, c1, c2) {
                    return new mat3([
                        c0.x, c0.y, c0.z,
                        c1.x, c1.y, c1.z,
                        c2.x, c2.y, c2.z,
                    ]);
                };
                mat3.prototype.mul = function (rhs) {
                    return mat3.Mul(this, rhs);
                };
                /**
                 * Decompose mat3 into scale and rotation.
                 * @param mat
                 */
                mat3.Decompose = function (mat) {
                    var c0 = mat.column(0);
                    var c1 = mat.column(1);
                    var c2 = mat.column(2);
                    var scale = glmath.vec3(c0.length, c1.length, c2.length);
                    var rota = quat.MtxToQuat(mat3.fromColumns(c0.div(scale.x), c1.div(scale.y), c2.div(scale.z)));
                    return [rota, scale];
                };
                mat3.CrossRHS = function (rhs) {
                    return new mat3([
                        0, -rhs.z, rhs.y,
                        rhs.z, 0, -rhs.x,
                        -rhs.y, rhs.x, 0
                    ]);
                };
                mat3.prototype.mulvec = function (v) {
                    return mat3.MulVec(this, v);
                };
                mat3.MulVec = function (mat, v) {
                    return new vec3([
                        mat.row(0).dot(v),
                        mat.row(1).dot(v),
                        mat.row(2).dot(v),
                    ]);
                };
                mat3.Scale = function (sx, sy, sz) {
                    return new mat3([
                        sx, 0, 0,
                        0, sy, 0,
                        0, 0, sz
                    ]);
                };
                // /**
                //  * Rotation matrix with order Z-Y-X
                //  * @param rx
                //  * @param ry
                //  * @param rz
                //  */
                // public static Rotation(rx:number, ry:number, rz:number): mat3 {
                //     let cosx = Math.cos(rx);
                //     let sinx = Math.sin(rx);
                //     let cosy = Math.cos(ry);
                //     let siny = Math.sin(ry);
                //     let cosz = Math.cos(rz);
                //     let sinz = Math.sin(rz);
                //     return new mat3([
                //         cosy * cosz, sinx * siny * cosz + cosx * sinz, -cosx * siny * cosz + sinx * sinz,
                //         -cosy * sinz, -sinx * siny * sinz + cosx * cosz, cosx * siny * sinz + sinx * cosz,
                //         siny, -sinx * cosy, cosx * cosy
                //     ]);
                // }
                // /**
                //  * Rotation matrix with order Z-Y-X
                //  * @param degx
                //  * @param degy
                //  * @param degz
                //  */
                // public static RotationDeg(degx:number,degy:number,degz:number){
                //     let rx = degx * DEG2RAD;
                //     let ry = degy * DEG2RAD;
                //     let rz = degz * DEG2RAD;
                //     return this.Rotation(rx,ry,rz);
                // }
                /**
                 * Convert quaternion rotation to Matrix
                 * @param q
                 */
                mat3.Rotation = function (q) {
                    return quat.QuatToMtx(q);
                };
                mat3.prototype.clone = function () {
                    var ary = this.raw.splice(0);
                    return new mat3(ary);
                };
                return mat3;
            }());

            var GLContext = /** @class */ (function () {
                function GLContext(wgl) {
                    this.m_drawTexBuffer = new Float32Array(16);
                    this.m_drawTexInited = false;
                    this.gl = wgl;
                }
                GLContext.createFromGL = function (wgl) {
                    return new GLContext(wgl);
                };
                GLContext.createFromCanvas = function (canvas, attrib) {
                    var g = canvas.getContext('webgl2', attrib);
                    if (g == null) {
                        g = canvas.getContext('webgl');
                    }
                    if (g == null)
                        return null;
                    return new GLContext(g);
                };
                GLContext.prototype.createProgram = function (vsource, psource) {
                    var gl = this.gl;
                    var vs = gl.createShader(gl.VERTEX_SHADER);
                    gl.shaderSource(vs, vsource);
                    gl.compileShader(vs);
                    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
                        console.error(vsource);
                        console.error('compile vertex shader failed: ' + gl.getShaderInfoLog(vs));
                        gl.deleteShader(vs);
                        return null;
                    }
                    var ps = gl.createShader(gl.FRAGMENT_SHADER);
                    gl.shaderSource(ps, psource);
                    gl.compileShader(ps);
                    if (!gl.getShaderParameter(ps, gl.COMPILE_STATUS)) {
                        console.error(psource);
                        console.error('compile fragment shader failed: ' + gl.getShaderInfoLog(ps));
                        gl.deleteShader(ps);
                        return null;
                    }
                    var program = gl.createProgram();
                    gl.attachShader(program, vs);
                    gl.attachShader(program, ps);
                    gl.linkProgram(program);
                    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                        console.error('link shader program failed!:' + gl.getProgramInfoLog(program));
                        gl.deleteProgram(program);
                        gl.deleteShader(vs);
                        gl.deleteShader(ps);
                        return null;
                    }
                    if (program == null)
                        return null;
                    var p = new GLProgram(gl, program);
                    return p;
                };
                GLContext.prototype.createTextureImage = function (src, callback) {
                    var img = new Image();
                    var gl = this.gl;
                    var tex = gl.createTexture();
                    img.onload = function () {
                        gl.bindTexture(gl.TEXTURE_2D, tex);
                        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
                        gl.generateMipmap(gl.TEXTURE_2D);
                        gl.bindTexture(gl.TEXTURE_2D, null);
                        console.log('init webgl texture');
                        if (callback != null)
                            callback();
                    };
                    img.src = src;
                    return tex;
                };
                GLContext.prototype.createTextureImageAsync = function (src, min_filter, mag_filter) {
                    return __awaiter(this, void 0, void 0, function () {
                        var gl;
                        return __generator(this, function (_a) {
                            gl = this.gl;
                            return [2 /*return*/, new Promise(function (res, rej) {
                                    var img = new Image();
                                    img.onload = function () {
                                        var tex = gl.createTexture();
                                        try {
                                            gl.bindTexture(gl.TEXTURE_2D, tex);
                                            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
                                            if (min_filter == null) {
                                                min_filter = gl.LINEAR_MIPMAP_LINEAR;
                                            }
                                            if (mag_filter == null) {
                                                mag_filter = gl.LINEAR;
                                            }
                                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, mag_filter);
                                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, min_filter);
                                            gl.generateMipmap(gl.TEXTURE_2D);
                                            gl.bindTexture(gl.TEXTURE_2D, null);
                                            res(tex);
                                        }
                                        catch (e) {
                                            gl.deleteTexture(tex);
                                            rej(e);
                                        }
                                    };
                                    img.onerror = function (ev) {
                                        rej(ev);
                                    };
                                    img.src = src;
                                })];
                        });
                    });
                };
                GLContext.prototype.createTexture = function (internalFormat, width, height, linear, mipmap) {
                    if (linear === void 0) { linear = false; }
                    if (mipmap === void 0) { mipmap = false; }
                    var gl = this.gl;
                    var tex = gl.createTexture();
                    gl.bindTexture(gl.TEXTURE_2D, tex);
                    gl.texStorage2D(gl.TEXTURE_2D, 1, internalFormat, width, height);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, linear ? gl.LINEAR : gl.NEAREST);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, linear ? (mipmap ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR) : gl.NEAREST);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    if (mipmap)
                        gl.generateMipmap(gl.TEXTURE_2D);
                    return tex;
                };
                GLContext.prototype.createFrameBuffer = function (retain, colorInternalFormat, depthInternalFormat, width, height, glfb) {
                    return GLFrameBuffer.create(retain, this, colorInternalFormat, depthInternalFormat, width, height, glfb);
                };
                GLContext.prototype.saveTextureToImage = function (texture) {
                    if (texture == null)
                        return null;
                    var gl = this.gl;
                    if (this.m_tempFrameBuffer == null) {
                        this.m_tempFrameBuffer = gl.createFramebuffer();
                    }
                    var curfb = gl.getParameter(gl.FRAMEBUFFER_BINDING);
                    var curtex = gl.getParameter(gl.TEXTURE_BINDING_2D);
                    gl.bindFramebuffer(gl.FRAMEBUFFER, this.m_tempFrameBuffer);
                    gl.bindTexture(gl.TEXTURE_2D, texture);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
                    var image = this.saveCurrentFrameBufferToImage();
                    gl.bindTexture(gl.TEXTURE_2D, curtex);
                    gl.bindFramebuffer(gl.FRAMEBUFFER, curfb);
                    return image;
                };
                GLContext.prototype.saveCurrentFrameBufferToImage = function (x, y, w, h) {
                    if (x === void 0) { x = 0; }
                    if (y === void 0) { y = 0; }
                    if (w === void 0) { w = null; }
                    if (h === void 0) { h = null; }
                    var gl = this.gl;
                    if (w == null || h == null) {
                        var canvas = gl.canvas;
                        w = canvas.width;
                        h = canvas.height;
                    }
                    var data = new Uint8Array(w * h * 4);
                    gl.readPixels(x, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, data);
                    var tempcanvas = document.createElement('canvas');
                    tempcanvas.width = w;
                    tempcanvas.height = h;
                    var ctx2d = tempcanvas.getContext('2d');
                    var imgdata = ctx2d.createImageData(w, h);
                    imgdata.data.set(data);
                    ctx2d.putImageData(imgdata, 0, 0);
                    var img = new Image();
                    img.src = tempcanvas.toDataURL();
                    return img;
                };
                GLContext.prototype.drawTexCheckInit = function () {
                    if (this.m_drawTexInited)
                        return true;
                    var gl = this.gl;
                    if (this.m_drawTexAryBuffer == null) {
                        this.m_drawTexAryBuffer = gl.createBuffer();
                    }
                    //vs
                    var shadervs = GLShaderComposer.create(exports.GLSL.vs)
                        .attr(exports.GLSL.vec2, 'aPosition')
                        .attr(exports.GLSL.vec2, 'aUV')
                        .vary(exports.GLSL.vec2, 'vUV', exports.GLSL.out)
                        .precision(exports.GLSL.float, exports.GLSL.mediump)
                        .main(function (f) { return f
                        .line('gl_Position = vec4(aPosition,-1.0,1.0)')
                        .line('vUV = aUV'); })
                        .compile();
                    //ps
                    var shaderps = GLShaderComposer.create(exports.GLSL.ps)
                        .uniform(exports.GLSL.sampler2D, 'uSampler')
                        .vary(exports.GLSL.vec2, 'vUV', exports.GLSL.in)
                        .vary(exports.GLSL.vec4, 'fragColor', exports.GLSL.out)
                        .precision(exports.GLSL.float, exports.GLSL.lowp)
                        .main(function (f) { return f
                        .line('fragColor = texture(uSampler,vUV)'); })
                        .compile();
                    //ps color
                    var shaderpsCol = GLShaderComposer.create(exports.GLSL.ps)
                        .precision(exports.GLSL.float, exports.GLSL.lowp)
                        .uniform(exports.GLSL.vec4, 'uColor')
                        .vary(exports.GLSL.vec2, 'vUV', exports.GLSL.in)
                        .vary(exports.GLSL.vec4, 'fragColor', exports.GLSL.out)
                        .main(function (f) { return f.line('fragColor = uColor'); })
                        .compile();
                    {
                        var program = this.createProgram(shadervs, shaderps);
                        if (program == null)
                            throw new Error('Internal shader compile error!');
                        this.m_drawTexProgram = program;
                    }
                    {
                        var program = this.createProgram(shadervs, shaderpsCol);
                        if (program == null)
                            throw new Error('Internal shader compile error!');
                        this.m_drawRectColorProgram = program;
                    }
                    this.m_drawTexInited = true;
                    return true;
                };
                GLContext.prototype.drawTex = function (tex, flipY, retain, viewport) {
                    if (flipY === void 0) { flipY = false; }
                    if (retain === void 0) { retain = true; }
                    var gl = this.gl;
                    if (!gl.isTexture(tex))
                        return;
                    if (!this.drawTexCheckInit()) {
                        console.log('draw tex init failed');
                        return;
                    }
                    var state = retain ? this.savePipeline(gl.ARRAY_BUFFER_BINDING, gl.TEXTURE_BINDING_2D, gl.CULL_FACE) : null;
                    var setViewPort = viewport != null;
                    var vp = null;
                    if (setViewPort) {
                        if (!retain) {
                            vp = gl.getParameter(gl.VIEWPORT);
                        }
                        gl.viewport(viewport.x, viewport.y, viewport.z, viewport.w);
                    }
                    var dataNoFlipped = [
                        -1, 1, 0, 1,
                        1, 1, 1.0, 1,
                        -1, -1, 0, 0,
                        1, -1, 1, 0
                    ];
                    var dataFlipped = [
                        -1, 1, 0, 0,
                        1, 1, 1, 0,
                        -1, -1, 0, 1,
                        1, -1, 1, 1
                    ];
                    gl.disable(gl.CULL_FACE);
                    gl.bindBuffer(gl.ARRAY_BUFFER, this.m_drawTexAryBuffer);
                    this.m_drawTexBuffer.set(flipY ? dataFlipped : dataNoFlipped);
                    gl.bufferData(gl.ARRAY_BUFFER, this.m_drawTexBuffer, gl.STREAM_DRAW);
                    var p = this.m_drawTexProgram;
                    gl.useProgram(p.Program);
                    var attrp = p.Attributes['aPosition'];
                    var attruv = p.Attributes['aUV'];
                    gl.vertexAttribPointer(attrp, 2, gl.FLOAT, false, 16, 0);
                    gl.vertexAttribPointer(attruv, 2, gl.FLOAT, false, 16, 8);
                    gl.enableVertexAttribArray(attrp);
                    gl.enableVertexAttribArray(attruv);
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, tex);
                    gl.uniform1i(p.Uniforms['uSampler'], 0);
                    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
                    if (state != null) {
                        this.restorePipeline(state);
                    }
                    if (setViewPort) {
                        if (!retain) {
                            gl.viewport(vp[0], vp[1], vp[2], vp[3]);
                        }
                    }
                };
                GLContext.prototype.drawTexFullscreen = function (tex, flipY, retain) {
                    if (flipY === void 0) { flipY = false; }
                    if (retain === void 0) { retain = true; }
                    this.drawTex(tex, flipY, retain);
                };
                GLContext.prototype.drawSampleRect = function (retain, x, y, w, h, color) {
                    if (color === void 0) { color = vec4.one; }
                    var gl = this.gl;
                    if (!this.drawTexCheckInit()) {
                        console.log('draw tex init failed');
                        return;
                    }
                    var state = retain ? this.savePipeline(gl.ARRAY_BUFFER_BINDING, gl.TEXTURE_BINDING_2D, gl.CULL_FACE) : null;
                    {
                        var vp = gl.getParameter(gl.VIEWPORT);
                        var vw = vp[2];
                        var vh = vp[3];
                        var dx1 = 2 * x / vw - 1;
                        var dy1 = 2 * y / vh - 1;
                        var dx2 = dx1 + 2 * w / vw;
                        var dy2 = dy1 + 2 * h / vh;
                        gl.disable(gl.CULL_FACE);
                        gl.bindBuffer(gl.ARRAY_BUFFER, this.m_drawTexAryBuffer);
                        this.m_drawTexBuffer.set([
                            dx1, dy2, 0, 1.0,
                            dx2, dy2, 1.0, 1.0,
                            dx1, dy1, 0, 0,
                            dx2, dy1, 1.0, 0
                        ]);
                        gl.bufferData(gl.ARRAY_BUFFER, this.m_drawTexBuffer, gl.STREAM_DRAW);
                        var p = this.m_drawRectColorProgram;
                        gl.useProgram(p.Program);
                        var attrp = p.Attributes['aPosition'];
                        var attruv = p.Attributes['aUV'];
                        gl.vertexAttribPointer(attrp, 2, gl.FLOAT, false, 16, 0);
                        gl.vertexAttribPointer(attruv, 2, gl.FLOAT, false, 16, 8);
                        gl.enableVertexAttribArray(attrp);
                        gl.enableVertexAttribArray(attruv);
                        gl.uniform4fv(p.Uniforms['uColor'], color.raw);
                        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
                    }
                    if (state != null)
                        this.restorePipeline(state);
                };
                GLContext.prototype.savePipeline = function () {
                    var type = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        type[_i] = arguments[_i];
                    }
                    return new (GLPipelineState.bind.apply(GLPipelineState, [void 0, this.gl].concat(type)))();
                };
                GLContext.prototype.restorePipeline = function (state) {
                    if (state == null)
                        return;
                    state.restore(this.gl);
                };
                return GLContext;
            }());

            var GLUtility = /** @class */ (function () {
                function GLUtility() {
                }
                GLUtility.registerOnFrame = function (f) {
                    if (!GLUtility.s_animationFrameRegisted) {
                        window.requestAnimationFrame(GLUtility.onAnimationFrame);
                        GLUtility.s_animationFrameRegisted = true;
                    }
                    GLUtility.s_animationFrameFunc.push(f);
                };
                GLUtility.removeOnFrame = function (f) {
                    var func = GLUtility.s_animationFrameFunc;
                    var index = func.indexOf(f);
                    if (index >= 0) {
                        GLUtility.s_animationFrameFunc = func.splice(index, 1);
                    }
                };
                GLUtility.setTargetFPS = function (fps) {
                    GLUtility.s_targetFPS = fps;
                    GLUtility.s_frameInterval = 1000.0 / fps;
                };
                GLUtility.onAnimationFrame = function (t) {
                    var interval = GLUtility.s_frameInterval;
                    var elapsed = t - GLUtility.s_lastTime;
                    if (elapsed >= interval) {
                        GLUtility.s_lastTime = t - elapsed % interval;
                        var func = GLUtility.s_animationFrameFunc;
                        for (var i = 0, len = func.length; i < len; i++) {
                            func[i](t);
                        }
                    }
                    window.requestAnimationFrame(GLUtility.onAnimationFrame);
                };
                GLUtility.HttpGet = function (url, type) {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, new Promise(function (res, rej) {
                                    var xhr = new XMLHttpRequest();
                                    xhr.responseType = type;
                                    xhr.onload = function (evt) {
                                        if (type == "blob" || type == "arraybuffer") {
                                            res(xhr.response);
                                        }
                                        else {
                                            res(xhr.responseText);
                                        }
                                    };
                                    xhr.onerror = function (evt) {
                                        rej(evt.target);
                                    };
                                    xhr.open("GET", url, true);
                                    xhr.send();
                                })];
                        });
                    });
                };
                GLUtility.loadImage = function (url) {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (url == null)
                                return [2 /*return*/, null];
                            return [2 /*return*/, new Promise(function (res, rej) {
                                    var img = new Image();
                                    img.onload = function () {
                                        res(img);
                                    };
                                    img.onerror = function () {
                                        rej('image load failed');
                                    };
                                    img.src = url;
                                })];
                        });
                    });
                };
                GLUtility.s_animationFrameRegisted = false;
                GLUtility.s_animationFrameFunc = [];
                GLUtility.s_lastTime = 0;
                GLUtility.s_targetFPS = 60;
                GLUtility.s_frameInterval = 1000 / 60.0;
                return GLUtility;
            }());

            var GLTFaccessor = /** @class */ (function () {
                function GLTFaccessor() {
                    this.byteOffset = 0;
                    this.normalized = false;
                }
                return GLTFaccessor;
            }());
            var GLTFanimation = /** @class */ (function () {
                function GLTFanimation() {
                }
                return GLTFanimation;
            }());
            var GLTFanimationSampler = /** @class */ (function () {
                function GLTFanimationSampler() {
                    this.interpolation = "LINEAR";
                }
                return GLTFanimationSampler;
            }());
            var GLTFasset = /** @class */ (function () {
                function GLTFasset() {
                }
                return GLTFasset;
            }());
            var GLTFbuffer = /** @class */ (function () {
                function GLTFbuffer() {
                }
                return GLTFbuffer;
            }());
            var GLTFbufferView = /** @class */ (function () {
                function GLTFbufferView() {
                    this.byteOffset = 0;
                }
                return GLTFbufferView;
            }());
            var GLTFcamera = /** @class */ (function () {
                function GLTFcamera() {
                }
                return GLTFcamera;
            }());
            var GLTFchannel = /** @class */ (function () {
                function GLTFchannel() {
                }
                return GLTFchannel;
            }());
            var GLTFimage = /** @class */ (function () {
                function GLTFimage() {
                }
                return GLTFimage;
            }());
            var GLTFindices = /** @class */ (function () {
                function GLTFindices() {
                    this.byteOffset = 0;
                }
                return GLTFindices;
            }());
            var GLTFmaterial = /** @class */ (function () {
                function GLTFmaterial() {
                    this.emissiveFactor = [0, 0, 0];
                    this.alphaMode = "OPAQUE";
                    this.doubleSided = false;
                }
                return GLTFmaterial;
            }());
            var GLTFmesh = /** @class */ (function () {
                function GLTFmesh() {
                }
                return GLTFmesh;
            }());
            var GLTFnode = /** @class */ (function () {
                function GLTFnode() {
                    this.matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
                    this.rotation = [0, 0, 0, 1];
                    this.scale = [1, 1, 1];
                    this.translation = [0, 0, 0];
                }
                return GLTFnode;
            }());
            var GLTFnormalTextureInfo = /** @class */ (function () {
                function GLTFnormalTextureInfo() {
                    this.texCoord = 0;
                    this.scale = 1;
                }
                return GLTFnormalTextureInfo;
            }());
            var GLTFocclusionTextureInfo = /** @class */ (function () {
                function GLTFocclusionTextureInfo() {
                    this.texCoord = 0;
                    this.strength = 1;
                }
                return GLTFocclusionTextureInfo;
            }());
            var GLTForthographic = /** @class */ (function () {
                function GLTForthographic() {
                }
                return GLTForthographic;
            }());
            var GLTFpbrMetallicRoughness = /** @class */ (function () {
                function GLTFpbrMetallicRoughness() {
                    this.baseColorFactor = [1, 1, 1, 1];
                    this.metallicFactor = 1;
                    this.roughnessFactor = 1;
                }
                return GLTFpbrMetallicRoughness;
            }());
            var GLTFperspective = /** @class */ (function () {
                function GLTFperspective() {
                }
                return GLTFperspective;
            }());
            var GLTFprimitive = /** @class */ (function () {
                function GLTFprimitive() {
                    this.mode = 4;
                }
                return GLTFprimitive;
            }());
            var GLTFsampler = /** @class */ (function () {
                function GLTFsampler() {
                    this.wrapS = 10497;
                    this.wrapT = 10497;
                }
                return GLTFsampler;
            }());
            var GLTFscene = /** @class */ (function () {
                function GLTFscene() {
                }
                return GLTFscene;
            }());
            var GLTFskin = /** @class */ (function () {
                function GLTFskin() {
                }
                return GLTFskin;
            }());
            var GLTFsparse = /** @class */ (function () {
                function GLTFsparse() {
                }
                return GLTFsparse;
            }());
            var GLTFtarget = /** @class */ (function () {
                function GLTFtarget() {
                }
                return GLTFtarget;
            }());
            var GLTFtexture = /** @class */ (function () {
                function GLTFtexture() {
                }
                return GLTFtexture;
            }());
            var GLTFtextureInfo = /** @class */ (function () {
                function GLTFtextureInfo() {
                    this.texCoord = 0;
                }
                return GLTFtextureInfo;
            }());
            var GLTFvalues = /** @class */ (function () {
                function GLTFvalues() {
                    this.byteOffset = 0;
                }
                return GLTFvalues;
            }());
            var GLTFfile = /** @class */ (function () {
                function GLTFfile() {
                }
                return GLTFfile;
            }());
            var GLTFdata = /** @class */ (function () {
                function GLTFdata() {
                }
                return GLTFdata;
            }());
            var GLTFbinary = /** @class */ (function () {
                function GLTFbinary() {
                }
                GLTFbinary.fromBuffer = function (arybuffer) {
                    var dataview = new DataView(arybuffer, 0, arybuffer.byteLength);
                    var pos = 0;
                    var magic = dataview.getUint32(0, true);
                    if (magic != 0x46546C67)
                        return undefined;
                    var data = new GLTFdata();
                    pos += 4;
                    var version = dataview.getUint32(pos, true);
                    pos += 4;
                    var length = dataview.getUint32(pos);
                    pos += 4;
                    pos = this.parseChunk(data, dataview, pos);
                    pos = this.parseChunk(data, dataview, pos);
                    return data;
                };
                GLTFbinary.parseChunk = function (data, dataview, pos) {
                    var chunkLen = dataview.getUint32(pos, true);
                    pos += 4;
                    var chunkType = dataview.getUint32(pos, true);
                    pos += 4;
                    var start = pos;
                    if (chunkType == 0x4E4F534A) {
                        var jsonstr = String.fromCharCode.apply(null, new Uint8Array(dataview.buffer, start, chunkLen));
                        data.gltf = JSON.parse(jsonstr);
                    }
                    else if (chunkType == 0x004E4942) {
                        var binary = dataview.buffer.slice(start, start + chunkLen);
                        data.rawBinary = binary;
                    }
                    else {
                        throw new Error("unknown chunk. ");
                    }
                    pos += chunkLen;
                    return pos;
                };
                return GLTFbinary;
            }());
            var GLTFtool = /** @class */ (function () {
                function GLTFtool() {
                }
                GLTFtool.LoadGLTF = function (json, bin, images) {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, new Promise(function (res, rej) {
                                })];
                        });
                    });
                };
                GLTFtool.LoadGLTFBinary = function (uri) {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, new Promise(function (res, rej) {
                                    var buffer = GLUtility.HttpGet(uri, "arraybuffer");
                                    buffer.then(function (result) {
                                        res(GLTFbinary.fromBuffer(result));
                                    }, function (err) {
                                        rej("load failed");
                                    });
                                })];
                        });
                    });
                };
                return GLTFtool;
            }());

            var debugRegister = {};
            function DebugEntry(cmd) {
                return function (target, funcname, descriptor) {
                    if (target instanceof Function) {
                        debugRegister[cmd] = target[funcname];
                        return;
                    }
                    console.warn('debug entry only support static function.');
                };
            }
            function DebugCmd(cmd, obj) {
                var func = debugRegister[cmd];
                if (func == null) {
                    console.warn("[DebugEntry] no cmd found: " + cmd);
                    return;
                }
                func(obj);
            }
            window['DebugCmd'] = DebugCmd;

            /*! *****************************************************************************
            Copyright (c) Microsoft Corporation. All rights reserved.
            Licensed under the Apache License, Version 2.0 (the "License"); you may not use
            this file except in compliance with the License. You may obtain a copy of the
            License at http://www.apache.org/licenses/LICENSE-2.0

            THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
            KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
            WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
            MERCHANTABLITY OR NON-INFRINGEMENT.

            See the Apache Version 2.0 License for specific language governing permissions
            and limitations under the License.
            ***************************************************************************** */
            /* global Reflect, Promise */

            var extendStatics$1 = function(d, b) {
                extendStatics$1 = Object.setPrototypeOf ||
                    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
                return extendStatics$1(d, b);
            };

            function __extends$1(d, b) {
                extendStatics$1(d, b);
                function __() { this.constructor = d; }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            }

            function __decorate(decorators, target, key, desc) {
                var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
                if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
                else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
                return c > 3 && r && Object.defineProperty(target, key, r), r;
            }

            function __awaiter$1(thisArg, _arguments, P, generator) {
                return new (P || (P = Promise))(function (resolve, reject) {
                    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
                    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
                    function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
                    step((generator = generator.apply(thisArg, _arguments || [])).next());
                });
            }

            function __generator$1(thisArg, body) {
                var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
                return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
                function verb(n) { return function (v) { return step([n, v]); }; }
                function step(op) {
                    if (f) throw new TypeError("Generator is already executing.");
                    while (_) try {
                        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                        if (y = 0, t) op = [op[0] & 2, t.value];
                        switch (op[0]) {
                            case 0: case 1: t = op; break;
                            case 4: _.label++; return { value: op[1], done: false };
                            case 5: _.label++; y = op[1]; op = [0]; continue;
                            case 7: op = _.ops.pop(); _.trys.pop(); continue;
                            default:
                                if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                                if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                                if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                                if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                                if (t[2]) _.ops.pop();
                                _.trys.pop(); continue;
                        }
                        op = body.call(thisArg, _);
                    } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
                    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
                }
            }

            var Delayter = /** @class */ (function () {
                function Delayter(time) {
                    if (time === void 0) { time = 300; }
                    this.m_newEmit = false;
                    this.m_ondelay = false;
                    this.m_time = 300;
                    this.m_time;
                }
                Object.defineProperty(Delayter.prototype, "delaytime", {
                    set: function (t) {
                        this.m_time = t;
                    },
                    enumerable: true,
                    configurable: true
                });
                Delayter.prototype.emit = function (f) {
                    if (f == null)
                        return;
                    this.m_f = f;
                    if (this.m_ondelay == true) {
                        this.m_newEmit = true;
                    }
                    else {
                        this.m_newEmit = false;
                        this.m_ondelay = true;
                        this.delayExec();
                    }
                };
                Delayter.prototype.delayExec = function () {
                    var self = this;
                    setTimeout(function () {
                        if (self.m_newEmit) {
                            self.m_newEmit = false;
                            self.delayExec();
                        }
                        else {
                            self.m_f();
                            self.m_ondelay = false;
                        }
                    }, this.m_time);
                };
                return Delayter;
            }());
            var Utility = /** @class */ (function () {
                function Utility() {
                }
                /**
                 * Simple hash function
                 * @param str
                 */
                Utility.Hashfnv32a = function (str) {
                    var FNV1_32A_INIT = 0x811c9dc5;
                    var hval = FNV1_32A_INIT;
                    for (var i = 0; i < str.length; ++i) {
                        hval ^= str.charCodeAt(i);
                        hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
                    }
                    return hval >>> 0;
                };
                /**
                 * Deep clone map object
                 * @param map
                 */
                Utility.cloneMap = function (map, itemclone) {
                    if (map == null)
                        return null;
                    var ret = {};
                    if (itemclone) {
                        for (var key in map) {
                            var val = map[key];
                            ret[key] = itemclone(val);
                        }
                    }
                    else {
                        for (var key in map) {
                            ret[key] = map[key];
                        }
                    }
                    return ret;
                };
                Utility.randomColor = function () {
                    return glmath.vec4(Math.random(), Math.random(), Math.random(), 1);
                };
                return Utility;
            }());

            var ShaderPreprocessor = /** @class */ (function () {
                function ShaderPreprocessor() {
                }
                ShaderPreprocessor.processVariantInclude = function (line, lineindex) {
                    var match = ShaderPreprocessor.REGEX_INCLUDE;
                    var matchInc = line.match(match);
                    if (matchInc != null) {
                        return { key: matchInc[1], line: lineindex };
                    }
                    return null;
                };
                /**
                 * Process shader source #include macros
                 * @param line
                 * @param variants
                 * @returns line:string variantName:string
                 */
                ShaderPreprocessor.processSourceInclude = function (line, variants) {
                    var match = /#include ([\w]+)/;
                    var matchInc = line.match(match);
                    if (matchInc != null) {
                        var vname = matchInc[1];
                        var variant = variants[vname];
                        if (variant == null) {
                            throw new Error("shader variant [" + vname + "] not found!");
                        }
                        if (!variant.linked)
                            throw new Error("shader variant [" + vname + "] not linked!");
                        return [variant.sources, vname];
                    }
                    return null;
                };
                ShaderPreprocessor.processOptions = function (line) {
                    var match = ShaderPreprocessor.REGEX_OPTIONS;
                    if (!line.match(match)) {
                        return null;
                    }
                    var linet = line.trim();
                    var options = linet.substr(8);
                    var parts = options.split(' ');
                    if (parts == null || parts.length == 0)
                        throw new Error("invalid #options " + line);
                    var validopts = [];
                    for (var i = 0, len = parts.length; i < len; i++) {
                        var item = parts[i].trim();
                        if (item == '')
                            continue;
                        validopts.push(item);
                    }
                    var validlen = validopts.length;
                    if (validlen == 0 || validlen == 1)
                        throw new Error("invalid #options " + line);
                    if (validlen == 2) {
                        var val = validopts[1];
                        if (val != 'ON' && val != 'OFF')
                            throw new Error("invalid #options " + line);
                        var opt = new ShaderOptions();
                        opt.flag = validopts[0];
                        opt.default = val;
                        opt.values = ['ON', 'OFF'];
                        return ['//' + line, opt];
                    }
                    else {
                        var opt = new ShaderOptions();
                        opt.flag = validopts[0];
                        opt.default = validopts[1];
                        opt.values = validopts.slice(1);
                        return ['//' + line, opt];
                    }
                };
                ShaderPreprocessor.REGEX_INCLUDE = /#include ([\w]+)/;
                ShaderPreprocessor.REGEX_OPTIONS = /^[\s]*#options/;
                return ShaderPreprocessor;
            }());

            var ShaderVariant = /** @class */ (function () {
                function ShaderVariant(variantName, source) {
                    this.includes = [];
                    this.linked = false;
                    this.options = [];
                    this.variantName = variantName;
                    this.process(variantName, source);
                }
                Object.defineProperty(ShaderVariant.prototype, "sources", {
                    get: function () {
                        return this.m_sources;
                    },
                    enumerable: true,
                    configurable: true
                });
                ShaderVariant.prototype.link = function (variances) {
                    if (this.linked)
                        return;
                    var includes = this.includes;
                    if (includes.length == 0) {
                        this.linked = true;
                    }
                    else {
                        for (var i = 0, len = includes.length; i < len; i++) {
                            var inc = includes[i];
                            var lib = variances[inc.key];
                            if (lib == null) {
                                throw new Error("can't find variant : [" + inc.key + "]");
                            }
                            if (!lib.linked) {
                                lib.link(variances);
                            }
                            if (!lib.linked) {
                                throw new Error("variance [" + lib.variantName + "] link: failed");
                            }
                            this.lines[inc.line] = lib.sources;
                        }
                        this.linked = true;
                    }
                    this.m_sources = this.lines.join('\n');
                    console.log("link success " + this.variantName);
                };
                ShaderVariant.prototype.process = function (variantName, source) {
                    source = "\n        #ifndef " + variantName + "\n        #define " + variantName + "\n        " + source + "\n        #endif\n        ";
                    var lines = source.split('\n');
                    for (var i = 0, len = lines.length; i < len; i++) {
                        var line = lines[i];
                        var pinclude = ShaderPreprocessor.processVariantInclude(line, i);
                        if (pinclude != null) {
                            this.includes.push(pinclude);
                            continue;
                        }
                        var poptions = ShaderPreprocessor.processOptions(line);
                        if (poptions != null) {
                            lines[i] = poptions[0];
                            this.options.push(poptions[1]);
                            continue;
                        }
                    }
                    this.lines = lines;
                };
                return ShaderVariant;
            }());
            var ShaderOptions = /** @class */ (function () {
                function ShaderOptions(flag, val) {
                    this.flag = flag;
                    this.default = val;
                }
                return ShaderOptions;
            }());
            var ShaderOptionsConfig = /** @class */ (function () {
                function ShaderOptionsConfig(opts) {
                    this.m_hashCode = 0;
                    this.m_dirty = false;
                    this.m_optmap = {};
                    if (opts == null)
                        return;
                    this.m_options = opts;
                    var optmap = this.m_optmap;
                    for (var i = 0, len = opts.length; i < len; i++) {
                        var opt = opts[i];
                        optmap[opt.flag] = opt.default;
                    }
                    this.compileOptions();
                }
                ShaderOptionsConfig.prototype.getFlag = function (key) {
                    return this.m_optmap[key];
                };
                ShaderOptionsConfig.prototype.verifyFlag = function (key, value) {
                    var curval = this.m_optmap[key];
                    if (curval == null) {
                        console.warn("invalid shader option flag: [" + key + "]");
                        return false;
                    }
                    var options = this.m_options;
                    for (var i = 0, len = options.length; i < len; i++) {
                        var opt = options[i];
                        if (opt.flag === key) {
                            if (opt.values.indexOf(value) >= 0) {
                                return true;
                            }
                            else {
                                console.warn("invalid shader option value : [" + key + ": " + value + "]");
                                return false;
                            }
                        }
                    }
                };
                ShaderOptionsConfig.prototype.setFlag = function (key, value) {
                    this.m_optmap[key] = value;
                    this.m_dirty = true;
                    return true;
                };
                Object.defineProperty(ShaderOptionsConfig.prototype, "hashCode", {
                    get: function () {
                        if (this.m_dirty) {
                            this.compileOptions();
                        }
                        return this.m_hashCode;
                    },
                    enumerable: true,
                    configurable: true
                });
                ShaderOptionsConfig.prototype.compileOptions = function () {
                    this.m_dirty = false;
                    var flags = '';
                    var hashstr = [];
                    var optmap = this.m_optmap;
                    for (var key in optmap) {
                        var val = optmap[key];
                        if (val == null)
                            throw new Error("shader flag is null [" + key + "]");
                        var hash = " " + key + "_" + val;
                        hashstr.push(hash);
                        var flag = "#define " + hash + "\n";
                        flags += flag;
                    }
                    this.m_compileFlags = flags;
                    this.calculateHashCode(hashstr);
                };
                ShaderOptionsConfig.prototype.calculateHashCode = function (hashstr) {
                    hashstr.sort();
                    this.m_hashCode = Utility.Hashfnv32a(hashstr.join(' '));
                };
                Object.defineProperty(ShaderOptionsConfig.prototype, "compileFlag", {
                    get: function () {
                        if (this.m_dirty) {
                            this.compileOptions();
                        }
                        return this.m_compileFlags;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Deep Clone
                 */
                ShaderOptionsConfig.prototype.clone = function () {
                    var optconfig = new ShaderOptionsConfig();
                    optconfig.m_hashCode = this.m_hashCode;
                    optconfig.m_dirty = this.m_dirty;
                    optconfig.m_options = this.m_options;
                    optconfig.m_compileFlags = this.m_compileFlags;
                    optconfig.m_optmap = Utility.cloneMap(this.m_optmap);
                    return optconfig;
                };
                return ShaderOptionsConfig;
            }());

            var RenderQueue;
            (function (RenderQueue) {
                RenderQueue[RenderQueue["Opaque"] = 0] = "Opaque";
                RenderQueue[RenderQueue["Transparent"] = 1] = "Transparent";
                RenderQueue[RenderQueue["Skybox"] = 2] = "Skybox";
                RenderQueue[RenderQueue["Image"] = 3] = "Image";
                RenderQueue[RenderQueue["Other"] = 4] = "Other";
            })(RenderQueue || (RenderQueue = {}));
            var Comparison;
            (function (Comparison) {
                Comparison[Comparison["NEVER"] = 512] = "NEVER";
                Comparison[Comparison["LESS"] = 513] = "LESS";
                Comparison[Comparison["EQUAL"] = 514] = "EQUAL";
                Comparison[Comparison["LEQUAL"] = 515] = "LEQUAL";
                Comparison[Comparison["GREATER"] = 516] = "GREATER";
                Comparison[Comparison["NOTEQUAL"] = 517] = "NOTEQUAL";
                Comparison[Comparison["GEQUAL"] = 518] = "GEQUAL";
                Comparison[Comparison["ALWAYS"] = 519] = "ALWAYS";
            })(Comparison || (Comparison = {}));
            var BlendOperator;
            (function (BlendOperator) {
                BlendOperator[BlendOperator["ADD"] = 32774] = "ADD";
                BlendOperator[BlendOperator["MIN"] = 32775] = "MIN";
                BlendOperator[BlendOperator["MAX"] = 32776] = "MAX";
                BlendOperator[BlendOperator["SUBTRACT"] = 32778] = "SUBTRACT";
                BlendOperator[BlendOperator["RESERVE_SUBSTRACT"] = 32779] = "RESERVE_SUBSTRACT";
            })(BlendOperator || (BlendOperator = {}));
            var BlendFactor;
            (function (BlendFactor) {
                BlendFactor[BlendFactor["ONE"] = 1] = "ONE";
                BlendFactor[BlendFactor["ZERO"] = 0] = "ZERO";
                BlendFactor[BlendFactor["SRC_COLOR"] = 768] = "SRC_COLOR";
                BlendFactor[BlendFactor["ONE_MINUS_SRC_COLOR"] = 769] = "ONE_MINUS_SRC_COLOR";
                BlendFactor[BlendFactor["SRC_ALPHA"] = 770] = "SRC_ALPHA";
                BlendFactor[BlendFactor["ONE_MINUS_SRC_ALPHA"] = 771] = "ONE_MINUS_SRC_ALPHA";
                BlendFactor[BlendFactor["DST_ALPHA"] = 772] = "DST_ALPHA";
                BlendFactor[BlendFactor["ONE_MINUS_DST_ALPHA"] = 773] = "ONE_MINUS_DST_ALPHA";
                BlendFactor[BlendFactor["DST_COLOR"] = 774] = "DST_COLOR";
                BlendFactor[BlendFactor["ONE_MINUS_DST_COLOR"] = 775] = "ONE_MINUS_DST_COLOR";
                BlendFactor[BlendFactor["SRC_ALPHA_SATURATE"] = 776] = "SRC_ALPHA_SATURATE";
                BlendFactor[BlendFactor["CONSTANT_ALPHA"] = 32771] = "CONSTANT_ALPHA";
                BlendFactor[BlendFactor["ONE_MINUS_CONSTANT_ALPHA"] = 32772] = "ONE_MINUS_CONSTANT_ALPHA";
                BlendFactor[BlendFactor["CONSTANT_COLOR"] = 32769] = "CONSTANT_COLOR";
                BlendFactor[BlendFactor["ONE_MINUS_CONSTANT_COLOR"] = 32770] = "ONE_MINUS_CONSTANT_COLOR";
            })(BlendFactor || (BlendFactor = {}));
            var CullingMode;
            (function (CullingMode) {
                CullingMode[CullingMode["Front"] = 1028] = "Front";
                CullingMode[CullingMode["Back"] = 1029] = "Back";
                CullingMode[CullingMode["FRONT_AND_BACK"] = 1032] = "FRONT_AND_BACK";
                CullingMode[CullingMode["None"] = 2884] = "None";
            })(CullingMode || (CullingMode = {}));
            var ShaderTags = /** @class */ (function () {
                function ShaderTags() {
                    this.blend = false;
                }
                ShaderTags.prototype.clone = function () {
                    var tags = new ShaderTags();
                    tags.queue = this.queue;
                    tags.ztest = this.ztest;
                    tags.zwrite = this.zwrite;
                    tags.blendOp = this.blendOp;
                    tags.blendFactorDst = this.blendFactorDst;
                    tags.blendFactorSrc = this.blendFactorSrc;
                    tags.culling = this.culling;
                    return tags;
                };
                ShaderTags.prototype.fillDefaultVal = function () {
                    if (this.queue == null)
                        this.queue = RenderQueue.Opaque;
                    if (this.zwrite == null)
                        this.zwrite = true;
                    if (this.ztest == null)
                        this.ztest = Comparison.LEQUAL;
                    if (this.culling == null)
                        this.culling = CullingMode.Back;
                    if (this.blendOp == null)
                        this.blendOp = BlendOperator.ADD;
                    if (this.blendFactorSrc == null)
                        this.blendFactorSrc = BlendFactor.SRC_ALPHA;
                    if (this.blendFactorDst == null)
                        this.blendFactorDst = BlendFactor.ONE_MINUS_SRC_ALPHA;
                };
                return ShaderTags;
            }());
            var Shader = /** @class */ (function () {
                function Shader(source, defaultProgram, defOptConfig, glctx) {
                    this.m_compiledPrograms = {};
                    this.m_source = source;
                    this.m_defaultProgram = defaultProgram;
                    this.m_defaultOptionsConfig = defOptConfig;
                    this.m_compiledPrograms[defOptConfig.hashCode] = defaultProgram;
                    this.m_glctx = glctx;
                }
                Object.defineProperty(Shader.prototype, "source", {
                    get: function () {
                        return this.m_source;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Shader.prototype, "defaultProgram", {
                    get: function () {
                        return this.m_defaultProgram;
                    },
                    enumerable: true,
                    configurable: true
                });
                Shader.prototype.getVariantProgram = function (optconfig) {
                    if (optconfig == null)
                        throw new Error('optconfig is null');
                    var hash = optconfig.hashCode;
                    var cachedProgram = this.m_compiledPrograms[hash];
                    if (cachedProgram != null) {
                        return cachedProgram;
                    }
                    else {
                        var source = this.source;
                        var _a = source.injectCompileFlags(optconfig.compileFlag), vs = _a[0], ps = _a[1];
                        var program = this.m_glctx.createProgram(vs, ps);
                        if (program == null)
                            throw new Error("compile program failed");
                        this.m_compiledPrograms[hash] = program;
                        console.log("program hash " + hash);
                        return program;
                    }
                };
                Shader.prototype.release = function () {
                    this.m_glctx = null;
                };
                return Shader;
            }());

            var ShaderSource = /** @class */ (function () {
                function ShaderSource(vs, ps) {
                    this.m_built = false;
                    this.m_shaderTag = null;
                    this.optionsList = [];
                    this.ps = ps;
                    this.vs = vs;
                }
                Object.defineProperty(ShaderSource.prototype, "isBuilt", {
                    get: function () {
                        return this.m_built;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ShaderSource.prototype, "vertex", {
                    get: function () {
                        return this.vs;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ShaderSource.prototype, "pixel", {
                    get: function () {
                        return this.ps;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ShaderSource.prototype, "tags", {
                    get: function () {
                        return this.m_shaderTag;
                    },
                    enumerable: true,
                    configurable: true
                });
                ShaderSource.prototype.buildShader = function (v) {
                    if (this.m_built)
                        return true;
                    var gen_vs = this.ProcessShader(this.vs, v);
                    var gen_ps = this.ProcessShader(this.ps, v);
                    this.ps = gen_ps;
                    this.vs = gen_vs;
                    this.m_built = true;
                    return true;
                };
                ShaderSource.prototype.addVariant = function (vname) {
                    if (this.variants == null) {
                        this.variants = [];
                        this.variants.push(vname);
                        return true;
                    }
                    var variants = this.variants;
                    if (variants.indexOf(vname) < 0) {
                        variants.push(vname);
                        return true;
                    }
                    return false;
                };
                ShaderSource.prototype.addOptions = function (variant) {
                    var options = variant.options;
                    if (options == null)
                        return;
                    var optlist = this.optionsList;
                    for (var i = 0, len = options.length; i < len; i++) {
                        optlist.push(options[i]);
                    }
                };
                ShaderSource.prototype.ProcessShader = function (source, variants) {
                    var lines = source.split('\n');
                    for (var i = 0, len = lines.length; i < len; i++) {
                        var line = lines[i];
                        var pinclude = ShaderPreprocessor.processSourceInclude(line, variants);
                        if (pinclude != null) {
                            lines[i] = pinclude[0];
                            var vname = pinclude[1];
                            var added = this.addVariant(vname);
                            if (added)
                                this.addOptions(variants[vname]);
                            continue;
                        }
                        var poptions = ShaderPreprocessor.processOptions(line);
                        if (poptions != null) {
                            lines[i] = poptions[0];
                            this.optionsList.push(poptions[1]);
                            continue;
                        }
                        lines[i] = this.processShaderTag(line);
                    }
                    return lines.join('\n').trim();
                };
                ShaderSource.prototype.processShaderTag = function (line) {
                    line = line.trim();
                    var tags = this.m_shaderTag;
                    var regex2 = /#(ztest|zwrite|queue) ([\w]+)/;
                    var match = line.match(regex2);
                    if (match != null) {
                        if (tags == null) {
                            tags = new ShaderTags();
                            this.m_shaderTag = tags;
                        }
                        var tagtype = match[1].toLowerCase();
                        var tagval = match[2].toUpperCase();
                        switch (tagtype) {
                            case "ztest":
                                this.setShaderTagProperty('ztest', tagval, Comparison);
                                break;
                            case "zwrite":
                                {
                                    var val = tagval === 'OFF' ? 0 : (tagval === "ON" ? 1 : -1);
                                    if (val == -1) {
                                        throw new Error("invalid zwrite tag [" + match[2] + "]");
                                    }
                                    var newval = val == 1;
                                    if (tags.zwrite == null || tags.zwrite == newval) {
                                        tags.zwrite = newval;
                                    }
                                    else {
                                        throw new Error("zwrite tag conflict");
                                    }
                                }
                                break;
                            case "queue":
                                tagval = tagval.charAt(0).toUpperCase() + match[2].slice(1);
                                this.setShaderTagProperty('queue', tagval, RenderQueue);
                                break;
                            case "cull":
                                {
                                    var cullingmode = CullingMode.Back;
                                    switch (tagval) {
                                        case "ALL":
                                            cullingmode = CullingMode.FRONT_AND_BACK;
                                            break;
                                        case "BACK":
                                            cullingmode = CullingMode.Back;
                                            break;
                                        case "FRONT":
                                            cullingmode = CullingMode.Front;
                                            break;
                                        case "NONE":
                                            cullingmode = CullingMode.None;
                                            break;
                                        default:
                                            throw new Error('invalid culling mode');
                                    }
                                    if (tags.culling == null) {
                                        tags.culling = cullingmode;
                                    }
                                    else {
                                        if (tags.culling != cullingmode) {
                                            throw new Error("culling mode confliect : " + cullingmode + " " + tags.culling);
                                        }
                                    }
                                }
                            default:
                                throw new Error("unknown shader tag [" + line + "]");
                        }
                        line = '';
                    }
                    var regexblend = /#blend ([\w]+) ([\w]+)[\s]*([\w]+)*/;
                    match = line.match(regexblend);
                    if (match != null) {
                        if (tags == null) {
                            tags = new ShaderTags();
                            this.m_shaderTag = tags;
                        }
                        var tarfs = match[1].toUpperCase();
                        var tarfd = match[2].toUpperCase();
                        var tarop = match[3].toLocaleUpperCase();
                        if (tarop == null) {
                            tarop = 'ADD';
                        }
                        else {
                            var op = BlendOperator[tarop];
                            if (op == null)
                                throw new Error("invalid blend operator [" + tarop + "]");
                        }
                        var fs = BlendFactor[tarfs];
                        var fd = BlendFactor[tarfd];
                        if (fs == null)
                            throw new Error("invalid blend factor [" + match[1] + "]");
                        if (fd == null)
                            throw new Error("invalid blend factor [" + match[2] + "]");
                        var newop = BlendFactor[tarop];
                        if (tags.blendOp != null && (tags.blendOp != newop || tags.blendFactorDst != fd || tags.blendFactorSrc != fs)) {
                            throw new Error("bleng tag conflict [" + line + "]");
                        }
                        else {
                            tags.blendOp = newop;
                            tags.blendFactorSrc = fs;
                            tags.blendFactorDst = fd;
                        }
                        line = '';
                    }
                    return line;
                };
                ShaderSource.prototype.setShaderTagProperty = function (pname, tagval, enumtype) {
                    var tags = this.m_shaderTag;
                    var val = enumtype[tagval];
                    if (val == undefined) {
                        throw new Error("invalid " + pname + " tag [" + tagval + "]");
                    }
                    if (tags[pname] == null) {
                        tags[pname] = val;
                    }
                    else {
                        if (tags[pname] != val) {
                            throw new Error(pname + " tag conflict [" + Comparison[tags[pname]] + "] [" + tagval + "]");
                        }
                    }
                };
                ShaderSource.prototype.injectCompileFlags = function (flags) {
                    var prefix = '#version 300 es';
                    flags = prefix + '\n' + flags;
                    var vs = this.vs;
                    var ps = this.pixel;
                    if (!vs.startsWith(prefix)) {
                        vs = flags + vs;
                    }
                    else {
                        vs = flags + vs.slice(15);
                    }
                    if (!ps.startsWith(prefix)) {
                        ps = flags + ps;
                    }
                    else {
                        ps = flags + ps.slice(15);
                    }
                    return [vs, ps];
                };
                return ShaderSource;
            }());

            var ShaderGen = /** @class */ (function () {
                function ShaderGen() {
                }
                ShaderGen.SHADERFX_BASIS = "#define PI 3.1415926\n#define PI_2 6.2831852\n#define PI_HALF 1.5707963\n\n#include SHADERFX_OBJ\n#include SHADERFX_CAMERA\nvec3 ObjToWorldDir(in vec3 dir){\n    return normalize(dir * mat3(MATRIX_WORLD2OBJ));\n}\n\nfloat SAMPLE_DEPTH_TEXTURE(sampler2D depthtex,vec2 uv){\n    return texture(depthtex,uv).r;\n}\n\nfloat DECODE_VIEWDEPTH(float d){\n    return 1.0/ ((CAMERA_NEAR_INV - CAMERA_FAR_INV) * d  - CAMERA_NEAR_INV);\n}\n\nvec4 ClipToWorld(in vec4 clippoint){\n    return inverse(MATRIX_VP) * clippoint;\n}\n\n";
                ShaderGen.SHADERFX_CAMERA = "#include SHADERFX_OBJ\nuniform UNIFORM_CAM{\n    mat4 _world2view_;\n    mat4 _view2proj_;\n    vec4 _camerapos_;\n    vec4 _projparam_; //[near,far,1/near,1/far]\n    vec4 _screenparam_;//[width,height,1/wdith,1/height]\n};\n#define MATRIX_V _world2view_\n#define MATRIX_P _view2proj_\n#define MATRIX_VP MATRIX_P * MATRIX_V\n#define MATRIX_MV MATRIX_V * MATRIX_M\n#define MATRIX_IT_MV transpose(inverse(MATRIX_MV))\n#define MATRIX_MVP MATRIX_P * MATRIX_MV\n#define MATRIX_WORLD2OBJ inverse(MATRIX_M)\n#define CAMERA_POS _camerapos_\n#define CAMERA_NEAR _projparam_.x\n#define CAMERA_FAR _projparam_.y\n#define CAMERA_NEAR_INV _projparam_.z\n#define CAMERA_FAR_INV _projparam_.w\n#define SCREEN_WIDTH _screenparam_.x\n#define SCREEN_HEIGHT _screenparam_.y\n#define SCREEN_WIDTH_INV _screenparam_.z\n#define SCREEN_HEIGHT_INV _screenparam_.w\n#";
                ShaderGen.SHADERFX_LIGHT = "struct LIGHT_DATA{\n    vec4 pos_type;\n    vec4 col_intensity;\n};\nuniform LIGHT{\n    LIGHT_DATA light_source[4];\n    vec4 ambient_color;\n};\n#define LIGHT_COLOR0 light_source[0].col_intensity.xyz\n#define LIGHT_COLOR1 light_source[1].col_intensity.xyz\n#define LIGHT_COLOR2 light_source[2].col_intensity.xyz\n#define LIGHT_COLOR3 light_source[3].col_intensity.xyz\n\n#define LIGHT_INTENSITY0 light_source[0].col_intensity.w\n#define LIGHT_INTENSITY1 light_source[1].col_intensity.w\n#define LIGHT_INTENSITY2 light_source[2].col_intensity.w\n#define LIGHT_INTENSITY3 light_source[3].col_intensity.w\n\n#define LIGHT_DIR0 light_source[0].pos_type.xyz\n#define LIGHT_DIR1 light_source[1].pos_type.xyz";
                ShaderGen.SHADERFX_LIGHTING = "vec3 LightModel_Lambert(vec3 lightdir,vec3 lightColor,vec3 normal,vec3 albedo){\n    float diff = max(.0,dot(lightdir,normal));\n    return albedo * lightColor * diff;\n}";
                ShaderGen.SHADERFX_OBJ = "uniform UNIFORM_OBJ{\n    mat4 _obj2world_;\n};\n#define MATRIX_M _obj2world_";
                ShaderGen.SHADERFX_SHADOWMAP = "#options SMCASCADE NONE TWO FOUR\n#options SHADOW ON OFF\n\n#ifdef SHADOW_ON\n\nuniform UNIFORM_SHADOWMAP{\n    mat4 uLightMtx[4];\n    float uShadowDist;\n};\nuniform sampler2D uShadowMap;\n\nfloat computeShadow(vec4 vLightPos,sampler2D shadowsampler){\n    vec3 clipspace = vLightPos.xyz / vLightPos.w;\n    clipspace = clipspace *0.5 + 0.5;\n    float shadowDep = texture(shadowsampler,vec2(clipspace.xy)).x;\n    \n    //fix shadowmpa edge clamp\n    vec2 border = step(clipspace.xy,vec2(0.002));\n    border += step(vec2(0.998),clipspace.xy);\n    shadowDep += (border.x + border.y);\n\n    return step(clipspace.z- 0.01,shadowDep);\n}\n\nfloat computeShadowPoisson(vec4 vLightPos,sampler2D shadowsampler){\n    vec3 clipspace = vLightPos.xyz / vLightPos.w;\n    clipspace = clipspace *0.5 + 0.5;\n\n    vec2 coord = clipspace.xy;\n    float curdepth = clipspace.z - 0.01;\n    float visibility = 1.0;\n\n    float mapsize = 1.0/1024.0;\n\n    vec2 poissonDisk[4];\n        poissonDisk[0] = vec2(-0.94201624, -0.39906216);\n        poissonDisk[1] = vec2(0.94558609, -0.76890725);\n        poissonDisk[2] = vec2(-0.094184101, -0.92938870);\n        poissonDisk[3] = vec2(0.34495938, 0.29387760);\n\n    if(texture(shadowsampler,coord + poissonDisk[0] * mapsize).r <curdepth) visibility -=0.25;\n    if(texture(shadowsampler,coord + poissonDisk[1] * mapsize).r <curdepth) visibility -=0.25;\n    if(texture(shadowsampler,coord + poissonDisk[2] * mapsize).r <curdepth) visibility -=0.25;\n    if(texture(shadowsampler,coord + poissonDisk[3] * mapsize).r <curdepth) visibility -=0.25;\n    return visibility;\n}\n\nfloat computeShadowPCF3(vec4 vLightPos,sampler2DShadow shadowsampler){\n    vec3 clipspace = vLightPos.xyz / vLightPos.w;\n    clipspace = clipspace *0.5 + 0.5;\n\n    vec2 shadowMapSizeInv = vec2(1024.0,1.0/1024.0);\n\n    float curdepth = clipspace.z;\n\n    vec2 uv = clipspace.xy *shadowMapSizeInv.x;\n    uv += 0.5;\n    vec2 st = fract(uv);\n    vec2 base_uv = floor(uv) - 0.5;\n    base_uv *= shadowMapSizeInv.y;\n\n    vec2 uvw0 = 3. - 2. * st;\n    vec2 uvw1 = 1. + 2. * st;\n    vec2 u = vec2((2. - st.x) / uvw0.x - 1., st.x / uvw1.x + 1.) * shadowMapSizeInv.y;\n    vec2 v = vec2((2. - st.y) / uvw0.y - 1., st.y / uvw1.y + 1.) * shadowMapSizeInv.y;\n\n    float shadow = 0.;\n    shadow += uvw0.x * uvw0.y * texture(shadowsampler, vec3(base_uv.xy + vec2(u[0], v[0]), curdepth));\n    shadow += uvw1.x * uvw0.y * texture(shadowsampler, vec3(base_uv.xy + vec2(u[1], v[0]), curdepth));\n    shadow += uvw0.x * uvw1.y * texture(shadowsampler, vec3(base_uv.xy + vec2(u[0], v[1]), curdepth));\n    shadow += uvw1.x * uvw1.y * texture(shadowsampler, vec3(base_uv.xy + vec2(u[1], v[1]), curdepth));\n    shadow = shadow / 16.;\n    return shadow;\n}\n\n#endif";
                ShaderGen.depth_ps = "#version 300 es\n\nprecision mediump float;\n\nvoid main(){\n}";
                ShaderGen.depth_vs = "#version 300 es\n\nprecision mediump float;\n\n#include SHADERFX_BASIS\n#queue other\n\nin vec4 aPosition;\n\nvoid main(){\n    gl_Position = MATRIX_MVP * aPosition;\n}";
                ShaderGen.diffuse_ps = "#version 300 es\n\nprecision mediump float;\n#include SHADERFX_LIGHT\n#include SHADERFX_LIGHTING\nstruct V2F{\n    vec3 pos;\n    vec3 normal;\n};\nin V2F v2f;\nout lowp vec4 fragColor;\nuniform vec4 uColor;\nvoid main(){\n    vec3 lcolor = LightModel_Lambert(LIGHT_DIR0,LIGHT_COLOR0,v2f.normal,uColor.xyz);\n    fragColor = vec4(lcolor +0.1,1.0);\n}";
                ShaderGen.diffuse_vs = "#version 300 es\n\nprecision mediump float;\n#include SHADERFX_BASIS\n\n#queue opaque\n\nin vec4 aPosition;\nin vec2 aUV;\nin vec4 aNormal;\nstruct V2F{\n    vec3 pos;\n    vec3 normal;\n};\nout V2F v2f;\nvoid main(){\n    vec4 wpos = MATRIX_M * aPosition;\n    v2f.pos = wpos.xyz;\n    vec4 pos = MATRIX_VP * wpos;\n    gl_Position = pos;\n    v2f.normal = ObjToWorldDir(aNormal.xyz);\n}";
                ShaderGen.gizmos_ps = "#version 300 es\n\nprecision mediump float;\nout vec4 fragColor;\nvoid main(){\n    fragColor = vec4(1.0);\n}";
                ShaderGen.gizmos_vs = "#version 300 es\n\nprecision mediump float;\n\n#include SHADERFX_BASIS\n#queue other\n\nin vec4 aPosition;\n\nvoid main(){\n    vec4 vpos = aPosition;\n    gl_Position = MATRIX_MVP * vpos;\n}";
                ShaderGen.pbrMetallicRoughness_ps = "#version 300 es\n\nprecision mediump float;\n#include SHADERFX_SHADOWMAP\n\nin vec2 vUV;\n\n#ifdef SHADOW_ON\nin vec4 lpos;\n#endif\n\nuniform uPBR{\n    vec4 uColor;\n    float uMetallic;\n    float uRoughness;\n    float uEmissive;\n};\n\nuniform sampler2D uSampler;\nuniform sampler2D uTexMetallicRoughness;\nuniform sampler2D uTexEmissive;\n\nout vec4 fragColor;\nvoid main(){\n\n    #ifdef SHADOW_ON\n    float shadow = computeShadow(lpos,uShadowMap);\n    fragColor = texture(uSampler,vUV) * clamp(shadow+0.2,0.0,1.0);\n    #else\n    fragColor = texture(uSampler,vUV);\n    #endif\n\n}";
                ShaderGen.pbrMetallicRoughness_vs = "#version 300 es\n\nprecision mediump float;\n#include SHADERFX_BASIS\n#include SHADERFX_SHADOWMAP\n\n#queue opaque\n\nin vec3 aPosition;\nin vec3 aNormal;\nin vec2 aUV;\n\nout vec2 vUV;\n\n#ifdef SHADOW_ON\nout vec4 lpos;\n#endif\n\n\nvoid main(){\n    #ifdef SHADOW_ON\n    vec4 wpos = MATRIX_M * vec4(aPosition,1.0);\n    lpos = uLightMtx[0] * wpos;\n    gl_Position = MATRIX_VP * wpos;\n    #else\n    gl_Position = MATRIX_MVP * vec4(aPosition,1.0);\n    #endif\n    vUV = aUV;\n}";
                ShaderGen.shadowsGather_ps = "#version 300 es\n\nprecision mediump float;\n\n#include SHADERFX_BASIS\n#include SHADERFX_SHADOWMAP\n\nout vec4 fragColor;\n\nuniform sampler2D uDepthTexure;\n\nin vec2 vUV;\nin vec3 vvdir;\n\nvoid main(){\n    float eyedepth = DECODE_VIEWDEPTH(SAMPLE_DEPTH_TEXTURE(uDepthTexure,vUV));\n\n    vec3 dir = normalize(vvdir);\n    vec3 wpos = dir * eyedepth + CAMERA_POS.xyz;\n    vec4 lpos = uLightMtx[0] * vec4(wpos,1.0);\n\n    vec3 lcpos = lpos.xyz / lpos.w;\n\n    lcpos = lpos.xyz *0.5 +0.5;\n\n    vec2 coord=  lcpos.xy;\n    float shadowDep = texture(uShadowMap,coord).x;\n    float d = shadowDep;// lcpos.z;\n\n    fragColor = vec4(lcpos.z -1.0,0,0,1.0);\n}";
                ShaderGen.shadowsGather_vs = "#version 300 es\n\nprecision mediump float;\n\n#include SHADERFX_BASIS\nin vec4 aPosition;\nout vec2 vUV;\nout vec3 vvdir;\n\nvoid main(){\n    vec4 pos = aPosition;\n    vUV = pos.xy +0.5;\n    pos.xy *=2.0;\n\n    vec4 clippos = vec4(pos.xy *2.0,1.0,1.0);\n    vec4 cwpos = ClipToWorld(clippos);\n\n    vvdir = (cwpos.xyz / cwpos.w) - CAMERA_POS.xyz;\n    \n    gl_Position = pos;\n}";
                ShaderGen.skybox_ps = "#version 300 es\n\nprecision mediump float;\n\n#include SHADERFX_BASIS\n\n#ifdef ENVMAP_TYPE_CUBE\nin vec4 vWorldDir;\nuniform samplerCube uSampler;\n#endif\n#ifdef ENVMAP_TYPE_TEX\nin vec3 vWorldDir;\nuniform sampler2D uSampler;\n#endif\n\n\nout lowp vec4 fragColor;\nvoid main(){\n    vec3 dir = vWorldDir.xyz;\n    #ifdef ENVMAP_TYPE_CUBE\n    fragColor = texture(uSampler,dir);\n    #endif\n    #ifdef ENVMAP_TYPE_TEX\n    dir = normalize(dir);\n    float y = 1.0 - 0.5 *(1.0 + dir.y);\n    float x = atan(dir.z,dir.x) / PI_2 + 0.5;\n    fragColor = texture(uSampler,vec2(x,y));\n    #endif\n}";
                ShaderGen.skybox_vs = "#version 300 es\n\nprecision mediump float;\n#include SHADERFX_BASIS\n\n#options ENVMAP_TYPE CUBE TEX \n\n#queue skybox\n\nin vec4 aPosition;\n\n#ifdef ENVMAP_TYPE_CUBE\nout vec4 vWorldDir;\n#endif\n\n#ifdef ENVMAP_TYPE_TEX\nout vec3 vWorldDir;\n#endif\n\nvoid main(){\n    vec4 pos = aPosition;\n    pos.xy*=2.0;\n    pos.z = 1.0;\n    gl_Position = pos;\n\n    vec4 wpos =  inverse(MATRIX_VP) * pos;\n    wpos.xyz = wpos.xyz / wpos.w - CAMERA_POS.xyz;\n    #ifdef ENVMAP_TYPE_CUBE\n    vWorldDir = wpos;\n    #endif\n\n    #ifdef ENVMAP_TYPE_TEX\n    vWorldDir = wpos.xyz;\n    #endif\n    \n}";
                ShaderGen.UnlitColor_ps = "#version 300 es\n\nprecision mediump float;\nuniform vec4 uColor;\nout vec4 fragColor;\nvoid main(){\n    fragColor = uColor;\n}";
                ShaderGen.UnlitColor_vs = "#version 300 es\n\nprecision mediump float;\n\n#include SHADERFX_BASIS\n#queue opaque\n\nin vec4 aPosition;\nvoid main(){\n    gl_Position = MATRIX_MVP * aPosition;\n}";
                ShaderGen.UnlitTexture_ps = "#version 300 es\n\nprecision mediump float;\n#include SHADERFX_SHADOWMAP\n\nin vec2 vUV;\n#ifdef SHADOW_ON\nin vec4 wpos;\nin vec4 lpos;\n#endif\nout vec4 fragColor;\nuniform sampler2D uSampler;\nvoid main(){\n    #ifdef SHADOW_ON\n    float shadow = computeShadow(lpos,uShadowMap);\n\n    vec3 clip = lpos.xyz / lpos.w;\n    clip = clip *0.5 + 0.5;\n\n    fragColor =vec4(shadow,0,0,1.0);\n    #else\n    fragColor = vec4(0,1.0,0,1.0);\n    #endif\n}";
                ShaderGen.UnlitTexture_vs = "#version 300 es\n\nprecision mediump float;\n#include SHADERFX_CAMERA\n#include SHADERFX_SHADOWMAP\n\nin vec4 aPosition;\nin vec2 aUV;\nout vec2 vUV;\n\n#ifdef SHADOW_ON\nout vec4 wpos;\nout vec4 lpos;\n#endif\n\n#queue opaque\n\nvoid main(){\n    #ifdef SHADOW_ON\n    wpos = MATRIX_M * aPosition;\n    lpos = uLightMtx[0] * wpos;\n    gl_Position = MATRIX_VP * wpos;\n    #else\n    gl_Position = MATRIX_MVP * aPosition;\n    #endif\n    vUV = aUV;\n}";
                ShaderGen.uvValue_ps = "#version 300 es\n\nprecision mediump float;\nin vec2 vUV;\nout vec4 fragColor;\nvoid main(){\n    fragColor = vec4(vUV,0,1.0);\n}";
                ShaderGen.uvValue_vs = "#version 300 es\n\nprecision mediump float;\n#include SHADERFX_CAMERA\nin vec4 aPosition;\nin vec2 aUV;\nout vec2 vUV;\nvoid main(){\n    gl_Position = MATRIX_MVP * aPosition;\n    vUV = aUV;\n}";
                return ShaderGen;
            }());

            var ShaderFX = /** @class */ (function () {
                function ShaderFX() {
                }
                ShaderFX.registVariant = function (variant) {
                    this.variants[variant.variantName] = variant;
                };
                ShaderFX.linkAllVariant = function () {
                    var variants = ShaderFX.variants;
                    for (var key in variants) {
                        var v = variants[key];
                        if (v != null && v instanceof ShaderVariant) {
                            v.link(variants);
                        }
                    }
                };
                ShaderFX.getShader = function () {
                };
                ShaderFX.compileShaders = function (glctx, source) {
                    if (!ShaderFX.s_variantsLinked) {
                        ShaderFX.linkAllVariant();
                        ShaderFX.s_variantsLinked = true;
                    }
                    if (source == null)
                        return null;
                    source.buildShader(ShaderFX.variants);
                    if (!source.isBuilt)
                        return null;
                    var optconfig = new ShaderOptionsConfig(source.optionsList);
                    var compileFlags = optconfig.compileFlag;
                    var _a = source.injectCompileFlags(compileFlags), vs = _a[0], ps = _a[1];
                    var p = glctx.createProgram(vs, ps);
                    if (p == null)
                        return null;
                    var shader = new Shader(source, p, optconfig, glctx);
                    var tags = source.tags;
                    if (tags == null) {
                        tags = new ShaderTags();
                    }
                    tags.fillDefaultVal();
                    shader.tags = tags;
                    return shader;
                };
                ShaderFX.variants = {};
                ShaderFX.s_variantsLinked = false;
                ShaderFX.VARIANT_SHADERFX_OBJ = "SHADERFX_OBJ";
                ShaderFX.VARIANT_SHADERFX_CAMERA = "SHADERFX_CAMERA";
                ShaderFX.VARIANT_SHADERFX_BASIS = "SHADERFX_BASIS";
                ShaderFX.VARIANT_SHADERFX_LIGHT = "SHADERFX_LIGHT";
                ShaderFX.VARIANT_SHADERFX_SHADOWMAP = "SHADERFX_SHADOWMAP";
                ShaderFX.VARIANT_SHADERFX_LIGHTING = "SHADERFX_LIGHTING";
                ShaderFX.OPT_SHADOWMAP_SHADOW = "SHADOW";
                ShaderFX.OPT_SHADOWMAP_SHADOW_ON = "ON";
                ShaderFX.OPT_SHADOWMAP_SHADOW_OFF = "OFF";
                ShaderFX.ATTR_aPosition = "aPosition";
                ShaderFX.ATTR_aUV = "aUV";
                ShaderFX.ATTR_aNormal = "aNormal";
                ShaderFX.UNIFORM_CAM = "UNIFORM_CAM";
                ShaderFX.UNIFORM_OBJ = "UNIFORM_OBJ";
                ShaderFX.UNIFORM_SHADOWMAP = "UNIFORM_SHADOWMAP";
                ShaderFX.UNIFORM_MAIN_COLOR = "uColor";
                ShaderFX.UNIFORM_MAIN_TEXTURE = "uSampler";
                ShaderFX.GL_TEXTURE_FB = 0x84C0;
                ShaderFX.GL_TEXTURE_DEPTH = 0x84C1;
                ShaderFX.GL_TEXTURE_TEMP = 0x84C2;
                ShaderFX.GL_TEXTURE_DEF_TEX = 0x84C3;
                ShaderFX.GL_TEXTURE_FB_ID = 0;
                ShaderFX.GL_TEXTURE_TEMP_ID = 2;
                ShaderFX.GL_TEXTURE_DEF_TEX_ID = 3;
                //Texture used in shader sampler
                ShaderFX.GL_SH_TEXTURE0 = 0x84C4;
                ShaderFX.GL_SH_TEXTURE1 = 0x84C5;
                ShaderFX.GL_SH_TEXTURE2 = 0x84C6;
                ShaderFX.GL_SH_TEXTURE3 = 0x84C7;
                ShaderFX.GL_SH_TEXTURE4 = 0x84C8;
                ShaderFX.GL_SH_TEXTURE5 = 0x84C9;
                ShaderFX.GL_SH_TEXTURE6 = 0x84C10;
                ShaderFX.GL_SH_TEXTURE7 = 0x84C11;
                ShaderFX.GL_SH_TEXTURE0_ID = 4;
                ShaderFX.GL_SH_TEXTURE1_ID = 5;
                ShaderFX.GL_SH_TEXTURE2_ID = 6;
                ShaderFX.GL_SH_TEXTURE3_ID = 7;
                ShaderFX.GL_SH_TEXTURE4_ID = 8;
                ShaderFX.GL_SH_TEXTURE5_ID = 9;
                ShaderFX.GL_SH_TEXTURE6_ID = 10;
                ShaderFX.GL_SH_TEXTURE7_ID = 11;
                ShaderFX.GL_SHADOWMAP_TEX0 = 0x84CC;
                ShaderFX.GL_SHADOWMAP_TEX1 = 0x84CD;
                ShaderFX.GL_SHADOWMAP_TEX2 = 0x84CE;
                ShaderFX.GL_SHADOWMAP_TEX3 = 0x84CF;
                ShaderFX.GL_SHADOWMAP_TEX0_ID = 12;
                ShaderFX.GL_SHADOWMAP_TEX1_ID = 13;
                ShaderFX.GL_SHADOWMAP_TEX2_ID = 14;
                ShaderFX.GL_SHADOWMAP_TEX3_ID = 15;
                return ShaderFX;
            }());
            function ShaderFile(vsfile, psfile) {
                return function (target, key) {
                    if (psfile == null) {
                        psfile = vsfile;
                    }
                    target[key] = getShaderSource(vsfile, psfile);
                };
            }
            function ShaderInc(filename) {
                return function (target, key) {
                    var variant = getShaderInclude(filename);
                    target[key] = variant;
                    ShaderFX.registVariant(variant);
                };
            }
            function getShaderSource(vss, pss) {
                var vs = ShaderGen[vss + '_vs'];
                var ps = ShaderGen[pss + '_ps'];
                if (vs != null && ps != null) {
                    return new ShaderSource(vs, ps);
                }
                throw new Error("shader source invalid : " + vss + " " + pss);
            }
            function getShaderInclude(src) {
                var inc = ShaderGen[src];
                if (inc == null) {
                    throw new Error("shader include invalid : " + src);
                }
                return new ShaderVariant(src.toUpperCase(), inc);
            }

            var ShaderDataBuffer = /** @class */ (function () {
                function ShaderDataBuffer() {
                }
                Object.defineProperty(ShaderDataBuffer.prototype, "rawBuffer", {
                    get: function () {
                        return this.dataView.buffer;
                    },
                    enumerable: true,
                    configurable: true
                });
                ShaderDataBuffer.prototype.setVec3 = function (byteOffset, value) {
                    var raw = value.raw;
                    var dv = this.dataView;
                    var off = byteOffset;
                    dv.setFloat32(off, raw[0], true);
                    off += 4;
                    dv.setFloat32(off, raw[1], true);
                    off += 4;
                    dv.setFloat32(off, raw[2], true);
                };
                ShaderDataBuffer.prototype.setVec4 = function (byteOffset, value) {
                    var raw = value.raw;
                    var dv = this.dataView;
                    var off = byteOffset;
                    dv.setFloat32(off, raw[0], true);
                    off += 4;
                    dv.setFloat32(off, raw[1], true);
                    off += 4;
                    dv.setFloat32(off, raw[2], true);
                    off += 4;
                    dv.setFloat32(off, raw[3], true);
                };
                ShaderDataBuffer.prototype.setMat4 = function (byteOffset, value) {
                    var raw = value.raw;
                    var dv = this.dataView;
                    var len = raw.length;
                    var off = byteOffset;
                    for (var i = 0; i < len; i++) {
                        dv.setFloat32(off, raw[i], true);
                        off += 4;
                    }
                };
                ShaderDataBuffer.prototype.setMat3 = function (byteOffset, value) {
                    var raw = value.raw;
                    var dv = this.dataView;
                    var len = raw.length;
                    var off = byteOffset;
                    for (var i = 0; i < len; i++) {
                        dv.setFloat32(off, raw[i], true);
                        off += 4;
                    }
                };
                ShaderDataBuffer.prototype.setFloat = function (byteOffset, value) {
                    this.dataView.setFloat32(byteOffset, value, true);
                };
                ShaderDataBuffer.prototype.setUint32 = function (byteOffset, value) {
                    this.dataView.setUint32(byteOffset, value);
                };
                return ShaderDataBuffer;
            }());
            var ShaderDataFloat32Buffer = /** @class */ (function (_super) {
                __extends$1(ShaderDataFloat32Buffer, _super);
                function ShaderDataFloat32Buffer(length) {
                    var _this = _super.call(this) || this;
                    _this.m_buffer = new Float32Array(length);
                    _this.dataView = new DataView(_this.m_buffer.buffer, 0, length * 4);
                    return _this;
                }
                Object.defineProperty(ShaderDataFloat32Buffer.prototype, "float32Buffer", {
                    get: function () {
                        return this.m_buffer;
                    },
                    enumerable: true,
                    configurable: true
                });
                ShaderDataFloat32Buffer.prototype.setFloat = function (offset, value) {
                    this.m_buffer[offset] = value;
                };
                ShaderDataFloat32Buffer.prototype.setFloatArray = function (offset, value) {
                    this.m_buffer.set(value, offset);
                };
                ShaderDataFloat32Buffer.prototype.fill = function (offset, value, len) {
                    this.m_buffer.fill(value, offset, offset + len);
                };
                ShaderDataFloat32Buffer.prototype.setVec3 = function (offset, value) {
                    this.m_buffer.set(value.raw, offset);
                };
                ShaderDataFloat32Buffer.prototype.setVec4 = function (offset, value) {
                    this.m_buffer.set(value.raw, offset);
                };
                ShaderDataFloat32Buffer.prototype.setMat4 = function (offset, value) {
                    var raw = value.raw;
                    this.setFloatArray(offset, raw);
                };
                ShaderDataFloat32Buffer.prototype.setMat3 = function (offset, value) {
                    var raw = value.raw;
                    this.setFloatArray(offset, raw);
                };
                return ShaderDataFloat32Buffer;
            }(ShaderDataBuffer));
            var ShaderDataArrayBuffer = /** @class */ (function (_super) {
                __extends$1(ShaderDataArrayBuffer, _super);
                function ShaderDataArrayBuffer(sizeInByte) {
                    var _this = _super.call(this) || this;
                    _this.m_buffer = new ArrayBuffer(sizeInByte);
                    _this.dataView = new DataView(_this.m_buffer, 0, sizeInByte);
                    return _this;
                }
                return ShaderDataArrayBuffer;
            }(ShaderDataBuffer));

            var ShaderFXLibs = /** @class */ (function () {
                function ShaderFXLibs(glctx) {
                    this.glctx = glctx;
                }
                Object.defineProperty(ShaderFXLibs.prototype, "shaderUnlitColor", {
                    get: function () {
                        if (this.m_unlitColor == null) {
                            this.m_unlitColor = ShaderFX.compileShaders(this.glctx, ShaderFXLibs.SH_unitColor);
                        }
                        return this.m_unlitColor;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ShaderFXLibs.prototype, "shaderUnlitTexture", {
                    get: function () {
                        if (this.m_unlitTexture == null) {
                            this.m_unlitTexture = ShaderFX.compileShaders(this.glctx, ShaderFXLibs.SH_unlitTexture);
                        }
                        return this.m_unlitTexture;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ShaderFXLibs.prototype, "shaderUVvalue", {
                    get: function () {
                        if (this.m_uvValue == null) {
                            this.m_uvValue = ShaderFX.compileShaders(this.glctx, ShaderFXLibs.SH_uvValue);
                        }
                        return this.m_uvValue;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ShaderFXLibs.prototype, "shaderDiffuse", {
                    get: function () {
                        if (this.m_diffuse == null) {
                            this.m_diffuse = ShaderFX.compileShaders(this.glctx, ShaderFXLibs.SH_diffuse);
                        }
                        return this.m_diffuse;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ShaderFXLibs.prototype, "shaderSkybox", {
                    get: function () {
                        if (this.m_skybox == null) {
                            this.m_skybox = ShaderFX.compileShaders(this.glctx, ShaderFXLibs.SH_skybox);
                        }
                        return this.m_skybox;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ShaderFXLibs.prototype, "shaderPbrMetallicRoughness", {
                    get: function () {
                        if (this.m_pbrMetallicRoughness == null) {
                            this.m_pbrMetallicRoughness = ShaderFX.compileShaders(this.glctx, ShaderFXLibs.SH_pbrMetallicRoughness);
                        }
                        return this.m_pbrMetallicRoughness;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ShaderFXLibs.prototype, "shaderDepth", {
                    get: function () {
                        if (this.m_depth == null) {
                            this.m_depth = ShaderFX.compileShaders(this.glctx, ShaderFXLibs.SH_depth);
                        }
                        return this.m_depth;
                    },
                    enumerable: true,
                    configurable: true
                });
                ShaderFXLibs.prototype.release = function () {
                };
                ShaderFXLibs.prototype.reload = function () {
                    // for(let key in this){
                    //     let shader = this[key];
                    //     if(shader == null) continue;
                    //     if(shader instanceof Shader){
                    //         shader.release();
                    //         this[key] = null;
                    //     }
                    // }
                };
                ShaderFXLibs.SH_PBR_BaseColorFactor = "uColor";
                ShaderFXLibs.SH_PBR_BaseColorTexture = "uSampler";
                ShaderFXLibs.SH_PBR_MetallicFactor = "uMetallic";
                ShaderFXLibs.SH_PBR_RoughnessFactor = "uRoughness";
                ShaderFXLibs.SH_PBR_MetallicRoughnessTexture = "uTexMetallicRoughness";
                ShaderFXLibs.SH_PBR_EmissiveFactor = "uEmissive";
                ShaderFXLibs.SH_PBR_EmissiveTexture = "uTexEmissive";
                __decorate([
                    ShaderFile("UnlitColor")
                ], ShaderFXLibs, "SH_unitColor", void 0);
                __decorate([
                    ShaderFile("UnlitTexture")
                ], ShaderFXLibs, "SH_unlitTexture", void 0);
                __decorate([
                    ShaderFile("uvValue")
                ], ShaderFXLibs, "SH_uvValue", void 0);
                __decorate([
                    ShaderFile("diffuse")
                ], ShaderFXLibs, "SH_diffuse", void 0);
                __decorate([
                    ShaderFile("skybox")
                ], ShaderFXLibs, "SH_skybox", void 0);
                __decorate([
                    ShaderFile("pbrMetallicRoughness")
                ], ShaderFXLibs, "SH_pbrMetallicRoughness", void 0);
                __decorate([
                    ShaderFile("depth")
                ], ShaderFXLibs, "SH_depth", void 0);
                __decorate([
                    ShaderInc(ShaderFX.VARIANT_SHADERFX_OBJ)
                ], ShaderFXLibs, "SHADERFX_OBJ", void 0);
                __decorate([
                    ShaderInc(ShaderFX.VARIANT_SHADERFX_CAMERA)
                ], ShaderFXLibs, "SHADERFX_CAMERA", void 0);
                __decorate([
                    ShaderInc(ShaderFX.VARIANT_SHADERFX_BASIS)
                ], ShaderFXLibs, "SHADERFX_BASIS", void 0);
                __decorate([
                    ShaderInc(ShaderFX.VARIANT_SHADERFX_LIGHT)
                ], ShaderFXLibs, "SHADERFX_LIGHT", void 0);
                __decorate([
                    ShaderInc(ShaderFX.VARIANT_SHADERFX_LIGHTING)
                ], ShaderFXLibs, "SHADERFX_LIGHTING", void 0);
                __decorate([
                    ShaderInc(ShaderFX.VARIANT_SHADERFX_SHADOWMAP)
                ], ShaderFXLibs, "SHADERFX_SHADOWMAP", void 0);
                return ShaderFXLibs;
            }());
            /** Shader DataBuffer */
            var ShaderDataUniformObj = /** @class */ (function (_super) {
                __extends$1(ShaderDataUniformObj, _super);
                function ShaderDataUniformObj() {
                    var _this = this;
                    var buffersize = 16;
                    _this = _super.call(this, buffersize) || this;
                    return _this;
                }
                ShaderDataUniformObj.prototype.setMtxModel = function (mtx) {
                    this.setMat4(0, mtx);
                };
                ShaderDataUniformObj.UNIFORM_OBJ = "UNIFORM_OBJ";
                return ShaderDataUniformObj;
            }(ShaderDataFloat32Buffer));
            var ShaderDataUniformCam = /** @class */ (function (_super) {
                __extends$1(ShaderDataUniformCam, _super);
                function ShaderDataUniformCam() {
                    var _this = this;
                    var buffersize = 16 * 4 * 2 + 16 + 16 + 16;
                    _this = _super.call(this, buffersize) || this;
                    return _this;
                }
                ShaderDataUniformCam.prototype.setMtxView = function (mtx) {
                    this.setMat4(0, mtx);
                };
                ShaderDataUniformCam.prototype.setMtxProj = function (mtx) {
                    this.setMat4(16, mtx);
                };
                ShaderDataUniformCam.prototype.setCameraPos = function (pos) {
                    this.setVec4(32, pos.vec4(1));
                };
                ShaderDataUniformCam.prototype.setClipPlane = function (near, far) {
                    this.setFloat(36, near);
                    this.setFloat(37, far);
                    this.setFloat(38, 1.0 / near);
                    this.setFloat(39, 1.0 / far);
                };
                ShaderDataUniformCam.prototype.setScreenSize = function (width, height) {
                    this.setFloat(40, width);
                    this.setFloat(41, height);
                    this.setFloat(42, 1.0 / width);
                    this.setFloat(43, 1.0 / height);
                };
                ShaderDataUniformCam.UNIFORM_CAM = "UNIFORM_CAM";
                return ShaderDataUniformCam;
            }(ShaderDataFloat32Buffer));
            var ShaderDataUniformLight = /** @class */ (function (_super) {
                __extends$1(ShaderDataUniformLight, _super);
                function ShaderDataUniformLight() {
                    var _this = this;
                    var buffersize = 8 * 4 + 4;
                    _this = _super.call(this, buffersize) || this;
                    return _this;
                }
                ShaderDataUniformLight.UNIFORM_LIGHT = "LIGHT";
                return ShaderDataUniformLight;
            }(ShaderDataFloat32Buffer));
            var ShaderDataUniformShadowMap = /** @class */ (function (_super) {
                __extends$1(ShaderDataUniformShadowMap, _super);
                function ShaderDataUniformShadowMap() {
                    var _this = this;
                    var buffersize = 16 * 4 * 4 + 4;
                    _this = _super.call(this, buffersize) || this;
                    return _this;
                }
                ShaderDataUniformShadowMap.prototype.setLightMtx = function (mtx, index) {
                    this.setMat4(index * 16 * 4, mtx);
                };
                ShaderDataUniformShadowMap.prototype.setShadowDistance = function (dist) {
                };
                ShaderDataUniformShadowMap.prototype.setCascadeCount = function (count) {
                };
                return ShaderDataUniformShadowMap;
            }(ShaderDataArrayBuffer));

            var ShadowCascade;
            (function (ShadowCascade) {
                ShadowCascade[ShadowCascade["NoCascade"] = 1] = "NoCascade";
                ShadowCascade[ShadowCascade["TwoCascade"] = 2] = "TwoCascade";
                ShadowCascade[ShadowCascade["FourCascade"] = 4] = "FourCascade";
            })(ShadowCascade || (ShadowCascade = {}));
            var ShadowConfig = /** @class */ (function () {
                function ShadowConfig() {
                    this.shadowmapSize = 1024;
                    this.cascade = ShadowCascade.NoCascade;
                    this.shadowDistance = 40.0;
                    this.cascadeSplit = ShadowConfig.CASCADE_SPLIT_NONE;
                }
                ShadowConfig.CASCADE_SPLIT_TWO_CASCADE = [0.333, 0.667];
                ShadowConfig.CASCADE_SPLIT_FOUR_CASCADE = [0.067, 0.133, 0.266, 0.534];
                ShadowConfig.CASCADE_SPLIT_NONE = [1.0];
                return ShadowConfig;
            }());

            var GLConst;
            (function (GLConst) {
                GLConst[GLConst["BYTE"] = 5120] = "BYTE";
                GLConst[GLConst["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
                GLConst[GLConst["SHORT"] = 5122] = "SHORT";
                GLConst[GLConst["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
                GLConst[GLConst["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
                GLConst[GLConst["FLOAT"] = 5126] = "FLOAT";
            })(GLConst || (GLConst = {}));
            var GL = /** @class */ (function () {
                function GL() {
                }
                GL.BYTE = 5120;
                GL.UNSIGNED_BYTE = 5121;
                GL.SHORT = 5122;
                GL.UNSIGNED_SHORT = 5123;
                GL.UNSIGNED_INT = 5125;
                GL.FLOAT = 5126;
                GL.NEAREST = 0x2600;
                GL.LINEAR = 0x2601;
                GL.NEAREST_MIPMAP_NEAREST = 0x2700;
                GL.LINEAR_MIPMAP_NEAREST = 0x2701;
                GL.NEAREST_MIPMAP_LINEAR = 0x2702;
                GL.LINEAR_MIPMAP_LINEAR = 0x2703;
                GL.TEXTURE_MAG_FILTER = 0x2800;
                GL.TEXTURE_MIN_FILTER = 0x2801;
                GL.TEXTURE_WRAP_S = 0x2802;
                GL.TEXTURE_WRAP_T = 0x2803;
                GL.TEXTURE_2D = 0x0DE1;
                GL.TEXTURE = 0x1702;
                GL.TEXTURE_CUBE_MAP = 0x8513;
                GL.TEXTURE_BINDING_CUBE_MAP = 0x8514;
                GL.TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515;
                GL.TEXTURE_CUBE_MAP_NEGATIVE_X = 0x8516;
                GL.TEXTURE_CUBE_MAP_POSITIVE_Y = 0x8517;
                GL.TEXTURE_CUBE_MAP_NEGATIVE_Y = 0x8518;
                GL.TEXTURE_CUBE_MAP_POSITIVE_Z = 0x8519;
                GL.EXTURE_CUBE_MAP_NEGATIVE_Z = 0x851A;
                GL.MAX_CUBE_MAP_TEXTURE_SIZE = 0x851C;
                GL.ACTIVE_TEXTURE = 0x84E0;
                GL.REPEAT = 0x2901;
                GL.CLAMP_TO_EDGE = 0x812F;
                GL.MIRRORED_REPEAT = 0x8370;
                return GL;
            }());

            var TextureCreationDesc = /** @class */ (function () {
                function TextureCreationDesc(fmt, internalfmt, mipmap, min_filter, mag_filter, wrap_s, wrap_t) {
                    if (mipmap === void 0) { mipmap = false; }
                    if (min_filter === void 0) { min_filter = GL.LINEAR; }
                    if (mag_filter === void 0) { mag_filter = GL.LINEAR; }
                    if (wrap_s === void 0) { wrap_s = GL.CLAMP_TO_EDGE; }
                    if (wrap_t === void 0) { wrap_t = GL.CLAMP_TO_EDGE; }
                    this.mipmap = false;
                    this.format = fmt;
                    this.internalformat = internalfmt;
                    this.mipmap = mipmap;
                    this.min_filter = min_filter;
                    this.mag_filter = mag_filter;
                    this.wrap_s = wrap_s;
                    this.wrap_t = wrap_t;
                }
                return TextureCreationDesc;
            }());
            var Texture = /** @class */ (function () {
                function Texture(tex, width, heigt, desc) {
                    if (width === void 0) { width = 0; }
                    if (heigt === void 0) { heigt = 0; }
                    this.m_raw = tex;
                    this.m_width = width;
                    this.m_height = heigt;
                    this.m_desc = desc;
                }
                Object.defineProperty(Texture.prototype, "rawtexture", {
                    get: function () {
                        return this.m_raw;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Texture.prototype, "width", {
                    get: function () { return this.m_width; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Texture.prototype, "height", {
                    get: function () { return this.m_height; },
                    enumerable: true,
                    configurable: true
                });
                Texture.createTexture2D = function (width, height, desc, glctx) {
                    var gl = glctx.gl;
                    var tex = gl.createTexture();
                    gl.activeTexture(ShaderFX.GL_TEXTURE_TEMP);
                    gl.bindTexture(gl.TEXTURE_2D, tex);
                    gl.texStorage2D(gl.TEXTURE_2D, 1, desc.internalformat, width, height);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, desc.mag_filter);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, desc.min_filter);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, desc.wrap_s);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, desc.wrap_t);
                    if (desc.mipmap) {
                        gl.generateMipmap(gl.TEXTURE_2D);
                    }
                    gl.bindTexture(gl.TEXTURE_2D, null);
                    var texture = new Texture(tex, width, height, desc);
                    return texture;
                };
                Texture.prototype.resize = function (width, height, glctx) {
                    if (width == this.m_width && height == this.m_height)
                        return;
                    var gl = glctx.gl;
                    gl.deleteTexture(this.m_raw);
                    var desc = this.m_desc;
                    var tex = gl.createTexture();
                    gl.activeTexture(ShaderFX.GL_TEXTURE_TEMP);
                    gl.bindTexture(gl.TEXTURE_2D, tex);
                    gl.texStorage2D(gl.TEXTURE_2D, 1, desc.internalformat, width, height);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, desc.mag_filter);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, desc.min_filter);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, desc.wrap_s);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, desc.wrap_t);
                    gl.bindTexture(gl.TEXTURE_2D, null);
                    if (desc.mipmap) {
                        gl.generateMipmap(gl.TEXTURE_2D);
                    }
                    this.m_raw = tex;
                    this.m_width = width;
                    this.m_height = height;
                };
                Texture.crateEmptyTexture = function (width, height, glctx) {
                    if (width < 2 || height < 2) {
                        throw new Error('invalid texture size');
                    }
                    var gl = glctx.gl;
                    var tex = gl.createTexture();
                    gl.activeTexture(Texture.TEMP_TEXID);
                    gl.bindTexture(gl.TEXTURE_2D, tex);
                    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, width, height);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    gl.bindTexture(gl.TEXTURE_2D, null);
                    return new Texture(tex, width, height);
                };
                Texture.createTextureSync = function (buffer, mime, glctx, callback) {
                    var blob = new Blob([buffer], { type: mime });
                    var url = URL.createObjectURL(blob);
                    var image = new Image();
                    var tex = new Texture(null);
                    image.onload = function () {
                        var gl = glctx.gl;
                        var rawtex = gl.createTexture();
                        gl.activeTexture(Texture.TEMP_TEXID);
                        gl.bindTexture(gl.TEXTURE_2D, rawtex);
                        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                        gl.generateMipmap(gl.TEXTURE_2D);
                        gl.bindTexture(gl.TEXTURE_2D, null);
                        tex.m_width = image.width;
                        tex.m_height = image.height;
                        tex.m_raw = rawtex;
                        if (callback != null)
                            callback(true);
                    };
                    image.onerror = function (ev) {
                        console.error(ev);
                        if (callback != null)
                            callback(false);
                    };
                    image.src = url;
                    return tex;
                };
                Texture.createTexture = function (buffer, mime, glctx) {
                    return __awaiter$1(this, void 0, void 0, function () {
                        return __generator$1(this, function (_a) {
                            return [2 /*return*/, new Promise(function (res, rej) {
                                    var tex = Texture.createTextureSync(buffer, mime, glctx, function (suc) {
                                        if (suc) {
                                            res(tex);
                                        }
                                        else {
                                            rej('failed');
                                        }
                                    });
                                })];
                        });
                    });
                };
                return Texture;
            }());

            var MaterialPorpertyBlock = /** @class */ (function () {
                function MaterialPorpertyBlock(program) {
                    if (program == null)
                        return;
                    var selfu = this.uniforms;
                    if (selfu == null) {
                        selfu = {};
                        this.uniforms = selfu;
                    }
                    this.setProgram(program);
                }
                MaterialPorpertyBlock.prototype.setProgram = function (program) {
                    if (program == this.m_program)
                        return;
                    if (this.m_program == null) {
                        var uinfo_1 = program.UniformsInfo;
                        var selfu_1 = this.uniforms;
                        for (var uname in uinfo_1) {
                            var info = uinfo_1[uname];
                            selfu_1[uname] = { type: info.type, value: null };
                        }
                        this.m_program = program;
                        return;
                    }
                    this.m_program = program;
                    var uinfo = program.UniformsInfo;
                    var selfu = this.uniforms;
                    for (var key in selfu) {
                        if (uinfo[key] == null) {
                            delete selfu[key];
                        }
                    }
                    for (var key in uinfo) {
                        var u = selfu[key];
                        var up = uinfo[key];
                        if (u == null) {
                            selfu[key] = { type: up.type, value: null };
                        }
                        else {
                            if (u.type != up.type) {
                                u.type = up.type;
                                u.value = null;
                            }
                        }
                    }
                };
                MaterialPorpertyBlock.prototype.clone = function () {
                    var block = new MaterialPorpertyBlock(null);
                    block.m_program = this.m_program;
                    block.uniforms = Utility.cloneMap(this.uniforms, function (p) {
                        return { type: p.type, value: p.value };
                    });
                    return block;
                };
                MaterialPorpertyBlock.prototype.getUniform = function (name) {
                    return this.uniforms[name];
                };
                MaterialPorpertyBlock.prototype.release = function () {
                    this.m_program = null;
                    this.uniforms = null;
                };
                return MaterialPorpertyBlock;
            }());
            var Material = /** @class */ (function () {
                function Material(shader) {
                    this.m_useVariants = false;
                    this.m_shadertags = null;
                    this.m_applyTexCount = 0;
                    if (shader == null) {
                        return;
                    }
                    this.m_shader = shader;
                    this.m_program = shader.defaultProgram;
                    this.m_optConfig = shader.m_defaultOptionsConfig;
                    this.m_propertyBlock = new MaterialPorpertyBlock(this.m_program);
                }
                Object.defineProperty(Material.prototype, "program", {
                    get: function () {
                        if (this.m_program == null) {
                            var newprogram = this.m_shader.getVariantProgram(this.m_optConfig);
                            this.m_propertyBlock.setProgram(newprogram);
                            this.m_program = newprogram;
                        }
                        return this.m_program;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Material.prototype, "shaderTags", {
                    get: function () {
                        if (this.m_shadertags == null)
                            return this.m_shader.tags;
                        return this.m_shadertags;
                    },
                    set: function (tags) {
                        this.m_shadertags = tags;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Material.prototype, "propertyBlock", {
                    get: function () {
                        return this.m_propertyBlock;
                    },
                    enumerable: true,
                    configurable: true
                });
                Material.prototype.clone = function () {
                    var mat = new Material();
                    mat.m_shader = this.m_shader;
                    mat.m_program = this.program;
                    mat.m_propertyBlock = this.m_propertyBlock.clone();
                    mat.m_useVariants = this.m_useVariants;
                    mat.m_optConfig = this.m_optConfig.clone();
                    return mat;
                };
                Material.prototype.setColor = function (name, color) {
                    var p = this.m_propertyBlock.getUniform(name);
                    if (p == null)
                        return;
                    p.value = color;
                };
                Material.prototype.setTexture = function (name, tex) {
                    var p = this.m_propertyBlock.getUniform(name);
                    if (p == null)
                        return;
                    p.value = tex;
                };
                Material.prototype.setFloat = function (name, val) {
                    var p = this.m_propertyBlock.getUniform(name);
                    if (p == null)
                        return;
                    p.value = val;
                };
                Material.prototype.setFlag = function (key, value) {
                    var defOptCfg = this.m_shader.m_defaultOptionsConfig;
                    var verified = this.m_shader.m_defaultOptionsConfig.verifyFlag(key, value);
                    if (!verified) {
                        console.warn("set shader flag verify failed: " + key + ":" + value);
                        return;
                    }
                    if (!this.m_useVariants) {
                        this.m_optConfig = defOptCfg.clone();
                    }
                    if (this.m_optConfig.setFlag(key, value)) {
                        this.m_program = null;
                        this.m_useVariants = true;
                    }
                    else {
                        console.warn("set shader flag: value not changed");
                    }
                };
                Material.prototype.setFlagNoVerify = function (options) {
                    var useVariants = this.m_useVariants;
                    var cfg = useVariants ? this.m_optConfig : this.m_shader.m_defaultOptionsConfig;
                    var val = cfg.getFlag(options.flag);
                    if (val == null)
                        return;
                    if (val == options.default)
                        return;
                    if (!useVariants) {
                        this.m_optConfig = cfg.clone();
                        this.m_useVariants = true;
                    }
                    this.m_optConfig.setFlag(options.flag, options.default);
                    this.m_program = null;
                };
                Material.prototype.getFlag = function (key) {
                    var optCfg = this.m_useVariants ? this.m_shader.m_defaultOptionsConfig : this.m_optConfig;
                    return optCfg.getFlag(key);
                };
                Material.prototype.apply = function (gl) {
                    this.m_applyTexCount = 0;
                    var program = this.program;
                    var pu = this.m_propertyBlock.uniforms;
                    for (var key in pu) {
                        var u = pu[key];
                        if (key === "uShadowMap")
                            continue;
                        this.setUniform(gl, program.Uniforms[key], u.type, u.value);
                    }
                };
                /**
                 * TODO clean apply process
                 * especially for binded texture
                 * @param gl
                 */
                Material.prototype.clean = function (gl) {
                    // let pu = this.m_propertyBlock.uniforms;
                    // for(let i=0,len = pu.length;i<len;i++){
                    //     let u = pu[i];
                    //     let loc = this.program.Uniforms[u.key];
                    //     let type = u.type;
                    //     if(type == gl.SAMPLER_2D){
                    //         //gl.bindTexture(gl.TEXTURE,null);
                    //     }
                    // }
                };
                Material.prototype.setUniform = function (gl, loc, type, val) {
                    if (val == null && type != gl.SAMPLER_2D)
                        return;
                    switch (type) {
                        case gl.FLOAT:
                            gl.uniform1f(loc, val);
                            break;
                        case gl.FLOAT_VEC3:
                            gl.uniform3fv(loc, val.raw);
                            break;
                        case gl.FLOAT_VEC4:
                            gl.uniform4fv(loc, val.raw);
                            break;
                        case gl.SAMPLER_2D:
                            var texCount = this.m_applyTexCount;
                            if (val != null) {
                                var tex = null;
                                if (val instanceof Texture) {
                                    tex = val.rawtexture;
                                }
                                else if (val instanceof WebGLTexture) {
                                    tex = val;
                                }
                                if (tex == null) {
                                    //raw texture is null or onloading...
                                    gl.uniform1i(loc, Material.DEF_TEXID_NUM);
                                    return;
                                }
                                gl.activeTexture(gl.TEXTURE4 + texCount);
                                gl.bindTexture(gl.TEXTURE_2D, tex);
                                gl.uniform1i(loc, 4 + texCount);
                            }
                            else {
                                //texture is null
                                //use default white texture
                                gl.uniform1i(loc, Material.DEF_TEXID_NUM);
                            }
                            break;
                    }
                };
                Material.DEF_TEXID_NUM = 3;
                return Material;
            }());

            var GraphicsRenderCreateInfo = /** @class */ (function () {
                function GraphicsRenderCreateInfo() {
                    this.colorFormat = 0x8058;
                    this.depthFormat = 0x81A6;
                    this.frameBufferResizeDelay = 250;
                }
                return GraphicsRenderCreateInfo;
            }());
            var GraphicsRender = /** @class */ (function () {
                function GraphicsRender(canvas, pipeline, creationInfo) {
                    this.shadowConfig = new ShadowConfig();
                    this.pause = false;
                    this.m_frameBufferInvalid = false;
                    this.m_resizeDelayter = new Delayter();
                    this.canvas = canvas;
                    if (creationInfo == null) {
                        creationInfo = new GraphicsRenderCreateInfo();
                        this.m_creationInfo = creationInfo;
                    }
                    var glctx = GLContext.createFromCanvas(canvas, {
                        antialias: true,
                        alpha: false,
                        depth: false,
                        stencil: false
                    });
                    this.m_glctx = glctx;
                    this.m_shaderFXlib = new ShaderFXLibs(glctx);
                    //default texture
                    var gl = glctx.gl;
                    Material.DEF_TEXID_NUM = GraphicsRender.TEXID_DEFAULT_TEX;
                    Texture.TEMP_TEXID = gl.TEXTURE2;
                    this.m_defaultTexture = Texture.crateEmptyTexture(2, 2, glctx);
                    gl.activeTexture(gl.TEXTURE3);
                    gl.bindTexture(gl.TEXTURE_2D, this.m_defaultTexture.rawtexture);
                    gl.frontFace(gl.CCW);
                    this.setPipeline(pipeline);
                }
                Object.defineProperty(GraphicsRender.prototype, "pipeline", {
                    get: function () {
                        return this.m_renderPipeline;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(GraphicsRender.prototype, "shaderLib", {
                    get: function () {
                        return this.m_shaderFXlib;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(GraphicsRender.prototype, "glctx", {
                    get: function () {
                        return this.m_glctx;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(GraphicsRender.prototype, "defaultTexture", {
                    get: function () {
                        return this.m_defaultTexture;
                    },
                    enumerable: true,
                    configurable: true
                });
                GraphicsRender.prototype.setPipeline = function (pipeline) {
                    if (pipeline == null)
                        return;
                    var curpipeline = this.m_renderPipeline;
                    if (curpipeline != null) {
                        curpipeline.release();
                        curpipeline = null;
                    }
                    pipeline.graphicRender = this;
                    pipeline.onInitGL(this.glctx);
                    pipeline.onSetupRender(this.m_creationInfo);
                    this.m_renderPipeline = pipeline;
                };
                GraphicsRender.prototype.reload = function () {
                    //TODO
                    //this.m_shaderFXlib.reload();
                    this.m_renderPipeline.reload();
                };
                GraphicsRender.prototype.resizeCanvas = function (w, h) {
                    var _this = this;
                    var canvas = this.canvas;
                    if (canvas.width == w && canvas.width == h)
                        return;
                    if (w <= 0 || h <= 0) {
                        this.m_frameBufferInvalid = true;
                        return;
                    }
                    else {
                        this.m_frameBufferInvalid = false;
                    }
                    var delay = this.m_creationInfo.frameBufferResizeDelay;
                    if (delay == 0) {
                        canvas.width = w;
                        canvas.height = h;
                        this.m_renderPipeline.resizeFrameBuffer(w, h);
                        return;
                    }
                    else {
                        var delayter = this.m_resizeDelayter;
                        delayter.delaytime = delay;
                        delayter.emit(function () {
                            canvas.width = w;
                            canvas.height = h;
                            _this.m_renderPipeline.resizeFrameBuffer(w, h);
                        });
                    }
                };
                GraphicsRender.prototype.render = function (scene) {
                    if (this.pause || this.m_frameBufferInvalid)
                        return;
                    var gl = this.m_glctx.gl;
                    gl.clearColor(0, 0, 0, 1);
                    gl.clear(gl.COLOR_BUFFER_BIT);
                    var p = this.pipeline;
                    if (p == null)
                        return;
                    p.exec(scene);
                };
                GraphicsRender.prototype.renderToCanvas = function () {
                    this.pipeline.onRenderToCanvas();
                };
                GraphicsRender.TEXID_FB = 0;
                GraphicsRender.TEXID_TEMP = 2;
                GraphicsRender.TEXID_DEFAULT_TEX = 3;
                GraphicsRender.TEXID_SHADER_TEX = [4, 5, 6, 7, 8, 9, 10, 11];
                GraphicsRender.TEXID_SHADOW_MAP = [15, 16, 17, 18];
                return GraphicsRender;
            }());

            var Transform = /** @class */ (function () {
                function Transform(gobj) {
                    this.m_localPosition = vec3.zero;
                    this.m_localRotation = quat.Identity;
                    this.m_localScale = vec3.one;
                    this.m_localTRSdirty = true;
                    this.m_TRSDirty = false;
                    /**
                     * Snapshot of TRS dirty flag at the end of the last updated frame.
                     */
                    this.m_curTRSDirty = false;
                    this.m_localMtx = mat4.Identity;
                    this.m_objMtx = mat4.Identity;
                    this.m_right = vec3.right.clone();
                    this.m_forward = vec3.forward.clone();
                    this.m_up = vec3.up.clone();
                    this.m_gameobj = gobj;
                }
                Object.defineProperty(Transform.prototype, "gameobject", {
                    get: function () {
                        return this.m_gameobj;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Transform.prototype, "parent", {
                    get: function () {
                        return this.m_parent;
                    },
                    set: function (p) {
                        if (p == null) {
                            var curp = this.m_parent;
                            if (curp != null) {
                                curp.removeChild(this);
                            }
                        }
                        else {
                            p.addChild(this);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Transform.prototype, "localMatrix", {
                    get: function () {
                        if (this.m_localTRSdirty == true) {
                            this.m_localMtx.setTRS(this.localPosition, this.localRotation, this.localScale);
                            this.m_localTRSdirty = false;
                            this.m_TRSDirty = true;
                        }
                        return this.m_localMtx;
                    },
                    set: function (mat) {
                        var _a;
                        this.m_localTRSdirty = false;
                        this.m_localMtx = mat;
                        _a = mat4.Decompose(mat), this.m_localPosition = _a[0], this.m_localRotation = _a[1], this.m_localScale = _a[2];
                        this.m_TRSDirty = true;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Transform.prototype, "objMatrix", {
                    /**
                     * Model matrix, MATRIX_M
                     */
                    get: function () {
                        if (this.m_objMtx == null) {
                            this.m_objMtx = this.calObjMatrix();
                        }
                        return this.m_objMtx;
                    },
                    enumerable: true,
                    configurable: true
                });
                Transform.prototype.calObjMatrix = function (decompose) {
                    if (decompose === void 0) { decompose = false; }
                    var _a;
                    var mtx = null;
                    if (this.parent == null) {
                        mtx = this.localMatrix.clone();
                        this.m_worldPositon = this.m_localPosition.clone();
                        this.m_worldRotation = this.m_localRotation.clone();
                        this.m_worldScale = this.m_localScale.clone();
                    }
                    else {
                        mtx = this.parent.objMatrix.mul(this.localMatrix);
                        if (decompose) {
                            _a = mat4.Decompose(mtx), this.m_worldPositon = _a[0], this.m_worldRotation = _a[1], this.m_worldScale = _a[2];
                        }
                        else {
                            this.m_worldPositon = null;
                            this.m_worldRotation = null;
                            this.m_worldScale = null;
                        }
                    }
                    return mtx;
                };
                Object.defineProperty(Transform.prototype, "position", {
                    /**
                     * world-space position
                     */
                    get: function () {
                        var wpos = this.m_worldPositon;
                        if (wpos == null) {
                            this.m_objMtx = this.calObjMatrix(true);
                            wpos = this.m_worldPositon;
                        }
                        return wpos;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Transform.prototype, "rotation", {
                    /**
                     * world-space rotation
                     */
                    get: function () {
                        var wrota = this.m_worldRotation;
                        if (wrota == null) {
                            this.m_objMtx = this.calObjMatrix(true);
                            wrota = this.m_worldRotation;
                        }
                        return wrota;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Transform.prototype, "scale", {
                    /**
                     * world-space scale
                     */
                    get: function () {
                        var wscale = this.m_worldScale;
                        if (wscale == null) {
                            this.m_objMtx = this.calObjMatrix(true);
                            wscale = this.m_worldScale;
                        }
                        return wscale;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Transform.prototype, "children", {
                    get: function () {
                        return this.m_children;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Transform.prototype, "localRotation", {
                    /**
                     * local rotation
                     */
                    get: function () {
                        return this.m_localRotation;
                    },
                    set: function (q) {
                        this.setRotation(q);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Transform.prototype, "localPosition", {
                    get: function () {
                        return this.m_localPosition;
                    },
                    set: function (pos) {
                        this.setPosition(pos);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Transform.prototype, "localScale", {
                    get: function () {
                        return this.m_localScale;
                    },
                    set: function (s) {
                        this.setScale(s);
                    },
                    enumerable: true,
                    configurable: true
                });
                Transform.prototype.setRotation = function (q) {
                    this.m_localRotation.set(q);
                    this.m_forward = null;
                    this.m_up = null;
                    this.m_right = null;
                    this.m_localTRSdirty = true;
                    this.m_TRSDirty = true;
                };
                Transform.prototype.setPosition = function (pos) {
                    this.m_localPosition.set(pos);
                    this.m_localTRSdirty = true;
                    this.m_TRSDirty = true;
                };
                Transform.prototype.setScale = function (scale) {
                    this.m_localScale.set(scale);
                    this.m_localTRSdirty = true;
                    this.m_TRSDirty = true;
                };
                Object.defineProperty(Transform.prototype, "forward", {
                    get: function () {
                        if (this.m_forward == null) {
                            this.m_forward = this.m_localRotation.rota(vec3.forward);
                        }
                        return this.m_forward;
                    },
                    set: function (dir) {
                        var len = dir.length;
                        if (len == 0) {
                            console.warn("can not set forward to " + dir);
                            return;
                        }
                        var forward = dir.divToRef(len);
                        var up = this.up;
                        var right = forward.cross(up).normalize;
                        up = forward.cross(right).normalize;
                        this.m_localRotation = quat.Coordinate(forward, up);
                        this.m_forward = forward;
                        this.m_up.set(up);
                        this.m_right = right;
                        this.m_localTRSdirty = true;
                        this.m_TRSDirty = true;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Transform.prototype, "up", {
                    get: function () {
                        if (this.m_up == null) {
                            this.m_up = this.m_localRotation.rota(vec3.up);
                        }
                        return this.m_up;
                    },
                    set: function (dir) {
                        var len = dir.length;
                        if (len == 0) {
                            console.warn("can not set up to " + dir);
                            return;
                        }
                        var up = dir.divToRef(len);
                        var right = up.cross(this.forward).normalize;
                        var forward = right.cross(up).normalize;
                        this.m_localRotation = quat.Coordinate(forward, up);
                        this.m_up = up;
                        this.m_forward.set(forward);
                        this.m_right = right;
                        this.m_localTRSdirty = true;
                        this.m_TRSDirty = true;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Transform.prototype, "right", {
                    get: function () {
                        if (this.m_right == null) {
                            this.m_right = this.m_localRotation.rota(vec3.right);
                        }
                        return this.m_right;
                    },
                    set: function (dir) {
                        var len = dir.length;
                        if (len == 0) {
                            console.warn("can not set up to " + dir);
                            return;
                        }
                        var right = dir.divToRef(len);
                        var forward = right.cross(this.up).normalize;
                        var up = forward.cross(right);
                        this.m_localRotation = quat.Coordinate(forward, up);
                        this.m_up.set(up);
                        this.m_forward = forward;
                        this.right = right;
                        this.m_localTRSdirty = true;
                        this.m_TRSDirty = true;
                    },
                    enumerable: true,
                    configurable: true
                });
                Transform.prototype.addChild = function (trs) {
                    if (trs == null)
                        return false;
                    var children = this.m_children;
                    if (children == null) {
                        children = [];
                        this.m_children = children;
                    }
                    var index = children.indexOf(trs);
                    if (index >= 0)
                        return true;
                    trs.m_parent = this;
                    children.push(trs);
                    return true;
                };
                Transform.prototype.removeChild = function (trs) {
                    var children = this.m_children;
                    if (children == null)
                        return false;
                    var index = children.indexOf(trs);
                    if (index < 0)
                        return false;
                    trs.m_parent = null;
                    this.m_children = children.splice(index, 1);
                    return true;
                };
                Transform.prototype.setLocalDirty = function (dirty) {
                    if (dirty === void 0) { dirty = true; }
                    this.m_localTRSdirty = dirty;
                    if (dirty) {
                        this.m_TRSDirty = true;
                    }
                };
                Transform.prototype.setObjMatrixDirty = function (pmtxdirty) {
                    var dirty = this.m_TRSDirty || pmtxdirty;
                    this.m_curTRSDirty = dirty;
                    this.m_TRSDirty = false;
                    if (dirty) {
                        this.m_objMtx = null;
                        this.m_worldPositon = null;
                        this.m_worldRotation = null;
                        this.m_worldScale = null;
                    }
                };
                Object.defineProperty(Transform.prototype, "isDirty", {
                    get: function () { return this.m_localTRSdirty || this.m_curTRSDirty; },
                    enumerable: true,
                    configurable: true
                });
                Transform.prototype.setLookAt = function (target, worldup) {
                    this.m_localTRSdirty = true;
                    this.setLookDir(target.subToRef(this.m_localPosition), worldup);
                };
                Transform.prototype.setLookDir = function (forward, worldup) {
                    this.m_localTRSdirty = true;
                    var f = forward.normalized();
                    if (worldup == null)
                        worldup = this.up;
                    var right = worldup.cross(f).normalize;
                    var up = f.cross(right).normalize;
                    this.m_up.set(up);
                    this.m_right = right;
                    this.m_forward = f;
                    this.m_localRotation = quat.Coordinate(f, up);
                };
                /**
                 * Apply translate to current transform.
                 * @param offset
                 */
                Transform.prototype.applyTranslate = function (offset) {
                    this.localPosition.add(offset);
                    this.setLocalDirty();
                };
                /**
                 * Apply rotation to current transform.
                 * @param q
                 */
                Transform.prototype.applyRotate = function (q) {
                    this.localRotation.selfRota(q);
                    this.m_forward.mul(q);
                    this.m_up.mul(q);
                    this.m_right.mul(q);
                    this.setLocalDirty();
                };
                /**
                 * Apply scale to current transform.
                 * @param scale
                 */
                Transform.prototype.applyScale = function (scale) {
                    this.m_localScale.mul(scale);
                    this.setLocalDirty();
                };
                return Transform;
            }());

            var GameObject = /** @class */ (function () {
                function GameObject(name) {
                    this.active = true;
                    this.name = name;
                    this.transform = new Transform(this);
                }
                Object.defineProperty(GameObject.prototype, "render", {
                    get: function () {
                        return this.m_render;
                    },
                    set: function (r) {
                        r.object = this;
                        this.m_render = r;
                    },
                    enumerable: true,
                    configurable: true
                });
                GameObject.prototype.update = function (scene) {
                    var comp = this.components;
                    if (comp != null) {
                        for (var i = 0, len = comp.length; i < len; i++) {
                            var c = comp[i];
                            if (c.onUpdate != null) {
                                c.onUpdate(scene);
                            }
                        }
                    }
                    var trs = this.transform;
                    var trsdirty = trs.isDirty;
                    var children = this.transform.children;
                    if (children != null) {
                        for (var i = 0, len = children.length; i < len; i++) {
                            var g = children[i].gameobject;
                            g.transform.setObjMatrixDirty(trsdirty);
                            g.update(scene);
                        }
                    }
                };
                GameObject.prototype.addComponent = function (c) {
                    var comps = this.components;
                    if (comps == null) {
                        comps = [];
                        this.components = comps;
                    }
                    var index = comps.indexOf(c);
                    if (index >= 0)
                        return;
                    c.gameobject = this;
                    if (c.onStart != null)
                        c.onStart();
                    comps.push(c);
                };
                GameObject.prototype.getComponent = function (t) {
                    var comps = this.components;
                    for (var i = 0, len = comps.length; i < len; i++) {
                        if (comps[i] instanceof t)
                            return comps[i];
                    }
                    return null;
                };
                GameObject.prototype.getChildByName = function (name) {
                    var children = this.transform.children;
                    if (children == null)
                        return null;
                    for (var i = 0, len = children.length; i < len; i++) {
                        var ct = children[i].gameobject;
                        if (ct.name === name)
                            return ct;
                        var cc = ct.getChildByName(name);
                        if (cc != null)
                            return cc;
                    }
                    return null;
                };
                return GameObject;
            }());

            var Component = /** @class */ (function () {
                function Component() {
                }
                Object.defineProperty(Component.prototype, "transform", {
                    get: function () {
                        return this.gameobject.transform;
                    },
                    enumerable: true,
                    configurable: true
                });
                return Component;
            }());

            (function (AmbientType) {
                AmbientType[AmbientType["Background"] = 0] = "Background";
                AmbientType[AmbientType["AmbientColor"] = 1] = "AmbientColor";
            })(exports.AmbientType || (exports.AmbientType = {}));
            (function (ClearType) {
                ClearType[ClearType["Background"] = 0] = "Background";
                ClearType[ClearType["Skybox"] = 1] = "Skybox";
            })(exports.ClearType || (exports.ClearType = {}));
            (function (ProjectionType) {
                ProjectionType[ProjectionType["perspective"] = 0] = "perspective";
                ProjectionType[ProjectionType["orthographic"] = 1] = "orthographic";
            })(exports.ProjectionType || (exports.ProjectionType = {}));
            var Camera = /** @class */ (function (_super) {
                __extends$1(Camera, _super);
                function Camera() {
                    var _this = _super.call(this) || this;
                    _this.enabled = true;
                    _this.order = 0;
                    _this.m_fov = 60;
                    _this.m_projDirty = false;
                    _this.orthosize = 10.0;
                    _this.m_background = vec4.zero;
                    _this.m_ambientColor = glmath.vec4(0.1, 0.1, 0.1, 1.0);
                    _this.m_ambientType = exports.AmbientType.AmbientColor;
                    _this.m_clearType = exports.ClearType.Background;
                    _this.ambientDataDirty = true;
                    _this.worldRHS = true;
                    _this.m_projMtx = mat4.perspectiveFoV(60, 1, 0.01, 100);
                    _this.m_projectionType = exports.ProjectionType.perspective;
                    return _this;
                }
                Object.defineProperty(Camera.prototype, "far", {
                    get: function () {
                        return this.m_far;
                    },
                    set: function (v) {
                        if (this.m_far == v)
                            return;
                        this.m_far = v;
                        this.m_projDirty = true;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Camera.prototype, "near", {
                    get: function () {
                        return this.m_near;
                    },
                    set: function (v) {
                        if (this.m_near == v)
                            return;
                        this.m_near = v;
                        this.m_projDirty = true;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Camera.prototype, "fov", {
                    get: function () {
                        return this.m_fov;
                    },
                    set: function (v) {
                        if (this.m_fov == v)
                            return;
                        this.m_fov = v;
                        this.m_projDirty = true;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Camera.prototype, "aspect", {
                    get: function () {
                        return this.m_aspectratio;
                    },
                    set: function (v) {
                        if (v == this.m_aspectratio)
                            return;
                        this.m_aspectratio = v;
                        this.m_projDirty = true;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Camera.prototype, "ambientColor", {
                    get: function () {
                        return this.m_ambientColor;
                    },
                    set: function (v) {
                        this.m_ambientColor = v;
                        this.ambientDataDirty = true;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Camera.prototype, "background", {
                    get: function () {
                        return this.m_background;
                    },
                    set: function (v) {
                        this.m_background = v;
                        if (this.m_ambientType == exports.AmbientType.Background) {
                            this.ambientDataDirty = true;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Camera.prototype, "skybox", {
                    get: function () {
                        return this.m_skybox;
                    },
                    set: function (tex) {
                        this.m_skybox = tex;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Camera.prototype, "clearType", {
                    get: function () {
                        return this.m_clearType;
                    },
                    set: function (t) {
                        this.m_clearType = t;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Camera.prototype, "ambientType", {
                    get: function () {
                        return this.m_ambientType;
                    },
                    set: function (t) {
                        if (this.m_ambientType == t)
                            return;
                        this.m_ambientType = t;
                        this.ambientDataDirty = true;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Camera.prototype, "WorldMatrix", {
                    get: function () {
                        var trs = this.transform;
                        if (trs.isDirty) {
                            trs.setLocalDirty(false);
                            this.m_worldMtx = mat4.coordCvt(trs.localPosition, trs.forward, trs.up);
                        }
                        return this.m_worldMtx;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Camera.prototype, "ProjMatrix", {
                    get: function () {
                        if (this.m_projDirty) {
                            this.m_projMtx = mat4.perspectiveFoV(this.m_fov, this.m_aspectratio, this.m_near, this.m_far);
                            this.m_projDirty = false;
                        }
                        return this.m_projMtx;
                    },
                    enumerable: true,
                    configurable: true
                });
                Camera.prototype.onUpdate = function (scene) {
                    scene.camera = this;
                };
                Camera.persepctive = function (gobj, fov, aspectratio, near, far) {
                    var camera = new Camera();
                    camera.m_fov = fov;
                    camera.m_aspectratio = aspectratio;
                    camera.m_near = near;
                    camera.m_far = far;
                    if (gobj == null) {
                        gobj = new GameObject();
                    }
                    gobj.addComponent(camera);
                    camera.m_projMtx = mat4.perspectiveFoV(fov, aspectratio, near, far);
                    camera.m_projectionType = exports.ProjectionType.perspective;
                    return camera;
                };
                Camera.orthographic = function (gobj, size, aspectratio, near, far) {
                    var camera = new Camera();
                    camera.m_aspectratio = aspectratio;
                    camera.m_near = near;
                    camera.m_far = far;
                    if (gobj == null) {
                        gobj = new GameObject();
                    }
                    gobj.addComponent(camera);
                    camera.orthosize = size;
                    var w = size * aspectratio;
                    camera.m_projMtx = mat4.orthographic(w, size, near, far);
                    camera.m_projectionType = exports.ProjectionType.orthographic;
                    return camera;
                };
                return Camera;
            }(Component));

            var InputSnapShot = /** @class */ (function () {
                function InputSnapShot() {
                    this.key = {};
                    this.keyDown = {};
                    this.keyUp = {};
                    this.hasKeyPressEvent = false;
                    this.mouse = new Array(4);
                    this.mouseDown = new Array(4);
                    this.mouseUp = new Array(4);
                    this.mousepos = new vec3();
                    this.mousewheel = false;
                    this.mousewheelDelta = 0;
                    this.mouseMove = false;
                    this.deltaTime = 0;
                }
                InputSnapShot.prototype.getKeyDown = function (key) {
                    return this.keyDown[key] == true;
                };
                InputSnapShot.prototype.getKeyUp = function (key) {
                    return this.keyUp[key] == true;
                };
                InputSnapShot.prototype.getKey = function (key) {
                    return this.key[key];
                };
                InputSnapShot.prototype.getMouseBtn = function (btn) {
                    return this.mouse[btn];
                };
                InputSnapShot.prototype.getMouseDown = function (btn) {
                    return this.mouseDown[btn];
                };
                InputSnapShot.prototype.getMouseUp = function (btn) {
                    return this.mouseUp[btn];
                };
                return InputSnapShot;
            }());
            var InputCache = /** @class */ (function () {
                function InputCache() {
                    this.mousepos = new vec3();
                    this.mousebtn = new Array(4);
                    this.mousedown = new Array(4);
                    this.mouseup = new Array(4);
                    this.mousewheel = false;
                    this.mousewheelDelta = 0;
                    this.keyDown = {};
                    this.keyUp = {};
                    this.m_keydirty = false;
                    this.m_mousedirty = false;
                    this.m_mousePosDirty = false;
                    this.m_shotMouseDownFalse = false;
                    this.m_shotMouseUpFalse = false;
                }
                InputCache.prototype.setKeyDown = function (e) {
                    var kp = this.keyPress;
                    if (kp == null) {
                        kp = {};
                        this.keyPress = kp;
                    }
                    kp[e.key] = true;
                    this.keyDown[e.key] = true;
                    this.m_keydirty = true;
                };
                InputCache.prototype.setKeyUp = function (e) {
                    var kp = this.keyPress;
                    if (kp == null) {
                        kp = {};
                        this.keyPress = kp;
                    }
                    kp[e.key] = false;
                    this.keyUp[e.key] = true;
                    this.m_keydirty = true;
                };
                InputCache.prototype.setMousePos = function (e) {
                    var mp = this.mousepos;
                    mp.x = e.offsetX;
                    mp.y = e.offsetY;
                    this.m_mousePosDirty = true;
                };
                InputCache.prototype.setButtonDown = function (e) {
                    var btn = e.button;
                    this.mousebtn[btn] = true;
                    this.mousedown[btn] = true;
                    this.m_mousedirty = true;
                };
                InputCache.prototype.setButtonUp = function (e) {
                    var btn = e.button;
                    this.mousebtn[btn] = false;
                    this.mouseup[btn] = true;
                    this.m_mousedirty = true;
                };
                InputCache.prototype.setMouseWheel = function (delta) {
                    this.mousewheel = true;
                    this.mousewheelDelta += delta;
                };
                InputCache.prototype.reset = function () {
                    this.mousewheel = false;
                    this.mousewheelDelta = 0;
                    if (this.m_mousedirty) {
                        var mouseup = this.mouseup;
                        var mousedown = this.mousedown;
                        mouseup.fill(false);
                        mousedown.fill(false);
                        this.m_mousedirty = false;
                    }
                    if (this.m_keydirty) {
                        this.keyDown = [];
                        this.keyUp = [];
                        this.m_keydirty = false;
                        this.keyPress = {};
                    }
                };
                InputCache.prototype.applytoSnapShot = function (shot) {
                    var mousePosDirty = this.m_mousePosDirty;
                    shot.mouseMove = mousePosDirty;
                    if (mousePosDirty) {
                        this.m_mousePosDirty = false;
                        var shotmousepos = shot.mousepos;
                        shotmousepos.set(this.mousepos);
                    }
                    shot.mousewheelDelta = this.mousewheelDelta;
                    shot.mousewheel = this.mousewheelDelta != 0 && this.mousewheel;
                    var smdown = shot.mouseDown;
                    var smup = shot.mouseUp;
                    var smouse = shot.mouse;
                    if (this.m_mousedirty) {
                        var cmdown = this.mousedown;
                        for (var i = 0; i < 4; i++) {
                            smdown[i] = cmdown[i];
                        }
                        var cmup = this.mouseup;
                        for (var i = 0; i < 4; i++) {
                            smup[i] = cmup[i];
                        }
                        this.m_shotMouseDownFalse = false;
                        this.m_shotMouseUpFalse = false;
                        var cmouse = this.mousebtn;
                        for (var i = 0; i < 4; i++) {
                            smouse[i] = cmouse[i];
                        }
                    }
                    else {
                        if (!this.m_shotMouseDownFalse) {
                            smdown.fill(false);
                            this.m_shotMouseDownFalse = true;
                        }
                        if (!this.m_shotMouseUpFalse) {
                            smup.fill(false);
                            this.m_shotMouseUpFalse = true;
                        }
                    }
                    var keydirty = this.m_keydirty;
                    shot.hasKeyPressEvent = keydirty;
                    if (keydirty) {
                        //key press
                        var skey = shot.key;
                        var ckey = this.keyPress;
                        for (var k in ckey) {
                            skey[k] = ckey[k];
                        }
                        shot.keyDown = this.keyDown;
                        shot.keyUp = this.keyUp;
                    }
                    else {
                        shot.keyDown = null;
                        shot.keyUp = null;
                    }
                };
                return InputCache;
            }());
            var Input = /** @class */ (function () {
                function Input() {
                }
                Input.init = function (canvas) {
                    if (Input.s_inited)
                        return;
                    Input.s_canvas = canvas;
                    Input.regEventListener();
                    Input.s_inited = true;
                };
                Input.prototype.release = function () {
                    Input.removeEventListener();
                };
                Input.regEventListener = function () {
                    window.addEventListener('keydown', Input.onEvtKeyDown);
                    window.addEventListener('keyup', Input.onEvtKeyUp);
                    var canvas = Input.s_canvas;
                    canvas.addEventListener('mousemove', Input.onEvtMouseMove);
                    canvas.addEventListener('mousedown', Input.onEvtMouseDown);
                    canvas.addEventListener('mouseup', Input.onEvtMouseUp);
                    canvas.addEventListener('mousewheel', Input.onEvtMouseWheel);
                };
                Input.removeEventListener = function () {
                    window.removeEventListener('keydown', Input.onEvtKeyDown);
                    window.removeEventListener('keyup', Input.onEvtKeyUp);
                    var canvas = Input.s_canvas;
                    canvas.removeEventListener('mousemove', Input.onEvtMouseMove);
                    canvas.removeEventListener('mousedown', Input.onEvtMouseDown);
                    canvas.removeEventListener('mouseup', Input.onEvtMouseUp);
                };
                Input.onEvtKeyDown = function (e) {
                    var c = Input.s_cache;
                    c.setKeyDown(e);
                };
                Input.onEvtKeyUp = function (e) {
                    var c = Input.s_cache;
                    c.setKeyUp(e);
                };
                Input.onEvtMouseMove = function (e) {
                    var c = Input.s_cache;
                    c.setMousePos(e);
                };
                Input.onEvtMouseDown = function (e) {
                    var c = Input.s_cache;
                    c.setButtonDown(e);
                };
                Input.onEvtMouseUp = function (e) {
                    var c = Input.s_cache;
                    c.setButtonUp(e);
                };
                Input.onEvtMouseWheel = function (e) {
                    var c = Input.s_cache;
                    c.setMouseWheel(e.deltaY);
                };
                Input.onFrame = function (dt) {
                    var c = Input.s_cache;
                    var snpashot = Input.snapshot;
                    snpashot.deltaTime = dt;
                    c.applytoSnapShot(Input.snapshot);
                    c.reset();
                };
                Input.s_inited = false;
                Input.s_cache = new InputCache();
                Input.snapshot = new InputSnapShot();
                return Input;
            }());

            var CameraFreeFly = /** @class */ (function (_super) {
                __extends$1(CameraFreeFly, _super);
                function CameraFreeFly() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.m_startpos = vec3.zero;
                    _this.m_rotay = 0;
                    _this.m_rotax = 0;
                    return _this;
                }
                CameraFreeFly.prototype.onStart = function () {
                    console.log('camera freefly onstart');
                    this.m_trs = this.gameobject.transform;
                };
                CameraFreeFly.prototype.onUpdate = function (scene) {
                    var trs = this.m_trs;
                    var snapshot = Input.snapshot;
                    if (snapshot.getKey('w')) {
                        trs.applyTranslate(trs.forward.mulToRef(-0.3));
                    }
                    else if (snapshot.getKey('s')) {
                        trs.applyTranslate(trs.forward.mulToRef(0.3));
                    }
                    if (snapshot.getKey('d')) {
                        trs.applyTranslate(trs.right.mulToRef(-0.3));
                    }
                    else if (snapshot.getKey('a')) {
                        trs.applyTranslate(trs.right.mulToRef(0.3));
                    }
                    if (snapshot.mousewheel) {
                        var offset = trs.forward.mulNumToRef(snapshot.mousewheelDelta * 0.05);
                        trs.applyTranslate(offset);
                    }
                    if (snapshot.getMouseBtn(0)) {
                        if (snapshot.getMouseDown(0)) {
                            this.m_startpos.set(snapshot.mousepos);
                            var q = trs.localRotation;
                            var e = q.toEuler();
                            this.m_rotax = e.x;
                            this.m_rotay = e.y;
                        }
                        else {
                            var mpos = snapshot.mousepos;
                            var spos = this.m_startpos;
                            var deltax = mpos.x - spos.x;
                            var deltay = mpos.y - spos.y;
                            if (deltax != 0 && deltay != 0) {
                                var deg2rad = glmath.Deg2Rad;
                                var rotax = this.m_rotax - deltay * deg2rad * 0.3;
                                var rotay = this.m_rotay + deltax * deg2rad * 0.3;
                                trs.setRotation(quat.fromEuler(rotax, rotay, 0));
                            }
                        }
                    }
                };
                return CameraFreeFly;
            }(Component));

            var FRAME_INTERVAL = 60;
            var FRAME_INTERVAL_P = FRAME_INTERVAL * 1000;
            var FrameTimer = /** @class */ (function () {
                function FrameTimer(printFPS) {
                    if (printFPS === void 0) { printFPS = false; }
                    this.m_ts = 0;
                    this.m_delta = 0;
                    this.m_deltaaccu = 0;
                    this.m_accuCount = 0;
                    this.m_fps = 0;
                    this.m_printfps = false;
                    this.m_printfps = printFPS;
                }
                Object.defineProperty(FrameTimer.prototype, "fps", {
                    get: function () {
                        return this.m_fps;
                    },
                    enumerable: true,
                    configurable: true
                });
                FrameTimer.prototype.tick = function (ts) {
                    var delta = ts - this.m_ts;
                    this.m_delta = delta;
                    this.m_ts = ts;
                    if (this.m_printfps) {
                        this.m_deltaaccu += this.m_delta;
                        var accuc = this.m_accuCount;
                        accuc++;
                        if (accuc >= FRAME_INTERVAL) {
                            this.m_fps = FRAME_INTERVAL_P / this.m_deltaaccu;
                            this.m_deltaaccu = 0;
                            accuc = 0;
                            console.log("FPS " + this.m_fps);
                        }
                        this.m_accuCount = accuc;
                    }
                    return delta;
                };
                return FrameTimer;
            }());

            (function (LightType) {
                LightType[LightType["direction"] = 0] = "direction";
                LightType[LightType["point"] = 1] = "point";
            })(exports.LightType || (exports.LightType = {}));
            var Light = /** @class */ (function (_super) {
                __extends$1(Light, _super);
                function Light(type, intensity, color) {
                    var _this = _super.call(this) || this;
                    _this.lightType = exports.LightType.point;
                    _this.intensity = 1.0;
                    _this.lightColor = vec3.one;
                    _this.m_range = 10;
                    _this.m_paramDirty = true;
                    _this.castShadow = false;
                    _this.lightType = type;
                    if (intensity)
                        _this.intensity = intensity;
                    if (color)
                        _this.lightColor = color;
                    return _this;
                }
                Object.defineProperty(Light.prototype, "range", {
                    get: function () {
                        return this.m_range;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Light.prototype, "lightPosData", {
                    get: function () {
                        if (this.lightType == exports.LightType.direction) {
                            return this.transform.forward;
                        }
                        else {
                            return this.transform.localPosition;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Light.prototype, "isDirty", {
                    get: function () {
                        return this.transform.isDirty && this.m_paramDirty;
                    },
                    set: function (v) {
                        if (v) {
                            this.m_paramDirty = true;
                        }
                        else {
                            this.m_paramDirty = false;
                            this.transform.setLocalDirty(false);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Light.createPointLight = function (gobj, range, position, intensity, color) {
                    if (range === void 0) { range = 10; }
                    var light = new Light(exports.LightType.point, intensity, color);
                    gobj.addComponent(light);
                    if (position)
                        light.transform.localPosition = position;
                    light.m_range = range;
                    return light;
                };
                Light.creatDirctionLight = function (gobj, intensity, dir, color) {
                    if (intensity === void 0) { intensity = 1.0; }
                    if (dir === void 0) { dir = vec3.down; }
                    if (color === void 0) { color = vec3.one; }
                    var light = new Light(exports.LightType.direction, intensity, color);
                    gobj.addComponent(light);
                    light.transform.forward = dir.normalized();
                    light.castShadow = true;
                    return light;
                };
                Light.prototype.onUpdate = function (scene) {
                    scene.addLight(this);
                };
                return Light;
            }(Component));

            (function (MeshTopology) {
                MeshTopology[MeshTopology["Triangles"] = 4] = "Triangles";
                MeshTopology[MeshTopology["TriangleFan"] = 6] = "TriangleFan";
                MeshTopology[MeshTopology["TriangleStrip"] = 5] = "TriangleStrip";
                MeshTopology[MeshTopology["Points"] = 0] = "Points";
                MeshTopology[MeshTopology["Lines"] = 1] = "Lines";
                MeshTopology[MeshTopology["LineStrip"] = 3] = "LineStrip";
                MeshTopology[MeshTopology["LineLoop"] = 2] = "LineLoop";
            })(exports.MeshTopology || (exports.MeshTopology = {}));
            var MeshVertexAttrDesc = /** @class */ (function () {
                /**
                 * constructor of MeshVertexAttrDesc
                 * @param type data type
                 * @param size componsnet length [1,2,3,4]
                 * @param bytes total size in bytes
                 * @param offset offset in bytes
                 */
                function MeshVertexAttrDesc(type, size, bytes, offset) {
                    if (offset === void 0) { offset = 0; }
                    this.type = type;
                    this.size = size;
                    this.totalbytes = bytes;
                    this.offset = 0;
                }
                Object.defineProperty(MeshVertexAttrDesc.prototype, "length", {
                    get: function () {
                        return this.totalbytes / this.size / MeshBufferUtility.TypeSize(this.type);
                    },
                    enumerable: true,
                    configurable: true
                });
                return MeshVertexAttrDesc;
            }());
            var MeshVertexDesc = /** @class */ (function () {
                function MeshVertexDesc() {
                }
                Object.defineProperty(MeshVertexDesc.prototype, "totalByteSize", {
                    get: function () {
                        var bytes = this.position.totalbytes;
                        if (this.uv != null) {
                            bytes += this.uv.totalbytes;
                        }
                        if (this.normal != null) {
                            bytes += this.normal.totalbytes;
                        }
                        return bytes;
                    },
                    enumerable: true,
                    configurable: true
                });
                return MeshVertexDesc;
            }());
            var MeshIndicesDesc = /** @class */ (function () {
                function MeshIndicesDesc() {
                    this.indiceCount = 0;
                }
                return MeshIndicesDesc;
            }());
            var Mesh = /** @class */ (function () {
                function Mesh() {
                    this.vertexDesc = new MeshVertexDesc();
                    this.indiceDesc = new MeshIndicesDesc();
                    this.m_bufferInited = false;
                }
                Object.defineProperty(Mesh.prototype, "bufferInited", {
                    get: function () {
                        return this.m_bufferInited;
                    },
                    enumerable: true,
                    configurable: true
                });
                Mesh.prototype.setNormal = function (data, type, size) {
                    this.m_dataNormal = data;
                    this.vertexDesc.normal = new MeshVertexAttrDesc(type, size, data.byteLength);
                };
                Mesh.prototype.setUV = function (data, type, size) {
                    this.m_dataUV = data;
                    this.vertexDesc.uv = new MeshVertexAttrDesc(type, size, data.byteLength);
                };
                /**
                 *
                 * @param data
                 * @param type data type
                 * @param size component size
                 */
                Mesh.prototype.setPosition = function (data, type, size) {
                    this.m_dataPosition = data;
                    this.vertexDesc.position = new MeshVertexAttrDesc(type, size, data.byteLength);
                };
                Mesh.prototype.setIndices = function (data, type, mode) {
                    this.m_dataIndices = data;
                    this.indiceDesc.indiceCount = data.length;
                    this.indiceDesc.topology = mode;
                    this.indiceDesc.indices = new MeshVertexAttrDesc(type, 1, data.byteLength, 0);
                };
                Object.defineProperty(Mesh, "Quad", {
                    get: function () {
                        if (Mesh.s_quad != null)
                            return Mesh.s_quad;
                        var quad = new Mesh();
                        Mesh.s_quad = quad;
                        var dataPosition = new Float32Array([
                            -0.5, -0.5, 0, 1,
                            0.5, -0.5, 0, 1,
                            -0.5, 0.5, 0, 1,
                            0.5, 0.5, 0, 1
                        ]);
                        var dataIndices = new Uint16Array([
                            0, 1, 2,
                            1, 3, 2
                        ]);
                        var dataUV = new Float32Array([
                            0.0, 1.0,
                            1.0, 1.0,
                            0.0, 0.0,
                            1.0, 0.0
                        ]);
                        quad.m_dataPosition = dataPosition;
                        quad.m_dataUV = dataUV;
                        quad.m_dataIndices = dataIndices;
                        quad.name = "quad";
                        var vertexdesc = quad.vertexDesc;
                        vertexdesc.position = new MeshVertexAttrDesc(GL.FLOAT, 4, dataPosition.length * 4);
                        vertexdesc.uv = new MeshVertexAttrDesc(GL.FLOAT, 2, dataUV.length * 4);
                        var indicedesc = quad.indiceDesc;
                        indicedesc.topology = exports.MeshTopology.Triangles;
                        indicedesc.indices = new MeshVertexAttrDesc(GL.UNSIGNED_SHORT, 1, dataIndices.byteLength, 0);
                        indicedesc.indiceCount = dataIndices.length;
                        quad.calculateNormal();
                        return quad;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Mesh, "Cube", {
                    get: function () {
                        if (Mesh.s_cube != null)
                            return Mesh.s_cube;
                        var cube = new Mesh();
                        Mesh.s_cube = cube;
                        var dataPosition = new Float32Array([
                            -1, 1, 1, 1,
                            1, 1, 1, 1,
                            -1, -1, 1, 1,
                            1, -1, 1, 1,
                            1, 1, 1, 1,
                            1, 1, -1, 1,
                            1, -1, 1, 1,
                            1, -1, -1, 1,
                            1, 1, -1, 1,
                            -1, 1, -1, 1,
                            1, -1, -1, 1,
                            -1, -1, -1, 1,
                            -1, 1, -1, 1,
                            -1, 1, 1, 1,
                            -1, -1, -1, 1,
                            -1, -1, 1, 1,
                            -1, 1, -1, 1,
                            1, 1, -1, 1,
                            -1, 1, 1, 1,
                            1, 1, 1, 1,
                            -1, -1, 1, 1,
                            1, -1, 1, 1,
                            -1, -1, -1, 1,
                            1, -1, -1, 1,
                        ]);
                        var dataUV = new Float32Array(48);
                        for (var i = 0; i < 6; i++) {
                            dataUV.set([0, 1, 1, 1, 0, 0, 1, 0], i * 8);
                        }
                        var dataIndices = [];
                        for (var i_1 = 0; i_1 < 6; i_1++) {
                            var k = i_1 * 4;
                            dataIndices.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
                        }
                        cube.m_dataIndices = new Uint16Array(dataIndices);
                        cube.m_dataPosition = dataPosition;
                        cube.m_dataUV = dataUV;
                        cube.name = "cube";
                        var vertexdesc = cube.vertexDesc;
                        vertexdesc.position = new MeshVertexAttrDesc(GL.FLOAT, 4, dataPosition.length * 4);
                        vertexdesc.uv = new MeshVertexAttrDesc(GL.FLOAT, 2, dataUV.length * 4);
                        var indicedesc = cube.indiceDesc;
                        indicedesc.topology = exports.MeshTopology.Triangles;
                        indicedesc.indices = new MeshVertexAttrDesc(GL.UNSIGNED_SHORT, 1, dataIndices.length * 2, 0);
                        indicedesc.indiceCount = dataIndices.length;
                        cube.calculateNormal();
                        return cube;
                    },
                    enumerable: true,
                    configurable: true
                });
                Mesh.prototype.calculateNormal = function () {
                    if (this.indiceDesc.topology != exports.MeshTopology.Triangles) {
                        console.warn(exports.MeshTopology[this.indiceDesc.topology] + " is not supported.");
                        return;
                    }
                    var normal = this.m_dataNormal;
                    var position = this.m_dataPosition;
                    if (position == null) {
                        console.warn('vertices position is needed for normal calculation.');
                        return;
                    }
                    var indics = this.m_dataIndices;
                    if (indics == null) {
                        console.warn('indices data is needed for normal calculation.');
                        return;
                    }
                    var positionattr = this.vertexDesc.position;
                    var floatLength = positionattr.totalbytes / MeshBufferUtility.TypeSize(positionattr.type);
                    var normaldata = new Float32Array(floatLength);
                    var verticesLen = floatLength / positionattr.size;
                    var normalVec = new Array(verticesLen);
                    var normalAcc = new Uint16Array(verticesLen);
                    var tricount = indics.length / 3;
                    for (var i = 0; i < tricount; i++) {
                        var off = i * 3;
                        var i1 = indics[off];
                        var i2 = indics[off + 1];
                        var i3 = indics[off + 2];
                        var i1v = i1 * 4;
                        var i2v = i2 * 4;
                        var i3v = i3 * 4;
                        var v1 = new vec3([position[i1v], position[i1v + 1], position[i1v + 2]]);
                        var v2 = new vec3([position[i2v], position[i2v + 1], position[i2v + 2]]);
                        var v3 = new vec3([position[i3v], position[i3v + 1], position[i3v + 2]]);
                        var n = vec3.Cross(v1.sub(v2), v3.sub(v2)).normalize;
                        normalAcc[i1]++;
                        if (normalVec[i1] == null)
                            normalVec[i1] = vec3.zero;
                        normalVec[i1].add(n);
                        normalAcc[i2]++;
                        if (normalVec[i2] == null)
                            normalVec[i2] = vec3.zero;
                        normalVec[i2].add(n);
                        normalAcc[i3]++;
                        if (normalVec[i3] == null)
                            normalVec[i3] = vec3.zero;
                        normalVec[i3].add(n);
                    }
                    for (var i = 0; i < verticesLen; i++) {
                        var v = normalVec[i].div(normalAcc[i]).raw;
                        normaldata.set([v[0], v[1], v[2], 0], i * 4);
                    }
                    this.m_dataNormal = normaldata;
                    this.vertexDesc.normal = new MeshVertexAttrDesc(GL.FLOAT, 4, normaldata.length * 4);
                };
                Mesh.prototype.refreshMeshBuffer = function (glctx) {
                    if (this.m_bufferInited)
                        return;
                    var gl = glctx.gl;
                    var buffervert = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, buffervert);
                    this.bufferVertices = buffervert;
                    var dataTotalSize = this.vertexDesc.totalByteSize;
                    var totalData = new ArrayBuffer(dataTotalSize);
                    var totalDataView = new DataView(totalData, 0, dataTotalSize);
                    var offset = 0;
                    var vertexDesc = this.vertexDesc;
                    if (this.m_dataPosition != null) {
                        vertexDesc.position.offset = offset;
                        offset = MeshBufferUtility.copyBuffer(totalDataView, this.m_dataPosition, offset);
                        offset = Math.ceil(offset / 4.0) * 4;
                    }
                    if (this.m_dataUV != null) {
                        vertexDesc.uv.offset = offset;
                        offset = MeshBufferUtility.copyBuffer(totalDataView, this.m_dataUV, offset);
                        offset = Math.ceil(offset / 4.0) * 4;
                    }
                    if (this.m_dataNormal != null) {
                        vertexDesc.normal.offset = offset;
                        offset = MeshBufferUtility.copyBuffer(totalDataView, this.m_dataNormal, offset);
                        offset = Math.ceil(offset / 4.0) * 4;
                    }
                    gl.bufferData(gl.ARRAY_BUFFER, totalData, gl.STATIC_DRAW);
                    gl.bindBuffer(gl.ARRAY_BUFFER, null);
                    //Indices
                    var dataIndices = this.m_dataIndices;
                    var hasIndices = dataIndices != null && dataIndices.length != 0;
                    if (hasIndices) {
                        var bufferIndices = gl.createBuffer();
                        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferIndices);
                        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, dataIndices, gl.STATIC_DRAW);
                        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
                        this.bufferIndices = bufferIndices;
                    }
                    this.m_bufferInited = true;
                };
                return Mesh;
            }());
            var MeshBufferUtility = /** @class */ (function () {
                function MeshBufferUtility() {
                }
                /**
                 *
                 * @param target
                 * @param buffer
                 * @param offsetInByte
                 * @returns endpos in byte
                 */
                MeshBufferUtility.copyBuffer = function (target, buffer, offsetInByte) {
                    var offset = offsetInByte;
                    if (buffer instanceof DataView) {
                        var sourceView = new Uint8Array(buffer.buffer, 0, buffer.byteLength);
                        for (var i = 0, len = sourceView.byteLength; i < len; i++) {
                            target.setUint8(offset, sourceView[i]);
                            offset++;
                        }
                        return offset;
                    }
                    else if (buffer instanceof ArrayBuffer) {
                        var sourceView = new Uint8Array(buffer, 0, buffer.byteLength);
                        for (var i = 0, len = sourceView.byteLength; i < len; i++) {
                            target.setUint8(offset, sourceView[i]);
                            offset++;
                        }
                        return offset;
                    }
                    else if (buffer instanceof Float32Array) {
                        for (var i = 0, len = buffer.length; i < len; i++) {
                            target.setFloat32(offset, buffer[i], true);
                            offset += 4;
                        }
                        return offset;
                    }
                    else if (buffer instanceof Uint16Array) {
                        for (var i = 0, len = buffer.length; i < len; i++) {
                            target.setUint16(offset, buffer[i]);
                            offset += 2;
                        }
                        return offset;
                    }
                    else {
                        throw new Error('not implemented');
                    }
                };
                MeshBufferUtility.TypeSize = function (type) {
                    if (type == GLConst.FLOAT || type == GLConst.UNSIGNED_INT) {
                        return 4;
                    }
                    if (type == GLConst.SHORT || type == GLConst.UNSIGNED_SHORT) {
                        return 2;
                    }
                    if (type == GLConst.BYTE || type == GLConst.UNSIGNED_BYTE) {
                        return 1;
                    }
                    return 0;
                };
                return MeshBufferUtility;
            }());

            var Scene = /** @class */ (function (_super) {
                __extends$1(Scene, _super);
                function Scene() {
                    var _this = _super.call(this) || this;
                    _this.m_lightList = [];
                    return _this;
                }
                Object.defineProperty(Scene.prototype, "lights", {
                    get: function () {
                        return this.m_lightList;
                    },
                    enumerable: true,
                    configurable: true
                });
                Scene.prototype.onFrameStart = function () {
                    this.m_lightList = [];
                };
                Scene.prototype.onFrameEnd = function () {
                };
                Scene.prototype.addLight = function (light) {
                    this.m_lightList.push(light);
                };
                return Scene;
            }(GameObject));

            var MeshRender = /** @class */ (function () {
                function MeshRender(mesh, mat) {
                    this.castShadow = true;
                    this.mesh = mesh;
                    this.material = mat;
                }
                Object.defineProperty(MeshRender.prototype, "vertexArrayObj", {
                    get: function () {
                        return this.m_vao;
                    },
                    enumerable: true,
                    configurable: true
                });
                MeshRender.prototype.release = function (glctx) {
                    if (this.m_vao != null) {
                        glctx.gl.deleteVertexArray(this.m_vao);
                        this.m_vao = null;
                    }
                };
                MeshRender.prototype.refershVertexArray = function (glctx) {
                    var vao = this.m_vao;
                    if (vao != null)
                        return;
                    var mesh = this.mesh;
                    var mat = this.material;
                    if (mat == null || mat.program == null) {
                        throw new Error("material or program is null");
                    }
                    this.m_vao = MeshRender.CreateVertexArrayObj(glctx, mesh, mat.program);
                };
                MeshRender.CreateVertexArrayObj = function (glctx, mesh, program) {
                    if (!mesh.bufferInited) {
                        mesh.refreshMeshBuffer(glctx);
                    }
                    if (program == null)
                        throw new Error("program is null");
                    var attrs = program.Attributes;
                    var vertdesc = mesh.vertexDesc;
                    var gl = glctx.gl;
                    var vao = gl.createVertexArray();
                    gl.bindVertexArray(vao);
                    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.bufferVertices);
                    if (vertdesc.position != null) {
                        var aPos = attrs[ShaderFX.ATTR_aPosition];
                        if (aPos != null) {
                            var posdesc = vertdesc.position;
                            gl.vertexAttribPointer(aPos, posdesc.size, gl.FLOAT, false, posdesc.size * 4, posdesc.offset);
                            gl.enableVertexAttribArray(aPos);
                        }
                    }
                    if (vertdesc.uv != null) {
                        var aUV = attrs[ShaderFX.ATTR_aUV];
                        if (aUV != null) {
                            var uvdesc = vertdesc.uv;
                            gl.vertexAttribPointer(aUV, uvdesc.size, gl.FLOAT, false, uvdesc.size * 4, uvdesc.offset);
                            gl.enableVertexAttribArray(aUV);
                        }
                    }
                    if (vertdesc.normal) {
                        var aNorm = attrs[ShaderFX.ATTR_aNormal];
                        if (aNorm != null) {
                            var normdesc = vertdesc.normal;
                            gl.vertexAttribPointer(aNorm, normdesc.size, gl.FLOAT, false, normdesc.size * 4, normdesc.offset);
                            gl.enableVertexAttribArray(aNorm);
                        }
                    }
                    //indices
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.bufferIndices);
                    gl.bindVertexArray(null);
                    return vao;
                };
                return MeshRender;
            }());

            var SceneManager = /** @class */ (function () {
                function SceneManager() {
                }
                SceneManager.prototype.onFrame = function (scene) {
                    scene.onFrameStart();
                    var strs = scene.transform;
                    // strs.setLocalDirty(false);
                    // strs.setObjMatrixDirty(false);
                    strs.localMatrix;
                    strs.setObjMatrixDirty(false);
                    scene.update(scene);
                    scene.onFrameEnd();
                };
                return SceneManager;
            }());

            var CubeMapType;
            (function (CubeMapType) {
                CubeMapType[CubeMapType["Cube"] = 0] = "Cube";
                CubeMapType[CubeMapType["Texture360"] = 1] = "Texture360";
            })(CubeMapType || (CubeMapType = {}));
            var TextureCubeMap = /** @class */ (function () {
                function TextureCubeMap(type) {
                    this.m_type = type;
                }
                Object.defineProperty(TextureCubeMap.prototype, "gltex", {
                    get: function () {
                        return this.m_rawTex;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TextureCubeMap.prototype, "cubemapType", {
                    get: function () {
                        return this.m_type;
                    },
                    enumerable: true,
                    configurable: true
                });
                TextureCubeMap.prototype.release = function (glctx) {
                    if (this.m_rawTex) {
                        glctx.gl.deleteTexture(this.m_rawTex);
                        this.m_rawTex = null;
                    }
                    return;
                };
                TextureCubeMap.loadCubeMapTex = function (url, glctx) {
                    var _this = this;
                    if (url == null)
                        return null;
                    return new Promise(function (res, rej) { return __awaiter$1(_this, void 0, void 0, function () {
                        var img, texcube, gl, gltex2d;
                        return __generator$1(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, GLUtility.loadImage(url)];
                                case 1:
                                    img = _a.sent();
                                    if (img == null) {
                                        rej('load image failed!');
                                        return [2 /*return*/];
                                    }
                                    texcube = null;
                                    try {
                                        gl = glctx.gl;
                                        gltex2d = gl.createTexture();
                                        gl.activeTexture(Texture.TEMP_TEXID);
                                        gl.bindTexture(gl.TEXTURE_2D, gltex2d);
                                        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
                                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                                        gl.bindTexture(gl.TEXTURE_2D, null);
                                        texcube = new TextureCubeMap(CubeMapType.Texture360);
                                        texcube.m_rawTex = gltex2d;
                                    }
                                    catch (e) {
                                        rej(e);
                                    }
                                    res(texcube);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                };
                /**
                 *
                 * @param urls [Front,Back,Up,Down,Right,Left]
                 * @param glctx
                 */
                TextureCubeMap.loadCubeMap = function (urls, glctx) {
                    return __awaiter$1(this, void 0, void 0, function () {
                        var _this = this;
                        return __generator$1(this, function (_a) {
                            if (urls == null || urls.length != 6)
                                return [2 /*return*/, null];
                            return [2 /*return*/, new Promise(function (res, rej) { return __awaiter$1(_this, void 0, void 0, function () {
                                    var imgpromises, imgurls, i, imgs, texcube, gl, gltexcube, i_1, img;
                                    return __generator$1(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                imgpromises = [];
                                                imgurls = urls;
                                                for (i = 0; i < 6; i++) {
                                                    imgpromises.push(GLUtility.loadImage(imgurls[i]));
                                                }
                                                return [4 /*yield*/, Promise.all(imgpromises)];
                                            case 1:
                                                imgs = _a.sent();
                                                if (imgs.length != 6) {
                                                    rej('load image failed!');
                                                    return [2 /*return*/];
                                                }
                                                texcube = null;
                                                try {
                                                    gl = glctx.gl;
                                                    gltexcube = gl.createTexture();
                                                    gl.activeTexture(Texture.TEMP_TEXID);
                                                    gl.bindTexture(gl.TEXTURE_CUBE_MAP, gltexcube);
                                                    for (i_1 = 0; i_1 < 6; i_1++) {
                                                        img = imgs[i_1];
                                                        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i_1, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
                                                    }
                                                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                                                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                                                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                                                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                                                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
                                                    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
                                                    texcube = new TextureCubeMap(CubeMapType.Cube);
                                                    texcube.m_rawTex = gltexcube;
                                                }
                                                catch (e) {
                                                    rej(e);
                                                    return [2 /*return*/];
                                                }
                                                res(texcube);
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        });
                    });
                };
                return TextureCubeMap;
            }());

            var SceneBuilder = /** @class */ (function () {
                function SceneBuilder(gltfdata, glctx, shaderlib) {
                    this.buffers = {};
                    this.buffersDesc = {};
                    this.materials = {};
                    this.images = {};
                    this.m_gltfData = gltfdata;
                    this.m_glctx = glctx;
                    this.m_shaderfxlib = shaderlib;
                    this.m_pbrShader = shaderlib.shaderPbrMetallicRoughness;
                    this.gltf = gltfdata.gltf;
                }
                SceneBuilder.prototype.release = function () {
                };
                SceneBuilder.prototype.createScene = function () {
                    var gltf = this.gltf;
                    var scenes = gltf.scenes;
                    if (scenes == null)
                        return null;
                    var scene = scenes[gltf.scene];
                    var nodes = gltf.nodes;
                    var scenenodes = scene.nodes;
                    var gscene = new Scene();
                    for (var i = 0, nodeslen = scenenodes.length; i < nodeslen; i++) {
                        var gobj = this.buildNode(nodes, scenenodes[i]);
                        if (gobj != null) {
                            gobj.transform.parent = gscene.transform;
                        }
                    }
                    var gstrs = gscene.transform;
                    // gstrs.localMatrix = mat4.Scale(glmath.vec3(0.001,0.001,0.001));
                    gstrs.setScale(glmath.vec3(0.001, 0.001, 0.001));
                    return gscene;
                };
                SceneBuilder.prototype.buildNode = function (nodes, index) {
                    var _node = nodes[index];
                    if (_node == null) {
                        console.error(nodes);
                        console.error(index);
                        throw new Error("invalid node");
                    }
                    var gobj = new GameObject();
                    gobj.name = _node.name;
                    if (_node.rotation) {
                        gobj.transform.setRotation(new quat(_node.rotation));
                    }
                    else if (_node.matrix) {
                        //Set matrix
                        //TODO
                        gobj.transform.localMatrix = new mat4(_node.matrix);
                    }
                    //gobj.transform.localScale = glmath.vec3(0.001,0.001,0.001);
                    if (_node.mesh) {
                        var meshrender = this.getMesh(_node.mesh);
                        if (meshrender != null) {
                            gobj.render = meshrender;
                        }
                    }
                    var _nodeChildren = _node.children;
                    if (_nodeChildren != null && _nodeChildren.length > 0) {
                        for (var i = 0, len = _nodeChildren.length; i < len; i++) {
                            var g = this.buildNode(nodes, _nodeChildren[i]);
                            if (g != null) {
                                g.transform.parent = gobj.transform;
                            }
                        }
                    }
                    return gobj;
                };
                SceneBuilder.prototype.getMesh = function (meshid) {
                    var _meshes = this.gltf.meshes;
                    if (_meshes == null)
                        return null;
                    var _mesh = _meshes[meshid];
                    if (_mesh == null)
                        return null;
                    var _primitives = _mesh.primitives;
                    if (_primitives == null)
                        return null;
                    var mesh = new Mesh();
                    mesh.name = _mesh.name;
                    //TODO
                    var _primitive = _primitives[0];
                    var _attribute = _primitive.attributes;
                    if (_attribute['NORMAL'] != null) {
                        var index = _attribute['NORMAL'];
                        var buffer = this.getBuffer(index);
                        var desc = this.buffersDesc[index];
                        mesh.setNormal(buffer, desc.type, desc.size);
                    }
                    if (_attribute['POSITION'] != null) {
                        var index = _attribute['POSITION'];
                        var buffer = this.getBuffer(index);
                        var desc = this.buffersDesc[index];
                        mesh.setPosition(buffer, desc.type, desc.size);
                    }
                    if (_attribute['TEXCOORD_0'] != null) {
                        var index = _attribute['TEXCOORD_0'];
                        var buffer = this.getBuffer(index);
                        var desc = this.buffersDesc[index];
                        mesh.setUV(buffer, desc.type, desc.size);
                    }
                    if (_attribute['TANGENT'] != null) ;
                    //Indices
                    {
                        var index = _primitive.indices;
                        if (index != null) {
                            var buffer = this.getBuffer(index);
                            var desc = this.buffersDesc[index];
                            var mode = _primitive.mode == null ? 4 : _primitive.mode;
                            mesh.setIndices(buffer, desc.type, mode);
                        }
                    }
                    var mat = null;
                    var matid = _primitive.material;
                    if (matid != null) {
                        mat = this.getMaterial(_primitive.material);
                    }
                    var meshrender = new MeshRender(mesh, mat);
                    return meshrender;
                };
                SceneBuilder.prototype.getBuffer = function (bufferindex) {
                    var buffers = this.buffers;
                    var cbuffer = buffers[bufferindex];
                    if (cbuffer != null) {
                        return cbuffer;
                    }
                    var _accessors = this.gltf.accessors;
                    var _accessor = _accessors[bufferindex];
                    var _bufferview = this.gltf.bufferViews[_accessor.bufferView];
                    if (_bufferview == null) {
                        console.error(_accessor);
                        console.error(this.gltf.bufferViews[_accessor.bufferView]);
                        throw new Error('buffer view is null');
                    }
                    var rawBuffer = this.m_gltfData.rawBinary;
                    var dataType = _accessor.componentType;
                    var dataBuffer = null;
                    var dataBufferOffset = 0;
                    if (_accessor.byteOffset != null)
                        dataBufferOffset += _accessor.byteOffset;
                    if (_bufferview.byteOffset != null)
                        dataBufferOffset += _bufferview.byteOffset;
                    var sizeType = _accessor.type;
                    var size = this.getSize(sizeType);
                    var componentLength = _accessor.count * size;
                    if (dataType == GL.FLOAT) {
                        dataBuffer = new Float32Array(rawBuffer, dataBufferOffset, componentLength);
                    }
                    else if (dataType == GL.UNSIGNED_INT) {
                        dataBuffer = new Uint32Array(rawBuffer, dataBufferOffset, componentLength);
                    }
                    else if (dataType == GL.UNSIGNED_SHORT) {
                        dataBuffer = new Uint16Array(rawBuffer, dataBufferOffset, componentLength);
                    }
                    else {
                        throw new Error("buffer datatype not supported." + dataType);
                    }
                    var totalbyte = componentLength * MeshBufferUtility.TypeSize(dataType);
                    this.buffers[bufferindex] = dataBuffer;
                    this.buffersDesc[bufferindex] = new MeshVertexAttrDesc(dataType, size, totalbyte);
                    return dataBuffer;
                };
                SceneBuilder.prototype.getSize = function (type) {
                    switch (type) {
                        case "SCALAR":
                            return 1;
                        case "VEC2":
                            return 2;
                        case "VEC3":
                            return 3;
                        case "VEC4":
                            return 4;
                        case "MAT2":
                            return 4;
                        case "MAT3":
                            return 9;
                        case "MAT4":
                            return 16;
                    }
                    throw new Error("invalid type " + type);
                };
                SceneBuilder.prototype.getMaterial = function (index) {
                    var _materials = this.gltf.materials;
                    if (_materials == null)
                        return null;
                    var _material = _materials[index];
                    var mat = new Material(this.m_pbrShader);
                    mat.name = _material.name;
                    var shadertags = null;
                    var shadertagsOverride = false;
                    var matDoubleSided = _material.doubleSided;
                    if (matDoubleSided == true) {
                        if (shadertags == null)
                            shadertags = new ShaderTags();
                        shadertags.culling = CullingMode.None;
                        shadertagsOverride = true;
                    }
                    var alphaMode = _material.alphaMode;
                    if (alphaMode == "BLEND") {
                        if (shadertags == null)
                            shadertags = new ShaderTags();
                        shadertags.blendOp = BlendOperator.ADD;
                        shadertags.queue = RenderQueue.Transparent;
                        shadertagsOverride = true;
                    }
                    if (shadertagsOverride) {
                        if (shadertags.queue == null)
                            shadertags.queue = RenderQueue.Opaque;
                        mat.shaderTags = shadertags;
                    }
                    //pbr property
                    var _pbrMetallicRoughness = _material.pbrMetallicRoughness;
                    if (_pbrMetallicRoughness != null) {
                        var _baseCOlorFactor = _pbrMetallicRoughness.baseColorFactor;
                        if (_baseCOlorFactor != null) {
                            mat.setColor(ShaderFXLibs.SH_PBR_BaseColorFactor, new vec4(_baseCOlorFactor));
                        }
                        var _baseColorTexture = _pbrMetallicRoughness.baseColorTexture;
                        if (_baseColorTexture != null) {
                            var tex = this.getImage(_baseColorTexture.index);
                            if (tex != null)
                                mat.setTexture(ShaderFXLibs.SH_PBR_BaseColorTexture, tex);
                        }
                        var _metallicFactor = _pbrMetallicRoughness.metallicFactor;
                        if (_metallicFactor != null) {
                            mat.setFloat(ShaderFXLibs.SH_PBR_MetallicFactor, _metallicFactor);
                        }
                        var _roughnessFactor = _pbrMetallicRoughness.roughnessFactor;
                        if (_roughnessFactor != null) {
                            mat.setFloat(ShaderFXLibs.SH_PBR_RoughnessFactor, _roughnessFactor);
                        }
                        var _metallicRoughnessTexture = _pbrMetallicRoughness.metallicRoughnessTexture;
                        if (_metallicRoughnessTexture != null) {
                            var tex = this.getImage(_metallicRoughnessTexture.index);
                            mat.setTexture(ShaderFXLibs.SH_PBR_MetallicRoughnessTexture, tex);
                        }
                    }
                    //emissive property
                    var _emissiveFactor = _material.emissiveFactor;
                    if (_emissiveFactor != null) {
                        mat.setColor(ShaderFXLibs.SH_PBR_EmissiveFactor, glmath.vec4(_emissiveFactor[0], _emissiveFactor[1], _emissiveFactor[2], 0));
                    }
                    var _emissiveTexture = _material.emissiveTexture;
                    if (_emissiveTexture != null) {
                        var tex = this.getImage(_emissiveTexture.index);
                        mat.setTexture(ShaderFXLibs.SH_PBR_EmissiveTexture, tex);
                    }
                    this.materials[index] = mat;
                    return mat;
                };
                SceneBuilder.prototype.getImage = function (index) {
                    var img = this.images[index];
                    if (img != null) {
                        return img;
                    }
                    var _images = this.gltf.images;
                    var _image = _images[index];
                    var mime = _image.mimeType;
                    if (mime != "image/png" && mime != "image/jpg") {
                        throw new Error("invalid mime type " + mime);
                    }
                    var _bufferview = this.gltf.bufferViews[_image.bufferView];
                    if (_bufferview == null) {
                        return null;
                    }
                    var rawBuffer = this.m_gltfData.rawBinary;
                    var uint8array = new Uint8Array(rawBuffer, _bufferview.byteOffset, _bufferview.byteLength);
                    var texture = Texture.createTextureSync(uint8array, _image.mimeType, this.m_glctx);
                    this.images[index] = texture;
                    return texture;
                };
                return SceneBuilder;
            }());

            var RenderNodeList = /** @class */ (function () {
                function RenderNodeList() {
                    this.nodeOpaque = [];
                    this.nodeTransparent = [];
                    this.nodeImage = [];
                }
                RenderNodeList.prototype.reset = function () {
                    if (this.nodeOpaque.length != 0)
                        this.nodeOpaque = [];
                    if (this.nodeTransparent.length != 0)
                        this.nodeTransparent = [];
                    if (this.nodeImage.length != 0)
                        this.nodeImage = [];
                };
                RenderNodeList.prototype.pushRenderNode = function (rnode) {
                    var material = rnode.material;
                    var tag = material.shaderTags;
                    if (tag == null)
                        return;
                    switch (tag.queue) {
                        case RenderQueue.Opaque:
                            this.nodeOpaque.push(rnode);
                            break;
                        case RenderQueue.Transparent:
                            this.nodeTransparent.push(rnode);
                            break;
                        case RenderQueue.Image:
                            this.nodeImage.push(rnode);
                            break;
                    }
                };
                RenderNodeList.prototype.sort = function () {
                };
                return RenderNodeList;
            }());

            var PipelineStateCache = /** @class */ (function () {
                function PipelineStateCache(glctx) {
                    this.gl = glctx.gl;
                    this.m_curtags = new ShaderTags();
                }
                PipelineStateCache.prototype.reset = function (tags) {
                    this.m_lastTags = null;
                    var curtags = this.m_curtags;
                    var gl = this.gl;
                    if (tags.ztest != null) {
                        var ztest = tags.ztest;
                        if (curtags.ztest != ztest) {
                            curtags.ztest = ztest;
                            gl.depthFunc(ztest);
                        }
                    }
                    if (tags.culling != null) {
                        var culling = tags.culling;
                        if (curtags.culling != culling) {
                            var curculling = curtags.culling;
                            curtags.culling = culling;
                            if (culling == CullingMode.None) {
                                gl.disable(gl.CULL_FACE);
                            }
                            else {
                                if (curculling == CullingMode.None) {
                                    gl.enable(gl.CULL_FACE);
                                }
                                gl.cullFace(culling);
                            }
                        }
                    }
                    if (tags.zwrite != null) {
                        var zwrite = tags.zwrite;
                        if (curtags.zwrite != zwrite) {
                            curtags.zwrite = zwrite;
                            gl.depthMask(zwrite);
                        }
                    }
                    var blend = tags.blend;
                    if (curtags.blend != blend) {
                        if (!blend) {
                            gl.disable(gl.BLEND);
                        }
                        else {
                            gl.enable(gl.BLEND);
                        }
                    }
                    // if(tags.blendOp != null){
                    //     let blendop = tags.blendOp;
                    //     if(curtags.blendOp != blendop){
                    //         curtags.blendOp = blendop;
                    //         if(blendop == null){
                    //             gl.disable(gl.BLEND);
                    //         }
                    //         else{
                    //             gl.enable(gl.BLEND);
                    //             let op = tags.blendOp;
                    //             let srcf = tags.blendFactorSrc;
                    //             let dstf = tags.blendFactorDst;
                    //             if(op == null) op = BlendOperator.ADD;
                    //             if(srcf == null) srcf = BlendFactor.SRC_ALPHA;
                    //             if(dstf == null) dstf = BlendFactor.ONE_MINUS_SRC_ALPHA;
                    //             if(curtags.blendOp != op){
                    //                 curtags.blendOp = op;
                    //                 gl.blendEquation(op);
                    //             }
                    //             let factorDirty = false;
                    //             if(curtags.blendFactorSrc != srcf){
                    //                 curtags.blendFactorSrc = srcf;
                    //                 factorDirty = true;
                    //             }
                    //             if(curtags.blendFactorDst != dstf){
                    //                 curtags.blendFactorDst = dstf;
                    //                 factorDirty = true;
                    //             }
                    //             if(factorDirty) gl.blendFunc(srcf,dstf);
                    //         }
                    //     }
                    // }
                    this.m_deftags = tags;
                };
                PipelineStateCache.prototype.setZTest = function (comp) {
                    var curtag = this.m_curtags;
                    if (curtag.ztest == comp)
                        return;
                    curtag.ztest = comp;
                    var gl = this.gl;
                    gl.depthFunc(comp);
                };
                PipelineStateCache.prototype.setZWrite = function (enable) {
                    var curtag = this.m_curtags;
                    if (curtag.zwrite == enable)
                        return;
                    curtag.zwrite = enable;
                    var gl = this.gl;
                    gl.depthMask(enable);
                };
                PipelineStateCache.prototype.setBlend = function (enable) {
                    var curtag = this.m_curtags;
                    if (curtag.blend == enable)
                        return;
                    curtag.blend = enable;
                    var gl = this.gl;
                    if (enable) {
                        gl.enable(gl.BLEND);
                    }
                    else {
                        gl.disable(gl.BLEND);
                    }
                };
                PipelineStateCache.prototype.apply = function (tags) {
                    if (this.m_lastTags == tags)
                        return;
                    var deftags = this.m_deftags;
                    var curtags = this.m_curtags;
                    var gl = this.gl;
                    var ztest = tags.ztest;
                    if (ztest == null)
                        ztest = deftags.ztest;
                    if (ztest != curtags.ztest) {
                        curtags.ztest = ztest;
                        gl.depthFunc(ztest);
                    }
                    var culling = tags.culling;
                    if (culling == null)
                        culling = deftags.culling;
                    if (culling != curtags.culling) {
                        var curculling = curtags.culling;
                        curtags.culling = culling;
                        if (culling == CullingMode.None) {
                            gl.disable(gl.CULL_FACE);
                        }
                        else {
                            if (curculling == CullingMode.None) {
                                gl.enable(gl.CULL_FACE);
                            }
                            gl.cullFace(culling);
                        }
                    }
                    var zwrite = tags.zwrite;
                    if (zwrite == null)
                        zwrite = deftags.zwrite;
                    if (zwrite != curtags.zwrite) {
                        curtags.zwrite = zwrite;
                        gl.depthMask(zwrite);
                    }
                    var blend = tags.blend;
                    if (blend != curtags.blend) {
                        if (blend) {
                            gl.enable(gl.BLEND);
                        }
                        else {
                            gl.disable(gl.BLEND);
                        }
                    }
                    this.m_lastTags = tags;
                };
                return PipelineStateCache;
            }());

            var RenderPipeline = /** @class */ (function () {
                function RenderPipeline() {
                    this.tasks = [];
                    this.m_tasksDirty = false;
                    this.shadowMapEnabled = true;
                    this.ubufferIndex_PerObj = 0;
                    this.ubufferIndex_PerCam = 1;
                    this.ubufferIndex_Light = 2;
                    this.ubufferIndex_ShadowMap = 3;
                    this.m_taskSetup = false;
                    this.m_mainFrameBufferBinded = false;
                    this.m_mainFrameBufferAspect = 1.0;
                    this.m_mainFrameBufferWidth = 0;
                    this.m_mainFrameBufferHeight = 0;
                    this.m_nodelist = [new RenderNodeList(), new RenderNodeList()];
                    this.m_nodelistIndex = 0;
                }
                Object.defineProperty(RenderPipeline.prototype, "mainFrameBufferWidth", {
                    get: function () {
                        return this.m_mainFrameBufferWidth;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RenderPipeline.prototype, "mainFrameBufferHeight", {
                    get: function () {
                        return this.m_mainFrameBufferHeight;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RenderPipeline.prototype, "mainFrameBufferAspect", {
                    get: function () {
                        return this.m_mainFrameBufferAspect;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RenderPipeline.prototype, "mainFrameBuffer", {
                    get: function () {
                        return this.m_mainFrameBuffer;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RenderPipeline.prototype, "stateCache", {
                    get: function () {
                        return this.m_pipestateCache;
                    },
                    enumerable: true,
                    configurable: true
                });
                RenderPipeline.prototype.onInitGL = function (glctx) {
                    this.glctx = glctx;
                    this.gl = glctx.gl;
                    var gl = this.gl;
                    var utex_sm = [];
                    var utex_sm_slot = GraphicsRender.TEXID_SHADOW_MAP;
                    utex_sm.push(gl.TEXTURE15);
                    utex_sm.push(gl.TEXTURE16);
                    utex_sm.push(gl.TEXTURE17);
                    utex_sm.push(gl.TEXTURE18);
                    this.utex_sm = utex_sm;
                    this.utex_sm_slot = utex_sm_slot;
                    this.m_pipestateCache = new PipelineStateCache(glctx);
                };
                /**
                 * render setup process, create main framebuffer
                 * custom render can override this function
                 * @param bufferinfo
                 */
                RenderPipeline.prototype.onSetupRender = function (bufferinfo) {
                    this.m_mainFrameBufferInfo = bufferinfo;
                    var fb = this.glctx.createFrameBuffer(true, bufferinfo.colorFormat, bufferinfo.depthFormat);
                    this.m_mainFrameBuffer = fb;
                    var gl = this.glctx.gl;
                    gl.depthMask(true);
                    gl.depthFunc(gl.LEQUAL);
                    gl.enable(gl.DEPTH_TEST);
                };
                RenderPipeline.prototype.resizeFrameBuffer = function (width, height) {
                    var bufferInfo = this.m_mainFrameBufferInfo;
                    this.m_mainFrameBuffer = this.glctx.createFrameBuffer(false, bufferInfo.colorFormat, bufferInfo.depthFormat, width, height, this.m_mainFrameBuffer);
                    this.m_mainFrameBufferWidth = width;
                    this.m_mainFrameBufferHeight = height;
                    this.m_mainFrameBufferAspect = width / height;
                };
                /**
                 * draw main framebuffer to canvas buffer
                 */
                RenderPipeline.prototype.onRenderToCanvas = function () {
                    this.glctx.drawTexFullscreen(this.m_mainFrameBuffer.colorTex0, false, false);
                };
                Object.defineProperty(RenderPipeline.prototype, "GLCtx", {
                    get: function () {
                        return this.glctx;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RenderPipeline.prototype, "GL", {
                    get: function () {
                        return this.gl;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RenderPipeline.prototype, "sharedBufferPerCam", {
                    get: function () {
                        var buf = this.m_sharedBuffer_PerCam;
                        if (buf != null)
                            return buf;
                        var gl = this.gl;
                        buf = gl.createBuffer();
                        gl.bindBuffer(gl.UNIFORM_BUFFER, buf);
                        gl.bindBufferBase(gl.UNIFORM_BUFFER, this.ubufferIndex_PerCam, buf);
                        this.m_sharedBuffer_PerCam = buf;
                        return buf;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RenderPipeline.prototype, "sharedBufferPerObj", {
                    get: function () {
                        var buf = this.m_sharedBuffer_PerObj;
                        if (buf != null)
                            return buf;
                        var gl = this.gl;
                        buf = gl.createBuffer();
                        gl.bindBuffer(gl.UNIFORM_BUFFER, buf);
                        gl.bindBufferBase(gl.UNIFORM_BUFFER, this.ubufferIndex_PerObj, buf);
                        this.m_sharedBuffer_PerObj = buf;
                        return buf;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(RenderPipeline.prototype, "sharedBufferShadowMap", {
                    get: function () {
                        var buf = this.m_sharedBuffer_ShadowMap;
                        if (buf != null)
                            return buf;
                        var gl = this.gl;
                        buf = gl.createBuffer();
                        gl.bindBuffer(gl.UNIFORM_BUFFER, buf);
                        gl.bufferData(gl.UNIFORM_BUFFER, new ShaderDataUniformShadowMap().rawBuffer, gl.DYNAMIC_DRAW);
                        gl.bindBufferBase(gl.UNIFORM_BUFFER, this.ubufferIndex_ShadowMap, buf);
                        this.m_sharedBuffer_ShadowMap = buf;
                        return buf;
                    },
                    enumerable: true,
                    configurable: true
                });
                RenderPipeline.prototype.registerTask = function (task) {
                    task.pipeline = this;
                    this.tasks.push(task);
                    this.m_tasksDirty = true;
                };
                RenderPipeline.prototype.sortTasks = function () {
                    if (this.m_tasksDirty)
                        return;
                    this.tasks.sort(function (a, b) { return a.order - b.order; });
                    this.m_tasksDirty = false;
                };
                RenderPipeline.prototype.setupTasks = function () {
                    var tasks = this.tasks;
                    for (var i = 0, len = tasks.length; i < len; i++) {
                        var t = tasks[i];
                        if (!t.isInited) {
                            t.init();
                        }
                    }
                };
                RenderPipeline.prototype.exec = function (scene) {
                    var glctx = this.glctx;
                    this.m_mainFrameBufferBinded = false;
                    var nodeList = this.generateDrawList(scene);
                    //exec task
                    this.sortTasks();
                    if (!this.m_taskSetup) {
                        this.setupTasks();
                        this.m_taskSetup = true;
                    }
                    var tasks = this.tasks;
                    for (var i = 0, len = tasks.length; i < len; i++) {
                        var t = tasks[i];
                        t.render(nodeList, scene, glctx);
                    }
                    this.UnBindTargetFrameBuffer();
                };
                RenderPipeline.prototype.release = function () {
                    var glctx = this.glctx;
                    var task = this.tasks;
                    for (var i = 0, len = task.length; i < len; i++) {
                        var t = task[i];
                        t.release(glctx);
                    }
                    task = [];
                };
                RenderPipeline.prototype.reload = function () {
                    var glctx = this.glctx;
                    var task = this.tasks;
                    for (var i = 0, len = task.length; i < len; i++) {
                        var t = task[i];
                        t.reload(glctx);
                    }
                };
                /**
                 * @returns whether to call gl.BindFrameBuffer;
                 */
                RenderPipeline.prototype.bindTargetFrameBuffer = function (forece) {
                    if (forece === void 0) { forece = false; }
                    if (this.m_mainFrameBufferBinded && !forece)
                        return false;
                    var mainfb = this.m_mainFrameBuffer;
                    mainfb.bind(this.gl);
                    this.m_mainFrameBufferBinded = true;
                    //TODO
                    this.gl.viewport(0, 0, mainfb.width, mainfb.height);
                    return true;
                };
                RenderPipeline.prototype.UnBindTargetFrameBuffer = function () {
                    if (!this.m_mainFrameBufferBinded)
                        return;
                    var gl = this.gl;
                    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                    this.m_mainFrameBufferBinded = false;
                };
                RenderPipeline.prototype.generateDrawList = function (scene) {
                    var nodelistIndex = this.m_nodelistIndex;
                    var nodelist = this.m_nodelist[nodelistIndex];
                    nodelist.reset();
                    this.traversalRenderNode(nodelist, scene.transform);
                    nodelist.sort();
                    this.m_nodelistIndex = nodelistIndex == 0 ? 1 : 0;
                    return nodelist;
                };
                RenderPipeline.prototype.traversalRenderNode = function (drawlist, obj) {
                    var children = obj.children;
                    if (children == null)
                        return;
                    for (var i = 0, len = children.length; i < len; i++) {
                        var c = children[i];
                        var cobj = c.gameobject;
                        if (!cobj.active)
                            continue;
                        var crender = cobj.render;
                        if (crender != null && crender.mesh != null) {
                            drawlist.pushRenderNode(crender);
                        }
                        this.traversalRenderNode(drawlist, c);
                    }
                };
                return RenderPipeline;
            }());
            var RenderTask = /** @class */ (function () {
                function RenderTask(o, pipeline) {
                    this.order = 0;
                    this.m_inited = false;
                    this.order = o;
                    this.pipeline = pipeline;
                }
                Object.defineProperty(RenderTask.prototype, "isInited", {
                    get: function () {
                        return this.m_inited;
                    },
                    enumerable: true,
                    configurable: true
                });
                RenderTask.prototype.init = function () {
                    this.m_inited = true;
                };
                return RenderTask;
            }());

            var PassOpaque = /** @class */ (function () {
                function PassOpaque(pipeline, deftags) {
                    this.pipeline = pipeline;
                    if (deftags == null) {
                        deftags = new ShaderTags();
                        deftags.blendOp = null;
                        deftags.blend = false;
                        deftags.zwrite = false;
                        deftags.ztest = Comparison.LEQUAL;
                        deftags.culling = CullingMode.Back;
                        deftags.fillDefaultVal();
                    }
                    this.m_tags = deftags;
                    var gl = pipeline.GL;
                    gl.polygonOffset(-1, -1);
                }
                PassOpaque.prototype.render = function (scene, queue) {
                    var CLASS = PipelineForwardZPrepass;
                    var pipe = this.pipeline;
                    var gl = pipe.GL;
                    var glctx = pipe.GLCtx;
                    var deftags = this.m_tags;
                    var NAME_CAM = ShaderDataUniformCam.UNIFORM_CAM;
                    var NAME_OBJ = ShaderDataUniformObj.UNIFORM_OBJ;
                    var NAME_LIGHT = ShaderDataUniformLight.UNIFORM_LIGHT;
                    var NAME_SM = ShaderFX.UNIFORM_SHADOWMAP;
                    var cam = scene.camera;
                    if (queue.length == 0)
                        return;
                    gl.enable(gl.POLYGON_OFFSET_FILL);
                    //cam
                    var datacam = pipe.shaderDataCam;
                    datacam.setMtxProj(cam.ProjMatrix);
                    datacam.setMtxView(cam.WorldMatrix);
                    datacam.setCameraPos(cam.transform.position);
                    datacam.setScreenSize(pipe.mainFrameBufferWidth, pipe.mainFrameBufferHeight);
                    datacam.setClipPlane(cam.near, cam.far);
                    pipe.updateUniformBufferCamera(datacam);
                    //sm
                    var state = pipe.stateCache;
                    state.reset(deftags);
                    pipe.activeDefaultTexture();
                    //do draw
                    var len = queue.length;
                    var curprogram = null;
                    var dataobj = pipe.shaderDataObj;
                    for (var i = 0; i < len; i++) {
                        var node = queue[i];
                        var mat = node.material;
                        var mesh = node.mesh;
                        var program = mat.program;
                        node.refershVertexArray(glctx);
                        if (program != curprogram) {
                            var glp = program.Program;
                            gl.useProgram(glp);
                            var ublock = program.UniformBlock;
                            //cam uniform buffer
                            var indexCam = ublock[NAME_CAM];
                            if (indexCam != null)
                                gl.uniformBlockBinding(glp, indexCam, CLASS.UNIFORMINDEX_CAM);
                            //obj uniform buffer
                            var indexObj = ublock[NAME_OBJ];
                            if (indexObj != null)
                                gl.uniformBlockBinding(glp, indexObj, CLASS.UNIFORMINDEX_OBJ);
                            //light uniform buffer
                            var indexLight = ublock[NAME_LIGHT];
                            if (indexLight != null)
                                gl.uniformBlockBinding(glp, indexLight, CLASS.UNIFORMINDEX_LIGHT);
                            curprogram = program;
                            var indexSM = ublock[NAME_SM];
                            if (indexSM != null) {
                                gl.uniformBlockBinding(glp, indexSM, CLASS.UNIFORMINDEX_SHADOWMAP);
                                var loc = program.Uniforms['uShadowMap'];
                                if (loc != null) {
                                    gl.uniform1i(loc, 12);
                                }
                            }
                        }
                        //state.apply(mat.shaderTags);
                        mat.apply(gl);
                        dataobj.setMtxModel(node.object.transform.objMatrix);
                        pipe.updateUniformBufferObject(dataobj);
                        gl.bindVertexArray(node.vertexArrayObj);
                        var indicedesc = mesh.indiceDesc;
                        gl.drawElements(gl.TRIANGLES, indicedesc.indiceCount, indicedesc.indices.type, 0);
                        gl.bindVertexArray(null);
                        mat.clean(gl);
                    }
                    gl.disable(gl.POLYGON_OFFSET_FILL);
                };
                return PassOpaque;
            }());

            var PassTransparent = /** @class */ (function () {
                function PassTransparent(pipeline, deftags) {
                    this.pipeline = pipeline;
                    if (deftags == null) {
                        deftags = new ShaderTags();
                        deftags.blendOp = BlendOperator.ADD;
                        deftags.blend = true;
                        deftags.zwrite = false;
                        deftags.ztest = Comparison.LEQUAL;
                        deftags.culling = CullingMode.Back;
                        deftags.fillDefaultVal();
                    }
                    this.m_tags = deftags;
                }
                PassTransparent.prototype.render = function (scene, queue) {
                    var CLASS = PipelineForwardZPrepass;
                    var pipe = this.pipeline;
                    var gl = pipe.GL;
                    var glctx = pipe.GLCtx;
                    var deftags = this.m_tags;
                    var NAME_CAM = ShaderDataUniformCam.UNIFORM_CAM;
                    var NAME_OBJ = ShaderDataUniformObj.UNIFORM_OBJ;
                    var NAME_LIGHT = ShaderDataUniformLight.UNIFORM_LIGHT;
                    var cam = scene.camera;
                    if (queue.length == 0)
                        return;
                    //cam
                    var datacam = pipe.shaderDataCam;
                    datacam.setMtxProj(cam.ProjMatrix);
                    datacam.setMtxView(cam.WorldMatrix);
                    datacam.setCameraPos(cam.transform.position);
                    pipe.updateUniformBufferCamera(datacam);
                    //sm
                    var state = pipe.stateCache;
                    state.reset(deftags);
                    pipe.activeDefaultTexture();
                    //do draw
                    var len = queue.length;
                    var curprogram = null;
                    var dataobj = pipe.shaderDataObj;
                    for (var i = 0; i < len; i++) {
                        var node = queue[i];
                        var mat = node.material;
                        var mesh = node.mesh;
                        var program = mat.program;
                        node.refershVertexArray(glctx);
                        if (program != curprogram) {
                            var glp = program.Program;
                            gl.useProgram(glp);
                            var ublock = program.UniformBlock;
                            //cam uniform buffer
                            var indexCam = ublock[NAME_CAM];
                            if (indexCam != null)
                                gl.uniformBlockBinding(glp, indexCam, CLASS.UNIFORMINDEX_CAM);
                            //obj uniform buffer
                            var indexObj = ublock[NAME_OBJ];
                            if (indexObj != null)
                                gl.uniformBlockBinding(glp, indexObj, CLASS.UNIFORMINDEX_OBJ);
                            //light uniform buffer
                            var indexLight = ublock[NAME_LIGHT];
                            if (indexLight != null)
                                gl.uniformBlockBinding(glp, indexLight, CLASS.UNIFORMINDEX_LIGHT);
                            curprogram = program;
                        }
                        //state.apply(mat.shaderTags);
                        mat.apply(gl);
                        dataobj.setMtxModel(node.object.transform.objMatrix);
                        pipe.updateUniformBufferObject(dataobj);
                        gl.bindVertexArray(node.vertexArrayObj);
                        var indicedesc = mesh.indiceDesc;
                        gl.drawElements(gl.TRIANGLES, indicedesc.indiceCount, indicedesc.indices.type, 0);
                        gl.bindVertexArray(null);
                        mat.clean(gl);
                    }
                };
                return PassTransparent;
            }());

            var PassSkybox = /** @class */ (function () {
                function PassSkybox(pipeline, deftags) {
                    this.pipeline = pipeline;
                    if (deftags == null) {
                        deftags = new ShaderTags();
                        deftags.blend = false;
                        deftags.zwrite = true;
                        deftags.ztest = Comparison.LEQUAL;
                        deftags.culling = CullingMode.Back;
                        deftags.fillDefaultVal();
                    }
                    this.m_tags = deftags;
                    var mat = new Material(pipeline.graphicRender.shaderLib.shaderSkybox);
                    this.m_material = mat;
                    mat.setFlag("ENVMAP_TYPE", "CUBE");
                    var program = mat.program;
                    this.m_program = program;
                    var glct = pipeline.GLCtx;
                    var mesh = Mesh.Quad;
                    this.m_quadMesh = mesh;
                    this.m_skyvao = MeshRender.CreateVertexArrayObj(glct, mesh, program);
                    this.m_texuniform = program.Uniforms[ShaderFX.UNIFORM_MAIN_TEXTURE];
                    this.m_uniformBlockCamIndex = program.UniformBlock[ShaderDataUniformCam.UNIFORM_CAM];
                }
                PassSkybox.prototype.render = function (scene, queue) {
                    var CLASS = PipelineForwardZPrepass;
                    var camera = scene.camera;
                    if (camera.clearType != exports.ClearType.Skybox || camera.skybox == null)
                        return;
                    var pipeline = this.pipeline;
                    pipeline.bindTargetFrameBuffer();
                    pipeline.stateCache.reset(this.m_tags);
                    var texskybox = camera.skybox;
                    if (texskybox.cubemapType != this.m_lastCubeType) {
                        var newtype = texskybox.cubemapType;
                        this.m_material.setFlag("ENVMAP_TYPE", newtype == CubeMapType.Cube ? "CUBE" : "TEX");
                        this.m_lastCubeType = newtype;
                        var program_1 = this.m_material.program;
                        this.m_program = program_1;
                        this.m_texuniform = program_1.Uniforms[ShaderFX.UNIFORM_MAIN_TEXTURE];
                    }
                    var program = this.m_program;
                    var gl = pipeline.GL;
                    gl.useProgram(program.Program);
                    var camindex = this.m_uniformBlockCamIndex;
                    if (camindex != null) {
                        gl.uniformBlockBinding(program.Program, camindex, CLASS.UNIFORMINDEX_CAM);
                    }
                    gl.activeTexture(gl.TEXTURE4);
                    var cubetype = this.m_lastCubeType;
                    if (cubetype == CubeMapType.Cube) {
                        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texskybox.gltex);
                    }
                    else {
                        gl.bindTexture(gl.TEXTURE_2D, texskybox.gltex);
                    }
                    gl.uniform1i(this.m_texuniform, 4);
                    gl.bindVertexArray(this.m_skyvao);
                    var indices = this.m_quadMesh.indiceDesc.indiceCount;
                    gl.drawElements(gl.TRIANGLES, indices, gl.UNSIGNED_SHORT, 0);
                    gl.bindVertexArray(null);
                };
                return PassSkybox;
            }());

            var PassDebug = /** @class */ (function () {
                function PassDebug(pipe) {
                    this.pipeline = pipe;
                }
                PassDebug.prototype.render = function (scene, queue) {
                    var pipeline = this.pipeline;
                    var glctx = pipeline.GLCtx;
                    var debugInfo = pipeline.bufferDebugInfo;
                    for (var i = 0, len = debugInfo.length; i < len; i++) {
                        var info = debugInfo[i];
                        var rawtex = info.rawTexture;
                        if (rawtex != null) {
                            glctx.drawTex(rawtex, false, false, info.drawRect);
                        }
                    }
                };
                return PassDebug;
            }());

            var MeshBuilder = /** @class */ (function () {
                function MeshBuilder(topology) {
                    this.m_indicesCount = 0;
                    this.m_topology = topology;
                    this.m_positions = [];
                    this.m_indiecs = [];
                }
                MeshBuilder.prototype.addLine = function (p0, p1) {
                    var pos = this.m_positions;
                    pos.push(p0.x, p0.y, p0.z, 1.0, p1.x, p1.y, p1.z, 1.0);
                    var indice = this.m_indiecs;
                    var indiceCount = this.m_indicesCount;
                    indice.push(indiceCount, indiceCount + 1);
                    this.m_indicesCount += 2;
                };
                MeshBuilder.prototype.addPoint = function (p) {
                };
                MeshBuilder.prototype.addTri = function (p0, p1, p2) {
                    var pos = this.m_positions;
                    pos.push(p0.x, p0.y, p0.z, 1.0);
                    pos.push(p1.x, p1.y, p1.z, 1.0);
                    pos.push(p2.x, p2.y, p2.z, 1.0);
                    var index = this.m_indicesCount;
                    this.m_indiecs.push(index, index + 1, index + 2);
                    this.m_indicesCount = index + 3;
                };
                MeshBuilder.prototype.genMesh = function () {
                    var topo = this.m_topology;
                    var mesh = new Mesh();
                    mesh.setPosition(new Float32Array(this.m_positions), GLConst.FLOAT, 4);
                    mesh.setIndices(new Uint16Array(this.m_indiecs), GLConst.UNSIGNED_SHORT, topo);
                    return mesh;
                };
                return MeshBuilder;
            }());

            var PassGizmos = /** @class */ (function () {
                function PassGizmos(pipe) {
                    this.enable = true;
                    this.pipeline = pipe;
                    if (PassGizmos.s_shader == null) {
                        var shader = ShaderFX.compileShaders(pipe.GLCtx, PassGizmos.SH_gizmos);
                        PassGizmos.s_shader = shader;
                    }
                    var mat = new Material(PassGizmos.s_shader);
                    this.m_material = mat;
                    var mesh = this.genMesh();
                    this.m_mesh = mesh;
                    if (mesh != null) {
                        this.m_vao = MeshRender.CreateVertexArrayObj(pipe.GLCtx, mesh, mat.program);
                    }
                    var tags = new ShaderTags();
                    tags.blend = false;
                    tags.ztest = Comparison.ALWAYS;
                    tags.zwrite = false;
                    tags.fillDefaultVal();
                    this.m_tags = tags;
                }
                PassGizmos.prototype.render = function (scene, queue) {
                    if (!this.enable)
                        return;
                    var mesh = this.m_mesh;
                    if (mesh == null)
                        return;
                    var CLASS = PipelineForwardZPrepass;
                    var NAME_CAM = ShaderDataUniformCam.UNIFORM_CAM;
                    var NAME_OBJ = ShaderDataUniformObj.UNIFORM_OBJ;
                    var pipeline = this.pipeline;
                    var gl = pipeline.GL;
                    pipeline.stateCache.apply(this.m_tags);
                    var mat = this.m_material;
                    var program = mat.program;
                    var glp = program.Program;
                    gl.useProgram(program.Program);
                    var ublock = program.UniformBlock;
                    var indexCam = ublock[NAME_CAM];
                    if (indexCam != null)
                        gl.uniformBlockBinding(glp, indexCam, CLASS.UNIFORMINDEX_CAM);
                    var indexObj = ublock[NAME_OBJ];
                    if (indexObj != null)
                        gl.uniformBlockBinding(glp, indexObj, CLASS.UNIFORMINDEX_OBJ);
                    mat.apply(gl);
                    var dataobj = pipeline.shaderDataObj;
                    var mtx = mat4.Identity;
                    dataobj.setMtxModel(mtx);
                    pipeline.updateUniformBufferObject(dataobj);
                    gl.bindVertexArray(this.m_vao);
                    var indiceDesc = mesh.indiceDesc;
                    gl.drawElements(indiceDesc.topology, indiceDesc.indiceCount, indiceDesc.indices.type, 0);
                    gl.bindVertexArray(null);
                };
                PassGizmos.prototype.genMesh = function () {
                    var builder = new MeshBuilder(exports.MeshTopology.Lines);
                    builder.addLine(glmath.vec3(-50, 0, 0), glmath.vec3(50, 0, 0));
                    builder.addLine(glmath.vec3(0, 0, -50), glmath.vec3(0, 0, 50));
                    builder.addLine(glmath.vec3(-5, 0, -5), glmath.vec3(5, 0, -5));
                    builder.addLine(glmath.vec3(5, 0, -5), glmath.vec3(5, 0, 5));
                    builder.addLine(glmath.vec3(5, 0, 5), glmath.vec3(-5, 0, 5));
                    builder.addLine(glmath.vec3(-5, 0, 5), glmath.vec3(-5, 0, -5));
                    return builder.genMesh();
                };
                __decorate([
                    ShaderFile("gizmos")
                ], PassGizmos, "SH_gizmos", void 0);
                return PassGizmos;
            }());

            var BufferDebugInfo = /** @class */ (function () {
                function BufferDebugInfo(texture, rect) {
                    this.m_texture = texture;
                    this.drawRect = rect.clone();
                }
                Object.defineProperty(BufferDebugInfo.prototype, "rawTexture", {
                    get: function () {
                        if (this.m_texture instanceof Texture) {
                            return this.m_texture.rawtexture;
                        }
                        return this.m_texture;
                    },
                    enumerable: true,
                    configurable: true
                });
                BufferDebugInfo.prototype.setTexture = function (tex) {
                    this.m_texture = tex;
                };
                return BufferDebugInfo;
            }());

            /**
             * Pre-rendering Depth Pass
             */
            var PassDepth = /** @class */ (function () {
                function PassDepth(pipeline, deftags) {
                    this.pipeline = pipeline;
                    if (deftags == null) {
                        deftags = new ShaderTags();
                        deftags.blendOp = null;
                        deftags.blend = false;
                        deftags.zwrite = true;
                        deftags.ztest = Comparison.LEQUAL;
                        deftags.culling = CullingMode.Back;
                        deftags.fillDefaultVal();
                    }
                    this.m_tags = deftags;
                    var shader = pipeline.graphicRender.shaderLib.shaderDepth;
                    this.m_program = shader.defaultProgram;
                    //debug depth texture
                    var debuginfo = new BufferDebugInfo(pipeline.mainDepthTexture, glmath.vec4(0, 0, 200, 200));
                    this.m_bufferDebugInfo = debuginfo;
                    pipeline.addBufferDebugInfo(debuginfo);
                }
                PassDepth.prototype.render = function (scene, queue) {
                    var CLASS = PipelineForwardZPrepass;
                    var pipe = this.pipeline;
                    var gl = pipe.GL;
                    var glctx = pipe.GLCtx;
                    var deftags = this.m_tags;
                    var NAME_CAM = ShaderDataUniformCam.UNIFORM_CAM;
                    var NAME_OBJ = ShaderDataUniformObj.UNIFORM_OBJ;
                    var cam = scene.camera;
                    if (queue.length == 0)
                        return;
                    //diable color buffer
                    gl.colorMask(false, false, false, false);
                    //cam
                    var datacam = pipe.shaderDataCam;
                    datacam.setMtxProj(cam.ProjMatrix);
                    datacam.setMtxView(cam.WorldMatrix);
                    datacam.setCameraPos(cam.transform.position);
                    datacam.setScreenSize(pipe.mainFrameBufferWidth, pipe.mainFrameBufferHeight);
                    datacam.setClipPlane(cam.near, cam.far);
                    pipe.updateUniformBufferCamera(datacam);
                    //state
                    var state = pipe.stateCache;
                    state.reset(deftags);
                    pipe.activeDefaultTexture();
                    //do draw
                    var len = queue.length;
                    var program = this.m_program;
                    var glp = program.Program;
                    gl.useProgram(this.m_program.Program);
                    var ublock = program.UniformBlock;
                    var indexCam = ublock[NAME_CAM];
                    gl.uniformBlockBinding(glp, indexCam, CLASS.UNIFORMINDEX_CAM);
                    var indexObj = ublock[NAME_OBJ];
                    gl.uniformBlockBinding(glp, indexObj, CLASS.UNIFORMINDEX_OBJ);
                    var dataobj = pipe.shaderDataObj;
                    for (var i = 0; i < len; i++) {
                        var node = queue[i];
                        var mat = node.material;
                        var mesh = node.mesh;
                        node.refershVertexArray(glctx);
                        dataobj.setMtxModel(node.object.transform.objMatrix);
                        pipe.updateUniformBufferObject(dataobj);
                        gl.bindVertexArray(node.vertexArrayObj);
                        var indicedesc = mesh.indiceDesc;
                        gl.drawElements(gl.TRIANGLES, indicedesc.indiceCount, indicedesc.indices.type, 0);
                        gl.bindVertexArray(null);
                        mat.clean(gl);
                    }
                    gl.colorMask(true, true, true, true);
                    //copy depth buffer to seperated depth texture
                    var mainfb = pipe.mainFrameBuffer;
                    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, mainfb.frambuffer);
                    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, pipe.mainDepthFrameBuffer);
                    var w = mainfb.width;
                    var h = mainfb.height;
                    gl.blitFramebuffer(0, 0, w, h, 0, 0, w, h, gl.DEPTH_BUFFER_BIT, gl.NEAREST);
                    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
                    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
                    pipe.bindTargetFrameBuffer(true);
                    this.m_bufferDebugInfo.setTexture(pipe.mainDepthTexture);
                };
                return PassDepth;
            }());

            var ShadowMapInfo = /** @class */ (function () {
                function ShadowMapInfo() {
                }
                return ShadowMapInfo;
            }());
            var RenderTaskShadowMap = /** @class */ (function (_super) {
                __extends$1(RenderTaskShadowMap, _super);
                function RenderTaskShadowMap() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.m_debugColor = false;
                    _this.m_shadowMapSize = 1024;
                    return _this;
                }
                RenderTaskShadowMap.prototype.init = function () {
                    if (this.m_inited)
                        return;
                    var pipe = this.pipeline;
                    var gl = pipe.GL;
                    var glctx = pipe.GLCtx;
                    this.m_shadowConfig = pipe.graphicRender.shadowConfig;
                    pipe.shadowMapEnabled = true;
                    //uniformbuffer
                    if (this.m_camdata == null)
                        this.m_camdata = new ShaderDataUniformCam();
                    if (this.m_objdata == null)
                        this.m_objdata = new ShaderDataUniformObj();
                    this.m_cambuffer = pipe.sharedBufferPerCam;
                    this.m_objbuffer = pipe.sharedBufferPerObj;
                    if (this.m_smdata == null)
                        this.m_smdata = new ShaderDataUniformShadowMap();
                    this.m_smbuffer = pipe.sharedBufferShadowMap;
                    //sminfo
                    var shadowMapInfos = [];
                    pipe.shadowMapInfo = shadowMapInfos;
                    for (var i = 0; i < 4; i++) {
                        shadowMapInfos.push(new ShadowMapInfo());
                    }
                    //shaders
                    var shader = ShaderFX.compileShaders(glctx, RenderTaskShadowMap.s_shaderShadowMap);
                    this.m_shadowMapShader = shader;
                    this.m_shadowMapProgram = shader.defaultProgram;
                    var program = this.m_shadowMapProgram;
                    var ublocks = program.UniformBlock;
                    this.m_blockIndexPerCam = ublocks[ShaderFX.UNIFORM_CAM];
                    this.m_blockIndexPerObj = ublocks[ShaderFX.UNIFORM_OBJ];
                    var size = this.m_shadowMapSize;
                    var config = this.m_shadowConfig;
                    this.m_smHeight = size;
                    var smwidth = size;
                    var smheight = size;
                    if (config.cascade == ShadowCascade.TwoCascade) {
                        smwidth *= 2;
                    }
                    this.m_smWidth = smwidth;
                    this.m_smHeight = smheight;
                    //depth texture
                    var deptex = gl.createTexture();
                    this.m_shadowMapTex = deptex;
                    gl.activeTexture(Texture.TEMP_TEXID);
                    gl.bindTexture(gl.TEXTURE_2D, deptex);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.DEPTH_COMPONENT24, smwidth, smheight);
                    gl.bindTexture(gl.TEXTURE_2D, null);
                    pipe.shadowMapInfo[0].texture = deptex;
                    //debug color texture;
                    if (this.m_debugColor) {
                        var debugtex = gl.createTexture();
                        this.m_shadowMapTexDebug = debugtex;
                        gl.bindTexture(gl.TEXTURE_2D, debugtex);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                        gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, smwidth, smheight);
                        gl.bindTexture(gl.TEXTURE_2D, null);
                        this.m_shadowMapTexDebug = debugtex;
                    }
                    //framebuffer
                    var fb = gl.createFramebuffer();
                    this.m_shadowMapFrameBuffer = fb;
                    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, fb);
                    gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, deptex, 0);
                    if (this.m_shadowMapTexDebug)
                        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.m_shadowMapTexDebug, 0);
                    var status = gl.checkFramebufferStatus(gl.DRAW_FRAMEBUFFER);
                    if (status != gl.FRAMEBUFFER_COMPLETE) {
                        console.error('fb status incomplete ' + status.toString(16));
                    }
                    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
                    this.m_inited = true;
                };
                RenderTaskShadowMap.prototype.release = function (glctx) {
                    var pipeline = this.pipeline;
                    var gl = pipeline.GL;
                    this.m_shadowConfig = null;
                    //shader buffers
                    this.m_camdata = null;
                    this.m_objdata = null;
                    this.m_cambuffer = null;
                    this.m_objbuffer = null;
                    this.m_smdata = null;
                    this.m_smbuffer = null;
                    //sminfo
                    pipeline.shadowMapInfo = null;
                    //shaders
                    this.m_shadowMapShader.release();
                    var program = this.m_shadowMapProgram;
                    gl.deleteProgram(program.Program);
                    this.m_shadowMapProgram = null;
                    this.m_blockIndexPerCam = null;
                    this.m_blockIndexPerObj = null;
                    //framebuffers
                    if (this.m_shadowMapFrameBuffer != null) {
                        gl.deleteFramebuffer(this.m_shadowMapFrameBuffer);
                        this.m_shadowMapFrameBuffer = null;
                    }
                    if (this.m_shadowMapTex != null) {
                        gl.deleteTexture(this.m_shadowMapTex);
                        this.m_shadowMapTex = null;
                    }
                    if (this.m_shadowMapTexDebug != null) {
                        gl.deleteTexture(this.m_shadowMapTexDebug);
                        this.m_shadowMapTexDebug = null;
                    }
                    this.m_inited = false;
                };
                RenderTaskShadowMap.prototype.reload = function (glctx) {
                    this.release(glctx);
                    this.init();
                    console.log('[reload RenderTaskShadowMap done!]');
                };
                RenderTaskShadowMap.prototype.render = function (nodelist, scene, glctx) {
                    var camera = scene.camera;
                    if (camera == null)
                        return;
                    camera.aspect = this.pipeline.mainFrameBufferAspect;
                    var lights = scene.lights;
                    var lcount = lights.length;
                    for (var i = 0; i < lcount; i++) {
                        var l = lights[i];
                        if (l.gameobject.active && l.castShadow) {
                            this.renderShadowMap(l, scene, nodelist);
                        }
                    }
                    //update uniformbuffer
                    var gl = this.pipeline.GL;
                    gl.bindBuffer(gl.UNIFORM_BUFFER, this.m_smbuffer);
                    gl.bufferData(gl.UNIFORM_BUFFER, this.m_smdata.rawBuffer, gl.DYNAMIC_DRAW);
                };
                RenderTaskShadowMap.prototype.calCascadeShadowMapLightMtx = function (light, camera, config) {
                    var ctrs = camera.transform;
                    var near = camera.near;
                    var far = camera.far;
                    var camdist = far - near;
                    var shadowDis = Math.min(camdist, config.shadowDistance);
                    var cascades = config.cascade;
                    var cascadeSplit = config.cascadeSplit;
                    var fardist = near;
                    var neardist = near;
                    var campos = ctrs.localPosition;
                    var camforward = ctrs.forward;
                    var hCoefficient = Math.tan(camera.fov / 2.0 * glmath.Deg2Rad);
                    var wCoefficient = hCoefficient * camera.aspect;
                    var ldir = light.lightPosData;
                    var lup = vec3.up;
                    if (Math.abs(vec3.Dot(lup, ldir)) > 0.99) {
                        lup = glmath.vec3(0, 1, 0.001);
                    }
                    var ret = [];
                    for (var i = 0; i < cascades; i++) {
                        var dist = cascadeSplit[i] * shadowDis;
                        fardist += dist;
                        var d = dist * 0.5;
                        var cdist = neardist + d;
                        var cpos = campos.clone().sub(camforward.clone().mul(cdist));
                        var h = fardist * hCoefficient;
                        var w = fardist * wCoefficient;
                        var r = Math.sqrt(h * h + d * d + w * w);
                        var lpos = cpos.sub(ldir.mulToRef(r));
                        var vmtx = mat4.coordCvt(lpos, ldir, lup);
                        var pmtx = mat4.orthographic(r, r, 0.1, r * 2.0);
                        ret.push([vmtx, pmtx]);
                        //next frausta
                        neardist += dist;
                    }
                    return ret;
                };
                RenderTaskShadowMap.prototype.renderShadowMap = function (light, scene, nodelist) {
                    //Temp: only support directional light currently.
                    if (light.lightType != exports.LightType.direction)
                        return;
                    var gl = this.pipeline.GL;
                    var pipe = this.pipeline;
                    var smdata = this.m_smdata;
                    pipe.UnBindTargetFrameBuffer();
                    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.m_shadowMapFrameBuffer);
                    //clear depth
                    gl.enable(gl.DEPTH_TEST);
                    gl.depthFunc(gl.LEQUAL);
                    gl.clearDepth(1.0);
                    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                    gl.viewport(0, 0, this.m_smWidth, this.m_smHeight);
                    var program = this.m_shadowMapProgram;
                    var glp = program.Program;
                    gl.useProgram(program.Program);
                    gl.uniformBlockBinding(glp, this.m_blockIndexPerCam, pipe.ubufferIndex_PerCam);
                    gl.uniformBlockBinding(glp, this.m_blockIndexPerObj, pipe.ubufferIndex_PerObj);
                    //light mtx
                    var camera = scene.camera;
                    var f = camera.far;
                    var lightMtxs = this.calCascadeShadowMapLightMtx(light, camera, this.m_shadowConfig);
                    var _a = lightMtxs[0], lightworldMtx = _a[0], lightProjMtx = _a[1];
                    var lightMtx = lightProjMtx.mul(lightworldMtx);
                    smdata.setLightMtx(lightMtx, 0);
                    this.pipeline.shadowMapInfo[0].lightMtx = lightMtx;
                    var cascades = this.m_shadowConfig.cascade;
                    var nodequeue = nodelist.nodeOpaque;
                    var size = this.m_smHeight;
                    if (cascades == 1) {
                        this.renderShadowCascade(glmath.vec4(0, 0, size, size), nodequeue, lightMtxs[0]);
                    }
                    else if (cascades == 2) {
                        this.renderShadowCascade(glmath.vec4(0, 0, size, size), nodequeue, lightMtxs[0]);
                        this.renderShadowCascade(glmath.vec4(size, 0, size, size), nodequeue, lightMtxs[1]);
                    }
                    else {
                        this.renderShadowCascade(glmath.vec4(0, 0, size, size), nodequeue, lightMtxs[0]);
                        this.renderShadowCascade(glmath.vec4(size, 0, size, size), nodequeue, lightMtxs[1]);
                        this.renderShadowCascade(glmath.vec4(0, size, size, size), nodequeue, lightMtxs[2]);
                        this.renderShadowCascade(glmath.vec4(size, size, size, size), nodequeue, lightMtxs[3]);
                    }
                    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
                };
                RenderTaskShadowMap.prototype.renderShadowCascade = function (viewport, nodelist, mtx) {
                    var glctx = this.pipeline.GLCtx;
                    var gl = glctx.gl;
                    var camData = this.m_camdata;
                    camData.setMtxView(mtx[0]);
                    camData.setMtxProj(mtx[1]);
                    gl.bindBuffer(gl.UNIFORM_BUFFER, this.m_cambuffer);
                    gl.bufferData(gl.UNIFORM_BUFFER, camData.rawBuffer, gl.DYNAMIC_DRAW);
                    gl.viewport(viewport.x, viewport.y, viewport.z, viewport.w);
                    var objdata = this.m_objdata;
                    gl.bindBuffer(gl.UNIFORM_BUFFER, this.m_objbuffer);
                    var queue = nodelist;
                    var queueLen = queue.length;
                    for (var i = 0; i < queueLen; i++) {
                        var node = queue[i];
                        if (!node.castShadow)
                            continue;
                        var mat = node.material;
                        var mesh = node.mesh;
                        if (mat == null || mesh == null || mat.program == null)
                            continue;
                        node.refershVertexArray(glctx);
                        var trs = node.object.transform;
                        //modelmatrix
                        objdata.setMtxModel(trs.objMatrix);
                        gl.bufferData(gl.UNIFORM_BUFFER, objdata.rawBuffer, gl.DYNAMIC_DRAW);
                        gl.bindVertexArray(node.vertexArrayObj);
                        var indicesDesc = mesh.indiceDesc;
                        gl.drawElements(gl.TRIANGLES, indicesDesc.indiceCount, indicesDesc.indices.type, 0);
                        gl.bindVertexArray(null);
                    }
                };
                RenderTaskShadowMap.genShaderShadwoMap = function () {
                    return new ShaderSource("\n        #version 300 es\n        precision highp float;\n        #include SHADERFX_BASIS\n        in vec4 aPosition;\n        void main(){\n            gl_Position = MATRIX_MVP * aPosition;\n        }\n        ", "\n        #version 300 es\n        precision lowp float;\n        out vec4 fragColor;\n        void main(){\n            fragColor = vec4(0,1.0,0,1.0);\n        }\n        ");
                };
                RenderTaskShadowMap.s_shaderShadowMap = RenderTaskShadowMap.genShaderShadwoMap();
                return RenderTaskShadowMap;
            }(RenderTask));

            var PassShadowMap = /** @class */ (function () {
                function PassShadowMap(pipeline) {
                    this.pipe = pipeline;
                    this.initShadowMaps();
                }
                PassShadowMap.prototype.initShadowMaps = function () {
                    var pipe = this.pipe;
                    var gl = pipe.GL;
                    var glctx = pipe.GLCtx;
                    var config = pipe.graphicRender.shadowConfig;
                    var shadowMapInfo = [];
                    pipe.shadowMapInfo = shadowMapInfo;
                    for (var i = 0; i < 4; i++) {
                        shadowMapInfo.push(new ShadowMapInfo());
                    }
                    var shader = pipe.graphicRender.shaderLib.shaderDepth;
                    var program = shader.defaultProgram;
                    this.m_shader = shader;
                    this.m_program = program;
                    var ublocks = program.UniformBlock;
                    var indexCam = ublocks[ShaderFX.UNIFORM_CAM];
                    var indexObj = ublocks[ShaderFX.UNIFORM_OBJ];
                    this.m_blockIndexCam = indexCam;
                    this.m_blockIndexObj = indexObj;
                    var size = config.shadowmapSize;
                    var smheight = size;
                    var smwidth = size;
                    if (config.cascade == ShadowCascade.TwoCascade) {
                        smwidth *= 2;
                    }
                    this.m_smheight = smheight;
                    this.m_smwidth = smwidth;
                    //depth texture and framebuffer
                    var smtexdesc = new TextureCreationDesc(null, gl.DEPTH_COMPONENT24, false, gl.NEAREST, gl.NEAREST);
                    var smtex = Texture.createTexture2D(smwidth, smheight, smtexdesc, glctx);
                    this.m_smtex = smtex;
                    gl.activeTexture(gl.TEXTURE12);
                    gl.bindTexture(gl.TEXTURE_2D, smtex.rawtexture);
                    var smfb = gl.createFramebuffer();
                    this.m_smfb = smfb;
                    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, smfb);
                    gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, smtex.rawtexture, 0);
                    var status = gl.checkFramebufferStatus(gl.DRAW_FRAMEBUFFER);
                    if (status != gl.FRAMEBUFFER_COMPLETE) {
                        console.error('fb status incomplete ' + status.toString(16));
                    }
                    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
                    var debuginfo = new BufferDebugInfo(this.m_smtex, glmath.vec4(200, 0, 200, 200));
                    pipe.addBufferDebugInfo(debuginfo);
                    //shadow gather
                    if (PassShadowMap.s_shadowGatherShader == null) {
                        var gathersh = ShaderFX.compileShaders(glctx, PassShadowMap.SH_shadowGather);
                        PassShadowMap.s_shadowGatherShader = gathersh;
                    }
                    var gathermat = new Material(PassShadowMap.s_shadowGatherShader);
                    var gatherProj = gathermat.program;
                    this.m_gatherMat = gathermat;
                    gathermat.setTexture("uDepthTexure", pipe.mainDepthTexture);
                    gathermat.setTexture("uShadowMap", this.m_smtex);
                    this.m_quadMesh = Mesh.Quad;
                    this.m_quadVAO = MeshRender.CreateVertexArrayObj(glctx, this.m_quadMesh, gatherProj);
                    var texdesc = new TextureCreationDesc(gl.RGB, gl.RGB8, false, gl.LINEAR, gl.LINEAR);
                    var stex = Texture.createTexture2D(pipe.mainFrameBufferWidth, pipe.mainFrameBufferHeight, texdesc, glctx);
                    this.m_shadowTexture = stex;
                    var sfb = gl.createFramebuffer();
                    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, sfb);
                    gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, stex.rawtexture, 0);
                    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
                    this.m_shadowFB = sfb;
                    var debugshadows = new BufferDebugInfo(stex, glmath.vec4(0, 200, 200, 200));
                    pipe.addBufferDebugInfo(debugshadows);
                };
                PassShadowMap.prototype.render = function (scene, queue) {
                    var CLASS = PipelineForwardZPrepass;
                    var cam = scene.camera;
                    if (cam == null)
                        return;
                    var pipe = this.pipe;
                    cam.aspect = pipe.mainFrameBufferAspect;
                    var config = pipe.graphicRender.shadowConfig;
                    //use program 
                    var program = this.m_program;
                    var gl = pipe.GL;
                    var glp = program.Program;
                    gl.useProgram(glp);
                    gl.uniformBlockBinding(glp, this.m_blockIndexCam, CLASS.UNIFORMINDEX_CAM);
                    gl.uniformBlockBinding(glp, this.m_blockIndexObj, CLASS.UNIFORMINDEX_OBJ);
                    var lights = scene.lights;
                    for (var i = 0, lcount = lights.length; i < lcount; i++) {
                        this.renderLightShadowMap(lights[i], cam, queue, config);
                    }
                    //update shadowmap uniform buffer
                    var smdata = this.pipe.shaderDataShadowMap;
                    pipe.updateUniformBufferShadowMap(smdata);
                    //update camerabuffer
                    var datacam = pipe.shaderDataCam;
                    datacam.setCameraPos(cam.transform.position);
                    datacam.setClipPlane(cam.near, cam.far);
                    datacam.setMtxProj(cam.ProjMatrix);
                    datacam.setMtxView(cam.WorldMatrix);
                    datacam.setScreenSize(pipe.mainFrameBufferWidth, pipe.mainFrameBufferHeight);
                    pipe.updateUniformBufferCamera(datacam);
                    //this.shadowGathering(lights[0]);
                    pipe.bindTargetFrameBuffer(true);
                };
                PassShadowMap.prototype.renderLightShadowMap = function (light, camera, queue, config) {
                    if (light.lightType != exports.LightType.direction)
                        return;
                    var pipe = this.pipe;
                    var gl = pipe.GL;
                    var smdata = pipe.shaderDataShadowMap;
                    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.m_smfb);
                    gl.enable(gl.DEPTH_TEST);
                    gl.depthFunc(gl.LEQUAL);
                    gl.clearDepth(1.0);
                    gl.clear(gl.DEPTH_BUFFER_BIT);
                    gl.viewport(0, 0, this.m_smwidth, this.m_smheight);
                    var lightMtxs = this.calculateLightMatrix(light, camera, config);
                    var _a = lightMtxs[0], lightworldMtx = _a[0], lightProjMtx = _a[1];
                    var lightMtx = lightProjMtx.mul(lightworldMtx);
                    smdata.setLightMtx(lightMtx, 0);
                    pipe.shadowMapInfo[0].lightMtx = lightMtx;
                    var cascades = config.cascade;
                    var size = this.m_smheight;
                    if (cascades == 1) {
                        this.renderShadowCascade(glmath.vec4(0, 0, size, size), queue, lightMtxs[0]);
                    }
                    else if (cascades == 2) {
                        this.renderShadowCascade(glmath.vec4(0, 0, size, size), queue, lightMtxs[0]);
                        this.renderShadowCascade(glmath.vec4(size, 0, size, size), queue, lightMtxs[1]);
                    }
                    else {
                        this.renderShadowCascade(glmath.vec4(0, 0, size, size), queue, lightMtxs[0]);
                        this.renderShadowCascade(glmath.vec4(size, 0, size, size), queue, lightMtxs[1]);
                        this.renderShadowCascade(glmath.vec4(0, size, size, size), queue, lightMtxs[2]);
                        this.renderShadowCascade(glmath.vec4(size, size, size, size), queue, lightMtxs[3]);
                    }
                    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
                };
                PassShadowMap.prototype.calculateLightMatrix = function (light, camera, config) {
                    var ctrs = camera.transform;
                    var near = camera.near;
                    var far = camera.far;
                    var camdist = far - near;
                    var shadowDis = Math.min(camdist, config.shadowDistance);
                    var cascades = config.cascade;
                    var cascadeSplit = config.cascadeSplit;
                    var fardist = near;
                    var neardist = near;
                    var campos = ctrs.localPosition;
                    var camforward = ctrs.forward;
                    var hCoefficient = Math.tan(camera.fov / 2.0 * glmath.Deg2Rad);
                    var wCoefficient = hCoefficient * camera.aspect;
                    var ldir = light.lightPosData;
                    var lup = vec3.up;
                    if (Math.abs(vec3.Dot(lup, ldir)) > 0.99) {
                        lup = glmath.vec3(0, 1, 0.001);
                    }
                    var ret = [];
                    for (var i = 0; i < cascades; i++) {
                        var dist = cascadeSplit[i] * shadowDis;
                        fardist += dist;
                        var d = dist * 0.5;
                        var cdist = neardist + d;
                        var cpos = campos.clone().sub(camforward.clone().mul(cdist));
                        var h = fardist * hCoefficient;
                        var w = fardist * wCoefficient;
                        var r = Math.sqrt(h * h + d * d + w * w);
                        var lpos = cpos.sub(ldir.mulToRef(r));
                        var vmtx = mat4.coordCvt(lpos, ldir, lup);
                        var pmtx = mat4.orthographic(r, r, 0.1, r * 2.0);
                        ret.push([vmtx, pmtx]);
                        //next frausta
                        neardist += dist;
                    }
                    return ret;
                };
                PassShadowMap.prototype.renderShadowCascade = function (vp, queue, mtx) {
                    var pipe = this.pipe;
                    var glctx = pipe.GLCtx;
                    var gl = glctx.gl;
                    var camdata = pipe.shaderDataCam;
                    camdata.setMtxView(mtx[0]);
                    camdata.setMtxProj(mtx[1]);
                    pipe.updateUniformBufferCamera(camdata);
                    gl.viewport(vp.x, vp.y, vp.z, vp.w);
                    var objdata = pipe.shaderDataObj;
                    var queueLen = queue.length;
                    for (var i = 0; i < queueLen; i++) {
                        var node = queue[i];
                        if (!node.castShadow)
                            continue;
                        var mat = node.material;
                        var mesh = node.mesh;
                        if (mat == null || mesh == null)
                            continue;
                        node.refershVertexArray(glctx);
                        var trs = node.object.transform;
                        objdata.setMtxModel(trs.objMatrix);
                        pipe.updateUniformBufferObject(objdata);
                        gl.bindVertexArray(node.vertexArrayObj);
                        var indicesDesc = mesh.indiceDesc;
                        gl.drawElements(indicesDesc.topology, indicesDesc.indiceCount, indicesDesc.indices.type, 0);
                        gl.bindVertexArray(null);
                    }
                };
                PassShadowMap.prototype.shadowGathering = function (light) {
                    var CLASS = PipelineForwardZPrepass;
                    var dataSM = this.pipe.shaderDataShadowMap;
                    dataSM.setLightMtx(this.pipe.shadowMapInfo[0].lightMtx, 0);
                    this.pipe.updateUniformBufferShadowMap(dataSM);
                    var gl = this.pipe.GL;
                    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.m_shadowFB);
                    gl.clearColor(0, 0, 0, 0);
                    gl.clear(gl.COLOR_BUFFER_BIT);
                    var shadowtex = this.m_shadowTexture;
                    gl.viewport(0, 0, shadowtex.width, shadowtex.height);
                    var mat = this.m_gatherMat;
                    var program = mat.program;
                    var glp = program.Program;
                    gl.useProgram(glp);
                    var blocks = program.UniformBlock;
                    var indexSM = blocks[ShaderFX.UNIFORM_SHADOWMAP];
                    if (indexSM != null) {
                        gl.uniformBlockBinding(glp, indexSM, CLASS.UNIFORMINDEX_SHADOWMAP);
                    }
                    var indexCam = blocks[ShaderFX.UNIFORM_CAM];
                    if (indexCam != null) {
                        gl.uniformBlockBinding(glp, indexCam, CLASS.UNIFORMINDEX_CAM);
                    }
                    var indexObj = blocks[ShaderFX.UNIFORM_OBJ];
                    if (indexObj != null) {
                        gl.uniformBlockBinding(glp, indexObj, CLASS.UNIFORMINDEX_OBJ);
                    }
                    mat.apply(gl);
                    var mesh = this.m_quadMesh;
                    var vao = this.m_quadVAO;
                    gl.bindVertexArray(vao);
                    var indices = mesh.indiceDesc;
                    gl.drawElements(gl.TRIANGLES, indices.indiceCount, indices.indices.type, 0);
                    gl.bindVertexArray(null);
                    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
                };
                __decorate([
                    ShaderFile("shadowsGather")
                ], PassShadowMap, "SH_shadowGather", void 0);
                return PassShadowMap;
            }());

            var PipelineForwardZPrepass = /** @class */ (function (_super) {
                __extends$1(PipelineForwardZPrepass, _super);
                function PipelineForwardZPrepass() {
                    var _this = _super.call(this) || this;
                    //For debug textures and framebuffers
                    _this.m_bufferDebugInfo = [];
                    return _this;
                }
                Object.defineProperty(PipelineForwardZPrepass.prototype, "bufferDebugInfo", {
                    get: function () {
                        return this.m_bufferDebugInfo;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PipelineForwardZPrepass.prototype, "mainDepthTexture", {
                    get: function () {
                        return this.m_mainDepthTexture;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PipelineForwardZPrepass.prototype, "mainDepthFrameBuffer", {
                    get: function () {
                        return this.m_mainDepthFB;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PipelineForwardZPrepass.prototype, "shaderDataCam", {
                    get: function () {
                        return this.m_shaderDataCam;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PipelineForwardZPrepass.prototype, "shaderDataObj", {
                    get: function () {
                        return this.m_shaderDataObj;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PipelineForwardZPrepass.prototype, "shaderDataLight", {
                    get: function () {
                        return this.m_shaderDataLight;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PipelineForwardZPrepass.prototype, "shaderDataShadowMap", {
                    get: function () {
                        return this.m_shaderDataShadowMap;
                    },
                    enumerable: true,
                    configurable: true
                });
                PipelineForwardZPrepass.prototype.onSetupRender = function (bufferinfo) {
                    this.m_mainFrameBufferInfo = bufferinfo;
                    var fb = this.glctx.createFrameBuffer(true, bufferinfo.colorFormat, bufferinfo.depthFormat);
                    this.m_mainFrameBuffer = fb;
                    this.m_mainFrameBufferWidth = fb.width;
                    this.m_mainFrameBufferHeight = fb.height;
                    this.m_mainFrameBufferAspect = fb.width / fb.height;
                    this.createMainDepthFB(fb.width, fb.height);
                    var gl = this.glctx.gl;
                    gl.depthMask(true);
                    gl.depthFunc(gl.LEQUAL);
                    gl.enable(gl.DEPTH_TEST);
                    this.createUniformBuffers();
                    this.m_passDebug = new PassDebug(this);
                    this.m_passGizmos = new PassGizmos(this);
                    this.m_passDepth = new PassDepth(this);
                    this.m_passOpaque = new PassOpaque(this, null);
                    this.m_passTransparent = new PassTransparent(this, null);
                    this.m_passSkybox = new PassSkybox(this, null);
                    this.m_passShadowMap = new PassShadowMap(this);
                };
                PipelineForwardZPrepass.prototype.createMainDepthFB = function (width, height) {
                    var bufferinfo = this.m_mainFrameBufferInfo;
                    var depthtexdesc = new TextureCreationDesc(null, bufferinfo.depthFormat, false, GL.NEAREST, GL.NEAREST);
                    var tex = Texture.createTexture2D(width, height, depthtexdesc, this.glctx);
                    this.m_mainDepthTexture = tex;
                    var gl = this.gl;
                    if (this.m_mainDepthFB == null) {
                        var fb = gl.createFramebuffer();
                        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, fb);
                        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, tex.rawtexture, 0);
                        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
                        this.m_mainDepthFB = fb;
                    }
                };
                PipelineForwardZPrepass.prototype.resizeFrameBuffer = function (width, height) {
                    _super.prototype.resizeFrameBuffer.call(this, width, height);
                    var glctx = this.glctx;
                    var gl = this.gl;
                    //resize depth framebuffer
                    if (this.m_mainDepthFB != null) {
                        gl.deleteFramebuffer(this.m_mainDepthFB);
                    }
                    var depthtex = this.m_mainDepthTexture;
                    depthtex.resize(width, height, glctx);
                    var fb = gl.createFramebuffer();
                    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, fb);
                    gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthtex.rawtexture, 0);
                    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
                    this.m_mainDepthFB = fb;
                };
                PipelineForwardZPrepass.prototype.createUniformBuffers = function () {
                    var CLASS = PipelineForwardZPrepass;
                    var gl = this.gl;
                    //create internal uniform buffer
                    if (this.m_uniformBufferObj == null) {
                        var data = new ShaderDataUniformObj();
                        this.m_shaderDataObj = data;
                        var buffer = gl.createBuffer();
                        gl.bindBuffer(gl.UNIFORM_BUFFER, buffer);
                        gl.bufferData(gl.UNIFORM_BUFFER, data.rawBuffer, gl.DYNAMIC_DRAW);
                        gl.bindBufferBase(gl.UNIFORM_BUFFER, CLASS.UNIFORMINDEX_OBJ, buffer);
                        this.m_uniformBufferObj = buffer;
                    }
                    if (this.m_uniformBufferCamera == null) {
                        var data = new ShaderDataUniformCam();
                        this.m_shaderDataCam = data;
                        var buffer = gl.createBuffer();
                        gl.bindBuffer(gl.UNIFORM_BUFFER, buffer);
                        gl.bufferData(gl.UNIFORM_BUFFER, data.rawBuffer, gl.DYNAMIC_DRAW);
                        gl.bindBufferBase(gl.UNIFORM_BUFFER, CLASS.UNIFORMINDEX_CAM, buffer);
                        this.m_uniformBufferCamera = buffer;
                    }
                    if (this.m_uniformBufferShadowMap == null) {
                        var data = new ShaderDataUniformShadowMap();
                        this.m_shaderDataShadowMap = data;
                        var buffer = gl.createBuffer();
                        gl.bindBuffer(gl.UNIFORM_BUFFER, buffer);
                        gl.bufferData(gl.UNIFORM_BUFFER, data.rawBuffer, gl.DYNAMIC_DRAW);
                        gl.bindBufferBase(gl.UNIFORM_BUFFER, CLASS.UNIFORMINDEX_SHADOWMAP, buffer);
                        this.m_uniformBufferShadowMap = buffer;
                    }
                    if (this.m_uniformBufferLight == null) {
                        var data = new ShaderDataUniformLight();
                        this.m_shaderDataLight = data;
                        var buffer = gl.createBuffer();
                        gl.bindBuffer(gl.UNIFORM_BUFFER, buffer);
                        gl.bufferData(gl.UNIFORM_BUFFER, data.rawBuffer, gl.DYNAMIC_DRAW);
                        gl.bindBufferBase(gl.UNIFORM_BUFFER, CLASS.UNIFORMINDEX_LIGHT, buffer);
                        this.m_uniformBufferLight = buffer;
                    }
                };
                PipelineForwardZPrepass.prototype.exec = function (scene) {
                    var cam = scene.camera;
                    if (cam == null)
                        return;
                    cam.aspect = this.mainFrameBufferAspect;
                    var nodeList = this.generateDrawList(scene);
                    this.bindTargetFrameBuffer();
                    var gl = this.gl;
                    gl.clearColor(1, 0, 0, 1);
                    gl.clearDepth(10.0);
                    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                    //do rendering
                    var passDepth = this.m_passDepth;
                    passDepth.render(scene, nodeList.nodeOpaque);
                    //sm
                    var passSM = this.m_passShadowMap;
                    passSM.render(scene, nodeList.nodeOpaque);
                    var passOpaque = this.m_passOpaque;
                    passOpaque.render(scene, nodeList.nodeOpaque);
                    var passSkybox = this.m_passSkybox;
                    passSkybox.render(scene, null);
                    var passTransparent = this.m_passTransparent;
                    passTransparent.render(scene, nodeList.nodeTransparent);
                    var passGizmos = this.m_passGizmos;
                    passGizmos.render(null, null);
                    this.renderBufferDebug();
                    this.UnBindTargetFrameBuffer();
                    var state = this.stateCache;
                    state.setBlend(false);
                    state.setZTest(Comparison.ALWAYS);
                    state.setZWrite(true);
                };
                PipelineForwardZPrepass.prototype.updateUniformBufferCamera = function (data) {
                    var gl = this.gl;
                    gl.bindBuffer(gl.UNIFORM_BUFFER, this.m_uniformBufferCamera);
                    gl.bufferData(gl.UNIFORM_BUFFER, data.rawBuffer, gl.DYNAMIC_DRAW);
                };
                PipelineForwardZPrepass.prototype.updateUniformBufferObject = function (data) {
                    var gl = this.gl;
                    gl.bindBuffer(gl.UNIFORM_BUFFER, this.m_uniformBufferObj);
                    gl.bufferData(gl.UNIFORM_BUFFER, data.rawBuffer, gl.DYNAMIC_DRAW);
                };
                PipelineForwardZPrepass.prototype.updateUniformBufferShadowMap = function (data) {
                    var gl = this.gl;
                    gl.bindBuffer(gl.UNIFORM_BUFFER, this.m_uniformBufferShadowMap);
                    gl.bufferData(gl.UNIFORM_BUFFER, data.rawBuffer, gl.DYNAMIC_DRAW);
                };
                PipelineForwardZPrepass.prototype.updateUniformBufferLight = function (data) {
                    var gl = this.gl;
                    gl.bindBuffer(gl.UNIFORM_BUFFER, this.m_uniformBufferLight);
                    gl.bufferData(gl.UNIFORM_BUFFER, data.rawBuffer, gl.DYNAMIC_DRAW);
                };
                PipelineForwardZPrepass.prototype.activeDefaultTexture = function () {
                    var gl = this.gl;
                    gl.activeTexture(gl.TEXTURE3);
                    gl.bindTexture(gl.TEXTURE_2D, this.graphicRender.defaultTexture.rawtexture);
                };
                PipelineForwardZPrepass.prototype.addBufferDebugInfo = function (info) {
                    var curinfo = this.m_bufferDebugInfo;
                    if (curinfo.indexOf(info) >= 0)
                        return;
                    curinfo.push(info);
                };
                PipelineForwardZPrepass.prototype.removeBufferDebugInfo = function (info) {
                    var curinfo = this.m_bufferDebugInfo;
                    var index = curinfo.indexOf(info);
                    if (index < 0)
                        return;
                    curinfo = curinfo.splice(index, 1);
                };
                PipelineForwardZPrepass.prototype.renderBufferDebug = function () {
                    var passdebug = this.m_passDebug;
                    if (passdebug != null && this.m_bufferDebugInfo.length != 0)
                        passdebug.render(null, null);
                };
                PipelineForwardZPrepass.UNIFORMINDEX_OBJ = 0;
                PipelineForwardZPrepass.UNIFORMINDEX_CAM = 1;
                PipelineForwardZPrepass.UNIFORMINDEX_SHADOWMAP = 2;
                PipelineForwardZPrepass.UNIFORMINDEX_LIGHT = 3;
                return PipelineForwardZPrepass;
            }(RenderPipeline));

            var SampleGame = /** @class */ (function () {
                function SampleGame(canvas) {
                    this.m_sceneInited = false;
                    this.m_timer = new FrameTimer(false);
                    this.m_canvas = canvas;
                    var grender = new GraphicsRender(canvas, new PipelineForwardZPrepass());
                    this.m_sceneMgr = new SceneManager();
                    var sc = grender.shadowConfig;
                    sc.shadowDistance = 20;
                    this.m_graphicsRender = grender;
                    Input.init(canvas);
                    this.createScene(grender.glctx);
                    GLUtility.setTargetFPS(60);
                    GLUtility.registerOnFrame(this.onFrame.bind(this));
                }
                SampleGame.prototype.resizeCanvas = function (w, h) {
                    this.m_graphicsRender.resizeCanvas(w, h);
                };
                SampleGame.prototype.onFrame = function (ts) {
                    if (!this.m_sceneInited)
                        return;
                    var delta = this.m_timer.tick(ts);
                    Input.onFrame(delta / 1000);
                    var scene = this.m_scene;
                    this.m_sceneMgr.onFrame(scene);
                    var gredner = this.m_graphicsRender;
                    gredner.render(scene);
                    gredner.renderToCanvas();
                };
                SampleGame.prototype.createScene = function (glctx) {
                    return __awaiter$1(this, void 0, void 0, function () {
                        var grender, tex, texcube, gltf, sceneBuilder, isgltf, scene, skyboxobj, camera, obj1, matDiffuse, obj2, obj2mat, lightobj, light0;
                        return __generator$1(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    grender = this.m_graphicsRender;
                                    return [4 /*yield*/, glctx.createTextureImageAsync('res/images/tex0.png')];
                                case 1:
                                    tex = _a.sent();
                                    return [4 /*yield*/, TextureCubeMap.loadCubeMapTex('res/envmap/day360.jpg', glctx)];
                                case 2:
                                    texcube = _a.sent();
                                    return [4 /*yield*/, GLTFtool.LoadGLTFBinary('res/gltf/scene.glb')];
                                case 3:
                                    gltf = _a.sent();
                                    console.log(gltf.gltf);
                                    sceneBuilder = new SceneBuilder(gltf, glctx, this.m_graphicsRender.shaderLib);
                                    isgltf = true;
                                    scene = null;
                                    if (isgltf) {
                                        scene = sceneBuilder.createScene();
                                        scene.name = "scene";
                                        this.m_scene = scene;
                                        skyboxobj = scene.getChildByName('sky_sky_0');
                                        if (skyboxobj != null)
                                            skyboxobj.render.castShadow = false;
                                    }
                                    else {
                                        scene = new Scene();
                                        this.m_scene = scene;
                                    }
                                    camera = Camera.persepctive(null, 60, 400.0 / 300.0, 0.5, 1000);
                                    camera.transform.setPosition(glmath.vec3(0, 2, 5));
                                    //camera.transform.setLookAt(glmath.vec3(0,0,0));
                                    camera.transform.setLocalDirty();
                                    camera.ambientColor = glmath.vec4(1, 0.2, 0.2, 0.2);
                                    camera.clearType = exports.ClearType.Skybox;
                                    camera.skybox = texcube;
                                    camera.background = glmath.vec4(0, 1, 0, 1);
                                    camera.gameobject.addComponent(new CameraFreeFly());
                                    camera.transform.parent = scene.transform;
                                    camera.gameobject.name = "camera";
                                    this.m_camera = camera;
                                    obj1 = new GameObject("cube");
                                    this.m_obj1 = obj1;
                                    obj1.transform.localPosition = glmath.vec3(0, 5, -5);
                                    obj1.transform.localScale = vec3.one;
                                    matDiffuse = new Material(grender.shaderLib.shaderDiffuse);
                                    matDiffuse.setColor(ShaderFX.UNIFORM_MAIN_COLOR, glmath.vec4(1, 1, 0, 1));
                                    obj1.render = new MeshRender(Mesh.Cube, matDiffuse);
                                    obj1.addComponent({
                                        onUpdate: function (scene) {
                                            var dt = Input.snapshot.deltaTime;
                                            dt *= 30.0;
                                            var rota = quat.fromEulerDeg(dt, -dt, -2 * dt);
                                            var trs = this.gameobject.transform;
                                            trs.applyRotate(rota);
                                        }
                                    });
                                    obj1.transform.parent = scene.transform;
                                    obj2 = new GameObject();
                                    this.m_obj2 = obj2;
                                    obj2.transform.localPosition = glmath.vec3(0, 0, -5);
                                    obj2.transform.localScale = glmath.vec3(20, 20, 1);
                                    obj2.transform.localRotation = quat.axisRotationDeg(vec3.right, 90);
                                    obj2mat = new Material(grender.shaderLib.shaderUnlitTexture);
                                    obj2mat.setColor(ShaderFX.UNIFORM_MAIN_COLOR, glmath.vec4(0.5, 0.5, 0.5, 1));
                                    obj2mat.setTexture(ShaderFX.UNIFORM_MAIN_TEXTURE, tex);
                                    obj2.render = new MeshRender(Mesh.Quad, obj2mat);
                                    obj2.transform.parent = scene.transform;
                                    lightobj = new GameObject();
                                    light0 = Light.creatDirctionLight(lightobj, 1.0, glmath.vec3(-0.5, -1, 0.4));
                                    light0.lightColor = new vec3([1, 1, 1]);
                                    lightobj.transform.parent = scene.transform;
                                    this.m_sceneInited = true;
                                    return [2 /*return*/];
                            }
                        });
                    });
                };
                SampleGame.cmdReload = function (target) {
                    if (target != null)
                        target.m_graphicsRender.reload();
                };
                __decorate([
                    DebugEntry('cmd.reload')
                ], SampleGame, "cmdReload", null);
                return SampleGame;
            }());
            window['SampleGame'] = SampleGame;

            exports.GLContext = GLContext;
            exports.GLProgram = GLProgram;
            exports.GLUtility = GLUtility;
            exports.glmath = glmath;
            exports.vec4 = vec4;
            exports.vec3 = vec3;
            exports.quat = quat;
            exports.mat4 = mat4;
            exports.mat3 = mat3;
            exports.GLFrameBuffer = GLFrameBuffer;
            exports.GLSL_STRUCT = GLSL_STRUCT;
            exports.GLSL_FUNC = GLSL_FUNC;
            exports.GLShaderComposerBase = GLShaderComposerBase;
            exports.GLShaderComposer = GLShaderComposer;
            exports.GLPipelineState = GLPipelineState;
            exports.GLTFaccessor = GLTFaccessor;
            exports.GLTFanimation = GLTFanimation;
            exports.GLTFanimationSampler = GLTFanimationSampler;
            exports.GLTFasset = GLTFasset;
            exports.GLTFbuffer = GLTFbuffer;
            exports.GLTFbufferView = GLTFbufferView;
            exports.GLTFcamera = GLTFcamera;
            exports.GLTFchannel = GLTFchannel;
            exports.GLTFimage = GLTFimage;
            exports.GLTFindices = GLTFindices;
            exports.GLTFmaterial = GLTFmaterial;
            exports.GLTFmesh = GLTFmesh;
            exports.GLTFnode = GLTFnode;
            exports.GLTFnormalTextureInfo = GLTFnormalTextureInfo;
            exports.GLTFocclusionTextureInfo = GLTFocclusionTextureInfo;
            exports.GLTForthographic = GLTForthographic;
            exports.GLTFpbrMetallicRoughness = GLTFpbrMetallicRoughness;
            exports.GLTFperspective = GLTFperspective;
            exports.GLTFprimitive = GLTFprimitive;
            exports.GLTFsampler = GLTFsampler;
            exports.GLTFscene = GLTFscene;
            exports.GLTFskin = GLTFskin;
            exports.GLTFsparse = GLTFsparse;
            exports.GLTFtarget = GLTFtarget;
            exports.GLTFtexture = GLTFtexture;
            exports.GLTFtextureInfo = GLTFtextureInfo;
            exports.GLTFvalues = GLTFvalues;
            exports.GLTFfile = GLTFfile;
            exports.GLTFdata = GLTFdata;
            exports.GLTFbinary = GLTFbinary;
            exports.GLTFtool = GLTFtool;
            exports.DebugEntry = DebugEntry;
            exports.DebugCmd = DebugCmd;
            exports.GraphicsRenderCreateInfo = GraphicsRenderCreateInfo;
            exports.GraphicsRender = GraphicsRender;
            exports.Camera = Camera;
            exports.CameraFreeFly = CameraFreeFly;
            exports.FrameTimer = FrameTimer;
            exports.GameObject = GameObject;
            exports.InputSnapShot = InputSnapShot;
            exports.Input = Input;
            exports.Light = Light;
            exports.MaterialPorpertyBlock = MaterialPorpertyBlock;
            exports.Material = Material;
            exports.MeshVertexAttrDesc = MeshVertexAttrDesc;
            exports.MeshVertexDesc = MeshVertexDesc;
            exports.MeshIndicesDesc = MeshIndicesDesc;
            exports.Mesh = Mesh;
            exports.MeshBufferUtility = MeshBufferUtility;
            exports.Transform = Transform;
            exports.Component = Component;
            exports.Delayter = Delayter;
            exports.Utility = Utility;
            exports.SampleGame = SampleGame;

            return exports;

}({}));
