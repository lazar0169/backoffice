"use strict";

var events = {};

function on(event, callback) {
    var count = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Number.MAX_SAFE_INTEGER;

    if (!events[event]) {
        events[event] = {};
    }
    var id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    events[event][id] = {
        callback: callback,
        count: count
    };
    return id;
}

function off(id) {
    for (var event in events) {
        if (events[event][id]) {
            delete events[event][id];
            return true;
        }
    }
    return false;
}

function trigger(event) {
    for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        data[_key - 1] = arguments[_key];
    }

    var params = data.length === 1 ? data[0] : data;
    if (!events[event]) {
        return;
    }
    for (var id in events[event]) {
        if (events[event][id].count > 0) {
            events[event][id].callback(params);
            if (events[event][id].count > 1) {
                events[event][id].count--;
            }
        } else {
            delete events[event][id];
        }
    }
    if (Object.keys(events[event]).length === 0) {
        delete events[event];
    }
}'use strict';

if (navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) {
    document.addEventListener('touchend', function (e) {
        e.preventDefault();
        e.target.click();
    }, { passive: false });

    if (navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)) {
        var prevTouchY = 0;
        document.addEventListener('touchmove', function (event) {
            if (event.touches.length > 1) {
                event.preventDefault();
            } else {
                var scrollingUp = event.pageY > prevTouchY;
                try {
                    if (typeof helpVisible !== 'undefined' && helpVisible) {
                        if (!scrollingUp && helpScreenBottomReached) {
                            event.preventDefault();
                        } else {
                            return;
                        }
                        prevTouchY = parseFloat(event.pageY.toString().slice());
                    } else if (event.target.type === 'range' || swipeUp.isShown) {
                        return;
                    } else {
                        event.preventDefault();
                    }
                } catch (error) {
                    if (event.target.type === 'range') {
                        return;
                    } else {
                        event.preventDefault();
                    }
                }
            }
        }, { passive: false });
    }

    try {
        if (navigator.platform && /iPhone|iPod/.test(navigator.platform)) {
            $$('#mainSection').style.position = 'absolute';
            $$('#mainSection').style.top = 'auto';
            $$('#mainSection').style.bottom = 'auto';
        }
    } catch (ex) {
        console.log(ex);
    }
}'use strict';

var loginData = function () {
    var data = getQueryParams(window.location.search);
    data.language = 'BUL';
    function getQueryParams(qs) {
        qs = qs.split('+').join(' ');

        var params = {},
            tokens,
            re = /[?&]?([^=]+)=([^&]*)/g;

        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }

        return params;
    }
    return {
        getItem: function getItem(key) {
            if (data[key] === undefined) return '';else return data[key];
        }
    };
}();'use strict';

var ENG = {
        controls: [['#find-lang', 'Find'], ['#prev', 'Prev'], ['#next', 'Next'], ['#date-lang', 'DATE'], ['#time-lang', 'TIME'], ['#game-lang', 'GAME'], ['#game-history-lang', 'Game history'], ['#free-spins-lang', 'FREE SPINS'], ['#bonus-symbol-label', 'BONUS SYMBOL'], ['#history-lang', 'HISTORY:'], ['#winning-number-lang', 'WINNING NUMBER: '], ['#message', 'LOADING...'], ['#multiplier-title', 'MULTIPLIER'], ['#glyph7', 'REPEAT'], ['#glyph8', 'GAME OVER'], ['#f44', 'EVEN'], ['#f47', 'ODD']],
        fragments: {
                'no-history-message': 'No history found for selected date.',
                'error-message': 'Something went wrong, history for this date couldn\'t be retrieved.',
                'winning-numbers': 'WINNING NUMBERS: ',
                'jackpot-win': 'JACKPOT',
                'cash': 'CASH',
                'win': 'WIN',
                'total-bet': 'TOTAL BET',
                'lines': 'LINES',
                'bet': 'BET',
                'free-spins': 'FREE SPINS',
                'attempts': 'ATTEMPTS',
                'gamble-amount': 'GAMBLE AMOUNT',
                'triple-poker-bet': 'TRIPLE POKER BET',
                'spin-aborted': 'SPIN ABORTED',
                'lives': 'LIVES',

                'monthNames': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                'monthNamesShort': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                'dayNames': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                'dayNamesShort': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                'dayNamesMin': ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                'firstDay': 1,
                'dateFormat': 'dd M yy'
        }
};'use strict';

var FRA = {
        controls: [['#find-lang', 'Trouver'], ['#prev', 'Précédent'], ['#next', 'Prochain'], ['#date-lang', 'DATE'], ['#time-lang', 'TEMPS'], ['#game-lang', 'JEU'], ['#game-history-lang', 'Historique du jeu'], ['#free-spins-lang', 'TOURS GRATUITS'], ['#bonus-symbol-label', 'SYMBOL DE BONUS'], ['#history-lang', 'HISTOIRE:'], ['#winning-number-lang', 'NUMÉROS GAGNANTS: '], ['#message', 'ATTENDRE...'], ['#multiplier-title', 'MULTIPLICATEUR'], ['#glyph7', 'RÉPÉTER'], ['#glyph8', 'JEU TERMINÉ'], ['#f44', 'LE PAIR'], ['#f47', 'L\'IMPAIR']],
        fragments: {
                'no-history-message': 'Hisoire de cette date n\'est pas trouvée.',
                'error-message': 'Quelque chose ne va pas, histoire de cette date ne peut pas etre retrouvée.',
                'winning-numbers': 'NUMÉROS GAGNANTS: ',
                'jackpot-win': 'JACKPOT',
                'cash': 'EN ESPÈCES',
                'win': 'GAIN',
                'total-bet': 'LE PARI TOTAL',
                'lines': 'LIGNES',
                'bet': 'PARI',
                'free-spins': 'TOURS GRATUITS',
                'attempts': 'LES ESSAIS',
                'gamble-amount': 'LE MONTANT DE PARI',
                'triple-poker-bet': 'TRIPLE POKER PARI',
                'spin-aborted': 'SPIN ANNULÉ',
                'lives': 'VIES',

                'monthNames': ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
                'monthNamesShort': ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
                'dayNames': ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
                'dayNamesShort': ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
                'dayNamesMin': ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
                'firstDay': 1,
                'dateFormat': 'dd M yy'
        }
};'use strict';

var GER = {
        controls: [['#find-lang', 'Gehe zu'], ['#prev', 'Vorherig'], ['#next', 'Nächster'], ['#date-lang', 'DATUM'], ['#time-lang', 'ZEIT'], ['#game-lang', 'SPIEL'], ['#game-history-lang', 'Spielhistorie'], ['#free-spins-lang', 'BONUSSPIELE'], ['#bonus-symbol-label', 'BONUSSYMBOLE'], ['#history-lang', 'HISTORIE:'], ['#winning-number-lang', 'GEZOGENE NUMMER: '], ['#message', 'WIRD GELADEN...'], ['#multiplier-title', 'MULTIPLIKATOR'], ['#glyph7', 'REPETIEREN'], ['#glyph8', 'SPIEL IST AUS'], ['#f44', 'GERADE'], ['#f47', 'UNGERADE']],
        fragments: {
                'no-history-message': 'Historie für das ausgewählte Datum wurde nicht gefunden.',
                'error-message': 'Etwas ist schiefgelaufen, die Historie für dieses Datum konnte nicht gefunden werden.',
                'winning-numbers': 'GEWINNZAHLEN: ',
                'jackpot-win': 'JACKPOT',
                'cash': 'GELD',
                'win': 'GEWINN',
                'total-bet': 'GANZER EINSATZ',
                'lines': 'LINIEN',
                'bet': 'EINSATZ',
                'free-spins': 'BONUSSPIELE',
                'attempts': 'VERSUCHE',
                'gamble-amount': 'EINSATZ',
                'triple-poker-bet': 'TRIPLE POKER BONUS',
                'spin-aborted': 'SPIN ABGEBROCHEN',
                'lives': 'LEBEN',

                'monthNames': ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
                'monthNamesShort': ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Juni', 'Juli', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
                'dayNames': ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
                'dayNamesShort': ['Son', 'Mon', 'Die', 'Mit', 'Don', 'Fre', 'Sam'],
                'dayNamesMin': ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
                'firstDay': 1,
                'dateFormat': 'dd M yy'
        }
};'use strict';

var MNE = {
        controls: [['#find-lang', 'Pronađi'], ['#prev', 'Prethodni'], ['#next', 'Sledeći'], ['#date-lang', 'DATUM'], ['#time-lang', 'VREME'], ['#game-lang', 'IGRA'], ['#game-history-lang', 'Istorija igre'], ['#free-spins-lang', 'BONUS IGRE'], ['#bonus-symbol-label', 'BONUS SIMBOL'], ['#history-lang', 'ISTORIJAT:'], ['#winning-number-lang', 'IZVUČEN BROJ: '], ['#message', 'UČITAVA SE...'], ['#multiplier-title', 'MULTIPLIKATOR'], ['#glyph7', 'PONOVI'], ['#glyph8', 'KRAJ IGRE'], ['#f44', 'PAR'], ['#f47', 'NEPAR']],
        fragments: {
                'no-history-message': 'Istorija za zadati dan nije pronađena.',
                'error-message': 'Nešto je pošlo po zlu, istorija za ovaj datum nije mogla biti pribavljena.',
                'winning-numbers': 'DOBITNI BROJEVI: ',
                'jackpot-win': 'JACKPOT',
                'cash': 'NOVAC',
                'win': 'DOBITAK',
                'total-bet': 'CEO ULOG',
                'lines': 'LINIJE',
                'bet': 'ULOG',
                'free-spins': 'BONUS IGRE',
                'attempts': 'POKUŠAJI',
                'gamble-amount': 'ULOG',
                'triple-poker-bet': 'TRIPLE POKER BONUS',
                'spin-aborted': 'SPIN OBUSTAVLJEN',
                'lives': 'ŽIVOT',

                'monthNames': ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'],
                'monthNamesShort': ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'],
                'dayNames': ['Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota'],
                'dayNamesShort': ['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub'],
                'dayNamesMin': ['Ne', 'Po', 'Ut', 'Sr', 'Če', 'Pe', 'Su'],
                'firstDay': 1,
                'dateFormat': 'dd M yy'
        }
};'use strict';

