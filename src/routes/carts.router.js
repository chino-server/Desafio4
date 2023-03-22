import { Router } from "express";
import { __dirname } from '../utils.js'
import { ManagerCarts } from "../managerCarts.js";

const router = Router ()

const managerCarts = new ManagerCarts (__dirname +'/Carts.json')



//Buscar un Carrito
router.get('/:cid', async (req, res) => {
    try{
        const {cid} = req.params;
        const cart = await managerCarts.getCart(parseInt(cid));
        if (cart) {
                res.status(200).send({ status: "success", payload: cart });
            } else {
                res.status(404).send({ status: "error", error: 'Carrito no se encuentra' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).send({ status: "error", error: 'Error al obtener el carrito' });
        }  
});

//Agregar un Producto un carrito
router.post('/:cid/product/:pid', async(req,res) =>{
    try{
        const {cid, pid} = req.params;
        const cart = await managerCarts.addProductToCart(+cid, +pid);
        
        if (cart) {
            res.status(201).send({ status: "success", payload: cart });
        } else {
            res.status(404).send({ status: "error", error: 'Carrito o producto no encontrado' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ status: "error", error: 'No se puede agregar al carrito'});
    }
})

router.post("/", async (req, res) => {
    await managerCarts.createCart();
    res.status(201).json({ mensaje: "Carrito creado con exito" });
  });
export default router









