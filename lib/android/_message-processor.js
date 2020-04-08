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
	* @param {string} speakerTone
	* @param {string} message
	*/
	async process(speakerID, message, speakerTone){
		try{
			const connection = await MySQLWrapper.getConnection();
			const result = await connection.execute(
				'INSERT INTO `digest_memory` (speaker_id, speaker_tone, message, timestamp) VALUES (?,?,?,unix_timestamp())',
				[speakerID, speakerTone, message]
			);
		}catch(e){
			console.log(`MySQL error: ${e}`);
		}
	}
}

module.exports = MessageProcessor;
