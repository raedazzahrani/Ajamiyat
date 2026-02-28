function parseInt(str) {
  // Only allow optional leading + or -, then digits
  if (!/^[-+]?\d+$/.test(str)) return null;
  return Number(str);
}


module.exports = {parseStrictInt: parseInt};