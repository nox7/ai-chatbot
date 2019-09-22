class SocketClient{
	constructor(){
		this.socket = new WebSocket("ws://localhost:3000/");

		this.socket.onerror = (err) => {
			if (this.onError){
				this.onError(err);
			}
		}

		this.socket.onopen = () => {
			if (this.onOpen){
				this.onOpen();
			}
		}

		this.socket.onmessage = (message) => {
			if (this.onMessage){
				this.onMessage(message);
			}
		}

	}

	send(payload){
		let shipment = {
			payload:payload
		};

		console.log("Sent shipment");
		this.socket.send(JSON.stringify(shipment));
	}
}

export default SocketClient;
