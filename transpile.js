'use strict';
process.stdout.write('\u001B[2J\u001B[0;0f');
console.log('Loading transpiler data... ');

const fs = require('fs');
const path = require('path');
const { JSDOM } = require("jsdom");
const pretty = require('pretty');
const babel = require('babel-core');

let mapper = JSON.parse(fs.readFileSync('mapper.json', 'utf8'));
let objects = merge(getFiles('objects'), true);
let views = fs.readdirSync('views');
let core = getFiles('core');
let coreScripts = core.filter(file => file.split('.')[file.split('.').length - 1] === 'js');
let coreStyles = core.filter(file => file.split('.')[file.split('.').length - 1] === 'css');
let vendorSafe = isVendorSafe(getFiles('vendor'));

let buildFolder = 'bin';

if (!fs.existsSync(buildFolder)) {
    fs.mkdirSync(`./${buildFolder}`);
    fs.mkdirSync(`./${buildFolder}/js`);
    fs.mkdirSync(`./${buildFolder}/css`);
}

console.log('Transpiling... ');
for (let view of views) {
    if (view.split('.')[1] !== 'html') continue;
    view = view.split('.')[0];
    let js = merge(coreScripts),
        css = merge(coreStyles),
        styles = mapper[view].styles.map(path => `./styles/${path}`),
        scripts = mapper[view].scripts.map(path => `./scripts/${path}`);

    let document = parseObjects(fs.readFileSync(`./views/${view}.html`, 'utf8'));
    let viewContent = `<html>
                            <head>
                                ${document.head.innerHTML}
                                <link rel="stylesheet" href="css/${view}.css">
                            </head>
                            <body>
                                ${document.body.innerHTML}
                                <script src="js/${view}.js" ${vendorSafe ? 'async' : 'defer'}></script>
                            </body>
                        </html>`

    viewContent = pretty(viewContent);

    fs.writeFileSync(`./${buildFolder}/${view}.html`, viewContent);

    js = '"use strict"; \r' + js;
    js += merge(scripts);
    css += merge(styles);

    js = babel.transform(js, { presets: ['es2015'], plugins: ['transform-for-of-as-array'], comments: false }).code;

    try {
        fs.writeFileSync(`./${buildFolder}/js/${view}.js`, js);
        fs.writeFileSync(`./${buildFolder}/css/${view}.css`, css);
    } catch (error) {
        console.log('Error: Transpilation failed! Please check mapper.json or js/css folders inside "bin"');
        return;
    }
    console.log(`> ${view}`);

    function parseObjects(html) {
        let document = new JSDOM(html).window.document;
        while (document.querySelectorAll('object').length !== 0) {
            for (let object of document.querySelectorAll('object')) {
                let objectName = object.dataset.object;
                object.insertAdjacentHTML('beforebegin', objects[objectName]);
                object.remove();
            }
        }
        return document;
    }
}

try {
    copyDir('images', `${buildFolder}/images`);
    copyDir('fonts', `${buildFolder}/fonts`);
    copyDir('vendor', `${buildFolder}/vendor`);
} catch (error) {
    console.log('Error: Copying failed! Please check resource (images, fonts, vendor)');
}

function isVendorSafe(vendor) {
    for (let item of vendor) {
        if (item.includes('.js')) {
            return false;
        }
    }
    return true;
}

function merge(dirArray, isObject = false) {
    let code = '', objects = {};
    for (let i = 0; i < dirArray.length; i++) {
        if (isObject) {
            let object = dirArray[i].split('/')[dirArray[i].split('/').length - 1].split('.')[0];
            objects[object] = fs.readFileSync(`${dirArray[i]}`, 'utf8').replace(/(\r\n|\n|\r)/gm, '');
        } else {
            code += fs.readFileSync(`${dirArray[i]}`, 'utf8') + '\r';
        }
    }
    if (isObject) code = objects;
    return code;
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

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
    }
    var files = fs.readdirSync(src);
    for (var i = 0; i < files.length; i++) {
        var current = fs.lstatSync(path.join(src, files[i]));
        if (current.isDirectory()) {
            copyDir(path.join(src, files[i]), path.join(dest, files[i]));
        } else if (current.isSymbolicLink()) {
            var symlink = fs.readlinkSync(path.join(src, files[i]));
            fs.symlinkSync(symlink, path.join(dest, files[i]));
        } else {
            copy(path.join(src, files[i]), path.join(dest, files[i]));
        }
    }
    function copy(src, dest) {
        var oldFile = fs.createReadStream(src);
        var newFile = fs.createWriteStream(dest);
        oldFile.pipe(newFile);
    };
}

function removeFolder(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) {
                removeFolder(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};