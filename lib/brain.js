const MathLib = require("./math-lib");
const DNA = require("./dna");

const Neuron = require("./molecular-components/neuron.js");
const Dendrite = require("./molecular-components/dendrite.js");
const Axon = require("./molecular-components/axon.js");
const AxonTerminal = require("./molecular-components/axon-terminal.js");

class Brain{

	/**
	* Construct the properties of the brain when created
	*/
	constructor(){

		/** @property {DNA} memory The DNA that dictates how receptors should form and at what pace */
		this.dna = new DNA;

		// Because this is a new brain, neurons must be created (CPU intensive process)

	}

}

module.exports = Brain;
