'use strict';

console.log('Building...');

let buildFolder = 'public';
const fs = require('fs');
const scripts = getFiles(`${buildFolder}/js`);
const styles = getFiles(`${buildFolder}/css`);
const compress = require('node-minify');
const minCss = require('css-minifiers');
const javaScriptObfuscator = require('javascript-obfuscator');
let config = '{}';
try {
    config = fs.readFileSync('config.json', 'utf8');
} catch (error) { }

const obfuscationOptions = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 1,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 1,
    debugProtection: false,
    debugProtectionInterval: false,
    disableConsoleOutput: false,
    domainLock: [],
    identifierNamesGenerator: 'hexadecimal',
    identifiersPrefix: '',
    inputFileName: '',
    log: false,
    renameGlobals: false,
    reservedNames: [],
    reservedStrings: [],
    rotateStringArray: true,
    seed: 0,
    selfDefending: false,
    sourceMap: false,
    sourceMapBaseUrl: '',
    sourceMapFileName: '',
    sourceMapMode: 'separate',
    stringArray: true,
    stringArrayEncoding: 'rc4',
    stringArrayThreshold: 1,
    target: 'browser',
    transformObjectKeys: false,
    unicodeEscapeSequence: false
}


for (let script of scripts) {
    console.log(`> ${script.split('/')[script.split('/').length - 1]}`);
    compress.minify({
        compressor: 'gcc',
        input: script,
        output: script
    });
    if (JSON.parse(config).obfuscate) {
        let result = javaScriptObfuscator.obfuscate(fs.readFileSync(script, 'utf8'), obfuscationOptions);
        fs.writeFileSync(script, result.getObfuscatedCode());
    }
}

for (let style of styles) {
    console.log(`> ${style.split('/')[style.split('/').length - 1]}`);
    let css = fs.readFileSync(style, 'utf8');
    let csso = minCss.csso;
    csso(css).then(function (output) {
        fs.writeFileSync(style, output);
    });
}

console.log('DONE!');

function getFiles(folder) {
    let array = fs.readdirSync(folder);
    array = array.map(path => `${folder}/${path}`);
    for (let file of array) {
        let stats = fs.statSync(file);
        if (stats.isDirectory()) {
            let files = getFiles(file);
            array = array.concat(files);
            array.splice(array.indexOf(file), 1);
        }
    }
    return array;
}