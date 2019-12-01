const WebSocketServer = require("websocket").server;
const Brain = require("./lib/brain.js");
const MathLib = require("./lib/math-lib.js");
const LanguageProcessor = require("./lib/language-processor");
const MessageHistory = require("./lib/message-history");


const history = new MessageHistory();
const thisHuman = new Brain();

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
		connection.sendUTF(JSON.stringify({
			"event":"init",
			"neuralChunks":thisHuman.rawNeuralChunks,
			"messageHistory":history.getHistory()
		}));

		connection.on("message", (message) => {
			CustomSocketServer.messageReceived(connection, message);
		});

		// thisHuman.onHormonesUpdated(() => {
		// 	console.log("WebSocket server sending hormone updates");
		// 	let shipmentBackToClient = {
		// 		hormoneA:thisHuman.hormoneA,
		// 		hormoneB:thisHuman.hormoneB,
		// 		hormoneC:thisHuman.hormoneC,
		// 		hormoneX:thisHuman.hormoneX
		// 	}
		// 	connection.sendUTF(JSON.stringify(shipmentBackToClient));
		// });
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
			}catch(err){
				console.log("Failed parsing socket utf8 data to object: " + String(err));
				console.log("Data attempted: " + String(message.utf8Data));
				return;
			}

			let payload = data.payload;
			let speakerMood = payload.speakerMood;
			let speech = payload.spokenMessage;

			// Sanitize the input
			// Remove tabs, news lines, returns
			speech = speech.replace(/[\n\t\r]/, "");

			// Was the message too long?
			if (speech.length > 75){
				const notifMessage = "Message too long - keep your message under 200 characters";
				history.addNotificationToHistory(notifMessage, (new Date()).getTime());
				connection.sendUTF(JSON.stringify({
					"event":"incomingMessage",
					"messageType":"notification",
					"message":notifMessage
				}));
				return;
			}

			const languageProcessor = new LanguageProcessor(thisHuman);

			history.addMessageToHistory("user", speech, (new Date()).getTime());
			languageProcessor.process(speech);
		}
	}
}

module.exports = CustomSocketServer;
