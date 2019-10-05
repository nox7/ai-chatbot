class Dendrite{

	/**
	* Constructs a default axon for a Neuron
	*
	* @param {Neuron} neuron The Neuron object this Axon belongs to
	*/
	constructor(neuron){
		/** @property Neuron neuron The Neuron object this Axon belongs to */
		this.neuron = neuron;
	}
}

module.exports = Dendrite;
