let express = require('express');
let router = express.Router();
const Brain = require("../lib/brain.js");
const MathLib = require("../lib/math-lib.js");

const thisHuman = new Brain();

setInterval(() => {
	// Every second, run a general brain "tick" to
	// review memories and current emotions/hormones
	// and adjust/modify them based on recent events or feelings
	// or "think" by attempting to discover connections between known
	// facts or words

	// When emotions are high, this process should also create more receptors,
	// as this is also part of "maturing"
	// When this robot experiences a lot of emotions that cause a lot of receptors,
	// sometimes this can result in desensitization in some people (robots)

	// Use artifical parts of body to "consume" hormones
	// When those parts desire that hormone, the bot acts accordingly

	// If no speech within 30s - 60s, then begin hormonal consumption (equilibrium attempt)
	if (thisHuman.lastDirectSpeechInteraction > 0){
		// console.log(thisHuman.lastDirectSpeechInteraction);
		if (thisHuman.hormoneA > 0 || thisHuman.hormoneB > 0 || thisHuman.hormoneC > 0 || thisHuman.hormoneX > 0){
			//let chosenTimeAgoComparisonThreshold = (new Date()).getTime() - MathLib.getRandomNumber(1000,5000);
			let chosenTimeAgoComparisonThreshold = (new Date()).getTime() - MathLib.getRandomNumber(30000, 60000);
			if (thisHuman.lastDirectSpeechInteraction <= chosenTimeAgoComparisonThreshold && thisHuman.lastHormoneConsumption <= chosenTimeAgoComparisonThreshold){
				console.log("Beginning equilibrium attempt by consuming hormones");
				thisHuman.consumeHormones();
			}
		}
	}
}, 10);

thisHuman.onHormoneChanged((whichHormone) => {
	if (whichHormone === "hormoneA"){
		console.log("Hormone A changed");
	}
});

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.post('/api/process', function(req, res, next) {
	console.log("---------- Processing ----------");

	// TODO Eventually distinguish between direct, indirect, and inanimate speakers
	// Use separate functions for that
	thisHuman.hearNoiseFromAnimate_Direct(req.fields.message, req.fields['speaker-mood'], () => {
		// Done processing the information, what now?
		res.json({
			hormoneA:thisHuman.hormoneA,
			hormoneB:thisHuman.hormoneB,
			hormoneC:thisHuman.hormoneC,
			hormoneX:thisHuman.hormoneX
		});
	});
	console.log("---------- END ----------");
});

module.exports = router;
