let dictionaryApiService = require('./api');

let {status, moveToNextPage, moveToPreviousPage, jumpToFirstPage,
    jumpToLastPage, moveToNextTerm, moveToPreviousTerm, jumpToFirstTerm,
    jumpToLastTerm} = dictionaryApiService;


const searchFromStart = async (res, requiredWord) => {
    console.log("from first Page")
    let firstPageResp = await jumpToFirstPage();
    let firstPageTerm = firstPageResp.data.currentTerm;
    let firstPageTermDefinition = firstPageResp.data.currentTermDefinition;

    if(requiredWord === firstPageTerm) {
        cache.add(requiredWord, firstPageTermDefinition, {}, () => {});
        return createResp(res, requiredWord, firstPageTermDefinition);
    }

    if(requiredWord < firstPageTerm) {
        await searchFirstPageBackward(res, requiredWord);
    }
    else {
        await searchRight(res, requiredWord)
    }
}

const searchFromEnd = async (res, requiredWord) => {
    console.log("from last Page")
    let lastPageResp = await jumpToLastPage();
    let lastPageTerm = lastPageResp.data.currentTerm;
    let lastPageTermDefinition = lastPageResp.data.currentTermDefinition;
    let lastPageTermIndex = lastPageResp.data.currentTermIndex

    if(requiredWord === lastPageTerm) {
        cache.add(requiredWord, lastPageTermDefinition, {}, () => {});
        return createResp(res, requiredWord, lastPageTermDefinition);
    }

    if(requiredWord > lastPageTerm) {
        await searchLastPageForward(res, requiredWord, lastPageTermIndex);
    }
    else {
        await searchLeft(res, requiredWord)
    }
}

const searchFromCurrentCursor = async (res, requiredWord, currentTerm) => {
    if(requiredWord > currentTerm) {
        await searchRight(res, requiredWord)
    } else {
        await searchLeft(res, requiredWord)
    }
}

const searchRight = async (res, requiredWord) => {
    console.log("to right")
    let startPage = await status();
    let startPageIndex = startPage.data.currentPageIndex;
    console.log("start page is " + startPageIndex);
    while(true) {
        // go to the next page
        let nextPageResp = await moveToNextPage();
        let nextPageTerm = nextPageResp.data.currentTerm;
        let nextPageTermDefinition = nextPageResp.data.currentTermDefinition;
        let nextPageTermIndex = nextPageResp.data.currentTermIndex
        let nextPageIndex = nextPageResp.data.currentPageIndex;

        console.log("moved to page" + nextPageIndex);
        // check if word on the next page matches with the requiredWord
        if(requiredWord === nextPageTerm) {
            cache.add(requiredWord, nextPageTermDefinition, {}, () => {});
            return createResp(res, requiredWord, nextPageTermDefinition)
        }

        // word at the cursor becomes larger than requiredWord
        if(nextPageTerm > requiredWord) {
            // move one backward one word by word
            let tempIndex = nextPageTermIndex;
            while(true) {
                let previousTermResp = await moveToPreviousTerm();
                let previousTerm = previousTermResp.data.currentTerm;
                let previousTermIndex = previousTermResp.data.currentTermIndex;
                let previousTermDefinition = previousTermResp.data.currentTermDefinition;
                console.log("term index is " + previousTermIndex);
                if(requiredWord === previousTerm) {
                    cache.add(requiredWord, previousTermDefinition, {}, () => {});
                    return createResp(res, requiredWord, previousTermDefinition)
                }

                if(requiredWord > previousTerm) {
                    return createResp(res, requiredWord, "Not Present");
                }
                // reached start of the page. requiredWord can be on the previous page
                if(tempIndex === previousTermIndex) {
                    let previousPageResp = await moveToPreviousPage();
                    let previousPageFirstIndex = previousPageResp.data.currentTermIndex;

                    let lastTermResp = await jumpToLastTerm();
                    let lastTerm = lastTermResp.data.currentTerm;
                    let lastTermDefinition = lastTermResp.data.currentTermDefinition;

                    if(requiredWord === lastTerm) {
                        cache.add(requiredWord, lastTermDefinition, {}, () => {});
                        return createResp(res, requiredWord, lastTermDefinition)
                    }

                    while(true) {
                        let previousTermResp = await moveToPreviousTerm();
                        let previousTerm = previousTermResp.data.currentTerm;
                        let previousTermIndex = previousTermResp.data.currentTermIndex;
                        let previousTermDefinition = previousTermResp.data.currentTermDefinition;
                        console.log("previous page index is " + previousTermIndex);
                        if(requiredWord === previousTerm) {
                            cache.add(requiredWord, previousTermDefinition, {}, () => {});
                            return createResp(res, requiredWord, previousTermDefinition)
                        }

                        if(requiredWord > previousTerm) {
                            return createResp(res, requiredWord, "Not Present");
                        }

                        if(previousTermIndex === previousPageFirstIndex) {
                            return createResp(res, requiredWord, "Not Present")
                        }
                    }
                }
                tempIndex = previousTermIndex;
            }
        }
        // case when we have reached the last page
        if(startPageIndex === nextPageIndex) {
            // move word by word forward till end of page
            console.log("reached last page");
            await searchLastPageForward(res, requiredWord, nextPageTermIndex);
            return;
        }
        startPageIndex = nextPageIndex;
    }
}

