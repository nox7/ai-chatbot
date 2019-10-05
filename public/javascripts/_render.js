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

		this.camera = new THREE.PerspectiveCamera( 35, this.container.clientWidth / this.container.clientHeight, 0.1, 2500 );
		this.camera.position.set(-5, 5, 7);

		this.controls = new THREE.OrbitControls(this.camera, this.container);

		this.ambientLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 5 );
		this.directionalLight = new THREE.DirectionalLight(0xffffff, 5);
		this.directionalLight.position.set(10,10,10);
		this.scene.add(this.ambientLight, this.directionalLight);

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.gammaFactor = 2.2;
		this.renderer.gammaOutput = true;
		this.renderer.physicallyCorrectLights = true;

		this.container.appendChild(this.renderer.domElement);

		this.createMaterialsAndGeometries();

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
	* @return {}
	*/
	createNeuronMesh(vec3Position, neuronLabel){
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

		NeuronGroup.add(Neuron);
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
