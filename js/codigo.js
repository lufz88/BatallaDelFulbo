const seccionAtaque = document.getElementById("seleccionar-ataque");
const seccionMascota = document.getElementById("seleccionar-mascota");
const seccionReiniciar = document.getElementById("reiniciar");
const botonMascotaJugador = document.getElementById("boton-mascota");
const botonReiniciar = document.getElementById("boton-reiniciar");

const spanMascotaJugador = document.getElementById("mascota-jugador");
const spanMascotaEnemigo = document.getElementById("mascota-enemigo");

const mensajeAtaqueActualJugador = document.getElementById("ataque-actual-jugador");
const mensajeAtaqueActualEnemigo = document.getElementById("ataque-actual-enemigo");

const spanVidasJugador = document.getElementById("vidas-jugador");
const spanVidasEnemigo = document.getElementById("vidas-enemigo");

const mensajeAtaqueJugador = document.getElementById("ataques-del-jugador");
const mensajeAtaqueEnemigo = document.getElementById("ataques-del-enemigo");

const contenedorTarjeta = document.getElementById("contenedor-tarjeta");
const contenedorBotones = document.getElementById("contenedor-botones");

const seccionVermapa = document.getElementById("ver-mapa");
const mapa = document.getElementById("mapa");

let jugadorId = null;
let personajes = [];
let personajesEnemigos = [];
let mascotaAleatoria;
let opcionPersonaje;
let botonAtaquePersonaje;
let inputIaia;
let inputSeve;
let inputChino;
let inputIvan;
let inputMartin;
let inputGonzalez;
let mascotaJugador;
let mascotaJugadorObjeto;
let ataques = [];
let ataquesEnemigo = [];
let botones = [];
let boton1;
let boton2;
let boton3;
let boton4;
let boton5;
let ataqueJugador;
let ataqueEnemigo;
let vidasJugador = 100;
let vidasEnemigo = 100;
let lienzo = mapa.getContext("2d")
let intervalo;
let mapaBackground = new Image();
mapaBackground.src = "./img/canchita.jpg"
let alturaQueBuscamos;
let anchoDelMapa = window.innerWidth - 50;

const anchoMaximoDelMapa = 600;
if (anchoDelMapa > anchoMaximoDelMapa) {
    anchoDelMapa = anchoMaximoDelMapa - 50;
}
alturaQueBuscamos = anchoDelMapa * 600 / 800;

mapa.width = anchoDelMapa;
mapa.height = alturaQueBuscamos;

class Personaje {
    constructor(nombre, foto, vida, id = null) {
        this.id = id;
        this.nombre = nombre;
        this.foto = foto;
        this.vida = vida;
        this.ataques = []; 
        this.ancho = 60;
        this.alto = 60;
        this.x = aleatorio(0, mapa.width - this.ancho);
        this.y = aleatorio(0, mapa.height - this.alto);
        this.mapaFoto = new Image();
        this.mapaFoto.src = foto;
        this.velocidadX = 0;
        this.velocidadY = 0;
    }

    pintarPersonaje() {
        lienzo.drawImage(
            this.mapaFoto,
            this.x,
            this.y,
            this.ancho,
            this.alto,
        )
    }
}

class Ataque {
    constructor(nombre, id, poder, mensaje) {
        this.nombre = nombre;
        this.id = id;
        this.poder = poder;
        this.mensaje = mensaje;
    }
}

let Iaia = new Personaje("Iaia","./img/la-iaia.png", 3);
let Seve = new Personaje("Seve","./img/seve.png", 3);
let Chino = new Personaje("Chino","./img/el-chino.png", 3);
let Ivan = new Personaje("Ivan","./img/ivan.png", 3);
let Martin = new Personaje("Martin","./img/martin.png", 3);
let Gonzalez = new Personaje("Gonzalez","./img/gonzalez.png", 3);


personajes.push(Iaia, Seve, Chino, Ivan, Martin, Gonzalez);

