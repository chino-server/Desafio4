import fs from "fs";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    if (fs.existsSync(this.path)) {
      const infoProducts = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(infoProducts);
      return products;
    } else {
      console.log("No hay productos");
      return [];
    }
  }

  async addProduct(product) {
   
    const products = await this.getProducts();
    let id
    if (products.length === 0) {
      id = 1;
    } else {
      id = products[products.length -1].id + 1;
      
    }

    const newProduct = { id, ...product };
    products.push(newProduct);
    await fs.promises.writeFile(this.path, JSON.stringify(products));
    return products;
  }

  productById = async (id)=>{
    const products = await this.getProducts ()
    const product = products.find((product)=>product.id ===id)
    if (!product){
        return console.log('Producto no encontrado');
    }
    else{
        return product
    }

}

  updateProduct = async (id, update)=> {
    const products = await this.getProducts();
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) {
        return null;
    }
    const updatedProduct = { ...products[index], ...update, id };
    products.splice(index, 1, updatedProduct);
    await fs.promises.writeFile(this.path, JSON.stringify(products));;
    return updatedProduct;
}

  async deleteProducts() {
    if (fs.existsSync(this.path)) {
        await fs.promises.unlink(this.path);
        return "Products deleted";
    } else {
        return "No products found";
    }
}

  async deleteProductById(idProd) {
    const productsFile = await this.getProducts();
    const productIndex = productsFile.findIndex((p) => p.id === idProd);
    if (productIndex === -1) {
        return "Product doesn't exist";
    } else {
        productsFile.splice(productIndex, 1);
        await fs.promises.writeFile(this.path, JSON.stringify(productsFile));
        return "Product deleted";
    }
}

}