var NLD = {
    controls: [['#find-lang', 'Vind het'], ['#prev', 'Vorig'], ['#next', 'Volgende'], ['#date-lang', 'DATUM'], ['#time-lang', 'TIJD'], ['#game-lang', 'SPEL'], ['#game-history-lang', 'Geschiedenis van het spel'], ['#free-spins-lang', 'BONUSSPELLEN'], ['#bonus-symbol-label', 'BONUS SYMBOOL'], ['#history-lang', 'GESCHIEDENIS:'], ['#winning-number-lang', 'GETROKKEN NUMMER: '], ['#message', 'BEZIG MET LADEN...'], ['#multiplier-title', 'VERMENIGVULDIGER'], ['#f44', 'PAAR'], ['#f47', 'ONPAAR']],
    fragments: {
        'no-history-message': 'De geschiedenis voor de betreffende dag is niet gevonden.',
        'error-message': 'Er ging iets mis, de geschiedenis voor deze datum kon niet worden verkregen.',
        'winning-numbers': 'WINSTNUMMERS: ',
        'jackpot-win': 'JACKPOT WINST',
        'cash': 'GELD',
        'win': 'WINST',
        'total-bet': 'VOLLEDIGE INZET',
        'lines': 'LIJNEN',
        'bet': 'INZET',
        'free-spins': 'BONUSSPELLEN',
        'attempts': 'POGINGEN',
        'gamble-amount': 'INZET',
        'triple-poker-bet': 'TRIPLE POKER BONUS',
        'spin-aborted': 'SPIN OPGESCHORT',
        'lives': 'LEVEN',

        'monthNames': ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Jun', 'Jul', 'Augustus', 'September', 'Oktober', 'November', 'December'],
        'monthNamesShort': ['Jani', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
        'dayNames': ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'],
        'dayNamesShort': ['Zon', 'Ma', 'Di', 'Woe', 'Do', 'Vrij', 'Za'],
        'dayNamesMin': ['Nee', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'],
        'firstDay': 1,
        'dateFormat': 'dd M yy'
    }
};'use strict';

var POR = {
        controls: [['#find-lang', 'Encontrar'], ['#prev', 'Anterior'], ['#next', 'Próximo'], ['#date-lang', 'DATA'], ['#time-lang', 'MOMENTO'], ['#game-lang', 'JOGO'], ['#game-history-lang', 'Histórico de jogos'], ['#free-spins-lang', 'PARTIDAS GRÁTIS'], ['#bonus-symbol-label', 'SÍMBOLO BÔNUS'], ['#history-lang', 'HISTORIAL:'], ['#winning-number-lang', 'NÚMERO GANHADOR: '], ['#message', 'CARREGANDO...'], ['#multiplier-title', 'MULTIPLICADOR'], ['#glyph7', 'REPETIR'], ['#glyph8', 'FIM DE JOGO'], ['#f44', 'PAR'], ['#f47', 'ÍMPAR']],
        fragments: {
                'no-history-message': 'Não há historial encontrado para a data selecionada.',
                'error-message': 'Aconteceu um problema, não foi possível recuperar o historial para esta data.',
                'winning-numbers': 'NÚMEROS GANHANTES: ',
                'jackpot-win': 'JACKPOT',
                'cash': 'DINHEIRO',
                'win': 'PRÊMIO',
                'total-bet': 'APOSTA TOTAL',
                'lines': 'LINHAS',
                'bet': 'APOSTAR',
                'free-spins': 'PARTIDAS GRÁTIS',
                'attempts': 'TENTATIVAS',
                'gamble-amount': 'QUANTIDADE APOSTADA',
                'triple-poker-bet': 'TRIPLE POKER APOSTAR',
                'spin-aborted': 'SPIN CANCELADO',
                'lives': 'VIDAS',

                'monthNames': ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
                'monthNamesShort': ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                'dayNames': ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
                'dayNamesShort': ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
                'dayNamesMin': ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sá'],
                'firstDay': 1,
                'dateFormat': 'dd M yy'
        }
};'use strict';

var SPA = {
        controls: [['#find-lang', 'Encontrar'], ['#prev', 'Anterior'], ['#next', 'Siguiente'], ['#date-lang', 'FECHA'], ['#time-lang', 'MOMENTO'], ['#game-lang', 'JUEGO'], ['#game-history-lang', 'Historia del juego'], ['#free-spins-lang', 'PARTIDAS GRATIS'], ['#bonus-symbol-label', 'SÍMBOLO BONUS'], ['#history-lang', 'HISTORIAL:'], ['#winning-number-lang', 'NÚMERO GANADOR: '], ['#message', 'CARGANDO...'], ['#multiplier-title', 'MULTIPLICADOR'], ['#glyph7', 'REPETIR'], ['#glyph8', 'JUEGO TERMINADO'], ['#f44', 'PAR'], ['#f47', 'IMPAR']],
        fragments: {
                'no-history-message': 'No hay historial encontrado para la fecha seleccionada.',
                'error-message': 'Ha ocurrido un problema, no ha sido posible recuperar el historial para esta fecha.',
                'winning-numbers': 'NUMEROS GANADORES: ',
                'jackpot-win': 'JACKPOT',
                'cash': 'EFECTIVO',
                'win': 'PREMIO',
                'total-bet': 'APUESTA TOTAL',
                'lines': 'LÍNEAS',
                'bet': 'APOSTAR',
                'free-spins': 'PARTIDAS GRATIS',
                'attempts': 'INTENTOS',
                'gamble-amount': 'CANTIDAD APOSTADA',
                'triple-poker-bet': 'TRIPLE POKER APUESTA',
                'spin-aborted': 'SPIN CANCELADO',
                'lives': 'VIVE',

                'monthNames': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                'monthNamesShort': ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                'dayNames': ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
                'dayNamesShort': ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
                'dayNamesMin': ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
                'firstDay': 1,
                'dateFormat': 'dd M yy'
        }
};'use strict';

var SRB = {
        controls: [['#find-lang', 'Pronađi'], ['#prev', 'Prethodni'], ['#next', 'Sledeći'], ['#date-lang', 'DATUM'], ['#time-lang', 'VREME'], ['#game-lang', 'IGRA'], ['#game-history-lang', 'Istorija igre'], ['#free-spins-lang', 'BONUS IGRE'], ['#bonus-symbol-label', 'BONUS SIMBOL'], ['#history-lang', 'ISTORIJAT:'], ['#winning-number-lang', 'IZVUČEN BROJ: '], ['#message', 'UČITAVA SE...'], ['#multiplier-title', 'MULTIPLIKATOR'], ['#glyph7', 'PONOVI'], ['#glyph8', 'KRAJ IGRE'], ['#f44', 'PAR'], ['#f47', 'NEPAR']],
        fragments: {
                'no-history-message': 'Istorija za zadati dan nije pronađena.',
                'error-message': 'Nešto je pošlo po zlu, istorija za ovaj datum nije mogla biti pribavljena.',
                'winning-numbers': 'DOBITNI BROJEVI: ',
                'jackpot-win': 'JACKPOT',
                'cash': 'NOVAC',
                'win': 'DOBITAK',
                'total-bet': 'CEO ULOG',
                'lines': 'LINIJE',
                'bet': 'ULOG',
                'free-spins': 'BONUS IGRE',
                'attempts': 'POKUŠAJI',
                'gamble-amount': 'ULOG',
                'triple-poker-bet': 'TRIPLE POKER BONUS',
                'spin-aborted': 'SPIN OBUSTAVLJEN',
                'lives': 'ŽIVOT',

                'monthNames': ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'],
                'monthNamesShort': ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'],
                'dayNames': ['Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota'],
                'dayNamesShort': ['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub'],
                'dayNamesMin': ['Ne', 'Po', 'Ut', 'Sr', 'Če', 'Pe', 'Su'],
                'firstDay': 1,
                'dateFormat': 'dd M yy'
        }
};'use strict';

var crystalsOfMagic = function () {
    var activeBonus = [false, false, false, false];
    var glyphMultipliers = [15, 20, 25, 30, 60];

    function constructGnomeBonus(data, bet) {
        select('gnome');
        var livesCount = data.lifesLeft;
        var lives = '<img src="images/bonus/CrystalsOfMagic/gnome/lifebar.png" id="com-lifebar">';
        for (var i = 0; i < livesCount; i++) {
            lives += '<img src="images/bonus/CrystalsOfMagic/gnome/life.png" id="com-life' + (i + 1) + '">';
        }
        $$('#com-life').innerHTML = lives;
        var fields = [data.firstField, data.selectField, data.secondField];
        for (var _i = 0; _i < 3; _i++) {
            var option = $$('#option' + (_i + 1));
            if (fields[_i] === 0) {
                option.innerHTML = '';
                option.style.backgroundImage = 'url("images/bonus/CrystalsOfMagic/gnome/skull.png")';
            } else {
                option.innerHTML = data.isMultiplier ? fields[_i] : (fields[_i] * data.multiply * bet).toFixed(2);
                option.style.backgroundImage = '';
            }
        }
        $$('#com-multiplier').innerHTML = 'x' + data.multiply;
        var percent = data.stepID / 38 * 100;
        $$('#com-progress-bar').style.width = percent + '%';
        $$('#com-progress-thumb').style.marginLeft = percent + '%';
    }

    function constructNecromancerBonus(data, bet) {
        select('necro');
        var reset = true;
        $$('#necro-lives').innerHTML = language.getFragment('lives') + ': ' + data.lifes;

        for (var i = 0; i < 5; i++) {
            var val = trimValue(glyphMultipliers[i] * bet);
            $$('#glyph' + (i + 1)).innerHTML = val.value + val.suffix;
        }

        for (var _i2 = 0; _i2 < data.openField.length; _i2++) {
            $$('#bottle' + (_i2 + 1)).style.opacity = data.openField[_i2] !== 0 ? 0.3 : 1;
            $$('#bottle' + (_i2 + 1)).style.pointerEvents = data.openField[_i2] !== 0 ? 'none' : 'all';
            if (data.openField[_i2] !== 0) {
                $$('#glyphWrapper' + data.openField[_i2]).style.opacity = 0.3;
                reset = false;
            }
            if (reset) {
                for (var _i4 = 0, _$$2 = $$('.glyphs'), _length2 = _$$2.length; _i4 < _length2; _i4++) {
                    var glyph = _$$2[_i4];
                    glyph.style.opacity = 1;
                }
            }
        }
    }

    function resize(width, height) {
        if (activeBonus[1]) {
            document.querySelectorAll('.option-field').forEach(function (element) {
                element.style.fontSize = width * 0.018 + 'px';
            });
            $$('#com-multiplier').style.fontSize = width * 0.055 + 'px';
            $$('#black-overlay').style.filter = 'blur(' + width * 0.09 + 'px);';
        }
    }

    function select(game) {
        switch (game) {
            case 'necro':
                activeBonus = [true, false, false, false];
                $$('#gnome').classList.add('hidden');
                $$('#necromancer').classList.remove('hidden');
                $$('#enchantress').classList.add('hidden');
                $$('#wizard').classList.add('hidden');
                break;
            case 'gnome':
                activeBonus = [false, true, false, false];
                $$('#gnome').classList.remove('hidden');
                $$('#necromancer').classList.add('hidden');
                $$('#enchantress').classList.add('hidden');
                $$('#wizard').classList.add('hidden');
                break;
            case 'ench':
                activeBonus = [false, false, true, false];
                $$('#gnome').classList.add('hidden');
                $$('#necromancer').classList.add('hidden');
                $$('#enchantress').classList.remove('hidden');
                $$('#wizard').classList.add('hidden');
                break;
            case 'wizard':
                activeBonus = [false, false, false, true];
                $$('#gnome').classList.add('hidden');
                $$('#necromancer').classList.add('hidden');
                $$('#enchantress').classList.add('hidden');
                $$('#wizard').classList.remove('hidden');
                break;
            default:
                activeBonus = [false, false, false, false];
                $$('#gnome').classList.add('hidden');
                $$('#necromancer').classList.add('hidden');
                $$('#enchantress').classList.add('hidden');
                $$('#wizard').classList.add('hidden');
                break;

        }
    }

    return {
        constructGnomeBonus: constructGnomeBonus,
        constructNecromancerBonus: constructNecromancerBonus,
        resize: resize,
        select: select
    };
}();'use strict';

var token = void 0;
var playerId = void 0;
var params = getQueryParams(window.location.search);
var selectedGameId = params['gameId'];
var loadedData = {};
var selectedGame = -1;
var selectedDate = void 0;
var selectedGameType = false;
var newGame = false;
var isAmericanRoulette = false;

var gamesList = {
    0: 'Postman',
    1: 'Deep Jungle',
    2: 'Wizard',
    3: 'Fruits and Stars',
    13: 'Wild West',
    15: 'Pyramid',
    16: 'Roulette',
    17: 'Poker',
    19: 'Diamonds',
    20: 'Juicy Hot',
    21: 'Hot Stars',
    22: 'Triple Crown Roulette',
    23: 'Book of Spells',
    24: 'Mega Hot',
    25: 'Live European Roulette',
    26: 'Live American Roulette',
    27: 'Burning Ice',
    28: 'Turbo Hot 40',
    29: 'Crystals Of Magic',
    30: 'Pirates',
    31: 'Book of Bruno',
    32: 'Tropical Hot',
    33: 'Monsters',
    34: 'Forest Fruits',
    35: 'Viking Gold',
    36: 'Star Gems',
    37: 'Book of Spells',
    38: 'Templar\'s Quest',
    39: 'Space Guardians',
    40: '5 Neon Hot',
    41: 'Starlight',
    42: 'Triple Hot',
    43: 'Crystal Hot 40',
    44: 'Burning Ice Deluxe',
    45: '5 Neon Dice',
    46: 'Turbo Dice 40',
    47: 'Triple Dice',
    48: 'Flashing Dice',
    51: 'Katanas of Time',
    52: 'Retro 7 Hot',
    53: 'VIP Roulette',
    54: 'Star Runner',
    55: 'Aloha Charm'
};

$$('#games').value = gamesList[selectedGameId];

function connect(data) {
    gameType(0);
    loadedData = {};
    var today = new Date();
    var selectedDate = new Date(params['selectedDate']);
    var diffTime = Math.abs(today.getTime() - selectedDate.getTime());
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;
    $('#datepicker').datepicker('setDate', -diffDays);
    if (data.ErrorOccured) {
        $$('#message').innerHTML = data.ExceptionMessage;
        $$('#indexPage').innerHTML = '0';
        $$('#totalPages').innerHTML = '0';
        $$('#timeSlider').max = 1;
        $$('#timeSlider').value = 1;
        selectedGame = -1;
    } else if (data.Result.length === 0) {
        $$('#indexPage').innerHTML = '0';
        $$('#totalPages').innerHTML = '0';
        $$('#timeSlider').max = 1;
        $$('#timeSlider').value = 1;
        $$('#game-screen').style.backgroundImage = '';
        $$('#message').innerHTML = language.getFragment('no-history-message');
    } else {
        loadedData = data;
        if (varInArray(loadedData.Result[0].GameID, [35, 38])) {
            loadedData.Result = cascadeParse(loadedData.Result);
        }
        newGame = !(loadedData.Result[0].JsonData === null || loadedData.Result[0].JsonData === 'null' || loadedData.Result[0].JsonData === undefined);
        selectedGame = 0;
        selectivePreloader(loadedData.Result[0].GameID);
    }
}

on('loaded', function () {
    $$('#message').innerHTML = '';
    $$('#indexPage').innerHTML = loadedData.Result.length - selectedGame;
    $$('#totalPages').innerHTML = loadedData.Result.length;
    readFromJSON(loadedData.Result[0]);
    $$('#timeSlider').max = loadedData.Result.length;
    $$('#timeSlider').value = loadedData.Result.length;
    resizeGame();
});

window.addEventListener('message', function (event) {
    connect(event.data);
}, false);'use strict';

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
        for (var i = 0; i < controls.length; i++) {
            try {
                $(controls[i][0]).html(controls[i][1]);
            } catch (ex) {}
        }trigger('language/changed', code);
    }

    var selectedLanguage = loginData.getItem('language').toUpperCase();
    if (languages[selectedLanguage] === undefined) selectedLanguage = 'ENG';

    window.addEventListener('load', function () {
        select(selectedLanguage);
    });

    return {
        getFragment: function getFragment(val) {
            return fragments[val];
        },
        addControlTranslation: function addControlTranslation(lang, pair) {
            languages[lang].controls.push(pair);
        },
        addFragmentTranslation: function addFragmentTranslation(lang, key, value) {
            languages[lang].fragments[key] = value;
        },
        get code() {
            return selectedLanguage;
        }
    };
}();'use strict';

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ':' + seconds;
    return strTime;
}

