const WebSocketServer = require("websocket").server;
const Brain = require("./lib/brain.js");
const MathLib = require("./lib/math-lib.js");
const Memory = require("./lib/memory.js");

const thisHuman = new Brain();
thisHuman.memory = new Memory();

setInterval(() => {
	// Every second, run a general brain "tick" to
	// review memories and current emotions/hormones
	// and adjust/modify them based on recent events or feelings
	// or "think" by attempting to discover connections between known
	// facts or words

	// When emotions are high, this process should also create more receptors,
	// as this is also part of "maturing"
	// When this robot experiences a lot of emotions that cause a lot of receptors,
	// sometimes this can result in desensitization in some people (robots)

	// Use artifical parts of body to "consume" hormones
	// When those parts desire that hormone, the bot acts accordingly

	// If no speech within 30s - 60s, then begin hormonal consumption (equilibrium attempt)
	if (thisHuman.lastDirectSpeechInteraction > 0){
		// console.log(thisHuman.lastDirectSpeechInteraction);
		if (thisHuman.hormoneA > 0 || thisHuman.hormoneB > 0 || thisHuman.hormoneC > 0 || thisHuman.hormoneX > 0){
			//let chosenTimeAgoComparisonThreshold = (new Date()).getTime() - MathLib.getRandomNumber(1000,5000);
			let chosenTimeAgoComparisonThreshold = (new Date()).getTime() - MathLib.getRandomNumber(30000, 60000);
			if (thisHuman.lastDirectSpeechInteraction <= chosenTimeAgoComparisonThreshold && thisHuman.lastHormoneConsumption <= chosenTimeAgoComparisonThreshold){
				console.log("Beginning equilibrium attempt by consuming hormones");
				thisHuman.consumeHormones();
			}
		}
	}
}, 10);

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

		connection.on("message", (message) => {
			CustomSocketServer.messageReceived(connection, message);
		});

		thisHuman.onHormonesUpdated(() => {
			console.log("WebSocket server sending hormone updates");
			let shipmentBackToClient = {
				hormoneA:thisHuman.hormoneA,
				hormoneB:thisHuman.hormoneB,
				hormoneC:thisHuman.hormoneC,
				hormoneX:thisHuman.hormoneX
			}
			connection.sendUTF(JSON.stringify(shipmentBackToClient));
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
			try{
				let data = JSON.parse(message.utf8Data);
				let payload = data.payload;
				let speech = payload.spokenMessage;
				let speakerMood = payload.speakerMood;
				// TODO Eventually distinguish between direct, indirect, and inanimate speakers
				// Use separate functions for that
				thisHuman.hearNoiseFromAnimate_Direct(speech, "insert speaker here", speakerMood, () => {
					// Done processing the information, what now?
				});
			}catch(err){
				console.log("Failed parsing socket utf8 data to object: " + String(err));
				console.log("Data attempted: " + String(message.utf8Data));
			}
		}
	}
}

module.exports = CustomSocketServer;
