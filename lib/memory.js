class Memory{

	/** @property {object[]} speechMemory Memories of all things the robot heard and from what speaker */
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
	* @param {string} speaker The speaker of the text
	* @param {string} text What was heard
	* @return {undefined}
	*/
	makeSpeechMemory(speaker, text){
		this.speechMemory.push({
			speaker:speaker,
			text:text
		});
	}
}

module.exports = Memory;
