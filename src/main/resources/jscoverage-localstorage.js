if (typeof(_$jscoverage) == 'undefined' && (typeof(Storage) !== "undefined") && localStorage["jscover"])
    _$jscoverage = jscoverage_parseCoverageJSON(localStorage["jscover"]);
window.onbeforeunload = function () {
    if ((typeof(_$jscoverage) !== "undefined") && (typeof(Storage) !== "undefined"))
        localStorage["jscover"] = jscoverage_serializeCoverageToJSON();
}
