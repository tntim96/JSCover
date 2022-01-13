function BranchData() {
    this.position = -1;
    this.nodeLength = -1;
    this.evalFalse = 0;
    this.evalTrue = 0;

    this.init = function(position, nodeLength) {
        this.position = position;
        this.nodeLength = nodeLength;
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
            + ',"evalFalse":' + this.evalFalse
            + ',"evalTrue":' + this.evalTrue + '}';
    };

    this.message = function(src) {
        if (this.evalTrue === 0 && this.evalFalse === 0)
            return 'Condition never evaluated         :\t' + src + '\n';
        else if (this.evalTrue === 0)
            return 'Condition never evaluated to true :\t' + src + '\n';
        else if (this.evalFalse === 0)
            return 'Condition never evaluated to false:\t' + src + '\n';
        else
            return 'Condition covered';
    };
}

BranchData.fromJson = function(jsonString) {
    var json = JSON.parse(jsonString);
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

BranchData.fromJsonObject = function(json) {
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

function buildBranchMessage(conditions) {
    var message = 'The following was not covered:';
    var i;
    for (i = 0; i < conditions.length; i++) {
        if (conditions[i] !== undefined && conditions[i] !== null && !conditions[i].covered())
            message += '\n- '+ conditions[i].message(conditions[i].src);
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
    var json = JSON.parse(data);
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
if (! _$jscoverage['/underscore-umd.js']) {
  _$jscoverage['/underscore-umd.js'] = {};
  _$jscoverage['/underscore-umd.js'].lineData = [];
  _$jscoverage['/underscore-umd.js'].lineData[1] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[2] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[5] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[6] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[7] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[16] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[21] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[27] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[28] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[31] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[37] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[42] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[48] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[52] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[53] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[57] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[64] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[65] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[66] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[67] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[70] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[71] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[73] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[74] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[75] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[76] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[78] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[79] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[80] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[82] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[83] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[88] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[89] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[90] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[94] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[95] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[99] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[100] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[104] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[105] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[109] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[110] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[114] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[115] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[116] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[117] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[121] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[123] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[125] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[127] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[129] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[131] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[133] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[135] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[139] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[140] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[141] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[142] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[146] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[148] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[153] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[158] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[162] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[163] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[166] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[170] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[173] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[174] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[177] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[181] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[182] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[183] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[184] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[189] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[192] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[193] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[197] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[198] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[202] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[203] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[204] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[209] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[210] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[211] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[212] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[217] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[218] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[219] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[224] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[228] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[231] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[232] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[235] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[239] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[242] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[248] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[249] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[250] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[251] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[252] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[254] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[255] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[263] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[264] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[265] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[266] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[267] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[270] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[271] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[273] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[274] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[275] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[276] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[283] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[284] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[285] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[286] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[287] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[289] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[290] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[295] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[296] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[299] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[300] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[302] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[303] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[307] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[308] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[309] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[310] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[311] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[312] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[313] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[315] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[321] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[322] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[323] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[324] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[327] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[330] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[331] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[336] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[338] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[339] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[344] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[345] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[353] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[356] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[359] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[361] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[363] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[365] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[366] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[367] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[371] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[373] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[374] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[376] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[377] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[379] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[380] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[381] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[383] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[385] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[390] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[394] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[396] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[397] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[402] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[404] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[405] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[408] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[411] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[412] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[413] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[414] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[415] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[416] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[418] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[419] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[423] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[424] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[427] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[435] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[436] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[437] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[438] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[441] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[445] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[446] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[449] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[451] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[452] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[454] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[455] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[459] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[460] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[462] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[463] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[465] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[466] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[470] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[471] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[472] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[476] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[477] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[481] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[482] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[483] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[484] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[486] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[487] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[494] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[495] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[496] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[497] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[499] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[500] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[501] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[502] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[507] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[513] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[520] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[524] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[526] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[528] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[530] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[533] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[534] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[535] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[536] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[537] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[538] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[540] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[545] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[546] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[547] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[548] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[549] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[550] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[552] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[556] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[557] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[558] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[559] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[560] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[562] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[566] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[567] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[568] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[569] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[571] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[575] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[576] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[577] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[578] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[579] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[580] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[581] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[584] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[585] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[586] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[589] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[594] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[599] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[602] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[605] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[606] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[610] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[611] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[612] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[613] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[614] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[615] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[616] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[617] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[623] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[624] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[625] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[626] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[630] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[631] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[632] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[638] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[639] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[640] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[645] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[646] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[648] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[652] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[653] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[657] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[658] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[659] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[660] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[661] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[663] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[670] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[671] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[672] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[678] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[679] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[680] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[681] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[682] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[683] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[684] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[686] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[690] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[691] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[696] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[697] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[698] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[699] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[705] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[706] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[707] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[708] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[715] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[716] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[717] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[718] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[719] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[722] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[723] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[725] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[726] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[729] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[730] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[737] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[738] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[739] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[740] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[741] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[747] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[748] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[750] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[754] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[755] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[756] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[761] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[762] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[763] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[766] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[767] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[768] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[770] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[774] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[777] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[778] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[779] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[780] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[785] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[786] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[787] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[788] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[789] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[793] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[794] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[795] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[796] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[798] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[802] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[803] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[808] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[809] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[810] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[813] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[814] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[815] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[816] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[817] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[818] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[823] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[833] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[836] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[839] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[843] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[852] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[856] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[865] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[867] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[868] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[876] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[882] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[883] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[884] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[887] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[894] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[895] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[896] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[897] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[898] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[900] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[901] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[902] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[903] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[904] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[905] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[909] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[911] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[913] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[914] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[916] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[921] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[922] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[925] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[929] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[930] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[931] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[933] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[934] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[937] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[938] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[942] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[944] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[950] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[951] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[952] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[953] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[954] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[956] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[957] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[958] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[959] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[960] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[962] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[964] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[969] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[970] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[971] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[972] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[976] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[977] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[978] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[979] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[985] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[986] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[987] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[988] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[989] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[990] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[997] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[998] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[999] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1000] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1001] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1002] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1003] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1005] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1006] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1008] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1011] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1015] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1016] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1017] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1018] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1020] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1027] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1030] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1031] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1032] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1033] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1034] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1035] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1037] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1038] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1039] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1040] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1042] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1043] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1044] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1046] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1047] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1049] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1050] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1053] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1059] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1060] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1061] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1062] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1063] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1064] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1065] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1067] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1071] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1072] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1073] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1074] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1075] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1076] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1078] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1079] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1084] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1085] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1086] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1092] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1099] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1100] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1101] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1102] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1104] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1105] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1106] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1107] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1108] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1111] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1112] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1113] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1114] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1115] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1116] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1117] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1118] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1119] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1120] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1122] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1123] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1124] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1125] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1126] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1128] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1131] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1132] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1133] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1134] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1137] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1144] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1145] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1147] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1148] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1149] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1150] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1152] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1153] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1155] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1159] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1160] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1161] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1162] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1163] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1164] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1165] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1167] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1170] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1171] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1172] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1175] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1181] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1182] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1186] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1187] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1188] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1194] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1195] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1196] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1197] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1198] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1199] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1200] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1201] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1206] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1207] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1208] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1209] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1216] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1217] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1218] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1219] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1220] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1222] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1223] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1229] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1232] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1233] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1234] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1235] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1236] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1237] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1242] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1243] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1244] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1245] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1246] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1247] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1248] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1250] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1255] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1258] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1262] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1263] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1264] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1265] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1266] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1267] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1268] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1270] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1274] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1275] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1276] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1277] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1278] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1279] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1281] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1283] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1284] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1285] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1287] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1288] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1289] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1291] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1292] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1294] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1302] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1306] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1309] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1310] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1311] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1312] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1317] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1318] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1325] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1326] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1327] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1328] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1329] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1330] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1333] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1334] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1335] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1338] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1342] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1343] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1344] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1347] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1348] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1349] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1351] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1355] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1358] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1359] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1362] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1363] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1364] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1366] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1367] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1368] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1370] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1373] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1374] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1375] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1381] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1384] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1387] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1388] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1389] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1390] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1391] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1393] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1397] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1398] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1402] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1403] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1404] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1406] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1407] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1408] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1410] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1414] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1415] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1416] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1418] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1419] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1420] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1422] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1426] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1427] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1428] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1429] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1433] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1434] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1435] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1436] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1438] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1439] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1440] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1442] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1443] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1444] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1445] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1446] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1448] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1449] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1451] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1456] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1457] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1462] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1463] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1467] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1468] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1470] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1471] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1472] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1473] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1474] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1475] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1479] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1480] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1481] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1482] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1483] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1484] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1488] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1492] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1493] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1495] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1496] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1497] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1498] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1499] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1500] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1504] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1505] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1506] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1507] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1508] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1509] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1513] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1517] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1518] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1519] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1520] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1521] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1523] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1525] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1526] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1533] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1534] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1535] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1536] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1538] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1539] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1540] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1541] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1542] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1543] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1544] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1545] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1546] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1548] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1552] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1553] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1557] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1558] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1559] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1560] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1561] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1567] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1568] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1569] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1570] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1571] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1573] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1578] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1579] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1580] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1581] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1582] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1583] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1584] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1586] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1592] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1593] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1598] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1599] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1605] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1606] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1611] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1612] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1616] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1617] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1618] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1623] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1624] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1628] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1629] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1630] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1631] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1632] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1633] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1635] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1636] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1637] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1639] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1640] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1641] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1642] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1644] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1648] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1649] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1650] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1651] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1652] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1654] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1655] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1656] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1659] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1665] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1666] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1671] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1672] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1673] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1674] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1680] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1681] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1686] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1687] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1688] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1689] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1693] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1694] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1699] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1700] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1705] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1706] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1707] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1708] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1713] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1714] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1722] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1723] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1724] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1725] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1726] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1728] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1729] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1730] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1731] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1732] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1734] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1735] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1736] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1737] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1738] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1739] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1740] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1742] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1743] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1746] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1751] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1752] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1757] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1758] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1759] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1760] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1761] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1762] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1763] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1764] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1765] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1767] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1769] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1774] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1775] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1776] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1778] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1779] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1781] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1786] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1791] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1792] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1793] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1794] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1795] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1797] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1800] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1806] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1807] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1808] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1809] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1811] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1812] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1815] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1816] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1818] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1819] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1822] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1827] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1828] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1829] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1830] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1831] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1832] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1834] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1838] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1839] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1843] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1844] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1845] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1846] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1847] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1848] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1849] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1852] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1856] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1857] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1858] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1859] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1860] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1861] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1862] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1863] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1866] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1871] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1872] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1873] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1874] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1875] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1876] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[1882] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[2035] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[2037] = 0;
  _$jscoverage['/underscore-umd.js'].lineData[2039] = 0;
}
if (! _$jscoverage['/underscore-umd.js'].functionData) {
  _$jscoverage['/underscore-umd.js'].functionData = [];
  _$jscoverage['/underscore-umd.js'].functionData[0] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[1] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[2] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[3] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[4] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[5] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[6] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[7] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[8] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[9] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[10] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[11] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[12] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[13] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[14] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[15] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[16] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[17] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[18] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[19] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[20] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[21] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[22] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[23] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[24] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[25] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[26] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[27] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[28] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[29] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[30] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[31] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[32] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[33] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[34] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[35] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[36] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[37] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[38] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[39] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[40] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[41] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[42] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[43] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[44] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[45] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[46] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[47] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[48] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[49] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[50] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[51] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[52] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[53] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[54] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[55] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[56] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[57] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[58] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[59] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[60] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[61] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[62] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[63] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[64] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[65] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[66] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[67] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[68] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[69] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[70] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[71] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[72] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[73] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[74] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[75] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[76] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[77] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[78] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[79] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[80] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[81] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[82] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[83] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[84] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[85] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[86] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[87] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[88] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[89] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[90] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[91] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[92] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[93] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[94] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[95] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[96] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[97] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[98] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[99] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[100] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[101] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[102] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[103] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[104] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[105] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[106] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[107] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[108] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[109] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[110] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[111] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[112] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[113] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[114] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[115] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[116] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[117] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[118] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[119] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[120] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[121] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[122] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[123] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[124] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[125] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[126] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[127] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[128] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[129] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[130] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[131] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[132] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[133] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[134] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[135] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[136] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[137] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[138] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[139] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[140] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[141] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[142] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[143] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[144] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[145] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[146] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[147] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[148] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[149] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[150] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[151] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[152] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[153] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[154] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[155] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[156] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[157] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[158] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[159] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[160] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[161] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[162] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[163] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[164] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[165] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[166] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[167] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[168] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[169] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[170] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[171] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[172] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[173] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[174] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[175] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[176] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[177] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[178] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[179] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[180] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[181] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[182] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[183] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[184] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[185] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[186] = 0;
  _$jscoverage['/underscore-umd.js'].functionData[187] = 0;
}
if (! _$jscoverage['/underscore-umd.js'].branchData) {
  _$jscoverage['/underscore-umd.js'].branchData = {};
  _$jscoverage['/underscore-umd.js'].branchData['2'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['2'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['2'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['2'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['3'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['3'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['3'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['4'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['4'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['4'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['21'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['21'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['21'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['21'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['21'][4] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['21'][5] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['21'][6] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['21'][7] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['22'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['22'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['22'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['22'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['22'][4] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['28'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['28'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['37'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['37'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['38'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['38'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['45'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['45'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['65'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['65'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['70'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['70'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['79'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['79'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['90'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['90'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['90'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['90'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['90'][4] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['95'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['95'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['100'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['100'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['105'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['105'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['105'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['105'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['105'][4] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['105'][5] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['110'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['110'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['110'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['117'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['117'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['139'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['139'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['140'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['140'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['140'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['140'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['140'][4] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['140'][5] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['142'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['142'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['142'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['154'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['154'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['156'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['156'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['156'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['163'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['163'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['163'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['163'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['166'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['166'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['170'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['170'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['174'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['174'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['174'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['182'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['182'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['193'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['193'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['193'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['198'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['198'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['212'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['212'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['212'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['212'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['212'][4] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['212'][5] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['219'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['219'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['235'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['235'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['235'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['236'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['236'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['239'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['239'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['250'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['250'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['252'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['252'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['267'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['267'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['267'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['271'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['271'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['273'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['273'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['275'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['275'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['275'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['275'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['284'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['284'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['285'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['285'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['287'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['287'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['289'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['289'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['296'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['296'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['300'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['300'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['300'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['301'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['301'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['301'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['302'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['302'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['303'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['303'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['309'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['309'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['311'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['311'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['313'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['313'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['313'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['322'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['322'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['323'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['323'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['346'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['346'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['347'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['347'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['359'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['359'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['359'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['359'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['359'][4] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['361'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['361'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['361'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['361'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['363'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['363'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['363'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['366'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['366'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['366'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['366'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['366'][4] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['366'][5] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['373'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['373'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['374'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['374'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['377'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['377'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['379'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['379'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['379'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['379'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['380'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['380'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['390'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['390'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['394'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['394'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['394'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['396'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['396'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['396'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['396'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['402'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['402'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['404'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['404'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['411'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['411'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['412'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['412'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['414'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['414'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['415'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['415'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['415'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['415'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['418'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['418'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['419'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['419'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['419'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['419'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['424'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['424'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['424'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['424'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['424'][4] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['424'][5] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['424'][6] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['426'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['426'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['435'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['435'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['436'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['436'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['438'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['438'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['441'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['441'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['441'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['449'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['449'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['452'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['452'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['454'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['454'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['455'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['455'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['462'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['462'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['463'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['463'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['466'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['466'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['466'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['482'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['482'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['486'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['486'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['497'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['497'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['500'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['500'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['501'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['501'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['502'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['502'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['507'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['507'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['507'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['524'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['524'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['526'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['526'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['528'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['528'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['537'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['537'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['549'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['549'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['559'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['559'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['569'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['569'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['578'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['578'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['579'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['579'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['579'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['579'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['580'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['580'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['584'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['584'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['586'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['586'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['586'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['611'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['611'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['612'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['612'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['625'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['625'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['631'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['631'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['632'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['632'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['646'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['646'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['659'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['659'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['660'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['660'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['663'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['663'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['672'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['672'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['681'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['681'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['683'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['683'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['716'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['716'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['717'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['717'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['738'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['738'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['739'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['739'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['740'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['740'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['755'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['755'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['766'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['766'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['778'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['778'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['788'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['788'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['794'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['794'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['802'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['802'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['817'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['817'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['818'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['818'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['883'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['883'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['888'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['888'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['889'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['889'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['890'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['890'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['900'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['900'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['902'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['902'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['904'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['904'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['914'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['914'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['916'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['916'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['953'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['953'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['954'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['954'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['956'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['956'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['957'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['957'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['958'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['958'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['962'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['962'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['972'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['972'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['986'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['986'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['989'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['989'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1002'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1002'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1003'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1003'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1005'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1005'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1016'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1016'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1031'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1031'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1032'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1032'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1032'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1034'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1034'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1038'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1038'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1040'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1040'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1040'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1042'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1042'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1047'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1047'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1049'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1049'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1062'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1062'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1063'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1063'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1074'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1074'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1075'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1075'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1102'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1102'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1105'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1105'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1108'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1108'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1113'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1113'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1113'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1117'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1117'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1117'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1117'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1118'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1118'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1124'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1124'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1125'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1125'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1125'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1149'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1149'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1153'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1153'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1155'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1155'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1163'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1163'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1165'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1165'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1200'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1200'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1208'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1208'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1219'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1219'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1222'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1222'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1235'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1235'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1237'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1237'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1246'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1246'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1247'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1247'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1247'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1247'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1248'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1248'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1266'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1266'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1268'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1268'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1277'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1277'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1278'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1278'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1279'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1279'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1281'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1281'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1283'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1283'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1283'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1285'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1285'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1287'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1287'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1289'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1289'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1291'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1291'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1291'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1291'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1291'][4] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1292'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1292'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1310'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1310'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1312'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1312'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1312'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1312'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1328'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1328'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1329'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1329'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1334'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1334'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1344'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1344'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1345'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1345'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1347'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1347'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1348'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1348'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1359'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1359'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1360'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1360'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1361'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1361'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1362'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1362'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1363'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1363'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1366'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1366'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1366'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1366'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1367'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1367'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1374'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1374'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1391'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1391'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1404'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1404'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1405'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1405'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1406'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1406'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1407'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1407'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1408'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1408'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1416'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1416'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1417'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1417'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1418'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1418'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1419'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1419'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1420'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1420'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1427'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1427'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1428'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1428'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1428'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1429'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1429'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1435'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1435'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1444'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1444'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1445'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1445'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1448'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1448'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1451'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1451'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1470'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1470'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1470'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1470'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1470'][4] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1470'][5] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1470'][6] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1470'][7] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1471'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1471'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1472'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1472'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1474'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1474'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1474'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1474'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1482'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1482'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1482'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1482'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1482'][4] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1482'][5] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1495'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1495'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1495'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1495'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1495'][4] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1495'][5] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1495'][6] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1495'][7] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1496'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1496'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1497'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1497'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1499'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1499'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1499'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1499'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1507'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1507'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1507'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1507'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1507'][4] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1507'][5] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1519'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1519'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1520'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1520'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1521'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1521'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1525'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1525'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1534'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1534'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1534'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1535'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1535'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1542'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1542'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1569'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1569'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1570'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1570'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1570'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1570'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1571'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1571'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1571'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1571'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1580'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1580'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1593'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1593'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1606'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1606'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1612'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1612'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1617'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1617'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1618'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1618'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1630'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1630'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1631'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1631'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1632'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1632'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1639'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1639'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1642'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1642'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1650'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1650'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1652'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1652'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1666'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1666'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1666'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1672'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1672'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1672'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1672'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1672'][4] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1672'][5] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1673'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1673'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1673'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1681'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1681'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1681'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1687'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1687'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1687'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1687'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1687'][4] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1687'][5] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1688'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1688'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1688'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1723'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1723'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1728'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1728'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1731'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1731'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1733'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1733'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1734'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1734'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1735'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1735'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1735'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1737'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1737'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1738'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1738'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1742'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1742'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1760'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1760'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1762'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1762'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1764'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1764'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1765'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1765'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1767'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1767'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1775'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1775'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1775'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1778'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1778'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1793'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1793'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1794'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1794'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1807'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1807'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1808'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1808'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1811'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1811'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1812'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1812'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1818'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1818'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1828'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1828'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1828'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1828'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1831'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1831'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1839'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1839'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1860'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1860'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1862'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1862'][1] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1862'][2] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1862'][3] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1862'][4] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1862'][5] = new BranchData();
  _$jscoverage['/underscore-umd.js'].branchData['1875'] = [];
  _$jscoverage['/underscore-umd.js'].branchData['1875'][1] = new BranchData();
}
_$jscoverage['/underscore-umd.js'].branchData['22'][4].init(41, 24);
function visit444_22_4(result) {
  _$jscoverage['/underscore-umd.js'].branchData['22'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['424'][6].init(31, 45);
function visit443_424_6(result) {
  _$jscoverage['/underscore-umd.js'].branchData['424'][6].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['22'][3].init(12, 25);
function visit442_22_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['22'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['21'][7].init(40, 18);
function visit441_21_7(result) {
  _$jscoverage['/underscore-umd.js'].branchData['21'][7].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1507'][5].init(64, 19);
function visit440_1507_5(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1507'][5].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1495'][7].init(59, 25);
function visit439_1495_7(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1495'][7].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1482'][5].init(65, 20);
function visit438_1482_5(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1482'][5].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1470'][7].init(59, 25);
function visit437_1470_7(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1470'][7].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['424'][5].init(31, 99);
function visit436_424_5(result) {
  _$jscoverage['/underscore-umd.js'].branchData['424'][5].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['22'][2].init(12, 53);
function visit435_22_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['22'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['21'][6].init(13, 23);
function visit434_21_6(result) {
  _$jscoverage['/underscore-umd.js'].branchData['21'][6].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1862'][5].init(33, 17);
function visit433_1862_5(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1862'][5].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1507'][4].init(39, 21);
function visit432_1507_4(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1507'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1499'][3].init(29, 14);
function visit431_1499_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1499'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1495'][6].init(88, 11);
function visit430_1495_6(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1495'][6].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1495'][5].init(28, 27);
function visit429_1495_5(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1495'][5].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1482'][4].init(39, 22);
function visit428_1482_4(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1482'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1474'][3].init(29, 14);
function visit427_1474_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1474'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1470'][6].init(88, 11);
function visit426_1470_6(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1470'][6].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1470'][5].init(28, 27);
function visit425_1470_5(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1470'][5].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['424'][4].init(31, 125);
function visit424_424_4(result) {
  _$jscoverage['/underscore-umd.js'].branchData['424'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['22'][1].init(12, 63);
function visit423_22_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['22'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['21'][5].init(13, 45);
function visit422_21_5(result) {
  _$jscoverage['/underscore-umd.js'].branchData['21'][5].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1862'][4].init(55, 16);
function visit421_1862_4(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1862'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1862'][3].init(13, 16);
function visit420_1862_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1862'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1742'][1].init(17, 24);
function visit419_1742_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1742'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1738'][1].init(12, 25);
function visit418_1738_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1738'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1735'][2].init(18, 17);
function visit417_1735_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1735'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1571'][3].init(21, 12);
function visit416_1571_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1571'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1570'][3].init(21, 12);
function visit415_1570_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1570'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1507'][3].init(39, 44);
function visit414_1507_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1507'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1499'][2].init(12, 13);
function visit413_1499_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1499'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1495'][4].init(28, 56);
function visit412_1495_4(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1495'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1482'][3].init(39, 46);
function visit411_1482_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1482'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1474'][2].init(12, 13);
function visit410_1474_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1474'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1470'][4].init(28, 56);
function visit409_1470_4(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1470'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1047'][1].init(17, 7);
function visit408_1047_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1047'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['586'][2].init(27, 19);
function visit407_586_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['586'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['466'][2].init(14, 51);
function visit406_466_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['466'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['426'][1].init(30, 40);
function visit405_426_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['426'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['424'][3].init(10, 15);
function visit404_424_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['424'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['419'][3].init(34, 20);
function visit403_419_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['419'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['415'][3].init(37, 29);
function visit402_415_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['415'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['366'][5].init(31, 17);
function visit401_366_5(result) {
  _$jscoverage['/underscore-umd.js'].branchData['366'][5].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['359'][4].init(35, 15);
function visit400_359_4(result) {
  _$jscoverage['/underscore-umd.js'].branchData['359'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['301'][2].init(6, 29);
function visit399_301_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['301'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['275'][3].init(25, 25);
function visit398_275_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['275'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['212'][5].init(48, 17);
function visit397_212_5(result) {
  _$jscoverage['/underscore-umd.js'].branchData['212'][5].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['140'][5].init(34, 28);
function visit396_140_5(result) {
  _$jscoverage['/underscore-umd.js'].branchData['140'][5].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['105'][5].init(27, 13);
function visit395_105_5(result) {
  _$jscoverage['/underscore-umd.js'].branchData['105'][5].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['90'][4].init(34, 17);
function visit394_90_4(result) {
  _$jscoverage['/underscore-umd.js'].branchData['90'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['21'][4].init(13, 53);
function visit393_21_4(result) {
  _$jscoverage['/underscore-umd.js'].branchData['21'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['4'][2].init(61, 14);
function visit392_4_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['4'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1862'][2].init(13, 37);
function visit391_1862_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1862'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1828'][3].init(25, 9);
function visit390_1828_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1828'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1765'][1].init(12, 29);
function visit389_1765_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1765'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1737'][1].init(17, 8);
function visit388_1737_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1737'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1735'][1].init(12, 23);
function visit387_1735_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1735'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1687'][5].init(50, 9);
function visit386_1687_5(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1687'][5].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1687'][4].init(25, 16);
function visit385_1687_4(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1687'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1672'][5].init(50, 9);
function visit384_1672_5(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1672'][5].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1672'][4].init(25, 16);
function visit383_1672_4(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1672'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1571'][2].init(12, 5);
function visit382_1571_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1571'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1570'][2].init(12, 5);
function visit381_1570_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1570'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1507'][2].init(12, 23);
function visit380_1507_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1507'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1499'][1].init(12, 31);
function visit379_1499_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1499'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1495'][3].init(28, 71);
function visit378_1495_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1495'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1482'][2].init(12, 23);
function visit377_1482_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1482'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1474'][1].init(12, 31);
function visit376_1474_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1474'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1470'][3].init(28, 71);
function visit375_1470_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1470'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1366'][3].init(27, 14);
function visit374_1366_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1366'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1312'][3].init(26, 10);
function visit373_1312_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1312'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1291'][4].init(55, 12);
function visit372_1291_4(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1291'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1285'][1].init(15, 19);
function visit371_1285_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1285'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1283'][2].init(17, 18);
function visit370_1283_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1283'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1281'][1].init(19, 8);
function visit369_1281_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1281'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1279'][1].init(14, 8);
function visit368_1279_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1279'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1247'][3].init(27, 14);
function visit367_1247_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1247'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1125'][2].init(29, 26);
function visit366_1125_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1125'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1117'][3].init(28, 16);
function visit365_1117_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1117'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1049'][1].init(17, 7);
function visit364_1049_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1049'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1042'][1].init(12, 9);
function visit363_1042_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1042'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1040'][2].init(33, 38);
function visit362_1040_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1040'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['904'][1].init(17, 8);
function visit361_904_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['904'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['586'][1].init(14, 32);
function visit360_586_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['586'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['579'][3].init(24, 11);
function visit359_579_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['579'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['466'][1].init(12, 54);
function visit358_466_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['466'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['455'][1].init(12, 41);
function visit357_455_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['455'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['441'][2].init(39, 20);
function visit356_441_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['441'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['424'][2].init(10, 147);
function visit355_424_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['424'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['419'][2].init(10, 20);
function visit354_419_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['419'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['415'][2].init(12, 21);
function visit353_415_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['415'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['396'][3].init(45, 9);
function visit352_396_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['396'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['379'][3].init(27, 30);
function visit351_379_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['379'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['366'][4].init(52, 20);
function visit350_366_4(result) {
  _$jscoverage['/underscore-umd.js'].branchData['366'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['366'][3].init(8, 19);
function visit349_366_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['366'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['361'][3].init(21, 9);
function visit348_361_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['361'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['359'][3].init(24, 7);
function visit347_359_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['359'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['313'][2].init(10, 23);
function visit346_313_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['313'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['301'][1].init(6, 51);
function visit345_301_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['301'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['275'][2].init(10, 40);
function visit344_275_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['275'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['236'][1].init(18, 63);
function visit343_236_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['236'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['212'][4].init(69, 31);
function visit342_212_4(result) {
  _$jscoverage['/underscore-umd.js'].branchData['212'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['212'][3].init(13, 31);
function visit341_212_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['212'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['163'][3].init(11, 11);
function visit340_163_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['163'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['142'][2].init(13, 24);
function visit339_142_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['142'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['140'][4].init(66, 29);
function visit338_140_4(result) {
  _$jscoverage['/underscore-umd.js'].branchData['140'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['140'][3].init(6, 24);
function visit337_140_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['140'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['105'][4].init(44, 41);
function visit336_105_4(result) {
  _$jscoverage['/underscore-umd.js'].branchData['105'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['105'][3].init(11, 12);
function visit335_105_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['105'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['90'][3].init(34, 26);
function visit334_90_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['90'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['21'][3].init(13, 132);
function visit333_21_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['21'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['4'][1].init(12, 33);
function visit332_4_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['4'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['3'][2].init(2, 28);
function visit331_3_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['3'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['2'][3].init(33, 29);
function visit330_2_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['2'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1862'][1].init(12, 59);
function visit329_1862_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1862'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1828'][2].init(8, 13);
function visit328_1828_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1828'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1812'][1].init(13, 12);
function visit327_1812_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1812'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1808'][1].init(13, 10);
function visit326_1808_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1808'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1794'][1].init(10, 6);
function visit325_1794_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1794'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1775'][2].init(17, 37);
function visit324_1775_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1775'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1767'][1].init(10, 16);
function visit323_1767_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1767'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1764'][1].init(18, 14);
function visit322_1764_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1764'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1762'][1].init(10, 22);
function visit321_1762_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1762'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1734'][1].init(10, 21);
function visit320_1734_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1734'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1733'][1].init(21, 8);
function visit319_1733_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1733'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1688'][2].init(8, 9);
function visit318_1688_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1688'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1687'][3].init(50, 18);
function visit317_1687_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1687'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1687'][2].init(8, 13);
function visit316_1687_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1687'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1681'][2].init(29, 9);
function visit315_1681_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1681'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1673'][2].init(8, 9);
function visit314_1673_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1673'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1672'][3].init(50, 18);
function visit313_1672_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1672'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1672'][2].init(8, 13);
function visit312_1672_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1672'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1666'][2].init(60, 9);
function visit311_1666_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1666'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1652'][1].init(10, 15);
function visit310_1652_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1652'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1642'][1].init(10, 25);
function visit309_1642_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1642'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1632'][1].init(10, 15);
function visit308_1632_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1632'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1571'][1].init(12, 21);
function visit307_1571_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1571'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1570'][1].init(12, 21);
function visit306_1570_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1570'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1535'][1].init(10, 17);
function visit305_1535_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1535'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1534'][2].init(8, 9);
function visit304_1534_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1534'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1507'][1].init(12, 71);
function visit303_1507_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1507'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1497'][1].init(43, 10);
function visit302_1497_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1497'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1496'][1].init(12, 16);
function visit301_1496_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1496'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1495'][2].init(8, 16);
function visit300_1495_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1495'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1482'][1].init(12, 73);
function visit299_1482_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1482'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1472'][1].init(43, 10);
function visit298_1472_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1472'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1471'][1].init(12, 16);
function visit297_1471_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1471'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1470'][2].init(8, 16);
function visit296_1470_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1470'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1448'][1].init(12, 15);
function visit295_1448_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1448'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1445'][1].init(12, 33);
function visit294_1445_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1445'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1428'][2].init(8, 28);
function visit293_1428_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1428'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1420'][1].init(10, 43);
function visit292_1420_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1420'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1419'][1].init(23, 5);
function visit291_1419_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1419'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1408'][1].init(10, 44);
function visit290_1408_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1408'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1407'][1].init(23, 5);
function visit289_1407_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1407'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1367'][1].init(25, 5);
function visit288_1367_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1367'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1366'][2].init(13, 10);
function visit287_1366_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1366'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1363'][1].init(19, 5);
function visit286_1363_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1363'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1348'][1].init(23, 5);
function visit285_1348_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1348'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1334'][1].init(41, 10);
function visit284_1334_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1334'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1329'][1].init(39, 10);
function visit283_1329_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1329'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1312'][2].init(8, 14);
function visit282_1312_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1312'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1292'][1].init(12, 19);
function visit281_1292_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1292'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1291'][3].init(43, 8);
function visit280_1291_3(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1291'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1289'][1].init(15, 8);
function visit279_1289_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1289'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1283'][1].init(17, 28);
function visit278_1283_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1283'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1278'][1].init(12, 7);
function visit277_1278_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1278'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1268'][1].init(10, 28);
function visit276_1268_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1268'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1248'][1].init(12, 37);
function visit275_1248_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1248'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1247'][2].init(13, 10);
function visit274_1247_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1247'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1237'][1].init(10, 29);
function visit273_1237_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1237'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1165'][1].init(12, 9);
function visit272_1165_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1165'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1155'][1].init(12, 8);
function visit271_1155_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1155'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1153'][1].init(12, 10);
function visit270_1153_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1153'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1125'][1].init(17, 38);
function visit269_1125_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1125'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1124'][1].init(12, 8);
function visit268_1124_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1124'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1118'][1].init(12, 7);
function visit267_1118_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1118'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1117'][2].init(10, 14);
function visit266_1117_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1117'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1113'][2].init(23, 25);
function visit265_1113_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1113'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1040'][1].init(10, 62);
function visit264_1040_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1040'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1034'][1].init(15, 10);
function visit263_1034_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1034'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1032'][2].init(18, 11);
function visit262_1032_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1032'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1003'][1].init(18, 28);
function visit261_1003_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1003'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['962'][1].init(12, 18);
function visit260_962_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['962'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['958'][1].init(10, 15);
function visit259_958_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['958'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['957'][1].init(17, 11);
function visit258_957_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['957'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['954'][1].init(13, 22);
function visit257_954_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['954'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['916'][1].init(10, 30);
function visit256_916_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['916'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['902'][1].init(17, 11);
function visit255_902_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['902'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['683'][1].init(10, 16);
function visit254_683_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['683'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['660'][1].init(10, 11);
function visit253_660_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['660'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['584'][1].init(24, 5);
function visit252_584_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['584'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['579'][2].init(10, 10);
function visit251_579_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['579'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['507'][2].init(13, 26);
function visit250_507_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['507'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['502'][1].init(12, 30);
function visit249_502_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['502'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['463'][1].init(13, 8);
function visit248_463_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['463'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['462'][1].init(10, 25);
function visit247_462_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['462'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['454'][1].init(13, 8);
function visit246_454_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['454'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['452'][1].init(10, 19);
function visit245_452_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['452'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['441'][1].init(10, 20);
function visit244_441_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['441'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['424'][1].init(10, 219);
function visit243_424_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['424'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['419'][1].init(10, 44);
function visit242_419_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['419'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['415'][1].init(12, 54);
function visit241_415_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['415'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['414'][1].init(12, 31);
function visit240_414_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['414'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['396'][2].init(26, 16);
function visit239_396_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['396'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['394'][2].init(30, 9);
function visit238_394_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['394'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['380'][1].init(10, 16);
function visit237_380_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['380'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['379'][2].init(8, 49);
function visit236_379_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['379'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['366'][2].init(8, 40);
function visit235_366_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['366'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['363'][2].init(24, 7);
function visit234_363_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['363'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['361'][2].init(8, 9);
function visit233_361_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['361'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['359'][2].init(24, 26);
function visit232_359_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['359'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['347'][1].init(6, 28);
function visit231_347_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['347'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['313'][1].init(10, 40);
function visit230_313_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['313'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['302'][1].init(14, 12);
function visit229_302_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['302'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['300'][2].init(8, 25);
function visit228_300_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['300'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['275'][1].init(10, 64);
function visit227_275_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['275'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['267'][2].init(16, 50);
function visit226_267_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['267'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['235'][2].init(27, 39);
function visit225_235_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['235'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['212'][2].init(13, 52);
function visit224_212_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['212'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['193'][2].init(11, 32);
function visit223_193_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['193'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['174'][2].init(11, 11);
function visit222_174_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['174'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['163'][2].init(11, 40);
function visit221_163_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['163'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['156'][2].init(16, 26);
function visit220_156_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['156'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['142'][1].init(13, 33);
function visit219_142_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['142'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['140'][2].init(6, 56);
function visit218_140_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['140'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['110'][2].init(21, 18);
function visit217_110_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['110'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['105'][2].init(11, 29);
function visit216_105_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['105'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['90'][2].init(11, 19);
function visit215_90_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['90'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['21'][2].init(13, 173);
function visit214_21_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['21'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['3'][1].init(2, 42);
function visit213_3_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['3'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['2'][2].init(2, 27);
function visit212_2_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['2'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1875'][1].init(10, 11);
function visit211_1875_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1875'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1860'][1].init(10, 11);
function visit210_1860_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1860'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1839'][1].init(20, 6);
function visit209_1839_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1839'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1831'][1].init(11, 10);
function visit208_1831_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1831'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1828'][1].init(8, 26);
function visit207_1828_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1828'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1818'][1].init(22, 12);
function visit206_1818_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1818'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1811'][1].init(8, 5);
function visit205_1811_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1811'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1807'][1].init(8, 12);
function visit204_1807_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1807'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1793'][1].init(46, 10);
function visit203_1793_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1793'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1778'][1].init(24, 14);
function visit202_1778_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1778'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1775'][1].init(17, 42);
function visit201_1775_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1775'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1760'][1].init(47, 10);
function visit200_1760_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1760'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1731'][1].init(47, 10);
function visit199_1731_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1731'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1728'][1].init(8, 16);
function visit198_1728_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1728'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1723'][1].init(8, 20);
function visit197_1723_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1723'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1688'][1].init(8, 18);
function visit196_1688_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1688'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1687'][1].init(8, 33);
function visit195_1687_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1687'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1681'][1].init(29, 18);
function visit194_1681_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1681'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1673'][1].init(8, 18);
function visit193_1673_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1673'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1672'][1].init(8, 33);
function visit192_1672_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1672'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1666'][1].init(60, 18);
function visit191_1666_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1666'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1650'][1].init(8, 22);
function visit190_1650_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1650'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1639'][1].init(42, 10);
function visit189_1639_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1639'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1631'][1].init(8, 22);
function visit188_1631_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1631'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1630'][1].init(8, 11);
function visit187_1630_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1630'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1618'][1].init(11, 16);
function visit186_1618_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1618'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1617'][1].init(8, 11);
function visit185_1617_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1617'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1612'][1].init(11, 4);
function visit184_1612_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1612'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1606'][1].init(8, 18);
function visit183_1606_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1606'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1593'][1].init(8, 18);
function visit182_1593_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1593'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1580'][1].init(19, 9);
function visit181_1580_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1580'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1569'][1].init(10, 7);
function visit180_1569_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1569'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1542'][1].init(24, 9);
function visit179_1542_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1542'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1534'][1].init(8, 18);
function visit178_1534_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1534'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1525'][1].init(8, 16);
function visit177_1525_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1525'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1521'][1].init(8, 13);
function visit176_1521_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1521'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1520'][1].init(8, 12);
function visit175_1520_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1520'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1519'][1].init(8, 4);
function visit174_1519_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1519'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1495'][1].init(8, 91);
function visit173_1495_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1495'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1470'][1].init(8, 91);
function visit172_1470_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1470'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1451'][1].init(13, 14);
function visit171_1451_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1451'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1444'][1].init(10, 7);
function visit170_1444_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1444'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1435'][1].init(8, 18);
function visit169_1435_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1435'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1429'][1].init(11, 34);
function visit168_1429_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1429'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1428'][1].init(8, 37);
function visit167_1428_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1428'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1427'][1].init(8, 17);
function visit166_1427_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1427'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1418'][1].init(24, 14);
function visit165_1418_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1418'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1417'][1].init(18, 12);
function visit164_1417_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1417'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1416'][1].init(16, 30);
function visit163_1416_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1416'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1406'][1].init(24, 14);
function visit162_1406_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1406'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1405'][1].init(18, 12);
function visit161_1405_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1405'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1404'][1].init(16, 30);
function visit160_1404_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1404'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1391'][1].init(10, 29);
function visit159_1391_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1391'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1374'][1].init(20, 21);
function visit158_1374_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1374'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1366'][1].init(13, 28);
function visit157_1366_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1366'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1362'][1].init(10, 8);
function visit156_1362_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1362'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1361'][1].init(18, 7);
function visit155_1361_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1361'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1360'][1].init(20, 12);
function visit154_1360_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1360'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1359'][1].init(18, 30);
function visit153_1359_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1359'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1347'][1].init(24, 14);
function visit152_1347_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1347'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1345'][1].init(18, 12);
function visit151_1345_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1345'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1344'][1].init(16, 30);
function visit150_1344_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1344'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1328'][1].init(8, 16);
function visit149_1328_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1328'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1312'][1].init(8, 28);
function visit148_1312_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1312'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1310'][1].init(20, 16);
function visit147_1310_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1310'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1291'][2].init(43, 24);
function visit146_1291_2(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1291'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1291'][1].init(17, 7);
function visit145_1291_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1291'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1287'][1].init(10, 13);
function visit144_1287_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1287'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1277'][1].init(10, 22);
function visit143_1277_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1277'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1266'][1].init(11, 10);
function visit142_1266_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1266'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1247'][1].init(13, 28);
function visit141_1247_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1247'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1246'][1].init(18, 7);
function visit140_1246_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1246'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1235'][1].init(43, 10);
function visit139_1235_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1235'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1222'][1].init(10, 10);
function visit138_1222_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1222'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1219'][1].init(10, 11);
function visit137_1219_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1219'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1208'][1].init(10, 11);
function visit136_1208_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1208'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1200'][1].init(13, 3);
function visit135_1200_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1200'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1163'][1].init(10, 8);
function visit134_1163_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1163'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1149'][1].init(10, 13);
function visit133_1149_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1149'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1117'][1].init(10, 34);
function visit132_1117_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1117'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1113'][1].init(10, 38);
function visit131_1113_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1113'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1108'][1].init(10, 8);
function visit130_1108_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1108'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1105'][1].init(17, 25);
function visit129_1105_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1105'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1102'][1].init(8, 8);
function visit128_1102_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1102'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1075'][1].init(10, 22);
function visit127_1075_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1075'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1074'][1].init(26, 6);
function visit126_1074_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1074'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1063'][1].init(11, 7);
function visit125_1063_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1063'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1062'][1].init(8, 9);
function visit124_1062_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1062'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1038'][1].init(47, 10);
function visit123_1038_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1038'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1032'][1].init(8, 21);
function visit122_1032_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1032'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1031'][1].init(13, 12);
function visit121_1031_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1031'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1016'][1].init(8, 19);
function visit120_1016_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1016'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1005'][1].init(13, 27);
function visit119_1005_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1005'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['1002'][1].init(22, 10);
function visit118_1002_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['1002'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['989'][1].init(8, 16);
function visit117_989_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['989'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['986'][1].init(8, 38);
function visit116_986_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['986'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['972'][1].init(11, 6);
function visit115_972_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['972'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['956'][1].init(20, 10);
function visit114_956_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['956'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['953'][1].init(8, 7);
function visit113_953_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['953'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['914'][1].init(8, 8);
function visit112_914_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['914'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['900'][1].init(10, 6);
function visit111_900_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['900'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['890'][1].init(7, 28);
function visit110_890_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['890'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['889'][1].init(7, 31);
function visit109_889_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['889'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['888'][1].init(7, 26);
function visit108_888_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['888'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['883'][1].init(8, 24);
function visit107_883_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['883'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['818'][1].init(13, 23);
function visit106_818_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['818'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['817'][1].init(15, 14);
function visit105_817_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['817'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['802'][1].init(12, 61);
function visit104_802_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['802'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['794'][1].init(8, 11);
function visit103_794_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['794'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['788'][1].init(20, 5);
function visit102_788_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['788'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['778'][1].init(8, 11);
function visit101_778_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['778'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['766'][1].init(24, 14);
function visit100_766_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['766'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['755'][1].init(8, 25);
function visit99_755_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['755'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['740'][1].init(8, 34);
function visit98_740_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['740'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['739'][1].init(8, 19);
function visit97_739_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['739'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['738'][1].init(8, 13);
function visit96_738_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['738'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['717'][1].init(12, 16);
function visit95_717_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['717'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['716'][1].init(8, 18);
function visit94_716_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['716'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['681'][1].init(20, 10);
function visit93_681_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['681'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['672'][1].init(11, 18);
function visit92_672_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['672'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['663'][1].init(11, 6);
function visit91_663_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['663'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['659'][1].init(20, 10);
function visit90_659_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['659'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['646'][1].init(11, 13);
function visit89_646_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['646'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['632'][1].init(11, 12);
function visit88_632_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['632'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['631'][1].init(8, 14);
function visit87_631_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['631'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['625'][1].init(8, 5);
function visit86_625_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['625'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['612'][1].init(8, 12);
function visit85_612_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['612'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['611'][1].init(8, 20);
function visit84_611_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['611'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['580'][1].init(26, 14);
function visit83_580_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['580'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['579'][1].init(10, 25);
function visit82_579_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['579'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['578'][1].init(10, 8);
function visit81_578_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['578'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['569'][1].init(10, 22);
function visit80_569_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['569'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['559'][1].init(43, 10);
function visit79_559_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['559'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['549'][1].init(20, 10);
function visit78_549_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['549'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['537'][1].init(20, 10);
function visit77_537_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['537'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['528'][1].init(14, 6);
function visit76_528_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['528'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['526'][1].init(18, 6);
function visit75_526_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['526'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['524'][1].init(14, 6);
function visit74_524_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['524'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['507'][1].init(13, 61);
function visit73_507_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['507'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['501'][1].init(22, 10);
function visit72_501_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['501'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['500'][1].init(10, 15);
function visit71_500_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['500'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['497'][1].init(10, 11);
function visit70_497_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['497'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['486'][1].init(8, 10);
function visit69_486_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['486'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['482'][1].init(8, 14);
function visit68_482_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['482'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['449'][1].init(8, 9);
function visit67_449_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['449'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['438'][1].init(11, 8);
function visit66_438_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['438'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['436'][1].init(13, 12);
function visit65_436_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['436'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['435'][1].init(13, 12);
function visit64_435_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['435'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['418'][1].init(8, 10);
function visit63_418_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['418'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['412'][1].init(8, 31);
function visit62_412_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['412'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['411'][1].init(20, 30);
function visit61_411_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['411'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['404'][1].init(15, 59);
function visit60_404_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['404'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['402'][1].init(15, 9);
function visit59_402_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['402'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['396'][1].init(15, 8);
function visit58_396_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['396'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['394'][1].init(12, 9);
function visit57_394_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['394'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['390'][1].init(15, 17);
function visit56_390_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['390'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['379'][1].init(8, 68);
function visit55_379_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['379'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['377'][1].init(8, 30);
function visit54_377_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['377'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['374'][1].init(8, 16);
function visit53_374_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['374'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['373'][1].init(8, 16);
function visit52_373_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['373'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['366'][1].init(8, 64);
function visit51_366_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['366'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['363'][1].init(8, 7);
function visit50_363_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['363'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['361'][1].init(8, 22);
function visit49_361_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['361'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['359'][1].init(8, 7);
function visit48_359_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['359'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['346'][1].init(6, 35);
function visit47_346_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['346'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['323'][1].init(8, 22);
function visit46_323_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['323'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['322'][1].init(8, 18);
function visit45_322_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['322'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['311'][1].init(20, 10);
function visit44_311_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['311'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['309'][1].init(8, 14);
function visit43_309_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['309'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['303'][1].init(11, 26);
function visit42_303_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['303'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['300'][1].init(8, 94);
function visit41_300_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['300'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['296'][1].init(8, 11);
function visit40_296_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['296'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['289'][1].init(8, 10);
function visit39_289_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['289'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['287'][1].init(29, 15);
function visit38_287_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['287'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['285'][1].init(8, 10);
function visit37_285_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['285'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['284'][1].init(8, 14);
function visit36_284_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['284'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['273'][1].init(11, 12);
function visit35_273_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['273'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['271'][1].init(8, 40);
function visit34_271_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['271'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['267'][1].init(16, 62);
function visit33_267_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['267'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['252'][1].init(39, 18);
function visit32_252_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['252'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['250'][1].init(37, 5);
function visit31_250_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['250'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['239'][1].init(23, 19);
function visit30_239_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['239'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['235'][1].init(11, 12);
function visit29_235_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['235'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['219'][1].init(13, 11);
function visit28_219_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['219'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['212'][1].init(13, 87);
function visit27_212_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['212'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['198'][1].init(11, 28);
function visit26_198_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['198'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['193'][1].init(11, 59);
function visit25_193_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['193'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['182'][1].init(8, 23);
function visit24_182_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['182'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['174'][1].init(11, 44);
function visit23_174_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['174'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['170'][1].init(16, 35);
function visit22_170_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['170'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['166'][1].init(22, 15);
function visit21_166_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['166'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['163'][1].init(11, 69);
function visit20_163_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['163'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['156'][1].init(16, 51);
function visit19_156_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['156'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['154'][1].init(8, 66);
function visit18_154_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['154'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['140'][1].init(6, 89);
function visit17_140_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['140'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['139'][1].init(17, 41);
function visit16_139_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['139'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['117'][1].init(13, 26);
function visit15_117_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['117'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['110'][1].init(14, 25);
function visit14_110_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['110'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['105'][1].init(11, 74);
function visit13_105_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['105'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['100'][1].init(11, 14);
function visit12_100_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['100'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['95'][1].init(11, 12);
function visit11_95_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['95'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['90'][1].init(11, 49);
function visit10_90_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['90'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['79'][1].init(22, 18);
function visit9_79_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['79'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['70'][1].init(13, 14);
function visit8_70_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['70'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['65'][1].init(17, 18);
function visit7_65_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['65'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['45'][1].init(21, 41);
function visit6_45_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['45'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['38'][1].init(25, 31);
function visit5_38_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['38'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['37'][1].init(28, 34);
function visit4_37_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['37'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['28'][1].init(20, 29);
function visit3_28_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['28'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['21'][1].init(13, 191);
function visit2_21_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['21'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].branchData['2'][1].init(2, 60);
function visit1_2_1(result) {
  _$jscoverage['/underscore-umd.js'].branchData['2'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore-umd.js'].lineData[1]++;
(function(global, factory) {
  _$jscoverage['/underscore-umd.js'].functionData[0]++;
  _$jscoverage['/underscore-umd.js'].lineData[2]++;
  visit1_2_1(visit212_2_2(typeof exports === 'object') && visit330_2_3(typeof module !== 'undefined')) ? module.exports = factory() : visit213_3_1(visit331_3_2(typeof define === 'function') && define.amd) ? define('underscore', factory) : (global = visit332_4_1(typeof globalThis !== 'undefined') ? globalThis : visit392_4_2(global || self), function() {
    _$jscoverage['/underscore-umd.js'].functionData[1]++;
    _$jscoverage['/underscore-umd.js'].lineData[5]++;
    var current = global._;
    _$jscoverage['/underscore-umd.js'].lineData[6]++;
    var exports = global._ = factory();
    _$jscoverage['/underscore-umd.js'].lineData[7]++;
    exports.noConflict = function() {
      _$jscoverage['/underscore-umd.js'].functionData[2]++;
      global._ = current;
      return exports;
    };
  }());
})(this, function() {
  _$jscoverage['/underscore-umd.js'].functionData[3]++;
  _$jscoverage['/underscore-umd.js'].lineData[16]++;
  var VERSION = '1.13.2';
  _$jscoverage['/underscore-umd.js'].lineData[21]++;
  var root = visit2_21_1(visit214_21_2(visit333_21_3(visit393_21_4(visit422_21_5(visit434_21_6(typeof self == 'object') && visit441_21_7(self.self === self)) && self) || visit423_22_1(visit435_22_2(visit442_22_3(typeof global == 'object') && visit444_22_4(global.global === global)) && global)) || Function('return this')()) || {});
  _$jscoverage['/underscore-umd.js'].lineData[27]++;
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
  _$jscoverage['/underscore-umd.js'].lineData[28]++;
  var SymbolProto = visit3_28_1(typeof Symbol !== 'undefined') ? Symbol.prototype : null;
  _$jscoverage['/underscore-umd.js'].lineData[31]++;
  var push = ArrayProto.push, slice = ArrayProto.slice, toString = ObjProto.toString, hasOwnProperty = ObjProto.hasOwnProperty;
  _$jscoverage['/underscore-umd.js'].lineData[37]++;
  var supportsArrayBuffer = visit4_37_1(typeof ArrayBuffer !== 'undefined'), supportsDataView = visit5_38_1(typeof DataView !== 'undefined');
  _$jscoverage['/underscore-umd.js'].lineData[42]++;
  var nativeIsArray = Array.isArray, nativeKeys = Object.keys, nativeCreate = Object.create, nativeIsView = visit6_45_1(supportsArrayBuffer && ArrayBuffer.isView);
  _$jscoverage['/underscore-umd.js'].lineData[48]++;
  var _isNaN = isNaN, _isFinite = isFinite;
  _$jscoverage['/underscore-umd.js'].lineData[52]++;
  var hasEnumBug = !{toString:null}.propertyIsEnumerable('toString');
  _$jscoverage['/underscore-umd.js'].lineData[53]++;
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
  _$jscoverage['/underscore-umd.js'].lineData[57]++;
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  _$jscoverage['/underscore-umd.js'].lineData[64]++;
  function restArguments(func, startIndex) {
    _$jscoverage['/underscore-umd.js'].functionData[4]++;
    _$jscoverage['/underscore-umd.js'].lineData[65]++;
    startIndex = visit7_65_1(startIndex == null) ? func.length - 1 : +startIndex;
    _$jscoverage['/underscore-umd.js'].lineData[66]++;
    return function() {
      _$jscoverage['/underscore-umd.js'].functionData[5]++;
      _$jscoverage['/underscore-umd.js'].lineData[67]++;
      var length = Math.max(arguments.length - startIndex, 0), rest = Array(length), index = 0;
      _$jscoverage['/underscore-umd.js'].lineData[70]++;
      for (; visit8_70_1(index < length); index++) {
        _$jscoverage['/underscore-umd.js'].lineData[71]++;
        rest[index] = arguments[index + startIndex];
      }
      _$jscoverage['/underscore-umd.js'].lineData[73]++;
      switch(startIndex) {
        case 0:
          _$jscoverage['/underscore-umd.js'].lineData[74]++;
          return func.call(this, rest);
        case 1:
          _$jscoverage['/underscore-umd.js'].lineData[75]++;
          return func.call(this, arguments[0], rest);
        case 2:
          _$jscoverage['/underscore-umd.js'].lineData[76]++;
          return func.call(this, arguments[0], arguments[1], rest);
      }
      _$jscoverage['/underscore-umd.js'].lineData[78]++;
      var args = Array(startIndex + 1);
      _$jscoverage['/underscore-umd.js'].lineData[79]++;
      for (index = 0; visit9_79_1(index < startIndex); index++) {
        _$jscoverage['/underscore-umd.js'].lineData[80]++;
        args[index] = arguments[index];
      }
      _$jscoverage['/underscore-umd.js'].lineData[82]++;
      args[startIndex] = rest;
      _$jscoverage['/underscore-umd.js'].lineData[83]++;
      return func.apply(this, args);
    };
  }
  _$jscoverage['/underscore-umd.js'].lineData[88]++;
  function isObject(obj) {
    _$jscoverage['/underscore-umd.js'].functionData[6]++;
    _$jscoverage['/underscore-umd.js'].lineData[89]++;
    var type = typeof obj;
    _$jscoverage['/underscore-umd.js'].lineData[90]++;
    return visit10_90_1(visit215_90_2(type === 'function') || visit334_90_3(visit394_90_4(type === 'object') && !!obj));
  }
  _$jscoverage['/underscore-umd.js'].lineData[94]++;
  function isNull(obj) {
    _$jscoverage['/underscore-umd.js'].functionData[7]++;
    _$jscoverage['/underscore-umd.js'].lineData[95]++;
    return visit11_95_1(obj === null);
  }
  _$jscoverage['/underscore-umd.js'].lineData[99]++;
  function isUndefined(obj) {
    _$jscoverage['/underscore-umd.js'].functionData[8]++;
    _$jscoverage['/underscore-umd.js'].lineData[100]++;
    return visit12_100_1(obj === void 0);
  }
  _$jscoverage['/underscore-umd.js'].lineData[104]++;
  function isBoolean(obj) {
    _$jscoverage['/underscore-umd.js'].functionData[9]++;
    _$jscoverage['/underscore-umd.js'].lineData[105]++;
    return visit13_105_1(visit216_105_2(visit335_105_3(obj === true) || visit395_105_5(obj === false)) || visit336_105_4(toString.call(obj) === '[object Boolean]'));
  }
  _$jscoverage['/underscore-umd.js'].lineData[109]++;
  function isElement(obj) {
    _$jscoverage['/underscore-umd.js'].functionData[10]++;
    _$jscoverage['/underscore-umd.js'].lineData[110]++;
    return !!visit14_110_1(obj && visit217_110_2(obj.nodeType === 1));
  }
  _$jscoverage['/underscore-umd.js'].lineData[114]++;
  function tagTester(name) {
    _$jscoverage['/underscore-umd.js'].functionData[11]++;
    _$jscoverage['/underscore-umd.js'].lineData[115]++;
    var tag = '[object ' + name + ']';
    _$jscoverage['/underscore-umd.js'].lineData[116]++;
    return function(obj) {
      _$jscoverage['/underscore-umd.js'].functionData[12]++;
      _$jscoverage['/underscore-umd.js'].lineData[117]++;
      return visit15_117_1(toString.call(obj) === tag);
    };
  }
  _$jscoverage['/underscore-umd.js'].lineData[121]++;
  var isString = tagTester('String');
  _$jscoverage['/underscore-umd.js'].lineData[123]++;
  var isNumber = tagTester('Number');
  _$jscoverage['/underscore-umd.js'].lineData[125]++;
  var isDate = tagTester('Date');
  _$jscoverage['/underscore-umd.js'].lineData[127]++;
  var isRegExp = tagTester('RegExp');
  _$jscoverage['/underscore-umd.js'].lineData[129]++;
  var isError = tagTester('Error');
  _$jscoverage['/underscore-umd.js'].lineData[131]++;
  var isSymbol = tagTester('Symbol');
  _$jscoverage['/underscore-umd.js'].lineData[133]++;
  var isArrayBuffer = tagTester('ArrayBuffer');
  _$jscoverage['/underscore-umd.js'].lineData[135]++;
  var isFunction = tagTester('Function');
  _$jscoverage['/underscore-umd.js'].lineData[139]++;
  var nodelist = visit16_139_1(root.document && root.document.childNodes);
  _$jscoverage['/underscore-umd.js'].lineData[140]++;
  if (visit17_140_1(visit218_140_2(visit337_140_3(typeof/./ != 'function') && visit396_140_5(typeof Int8Array != 'object')) && visit338_140_4(typeof nodelist != 'function'))) {
    _$jscoverage['/underscore-umd.js'].lineData[141]++;
    isFunction = function(obj) {
      _$jscoverage['/underscore-umd.js'].functionData[13]++;
      _$jscoverage['/underscore-umd.js'].lineData[142]++;
      return visit219_142_1(visit339_142_2(typeof obj == 'function') || false);
    };
  }
  _$jscoverage['/underscore-umd.js'].lineData[146]++;
  var isFunction$1 = isFunction;
  _$jscoverage['/underscore-umd.js'].lineData[148]++;
  var hasObjectTag = tagTester('Object');
  _$jscoverage['/underscore-umd.js'].lineData[153]++;
  var hasStringTagBug = visit18_154_1(supportsDataView && hasObjectTag(new DataView(new ArrayBuffer(8)))), isIE11 = visit19_156_1(visit220_156_2(typeof Map !== 'undefined') && hasObjectTag(new Map()));
  _$jscoverage['/underscore-umd.js'].lineData[158]++;
  var isDataView = tagTester('DataView');
  _$jscoverage['/underscore-umd.js'].lineData[162]++;
  function ie10IsDataView(obj) {
    _$jscoverage['/underscore-umd.js'].functionData[14]++;
    _$jscoverage['/underscore-umd.js'].lineData[163]++;
    return visit20_163_1(visit221_163_2(visit340_163_3(obj != null) && isFunction$1(obj.getInt8)) && isArrayBuffer(obj.buffer));
  }
  _$jscoverage['/underscore-umd.js'].lineData[166]++;
  var isDataView$1 = visit21_166_1(hasStringTagBug) ? ie10IsDataView : isDataView;
  _$jscoverage['/underscore-umd.js'].lineData[170]++;
  var isArray = visit22_170_1(nativeIsArray || tagTester('Array'));
  _$jscoverage['/underscore-umd.js'].lineData[173]++;
  function has$1(obj, key) {
    _$jscoverage['/underscore-umd.js'].functionData[15]++;
    _$jscoverage['/underscore-umd.js'].lineData[174]++;
    return visit23_174_1(visit222_174_2(obj != null) && hasOwnProperty.call(obj, key));
  }
  _$jscoverage['/underscore-umd.js'].lineData[177]++;
  var isArguments = tagTester('Arguments');
  _$jscoverage['/underscore-umd.js'].lineData[181]++;
  (function() {
    _$jscoverage['/underscore-umd.js'].functionData[16]++;
    _$jscoverage['/underscore-umd.js'].lineData[182]++;
    if (visit24_182_1(!isArguments(arguments))) {
      _$jscoverage['/underscore-umd.js'].lineData[183]++;
      isArguments = function(obj) {
        _$jscoverage['/underscore-umd.js'].functionData[17]++;
        _$jscoverage['/underscore-umd.js'].lineData[184]++;
        return has$1(obj, 'callee');
      };
    }
  })();
  _$jscoverage['/underscore-umd.js'].lineData[189]++;
  var isArguments$1 = isArguments;
  _$jscoverage['/underscore-umd.js'].lineData[192]++;
  function isFinite$1(obj) {
    _$jscoverage['/underscore-umd.js'].functionData[18]++;
    _$jscoverage['/underscore-umd.js'].lineData[193]++;
    return visit25_193_1(visit223_193_2(!isSymbol(obj) && _isFinite(obj)) && !isNaN(parseFloat(obj)));
  }
  _$jscoverage['/underscore-umd.js'].lineData[197]++;
  function isNaN$1(obj) {
    _$jscoverage['/underscore-umd.js'].functionData[19]++;
    _$jscoverage['/underscore-umd.js'].lineData[198]++;
    return visit26_198_1(isNumber(obj) && _isNaN(obj));
  }
  _$jscoverage['/underscore-umd.js'].lineData[202]++;
  function constant(value) {
    _$jscoverage['/underscore-umd.js'].functionData[20]++;
    _$jscoverage['/underscore-umd.js'].lineData[203]++;
    return function() {
      _$jscoverage['/underscore-umd.js'].functionData[21]++;
      _$jscoverage['/underscore-umd.js'].lineData[204]++;
      return value;
    };
  }
  _$jscoverage['/underscore-umd.js'].lineData[209]++;
  function createSizePropertyCheck(getSizeProperty) {
    _$jscoverage['/underscore-umd.js'].functionData[22]++;
    _$jscoverage['/underscore-umd.js'].lineData[210]++;
    return function(collection) {
      _$jscoverage['/underscore-umd.js'].functionData[23]++;
      _$jscoverage['/underscore-umd.js'].lineData[211]++;
      var sizeProperty = getSizeProperty(collection);
      _$jscoverage['/underscore-umd.js'].lineData[212]++;
      return visit27_212_1(visit224_212_2(visit341_212_3(typeof sizeProperty == 'number') && visit397_212_5(sizeProperty >= 0)) && visit342_212_4(sizeProperty <= MAX_ARRAY_INDEX));
    };
  }
  _$jscoverage['/underscore-umd.js'].lineData[217]++;
  function shallowProperty(key) {
    _$jscoverage['/underscore-umd.js'].functionData[24]++;
    _$jscoverage['/underscore-umd.js'].lineData[218]++;
    return function(obj) {
      _$jscoverage['/underscore-umd.js'].functionData[25]++;
      _$jscoverage['/underscore-umd.js'].lineData[219]++;
      return visit28_219_1(obj == null) ? void 0 : obj[key];
    };
  }
  _$jscoverage['/underscore-umd.js'].lineData[224]++;
  var getByteLength = shallowProperty('byteLength');
  _$jscoverage['/underscore-umd.js'].lineData[228]++;
  var isBufferLike = createSizePropertyCheck(getByteLength);
  _$jscoverage['/underscore-umd.js'].lineData[231]++;
  var typedArrayPattern = /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;
  _$jscoverage['/underscore-umd.js'].lineData[232]++;
  function isTypedArray(obj) {
    _$jscoverage['/underscore-umd.js'].functionData[26]++;
    _$jscoverage['/underscore-umd.js'].lineData[235]++;
    return visit29_235_1(nativeIsView) ? visit225_235_2(nativeIsView(obj) && !isDataView$1(obj)) : visit343_236_1(isBufferLike(obj) && typedArrayPattern.test(toString.call(obj)));
  }
  _$jscoverage['/underscore-umd.js'].lineData[239]++;
  var isTypedArray$1 = visit30_239_1(supportsArrayBuffer) ? isTypedArray : constant(false);
  _$jscoverage['/underscore-umd.js'].lineData[242]++;
  var getLength = shallowProperty('length');
  _$jscoverage['/underscore-umd.js'].lineData[248]++;
  function emulatedSet(keys) {
    _$jscoverage['/underscore-umd.js'].functionData[27]++;
    _$jscoverage['/underscore-umd.js'].lineData[249]++;
    var hash = {};
    _$jscoverage['/underscore-umd.js'].lineData[250]++;
    for (var l = keys.length, i = 0; visit31_250_1(i < l); ++i) {
      hash[keys[i]] = true;
    }
    _$jscoverage['/underscore-umd.js'].lineData[251]++;
    return {contains:function(key) {
      _$jscoverage['/underscore-umd.js'].functionData[28]++;
      _$jscoverage['/underscore-umd.js'].lineData[252]++;
      return visit32_252_1(hash[key] === true);
    }, push:function(key) {
      _$jscoverage['/underscore-umd.js'].functionData[29]++;
      _$jscoverage['/underscore-umd.js'].lineData[254]++;
      hash[key] = true;
      _$jscoverage['/underscore-umd.js'].lineData[255]++;
      return keys.push(key);
    }};
  }
  _$jscoverage['/underscore-umd.js'].lineData[263]++;
  function collectNonEnumProps(obj, keys) {
    _$jscoverage['/underscore-umd.js'].functionData[30]++;
    _$jscoverage['/underscore-umd.js'].lineData[264]++;
    keys = emulatedSet(keys);
    _$jscoverage['/underscore-umd.js'].lineData[265]++;
    var nonEnumIdx = nonEnumerableProps.length;
    _$jscoverage['/underscore-umd.js'].lineData[266]++;
    var constructor = obj.constructor;
    _$jscoverage['/underscore-umd.js'].lineData[267]++;
    var proto = visit33_267_1(visit226_267_2(isFunction$1(constructor) && constructor.prototype) || ObjProto);
    _$jscoverage['/underscore-umd.js'].lineData[270]++;
    var prop = 'constructor';
    _$jscoverage['/underscore-umd.js'].lineData[271]++;
    if (visit34_271_1(has$1(obj, prop) && !keys.contains(prop))) {
      keys.push(prop);
    }
    _$jscoverage['/underscore-umd.js'].lineData[273]++;
    while (visit35_273_1(nonEnumIdx--)) {
      _$jscoverage['/underscore-umd.js'].lineData[274]++;
      prop = nonEnumerableProps[nonEnumIdx];
      _$jscoverage['/underscore-umd.js'].lineData[275]++;
      if (visit227_275_1(visit344_275_2(prop in obj && visit398_275_3(obj[prop] !== proto[prop])) && !keys.contains(prop))) {
        _$jscoverage['/underscore-umd.js'].lineData[276]++;
        keys.push(prop);
      }
    }
  }
  _$jscoverage['/underscore-umd.js'].lineData[283]++;
  function keys(obj) {
    _$jscoverage['/underscore-umd.js'].functionData[31]++;
    _$jscoverage['/underscore-umd.js'].lineData[284]++;
    if (visit36_284_1(!isObject(obj))) {
      return [];
    }
    _$jscoverage['/underscore-umd.js'].lineData[285]++;
    if (visit37_285_1(nativeKeys)) {
      return nativeKeys(obj);
    }
    _$jscoverage['/underscore-umd.js'].lineData[286]++;
    var keys = [];
    _$jscoverage['/underscore-umd.js'].lineData[287]++;
    for (var key in obj) {
      if (visit38_287_1(has$1(obj, key))) {
        keys.push(key);
      }
    }
    _$jscoverage['/underscore-umd.js'].lineData[289]++;
    if (visit39_289_1(hasEnumBug)) {
      collectNonEnumProps(obj, keys);
    }
    _$jscoverage['/underscore-umd.js'].lineData[290]++;
    return keys;
  }
  _$jscoverage['/underscore-umd.js'].lineData[295]++;
  function isEmpty(obj) {
    _$jscoverage['/underscore-umd.js'].functionData[32]++;
    _$jscoverage['/underscore-umd.js'].lineData[296]++;
    if (visit40_296_1(obj == null)) {
      return true;
    }
    _$jscoverage['/underscore-umd.js'].lineData[299]++;
    var length = getLength(obj);
    _$jscoverage['/underscore-umd.js'].lineData[300]++;
    if (visit41_300_1(visit228_300_2(typeof length == 'number') && visit345_301_1(visit399_301_2(isArray(obj) || isString(obj)) || isArguments$1(obj)))) {
      _$jscoverage['/underscore-umd.js'].lineData[302]++;
      return visit229_302_1(length === 0);
    }
    _$jscoverage['/underscore-umd.js'].lineData[303]++;
    return visit42_303_1(getLength(keys(obj)) === 0);
  }
  _$jscoverage['/underscore-umd.js'].lineData[307]++;
  function isMatch(object, attrs) {
    _$jscoverage['/underscore-umd.js'].functionData[33]++;
    _$jscoverage['/underscore-umd.js'].lineData[308]++;
    var _keys = keys(attrs), length = _keys.length;
    _$jscoverage['/underscore-umd.js'].lineData[309]++;
    if (visit43_309_1(object == null)) {
      return !length;
    }
    _$jscoverage['/underscore-umd.js'].lineData[310]++;
    var obj = Object(object);
    _$jscoverage['/underscore-umd.js'].lineData[311]++;
    for (var i = 0; visit44_311_1(i < length); i++) {
      _$jscoverage['/underscore-umd.js'].lineData[312]++;
      var key = _keys[i];
      _$jscoverage['/underscore-umd.js'].lineData[313]++;
      if (visit230_313_1(visit346_313_2(attrs[key] !== obj[key]) || !(key in obj))) {
        return false;
      }
    }
    _$jscoverage['/underscore-umd.js'].lineData[315]++;
    return true;
  }
  _$jscoverage['/underscore-umd.js'].lineData[321]++;
  function _$1(obj) {
    _$jscoverage['/underscore-umd.js'].functionData[34]++;
    _$jscoverage['/underscore-umd.js'].lineData[322]++;
    if (visit45_322_1(obj instanceof _$1)) {
      return obj;
    }
    _$jscoverage['/underscore-umd.js'].lineData[323]++;
    if (visit46_323_1(!(this instanceof _$1))) {
      return new _$1(obj);
    }
    _$jscoverage['/underscore-umd.js'].lineData[324]++;
    this._wrapped = obj;
  }
  _$jscoverage['/underscore-umd.js'].lineData[327]++;
  _$1.VERSION = VERSION;
  _$jscoverage['/underscore-umd.js'].lineData[330]++;
  _$1.prototype.value = function() {
    _$jscoverage['/underscore-umd.js'].functionData[35]++;
    _$jscoverage['/underscore-umd.js'].lineData[331]++;
    return this._wrapped;
  };
  _$jscoverage['/underscore-umd.js'].lineData[336]++;
  _$1.prototype.valueOf = _$1.prototype.toJSON = _$1.prototype.value;
  _$jscoverage['/underscore-umd.js'].lineData[338]++;
  _$1.prototype.toString = function() {
    _$jscoverage['/underscore-umd.js'].functionData[36]++;
    _$jscoverage['/underscore-umd.js'].lineData[339]++;
    return String(this._wrapped);
  };
  _$jscoverage['/underscore-umd.js'].lineData[344]++;
  function toBufferView(bufferSource) {
    _$jscoverage['/underscore-umd.js'].functionData[37]++;
    _$jscoverage['/underscore-umd.js'].lineData[345]++;
    return new Uint8Array(visit47_346_1(bufferSource.buffer || bufferSource), visit231_347_1(bufferSource.byteOffset || 0), getByteLength(bufferSource));
  }
  _$jscoverage['/underscore-umd.js'].lineData[353]++;
  var tagDataView = '[object DataView]';
  _$jscoverage['/underscore-umd.js'].lineData[356]++;
  function eq(a, b, aStack, bStack) {
    _$jscoverage['/underscore-umd.js'].functionData[38]++;
    _$jscoverage['/underscore-umd.js'].lineData[359]++;
    if (visit48_359_1(a === b)) {
      return visit232_359_2(visit347_359_3(a !== 0) || visit400_359_4(1 / a === 1 / b));
    }
    _$jscoverage['/underscore-umd.js'].lineData[361]++;
    if (visit49_361_1(visit233_361_2(a == null) || visit348_361_3(b == null))) {
      return false;
    }
    _$jscoverage['/underscore-umd.js'].lineData[363]++;
    if (visit50_363_1(a !== a)) {
      return visit234_363_2(b !== b);
    }
    _$jscoverage['/underscore-umd.js'].lineData[365]++;
    var type = typeof a;
    _$jscoverage['/underscore-umd.js'].lineData[366]++;
    if (visit51_366_1(visit235_366_2(visit349_366_3(type !== 'function') && visit401_366_5(type !== 'object')) && visit350_366_4(typeof b != 'object'))) {
      return false;
    }
    _$jscoverage['/underscore-umd.js'].lineData[367]++;
    return deepEq(a, b, aStack, bStack);
  }
  _$jscoverage['/underscore-umd.js'].lineData[371]++;
  function deepEq(a, b, aStack, bStack) {
    _$jscoverage['/underscore-umd.js'].functionData[39]++;
    _$jscoverage['/underscore-umd.js'].lineData[373]++;
    if (visit52_373_1(a instanceof _$1)) {
      a = a._wrapped;
    }
    _$jscoverage['/underscore-umd.js'].lineData[374]++;
    if (visit53_374_1(b instanceof _$1)) {
      b = b._wrapped;
    }
    _$jscoverage['/underscore-umd.js'].lineData[376]++;
    var className = toString.call(a);
    _$jscoverage['/underscore-umd.js'].lineData[377]++;
    if (visit54_377_1(className !== toString.call(b))) {
      return false;
    }
    _$jscoverage['/underscore-umd.js'].lineData[379]++;
    if (visit55_379_1(visit236_379_2(hasStringTagBug && visit351_379_3(className == '[object Object]')) && isDataView$1(a))) {
      _$jscoverage['/underscore-umd.js'].lineData[380]++;
      if (visit237_380_1(!isDataView$1(b))) {
        return false;
      }
      _$jscoverage['/underscore-umd.js'].lineData[381]++;
      className = tagDataView;
    }
    _$jscoverage['/underscore-umd.js'].lineData[383]++;
    switch(className) {
      case '[object RegExp]':
        _$jscoverage['/underscore-umd.js'].lineData[385]++;
      case '[object String]':
        _$jscoverage['/underscore-umd.js'].lineData[390]++;
        return visit56_390_1('' + a === '' + b);
      case '[object Number]':
        _$jscoverage['/underscore-umd.js'].lineData[394]++;
        if (visit57_394_1(+a !== +a)) {
          return visit238_394_2(+b !== +b);
        }
        _$jscoverage['/underscore-umd.js'].lineData[396]++;
        return visit58_396_1(+a === 0) ? visit239_396_2(1 / +a === 1 / b) : visit352_396_3(+a === +b);
      case '[object Date]':
        _$jscoverage['/underscore-umd.js'].lineData[397]++;
      case '[object Boolean]':
        _$jscoverage['/underscore-umd.js'].lineData[402]++;
        return visit59_402_1(+a === +b);
      case '[object Symbol]':
        _$jscoverage['/underscore-umd.js'].lineData[404]++;
        return visit60_404_1(SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b));
      case '[object ArrayBuffer]':
        _$jscoverage['/underscore-umd.js'].lineData[405]++;
      case tagDataView:
        _$jscoverage['/underscore-umd.js'].lineData[408]++;
        return deepEq(toBufferView(a), toBufferView(b), aStack, bStack);
    }
    _$jscoverage['/underscore-umd.js'].lineData[411]++;
    var areArrays = visit61_411_1(className === '[object Array]');
    _$jscoverage['/underscore-umd.js'].lineData[412]++;
    if (visit62_412_1(!areArrays && isTypedArray$1(a))) {
      _$jscoverage['/underscore-umd.js'].lineData[413]++;
      var byteLength = getByteLength(a);
      _$jscoverage['/underscore-umd.js'].lineData[414]++;
      if (visit240_414_1(byteLength !== getByteLength(b))) {
        return false;
      }
      _$jscoverage['/underscore-umd.js'].lineData[415]++;
      if (visit241_415_1(visit353_415_2(a.buffer === b.buffer) && visit402_415_3(a.byteOffset === b.byteOffset))) {
        return true;
      }
      _$jscoverage['/underscore-umd.js'].lineData[416]++;
      areArrays = true;
    }
    _$jscoverage['/underscore-umd.js'].lineData[418]++;
    if (visit63_418_1(!areArrays)) {
      _$jscoverage['/underscore-umd.js'].lineData[419]++;
      if (visit242_419_1(visit354_419_2(typeof a != 'object') || visit403_419_3(typeof b != 'object'))) {
        return false;
      }
      _$jscoverage['/underscore-umd.js'].lineData[423]++;
      var aCtor = a.constructor, bCtor = b.constructor;
      _$jscoverage['/underscore-umd.js'].lineData[424]++;
      if (visit243_424_1(visit355_424_2(visit404_424_3(aCtor !== bCtor) && !visit424_424_4(visit436_424_5(visit443_424_6(isFunction$1(aCtor) && aCtor instanceof aCtor) && isFunction$1(bCtor)) && bCtor instanceof bCtor)) && visit405_426_1('constructor' in a && 'constructor' in b))) {
        _$jscoverage['/underscore-umd.js'].lineData[427]++;
        return false;
      }
    }
    _$jscoverage['/underscore-umd.js'].lineData[435]++;
    aStack = visit64_435_1(aStack || []);
    _$jscoverage['/underscore-umd.js'].lineData[436]++;
    bStack = visit65_436_1(bStack || []);
    _$jscoverage['/underscore-umd.js'].lineData[437]++;
    var length = aStack.length;
    _$jscoverage['/underscore-umd.js'].lineData[438]++;
    while (visit66_438_1(length--)) {
      _$jscoverage['/underscore-umd.js'].lineData[441]++;
      if (visit244_441_1(aStack[length] === a)) {
        return visit356_441_2(bStack[length] === b);
      }
    }
    _$jscoverage['/underscore-umd.js'].lineData[445]++;
    aStack.push(a);
    _$jscoverage['/underscore-umd.js'].lineData[446]++;
    bStack.push(b);
    _$jscoverage['/underscore-umd.js'].lineData[449]++;
    if (visit67_449_1(areArrays)) {
      _$jscoverage['/underscore-umd.js'].lineData[451]++;
      length = a.length;
      _$jscoverage['/underscore-umd.js'].lineData[452]++;
      if (visit245_452_1(length !== b.length)) {
        return false;
      }
      _$jscoverage['/underscore-umd.js'].lineData[454]++;
      while (visit246_454_1(length--)) {
        _$jscoverage['/underscore-umd.js'].lineData[455]++;
        if (visit357_455_1(!eq(a[length], b[length], aStack, bStack))) {
          return false;
        }
      }
    } else {
      _$jscoverage['/underscore-umd.js'].lineData[459]++;
      var _keys = keys(a), key;
      _$jscoverage['/underscore-umd.js'].lineData[460]++;
      length = _keys.length;
      _$jscoverage['/underscore-umd.js'].lineData[462]++;
      if (visit247_462_1(keys(b).length !== length)) {
        return false;
      }
      _$jscoverage['/underscore-umd.js'].lineData[463]++;
      while (visit248_463_1(length--)) {
        _$jscoverage['/underscore-umd.js'].lineData[465]++;
        key = _keys[length];
        _$jscoverage['/underscore-umd.js'].lineData[466]++;
        if (visit358_466_1(!visit406_466_2(has$1(b, key) && eq(a[key], b[key], aStack, bStack)))) {
          return false;
        }
      }
    }
    _$jscoverage['/underscore-umd.js'].lineData[470]++;
    aStack.pop();
    _$jscoverage['/underscore-umd.js'].lineData[471]++;
    bStack.pop();
    _$jscoverage['/underscore-umd.js'].lineData[472]++;
    return true;
  }
  _$jscoverage['/underscore-umd.js'].lineData[476]++;
  function isEqual(a, b) {
    _$jscoverage['/underscore-umd.js'].functionData[40]++;
    _$jscoverage['/underscore-umd.js'].lineData[477]++;
    return eq(a, b);
  }
  _$jscoverage['/underscore-umd.js'].lineData[481]++;
  function allKeys(obj) {
    _$jscoverage['/underscore-umd.js'].functionData[41]++;
    _$jscoverage['/underscore-umd.js'].lineData[482]++;
    if (visit68_482_1(!isObject(obj))) {
      return [];
    }
    _$jscoverage['/underscore-umd.js'].lineData[483]++;
    var keys = [];
    _$jscoverage['/underscore-umd.js'].lineData[484]++;
    for (var key in obj) {
      keys.push(key);
    }
    _$jscoverage['/underscore-umd.js'].lineData[486]++;
    if (visit69_486_1(hasEnumBug)) {
      collectNonEnumProps(obj, keys);
    }
    _$jscoverage['/underscore-umd.js'].lineData[487]++;
    return keys;
  }
  _$jscoverage['/underscore-umd.js'].lineData[494]++;
  function ie11fingerprint(methods) {
    _$jscoverage['/underscore-umd.js'].functionData[42]++;
    _$jscoverage['/underscore-umd.js'].lineData[495]++;
    var length = getLength(methods);
    _$jscoverage['/underscore-umd.js'].lineData[496]++;
    return function(obj) {
      _$jscoverage['/underscore-umd.js'].functionData[43]++;
      _$jscoverage['/underscore-umd.js'].lineData[497]++;
      if (visit70_497_1(obj == null)) {
        return false;
      }
      _$jscoverage['/underscore-umd.js'].lineData[499]++;
      var keys = allKeys(obj);
      _$jscoverage['/underscore-umd.js'].lineData[500]++;
      if (visit71_500_1(getLength(keys))) {
        return false;
      }
      _$jscoverage['/underscore-umd.js'].lineData[501]++;
      for (var i = 0; visit72_501_1(i < length); i++) {
        _$jscoverage['/underscore-umd.js'].lineData[502]++;
        if (visit249_502_1(!isFunction$1(obj[methods[i]]))) {
          return false;
        }
      }
      _$jscoverage['/underscore-umd.js'].lineData[507]++;
      return visit73_507_1(visit250_507_2(methods !== weakMapMethods) || !isFunction$1(obj[forEachName]));
    };
  }
  _$jscoverage['/underscore-umd.js'].lineData[513]++;
  var forEachName = 'forEach', hasName = 'has', commonInit = ['clear', 'delete'], mapTail = ['get', hasName, 'set'];
  _$jscoverage['/underscore-umd.js'].lineData[520]++;
  var mapMethods = commonInit.concat(forEachName, mapTail), weakMapMethods = commonInit.concat(mapTail), setMethods = ['add'].concat(commonInit, forEachName, hasName);
  _$jscoverage['/underscore-umd.js'].lineData[524]++;
  var isMap = visit74_524_1(isIE11) ? ie11fingerprint(mapMethods) : tagTester('Map');
  _$jscoverage['/underscore-umd.js'].lineData[526]++;
  var isWeakMap = visit75_526_1(isIE11) ? ie11fingerprint(weakMapMethods) : tagTester('WeakMap');
  _$jscoverage['/underscore-umd.js'].lineData[528]++;
  var isSet = visit76_528_1(isIE11) ? ie11fingerprint(setMethods) : tagTester('Set');
  _$jscoverage['/underscore-umd.js'].lineData[530]++;
  var isWeakSet = tagTester('WeakSet');
  _$jscoverage['/underscore-umd.js'].lineData[533]++;
  function values(obj) {
    _$jscoverage['/underscore-umd.js'].functionData[44]++;
    _$jscoverage['/underscore-umd.js'].lineData[534]++;
    var _keys = keys(obj);
    _$jscoverage['/underscore-umd.js'].lineData[535]++;
    var length = _keys.length;
    _$jscoverage['/underscore-umd.js'].lineData[536]++;
    var values = Array(length);
    _$jscoverage['/underscore-umd.js'].lineData[537]++;
    for (var i = 0; visit77_537_1(i < length); i++) {
      _$jscoverage['/underscore-umd.js'].lineData[538]++;
      values[i] = obj[_keys[i]];
    }
    _$jscoverage['/underscore-umd.js'].lineData[540]++;
    return values;
  }
  _$jscoverage['/underscore-umd.js'].lineData[545]++;
  function pairs(obj) {
    _$jscoverage['/underscore-umd.js'].functionData[45]++;
    _$jscoverage['/underscore-umd.js'].lineData[546]++;
    var _keys = keys(obj);
    _$jscoverage['/underscore-umd.js'].lineData[547]++;
    var length = _keys.length;
    _$jscoverage['/underscore-umd.js'].lineData[548]++;
    var pairs = Array(length);
    _$jscoverage['/underscore-umd.js'].lineData[549]++;
    for (var i = 0; visit78_549_1(i < length); i++) {
      _$jscoverage['/underscore-umd.js'].lineData[550]++;
      pairs[i] = [_keys[i], obj[_keys[i]]];
    }
    _$jscoverage['/underscore-umd.js'].lineData[552]++;
    return pairs;
  }
  _$jscoverage['/underscore-umd.js'].lineData[556]++;
  function invert(obj) {
    _$jscoverage['/underscore-umd.js'].functionData[46]++;
    _$jscoverage['/underscore-umd.js'].lineData[557]++;
    var result = {};
    _$jscoverage['/underscore-umd.js'].lineData[558]++;
    var _keys = keys(obj);
    _$jscoverage['/underscore-umd.js'].lineData[559]++;
    for (var i = 0, length = _keys.length; visit79_559_1(i < length); i++) {
      _$jscoverage['/underscore-umd.js'].lineData[560]++;
      result[obj[_keys[i]]] = _keys[i];
    }
    _$jscoverage['/underscore-umd.js'].lineData[562]++;
    return result;
  }
  _$jscoverage['/underscore-umd.js'].lineData[566]++;
  function functions(obj) {
    _$jscoverage['/underscore-umd.js'].functionData[47]++;
    _$jscoverage['/underscore-umd.js'].lineData[567]++;
    var names = [];
    _$jscoverage['/underscore-umd.js'].lineData[568]++;
    for (var key in obj) {
      _$jscoverage['/underscore-umd.js'].lineData[569]++;
      if (visit80_569_1(isFunction$1(obj[key]))) {
        names.push(key);
      }
    }
    _$jscoverage['/underscore-umd.js'].lineData[571]++;
    return names.sort();
  }
  _$jscoverage['/underscore-umd.js'].lineData[575]++;
  function createAssigner(keysFunc, defaults) {
    _$jscoverage['/underscore-umd.js'].functionData[48]++;
    _$jscoverage['/underscore-umd.js'].lineData[576]++;
    return function(obj) {
      _$jscoverage['/underscore-umd.js'].functionData[49]++;
      _$jscoverage['/underscore-umd.js'].lineData[577]++;
      var length = arguments.length;
      _$jscoverage['/underscore-umd.js'].lineData[578]++;
      if (visit81_578_1(defaults)) {
        obj = Object(obj);
      }
      _$jscoverage['/underscore-umd.js'].lineData[579]++;
      if (visit82_579_1(visit251_579_2(length < 2) || visit359_579_3(obj == null))) {
        return obj;
      }
      _$jscoverage['/underscore-umd.js'].lineData[580]++;
      for (var index = 1; visit83_580_1(index < length); index++) {
        _$jscoverage['/underscore-umd.js'].lineData[581]++;
        var source = arguments[index], keys = keysFunc(source), l = keys.length;
        _$jscoverage['/underscore-umd.js'].lineData[584]++;
        for (var i = 0; visit252_584_1(i < l); i++) {
          _$jscoverage['/underscore-umd.js'].lineData[585]++;
          var key = keys[i];
          _$jscoverage['/underscore-umd.js'].lineData[586]++;
          if (visit360_586_1(!defaults || visit407_586_2(obj[key] === void 0))) {
            obj[key] = source[key];
          }
        }
      }
      _$jscoverage['/underscore-umd.js'].lineData[589]++;
      return obj;
    };
  }
  _$jscoverage['/underscore-umd.js'].lineData[594]++;
  var extend = createAssigner(allKeys);
  _$jscoverage['/underscore-umd.js'].lineData[599]++;
  var extendOwn = createAssigner(keys);
  _$jscoverage['/underscore-umd.js'].lineData[602]++;
  var defaults = createAssigner(allKeys, true);
  _$jscoverage['/underscore-umd.js'].lineData[605]++;
  function ctor() {
    _$jscoverage['/underscore-umd.js'].functionData[50]++;
    _$jscoverage['/underscore-umd.js'].lineData[606]++;
    return function() {
      _$jscoverage['/underscore-umd.js'].functionData[51]++;
    };
  }
  _$jscoverage['/underscore-umd.js'].lineData[610]++;
  function baseCreate(prototype) {
    _$jscoverage['/underscore-umd.js'].functionData[52]++;
    _$jscoverage['/underscore-umd.js'].lineData[611]++;
    if (visit84_611_1(!isObject(prototype))) {
      return {};
    }
    _$jscoverage['/underscore-umd.js'].lineData[612]++;
    if (visit85_612_1(nativeCreate)) {
      return nativeCreate(prototype);
    }
    _$jscoverage['/underscore-umd.js'].lineData[613]++;
    var Ctor = ctor();
    _$jscoverage['/underscore-umd.js'].lineData[614]++;
    Ctor.prototype = prototype;
    _$jscoverage['/underscore-umd.js'].lineData[615]++;
    var result = new Ctor();
    _$jscoverage['/underscore-umd.js'].lineData[616]++;
    Ctor.prototype = null;
    _$jscoverage['/underscore-umd.js'].lineData[617]++;
    return result;
  }
  _$jscoverage['/underscore-umd.js'].lineData[623]++;
  function create(prototype, props) {
    _$jscoverage['/underscore-umd.js'].functionData[53]++;
    _$jscoverage['/underscore-umd.js'].lineData[624]++;
    var result = baseCreate(prototype);
    _$jscoverage['/underscore-umd.js'].lineData[625]++;
    if (visit86_625_1(props)) {
      extendOwn(result, props);
    }
    _$jscoverage['/underscore-umd.js'].lineData[626]++;
    return result;
  }
  _$jscoverage['/underscore-umd.js'].lineData[630]++;
  function clone(obj) {
    _$jscoverage['/underscore-umd.js'].functionData[54]++;
    _$jscoverage['/underscore-umd.js'].lineData[631]++;
    if (visit87_631_1(!isObject(obj))) {
      return obj;
    }
    _$jscoverage['/underscore-umd.js'].lineData[632]++;
    return visit88_632_1(isArray(obj)) ? obj.slice() : extend({}, obj);
  }
  _$jscoverage['/underscore-umd.js'].lineData[638]++;
  function tap(obj, interceptor) {
    _$jscoverage['/underscore-umd.js'].functionData[55]++;
    _$jscoverage['/underscore-umd.js'].lineData[639]++;
    interceptor(obj);
    _$jscoverage['/underscore-umd.js'].lineData[640]++;
    return obj;
  }
  _$jscoverage['/underscore-umd.js'].lineData[645]++;
  function toPath$1(path) {
    _$jscoverage['/underscore-umd.js'].functionData[56]++;
    _$jscoverage['/underscore-umd.js'].lineData[646]++;
    return visit89_646_1(isArray(path)) ? path : [path];
  }
  _$jscoverage['/underscore-umd.js'].lineData[648]++;
  _$1.toPath = toPath$1;
  _$jscoverage['/underscore-umd.js'].lineData[652]++;
  function toPath(path) {
    _$jscoverage['/underscore-umd.js'].functionData[57]++;
    _$jscoverage['/underscore-umd.js'].lineData[653]++;
    return _$1.toPath(path);
  }
  _$jscoverage['/underscore-umd.js'].lineData[657]++;
  function deepGet(obj, path) {
    _$jscoverage['/underscore-umd.js'].functionData[58]++;
    _$jscoverage['/underscore-umd.js'].lineData[658]++;
    var length = path.length;
    _$jscoverage['/underscore-umd.js'].lineData[659]++;
    for (var i = 0; visit90_659_1(i < length); i++) {
      _$jscoverage['/underscore-umd.js'].lineData[660]++;
      if (visit253_660_1(obj == null)) {
        return void 0;
      }
      _$jscoverage['/underscore-umd.js'].lineData[661]++;
      obj = obj[path[i]];
    }
    _$jscoverage['/underscore-umd.js'].lineData[663]++;
    return visit91_663_1(length) ? obj : void 0;
  }
  _$jscoverage['/underscore-umd.js'].lineData[670]++;
  function get(object, path, defaultValue) {
    _$jscoverage['/underscore-umd.js'].functionData[59]++;
    _$jscoverage['/underscore-umd.js'].lineData[671]++;
    var value = deepGet(object, toPath(path));
    _$jscoverage['/underscore-umd.js'].lineData[672]++;
    return visit92_672_1(isUndefined(value)) ? defaultValue : value;
  }
  _$jscoverage['/underscore-umd.js'].lineData[678]++;
  function has(obj, path) {
    _$jscoverage['/underscore-umd.js'].functionData[60]++;
    _$jscoverage['/underscore-umd.js'].lineData[679]++;
    path = toPath(path);
    _$jscoverage['/underscore-umd.js'].lineData[680]++;
    var length = path.length;
    _$jscoverage['/underscore-umd.js'].lineData[681]++;
    for (var i = 0; visit93_681_1(i < length); i++) {
      _$jscoverage['/underscore-umd.js'].lineData[682]++;
      var key = path[i];
      _$jscoverage['/underscore-umd.js'].lineData[683]++;
      if (visit254_683_1(!has$1(obj, key))) {
        return false;
      }
      _$jscoverage['/underscore-umd.js'].lineData[684]++;
      obj = obj[key];
    }
    _$jscoverage['/underscore-umd.js'].lineData[686]++;
    return !!length;
  }
  _$jscoverage['/underscore-umd.js'].lineData[690]++;
  function identity(value) {
    _$jscoverage['/underscore-umd.js'].functionData[61]++;
    _$jscoverage['/underscore-umd.js'].lineData[691]++;
    return value;
  }
  _$jscoverage['/underscore-umd.js'].lineData[696]++;
  function matcher(attrs) {
    _$jscoverage['/underscore-umd.js'].functionData[62]++;
    _$jscoverage['/underscore-umd.js'].lineData[697]++;
    attrs = extendOwn({}, attrs);
    _$jscoverage['/underscore-umd.js'].lineData[698]++;
    return function(obj) {
      _$jscoverage['/underscore-umd.js'].functionData[63]++;
      _$jscoverage['/underscore-umd.js'].lineData[699]++;
      return isMatch(obj, attrs);
    };
  }
  _$jscoverage['/underscore-umd.js'].lineData[705]++;
  function property(path) {
    _$jscoverage['/underscore-umd.js'].functionData[64]++;
    _$jscoverage['/underscore-umd.js'].lineData[706]++;
    path = toPath(path);
    _$jscoverage['/underscore-umd.js'].lineData[707]++;
    return function(obj) {
      _$jscoverage['/underscore-umd.js'].functionData[65]++;
      _$jscoverage['/underscore-umd.js'].lineData[708]++;
      return deepGet(obj, path);
    };
  }
  _$jscoverage['/underscore-umd.js'].lineData[715]++;
  function optimizeCb(func, context, argCount) {
    _$jscoverage['/underscore-umd.js'].functionData[66]++;
    _$jscoverage['/underscore-umd.js'].lineData[716]++;
    if (visit94_716_1(context === void 0)) {
      return func;
    }
    _$jscoverage['/underscore-umd.js'].lineData[717]++;
    switch(visit95_717_1(argCount == null) ? 3 : argCount) {
      case 1:
        _$jscoverage['/underscore-umd.js'].lineData[718]++;
        return function(value) {
          _$jscoverage['/underscore-umd.js'].functionData[67]++;
          _$jscoverage['/underscore-umd.js'].lineData[719]++;
          return func.call(context, value);
        };
      case 3:
        _$jscoverage['/underscore-umd.js'].lineData[722]++;
        return function(value, index, collection) {
          _$jscoverage['/underscore-umd.js'].functionData[68]++;
          _$jscoverage['/underscore-umd.js'].lineData[723]++;
          return func.call(context, value, index, collection);
        };
      case 4:
        _$jscoverage['/underscore-umd.js'].lineData[725]++;
        return function(accumulator, value, index, collection) {
          _$jscoverage['/underscore-umd.js'].functionData[69]++;
          _$jscoverage['/underscore-umd.js'].lineData[726]++;
          return func.call(context, accumulator, value, index, collection);
        };
    }
    _$jscoverage['/underscore-umd.js'].lineData[729]++;
    return function() {
      _$jscoverage['/underscore-umd.js'].functionData[70]++;
      _$jscoverage['/underscore-umd.js'].lineData[730]++;
      return func.apply(context, arguments);
    };
  }
  _$jscoverage['/underscore-umd.js'].lineData[737]++;
  function baseIteratee(value, context, argCount) {
    _$jscoverage['/underscore-umd.js'].functionData[71]++;
    _$jscoverage['/underscore-umd.js'].lineData[738]++;
    if (visit96_738_1(value == null)) {
      return identity;
    }
    _$jscoverage['/underscore-umd.js'].lineData[739]++;
    if (visit97_739_1(isFunction$1(value))) {
      return optimizeCb(value, context, argCount);
    }
    _$jscoverage['/underscore-umd.js'].lineData[740]++;
    if (visit98_740_1(isObject(value) && !isArray(value))) {
      return matcher(value);
    }
    _$jscoverage['/underscore-umd.js'].lineData[741]++;
    return property(value);
  }
  _$jscoverage['/underscore-umd.js'].lineData[747]++;
  function iteratee(value, context) {
    _$jscoverage['/underscore-umd.js'].functionData[72]++;
    _$jscoverage['/underscore-umd.js'].lineData[748]++;
    return baseIteratee(value, context, Infinity);
  }
  _$jscoverage['/underscore-umd.js'].lineData[750]++;
  _$1.iteratee = iteratee;
  _$jscoverage['/underscore-umd.js'].lineData[754]++;
  function cb(value, context, argCount) {
    _$jscoverage['/underscore-umd.js'].functionData[73]++;
    _$jscoverage['/underscore-umd.js'].lineData[755]++;
    if (visit99_755_1(_$1.iteratee !== iteratee)) {
      return _$1.iteratee(value, context);
    }
    _$jscoverage['/underscore-umd.js'].lineData[756]++;
    return baseIteratee(value, context, argCount);
  }
  _$jscoverage['/underscore-umd.js'].lineData[761]++;
  function mapObject(obj, iteratee, context) {
    _$jscoverage['/underscore-umd.js'].functionData[74]++;
    _$jscoverage['/underscore-umd.js'].lineData[762]++;
    iteratee = cb(iteratee, context);
    _$jscoverage['/underscore-umd.js'].lineData[763]++;
    var _keys = keys(obj), length = _keys.length, results = {};
    _$jscoverage['/underscore-umd.js'].lineData[766]++;
    for (var index = 0; visit100_766_1(index < length); index++) {
      _$jscoverage['/underscore-umd.js'].lineData[767]++;
      var currentKey = _keys[index];
      _$jscoverage['/underscore-umd.js'].lineData[768]++;
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    _$jscoverage['/underscore-umd.js'].lineData[770]++;
    return results;
  }
  _$jscoverage['/underscore-umd.js'].lineData[774]++;
  function noop() {
    _$jscoverage['/underscore-umd.js'].functionData[75]++;
  }
  _$jscoverage['/underscore-umd.js'].lineData[777]++;
  function propertyOf(obj) {
    _$jscoverage['/underscore-umd.js'].functionData[76]++;
    _$jscoverage['/underscore-umd.js'].lineData[778]++;
    if (visit101_778_1(obj == null)) {
      return noop;
    }
    _$jscoverage['/underscore-umd.js'].lineData[779]++;
    return function(path) {
      _$jscoverage['/underscore-umd.js'].functionData[77]++;
      _$jscoverage['/underscore-umd.js'].lineData[780]++;
      return get(obj, path);
    };
  }
  _$jscoverage['/underscore-umd.js'].lineData[785]++;
  function times(n, iteratee, context) {
    _$jscoverage['/underscore-umd.js'].functionData[78]++;
    _$jscoverage['/underscore-umd.js'].lineData[786]++;
    var accum = Array(Math.max(0, n));
    _$jscoverage['/underscore-umd.js'].lineData[787]++;
    iteratee = optimizeCb(iteratee, context, 1);
    _$jscoverage['/underscore-umd.js'].lineData[788]++;
    for (var i = 0; visit102_788_1(i < n); i++) {
      accum[i] = iteratee(i);
    }
    _$jscoverage['/underscore-umd.js'].lineData[789]++;
    return accum;
  }
  _$jscoverage['/underscore-umd.js'].lineData[793]++;
  function random(min, max) {
    _$jscoverage['/underscore-umd.js'].functionData[79]++;
    _$jscoverage['/underscore-umd.js'].lineData[794]++;
    if (visit103_794_1(max == null)) {
      _$jscoverage['/underscore-umd.js'].lineData[795]++;
      max = min;
      _$jscoverage['/underscore-umd.js'].lineData[796]++;
      min = 0;
    }
    _$jscoverage['/underscore-umd.js'].lineData[798]++;
    return min + Math.floor(Math.random() * (max - min + 1));
  }
  _$jscoverage['/underscore-umd.js'].lineData[802]++;
  var now = visit104_802_1(Date.now || function() {
    _$jscoverage['/underscore-umd.js'].functionData[80]++;
    _$jscoverage['/underscore-umd.js'].lineData[803]++;
    return (new Date()).getTime();
  });
  _$jscoverage['/underscore-umd.js'].lineData[808]++;
  function createEscaper(map) {
    _$jscoverage['/underscore-umd.js'].functionData[81]++;
    _$jscoverage['/underscore-umd.js'].lineData[809]++;
    var escaper = function(match) {
      _$jscoverage['/underscore-umd.js'].functionData[82]++;
      _$jscoverage['/underscore-umd.js'].lineData[810]++;
      return map[match];
    };
    _$jscoverage['/underscore-umd.js'].lineData[813]++;
    var source = '(?:' + keys(map).join('|') + ')';
    _$jscoverage['/underscore-umd.js'].lineData[814]++;
    var testRegexp = RegExp(source);
    _$jscoverage['/underscore-umd.js'].lineData[815]++;
    var replaceRegexp = RegExp(source, 'g');
    _$jscoverage['/underscore-umd.js'].lineData[816]++;
    return function(string) {
      _$jscoverage['/underscore-umd.js'].functionData[83]++;
      _$jscoverage['/underscore-umd.js'].lineData[817]++;
      string = visit105_817_1(string == null) ? '' : '' + string;
      _$jscoverage['/underscore-umd.js'].lineData[818]++;
      return visit106_818_1(testRegexp.test(string)) ? string.replace(replaceRegexp, escaper) : string;
    };
  }
  _$jscoverage['/underscore-umd.js'].lineData[823]++;
  var escapeMap = {'\x26':'\x26amp;', '\x3c':'\x26lt;', '\x3e':'\x26gt;', '"':'\x26quot;', "'":'\x26#x27;', '`':'\x26#x60;'};
  _$jscoverage['/underscore-umd.js'].lineData[833]++;
  var _escape = createEscaper(escapeMap);
  _$jscoverage['/underscore-umd.js'].lineData[836]++;
  var unescapeMap = invert(escapeMap);
  _$jscoverage['/underscore-umd.js'].lineData[839]++;
  var _unescape = createEscaper(unescapeMap);
  _$jscoverage['/underscore-umd.js'].lineData[843]++;
  var templateSettings = _$1.templateSettings = {evaluate:/<%([\s\S]+?)%>/g, interpolate:/<%=([\s\S]+?)%>/g, escape:/<%-([\s\S]+?)%>/g};
  _$jscoverage['/underscore-umd.js'].lineData[852]++;
  var noMatch = /(.)^/;
  _$jscoverage['/underscore-umd.js'].lineData[856]++;
  var escapes = {"'":"'", '\\':'\\', '\r':'r', '\n':'n', '\u2028':'u2028', '\u2029':'u2029'};
  _$jscoverage['/underscore-umd.js'].lineData[865]++;
  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;
  _$jscoverage['/underscore-umd.js'].lineData[867]++;
  function escapeChar(match) {
    _$jscoverage['/underscore-umd.js'].functionData[84]++;
    _$jscoverage['/underscore-umd.js'].lineData[868]++;
    return '\\' + escapes[match];
  }
  _$jscoverage['/underscore-umd.js'].lineData[876]++;
  var bareIdentifier = /^\s*(\w|\$)+\s*$/;
  _$jscoverage['/underscore-umd.js'].lineData[882]++;
  function template(text, settings, oldSettings) {
    _$jscoverage['/underscore-umd.js'].functionData[85]++;
    _$jscoverage['/underscore-umd.js'].lineData[883]++;
    if (visit107_883_1(!settings && oldSettings)) {
      settings = oldSettings;
    }
    _$jscoverage['/underscore-umd.js'].lineData[884]++;
    settings = defaults({}, settings, _$1.templateSettings);
    _$jscoverage['/underscore-umd.js'].lineData[887]++;
    var matcher = RegExp([visit108_888_1(settings.escape || noMatch).source, visit109_889_1(settings.interpolate || noMatch).source, visit110_890_1(settings.evaluate || noMatch).source].join('|') + '|$', 'g');
    _$jscoverage['/underscore-umd.js'].lineData[894]++;
    var index = 0;
    _$jscoverage['/underscore-umd.js'].lineData[895]++;
    var source = "__p+\x3d'";
    _$jscoverage['/underscore-umd.js'].lineData[896]++;
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      _$jscoverage['/underscore-umd.js'].functionData[86]++;
      _$jscoverage['/underscore-umd.js'].lineData[897]++;
      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      _$jscoverage['/underscore-umd.js'].lineData[898]++;
      index = offset + match.length;
      _$jscoverage['/underscore-umd.js'].lineData[900]++;
      if (visit111_900_1(escape)) {
        _$jscoverage['/underscore-umd.js'].lineData[901]++;
        source += "'+\n((__t\x3d(" + escape + "))\x3d\x3dnull?'':_.escape(__t))+\n'";
      } else {
        _$jscoverage['/underscore-umd.js'].lineData[902]++;
        if (visit255_902_1(interpolate)) {
          _$jscoverage['/underscore-umd.js'].lineData[903]++;
          source += "'+\n((__t\x3d(" + interpolate + "))\x3d\x3dnull?'':__t)+\n'";
        } else {
          _$jscoverage['/underscore-umd.js'].lineData[904]++;
          if (visit361_904_1(evaluate)) {
            _$jscoverage['/underscore-umd.js'].lineData[905]++;
            source += "';\n" + evaluate + "\n__p+\x3d'";
          }
        }
      }
      _$jscoverage['/underscore-umd.js'].lineData[909]++;
      return match;
    });
    _$jscoverage['/underscore-umd.js'].lineData[911]++;
    source += "';\n";
    _$jscoverage['/underscore-umd.js'].lineData[913]++;
    var argument = settings.variable;
    _$jscoverage['/underscore-umd.js'].lineData[914]++;
    if (visit112_914_1(argument)) {
      _$jscoverage['/underscore-umd.js'].lineData[916]++;
      if (visit256_916_1(!bareIdentifier.test(argument))) {
        throw new Error('variable is not a bare identifier: ' + argument);
      }
    } else {
      _$jscoverage['/underscore-umd.js'].lineData[921]++;
      source = 'with(obj||{}){\n' + source + '}\n';
      _$jscoverage['/underscore-umd.js'].lineData[922]++;
      argument = 'obj';
    }
    _$jscoverage['/underscore-umd.js'].lineData[925]++;
    source = "var __t,__p\x3d'',__j\x3dArray.prototype.join," + "print\x3dfunction(){__p+\x3d__j.call(arguments,'');};\n" + source + 'return __p;\n';
    _$jscoverage['/underscore-umd.js'].lineData[929]++;
    var render;
    _$jscoverage['/underscore-umd.js'].lineData[930]++;
    try {
      _$jscoverage['/underscore-umd.js'].lineData[931]++;
      render = new Function(argument, '_', source);
    } catch (e) {
      _$jscoverage['/underscore-umd.js'].lineData[933]++;
      e.source = source;
      _$jscoverage['/underscore-umd.js'].lineData[934]++;
      throw e;
    }
    _$jscoverage['/underscore-umd.js'].lineData[937]++;
    var template = function(data) {
      _$jscoverage['/underscore-umd.js'].functionData[87]++;
      _$jscoverage['/underscore-umd.js'].lineData[938]++;
      return render.call(this, data, _$1);
    };
    _$jscoverage['/underscore-umd.js'].lineData[942]++;
    template.source = 'function(' + argument + '){\n' + source + '}';
    _$jscoverage['/underscore-umd.js'].lineData[944]++;
    return template;
  }
  _$jscoverage['/underscore-umd.js'].lineData[950]++;
  function result(obj, path, fallback) {
    _$jscoverage['/underscore-umd.js'].functionData[88]++;
    _$jscoverage['/underscore-umd.js'].lineData[951]++;
    path = toPath(path);
    _$jscoverage['/underscore-umd.js'].lineData[952]++;
    var length = path.length;
    _$jscoverage['/underscore-umd.js'].lineData[953]++;
    if (visit113_953_1(!length)) {
      _$jscoverage['/underscore-umd.js'].lineData[954]++;
      return visit257_954_1(isFunction$1(fallback)) ? fallback.call(obj) : fallback;
    }
    _$jscoverage['/underscore-umd.js'].lineData[956]++;
    for (var i = 0; visit114_956_1(i < length); i++) {
      _$jscoverage['/underscore-umd.js'].lineData[957]++;
      var prop = visit258_957_1(obj == null) ? void 0 : obj[path[i]];
      _$jscoverage['/underscore-umd.js'].lineData[958]++;
      if (visit259_958_1(prop === void 0)) {
        _$jscoverage['/underscore-umd.js'].lineData[959]++;
        prop = fallback;
        _$jscoverage['/underscore-umd.js'].lineData[960]++;
        i = length;
      }
      _$jscoverage['/underscore-umd.js'].lineData[962]++;
      obj = visit260_962_1(isFunction$1(prop)) ? prop.call(obj) : prop;
    }
    _$jscoverage['/underscore-umd.js'].lineData[964]++;
    return obj;
  }
  _$jscoverage['/underscore-umd.js'].lineData[969]++;
  var idCounter = 0;
  _$jscoverage['/underscore-umd.js'].lineData[970]++;
  function uniqueId(prefix) {
    _$jscoverage['/underscore-umd.js'].functionData[89]++;
    _$jscoverage['/underscore-umd.js'].lineData[971]++;
    var id = ++idCounter + '';
    _$jscoverage['/underscore-umd.js'].lineData[972]++;
    return visit115_972_1(prefix) ? prefix + id : id;
  }
  _$jscoverage['/underscore-umd.js'].lineData[976]++;
  function chain(obj) {
    _$jscoverage['/underscore-umd.js'].functionData[90]++;
    _$jscoverage['/underscore-umd.js'].lineData[977]++;
    var instance = _$1(obj);
    _$jscoverage['/underscore-umd.js'].lineData[978]++;
    instance._chain = true;
    _$jscoverage['/underscore-umd.js'].lineData[979]++;
    return instance;
  }
  _$jscoverage['/underscore-umd.js'].lineData[985]++;
  function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
    _$jscoverage['/underscore-umd.js'].functionData[91]++;
    _$jscoverage['/underscore-umd.js'].lineData[986]++;
    if (visit116_986_1(!(callingContext instanceof boundFunc))) {
      return sourceFunc.apply(context, args);
    }
    _$jscoverage['/underscore-umd.js'].lineData[987]++;
    var self = baseCreate(sourceFunc.prototype);
    _$jscoverage['/underscore-umd.js'].lineData[988]++;
    var result = sourceFunc.apply(self, args);
    _$jscoverage['/underscore-umd.js'].lineData[989]++;
    if (visit117_989_1(isObject(result))) {
      return result;
    }
    _$jscoverage['/underscore-umd.js'].lineData[990]++;
    return self;
  }
  _$jscoverage['/underscore-umd.js'].lineData[997]++;
  var partial = restArguments(function(func, boundArgs) {
    _$jscoverage['/underscore-umd.js'].functionData[92]++;
    _$jscoverage['/underscore-umd.js'].lineData[998]++;
    var placeholder = partial.placeholder;
    _$jscoverage['/underscore-umd.js'].lineData[999]++;
    var bound = function() {
      _$jscoverage['/underscore-umd.js'].functionData[93]++;
      _$jscoverage['/underscore-umd.js'].lineData[1E3]++;
      var position = 0, length = boundArgs.length;
      _$jscoverage['/underscore-umd.js'].lineData[1001]++;
      var args = Array(length);
      _$jscoverage['/underscore-umd.js'].lineData[1002]++;
      for (var i = 0; visit118_1002_1(i < length); i++) {
        _$jscoverage['/underscore-umd.js'].lineData[1003]++;
        args[i] = visit261_1003_1(boundArgs[i] === placeholder) ? arguments[position++] : boundArgs[i];
      }
      _$jscoverage['/underscore-umd.js'].lineData[1005]++;
      while (visit119_1005_1(position < arguments.length)) {
        args.push(arguments[position++]);
      }
      _$jscoverage['/underscore-umd.js'].lineData[1006]++;
      return executeBound(func, bound, this, this, args);
    };
    _$jscoverage['/underscore-umd.js'].lineData[1008]++;
    return bound;
  });
  _$jscoverage['/underscore-umd.js'].lineData[1011]++;
  partial.placeholder = _$1;
  _$jscoverage['/underscore-umd.js'].lineData[1015]++;
  var bind = restArguments(function(func, context, args) {
    _$jscoverage['/underscore-umd.js'].functionData[94]++;
    _$jscoverage['/underscore-umd.js'].lineData[1016]++;
    if (visit120_1016_1(!isFunction$1(func))) {
      throw new TypeError('Bind must be called on a function');
    }
    _$jscoverage['/underscore-umd.js'].lineData[1017]++;
    var bound = restArguments(function(callArgs) {
      _$jscoverage['/underscore-umd.js'].functionData[95]++;
      _$jscoverage['/underscore-umd.js'].lineData[1018]++;
      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
    _$jscoverage['/underscore-umd.js'].lineData[1020]++;
    return bound;
  });
  _$jscoverage['/underscore-umd.js'].lineData[1027]++;
  var isArrayLike = createSizePropertyCheck(getLength);
  _$jscoverage['/underscore-umd.js'].lineData[1030]++;
  function flatten$1(input, depth, strict, output) {
    _$jscoverage['/underscore-umd.js'].functionData[96]++;
    _$jscoverage['/underscore-umd.js'].lineData[1031]++;
    output = visit121_1031_1(output || []);
    _$jscoverage['/underscore-umd.js'].lineData[1032]++;
    if (visit122_1032_1(!depth && visit262_1032_2(depth !== 0))) {
      _$jscoverage['/underscore-umd.js'].lineData[1033]++;
      depth = Infinity;
    } else {
      _$jscoverage['/underscore-umd.js'].lineData[1034]++;
      if (visit263_1034_1(depth <= 0)) {
        _$jscoverage['/underscore-umd.js'].lineData[1035]++;
        return output.concat(input);
      }
    }
    _$jscoverage['/underscore-umd.js'].lineData[1037]++;
    var idx = output.length;
    _$jscoverage['/underscore-umd.js'].lineData[1038]++;
    for (var i = 0, length = getLength(input); visit123_1038_1(i < length); i++) {
      _$jscoverage['/underscore-umd.js'].lineData[1039]++;
      var value = input[i];
      _$jscoverage['/underscore-umd.js'].lineData[1040]++;
      if (visit264_1040_1(isArrayLike(value) && visit362_1040_2(isArray(value) || isArguments$1(value)))) {
        _$jscoverage['/underscore-umd.js'].lineData[1042]++;
        if (visit363_1042_1(depth > 1)) {
          _$jscoverage['/underscore-umd.js'].lineData[1043]++;
          flatten$1(value, depth - 1, strict, output);
          _$jscoverage['/underscore-umd.js'].lineData[1044]++;
          idx = output.length;
        } else {
          _$jscoverage['/underscore-umd.js'].lineData[1046]++;
          var j = 0, len = value.length;
          _$jscoverage['/underscore-umd.js'].lineData[1047]++;
          while (visit408_1047_1(j < len)) {
            output[idx++] = value[j++];
          }
        }
      } else {
        _$jscoverage['/underscore-umd.js'].lineData[1049]++;
        if (visit364_1049_1(!strict)) {
          _$jscoverage['/underscore-umd.js'].lineData[1050]++;
          output[idx++] = value;
        }
      }
    }
    _$jscoverage['/underscore-umd.js'].lineData[1053]++;
    return output;
  }
  _$jscoverage['/underscore-umd.js'].lineData[1059]++;
  var bindAll = restArguments(function(obj, keys) {
    _$jscoverage['/underscore-umd.js'].functionData[97]++;
    _$jscoverage['/underscore-umd.js'].lineData[1060]++;
    keys = flatten$1(keys, false, false);
    _$jscoverage['/underscore-umd.js'].lineData[1061]++;
    var index = keys.length;
    _$jscoverage['/underscore-umd.js'].lineData[1062]++;
    if (visit124_1062_1(index < 1)) {
      throw new Error('bindAll must be passed function names');
    }
    _$jscoverage['/underscore-umd.js'].lineData[1063]++;
    while (visit125_1063_1(index--)) {
      _$jscoverage['/underscore-umd.js'].lineData[1064]++;
      var key = keys[index];
      _$jscoverage['/underscore-umd.js'].lineData[1065]++;
      obj[key] = bind(obj[key], obj);
    }
    _$jscoverage['/underscore-umd.js'].lineData[1067]++;
    return obj;
  });
  _$jscoverage['/underscore-umd.js'].lineData[1071]++;
  function memoize(func, hasher) {
    _$jscoverage['/underscore-umd.js'].functionData[98]++;
    _$jscoverage['/underscore-umd.js'].lineData[1072]++;
    var memoize = function(key) {
      _$jscoverage['/underscore-umd.js'].functionData[99]++;
      _$jscoverage['/underscore-umd.js'].lineData[1073]++;
      var cache = memoize.cache;
      _$jscoverage['/underscore-umd.js'].lineData[1074]++;
      var address = '' + (visit126_1074_1(hasher) ? hasher.apply(this, arguments) : key);
      _$jscoverage['/underscore-umd.js'].lineData[1075]++;
      if (visit127_1075_1(!has$1(cache, address))) {
        cache[address] = func.apply(this, arguments);
      }
      _$jscoverage['/underscore-umd.js'].lineData[1076]++;
      return cache[address];
    };
    _$jscoverage['/underscore-umd.js'].lineData[1078]++;
    memoize.cache = {};
    _$jscoverage['/underscore-umd.js'].lineData[1079]++;
    return memoize;
  }
  _$jscoverage['/underscore-umd.js'].lineData[1084]++;
  var delay = restArguments(function(func, wait, args) {
    _$jscoverage['/underscore-umd.js'].functionData[100]++;
    _$jscoverage['/underscore-umd.js'].lineData[1085]++;
    return setTimeout(function() {
      _$jscoverage['/underscore-umd.js'].functionData[101]++;
      _$jscoverage['/underscore-umd.js'].lineData[1086]++;
      return func.apply(null, args);
    }, wait);
  });
  _$jscoverage['/underscore-umd.js'].lineData[1092]++;
  var defer = partial(delay, _$1, 1);
  _$jscoverage['/underscore-umd.js'].lineData[1099]++;
  function throttle(func, wait, options) {
    _$jscoverage['/underscore-umd.js'].functionData[102]++;
    _$jscoverage['/underscore-umd.js'].lineData[1100]++;
    var timeout, context, args, result;
    _$jscoverage['/underscore-umd.js'].lineData[1101]++;
    var previous = 0;
    _$jscoverage['/underscore-umd.js'].lineData[1102]++;
    if (visit128_1102_1(!options)) {
      options = {};
    }
    _$jscoverage['/underscore-umd.js'].lineData[1104]++;
    var later = function() {
      _$jscoverage['/underscore-umd.js'].functionData[103]++;
      _$jscoverage['/underscore-umd.js'].lineData[1105]++;
      previous = visit129_1105_1(options.leading === false) ? 0 : now();
      _$jscoverage['/underscore-umd.js'].lineData[1106]++;
      timeout = null;
      _$jscoverage['/underscore-umd.js'].lineData[1107]++;
      result = func.apply(context, args);
      _$jscoverage['/underscore-umd.js'].lineData[1108]++;
      if (visit130_1108_1(!timeout)) {
        context = args = null;
      }
    };
    _$jscoverage['/underscore-umd.js'].lineData[1111]++;
    var throttled = function() {
      _$jscoverage['/underscore-umd.js'].functionData[104]++;
      _$jscoverage['/underscore-umd.js'].lineData[1112]++;
      var _now = now();
      _$jscoverage['/underscore-umd.js'].lineData[1113]++;
      if (visit131_1113_1(!previous && visit265_1113_2(options.leading === false))) {
        previous = _now;
      }
      _$jscoverage['/underscore-umd.js'].lineData[1114]++;
      var remaining = wait - (_now - previous);
      _$jscoverage['/underscore-umd.js'].lineData[1115]++;
      context = this;
      _$jscoverage['/underscore-umd.js'].lineData[1116]++;
      args = arguments;
      _$jscoverage['/underscore-umd.js'].lineData[1117]++;
      if (visit132_1117_1(visit266_1117_2(remaining <= 0) || visit365_1117_3(remaining > wait))) {
        _$jscoverage['/underscore-umd.js'].lineData[1118]++;
        if (visit267_1118_1(timeout)) {
          _$jscoverage['/underscore-umd.js'].lineData[1119]++;
          clearTimeout(timeout);
          _$jscoverage['/underscore-umd.js'].lineData[1120]++;
          timeout = null;
        }
        _$jscoverage['/underscore-umd.js'].lineData[1122]++;
        previous = _now;
        _$jscoverage['/underscore-umd.js'].lineData[1123]++;
        result = func.apply(context, args);
        _$jscoverage['/underscore-umd.js'].lineData[1124]++;
        if (visit268_1124_1(!timeout)) {
          context = args = null;
        }
      } else {
        _$jscoverage['/underscore-umd.js'].lineData[1125]++;
        if (visit269_1125_1(!timeout && visit366_1125_2(options.trailing !== false))) {
          _$jscoverage['/underscore-umd.js'].lineData[1126]++;
          timeout = setTimeout(later, remaining);
        }
      }
      _$jscoverage['/underscore-umd.js'].lineData[1128]++;
      return result;
    };
    _$jscoverage['/underscore-umd.js'].lineData[1131]++;
    throttled.cancel = function() {
      _$jscoverage['/underscore-umd.js'].functionData[105]++;
      _$jscoverage['/underscore-umd.js'].lineData[1132]++;
      clearTimeout(timeout);
      _$jscoverage['/underscore-umd.js'].lineData[1133]++;
      previous = 0;
      _$jscoverage['/underscore-umd.js'].lineData[1134]++;
      timeout = context = args = null;
    };
    _$jscoverage['/underscore-umd.js'].lineData[1137]++;
    return throttled;
  }
  _$jscoverage['/underscore-umd.js'].lineData[1144]++;
  function debounce(func, wait, immediate) {
    _$jscoverage['/underscore-umd.js'].functionData[106]++;
    _$jscoverage['/underscore-umd.js'].lineData[1145]++;
    var timeout, previous, args, result, context;
    _$jscoverage['/underscore-umd.js'].lineData[1147]++;
    var later = function() {
      _$jscoverage['/underscore-umd.js'].functionData[107]++;
      _$jscoverage['/underscore-umd.js'].lineData[1148]++;
      var passed = now() - previous;
      _$jscoverage['/underscore-umd.js'].lineData[1149]++;
      if (visit133_1149_1(wait > passed)) {
        _$jscoverage['/underscore-umd.js'].lineData[1150]++;
        timeout = setTimeout(later, wait - passed);
      } else {
        _$jscoverage['/underscore-umd.js'].lineData[1152]++;
        timeout = null;
        _$jscoverage['/underscore-umd.js'].lineData[1153]++;
        if (visit270_1153_1(!immediate)) {
          result = func.apply(context, args);
        }
        _$jscoverage['/underscore-umd.js'].lineData[1155]++;
        if (visit271_1155_1(!timeout)) {
          args = context = null;
        }
      }
    };
    _$jscoverage['/underscore-umd.js'].lineData[1159]++;
    var debounced = restArguments(function(_args) {
      _$jscoverage['/underscore-umd.js'].functionData[108]++;
      _$jscoverage['/underscore-umd.js'].lineData[1160]++;
      context = this;
      _$jscoverage['/underscore-umd.js'].lineData[1161]++;
      args = _args;
      _$jscoverage['/underscore-umd.js'].lineData[1162]++;
      previous = now();
      _$jscoverage['/underscore-umd.js'].lineData[1163]++;
      if (visit134_1163_1(!timeout)) {
        _$jscoverage['/underscore-umd.js'].lineData[1164]++;
        timeout = setTimeout(later, wait);
        _$jscoverage['/underscore-umd.js'].lineData[1165]++;
        if (visit272_1165_1(immediate)) {
          result = func.apply(context, args);
        }
      }
      _$jscoverage['/underscore-umd.js'].lineData[1167]++;
      return result;
    });
    _$jscoverage['/underscore-umd.js'].lineData[1170]++;
    debounced.cancel = function() {
      _$jscoverage['/underscore-umd.js'].functionData[109]++;
      _$jscoverage['/underscore-umd.js'].lineData[1171]++;
      clearTimeout(timeout);
      _$jscoverage['/underscore-umd.js'].lineData[1172]++;
      timeout = args = context = null;
    };
    _$jscoverage['/underscore-umd.js'].lineData[1175]++;
    return debounced;
  }
  _$jscoverage['/underscore-umd.js'].lineData[1181]++;
  function wrap(func, wrapper) {
    _$jscoverage['/underscore-umd.js'].functionData[110]++;
    _$jscoverage['/underscore-umd.js'].lineData[1182]++;
    return partial(wrapper, func);
  }
  _$jscoverage['/underscore-umd.js'].lineData[1186]++;
  function negate(predicate) {
    _$jscoverage['/underscore-umd.js'].functionData[111]++;
    _$jscoverage['/underscore-umd.js'].lineData[1187]++;
    return function() {
      _$jscoverage['/underscore-umd.js'].functionData[112]++;
      _$jscoverage['/underscore-umd.js'].lineData[1188]++;
      return !predicate.apply(this, arguments);
    };
  }
  _$jscoverage['/underscore-umd.js'].lineData[1194]++;
  function compose() {
    _$jscoverage['/underscore-umd.js'].functionData[113]++;
    _$jscoverage['/underscore-umd.js'].lineData[1195]++;
    var args = arguments;
    _$jscoverage['/underscore-umd.js'].lineData[1196]++;
    var start = args.length - 1;
    _$jscoverage['/underscore-umd.js'].lineData[1197]++;
    return function() {
      _$jscoverage['/underscore-umd.js'].functionData[114]++;
      _$jscoverage['/underscore-umd.js'].lineData[1198]++;
      var i = start;
      _$jscoverage['/underscore-umd.js'].lineData[1199]++;
      var result = args[start].apply(this, arguments);
      _$jscoverage['/underscore-umd.js'].lineData[1200]++;
      while (visit135_1200_1(i--)) {
        result = args[i].call(this, result);
      }
      _$jscoverage['/underscore-umd.js'].lineData[1201]++;
      return result;
    };
  }
  _$jscoverage['/underscore-umd.js'].lineData[1206]++;
  function after(times, func) {
    _$jscoverage['/underscore-umd.js'].functionData[115]++;
    _$jscoverage['/underscore-umd.js'].lineData[1207]++;
    return function() {
      _$jscoverage['/underscore-umd.js'].functionData[116]++;
      _$jscoverage['/underscore-umd.js'].lineData[1208]++;
      if (visit136_1208_1(--times < 1)) {
        _$jscoverage['/underscore-umd.js'].lineData[1209]++;
        return func.apply(this, arguments);
      }
    };
  }
  _$jscoverage['/underscore-umd.js'].lineData[1216]++;
  function before(times, func) {
    _$jscoverage['/underscore-umd.js'].functionData[117]++;
    _$jscoverage['/underscore-umd.js'].lineData[1217]++;
    var memo;
    _$jscoverage['/underscore-umd.js'].lineData[1218]++;
    return function() {
      _$jscoverage['/underscore-umd.js'].functionData[118]++;
      _$jscoverage['/underscore-umd.js'].lineData[1219]++;
      if (visit137_1219_1(--times > 0)) {
        _$jscoverage['/underscore-umd.js'].lineData[1220]++;
        memo = func.apply(this, arguments);
      }
      _$jscoverage['/underscore-umd.js'].lineData[1222]++;
      if (visit138_1222_1(times <= 1)) {
        func = null;
      }
      _$jscoverage['/underscore-umd.js'].lineData[1223]++;
      return memo;
    };
  }
  _$jscoverage['/underscore-umd.js'].lineData[1229]++;
  var once = partial(before, 2);
  _$jscoverage['/underscore-umd.js'].lineData[1232]++;
  function findKey(obj, predicate, context) {
    _$jscoverage['/underscore-umd.js'].functionData[119]++;
    _$jscoverage['/underscore-umd.js'].lineData[1233]++;
    predicate = cb(predicate, context);
    _$jscoverage['/underscore-umd.js'].lineData[1234]++;
    var _keys = keys(obj), key;
    _$jscoverage['/underscore-umd.js'].lineData[1235]++;
    for (var i = 0, length = _keys.length; visit139_1235_1(i < length); i++) {
      _$jscoverage['/underscore-umd.js'].lineData[1236]++;
      key = _keys[i];
      _$jscoverage['/underscore-umd.js'].lineData[1237]++;
      if (visit273_1237_1(predicate(obj[key], key, obj))) {
        return key;
      }
    }
  }
  _$jscoverage['/underscore-umd.js'].lineData[1242]++;
  function createPredicateIndexFinder(dir) {
    _$jscoverage['/underscore-umd.js'].functionData[120]++;
    _$jscoverage['/underscore-umd.js'].lineData[1243]++;
    return function(array, predicate, context) {
      _$jscoverage['/underscore-umd.js'].functionData[121]++;
      _$jscoverage['/underscore-umd.js'].lineData[1244]++;
      predicate = cb(predicate, context);
      _$jscoverage['/underscore-umd.js'].lineData[1245]++;
      var length = getLength(array);
      _$jscoverage['/underscore-umd.js'].lineData[1246]++;
      var index = visit140_1246_1(dir > 0) ? 0 : length - 1;
      _$jscoverage['/underscore-umd.js'].lineData[1247]++;
      for (; visit141_1247_1(visit274_1247_2(index >= 0) && visit367_1247_3(index < length)); index += dir) {
        _$jscoverage['/underscore-umd.js'].lineData[1248]++;
        if (visit275_1248_1(predicate(array[index], index, array))) {
          return index;
        }
      }
      _$jscoverage['/underscore-umd.js'].lineData[1250]++;
      return -1;
    };
  }
  _$jscoverage['/underscore-umd.js'].lineData[1255]++;
  var findIndex = createPredicateIndexFinder(1);
  _$jscoverage['/underscore-umd.js'].lineData[1258]++;
  var findLastIndex = createPredicateIndexFinder(-1);
  _$jscoverage['/underscore-umd.js'].lineData[1262]++;
  function sortedIndex(array, obj, iteratee, context) {
    _$jscoverage['/underscore-umd.js'].functionData[122]++;
    _$jscoverage['/underscore-umd.js'].lineData[1263]++;
    iteratee = cb(iteratee, context, 1);
    _$jscoverage['/underscore-umd.js'].lineData[1264]++;
    var value = iteratee(obj);
    _$jscoverage['/underscore-umd.js'].lineData[1265]++;
    var low = 0, high = getLength(array);
    _$jscoverage['/underscore-umd.js'].lineData[1266]++;
    while (visit142_1266_1(low < high)) {
      _$jscoverage['/underscore-umd.js'].lineData[1267]++;
      var mid = Math.floor((low + high) / 2);
      _$jscoverage['/underscore-umd.js'].lineData[1268]++;
      if (visit276_1268_1(iteratee(array[mid]) < value)) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    _$jscoverage['/underscore-umd.js'].lineData[1270]++;
    return low;
  }
  _$jscoverage['/underscore-umd.js'].lineData[1274]++;
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    _$jscoverage['/underscore-umd.js'].functionData[123]++;
    _$jscoverage['/underscore-umd.js'].lineData[1275]++;
    return function(array, item, idx) {
      _$jscoverage['/underscore-umd.js'].functionData[124]++;
      _$jscoverage['/underscore-umd.js'].lineData[1276]++;
      var i = 0, length = getLength(array);
      _$jscoverage['/underscore-umd.js'].lineData[1277]++;
      if (visit143_1277_1(typeof idx == 'number')) {
        _$jscoverage['/underscore-umd.js'].lineData[1278]++;
        if (visit277_1278_1(dir > 0)) {
          _$jscoverage['/underscore-umd.js'].lineData[1279]++;
          i = visit368_1279_1(idx >= 0) ? idx : Math.max(idx + length, i);
        } else {
          _$jscoverage['/underscore-umd.js'].lineData[1281]++;
          length = visit369_1281_1(idx >= 0) ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else {
        _$jscoverage['/underscore-umd.js'].lineData[1283]++;
        if (visit278_1283_1(visit370_1283_2(sortedIndex && idx) && length)) {
          _$jscoverage['/underscore-umd.js'].lineData[1284]++;
          idx = sortedIndex(array, item);
          _$jscoverage['/underscore-umd.js'].lineData[1285]++;
          return visit371_1285_1(array[idx] === item) ? idx : -1;
        }
      }
      _$jscoverage['/underscore-umd.js'].lineData[1287]++;
      if (visit144_1287_1(item !== item)) {
        _$jscoverage['/underscore-umd.js'].lineData[1288]++;
        idx = predicateFind(slice.call(array, i, length), isNaN$1);
        _$jscoverage['/underscore-umd.js'].lineData[1289]++;
        return visit279_1289_1(idx >= 0) ? idx + i : -1;
      }
      _$jscoverage['/underscore-umd.js'].lineData[1291]++;
      for (idx = visit145_1291_1(dir > 0) ? i : length - 1; visit146_1291_2(visit280_1291_3(idx >= 0) && visit372_1291_4(idx < length)); idx += dir) {
        _$jscoverage['/underscore-umd.js'].lineData[1292]++;
        if (visit281_1292_1(array[idx] === item)) {
          return idx;
        }
      }
      _$jscoverage['/underscore-umd.js'].lineData[1294]++;
      return -1;
    };
  }
  _$jscoverage['/underscore-umd.js'].lineData[1302]++;
  var indexOf = createIndexFinder(1, findIndex, sortedIndex);
  _$jscoverage['/underscore-umd.js'].lineData[1306]++;
  var lastIndexOf = createIndexFinder(-1, findLastIndex);
  _$jscoverage['/underscore-umd.js'].lineData[1309]++;
  function find(obj, predicate, context) {
    _$jscoverage['/underscore-umd.js'].functionData[125]++;
    _$jscoverage['/underscore-umd.js'].lineData[1310]++;
    var keyFinder = visit147_1310_1(isArrayLike(obj)) ? findIndex : findKey;
    _$jscoverage['/underscore-umd.js'].lineData[1311]++;
    var key = keyFinder(obj, predicate, context);
    _$jscoverage['/underscore-umd.js'].lineData[1312]++;
    if (visit148_1312_1(visit282_1312_2(key !== void 0) && visit373_1312_3(key !== -1))) {
      return obj[key];
    }
  }
  _$jscoverage['/underscore-umd.js'].lineData[1317]++;
  function findWhere(obj, attrs) {
    _$jscoverage['/underscore-umd.js'].functionData[126]++;
    _$jscoverage['/underscore-umd.js'].lineData[1318]++;
    return find(obj, matcher(attrs));
  }
  _$jscoverage['/underscore-umd.js'].lineData[1325]++;
  function each(obj, iteratee, context) {
    _$jscoverage['/underscore-umd.js'].functionData[127]++;
    _$jscoverage['/underscore-umd.js'].lineData[1326]++;
    iteratee = optimizeCb(iteratee, context);
    _$jscoverage['/underscore-umd.js'].lineData[1327]++;
    var i, length;
    _$jscoverage['/underscore-umd.js'].lineData[1328]++;
    if (visit149_1328_1(isArrayLike(obj))) {
      _$jscoverage['/underscore-umd.js'].lineData[1329]++;
      for (i = 0, length = obj.length; visit283_1329_1(i < length); i++) {
        _$jscoverage['/underscore-umd.js'].lineData[1330]++;
        iteratee(obj[i], i, obj);
      }
    } else {
      _$jscoverage['/underscore-umd.js'].lineData[1333]++;
      var _keys = keys(obj);
      _$jscoverage['/underscore-umd.js'].lineData[1334]++;
      for (i = 0, length = _keys.length; visit284_1334_1(i < length); i++) {
        _$jscoverage['/underscore-umd.js'].lineData[1335]++;
        iteratee(obj[_keys[i]], _keys[i], obj);
      }
    }
    _$jscoverage['/underscore-umd.js'].lineData[1338]++;
    return obj;
  }
  _$jscoverage['/underscore-umd.js'].lineData[1342]++;
  function map(obj, iteratee, context) {
    _$jscoverage['/underscore-umd.js'].functionData[128]++;
    _$jscoverage['/underscore-umd.js'].lineData[1343]++;
    iteratee = cb(iteratee, context);
    _$jscoverage['/underscore-umd.js'].lineData[1344]++;
    var _keys = visit150_1344_1(!isArrayLike(obj) && keys(obj)), length = visit151_1345_1(_keys || obj).length, results = Array(length);
    _$jscoverage['/underscore-umd.js'].lineData[1347]++;
    for (var index = 0; visit152_1347_1(index < length); index++) {
      _$jscoverage['/underscore-umd.js'].lineData[1348]++;
      var currentKey = visit285_1348_1(_keys) ? _keys[index] : index;
      _$jscoverage['/underscore-umd.js'].lineData[1349]++;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    _$jscoverage['/underscore-umd.js'].lineData[1351]++;
    return results;
  }
  _$jscoverage['/underscore-umd.js'].lineData[1355]++;
  function createReduce(dir) {
    _$jscoverage['/underscore-umd.js'].functionData[129]++;
    _$jscoverage['/underscore-umd.js'].lineData[1358]++;
    var reducer = function(obj, iteratee, memo, initial) {
      _$jscoverage['/underscore-umd.js'].functionData[130]++;
      _$jscoverage['/underscore-umd.js'].lineData[1359]++;
      var _keys = visit153_1359_1(!isArrayLike(obj) && keys(obj)), length = visit154_1360_1(_keys || obj).length, index = visit155_1361_1(dir > 0) ? 0 : length - 1;
      _$jscoverage['/underscore-umd.js'].lineData[1362]++;
      if (visit156_1362_1(!initial)) {
        _$jscoverage['/underscore-umd.js'].lineData[1363]++;
        memo = obj[visit286_1363_1(_keys) ? _keys[index] : index];
        _$jscoverage['/underscore-umd.js'].lineData[1364]++;
        index += dir;
      }
      _$jscoverage['/underscore-umd.js'].lineData[1366]++;
      for (; visit157_1366_1(visit287_1366_2(index >= 0) && visit374_1366_3(index < length)); index += dir) {
        _$jscoverage['/underscore-umd.js'].lineData[1367]++;
        var currentKey = visit288_1367_1(_keys) ? _keys[index] : index;
        _$jscoverage['/underscore-umd.js'].lineData[1368]++;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      _$jscoverage['/underscore-umd.js'].lineData[1370]++;
      return memo;
    };
    _$jscoverage['/underscore-umd.js'].lineData[1373]++;
    return function(obj, iteratee, memo, context) {
      _$jscoverage['/underscore-umd.js'].functionData[131]++;
      _$jscoverage['/underscore-umd.js'].lineData[1374]++;
      var initial = visit158_1374_1(arguments.length >= 3);
      _$jscoverage['/underscore-umd.js'].lineData[1375]++;
      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
    };
  }
  _$jscoverage['/underscore-umd.js'].lineData[1381]++;
  var reduce = createReduce(1);
  _$jscoverage['/underscore-umd.js'].lineData[1384]++;
  var reduceRight = createReduce(-1);
  _$jscoverage['/underscore-umd.js'].lineData[1387]++;
  function filter(obj, predicate, context) {
    _$jscoverage['/underscore-umd.js'].functionData[132]++;
    _$jscoverage['/underscore-umd.js'].lineData[1388]++;
    var results = [];
    _$jscoverage['/underscore-umd.js'].lineData[1389]++;
    predicate = cb(predicate, context);
    _$jscoverage['/underscore-umd.js'].lineData[1390]++;
    each(obj, function(value, index, list) {
      _$jscoverage['/underscore-umd.js'].functionData[133]++;
      _$jscoverage['/underscore-umd.js'].lineData[1391]++;
      if (visit159_1391_1(predicate(value, index, list))) {
        results.push(value);
      }
    });
    _$jscoverage['/underscore-umd.js'].lineData[1393]++;
    return results;
  }
  _$jscoverage['/underscore-umd.js'].lineData[1397]++;
  function reject(obj, predicate, context) {
    _$jscoverage['/underscore-umd.js'].functionData[134]++;
    _$jscoverage['/underscore-umd.js'].lineData[1398]++;
    return filter(obj, negate(cb(predicate)), context);
  }
  _$jscoverage['/underscore-umd.js'].lineData[1402]++;
  function every(obj, predicate, context) {
    _$jscoverage['/underscore-umd.js'].functionData[135]++;
    _$jscoverage['/underscore-umd.js'].lineData[1403]++;
    predicate = cb(predicate, context);
    _$jscoverage['/underscore-umd.js'].lineData[1404]++;
    var _keys = visit160_1404_1(!isArrayLike(obj) && keys(obj)), length = visit161_1405_1(_keys || obj).length;
    _$jscoverage['/underscore-umd.js'].lineData[1406]++;
    for (var index = 0; visit162_1406_1(index < length); index++) {
      _$jscoverage['/underscore-umd.js'].lineData[1407]++;
      var currentKey = visit289_1407_1(_keys) ? _keys[index] : index;
      _$jscoverage['/underscore-umd.js'].lineData[1408]++;
      if (visit290_1408_1(!predicate(obj[currentKey], currentKey, obj))) {
        return false;
      }
    }
    _$jscoverage['/underscore-umd.js'].lineData[1410]++;
    return true;
  }
  _$jscoverage['/underscore-umd.js'].lineData[1414]++;
  function some(obj, predicate, context) {
    _$jscoverage['/underscore-umd.js'].functionData[136]++;
    _$jscoverage['/underscore-umd.js'].lineData[1415]++;
    predicate = cb(predicate, context);
    _$jscoverage['/underscore-umd.js'].lineData[1416]++;
    var _keys = visit163_1416_1(!isArrayLike(obj) && keys(obj)), length = visit164_1417_1(_keys || obj).length;
    _$jscoverage['/underscore-umd.js'].lineData[1418]++;
    for (var index = 0; visit165_1418_1(index < length); index++) {
      _$jscoverage['/underscore-umd.js'].lineData[1419]++;
      var currentKey = visit291_1419_1(_keys) ? _keys[index] : index;
      _$jscoverage['/underscore-umd.js'].lineData[1420]++;
      if (visit292_1420_1(predicate(obj[currentKey], currentKey, obj))) {
        return true;
      }
    }
    _$jscoverage['/underscore-umd.js'].lineData[1422]++;
    return false;
  }
  _$jscoverage['/underscore-umd.js'].lineData[1426]++;
  function contains(obj, item, fromIndex, guard) {
    _$jscoverage['/underscore-umd.js'].functionData[137]++;
    _$jscoverage['/underscore-umd.js'].lineData[1427]++;
    if (visit166_1427_1(!isArrayLike(obj))) {
      obj = values(obj);
    }
    _$jscoverage['/underscore-umd.js'].lineData[1428]++;
    if (visit167_1428_1(visit293_1428_2(typeof fromIndex != 'number') || guard)) {
      fromIndex = 0;
    }
    _$jscoverage['/underscore-umd.js'].lineData[1429]++;
    return visit168_1429_1(indexOf(obj, item, fromIndex) >= 0);
  }
  _$jscoverage['/underscore-umd.js'].lineData[1433]++;
  var invoke = restArguments(function(obj, path, args) {
    _$jscoverage['/underscore-umd.js'].functionData[138]++;
    _$jscoverage['/underscore-umd.js'].lineData[1434]++;
    var contextPath, func;
    _$jscoverage['/underscore-umd.js'].lineData[1435]++;
    if (visit169_1435_1(isFunction$1(path))) {
      _$jscoverage['/underscore-umd.js'].lineData[1436]++;
      func = path;
    } else {
      _$jscoverage['/underscore-umd.js'].lineData[1438]++;
      path = toPath(path);
      _$jscoverage['/underscore-umd.js'].lineData[1439]++;
      contextPath = path.slice(0, -1);
      _$jscoverage['/underscore-umd.js'].lineData[1440]++;
      path = path[path.length - 1];
    }
    _$jscoverage['/underscore-umd.js'].lineData[1442]++;
    return map(obj, function(context) {
      _$jscoverage['/underscore-umd.js'].functionData[139]++;
      _$jscoverage['/underscore-umd.js'].lineData[1443]++;
      var method = func;
      _$jscoverage['/underscore-umd.js'].lineData[1444]++;
      if (visit170_1444_1(!method)) {
        _$jscoverage['/underscore-umd.js'].lineData[1445]++;
        if (visit294_1445_1(contextPath && contextPath.length)) {
          _$jscoverage['/underscore-umd.js'].lineData[1446]++;
          context = deepGet(context, contextPath);
        }
        _$jscoverage['/underscore-umd.js'].lineData[1448]++;
        if (visit295_1448_1(context == null)) {
          return void 0;
        }
        _$jscoverage['/underscore-umd.js'].lineData[1449]++;
        method = context[path];
      }
      _$jscoverage['/underscore-umd.js'].lineData[1451]++;
      return visit171_1451_1(method == null) ? method : method.apply(context, args);
    });
  });
  _$jscoverage['/underscore-umd.js'].lineData[1456]++;
  function pluck(obj, key) {
    _$jscoverage['/underscore-umd.js'].functionData[140]++;
    _$jscoverage['/underscore-umd.js'].lineData[1457]++;
    return map(obj, property(key));
  }
  _$jscoverage['/underscore-umd.js'].lineData[1462]++;
  function where(obj, attrs) {
    _$jscoverage['/underscore-umd.js'].functionData[141]++;
    _$jscoverage['/underscore-umd.js'].lineData[1463]++;
    return filter(obj, matcher(attrs));
  }
  _$jscoverage['/underscore-umd.js'].lineData[1467]++;
  function max(obj, iteratee, context) {
    _$jscoverage['/underscore-umd.js'].functionData[142]++;
    _$jscoverage['/underscore-umd.js'].lineData[1468]++;
    var result = -Infinity, lastComputed = -Infinity, value, computed;
    _$jscoverage['/underscore-umd.js'].lineData[1470]++;
    if (visit172_1470_1(visit296_1470_2(iteratee == null) || visit375_1470_3(visit409_1470_4(visit425_1470_5(typeof iteratee == 'number') && visit437_1470_7(typeof obj[0] != 'object')) && visit426_1470_6(obj != null)))) {
      _$jscoverage['/underscore-umd.js'].lineData[1471]++;
      obj = visit297_1471_1(isArrayLike(obj)) ? obj : values(obj);
      _$jscoverage['/underscore-umd.js'].lineData[1472]++;
      for (var i = 0, length = obj.length; visit298_1472_1(i < length); i++) {
        _$jscoverage['/underscore-umd.js'].lineData[1473]++;
        value = obj[i];
        _$jscoverage['/underscore-umd.js'].lineData[1474]++;
        if (visit376_1474_1(visit410_1474_2(value != null) && visit427_1474_3(value > result))) {
          _$jscoverage['/underscore-umd.js'].lineData[1475]++;
          result = value;
        }
      }
    } else {
      _$jscoverage['/underscore-umd.js'].lineData[1479]++;
      iteratee = cb(iteratee, context);
      _$jscoverage['/underscore-umd.js'].lineData[1480]++;
      each(obj, function(v, index, list) {
        _$jscoverage['/underscore-umd.js'].functionData[143]++;
        _$jscoverage['/underscore-umd.js'].lineData[1481]++;
        computed = iteratee(v, index, list);
        _$jscoverage['/underscore-umd.js'].lineData[1482]++;
        if (visit299_1482_1(visit377_1482_2(computed > lastComputed) || visit411_1482_3(visit428_1482_4(computed === -Infinity) && visit438_1482_5(result === -Infinity)))) {
          _$jscoverage['/underscore-umd.js'].lineData[1483]++;
          result = v;
          _$jscoverage['/underscore-umd.js'].lineData[1484]++;
          lastComputed = computed;
        }
      });
    }
    _$jscoverage['/underscore-umd.js'].lineData[1488]++;
    return result;
  }
  _$jscoverage['/underscore-umd.js'].lineData[1492]++;
  function min(obj, iteratee, context) {
    _$jscoverage['/underscore-umd.js'].functionData[144]++;
    _$jscoverage['/underscore-umd.js'].lineData[1493]++;
    var result = Infinity, lastComputed = Infinity, value, computed;
    _$jscoverage['/underscore-umd.js'].lineData[1495]++;
    if (visit173_1495_1(visit300_1495_2(iteratee == null) || visit378_1495_3(visit412_1495_4(visit429_1495_5(typeof iteratee == 'number') && visit439_1495_7(typeof obj[0] != 'object')) && visit430_1495_6(obj != null)))) {
      _$jscoverage['/underscore-umd.js'].lineData[1496]++;
      obj = visit301_1496_1(isArrayLike(obj)) ? obj : values(obj);
      _$jscoverage['/underscore-umd.js'].lineData[1497]++;
      for (var i = 0, length = obj.length; visit302_1497_1(i < length); i++) {
        _$jscoverage['/underscore-umd.js'].lineData[1498]++;
        value = obj[i];
        _$jscoverage['/underscore-umd.js'].lineData[1499]++;
        if (visit379_1499_1(visit413_1499_2(value != null) && visit431_1499_3(value < result))) {
          _$jscoverage['/underscore-umd.js'].lineData[1500]++;
          result = value;
        }
      }
    } else {
      _$jscoverage['/underscore-umd.js'].lineData[1504]++;
      iteratee = cb(iteratee, context);
      _$jscoverage['/underscore-umd.js'].lineData[1505]++;
      each(obj, function(v, index, list) {
        _$jscoverage['/underscore-umd.js'].functionData[145]++;
        _$jscoverage['/underscore-umd.js'].lineData[1506]++;
        computed = iteratee(v, index, list);
        _$jscoverage['/underscore-umd.js'].lineData[1507]++;
        if (visit303_1507_1(visit380_1507_2(computed < lastComputed) || visit414_1507_3(visit432_1507_4(computed === Infinity) && visit440_1507_5(result === Infinity)))) {
          _$jscoverage['/underscore-umd.js'].lineData[1508]++;
          result = v;
          _$jscoverage['/underscore-umd.js'].lineData[1509]++;
          lastComputed = computed;
        }
      });
    }
    _$jscoverage['/underscore-umd.js'].lineData[1513]++;
    return result;
  }
  _$jscoverage['/underscore-umd.js'].lineData[1517]++;
  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  _$jscoverage['/underscore-umd.js'].lineData[1518]++;
  function toArray(obj) {
    _$jscoverage['/underscore-umd.js'].functionData[146]++;
    _$jscoverage['/underscore-umd.js'].lineData[1519]++;
    if (visit174_1519_1(!obj)) {
      return [];
    }
    _$jscoverage['/underscore-umd.js'].lineData[1520]++;
    if (visit175_1520_1(isArray(obj))) {
      return slice.call(obj);
    }
    _$jscoverage['/underscore-umd.js'].lineData[1521]++;
    if (visit176_1521_1(isString(obj))) {
      _$jscoverage['/underscore-umd.js'].lineData[1523]++;
      return obj.match(reStrSymbol);
    }
    _$jscoverage['/underscore-umd.js'].lineData[1525]++;
    if (visit177_1525_1(isArrayLike(obj))) {
      return map(obj, identity);
    }
    _$jscoverage['/underscore-umd.js'].lineData[1526]++;
    return values(obj);
  }
  _$jscoverage['/underscore-umd.js'].lineData[1533]++;
  function sample(obj, n, guard) {
    _$jscoverage['/underscore-umd.js'].functionData[147]++;
    _$jscoverage['/underscore-umd.js'].lineData[1534]++;
    if (visit178_1534_1(visit304_1534_2(n == null) || guard)) {
      _$jscoverage['/underscore-umd.js'].lineData[1535]++;
      if (visit305_1535_1(!isArrayLike(obj))) {
        obj = values(obj);
      }
      _$jscoverage['/underscore-umd.js'].lineData[1536]++;
      return obj[random(obj.length - 1)];
    }
    _$jscoverage['/underscore-umd.js'].lineData[1538]++;
    var sample = toArray(obj);
    _$jscoverage['/underscore-umd.js'].lineData[1539]++;
    var length = getLength(sample);
    _$jscoverage['/underscore-umd.js'].lineData[1540]++;
    n = Math.max(Math.min(n, length), 0);
    _$jscoverage['/underscore-umd.js'].lineData[1541]++;
    var last = length - 1;
    _$jscoverage['/underscore-umd.js'].lineData[1542]++;
    for (var index = 0; visit179_1542_1(index < n); index++) {
      _$jscoverage['/underscore-umd.js'].lineData[1543]++;
      var rand = random(index, last);
      _$jscoverage['/underscore-umd.js'].lineData[1544]++;
      var temp = sample[index];
      _$jscoverage['/underscore-umd.js'].lineData[1545]++;
      sample[index] = sample[rand];
      _$jscoverage['/underscore-umd.js'].lineData[1546]++;
      sample[rand] = temp;
    }
    _$jscoverage['/underscore-umd.js'].lineData[1548]++;
    return sample.slice(0, n);
  }
  _$jscoverage['/underscore-umd.js'].lineData[1552]++;
  function shuffle(obj) {
    _$jscoverage['/underscore-umd.js'].functionData[148]++;
    _$jscoverage['/underscore-umd.js'].lineData[1553]++;
    return sample(obj, Infinity);
  }
  _$jscoverage['/underscore-umd.js'].lineData[1557]++;
  function sortBy(obj, iteratee, context) {
    _$jscoverage['/underscore-umd.js'].functionData[149]++;
    _$jscoverage['/underscore-umd.js'].lineData[1558]++;
    var index = 0;
    _$jscoverage['/underscore-umd.js'].lineData[1559]++;
    iteratee = cb(iteratee, context);
    _$jscoverage['/underscore-umd.js'].lineData[1560]++;
    return pluck(map(obj, function(value, key, list) {
      _$jscoverage['/underscore-umd.js'].functionData[150]++;
      _$jscoverage['/underscore-umd.js'].lineData[1561]++;
      return {value:value, index:index++, criteria:iteratee(value, key, list)};
    }).sort(function(left, right) {
      _$jscoverage['/underscore-umd.js'].functionData[151]++;
      _$jscoverage['/underscore-umd.js'].lineData[1567]++;
      var a = left.criteria;
      _$jscoverage['/underscore-umd.js'].lineData[1568]++;
      var b = right.criteria;
      _$jscoverage['/underscore-umd.js'].lineData[1569]++;
      if (visit180_1569_1(a !== b)) {
        _$jscoverage['/underscore-umd.js'].lineData[1570]++;
        if (visit306_1570_1(visit381_1570_2(a > b) || visit415_1570_3(a === void 0))) {
          return 1;
        }
        _$jscoverage['/underscore-umd.js'].lineData[1571]++;
        if (visit307_1571_1(visit382_1571_2(a < b) || visit416_1571_3(b === void 0))) {
          return -1;
        }
      }
      _$jscoverage['/underscore-umd.js'].lineData[1573]++;
      return left.index - right.index;
    }), 'value');
  }
  _$jscoverage['/underscore-umd.js'].lineData[1578]++;
  function group(behavior, partition) {
    _$jscoverage['/underscore-umd.js'].functionData[152]++;
    _$jscoverage['/underscore-umd.js'].lineData[1579]++;
    return function(obj, iteratee, context) {
      _$jscoverage['/underscore-umd.js'].functionData[153]++;
      _$jscoverage['/underscore-umd.js'].lineData[1580]++;
      var result = visit181_1580_1(partition) ? [[], []] : {};
      _$jscoverage['/underscore-umd.js'].lineData[1581]++;
      iteratee = cb(iteratee, context);
      _$jscoverage['/underscore-umd.js'].lineData[1582]++;
      each(obj, function(value, index) {
        _$jscoverage['/underscore-umd.js'].functionData[154]++;
        _$jscoverage['/underscore-umd.js'].lineData[1583]++;
        var key = iteratee(value, index, obj);
        _$jscoverage['/underscore-umd.js'].lineData[1584]++;
        behavior(result, value, key);
      });
      _$jscoverage['/underscore-umd.js'].lineData[1586]++;
      return result;
    };
  }
  _$jscoverage['/underscore-umd.js'].lineData[1592]++;
  var groupBy = group(function(result, value, key) {
    _$jscoverage['/underscore-umd.js'].functionData[155]++;
    _$jscoverage['/underscore-umd.js'].lineData[1593]++;
    if (visit182_1593_1(has$1(result, key))) {
      result[key].push(value);
    } else {
      result[key] = [value];
    }
  });
  _$jscoverage['/underscore-umd.js'].lineData[1598]++;
  var indexBy = group(function(result, value, key) {
    _$jscoverage['/underscore-umd.js'].functionData[156]++;
    _$jscoverage['/underscore-umd.js'].lineData[1599]++;
    result[key] = value;
  });
  _$jscoverage['/underscore-umd.js'].lineData[1605]++;
  var countBy = group(function(result, value, key) {
    _$jscoverage['/underscore-umd.js'].functionData[157]++;
    _$jscoverage['/underscore-umd.js'].lineData[1606]++;
    if (visit183_1606_1(has$1(result, key))) {
      result[key]++;
    } else {
      result[key] = 1;
    }
  });
  _$jscoverage['/underscore-umd.js'].lineData[1611]++;
  var partition = group(function(result, value, pass) {
    _$jscoverage['/underscore-umd.js'].functionData[158]++;
    _$jscoverage['/underscore-umd.js'].lineData[1612]++;
    result[visit184_1612_1(pass) ? 0 : 1].push(value);
  }, true);
  _$jscoverage['/underscore-umd.js'].lineData[1616]++;
  function size(obj) {
    _$jscoverage['/underscore-umd.js'].functionData[159]++;
    _$jscoverage['/underscore-umd.js'].lineData[1617]++;
    if (visit185_1617_1(obj == null)) {
      return 0;
    }
    _$jscoverage['/underscore-umd.js'].lineData[1618]++;
    return visit186_1618_1(isArrayLike(obj)) ? obj.length : keys(obj).length;
  }
  _$jscoverage['/underscore-umd.js'].lineData[1623]++;
  function keyInObj(value, key, obj) {
    _$jscoverage['/underscore-umd.js'].functionData[160]++;
    _$jscoverage['/underscore-umd.js'].lineData[1624]++;
    return key in obj;
  }
  _$jscoverage['/underscore-umd.js'].lineData[1628]++;
  var pick = restArguments(function(obj, keys) {
    _$jscoverage['/underscore-umd.js'].functionData[161]++;
    _$jscoverage['/underscore-umd.js'].lineData[1629]++;
    var result = {}, iteratee = keys[0];
    _$jscoverage['/underscore-umd.js'].lineData[1630]++;
    if (visit187_1630_1(obj == null)) {
      return result;
    }
    _$jscoverage['/underscore-umd.js'].lineData[1631]++;
    if (visit188_1631_1(isFunction$1(iteratee))) {
      _$jscoverage['/underscore-umd.js'].lineData[1632]++;
      if (visit308_1632_1(keys.length > 1)) {
        iteratee = optimizeCb(iteratee, keys[1]);
      }
      _$jscoverage['/underscore-umd.js'].lineData[1633]++;
      keys = allKeys(obj);
    } else {
      _$jscoverage['/underscore-umd.js'].lineData[1635]++;
      iteratee = keyInObj;
      _$jscoverage['/underscore-umd.js'].lineData[1636]++;
      keys = flatten$1(keys, false, false);
      _$jscoverage['/underscore-umd.js'].lineData[1637]++;
      obj = Object(obj);
    }
    _$jscoverage['/underscore-umd.js'].lineData[1639]++;
    for (var i = 0, length = keys.length; visit189_1639_1(i < length); i++) {
      _$jscoverage['/underscore-umd.js'].lineData[1640]++;
      var key = keys[i];
      _$jscoverage['/underscore-umd.js'].lineData[1641]++;
      var value = obj[key];
      _$jscoverage['/underscore-umd.js'].lineData[1642]++;
      if (visit309_1642_1(iteratee(value, key, obj))) {
        result[key] = value;
      }
    }
    _$jscoverage['/underscore-umd.js'].lineData[1644]++;
    return result;
  });
  _$jscoverage['/underscore-umd.js'].lineData[1648]++;
  var omit = restArguments(function(obj, keys) {
    _$jscoverage['/underscore-umd.js'].functionData[162]++;
    _$jscoverage['/underscore-umd.js'].lineData[1649]++;
    var iteratee = keys[0], context;
    _$jscoverage['/underscore-umd.js'].lineData[1650]++;
    if (visit190_1650_1(isFunction$1(iteratee))) {
      _$jscoverage['/underscore-umd.js'].lineData[1651]++;
      iteratee = negate(iteratee);
      _$jscoverage['/underscore-umd.js'].lineData[1652]++;
      if (visit310_1652_1(keys.length > 1)) {
        context = keys[1];
      }
    } else {
      _$jscoverage['/underscore-umd.js'].lineData[1654]++;
      keys = map(flatten$1(keys, false, false), String);
      _$jscoverage['/underscore-umd.js'].lineData[1655]++;
      iteratee = function(value, key) {
        _$jscoverage['/underscore-umd.js'].functionData[163]++;
        _$jscoverage['/underscore-umd.js'].lineData[1656]++;
        return !contains(keys, key);
      };
    }
    _$jscoverage['/underscore-umd.js'].lineData[1659]++;
    return pick(obj, iteratee, context);
  });
  _$jscoverage['/underscore-umd.js'].lineData[1665]++;
  function initial(array, n, guard) {
    _$jscoverage['/underscore-umd.js'].functionData[164]++;
    _$jscoverage['/underscore-umd.js'].lineData[1666]++;
    return slice.call(array, 0, Math.max(0, array.length - (visit191_1666_1(visit311_1666_2(n == null) || guard) ? 1 : n)));
  }
  _$jscoverage['/underscore-umd.js'].lineData[1671]++;
  function first(array, n, guard) {
    _$jscoverage['/underscore-umd.js'].functionData[165]++;
    _$jscoverage['/underscore-umd.js'].lineData[1672]++;
    if (visit192_1672_1(visit312_1672_2(array == null) || visit383_1672_4(array.length < 1))) {
      return visit313_1672_3(visit384_1672_5(n == null) || guard) ? void 0 : [];
    }
    _$jscoverage['/underscore-umd.js'].lineData[1673]++;
    if (visit193_1673_1(visit314_1673_2(n == null) || guard)) {
      return array[0];
    }
    _$jscoverage['/underscore-umd.js'].lineData[1674]++;
    return initial(array, array.length - n);
  }
  _$jscoverage['/underscore-umd.js'].lineData[1680]++;
  function rest(array, n, guard) {
    _$jscoverage['/underscore-umd.js'].functionData[166]++;
    _$jscoverage['/underscore-umd.js'].lineData[1681]++;
    return slice.call(array, visit194_1681_1(visit315_1681_2(n == null) || guard) ? 1 : n);
  }
  _$jscoverage['/underscore-umd.js'].lineData[1686]++;
  function last(array, n, guard) {
    _$jscoverage['/underscore-umd.js'].functionData[167]++;
    _$jscoverage['/underscore-umd.js'].lineData[1687]++;
    if (visit195_1687_1(visit316_1687_2(array == null) || visit385_1687_4(array.length < 1))) {
      return visit317_1687_3(visit386_1687_5(n == null) || guard) ? void 0 : [];
    }
    _$jscoverage['/underscore-umd.js'].lineData[1688]++;
    if (visit196_1688_1(visit318_1688_2(n == null) || guard)) {
      return array[array.length - 1];
    }
    _$jscoverage['/underscore-umd.js'].lineData[1689]++;
    return rest(array, Math.max(0, array.length - n));
  }
  _$jscoverage['/underscore-umd.js'].lineData[1693]++;
  function compact(array) {
    _$jscoverage['/underscore-umd.js'].functionData[168]++;
    _$jscoverage['/underscore-umd.js'].lineData[1694]++;
    return filter(array, Boolean);
  }
  _$jscoverage['/underscore-umd.js'].lineData[1699]++;
  function flatten(array, depth) {
    _$jscoverage['/underscore-umd.js'].functionData[169]++;
    _$jscoverage['/underscore-umd.js'].lineData[1700]++;
    return flatten$1(array, depth, false);
  }
  _$jscoverage['/underscore-umd.js'].lineData[1705]++;
  var difference = restArguments(function(array, rest) {
    _$jscoverage['/underscore-umd.js'].functionData[170]++;
    _$jscoverage['/underscore-umd.js'].lineData[1706]++;
    rest = flatten$1(rest, true, true);
    _$jscoverage['/underscore-umd.js'].lineData[1707]++;
    return filter(array, function(value) {
      _$jscoverage['/underscore-umd.js'].functionData[171]++;
      _$jscoverage['/underscore-umd.js'].lineData[1708]++;
      return !contains(rest, value);
    });
  });
  _$jscoverage['/underscore-umd.js'].lineData[1713]++;
  var without = restArguments(function(array, otherArrays) {
    _$jscoverage['/underscore-umd.js'].functionData[172]++;
    _$jscoverage['/underscore-umd.js'].lineData[1714]++;
    return difference(array, otherArrays);
  });
  _$jscoverage['/underscore-umd.js'].lineData[1722]++;
  function uniq(array, isSorted, iteratee, context) {
    _$jscoverage['/underscore-umd.js'].functionData[173]++;
    _$jscoverage['/underscore-umd.js'].lineData[1723]++;
    if (visit197_1723_1(!isBoolean(isSorted))) {
      _$jscoverage['/underscore-umd.js'].lineData[1724]++;
      context = iteratee;
      _$jscoverage['/underscore-umd.js'].lineData[1725]++;
      iteratee = isSorted;
      _$jscoverage['/underscore-umd.js'].lineData[1726]++;
      isSorted = false;
    }
    _$jscoverage['/underscore-umd.js'].lineData[1728]++;
    if (visit198_1728_1(iteratee != null)) {
      iteratee = cb(iteratee, context);
    }
    _$jscoverage['/underscore-umd.js'].lineData[1729]++;
    var result = [];
    _$jscoverage['/underscore-umd.js'].lineData[1730]++;
    var seen = [];
    _$jscoverage['/underscore-umd.js'].lineData[1731]++;
    for (var i = 0, length = getLength(array); visit199_1731_1(i < length); i++) {
      _$jscoverage['/underscore-umd.js'].lineData[1732]++;
      var value = array[i], computed = visit319_1733_1(iteratee) ? iteratee(value, i, array) : value;
      _$jscoverage['/underscore-umd.js'].lineData[1734]++;
      if (visit320_1734_1(isSorted && !iteratee)) {
        _$jscoverage['/underscore-umd.js'].lineData[1735]++;
        if (visit387_1735_1(!i || visit417_1735_2(seen !== computed))) {
          result.push(value);
        }
        _$jscoverage['/underscore-umd.js'].lineData[1736]++;
        seen = computed;
      } else {
        _$jscoverage['/underscore-umd.js'].lineData[1737]++;
        if (visit388_1737_1(iteratee)) {
          _$jscoverage['/underscore-umd.js'].lineData[1738]++;
          if (visit418_1738_1(!contains(seen, computed))) {
            _$jscoverage['/underscore-umd.js'].lineData[1739]++;
            seen.push(computed);
            _$jscoverage['/underscore-umd.js'].lineData[1740]++;
            result.push(value);
          }
        } else {
          _$jscoverage['/underscore-umd.js'].lineData[1742]++;
          if (visit419_1742_1(!contains(result, value))) {
            _$jscoverage['/underscore-umd.js'].lineData[1743]++;
            result.push(value);
          }
        }
      }
    }
    _$jscoverage['/underscore-umd.js'].lineData[1746]++;
    return result;
  }
  _$jscoverage['/underscore-umd.js'].lineData[1751]++;
  var union = restArguments(function(arrays) {
    _$jscoverage['/underscore-umd.js'].functionData[174]++;
    _$jscoverage['/underscore-umd.js'].lineData[1752]++;
    return uniq(flatten$1(arrays, true, true));
  });
  _$jscoverage['/underscore-umd.js'].lineData[1757]++;
  function intersection(array) {
    _$jscoverage['/underscore-umd.js'].functionData[175]++;
    _$jscoverage['/underscore-umd.js'].lineData[1758]++;
    var result = [];
    _$jscoverage['/underscore-umd.js'].lineData[1759]++;
    var argsLength = arguments.length;
    _$jscoverage['/underscore-umd.js'].lineData[1760]++;
    for (var i = 0, length = getLength(array); visit200_1760_1(i < length); i++) {
      _$jscoverage['/underscore-umd.js'].lineData[1761]++;
      var item = array[i];
      _$jscoverage['/underscore-umd.js'].lineData[1762]++;
      if (visit321_1762_1(contains(result, item))) {
        continue;
      }
      _$jscoverage['/underscore-umd.js'].lineData[1763]++;
      var j;
      _$jscoverage['/underscore-umd.js'].lineData[1764]++;
      for (j = 1; visit322_1764_1(j < argsLength); j++) {
        _$jscoverage['/underscore-umd.js'].lineData[1765]++;
        if (visit389_1765_1(!contains(arguments[j], item))) {
          break;
        }
      }
      _$jscoverage['/underscore-umd.js'].lineData[1767]++;
      if (visit323_1767_1(j === argsLength)) {
        result.push(item);
      }
    }
    _$jscoverage['/underscore-umd.js'].lineData[1769]++;
    return result;
  }
  _$jscoverage['/underscore-umd.js'].lineData[1774]++;
  function unzip(array) {
    _$jscoverage['/underscore-umd.js'].functionData[176]++;
    _$jscoverage['/underscore-umd.js'].lineData[1775]++;
    var length = visit201_1775_1(visit324_1775_2(array && max(array, getLength).length) || 0);
    _$jscoverage['/underscore-umd.js'].lineData[1776]++;
    var result = Array(length);
    _$jscoverage['/underscore-umd.js'].lineData[1778]++;
    for (var index = 0; visit202_1778_1(index < length); index++) {
      _$jscoverage['/underscore-umd.js'].lineData[1779]++;
      result[index] = pluck(array, index);
    }
    _$jscoverage['/underscore-umd.js'].lineData[1781]++;
    return result;
  }
  _$jscoverage['/underscore-umd.js'].lineData[1786]++;
  var zip = restArguments(unzip);
  _$jscoverage['/underscore-umd.js'].lineData[1791]++;
  function object(list, values) {
    _$jscoverage['/underscore-umd.js'].functionData[177]++;
    _$jscoverage['/underscore-umd.js'].lineData[1792]++;
    var result = {};
    _$jscoverage['/underscore-umd.js'].lineData[1793]++;
    for (var i = 0, length = getLength(list); visit203_1793_1(i < length); i++) {
      _$jscoverage['/underscore-umd.js'].lineData[1794]++;
      if (visit325_1794_1(values)) {
        _$jscoverage['/underscore-umd.js'].lineData[1795]++;
        result[list[i]] = values[i];
      } else {
        _$jscoverage['/underscore-umd.js'].lineData[1797]++;
        result[list[i][0]] = list[i][1];
      }
    }
    _$jscoverage['/underscore-umd.js'].lineData[1800]++;
    return result;
  }
  _$jscoverage['/underscore-umd.js'].lineData[1806]++;
  function range(start, stop, step) {
    _$jscoverage['/underscore-umd.js'].functionData[178]++;
    _$jscoverage['/underscore-umd.js'].lineData[1807]++;
    if (visit204_1807_1(stop == null)) {
      _$jscoverage['/underscore-umd.js'].lineData[1808]++;
      stop = visit326_1808_1(start || 0);
      _$jscoverage['/underscore-umd.js'].lineData[1809]++;
      start = 0;
    }
    _$jscoverage['/underscore-umd.js'].lineData[1811]++;
    if (visit205_1811_1(!step)) {
      _$jscoverage['/underscore-umd.js'].lineData[1812]++;
      step = visit327_1812_1(stop < start) ? -1 : 1;
    }
    _$jscoverage['/underscore-umd.js'].lineData[1815]++;
    var length = Math.max(Math.ceil((stop - start) / step), 0);
    _$jscoverage['/underscore-umd.js'].lineData[1816]++;
    var range = Array(length);
    _$jscoverage['/underscore-umd.js'].lineData[1818]++;
    for (var idx = 0; visit206_1818_1(idx < length); idx++, start += step) {
      _$jscoverage['/underscore-umd.js'].lineData[1819]++;
      range[idx] = start;
    }
    _$jscoverage['/underscore-umd.js'].lineData[1822]++;
    return range;
  }
  _$jscoverage['/underscore-umd.js'].lineData[1827]++;
  function chunk(array, count) {
    _$jscoverage['/underscore-umd.js'].functionData[179]++;
    _$jscoverage['/underscore-umd.js'].lineData[1828]++;
    if (visit207_1828_1(visit328_1828_2(count == null) || visit390_1828_3(count < 1))) {
      return [];
    }
    _$jscoverage['/underscore-umd.js'].lineData[1829]++;
    var result = [];
    _$jscoverage['/underscore-umd.js'].lineData[1830]++;
    var i = 0, length = array.length;
    _$jscoverage['/underscore-umd.js'].lineData[1831]++;
    while (visit208_1831_1(i < length)) {
      _$jscoverage['/underscore-umd.js'].lineData[1832]++;
      result.push(slice.call(array, i, i += count));
    }
    _$jscoverage['/underscore-umd.js'].lineData[1834]++;
    return result;
  }
  _$jscoverage['/underscore-umd.js'].lineData[1838]++;
  function chainResult(instance, obj) {
    _$jscoverage['/underscore-umd.js'].functionData[180]++;
    _$jscoverage['/underscore-umd.js'].lineData[1839]++;
    return visit209_1839_1(instance._chain) ? _$1(obj).chain() : obj;
  }
  _$jscoverage['/underscore-umd.js'].lineData[1843]++;
  function mixin(obj) {
    _$jscoverage['/underscore-umd.js'].functionData[181]++;
    _$jscoverage['/underscore-umd.js'].lineData[1844]++;
    each(functions(obj), function(name) {
      _$jscoverage['/underscore-umd.js'].functionData[182]++;
      _$jscoverage['/underscore-umd.js'].lineData[1845]++;
      var func = _$1[name] = obj[name];
      _$jscoverage['/underscore-umd.js'].lineData[1846]++;
      _$1.prototype[name] = function() {
        _$jscoverage['/underscore-umd.js'].functionData[183]++;
        _$jscoverage['/underscore-umd.js'].lineData[1847]++;
        var args = [this._wrapped];
        _$jscoverage['/underscore-umd.js'].lineData[1848]++;
        push.apply(args, arguments);
        _$jscoverage['/underscore-umd.js'].lineData[1849]++;
        return chainResult(this, func.apply(_$1, args));
      };
    });
    _$jscoverage['/underscore-umd.js'].lineData[1852]++;
    return _$1;
  }
  _$jscoverage['/underscore-umd.js'].lineData[1856]++;
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    _$jscoverage['/underscore-umd.js'].functionData[184]++;
    _$jscoverage['/underscore-umd.js'].lineData[1857]++;
    var method = ArrayProto[name];
    _$jscoverage['/underscore-umd.js'].lineData[1858]++;
    _$1.prototype[name] = function() {
      _$jscoverage['/underscore-umd.js'].functionData[185]++;
      _$jscoverage['/underscore-umd.js'].lineData[1859]++;
      var obj = this._wrapped;
      _$jscoverage['/underscore-umd.js'].lineData[1860]++;
      if (visit210_1860_1(obj != null)) {
        _$jscoverage['/underscore-umd.js'].lineData[1861]++;
        method.apply(obj, arguments);
        _$jscoverage['/underscore-umd.js'].lineData[1862]++;
        if (visit329_1862_1(visit391_1862_2(visit420_1862_3(name === 'shift') || visit433_1862_5(name === 'splice')) && visit421_1862_4(obj.length === 0))) {
          _$jscoverage['/underscore-umd.js'].lineData[1863]++;
          delete obj[0];
        }
      }
      _$jscoverage['/underscore-umd.js'].lineData[1866]++;
      return chainResult(this, obj);
    };
  });
  _$jscoverage['/underscore-umd.js'].lineData[1871]++;
  each(['concat', 'join', 'slice'], function(name) {
    _$jscoverage['/underscore-umd.js'].functionData[186]++;
    _$jscoverage['/underscore-umd.js'].lineData[1872]++;
    var method = ArrayProto[name];
    _$jscoverage['/underscore-umd.js'].lineData[1873]++;
    _$1.prototype[name] = function() {
      _$jscoverage['/underscore-umd.js'].functionData[187]++;
      _$jscoverage['/underscore-umd.js'].lineData[1874]++;
      var obj = this._wrapped;
      _$jscoverage['/underscore-umd.js'].lineData[1875]++;
      if (visit211_1875_1(obj != null)) {
        obj = method.apply(obj, arguments);
      }
      _$jscoverage['/underscore-umd.js'].lineData[1876]++;
      return chainResult(this, obj);
    };
  });
  _$jscoverage['/underscore-umd.js'].lineData[1882]++;
  var allExports = {__proto__:null, VERSION:VERSION, restArguments:restArguments, isObject:isObject, isNull:isNull, isUndefined:isUndefined, isBoolean:isBoolean, isElement:isElement, isString:isString, isNumber:isNumber, isDate:isDate, isRegExp:isRegExp, isError:isError, isSymbol:isSymbol, isArrayBuffer:isArrayBuffer, isDataView:isDataView$1, isArray:isArray, isFunction:isFunction$1, isArguments:isArguments$1, isFinite:isFinite$1, isNaN:isNaN$1, isTypedArray:isTypedArray$1, isEmpty:isEmpty, isMatch:isMatch, 
  isEqual:isEqual, isMap:isMap, isWeakMap:isWeakMap, isSet:isSet, isWeakSet:isWeakSet, keys:keys, allKeys:allKeys, values:values, pairs:pairs, invert:invert, functions:functions, methods:functions, extend:extend, extendOwn:extendOwn, assign:extendOwn, defaults:defaults, create:create, clone:clone, tap:tap, get:get, has:has, mapObject:mapObject, identity:identity, constant:constant, noop:noop, toPath:toPath$1, property:property, propertyOf:propertyOf, matcher:matcher, matches:matcher, times:times, 
  random:random, now:now, escape:_escape, unescape:_unescape, templateSettings:templateSettings, template:template, result:result, uniqueId:uniqueId, chain:chain, iteratee:iteratee, partial:partial, bind:bind, bindAll:bindAll, memoize:memoize, delay:delay, defer:defer, throttle:throttle, debounce:debounce, wrap:wrap, negate:negate, compose:compose, after:after, before:before, once:once, findKey:findKey, findIndex:findIndex, findLastIndex:findLastIndex, sortedIndex:sortedIndex, indexOf:indexOf, lastIndexOf:lastIndexOf, 
  find:find, detect:find, findWhere:findWhere, each:each, forEach:each, map:map, collect:map, reduce:reduce, foldl:reduce, inject:reduce, reduceRight:reduceRight, foldr:reduceRight, filter:filter, select:filter, reject:reject, every:every, all:every, some:some, any:some, contains:contains, includes:contains, include:contains, invoke:invoke, pluck:pluck, where:where, max:max, min:min, shuffle:shuffle, sample:sample, sortBy:sortBy, groupBy:groupBy, indexBy:indexBy, countBy:countBy, partition:partition, 
  toArray:toArray, size:size, pick:pick, omit:omit, first:first, head:first, take:first, initial:initial, last:last, rest:rest, tail:rest, drop:rest, compact:compact, flatten:flatten, without:without, uniq:uniq, unique:uniq, union:union, intersection:intersection, difference:difference, unzip:unzip, transpose:unzip, zip:zip, object:object, range:range, chunk:chunk, mixin:mixin, 'default':_$1};
  _$jscoverage['/underscore-umd.js'].lineData[2035]++;
  var _ = mixin(allExports);
  _$jscoverage['/underscore-umd.js'].lineData[2037]++;
  _._ = _;
  _$jscoverage['/underscore-umd.js'].lineData[2039]++;
  return _;
});