function iniciarJuego() {
    seccionAtaque.style.display = "none";
    seccionVermapa.style.display = "none";

    personajes.forEach((personaje) => {
        opcionPersonaje = `
        <input type="radio" name="mascota" id=${personaje.nombre}>
        <label for=${personaje.nombre} class="tarjeta-jugador">
            <p>${personaje.nombre}</p>
            <img src=${personaje.foto} alt=${personaje.nombre}>
        </label>
        `
    contenedorTarjeta.innerHTML += opcionPersonaje;

    inputIaia = document.getElementById("Iaia");
    inputSeve = document.getElementById("Seve");
    inputChino = document.getElementById("Chino");
    inputIvan = document.getElementById("Ivan");
    inputMartin = document.getElementById("Martin");
    inputGonzalez = document.getElementById("Gonzalez");
    })

    seccionReiniciar.style.display = "none";
    botonMascotaJugador.addEventListener("click", seleccionarMascotaJugador);

    secuenciaAtaque()

    botonReiniciar.addEventListener("click", reiniciarJuego);

    unirseAlJuego();
}

function unirseAlJuego() {
    fetch("http://localhost:8080/unirse")
        .then(function(res) {
            if (res.ok) {
                res.text()
                    .then(function(respuesta) {
                        console.log(respuesta)
                        jugadorId = respuesta
                    })
            }
        })
}

//Funciones de seleccion de mascotas

