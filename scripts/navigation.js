const navigate = function () {

    // let pages = {
    //     'dashboard': ['main', 'jackpots', 'new-players']
    // };

    let active = {
        page: 'dashboard',
        tab: 'main'
    };

    for (let tab of $$('.tab')) {
        tab.addEventListener('click', function () {
            to({ page: tab.dataset.page, tab: tab.dataset.tab });
        });
    }

    for (let page of $$('.nav-item')) {
        page.addEventListener('click', function () {
            to({ page: page.dataset.page, tab: page.dataset.tab });
        });
    }

    function to(data) {
        $$(`#sidebar-${active.page}`).classList.remove('active');
        $$(`#sidebar-${data.page}`).classList.add('active');
        $$(`#${active.page}`).classList.remove('active');
        $$(`#${data.page}`).classList.add('active');
        $$(`#${active.page}-${active.tab}`).classList.remove('active');
        $$(`#${data.page}-${data.tab}`).classList.add('active');
        $$(`#${active.page}-navbar-${active.tab}`).classList.remove('active');
        $$(`#${data.page}-navbar-${data.tab}`).classList.add('active');

        active.page = data.page;
        active.tab = data.tab;
    }

    on('navigation/change', to);
}();