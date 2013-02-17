Zooble.dataProvider = (function (JSON, localStorage, entityJsonBuilder) {
    var eventsKey = "Zooble.events";
    var eventsAutoincrementKey = "Zooble.events.autoincrement";

    function getEvents() {
        return JSON.parse(localStorage.getItem(eventsKey));
    }

    function getEvent(eventsData, event) {
        return ko.utils.arrayFirst(eventsData, function (storedEvent) {
            return storedEvent.id === event.id;
        });
    }

    function saveEvents(events) {
        localStorage.setItem(eventsKey, JSON.stringify(ko.mapping.toJS(events)));
    }

    return {
        loadEvents : function () {
            var eventsData = getEvents();
            if (!eventsData) {
                return null;
            }
            var events = [];
            for (var i = 0; i < eventsData.length; i++) {
                events.push(entityJsonBuilder.build("Event", eventsData[i]))
            }
            return events;
        },
        editEvent : function (event) {
            var eventsData = getEvents();
            var storedEvent = getEvent(eventsData, event);
            ko.utils.arrayRemoveItem(eventsData, storedEvent);
            eventsData.push(ko.mapping.toJS(event));
            saveEvents(eventsData);
        },
        saveEvent : function (event) {
            var eventsData = getEvents() || [];
            eventsData.push(ko.mapping.toJS(event));
            saveEvents(eventsData);
        },
        saveEvents : function (events) {
            saveEvents(events);
        },
        removeEvent : function (event) {
            var eventsData = getEvents();
            var storedEvent = getEvent(eventsData, event);
            ko.utils.arrayRemoveItem(eventsData, storedEvent);
            saveEvents(eventsData);
        },
        removeAllEvents : function () {
            localStorage.removeItem(eventsKey);
        }
    }
})(JSON, localStorage, Zooble.entityJsonBuilder);