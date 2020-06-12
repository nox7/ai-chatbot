const mysql = require("mysql2/promise");


class MySQLWrapper{

	constructor(){

	}

	static async getConnection(){
		const mysql_connection = await mysql.createConnection({
			host:process.env.mysql_host,
			user:process.env.mysql_username,
			database:process.env.mysql_database,
			password:process.env.mysql_password
		});

		return mysql_connection;
	}
}

module.exports = MySQLWrapper
