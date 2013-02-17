function MyViewModel() {
    this.price = ko.observable(25.99);

    this.formattedPrice = ko.computed({
        read : function () {
            return '$' + this.price();
        },
        write : function (value) {
            // Strip out unwanted characters, parse as float, then write the raw data back to the underlying "price" observable
            value = parseFloat(value.replace(/[^\.\d]/g, ""));
            this.price(isNaN(value) ? 0 : value); // Write to underlying storage
        },
        owner : this
    });
}

ko.applyBindings(new MyViewModel());