let players = function () {


    on('players/main/loaded', function () {
        afterLoad(main);
    });

    on('players/groups/loaded', function () {

    });

    on('players/player/loaded', function () {
        afterLoad(tab);
    });

    const afterLoad = (tab) => {
        addLoader($$(`#players-navbar-${tab}`));
        trigger('comm/accounting/operators/get', {
            success: function (response) {
                if (response.responseCode === message.codes.success) {

                    // Prevent operator change
                    // if (roles.getRole() === 'Manager') {
                    //     response = {
                    //         responseCode: 1000
                    //     };
                    // }

                    getOperators(response.result, tab);
                } else {
                    trigger('message', response.responseCode);
                }
                removeLoader($$(`#players-navbar-${tab}`));
            },
            fail: function () {
                trigger('message', response.responseCode);
                removeLoader($$(`#players-navbar-${tab}`));
            }
        });
    };

    const getOperators = (data, tab) => {
        clearElement($$(`#players-${tab}-operators-list`));
        let operatorsDropdown = dropdown.generate(data, `players-${tab}-operators-list`, 'Select operator');
        $$(`#players-${tab}-operators-list-wrapper`).appendChild(operatorsDropdown);
        if (!data) $$(`#players-${tab}-operators-list-wrapper`).style.display = 'none';

        on(`players-${tab}-operators-list/selected`, function (value) {
            addLoader($$(`#players-navbar-${tab}`));
            trigger('comm/accounting/portals/get', {
                body: {
                    id: value
                },
                success: function (response) {
                    if (response.responseCode === message.codes.success) {
                        getPortals(response.result, tab);
                    } else {
                        trigger('message', response.responseCode);
                    }
                    removeLoader($$(`#players-navbar-${tab}`));
                },
                fail: function () {
                    trigger('message', response.responseCode);
                    removeLoader($$(`#players-navbar-${tab}`));
                }
            });
        });

        // Prevent operator change
        // if (roles.getRole() === 'Manager') {
        //     trigger('accounting-operators-list/selected', 0);
        // }
    };

    const getPortals = (data, tab) => {
        clearElement($$(`#players-${tab}-portals-list`));
        let portalsDropdown = dropdown.generate(data, `players-${tab}-portals-list`, 'Select portal');
        $$(`#players-${tab}-portals-list-wrapper`).appendChild(portalsDropdown);
        if (!data) $$(`#players-${tab}-portals-list-wrapper`).style.display = 'none';
        $$(`#players-get-${tab}`).classList.remove('hidden');
    };

}();