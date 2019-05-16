let datepicker = function () {
    // Initialize all date pickers
    on('load', function () {
        for (let picker of $$('.datepicker')) {
            let dp = new Pikaday({
                field: picker,
                firstDay: 1,
                minDate: new Date(2010, 1, 1),
                maxDate: new Date(),
                format: 'DD.MM.YYYY',
                // yearRange: [2000, 2020],
                toString(date, format) {
                    let day = date.getDate();
                    let month = date.getMonth() + 1;
                    let year = date.getFullYear();

                    month = month < 10 ? '0' + month : month;
                    day = day < 10 ? '0' + day : day;

                    // return `${year}-${month}-${day}T00:00:00.000Z`;
                    return format.replace('YYYY', year).replace('MM', month).replace('DD', day);
                },
                setDefaultDate: true,
                defaultDate: new Date(),
                onSelect: function (date) {
                    trigger(`date/${picker.id}`, this.toString('YYYY-MM-DDT00:00:00.000Z'));
                    log(this.toString());
                }
            });

            picker.getDate = () => {
                return dp.toString('YYYY-MM-DDT00:00:00.000Z');
            };

            picker.setDate = (date) => {
                dp.setDate(new Date(date));
                dp.gotoDate(new Date(date));
            };

            picker.reset = () => {
                dp.setMinDate(new Date('2010-01-01T00:00:00Z'));
            };

            picker.setMax = (date) => {
                dp.setMaxDate(new Date(date));
            };

            picker.setMin = (date) => {
                dp.setMinDate(new Date(date));
            };

            picker.setToday = () => {
                dp.setDate(new Date());
            };
        }
    });

}();