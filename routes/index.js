let express = require('express');
let router = express.Router();
const Brain = require("../lib/brain.js");

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
}, 1000);

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
