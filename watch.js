console.log('Loading...');

const fs = require('fs');
const { JSDOM } = require("jsdom");
var watch = require('node-watch');

let mapper = {};

try {
    mapper = JSON.parse(fs.readFileSync('mapper.json', 'utf8'));
} catch (error) {
    console.log('ERROR: Parsing mapper failed!');
}
let objectsArray = getFiles('objects');
let viewsArray = getFiles('views');
let coreScriptsArray = getFiles('core').filter(file => file.split('.')[file.split('.').length - 1] === 'js');
let coreStylesArray = getFiles('core').filter(file => file.split('.')[file.split('.').length - 1] === 'css');
let scriptsArray = getFiles('scripts');
let stylesArray = getFiles('styles');
let vendorSafe = isVendorSafe(getFiles('vendor'));

let buildFolder = 'bin';

let objects = {},
    views = {},
    coreScripts = {},
    coreStyles = {},
    scripts = {},
    styles = {};

let objIds = objectsArray.map(file => file.split('/')[file.split('/').length - 1].split('.')[0]);
objectsArray.map((file, index) => objects[objIds[index]] = fs.readFileSync(file, 'utf8'));
viewsArray.map(file => views[file] = fs.readFileSync(file, 'utf8'));
coreScriptsArray.map(file => coreScripts[file] = fs.readFileSync(file, 'utf8'));
coreStylesArray.map(file => coreStyles[file] = fs.readFileSync(file, 'utf8'));
scriptsArray.map(file => scripts[file] = fs.readFileSync(file, 'utf8'));
stylesArray.map(file => styles[file] = fs.readFileSync(file, 'utf8'));


if (!fs.existsSync(buildFolder)) {
    fs.mkdirSync(`./${buildFolder}`);
    fs.mkdirSync(`./${buildFolder}/js`);
    fs.mkdirSync(`./${buildFolder}/css`);
}

process.stdout.write('\u001B[2J\u001B[0;0f');
console.log('Watcher running: ');

watch('objects', { recursive: true }, function (evt, filename) {
    let file = filename.split('\\')[filename.split('\\').length - 1].split('.')[0];
    console.log(`> ${file}`);
    evt === 'update' ? objects[file] = fs.readFileSync(filename.replace('\\', '/'), 'utf8') : delete objects[file];
    transpile();
});

watch('views', { recursive: true }, function (evt, filename) {
    let file = filename.replace('\\', '/');
    console.log(`> ${file}`);
    evt === 'update' ? views[file] = fs.readFileSync(file, 'utf8') : delete views[file];
    transpile();
});

watch('core', { recursive: true }, function (evt, filename) {
    let file = filename.replace('\\', '/');
    console.log(`> ${file}`);
    let ext = file.split('.')[file.split('.').length - 1];
    if (ext === 'js') {
        evt === 'update' ? coreScripts[file] = fs.readFileSync(file, 'utf8') : delete coreScripts[file];
    } else if (ext === 'css') {
        evt === 'update' ? coreStyles[file] = fs.readFileSync(file, 'utf8') : delete coreStyles[file];
    }
    transpile();
});

watch('scripts', { recursive: true }, function (evt, filename) {
    let file = filename.replace('\\', '/');
    console.log(`> ${file}`);
    evt === 'update' ? scripts[file] = fs.readFileSync(file, 'utf8') : delete scripts[file];
    transpile();
});

watch('styles', { recursive: true }, function (evt, filename) {
    let file = filename.replace('\\', '/');
    console.log(`> ${file}`);
    evt === 'update' ? styles[file] = fs.readFileSync(file, 'utf8') : delete styles[file];
    transpile();
});

watch('mapper.json', function (evt, filename) {
    try {
        mapper = JSON.parse(fs.readFileSync('mapper.json', 'utf8'));
        console.log(`> ${filename}`);
        transpile();
    } catch (error) { }

});

function transpile() {
    for (let view in views) {
        if (view.split('.')[1] !== 'html') continue;
        let viewShort = view.split('/')[1].split('.')[0];

        if (!mapper[viewShort]) return;

        let js = '"use strict"; \r' + merge(coreScripts) + merge(scripts, mapper[viewShort].scripts.map(path => `scripts/${path}`)),
            css = merge(coreStyles) + merge(styles, mapper[viewShort].styles.map(path => `styles/${path}`));

        let document = parseObjects(views[view]);

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

        let viewContent =
            `<html>
                <head>
                    ${document.head.innerHTML}
                    <link rel="stylesheet" href="css/${viewShort}.css">
                </head>
                <body>
                    ${document.body.innerHTML}
                    <script src="js/${viewShort}.js" ${vendorSafe ? 'async' : 'defer'}></script>
                </body>
            </html>`;

        fs.writeFileSync(`./${buildFolder}/${viewShort}.html`, viewContent);
        fs.writeFileSync(`./${buildFolder}/js/${viewShort}.js`, js);
        fs.writeFileSync(`./${buildFolder}/css/${viewShort}.css`, css);
    }
}

function isVendorSafe(vendor) {
    for (let item of vendor) {
        if (item.includes('.js')) {
            return false;
        }
    }
    return true;
}

function merge(object, files = false) {
    let code = '';
    if (files) {
        for (let file in object) {
            if (files.includes(file)) {
                code += object[file] + '\r'
            }
        }
    } else {
        for (let file in object) {
            code += object[file] + '\r'
        }
    }
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