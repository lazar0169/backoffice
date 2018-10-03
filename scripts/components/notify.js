let notify = (function () {
    // For how long toast will be visible
    let idleTime = 5;
    let timeout;
    let isBusy = false;

    let types = {
        0: 'info', // permanent info
        1: 'info',
        2: 'warrning',
        3: 'error'
    };

    let toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);

    on('notify', function (data) {
        clearTimeout(timeout);
        toast.classList.remove('show');

        setTimeout(() => {
            data = typeof data === 'object' ? data || {} : { message: data };
            data.type = data.type !== undefined ? data.type : 1;
            data.message = data.message || 'Simple toast banner';
            data.duration = data.type === 0 ? 86400 : data.duration || idleTime;
            toast.innerHTML = data.message;
            toast.className = `toast ${types[data.type]} show`;
            isBusy = true;

            timeout = setTimeout(function () {
                toast.classList.remove('show');
                isBusy = false;
            }, data.duration * 1000);
        }, isBusy ? 400 : 0);
    });
})();