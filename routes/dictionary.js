let express = require('express');
let router = express.Router();
let dictionaryController = require('../controllers/dictionary')


/* GET users listing. */
router.get('/', dictionaryController.findWord);

module.exports = router;
