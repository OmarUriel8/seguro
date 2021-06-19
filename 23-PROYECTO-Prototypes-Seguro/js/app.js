// Constructor
function Seguro(marca, year, tipo) {
	this.marca = marca;
	this.year = year;
	this.tipo = tipo;
}
// Realiza la cotizacion con los datos
Seguro.prototype.cotizarSeguro = function() {
	/**
	 * 1 = Americo 1.15
	 * 2 = Asiatico 1.05
	 * 3 = Europeo 1.35
	 */
	let cantidad;
	const base = 2000;

	switch (this.marca) {
		case '1':
			cantidad = base * 1.15;
			break;
		case '2':
			cantidad = base * 1.05;
			break;
		case '3':
			cantidad = base * 1.35;
			break;
		default:
			break;
	}
	// Leer el año
	const diferencia = new Date().getFullYear() - this.year;
	// Cada año que la diferencia es maypr el costo se redice un 3%
	cantidad -= diferencia * 3 * cantidad / 100;
	/**
	 * si el seguro es basico multiplicar por 30%
	 * si el seguro es completo multiplicar por 50%
	 */
	if (this.tipo === 'basico') {
		cantidad *= 1.3;
	} else {
		cantidad *= 1.5;
	}
	return cantidad;
};
function UI() {}

// Llena las opciones de los años
UI.prototype.llenarOpciones = () => {
	const max = new Date().getFullYear(),
		min = max - 20;
	const selectYear = document.querySelector('#year');
	for (let i = max; i >= min; i--) {
		const option = document.createElement('option');
		option.value = i;
		option.textContent = i;
		selectYear.appendChild(option);
	}
};

// Muestra alertas en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
	const div = document.createElement('div');
	if (tipo === 'error') {
		div.classList.add('error');
	} else {
		div.classList.add('correcto');
	}
	div.classList.add('mensaje', 'mt-10');
	div.textContent = mensaje;

	// Insertar en el HTML
	const formulario = document.querySelector('#cotizar-seguro');
	formulario.insertBefore(div, document.querySelector('#resultado'));
	setTimeout(() => {
		formulario.removeChild(div);
	}, 3000);
};

UI.prototype.mostrarResultado = (seguro, total) => {
	const { marca, year, tipo } = seguro;
	let textoMarca;
	switch (marca) {
		case '1':
			textoMarca = 'Americano';
			break;
		case '2':
			textoMarca = 'Asiático';
			break;
		case '3':
			textoMarca = 'Europeo';
			break;
		default:
			break;
	}
	// Crear Resultado
	const div = document.createElement('div');
	div.classList.add('mt-10');
	div.innerHTML = `
		<p class="header">Tu Resumen</p>
		<p class="font-bold">Marca: <span class="font-normal">${textoMarca}</span></p>
		<p class="font-bold">Año: <span class="font-normal">${year}</span></p>
		<p class="font-bold">Tipo: <span class="font-normal capitalize">${tipo}</span></p>
		<p class="font-bold">Total: <span class="font-normal">$ ${total}</span></p>
	`;
	const resultadoDiv = document.querySelector('#resultado');

	// Mostrar el Spinner
	const spinner = document.querySelector('#cargando');
	spinner.style.display = 'block';
	setTimeout(() => {
		spinner.style.display = 'none'; // Se borra el spinner
		resultadoDiv.appendChild(div); // Se muestra resultado
	}, 3000);
};
// Instanciar UI
const ui = new UI();

// LLena las opciones de los años
document.addEventListener('DOMContentLoaded', () => {
	// Llena select con opciones
	ui.llenarOpciones();
});
eventsListener();
function eventsListener() {
	const formulario = document.querySelector('#cotizar-seguro');
	formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e) {
	e.preventDefault();
	// Leer la marca seleccionada
	const marca = document.querySelector('#marca').value;
	// Leer el año seleccionado
	const year = document.querySelector('#year').value;
	// Leer el tipo de covertura
	const tipo = document.querySelector('input[name="tipo"]:checked').value;
	if (marca === '' || year === '' || tipo === '') {
		ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
		return;
	}
	ui.mostrarMensaje('Cotizando...', 'exito');
	// Ocultar cotizaciones previas
	const resultados = document.querySelector('#resultado div');
	if (resultados != null) {
		resultados.remove();
	}
	// Instanciar el Seguro
	const seguro = new Seguro(marca, year, tipo);
	const total = seguro.cotizarSeguro();
	// Utilizar el prototype que va a cotizar
	ui.mostrarResultado(seguro, total);
}
