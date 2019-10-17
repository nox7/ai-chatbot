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

	/**
	* Gets all 26 cube-based adjacent positions to this vector
	*
	* @param {int} size (optional) Defaults to 1 (the size of the cube this vector would theoretically be apart of)
	* @return {Vector3Int}
	*/
	getAdjacentCubePositions(size){

		if (!size){
			size = 1;
		}

		let adjacentPositions = [];

		// NEED A TOTAL OF 26 POSITIONS TO BE ACCURATE

		// All corners (8 chunks) : total 8 so far
		adjacentPositions.push(new Vector3Int(this.x + size, this.y + size, this.z + size));
		adjacentPositions.push(new Vector3Int(this.x + size, this.y + size, this.z - size));
		adjacentPositions.push(new Vector3Int(this.x - size, this.y + size, this.z + size));
		adjacentPositions.push(new Vector3Int(this.x - size, this.y + size, this.z - size));
		adjacentPositions.push(new Vector3Int(this.x + size, this.y - size, this.z + size));
		adjacentPositions.push(new Vector3Int(this.x + size, this.y - size, this.z - size));
		adjacentPositions.push(new Vector3Int(this.x - size, this.y - size, this.z + size));
		adjacentPositions.push(new Vector3Int(this.x - size, this.y - size, this.z - size));

		// All directly adjacent cross faces (top, left, bottom, front, right)
		// (6 chunks) : total 14 so far
		adjacentPositions.push(new Vector3Int(this.x, this.y + size, this.z));
		adjacentPositions.push(new Vector3Int(this.x, this.y - size, this.z));
		adjacentPositions.push(new Vector3Int(this.x + size, this.y, this.z));
		adjacentPositions.push(new Vector3Int(this.x - size, this.y, this.z));
		adjacentPositions.push(new Vector3Int(this.x, this.y, this.z + size));
		adjacentPositions.push(new Vector3Int(this.x, this.y, this.z - size));

		// All edge-meeting chunks
		// (8 chunks) : total 22 so far
		adjacentPositions.push(new Vector3Int(this.x + size, this.y + size, this.z));
		adjacentPositions.push(new Vector3Int(this.x + size, this.y - size, this.z));
		adjacentPositions.push(new Vector3Int(this.x - size, this.y + size, this.z));
		adjacentPositions.push(new Vector3Int(this.x - size, this.y - size, this.z));
		adjacentPositions.push(new Vector3Int(this.x, this.y + size, this.z + size));
		adjacentPositions.push(new Vector3Int(this.x, this.y - size, this.z + size));
		adjacentPositions.push(new Vector3Int(this.x, this.y + size, this.z - size));
		adjacentPositions.push(new Vector3Int(this.x, this.y - size, this.z - size));

		// All vertically middle corner chunks (chunks in between two corners)
		// (4 chunks) : total 26 so far (done here)
		adjacentPositions.push(new Vector3Int(this.x + size, this.y, this.z + size));
		adjacentPositions.push(new Vector3Int(this.x + size, this.y, this.z - size));
		adjacentPositions.push(new Vector3Int(this.x - size, this.y, this.z + size));
		adjacentPositions.push(new Vector3Int(this.x - size, this.y, this.z - size));

		return adjacentPositions;
	}

}

module.exports = Vector3Int;
