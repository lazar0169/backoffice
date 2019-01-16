let roles = function () {
    let role;
    let base = {
        'Admin': _config.development ? [] : [
            '#configuration-actions',
            '#configuration-roles',
        ],
        'Manager': [
            '#sidebar-operators',
            '#accounting-navbar-setup',
            '#accounting-reports-download-excel',
            '#accounting-reports-bonus-rate',
            '#accounting-reports-deduction',
            '#accounting-reports-reduction',
            '#configuration-actions',
            '#configuration-roles',
        ],
        'Accounting': [
            '#sidebar-operators',
            '#accounting-navbar-setup',
            '#configuration-actions',
            '#configuration-roles',
        ]
    };

    trigger('comm/user/role', {
        success: function (response) {
            if (response.responseCode === message.codes.success) {
                role = response.result.toLowerCase();
                // role = 'Manager';
                if (!base[role]) role = 'Admin';
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