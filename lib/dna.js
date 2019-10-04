const MathLib = require("./math-lib");

/**
* This class is responsible for being a representation of how a growing brain should develop its structure
*/
class DNA{

	/**
	* Constructs a new strand of DNA
	*/
	constructor(){

		// The receptor rate can be changed manually to define a more custom and controlled DNA
		// Right now this is set to be a random number set so it seems "individual" each time
		// These rates seemingly define how much receptors grow when exposed to large amounts of
		// their designated hormone - not growing at set intervals
		this.receptorAGrowthRate = MathLib.getRandomNumberConsiderWeight(0.1, 1, {"0.5":1, "0.9":4});
		this.receptorBGrowthRate = MathLib.getRandomNumberConsiderWeight(0.1, 1, {"0.25":4, "0.5":3, "0.9":1});
		this.receptorCGrowthRate = MathLib.getRandomNumberConsiderWeight(0.1, 1, {"0.33":3, "0.5":5, "0.9":1});
		// NOTE/TODO Consider here a gender and maybe a gender has a higher rate of feeling attracted to someone else
		this.receptorXGrowthRate = MathLib.getRandomNumberConsiderWeight(0.1, 1, {"0.25":1, "0.45":5, "0.75":3, "0.9":2});


		// These are the rates hormones are created when such hormones are generated
		// form the reaction to input.
		this.hormoneACreationRate = MathLib.getRandomNumber(0.1, 9.85);
		this.hormoneBCreationRate = MathLib.getRandomNumber(0.1, 9.85);
		this.hormoneCCreationRate = MathLib.getRandomNumber(0.1, 9.85);
		this.hormoneXCreationRate = MathLib.getRandomNumber(0.1, 9.85);

	}
}

module.exports = DNA;
