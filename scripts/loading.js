let loading = function () {
    let isLoaded = false;
    let conditions = {
        'comm/user/role': false,
        'comm/configuration/profile/get': false,
        'comm/dashboard/get': false,
        'comm/currency/get': false
    }

    function validate(action) {
        if (conditions[action] !== undefined) {
            conditions[action] = true;
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
        isLoaded = true;
    }

    return {
        validate: validate
    };
}();