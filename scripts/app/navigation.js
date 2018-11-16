const navigation = function () {
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
            selector.parentNode.getElementsByClassName('tabs-wrapper')[0].classList.toggle('hidden');
        });
    }

    for (let page of $$('.page-content')) {
        page.addEventListener('click', function () {
            page.parentNode.getElementsByClassName('tabs-wrapper')[0].classList.add('hidden');
        });
    }

    for (let logo of $$('.logo')) {
        logo.addEventListener('click', function () {
            $$('#sidebar').classList.add('active');
        });
    }

    $$('#sidebar-logout').addEventListener('click', function () {
        addLoader($$('#sidebar-logout'));
        trigger('comm/login/logout', {
            success: function (response) {
                removeLoader($$('#sidebar-logout'));
                if (response.responseCode === message.codes.success) {
                    location.href = getLocation();
                } else {
                    trigger('message', response.responseCode);
                }
            },
            fail: function () {
                removeLoader($$('#sidebar-logout'));
            }
        });
    });

    $$('#logo').addEventListener('click', function () {
        if (isMobile) {
            $$('#sidebar').classList.remove('active');
        }
    });

    on('resize', function () {
        document.body.classList[isMobile ? 'add' : 'remove']('mobile');
    });

    on('load', function () {
        trigger(`dashboard/loaded`);
    });

    function to(data) {
        if (!data.page || !data.tab) return;
        $$(`#sidebar-${active.page}`).classList.remove('active');
        $$(`#sidebar-${data.page}`).classList.add('active');
        $$(`#${active.page}`).classList.remove('active');
        $$(`#${data.page}`).classList.add('active');
        $$(`#${active.page}-${active.tab}`).classList.remove('active');
        $$(`#${data.page}-${data.tab}`).classList.add('active');
        $$(`#${active.page}-navbar-${active.tab}`).classList.remove('active');
        $$(`#${data.page}-navbar-${data.tab}`).classList.add('active');
        if (isMobile) {
            $$('#sidebar').classList.remove('active');
        }
        $$(`#${data.page}`).getElementsByClassName('tabs-wrapper')[0].classList.add('hidden');
        $$(`#${data.page}`).getElementsByClassName('mobile-select')[0].innerHTML = $$(`#${data.page}-navbar-${data.tab}`).innerHTML;

        if (active.page !== data.page) {
            trigger(`${data.page}/loaded`);
            log(`${data.page}/loaded`);
        }
        active.page = data.page;
        active.tab = data.tab;
        log(`${data.page}/${data.tab}/loaded`);
        trigger(`${data.page}/${data.tab}/loaded`);
    }

    on('navigation/change', to);
}();