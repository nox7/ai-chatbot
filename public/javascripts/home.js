import SocketClient from "./_socket-client.js";

(function(){
	const socket = new SocketClient();

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
