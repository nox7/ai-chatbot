let express = require('express');
let router = express.Router();
const LanguageProcessor = require("../lib/language-processor.js");

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.post('/api/process', function(req, res, next) {
	console.log("---------- Processing ----------");
	LanguageProcessor.process(req.fields.message);
	console.log("---------- END ----------");
});

module.exports = router;
