const MathLib = require("./math-lib");
const LanguageProcessor = require("./language-processor");
const Emotions = require("./emotions");
const DNA = require("./dna");

class Brain{

	/**
	* Construct the properties of the brain when created
	*/
	constructor(){
		/** @property {Memory} memory The Memory object for this brain, set when the brain is created */
		this.memory = undefined;

		/** @property {number} lastDirectSpeechInteraction The last time this bot was interacted with via speech */
		this.lastDirectSpeechInteraction = 0;

		/** @property {number} lastHormoneConsumption The last time the brain consumed hormones in an equilibrium attempt */
		this.lastHormoneConsumption = 0;

		/** @property {Memory} memory The emotions object for the brain */
		this.emotions = new Emotions;

		/** @property {DNA} memory The DNA that dictates how receptors should form and at what pace */
		this.dna = new DNA;

		/** @property {number} hormoneA Responsible for happiness and good feelings */
		this.hormoneA = 0;
		/** @property {number} hormoneAReceptors How many receptors for the designated hormone */
		this.hormoneAReceptors = 0;

		/** @property {number} hormoneB Responsible for sadness and bad feelings */
		this.hormoneB = 0;
		/** @property {number} hormoneAReceptors How many receptors for the designated hormone */
		this.hormoneBReceptors = 0;

		/** @property {number} hormoneC Responsible for surprise, action, sense of need (like adrenaline) */
		this.hormoneC = 0;
		/** @property {number} hormoneAReceptors How many receptors for the designated hormone */
		this.hormoneCReceptors = 0;

		/** @property {number} hormoneX Responsible for feelings of attraction */
		this.hormoneX = 0;
		/** @property {number} hormoneAReceptors How many receptors for the designated hormone */
		this.hormoneXReceptors = 0;

		/** @property {object[]} events Holds other objects with keys that are event names. Each object has a variable number of callback */
		this.events = {};
	}

	/**
	* Consume hormones in idle time
	*
	* Consumed in an exponential way - when there high hormones then they go down faster
	* @return {undefined}
	*/
	consumeHormones(){
		// TODO/NODE Possibly have DNA control how fast/slow certain hormones decrease over time (do they stay mad longer than they stay happy in idle time?)


		// IMPORTANT IMPORTANT IMPORTANT
		// TODO Hormones are probably "consumed" when they are attached to a receptor
		// Instead of consuming them arbitrarily by percentages, have receptors consume the hormones available in percentages of receptors - so more receptors means somebody is more composed

		// NOTE It is difficult to go quickly from good thoughts to bad thoughts without drastic sensory effect (this could be implemented as a side affect of a lot of hormones bound to a receptor - more thoughts related to that hormone)

		let hormoneAPercentage = 1;
		let hormoneBPercentage = 1;
		let hormoneCPercentage = 1;
		let hormoneXPercentage = 1;

		if (this.hormoneAReceptors > 0){
			hormoneAPercentage = this.hormoneA / this.hormoneAReceptors;
			if (hormoneAPercentage > 1){
				hormoneAPercentage = 1;
			}
		}

		if (this.hormoneBReceptors > 0){
			hormoneBPercentage = this.hormoneB / this.hormoneBReceptors;
			if (hormoneBPercentage > 1){
				hormoneBPercentage = 1;
			}
		}

		if (this.hormoneCReceptors > 0){
			hormoneCPercentage = this.hormoneC / this.hormoneCReceptors;
			if (hormoneCPercentage > 1){
				hormoneCPercentage = 1;
			}
		}

		if (this.hormoneXReceptors > 0){
			hormoneXPercentage = this.hormoneX / this.hormoneXReceptors;
			if (hormoneXPercentage > 1){
				hormoneXPercentage = 1;
			}
		}

		if (this.hormoneA > 0){
			this.hormoneA = Math.floor(this.hormoneA - (this.hormoneA * MathLib.getPercentageHormoneLoss(hormoneAPercentage)));
		}

		if (this.hormoneB > 0){
			this.hormoneB = Math.floor(this.hormoneB - (this.hormoneB * MathLib.getPercentageHormoneLoss(hormoneBPercentage)));
		}

		if (this.hormoneC > 0){
			this.hormoneC = Math.floor(this.hormoneC - (this.hormoneC * MathLib.getPercentageHormoneLoss(hormoneCPercentage)));
		}

		if (this.hormoneX > 0){
			this.hormoneX = Math.floor(this.hormoneX - (this.hormoneX * MathLib.getPercentageHormoneLoss(hormoneXPercentage)));
		}

		this.lastHormoneConsumption = (new Date()).getTime();

		console.log("Consumed hormone A to new level: " + this.hormoneA);
		console.log("Consumed hormone B to new level: " + this.hormoneB);
		console.log("Consumed hormone C to new level: " + this.hormoneC);
		console.log("Consumed hormone X to new level: " + this.hormoneX);

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

		this.lastDirectSpeechInteraction = (new Date()).getTime();

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
			this.fireEvent("hormoneChanged", "hormoneA");

			this.hormoneB += bMod;
			this.fireEvent("hormoneChanged", "hormoneB");

			this.hormoneC += cMod;
			this.fireEvent("hormoneChanged", "hormoneC");

			this.hormoneX += xMod;
			this.fireEvent("hormoneChanged", "hormoneX");

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

	/**
	* Register a callback for hormoneChanged event
	*
	* @param {string} hormone
	* @return {undefined}
	*/
	onHormoneChanged(callback){
		if (!("hormoneChanged" in this.events)){
			this.events.hormoneChanged = [];
		}

		this.events.hormoneChanged.push(callback);
	}

	/**
	* Fires an event with any provided arguments passed to the event's callback
	*
	* @param {string} eName
	* @param {...mixed} args Variable number of arguments to pass to the event's callback
	* @return {undefined}
	*/
	fireEvent(eName, ...args){
		if (eName in this.events){
			[...this.events[eName]].forEach((callback) => {
				callback(...args);
			});
		}
	}


}

module.exports = Brain;
