class AxonTerminal{

	/**
	* Constructs a default axon terminal for an Axon instance
	*
	* @param {Axon} axon The Axon object this AxonTerminal belongs to
	*/
	constructor(axon){
		/** @property Axon The Axon object this AxonTerminal belongs to */
		this.axon = axon;

		/** @property sendingNodeCount The amount of nodes open to sending data to a connected */
		this.sendingNodeCount = 0;

		/** @property connectedDendriteTerminal The dendrite terminal this axon terminal is connected to */
		this.connectedDendriteTerminal;
	}
}

module.exports = AxonTerminal;
