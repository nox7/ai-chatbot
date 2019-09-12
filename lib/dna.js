const Math = require("./math");

/**
* This class is responsible for being a representation of how a growing brain should develop its structure
*/
class DNA{

	/**
	* Constructs a new strand of DNA
	*/
	construct(){
		this.receptorAGrowthRate = Math.getRandomNumber(0.1, 1.45);
		this.receptorBGrowthRate = Math.getRandomNumber(0.1, 1.45);
		this.receptorCGrowthRate = Math.getRandomNumber(0.1, 1.45);
		this.receptorXGrowthRate = Math.getRandomNumber(0.1, 1.45);
	}
}

module.exports = DNA;
