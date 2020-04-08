class ChatLog{

	/**
	* @param {DOMNode} container
	*/
	constructor(container){
		this.container = container;
	}

	/**
	* Adds a message to the chat log
	*
	* @param {string} message
	*/
	addMessage(message){
		const newMessageContainer = document.createElement("div");
		const messageText = document.createElement("span");

		messageText.textContent = message;

		newMessageContainer.append(messageText);
		this.container.prepend(newMessageContainer);
	}
}

export default ChatLog;
