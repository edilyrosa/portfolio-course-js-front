//TODO: pq no sirve en VERCEL? es probable deba hacer run build

import { PUBLIC_KEY, ID_TEMPLATE, ID_SERVICE } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    emailjs.init(PUBLIC_KEY);
    cargarProyectos();
    configurarFormulario();
    agregarValidacionTiempoReal();
});

async function cargarProyectos() {
    // Se esta muostrando el loader
    const container = document.getElementById('proyectos-container');
    const loader = document.getElementById("loader");
    try {
        const response = await fetch('./data.json');
        const data = await response.json();
        // Remueve el loader
        loader.remove();
        data.proyectos.forEach(proyecto => {
            const card = crearProyectoCard(proyecto);
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error al cargar los proyectos:', error);
    }
}

function crearProyectoCard(proyecto) {
    const card = document.createElement('div');
    card.className = 'proyecto-card shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl w-full max-w-sm';

    card.innerHTML = `
        <img src="${proyecto.imagen}" alt="${proyecto.titulo}" class="w-full h-48 object-cover">
        <div class="proyecto-info p-4 bg-white">
            <h3 class="text-lg font-semibold mb-2">${proyecto.titulo}</h3>
            <p class="text-sm text-gray-600">${proyecto.descripcion}</p>
            <a href="${proyecto.url}" target="_blank" class="text-blue-500 hover:underline mt-2 block"><i>${proyecto.url}</i></a>
        </div>
    `;

    return card;
}



function agregarValidacionTiempoReal() {
    const inputs = document.querySelectorAll('#contact-form input, #contact-form textarea');

    inputs.forEach(input => {
        input.addEventListener('input', () => validarCampo(input));
        input.addEventListener('blur', () => validarCampo(input));
    });
}

function validarCampo(input) {
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let isValid = true;
    let mensaje = '';

    if (input.id === 'name' && !nombreRegex.test(input.value)) {
        isValid = false;
        mensaje = 'Nombre inválido';
    } else if (input.id === 'email' && !emailRegex.test(input.value)) {
        isValid = false;
        mensaje = 'Email inválido';
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

function validarFormulario() {
    const nombre = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const mensaje = document.getElementById('message').value;

    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let isValid = true;

    if (!nombreRegex.test(nombre)) {
        mostrarError('name', 'Nombre inválido');
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

function configurarFormulario() {
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