function seleccionarMascotaJugador() {
    seccionMascota.style.display = "none";
    
    if (inputIaia.checked) {       
        spanMascotaJugador.innerHTML = inputIaia.id;
        mascotaJugador = inputIaia.id;
    } else if (inputSeve.checked) {
        spanMascotaJugador.innerHTML = inputSeve.id;
        mascotaJugador = inputSeve.id;
    } else if (inputChino.checked) {
        spanMascotaJugador.innerHTML = inputChino.id;
        mascotaJugador = inputChino.id;
    } else if (inputIvan.checked) {
        spanMascotaJugador.innerHTML = inputIvan.id;
        mascotaJugador = inputIvan.id;
    } else if (inputMartin.checked) {
        spanMascotaJugador.innerHTML = inputMartin.id;
        mascotaJugador = inputMartin.id;
    } else if (inputGonzalez.checked) {
        spanMascotaJugador.innerHTML = inputGonzalez.id;
        mascotaJugador = inputGonzalez.id;
    } else {
        alert("Selecciona tu mascota");
        reiniciarJuego();
    }

    seleccionarPersonaje(mascotaJugador);

    seccionVermapa.style.display = "flex";
    iniciarMapa();

    let Narigazo = new Ataque(`Narigazo`, `boton1`, -15, ` dio alto narigazo, se restan 15 vidas.`);
    let EscribirCuento = new Ataque(`Escribir Cuento`, `boton2`, -10, ` escribi?? un cuento aburrido, se pierden 10 vidas ley??ndolo.`);
    let PatadaALaTibia = new Ataque(`Patada a la tibia`, `boton3`, -15, ` dio alto patad??n, se restan 15 vidas.`);
    let FumarseUno = new Ataque(`Fumarse Uno`, `boton4`, 15, ` se fum?? uno y entr?? en un flash m??stico que le recupera 15 vidas.`);
    let DobleNarigazo = new Ataque(`Doble Narigazo`, `boton1`, -25, ` dio alto narigazo y luego otro de reversa, se restan 25 vidas.`);
    let Pichicata = new Ataque(`Pichicata`, `boton1`, -20, ` te dio una pichicata de insulina, se restan 20 vidas.`);
    let Medici??n = new Ataque(`Medici??n`, `boton1`, 15, ` se midi?? y le di?? bien, suma 15 vidas.`);
    let Pi??aErrada = new Ataque(`Pi??a Errada`, `boton3`, 0, ` err?? la pi??a`);
    let BaileDiab??lico = new Ataque(`Baile Diab??lico`, `boton1`, -25, ` bail?? diab??licamente maldiciendo, se restan 25 vidas.`);
    let RegalarChocolate = new Ataque(`Regalar Chocolate`, `boton5`, 10, ` regal?? un chocolate, se recuperan 10 vidas.`);
    let SerVar??n = new Ataque(`Ser Var??n`, `boton1`, 15, ` es var??n y tiene privilegios, suma 15 vidas.`);
    let VomitarMesa = new Ataque(`Vomitar Mesa`, `boton2`, -15, ` vomit?? la mesa y da asco, se restan 15 vidas.`);
    let TenerUnHijo = new Ataque(`Tener un hijo`, `boton3`, -10, ` tuvo otro hijo y su llanto hiere, se restan 10 vidas.`);
    let LlegarTarde = new Ataque(`Llegar Tarde`, `boton4`, 5, ` lleg?? tarde y el ??ltimo ataque le pega menos, se suman 5 vidas.`);
    let HacerSushi = new Ataque(`Hacer Sushi`, `boton5`, -15, ` hizo sushi pero al ser chino le sale horrible y hace mal, restan 15 vidas.`);
    let CorridaInfinita = new Ataque(`Corrida Infinita`, `boton2`, 0, ` corri??, corri?? y corri??`);
    let SinSentido = new Ataque(`Sin Sentido`, `boton3`, -15, ` dijo algo sin sentido y confunde, restan 15 vidas.`);
    let PasoProhibido = new Ataque(`Paso Prohibido`, `boton5`, -20, ` tir?? alto paso prohibido que hipnotiza, resta 20 vidas.`);
    let Predicar = new Ataque(`Predicar`, `boton1`, 10, ` se puso a predicar y dios lo ayuda, suma 10 vidas.`);
    let VenderPulsera = new Ataque(`Vender Pulsera`, `boton2`, -15, ` vendi?? una pulsera y con la plata se compr?? un palo para golpear, resta 15 vidas.`);
    let Baj??nEterno = new Ataque(`Baj??n Eterno`, `boton3`, 15, ` se puso a bajonear y bajonear y bajonear, suma 15 vidas.`);
    let JuegaMagic = new Ataque(`Juega Magic?`, `boton5`, -20, ` te invita a jugar magic y te vence, se restan 20 vidas.`);
    let Desmayo = new Ataque(`Desmayo`, `boton1`, 15, ` se desmaya y recupera energ??as, suma 15 vidas.`);
    let DarLaRaz??n = new Ataque(`Dar la raz??n`, `boton2`, -15, ` da la raz??n y confunde, se restan 15 vidas.`);
    let ComentarPartido = new Ataque(`Comentar Partido`, `boton3`, -20, ` comenta interesantemente un partido para distraer y golpear, se restan 20 vidas.`);
    let Anemia = new Ataque(`Anemia`, `boton5`, 0, ` le dio anemia, comi?? carne para mejorar y enoj?? a los veganos.`);
    
    Iaia.ataques.push(Narigazo, EscribirCuento, PatadaALaTibia, FumarseUno, DobleNarigazo);
    Seve.ataques.push(Pichicata, Medici??n, Pi??aErrada, BaileDiab??lico, RegalarChocolate);
    Chino.ataques.push(SerVar??n, VomitarMesa, TenerUnHijo, LlegarTarde, HacerSushi);
    Ivan.ataques.push(Narigazo, CorridaInfinita, SinSentido, FumarseUno, PasoProhibido);
    Martin.ataques.push(Predicar, VenderPulsera, Baj??nEterno, FumarseUno, JuegaMagic);
    Gonzalez.ataques.push(Desmayo, DarLaRaz??n, ComentarPartido, FumarseUno, Anemia);

    extraerAtaques(mascotaJugador);
    
}

