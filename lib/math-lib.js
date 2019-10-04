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

	/**
	* Gets a random number with rejection sampling weights considered
	*
	* @param {number} min
	* @param {number} max
	* @param {number[string]} weights An object of string indices which represent numbers and values that represent the integer weight of numbers before that value
	* @return {number}
	*/
	static getRandomNumberConsiderWeight(min, max, weights){

		// First, compute max value in weights (add up all weights)
		let maxWeightValue = 0;
		Object.keys(weights).forEach(maxNumberForWeight => {
			let weight = weights[maxNumberForWeight];
			maxWeightValue += weight;
		});

		// Loop through all max numbers
		// If the evaluation of random(0, maxWeightValue) is less than or equal to weight
		// then get a random number between the [previous iteration's number or min if no previous iteration] and that maxNumberForWeight
		let finalValue;
		Object.keys(weights).forEach((maxNumberForWeight, i) => {
			let weight = weights[maxNumberForWeight];
			if (MathLib.getRandomNumber(0, maxWeightValue) <= weight){
				// This relies on the hopeful fact that the previous iteration is less than the current one
				if (i > 0){
					let previousNumber = Number(Object.keys(weights)[i-1]);
					finalValue = MathLib.getRandomNumber(previousNumber, Number(maxNumberForWeight));
				}else{
					finalValue = MathLib.getRandomNumber(min, Number(maxNumberForWeight));
				}
			}
		});

		if (finalValue === undefined){
			// This means no number was chosen from weight, get a random from min to max
			return MathLib.getRandomNumber(min, max);
		}else{
			return finalValue;
		}
	}
}

module.exports = MathLib;
