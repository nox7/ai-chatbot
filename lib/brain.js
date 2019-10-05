const MathLib = require("./math-lib");
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

		/** @property {Neurons[]} neurons ds */
		this.neurons = [];

		// Because this is a new brain, neurons must be created (CPU intensive process)
		this.generateNeurons();

		console.log("Neurons generated");
	}

	/**
	* Generates neurons throughout the 3D space of the entire brain
	*
	*/
	generateNeurons(){
		for (let neuronIndex = 1; neuronIndex <= totalNeurons; neuronIndex++){
			const neuron = new Neuron();

			// Generate a random location in space
			let freePositionFound = false;

			let randomXInt;
			let randomYInt;
			let randomZInt;
			while (freePositionFound === false){
				randomXInt = Math.ceil(MathLib.getRandomNumber(-100, 100));
				randomYInt = Math.ceil(MathLib.getRandomNumber(-100, 100));
				randomZInt = Math.ceil(MathLib.getRandomNumber(-100, 100));
				if (this.isNeuralSpacetaken(randomXInt, randomYInt, randomZInt) === false){
					freePositionFound = true;
					break;
				}
			}

			neuron.setPosition(randomXInt, randomYInt, randomZInt);
			this.neurons.push(neuron);

			console.log("Generated neuron #" + String(neuronIndex) + " / " + String(totalNeurons) + " at: " + String(randomXInt) + ", " + String(randomYInt) + ", " + String(randomZInt));
		}
	}

	isNeuralSpacetaken(x,y,z){
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
