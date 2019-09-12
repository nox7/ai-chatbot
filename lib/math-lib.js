class MathLib{
	static getRandomNumber(min, max){
		return Math.random() * (max-min) + min;
	}
}

module.exports = MathLib;
