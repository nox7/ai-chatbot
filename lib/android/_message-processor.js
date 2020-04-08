const MySQLWrapper = require("../_mysql-wrapper");

class MessageProcessor{
	/**
	* @param {Android} The processor owner
	*/
	constructor(android){
		this.android = android;
	}

	/**
	* Processes a message
	*
	* @param {string|int} speakerID Who/what spoke the message?
	* @param {string} message
	*/
	async process(speakerID, message){
		try{
			const connection = await MySQLWrapper.getConnection();
			const t = await connection.execute(
				'INSERT INTO `digest_memory` (speaker_id, message, timestamp) VALUES (?,?,unix_timestamp())',
				[speakerID, message]
			);
		}catch(e){
			console.log(`MySQL error: ${e}`);
		}
	}
}

module.exports = MessageProcessor;
