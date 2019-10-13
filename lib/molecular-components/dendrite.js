class Dendrite{

	/**
	* Constructs a default axon for a Neuron
	*
	* @param {Neuron} neuron The Neuron object this Axon belongs to
	*/
	constructor(neuron){
		/** @property {Neuron} fromNeuron The Neuron object this Axon belongs to */
		this.fromNeuron = neuron; // This property may possibly be useless, as neuron's have an array of their dendrites. This may be taking up useless amounts of data and could possibly be removed from data optimization

		/** @property {Neuron} connection The Neuron this dendrite is connected to */
		this.connection = undefined;
	}

	toJSON(){
		let obj = {};
		obj.fromNeuronPosition = {
			x:this.fromNeuron.x,
			y:this.fromNeuron.y,
			z:this.fromNeuron.z
		};

		obj.toConnectionPosition = {
			x:this.connection.x,
			y:this.connection.y,
			z:this.connection.z
		};

		return obj;
	}
}

module.exports = Dendrite;
