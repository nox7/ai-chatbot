const fs = require("fs");
const environmentJSON = fs.readFileSync("./env.json");
const environmentData = JSON.parse(environmentJSON);

// Load environment variables
for (let key of Object.keys(environmentData)){
	process.env[key] = environmentData[key];
};

const http = require("http");
const app = require("./app");
const socketServer = require("./app-websocket-server");
const MySQLModeler = require("./lib/mysql-modeler"); // Path to the main class
const mysql2 = require("mysql2/promise"); // NPM mysql2 package

(async () => {
	const mysqlConnection = await mysql2.createConnection({
		host:process.env.mysql_host,
		user:process.env.mysql_username,
		database:process.env.mysql_database,
		password:process.env.mysql_password
	});
	const modeler = new MySQLModeler(mysqlConnection);
	await modeler.sync(require("./models/chat_digest"));
	mysqlConnection.close();
})();

let httpServer = http.createServer({}, app).listen(3000);
new socketServer(httpServer);
