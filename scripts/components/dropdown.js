let dropdown = function () {
    // Initialize all dropdowns
    on('load', function () {
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
}();