const sectionReiniciar = document.getElementById("reiniciar")
const botonMascotaJugador = document.getElementById("boton-mascota")
const sectionSeleccionAtaque = document.getElementById("seleccion-ataque")
const botonReiniciar = document.getElementById("boton-reiniciar")

const sectionSeleccionMascota = document.getElementById("seleccion-mascota")
const spanNombreMascota = document.getElementById("nombre-mascota")

const spanMascotaEnemigo = document.getElementById("nombre-mascota-enemigo")

const spanVidasJugador = document.getElementById("vidas-jugador") 
const spanVidasEnemigo = document.getElementById("vidas-enemigo") 

const sectionMensajes = document.getElementById("resultado")
const ataqueDelJugador = document.getElementById("ataque-del-jugador")
const ataqueDelEnemigo = document.getElementById("ataque-del-enemigo")
const contenedorTarjetas = document.getElementById('contenedorTarjetas')
const contenedorAtaques = document.getElementById("contenedor-ataques")

const sectionVerMapa = document.getElementById("ver-mapa")
const mapa = document.getElementById("mapa")

let jugadorId = null
let enemigoId = null
let mascotasElements = []
let mascotasEnemigos = []
let ataqueJugador = []
let ataqueEnemigo = []
let opcionDeMascotas
let inputPerruno 
let inputGatino 
let inputConejis 
let mascotaJugador
let mascotaJugadorObjeto
let ataquesMascotas
let ataquesMascotaEnemigo 
let botonFuego 
let botonAgua 
let botonTierra 
let botones = []
let indexAtaqueJugador
let indexAtaqueEnemigo
let victoriasJugador = 0
let victoriasEnemigo = 0
let vidasJugador = 3
let vidasEnemigo = 3
let lienzo = mapa.getContext("2d")
let intervalo
let mapaBackground = new Image()
mapaBackground.src = "./assets/mokemap.png"
let alturaQueBuscamos
let anchoDelMapa = window.innerWidth - 20
const anchoMaximoDelMapa = 350

if (anchoDelMapa > anchoMaximoDelMapa) {
    anchoDelMapa = anchoMaximoDelMapa - 20
}

alturaQueBuscamos = anchoDelMapa * 600 / 800

mapa.width = anchoDelMapa
mapa.height = alturaQueBuscamos

class Mascota {
    constructor (nombre, foto, vida, fotoMapa, id = null) {
            this.id = id
            this.nombre = nombre
            this.foto = foto
            this.vida = vida
            this.ataques = []
            this.ancho = 40
            this.alto = 40
            this.x = aleatorio (0, mapa.width - this.ancho)
            this.y = aleatorio (0, mapa.height - this.alto)
            this.mapaFoto = new Image()
            this.mapaFoto.src = fotoMapa
            this.velocidadX = 0
            this.velocidadY = 0
    }

    pintarMascota() { 
        lienzo.drawImage( 
            this.mapaFoto,
            this.x, 
            this.y,
            this.ancho,
            this.alto
        )
    }
}
let perruno = new Mascota("Perruno", "./assets/mokepons_mokepon_hipodoge_attack.png", 5, "./assets/perruno.png")
let gatino = new Mascota("Menki", "./assets/mokepons_mokepon_capipepo_attack.png", 5, "./assets/menki.png")
let conejis = new Mascota("Corejo", "./assets/mokepons_mokepon_ratigueya_attack.png", 5, "./assets/corejo.png")

mascotasElements.push(perruno,gatino,conejis)

const PERRUNO_ATAQUES = [
    {nombre: "💧", id: "boton-agua"},
    {nombre: "💧", id: "boton-agua"},
    {nombre: "💧", id: "boton-agua"},
    {nombre: "🔥", id: "boton-fuego"},
    {nombre: "🌱", id: "boton-tierra"},
]

perruno.ataques.push(...PERRUNO_ATAQUES)

const MENKI_ATAQUES = [
    {nombre: "🌱", id: "boton-tierra"},
    {nombre: "🌱", id: "boton-tierra"},
    {nombre: "🌱", id: "boton-tierra"},
    {nombre: "💧", id: "boton-agua"},
    {nombre: "🔥", id: "boton-fuego"},
]

gatino.ataques.push(...MENKI_ATAQUES)

