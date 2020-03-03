const MathLib = require("./math-lib");
const Vector3Int = require("./vector3Int");
const LanguageProcessor = require("./language-processor");
const NeuralChunk = require("./neural-chunk");
const DNA = require("./dna");

const Neuron = require("./molecular-components/neuron.js");
const Dendrite = require("./molecular-components/dendrite.js");
const Axon = require("./molecular-components/axon.js");
const AxonTerminal = require("./molecular-components/axon-terminal.js");

const totalNeurons = 1000;


class Brain{

	/**
	* Construct the properties of the brain when created
	*/
	constructor(){

		/** @property {DNA} dna The DNA that dictates how receptors should form and at what pace */
		this.dna = new DNA;

		/** @property {int[int[int[NeuralChunk]]]} neuralChunks Data chunks which house neurons. Use NeuralChunk.getChunkPositionFromWorldPosition() to get the position of a chunk from a world position */
		this.neuralChunks = {};

		/** @property {int} spaceExtents This is an exclusive boundary - no neuron will/should ever have the axis coordinate of `spaceExtents` */
		this.spaceExtents = 100;

		/** @property {int} numberOfChunksPerAxis ? */
		this.numberOfChunksPerAxis = 8;

		/** @property {int} chunkSize spaceExtents is multiplied by 2 here because the negative expansion must be considered */
		this.chunkSize = Math.ceil( (this.spaceExtents * 2) / this.numberOfChunksPerAxis);

		/** @property {NeuralChunk[]} rawNeuralChunks */
		this.rawNeuralChunks = []; // Not organized in any indexable chunk. For fast exporting

		/** @property {Vector3Int} languageQuadrant The location in 3D space of the language quadrant that this brain instance is hardwired to */
		this.languageQuadrant = new Vector3Int(-50, -30, -75);

		/** @property {Neuron} languageNeuron The neuron that is the first entry-point for all language input */
		this.languageNeuron;

		/** @property {LanguageProcessor} languageProcessor The processor module for handling language-based textual input */
		this.languageProcessor = new LanguageProcessor;

		console.log(`Brain will have ${this.numberOfChunksPerAxis} chunks with each being a uniform size of ${this.chunkSize}. Total neurons in brain: ${totalNeurons}`);

		// Because this is a new brain, neurons must be created (CPU intensive process)
		this.generateNeuralChunks();
		this.generateNeurons();

		// TEST
		this.languageNeuron = this.findClosestNeuronToPosition(this.languageQuadrant, [], true);
		this.languageNeuron.label = "primordialLanguageNeuron";
		// let randomNeuron = this.neurons[Math.floor(MathLib.getRandomNumber(0, this.neurons.length))];
		// let neuronsToLanguageNeuron = this.findShortestPathToNeuron(randomNeuron, this.languageNeuron);
		//
		// for(let i = 0; i < neuronsToLanguageNeuron.length; i++){
		// 	let iNeuron = neuronsToLanguageNeuron[i];
		// 	let nextNeuron = neuronsToLanguageNeuron[i+1];
		// 	let dendrite = new Dendrite(iNeuron);
		//
		// 	if (nextNeuron){
		// 		dendrite.connection = nextNeuron;
		// 	}else{
		// 		dendrite.connection = this.languageNeuron;
		// 	}
		//
		// 	iNeuron.dendrites.push(dendrite);
		// }
	}

	/**
	* Generates all necessary neural chunks for the current brain spatial size
	*
	* @return {undefined}
	*/
	generateNeuralChunks(){
		console.log("Generating neural chunks");
		for (let x = 0; x < this.numberOfChunksPerAxis; ++x){
			for (let y = 0; y < this.numberOfChunksPerAxis; ++y){
				for (let z = 0; z < this.numberOfChunksPerAxis; ++z){

					if (!(x in this.neuralChunks)){
						this.neuralChunks[x] = {};
					}

					if (!(y in this.neuralChunks[x])){
						this.neuralChunks[x][y] = {};
					}

					const newChunk = new NeuralChunk(this,x,y,z);
					this.neuralChunks[x][y][z] = newChunk;
					this.rawNeuralChunks.push(newChunk);
				}
			}
		}
		console.log("Neural chunks generated");
	}

