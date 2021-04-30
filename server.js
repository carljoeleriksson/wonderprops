/** 	SERVER
 * 		--Här ligger all server-relaterad kod.
 */

//Importera npm-modules
const express = require('express');
const app = express();

//Deklarera vilka filer vi vill använda som database och endpoints.
const database = require('./modules/database-operations');
const endpoints = require('./modules/endpoints');

//Deklarerar vilken localhost-port appen ska lyssna på.
const port = process.env.PORT || 8000;

//Parse:ar alla anrop till JSON.
app.use(express.json());
app.use(express.static('./frontend'));

endpoints(app);

//Om ingen endpoint matchar så går request in i nedanstående funktion och skickar tillbaka ett felmeddelande.
app.use((request, response) => {
	const result = {
	  success: false,
	  message: 'No such endpoint was found'
	}
  
	response.status(404).json(result);
  });

//Sätter vilken localhost-port appen ska lyssna på.
app.listen(port, () => {
	console.log('Server up and running! Port: ', port);
	database.initDatabase();
});