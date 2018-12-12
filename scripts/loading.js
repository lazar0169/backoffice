let loading = function () {
    let isLoaded = false;
    let passed = 0;
    let conditions = {
        'comm/user/role': false,
        'comm/configuration/profile/get': false,
        'comm/dashboard/get': false,
        'comm/currency/get': false
    }
    let total = Object.keys(conditions).length;

    function validate(action) {
        if (conditions[action] !== undefined) {
            conditions[action] = true;
            passed++
            $$('#loading-precentage').innerHTML = `LOADING &nbsp;&nbsp; ${Math.ceil((total / passed) * 100)}%`;
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
        isLoaded = true;
    }

    return {
        validate: validate
    };
}();