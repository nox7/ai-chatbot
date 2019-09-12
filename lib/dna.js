const Math = require("./math");

/**
* This class is responsible for being a representation of how a growing brain should develop its structure
*/
class DNA{

	/**
	* Constructs a new strand of DNA
	*/
	construct(){

		// The receptor rate can be changed manually to define a more custom and controlled DNA
		// Right now this is set to be a random number set so it seems "individual" each time

		this.receptorAGrowthRate = Math.getRandomNumber(0.1, 9.85);
		this.receptorBGrowthRate = Math.getRandomNumber(0.1, 9.85);
		this.receptorCGrowthRate = Math.getRandomNumber(0.1, 9.85);
		this.receptorXGrowthRate = Math.getRandomNumber(0.1, 9.85);
	}
}

module.exports = DNA;
