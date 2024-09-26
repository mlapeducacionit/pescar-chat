import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'

// ! Constantes/Variables
const app = express()
const PORT = process.env.PORT

// ! Agrego la librería socket.io
const server = createServer(app)
const io = new Server(server) // genero el objeto io que tiene varios métodos que nos va a permitir crear un servidor trabajando con websocket
/* import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

console.log(import.meta.url)
console.log(fileURLToPath(import.meta.url))
console.log(dirname(fileURLToPath(import.meta.url)))
const __dirname = dirname(fileURLToPath(import.meta.url))
const armaRuta = join(__dirname, 'index.html')
console.log(armaRuta) */
let clienteConectado = 0
const mensajes = [
    { usuario: 'Fulanito', mensaje: 'Hola! Que tal!'},
    { usuario: 'Menganito', mensaje: 'Muy bien y vos?'},
    { usuario: 'Sultanito', mensaje: 'Genial'},
]

// ! Middleware
app.use(express.static('./public'))

// ! Rutas
app.get('/', (req, res) => {
    res.send('OK')
})



// https://socket.io/docs/v4/tutorial/introduction
// addEventListerner( 'click'     , callback )
io.on('connection', (socket) => { // ! Estoy esperando conexiones de clientes.
    console.log('Un cliente se conectó al servidor', socket.id)
    clienteConectado++
    console.log(clienteConectado)

    // ! Emitir un mensaje desde el server al cliente
    socket.emit('nombre', 'Maximiliano')
    socket.emit('array-objetos', [
        {id: 1}, {id: 2}, {id: 3}, {id: 4}
    ])

    // ? Emitimos los mensajes del CHAT
    socket.emit('mensajes', mensajes)

    // ! Recibir un mensaje desde el el cliente
    socket.on('mensaje-cliente', data => {
        console.log(data)
    })

    // ? Estoy atento a los nuevos comentarios que me envíe el cliente
    socket.on('nuevo-comentario', data => {

        console.log(data)
        mensajes.push(data)
        io.sockets.emit('mensajes', mensajes)

    })

    socket.on('disconnect', () => {
        console.log('Cliente desconectado', socket.id)
        clienteConectado--
        console.log(clienteConectado)
    })
})

// ! Arranque el servidor no uso app -> el server creado con la API http de NODE
server.listen(PORT, (err) => {
    if (err) throw new Error(`No se pudo levantar el servidor -> ${err}`)
    console.log(`Aplicación arrancó -> http://localhost:${PORT}`)
})