function $$(selector) {
    switch (selector[0]) {
        case '.':
            return document.getElementsByClassName(selector.substring(1));
        case '#':
            return document.getElementById(selector.substring(1));
        default:
            return document.getElementsByTagName(selector);
    }
};

function resetBonus() {
    $$('#gnome').classList.add('hidden');
    $$('#necromancer').classList.add('hidden');
    $$('#enchantress').classList.add('hidden');
    $$('#wizard').classList.add('hidden');
    $$('#battle-bonus').classList.add('hidden');
}

function gameType(n) {
    $$('#multiplier-title').style.visibility = 'hidden';
    $$('#multiplier-canvas').style.visibility = 'hidden';
    switch (n) {
        case 'slot':
            $$('#slots').style.visibility = 'visible';
            $$('#gamble').style.visibility = 'hidden';
            $$('#roulette').style.visibility = 'hidden';
            $$('#poker').style.visibility = 'hidden';
            $$('#free-spins-label').style.visibility = 'hidden';
            $$('#free-spins-text').style.visibility = 'hidden';
            $$('#bonus-symbol-label').style.visibility = 'hidden';
            $$('#bonus-symbol').style.visibility = 'hidden';
            selectedGameType = 'slot';
            break;
        case 'gamble':
            $$('#slots').style.visibility = 'hidden';
            $$('#gamble').style.visibility = 'visible';
            $$('#roulette').style.visibility = 'hidden';
            $$('#poker').style.visibility = 'hidden';
            $$('#free-spins-label').style.visibility = 'hidden';
            $$('#free-spins-text').style.visibility = 'hidden';
            $$('#bonus-symbol-label').style.visibility = 'hidden';
            $$('#bonus-symbol').style.visibility = 'hidden';
            selectedGameType = 'gamble';
            break;
        case 'poker':
            $$('#slots').style.visibility = 'hidden';
            $$('#gamble').style.visibility = 'hidden';
            $$('#roulette').style.visibility = 'hidden';
            $$('#poker').style.visibility = 'visible';
            $$('#free-spins-label').style.visibility = 'hidden';
            $$('#free-spins-text').style.visibility = 'hidden';
            $$('#bonus-symbol-label').style.visibility = 'hidden';
            $$('#bonus-symbol').style.visibility = 'hidden';
            selectedGameType = 'poker';
            break;
        case 'roulette':
            $$('#slots').style.visibility = 'hidden';
            $$('#gamble').style.visibility = 'hidden';
            $$('#roulette').style.visibility = 'visible';
            $$('#poker').style.visibility = 'hidden';
            $$('#free-spins-label').style.visibility = 'hidden';
            $$('#free-spins-text').style.visibility = 'hidden';
            $$('#bonus-symbol-label').style.visibility = 'hidden';
            $$('#bonus-symbol').style.visibility = 'hidden';
            selectedGameType = 'roulette';
            break;
        default:
            $$('#bottom-wrapper').innerHTML = '';
            $$('#slots').style.visibility = 'hidden';
            $$('#gamble').style.visibility = 'hidden';
            $$('#roulette').style.visibility = 'hidden';
            $$('#poker').style.visibility = 'hidden';
            $$('#free-spins-label').style.visibility = 'hidden';
            $$('#free-spins-text').style.visibility = 'hidden';
            $$('#bonus-symbol-label').style.visibility = 'hidden';
            $$('#bonus-symbol').style.visibility = 'hidden';
            selectedGameType = false;
            break;
    }
}

function varInArray(variable, array) {
    for (var i = 0; i < array.length; i++) {
        if (variable === array[i]) {
            return true;
        }
    }
    return false;
}

function getExpandingWildMatrix(matrix) {
    var result = matrix;
    for (var i = 0; i < matrix.length; i++) {
        if (matrix[i] === 12) {
            result[i % 5] = result[i % 5 + 5] = result[i % 5 + 10] = 12;
        }
    }
    return result;
}

function drawSymbols(slot) {
    var symbols = [];
    if (newGame) {
        symbols = JSON.parse(slot.JsonData).symbols;
    } else {
        symbols = slot.Data.slice();
        symbols.length = 15;
    }
    var helpClass = '';
    switch (slot.GameID) {
        case 27:
        case 42:
        case 44:
        case 47:
        case 48:
        case 52:
            helpClass = 'three-reels';
            break;
        case 28:
        case 31:
        case 32:
        case 33:
        case 34:
        case 35:
        case 36:
        case 39:
        case 40:
        case 41:
        case 43:
        case 45:
        case 46:
        case 51:
        case 54:
        case 55:
            helpClass = 'new-game';
            break;
        case 38:
            symbols = getExpandingWildMatrix(symbols);
            helpClass = 'new-game-with-gap';
            break;
        default:
            helpClass = '';
            break;
    }
    if (helpClass !== '') {
        $$('#reels').classList.add(helpClass);
    }
    $$('#reels').innerHTML = '';

    for (var i = 0; i < symbols.length; i++) {
        if (symbols[i] !== 255) {
            $$('#reels').innerHTML += '<div class="symbols ' + helpClass + '" id="symbol' + i + '"></div>';
            var element = '#symbol' + i;
            $$(element).style.backgroundImage = 'url("images/symbols/' + slot.GameID + '/' + symbols[i] + '.png")';
        }
    }
}

function drawCards(gamble) {
    for (var _i2 = 0, _$$2 = $$('.top-cards'), _length2 = _$$2.length; _i2 < _length2; _i2++) {
        var card = _$$2[_i2];
        card.style.backgroundImage = '';
    }

    if (newGame) {
        var cards = JSON.parse(gamble.JsonData).cardsHistory;
        for (var i = 0; i < cards.length; i++) {
            var element = '#gamble-card' + (2 * i + 3);
            $$(element).style.backgroundImage = 'url("images/cards/' + cards[i].Sign + '.png")';
        }
    } else {
        for (var _i3 = 3; _i3 < 10; _i3 += 2) {
            var _element = '#gamble-card' + _i3;
            $$(_element).style.backgroundImage = 'url("images/cards/' + gamble.Data[_i3] + '.png")';
        }
    }
}

function insertData(title, data, overwrite) {
    if (overwrite) {
        $$('#bottom-wrapper').innerHTML = '';
    }
    $$('#bottom-wrapper').innerHTML += '<div class="block"><h3>' + title + '</h3><h1>' + data + '</h1></div>';
}

function drawChips(betMatrix) {
    rouletteAnimator.drawChips(betMatrix);
}