const COREJO_ATAQUES = [
    {nombre: "🔥", id: "boton-fuego"},
    {nombre: "🔥", id: "boton-fuego"},   
    {nombre: "🔥", id: "boton-fuego"},
    {nombre: "💧", id: "boton-agua"},
    {nombre: "🌱", id: "boton-tierra"},
]

conejis.ataques.push(...COREJO_ATAQUES)

function iniciarJuego() {
    sectionSeleccionAtaque.style.display = "none"
    sectionReiniciar.style.display = "none"
    sectionVerMapa.style.display = "none"

    mascotasElements.forEach((mascota)  => {
        opcionDeMascotas = `
        <input type="radio" name="mascota" id="${mascota.nombre}"/>
        <label class="tarjeta-de-elements" for="${mascota.nombre}">
                <p>${mascota.nombre}</p>
                <img src=${mascota.foto}  alt="${mascota.nombre}">
        </label>
        `
        contenedorTarjetas.innerHTML += opcionDeMascotas 

        inputPerruno = document.getElementById("Perruno")
        inputGatino = document.getElementById("Menki")
        inputConejis = document.getElementById("Corejo")
    })


    botonMascotaJugador.addEventListener("click", seleccionarMascotaJugador)
  
    botonReiniciar.addEventListener("click", reiniciarJuego)

    unirseAlJuego()
}
 
function unirseAlJuego() {
    fetch("http://10.0.0.5:8081/unirse")
        .then(function (res) {
            if (res.ok) {
                res.text()
                    .then(function (respuesta) {
                        console.log(respuesta)
                        jugadorId = respuesta
                    })
            }
        })
}

function crearMensajes(resultado) {
    let nuevoAtaqueJugador = document.createElement("p")
    let nuevoAtaqueEnemigo = document.createElement("p")

    sectionMensajes.innerHTML = resultado
    nuevoAtaqueJugador.innerHTML = indexAtaqueJugador
    nuevoAtaqueEnemigo.innerHTML = indexAtaqueEnemigo

    ataqueDelJugador.appendChild(nuevoAtaqueJugador)
    ataqueDelEnemigo.appendChild(nuevoAtaqueEnemigo)

}

function crearMensajeFinal(resultadoFinal) {  
    sectionMensajes.innerHTML = resultadoFinal

    sectionReiniciar.style.display = "block"
}

function indexOponentes(jugador, enemigo) {
    indexAtaqueJugador = ataqueJugador[jugador]
    indexAtaqueEnemigo = ataqueEnemigo[enemigo]
}

function combate () {   
    clearInterval(intervalo)

    for (let index = 0; index < ataqueJugador.length; index++) {
       if(ataqueJugador[index] === ataqueEnemigo[index]) {
        indexOponentes(index, index)
        crearMensajes("EMPATE")
       } else if( ataqueJugador[index] === "FUEGO" && ataqueEnemigo[index] === "TIERRA") {
        indexOponentes(index, index)
        crearMensajes("HEEEY... DURO! GANASTE")
        victoriasJugador++
        spanVidasJugador.innerHTML = victoriasJugador
       } else if( ataqueJugador === "AGUA" && ataqueEnemigo === "FUEGO") {
        indexOponentes(index, index)
        crearMensajes("HEEEY... DURO! GANASTE")
        victoriasJugador++
        spanVidasJugador.innerHTML = victoriasJugador
       } else if( ataqueJugador === "TIERRA" && ataqueEnemigo === "AGUA") {
        indexOponentes(index, index)
        crearMensajes("HEEEY... DURO! GANASTE")
        victoriasJugador++
        spanVidasEnemigo.innerHTML = victoriasJugador
       } else  {
        indexOponentes(index, index)
        crearMensajes("Que pasó mi loco? PERDISTE" )
        victoriasEnemigo++
        spanVidasEnemigo.innerHTML = victoriasEnemigo
        
       } 
    }

    revisarVidas()
}

function revisarVidas() {
    if (victoriasJugador === victoriasEnemigo) {
        crearMensajeFinal("Has empatado")   
    } else if(victoriasJugador > victoriasEnemigo) {
   crearMensajeFinal("Felicitaciones! Ganaste")
    }  else {
    crearMensajeFinal ("Lo siento mucho! Perdiste")
    }
}

