class Vector3Int{

	constructor(x,y,z){

		this.x = Math.round(x);
		this.y = Math.round(y);
		this.z = Math.round(z);
	}

	/**
	* Calculate the distance between this vector and another
	*
	* @param {Vector3Int} otherVector3Int
	* @return {Int}
	*/
	distanceBetween(otherVector3Int){
		return Math.ceil(Math.sqrt( Math.pow(otherVector3Int.x - this.x, 2) + Math.pow(otherVector3Int.y - this.y, 2) + Math.pow(otherVector3Int.z - this.z, 2)));
	}

	/**
	* Checks if this Vector3Int is equal to another
	*
	* @param {Vector3Int} other
	* @return {bool}
	*/
	isEqual(other){
		return other.x === this.x && other.y === this.y && other.z === this.z;
	}

}

module.exports = Vector3Int;
