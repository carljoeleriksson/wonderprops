/** 	ENDPOINTS
 * 		--Här ligger alla endpoints (routes) för API:et och dess funktionalitet.
 */

const { nanoid } = require('nanoid');
const database = require('./database-operations');

/**
 * Endpoints för följande funktionalitet:
 * 		-Lägga till produkt i produkt-databasen.
 * 		-Hämta alla produkter i databasen.
 * 		-Lägga till en produkt i en varukorg.
 * 		-Ta bort en produkt från en varukorg.
 * 		-Hämta alla produkter i en varukorg.
 */

module.exports = (app) => {

	const productsDB = database.getProducts();
	const cartDB = database.getCart();


// PRODUCTS

//Hämta hela produkt-databasen
	app.get('/api/webshop/products', (request, response) => {
		const result = {
			productsCount: database.count('products'),
			allProducts: productsDB
		}
		response.json(result);
	});

//Hämta alla produkter i kundvagnen
	app.get('/api/webshop/cart', (request, response) => {
		const result = {
			cartCount: database.count('cart'),
			cart: cartDB
		}
		response.json(result);
	});

//Lägg till ny produkt i produktlistan
	app.post('/api/webshop/addproduct', (request, response) => {
		const newProduct = request.body;
		newProduct.id = nanoid(4); //Lägger till ett unikt 4-siffrigt id på varje produkt.
		const newProductName = request.body.name;
		const productExists = database.productExists(newProductName);	//productExists kollar om produktnamet finns i databasen.

		const result = {}

//Om produktnamnet inte finns i produktdatabasen körs koden.
		if (!productExists) {
			database.addProduct(newProduct);
			database.count('products'); //Uppdatera objektet count i products-databasen.
			result.success = true;
			result.message = `${newProduct.name} added to database!`;
			result.count = `Products in database: ${database.count('products')}`;
			
		} else {
			result.success = false;
			result.message = `The name ${newProduct.name} already exists`;
			}
		response.json(result);
	});


// CART

//Lägg till produkt i varukorg
	app.post('/api/webshop/addtocart/:id', (request, response) => {
		const productId = request.params.id;
		const idExists = database.idExists(productId); //idExists kollar om produkt-id:t finns i kundvagnen
		const newCartItem = database.newCartItem(productId); //newCartItem kollar om produkt-id:t finns i produkt-databasen och returnerar hela objektet.
		
		let result = {};

//Om produkten redan finns i varukorg OCH om produkten finns i produkt-databasen:
		if(!idExists && newCartItem){
			database.addToCart(newCartItem);
			result.success = true;
			result.message = `${newCartItem.name} added to cart!`;
			result.count = database.count('cart');
		
		} else if(!newCartItem) { // Om produkten inte finns i produkt-databasen:
			result.success = false;
			result.message = 'No such product.';
			result.count = database.count('cart');
		
		} else {
			result.success = false;
			result.message = `${newCartItem.name} already in cart!`;
			result.count = database.count('cart');
		}

		response.json(result);
	});

//Ta bort produkt från varukorg
	app.delete('/api/webshop/removefromcart/:id', (request, response) => {
		const productId = request.params.id;
		const cartItem = database.deleteFromCart(productId);
		
		let result = {};

		if(cartItem.length > 0) {
			database.count('cart'); //Uppdatera objektet count i cart-databasen.
			result.success = true;
			result.message = 'Product removed from cart!';
			result.count = database.count('cart');
			result.cart = cartDB;
		} else {
			result.success = false;
			result.message = 'No products in your cart.';
			result.count = database.count('cart');
		}
		response.json(result);
	});


}; //Här stängs module.exports funktionen