	/**
	* Generates neurons throughout the 3D space of the entire brain and adds them to the correct chunk
	*
	* @return {undefined}
	*/
	generateNeurons(){
		console.log(`Generating ${totalNeurons} neurons`);

		for (let neuronIndex = 0; neuronIndex < totalNeurons; neuronIndex++){
			const neuron = new Neuron();

			// Generate a random location in space
			let freePositionFound = false;

			let randomXInt;
			let randomYInt;
			let randomZInt;
			while (freePositionFound === false){
				randomXInt = Math.ceil(MathLib.getRandomNumber(-this.spaceExtents+1, this.spaceExtents-1));
				randomYInt = Math.ceil(MathLib.getRandomNumber(-this.spaceExtents+1, this.spaceExtents-1));
				randomZInt = Math.ceil(MathLib.getRandomNumber(-this.spaceExtents+1, this.spaceExtents-1));
				if (this.isNeuralSpaceTaken(randomXInt, randomYInt, randomZInt) === false){
					freePositionFound = true;
					break;
				}
			}

			const neuronPosition = new Vector3Int(randomXInt, randomYInt,randomZInt);
			const chunkPosition = NeuralChunk.getChunkPositionFromWorldPosition(neuronPosition, this.chunkSize, this.spaceExtents);
			const chunk = this.neuralChunks[chunkPosition.x][chunkPosition.y][chunkPosition.z];

			neuron.chunk = chunk;
			neuron.setPositionWithVector3Int(neuronPosition);
			chunk.addNeuron(neuron);
		}

		console.log("Neurons generated");
	}

	/**
	* Finds the closest neuron to a world position
	*
	* WARNING This function does not find neurons throughout the entire brain. Only within adjacent chunks to the current position
	*
	* @param {Vector3Int} position
	* @param {Neuron[]} ignoreList List of neurons to ignore, if any
	* @param {bool|undefined} onlyFindEmptyNeurons Whether or not to only find empty neurons. Undefined = false
	* @return {Neuron}
	*/
	findClosestNeuronToPosition(position, ignoreList, onlyFindEmptyNeurons){
		let foundNeuron;
		let chunksToCheck = []; // All the chunks that need to be searched
		let chunksAlreadyChecked = []; // Chunks that have already been checked

		const currentChunk = this.getChunkFromWorldPosition(position);
		chunksToCheck.push(currentChunk);

		// Add all possible neurons to an array to be checked
		let lastClosestDistance;
		let lastClosestNeuron;
		let totalNeuronsChecked = 0;

		// When true, uses edge-case-found chunks near the provided position in the function call
		// Will turn to false if no chunks have available neurons and begin just using adjacent chunks as a last resort
		let optimizedChunkCheckingModeEnable = true;
		while (lastClosestNeuron === undefined){

			let chunkCoordinatesToCheck = [];
			if (optimizedChunkCheckingModeEnable){
				// Get the chunk coordinates of edge-cases
				chunkCoordinatesToCheck = NeuralChunk.getChunkPositionsFromPointEdgeCases(position, this.spaceExtents, this.chunkSize, 0.2);
			}else{
				chunkCoordinatesToCheck = currentChunk.getAdjacentChunkPositions();
			}

			// Filter out chunks coordinates that don't actually have chunk data related to the coordinate
			// Or chunks that have already been checked before
			chunkCoordinatesToCheck.forEach(chunkCoordinate => {
				const possibleChunk = this.getChunkFromChunkPosition(chunkCoordinate);
				if (possibleChunk !== undefined){

					// Has this chunk already been checked?
					let hasChunkBeenChecked = false;
					for (let checkedIndex = 0; checkedIndex < chunksAlreadyChecked.length; ++checkedIndex){
						if (possibleChunk.isEqual(chunksAlreadyChecked[checkedIndex])){
							hasChunkBeenChecked = true;
							break;
						}
					}

					if (!hasChunkBeenChecked){
						chunksToCheck.push(possibleChunk);
					}
				}
			});

			if (chunksToCheck.length === 0){
				// No more chunks
				break;
			}

			chunksToCheck.forEach( chunk => {
				chunk.rawNeurons.forEach( neuron => {
					if (onlyFindEmptyNeurons && neuron.data !== ""){
						// Ignore this neuron, the call specified to only check for neurons with empty data
					}else if ( (onlyFindEmptyNeurons && neuron.data === "") || !onlyFindEmptyNeurons){
						let isNeuronInIgnoreList = false;

						for (let ignoreIndex = 0; ignoreIndex < ignoreList.length; ++ignoreIndex){
							if (ignoreList[ignoreIndex] == neuron){
								isNeuronInIgnoreList = true;
								break;
							}
						}

						if (!isNeuronInIgnoreList){
							++totalNeuronsChecked;
							if (!lastClosestNeuron){
								// No last neuron? Set this one as the default closest
								lastClosestNeuron = neuron;
								lastClosestDistance = neuron.getPositionAsVector3Int().distanceBetween(position);
							}else{
								// Is this neuron closer than the last distance?
								let thisNeuronsDistanceToDesiredPosition = neuron.getPositionAsVector3Int().distanceBetween(position);
								if (thisNeuronsDistanceToDesiredPosition < lastClosestDistance){
									lastClosestDistance = thisNeuronsDistanceToDesiredPosition;
									lastClosestNeuron = neuron;
								}
							}
						}
					}
				});

				chunksAlreadyChecked.push(chunk);
			});

			if (lastClosestNeuron === undefined){
				// No neuron found from this iteration. Time to just start checking adjacent chunks
				optimizedChunkCheckingModeEnable = false;

				// Empty the chunks to check
				chunksToCheck = [];
			}
		}

		console.log(`Checked a total of ${totalNeuronsChecked} available neurons`);

		return lastClosestNeuron;
	}

