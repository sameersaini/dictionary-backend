let dictionaryApiService = require('../services/dictionary/api');
let dictionaryHelpers = require('../services/dictionary/helpers');

let {status} = dictionaryApiService;
let {searchFromStart, searchFromEnd, searchFromCurrentCursor,
    findDistance, createResp} = dictionaryHelpers;

let findWord = async (req, res, next) => {
    const requiredWord = req.query.word;
    const definition = await fetchFromRedis(requiredWord);
    if(definition !== '') {
        return createResp(res, requiredWord, definition)
    }

    let currentPage = await status();
    let {currentTerm, currentTermDefinition} = currentPage.data;
    if(currentTerm === requiredWord) {
        console.log(currentTermDefinition);
        cache.add(requiredWord, currentTermDefinition, {}, () => {});
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

const fetchFromRedis = async (word) => {
    return new Promise((resolve, reject) => {
        cache.get(word, (error, entries) => {
            if(entries && Array.isArray(entries) && entries.length >= 1) {
                resolve(entries[0].body);
            }
            else {
                resolve('');
            }
        })
    })
}

module.exports = {findWord}
