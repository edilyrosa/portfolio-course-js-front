import { PUBLIC_KEY, ID_TEMPLATE, ID_SERVICE } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    emailjs.init(PUBLIC_KEY);
    cargarProyectos();
    configurarFormulario();
    agregarValidacionTiempoReal();
});

async function cargarProyectos() { //^Cargar asincronamente la data mostrada en div #proyectos-container
    // el loader es un elemento que se esta mostrando de una.
    const container = document.getElementById('proyectos-container');
    const loader = document.getElementById("loader");
    try {
        const response = await fetch('./data.json');
        const data = await response.json();
        // Remueve el loader
        loader.remove();
        data.forEach(proyecto => {
            const card = crearProyectoCard(proyecto);
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error al cargar los proyectos:', error);
    }
}

function crearProyectoCard(proyecto) { //^Machote de la card con la informacion de un proyecto
    const card = document.createElement('div');
    card.className = 'bg-white p-4 m-4 rounded-lg shadow-lg hover:shadow-xl w-full max-w-[350px] min-w-[25%] min-h-[45vh] transition duration-300 transform hover:-translate-y-2';

    card.innerHTML = `
   
    <img src="${proyecto.imagen}" alt="${proyecto.titulo}" class="w-full object-fit">
            <h3 class='m-2 text-lg font-semibold'>${proyecto.titulo}</h3>
            <p class="text-sm text-gray-600 flex-grow">${proyecto.descripcion}</p>
            <a href="${proyecto.url}" target="_blank" class="text-blue-500 hover:underline mt-2 block"><i>${proyecto.url}</i></a>
    `;

    return card;
}


function agregarValidacionTiempoReal() { //^validamos los input y textarea en tiempo real
    const inputs = document.querySelectorAll('#contact-form input, #contact-form textarea');

    inputs.forEach(input => {
        input.addEventListener('input', () => validarCampo(input));
        input.addEventListener('blur', () => validarCampo(input));
    });
}

function validarCampo(input) {//^patrones de validaciones por entrada (que tenga blur o se le este typiando) y su mensajeria
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let isValid = true;
    let mensaje = '';

    if (input.id === 'name' && !nombreRegex.test(input.value)) {
        isValid = false;
        mensaje = 'Estas escribiendo un Nombre inválido';
    } else if (input.id === 'email' && !emailRegex.test(input.value)) {
        isValid = false;
        mensaje = 'Estas escribiendo un Email inválido';
    } else if (input.id === 'message' && input.value.length > 1000) {
        isValid = false;
        mensaje = 'El mensaje no debe exceder los 1000 caracteres.';
    }

    if (!isValid) {
        mostrarError(input.id, mensaje);
    } else {
        ocultarError(input.id);
    }
}

function mostrarError(campo, mensaje) {
    const input = document.getElementById(campo);
    const errorSpan = document.getElementById(`${campo}-error`);
    input.classList.add('error');
    errorSpan.textContent = mensaje;
    errorSpan.style.display = 'block';
}

function ocultarError(campo) {
    const input = document.getElementById(campo);
    const errorSpan = document.getElementById(`${campo}-error`);
    input.classList.remove('error');
    errorSpan.style.display = 'none';
}

function validarFormulario() {//^Booleano: Patrones, validamos y mensajeria de las entradas al evento "submit" NO realtime.
    const nombre = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const mensaje = document.getElementById('message').value;

    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let isValid = true;

    if (!nombreRegex.test(nombre)) {
        mostrarError('name', 'Nombre inválido');
        console.log('Nombre inválido');
        
        isValid = false;
    } else {
        ocultarError('name');
    }

    if (!emailRegex.test(email)) {
        mostrarError('email', 'Email inválido');
        isValid = false;
    } else {
        ocultarError('email');
    }

    if (mensaje.length > 1000) {
        mostrarError('message', 'El mensaje no debe exceder los 1000 caracteres.');
        isValid = false;
    } else {
        ocultarError('message');
    }

    return isValid;
}

function configurarFormulario() {//^submit del form mas validaciones del subtmit (no realtime)
    const form = document.getElementById('contact-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (validarFormulario()) {
            try {
                await enviarEmail();
                alert('Mensaje enviado con éxito!');
                form.reset();
            } catch (error) {
                console.error('Error al enviar el email:', error);
                alert('Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.');
            }
        }
    });
}
async function enviarEmail() {
    const templateParams = {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        message: `Nombre: ${document.getElementById('name').value}\nEmail: ${document.getElementById('email').value}\nMensaje: ${document.getElementById('message').value}`
    };

    try {
        const response = await emailjs.send(ID_SERVICE, ID_TEMPLATE, templateParams);
        if (response.status === 200) {
            console.log('Email enviado con éxito:', response);
            return true;
        } else {
            throw new Error('Error al enviar el email');
        }
    } catch (error) {
        console.error('Error al enviar el email:', error);
        throw error;
    }
}