function navigate(direction) {
    if (loadedData.Result !== undefined) {
        switch (direction) {
            case 0:
                if (selectedGame !== 0) {
                    selectedGame--;
                    readFromJSON(loadedData.Result[selectedGame]);
                }
                break;
            case 1:
                if (selectedGame !== loadedData.Result.length - 1) {
                    selectedGame++;
                    readFromJSON(loadedData.Result[selectedGame]);
                }
                break;
            default:
                break;
        }
        $$('#timeSlider').value = loadedData.Result.length - selectedGame;
        $$('#indexPage').innerHTML = loadedData.Result.length - selectedGame;
    }
}

function formatMoney(val) {
    var denom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

    var fixedValue = denom < Math.pow(10, 6) ? 2 : 8;
    return (val / Math.pow(10, fixedValue)).toFixed(fixedValue).replace(/(\d)(?=(\d{3})+\.)/g, '$1');
}

function selectivePreloader(gameId) {
    var total = resources[gameId].length;
    var loadedImages = [];
    var progress = 0;
    for (var i = 0; i < total; i++) {
        var image = new Image();
        image.src = resources[gameId][i];
        loadedImages[i] = image;
        progress = (i / (total - 1) * 100).toFixed(2);
        trigger('loading', {
            progress: progress
        });
    }
    loadedResources = loadedImages;
    trigger('loaded');
}

function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}'use strict';

var multiplierAnimator = function () {
    var COEFFICIENTS = [1, 2, 3, 5];
    var BONUS_COEFFICIENTS = [3, 6, 9, 15];

    var ACTIVE_COLOR = '#ffffff';
    var INACTIVE_COLOR = '#b3b5b8';
    var DEFAULT_FONT = 'Arial';

    if (selectedGameId === '38') {
        DEFAULT_FONT = 'Berlin Bold';
    } else if (selectedGameId === '35') {
        ACTIVE_COLOR = '#ffdc35';
        DEFAULT_FONT = 'Norse Bold';
    }

    var canvasTitle = $$('#multiplier-title');
    var canvas = $$('#multiplier-canvas');
    var mainSection = $$('#mainSection');
    var ctx = canvas.getContext('2d');
    var lastActiveIndex = 0;
    var canvasFont = void 0;

    function drawMultipliers() {
        var activeIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : lastActiveIndex;
        var isBonus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var coefficients = isBonus ? BONUS_COEFFICIENTS : COEFFICIENTS;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = canvasFont + 'px ' + (typeof DEFAULT_FONT !== 'undefined' ? DEFAULT_FONT : 'Roboto');
        if (activeIndex >= coefficients.length) activeIndex = coefficients.length - 1;
        for (var i = 0; i < coefficients.length; i++) {
            i === activeIndex ? ctx.fillStyle = ACTIVE_COLOR : ctx.fillStyle = INACTIVE_COLOR;
            ctx.fillText('x' + coefficients[i], canvas.width / 12 * (i * 3 + 1), 2 * canvas.height / 3, canvas.width / 12);
        }
        lastActiveIndex = activeIndex;
    }

    function initMultiplierAnimator() {
        var width = mainSection.clientWidth;
        var height = mainSection.clientHeight;
        canvas.width = width * 0.171 * window.devicePixelRatio;
        canvas.height = height * 0.053 * window.devicePixelRatio;
        canvasFont = width * 0.014 * window.devicePixelRatio;
        canvasTitle.style.fontSize = width * 0.008 + 'px';
        canvasTitle.style.letterSpacing = width * 0.003 + 'px';
        drawMultipliers();
    }

    window.addEventListener('load', initMultiplierAnimator, false);
    window.addEventListener('resize', initMultiplierAnimator, false);

    return {
        drawMultipliers: drawMultipliers
    };
}();'use strict';

function readFromJSON(dataStructure) {
    switch (dataStructure.GameType) {
        case 1:
        case 2:
        case 6:
            var symbolsVisible = true;
            gameType('slot');
            resetBonus();
            $$('#game-screen').style.backgroundImage = 'url("images/backgrounds/' + dataStructure.GameID + '.png")';
            insertData(language.getFragment('jackpot-win'), formatMoney(dataStructure.JackpotWin, dataStructure.InternalCreditDenomination), true);
            insertData(language.getFragment('cash'), formatMoney(dataStructure.Credit, dataStructure.InternalCreditDenomination));
            insertData(language.getFragment('win'), formatMoney(dataStructure.Win, dataStructure.InternalCreditDenomination));
            insertData(language.getFragment('total-bet'), formatMoney(dataStructure.TotalBet, dataStructure.InternalCreditDenomination));
            insertData(language.getFragment('lines'), dataStructure.NumberOfLinesOrGamblingAttempts);

            if (varInArray(dataStructure.GameID, [35, 38])) {
                if (dataStructure.GameID === 38) {
                    $$('#multiplier-title').style.fontFamily = 'berlin bold';
                    $$('#multiplier-title').style.color = '#2d0004';
                }
                $$('#multiplier-title').style.visibility = 'visible';
                $$('#multiplier-canvas').style.visibility = 'visible';
                multiplierAnimator.drawMultipliers(dataStructure.Multiplier);
            }

            if (dataStructure.GameID === 27 || dataStructure.GameID === 44 || dataStructure.GameID === 48) {
                insertData(language.getFragment('bet'), formatMoney(dataStructure.TotalBet, dataStructure.InternalCreditDenomination));
            } else {
                insertData(language.getFragment('bet'), formatMoney(dataStructure.TotalBet / dataStructure.NumberOfLinesOrGamblingAttempts, dataStructure.InternalCreditDenomination));
            }

            $$('#timepicker').value = dataStructure.Time.substr(11, 8);

            if (dataStructure.GameType === 2) {
                if (varInArray(dataStructure.GameID, [0, 2, 13, 15, 23, 29, 30, 31, 33, 35, 37, 51, 55])) {
                    $$('#free-spins-label').style.visibility = 'visible';
                    $$('#free-spins-text').style.visibility = 'visible';
                    $$('#free-spins-text').innerHTML = dataStructure.NumberOfGratisGame;
                    $$('#bottom-wrapper').children[2].children[1].innerHTML = formatMoney(dataStructure.FreeGamesOrDoubleUpWin, dataStructure.InternalCreditDenomination);

                    if (dataStructure.GameID === 35) {
                        multiplierAnimator.drawMultipliers(dataStructure.Multiplier, true);
                    }

                    if (varInArray(dataStructure.GameID, [23, 31, 37])) {
                        $$('#bonus-symbol').style.backgroundImage = 'url("images/symbols/' + dataStructure.GameID + '/' + dataStructure.Data[15] + '.png")';
                        $$('#bonus-symbol-label').style.visibility = 'visible';
                        $$('#bonus-symbol').style.visibility = 'visible';
                    }

                    if (dataStructure.GameID === 29) {
                        var bonusObject = JSON.parse(dataStructure.JsonData).bonusObject;
                        if (bonusObject.bonusType === 3) {
                            var crystalValues = ['x2', 'x10', '+50 x ' + language.getFragment('bet'), '+500 x ' + language.getFragment('bet'), '3 ' + language.getFragment('free-spins')];
                            var crystalYPos = [10.6, 25.6, 40.6, 55.6, 70.6];
                            var extraBonus = bonusObject.bonusData.extraBonus;
                            var extraBonusElement = $$('#enchantress-extra');
                            if (extraBonus === 0) {
                                extraBonusElement.innerHTML = '';
                            } else {
                                extraBonusElement.innerHTML = crystalValues[extraBonus - 1];
                                extraBonusElement.style.top = crystalYPos[extraBonus - 1] + '%';
                            }
                            crystalsOfMagic.select('ench');
                            $$('#game-screen').style.backgroundImage = 'url("images/backgrounds/' + dataStructure.GameID + '_free_spins_3.png")';
                        } else if (bonusObject.bonusType === 4) {
                            $$('#free-spins-label').style.visibility = 'hidden';
                            $$('#free-spins-text').style.visibility = 'hidden';
                            crystalsOfMagic.select('wizard');
                            $$('#game-screen').style.backgroundImage = 'url("images/backgrounds/' + dataStructure.GameID + '_free_spins_4.png")';
                        }
                    } else {
                        $$('#game-screen').style.backgroundImage = 'url("images/backgrounds/' + dataStructure.GameID + '_free_spins.png")';
                    }
                }
            } else {
                $$('#free-spins-label').style.visibility = 'hidden';
                $$('#free-spins-text').style.visibility = 'hidden';
                $$('#bonus-symbol-label').style.visibility = 'hidden';
                $$('#bonus-symbol').style.visibility = 'hidden';
            }

            if (dataStructure.GameType === 6) {
                var _bonusObject = JSON.parse(dataStructure.JsonData).bonusObject;
                symbolsVisible = false;
                switch (dataStructure.GameID) {
                    case 29:
                        switch (_bonusObject.bonusType) {
                            case 1:
                                crystalsOfMagic.constructNecromancerBonus(_bonusObject.bonusData, formatMoney(dataStructure.TotalBet / dataStructure.NumberOfLinesOrGamblingAttempts, dataStructure.InternalCreditDenomination));
                                break;
                            case 2:
                                crystalsOfMagic.constructGnomeBonus(_bonusObject.bonusData, formatMoney(dataStructure.TotalBet / dataStructure.NumberOfLinesOrGamblingAttempts, dataStructure.InternalCreditDenomination));
                                break;
                        }
                        break;
                    case 38:
                        switch (_bonusObject.bonusType) {
                            case 1:
                                var matrix = _bonusObject.bonusData.fields;
                                templarsQuest.drawCoins(matrix);
                                break;
                            case 2:
                                templarsQuest.battleBonus(_bonusObject.bonusData, dataStructure.TotalBet / dataStructure.NumberOfLinesOrGamblingAttempts, dataStructure.InternalCreditDenomination);
                                break;
                        }
                        break;
                }
            }

            if (symbolsVisible) drawSymbols(dataStructure);
            break;

        case 5:
            gameType('gamble');
            $$('#game-screen').style.backgroundImage = 'url("images/backgrounds/' + dataStructure.GameID + '_gamble.png")';
            $$('#timepicker').value = dataStructure.Time.substr(11, 8);
            $$('#gamble-card').style.backgroundImage = newGame ? 'url("images/cards/' + JSON.parse(dataStructure.JsonData).pickedCardSign + '.png")' : 'url("images/cards/' + dataStructure.Data[1] + '.png")';
            drawCards(dataStructure);

            insertData(language.getFragment('attempts'), dataStructure.NumberOfLinesOrGamblingAttempts, true);
            insertData(language.getFragment('win'), formatMoney(dataStructure.Win, dataStructure.InternalCreditDenomination));
            insertData(language.getFragment('gamble-amount'), formatMoney(dataStructure.TotalBet, dataStructure.InternalCreditDenomination));
            break;

        case 7:
            gameType('roulette');
            var rouletteType = 0;
            var vipRoulette = 53;
            if (dataStructure.GameID === 26) {
                $$('#board').style.backgroundImage = ' url("images/backgrounds/double-zero-board.png")';
                isAmericanRoulette = true;
            } else if (dataStructure.GameID === vipRoulette) {
                $$('#board').style.backgroundImage = ' url("images/backgrounds/roulette-board-vip.png")';
                $$('#roulette').style.backgroundImage = ' url("images/backgrounds/vip-bg.png")';
            }
            rouletteAnimator.drawChips(dataStructure.Data);
            $$('#history-line').innerHTML = '';
            insertData(language.getFragment('jackpot-win'), formatMoney(dataStructure.JackpotWin, dataStructure.InternalCreditDenomination), true);
            insertData(language.getFragment('cash'), formatMoney(dataStructure.Credit, dataStructure.InternalCreditDenomination));
            insertData(language.getFragment('win'), formatMoney(dataStructure.Win, dataStructure.InternalCreditDenomination));
            insertData(language.getFragment('total-bet'), formatMoney(dataStructure.TotalBet, dataStructure.InternalCreditDenomination));
            if (dataStructure.Win === 0 && dataStructure.TotalBet === 0) {
                $$('#history-line').innerHTML = '<div id="spin-aborted">' + language.getFragment('spin-aborted') + '</div>';
            } else {
                for (var j = 0; j < 3 && dataStructure.WinningNumbers[j] < 255; j++) {
                    rouletteType++;
                    $$('#history-line').innerHTML += '<img class="history-number ' + (dataStructure.GameID === vipRoulette ? 'vip' : '') + '" src="images/numbers' + (dataStructure.GameID === vipRoulette ? '-vip' : '') + '/' + dataStructure.WinningNumbers[j] + '.png">';
                }
            }
            if (rouletteType > 1 || dataStructure.GameID === 22) {
                $$('.winning-number-title')[0].innerHTML = language.getFragment('winning-numbers');
                insertData(language.getFragment('triple-poker-bet'), formatMoney(dataStructure.TriplePokerBet, dataStructure.InternalCreditDenomination));
            }

            $$('#timepicker').value = dataStructure.Time.substr(11, 8);
            break;

        case 8:
            gameType('poker');
            $$('#game-screen').style.backgroundImage = 'url("images/backgrounds/17.png")';
            var card = 0;
            for (var i = 0; i < 15; i++) {
                if (i < 10) {
                    if (i % 2 === 0) {
                        $$('#card' + card).src = 'images/cards/' + dataStructure.Data[i] + dataStructure.Data[i + 1] + '.png';
                        card++;
                    }
                } else {
                    if (dataStructure.Data[i] === 1 && dataStructure.Win > 0) $$('#frame' + i).src = 'images/frame.png';else $$('#frame' + i).src = 'images/empty.gif';
                }
            }
            $$('#timepicker').value = dataStructure.Time.substr(11, 8);

            insertData(language.getFragment('jackpot-win'), formatMoney(dataStructure.JackpotWin, dataStructure.InternalCreditDenomination), true);
            insertData(language.getFragment('cash'), formatMoney(dataStructure.Credit, dataStructure.InternalCreditDenomination));
            insertData(language.getFragment('win'), formatMoney(dataStructure.Win, dataStructure.InternalCreditDenomination));
            insertData(language.getFragment('total-bet'), formatMoney(dataStructure.TotalBet, dataStructure.InternalCreditDenomination));
            break;
    }

    formatBottomLabels();
    resizeGame();
}

