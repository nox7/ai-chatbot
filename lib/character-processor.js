class CharacterProcessor{
	/**
	* Determines if a character is alphabetical
	*
	* @param {string} char
	* @return {bool}
	*/
	static isAlphabetical(char){
		if (char.length !== 1){
			throw "Character length must be 1";
		}

		let decimalByte = char.toLowerCase().charCodeAt(0);

		return decimalByte >= 97 && decimalByte <= 122;
	}
}

module.exports = CharacterProcessor;
