import SocketClient from "./_socket-client.js";
import ChatLog from "./_chat-log.js";

(() => {
	const socket = new SocketClient();
	const chatLog = new ChatLog(document.querySelector("#log-container"));
	const emoteButtons = document.querySelectorAll(".emote-button");
	const toneInput = document.querySelector("#tone");

	for (let btn of emoteButtons){
		btn.addEventListener("click", () => {
			let currentlySelectedButton = document.querySelector(".emote-button.selected");
			if (currentlySelectedButton !== null){
				if (currentlySelectedButton !== btn){
					currentlySelectedButton.classList.remove("selected");
					btn.classList.add("selected");
					toneInput.value = btn.getAttribute("tone");
				}else{
					btn.classList.remove("selected");
					toneInput.value = "";
				}
			}else{
				btn.classList.add("selected");
				toneInput.value = btn.getAttribute("tone");
			}
		});
	}

	document.querySelector("#send-form").addEventListener("submit", e => {
		e.preventDefault();

		let input = document.querySelector("#input-message");
		const message = input.value.trim();

		if (message.length > 0){
			if (toneInput.value !== ""){
				input.value = "";
				chatLog.addMessage(message);

				socket.send(JSON.stringify({
					event:"message",
					message:message,
					tone:toneInput.value
				}));
			}
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
