const WebSocketServer = require("websocket").server;

class CustomSocketServer{
	constructor(httpServer){
		let wsServer = new WebSocketServer({
			httpServer: httpServer,
			autoAcceptConnections: true // Turn this to false in production
		});

		console.log("Socket server running");

		wsServer.on("connect", (connection) => {
			console.log("WebSocket connection accepted");

			CustomSocketServer.connectionAccepted(connection);

			connection.on("close", (reasonCode, description) => {
				console.log("WebSocket close received. Description: " + description);
			});

		});

		wsServer.on("request", (request) => {

			// Reject bad origins
			if (!CustomSocketServer.isOriginAllowed(request.origin)){
				request.reject();
				return;
			}

			request.accept(null, request.origin);
		});
	}

	static isOriginAllowed(origin){
		// Check if the origin can use this WS server
		return true;
	}

	static connectionAccepted(connection){

		// Send the neurons from the brain
		// connection.sendUTF(JSON.stringify({
		// 	"event":"init",
		// 	"neuralChunks":thisHuman.rawNeuralChunks,
		// 	"messageHistory":history.getHistory()
		// }));

		connection.on("message", (message) => {
			CustomSocketServer.messageReceived(connection, message);
		});
	}

	/**
	* When a connected client sends a message
	*
	* @param {WebSocketConnection} connection The socket connection which sent the message
	* @param {object} message The message object
	* @return {undefined}
	*/
	static messageReceived(connection, message){
		if (message.type === "utf8"){
			let data;

			try{
				data = JSON.parse(message.utf8Data);
				const payload = JSON.parse(data.payload);
				const evt = payload.event;
				if (evt === "message"){
					const message = payload.message;
					console.log(`Received - ${message}`);
				}
			}catch(err){
				console.log("Failed parsing socket utf8 data to object: " + String(err));
				console.log("Data attempted: " + String(message.utf8Data));
				return;
			}
		}
	}
}

module.exports = CustomSocketServer;