function seleccionarMascotaJugador () {
    
    if(inputPerruno.checked) {
        spanNombreMascota.innerHTML = inputPerruno.id
         mascotaJugador = inputPerruno.id
    } else if(inputGatino.checked) {
        spanNombreMascota.innerHTML = inputGatino.id
        mascotaJugador = inputGatino.id
    } else if(inputConejis.checked) {
        spanNombreMascota.innerHTML = inputConejis.id
        mascotaJugador = inputConejis.id
    } else {
        alert("Debes seleccionar tu mascota")  
        return 
    }

    sectionSeleccionMascota.style.display = "none"
    sectionVerMapa.style.display = "flex"

    seleccionarMascota(mascotaJugador)

    iniciarMapa()
    extraerAtaques(mascotaJugador)
 }

 function seleccionarMascota(mascotaJugador) {
    fetch(`http://10.0.0.5/:8081/mascota/${jugadorId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mascota: mascotaJugador
        })
    })
 }

function extraerAtaques(mascotaJugador) {
    let ataques
    for (let i = 0; i <mascotasElements.length; i++) {
        if (mascotaJugador === mascotasElements[i].nombre) {
            ataques = mascotasElements[i].ataques  
        }    
    }
    mostrarAtaques(ataques)
 }

function mostrarAtaques(ataques) {
     ataques.forEach((ataque) => {
        ataquesMascotas = `
        <button id=${ataque.id} class="boton-de-ataque BAtaque">${ataque.nombre}</button>
        `
        contenedorAtaques.innerHTML += ataquesMascotas
     })

     botonFuego = document.getElementById("boton-fuego")
     botonAgua = document.getElementById("boton-agua")
     botonTierra = document.getElementById("boton-tierra")
     botones = document.querySelectorAll(".BAtaque")
 }

function secuenciaAtaque() {
     botones.forEach((boton)=> {
        boton.addEventListener("click", (e) => {
            if (e.target.textContent === "🔥") {
                ataqueJugador.push("FUEGO")
                console.log(ataqueJugador)
                boton.style.background = "#112f58"
                boton.disabled = true
            } else if (e.target.textContent === "💧") {
                ataqueJugador.push("AGUA")
                console.log(ataqueJugador)
                boton.style.background = "#112f58"
                boton.disabled = true
            } else {
                ataqueJugador.push("TIERRA")
                console.log(ataqueJugador)
                boton.style.background = "#112f58"
                boton.disabled = true
            }
            if(ataqueJugador.length === 5){
                enviarAtaques()
            }
        })
     })
 }

function enviarAtaques() {
    fetch(`http://10.0.0.5:8081/mascota/${jugadorId}/ataques`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ataques: ataqueJugador
        })
    })

    intervalo = setInterval(obtenerAtaques, 50)
}

function obtenerAtaques() {
    fetch(`http://10.0.0.5:8081/mascota/${enemigoId}/ataques`)
        .then(function (res) {
            if (res.ok) {
                res.json()
                    .then(function ({ ataques }) {
                        if (ataques.length === 5) {
                            ataqueEnemigo = ataques
                            combate()
                        }
                    })
            }
        })
       
}

function seleccionarMacostaEnemigo(enemigo){
    spanMascotaEnemigo.innerHTML = enemigo.nombre 
    ataquesMascotaEnemigo = enemigo.ataques

    secuenciaAtaque() 
 }

function ataqueAleatorioEnemigo() {
    let ataqueAleatorio = aleatorio(0,ataquesMascotaEnemigo.length -1)
     
    if (ataqueAleatorio == 0 || ataqueAleatorio == 1) {
        ataqueEnemigo.push("FUEGO") 
    } else if (ataqueAleatorio == 3 || ataqueAleatorio == 4) {
        ataqueEnemigo.push("AGUA")
    } else  {
        ataqueEnemigo.push("TIERRA")
    }
    console.log(ataqueEnemigo)
    iniciarCombate()
}

function iniciarCombate() {
    if (ataqueJugador.length === 5) {
        combate()
    }
}

