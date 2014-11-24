Number.prototype.formatComma = function() {
  var n = this;
  // decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
  // decSeparator = decSeparator == undefined ? "." : decSeparator,
  var thouSeparator = thouSeparator == undefined ? "," : thouSeparator;
  var sign = n < 0 ? "-" : "";
  var i = parseInt(n = Math.abs(+n || 0)) + "";
  var j = (j = i.length) > 3 ? j % 3 : 0;
  return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator); //+ (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
};