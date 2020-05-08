const axios = require("axios");

async function post(url, data){
    return axios.post(url, data);
}

async function get(url, headers){
    return axios.get(url, headers);
}

async function handleAsyncError(func){
    try{
        const result = await func
        return result;
    }catch(e){
        return e.response.data;
    }
}

function getStringWithnLength (n){
    var a = "";
    if(a.length<n){
        while(a.length<n){
            a += "j";
        }
    }
    return a;
}

module.exports = {
    post,
    get,
    handleAsyncError,
    getStringWithnLength,
}