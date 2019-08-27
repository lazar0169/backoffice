let crystalsOfMagic = function () {
    let activeBonus = [false, false, false, false]; // [necro, gnome, ench, wizard]
    let glyphMultipliers = [15, 20, 25, 30, 60];

    function constructGnomeBonus(data, bet) {
        select('gnome');
        let livesCount = data.lifesLeft;
        let lives = '<img src="images/bonus/CrystalsOfMagic/gnome/lifebar.png" id="com-lifebar">';
        for (let i = 0; i < livesCount; i++) {
            lives += `<img src="images/bonus/CrystalsOfMagic/gnome/life.png" id="com-life${i + 1}">`;
        }
        $$('#com-life').innerHTML = lives;
        let fields = [data.firstField, data.selectField, data.secondField];
        for (let i = 0; i < 3; i++) {
            let option = $$(`#option${i + 1}`);
            if (fields[i] === 0) {
                option.innerHTML = '';
                option.style.backgroundImage = 'url("images/bonus/CrystalsOfMagic/gnome/skull.png")';
            } else {
                option.innerHTML = data.isMultiplier ? fields[i] : (fields[i] * data.multiply * bet).toFixed(2);
                option.style.backgroundImage = '';
            }
        }
        $$('#com-multiplier').innerHTML = `x${data.multiply}`;
        let percent = (data.stepID / 38) * 100;
        $$('#com-progress-bar').style.width = `${percent}%`;
        $$('#com-progress-thumb').style.marginLeft = `${percent}%`;
    }

    function constructNecromancerBonus(data, bet) {
        select('necro');
        let reset = true;
        $$('#necro-lives').innerHTML = `${language.getFragment('lives')}: ${data.lifes}`;

        for (let i = 0; i < 5; i++) {
            let val = trimValue(glyphMultipliers[i] * bet);
            $$(`#glyph${i + 1}`).innerHTML = val.value + val.suffix;
        }

        for (let i = 0; i < data.openField.length; i++) {
            $$(`#bottle${i + 1}`).style.opacity = data.openField[i] !== 0 ? 0.3 : 1;
            $$(`#bottle${i + 1}`).style.pointerEvents = data.openField[i] !== 0 ? 'none' : 'all';
            if (data.openField[i] !== 0) {
                $$(`#glyphWrapper${data.openField[i]}`).style.opacity = 0.3;
                reset = false;
            }
            if (reset) {
                for (let glyph of $$('.glyphs')) {
                    glyph.style.opacity = 1;
                }
            }
        }
    }

    function resize(width, height) {
        if (activeBonus[1]) { // if GNOME bonus
            document.querySelectorAll('.option-field').forEach((element) => {
                element.style.fontSize = `${width * 0.018}px`;
            });
            $$('#com-multiplier').style.fontSize = `${width * 0.055}px`;
            $$('#black-overlay').style.filter = `blur(${width * 0.09}px);`;
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
}();