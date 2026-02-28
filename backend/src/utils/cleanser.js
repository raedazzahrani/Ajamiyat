function cleanStringArray(array){
    if(array == null) return array;
    return array.filter( (element) => { return element!=null} );
}

function cleanString(string){
    if(string == null) return string;
    return string.trim();
}

module.exports = {cleanString, cleanStringArray};