function seleccionarPersonaje(mascotaJugador) {
    fetch(`http://localhost:8080/personaje/${jugadorId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            personaje: mascotaJugador
        }) 
    }) 
}

function extraerAtaques(mascotaJugador) {
    for(let i = 0; i < personajes.length; i++) {
        if (mascotaJugador === personajes[i].nombre) {
            ataques = personajes[i].ataques;
        }
    }
    mostrarAtaques(ataques);
}

function extraerAtaquesEnemigo(mascotaAleatoria) {
    for(let i = 0; i < personajes.length; i++) {
        if (mascotaAleatoria === personajes[i].nombre) {
            ataquesEnemigo = personajes[i].ataques;
        }
    }
}

function mostrarAtaques(ataques) {
    ataques.forEach((ataque) => {
        botonAtaquePersonaje = `
        <button class="boton-ataque shadow-inset-center b-ataque" id=${ataque.id}>${ataque.nombre}</button>
        `
    contenedorBotones.innerHTML += botonAtaquePersonaje;
    })
    boton1 = document.getElementById("boton1");
    boton2 = document.getElementById("boton2");
    boton3 = document.getElementById("boton3");
    boton4 = document.getElementById("boton4");
    boton5 = document.getElementById("boton5");

    botones = document.querySelectorAll(`.b-ataque`)
}

function secuenciaAtaque(){
    botones.forEach((boton) => {
    boton.addEventListener(`click`, (e) => {
        ataqueJugador = ataques.find(ataque => ataque.nombre === e.target.textContent)
        ataqueEnemigo = ataquesEnemigo[aleatorio(0, 4)];
        crearMensaje(ataqueJugador, ataqueEnemigo);
        })
    })
}

function seleccionarMascotaEnemigo(enemigo) {
    mascotaAleatoria = enemigo.nombre;
    spanMascotaEnemigo.innerHTML = mascotaAleatoria;
    extraerAtaquesEnemigo(mascotaAleatoria);
    secuenciaAtaque();
}

// Fin de seleccion de mascotas

// Funciones de combate



function crearMensaje(ataque1, ataque2) {
    mensajeAtaqueActualJugador.innerHTML = ataque1.nombre;
    mensajeAtaqueJugador.innerHTML = mascotaJugador + ataque1.mensaje;
    if (ataque1.poder > 0) {
        vidasJugador += ataque1.poder;
        spanVidasJugador.innerHTML = vidasJugador;
    } else {
        vidasEnemigo += ataque1.poder;
        spanVidasEnemigo.innerHTML = vidasEnemigo;
    }
    mensajeAtaqueActualEnemigo.innerHTML = ataque2.nombre;
    mensajeAtaqueEnemigo.innerHTML = mascotaAleatoria + ataque2.mensaje;
    if (ataque2.poder > 0) {
        vidasEnemigo += ataque2.poder;
        spanVidasEnemigo.innerHTML = vidasEnemigo;
    } else {
        vidasJugador += ataque2.poder;
        spanVidasJugador.innerHTML = vidasJugador;
    }
    revisarVidas()
}

function crearMensajeFinal(resultadoFinal1, resultadoFinal2) {
    mensajeAtaqueActualJugador.innerHTML = resultadoFinal1;
    mensajeAtaqueActualEnemigo.innerHTML = resultadoFinal2;
    botones.forEach(boton => {
        boton.disabled = true;
        boton.style.backgroundColor = "grey";
    });
    seccionReiniciar.style.display = "block";
}

function revisarVidas() {
    if (vidasJugador <= 0 && vidasEnemigo <= 0 ){
        spanVidasEnemigo.innerHTML = 0;
        spanVidasJugador.innerHTML = 0;
        crearMensajeFinal("Ambos murieron, empate", "Ambos murieron, empate");
    } else if (vidasJugador <= 0) {
        spanVidasJugador.innerHTML = 0;
        crearMensajeFinal("Lo siento, Perdiste", "??Felicitaciones! ??Ganaste!");
    } else if (vidasEnemigo <= 0) {
        spanVidasEnemigo.innerHTML = 0;
        crearMensajeFinal("??Felicitaciones! ??Ganaste!", "Lo siento, Perdiste");
    }
}

function reiniciarJuego() {
    location.reload();
}

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


function iniciarMapa() {
    mascotaJugadorObjeto = obtenerObjetoMascota();
    
    intervalo = setInterval(pintarCanvas, 50)
    
    window.addEventListener("keydown", sePresionoUnaTecla);
    window.addEventListener("keyup", detenerMovimiento);
}

function pintarCanvas() {

    mascotaJugadorObjeto.x = mascotaJugadorObjeto.x + mascotaJugadorObjeto.velocidadX;
    mascotaJugadorObjeto.y = mascotaJugadorObjeto.y + mascotaJugadorObjeto.velocidadY;
    lienzo.clearRect(0, 0, mapa.width, mapa.height);
    lienzo.drawImage(
        mapaBackground,
        0,
        0,
        mapa.width,
        mapa.height,
    )
    mascotaJugadorObjeto.pintarPersonaje();

    enviarPosicion(mascotaJugadorObjeto.x, mascotaJugadorObjeto.y);

    if (mascotaJugadorObjeto.velocidadX !== 0 || mascotaJugadorObjeto.velocidadY !== 0) {
        personajesEnemigos.forEach(personaje => revisarColision(personaje));
    }
}

function enviarPosicion(x, y) {
    fetch(`http://localhost:8080/personaje/${jugadorId}/posicion`, {
        method: "post",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            x,
            y,
        })

    })
    .then(function(res) {
        if(res.ok) {
            res.json()
                .then(function({enemigos}) {
                    console.log(enemigos)
                    enemigos.forEach(function(enemigo) {
                        let personajeEnemigo = null;
                        const personajeNombre = enemigo.personaje.nombre || "";
                        if(personajeNombre === "Iaia") {
                            personajeEnemigo = new Personaje("Iaia","./img/la-iaia.png", 3);
                        } else if(personajeNombre === "Seve") {
                            personajeEnemigo = new Personaje("Seve","./img/seve.png", 3);
                        } else if(personajeNombre === "Chino") {
                            personajeEnemigo = new Personaje("Chino","./img/el-chino.png", 3);
                        } else if(personajeNombre === "Ivan") {
                            personajeEnemigo = new Personaje("Ivan","./img/ivan.png", 3);
                        } else if(personajeNombre === "Martin") {
                            personajeEnemigo = new Personaje("Martin","./img/martin.png", 3);
                        } else if(personajeNombre === "Gonzalez") {
                            personajeEnemigo = new Personaje("Gonzalez","./img/gonzalez.png", 3);
                        }
                        personajeEnemigo.x = enemigo.x;
                        personajeEnemigo.y = enemigo.y;

                        personajeEnemigo.pintarPersonaje();
                    })
                    
                })
        }
    })
}

