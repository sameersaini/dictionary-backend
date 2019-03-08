let dictionaryApiService = require('../services/dictionary/api');
let dictionaryHelpers = require('../services/dictionary/helpers');

let {status} = dictionaryApiService;
let {searchFromStart, searchFromEnd, searchFromCurrentCursor,
    findDistance, createResp} = dictionaryHelpers;

let findWord = async (req, res, next) => {
    const requiredWord = req.query.word;
    let currentPage = await status();
    let {currentTerm, currentTermDefinition} = currentPage.data;

    if(currentTerm === requiredWord) {
        // ToDo: add to cache
        return createResp(res, requiredWord, currentTermDefinition)
    }

    const distanceFromFirstWord = findDistance('A', requiredWord);
    const distanceFromLastWord = findDistance('Z', requiredWord);
    const distanceFromCurrentTerm = findDistance(currentTerm, requiredWord);
    const minDistance = Math.min(distanceFromFirstWord, distanceFromLastWord, distanceFromCurrentTerm);

    if(minDistance === distanceFromCurrentTerm) {
        await searchFromCurrentCursor(res, requiredWord, currentTerm);
    }
    else if (minDistance === distanceFromFirstWord) {
        await searchFromStart(res, requiredWord, currentTerm);
    }
    else {
        await searchFromEnd(res, requiredWord, currentTerm);
    }
}

module.exports = {findWord}
