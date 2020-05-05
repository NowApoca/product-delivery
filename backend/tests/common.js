const axios = require("axios");

async function post(url, data){
    return axios.post(url, data);
}

async function get(url){
    return axios.get(url);
}

async function handleAsyncError(func){
    try{
        const result = await func
        return result;
    }catch(e){
        return e.response.data;
    }
}

module.exports = {
    post,
    get,
    handleAsyncError
}