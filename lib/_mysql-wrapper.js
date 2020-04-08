const mysql = require("mysql2/promise");


class MySQLWrapper{

	constructor(){
		
	}

	static async getConnection(){
		const mysql_connection = await mysql.createConnection({
			host:"localhost",
			user:"root",
			database:"android_1_memory",
			password:""
		});

		return mysql_connection;
	}
}

module.exports = MySQLWrapper
