(function(){
	let form = document.getElementById("send-form");
	let chatLog = document.getElementById("chat-log");
	let messageInput = document.getElementById("message-input");

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

			fetch("/api/process", {
				cache:"no-cache",
				method:"post",
				body:fData,
			}).then(function(response){
				response.json().then(function(data){
					document.getElementById("hormone-a-level").innerText = data.hormoneA;
					document.getElementById("hormone-b-level").innerText = data.hormoneB;
					document.getElementById("hormone-c-level").innerText = data.hormoneC;
					document.getElementById("hormone-x-level").innerText = data.hormoneX;
				});
			});
		}
	});
})();
