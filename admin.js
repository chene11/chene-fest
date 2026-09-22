const INVITADOS = [
    { slug: "maria-luisa",     nombre: "María Luisa Aparicio Subiaur" },
    { slug: "luis-antonio",    nombre: "Luis Antonio Arias Orduño" },
    { slug: "karla-rubi",      nombre: "Karla Rubí Arellano" },
    { slug: "luis-ignacio",    nombre: "Luis Ignacio Castillo Mirabal" },
    { slug: "diego-alexander", nombre: "Diego Alexander Alamilla Gómez" },
];

const urlBase = window.location.origin + window.location.pathname.replace('admin.html', 'index.html');
const contenedor = document.getElementById('lista-invitados');

INVITADOS.forEach(invitado => {
    const link = `${urlBase}?invitado=${invitado.slug}`;

    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta-invitado';

    // Div donde la librería va a dibujar el QR (ya no un canvas manual)
    const qrDiv = document.createElement('div');
    qrDiv.className = 'qr-box';
    tarjeta.appendChild(qrDiv);

    const nombre = document.createElement('p');
    nombre.className = 'nombre-invitado';
    nombre.textContent = invitado.nombre;
    tarjeta.appendChild(nombre);

    const enlace = document.createElement('a');
    enlace.href = link;
    enlace.textContent = link;
    enlace.target = '_blank';
    enlace.className = 'enlace-invitado';
    tarjeta.appendChild(enlace);

    const botonCopiar = document.createElement('button');
    botonCopiar.textContent = 'Copiar enlace';
    botonCopiar.className = 'boton-copiar';
    botonCopiar.addEventListener('click', () => {
        navigator.clipboard.writeText(link);
        botonCopiar.textContent = '¡Copiado!';
        setTimeout(() => botonCopiar.textContent = 'Copiar enlace', 1500);
    });
    tarjeta.appendChild(botonCopiar);

    contenedor.appendChild(tarjeta);

    // Genera el QR dentro de qrDiv
    try {
        new QRCode(qrDiv, {
            text: link,
            width: 180,
            height: 180,
        });
    } catch (err) {
        console.error('Error generando QR para', invitado.nombre, err);
    }
});