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
    var json = eval('(' + jsonString + ')');
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
  _$jscoverage['/underscore.js'].lineData[32] = 0;
  _$jscoverage['/underscore.js'].lineData[37] = 0;
  _$jscoverage['/underscore.js'].lineData[40] = 0;
  _$jscoverage['/underscore.js'].lineData[41] = 0;
  _$jscoverage['/underscore.js'].lineData[42] = 0;
  _$jscoverage['/underscore.js'].lineData[43] = 0;
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
  _$jscoverage['/underscore.js'].lineData[70] = 0;
  _$jscoverage['/underscore.js'].lineData[74] = 0;
  _$jscoverage['/underscore.js'].lineData[75] = 0;
  _$jscoverage['/underscore.js'].lineData[77] = 0;
  _$jscoverage['/underscore.js'].lineData[78] = 0;
  _$jscoverage['/underscore.js'].lineData[81] = 0;
  _$jscoverage['/underscore.js'].lineData[82] = 0;
  _$jscoverage['/underscore.js'].lineData[89] = 0;
  _$jscoverage['/underscore.js'].lineData[90] = 0;
  _$jscoverage['/underscore.js'].lineData[91] = 0;
  _$jscoverage['/underscore.js'].lineData[92] = 0;
  _$jscoverage['/underscore.js'].lineData[93] = 0;
  _$jscoverage['/underscore.js'].lineData[97] = 0;
  _$jscoverage['/underscore.js'].lineData[98] = 0;
  _$jscoverage['/underscore.js'].lineData[103] = 0;
  _$jscoverage['/underscore.js'].lineData[104] = 0;
  _$jscoverage['/underscore.js'].lineData[105] = 0;
  _$jscoverage['/underscore.js'].lineData[106] = 0;
  _$jscoverage['/underscore.js'].lineData[107] = 0;
  _$jscoverage['/underscore.js'].lineData[108] = 0;
  _$jscoverage['/underscore.js'].lineData[109] = 0;
  _$jscoverage['/underscore.js'].lineData[111] = 0;
  _$jscoverage['/underscore.js'].lineData[112] = 0;
  _$jscoverage['/underscore.js'].lineData[113] = 0;
  _$jscoverage['/underscore.js'].lineData[114] = 0;
  _$jscoverage['/underscore.js'].lineData[116] = 0;
  _$jscoverage['/underscore.js'].lineData[117] = 0;
  _$jscoverage['/underscore.js'].lineData[118] = 0;
  _$jscoverage['/underscore.js'].lineData[120] = 0;
  _$jscoverage['/underscore.js'].lineData[121] = 0;
  _$jscoverage['/underscore.js'].lineData[126] = 0;
  _$jscoverage['/underscore.js'].lineData[127] = 0;
  _$jscoverage['/underscore.js'].lineData[128] = 0;
  _$jscoverage['/underscore.js'].lineData[129] = 0;
  _$jscoverage['/underscore.js'].lineData[130] = 0;
  _$jscoverage['/underscore.js'].lineData[131] = 0;
  _$jscoverage['/underscore.js'].lineData[132] = 0;
  _$jscoverage['/underscore.js'].lineData[135] = 0;
  _$jscoverage['/underscore.js'].lineData[136] = 0;
  _$jscoverage['/underscore.js'].lineData[137] = 0;
  _$jscoverage['/underscore.js'].lineData[145] = 0;
  _$jscoverage['/underscore.js'].lineData[146] = 0;
  _$jscoverage['/underscore.js'].lineData[147] = 0;
  _$jscoverage['/underscore.js'].lineData[148] = 0;
  _$jscoverage['/underscore.js'].lineData[149] = 0;
  _$jscoverage['/underscore.js'].lineData[158] = 0;
  _$jscoverage['/underscore.js'].lineData[159] = 0;
  _$jscoverage['/underscore.js'].lineData[160] = 0;
  _$jscoverage['/underscore.js'].lineData[161] = 0;
  _$jscoverage['/underscore.js'].lineData[162] = 0;
  _$jscoverage['/underscore.js'].lineData[163] = 0;
  _$jscoverage['/underscore.js'].lineData[166] = 0;
  _$jscoverage['/underscore.js'].lineData[167] = 0;
  _$jscoverage['/underscore.js'].lineData[168] = 0;
  _$jscoverage['/underscore.js'].lineData[171] = 0;
  _$jscoverage['/underscore.js'].lineData[175] = 0;
  _$jscoverage['/underscore.js'].lineData[176] = 0;
  _$jscoverage['/underscore.js'].lineData[177] = 0;
  _$jscoverage['/underscore.js'].lineData[180] = 0;
  _$jscoverage['/underscore.js'].lineData[181] = 0;
  _$jscoverage['/underscore.js'].lineData[182] = 0;
  _$jscoverage['/underscore.js'].lineData[184] = 0;
  _$jscoverage['/underscore.js'].lineData[188] = 0;
  _$jscoverage['/underscore.js'].lineData[191] = 0;
  _$jscoverage['/underscore.js'].lineData[192] = 0;
  _$jscoverage['/underscore.js'].lineData[195] = 0;
  _$jscoverage['/underscore.js'].lineData[196] = 0;
  _$jscoverage['/underscore.js'].lineData[197] = 0;
  _$jscoverage['/underscore.js'].lineData[199] = 0;
  _$jscoverage['/underscore.js'].lineData[200] = 0;
  _$jscoverage['/underscore.js'].lineData[201] = 0;
  _$jscoverage['/underscore.js'].lineData[203] = 0;
  _$jscoverage['/underscore.js'].lineData[206] = 0;
  _$jscoverage['/underscore.js'].lineData[207] = 0;
  _$jscoverage['/underscore.js'].lineData[208] = 0;
  _$jscoverage['/underscore.js'].lineData[214] = 0;
  _$jscoverage['/underscore.js'].lineData[217] = 0;
  _$jscoverage['/underscore.js'].lineData[220] = 0;
  _$jscoverage['/underscore.js'].lineData[221] = 0;
  _$jscoverage['/underscore.js'].lineData[222] = 0;
  _$jscoverage['/underscore.js'].lineData[223] = 0;
  _$jscoverage['/underscore.js'].lineData[225] = 0;
  _$jscoverage['/underscore.js'].lineData[227] = 0;
  _$jscoverage['/underscore.js'].lineData[232] = 0;
  _$jscoverage['/underscore.js'].lineData[233] = 0;
  _$jscoverage['/underscore.js'].lineData[234] = 0;
  _$jscoverage['/underscore.js'].lineData[235] = 0;
  _$jscoverage['/underscore.js'].lineData[236] = 0;
  _$jscoverage['/underscore.js'].lineData[238] = 0;
  _$jscoverage['/underscore.js'].lineData[242] = 0;
  _$jscoverage['/underscore.js'].lineData[243] = 0;
  _$jscoverage['/underscore.js'].lineData[248] = 0;
  _$jscoverage['/underscore.js'].lineData[249] = 0;
  _$jscoverage['/underscore.js'].lineData[250] = 0;
  _$jscoverage['/underscore.js'].lineData[252] = 0;
  _$jscoverage['/underscore.js'].lineData[253] = 0;
  _$jscoverage['/underscore.js'].lineData[254] = 0;
  _$jscoverage['/underscore.js'].lineData[256] = 0;
  _$jscoverage['/underscore.js'].lineData[261] = 0;
  _$jscoverage['/underscore.js'].lineData[262] = 0;
  _$jscoverage['/underscore.js'].lineData[263] = 0;
  _$jscoverage['/underscore.js'].lineData[265] = 0;
  _$jscoverage['/underscore.js'].lineData[266] = 0;
  _$jscoverage['/underscore.js'].lineData[267] = 0;
  _$jscoverage['/underscore.js'].lineData[269] = 0;
  _$jscoverage['/underscore.js'].lineData[274] = 0;
  _$jscoverage['/underscore.js'].lineData[275] = 0;
  _$jscoverage['/underscore.js'].lineData[276] = 0;
  _$jscoverage['/underscore.js'].lineData[277] = 0;
  _$jscoverage['/underscore.js'].lineData[281] = 0;
  _$jscoverage['/underscore.js'].lineData[282] = 0;
  _$jscoverage['/underscore.js'].lineData[283] = 0;
  _$jscoverage['/underscore.js'].lineData[284] = 0;
  _$jscoverage['/underscore.js'].lineData[285] = 0;
  _$jscoverage['/underscore.js'].lineData[290] = 0;
  _$jscoverage['/underscore.js'].lineData[291] = 0;
  _$jscoverage['/underscore.js'].lineData[296] = 0;
  _$jscoverage['/underscore.js'].lineData[297] = 0;
  _$jscoverage['/underscore.js'].lineData[302] = 0;
  _$jscoverage['/underscore.js'].lineData[303] = 0;
  _$jscoverage['/underscore.js'].lineData[307] = 0;
  _$jscoverage['/underscore.js'].lineData[308] = 0;
  _$jscoverage['/underscore.js'].lineData[310] = 0;
  _$jscoverage['/underscore.js'].lineData[311] = 0;
  _$jscoverage['/underscore.js'].lineData[312] = 0;
  _$jscoverage['/underscore.js'].lineData[313] = 0;
  _$jscoverage['/underscore.js'].lineData[314] = 0;
  _$jscoverage['/underscore.js'].lineData[315] = 0;
  _$jscoverage['/underscore.js'].lineData[319] = 0;
  _$jscoverage['/underscore.js'].lineData[320] = 0;
  _$jscoverage['/underscore.js'].lineData[321] = 0;
  _$jscoverage['/underscore.js'].lineData[322] = 0;
  _$jscoverage['/underscore.js'].lineData[323] = 0;
  _$jscoverage['/underscore.js'].lineData[324] = 0;
  _$jscoverage['/underscore.js'].lineData[328] = 0;
  _$jscoverage['/underscore.js'].lineData[332] = 0;
  _$jscoverage['/underscore.js'].lineData[333] = 0;
  _$jscoverage['/underscore.js'].lineData[335] = 0;
  _$jscoverage['/underscore.js'].lineData[336] = 0;
  _$jscoverage['/underscore.js'].lineData[337] = 0;
  _$jscoverage['/underscore.js'].lineData[338] = 0;
  _$jscoverage['/underscore.js'].lineData[339] = 0;
  _$jscoverage['/underscore.js'].lineData[340] = 0;
  _$jscoverage['/underscore.js'].lineData[344] = 0;
  _$jscoverage['/underscore.js'].lineData[345] = 0;
  _$jscoverage['/underscore.js'].lineData[346] = 0;
  _$jscoverage['/underscore.js'].lineData[347] = 0;
  _$jscoverage['/underscore.js'].lineData[348] = 0;
  _$jscoverage['/underscore.js'].lineData[349] = 0;
  _$jscoverage['/underscore.js'].lineData[353] = 0;
  _$jscoverage['/underscore.js'].lineData[357] = 0;
  _$jscoverage['/underscore.js'].lineData[358] = 0;
  _$jscoverage['/underscore.js'].lineData[365] = 0;
  _$jscoverage['/underscore.js'].lineData[366] = 0;
  _$jscoverage['/underscore.js'].lineData[367] = 0;
  _$jscoverage['/underscore.js'].lineData[368] = 0;
  _$jscoverage['/underscore.js'].lineData[370] = 0;
  _$jscoverage['/underscore.js'].lineData[371] = 0;
  _$jscoverage['/underscore.js'].lineData[372] = 0;
  _$jscoverage['/underscore.js'].lineData[373] = 0;
  _$jscoverage['/underscore.js'].lineData[374] = 0;
  _$jscoverage['/underscore.js'].lineData[375] = 0;
  _$jscoverage['/underscore.js'].lineData[376] = 0;
  _$jscoverage['/underscore.js'].lineData[377] = 0;
  _$jscoverage['/underscore.js'].lineData[378] = 0;
  _$jscoverage['/underscore.js'].lineData[380] = 0;
  _$jscoverage['/underscore.js'].lineData[384] = 0;
  _$jscoverage['/underscore.js'].lineData[385] = 0;
  _$jscoverage['/underscore.js'].lineData[386] = 0;
  _$jscoverage['/underscore.js'].lineData[387] = 0;
  _$jscoverage['/underscore.js'].lineData[388] = 0;
  _$jscoverage['/underscore.js'].lineData[394] = 0;
  _$jscoverage['/underscore.js'].lineData[395] = 0;
  _$jscoverage['/underscore.js'].lineData[396] = 0;
  _$jscoverage['/underscore.js'].lineData[397] = 0;
  _$jscoverage['/underscore.js'].lineData[398] = 0;
  _$jscoverage['/underscore.js'].lineData[400] = 0;
  _$jscoverage['/underscore.js'].lineData[405] = 0;
  _$jscoverage['/underscore.js'].lineData[406] = 0;
  _$jscoverage['/underscore.js'].lineData[407] = 0;
  _$jscoverage['/underscore.js'].lineData[408] = 0;
  _$jscoverage['/underscore.js'].lineData[409] = 0;
  _$jscoverage['/underscore.js'].lineData[410] = 0;
  _$jscoverage['/underscore.js'].lineData[411] = 0;
  _$jscoverage['/underscore.js'].lineData[413] = 0;
  _$jscoverage['/underscore.js'].lineData[419] = 0;
  _$jscoverage['/underscore.js'].lineData[420] = 0;
  _$jscoverage['/underscore.js'].lineData[425] = 0;
  _$jscoverage['/underscore.js'].lineData[426] = 0;
  _$jscoverage['/underscore.js'].lineData[432] = 0;
  _$jscoverage['/underscore.js'].lineData[433] = 0;
  _$jscoverage['/underscore.js'].lineData[436] = 0;
  _$jscoverage['/underscore.js'].lineData[438] = 0;
  _$jscoverage['/underscore.js'].lineData[439] = 0;
  _$jscoverage['/underscore.js'].lineData[440] = 0;
  _$jscoverage['/underscore.js'].lineData[441] = 0;
  _$jscoverage['/underscore.js'].lineData[443] = 0;
  _$jscoverage['/underscore.js'].lineData[445] = 0;
  _$jscoverage['/underscore.js'].lineData[446] = 0;
  _$jscoverage['/underscore.js'].lineData[450] = 0;
  _$jscoverage['/underscore.js'].lineData[451] = 0;
  _$jscoverage['/underscore.js'].lineData[452] = 0;
  _$jscoverage['/underscore.js'].lineData[457] = 0;
  _$jscoverage['/underscore.js'].lineData[458] = 0;
  _$jscoverage['/underscore.js'].lineData[467] = 0;
  _$jscoverage['/underscore.js'].lineData[468] = 0;
  _$jscoverage['/underscore.js'].lineData[469] = 0;
  _$jscoverage['/underscore.js'].lineData[470] = 0;
  _$jscoverage['/underscore.js'].lineData[476] = 0;
  _$jscoverage['/underscore.js'].lineData[477] = 0;
  _$jscoverage['/underscore.js'].lineData[482] = 0;
  _$jscoverage['/underscore.js'].lineData[483] = 0;
  _$jscoverage['/underscore.js'].lineData[484] = 0;
  _$jscoverage['/underscore.js'].lineData[485] = 0;
  _$jscoverage['/underscore.js'].lineData[491] = 0;
  _$jscoverage['/underscore.js'].lineData[492] = 0;
  _$jscoverage['/underscore.js'].lineData[496] = 0;
  _$jscoverage['/underscore.js'].lineData[497] = 0;
  _$jscoverage['/underscore.js'].lineData[501] = 0;
  _$jscoverage['/underscore.js'].lineData[502] = 0;
  _$jscoverage['/underscore.js'].lineData[503] = 0;
  _$jscoverage['/underscore.js'].lineData[504] = 0;
  _$jscoverage['/underscore.js'].lineData[505] = 0;
  _$jscoverage['/underscore.js'].lineData[506] = 0;
  _$jscoverage['/underscore.js'].lineData[508] = 0;
  _$jscoverage['/underscore.js'].lineData[509] = 0;
  _$jscoverage['/underscore.js'].lineData[510] = 0;
  _$jscoverage['/underscore.js'].lineData[512] = 0;
  _$jscoverage['/underscore.js'].lineData[513] = 0;
  _$jscoverage['/underscore.js'].lineData[515] = 0;
  _$jscoverage['/underscore.js'].lineData[516] = 0;
  _$jscoverage['/underscore.js'].lineData[519] = 0;
  _$jscoverage['/underscore.js'].lineData[523] = 0;
  _$jscoverage['/underscore.js'].lineData[524] = 0;
  _$jscoverage['/underscore.js'].lineData[528] = 0;
  _$jscoverage['/underscore.js'].lineData[529] = 0;
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
  _$jscoverage['/underscore.js'].lineData[547] = 0;
  _$jscoverage['/underscore.js'].lineData[548] = 0;
  _$jscoverage['/underscore.js'].lineData[549] = 0;
  _$jscoverage['/underscore.js'].lineData[550] = 0;
  _$jscoverage['/underscore.js'].lineData[551] = 0;
  _$jscoverage['/underscore.js'].lineData[552] = 0;
  _$jscoverage['/underscore.js'].lineData[553] = 0;
  _$jscoverage['/underscore.js'].lineData[555] = 0;
  _$jscoverage['/underscore.js'].lineData[556] = 0;
  _$jscoverage['/underscore.js'].lineData[559] = 0;
  _$jscoverage['/underscore.js'].lineData[564] = 0;
  _$jscoverage['/underscore.js'].lineData[565] = 0;
  _$jscoverage['/underscore.js'].lineData[570] = 0;
  _$jscoverage['/underscore.js'].lineData[571] = 0;
  _$jscoverage['/underscore.js'].lineData[572] = 0;
  _$jscoverage['/underscore.js'].lineData[573] = 0;
  _$jscoverage['/underscore.js'].lineData[574] = 0;
  _$jscoverage['/underscore.js'].lineData[575] = 0;
  _$jscoverage['/underscore.js'].lineData[576] = 0;
  _$jscoverage['/underscore.js'].lineData[577] = 0;
  _$jscoverage['/underscore.js'].lineData[578] = 0;
  _$jscoverage['/underscore.js'].lineData[580] = 0;
  _$jscoverage['/underscore.js'].lineData[582] = 0;
  _$jscoverage['/underscore.js'].lineData[587] = 0;
  _$jscoverage['/underscore.js'].lineData[588] = 0;
  _$jscoverage['/underscore.js'].lineData[589] = 0;
  _$jscoverage['/underscore.js'].lineData[590] = 0;
  _$jscoverage['/underscore.js'].lineData[596] = 0;
  _$jscoverage['/underscore.js'].lineData[597] = 0;
  _$jscoverage['/underscore.js'].lineData[598] = 0;
  _$jscoverage['/underscore.js'].lineData[600] = 0;
  _$jscoverage['/underscore.js'].lineData[601] = 0;
  _$jscoverage['/underscore.js'].lineData[603] = 0;
  _$jscoverage['/underscore.js'].lineData[608] = 0;
  _$jscoverage['/underscore.js'].lineData[613] = 0;
  _$jscoverage['/underscore.js'].lineData[614] = 0;
  _$jscoverage['/underscore.js'].lineData[615] = 0;
  _$jscoverage['/underscore.js'].lineData[616] = 0;
  _$jscoverage['/underscore.js'].lineData[617] = 0;
  _$jscoverage['/underscore.js'].lineData[619] = 0;
  _$jscoverage['/underscore.js'].lineData[622] = 0;
  _$jscoverage['/underscore.js'].lineData[626] = 0;
  _$jscoverage['/underscore.js'].lineData[627] = 0;
  _$jscoverage['/underscore.js'].lineData[628] = 0;
  _$jscoverage['/underscore.js'].lineData[629] = 0;
  _$jscoverage['/underscore.js'].lineData[630] = 0;
  _$jscoverage['/underscore.js'].lineData[631] = 0;
  _$jscoverage['/underscore.js'].lineData[632] = 0;
  _$jscoverage['/underscore.js'].lineData[634] = 0;
  _$jscoverage['/underscore.js'].lineData[639] = 0;
  _$jscoverage['/underscore.js'].lineData[640] = 0;
  _$jscoverage['/underscore.js'].lineData[644] = 0;
  _$jscoverage['/underscore.js'].lineData[645] = 0;
  _$jscoverage['/underscore.js'].lineData[646] = 0;
  _$jscoverage['/underscore.js'].lineData[647] = 0;
  _$jscoverage['/underscore.js'].lineData[648] = 0;
  _$jscoverage['/underscore.js'].lineData[649] = 0;
  _$jscoverage['/underscore.js'].lineData[650] = 0;
  _$jscoverage['/underscore.js'].lineData[652] = 0;
  _$jscoverage['/underscore.js'].lineData[656] = 0;
  _$jscoverage['/underscore.js'].lineData[657] = 0;
  _$jscoverage['/underscore.js'].lineData[658] = 0;
  _$jscoverage['/underscore.js'].lineData[659] = 0;
  _$jscoverage['/underscore.js'].lineData[660] = 0;
  _$jscoverage['/underscore.js'].lineData[661] = 0;
  _$jscoverage['/underscore.js'].lineData[663] = 0;
  _$jscoverage['/underscore.js'].lineData[665] = 0;
  _$jscoverage['/underscore.js'].lineData[666] = 0;
  _$jscoverage['/underscore.js'].lineData[667] = 0;
  _$jscoverage['/underscore.js'].lineData[669] = 0;
  _$jscoverage['/underscore.js'].lineData[670] = 0;
  _$jscoverage['/underscore.js'].lineData[671] = 0;
  _$jscoverage['/underscore.js'].lineData[673] = 0;
  _$jscoverage['/underscore.js'].lineData[674] = 0;
  _$jscoverage['/underscore.js'].lineData[676] = 0;
  _$jscoverage['/underscore.js'].lineData[684] = 0;
  _$jscoverage['/underscore.js'].lineData[685] = 0;
  _$jscoverage['/underscore.js'].lineData[690] = 0;
  _$jscoverage['/underscore.js'].lineData[691] = 0;
  _$jscoverage['/underscore.js'].lineData[692] = 0;
  _$jscoverage['/underscore.js'].lineData[693] = 0;
  _$jscoverage['/underscore.js'].lineData[695] = 0;
  _$jscoverage['/underscore.js'].lineData[696] = 0;
  _$jscoverage['/underscore.js'].lineData[699] = 0;
  _$jscoverage['/underscore.js'].lineData[700] = 0;
  _$jscoverage['/underscore.js'].lineData[702] = 0;
  _$jscoverage['/underscore.js'].lineData[703] = 0;
  _$jscoverage['/underscore.js'].lineData[706] = 0;
  _$jscoverage['/underscore.js'].lineData[711] = 0;
  _$jscoverage['/underscore.js'].lineData[712] = 0;
  _$jscoverage['/underscore.js'].lineData[714] = 0;
  _$jscoverage['/underscore.js'].lineData[715] = 0;
  _$jscoverage['/underscore.js'].lineData[716] = 0;
  _$jscoverage['/underscore.js'].lineData[717] = 0;
  _$jscoverage['/underscore.js'].lineData[719] = 0;
  _$jscoverage['/underscore.js'].lineData[727] = 0;
  _$jscoverage['/underscore.js'].lineData[728] = 0;
  _$jscoverage['/underscore.js'].lineData[729] = 0;
  _$jscoverage['/underscore.js'].lineData[730] = 0;
  _$jscoverage['/underscore.js'].lineData[731] = 0;
  _$jscoverage['/underscore.js'].lineData[732] = 0;
  _$jscoverage['/underscore.js'].lineData[738] = 0;
  _$jscoverage['/underscore.js'].lineData[739] = 0;
  _$jscoverage['/underscore.js'].lineData[740] = 0;
  _$jscoverage['/underscore.js'].lineData[741] = 0;
  _$jscoverage['/underscore.js'].lineData[743] = 0;
  _$jscoverage['/underscore.js'].lineData[750] = 0;
  _$jscoverage['/underscore.js'].lineData[751] = 0;
  _$jscoverage['/underscore.js'].lineData[752] = 0;
  _$jscoverage['/underscore.js'].lineData[753] = 0;
  _$jscoverage['/underscore.js'].lineData[754] = 0;
  _$jscoverage['/underscore.js'].lineData[755] = 0;
  _$jscoverage['/underscore.js'].lineData[756] = 0;
  _$jscoverage['/underscore.js'].lineData[758] = 0;
  _$jscoverage['/underscore.js'].lineData[759] = 0;
  _$jscoverage['/underscore.js'].lineData[761] = 0;
  _$jscoverage['/underscore.js'].lineData[764] = 0;
  _$jscoverage['/underscore.js'].lineData[769] = 0;
  _$jscoverage['/underscore.js'].lineData[770] = 0;
  _$jscoverage['/underscore.js'].lineData[771] = 0;
  _$jscoverage['/underscore.js'].lineData[772] = 0;
  _$jscoverage['/underscore.js'].lineData[773] = 0;
  _$jscoverage['/underscore.js'].lineData[774] = 0;
  _$jscoverage['/underscore.js'].lineData[775] = 0;
  _$jscoverage['/underscore.js'].lineData[780] = 0;
  _$jscoverage['/underscore.js'].lineData[781] = 0;
  _$jscoverage['/underscore.js'].lineData[782] = 0;
  _$jscoverage['/underscore.js'].lineData[783] = 0;
  _$jscoverage['/underscore.js'].lineData[784] = 0;
  _$jscoverage['/underscore.js'].lineData[785] = 0;
  _$jscoverage['/underscore.js'].lineData[787] = 0;
  _$jscoverage['/underscore.js'].lineData[788] = 0;
  _$jscoverage['/underscore.js'].lineData[793] = 0;
  _$jscoverage['/underscore.js'].lineData[794] = 0;
  _$jscoverage['/underscore.js'].lineData[795] = 0;
  _$jscoverage['/underscore.js'].lineData[801] = 0;
  _$jscoverage['/underscore.js'].lineData[808] = 0;
  _$jscoverage['/underscore.js'].lineData[809] = 0;
  _$jscoverage['/underscore.js'].lineData[810] = 0;
  _$jscoverage['/underscore.js'].lineData[811] = 0;
  _$jscoverage['/underscore.js'].lineData[813] = 0;
  _$jscoverage['/underscore.js'].lineData[814] = 0;
  _$jscoverage['/underscore.js'].lineData[815] = 0;
  _$jscoverage['/underscore.js'].lineData[816] = 0;
  _$jscoverage['/underscore.js'].lineData[817] = 0;
  _$jscoverage['/underscore.js'].lineData[820] = 0;
  _$jscoverage['/underscore.js'].lineData[821] = 0;
  _$jscoverage['/underscore.js'].lineData[822] = 0;
  _$jscoverage['/underscore.js'].lineData[823] = 0;
  _$jscoverage['/underscore.js'].lineData[824] = 0;
  _$jscoverage['/underscore.js'].lineData[825] = 0;
  _$jscoverage['/underscore.js'].lineData[826] = 0;
  _$jscoverage['/underscore.js'].lineData[827] = 0;
  _$jscoverage['/underscore.js'].lineData[828] = 0;
  _$jscoverage['/underscore.js'].lineData[829] = 0;
  _$jscoverage['/underscore.js'].lineData[831] = 0;
  _$jscoverage['/underscore.js'].lineData[832] = 0;
  _$jscoverage['/underscore.js'].lineData[833] = 0;
  _$jscoverage['/underscore.js'].lineData[834] = 0;
  _$jscoverage['/underscore.js'].lineData[835] = 0;
  _$jscoverage['/underscore.js'].lineData[837] = 0;
  _$jscoverage['/underscore.js'].lineData[840] = 0;
  _$jscoverage['/underscore.js'].lineData[841] = 0;
  _$jscoverage['/underscore.js'].lineData[842] = 0;
  _$jscoverage['/underscore.js'].lineData[843] = 0;
  _$jscoverage['/underscore.js'].lineData[846] = 0;
  _$jscoverage['/underscore.js'].lineData[853] = 0;
  _$jscoverage['/underscore.js'].lineData[854] = 0;
  _$jscoverage['/underscore.js'].lineData[856] = 0;
  _$jscoverage['/underscore.js'].lineData[857] = 0;
  _$jscoverage['/underscore.js'].lineData[858] = 0;
  _$jscoverage['/underscore.js'].lineData[861] = 0;
  _$jscoverage['/underscore.js'].lineData[862] = 0;
  _$jscoverage['/underscore.js'].lineData[863] = 0;
  _$jscoverage['/underscore.js'].lineData[864] = 0;
  _$jscoverage['/underscore.js'].lineData[865] = 0;
  _$jscoverage['/underscore.js'].lineData[866] = 0;
  _$jscoverage['/underscore.js'].lineData[867] = 0;
  _$jscoverage['/underscore.js'].lineData[868] = 0;
  _$jscoverage['/underscore.js'].lineData[871] = 0;
  _$jscoverage['/underscore.js'].lineData[874] = 0;
  _$jscoverage['/underscore.js'].lineData[875] = 0;
  _$jscoverage['/underscore.js'].lineData[876] = 0;
  _$jscoverage['/underscore.js'].lineData[879] = 0;
  _$jscoverage['/underscore.js'].lineData[885] = 0;
  _$jscoverage['/underscore.js'].lineData[886] = 0;
  _$jscoverage['/underscore.js'].lineData[890] = 0;
  _$jscoverage['/underscore.js'].lineData[891] = 0;
  _$jscoverage['/underscore.js'].lineData[892] = 0;
  _$jscoverage['/underscore.js'].lineData[898] = 0;
  _$jscoverage['/underscore.js'].lineData[899] = 0;
  _$jscoverage['/underscore.js'].lineData[900] = 0;
  _$jscoverage['/underscore.js'].lineData[901] = 0;
  _$jscoverage['/underscore.js'].lineData[902] = 0;
  _$jscoverage['/underscore.js'].lineData[903] = 0;
  _$jscoverage['/underscore.js'].lineData[904] = 0;
  _$jscoverage['/underscore.js'].lineData[905] = 0;
  _$jscoverage['/underscore.js'].lineData[910] = 0;
  _$jscoverage['/underscore.js'].lineData[911] = 0;
  _$jscoverage['/underscore.js'].lineData[912] = 0;
  _$jscoverage['/underscore.js'].lineData[913] = 0;
  _$jscoverage['/underscore.js'].lineData[919] = 0;
  _$jscoverage['/underscore.js'].lineData[920] = 0;
  _$jscoverage['/underscore.js'].lineData[921] = 0;
  _$jscoverage['/underscore.js'].lineData[922] = 0;
  _$jscoverage['/underscore.js'].lineData[923] = 0;
  _$jscoverage['/underscore.js'].lineData[925] = 0;
  _$jscoverage['/underscore.js'].lineData[926] = 0;
  _$jscoverage['/underscore.js'].lineData[932] = 0;
  _$jscoverage['/underscore.js'].lineData[934] = 0;
  _$jscoverage['/underscore.js'].lineData[940] = 0;
  _$jscoverage['/underscore.js'].lineData[941] = 0;
  _$jscoverage['/underscore.js'].lineData[944] = 0;
  _$jscoverage['/underscore.js'].lineData[945] = 0;
  _$jscoverage['/underscore.js'].lineData[946] = 0;
  _$jscoverage['/underscore.js'].lineData[947] = 0;
  _$jscoverage['/underscore.js'].lineData[950] = 0;
  _$jscoverage['/underscore.js'].lineData[951] = 0;
  _$jscoverage['/underscore.js'].lineData[953] = 0;
  _$jscoverage['/underscore.js'].lineData[954] = 0;
  _$jscoverage['/underscore.js'].lineData[955] = 0;
  _$jscoverage['/underscore.js'].lineData[956] = 0;
  _$jscoverage['/underscore.js'].lineData[963] = 0;
  _$jscoverage['/underscore.js'].lineData[964] = 0;
  _$jscoverage['/underscore.js'].lineData[965] = 0;
  _$jscoverage['/underscore.js'].lineData[966] = 0;
  _$jscoverage['/underscore.js'].lineData[967] = 0;
  _$jscoverage['/underscore.js'].lineData[969] = 0;
  _$jscoverage['/underscore.js'].lineData[970] = 0;
  _$jscoverage['/underscore.js'].lineData[974] = 0;
  _$jscoverage['/underscore.js'].lineData[975] = 0;
  _$jscoverage['/underscore.js'].lineData[976] = 0;
  _$jscoverage['/underscore.js'].lineData[977] = 0;
  _$jscoverage['/underscore.js'].lineData[979] = 0;
  _$jscoverage['/underscore.js'].lineData[980] = 0;
  _$jscoverage['/underscore.js'].lineData[984] = 0;
  _$jscoverage['/underscore.js'].lineData[985] = 0;
  _$jscoverage['/underscore.js'].lineData[986] = 0;
  _$jscoverage['/underscore.js'].lineData[987] = 0;
  _$jscoverage['/underscore.js'].lineData[988] = 0;
  _$jscoverage['/underscore.js'].lineData[989] = 0;
  _$jscoverage['/underscore.js'].lineData[991] = 0;
  _$jscoverage['/underscore.js'].lineData[996] = 0;
  _$jscoverage['/underscore.js'].lineData[997] = 0;
  _$jscoverage['/underscore.js'].lineData[998] = 0;
  _$jscoverage['/underscore.js'].lineData[1001] = 0;
  _$jscoverage['/underscore.js'].lineData[1002] = 0;
  _$jscoverage['/underscore.js'].lineData[1003] = 0;
  _$jscoverage['/underscore.js'].lineData[1005] = 0;
  _$jscoverage['/underscore.js'].lineData[1009] = 0;
  _$jscoverage['/underscore.js'].lineData[1010] = 0;
  _$jscoverage['/underscore.js'].lineData[1011] = 0;
  _$jscoverage['/underscore.js'].lineData[1012] = 0;
  _$jscoverage['/underscore.js'].lineData[1013] = 0;
  _$jscoverage['/underscore.js'].lineData[1014] = 0;
  _$jscoverage['/underscore.js'].lineData[1016] = 0;
  _$jscoverage['/underscore.js'].lineData[1020] = 0;
  _$jscoverage['/underscore.js'].lineData[1021] = 0;
  _$jscoverage['/underscore.js'].lineData[1022] = 0;
  _$jscoverage['/underscore.js'].lineData[1023] = 0;
  _$jscoverage['/underscore.js'].lineData[1024] = 0;
  _$jscoverage['/underscore.js'].lineData[1026] = 0;
  _$jscoverage['/underscore.js'].lineData[1031] = 0;
  _$jscoverage['/underscore.js'].lineData[1032] = 0;
  _$jscoverage['/underscore.js'].lineData[1033] = 0;
  _$jscoverage['/underscore.js'].lineData[1034] = 0;
  _$jscoverage['/underscore.js'].lineData[1036] = 0;
  _$jscoverage['/underscore.js'].lineData[1040] = 0;
  _$jscoverage['/underscore.js'].lineData[1041] = 0;
  _$jscoverage['/underscore.js'].lineData[1042] = 0;
  _$jscoverage['/underscore.js'].lineData[1043] = 0;
  _$jscoverage['/underscore.js'].lineData[1044] = 0;
  _$jscoverage['/underscore.js'].lineData[1045] = 0;
  _$jscoverage['/underscore.js'].lineData[1046] = 0;
  _$jscoverage['/underscore.js'].lineData[1049] = 0;
  _$jscoverage['/underscore.js'].lineData[1050] = 0;
  _$jscoverage['/underscore.js'].lineData[1051] = 0;
  _$jscoverage['/underscore.js'].lineData[1054] = 0;
  _$jscoverage['/underscore.js'].lineData[1059] = 0;
  _$jscoverage['/underscore.js'].lineData[1063] = 0;
  _$jscoverage['/underscore.js'].lineData[1066] = 0;
  _$jscoverage['/underscore.js'].lineData[1067] = 0;
  _$jscoverage['/underscore.js'].lineData[1068] = 0;
  _$jscoverage['/underscore.js'].lineData[1069] = 0;
  _$jscoverage['/underscore.js'].lineData[1070] = 0;
  _$jscoverage['/underscore.js'].lineData[1071] = 0;
  _$jscoverage['/underscore.js'].lineData[1076] = 0;
  _$jscoverage['/underscore.js'].lineData[1077] = 0;
  _$jscoverage['/underscore.js'].lineData[1081] = 0;
  _$jscoverage['/underscore.js'].lineData[1082] = 0;
  _$jscoverage['/underscore.js'].lineData[1083] = 0;
  _$jscoverage['/underscore.js'].lineData[1084] = 0;
  _$jscoverage['/underscore.js'].lineData[1085] = 0;
  _$jscoverage['/underscore.js'].lineData[1086] = 0;
  _$jscoverage['/underscore.js'].lineData[1088] = 0;
  _$jscoverage['/underscore.js'].lineData[1089] = 0;
  _$jscoverage['/underscore.js'].lineData[1090] = 0;
  _$jscoverage['/underscore.js'].lineData[1092] = 0;
  _$jscoverage['/underscore.js'].lineData[1093] = 0;
  _$jscoverage['/underscore.js'].lineData[1094] = 0;
  _$jscoverage['/underscore.js'].lineData[1095] = 0;
  _$jscoverage['/underscore.js'].lineData[1097] = 0;
  _$jscoverage['/underscore.js'].lineData[1101] = 0;
  _$jscoverage['/underscore.js'].lineData[1102] = 0;
  _$jscoverage['/underscore.js'].lineData[1103] = 0;
  _$jscoverage['/underscore.js'].lineData[1104] = 0;
  _$jscoverage['/underscore.js'].lineData[1105] = 0;
  _$jscoverage['/underscore.js'].lineData[1107] = 0;
  _$jscoverage['/underscore.js'].lineData[1108] = 0;
  _$jscoverage['/underscore.js'].lineData[1109] = 0;
  _$jscoverage['/underscore.js'].lineData[1112] = 0;
  _$jscoverage['/underscore.js'].lineData[1116] = 0;
  _$jscoverage['/underscore.js'].lineData[1121] = 0;
  _$jscoverage['/underscore.js'].lineData[1122] = 0;
  _$jscoverage['/underscore.js'].lineData[1123] = 0;
  _$jscoverage['/underscore.js'].lineData[1124] = 0;
  _$jscoverage['/underscore.js'].lineData[1128] = 0;
  _$jscoverage['/underscore.js'].lineData[1129] = 0;
  _$jscoverage['/underscore.js'].lineData[1130] = 0;
  _$jscoverage['/underscore.js'].lineData[1136] = 0;
  _$jscoverage['/underscore.js'].lineData[1137] = 0;
  _$jscoverage['/underscore.js'].lineData[1138] = 0;
  _$jscoverage['/underscore.js'].lineData[1142] = 0;
  _$jscoverage['/underscore.js'].lineData[1143] = 0;
  _$jscoverage['/underscore.js'].lineData[1144] = 0;
  _$jscoverage['/underscore.js'].lineData[1145] = 0;
  _$jscoverage['/underscore.js'].lineData[1146] = 0;
  _$jscoverage['/underscore.js'].lineData[1147] = 0;
  _$jscoverage['/underscore.js'].lineData[1148] = 0;
  _$jscoverage['/underscore.js'].lineData[1150] = 0;
  _$jscoverage['/underscore.js'].lineData[1155] = 0;
  _$jscoverage['/underscore.js'].lineData[1156] = 0;
  _$jscoverage['/underscore.js'].lineData[1159] = 0;
  _$jscoverage['/underscore.js'].lineData[1161] = 0;
  _$jscoverage['/underscore.js'].lineData[1163] = 0;
  _$jscoverage['/underscore.js'].lineData[1165] = 0;
  _$jscoverage['/underscore.js'].lineData[1166] = 0;
  _$jscoverage['/underscore.js'].lineData[1167] = 0;
  _$jscoverage['/underscore.js'].lineData[1171] = 0;
  _$jscoverage['/underscore.js'].lineData[1173] = 0;
  _$jscoverage['/underscore.js'].lineData[1174] = 0;
  _$jscoverage['/underscore.js'].lineData[1176] = 0;
  _$jscoverage['/underscore.js'].lineData[1177] = 0;
  _$jscoverage['/underscore.js'].lineData[1178] = 0;
  _$jscoverage['/underscore.js'].lineData[1180] = 0;
  _$jscoverage['/underscore.js'].lineData[1185] = 0;
  _$jscoverage['/underscore.js'].lineData[1189] = 0;
  _$jscoverage['/underscore.js'].lineData[1191] = 0;
  _$jscoverage['/underscore.js'].lineData[1192] = 0;
  _$jscoverage['/underscore.js'].lineData[1197] = 0;
  _$jscoverage['/underscore.js'].lineData[1200] = 0;
  _$jscoverage['/underscore.js'].lineData[1201] = 0;
  _$jscoverage['/underscore.js'].lineData[1202] = 0;
  _$jscoverage['/underscore.js'].lineData[1206] = 0;
  _$jscoverage['/underscore.js'].lineData[1207] = 0;
  _$jscoverage['/underscore.js'].lineData[1210] = 0;
  _$jscoverage['/underscore.js'].lineData[1218] = 0;
  _$jscoverage['/underscore.js'].lineData[1219] = 0;
  _$jscoverage['/underscore.js'].lineData[1220] = 0;
  _$jscoverage['/underscore.js'].lineData[1221] = 0;
  _$jscoverage['/underscore.js'].lineData[1224] = 0;
  _$jscoverage['/underscore.js'].lineData[1228] = 0;
  _$jscoverage['/underscore.js'].lineData[1229] = 0;
  _$jscoverage['/underscore.js'].lineData[1232] = 0;
  _$jscoverage['/underscore.js'].lineData[1234] = 0;
  _$jscoverage['/underscore.js'].lineData[1235] = 0;
  _$jscoverage['/underscore.js'].lineData[1237] = 0;
  _$jscoverage['/underscore.js'].lineData[1238] = 0;
  _$jscoverage['/underscore.js'].lineData[1242] = 0;
  _$jscoverage['/underscore.js'].lineData[1243] = 0;
  _$jscoverage['/underscore.js'].lineData[1245] = 0;
  _$jscoverage['/underscore.js'].lineData[1246] = 0;
  _$jscoverage['/underscore.js'].lineData[1248] = 0;
  _$jscoverage['/underscore.js'].lineData[1249] = 0;
  _$jscoverage['/underscore.js'].lineData[1253] = 0;
  _$jscoverage['/underscore.js'].lineData[1254] = 0;
  _$jscoverage['/underscore.js'].lineData[1255] = 0;
  _$jscoverage['/underscore.js'].lineData[1259] = 0;
  _$jscoverage['/underscore.js'].lineData[1260] = 0;
  _$jscoverage['/underscore.js'].lineData[1265] = 0;
  _$jscoverage['/underscore.js'].lineData[1266] = 0;
  _$jscoverage['/underscore.js'].lineData[1267] = 0;
  _$jscoverage['/underscore.js'].lineData[1268] = 0;
  _$jscoverage['/underscore.js'].lineData[1272] = 0;
  _$jscoverage['/underscore.js'].lineData[1273] = 0;
  _$jscoverage['/underscore.js'].lineData[1278] = 0;
  _$jscoverage['/underscore.js'].lineData[1279] = 0;
  _$jscoverage['/underscore.js'].lineData[1283] = 0;
  _$jscoverage['/underscore.js'].lineData[1284] = 0;
  _$jscoverage['/underscore.js'].lineData[1285] = 0;
  _$jscoverage['/underscore.js'].lineData[1289] = 0;
  _$jscoverage['/underscore.js'].lineData[1290] = 0;
  _$jscoverage['/underscore.js'].lineData[1291] = 0;
  _$jscoverage['/underscore.js'].lineData[1297] = 0;
  _$jscoverage['/underscore.js'].lineData[1298] = 0;
  _$jscoverage['/underscore.js'].lineData[1299] = 0;
  _$jscoverage['/underscore.js'].lineData[1305] = 0;
  _$jscoverage['/underscore.js'].lineData[1306] = 0;
  _$jscoverage['/underscore.js'].lineData[1307] = 0;
  _$jscoverage['/underscore.js'].lineData[1308] = 0;
  _$jscoverage['/underscore.js'].lineData[1313] = 0;
  _$jscoverage['/underscore.js'].lineData[1314] = 0;
  _$jscoverage['/underscore.js'].lineData[1318] = 0;
  _$jscoverage['/underscore.js'].lineData[1319] = 0;
  _$jscoverage['/underscore.js'].lineData[1323] = 0;
  _$jscoverage['/underscore.js'].lineData[1324] = 0;
  _$jscoverage['/underscore.js'].lineData[1328] = 0;
  _$jscoverage['/underscore.js'].lineData[1329] = 0;
  _$jscoverage['/underscore.js'].lineData[1333] = 0;
  _$jscoverage['/underscore.js'].lineData[1334] = 0;
  _$jscoverage['/underscore.js'].lineData[1339] = 0;
  _$jscoverage['/underscore.js'].lineData[1340] = 0;
  _$jscoverage['/underscore.js'].lineData[1348] = 0;
  _$jscoverage['/underscore.js'].lineData[1349] = 0;
  _$jscoverage['/underscore.js'].lineData[1350] = 0;
  _$jscoverage['/underscore.js'].lineData[1354] = 0;
  _$jscoverage['/underscore.js'].lineData[1355] = 0;
  _$jscoverage['/underscore.js'].lineData[1359] = 0;
  _$jscoverage['/underscore.js'].lineData[1360] = 0;
  _$jscoverage['/underscore.js'].lineData[1361] = 0;
  _$jscoverage['/underscore.js'].lineData[1365] = 0;
  _$jscoverage['/underscore.js'].lineData[1367] = 0;
  _$jscoverage['/underscore.js'].lineData[1370] = 0;
  _$jscoverage['/underscore.js'].lineData[1371] = 0;
  _$jscoverage['/underscore.js'].lineData[1372] = 0;
  _$jscoverage['/underscore.js'].lineData[1378] = 0;
  _$jscoverage['/underscore.js'].lineData[1379] = 0;
  _$jscoverage['/underscore.js'].lineData[1380] = 0;
  _$jscoverage['/underscore.js'].lineData[1381] = 0;
  _$jscoverage['/underscore.js'].lineData[1386] = 0;
  _$jscoverage['/underscore.js'].lineData[1387] = 0;
  _$jscoverage['/underscore.js'].lineData[1388] = 0;
  _$jscoverage['/underscore.js'].lineData[1389] = 0;
  _$jscoverage['/underscore.js'].lineData[1390] = 0;
  _$jscoverage['/underscore.js'].lineData[1394] = 0;
  _$jscoverage['/underscore.js'].lineData[1395] = 0;
  _$jscoverage['/underscore.js'].lineData[1396] = 0;
  _$jscoverage['/underscore.js'].lineData[1397] = 0;
  _$jscoverage['/underscore.js'].lineData[1399] = 0;
  _$jscoverage['/underscore.js'].lineData[1403] = 0;
  _$jscoverage['/underscore.js'].lineData[1404] = 0;
  _$jscoverage['/underscore.js'].lineData[1408] = 0;
  _$jscoverage['/underscore.js'].lineData[1416] = 0;
  _$jscoverage['/underscore.js'].lineData[1419] = 0;
  _$jscoverage['/underscore.js'].lineData[1420] = 0;
  _$jscoverage['/underscore.js'].lineData[1421] = 0;
  _$jscoverage['/underscore.js'].lineData[1424] = 0;
  _$jscoverage['/underscore.js'].lineData[1425] = 0;
  _$jscoverage['/underscore.js'].lineData[1426] = 0;
  _$jscoverage['/underscore.js'].lineData[1427] = 0;
  _$jscoverage['/underscore.js'].lineData[1428] = 0;
  _$jscoverage['/underscore.js'].lineData[1429] = 0;
  _$jscoverage['/underscore.js'].lineData[1432] = 0;
  _$jscoverage['/underscore.js'].lineData[1433] = 0;
  _$jscoverage['/underscore.js'].lineData[1437] = 0;
  _$jscoverage['/underscore.js'].lineData[1438] = 0;
  _$jscoverage['/underscore.js'].lineData[1439] = 0;
  _$jscoverage['/underscore.js'].lineData[1440] = 0;
  _$jscoverage['/underscore.js'].lineData[1442] = 0;
  _$jscoverage['/underscore.js'].lineData[1447] = 0;
  _$jscoverage['/underscore.js'].lineData[1448] = 0;
  _$jscoverage['/underscore.js'].lineData[1449] = 0;
  _$jscoverage['/underscore.js'].lineData[1450] = 0;
  _$jscoverage['/underscore.js'].lineData[1455] = 0;
  _$jscoverage['/underscore.js'].lineData[1464] = 0;
  _$jscoverage['/underscore.js'].lineData[1468] = 0;
  _$jscoverage['/underscore.js'].lineData[1477] = 0;
  _$jscoverage['/underscore.js'].lineData[1479] = 0;
  _$jscoverage['/underscore.js'].lineData[1480] = 0;
  _$jscoverage['/underscore.js'].lineData[1487] = 0;
  _$jscoverage['/underscore.js'].lineData[1488] = 0;
  _$jscoverage['/underscore.js'].lineData[1489] = 0;
  _$jscoverage['/underscore.js'].lineData[1492] = 0;
  _$jscoverage['/underscore.js'].lineData[1499] = 0;
  _$jscoverage['/underscore.js'].lineData[1500] = 0;
  _$jscoverage['/underscore.js'].lineData[1501] = 0;
  _$jscoverage['/underscore.js'].lineData[1502] = 0;
  _$jscoverage['/underscore.js'].lineData[1503] = 0;
  _$jscoverage['/underscore.js'].lineData[1505] = 0;
  _$jscoverage['/underscore.js'].lineData[1506] = 0;
  _$jscoverage['/underscore.js'].lineData[1507] = 0;
  _$jscoverage['/underscore.js'].lineData[1508] = 0;
  _$jscoverage['/underscore.js'].lineData[1509] = 0;
  _$jscoverage['/underscore.js'].lineData[1510] = 0;
  _$jscoverage['/underscore.js'].lineData[1514] = 0;
  _$jscoverage['/underscore.js'].lineData[1516] = 0;
  _$jscoverage['/underscore.js'].lineData[1519] = 0;
  _$jscoverage['/underscore.js'].lineData[1521] = 0;
  _$jscoverage['/underscore.js'].lineData[1525] = 0;
  _$jscoverage['/underscore.js'].lineData[1526] = 0;
  _$jscoverage['/underscore.js'].lineData[1527] = 0;
  _$jscoverage['/underscore.js'].lineData[1529] = 0;
  _$jscoverage['/underscore.js'].lineData[1530] = 0;
  _$jscoverage['/underscore.js'].lineData[1533] = 0;
  _$jscoverage['/underscore.js'].lineData[1534] = 0;
  _$jscoverage['/underscore.js'].lineData[1538] = 0;
  _$jscoverage['/underscore.js'].lineData[1539] = 0;
  _$jscoverage['/underscore.js'].lineData[1541] = 0;
  _$jscoverage['/underscore.js'].lineData[1545] = 0;
  _$jscoverage['/underscore.js'].lineData[1546] = 0;
  _$jscoverage['/underscore.js'].lineData[1547] = 0;
  _$jscoverage['/underscore.js'].lineData[1548] = 0;
  _$jscoverage['/underscore.js'].lineData[1558] = 0;
  _$jscoverage['/underscore.js'].lineData[1559] = 0;
  _$jscoverage['/underscore.js'].lineData[1563] = 0;
  _$jscoverage['/underscore.js'].lineData[1564] = 0;
  _$jscoverage['/underscore.js'].lineData[1565] = 0;
  _$jscoverage['/underscore.js'].lineData[1566] = 0;
  _$jscoverage['/underscore.js'].lineData[1567] = 0;
  _$jscoverage['/underscore.js'].lineData[1568] = 0;
  _$jscoverage['/underscore.js'].lineData[1569] = 0;
  _$jscoverage['/underscore.js'].lineData[1575] = 0;
  _$jscoverage['/underscore.js'].lineData[1578] = 0;
  _$jscoverage['/underscore.js'].lineData[1579] = 0;
  _$jscoverage['/underscore.js'].lineData[1580] = 0;
  _$jscoverage['/underscore.js'].lineData[1581] = 0;
  _$jscoverage['/underscore.js'].lineData[1582] = 0;
  _$jscoverage['/underscore.js'].lineData[1583] = 0;
  _$jscoverage['/underscore.js'].lineData[1584] = 0;
  _$jscoverage['/underscore.js'].lineData[1589] = 0;
  _$jscoverage['/underscore.js'].lineData[1590] = 0;
  _$jscoverage['/underscore.js'].lineData[1591] = 0;
  _$jscoverage['/underscore.js'].lineData[1592] = 0;
  _$jscoverage['/underscore.js'].lineData[1597] = 0;
  _$jscoverage['/underscore.js'].lineData[1598] = 0;
  _$jscoverage['/underscore.js'].lineData[1603] = 0;
  _$jscoverage['/underscore.js'].lineData[1605] = 0;
  _$jscoverage['/underscore.js'].lineData[1606] = 0;
  _$jscoverage['/underscore.js'].lineData[1616] = 0;
  _$jscoverage['/underscore.js'].lineData[1617] = 0;
  _$jscoverage['/underscore.js'].lineData[1618] = 0;
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
  _$jscoverage['/underscore.js'].functionData[167] = 0;
  _$jscoverage['/underscore.js'].functionData[168] = 0;
  _$jscoverage['/underscore.js'].functionData[169] = 0;
}
if (! _$jscoverage['/underscore.js'].branchData) {
  _$jscoverage['/underscore.js'].branchData = {};
  _$jscoverage['/underscore.js'].branchData['14'] = [];
  _$jscoverage['/underscore.js'].branchData['14'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['14'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['14'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['14'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['14'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['14'][6] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['15'] = [];
  _$jscoverage['/underscore.js'].branchData['15'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['15'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['15'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['15'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['41'] = [];
  _$jscoverage['/underscore.js'].branchData['41'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['42'] = [];
  _$jscoverage['/underscore.js'].branchData['42'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['51'] = [];
  _$jscoverage['/underscore.js'].branchData['51'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['51'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['52'] = [];
  _$jscoverage['/underscore.js'].branchData['52'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['52'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['52'][3] = new BranchData();
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
  _$jscoverage['/underscore.js'].branchData['104'] = [];
  _$jscoverage['/underscore.js'].branchData['104'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['108'] = [];
  _$jscoverage['/underscore.js'].branchData['108'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['117'] = [];
  _$jscoverage['/underscore.js'].branchData['117'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['127'] = [];
  _$jscoverage['/underscore.js'].branchData['127'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['128'] = [];
  _$jscoverage['/underscore.js'].branchData['128'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['137'] = [];
  _$jscoverage['/underscore.js'].branchData['137'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['149'] = [];
  _$jscoverage['/underscore.js'].branchData['149'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['149'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['149'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['149'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['149'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['161'] = [];
  _$jscoverage['/underscore.js'].branchData['161'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['162'] = [];
  _$jscoverage['/underscore.js'].branchData['162'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['167'] = [];
  _$jscoverage['/underscore.js'].branchData['167'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['177'] = [];
  _$jscoverage['/underscore.js'].branchData['177'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['178'] = [];
  _$jscoverage['/underscore.js'].branchData['178'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['180'] = [];
  _$jscoverage['/underscore.js'].branchData['180'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['181'] = [];
  _$jscoverage['/underscore.js'].branchData['181'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['192'] = [];
  _$jscoverage['/underscore.js'].branchData['192'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['193'] = [];
  _$jscoverage['/underscore.js'].branchData['193'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['194'] = [];
  _$jscoverage['/underscore.js'].branchData['194'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['195'] = [];
  _$jscoverage['/underscore.js'].branchData['195'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['196'] = [];
  _$jscoverage['/underscore.js'].branchData['196'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['199'] = [];
  _$jscoverage['/underscore.js'].branchData['199'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['199'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['199'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['200'] = [];
  _$jscoverage['/underscore.js'].branchData['200'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['207'] = [];
  _$jscoverage['/underscore.js'].branchData['207'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['222'] = [];
  _$jscoverage['/underscore.js'].branchData['222'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['227'] = [];
  _$jscoverage['/underscore.js'].branchData['227'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['227'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['227'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['236'] = [];
  _$jscoverage['/underscore.js'].branchData['236'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['250'] = [];
  _$jscoverage['/underscore.js'].branchData['250'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['251'] = [];
  _$jscoverage['/underscore.js'].branchData['251'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['252'] = [];
  _$jscoverage['/underscore.js'].branchData['252'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['253'] = [];
  _$jscoverage['/underscore.js'].branchData['253'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['254'] = [];
  _$jscoverage['/underscore.js'].branchData['254'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['263'] = [];
  _$jscoverage['/underscore.js'].branchData['263'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['264'] = [];
  _$jscoverage['/underscore.js'].branchData['264'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['265'] = [];
  _$jscoverage['/underscore.js'].branchData['265'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['266'] = [];
  _$jscoverage['/underscore.js'].branchData['266'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['267'] = [];
  _$jscoverage['/underscore.js'].branchData['267'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['275'] = [];
  _$jscoverage['/underscore.js'].branchData['275'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['276'] = [];
  _$jscoverage['/underscore.js'].branchData['276'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['276'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['277'] = [];
  _$jscoverage['/underscore.js'].branchData['277'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['284'] = [];
  _$jscoverage['/underscore.js'].branchData['284'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['285'] = [];
  _$jscoverage['/underscore.js'].branchData['285'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['310'] = [];
  _$jscoverage['/underscore.js'].branchData['310'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['310'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['310'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['310'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['310'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['310'][6] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['310'][7] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['311'] = [];
  _$jscoverage['/underscore.js'].branchData['311'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['312'] = [];
  _$jscoverage['/underscore.js'].branchData['312'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['314'] = [];
  _$jscoverage['/underscore.js'].branchData['314'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['314'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['314'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['322'] = [];
  _$jscoverage['/underscore.js'].branchData['322'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['322'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['322'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['322'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['322'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['335'] = [];
  _$jscoverage['/underscore.js'].branchData['335'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['335'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['335'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['335'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['335'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['335'][6] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['335'][7] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['336'] = [];
  _$jscoverage['/underscore.js'].branchData['336'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['337'] = [];
  _$jscoverage['/underscore.js'].branchData['337'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['339'] = [];
  _$jscoverage['/underscore.js'].branchData['339'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['339'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['339'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['347'] = [];
  _$jscoverage['/underscore.js'].branchData['347'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['347'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['347'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['347'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['347'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['366'] = [];
  _$jscoverage['/underscore.js'].branchData['366'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['366'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['367'] = [];
  _$jscoverage['/underscore.js'].branchData['367'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['370'] = [];
  _$jscoverage['/underscore.js'].branchData['370'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['374'] = [];
  _$jscoverage['/underscore.js'].branchData['374'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['396'] = [];
  _$jscoverage['/underscore.js'].branchData['396'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['397'] = [];
  _$jscoverage['/underscore.js'].branchData['397'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['397'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['397'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['398'] = [];
  _$jscoverage['/underscore.js'].branchData['398'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['398'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['398'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['407'] = [];
  _$jscoverage['/underscore.js'].branchData['407'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['420'] = [];
  _$jscoverage['/underscore.js'].branchData['420'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['433'] = [];
  _$jscoverage['/underscore.js'].branchData['433'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['439'] = [];
  _$jscoverage['/underscore.js'].branchData['439'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['440'] = [];
  _$jscoverage['/underscore.js'].branchData['440'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['441'] = [];
  _$jscoverage['/underscore.js'].branchData['441'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['445'] = [];
  _$jscoverage['/underscore.js'].branchData['445'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['451'] = [];
  _$jscoverage['/underscore.js'].branchData['451'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['452'] = [];
  _$jscoverage['/underscore.js'].branchData['452'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['458'] = [];
  _$jscoverage['/underscore.js'].branchData['458'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['468'] = [];
  _$jscoverage['/underscore.js'].branchData['468'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['469'] = [];
  _$jscoverage['/underscore.js'].branchData['469'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['469'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['477'] = [];
  _$jscoverage['/underscore.js'].branchData['477'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['477'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['483'] = [];
  _$jscoverage['/underscore.js'].branchData['483'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['484'] = [];
  _$jscoverage['/underscore.js'].branchData['484'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['484'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['492'] = [];
  _$jscoverage['/underscore.js'].branchData['492'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['492'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['502'] = [];
  _$jscoverage['/underscore.js'].branchData['502'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['504'] = [];
  _$jscoverage['/underscore.js'].branchData['504'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['506'] = [];
  _$jscoverage['/underscore.js'].branchData['506'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['506'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['508'] = [];
  _$jscoverage['/underscore.js'].branchData['508'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['510'] = [];
  _$jscoverage['/underscore.js'].branchData['510'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['515'] = [];
  _$jscoverage['/underscore.js'].branchData['515'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['536'] = [];
  _$jscoverage['/underscore.js'].branchData['536'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['541'] = [];
  _$jscoverage['/underscore.js'].branchData['541'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['544'] = [];
  _$jscoverage['/underscore.js'].branchData['544'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['546'] = [];
  _$jscoverage['/underscore.js'].branchData['546'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['547'] = [];
  _$jscoverage['/underscore.js'].branchData['547'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['548'] = [];
  _$jscoverage['/underscore.js'].branchData['548'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['548'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['550'] = [];
  _$jscoverage['/underscore.js'].branchData['550'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['551'] = [];
  _$jscoverage['/underscore.js'].branchData['551'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['555'] = [];
  _$jscoverage['/underscore.js'].branchData['555'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['573'] = [];
  _$jscoverage['/underscore.js'].branchData['573'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['575'] = [];
  _$jscoverage['/underscore.js'].branchData['575'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['577'] = [];
  _$jscoverage['/underscore.js'].branchData['577'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['578'] = [];
  _$jscoverage['/underscore.js'].branchData['578'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['580'] = [];
  _$jscoverage['/underscore.js'].branchData['580'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['597'] = [];
  _$jscoverage['/underscore.js'].branchData['597'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['597'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['600'] = [];
  _$jscoverage['/underscore.js'].branchData['600'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['615'] = [];
  _$jscoverage['/underscore.js'].branchData['615'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['616'] = [];
  _$jscoverage['/underscore.js'].branchData['616'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['630'] = [];
  _$jscoverage['/underscore.js'].branchData['630'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['631'] = [];
  _$jscoverage['/underscore.js'].branchData['631'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['631'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['631'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['632'] = [];
  _$jscoverage['/underscore.js'].branchData['632'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['648'] = [];
  _$jscoverage['/underscore.js'].branchData['648'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['650'] = [];
  _$jscoverage['/underscore.js'].branchData['650'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['659'] = [];
  _$jscoverage['/underscore.js'].branchData['659'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['660'] = [];
  _$jscoverage['/underscore.js'].branchData['660'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['661'] = [];
  _$jscoverage['/underscore.js'].branchData['661'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['663'] = [];
  _$jscoverage['/underscore.js'].branchData['663'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['665'] = [];
  _$jscoverage['/underscore.js'].branchData['665'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['665'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['667'] = [];
  _$jscoverage['/underscore.js'].branchData['667'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['669'] = [];
  _$jscoverage['/underscore.js'].branchData['669'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['671'] = [];
  _$jscoverage['/underscore.js'].branchData['671'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['673'] = [];
  _$jscoverage['/underscore.js'].branchData['673'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['673'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['673'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['673'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['674'] = [];
  _$jscoverage['/underscore.js'].branchData['674'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['691'] = [];
  _$jscoverage['/underscore.js'].branchData['691'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['692'] = [];
  _$jscoverage['/underscore.js'].branchData['692'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['695'] = [];
  _$jscoverage['/underscore.js'].branchData['695'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['696'] = [];
  _$jscoverage['/underscore.js'].branchData['696'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['702'] = [];
  _$jscoverage['/underscore.js'].branchData['702'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['712'] = [];
  _$jscoverage['/underscore.js'].branchData['712'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['712'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['712'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['716'] = [];
  _$jscoverage['/underscore.js'].branchData['716'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['728'] = [];
  _$jscoverage['/underscore.js'].branchData['728'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['731'] = [];
  _$jscoverage['/underscore.js'].branchData['731'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['739'] = [];
  _$jscoverage['/underscore.js'].branchData['739'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['755'] = [];
  _$jscoverage['/underscore.js'].branchData['755'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['756'] = [];
  _$jscoverage['/underscore.js'].branchData['756'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['758'] = [];
  _$jscoverage['/underscore.js'].branchData['758'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['772'] = [];
  _$jscoverage['/underscore.js'].branchData['772'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['773'] = [];
  _$jscoverage['/underscore.js'].branchData['773'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['783'] = [];
  _$jscoverage['/underscore.js'].branchData['783'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['784'] = [];
  _$jscoverage['/underscore.js'].branchData['784'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['811'] = [];
  _$jscoverage['/underscore.js'].branchData['811'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['814'] = [];
  _$jscoverage['/underscore.js'].branchData['814'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['817'] = [];
  _$jscoverage['/underscore.js'].branchData['817'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['822'] = [];
  _$jscoverage['/underscore.js'].branchData['822'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['822'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['826'] = [];
  _$jscoverage['/underscore.js'].branchData['826'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['826'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['826'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['827'] = [];
  _$jscoverage['/underscore.js'].branchData['827'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['833'] = [];
  _$jscoverage['/underscore.js'].branchData['833'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['834'] = [];
  _$jscoverage['/underscore.js'].branchData['834'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['834'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['858'] = [];
  _$jscoverage['/underscore.js'].branchData['858'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['862'] = [];
  _$jscoverage['/underscore.js'].branchData['862'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['863'] = [];
  _$jscoverage['/underscore.js'].branchData['863'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['864'] = [];
  _$jscoverage['/underscore.js'].branchData['864'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['867'] = [];
  _$jscoverage['/underscore.js'].branchData['867'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['904'] = [];
  _$jscoverage['/underscore.js'].branchData['904'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['912'] = [];
  _$jscoverage['/underscore.js'].branchData['912'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['922'] = [];
  _$jscoverage['/underscore.js'].branchData['922'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['925'] = [];
  _$jscoverage['/underscore.js'].branchData['925'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['947'] = [];
  _$jscoverage['/underscore.js'].branchData['947'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['947'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['951'] = [];
  _$jscoverage['/underscore.js'].branchData['951'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['953'] = [];
  _$jscoverage['/underscore.js'].branchData['953'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['955'] = [];
  _$jscoverage['/underscore.js'].branchData['955'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['955'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['955'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['964'] = [];
  _$jscoverage['/underscore.js'].branchData['964'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['965'] = [];
  _$jscoverage['/underscore.js'].branchData['965'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['967'] = [];
  _$jscoverage['/underscore.js'].branchData['967'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['969'] = [];
  _$jscoverage['/underscore.js'].branchData['969'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['975'] = [];
  _$jscoverage['/underscore.js'].branchData['975'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['979'] = [];
  _$jscoverage['/underscore.js'].branchData['979'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['988'] = [];
  _$jscoverage['/underscore.js'].branchData['988'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1001'] = [];
  _$jscoverage['/underscore.js'].branchData['1001'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1013'] = [];
  _$jscoverage['/underscore.js'].branchData['1013'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1023'] = [];
  _$jscoverage['/underscore.js'].branchData['1023'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1034'] = [];
  _$jscoverage['/underscore.js'].branchData['1034'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1043'] = [];
  _$jscoverage['/underscore.js'].branchData['1043'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1044'] = [];
  _$jscoverage['/underscore.js'].branchData['1044'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1044'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1044'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1045'] = [];
  _$jscoverage['/underscore.js'].branchData['1045'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1049'] = [];
  _$jscoverage['/underscore.js'].branchData['1049'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1051'] = [];
  _$jscoverage['/underscore.js'].branchData['1051'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1051'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1069'] = [];
  _$jscoverage['/underscore.js'].branchData['1069'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1071'] = [];
  _$jscoverage['/underscore.js'].branchData['1071'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1083'] = [];
  _$jscoverage['/underscore.js'].branchData['1083'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1084'] = [];
  _$jscoverage['/underscore.js'].branchData['1084'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1085'] = [];
  _$jscoverage['/underscore.js'].branchData['1085'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1092'] = [];
  _$jscoverage['/underscore.js'].branchData['1092'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1095'] = [];
  _$jscoverage['/underscore.js'].branchData['1095'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1103'] = [];
  _$jscoverage['/underscore.js'].branchData['1103'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1105'] = [];
  _$jscoverage['/underscore.js'].branchData['1105'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1123'] = [];
  _$jscoverage['/underscore.js'].branchData['1123'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1129'] = [];
  _$jscoverage['/underscore.js'].branchData['1129'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1130'] = [];
  _$jscoverage['/underscore.js'].branchData['1130'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1144'] = [];
  _$jscoverage['/underscore.js'].branchData['1144'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1146'] = [];
  _$jscoverage['/underscore.js'].branchData['1146'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1148'] = [];
  _$jscoverage['/underscore.js'].branchData['1148'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1148'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1159'] = [];
  _$jscoverage['/underscore.js'].branchData['1159'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1159'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1159'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1159'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1161'] = [];
  _$jscoverage['/underscore.js'].branchData['1161'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1161'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1161'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1161'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1163'] = [];
  _$jscoverage['/underscore.js'].branchData['1163'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1163'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1166'] = [];
  _$jscoverage['/underscore.js'].branchData['1166'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1166'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1166'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1166'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1166'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1173'] = [];
  _$jscoverage['/underscore.js'].branchData['1173'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1174'] = [];
  _$jscoverage['/underscore.js'].branchData['1174'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1177'] = [];
  _$jscoverage['/underscore.js'].branchData['1177'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1185'] = [];
  _$jscoverage['/underscore.js'].branchData['1185'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1189'] = [];
  _$jscoverage['/underscore.js'].branchData['1189'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1189'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1191'] = [];
  _$jscoverage['/underscore.js'].branchData['1191'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1191'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1191'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1197'] = [];
  _$jscoverage['/underscore.js'].branchData['1197'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1200'] = [];
  _$jscoverage['/underscore.js'].branchData['1200'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1201'] = [];
  _$jscoverage['/underscore.js'].branchData['1201'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1202'] = [];
  _$jscoverage['/underscore.js'].branchData['1202'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1202'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1202'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1207'] = [];
  _$jscoverage['/underscore.js'].branchData['1207'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1207'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1207'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1207'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1207'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1207'][6] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1209'] = [];
  _$jscoverage['/underscore.js'].branchData['1209'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1218'] = [];
  _$jscoverage['/underscore.js'].branchData['1218'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1219'] = [];
  _$jscoverage['/underscore.js'].branchData['1219'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1221'] = [];
  _$jscoverage['/underscore.js'].branchData['1221'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1224'] = [];
  _$jscoverage['/underscore.js'].branchData['1224'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1224'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1232'] = [];
  _$jscoverage['/underscore.js'].branchData['1232'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1235'] = [];
  _$jscoverage['/underscore.js'].branchData['1235'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1237'] = [];
  _$jscoverage['/underscore.js'].branchData['1237'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1238'] = [];
  _$jscoverage['/underscore.js'].branchData['1238'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1245'] = [];
  _$jscoverage['/underscore.js'].branchData['1245'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1246'] = [];
  _$jscoverage['/underscore.js'].branchData['1246'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1249'] = [];
  _$jscoverage['/underscore.js'].branchData['1249'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1249'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1266'] = [];
  _$jscoverage['/underscore.js'].branchData['1266'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1267'] = [];
  _$jscoverage['/underscore.js'].branchData['1267'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1267'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1267'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1267'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1268'] = [];
  _$jscoverage['/underscore.js'].branchData['1268'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1273'] = [];
  _$jscoverage['/underscore.js'].branchData['1273'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1273'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1278'] = [];
  _$jscoverage['/underscore.js'].branchData['1278'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1279'] = [];
  _$jscoverage['/underscore.js'].branchData['1279'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1285'] = [];
  _$jscoverage['/underscore.js'].branchData['1285'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1285'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1285'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1285'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1291'] = [];
  _$jscoverage['/underscore.js'].branchData['1291'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1297'] = [];
  _$jscoverage['/underscore.js'].branchData['1297'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1305'] = [];
  _$jscoverage['/underscore.js'].branchData['1305'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1306'] = [];
  _$jscoverage['/underscore.js'].branchData['1306'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1306'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1306'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1306'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1306'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1308'] = [];
  _$jscoverage['/underscore.js'].branchData['1308'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1308'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1314'] = [];
  _$jscoverage['/underscore.js'].branchData['1314'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1314'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1319'] = [];
  _$jscoverage['/underscore.js'].branchData['1319'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1324'] = [];
  _$jscoverage['/underscore.js'].branchData['1324'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1324'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1324'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1324'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1324'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1329'] = [];
  _$jscoverage['/underscore.js'].branchData['1329'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1334'] = [];
  _$jscoverage['/underscore.js'].branchData['1334'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1340'] = [];
  _$jscoverage['/underscore.js'].branchData['1340'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1340'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1371'] = [];
  _$jscoverage['/underscore.js'].branchData['1371'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1389'] = [];
  _$jscoverage['/underscore.js'].branchData['1389'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1395'] = [];
  _$jscoverage['/underscore.js'].branchData['1395'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1403'] = [];
  _$jscoverage['/underscore.js'].branchData['1403'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1428'] = [];
  _$jscoverage['/underscore.js'].branchData['1428'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1429'] = [];
  _$jscoverage['/underscore.js'].branchData['1429'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1438'] = [];
  _$jscoverage['/underscore.js'].branchData['1438'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1439'] = [];
  _$jscoverage['/underscore.js'].branchData['1439'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1442'] = [];
  _$jscoverage['/underscore.js'].branchData['1442'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1450'] = [];
  _$jscoverage['/underscore.js'].branchData['1450'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1488'] = [];
  _$jscoverage['/underscore.js'].branchData['1488'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1493'] = [];
  _$jscoverage['/underscore.js'].branchData['1493'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1494'] = [];
  _$jscoverage['/underscore.js'].branchData['1494'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1495'] = [];
  _$jscoverage['/underscore.js'].branchData['1495'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1505'] = [];
  _$jscoverage['/underscore.js'].branchData['1505'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1507'] = [];
  _$jscoverage['/underscore.js'].branchData['1507'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1509'] = [];
  _$jscoverage['/underscore.js'].branchData['1509'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1519'] = [];
  _$jscoverage['/underscore.js'].branchData['1519'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1527'] = [];
  _$jscoverage['/underscore.js'].branchData['1527'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1538'] = [];
  _$jscoverage['/underscore.js'].branchData['1538'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1559'] = [];
  _$jscoverage['/underscore.js'].branchData['1559'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1583'] = [];
  _$jscoverage['/underscore.js'].branchData['1583'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1583'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1583'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1583'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1583'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1616'] = [];
  _$jscoverage['/underscore.js'].branchData['1616'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1616'][2] = new BranchData();
}
_$jscoverage['/underscore.js'].branchData['1207'][6].init(31, 45);
function visit381_1207_6(result) {
  _$jscoverage['/underscore.js'].branchData['1207'][6].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['15'][4].init(41, 24);
function visit380_15_4(result) {
  _$jscoverage['/underscore.js'].branchData['15'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1207'][5].init(31, 99);
function visit379_1207_5(result) {
  _$jscoverage['/underscore.js'].branchData['1207'][5].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['347'][5].init(64, 19);
function visit378_347_5(result) {
  _$jscoverage['/underscore.js'].branchData['347'][5].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['335'][7].init(60, 25);
function visit377_335_7(result) {
  _$jscoverage['/underscore.js'].branchData['335'][7].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['322'][5].init(65, 20);
function visit376_322_5(result) {
  _$jscoverage['/underscore.js'].branchData['322'][5].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['310'][7].init(60, 25);
function visit375_310_7(result) {
  _$jscoverage['/underscore.js'].branchData['310'][7].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['15'][3].init(12, 25);
function visit374_15_3(result) {
  _$jscoverage['/underscore.js'].branchData['15'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['14'][6].init(40, 18);
function visit373_14_6(result) {
  _$jscoverage['/underscore.js'].branchData['14'][6].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1207'][4].init(31, 125);
function visit372_1207_4(result) {
  _$jscoverage['/underscore.js'].branchData['1207'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['347'][4].init(39, 21);
function visit371_347_4(result) {
  _$jscoverage['/underscore.js'].branchData['347'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['339'][3].init(29, 14);
function visit370_339_3(result) {
  _$jscoverage['/underscore.js'].branchData['339'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['335'][6].init(90, 11);
function visit369_335_6(result) {
  _$jscoverage['/underscore.js'].branchData['335'][6].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['335'][5].init(29, 27);
function visit368_335_5(result) {
  _$jscoverage['/underscore.js'].branchData['335'][5].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['322'][4].init(39, 22);
function visit367_322_4(result) {
  _$jscoverage['/underscore.js'].branchData['322'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['314'][3].init(29, 14);
function visit366_314_3(result) {
  _$jscoverage['/underscore.js'].branchData['314'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['310'][6].init(90, 11);
function visit365_310_6(result) {
  _$jscoverage['/underscore.js'].branchData['310'][6].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['310'][5].init(29, 27);
function visit364_310_5(result) {
  _$jscoverage['/underscore.js'].branchData['310'][5].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['15'][2].init(12, 53);
function visit363_15_2(result) {
  _$jscoverage['/underscore.js'].branchData['15'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['14'][5].init(13, 23);
function visit362_14_5(result) {
  _$jscoverage['/underscore.js'].branchData['14'][5].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1583'][5].init(31, 17);
function visit361_1583_5(result) {
  _$jscoverage['/underscore.js'].branchData['1583'][5].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1324'][5].init(27, 13);
function visit360_1324_5(result) {
  _$jscoverage['/underscore.js'].branchData['1324'][5].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1306'][5].init(34, 28);
function visit359_1306_5(result) {
  _$jscoverage['/underscore.js'].branchData['1306'][5].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1285'][4].init(34, 17);
function visit358_1285_4(result) {
  _$jscoverage['/underscore.js'].branchData['1285'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1249'][2].init(14, 51);
function visit357_1249_2(result) {
  _$jscoverage['/underscore.js'].branchData['1249'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1209'][1].init(30, 40);
function visit356_1209_1(result) {
  _$jscoverage['/underscore.js'].branchData['1209'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1207'][3].init(10, 15);
function visit355_1207_3(result) {
  _$jscoverage['/underscore.js'].branchData['1207'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1202'][3].init(34, 20);
function visit354_1202_3(result) {
  _$jscoverage['/underscore.js'].branchData['1202'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1166'][5].init(31, 17);
function visit353_1166_5(result) {
  _$jscoverage['/underscore.js'].branchData['1166'][5].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1159'][4].init(35, 15);
function visit352_1159_4(result) {
  _$jscoverage['/underscore.js'].branchData['1159'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1051'][2].init(27, 19);
function visit351_1051_2(result) {
  _$jscoverage['/underscore.js'].branchData['1051'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['955'][3].init(25, 25);
function visit350_955_3(result) {
  _$jscoverage['/underscore.js'].branchData['955'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['555'][1].init(17, 26);
function visit349_555_1(result) {
  _$jscoverage['/underscore.js'].branchData['555'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['551'][1].init(12, 27);
function visit348_551_1(result) {
  _$jscoverage['/underscore.js'].branchData['551'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['548'][2].init(18, 17);
function visit347_548_2(result) {
  _$jscoverage['/underscore.js'].branchData['548'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['510'][1].init(17, 7);
function visit346_510_1(result) {
  _$jscoverage['/underscore.js'].branchData['510'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['398'][3].init(21, 12);
function visit345_398_3(result) {
  _$jscoverage['/underscore.js'].branchData['398'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['397'][3].init(21, 12);
function visit344_397_3(result) {
  _$jscoverage['/underscore.js'].branchData['397'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['347'][3].init(39, 44);
function visit343_347_3(result) {
  _$jscoverage['/underscore.js'].branchData['347'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['339'][2].init(12, 13);
function visit342_339_2(result) {
  _$jscoverage['/underscore.js'].branchData['339'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['335'][4].init(29, 56);
function visit341_335_4(result) {
  _$jscoverage['/underscore.js'].branchData['335'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['322'][3].init(39, 46);
function visit340_322_3(result) {
  _$jscoverage['/underscore.js'].branchData['322'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['314'][2].init(12, 13);
function visit339_314_2(result) {
  _$jscoverage['/underscore.js'].branchData['314'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['310'][4].init(29, 56);
function visit338_310_4(result) {
  _$jscoverage['/underscore.js'].branchData['310'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['149'][5].init(40, 11);
function visit337_149_5(result) {
  _$jscoverage['/underscore.js'].branchData['149'][5].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['52'][3].init(8, 28);
function visit336_52_3(result) {
  _$jscoverage['/underscore.js'].branchData['52'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['15'][1].init(12, 63);
function visit335_15_1(result) {
  _$jscoverage['/underscore.js'].branchData['15'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['14'][4].init(13, 45);
function visit334_14_4(result) {
  _$jscoverage['/underscore.js'].branchData['14'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1583'][4].init(53, 16);
function visit333_1583_4(result) {
  _$jscoverage['/underscore.js'].branchData['1583'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1583'][3].init(11, 16);
function visit332_1583_3(result) {
  _$jscoverage['/underscore.js'].branchData['1583'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1509'][1].init(17, 8);
function visit331_1509_1(result) {
  _$jscoverage['/underscore.js'].branchData['1509'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1324'][4].init(44, 41);
function visit330_1324_4(result) {
  _$jscoverage['/underscore.js'].branchData['1324'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1324'][3].init(11, 12);
function visit329_1324_3(result) {
  _$jscoverage['/underscore.js'].branchData['1324'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1308'][2].init(13, 24);
function visit328_1308_2(result) {
  _$jscoverage['/underscore.js'].branchData['1308'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1306'][4].init(66, 29);
function visit327_1306_4(result) {
  _$jscoverage['/underscore.js'].branchData['1306'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1306'][3].init(6, 24);
function visit326_1306_3(result) {
  _$jscoverage['/underscore.js'].branchData['1306'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1285'][3].init(34, 26);
function visit325_1285_3(result) {
  _$jscoverage['/underscore.js'].branchData['1285'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1267'][4].init(29, 33);
function visit324_1267_4(result) {
  _$jscoverage['/underscore.js'].branchData['1267'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1249'][1].init(12, 54);
function visit323_1249_1(result) {
  _$jscoverage['/underscore.js'].branchData['1249'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1238'][1].init(12, 41);
function visit322_1238_1(result) {
  _$jscoverage['/underscore.js'].branchData['1238'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1224'][2].init(39, 20);
function visit321_1224_2(result) {
  _$jscoverage['/underscore.js'].branchData['1224'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1207'][2].init(10, 147);
function visit320_1207_2(result) {
  _$jscoverage['/underscore.js'].branchData['1207'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1202'][2].init(10, 20);
function visit319_1202_2(result) {
  _$jscoverage['/underscore.js'].branchData['1202'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1191'][3].init(45, 9);
function visit318_1191_3(result) {
  _$jscoverage['/underscore.js'].branchData['1191'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1166'][4].init(52, 20);
function visit317_1166_4(result) {
  _$jscoverage['/underscore.js'].branchData['1166'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1166'][3].init(8, 19);
function visit316_1166_3(result) {
  _$jscoverage['/underscore.js'].branchData['1166'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1161'][4].init(21, 9);
function visit315_1161_4(result) {
  _$jscoverage['/underscore.js'].branchData['1161'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1159'][3].init(24, 7);
function visit314_1159_3(result) {
  _$jscoverage['/underscore.js'].branchData['1159'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1148'][2].init(10, 23);
function visit313_1148_2(result) {
  _$jscoverage['/underscore.js'].branchData['1148'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1051'][1].init(14, 32);
function visit312_1051_1(result) {
  _$jscoverage['/underscore.js'].branchData['1051'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1044'][3].init(24, 11);
function visit311_1044_3(result) {
  _$jscoverage['/underscore.js'].branchData['1044'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['955'][2].init(10, 40);
function visit310_955_2(result) {
  _$jscoverage['/underscore.js'].branchData['955'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['834'][2].init(29, 26);
function visit309_834_2(result) {
  _$jscoverage['/underscore.js'].branchData['834'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['826'][3].init(28, 16);
function visit308_826_3(result) {
  _$jscoverage['/underscore.js'].branchData['826'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['712'][3].init(25, 9);
function visit307_712_3(result) {
  _$jscoverage['/underscore.js'].branchData['712'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['673'][4].init(55, 12);
function visit306_673_4(result) {
  _$jscoverage['/underscore.js'].branchData['673'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['667'][1].init(15, 19);
function visit305_667_1(result) {
  _$jscoverage['/underscore.js'].branchData['667'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['665'][2].init(17, 18);
function visit304_665_2(result) {
  _$jscoverage['/underscore.js'].branchData['665'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['663'][1].init(19, 8);
function visit303_663_1(result) {
  _$jscoverage['/underscore.js'].branchData['663'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['661'][1].init(14, 8);
function visit302_661_1(result) {
  _$jscoverage['/underscore.js'].branchData['661'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['631'][3].init(27, 14);
function visit301_631_3(result) {
  _$jscoverage['/underscore.js'].branchData['631'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['578'][1].init(12, 31);
function visit300_578_1(result) {
  _$jscoverage['/underscore.js'].branchData['578'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['550'][1].init(17, 8);
function visit299_550_1(result) {
  _$jscoverage['/underscore.js'].branchData['550'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['548'][1].init(12, 23);
function visit298_548_1(result) {
  _$jscoverage['/underscore.js'].branchData['548'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['515'][1].init(17, 7);
function visit297_515_1(result) {
  _$jscoverage['/underscore.js'].branchData['515'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['508'][1].init(12, 7);
function visit296_508_1(result) {
  _$jscoverage['/underscore.js'].branchData['508'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['506'][2].init(33, 40);
function visit295_506_2(result) {
  _$jscoverage['/underscore.js'].branchData['506'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['398'][2].init(12, 5);
function visit294_398_2(result) {
  _$jscoverage['/underscore.js'].branchData['398'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['397'][2].init(12, 5);
function visit293_397_2(result) {
  _$jscoverage['/underscore.js'].branchData['397'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['347'][2].init(12, 23);
function visit292_347_2(result) {
  _$jscoverage['/underscore.js'].branchData['347'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['339'][1].init(12, 31);
function visit291_339_1(result) {
  _$jscoverage['/underscore.js'].branchData['339'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['335'][3].init(28, 73);
function visit290_335_3(result) {
  _$jscoverage['/underscore.js'].branchData['335'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['322'][2].init(12, 23);
function visit289_322_2(result) {
  _$jscoverage['/underscore.js'].branchData['322'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['314'][1].init(12, 31);
function visit288_314_1(result) {
  _$jscoverage['/underscore.js'].branchData['314'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['310'][3].init(28, 73);
function visit287_310_3(result) {
  _$jscoverage['/underscore.js'].branchData['310'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['227'][3].init(26, 10);
function visit286_227_3(result) {
  _$jscoverage['/underscore.js'].branchData['227'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['199'][3].init(27, 14);
function visit285_199_3(result) {
  _$jscoverage['/underscore.js'].branchData['199'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['149'][4].init(55, 25);
function visit284_149_4(result) {
  _$jscoverage['/underscore.js'].branchData['149'][4].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['149'][3].init(11, 25);
function visit283_149_3(result) {
  _$jscoverage['/underscore.js'].branchData['149'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['52'][2].init(8, 48);
function visit282_52_2(result) {
  _$jscoverage['/underscore.js'].branchData['52'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['14'][3].init(13, 53);
function visit281_14_3(result) {
  _$jscoverage['/underscore.js'].branchData['14'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1616'][2].init(6, 27);
function visit280_1616_2(result) {
  _$jscoverage['/underscore.js'].branchData['1616'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1583'][2].init(11, 37);
function visit279_1583_2(result) {
  _$jscoverage['/underscore.js'].branchData['1583'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1507'][1].init(17, 11);
function visit278_1507_1(result) {
  _$jscoverage['/underscore.js'].branchData['1507'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1340'][2].init(11, 11);
function visit277_1340_2(result) {
  _$jscoverage['/underscore.js'].branchData['1340'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1324'][2].init(11, 29);
function visit276_1324_2(result) {
  _$jscoverage['/underscore.js'].branchData['1324'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1314'][2].init(11, 33);
function visit275_1314_2(result) {
  _$jscoverage['/underscore.js'].branchData['1314'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1308'][1].init(13, 33);
function visit274_1308_1(result) {
  _$jscoverage['/underscore.js'].branchData['1308'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1306'][2].init(6, 56);
function visit273_1306_2(result) {
  _$jscoverage['/underscore.js'].branchData['1306'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1285'][2].init(11, 19);
function visit272_1285_2(result) {
  _$jscoverage['/underscore.js'].branchData['1285'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1279'][1].init(11, 39);
function visit271_1279_1(result) {
  _$jscoverage['/underscore.js'].branchData['1279'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1273'][2].init(21, 18);
function visit270_1273_2(result) {
  _$jscoverage['/underscore.js'].branchData['1273'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1267'][3].init(94, 16);
function visit269_1267_3(result) {
  _$jscoverage['/underscore.js'].branchData['1267'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1267'][2].init(29, 55);
function visit268_1267_2(result) {
  _$jscoverage['/underscore.js'].branchData['1267'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1246'][1].init(13, 8);
function visit267_1246_1(result) {
  _$jscoverage['/underscore.js'].branchData['1246'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1245'][1].init(10, 27);
function visit266_1245_1(result) {
  _$jscoverage['/underscore.js'].branchData['1245'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1237'][1].init(13, 8);
function visit265_1237_1(result) {
  _$jscoverage['/underscore.js'].branchData['1237'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1235'][1].init(10, 19);
function visit264_1235_1(result) {
  _$jscoverage['/underscore.js'].branchData['1235'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1224'][1].init(10, 20);
function visit263_1224_1(result) {
  _$jscoverage['/underscore.js'].branchData['1224'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1207'][1].init(10, 219);
function visit262_1207_1(result) {
  _$jscoverage['/underscore.js'].branchData['1207'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1202'][1].init(10, 44);
function visit261_1202_1(result) {
  _$jscoverage['/underscore.js'].branchData['1202'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1191'][2].init(26, 16);
function visit260_1191_2(result) {
  _$jscoverage['/underscore.js'].branchData['1191'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1189'][2].init(30, 9);
function visit259_1189_2(result) {
  _$jscoverage['/underscore.js'].branchData['1189'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1166'][2].init(8, 40);
function visit258_1166_2(result) {
  _$jscoverage['/underscore.js'].branchData['1166'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1163'][2].init(24, 7);
function visit257_1163_2(result) {
  _$jscoverage['/underscore.js'].branchData['1163'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1161'][3].init(39, 7);
function visit256_1161_3(result) {
  _$jscoverage['/underscore.js'].branchData['1161'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1161'][2].init(8, 9);
function visit255_1161_2(result) {
  _$jscoverage['/underscore.js'].branchData['1161'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1159'][2].init(24, 26);
function visit254_1159_2(result) {
  _$jscoverage['/underscore.js'].branchData['1159'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1148'][1].init(10, 40);
function visit253_1148_1(result) {
  _$jscoverage['/underscore.js'].branchData['1148'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1105'][1].init(10, 15);
function visit252_1105_1(result) {
  _$jscoverage['/underscore.js'].branchData['1105'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1095'][1].init(10, 25);
function visit251_1095_1(result) {
  _$jscoverage['/underscore.js'].branchData['1095'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1085'][1].init(10, 15);
function visit250_1085_1(result) {
  _$jscoverage['/underscore.js'].branchData['1085'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1071'][1].init(10, 29);
function visit249_1071_1(result) {
  _$jscoverage['/underscore.js'].branchData['1071'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1049'][1].init(24, 5);
function visit248_1049_1(result) {
  _$jscoverage['/underscore.js'].branchData['1049'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1044'][2].init(10, 10);
function visit247_1044_2(result) {
  _$jscoverage['/underscore.js'].branchData['1044'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['955'][1].init(10, 67);
function visit246_955_1(result) {
  _$jscoverage['/underscore.js'].branchData['955'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['947'][2].init(16, 50);
function visit245_947_2(result) {
  _$jscoverage['/underscore.js'].branchData['947'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['867'][1].init(17, 10);
function visit244_867_1(result) {
  _$jscoverage['/underscore.js'].branchData['867'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['834'][1].init(17, 38);
function visit243_834_1(result) {
  _$jscoverage['/underscore.js'].branchData['834'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['833'][1].init(12, 8);
function visit242_833_1(result) {
  _$jscoverage['/underscore.js'].branchData['833'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['827'][1].init(12, 7);
function visit241_827_1(result) {
  _$jscoverage['/underscore.js'].branchData['827'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['826'][2].init(10, 14);
function visit240_826_2(result) {
  _$jscoverage['/underscore.js'].branchData['826'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['822'][2].init(23, 25);
function visit239_822_2(result) {
  _$jscoverage['/underscore.js'].branchData['822'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['756'][1].init(18, 28);
function visit238_756_1(result) {
  _$jscoverage['/underscore.js'].branchData['756'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['712'][2].init(8, 13);
function visit237_712_2(result) {
  _$jscoverage['/underscore.js'].branchData['712'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['696'][1].init(13, 12);
function visit236_696_1(result) {
  _$jscoverage['/underscore.js'].branchData['696'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['692'][1].init(13, 10);
function visit235_692_1(result) {
  _$jscoverage['/underscore.js'].branchData['692'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['674'][1].init(12, 19);
function visit234_674_1(result) {
  _$jscoverage['/underscore.js'].branchData['674'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['673'][3].init(43, 8);
function visit233_673_3(result) {
  _$jscoverage['/underscore.js'].branchData['673'][3].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['671'][1].init(15, 8);
function visit232_671_1(result) {
  _$jscoverage['/underscore.js'].branchData['671'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['665'][1].init(17, 28);
function visit231_665_1(result) {
  _$jscoverage['/underscore.js'].branchData['665'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['660'][1].init(12, 7);
function visit230_660_1(result) {
  _$jscoverage['/underscore.js'].branchData['660'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['650'][1].init(10, 28);
function visit229_650_1(result) {
  _$jscoverage['/underscore.js'].branchData['650'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['632'][1].init(12, 37);
function visit228_632_1(result) {
  _$jscoverage['/underscore.js'].branchData['632'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['631'][2].init(13, 10);
function visit227_631_2(result) {
  _$jscoverage['/underscore.js'].branchData['631'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['616'][1].init(10, 6);
function visit226_616_1(result) {
  _$jscoverage['/underscore.js'].branchData['616'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['597'][2].init(17, 39);
function visit225_597_2(result) {
  _$jscoverage['/underscore.js'].branchData['597'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['580'][1].init(10, 16);
function visit224_580_1(result) {
  _$jscoverage['/underscore.js'].branchData['580'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['577'][1].init(18, 14);
function visit223_577_1(result) {
  _$jscoverage['/underscore.js'].branchData['577'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['575'][1].init(10, 24);
function visit222_575_1(result) {
  _$jscoverage['/underscore.js'].branchData['575'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['547'][1].init(10, 8);
function visit221_547_1(result) {
  _$jscoverage['/underscore.js'].branchData['547'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['546'][1].init(21, 8);
function visit220_546_1(result) {
  _$jscoverage['/underscore.js'].branchData['546'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['506'][1].init(10, 64);
function visit219_506_1(result) {
  _$jscoverage['/underscore.js'].branchData['506'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['492'][2].init(29, 9);
function visit218_492_2(result) {
  _$jscoverage['/underscore.js'].branchData['492'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['484'][2].init(8, 9);
function visit217_484_2(result) {
  _$jscoverage['/underscore.js'].branchData['484'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['477'][2].init(60, 9);
function visit216_477_2(result) {
  _$jscoverage['/underscore.js'].branchData['477'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['469'][2].init(8, 9);
function visit215_469_2(result) {
  _$jscoverage['/underscore.js'].branchData['469'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['398'][1].init(12, 21);
function visit214_398_1(result) {
  _$jscoverage['/underscore.js'].branchData['398'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['397'][1].init(12, 21);
function visit213_397_1(result) {
  _$jscoverage['/underscore.js'].branchData['397'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['367'][1].init(10, 17);
function visit212_367_1(result) {
  _$jscoverage['/underscore.js'].branchData['367'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['366'][2].init(8, 9);
function visit211_366_2(result) {
  _$jscoverage['/underscore.js'].branchData['366'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['347'][1].init(12, 71);
function visit210_347_1(result) {
  _$jscoverage['/underscore.js'].branchData['347'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['337'][1].init(43, 10);
function visit209_337_1(result) {
  _$jscoverage['/underscore.js'].branchData['337'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['336'][1].init(12, 16);
function visit208_336_1(result) {
  _$jscoverage['/underscore.js'].branchData['336'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['335'][2].init(8, 16);
function visit207_335_2(result) {
  _$jscoverage['/underscore.js'].branchData['335'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['322'][1].init(12, 73);
function visit206_322_1(result) {
  _$jscoverage['/underscore.js'].branchData['322'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['312'][1].init(43, 10);
function visit205_312_1(result) {
  _$jscoverage['/underscore.js'].branchData['312'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['311'][1].init(12, 16);
function visit204_311_1(result) {
  _$jscoverage['/underscore.js'].branchData['311'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['310'][2].init(8, 16);
function visit203_310_2(result) {
  _$jscoverage['/underscore.js'].branchData['310'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['276'][2].init(8, 28);
function visit202_276_2(result) {
  _$jscoverage['/underscore.js'].branchData['276'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['267'][1].init(10, 43);
function visit201_267_1(result) {
  _$jscoverage['/underscore.js'].branchData['267'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['266'][1].init(23, 4);
function visit200_266_1(result) {
  _$jscoverage['/underscore.js'].branchData['266'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['254'][1].init(10, 44);
function visit199_254_1(result) {
  _$jscoverage['/underscore.js'].branchData['254'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['253'][1].init(23, 4);
function visit198_253_1(result) {
  _$jscoverage['/underscore.js'].branchData['253'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['227'][2].init(8, 14);
function visit197_227_2(result) {
  _$jscoverage['/underscore.js'].branchData['227'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['200'][1].init(25, 4);
function visit196_200_1(result) {
  _$jscoverage['/underscore.js'].branchData['200'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['199'][2].init(13, 10);
function visit195_199_2(result) {
  _$jscoverage['/underscore.js'].branchData['199'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['196'][1].init(19, 4);
function visit194_196_1(result) {
  _$jscoverage['/underscore.js'].branchData['196'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['181'][1].init(23, 4);
function visit193_181_1(result) {
  _$jscoverage['/underscore.js'].branchData['181'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['167'][1].init(40, 10);
function visit192_167_1(result) {
  _$jscoverage['/underscore.js'].branchData['167'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['162'][1].init(39, 10);
function visit191_162_1(result) {
  _$jscoverage['/underscore.js'].branchData['162'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['149'][2].init(11, 40);
function visit190_149_2(result) {
  _$jscoverage['/underscore.js'].branchData['149'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['52'][1].init(8, 66);
function visit189_52_1(result) {
  _$jscoverage['/underscore.js'].branchData['52'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['51'][2].init(6, 29);
function visit188_51_2(result) {
  _$jscoverage['/underscore.js'].branchData['51'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['14'][2].init(13, 132);
function visit187_14_2(result) {
  _$jscoverage['/underscore.js'].branchData['14'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1616'][1].init(6, 41);
function visit186_1616_1(result) {
  _$jscoverage['/underscore.js'].branchData['1616'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1583'][1].init(10, 59);
function visit185_1583_1(result) {
  _$jscoverage['/underscore.js'].branchData['1583'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1559'][1].init(11, 15);
function visit184_1559_1(result) {
  _$jscoverage['/underscore.js'].branchData['1559'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1538'][1].init(19, 26);
function visit183_1538_1(result) {
  _$jscoverage['/underscore.js'].branchData['1538'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1527'][1].init(28, 26);
function visit182_1527_1(result) {
  _$jscoverage['/underscore.js'].branchData['1527'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1519'][1].init(8, 18);
function visit181_1519_1(result) {
  _$jscoverage['/underscore.js'].branchData['1519'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1505'][1].init(10, 6);
function visit180_1505_1(result) {
  _$jscoverage['/underscore.js'].branchData['1505'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1495'][1].init(7, 28);
function visit179_1495_1(result) {
  _$jscoverage['/underscore.js'].branchData['1495'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1494'][1].init(7, 31);
function visit178_1494_1(result) {
  _$jscoverage['/underscore.js'].branchData['1494'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1493'][1].init(7, 26);
function visit177_1493_1(result) {
  _$jscoverage['/underscore.js'].branchData['1493'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1488'][1].init(8, 24);
function visit176_1488_1(result) {
  _$jscoverage['/underscore.js'].branchData['1488'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1450'][1].init(11, 6);
function visit175_1450_1(result) {
  _$jscoverage['/underscore.js'].branchData['1450'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1442'][1].init(11, 19);
function visit174_1442_1(result) {
  _$jscoverage['/underscore.js'].branchData['1442'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1439'][1].init(8, 16);
function visit173_1439_1(result) {
  _$jscoverage['/underscore.js'].branchData['1439'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1438'][1].init(16, 14);
function visit172_1438_1(result) {
  _$jscoverage['/underscore.js'].branchData['1438'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1429'][1].init(13, 23);
function visit171_1429_1(result) {
  _$jscoverage['/underscore.js'].branchData['1429'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1428'][1].init(15, 14);
function visit170_1428_1(result) {
  _$jscoverage['/underscore.js'].branchData['1428'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1403'][1].init(10, 61);
function visit169_1403_1(result) {
  _$jscoverage['/underscore.js'].branchData['1403'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1395'][1].init(8, 11);
function visit168_1395_1(result) {
  _$jscoverage['/underscore.js'].branchData['1395'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1389'][1].init(20, 5);
function visit167_1389_1(result) {
  _$jscoverage['/underscore.js'].branchData['1389'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1371'][1].init(11, 11);
function visit166_1371_1(result) {
  _$jscoverage['/underscore.js'].branchData['1371'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1340'][1].init(11, 44);
function visit165_1340_1(result) {
  _$jscoverage['/underscore.js'].branchData['1340'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1334'][1].init(11, 14);
function visit164_1334_1(result) {
  _$jscoverage['/underscore.js'].branchData['1334'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1329'][1].init(11, 12);
function visit163_1329_1(result) {
  _$jscoverage['/underscore.js'].branchData['1329'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1324'][1].init(11, 74);
function visit162_1324_1(result) {
  _$jscoverage['/underscore.js'].branchData['1324'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1319'][1].init(11, 29);
function visit161_1319_1(result) {
  _$jscoverage['/underscore.js'].branchData['1319'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1314'][1].init(11, 60);
function visit160_1314_1(result) {
  _$jscoverage['/underscore.js'].branchData['1314'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1306'][1].init(6, 89);
function visit159_1306_1(result) {
  _$jscoverage['/underscore.js'].branchData['1306'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1305'][1].init(17, 41);
function visit158_1305_1(result) {
  _$jscoverage['/underscore.js'].branchData['1305'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1297'][1].init(6, 25);
function visit157_1297_1(result) {
  _$jscoverage['/underscore.js'].branchData['1297'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1291'][1].init(13, 46);
function visit156_1291_1(result) {
  _$jscoverage['/underscore.js'].branchData['1291'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1285'][1].init(11, 49);
function visit155_1285_1(result) {
  _$jscoverage['/underscore.js'].branchData['1285'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1278'][1].init(14, 88);
function visit154_1278_1(result) {
  _$jscoverage['/underscore.js'].branchData['1278'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1273'][1].init(14, 25);
function visit153_1273_1(result) {
  _$jscoverage['/underscore.js'].branchData['1273'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1268'][1].init(11, 24);
function visit152_1268_1(result) {
  _$jscoverage['/underscore.js'].branchData['1268'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1267'][1].init(8, 77);
function visit151_1267_1(result) {
  _$jscoverage['/underscore.js'].branchData['1267'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1266'][1].init(8, 11);
function visit150_1266_1(result) {
  _$jscoverage['/underscore.js'].branchData['1266'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1232'][1].init(8, 9);
function visit149_1232_1(result) {
  _$jscoverage['/underscore.js'].branchData['1232'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1221'][1].init(11, 8);
function visit148_1221_1(result) {
  _$jscoverage['/underscore.js'].branchData['1221'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1219'][1].init(13, 12);
function visit147_1219_1(result) {
  _$jscoverage['/underscore.js'].branchData['1219'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1218'][1].init(13, 12);
function visit146_1218_1(result) {
  _$jscoverage['/underscore.js'].branchData['1218'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1201'][1].init(8, 10);
function visit145_1201_1(result) {
  _$jscoverage['/underscore.js'].branchData['1201'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1200'][1].init(20, 30);
function visit144_1200_1(result) {
  _$jscoverage['/underscore.js'].branchData['1200'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1197'][1].init(15, 9);
function visit143_1197_1(result) {
  _$jscoverage['/underscore.js'].branchData['1197'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1191'][1].init(15, 8);
function visit142_1191_1(result) {
  _$jscoverage['/underscore.js'].branchData['1191'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1189'][1].init(12, 9);
function visit141_1189_1(result) {
  _$jscoverage['/underscore.js'].branchData['1189'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1185'][1].init(15, 17);
function visit140_1185_1(result) {
  _$jscoverage['/underscore.js'].branchData['1185'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1177'][1].init(8, 30);
function visit139_1177_1(result) {
  _$jscoverage['/underscore.js'].branchData['1177'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1174'][1].init(8, 14);
function visit138_1174_1(result) {
  _$jscoverage['/underscore.js'].branchData['1174'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1173'][1].init(8, 14);
function visit137_1173_1(result) {
  _$jscoverage['/underscore.js'].branchData['1173'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1166'][1].init(8, 64);
function visit136_1166_1(result) {
  _$jscoverage['/underscore.js'].branchData['1166'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1163'][1].init(8, 7);
function visit135_1163_1(result) {
  _$jscoverage['/underscore.js'].branchData['1163'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1161'][1].init(8, 22);
function visit134_1161_1(result) {
  _$jscoverage['/underscore.js'].branchData['1161'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1159'][1].init(8, 7);
function visit133_1159_1(result) {
  _$jscoverage['/underscore.js'].branchData['1159'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1146'][1].init(20, 10);
function visit132_1146_1(result) {
  _$jscoverage['/underscore.js'].branchData['1146'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1144'][1].init(8, 14);
function visit131_1144_1(result) {
  _$jscoverage['/underscore.js'].branchData['1144'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1130'][1].init(11, 14);
function visit130_1130_1(result) {
  _$jscoverage['/underscore.js'].branchData['1130'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1129'][1].init(8, 16);
function visit129_1129_1(result) {
  _$jscoverage['/underscore.js'].branchData['1129'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1123'][1].init(8, 5);
function visit128_1123_1(result) {
  _$jscoverage['/underscore.js'].branchData['1123'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1103'][1].init(8, 22);
function visit127_1103_1(result) {
  _$jscoverage['/underscore.js'].branchData['1103'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1092'][1].init(42, 10);
function visit126_1092_1(result) {
  _$jscoverage['/underscore.js'].branchData['1092'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1084'][1].init(8, 22);
function visit125_1084_1(result) {
  _$jscoverage['/underscore.js'].branchData['1084'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1083'][1].init(8, 11);
function visit124_1083_1(result) {
  _$jscoverage['/underscore.js'].branchData['1083'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1069'][1].init(42, 10);
function visit123_1069_1(result) {
  _$jscoverage['/underscore.js'].branchData['1069'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1045'][1].init(26, 14);
function visit122_1045_1(result) {
  _$jscoverage['/underscore.js'].branchData['1045'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1044'][1].init(10, 25);
function visit121_1044_1(result) {
  _$jscoverage['/underscore.js'].branchData['1044'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1043'][1].init(10, 8);
function visit120_1043_1(result) {
  _$jscoverage['/underscore.js'].branchData['1043'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1034'][1].init(10, 22);
function visit119_1034_1(result) {
  _$jscoverage['/underscore.js'].branchData['1034'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1023'][1].init(42, 10);
function visit118_1023_1(result) {
  _$jscoverage['/underscore.js'].branchData['1023'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1013'][1].init(20, 10);
function visit117_1013_1(result) {
  _$jscoverage['/underscore.js'].branchData['1013'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['1001'][1].init(24, 14);
function visit116_1001_1(result) {
  _$jscoverage['/underscore.js'].branchData['1001'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['988'][1].init(20, 10);
function visit115_988_1(result) {
  _$jscoverage['/underscore.js'].branchData['988'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['979'][1].init(8, 10);
function visit114_979_1(result) {
  _$jscoverage['/underscore.js'].branchData['979'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['975'][1].init(8, 16);
function visit113_975_1(result) {
  _$jscoverage['/underscore.js'].branchData['975'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['969'][1].init(8, 10);
function visit112_969_1(result) {
  _$jscoverage['/underscore.js'].branchData['969'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['967'][1].init(29, 15);
function visit111_967_1(result) {
  _$jscoverage['/underscore.js'].branchData['967'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['965'][1].init(8, 10);
function visit110_965_1(result) {
  _$jscoverage['/underscore.js'].branchData['965'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['964'][1].init(8, 16);
function visit109_964_1(result) {
  _$jscoverage['/underscore.js'].branchData['964'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['953'][1].init(11, 12);
function visit108_953_1(result) {
  _$jscoverage['/underscore.js'].branchData['953'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['951'][1].init(8, 43);
function visit107_951_1(result) {
  _$jscoverage['/underscore.js'].branchData['951'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['947'][1].init(16, 62);
function visit106_947_1(result) {
  _$jscoverage['/underscore.js'].branchData['947'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['925'][1].init(10, 10);
function visit105_925_1(result) {
  _$jscoverage['/underscore.js'].branchData['925'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['922'][1].init(10, 11);
function visit104_922_1(result) {
  _$jscoverage['/underscore.js'].branchData['922'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['912'][1].init(10, 11);
function visit103_912_1(result) {
  _$jscoverage['/underscore.js'].branchData['912'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['904'][1].init(13, 3);
function visit102_904_1(result) {
  _$jscoverage['/underscore.js'].branchData['904'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['864'][1].init(10, 7);
function visit101_864_1(result) {
  _$jscoverage['/underscore.js'].branchData['864'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['863'][1].init(10, 7);
function visit100_863_1(result) {
  _$jscoverage['/underscore.js'].branchData['863'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['862'][1].init(20, 21);
function visit99_862_1(result) {
  _$jscoverage['/underscore.js'].branchData['862'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['858'][1].init(10, 4);
function visit98_858_1(result) {
  _$jscoverage['/underscore.js'].branchData['858'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['826'][1].init(10, 34);
function visit97_826_1(result) {
  _$jscoverage['/underscore.js'].branchData['826'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['822'][1].init(10, 38);
function visit96_822_1(result) {
  _$jscoverage['/underscore.js'].branchData['822'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['817'][1].init(10, 8);
function visit95_817_1(result) {
  _$jscoverage['/underscore.js'].branchData['817'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['814'][1].init(17, 25);
function visit94_814_1(result) {
  _$jscoverage['/underscore.js'].branchData['814'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['811'][1].init(8, 8);
function visit93_811_1(result) {
  _$jscoverage['/underscore.js'].branchData['811'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['784'][1].init(10, 22);
function visit92_784_1(result) {
  _$jscoverage['/underscore.js'].branchData['784'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['783'][1].init(26, 6);
function visit91_783_1(result) {
  _$jscoverage['/underscore.js'].branchData['783'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['773'][1].init(11, 7);
function visit90_773_1(result) {
  _$jscoverage['/underscore.js'].branchData['773'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['772'][1].init(8, 9);
function visit89_772_1(result) {
  _$jscoverage['/underscore.js'].branchData['772'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['758'][1].init(13, 27);
function visit88_758_1(result) {
  _$jscoverage['/underscore.js'].branchData['758'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['755'][1].init(22, 10);
function visit87_755_1(result) {
  _$jscoverage['/underscore.js'].branchData['755'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['739'][1].init(8, 19);
function visit86_739_1(result) {
  _$jscoverage['/underscore.js'].branchData['739'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['731'][1].init(8, 18);
function visit85_731_1(result) {
  _$jscoverage['/underscore.js'].branchData['731'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['728'][1].init(8, 38);
function visit84_728_1(result) {
  _$jscoverage['/underscore.js'].branchData['728'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['716'][1].init(11, 10);
function visit83_716_1(result) {
  _$jscoverage['/underscore.js'].branchData['716'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['712'][1].init(8, 26);
function visit82_712_1(result) {
  _$jscoverage['/underscore.js'].branchData['712'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['702'][1].init(22, 12);
function visit81_702_1(result) {
  _$jscoverage['/underscore.js'].branchData['702'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['695'][1].init(8, 5);
function visit80_695_1(result) {
  _$jscoverage['/underscore.js'].branchData['695'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['691'][1].init(8, 12);
function visit79_691_1(result) {
  _$jscoverage['/underscore.js'].branchData['691'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['673'][2].init(43, 24);
function visit78_673_2(result) {
  _$jscoverage['/underscore.js'].branchData['673'][2].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['673'][1].init(17, 7);
function visit77_673_1(result) {
  _$jscoverage['/underscore.js'].branchData['673'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['669'][1].init(10, 13);
function visit76_669_1(result) {
  _$jscoverage['/underscore.js'].branchData['669'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['659'][1].init(10, 22);
function visit75_659_1(result) {
  _$jscoverage['/underscore.js'].branchData['659'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['648'][1].init(11, 10);
function visit74_648_1(result) {
  _$jscoverage['/underscore.js'].branchData['648'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['631'][1].init(13, 28);
function visit73_631_1(result) {
  _$jscoverage['/underscore.js'].branchData['631'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['630'][1].init(18, 7);
function visit72_630_1(result) {
  _$jscoverage['/underscore.js'].branchData['630'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['615'][1].init(46, 10);
function visit71_615_1(result) {
  _$jscoverage['/underscore.js'].branchData['615'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['600'][1].init(24, 14);
function visit70_600_1(result) {
  _$jscoverage['/underscore.js'].branchData['600'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['597'][1].init(17, 44);
function visit69_597_1(result) {
  _$jscoverage['/underscore.js'].branchData['597'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['573'][1].init(47, 10);
function visit68_573_1(result) {
  _$jscoverage['/underscore.js'].branchData['573'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['544'][1].init(47, 10);
function visit67_544_1(result) {
  _$jscoverage['/underscore.js'].branchData['544'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['541'][1].init(8, 16);
function visit66_541_1(result) {
  _$jscoverage['/underscore.js'].branchData['541'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['536'][1].init(8, 22);
function visit65_536_1(result) {
  _$jscoverage['/underscore.js'].branchData['536'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['504'][1].init(47, 10);
function visit64_504_1(result) {
  _$jscoverage['/underscore.js'].branchData['504'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['502'][1].init(13, 12);
function visit63_502_1(result) {
  _$jscoverage['/underscore.js'].branchData['502'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['492'][1].init(29, 18);
function visit62_492_1(result) {
  _$jscoverage['/underscore.js'].branchData['492'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['484'][1].init(8, 18);
function visit61_484_1(result) {
  _$jscoverage['/underscore.js'].branchData['484'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['483'][1].init(8, 13);
function visit60_483_1(result) {
  _$jscoverage['/underscore.js'].branchData['483'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['477'][1].init(60, 18);
function visit59_477_1(result) {
  _$jscoverage['/underscore.js'].branchData['477'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['469'][1].init(8, 18);
function visit58_469_1(result) {
  _$jscoverage['/underscore.js'].branchData['469'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['468'][1].init(8, 13);
function visit57_468_1(result) {
  _$jscoverage['/underscore.js'].branchData['468'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['458'][1].init(11, 4);
function visit56_458_1(result) {
  _$jscoverage['/underscore.js'].branchData['458'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['452'][1].init(11, 16);
function visit55_452_1(result) {
  _$jscoverage['/underscore.js'].branchData['452'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['451'][1].init(8, 11);
function visit54_451_1(result) {
  _$jscoverage['/underscore.js'].branchData['451'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['445'][1].init(8, 16);
function visit53_445_1(result) {
  _$jscoverage['/underscore.js'].branchData['445'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['441'][1].init(8, 15);
function visit52_441_1(result) {
  _$jscoverage['/underscore.js'].branchData['441'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['440'][1].init(8, 14);
function visit51_440_1(result) {
  _$jscoverage['/underscore.js'].branchData['440'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['439'][1].init(8, 4);
function visit50_439_1(result) {
  _$jscoverage['/underscore.js'].branchData['439'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['433'][1].init(8, 18);
function visit49_433_1(result) {
  _$jscoverage['/underscore.js'].branchData['433'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['420'][1].init(8, 18);
function visit48_420_1(result) {
  _$jscoverage['/underscore.js'].branchData['420'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['407'][1].init(19, 9);
function visit47_407_1(result) {
  _$jscoverage['/underscore.js'].branchData['407'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['396'][1].init(10, 7);
function visit46_396_1(result) {
  _$jscoverage['/underscore.js'].branchData['396'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['374'][1].init(24, 9);
function visit45_374_1(result) {
  _$jscoverage['/underscore.js'].branchData['374'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['370'][1].init(17, 16);
function visit44_370_1(result) {
  _$jscoverage['/underscore.js'].branchData['370'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['366'][1].init(8, 18);
function visit43_366_1(result) {
  _$jscoverage['/underscore.js'].branchData['366'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['335'][1].init(8, 93);
function visit42_335_1(result) {
  _$jscoverage['/underscore.js'].branchData['335'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['310'][1].init(8, 93);
function visit41_310_1(result) {
  _$jscoverage['/underscore.js'].branchData['310'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['285'][1].init(13, 12);
function visit40_285_1(result) {
  _$jscoverage['/underscore.js'].branchData['285'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['284'][1].init(17, 6);
function visit39_284_1(result) {
  _$jscoverage['/underscore.js'].branchData['284'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['277'][1].init(11, 36);
function visit38_277_1(result) {
  _$jscoverage['/underscore.js'].branchData['277'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['276'][1].init(8, 37);
function visit37_276_1(result) {
  _$jscoverage['/underscore.js'].branchData['276'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['275'][1].init(8, 17);
function visit36_275_1(result) {
  _$jscoverage['/underscore.js'].branchData['275'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['265'][1].init(24, 14);
function visit35_265_1(result) {
  _$jscoverage['/underscore.js'].branchData['265'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['264'][1].init(18, 11);
function visit34_264_1(result) {
  _$jscoverage['/underscore.js'].branchData['264'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['263'][1].init(15, 32);
function visit33_263_1(result) {
  _$jscoverage['/underscore.js'].branchData['263'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['252'][1].init(24, 14);
function visit32_252_1(result) {
  _$jscoverage['/underscore.js'].branchData['252'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['251'][1].init(18, 11);
function visit31_251_1(result) {
  _$jscoverage['/underscore.js'].branchData['251'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['250'][1].init(15, 32);
function visit30_250_1(result) {
  _$jscoverage['/underscore.js'].branchData['250'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['236'][1].init(10, 29);
function visit29_236_1(result) {
  _$jscoverage['/underscore.js'].branchData['236'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['227'][1].init(8, 28);
function visit28_227_1(result) {
  _$jscoverage['/underscore.js'].branchData['227'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['222'][1].init(8, 16);
function visit27_222_1(result) {
  _$jscoverage['/underscore.js'].branchData['222'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['207'][1].init(20, 21);
function visit26_207_1(result) {
  _$jscoverage['/underscore.js'].branchData['207'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['199'][1].init(13, 28);
function visit25_199_1(result) {
  _$jscoverage['/underscore.js'].branchData['199'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['195'][1].init(10, 8);
function visit24_195_1(result) {
  _$jscoverage['/underscore.js'].branchData['195'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['194'][1].init(18, 7);
function visit23_194_1(result) {
  _$jscoverage['/underscore.js'].branchData['194'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['193'][1].init(20, 11);
function visit22_193_1(result) {
  _$jscoverage['/underscore.js'].branchData['193'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['192'][1].init(17, 32);
function visit21_192_1(result) {
  _$jscoverage['/underscore.js'].branchData['192'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['180'][1].init(24, 14);
function visit20_180_1(result) {
  _$jscoverage['/underscore.js'].branchData['180'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['178'][1].init(18, 11);
function visit19_178_1(result) {
  _$jscoverage['/underscore.js'].branchData['178'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['177'][1].init(15, 32);
function visit18_177_1(result) {
  _$jscoverage['/underscore.js'].branchData['177'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['161'][1].init(8, 16);
function visit17_161_1(result) {
  _$jscoverage['/underscore.js'].branchData['161'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['149'][1].init(11, 69);
function visit16_149_1(result) {
  _$jscoverage['/underscore.js'].branchData['149'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['137'][1].init(13, 11);
function visit15_137_1(result) {
  _$jscoverage['/underscore.js'].branchData['137'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['128'][1].init(8, 12);
function visit14_128_1(result) {
  _$jscoverage['/underscore.js'].branchData['128'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['127'][1].init(8, 22);
function visit13_127_1(result) {
  _$jscoverage['/underscore.js'].branchData['127'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['117'][1].init(22, 18);
function visit12_117_1(result) {
  _$jscoverage['/underscore.js'].branchData['117'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['108'][1].init(26, 14);
function visit11_108_1(result) {
  _$jscoverage['/underscore.js'].branchData['108'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['104'][1].init(17, 18);
function visit10_104_1(result) {
  _$jscoverage['/underscore.js'].branchData['104'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['92'][1].init(8, 17);
function visit9_92_1(result) {
  _$jscoverage['/underscore.js'].branchData['92'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['91'][1].init(8, 19);
function visit8_91_1(result) {
  _$jscoverage['/underscore.js'].branchData['91'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['90'][1].init(8, 13);
function visit7_90_1(result) {
  _$jscoverage['/underscore.js'].branchData['90'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['68'][1].init(12, 16);
function visit6_68_1(result) {
  _$jscoverage['/underscore.js'].branchData['68'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['67'][1].init(8, 18);
function visit5_67_1(result) {
  _$jscoverage['/underscore.js'].branchData['67'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['51'][1].init(6, 50);
function visit4_51_1(result) {
  _$jscoverage['/underscore.js'].branchData['51'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['42'][1].init(8, 20);
function visit3_42_1(result) {
  _$jscoverage['/underscore.js'].branchData['42'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['41'][1].init(8, 16);
function visit2_41_1(result) {
  _$jscoverage['/underscore.js'].branchData['41'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].branchData['14'][1].init(13, 152);
function visit1_14_1(result) {
  _$jscoverage['/underscore.js'].branchData['14'][1].ranCondition(result);
  return result;
}
_$jscoverage['/underscore.js'].lineData[6]++;
(function() {
  _$jscoverage['/underscore.js'].functionData[0]++;
  _$jscoverage['/underscore.js'].lineData[14]++;
  var root = visit1_14_1(visit187_14_2(visit281_14_3(visit334_14_4(visit362_14_5(typeof self == 'object') && visit373_14_6(self.self === self)) && self) || visit335_15_1(visit363_15_2(visit374_15_3(typeof global == 'object') && visit380_15_4(global.global === global)) && global)) || this);
  _$jscoverage['/underscore.js'].lineData[19]++;
  var previousUnderscore = root._;
  _$jscoverage['/underscore.js'].lineData[22]++;
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
  _$jscoverage['/underscore.js'].lineData[25]++;
  var push = ArrayProto.push, slice = ArrayProto.slice, toString = ObjProto.toString, hasOwnProperty = ObjProto.hasOwnProperty;
  _$jscoverage['/underscore.js'].lineData[32]++;
  var nativeIsArray = Array.isArray, nativeKeys = Object.keys, nativeCreate = Object.create;
  _$jscoverage['/underscore.js'].lineData[37]++;
  var Ctor = function() {
    _$jscoverage['/underscore.js'].functionData[1]++;
  };
  _$jscoverage['/underscore.js'].lineData[40]++;
  var _ = function(obj) {
    _$jscoverage['/underscore.js'].functionData[2]++;
    _$jscoverage['/underscore.js'].lineData[41]++;
    if (visit2_41_1(obj instanceof _)) {
      return obj;
    }
    _$jscoverage['/underscore.js'].lineData[42]++;
    if (visit3_42_1(!(this instanceof _))) {
      return new _(obj);
    }
    _$jscoverage['/underscore.js'].lineData[43]++;
    this._wrapped = obj;
  };
  _$jscoverage['/underscore.js'].lineData[51]++;
  if (visit4_51_1(visit188_51_2(typeof exports != 'undefined') && !exports.nodeType)) {
    _$jscoverage['/underscore.js'].lineData[52]++;
    if (visit189_52_1(visit282_52_2(visit336_52_3(typeof module != 'undefined') && !module.nodeType) && module.exports)) {
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
    if (visit5_67_1(context === void 0)) {
      return func;
    }
    _$jscoverage['/underscore.js'].lineData[68]++;
    switch(visit6_68_1(argCount == null) ? 3 : argCount) {
      case 1:
        _$jscoverage['/underscore.js'].lineData[69]++;
        return function(value) {
          _$jscoverage['/underscore.js'].functionData[4]++;
          _$jscoverage['/underscore.js'].lineData[70]++;
          return func.call(context, value);
        };
      case 3:
        _$jscoverage['/underscore.js'].lineData[74]++;
        return function(value, index, collection) {
          _$jscoverage['/underscore.js'].functionData[5]++;
          _$jscoverage['/underscore.js'].lineData[75]++;
          return func.call(context, value, index, collection);
        };
      case 4:
        _$jscoverage['/underscore.js'].lineData[77]++;
        return function(accumulator, value, index, collection) {
          _$jscoverage['/underscore.js'].functionData[6]++;
          _$jscoverage['/underscore.js'].lineData[78]++;
          return func.call(context, accumulator, value, index, collection);
        };
    }
    _$jscoverage['/underscore.js'].lineData[81]++;
    return function() {
      _$jscoverage['/underscore.js'].functionData[7]++;
      _$jscoverage['/underscore.js'].lineData[82]++;
      return func.apply(context, arguments);
    };
  };
  _$jscoverage['/underscore.js'].lineData[89]++;
  var cb = function(value, context, argCount) {
    _$jscoverage['/underscore.js'].functionData[8]++;
    _$jscoverage['/underscore.js'].lineData[90]++;
    if (visit7_90_1(value == null)) {
      return _.identity;
    }
    _$jscoverage['/underscore.js'].lineData[91]++;
    if (visit8_91_1(_.isFunction(value))) {
      return optimizeCb(value, context, argCount);
    }
    _$jscoverage['/underscore.js'].lineData[92]++;
    if (visit9_92_1(_.isObject(value))) {
      return _.matcher(value);
    }
    _$jscoverage['/underscore.js'].lineData[93]++;
    return _.property(value);
  };
  _$jscoverage['/underscore.js'].lineData[97]++;
  _.iteratee = function(value, context) {
    _$jscoverage['/underscore.js'].functionData[9]++;
    _$jscoverage['/underscore.js'].lineData[98]++;
    return cb(value, context, Infinity);
  };
  _$jscoverage['/underscore.js'].lineData[103]++;
  var restArgs = function(func, startIndex) {
    _$jscoverage['/underscore.js'].functionData[10]++;
    _$jscoverage['/underscore.js'].lineData[104]++;
    startIndex = visit10_104_1(startIndex == null) ? func.length - 1 : +startIndex;
    _$jscoverage['/underscore.js'].lineData[105]++;
    return function() {
      _$jscoverage['/underscore.js'].functionData[11]++;
      _$jscoverage['/underscore.js'].lineData[106]++;
      var length = Math.max(arguments.length - startIndex, 0);
      _$jscoverage['/underscore.js'].lineData[107]++;
      var rest = Array(length);
      _$jscoverage['/underscore.js'].lineData[108]++;
      for (var index = 0; visit11_108_1(index < length); index++) {
        _$jscoverage['/underscore.js'].lineData[109]++;
        rest[index] = arguments[index + startIndex];
      }
      _$jscoverage['/underscore.js'].lineData[111]++;
      switch(startIndex) {
        case 0:
          _$jscoverage['/underscore.js'].lineData[112]++;
          return func.call(this, rest);
        case 1:
          _$jscoverage['/underscore.js'].lineData[113]++;
          return func.call(this, arguments[0], rest);
        case 2:
          _$jscoverage['/underscore.js'].lineData[114]++;
          return func.call(this, arguments[0], arguments[1], rest);
      }
      _$jscoverage['/underscore.js'].lineData[116]++;
      var args = Array(startIndex + 1);
      _$jscoverage['/underscore.js'].lineData[117]++;
      for (index = 0; visit12_117_1(index < startIndex); index++) {
        _$jscoverage['/underscore.js'].lineData[118]++;
        args[index] = arguments[index];
      }
      _$jscoverage['/underscore.js'].lineData[120]++;
      args[startIndex] = rest;
      _$jscoverage['/underscore.js'].lineData[121]++;
      return func.apply(this, args);
    };
  };
  _$jscoverage['/underscore.js'].lineData[126]++;
  var baseCreate = function(prototype) {
    _$jscoverage['/underscore.js'].functionData[12]++;
    _$jscoverage['/underscore.js'].lineData[127]++;
    if (visit13_127_1(!_.isObject(prototype))) {
      return {};
    }
    _$jscoverage['/underscore.js'].lineData[128]++;
    if (visit14_128_1(nativeCreate)) {
      return nativeCreate(prototype);
    }
    _$jscoverage['/underscore.js'].lineData[129]++;
    Ctor.prototype = prototype;
    _$jscoverage['/underscore.js'].lineData[130]++;
    var result = new Ctor;
    _$jscoverage['/underscore.js'].lineData[131]++;
    Ctor.prototype = null;
    _$jscoverage['/underscore.js'].lineData[132]++;
    return result;
  };
  _$jscoverage['/underscore.js'].lineData[135]++;
  var property = function(key) {
    _$jscoverage['/underscore.js'].functionData[13]++;
    _$jscoverage['/underscore.js'].lineData[136]++;
    return function(obj) {
      _$jscoverage['/underscore.js'].functionData[14]++;
      _$jscoverage['/underscore.js'].lineData[137]++;
      return visit15_137_1(obj == null) ? void 0 : obj[key];
    };
  };
  _$jscoverage['/underscore.js'].lineData[145]++;
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  _$jscoverage['/underscore.js'].lineData[146]++;
  var getLength = property('length');
  _$jscoverage['/underscore.js'].lineData[147]++;
  var isArrayLike = function(collection) {
    _$jscoverage['/underscore.js'].functionData[15]++;
    _$jscoverage['/underscore.js'].lineData[148]++;
    var length = getLength(collection);
    _$jscoverage['/underscore.js'].lineData[149]++;
    return visit16_149_1(visit190_149_2(visit283_149_3(typeof length == 'number') && visit337_149_5(length >= 0)) && visit284_149_4(length <= MAX_ARRAY_INDEX));
  };
  _$jscoverage['/underscore.js'].lineData[158]++;
  _.each = _.forEach = function(obj, iteratee, context) {
    _$jscoverage['/underscore.js'].functionData[16]++;
    _$jscoverage['/underscore.js'].lineData[159]++;
    iteratee = optimizeCb(iteratee, context);
    _$jscoverage['/underscore.js'].lineData[160]++;
    var i, length;
    _$jscoverage['/underscore.js'].lineData[161]++;
    if (visit17_161_1(isArrayLike(obj))) {
      _$jscoverage['/underscore.js'].lineData[162]++;
      for (i = 0, length = obj.length; visit191_162_1(i < length); i++) {
        _$jscoverage['/underscore.js'].lineData[163]++;
        iteratee(obj[i], i, obj);
      }
    } else {
      _$jscoverage['/underscore.js'].lineData[166]++;
      var keys = _.keys(obj);
      _$jscoverage['/underscore.js'].lineData[167]++;
      for (i = 0, length = keys.length; visit192_167_1(i < length); i++) {
        _$jscoverage['/underscore.js'].lineData[168]++;
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    _$jscoverage['/underscore.js'].lineData[171]++;
    return obj;
  };
  _$jscoverage['/underscore.js'].lineData[175]++;
  _.map = _.collect = function(obj, iteratee, context) {
    _$jscoverage['/underscore.js'].functionData[17]++;
    _$jscoverage['/underscore.js'].lineData[176]++;
    iteratee = cb(iteratee, context);
    _$jscoverage['/underscore.js'].lineData[177]++;
    var keys = visit18_177_1(!isArrayLike(obj) && _.keys(obj)), length = visit19_178_1(keys || obj).length, results = Array(length);
    _$jscoverage['/underscore.js'].lineData[180]++;
    for (var index = 0; visit20_180_1(index < length); index++) {
      _$jscoverage['/underscore.js'].lineData[181]++;
      var currentKey = visit193_181_1(keys) ? keys[index] : index;
      _$jscoverage['/underscore.js'].lineData[182]++;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    _$jscoverage['/underscore.js'].lineData[184]++;
    return results;
  };
  _$jscoverage['/underscore.js'].lineData[188]++;
  var createReduce = function(dir) {
    _$jscoverage['/underscore.js'].functionData[18]++;
    _$jscoverage['/underscore.js'].lineData[191]++;
    var reducer = function(obj, iteratee, memo, initial) {
      _$jscoverage['/underscore.js'].functionData[19]++;
      _$jscoverage['/underscore.js'].lineData[192]++;
      var keys = visit21_192_1(!isArrayLike(obj) && _.keys(obj)), length = visit22_193_1(keys || obj).length, index = visit23_194_1(dir > 0) ? 0 : length - 1;
      _$jscoverage['/underscore.js'].lineData[195]++;
      if (visit24_195_1(!initial)) {
        _$jscoverage['/underscore.js'].lineData[196]++;
        memo = obj[visit194_196_1(keys) ? keys[index] : index];
        _$jscoverage['/underscore.js'].lineData[197]++;
        index += dir;
      }
      _$jscoverage['/underscore.js'].lineData[199]++;
      for (; visit25_199_1(visit195_199_2(index >= 0) && visit285_199_3(index < length)); index += dir) {
        _$jscoverage['/underscore.js'].lineData[200]++;
        var currentKey = visit196_200_1(keys) ? keys[index] : index;
        _$jscoverage['/underscore.js'].lineData[201]++;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      _$jscoverage['/underscore.js'].lineData[203]++;
      return memo;
    };
    _$jscoverage['/underscore.js'].lineData[206]++;
    return function(obj, iteratee, memo, context) {
      _$jscoverage['/underscore.js'].functionData[20]++;
      _$jscoverage['/underscore.js'].lineData[207]++;
      var initial = visit26_207_1(arguments.length >= 3);
      _$jscoverage['/underscore.js'].lineData[208]++;
      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
    };
  };
  _$jscoverage['/underscore.js'].lineData[214]++;
  _.reduce = _.foldl = _.inject = createReduce(1);
  _$jscoverage['/underscore.js'].lineData[217]++;
  _.reduceRight = _.foldr = createReduce(-1);
  _$jscoverage['/underscore.js'].lineData[220]++;
  _.find = _.detect = function(obj, predicate, context) {
    _$jscoverage['/underscore.js'].functionData[21]++;
    _$jscoverage['/underscore.js'].lineData[221]++;
    var key;
    _$jscoverage['/underscore.js'].lineData[222]++;
    if (visit27_222_1(isArrayLike(obj))) {
      _$jscoverage['/underscore.js'].lineData[223]++;
      key = _.findIndex(obj, predicate, context);
    } else {
      _$jscoverage['/underscore.js'].lineData[225]++;
      key = _.findKey(obj, predicate, context);
    }
    _$jscoverage['/underscore.js'].lineData[227]++;
    if (visit28_227_1(visit197_227_2(key !== void 0) && visit286_227_3(key !== -1))) {
      return obj[key];
    }
  };
  _$jscoverage['/underscore.js'].lineData[232]++;
  _.filter = _.select = function(obj, predicate, context) {
    _$jscoverage['/underscore.js'].functionData[22]++;
    _$jscoverage['/underscore.js'].lineData[233]++;
    var results = [];
    _$jscoverage['/underscore.js'].lineData[234]++;
    predicate = cb(predicate, context);
    _$jscoverage['/underscore.js'].lineData[235]++;
    _.each(obj, function(value, index, list) {
      _$jscoverage['/underscore.js'].functionData[23]++;
      _$jscoverage['/underscore.js'].lineData[236]++;
      if (visit29_236_1(predicate(value, index, list))) {
        results.push(value);
      }
    });
    _$jscoverage['/underscore.js'].lineData[238]++;
    return results;
  };
  _$jscoverage['/underscore.js'].lineData[242]++;
  _.reject = function(obj, predicate, context) {
    _$jscoverage['/underscore.js'].functionData[24]++;
    _$jscoverage['/underscore.js'].lineData[243]++;
    return _.filter(obj, _.negate(cb(predicate)), context);
  };
  _$jscoverage['/underscore.js'].lineData[248]++;
  _.every = _.all = function(obj, predicate, context) {
    _$jscoverage['/underscore.js'].functionData[25]++;
    _$jscoverage['/underscore.js'].lineData[249]++;
    predicate = cb(predicate, context);
    _$jscoverage['/underscore.js'].lineData[250]++;
    var keys = visit30_250_1(!isArrayLike(obj) && _.keys(obj)), length = visit31_251_1(keys || obj).length;
    _$jscoverage['/underscore.js'].lineData[252]++;
    for (var index = 0; visit32_252_1(index < length); index++) {
      _$jscoverage['/underscore.js'].lineData[253]++;
      var currentKey = visit198_253_1(keys) ? keys[index] : index;
      _$jscoverage['/underscore.js'].lineData[254]++;
      if (visit199_254_1(!predicate(obj[currentKey], currentKey, obj))) {
        return false;
      }
    }
    _$jscoverage['/underscore.js'].lineData[256]++;
    return true;
  };
  _$jscoverage['/underscore.js'].lineData[261]++;
  _.some = _.any = function(obj, predicate, context) {
    _$jscoverage['/underscore.js'].functionData[26]++;
    _$jscoverage['/underscore.js'].lineData[262]++;
    predicate = cb(predicate, context);
    _$jscoverage['/underscore.js'].lineData[263]++;
    var keys = visit33_263_1(!isArrayLike(obj) && _.keys(obj)), length = visit34_264_1(keys || obj).length;
    _$jscoverage['/underscore.js'].lineData[265]++;
    for (var index = 0; visit35_265_1(index < length); index++) {
      _$jscoverage['/underscore.js'].lineData[266]++;
      var currentKey = visit200_266_1(keys) ? keys[index] : index;
      _$jscoverage['/underscore.js'].lineData[267]++;
      if (visit201_267_1(predicate(obj[currentKey], currentKey, obj))) {
        return true;
      }
    }
    _$jscoverage['/underscore.js'].lineData[269]++;
    return false;
  };
  _$jscoverage['/underscore.js'].lineData[274]++;
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    _$jscoverage['/underscore.js'].functionData[27]++;
    _$jscoverage['/underscore.js'].lineData[275]++;
    if (visit36_275_1(!isArrayLike(obj))) {
      obj = _.values(obj);
    }
    _$jscoverage['/underscore.js'].lineData[276]++;
    if (visit37_276_1(visit202_276_2(typeof fromIndex != 'number') || guard)) {
      fromIndex = 0;
    }
    _$jscoverage['/underscore.js'].lineData[277]++;
    return visit38_277_1(_.indexOf(obj, item, fromIndex) >= 0);
  };
  _$jscoverage['/underscore.js'].lineData[281]++;
  _.invoke = restArgs(function(obj, method, args) {
    _$jscoverage['/underscore.js'].functionData[28]++;
    _$jscoverage['/underscore.js'].lineData[282]++;
    var isFunc = _.isFunction(method);
    _$jscoverage['/underscore.js'].lineData[283]++;
    return _.map(obj, function(value) {
      _$jscoverage['/underscore.js'].functionData[29]++;
      _$jscoverage['/underscore.js'].lineData[284]++;
      var func = visit39_284_1(isFunc) ? method : value[method];
      _$jscoverage['/underscore.js'].lineData[285]++;
      return visit40_285_1(func == null) ? func : func.apply(value, args);
    });
  });
  _$jscoverage['/underscore.js'].lineData[290]++;
  _.pluck = function(obj, key) {
    _$jscoverage['/underscore.js'].functionData[30]++;
    _$jscoverage['/underscore.js'].lineData[291]++;
    return _.map(obj, _.property(key));
  };
  _$jscoverage['/underscore.js'].lineData[296]++;
  _.where = function(obj, attrs) {
    _$jscoverage['/underscore.js'].functionData[31]++;
    _$jscoverage['/underscore.js'].lineData[297]++;
    return _.filter(obj, _.matcher(attrs));
  };
  _$jscoverage['/underscore.js'].lineData[302]++;
  _.findWhere = function(obj, attrs) {
    _$jscoverage['/underscore.js'].functionData[32]++;
    _$jscoverage['/underscore.js'].lineData[303]++;
    return _.find(obj, _.matcher(attrs));
  };
  _$jscoverage['/underscore.js'].lineData[307]++;
  _.max = function(obj, iteratee, context) {
    _$jscoverage['/underscore.js'].functionData[33]++;
    _$jscoverage['/underscore.js'].lineData[308]++;
    var result = -Infinity, lastComputed = -Infinity, value, computed;
    _$jscoverage['/underscore.js'].lineData[310]++;
    if (visit41_310_1(visit203_310_2(iteratee == null) || visit287_310_3(visit338_310_4(visit364_310_5(typeof iteratee == 'number') && visit375_310_7(typeof obj[0] != 'object')) && visit365_310_6(obj != null)))) {
      _$jscoverage['/underscore.js'].lineData[311]++;
      obj = visit204_311_1(isArrayLike(obj)) ? obj : _.values(obj);
      _$jscoverage['/underscore.js'].lineData[312]++;
      for (var i = 0, length = obj.length; visit205_312_1(i < length); i++) {
        _$jscoverage['/underscore.js'].lineData[313]++;
        value = obj[i];
        _$jscoverage['/underscore.js'].lineData[314]++;
        if (visit288_314_1(visit339_314_2(value != null) && visit366_314_3(value > result))) {
          _$jscoverage['/underscore.js'].lineData[315]++;
          result = value;
        }
      }
    } else {
      _$jscoverage['/underscore.js'].lineData[319]++;
      iteratee = cb(iteratee, context);
      _$jscoverage['/underscore.js'].lineData[320]++;
      _.each(obj, function(v, index, list) {
        _$jscoverage['/underscore.js'].functionData[34]++;
        _$jscoverage['/underscore.js'].lineData[321]++;
        computed = iteratee(v, index, list);
        _$jscoverage['/underscore.js'].lineData[322]++;
        if (visit206_322_1(visit289_322_2(computed > lastComputed) || visit340_322_3(visit367_322_4(computed === -Infinity) && visit376_322_5(result === -Infinity)))) {
          _$jscoverage['/underscore.js'].lineData[323]++;
          result = v;
          _$jscoverage['/underscore.js'].lineData[324]++;
          lastComputed = computed;
        }
      });
    }
    _$jscoverage['/underscore.js'].lineData[328]++;
    return result;
  };
  _$jscoverage['/underscore.js'].lineData[332]++;
  _.min = function(obj, iteratee, context) {
    _$jscoverage['/underscore.js'].functionData[35]++;
    _$jscoverage['/underscore.js'].lineData[333]++;
    var result = Infinity, lastComputed = Infinity, value, computed;
    _$jscoverage['/underscore.js'].lineData[335]++;
    if (visit42_335_1(visit207_335_2(iteratee == null) || visit290_335_3(visit341_335_4(visit368_335_5(typeof iteratee == 'number') && visit377_335_7(typeof obj[0] != 'object')) && visit369_335_6(obj != null)))) {
      _$jscoverage['/underscore.js'].lineData[336]++;
      obj = visit208_336_1(isArrayLike(obj)) ? obj : _.values(obj);
      _$jscoverage['/underscore.js'].lineData[337]++;
      for (var i = 0, length = obj.length; visit209_337_1(i < length); i++) {
        _$jscoverage['/underscore.js'].lineData[338]++;
        value = obj[i];
        _$jscoverage['/underscore.js'].lineData[339]++;
        if (visit291_339_1(visit342_339_2(value != null) && visit370_339_3(value < result))) {
          _$jscoverage['/underscore.js'].lineData[340]++;
          result = value;
        }
      }
    } else {
      _$jscoverage['/underscore.js'].lineData[344]++;
      iteratee = cb(iteratee, context);
      _$jscoverage['/underscore.js'].lineData[345]++;
      _.each(obj, function(v, index, list) {
        _$jscoverage['/underscore.js'].functionData[36]++;
        _$jscoverage['/underscore.js'].lineData[346]++;
        computed = iteratee(v, index, list);
        _$jscoverage['/underscore.js'].lineData[347]++;
        if (visit210_347_1(visit292_347_2(computed < lastComputed) || visit343_347_3(visit371_347_4(computed === Infinity) && visit378_347_5(result === Infinity)))) {
          _$jscoverage['/underscore.js'].lineData[348]++;
          result = v;
          _$jscoverage['/underscore.js'].lineData[349]++;
          lastComputed = computed;
        }
      });
    }
    _$jscoverage['/underscore.js'].lineData[353]++;
    return result;
  };
  _$jscoverage['/underscore.js'].lineData[357]++;
  _.shuffle = function(obj) {
    _$jscoverage['/underscore.js'].functionData[37]++;
    _$jscoverage['/underscore.js'].lineData[358]++;
    return _.sample(obj, Infinity);
  };
  _$jscoverage['/underscore.js'].lineData[365]++;
  _.sample = function(obj, n, guard) {
    _$jscoverage['/underscore.js'].functionData[38]++;
    _$jscoverage['/underscore.js'].lineData[366]++;
    if (visit43_366_1(visit211_366_2(n == null) || guard)) {
      _$jscoverage['/underscore.js'].lineData[367]++;
      if (visit212_367_1(!isArrayLike(obj))) {
        obj = _.values(obj);
      }
      _$jscoverage['/underscore.js'].lineData[368]++;
      return obj[_.random(obj.length - 1)];
    }
    _$jscoverage['/underscore.js'].lineData[370]++;
    var sample = visit44_370_1(isArrayLike(obj)) ? _.clone(obj) : _.values(obj);
    _$jscoverage['/underscore.js'].lineData[371]++;
    var length = getLength(sample);
    _$jscoverage['/underscore.js'].lineData[372]++;
    n = Math.max(Math.min(n, length), 0);
    _$jscoverage['/underscore.js'].lineData[373]++;
    var last = length - 1;
    _$jscoverage['/underscore.js'].lineData[374]++;
    for (var index = 0; visit45_374_1(index < n); index++) {
      _$jscoverage['/underscore.js'].lineData[375]++;
      var rand = _.random(index, last);
      _$jscoverage['/underscore.js'].lineData[376]++;
      var temp = sample[index];
      _$jscoverage['/underscore.js'].lineData[377]++;
      sample[index] = sample[rand];
      _$jscoverage['/underscore.js'].lineData[378]++;
      sample[rand] = temp;
    }
    _$jscoverage['/underscore.js'].lineData[380]++;
    return sample.slice(0, n);
  };
  _$jscoverage['/underscore.js'].lineData[384]++;
  _.sortBy = function(obj, iteratee, context) {
    _$jscoverage['/underscore.js'].functionData[39]++;
    _$jscoverage['/underscore.js'].lineData[385]++;
    var index = 0;
    _$jscoverage['/underscore.js'].lineData[386]++;
    iteratee = cb(iteratee, context);
    _$jscoverage['/underscore.js'].lineData[387]++;
    return _.pluck(_.map(obj, function(value, key, list) {
      _$jscoverage['/underscore.js'].functionData[40]++;
      _$jscoverage['/underscore.js'].lineData[388]++;
      return {value:value, index:index++, criteria:iteratee(value, key, list)};
    }).sort(function(left, right) {
      _$jscoverage['/underscore.js'].functionData[41]++;
      _$jscoverage['/underscore.js'].lineData[394]++;
      var a = left.criteria;
      _$jscoverage['/underscore.js'].lineData[395]++;
      var b = right.criteria;
      _$jscoverage['/underscore.js'].lineData[396]++;
      if (visit46_396_1(a !== b)) {
        _$jscoverage['/underscore.js'].lineData[397]++;
        if (visit213_397_1(visit293_397_2(a > b) || visit344_397_3(a === void 0))) {
          return 1;
        }
        _$jscoverage['/underscore.js'].lineData[398]++;
        if (visit214_398_1(visit294_398_2(a < b) || visit345_398_3(b === void 0))) {
          return -1;
        }
      }
      _$jscoverage['/underscore.js'].lineData[400]++;
      return left.index - right.index;
    }), 'value');
  };
  _$jscoverage['/underscore.js'].lineData[405]++;
  var group = function(behavior, partition) {
    _$jscoverage['/underscore.js'].functionData[42]++;
    _$jscoverage['/underscore.js'].lineData[406]++;
    return function(obj, iteratee, context) {
      _$jscoverage['/underscore.js'].functionData[43]++;
      _$jscoverage['/underscore.js'].lineData[407]++;
      var result = visit47_407_1(partition) ? [[], []] : {};
      _$jscoverage['/underscore.js'].lineData[408]++;
      iteratee = cb(iteratee, context);
      _$jscoverage['/underscore.js'].lineData[409]++;
      _.each(obj, function(value, index) {
        _$jscoverage['/underscore.js'].functionData[44]++;
        _$jscoverage['/underscore.js'].lineData[410]++;
        var key = iteratee(value, index, obj);
        _$jscoverage['/underscore.js'].lineData[411]++;
        behavior(result, value, key);
      });
      _$jscoverage['/underscore.js'].lineData[413]++;
      return result;
    };
  };
  _$jscoverage['/underscore.js'].lineData[419]++;
  _.groupBy = group(function(result, value, key) {
    _$jscoverage['/underscore.js'].functionData[45]++;
    _$jscoverage['/underscore.js'].lineData[420]++;
    if (visit48_420_1(_.has(result, key))) {
      result[key].push(value);
    } else {
      result[key] = [value];
    }
  });
  _$jscoverage['/underscore.js'].lineData[425]++;
  _.indexBy = group(function(result, value, key) {
    _$jscoverage['/underscore.js'].functionData[46]++;
    _$jscoverage['/underscore.js'].lineData[426]++;
    result[key] = value;
  });
  _$jscoverage['/underscore.js'].lineData[432]++;
  _.countBy = group(function(result, value, key) {
    _$jscoverage['/underscore.js'].functionData[47]++;
    _$jscoverage['/underscore.js'].lineData[433]++;
    if (visit49_433_1(_.has(result, key))) {
      result[key]++;
    } else {
      result[key] = 1;
    }
  });
  _$jscoverage['/underscore.js'].lineData[436]++;
  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  _$jscoverage['/underscore.js'].lineData[438]++;
  _.toArray = function(obj) {
    _$jscoverage['/underscore.js'].functionData[48]++;
    _$jscoverage['/underscore.js'].lineData[439]++;
    if (visit50_439_1(!obj)) {
      return [];
    }
    _$jscoverage['/underscore.js'].lineData[440]++;
    if (visit51_440_1(_.isArray(obj))) {
      return slice.call(obj);
    }
    _$jscoverage['/underscore.js'].lineData[441]++;
    if (visit52_441_1(_.isString(obj))) {
      _$jscoverage['/underscore.js'].lineData[443]++;
      return obj.match(reStrSymbol);
    }
    _$jscoverage['/underscore.js'].lineData[445]++;
    if (visit53_445_1(isArrayLike(obj))) {
      return _.map(obj, _.identity);
    }
    _$jscoverage['/underscore.js'].lineData[446]++;
    return _.values(obj);
  };
  _$jscoverage['/underscore.js'].lineData[450]++;
  _.size = function(obj) {
    _$jscoverage['/underscore.js'].functionData[49]++;
    _$jscoverage['/underscore.js'].lineData[451]++;
    if (visit54_451_1(obj == null)) {
      return 0;
    }
    _$jscoverage['/underscore.js'].lineData[452]++;
    return visit55_452_1(isArrayLike(obj)) ? obj.length : _.keys(obj).length;
  };
  _$jscoverage['/underscore.js'].lineData[457]++;
  _.partition = group(function(result, value, pass) {
    _$jscoverage['/underscore.js'].functionData[50]++;
    _$jscoverage['/underscore.js'].lineData[458]++;
    result[visit56_458_1(pass) ? 0 : 1].push(value);
  }, true);
  _$jscoverage['/underscore.js'].lineData[467]++;
  _.first = _.head = _.take = function(array, n, guard) {
    _$jscoverage['/underscore.js'].functionData[51]++;
    _$jscoverage['/underscore.js'].lineData[468]++;
    if (visit57_468_1(array == null)) {
      return void 0;
    }
    _$jscoverage['/underscore.js'].lineData[469]++;
    if (visit58_469_1(visit215_469_2(n == null) || guard)) {
      return array[0];
    }
    _$jscoverage['/underscore.js'].lineData[470]++;
    return _.initial(array, array.length - n);
  };
  _$jscoverage['/underscore.js'].lineData[476]++;
  _.initial = function(array, n, guard) {
    _$jscoverage['/underscore.js'].functionData[52]++;
    _$jscoverage['/underscore.js'].lineData[477]++;
    return slice.call(array, 0, Math.max(0, array.length - (visit59_477_1(visit216_477_2(n == null) || guard) ? 1 : n)));
  };
  _$jscoverage['/underscore.js'].lineData[482]++;
  _.last = function(array, n, guard) {
    _$jscoverage['/underscore.js'].functionData[53]++;
    _$jscoverage['/underscore.js'].lineData[483]++;
    if (visit60_483_1(array == null)) {
      return void 0;
    }
    _$jscoverage['/underscore.js'].lineData[484]++;
    if (visit61_484_1(visit217_484_2(n == null) || guard)) {
      return array[array.length - 1];
    }
    _$jscoverage['/underscore.js'].lineData[485]++;
    return _.rest(array, Math.max(0, array.length - n));
  };
  _$jscoverage['/underscore.js'].lineData[491]++;
  _.rest = _.tail = _.drop = function(array, n, guard) {
    _$jscoverage['/underscore.js'].functionData[54]++;
    _$jscoverage['/underscore.js'].lineData[492]++;
    return slice.call(array, visit62_492_1(visit218_492_2(n == null) || guard) ? 1 : n);
  };
  _$jscoverage['/underscore.js'].lineData[496]++;
  _.compact = function(array) {
    _$jscoverage['/underscore.js'].functionData[55]++;
    _$jscoverage['/underscore.js'].lineData[497]++;
    return _.filter(array, _.identity);
  };
  _$jscoverage['/underscore.js'].lineData[501]++;
  var flatten = function(input, shallow, strict, output) {
    _$jscoverage['/underscore.js'].functionData[56]++;
    _$jscoverage['/underscore.js'].lineData[502]++;
    output = visit63_502_1(output || []);
    _$jscoverage['/underscore.js'].lineData[503]++;
    var idx = output.length;
    _$jscoverage['/underscore.js'].lineData[504]++;
    for (var i = 0, length = getLength(input); visit64_504_1(i < length); i++) {
      _$jscoverage['/underscore.js'].lineData[505]++;
      var value = input[i];
      _$jscoverage['/underscore.js'].lineData[506]++;
      if (visit219_506_1(isArrayLike(value) && visit295_506_2(_.isArray(value) || _.isArguments(value)))) {
        _$jscoverage['/underscore.js'].lineData[508]++;
        if (visit296_508_1(shallow)) {
          _$jscoverage['/underscore.js'].lineData[509]++;
          var j = 0, len = value.length;
          _$jscoverage['/underscore.js'].lineData[510]++;
          while (visit346_510_1(j < len)) {
            output[idx++] = value[j++];
          }
        } else {
          _$jscoverage['/underscore.js'].lineData[512]++;
          flatten(value, shallow, strict, output);
          _$jscoverage['/underscore.js'].lineData[513]++;
          idx = output.length;
        }
      } else {
        _$jscoverage['/underscore.js'].lineData[515]++;
        if (visit297_515_1(!strict)) {
          _$jscoverage['/underscore.js'].lineData[516]++;
          output[idx++] = value;
        }
      }
    }
    _$jscoverage['/underscore.js'].lineData[519]++;
    return output;
  };
  _$jscoverage['/underscore.js'].lineData[523]++;
  _.flatten = function(array, shallow) {
    _$jscoverage['/underscore.js'].functionData[57]++;
    _$jscoverage['/underscore.js'].lineData[524]++;
    return flatten(array, shallow, false);
  };
  _$jscoverage['/underscore.js'].lineData[528]++;
  _.without = restArgs(function(array, otherArrays) {
    _$jscoverage['/underscore.js'].functionData[58]++;
    _$jscoverage['/underscore.js'].lineData[529]++;
    return _.difference(array, otherArrays);
  });
  _$jscoverage['/underscore.js'].lineData[535]++;
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    _$jscoverage['/underscore.js'].functionData[59]++;
    _$jscoverage['/underscore.js'].lineData[536]++;
    if (visit65_536_1(!_.isBoolean(isSorted))) {
      _$jscoverage['/underscore.js'].lineData[537]++;
      context = iteratee;
      _$jscoverage['/underscore.js'].lineData[538]++;
      iteratee = isSorted;
      _$jscoverage['/underscore.js'].lineData[539]++;
      isSorted = false;
    }
    _$jscoverage['/underscore.js'].lineData[541]++;
    if (visit66_541_1(iteratee != null)) {
      iteratee = cb(iteratee, context);
    }
    _$jscoverage['/underscore.js'].lineData[542]++;
    var result = [];
    _$jscoverage['/underscore.js'].lineData[543]++;
    var seen = [];
    _$jscoverage['/underscore.js'].lineData[544]++;
    for (var i = 0, length = getLength(array); visit67_544_1(i < length); i++) {
      _$jscoverage['/underscore.js'].lineData[545]++;
      var value = array[i], computed = visit220_546_1(iteratee) ? iteratee(value, i, array) : value;
      _$jscoverage['/underscore.js'].lineData[547]++;
      if (visit221_547_1(isSorted)) {
        _$jscoverage['/underscore.js'].lineData[548]++;
        if (visit298_548_1(!i || visit347_548_2(seen !== computed))) {
          result.push(value);
        }
        _$jscoverage['/underscore.js'].lineData[549]++;
        seen = computed;
      } else {
        _$jscoverage['/underscore.js'].lineData[550]++;
        if (visit299_550_1(iteratee)) {
          _$jscoverage['/underscore.js'].lineData[551]++;
          if (visit348_551_1(!_.contains(seen, computed))) {
            _$jscoverage['/underscore.js'].lineData[552]++;
            seen.push(computed);
            _$jscoverage['/underscore.js'].lineData[553]++;
            result.push(value);
          }
        } else {
          _$jscoverage['/underscore.js'].lineData[555]++;
          if (visit349_555_1(!_.contains(result, value))) {
            _$jscoverage['/underscore.js'].lineData[556]++;
            result.push(value);
          }
        }
      }
    }
    _$jscoverage['/underscore.js'].lineData[559]++;
    return result;
  };
  _$jscoverage['/underscore.js'].lineData[564]++;
  _.union = restArgs(function(arrays) {
    _$jscoverage['/underscore.js'].functionData[60]++;
    _$jscoverage['/underscore.js'].lineData[565]++;
    return _.uniq(flatten(arrays, true, true));
  });
  _$jscoverage['/underscore.js'].lineData[570]++;
  _.intersection = function(array) {
    _$jscoverage['/underscore.js'].functionData[61]++;
    _$jscoverage['/underscore.js'].lineData[571]++;
    var result = [];
    _$jscoverage['/underscore.js'].lineData[572]++;
    var argsLength = arguments.length;
    _$jscoverage['/underscore.js'].lineData[573]++;
    for (var i = 0, length = getLength(array); visit68_573_1(i < length); i++) {
      _$jscoverage['/underscore.js'].lineData[574]++;
      var item = array[i];
      _$jscoverage['/underscore.js'].lineData[575]++;
      if (visit222_575_1(_.contains(result, item))) {
        continue;
      }
      _$jscoverage['/underscore.js'].lineData[576]++;
      var j;
      _$jscoverage['/underscore.js'].lineData[577]++;
      for (j = 1; visit223_577_1(j < argsLength); j++) {
        _$jscoverage['/underscore.js'].lineData[578]++;
        if (visit300_578_1(!_.contains(arguments[j], item))) {
          break;
        }
      }
      _$jscoverage['/underscore.js'].lineData[580]++;
      if (visit224_580_1(j === argsLength)) {
        result.push(item);
      }
    }
    _$jscoverage['/underscore.js'].lineData[582]++;
    return result;
  };
  _$jscoverage['/underscore.js'].lineData[587]++;
  _.difference = restArgs(function(array, rest) {
    _$jscoverage['/underscore.js'].functionData[62]++;
    _$jscoverage['/underscore.js'].lineData[588]++;
    rest = flatten(rest, true, true);
    _$jscoverage['/underscore.js'].lineData[589]++;
    return _.filter(array, function(value) {
      _$jscoverage['/underscore.js'].functionData[63]++;
      _$jscoverage['/underscore.js'].lineData[590]++;
      return !_.contains(rest, value);
    });
  });
  _$jscoverage['/underscore.js'].lineData[596]++;
  _.unzip = function(array) {
    _$jscoverage['/underscore.js'].functionData[64]++;
    _$jscoverage['/underscore.js'].lineData[597]++;
    var length = visit69_597_1(visit225_597_2(array && _.max(array, getLength).length) || 0);
    _$jscoverage['/underscore.js'].lineData[598]++;
    var result = Array(length);
    _$jscoverage['/underscore.js'].lineData[600]++;
    for (var index = 0; visit70_600_1(index < length); index++) {
      _$jscoverage['/underscore.js'].lineData[601]++;
      result[index] = _.pluck(array, index);
    }
    _$jscoverage['/underscore.js'].lineData[603]++;
    return result;
  };
  _$jscoverage['/underscore.js'].lineData[608]++;
  _.zip = restArgs(_.unzip);
  _$jscoverage['/underscore.js'].lineData[613]++;
  _.object = function(list, values) {
    _$jscoverage['/underscore.js'].functionData[65]++;
    _$jscoverage['/underscore.js'].lineData[614]++;
    var result = {};
    _$jscoverage['/underscore.js'].lineData[615]++;
    for (var i = 0, length = getLength(list); visit71_615_1(i < length); i++) {
      _$jscoverage['/underscore.js'].lineData[616]++;
      if (visit226_616_1(values)) {
        _$jscoverage['/underscore.js'].lineData[617]++;
        result[list[i]] = values[i];
      } else {
        _$jscoverage['/underscore.js'].lineData[619]++;
        result[list[i][0]] = list[i][1];
      }
    }
    _$jscoverage['/underscore.js'].lineData[622]++;
    return result;
  };
  _$jscoverage['/underscore.js'].lineData[626]++;
  var createPredicateIndexFinder = function(dir) {
    _$jscoverage['/underscore.js'].functionData[66]++;
    _$jscoverage['/underscore.js'].lineData[627]++;
    return function(array, predicate, context) {
      _$jscoverage['/underscore.js'].functionData[67]++;
      _$jscoverage['/underscore.js'].lineData[628]++;
      predicate = cb(predicate, context);
      _$jscoverage['/underscore.js'].lineData[629]++;
      var length = getLength(array);
      _$jscoverage['/underscore.js'].lineData[630]++;
      var index = visit72_630_1(dir > 0) ? 0 : length - 1;
      _$jscoverage['/underscore.js'].lineData[631]++;
      for (; visit73_631_1(visit227_631_2(index >= 0) && visit301_631_3(index < length)); index += dir) {
        _$jscoverage['/underscore.js'].lineData[632]++;
        if (visit228_632_1(predicate(array[index], index, array))) {
          return index;
        }
      }
      _$jscoverage['/underscore.js'].lineData[634]++;
      return -1;
    };
  };
  _$jscoverage['/underscore.js'].lineData[639]++;
  _.findIndex = createPredicateIndexFinder(1);
  _$jscoverage['/underscore.js'].lineData[640]++;
  _.findLastIndex = createPredicateIndexFinder(-1);
  _$jscoverage['/underscore.js'].lineData[644]++;
  _.sortedIndex = function(array, obj, iteratee, context) {
    _$jscoverage['/underscore.js'].functionData[68]++;
    _$jscoverage['/underscore.js'].lineData[645]++;
    iteratee = cb(iteratee, context, 1);
    _$jscoverage['/underscore.js'].lineData[646]++;
    var value = iteratee(obj);
    _$jscoverage['/underscore.js'].lineData[647]++;
    var low = 0, high = getLength(array);
    _$jscoverage['/underscore.js'].lineData[648]++;
    while (visit74_648_1(low < high)) {
      _$jscoverage['/underscore.js'].lineData[649]++;
      var mid = Math.floor((low + high) / 2);
      _$jscoverage['/underscore.js'].lineData[650]++;
      if (visit229_650_1(iteratee(array[mid]) < value)) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    _$jscoverage['/underscore.js'].lineData[652]++;
    return low;
  };
  _$jscoverage['/underscore.js'].lineData[656]++;
  var createIndexFinder = function(dir, predicateFind, sortedIndex) {
    _$jscoverage['/underscore.js'].functionData[69]++;
    _$jscoverage['/underscore.js'].lineData[657]++;
    return function(array, item, idx) {
      _$jscoverage['/underscore.js'].functionData[70]++;
      _$jscoverage['/underscore.js'].lineData[658]++;
      var i = 0, length = getLength(array);
      _$jscoverage['/underscore.js'].lineData[659]++;
      if (visit75_659_1(typeof idx == 'number')) {
        _$jscoverage['/underscore.js'].lineData[660]++;
        if (visit230_660_1(dir > 0)) {
          _$jscoverage['/underscore.js'].lineData[661]++;
          i = visit302_661_1(idx >= 0) ? idx : Math.max(idx + length, i);
        } else {
          _$jscoverage['/underscore.js'].lineData[663]++;
          length = visit303_663_1(idx >= 0) ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else {
        _$jscoverage['/underscore.js'].lineData[665]++;
        if (visit231_665_1(visit304_665_2(sortedIndex && idx) && length)) {
          _$jscoverage['/underscore.js'].lineData[666]++;
          idx = sortedIndex(array, item);
          _$jscoverage['/underscore.js'].lineData[667]++;
          return visit305_667_1(array[idx] === item) ? idx : -1;
        }
      }
      _$jscoverage['/underscore.js'].lineData[669]++;
      if (visit76_669_1(item !== item)) {
        _$jscoverage['/underscore.js'].lineData[670]++;
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        _$jscoverage['/underscore.js'].lineData[671]++;
        return visit232_671_1(idx >= 0) ? idx + i : -1;
      }
      _$jscoverage['/underscore.js'].lineData[673]++;
      for (idx = visit77_673_1(dir > 0) ? i : length - 1; visit78_673_2(visit233_673_3(idx >= 0) && visit306_673_4(idx < length)); idx += dir) {
        _$jscoverage['/underscore.js'].lineData[674]++;
        if (visit234_674_1(array[idx] === item)) {
          return idx;
        }
      }
      _$jscoverage['/underscore.js'].lineData[676]++;
      return -1;
    };
  };
  _$jscoverage['/underscore.js'].lineData[684]++;
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _$jscoverage['/underscore.js'].lineData[685]++;
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);
  _$jscoverage['/underscore.js'].lineData[690]++;
  _.range = function(start, stop, step) {
    _$jscoverage['/underscore.js'].functionData[71]++;
    _$jscoverage['/underscore.js'].lineData[691]++;
    if (visit79_691_1(stop == null)) {
      _$jscoverage['/underscore.js'].lineData[692]++;
      stop = visit235_692_1(start || 0);
      _$jscoverage['/underscore.js'].lineData[693]++;
      start = 0;
    }
    _$jscoverage['/underscore.js'].lineData[695]++;
    if (visit80_695_1(!step)) {
      _$jscoverage['/underscore.js'].lineData[696]++;
      step = visit236_696_1(stop < start) ? -1 : 1;
    }
    _$jscoverage['/underscore.js'].lineData[699]++;
    var length = Math.max(Math.ceil((stop - start) / step), 0);
    _$jscoverage['/underscore.js'].lineData[700]++;
    var range = Array(length);
    _$jscoverage['/underscore.js'].lineData[702]++;
    for (var idx = 0; visit81_702_1(idx < length); idx++, start += step) {
      _$jscoverage['/underscore.js'].lineData[703]++;
      range[idx] = start;
    }
    _$jscoverage['/underscore.js'].lineData[706]++;
    return range;
  };
  _$jscoverage['/underscore.js'].lineData[711]++;
  _.chunk = function(array, count) {
    _$jscoverage['/underscore.js'].functionData[72]++;
    _$jscoverage['/underscore.js'].lineData[712]++;
    if (visit82_712_1(visit237_712_2(count == null) || visit307_712_3(count < 1))) {
      return [];
    }
    _$jscoverage['/underscore.js'].lineData[714]++;
    var result = [];
    _$jscoverage['/underscore.js'].lineData[715]++;
    var i = 0, length = array.length;
    _$jscoverage['/underscore.js'].lineData[716]++;
    while (visit83_716_1(i < length)) {
      _$jscoverage['/underscore.js'].lineData[717]++;
      result.push(slice.call(array, i, i += count));
    }
    _$jscoverage['/underscore.js'].lineData[719]++;
    return result;
  };
  _$jscoverage['/underscore.js'].lineData[727]++;
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    _$jscoverage['/underscore.js'].functionData[73]++;
    _$jscoverage['/underscore.js'].lineData[728]++;
    if (visit84_728_1(!(callingContext instanceof boundFunc))) {
      return sourceFunc.apply(context, args);
    }
    _$jscoverage['/underscore.js'].lineData[729]++;
    var self = baseCreate(sourceFunc.prototype);
    _$jscoverage['/underscore.js'].lineData[730]++;
    var result = sourceFunc.apply(self, args);
    _$jscoverage['/underscore.js'].lineData[731]++;
    if (visit85_731_1(_.isObject(result))) {
      return result;
    }
    _$jscoverage['/underscore.js'].lineData[732]++;
    return self;
  };
  _$jscoverage['/underscore.js'].lineData[738]++;
  _.bind = restArgs(function(func, context, args) {
    _$jscoverage['/underscore.js'].functionData[74]++;
    _$jscoverage['/underscore.js'].lineData[739]++;
    if (visit86_739_1(!_.isFunction(func))) {
      throw new TypeError('Bind must be called on a function');
    }
    _$jscoverage['/underscore.js'].lineData[740]++;
    var bound = restArgs(function(callArgs) {
      _$jscoverage['/underscore.js'].functionData[75]++;
      _$jscoverage['/underscore.js'].lineData[741]++;
      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
    _$jscoverage['/underscore.js'].lineData[743]++;
    return bound;
  });
  _$jscoverage['/underscore.js'].lineData[750]++;
  _.partial = restArgs(function(func, boundArgs) {
    _$jscoverage['/underscore.js'].functionData[76]++;
    _$jscoverage['/underscore.js'].lineData[751]++;
    var placeholder = _.partial.placeholder;
    _$jscoverage['/underscore.js'].lineData[752]++;
    var bound = function() {
      _$jscoverage['/underscore.js'].functionData[77]++;
      _$jscoverage['/underscore.js'].lineData[753]++;
      var position = 0, length = boundArgs.length;
      _$jscoverage['/underscore.js'].lineData[754]++;
      var args = Array(length);
      _$jscoverage['/underscore.js'].lineData[755]++;
      for (var i = 0; visit87_755_1(i < length); i++) {
        _$jscoverage['/underscore.js'].lineData[756]++;
        args[i] = visit238_756_1(boundArgs[i] === placeholder) ? arguments[position++] : boundArgs[i];
      }
      _$jscoverage['/underscore.js'].lineData[758]++;
      while (visit88_758_1(position < arguments.length)) {
        args.push(arguments[position++]);
      }
      _$jscoverage['/underscore.js'].lineData[759]++;
      return executeBound(func, bound, this, this, args);
    };
    _$jscoverage['/underscore.js'].lineData[761]++;
    return bound;
  });
  _$jscoverage['/underscore.js'].lineData[764]++;
  _.partial.placeholder = _;
  _$jscoverage['/underscore.js'].lineData[769]++;
  _.bindAll = restArgs(function(obj, keys) {
    _$jscoverage['/underscore.js'].functionData[78]++;
    _$jscoverage['/underscore.js'].lineData[770]++;
    keys = flatten(keys, false, false);
    _$jscoverage['/underscore.js'].lineData[771]++;
    var index = keys.length;
    _$jscoverage['/underscore.js'].lineData[772]++;
    if (visit89_772_1(index < 1)) {
      throw new Error('bindAll must be passed function names');
    }
    _$jscoverage['/underscore.js'].lineData[773]++;
    while (visit90_773_1(index--)) {
      _$jscoverage['/underscore.js'].lineData[774]++;
      var key = keys[index];
      _$jscoverage['/underscore.js'].lineData[775]++;
      obj[key] = _.bind(obj[key], obj);
    }
  });
  _$jscoverage['/underscore.js'].lineData[780]++;
  _.memoize = function(func, hasher) {
    _$jscoverage['/underscore.js'].functionData[79]++;
    _$jscoverage['/underscore.js'].lineData[781]++;
    var memoize = function(key) {
      _$jscoverage['/underscore.js'].functionData[80]++;
      _$jscoverage['/underscore.js'].lineData[782]++;
      var cache = memoize.cache;
      _$jscoverage['/underscore.js'].lineData[783]++;
      var address = '' + (visit91_783_1(hasher) ? hasher.apply(this, arguments) : key);
      _$jscoverage['/underscore.js'].lineData[784]++;
      if (visit92_784_1(!_.has(cache, address))) {
        cache[address] = func.apply(this, arguments);
      }
      _$jscoverage['/underscore.js'].lineData[785]++;
      return cache[address];
    };
    _$jscoverage['/underscore.js'].lineData[787]++;
    memoize.cache = {};
    _$jscoverage['/underscore.js'].lineData[788]++;
    return memoize;
  };
  _$jscoverage['/underscore.js'].lineData[793]++;
  _.delay = restArgs(function(func, wait, args) {
    _$jscoverage['/underscore.js'].functionData[81]++;
    _$jscoverage['/underscore.js'].lineData[794]++;
    return setTimeout(function() {
      _$jscoverage['/underscore.js'].functionData[82]++;
      _$jscoverage['/underscore.js'].lineData[795]++;
      return func.apply(null, args);
    }, wait);
  });
  _$jscoverage['/underscore.js'].lineData[801]++;
  _.defer = _.partial(_.delay, _, 1);
  _$jscoverage['/underscore.js'].lineData[808]++;
  _.throttle = function(func, wait, options) {
    _$jscoverage['/underscore.js'].functionData[83]++;
    _$jscoverage['/underscore.js'].lineData[809]++;
    var timeout, context, args, result;
    _$jscoverage['/underscore.js'].lineData[810]++;
    var previous = 0;
    _$jscoverage['/underscore.js'].lineData[811]++;
    if (visit93_811_1(!options)) {
      options = {};
    }
    _$jscoverage['/underscore.js'].lineData[813]++;
    var later = function() {
      _$jscoverage['/underscore.js'].functionData[84]++;
      _$jscoverage['/underscore.js'].lineData[814]++;
      previous = visit94_814_1(options.leading === false) ? 0 : _.now();
      _$jscoverage['/underscore.js'].lineData[815]++;
      timeout = null;
      _$jscoverage['/underscore.js'].lineData[816]++;
      result = func.apply(context, args);
      _$jscoverage['/underscore.js'].lineData[817]++;
      if (visit95_817_1(!timeout)) {
        context = args = null;
      }
    };
    _$jscoverage['/underscore.js'].lineData[820]++;
    var throttled = function() {
      _$jscoverage['/underscore.js'].functionData[85]++;
      _$jscoverage['/underscore.js'].lineData[821]++;
      var now = _.now();
      _$jscoverage['/underscore.js'].lineData[822]++;
      if (visit96_822_1(!previous && visit239_822_2(options.leading === false))) {
        previous = now;
      }
      _$jscoverage['/underscore.js'].lineData[823]++;
      var remaining = wait - (now - previous);
      _$jscoverage['/underscore.js'].lineData[824]++;
      context = this;
      _$jscoverage['/underscore.js'].lineData[825]++;
      args = arguments;
      _$jscoverage['/underscore.js'].lineData[826]++;
      if (visit97_826_1(visit240_826_2(remaining <= 0) || visit308_826_3(remaining > wait))) {
        _$jscoverage['/underscore.js'].lineData[827]++;
        if (visit241_827_1(timeout)) {
          _$jscoverage['/underscore.js'].lineData[828]++;
          clearTimeout(timeout);
          _$jscoverage['/underscore.js'].lineData[829]++;
          timeout = null;
        }
        _$jscoverage['/underscore.js'].lineData[831]++;
        previous = now;
        _$jscoverage['/underscore.js'].lineData[832]++;
        result = func.apply(context, args);
        _$jscoverage['/underscore.js'].lineData[833]++;
        if (visit242_833_1(!timeout)) {
          context = args = null;
        }
      } else {
        _$jscoverage['/underscore.js'].lineData[834]++;
        if (visit243_834_1(!timeout && visit309_834_2(options.trailing !== false))) {
          _$jscoverage['/underscore.js'].lineData[835]++;
          timeout = setTimeout(later, remaining);
        }
      }
      _$jscoverage['/underscore.js'].lineData[837]++;
      return result;
    };
    _$jscoverage['/underscore.js'].lineData[840]++;
    throttled.cancel = function() {
      _$jscoverage['/underscore.js'].functionData[86]++;
      _$jscoverage['/underscore.js'].lineData[841]++;
      clearTimeout(timeout);
      _$jscoverage['/underscore.js'].lineData[842]++;
      previous = 0;
      _$jscoverage['/underscore.js'].lineData[843]++;
      timeout = context = args = null;
    };
    _$jscoverage['/underscore.js'].lineData[846]++;
    return throttled;
  };
  _$jscoverage['/underscore.js'].lineData[853]++;
  _.debounce = function(func, wait, immediate) {
    _$jscoverage['/underscore.js'].functionData[87]++;
    _$jscoverage['/underscore.js'].lineData[854]++;
    var timeout, result;
    _$jscoverage['/underscore.js'].lineData[856]++;
    var later = function(context, args) {
      _$jscoverage['/underscore.js'].functionData[88]++;
      _$jscoverage['/underscore.js'].lineData[857]++;
      timeout = null;
      _$jscoverage['/underscore.js'].lineData[858]++;
      if (visit98_858_1(args)) {
        result = func.apply(context, args);
      }
    };
    _$jscoverage['/underscore.js'].lineData[861]++;
    var debounced = restArgs(function(args) {
      _$jscoverage['/underscore.js'].functionData[89]++;
      _$jscoverage['/underscore.js'].lineData[862]++;
      var callNow = visit99_862_1(immediate && !timeout);
      _$jscoverage['/underscore.js'].lineData[863]++;
      if (visit100_863_1(timeout)) {
        clearTimeout(timeout);
      }
      _$jscoverage['/underscore.js'].lineData[864]++;
      if (visit101_864_1(callNow)) {
        _$jscoverage['/underscore.js'].lineData[865]++;
        timeout = setTimeout(later, wait);
        _$jscoverage['/underscore.js'].lineData[866]++;
        result = func.apply(this, args);
      } else {
        _$jscoverage['/underscore.js'].lineData[867]++;
        if (visit244_867_1(!immediate)) {
          _$jscoverage['/underscore.js'].lineData[868]++;
          timeout = _.delay(later, wait, this, args);
        }
      }
      _$jscoverage['/underscore.js'].lineData[871]++;
      return result;
    });
    _$jscoverage['/underscore.js'].lineData[874]++;
    debounced.cancel = function() {
      _$jscoverage['/underscore.js'].functionData[90]++;
      _$jscoverage['/underscore.js'].lineData[875]++;
      clearTimeout(timeout);
      _$jscoverage['/underscore.js'].lineData[876]++;
      timeout = null;
    };
    _$jscoverage['/underscore.js'].lineData[879]++;
    return debounced;
  };
  _$jscoverage['/underscore.js'].lineData[885]++;
  _.wrap = function(func, wrapper) {
    _$jscoverage['/underscore.js'].functionData[91]++;
    _$jscoverage['/underscore.js'].lineData[886]++;
    return _.partial(wrapper, func);
  };
  _$jscoverage['/underscore.js'].lineData[890]++;
  _.negate = function(predicate) {
    _$jscoverage['/underscore.js'].functionData[92]++;
    _$jscoverage['/underscore.js'].lineData[891]++;
    return function() {
      _$jscoverage['/underscore.js'].functionData[93]++;
      _$jscoverage['/underscore.js'].lineData[892]++;
      return !predicate.apply(this, arguments);
    };
  };
  _$jscoverage['/underscore.js'].lineData[898]++;
  _.compose = function() {
    _$jscoverage['/underscore.js'].functionData[94]++;
    _$jscoverage['/underscore.js'].lineData[899]++;
    var args = arguments;
    _$jscoverage['/underscore.js'].lineData[900]++;
    var start = args.length - 1;
    _$jscoverage['/underscore.js'].lineData[901]++;
    return function() {
      _$jscoverage['/underscore.js'].functionData[95]++;
      _$jscoverage['/underscore.js'].lineData[902]++;
      var i = start;
      _$jscoverage['/underscore.js'].lineData[903]++;
      var result = args[start].apply(this, arguments);
      _$jscoverage['/underscore.js'].lineData[904]++;
      while (visit102_904_1(i--)) {
        result = args[i].call(this, result);
      }
      _$jscoverage['/underscore.js'].lineData[905]++;
      return result;
    };
  };
  _$jscoverage['/underscore.js'].lineData[910]++;
  _.after = function(times, func) {
    _$jscoverage['/underscore.js'].functionData[96]++;
    _$jscoverage['/underscore.js'].lineData[911]++;
    return function() {
      _$jscoverage['/underscore.js'].functionData[97]++;
      _$jscoverage['/underscore.js'].lineData[912]++;
      if (visit103_912_1(--times < 1)) {
        _$jscoverage['/underscore.js'].lineData[913]++;
        return func.apply(this, arguments);
      }
    };
  };
  _$jscoverage['/underscore.js'].lineData[919]++;
  _.before = function(times, func) {
    _$jscoverage['/underscore.js'].functionData[98]++;
    _$jscoverage['/underscore.js'].lineData[920]++;
    var memo;
    _$jscoverage['/underscore.js'].lineData[921]++;
    return function() {
      _$jscoverage['/underscore.js'].functionData[99]++;
      _$jscoverage['/underscore.js'].lineData[922]++;
      if (visit104_922_1(--times > 0)) {
        _$jscoverage['/underscore.js'].lineData[923]++;
        memo = func.apply(this, arguments);
      }
      _$jscoverage['/underscore.js'].lineData[925]++;
      if (visit105_925_1(times <= 1)) {
        func = null;
      }
      _$jscoverage['/underscore.js'].lineData[926]++;
      return memo;
    };
  };
  _$jscoverage['/underscore.js'].lineData[932]++;
  _.once = _.partial(_.before, 2);
  _$jscoverage['/underscore.js'].lineData[934]++;
  _.restArgs = restArgs;
  _$jscoverage['/underscore.js'].lineData[940]++;
  var hasEnumBug = !{toString:null}.propertyIsEnumerable('toString');
  _$jscoverage['/underscore.js'].lineData[941]++;
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
  _$jscoverage['/underscore.js'].lineData[944]++;
  var collectNonEnumProps = function(obj, keys) {
    _$jscoverage['/underscore.js'].functionData[100]++;
    _$jscoverage['/underscore.js'].lineData[945]++;
    var nonEnumIdx = nonEnumerableProps.length;
    _$jscoverage['/underscore.js'].lineData[946]++;
    var constructor = obj.constructor;
    _$jscoverage['/underscore.js'].lineData[947]++;
    var proto = visit106_947_1(visit245_947_2(_.isFunction(constructor) && constructor.prototype) || ObjProto);
    _$jscoverage['/underscore.js'].lineData[950]++;
    var prop = 'constructor';
    _$jscoverage['/underscore.js'].lineData[951]++;
    if (visit107_951_1(_.has(obj, prop) && !_.contains(keys, prop))) {
      keys.push(prop);
    }
    _$jscoverage['/underscore.js'].lineData[953]++;
    while (visit108_953_1(nonEnumIdx--)) {
      _$jscoverage['/underscore.js'].lineData[954]++;
      prop = nonEnumerableProps[nonEnumIdx];
      _$jscoverage['/underscore.js'].lineData[955]++;
      if (visit246_955_1(visit310_955_2(prop in obj && visit350_955_3(obj[prop] !== proto[prop])) && !_.contains(keys, prop))) {
        _$jscoverage['/underscore.js'].lineData[956]++;
        keys.push(prop);
      }
    }
  };
  _$jscoverage['/underscore.js'].lineData[963]++;
  _.keys = function(obj) {
    _$jscoverage['/underscore.js'].functionData[101]++;
    _$jscoverage['/underscore.js'].lineData[964]++;
    if (visit109_964_1(!_.isObject(obj))) {
      return [];
    }
    _$jscoverage['/underscore.js'].lineData[965]++;
    if (visit110_965_1(nativeKeys)) {
      return nativeKeys(obj);
    }
    _$jscoverage['/underscore.js'].lineData[966]++;
    var keys = [];
    _$jscoverage['/underscore.js'].lineData[967]++;
    for (var key in obj) {
      if (visit111_967_1(_.has(obj, key))) {
        keys.push(key);
      }
    }
    _$jscoverage['/underscore.js'].lineData[969]++;
    if (visit112_969_1(hasEnumBug)) {
      collectNonEnumProps(obj, keys);
    }
    _$jscoverage['/underscore.js'].lineData[970]++;
    return keys;
  };
  _$jscoverage['/underscore.js'].lineData[974]++;
  _.allKeys = function(obj) {
    _$jscoverage['/underscore.js'].functionData[102]++;
    _$jscoverage['/underscore.js'].lineData[975]++;
    if (visit113_975_1(!_.isObject(obj))) {
      return [];
    }
    _$jscoverage['/underscore.js'].lineData[976]++;
    var keys = [];
    _$jscoverage['/underscore.js'].lineData[977]++;
    for (var key in obj) {
      keys.push(key);
    }
    _$jscoverage['/underscore.js'].lineData[979]++;
    if (visit114_979_1(hasEnumBug)) {
      collectNonEnumProps(obj, keys);
    }
    _$jscoverage['/underscore.js'].lineData[980]++;
    return keys;
  };
  _$jscoverage['/underscore.js'].lineData[984]++;
  _.values = function(obj) {
    _$jscoverage['/underscore.js'].functionData[103]++;
    _$jscoverage['/underscore.js'].lineData[985]++;
    var keys = _.keys(obj);
    _$jscoverage['/underscore.js'].lineData[986]++;
    var length = keys.length;
    _$jscoverage['/underscore.js'].lineData[987]++;
    var values = Array(length);
    _$jscoverage['/underscore.js'].lineData[988]++;
    for (var i = 0; visit115_988_1(i < length); i++) {
      _$jscoverage['/underscore.js'].lineData[989]++;
      values[i] = obj[keys[i]];
    }
    _$jscoverage['/underscore.js'].lineData[991]++;
    return values;
  };
  _$jscoverage['/underscore.js'].lineData[996]++;
  _.mapObject = function(obj, iteratee, context) {
    _$jscoverage['/underscore.js'].functionData[104]++;
    _$jscoverage['/underscore.js'].lineData[997]++;
    iteratee = cb(iteratee, context);
    _$jscoverage['/underscore.js'].lineData[998]++;
    var keys = _.keys(obj), length = keys.length, results = {};
    _$jscoverage['/underscore.js'].lineData[1001]++;
    for (var index = 0; visit116_1001_1(index < length); index++) {
      _$jscoverage['/underscore.js'].lineData[1002]++;
      var currentKey = keys[index];
      _$jscoverage['/underscore.js'].lineData[1003]++;
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    _$jscoverage['/underscore.js'].lineData[1005]++;
    return results;
  };
  _$jscoverage['/underscore.js'].lineData[1009]++;
  _.pairs = function(obj) {
    _$jscoverage['/underscore.js'].functionData[105]++;
    _$jscoverage['/underscore.js'].lineData[1010]++;
    var keys = _.keys(obj);
    _$jscoverage['/underscore.js'].lineData[1011]++;
    var length = keys.length;
    _$jscoverage['/underscore.js'].lineData[1012]++;
    var pairs = Array(length);
    _$jscoverage['/underscore.js'].lineData[1013]++;
    for (var i = 0; visit117_1013_1(i < length); i++) {
      _$jscoverage['/underscore.js'].lineData[1014]++;
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    _$jscoverage['/underscore.js'].lineData[1016]++;
    return pairs;
  };
  _$jscoverage['/underscore.js'].lineData[1020]++;
  _.invert = function(obj) {
    _$jscoverage['/underscore.js'].functionData[106]++;
    _$jscoverage['/underscore.js'].lineData[1021]++;
    var result = {};
    _$jscoverage['/underscore.js'].lineData[1022]++;
    var keys = _.keys(obj);
    _$jscoverage['/underscore.js'].lineData[1023]++;
    for (var i = 0, length = keys.length; visit118_1023_1(i < length); i++) {
      _$jscoverage['/underscore.js'].lineData[1024]++;
      result[obj[keys[i]]] = keys[i];
    }
    _$jscoverage['/underscore.js'].lineData[1026]++;
    return result;
  };
  _$jscoverage['/underscore.js'].lineData[1031]++;
  _.functions = _.methods = function(obj) {
    _$jscoverage['/underscore.js'].functionData[107]++;
    _$jscoverage['/underscore.js'].lineData[1032]++;
    var names = [];
    _$jscoverage['/underscore.js'].lineData[1033]++;
    for (var key in obj) {
      _$jscoverage['/underscore.js'].lineData[1034]++;
      if (visit119_1034_1(_.isFunction(obj[key]))) {
        names.push(key);
      }
    }
    _$jscoverage['/underscore.js'].lineData[1036]++;
    return names.sort();
  };
  _$jscoverage['/underscore.js'].lineData[1040]++;
  var createAssigner = function(keysFunc, defaults) {
    _$jscoverage['/underscore.js'].functionData[108]++;
    _$jscoverage['/underscore.js'].lineData[1041]++;
    return function(obj) {
      _$jscoverage['/underscore.js'].functionData[109]++;
      _$jscoverage['/underscore.js'].lineData[1042]++;
      var length = arguments.length;
      _$jscoverage['/underscore.js'].lineData[1043]++;
      if (visit120_1043_1(defaults)) {
        obj = Object(obj);
      }
      _$jscoverage['/underscore.js'].lineData[1044]++;
      if (visit121_1044_1(visit247_1044_2(length < 2) || visit311_1044_3(obj == null))) {
        return obj;
      }
      _$jscoverage['/underscore.js'].lineData[1045]++;
      for (var index = 1; visit122_1045_1(index < length); index++) {
        _$jscoverage['/underscore.js'].lineData[1046]++;
        var source = arguments[index], keys = keysFunc(source), l = keys.length;
        _$jscoverage['/underscore.js'].lineData[1049]++;
        for (var i = 0; visit248_1049_1(i < l); i++) {
          _$jscoverage['/underscore.js'].lineData[1050]++;
          var key = keys[i];
          _$jscoverage['/underscore.js'].lineData[1051]++;
          if (visit312_1051_1(!defaults || visit351_1051_2(obj[key] === void 0))) {
            obj[key] = source[key];
          }
        }
      }
      _$jscoverage['/underscore.js'].lineData[1054]++;
      return obj;
    };
  };
  _$jscoverage['/underscore.js'].lineData[1059]++;
  _.extend = createAssigner(_.allKeys);
  _$jscoverage['/underscore.js'].lineData[1063]++;
  _.extendOwn = _.assign = createAssigner(_.keys);
  _$jscoverage['/underscore.js'].lineData[1066]++;
  _.findKey = function(obj, predicate, context) {
    _$jscoverage['/underscore.js'].functionData[110]++;
    _$jscoverage['/underscore.js'].lineData[1067]++;
    predicate = cb(predicate, context);
    _$jscoverage['/underscore.js'].lineData[1068]++;
    var keys = _.keys(obj), key;
    _$jscoverage['/underscore.js'].lineData[1069]++;
    for (var i = 0, length = keys.length; visit123_1069_1(i < length); i++) {
      _$jscoverage['/underscore.js'].lineData[1070]++;
      key = keys[i];
      _$jscoverage['/underscore.js'].lineData[1071]++;
      if (visit249_1071_1(predicate(obj[key], key, obj))) {
        return key;
      }
    }
  };
  _$jscoverage['/underscore.js'].lineData[1076]++;
  var keyInObj = function(value, key, obj) {
    _$jscoverage['/underscore.js'].functionData[111]++;
    _$jscoverage['/underscore.js'].lineData[1077]++;
    return key in obj;
  };
  _$jscoverage['/underscore.js'].lineData[1081]++;
  _.pick = restArgs(function(obj, keys) {
    _$jscoverage['/underscore.js'].functionData[112]++;
    _$jscoverage['/underscore.js'].lineData[1082]++;
    var result = {}, iteratee = keys[0];
    _$jscoverage['/underscore.js'].lineData[1083]++;
    if (visit124_1083_1(obj == null)) {
      return result;
    }
    _$jscoverage['/underscore.js'].lineData[1084]++;
    if (visit125_1084_1(_.isFunction(iteratee))) {
      _$jscoverage['/underscore.js'].lineData[1085]++;
      if (visit250_1085_1(keys.length > 1)) {
        iteratee = optimizeCb(iteratee, keys[1]);
      }
      _$jscoverage['/underscore.js'].lineData[1086]++;
      keys = _.allKeys(obj);
    } else {
      _$jscoverage['/underscore.js'].lineData[1088]++;
      iteratee = keyInObj;
      _$jscoverage['/underscore.js'].lineData[1089]++;
      keys = flatten(keys, false, false);
      _$jscoverage['/underscore.js'].lineData[1090]++;
      obj = Object(obj);
    }
    _$jscoverage['/underscore.js'].lineData[1092]++;
    for (var i = 0, length = keys.length; visit126_1092_1(i < length); i++) {
      _$jscoverage['/underscore.js'].lineData[1093]++;
      var key = keys[i];
      _$jscoverage['/underscore.js'].lineData[1094]++;
      var value = obj[key];
      _$jscoverage['/underscore.js'].lineData[1095]++;
      if (visit251_1095_1(iteratee(value, key, obj))) {
        result[key] = value;
      }
    }
    _$jscoverage['/underscore.js'].lineData[1097]++;
    return result;
  });
  _$jscoverage['/underscore.js'].lineData[1101]++;
  _.omit = restArgs(function(obj, keys) {
    _$jscoverage['/underscore.js'].functionData[113]++;
    _$jscoverage['/underscore.js'].lineData[1102]++;
    var iteratee = keys[0], context;
    _$jscoverage['/underscore.js'].lineData[1103]++;
    if (visit127_1103_1(_.isFunction(iteratee))) {
      _$jscoverage['/underscore.js'].lineData[1104]++;
      iteratee = _.negate(iteratee);
      _$jscoverage['/underscore.js'].lineData[1105]++;
      if (visit252_1105_1(keys.length > 1)) {
        context = keys[1];
      }
    } else {
      _$jscoverage['/underscore.js'].lineData[1107]++;
      keys = _.map(flatten(keys, false, false), String);
      _$jscoverage['/underscore.js'].lineData[1108]++;
      iteratee = function(value, key) {
        _$jscoverage['/underscore.js'].functionData[114]++;
        _$jscoverage['/underscore.js'].lineData[1109]++;
        return !_.contains(keys, key);
      };
    }
    _$jscoverage['/underscore.js'].lineData[1112]++;
    return _.pick(obj, iteratee, context);
  });
  _$jscoverage['/underscore.js'].lineData[1116]++;
  _.defaults = createAssigner(_.allKeys, true);
  _$jscoverage['/underscore.js'].lineData[1121]++;
  _.create = function(prototype, props) {
    _$jscoverage['/underscore.js'].functionData[115]++;
    _$jscoverage['/underscore.js'].lineData[1122]++;
    var result = baseCreate(prototype);
    _$jscoverage['/underscore.js'].lineData[1123]++;
    if (visit128_1123_1(props)) {
      _.extendOwn(result, props);
    }
    _$jscoverage['/underscore.js'].lineData[1124]++;
    return result;
  };
  _$jscoverage['/underscore.js'].lineData[1128]++;
  _.clone = function(obj) {
    _$jscoverage['/underscore.js'].functionData[116]++;
    _$jscoverage['/underscore.js'].lineData[1129]++;
    if (visit129_1129_1(!_.isObject(obj))) {
      return obj;
    }
    _$jscoverage['/underscore.js'].lineData[1130]++;
    return visit130_1130_1(_.isArray(obj)) ? obj.slice() : _.extend({}, obj);
  };
  _$jscoverage['/underscore.js'].lineData[1136]++;
  _.tap = function(obj, interceptor) {
    _$jscoverage['/underscore.js'].functionData[117]++;
    _$jscoverage['/underscore.js'].lineData[1137]++;
    interceptor(obj);
    _$jscoverage['/underscore.js'].lineData[1138]++;
    return obj;
  };
  _$jscoverage['/underscore.js'].lineData[1142]++;
  _.isMatch = function(object, attrs) {
    _$jscoverage['/underscore.js'].functionData[118]++;
    _$jscoverage['/underscore.js'].lineData[1143]++;
    var keys = _.keys(attrs), length = keys.length;
    _$jscoverage['/underscore.js'].lineData[1144]++;
    if (visit131_1144_1(object == null)) {
      return !length;
    }
    _$jscoverage['/underscore.js'].lineData[1145]++;
    var obj = Object(object);
    _$jscoverage['/underscore.js'].lineData[1146]++;
    for (var i = 0; visit132_1146_1(i < length); i++) {
      _$jscoverage['/underscore.js'].lineData[1147]++;
      var key = keys[i];
      _$jscoverage['/underscore.js'].lineData[1148]++;
      if (visit253_1148_1(visit313_1148_2(attrs[key] !== obj[key]) || !(key in obj))) {
        return false;
      }
    }
    _$jscoverage['/underscore.js'].lineData[1150]++;
    return true;
  };
  _$jscoverage['/underscore.js'].lineData[1155]++;
  var eq, deepEq;
  _$jscoverage['/underscore.js'].lineData[1156]++;
  eq = function(a, b, aStack, bStack) {
    _$jscoverage['/underscore.js'].functionData[119]++;
    _$jscoverage['/underscore.js'].lineData[1159]++;
    if (visit133_1159_1(a === b)) {
      return visit254_1159_2(visit314_1159_3(a !== 0) || visit352_1159_4(1 / a === 1 / b));
    }
    _$jscoverage['/underscore.js'].lineData[1161]++;
    if (visit134_1161_1(visit255_1161_2(a == null) || visit315_1161_4(b == null))) {
      return visit256_1161_3(a === b);
    }
    _$jscoverage['/underscore.js'].lineData[1163]++;
    if (visit135_1163_1(a !== a)) {
      return visit257_1163_2(b !== b);
    }
    _$jscoverage['/underscore.js'].lineData[1165]++;
    var type = typeof a;
    _$jscoverage['/underscore.js'].lineData[1166]++;
    if (visit136_1166_1(visit258_1166_2(visit316_1166_3(type !== 'function') && visit353_1166_5(type !== 'object')) && visit317_1166_4(typeof b != 'object'))) {
      return false;
    }
    _$jscoverage['/underscore.js'].lineData[1167]++;
    return deepEq(a, b, aStack, bStack);
  };
  _$jscoverage['/underscore.js'].lineData[1171]++;
  deepEq = function(a, b, aStack, bStack) {
    _$jscoverage['/underscore.js'].functionData[120]++;
    _$jscoverage['/underscore.js'].lineData[1173]++;
    if (visit137_1173_1(a instanceof _)) {
      a = a._wrapped;
    }
    _$jscoverage['/underscore.js'].lineData[1174]++;
    if (visit138_1174_1(b instanceof _)) {
      b = b._wrapped;
    }
    _$jscoverage['/underscore.js'].lineData[1176]++;
    var className = toString.call(a);
    _$jscoverage['/underscore.js'].lineData[1177]++;
    if (visit139_1177_1(className !== toString.call(b))) {
      return false;
    }
    _$jscoverage['/underscore.js'].lineData[1178]++;
    switch(className) {
      case '[object RegExp]':
        _$jscoverage['/underscore.js'].lineData[1180]++;
      case '[object String]':
        _$jscoverage['/underscore.js'].lineData[1185]++;
        return visit140_1185_1('' + a === '' + b);
      case '[object Number]':
        _$jscoverage['/underscore.js'].lineData[1189]++;
        if (visit141_1189_1(+a !== +a)) {
          return visit259_1189_2(+b !== +b);
        }
        _$jscoverage['/underscore.js'].lineData[1191]++;
        return visit142_1191_1(+a === 0) ? visit260_1191_2(1 / +a === 1 / b) : visit318_1191_3(+a === +b);
      case '[object Date]':
        _$jscoverage['/underscore.js'].lineData[1192]++;
      case '[object Boolean]':
        _$jscoverage['/underscore.js'].lineData[1197]++;
        return visit143_1197_1(+a === +b);
    }
    _$jscoverage['/underscore.js'].lineData[1200]++;
    var areArrays = visit144_1200_1(className === '[object Array]');
    _$jscoverage['/underscore.js'].lineData[1201]++;
    if (visit145_1201_1(!areArrays)) {
      _$jscoverage['/underscore.js'].lineData[1202]++;
      if (visit261_1202_1(visit319_1202_2(typeof a != 'object') || visit354_1202_3(typeof b != 'object'))) {
        return false;
      }
      _$jscoverage['/underscore.js'].lineData[1206]++;
      var aCtor = a.constructor, bCtor = b.constructor;
      _$jscoverage['/underscore.js'].lineData[1207]++;
      if (visit262_1207_1(visit320_1207_2(visit355_1207_3(aCtor !== bCtor) && !visit372_1207_4(visit379_1207_5(visit381_1207_6(_.isFunction(aCtor) && aCtor instanceof aCtor) && _.isFunction(bCtor)) && bCtor instanceof bCtor)) && visit356_1209_1('constructor' in a && 'constructor' in b))) {
        _$jscoverage['/underscore.js'].lineData[1210]++;
        return false;
      }
    }
    _$jscoverage['/underscore.js'].lineData[1218]++;
    aStack = visit146_1218_1(aStack || []);
    _$jscoverage['/underscore.js'].lineData[1219]++;
    bStack = visit147_1219_1(bStack || []);
    _$jscoverage['/underscore.js'].lineData[1220]++;
    var length = aStack.length;
    _$jscoverage['/underscore.js'].lineData[1221]++;
    while (visit148_1221_1(length--)) {
      _$jscoverage['/underscore.js'].lineData[1224]++;
      if (visit263_1224_1(aStack[length] === a)) {
        return visit321_1224_2(bStack[length] === b);
      }
    }
    _$jscoverage['/underscore.js'].lineData[1228]++;
    aStack.push(a);
    _$jscoverage['/underscore.js'].lineData[1229]++;
    bStack.push(b);
    _$jscoverage['/underscore.js'].lineData[1232]++;
    if (visit149_1232_1(areArrays)) {
      _$jscoverage['/underscore.js'].lineData[1234]++;
      length = a.length;
      _$jscoverage['/underscore.js'].lineData[1235]++;
      if (visit264_1235_1(length !== b.length)) {
        return false;
      }
      _$jscoverage['/underscore.js'].lineData[1237]++;
      while (visit265_1237_1(length--)) {
        _$jscoverage['/underscore.js'].lineData[1238]++;
        if (visit322_1238_1(!eq(a[length], b[length], aStack, bStack))) {
          return false;
        }
      }
    } else {
      _$jscoverage['/underscore.js'].lineData[1242]++;
      var keys = _.keys(a), key;
      _$jscoverage['/underscore.js'].lineData[1243]++;
      length = keys.length;
      _$jscoverage['/underscore.js'].lineData[1245]++;
      if (visit266_1245_1(_.keys(b).length !== length)) {
        return false;
      }
      _$jscoverage['/underscore.js'].lineData[1246]++;
      while (visit267_1246_1(length--)) {
        _$jscoverage['/underscore.js'].lineData[1248]++;
        key = keys[length];
        _$jscoverage['/underscore.js'].lineData[1249]++;
        if (visit323_1249_1(!visit357_1249_2(_.has(b, key) && eq(a[key], b[key], aStack, bStack)))) {
          return false;
        }
      }
    }
    _$jscoverage['/underscore.js'].lineData[1253]++;
    aStack.pop();
    _$jscoverage['/underscore.js'].lineData[1254]++;
    bStack.pop();
    _$jscoverage['/underscore.js'].lineData[1255]++;
    return true;
  };
  _$jscoverage['/underscore.js'].lineData[1259]++;
  _.isEqual = function(a, b) {
    _$jscoverage['/underscore.js'].functionData[121]++;
    _$jscoverage['/underscore.js'].lineData[1260]++;
    return eq(a, b);
  };
  _$jscoverage['/underscore.js'].lineData[1265]++;
  _.isEmpty = function(obj) {
    _$jscoverage['/underscore.js'].functionData[122]++;
    _$jscoverage['/underscore.js'].lineData[1266]++;
    if (visit150_1266_1(obj == null)) {
      return true;
    }
    _$jscoverage['/underscore.js'].lineData[1267]++;
    if (visit151_1267_1(isArrayLike(obj) && visit268_1267_2(visit324_1267_4(_.isArray(obj) || _.isString(obj)) || _.isArguments(obj)))) {
      return visit269_1267_3(obj.length === 0);
    }
    _$jscoverage['/underscore.js'].lineData[1268]++;
    return visit152_1268_1(_.keys(obj).length === 0);
  };
  _$jscoverage['/underscore.js'].lineData[1272]++;
  _.isElement = function(obj) {
    _$jscoverage['/underscore.js'].functionData[123]++;
    _$jscoverage['/underscore.js'].lineData[1273]++;
    return !!visit153_1273_1(obj && visit270_1273_2(obj.nodeType === 1));
  };
  _$jscoverage['/underscore.js'].lineData[1278]++;
  _.isArray = visit154_1278_1(nativeIsArray || function(obj) {
    _$jscoverage['/underscore.js'].functionData[124]++;
    _$jscoverage['/underscore.js'].lineData[1279]++;
    return visit271_1279_1(toString.call(obj) === '[object Array]');
  });
  _$jscoverage['/underscore.js'].lineData[1283]++;
  _.isObject = function(obj) {
    _$jscoverage['/underscore.js'].functionData[125]++;
    _$jscoverage['/underscore.js'].lineData[1284]++;
    var type = typeof obj;
    _$jscoverage['/underscore.js'].lineData[1285]++;
    return visit155_1285_1(visit272_1285_2(type === 'function') || visit325_1285_3(visit358_1285_4(type === 'object') && !!obj));
  };
  _$jscoverage['/underscore.js'].lineData[1289]++;
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol'], function(name) {
    _$jscoverage['/underscore.js'].functionData[126]++;
    _$jscoverage['/underscore.js'].lineData[1290]++;
    _['is' + name] = function(obj) {
      _$jscoverage['/underscore.js'].functionData[127]++;
      _$jscoverage['/underscore.js'].lineData[1291]++;
      return visit156_1291_1(toString.call(obj) === '[object ' + name + ']');
    };
  });
  _$jscoverage['/underscore.js'].lineData[1297]++;
  if (visit157_1297_1(!_.isArguments(arguments))) {
    _$jscoverage['/underscore.js'].lineData[1298]++;
    _.isArguments = function(obj) {
      _$jscoverage['/underscore.js'].functionData[128]++;
      _$jscoverage['/underscore.js'].lineData[1299]++;
      return _.has(obj, 'callee');
    };
  }
  _$jscoverage['/underscore.js'].lineData[1305]++;
  var nodelist = visit158_1305_1(root.document && root.document.childNodes);
  _$jscoverage['/underscore.js'].lineData[1306]++;
  if (visit159_1306_1(visit273_1306_2(visit326_1306_3(typeof/./ != 'function') && visit359_1306_5(typeof Int8Array != 'object')) && visit327_1306_4(typeof nodelist != 'function'))) {
    _$jscoverage['/underscore.js'].lineData[1307]++;
    _.isFunction = function(obj) {
      _$jscoverage['/underscore.js'].functionData[129]++;
      _$jscoverage['/underscore.js'].lineData[1308]++;
      return visit274_1308_1(visit328_1308_2(typeof obj == 'function') || false);
    };
  }
  _$jscoverage['/underscore.js'].lineData[1313]++;
  _.isFinite = function(obj) {
    _$jscoverage['/underscore.js'].functionData[130]++;
    _$jscoverage['/underscore.js'].lineData[1314]++;
    return visit160_1314_1(visit275_1314_2(!_.isSymbol(obj) && isFinite(obj)) && !isNaN(parseFloat(obj)));
  };
  _$jscoverage['/underscore.js'].lineData[1318]++;
  _.isNaN = function(obj) {
    _$jscoverage['/underscore.js'].functionData[131]++;
    _$jscoverage['/underscore.js'].lineData[1319]++;
    return visit161_1319_1(_.isNumber(obj) && isNaN(obj));
  };
  _$jscoverage['/underscore.js'].lineData[1323]++;
  _.isBoolean = function(obj) {
    _$jscoverage['/underscore.js'].functionData[132]++;
    _$jscoverage['/underscore.js'].lineData[1324]++;
    return visit162_1324_1(visit276_1324_2(visit329_1324_3(obj === true) || visit360_1324_5(obj === false)) || visit330_1324_4(toString.call(obj) === '[object Boolean]'));
  };
  _$jscoverage['/underscore.js'].lineData[1328]++;
  _.isNull = function(obj) {
    _$jscoverage['/underscore.js'].functionData[133]++;
    _$jscoverage['/underscore.js'].lineData[1329]++;
    return visit163_1329_1(obj === null);
  };
  _$jscoverage['/underscore.js'].lineData[1333]++;
  _.isUndefined = function(obj) {
    _$jscoverage['/underscore.js'].functionData[134]++;
    _$jscoverage['/underscore.js'].lineData[1334]++;
    return visit164_1334_1(obj === void 0);
  };
  _$jscoverage['/underscore.js'].lineData[1339]++;
  _.has = function(obj, key) {
    _$jscoverage['/underscore.js'].functionData[135]++;
    _$jscoverage['/underscore.js'].lineData[1340]++;
    return visit165_1340_1(visit277_1340_2(obj != null) && hasOwnProperty.call(obj, key));
  };
  _$jscoverage['/underscore.js'].lineData[1348]++;
  _.noConflict = function() {
    _$jscoverage['/underscore.js'].functionData[136]++;
    _$jscoverage['/underscore.js'].lineData[1349]++;
    root._ = previousUnderscore;
    _$jscoverage['/underscore.js'].lineData[1350]++;
    return this;
  };
  _$jscoverage['/underscore.js'].lineData[1354]++;
  _.identity = function(value) {
    _$jscoverage['/underscore.js'].functionData[137]++;
    _$jscoverage['/underscore.js'].lineData[1355]++;
    return value;
  };
  _$jscoverage['/underscore.js'].lineData[1359]++;
  _.constant = function(value) {
    _$jscoverage['/underscore.js'].functionData[138]++;
    _$jscoverage['/underscore.js'].lineData[1360]++;
    return function() {
      _$jscoverage['/underscore.js'].functionData[139]++;
      _$jscoverage['/underscore.js'].lineData[1361]++;
      return value;
    };
  };
  _$jscoverage['/underscore.js'].lineData[1365]++;
  _.noop = function() {
    _$jscoverage['/underscore.js'].functionData[140]++;
  };
  _$jscoverage['/underscore.js'].lineData[1367]++;
  _.property = property;
  _$jscoverage['/underscore.js'].lineData[1370]++;
  _.propertyOf = function(obj) {
    _$jscoverage['/underscore.js'].functionData[141]++;
    _$jscoverage['/underscore.js'].lineData[1371]++;
    return visit166_1371_1(obj == null) ? function() {
      _$jscoverage['/underscore.js'].functionData[142]++;
    } : function(key) {
      _$jscoverage['/underscore.js'].functionData[143]++;
      _$jscoverage['/underscore.js'].lineData[1372]++;
      return obj[key];
    };
  };
  _$jscoverage['/underscore.js'].lineData[1378]++;
  _.matcher = _.matches = function(attrs) {
    _$jscoverage['/underscore.js'].functionData[144]++;
    _$jscoverage['/underscore.js'].lineData[1379]++;
    attrs = _.extendOwn({}, attrs);
    _$jscoverage['/underscore.js'].lineData[1380]++;
    return function(obj) {
      _$jscoverage['/underscore.js'].functionData[145]++;
      _$jscoverage['/underscore.js'].lineData[1381]++;
      return _.isMatch(obj, attrs);
    };
  };
  _$jscoverage['/underscore.js'].lineData[1386]++;
  _.times = function(n, iteratee, context) {
    _$jscoverage['/underscore.js'].functionData[146]++;
    _$jscoverage['/underscore.js'].lineData[1387]++;
    var accum = Array(Math.max(0, n));
    _$jscoverage['/underscore.js'].lineData[1388]++;
    iteratee = optimizeCb(iteratee, context, 1);
    _$jscoverage['/underscore.js'].lineData[1389]++;
    for (var i = 0; visit167_1389_1(i < n); i++) {
      accum[i] = iteratee(i);
    }
    _$jscoverage['/underscore.js'].lineData[1390]++;
    return accum;
  };
  _$jscoverage['/underscore.js'].lineData[1394]++;
  _.random = function(min, max) {
    _$jscoverage['/underscore.js'].functionData[147]++;
    _$jscoverage['/underscore.js'].lineData[1395]++;
    if (visit168_1395_1(max == null)) {
      _$jscoverage['/underscore.js'].lineData[1396]++;
      max = min;
      _$jscoverage['/underscore.js'].lineData[1397]++;
      min = 0;
    }
    _$jscoverage['/underscore.js'].lineData[1399]++;
    return min + Math.floor(Math.random() * (max - min + 1));
  };
  _$jscoverage['/underscore.js'].lineData[1403]++;
  _.now = visit169_1403_1(Date.now || function() {
    _$jscoverage['/underscore.js'].functionData[148]++;
    _$jscoverage['/underscore.js'].lineData[1404]++;
    return (new Date).getTime();
  });
  _$jscoverage['/underscore.js'].lineData[1408]++;
  var escapeMap = {'\x26':'\x26amp;', '\x3c':'\x26lt;', '\x3e':'\x26gt;', '"':'\x26quot;', "'":'\x26#x27;', '`':'\x26#x60;'};
  _$jscoverage['/underscore.js'].lineData[1416]++;
  var unescapeMap = _.invert(escapeMap);
  _$jscoverage['/underscore.js'].lineData[1419]++;
  var createEscaper = function(map) {
    _$jscoverage['/underscore.js'].functionData[149]++;
    _$jscoverage['/underscore.js'].lineData[1420]++;
    var escaper = function(match) {
      _$jscoverage['/underscore.js'].functionData[150]++;
      _$jscoverage['/underscore.js'].lineData[1421]++;
      return map[match];
    };
    _$jscoverage['/underscore.js'].lineData[1424]++;
    var source = '(?:' + _.keys(map).join('|') + ')';
    _$jscoverage['/underscore.js'].lineData[1425]++;
    var testRegexp = RegExp(source);
    _$jscoverage['/underscore.js'].lineData[1426]++;
    var replaceRegexp = RegExp(source, 'g');
    _$jscoverage['/underscore.js'].lineData[1427]++;
    return function(string) {
      _$jscoverage['/underscore.js'].functionData[151]++;
      _$jscoverage['/underscore.js'].lineData[1428]++;
      string = visit170_1428_1(string == null) ? '' : '' + string;
      _$jscoverage['/underscore.js'].lineData[1429]++;
      return visit171_1429_1(testRegexp.test(string)) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _$jscoverage['/underscore.js'].lineData[1432]++;
  _.escape = createEscaper(escapeMap);
  _$jscoverage['/underscore.js'].lineData[1433]++;
  _.unescape = createEscaper(unescapeMap);
  _$jscoverage['/underscore.js'].lineData[1437]++;
  _.result = function(object, prop, fallback) {
    _$jscoverage['/underscore.js'].functionData[152]++;
    _$jscoverage['/underscore.js'].lineData[1438]++;
    var value = visit172_1438_1(object == null) ? void 0 : object[prop];
    _$jscoverage['/underscore.js'].lineData[1439]++;
    if (visit173_1439_1(value === void 0)) {
      _$jscoverage['/underscore.js'].lineData[1440]++;
      value = fallback;
    }
    _$jscoverage['/underscore.js'].lineData[1442]++;
    return visit174_1442_1(_.isFunction(value)) ? value.call(object) : value;
  };
  _$jscoverage['/underscore.js'].lineData[1447]++;
  var idCounter = 0;
  _$jscoverage['/underscore.js'].lineData[1448]++;
  _.uniqueId = function(prefix) {
    _$jscoverage['/underscore.js'].functionData[153]++;
    _$jscoverage['/underscore.js'].lineData[1449]++;
    var id = ++idCounter + '';
    _$jscoverage['/underscore.js'].lineData[1450]++;
    return visit175_1450_1(prefix) ? prefix + id : id;
  };
  _$jscoverage['/underscore.js'].lineData[1455]++;
  _.templateSettings = {evaluate:/<%([\s\S]+?)%>/g, interpolate:/<%=([\s\S]+?)%>/g, escape:/<%-([\s\S]+?)%>/g};
  _$jscoverage['/underscore.js'].lineData[1464]++;
  var noMatch = /(.)^/;
  _$jscoverage['/underscore.js'].lineData[1468]++;
  var escapes = {"'":"'", '\\':'\\', '\r':'r', '\n':'n', '\u2028':'u2028', '\u2029':'u2029'};
  _$jscoverage['/underscore.js'].lineData[1477]++;
  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;
  _$jscoverage['/underscore.js'].lineData[1479]++;
  var escapeChar = function(match) {
    _$jscoverage['/underscore.js'].functionData[154]++;
    _$jscoverage['/underscore.js'].lineData[1480]++;
    return '\\' + escapes[match];
  };
  _$jscoverage['/underscore.js'].lineData[1487]++;
  _.template = function(text, settings, oldSettings) {
    _$jscoverage['/underscore.js'].functionData[155]++;
    _$jscoverage['/underscore.js'].lineData[1488]++;
    if (visit176_1488_1(!settings && oldSettings)) {
      settings = oldSettings;
    }
    _$jscoverage['/underscore.js'].lineData[1489]++;
    settings = _.defaults({}, settings, _.templateSettings);
    _$jscoverage['/underscore.js'].lineData[1492]++;
    var matcher = RegExp([visit177_1493_1(settings.escape || noMatch).source, visit178_1494_1(settings.interpolate || noMatch).source, visit179_1495_1(settings.evaluate || noMatch).source].join('|') + '|$', 'g');
    _$jscoverage['/underscore.js'].lineData[1499]++;
    var index = 0;
    _$jscoverage['/underscore.js'].lineData[1500]++;
    var source = "__p+\x3d'";
    _$jscoverage['/underscore.js'].lineData[1501]++;
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      _$jscoverage['/underscore.js'].functionData[156]++;
      _$jscoverage['/underscore.js'].lineData[1502]++;
      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      _$jscoverage['/underscore.js'].lineData[1503]++;
      index = offset + match.length;
      _$jscoverage['/underscore.js'].lineData[1505]++;
      if (visit180_1505_1(escape)) {
        _$jscoverage['/underscore.js'].lineData[1506]++;
        source += "'+\n((__t\x3d(" + escape + "))\x3d\x3dnull?'':_.escape(__t))+\n'";
      } else {
        _$jscoverage['/underscore.js'].lineData[1507]++;
        if (visit278_1507_1(interpolate)) {
          _$jscoverage['/underscore.js'].lineData[1508]++;
          source += "'+\n((__t\x3d(" + interpolate + "))\x3d\x3dnull?'':__t)+\n'";
        } else {
          _$jscoverage['/underscore.js'].lineData[1509]++;
          if (visit331_1509_1(evaluate)) {
            _$jscoverage['/underscore.js'].lineData[1510]++;
            source += "';\n" + evaluate + "\n__p+\x3d'";
          }
        }
      }
      _$jscoverage['/underscore.js'].lineData[1514]++;
      return match;
    });
    _$jscoverage['/underscore.js'].lineData[1516]++;
    source += "';\n";
    _$jscoverage['/underscore.js'].lineData[1519]++;
    if (visit181_1519_1(!settings.variable)) {
      source = 'with(obj||{}){\n' + source + '}\n';
    }
    _$jscoverage['/underscore.js'].lineData[1521]++;
    source = "var __t,__p\x3d'',__j\x3dArray.prototype.join," + "print\x3dfunction(){__p+\x3d__j.call(arguments,'');};\n" + source + 'return __p;\n';
    _$jscoverage['/underscore.js'].lineData[1525]++;
    var render;
    _$jscoverage['/underscore.js'].lineData[1526]++;
    try {
      _$jscoverage['/underscore.js'].lineData[1527]++;
      render = new Function(visit182_1527_1(settings.variable || 'obj'), '_', source);
    } catch (e) {
      _$jscoverage['/underscore.js'].lineData[1529]++;
      e.source = source;
      _$jscoverage['/underscore.js'].lineData[1530]++;
      throw e;
    }
    _$jscoverage['/underscore.js'].lineData[1533]++;
    var template = function(data) {
      _$jscoverage['/underscore.js'].functionData[157]++;
      _$jscoverage['/underscore.js'].lineData[1534]++;
      return render.call(this, data, _);
    };
    _$jscoverage['/underscore.js'].lineData[1538]++;
    var argument = visit183_1538_1(settings.variable || 'obj');
    _$jscoverage['/underscore.js'].lineData[1539]++;
    template.source = 'function(' + argument + '){\n' + source + '}';
    _$jscoverage['/underscore.js'].lineData[1541]++;
    return template;
  };
  _$jscoverage['/underscore.js'].lineData[1545]++;
  _.chain = function(obj) {
    _$jscoverage['/underscore.js'].functionData[158]++;
    _$jscoverage['/underscore.js'].lineData[1546]++;
    var instance = _(obj);
    _$jscoverage['/underscore.js'].lineData[1547]++;
    instance._chain = true;
    _$jscoverage['/underscore.js'].lineData[1548]++;
    return instance;
  };
  _$jscoverage['/underscore.js'].lineData[1558]++;
  var chainResult = function(instance, obj) {
    _$jscoverage['/underscore.js'].functionData[159]++;
    _$jscoverage['/underscore.js'].lineData[1559]++;
    return visit184_1559_1(instance._chain) ? _(obj).chain() : obj;
  };
  _$jscoverage['/underscore.js'].lineData[1563]++;
  _.mixin = function(obj) {
    _$jscoverage['/underscore.js'].functionData[160]++;
    _$jscoverage['/underscore.js'].lineData[1564]++;
    _.each(_.functions(obj), function(name) {
      _$jscoverage['/underscore.js'].functionData[161]++;
      _$jscoverage['/underscore.js'].lineData[1565]++;
      var func = _[name] = obj[name];
      _$jscoverage['/underscore.js'].lineData[1566]++;
      _.prototype[name] = function() {
        _$jscoverage['/underscore.js'].functionData[162]++;
        _$jscoverage['/underscore.js'].lineData[1567]++;
        var args = [this._wrapped];
        _$jscoverage['/underscore.js'].lineData[1568]++;
        push.apply(args, arguments);
        _$jscoverage['/underscore.js'].lineData[1569]++;
        return chainResult(this, func.apply(_, args));
      };
    });
  };
  _$jscoverage['/underscore.js'].lineData[1575]++;
  _.mixin(_);
  _$jscoverage['/underscore.js'].lineData[1578]++;
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    _$jscoverage['/underscore.js'].functionData[163]++;
    _$jscoverage['/underscore.js'].lineData[1579]++;
    var method = ArrayProto[name];
    _$jscoverage['/underscore.js'].lineData[1580]++;
    _.prototype[name] = function() {
      _$jscoverage['/underscore.js'].functionData[164]++;
      _$jscoverage['/underscore.js'].lineData[1581]++;
      var obj = this._wrapped;
      _$jscoverage['/underscore.js'].lineData[1582]++;
      method.apply(obj, arguments);
      _$jscoverage['/underscore.js'].lineData[1583]++;
      if (visit185_1583_1(visit279_1583_2(visit332_1583_3(name === 'shift') || visit361_1583_5(name === 'splice')) && visit333_1583_4(obj.length === 0))) {
        delete obj[0];
      }
      _$jscoverage['/underscore.js'].lineData[1584]++;
      return chainResult(this, obj);
    };
  });
  _$jscoverage['/underscore.js'].lineData[1589]++;
  _.each(['concat', 'join', 'slice'], function(name) {
    _$jscoverage['/underscore.js'].functionData[165]++;
    _$jscoverage['/underscore.js'].lineData[1590]++;
    var method = ArrayProto[name];
    _$jscoverage['/underscore.js'].lineData[1591]++;
    _.prototype[name] = function() {
      _$jscoverage['/underscore.js'].functionData[166]++;
      _$jscoverage['/underscore.js'].lineData[1592]++;
      return chainResult(this, method.apply(this._wrapped, arguments));
    };
  });
  _$jscoverage['/underscore.js'].lineData[1597]++;
  _.prototype.value = function() {
    _$jscoverage['/underscore.js'].functionData[167]++;
    _$jscoverage['/underscore.js'].lineData[1598]++;
    return this._wrapped;
  };
  _$jscoverage['/underscore.js'].lineData[1603]++;
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
  _$jscoverage['/underscore.js'].lineData[1605]++;
  _.prototype.toString = function() {
    _$jscoverage['/underscore.js'].functionData[168]++;
    _$jscoverage['/underscore.js'].lineData[1606]++;
    return '' + this._wrapped;
  };
  _$jscoverage['/underscore.js'].lineData[1616]++;
  if (visit186_1616_1(visit280_1616_2(typeof define == 'function') && define.amd)) {
    _$jscoverage['/underscore.js'].lineData[1617]++;
    define('underscore', [], function() {
      _$jscoverage['/underscore.js'].functionData[169]++;
      _$jscoverage['/underscore.js'].lineData[1618]++;
      return _;
    });
  }
})();
