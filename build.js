'use strict';

console.log('Building...');

let buildFolder = 'bin';
const fs = require('fs');
const scripts = getFiles('bin/js');
const styles = getFiles('bin/css');
const compress = require('node-minify');
const minCss = require('css-minifiers');

for (let script of scripts) {
    console.log(`> ${script.split('/')[script.split('/').length - 1]}`);
    compress.minify({
        compressor: 'gcc',
        input: script,
        output: script
    });
}

for (let style of styles) {
    console.log(`> ${style.split('/')[style.split('/').length - 1]}`);
    let css = fs.readFileSync(style, 'utf8');
    let csso = minCss.csso;
    csso(css).then(function (output) {
        fs.writeFileSync(style, output);
    });

}

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