function cascadeParse(allData) {
    var parsedData = [];
    for (var i = 0; i < allData.length; ++i) {
        var data = allData[i];
        var recallData = JSON.parse(data.JsonData);
        if (data.GameType === 5) {
            parsedData.push(data);
        } else {
            for (var j = recallData.gamesData.length - 1; j >= 0; j--) {
                var element = {
                    'GameID': data.GameID,
                    'JackpotWin': data.JackpotWin,
                    'Credit': data.Credit,
                    'Win': recallData.gamesData[j].totalSum,
                    'TotalBet': data.TotalBet,
                    'NumberOfLinesOrGamblingAttempts': data.NumberOfLinesOrGamblingAttempts,
                    'Time': data.Time,
                    'GameType': data.GameType,
                    'FreeGamesOrDoubleUpWin': data.FreeGamesOrDoubleUpWin,
                    'NumberOfGratisGame': data.NumberOfGratisGame,
                    'Multiplier': j,
                    'JsonData': {
                        'symbols': recallData.gamesData[j].symbols,
                        'pickedCardSign': recallData.gamesData[j].pickedCardSign,
                        'cardsHistory': recallData.gamesData[j].cardsHistory,
                        'bonusObject': recallData.bonusObject
                    }
                };
                element.JsonData = JSON.stringify(element.JsonData);
                parsedData.push(element);
            }
        }
    }
    return parsedData;
}'use strict';

