import SocketClient from "./_socket-client.js";
import Renderer from "./_render.js";

(function(){
	let form = document.getElementById("send-form");
	let chatLog = document.getElementById("chat-log");
	let messageInput = document.getElementById("message-input");
	const socket = new SocketClient();

	let renderer = new Renderer();
	renderer.renderInitialBrainMap();

	function writeToChatLog(message){
		let item = document.createElement("div");
		let messageItem = document.createElement("span");

		messageItem.innerHTML = message;
		item.append(messageItem);

		chatLog.append(item);
	}

	form.addEventListener("submit", (event) => {
		event.preventDefault();

		let sendingMessage = messageInput.value.trim();
		messageInput.value = sendingMessage;

		if (sendingMessage.length > 0){
			let fData = new FormData(form);

			writeToChatLog(sendingMessage);
			messageInput.value = "";

			socket.send(
				{
					spokenMessage: fData.get("message"),
					speakerMood: fData.get("speaker-mood")
				}
			);
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

			if (payload.event === "init"){
				payload.neurons.forEach((neuron) => {
					renderer.createNeuronMesh({x:neuron.x, y:neuron.y, z:neuron.z});
				});
			}

		}
	}
})();
