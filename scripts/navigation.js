const navigate = function () {
    let active = {
        page: 'dashboard',
        tab: 'main'
    };

    for (let tab of $$('.tab')) {
        tab.addEventListener('click', function () {
            tab.parentNode.parentNode.getElementsByClassName('mobile-select')[0].innerHTML = tab.innerHTML;
            to({ page: tab.dataset.page, tab: tab.dataset.tab });
        });
    }

    for (let page of $$('.nav-item')) {
        page.addEventListener('click', function () {
            to({ page: page.dataset.page, tab: page.dataset.tab });
        });
    }

    for (let selector of $$('.mobile-select')) {
        selector.addEventListener('click', function () {
            selector.parentNode.getElementsByClassName('tabs-wrapper')[0].classList.remove('hidden');
        });
    }

    for (let page of $$('.page-content')) {
        page.addEventListener('click', function () {
            page.parentNode.getElementsByClassName('tabs-wrapper')[0].classList.add('hidden');
        });
    }

    on('resize', function () {
        for (let navbar of $$('.navbar')) {
            navbar.classList[isMobile ? 'add' : 'remove']('mobile');
        }
    });

    function to(data) {
        $$(`#sidebar-${active.page}`).classList.remove('active');
        $$(`#sidebar-${data.page}`).classList.add('active');
        $$(`#${active.page}`).classList.remove('active');
        $$(`#${data.page}`).classList.add('active');
        $$(`#${active.page}-${active.tab}`).classList.remove('active');
        $$(`#${data.page}-${data.tab}`).classList.add('active');
        $$(`#${active.page}-navbar-${active.tab}`).classList.remove('active');
        $$(`#${data.page}-navbar-${data.tab}`).classList.add('active');
        $$(`#${data.page}`).getElementsByClassName('tabs-wrapper')[0].classList.add('hidden');
        $$(`#${data.page}`).getElementsByClassName('mobile-select')[0].innerHTML = $$(`#${data.page}-navbar-${data.tab}`).innerHTML;

        active.page = data.page;
        active.tab = data.tab;
    }

    on('navigation/change', to);
}();