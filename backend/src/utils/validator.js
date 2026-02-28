//if an optional field has an empty value, it gets deleted from the object


function validateRequiredString(value, fieldName){
    //handle both missing key and null value
    if(value === undefined)
        return `Missing the '${fieldName}' field`;
    if(value === null)
        return `'${fieldName}' can not be null`;
    if (typeof value !== "string")
        return `'${fieldName}' must be a string`;
    const trimmed = value.trim();
    if(trimmed === "")
        return `'${fieldName}' can not be empty`;
    return null;
}

function validateOptionalString(value, fieldName){
    //handle both missing key and null value
    if(value == null)
        return null;
    if (typeof value !== "string")
        return `'${fieldName}' must be a string`;
    const trimmed = value.trim();
    if(trimmed === "")
        return `'${fieldName}' can not be empty`;
    return null;
}

function validateOptionalStringArray(value, fieldName){
    const errors = [];
    if(value == null) return null;
    if(!Array.isArray(value)) return `'${fieldName}' must be an array`;
    if(value.length == 0) return null;
    for(let i = 0; i < value.length; i++){
        error = validateOptionalString(value, i);
        if(error) errors.push(`element '${value[i]}' at position ${error}`);
    }
    if (errors.length > 0) return errors;
    return null;
}

function validateRequiredStringArray(value, fieldName){
    const errors = [];
    if(value === undefined)
        return `Missing the '${fieldName}' field`;
    if(value === null)
        return `Field '${fieldName}' can not be null`;
    if(!Array.isArray(value)) return `'${fieldName}' must be an array`;
    if(value.length == 0)
        return `Field '${fieldName}' must contain at least one valid element`;
    for(let i = 0; i < value.length; i++){
        error = validateRequiredString(value, i);
        if(error) errors.push(`element '${value[i]}' at position ${error}`);
    }
    if (errors.length > 0) return errors;
    return null;
    
}

module.exports = {validateRequiredString, validateOptionalStringArray, validateOptionalString, validateRequiredStringArray};