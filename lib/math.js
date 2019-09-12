class Math{
	getRandomNumber(min, max){
		return Math.random() * (max-min) + min;
	}
}

module.exports = Math;
