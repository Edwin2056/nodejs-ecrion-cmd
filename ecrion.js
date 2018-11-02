var axios = require('axios');

const EOS_URL = 'https://eos4.ecrion.com';


var authenticate = apiKey => axios
    .get(EOS_URL + '/api/v2/token', { headers: { Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}` } })
    .then(response => {
        return response.data.AccessToken;
    });

var render = (payload, token) => axios
    .post(EOS_URL + '/api/v2/render', payload, { responseType: 'arraybuffer', headers: { Authorization: `Basic ${Buffer.from(token).toString('base64')}`, 'Accept': 'application/pdf', 'Content-Type': 'application/json' } })

module.exports = {
    authenticate,
    render,
};
