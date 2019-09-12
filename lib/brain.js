const MathLib = require("./math-lib");
const LanguageProcessor = require("./language-processor");
const DNA = require("./dna");

class Brain{

	/**
	* Construct the properties of the brain when created
	*/
	constructor(){
		/** @property {Memory} memory The Memory object for this brain, set when the brain is created */
		this.memory = undefined;

		/** @property {DNA} memory The DNA that dictates how receptors should form and at what pace */
		this.dna = new DNA;

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
	* @param {function} callback After processing the input, what next?
	* @return {undefined}
	*/
	hearNoiseFromAnimate_Direct(text, speakerMood, callback){

		// Noise level can be "loud" or "normal"
		LanguageProcessor.process(text, (sentence, noiseLevel) => {
			// A sentence was processed, the sentence's noiseLevel is also given here

			// TODO Does the robot understand the sentence? If not, take the noiseLevel and the confusion into account
			// Without recognizing what is said, the robot can only respond based on the tone/speakerMood and noise of the sentence

			// if (doesNotRecognize){

				let aMod = 0;
				let bMod = 0;
				let cMod = 0;
				let xMod = 0;
				// Determine the speaker's mood modification
				if (speakerMood === "happy"){
					aMod += this.dna.receptorAGrowthRate;
					xMod += this.dna.receptorXGrowthRate;

					// TODO noise results should be modified by the robot's current mood too
					if (noiseLevel === "loud"){
						aMod *= MathLib.getRandomNumber(1,3);
						cMod += this.dna.receptorCGrowthRate;
					}
				}else if (speakerMood === "neutral"){
					// Nothing, this is unrecognized and neutrally said - no modifications (for now)

					if (noiseLevel === "loud"){
						cMod += this.dna.receptorCGrowthRate * MathLib.getRandomNumber(0,3);
					}
				}else if (speakerMood === "sad"){
					aMod -= this.dna.receptorAGrowthRate;

					if (noiseLevel === "loud"){
						cMod += this.dna.receptorCGrowthRate * MathLib.getRandomNumber(1,4);
					}
				}else if (speakerMood === "mad"){
					aMod -= this.dna.receptorAGrowthRate * MathLib.getRandomNumber(0,5);
					bMod += this.dna.receptorBGrowthRate;
					cMod += this.dna.receptorCGrowthRate;

					if (noiseLevel === "loud"){
						bMod *= MathLib.getRandomNumber(0,3);
						cMod *= MathLib.getRandomNumber(0,3);
					}
				}

			// }

			// Digest the new hormones into increases
			this.hormoneA += aMod;
			this.hormoneB += bMod;
			this.hormoneC += cMod;
			this.hormoneX += xMod;

			callback();

			// Determine if it should respond?

			// Then respond accordingly by taking in recent speech and current emotional state
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