	/**
	* Finds closest neurons within a given range
	*
	* @param {Vector3Int} fromVector3Int
	* @param {Int} range
	* @param {Neuron[]} ignoreList List of neurons to ignore, if any
	* @return {Neuron}
	*/
	findClosestNeuronsWithinRange(fromVector3Int, range, ignoreList){
		let neuronCollection = [];
		for (let i = 0; i < this.neurons.length; i++){
			let iNeuron = this.neurons[i];
			let isInIgnoreList = false;

			for (let j = 0; j < ignoreList.length; j++){
				if (iNeuron == ignoreList[j]){
					isInIgnoreList = true;
					break;
				}
			}

			if (isInIgnoreList){
				continue;
			}

			let distanceToINeuron = fromVector3Int.distanceBetween(iNeuron.getPositionAsVector3Int());
			if (distanceToINeuron <= range){
				neuronCollection.push(iNeuron);
			}
		}

		return neuronCollection;
	}

	/**
	* Finds the shortest path of neurons to another neuron
	*
	* @param {Neuron} fromNeuron
	* @param {Neuron} toNeuron
	*/
	findShortestPathToNeuron(fromNeuron, toNeuron){
		// Ignore list is updated and eventually is the path of neurons needed
		let ignoreList = [fromNeuron];
		let lastNeuronFound = fromNeuron;
		let initialRangeToLookIn = 10;
		let currentRangeToLookIn = initialRangeToLookIn; // This will grow if none found in initial on an iteration, then reset back to initial range

		let reachedEndNeuron = false;
		while (reachedEndNeuron === false){
			let neuronsInRange = this.findClosestNeuronsWithinRange(lastNeuronFound.getPositionAsVector3Int(), currentRangeToLookIn, ignoreList);

			if (neuronsInRange.length === 0){
				// Increment the look range, nothing was found this close
				currentRangeToLookIn += initialRangeToLookIn;
			}else{


				// First check if all available options would just lead to a further away neuron
				// If so, then expand the range and try again
				let neuronsLeadingCloser = [];
				let distanceFromCurrentNeuronToEndNeuron = lastNeuronFound.getPositionAsVector3Int().distanceBetween(toNeuron.getPositionAsVector3Int());
				for (let i = 0; i < neuronsInRange.length; i++){
					let iNeuron = neuronsInRange[i];
					let distanceFromThisNeuronToEndNeuron = iNeuron.getPositionAsVector3Int().distanceBetween(toNeuron.getPositionAsVector3Int());
					if (distanceFromThisNeuronToEndNeuron > distanceFromCurrentNeuronToEndNeuron){
						// This goes further, do nothing
					}else{
						// This neuron is closer to the end than the current
						neuronsLeadingCloser.push([iNeuron, distanceFromThisNeuronToEndNeuron]);
					}
				}

				if (neuronsLeadingCloser.length === 0){
					// No neurons leading closer, expand the search
					currentRangeToLookIn += initialRangeToLookIn;
				}else{
					// Use an A*-like method to determine which will be the next neuron
					let lastClosestDistance = 10000000;
					let lastClosestNeuron;
					for (let i = 0; i < neuronsLeadingCloser.length; i++){
						let iNeuron = neuronsLeadingCloser[i][0];
						if (iNeuron === toNeuron){
							reachedEndNeuron = true;
							break;
						}else{
							let distanceToEndNeuron = neuronsLeadingCloser[i][1];
							if (!lastClosestNeuron){
								lastClosestDistance = distanceToEndNeuron;
								lastClosestNeuron = iNeuron;
							}else{
								if (distanceToEndNeuron < lastClosestDistance){
									lastClosestDistance = distanceToEndNeuron;
									lastClosestNeuron = iNeuron;
								}
							}
						}
					}

					if (lastClosestNeuron){
						lastNeuronFound = lastClosestNeuron;
						ignoreList.push(lastNeuronFound);
					}

					// Reset the look range
					currentRangeToLookIn = initialRangeToLookIn;
				}
			}
		}

		// At this point, the ignoreList is the shortest path
		return ignoreList;
	}

