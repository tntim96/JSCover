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

BranchData.fromJsonObject = function(json) {
    var branchData = new BranchData(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

function convertBranchDataConditionArrayToJSON(branchDataConditionArray) {
    var array = [];
    var length = branchDataConditionArray.length;
    for (var condition = 0; condition < length; condition++) {
        var branchDataObject = branchDataConditionArray[condition];
        if (branchDataObject === undefined || branchDataObject === null) {
            value = 'null';
        } else {
            value = branchDataObject.toJSON();
        }
        array.push(value);
    }
    return '[' + array.join(',') + ']';
}

function convertBranchDataConditionArrayFromJSON(jsonString) {
    var array = [];
    var json = eval('(' + jsonString + ')');
    var length = json.length;
    for (var condition = 0; condition < length; condition++) {
        var branchDataJSON = json[condition];
        if (branchDataJSON === null) {
            value = null;
        } else {
            value = BranchData.fromJsonObject(branchDataJSON);
        }
        array.push(value);
    }
    return array;
}

function convertBranchDataLinesToJSON(branchData) {
    var array = [];
    var length = branchData.length;
    for (var line = 0; line < length; line++) {
        var branchDataObject = branchData[line];
        if (branchDataObject === undefined || branchDataObject === null) {
            value = 'null';
        } else {
            value = convertBranchDataConditionArrayToJSON(branchDataObject);
        }
        array.push(value);
    }
    return '[' + array.join(',') + ']';
}

function convertBranchDataLinesFromJSON(jsonString) {
    var array = [];
    var json = eval('(' + jsonString + ')');
    var length = json.length;
    for (var line = 0; line < length; line++) {
        var branchDataJSON = json[line];
        if (branchDataJSON === null) {
            value = null;
        } else {
            value = branchDataJSON;
            for (var conditionIndex = 0; conditionIndex < branchDataJSON.length; conditionIndex ++) {
                var condition = branchDataJSON[conditionIndex];
                if (condition !== null) {
                    value[conditionIndex] = BranchData.fromJsonObject(condition);
                }
            }
        }
        array.push(value);
    }
    return array;
}