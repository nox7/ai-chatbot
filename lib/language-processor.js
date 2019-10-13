const MemoryQuery = require("./memory");

class LanguageProcessor{

	/**
	* @param {Brain} brain
	*/
	constructor(brain){
		this.brain = brain;
	}

	/**
	* Processes input
	*
	* @param {string} input Should be the full string of language
	* @param {function} onProcessFinished Callback for when processing is done
	* @return ?
	*/
	process(input, onProcessFinished){

		console.log("Processing language input");

		// This variable will serve to be reference to the current neuron in the loop's iteration that is being traversed. It starts with the language base neuron and begins to branch out based on the data
		let currentNeuronInPath = this.brain.languageNeuron;
		let currentTraversedPath = [currentNeuronInPath];

		const memQuery = new MemoryQuery(this.brain);
		let totalNewConnectionsMade = 0;

		// Process each characters
		[...input].forEach( character => {
			// const existingNeuron = memQuery.hasMemoryOfTextData(character);
			// if (existingNeuron !== undefined){
			//
			// }
			const existingConnectionWithData = this.brain.findConnectedNeuronWithData(currentNeuronInPath, character);
			if (existingConnectionWithData === undefined){
				// No existing connection was made
				// Find the closest open neuron
				const closestEmptyNeuron = this.brain.findClosestNeuron(currentNeuronInPath.getPositionAsVector3Int(), currentTraversedPath, true);

				// Make a Dendrite connection
				currentNeuronInPath.connectTo(closestEmptyNeuron);

				// Set the new, empty neuron's stored data
				closestEmptyNeuron.data = character;

				// Add the found neuron to the current traversed path
				currentTraversedPath.push(closestEmptyNeuron);

				// Update the current neuron in path
				currentNeuronInPath = closestEmptyNeuron;
				++totalNewConnectionsMade;
			}else{
				// Data exists, traverse along it
				currentTraversedPath.push(existingConnectionWithData);
				currentNeuronInPath = existingConnectionWithData;
			}
		});

		console.log("Finished processing the language input | " + String(totalNewConnectionsMade) + " new connections");
	}
}

module.exports = LanguageProcessor;
