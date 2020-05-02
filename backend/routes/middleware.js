const constants = require("../constants")
const errors = require("../src/common/errors")

function validateUserToken(req, res, next){
    const { token } = req.headers;
    const isValidID = isNotValidString(token , constants.tokenLength, constants.tokenLength)
    if(isValidID){
        res.status(400).json({error: errors.isNotValidToken})
        return;
    }
    next();
}

function isNotValidString(stringValue, min, max){
  if(typeof stringValue !== 'string' && !(stringValue instanceof String)){
      return errors.stringNotValidType;
  }
  if(stringValue.length > max || stringValue.length < min){
      return errors.stringNotValidLength;
  }
  return;
}

module.exports = {
    validateUserToken
}