	/**
	* Gets the neuron at a world position or undefined
	*
	* @param {Vector3Int} position
	* @return {Neuron|undefined}
	*/
	getNeuronAtWorldPosition(position){
		const chunk = this.getChunkFromWorldPosition(position);

		if (chunk !== undefined){
			return chunk.getNeuronFromPosition(position);
		}

		return undefined;
	}

	/**
	* Finds a neuron attached to fromNeuron with data as the neuron's data
	*
	* @param {Neuron} fromNeuron
	* @param {string} data
	* @return {[Dendrite,Neuron]|undefined} Returns undefined if no neuron with that data exists
	*/
	findConnectedNeuronWithData(fromNeuron, data){
		// Go through this neuron's dendrites and find connected neurons
		for (let i = 0; i < fromNeuron.dendrites.length; i++){
			let dendrite = fromNeuron.dendrites[i];
			let connectedNeuron = dendrite.connection;
			if (connectedNeuron.data === data){
				return [dendrite, connectedNeuron];
			}
		}

		return undefined; // Unnecessary, but when I wrote it I guess I wanted to be explicit because there was a lot going on
	}

	/**
	* Gets the neural chunk from a world position
	*
	* TODO: Handle undefined indices obtained from a worldPosition that may be outside of chunked range
	*
	* @param {Vector3Int} worldPosition
	* @return {NeuralChunk|undefined}
	*/
	getChunkFromWorldPosition(worldPosition){
		const chunkCoordinates = NeuralChunk.getChunkPositionFromWorldPosition(worldPosition, this.chunkSize, this.spaceExtents);
		return this.neuralChunks[chunkCoordinates.x][chunkCoordinates.y][chunkCoordinates.z];
	}

	/**
	* Gets a chunk at a chunk position. Undefined if no chunk exists there
	*
	* TODO: Handle undefined indices obtained from a worldPosition that may be outside of chunked range
	*
	* @param {Vector3Int} chunkPosition
	* @return {NeuralChunk|undefined}
	*/
	getChunkFromChunkPosition(chunkPosition){
		if (chunkPosition.x in this.neuralChunks){
			if (chunkPosition.y in this.neuralChunks[chunkPosition.x]){
				if (chunkPosition.z in this.neuralChunks[chunkPosition.x][chunkPosition.y]){
					return this.neuralChunks[chunkPosition.x][chunkPosition.y][chunkPosition.z];
				}
			}
		}

		return undefined;
	}

	/**
	* Checks if a neural space is taken by an existing neuron
	*
	* Finds the chunk from the world position and determines if that neural space is taken by the chunk
	*
	* @param {int} x
	* @param {int} y
	* @param {int} z
	* @return {bool}
	*/
	isNeuralSpaceTaken(x,y,z){
		// Determines if a neuron exists at x,y,z
		const worldPosition = new Vector3Int(x,y,z);
		const chunk = this.getChunkFromWorldPosition(worldPosition);

		if (chunk !== undefined){
			return chunk.getNeuronFromPosition(worldPosition) !== undefined;
		}

		return undefined;
	}

	/**
	* Attempts to consolidate data into faster access points
	*
	* This is where the "learning" of the brain happens, and is similar to what
	* human brains do when sleeping. It will attempt to find patterns and remove
	* said patterns, linking them to a similar node cluster. For instance, if
	* the word "truck" is used often, then the individual "t" "r" "u" "c" "k"
	* neurons are removed and they are consolidated to one single cluster - this
	* also redirects the preview connections to the new neural cluster, and then
	* back to where they originally pointed _after_ the word "truck"
	*
	* @return {undefined}
	*/
	consolidateAndLearn(){
		// This object will have indices of data with a Neuron as a value
		// If any further buffers are passed with the smae index as something
		// in this object, then that buffer is considered to be an optimizable pattern
		// For instance, if the word "it" has been iterated, and then the buffer
		// iterates over another, separate instance of "it", the new (2nd and so on)
		// neurons that make up "it" are removed, repointed to the Neuron in this below
		// map, and then a dendrite is created from the Neuron in the map, back to where
		// the final Neuron of the repeated "it" was pointing too.
		const consolidationIndex = {};
	}

}

module.exports = Brain;
