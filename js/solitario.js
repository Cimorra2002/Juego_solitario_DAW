/***** INICIO DECLARACIÓN DE VARIABLES GLOBALES *****/

// Array de palos:
let palos = ["ova", "cua", "hex", "cir"];
// Array de número de cartas:
//let numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
// En las pruebas iniciales solo se trabajará con cuatro cartas por palo:
let numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// Paso (top y left) en pixeles de una carta a la siguiente en un mazo:
let paso = 5;

// Tapetes
let tapete_inicial   = document.getElementById("inicial");
let tapete_sobrantes = document.getElementById("sobrantes");
let tapete_receptor1 = document.getElementById("receptor1");
let tapete_receptor2 = document.getElementById("receptor2");
let tapete_receptor3 = document.getElementById("receptor3");
let tapete_receptor4 = document.getElementById("receptor4");

// Mazos
let mazo_inicial   = [];
let mazo_sobrantes = [];
let mazo_receptor1 = [];
let mazo_receptor2 = [];
let mazo_receptor3 = [];
let mazo_receptor4 = [];

// Contadores de cartas
let cont_inicial     = document.getElementById("cont_inicial");
let cont_sobrantes   = document.getElementById("cont_sobrantes");
let cont_receptor1   = document.getElementById("cont_receptor1");
let cont_receptor2   = document.getElementById("cont_receptor2");
let cont_receptor3   = document.getElementById("cont_receptor3");
let cont_receptor4   = document.getElementById("cont_receptor4");
let cont_movimientos = document.getElementById("cont_movimientos");
let cont_puntuaciones = document.getElementById("cont_puntuaciones");

// Tiempo
let cont_tiempo  = document.getElementById("cont_tiempo"); // span cuenta tiempo
let segundos 	 = 0;    // cuenta de segundos
let temporizador = null; // manejador del temporizador

// Definir el color de las cartas segun el palo
const palosColores = {
	"ova": "rojo",
	"cua": "rojo",
	"hex": "gris",
	"cir": "gris"
};

// Registro de puntuaciones globales del jugador
var puntuaciones = [];

/***** FIN DECLARACIÓN DE VARIABLES GLOBALES *****/


// Rutina asociada a boton reset: comenzar_juego
document.getElementById("reset").onclick = comenzar_juego;

// El juego arranca ya al cargar la página: no se espera a reiniciar
/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/
comenzar_juego();

// Desarrollo del comienzo del juego
function comenzar_juego() {
	/* Crear baraja, es decir crear el mazo_inicial. Este será un array cuyos
	elementos serán elementos HTML <img>, siendo cada uno de ellos una carta.
	Sugerencia: en dos bucles "for", bárranse los "palos" y los "numeros", formando
	oportunamente el nombre del fichero "png" que contiene a la carta (recuérdese poner
	el "path" correcto en la URL asociada al atributo "src" de <img>). Una vez creado
	el elemento <img>, inclúyase como elemento del array "mazo_inicial".
	*/

	/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/

	// Obtiene un array de las puntuaciones del jugador 
	puntuaciones = getPuntuaciones();
	set_contador(cont_puntuaciones, puntuaciones.join(', '));

	// Reinicio de las matrices
	mazo_inicial = [];
	mazo_sobrantes = [];
	mazo_receptor1 = [];
	mazo_receptor2 = [];
	mazo_receptor3 = [];
	mazo_receptor4 = [];

	var contador = tapete_inicial.firstElementChild;
	tapete_inicial.innerHTML = "";
	tapete_inicial.appendChild(contador);

	contador = tapete_sobrantes.firstElementChild;
	tapete_sobrantes.innerHTML = "";
	tapete_sobrantes.appendChild(contador);

	contador = tapete_receptor1.firstElementChild;
	tapete_receptor1.innerHTML = "";
	tapete_receptor1.appendChild(contador);

	contador = tapete_receptor2.firstElementChild;
	tapete_receptor2.innerHTML = "";
	tapete_receptor2.appendChild(contador);

	contador = tapete_receptor3.firstElementChild;
	tapete_receptor3.innerHTML = "";
	tapete_receptor3.appendChild(contador);

	contador = tapete_receptor4.firstElementChild;
	tapete_receptor4.innerHTML = "";
	tapete_receptor4.appendChild(contador);

	// Mazo inicial ordenado
	for (let i = 0; i < palos.length; i++) {
		for (let j = 0; j < numeros.length; j++) {
			mazo_inicial.push("imagenes/baraja/" + numeros[j] + "-" + palos[i] + ".png");
		}
	}

	// Barajar
	barajar(mazo_inicial);

	// Dejar mazo_inicial en tapete inicial
	cargar_tapete_inicial(mazo_inicial);

	// Puesta a cero de contadores de mazos
	set_contador(cont_sobrantes, 0);
	set_contador(cont_receptor1, 0);
	set_contador(cont_receptor2, 0);
	set_contador(cont_receptor3, 0);
	set_contador(cont_receptor4, 0);
	set_contador(cont_movimientos, 0);

	// Arrancar el conteo de tiempo
	arrancar_tiempo();

} // comenzar_juego


