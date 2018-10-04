let comm = (function () {
    const apiUrl = 'http://backofficewebapitest.com';

    const actions = {
        // Login
        'comm/login/credentials': '/Account/LogIn',
        'comm/login/pin': '/Account/EnterPin',
        'comm/login/logout': '/Account/LogOut',
        // Configuration
        'comm/configuration/actions/create': '/Action/CreateAction',
        'comm/configuration/roles/create': '/Role/CreateRoles',
        'comm/configuration/users/create': '/User/CreateUsers',
        'comm/configuration/actions/get': '/Action/GetActions',
        'comm/configuration/roles/get': '/Role/GetRoles',
        'comm/configuration/users/get': '/User/GetUsers',
        'comm/configuration/actions/remove': '/Action/RemoveAction',
        'comm/configuration/roles/remove': '/Role/RemoveRoles',
        'comm/configuration/users/remove': '/User/RemoveUsers',
    };

    Object.freeze(actions);

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
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'credentials': 'include'
            },
            body: JSON.stringify(body)
        }).then(function (response) {
            // log(response.headers.get("content-type"));
            return response.json();
        }).then(function (json) {
            callback.success(json);
        }).catch((err) => {
            callback.fail(err);
            log(err, 2);
        });
    }

    function connect(action, data) {
        get(action, {
            success: function (response) {
                data.success(response);
            },
            fail: function (err) {
                data.fail(err);
            }
        }, data.body);
    }

    for (let action in actions) {
        on(action, function (data) {
            connect(actions[action], data);
        });
    }

})();