/*
	Notes

	Action Potential = The amount of electrical pulse needed to fire a signal along the axon
*/

class Neuron{

	/**
	* Constructs a default brain cell for a new brain
	*/
	constructor(){
		/** @property Dendrite[] All of the dendrites belonging to this neuron */
		this.dendrites = [];

		/** @property ? The axon of the neuron which sends a signal when the action potential of this neuron is reached because of enough signal, collectively, from along its dendrites */
		this.axon = undefined;

		/** @property number The cooldown period (in milliseconds) for which, if no signals were received within the timeframe of this number, the action potential sum should be reset to 0 potential */
		this.actionPotentialCooldown = 0;

		/** @property bool Whether or not the cooldown for the reset timer of the action potential has been started */
		this.actionPotentialCooldownCountdownBegun = false;

		this.x = 0;
		this.y = 0;
		this.z = 0;
	}

	setPosition(x,y,z){
		this.x = x;
		this.y = y;
		this.z = z;
	}

	/**
	* Converts the neuron's data to as primitive as possible for use with JSON encoding
	*
	* @return {object}
	*/
	toJSON(){
		let obj = {};

		obj.x = this.x;
		obj.y = this.y;
		obj.z = this.z;

		return obj;
	}
}

module.exports = Neuron;