/**
	Se debe encargar de arrancar el temporizador: cada 1000 ms se
	debe ejecutar una función que a partir de la cuenta autoincrementada
	de los segundos (segundos totales) visualice el tiempo oportunamente con el
	format hh:mm:ss en el contador adecuado.

	Para descomponer los segundos en horas, minutos y segundos pueden emplearse
	las siguientes igualdades:

	segundos = truncar (   segundos_totales % (60)                 )
	minutos  = truncar ( ( segundos_totales % (60*60) )     / 60   )
	horas    = truncar ( ( segundos_totales % (60*60*24)) ) / 3600 )

	donde % denota la operación módulo (resto de la división entre los operadores)

	Así, por ejemplo, si la cuenta de segundos totales es de 134 s, entonces será:
	   00:02:14

	Como existe la posibilidad de "resetear" el juego en cualquier momento, hay que
	evitar que exista más de un temporizador simultáneo, por lo que debería guardarse
	el resultado de la llamada a setInterval en alguna variable para llamar oportunamente
	a "clearInterval" en su caso.
*/

function arrancar_tiempo(){
	/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/
	if (temporizador) clearInterval(temporizador);
    let hms = function (){
			let seg = Math.trunc( segundos % 60 );
			let min = Math.trunc( (segundos % 3600) / 60 );
			let hor = Math.trunc( (segundos % 86400) / 3600 );
			let tiempo = ( (hor<10)? "0"+hor : ""+hor )
						+ ":" + ( (min<10)? "0"+min : ""+min )
						+ ":" + ( (seg<10)? "0"+seg : ""+seg );
			set_contador(cont_tiempo, tiempo);
            segundos++;
		}
	segundos = 0;
    hms(); // Primera visualización 00:00:00
	temporizador = setInterval(hms, 1000);
} // arrancar_tiempo


/**
	Si mazo es un array de elementos <img>, en esta rutina debe ser
	reordenado aleatoriamente. Al ser un array un objeto, se pasa
	por referencia, de modo que si se altera el orden de dicho array
	dentro de la rutina, esto aparecerá reflejado fuera de la misma.
	Para reordenar el array puede emplearse el siguiente pseudo código:

	- Recorramos con i todos los elementos del array
		- Sea j un indice cuyo valor sea un número aleatorio comprendido
			entre 0 y la longitud del array menos uno. Este valor aleatorio
			puede conseguirse, por ejemplo con la instrucción JavaScript
				Math.floor( Math.random() * LONGITUD_DEL_ARRAY );
		- Se intercambia el contenido de la posición i-ésima con el de la j-ésima

*/
function barajar(mazo) {
	/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/
	// Mezclamos con un bucle el array
	for (let i = 0; i < mazo.length; i++) {
		let numeroAleatorio = Math.floor( Math.random() * mazo.length);

		// Obtenemos el valor que hay en la posicion aleatoria
		let valorPrevio = mazo[numeroAleatorio];

		// introducimos el valor del array del for en la posicion aleatoria
		mazo[numeroAleatorio] = mazo[i];

		// Guardamos el valor de la posicion aleatoria en la posicion ordenada del for
		mazo[i] = valorPrevio;
	}

	mazo_inicial = mazo;

} // barajar



