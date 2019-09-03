const CharacterProcessor = require("./character-processor.js");

class SentenceProcessor{

	/**
	* Breaks up text into sentence parts
	*
	* Will convert a set of English text into individual sentences
	*
	* @param {string} massText
	* @return {string[]}
	*/
	static parseIntoSentences(massText){
		let position = 0;
		let currentText = massText.substr(position, 1);
		let buffer = ""; // Current buffer from loop
		let sentences = []; // Array of digested sentences. Buffers are dumped here

		while (currentText !== "" && currentText !== undefined){
			// Append the buffer with the new text
			buffer += String(currentText);
			if (currentText === "." || currentText === "?" || currentText === "!"){
				sentences.push(buffer);
				buffer = "";
			}

			++position;
			currentText = massText.substr(position, 1);
		}

		// Anything left in the buffer? Might be a final sentence (or only sentence) with no ending punctuation
		if (buffer.length > 0){
			sentences.push(buffer);
			buffer = "";
		}

		return sentences;
	}

	/**
	* Gets the alphabetical words of a sentence
	*
	* @param {string} sentence
	* @return {string[]}
	*/
	static getWords(sentence){
		let words = [];
		let currentBuffer = "";

		// Collect all the alphabetical words in a sentence
		[...sentence].forEach((char, position) => {

			// If the character is not a space or the last character, is it alphabetical?

			// TODO: Process B3st as Best and "Where @" as "Where at" or "Sk@te" and "Sk8te"
			// Do this by allowing them in the condition below
			// then prune words that are ONLY those characters out (have no alphas in their word) (@ by itself is at)
			// then convert them to "e" and "at or a" respectively
			if (char !== " "){
				if (CharacterProcessor.isAlphabetical(char)){
					// Add to buffer
					currentBuffer += char;
				}
			}else{
				// Digest whatever is in the buffer as a word
				if (currentBuffer.length > 0){
					words.push(currentBuffer);
					currentBuffer = "";
				}
			}
		});

		if (currentBuffer.length > 0){
			words.push(currentBuffer);
			currentBuffer = "";
		}

		console.log("Collected words: ");
		console.log(words);
		console.log("From sentence: " + sentence);

		return words;
	}

	/**
	* Determines if a sentence has mostly loud words by checking each words characters
	*
	* @param {string[]} words Array of words
	* @return {bool}
	*/
	static areWordsMostlyLoud(words){
		let numLoudWords = 0;

		words.forEach(function(word){
			let numLoudCharacters = 0;
			let numCharacters = 0;
			[...word].forEach(function(char){
				++numCharacters;
				if (char.toUpperCase() === char){
					++numLoudCharacters;
				}
			});

			// More loud characters than not, this is a loud word
			if (numLoudCharacters > (numCharacters - numLoudCharacters)){
				console.log(word + " is loud");
				++numLoudWords;
			}else{
				console.log(word + " is normal");
			}
		});

		console.log("Number of loud words: " + numLoudWords);
		console.log("Number of normal words: " + String(words.length - numLoudWords));

		return numLoudWords > (words.length - numLoudWords);
	}

	/**
	* Determines if a sentence is positive or negative
	*
	*
	*
	* @param {string} input
	* @return {string}
	*/
	static getSentencePolarity(sentence){

	}

	/**
	* Gets the tone of a sentence
	*
	* Context and atmospherical mood are not considered here
	*
	* @param {string} input
	* @return {string}
	*/
	static getSentenceNoiseLevel(sentence){
		let words = SentenceProcessor.getWords(sentence);
		let isMostlyLoud = SentenceProcessor.areWordsMostlyLoud(words);
		return isMostlyLoud ? "loud" : "normal";
	}

}

module.exports = SentenceProcessor;
