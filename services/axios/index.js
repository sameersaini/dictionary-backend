let axios = require('axios');

let instance = axios.create({
    baseURL: 'https://oke5yaeave.execute-api.us-west-2.amazonaws.com/prod',
    headers: {'x-api-key': 'nldO2MZE4ga9IZng1KCTviGzrnTgsBn8cfWGQG85'}
});

module.exports = instance;
