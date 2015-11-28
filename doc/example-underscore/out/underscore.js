function BranchData() {
    this.position = -1;
    this.nodeLength = -1;
    this.src = null;
    this.evalFalse = 0;
    this.evalTrue = 0;

    this.init = function(position, nodeLength, src) {
        this.position = position;
        this.nodeLength = nodeLength;
        this.src = src;
        return this;
    };

    this.ranCondition = function(result) {
        if (result)
            this.evalTrue++;
        else
            this.evalFalse++;
    };

    this.pathsCovered = function() {
        var paths = 0;
        if (this.evalTrue > 0)
          paths++;
        if (this.evalFalse > 0)
          paths++;
        return paths;
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
        if (this.evalTrue === 0 && this.evalFalse === 0)
            return 'Condition never evaluated         :\t' + this.src;
        else if (this.evalTrue === 0)
            return 'Condition never evaluated to true :\t' + this.src;
        else if (this.evalFalse === 0)
            return 'Condition never evaluated to false:\t' + this.src;
        else
            return 'Condition covered';
    };
}

BranchData.fromJson = function(jsonString) {
    var json = eval('(' + jsonString + ')');
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

BranchData.fromJsonObject = function(json) {
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

function buildBranchMessage(conditions) {
    var message = 'The following was not covered:';
    var i;
    for (i = 0; i < conditions.length; i++) {
        if (conditions[i] !== undefined && conditions[i] !== null && !conditions[i].covered())
            message += '\n- '+ conditions[i].message();
    }
    return message;
}

function convertBranchDataConditionArrayToJSON(branchDataConditionArray) {
    var condition, branchDataObject, value;
    var array = [];
    var length = branchDataConditionArray.length;
    for (condition = 0; condition < length; condition++) {
        branchDataObject = branchDataConditionArray[condition];
        if (branchDataObject === undefined || branchDataObject === null) {
            value = 'null';
        } else {
            value = branchDataObject.toJSON();
        }
        array.push(value);
    }
    return '[' + array.join(',') + ']';
}

function convertBranchDataLinesToJSON(branchData) {
    if (branchData === undefined) {
        return '{}'
    }
    var line;
    var json = '';
    for (line in branchData) {
        if (isNaN(line))
            continue;
        if (json !== '')
            json += ',';
        json += '"' + line + '":' + convertBranchDataConditionArrayToJSON(branchData[line]);
    }
    return '{' + json + '}';
}

function convertBranchDataLinesFromJSON(jsonObject) {
    if (jsonObject === undefined) {
        return {};
    }
    var line, branchDataJSON, conditionIndex, condition;
    for (line in jsonObject) {
        branchDataJSON = jsonObject[line];
        if (branchDataJSON !== null) {
            for (conditionIndex = 0; conditionIndex < branchDataJSON.length; conditionIndex ++) {
                condition = branchDataJSON[conditionIndex];
                if (condition !== null) {
                    branchDataJSON[conditionIndex] = BranchData.fromJsonObject(condition);
                }
            }
        }
    }
    return jsonObject;
}
function jscoverage_quote(s) {
    return '"' + s.replace(/[\u0000-\u001f"\\\u007f-\uffff]/g, function (c) {
        switch (c) {
            case '\b':
                return '\\b';
            case '\f':
                return '\\f';
            case '\n':
                return '\\n';
            case '\r':
                return '\\r';
            case '\t':
                return '\\t';
            // IE doesn't support this
            /*
             case '\v':
             return '\\v';
             */
            case '"':
                return '\\"';
            case '\\':
                return '\\\\';
            default:
                return '\\u' + jscoverage_pad(c.charCodeAt(0).toString(16));
        }
    }) + '"';
}

function getArrayJSON(coverage) {
    var array = [];
    if (coverage === undefined)
        return array;

    var length = coverage.length;
    for (var line = 0; line < length; line++) {
        var value = coverage[line];
        if (value === undefined || value === null) {
            value = 'null';
        }
        array.push(value);
    }
    return array;
}

function jscoverage_serializeCoverageToJSON() {
    var json = [];
    for (var file in _$jscoverage) {
        var lineArray = getArrayJSON(_$jscoverage[file].lineData);
        var fnArray = getArrayJSON(_$jscoverage[file].functionData);

        json.push(jscoverage_quote(file) + ':{"lineData":[' + lineArray.join(',') + '],"functionData":[' + fnArray.join(',') + '],"branchData":' + convertBranchDataLinesToJSON(_$jscoverage[file].branchData) + '}');
    }
    return '{' + json.join(',') + '}';
}

function jscoverage_parseCoverageJSON(data) {
    var result = {};
    var json = eval('(' + data + ')');
    var file;
    for (file in json) {
        var fileCoverage = json[file];
        result[file] = {};
        result[file].lineData = fileCoverage.lineData;
        result[file].functionData = fileCoverage.functionData;
        result[file].branchData = convertBranchDataLinesFromJSON(fileCoverage.branchData);
    }
    return result;
}

function jscoverage_pad(s) {
    return '0000'.substr(s.length) + s;
}

function jscoverage_html_escape(s) {
    return s.replace(/[<>\&\"\']/g, function (c) {
        return '&#' + c.charCodeAt(0) + ';';
    });
}
var jsCover_isolateBrowser = false;
if (!jsCover_isolateBrowser) {
    try {
        if (typeof top === 'object' && top !== null && typeof top.opener === 'object' && top.opener !== null) {
            // this is a browser window that was opened from another window

            if (!top.opener._$jscoverage) {
                top.opener._$jscoverage = {};
            }
        }
    } catch (e) {
    }

    try {
        if (typeof top === 'object' && top !== null) {
            // this is a browser window

            try {
                if (typeof top.opener === 'object' && top.opener !== null && top.opener._$jscoverage) {
                    top._$jscoverage = top.opener._$jscoverage;
                }
            } catch (e) {
            }

            if (!top._$jscoverage) {
                top._$jscoverage = {};
            }
        }
    } catch (e) {
    }

    try {
        if (typeof top === 'object' && top !== null && top._$jscoverage) {
            this._$jscoverage = top._$jscoverage;
        }
    } catch (e) {
    }
}
if (!this._$jscoverage) {
    this._$jscoverage = {};
}
if (! _$jscoverage['/underscore.js']) {
  _$jscoverage['/underscore.js'] = {};
  _$jscoverage['/underscore.js'].lineData = [];
  _$jscoverage['/underscore.js'].lineData[6] = 0;
  _$jscoverage['/underscore.js'].lineData[14] = 0;
  _$jscoverage['/underscore.js'].lineData[19] = 0;
  _$jscoverage['/underscore.js'].lineData[22] = 0;
  _$jscoverage['/underscore.js'].lineData[25] = 0;
  _$jscoverage['/underscore.js'].lineData[33] = 0;
  _$jscoverage['/underscore.js'].lineData[39] = 0;
  _$jscoverage['/underscore.js'].lineData[42] = 0;
  _$jscoverage['/underscore.js'].lineData[43] = 0;
  _$jscoverage['/underscore.js'].lineData[44] = 0;
  _$jscoverage['/underscore.js'].lineData[45] = 0;
  _$jscoverage['/underscore.js'].lineData[53] = 0;
  _$jscoverage['/underscore.js'].lineData[54] = 0;
  _$jscoverage['/underscore.js'].lineData[55] = 0;
  _$jscoverage['/underscore.js'].lineData[57] = 0;
  _$jscoverage['/underscore.js'].lineData[59] = 0;
  _$jscoverage['/underscore.js'].lineData[63] = 0;
  _$jscoverage['/underscore.js'].lineData[68] = 0;
  _$jscoverage['/underscore.js'].lineData[69] = 0;
  _$jscoverage['/underscore.js'].lineData[70] = 0;
  _$jscoverage['/underscore.js'].lineData[71] = 0;
  _$jscoverage['/underscore.js'].lineData[76] = 0;
  _$jscoverage['/underscore.js'].lineData[79] = 0;
  _$jscoverage['/underscore.js'].lineData[83] = 0;
  _$jscoverage['/underscore.js'].lineData[84] = 0;
  _$jscoverage['/underscore.js'].lineData[91] = 0;
  _$jscoverage['/underscore.js'].lineData[92] = 0;
  _$jscoverage['/underscore.js'].lineData[93] = 0;
  _$jscoverage['/underscore.js'].lineData[94] = 0;
  _$jscoverage['/underscore.js'].lineData[95] = 0;
  _$jscoverage['/underscore.js'].lineData[98] = 0;
  _$jscoverage['/underscore.js'].lineData[99] = 0;
  _$jscoverage['/underscore.js'].lineData[104] = 0;
  _$jscoverage['/underscore.js'].lineData[105] = 0;
  _$jscoverage['/underscore.js'].lineData[106] = 0;
  _$jscoverage['/underscore.js'].lineData[107] = 0;
  _$jscoverage['/underscore.js'].lineData[108] = 0;
  _$jscoverage['/underscore.js'].lineData[109] = 0;
  _$jscoverage['/underscore.js'].lineData[110] = 0;
  _$jscoverage['/underscore.js'].lineData[112] = 0;
  _$jscoverage['/underscore.js'].lineData[113] = 0;
  _$jscoverage['/underscore.js'].lineData[114] = 0;
  _$jscoverage['/underscore.js'].lineData[115] = 0;
  _$jscoverage['/underscore.js'].lineData[117] = 0;
  _$jscoverage['/underscore.js'].lineData[118] = 0;
  _$jscoverage['/underscore.js'].lineData[119] = 0;
  _$jscoverage['/underscore.js'].lineData[121] = 0;
  _$jscoverage['/underscore.js'].lineData[122] = 0;
  _$jscoverage['/underscore.js'].lineData[127] = 0;
  _$jscoverage['/underscore.js'].lineData[128] = 0;
  _$jscoverage['/underscore.js'].lineData[129] = 0;
  _$jscoverage['/underscore.js'].lineData[130] = 0;
  _$jscoverage['/underscore.js'].lineData[131] = 0;
  _$jscoverage['/underscore.js'].lineData[132] = 0;
  _$jscoverage['/underscore.js'].lineData[133] = 0;
  _$jscoverage['/underscore.js'].lineData[136] = 0;
  _$jscoverage['/underscore.js'].lineData[137] = 0;
  _$jscoverage['/underscore.js'].lineData[138] = 0;
  _$jscoverage['/underscore.js'].lineData[146] = 0;
  _$jscoverage['/underscore.js'].lineData[147] = 0;
  _$jscoverage['/underscore.js'].lineData[148] = 0;
  _$jscoverage['/underscore.js'].lineData[149] = 0;
  _$jscoverage['/underscore.js'].lineData[150] = 0;
  _$jscoverage['/underscore.js'].lineData[159] = 0;
  _$jscoverage['/underscore.js'].lineData[160] = 0;
  _$jscoverage['/underscore.js'].lineData[161] = 0;
  _$jscoverage['/underscore.js'].lineData[162] = 0;
  _$jscoverage['/underscore.js'].lineData[163] = 0;
  _$jscoverage['/underscore.js'].lineData[164] = 0;
  _$jscoverage['/underscore.js'].lineData[167] = 0;
  _$jscoverage['/underscore.js'].lineData[168] = 0;
  _$jscoverage['/underscore.js'].lineData[169] = 0;
  _$jscoverage['/underscore.js'].lineData[172] = 0;
  _$jscoverage['/underscore.js'].lineData[176] = 0;
  _$jscoverage['/underscore.js'].lineData[177] = 0;
  _$jscoverage['/underscore.js'].lineData[178] = 0;
  _$jscoverage['/underscore.js'].lineData[181] = 0;
  _$jscoverage['/underscore.js'].lineData[182] = 0;
  _$jscoverage['/underscore.js'].lineData[183] = 0;
  _$jscoverage['/underscore.js'].lineData[185] = 0;
  _$jscoverage['/underscore.js'].lineData[189] = 0;
  _$jscoverage['/underscore.js'].lineData[192] = 0;
  _$jscoverage['/underscore.js'].lineData[193] = 0;
  _$jscoverage['/underscore.js'].lineData[196] = 0;
  _$jscoverage['/underscore.js'].lineData[197] = 0;
  _$jscoverage['/underscore.js'].lineData[198] = 0;
  _$jscoverage['/underscore.js'].lineData[200] = 0;
  _$jscoverage['/underscore.js'].lineData[201] = 0;
  _$jscoverage['/underscore.js'].lineData[202] = 0;
  _$jscoverage['/underscore.js'].lineData[204] = 0;
  _$jscoverage['/underscore.js'].lineData[207] = 0;
  _$jscoverage['/underscore.js'].lineData[208] = 0;
  _$jscoverage['/underscore.js'].lineData[209] = 0;
  _$jscoverage['/underscore.js'].lineData[215] = 0;
  _$jscoverage['/underscore.js'].lineData[218] = 0;
  _$jscoverage['/underscore.js'].lineData[221] = 0;
  _$jscoverage['/underscore.js'].lineData[222] = 0;
  _$jscoverage['/underscore.js'].lineData[223] = 0;
  _$jscoverage['/underscore.js'].lineData[224] = 0;
  _$jscoverage['/underscore.js'].lineData[226] = 0;
  _$jscoverage['/underscore.js'].lineData[228] = 0;
  _$jscoverage['/underscore.js'].lineData[233] = 0;
  _$jscoverage['/underscore.js'].lineData[234] = 0;
  _$jscoverage['/underscore.js'].lineData[235] = 0;
  _$jscoverage['/underscore.js'].lineData[236] = 0;
  _$jscoverage['/underscore.js'].lineData[237] = 0;
  _$jscoverage['/underscore.js'].lineData[239] = 0;
  _$jscoverage['/underscore.js'].lineData[243] = 0;
  _$jscoverage['/underscore.js'].lineData[244] = 0;
  _$jscoverage['/underscore.js'].lineData[249] = 0;
  _$jscoverage['/underscore.js'].lineData[250] = 0;
  _$jscoverage['/underscore.js'].lineData[251] = 0;
  _$jscoverage['/underscore.js'].lineData[253] = 0;
  _$jscoverage['/underscore.js'].lineData[254] = 0;
  _$jscoverage['/underscore.js'].lineData[255] = 0;
  _$jscoverage['/underscore.js'].lineData[257] = 0;
  _$jscoverage['/underscore.js'].lineData[262] = 0;
  _$jscoverage['/underscore.js'].lineData[263] = 0;
  _$jscoverage['/underscore.js'].lineData[264] = 0;
  _$jscoverage['/underscore.js'].lineData[266] = 0;
  _$jscoverage['/underscore.js'].lineData[267] = 0;
  _$jscoverage['/underscore.js'].lineData[268] = 0;
  _$jscoverage['/underscore.js'].lineData[270] = 0;
  _$jscoverage['/underscore.js'].lineData[275] = 0;
  _$jscoverage['/underscore.js'].lineData[276] = 0;
  _$jscoverage['/underscore.js'].lineData[277] = 0;
  _$jscoverage['/underscore.js'].lineData[278] = 0;
  _$jscoverage['/underscore.js'].lineData[282] = 0;
  _$jscoverage['/underscore.js'].lineData[283] = 0;
  _$jscoverage['/underscore.js'].lineData[284] = 0;
  _$jscoverage['/underscore.js'].lineData[285] = 0;
  _$jscoverage['/underscore.js'].lineData[286] = 0;
  _$jscoverage['/underscore.js'].lineData[291] = 0;
  _$jscoverage['/underscore.js'].lineData[292] = 0;
  _$jscoverage['/underscore.js'].lineData[297] = 0;
  _$jscoverage['/underscore.js'].lineData[298] = 0;
  _$jscoverage['/underscore.js'].lineData[303] = 0;
  _$jscoverage['/underscore.js'].lineData[304] = 0;
  _$jscoverage['/underscore.js'].lineData[308] = 0;
  _$jscoverage['/underscore.js'].lineData[309] = 0;
  _$jscoverage['/underscore.js'].lineData[311] = 0;
  _$jscoverage['/underscore.js'].lineData[312] = 0;
  _$jscoverage['/underscore.js'].lineData[313] = 0;
  _$jscoverage['/underscore.js'].lineData[314] = 0;
  _$jscoverage['/underscore.js'].lineData[315] = 0;
  _$jscoverage['/underscore.js'].lineData[316] = 0;
  _$jscoverage['/underscore.js'].lineData[320] = 0;
  _$jscoverage['/underscore.js'].lineData[321] = 0;
  _$jscoverage['/underscore.js'].lineData[322] = 0;
  _$jscoverage['/underscore.js'].lineData[323] = 0;
  _$jscoverage['/underscore.js'].lineData[324] = 0;
  _$jscoverage['/underscore.js'].lineData[325] = 0;
  _$jscoverage['/underscore.js'].lineData[329] = 0;
  _$jscoverage['/underscore.js'].lineData[333] = 0;
  _$jscoverage['/underscore.js'].lineData[334] = 0;
  _$jscoverage['/underscore.js'].lineData[336] = 0;
  _$jscoverage['/underscore.js'].lineData[337] = 0;
  _$jscoverage['/underscore.js'].lineData[338] = 0;
  _$jscoverage['/underscore.js'].lineData[339] = 0;
  _$jscoverage['/underscore.js'].lineData[340] = 0;
  _$jscoverage['/underscore.js'].lineData[341] = 0;
  _$jscoverage['/underscore.js'].lineData[345] = 0;
  _$jscoverage['/underscore.js'].lineData[346] = 0;
  _$jscoverage['/underscore.js'].lineData[347] = 0;
  _$jscoverage['/underscore.js'].lineData[348] = 0;
  _$jscoverage['/underscore.js'].lineData[349] = 0;
  _$jscoverage['/underscore.js'].lineData[350] = 0;
  _$jscoverage['/underscore.js'].lineData[354] = 0;
  _$jscoverage['/underscore.js'].lineData[358] = 0;
  _$jscoverage['/underscore.js'].lineData[359] = 0;
  _$jscoverage['/underscore.js'].lineData[366] = 0;
  _$jscoverage['/underscore.js'].lineData[367] = 0;
  _$jscoverage['/underscore.js'].lineData[368] = 0;
  _$jscoverage['/underscore.js'].lineData[369] = 0;
  _$jscoverage['/underscore.js'].lineData[371] = 0;
  _$jscoverage['/underscore.js'].lineData[372] = 0;
  _$jscoverage['/underscore.js'].lineData[373] = 0;
  _$jscoverage['/underscore.js'].lineData[374] = 0;
  _$jscoverage['/underscore.js'].lineData[375] = 0;
  _$jscoverage['/underscore.js'].lineData[376] = 0;
  _$jscoverage['/underscore.js'].lineData[377] = 0;
  _$jscoverage['/underscore.js'].lineData[378] = 0;
  _$jscoverage['/underscore.js'].lineData[379] = 0;
  _$jscoverage['/underscore.js'].lineData[381] = 0;
  _$jscoverage['/underscore.js'].lineData[385] = 0;
  _$jscoverage['/underscore.js'].lineData[386] = 0;
  _$jscoverage['/underscore.js'].lineData[387] = 0;
  _$jscoverage['/underscore.js'].lineData[388] = 0;
  _$jscoverage['/underscore.js'].lineData[389] = 0;
  _$jscoverage['/underscore.js'].lineData[395] = 0;
  _$jscoverage['/underscore.js'].lineData[396] = 0;
  _$jscoverage['/underscore.js'].lineData[397] = 0;
  _$jscoverage['/underscore.js'].lineData[398] = 0;
  _$jscoverage['/underscore.js'].lineData[399] = 0;
  _$jscoverage['/underscore.js'].lineData[401] = 0;
  _$jscoverage['/underscore.js'].lineData[406] = 0;
  _$jscoverage['/underscore.js'].lineData[407] = 0;
  _$jscoverage['/underscore.js'].lineData[408] = 0;
  _$jscoverage['/underscore.js'].lineData[409] = 0;
  _$jscoverage['/underscore.js'].lineData[410] = 0;
  _$jscoverage['/underscore.js'].lineData[411] = 0;
  _$jscoverage['/underscore.js'].lineData[412] = 0;
  _$jscoverage['/underscore.js'].lineData[414] = 0;
  _$jscoverage['/underscore.js'].lineData[420] = 0;
  _$jscoverage['/underscore.js'].lineData[421] = 0;
  _$jscoverage['/underscore.js'].lineData[426] = 0;
  _$jscoverage['/underscore.js'].lineData[427] = 0;
  _$jscoverage['/underscore.js'].lineData[433] = 0;
  _$jscoverage['/underscore.js'].lineData[434] = 0;
  _$jscoverage['/underscore.js'].lineData[437] = 0;
  _$jscoverage['/underscore.js'].lineData[439] = 0;
  _$jscoverage['/underscore.js'].lineData[440] = 0;
  _$jscoverage['/underscore.js'].lineData[441] = 0;
  _$jscoverage['/underscore.js'].lineData[442] = 0;
  _$jscoverage['/underscore.js'].lineData[444] = 0;
  _$jscoverage['/underscore.js'].lineData[446] = 0;
  _$jscoverage['/underscore.js'].lineData[447] = 0;
  _$jscoverage['/underscore.js'].lineData[451] = 0;
  _$jscoverage['/underscore.js'].lineData[452] = 0;
  _$jscoverage['/underscore.js'].lineData[453] = 0;
  _$jscoverage['/underscore.js'].lineData[458] = 0;
  _$jscoverage['/underscore.js'].lineData[459] = 0;
  _$jscoverage['/underscore.js'].lineData[468] = 0;
  _$jscoverage['/underscore.js'].lineData[469] = 0;
  _$jscoverage['/underscore.js'].lineData[470] = 0;
  _$jscoverage['/underscore.js'].lineData[471] = 0;
  _$jscoverage['/underscore.js'].lineData[477] = 0;
  _$jscoverage['/underscore.js'].lineData[478] = 0;
  _$jscoverage['/underscore.js'].lineData[483] = 0;
  _$jscoverage['/underscore.js'].lineData[484] = 0;
  _$jscoverage['/underscore.js'].lineData[485] = 0;
  _$jscoverage['/underscore.js'].lineData[486] = 0;
  _$jscoverage['/underscore.js'].lineData[492] = 0;
  _$jscoverage['/underscore.js'].lineData[493] = 0;
  _$jscoverage['/underscore.js'].lineData[497] = 0;
  _$jscoverage['/underscore.js'].lineData[498] = 0;
  _$jscoverage['/underscore.js'].lineData[502] = 0;
  _$jscoverage['/underscore.js'].lineData[503] = 0;
  _$jscoverage['/underscore.js'].lineData[504] = 0;
  _$jscoverage['/underscore.js'].lineData[505] = 0;
  _$jscoverage['/underscore.js'].lineData[506] = 0;
  _$jscoverage['/underscore.js'].lineData[507] = 0;
  _$jscoverage['/underscore.js'].lineData[509] = 0;
  _$jscoverage['/underscore.js'].lineData[510] = 0;
  _$jscoverage['/underscore.js'].lineData[511] = 0;
  _$jscoverage['/underscore.js'].lineData[513] = 0;
  _$jscoverage['/underscore.js'].lineData[514] = 0;
  _$jscoverage['/underscore.js'].lineData[516] = 0;
  _$jscoverage['/underscore.js'].lineData[517] = 0;
  _$jscoverage['/underscore.js'].lineData[520] = 0;
  _$jscoverage['/underscore.js'].lineData[524] = 0;
  _$jscoverage['/underscore.js'].lineData[525] = 0;
  _$jscoverage['/underscore.js'].lineData[529] = 0;
  _$jscoverage['/underscore.js'].lineData[530] = 0;
  _$jscoverage['/underscore.js'].lineData[536] = 0;
  _$jscoverage['/underscore.js'].lineData[537] = 0;
  _$jscoverage['/underscore.js'].lineData[538] = 0;
  _$jscoverage['/underscore.js'].lineData[539] = 0;
  _$jscoverage['/underscore.js'].lineData[540] = 0;
  _$jscoverage['/underscore.js'].lineData[542] = 0;
  _$jscoverage['/underscore.js'].lineData[543] = 0;
  _$jscoverage['/underscore.js'].lineData[544] = 0;
  _$jscoverage['/underscore.js'].lineData[545] = 0;
  _$jscoverage['/underscore.js'].lineData[546] = 0;
  _$jscoverage['/underscore.js'].lineData[548] = 0;
  _$jscoverage['/underscore.js'].lineData[549] = 0;
  _$jscoverage['/underscore.js'].lineData[550] = 0;
  _$jscoverage['/underscore.js'].lineData[551] = 0;
  _$jscoverage['/underscore.js'].lineData[552] = 0;
  _$jscoverage['/underscore.js'].lineData[553] = 0;
  _$jscoverage['/underscore.js'].lineData[554] = 0;
  _$jscoverage['/underscore.js'].lineData[556] = 0;
  _$jscoverage['/underscore.js'].lineData[557] = 0;
  _$jscoverage['/underscore.js'].lineData[560] = 0;
  _$jscoverage['/underscore.js'].lineData[565] = 0;
  _$jscoverage['/underscore.js'].lineData[566] = 0;
  _$jscoverage['/underscore.js'].lineData[571] = 0;
  _$jscoverage['/underscore.js'].lineData[572] = 0;
  _$jscoverage['/underscore.js'].lineData[573] = 0;
  _$jscoverage['/underscore.js'].lineData[574] = 0;
  _$jscoverage['/underscore.js'].lineData[575] = 0;
  _$jscoverage['/underscore.js'].lineData[576] = 0;
  _$jscoverage['/underscore.js'].lineData[577] = 0;
  _$jscoverage['/underscore.js'].lineData[578] = 0;
  _$jscoverage['/underscore.js'].lineData[579] = 0;
  _$jscoverage['/underscore.js'].lineData[581] = 0;
  _$jscoverage['/underscore.js'].lineData[583] = 0;
  _$jscoverage['/underscore.js'].lineData[588] = 0;
  _$jscoverage['/underscore.js'].lineData[589] = 0;
  _$jscoverage['/underscore.js'].lineData[590] = 0;
  _$jscoverage['/underscore.js'].lineData[591] = 0;
  _$jscoverage['/underscore.js'].lineData[597] = 0;
  _$jscoverage['/underscore.js'].lineData[598] = 0;
  _$jscoverage['/underscore.js'].lineData[599] = 0;
  _$jscoverage['/underscore.js'].lineData[601] = 0;
  _$jscoverage['/underscore.js'].lineData[602] = 0;
  _$jscoverage['/underscore.js'].lineData[604] = 0;
  _$jscoverage['/underscore.js'].lineData[609] = 0;
  _$jscoverage['/underscore.js'].lineData[614] = 0;
  _$jscoverage['/underscore.js'].lineData[615] = 0;
  _$jscoverage['/underscore.js'].lineData[616] = 0;
  _$jscoverage['/underscore.js'].lineData[617] = 0;
  _$jscoverage['/underscore.js'].lineData[618] = 0;
  _$jscoverage['/underscore.js'].lineData[620] = 0;
  _$jscoverage['/underscore.js'].lineData[623] = 0;
  _$jscoverage['/underscore.js'].lineData[627] = 0;
  _$jscoverage['/underscore.js'].lineData[628] = 0;
  _$jscoverage['/underscore.js'].lineData[629] = 0;
  _$jscoverage['/underscore.js'].lineData[630] = 0;
  _$jscoverage['/underscore.js'].lineData[631] = 0;
  _$jscoverage['/underscore.js'].lineData[632] = 0;
  _$jscoverage['/underscore.js'].lineData[633] = 0;
  _$jscoverage['/underscore.js'].lineData[635] = 0;
  _$jscoverage['/underscore.js'].lineData[640] = 0;
  _$jscoverage['/underscore.js'].lineData[641] = 0;
  _$jscoverage['/underscore.js'].lineData[645] = 0;
  _$jscoverage['/underscore.js'].lineData[646] = 0;
  _$jscoverage['/underscore.js'].lineData[647] = 0;
  _$jscoverage['/underscore.js'].lineData[648] = 0;
  _$jscoverage['/underscore.js'].lineData[649] = 0;
  _$jscoverage['/underscore.js'].lineData[650] = 0;
  _$jscoverage['/underscore.js'].lineData[651] = 0;
  _$jscoverage['/underscore.js'].lineData[653] = 0;
  _$jscoverage['/underscore.js'].lineData[657] = 0;
  _$jscoverage['/underscore.js'].lineData[658] = 0;
  _$jscoverage['/underscore.js'].lineData[659] = 0;
  _$jscoverage['/underscore.js'].lineData[660] = 0;
  _$jscoverage['/underscore.js'].lineData[661] = 0;
  _$jscoverage['/underscore.js'].lineData[662] = 0;
  _$jscoverage['/underscore.js'].lineData[664] = 0;
  _$jscoverage['/underscore.js'].lineData[666] = 0;
  _$jscoverage['/underscore.js'].lineData[667] = 0;
  _$jscoverage['/underscore.js'].lineData[668] = 0;
  _$jscoverage['/underscore.js'].lineData[670] = 0;
  _$jscoverage['/underscore.js'].lineData[671] = 0;
  _$jscoverage['/underscore.js'].lineData[672] = 0;
  _$jscoverage['/underscore.js'].lineData[674] = 0;
  _$jscoverage['/underscore.js'].lineData[675] = 0;
  _$jscoverage['/underscore.js'].lineData[677] = 0;
  _$jscoverage['/underscore.js'].lineData[685] = 0;
  _$jscoverage['/underscore.js'].lineData[686] = 0;
  _$jscoverage['/underscore.js'].lineData[691] = 0;
  _$jscoverage['/underscore.js'].lineData[692] = 0;
  _$jscoverage['/underscore.js'].lineData[693] = 0;
  _$jscoverage['/underscore.js'].lineData[694] = 0;
  _$jscoverage['/underscore.js'].lineData[696] = 0;
  _$jscoverage['/underscore.js'].lineData[698] = 0;
  _$jscoverage['/underscore.js'].lineData[699] = 0;
  _$jscoverage['/underscore.js'].lineData[701] = 0;
  _$jscoverage['/underscore.js'].lineData[702] = 0;
  _$jscoverage['/underscore.js'].lineData[705] = 0;
  _$jscoverage['/underscore.js'].lineData[710] = 0;
  _$jscoverage['/underscore.js'].lineData[711] = 0;
  _$jscoverage['/underscore.js'].lineData[713] = 0;
  _$jscoverage['/underscore.js'].lineData[714] = 0;
  _$jscoverage['/underscore.js'].lineData[715] = 0;
  _$jscoverage['/underscore.js'].lineData[716] = 0;
  _$jscoverage['/underscore.js'].lineData[718] = 0;
  _$jscoverage['/underscore.js'].lineData[726] = 0;
  _$jscoverage['/underscore.js'].lineData[727] = 0;
  _$jscoverage['/underscore.js'].lineData[728] = 0;
  _$jscoverage['/underscore.js'].lineData[729] = 0;
  _$jscoverage['/underscore.js'].lineData[730] = 0;
  _$jscoverage['/underscore.js'].lineData[731] = 0;
  _$jscoverage['/underscore.js'].lineData[737] = 0;
  _$jscoverage['/underscore.js'].lineData[738] = 0;
  _$jscoverage['/underscore.js'].lineData[739] = 0;
  _$jscoverage['/underscore.js'].lineData[740] = 0;
  _$jscoverage['/underscore.js'].lineData[742] = 0;
  _$jscoverage['/underscore.js'].lineData[749] = 0;
  _$jscoverage['/underscore.js'].lineData[750] = 0;
  _$jscoverage['/underscore.js'].lineData[751] = 0;
  _$jscoverage['/underscore.js'].lineData[752] = 0;
  _$jscoverage['/underscore.js'].lineData[753] = 0;
  _$jscoverage['/underscore.js'].lineData[754] = 0;
  _$jscoverage['/underscore.js'].lineData[755] = 0;
  _$jscoverage['/underscore.js'].lineData[757] = 0;
  _$jscoverage['/underscore.js'].lineData[758] = 0;
  _$jscoverage['/underscore.js'].lineData[760] = 0;
  _$jscoverage['/underscore.js'].lineData[763] = 0;
  _$jscoverage['/underscore.js'].lineData[768] = 0;
  _$jscoverage['/underscore.js'].lineData[769] = 0;
  _$jscoverage['/underscore.js'].lineData[770] = 0;
  _$jscoverage['/underscore.js'].lineData[771] = 0;
  _$jscoverage['/underscore.js'].lineData[772] = 0;
  _$jscoverage['/underscore.js'].lineData[773] = 0;
  _$jscoverage['/underscore.js'].lineData[774] = 0;
  _$jscoverage['/underscore.js'].lineData[779] = 0;
  _$jscoverage['/underscore.js'].lineData[780] = 0;
  _$jscoverage['/underscore.js'].lineData[781] = 0;
  _$jscoverage['/underscore.js'].lineData[782] = 0;
  _$jscoverage['/underscore.js'].lineData[783] = 0;
  _$jscoverage['/underscore.js'].lineData[784] = 0;
  _$jscoverage['/underscore.js'].lineData[786] = 0;
  _$jscoverage['/underscore.js'].lineData[787] = 0;
  _$jscoverage['/underscore.js'].lineData[792] = 0;
  _$jscoverage['/underscore.js'].lineData[793] = 0;
  _$jscoverage['/underscore.js'].lineData[794] = 0;
  _$jscoverage['/underscore.js'].lineData[800] = 0;
  _$jscoverage['/underscore.js'].lineData[807] = 0;
  _$jscoverage['/underscore.js'].lineData[808] = 0;
  _$jscoverage['/underscore.js'].lineData[809] = 0;
  _$jscoverage['/underscore.js'].lineData[810] = 0;
  _$jscoverage['/underscore.js'].lineData[812] = 0;
  _$jscoverage['/underscore.js'].lineData[813] = 0;
  _$jscoverage['/underscore.js'].lineData[814] = 0;
  _$jscoverage['/underscore.js'].lineData[815] = 0;
  _$jscoverage['/underscore.js'].lineData[816] = 0;
  _$jscoverage['/underscore.js'].lineData[819] = 0;
  _$jscoverage['/underscore.js'].lineData[820] = 0;
  _$jscoverage['/underscore.js'].lineData[821] = 0;
  _$jscoverage['/underscore.js'].lineData[822] = 0;
  _$jscoverage['/underscore.js'].lineData[823] = 0;
  _$jscoverage['/underscore.js'].lineData[824] = 0;
  _$jscoverage['/underscore.js'].lineData[825] = 0;
  _$jscoverage['/underscore.js'].lineData[826] = 0;
  _$jscoverage['/underscore.js'].lineData[827] = 0;
  _$jscoverage['/underscore.js'].lineData[828] = 0;
  _$jscoverage['/underscore.js'].lineData[830] = 0;
  _$jscoverage['/underscore.js'].lineData[831] = 0;
  _$jscoverage['/underscore.js'].lineData[832] = 0;
  _$jscoverage['/underscore.js'].lineData[833] = 0;
  _$jscoverage['/underscore.js'].lineData[834] = 0;
  _$jscoverage['/underscore.js'].lineData[836] = 0;
  _$jscoverage['/underscore.js'].lineData[839] = 0;
  _$jscoverage['/underscore.js'].lineData[840] = 0;
  _$jscoverage['/underscore.js'].lineData[841] = 0;
  _$jscoverage['/underscore.js'].lineData[842] = 0;
  _$jscoverage['/underscore.js'].lineData[845] = 0;
  _$jscoverage['/underscore.js'].lineData[852] = 0;
  _$jscoverage['/underscore.js'].lineData[853] = 0;
  _$jscoverage['/underscore.js'].lineData[855] = 0;
  _$jscoverage['/underscore.js'].lineData[856] = 0;
  _$jscoverage['/underscore.js'].lineData[857] = 0;
  _$jscoverage['/underscore.js'].lineData[860] = 0;
  _$jscoverage['/underscore.js'].lineData[861] = 0;
  _$jscoverage['/underscore.js'].lineData[862] = 0;
  _$jscoverage['/underscore.js'].lineData[863] = 0;
  _$jscoverage['/underscore.js'].lineData[864] = 0;
  _$jscoverage['/underscore.js'].lineData[865] = 0;
  _$jscoverage['/underscore.js'].lineData[866] = 0;
  _$jscoverage['/underscore.js'].lineData[867] = 0;
  _$jscoverage['/underscore.js'].lineData[870] = 0;
  _$jscoverage['/underscore.js'].lineData[873] = 0;
  _$jscoverage['/underscore.js'].lineData[874] = 0;
  _$jscoverage['/underscore.js'].lineData[875] = 0;
  _$jscoverage['/underscore.js'].lineData[878] = 0;
  _$jscoverage['/underscore.js'].lineData[884] = 0;
  _$jscoverage['/underscore.js'].lineData[885] = 0;
  _$jscoverage['/underscore.js'].lineData[889] = 0;
  _$jscoverage['/underscore.js'].lineData[890] = 0;
  _$jscoverage['/underscore.js'].lineData[891] = 0;
  _$jscoverage['/underscore.js'].lineData[897] = 0;
  _$jscoverage['/underscore.js'].lineData[898] = 0;
  _$jscoverage['/underscore.js'].lineData[899] = 0;
  _$jscoverage['/underscore.js'].lineData[900] = 0;
  _$jscoverage['/underscore.js'].lineData[901] = 0;
  _$jscoverage['/underscore.js'].lineData[902] = 0;
  _$jscoverage['/underscore.js'].lineData[903] = 0;
  _$jscoverage['/underscore.js'].lineData[904] = 0;
  _$jscoverage['/underscore.js'].lineData[909] = 0;
  _$jscoverage['/underscore.js'].lineData[910] = 0;
  _$jscoverage['/underscore.js'].lineData[911] = 0;
  _$jscoverage['/underscore.js'].lineData[912] = 0;
  _$jscoverage['/underscore.js'].lineData[918] = 0;
  _$jscoverage['/underscore.js'].lineData[919] = 0;
  _$jscoverage['/underscore.js'].lineData[920] = 0;
  _$jscoverage['/underscore.js'].lineData[921] = 0;
  _$jscoverage['/underscore.js'].lineData[922] = 0;
  _$jscoverage['/underscore.js'].lineData[924] = 0;
  _$jscoverage['/underscore.js'].lineData[925] = 0;
  _$jscoverage['/underscore.js'].lineData[931] = 0;
  _$jscoverage['/underscore.js'].lineData[933] = 0;
  _$jscoverage['/underscore.js'].lineData[939] = 0;
  _$jscoverage['/underscore.js'].lineData[940] = 0;
  _$jscoverage['/underscore.js'].lineData[943] = 0;
  _$jscoverage['/underscore.js'].lineData[944] = 0;
  _$jscoverage['/underscore.js'].lineData[945] = 0;
  _$jscoverage['/underscore.js'].lineData[946] = 0;
  _$jscoverage['/underscore.js'].lineData[949] = 0;
  _$jscoverage['/underscore.js'].lineData[950] = 0;
  _$jscoverage['/underscore.js'].lineData[952] = 0;
  _$jscoverage['/underscore.js'].lineData[953] = 0;
  _$jscoverage['/underscore.js'].lineData[954] = 0;
  _$jscoverage['/underscore.js'].lineData[955] = 0;
  _$jscoverage['/underscore.js'].lineData[962] = 0;
  _$jscoverage['/underscore.js'].lineData[963] = 0;
  _$jscoverage['/underscore.js'].lineData[964] = 0;
  _$jscoverage['/underscore.js'].lineData[965] = 0;
  _$jscoverage['/underscore.js'].lineData[966] = 0;
  _$jscoverage['/underscore.js'].lineData[968] = 0;
  _$jscoverage['/underscore.js'].lineData[969] = 0;
  _$jscoverage['/underscore.js'].lineData[973] = 0;
  _$jscoverage['/underscore.js'].lineData[974] = 0;
  _$jscoverage['/underscore.js'].lineData[975] = 0;
  _$jscoverage['/underscore.js'].lineData[976] = 0;
  _$jscoverage['/underscore.js'].lineData[978] = 0;
  _$jscoverage['/underscore.js'].lineData[979] = 0;
  _$jscoverage['/underscore.js'].lineData[983] = 0;
  _$jscoverage['/underscore.js'].lineData[984] = 0;
  _$jscoverage['/underscore.js'].lineData[985] = 0;
  _$jscoverage['/underscore.js'].lineData[986] = 0;
  _$jscoverage['/underscore.js'].lineData[987] = 0;
  _$jscoverage['/underscore.js'].lineData[988] = 0;
  _$jscoverage['/underscore.js'].lineData[990] = 0;
  _$jscoverage['/underscore.js'].lineData[995] = 0;
  _$jscoverage['/underscore.js'].lineData[996] = 0;
  _$jscoverage['/underscore.js'].lineData[997] = 0;
  _$jscoverage['/underscore.js'].lineData[1000] = 0;
  _$jscoverage['/underscore.js'].lineData[1001] = 0;
  _$jscoverage['/underscore.js'].lineData[1002] = 0;
  _$jscoverage['/underscore.js'].lineData[1004] = 0;
  _$jscoverage['/underscore.js'].lineData[1008] = 0;
  _$jscoverage['/underscore.js'].lineData[1009] = 0;
  _$jscoverage['/underscore.js'].lineData[1010] = 0;
  _$jscoverage['/underscore.js'].lineData[1011] = 0;
  _$jscoverage['/underscore.js'].lineData[1012] = 0;
  _$jscoverage['/underscore.js'].lineData[1013] = 0;
  _$jscoverage['/underscore.js'].lineData[1015] = 0;
  _$jscoverage['/underscore.js'].lineData[1019] = 0;
  _$jscoverage['/underscore.js'].lineData[1020] = 0;
  _$jscoverage['/underscore.js'].lineData[1021] = 0;
  _$jscoverage['/underscore.js'].lineData[1022] = 0;
  _$jscoverage['/underscore.js'].lineData[1023] = 0;
  _$jscoverage['/underscore.js'].lineData[1025] = 0;
  _$jscoverage['/underscore.js'].lineData[1030] = 0;
  _$jscoverage['/underscore.js'].lineData[1031] = 0;
  _$jscoverage['/underscore.js'].lineData[1032] = 0;
  _$jscoverage['/underscore.js'].lineData[1033] = 0;
  _$jscoverage['/underscore.js'].lineData[1035] = 0;
  _$jscoverage['/underscore.js'].lineData[1039] = 0;
  _$jscoverage['/underscore.js'].lineData[1040] = 0;
  _$jscoverage['/underscore.js'].lineData[1041] = 0;
  _$jscoverage['/underscore.js'].lineData[1042] = 0;
  _$jscoverage['/underscore.js'].lineData[1043] = 0;
  _$jscoverage['/underscore.js'].lineData[1044] = 0;
  _$jscoverage['/underscore.js'].lineData[1045] = 0;
  _$jscoverage['/underscore.js'].lineData[1048] = 0;
  _$jscoverage['/underscore.js'].lineData[1049] = 0;
  _$jscoverage['/underscore.js'].lineData[1050] = 0;
  _$jscoverage['/underscore.js'].lineData[1053] = 0;
  _$jscoverage['/underscore.js'].lineData[1058] = 0;
  _$jscoverage['/underscore.js'].lineData[1062] = 0;
  _$jscoverage['/underscore.js'].lineData[1065] = 0;
  _$jscoverage['/underscore.js'].lineData[1066] = 0;
  _$jscoverage['/underscore.js'].lineData[1067] = 0;
  _$jscoverage['/underscore.js'].lineData[1068] = 0;
  _$jscoverage['/underscore.js'].lineData[1069] = 0;
  _$jscoverage['/underscore.js'].lineData[1070] = 0;
  _$jscoverage['/underscore.js'].lineData[1075] = 0;
  _$jscoverage['/underscore.js'].lineData[1076] = 0;
  _$jscoverage['/underscore.js'].lineData[1080] = 0;
  _$jscoverage['/underscore.js'].lineData[1081] = 0;
  _$jscoverage['/underscore.js'].lineData[1082] = 0;
  _$jscoverage['/underscore.js'].lineData[1083] = 0;
  _$jscoverage['/underscore.js'].lineData[1084] = 0;
  _$jscoverage['/underscore.js'].lineData[1085] = 0;
  _$jscoverage['/underscore.js'].lineData[1087] = 0;
  _$jscoverage['/underscore.js'].lineData[1088] = 0;
  _$jscoverage['/underscore.js'].lineData[1089] = 0;
  _$jscoverage['/underscore.js'].lineData[1091] = 0;
  _$jscoverage['/underscore.js'].lineData[1092] = 0;
  _$jscoverage['/underscore.js'].lineData[1093] = 0;
  _$jscoverage['/underscore.js'].lineData[1094] = 0;
  _$jscoverage['/underscore.js'].lineData[1096] = 0;
  _$jscoverage['/underscore.js'].lineData[1100] = 0;
  _$jscoverage['/underscore.js'].lineData[1101] = 0;
  _$jscoverage['/underscore.js'].lineData[1102] = 0;
  _$jscoverage['/underscore.js'].lineData[1103] = 0;
  _$jscoverage['/underscore.js'].lineData[1104] = 0;
  _$jscoverage['/underscore.js'].lineData[1106] = 0;
  _$jscoverage['/underscore.js'].lineData[1107] = 0;
  _$jscoverage['/underscore.js'].lineData[1108] = 0;
  _$jscoverage['/underscore.js'].lineData[1111] = 0;
  _$jscoverage['/underscore.js'].lineData[1115] = 0;
  _$jscoverage['/underscore.js'].lineData[1120] = 0;
  _$jscoverage['/underscore.js'].lineData[1121] = 0;
  _$jscoverage['/underscore.js'].lineData[1122] = 0;
  _$jscoverage['/underscore.js'].lineData[1123] = 0;
  _$jscoverage['/underscore.js'].lineData[1127] = 0;
  _$jscoverage['/underscore.js'].lineData[1128] = 0;
  _$jscoverage['/underscore.js'].lineData[1129] = 0;
  _$jscoverage['/underscore.js'].lineData[1135] = 0;
  _$jscoverage['/underscore.js'].lineData[1136] = 0;
  _$jscoverage['/underscore.js'].lineData[1137] = 0;
  _$jscoverage['/underscore.js'].lineData[1141] = 0;
  _$jscoverage['/underscore.js'].lineData[1142] = 0;
  _$jscoverage['/underscore.js'].lineData[1143] = 0;
  _$jscoverage['/underscore.js'].lineData[1144] = 0;
  _$jscoverage['/underscore.js'].lineData[1145] = 0;
  _$jscoverage['/underscore.js'].lineData[1146] = 0;
  _$jscoverage['/underscore.js'].lineData[1147] = 0;
  _$jscoverage['/underscore.js'].lineData[1149] = 0;
  _$jscoverage['/underscore.js'].lineData[1154] = 0;
  _$jscoverage['/underscore.js'].lineData[1155] = 0;
  _$jscoverage['/underscore.js'].lineData[1158] = 0;
  _$jscoverage['/underscore.js'].lineData[1160] = 0;
  _$jscoverage['/underscore.js'].lineData[1162] = 0;
  _$jscoverage['/underscore.js'].lineData[1164] = 0;
  _$jscoverage['/underscore.js'].lineData[1165] = 0;
  _$jscoverage['/underscore.js'].lineData[1166] = 0;
  _$jscoverage['/underscore.js'].lineData[1170] = 0;
  _$jscoverage['/underscore.js'].lineData[1172] = 0;
  _$jscoverage['/underscore.js'].lineData[1173] = 0;
  _$jscoverage['/underscore.js'].lineData[1175] = 0;
  _$jscoverage['/underscore.js'].lineData[1176] = 0;
  _$jscoverage['/underscore.js'].lineData[1177] = 0;
  _$jscoverage['/underscore.js'].lineData[1179] = 0;
  _$jscoverage['/underscore.js'].lineData[1184] = 0;
  _$jscoverage['/underscore.js'].lineData[1188] = 0;
  _$jscoverage['/underscore.js'].lineData[1190] = 0;
  _$jscoverage['/underscore.js'].lineData[1191] = 0;
  _$jscoverage['/underscore.js'].lineData[1196] = 0;
  _$jscoverage['/underscore.js'].lineData[1199] = 0;
  _$jscoverage['/underscore.js'].lineData[1200] = 0;
  _$jscoverage['/underscore.js'].lineData[1201] = 0;
  _$jscoverage['/underscore.js'].lineData[1205] = 0;
  _$jscoverage['/underscore.js'].lineData[1206] = 0;
  _$jscoverage['/underscore.js'].lineData[1209] = 0;
  _$jscoverage['/underscore.js'].lineData[1217] = 0;
  _$jscoverage['/underscore.js'].lineData[1218] = 0;
  _$jscoverage['/underscore.js'].lineData[1219] = 0;
  _$jscoverage['/underscore.js'].lineData[1220] = 0;
  _$jscoverage['/underscore.js'].lineData[1223] = 0;
  _$jscoverage['/underscore.js'].lineData[1227] = 0;
  _$jscoverage['/underscore.js'].lineData[1228] = 0;
  _$jscoverage['/underscore.js'].lineData[1231] = 0;
  _$jscoverage['/underscore.js'].lineData[1233] = 0;
  _$jscoverage['/underscore.js'].lineData[1234] = 0;
  _$jscoverage['/underscore.js'].lineData[1236] = 0;
  _$jscoverage['/underscore.js'].lineData[1237] = 0;
  _$jscoverage['/underscore.js'].lineData[1241] = 0;
  _$jscoverage['/underscore.js'].lineData[1242] = 0;
  _$jscoverage['/underscore.js'].lineData[1244] = 0;
  _$jscoverage['/underscore.js'].lineData[1245] = 0;
  _$jscoverage['/underscore.js'].lineData[1247] = 0;
  _$jscoverage['/underscore.js'].lineData[1248] = 0;
  _$jscoverage['/underscore.js'].lineData[1252] = 0;
  _$jscoverage['/underscore.js'].lineData[1253] = 0;
  _$jscoverage['/underscore.js'].lineData[1254] = 0;
  _$jscoverage['/underscore.js'].lineData[1258] = 0;
  _$jscoverage['/underscore.js'].lineData[1259] = 0;
  _$jscoverage['/underscore.js'].lineData[1264] = 0;
  _$jscoverage['/underscore.js'].lineData[1265] = 0;
  _$jscoverage['/underscore.js'].lineData[1266] = 0;
  _$jscoverage['/underscore.js'].lineData[1267] = 0;
  _$jscoverage['/underscore.js'].lineData[1271] = 0;
  _$jscoverage['/underscore.js'].lineData[1272] = 0;
  _$jscoverage['/underscore.js'].lineData[1277] = 0;
  _$jscoverage['/underscore.js'].lineData[1278] = 0;
  _$jscoverage['/underscore.js'].lineData[1282] = 0;
  _$jscoverage['/underscore.js'].lineData[1283] = 0;
  _$jscoverage['/underscore.js'].lineData[1284] = 0;
  _$jscoverage['/underscore.js'].lineData[1288] = 0;
  _$jscoverage['/underscore.js'].lineData[1289] = 0;
  _$jscoverage['/underscore.js'].lineData[1290] = 0;
  _$jscoverage['/underscore.js'].lineData[1296] = 0;
  _$jscoverage['/underscore.js'].lineData[1297] = 0;
  _$jscoverage['/underscore.js'].lineData[1298] = 0;
  _$jscoverage['/underscore.js'].lineData[1304] = 0;
  _$jscoverage['/underscore.js'].lineData[1305] = 0;
  _$jscoverage['/underscore.js'].lineData[1306] = 0;
  _$jscoverage['/underscore.js'].lineData[1307] = 0;
  _$jscoverage['/underscore.js'].lineData[1312] = 0;
  _$jscoverage['/underscore.js'].lineData[1313] = 0;
  _$jscoverage['/underscore.js'].lineData[1317] = 0;
  _$jscoverage['/underscore.js'].lineData[1318] = 0;
  _$jscoverage['/underscore.js'].lineData[1322] = 0;
  _$jscoverage['/underscore.js'].lineData[1323] = 0;
  _$jscoverage['/underscore.js'].lineData[1327] = 0;
  _$jscoverage['/underscore.js'].lineData[1328] = 0;
  _$jscoverage['/underscore.js'].lineData[1332] = 0;
  _$jscoverage['/underscore.js'].lineData[1333] = 0;
  _$jscoverage['/underscore.js'].lineData[1338] = 0;
  _$jscoverage['/underscore.js'].lineData[1339] = 0;
  _$jscoverage['/underscore.js'].lineData[1347] = 0;
  _$jscoverage['/underscore.js'].lineData[1348] = 0;
  _$jscoverage['/underscore.js'].lineData[1349] = 0;
  _$jscoverage['/underscore.js'].lineData[1353] = 0;
  _$jscoverage['/underscore.js'].lineData[1354] = 0;
  _$jscoverage['/underscore.js'].lineData[1358] = 0;
  _$jscoverage['/underscore.js'].lineData[1359] = 0;
  _$jscoverage['/underscore.js'].lineData[1360] = 0;
  _$jscoverage['/underscore.js'].lineData[1364] = 0;
  _$jscoverage['/underscore.js'].lineData[1366] = 0;
  _$jscoverage['/underscore.js'].lineData[1369] = 0;
  _$jscoverage['/underscore.js'].lineData[1370] = 0;
  _$jscoverage['/underscore.js'].lineData[1371] = 0;
  _$jscoverage['/underscore.js'].lineData[1377] = 0;
  _$jscoverage['/underscore.js'].lineData[1378] = 0;
  _$jscoverage['/underscore.js'].lineData[1379] = 0;
  _$jscoverage['/underscore.js'].lineData[1380] = 0;
  _$jscoverage['/underscore.js'].lineData[1385] = 0;
  _$jscoverage['/underscore.js'].lineData[1386] = 0;
  _$jscoverage['/underscore.js'].lineData[1387] = 0;
  _$jscoverage['/underscore.js'].lineData[1388] = 0;
  _$jscoverage['/underscore.js'].lineData[1389] = 0;
  _$jscoverage['/underscore.js'].lineData[1393] = 0;
  _$jscoverage['/underscore.js'].lineData[1394] = 0;
  _$jscoverage['/underscore.js'].lineData[1395] = 0;
  _$jscoverage['/underscore.js'].lineData[1396] = 0;
  _$jscoverage['/underscore.js'].lineData[1398] = 0;
  _$jscoverage['/underscore.js'].lineData[1402] = 0;
  _$jscoverage['/underscore.js'].lineData[1403] = 0;
  _$jscoverage['/underscore.js'].lineData[1407] = 0;
  _$jscoverage['/underscore.js'].lineData[1415] = 0;
  _$jscoverage['/underscore.js'].lineData[1418] = 0;
  _$jscoverage['/underscore.js'].lineData[1419] = 0;
  _$jscoverage['/underscore.js'].lineData[1420] = 0;
  _$jscoverage['/underscore.js'].lineData[1423] = 0;
  _$jscoverage['/underscore.js'].lineData[1424] = 0;
  _$jscoverage['/underscore.js'].lineData[1425] = 0;
  _$jscoverage['/underscore.js'].lineData[1426] = 0;
  _$jscoverage['/underscore.js'].lineData[1427] = 0;
  _$jscoverage['/underscore.js'].lineData[1428] = 0;
  _$jscoverage['/underscore.js'].lineData[1431] = 0;
  _$jscoverage['/underscore.js'].lineData[1432] = 0;
  _$jscoverage['/underscore.js'].lineData[1436] = 0;
  _$jscoverage['/underscore.js'].lineData[1437] = 0;
  _$jscoverage['/underscore.js'].lineData[1438] = 0;
  _$jscoverage['/underscore.js'].lineData[1439] = 0;
  _$jscoverage['/underscore.js'].lineData[1441] = 0;
  _$jscoverage['/underscore.js'].lineData[1446] = 0;
  _$jscoverage['/underscore.js'].lineData[1447] = 0;
  _$jscoverage['/underscore.js'].lineData[1448] = 0;
  _$jscoverage['/underscore.js'].lineData[1449] = 0;
  _$jscoverage['/underscore.js'].lineData[1454] = 0;
  _$jscoverage['/underscore.js'].lineData[1463] = 0;
  _$jscoverage['/underscore.js'].lineData[1467] = 0;
  _$jscoverage['/underscore.js'].lineData[1476] = 0;
  _$jscoverage['/underscore.js'].lineData[1478] = 0;
  _$jscoverage['/underscore.js'].lineData[1479] = 0;
  _$jscoverage['/underscore.js'].lineData[1486] = 0;
  _$jscoverage['/underscore.js'].lineData[1487] = 0;
  _$jscoverage['/underscore.js'].lineData[1488] = 0;
  _$jscoverage['/underscore.js'].lineData[1491] = 0;
  _$jscoverage['/underscore.js'].lineData[1498] = 0;
  _$jscoverage['/underscore.js'].lineData[1499] = 0;
  _$jscoverage['/underscore.js'].lineData[1500] = 0;
  _$jscoverage['/underscore.js'].lineData[1501] = 0;
  _$jscoverage['/underscore.js'].lineData[1502] = 0;
  _$jscoverage['/underscore.js'].lineData[1504] = 0;
  _$jscoverage['/underscore.js'].lineData[1505] = 0;
  _$jscoverage['/underscore.js'].lineData[1506] = 0;
  _$jscoverage['/underscore.js'].lineData[1507] = 0;
  _$jscoverage['/underscore.js'].lineData[1508] = 0;
  _$jscoverage['/underscore.js'].lineData[1509] = 0;
  _$jscoverage['/underscore.js'].lineData[1513] = 0;
  _$jscoverage['/underscore.js'].lineData[1515] = 0;
  _$jscoverage['/underscore.js'].lineData[1518] = 0;
  _$jscoverage['/underscore.js'].lineData[1520] = 0;
  _$jscoverage['/underscore.js'].lineData[1524] = 0;
  _$jscoverage['/underscore.js'].lineData[1525] = 0;
  _$jscoverage['/underscore.js'].lineData[1526] = 0;
  _$jscoverage['/underscore.js'].lineData[1528] = 0;
  _$jscoverage['/underscore.js'].lineData[1529] = 0;
  _$jscoverage['/underscore.js'].lineData[1532] = 0;
  _$jscoverage['/underscore.js'].lineData[1533] = 0;
  _$jscoverage['/underscore.js'].lineData[1537] = 0;
  _$jscoverage['/underscore.js'].lineData[1538] = 0;
  _$jscoverage['/underscore.js'].lineData[1540] = 0;
  _$jscoverage['/underscore.js'].lineData[1544] = 0;
  _$jscoverage['/underscore.js'].lineData[1545] = 0;
  _$jscoverage['/underscore.js'].lineData[1546] = 0;
  _$jscoverage['/underscore.js'].lineData[1547] = 0;
  _$jscoverage['/underscore.js'].lineData[1557] = 0;
  _$jscoverage['/underscore.js'].lineData[1558] = 0;
  _$jscoverage['/underscore.js'].lineData[1562] = 0;
  _$jscoverage['/underscore.js'].lineData[1563] = 0;
  _$jscoverage['/underscore.js'].lineData[1564] = 0;
  _$jscoverage['/underscore.js'].lineData[1565] = 0;
  _$jscoverage['/underscore.js'].lineData[1566] = 0;
  _$jscoverage['/underscore.js'].lineData[1567] = 0;
  _$jscoverage['/underscore.js'].lineData[1568] = 0;
  _$jscoverage['/underscore.js'].lineData[1574] = 0;
  _$jscoverage['/underscore.js'].lineData[1577] = 0;
  _$jscoverage['/underscore.js'].lineData[1578] = 0;
  _$jscoverage['/underscore.js'].lineData[1579] = 0;
  _$jscoverage['/underscore.js'].lineData[1580] = 0;
  _$jscoverage['/underscore.js'].lineData[1581] = 0;
  _$jscoverage['/underscore.js'].lineData[1582] = 0;
  _$jscoverage['/underscore.js'].lineData[1583] = 0;
  _$jscoverage['/underscore.js'].lineData[1588] = 0;
  _$jscoverage['/underscore.js'].lineData[1589] = 0;
  _$jscoverage['/underscore.js'].lineData[1590] = 0;
  _$jscoverage['/underscore.js'].lineData[1591] = 0;
  _$jscoverage['/underscore.js'].lineData[1596] = 0;
  _$jscoverage['/underscore.js'].lineData[1597] = 0;
  _$jscoverage['/underscore.js'].lineData[1602] = 0;
  _$jscoverage['/underscore.js'].lineData[1604] = 0;
  _$jscoverage['/underscore.js'].lineData[1605] = 0;
  _$jscoverage['/underscore.js'].lineData[1615] = 0;
  _$jscoverage['/underscore.js'].lineData[1616] = 0;
  _$jscoverage['/underscore.js'].lineData[1617] = 0;
}
if (! _$jscoverage['/underscore.js'].functionData) {
  _$jscoverage['/underscore.js'].functionData = [];
  _$jscoverage['/underscore.js'].functionData[0] = 0;
  _$jscoverage['/underscore.js'].functionData[1] = 0;
  _$jscoverage['/underscore.js'].functionData[2] = 0;
  _$jscoverage['/underscore.js'].functionData[3] = 0;
  _$jscoverage['/underscore.js'].functionData[4] = 0;
  _$jscoverage['/underscore.js'].functionData[5] = 0;
  _$jscoverage['/underscore.js'].functionData[6] = 0;
  _$jscoverage['/underscore.js'].functionData[7] = 0;
  _$jscoverage['/underscore.js'].functionData[8] = 0;
  _$jscoverage['/underscore.js'].functionData[9] = 0;
  _$jscoverage['/underscore.js'].functionData[10] = 0;
  _$jscoverage['/underscore.js'].functionData[11] = 0;
  _$jscoverage['/underscore.js'].functionData[12] = 0;
  _$jscoverage['/underscore.js'].functionData[13] = 0;
  _$jscoverage['/underscore.js'].functionData[14] = 0;
  _$jscoverage['/underscore.js'].functionData[15] = 0;
  _$jscoverage['/underscore.js'].functionData[16] = 0;
  _$jscoverage['/underscore.js'].functionData[17] = 0;
  _$jscoverage['/underscore.js'].functionData[18] = 0;
  _$jscoverage['/underscore.js'].functionData[19] = 0;
  _$jscoverage['/underscore.js'].functionData[20] = 0;
  _$jscoverage['/underscore.js'].functionData[21] = 0;
  _$jscoverage['/underscore.js'].functionData[22] = 0;
  _$jscoverage['/underscore.js'].functionData[23] = 0;
  _$jscoverage['/underscore.js'].functionData[24] = 0;
  _$jscoverage['/underscore.js'].functionData[25] = 0;
  _$jscoverage['/underscore.js'].functionData[26] = 0;
  _$jscoverage['/underscore.js'].functionData[27] = 0;
  _$jscoverage['/underscore.js'].functionData[28] = 0;
  _$jscoverage['/underscore.js'].functionData[29] = 0;
  _$jscoverage['/underscore.js'].functionData[30] = 0;
  _$jscoverage['/underscore.js'].functionData[31] = 0;
  _$jscoverage['/underscore.js'].functionData[32] = 0;
  _$jscoverage['/underscore.js'].functionData[33] = 0;
  _$jscoverage['/underscore.js'].functionData[34] = 0;
  _$jscoverage['/underscore.js'].functionData[35] = 0;
  _$jscoverage['/underscore.js'].functionData[36] = 0;
  _$jscoverage['/underscore.js'].functionData[37] = 0;
  _$jscoverage['/underscore.js'].functionData[38] = 0;
  _$jscoverage['/underscore.js'].functionData[39] = 0;
  _$jscoverage['/underscore.js'].functionData[40] = 0;
  _$jscoverage['/underscore.js'].functionData[41] = 0;
  _$jscoverage['/underscore.js'].functionData[42] = 0;
  _$jscoverage['/underscore.js'].functionData[43] = 0;
  _$jscoverage['/underscore.js'].functionData[44] = 0;
  _$jscoverage['/underscore.js'].functionData[45] = 0;
  _$jscoverage['/underscore.js'].functionData[46] = 0;
  _$jscoverage['/underscore.js'].functionData[47] = 0;
  _$jscoverage['/underscore.js'].functionData[48] = 0;
  _$jscoverage['/underscore.js'].functionData[49] = 0;
  _$jscoverage['/underscore.js'].functionData[50] = 0;
  _$jscoverage['/underscore.js'].functionData[51] = 0;
  _$jscoverage['/underscore.js'].functionData[52] = 0;
  _$jscoverage['/underscore.js'].functionData[53] = 0;
  _$jscoverage['/underscore.js'].functionData[54] = 0;
  _$jscoverage['/underscore.js'].functionData[55] = 0;
  _$jscoverage['/underscore.js'].functionData[56] = 0;
  _$jscoverage['/underscore.js'].functionData[57] = 0;
  _$jscoverage['/underscore.js'].functionData[58] = 0;
  _$jscoverage['/underscore.js'].functionData[59] = 0;
  _$jscoverage['/underscore.js'].functionData[60] = 0;
  _$jscoverage['/underscore.js'].functionData[61] = 0;
  _$jscoverage['/underscore.js'].functionData[62] = 0;
  _$jscoverage['/underscore.js'].functionData[63] = 0;
  _$jscoverage['/underscore.js'].functionData[64] = 0;
  _$jscoverage['/underscore.js'].functionData[65] = 0;
  _$jscoverage['/underscore.js'].functionData[66] = 0;
  _$jscoverage['/underscore.js'].functionData[67] = 0;
  _$jscoverage['/underscore.js'].functionData[68] = 0;
  _$jscoverage['/underscore.js'].functionData[69] = 0;
  _$jscoverage['/underscore.js'].functionData[70] = 0;
  _$jscoverage['/underscore.js'].functionData[71] = 0;
  _$jscoverage['/underscore.js'].functionData[72] = 0;
  _$jscoverage['/underscore.js'].functionData[73] = 0;
  _$jscoverage['/underscore.js'].functionData[74] = 0;
  _$jscoverage['/underscore.js'].functionData[75] = 0;
  _$jscoverage['/underscore.js'].functionData[76] = 0;
  _$jscoverage['/underscore.js'].functionData[77] = 0;
  _$jscoverage['/underscore.js'].functionData[78] = 0;
  _$jscoverage['/underscore.js'].functionData[79] = 0;
  _$jscoverage['/underscore.js'].functionData[80] = 0;
  _$jscoverage['/underscore.js'].functionData[81] = 0;
  _$jscoverage['/underscore.js'].functionData[82] = 0;
  _$jscoverage['/underscore.js'].functionData[83] = 0;
  _$jscoverage['/underscore.js'].functionData[84] = 0;
  _$jscoverage['/underscore.js'].functionData[85] = 0;
  _$jscoverage['/underscore.js'].functionData[86] = 0;
  _$jscoverage['/underscore.js'].functionData[87] = 0;
  _$jscoverage['/underscore.js'].functionData[88] = 0;
  _$jscoverage['/underscore.js'].functionData[89] = 0;
  _$jscoverage['/underscore.js'].functionData[90] = 0;
  _$jscoverage['/underscore.js'].functionData[91] = 0;
  _$jscoverage['/underscore.js'].functionData[92] = 0;
  _$jscoverage['/underscore.js'].functionData[93] = 0;
  _$jscoverage['/underscore.js'].functionData[94] = 0;
  _$jscoverage['/underscore.js'].functionData[95] = 0;
  _$jscoverage['/underscore.js'].functionData[96] = 0;
  _$jscoverage['/underscore.js'].functionData[97] = 0;
  _$jscoverage['/underscore.js'].functionData[98] = 0;
  _$jscoverage['/underscore.js'].functionData[99] = 0;
  _$jscoverage['/underscore.js'].functionData[100] = 0;
  _$jscoverage['/underscore.js'].functionData[101] = 0;
  _$jscoverage['/underscore.js'].functionData[102] = 0;
  _$jscoverage['/underscore.js'].functionData[103] = 0;
  _$jscoverage['/underscore.js'].functionData[104] = 0;
  _$jscoverage['/underscore.js'].functionData[105] = 0;
  _$jscoverage['/underscore.js'].functionData[106] = 0;
  _$jscoverage['/underscore.js'].functionData[107] = 0;
  _$jscoverage['/underscore.js'].functionData[108] = 0;
  _$jscoverage['/underscore.js'].functionData[109] = 0;
  _$jscoverage['/underscore.js'].functionData[110] = 0;
  _$jscoverage['/underscore.js'].functionData[111] = 0;
  _$jscoverage['/underscore.js'].functionData[112] = 0;
  _$jscoverage['/underscore.js'].functionData[113] = 0;
  _$jscoverage['/underscore.js'].functionData[114] = 0;
  _$jscoverage['/underscore.js'].functionData[115] = 0;
  _$jscoverage['/underscore.js'].functionData[116] = 0;
  _$jscoverage['/underscore.js'].functionData[117] = 0;
  _$jscoverage['/underscore.js'].functionData[118] = 0;
  _$jscoverage['/underscore.js'].functionData[119] = 0;
  _$jscoverage['/underscore.js'].functionData[120] = 0;
  _$jscoverage['/underscore.js'].functionData[121] = 0;
  _$jscoverage['/underscore.js'].functionData[122] = 0;
  _$jscoverage['/underscore.js'].functionData[123] = 0;
  _$jscoverage['/underscore.js'].functionData[124] = 0;
  _$jscoverage['/underscore.js'].functionData[125] = 0;
  _$jscoverage['/underscore.js'].functionData[126] = 0;
  _$jscoverage['/underscore.js'].functionData[127] = 0;
  _$jscoverage['/underscore.js'].functionData[128] = 0;
  _$jscoverage['/underscore.js'].functionData[129] = 0;
  _$jscoverage['/underscore.js'].functionData[130] = 0;
  _$jscoverage['/underscore.js'].functionData[131] = 0;
  _$jscoverage['/underscore.js'].functionData[132] = 0;
  _$jscoverage['/underscore.js'].functionData[133] = 0;
  _$jscoverage['/underscore.js'].functionData[134] = 0;
  _$jscoverage['/underscore.js'].functionData[135] = 0;
  _$jscoverage['/underscore.js'].functionData[136] = 0;
  _$jscoverage['/underscore.js'].functionData[137] = 0;
  _$jscoverage['/underscore.js'].functionData[138] = 0;
  _$jscoverage['/underscore.js'].functionData[139] = 0;
  _$jscoverage['/underscore.js'].functionData[140] = 0;
  _$jscoverage['/underscore.js'].functionData[141] = 0;
  _$jscoverage['/underscore.js'].functionData[142] = 0;
  _$jscoverage['/underscore.js'].functionData[143] = 0;
  _$jscoverage['/underscore.js'].functionData[144] = 0;
  _$jscoverage['/underscore.js'].functionData[145] = 0;
  _$jscoverage['/underscore.js'].functionData[146] = 0;
  _$jscoverage['/underscore.js'].functionData[147] = 0;
  _$jscoverage['/underscore.js'].functionData[148] = 0;
  _$jscoverage['/underscore.js'].functionData[149] = 0;
  _$jscoverage['/underscore.js'].functionData[150] = 0;
  _$jscoverage['/underscore.js'].functionData[151] = 0;
  _$jscoverage['/underscore.js'].functionData[152] = 0;
  _$jscoverage['/underscore.js'].functionData[153] = 0;
  _$jscoverage['/underscore.js'].functionData[154] = 0;
  _$jscoverage['/underscore.js'].functionData[155] = 0;
  _$jscoverage['/underscore.js'].functionData[156] = 0;
  _$jscoverage['/underscore.js'].functionData[157] = 0;
  _$jscoverage['/underscore.js'].functionData[158] = 0;
  _$jscoverage['/underscore.js'].functionData[159] = 0;
  _$jscoverage['/underscore.js'].functionData[160] = 0;
  _$jscoverage['/underscore.js'].functionData[161] = 0;
  _$jscoverage['/underscore.js'].functionData[162] = 0;
  _$jscoverage['/underscore.js'].functionData[163] = 0;
  _$jscoverage['/underscore.js'].functionData[164] = 0;
  _$jscoverage['/underscore.js'].functionData[165] = 0;
  _$jscoverage['/underscore.js'].functionData[166] = 0;
}
if (! _$jscoverage['/underscore.js'].branchData) {
  _$jscoverage['/underscore.js'].branchData = {};
  _$jscoverage['/underscore.js'].branchData['14'] = [];
  _$jscoverage['/underscore.js'].branchData['14'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['14'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['14'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['14'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['14'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['15'] = [];
  _$jscoverage['/underscore.js'].branchData['15'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['15'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['15'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['15'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['15'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['43'] = [];
  _$jscoverage['/underscore.js'].branchData['43'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['44'] = [];
  _$jscoverage['/underscore.js'].branchData['44'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['53'] = [];
  _$jscoverage['/underscore.js'].branchData['53'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['53'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['54'] = [];
  _$jscoverage['/underscore.js'].branchData['54'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['54'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['54'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['69'] = [];
  _$jscoverage['/underscore.js'].branchData['69'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['70'] = [];
  _$jscoverage['/underscore.js'].branchData['70'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['92'] = [];
  _$jscoverage['/underscore.js'].branchData['92'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['93'] = [];
  _$jscoverage['/underscore.js'].branchData['93'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['94'] = [];
  _$jscoverage['/underscore.js'].branchData['94'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['105'] = [];
  _$jscoverage['/underscore.js'].branchData['105'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['109'] = [];
  _$jscoverage['/underscore.js'].branchData['109'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['118'] = [];
  _$jscoverage['/underscore.js'].branchData['118'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['128'] = [];
  _$jscoverage['/underscore.js'].branchData['128'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['129'] = [];
  _$jscoverage['/underscore.js'].branchData['129'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['138'] = [];
  _$jscoverage['/underscore.js'].branchData['138'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['150'] = [];
  _$jscoverage['/underscore.js'].branchData['150'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['150'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['150'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['150'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['150'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['162'] = [];
  _$jscoverage['/underscore.js'].branchData['162'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['163'] = [];
  _$jscoverage['/underscore.js'].branchData['163'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['168'] = [];
  _$jscoverage['/underscore.js'].branchData['168'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['178'] = [];
  _$jscoverage['/underscore.js'].branchData['178'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['179'] = [];
  _$jscoverage['/underscore.js'].branchData['179'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['181'] = [];
  _$jscoverage['/underscore.js'].branchData['181'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['182'] = [];
  _$jscoverage['/underscore.js'].branchData['182'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['193'] = [];
  _$jscoverage['/underscore.js'].branchData['193'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['194'] = [];
  _$jscoverage['/underscore.js'].branchData['194'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['195'] = [];
  _$jscoverage['/underscore.js'].branchData['195'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['196'] = [];
  _$jscoverage['/underscore.js'].branchData['196'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['197'] = [];
  _$jscoverage['/underscore.js'].branchData['197'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['200'] = [];
  _$jscoverage['/underscore.js'].branchData['200'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['200'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['200'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['201'] = [];
  _$jscoverage['/underscore.js'].branchData['201'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['208'] = [];
  _$jscoverage['/underscore.js'].branchData['208'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['223'] = [];
  _$jscoverage['/underscore.js'].branchData['223'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['228'] = [];
  _$jscoverage['/underscore.js'].branchData['228'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['228'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['228'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['237'] = [];
  _$jscoverage['/underscore.js'].branchData['237'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['251'] = [];
  _$jscoverage['/underscore.js'].branchData['251'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['252'] = [];
  _$jscoverage['/underscore.js'].branchData['252'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['253'] = [];
  _$jscoverage['/underscore.js'].branchData['253'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['254'] = [];
  _$jscoverage['/underscore.js'].branchData['254'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['255'] = [];
  _$jscoverage['/underscore.js'].branchData['255'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['264'] = [];
  _$jscoverage['/underscore.js'].branchData['264'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['265'] = [];
  _$jscoverage['/underscore.js'].branchData['265'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['266'] = [];
  _$jscoverage['/underscore.js'].branchData['266'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['267'] = [];
  _$jscoverage['/underscore.js'].branchData['267'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['268'] = [];
  _$jscoverage['/underscore.js'].branchData['268'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['276'] = [];
  _$jscoverage['/underscore.js'].branchData['276'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['277'] = [];
  _$jscoverage['/underscore.js'].branchData['277'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['277'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['278'] = [];
  _$jscoverage['/underscore.js'].branchData['278'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['285'] = [];
  _$jscoverage['/underscore.js'].branchData['285'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['286'] = [];
  _$jscoverage['/underscore.js'].branchData['286'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['311'] = [];
  _$jscoverage['/underscore.js'].branchData['311'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['311'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['311'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['311'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['311'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['311'][6] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['311'][7] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['312'] = [];
  _$jscoverage['/underscore.js'].branchData['312'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['313'] = [];
  _$jscoverage['/underscore.js'].branchData['313'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['315'] = [];
  _$jscoverage['/underscore.js'].branchData['315'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['315'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['315'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['323'] = [];
  _$jscoverage['/underscore.js'].branchData['323'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['323'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['323'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['323'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['323'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['336'] = [];
  _$jscoverage['/underscore.js'].branchData['336'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['336'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['336'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['336'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['336'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['336'][6] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['336'][7] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['337'] = [];
  _$jscoverage['/underscore.js'].branchData['337'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['338'] = [];
  _$jscoverage['/underscore.js'].branchData['338'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['340'] = [];
  _$jscoverage['/underscore.js'].branchData['340'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['340'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['340'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['348'] = [];
  _$jscoverage['/underscore.js'].branchData['348'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['348'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['348'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['348'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['348'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['367'] = [];
  _$jscoverage['/underscore.js'].branchData['367'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['367'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['368'] = [];
  _$jscoverage['/underscore.js'].branchData['368'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['371'] = [];
  _$jscoverage['/underscore.js'].branchData['371'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['375'] = [];
  _$jscoverage['/underscore.js'].branchData['375'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['397'] = [];
  _$jscoverage['/underscore.js'].branchData['397'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['398'] = [];
  _$jscoverage['/underscore.js'].branchData['398'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['398'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['398'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['399'] = [];
  _$jscoverage['/underscore.js'].branchData['399'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['399'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['399'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['408'] = [];
  _$jscoverage['/underscore.js'].branchData['408'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['421'] = [];
  _$jscoverage['/underscore.js'].branchData['421'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['434'] = [];
  _$jscoverage['/underscore.js'].branchData['434'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['440'] = [];
  _$jscoverage['/underscore.js'].branchData['440'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['441'] = [];
  _$jscoverage['/underscore.js'].branchData['441'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['442'] = [];
  _$jscoverage['/underscore.js'].branchData['442'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['446'] = [];
  _$jscoverage['/underscore.js'].branchData['446'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['452'] = [];
  _$jscoverage['/underscore.js'].branchData['452'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['453'] = [];
  _$jscoverage['/underscore.js'].branchData['453'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['459'] = [];
  _$jscoverage['/underscore.js'].branchData['459'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['469'] = [];
  _$jscoverage['/underscore.js'].branchData['469'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['470'] = [];
  _$jscoverage['/underscore.js'].branchData['470'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['470'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['478'] = [];
  _$jscoverage['/underscore.js'].branchData['478'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['478'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['484'] = [];
  _$jscoverage['/underscore.js'].branchData['484'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['485'] = [];
  _$jscoverage['/underscore.js'].branchData['485'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['485'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['493'] = [];
  _$jscoverage['/underscore.js'].branchData['493'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['493'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['503'] = [];
  _$jscoverage['/underscore.js'].branchData['503'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['505'] = [];
  _$jscoverage['/underscore.js'].branchData['505'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['507'] = [];
  _$jscoverage['/underscore.js'].branchData['507'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['507'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['509'] = [];
  _$jscoverage['/underscore.js'].branchData['509'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['511'] = [];
  _$jscoverage['/underscore.js'].branchData['511'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['516'] = [];
  _$jscoverage['/underscore.js'].branchData['516'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['537'] = [];
  _$jscoverage['/underscore.js'].branchData['537'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['542'] = [];
  _$jscoverage['/underscore.js'].branchData['542'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['545'] = [];
  _$jscoverage['/underscore.js'].branchData['545'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['547'] = [];
  _$jscoverage['/underscore.js'].branchData['547'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['548'] = [];
  _$jscoverage['/underscore.js'].branchData['548'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['549'] = [];
  _$jscoverage['/underscore.js'].branchData['549'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['549'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['551'] = [];
  _$jscoverage['/underscore.js'].branchData['551'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['552'] = [];
  _$jscoverage['/underscore.js'].branchData['552'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['556'] = [];
  _$jscoverage['/underscore.js'].branchData['556'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['574'] = [];
  _$jscoverage['/underscore.js'].branchData['574'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['576'] = [];
  _$jscoverage['/underscore.js'].branchData['576'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['578'] = [];
  _$jscoverage['/underscore.js'].branchData['578'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['579'] = [];
  _$jscoverage['/underscore.js'].branchData['579'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['581'] = [];
  _$jscoverage['/underscore.js'].branchData['581'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['598'] = [];
  _$jscoverage['/underscore.js'].branchData['598'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['598'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['601'] = [];
  _$jscoverage['/underscore.js'].branchData['601'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['616'] = [];
  _$jscoverage['/underscore.js'].branchData['616'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['617'] = [];
  _$jscoverage['/underscore.js'].branchData['617'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['631'] = [];
  _$jscoverage['/underscore.js'].branchData['631'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['632'] = [];
  _$jscoverage['/underscore.js'].branchData['632'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['632'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['632'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['633'] = [];
  _$jscoverage['/underscore.js'].branchData['633'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['649'] = [];
  _$jscoverage['/underscore.js'].branchData['649'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['651'] = [];
  _$jscoverage['/underscore.js'].branchData['651'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['660'] = [];
  _$jscoverage['/underscore.js'].branchData['660'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['661'] = [];
  _$jscoverage['/underscore.js'].branchData['661'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['662'] = [];
  _$jscoverage['/underscore.js'].branchData['662'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['664'] = [];
  _$jscoverage['/underscore.js'].branchData['664'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['666'] = [];
  _$jscoverage['/underscore.js'].branchData['666'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['666'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['668'] = [];
  _$jscoverage['/underscore.js'].branchData['668'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['670'] = [];
  _$jscoverage['/underscore.js'].branchData['670'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['672'] = [];
  _$jscoverage['/underscore.js'].branchData['672'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['674'] = [];
  _$jscoverage['/underscore.js'].branchData['674'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['674'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['674'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['674'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['675'] = [];
  _$jscoverage['/underscore.js'].branchData['675'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['692'] = [];
  _$jscoverage['/underscore.js'].branchData['692'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['693'] = [];
  _$jscoverage['/underscore.js'].branchData['693'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['696'] = [];
  _$jscoverage['/underscore.js'].branchData['696'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['701'] = [];
  _$jscoverage['/underscore.js'].branchData['701'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['711'] = [];
  _$jscoverage['/underscore.js'].branchData['711'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['711'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['711'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['715'] = [];
  _$jscoverage['/underscore.js'].branchData['715'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['727'] = [];
  _$jscoverage['/underscore.js'].branchData['727'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['730'] = [];
  _$jscoverage['/underscore.js'].branchData['730'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['738'] = [];
  _$jscoverage['/underscore.js'].branchData['738'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['754'] = [];
  _$jscoverage['/underscore.js'].branchData['754'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['755'] = [];
  _$jscoverage['/underscore.js'].branchData['755'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['757'] = [];
  _$jscoverage['/underscore.js'].branchData['757'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['771'] = [];
  _$jscoverage['/underscore.js'].branchData['771'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['772'] = [];
  _$jscoverage['/underscore.js'].branchData['772'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['782'] = [];
  _$jscoverage['/underscore.js'].branchData['782'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['783'] = [];
  _$jscoverage['/underscore.js'].branchData['783'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['810'] = [];
  _$jscoverage['/underscore.js'].branchData['810'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['813'] = [];
  _$jscoverage['/underscore.js'].branchData['813'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['816'] = [];
  _$jscoverage['/underscore.js'].branchData['816'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['821'] = [];
  _$jscoverage['/underscore.js'].branchData['821'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['821'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['825'] = [];
  _$jscoverage['/underscore.js'].branchData['825'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['825'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['825'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['826'] = [];
  _$jscoverage['/underscore.js'].branchData['826'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['832'] = [];
  _$jscoverage['/underscore.js'].branchData['832'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['833'] = [];
  _$jscoverage['/underscore.js'].branchData['833'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['833'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['857'] = [];
  _$jscoverage['/underscore.js'].branchData['857'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['861'] = [];
  _$jscoverage['/underscore.js'].branchData['861'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['862'] = [];
  _$jscoverage['/underscore.js'].branchData['862'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['863'] = [];
  _$jscoverage['/underscore.js'].branchData['863'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['866'] = [];
  _$jscoverage['/underscore.js'].branchData['866'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['903'] = [];
  _$jscoverage['/underscore.js'].branchData['903'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['911'] = [];
  _$jscoverage['/underscore.js'].branchData['911'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['921'] = [];
  _$jscoverage['/underscore.js'].branchData['921'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['924'] = [];
  _$jscoverage['/underscore.js'].branchData['924'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['946'] = [];
  _$jscoverage['/underscore.js'].branchData['946'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['946'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['950'] = [];
  _$jscoverage['/underscore.js'].branchData['950'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['952'] = [];
  _$jscoverage['/underscore.js'].branchData['952'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['954'] = [];
  _$jscoverage['/underscore.js'].branchData['954'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['954'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['954'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['963'] = [];
  _$jscoverage['/underscore.js'].branchData['963'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['964'] = [];
  _$jscoverage['/underscore.js'].branchData['964'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['966'] = [];
  _$jscoverage['/underscore.js'].branchData['966'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['968'] = [];
  _$jscoverage['/underscore.js'].branchData['968'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['974'] = [];
  _$jscoverage['/underscore.js'].branchData['974'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['978'] = [];
  _$jscoverage['/underscore.js'].branchData['978'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['987'] = [];
  _$jscoverage['/underscore.js'].branchData['987'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1000'] = [];
  _$jscoverage['/underscore.js'].branchData['1000'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1012'] = [];
  _$jscoverage['/underscore.js'].branchData['1012'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1022'] = [];
  _$jscoverage['/underscore.js'].branchData['1022'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1033'] = [];
  _$jscoverage['/underscore.js'].branchData['1033'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1042'] = [];
  _$jscoverage['/underscore.js'].branchData['1042'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1043'] = [];
  _$jscoverage['/underscore.js'].branchData['1043'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1043'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1043'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1044'] = [];
  _$jscoverage['/underscore.js'].branchData['1044'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1048'] = [];
  _$jscoverage['/underscore.js'].branchData['1048'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1050'] = [];
  _$jscoverage['/underscore.js'].branchData['1050'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1050'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1068'] = [];
  _$jscoverage['/underscore.js'].branchData['1068'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1070'] = [];
  _$jscoverage['/underscore.js'].branchData['1070'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1082'] = [];
  _$jscoverage['/underscore.js'].branchData['1082'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1083'] = [];
  _$jscoverage['/underscore.js'].branchData['1083'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1084'] = [];
  _$jscoverage['/underscore.js'].branchData['1084'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1091'] = [];
  _$jscoverage['/underscore.js'].branchData['1091'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1094'] = [];
  _$jscoverage['/underscore.js'].branchData['1094'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1102'] = [];
  _$jscoverage['/underscore.js'].branchData['1102'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1104'] = [];
  _$jscoverage['/underscore.js'].branchData['1104'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1122'] = [];
  _$jscoverage['/underscore.js'].branchData['1122'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1128'] = [];
  _$jscoverage['/underscore.js'].branchData['1128'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1129'] = [];
  _$jscoverage['/underscore.js'].branchData['1129'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1143'] = [];
  _$jscoverage['/underscore.js'].branchData['1143'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1145'] = [];
  _$jscoverage['/underscore.js'].branchData['1145'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1147'] = [];
  _$jscoverage['/underscore.js'].branchData['1147'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1147'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1158'] = [];
  _$jscoverage['/underscore.js'].branchData['1158'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1158'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1158'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1158'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1160'] = [];
  _$jscoverage['/underscore.js'].branchData['1160'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1160'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1160'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1160'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1162'] = [];
  _$jscoverage['/underscore.js'].branchData['1162'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1162'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1165'] = [];
  _$jscoverage['/underscore.js'].branchData['1165'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1165'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1165'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1165'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1165'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1172'] = [];
  _$jscoverage['/underscore.js'].branchData['1172'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1173'] = [];
  _$jscoverage['/underscore.js'].branchData['1173'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1176'] = [];
  _$jscoverage['/underscore.js'].branchData['1176'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1184'] = [];
  _$jscoverage['/underscore.js'].branchData['1184'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1188'] = [];
  _$jscoverage['/underscore.js'].branchData['1188'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1188'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1190'] = [];
  _$jscoverage['/underscore.js'].branchData['1190'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1190'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1190'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1196'] = [];
  _$jscoverage['/underscore.js'].branchData['1196'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1199'] = [];
  _$jscoverage['/underscore.js'].branchData['1199'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1200'] = [];
  _$jscoverage['/underscore.js'].branchData['1200'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1201'] = [];
  _$jscoverage['/underscore.js'].branchData['1201'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1201'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1201'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1206'] = [];
  _$jscoverage['/underscore.js'].branchData['1206'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1206'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1206'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1206'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1206'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1207'] = [];
  _$jscoverage['/underscore.js'].branchData['1207'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1208'] = [];
  _$jscoverage['/underscore.js'].branchData['1208'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1217'] = [];
  _$jscoverage['/underscore.js'].branchData['1217'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1218'] = [];
  _$jscoverage['/underscore.js'].branchData['1218'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1220'] = [];
  _$jscoverage['/underscore.js'].branchData['1220'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1223'] = [];
  _$jscoverage['/underscore.js'].branchData['1223'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1223'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1231'] = [];
  _$jscoverage['/underscore.js'].branchData['1231'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1234'] = [];
  _$jscoverage['/underscore.js'].branchData['1234'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1236'] = [];
  _$jscoverage['/underscore.js'].branchData['1236'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1237'] = [];
  _$jscoverage['/underscore.js'].branchData['1237'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1244'] = [];
  _$jscoverage['/underscore.js'].branchData['1244'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1245'] = [];
  _$jscoverage['/underscore.js'].branchData['1245'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1248'] = [];
  _$jscoverage['/underscore.js'].branchData['1248'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1248'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1265'] = [];
  _$jscoverage['/underscore.js'].branchData['1265'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1266'] = [];
  _$jscoverage['/underscore.js'].branchData['1266'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1266'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1266'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1266'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1267'] = [];
  _$jscoverage['/underscore.js'].branchData['1267'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1272'] = [];
  _$jscoverage['/underscore.js'].branchData['1272'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1272'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1277'] = [];
  _$jscoverage['/underscore.js'].branchData['1277'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1278'] = [];
  _$jscoverage['/underscore.js'].branchData['1278'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1284'] = [];
  _$jscoverage['/underscore.js'].branchData['1284'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1284'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1284'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1284'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1290'] = [];
  _$jscoverage['/underscore.js'].branchData['1290'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1296'] = [];
  _$jscoverage['/underscore.js'].branchData['1296'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1304'] = [];
  _$jscoverage['/underscore.js'].branchData['1304'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1305'] = [];
  _$jscoverage['/underscore.js'].branchData['1305'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1305'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1305'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1305'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1305'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1307'] = [];
  _$jscoverage['/underscore.js'].branchData['1307'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1307'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1313'] = [];
  _$jscoverage['/underscore.js'].branchData['1313'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1318'] = [];
  _$jscoverage['/underscore.js'].branchData['1318'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1323'] = [];
  _$jscoverage['/underscore.js'].branchData['1323'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1323'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1323'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1323'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1323'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1328'] = [];
  _$jscoverage['/underscore.js'].branchData['1328'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1333'] = [];
  _$jscoverage['/underscore.js'].branchData['1333'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1339'] = [];
  _$jscoverage['/underscore.js'].branchData['1339'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1339'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1370'] = [];
  _$jscoverage['/underscore.js'].branchData['1370'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1388'] = [];
  _$jscoverage['/underscore.js'].branchData['1388'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1394'] = [];
  _$jscoverage['/underscore.js'].branchData['1394'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1402'] = [];
  _$jscoverage['/underscore.js'].branchData['1402'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1427'] = [];
  _$jscoverage['/underscore.js'].branchData['1427'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1428'] = [];
  _$jscoverage['/underscore.js'].branchData['1428'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1437'] = [];
  _$jscoverage['/underscore.js'].branchData['1437'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1438'] = [];
  _$jscoverage['/underscore.js'].branchData['1438'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1441'] = [];
  _$jscoverage['/underscore.js'].branchData['1441'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1449'] = [];
  _$jscoverage['/underscore.js'].branchData['1449'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1487'] = [];
  _$jscoverage['/underscore.js'].branchData['1487'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1492'] = [];
  _$jscoverage['/underscore.js'].branchData['1492'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1493'] = [];
  _$jscoverage['/underscore.js'].branchData['1493'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1494'] = [];
  _$jscoverage['/underscore.js'].branchData['1494'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1504'] = [];
  _$jscoverage['/underscore.js'].branchData['1504'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1506'] = [];
  _$jscoverage['/underscore.js'].branchData['1506'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1508'] = [];
  _$jscoverage['/underscore.js'].branchData['1508'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1518'] = [];
  _$jscoverage['/underscore.js'].branchData['1518'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1526'] = [];
  _$jscoverage['/underscore.js'].branchData['1526'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1537'] = [];
  _$jscoverage['/underscore.js'].branchData['1537'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1558'] = [];
  _$jscoverage['/underscore.js'].branchData['1558'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1582'] = [];
  _$jscoverage['/underscore.js'].branchData['1582'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1582'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1582'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1582'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1582'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1615'] = [];
  _$jscoverage['/underscore.js'].branchData['1615'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1615'][2] = new BranchData();
}
_$jscoverage['/underscore.js'].branchData['1615'][2].init(55074, 27, 'typeof define == \'function\'');
function visit379_1615_2(result) {
  _$jscoverage['/underscore.js'].branchData['1615'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1615'][1].init(55074, 41, 'typeof define == \'function\' && define.amd');
function visit378_1615_1(result) {
  _$jscoverage['/underscore.js'].branchData['1615'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1582'][5].init(121, 16, 'obj.length === 0');
function visit377_1582_5(result) {
  _$jscoverage['/underscore.js'].branchData['1582'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1582'][4].init(99, 17, 'name === \'splice\'');
function visit376_1582_4(result) {
  _$jscoverage['/underscore.js'].branchData['1582'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1582'][3].init(79, 16, 'name === \'shift\'');
function visit375_1582_3(result) {
  _$jscoverage['/underscore.js'].branchData['1582'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1582'][2].init(79, 37, 'name === \'shift\' || name === \'splice\'');
function visit374_1582_2(result) {
  _$jscoverage['/underscore.js'].branchData['1582'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1582'][1].init(79, 58, '(name === \'shift\' || name === \'splice\') && obj.length === 0');
function visit373_1582_1(result) {
  _$jscoverage['/underscore.js'].branchData['1582'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1558'][1].init(12, 15, 'instance._chain');
function visit372_1558_1(result) {
  _$jscoverage['/underscore.js'].branchData['1558'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1537'][1].init(1755, 26, 'settings.variable || \'obj\'');
function visit371_1537_1(result) {
  _$jscoverage['/underscore.js'].branchData['1537'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1526'][1].init(29, 26, 'settings.variable || \'obj\'');
function visit370_1526_1(result) {
  _$jscoverage['/underscore.js'].branchData['1526'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1518'][1].init(1200, 18, '!settings.variable');
function visit369_1518_1(result) {
  _$jscoverage['/underscore.js'].branchData['1518'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1508'][1].init(336, 8, 'evaluate');
function visit368_1508_1(result) {
  _$jscoverage['/underscore.js'].branchData['1508'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1506'][1].init(231, 11, 'interpolate');
function visit367_1506_1(result) {
  _$jscoverage['/underscore.js'].branchData['1506'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1504'][1].init(126, 6, 'escape');
function visit366_1504_1(result) {
  _$jscoverage['/underscore.js'].branchData['1504'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1494'][1].init(99, 28, 'settings.evaluate || noMatch');
function visit365_1494_1(result) {
  _$jscoverage['/underscore.js'].branchData['1494'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1493'][1].init(51, 31, 'settings.interpolate || noMatch');
function visit364_1493_1(result) {
  _$jscoverage['/underscore.js'].branchData['1493'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1492'][1].init(8, 26, 'settings.escape || noMatch');
function visit363_1492_1(result) {
  _$jscoverage['/underscore.js'].branchData['1492'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1487'][1].init(9, 24, '!settings && oldSettings');
function visit362_1487_1(result) {
  _$jscoverage['/underscore.js'].branchData['1487'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1449'][1].init(43, 6, 'prefix');
function visit361_1449_1(result) {
  _$jscoverage['/underscore.js'].branchData['1449'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1441'][1].init(126, 19, '_.isFunction(value)');
function visit360_1441_1(result) {
  _$jscoverage['/underscore.js'].branchData['1441'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1438'][1].init(65, 16, 'value === void 0');
function visit359_1438_1(result) {
  _$jscoverage['/underscore.js'].branchData['1438'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1437'][1].init(17, 14, 'object == null');
function visit358_1437_1(result) {
  _$jscoverage['/underscore.js'].branchData['1437'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1428'][1].init(64, 23, 'testRegexp.test(string)');
function visit357_1428_1(result) {
  _$jscoverage['/underscore.js'].branchData['1428'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1427'][1].init(16, 14, 'string == null');
function visit356_1427_1(result) {
  _$jscoverage['/underscore.js'].branchData['1427'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1402'][1].init(47886, 61, 'Date.now || function() {\n  return new Date().getTime();\n}');
function visit355_1402_1(result) {
  _$jscoverage['/underscore.js'].branchData['1402'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1394'][1].init(9, 11, 'max == null');
function visit354_1394_1(result) {
  _$jscoverage['/underscore.js'].branchData['1394'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1388'][1].init(109, 5, 'i < n');
function visit353_1388_1(result) {
  _$jscoverage['/underscore.js'].branchData['1388'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1370'][1].init(12, 11, 'obj == null');
function visit352_1370_1(result) {
  _$jscoverage['/underscore.js'].branchData['1370'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1339'][2].init(12, 11, 'obj != null');
function visit351_1339_2(result) {
  _$jscoverage['/underscore.js'].branchData['1339'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1339'][1].init(12, 44, 'obj != null && hasOwnProperty.call(obj, key)');
function visit350_1339_1(result) {
  _$jscoverage['/underscore.js'].branchData['1339'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1333'][1].init(12, 14, 'obj === void 0');
function visit349_1333_1(result) {
  _$jscoverage['/underscore.js'].branchData['1333'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1328'][1].init(12, 12, 'obj === null');
function visit348_1328_1(result) {
  _$jscoverage['/underscore.js'].branchData['1328'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1323'][5].init(45, 41, 'toString.call(obj) === \'[object Boolean]\'');
function visit347_1323_5(result) {
  _$jscoverage['/underscore.js'].branchData['1323'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1323'][4].init(28, 13, 'obj === false');
function visit346_1323_4(result) {
  _$jscoverage['/underscore.js'].branchData['1323'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1323'][3].init(28, 58, 'obj === false || toString.call(obj) === \'[object Boolean]\'');
function visit345_1323_3(result) {
  _$jscoverage['/underscore.js'].branchData['1323'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1323'][2].init(12, 12, 'obj === true');
function visit344_1323_2(result) {
  _$jscoverage['/underscore.js'].branchData['1323'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1323'][1].init(12, 74, 'obj === true || obj === false || toString.call(obj) === \'[object Boolean]\'');
function visit343_1323_1(result) {
  _$jscoverage['/underscore.js'].branchData['1323'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1318'][1].init(12, 29, '_.isNumber(obj) && isNaN(obj)');
function visit342_1318_1(result) {
  _$jscoverage['/underscore.js'].branchData['1318'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1313'][1].init(12, 40, 'isFinite(obj) && !isNaN(parseFloat(obj))');
function visit341_1313_1(result) {
  _$jscoverage['/underscore.js'].branchData['1313'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1307'][2].init(14, 24, 'typeof obj == \'function\'');
function visit340_1307_2(result) {
  _$jscoverage['/underscore.js'].branchData['1307'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1307'][1].init(14, 33, 'typeof obj == \'function\' || false');
function visit339_1307_1(result) {
  _$jscoverage['/underscore.js'].branchData['1307'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1305'][5].init(45314, 29, 'typeof nodelist != \'function\'');
function visit338_1305_5(result) {
  _$jscoverage['/underscore.js'].branchData['1305'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1305'][4].init(45282, 28, 'typeof Int8Array != \'object\'');
function visit337_1305_4(result) {
  _$jscoverage['/underscore.js'].branchData['1305'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1305'][3].init(45282, 61, 'typeof Int8Array != \'object\' && typeof nodelist != \'function\'');
function visit336_1305_3(result) {
  _$jscoverage['/underscore.js'].branchData['1305'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1305'][2].init(45254, 24, 'typeof /./ != \'function\'');
function visit335_1305_2(result) {
  _$jscoverage['/underscore.js'].branchData['1305'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1305'][1].init(45254, 89, 'typeof /./ != \'function\' && typeof Int8Array != \'object\' && typeof nodelist != \'function\'');
function visit334_1305_1(result) {
  _$jscoverage['/underscore.js'].branchData['1305'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1304'][1].init(45205, 41, 'root.document && root.document.childNodes');
function visit333_1304_1(result) {
  _$jscoverage['/underscore.js'].branchData['1304'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1296'][1].init(44932, 25, '!_.isArguments(arguments)');
function visit332_1296_1(result) {
  _$jscoverage['/underscore.js'].branchData['1296'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1290'][1].init(14, 46, 'toString.call(obj) === \'[object \' + name + \']\'');
function visit331_1290_1(result) {
  _$jscoverage['/underscore.js'].branchData['1290'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1284'][4].init(62, 17, 'type === \'object\'');
function visit330_1284_4(result) {
  _$jscoverage['/underscore.js'].branchData['1284'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1284'][3].init(62, 26, 'type === \'object\' && !!obj');
function visit329_1284_3(result) {
  _$jscoverage['/underscore.js'].branchData['1284'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1284'][2].init(39, 19, 'type === \'function\'');
function visit328_1284_2(result) {
  _$jscoverage['/underscore.js'].branchData['1284'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1284'][1].init(39, 49, 'type === \'function\' || type === \'object\' && !!obj');
function visit327_1284_1(result) {
  _$jscoverage['/underscore.js'].branchData['1284'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1278'][1].init(12, 39, 'toString.call(obj) === \'[object Array]\'');
function visit326_1278_1(result) {
  _$jscoverage['/underscore.js'].branchData['1278'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1277'][1].init(44229, 88, 'nativeIsArray || function(obj) {\n  return toString.call(obj) === \'[object Array]\';\n}');
function visit325_1277_1(result) {
  _$jscoverage['/underscore.js'].branchData['1277'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1272'][2].init(22, 18, 'obj.nodeType === 1');
function visit324_1272_2(result) {
  _$jscoverage['/underscore.js'].branchData['1272'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1272'][1].init(15, 25, 'obj && obj.nodeType === 1');
function visit323_1272_1(result) {
  _$jscoverage['/underscore.js'].branchData['1272'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1267'][1].init(158, 24, '_.keys(obj).length === 0');
function visit322_1267_1(result) {
  _$jscoverage['/underscore.js'].branchData['1267'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1266'][4].init(129, 16, 'obj.length === 0');
function visit321_1266_4(result) {
  _$jscoverage['/underscore.js'].branchData['1266'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1266'][3].init(82, 37, '_.isString(obj) || _.isArguments(obj)');
function visit320_1266_3(result) {
  _$jscoverage['/underscore.js'].branchData['1266'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1266'][2].init(64, 55, '_.isArray(obj) || _.isString(obj) || _.isArguments(obj)');
function visit319_1266_2(result) {
  _$jscoverage['/underscore.js'].branchData['1266'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1266'][1].init(43, 77, 'isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))');
function visit318_1266_1(result) {
  _$jscoverage['/underscore.js'].branchData['1266'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1265'][1].init(9, 11, 'obj == null');
function visit317_1265_1(result) {
  _$jscoverage['/underscore.js'].branchData['1265'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1248'][2].init(79, 51, '_.has(b, key) && eq(a[key], b[key], aStack, bStack)');
function visit316_1248_2(result) {
  _$jscoverage['/underscore.js'].branchData['1248'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1248'][1].init(77, 54, '!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))');
function visit315_1248_1(result) {
  _$jscoverage['/underscore.js'].branchData['1248'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1245'][1].init(263, 8, 'length--');
function visit314_1245_1(result) {
  _$jscoverage['/underscore.js'].branchData['1245'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1244'][1].init(207, 27, '_.keys(b).length !== length');
function visit313_1244_1(result) {
  _$jscoverage['/underscore.js'].branchData['1244'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1237'][1].init(13, 41, '!eq(a[length], b[length], aStack, bStack)');
function visit312_1237_1(result) {
  _$jscoverage['/underscore.js'].branchData['1237'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1236'][1].init(232, 8, 'length--');
function visit311_1236_1(result) {
  _$jscoverage['/underscore.js'].branchData['1236'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1234'][1].init(115, 19, 'length !== b.length');
function visit310_1234_1(result) {
  _$jscoverage['/underscore.js'].branchData['1234'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1231'][1].init(2632, 9, 'areArrays');
function visit309_1231_1(result) {
  _$jscoverage['/underscore.js'].branchData['1231'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1223'][2].init(154, 20, 'bStack[length] === b');
function visit308_1223_2(result) {
  _$jscoverage['/underscore.js'].branchData['1223'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1223'][1].init(125, 20, 'aStack[length] === a');
function visit307_1223_1(result) {
  _$jscoverage['/underscore.js'].branchData['1223'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1220'][1].init(2279, 8, 'length--');
function visit306_1220_1(result) {
  _$jscoverage['/underscore.js'].branchData['1220'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1218'][1].init(2222, 12, 'bStack || []');
function visit305_1218_1(result) {
  _$jscoverage['/underscore.js'].branchData['1218'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1217'][1].init(2195, 12, 'aStack || []');
function visit304_1217_1(result) {
  _$jscoverage['/underscore.js'].branchData['1217'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1208'][1].init(158, 40, '\'constructor\' in a && \'constructor\' in b');
function visit303_1208_1(result) {
  _$jscoverage['/underscore.js'].branchData['1208'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1207'][1].init(56, 45, '_.isFunction(bCtor) && bCtor instanceof bCtor');
function visit302_1207_1(result) {
  _$jscoverage['/underscore.js'].branchData['1207'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1206'][5].init(309, 102, 'aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor');
function visit301_1206_5(result) {
  _$jscoverage['/underscore.js'].branchData['1206'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1206'][4].init(286, 125, '_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor');
function visit300_1206_4(result) {
  _$jscoverage['/underscore.js'].branchData['1206'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1206'][3].init(284, 200, '!(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor) && (\'constructor\' in a && \'constructor\' in b)');
function visit299_1206_3(result) {
  _$jscoverage['/underscore.js'].branchData['1206'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1206'][2].init(265, 15, 'aCtor !== bCtor');
function visit298_1206_2(result) {
  _$jscoverage['/underscore.js'].branchData['1206'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1206'][1].init(265, 219, 'aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor) && (\'constructor\' in a && \'constructor\' in b)');
function visit297_1206_1(result) {
  _$jscoverage['/underscore.js'].branchData['1206'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1201'][3].init(35, 20, 'typeof b != \'object\'');
function visit296_1201_3(result) {
  _$jscoverage['/underscore.js'].branchData['1201'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1201'][2].init(11, 20, 'typeof a != \'object\'');
function visit295_1201_2(result) {
  _$jscoverage['/underscore.js'].branchData['1201'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1201'][1].init(11, 44, 'typeof a != \'object\' || typeof b != \'object\'');
function visit294_1201_1(result) {
  _$jscoverage['/underscore.js'].branchData['1201'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1200'][1].init(1351, 10, '!areArrays');
function visit293_1200_1(result) {
  _$jscoverage['/underscore.js'].branchData['1200'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1199'][1].init(1311, 30, 'className === \'[object Array]\'');
function visit292_1199_1(result) {
  _$jscoverage['/underscore.js'].branchData['1199'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1196'][1].init(270, 9, '+a === +b');
function visit291_1196_1(result) {
  _$jscoverage['/underscore.js'].branchData['1196'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1190'][3].init(277, 9, '+a === +b');
function visit290_1190_3(result) {
  _$jscoverage['/underscore.js'].branchData['1190'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1190'][2].init(258, 16, '1 / +a === 1 / b');
function visit289_1190_2(result) {
  _$jscoverage['/underscore.js'].branchData['1190'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1190'][1].init(247, 8, '+a === 0');
function visit288_1190_1(result) {
  _$jscoverage['/underscore.js'].branchData['1190'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1188'][2].init(150, 9, '+b !== +b');
function visit287_1188_2(result) {
  _$jscoverage['/underscore.js'].branchData['1188'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1188'][1].init(132, 9, '+a !== +a');
function visit286_1188_1(result) {
  _$jscoverage['/underscore.js'].branchData['1188'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1184'][1].init(175, 17, '\'\' + a === \'\' + b');
function visit285_1184_1(result) {
  _$jscoverage['/underscore.js'].branchData['1184'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1176'][1].init(196, 30, 'className !== toString.call(b)');
function visit284_1176_1(result) {
  _$jscoverage['/underscore.js'].branchData['1176'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1173'][1].init(84, 14, 'b instanceof _');
function visit283_1173_1(result) {
  _$jscoverage['/underscore.js'].branchData['1173'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1172'][1].init(44, 14, 'a instanceof _');
function visit282_1172_1(result) {
  _$jscoverage['/underscore.js'].branchData['1172'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1165'][5].init(531, 20, 'typeof b != \'object\'');
function visit281_1165_5(result) {
  _$jscoverage['/underscore.js'].branchData['1165'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1165'][4].init(510, 17, 'type !== \'object\'');
function visit280_1165_4(result) {
  _$jscoverage['/underscore.js'].branchData['1165'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1165'][3].init(510, 41, 'type !== \'object\' && typeof b != \'object\'');
function visit279_1165_3(result) {
  _$jscoverage['/underscore.js'].branchData['1165'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1165'][2].init(487, 19, 'type !== \'function\'');
function visit278_1165_2(result) {
  _$jscoverage['/underscore.js'].branchData['1165'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1165'][1].init(487, 64, 'type !== \'function\' && type !== \'object\' && typeof b != \'object\'');
function visit277_1165_1(result) {
  _$jscoverage['/underscore.js'].branchData['1165'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1162'][2].init(413, 7, 'b !== b');
function visit276_1162_2(result) {
  _$jscoverage['/underscore.js'].branchData['1162'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1162'][1].init(397, 7, 'a !== a');
function visit275_1162_1(result) {
  _$jscoverage['/underscore.js'].branchData['1162'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1160'][4].init(331, 7, 'a === b');
function visit274_1160_4(result) {
  _$jscoverage['/underscore.js'].branchData['1160'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1160'][3].init(313, 9, 'b == null');
function visit273_1160_3(result) {
  _$jscoverage['/underscore.js'].branchData['1160'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1160'][2].init(300, 9, 'a == null');
function visit272_1160_2(result) {
  _$jscoverage['/underscore.js'].branchData['1160'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1160'][1].init(300, 22, 'a == null || b == null');
function visit271_1160_1(result) {
  _$jscoverage['/underscore.js'].branchData['1160'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1158'][4].init(206, 15, '1 / a === 1 / b');
function visit270_1158_4(result) {
  _$jscoverage['/underscore.js'].branchData['1158'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1158'][3].init(195, 7, 'a !== 0');
function visit269_1158_3(result) {
  _$jscoverage['/underscore.js'].branchData['1158'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1158'][2].init(195, 26, 'a !== 0 || 1 / a === 1 / b');
function visit268_1158_2(result) {
  _$jscoverage['/underscore.js'].branchData['1158'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1158'][1].init(179, 7, 'a === b');
function visit267_1158_1(result) {
  _$jscoverage['/underscore.js'].branchData['1158'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1147'][2].init(36, 23, 'attrs[key] !== obj[key]');
function visit266_1147_2(result) {
  _$jscoverage['/underscore.js'].branchData['1147'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1147'][1].init(36, 40, 'attrs[key] !== obj[key] || !(key in obj)');
function visit265_1147_1(result) {
  _$jscoverage['/underscore.js'].branchData['1147'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1145'][1].init(143, 10, 'i < length');
function visit264_1145_1(result) {
  _$jscoverage['/underscore.js'].branchData['1145'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1143'][1].init(61, 14, 'object == null');
function visit263_1143_1(result) {
  _$jscoverage['/underscore.js'].branchData['1143'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1129'][1].init(50, 14, '_.isArray(obj)');
function visit262_1129_1(result) {
  _$jscoverage['/underscore.js'].branchData['1129'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1128'][1].init(9, 16, '!_.isObject(obj)');
function visit261_1128_1(result) {
  _$jscoverage['/underscore.js'].branchData['1128'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1122'][1].init(49, 5, 'props');
function visit260_1122_1(result) {
  _$jscoverage['/underscore.js'].branchData['1122'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1104'][1].init(48, 15, 'keys.length > 1');
function visit259_1104_1(result) {
  _$jscoverage['/underscore.js'].branchData['1104'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1102'][1].init(46, 22, '_.isFunction(iteratee)');
function visit258_1102_1(result) {
  _$jscoverage['/underscore.js'].branchData['1102'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1094'][1].init(64, 25, 'iteratee(value, key, obj)');
function visit257_1094_1(result) {
  _$jscoverage['/underscore.js'].branchData['1094'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1091'][1].init(365, 10, 'i < length');
function visit256_1091_1(result) {
  _$jscoverage['/underscore.js'].branchData['1091'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1084'][1].init(11, 15, 'keys.length > 1');
function visit255_1084_1(result) {
  _$jscoverage['/underscore.js'].branchData['1084'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1083'][1].init(86, 22, '_.isFunction(iteratee)');
function visit254_1083_1(result) {
  _$jscoverage['/underscore.js'].branchData['1083'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1082'][1].init(50, 11, 'obj == null');
function visit253_1082_1(result) {
  _$jscoverage['/underscore.js'].branchData['1082'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1070'][1].init(32, 29, 'predicate(obj[key], key, obj)');
function visit252_1070_1(result) {
  _$jscoverage['/underscore.js'].branchData['1070'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1068'][1].init(116, 10, 'i < length');
function visit251_1068_1(result) {
  _$jscoverage['/underscore.js'].branchData['1068'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1050'][2].init(57, 19, 'obj[key] === void 0');
function visit250_1050_2(result) {
  _$jscoverage['/underscore.js'].branchData['1050'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1050'][1].init(44, 32, '!defaults || obj[key] === void 0');
function visit249_1050_1(result) {
  _$jscoverage['/underscore.js'].branchData['1050'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1048'][1].init(130, 5, 'i < l');
function visit248_1048_1(result) {
  _$jscoverage['/underscore.js'].branchData['1048'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1044'][1].init(152, 14, 'index < length');
function visit247_1044_1(result) {
  _$jscoverage['/underscore.js'].branchData['1044'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1043'][3].init(101, 11, 'obj == null');
function visit246_1043_3(result) {
  _$jscoverage['/underscore.js'].branchData['1043'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1043'][2].init(87, 10, 'length < 2');
function visit245_1043_2(result) {
  _$jscoverage['/underscore.js'].branchData['1043'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1043'][1].init(87, 25, 'length < 2 || obj == null');
function visit244_1043_1(result) {
  _$jscoverage['/underscore.js'].branchData['1043'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1042'][1].init(48, 8, 'defaults');
function visit243_1042_1(result) {
  _$jscoverage['/underscore.js'].branchData['1042'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1033'][1].init(11, 22, '_.isFunction(obj[key])');
function visit242_1033_1(result) {
  _$jscoverage['/underscore.js'].branchData['1033'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1022'][1].init(92, 10, 'i < length');
function visit241_1022_1(result) {
  _$jscoverage['/underscore.js'].branchData['1022'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1012'][1].init(110, 10, 'i < length');
function visit240_1012_1(result) {
  _$jscoverage['/underscore.js'].branchData['1012'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1000'][1].init(139, 14, 'index < length');
function visit239_1000_1(result) {
  _$jscoverage['/underscore.js'].branchData['1000'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['987'][1].init(111, 10, 'i < length');
function visit238_987_1(result) {
  _$jscoverage['/underscore.js'].branchData['987'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['978'][1].init(127, 10, 'hasEnumBug');
function visit237_978_1(result) {
  _$jscoverage['/underscore.js'].branchData['978'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['974'][1].init(9, 16, '!_.isObject(obj)');
function visit236_974_1(result) {
  _$jscoverage['/underscore.js'].branchData['974'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['968'][1].init(192, 10, 'hasEnumBug');
function visit235_968_1(result) {
  _$jscoverage['/underscore.js'].branchData['968'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['966'][1].init(130, 15, '_.has(obj, key)');
function visit234_966_1(result) {
  _$jscoverage['/underscore.js'].branchData['966'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['964'][1].init(46, 10, 'nativeKeys');
function visit233_964_1(result) {
  _$jscoverage['/underscore.js'].branchData['964'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['963'][1].init(9, 16, '!_.isObject(obj)');
function visit232_963_1(result) {
  _$jscoverage['/underscore.js'].branchData['963'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['954'][3].init(71, 25, 'obj[prop] !== proto[prop]');
function visit231_954_3(result) {
  _$jscoverage['/underscore.js'].branchData['954'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['954'][2].init(71, 52, 'obj[prop] !== proto[prop] && !_.contains(keys, prop)');
function visit230_954_2(result) {
  _$jscoverage['/underscore.js'].branchData['954'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['954'][1].init(56, 67, 'prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)');
function visit229_954_1(result) {
  _$jscoverage['/underscore.js'].branchData['954'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['952'][1].init(319, 12, 'nonEnumIdx--');
function visit228_952_1(result) {
  _$jscoverage['/underscore.js'].branchData['952'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['950'][1].init(245, 43, '_.has(obj, prop) && !_.contains(keys, prop)');
function visit227_950_1(result) {
  _$jscoverage['/underscore.js'].branchData['950'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['946'][2].init(104, 50, '_.isFunction(constructor) && constructor.prototype');
function visit226_946_2(result) {
  _$jscoverage['/underscore.js'].branchData['946'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['946'][1].init(104, 62, '_.isFunction(constructor) && constructor.prototype || ObjProto');
function visit225_946_1(result) {
  _$jscoverage['/underscore.js'].branchData['946'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['924'][1].init(88, 10, 'times <= 1');
function visit224_924_1(result) {
  _$jscoverage['/underscore.js'].branchData['924'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['921'][1].init(11, 11, '--times > 0');
function visit223_921_1(result) {
  _$jscoverage['/underscore.js'].branchData['921'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['911'][1].init(11, 11, '--times < 1');
function visit222_911_1(result) {
  _$jscoverage['/underscore.js'].branchData['911'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['903'][1].init(90, 3, 'i--');
function visit221_903_1(result) {
  _$jscoverage['/underscore.js'].branchData['903'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['866'][1].init(209, 10, '!immediate');
function visit220_866_1(result) {
  _$jscoverage['/underscore.js'].branchData['866'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['863'][1].init(96, 7, 'callNow');
function visit219_863_1(result) {
  _$jscoverage['/underscore.js'].branchData['863'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['862'][1].init(54, 7, 'timeout');
function visit218_862_1(result) {
  _$jscoverage['/underscore.js'].branchData['862'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['861'][1].init(21, 21, 'immediate && !timeout');
function visit217_861_1(result) {
  _$jscoverage['/underscore.js'].branchData['861'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['857'][1].init(33, 4, 'args');
function visit216_857_1(result) {
  _$jscoverage['/underscore.js'].branchData['857'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['833'][2].init(468, 26, 'options.trailing !== false');
function visit215_833_2(result) {
  _$jscoverage['/underscore.js'].branchData['833'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['833'][1].init(456, 38, '!timeout && options.trailing !== false');
function visit214_833_1(result) {
  _$jscoverage['/underscore.js'].branchData['833'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['832'][1].init(173, 8, '!timeout');
function visit213_832_1(result) {
  _$jscoverage['/underscore.js'].branchData['832'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['826'][1].init(13, 7, 'timeout');
function visit212_826_1(result) {
  _$jscoverage['/underscore.js'].branchData['826'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['825'][3].init(213, 16, 'remaining > wait');
function visit211_825_3(result) {
  _$jscoverage['/underscore.js'].branchData['825'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['825'][2].init(195, 14, 'remaining <= 0');
function visit210_825_2(result) {
  _$jscoverage['/underscore.js'].branchData['825'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['825'][1].init(195, 34, 'remaining <= 0 || remaining > wait');
function visit209_825_1(result) {
  _$jscoverage['/underscore.js'].branchData['825'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['821'][2].init(49, 25, 'options.leading === false');
function visit208_821_2(result) {
  _$jscoverage['/underscore.js'].branchData['821'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['821'][1].init(36, 38, '!previous && options.leading === false');
function visit207_821_1(result) {
  _$jscoverage['/underscore.js'].branchData['821'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['816'][1].init(133, 8, '!timeout');
function visit206_816_1(result) {
  _$jscoverage['/underscore.js'].branchData['816'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['813'][1].init(18, 25, 'options.leading === false');
function visit205_813_1(result) {
  _$jscoverage['/underscore.js'].branchData['813'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['810'][1].init(71, 8, '!options');
function visit204_810_1(result) {
  _$jscoverage['/underscore.js'].branchData['810'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['783'][1].init(117, 22, '!_.has(cache, address)');
function visit203_783_1(result) {
  _$jscoverage['/underscore.js'].branchData['783'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['782'][1].init(60, 6, 'hasher');
function visit202_782_1(result) {
  _$jscoverage['/underscore.js'].branchData['782'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['772'][1].init(158, 7, 'index--');
function visit201_772_1(result) {
  _$jscoverage['/underscore.js'].branchData['772'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['771'][1].init(78, 9, 'index < 1');
function visit200_771_1(result) {
  _$jscoverage['/underscore.js'].branchData['771'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['757'][1].init(233, 27, 'position < arguments.length');
function visit199_757_1(result) {
  _$jscoverage['/underscore.js'].branchData['757'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['755'][1].init(19, 28, 'boundArgs[i] === placeholder');
function visit198_755_1(result) {
  _$jscoverage['/underscore.js'].branchData['755'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['754'][1].init(106, 10, 'i < length');
function visit197_754_1(result) {
  _$jscoverage['/underscore.js'].branchData['754'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['738'][1].init(9, 19, '!_.isFunction(func)');
function visit196_738_1(result) {
  _$jscoverage['/underscore.js'].branchData['738'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['730'][1].init(193, 18, '_.isObject(result)');
function visit195_730_1(result) {
  _$jscoverage['/underscore.js'].branchData['730'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['727'][1].init(9, 38, '!(callingContext instanceof boundFunc)');
function visit194_727_1(result) {
  _$jscoverage['/underscore.js'].branchData['727'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['715'][1].init(119, 10, 'i < length');
function visit193_715_1(result) {
  _$jscoverage['/underscore.js'].branchData['715'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['711'][3].init(26, 9, 'count < 1');
function visit192_711_3(result) {
  _$jscoverage['/underscore.js'].branchData['711'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['711'][2].init(9, 13, 'count == null');
function visit191_711_2(result) {
  _$jscoverage['/underscore.js'].branchData['711'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['711'][1].init(9, 26, 'count == null || count < 1');
function visit190_711_1(result) {
  _$jscoverage['/underscore.js'].branchData['711'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['701'][1].init(214, 12, 'idx < length');
function visit189_701_1(result) {
  _$jscoverage['/underscore.js'].branchData['701'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['696'][1].init(84, 9, 'step || 1');
function visit188_696_1(result) {
  _$jscoverage['/underscore.js'].branchData['696'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['693'][1].init(14, 10, 'start || 0');
function visit187_693_1(result) {
  _$jscoverage['/underscore.js'].branchData['693'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['692'][1].init(9, 12, 'stop == null');
function visit186_692_1(result) {
  _$jscoverage['/underscore.js'].branchData['692'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['675'][1].init(13, 19, 'array[idx] === item');
function visit185_675_1(result) {
  _$jscoverage['/underscore.js'].branchData['675'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['674'][4].init(607, 12, 'idx < length');
function visit184_674_4(result) {
  _$jscoverage['/underscore.js'].branchData['674'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['674'][3].init(595, 8, 'idx >= 0');
function visit183_674_3(result) {
  _$jscoverage['/underscore.js'].branchData['674'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['674'][2].init(595, 24, 'idx >= 0 && idx < length');
function visit182_674_2(result) {
  _$jscoverage['/underscore.js'].branchData['674'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['674'][1].init(569, 7, 'dir > 0');
function visit181_674_1(result) {
  _$jscoverage['/underscore.js'].branchData['674'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['672'][1].init(84, 8, 'idx >= 0');
function visit180_672_1(result) {
  _$jscoverage['/underscore.js'].branchData['672'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['670'][1].init(419, 13, 'item !== item');
function visit179_670_1(result) {
  _$jscoverage['/underscore.js'].branchData['670'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['668'][1].init(56, 19, 'array[idx] === item');
function visit178_668_1(result) {
  _$jscoverage['/underscore.js'].branchData['668'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['666'][2].init(298, 13, 'idx && length');
function visit177_666_2(result) {
  _$jscoverage['/underscore.js'].branchData['666'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['666'][1].init(283, 28, 'sortedIndex && idx && length');
function visit176_666_1(result) {
  _$jscoverage['/underscore.js'].branchData['666'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['664'][1].init(20, 8, 'idx >= 0');
function visit175_664_1(result) {
  _$jscoverage['/underscore.js'].branchData['664'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['662'][1].init(15, 8, 'idx >= 0');
function visit174_662_1(result) {
  _$jscoverage['/underscore.js'].branchData['662'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['661'][1].init(13, 7, 'dir > 0');
function visit173_661_1(result) {
  _$jscoverage['/underscore.js'].branchData['661'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['660'][1].init(55, 22, 'typeof idx == \'number\'');
function visit172_660_1(result) {
  _$jscoverage['/underscore.js'].branchData['660'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['651'][1].init(57, 28, 'iteratee(array[mid]) < value');
function visit171_651_1(result) {
  _$jscoverage['/underscore.js'].branchData['651'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['649'][1].init(126, 10, 'low < high');
function visit170_649_1(result) {
  _$jscoverage['/underscore.js'].branchData['649'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['633'][1].init(13, 37, 'predicate(array[index], index, array)');
function visit169_633_1(result) {
  _$jscoverage['/underscore.js'].branchData['633'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['632'][3].init(151, 14, 'index < length');
function visit168_632_3(result) {
  _$jscoverage['/underscore.js'].branchData['632'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['632'][2].init(137, 10, 'index >= 0');
function visit167_632_2(result) {
  _$jscoverage['/underscore.js'].branchData['632'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['632'][1].init(137, 28, 'index >= 0 && index < length');
function visit166_632_1(result) {
  _$jscoverage['/underscore.js'].branchData['632'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['631'][1].init(98, 7, 'dir > 0');
function visit165_631_1(result) {
  _$jscoverage['/underscore.js'].branchData['631'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['617'][1].init(11, 6, 'values');
function visit164_617_1(result) {
  _$jscoverage['/underscore.js'].branchData['617'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['616'][1].init(68, 10, 'i < length');
function visit163_616_1(result) {
  _$jscoverage['/underscore.js'].branchData['616'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['601'][1].init(121, 14, 'index < length');
function visit162_601_1(result) {
  _$jscoverage['/underscore.js'].branchData['601'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['598'][2].init(18, 39, 'array && _.max(array, getLength).length');
function visit161_598_2(result) {
  _$jscoverage['/underscore.js'].branchData['598'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['598'][1].init(18, 44, 'array && _.max(array, getLength).length || 0');
function visit160_598_1(result) {
  _$jscoverage['/underscore.js'].branchData['598'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['581'][1].init(198, 16, 'j === argsLength');
function visit159_581_1(result) {
  _$jscoverage['/underscore.js'].branchData['581'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['579'][1].init(13, 31, '!_.contains(arguments[j], item)');
function visit158_579_1(result) {
  _$jscoverage['/underscore.js'].branchData['579'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['578'][1].init(105, 14, 'j < argsLength');
function visit157_578_1(result) {
  _$jscoverage['/underscore.js'].branchData['578'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['576'][1].init(38, 24, '_.contains(result, item)');
function visit156_576_1(result) {
  _$jscoverage['/underscore.js'].branchData['576'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['574'][1].init(108, 10, 'i < length');
function visit155_574_1(result) {
  _$jscoverage['/underscore.js'].branchData['574'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['556'][1].init(362, 26, '!_.contains(result, value)');
function visit154_556_1(result) {
  _$jscoverage['/underscore.js'].branchData['556'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['552'][1].init(13, 27, '!_.contains(seen, computed)');
function visit153_552_1(result) {
  _$jscoverage['/underscore.js'].branchData['552'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['551'][1].init(218, 8, 'iteratee');
function visit152_551_1(result) {
  _$jscoverage['/underscore.js'].branchData['551'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['549'][2].init(19, 17, 'seen !== computed');
function visit151_549_2(result) {
  _$jscoverage['/underscore.js'].branchData['549'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['549'][1].init(13, 23, '!i || seen !== computed');
function visit150_549_1(result) {
  _$jscoverage['/underscore.js'].branchData['549'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['548'][1].init(106, 8, 'isSorted');
function visit149_548_1(result) {
  _$jscoverage['/underscore.js'].branchData['548'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['547'][1].init(42, 8, 'iteratee');
function visit148_547_1(result) {
  _$jscoverage['/underscore.js'].branchData['547'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['545'][1].init(265, 10, 'i < length');
function visit147_545_1(result) {
  _$jscoverage['/underscore.js'].branchData['545'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['542'][1].init(126, 16, 'iteratee != null');
function visit146_542_1(result) {
  _$jscoverage['/underscore.js'].branchData['542'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['537'][1].init(9, 22, '!_.isBoolean(isSorted)');
function visit145_537_1(result) {
  _$jscoverage['/underscore.js'].branchData['537'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['516'][1].init(414, 7, '!strict');
function visit144_516_1(result) {
  _$jscoverage['/underscore.js'].branchData['516'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['511'][1].init(59, 7, 'j < len');
function visit143_511_1(result) {
  _$jscoverage['/underscore.js'].branchData['511'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['509'][1].init(75, 7, 'shallow');
function visit142_509_1(result) {
  _$jscoverage['/underscore.js'].branchData['509'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['507'][2].init(62, 40, '_.isArray(value) || _.isArguments(value)');
function visit141_507_2(result) {
  _$jscoverage['/underscore.js'].branchData['507'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['507'][1].init(39, 64, 'isArrayLike(value) && (_.isArray(value) || _.isArguments(value))');
function visit140_507_1(result) {
  _$jscoverage['/underscore.js'].branchData['507'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['505'][1].init(104, 10, 'i < length');
function visit139_505_1(result) {
  _$jscoverage['/underscore.js'].branchData['505'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['503'][1].init(14, 12, 'output || []');
function visit138_503_1(result) {
  _$jscoverage['/underscore.js'].branchData['503'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['493'][2].init(30, 9, 'n == null');
function visit137_493_2(result) {
  _$jscoverage['/underscore.js'].branchData['493'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['493'][1].init(30, 18, 'n == null || guard');
function visit136_493_1(result) {
  _$jscoverage['/underscore.js'].branchData['493'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['485'][2].init(47, 9, 'n == null');
function visit135_485_2(result) {
  _$jscoverage['/underscore.js'].branchData['485'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['485'][1].init(47, 18, 'n == null || guard');
function visit134_485_1(result) {
  _$jscoverage['/underscore.js'].branchData['485'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['484'][1].init(9, 13, 'array == null');
function visit133_484_1(result) {
  _$jscoverage['/underscore.js'].branchData['484'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['478'][2].init(61, 9, 'n == null');
function visit132_478_2(result) {
  _$jscoverage['/underscore.js'].branchData['478'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['478'][1].init(61, 18, 'n == null || guard');
function visit131_478_1(result) {
  _$jscoverage['/underscore.js'].branchData['478'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['470'][2].init(47, 9, 'n == null');
function visit130_470_2(result) {
  _$jscoverage['/underscore.js'].branchData['470'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['470'][1].init(47, 18, 'n == null || guard');
function visit129_470_1(result) {
  _$jscoverage['/underscore.js'].branchData['470'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['469'][1].init(9, 13, 'array == null');
function visit128_469_1(result) {
  _$jscoverage['/underscore.js'].branchData['469'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['459'][1].init(12, 4, 'pass');
function visit127_459_1(result) {
  _$jscoverage['/underscore.js'].branchData['459'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['453'][1].init(43, 16, 'isArrayLike(obj)');
function visit126_453_1(result) {
  _$jscoverage['/underscore.js'].branchData['453'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['452'][1].init(9, 11, 'obj == null');
function visit125_452_1(result) {
  _$jscoverage['/underscore.js'].branchData['452'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['446'][1].init(201, 16, 'isArrayLike(obj)');
function visit124_446_1(result) {
  _$jscoverage['/underscore.js'].branchData['446'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['442'][1].init(82, 15, '_.isString(obj)');
function visit123_442_1(result) {
  _$jscoverage['/underscore.js'].branchData['442'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['441'][1].init(34, 14, '_.isArray(obj)');
function visit122_441_1(result) {
  _$jscoverage['/underscore.js'].branchData['441'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['440'][1].init(9, 4, '!obj');
function visit121_440_1(result) {
  _$jscoverage['/underscore.js'].branchData['440'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['434'][1].init(9, 18, '_.has(result, key)');
function visit120_434_1(result) {
  _$jscoverage['/underscore.js'].branchData['434'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['421'][1].init(9, 18, '_.has(result, key)');
function visit119_421_1(result) {
  _$jscoverage['/underscore.js'].branchData['421'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['408'][1].init(20, 9, 'partition');
function visit118_408_1(result) {
  _$jscoverage['/underscore.js'].branchData['408'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['399'][3].init(67, 12, 'b === void 0');
function visit117_399_3(result) {
  _$jscoverage['/underscore.js'].branchData['399'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['399'][2].init(58, 5, 'a < b');
function visit116_399_2(result) {
  _$jscoverage['/underscore.js'].branchData['399'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['399'][1].init(58, 21, 'a < b || b === void 0');
function visit115_399_1(result) {
  _$jscoverage['/underscore.js'].branchData['399'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['398'][3].init(22, 12, 'a === void 0');
function visit114_398_3(result) {
  _$jscoverage['/underscore.js'].branchData['398'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['398'][2].init(13, 5, 'a > b');
function visit113_398_2(result) {
  _$jscoverage['/underscore.js'].branchData['398'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['398'][1].init(13, 21, 'a > b || a === void 0');
function visit112_398_1(result) {
  _$jscoverage['/underscore.js'].branchData['398'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['397'][1].init(70, 7, 'a !== b');
function visit111_397_1(result) {
  _$jscoverage['/underscore.js'].branchData['397'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['375'][1].init(326, 9, 'index < n');
function visit110_375_1(result) {
  _$jscoverage['/underscore.js'].branchData['375'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['371'][1].init(148, 16, 'isArrayLike(obj)');
function visit109_371_1(result) {
  _$jscoverage['/underscore.js'].branchData['371'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['368'][1].init(11, 17, '!isArrayLike(obj)');
function visit108_368_1(result) {
  _$jscoverage['/underscore.js'].branchData['368'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['367'][2].init(9, 9, 'n == null');
function visit107_367_2(result) {
  _$jscoverage['/underscore.js'].branchData['367'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['367'][1].init(9, 18, 'n == null || guard');
function visit106_367_1(result) {
  _$jscoverage['/underscore.js'].branchData['367'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['348'][5].init(110, 19, 'result === Infinity');
function visit105_348_5(result) {
  _$jscoverage['/underscore.js'].branchData['348'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['348'][4].init(85, 21, 'computed === Infinity');
function visit104_348_4(result) {
  _$jscoverage['/underscore.js'].branchData['348'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['348'][3].init(85, 44, 'computed === Infinity && result === Infinity');
function visit103_348_3(result) {
  _$jscoverage['/underscore.js'].branchData['348'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['348'][2].init(58, 23, 'computed < lastComputed');
function visit102_348_2(result) {
  _$jscoverage['/underscore.js'].branchData['348'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['348'][1].init(58, 71, 'computed < lastComputed || computed === Infinity && result === Infinity');
function visit101_348_1(result) {
  _$jscoverage['/underscore.js'].branchData['348'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['340'][3].init(54, 14, 'value < result');
function visit100_340_3(result) {
  _$jscoverage['/underscore.js'].branchData['340'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['340'][2].init(37, 13, 'value != null');
function visit99_340_2(result) {
  _$jscoverage['/underscore.js'].branchData['340'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['340'][1].init(37, 31, 'value != null && value < result');
function visit98_340_1(result) {
  _$jscoverage['/underscore.js'].branchData['340'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['338'][1].init(96, 10, 'i < length');
function visit97_338_1(result) {
  _$jscoverage['/underscore.js'].branchData['338'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['337'][1].init(13, 16, 'isArrayLike(obj)');
function visit96_337_1(result) {
  _$jscoverage['/underscore.js'].branchData['337'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['336'][7].init(168, 11, 'obj != null');
function visit95_336_7(result) {
  _$jscoverage['/underscore.js'].branchData['336'][7].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['336'][6].init(138, 25, 'typeof obj[0] != \'object\'');
function visit94_336_6(result) {
  _$jscoverage['/underscore.js'].branchData['336'][6].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['336'][5].init(107, 27, 'typeof iteratee == \'number\'');
function visit93_336_5(result) {
  _$jscoverage['/underscore.js'].branchData['336'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['336'][4].init(107, 56, 'typeof iteratee == \'number\' && typeof obj[0] != \'object\'');
function visit92_336_4(result) {
  _$jscoverage['/underscore.js'].branchData['336'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['336'][3].init(107, 72, '(typeof iteratee == \'number\' && typeof obj[0] != \'object\') && obj != null');
function visit91_336_3(result) {
  _$jscoverage['/underscore.js'].branchData['336'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['336'][2].init(86, 16, 'iteratee == null');
function visit90_336_2(result) {
  _$jscoverage['/underscore.js'].branchData['336'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['336'][1].init(86, 93, 'iteratee == null || (typeof iteratee == \'number\' && typeof obj[0] != \'object\') && obj != null');
function visit89_336_1(result) {
  _$jscoverage['/underscore.js'].branchData['336'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['323'][5].init(111, 20, 'result === -Infinity');
function visit88_323_5(result) {
  _$jscoverage['/underscore.js'].branchData['323'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['323'][4].init(85, 22, 'computed === -Infinity');
function visit87_323_4(result) {
  _$jscoverage['/underscore.js'].branchData['323'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['323'][3].init(85, 46, 'computed === -Infinity && result === -Infinity');
function visit86_323_3(result) {
  _$jscoverage['/underscore.js'].branchData['323'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['323'][2].init(58, 23, 'computed > lastComputed');
function visit85_323_2(result) {
  _$jscoverage['/underscore.js'].branchData['323'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['323'][1].init(58, 73, 'computed > lastComputed || computed === -Infinity && result === -Infinity');
function visit84_323_1(result) {
  _$jscoverage['/underscore.js'].branchData['323'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['315'][3].init(54, 14, 'value > result');
function visit83_315_3(result) {
  _$jscoverage['/underscore.js'].branchData['315'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['315'][2].init(37, 13, 'value != null');
function visit82_315_2(result) {
  _$jscoverage['/underscore.js'].branchData['315'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['315'][1].init(37, 31, 'value != null && value > result');
function visit81_315_1(result) {
  _$jscoverage['/underscore.js'].branchData['315'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['313'][1].init(96, 10, 'i < length');
function visit80_313_1(result) {
  _$jscoverage['/underscore.js'].branchData['313'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['312'][1].init(13, 16, 'isArrayLike(obj)');
function visit79_312_1(result) {
  _$jscoverage['/underscore.js'].branchData['312'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['311'][7].init(170, 11, 'obj != null');
function visit78_311_7(result) {
  _$jscoverage['/underscore.js'].branchData['311'][7].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['311'][6].init(140, 25, 'typeof obj[0] != \'object\'');
function visit77_311_6(result) {
  _$jscoverage['/underscore.js'].branchData['311'][6].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['311'][5].init(109, 27, 'typeof iteratee == \'number\'');
function visit76_311_5(result) {
  _$jscoverage['/underscore.js'].branchData['311'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['311'][4].init(109, 56, 'typeof iteratee == \'number\' && typeof obj[0] != \'object\'');
function visit75_311_4(result) {
  _$jscoverage['/underscore.js'].branchData['311'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['311'][3].init(109, 72, '(typeof iteratee == \'number\' && typeof obj[0] != \'object\') && obj != null');
function visit74_311_3(result) {
  _$jscoverage['/underscore.js'].branchData['311'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['311'][2].init(88, 16, 'iteratee == null');
function visit73_311_2(result) {
  _$jscoverage['/underscore.js'].branchData['311'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['311'][1].init(88, 93, 'iteratee == null || (typeof iteratee == \'number\' && typeof obj[0] != \'object\') && obj != null');
function visit72_311_1(result) {
  _$jscoverage['/underscore.js'].branchData['311'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['286'][1].init(64, 12, 'func == null');
function visit71_286_1(result) {
  _$jscoverage['/underscore.js'].branchData['286'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['285'][1].init(18, 6, 'isFunc');
function visit70_285_1(result) {
  _$jscoverage['/underscore.js'].branchData['285'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['278'][1].init(122, 36, '_.indexOf(obj, item, fromIndex) >= 0');
function visit69_278_1(result) {
  _$jscoverage['/underscore.js'].branchData['278'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['277'][2].init(57, 28, 'typeof fromIndex != \'number\'');
function visit68_277_2(result) {
  _$jscoverage['/underscore.js'].branchData['277'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['277'][1].init(57, 37, 'typeof fromIndex != \'number\' || guard');
function visit67_277_1(result) {
  _$jscoverage['/underscore.js'].branchData['277'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['276'][1].init(9, 17, '!isArrayLike(obj)');
function visit66_276_1(result) {
  _$jscoverage['/underscore.js'].branchData['276'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['268'][1].init(62, 43, 'predicate(obj[currentKey], currentKey, obj)');
function visit65_268_1(result) {
  _$jscoverage['/underscore.js'].branchData['268'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['267'][1].init(24, 4, 'keys');
function visit64_267_1(result) {
  _$jscoverage['/underscore.js'].branchData['267'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['266'][1].init(153, 14, 'index < length');
function visit63_266_1(result) {
  _$jscoverage['/underscore.js'].branchData['266'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['265'][1].init(62, 11, 'keys || obj');
function visit62_265_1(result) {
  _$jscoverage['/underscore.js'].branchData['265'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['264'][1].init(56, 32, '!isArrayLike(obj) && _.keys(obj)');
function visit61_264_1(result) {
  _$jscoverage['/underscore.js'].branchData['264'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['255'][1].init(62, 44, '!predicate(obj[currentKey], currentKey, obj)');
function visit60_255_1(result) {
  _$jscoverage['/underscore.js'].branchData['255'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['254'][1].init(24, 4, 'keys');
function visit59_254_1(result) {
  _$jscoverage['/underscore.js'].branchData['254'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['253'][1].init(153, 14, 'index < length');
function visit58_253_1(result) {
  _$jscoverage['/underscore.js'].branchData['253'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['252'][1].init(62, 11, 'keys || obj');
function visit57_252_1(result) {
  _$jscoverage['/underscore.js'].branchData['252'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['251'][1].init(56, 32, '!isArrayLike(obj) && _.keys(obj)');
function visit56_251_1(result) {
  _$jscoverage['/underscore.js'].branchData['251'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['237'][1].init(11, 29, 'predicate(value, index, list)');
function visit55_237_1(result) {
  _$jscoverage['/underscore.js'].branchData['237'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['228'][3].init(185, 10, 'key !== -1');
function visit54_228_3(result) {
  _$jscoverage['/underscore.js'].branchData['228'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['228'][2].init(167, 14, 'key !== void 0');
function visit53_228_2(result) {
  _$jscoverage['/underscore.js'].branchData['228'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['228'][1].init(167, 28, 'key !== void 0 && key !== -1');
function visit52_228_1(result) {
  _$jscoverage['/underscore.js'].branchData['228'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['223'][1].init(22, 16, 'isArrayLike(obj)');
function visit51_223_1(result) {
  _$jscoverage['/underscore.js'].branchData['223'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['208'][1].init(21, 21, 'arguments.length >= 3');
function visit50_208_1(result) {
  _$jscoverage['/underscore.js'].branchData['208'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['201'][1].init(26, 4, 'keys');
function visit49_201_1(result) {
  _$jscoverage['/underscore.js'].branchData['201'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['200'][3].init(264, 14, 'index < length');
function visit48_200_3(result) {
  _$jscoverage['/underscore.js'].branchData['200'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['200'][2].init(250, 10, 'index >= 0');
function visit47_200_2(result) {
  _$jscoverage['/underscore.js'].branchData['200'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['200'][1].init(250, 28, 'index >= 0 && index < length');
function visit46_200_1(result) {
  _$jscoverage['/underscore.js'].branchData['200'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['197'][1].init(20, 4, 'keys');
function visit45_197_1(result) {
  _$jscoverage['/underscore.js'].branchData['197'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['196'][1].init(147, 8, '!initial');
function visit44_196_1(result) {
  _$jscoverage['/underscore.js'].branchData['196'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['195'][1].init(103, 7, 'dir > 0');
function visit43_195_1(result) {
  _$jscoverage['/underscore.js'].branchData['195'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['194'][1].init(64, 11, 'keys || obj');
function visit42_194_1(result) {
  _$jscoverage['/underscore.js'].branchData['194'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['193'][1].init(18, 32, '!isArrayLike(obj) && _.keys(obj)');
function visit41_193_1(result) {
  _$jscoverage['/underscore.js'].branchData['193'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['182'][1].init(24, 4, 'keys');
function visit40_182_1(result) {
  _$jscoverage['/underscore.js'].branchData['182'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['181'][1].init(184, 14, 'index < length');
function visit39_181_1(result) {
  _$jscoverage['/underscore.js'].branchData['181'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['179'][1].init(62, 11, 'keys || obj');
function visit38_179_1(result) {
  _$jscoverage['/underscore.js'].branchData['179'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['178'][1].init(54, 32, '!isArrayLike(obj) && _.keys(obj)');
function visit37_178_1(result) {
  _$jscoverage['/underscore.js'].branchData['178'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['168'][1].init(71, 10, 'i < length');
function visit36_168_1(result) {
  _$jscoverage['/underscore.js'].branchData['168'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['163'][1].init(40, 10, 'i < length');
function visit35_163_1(result) {
  _$jscoverage['/underscore.js'].branchData['163'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['162'][1].init(74, 16, 'isArrayLike(obj)');
function visit34_162_1(result) {
  _$jscoverage['/underscore.js'].branchData['162'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['150'][5].init(96, 25, 'length <= MAX_ARRAY_INDEX');
function visit33_150_5(result) {
  _$jscoverage['/underscore.js'].branchData['150'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['150'][4].init(81, 11, 'length >= 0');
function visit32_150_4(result) {
  _$jscoverage['/underscore.js'].branchData['150'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['150'][3].init(81, 40, 'length >= 0 && length <= MAX_ARRAY_INDEX');
function visit31_150_3(result) {
  _$jscoverage['/underscore.js'].branchData['150'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['150'][2].init(52, 25, 'typeof length == \'number\'');
function visit30_150_2(result) {
  _$jscoverage['/underscore.js'].branchData['150'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['150'][1].init(52, 69, 'typeof length == \'number\' && length >= 0 && length <= MAX_ARRAY_INDEX');
function visit29_150_1(result) {
  _$jscoverage['/underscore.js'].branchData['150'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['138'][1].init(14, 11, 'obj == null');
function visit28_138_1(result) {
  _$jscoverage['/underscore.js'].branchData['138'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['129'][1].init(52, 12, 'nativeCreate');
function visit27_129_1(result) {
  _$jscoverage['/underscore.js'].branchData['129'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['128'][1].init(9, 22, '!_.isObject(prototype)');
function visit26_128_1(result) {
  _$jscoverage['/underscore.js'].branchData['128'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['118'][1].init(488, 18, 'index < startIndex');
function visit25_118_1(result) {
  _$jscoverage['/underscore.js'].branchData['118'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['109'][1].init(122, 14, 'index < length');
function visit24_109_1(result) {
  _$jscoverage['/underscore.js'].branchData['109'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['105'][1].init(18, 18, 'startIndex == null');
function visit23_105_1(result) {
  _$jscoverage['/underscore.js'].branchData['105'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['94'][1].init(125, 17, '_.isObject(value)');
function visit22_94_1(result) {
  _$jscoverage['/underscore.js'].branchData['94'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['93'][1].init(51, 19, '_.isFunction(value)');
function visit21_93_1(result) {
  _$jscoverage['/underscore.js'].branchData['93'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['92'][1].init(9, 13, 'value == null');
function visit20_92_1(result) {
  _$jscoverage['/underscore.js'].branchData['92'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['70'][1].init(54, 16, 'argCount == null');
function visit19_70_1(result) {
  _$jscoverage['/underscore.js'].branchData['70'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['69'][1].init(9, 18, 'context === void 0');
function visit18_69_1(result) {
  _$jscoverage['/underscore.js'].branchData['69'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['54'][3].init(41, 34, '!module.nodeType && module.exports');
function visit17_54_3(result) {
  _$jscoverage['/underscore.js'].branchData['54'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['54'][2].init(9, 28, 'typeof module != \'undefined\'');
function visit16_54_2(result) {
  _$jscoverage['/underscore.js'].branchData['54'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['54'][1].init(9, 66, 'typeof module != \'undefined\' && !module.nodeType && module.exports');
function visit15_54_1(result) {
  _$jscoverage['/underscore.js'].branchData['54'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['53'][2].init(1620, 29, 'typeof exports != \'undefined\'');
function visit14_53_2(result) {
  _$jscoverage['/underscore.js'].branchData['53'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['53'][1].init(1620, 50, 'typeof exports != \'undefined\' && !exports.nodeType');
function visit13_53_1(result) {
  _$jscoverage['/underscore.js'].branchData['53'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['44'][1].init(47, 20, '!(this instanceof _)');
function visit12_44_1(result) {
  _$jscoverage['/underscore.js'].branchData['44'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['43'][1].init(9, 16, 'obj instanceof _');
function visit11_43_1(result) {
  _$jscoverage['/underscore.js'].branchData['43'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['15'][5].init(112, 24, 'global.global === global');
function visit10_15_5(result) {
  _$jscoverage['/underscore.js'].branchData['15'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['15'][4].init(28, 34, 'global.global === global && global');
function visit9_15_4(result) {
  _$jscoverage['/underscore.js'].branchData['15'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['15'][3].init(82, 25, 'typeof global == \'object\'');
function visit8_15_3(result) {
  _$jscoverage['/underscore.js'].branchData['15'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['15'][2].init(81, 63, 'typeof global == \'object\' && global.global === global && global');
function visit7_15_2(result) {
  _$jscoverage['/underscore.js'].branchData['15'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['15'][1].init(68, 83, 'typeof global == \'object\' && global.global === global && global || this');
function visit6_15_1(result) {
  _$jscoverage['/underscore.js'].branchData['15'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['14'][5].init(278, 18, 'self.self === self');
function visit5_14_5(result) {
  _$jscoverage['/underscore.js'].branchData['14'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['14'][4].init(278, 26, 'self.self === self && self');
function visit4_14_4(result) {
  _$jscoverage['/underscore.js'].branchData['14'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['14'][3].init(251, 23, 'typeof self == \'object\'');
function visit3_14_3(result) {
  _$jscoverage['/underscore.js'].branchData['14'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['14'][2].init(251, 53, 'typeof self == \'object\' && self.self === self && self');
function visit2_14_2(result) {
  _$jscoverage['/underscore.js'].branchData['14'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['14'][1].init(251, 152, 'typeof self == \'object\' && self.self === self && self || typeof global == \'object\' && global.global === global && global || this');
function visit1_14_1(result) {
  _$jscoverage['/underscore.js'].branchData['14'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].lineData[6]++;
(function() {
  _$jscoverage['/underscore.js'].functionData[0]++;
  _$jscoverage['/underscore.js'].lineData[14]++;
  var root = visit1_14_1(visit2_14_2(visit3_14_3(typeof self == 'object') && visit4_14_4(visit5_14_5(self.self === self) && self)) || visit6_15_1(visit7_15_2(visit8_15_3(typeof global == 'object') && visit9_15_4(visit10_15_5(global.global === global) && global)) || this));
  _$jscoverage['/underscore.js'].lineData[19]++;
  var previousUnderscore = root._;
  _$jscoverage['/underscore.js'].lineData[22]++;
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
  _$jscoverage['/underscore.js'].lineData[25]++;
  var push = ArrayProto.push, slice = ArrayProto.slice, toString = ObjProto.toString, hasOwnProperty = ObjProto.hasOwnProperty;
  _$jscoverage['/underscore.js'].lineData[33]++;
  var nativeIsArray = Array.isArray, nativeKeys = Object.keys, nativeCreate = Object.create;
  _$jscoverage['/underscore.js'].lineData[39]++;
  var Ctor = function() {
  _$jscoverage['/underscore.js'].functionData[1]++;
};
  _$jscoverage['/underscore.js'].lineData[42]++;
  var _ = function(obj) {
  _$jscoverage['/underscore.js'].functionData[2]++;
  _$jscoverage['/underscore.js'].lineData[43]++;
  if (visit11_43_1(obj instanceof _)) 
    return obj;
  _$jscoverage['/underscore.js'].lineData[44]++;
  if (visit12_44_1(!(this instanceof _))) 
    return new _(obj);
  _$jscoverage['/underscore.js'].lineData[45]++;
  this._wrapped = obj;
};
  _$jscoverage['/underscore.js'].lineData[53]++;
  if (visit13_53_1(visit14_53_2(typeof exports != 'undefined') && !exports.nodeType)) {
    _$jscoverage['/underscore.js'].lineData[54]++;
    if (visit15_54_1(visit16_54_2(typeof module != 'undefined') && visit17_54_3(!module.nodeType && module.exports))) {
      _$jscoverage['/underscore.js'].lineData[55]++;
      exports = module.exports = _;
    }
    _$jscoverage['/underscore.js'].lineData[57]++;
    exports._ = _;
  } else {
    _$jscoverage['/underscore.js'].lineData[59]++;
    root._ = _;
  }
  _$jscoverage['/underscore.js'].lineData[63]++;
  _.VERSION = '1.8.3';
  _$jscoverage['/underscore.js'].lineData[68]++;
  var optimizeCb = function(func, context, argCount) {
  _$jscoverage['/underscore.js'].functionData[3]++;
  _$jscoverage['/underscore.js'].lineData[69]++;
  if (visit18_69_1(context === void 0)) 
    return func;
  _$jscoverage['/underscore.js'].lineData[70]++;
  switch (visit19_70_1(argCount == null) ? 3 : argCount) {
    case 1:
      _$jscoverage['/underscore.js'].lineData[71]++;
      return function(value) {
  return func.call(context, value);
};
    case 3:
      _$jscoverage['/underscore.js'].lineData[76]++;
      return function(value, index, collection) {
  return func.call(context, value, index, collection);
};
    case 4:
      _$jscoverage['/underscore.js'].lineData[79]++;
      return function(accumulator, value, index, collection) {
  return func.call(context, accumulator, value, index, collection);
};
  }
  _$jscoverage['/underscore.js'].lineData[83]++;
  return function() {
  _$jscoverage['/underscore.js'].functionData[4]++;
  _$jscoverage['/underscore.js'].lineData[84]++;
  return func.apply(context, arguments);
};
};
  _$jscoverage['/underscore.js'].lineData[91]++;
  var cb = function(value, context, argCount) {
  _$jscoverage['/underscore.js'].functionData[5]++;
  _$jscoverage['/underscore.js'].lineData[92]++;
  if (visit20_92_1(value == null)) 
    return _.identity;
  _$jscoverage['/underscore.js'].lineData[93]++;
  if (visit21_93_1(_.isFunction(value))) 
    return optimizeCb(value, context, argCount);
  _$jscoverage['/underscore.js'].lineData[94]++;
  if (visit22_94_1(_.isObject(value))) 
    return _.matcher(value);
  _$jscoverage['/underscore.js'].lineData[95]++;
  return _.property(value);
};
  _$jscoverage['/underscore.js'].lineData[98]++;
  _.iteratee = function(value, context) {
  _$jscoverage['/underscore.js'].functionData[6]++;
  _$jscoverage['/underscore.js'].lineData[99]++;
  return cb(value, context, Infinity);
};
  _$jscoverage['/underscore.js'].lineData[104]++;
  var restArgs = function(func, startIndex) {
  _$jscoverage['/underscore.js'].functionData[7]++;
  _$jscoverage['/underscore.js'].lineData[105]++;
  startIndex = visit23_105_1(startIndex == null) ? func.length - 1 : +startIndex;
  _$jscoverage['/underscore.js'].lineData[106]++;
  return function() {
  _$jscoverage['/underscore.js'].functionData[8]++;
  _$jscoverage['/underscore.js'].lineData[107]++;
  var length = Math.max(arguments.length - startIndex, 0);
  _$jscoverage['/underscore.js'].lineData[108]++;
  var rest = Array(length);
  _$jscoverage['/underscore.js'].lineData[109]++;
  for (var index = 0; visit24_109_1(index < length); index++) {
    _$jscoverage['/underscore.js'].lineData[110]++;
    rest[index] = arguments[index + startIndex];
  }
  _$jscoverage['/underscore.js'].lineData[112]++;
  switch (startIndex) {
    case 0:
      _$jscoverage['/underscore.js'].lineData[113]++;
      return func.call(this, rest);
    case 1:
      _$jscoverage['/underscore.js'].lineData[114]++;
      return func.call(this, arguments[0], rest);
    case 2:
      _$jscoverage['/underscore.js'].lineData[115]++;
      return func.call(this, arguments[0], arguments[1], rest);
  }
  _$jscoverage['/underscore.js'].lineData[117]++;
  var args = Array(startIndex + 1);
  _$jscoverage['/underscore.js'].lineData[118]++;
  for (index = 0; visit25_118_1(index < startIndex); index++) {
    _$jscoverage['/underscore.js'].lineData[119]++;
    args[index] = arguments[index];
  }
  _$jscoverage['/underscore.js'].lineData[121]++;
  args[startIndex] = rest;
  _$jscoverage['/underscore.js'].lineData[122]++;
  return func.apply(this, args);
};
};
  _$jscoverage['/underscore.js'].lineData[127]++;
  var baseCreate = function(prototype) {
  _$jscoverage['/underscore.js'].functionData[9]++;
  _$jscoverage['/underscore.js'].lineData[128]++;
  if (visit26_128_1(!_.isObject(prototype))) 
    return {};
  _$jscoverage['/underscore.js'].lineData[129]++;
  if (visit27_129_1(nativeCreate)) 
    return nativeCreate(prototype);
  _$jscoverage['/underscore.js'].lineData[130]++;
  Ctor.prototype = prototype;
  _$jscoverage['/underscore.js'].lineData[131]++;
  var result = new Ctor();
  _$jscoverage['/underscore.js'].lineData[132]++;
  Ctor.prototype = null;
  _$jscoverage['/underscore.js'].lineData[133]++;
  return result;
};
  _$jscoverage['/underscore.js'].lineData[136]++;
  var property = function(key) {
  _$jscoverage['/underscore.js'].functionData[10]++;
  _$jscoverage['/underscore.js'].lineData[137]++;
  return function(obj) {
  _$jscoverage['/underscore.js'].functionData[11]++;
  _$jscoverage['/underscore.js'].lineData[138]++;
  return visit28_138_1(obj == null) ? void 0 : obj[key];
};
};
  _$jscoverage['/underscore.js'].lineData[146]++;
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  _$jscoverage['/underscore.js'].lineData[147]++;
  var getLength = property('length');
  _$jscoverage['/underscore.js'].lineData[148]++;
  var isArrayLike = function(collection) {
  _$jscoverage['/underscore.js'].functionData[12]++;
  _$jscoverage['/underscore.js'].lineData[149]++;
  var length = getLength(collection);
  _$jscoverage['/underscore.js'].lineData[150]++;
  return visit29_150_1(visit30_150_2(typeof length == 'number') && visit31_150_3(visit32_150_4(length >= 0) && visit33_150_5(length <= MAX_ARRAY_INDEX)));
};
  _$jscoverage['/underscore.js'].lineData[159]++;
  _.each = _.forEach = function(obj, iteratee, context) {
  _$jscoverage['/underscore.js'].functionData[13]++;
  _$jscoverage['/underscore.js'].lineData[160]++;
  iteratee = optimizeCb(iteratee, context);
  _$jscoverage['/underscore.js'].lineData[161]++;
  var i, length;
  _$jscoverage['/underscore.js'].lineData[162]++;
  if (visit34_162_1(isArrayLike(obj))) {
    _$jscoverage['/underscore.js'].lineData[163]++;
    for (i = 0 , length = obj.length; visit35_163_1(i < length); i++) {
      _$jscoverage['/underscore.js'].lineData[164]++;
      iteratee(obj[i], i, obj);
    }
  } else {
    _$jscoverage['/underscore.js'].lineData[167]++;
    var keys = _.keys(obj);
    _$jscoverage['/underscore.js'].lineData[168]++;
    for (i = 0 , length = keys.length; visit36_168_1(i < length); i++) {
      _$jscoverage['/underscore.js'].lineData[169]++;
      iteratee(obj[keys[i]], keys[i], obj);
    }
  }
  _$jscoverage['/underscore.js'].lineData[172]++;
  return obj;
};
  _$jscoverage['/underscore.js'].lineData[176]++;
  _.map = _.collect = function(obj, iteratee, context) {
  _$jscoverage['/underscore.js'].functionData[14]++;
  _$jscoverage['/underscore.js'].lineData[177]++;
  iteratee = cb(iteratee, context);
  _$jscoverage['/underscore.js'].lineData[178]++;
  var keys = visit37_178_1(!isArrayLike(obj) && _.keys(obj)), length = (visit38_179_1(keys || obj)).length, results = Array(length);
  _$jscoverage['/underscore.js'].lineData[181]++;
  for (var index = 0; visit39_181_1(index < length); index++) {
    _$jscoverage['/underscore.js'].lineData[182]++;
    var currentKey = visit40_182_1(keys) ? keys[index] : index;
    _$jscoverage['/underscore.js'].lineData[183]++;
    results[index] = iteratee(obj[currentKey], currentKey, obj);
  }
  _$jscoverage['/underscore.js'].lineData[185]++;
  return results;
};
  _$jscoverage['/underscore.js'].lineData[189]++;
  var createReduce = function(dir) {
  _$jscoverage['/underscore.js'].functionData[15]++;
  _$jscoverage['/underscore.js'].lineData[192]++;
  var reducer = function(obj, iteratee, memo, initial) {
  _$jscoverage['/underscore.js'].functionData[16]++;
  _$jscoverage['/underscore.js'].lineData[193]++;
  var keys = visit41_193_1(!isArrayLike(obj) && _.keys(obj)), length = (visit42_194_1(keys || obj)).length, index = visit43_195_1(dir > 0) ? 0 : length - 1;
  _$jscoverage['/underscore.js'].lineData[196]++;
  if (visit44_196_1(!initial)) {
    _$jscoverage['/underscore.js'].lineData[197]++;
    memo = obj[visit45_197_1(keys) ? keys[index] : index];
    _$jscoverage['/underscore.js'].lineData[198]++;
    index += dir;
  }
  _$jscoverage['/underscore.js'].lineData[200]++;
  for (; visit46_200_1(visit47_200_2(index >= 0) && visit48_200_3(index < length)); index += dir) {
    _$jscoverage['/underscore.js'].lineData[201]++;
    var currentKey = visit49_201_1(keys) ? keys[index] : index;
    _$jscoverage['/underscore.js'].lineData[202]++;
    memo = iteratee(memo, obj[currentKey], currentKey, obj);
  }
  _$jscoverage['/underscore.js'].lineData[204]++;
  return memo;
};
  _$jscoverage['/underscore.js'].lineData[207]++;
  return function(obj, iteratee, memo, context) {
  _$jscoverage['/underscore.js'].functionData[17]++;
  _$jscoverage['/underscore.js'].lineData[208]++;
  var initial = visit50_208_1(arguments.length >= 3);
  _$jscoverage['/underscore.js'].lineData[209]++;
  return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
};
};
  _$jscoverage['/underscore.js'].lineData[215]++;
  _.reduce = _.foldl = _.inject = createReduce(1);
  _$jscoverage['/underscore.js'].lineData[218]++;
  _.reduceRight = _.foldr = createReduce(-1);
  _$jscoverage['/underscore.js'].lineData[221]++;
  _.find = _.detect = function(obj, predicate, context) {
  _$jscoverage['/underscore.js'].functionData[18]++;
  _$jscoverage['/underscore.js'].lineData[222]++;
  var key;
  _$jscoverage['/underscore.js'].lineData[223]++;
  if (visit51_223_1(isArrayLike(obj))) {
    _$jscoverage['/underscore.js'].lineData[224]++;
    key = _.findIndex(obj, predicate, context);
  } else {
    _$jscoverage['/underscore.js'].lineData[226]++;
    key = _.findKey(obj, predicate, context);
  }
  _$jscoverage['/underscore.js'].lineData[228]++;
  if (visit52_228_1(visit53_228_2(key !== void 0) && visit54_228_3(key !== -1))) 
    return obj[key];
};
  _$jscoverage['/underscore.js'].lineData[233]++;
  _.filter = _.select = function(obj, predicate, context) {
  _$jscoverage['/underscore.js'].functionData[19]++;
  _$jscoverage['/underscore.js'].lineData[234]++;
  var results = [];
  _$jscoverage['/underscore.js'].lineData[235]++;
  predicate = cb(predicate, context);
  _$jscoverage['/underscore.js'].lineData[236]++;
  _.each(obj, function(value, index, list) {
  _$jscoverage['/underscore.js'].functionData[20]++;
  _$jscoverage['/underscore.js'].lineData[237]++;
  if (visit55_237_1(predicate(value, index, list))) 
    results.push(value);
});
  _$jscoverage['/underscore.js'].lineData[239]++;
  return results;
};
  _$jscoverage['/underscore.js'].lineData[243]++;
  _.reject = function(obj, predicate, context) {
  _$jscoverage['/underscore.js'].functionData[21]++;
  _$jscoverage['/underscore.js'].lineData[244]++;
  return _.filter(obj, _.negate(cb(predicate)), context);
};
  _$jscoverage['/underscore.js'].lineData[249]++;
  _.every = _.all = function(obj, predicate, context) {
  _$jscoverage['/underscore.js'].functionData[22]++;
  _$jscoverage['/underscore.js'].lineData[250]++;
  predicate = cb(predicate, context);
  _$jscoverage['/underscore.js'].lineData[251]++;
  var keys = visit56_251_1(!isArrayLike(obj) && _.keys(obj)), length = (visit57_252_1(keys || obj)).length;
  _$jscoverage['/underscore.js'].lineData[253]++;
  for (var index = 0; visit58_253_1(index < length); index++) {
    _$jscoverage['/underscore.js'].lineData[254]++;
    var currentKey = visit59_254_1(keys) ? keys[index] : index;
    _$jscoverage['/underscore.js'].lineData[255]++;
    if (visit60_255_1(!predicate(obj[currentKey], currentKey, obj))) 
      return false;
  }
  _$jscoverage['/underscore.js'].lineData[257]++;
  return true;
};
  _$jscoverage['/underscore.js'].lineData[262]++;
  _.some = _.any = function(obj, predicate, context) {
  _$jscoverage['/underscore.js'].functionData[23]++;
  _$jscoverage['/underscore.js'].lineData[263]++;
  predicate = cb(predicate, context);
  _$jscoverage['/underscore.js'].lineData[264]++;
  var keys = visit61_264_1(!isArrayLike(obj) && _.keys(obj)), length = (visit62_265_1(keys || obj)).length;
  _$jscoverage['/underscore.js'].lineData[266]++;
  for (var index = 0; visit63_266_1(index < length); index++) {
    _$jscoverage['/underscore.js'].lineData[267]++;
    var currentKey = visit64_267_1(keys) ? keys[index] : index;
    _$jscoverage['/underscore.js'].lineData[268]++;
    if (visit65_268_1(predicate(obj[currentKey], currentKey, obj))) 
      return true;
  }
  _$jscoverage['/underscore.js'].lineData[270]++;
  return false;
};
  _$jscoverage['/underscore.js'].lineData[275]++;
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
  _$jscoverage['/underscore.js'].functionData[24]++;
  _$jscoverage['/underscore.js'].lineData[276]++;
  if (visit66_276_1(!isArrayLike(obj))) 
    obj = _.values(obj);
  _$jscoverage['/underscore.js'].lineData[277]++;
  if (visit67_277_1(visit68_277_2(typeof fromIndex != 'number') || guard)) 
    fromIndex = 0;
  _$jscoverage['/underscore.js'].lineData[278]++;
  return visit69_278_1(_.indexOf(obj, item, fromIndex) >= 0);
};
  _$jscoverage['/underscore.js'].lineData[282]++;
  _.invoke = restArgs(function(obj, method, args) {
  _$jscoverage['/underscore.js'].functionData[25]++;
  _$jscoverage['/underscore.js'].lineData[283]++;
  var isFunc = _.isFunction(method);
  _$jscoverage['/underscore.js'].lineData[284]++;
  return _.map(obj, function(value) {
  _$jscoverage['/underscore.js'].functionData[26]++;
  _$jscoverage['/underscore.js'].lineData[285]++;
  var func = visit70_285_1(isFunc) ? method : value[method];
  _$jscoverage['/underscore.js'].lineData[286]++;
  return visit71_286_1(func == null) ? func : func.apply(value, args);
});
});
  _$jscoverage['/underscore.js'].lineData[291]++;
  _.pluck = function(obj, key) {
  _$jscoverage['/underscore.js'].functionData[27]++;
  _$jscoverage['/underscore.js'].lineData[292]++;
  return _.map(obj, _.property(key));
};
  _$jscoverage['/underscore.js'].lineData[297]++;
  _.where = function(obj, attrs) {
  _$jscoverage['/underscore.js'].functionData[28]++;
  _$jscoverage['/underscore.js'].lineData[298]++;
  return _.filter(obj, _.matcher(attrs));
};
  _$jscoverage['/underscore.js'].lineData[303]++;
  _.findWhere = function(obj, attrs) {
  _$jscoverage['/underscore.js'].functionData[29]++;
  _$jscoverage['/underscore.js'].lineData[304]++;
  return _.find(obj, _.matcher(attrs));
};
  _$jscoverage['/underscore.js'].lineData[308]++;
  _.max = function(obj, iteratee, context) {
  _$jscoverage['/underscore.js'].functionData[30]++;
  _$jscoverage['/underscore.js'].lineData[309]++;
  var result = -Infinity, lastComputed = -Infinity, value, computed;
  _$jscoverage['/underscore.js'].lineData[311]++;
  if (visit72_311_1(visit73_311_2(iteratee == null) || visit74_311_3((visit75_311_4(visit76_311_5(typeof iteratee == 'number') && visit77_311_6(typeof obj[0] != 'object'))) && visit78_311_7(obj != null)))) {
    _$jscoverage['/underscore.js'].lineData[312]++;
    obj = visit79_312_1(isArrayLike(obj)) ? obj : _.values(obj);
    _$jscoverage['/underscore.js'].lineData[313]++;
    for (var i = 0, length = obj.length; visit80_313_1(i < length); i++) {
      _$jscoverage['/underscore.js'].lineData[314]++;
      value = obj[i];
      _$jscoverage['/underscore.js'].lineData[315]++;
      if (visit81_315_1(visit82_315_2(value != null) && visit83_315_3(value > result))) {
        _$jscoverage['/underscore.js'].lineData[316]++;
        result = value;
      }
    }
  } else {
    _$jscoverage['/underscore.js'].lineData[320]++;
    iteratee = cb(iteratee, context);
    _$jscoverage['/underscore.js'].lineData[321]++;
    _.each(obj, function(v, index, list) {
  _$jscoverage['/underscore.js'].functionData[31]++;
  _$jscoverage['/underscore.js'].lineData[322]++;
  computed = iteratee(v, index, list);
  _$jscoverage['/underscore.js'].lineData[323]++;
  if (visit84_323_1(visit85_323_2(computed > lastComputed) || visit86_323_3(visit87_323_4(computed === -Infinity) && visit88_323_5(result === -Infinity)))) {
    _$jscoverage['/underscore.js'].lineData[324]++;
    result = v;
    _$jscoverage['/underscore.js'].lineData[325]++;
    lastComputed = computed;
  }
});
  }
  _$jscoverage['/underscore.js'].lineData[329]++;
  return result;
};
  _$jscoverage['/underscore.js'].lineData[333]++;
  _.min = function(obj, iteratee, context) {
  _$jscoverage['/underscore.js'].functionData[32]++;
  _$jscoverage['/underscore.js'].lineData[334]++;
  var result = Infinity, lastComputed = Infinity, value, computed;
  _$jscoverage['/underscore.js'].lineData[336]++;
  if (visit89_336_1(visit90_336_2(iteratee == null) || visit91_336_3((visit92_336_4(visit93_336_5(typeof iteratee == 'number') && visit94_336_6(typeof obj[0] != 'object'))) && visit95_336_7(obj != null)))) {
    _$jscoverage['/underscore.js'].lineData[337]++;
    obj = visit96_337_1(isArrayLike(obj)) ? obj : _.values(obj);
    _$jscoverage['/underscore.js'].lineData[338]++;
    for (var i = 0, length = obj.length; visit97_338_1(i < length); i++) {
      _$jscoverage['/underscore.js'].lineData[339]++;
      value = obj[i];
      _$jscoverage['/underscore.js'].lineData[340]++;
      if (visit98_340_1(visit99_340_2(value != null) && visit100_340_3(value < result))) {
        _$jscoverage['/underscore.js'].lineData[341]++;
        result = value;
      }
    }
  } else {
    _$jscoverage['/underscore.js'].lineData[345]++;
    iteratee = cb(iteratee, context);
    _$jscoverage['/underscore.js'].lineData[346]++;
    _.each(obj, function(v, index, list) {
  _$jscoverage['/underscore.js'].functionData[33]++;
  _$jscoverage['/underscore.js'].lineData[347]++;
  computed = iteratee(v, index, list);
  _$jscoverage['/underscore.js'].lineData[348]++;
  if (visit101_348_1(visit102_348_2(computed < lastComputed) || visit103_348_3(visit104_348_4(computed === Infinity) && visit105_348_5(result === Infinity)))) {
    _$jscoverage['/underscore.js'].lineData[349]++;
    result = v;
    _$jscoverage['/underscore.js'].lineData[350]++;
    lastComputed = computed;
  }
});
  }
  _$jscoverage['/underscore.js'].lineData[354]++;
  return result;
};
  _$jscoverage['/underscore.js'].lineData[358]++;
  _.shuffle = function(obj) {
  _$jscoverage['/underscore.js'].functionData[34]++;
  _$jscoverage['/underscore.js'].lineData[359]++;
  return _.sample(obj, Infinity);
};
  _$jscoverage['/underscore.js'].lineData[366]++;
  _.sample = function(obj, n, guard) {
  _$jscoverage['/underscore.js'].functionData[35]++;
  _$jscoverage['/underscore.js'].lineData[367]++;
  if (visit106_367_1(visit107_367_2(n == null) || guard)) {
    _$jscoverage['/underscore.js'].lineData[368]++;
    if (visit108_368_1(!isArrayLike(obj))) 
      obj = _.values(obj);
    _$jscoverage['/underscore.js'].lineData[369]++;
    return obj[_.random(obj.length - 1)];
  }
  _$jscoverage['/underscore.js'].lineData[371]++;
  var sample = visit109_371_1(isArrayLike(obj)) ? _.clone(obj) : _.values(obj);
  _$jscoverage['/underscore.js'].lineData[372]++;
  var length = getLength(sample);
  _$jscoverage['/underscore.js'].lineData[373]++;
  n = Math.max(Math.min(n, length), 0);
  _$jscoverage['/underscore.js'].lineData[374]++;
  var last = length - 1;
  _$jscoverage['/underscore.js'].lineData[375]++;
  for (var index = 0; visit110_375_1(index < n); index++) {
    _$jscoverage['/underscore.js'].lineData[376]++;
    var rand = _.random(index, last);
    _$jscoverage['/underscore.js'].lineData[377]++;
    var temp = sample[index];
    _$jscoverage['/underscore.js'].lineData[378]++;
    sample[index] = sample[rand];
    _$jscoverage['/underscore.js'].lineData[379]++;
    sample[rand] = temp;
  }
  _$jscoverage['/underscore.js'].lineData[381]++;
  return sample.slice(0, n);
};
  _$jscoverage['/underscore.js'].lineData[385]++;
  _.sortBy = function(obj, iteratee, context) {
  _$jscoverage['/underscore.js'].functionData[36]++;
  _$jscoverage['/underscore.js'].lineData[386]++;
  var index = 0;
  _$jscoverage['/underscore.js'].lineData[387]++;
  iteratee = cb(iteratee, context);
  _$jscoverage['/underscore.js'].lineData[388]++;
  return _.pluck(_.map(obj, function(value, key, list) {
  _$jscoverage['/underscore.js'].functionData[37]++;
  _$jscoverage['/underscore.js'].lineData[389]++;
  return {
  value: value, 
  index: index++, 
  criteria: iteratee(value, key, list)};
}).sort(function(left, right) {
  _$jscoverage['/underscore.js'].functionData[38]++;
  _$jscoverage['/underscore.js'].lineData[395]++;
  var a = left.criteria;
  _$jscoverage['/underscore.js'].lineData[396]++;
  var b = right.criteria;
  _$jscoverage['/underscore.js'].lineData[397]++;
  if (visit111_397_1(a !== b)) {
    _$jscoverage['/underscore.js'].lineData[398]++;
    if (visit112_398_1(visit113_398_2(a > b) || visit114_398_3(a === void 0))) 
      return 1;
    _$jscoverage['/underscore.js'].lineData[399]++;
    if (visit115_399_1(visit116_399_2(a < b) || visit117_399_3(b === void 0))) 
      return -1;
  }
  _$jscoverage['/underscore.js'].lineData[401]++;
  return left.index - right.index;
}), 'value');
};
  _$jscoverage['/underscore.js'].lineData[406]++;
  var group = function(behavior, partition) {
  _$jscoverage['/underscore.js'].functionData[39]++;
  _$jscoverage['/underscore.js'].lineData[407]++;
  return function(obj, iteratee, context) {
  _$jscoverage['/underscore.js'].functionData[40]++;
  _$jscoverage['/underscore.js'].lineData[408]++;
  var result = visit118_408_1(partition) ? [[], []] : {};
  _$jscoverage['/underscore.js'].lineData[409]++;
  iteratee = cb(iteratee, context);
  _$jscoverage['/underscore.js'].lineData[410]++;
  _.each(obj, function(value, index) {
  _$jscoverage['/underscore.js'].functionData[41]++;
  _$jscoverage['/underscore.js'].lineData[411]++;
  var key = iteratee(value, index, obj);
  _$jscoverage['/underscore.js'].lineData[412]++;
  behavior(result, value, key);
});
  _$jscoverage['/underscore.js'].lineData[414]++;
  return result;
};
};
  _$jscoverage['/underscore.js'].lineData[420]++;
  _.groupBy = group(function(result, value, key) {
  _$jscoverage['/underscore.js'].functionData[42]++;
  _$jscoverage['/underscore.js'].lineData[421]++;
  if (visit119_421_1(_.has(result, key))) 
    result[key].push(value);
  else 
    result[key] = [value];
});
  _$jscoverage['/underscore.js'].lineData[426]++;
  _.indexBy = group(function(result, value, key) {
  _$jscoverage['/underscore.js'].functionData[43]++;
  _$jscoverage['/underscore.js'].lineData[427]++;
  result[key] = value;
});
  _$jscoverage['/underscore.js'].lineData[433]++;
  _.countBy = group(function(result, value, key) {
  _$jscoverage['/underscore.js'].functionData[44]++;
  _$jscoverage['/underscore.js'].lineData[434]++;
  if (visit120_434_1(_.has(result, key))) 
    result[key]++;
  else 
    result[key] = 1;
});
  _$jscoverage['/underscore.js'].lineData[437]++;
  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  _$jscoverage['/underscore.js'].lineData[439]++;
  _.toArray = function(obj) {
  _$jscoverage['/underscore.js'].functionData[45]++;
  _$jscoverage['/underscore.js'].lineData[440]++;
  if (visit121_440_1(!obj)) 
    return [];
  _$jscoverage['/underscore.js'].lineData[441]++;
  if (visit122_441_1(_.isArray(obj))) 
    return slice.call(obj);
  _$jscoverage['/underscore.js'].lineData[442]++;
  if (visit123_442_1(_.isString(obj))) {
    _$jscoverage['/underscore.js'].lineData[444]++;
    return obj.match(reStrSymbol);
  }
  _$jscoverage['/underscore.js'].lineData[446]++;
  if (visit124_446_1(isArrayLike(obj))) 
    return _.map(obj, _.identity);
  _$jscoverage['/underscore.js'].lineData[447]++;
  return _.values(obj);
};
  _$jscoverage['/underscore.js'].lineData[451]++;
  _.size = function(obj) {
  _$jscoverage['/underscore.js'].functionData[46]++;
  _$jscoverage['/underscore.js'].lineData[452]++;
  if (visit125_452_1(obj == null)) 
    return 0;
  _$jscoverage['/underscore.js'].lineData[453]++;
  return visit126_453_1(isArrayLike(obj)) ? obj.length : _.keys(obj).length;
};
  _$jscoverage['/underscore.js'].lineData[458]++;
  _.partition = group(function(result, value, pass) {
  _$jscoverage['/underscore.js'].functionData[47]++;
  _$jscoverage['/underscore.js'].lineData[459]++;
  result[visit127_459_1(pass) ? 0 : 1].push(value);
}, true);
  _$jscoverage['/underscore.js'].lineData[468]++;
  _.first = _.head = _.take = function(array, n, guard) {
  _$jscoverage['/underscore.js'].functionData[48]++;
  _$jscoverage['/underscore.js'].lineData[469]++;
  if (visit128_469_1(array == null)) 
    return void 0;
  _$jscoverage['/underscore.js'].lineData[470]++;
  if (visit129_470_1(visit130_470_2(n == null) || guard)) 
    return array[0];
  _$jscoverage['/underscore.js'].lineData[471]++;
  return _.initial(array, array.length - n);
};
  _$jscoverage['/underscore.js'].lineData[477]++;
  _.initial = function(array, n, guard) {
  _$jscoverage['/underscore.js'].functionData[49]++;
  _$jscoverage['/underscore.js'].lineData[478]++;
  return slice.call(array, 0, Math.max(0, array.length - (visit131_478_1(visit132_478_2(n == null) || guard) ? 1 : n)));
};
  _$jscoverage['/underscore.js'].lineData[483]++;
  _.last = function(array, n, guard) {
  _$jscoverage['/underscore.js'].functionData[50]++;
  _$jscoverage['/underscore.js'].lineData[484]++;
  if (visit133_484_1(array == null)) 
    return void 0;
  _$jscoverage['/underscore.js'].lineData[485]++;
  if (visit134_485_1(visit135_485_2(n == null) || guard)) 
    return array[array.length - 1];
  _$jscoverage['/underscore.js'].lineData[486]++;
  return _.rest(array, Math.max(0, array.length - n));
};
  _$jscoverage['/underscore.js'].lineData[492]++;
  _.rest = _.tail = _.drop = function(array, n, guard) {
  _$jscoverage['/underscore.js'].functionData[51]++;
  _$jscoverage['/underscore.js'].lineData[493]++;
  return slice.call(array, visit136_493_1(visit137_493_2(n == null) || guard) ? 1 : n);
};
  _$jscoverage['/underscore.js'].lineData[497]++;
  _.compact = function(array) {
  _$jscoverage['/underscore.js'].functionData[52]++;
  _$jscoverage['/underscore.js'].lineData[498]++;
  return _.filter(array, _.identity);
};
  _$jscoverage['/underscore.js'].lineData[502]++;
  var flatten = function(input, shallow, strict, output) {
  _$jscoverage['/underscore.js'].functionData[53]++;
  _$jscoverage['/underscore.js'].lineData[503]++;
  output = visit138_503_1(output || []);
  _$jscoverage['/underscore.js'].lineData[504]++;
  var idx = output.length;
  _$jscoverage['/underscore.js'].lineData[505]++;
  for (var i = 0, length = getLength(input); visit139_505_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[506]++;
    var value = input[i];
    _$jscoverage['/underscore.js'].lineData[507]++;
    if (visit140_507_1(isArrayLike(value) && (visit141_507_2(_.isArray(value) || _.isArguments(value))))) {
      _$jscoverage['/underscore.js'].lineData[509]++;
      if (visit142_509_1(shallow)) {
        _$jscoverage['/underscore.js'].lineData[510]++;
        var j = 0, len = value.length;
        _$jscoverage['/underscore.js'].lineData[511]++;
        while (visit143_511_1(j < len)) 
          output[idx++] = value[j++];
      } else {
        _$jscoverage['/underscore.js'].lineData[513]++;
        flatten(value, shallow, strict, output);
        _$jscoverage['/underscore.js'].lineData[514]++;
        idx = output.length;
      }
    } else {
      _$jscoverage['/underscore.js'].lineData[516]++;
      if (visit144_516_1(!strict)) {
        _$jscoverage['/underscore.js'].lineData[517]++;
        output[idx++] = value;
      }
    }
  }
  _$jscoverage['/underscore.js'].lineData[520]++;
  return output;
};
  _$jscoverage['/underscore.js'].lineData[524]++;
  _.flatten = function(array, shallow) {
  _$jscoverage['/underscore.js'].functionData[54]++;
  _$jscoverage['/underscore.js'].lineData[525]++;
  return flatten(array, shallow, false);
};
  _$jscoverage['/underscore.js'].lineData[529]++;
  _.without = restArgs(function(array, otherArrays) {
  _$jscoverage['/underscore.js'].functionData[55]++;
  _$jscoverage['/underscore.js'].lineData[530]++;
  return _.difference(array, otherArrays);
});
  _$jscoverage['/underscore.js'].lineData[536]++;
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
  _$jscoverage['/underscore.js'].functionData[56]++;
  _$jscoverage['/underscore.js'].lineData[537]++;
  if (visit145_537_1(!_.isBoolean(isSorted))) {
    _$jscoverage['/underscore.js'].lineData[538]++;
    context = iteratee;
    _$jscoverage['/underscore.js'].lineData[539]++;
    iteratee = isSorted;
    _$jscoverage['/underscore.js'].lineData[540]++;
    isSorted = false;
  }
  _$jscoverage['/underscore.js'].lineData[542]++;
  if (visit146_542_1(iteratee != null)) 
    iteratee = cb(iteratee, context);
  _$jscoverage['/underscore.js'].lineData[543]++;
  var result = [];
  _$jscoverage['/underscore.js'].lineData[544]++;
  var seen = [];
  _$jscoverage['/underscore.js'].lineData[545]++;
  for (var i = 0, length = getLength(array); visit147_545_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[546]++;
    var value = array[i], computed = visit148_547_1(iteratee) ? iteratee(value, i, array) : value;
    _$jscoverage['/underscore.js'].lineData[548]++;
    if (visit149_548_1(isSorted)) {
      _$jscoverage['/underscore.js'].lineData[549]++;
      if (visit150_549_1(!i || visit151_549_2(seen !== computed))) 
        result.push(value);
      _$jscoverage['/underscore.js'].lineData[550]++;
      seen = computed;
    } else {
      _$jscoverage['/underscore.js'].lineData[551]++;
      if (visit152_551_1(iteratee)) {
        _$jscoverage['/underscore.js'].lineData[552]++;
        if (visit153_552_1(!_.contains(seen, computed))) {
          _$jscoverage['/underscore.js'].lineData[553]++;
          seen.push(computed);
          _$jscoverage['/underscore.js'].lineData[554]++;
          result.push(value);
        }
      } else {
        _$jscoverage['/underscore.js'].lineData[556]++;
        if (visit154_556_1(!_.contains(result, value))) {
          _$jscoverage['/underscore.js'].lineData[557]++;
          result.push(value);
        }
      }
    }
  }
  _$jscoverage['/underscore.js'].lineData[560]++;
  return result;
};
  _$jscoverage['/underscore.js'].lineData[565]++;
  _.union = restArgs(function(arrays) {
  _$jscoverage['/underscore.js'].functionData[57]++;
  _$jscoverage['/underscore.js'].lineData[566]++;
  return _.uniq(flatten(arrays, true, true));
});
  _$jscoverage['/underscore.js'].lineData[571]++;
  _.intersection = function(array) {
  _$jscoverage['/underscore.js'].functionData[58]++;
  _$jscoverage['/underscore.js'].lineData[572]++;
  var result = [];
  _$jscoverage['/underscore.js'].lineData[573]++;
  var argsLength = arguments.length;
  _$jscoverage['/underscore.js'].lineData[574]++;
  for (var i = 0, length = getLength(array); visit155_574_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[575]++;
    var item = array[i];
    _$jscoverage['/underscore.js'].lineData[576]++;
    if (visit156_576_1(_.contains(result, item))) 
      continue;
    _$jscoverage['/underscore.js'].lineData[577]++;
    var j;
    _$jscoverage['/underscore.js'].lineData[578]++;
    for (j = 1; visit157_578_1(j < argsLength); j++) {
      _$jscoverage['/underscore.js'].lineData[579]++;
      if (visit158_579_1(!_.contains(arguments[j], item))) 
        break;
    }
    _$jscoverage['/underscore.js'].lineData[581]++;
    if (visit159_581_1(j === argsLength)) 
      result.push(item);
  }
  _$jscoverage['/underscore.js'].lineData[583]++;
  return result;
};
  _$jscoverage['/underscore.js'].lineData[588]++;
  _.difference = restArgs(function(array, rest) {
  _$jscoverage['/underscore.js'].functionData[59]++;
  _$jscoverage['/underscore.js'].lineData[589]++;
  rest = flatten(rest, true, true);
  _$jscoverage['/underscore.js'].lineData[590]++;
  return _.filter(array, function(value) {
  _$jscoverage['/underscore.js'].functionData[60]++;
  _$jscoverage['/underscore.js'].lineData[591]++;
  return !_.contains(rest, value);
});
});
  _$jscoverage['/underscore.js'].lineData[597]++;
  _.unzip = function(array) {
  _$jscoverage['/underscore.js'].functionData[61]++;
  _$jscoverage['/underscore.js'].lineData[598]++;
  var length = visit160_598_1(visit161_598_2(array && _.max(array, getLength).length) || 0);
  _$jscoverage['/underscore.js'].lineData[599]++;
  var result = Array(length);
  _$jscoverage['/underscore.js'].lineData[601]++;
  for (var index = 0; visit162_601_1(index < length); index++) {
    _$jscoverage['/underscore.js'].lineData[602]++;
    result[index] = _.pluck(array, index);
  }
  _$jscoverage['/underscore.js'].lineData[604]++;
  return result;
};
  _$jscoverage['/underscore.js'].lineData[609]++;
  _.zip = restArgs(_.unzip);
  _$jscoverage['/underscore.js'].lineData[614]++;
  _.object = function(list, values) {
  _$jscoverage['/underscore.js'].functionData[62]++;
  _$jscoverage['/underscore.js'].lineData[615]++;
  var result = {};
  _$jscoverage['/underscore.js'].lineData[616]++;
  for (var i = 0, length = getLength(list); visit163_616_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[617]++;
    if (visit164_617_1(values)) {
      _$jscoverage['/underscore.js'].lineData[618]++;
      result[list[i]] = values[i];
    } else {
      _$jscoverage['/underscore.js'].lineData[620]++;
      result[list[i][0]] = list[i][1];
    }
  }
  _$jscoverage['/underscore.js'].lineData[623]++;
  return result;
};
  _$jscoverage['/underscore.js'].lineData[627]++;
  var createPredicateIndexFinder = function(dir) {
  _$jscoverage['/underscore.js'].functionData[63]++;
  _$jscoverage['/underscore.js'].lineData[628]++;
  return function(array, predicate, context) {
  _$jscoverage['/underscore.js'].functionData[64]++;
  _$jscoverage['/underscore.js'].lineData[629]++;
  predicate = cb(predicate, context);
  _$jscoverage['/underscore.js'].lineData[630]++;
  var length = getLength(array);
  _$jscoverage['/underscore.js'].lineData[631]++;
  var index = visit165_631_1(dir > 0) ? 0 : length - 1;
  _$jscoverage['/underscore.js'].lineData[632]++;
  for (; visit166_632_1(visit167_632_2(index >= 0) && visit168_632_3(index < length)); index += dir) {
    _$jscoverage['/underscore.js'].lineData[633]++;
    if (visit169_633_1(predicate(array[index], index, array))) 
      return index;
  }
  _$jscoverage['/underscore.js'].lineData[635]++;
  return -1;
};
};
  _$jscoverage['/underscore.js'].lineData[640]++;
  _.findIndex = createPredicateIndexFinder(1);
  _$jscoverage['/underscore.js'].lineData[641]++;
  _.findLastIndex = createPredicateIndexFinder(-1);
  _$jscoverage['/underscore.js'].lineData[645]++;
  _.sortedIndex = function(array, obj, iteratee, context) {
  _$jscoverage['/underscore.js'].functionData[65]++;
  _$jscoverage['/underscore.js'].lineData[646]++;
  iteratee = cb(iteratee, context, 1);
  _$jscoverage['/underscore.js'].lineData[647]++;
  var value = iteratee(obj);
  _$jscoverage['/underscore.js'].lineData[648]++;
  var low = 0, high = getLength(array);
  _$jscoverage['/underscore.js'].lineData[649]++;
  while (visit170_649_1(low < high)) {
    _$jscoverage['/underscore.js'].lineData[650]++;
    var mid = Math.floor((low + high) / 2);
    _$jscoverage['/underscore.js'].lineData[651]++;
    if (visit171_651_1(iteratee(array[mid]) < value)) 
      low = mid + 1;
    else 
      high = mid;
  }
  _$jscoverage['/underscore.js'].lineData[653]++;
  return low;
};
  _$jscoverage['/underscore.js'].lineData[657]++;
  var createIndexFinder = function(dir, predicateFind, sortedIndex) {
  _$jscoverage['/underscore.js'].functionData[66]++;
  _$jscoverage['/underscore.js'].lineData[658]++;
  return function(array, item, idx) {
  _$jscoverage['/underscore.js'].functionData[67]++;
  _$jscoverage['/underscore.js'].lineData[659]++;
  var i = 0, length = getLength(array);
  _$jscoverage['/underscore.js'].lineData[660]++;
  if (visit172_660_1(typeof idx == 'number')) {
    _$jscoverage['/underscore.js'].lineData[661]++;
    if (visit173_661_1(dir > 0)) {
      _$jscoverage['/underscore.js'].lineData[662]++;
      i = visit174_662_1(idx >= 0) ? idx : Math.max(idx + length, i);
    } else {
      _$jscoverage['/underscore.js'].lineData[664]++;
      length = visit175_664_1(idx >= 0) ? Math.min(idx + 1, length) : idx + length + 1;
    }
  } else {
    _$jscoverage['/underscore.js'].lineData[666]++;
    if (visit176_666_1(sortedIndex && visit177_666_2(idx && length))) {
      _$jscoverage['/underscore.js'].lineData[667]++;
      idx = sortedIndex(array, item);
      _$jscoverage['/underscore.js'].lineData[668]++;
      return visit178_668_1(array[idx] === item) ? idx : -1;
    }
  }
  _$jscoverage['/underscore.js'].lineData[670]++;
  if (visit179_670_1(item !== item)) {
    _$jscoverage['/underscore.js'].lineData[671]++;
    idx = predicateFind(slice.call(array, i, length), _.isNaN);
    _$jscoverage['/underscore.js'].lineData[672]++;
    return visit180_672_1(idx >= 0) ? idx + i : -1;
  }
  _$jscoverage['/underscore.js'].lineData[674]++;
  for (idx = visit181_674_1(dir > 0) ? i : length - 1; visit182_674_2(visit183_674_3(idx >= 0) && visit184_674_4(idx < length)); idx += dir) {
    _$jscoverage['/underscore.js'].lineData[675]++;
    if (visit185_675_1(array[idx] === item)) 
      return idx;
  }
  _$jscoverage['/underscore.js'].lineData[677]++;
  return -1;
};
};
  _$jscoverage['/underscore.js'].lineData[685]++;
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _$jscoverage['/underscore.js'].lineData[686]++;
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);
  _$jscoverage['/underscore.js'].lineData[691]++;
  _.range = function(start, stop, step) {
  _$jscoverage['/underscore.js'].functionData[68]++;
  _$jscoverage['/underscore.js'].lineData[692]++;
  if (visit186_692_1(stop == null)) {
    _$jscoverage['/underscore.js'].lineData[693]++;
    stop = visit187_693_1(start || 0);
    _$jscoverage['/underscore.js'].lineData[694]++;
    start = 0;
  }
  _$jscoverage['/underscore.js'].lineData[696]++;
  step = visit188_696_1(step || 1);
  _$jscoverage['/underscore.js'].lineData[698]++;
  var length = Math.max(Math.ceil((stop - start) / step), 0);
  _$jscoverage['/underscore.js'].lineData[699]++;
  var range = Array(length);
  _$jscoverage['/underscore.js'].lineData[701]++;
  for (var idx = 0; visit189_701_1(idx < length); idx++ , start += step) {
    _$jscoverage['/underscore.js'].lineData[702]++;
    range[idx] = start;
  }
  _$jscoverage['/underscore.js'].lineData[705]++;
  return range;
};
  _$jscoverage['/underscore.js'].lineData[710]++;
  _.chunk = function(array, count) {
  _$jscoverage['/underscore.js'].functionData[69]++;
  _$jscoverage['/underscore.js'].lineData[711]++;
  if (visit190_711_1(visit191_711_2(count == null) || visit192_711_3(count < 1))) 
    return [];
  _$jscoverage['/underscore.js'].lineData[713]++;
  var result = [];
  _$jscoverage['/underscore.js'].lineData[714]++;
  var i = 0, length = array.length;
  _$jscoverage['/underscore.js'].lineData[715]++;
  while (visit193_715_1(i < length)) {
    _$jscoverage['/underscore.js'].lineData[716]++;
    result.push(slice.call(array, i, i += count));
  }
  _$jscoverage['/underscore.js'].lineData[718]++;
  return result;
};
  _$jscoverage['/underscore.js'].lineData[726]++;
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
  _$jscoverage['/underscore.js'].functionData[70]++;
  _$jscoverage['/underscore.js'].lineData[727]++;
  if (visit194_727_1(!(callingContext instanceof boundFunc))) 
    return sourceFunc.apply(context, args);
  _$jscoverage['/underscore.js'].lineData[728]++;
  var self = baseCreate(sourceFunc.prototype);
  _$jscoverage['/underscore.js'].lineData[729]++;
  var result = sourceFunc.apply(self, args);
  _$jscoverage['/underscore.js'].lineData[730]++;
  if (visit195_730_1(_.isObject(result))) 
    return result;
  _$jscoverage['/underscore.js'].lineData[731]++;
  return self;
};
  _$jscoverage['/underscore.js'].lineData[737]++;
  _.bind = restArgs(function(func, context, args) {
  _$jscoverage['/underscore.js'].functionData[71]++;
  _$jscoverage['/underscore.js'].lineData[738]++;
  if (visit196_738_1(!_.isFunction(func))) 
    throw new TypeError('Bind must be called on a function');
  _$jscoverage['/underscore.js'].lineData[739]++;
  var bound = restArgs(function(callArgs) {
  _$jscoverage['/underscore.js'].functionData[72]++;
  _$jscoverage['/underscore.js'].lineData[740]++;
  return executeBound(func, bound, context, this, args.concat(callArgs));
});
  _$jscoverage['/underscore.js'].lineData[742]++;
  return bound;
});
  _$jscoverage['/underscore.js'].lineData[749]++;
  _.partial = restArgs(function(func, boundArgs) {
  _$jscoverage['/underscore.js'].functionData[73]++;
  _$jscoverage['/underscore.js'].lineData[750]++;
  var placeholder = _.partial.placeholder;
  _$jscoverage['/underscore.js'].lineData[751]++;
  var bound = function() {
  _$jscoverage['/underscore.js'].functionData[74]++;
  _$jscoverage['/underscore.js'].lineData[752]++;
  var position = 0, length = boundArgs.length;
  _$jscoverage['/underscore.js'].lineData[753]++;
  var args = Array(length);
  _$jscoverage['/underscore.js'].lineData[754]++;
  for (var i = 0; visit197_754_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[755]++;
    args[i] = visit198_755_1(boundArgs[i] === placeholder) ? arguments[position++] : boundArgs[i];
  }
  _$jscoverage['/underscore.js'].lineData[757]++;
  while (visit199_757_1(position < arguments.length)) 
    args.push(arguments[position++]);
  _$jscoverage['/underscore.js'].lineData[758]++;
  return executeBound(func, bound, this, this, args);
};
  _$jscoverage['/underscore.js'].lineData[760]++;
  return bound;
});
  _$jscoverage['/underscore.js'].lineData[763]++;
  _.partial.placeholder = _;
  _$jscoverage['/underscore.js'].lineData[768]++;
  _.bindAll = restArgs(function(obj, keys) {
  _$jscoverage['/underscore.js'].functionData[75]++;
  _$jscoverage['/underscore.js'].lineData[769]++;
  keys = flatten(keys, false, false);
  _$jscoverage['/underscore.js'].lineData[770]++;
  var index = keys.length;
  _$jscoverage['/underscore.js'].lineData[771]++;
  if (visit200_771_1(index < 1)) 
    throw new Error('bindAll must be passed function names');
  _$jscoverage['/underscore.js'].lineData[772]++;
  while (visit201_772_1(index--)) {
    _$jscoverage['/underscore.js'].lineData[773]++;
    var key = keys[index];
    _$jscoverage['/underscore.js'].lineData[774]++;
    obj[key] = _.bind(obj[key], obj);
  }
});
  _$jscoverage['/underscore.js'].lineData[779]++;
  _.memoize = function(func, hasher) {
  _$jscoverage['/underscore.js'].functionData[76]++;
  _$jscoverage['/underscore.js'].lineData[780]++;
  var memoize = function(key) {
  _$jscoverage['/underscore.js'].functionData[77]++;
  _$jscoverage['/underscore.js'].lineData[781]++;
  var cache = memoize.cache;
  _$jscoverage['/underscore.js'].lineData[782]++;
  var address = '' + (visit202_782_1(hasher) ? hasher.apply(this, arguments) : key);
  _$jscoverage['/underscore.js'].lineData[783]++;
  if (visit203_783_1(!_.has(cache, address))) 
    cache[address] = func.apply(this, arguments);
  _$jscoverage['/underscore.js'].lineData[784]++;
  return cache[address];
};
  _$jscoverage['/underscore.js'].lineData[786]++;
  memoize.cache = {};
  _$jscoverage['/underscore.js'].lineData[787]++;
  return memoize;
};
  _$jscoverage['/underscore.js'].lineData[792]++;
  _.delay = restArgs(function(func, wait, args) {
  _$jscoverage['/underscore.js'].functionData[78]++;
  _$jscoverage['/underscore.js'].lineData[793]++;
  return setTimeout(function() {
  _$jscoverage['/underscore.js'].functionData[79]++;
  _$jscoverage['/underscore.js'].lineData[794]++;
  return func.apply(null, args);
}, wait);
});
  _$jscoverage['/underscore.js'].lineData[800]++;
  _.defer = _.partial(_.delay, _, 1);
  _$jscoverage['/underscore.js'].lineData[807]++;
  _.throttle = function(func, wait, options) {
  _$jscoverage['/underscore.js'].functionData[80]++;
  _$jscoverage['/underscore.js'].lineData[808]++;
  var timeout, context, args, result;
  _$jscoverage['/underscore.js'].lineData[809]++;
  var previous = 0;
  _$jscoverage['/underscore.js'].lineData[810]++;
  if (visit204_810_1(!options)) 
    options = {};
  _$jscoverage['/underscore.js'].lineData[812]++;
  var later = function() {
  _$jscoverage['/underscore.js'].functionData[81]++;
  _$jscoverage['/underscore.js'].lineData[813]++;
  previous = visit205_813_1(options.leading === false) ? 0 : _.now();
  _$jscoverage['/underscore.js'].lineData[814]++;
  timeout = null;
  _$jscoverage['/underscore.js'].lineData[815]++;
  result = func.apply(context, args);
  _$jscoverage['/underscore.js'].lineData[816]++;
  if (visit206_816_1(!timeout)) 
    context = args = null;
};
  _$jscoverage['/underscore.js'].lineData[819]++;
  var throttled = function() {
  _$jscoverage['/underscore.js'].functionData[82]++;
  _$jscoverage['/underscore.js'].lineData[820]++;
  var now = _.now();
  _$jscoverage['/underscore.js'].lineData[821]++;
  if (visit207_821_1(!previous && visit208_821_2(options.leading === false))) 
    previous = now;
  _$jscoverage['/underscore.js'].lineData[822]++;
  var remaining = wait - (now - previous);
  _$jscoverage['/underscore.js'].lineData[823]++;
  context = this;
  _$jscoverage['/underscore.js'].lineData[824]++;
  args = arguments;
  _$jscoverage['/underscore.js'].lineData[825]++;
  if (visit209_825_1(visit210_825_2(remaining <= 0) || visit211_825_3(remaining > wait))) {
    _$jscoverage['/underscore.js'].lineData[826]++;
    if (visit212_826_1(timeout)) {
      _$jscoverage['/underscore.js'].lineData[827]++;
      clearTimeout(timeout);
      _$jscoverage['/underscore.js'].lineData[828]++;
      timeout = null;
    }
    _$jscoverage['/underscore.js'].lineData[830]++;
    previous = now;
    _$jscoverage['/underscore.js'].lineData[831]++;
    result = func.apply(context, args);
    _$jscoverage['/underscore.js'].lineData[832]++;
    if (visit213_832_1(!timeout)) 
      context = args = null;
  } else {
    _$jscoverage['/underscore.js'].lineData[833]++;
    if (visit214_833_1(!timeout && visit215_833_2(options.trailing !== false))) {
      _$jscoverage['/underscore.js'].lineData[834]++;
      timeout = setTimeout(later, remaining);
    }
  }
  _$jscoverage['/underscore.js'].lineData[836]++;
  return result;
};
  _$jscoverage['/underscore.js'].lineData[839]++;
  throttled.clear = function() {
  _$jscoverage['/underscore.js'].functionData[83]++;
  _$jscoverage['/underscore.js'].lineData[840]++;
  clearTimeout(timeout);
  _$jscoverage['/underscore.js'].lineData[841]++;
  previous = 0;
  _$jscoverage['/underscore.js'].lineData[842]++;
  timeout = context = args = null;
};
  _$jscoverage['/underscore.js'].lineData[845]++;
  return throttled;
};
  _$jscoverage['/underscore.js'].lineData[852]++;
  _.debounce = function(func, wait, immediate) {
  _$jscoverage['/underscore.js'].functionData[84]++;
  _$jscoverage['/underscore.js'].lineData[853]++;
  var timeout, result;
  _$jscoverage['/underscore.js'].lineData[855]++;
  var later = function(context, args) {
  _$jscoverage['/underscore.js'].functionData[85]++;
  _$jscoverage['/underscore.js'].lineData[856]++;
  timeout = null;
  _$jscoverage['/underscore.js'].lineData[857]++;
  if (visit216_857_1(args)) 
    result = func.apply(context, args);
};
  _$jscoverage['/underscore.js'].lineData[860]++;
  var debounced = restArgs(function(args) {
  _$jscoverage['/underscore.js'].functionData[86]++;
  _$jscoverage['/underscore.js'].lineData[861]++;
  var callNow = visit217_861_1(immediate && !timeout);
  _$jscoverage['/underscore.js'].lineData[862]++;
  if (visit218_862_1(timeout)) 
    clearTimeout(timeout);
  _$jscoverage['/underscore.js'].lineData[863]++;
  if (visit219_863_1(callNow)) {
    _$jscoverage['/underscore.js'].lineData[864]++;
    timeout = setTimeout(later, wait);
    _$jscoverage['/underscore.js'].lineData[865]++;
    result = func.apply(this, args);
  } else {
    _$jscoverage['/underscore.js'].lineData[866]++;
    if (visit220_866_1(!immediate)) {
      _$jscoverage['/underscore.js'].lineData[867]++;
      timeout = _.delay(later, wait, this, args);
    }
  }
  _$jscoverage['/underscore.js'].lineData[870]++;
  return result;
});
  _$jscoverage['/underscore.js'].lineData[873]++;
  debounced.clear = function() {
  _$jscoverage['/underscore.js'].functionData[87]++;
  _$jscoverage['/underscore.js'].lineData[874]++;
  clearTimeout(timeout);
  _$jscoverage['/underscore.js'].lineData[875]++;
  timeout = null;
};
  _$jscoverage['/underscore.js'].lineData[878]++;
  return debounced;
};
  _$jscoverage['/underscore.js'].lineData[884]++;
  _.wrap = function(func, wrapper) {
  _$jscoverage['/underscore.js'].functionData[88]++;
  _$jscoverage['/underscore.js'].lineData[885]++;
  return _.partial(wrapper, func);
};
  _$jscoverage['/underscore.js'].lineData[889]++;
  _.negate = function(predicate) {
  _$jscoverage['/underscore.js'].functionData[89]++;
  _$jscoverage['/underscore.js'].lineData[890]++;
  return function() {
  _$jscoverage['/underscore.js'].functionData[90]++;
  _$jscoverage['/underscore.js'].lineData[891]++;
  return !predicate.apply(this, arguments);
};
};
  _$jscoverage['/underscore.js'].lineData[897]++;
  _.compose = function() {
  _$jscoverage['/underscore.js'].functionData[91]++;
  _$jscoverage['/underscore.js'].lineData[898]++;
  var args = arguments;
  _$jscoverage['/underscore.js'].lineData[899]++;
  var start = args.length - 1;
  _$jscoverage['/underscore.js'].lineData[900]++;
  return function() {
  _$jscoverage['/underscore.js'].functionData[92]++;
  _$jscoverage['/underscore.js'].lineData[901]++;
  var i = start;
  _$jscoverage['/underscore.js'].lineData[902]++;
  var result = args[start].apply(this, arguments);
  _$jscoverage['/underscore.js'].lineData[903]++;
  while (visit221_903_1(i--)) 
    result = args[i].call(this, result);
  _$jscoverage['/underscore.js'].lineData[904]++;
  return result;
};
};
  _$jscoverage['/underscore.js'].lineData[909]++;
  _.after = function(times, func) {
  _$jscoverage['/underscore.js'].functionData[93]++;
  _$jscoverage['/underscore.js'].lineData[910]++;
  return function() {
  _$jscoverage['/underscore.js'].functionData[94]++;
  _$jscoverage['/underscore.js'].lineData[911]++;
  if (visit222_911_1(--times < 1)) {
    _$jscoverage['/underscore.js'].lineData[912]++;
    return func.apply(this, arguments);
  }
};
};
  _$jscoverage['/underscore.js'].lineData[918]++;
  _.before = function(times, func) {
  _$jscoverage['/underscore.js'].functionData[95]++;
  _$jscoverage['/underscore.js'].lineData[919]++;
  var memo;
  _$jscoverage['/underscore.js'].lineData[920]++;
  return function() {
  _$jscoverage['/underscore.js'].functionData[96]++;
  _$jscoverage['/underscore.js'].lineData[921]++;
  if (visit223_921_1(--times > 0)) {
    _$jscoverage['/underscore.js'].lineData[922]++;
    memo = func.apply(this, arguments);
  }
  _$jscoverage['/underscore.js'].lineData[924]++;
  if (visit224_924_1(times <= 1)) 
    func = null;
  _$jscoverage['/underscore.js'].lineData[925]++;
  return memo;
};
};
  _$jscoverage['/underscore.js'].lineData[931]++;
  _.once = _.partial(_.before, 2);
  _$jscoverage['/underscore.js'].lineData[933]++;
  _.restArgs = restArgs;
  _$jscoverage['/underscore.js'].lineData[939]++;
  var hasEnumBug = !{
  toString: null}.propertyIsEnumerable('toString');
  _$jscoverage['/underscore.js'].lineData[940]++;
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
  _$jscoverage['/underscore.js'].lineData[943]++;
  var collectNonEnumProps = function(obj, keys) {
  _$jscoverage['/underscore.js'].functionData[97]++;
  _$jscoverage['/underscore.js'].lineData[944]++;
  var nonEnumIdx = nonEnumerableProps.length;
  _$jscoverage['/underscore.js'].lineData[945]++;
  var constructor = obj.constructor;
  _$jscoverage['/underscore.js'].lineData[946]++;
  var proto = visit225_946_1(visit226_946_2(_.isFunction(constructor) && constructor.prototype) || ObjProto);
  _$jscoverage['/underscore.js'].lineData[949]++;
  var prop = 'constructor';
  _$jscoverage['/underscore.js'].lineData[950]++;
  if (visit227_950_1(_.has(obj, prop) && !_.contains(keys, prop))) 
    keys.push(prop);
  _$jscoverage['/underscore.js'].lineData[952]++;
  while (visit228_952_1(nonEnumIdx--)) {
    _$jscoverage['/underscore.js'].lineData[953]++;
    prop = nonEnumerableProps[nonEnumIdx];
    _$jscoverage['/underscore.js'].lineData[954]++;
    if (visit229_954_1(prop in obj && visit230_954_2(visit231_954_3(obj[prop] !== proto[prop]) && !_.contains(keys, prop)))) {
      _$jscoverage['/underscore.js'].lineData[955]++;
      keys.push(prop);
    }
  }
};
  _$jscoverage['/underscore.js'].lineData[962]++;
  _.keys = function(obj) {
  _$jscoverage['/underscore.js'].functionData[98]++;
  _$jscoverage['/underscore.js'].lineData[963]++;
  if (visit232_963_1(!_.isObject(obj))) 
    return [];
  _$jscoverage['/underscore.js'].lineData[964]++;
  if (visit233_964_1(nativeKeys)) 
    return nativeKeys(obj);
  _$jscoverage['/underscore.js'].lineData[965]++;
  var keys = [];
  _$jscoverage['/underscore.js'].lineData[966]++;
  for (var key in obj) 
    if (visit234_966_1(_.has(obj, key))) 
      keys.push(key);
  _$jscoverage['/underscore.js'].lineData[968]++;
  if (visit235_968_1(hasEnumBug)) 
    collectNonEnumProps(obj, keys);
  _$jscoverage['/underscore.js'].lineData[969]++;
  return keys;
};
  _$jscoverage['/underscore.js'].lineData[973]++;
  _.allKeys = function(obj) {
  _$jscoverage['/underscore.js'].functionData[99]++;
  _$jscoverage['/underscore.js'].lineData[974]++;
  if (visit236_974_1(!_.isObject(obj))) 
    return [];
  _$jscoverage['/underscore.js'].lineData[975]++;
  var keys = [];
  _$jscoverage['/underscore.js'].lineData[976]++;
  for (var key in obj) 
    keys.push(key);
  _$jscoverage['/underscore.js'].lineData[978]++;
  if (visit237_978_1(hasEnumBug)) 
    collectNonEnumProps(obj, keys);
  _$jscoverage['/underscore.js'].lineData[979]++;
  return keys;
};
  _$jscoverage['/underscore.js'].lineData[983]++;
  _.values = function(obj) {
  _$jscoverage['/underscore.js'].functionData[100]++;
  _$jscoverage['/underscore.js'].lineData[984]++;
  var keys = _.keys(obj);
  _$jscoverage['/underscore.js'].lineData[985]++;
  var length = keys.length;
  _$jscoverage['/underscore.js'].lineData[986]++;
  var values = Array(length);
  _$jscoverage['/underscore.js'].lineData[987]++;
  for (var i = 0; visit238_987_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[988]++;
    values[i] = obj[keys[i]];
  }
  _$jscoverage['/underscore.js'].lineData[990]++;
  return values;
};
  _$jscoverage['/underscore.js'].lineData[995]++;
  _.mapObject = function(obj, iteratee, context) {
  _$jscoverage['/underscore.js'].functionData[101]++;
  _$jscoverage['/underscore.js'].lineData[996]++;
  iteratee = cb(iteratee, context);
  _$jscoverage['/underscore.js'].lineData[997]++;
  var keys = _.keys(obj), length = keys.length, results = {};
  _$jscoverage['/underscore.js'].lineData[1000]++;
  for (var index = 0; visit239_1000_1(index < length); index++) {
    _$jscoverage['/underscore.js'].lineData[1001]++;
    var currentKey = keys[index];
    _$jscoverage['/underscore.js'].lineData[1002]++;
    results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
  }
  _$jscoverage['/underscore.js'].lineData[1004]++;
  return results;
};
  _$jscoverage['/underscore.js'].lineData[1008]++;
  _.pairs = function(obj) {
  _$jscoverage['/underscore.js'].functionData[102]++;
  _$jscoverage['/underscore.js'].lineData[1009]++;
  var keys = _.keys(obj);
  _$jscoverage['/underscore.js'].lineData[1010]++;
  var length = keys.length;
  _$jscoverage['/underscore.js'].lineData[1011]++;
  var pairs = Array(length);
  _$jscoverage['/underscore.js'].lineData[1012]++;
  for (var i = 0; visit240_1012_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[1013]++;
    pairs[i] = [keys[i], obj[keys[i]]];
  }
  _$jscoverage['/underscore.js'].lineData[1015]++;
  return pairs;
};
  _$jscoverage['/underscore.js'].lineData[1019]++;
  _.invert = function(obj) {
  _$jscoverage['/underscore.js'].functionData[103]++;
  _$jscoverage['/underscore.js'].lineData[1020]++;
  var result = {};
  _$jscoverage['/underscore.js'].lineData[1021]++;
  var keys = _.keys(obj);
  _$jscoverage['/underscore.js'].lineData[1022]++;
  for (var i = 0, length = keys.length; visit241_1022_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[1023]++;
    result[obj[keys[i]]] = keys[i];
  }
  _$jscoverage['/underscore.js'].lineData[1025]++;
  return result;
};
  _$jscoverage['/underscore.js'].lineData[1030]++;
  _.functions = _.methods = function(obj) {
  _$jscoverage['/underscore.js'].functionData[104]++;
  _$jscoverage['/underscore.js'].lineData[1031]++;
  var names = [];
  _$jscoverage['/underscore.js'].lineData[1032]++;
  for (var key in obj) {
    _$jscoverage['/underscore.js'].lineData[1033]++;
    if (visit242_1033_1(_.isFunction(obj[key]))) 
      names.push(key);
  }
  _$jscoverage['/underscore.js'].lineData[1035]++;
  return names.sort();
};
  _$jscoverage['/underscore.js'].lineData[1039]++;
  var createAssigner = function(keysFunc, defaults) {
  _$jscoverage['/underscore.js'].functionData[105]++;
  _$jscoverage['/underscore.js'].lineData[1040]++;
  return function(obj) {
  _$jscoverage['/underscore.js'].functionData[106]++;
  _$jscoverage['/underscore.js'].lineData[1041]++;
  var length = arguments.length;
  _$jscoverage['/underscore.js'].lineData[1042]++;
  if (visit243_1042_1(defaults)) 
    obj = Object(obj);
  _$jscoverage['/underscore.js'].lineData[1043]++;
  if (visit244_1043_1(visit245_1043_2(length < 2) || visit246_1043_3(obj == null))) 
    return obj;
  _$jscoverage['/underscore.js'].lineData[1044]++;
  for (var index = 1; visit247_1044_1(index < length); index++) {
    _$jscoverage['/underscore.js'].lineData[1045]++;
    var source = arguments[index], keys = keysFunc(source), l = keys.length;
    _$jscoverage['/underscore.js'].lineData[1048]++;
    for (var i = 0; visit248_1048_1(i < l); i++) {
      _$jscoverage['/underscore.js'].lineData[1049]++;
      var key = keys[i];
      _$jscoverage['/underscore.js'].lineData[1050]++;
      if (visit249_1050_1(!defaults || visit250_1050_2(obj[key] === void 0))) 
        obj[key] = source[key];
    }
  }
  _$jscoverage['/underscore.js'].lineData[1053]++;
  return obj;
};
};
  _$jscoverage['/underscore.js'].lineData[1058]++;
  _.extend = createAssigner(_.allKeys);
  _$jscoverage['/underscore.js'].lineData[1062]++;
  _.extendOwn = _.assign = createAssigner(_.keys);
  _$jscoverage['/underscore.js'].lineData[1065]++;
  _.findKey = function(obj, predicate, context) {
  _$jscoverage['/underscore.js'].functionData[107]++;
  _$jscoverage['/underscore.js'].lineData[1066]++;
  predicate = cb(predicate, context);
  _$jscoverage['/underscore.js'].lineData[1067]++;
  var keys = _.keys(obj), key;
  _$jscoverage['/underscore.js'].lineData[1068]++;
  for (var i = 0, length = keys.length; visit251_1068_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[1069]++;
    key = keys[i];
    _$jscoverage['/underscore.js'].lineData[1070]++;
    if (visit252_1070_1(predicate(obj[key], key, obj))) 
      return key;
  }
};
  _$jscoverage['/underscore.js'].lineData[1075]++;
  var keyInObj = function(value, key, obj) {
  _$jscoverage['/underscore.js'].functionData[108]++;
  _$jscoverage['/underscore.js'].lineData[1076]++;
  return key in obj;
};
  _$jscoverage['/underscore.js'].lineData[1080]++;
  _.pick = restArgs(function(obj, keys) {
  _$jscoverage['/underscore.js'].functionData[109]++;
  _$jscoverage['/underscore.js'].lineData[1081]++;
  var result = {}, iteratee = keys[0];
  _$jscoverage['/underscore.js'].lineData[1082]++;
  if (visit253_1082_1(obj == null)) 
    return result;
  _$jscoverage['/underscore.js'].lineData[1083]++;
  if (visit254_1083_1(_.isFunction(iteratee))) {
    _$jscoverage['/underscore.js'].lineData[1084]++;
    if (visit255_1084_1(keys.length > 1)) 
      iteratee = optimizeCb(iteratee, keys[1]);
    _$jscoverage['/underscore.js'].lineData[1085]++;
    keys = _.allKeys(obj);
  } else {
    _$jscoverage['/underscore.js'].lineData[1087]++;
    iteratee = keyInObj;
    _$jscoverage['/underscore.js'].lineData[1088]++;
    keys = flatten(keys, false, false);
    _$jscoverage['/underscore.js'].lineData[1089]++;
    obj = Object(obj);
  }
  _$jscoverage['/underscore.js'].lineData[1091]++;
  for (var i = 0, length = keys.length; visit256_1091_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[1092]++;
    var key = keys[i];
    _$jscoverage['/underscore.js'].lineData[1093]++;
    var value = obj[key];
    _$jscoverage['/underscore.js'].lineData[1094]++;
    if (visit257_1094_1(iteratee(value, key, obj))) 
      result[key] = value;
  }
  _$jscoverage['/underscore.js'].lineData[1096]++;
  return result;
});
  _$jscoverage['/underscore.js'].lineData[1100]++;
  _.omit = restArgs(function(obj, keys) {
  _$jscoverage['/underscore.js'].functionData[110]++;
  _$jscoverage['/underscore.js'].lineData[1101]++;
  var iteratee = keys[0], context;
  _$jscoverage['/underscore.js'].lineData[1102]++;
  if (visit258_1102_1(_.isFunction(iteratee))) {
    _$jscoverage['/underscore.js'].lineData[1103]++;
    iteratee = _.negate(iteratee);
    _$jscoverage['/underscore.js'].lineData[1104]++;
    if (visit259_1104_1(keys.length > 1)) 
      context = keys[1];
  } else {
    _$jscoverage['/underscore.js'].lineData[1106]++;
    keys = _.map(flatten(keys, false, false), String);
    _$jscoverage['/underscore.js'].lineData[1107]++;
    iteratee = function(value, key) {
  _$jscoverage['/underscore.js'].functionData[111]++;
  _$jscoverage['/underscore.js'].lineData[1108]++;
  return !_.contains(keys, key);
};
  }
  _$jscoverage['/underscore.js'].lineData[1111]++;
  return _.pick(obj, iteratee, context);
});
  _$jscoverage['/underscore.js'].lineData[1115]++;
  _.defaults = createAssigner(_.allKeys, true);
  _$jscoverage['/underscore.js'].lineData[1120]++;
  _.create = function(prototype, props) {
  _$jscoverage['/underscore.js'].functionData[112]++;
  _$jscoverage['/underscore.js'].lineData[1121]++;
  var result = baseCreate(prototype);
  _$jscoverage['/underscore.js'].lineData[1122]++;
  if (visit260_1122_1(props)) 
    _.extendOwn(result, props);
  _$jscoverage['/underscore.js'].lineData[1123]++;
  return result;
};
  _$jscoverage['/underscore.js'].lineData[1127]++;
  _.clone = function(obj) {
  _$jscoverage['/underscore.js'].functionData[113]++;
  _$jscoverage['/underscore.js'].lineData[1128]++;
  if (visit261_1128_1(!_.isObject(obj))) 
    return obj;
  _$jscoverage['/underscore.js'].lineData[1129]++;
  return visit262_1129_1(_.isArray(obj)) ? obj.slice() : _.extend({}, obj);
};
  _$jscoverage['/underscore.js'].lineData[1135]++;
  _.tap = function(obj, interceptor) {
  _$jscoverage['/underscore.js'].functionData[114]++;
  _$jscoverage['/underscore.js'].lineData[1136]++;
  interceptor(obj);
  _$jscoverage['/underscore.js'].lineData[1137]++;
  return obj;
};
  _$jscoverage['/underscore.js'].lineData[1141]++;
  _.isMatch = function(object, attrs) {
  _$jscoverage['/underscore.js'].functionData[115]++;
  _$jscoverage['/underscore.js'].lineData[1142]++;
  var keys = _.keys(attrs), length = keys.length;
  _$jscoverage['/underscore.js'].lineData[1143]++;
  if (visit263_1143_1(object == null)) 
    return !length;
  _$jscoverage['/underscore.js'].lineData[1144]++;
  var obj = Object(object);
  _$jscoverage['/underscore.js'].lineData[1145]++;
  for (var i = 0; visit264_1145_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[1146]++;
    var key = keys[i];
    _$jscoverage['/underscore.js'].lineData[1147]++;
    if (visit265_1147_1(visit266_1147_2(attrs[key] !== obj[key]) || !(key in obj))) 
      return false;
  }
  _$jscoverage['/underscore.js'].lineData[1149]++;
  return true;
};
  _$jscoverage['/underscore.js'].lineData[1154]++;
  var eq, deepEq;
  _$jscoverage['/underscore.js'].lineData[1155]++;
  eq = function(a, b, aStack, bStack) {
  _$jscoverage['/underscore.js'].functionData[116]++;
  _$jscoverage['/underscore.js'].lineData[1158]++;
  if (visit267_1158_1(a === b)) 
    return visit268_1158_2(visit269_1158_3(a !== 0) || visit270_1158_4(1 / a === 1 / b));
  _$jscoverage['/underscore.js'].lineData[1160]++;
  if (visit271_1160_1(visit272_1160_2(a == null) || visit273_1160_3(b == null))) 
    return visit274_1160_4(a === b);
  _$jscoverage['/underscore.js'].lineData[1162]++;
  if (visit275_1162_1(a !== a)) 
    return visit276_1162_2(b !== b);
  _$jscoverage['/underscore.js'].lineData[1164]++;
  var type = typeof a;
  _$jscoverage['/underscore.js'].lineData[1165]++;
  if (visit277_1165_1(visit278_1165_2(type !== 'function') && visit279_1165_3(visit280_1165_4(type !== 'object') && visit281_1165_5(typeof b != 'object')))) 
    return false;
  _$jscoverage['/underscore.js'].lineData[1166]++;
  return deepEq(a, b, aStack, bStack);
};
  _$jscoverage['/underscore.js'].lineData[1170]++;
  deepEq = function(a, b, aStack, bStack) {
  _$jscoverage['/underscore.js'].functionData[117]++;
  _$jscoverage['/underscore.js'].lineData[1172]++;
  if (visit282_1172_1(a instanceof _)) 
    a = a._wrapped;
  _$jscoverage['/underscore.js'].lineData[1173]++;
  if (visit283_1173_1(b instanceof _)) 
    b = b._wrapped;
  _$jscoverage['/underscore.js'].lineData[1175]++;
  var className = toString.call(a);
  _$jscoverage['/underscore.js'].lineData[1176]++;
  if (visit284_1176_1(className !== toString.call(b))) 
    return false;
  _$jscoverage['/underscore.js'].lineData[1177]++;
  switch (className) {
    case '[object RegExp]':
      _$jscoverage['/underscore.js'].lineData[1179]++;
    case '[object String]':
      _$jscoverage['/underscore.js'].lineData[1184]++;
      return visit285_1184_1('' + a === '' + b);
    case '[object Number]':
      _$jscoverage['/underscore.js'].lineData[1188]++;
      if (visit286_1188_1(+a !== +a)) 
        return visit287_1188_2(+b !== +b);
      _$jscoverage['/underscore.js'].lineData[1190]++;
      return visit288_1190_1(+a === 0) ? visit289_1190_2(1 / +a === 1 / b) : visit290_1190_3(+a === +b);
    case '[object Date]':
      _$jscoverage['/underscore.js'].lineData[1191]++;
    case '[object Boolean]':
      _$jscoverage['/underscore.js'].lineData[1196]++;
      return visit291_1196_1(+a === +b);
  }
  _$jscoverage['/underscore.js'].lineData[1199]++;
  var areArrays = visit292_1199_1(className === '[object Array]');
  _$jscoverage['/underscore.js'].lineData[1200]++;
  if (visit293_1200_1(!areArrays)) {
    _$jscoverage['/underscore.js'].lineData[1201]++;
    if (visit294_1201_1(visit295_1201_2(typeof a != 'object') || visit296_1201_3(typeof b != 'object'))) 
      return false;
    _$jscoverage['/underscore.js'].lineData[1205]++;
    var aCtor = a.constructor, bCtor = b.constructor;
    _$jscoverage['/underscore.js'].lineData[1206]++;
    if (visit297_1206_1(visit298_1206_2(aCtor !== bCtor) && visit299_1206_3(!(visit300_1206_4(_.isFunction(aCtor) && visit301_1206_5(aCtor instanceof aCtor && visit302_1207_1(_.isFunction(bCtor) && bCtor instanceof bCtor)))) && (visit303_1208_1('constructor' in a && 'constructor' in b))))) {
      _$jscoverage['/underscore.js'].lineData[1209]++;
      return false;
    }
  }
  _$jscoverage['/underscore.js'].lineData[1217]++;
  aStack = visit304_1217_1(aStack || []);
  _$jscoverage['/underscore.js'].lineData[1218]++;
  bStack = visit305_1218_1(bStack || []);
  _$jscoverage['/underscore.js'].lineData[1219]++;
  var length = aStack.length;
  _$jscoverage['/underscore.js'].lineData[1220]++;
  while (visit306_1220_1(length--)) {
    _$jscoverage['/underscore.js'].lineData[1223]++;
    if (visit307_1223_1(aStack[length] === a)) 
      return visit308_1223_2(bStack[length] === b);
  }
  _$jscoverage['/underscore.js'].lineData[1227]++;
  aStack.push(a);
  _$jscoverage['/underscore.js'].lineData[1228]++;
  bStack.push(b);
  _$jscoverage['/underscore.js'].lineData[1231]++;
  if (visit309_1231_1(areArrays)) {
    _$jscoverage['/underscore.js'].lineData[1233]++;
    length = a.length;
    _$jscoverage['/underscore.js'].lineData[1234]++;
    if (visit310_1234_1(length !== b.length)) 
      return false;
    _$jscoverage['/underscore.js'].lineData[1236]++;
    while (visit311_1236_1(length--)) {
      _$jscoverage['/underscore.js'].lineData[1237]++;
      if (visit312_1237_1(!eq(a[length], b[length], aStack, bStack))) 
        return false;
    }
  } else {
    _$jscoverage['/underscore.js'].lineData[1241]++;
    var keys = _.keys(a), key;
    _$jscoverage['/underscore.js'].lineData[1242]++;
    length = keys.length;
    _$jscoverage['/underscore.js'].lineData[1244]++;
    if (visit313_1244_1(_.keys(b).length !== length)) 
      return false;
    _$jscoverage['/underscore.js'].lineData[1245]++;
    while (visit314_1245_1(length--)) {
      _$jscoverage['/underscore.js'].lineData[1247]++;
      key = keys[length];
      _$jscoverage['/underscore.js'].lineData[1248]++;
      if (visit315_1248_1(!(visit316_1248_2(_.has(b, key) && eq(a[key], b[key], aStack, bStack))))) 
        return false;
    }
  }
  _$jscoverage['/underscore.js'].lineData[1252]++;
  aStack.pop();
  _$jscoverage['/underscore.js'].lineData[1253]++;
  bStack.pop();
  _$jscoverage['/underscore.js'].lineData[1254]++;
  return true;
};
  _$jscoverage['/underscore.js'].lineData[1258]++;
  _.isEqual = function(a, b) {
  _$jscoverage['/underscore.js'].functionData[118]++;
  _$jscoverage['/underscore.js'].lineData[1259]++;
  return eq(a, b);
};
  _$jscoverage['/underscore.js'].lineData[1264]++;
  _.isEmpty = function(obj) {
  _$jscoverage['/underscore.js'].functionData[119]++;
  _$jscoverage['/underscore.js'].lineData[1265]++;
  if (visit317_1265_1(obj == null)) 
    return true;
  _$jscoverage['/underscore.js'].lineData[1266]++;
  if (visit318_1266_1(isArrayLike(obj) && (visit319_1266_2(_.isArray(obj) || visit320_1266_3(_.isString(obj) || _.isArguments(obj)))))) 
    return visit321_1266_4(obj.length === 0);
  _$jscoverage['/underscore.js'].lineData[1267]++;
  return visit322_1267_1(_.keys(obj).length === 0);
};
  _$jscoverage['/underscore.js'].lineData[1271]++;
  _.isElement = function(obj) {
  _$jscoverage['/underscore.js'].functionData[120]++;
  _$jscoverage['/underscore.js'].lineData[1272]++;
  return !!(visit323_1272_1(obj && visit324_1272_2(obj.nodeType === 1)));
};
  _$jscoverage['/underscore.js'].lineData[1277]++;
  _.isArray = visit325_1277_1(nativeIsArray || function(obj) {
  _$jscoverage['/underscore.js'].functionData[121]++;
  _$jscoverage['/underscore.js'].lineData[1278]++;
  return visit326_1278_1(toString.call(obj) === '[object Array]');
});
  _$jscoverage['/underscore.js'].lineData[1282]++;
  _.isObject = function(obj) {
  _$jscoverage['/underscore.js'].functionData[122]++;
  _$jscoverage['/underscore.js'].lineData[1283]++;
  var type = typeof obj;
  _$jscoverage['/underscore.js'].lineData[1284]++;
  return visit327_1284_1(visit328_1284_2(type === 'function') || visit329_1284_3(visit330_1284_4(type === 'object') && !!obj));
};
  _$jscoverage['/underscore.js'].lineData[1288]++;
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
  _$jscoverage['/underscore.js'].functionData[123]++;
  _$jscoverage['/underscore.js'].lineData[1289]++;
  _['is' + name] = function(obj) {
  _$jscoverage['/underscore.js'].functionData[124]++;
  _$jscoverage['/underscore.js'].lineData[1290]++;
  return visit331_1290_1(toString.call(obj) === '[object ' + name + ']');
};
});
  _$jscoverage['/underscore.js'].lineData[1296]++;
  if (visit332_1296_1(!_.isArguments(arguments))) {
    _$jscoverage['/underscore.js'].lineData[1297]++;
    _.isArguments = function(obj) {
  _$jscoverage['/underscore.js'].functionData[125]++;
  _$jscoverage['/underscore.js'].lineData[1298]++;
  return _.has(obj, 'callee');
};
  }
  _$jscoverage['/underscore.js'].lineData[1304]++;
  var nodelist = visit333_1304_1(root.document && root.document.childNodes);
  _$jscoverage['/underscore.js'].lineData[1305]++;
  if (visit334_1305_1(visit335_1305_2(typeof /./ != 'function') && visit336_1305_3(visit337_1305_4(typeof Int8Array != 'object') && visit338_1305_5(typeof nodelist != 'function')))) {
    _$jscoverage['/underscore.js'].lineData[1306]++;
    _.isFunction = function(obj) {
  _$jscoverage['/underscore.js'].functionData[126]++;
  _$jscoverage['/underscore.js'].lineData[1307]++;
  return visit339_1307_1(visit340_1307_2(typeof obj == 'function') || false);
};
  }
  _$jscoverage['/underscore.js'].lineData[1312]++;
  _.isFinite = function(obj) {
  _$jscoverage['/underscore.js'].functionData[127]++;
  _$jscoverage['/underscore.js'].lineData[1313]++;
  return visit341_1313_1(isFinite(obj) && !isNaN(parseFloat(obj)));
};
  _$jscoverage['/underscore.js'].lineData[1317]++;
  _.isNaN = function(obj) {
  _$jscoverage['/underscore.js'].functionData[128]++;
  _$jscoverage['/underscore.js'].lineData[1318]++;
  return visit342_1318_1(_.isNumber(obj) && isNaN(obj));
};
  _$jscoverage['/underscore.js'].lineData[1322]++;
  _.isBoolean = function(obj) {
  _$jscoverage['/underscore.js'].functionData[129]++;
  _$jscoverage['/underscore.js'].lineData[1323]++;
  return visit343_1323_1(visit344_1323_2(obj === true) || visit345_1323_3(visit346_1323_4(obj === false) || visit347_1323_5(toString.call(obj) === '[object Boolean]')));
};
  _$jscoverage['/underscore.js'].lineData[1327]++;
  _.isNull = function(obj) {
  _$jscoverage['/underscore.js'].functionData[130]++;
  _$jscoverage['/underscore.js'].lineData[1328]++;
  return visit348_1328_1(obj === null);
};
  _$jscoverage['/underscore.js'].lineData[1332]++;
  _.isUndefined = function(obj) {
  _$jscoverage['/underscore.js'].functionData[131]++;
  _$jscoverage['/underscore.js'].lineData[1333]++;
  return visit349_1333_1(obj === void 0);
};
  _$jscoverage['/underscore.js'].lineData[1338]++;
  _.has = function(obj, key) {
  _$jscoverage['/underscore.js'].functionData[132]++;
  _$jscoverage['/underscore.js'].lineData[1339]++;
  return visit350_1339_1(visit351_1339_2(obj != null) && hasOwnProperty.call(obj, key));
};
  _$jscoverage['/underscore.js'].lineData[1347]++;
  _.noConflict = function() {
  _$jscoverage['/underscore.js'].functionData[133]++;
  _$jscoverage['/underscore.js'].lineData[1348]++;
  root._ = previousUnderscore;
  _$jscoverage['/underscore.js'].lineData[1349]++;
  return this;
};
  _$jscoverage['/underscore.js'].lineData[1353]++;
  _.identity = function(value) {
  _$jscoverage['/underscore.js'].functionData[134]++;
  _$jscoverage['/underscore.js'].lineData[1354]++;
  return value;
};
  _$jscoverage['/underscore.js'].lineData[1358]++;
  _.constant = function(value) {
  _$jscoverage['/underscore.js'].functionData[135]++;
  _$jscoverage['/underscore.js'].lineData[1359]++;
  return function() {
  _$jscoverage['/underscore.js'].functionData[136]++;
  _$jscoverage['/underscore.js'].lineData[1360]++;
  return value;
};
};
  _$jscoverage['/underscore.js'].lineData[1364]++;
  _.noop = function() {
  _$jscoverage['/underscore.js'].functionData[137]++;
};
  _$jscoverage['/underscore.js'].lineData[1366]++;
  _.property = property;
  _$jscoverage['/underscore.js'].lineData[1369]++;
  _.propertyOf = function(obj) {
  _$jscoverage['/underscore.js'].functionData[138]++;
  _$jscoverage['/underscore.js'].lineData[1370]++;
  return visit352_1370_1(obj == null) ? function() {
  _$jscoverage['/underscore.js'].functionData[139]++;
} : function(key) {
  _$jscoverage['/underscore.js'].functionData[140]++;
  _$jscoverage['/underscore.js'].lineData[1371]++;
  return obj[key];
};
};
  _$jscoverage['/underscore.js'].lineData[1377]++;
  _.matcher = _.matches = function(attrs) {
  _$jscoverage['/underscore.js'].functionData[141]++;
  _$jscoverage['/underscore.js'].lineData[1378]++;
  attrs = _.extendOwn({}, attrs);
  _$jscoverage['/underscore.js'].lineData[1379]++;
  return function(obj) {
  _$jscoverage['/underscore.js'].functionData[142]++;
  _$jscoverage['/underscore.js'].lineData[1380]++;
  return _.isMatch(obj, attrs);
};
};
  _$jscoverage['/underscore.js'].lineData[1385]++;
  _.times = function(n, iteratee, context) {
  _$jscoverage['/underscore.js'].functionData[143]++;
  _$jscoverage['/underscore.js'].lineData[1386]++;
  var accum = Array(Math.max(0, n));
  _$jscoverage['/underscore.js'].lineData[1387]++;
  iteratee = optimizeCb(iteratee, context, 1);
  _$jscoverage['/underscore.js'].lineData[1388]++;
  for (var i = 0; visit353_1388_1(i < n); i++) 
    accum[i] = iteratee(i);
  _$jscoverage['/underscore.js'].lineData[1389]++;
  return accum;
};
  _$jscoverage['/underscore.js'].lineData[1393]++;
  _.random = function(min, max) {
  _$jscoverage['/underscore.js'].functionData[144]++;
  _$jscoverage['/underscore.js'].lineData[1394]++;
  if (visit354_1394_1(max == null)) {
    _$jscoverage['/underscore.js'].lineData[1395]++;
    max = min;
    _$jscoverage['/underscore.js'].lineData[1396]++;
    min = 0;
  }
  _$jscoverage['/underscore.js'].lineData[1398]++;
  return min + Math.floor(Math.random() * (max - min + 1));
};
  _$jscoverage['/underscore.js'].lineData[1402]++;
  _.now = visit355_1402_1(Date.now || function() {
  _$jscoverage['/underscore.js'].functionData[145]++;
  _$jscoverage['/underscore.js'].lineData[1403]++;
  return new Date().getTime();
});
  _$jscoverage['/underscore.js'].lineData[1407]++;
  var escapeMap = {
  '&': '&amp;', 
  '<': '&lt;', 
  '>': '&gt;', 
  '"': '&quot;', 
  "'": '&#x27;', 
  '`': '&#x60;'};
  _$jscoverage['/underscore.js'].lineData[1415]++;
  var unescapeMap = _.invert(escapeMap);
  _$jscoverage['/underscore.js'].lineData[1418]++;
  var createEscaper = function(map) {
  _$jscoverage['/underscore.js'].functionData[146]++;
  _$jscoverage['/underscore.js'].lineData[1419]++;
  var escaper = function(match) {
  _$jscoverage['/underscore.js'].functionData[147]++;
  _$jscoverage['/underscore.js'].lineData[1420]++;
  return map[match];
};
  _$jscoverage['/underscore.js'].lineData[1423]++;
  var source = '(?:' + _.keys(map).join('|') + ')';
  _$jscoverage['/underscore.js'].lineData[1424]++;
  var testRegexp = RegExp(source);
  _$jscoverage['/underscore.js'].lineData[1425]++;
  var replaceRegexp = RegExp(source, 'g');
  _$jscoverage['/underscore.js'].lineData[1426]++;
  return function(string) {
  _$jscoverage['/underscore.js'].functionData[148]++;
  _$jscoverage['/underscore.js'].lineData[1427]++;
  string = visit356_1427_1(string == null) ? '' : '' + string;
  _$jscoverage['/underscore.js'].lineData[1428]++;
  return visit357_1428_1(testRegexp.test(string)) ? string.replace(replaceRegexp, escaper) : string;
};
};
  _$jscoverage['/underscore.js'].lineData[1431]++;
  _.escape = createEscaper(escapeMap);
  _$jscoverage['/underscore.js'].lineData[1432]++;
  _.unescape = createEscaper(unescapeMap);
  _$jscoverage['/underscore.js'].lineData[1436]++;
  _.result = function(object, prop, fallback) {
  _$jscoverage['/underscore.js'].functionData[149]++;
  _$jscoverage['/underscore.js'].lineData[1437]++;
  var value = visit358_1437_1(object == null) ? void 0 : object[prop];
  _$jscoverage['/underscore.js'].lineData[1438]++;
  if (visit359_1438_1(value === void 0)) {
    _$jscoverage['/underscore.js'].lineData[1439]++;
    value = fallback;
  }
  _$jscoverage['/underscore.js'].lineData[1441]++;
  return visit360_1441_1(_.isFunction(value)) ? value.call(object) : value;
};
  _$jscoverage['/underscore.js'].lineData[1446]++;
  var idCounter = 0;
  _$jscoverage['/underscore.js'].lineData[1447]++;
  _.uniqueId = function(prefix) {
  _$jscoverage['/underscore.js'].functionData[150]++;
  _$jscoverage['/underscore.js'].lineData[1448]++;
  var id = ++idCounter + '';
  _$jscoverage['/underscore.js'].lineData[1449]++;
  return visit361_1449_1(prefix) ? prefix + id : id;
};
  _$jscoverage['/underscore.js'].lineData[1454]++;
  _.templateSettings = {
  evaluate: /<%([\s\S]+?)%>/g, 
  interpolate: /<%=([\s\S]+?)%>/g, 
  escape: /<%-([\s\S]+?)%>/g};
  _$jscoverage['/underscore.js'].lineData[1463]++;
  var noMatch = /(.)^/;
  _$jscoverage['/underscore.js'].lineData[1467]++;
  var escapes = {
  "'": "'", 
  '\\': '\\', 
  '\r': 'r', 
  '\n': 'n', 
  '\u2028': 'u2028', 
  '\u2029': 'u2029'};
  _$jscoverage['/underscore.js'].lineData[1476]++;
  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;
  _$jscoverage['/underscore.js'].lineData[1478]++;
  var escapeChar = function(match) {
  _$jscoverage['/underscore.js'].functionData[151]++;
  _$jscoverage['/underscore.js'].lineData[1479]++;
  return '\\' + escapes[match];
};
  _$jscoverage['/underscore.js'].lineData[1486]++;
  _.template = function(text, settings, oldSettings) {
  _$jscoverage['/underscore.js'].functionData[152]++;
  _$jscoverage['/underscore.js'].lineData[1487]++;
  if (visit362_1487_1(!settings && oldSettings)) 
    settings = oldSettings;
  _$jscoverage['/underscore.js'].lineData[1488]++;
  settings = _.defaults({}, settings, _.templateSettings);
  _$jscoverage['/underscore.js'].lineData[1491]++;
  var matcher = RegExp([(visit363_1492_1(settings.escape || noMatch)).source, (visit364_1493_1(settings.interpolate || noMatch)).source, (visit365_1494_1(settings.evaluate || noMatch)).source].join('|') + '|$', 'g');
  _$jscoverage['/underscore.js'].lineData[1498]++;
  var index = 0;
  _$jscoverage['/underscore.js'].lineData[1499]++;
  var source = "__p+='";
  _$jscoverage['/underscore.js'].lineData[1500]++;
  text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
  _$jscoverage['/underscore.js'].functionData[153]++;
  _$jscoverage['/underscore.js'].lineData[1501]++;
  source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
  _$jscoverage['/underscore.js'].lineData[1502]++;
  index = offset + match.length;
  _$jscoverage['/underscore.js'].lineData[1504]++;
  if (visit366_1504_1(escape)) {
    _$jscoverage['/underscore.js'].lineData[1505]++;
    source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
  } else {
    _$jscoverage['/underscore.js'].lineData[1506]++;
    if (visit367_1506_1(interpolate)) {
      _$jscoverage['/underscore.js'].lineData[1507]++;
      source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
    } else {
      _$jscoverage['/underscore.js'].lineData[1508]++;
      if (visit368_1508_1(evaluate)) {
        _$jscoverage['/underscore.js'].lineData[1509]++;
        source += "';\n" + evaluate + "\n__p+='";
      }
    }
  }
  _$jscoverage['/underscore.js'].lineData[1513]++;
  return match;
});
  _$jscoverage['/underscore.js'].lineData[1515]++;
  source += "';\n";
  _$jscoverage['/underscore.js'].lineData[1518]++;
  if (visit369_1518_1(!settings.variable)) 
    source = 'with(obj||{}){\n' + source + '}\n';
  _$jscoverage['/underscore.js'].lineData[1520]++;
  source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + 'return __p;\n';
  _$jscoverage['/underscore.js'].lineData[1524]++;
  var render;
  _$jscoverage['/underscore.js'].lineData[1525]++;
  try {
    _$jscoverage['/underscore.js'].lineData[1526]++;
    render = new Function(visit370_1526_1(settings.variable || 'obj'), '_', source);
  }  catch (e) {
  _$jscoverage['/underscore.js'].lineData[1528]++;
  e.source = source;
  _$jscoverage['/underscore.js'].lineData[1529]++;
  throw e;
}
  _$jscoverage['/underscore.js'].lineData[1532]++;
  var template = function(data) {
  _$jscoverage['/underscore.js'].functionData[154]++;
  _$jscoverage['/underscore.js'].lineData[1533]++;
  return render.call(this, data, _);
};
  _$jscoverage['/underscore.js'].lineData[1537]++;
  var argument = visit371_1537_1(settings.variable || 'obj');
  _$jscoverage['/underscore.js'].lineData[1538]++;
  template.source = 'function(' + argument + '){\n' + source + '}';
  _$jscoverage['/underscore.js'].lineData[1540]++;
  return template;
};
  _$jscoverage['/underscore.js'].lineData[1544]++;
  _.chain = function(obj) {
  _$jscoverage['/underscore.js'].functionData[155]++;
  _$jscoverage['/underscore.js'].lineData[1545]++;
  var instance = _(obj);
  _$jscoverage['/underscore.js'].lineData[1546]++;
  instance._chain = true;
  _$jscoverage['/underscore.js'].lineData[1547]++;
  return instance;
};
  _$jscoverage['/underscore.js'].lineData[1557]++;
  var chainResult = function(instance, obj) {
  _$jscoverage['/underscore.js'].functionData[156]++;
  _$jscoverage['/underscore.js'].lineData[1558]++;
  return visit372_1558_1(instance._chain) ? _(obj).chain() : obj;
};
  _$jscoverage['/underscore.js'].lineData[1562]++;
  _.mixin = function(obj) {
  _$jscoverage['/underscore.js'].functionData[157]++;
  _$jscoverage['/underscore.js'].lineData[1563]++;
  _.each(_.functions(obj), function(name) {
  _$jscoverage['/underscore.js'].functionData[158]++;
  _$jscoverage['/underscore.js'].lineData[1564]++;
  var func = _[name] = obj[name];
  _$jscoverage['/underscore.js'].lineData[1565]++;
  _.prototype[name] = function() {
  _$jscoverage['/underscore.js'].functionData[159]++;
  _$jscoverage['/underscore.js'].lineData[1566]++;
  var args = [this._wrapped];
  _$jscoverage['/underscore.js'].lineData[1567]++;
  push.apply(args, arguments);
  _$jscoverage['/underscore.js'].lineData[1568]++;
  return chainResult(this, func.apply(_, args));
};
});
};
  _$jscoverage['/underscore.js'].lineData[1574]++;
  _.mixin(_);
  _$jscoverage['/underscore.js'].lineData[1577]++;
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
  _$jscoverage['/underscore.js'].functionData[160]++;
  _$jscoverage['/underscore.js'].lineData[1578]++;
  var method = ArrayProto[name];
  _$jscoverage['/underscore.js'].lineData[1579]++;
  _.prototype[name] = function() {
  _$jscoverage['/underscore.js'].functionData[161]++;
  _$jscoverage['/underscore.js'].lineData[1580]++;
  var obj = this._wrapped;
  _$jscoverage['/underscore.js'].lineData[1581]++;
  method.apply(obj, arguments);
  _$jscoverage['/underscore.js'].lineData[1582]++;
  if (visit373_1582_1((visit374_1582_2(visit375_1582_3(name === 'shift') || visit376_1582_4(name === 'splice'))) && visit377_1582_5(obj.length === 0))) 
    delete obj[0];
  _$jscoverage['/underscore.js'].lineData[1583]++;
  return chainResult(this, obj);
};
});
  _$jscoverage['/underscore.js'].lineData[1588]++;
  _.each(['concat', 'join', 'slice'], function(name) {
  _$jscoverage['/underscore.js'].functionData[162]++;
  _$jscoverage['/underscore.js'].lineData[1589]++;
  var method = ArrayProto[name];
  _$jscoverage['/underscore.js'].lineData[1590]++;
  _.prototype[name] = function() {
  _$jscoverage['/underscore.js'].functionData[163]++;
  _$jscoverage['/underscore.js'].lineData[1591]++;
  return chainResult(this, method.apply(this._wrapped, arguments));
};
});
  _$jscoverage['/underscore.js'].lineData[1596]++;
  _.prototype.value = function() {
  _$jscoverage['/underscore.js'].functionData[164]++;
  _$jscoverage['/underscore.js'].lineData[1597]++;
  return this._wrapped;
};
  _$jscoverage['/underscore.js'].lineData[1602]++;
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
  _$jscoverage['/underscore.js'].lineData[1604]++;
  _.prototype.toString = function() {
  _$jscoverage['/underscore.js'].functionData[165]++;
  _$jscoverage['/underscore.js'].lineData[1605]++;
  return '' + this._wrapped;
};
  _$jscoverage['/underscore.js'].lineData[1615]++;
  if (visit378_1615_1(visit379_1615_2(typeof define == 'function') && define.amd)) {
    _$jscoverage['/underscore.js'].lineData[1616]++;
    define('underscore', [], function() {
  _$jscoverage['/underscore.js'].functionData[166]++;
  _$jscoverage['/underscore.js'].lineData[1617]++;
  return _;
});
  }
}());