const searchLeft = async (res, requiredWord) => {
    console.log("to left")
    let startPage = await status();
    let startPageIndex = startPage.data.currentPageIndex;
    console.log("start page is " + startPageIndex);
    while(true) {
        // go to the previous page
        let previousPageResp = await moveToPreviousPage();
        let previousPageTerm = previousPageResp.data.currentTerm;
        let previousPageTermDefinition = previousPageResp.data.currentTermDefinition;
        let previousPageTermIndex = previousPageResp.data.currentTermIndex
        let previousPageIndex = previousPageResp.data.currentPageIndex;

        console.log("moved to page " + previousPageIndex);
        // check if word on the previous page matches with the requiredWord
        if(requiredWord === previousPageTerm) {
            cache.add(requiredWord, previousPageTermDefinition, {}, () => {});
            return createResp(res, requiredWord, previousPageTermDefinition)
        }
        console.log("requiredWord " + requiredWord);
        console.log("previousPageTerm " + previousPageTerm);

        if(previousPageTerm < requiredWord) {
            // move one forward one word by word
            let tempIndex = previousPageTermIndex;
            while(true) {
                let nextTermResp = await moveToNextTerm();
                let nextTerm = nextTermResp.data.currentTerm;
                let nextTermIndex = nextTermResp.data.currentTermIndex;
                let nextTermDefinition = nextTermResp.data.currentTermDefinition;

                console.log("moved to page index " + nextTermIndex);

                if(requiredWord === nextTerm) {
                    cache.add(requiredWord, nextTermDefinition, {}, () => {});
                    return createResp(res, requiredWord, nextTermDefinition)
                }

                if(requiredWord < nextTerm) {
                    return createResp(res, requiredWord, "Not Present");
                }
                // reached end of the page. requiredWord can be on the next page
                if(tempIndex === nextTermIndex) {
                    let nextPageResp = await moveToNextPage();
                    let nextPageLastTermIndex = nextPageResp.data.currentTermIndex;

                    let firstTermResp = await jumpToFirstTerm();
                    let firstTerm = firstTermResp.data.currentTerm;
                    let firstTermDefinition = firstTermResp.data.currentTermDefinition;
                    console.log("moved to next page")

                    if(requiredWord === firstTerm) {
                        cache.add(requiredWord, firstTermDefinition, {}, () => {});
                        return createResp(res, requiredWord, firstTermDefinition)
                    }

                    while(true) {
                        let nextTermResp = await moveToNextTerm();
                        let nextTerm = nextTermResp.data.currentTerm;
                        let nextTermIndex = nextTermResp.data.currentTermIndex;
                        let nextTermDefinition = nextTermResp.data.currentTermDefinition;
                        console.log("moved to page index " + nextTermIndex);
                        if(requiredWord === nextTerm) {
                            cache.add(requiredWord, nextTermDefinition, {}, () => {});
                            return createResp(res, requiredWord, nextTermDefinition)
                        }

                        if(requiredWord < nextTerm) {
                            return createResp(res, requiredWord, "Not Present");
                        }

                        if(nextTermIndex === nextPageLastTermIndex) {
                            return createResp(res, requiredWord, "Not Present")
                        }
                    }
                }
                tempIndex = nextTermIndex;
            }
        }

        // case when we have reached the first page
        if(previousPageIndex === 0) {
            // move word by word backward till end of page
            console.log("reached first page");
            await searchFirstPageBackward(res, requiredWord);
            return;
        }
    }
}

const searchFirstPageBackward = async (res, requiredWord) => {
    console.log("searching first page backwards");
    while(true) {
        let previousTermResp = await moveToPreviousTerm();
        let previousTerm = previousTermResp.data.currentTerm;
        let previousTermIndex = previousTermResp.data.currentTermIndex;
        let previousTermDefinition = previousTermResp.data.currentTermDefinition;
        console.log("moved to page index " + previousTermIndex);

        if(requiredWord === previousTerm) {
            cache.add(requiredWord, previousTermDefinition, {}, () => {});
            return createResp(res, requiredWord, previousTermDefinition)
        }
        // reached start but requiredWord not Present
        if(previousTermIndex === 0) {
            return createResp(res, requiredWord, "Not Present")
        }
    }
}

const searchLastPageForward = async (res, requiredWord, previousTermIndex) => {
    while(true) {
        let nextTermResp = await moveToNextTerm();
        let nextTerm = nextTermResp.data.currentTerm;
        let nextTermIndex = nextTermResp.data.currentTermIndex;
        let nextTermDefinition = nextTermResp.data.currentTermDefinition;

        if(requiredWord === nextTerm) {
            cache.add(requiredWord, nextTermDefinition, {}, () => {});
            return createResp(res, requiredWord, nextTermDefinition)
        }
        // reached end but requiredWord not Present
        if(previousTermIndex === nextTermIndex) {
            return createResp(res, requiredWord, "Not Present")
        }
        previousTermIndex = nextTermIndex;
    }
}

const createResp = (res, word, definition) => {
    return res.json({
        word,
        definition
    })
}

const findDistance = (a, b) => {
    return Math.abs(a.charCodeAt(0) - b.charCodeAt(0));
}

module.exports = {
    searchFromStart,
    searchFromEnd,
    searchFromCurrentCursor,
    findDistance,
    createResp
}
