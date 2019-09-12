class Brain{

	/**
	* Construct the properties of the brain when created
	*/
	constructor(){
		/** @property {object} memory The Memory object for this brain, set when the brain is created */
		this.memory = undefined;

		/** @property {number} hormoneA Responsible for happiness and good feelings */
		this.hormoneA = 0;

		/** @property {number} hormoneB Responsible for sadness and bad feelings */
		this.hormoneB = 0;

		/** @property {number} hormoneC Responsible for surprise, action, sense of need (like adrenaline) */
		this.hormoneC = 0;

		/** @property {number} hormoneX Responsible for feelings of attraction */
		this.hormoneX = 0;
	}

	/**
	* Tells the brain it has heard a noise level
	*
	* @param {string} level The level of noise "loud", "normal" "soft"
	* @return {undefined}
	*/
	hearNoise(level){

	}

	/**
	* Obtains an emotional response
	*
	* This method is to be called after something is processed
	*
	* @param {}
	* @return {string} The name of the emotion
	*/
	getEmotionalResponse(){

	}

}

module.exports = Brain;