function reiniciarJuego () {
       location.reload()
 }

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function pintarCanvas() {
    mascotaJugadorObjeto.x = mascotaJugadorObjeto.x + mascotaJugadorObjeto.velocidadX
    mascotaJugadorObjeto.y = mascotaJugadorObjeto.y + mascotaJugadorObjeto.velocidadY
    lienzo.clearRect(0, 0, mapa.clientWidth, mapa.height)
    lienzo.drawImage(
        mapaBackground,
        0,
        0,
        mapa.width,
        mapa.height
    )
    mascotaJugadorObjeto.pintarMascota()

    enviarPosicion(mascotaJugadorObjeto.x, mascotaJugadorObjeto.y)

    mascotasEnemigos.forEach(function (mascota) {
        mascota.pintarMascota()
        revisarColision(mascota)
    })
}

function enviarPosicion(x, y) {
    fetch(`http://10.0.0.5:8081/mascota/${jugadorId}/posicion`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            x,
            y
        })
    })
    .then(function (res) {
        if (res.ok) {
            res.json()
                .then(function ({ enemigos }) {
                    console.log(enemigos)
                    mascotasEnemigos = enemigos.map(function (enemigo) {
                        let mascotaEnemigo = null
                        const mascotaNombre = enemigo.mascota.nombre || ""
                        if (mascotaNombre === "Perruno") {
                            mascotaEnemigo = new Mascota("Perruno", "./assets/mokepons_mokepon_hipodoge_attack.png", 5, "./assets/perruno.png", enemigo.id)
                        } else if (mascotaNombre === "Menki") {
                            mascotaEnemigo = new Mascota("Menki", "./assets/mokepons_mokepon_capipepo_attack.png", 5, "./assets/menki.png", enemigo.id)
                        } else if (mascotaNombre === "Corejo") {
                            mascotaEnemigo = new Mascota("Corejo", "./assets/mokepons_mokepon_ratigueya_attack.png", 5, "./assets/corejo.png", enemigo.id)
                        }

                        mascotaEnemigo.x = enemigo.x
                        mascotaEnemigo.y = enemigo.y

                         return mascotaEnemigo
                    })
                })
            }        
    })            
}

function moverDerecha () {
    mascotaJugadorObjeto.velocidadX = 5
}

function moverIzquierda () {
    mascotaJugadorObjeto.velocidadX = -5
}

function moverAbajo () {
    mascotaJugadorObjeto.velocidadY = 5
}

function moverArriba () {
    mascotaJugadorObjeto.velocidadY = -5
}

function detenerMovimiento() {
    mascotaJugadorObjeto.velocidadX = 0
    mascotaJugadorObjeto.velocidadY = 0
}

function teclaPresionada(event) {
    switch (event.key) {
        case "ArrowUp":
            moverArriba()
            break
        case "ArrowDown":
            moverAbajo()
            break
        case "ArrowLeft":
            moverIzquierda()
            break
        case "ArrowRight":
            moverDerecha()
            break
        default:
            break;
    }
}

function iniciarMapa () {
    mascotaJugadorObjeto = obtenerObjetoMascota(mascotaJugador)

   intervalo = setInterval(pintarCanvas, 50)

    window.addEventListener("keydown", teclaPresionada)

    window.addEventListener("keyup", detenerMovimiento)
}

function obtenerObjetoMascota () {
    for (let i = 0; i <mascotasElements.length; i++) {
        if (mascotaJugador === mascotasElements[i].nombre) {
            return mascotasElements[i]
        }    
    }
}

function revisarColision (enemigo) {
    const arribaEnemigo = enemigo.y
    const abajoEnemigo = enemigo.y + enemigo.alto
    const derechaEnemigo = enemigo.x + enemigo.ancho
    const izquierdaEnemigo = enemigo.x 

    const arribaJugador = mascotaJugadorObjeto.y
    const abajoJugador = mascotaJugadorObjeto.y + mascotaJugadorObjeto.alto
    const derechaJugador = mascotaJugadorObjeto.x + mascotaJugadorObjeto.ancho
    const izquierdaJugador = mascotaJugadorObjeto.x 

    if (
        abajoJugador < arribaEnemigo ||
        arribaJugador > abajoEnemigo ||
        derechaJugador < izquierdaEnemigo ||
        izquierdaJugador > derechaEnemigo
    ) {
        return
    }
    detenerMovimiento()
    clearInterval(intervalo)

    enemigoId = enemigo.id
    sectionSeleccionAtaque.style.display = "flex"
    sectionVerMapa.style.display = 'none'
    seleccionarMacostaEnemigo(enemigo)
}

window.addEventListener("load", iniciarJuego)