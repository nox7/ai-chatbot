import SocketClient from "./_socket-client.js";
import Renderer from "./_render.js";

(function(){
	let form = document.getElementById("send-form");
	let chatLog = document.getElementById("chat-log");
	let messageInput = document.getElementById("message-input");
	const socket = new SocketClient();

	let renderer = new Renderer();
	renderer.renderInitialBrainMap();

	function writeToChatLog(author, message){
		let item = document.createElement("div");
		let authorItem = document.createElement("span");
		let messageItem = document.createElement("span");

		authorItem.innerHTML = "<strong>" + author + "</strong>: ";
		messageItem.innerHTML = message;
		item.append(authorItem);
		item.append(messageItem);

		chatLog.prepend(item);
	}

	function writeNotificationToChatLog(message){
		let item = document.createElement("div");
		let notificationItem = document.createElement("span");

		notificationItem.classList.add("text-warning");
		notificationItem.innerHTML = message;
		item.append(notificationItem);

		chatLog.prepend(item);
	}

	form.addEventListener("submit", (event) => {
		event.preventDefault();

		let sendingMessage = messageInput.value.trim();
		messageInput.value = sendingMessage;

		if (sendingMessage.length > 0){
			let fData = new FormData(form);

			writeToChatLog("user", sendingMessage);
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
				payload.neuralChunks.forEach( neuralChunk => {
					neuralChunk.rawNeurons.forEach( neuron => {
						renderer.createNeuronMesh({x:neuron.x, y:neuron.y, z:neuron.z}, neuron.label, neuron.dendrites);
					});
				});

				payload.messageHistory.forEach( message => {
					if (message.type === "message"){
						writeToChatLog(message.author, message.message);
					}else if (message.type === "notification"){
						writeNotificationToChatLog(message.message);
					}
				});
			}else if (payload.event === "incomingMessage"){
				if (payload.messageType === "message"){
					writeToChatLog(payload.author, payload.message);
				}else if (payload.messageType === "notification"){
					writeNotificationToChatLog(payload.message);
				}
			}

		}
	}
})();
