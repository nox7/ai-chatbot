class Brain{

	/** @property {object} memory The Memory object for this brain, set when the brain is created */
	memory;

	/** @property {number} hormoneA Responsible for happiness and good feelings */
	hormoneA = 0;

	/** @property {number} hormoneB Responsible for sadness and bad feelings */
	hormoneB = 0;

	/** @property {number} hormoneX Responsible for feelings of attraction */
	hormoneX = 0;

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
