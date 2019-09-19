const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("cole", "azqqqdk##df22@SHJsdlkedfuew83jdsf129"));

class Memory{

	/** @property {object[]} shortTermMemory Memories not particularly strong enough (yet) to be committed to long-term
	speechMemory = [];
	/*
	=>
		{
			"speaker":
			"text":
		}
	*/

	/**
	* Stores a speech and speaker in a memory
	*
	* If the hormones of a memory are high, then it is possible for it to go straight into long term
	*
	* @param {string} speaker The speaker of the text
	* @param {string} target The target of the text (another speaker or undefined/null for self)
	* @param {string} data The main data being stored (typically text for speech memories)
	* @param {number} hormoneACount The count of A hormones at the time
	* @param {number} hormoneBCount The count of B hormones at the time
	* @param {number} hormoneCCount The count of C hormones at the time
	* @param {number} hormoneXCount The count of X hormones at the time
	* @return {undefined}
	*/
	makeShortTermMemory(speaker, target, data, hormoneACount, hormoneBCount, hormoneCCount, hormoneXCount){
		this.shortTermMemory.push({
			speaker:speaker,
			target:target,
			data:data,
			hormoneACount:hormoneACount,
			hormoneBCount:hormoneBCount,
			hormoneCCount:hormoneCCount,
			hormoneXCount:hormoneXCount
		});
	}

	/**
	* Creates a new memory node with given properties
	*
	* @param {} a
	* @return {undefined}
	*/

}

module.exports = Memory;
