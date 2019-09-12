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
		let entryStatement = ""; // The statement that adds the entry word
		let statement = ""; // The statement to be built and then ran
		let relationsStatement = ""; // The statement that sets all relationships

		words.forEach((word, position) => {
			if (position === 0){
				entryStatement += `(eWord:EntryWord {text: $text${position}})`;

				if (words.length > 0){
					relationsStatement += "(eWord)-[:NEXT_WORD]->";
				}
			}else{
				statement += `CREATE (word${position}:Word {text: $text${position}}) \n`;
				if (position < words.length - 1){
					relationsStatement += `(word${position})-[:NEXT_WORD]->`;
				}else{
					relationsStatement += `(word${position})`;
				}
			}
			params["text" + String(position)] = word;
		});

		console.log("Made statement: " + statement);
		console.log("Made relations statement: " + relationsStatement);

		resultPromise = session.run(
			`
			MERGE ${entryStatement}
			${statement}
			MERGE ${relationsStatement}
			`,
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
	* @param {function} onSentenceProcess
	* @return ?
	*/
	static process(input){
		let sentences = SentenceProcessor.parseIntoSentences(input);

		sentences.forEach((sentence, index) => {
			// Get the tone of the sentence
			let tone = SentenceProcessor.getSentenceNoiseLevel(sentence);

			onSentenceProcess(sentence, tone);

			// Get the words from a sentence
			let words = SentenceProcessor.getWords(sentence);

			console.log("Sentence " + index + " noise level is " + tone);

			// Add the words to the database with the contextuals:
			// + sentence tone
			// + atmospherical tone
			// + bot's mood
			// LanguageProcessor.addChain(words);
		});

		console.log("Processed all sentences");
	}
}

module.exports = LanguageProcessor;
