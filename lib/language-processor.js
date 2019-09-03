const SentenceProcessor = require("./sentence-processor.js");
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("cole", "azqqqdk##df22@SHJsdlkedfuew83jdsf129"));

class LanguageProcessor{

	/**
	* Adds a chain of words to the database
	*
	* @param {string[]} words
	* @return {undefined}
	*/
	static addChain(words){
		const session = driver.session();
		let resultPromise;
		let params = {}; // Parameters to be added
		let statement = ""; // The statement to be built and then ran

		words.forEach((word, position) => {
			statement += `(word${position}:Word {text: $text${position}})` + (position < words.length - 1 ? "-[:NEXT_WORD]->" : "");
			params["text" + String(position)] = word;
		});

		console.log("Made statement: " + statement);

		resultPromise = session.run(
			`CREATE ${statement}`,
			params
		);

		resultPromise.then(result => {
			session.close();
		}).catch(function(e){
			console.log(e);
		});
	}

	/**
	* Processes input
	*
	* @param {string} input
	* @return ?
	*/
	static process(input){
		let sentences = SentenceProcessor.parseIntoSentences(input);

		sentences.forEach((sentence, index) => {
			// Get the tone of the sentence
			let tone = SentenceProcessor.getSentenceNoiseLevel(sentence);

			// Get the words from a sentence
			let words = SentenceProcessor.getWords(sentence);

			console.log("Sentence " + index + " noise level is " + tone);

			// Add the words to the database with the contextuals:
			// + sentence tone
			// + atmospherical tone
			// + bot's mood
			LanguageProcessor.addChain(words);
		});

		console.log("Processed all sentences");
	}
}

module.exports = LanguageProcessor;
