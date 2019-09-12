let express = require('express');
let router = express.Router();
const Brain = require("../lib/brain.js");

const newHuman = new Brain();

setInterval(() => {
	// Every second, run a general brain "tick" to
	// review memories and current emotions/hormones
	// and adjust/modify them based on recent events or feelings
	// or "think" by attempting to discover connections between known
	// facts or words
}, 1000);

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.post('/api/process', function(req, res, next) {
	console.log("---------- Processing ----------");

	// TODO Eventually distinguish between direct, indirect, and inanimate speakers
	// Use separate functions for that
	newHuman.hearNoiseFromAnimate_Direct(req.fields.message, req.fields.speakerMood);
	console.log("---------- END ----------");
});

module.exports = router;
