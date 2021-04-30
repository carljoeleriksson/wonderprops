/**     DATABASE-OPERATIONS
 *      --Här ligger alla databas-funktioner som exporteras till endpoints och server.
 */

/** 
 * 	- Databasens syfte: Lagra information om produkter.
 * 	- Data vi vill spara: Namn | Pris | Bild-URL | ID
 * 	- Typ av data: Arrayer där varje item är ett objekt som innehåller strängar & booleans.
*/

//Importera NPM-modules
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('webshop.json');
const database = lowdb(adapter);

//Funktion som startar databasen om den inte redan finns.
exports.initDatabase = () => {
    const hasProductDatabase = database.has('products').value();
    const hasCartDatabase = database.has('cart').value();

    if (!hasProductDatabase && !hasCartDatabase) {
		database.defaults({ products: [], productsCount: 0, cart: [], cartCount: 0 }).write();
    }
};

//PRODUCT-DATABASE

//Funktion som hämtar alla produkter i databasen.
exports.getProducts = () => {
    return database.get('products').value();
};
//Funtion som kollar om produktnamnet finns i databasen.
exports.productExists = (nameInput) => {
    return database.get('products').find({ name: nameInput }).value();
};
//Funktion som lägger till ny produkt i databasen.
exports.addProduct = (newProduct) => {
    return database.get('products').push(newProduct).write();
};


// CART-DATABASE

//Funktion som hämtar alla produkter i kundvagnen.
exports.getCart = () => {
    return database.get('cart').value();
};

//Funktion som kollar om produkt-id:t finns i kundvagnen
exports.idExists = (productId) => {
    return database.get('cart').find({ id: productId }).value();
};

//Funktion som kollar om produkt-id:t finns i produkt-databasen och returnerar hela objektet.
exports.newCartItem = (productId) => {
    return database.get('products').find({ id: productId }).value();
};

//Funktion som lägger till produkt i Cart-databasen.
exports.addToCart = (cartItem) => {
    return database.get('cart').push(cartItem).write();
};

//Funktion som tar bort en produkt fr Cart-databasen.
exports.deleteFromCart = (productId) => {
    return database.get('cart').remove({ id: productId }).write();
};


// COUNT
//Sätter värdet på respektive räknare till längden på respektive array och returnerar det.
exports.count = (dbName) => {
    const length = database.get(dbName).value().length;
    database.set(`${dbName}Count`, length).write();
    return database.get(`${dbName}Count`).value();
};