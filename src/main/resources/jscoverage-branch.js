function BranchData(position, nodeLength, src) {
    this.position = position;
    this.nodeLength = nodeLength;
    this.src = src;
    this.evalFalse = 0;
    this.evalTrue = 0;

    this.ranCondition = function(result) {
        if (result)
            this.evalTrue++;
        else
            this.evalFalse++;
    };

    this.covered = function() {
        return this.evalTrue > 0 && this.evalFalse > 0;
    };

    this.toJSON = function() {
        return '{"position":' + this.position
            + ',"nodeLength":' + this.nodeLength
            + ',"src":' + jscoverage_quote(this.src)
            + ',"evalFalse":' + this.evalFalse
            + ',"evalTrue":' + this.evalTrue + '}';
    };

    this.message = function() {
        if (!this.evalTrue && !this.evalFalse)
            return 'Condition never evaluated:\n' + this.src;
        else if (!this.evalTrue)
            return 'Condition never evaluated to true:\n' + this.src;
        else if (!this.evalFalse)
            return 'Condition never evaluated to false:\n' + this.src;
        else
            return 'Condition covered';
    };
}

BranchData.fromJson = function(jsonString) {
    var json = eval('(' + jsonString + ')');
    var branchData = new BranchData(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

function convertBranchDataConditionArrayToJSON(branchDataConditionArray) {
    var array = [];
    var length = branchDataConditionArray.length;
    for (var line = 0; line < length; line++) {
        var branchDataObject = branchDataConditionArray[line];
        if (branchDataObject === undefined || branchDataObject === null) {
            value = 'null';
        } else {
            value = branchDataObject.toJSON();
        }
        array.push(value);
    }
    return '[' + array.join(',') + ']';
}