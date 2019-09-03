const SentenceProcessor = require("./sentence-processor.js");
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("cole", "azqqqdk##df22@SHJsdlkedfuew83jdsf129"));

class LanguageProcessor{

	/**
	* Adds a word to the database
	*
	* Can be linked to a word following the current word
	*
	* @param {string} word
	* @param {string} nextWord (optional)
	* @return {undefined}
	*/
	static addWord(word, nextWord){
		const session = driver.session();
		let resultPromise;

		if (nextWord === undefined){
			resultPromise = session.run(
				"MERGE (a:Word {text: $text})",
				{text: word}
			);
		}else{
			resultPromise = session.run(
				`MERGE (a:Word {text: $text})
				MERGE (b:Word {text:$nextWordText})
				MERGE (a)-[:NEXT_WORD]->(b)
				`,
				{text: word, nextWordText: nextWord}
			);
		}

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
			words.forEach((word, index) => {
				// Add the word and a previous word to the database
				LanguageProcessor.addWord(word, index <= words.length - 1 ? words[index + 1] : undefined);
				console.log("Adding word " + word);
			});
		});

		console.log("Processed all sentences");
	}
}

module.exports = LanguageProcessor;
