let axios = require('../axios/index');

let status = () => {
    return axios.get('/status');
};

let moveToNextPage = () => {
    return axios.get('/move-to-next-page');
}

let moveToPreviousPage = () => {
    return axios.get('/move-to-previous-page');
}

let jumpToFirstPage = () => {
    return axios.get('/jump-to-first-page');
}

let jumpToLastPage = () => {
    return axios.get('/jump-to-last-page');
}

let moveToNextTerm = () => {
    return axios.get('/move-to-next-term');
}

let moveToPreviousTerm = () => {
    return axios.get('/move-to-previous-term');
}

let jumpToFirstTerm = () => {
    return axios.get('/jump-to-first-term');
}

let jumpToLastTerm = () => {
    return axios.get('/jump-to-last-term');
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
