let axios = require('../axios/index');

let status = () => {
    return axios.get('/status');
};

let moveToNextPage = () => {
    return axios.post('/move-to-next-page');
}

let moveToPreviousPage = () => {
    return axios.post('/move-to-previous-page');
}

let jumpToFirstPage = () => {
    return axios.post('/jump-to-first-page');
}

let jumpToLastPage = () => {
    return axios.post('/jump-to-last-page');
}

let moveToNextTerm = () => {
    return axios.post('/move-to-next-term');
}

let moveToPreviousTerm = () => {
    return axios.post('/move-to-previous-term');
}

let jumpToFirstTerm = () => {
    return axios.post('/jump-to-first-term');
}

let jumpToLastTerm = () => {
    return axios.post('/jump-to-last-term');
}

module.exports = {
    status,
    moveToNextPage,
    moveToPreviousPage,
    jumpToFirstPage,
    jumpToLastPage,
    moveToNextTerm,
    moveToPreviousTerm,
    jumpToFirstTerm,
    jumpToLastTerm
}
