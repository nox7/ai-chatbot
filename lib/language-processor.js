const MemoryQuery = require("./memory-query");

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
		let characters = [...input];
		for (let index = 0; index < characters.length; ++index){
			const character = characters[index];
			// const existingNeuron = memQuery.hasMemoryOfTextData(character);
			// if (existingNeuron !== undefined){
			//
			// }
			const existingConnectionWithData = this.brain.findConnectedNeuronWithData(currentNeuronInPath, character);
			if (existingConnectionWithData === undefined){
				// No existing connection was made
				// Find the closest open neuron
				const closestEmptyNeuron = this.brain.findClosestNeuronToPosition(currentNeuronInPath.getPositionAsVector3Int(), currentTraversedPath, true);

				if (closestEmptyNeuron === undefined){
					// This happens when this area of the brain has no more free neurons, or the neural chain being traversed hit a dead end
					console.log(`WARNING: Memory creation of "${input}" ran out of available neurons and stopped at "${character}"`);
					break;
				}else{

					// Make a Dendrite connection
					currentNeuronInPath.connectTo(closestEmptyNeuron);

					// Set the new, empty neuron's stored data
					closestEmptyNeuron.data = character;

					// Add the found neuron to the current traversed path
					currentTraversedPath.push(closestEmptyNeuron);

					// Update the current neuron in path
					currentNeuronInPath = closestEmptyNeuron;
					++totalNewConnectionsMade;
				}
			}else{
				// Data exists, traverse along it
				currentTraversedPath.push(existingConnectionWithData);
				currentNeuronInPath = existingConnectionWithData;
			}
		}

		console.log(`Finished processing the language input | ${totalNewConnectionsMade} new connections from input length of ${characters.length}`);
	}
}

module.exports = LanguageProcessor;
