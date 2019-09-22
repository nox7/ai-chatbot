import SocketClient from "./_socket-client.js";

(function(){
	let form = document.getElementById("send-form");
	let chatLog = document.getElementById("chat-log");
	let messageInput = document.getElementById("message-input");
	const socket = new SocketClient();

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

			document.getElementById("hormone-a-level").innerText = payload.hormoneA;
			document.getElementById("hormone-b-level").innerText = payload.hormoneB;
			document.getElementById("hormone-c-level").innerText = payload.hormoneC;
			document.getElementById("hormone-x-level").innerText = payload.hormoneX;
		}
	}
})();
