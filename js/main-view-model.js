Zooble.MainViewModel = (function (dataProvider, Event, Participant, util) {
    return function (events) {
        var self = this;

        self.events = ko.observableArray(events);

        self.editedEvent = ko.observable();
        self.canEdit = ko.computed(function() {
            return util.all(self.events(), function(event) {
                return !event.isInEditMode();
            });
        });

        self.addEvent = function () {
            var newEvent = new Event();
            self.events.unshift(newEvent);
            self.editedEvent(newEvent);
        };

        self.eventByDateFilters = {
            all : function (event) {
                return true;
            },
            past : function (event) {
                return event.date() < new Date();
            },
            upcoming : function (event) {
                return event.date() > new Date();
            }
        };

        self.eventsByDateFilter = ko.observable("all");

        self.filteringTags = ko.observableArray([]);

        self.eventsFilters = ko.computed(function () {
            return {
                date : self.eventByDateFilters[self.eventsByDateFilter()],
                tags : function (event) {
                    if (self.filteringTags().length == 0) {
                        return true;
                    }
                    return util.all(self.filteringTags(), function (filteringTag) {
                        return ko.utils.arrayIndexOf(event.tags(), filteringTag) != -1;
                    });
                }
            };
        });

        self.filteredEvents = ko.computed(function () {
            var sortedEvents = self.events().sort(function (e1, e2) {
                return e2.creationDate() - e1.creationDate();
            });
            return ko.utils.arrayFilter(sortedEvents, function (event) {
                return util.all(self.eventsFilters(), function (eventFilter) {
                    return eventFilter(event);
                });
            });
        });

        self.allTags = ko.computed(function () {
            return self.filteredEvents().reduce(function (tags, event) {
                return ko.utils.arrayGetDistinctValues(tags.concat(event.tags())).sort();
            }, [])
        });

        self.eventTemplate = function (item) {
            return item.isInEditMode() ? "eventEditTemplate" : "eventDisplayTemplate";
        };

        self.editEvent = function (event) {
            event.isInEditMode(true);
        };

        self.removeEvent = function (event) {
            self.events.remove(event);
            dataProvider.removeEvent(event);
        };

        self.removeAllEvents = function () {
            self.events.removeAll();
            dataProvider.removeAllEvents();
        };
    }
})(Zooble.dataProvider, Zooble.Event, Zooble.Participant, Zooble.util);