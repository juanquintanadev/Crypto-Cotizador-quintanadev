// selectores
const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedasSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

// creamos un objeto de busqueda donde al seleccionar algo se almacena en el
const objBusqueda = {
    moneda: '',
    cripto: '',
};

// cuando el documento este listo mandamos a llamar esta funcion
document.addEventListener('DOMContentLoaded', () => {
    consultarCritpomonedas();

    formulario.addEventListener('submit', submitFormulario);

    criptomonedasSelect.addEventListener('change', leerValor);
    monedasSelect.addEventListener('change', leerValor);
})

// creamos una promise para obtener las criptomonedas, aca definimos una funcion como function expresion y a eso le asignamos una primise
const obtenerCriptomonedas = criptomonedas => new Promise(resolve => resolve(criptomonedas));
// el promis se va a ejecutar unicamente y en caso de que resuelva, osea descargar todas las criptos va a devolver esas cripto
// esto resuelve las criptomonedas

function leerValor(e) { // le pasamos el evento del select, donde en el select colocamos el atributo name que tiene que coincidir con el elemento del objeto que vamos a ir llenando
    objBusqueda[e.target.name] = e.target.value;
    // console.log(objBusqueda);
};

function submitFormulario(e) {
    e.preventDefault();

    // destructuring del objeto
    const {moneda, cripto} = objBusqueda;

    // validamos que los dos esten  seleccionados
    if(moneda === '' || cripto === '') {
        mostrarAlerta('Debe seleccionar Moneda y Criptomoneda');
        return;
    };
    // console.log('desde submit', objBusqueda);

    // pasada la validacion vamos a consultar la api obteniendo resultados
    consultarAPI();
};

// promise que cuando se cumple devuelve los datos requeridos para cotizar las criptos
const obtenerDatos = criptos => new Promise(resolve => resolve(criptos));

function consultarAPI() {
    const {moneda, cripto} = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cripto}&tsyms=${moneda}`;
    // console.log(url);

    // aca vamos a mostrar el spinner
    mostrarSpinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => obtenerDatos(datos.DISPLAY[cripto][moneda])) // accedemos a los valores de la API como lo devuelve la misma
        .then(cotizacion => mostrarCotizacion(cotizacion));
};

function mostrarSpinner() {
    // limpiamos lo que este cargado para crear y mostrar el spinner
    limpiarHtml();

    // creamos un div para colocar el spinner, con su clase predefinido por la pagina de donde lo sacamos
    const spinnerDiv = document.createElement('DIV');
    spinnerDiv.classList.add('spinner');
    spinnerDiv.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    resultado.appendChild(spinnerDiv);
};

function mostrarCotizacion(datos) {
    // console.log(datos);

    limpiarHtml();

    // destructuring a los datos obtenidos
    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = datos;

    const precio = document.createElement('P');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

    const precioAlt = document.createElement('P');
    precioAlt.innerHTML = `Precio mas alto del dia: <span>${HIGHDAY}</span>`;

    const precioBaj = document.createElement('P');
    precioBaj.innerHTML = `Precio mas bajo del dia: <span>${LOWDAY}</span>`;

    const cambioDia = document.createElement('P');
    cambioDia.innerHTML = `El cambio en el dia fue de: <span>${CHANGEPCT24HOUR}%</span>`;

    const update = document.createElement('P');
    update.innerHTML = `Ultima actualización: <span>${LASTUPDATE}</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlt);
    resultado.appendChild(precioBaj);
    resultado.appendChild(cambioDia);
    resultado.appendChild(update);
};

function limpiarHtml() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    };
};

function mostrarAlerta(mensaje) {
    const existe = document.querySelector('.alerta');

    if(!existe) {
        const alerta = document.createElement('P');
        alerta.classList.add('error', 'alerta');
        alerta.textContent = mensaje;
    
        formulario.appendChild(alerta);
    
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    };
};

function consultarCritpomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data)) // este devuelve el promise de las cripto y en proximo then tenemos descarado todo
        .then(criptomonedas => selectCriptomonedas(criptomonedas)); // estas cripto es un arreglo
};

function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(cripto => {
        const {Name, FullName} = cripto.CoinInfo;
        // console.log(Name, FullName);

        // creamos todos los option de los selects
        const option = document.createElement('OPTION');
        option.textContent = FullName;
        option.value = Name;

        criptomonedasSelect.appendChild(option);
    });
};