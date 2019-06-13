let datepicker = function () {
    // Initialize all date pickers
    on('load', function () {
        for (let picker of $$('.datepicker')) {
            let isRange = picker.parentElement.tagName === 'FIELDSET';
            let firstPicker;
            let secondPicker;
            if (isRange) {
                firstPicker = picker.parentElement.getElementsByClassName('datepicker')[0];
                secondPicker = picker.parentElement.getElementsByClassName('datepicker')[1];
            }
            picker.isRangeSet = false;
            let dp = new Pikaday({
                field: picker,
                firstDay: 1,
                minDate: new Date(2010, 1, 1),
                maxDate: new Date(),
                format: 'DD.MM.YYYY',
                toString(date, format) {
                    let day = date.getDate();
                    let month = date.getMonth() + 1;
                    let year = date.getFullYear();
                    month = month < 10 ? '0' + month : month;
                    day = day < 10 ? '0' + day : day;
                    return format.replace('YYYY', year).replace('MM', month).replace('DD', day);
                },
                setDefaultDate: true,
                defaultDate: new Date(),
                onSelect: function (date) {
                    trigger(`date/${picker.id}`, this.toString('YYYY-MM-DDT00:00:00.000Z'));
                    if (isRange) {
                        setRange();
                    }
                    log(this.toString());
                }
            });

            picker.self = dp;

            picker.getDate = () => {
                return dp.toString('YYYY-MM-DDT00:00:00.000Z');
            };

            picker.setDate = (date) => {
                dp.setDate(new Date(date));
                dp.gotoDate(new Date(date));
            };

            picker.setMax = (date) => {
                dp.setMaxDate(new Date(date));
            };

            picker.setStart = (date) => {
                dp.setStartRange(new Date(date));
            }
            picker.setEnd = (date) => {
                dp.setEndRange(new Date(date));
            }

            picker.setMin = (date) => {
                dp.setMinDate(new Date(date));
            };

            picker.setToday = () => {
                dp.setDate(new Date());
            };

            picker.reset = () => {
                dp.setMinDate(new Date('2010-01-01T00:00:00Z'));
                dp.setDate(new Date());
                dp.setStartRange(new Date());
                dp.setEndRange(new Date());
                picker.isRangeSet = false;
            };

            function setRange() {
                let isStart = picker.id === picker.parentElement.getElementsByClassName('datepicker')[0].id;
                if (isStart) {
                    firstPicker.setStart(picker.getDate());
                    secondPicker.setStart(picker.getDate());
                    if (!secondPicker.isRangeSet) {
                        secondPicker.setDate(firstPicker.getDate());
                    }
                } else {
                    firstPicker.setEnd(picker.getDate());
                    secondPicker.setEnd(picker.getDate());
                    secondPicker.isRangeSet = true;
                }
            }
        }
    });

}();