window.addEventListener('load', function () {

    // Initialize all date pickers

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

    // Initialize all dropdowns

    for (let dropdown of $$('.select')) {
        dropdown.children[0].addEventListener('click', function () {
            dropdown.children[1].classList.toggle("hidden");
        });

        for (let option of dropdown.children[1].children) {
            option.addEventListener('click', function () {
                dropdown.children[0].innerHTML = option.innerHTML;
                dropdown.children[0].dataset.value = option.dataset.value;
            });
        }


        window.addEventListener('click', function (e) {
            if (!e.target.classList.contains('selected')) {
                dropdown.children[1].classList.add("hidden");
            }
        });
    }
});