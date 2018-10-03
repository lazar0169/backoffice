let comm = (function () {
    const apiUrl = 'http://backofficewebapitest.com';

    function get(action, callback, body = {}) {
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
        fetch(apiUrl + action, {
            method: 'POST',
            // mode: "no-cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }).then(response => response.json()).then(function (json) {
            callback.success(json);
        }).catch((err) => {
            callback.fail(err);
            log(err, 2);
        });
    }


    /* ----------------------------------------- EVENTS ----------------------------------------- */



    /*************** LOGIN ***************/

    on('comm/login/credentials', function (data) {
        let action = '/Account/LogIn'
        get(action, {
            success: function (response) {
                data.success(response);
            },
            fail: function (err) {
                data.fail(err);
            }
        }, data.body);
    });

    on('comm/login/pin', function (data) {
        let action = '/Account/EnterPin'
        get(action, {
            success: function (response) {
                data.success(response);
            },
            fail: function (err) {
                data.fail(err);
            }
        }, data.body);
    });

    on('comm/login/logout', function (data) {
        let action = '/Account/LogOut'
        get(action, {
            success: function (response) {
                data.success(response);
            },
            fail: function (err) {
                data.fail(err);
            }
        }, data.body);
    });

    /*************** DASHBOARD ***************/

    // on('comm/dashboard/dashboard', function (data) {
    //     let action = '/Account/LogIn';
    //     get(action, {
    //         success: function (response) {
    //             data.success(response);
    //         },
    //         fail: function (err) {
    //             data.fail(err);
    //         }
    //     }, data.body);
    // });

    // on('comm/dashboard/jackpot', function (data) {
    //     let action = '/Account/LogIn';
    //     get(action, {
    //         success: function (response) {
    //             data.success(response);
    //         },
    //         fail: function (err) {
    //             data.fail(err);
    //         }
    //     }, data.body);
    // });

    // on('comm/dashboard/players', function (data) {
    //     let action = '/Account/LogIn';
    //     get(action, {
    //         success: function (response) {
    //             data.success(response);
    //         },
    //         fail: function (err) {
    //             data.fail(err);
    //         }
    //     }, data.body);
    // });

    /*************** STATISTIC ***************/

    // on('comm/statistic/summary', function (data) {
    //     let action = '/Account/LogIn';
    //     get(action, {
    //         success: function (response) {
    //             data.success(response);
    //         },
    //         fail: function (err) {
    //             data.fail(err);
    //         }
    //     }, data.body);
    // });

    // on('comm/statistic/games', function (data) {
    //     let action = '/Account/LogIn';
    //     get(action, {
    //         success: function (response) {
    //             data.success(response);
    //         },
    //         fail: function (err) {
    //             data.fail(err);
    //         }
    //     }, data.body);
    // });

    // on('comm/statistic/compared', function (data) {
    //     let action = '/Account/LogIn';
    //     get(action, {
    //         success: function (response) {
    //             data.success(response);
    //         },
    //         fail: function (err) {
    //             data.fail(err);
    //         }
    //     }, data.body);
    // });

    // on('comm/statistic/selection', function (data) {
    //     let action = '/Account/LogIn';
    //     get(action, {
    //         success: function (response) {
    //             data.success(response);
    //         },
    //         fail: function (err) {
    //             data.fail(err);
    //         }
    //     }, data.body);
    // });

    /*************** REPORTS ***************/

    // on('comm/reports', function (data) {
    //     let action = '/Account/LogIn';
    //     get(action, {
    //         success: function (response) {
    //             data.success(response);
    //         },
    //         fail: function (err) {
    //             data.fail(err);
    //         }
    //     }, data.body);
    // });

    /*************** ACCOUNTING ***************/

    // on('comm/accounting/accounting', function (data) {
    //     let action = '/Account/LogIn';
    //     get(action, {
    //         success: function (response) {
    //             data.success(response);
    //         },
    //         fail: function (err) {
    //             data.fail(err);
    //         }
    //     }, data.body);
    // });

    // on('comm/accounting/operators', function (data) {
    //     let action = '/Account/LogIn';
    //     get(action, {
    //         success: function (response) {
    //             data.success(response);
    //         },
    //         fail: function (err) {
    //             data.fail(err);
    //         }
    //     }, data.body);
    // });

    /*************** TRACKING ***************/

    // on('comm/tracking', function (data) {
    //     let action = '/Account/LogIn';
    //     get(action, {
    //         success: function (response) {
    //             data.success(response);
    //         },
    //         fail: function (err) {
    //             data.fail(err);
    //         }
    //     }, data.body);
    // });

    /*************** BONUSES ***************/

    // on('comm/bonuses', function (data) {
    //     let action = '/Account/LogIn';
    //     get(action, {
    //         success: function (response) {
    //             data.success(response);
    //         },
    //         fail: function (err) {
    //             data.fail(err);
    //         }
    //     }, data.body);
    // });

    /*************** CONFIGURATION ***************/

    // on('comm/configuration', function (data) {
    //     let action = '/Account/LogIn';
    //     get(action, {
    //         success: function (response) {
    //             data.success(response);
    //         },
    //         fail: function (err) {
    //             data.fail(err);
    //         }
    //     }, data.body);
    // });

})();