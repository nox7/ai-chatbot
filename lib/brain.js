const LanguageProcessor = require("./language-processor");

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
	* Tells the brain it has heard a noise from an animate thing directged at it (the robot directly)
	*
	* @param {string} text The value of the noise (what was said?)
	* @param {string} speakerMood The tone/mood of the speaker
	* @return {undefined}
	*/
	hearNoiseFromAnimate_Direct(text, speakerMood){
		LanguageProcessor.process(text, (sentence, noiseLevel) => {
			// A sentence was processed, the sentence's noiseLevel is also given here

			// TODO Does the robot understand the sentence? If not, take the noiseLevel and the confusion into account
			// Without recognizing what is said, the robot can only respond based on the tone/speakerMood and noise of the sentence

			// if (doesNotRecognize){
				
			// }
		});
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
