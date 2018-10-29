let events = {};

function on(event, callback, count = Number.MAX_SAFE_INTEGER) {
    if (!events[event]) { events[event] = {}; }
    let id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    events[event][id] = {
        callback: callback,
        count: count
    };
    return id;
}

function off(id) {
    for (let event in events) {
        if (events[event][id]) {
            delete events[event][id];
            return true;
        }
    }
    return false;
}

function trigger(event, ...data) {
    let params = data.length === 1 ? data[0] : data;
    if (!events[event]) { return; }
    for (let id in events[event]) {
        if (events[event][id].count > 0) {
            events[event][id].callback(params);
            if (events[event][id].count > 1) {
                events[event][id].count--;
            }
        } else {
            delete events[event][id];
        }
    }
    if (Object.keys(events[event]).length === 0) {
        delete events[event];
    }
}