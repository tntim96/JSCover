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
  _$jscoverage['/underscore.js'].lineData[51] = 0;
  _$jscoverage['/underscore.js'].lineData[52] = 0;
  _$jscoverage['/underscore.js'].lineData[53] = 0;
  _$jscoverage['/underscore.js'].lineData[55] = 0;
  _$jscoverage['/underscore.js'].lineData[57] = 0;
  _$jscoverage['/underscore.js'].lineData[61] = 0;
  _$jscoverage['/underscore.js'].lineData[66] = 0;
  _$jscoverage['/underscore.js'].lineData[67] = 0;
  _$jscoverage['/underscore.js'].lineData[68] = 0;
  _$jscoverage['/underscore.js'].lineData[69] = 0;
  _$jscoverage['/underscore.js'].lineData[74] = 0;
  _$jscoverage['/underscore.js'].lineData[77] = 0;
  _$jscoverage['/underscore.js'].lineData[81] = 0;
  _$jscoverage['/underscore.js'].lineData[82] = 0;
  _$jscoverage['/underscore.js'].lineData[89] = 0;
  _$jscoverage['/underscore.js'].lineData[90] = 0;
  _$jscoverage['/underscore.js'].lineData[91] = 0;
  _$jscoverage['/underscore.js'].lineData[92] = 0;
  _$jscoverage['/underscore.js'].lineData[93] = 0;
  _$jscoverage['/underscore.js'].lineData[96] = 0;
  _$jscoverage['/underscore.js'].lineData[97] = 0;
  _$jscoverage['/underscore.js'].lineData[102] = 0;
  _$jscoverage['/underscore.js'].lineData[103] = 0;
  _$jscoverage['/underscore.js'].lineData[104] = 0;
  _$jscoverage['/underscore.js'].lineData[105] = 0;
  _$jscoverage['/underscore.js'].lineData[106] = 0;
  _$jscoverage['/underscore.js'].lineData[107] = 0;
  _$jscoverage['/underscore.js'].lineData[108] = 0;
  _$jscoverage['/underscore.js'].lineData[110] = 0;
  _$jscoverage['/underscore.js'].lineData[111] = 0;
  _$jscoverage['/underscore.js'].lineData[112] = 0;
  _$jscoverage['/underscore.js'].lineData[113] = 0;
  _$jscoverage['/underscore.js'].lineData[115] = 0;
  _$jscoverage['/underscore.js'].lineData[116] = 0;
  _$jscoverage['/underscore.js'].lineData[117] = 0;
  _$jscoverage['/underscore.js'].lineData[119] = 0;
  _$jscoverage['/underscore.js'].lineData[120] = 0;
  _$jscoverage['/underscore.js'].lineData[125] = 0;
  _$jscoverage['/underscore.js'].lineData[126] = 0;
  _$jscoverage['/underscore.js'].lineData[127] = 0;
  _$jscoverage['/underscore.js'].lineData[128] = 0;
  _$jscoverage['/underscore.js'].lineData[129] = 0;
  _$jscoverage['/underscore.js'].lineData[130] = 0;
  _$jscoverage['/underscore.js'].lineData[131] = 0;
  _$jscoverage['/underscore.js'].lineData[134] = 0;
  _$jscoverage['/underscore.js'].lineData[135] = 0;
  _$jscoverage['/underscore.js'].lineData[136] = 0;
  _$jscoverage['/underscore.js'].lineData[144] = 0;
  _$jscoverage['/underscore.js'].lineData[145] = 0;
  _$jscoverage['/underscore.js'].lineData[146] = 0;
  _$jscoverage['/underscore.js'].lineData[147] = 0;
  _$jscoverage['/underscore.js'].lineData[148] = 0;
  _$jscoverage['/underscore.js'].lineData[157] = 0;
  _$jscoverage['/underscore.js'].lineData[158] = 0;
  _$jscoverage['/underscore.js'].lineData[159] = 0;
  _$jscoverage['/underscore.js'].lineData[160] = 0;
  _$jscoverage['/underscore.js'].lineData[161] = 0;
  _$jscoverage['/underscore.js'].lineData[162] = 0;
  _$jscoverage['/underscore.js'].lineData[165] = 0;
  _$jscoverage['/underscore.js'].lineData[166] = 0;
  _$jscoverage['/underscore.js'].lineData[167] = 0;
  _$jscoverage['/underscore.js'].lineData[170] = 0;
  _$jscoverage['/underscore.js'].lineData[174] = 0;
  _$jscoverage['/underscore.js'].lineData[175] = 0;
  _$jscoverage['/underscore.js'].lineData[176] = 0;
  _$jscoverage['/underscore.js'].lineData[179] = 0;
  _$jscoverage['/underscore.js'].lineData[180] = 0;
  _$jscoverage['/underscore.js'].lineData[181] = 0;
  _$jscoverage['/underscore.js'].lineData[183] = 0;
  _$jscoverage['/underscore.js'].lineData[187] = 0;
  _$jscoverage['/underscore.js'].lineData[190] = 0;
  _$jscoverage['/underscore.js'].lineData[191] = 0;
  _$jscoverage['/underscore.js'].lineData[194] = 0;
  _$jscoverage['/underscore.js'].lineData[195] = 0;
  _$jscoverage['/underscore.js'].lineData[196] = 0;
  _$jscoverage['/underscore.js'].lineData[198] = 0;
  _$jscoverage['/underscore.js'].lineData[199] = 0;
  _$jscoverage['/underscore.js'].lineData[200] = 0;
  _$jscoverage['/underscore.js'].lineData[202] = 0;
  _$jscoverage['/underscore.js'].lineData[205] = 0;
  _$jscoverage['/underscore.js'].lineData[206] = 0;
  _$jscoverage['/underscore.js'].lineData[207] = 0;
  _$jscoverage['/underscore.js'].lineData[213] = 0;
  _$jscoverage['/underscore.js'].lineData[216] = 0;
  _$jscoverage['/underscore.js'].lineData[219] = 0;
  _$jscoverage['/underscore.js'].lineData[220] = 0;
  _$jscoverage['/underscore.js'].lineData[221] = 0;
  _$jscoverage['/underscore.js'].lineData[222] = 0;
  _$jscoverage['/underscore.js'].lineData[224] = 0;
  _$jscoverage['/underscore.js'].lineData[226] = 0;
  _$jscoverage['/underscore.js'].lineData[231] = 0;
  _$jscoverage['/underscore.js'].lineData[232] = 0;
  _$jscoverage['/underscore.js'].lineData[233] = 0;
  _$jscoverage['/underscore.js'].lineData[234] = 0;
  _$jscoverage['/underscore.js'].lineData[235] = 0;
  _$jscoverage['/underscore.js'].lineData[237] = 0;
  _$jscoverage['/underscore.js'].lineData[241] = 0;
  _$jscoverage['/underscore.js'].lineData[242] = 0;
  _$jscoverage['/underscore.js'].lineData[247] = 0;
  _$jscoverage['/underscore.js'].lineData[248] = 0;
  _$jscoverage['/underscore.js'].lineData[249] = 0;
  _$jscoverage['/underscore.js'].lineData[251] = 0;
  _$jscoverage['/underscore.js'].lineData[252] = 0;
  _$jscoverage['/underscore.js'].lineData[253] = 0;
  _$jscoverage['/underscore.js'].lineData[255] = 0;
  _$jscoverage['/underscore.js'].lineData[260] = 0;
  _$jscoverage['/underscore.js'].lineData[261] = 0;
  _$jscoverage['/underscore.js'].lineData[262] = 0;
  _$jscoverage['/underscore.js'].lineData[264] = 0;
  _$jscoverage['/underscore.js'].lineData[265] = 0;
  _$jscoverage['/underscore.js'].lineData[266] = 0;
  _$jscoverage['/underscore.js'].lineData[268] = 0;
  _$jscoverage['/underscore.js'].lineData[273] = 0;
  _$jscoverage['/underscore.js'].lineData[274] = 0;
  _$jscoverage['/underscore.js'].lineData[275] = 0;
  _$jscoverage['/underscore.js'].lineData[276] = 0;
  _$jscoverage['/underscore.js'].lineData[280] = 0;
  _$jscoverage['/underscore.js'].lineData[281] = 0;
  _$jscoverage['/underscore.js'].lineData[282] = 0;
  _$jscoverage['/underscore.js'].lineData[283] = 0;
  _$jscoverage['/underscore.js'].lineData[284] = 0;
  _$jscoverage['/underscore.js'].lineData[289] = 0;
  _$jscoverage['/underscore.js'].lineData[290] = 0;
  _$jscoverage['/underscore.js'].lineData[295] = 0;
  _$jscoverage['/underscore.js'].lineData[296] = 0;
  _$jscoverage['/underscore.js'].lineData[301] = 0;
  _$jscoverage['/underscore.js'].lineData[302] = 0;
  _$jscoverage['/underscore.js'].lineData[306] = 0;
  _$jscoverage['/underscore.js'].lineData[307] = 0;
  _$jscoverage['/underscore.js'].lineData[309] = 0;
  _$jscoverage['/underscore.js'].lineData[310] = 0;
  _$jscoverage['/underscore.js'].lineData[311] = 0;
  _$jscoverage['/underscore.js'].lineData[312] = 0;
  _$jscoverage['/underscore.js'].lineData[313] = 0;
  _$jscoverage['/underscore.js'].lineData[314] = 0;
  _$jscoverage['/underscore.js'].lineData[318] = 0;
  _$jscoverage['/underscore.js'].lineData[319] = 0;
  _$jscoverage['/underscore.js'].lineData[320] = 0;
  _$jscoverage['/underscore.js'].lineData[321] = 0;
  _$jscoverage['/underscore.js'].lineData[322] = 0;
  _$jscoverage['/underscore.js'].lineData[323] = 0;
  _$jscoverage['/underscore.js'].lineData[327] = 0;
  _$jscoverage['/underscore.js'].lineData[331] = 0;
  _$jscoverage['/underscore.js'].lineData[332] = 0;
  _$jscoverage['/underscore.js'].lineData[334] = 0;
  _$jscoverage['/underscore.js'].lineData[335] = 0;
  _$jscoverage['/underscore.js'].lineData[336] = 0;
  _$jscoverage['/underscore.js'].lineData[337] = 0;
  _$jscoverage['/underscore.js'].lineData[338] = 0;
  _$jscoverage['/underscore.js'].lineData[339] = 0;
  _$jscoverage['/underscore.js'].lineData[343] = 0;
  _$jscoverage['/underscore.js'].lineData[344] = 0;
  _$jscoverage['/underscore.js'].lineData[345] = 0;
  _$jscoverage['/underscore.js'].lineData[346] = 0;
  _$jscoverage['/underscore.js'].lineData[347] = 0;
  _$jscoverage['/underscore.js'].lineData[348] = 0;
  _$jscoverage['/underscore.js'].lineData[352] = 0;
  _$jscoverage['/underscore.js'].lineData[356] = 0;
  _$jscoverage['/underscore.js'].lineData[357] = 0;
  _$jscoverage['/underscore.js'].lineData[364] = 0;
  _$jscoverage['/underscore.js'].lineData[365] = 0;
  _$jscoverage['/underscore.js'].lineData[366] = 0;
  _$jscoverage['/underscore.js'].lineData[367] = 0;
  _$jscoverage['/underscore.js'].lineData[369] = 0;
  _$jscoverage['/underscore.js'].lineData[370] = 0;
  _$jscoverage['/underscore.js'].lineData[371] = 0;
  _$jscoverage['/underscore.js'].lineData[372] = 0;
  _$jscoverage['/underscore.js'].lineData[373] = 0;
  _$jscoverage['/underscore.js'].lineData[374] = 0;
  _$jscoverage['/underscore.js'].lineData[375] = 0;
  _$jscoverage['/underscore.js'].lineData[376] = 0;
  _$jscoverage['/underscore.js'].lineData[377] = 0;
  _$jscoverage['/underscore.js'].lineData[379] = 0;
  _$jscoverage['/underscore.js'].lineData[383] = 0;
  _$jscoverage['/underscore.js'].lineData[384] = 0;
  _$jscoverage['/underscore.js'].lineData[385] = 0;
  _$jscoverage['/underscore.js'].lineData[386] = 0;
  _$jscoverage['/underscore.js'].lineData[387] = 0;
  _$jscoverage['/underscore.js'].lineData[393] = 0;
  _$jscoverage['/underscore.js'].lineData[394] = 0;
  _$jscoverage['/underscore.js'].lineData[395] = 0;
  _$jscoverage['/underscore.js'].lineData[396] = 0;
  _$jscoverage['/underscore.js'].lineData[397] = 0;
  _$jscoverage['/underscore.js'].lineData[399] = 0;
  _$jscoverage['/underscore.js'].lineData[404] = 0;
  _$jscoverage['/underscore.js'].lineData[405] = 0;
  _$jscoverage['/underscore.js'].lineData[406] = 0;
  _$jscoverage['/underscore.js'].lineData[407] = 0;
  _$jscoverage['/underscore.js'].lineData[408] = 0;
  _$jscoverage['/underscore.js'].lineData[409] = 0;
  _$jscoverage['/underscore.js'].lineData[410] = 0;
  _$jscoverage['/underscore.js'].lineData[412] = 0;
  _$jscoverage['/underscore.js'].lineData[418] = 0;
  _$jscoverage['/underscore.js'].lineData[419] = 0;
  _$jscoverage['/underscore.js'].lineData[424] = 0;
  _$jscoverage['/underscore.js'].lineData[425] = 0;
  _$jscoverage['/underscore.js'].lineData[431] = 0;
  _$jscoverage['/underscore.js'].lineData[432] = 0;
  _$jscoverage['/underscore.js'].lineData[436] = 0;
  _$jscoverage['/underscore.js'].lineData[437] = 0;
  _$jscoverage['/underscore.js'].lineData[438] = 0;
  _$jscoverage['/underscore.js'].lineData[439] = 0;
  _$jscoverage['/underscore.js'].lineData[440] = 0;
  _$jscoverage['/underscore.js'].lineData[444] = 0;
  _$jscoverage['/underscore.js'].lineData[445] = 0;
  _$jscoverage['/underscore.js'].lineData[446] = 0;
  _$jscoverage['/underscore.js'].lineData[451] = 0;
  _$jscoverage['/underscore.js'].lineData[452] = 0;
  _$jscoverage['/underscore.js'].lineData[461] = 0;
  _$jscoverage['/underscore.js'].lineData[462] = 0;
  _$jscoverage['/underscore.js'].lineData[463] = 0;
  _$jscoverage['/underscore.js'].lineData[464] = 0;
  _$jscoverage['/underscore.js'].lineData[470] = 0;
  _$jscoverage['/underscore.js'].lineData[471] = 0;
  _$jscoverage['/underscore.js'].lineData[476] = 0;
  _$jscoverage['/underscore.js'].lineData[477] = 0;
  _$jscoverage['/underscore.js'].lineData[478] = 0;
  _$jscoverage['/underscore.js'].lineData[479] = 0;
  _$jscoverage['/underscore.js'].lineData[485] = 0;
  _$jscoverage['/underscore.js'].lineData[486] = 0;
  _$jscoverage['/underscore.js'].lineData[490] = 0;
  _$jscoverage['/underscore.js'].lineData[491] = 0;
  _$jscoverage['/underscore.js'].lineData[495] = 0;
  _$jscoverage['/underscore.js'].lineData[496] = 0;
  _$jscoverage['/underscore.js'].lineData[497] = 0;
  _$jscoverage['/underscore.js'].lineData[498] = 0;
  _$jscoverage['/underscore.js'].lineData[499] = 0;
  _$jscoverage['/underscore.js'].lineData[500] = 0;
  _$jscoverage['/underscore.js'].lineData[502] = 0;
  _$jscoverage['/underscore.js'].lineData[503] = 0;
  _$jscoverage['/underscore.js'].lineData[504] = 0;
  _$jscoverage['/underscore.js'].lineData[506] = 0;
  _$jscoverage['/underscore.js'].lineData[507] = 0;
  _$jscoverage['/underscore.js'].lineData[509] = 0;
  _$jscoverage['/underscore.js'].lineData[510] = 0;
  _$jscoverage['/underscore.js'].lineData[513] = 0;
  _$jscoverage['/underscore.js'].lineData[517] = 0;
  _$jscoverage['/underscore.js'].lineData[518] = 0;
  _$jscoverage['/underscore.js'].lineData[522] = 0;
  _$jscoverage['/underscore.js'].lineData[523] = 0;
  _$jscoverage['/underscore.js'].lineData[529] = 0;
  _$jscoverage['/underscore.js'].lineData[530] = 0;
  _$jscoverage['/underscore.js'].lineData[531] = 0;
  _$jscoverage['/underscore.js'].lineData[532] = 0;
  _$jscoverage['/underscore.js'].lineData[533] = 0;
  _$jscoverage['/underscore.js'].lineData[535] = 0;
  _$jscoverage['/underscore.js'].lineData[536] = 0;
  _$jscoverage['/underscore.js'].lineData[537] = 0;
  _$jscoverage['/underscore.js'].lineData[538] = 0;
  _$jscoverage['/underscore.js'].lineData[539] = 0;
  _$jscoverage['/underscore.js'].lineData[541] = 0;
  _$jscoverage['/underscore.js'].lineData[542] = 0;
  _$jscoverage['/underscore.js'].lineData[543] = 0;
  _$jscoverage['/underscore.js'].lineData[544] = 0;
  _$jscoverage['/underscore.js'].lineData[545] = 0;
  _$jscoverage['/underscore.js'].lineData[546] = 0;
  _$jscoverage['/underscore.js'].lineData[547] = 0;
  _$jscoverage['/underscore.js'].lineData[549] = 0;
  _$jscoverage['/underscore.js'].lineData[550] = 0;
  _$jscoverage['/underscore.js'].lineData[553] = 0;
  _$jscoverage['/underscore.js'].lineData[558] = 0;
  _$jscoverage['/underscore.js'].lineData[559] = 0;
  _$jscoverage['/underscore.js'].lineData[564] = 0;
  _$jscoverage['/underscore.js'].lineData[565] = 0;
  _$jscoverage['/underscore.js'].lineData[566] = 0;
  _$jscoverage['/underscore.js'].lineData[567] = 0;
  _$jscoverage['/underscore.js'].lineData[568] = 0;
  _$jscoverage['/underscore.js'].lineData[569] = 0;
  _$jscoverage['/underscore.js'].lineData[570] = 0;
  _$jscoverage['/underscore.js'].lineData[571] = 0;
  _$jscoverage['/underscore.js'].lineData[572] = 0;
  _$jscoverage['/underscore.js'].lineData[574] = 0;
  _$jscoverage['/underscore.js'].lineData[576] = 0;
  _$jscoverage['/underscore.js'].lineData[581] = 0;
  _$jscoverage['/underscore.js'].lineData[582] = 0;
  _$jscoverage['/underscore.js'].lineData[583] = 0;
  _$jscoverage['/underscore.js'].lineData[584] = 0;
  _$jscoverage['/underscore.js'].lineData[590] = 0;
  _$jscoverage['/underscore.js'].lineData[591] = 0;
  _$jscoverage['/underscore.js'].lineData[592] = 0;
  _$jscoverage['/underscore.js'].lineData[594] = 0;
  _$jscoverage['/underscore.js'].lineData[595] = 0;
  _$jscoverage['/underscore.js'].lineData[597] = 0;
  _$jscoverage['/underscore.js'].lineData[602] = 0;
  _$jscoverage['/underscore.js'].lineData[607] = 0;
  _$jscoverage['/underscore.js'].lineData[608] = 0;
  _$jscoverage['/underscore.js'].lineData[609] = 0;
  _$jscoverage['/underscore.js'].lineData[610] = 0;
  _$jscoverage['/underscore.js'].lineData[611] = 0;
  _$jscoverage['/underscore.js'].lineData[613] = 0;
  _$jscoverage['/underscore.js'].lineData[616] = 0;
  _$jscoverage['/underscore.js'].lineData[620] = 0;
  _$jscoverage['/underscore.js'].lineData[621] = 0;
  _$jscoverage['/underscore.js'].lineData[622] = 0;
  _$jscoverage['/underscore.js'].lineData[623] = 0;
  _$jscoverage['/underscore.js'].lineData[624] = 0;
  _$jscoverage['/underscore.js'].lineData[625] = 0;
  _$jscoverage['/underscore.js'].lineData[626] = 0;
  _$jscoverage['/underscore.js'].lineData[628] = 0;
  _$jscoverage['/underscore.js'].lineData[633] = 0;
  _$jscoverage['/underscore.js'].lineData[634] = 0;
  _$jscoverage['/underscore.js'].lineData[638] = 0;
  _$jscoverage['/underscore.js'].lineData[639] = 0;
  _$jscoverage['/underscore.js'].lineData[640] = 0;
  _$jscoverage['/underscore.js'].lineData[641] = 0;
  _$jscoverage['/underscore.js'].lineData[642] = 0;
  _$jscoverage['/underscore.js'].lineData[643] = 0;
  _$jscoverage['/underscore.js'].lineData[644] = 0;
  _$jscoverage['/underscore.js'].lineData[646] = 0;
  _$jscoverage['/underscore.js'].lineData[650] = 0;
  _$jscoverage['/underscore.js'].lineData[651] = 0;
  _$jscoverage['/underscore.js'].lineData[652] = 0;
  _$jscoverage['/underscore.js'].lineData[653] = 0;
  _$jscoverage['/underscore.js'].lineData[654] = 0;
  _$jscoverage['/underscore.js'].lineData[655] = 0;
  _$jscoverage['/underscore.js'].lineData[657] = 0;
  _$jscoverage['/underscore.js'].lineData[659] = 0;
  _$jscoverage['/underscore.js'].lineData[660] = 0;
  _$jscoverage['/underscore.js'].lineData[661] = 0;
  _$jscoverage['/underscore.js'].lineData[663] = 0;
  _$jscoverage['/underscore.js'].lineData[664] = 0;
  _$jscoverage['/underscore.js'].lineData[665] = 0;
  _$jscoverage['/underscore.js'].lineData[667] = 0;
  _$jscoverage['/underscore.js'].lineData[668] = 0;
  _$jscoverage['/underscore.js'].lineData[670] = 0;
  _$jscoverage['/underscore.js'].lineData[678] = 0;
  _$jscoverage['/underscore.js'].lineData[679] = 0;
  _$jscoverage['/underscore.js'].lineData[684] = 0;
  _$jscoverage['/underscore.js'].lineData[685] = 0;
  _$jscoverage['/underscore.js'].lineData[686] = 0;
  _$jscoverage['/underscore.js'].lineData[687] = 0;
  _$jscoverage['/underscore.js'].lineData[689] = 0;
  _$jscoverage['/underscore.js'].lineData[691] = 0;
  _$jscoverage['/underscore.js'].lineData[692] = 0;
  _$jscoverage['/underscore.js'].lineData[694] = 0;
  _$jscoverage['/underscore.js'].lineData[695] = 0;
  _$jscoverage['/underscore.js'].lineData[698] = 0;
  _$jscoverage['/underscore.js'].lineData[703] = 0;
  _$jscoverage['/underscore.js'].lineData[704] = 0;
  _$jscoverage['/underscore.js'].lineData[706] = 0;
  _$jscoverage['/underscore.js'].lineData[707] = 0;
  _$jscoverage['/underscore.js'].lineData[708] = 0;
  _$jscoverage['/underscore.js'].lineData[709] = 0;
  _$jscoverage['/underscore.js'].lineData[711] = 0;
  _$jscoverage['/underscore.js'].lineData[719] = 0;
  _$jscoverage['/underscore.js'].lineData[720] = 0;
  _$jscoverage['/underscore.js'].lineData[721] = 0;
  _$jscoverage['/underscore.js'].lineData[722] = 0;
  _$jscoverage['/underscore.js'].lineData[723] = 0;
  _$jscoverage['/underscore.js'].lineData[724] = 0;
  _$jscoverage['/underscore.js'].lineData[730] = 0;
  _$jscoverage['/underscore.js'].lineData[731] = 0;
  _$jscoverage['/underscore.js'].lineData[732] = 0;
  _$jscoverage['/underscore.js'].lineData[733] = 0;
  _$jscoverage['/underscore.js'].lineData[735] = 0;
  _$jscoverage['/underscore.js'].lineData[742] = 0;
  _$jscoverage['/underscore.js'].lineData[743] = 0;
  _$jscoverage['/underscore.js'].lineData[744] = 0;
  _$jscoverage['/underscore.js'].lineData[745] = 0;
  _$jscoverage['/underscore.js'].lineData[746] = 0;
  _$jscoverage['/underscore.js'].lineData[747] = 0;
  _$jscoverage['/underscore.js'].lineData[748] = 0;
  _$jscoverage['/underscore.js'].lineData[750] = 0;
  _$jscoverage['/underscore.js'].lineData[751] = 0;
  _$jscoverage['/underscore.js'].lineData[753] = 0;
  _$jscoverage['/underscore.js'].lineData[756] = 0;
  _$jscoverage['/underscore.js'].lineData[761] = 0;
  _$jscoverage['/underscore.js'].lineData[762] = 0;
  _$jscoverage['/underscore.js'].lineData[763] = 0;
  _$jscoverage['/underscore.js'].lineData[764] = 0;
  _$jscoverage['/underscore.js'].lineData[765] = 0;
  _$jscoverage['/underscore.js'].lineData[766] = 0;
  _$jscoverage['/underscore.js'].lineData[767] = 0;
  _$jscoverage['/underscore.js'].lineData[772] = 0;
  _$jscoverage['/underscore.js'].lineData[773] = 0;
  _$jscoverage['/underscore.js'].lineData[774] = 0;
  _$jscoverage['/underscore.js'].lineData[775] = 0;
  _$jscoverage['/underscore.js'].lineData[776] = 0;
  _$jscoverage['/underscore.js'].lineData[777] = 0;
  _$jscoverage['/underscore.js'].lineData[779] = 0;
  _$jscoverage['/underscore.js'].lineData[780] = 0;
  _$jscoverage['/underscore.js'].lineData[785] = 0;
  _$jscoverage['/underscore.js'].lineData[786] = 0;
  _$jscoverage['/underscore.js'].lineData[787] = 0;
  _$jscoverage['/underscore.js'].lineData[793] = 0;
  _$jscoverage['/underscore.js'].lineData[800] = 0;
  _$jscoverage['/underscore.js'].lineData[801] = 0;
  _$jscoverage['/underscore.js'].lineData[802] = 0;
  _$jscoverage['/underscore.js'].lineData[803] = 0;
  _$jscoverage['/underscore.js'].lineData[804] = 0;
  _$jscoverage['/underscore.js'].lineData[805] = 0;
  _$jscoverage['/underscore.js'].lineData[806] = 0;
  _$jscoverage['/underscore.js'].lineData[807] = 0;
  _$jscoverage['/underscore.js'].lineData[808] = 0;
  _$jscoverage['/underscore.js'].lineData[809] = 0;
  _$jscoverage['/underscore.js'].lineData[811] = 0;
  _$jscoverage['/underscore.js'].lineData[812] = 0;
  _$jscoverage['/underscore.js'].lineData[813] = 0;
  _$jscoverage['/underscore.js'].lineData[814] = 0;
  _$jscoverage['/underscore.js'].lineData[815] = 0;
  _$jscoverage['/underscore.js'].lineData[816] = 0;
  _$jscoverage['/underscore.js'].lineData[817] = 0;
  _$jscoverage['/underscore.js'].lineData[818] = 0;
  _$jscoverage['/underscore.js'].lineData[819] = 0;
  _$jscoverage['/underscore.js'].lineData[820] = 0;
  _$jscoverage['/underscore.js'].lineData[822] = 0;
  _$jscoverage['/underscore.js'].lineData[823] = 0;
  _$jscoverage['/underscore.js'].lineData[824] = 0;
  _$jscoverage['/underscore.js'].lineData[825] = 0;
  _$jscoverage['/underscore.js'].lineData[826] = 0;
  _$jscoverage['/underscore.js'].lineData[828] = 0;
  _$jscoverage['/underscore.js'].lineData[836] = 0;
  _$jscoverage['/underscore.js'].lineData[837] = 0;
  _$jscoverage['/underscore.js'].lineData[839] = 0;
  _$jscoverage['/underscore.js'].lineData[840] = 0;
  _$jscoverage['/underscore.js'].lineData[842] = 0;
  _$jscoverage['/underscore.js'].lineData[843] = 0;
  _$jscoverage['/underscore.js'].lineData[845] = 0;
  _$jscoverage['/underscore.js'].lineData[846] = 0;
  _$jscoverage['/underscore.js'].lineData[847] = 0;
  _$jscoverage['/underscore.js'].lineData[848] = 0;
  _$jscoverage['/underscore.js'].lineData[853] = 0;
  _$jscoverage['/underscore.js'].lineData[854] = 0;
  _$jscoverage['/underscore.js'].lineData[855] = 0;
  _$jscoverage['/underscore.js'].lineData[856] = 0;
  _$jscoverage['/underscore.js'].lineData[857] = 0;
  _$jscoverage['/underscore.js'].lineData[858] = 0;
  _$jscoverage['/underscore.js'].lineData[859] = 0;
  _$jscoverage['/underscore.js'].lineData[860] = 0;
  _$jscoverage['/underscore.js'].lineData[861] = 0;
  _$jscoverage['/underscore.js'].lineData[864] = 0;
  _$jscoverage['/underscore.js'].lineData[871] = 0;
  _$jscoverage['/underscore.js'].lineData[872] = 0;
  _$jscoverage['/underscore.js'].lineData[876] = 0;
  _$jscoverage['/underscore.js'].lineData[877] = 0;
  _$jscoverage['/underscore.js'].lineData[878] = 0;
  _$jscoverage['/underscore.js'].lineData[884] = 0;
  _$jscoverage['/underscore.js'].lineData[885] = 0;
  _$jscoverage['/underscore.js'].lineData[886] = 0;
  _$jscoverage['/underscore.js'].lineData[887] = 0;
  _$jscoverage['/underscore.js'].lineData[888] = 0;
  _$jscoverage['/underscore.js'].lineData[889] = 0;
  _$jscoverage['/underscore.js'].lineData[890] = 0;
  _$jscoverage['/underscore.js'].lineData[891] = 0;
  _$jscoverage['/underscore.js'].lineData[896] = 0;
  _$jscoverage['/underscore.js'].lineData[897] = 0;
  _$jscoverage['/underscore.js'].lineData[898] = 0;
  _$jscoverage['/underscore.js'].lineData[899] = 0;
  _$jscoverage['/underscore.js'].lineData[905] = 0;
  _$jscoverage['/underscore.js'].lineData[906] = 0;
  _$jscoverage['/underscore.js'].lineData[907] = 0;
  _$jscoverage['/underscore.js'].lineData[908] = 0;
  _$jscoverage['/underscore.js'].lineData[909] = 0;
  _$jscoverage['/underscore.js'].lineData[911] = 0;
  _$jscoverage['/underscore.js'].lineData[912] = 0;
  _$jscoverage['/underscore.js'].lineData[918] = 0;
  _$jscoverage['/underscore.js'].lineData[920] = 0;
  _$jscoverage['/underscore.js'].lineData[926] = 0;
  _$jscoverage['/underscore.js'].lineData[927] = 0;
  _$jscoverage['/underscore.js'].lineData[930] = 0;
  _$jscoverage['/underscore.js'].lineData[931] = 0;
  _$jscoverage['/underscore.js'].lineData[932] = 0;
  _$jscoverage['/underscore.js'].lineData[933] = 0;
  _$jscoverage['/underscore.js'].lineData[936] = 0;
  _$jscoverage['/underscore.js'].lineData[937] = 0;
  _$jscoverage['/underscore.js'].lineData[939] = 0;
  _$jscoverage['/underscore.js'].lineData[940] = 0;
  _$jscoverage['/underscore.js'].lineData[941] = 0;
  _$jscoverage['/underscore.js'].lineData[942] = 0;
  _$jscoverage['/underscore.js'].lineData[949] = 0;
  _$jscoverage['/underscore.js'].lineData[950] = 0;
  _$jscoverage['/underscore.js'].lineData[951] = 0;
  _$jscoverage['/underscore.js'].lineData[952] = 0;
  _$jscoverage['/underscore.js'].lineData[953] = 0;
  _$jscoverage['/underscore.js'].lineData[955] = 0;
  _$jscoverage['/underscore.js'].lineData[956] = 0;
  _$jscoverage['/underscore.js'].lineData[960] = 0;
  _$jscoverage['/underscore.js'].lineData[961] = 0;
  _$jscoverage['/underscore.js'].lineData[962] = 0;
  _$jscoverage['/underscore.js'].lineData[963] = 0;
  _$jscoverage['/underscore.js'].lineData[965] = 0;
  _$jscoverage['/underscore.js'].lineData[966] = 0;
  _$jscoverage['/underscore.js'].lineData[970] = 0;
  _$jscoverage['/underscore.js'].lineData[971] = 0;
  _$jscoverage['/underscore.js'].lineData[972] = 0;
  _$jscoverage['/underscore.js'].lineData[973] = 0;
  _$jscoverage['/underscore.js'].lineData[974] = 0;
  _$jscoverage['/underscore.js'].lineData[975] = 0;
  _$jscoverage['/underscore.js'].lineData[977] = 0;
  _$jscoverage['/underscore.js'].lineData[982] = 0;
  _$jscoverage['/underscore.js'].lineData[983] = 0;
  _$jscoverage['/underscore.js'].lineData[984] = 0;
  _$jscoverage['/underscore.js'].lineData[987] = 0;
  _$jscoverage['/underscore.js'].lineData[988] = 0;
  _$jscoverage['/underscore.js'].lineData[989] = 0;
  _$jscoverage['/underscore.js'].lineData[991] = 0;
  _$jscoverage['/underscore.js'].lineData[995] = 0;
  _$jscoverage['/underscore.js'].lineData[996] = 0;
  _$jscoverage['/underscore.js'].lineData[997] = 0;
  _$jscoverage['/underscore.js'].lineData[998] = 0;
  _$jscoverage['/underscore.js'].lineData[999] = 0;
  _$jscoverage['/underscore.js'].lineData[1000] = 0;
  _$jscoverage['/underscore.js'].lineData[1002] = 0;
  _$jscoverage['/underscore.js'].lineData[1006] = 0;
  _$jscoverage['/underscore.js'].lineData[1007] = 0;
  _$jscoverage['/underscore.js'].lineData[1008] = 0;
  _$jscoverage['/underscore.js'].lineData[1009] = 0;
  _$jscoverage['/underscore.js'].lineData[1010] = 0;
  _$jscoverage['/underscore.js'].lineData[1012] = 0;
  _$jscoverage['/underscore.js'].lineData[1017] = 0;
  _$jscoverage['/underscore.js'].lineData[1018] = 0;
  _$jscoverage['/underscore.js'].lineData[1019] = 0;
  _$jscoverage['/underscore.js'].lineData[1020] = 0;
  _$jscoverage['/underscore.js'].lineData[1022] = 0;
  _$jscoverage['/underscore.js'].lineData[1026] = 0;
  _$jscoverage['/underscore.js'].lineData[1027] = 0;
  _$jscoverage['/underscore.js'].lineData[1028] = 0;
  _$jscoverage['/underscore.js'].lineData[1029] = 0;
  _$jscoverage['/underscore.js'].lineData[1030] = 0;
  _$jscoverage['/underscore.js'].lineData[1031] = 0;
  _$jscoverage['/underscore.js'].lineData[1032] = 0;
  _$jscoverage['/underscore.js'].lineData[1035] = 0;
  _$jscoverage['/underscore.js'].lineData[1036] = 0;
  _$jscoverage['/underscore.js'].lineData[1037] = 0;
  _$jscoverage['/underscore.js'].lineData[1040] = 0;
  _$jscoverage['/underscore.js'].lineData[1045] = 0;
  _$jscoverage['/underscore.js'].lineData[1049] = 0;
  _$jscoverage['/underscore.js'].lineData[1052] = 0;
  _$jscoverage['/underscore.js'].lineData[1053] = 0;
  _$jscoverage['/underscore.js'].lineData[1054] = 0;
  _$jscoverage['/underscore.js'].lineData[1055] = 0;
  _$jscoverage['/underscore.js'].lineData[1056] = 0;
  _$jscoverage['/underscore.js'].lineData[1057] = 0;
  _$jscoverage['/underscore.js'].lineData[1062] = 0;
  _$jscoverage['/underscore.js'].lineData[1063] = 0;
  _$jscoverage['/underscore.js'].lineData[1067] = 0;
  _$jscoverage['/underscore.js'].lineData[1068] = 0;
  _$jscoverage['/underscore.js'].lineData[1069] = 0;
  _$jscoverage['/underscore.js'].lineData[1070] = 0;
  _$jscoverage['/underscore.js'].lineData[1071] = 0;
  _$jscoverage['/underscore.js'].lineData[1072] = 0;
  _$jscoverage['/underscore.js'].lineData[1074] = 0;
  _$jscoverage['/underscore.js'].lineData[1075] = 0;
  _$jscoverage['/underscore.js'].lineData[1076] = 0;
  _$jscoverage['/underscore.js'].lineData[1078] = 0;
  _$jscoverage['/underscore.js'].lineData[1079] = 0;
  _$jscoverage['/underscore.js'].lineData[1080] = 0;
  _$jscoverage['/underscore.js'].lineData[1081] = 0;
  _$jscoverage['/underscore.js'].lineData[1083] = 0;
  _$jscoverage['/underscore.js'].lineData[1087] = 0;
  _$jscoverage['/underscore.js'].lineData[1088] = 0;
  _$jscoverage['/underscore.js'].lineData[1089] = 0;
  _$jscoverage['/underscore.js'].lineData[1090] = 0;
  _$jscoverage['/underscore.js'].lineData[1091] = 0;
  _$jscoverage['/underscore.js'].lineData[1093] = 0;
  _$jscoverage['/underscore.js'].lineData[1094] = 0;
  _$jscoverage['/underscore.js'].lineData[1095] = 0;
  _$jscoverage['/underscore.js'].lineData[1098] = 0;
  _$jscoverage['/underscore.js'].lineData[1102] = 0;
  _$jscoverage['/underscore.js'].lineData[1107] = 0;
  _$jscoverage['/underscore.js'].lineData[1108] = 0;
  _$jscoverage['/underscore.js'].lineData[1109] = 0;
  _$jscoverage['/underscore.js'].lineData[1110] = 0;
  _$jscoverage['/underscore.js'].lineData[1114] = 0;
  _$jscoverage['/underscore.js'].lineData[1115] = 0;
  _$jscoverage['/underscore.js'].lineData[1116] = 0;
  _$jscoverage['/underscore.js'].lineData[1122] = 0;
  _$jscoverage['/underscore.js'].lineData[1123] = 0;
  _$jscoverage['/underscore.js'].lineData[1124] = 0;
  _$jscoverage['/underscore.js'].lineData[1128] = 0;
  _$jscoverage['/underscore.js'].lineData[1129] = 0;
  _$jscoverage['/underscore.js'].lineData[1130] = 0;
  _$jscoverage['/underscore.js'].lineData[1131] = 0;
  _$jscoverage['/underscore.js'].lineData[1132] = 0;
  _$jscoverage['/underscore.js'].lineData[1133] = 0;
  _$jscoverage['/underscore.js'].lineData[1134] = 0;
  _$jscoverage['/underscore.js'].lineData[1136] = 0;
  _$jscoverage['/underscore.js'].lineData[1141] = 0;
  _$jscoverage['/underscore.js'].lineData[1142] = 0;
  _$jscoverage['/underscore.js'].lineData[1145] = 0;
  _$jscoverage['/underscore.js'].lineData[1147] = 0;
  _$jscoverage['/underscore.js'].lineData[1149] = 0;
  _$jscoverage['/underscore.js'].lineData[1151] = 0;
  _$jscoverage['/underscore.js'].lineData[1152] = 0;
  _$jscoverage['/underscore.js'].lineData[1153] = 0;
  _$jscoverage['/underscore.js'].lineData[1157] = 0;
  _$jscoverage['/underscore.js'].lineData[1159] = 0;
  _$jscoverage['/underscore.js'].lineData[1160] = 0;
  _$jscoverage['/underscore.js'].lineData[1162] = 0;
  _$jscoverage['/underscore.js'].lineData[1163] = 0;
  _$jscoverage['/underscore.js'].lineData[1164] = 0;
  _$jscoverage['/underscore.js'].lineData[1166] = 0;
  _$jscoverage['/underscore.js'].lineData[1171] = 0;
  _$jscoverage['/underscore.js'].lineData[1175] = 0;
  _$jscoverage['/underscore.js'].lineData[1177] = 0;
  _$jscoverage['/underscore.js'].lineData[1178] = 0;
  _$jscoverage['/underscore.js'].lineData[1183] = 0;
  _$jscoverage['/underscore.js'].lineData[1186] = 0;
  _$jscoverage['/underscore.js'].lineData[1187] = 0;
  _$jscoverage['/underscore.js'].lineData[1188] = 0;
  _$jscoverage['/underscore.js'].lineData[1192] = 0;
  _$jscoverage['/underscore.js'].lineData[1193] = 0;
  _$jscoverage['/underscore.js'].lineData[1196] = 0;
  _$jscoverage['/underscore.js'].lineData[1204] = 0;
  _$jscoverage['/underscore.js'].lineData[1205] = 0;
  _$jscoverage['/underscore.js'].lineData[1206] = 0;
  _$jscoverage['/underscore.js'].lineData[1207] = 0;
  _$jscoverage['/underscore.js'].lineData[1210] = 0;
  _$jscoverage['/underscore.js'].lineData[1214] = 0;
  _$jscoverage['/underscore.js'].lineData[1215] = 0;
  _$jscoverage['/underscore.js'].lineData[1218] = 0;
  _$jscoverage['/underscore.js'].lineData[1220] = 0;
  _$jscoverage['/underscore.js'].lineData[1221] = 0;
  _$jscoverage['/underscore.js'].lineData[1223] = 0;
  _$jscoverage['/underscore.js'].lineData[1224] = 0;
  _$jscoverage['/underscore.js'].lineData[1228] = 0;
  _$jscoverage['/underscore.js'].lineData[1229] = 0;
  _$jscoverage['/underscore.js'].lineData[1231] = 0;
  _$jscoverage['/underscore.js'].lineData[1232] = 0;
  _$jscoverage['/underscore.js'].lineData[1234] = 0;
  _$jscoverage['/underscore.js'].lineData[1235] = 0;
  _$jscoverage['/underscore.js'].lineData[1239] = 0;
  _$jscoverage['/underscore.js'].lineData[1240] = 0;
  _$jscoverage['/underscore.js'].lineData[1241] = 0;
  _$jscoverage['/underscore.js'].lineData[1245] = 0;
  _$jscoverage['/underscore.js'].lineData[1246] = 0;
  _$jscoverage['/underscore.js'].lineData[1251] = 0;
  _$jscoverage['/underscore.js'].lineData[1252] = 0;
  _$jscoverage['/underscore.js'].lineData[1253] = 0;
  _$jscoverage['/underscore.js'].lineData[1254] = 0;
  _$jscoverage['/underscore.js'].lineData[1258] = 0;
  _$jscoverage['/underscore.js'].lineData[1259] = 0;
  _$jscoverage['/underscore.js'].lineData[1264] = 0;
  _$jscoverage['/underscore.js'].lineData[1265] = 0;
  _$jscoverage['/underscore.js'].lineData[1269] = 0;
  _$jscoverage['/underscore.js'].lineData[1270] = 0;
  _$jscoverage['/underscore.js'].lineData[1271] = 0;
  _$jscoverage['/underscore.js'].lineData[1275] = 0;
  _$jscoverage['/underscore.js'].lineData[1276] = 0;
  _$jscoverage['/underscore.js'].lineData[1277] = 0;
  _$jscoverage['/underscore.js'].lineData[1283] = 0;
  _$jscoverage['/underscore.js'].lineData[1284] = 0;
  _$jscoverage['/underscore.js'].lineData[1285] = 0;
  _$jscoverage['/underscore.js'].lineData[1291] = 0;
  _$jscoverage['/underscore.js'].lineData[1292] = 0;
  _$jscoverage['/underscore.js'].lineData[1293] = 0;
  _$jscoverage['/underscore.js'].lineData[1294] = 0;
  _$jscoverage['/underscore.js'].lineData[1299] = 0;
  _$jscoverage['/underscore.js'].lineData[1300] = 0;
  _$jscoverage['/underscore.js'].lineData[1304] = 0;
  _$jscoverage['/underscore.js'].lineData[1305] = 0;
  _$jscoverage['/underscore.js'].lineData[1309] = 0;
  _$jscoverage['/underscore.js'].lineData[1310] = 0;
  _$jscoverage['/underscore.js'].lineData[1314] = 0;
  _$jscoverage['/underscore.js'].lineData[1315] = 0;
  _$jscoverage['/underscore.js'].lineData[1319] = 0;
  _$jscoverage['/underscore.js'].lineData[1320] = 0;
  _$jscoverage['/underscore.js'].lineData[1325] = 0;
  _$jscoverage['/underscore.js'].lineData[1326] = 0;
  _$jscoverage['/underscore.js'].lineData[1334] = 0;
  _$jscoverage['/underscore.js'].lineData[1335] = 0;
  _$jscoverage['/underscore.js'].lineData[1336] = 0;
  _$jscoverage['/underscore.js'].lineData[1340] = 0;
  _$jscoverage['/underscore.js'].lineData[1341] = 0;
  _$jscoverage['/underscore.js'].lineData[1345] = 0;
  _$jscoverage['/underscore.js'].lineData[1346] = 0;
  _$jscoverage['/underscore.js'].lineData[1347] = 0;
  _$jscoverage['/underscore.js'].lineData[1351] = 0;
  _$jscoverage['/underscore.js'].lineData[1353] = 0;
  _$jscoverage['/underscore.js'].lineData[1356] = 0;
  _$jscoverage['/underscore.js'].lineData[1357] = 0;
  _$jscoverage['/underscore.js'].lineData[1358] = 0;
  _$jscoverage['/underscore.js'].lineData[1364] = 0;
  _$jscoverage['/underscore.js'].lineData[1365] = 0;
  _$jscoverage['/underscore.js'].lineData[1366] = 0;
  _$jscoverage['/underscore.js'].lineData[1367] = 0;
  _$jscoverage['/underscore.js'].lineData[1372] = 0;
  _$jscoverage['/underscore.js'].lineData[1373] = 0;
  _$jscoverage['/underscore.js'].lineData[1374] = 0;
  _$jscoverage['/underscore.js'].lineData[1375] = 0;
  _$jscoverage['/underscore.js'].lineData[1376] = 0;
  _$jscoverage['/underscore.js'].lineData[1380] = 0;
  _$jscoverage['/underscore.js'].lineData[1381] = 0;
  _$jscoverage['/underscore.js'].lineData[1382] = 0;
  _$jscoverage['/underscore.js'].lineData[1383] = 0;
  _$jscoverage['/underscore.js'].lineData[1385] = 0;
  _$jscoverage['/underscore.js'].lineData[1389] = 0;
  _$jscoverage['/underscore.js'].lineData[1390] = 0;
  _$jscoverage['/underscore.js'].lineData[1394] = 0;
  _$jscoverage['/underscore.js'].lineData[1402] = 0;
  _$jscoverage['/underscore.js'].lineData[1405] = 0;
  _$jscoverage['/underscore.js'].lineData[1406] = 0;
  _$jscoverage['/underscore.js'].lineData[1407] = 0;
  _$jscoverage['/underscore.js'].lineData[1410] = 0;
  _$jscoverage['/underscore.js'].lineData[1411] = 0;
  _$jscoverage['/underscore.js'].lineData[1412] = 0;
  _$jscoverage['/underscore.js'].lineData[1413] = 0;
  _$jscoverage['/underscore.js'].lineData[1414] = 0;
  _$jscoverage['/underscore.js'].lineData[1415] = 0;
  _$jscoverage['/underscore.js'].lineData[1418] = 0;
  _$jscoverage['/underscore.js'].lineData[1419] = 0;
  _$jscoverage['/underscore.js'].lineData[1423] = 0;
  _$jscoverage['/underscore.js'].lineData[1424] = 0;
  _$jscoverage['/underscore.js'].lineData[1425] = 0;
  _$jscoverage['/underscore.js'].lineData[1426] = 0;
  _$jscoverage['/underscore.js'].lineData[1428] = 0;
  _$jscoverage['/underscore.js'].lineData[1433] = 0;
  _$jscoverage['/underscore.js'].lineData[1434] = 0;
  _$jscoverage['/underscore.js'].lineData[1435] = 0;
  _$jscoverage['/underscore.js'].lineData[1436] = 0;
  _$jscoverage['/underscore.js'].lineData[1441] = 0;
  _$jscoverage['/underscore.js'].lineData[1450] = 0;
  _$jscoverage['/underscore.js'].lineData[1454] = 0;
  _$jscoverage['/underscore.js'].lineData[1463] = 0;
  _$jscoverage['/underscore.js'].lineData[1465] = 0;
  _$jscoverage['/underscore.js'].lineData[1466] = 0;
  _$jscoverage['/underscore.js'].lineData[1473] = 0;
  _$jscoverage['/underscore.js'].lineData[1474] = 0;
  _$jscoverage['/underscore.js'].lineData[1475] = 0;
  _$jscoverage['/underscore.js'].lineData[1478] = 0;
  _$jscoverage['/underscore.js'].lineData[1485] = 0;
  _$jscoverage['/underscore.js'].lineData[1486] = 0;
  _$jscoverage['/underscore.js'].lineData[1487] = 0;
  _$jscoverage['/underscore.js'].lineData[1488] = 0;
  _$jscoverage['/underscore.js'].lineData[1489] = 0;
  _$jscoverage['/underscore.js'].lineData[1491] = 0;
  _$jscoverage['/underscore.js'].lineData[1492] = 0;
  _$jscoverage['/underscore.js'].lineData[1493] = 0;
  _$jscoverage['/underscore.js'].lineData[1494] = 0;
  _$jscoverage['/underscore.js'].lineData[1495] = 0;
  _$jscoverage['/underscore.js'].lineData[1496] = 0;
  _$jscoverage['/underscore.js'].lineData[1500] = 0;
  _$jscoverage['/underscore.js'].lineData[1502] = 0;
  _$jscoverage['/underscore.js'].lineData[1505] = 0;
  _$jscoverage['/underscore.js'].lineData[1507] = 0;
  _$jscoverage['/underscore.js'].lineData[1511] = 0;
  _$jscoverage['/underscore.js'].lineData[1512] = 0;
  _$jscoverage['/underscore.js'].lineData[1513] = 0;
  _$jscoverage['/underscore.js'].lineData[1515] = 0;
  _$jscoverage['/underscore.js'].lineData[1516] = 0;
  _$jscoverage['/underscore.js'].lineData[1519] = 0;
  _$jscoverage['/underscore.js'].lineData[1520] = 0;
  _$jscoverage['/underscore.js'].lineData[1524] = 0;
  _$jscoverage['/underscore.js'].lineData[1525] = 0;
  _$jscoverage['/underscore.js'].lineData[1527] = 0;
  _$jscoverage['/underscore.js'].lineData[1531] = 0;
  _$jscoverage['/underscore.js'].lineData[1532] = 0;
  _$jscoverage['/underscore.js'].lineData[1533] = 0;
  _$jscoverage['/underscore.js'].lineData[1534] = 0;
  _$jscoverage['/underscore.js'].lineData[1544] = 0;
  _$jscoverage['/underscore.js'].lineData[1545] = 0;
  _$jscoverage['/underscore.js'].lineData[1549] = 0;
  _$jscoverage['/underscore.js'].lineData[1550] = 0;
  _$jscoverage['/underscore.js'].lineData[1551] = 0;
  _$jscoverage['/underscore.js'].lineData[1552] = 0;
  _$jscoverage['/underscore.js'].lineData[1553] = 0;
  _$jscoverage['/underscore.js'].lineData[1554] = 0;
  _$jscoverage['/underscore.js'].lineData[1555] = 0;
  _$jscoverage['/underscore.js'].lineData[1561] = 0;
  _$jscoverage['/underscore.js'].lineData[1564] = 0;
  _$jscoverage['/underscore.js'].lineData[1565] = 0;
  _$jscoverage['/underscore.js'].lineData[1566] = 0;
  _$jscoverage['/underscore.js'].lineData[1567] = 0;
  _$jscoverage['/underscore.js'].lineData[1568] = 0;
  _$jscoverage['/underscore.js'].lineData[1569] = 0;
  _$jscoverage['/underscore.js'].lineData[1570] = 0;
  _$jscoverage['/underscore.js'].lineData[1575] = 0;
  _$jscoverage['/underscore.js'].lineData[1576] = 0;
  _$jscoverage['/underscore.js'].lineData[1577] = 0;
  _$jscoverage['/underscore.js'].lineData[1578] = 0;
  _$jscoverage['/underscore.js'].lineData[1583] = 0;
  _$jscoverage['/underscore.js'].lineData[1584] = 0;
  _$jscoverage['/underscore.js'].lineData[1589] = 0;
  _$jscoverage['/underscore.js'].lineData[1591] = 0;
  _$jscoverage['/underscore.js'].lineData[1592] = 0;
  _$jscoverage['/underscore.js'].lineData[1602] = 0;
  _$jscoverage['/underscore.js'].lineData[1603] = 0;
  _$jscoverage['/underscore.js'].lineData[1604] = 0;
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
  _$jscoverage['/underscore.js'].branchData['51'] = [];
  _$jscoverage['/underscore.js'].branchData['51'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['52'] = [];
  _$jscoverage['/underscore.js'].branchData['52'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['52'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['67'] = [];
  _$jscoverage['/underscore.js'].branchData['67'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['68'] = [];
  _$jscoverage['/underscore.js'].branchData['68'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['90'] = [];
  _$jscoverage['/underscore.js'].branchData['90'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['91'] = [];
  _$jscoverage['/underscore.js'].branchData['91'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['92'] = [];
  _$jscoverage['/underscore.js'].branchData['92'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['103'] = [];
  _$jscoverage['/underscore.js'].branchData['103'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['107'] = [];
  _$jscoverage['/underscore.js'].branchData['107'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['116'] = [];
  _$jscoverage['/underscore.js'].branchData['116'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['126'] = [];
  _$jscoverage['/underscore.js'].branchData['126'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['127'] = [];
  _$jscoverage['/underscore.js'].branchData['127'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['136'] = [];
  _$jscoverage['/underscore.js'].branchData['136'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['148'] = [];
  _$jscoverage['/underscore.js'].branchData['148'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['148'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['148'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['148'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['148'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['160'] = [];
  _$jscoverage['/underscore.js'].branchData['160'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['161'] = [];
  _$jscoverage['/underscore.js'].branchData['161'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['166'] = [];
  _$jscoverage['/underscore.js'].branchData['166'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['176'] = [];
  _$jscoverage['/underscore.js'].branchData['176'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['177'] = [];
  _$jscoverage['/underscore.js'].branchData['177'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['179'] = [];
  _$jscoverage['/underscore.js'].branchData['179'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['180'] = [];
  _$jscoverage['/underscore.js'].branchData['180'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['191'] = [];
  _$jscoverage['/underscore.js'].branchData['191'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['192'] = [];
  _$jscoverage['/underscore.js'].branchData['192'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['193'] = [];
  _$jscoverage['/underscore.js'].branchData['193'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['194'] = [];
  _$jscoverage['/underscore.js'].branchData['194'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['195'] = [];
  _$jscoverage['/underscore.js'].branchData['195'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['198'] = [];
  _$jscoverage['/underscore.js'].branchData['198'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['198'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['198'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['199'] = [];
  _$jscoverage['/underscore.js'].branchData['199'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['206'] = [];
  _$jscoverage['/underscore.js'].branchData['206'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['221'] = [];
  _$jscoverage['/underscore.js'].branchData['221'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['226'] = [];
  _$jscoverage['/underscore.js'].branchData['226'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['226'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['226'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['235'] = [];
  _$jscoverage['/underscore.js'].branchData['235'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['249'] = [];
  _$jscoverage['/underscore.js'].branchData['249'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['250'] = [];
  _$jscoverage['/underscore.js'].branchData['250'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['251'] = [];
  _$jscoverage['/underscore.js'].branchData['251'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['252'] = [];
  _$jscoverage['/underscore.js'].branchData['252'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['253'] = [];
  _$jscoverage['/underscore.js'].branchData['253'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['262'] = [];
  _$jscoverage['/underscore.js'].branchData['262'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['263'] = [];
  _$jscoverage['/underscore.js'].branchData['263'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['264'] = [];
  _$jscoverage['/underscore.js'].branchData['264'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['265'] = [];
  _$jscoverage['/underscore.js'].branchData['265'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['266'] = [];
  _$jscoverage['/underscore.js'].branchData['266'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['274'] = [];
  _$jscoverage['/underscore.js'].branchData['274'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['275'] = [];
  _$jscoverage['/underscore.js'].branchData['275'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['275'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['276'] = [];
  _$jscoverage['/underscore.js'].branchData['276'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['283'] = [];
  _$jscoverage['/underscore.js'].branchData['283'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['284'] = [];
  _$jscoverage['/underscore.js'].branchData['284'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['309'] = [];
  _$jscoverage['/underscore.js'].branchData['309'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['309'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['309'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['309'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['309'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['309'][6] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['309'][7] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['310'] = [];
  _$jscoverage['/underscore.js'].branchData['310'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['311'] = [];
  _$jscoverage['/underscore.js'].branchData['311'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['313'] = [];
  _$jscoverage['/underscore.js'].branchData['313'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['321'] = [];
  _$jscoverage['/underscore.js'].branchData['321'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['321'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['321'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['321'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['321'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['334'] = [];
  _$jscoverage['/underscore.js'].branchData['334'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['334'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['334'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['334'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['334'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['334'][6] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['334'][7] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['335'] = [];
  _$jscoverage['/underscore.js'].branchData['335'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['336'] = [];
  _$jscoverage['/underscore.js'].branchData['336'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['338'] = [];
  _$jscoverage['/underscore.js'].branchData['338'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['346'] = [];
  _$jscoverage['/underscore.js'].branchData['346'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['346'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['346'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['346'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['346'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['365'] = [];
  _$jscoverage['/underscore.js'].branchData['365'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['365'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['366'] = [];
  _$jscoverage['/underscore.js'].branchData['366'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['369'] = [];
  _$jscoverage['/underscore.js'].branchData['369'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['373'] = [];
  _$jscoverage['/underscore.js'].branchData['373'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['395'] = [];
  _$jscoverage['/underscore.js'].branchData['395'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['396'] = [];
  _$jscoverage['/underscore.js'].branchData['396'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['396'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['396'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['397'] = [];
  _$jscoverage['/underscore.js'].branchData['397'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['397'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['397'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['406'] = [];
  _$jscoverage['/underscore.js'].branchData['406'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['419'] = [];
  _$jscoverage['/underscore.js'].branchData['419'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['432'] = [];
  _$jscoverage['/underscore.js'].branchData['432'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['437'] = [];
  _$jscoverage['/underscore.js'].branchData['437'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['438'] = [];
  _$jscoverage['/underscore.js'].branchData['438'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['439'] = [];
  _$jscoverage['/underscore.js'].branchData['439'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['445'] = [];
  _$jscoverage['/underscore.js'].branchData['445'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['446'] = [];
  _$jscoverage['/underscore.js'].branchData['446'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['452'] = [];
  _$jscoverage['/underscore.js'].branchData['452'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['462'] = [];
  _$jscoverage['/underscore.js'].branchData['462'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['463'] = [];
  _$jscoverage['/underscore.js'].branchData['463'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['463'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['471'] = [];
  _$jscoverage['/underscore.js'].branchData['471'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['471'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['477'] = [];
  _$jscoverage['/underscore.js'].branchData['477'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['478'] = [];
  _$jscoverage['/underscore.js'].branchData['478'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['478'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['486'] = [];
  _$jscoverage['/underscore.js'].branchData['486'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['486'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['496'] = [];
  _$jscoverage['/underscore.js'].branchData['496'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['498'] = [];
  _$jscoverage['/underscore.js'].branchData['498'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['500'] = [];
  _$jscoverage['/underscore.js'].branchData['500'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['500'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['502'] = [];
  _$jscoverage['/underscore.js'].branchData['502'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['504'] = [];
  _$jscoverage['/underscore.js'].branchData['504'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['509'] = [];
  _$jscoverage['/underscore.js'].branchData['509'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['530'] = [];
  _$jscoverage['/underscore.js'].branchData['530'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['535'] = [];
  _$jscoverage['/underscore.js'].branchData['535'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['538'] = [];
  _$jscoverage['/underscore.js'].branchData['538'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['540'] = [];
  _$jscoverage['/underscore.js'].branchData['540'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['541'] = [];
  _$jscoverage['/underscore.js'].branchData['541'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['542'] = [];
  _$jscoverage['/underscore.js'].branchData['542'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['542'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['544'] = [];
  _$jscoverage['/underscore.js'].branchData['544'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['545'] = [];
  _$jscoverage['/underscore.js'].branchData['545'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['549'] = [];
  _$jscoverage['/underscore.js'].branchData['549'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['567'] = [];
  _$jscoverage['/underscore.js'].branchData['567'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['569'] = [];
  _$jscoverage['/underscore.js'].branchData['569'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['571'] = [];
  _$jscoverage['/underscore.js'].branchData['571'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['572'] = [];
  _$jscoverage['/underscore.js'].branchData['572'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['574'] = [];
  _$jscoverage['/underscore.js'].branchData['574'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['591'] = [];
  _$jscoverage['/underscore.js'].branchData['591'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['591'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['594'] = [];
  _$jscoverage['/underscore.js'].branchData['594'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['609'] = [];
  _$jscoverage['/underscore.js'].branchData['609'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['610'] = [];
  _$jscoverage['/underscore.js'].branchData['610'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['624'] = [];
  _$jscoverage['/underscore.js'].branchData['624'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['625'] = [];
  _$jscoverage['/underscore.js'].branchData['625'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['625'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['625'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['626'] = [];
  _$jscoverage['/underscore.js'].branchData['626'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['642'] = [];
  _$jscoverage['/underscore.js'].branchData['642'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['644'] = [];
  _$jscoverage['/underscore.js'].branchData['644'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['653'] = [];
  _$jscoverage['/underscore.js'].branchData['653'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['654'] = [];
  _$jscoverage['/underscore.js'].branchData['654'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['655'] = [];
  _$jscoverage['/underscore.js'].branchData['655'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['657'] = [];
  _$jscoverage['/underscore.js'].branchData['657'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['659'] = [];
  _$jscoverage['/underscore.js'].branchData['659'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['659'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['661'] = [];
  _$jscoverage['/underscore.js'].branchData['661'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['663'] = [];
  _$jscoverage['/underscore.js'].branchData['663'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['665'] = [];
  _$jscoverage['/underscore.js'].branchData['665'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['667'] = [];
  _$jscoverage['/underscore.js'].branchData['667'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['667'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['667'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['667'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['668'] = [];
  _$jscoverage['/underscore.js'].branchData['668'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['685'] = [];
  _$jscoverage['/underscore.js'].branchData['685'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['686'] = [];
  _$jscoverage['/underscore.js'].branchData['686'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['689'] = [];
  _$jscoverage['/underscore.js'].branchData['689'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['694'] = [];
  _$jscoverage['/underscore.js'].branchData['694'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['704'] = [];
  _$jscoverage['/underscore.js'].branchData['704'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['704'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['704'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['708'] = [];
  _$jscoverage['/underscore.js'].branchData['708'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['720'] = [];
  _$jscoverage['/underscore.js'].branchData['720'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['723'] = [];
  _$jscoverage['/underscore.js'].branchData['723'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['731'] = [];
  _$jscoverage['/underscore.js'].branchData['731'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['747'] = [];
  _$jscoverage['/underscore.js'].branchData['747'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['748'] = [];
  _$jscoverage['/underscore.js'].branchData['748'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['750'] = [];
  _$jscoverage['/underscore.js'].branchData['750'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['764'] = [];
  _$jscoverage['/underscore.js'].branchData['764'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['765'] = [];
  _$jscoverage['/underscore.js'].branchData['765'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['775'] = [];
  _$jscoverage['/underscore.js'].branchData['775'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['776'] = [];
  _$jscoverage['/underscore.js'].branchData['776'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['804'] = [];
  _$jscoverage['/underscore.js'].branchData['804'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['806'] = [];
  _$jscoverage['/underscore.js'].branchData['806'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['809'] = [];
  _$jscoverage['/underscore.js'].branchData['809'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['813'] = [];
  _$jscoverage['/underscore.js'].branchData['813'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['813'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['817'] = [];
  _$jscoverage['/underscore.js'].branchData['817'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['817'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['817'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['818'] = [];
  _$jscoverage['/underscore.js'].branchData['818'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['824'] = [];
  _$jscoverage['/underscore.js'].branchData['824'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['825'] = [];
  _$jscoverage['/underscore.js'].branchData['825'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['825'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['842'] = [];
  _$jscoverage['/underscore.js'].branchData['842'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['842'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['842'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['846'] = [];
  _$jscoverage['/underscore.js'].branchData['846'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['848'] = [];
  _$jscoverage['/underscore.js'].branchData['848'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['857'] = [];
  _$jscoverage['/underscore.js'].branchData['857'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['858'] = [];
  _$jscoverage['/underscore.js'].branchData['858'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['859'] = [];
  _$jscoverage['/underscore.js'].branchData['859'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['890'] = [];
  _$jscoverage['/underscore.js'].branchData['890'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['898'] = [];
  _$jscoverage['/underscore.js'].branchData['898'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['908'] = [];
  _$jscoverage['/underscore.js'].branchData['908'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['911'] = [];
  _$jscoverage['/underscore.js'].branchData['911'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['933'] = [];
  _$jscoverage['/underscore.js'].branchData['933'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['933'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['937'] = [];
  _$jscoverage['/underscore.js'].branchData['937'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['939'] = [];
  _$jscoverage['/underscore.js'].branchData['939'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['941'] = [];
  _$jscoverage['/underscore.js'].branchData['941'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['941'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['941'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['950'] = [];
  _$jscoverage['/underscore.js'].branchData['950'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['951'] = [];
  _$jscoverage['/underscore.js'].branchData['951'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['953'] = [];
  _$jscoverage['/underscore.js'].branchData['953'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['955'] = [];
  _$jscoverage['/underscore.js'].branchData['955'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['961'] = [];
  _$jscoverage['/underscore.js'].branchData['961'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['965'] = [];
  _$jscoverage['/underscore.js'].branchData['965'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['974'] = [];
  _$jscoverage['/underscore.js'].branchData['974'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['987'] = [];
  _$jscoverage['/underscore.js'].branchData['987'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['999'] = [];
  _$jscoverage['/underscore.js'].branchData['999'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1009'] = [];
  _$jscoverage['/underscore.js'].branchData['1009'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1020'] = [];
  _$jscoverage['/underscore.js'].branchData['1020'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1029'] = [];
  _$jscoverage['/underscore.js'].branchData['1029'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1030'] = [];
  _$jscoverage['/underscore.js'].branchData['1030'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1030'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1030'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1031'] = [];
  _$jscoverage['/underscore.js'].branchData['1031'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1035'] = [];
  _$jscoverage['/underscore.js'].branchData['1035'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1037'] = [];
  _$jscoverage['/underscore.js'].branchData['1037'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1037'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1055'] = [];
  _$jscoverage['/underscore.js'].branchData['1055'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1057'] = [];
  _$jscoverage['/underscore.js'].branchData['1057'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1069'] = [];
  _$jscoverage['/underscore.js'].branchData['1069'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1070'] = [];
  _$jscoverage['/underscore.js'].branchData['1070'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1071'] = [];
  _$jscoverage['/underscore.js'].branchData['1071'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1078'] = [];
  _$jscoverage['/underscore.js'].branchData['1078'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1081'] = [];
  _$jscoverage['/underscore.js'].branchData['1081'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1089'] = [];
  _$jscoverage['/underscore.js'].branchData['1089'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1091'] = [];
  _$jscoverage['/underscore.js'].branchData['1091'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1109'] = [];
  _$jscoverage['/underscore.js'].branchData['1109'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1115'] = [];
  _$jscoverage['/underscore.js'].branchData['1115'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1116'] = [];
  _$jscoverage['/underscore.js'].branchData['1116'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1130'] = [];
  _$jscoverage['/underscore.js'].branchData['1130'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1132'] = [];
  _$jscoverage['/underscore.js'].branchData['1132'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1134'] = [];
  _$jscoverage['/underscore.js'].branchData['1134'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1134'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1145'] = [];
  _$jscoverage['/underscore.js'].branchData['1145'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1145'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1145'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1145'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1147'] = [];
  _$jscoverage['/underscore.js'].branchData['1147'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1147'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1147'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1147'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1149'] = [];
  _$jscoverage['/underscore.js'].branchData['1149'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1149'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1152'] = [];
  _$jscoverage['/underscore.js'].branchData['1152'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1152'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1152'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1152'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1152'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1159'] = [];
  _$jscoverage['/underscore.js'].branchData['1159'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1160'] = [];
  _$jscoverage['/underscore.js'].branchData['1160'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1163'] = [];
  _$jscoverage['/underscore.js'].branchData['1163'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1171'] = [];
  _$jscoverage['/underscore.js'].branchData['1171'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1175'] = [];
  _$jscoverage['/underscore.js'].branchData['1175'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1175'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1177'] = [];
  _$jscoverage['/underscore.js'].branchData['1177'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1177'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1177'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1183'] = [];
  _$jscoverage['/underscore.js'].branchData['1183'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1186'] = [];
  _$jscoverage['/underscore.js'].branchData['1186'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1187'] = [];
  _$jscoverage['/underscore.js'].branchData['1187'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1188'] = [];
  _$jscoverage['/underscore.js'].branchData['1188'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1188'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1188'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1193'] = [];
  _$jscoverage['/underscore.js'].branchData['1193'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1193'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1193'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1193'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1193'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1194'] = [];
  _$jscoverage['/underscore.js'].branchData['1194'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1195'] = [];
  _$jscoverage['/underscore.js'].branchData['1195'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1204'] = [];
  _$jscoverage['/underscore.js'].branchData['1204'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1205'] = [];
  _$jscoverage['/underscore.js'].branchData['1205'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1207'] = [];
  _$jscoverage['/underscore.js'].branchData['1207'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1210'] = [];
  _$jscoverage['/underscore.js'].branchData['1210'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1210'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1218'] = [];
  _$jscoverage['/underscore.js'].branchData['1218'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1221'] = [];
  _$jscoverage['/underscore.js'].branchData['1221'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1223'] = [];
  _$jscoverage['/underscore.js'].branchData['1223'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1224'] = [];
  _$jscoverage['/underscore.js'].branchData['1224'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1231'] = [];
  _$jscoverage['/underscore.js'].branchData['1231'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1232'] = [];
  _$jscoverage['/underscore.js'].branchData['1232'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1235'] = [];
  _$jscoverage['/underscore.js'].branchData['1235'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1235'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1252'] = [];
  _$jscoverage['/underscore.js'].branchData['1252'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1253'] = [];
  _$jscoverage['/underscore.js'].branchData['1253'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1253'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1253'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1253'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1254'] = [];
  _$jscoverage['/underscore.js'].branchData['1254'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1259'] = [];
  _$jscoverage['/underscore.js'].branchData['1259'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1259'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1264'] = [];
  _$jscoverage['/underscore.js'].branchData['1264'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1265'] = [];
  _$jscoverage['/underscore.js'].branchData['1265'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1271'] = [];
  _$jscoverage['/underscore.js'].branchData['1271'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1271'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1271'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1271'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1277'] = [];
  _$jscoverage['/underscore.js'].branchData['1277'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1283'] = [];
  _$jscoverage['/underscore.js'].branchData['1283'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1291'] = [];
  _$jscoverage['/underscore.js'].branchData['1291'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1292'] = [];
  _$jscoverage['/underscore.js'].branchData['1292'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1292'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1292'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1292'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1292'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1294'] = [];
  _$jscoverage['/underscore.js'].branchData['1294'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1294'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1300'] = [];
  _$jscoverage['/underscore.js'].branchData['1300'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1305'] = [];
  _$jscoverage['/underscore.js'].branchData['1305'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1310'] = [];
  _$jscoverage['/underscore.js'].branchData['1310'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1310'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1310'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1310'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1310'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1315'] = [];
  _$jscoverage['/underscore.js'].branchData['1315'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1320'] = [];
  _$jscoverage['/underscore.js'].branchData['1320'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1326'] = [];
  _$jscoverage['/underscore.js'].branchData['1326'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1326'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1357'] = [];
  _$jscoverage['/underscore.js'].branchData['1357'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1375'] = [];
  _$jscoverage['/underscore.js'].branchData['1375'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1381'] = [];
  _$jscoverage['/underscore.js'].branchData['1381'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1389'] = [];
  _$jscoverage['/underscore.js'].branchData['1389'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1414'] = [];
  _$jscoverage['/underscore.js'].branchData['1414'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1415'] = [];
  _$jscoverage['/underscore.js'].branchData['1415'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1424'] = [];
  _$jscoverage['/underscore.js'].branchData['1424'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1425'] = [];
  _$jscoverage['/underscore.js'].branchData['1425'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1428'] = [];
  _$jscoverage['/underscore.js'].branchData['1428'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1436'] = [];
  _$jscoverage['/underscore.js'].branchData['1436'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1474'] = [];
  _$jscoverage['/underscore.js'].branchData['1474'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1479'] = [];
  _$jscoverage['/underscore.js'].branchData['1479'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1480'] = [];
  _$jscoverage['/underscore.js'].branchData['1480'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1481'] = [];
  _$jscoverage['/underscore.js'].branchData['1481'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1491'] = [];
  _$jscoverage['/underscore.js'].branchData['1491'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1493'] = [];
  _$jscoverage['/underscore.js'].branchData['1493'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1495'] = [];
  _$jscoverage['/underscore.js'].branchData['1495'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1505'] = [];
  _$jscoverage['/underscore.js'].branchData['1505'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1513'] = [];
  _$jscoverage['/underscore.js'].branchData['1513'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1524'] = [];
  _$jscoverage['/underscore.js'].branchData['1524'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1545'] = [];
  _$jscoverage['/underscore.js'].branchData['1545'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1569'] = [];
  _$jscoverage['/underscore.js'].branchData['1569'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1569'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1569'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1569'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1569'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1602'] = [];
  _$jscoverage['/underscore.js'].branchData['1602'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1602'][2] = new BranchData();
}
_$jscoverage['/underscore.js'].branchData['1602'][2].init(54646, 28, 'typeof define === \'function\'');
function visit375_1602_2(result) {
  _$jscoverage['/underscore.js'].branchData['1602'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1602'][1].init(54646, 42, 'typeof define === \'function\' && define.amd');
function visit374_1602_1(result) {
  _$jscoverage['/underscore.js'].branchData['1602'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1569'][5].init(121, 16, 'obj.length === 0');
function visit373_1569_5(result) {
  _$jscoverage['/underscore.js'].branchData['1569'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1569'][4].init(99, 17, 'name === \'splice\'');
function visit372_1569_4(result) {
  _$jscoverage['/underscore.js'].branchData['1569'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1569'][3].init(79, 16, 'name === \'shift\'');
function visit371_1569_3(result) {
  _$jscoverage['/underscore.js'].branchData['1569'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1569'][2].init(79, 37, 'name === \'shift\' || name === \'splice\'');
function visit370_1569_2(result) {
  _$jscoverage['/underscore.js'].branchData['1569'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1569'][1].init(79, 58, '(name === \'shift\' || name === \'splice\') && obj.length === 0');
function visit369_1569_1(result) {
  _$jscoverage['/underscore.js'].branchData['1569'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1545'][1].init(12, 15, 'instance._chain');
function visit368_1545_1(result) {
  _$jscoverage['/underscore.js'].branchData['1545'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1524'][1].init(1755, 26, 'settings.variable || \'obj\'');
function visit367_1524_1(result) {
  _$jscoverage['/underscore.js'].branchData['1524'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1513'][1].init(29, 26, 'settings.variable || \'obj\'');
function visit366_1513_1(result) {
  _$jscoverage['/underscore.js'].branchData['1513'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1505'][1].init(1200, 18, '!settings.variable');
function visit365_1505_1(result) {
  _$jscoverage['/underscore.js'].branchData['1505'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1495'][1].init(336, 8, 'evaluate');
function visit364_1495_1(result) {
  _$jscoverage['/underscore.js'].branchData['1495'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1493'][1].init(231, 11, 'interpolate');
function visit363_1493_1(result) {
  _$jscoverage['/underscore.js'].branchData['1493'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1491'][1].init(126, 6, 'escape');
function visit362_1491_1(result) {
  _$jscoverage['/underscore.js'].branchData['1491'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1481'][1].init(99, 28, 'settings.evaluate || noMatch');
function visit361_1481_1(result) {
  _$jscoverage['/underscore.js'].branchData['1481'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1480'][1].init(51, 31, 'settings.interpolate || noMatch');
function visit360_1480_1(result) {
  _$jscoverage['/underscore.js'].branchData['1480'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1479'][1].init(8, 26, 'settings.escape || noMatch');
function visit359_1479_1(result) {
  _$jscoverage['/underscore.js'].branchData['1479'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1474'][1].init(9, 24, '!settings && oldSettings');
function visit358_1474_1(result) {
  _$jscoverage['/underscore.js'].branchData['1474'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1436'][1].init(43, 6, 'prefix');
function visit357_1436_1(result) {
  _$jscoverage['/underscore.js'].branchData['1436'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1428'][1].init(126, 19, '_.isFunction(value)');
function visit356_1428_1(result) {
  _$jscoverage['/underscore.js'].branchData['1428'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1425'][1].init(65, 16, 'value === void 0');
function visit355_1425_1(result) {
  _$jscoverage['/underscore.js'].branchData['1425'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1424'][1].init(17, 14, 'object == null');
function visit354_1424_1(result) {
  _$jscoverage['/underscore.js'].branchData['1424'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1415'][1].init(64, 23, 'testRegexp.test(string)');
function visit353_1415_1(result) {
  _$jscoverage['/underscore.js'].branchData['1415'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1414'][1].init(16, 14, 'string == null');
function visit352_1414_1(result) {
  _$jscoverage['/underscore.js'].branchData['1414'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1389'][1].init(47458, 61, 'Date.now || function() {\n  return new Date().getTime();\n}');
function visit351_1389_1(result) {
  _$jscoverage['/underscore.js'].branchData['1389'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1381'][1].init(9, 11, 'max == null');
function visit350_1381_1(result) {
  _$jscoverage['/underscore.js'].branchData['1381'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1375'][1].init(109, 5, 'i < n');
function visit349_1375_1(result) {
  _$jscoverage['/underscore.js'].branchData['1375'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1357'][1].init(12, 11, 'obj == null');
function visit348_1357_1(result) {
  _$jscoverage['/underscore.js'].branchData['1357'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1326'][2].init(12, 11, 'obj != null');
function visit347_1326_2(result) {
  _$jscoverage['/underscore.js'].branchData['1326'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1326'][1].init(12, 44, 'obj != null && hasOwnProperty.call(obj, key)');
function visit346_1326_1(result) {
  _$jscoverage['/underscore.js'].branchData['1326'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1320'][1].init(12, 14, 'obj === void 0');
function visit345_1320_1(result) {
  _$jscoverage['/underscore.js'].branchData['1320'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1315'][1].init(12, 12, 'obj === null');
function visit344_1315_1(result) {
  _$jscoverage['/underscore.js'].branchData['1315'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1310'][5].init(45, 41, 'toString.call(obj) === \'[object Boolean]\'');
function visit343_1310_5(result) {
  _$jscoverage['/underscore.js'].branchData['1310'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1310'][4].init(28, 13, 'obj === false');
function visit342_1310_4(result) {
  _$jscoverage['/underscore.js'].branchData['1310'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1310'][3].init(28, 58, 'obj === false || toString.call(obj) === \'[object Boolean]\'');
function visit341_1310_3(result) {
  _$jscoverage['/underscore.js'].branchData['1310'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1310'][2].init(12, 12, 'obj === true');
function visit340_1310_2(result) {
  _$jscoverage['/underscore.js'].branchData['1310'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1310'][1].init(12, 74, 'obj === true || obj === false || toString.call(obj) === \'[object Boolean]\'');
function visit339_1310_1(result) {
  _$jscoverage['/underscore.js'].branchData['1310'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1305'][1].init(12, 29, '_.isNumber(obj) && isNaN(obj)');
function visit338_1305_1(result) {
  _$jscoverage['/underscore.js'].branchData['1305'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1300'][1].init(12, 40, 'isFinite(obj) && !isNaN(parseFloat(obj))');
function visit337_1300_1(result) {
  _$jscoverage['/underscore.js'].branchData['1300'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1294'][2].init(14, 24, 'typeof obj == \'function\'');
function visit336_1294_2(result) {
  _$jscoverage['/underscore.js'].branchData['1294'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1294'][1].init(14, 33, 'typeof obj == \'function\' || false');
function visit335_1294_1(result) {
  _$jscoverage['/underscore.js'].branchData['1294'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1292'][5].init(44886, 29, 'typeof nodelist != \'function\'');
function visit334_1292_5(result) {
  _$jscoverage['/underscore.js'].branchData['1292'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1292'][4].init(44854, 28, 'typeof Int8Array != \'object\'');
function visit333_1292_4(result) {
  _$jscoverage['/underscore.js'].branchData['1292'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1292'][3].init(44854, 61, 'typeof Int8Array != \'object\' && typeof nodelist != \'function\'');
function visit332_1292_3(result) {
  _$jscoverage['/underscore.js'].branchData['1292'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1292'][2].init(44826, 24, 'typeof /./ != \'function\'');
function visit331_1292_2(result) {
  _$jscoverage['/underscore.js'].branchData['1292'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1292'][1].init(44826, 89, 'typeof /./ != \'function\' && typeof Int8Array != \'object\' && typeof nodelist != \'function\'');
function visit330_1292_1(result) {
  _$jscoverage['/underscore.js'].branchData['1292'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1291'][1].init(44777, 41, 'root.document && root.document.childNodes');
function visit329_1291_1(result) {
  _$jscoverage['/underscore.js'].branchData['1291'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1283'][1].init(44504, 25, '!_.isArguments(arguments)');
function visit328_1283_1(result) {
  _$jscoverage['/underscore.js'].branchData['1283'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1277'][1].init(14, 46, 'toString.call(obj) === \'[object \' + name + \']\'');
function visit327_1277_1(result) {
  _$jscoverage['/underscore.js'].branchData['1277'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1271'][4].init(62, 17, 'type === \'object\'');
function visit326_1271_4(result) {
  _$jscoverage['/underscore.js'].branchData['1271'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1271'][3].init(62, 26, 'type === \'object\' && !!obj');
function visit325_1271_3(result) {
  _$jscoverage['/underscore.js'].branchData['1271'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1271'][2].init(39, 19, 'type === \'function\'');
function visit324_1271_2(result) {
  _$jscoverage['/underscore.js'].branchData['1271'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1271'][1].init(39, 49, 'type === \'function\' || type === \'object\' && !!obj');
function visit323_1271_1(result) {
  _$jscoverage['/underscore.js'].branchData['1271'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1265'][1].init(12, 39, 'toString.call(obj) === \'[object Array]\'');
function visit322_1265_1(result) {
  _$jscoverage['/underscore.js'].branchData['1265'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1264'][1].init(43801, 88, 'nativeIsArray || function(obj) {\n  return toString.call(obj) === \'[object Array]\';\n}');
function visit321_1264_1(result) {
  _$jscoverage['/underscore.js'].branchData['1264'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1259'][2].init(22, 18, 'obj.nodeType === 1');
function visit320_1259_2(result) {
  _$jscoverage['/underscore.js'].branchData['1259'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1259'][1].init(15, 25, 'obj && obj.nodeType === 1');
function visit319_1259_1(result) {
  _$jscoverage['/underscore.js'].branchData['1259'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1254'][1].init(158, 24, '_.keys(obj).length === 0');
function visit318_1254_1(result) {
  _$jscoverage['/underscore.js'].branchData['1254'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1253'][4].init(129, 16, 'obj.length === 0');
function visit317_1253_4(result) {
  _$jscoverage['/underscore.js'].branchData['1253'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1253'][3].init(82, 37, '_.isString(obj) || _.isArguments(obj)');
function visit316_1253_3(result) {
  _$jscoverage['/underscore.js'].branchData['1253'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1253'][2].init(64, 55, '_.isArray(obj) || _.isString(obj) || _.isArguments(obj)');
function visit315_1253_2(result) {
  _$jscoverage['/underscore.js'].branchData['1253'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1253'][1].init(43, 77, 'isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))');
function visit314_1253_1(result) {
  _$jscoverage['/underscore.js'].branchData['1253'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1252'][1].init(9, 11, 'obj == null');
function visit313_1252_1(result) {
  _$jscoverage['/underscore.js'].branchData['1252'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1235'][2].init(79, 51, '_.has(b, key) && eq(a[key], b[key], aStack, bStack)');
function visit312_1235_2(result) {
  _$jscoverage['/underscore.js'].branchData['1235'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1235'][1].init(77, 54, '!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))');
function visit311_1235_1(result) {
  _$jscoverage['/underscore.js'].branchData['1235'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1232'][1].init(263, 8, 'length--');
function visit310_1232_1(result) {
  _$jscoverage['/underscore.js'].branchData['1232'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1231'][1].init(207, 27, '_.keys(b).length !== length');
function visit309_1231_1(result) {
  _$jscoverage['/underscore.js'].branchData['1231'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1224'][1].init(13, 41, '!eq(a[length], b[length], aStack, bStack)');
function visit308_1224_1(result) {
  _$jscoverage['/underscore.js'].branchData['1224'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1223'][1].init(232, 8, 'length--');
function visit307_1223_1(result) {
  _$jscoverage['/underscore.js'].branchData['1223'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1221'][1].init(115, 19, 'length !== b.length');
function visit306_1221_1(result) {
  _$jscoverage['/underscore.js'].branchData['1221'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1218'][1].init(2632, 9, 'areArrays');
function visit305_1218_1(result) {
  _$jscoverage['/underscore.js'].branchData['1218'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1210'][2].init(154, 20, 'bStack[length] === b');
function visit304_1210_2(result) {
  _$jscoverage['/underscore.js'].branchData['1210'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1210'][1].init(125, 20, 'aStack[length] === a');
function visit303_1210_1(result) {
  _$jscoverage['/underscore.js'].branchData['1210'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1207'][1].init(2279, 8, 'length--');
function visit302_1207_1(result) {
  _$jscoverage['/underscore.js'].branchData['1207'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1205'][1].init(2222, 12, 'bStack || []');
function visit301_1205_1(result) {
  _$jscoverage['/underscore.js'].branchData['1205'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1204'][1].init(2195, 12, 'aStack || []');
function visit300_1204_1(result) {
  _$jscoverage['/underscore.js'].branchData['1204'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1195'][1].init(158, 40, '\'constructor\' in a && \'constructor\' in b');
function visit299_1195_1(result) {
  _$jscoverage['/underscore.js'].branchData['1195'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1194'][1].init(56, 45, '_.isFunction(bCtor) && bCtor instanceof bCtor');
function visit298_1194_1(result) {
  _$jscoverage['/underscore.js'].branchData['1194'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1193'][5].init(309, 102, 'aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor');
function visit297_1193_5(result) {
  _$jscoverage['/underscore.js'].branchData['1193'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1193'][4].init(286, 125, '_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor');
function visit296_1193_4(result) {
  _$jscoverage['/underscore.js'].branchData['1193'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1193'][3].init(284, 200, '!(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor) && (\'constructor\' in a && \'constructor\' in b)');
function visit295_1193_3(result) {
  _$jscoverage['/underscore.js'].branchData['1193'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1193'][2].init(265, 15, 'aCtor !== bCtor');
function visit294_1193_2(result) {
  _$jscoverage['/underscore.js'].branchData['1193'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1193'][1].init(265, 219, 'aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor) && (\'constructor\' in a && \'constructor\' in b)');
function visit293_1193_1(result) {
  _$jscoverage['/underscore.js'].branchData['1193'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1188'][3].init(35, 20, 'typeof b != \'object\'');
function visit292_1188_3(result) {
  _$jscoverage['/underscore.js'].branchData['1188'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1188'][2].init(11, 20, 'typeof a != \'object\'');
function visit291_1188_2(result) {
  _$jscoverage['/underscore.js'].branchData['1188'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1188'][1].init(11, 44, 'typeof a != \'object\' || typeof b != \'object\'');
function visit290_1188_1(result) {
  _$jscoverage['/underscore.js'].branchData['1188'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1187'][1].init(1351, 10, '!areArrays');
function visit289_1187_1(result) {
  _$jscoverage['/underscore.js'].branchData['1187'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1186'][1].init(1311, 30, 'className === \'[object Array]\'');
function visit288_1186_1(result) {
  _$jscoverage['/underscore.js'].branchData['1186'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1183'][1].init(270, 9, '+a === +b');
function visit287_1183_1(result) {
  _$jscoverage['/underscore.js'].branchData['1183'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1177'][3].init(277, 9, '+a === +b');
function visit286_1177_3(result) {
  _$jscoverage['/underscore.js'].branchData['1177'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1177'][2].init(258, 16, '1 / +a === 1 / b');
function visit285_1177_2(result) {
  _$jscoverage['/underscore.js'].branchData['1177'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1177'][1].init(247, 8, '+a === 0');
function visit284_1177_1(result) {
  _$jscoverage['/underscore.js'].branchData['1177'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1175'][2].init(150, 9, '+b !== +b');
function visit283_1175_2(result) {
  _$jscoverage['/underscore.js'].branchData['1175'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1175'][1].init(132, 9, '+a !== +a');
function visit282_1175_1(result) {
  _$jscoverage['/underscore.js'].branchData['1175'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1171'][1].init(175, 17, '\'\' + a === \'\' + b');
function visit281_1171_1(result) {
  _$jscoverage['/underscore.js'].branchData['1171'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1163'][1].init(196, 30, 'className !== toString.call(b)');
function visit280_1163_1(result) {
  _$jscoverage['/underscore.js'].branchData['1163'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1160'][1].init(84, 14, 'b instanceof _');
function visit279_1160_1(result) {
  _$jscoverage['/underscore.js'].branchData['1160'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1159'][1].init(44, 14, 'a instanceof _');
function visit278_1159_1(result) {
  _$jscoverage['/underscore.js'].branchData['1159'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1152'][5].init(531, 21, 'typeof b !== \'object\'');
function visit277_1152_5(result) {
  _$jscoverage['/underscore.js'].branchData['1152'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1152'][4].init(510, 17, 'type !== \'object\'');
function visit276_1152_4(result) {
  _$jscoverage['/underscore.js'].branchData['1152'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1152'][3].init(510, 42, 'type !== \'object\' && typeof b !== \'object\'');
function visit275_1152_3(result) {
  _$jscoverage['/underscore.js'].branchData['1152'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1152'][2].init(487, 19, 'type !== \'function\'');
function visit274_1152_2(result) {
  _$jscoverage['/underscore.js'].branchData['1152'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1152'][1].init(487, 65, 'type !== \'function\' && type !== \'object\' && typeof b !== \'object\'');
function visit273_1152_1(result) {
  _$jscoverage['/underscore.js'].branchData['1152'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1149'][2].init(413, 7, 'b !== b');
function visit272_1149_2(result) {
  _$jscoverage['/underscore.js'].branchData['1149'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1149'][1].init(397, 7, 'a !== a');
function visit271_1149_1(result) {
  _$jscoverage['/underscore.js'].branchData['1149'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1147'][4].init(331, 7, 'a === b');
function visit270_1147_4(result) {
  _$jscoverage['/underscore.js'].branchData['1147'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1147'][3].init(313, 9, 'b == null');
function visit269_1147_3(result) {
  _$jscoverage['/underscore.js'].branchData['1147'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1147'][2].init(300, 9, 'a == null');
function visit268_1147_2(result) {
  _$jscoverage['/underscore.js'].branchData['1147'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1147'][1].init(300, 22, 'a == null || b == null');
function visit267_1147_1(result) {
  _$jscoverage['/underscore.js'].branchData['1147'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1145'][4].init(206, 15, '1 / a === 1 / b');
function visit266_1145_4(result) {
  _$jscoverage['/underscore.js'].branchData['1145'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1145'][3].init(195, 7, 'a !== 0');
function visit265_1145_3(result) {
  _$jscoverage['/underscore.js'].branchData['1145'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1145'][2].init(195, 26, 'a !== 0 || 1 / a === 1 / b');
function visit264_1145_2(result) {
  _$jscoverage['/underscore.js'].branchData['1145'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1145'][1].init(179, 7, 'a === b');
function visit263_1145_1(result) {
  _$jscoverage['/underscore.js'].branchData['1145'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1134'][2].init(36, 23, 'attrs[key] !== obj[key]');
function visit262_1134_2(result) {
  _$jscoverage['/underscore.js'].branchData['1134'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1134'][1].init(36, 40, 'attrs[key] !== obj[key] || !(key in obj)');
function visit261_1134_1(result) {
  _$jscoverage['/underscore.js'].branchData['1134'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1132'][1].init(143, 10, 'i < length');
function visit260_1132_1(result) {
  _$jscoverage['/underscore.js'].branchData['1132'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1130'][1].init(61, 14, 'object == null');
function visit259_1130_1(result) {
  _$jscoverage['/underscore.js'].branchData['1130'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1116'][1].init(50, 14, '_.isArray(obj)');
function visit258_1116_1(result) {
  _$jscoverage['/underscore.js'].branchData['1116'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1115'][1].init(9, 16, '!_.isObject(obj)');
function visit257_1115_1(result) {
  _$jscoverage['/underscore.js'].branchData['1115'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1109'][1].init(49, 5, 'props');
function visit256_1109_1(result) {
  _$jscoverage['/underscore.js'].branchData['1109'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1091'][1].init(48, 15, 'keys.length > 1');
function visit255_1091_1(result) {
  _$jscoverage['/underscore.js'].branchData['1091'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1089'][1].init(46, 22, '_.isFunction(iteratee)');
function visit254_1089_1(result) {
  _$jscoverage['/underscore.js'].branchData['1089'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1081'][1].init(64, 25, 'iteratee(value, key, obj)');
function visit253_1081_1(result) {
  _$jscoverage['/underscore.js'].branchData['1081'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1078'][1].init(365, 10, 'i < length');
function visit252_1078_1(result) {
  _$jscoverage['/underscore.js'].branchData['1078'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1071'][1].init(11, 15, 'keys.length > 1');
function visit251_1071_1(result) {
  _$jscoverage['/underscore.js'].branchData['1071'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1070'][1].init(86, 22, '_.isFunction(iteratee)');
function visit250_1070_1(result) {
  _$jscoverage['/underscore.js'].branchData['1070'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1069'][1].init(50, 11, 'obj == null');
function visit249_1069_1(result) {
  _$jscoverage['/underscore.js'].branchData['1069'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1057'][1].init(32, 29, 'predicate(obj[key], key, obj)');
function visit248_1057_1(result) {
  _$jscoverage['/underscore.js'].branchData['1057'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1055'][1].init(116, 10, 'i < length');
function visit247_1055_1(result) {
  _$jscoverage['/underscore.js'].branchData['1055'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1037'][2].init(57, 19, 'obj[key] === void 0');
function visit246_1037_2(result) {
  _$jscoverage['/underscore.js'].branchData['1037'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1037'][1].init(44, 32, '!defaults || obj[key] === void 0');
function visit245_1037_1(result) {
  _$jscoverage['/underscore.js'].branchData['1037'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1035'][1].init(130, 5, 'i < l');
function visit244_1035_1(result) {
  _$jscoverage['/underscore.js'].branchData['1035'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1031'][1].init(152, 14, 'index < length');
function visit243_1031_1(result) {
  _$jscoverage['/underscore.js'].branchData['1031'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1030'][3].init(101, 11, 'obj == null');
function visit242_1030_3(result) {
  _$jscoverage['/underscore.js'].branchData['1030'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1030'][2].init(87, 10, 'length < 2');
function visit241_1030_2(result) {
  _$jscoverage['/underscore.js'].branchData['1030'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1030'][1].init(87, 25, 'length < 2 || obj == null');
function visit240_1030_1(result) {
  _$jscoverage['/underscore.js'].branchData['1030'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1029'][1].init(48, 8, 'defaults');
function visit239_1029_1(result) {
  _$jscoverage['/underscore.js'].branchData['1029'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1020'][1].init(11, 22, '_.isFunction(obj[key])');
function visit238_1020_1(result) {
  _$jscoverage['/underscore.js'].branchData['1020'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1009'][1].init(92, 10, 'i < length');
function visit237_1009_1(result) {
  _$jscoverage['/underscore.js'].branchData['1009'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['999'][1].init(110, 10, 'i < length');
function visit236_999_1(result) {
  _$jscoverage['/underscore.js'].branchData['999'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['987'][1].init(139, 14, 'index < length');
function visit235_987_1(result) {
  _$jscoverage['/underscore.js'].branchData['987'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['974'][1].init(111, 10, 'i < length');
function visit234_974_1(result) {
  _$jscoverage['/underscore.js'].branchData['974'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['965'][1].init(127, 10, 'hasEnumBug');
function visit233_965_1(result) {
  _$jscoverage['/underscore.js'].branchData['965'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['961'][1].init(9, 16, '!_.isObject(obj)');
function visit232_961_1(result) {
  _$jscoverage['/underscore.js'].branchData['961'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['955'][1].init(192, 10, 'hasEnumBug');
function visit231_955_1(result) {
  _$jscoverage['/underscore.js'].branchData['955'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['953'][1].init(130, 15, '_.has(obj, key)');
function visit230_953_1(result) {
  _$jscoverage['/underscore.js'].branchData['953'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['951'][1].init(46, 10, 'nativeKeys');
function visit229_951_1(result) {
  _$jscoverage['/underscore.js'].branchData['951'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['950'][1].init(9, 16, '!_.isObject(obj)');
function visit228_950_1(result) {
  _$jscoverage['/underscore.js'].branchData['950'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['941'][3].init(71, 25, 'obj[prop] !== proto[prop]');
function visit227_941_3(result) {
  _$jscoverage['/underscore.js'].branchData['941'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['941'][2].init(71, 52, 'obj[prop] !== proto[prop] && !_.contains(keys, prop)');
function visit226_941_2(result) {
  _$jscoverage['/underscore.js'].branchData['941'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['941'][1].init(56, 67, 'prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)');
function visit225_941_1(result) {
  _$jscoverage['/underscore.js'].branchData['941'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['939'][1].init(319, 12, 'nonEnumIdx--');
function visit224_939_1(result) {
  _$jscoverage['/underscore.js'].branchData['939'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['937'][1].init(245, 43, '_.has(obj, prop) && !_.contains(keys, prop)');
function visit223_937_1(result) {
  _$jscoverage['/underscore.js'].branchData['937'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['933'][2].init(104, 50, '_.isFunction(constructor) && constructor.prototype');
function visit222_933_2(result) {
  _$jscoverage['/underscore.js'].branchData['933'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['933'][1].init(104, 62, '_.isFunction(constructor) && constructor.prototype || ObjProto');
function visit221_933_1(result) {
  _$jscoverage['/underscore.js'].branchData['933'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['911'][1].init(88, 10, 'times <= 1');
function visit220_911_1(result) {
  _$jscoverage['/underscore.js'].branchData['911'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['908'][1].init(11, 11, '--times > 0');
function visit219_908_1(result) {
  _$jscoverage['/underscore.js'].branchData['908'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['898'][1].init(11, 11, '--times < 1');
function visit218_898_1(result) {
  _$jscoverage['/underscore.js'].branchData['898'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['890'][1].init(90, 3, 'i--');
function visit217_890_1(result) {
  _$jscoverage['/underscore.js'].branchData['890'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['859'][1].init(182, 7, 'callNow');
function visit216_859_1(result) {
  _$jscoverage['/underscore.js'].branchData['859'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['858'][1].init(127, 8, '!timeout');
function visit215_858_1(result) {
  _$jscoverage['/underscore.js'].branchData['858'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['857'][1].init(94, 21, 'immediate && !timeout');
function visit214_857_1(result) {
  _$jscoverage['/underscore.js'].branchData['857'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['848'][1].init(61, 8, '!timeout');
function visit213_848_1(result) {
  _$jscoverage['/underscore.js'].branchData['848'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['846'][1].init(37, 10, '!immediate');
function visit212_846_1(result) {
  _$jscoverage['/underscore.js'].branchData['846'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['842'][3].init(65, 9, 'last >= 0');
function visit211_842_3(result) {
  _$jscoverage['/underscore.js'].branchData['842'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['842'][2].init(50, 11, 'last < wait');
function visit210_842_2(result) {
  _$jscoverage['/underscore.js'].branchData['842'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['842'][1].init(50, 24, 'last < wait && last >= 0');
function visit209_842_1(result) {
  _$jscoverage['/underscore.js'].branchData['842'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['825'][2].init(468, 26, 'options.trailing !== false');
function visit208_825_2(result) {
  _$jscoverage['/underscore.js'].branchData['825'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['825'][1].init(456, 38, '!timeout && options.trailing !== false');
function visit207_825_1(result) {
  _$jscoverage['/underscore.js'].branchData['825'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['824'][1].init(173, 8, '!timeout');
function visit206_824_1(result) {
  _$jscoverage['/underscore.js'].branchData['824'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['818'][1].init(13, 7, 'timeout');
function visit205_818_1(result) {
  _$jscoverage['/underscore.js'].branchData['818'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['817'][3].init(213, 16, 'remaining > wait');
function visit204_817_3(result) {
  _$jscoverage['/underscore.js'].branchData['817'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['817'][2].init(195, 14, 'remaining <= 0');
function visit203_817_2(result) {
  _$jscoverage['/underscore.js'].branchData['817'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['817'][1].init(195, 34, 'remaining <= 0 || remaining > wait');
function visit202_817_1(result) {
  _$jscoverage['/underscore.js'].branchData['817'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['813'][2].init(49, 25, 'options.leading === false');
function visit201_813_2(result) {
  _$jscoverage['/underscore.js'].branchData['813'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['813'][1].init(36, 38, '!previous && options.leading === false');
function visit200_813_1(result) {
  _$jscoverage['/underscore.js'].branchData['813'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['809'][1].init(133, 8, '!timeout');
function visit199_809_1(result) {
  _$jscoverage['/underscore.js'].branchData['809'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['806'][1].init(18, 25, 'options.leading === false');
function visit198_806_1(result) {
  _$jscoverage['/underscore.js'].branchData['806'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['804'][1].init(86, 8, '!options');
function visit197_804_1(result) {
  _$jscoverage['/underscore.js'].branchData['804'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['776'][1].init(117, 22, '!_.has(cache, address)');
function visit196_776_1(result) {
  _$jscoverage['/underscore.js'].branchData['776'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['775'][1].init(60, 6, 'hasher');
function visit195_775_1(result) {
  _$jscoverage['/underscore.js'].branchData['775'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['765'][1].init(158, 7, 'index--');
function visit194_765_1(result) {
  _$jscoverage['/underscore.js'].branchData['765'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['764'][1].init(78, 9, 'index < 1');
function visit193_764_1(result) {
  _$jscoverage['/underscore.js'].branchData['764'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['750'][1].init(233, 27, 'position < arguments.length');
function visit192_750_1(result) {
  _$jscoverage['/underscore.js'].branchData['750'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['748'][1].init(19, 28, 'boundArgs[i] === placeholder');
function visit191_748_1(result) {
  _$jscoverage['/underscore.js'].branchData['748'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['747'][1].init(106, 10, 'i < length');
function visit190_747_1(result) {
  _$jscoverage['/underscore.js'].branchData['747'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['731'][1].init(9, 19, '!_.isFunction(func)');
function visit189_731_1(result) {
  _$jscoverage['/underscore.js'].branchData['731'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['723'][1].init(193, 18, '_.isObject(result)');
function visit188_723_1(result) {
  _$jscoverage['/underscore.js'].branchData['723'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['720'][1].init(9, 38, '!(callingContext instanceof boundFunc)');
function visit187_720_1(result) {
  _$jscoverage['/underscore.js'].branchData['720'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['708'][1].init(119, 10, 'i < length');
function visit186_708_1(result) {
  _$jscoverage['/underscore.js'].branchData['708'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['704'][3].init(26, 9, 'count < 1');
function visit185_704_3(result) {
  _$jscoverage['/underscore.js'].branchData['704'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['704'][2].init(9, 13, 'count == null');
function visit184_704_2(result) {
  _$jscoverage['/underscore.js'].branchData['704'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['704'][1].init(9, 26, 'count == null || count < 1');
function visit183_704_1(result) {
  _$jscoverage['/underscore.js'].branchData['704'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['694'][1].init(214, 12, 'idx < length');
function visit182_694_1(result) {
  _$jscoverage['/underscore.js'].branchData['694'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['689'][1].init(84, 9, 'step || 1');
function visit181_689_1(result) {
  _$jscoverage['/underscore.js'].branchData['689'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['686'][1].init(14, 10, 'start || 0');
function visit180_686_1(result) {
  _$jscoverage['/underscore.js'].branchData['686'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['685'][1].init(9, 12, 'stop == null');
function visit179_685_1(result) {
  _$jscoverage['/underscore.js'].branchData['685'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['668'][1].init(13, 19, 'array[idx] === item');
function visit178_668_1(result) {
  _$jscoverage['/underscore.js'].branchData['668'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['667'][4].init(607, 12, 'idx < length');
function visit177_667_4(result) {
  _$jscoverage['/underscore.js'].branchData['667'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['667'][3].init(595, 8, 'idx >= 0');
function visit176_667_3(result) {
  _$jscoverage['/underscore.js'].branchData['667'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['667'][2].init(595, 24, 'idx >= 0 && idx < length');
function visit175_667_2(result) {
  _$jscoverage['/underscore.js'].branchData['667'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['667'][1].init(569, 7, 'dir > 0');
function visit174_667_1(result) {
  _$jscoverage['/underscore.js'].branchData['667'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['665'][1].init(84, 8, 'idx >= 0');
function visit173_665_1(result) {
  _$jscoverage['/underscore.js'].branchData['665'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['663'][1].init(419, 13, 'item !== item');
function visit172_663_1(result) {
  _$jscoverage['/underscore.js'].branchData['663'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['661'][1].init(56, 19, 'array[idx] === item');
function visit171_661_1(result) {
  _$jscoverage['/underscore.js'].branchData['661'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['659'][2].init(298, 13, 'idx && length');
function visit170_659_2(result) {
  _$jscoverage['/underscore.js'].branchData['659'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['659'][1].init(283, 28, 'sortedIndex && idx && length');
function visit169_659_1(result) {
  _$jscoverage['/underscore.js'].branchData['659'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['657'][1].init(20, 8, 'idx >= 0');
function visit168_657_1(result) {
  _$jscoverage['/underscore.js'].branchData['657'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['655'][1].init(15, 8, 'idx >= 0');
function visit167_655_1(result) {
  _$jscoverage['/underscore.js'].branchData['655'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['654'][1].init(13, 7, 'dir > 0');
function visit166_654_1(result) {
  _$jscoverage['/underscore.js'].branchData['654'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['653'][1].init(55, 22, 'typeof idx == \'number\'');
function visit165_653_1(result) {
  _$jscoverage['/underscore.js'].branchData['653'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['644'][1].init(57, 28, 'iteratee(array[mid]) < value');
function visit164_644_1(result) {
  _$jscoverage['/underscore.js'].branchData['644'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['642'][1].init(126, 10, 'low < high');
function visit163_642_1(result) {
  _$jscoverage['/underscore.js'].branchData['642'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['626'][1].init(13, 37, 'predicate(array[index], index, array)');
function visit162_626_1(result) {
  _$jscoverage['/underscore.js'].branchData['626'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['625'][3].init(151, 14, 'index < length');
function visit161_625_3(result) {
  _$jscoverage['/underscore.js'].branchData['625'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['625'][2].init(137, 10, 'index >= 0');
function visit160_625_2(result) {
  _$jscoverage['/underscore.js'].branchData['625'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['625'][1].init(137, 28, 'index >= 0 && index < length');
function visit159_625_1(result) {
  _$jscoverage['/underscore.js'].branchData['625'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['624'][1].init(98, 7, 'dir > 0');
function visit158_624_1(result) {
  _$jscoverage['/underscore.js'].branchData['624'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['610'][1].init(11, 6, 'values');
function visit157_610_1(result) {
  _$jscoverage['/underscore.js'].branchData['610'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['609'][1].init(68, 10, 'i < length');
function visit156_609_1(result) {
  _$jscoverage['/underscore.js'].branchData['609'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['594'][1].init(121, 14, 'index < length');
function visit155_594_1(result) {
  _$jscoverage['/underscore.js'].branchData['594'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['591'][2].init(18, 39, 'array && _.max(array, getLength).length');
function visit154_591_2(result) {
  _$jscoverage['/underscore.js'].branchData['591'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['591'][1].init(18, 44, 'array && _.max(array, getLength).length || 0');
function visit153_591_1(result) {
  _$jscoverage['/underscore.js'].branchData['591'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['574'][1].init(198, 16, 'j === argsLength');
function visit152_574_1(result) {
  _$jscoverage['/underscore.js'].branchData['574'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['572'][1].init(13, 31, '!_.contains(arguments[j], item)');
function visit151_572_1(result) {
  _$jscoverage['/underscore.js'].branchData['572'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['571'][1].init(105, 14, 'j < argsLength');
function visit150_571_1(result) {
  _$jscoverage['/underscore.js'].branchData['571'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['569'][1].init(38, 24, '_.contains(result, item)');
function visit149_569_1(result) {
  _$jscoverage['/underscore.js'].branchData['569'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['567'][1].init(108, 10, 'i < length');
function visit148_567_1(result) {
  _$jscoverage['/underscore.js'].branchData['567'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['549'][1].init(362, 26, '!_.contains(result, value)');
function visit147_549_1(result) {
  _$jscoverage['/underscore.js'].branchData['549'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['545'][1].init(13, 27, '!_.contains(seen, computed)');
function visit146_545_1(result) {
  _$jscoverage['/underscore.js'].branchData['545'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['544'][1].init(218, 8, 'iteratee');
function visit145_544_1(result) {
  _$jscoverage['/underscore.js'].branchData['544'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['542'][2].init(19, 17, 'seen !== computed');
function visit144_542_2(result) {
  _$jscoverage['/underscore.js'].branchData['542'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['542'][1].init(13, 23, '!i || seen !== computed');
function visit143_542_1(result) {
  _$jscoverage['/underscore.js'].branchData['542'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['541'][1].init(106, 8, 'isSorted');
function visit142_541_1(result) {
  _$jscoverage['/underscore.js'].branchData['541'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['540'][1].init(42, 8, 'iteratee');
function visit141_540_1(result) {
  _$jscoverage['/underscore.js'].branchData['540'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['538'][1].init(265, 10, 'i < length');
function visit140_538_1(result) {
  _$jscoverage['/underscore.js'].branchData['538'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['535'][1].init(126, 16, 'iteratee != null');
function visit139_535_1(result) {
  _$jscoverage['/underscore.js'].branchData['535'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['530'][1].init(9, 22, '!_.isBoolean(isSorted)');
function visit138_530_1(result) {
  _$jscoverage['/underscore.js'].branchData['530'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['509'][1].init(413, 7, '!strict');
function visit137_509_1(result) {
  _$jscoverage['/underscore.js'].branchData['509'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['504'][1].init(59, 7, 'j < len');
function visit136_504_1(result) {
  _$jscoverage['/underscore.js'].branchData['504'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['502'][1].init(74, 7, 'shallow');
function visit135_502_1(result) {
  _$jscoverage['/underscore.js'].branchData['502'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['500'][2].init(62, 40, '_.isArray(value) || _.isArguments(value)');
function visit134_500_2(result) {
  _$jscoverage['/underscore.js'].branchData['500'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['500'][1].init(39, 64, 'isArrayLike(value) && (_.isArray(value) || _.isArguments(value))');
function visit133_500_1(result) {
  _$jscoverage['/underscore.js'].branchData['500'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['498'][1].init(104, 10, 'i < length');
function visit132_498_1(result) {
  _$jscoverage['/underscore.js'].branchData['498'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['496'][1].init(14, 12, 'output || []');
function visit131_496_1(result) {
  _$jscoverage['/underscore.js'].branchData['496'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['486'][2].init(30, 9, 'n == null');
function visit130_486_2(result) {
  _$jscoverage['/underscore.js'].branchData['486'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['486'][1].init(30, 18, 'n == null || guard');
function visit129_486_1(result) {
  _$jscoverage['/underscore.js'].branchData['486'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['478'][2].init(47, 9, 'n == null');
function visit128_478_2(result) {
  _$jscoverage['/underscore.js'].branchData['478'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['478'][1].init(47, 18, 'n == null || guard');
function visit127_478_1(result) {
  _$jscoverage['/underscore.js'].branchData['478'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['477'][1].init(9, 13, 'array == null');
function visit126_477_1(result) {
  _$jscoverage['/underscore.js'].branchData['477'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['471'][2].init(61, 9, 'n == null');
function visit125_471_2(result) {
  _$jscoverage['/underscore.js'].branchData['471'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['471'][1].init(61, 18, 'n == null || guard');
function visit124_471_1(result) {
  _$jscoverage['/underscore.js'].branchData['471'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['463'][2].init(47, 9, 'n == null');
function visit123_463_2(result) {
  _$jscoverage['/underscore.js'].branchData['463'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['463'][1].init(47, 18, 'n == null || guard');
function visit122_463_1(result) {
  _$jscoverage['/underscore.js'].branchData['463'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['462'][1].init(9, 13, 'array == null');
function visit121_462_1(result) {
  _$jscoverage['/underscore.js'].branchData['462'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['452'][1].init(12, 4, 'pass');
function visit120_452_1(result) {
  _$jscoverage['/underscore.js'].branchData['452'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['446'][1].init(43, 16, 'isArrayLike(obj)');
function visit119_446_1(result) {
  _$jscoverage['/underscore.js'].branchData['446'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['445'][1].init(9, 11, 'obj == null');
function visit118_445_1(result) {
  _$jscoverage['/underscore.js'].branchData['445'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['439'][1].init(82, 16, 'isArrayLike(obj)');
function visit117_439_1(result) {
  _$jscoverage['/underscore.js'].branchData['439'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['438'][1].init(34, 14, '_.isArray(obj)');
function visit116_438_1(result) {
  _$jscoverage['/underscore.js'].branchData['438'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['437'][1].init(9, 4, '!obj');
function visit115_437_1(result) {
  _$jscoverage['/underscore.js'].branchData['437'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['432'][1].init(9, 18, '_.has(result, key)');
function visit114_432_1(result) {
  _$jscoverage['/underscore.js'].branchData['432'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['419'][1].init(9, 18, '_.has(result, key)');
function visit113_419_1(result) {
  _$jscoverage['/underscore.js'].branchData['419'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['406'][1].init(20, 9, 'partition');
function visit112_406_1(result) {
  _$jscoverage['/underscore.js'].branchData['406'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['397'][3].init(67, 12, 'b === void 0');
function visit111_397_3(result) {
  _$jscoverage['/underscore.js'].branchData['397'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['397'][2].init(58, 5, 'a < b');
function visit110_397_2(result) {
  _$jscoverage['/underscore.js'].branchData['397'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['397'][1].init(58, 21, 'a < b || b === void 0');
function visit109_397_1(result) {
  _$jscoverage['/underscore.js'].branchData['397'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['396'][3].init(22, 12, 'a === void 0');
function visit108_396_3(result) {
  _$jscoverage['/underscore.js'].branchData['396'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['396'][2].init(13, 5, 'a > b');
function visit107_396_2(result) {
  _$jscoverage['/underscore.js'].branchData['396'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['396'][1].init(13, 21, 'a > b || a === void 0');
function visit106_396_1(result) {
  _$jscoverage['/underscore.js'].branchData['396'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['395'][1].init(70, 7, 'a !== b');
function visit105_395_1(result) {
  _$jscoverage['/underscore.js'].branchData['395'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['373'][1].init(326, 9, 'index < n');
function visit104_373_1(result) {
  _$jscoverage['/underscore.js'].branchData['373'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['369'][1].init(148, 16, 'isArrayLike(obj)');
function visit103_369_1(result) {
  _$jscoverage['/underscore.js'].branchData['369'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['366'][1].init(11, 17, '!isArrayLike(obj)');
function visit102_366_1(result) {
  _$jscoverage['/underscore.js'].branchData['366'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['365'][2].init(9, 9, 'n == null');
function visit101_365_2(result) {
  _$jscoverage['/underscore.js'].branchData['365'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['365'][1].init(9, 18, 'n == null || guard');
function visit100_365_1(result) {
  _$jscoverage['/underscore.js'].branchData['365'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['346'][5].init(110, 19, 'result === Infinity');
function visit99_346_5(result) {
  _$jscoverage['/underscore.js'].branchData['346'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['346'][4].init(85, 21, 'computed === Infinity');
function visit98_346_4(result) {
  _$jscoverage['/underscore.js'].branchData['346'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['346'][3].init(85, 44, 'computed === Infinity && result === Infinity');
function visit97_346_3(result) {
  _$jscoverage['/underscore.js'].branchData['346'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['346'][2].init(58, 23, 'computed < lastComputed');
function visit96_346_2(result) {
  _$jscoverage['/underscore.js'].branchData['346'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['346'][1].init(58, 71, 'computed < lastComputed || computed === Infinity && result === Infinity');
function visit95_346_1(result) {
  _$jscoverage['/underscore.js'].branchData['346'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['338'][1].init(37, 14, 'value < result');
function visit94_338_1(result) {
  _$jscoverage['/underscore.js'].branchData['338'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['336'][1].init(96, 10, 'i < length');
function visit93_336_1(result) {
  _$jscoverage['/underscore.js'].branchData['336'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['335'][1].init(13, 16, 'isArrayLike(obj)');
function visit92_335_1(result) {
  _$jscoverage['/underscore.js'].branchData['335'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['334'][7].init(168, 11, 'obj != null');
function visit91_334_7(result) {
  _$jscoverage['/underscore.js'].branchData['334'][7].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['334'][6].init(138, 25, 'typeof obj[0] != \'object\'');
function visit90_334_6(result) {
  _$jscoverage['/underscore.js'].branchData['334'][6].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['334'][5].init(107, 27, 'typeof iteratee == \'number\'');
function visit89_334_5(result) {
  _$jscoverage['/underscore.js'].branchData['334'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['334'][4].init(107, 56, 'typeof iteratee == \'number\' && typeof obj[0] != \'object\'');
function visit88_334_4(result) {
  _$jscoverage['/underscore.js'].branchData['334'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['334'][3].init(107, 72, '(typeof iteratee == \'number\' && typeof obj[0] != \'object\') && obj != null');
function visit87_334_3(result) {
  _$jscoverage['/underscore.js'].branchData['334'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['334'][2].init(86, 16, 'iteratee == null');
function visit86_334_2(result) {
  _$jscoverage['/underscore.js'].branchData['334'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['334'][1].init(86, 93, 'iteratee == null || (typeof iteratee == \'number\' && typeof obj[0] != \'object\') && obj != null');
function visit85_334_1(result) {
  _$jscoverage['/underscore.js'].branchData['334'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['321'][5].init(111, 20, 'result === -Infinity');
function visit84_321_5(result) {
  _$jscoverage['/underscore.js'].branchData['321'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['321'][4].init(85, 22, 'computed === -Infinity');
function visit83_321_4(result) {
  _$jscoverage['/underscore.js'].branchData['321'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['321'][3].init(85, 46, 'computed === -Infinity && result === -Infinity');
function visit82_321_3(result) {
  _$jscoverage['/underscore.js'].branchData['321'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['321'][2].init(58, 23, 'computed > lastComputed');
function visit81_321_2(result) {
  _$jscoverage['/underscore.js'].branchData['321'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['321'][1].init(58, 73, 'computed > lastComputed || computed === -Infinity && result === -Infinity');
function visit80_321_1(result) {
  _$jscoverage['/underscore.js'].branchData['321'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['313'][1].init(37, 14, 'value > result');
function visit79_313_1(result) {
  _$jscoverage['/underscore.js'].branchData['313'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['311'][1].init(96, 10, 'i < length');
function visit78_311_1(result) {
  _$jscoverage['/underscore.js'].branchData['311'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['310'][1].init(13, 16, 'isArrayLike(obj)');
function visit77_310_1(result) {
  _$jscoverage['/underscore.js'].branchData['310'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['309'][7].init(170, 11, 'obj != null');
function visit76_309_7(result) {
  _$jscoverage['/underscore.js'].branchData['309'][7].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['309'][6].init(140, 25, 'typeof obj[0] != \'object\'');
function visit75_309_6(result) {
  _$jscoverage['/underscore.js'].branchData['309'][6].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['309'][5].init(109, 27, 'typeof iteratee == \'number\'');
function visit74_309_5(result) {
  _$jscoverage['/underscore.js'].branchData['309'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['309'][4].init(109, 56, 'typeof iteratee == \'number\' && typeof obj[0] != \'object\'');
function visit73_309_4(result) {
  _$jscoverage['/underscore.js'].branchData['309'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['309'][3].init(109, 72, '(typeof iteratee == \'number\' && typeof obj[0] != \'object\') && obj != null');
function visit72_309_3(result) {
  _$jscoverage['/underscore.js'].branchData['309'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['309'][2].init(88, 16, 'iteratee == null');
function visit71_309_2(result) {
  _$jscoverage['/underscore.js'].branchData['309'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['309'][1].init(88, 93, 'iteratee == null || (typeof iteratee == \'number\' && typeof obj[0] != \'object\') && obj != null');
function visit70_309_1(result) {
  _$jscoverage['/underscore.js'].branchData['309'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['284'][1].init(64, 12, 'func == null');
function visit69_284_1(result) {
  _$jscoverage['/underscore.js'].branchData['284'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['283'][1].init(18, 6, 'isFunc');
function visit68_283_1(result) {
  _$jscoverage['/underscore.js'].branchData['283'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['276'][1].init(122, 36, '_.indexOf(obj, item, fromIndex) >= 0');
function visit67_276_1(result) {
  _$jscoverage['/underscore.js'].branchData['276'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['275'][2].init(57, 28, 'typeof fromIndex != \'number\'');
function visit66_275_2(result) {
  _$jscoverage['/underscore.js'].branchData['275'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['275'][1].init(57, 37, 'typeof fromIndex != \'number\' || guard');
function visit65_275_1(result) {
  _$jscoverage['/underscore.js'].branchData['275'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['274'][1].init(9, 17, '!isArrayLike(obj)');
function visit64_274_1(result) {
  _$jscoverage['/underscore.js'].branchData['274'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['266'][1].init(62, 43, 'predicate(obj[currentKey], currentKey, obj)');
function visit63_266_1(result) {
  _$jscoverage['/underscore.js'].branchData['266'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['265'][1].init(24, 4, 'keys');
function visit62_265_1(result) {
  _$jscoverage['/underscore.js'].branchData['265'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['264'][1].init(153, 14, 'index < length');
function visit61_264_1(result) {
  _$jscoverage['/underscore.js'].branchData['264'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['263'][1].init(62, 11, 'keys || obj');
function visit60_263_1(result) {
  _$jscoverage['/underscore.js'].branchData['263'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['262'][1].init(56, 32, '!isArrayLike(obj) && _.keys(obj)');
function visit59_262_1(result) {
  _$jscoverage['/underscore.js'].branchData['262'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['253'][1].init(62, 44, '!predicate(obj[currentKey], currentKey, obj)');
function visit58_253_1(result) {
  _$jscoverage['/underscore.js'].branchData['253'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['252'][1].init(24, 4, 'keys');
function visit57_252_1(result) {
  _$jscoverage['/underscore.js'].branchData['252'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['251'][1].init(153, 14, 'index < length');
function visit56_251_1(result) {
  _$jscoverage['/underscore.js'].branchData['251'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['250'][1].init(62, 11, 'keys || obj');
function visit55_250_1(result) {
  _$jscoverage['/underscore.js'].branchData['250'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['249'][1].init(56, 32, '!isArrayLike(obj) && _.keys(obj)');
function visit54_249_1(result) {
  _$jscoverage['/underscore.js'].branchData['249'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['235'][1].init(11, 29, 'predicate(value, index, list)');
function visit53_235_1(result) {
  _$jscoverage['/underscore.js'].branchData['235'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['226'][3].init(185, 10, 'key !== -1');
function visit52_226_3(result) {
  _$jscoverage['/underscore.js'].branchData['226'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['226'][2].init(167, 14, 'key !== void 0');
function visit51_226_2(result) {
  _$jscoverage['/underscore.js'].branchData['226'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['226'][1].init(167, 28, 'key !== void 0 && key !== -1');
function visit50_226_1(result) {
  _$jscoverage['/underscore.js'].branchData['226'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['221'][1].init(22, 16, 'isArrayLike(obj)');
function visit49_221_1(result) {
  _$jscoverage['/underscore.js'].branchData['221'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['206'][1].init(21, 21, 'arguments.length >= 3');
function visit48_206_1(result) {
  _$jscoverage['/underscore.js'].branchData['206'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['199'][1].init(26, 4, 'keys');
function visit47_199_1(result) {
  _$jscoverage['/underscore.js'].branchData['199'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['198'][3].init(264, 14, 'index < length');
function visit46_198_3(result) {
  _$jscoverage['/underscore.js'].branchData['198'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['198'][2].init(250, 10, 'index >= 0');
function visit45_198_2(result) {
  _$jscoverage['/underscore.js'].branchData['198'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['198'][1].init(250, 28, 'index >= 0 && index < length');
function visit44_198_1(result) {
  _$jscoverage['/underscore.js'].branchData['198'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['195'][1].init(20, 4, 'keys');
function visit43_195_1(result) {
  _$jscoverage['/underscore.js'].branchData['195'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['194'][1].init(147, 8, '!initial');
function visit42_194_1(result) {
  _$jscoverage['/underscore.js'].branchData['194'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['193'][1].init(103, 7, 'dir > 0');
function visit41_193_1(result) {
  _$jscoverage['/underscore.js'].branchData['193'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['192'][1].init(64, 11, 'keys || obj');
function visit40_192_1(result) {
  _$jscoverage['/underscore.js'].branchData['192'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['191'][1].init(18, 32, '!isArrayLike(obj) && _.keys(obj)');
function visit39_191_1(result) {
  _$jscoverage['/underscore.js'].branchData['191'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['180'][1].init(24, 4, 'keys');
function visit38_180_1(result) {
  _$jscoverage['/underscore.js'].branchData['180'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['179'][1].init(184, 14, 'index < length');
function visit37_179_1(result) {
  _$jscoverage['/underscore.js'].branchData['179'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['177'][1].init(62, 11, 'keys || obj');
function visit36_177_1(result) {
  _$jscoverage['/underscore.js'].branchData['177'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['176'][1].init(54, 32, '!isArrayLike(obj) && _.keys(obj)');
function visit35_176_1(result) {
  _$jscoverage['/underscore.js'].branchData['176'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['166'][1].init(71, 10, 'i < length');
function visit34_166_1(result) {
  _$jscoverage['/underscore.js'].branchData['166'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['161'][1].init(40, 10, 'i < length');
function visit33_161_1(result) {
  _$jscoverage['/underscore.js'].branchData['161'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['160'][1].init(74, 16, 'isArrayLike(obj)');
function visit32_160_1(result) {
  _$jscoverage['/underscore.js'].branchData['160'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['148'][5].init(96, 25, 'length <= MAX_ARRAY_INDEX');
function visit31_148_5(result) {
  _$jscoverage['/underscore.js'].branchData['148'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['148'][4].init(81, 11, 'length >= 0');
function visit30_148_4(result) {
  _$jscoverage['/underscore.js'].branchData['148'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['148'][3].init(81, 40, 'length >= 0 && length <= MAX_ARRAY_INDEX');
function visit29_148_3(result) {
  _$jscoverage['/underscore.js'].branchData['148'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['148'][2].init(52, 25, 'typeof length == \'number\'');
function visit28_148_2(result) {
  _$jscoverage['/underscore.js'].branchData['148'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['148'][1].init(52, 69, 'typeof length == \'number\' && length >= 0 && length <= MAX_ARRAY_INDEX');
function visit27_148_1(result) {
  _$jscoverage['/underscore.js'].branchData['148'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['136'][1].init(14, 11, 'obj == null');
function visit26_136_1(result) {
  _$jscoverage['/underscore.js'].branchData['136'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['127'][1].init(52, 12, 'nativeCreate');
function visit25_127_1(result) {
  _$jscoverage['/underscore.js'].branchData['127'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['126'][1].init(9, 22, '!_.isObject(prototype)');
function visit24_126_1(result) {
  _$jscoverage['/underscore.js'].branchData['126'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['116'][1].init(488, 18, 'index < startIndex');
function visit23_116_1(result) {
  _$jscoverage['/underscore.js'].branchData['116'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['107'][1].init(122, 14, 'index < length');
function visit22_107_1(result) {
  _$jscoverage['/underscore.js'].branchData['107'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['103'][1].init(18, 18, 'startIndex == null');
function visit21_103_1(result) {
  _$jscoverage['/underscore.js'].branchData['103'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['92'][1].init(125, 17, '_.isObject(value)');
function visit20_92_1(result) {
  _$jscoverage['/underscore.js'].branchData['92'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['91'][1].init(51, 19, '_.isFunction(value)');
function visit19_91_1(result) {
  _$jscoverage['/underscore.js'].branchData['91'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['90'][1].init(9, 13, 'value == null');
function visit18_90_1(result) {
  _$jscoverage['/underscore.js'].branchData['90'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['68'][1].init(54, 16, 'argCount == null');
function visit17_68_1(result) {
  _$jscoverage['/underscore.js'].branchData['68'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['67'][1].init(9, 18, 'context === void 0');
function visit16_67_1(result) {
  _$jscoverage['/underscore.js'].branchData['67'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['52'][2].init(9, 29, 'typeof module !== \'undefined\'');
function visit15_52_2(result) {
  _$jscoverage['/underscore.js'].branchData['52'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['52'][1].init(9, 47, 'typeof module !== \'undefined\' && module.exports');
function visit14_52_1(result) {
  _$jscoverage['/underscore.js'].branchData['52'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['51'][1].init(1527, 30, 'typeof exports !== \'undefined\'');
function visit13_51_1(result) {
  _$jscoverage['/underscore.js'].branchData['51'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['44'][1].init(47, 20, '!(this instanceof _)');
function visit12_44_1(result) {
  _$jscoverage['/underscore.js'].branchData['44'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['43'][1].init(9, 16, 'obj instanceof _');
function visit11_43_1(result) {
  _$jscoverage['/underscore.js'].branchData['43'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['15'][5].init(114, 24, 'global.global === global');
function visit10_15_5(result) {
  _$jscoverage['/underscore.js'].branchData['15'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['15'][4].init(29, 34, 'global.global === global && global');
function visit9_15_4(result) {
  _$jscoverage['/underscore.js'].branchData['15'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['15'][3].init(83, 26, 'typeof global === \'object\'');
function visit8_15_3(result) {
  _$jscoverage['/underscore.js'].branchData['15'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['15'][2].init(82, 64, 'typeof global === \'object\' && global.global === global && global');
function visit7_15_2(result) {
  _$jscoverage['/underscore.js'].branchData['15'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['15'][1].init(69, 84, 'typeof global === \'object\' && global.global === global && global || this');
function visit6_15_1(result) {
  _$jscoverage['/underscore.js'].branchData['15'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['14'][5].init(279, 18, 'self.self === self');
function visit5_14_5(result) {
  _$jscoverage['/underscore.js'].branchData['14'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['14'][4].init(279, 26, 'self.self === self && self');
function visit4_14_4(result) {
  _$jscoverage['/underscore.js'].branchData['14'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['14'][3].init(251, 24, 'typeof self === \'object\'');
function visit3_14_3(result) {
  _$jscoverage['/underscore.js'].branchData['14'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['14'][2].init(251, 54, 'typeof self === \'object\' && self.self === self && self');
function visit2_14_2(result) {
  _$jscoverage['/underscore.js'].branchData['14'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['14'][1].init(251, 154, 'typeof self === \'object\' && self.self === self && self || typeof global === \'object\' && global.global === global && global || this');
function visit1_14_1(result) {
  _$jscoverage['/underscore.js'].branchData['14'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].lineData[6]++;
(function() {
  _$jscoverage['/underscore.js'].functionData[0]++;
  _$jscoverage['/underscore.js'].lineData[14]++;
  var root = visit1_14_1(visit2_14_2(visit3_14_3(typeof self === 'object') && visit4_14_4(visit5_14_5(self.self === self) && self)) || visit6_15_1(visit7_15_2(visit8_15_3(typeof global === 'object') && visit9_15_4(visit10_15_5(global.global === global) && global)) || this));
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
  _$jscoverage['/underscore.js'].lineData[51]++;
  if (visit13_51_1(typeof exports !== 'undefined')) {
    _$jscoverage['/underscore.js'].lineData[52]++;
    if (visit14_52_1(visit15_52_2(typeof module !== 'undefined') && module.exports)) {
      _$jscoverage['/underscore.js'].lineData[53]++;
      exports = module.exports = _;
    }
    _$jscoverage['/underscore.js'].lineData[55]++;
    exports._ = _;
  } else {
    _$jscoverage['/underscore.js'].lineData[57]++;
    root._ = _;
  }
  _$jscoverage['/underscore.js'].lineData[61]++;
  _.VERSION = '1.8.3';
  _$jscoverage['/underscore.js'].lineData[66]++;
  var optimizeCb = function(func, context, argCount) {
  _$jscoverage['/underscore.js'].functionData[3]++;
  _$jscoverage['/underscore.js'].lineData[67]++;
  if (visit16_67_1(context === void 0)) 
    return func;
  _$jscoverage['/underscore.js'].lineData[68]++;
  switch (visit17_68_1(argCount == null) ? 3 : argCount) {
    case 1:
      _$jscoverage['/underscore.js'].lineData[69]++;
      return function(value) {
  return func.call(context, value);
};
    case 3:
      _$jscoverage['/underscore.js'].lineData[74]++;
      return function(value, index, collection) {
  return func.call(context, value, index, collection);
};
    case 4:
      _$jscoverage['/underscore.js'].lineData[77]++;
      return function(accumulator, value, index, collection) {
  return func.call(context, accumulator, value, index, collection);
};
  }
  _$jscoverage['/underscore.js'].lineData[81]++;
  return function() {
  _$jscoverage['/underscore.js'].functionData[4]++;
  _$jscoverage['/underscore.js'].lineData[82]++;
  return func.apply(context, arguments);
};
};
  _$jscoverage['/underscore.js'].lineData[89]++;
  var cb = function(value, context, argCount) {
  _$jscoverage['/underscore.js'].functionData[5]++;
  _$jscoverage['/underscore.js'].lineData[90]++;
  if (visit18_90_1(value == null)) 
    return _.identity;
  _$jscoverage['/underscore.js'].lineData[91]++;
  if (visit19_91_1(_.isFunction(value))) 
    return optimizeCb(value, context, argCount);
  _$jscoverage['/underscore.js'].lineData[92]++;
  if (visit20_92_1(_.isObject(value))) 
    return _.matcher(value);
  _$jscoverage['/underscore.js'].lineData[93]++;
  return _.property(value);
};
  _$jscoverage['/underscore.js'].lineData[96]++;
  _.iteratee = function(value, context) {
  _$jscoverage['/underscore.js'].functionData[6]++;
  _$jscoverage['/underscore.js'].lineData[97]++;
  return cb(value, context, Infinity);
};
  _$jscoverage['/underscore.js'].lineData[102]++;
  var restArgs = function(func, startIndex) {
  _$jscoverage['/underscore.js'].functionData[7]++;
  _$jscoverage['/underscore.js'].lineData[103]++;
  startIndex = visit21_103_1(startIndex == null) ? func.length - 1 : +startIndex;
  _$jscoverage['/underscore.js'].lineData[104]++;
  return function() {
  _$jscoverage['/underscore.js'].functionData[8]++;
  _$jscoverage['/underscore.js'].lineData[105]++;
  var length = Math.max(arguments.length - startIndex, 0);
  _$jscoverage['/underscore.js'].lineData[106]++;
  var rest = Array(length);
  _$jscoverage['/underscore.js'].lineData[107]++;
  for (var index = 0; visit22_107_1(index < length); index++) {
    _$jscoverage['/underscore.js'].lineData[108]++;
    rest[index] = arguments[index + startIndex];
  }
  _$jscoverage['/underscore.js'].lineData[110]++;
  switch (startIndex) {
    case 0:
      _$jscoverage['/underscore.js'].lineData[111]++;
      return func.call(this, rest);
    case 1:
      _$jscoverage['/underscore.js'].lineData[112]++;
      return func.call(this, arguments[0], rest);
    case 2:
      _$jscoverage['/underscore.js'].lineData[113]++;
      return func.call(this, arguments[0], arguments[1], rest);
  }
  _$jscoverage['/underscore.js'].lineData[115]++;
  var args = Array(startIndex + 1);
  _$jscoverage['/underscore.js'].lineData[116]++;
  for (index = 0; visit23_116_1(index < startIndex); index++) {
    _$jscoverage['/underscore.js'].lineData[117]++;
    args[index] = arguments[index];
  }
  _$jscoverage['/underscore.js'].lineData[119]++;
  args[startIndex] = rest;
  _$jscoverage['/underscore.js'].lineData[120]++;
  return func.apply(this, args);
};
};
  _$jscoverage['/underscore.js'].lineData[125]++;
  var baseCreate = function(prototype) {
  _$jscoverage['/underscore.js'].functionData[9]++;
  _$jscoverage['/underscore.js'].lineData[126]++;
  if (visit24_126_1(!_.isObject(prototype))) 
    return {};
  _$jscoverage['/underscore.js'].lineData[127]++;
  if (visit25_127_1(nativeCreate)) 
    return nativeCreate(prototype);
  _$jscoverage['/underscore.js'].lineData[128]++;
  Ctor.prototype = prototype;
  _$jscoverage['/underscore.js'].lineData[129]++;
  var result = new Ctor();
  _$jscoverage['/underscore.js'].lineData[130]++;
  Ctor.prototype = null;
  _$jscoverage['/underscore.js'].lineData[131]++;
  return result;
};
  _$jscoverage['/underscore.js'].lineData[134]++;
  var property = function(key) {
  _$jscoverage['/underscore.js'].functionData[10]++;
  _$jscoverage['/underscore.js'].lineData[135]++;
  return function(obj) {
  _$jscoverage['/underscore.js'].functionData[11]++;
  _$jscoverage['/underscore.js'].lineData[136]++;
  return visit26_136_1(obj == null) ? void 0 : obj[key];
};
};
  _$jscoverage['/underscore.js'].lineData[144]++;
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  _$jscoverage['/underscore.js'].lineData[145]++;
  var getLength = property('length');
  _$jscoverage['/underscore.js'].lineData[146]++;
  var isArrayLike = function(collection) {
  _$jscoverage['/underscore.js'].functionData[12]++;
  _$jscoverage['/underscore.js'].lineData[147]++;
  var length = getLength(collection);
  _$jscoverage['/underscore.js'].lineData[148]++;
  return visit27_148_1(visit28_148_2(typeof length == 'number') && visit29_148_3(visit30_148_4(length >= 0) && visit31_148_5(length <= MAX_ARRAY_INDEX)));
};
  _$jscoverage['/underscore.js'].lineData[157]++;
  _.each = _.forEach = function(obj, iteratee, context) {
  _$jscoverage['/underscore.js'].functionData[13]++;
  _$jscoverage['/underscore.js'].lineData[158]++;
  iteratee = optimizeCb(iteratee, context);
  _$jscoverage['/underscore.js'].lineData[159]++;
  var i, length;
  _$jscoverage['/underscore.js'].lineData[160]++;
  if (visit32_160_1(isArrayLike(obj))) {
    _$jscoverage['/underscore.js'].lineData[161]++;
    for (i = 0 , length = obj.length; visit33_161_1(i < length); i++) {
      _$jscoverage['/underscore.js'].lineData[162]++;
      iteratee(obj[i], i, obj);
    }
  } else {
    _$jscoverage['/underscore.js'].lineData[165]++;
    var keys = _.keys(obj);
    _$jscoverage['/underscore.js'].lineData[166]++;
    for (i = 0 , length = keys.length; visit34_166_1(i < length); i++) {
      _$jscoverage['/underscore.js'].lineData[167]++;
      iteratee(obj[keys[i]], keys[i], obj);
    }
  }
  _$jscoverage['/underscore.js'].lineData[170]++;
  return obj;
};
  _$jscoverage['/underscore.js'].lineData[174]++;
  _.map = _.collect = function(obj, iteratee, context) {
  _$jscoverage['/underscore.js'].functionData[14]++;
  _$jscoverage['/underscore.js'].lineData[175]++;
  iteratee = cb(iteratee, context);
  _$jscoverage['/underscore.js'].lineData[176]++;
  var keys = visit35_176_1(!isArrayLike(obj) && _.keys(obj)), length = (visit36_177_1(keys || obj)).length, results = Array(length);
  _$jscoverage['/underscore.js'].lineData[179]++;
  for (var index = 0; visit37_179_1(index < length); index++) {
    _$jscoverage['/underscore.js'].lineData[180]++;
    var currentKey = visit38_180_1(keys) ? keys[index] : index;
    _$jscoverage['/underscore.js'].lineData[181]++;
    results[index] = iteratee(obj[currentKey], currentKey, obj);
  }
  _$jscoverage['/underscore.js'].lineData[183]++;
  return results;
};
  _$jscoverage['/underscore.js'].lineData[187]++;
  var createReduce = function(dir) {
  _$jscoverage['/underscore.js'].functionData[15]++;
  _$jscoverage['/underscore.js'].lineData[190]++;
  var reducer = function(obj, iteratee, memo, initial) {
  _$jscoverage['/underscore.js'].functionData[16]++;
  _$jscoverage['/underscore.js'].lineData[191]++;
  var keys = visit39_191_1(!isArrayLike(obj) && _.keys(obj)), length = (visit40_192_1(keys || obj)).length, index = visit41_193_1(dir > 0) ? 0 : length - 1;
  _$jscoverage['/underscore.js'].lineData[194]++;
  if (visit42_194_1(!initial)) {
    _$jscoverage['/underscore.js'].lineData[195]++;
    memo = obj[visit43_195_1(keys) ? keys[index] : index];
    _$jscoverage['/underscore.js'].lineData[196]++;
    index += dir;
  }
  _$jscoverage['/underscore.js'].lineData[198]++;
  for (; visit44_198_1(visit45_198_2(index >= 0) && visit46_198_3(index < length)); index += dir) {
    _$jscoverage['/underscore.js'].lineData[199]++;
    var currentKey = visit47_199_1(keys) ? keys[index] : index;
    _$jscoverage['/underscore.js'].lineData[200]++;
    memo = iteratee(memo, obj[currentKey], currentKey, obj);
  }
  _$jscoverage['/underscore.js'].lineData[202]++;
  return memo;
};
  _$jscoverage['/underscore.js'].lineData[205]++;
  return function(obj, iteratee, memo, context) {
  _$jscoverage['/underscore.js'].functionData[17]++;
  _$jscoverage['/underscore.js'].lineData[206]++;
  var initial = visit48_206_1(arguments.length >= 3);
  _$jscoverage['/underscore.js'].lineData[207]++;
  return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
};
};
  _$jscoverage['/underscore.js'].lineData[213]++;
  _.reduce = _.foldl = _.inject = createReduce(1);
  _$jscoverage['/underscore.js'].lineData[216]++;
  _.reduceRight = _.foldr = createReduce(-1);
  _$jscoverage['/underscore.js'].lineData[219]++;
  _.find = _.detect = function(obj, predicate, context) {
  _$jscoverage['/underscore.js'].functionData[18]++;
  _$jscoverage['/underscore.js'].lineData[220]++;
  var key;
  _$jscoverage['/underscore.js'].lineData[221]++;
  if (visit49_221_1(isArrayLike(obj))) {
    _$jscoverage['/underscore.js'].lineData[222]++;
    key = _.findIndex(obj, predicate, context);
  } else {
    _$jscoverage['/underscore.js'].lineData[224]++;
    key = _.findKey(obj, predicate, context);
  }
  _$jscoverage['/underscore.js'].lineData[226]++;
  if (visit50_226_1(visit51_226_2(key !== void 0) && visit52_226_3(key !== -1))) 
    return obj[key];
};
  _$jscoverage['/underscore.js'].lineData[231]++;
  _.filter = _.select = function(obj, predicate, context) {
  _$jscoverage['/underscore.js'].functionData[19]++;
  _$jscoverage['/underscore.js'].lineData[232]++;
  var results = [];
  _$jscoverage['/underscore.js'].lineData[233]++;
  predicate = cb(predicate, context);
  _$jscoverage['/underscore.js'].lineData[234]++;
  _.each(obj, function(value, index, list) {
  _$jscoverage['/underscore.js'].functionData[20]++;
  _$jscoverage['/underscore.js'].lineData[235]++;
  if (visit53_235_1(predicate(value, index, list))) 
    results.push(value);
});
  _$jscoverage['/underscore.js'].lineData[237]++;
  return results;
};
  _$jscoverage['/underscore.js'].lineData[241]++;
  _.reject = function(obj, predicate, context) {
  _$jscoverage['/underscore.js'].functionData[21]++;
  _$jscoverage['/underscore.js'].lineData[242]++;
  return _.filter(obj, _.negate(cb(predicate)), context);
};
  _$jscoverage['/underscore.js'].lineData[247]++;
  _.every = _.all = function(obj, predicate, context) {
  _$jscoverage['/underscore.js'].functionData[22]++;
  _$jscoverage['/underscore.js'].lineData[248]++;
  predicate = cb(predicate, context);
  _$jscoverage['/underscore.js'].lineData[249]++;
  var keys = visit54_249_1(!isArrayLike(obj) && _.keys(obj)), length = (visit55_250_1(keys || obj)).length;
  _$jscoverage['/underscore.js'].lineData[251]++;
  for (var index = 0; visit56_251_1(index < length); index++) {
    _$jscoverage['/underscore.js'].lineData[252]++;
    var currentKey = visit57_252_1(keys) ? keys[index] : index;
    _$jscoverage['/underscore.js'].lineData[253]++;
    if (visit58_253_1(!predicate(obj[currentKey], currentKey, obj))) 
      return false;
  }
  _$jscoverage['/underscore.js'].lineData[255]++;
  return true;
};
  _$jscoverage['/underscore.js'].lineData[260]++;
  _.some = _.any = function(obj, predicate, context) {
  _$jscoverage['/underscore.js'].functionData[23]++;
  _$jscoverage['/underscore.js'].lineData[261]++;
  predicate = cb(predicate, context);
  _$jscoverage['/underscore.js'].lineData[262]++;
  var keys = visit59_262_1(!isArrayLike(obj) && _.keys(obj)), length = (visit60_263_1(keys || obj)).length;
  _$jscoverage['/underscore.js'].lineData[264]++;
  for (var index = 0; visit61_264_1(index < length); index++) {
    _$jscoverage['/underscore.js'].lineData[265]++;
    var currentKey = visit62_265_1(keys) ? keys[index] : index;
    _$jscoverage['/underscore.js'].lineData[266]++;
    if (visit63_266_1(predicate(obj[currentKey], currentKey, obj))) 
      return true;
  }
  _$jscoverage['/underscore.js'].lineData[268]++;
  return false;
};
  _$jscoverage['/underscore.js'].lineData[273]++;
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
  _$jscoverage['/underscore.js'].functionData[24]++;
  _$jscoverage['/underscore.js'].lineData[274]++;
  if (visit64_274_1(!isArrayLike(obj))) 
    obj = _.values(obj);
  _$jscoverage['/underscore.js'].lineData[275]++;
  if (visit65_275_1(visit66_275_2(typeof fromIndex != 'number') || guard)) 
    fromIndex = 0;
  _$jscoverage['/underscore.js'].lineData[276]++;
  return visit67_276_1(_.indexOf(obj, item, fromIndex) >= 0);
};
  _$jscoverage['/underscore.js'].lineData[280]++;
  _.invoke = restArgs(function(obj, method, args) {
  _$jscoverage['/underscore.js'].functionData[25]++;
  _$jscoverage['/underscore.js'].lineData[281]++;
  var isFunc = _.isFunction(method);
  _$jscoverage['/underscore.js'].lineData[282]++;
  return _.map(obj, function(value) {
  _$jscoverage['/underscore.js'].functionData[26]++;
  _$jscoverage['/underscore.js'].lineData[283]++;
  var func = visit68_283_1(isFunc) ? method : value[method];
  _$jscoverage['/underscore.js'].lineData[284]++;
  return visit69_284_1(func == null) ? func : func.apply(value, args);
});
});
  _$jscoverage['/underscore.js'].lineData[289]++;
  _.pluck = function(obj, key) {
  _$jscoverage['/underscore.js'].functionData[27]++;
  _$jscoverage['/underscore.js'].lineData[290]++;
  return _.map(obj, _.property(key));
};
  _$jscoverage['/underscore.js'].lineData[295]++;
  _.where = function(obj, attrs) {
  _$jscoverage['/underscore.js'].functionData[28]++;
  _$jscoverage['/underscore.js'].lineData[296]++;
  return _.filter(obj, _.matcher(attrs));
};
  _$jscoverage['/underscore.js'].lineData[301]++;
  _.findWhere = function(obj, attrs) {
  _$jscoverage['/underscore.js'].functionData[29]++;
  _$jscoverage['/underscore.js'].lineData[302]++;
  return _.find(obj, _.matcher(attrs));
};
  _$jscoverage['/underscore.js'].lineData[306]++;
  _.max = function(obj, iteratee, context) {
  _$jscoverage['/underscore.js'].functionData[30]++;
  _$jscoverage['/underscore.js'].lineData[307]++;
  var result = -Infinity, lastComputed = -Infinity, value, computed;
  _$jscoverage['/underscore.js'].lineData[309]++;
  if (visit70_309_1(visit71_309_2(iteratee == null) || visit72_309_3((visit73_309_4(visit74_309_5(typeof iteratee == 'number') && visit75_309_6(typeof obj[0] != 'object'))) && visit76_309_7(obj != null)))) {
    _$jscoverage['/underscore.js'].lineData[310]++;
    obj = visit77_310_1(isArrayLike(obj)) ? obj : _.values(obj);
    _$jscoverage['/underscore.js'].lineData[311]++;
    for (var i = 0, length = obj.length; visit78_311_1(i < length); i++) {
      _$jscoverage['/underscore.js'].lineData[312]++;
      value = obj[i];
      _$jscoverage['/underscore.js'].lineData[313]++;
      if (visit79_313_1(value > result)) {
        _$jscoverage['/underscore.js'].lineData[314]++;
        result = value;
      }
    }
  } else {
    _$jscoverage['/underscore.js'].lineData[318]++;
    iteratee = cb(iteratee, context);
    _$jscoverage['/underscore.js'].lineData[319]++;
    _.each(obj, function(v, index, list) {
  _$jscoverage['/underscore.js'].functionData[31]++;
  _$jscoverage['/underscore.js'].lineData[320]++;
  computed = iteratee(v, index, list);
  _$jscoverage['/underscore.js'].lineData[321]++;
  if (visit80_321_1(visit81_321_2(computed > lastComputed) || visit82_321_3(visit83_321_4(computed === -Infinity) && visit84_321_5(result === -Infinity)))) {
    _$jscoverage['/underscore.js'].lineData[322]++;
    result = v;
    _$jscoverage['/underscore.js'].lineData[323]++;
    lastComputed = computed;
  }
});
  }
  _$jscoverage['/underscore.js'].lineData[327]++;
  return result;
};
  _$jscoverage['/underscore.js'].lineData[331]++;
  _.min = function(obj, iteratee, context) {
  _$jscoverage['/underscore.js'].functionData[32]++;
  _$jscoverage['/underscore.js'].lineData[332]++;
  var result = Infinity, lastComputed = Infinity, value, computed;
  _$jscoverage['/underscore.js'].lineData[334]++;
  if (visit85_334_1(visit86_334_2(iteratee == null) || visit87_334_3((visit88_334_4(visit89_334_5(typeof iteratee == 'number') && visit90_334_6(typeof obj[0] != 'object'))) && visit91_334_7(obj != null)))) {
    _$jscoverage['/underscore.js'].lineData[335]++;
    obj = visit92_335_1(isArrayLike(obj)) ? obj : _.values(obj);
    _$jscoverage['/underscore.js'].lineData[336]++;
    for (var i = 0, length = obj.length; visit93_336_1(i < length); i++) {
      _$jscoverage['/underscore.js'].lineData[337]++;
      value = obj[i];
      _$jscoverage['/underscore.js'].lineData[338]++;
      if (visit94_338_1(value < result)) {
        _$jscoverage['/underscore.js'].lineData[339]++;
        result = value;
      }
    }
  } else {
    _$jscoverage['/underscore.js'].lineData[343]++;
    iteratee = cb(iteratee, context);
    _$jscoverage['/underscore.js'].lineData[344]++;
    _.each(obj, function(v, index, list) {
  _$jscoverage['/underscore.js'].functionData[33]++;
  _$jscoverage['/underscore.js'].lineData[345]++;
  computed = iteratee(v, index, list);
  _$jscoverage['/underscore.js'].lineData[346]++;
  if (visit95_346_1(visit96_346_2(computed < lastComputed) || visit97_346_3(visit98_346_4(computed === Infinity) && visit99_346_5(result === Infinity)))) {
    _$jscoverage['/underscore.js'].lineData[347]++;
    result = v;
    _$jscoverage['/underscore.js'].lineData[348]++;
    lastComputed = computed;
  }
});
  }
  _$jscoverage['/underscore.js'].lineData[352]++;
  return result;
};
  _$jscoverage['/underscore.js'].lineData[356]++;
  _.shuffle = function(obj) {
  _$jscoverage['/underscore.js'].functionData[34]++;
  _$jscoverage['/underscore.js'].lineData[357]++;
  return _.sample(obj, Infinity);
};
  _$jscoverage['/underscore.js'].lineData[364]++;
  _.sample = function(obj, n, guard) {
  _$jscoverage['/underscore.js'].functionData[35]++;
  _$jscoverage['/underscore.js'].lineData[365]++;
  if (visit100_365_1(visit101_365_2(n == null) || guard)) {
    _$jscoverage['/underscore.js'].lineData[366]++;
    if (visit102_366_1(!isArrayLike(obj))) 
      obj = _.values(obj);
    _$jscoverage['/underscore.js'].lineData[367]++;
    return obj[_.random(obj.length - 1)];
  }
  _$jscoverage['/underscore.js'].lineData[369]++;
  var sample = visit103_369_1(isArrayLike(obj)) ? _.clone(obj) : _.values(obj);
  _$jscoverage['/underscore.js'].lineData[370]++;
  var length = getLength(sample);
  _$jscoverage['/underscore.js'].lineData[371]++;
  n = Math.max(Math.min(n, length), 0);
  _$jscoverage['/underscore.js'].lineData[372]++;
  var last = length - 1;
  _$jscoverage['/underscore.js'].lineData[373]++;
  for (var index = 0; visit104_373_1(index < n); index++) {
    _$jscoverage['/underscore.js'].lineData[374]++;
    var rand = _.random(index, last);
    _$jscoverage['/underscore.js'].lineData[375]++;
    var temp = sample[index];
    _$jscoverage['/underscore.js'].lineData[376]++;
    sample[index] = sample[rand];
    _$jscoverage['/underscore.js'].lineData[377]++;
    sample[rand] = temp;
  }
  _$jscoverage['/underscore.js'].lineData[379]++;
  return sample.slice(0, n);
};
  _$jscoverage['/underscore.js'].lineData[383]++;
  _.sortBy = function(obj, iteratee, context) {
  _$jscoverage['/underscore.js'].functionData[36]++;
  _$jscoverage['/underscore.js'].lineData[384]++;
  var index = 0;
  _$jscoverage['/underscore.js'].lineData[385]++;
  iteratee = cb(iteratee, context);
  _$jscoverage['/underscore.js'].lineData[386]++;
  return _.pluck(_.map(obj, function(value, key, list) {
  _$jscoverage['/underscore.js'].functionData[37]++;
  _$jscoverage['/underscore.js'].lineData[387]++;
  return {
  value: value, 
  index: index++, 
  criteria: iteratee(value, key, list)};
}).sort(function(left, right) {
  _$jscoverage['/underscore.js'].functionData[38]++;
  _$jscoverage['/underscore.js'].lineData[393]++;
  var a = left.criteria;
  _$jscoverage['/underscore.js'].lineData[394]++;
  var b = right.criteria;
  _$jscoverage['/underscore.js'].lineData[395]++;
  if (visit105_395_1(a !== b)) {
    _$jscoverage['/underscore.js'].lineData[396]++;
    if (visit106_396_1(visit107_396_2(a > b) || visit108_396_3(a === void 0))) 
      return 1;
    _$jscoverage['/underscore.js'].lineData[397]++;
    if (visit109_397_1(visit110_397_2(a < b) || visit111_397_3(b === void 0))) 
      return -1;
  }
  _$jscoverage['/underscore.js'].lineData[399]++;
  return left.index - right.index;
}), 'value');
};
  _$jscoverage['/underscore.js'].lineData[404]++;
  var group = function(behavior, partition) {
  _$jscoverage['/underscore.js'].functionData[39]++;
  _$jscoverage['/underscore.js'].lineData[405]++;
  return function(obj, iteratee, context) {
  _$jscoverage['/underscore.js'].functionData[40]++;
  _$jscoverage['/underscore.js'].lineData[406]++;
  var result = visit112_406_1(partition) ? [[], []] : {};
  _$jscoverage['/underscore.js'].lineData[407]++;
  iteratee = cb(iteratee, context);
  _$jscoverage['/underscore.js'].lineData[408]++;
  _.each(obj, function(value, index) {
  _$jscoverage['/underscore.js'].functionData[41]++;
  _$jscoverage['/underscore.js'].lineData[409]++;
  var key = iteratee(value, index, obj);
  _$jscoverage['/underscore.js'].lineData[410]++;
  behavior(result, value, key);
});
  _$jscoverage['/underscore.js'].lineData[412]++;
  return result;
};
};
  _$jscoverage['/underscore.js'].lineData[418]++;
  _.groupBy = group(function(result, value, key) {
  _$jscoverage['/underscore.js'].functionData[42]++;
  _$jscoverage['/underscore.js'].lineData[419]++;
  if (visit113_419_1(_.has(result, key))) 
    result[key].push(value);
  else 
    result[key] = [value];
});
  _$jscoverage['/underscore.js'].lineData[424]++;
  _.indexBy = group(function(result, value, key) {
  _$jscoverage['/underscore.js'].functionData[43]++;
  _$jscoverage['/underscore.js'].lineData[425]++;
  result[key] = value;
});
  _$jscoverage['/underscore.js'].lineData[431]++;
  _.countBy = group(function(result, value, key) {
  _$jscoverage['/underscore.js'].functionData[44]++;
  _$jscoverage['/underscore.js'].lineData[432]++;
  if (visit114_432_1(_.has(result, key))) 
    result[key]++;
  else 
    result[key] = 1;
});
  _$jscoverage['/underscore.js'].lineData[436]++;
  _.toArray = function(obj) {
  _$jscoverage['/underscore.js'].functionData[45]++;
  _$jscoverage['/underscore.js'].lineData[437]++;
  if (visit115_437_1(!obj)) 
    return [];
  _$jscoverage['/underscore.js'].lineData[438]++;
  if (visit116_438_1(_.isArray(obj))) 
    return slice.call(obj);
  _$jscoverage['/underscore.js'].lineData[439]++;
  if (visit117_439_1(isArrayLike(obj))) 
    return _.map(obj, _.identity);
  _$jscoverage['/underscore.js'].lineData[440]++;
  return _.values(obj);
};
  _$jscoverage['/underscore.js'].lineData[444]++;
  _.size = function(obj) {
  _$jscoverage['/underscore.js'].functionData[46]++;
  _$jscoverage['/underscore.js'].lineData[445]++;
  if (visit118_445_1(obj == null)) 
    return 0;
  _$jscoverage['/underscore.js'].lineData[446]++;
  return visit119_446_1(isArrayLike(obj)) ? obj.length : _.keys(obj).length;
};
  _$jscoverage['/underscore.js'].lineData[451]++;
  _.partition = group(function(result, value, pass) {
  _$jscoverage['/underscore.js'].functionData[47]++;
  _$jscoverage['/underscore.js'].lineData[452]++;
  result[visit120_452_1(pass) ? 0 : 1].push(value);
}, true);
  _$jscoverage['/underscore.js'].lineData[461]++;
  _.first = _.head = _.take = function(array, n, guard) {
  _$jscoverage['/underscore.js'].functionData[48]++;
  _$jscoverage['/underscore.js'].lineData[462]++;
  if (visit121_462_1(array == null)) 
    return void 0;
  _$jscoverage['/underscore.js'].lineData[463]++;
  if (visit122_463_1(visit123_463_2(n == null) || guard)) 
    return array[0];
  _$jscoverage['/underscore.js'].lineData[464]++;
  return _.initial(array, array.length - n);
};
  _$jscoverage['/underscore.js'].lineData[470]++;
  _.initial = function(array, n, guard) {
  _$jscoverage['/underscore.js'].functionData[49]++;
  _$jscoverage['/underscore.js'].lineData[471]++;
  return slice.call(array, 0, Math.max(0, array.length - (visit124_471_1(visit125_471_2(n == null) || guard) ? 1 : n)));
};
  _$jscoverage['/underscore.js'].lineData[476]++;
  _.last = function(array, n, guard) {
  _$jscoverage['/underscore.js'].functionData[50]++;
  _$jscoverage['/underscore.js'].lineData[477]++;
  if (visit126_477_1(array == null)) 
    return void 0;
  _$jscoverage['/underscore.js'].lineData[478]++;
  if (visit127_478_1(visit128_478_2(n == null) || guard)) 
    return array[array.length - 1];
  _$jscoverage['/underscore.js'].lineData[479]++;
  return _.rest(array, Math.max(0, array.length - n));
};
  _$jscoverage['/underscore.js'].lineData[485]++;
  _.rest = _.tail = _.drop = function(array, n, guard) {
  _$jscoverage['/underscore.js'].functionData[51]++;
  _$jscoverage['/underscore.js'].lineData[486]++;
  return slice.call(array, visit129_486_1(visit130_486_2(n == null) || guard) ? 1 : n);
};
  _$jscoverage['/underscore.js'].lineData[490]++;
  _.compact = function(array) {
  _$jscoverage['/underscore.js'].functionData[52]++;
  _$jscoverage['/underscore.js'].lineData[491]++;
  return _.filter(array, _.identity);
};
  _$jscoverage['/underscore.js'].lineData[495]++;
  var flatten = function(input, shallow, strict, output) {
  _$jscoverage['/underscore.js'].functionData[53]++;
  _$jscoverage['/underscore.js'].lineData[496]++;
  output = visit131_496_1(output || []);
  _$jscoverage['/underscore.js'].lineData[497]++;
  var idx = output.length;
  _$jscoverage['/underscore.js'].lineData[498]++;
  for (var i = 0, length = getLength(input); visit132_498_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[499]++;
    var value = input[i];
    _$jscoverage['/underscore.js'].lineData[500]++;
    if (visit133_500_1(isArrayLike(value) && (visit134_500_2(_.isArray(value) || _.isArguments(value))))) {
      _$jscoverage['/underscore.js'].lineData[502]++;
      if (visit135_502_1(shallow)) {
        _$jscoverage['/underscore.js'].lineData[503]++;
        var j = 0, len = value.length;
        _$jscoverage['/underscore.js'].lineData[504]++;
        while (visit136_504_1(j < len)) 
          output[idx++] = value[j++];
      } else {
        _$jscoverage['/underscore.js'].lineData[506]++;
        flatten(value, shallow, strict, output);
        _$jscoverage['/underscore.js'].lineData[507]++;
        idx = output.length;
      }
    } else {
      _$jscoverage['/underscore.js'].lineData[509]++;
      if (visit137_509_1(!strict)) {
        _$jscoverage['/underscore.js'].lineData[510]++;
        output[idx++] = value;
      }
    }
  }
  _$jscoverage['/underscore.js'].lineData[513]++;
  return output;
};
  _$jscoverage['/underscore.js'].lineData[517]++;
  _.flatten = function(array, shallow) {
  _$jscoverage['/underscore.js'].functionData[54]++;
  _$jscoverage['/underscore.js'].lineData[518]++;
  return flatten(array, shallow, false);
};
  _$jscoverage['/underscore.js'].lineData[522]++;
  _.without = restArgs(function(array, otherArrays) {
  _$jscoverage['/underscore.js'].functionData[55]++;
  _$jscoverage['/underscore.js'].lineData[523]++;
  return _.difference(array, otherArrays);
});
  _$jscoverage['/underscore.js'].lineData[529]++;
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
  _$jscoverage['/underscore.js'].functionData[56]++;
  _$jscoverage['/underscore.js'].lineData[530]++;
  if (visit138_530_1(!_.isBoolean(isSorted))) {
    _$jscoverage['/underscore.js'].lineData[531]++;
    context = iteratee;
    _$jscoverage['/underscore.js'].lineData[532]++;
    iteratee = isSorted;
    _$jscoverage['/underscore.js'].lineData[533]++;
    isSorted = false;
  }
  _$jscoverage['/underscore.js'].lineData[535]++;
  if (visit139_535_1(iteratee != null)) 
    iteratee = cb(iteratee, context);
  _$jscoverage['/underscore.js'].lineData[536]++;
  var result = [];
  _$jscoverage['/underscore.js'].lineData[537]++;
  var seen = [];
  _$jscoverage['/underscore.js'].lineData[538]++;
  for (var i = 0, length = getLength(array); visit140_538_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[539]++;
    var value = array[i], computed = visit141_540_1(iteratee) ? iteratee(value, i, array) : value;
    _$jscoverage['/underscore.js'].lineData[541]++;
    if (visit142_541_1(isSorted)) {
      _$jscoverage['/underscore.js'].lineData[542]++;
      if (visit143_542_1(!i || visit144_542_2(seen !== computed))) 
        result.push(value);
      _$jscoverage['/underscore.js'].lineData[543]++;
      seen = computed;
    } else {
      _$jscoverage['/underscore.js'].lineData[544]++;
      if (visit145_544_1(iteratee)) {
        _$jscoverage['/underscore.js'].lineData[545]++;
        if (visit146_545_1(!_.contains(seen, computed))) {
          _$jscoverage['/underscore.js'].lineData[546]++;
          seen.push(computed);
          _$jscoverage['/underscore.js'].lineData[547]++;
          result.push(value);
        }
      } else {
        _$jscoverage['/underscore.js'].lineData[549]++;
        if (visit147_549_1(!_.contains(result, value))) {
          _$jscoverage['/underscore.js'].lineData[550]++;
          result.push(value);
        }
      }
    }
  }
  _$jscoverage['/underscore.js'].lineData[553]++;
  return result;
};
  _$jscoverage['/underscore.js'].lineData[558]++;
  _.union = restArgs(function(arrays) {
  _$jscoverage['/underscore.js'].functionData[57]++;
  _$jscoverage['/underscore.js'].lineData[559]++;
  return _.uniq(flatten(arrays, true, true));
});
  _$jscoverage['/underscore.js'].lineData[564]++;
  _.intersection = function(array) {
  _$jscoverage['/underscore.js'].functionData[58]++;
  _$jscoverage['/underscore.js'].lineData[565]++;
  var result = [];
  _$jscoverage['/underscore.js'].lineData[566]++;
  var argsLength = arguments.length;
  _$jscoverage['/underscore.js'].lineData[567]++;
  for (var i = 0, length = getLength(array); visit148_567_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[568]++;
    var item = array[i];
    _$jscoverage['/underscore.js'].lineData[569]++;
    if (visit149_569_1(_.contains(result, item))) 
      continue;
    _$jscoverage['/underscore.js'].lineData[570]++;
    var j;
    _$jscoverage['/underscore.js'].lineData[571]++;
    for (j = 1; visit150_571_1(j < argsLength); j++) {
      _$jscoverage['/underscore.js'].lineData[572]++;
      if (visit151_572_1(!_.contains(arguments[j], item))) 
        break;
    }
    _$jscoverage['/underscore.js'].lineData[574]++;
    if (visit152_574_1(j === argsLength)) 
      result.push(item);
  }
  _$jscoverage['/underscore.js'].lineData[576]++;
  return result;
};
  _$jscoverage['/underscore.js'].lineData[581]++;
  _.difference = restArgs(function(array, rest) {
  _$jscoverage['/underscore.js'].functionData[59]++;
  _$jscoverage['/underscore.js'].lineData[582]++;
  rest = flatten(rest, true, true);
  _$jscoverage['/underscore.js'].lineData[583]++;
  return _.filter(array, function(value) {
  _$jscoverage['/underscore.js'].functionData[60]++;
  _$jscoverage['/underscore.js'].lineData[584]++;
  return !_.contains(rest, value);
});
});
  _$jscoverage['/underscore.js'].lineData[590]++;
  _.unzip = function(array) {
  _$jscoverage['/underscore.js'].functionData[61]++;
  _$jscoverage['/underscore.js'].lineData[591]++;
  var length = visit153_591_1(visit154_591_2(array && _.max(array, getLength).length) || 0);
  _$jscoverage['/underscore.js'].lineData[592]++;
  var result = Array(length);
  _$jscoverage['/underscore.js'].lineData[594]++;
  for (var index = 0; visit155_594_1(index < length); index++) {
    _$jscoverage['/underscore.js'].lineData[595]++;
    result[index] = _.pluck(array, index);
  }
  _$jscoverage['/underscore.js'].lineData[597]++;
  return result;
};
  _$jscoverage['/underscore.js'].lineData[602]++;
  _.zip = restArgs(_.unzip);
  _$jscoverage['/underscore.js'].lineData[607]++;
  _.object = function(list, values) {
  _$jscoverage['/underscore.js'].functionData[62]++;
  _$jscoverage['/underscore.js'].lineData[608]++;
  var result = {};
  _$jscoverage['/underscore.js'].lineData[609]++;
  for (var i = 0, length = getLength(list); visit156_609_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[610]++;
    if (visit157_610_1(values)) {
      _$jscoverage['/underscore.js'].lineData[611]++;
      result[list[i]] = values[i];
    } else {
      _$jscoverage['/underscore.js'].lineData[613]++;
      result[list[i][0]] = list[i][1];
    }
  }
  _$jscoverage['/underscore.js'].lineData[616]++;
  return result;
};
  _$jscoverage['/underscore.js'].lineData[620]++;
  var createPredicateIndexFinder = function(dir) {
  _$jscoverage['/underscore.js'].functionData[63]++;
  _$jscoverage['/underscore.js'].lineData[621]++;
  return function(array, predicate, context) {
  _$jscoverage['/underscore.js'].functionData[64]++;
  _$jscoverage['/underscore.js'].lineData[622]++;
  predicate = cb(predicate, context);
  _$jscoverage['/underscore.js'].lineData[623]++;
  var length = getLength(array);
  _$jscoverage['/underscore.js'].lineData[624]++;
  var index = visit158_624_1(dir > 0) ? 0 : length - 1;
  _$jscoverage['/underscore.js'].lineData[625]++;
  for (; visit159_625_1(visit160_625_2(index >= 0) && visit161_625_3(index < length)); index += dir) {
    _$jscoverage['/underscore.js'].lineData[626]++;
    if (visit162_626_1(predicate(array[index], index, array))) 
      return index;
  }
  _$jscoverage['/underscore.js'].lineData[628]++;
  return -1;
};
};
  _$jscoverage['/underscore.js'].lineData[633]++;
  _.findIndex = createPredicateIndexFinder(1);
  _$jscoverage['/underscore.js'].lineData[634]++;
  _.findLastIndex = createPredicateIndexFinder(-1);
  _$jscoverage['/underscore.js'].lineData[638]++;
  _.sortedIndex = function(array, obj, iteratee, context) {
  _$jscoverage['/underscore.js'].functionData[65]++;
  _$jscoverage['/underscore.js'].lineData[639]++;
  iteratee = cb(iteratee, context, 1);
  _$jscoverage['/underscore.js'].lineData[640]++;
  var value = iteratee(obj);
  _$jscoverage['/underscore.js'].lineData[641]++;
  var low = 0, high = getLength(array);
  _$jscoverage['/underscore.js'].lineData[642]++;
  while (visit163_642_1(low < high)) {
    _$jscoverage['/underscore.js'].lineData[643]++;
    var mid = Math.floor((low + high) / 2);
    _$jscoverage['/underscore.js'].lineData[644]++;
    if (visit164_644_1(iteratee(array[mid]) < value)) 
      low = mid + 1;
    else 
      high = mid;
  }
  _$jscoverage['/underscore.js'].lineData[646]++;
  return low;
};
  _$jscoverage['/underscore.js'].lineData[650]++;
  var createIndexFinder = function(dir, predicateFind, sortedIndex) {
  _$jscoverage['/underscore.js'].functionData[66]++;
  _$jscoverage['/underscore.js'].lineData[651]++;
  return function(array, item, idx) {
  _$jscoverage['/underscore.js'].functionData[67]++;
  _$jscoverage['/underscore.js'].lineData[652]++;
  var i = 0, length = getLength(array);
  _$jscoverage['/underscore.js'].lineData[653]++;
  if (visit165_653_1(typeof idx == 'number')) {
    _$jscoverage['/underscore.js'].lineData[654]++;
    if (visit166_654_1(dir > 0)) {
      _$jscoverage['/underscore.js'].lineData[655]++;
      i = visit167_655_1(idx >= 0) ? idx : Math.max(idx + length, i);
    } else {
      _$jscoverage['/underscore.js'].lineData[657]++;
      length = visit168_657_1(idx >= 0) ? Math.min(idx + 1, length) : idx + length + 1;
    }
  } else {
    _$jscoverage['/underscore.js'].lineData[659]++;
    if (visit169_659_1(sortedIndex && visit170_659_2(idx && length))) {
      _$jscoverage['/underscore.js'].lineData[660]++;
      idx = sortedIndex(array, item);
      _$jscoverage['/underscore.js'].lineData[661]++;
      return visit171_661_1(array[idx] === item) ? idx : -1;
    }
  }
  _$jscoverage['/underscore.js'].lineData[663]++;
  if (visit172_663_1(item !== item)) {
    _$jscoverage['/underscore.js'].lineData[664]++;
    idx = predicateFind(slice.call(array, i, length), _.isNaN);
    _$jscoverage['/underscore.js'].lineData[665]++;
    return visit173_665_1(idx >= 0) ? idx + i : -1;
  }
  _$jscoverage['/underscore.js'].lineData[667]++;
  for (idx = visit174_667_1(dir > 0) ? i : length - 1; visit175_667_2(visit176_667_3(idx >= 0) && visit177_667_4(idx < length)); idx += dir) {
    _$jscoverage['/underscore.js'].lineData[668]++;
    if (visit178_668_1(array[idx] === item)) 
      return idx;
  }
  _$jscoverage['/underscore.js'].lineData[670]++;
  return -1;
};
};
  _$jscoverage['/underscore.js'].lineData[678]++;
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _$jscoverage['/underscore.js'].lineData[679]++;
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);
  _$jscoverage['/underscore.js'].lineData[684]++;
  _.range = function(start, stop, step) {
  _$jscoverage['/underscore.js'].functionData[68]++;
  _$jscoverage['/underscore.js'].lineData[685]++;
  if (visit179_685_1(stop == null)) {
    _$jscoverage['/underscore.js'].lineData[686]++;
    stop = visit180_686_1(start || 0);
    _$jscoverage['/underscore.js'].lineData[687]++;
    start = 0;
  }
  _$jscoverage['/underscore.js'].lineData[689]++;
  step = visit181_689_1(step || 1);
  _$jscoverage['/underscore.js'].lineData[691]++;
  var length = Math.max(Math.ceil((stop - start) / step), 0);
  _$jscoverage['/underscore.js'].lineData[692]++;
  var range = Array(length);
  _$jscoverage['/underscore.js'].lineData[694]++;
  for (var idx = 0; visit182_694_1(idx < length); idx++ , start += step) {
    _$jscoverage['/underscore.js'].lineData[695]++;
    range[idx] = start;
  }
  _$jscoverage['/underscore.js'].lineData[698]++;
  return range;
};
  _$jscoverage['/underscore.js'].lineData[703]++;
  _.chunk = function(array, count) {
  _$jscoverage['/underscore.js'].functionData[69]++;
  _$jscoverage['/underscore.js'].lineData[704]++;
  if (visit183_704_1(visit184_704_2(count == null) || visit185_704_3(count < 1))) 
    return [];
  _$jscoverage['/underscore.js'].lineData[706]++;
  var result = [];
  _$jscoverage['/underscore.js'].lineData[707]++;
  var i = 0, length = array.length;
  _$jscoverage['/underscore.js'].lineData[708]++;
  while (visit186_708_1(i < length)) {
    _$jscoverage['/underscore.js'].lineData[709]++;
    result.push(slice.call(array, i, i += count));
  }
  _$jscoverage['/underscore.js'].lineData[711]++;
  return result;
};
  _$jscoverage['/underscore.js'].lineData[719]++;
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
  _$jscoverage['/underscore.js'].functionData[70]++;
  _$jscoverage['/underscore.js'].lineData[720]++;
  if (visit187_720_1(!(callingContext instanceof boundFunc))) 
    return sourceFunc.apply(context, args);
  _$jscoverage['/underscore.js'].lineData[721]++;
  var self = baseCreate(sourceFunc.prototype);
  _$jscoverage['/underscore.js'].lineData[722]++;
  var result = sourceFunc.apply(self, args);
  _$jscoverage['/underscore.js'].lineData[723]++;
  if (visit188_723_1(_.isObject(result))) 
    return result;
  _$jscoverage['/underscore.js'].lineData[724]++;
  return self;
};
  _$jscoverage['/underscore.js'].lineData[730]++;
  _.bind = restArgs(function(func, context, args) {
  _$jscoverage['/underscore.js'].functionData[71]++;
  _$jscoverage['/underscore.js'].lineData[731]++;
  if (visit189_731_1(!_.isFunction(func))) 
    throw new TypeError('Bind must be called on a function');
  _$jscoverage['/underscore.js'].lineData[732]++;
  var bound = restArgs(function(callArgs) {
  _$jscoverage['/underscore.js'].functionData[72]++;
  _$jscoverage['/underscore.js'].lineData[733]++;
  return executeBound(func, bound, context, this, args.concat(callArgs));
});
  _$jscoverage['/underscore.js'].lineData[735]++;
  return bound;
});
  _$jscoverage['/underscore.js'].lineData[742]++;
  _.partial = restArgs(function(func, boundArgs) {
  _$jscoverage['/underscore.js'].functionData[73]++;
  _$jscoverage['/underscore.js'].lineData[743]++;
  var placeholder = _.partial.placeholder;
  _$jscoverage['/underscore.js'].lineData[744]++;
  var bound = function() {
  _$jscoverage['/underscore.js'].functionData[74]++;
  _$jscoverage['/underscore.js'].lineData[745]++;
  var position = 0, length = boundArgs.length;
  _$jscoverage['/underscore.js'].lineData[746]++;
  var args = Array(length);
  _$jscoverage['/underscore.js'].lineData[747]++;
  for (var i = 0; visit190_747_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[748]++;
    args[i] = visit191_748_1(boundArgs[i] === placeholder) ? arguments[position++] : boundArgs[i];
  }
  _$jscoverage['/underscore.js'].lineData[750]++;
  while (visit192_750_1(position < arguments.length)) 
    args.push(arguments[position++]);
  _$jscoverage['/underscore.js'].lineData[751]++;
  return executeBound(func, bound, this, this, args);
};
  _$jscoverage['/underscore.js'].lineData[753]++;
  return bound;
});
  _$jscoverage['/underscore.js'].lineData[756]++;
  _.partial.placeholder = _;
  _$jscoverage['/underscore.js'].lineData[761]++;
  _.bindAll = restArgs(function(obj, keys) {
  _$jscoverage['/underscore.js'].functionData[75]++;
  _$jscoverage['/underscore.js'].lineData[762]++;
  keys = flatten(keys, false, false);
  _$jscoverage['/underscore.js'].lineData[763]++;
  var index = keys.length;
  _$jscoverage['/underscore.js'].lineData[764]++;
  if (visit193_764_1(index < 1)) 
    throw new Error('bindAll must be passed function names');
  _$jscoverage['/underscore.js'].lineData[765]++;
  while (visit194_765_1(index--)) {
    _$jscoverage['/underscore.js'].lineData[766]++;
    var key = keys[index];
    _$jscoverage['/underscore.js'].lineData[767]++;
    obj[key] = _.bind(obj[key], obj);
  }
});
  _$jscoverage['/underscore.js'].lineData[772]++;
  _.memoize = function(func, hasher) {
  _$jscoverage['/underscore.js'].functionData[76]++;
  _$jscoverage['/underscore.js'].lineData[773]++;
  var memoize = function(key) {
  _$jscoverage['/underscore.js'].functionData[77]++;
  _$jscoverage['/underscore.js'].lineData[774]++;
  var cache = memoize.cache;
  _$jscoverage['/underscore.js'].lineData[775]++;
  var address = '' + (visit195_775_1(hasher) ? hasher.apply(this, arguments) : key);
  _$jscoverage['/underscore.js'].lineData[776]++;
  if (visit196_776_1(!_.has(cache, address))) 
    cache[address] = func.apply(this, arguments);
  _$jscoverage['/underscore.js'].lineData[777]++;
  return cache[address];
};
  _$jscoverage['/underscore.js'].lineData[779]++;
  memoize.cache = {};
  _$jscoverage['/underscore.js'].lineData[780]++;
  return memoize;
};
  _$jscoverage['/underscore.js'].lineData[785]++;
  _.delay = restArgs(function(func, wait, args) {
  _$jscoverage['/underscore.js'].functionData[78]++;
  _$jscoverage['/underscore.js'].lineData[786]++;
  return setTimeout(function() {
  _$jscoverage['/underscore.js'].functionData[79]++;
  _$jscoverage['/underscore.js'].lineData[787]++;
  return func.apply(null, args);
}, wait);
});
  _$jscoverage['/underscore.js'].lineData[793]++;
  _.defer = _.partial(_.delay, _, 1);
  _$jscoverage['/underscore.js'].lineData[800]++;
  _.throttle = function(func, wait, options) {
  _$jscoverage['/underscore.js'].functionData[80]++;
  _$jscoverage['/underscore.js'].lineData[801]++;
  var context, args, result;
  _$jscoverage['/underscore.js'].lineData[802]++;
  var timeout = null;
  _$jscoverage['/underscore.js'].lineData[803]++;
  var previous = 0;
  _$jscoverage['/underscore.js'].lineData[804]++;
  if (visit197_804_1(!options)) 
    options = {};
  _$jscoverage['/underscore.js'].lineData[805]++;
  var later = function() {
  _$jscoverage['/underscore.js'].functionData[81]++;
  _$jscoverage['/underscore.js'].lineData[806]++;
  previous = visit198_806_1(options.leading === false) ? 0 : _.now();
  _$jscoverage['/underscore.js'].lineData[807]++;
  timeout = null;
  _$jscoverage['/underscore.js'].lineData[808]++;
  result = func.apply(context, args);
  _$jscoverage['/underscore.js'].lineData[809]++;
  if (visit199_809_1(!timeout)) 
    context = args = null;
};
  _$jscoverage['/underscore.js'].lineData[811]++;
  return function() {
  _$jscoverage['/underscore.js'].functionData[82]++;
  _$jscoverage['/underscore.js'].lineData[812]++;
  var now = _.now();
  _$jscoverage['/underscore.js'].lineData[813]++;
  if (visit200_813_1(!previous && visit201_813_2(options.leading === false))) 
    previous = now;
  _$jscoverage['/underscore.js'].lineData[814]++;
  var remaining = wait - (now - previous);
  _$jscoverage['/underscore.js'].lineData[815]++;
  context = this;
  _$jscoverage['/underscore.js'].lineData[816]++;
  args = arguments;
  _$jscoverage['/underscore.js'].lineData[817]++;
  if (visit202_817_1(visit203_817_2(remaining <= 0) || visit204_817_3(remaining > wait))) {
    _$jscoverage['/underscore.js'].lineData[818]++;
    if (visit205_818_1(timeout)) {
      _$jscoverage['/underscore.js'].lineData[819]++;
      clearTimeout(timeout);
      _$jscoverage['/underscore.js'].lineData[820]++;
      timeout = null;
    }
    _$jscoverage['/underscore.js'].lineData[822]++;
    previous = now;
    _$jscoverage['/underscore.js'].lineData[823]++;
    result = func.apply(context, args);
    _$jscoverage['/underscore.js'].lineData[824]++;
    if (visit206_824_1(!timeout)) 
      context = args = null;
  } else {
    _$jscoverage['/underscore.js'].lineData[825]++;
    if (visit207_825_1(!timeout && visit208_825_2(options.trailing !== false))) {
      _$jscoverage['/underscore.js'].lineData[826]++;
      timeout = setTimeout(later, remaining);
    }
  }
  _$jscoverage['/underscore.js'].lineData[828]++;
  return result;
};
};
  _$jscoverage['/underscore.js'].lineData[836]++;
  _.debounce = function(func, wait, immediate) {
  _$jscoverage['/underscore.js'].functionData[83]++;
  _$jscoverage['/underscore.js'].lineData[837]++;
  var timeout, args, context, timestamp, result;
  _$jscoverage['/underscore.js'].lineData[839]++;
  var later = function() {
  _$jscoverage['/underscore.js'].functionData[84]++;
  _$jscoverage['/underscore.js'].lineData[840]++;
  var last = _.now() - timestamp;
  _$jscoverage['/underscore.js'].lineData[842]++;
  if (visit209_842_1(visit210_842_2(last < wait) && visit211_842_3(last >= 0))) {
    _$jscoverage['/underscore.js'].lineData[843]++;
    timeout = setTimeout(later, wait - last);
  } else {
    _$jscoverage['/underscore.js'].lineData[845]++;
    timeout = null;
    _$jscoverage['/underscore.js'].lineData[846]++;
    if (visit212_846_1(!immediate)) {
      _$jscoverage['/underscore.js'].lineData[847]++;
      result = func.apply(context, args);
      _$jscoverage['/underscore.js'].lineData[848]++;
      if (visit213_848_1(!timeout)) 
        context = args = null;
    }
  }
};
  _$jscoverage['/underscore.js'].lineData[853]++;
  return function() {
  _$jscoverage['/underscore.js'].functionData[85]++;
  _$jscoverage['/underscore.js'].lineData[854]++;
  context = this;
  _$jscoverage['/underscore.js'].lineData[855]++;
  args = arguments;
  _$jscoverage['/underscore.js'].lineData[856]++;
  timestamp = _.now();
  _$jscoverage['/underscore.js'].lineData[857]++;
  var callNow = visit214_857_1(immediate && !timeout);
  _$jscoverage['/underscore.js'].lineData[858]++;
  if (visit215_858_1(!timeout)) 
    timeout = setTimeout(later, wait);
  _$jscoverage['/underscore.js'].lineData[859]++;
  if (visit216_859_1(callNow)) {
    _$jscoverage['/underscore.js'].lineData[860]++;
    result = func.apply(context, args);
    _$jscoverage['/underscore.js'].lineData[861]++;
    context = args = null;
  }
  _$jscoverage['/underscore.js'].lineData[864]++;
  return result;
};
};
  _$jscoverage['/underscore.js'].lineData[871]++;
  _.wrap = function(func, wrapper) {
  _$jscoverage['/underscore.js'].functionData[86]++;
  _$jscoverage['/underscore.js'].lineData[872]++;
  return _.partial(wrapper, func);
};
  _$jscoverage['/underscore.js'].lineData[876]++;
  _.negate = function(predicate) {
  _$jscoverage['/underscore.js'].functionData[87]++;
  _$jscoverage['/underscore.js'].lineData[877]++;
  return function() {
  _$jscoverage['/underscore.js'].functionData[88]++;
  _$jscoverage['/underscore.js'].lineData[878]++;
  return !predicate.apply(this, arguments);
};
};
  _$jscoverage['/underscore.js'].lineData[884]++;
  _.compose = function() {
  _$jscoverage['/underscore.js'].functionData[89]++;
  _$jscoverage['/underscore.js'].lineData[885]++;
  var args = arguments;
  _$jscoverage['/underscore.js'].lineData[886]++;
  var start = args.length - 1;
  _$jscoverage['/underscore.js'].lineData[887]++;
  return function() {
  _$jscoverage['/underscore.js'].functionData[90]++;
  _$jscoverage['/underscore.js'].lineData[888]++;
  var i = start;
  _$jscoverage['/underscore.js'].lineData[889]++;
  var result = args[start].apply(this, arguments);
  _$jscoverage['/underscore.js'].lineData[890]++;
  while (visit217_890_1(i--)) 
    result = args[i].call(this, result);
  _$jscoverage['/underscore.js'].lineData[891]++;
  return result;
};
};
  _$jscoverage['/underscore.js'].lineData[896]++;
  _.after = function(times, func) {
  _$jscoverage['/underscore.js'].functionData[91]++;
  _$jscoverage['/underscore.js'].lineData[897]++;
  return function() {
  _$jscoverage['/underscore.js'].functionData[92]++;
  _$jscoverage['/underscore.js'].lineData[898]++;
  if (visit218_898_1(--times < 1)) {
    _$jscoverage['/underscore.js'].lineData[899]++;
    return func.apply(this, arguments);
  }
};
};
  _$jscoverage['/underscore.js'].lineData[905]++;
  _.before = function(times, func) {
  _$jscoverage['/underscore.js'].functionData[93]++;
  _$jscoverage['/underscore.js'].lineData[906]++;
  var memo;
  _$jscoverage['/underscore.js'].lineData[907]++;
  return function() {
  _$jscoverage['/underscore.js'].functionData[94]++;
  _$jscoverage['/underscore.js'].lineData[908]++;
  if (visit219_908_1(--times > 0)) {
    _$jscoverage['/underscore.js'].lineData[909]++;
    memo = func.apply(this, arguments);
  }
  _$jscoverage['/underscore.js'].lineData[911]++;
  if (visit220_911_1(times <= 1)) 
    func = null;
  _$jscoverage['/underscore.js'].lineData[912]++;
  return memo;
};
};
  _$jscoverage['/underscore.js'].lineData[918]++;
  _.once = _.partial(_.before, 2);
  _$jscoverage['/underscore.js'].lineData[920]++;
  _.restArgs = restArgs;
  _$jscoverage['/underscore.js'].lineData[926]++;
  var hasEnumBug = !{
  toString: null}.propertyIsEnumerable('toString');
  _$jscoverage['/underscore.js'].lineData[927]++;
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
  _$jscoverage['/underscore.js'].lineData[930]++;
  var collectNonEnumProps = function(obj, keys) {
  _$jscoverage['/underscore.js'].functionData[95]++;
  _$jscoverage['/underscore.js'].lineData[931]++;
  var nonEnumIdx = nonEnumerableProps.length;
  _$jscoverage['/underscore.js'].lineData[932]++;
  var constructor = obj.constructor;
  _$jscoverage['/underscore.js'].lineData[933]++;
  var proto = visit221_933_1(visit222_933_2(_.isFunction(constructor) && constructor.prototype) || ObjProto);
  _$jscoverage['/underscore.js'].lineData[936]++;
  var prop = 'constructor';
  _$jscoverage['/underscore.js'].lineData[937]++;
  if (visit223_937_1(_.has(obj, prop) && !_.contains(keys, prop))) 
    keys.push(prop);
  _$jscoverage['/underscore.js'].lineData[939]++;
  while (visit224_939_1(nonEnumIdx--)) {
    _$jscoverage['/underscore.js'].lineData[940]++;
    prop = nonEnumerableProps[nonEnumIdx];
    _$jscoverage['/underscore.js'].lineData[941]++;
    if (visit225_941_1(prop in obj && visit226_941_2(visit227_941_3(obj[prop] !== proto[prop]) && !_.contains(keys, prop)))) {
      _$jscoverage['/underscore.js'].lineData[942]++;
      keys.push(prop);
    }
  }
};
  _$jscoverage['/underscore.js'].lineData[949]++;
  _.keys = function(obj) {
  _$jscoverage['/underscore.js'].functionData[96]++;
  _$jscoverage['/underscore.js'].lineData[950]++;
  if (visit228_950_1(!_.isObject(obj))) 
    return [];
  _$jscoverage['/underscore.js'].lineData[951]++;
  if (visit229_951_1(nativeKeys)) 
    return nativeKeys(obj);
  _$jscoverage['/underscore.js'].lineData[952]++;
  var keys = [];
  _$jscoverage['/underscore.js'].lineData[953]++;
  for (var key in obj) 
    if (visit230_953_1(_.has(obj, key))) 
      keys.push(key);
  _$jscoverage['/underscore.js'].lineData[955]++;
  if (visit231_955_1(hasEnumBug)) 
    collectNonEnumProps(obj, keys);
  _$jscoverage['/underscore.js'].lineData[956]++;
  return keys;
};
  _$jscoverage['/underscore.js'].lineData[960]++;
  _.allKeys = function(obj) {
  _$jscoverage['/underscore.js'].functionData[97]++;
  _$jscoverage['/underscore.js'].lineData[961]++;
  if (visit232_961_1(!_.isObject(obj))) 
    return [];
  _$jscoverage['/underscore.js'].lineData[962]++;
  var keys = [];
  _$jscoverage['/underscore.js'].lineData[963]++;
  for (var key in obj) 
    keys.push(key);
  _$jscoverage['/underscore.js'].lineData[965]++;
  if (visit233_965_1(hasEnumBug)) 
    collectNonEnumProps(obj, keys);
  _$jscoverage['/underscore.js'].lineData[966]++;
  return keys;
};
  _$jscoverage['/underscore.js'].lineData[970]++;
  _.values = function(obj) {
  _$jscoverage['/underscore.js'].functionData[98]++;
  _$jscoverage['/underscore.js'].lineData[971]++;
  var keys = _.keys(obj);
  _$jscoverage['/underscore.js'].lineData[972]++;
  var length = keys.length;
  _$jscoverage['/underscore.js'].lineData[973]++;
  var values = Array(length);
  _$jscoverage['/underscore.js'].lineData[974]++;
  for (var i = 0; visit234_974_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[975]++;
    values[i] = obj[keys[i]];
  }
  _$jscoverage['/underscore.js'].lineData[977]++;
  return values;
};
  _$jscoverage['/underscore.js'].lineData[982]++;
  _.mapObject = function(obj, iteratee, context) {
  _$jscoverage['/underscore.js'].functionData[99]++;
  _$jscoverage['/underscore.js'].lineData[983]++;
  iteratee = cb(iteratee, context);
  _$jscoverage['/underscore.js'].lineData[984]++;
  var keys = _.keys(obj), length = keys.length, results = {};
  _$jscoverage['/underscore.js'].lineData[987]++;
  for (var index = 0; visit235_987_1(index < length); index++) {
    _$jscoverage['/underscore.js'].lineData[988]++;
    var currentKey = keys[index];
    _$jscoverage['/underscore.js'].lineData[989]++;
    results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
  }
  _$jscoverage['/underscore.js'].lineData[991]++;
  return results;
};
  _$jscoverage['/underscore.js'].lineData[995]++;
  _.pairs = function(obj) {
  _$jscoverage['/underscore.js'].functionData[100]++;
  _$jscoverage['/underscore.js'].lineData[996]++;
  var keys = _.keys(obj);
  _$jscoverage['/underscore.js'].lineData[997]++;
  var length = keys.length;
  _$jscoverage['/underscore.js'].lineData[998]++;
  var pairs = Array(length);
  _$jscoverage['/underscore.js'].lineData[999]++;
  for (var i = 0; visit236_999_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[1000]++;
    pairs[i] = [keys[i], obj[keys[i]]];
  }
  _$jscoverage['/underscore.js'].lineData[1002]++;
  return pairs;
};
  _$jscoverage['/underscore.js'].lineData[1006]++;
  _.invert = function(obj) {
  _$jscoverage['/underscore.js'].functionData[101]++;
  _$jscoverage['/underscore.js'].lineData[1007]++;
  var result = {};
  _$jscoverage['/underscore.js'].lineData[1008]++;
  var keys = _.keys(obj);
  _$jscoverage['/underscore.js'].lineData[1009]++;
  for (var i = 0, length = keys.length; visit237_1009_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[1010]++;
    result[obj[keys[i]]] = keys[i];
  }
  _$jscoverage['/underscore.js'].lineData[1012]++;
  return result;
};
  _$jscoverage['/underscore.js'].lineData[1017]++;
  _.functions = _.methods = function(obj) {
  _$jscoverage['/underscore.js'].functionData[102]++;
  _$jscoverage['/underscore.js'].lineData[1018]++;
  var names = [];
  _$jscoverage['/underscore.js'].lineData[1019]++;
  for (var key in obj) {
    _$jscoverage['/underscore.js'].lineData[1020]++;
    if (visit238_1020_1(_.isFunction(obj[key]))) 
      names.push(key);
  }
  _$jscoverage['/underscore.js'].lineData[1022]++;
  return names.sort();
};
  _$jscoverage['/underscore.js'].lineData[1026]++;
  var createAssigner = function(keysFunc, defaults) {
  _$jscoverage['/underscore.js'].functionData[103]++;
  _$jscoverage['/underscore.js'].lineData[1027]++;
  return function(obj) {
  _$jscoverage['/underscore.js'].functionData[104]++;
  _$jscoverage['/underscore.js'].lineData[1028]++;
  var length = arguments.length;
  _$jscoverage['/underscore.js'].lineData[1029]++;
  if (visit239_1029_1(defaults)) 
    obj = Object(obj);
  _$jscoverage['/underscore.js'].lineData[1030]++;
  if (visit240_1030_1(visit241_1030_2(length < 2) || visit242_1030_3(obj == null))) 
    return obj;
  _$jscoverage['/underscore.js'].lineData[1031]++;
  for (var index = 1; visit243_1031_1(index < length); index++) {
    _$jscoverage['/underscore.js'].lineData[1032]++;
    var source = arguments[index], keys = keysFunc(source), l = keys.length;
    _$jscoverage['/underscore.js'].lineData[1035]++;
    for (var i = 0; visit244_1035_1(i < l); i++) {
      _$jscoverage['/underscore.js'].lineData[1036]++;
      var key = keys[i];
      _$jscoverage['/underscore.js'].lineData[1037]++;
      if (visit245_1037_1(!defaults || visit246_1037_2(obj[key] === void 0))) 
        obj[key] = source[key];
    }
  }
  _$jscoverage['/underscore.js'].lineData[1040]++;
  return obj;
};
};
  _$jscoverage['/underscore.js'].lineData[1045]++;
  _.extend = createAssigner(_.allKeys);
  _$jscoverage['/underscore.js'].lineData[1049]++;
  _.extendOwn = _.assign = createAssigner(_.keys);
  _$jscoverage['/underscore.js'].lineData[1052]++;
  _.findKey = function(obj, predicate, context) {
  _$jscoverage['/underscore.js'].functionData[105]++;
  _$jscoverage['/underscore.js'].lineData[1053]++;
  predicate = cb(predicate, context);
  _$jscoverage['/underscore.js'].lineData[1054]++;
  var keys = _.keys(obj), key;
  _$jscoverage['/underscore.js'].lineData[1055]++;
  for (var i = 0, length = keys.length; visit247_1055_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[1056]++;
    key = keys[i];
    _$jscoverage['/underscore.js'].lineData[1057]++;
    if (visit248_1057_1(predicate(obj[key], key, obj))) 
      return key;
  }
};
  _$jscoverage['/underscore.js'].lineData[1062]++;
  var keyInObj = function(value, key, obj) {
  _$jscoverage['/underscore.js'].functionData[106]++;
  _$jscoverage['/underscore.js'].lineData[1063]++;
  return key in obj;
};
  _$jscoverage['/underscore.js'].lineData[1067]++;
  _.pick = restArgs(function(obj, keys) {
  _$jscoverage['/underscore.js'].functionData[107]++;
  _$jscoverage['/underscore.js'].lineData[1068]++;
  var result = {}, iteratee = keys[0];
  _$jscoverage['/underscore.js'].lineData[1069]++;
  if (visit249_1069_1(obj == null)) 
    return result;
  _$jscoverage['/underscore.js'].lineData[1070]++;
  if (visit250_1070_1(_.isFunction(iteratee))) {
    _$jscoverage['/underscore.js'].lineData[1071]++;
    if (visit251_1071_1(keys.length > 1)) 
      iteratee = optimizeCb(iteratee, keys[1]);
    _$jscoverage['/underscore.js'].lineData[1072]++;
    keys = _.allKeys(obj);
  } else {
    _$jscoverage['/underscore.js'].lineData[1074]++;
    iteratee = keyInObj;
    _$jscoverage['/underscore.js'].lineData[1075]++;
    keys = flatten(keys, false, false);
    _$jscoverage['/underscore.js'].lineData[1076]++;
    obj = Object(obj);
  }
  _$jscoverage['/underscore.js'].lineData[1078]++;
  for (var i = 0, length = keys.length; visit252_1078_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[1079]++;
    var key = keys[i];
    _$jscoverage['/underscore.js'].lineData[1080]++;
    var value = obj[key];
    _$jscoverage['/underscore.js'].lineData[1081]++;
    if (visit253_1081_1(iteratee(value, key, obj))) 
      result[key] = value;
  }
  _$jscoverage['/underscore.js'].lineData[1083]++;
  return result;
});
  _$jscoverage['/underscore.js'].lineData[1087]++;
  _.omit = restArgs(function(obj, keys) {
  _$jscoverage['/underscore.js'].functionData[108]++;
  _$jscoverage['/underscore.js'].lineData[1088]++;
  var iteratee = keys[0], context;
  _$jscoverage['/underscore.js'].lineData[1089]++;
  if (visit254_1089_1(_.isFunction(iteratee))) {
    _$jscoverage['/underscore.js'].lineData[1090]++;
    iteratee = _.negate(iteratee);
    _$jscoverage['/underscore.js'].lineData[1091]++;
    if (visit255_1091_1(keys.length > 1)) 
      context = keys[1];
  } else {
    _$jscoverage['/underscore.js'].lineData[1093]++;
    keys = _.map(flatten(keys, false, false), String);
    _$jscoverage['/underscore.js'].lineData[1094]++;
    iteratee = function(value, key) {
  _$jscoverage['/underscore.js'].functionData[109]++;
  _$jscoverage['/underscore.js'].lineData[1095]++;
  return !_.contains(keys, key);
};
  }
  _$jscoverage['/underscore.js'].lineData[1098]++;
  return _.pick(obj, iteratee, context);
});
  _$jscoverage['/underscore.js'].lineData[1102]++;
  _.defaults = createAssigner(_.allKeys, true);
  _$jscoverage['/underscore.js'].lineData[1107]++;
  _.create = function(prototype, props) {
  _$jscoverage['/underscore.js'].functionData[110]++;
  _$jscoverage['/underscore.js'].lineData[1108]++;
  var result = baseCreate(prototype);
  _$jscoverage['/underscore.js'].lineData[1109]++;
  if (visit256_1109_1(props)) 
    _.extendOwn(result, props);
  _$jscoverage['/underscore.js'].lineData[1110]++;
  return result;
};
  _$jscoverage['/underscore.js'].lineData[1114]++;
  _.clone = function(obj) {
  _$jscoverage['/underscore.js'].functionData[111]++;
  _$jscoverage['/underscore.js'].lineData[1115]++;
  if (visit257_1115_1(!_.isObject(obj))) 
    return obj;
  _$jscoverage['/underscore.js'].lineData[1116]++;
  return visit258_1116_1(_.isArray(obj)) ? obj.slice() : _.extend({}, obj);
};
  _$jscoverage['/underscore.js'].lineData[1122]++;
  _.tap = function(obj, interceptor) {
  _$jscoverage['/underscore.js'].functionData[112]++;
  _$jscoverage['/underscore.js'].lineData[1123]++;
  interceptor(obj);
  _$jscoverage['/underscore.js'].lineData[1124]++;
  return obj;
};
  _$jscoverage['/underscore.js'].lineData[1128]++;
  _.isMatch = function(object, attrs) {
  _$jscoverage['/underscore.js'].functionData[113]++;
  _$jscoverage['/underscore.js'].lineData[1129]++;
  var keys = _.keys(attrs), length = keys.length;
  _$jscoverage['/underscore.js'].lineData[1130]++;
  if (visit259_1130_1(object == null)) 
    return !length;
  _$jscoverage['/underscore.js'].lineData[1131]++;
  var obj = Object(object);
  _$jscoverage['/underscore.js'].lineData[1132]++;
  for (var i = 0; visit260_1132_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[1133]++;
    var key = keys[i];
    _$jscoverage['/underscore.js'].lineData[1134]++;
    if (visit261_1134_1(visit262_1134_2(attrs[key] !== obj[key]) || !(key in obj))) 
      return false;
  }
  _$jscoverage['/underscore.js'].lineData[1136]++;
  return true;
};
  _$jscoverage['/underscore.js'].lineData[1141]++;
  var eq, deepEq;
  _$jscoverage['/underscore.js'].lineData[1142]++;
  eq = function(a, b, aStack, bStack) {
  _$jscoverage['/underscore.js'].functionData[114]++;
  _$jscoverage['/underscore.js'].lineData[1145]++;
  if (visit263_1145_1(a === b)) 
    return visit264_1145_2(visit265_1145_3(a !== 0) || visit266_1145_4(1 / a === 1 / b));
  _$jscoverage['/underscore.js'].lineData[1147]++;
  if (visit267_1147_1(visit268_1147_2(a == null) || visit269_1147_3(b == null))) 
    return visit270_1147_4(a === b);
  _$jscoverage['/underscore.js'].lineData[1149]++;
  if (visit271_1149_1(a !== a)) 
    return visit272_1149_2(b !== b);
  _$jscoverage['/underscore.js'].lineData[1151]++;
  var type = typeof a;
  _$jscoverage['/underscore.js'].lineData[1152]++;
  if (visit273_1152_1(visit274_1152_2(type !== 'function') && visit275_1152_3(visit276_1152_4(type !== 'object') && visit277_1152_5(typeof b !== 'object')))) 
    return false;
  _$jscoverage['/underscore.js'].lineData[1153]++;
  return deepEq(a, b, aStack, bStack);
};
  _$jscoverage['/underscore.js'].lineData[1157]++;
  deepEq = function(a, b, aStack, bStack) {
  _$jscoverage['/underscore.js'].functionData[115]++;
  _$jscoverage['/underscore.js'].lineData[1159]++;
  if (visit278_1159_1(a instanceof _)) 
    a = a._wrapped;
  _$jscoverage['/underscore.js'].lineData[1160]++;
  if (visit279_1160_1(b instanceof _)) 
    b = b._wrapped;
  _$jscoverage['/underscore.js'].lineData[1162]++;
  var className = toString.call(a);
  _$jscoverage['/underscore.js'].lineData[1163]++;
  if (visit280_1163_1(className !== toString.call(b))) 
    return false;
  _$jscoverage['/underscore.js'].lineData[1164]++;
  switch (className) {
    case '[object RegExp]':
      _$jscoverage['/underscore.js'].lineData[1166]++;
    case '[object String]':
      _$jscoverage['/underscore.js'].lineData[1171]++;
      return visit281_1171_1('' + a === '' + b);
    case '[object Number]':
      _$jscoverage['/underscore.js'].lineData[1175]++;
      if (visit282_1175_1(+a !== +a)) 
        return visit283_1175_2(+b !== +b);
      _$jscoverage['/underscore.js'].lineData[1177]++;
      return visit284_1177_1(+a === 0) ? visit285_1177_2(1 / +a === 1 / b) : visit286_1177_3(+a === +b);
    case '[object Date]':
      _$jscoverage['/underscore.js'].lineData[1178]++;
    case '[object Boolean]':
      _$jscoverage['/underscore.js'].lineData[1183]++;
      return visit287_1183_1(+a === +b);
  }
  _$jscoverage['/underscore.js'].lineData[1186]++;
  var areArrays = visit288_1186_1(className === '[object Array]');
  _$jscoverage['/underscore.js'].lineData[1187]++;
  if (visit289_1187_1(!areArrays)) {
    _$jscoverage['/underscore.js'].lineData[1188]++;
    if (visit290_1188_1(visit291_1188_2(typeof a != 'object') || visit292_1188_3(typeof b != 'object'))) 
      return false;
    _$jscoverage['/underscore.js'].lineData[1192]++;
    var aCtor = a.constructor, bCtor = b.constructor;
    _$jscoverage['/underscore.js'].lineData[1193]++;
    if (visit293_1193_1(visit294_1193_2(aCtor !== bCtor) && visit295_1193_3(!(visit296_1193_4(_.isFunction(aCtor) && visit297_1193_5(aCtor instanceof aCtor && visit298_1194_1(_.isFunction(bCtor) && bCtor instanceof bCtor)))) && (visit299_1195_1('constructor' in a && 'constructor' in b))))) {
      _$jscoverage['/underscore.js'].lineData[1196]++;
      return false;
    }
  }
  _$jscoverage['/underscore.js'].lineData[1204]++;
  aStack = visit300_1204_1(aStack || []);
  _$jscoverage['/underscore.js'].lineData[1205]++;
  bStack = visit301_1205_1(bStack || []);
  _$jscoverage['/underscore.js'].lineData[1206]++;
  var length = aStack.length;
  _$jscoverage['/underscore.js'].lineData[1207]++;
  while (visit302_1207_1(length--)) {
    _$jscoverage['/underscore.js'].lineData[1210]++;
    if (visit303_1210_1(aStack[length] === a)) 
      return visit304_1210_2(bStack[length] === b);
  }
  _$jscoverage['/underscore.js'].lineData[1214]++;
  aStack.push(a);
  _$jscoverage['/underscore.js'].lineData[1215]++;
  bStack.push(b);
  _$jscoverage['/underscore.js'].lineData[1218]++;
  if (visit305_1218_1(areArrays)) {
    _$jscoverage['/underscore.js'].lineData[1220]++;
    length = a.length;
    _$jscoverage['/underscore.js'].lineData[1221]++;
    if (visit306_1221_1(length !== b.length)) 
      return false;
    _$jscoverage['/underscore.js'].lineData[1223]++;
    while (visit307_1223_1(length--)) {
      _$jscoverage['/underscore.js'].lineData[1224]++;
      if (visit308_1224_1(!eq(a[length], b[length], aStack, bStack))) 
        return false;
    }
  } else {
    _$jscoverage['/underscore.js'].lineData[1228]++;
    var keys = _.keys(a), key;
    _$jscoverage['/underscore.js'].lineData[1229]++;
    length = keys.length;
    _$jscoverage['/underscore.js'].lineData[1231]++;
    if (visit309_1231_1(_.keys(b).length !== length)) 
      return false;
    _$jscoverage['/underscore.js'].lineData[1232]++;
    while (visit310_1232_1(length--)) {
      _$jscoverage['/underscore.js'].lineData[1234]++;
      key = keys[length];
      _$jscoverage['/underscore.js'].lineData[1235]++;
      if (visit311_1235_1(!(visit312_1235_2(_.has(b, key) && eq(a[key], b[key], aStack, bStack))))) 
        return false;
    }
  }
  _$jscoverage['/underscore.js'].lineData[1239]++;
  aStack.pop();
  _$jscoverage['/underscore.js'].lineData[1240]++;
  bStack.pop();
  _$jscoverage['/underscore.js'].lineData[1241]++;
  return true;
};
  _$jscoverage['/underscore.js'].lineData[1245]++;
  _.isEqual = function(a, b) {
  _$jscoverage['/underscore.js'].functionData[116]++;
  _$jscoverage['/underscore.js'].lineData[1246]++;
  return eq(a, b);
};
  _$jscoverage['/underscore.js'].lineData[1251]++;
  _.isEmpty = function(obj) {
  _$jscoverage['/underscore.js'].functionData[117]++;
  _$jscoverage['/underscore.js'].lineData[1252]++;
  if (visit313_1252_1(obj == null)) 
    return true;
  _$jscoverage['/underscore.js'].lineData[1253]++;
  if (visit314_1253_1(isArrayLike(obj) && (visit315_1253_2(_.isArray(obj) || visit316_1253_3(_.isString(obj) || _.isArguments(obj)))))) 
    return visit317_1253_4(obj.length === 0);
  _$jscoverage['/underscore.js'].lineData[1254]++;
  return visit318_1254_1(_.keys(obj).length === 0);
};
  _$jscoverage['/underscore.js'].lineData[1258]++;
  _.isElement = function(obj) {
  _$jscoverage['/underscore.js'].functionData[118]++;
  _$jscoverage['/underscore.js'].lineData[1259]++;
  return !!(visit319_1259_1(obj && visit320_1259_2(obj.nodeType === 1)));
};
  _$jscoverage['/underscore.js'].lineData[1264]++;
  _.isArray = visit321_1264_1(nativeIsArray || function(obj) {
  _$jscoverage['/underscore.js'].functionData[119]++;
  _$jscoverage['/underscore.js'].lineData[1265]++;
  return visit322_1265_1(toString.call(obj) === '[object Array]');
});
  _$jscoverage['/underscore.js'].lineData[1269]++;
  _.isObject = function(obj) {
  _$jscoverage['/underscore.js'].functionData[120]++;
  _$jscoverage['/underscore.js'].lineData[1270]++;
  var type = typeof obj;
  _$jscoverage['/underscore.js'].lineData[1271]++;
  return visit323_1271_1(visit324_1271_2(type === 'function') || visit325_1271_3(visit326_1271_4(type === 'object') && !!obj));
};
  _$jscoverage['/underscore.js'].lineData[1275]++;
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
  _$jscoverage['/underscore.js'].functionData[121]++;
  _$jscoverage['/underscore.js'].lineData[1276]++;
  _['is' + name] = function(obj) {
  _$jscoverage['/underscore.js'].functionData[122]++;
  _$jscoverage['/underscore.js'].lineData[1277]++;
  return visit327_1277_1(toString.call(obj) === '[object ' + name + ']');
};
});
  _$jscoverage['/underscore.js'].lineData[1283]++;
  if (visit328_1283_1(!_.isArguments(arguments))) {
    _$jscoverage['/underscore.js'].lineData[1284]++;
    _.isArguments = function(obj) {
  _$jscoverage['/underscore.js'].functionData[123]++;
  _$jscoverage['/underscore.js'].lineData[1285]++;
  return _.has(obj, 'callee');
};
  }
  _$jscoverage['/underscore.js'].lineData[1291]++;
  var nodelist = visit329_1291_1(root.document && root.document.childNodes);
  _$jscoverage['/underscore.js'].lineData[1292]++;
  if (visit330_1292_1(visit331_1292_2(typeof /./ != 'function') && visit332_1292_3(visit333_1292_4(typeof Int8Array != 'object') && visit334_1292_5(typeof nodelist != 'function')))) {
    _$jscoverage['/underscore.js'].lineData[1293]++;
    _.isFunction = function(obj) {
  _$jscoverage['/underscore.js'].functionData[124]++;
  _$jscoverage['/underscore.js'].lineData[1294]++;
  return visit335_1294_1(visit336_1294_2(typeof obj == 'function') || false);
};
  }
  _$jscoverage['/underscore.js'].lineData[1299]++;
  _.isFinite = function(obj) {
  _$jscoverage['/underscore.js'].functionData[125]++;
  _$jscoverage['/underscore.js'].lineData[1300]++;
  return visit337_1300_1(isFinite(obj) && !isNaN(parseFloat(obj)));
};
  _$jscoverage['/underscore.js'].lineData[1304]++;
  _.isNaN = function(obj) {
  _$jscoverage['/underscore.js'].functionData[126]++;
  _$jscoverage['/underscore.js'].lineData[1305]++;
  return visit338_1305_1(_.isNumber(obj) && isNaN(obj));
};
  _$jscoverage['/underscore.js'].lineData[1309]++;
  _.isBoolean = function(obj) {
  _$jscoverage['/underscore.js'].functionData[127]++;
  _$jscoverage['/underscore.js'].lineData[1310]++;
  return visit339_1310_1(visit340_1310_2(obj === true) || visit341_1310_3(visit342_1310_4(obj === false) || visit343_1310_5(toString.call(obj) === '[object Boolean]')));
};
  _$jscoverage['/underscore.js'].lineData[1314]++;
  _.isNull = function(obj) {
  _$jscoverage['/underscore.js'].functionData[128]++;
  _$jscoverage['/underscore.js'].lineData[1315]++;
  return visit344_1315_1(obj === null);
};
  _$jscoverage['/underscore.js'].lineData[1319]++;
  _.isUndefined = function(obj) {
  _$jscoverage['/underscore.js'].functionData[129]++;
  _$jscoverage['/underscore.js'].lineData[1320]++;
  return visit345_1320_1(obj === void 0);
};
  _$jscoverage['/underscore.js'].lineData[1325]++;
  _.has = function(obj, key) {
  _$jscoverage['/underscore.js'].functionData[130]++;
  _$jscoverage['/underscore.js'].lineData[1326]++;
  return visit346_1326_1(visit347_1326_2(obj != null) && hasOwnProperty.call(obj, key));
};
  _$jscoverage['/underscore.js'].lineData[1334]++;
  _.noConflict = function() {
  _$jscoverage['/underscore.js'].functionData[131]++;
  _$jscoverage['/underscore.js'].lineData[1335]++;
  root._ = previousUnderscore;
  _$jscoverage['/underscore.js'].lineData[1336]++;
  return this;
};
  _$jscoverage['/underscore.js'].lineData[1340]++;
  _.identity = function(value) {
  _$jscoverage['/underscore.js'].functionData[132]++;
  _$jscoverage['/underscore.js'].lineData[1341]++;
  return value;
};
  _$jscoverage['/underscore.js'].lineData[1345]++;
  _.constant = function(value) {
  _$jscoverage['/underscore.js'].functionData[133]++;
  _$jscoverage['/underscore.js'].lineData[1346]++;
  return function() {
  _$jscoverage['/underscore.js'].functionData[134]++;
  _$jscoverage['/underscore.js'].lineData[1347]++;
  return value;
};
};
  _$jscoverage['/underscore.js'].lineData[1351]++;
  _.noop = function() {
  _$jscoverage['/underscore.js'].functionData[135]++;
};
  _$jscoverage['/underscore.js'].lineData[1353]++;
  _.property = property;
  _$jscoverage['/underscore.js'].lineData[1356]++;
  _.propertyOf = function(obj) {
  _$jscoverage['/underscore.js'].functionData[136]++;
  _$jscoverage['/underscore.js'].lineData[1357]++;
  return visit348_1357_1(obj == null) ? function() {
  _$jscoverage['/underscore.js'].functionData[137]++;
} : function(key) {
  _$jscoverage['/underscore.js'].functionData[138]++;
  _$jscoverage['/underscore.js'].lineData[1358]++;
  return obj[key];
};
};
  _$jscoverage['/underscore.js'].lineData[1364]++;
  _.matcher = _.matches = function(attrs) {
  _$jscoverage['/underscore.js'].functionData[139]++;
  _$jscoverage['/underscore.js'].lineData[1365]++;
  attrs = _.extendOwn({}, attrs);
  _$jscoverage['/underscore.js'].lineData[1366]++;
  return function(obj) {
  _$jscoverage['/underscore.js'].functionData[140]++;
  _$jscoverage['/underscore.js'].lineData[1367]++;
  return _.isMatch(obj, attrs);
};
};
  _$jscoverage['/underscore.js'].lineData[1372]++;
  _.times = function(n, iteratee, context) {
  _$jscoverage['/underscore.js'].functionData[141]++;
  _$jscoverage['/underscore.js'].lineData[1373]++;
  var accum = Array(Math.max(0, n));
  _$jscoverage['/underscore.js'].lineData[1374]++;
  iteratee = optimizeCb(iteratee, context, 1);
  _$jscoverage['/underscore.js'].lineData[1375]++;
  for (var i = 0; visit349_1375_1(i < n); i++) 
    accum[i] = iteratee(i);
  _$jscoverage['/underscore.js'].lineData[1376]++;
  return accum;
};
  _$jscoverage['/underscore.js'].lineData[1380]++;
  _.random = function(min, max) {
  _$jscoverage['/underscore.js'].functionData[142]++;
  _$jscoverage['/underscore.js'].lineData[1381]++;
  if (visit350_1381_1(max == null)) {
    _$jscoverage['/underscore.js'].lineData[1382]++;
    max = min;
    _$jscoverage['/underscore.js'].lineData[1383]++;
    min = 0;
  }
  _$jscoverage['/underscore.js'].lineData[1385]++;
  return min + Math.floor(Math.random() * (max - min + 1));
};
  _$jscoverage['/underscore.js'].lineData[1389]++;
  _.now = visit351_1389_1(Date.now || function() {
  _$jscoverage['/underscore.js'].functionData[143]++;
  _$jscoverage['/underscore.js'].lineData[1390]++;
  return new Date().getTime();
});
  _$jscoverage['/underscore.js'].lineData[1394]++;
  var escapeMap = {
  '&': '&amp;', 
  '<': '&lt;', 
  '>': '&gt;', 
  '"': '&quot;', 
  "'": '&#x27;', 
  '`': '&#x60;'};
  _$jscoverage['/underscore.js'].lineData[1402]++;
  var unescapeMap = _.invert(escapeMap);
  _$jscoverage['/underscore.js'].lineData[1405]++;
  var createEscaper = function(map) {
  _$jscoverage['/underscore.js'].functionData[144]++;
  _$jscoverage['/underscore.js'].lineData[1406]++;
  var escaper = function(match) {
  _$jscoverage['/underscore.js'].functionData[145]++;
  _$jscoverage['/underscore.js'].lineData[1407]++;
  return map[match];
};
  _$jscoverage['/underscore.js'].lineData[1410]++;
  var source = '(?:' + _.keys(map).join('|') + ')';
  _$jscoverage['/underscore.js'].lineData[1411]++;
  var testRegexp = RegExp(source);
  _$jscoverage['/underscore.js'].lineData[1412]++;
  var replaceRegexp = RegExp(source, 'g');
  _$jscoverage['/underscore.js'].lineData[1413]++;
  return function(string) {
  _$jscoverage['/underscore.js'].functionData[146]++;
  _$jscoverage['/underscore.js'].lineData[1414]++;
  string = visit352_1414_1(string == null) ? '' : '' + string;
  _$jscoverage['/underscore.js'].lineData[1415]++;
  return visit353_1415_1(testRegexp.test(string)) ? string.replace(replaceRegexp, escaper) : string;
};
};
  _$jscoverage['/underscore.js'].lineData[1418]++;
  _.escape = createEscaper(escapeMap);
  _$jscoverage['/underscore.js'].lineData[1419]++;
  _.unescape = createEscaper(unescapeMap);
  _$jscoverage['/underscore.js'].lineData[1423]++;
  _.result = function(object, prop, fallback) {
  _$jscoverage['/underscore.js'].functionData[147]++;
  _$jscoverage['/underscore.js'].lineData[1424]++;
  var value = visit354_1424_1(object == null) ? void 0 : object[prop];
  _$jscoverage['/underscore.js'].lineData[1425]++;
  if (visit355_1425_1(value === void 0)) {
    _$jscoverage['/underscore.js'].lineData[1426]++;
    value = fallback;
  }
  _$jscoverage['/underscore.js'].lineData[1428]++;
  return visit356_1428_1(_.isFunction(value)) ? value.call(object) : value;
};
  _$jscoverage['/underscore.js'].lineData[1433]++;
  var idCounter = 0;
  _$jscoverage['/underscore.js'].lineData[1434]++;
  _.uniqueId = function(prefix) {
  _$jscoverage['/underscore.js'].functionData[148]++;
  _$jscoverage['/underscore.js'].lineData[1435]++;
  var id = ++idCounter + '';
  _$jscoverage['/underscore.js'].lineData[1436]++;
  return visit357_1436_1(prefix) ? prefix + id : id;
};
  _$jscoverage['/underscore.js'].lineData[1441]++;
  _.templateSettings = {
  evaluate: /<%([\s\S]+?)%>/g, 
  interpolate: /<%=([\s\S]+?)%>/g, 
  escape: /<%-([\s\S]+?)%>/g};
  _$jscoverage['/underscore.js'].lineData[1450]++;
  var noMatch = /(.)^/;
  _$jscoverage['/underscore.js'].lineData[1454]++;
  var escapes = {
  "'": "'", 
  '\\': '\\', 
  '\r': 'r', 
  '\n': 'n', 
  '\u2028': 'u2028', 
  '\u2029': 'u2029'};
  _$jscoverage['/underscore.js'].lineData[1463]++;
  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;
  _$jscoverage['/underscore.js'].lineData[1465]++;
  var escapeChar = function(match) {
  _$jscoverage['/underscore.js'].functionData[149]++;
  _$jscoverage['/underscore.js'].lineData[1466]++;
  return '\\' + escapes[match];
};
  _$jscoverage['/underscore.js'].lineData[1473]++;
  _.template = function(text, settings, oldSettings) {
  _$jscoverage['/underscore.js'].functionData[150]++;
  _$jscoverage['/underscore.js'].lineData[1474]++;
  if (visit358_1474_1(!settings && oldSettings)) 
    settings = oldSettings;
  _$jscoverage['/underscore.js'].lineData[1475]++;
  settings = _.defaults({}, settings, _.templateSettings);
  _$jscoverage['/underscore.js'].lineData[1478]++;
  var matcher = RegExp([(visit359_1479_1(settings.escape || noMatch)).source, (visit360_1480_1(settings.interpolate || noMatch)).source, (visit361_1481_1(settings.evaluate || noMatch)).source].join('|') + '|$', 'g');
  _$jscoverage['/underscore.js'].lineData[1485]++;
  var index = 0;
  _$jscoverage['/underscore.js'].lineData[1486]++;
  var source = "__p+='";
  _$jscoverage['/underscore.js'].lineData[1487]++;
  text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
  _$jscoverage['/underscore.js'].functionData[151]++;
  _$jscoverage['/underscore.js'].lineData[1488]++;
  source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
  _$jscoverage['/underscore.js'].lineData[1489]++;
  index = offset + match.length;
  _$jscoverage['/underscore.js'].lineData[1491]++;
  if (visit362_1491_1(escape)) {
    _$jscoverage['/underscore.js'].lineData[1492]++;
    source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
  } else {
    _$jscoverage['/underscore.js'].lineData[1493]++;
    if (visit363_1493_1(interpolate)) {
      _$jscoverage['/underscore.js'].lineData[1494]++;
      source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
    } else {
      _$jscoverage['/underscore.js'].lineData[1495]++;
      if (visit364_1495_1(evaluate)) {
        _$jscoverage['/underscore.js'].lineData[1496]++;
        source += "';\n" + evaluate + "\n__p+='";
      }
    }
  }
  _$jscoverage['/underscore.js'].lineData[1500]++;
  return match;
});
  _$jscoverage['/underscore.js'].lineData[1502]++;
  source += "';\n";
  _$jscoverage['/underscore.js'].lineData[1505]++;
  if (visit365_1505_1(!settings.variable)) 
    source = 'with(obj||{}){\n' + source + '}\n';
  _$jscoverage['/underscore.js'].lineData[1507]++;
  source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + 'return __p;\n';
  _$jscoverage['/underscore.js'].lineData[1511]++;
  var render;
  _$jscoverage['/underscore.js'].lineData[1512]++;
  try {
    _$jscoverage['/underscore.js'].lineData[1513]++;
    render = new Function(visit366_1513_1(settings.variable || 'obj'), '_', source);
  }  catch (e) {
  _$jscoverage['/underscore.js'].lineData[1515]++;
  e.source = source;
  _$jscoverage['/underscore.js'].lineData[1516]++;
  throw e;
}
  _$jscoverage['/underscore.js'].lineData[1519]++;
  var template = function(data) {
  _$jscoverage['/underscore.js'].functionData[152]++;
  _$jscoverage['/underscore.js'].lineData[1520]++;
  return render.call(this, data, _);
};
  _$jscoverage['/underscore.js'].lineData[1524]++;
  var argument = visit367_1524_1(settings.variable || 'obj');
  _$jscoverage['/underscore.js'].lineData[1525]++;
  template.source = 'function(' + argument + '){\n' + source + '}';
  _$jscoverage['/underscore.js'].lineData[1527]++;
  return template;
};
  _$jscoverage['/underscore.js'].lineData[1531]++;
  _.chain = function(obj) {
  _$jscoverage['/underscore.js'].functionData[153]++;
  _$jscoverage['/underscore.js'].lineData[1532]++;
  var instance = _(obj);
  _$jscoverage['/underscore.js'].lineData[1533]++;
  instance._chain = true;
  _$jscoverage['/underscore.js'].lineData[1534]++;
  return instance;
};
  _$jscoverage['/underscore.js'].lineData[1544]++;
  var chainResult = function(instance, obj) {
  _$jscoverage['/underscore.js'].functionData[154]++;
  _$jscoverage['/underscore.js'].lineData[1545]++;
  return visit368_1545_1(instance._chain) ? _(obj).chain() : obj;
};
  _$jscoverage['/underscore.js'].lineData[1549]++;
  _.mixin = function(obj) {
  _$jscoverage['/underscore.js'].functionData[155]++;
  _$jscoverage['/underscore.js'].lineData[1550]++;
  _.each(_.functions(obj), function(name) {
  _$jscoverage['/underscore.js'].functionData[156]++;
  _$jscoverage['/underscore.js'].lineData[1551]++;
  var func = _[name] = obj[name];
  _$jscoverage['/underscore.js'].lineData[1552]++;
  _.prototype[name] = function() {
  _$jscoverage['/underscore.js'].functionData[157]++;
  _$jscoverage['/underscore.js'].lineData[1553]++;
  var args = [this._wrapped];
  _$jscoverage['/underscore.js'].lineData[1554]++;
  push.apply(args, arguments);
  _$jscoverage['/underscore.js'].lineData[1555]++;
  return chainResult(this, func.apply(_, args));
};
});
};
  _$jscoverage['/underscore.js'].lineData[1561]++;
  _.mixin(_);
  _$jscoverage['/underscore.js'].lineData[1564]++;
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
  _$jscoverage['/underscore.js'].functionData[158]++;
  _$jscoverage['/underscore.js'].lineData[1565]++;
  var method = ArrayProto[name];
  _$jscoverage['/underscore.js'].lineData[1566]++;
  _.prototype[name] = function() {
  _$jscoverage['/underscore.js'].functionData[159]++;
  _$jscoverage['/underscore.js'].lineData[1567]++;
  var obj = this._wrapped;
  _$jscoverage['/underscore.js'].lineData[1568]++;
  method.apply(obj, arguments);
  _$jscoverage['/underscore.js'].lineData[1569]++;
  if (visit369_1569_1((visit370_1569_2(visit371_1569_3(name === 'shift') || visit372_1569_4(name === 'splice'))) && visit373_1569_5(obj.length === 0))) 
    delete obj[0];
  _$jscoverage['/underscore.js'].lineData[1570]++;
  return chainResult(this, obj);
};
});
  _$jscoverage['/underscore.js'].lineData[1575]++;
  _.each(['concat', 'join', 'slice'], function(name) {
  _$jscoverage['/underscore.js'].functionData[160]++;
  _$jscoverage['/underscore.js'].lineData[1576]++;
  var method = ArrayProto[name];
  _$jscoverage['/underscore.js'].lineData[1577]++;
  _.prototype[name] = function() {
  _$jscoverage['/underscore.js'].functionData[161]++;
  _$jscoverage['/underscore.js'].lineData[1578]++;
  return chainResult(this, method.apply(this._wrapped, arguments));
};
});
  _$jscoverage['/underscore.js'].lineData[1583]++;
  _.prototype.value = function() {
  _$jscoverage['/underscore.js'].functionData[162]++;
  _$jscoverage['/underscore.js'].lineData[1584]++;
  return this._wrapped;
};
  _$jscoverage['/underscore.js'].lineData[1589]++;
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
  _$jscoverage['/underscore.js'].lineData[1591]++;
  _.prototype.toString = function() {
  _$jscoverage['/underscore.js'].functionData[163]++;
  _$jscoverage['/underscore.js'].lineData[1592]++;
  return '' + this._wrapped;
};
  _$jscoverage['/underscore.js'].lineData[1602]++;
  if (visit374_1602_1(visit375_1602_2(typeof define === 'function') && define.amd)) {
    _$jscoverage['/underscore.js'].lineData[1603]++;
    define('underscore', [], function() {
  _$jscoverage['/underscore.js'].functionData[164]++;
  _$jscoverage['/underscore.js'].lineData[1604]++;
  return _;
});
  }
}());
