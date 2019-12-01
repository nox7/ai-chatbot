class MessageHistory{
	constructor(){
		this.messages = [];
	}

	/**
	* Adds a message to the chat history
	*
	* @param {string} author
	* @param {string} message
	* @param {int} timestamp Unix timnestamp
	* @return {undefined}
	*/
	addMessageToHistory(author, message, timestamp){
		this.messages.push({
			type:"message",
			author:author,
			message:message,
			timestamp:timestamp
		});
	}

	/**
	* Adds a notification to the message history
	*
	* @param {string} message
	* @param {int} timestamp Unix timnestamp
	* @return {undefined}
	*/
	addNotificationToHistory(message, timestamp){
		this.messages.push({
			type:"notification",
			author:undefined,
			message:message,
			timestamp:timestamp
		});
	}

	/**
	* Gets the message history
	*
	* @return {object[]}
	*/
	getHistory(){
		return this.messages;
	}
}

module.exports = MessageHistory
