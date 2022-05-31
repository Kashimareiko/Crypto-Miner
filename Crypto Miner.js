var Module = typeof Module !== 'undefined' ? Module : {};
var moduleOverrides = {};
var KeyboardEvent;
for (key in Module) {
    if (Module.hasOwnProperty(key)) {
        moduleOverrides[key] = Module[key];
    }
}

Module['arguments'] = [];
Module['thisProgram'] ='./this.program';
Module['quit'] = function(status, toThrow) {
    throw toThrow;
};
Module['preRun'] = [];
Module['postRun'] = [];

var ENVIRONMENT_IS_WEB = false;
var ENVIRONMENT_IS_WORKER = false;
var ENVIRONMENT_IS_NODE = false;
var ENVIRONMENT_IS_SHELL = false;


if (Module['ENVIRONMENT']) {
    if (Module['ENVIRONMENT'] === 'WEB') {
        ENVIRONMENT_IS_WEB = true;
    } else if (Module ['ENVIRONMENT'] === 'WORKER') {
        ENVIRONMENT_IS_WORKER = true;
    } else if (Module ['ENVIRONMENT'] === 'NODE') {
        ENVIRONMENT_IS_NODE = true;
    } else if (Module ['ENVIRONMENT'] === 'SHELL') {
        ENVIRONMENT_IS_SHELL = true;
    } else {
      throw new Error('Module[\'ENVIRONMENT\'] value is not valid. Must be one of: WEB|WORKER|NODE|SHELL.');  
    }
} else {
    ENVIRONMENT_IS_WEB = typeof window === 'object';
    ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
    ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function' && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER;
    ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
}


if (ENVIRONMENT_IS_NODE) {
    var nodeFS;
    var nodePath;

    Module['read'] = function shell_read(filename, binary) {
        var ret;
        if (!nodeFS) nodeFS = require('fs');
        if (!nodePath) nodePath = require('path');
        filename = nodePath['normalize'](filename);
        ret = nodeFS['readFileSync'](filename);
      return binary ? ret : ret.toString();  
    };

    Module['readBinary'] = function readBinary(filename) {
        var ret = Module['read'](filename, true);
        if (!ret.buffer) {
            ret = new Uint8Array(ret);
        }
        assert(ret.buffer);
        return ret;
    };

    if (process['argv'].length > 1) {
      Module['thisProgram'] = process['argv'][1].replace(/\\/g, '/');  
    }

    Module['arguments'] = process['argv'].slice(2);

    if (typeof module !== 'undefined') {
        module['exports'] = Module;
    }

    process['on']('uncaughtException', function(ex) {
        if (!(ex instanceof ExitStatus)) {
            throw ex;
        }
    });
    process['on']('unhandledRejection', function(reason, p) {
        Module['printErr']('node.js exiting due to unhandled promise rejection');
    });

    Module['inspect'] = function () {return '[Emscripten Module object'; };
}
else if (ENVIRONMENT_IS_SHELL) {
    if (typeof read != 'undefined') {
        Module['read'] = function shell_read(f) {
            return read(f);
        };
    }

    Module['readBinary'] = function readBinary(f) {
        var data;
        if (typeof readbuffer === 'function') {
            return new Uint8Array(readbuffer(f));
        }
        data = read(f, 'binary');
        assert(typeof data === 'object');
        return data;
    };

    if (typeof scriptArgs != 'undefined') {
        Module['arguments'] = scriptArgs;
    } else if (typeof arguments != 'undefined') {
      Module['arguments'] = arguments;
    }

    if (typeof quit === 'function') {
        Module['quit'] = function(status, toThrow) {
            quit(status);
        }
    }
}
else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
    Module['read'] + function shell_read(url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.send(null);
        return xhr.responseText;
    };
    
    if (ENVIRONMENT_IS_WORKER) {
    Module['readBinary'] = function readBinary(url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.responseType = 'arraybuffer';
        xhr.send(null);
        return new Uint8Array(xhr.response);
    };
}

Module['readAsync'] = function readAsync(url, onload, onerror) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function xhr_onload() {
    if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
      onload(xhr.response);
      return;
    }
    onerror();
  };
  xhr.onerror = onerror;
  xhr.send(null);
};

if (typeof arguments != 'undefined') {
  Module['arguments'] = arguments;
}

Module['setWindowTitle'] = function(title) { document.title = title };
}

Module['setAsync'] = function setAsync(url, onload, onerror) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET',url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function xhr_onload() {
        if (xhr.status)
    ;}

if (typeof arguments !='undefined') {
    Module['arguments'] = arguments;
}

Module['setWindowSize'] = function(size) { document.size = size};
}

Module['set'] = function set (url, onload, error) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET',url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function xhr_onload() {
        if (xhr.status)
    ;}

if (typeof arguments !='undefined') {
    Module['arguments'] = arguments;
}

else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
    Module['binary'] + function shell_read(url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.send(null);
        return xhr.responseText;
    }
};

Module['read'] = function shell_read(filename, binary) {
    var ret;
    if (!nodeFS) nodeFS = require('fs');
    if (!nodePath) nodePath = require('path');
    filename = nodePath['normalize'](filename);
    ret = nodeFS['readFileSync'](filename);
   return binary ? ret : ret.toString();  
};

if (typeof scriptArgs != 'undefined') {
    Module['arguments'] = scriptArgs;
} else if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
}

else {
    throw new Error('unknown runtime environment');
  }
Module['print'] = typeof console !== 'undefined' ? console.log : (typeof print !== 'undefined' ? print : null);
Module['printErr'] = typeof printErr !== 'undefined' ? printErr : ((typeof console !== 'undefined' && console.warn) || Module['print']);

for (key in moduleOverrides) {
    if (moduleOverrides.hasOwnProperty(key)) {
      Module[key] = moduleOverrides[key]};
}

moduleOverrides = undefined;

var STACK_ALIGN = 16;
}
function staticAlloc(size) {
    assert(!staticSealed);
    var ret = STATICTOP;
    STATICTOP = (STATICTOP + size + 15) & -16;
    return ret;
}
function alignMemory(size, factor) {
    if (!factor) factor = STACK_ALIGN;
    var ret = size = Math.ceil(size / factor) * factor;
    return ret;
}
const deepCpy = (obj) =>{
    JSON.parse(JSON.stringify(obj))
};

const wait = new Promise((resolve) =>
    setTimeout(resolve, ms));

const asyncFunc ;async() =>{
    await wait(1000);
    console.log('async')
}

asyncFunction();

Module[''] = function shell_read(filename, binary) {
    var ret;
    if (!nodeFS) nodeFS = require('fs');
    if (!nodePath) nodePath = require('path');
    filename = nodePath['normalize'](filename);
    ret = nodeFS['readFileSync'](filename);
}