/**
 	En el elemento HTML que representa el tapete inicial (variable tapete_inicial)
	se deben añadir como hijos todos los elementos <img> del array "mazo".
	Antes de añadirlos, se deberían fijar propiedades como la anchura, la posición,
	coordenadas "top" y "left", algun atributo de tipo "data-", etc.
	Al final se debe ajustar el contador de cartas a la cantidad oportuna
*/
function cargar_tapete_inicial(mazo) {
	/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/
	// Variable global de la funcion que cuenta las cartas que lleva recorridas
	let cartaActual = 0;
	sonidoMezclar();

	// Funcion por la cual se dibujan las cartas 1 a 1 para crear un efecto visual
    function dibujarSiguienteCarta() {
        if (cartaActual < mazo.length) {
			// Crea la carta
            var imagenNueva = document.createElement("img");

            imagenNueva.setAttribute('class', 'carta imagen-animado');

            imagenNueva.setAttribute('src', mazo[cartaActual]);

            imagenNueva.style.top = paso * cartaActual + "px";
            imagenNueva.style.left = paso * cartaActual + "px";

            imagenNueva.setAttribute('ondragstart', 'dragStart(event)');

            imagenNueva.setAttribute('id', cartaActual);

            imagenNueva.setAttribute('draggable', false);

            tapete_inicial.appendChild(imagenNueva);

			// Suma al contador la carta recorrida y llama otra vez a la funcion con un retraso de 20 milisegundos
            cartaActual++;
            setTimeout(dibujarSiguienteCarta, 20);
        } else {
			// Si se han recorrido todas las cartas no se llama otra vez a la funcion
			// Se selecciona la ultima carta como que se puede arrastrar y iniciamos el contador
            tapete_inicial.lastChild.setAttribute('draggable', true);
            set_contador(cont_inicial, mazo_inicial.length);
        }
    }

	// Iniciamos la funcion que dibuja las cartas del tapete
    dibujarSiguienteCarta();
} // cargar_tapete_inicial


/**
 	Esta función debe incrementar el número correspondiente al contenido textual
   	del elemento que actúa de contador
*/
function inc_contador(contador){
    contador.innerHTML = +contador.innerHTML + 1;
} // inc_contador

/**
	Idem que anterior, pero decrementando
*/
function dec_contador(contador){
	/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! ***/
	contador.innerHTML = contador.innerHTML -1;
} // dec_contador

/**
	Similar a las anteriores, pero ajustando la cuenta al valor especificado
*/
function set_contador(contador, valor) {
	/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/

	contador.innerHTML = valor;
} // set_contador


// Desarrollo de la continuación del juego
// Funciones drag & drop
/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/

function dragStart(event){
	event.dataTransfer.setData("Text", event.target.id)
}

function allowDrop(event){
	event.preventDefault();
}

function drop(event){
	event.preventDefault();

	// Variable del target
	var target;
	// Cuando se hace el drop en otra carta se toman las propiedades del padre
	// y cuando se hace en el div se cogen las propiedades del div
	// Bugfix: Cuando la carta tenia id="0" la comprobacion de parseint fallaba
	// Entonces no cogia bien el target. Se añade una condicion extra para la
	// Carta con id 0
	if(parseInt(event.target.id) || event.target.id === "0"){
		target = event.target.parentElement;
	} else {
		target = event.target;
	}
	// Mirar si donde soltamos la carta no es el tapete inicial para que no se ejecute el codigo
	if(target.getAttribute('id') != "inicial"){

		let data = event.dataTransfer.getData("Text");
		let carta = document.getElementById(data);
		let tapeteOrigen = document.getElementById(data).parentElement.getAttribute("id");

		switch(target.getAttribute('id')){
			case "sobrantes":
				cambiarCarta(carta, target);
				actualizarArray(tapeteOrigen, target);
				break;
			case "receptor1":
				if(comprobarCartas(carta, mazo_receptor1)){
					cambiarCarta(carta, target);
					actualizarArray(tapeteOrigen, target);

				}
				break;
			case "receptor2":
				if(comprobarCartas(carta, mazo_receptor2)){
					cambiarCarta(carta, target);
					actualizarArray(tapeteOrigen, target)
				}
				break;
			case "receptor3":
				if(comprobarCartas(carta, mazo_receptor3)){
					cambiarCarta(carta, target);
					actualizarArray(tapeteOrigen, target)
				}
				break;
			case "receptor4":
				if(comprobarCartas(carta, mazo_receptor4)){
					cambiarCarta(carta, target);
					actualizarArray(tapeteOrigen, target)
				}
				break;
		}

		if(mazo_inicial.length <= 0 && mazo_sobrantes.length > 0){
			reiniciarMazo();
		}
	}
}

/* ----------------------------------- */
/* ---- Funciones Arrays y Cartas ---- */
/* ----------------------------------- */

