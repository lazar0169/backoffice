let comm = (function () {
    const apiUrl = 'https://jsonplaceholder.typicode.com/todos/1';

    function get(callback, params = {}) {
        /* PARAMS:

        - method:         The request method, e.g., GET, POST.
        - headers:        Any headers you want to add to your request, contained within a Headers object or an object literal with ByteString values.
        - body:           Any body that you want to add to your request: this can be a Blob, BufferSource, FormData, URLSearchParams, or USVString object. Note that a request using the GET or HEAD method cannot have a body.
        - mode:           The mode you want to use for the request, e.g., cors, no-cors, or same-origin.
        - credentials:    The request credentials you want to use for the request: omit, same-origin, or include. To automatically send cookies for the current domain, this option must be provided. Starting with Chrome 50, this property also takes a FederatedCredential instance or a PasswordCredential instance.
        - cache:          The cache mode you want to use for the request.
        - redirect:       The redirect mode to use: follow (automatically follow redirects), error (abort with an error if a redirect occurs), or manual (handle redirects manually). In Chrome the default is follow (before Chrome 47 it defaulted to manual).
        - referrer:       A USVString specifying no-referrer, client, or a URL. The default is client.
        - referrerPolicy: Specifies the value of the referer HTTP header. May be one of no-referrer, no-referrer-when-downgrade, origin, origin-when-cross-origin, unsafe-url.
        - integrity:      Contains the subresource integrity value of the request (e.g., sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=).
        - keepalive:      The keepalive option can be used to allow the request to outlive the page. Fetch with the keepalive flag is a replacement for the Navigator.sendBeacon() API. 
        - signal:         An AbortSignal object instance; allows you to communicate with a fetch request and abort it if desired via an AbortController.
        */
        fetch(apiUrl, params).then(response => response.json()).then(function (json) {
            callback(json);
        }).catch((err) => {
            log(err, 2);
        });
    }


    /* ----------------------------------------- EVENTS ----------------------------------------- */



    /*************** LOGIN ***************/

    on('comm/login', function (data) {
        get(function (response) {
            // TODO
        }, data);
    });

    /*************** DASHBOARD ***************/

    on('comm/dashboard/dashboard', function (data) {
        get(function (response) {
            // TODO
        }, data);
    });

    on('comm/dashboard/jackpot', function (data) {
        get(function (response) {
            // TODO
        }, data);
    });

    on('comm/dashboard/players', function (data) {
        get(function (response) {
            // TODO
        }, data);
    });

    /*************** STATISTIC ***************/

    on('comm/statistic/summary', function (data) {
        get(function (response) {
            // TODO
        }, data);
    });

    on('comm/statistic/games', function (data) {
        get(function (response) {
            // TODO
        }, data);
    });

    on('comm/statistic/compared', function (data) {
        get(function (response) {
            // TODO
        }, data);
    });

    on('comm/statistic/selection', function (data) {
        get(function (response) {
            // TODO
        }, data);
    });

    /*************** REPORTS ***************/

    on('comm/reports', function (data) {
        get(function (response) {
            // TODO
        }, data);
    });

    /*************** ACCOUNTING ***************/

    on('comm/accounting/accounting', function (data) {
        get(function (response) {
            // TODO
        }, data);
    });

    on('comm/accounting/operators', function (data) {
        get(function (response) {
            // TODO
        }, data);
    });

    /*************** TRACKING ***************/

    on('comm/tracking', function (data) {
        get(function (response) {
            // TODO
        }, data);
    });

    /*************** BONUSES ***************/

    on('comm/bonuses', function (data) {
        get(function (response) {
            // TODO
        }, data);
    });

    /*************** CONFIGURATION ***************/

    on('comm/configuration', function (data) {
        get(function (response) {
            // TODO
        }, data);
    });

})();