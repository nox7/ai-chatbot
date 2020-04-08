const MessageProcessor = require("./_message-processor");

class Android{

	/**
	* Load a new android
	*
	* @param {name} The name of the android
	*/
	constructor(name){
		this.name = name;
	}

	/**
	* Consumes a message as having been processed
	*
	* This allows the android to acknowledge a message
	* and a boolean is returned that will determine if the android
	* wishes to respond or not
	*
	* @param {string} message
	* @return {bool} Whether or not it wants to respond
	*/
	async digestMessage(message){
		const processor = new MessageProcessor(this);
		processor.process("cole", message);

		return false;
	}
}

module.exports = Android;
