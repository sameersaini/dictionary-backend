let express = require('express');
let router = express.Router();
let dictionaryService = require('../services/dictionary/index');
let {status} = dictionaryService

/* GET users listing. */
router.get('/find/:word', function(req, res, next) {
    res.send({
        word: req.params.word,
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda cupiditate, dignissimos error et excepturi iste labore libero minus, necessitatibus perferendis recusandae reiciendis sit tenetur? A accusamus cum dicta doloremque dolores ducimus eligendi, enim ex illum in inventore ipsa magni, officia, quam quos rem rerum sapiente voluptate. Accusantium architecto cum libero!"
    })
});

module.exports = router;
