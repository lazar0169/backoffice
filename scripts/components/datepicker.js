let datepicker = function () {
    // Initialize all date pickers
    on('load', function () {
        for (let picker of $$('.datepicker')) {
            let dp = new Pikaday({
                field: picker,
                firstDay: 1,
                minDate: new Date(2010, 1, 31),
                maxDate: new Date(),
                // yearRange: [2000, 2020],
                toString(date, format) {
                    // you should do formatting based on the passed format,
                    // but we will just return 'D.M.YYYY' for simplicity
                    const day = date.getDate();
                    const month = date.getMonth() + 1;
                    const year = date.getFullYear();
                    return `${day}.${month}.${year}`;
                },
                setDefaultDate: true,
                defaultDate: new Date(),
                onSelect: function () {
                    let dateArray = this.toString().split('.');
                    let apiString = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}T00:00:00.000Z`;
                    trigger(`date/${picker.id}`, apiString);
                    log(apiString);
                }
            });

            picker.setToday = () => {
                dp.setDate(new Date());
            }
        }
    });

}();