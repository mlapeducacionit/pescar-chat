
// Creando un cliente
const socket = io.connect()

// -------------------------------------

// Renderizado de los mensajes recibos

function render(data) {

    let html = data.map(msj => {
        return (
            `
                <div>
                    <strong>${msj.usuario}:</strong>
                    <em>${msj.mensaje}</em>
                </div>
            `
        )
    }).join(' ')
    console.log(html)
    document.querySelector('.mensajes').innerHTML = html
}


// -------------------------------------
// Emitiendo lo escrito en el formulario

function agregarMensaje(e) {
    e.preventDefault()

    const nombre = document.querySelector('#lbl-nombre')
    const mensaje = document.querySelector('#lbl-mensaje')

    const obj = {
        usuario: nombre.value, // Maxi
        mensaje: mensaje.value // 'Hola mundo!
    }
    console.log(obj)
    // ? Emito el nuevo mensaje que se va a recibir en el servidor
    socket.emit('nuevo-comentario', obj)

    nombre.value = ''
    mensaje.value = ''

}

const btn = document.querySelector('#btn')
const form = document.querySelector('form')
form.addEventListener('submit', agregarMensaje)



// -------------------------------------



// ! Recibir mensajes desde el servidor
socket.on('nombre', data => {
    console.log(data)
})

socket.on('array-objetos', data => {
    console.log(data)
})

// ? Recibimos los mensajes del CHAT
socket.on('mensajes', data => {
    console.log(data)
    render(data)
})

// ! Emitir mensajes desde el cliente
const saludo = 'Hola soy el cliente'
socket.emit('mensaje-cliente', saludo)
