class MathLib{
	static getRandomNumber(min, max){
		return Math.random() * (max-min) + min;
	}

	/**
	* Gets the float percentage (0-1) that the hormone should lose
	*
	* This is used when hormones are consumed during idle (dying down)
	* @param {number} currentHormonePercentage The current float percentage of the hormone (0-1)
	* @return {number} The percentage of the hormone to decrease. The new hormone level should equal currentHormoneLevel - (currentHormoneLevel * returnedPercenage)
	*/
	static getPercentageHormoneLoss(currentHormonePercentage){
		let percentageOutOf100 = currentHormonePercentage * 100;
		return (-Math.pow(-0.9234, (0.1 * percentageOutOf100))) + 1; // This is an exponential loss graph
	}
}

module.exports = MathLib;
