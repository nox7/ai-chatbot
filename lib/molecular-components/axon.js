class Axon{

	/**
	* Constructs a default axon for a Neuron
	*
	* @param {Neuron} neuron The Neuron object this Axon belongs to
	*/
	constructor(neuron){
		/** @property Neuron neuron The Neuron object this Axon belongs to */
		this.neuron = neuron;

		/** @property terminals Filled with AxonTerminal instances connected to dendrite terminals each which have set amounts of sending nodes */
		this.terminals = [];
	}
}

module.exports = Axon;
