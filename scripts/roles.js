let roles = function () {
    let role;
    let base = {
        'admin': _config.development ? [] : [
            '#configuration-actions',
            '#configuration-roles',
        ],
        'manager': [
            '#accounting-reports-bonus-rate',
            '#accounting-reports-deduction',
            '#accounting-reports-reduction',
            '#configuration-actions',
            '#configuration-roles',
        ]
    };

    trigger('comm/user/role', {
        success: function (response) {
            if (response.responseCode === message.codes.success) {
                role = response.result.toLowerCase();
                // role = 'manager';
                if (!base[role]) role = 'admin';
                setupUiBasedOnRole();
            }
        },
        fail: function () { }
    });

    function setupUiBasedOnRole() {
        for (let element of base[role]) {
            $$(element).classList.add('prevented');
        }
    }

    return {
        getRole: function () {
            return role;
        }
    };

}();