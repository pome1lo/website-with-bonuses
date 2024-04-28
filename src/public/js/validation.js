(function () {
    'use strict'

    // Извлеките все формы, к которым мы хотим применить пользовательские стили проверки Bootstrap
    let forms = document.querySelectorAll('.needs-validation')

    // Перебирать их и предотвращать отправку
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()
