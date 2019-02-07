let loading = function () {
    let isLoaded = false;
    let passed = 0;
    let conditions = {
        'comm/user/role': false,
        'comm/configuration/profile/get': false,
        'comm/dashboard/get': false,
        'comm/currency/getAll': false,
        'comm/currency/get': false
    }
    let total = Object.keys(conditions).length;

    function validate(action) {
        if (conditions[action] !== undefined) {
            conditions[action] = true;
            passed++
            let percentage = Math.ceil(Number(passed / total) * 100);
            $$('#loading-precentage').innerHTML = `LOADING &nbsp;&nbsp; ${percentage}%`;
            if (_config.development) {
                let log = document.createElement('pre');
                log.innerHTML = `Processing: ${action}`;
                $$('#loading-log').appendChild(log);
            }
        }
        for (let condition in conditions) {
            if (!conditions[condition]) {
                return false;
            }
        }
        loaded();
    }

    function loaded() {
        if (isLoaded) return;
        $$('#loading').classList.add('hidden');
        $$('#loading-precentage').innerHTML = 'LOADING &nbsp;&nbsp; 0%';
        $$('#loading-log').innerHTML = '';

        let user = $$('#sidebar-user').children[1].innerText.split(' ')[0];
        trigger('message', [message.codes.welcome, user]);
        isLoaded = true;
    }

    return {
        validate: validate
    };
}();