class Renderer{
	constructor(){
		this.createScene();
	}

	/**
	* Creates the 3D canvas scene with camera controls
	*
	* @return {undefined}
	*/
	createScene(){
		this.container = document.getElementById("brain-container");

		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color( 0x200e2b );
		this.scene.fog = new THREE.Fog(0x200e2b, 2000, 2500);

		this.camera = new THREE.PerspectiveCamera( 35, this.container.clientWidth / this.container.clientHeight, 0.1, 3500 );
		this.camera.position.set(-5, 5, 7);

		this.controls = new THREE.OrbitControls(this.camera, this.container);

		this.ambientLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 7 );
		//this.ambientLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 5 );
		//this.directionalLight = new THREE.DirectionalLight(0xffffff, 5);
		//this.directionalLight.position.set(10,10,10);
		//this.scene.add(this.ambientLight, this.directionalLight);
		this.scene.add(this.ambientLight);

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.gammaFactor = 2.2;
		this.renderer.gammaOutput = true;
		this.renderer.physicallyCorrectLights = true;

		this.container.appendChild(this.renderer.domElement);

		this.createMaterialsAndGeometries();

		this.createGridLines();
		this.createStarPoints();

		window.addEventListener("resize", () => {
			this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
		});

		this.renderer.setAnimationLoop( () => {
			this.render();
		});
	}

	/**
	* Creates the materials and geometries for meshes that will be created
	*/
	createMaterialsAndGeometries(){
		this.neuronGeometry = new THREE.SphereBufferGeometry(3);
		this.neuronMaterial = new THREE.MeshStandardMaterial({
			// color: 0xff3333,
			color: 0xa2a2a2,
			flatShading:true
		});
		this.languageNeuronMaterial = new THREE.MeshStandardMaterial({
			color: 0x59b704,
			flatShading:true
		});
		this.neuronMaterial.color.convertSRGBToLinear();
	}

	/**
	* Fetches a Neuron mesh
	*
	* @param {object} vec3Position x,y,z properties
	* @param {string|undefined} neuronLabel If the neuron has a label, it is set
	* @param {object[]|undefined} dendrites Set of dendrites belonging to the neuron, if any
	* @return {}
	*/
	createNeuronMesh(vec3Position, neuronLabel, dendrites){
		const NeuronGroup = new THREE.Group();
		this.scene.add(NeuronGroup);

		let neuronMaterial;

		if (neuronLabel === undefined){
			neuronMaterial = this.neuronMaterial;
		}else{
			if (neuronLabel === "primordialLanguageNeuron"){
				neuronMaterial = this.languageNeuronMaterial;
			}
		}

		const Neuron = new THREE.Mesh(this.neuronGeometry, neuronMaterial);
		Neuron.position.set(vec3Position.x, vec3Position.y, vec3Position.z);

		if (dendrites !== undefined){
			dendrites.forEach( (dendriteData) => {
				let fromPosition = dendriteData.fromNeuronPosition;
				let toPosition = dendriteData.toConnectionPosition;

				let lineGeometry = new THREE.Geometry();
				lineGeometry.vertices.push(
					new THREE.Vector3(fromPosition.x, fromPosition.y, fromPosition.z),
					new THREE.Vector3(toPosition.x, toPosition.y, toPosition.z),
				)
				const Line = new THREE.Line(lineGeometry);
				NeuronGroup.add(Line);
			});
		}

		NeuronGroup.add(Neuron);
	}

	getRandomNumber(min, max){
		return Math.random() * (max-min) + min;
	}

	/**
	* Creates star points in space
	*/
	createStarPoints(){
		const dotGeometry = new THREE.Geometry();
		const dotMaterial = new THREE.PointsMaterial({size:1, sizeAttenuation:false});

		for(let i = 0; i < 1900; i++){
			dotGeometry.vertices.push(new THREE.Vector3(this.getRandomNumber(-1000, 1000),  this.getRandomNumber(-700, 700), this.getRandomNumber(-1000, 1000)));
		}

		const dots = new THREE.Points(dotGeometry, dotMaterial);
		this.scene.add(dots);


	}

	/**
	* Creates the grid lines
	*
	*/
	createGridLines(){
		// Every 10 units apart
		const lineGroup = new THREE.Group();
		this.gridLineMaterial = new THREE.LineBasicMaterial({
			color: 0xffffff
		});

		// X axis lines
		for (let x = -5000; x < 5000; x += 50){
			let lineGeometry = new THREE.Geometry();
			lineGeometry.vertices.push(
				new THREE.Vector3(x, -500, -5000),
				new THREE.Vector3(x, -500, 5000),
			)
			const Line = new THREE.Line(lineGeometry, this.gridLineMaterial);
			lineGroup.add(Line);
		}

		// z axis lines
		for (let z = -5000; z < 5000; z += 50){
			let lineGeometry = new THREE.Geometry();
			lineGeometry.vertices.push(
				new THREE.Vector3(-5000, -500, z),
				new THREE.Vector3(5000, -500, z),
			)
			const Line = new THREE.Line(lineGeometry, this.gridLineMaterial);
			lineGroup.add(Line);
		}

		this.scene.add(lineGroup);
	}

	render(){
		this.renderer.render(this.scene, this.camera);
	}

	/**
	* Renders the first map of the entire brain
	*
	* This process is most likely extremely CPU intensive
	*
	* @param {object[]} neurons All of the neurons in the brainand their microlocations
	* @return {undefined}
	*/
	renderInitialBrainMap(neurons){

	}
}

export default Renderer;