function cambiarCarta(carta, target){
	// Cambiamos al tapete target la propiedad de draggable ya que ahora esa carta
	// va a estar oculta por la nueva carta y no tiene que poder ser arrastrada
	target.lastChild.setAttribute('draggable', false);
	// Si la carta se dirige a sobrantes, esta tiene que poder ser arrastrada
	// pero en cambio si esta carta se dirige a un receptor esta carta ya no tiene moverse
	if(target.getAttribute("id") === "sobrantes"){
		carta.setAttribute('draggable', true);
	} else {
		carta.setAttribute('draggable', false);
		// En el else quiere decir que la carta va al tapete de receptor
		// Entonces mandamos la animacion de exito
		animacionExito(carta.getAttribute('id'));
	}
	// Cambiamos la carte a otro tapete
	target.appendChild(carta);
	carta.style.top = "15%";
	carta.style.left = "18%";
	sonidoMovimiento();
}

function comprobarCartas(carta, mazo){
	// Obtenemos en relacion al link de la imagen el numero y palo de la carta
	var numeroCarta = parseInt(carta.getAttribute("src").split("/")[2].split("-")[0]);
	var paloCarta = carta.getAttribute("src").split("/")[2].split("-")[1].split(".")[0];
	// Si la carta es un 12 y el mazo esta vacio quiere decir que se va a introducir
	// la primera carta al mazo
	if(mazo.length == 0 && numeroCarta == 12){
		return true
	} else if(mazo.length > 0) {
		// Si el mazo es mayor de 0 quiere decir que no esta vacio el mazo
		// hay que comprobar que el numero es igual que el ultimo numero -1
		var ultimoNumero = parseInt(mazo[mazo.length-1].split("/")[2].split("-")[0]);
		var ultimoPalo = mazo[mazo.length-1].split("/")[2].split("-")[1].split(".")[0];

		// Comprobacion que las 2 condiciones son true
		if(ultimoNumero - 1 == numeroCarta && colorOpuesto(paloCarta, ultimoPalo)){
			return true;
		}
	}
	animacionError(carta.getAttribute('id'));
	sonidoError();
	return false;
}

// Funcion que comprueba si el color de una carta es opuesto a otra carta
function colorOpuesto(paloCarta, ultimoPalo){
	return palosColores[paloCarta] != palosColores[ultimoPalo];
}

// Funcion que actualiza el array de los mazos
function actualizarArray(tapeteOrigen, target){
	// Se cambia la propiedad draggable de la ultima carta del origen para que se pueda
	// Mover ya que ahora al hacer el cambio es la carta visible
	document.getElementById(tapeteOrigen).lastElementChild.setAttribute('draggable', true);
	// Se hace un switch segun el id del tapete en el que se ha depositado la carta
	// se hace una comprobacion segun de donde venga la carta para actualizar el array correspondiente
	switch(target.getAttribute("id")){
		case "sobrantes":
			// El tapete sobrantes solo recibe cartas del tapete inicial, solo se hace una comprobacion
			if(tapeteOrigen === "inicial"){
				mazo_sobrantes.push(mazo_inicial[mazo_inicial.length - 1])
				mazo_inicial.pop();
				inc_contador(cont_sobrantes)
				dec_contador(cont_inicial)
			}
			break;
		case "receptor1":
			if(tapeteOrigen === "inicial"){
				mazo_receptor1.push(mazo_inicial[mazo_inicial.length - 1])
				mazo_inicial.pop();
				inc_contador(cont_receptor1)
				dec_contador(cont_inicial)
			} else if(tapeteOrigen === "sobrantes"){
				mazo_receptor1.push(mazo_sobrantes[mazo_sobrantes.length - 1])
				mazo_sobrantes.pop();
				inc_contador(cont_receptor1)
				dec_contador(cont_sobrantes)
			}
			break;
		case "receptor2":
			if(tapeteOrigen === "inicial"){
				mazo_receptor2.push(mazo_inicial[mazo_inicial.length - 1])
				mazo_inicial.pop();
				inc_contador(cont_receptor2)
				dec_contador(cont_inicial)
			} else if(tapeteOrigen === "sobrantes"){
				mazo_receptor2.push(mazo_sobrantes[mazo_sobrantes.length - 1])
				mazo_sobrantes.pop();
				inc_contador(cont_receptor2)
				dec_contador(cont_sobrantes)
				
			}
			break;
		case "receptor3":
			if(tapeteOrigen === "inicial"){
				mazo_receptor3.push(mazo_inicial[mazo_inicial.length - 1])
				mazo_inicial.pop();
				inc_contador(cont_receptor3)
				dec_contador(cont_inicial)
			} else if(tapeteOrigen === "sobrantes"){
				mazo_receptor3.push(mazo_sobrantes[mazo_sobrantes.length - 1])
				mazo_sobrantes.pop();
				inc_contador(cont_receptor3)
				dec_contador(cont_sobrantes)
			}
			break;
		case "receptor4":
			if(tapeteOrigen === "inicial"){
				mazo_receptor4.push(mazo_inicial[mazo_inicial.length - 1])
				mazo_inicial.pop();
				inc_contador(cont_receptor4)
				dec_contador(cont_inicial)
			} else if(tapeteOrigen === "sobrantes"){
				mazo_receptor4.push(mazo_sobrantes[mazo_sobrantes.length - 1])
				mazo_sobrantes.pop();
				inc_contador(cont_receptor4)
				dec_contador(cont_sobrantes)
			}
			break;
	}
	inc_contador(cont_movimientos);

	// Si el array inicial y sobrantes esta vacio quiere decir que no hay ninguna carta mas entonces se ha terminado el juego
	if(mazo_inicial.length < 1 && mazo_sobrantes.length < 1){
		finDeJuego();
	}
}