var resources = {
    0: ['images/symbols/0/0.png', 'images/symbols/0/1.png', 'images/symbols/0/2.png', 'images/symbols/0/3.png', 'images/symbols/0/4.png', 'images/symbols/0/5.png', 'images/symbols/0/6.png', 'images/symbols/0/7.png', 'images/symbols/0/8.png', 'images/symbols/0/9.png', 'images/symbols/0/10.png', 'images/symbols/0/11.png', 'images/symbols/0/12.png', 'images/backgrounds/0.png', 'images/backgrounds/0_free_spins.png', 'images/backgrounds/0_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    1: ['images/symbols/1/0.png', 'images/symbols/1/1.png', 'images/symbols/1/2.png', 'images/symbols/1/3.png', 'images/symbols/1/4.png', 'images/symbols/1/5.png', 'images/symbols/1/6.png', 'images/symbols/1/7.png', 'images/symbols/1/8.png', 'images/symbols/1/9.png', 'images/symbols/1/10.png', 'images/symbols/1/11.png', 'images/backgrounds/1.png', 'images/backgrounds/1_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    2: ['images/symbols/2/0.png', 'images/symbols/2/1.png', 'images/symbols/2/2.png', 'images/symbols/2/3.png', 'images/symbols/2/4.png', 'images/symbols/2/5.png', 'images/symbols/2/6.png', 'images/symbols/2/7.png', 'images/symbols/2/8.png', 'images/symbols/2/9.png', 'images/symbols/2/10.png', 'images/symbols/2/11.png', 'images/symbols/2/12.png', 'images/backgrounds/2.png', 'images/backgrounds/2_free_spins.png', 'images/backgrounds/2_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    3: ['images/symbols/3/0.png', 'images/symbols/3/1.png', 'images/symbols/3/2.png', 'images/symbols/3/3.png', 'images/symbols/3/4.png', 'images/symbols/3/5.png', 'images/symbols/3/6.png', 'images/symbols/3/7.png', 'images/symbols/3/8.png', 'images/backgrounds/2.png', 'images/backgrounds/2_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    13: ['images/symbols/13/0.png', 'images/symbols/13/1.png', 'images/symbols/13/2.png', 'images/symbols/13/3.png', 'images/symbols/13/4.png', 'images/symbols/13/5.png', 'images/symbols/13/6.png', 'images/symbols/13/7.png', 'images/symbols/13/8.png', 'images/symbols/13/9.png', 'images/symbols/13/10.png', 'images/symbols/13/11.png', 'images/backgrounds/13.png', 'images/backgrounds/13_free_spins.png', 'images/backgrounds/13_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    15: ['images/symbols/15/0.png', 'images/symbols/15/1.png', 'images/symbols/15/2.png', 'images/symbols/15/3.png', 'images/symbols/15/4.png', 'images/symbols/15/5.png', 'images/symbols/15/6.png', 'images/symbols/15/7.png', 'images/symbols/15/8.png', 'images/symbols/15/9.png', 'images/symbols/15/10.png', 'images/symbols/15/11.png', 'images/symbols/15/12.png', 'images/backgrounds/15.png', 'images/backgrounds/15_free_spins.png', 'images/backgrounds/15_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    16: ['images/backgrounds/roulette-board.png', 'images/chips/chip.png', 'images/numbers/0.png', 'images/numbers/1.png', 'images/numbers/2.png', 'images/numbers/3.png', 'images/numbers/4.png', 'images/numbers/5.png', 'images/numbers/6.png', 'images/numbers/7.png', 'images/numbers/8.png', 'images/numbers/9.png', 'images/numbers/10.png', 'images/numbers/11.png', 'images/numbers/12.png', 'images/numbers/13.png', 'images/numbers/14.png', 'images/numbers/15.png', 'images/numbers/16.png', 'images/numbers/17.png', 'images/numbers/18.png', 'images/numbers/19.png', 'images/numbers/20.png', 'images/numbers/21.png', 'images/numbers/22.png', 'images/numbers/23.png', 'images/numbers/24.png', 'images/numbers/25.png', 'images/numbers/26.png', 'images/numbers/27.png', 'images/numbers/28.png', 'images/numbers/29.png', 'images/numbers/30.png', 'images/numbers/31.png', 'images/numbers/32.png', 'images/numbers/33.png', 'images/numbers/34.png', 'images/numbers/35.png', 'images/numbers/36.png'],

    17: ['images/cards/00.png', 'images/cards/01.png', 'images/cards/02.png', 'images/cards/03.png', 'images/cards/10.png', 'images/cards/11.png', 'images/cards/12.png', 'images/cards/13.png', 'images/cards/20.png', 'images/cards/21.png', 'images/cards/22.png', 'images/cards/23.png', 'images/cards/30.png', 'images/cards/31.png', 'images/cards/32.png', 'images/cards/33.png', 'images/cards/40.png', 'images/cards/41.png', 'images/cards/42.png', 'images/cards/43.png', 'images/cards/50.png', 'images/cards/51.png', 'images/cards/52.png', 'images/cards/53.png', 'images/cards/60.png', 'images/cards/61.png', 'images/cards/62.png', 'images/cards/63.png', 'images/cards/70.png', 'images/cards/71.png', 'images/cards/72.png', 'images/cards/73.png', 'images/cards/80.png', 'images/cards/81.png', 'images/cards/82.png', 'images/cards/83.png', 'images/cards/90.png', 'images/cards/91.png', 'images/cards/92.png', 'images/cards/93.png', 'images/cards/100.png', 'images/cards/101.png', 'images/cards/102.png', 'images/cards/103.png', 'images/cards/110.png', 'images/cards/111.png', 'images/cards/112.png', 'images/cards/113.png', 'images/cards/120.png', 'images/cards/121.png', 'images/cards/122.png', 'images/cards/123.png', 'images/frame.png', 'images/backgrounds/17.png', 'images/backgrounds/17_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    19: ['images/symbols/19/0.png', 'images/symbols/19/1.png', 'images/symbols/19/2.png', 'images/symbols/19/3.png', 'images/symbols/19/4.png', 'images/symbols/19/5.png', 'images/symbols/19/6.png', 'images/symbols/19/7.png', 'images/backgrounds/19.png', 'images/backgrounds/19_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    20: ['images/symbols/20/0.png', 'images/symbols/20/1.png', 'images/symbols/20/2.png', 'images/symbols/20/3.png', 'images/symbols/20/4.png', 'images/symbols/20/5.png', 'images/symbols/20/6.png', 'images/symbols/20/7.png', 'images/backgrounds/20.png', 'images/backgrounds/20_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    21: ['images/symbols/21/0.png', 'images/symbols/21/1.png', 'images/symbols/21/2.png', 'images/symbols/21/3.png', 'images/symbols/21/4.png', 'images/symbols/21/5.png', 'images/symbols/21/6.png', 'images/symbols/21/7.png', 'images/symbols/21/8.png', 'images/backgrounds/21.png', 'images/backgrounds/21_free_spins.png', 'images/backgrounds/21_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    22: ['images/backgrounds/roulette-board.png', 'images/chips/chip.png', 'images/numbers/0.png', 'images/numbers/1.png', 'images/numbers/2.png', 'images/numbers/3.png', 'images/numbers/4.png', 'images/numbers/5.png', 'images/numbers/6.png', 'images/numbers/7.png', 'images/numbers/8.png', 'images/numbers/9.png', 'images/numbers/10.png', 'images/numbers/11.png', 'images/numbers/12.png', 'images/numbers/13.png', 'images/numbers/14.png', 'images/numbers/15.png', 'images/numbers/16.png', 'images/numbers/17.png', 'images/numbers/18.png', 'images/numbers/19.png', 'images/numbers/20.png', 'images/numbers/21.png', 'images/numbers/22.png', 'images/numbers/23.png', 'images/numbers/24.png', 'images/numbers/25.png', 'images/numbers/26.png', 'images/numbers/27.png', 'images/numbers/28.png', 'images/numbers/29.png', 'images/numbers/30.png', 'images/numbers/31.png', 'images/numbers/32.png', 'images/numbers/33.png', 'images/numbers/34.png', 'images/numbers/35.png', 'images/numbers/36.png'],

    23: ['images/symbols/23/0.png', 'images/symbols/23/1.png', 'images/symbols/23/2.png', 'images/symbols/23/3.png', 'images/symbols/23/4.png', 'images/symbols/23/5.png', 'images/symbols/23/6.png', 'images/symbols/23/7.png', 'images/symbols/23/8.png', 'images/symbols/23/9.png', 'images/backgrounds/23.png', 'images/backgrounds/23_free_spins.png', 'images/backgrounds/23_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    24: ['images/symbols/24/0.png', 'images/symbols/24/1.png', 'images/symbols/24/2.png', 'images/symbols/24/3.png', 'images/symbols/24/4.png', 'images/symbols/24/5.png', 'images/symbols/24/6.png', 'images/symbols/24/7.png', 'images/backgrounds/24.png', 'images/backgrounds/24_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    25: ['images/backgrounds/roulette-board.png', 'images/chips/chip.png', 'images/numbers/0.png', 'images/numbers/1.png', 'images/numbers/2.png', 'images/numbers/3.png', 'images/numbers/4.png', 'images/numbers/5.png', 'images/numbers/6.png', 'images/numbers/7.png', 'images/numbers/8.png', 'images/numbers/9.png', 'images/numbers/10.png', 'images/numbers/11.png', 'images/numbers/12.png', 'images/numbers/13.png', 'images/numbers/14.png', 'images/numbers/15.png', 'images/numbers/16.png', 'images/numbers/17.png', 'images/numbers/18.png', 'images/numbers/19.png', 'images/numbers/20.png', 'images/numbers/21.png', 'images/numbers/22.png', 'images/numbers/23.png', 'images/numbers/24.png', 'images/numbers/25.png', 'images/numbers/26.png', 'images/numbers/27.png', 'images/numbers/28.png', 'images/numbers/29.png', 'images/numbers/30.png', 'images/numbers/31.png', 'images/numbers/32.png', 'images/numbers/33.png', 'images/numbers/34.png', 'images/numbers/35.png', 'images/numbers/36.png'],

    26: ['images/backgrounds/roulette-board.png', 'images/chips/chip.png', 'images/numbers/0.png', 'images/numbers/1.png', 'images/numbers/2.png', 'images/numbers/3.png', 'images/numbers/4.png', 'images/numbers/5.png', 'images/numbers/6.png', 'images/numbers/7.png', 'images/numbers/8.png', 'images/numbers/9.png', 'images/numbers/10.png', 'images/numbers/11.png', 'images/numbers/12.png', 'images/numbers/13.png', 'images/numbers/14.png', 'images/numbers/15.png', 'images/numbers/16.png', 'images/numbers/17.png', 'images/numbers/18.png', 'images/numbers/19.png', 'images/numbers/20.png', 'images/numbers/21.png', 'images/numbers/22.png', 'images/numbers/23.png', 'images/numbers/24.png', 'images/numbers/25.png', 'images/numbers/26.png', 'images/numbers/27.png', 'images/numbers/28.png', 'images/numbers/29.png', 'images/numbers/30.png', 'images/numbers/31.png', 'images/numbers/32.png', 'images/numbers/33.png', 'images/numbers/34.png', 'images/numbers/35.png', 'images/numbers/36.png', 'images/numbers/100.png'],

    27: ['images/symbols/27/0.png', 'images/symbols/27/1.png', 'images/symbols/27/2.png', 'images/symbols/27/3.png', 'images/symbols/27/4.png', 'images/symbols/27/5.png', 'images/symbols/27/6.png', 'images/symbols/27/7.png', 'images/symbols/27/8.png', 'images/backgrounds/27.png', 'images/backgrounds/27_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    28: ['images/symbols/28/0.png', 'images/symbols/28/1.png', 'images/symbols/28/2.png', 'images/symbols/28/3.png', 'images/symbols/28/4.png', 'images/symbols/28/5.png', 'images/symbols/28/6.png', 'images/symbols/28/7.png', 'images/backgrounds/28.png', 'images/backgrounds/28_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    29: ['images/symbols/29/0.png', 'images/symbols/29/1.png', 'images/symbols/29/2.png', 'images/symbols/29/3.png', 'images/symbols/29/4.png', 'images/symbols/29/5.png', 'images/symbols/29/6.png', 'images/symbols/29/7.png', 'images/symbols/29/8.png', 'images/symbols/29/10.png', 'images/symbols/29/11.png', 'images/symbols/29/12.png', 'images/symbols/29/13.png', 'images/symbols/29/14.png', 'images/symbols/29/15.png', 'images/backgrounds/29.png', 'images/backgrounds/29_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    30: ['images/symbols/30/0.png', 'images/symbols/30/1.png', 'images/symbols/30/2.png', 'images/symbols/30/3.png', 'images/symbols/30/4.png', 'images/symbols/30/5.png', 'images/symbols/30/6.png', 'images/symbols/30/7.png', 'images/symbols/30/8.png', 'images/symbols/30/10.png', 'images/symbols/30/11.png', 'images/symbols/30/12.png', 'images/backgrounds/30.png', 'images/backgrounds/30_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    31: ['images/symbols/31/0.png', 'images/symbols/31/1.png', 'images/symbols/31/2.png', 'images/symbols/31/3.png', 'images/symbols/31/4.png', 'images/symbols/31/5.png', 'images/symbols/31/6.png', 'images/symbols/31/7.png', 'images/symbols/31/8.png', 'images/symbols/31/9.png', 'images/backgrounds/31.png', 'images/backgrounds/31_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    32: ['images/symbols/32/0.png', 'images/symbols/32/1.png', 'images/symbols/32/2.png', 'images/symbols/32/3.png', 'images/symbols/32/4.png', 'images/symbols/32/5.png', 'images/symbols/32/6.png', 'images/symbols/32/7.png', 'images/backgrounds/32.png', 'images/backgrounds/32_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    33: ['images/symbols/33/0.png', 'images/symbols/33/1.png', 'images/symbols/33/2.png', 'images/symbols/33/3.png', 'images/symbols/33/4.png', 'images/symbols/33/5.png', 'images/symbols/33/6.png', 'images/symbols/33/7.png', 'images/symbols/33/8.png', 'images/symbols/33/9.png', 'images/symbols/33/10.png', 'images/symbols/33/11.png', 'images/backgrounds/33.png', 'images/backgrounds/33_free_spins.png', 'images/backgrounds/33_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    34: ['images/symbols/34/0.png', 'images/symbols/34/1.png', 'images/symbols/34/2.png', 'images/symbols/34/3.png', 'images/symbols/34/4.png', 'images/symbols/34/5.png', 'images/symbols/34/6.png', 'images/symbols/34/7.png', 'images/symbols/34/8.png', 'images/backgrounds/2.png', 'images/backgrounds/2_gamble.png'],

    35: ['images/symbols/35/0.png', 'images/symbols/35/1.png', 'images/symbols/35/2.png', 'images/symbols/35/3.png', 'images/symbols/35/4.png', 'images/symbols/35/5.png', 'images/symbols/35/6.png', 'images/symbols/35/7.png', 'images/symbols/35/8.png', 'images/backgrounds/35.png', 'images/backgrounds/35_free_spins.png', 'images/backgrounds/35_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    36: ['images/symbols/36/0.png', 'images/symbols/36/1.png', 'images/symbols/36/2.png', 'images/symbols/36/3.png', 'images/symbols/36/4.png', 'images/symbols/36/5.png', 'images/symbols/36/6.png', 'images/symbols/36/7.png', 'images/backgrounds/36.png', 'images/backgrounds/36_free_spins.png', 'images/backgrounds/36_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    37: ['images/symbols/37/0.png', 'images/symbols/37/1.png', 'images/symbols/37/2.png', 'images/symbols/37/3.png', 'images/symbols/37/4.png', 'images/symbols/37/5.png', 'images/symbols/37/6.png', 'images/symbols/37/7.png', 'images/symbols/37/8.png', 'images/symbols/37/9.png', 'images/backgrounds/37.png', 'images/backgrounds/37_free_spins.png', 'images/backgrounds/37_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    38: ['images/symbols/38/0.png', 'images/symbols/38/1.png', 'images/symbols/38/2.png', 'images/symbols/38/3.png', 'images/symbols/38/4.png', 'images/symbols/38/5.png', 'images/symbols/38/6.png', 'images/symbols/38/7.png', 'images/symbols/38/8.png', 'images/symbols/38/9.png', 'images/symbols/38/10.png', 'images/symbols/38/11.png', 'images/symbols/38/12.png', 'images/backgrounds/38.png', 'images/backgrounds/38_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    39: ['images/symbols/39/0.png', 'images/symbols/39/1.png', 'images/symbols/39/2.png', 'images/symbols/39/3.png', 'images/symbols/39/4.png', 'images/symbols/39/5.png', 'images/symbols/39/6.png', 'images/symbols/39/7.png', 'images/symbols/39/8.png', 'images/backgrounds/39.png', 'images/backgrounds/39_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    40: ['images/symbols/40/0.png', 'images/symbols/40/1.png', 'images/symbols/40/2.png', 'images/symbols/40/3.png', 'images/symbols/40/4.png', 'images/symbols/40/5.png', 'images/symbols/40/6.png', 'images/symbols/40/7.png', 'images/backgrounds/40.png', 'images/backgrounds/40_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    41: ['images/symbols/41/0.png', 'images/symbols/41/1.png', 'images/symbols/41/2.png', 'images/symbols/41/3.png', 'images/symbols/41/4.png', 'images/symbols/41/5.png', 'images/symbols/41/6.png', 'images/symbols/41/7.png', 'images/backgrounds/41.png', 'images/backgrounds/41_free_spins.png', 'images/backgrounds/41_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    42: ['images/symbols/42/0.png', 'images/symbols/42/1.png', 'images/symbols/42/2.png', 'images/symbols/42/3.png', 'images/symbols/42/4.png', 'images/symbols/42/5.png', 'images/symbols/42/6.png', 'images/symbols/42/7.png', 'images/symbols/42/8.png', 'images/backgrounds/42.png', 'images/backgrounds/42_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    43: ['images/symbols/43/0.png', 'images/symbols/43/1.png', 'images/symbols/43/2.png', 'images/symbols/43/3.png', 'images/symbols/43/4.png', 'images/symbols/43/5.png', 'images/symbols/43/6.png', 'images/symbols/43/7.png', 'images/backgrounds/43.png', 'images/backgrounds/43_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    44: ['images/symbols/44/0.png', 'images/symbols/44/1.png', 'images/symbols/44/2.png', 'images/symbols/44/3.png', 'images/symbols/44/4.png', 'images/symbols/44/5.png', 'images/symbols/44/6.png', 'images/symbols/44/7.png', 'images/backgrounds/44.png', 'images/backgrounds/44_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    45: ['images/symbols/45/0.png', 'images/symbols/45/1.png', 'images/symbols/45/2.png', 'images/symbols/45/3.png', 'images/symbols/45/4.png', 'images/symbols/45/5.png', 'images/symbols/45/6.png', 'images/symbols/45/7.png', 'images/backgrounds/45.png', 'images/backgrounds/45_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    46: ['images/symbols/46/0.png', 'images/symbols/46/1.png', 'images/symbols/46/2.png', 'images/symbols/46/3.png', 'images/symbols/46/4.png', 'images/symbols/46/5.png', 'images/symbols/46/6.png', 'images/symbols/46/7.png', 'images/backgrounds/46.png', 'images/backgrounds/46_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    47: ['images/symbols/47/0.png', 'images/symbols/47/1.png', 'images/symbols/47/2.png', 'images/symbols/47/3.png', 'images/symbols/47/4.png', 'images/symbols/47/5.png', 'images/symbols/47/6.png', 'images/symbols/47/7.png', 'images/backgrounds/47.png', 'images/backgrounds/47_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    48: ['images/symbols/48/0.png', 'images/symbols/48/1.png', 'images/symbols/48/2.png', 'images/symbols/48/3.png', 'images/symbols/48/4.png', 'images/symbols/48/5.png', 'images/symbols/48/6.png', 'images/symbols/48/7.png', 'images/backgrounds/48.png', 'images/backgrounds/48_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    51: ['images/symbols/51/0.png', 'images/symbols/51/1.png', 'images/symbols/51/2.png', 'images/symbols/51/3.png', 'images/symbols/51/4.png', 'images/symbols/51/5.png', 'images/symbols/51/6.png', 'images/symbols/51/7.png', 'images/symbols/51/8.png', 'images/symbols/51/9.png', 'images/symbols/51/10.png', 'images/symbols/51/11.png', 'images/symbols/51/12.png', 'images/backgrounds/51.png', 'images/backgrounds/51_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    52: ['images/symbols/52/0.png', 'images/symbols/52/1.png', 'images/symbols/52/2.png', 'images/symbols/52/3.png', 'images/symbols/52/4.png', 'images/symbols/52/5.png', 'images/symbols/52/6.png', 'images/symbols/52/7.png', 'images/symbols/52/8.png', 'images/backgrounds/52.png', 'images/backgrounds/52_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    53: ['images/backgrounds/roulette-board-vip.png', 'images/chips/chip.png', 'images/numbers-vip/0.png', 'images/numbers-vip/1.png', 'images/numbers-vip/2.png', 'images/numbers-vip/3.png', 'images/numbers-vip/4.png', 'images/numbers-vip/5.png', 'images/numbers-vip/6.png', 'images/numbers-vip/7.png', 'images/numbers-vip/8.png', 'images/numbers-vip/9.png', 'images/numbers-vip/10.png', 'images/numbers-vip/11.png', 'images/numbers-vip/12.png', 'images/numbers-vip/13.png', 'images/numbers-vip/14.png', 'images/numbers-vip/15.png', 'images/numbers-vip/16.png', 'images/numbers-vip/17.png', 'images/numbers-vip/18.png', 'images/numbers-vip/19.png', 'images/numbers-vip/20.png', 'images/numbers-vip/21.png', 'images/numbers-vip/22.png', 'images/numbers-vip/23.png', 'images/numbers-vip/24.png', 'images/numbers-vip/25.png', 'images/numbers-vip/26.png', 'images/numbers-vip/27.png', 'images/numbers-vip/28.png', 'images/numbers-vip/29.png', 'images/numbers-vip/30.png', 'images/numbers-vip/31.png', 'images/numbers-vip/32.png', 'images/numbers-vip/33.png', 'images/numbers-vip/34.png', 'images/numbers-vip/35.png', 'images/numbers-vip/36.png'],

    54: ['images/symbols/54/0.png', 'images/symbols/54/1.png', 'images/symbols/54/2.png', 'images/symbols/54/3.png', 'images/symbols/54/4.png', 'images/symbols/54/5.png', 'images/symbols/54/6.png', 'images/symbols/54/7.png', 'images/backgrounds/54.png', 'images/backgrounds/54_free_spins.png', 'images/backgrounds/54_gamble.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png'],

    55: ['images/symbols/55/0.png', 'images/symbols/55/1.png', 'images/symbols/55/2.png', 'images/symbols/55/3.png', 'images/symbols/55/4.png', 'images/symbols/55/5.png', 'images/symbols/55/6.png', 'images/symbols/55/7.png', 'images/symbols/55/8.png', 'images/symbols/55/9.png', 'images/symbols/55/10.png', 'images/symbols/55/11.png', 'images/symbols/55/12.png', 'images/backgrounds/55.png', 'images/backgrounds/55_gamble.png', 'images/backgrounds/55_free_spins.png', 'images/cards/0.png', 'images/cards/1.png', 'images/cards/2.png', 'images/cards/3.png']
};

var loadedResources = [];'use strict';

var DEFAULT_ASPECT_RATIO = 16 / 9;
var langCoef = 1;

function resizeGame() {
    var mainSection = $$('#mainSection');
    var width = window.innerWidth;
    var height = window.innerHeight;
    var currentAspectRatio = width / height;
    var realWidth = window.innerWidth;

    currentAspectRatio > DEFAULT_ASPECT_RATIO ? width = height * DEFAULT_ASPECT_RATIO : height = width / DEFAULT_ASPECT_RATIO;

    mainSection.style.height = height + 'px';
    mainSection.style.width = width - 1 + 'px';

    window.scrollTo(0, 0);

    resizeLabels(width, height);
    crystalsOfMagic.resize(width, height);

    trigger('game/resized', {
        width: width,
        height: height
    });

    $('#datepicker').datepicker('hide');
    if (selectedGameType === 'roulette') rouletteAnimator.resize();
}

function resizeLabels(width, height) {
    for (var _i2 = 0, _$$2 = $$('.control-title'), _length2 = _$$2.length; _i2 < _length2; _i2++) {
        var controlTitle = _$$2[_i2];
        controlTitle.style.fontSize = width * 0.02 + 'px';
    }

    $$('#pagination').style.fontSize = width * 0.02 + 'px';
    $$('#message').style.fontSize = width * 0.02 + 'px';

    for (var _i4 = 0, _$$4 = $$('.control-option'), _length4 = _$$4.length; _i4 < _length4; _i4++) {
        var controlOption = _$$4[_i4];
        controlOption.style.fontSize = width * 0.018 + 'px';
        controlOption.style.border = width * 0.0015 + 'px solid rgba(255, 255, 255, 0.8)';
        controlOption.style.borderRadius = width * 0.006 + 'px';
    }

    for (var _i6 = 0, _$$6 = $$('.button'), _length6 = _$$6.length; _i6 < _length6; _i6++) {
        var button = _$$6[_i6];
        button.style.borderRadius = width * 0.006 + 'px';
        button.style.fontSize = width * 0.02 + 'px';
    }

    $$('#controls').style.borderRight = width * 0.0018 * 'px solid #403f3f';
    $$('.ui-widget')[0].style.border = width * 0.0015 + 'px solid #c5c5c5';
    $$('.ui-widget')[0].style.borderRadius = width * 0.004 + 'px';
    $$('.winning-number-title')[0].style.fontSize = width * 0.014;
    if ($$('#spin-aborted')) {
        $$('#spin-aborted').style.fontSize = width * 0.014;
    }
    if ($$('.block')) {
        for (var _i8 = 0, _$$8 = $$('.block'), _length8 = _$$8.length; _i8 < _length8; _i8++) {
            var block = _$$8[_i8];
            block.children[0].style.fontSize = width * 0.014;
            block.children[1].style.fontSize = width * 0.024;
        }
    }
    $$('.footer-title')[0].style.fontSize = width * 0.013;
    $$('#free-spins-label').style.fontSize = width * 0.017 + 'px';
    $$('#bonus-symbol-label').style.fontSize = width * 0.017 + 'px';
    $$('#enchantress-extra').style.fontSize = width * 0.01 + 'px';
    $$('#necro-lives').style.fontSize = width * 0.015 + 'px';

    $$('#gold-amount').style.fontSize = width * 0.03 + 'px';
    $$('#selected-scroll').style.fontSize = width * 0.02 + 'px';

    for (var _i10 = 0, _$$$children2 = $$('#other-scrolls').children, _length10 = _$$$children2.length; _i10 < _length10; _i10++) {
        var scroll = _$$$children2[_i10];
        scroll.style.fontSize = width * 0.017 + 'px';
    }

    document.querySelectorAll('.glyphs div').forEach(function (element) {
        element.style.fontSize = width * 0.01 + 'px';
    });

    var defaultFields = document.querySelectorAll('.defaultField');
    if (window.innerWidth <= 989) {
        for (var i = 0; i < defaultFields.length; i++) {
            defaultFields[i].style.fontSize = width * 0.027 * langCoef * langCoef + 'px';
        }
    } else {
        for (var _i11 = 0; _i11 < defaultFields.length; _i11++) {
            defaultFields[_i11].style.fontSize = width * 0.024 * langCoef * langCoef + 'px';
        }
    }

    if (window.navigator.userAgent.indexOf('Edge') > -1) {
        $$('#timeSlider').style.height = 0.05 * width;
    }
}

if (navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) {
    for (var _i13 = 0, _$$10 = $$('.control-option'), _length12 = _$$10.length; _i13 < _length12; _i13++) {
        var controlOption = _$$10[_i13];
        controlOption.style.width = '72.5%';
    }
}

var heightIsSet = 0;

function defHeight() {
    var width = $$('#game-frame').clientWidth;
    var height = $$('#game-frame').clientHeight;
    var currentAspectRatio = width / height;
    currentAspectRatio > DEFAULT_ASPECT_RATIO ? width = height * DEFAULT_ASPECT_RATIO : height = width / DEFAULT_ASPECT_RATIO;
    return height;
}

function defWidth() {
    var width = $$('#game-frame').clientWidth;
    var height = $$('#game-frame').clientHeight;
    var currentAspectRatio = width / height;
    currentAspectRatio > DEFAULT_ASPECT_RATIO ? width = height * DEFAULT_ASPECT_RATIO : height = width / DEFAULT_ASPECT_RATIO;
    return width;
}

window.addEventListener('load', function () {
    resizeGame();
    if (/Edge\/\d./i.test(navigator.userAgent)) $$('#timeSlider').style.height = 'calc(2vmax + 2vmin)';
}, false);

window.addEventListener('resize', function () {
    resizeGame();
}, false);'use strict';

function getInteger(position, data) {
    return data[position + 3] | data[position + 2] << 8 | data[position + 1] << 16 | data[position] << 24;
}

var rouletteAnimator = function () {
    var canvas = $$('#chips-canvas');
    var CHIP_SIZE_HEIGHT = void 0;
    var CHIP_SIZE_WIDTH = void 0;
    var chipImage = new Image();
    var context = canvas.getContext('2d');
    chipImage.src = 'images/chips/chip.png';
    var chipsData = [];

    function resize() {
        var mainSection = $$('#game-screen');
        canvas.width = mainSection.clientWidth * 0.99 * window.devicePixelRatio;
        canvas.height = mainSection.clientHeight * 0.628 * window.devicePixelRatio;

        var newWidth = canvas.width / 28;
        var newHeight = canvas.height / 10;
        chipsData.forEach(function (chip) {
            chip.position.x *= newWidth / CHIP_SIZE_WIDTH;
            chip.position.y *= newHeight / CHIP_SIZE_HEIGHT;
        }, this);
        CHIP_SIZE_WIDTH = newWidth;
        CHIP_SIZE_HEIGHT = newHeight;

        context.save();
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = 'black';
        context.fillStyle = 'black';
        for (var i = 0; i < chipsData.length; ++i) {
            drawChip(chipsData[i]);
        }
        context.restore();
    }

    function parseBetsData(betsData) {
        var betsMatrix = preparseBetsData(betsData);
        chipsData = [];
        for (var i = 0; i < betsMatrix.length; ++i) {
            for (var j = 0; j < betsMatrix[i].length; ++j) {
                if (betsMatrix[i][j] > 0) {
                    var position = { x: 0, y: 0 };
                    position.x = (0.5 + j) * CHIP_SIZE_WIDTH;
                    position.y = (0.5 + i) * CHIP_SIZE_HEIGHT;
                    if (j === 25) {
                        position.x += CHIP_SIZE_WIDTH;
                    }
                    if (i === 7) {
                        position.y += CHIP_SIZE_HEIGHT;
                    }

                    if (isAmericanRoulette && j === 0) {
                        if (i === 1) {
                            position.y -= 0.5 * CHIP_SIZE_HEIGHT;
                        }
                        if (i === 3) {
                            position.y += 0.5 * CHIP_SIZE_HEIGHT;
                        }
                    }
                    chipsData.push({
                        value: betsMatrix[i][j],
                        position: position
                    });
                }
            }
        }
    }

    function preparseBetsData(betsData) {
        var bets = [];
        var counter = 0;
        for (var i = 0; i < 8; ++i) {
            bets[i] = [];
            for (var j = 0; j < 26; ++j) {
                bets[i][j] = getInteger(counter, betsData);
                counter += 4;
            }
        }
        return bets;
    }

    function drawChips(betsMatrix) {
        resize();
        parseBetsData(betsMatrix);
        context.save();
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = 'black';
        context.fillStyle = 'black';
        for (var i = 0; i < chipsData.length; ++i) {
            drawChip(chipsData[i]);
        }
        context.restore();
    }

    function drawChip(data) {
        if (data.value === 0) return;
        context.save();
        context.strokeStyle = 'black';
        context.fillStyle = 'black';
        context.clearRect(data.position.x, data.position.y, CHIP_SIZE_WIDTH, CHIP_SIZE_HEIGHT);
        context.drawImage(chipImage, 0, 0, 60, 60, data.position.x, data.position.y, CHIP_SIZE_WIDTH, CHIP_SIZE_HEIGHT);
        setChipFont(formatBigMoney(data.value));
        context.fillText(formatBigMoney(data.value), data.position.x + CHIP_SIZE_WIDTH / 2, data.position.y + CHIP_SIZE_HEIGHT / 2);
        context.restore();
    }

    function setChipFont(text) {
        text = text.toString();
        var textLength = text.length;
        var textCoefficient = 0;
        switch (textLength) {
            case 1:
                textCoefficient = 1.6;
                break;
            case 2:
                textCoefficient = 1.6;
                break;
            case 3:
                textCoefficient = 2.1;
                break;
            case 4:
                textCoefficient = 2.6;
                break;
            case 5:
                textCoefficient = 3.1;
                break;
            case 6:
                textCoefficient = 3.6;
                break;
            case 7:
                textCoefficient = 4.5;
                break;
        }
        context.font = CHIP_SIZE_WIDTH / (textCoefficient * 1.1) + 'px Roboto';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
    }

    return {
        resize: resize,
        drawChips: drawChips
    };
}();'use strict';

var templarsQuest = function () {
    var reels = $$('#reels');
    var multiplierTitle = $$('#multiplier-title');
    var multiplierCanvas = $$('#multiplier-canvas');

    function drawCoins(matrix) {
        reels.innerHTML = '';
        reels.classList.add('new-game-with-gap');
        multiplierTitle.style.visibility = 'hidden';
        multiplierCanvas.style.visibility = 'hidden';
        $$('#game-screen').style.backgroundImage = 'url("images/bonus/TemplarsQuest/CoinHunt/bonus-background.png")';
        for (var i = 0; i < matrix.length; i++) {
            if (matrix[i] !== 255) {
                reels.innerHTML += '<div class="symbols new-game-with-gap" id="symbol' + i + '"></div>';
                $$('#symbol' + i).style.backgroundImage = 'url("images/bonus/TemplarsQuest/CoinHunt/' + matrix[i] + '.png")';
            }
        }
    }

    function livesLeft(number) {
        var self = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var bar = self ? $$('#lives') : $$('#enemy-lives');
        for (var i = 0; i < bar.children.length; i++) {
            (self ? i >= number : i < bar.children.length - number) ? bar.children[i].classList.add('kill') : bar.children[i].classList.remove('kill');
        }
    }

    function battleBonus(data, bet, denom) {
        $$('#battle-bonus').classList.remove('hidden');
        multiplierTitle.style.visibility = 'hidden';
        multiplierCanvas.style.visibility = 'hidden';
        livesLeft(data.lifesLeft, true);
        livesLeft(data.opponentLifesLeft, false);
        switch (data.gameType) {
            case 1:
                $$('#scrolls').classList.add('hidden');
                $$('#battle').classList.add('hidden');
                $$('#gold').classList.remove('hidden');
                var moneyWon = formatMoney(data.stepData.win * bet, denom);
                $$('#gold-amount').innerHTML = moneyWon;
                break;
            case 2:
                $$('#scrolls').classList.remove('hidden');
                $$('#battle').classList.add('hidden');
                $$('#gold').classList.add('hidden');
                var selectedField = formatMoney(data.stepData.selectedField * bet, denom);
                var fields = data.stepData.otherFields.map(function (value) {
                    return formatMoney(value * bet, denom);
                });
                $$('#selected-scroll').innerHTML = selectedField;
                for (var scroll = 0; scroll < $$('#other-scrolls').children.length; scroll++) {
                    $$('#other-scrolls').children[scroll].innerHTML = fields[scroll];
                }
                break;
            case 3:
                $$('#scrolls').classList.add('hidden');
                $$('#battle').classList.remove('hidden');
                $$('#gold').classList.add('hidden');
                var isWin = data.stepData.battleWon;
                $$('#battle-symbol').style.backgroundImage = 'url(\'images/bonus/TemplarsQuest/Battle/' + (isWin ? 'battle-win' : 'battle-lose') + '.png\')';
                break;
        }
    }

    return {
        drawCoins: drawCoins,
        battleBonus: battleBonus
    };
}();'use strict';

$$('#datepicker').readOnly = true;

on('language/changed', function (event, data) {
    $('#datepicker').datepicker({
        dateFormat: language.getFragment('dateFormat'),
        firstDay: language.getFragment('firstDay'),
        monthNames: language.getFragment('monthNames'),
        monthNamesShort: language.getFragment('monthNamesShort'),
        dayNames: language.getFragment('dayNames'),
        dayNamesShort: language.getFragment('dayNamesShort'),
        dayNamesMin: language.getFragment('dayNamesMin')
    }).datepicker('setDate', '0');

    switch (data) {
        case 'GER':
        case 'POR':
            langCoef = 0.8;
            break;
        default:
            langCoef = 1;
            break;
    }
});

$$('#datepicker-overlay').addEventListener('click', function () {
    $('#datepicker').datepicker('show');
});

$$('#game-frame').addEventListener('hover', function () {
    $('#datepicker').datepicker('hide');
});

$('#datepicker').change(function () {
    connect();
});

$$('#prev').addEventListener('click', function () {
    navigate(1);
});

$$('#next').addEventListener('click', function () {
    navigate(0);
});

$$('#timeSlider').addEventListener('input', function () {
    selectedGame = loadedData.Result.length - this.value;
    $$('#indexPage').innerHTML = this.value;
    readFromJSON(loadedData.Result[selectedGame]);
});

document.onkeydown = function (e) {
    switch (e.which) {
        case 37:
            navigate(1);
            break;
        case 39:
            navigate(0);
            break;
    }
};

function formatBigMoney(value) {
    var showValue = value / 100;
    var suffix = '';
    var shouldTrim = true;

    if (shouldTrim) {
        var trimmedData = trimValue(showValue);
        showValue = trimmedData.value;
        suffix = trimmedData.suffix;
    }

    return formatShowValue(trimDecimals(showValue), suffix);

    function trimDecimals(value) {
        var decimalCount = value.toString().indexOf('.') !== -1 ? value.toString().split('.')[1].length : 0;

        if (decimalCount > 8) return value.toString().slice(0, 8 - decimalCount).replace(/(\d)(?=(\d{3})+\.)/g, '$1');else return value.toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1');
    }

    function formatShowValue(value, suffix) {
        if (suffix !== '' && value.indexOf('.') !== -1) {
            while (value[value.length - 1] === '0') {
                value = value.slice(0, -1);
            }if (value[value.length - 1] === '.') value = value.slice(0, -1);
        }

        if (value.indexOf('-') !== -1) {
            var decimalCount = Number(value.toString().split('-')[1]);
            value = Number(value).toFixed(decimalCount);
        }

        return value + suffix;
    }
}

function trimValue(value) {
    if (value >= 1000000000) return { value: value / 1000000000, suffix: 'B' };else if (value >= 1000000) return { value: value / 1000000, suffix: 'M' };else if (value >= 1000) return { value: value / 1000, suffix: 'K' };else return { value: value, suffix: '' };
}

function formatBottomLabels() {
    var maxWidth = 0;
    var bottomElements = document.querySelectorAll('.block');
    for (var i = 0; i < bottomElements.length; i++) {
        maxWidth += parseFloat(window.getComputedStyle(bottomElements[i]).width.replace('px', ''));
        maxWidth += parseFloat(window.getComputedStyle(bottomElements[i]).marginLeft.replace('px', ''));
        maxWidth += parseFloat(window.getComputedStyle(bottomElements[i]).marginRight.replace('px', ''));
    }
    if (maxWidth > parseFloat(window.getComputedStyle($$('#bottom-wrapper')).width.replace('px', ''))) {
        for (var _i = 0; _i < bottomElements.length; _i++) {
            bottomElements[_i].children[1].innerHTML = formatBigMoney(bottomElements[_i].children[1].innerHTML * 100);
        }
    }
}