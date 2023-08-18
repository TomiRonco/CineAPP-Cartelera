(function () {
    emailjs.init('IHJR_LzQ6ZLe09SZ8');
})();

const form = document.querySelector('.form');
const mensajeEnviado = document.getElementById('mensaje-enviado');
const mensajeError = document.getElementById('mensaje-error');

form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const name = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('mensaje').value;

    // Validar que los campos estén rellenados
    if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
        mensajeError.textContent = 'Por favor, completa todos los campos.';
        mensajeError.style.display = 'block';
        return;
    }

    // Enviar el correo electrónico
    emailjs.send('service_buib11c', 'template_0xpvxun', {
        from_name: name,
        from_email: email,
        message: message
    })
        .then(function () {
            // Éxito: el correo electrónico se envió correctamente
            mensajeEnviado.textContent = 'El mensaje ha sido enviado correctamente.';
            mensajeEnviado.style.display = 'block';
            form.reset();

            // Ocultar el mensaje después de 2.5 segundos
            setTimeout(function () {
                mensajeEnviado.style.display = 'none';
            }, 2500);

            // Ocultar el mensaje de error si estaba visible
            mensajeError.style.display = 'none';
        }, function (error) {
            // Error: el correo electrónico no se pudo enviar
            mensajeError.textContent = 'Ocurrió un error al enviar el mensaje. Por favor, inténtalo nuevamente.';
            mensajeError.style.display = 'block';
            console.error('Error al enviar el correo electrónico:', error);

            // Ocultar el mensaje después de 2.5 segundos
            setTimeout(function () {
                mensajeError.style.display = 'none';
            }, 2500);

            // Ocultar el mensaje de enviado si estaba visible
            mensajeEnviado.style.display = 'none';
        });
});
