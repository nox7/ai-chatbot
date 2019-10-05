const MathLib = require("./math-lib");
const Vector3Int = require("./vector3Int");
const DNA = require("./dna");

const Neuron = require("./molecular-components/neuron.js");
const Dendrite = require("./molecular-components/dendrite.js");
const Axon = require("./molecular-components/axon.js");
const AxonTerminal = require("./molecular-components/axon-terminal.js");

const totalNeurons = 3500;

// The extents of the relative 3D space of the "brain"
const spaceExtents = 250;

class Brain{

	/**
	* Construct the properties of the brain when created
	*/
	constructor(){

		/** @property {DNA} dna The DNA that dictates how receptors should form and at what pace */
		this.dna = new DNA;

		/** @property {Neurons[]} neurons ds */
		this.neurons = [];

		/** @property {Vector3Int} languageQuadrant The location in 3D space of the language quadrant that this brain instance is hardwired to */
		this.languageQuadrant = new Vector3Int(-50, -30, -75);

		// Because this is a new brain, neurons must be created (CPU intensive process)
		this.generateNeurons();

		console.log("Neurons generated");
	}

	/**
	* Generates neurons throughout the 3D space of the entire brain
	*
	*/
	generateNeurons(){
		let neuronsPreset = 0;

		// Make a languageQuadrant neuron
		neuronsPreset++;
		const languageQuadrantNeuron = new Neuron();
		languageQuadrantNeuron.setPositionWithVector3Int(this.languageQuadrant);
		languageQuadrantNeuron.label = "primordialLanguageNeuron";
		this.neurons.push(languageQuadrantNeuron);

		for (let neuronIndex = 1; neuronIndex <= totalNeurons-neuronsPreset; neuronIndex++){
			const neuron = new Neuron();

			// Generate a random location in space
			let freePositionFound = false;

			let randomXInt;
			let randomYInt;
			let randomZInt;
			while (freePositionFound === false){
				randomXInt = Math.ceil(MathLib.getRandomNumber(-spaceExtents, spaceExtents));
				randomYInt = Math.ceil(MathLib.getRandomNumber(-spaceExtents, spaceExtents));
				randomZInt = Math.ceil(MathLib.getRandomNumber(-spaceExtents, spaceExtents));
				if (this.isNeuralSpaceTaken(randomXInt, randomYInt, randomZInt) === false){
					freePositionFound = true;
					break;
				}
			}

			neuron.setPosition(randomXInt, randomYInt, randomZInt);
			this.neurons.push(neuron);

			console.log("Generated neuron #" + String(neuronIndex) + " / " + String(totalNeurons) + " at: " + String(randomXInt) + ", " + String(randomYInt) + ", " + String(randomZInt));
		}
	}

	/**
	* Finds the closest neuron to a Vector3Int
	*
	* @param {Vector3Int} fromVector3Int
	* @param {Neuron[]} ignoreList List of neurons to ignore, if any
	* @return {Neuron}
	*/
	findClosestNeuron(fromVector3Int, ignoreList){
		let closestNeuron;
		let lastClosestDistance = 1000000000;
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

			if (!closestNeuron){
				closestNeuron = iNeuron;
			}else{
				let distanceToINeuron = fromVector3Int.distanceBetween(iNeuron.getPositionAsVector3Int());
				if (distanceToINeuron < lastClosestDistance){
					lastClosestDistance = distanceToINeuron;
					closestNeuron = iNeuron;
				}
			}
		}

		return closestNeuron;
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
	* Gets the neuron at a position or undefined
	*
	* @param {Vector3Int} position
	* @return {Neuron|undefined}
	*/
	getNeuronAtVector3Int(position){
		for (let i = 0; i < this.neurons.length; i++){
			let iNeuron = this.neurons[i];
			if (iNeuron.getPositionAsVector3Int().isEqual(position)){
				return iNeuron;
			}
		}

		return undefined;
	}

	isNeuralSpaceTaken(x,y,z){
		// Determines if a neuron exists at x,y,z
		for (let i = 0; i < this.neurons.length; i++){
			let currentNeuron = this.neurons[i];
			if (currentNeuron.x == x && currentNeuron.y == y && currentNeuron.z == z){
				return true;
			}
		}

		return false;
	}

}

module.exports = Brain;
