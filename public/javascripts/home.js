import SocketClient from "./_socket-client.js";
import ChatLog from "./_chat-log.js";

(() => {
	const socket = new SocketClient();
	const chatLog = new ChatLog(document.querySelector("#log-container"));

	document.querySelector("#send-form").addEventListener("submit", e => {
		e.preventDefault();

		let input = document.querySelector("#input-message");
		const message = input.value.trim();

		if (message.length > 0){
			input.value = "";
			chatLog.addMessage(message);

			socket.send(JSON.stringify({
				event:"message",
				message:message
			}));
		}
	});

	socket.onError = (err) => {
		console.log("Error");
		console.log(err);
	}

	socket.onMessage = (shipment) => {
		console.log("Received data");
		console.log(shipment);
		if (typeof shipment.data == "string"){
			let dataString = shipment.data;
			let payload = JSON.parse(dataString);

			if (!("event" in payload)){
				console.log("No event in payload from WebSocket");
			}

		}
	}
})();
