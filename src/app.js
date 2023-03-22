import express from 'express'
import { __dirname } from './utils.js'
import handlebars from 'express-handlebars'
import useCarts from './routes/carts.router.js'
import useProducts from './routes/products.router.js'
import viewsRouter from './routes/views.router.js'
import ProductManager from './productManager.js'
import { Server } from 'socket.io';


const app = express ()

app.use (express.json ())
app.use (express.urlencoded({extended:true}))



app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

//Configurando motor de plantillas Handlebars
app.engine('handlebars', handlebars.engine());

// configurar la carpeta de vistas (views) y el motor de plantillas (template engine) para que use handlebars
app.set('views', __dirname + '/views');

// configurar el motor de plantillas (template engine) para que use handlebars
app.set('view engine', 'handlebars');


app.use ('/api/carts',useCarts)
app.use ('/api/products', useProducts)
app.use ('/views',viewsRouter)





const httpServer = app.listen (8080, ()=>{
    console.log("Servidor arriba");
})

const productManager = new ProductManager(__dirname + '/productos.json')
const products = await productManager.getProducts()
// inicializar el socket.io con el servidor http


const io = new Server(httpServer);

io.on('connection', (socket) => {
    console.log(`Un cliente se ha conectado ${socket.id}`);

    
    socket.emit('message0', 'Conectado con el servidor');

    socket.broadcast.emit('message1', `Un nuevo cliente conectado con id: ${socket.id}`);

    socket.on('createProduct', async (product) => {

        const productsPush = products   ;
        productsPush.push(product);

        io.emit('product-list', productsPush);

        socket.broadcast.emit('message3', `El cliente con id: ${socket.id} ha creado un producto nuevo`);

        await productManager.addProduct(product);
    });

    socket.on('deleteProduct', async (id) => {

        const productsPush = products.filter((product) => product.id !== id);

        io.emit('product-list', productsPush);

        socket.broadcast.emit('message4', `El cliente con id: ${socket.id} ha eliminado un producto con id: ${id}`);

        await productManager.deleteProduct(id);
    });

    socket.on('disconnect', () => {
        console.log('Un cliente se ha desconectado');

        io.emit('message2', `Un cliente se ha desconectado con id: ${socket.id}`);

    });
});

