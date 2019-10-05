const MathLib = require("./math-lib");
const DNA = require("./dna");

class Brain{

	/**
	* Construct the properties of the brain when created
	*/
	constructor(){

		/** @property {DNA} memory The DNA that dictates how receptors should form and at what pace */
		this.dna = new DNA;


	}

}

module.exports = Brain;
