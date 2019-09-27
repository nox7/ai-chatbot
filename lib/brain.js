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
			this.fireEvent("hormoneChanged", "hormoneA");
		}

		if (this.hormoneB > 0){
			this.hormoneB = Math.floor(this.hormoneB - (this.hormoneB * MathLib.getPercentageHormoneLoss(hormoneBPercentage)));
			this.fireEvent("hormoneChanged", "hormoneB");
		}

		if (this.hormoneC > 0){
			this.hormoneC = Math.floor(this.hormoneC - (this.hormoneC * MathLib.getPercentageHormoneLoss(hormoneCPercentage)));
			this.fireEvent("hormoneChanged", "hormoneC");
		}

		if (this.hormoneX > 0){
			this.hormoneX = Math.floor(this.hormoneX - (this.hormoneX * MathLib.getPercentageHormoneLoss(hormoneXPercentage)));
			this.fireEvent("hormoneChanged", "hormoneX");
		}

		this.lastHormoneConsumption = (new Date()).getTime();
		this.fireEvent("hormonesUpdated");

		console.log("Consumed hormone A to new level: " + this.hormoneA);
		console.log("Consumed hormone B to new level: " + this.hormoneB);
		console.log("Consumed hormone C to new level: " + this.hormoneC);
		console.log("Consumed hormone X to new level: " + this.hormoneX);

	}

	/**
	* Tells the brain it has heard a noise from an animate thing directged at it (the robot directly)
	*
	* @param {string} text The value of the noise (what was said?)
	* @param {string} speaker The identification of the speaker (someone's name, user ID, SSN etc etc)
	* @param {string} speakerMood The tone/mood of the speaker
	* @param {function} callback After processing the input, what next?
	* @return {undefined}
	*/
	hearNoiseFromAnimate_Direct(text, speaker, speakerMood, callback){

		this.lastDirectSpeechInteraction = (new Date()).getTime();

		// Noise level can be "loud" or "normal"
		LanguageProcessor.process(text, (sentence, noiseLevel) => {
			// A sentence was processed, the sentence's noiseLevel is also given here

			// TODO Does the robot understand the sentence? If not, take the noiseLevel and the confusion into account
			// Without recognizing what is said, the robot can only respond based on the tone/speakerMood and noise of the sentence

			let aMod = 0;
			let bMod = 0;
			let cMod = 0;
			let xMod = 0;
			let memoriesRelatedToNoise = this.memory.recall(speaker, "self", text);
			if (memoriesRelatedToNoise.length === 0){

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
					// Neutral, if they robot has bad feelings - slightly lower them

					bMod -= this.dna.receptorBGrowthRate * MathLib.getRandomNumber(0,2);
					cMod -= this.dna.receptorCGrowthRate * MathLib.getRandomNumber(0,4);

					if (noiseLevel === "loud"){
						cMod += this.dna.receptorCGrowthRate * MathLib.getRandomNumber(0,3);
					}

					// Was the robot previously experiencing bad feelings? Calm down, gain small bits of positivity
					if (this.hormoneB > this.hormoneA){
						aMod += this.dna.receptorAGrowthRate;
					}

				}else if (speakerMood === "sad"){
					aMod -= this.dna.receptorAGrowthRate;
					bMod += this.dna.receptorBGrowthRate;

					if (noiseLevel === "loud"){
						bMod += this.dna.receptorBGrowthRate;
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

			}else{
				// The robot has memories about what was said
				console.log("Brain remembers the recent input speech");

				// Experience the feelings from the memories
				memoriesRelatedToNoise.forEach(node => {
					console.log(node);
					aMod += node.hormoneACount;
					bMod += node.hormoneBCount;
					cMod += node.hormoneCCount;
					xMod += node.hormoneXCount;
				});

				console.log("Experienced " + memoriesRelatedToNoise.length + " hormone adjustments from memories");

				// Take into account the speaker's mood and adjust hormones from there
				if (speakerMood === "mad"){
					// The speaker is mad, but does the robot have memories of this noise not being so upsetting?
					if (aMod >= 0){
						console.log("Robot understands you are mad about this memory it has positive feelings for");
						// It was a good memory, but maybe not at the moment
						aMod -= this.dna.receptorAGrowthRate * MathLib.getRandomNumber(0,5);
						bMod += this.dna.receptorBGrowthRate;
						cMod += this.dna.receptorCGrowthRate * MathLib.getRandomNumber(0,5);
						xMod -= this.dna.receptorXGrowthRate * MathLib.getRandomNumber(0,5);

						if (noiseLevel === "loud"){
							// They were yelling, this is extreme, the memory is tainted
							bMod *= MathLib.getRandomNumber(0,3);
							cMod *= MathLib.getRandomNumber(2,5);
						}
					}

					// TODO More confusing emotional responses?
				}else if (speakerMood === "sad"){
					// The speaker is mad, but does the robot have memories of this noise not being so sad?
					if (aMod >= 0){
						console.log("Robot understands you are sad about this memory it has positive feelings for");
						// It was a happy memory, but maybe not so much?
						aMod -= this.dna.receptorAGrowthRate * MathLib.getRandomNumber(0,2);
						bMod += this.dna.receptorBGrowthRate * MathLib.getRandomNumber(1,3);

						if (noiseLevel === "loud"){
							// They shouted their sadness from a once-thought-of happy memory
							aMod -= this.dna.receptorAGrowthRate * MathLib.getRandomNumber(2,5);
							bMod *= MathLib.getRandomNumber(1,2);
							cMod *= MathLib.getRandomNumber(2,6);
						}
					}
				}
			}

			// Digest the new hormones into increases
			// Below 0 change protections
			if ( (this.hormoneA += Math.ceil(aMod)) < 0 ){
				this.hormoneA = 0;
			}else{
				this.hormoneA += Math.ceil(aMod);
			}
			this.fireEvent("hormoneChanged", "hormoneA");

			if ( (this.hormoneB += Math.ceil(bMod)) < 0 ){
				this.hormoneB = 0;
			}else{
				this.hormoneB += Math.ceil(bMod);
			}
			this.fireEvent("hormoneChanged", "hormoneB");

			if ( (this.hormoneC += Math.ceil(cMod)) < 0 ){
				this.hormoneC = 0;
			}else{
				this.hormoneC += Math.ceil(cMod);
			}
			this.fireEvent("hormoneChanged", "hormoneC");

			if ( (this.hormoneX += Math.ceil(xMod)) < 0 ){
				this.hormoneX = 0;
			}else{
				this.hormoneX += Math.ceil(xMod);
			}
			this.fireEvent("hormoneChanged", "hormoneX");

			this.fireEvent("hormonesUpdated");
			this.memory.makeShortTermMemory(speaker, "self", text, this.hormoneA, this.hormoneB, this.hormoneC, this.hormoneX);
			callback();

			// Determine if it should respond?

			// Then respond accordingly by taking in recent speech and current emotional state
		});
	}

	/**
	* Emits speech and adds that speech to long-term memory and short term
	*
	* @param {string} target The target addressed
	* @return {undefined}
	*/
	speak(target){
		// Before speaking:
		/*
			1) Determine if there has been a conversation going on
			2) If none (TODO) why is it speaking? >.>
			2 again) Get the context of the situation by reading the short term memory
			3) Render a speech based on _____ ?; Use latest input from last speaker who isn't the self (robot) as conversation jumping off point
			4) Come up with multiple possible speech options and weigh them against consequences of how it could affect the target's emotions
			5) Choose one that has, in the past (from memory), caused hormones that are towards the current hormone cravings
			6) Add this speech to the short term memory
		*/
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
	* Register a callback for hormonesUpdated event
	*
	* @param {string} hormone
	* @return {undefined}
	*/
	onHormonesUpdated(callback){
		if (!("hormonesUpdated" in this.events)){
			this.events.hormonesUpdated = [];
		}

		this.events.hormonesUpdated.push(callback);
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
