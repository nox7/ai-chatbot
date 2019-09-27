const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("cole", "azqqqdk##df22@SHJsdlkedfuew83jdsf129"));
const SentenceProcessor = require("./sentence-processor.js");

class Memory{

	constructor(){
		/** @property {object[]} shortTermMemory Memories not particularly strong enough (yet) to be committed to long-term */
		this.shortTermMemory = [];
	}

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
		// Allow multiple instances of similar data to be stored
		// When recalling memories, each node is iterated over and the final "hormone" count remembered
		// is an interpolation of the nodes. Still, store all memories individually and do no optimization in the
		// storage step here.
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
	* Attempts to recall a memory, can return multiple instances
	*
	* @param {string} speaker (optional) If omitted, the speaker remembered will not be a condition of the memory recollection
	* @param {string} target (optional) If omitted, the target remembered will not be a condition of the memory recollection
	* @param {string} data The main node data to be looking for (text, or eventually physical data from a visual memory)
	* @return {mixed[]} Returns all possible nodes about that memory
	*/
	recall(speaker, target, data){

		// First, iterate through short term memories
		let textShortTermMemoriesRecalled = this.recallFromShortTerm(speaker, target, data, "text", 0.65);

		return textShortTermMemoriesRecalled;
	}

	/**
	* Runs iterations over short term memories for data matches
	*
	* TODO Possibly allow a "difference" factor in memories to be calculated to group similar memories in this recollection
	*
	* @param {string} speaker (optional) If omitted, the speaker remembered will not be a condition of the memory recollection
	* @param {string} target (optional) If omitted, the target remembered will not be a condition of the memory recollection
	* @param {string} data The main node data to be looking for (text, or eventually physical data from a visual memory)
	* @param {string} dataType The type of data, currently only text is supposed (text/visual/audio)
	* @param {string} similarityThreshold Decimal between 0 and 1 on the threshold a memory must be similar for it to be counted as related
	* @return {mixed[]} Returns all possible nodes about that memory
	*/
	recallFromShortTerm(speaker, target, data, dataType, similarityThreshold){
		let memoryResult = [];

		if (dataType === "text"){
			let wordsFromInputData = SentenceProcessor.getWords(data);

			if (wordsFromInputData.length > 0){
				this.shortTermMemory.forEach((node, index) => {
					// Get all words from data
					let wordsFromMemoryNode = SentenceProcessor.getWords(node.data);

					// How many words in the memory node are also found in the input data?
					let wordsFoundInParallel = 0;

					wordsFromMemoryNode.forEach(wordInNode => {
						wordsFromInputData.forEach(wordFromInput => {
							if (wordInNode.toLowerCase() === wordFromInput.toLowerCase()){
								++wordsFoundInParallel;
							}
						});
					});

					// How similar is this memory based on the data?
					let percentSimilarity = wordsFoundInParallel / wordsFromInputData.length;

					if (percentSimilarity >= similarityThreshold){
						// It's in the provided similarity threshold, add it to the return memories
						memoryResult.push(node);
					}
				});
			}
		}else{
			throw "Unsupported recollection dataType";
		}

		return memoryResult;
	}

}

module.exports = Memory;