function moverDerecha() {
    mascotaJugadorObjeto.velocidadX = 5;
    
}
function moverIzquierda() {
    mascotaJugadorObjeto.velocidadX = -5;
    
}
function moverArriba() {
    mascotaJugadorObjeto.velocidadY = -5;
}
function moverAbajo() {
    mascotaJugadorObjeto.velocidadY = 5;
}

function detenerMovimiento() {
    
    mascotaJugadorObjeto.velocidadX = 0;
    mascotaJugadorObjeto.velocidadY = 0;
}

function sePresionoUnaTecla(event) {
    switch (event.key) {
        case "ArrowUp":
            moverArriba();
            break;
        
        case "ArrowDown":
            moverAbajo();
            break;
        
        case "ArrowLeft":
            moverIzquierda();
            break;
        
        case "ArrowRight":
            moverDerecha();
            break;

        default:
            break;
    }
}

function obtenerObjetoMascota() {
    for(let i = 0; i < personajes.length; i++) {
        if (mascotaJugador === personajes[i].nombre) {
            return personajes[i];
        }
    }
}

function revisarColision(enemigo) {
    const arribaEnemigo = enemigo.y;
    const abajoEnemigo = enemigo.y + enemigo.alto;
    const derechaEnemigo = enemigo.x + enemigo.ancho;
    const izquierdaEnemigo = enemigo.x;

    const arribaMascota = mascotaJugadorObjeto.y;
    const abajoMascota = mascotaJugadorObjeto.y + mascotaJugadorObjeto.alto;
    const derechaMascota = mascotaJugadorObjeto.x + mascotaJugadorObjeto.ancho;
    const izquierdaMascota = mascotaJugadorObjeto.x;
    if(
        abajoMascota < arribaEnemigo ||
        arribaMascota > abajoEnemigo ||
        derechaMascota < izquierdaEnemigo ||
        izquierdaMascota > derechaEnemigo
    ) {
        return;
    }

    detenerMovimiento();
    clearInterval(intervalo);
    seccionAtaque.style.display = "flex";
    seccionVermapa.style.display = "none";
    seleccionarMascotaEnemigo(enemigo);
    // alert(`Comienza la batalla con ${enemigo.nombre}`);
}

iniciarJuego();
