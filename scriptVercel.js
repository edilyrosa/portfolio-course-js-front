let PUBLIC_KEY, ID_TEMPLATE, ID_SERVICE;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Obtén las variables de entorno desde el endpoint de Vercel
        const response = await fetch('/api/env');
        const env = await response.json();
        
        // PUBLIC_KEY = env.PUBLIC_KEY;
        // ID_TEMPLATE = env.ID_TEMPLATE;
        // ID_SERVICE = env.ID_SERVICE;

        const PUBLIC_KEY = "4Y77DFjgko8rvBzwf";
        const ID_TEMPLATE = "template_a4yygd8";
       const ID_SERVICE = "service_iuya47f";
       
        
        // Inicializa emailjs con la clave pública y setea los templates y servicios
        emailjs.init(PUBLIC_KEY);
        cargarProyectos();
        configurarFormulario();
        agregarValidacionTiempoReal();
    } catch (error) {
        console.error('Error al cargar las variables de entorno:', error);
        alert('Hubo un problema al cargar las configuraciones. Por favor, intenta más tarde.');
    }
});

async function cargarProyectos() {
    const container = document.getElementById('proyectos-container');
    const loader = document.getElementById("loader");
    try {
        const response = await fetch('./data.json');
        const data = await response.json();
        loader.remove();
        data.forEach(proyecto => {
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

/* 
EXPLICACION
Aquí está el código completo de tu archivo script.js, modificado para manejar las variables de entorno usando una 
función API en Vercel (/api/env.js) y JavaScript vanilla. Esto asegura que las claves se obtengan dinámicamente desde 
el backend en tiempo de ejecución: 

¿Es seguro este enfoque?
Exposición limitada: Aunque las variables estarán accesibles en el cliente, el acceso está limitado al endpoint /api/env, y puedes controlar qué valores envías desde ahí.
Recomendación: Para claves altamente sensibles, este método no es ideal, ya que cualquier dato enviado al cliente puede ser inspeccionado desde DevTools.
!     https://portfolio-course-js-front.vercel.app/api/env

Ventajas\ 
Sin librerías externas: Este enfoque funciona con JavaScript vanilla y no requiere herramientas adicionales.
Compatibilidad con Vercel: Utiliza variables de entorno del servidor de manera directa.
Conclusión
Este método te permite usar las variables de entorno en un proyecto de JavaScript vanilla sin depender de librerías como dotenv ni de herramientas como Webpack. Sin embargo, siempre evalúa qué tan sensibles son las variables y considera mover cualquier lógica crítica al backend si es necesario.

Usando el archivo api/env.js con JavaScript vanilla
Supongamos que has configurado la función serverless api/env.js en Vercel. Puedes hacer una solicitud fetch desde tu código JavaScript vanilla para obtener las variables de entorno:

1. Código del servidor (api/env.js):
Este código ya lo tienes configurado:

javascript
Copy code
export default function handler(req, res) {
    res.status(200).json({
        PUBLIC_KEY: process.env.PUBLIC_KEY,
        ID_TEMPLATE: process.env.ID_TEMPLATE,
        ID_SERVICE: process.env.ID_SERVICE
    });
}
2. Código en tu frontend (script.js):
Usa fetch para consumir la API y cargar las variables:

javascript
Copy code
let PUBLIC_KEY, ID_TEMPLATE, ID_SERVICE;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/env');
        const env = await response.json();

        // Asigna las variables obtenidas
        PUBLIC_KEY = env.PUBLIC_KEY;
        ID_TEMPLATE = env.ID_TEMPLATE;
        ID_SERVICE = env.ID_SERVICE;

        console.log('Variables de entorno cargadas:', PUBLIC_KEY, ID_TEMPLATE, ID_SERVICE);

        // Inicializa tus funciones aquí
        emailjs.init(PUBLIC_KEY);
        cargarProyectos();
        configurarFormulario();
        agregarValidacionTiempoReal();
    } catch (error) {
        console.error('Error al cargar las variables de entorno:', error);
    }
});


*/

