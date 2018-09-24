document.addEventListener('load', function () {
    for (let datepicker of $$('.datepicker')) {
        let picker = new Pikaday(
            {
                field: datepicker,
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
                    console.log(this.toString());
                }
            });
    }
});