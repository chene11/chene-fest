/* ---------- Identificar al invitado desde el link ---------- */
const parametros = new URLSearchParams(window.location.search);
const slugInvitado = parametros.get('invitado');
const invitado = INVITADOS.find(i => i.slug === slugInvitado);

const saludo = document.getElementById('saludo');
const main = document.querySelector('main');

if (!invitado) {
    // Enlace no reconocido: se oculta toda la invitación
    saludo.textContent = 'Invitación no reconocida';
    main.innerHTML = '<p style="text-align:center;padding:40px 20px;">Este enlace no corresponde a ninguna invitación. Si crees que es un error, contacta directamente a Esnel.</p>';
} else {
    saludo.textContent = `¡Hola, ${invitado.nombre}! Esta es tu invitación personal 🎉`;

    /* ---------- Cuenta regresiva ---------- */
    const fechaEvento = new Date(2026, 9, 24, 15, 0, 0); // 24 de octubre 2026, 3:00 PM

    function actualizarContador() {
        const ahora = new Date();
        const diferencia = fechaEvento - ahora;

        if (diferencia <= 0) {
            document.getElementById('dias').textContent = '00';
            document.getElementById('horas').textContent = '00';
            document.getElementById('minutos').textContent = '00';
            document.getElementById('segundos').textContent = '00';
            clearInterval(intervalo);
            return;
        }

        const segundosTotales = Math.floor(diferencia / 1000);
        const dias = Math.floor(segundosTotales / 86400);
        const horas = Math.floor((segundosTotales % 86400) / 3600);
        const minutos = Math.floor((segundosTotales % 3600) / 60);
        const segundos = segundosTotales % 60;

        document.getElementById('dias').textContent = String(dias).padStart(2, '0');
        document.getElementById('horas').textContent = String(horas).padStart(2, '0');
        document.getElementById('minutos').textContent = String(minutos).padStart(2, '0');
        document.getElementById('segundos').textContent = String(segundos).padStart(2, '0');
    }

    actualizarContador();
    const intervalo = setInterval(actualizarContador, 1000);

    /* ---------- Mostrar/ocultar acompañantes ---------- */
    const radios = document.querySelectorAll('input[name="asistencia"]');
    const bloqueAcompanantes = document.getElementById('bloque-acompanantes');
    const inputAcompanantes = document.getElementById('acompanantes');
    const bloqueNombres = document.getElementById('bloque-nombres');

    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'si' && radio.checked) {
                bloqueAcompanantes.classList.add('visible');
            } else if (radio.value === 'no' && radio.checked) {
                bloqueAcompanantes.classList.remove('visible');
                inputAcompanantes.value = 0;
                bloqueNombres.innerHTML = '';
            }
        });
    });

    inputAcompanantes.addEventListener('input', generarCamposNombres);

    function generarCamposNombres() {
        const cantidad = parseInt(inputAcompanantes.value) || 0;
        bloqueNombres.innerHTML = '';
        for (let i = 0; i < cantidad; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'nombre-acompanante';
            input.placeholder = `Nombre del acompañante ${i + 1}`;
            bloqueNombres.appendChild(input);
        }
    }

    /* ---------- Envío por WhatsApp ---------- */
    const NUMERO_WHATSAPP = "529141052712"; // ⚠️ cámbialo por tu número real

    document.getElementById('form-rsvp').addEventListener('submit', function (e) {
        e.preventDefault();

        const asistencia = document.querySelector('input[name="asistencia"]:checked').value;
        const nombresAcompanantes = Array.from(document.querySelectorAll('.nombre-acompanante'))
            .map(input => input.value.trim())
            .filter(Boolean);

        let mensaje = `Soy ${invitado.nombre}. `;
        if (asistencia === 'si') {
            mensaje += '¡Confirmo mi asistencia a Chene Fest! 🎉';
            mensaje += nombresAcompanantes.length > 0
                ? ` Voy acompañado de: ${nombresAcompanantes.join(', ')}.`
                : ' Voy solo/a.';
        } else {
            mensaje += 'Este año no podré ir a Chene Fest, pero ahí estaré con ustedes en espíritu 💛';
        }

        const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');
    });
}