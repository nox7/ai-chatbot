class MemoryQuery{

	/**
	* Constructs a MemoryQuery for a specified brain
	*
	* @param {Brain} brain
	*/
	constructor(brain){
		this.brain = brain;
	}

	/**
	* Determines if a brain has memory of data. Will return the neuron that represents that data in memory
	*
	* This _does not_ trigger memory recollection. This function only tries to find a neuron representing the provided data. To trigger memory recollection that gains action potential, DO NOT USE THIS FUNCTION! Use MemoryQuery::remember()
	*
	* @param {string} data
	* @return {Neuron|undefined} Undefined if the memory does not exist
	*/
	hasMemoryOfTextData(data){
		for (let i = 0; this.brain.neurons.length; i++){
			let iNeuron = this.brain.neurons[i];
			if (iNeuron.data === data){
				return iNeuron;
			}
		}

		return undefined;
	}

	/**
	* Remembers data and gains action potential from that data's dendrite connections
	*
	* Will search the brain for a neuron representing the data, then will traverse that neuron's specific dendrite trail and gain action potential, feelings, and memories from it. WARNING This will cause the brain's chemical makeup to change based on what is in the memory of said data. For instance, if it has many bad memories about the data - it will react accordingly and possibly with very high action potential.
	*
	* @param {string} data
	* @return {undefined}
	*/
	remember(data){

	}


}

module.exports = MemoryQuery;