function reiniciarMazo(){
	// Reiniciamos el array de los mazos
	mazo_inicial = mazo_sobrantes.reverse();
	mazo_sobrantes = Array();

	cargar_tapete_inicial(mazo_inicial);
	set_contador(cont_sobrantes, 0)
	// Guardamos en un array los hijos del tapete de sobrantes
	// por si se elimina de manera erronea por seguridad
	// se hace en dos pasos un for para ver los hijos del tapete
	// y otro for para eliminar los hijos del tapete
	var arrayChildren = Array();

	for (const child of tapete_sobrantes.children) {
		if(child.tagName !== "SPAN"){
			arrayChildren.push(child);
		}
	}

	for (let i = 0; i < arrayChildren.length; i++) {
		tapete_sobrantes.removeChild(arrayChildren[i]);
	}
}

function finDeJuego(){
	sonidoVictoria();
	alert("FIN DEL JUEGO. TIEMPO EMPLEADO: " + cont_tiempo.innerHTML + " MOVIMIENTOS REALIZADOS " + cont_movimientos.innerHTML);
	// Paramos el temporizador poniendo la variable en null
	if (temporizador) {
        clearInterval(temporizador);
        temporizador = null;
    }

	animacionGanar();

	// guardar puntuacion en la cookie
	puntuaciones.push(cont_movimientos.innerHTML);
	setPuntuaciones(puntuaciones);
}


/* ----------------------------------------- */
/* ---- Animaciones de cartas y sonidos ---- */
/* ----------------------------------------- */

function animacionError(idCarta){
	carta = document.getElementById(idCarta);
	carta.classList.add('rotarFallo');

	setTimeout(function() {
        carta.classList.remove('rotarFallo');
    }, 400);
}

function animacionExito(idCarta){
	carta = document.getElementById(idCarta);
	carta.classList.add('rotarExito');

	setTimeout(function() {
        carta.classList.remove('rotarExito');
    }, 500);
}

function animacionGanar(){
	var cartas = document.querySelectorAll('.carta');

	cartas.forEach(function(carta, index) {
		setTimeout(function() {
			var destino = Math.floor(Math.random() * 2) + 1;
		  	carta.classList.add('animacionGanar' + destino);
		}, index * 3000); 
	});
}

// Recordatorio, como el sonido automatico no se permite hoy en dia en los navegadores
// hay que tener en cuenta que en las preferencias del navegador hay que habilitar
// la reproducion automatica de sonidos 

function sonidoMezclar(){
	var audio = new Audio("audio/mezclar.mp3");
	audio.play();
}

function sonidoMovimiento(){
	var audio = new Audio("audio/movimiento.mp3");
	audio.play();
}

function sonidoVictoria(){
	var audio = new Audio("audio/victoria.mp3");
	audio.play();
}

function sonidoError(){
	var audio = new Audio("audio/error.mp3");
	audio.play();
}


/* ----------------- */
/* ---- Cookies ---- */
/* ----------------- */

function setPuntuaciones(puntuaciones){
	document.cookie = "puntuaciones=" + puntuaciones.join(',') + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
}

function getPuntuaciones(){
	var cookies = decodeURIComponent(document.cookie);
	var ca = cookies.split(";");
	
	for (var i = 0; i < ca.length; i++){
		var c = ca[i];
		while(c.charAt(0) == ' '){
			c = c.substring(1);
		}
		if(c.indexOf('puntuaciones=') == 0){
			return c.substring(13, c.length).split(',');
		}
	}
	return [];
}