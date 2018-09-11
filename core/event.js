let events = {};

function on(event, callback, count = Number.MAX_SAFE_INTEGER) {
    if (!events[event]) { events[event] = []; }
    events[event].push({
        callback: callback,
        count: count
    });
}

function trigger(event, data) {
    if (!events[event]) { return; }
    let garbageCollector = [];
    for (let eventData of events[event]) {
        if (eventData.count > 0) {
            eventData.callback(data);
            if (eventData.count > 1) {
                eventData.count--;
            } else {
                garbageCollector.push(eventData);
            }
        } else {
            garbageCollector.push(eventData);
        }
    }
    for (let eventData of garbageCollector) {
        events[event].splice(events[event].indexOf(eventData), 1);
    }
    if (events[event].length === 0) {
        delete events[event];
    }
}