var language = function () {
    var languages = {
        'ENG': ENG,
        'SRB': SRB,
        'MNE': MNE,
        'FRA': FRA,
        'SPA': SPA,
        'POR': POR,
        'GER': GER,
        'NLD': NLD
    };

    var lang, controls, fragments;

    function select(code) {
        if (language.code === undefined) {
            code = 'ENG';
        }
        lang = languages[code];
        controls = lang.controls;
        fragments = lang.fragments;
        selectedLanguage = code;
        parse(code);
    }

    function parse(code) {
        for (let i = 0; i < controls.length; i++)
            try {
                $(controls[i][0]).html(controls[i][1]);
            } catch (ex) { }
        trigger('language/changed', code);
    }

    let selectedLanguage = loginData.getItem('language').toUpperCase();
    if (languages[selectedLanguage] === undefined) selectedLanguage = 'ENG';

    window.addEventListener('load', function () {
        select(selectedLanguage);
    });

    return {
        getFragment: (val) => { return fragments[val]; },
        addControlTranslation: (lang, pair) => { languages[lang].controls.push(pair); },
        addFragmentTranslation: (lang, key, value) => { languages[lang].fragments[key] = value; },
        get code() { return selectedLanguage; }
    };
}();