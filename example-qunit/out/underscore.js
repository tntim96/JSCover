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
  _$jscoverage['/underscore.js'].lineData[95] = 0;
  _$jscoverage['/underscore.js'].lineData[96] = 0;
  _$jscoverage['/underscore.js'].lineData[101] = 0;
  _$jscoverage['/underscore.js'].lineData[102] = 0;
  _$jscoverage['/underscore.js'].lineData[103] = 0;
  _$jscoverage['/underscore.js'].lineData[104] = 0;
  _$jscoverage['/underscore.js'].lineData[105] = 0;
  _$jscoverage['/underscore.js'].lineData[106] = 0;
  _$jscoverage['/underscore.js'].lineData[107] = 0;
  _$jscoverage['/underscore.js'].lineData[109] = 0;
  _$jscoverage['/underscore.js'].lineData[110] = 0;
  _$jscoverage['/underscore.js'].lineData[111] = 0;
  _$jscoverage['/underscore.js'].lineData[112] = 0;
  _$jscoverage['/underscore.js'].lineData[114] = 0;
  _$jscoverage['/underscore.js'].lineData[115] = 0;
  _$jscoverage['/underscore.js'].lineData[116] = 0;
  _$jscoverage['/underscore.js'].lineData[118] = 0;
  _$jscoverage['/underscore.js'].lineData[119] = 0;
  _$jscoverage['/underscore.js'].lineData[124] = 0;
  _$jscoverage['/underscore.js'].lineData[125] = 0;
  _$jscoverage['/underscore.js'].lineData[126] = 0;
  _$jscoverage['/underscore.js'].lineData[127] = 0;
  _$jscoverage['/underscore.js'].lineData[128] = 0;
  _$jscoverage['/underscore.js'].lineData[129] = 0;
  _$jscoverage['/underscore.js'].lineData[130] = 0;
  _$jscoverage['/underscore.js'].lineData[133] = 0;
  _$jscoverage['/underscore.js'].lineData[134] = 0;
  _$jscoverage['/underscore.js'].lineData[135] = 0;
  _$jscoverage['/underscore.js'].lineData[143] = 0;
  _$jscoverage['/underscore.js'].lineData[144] = 0;
  _$jscoverage['/underscore.js'].lineData[145] = 0;
  _$jscoverage['/underscore.js'].lineData[146] = 0;
  _$jscoverage['/underscore.js'].lineData[147] = 0;
  _$jscoverage['/underscore.js'].lineData[156] = 0;
  _$jscoverage['/underscore.js'].lineData[157] = 0;
  _$jscoverage['/underscore.js'].lineData[158] = 0;
  _$jscoverage['/underscore.js'].lineData[159] = 0;
  _$jscoverage['/underscore.js'].lineData[160] = 0;
  _$jscoverage['/underscore.js'].lineData[161] = 0;
  _$jscoverage['/underscore.js'].lineData[164] = 0;
  _$jscoverage['/underscore.js'].lineData[165] = 0;
  _$jscoverage['/underscore.js'].lineData[166] = 0;
  _$jscoverage['/underscore.js'].lineData[169] = 0;
  _$jscoverage['/underscore.js'].lineData[173] = 0;
  _$jscoverage['/underscore.js'].lineData[174] = 0;
  _$jscoverage['/underscore.js'].lineData[175] = 0;
  _$jscoverage['/underscore.js'].lineData[178] = 0;
  _$jscoverage['/underscore.js'].lineData[179] = 0;
  _$jscoverage['/underscore.js'].lineData[180] = 0;
  _$jscoverage['/underscore.js'].lineData[182] = 0;
  _$jscoverage['/underscore.js'].lineData[186] = 0;
  _$jscoverage['/underscore.js'].lineData[189] = 0;
  _$jscoverage['/underscore.js'].lineData[190] = 0;
  _$jscoverage['/underscore.js'].lineData[193] = 0;
  _$jscoverage['/underscore.js'].lineData[194] = 0;
  _$jscoverage['/underscore.js'].lineData[195] = 0;
  _$jscoverage['/underscore.js'].lineData[197] = 0;
  _$jscoverage['/underscore.js'].lineData[198] = 0;
  _$jscoverage['/underscore.js'].lineData[199] = 0;
  _$jscoverage['/underscore.js'].lineData[201] = 0;
  _$jscoverage['/underscore.js'].lineData[204] = 0;
  _$jscoverage['/underscore.js'].lineData[205] = 0;
  _$jscoverage['/underscore.js'].lineData[206] = 0;
  _$jscoverage['/underscore.js'].lineData[212] = 0;
  _$jscoverage['/underscore.js'].lineData[215] = 0;
  _$jscoverage['/underscore.js'].lineData[218] = 0;
  _$jscoverage['/underscore.js'].lineData[219] = 0;
  _$jscoverage['/underscore.js'].lineData[220] = 0;
  _$jscoverage['/underscore.js'].lineData[221] = 0;
  _$jscoverage['/underscore.js'].lineData[223] = 0;
  _$jscoverage['/underscore.js'].lineData[225] = 0;
  _$jscoverage['/underscore.js'].lineData[230] = 0;
  _$jscoverage['/underscore.js'].lineData[231] = 0;
  _$jscoverage['/underscore.js'].lineData[232] = 0;
  _$jscoverage['/underscore.js'].lineData[233] = 0;
  _$jscoverage['/underscore.js'].lineData[234] = 0;
  _$jscoverage['/underscore.js'].lineData[236] = 0;
  _$jscoverage['/underscore.js'].lineData[240] = 0;
  _$jscoverage['/underscore.js'].lineData[241] = 0;
  _$jscoverage['/underscore.js'].lineData[246] = 0;
  _$jscoverage['/underscore.js'].lineData[247] = 0;
  _$jscoverage['/underscore.js'].lineData[248] = 0;
  _$jscoverage['/underscore.js'].lineData[250] = 0;
  _$jscoverage['/underscore.js'].lineData[251] = 0;
  _$jscoverage['/underscore.js'].lineData[252] = 0;
  _$jscoverage['/underscore.js'].lineData[254] = 0;
  _$jscoverage['/underscore.js'].lineData[259] = 0;
  _$jscoverage['/underscore.js'].lineData[260] = 0;
  _$jscoverage['/underscore.js'].lineData[261] = 0;
  _$jscoverage['/underscore.js'].lineData[263] = 0;
  _$jscoverage['/underscore.js'].lineData[264] = 0;
  _$jscoverage['/underscore.js'].lineData[265] = 0;
  _$jscoverage['/underscore.js'].lineData[267] = 0;
  _$jscoverage['/underscore.js'].lineData[272] = 0;
  _$jscoverage['/underscore.js'].lineData[273] = 0;
  _$jscoverage['/underscore.js'].lineData[274] = 0;
  _$jscoverage['/underscore.js'].lineData[275] = 0;
  _$jscoverage['/underscore.js'].lineData[279] = 0;
  _$jscoverage['/underscore.js'].lineData[280] = 0;
  _$jscoverage['/underscore.js'].lineData[281] = 0;
  _$jscoverage['/underscore.js'].lineData[282] = 0;
  _$jscoverage['/underscore.js'].lineData[283] = 0;
  _$jscoverage['/underscore.js'].lineData[288] = 0;
  _$jscoverage['/underscore.js'].lineData[289] = 0;
  _$jscoverage['/underscore.js'].lineData[294] = 0;
  _$jscoverage['/underscore.js'].lineData[295] = 0;
  _$jscoverage['/underscore.js'].lineData[300] = 0;
  _$jscoverage['/underscore.js'].lineData[301] = 0;
  _$jscoverage['/underscore.js'].lineData[305] = 0;
  _$jscoverage['/underscore.js'].lineData[306] = 0;
  _$jscoverage['/underscore.js'].lineData[308] = 0;
  _$jscoverage['/underscore.js'].lineData[309] = 0;
  _$jscoverage['/underscore.js'].lineData[310] = 0;
  _$jscoverage['/underscore.js'].lineData[311] = 0;
  _$jscoverage['/underscore.js'].lineData[312] = 0;
  _$jscoverage['/underscore.js'].lineData[313] = 0;
  _$jscoverage['/underscore.js'].lineData[317] = 0;
  _$jscoverage['/underscore.js'].lineData[318] = 0;
  _$jscoverage['/underscore.js'].lineData[319] = 0;
  _$jscoverage['/underscore.js'].lineData[320] = 0;
  _$jscoverage['/underscore.js'].lineData[321] = 0;
  _$jscoverage['/underscore.js'].lineData[322] = 0;
  _$jscoverage['/underscore.js'].lineData[326] = 0;
  _$jscoverage['/underscore.js'].lineData[330] = 0;
  _$jscoverage['/underscore.js'].lineData[331] = 0;
  _$jscoverage['/underscore.js'].lineData[333] = 0;
  _$jscoverage['/underscore.js'].lineData[334] = 0;
  _$jscoverage['/underscore.js'].lineData[335] = 0;
  _$jscoverage['/underscore.js'].lineData[336] = 0;
  _$jscoverage['/underscore.js'].lineData[337] = 0;
  _$jscoverage['/underscore.js'].lineData[338] = 0;
  _$jscoverage['/underscore.js'].lineData[342] = 0;
  _$jscoverage['/underscore.js'].lineData[343] = 0;
  _$jscoverage['/underscore.js'].lineData[344] = 0;
  _$jscoverage['/underscore.js'].lineData[345] = 0;
  _$jscoverage['/underscore.js'].lineData[346] = 0;
  _$jscoverage['/underscore.js'].lineData[347] = 0;
  _$jscoverage['/underscore.js'].lineData[351] = 0;
  _$jscoverage['/underscore.js'].lineData[355] = 0;
  _$jscoverage['/underscore.js'].lineData[356] = 0;
  _$jscoverage['/underscore.js'].lineData[363] = 0;
  _$jscoverage['/underscore.js'].lineData[364] = 0;
  _$jscoverage['/underscore.js'].lineData[365] = 0;
  _$jscoverage['/underscore.js'].lineData[366] = 0;
  _$jscoverage['/underscore.js'].lineData[368] = 0;
  _$jscoverage['/underscore.js'].lineData[369] = 0;
  _$jscoverage['/underscore.js'].lineData[370] = 0;
  _$jscoverage['/underscore.js'].lineData[371] = 0;
  _$jscoverage['/underscore.js'].lineData[372] = 0;
  _$jscoverage['/underscore.js'].lineData[373] = 0;
  _$jscoverage['/underscore.js'].lineData[374] = 0;
  _$jscoverage['/underscore.js'].lineData[375] = 0;
  _$jscoverage['/underscore.js'].lineData[376] = 0;
  _$jscoverage['/underscore.js'].lineData[378] = 0;
  _$jscoverage['/underscore.js'].lineData[382] = 0;
  _$jscoverage['/underscore.js'].lineData[383] = 0;
  _$jscoverage['/underscore.js'].lineData[384] = 0;
  _$jscoverage['/underscore.js'].lineData[385] = 0;
  _$jscoverage['/underscore.js'].lineData[391] = 0;
  _$jscoverage['/underscore.js'].lineData[392] = 0;
  _$jscoverage['/underscore.js'].lineData[393] = 0;
  _$jscoverage['/underscore.js'].lineData[394] = 0;
  _$jscoverage['/underscore.js'].lineData[395] = 0;
  _$jscoverage['/underscore.js'].lineData[397] = 0;
  _$jscoverage['/underscore.js'].lineData[402] = 0;
  _$jscoverage['/underscore.js'].lineData[403] = 0;
  _$jscoverage['/underscore.js'].lineData[404] = 0;
  _$jscoverage['/underscore.js'].lineData[405] = 0;
  _$jscoverage['/underscore.js'].lineData[406] = 0;
  _$jscoverage['/underscore.js'].lineData[407] = 0;
  _$jscoverage['/underscore.js'].lineData[408] = 0;
  _$jscoverage['/underscore.js'].lineData[410] = 0;
  _$jscoverage['/underscore.js'].lineData[416] = 0;
  _$jscoverage['/underscore.js'].lineData[417] = 0;
  _$jscoverage['/underscore.js'].lineData[422] = 0;
  _$jscoverage['/underscore.js'].lineData[423] = 0;
  _$jscoverage['/underscore.js'].lineData[429] = 0;
  _$jscoverage['/underscore.js'].lineData[430] = 0;
  _$jscoverage['/underscore.js'].lineData[434] = 0;
  _$jscoverage['/underscore.js'].lineData[435] = 0;
  _$jscoverage['/underscore.js'].lineData[436] = 0;
  _$jscoverage['/underscore.js'].lineData[437] = 0;
  _$jscoverage['/underscore.js'].lineData[438] = 0;
  _$jscoverage['/underscore.js'].lineData[442] = 0;
  _$jscoverage['/underscore.js'].lineData[443] = 0;
  _$jscoverage['/underscore.js'].lineData[444] = 0;
  _$jscoverage['/underscore.js'].lineData[449] = 0;
  _$jscoverage['/underscore.js'].lineData[450] = 0;
  _$jscoverage['/underscore.js'].lineData[459] = 0;
  _$jscoverage['/underscore.js'].lineData[460] = 0;
  _$jscoverage['/underscore.js'].lineData[461] = 0;
  _$jscoverage['/underscore.js'].lineData[462] = 0;
  _$jscoverage['/underscore.js'].lineData[468] = 0;
  _$jscoverage['/underscore.js'].lineData[469] = 0;
  _$jscoverage['/underscore.js'].lineData[474] = 0;
  _$jscoverage['/underscore.js'].lineData[475] = 0;
  _$jscoverage['/underscore.js'].lineData[476] = 0;
  _$jscoverage['/underscore.js'].lineData[477] = 0;
  _$jscoverage['/underscore.js'].lineData[483] = 0;
  _$jscoverage['/underscore.js'].lineData[484] = 0;
  _$jscoverage['/underscore.js'].lineData[488] = 0;
  _$jscoverage['/underscore.js'].lineData[489] = 0;
  _$jscoverage['/underscore.js'].lineData[493] = 0;
  _$jscoverage['/underscore.js'].lineData[494] = 0;
  _$jscoverage['/underscore.js'].lineData[495] = 0;
  _$jscoverage['/underscore.js'].lineData[496] = 0;
  _$jscoverage['/underscore.js'].lineData[497] = 0;
  _$jscoverage['/underscore.js'].lineData[498] = 0;
  _$jscoverage['/underscore.js'].lineData[500] = 0;
  _$jscoverage['/underscore.js'].lineData[501] = 0;
  _$jscoverage['/underscore.js'].lineData[502] = 0;
  _$jscoverage['/underscore.js'].lineData[504] = 0;
  _$jscoverage['/underscore.js'].lineData[505] = 0;
  _$jscoverage['/underscore.js'].lineData[507] = 0;
  _$jscoverage['/underscore.js'].lineData[508] = 0;
  _$jscoverage['/underscore.js'].lineData[511] = 0;
  _$jscoverage['/underscore.js'].lineData[515] = 0;
  _$jscoverage['/underscore.js'].lineData[516] = 0;
  _$jscoverage['/underscore.js'].lineData[520] = 0;
  _$jscoverage['/underscore.js'].lineData[521] = 0;
  _$jscoverage['/underscore.js'].lineData[527] = 0;
  _$jscoverage['/underscore.js'].lineData[528] = 0;
  _$jscoverage['/underscore.js'].lineData[529] = 0;
  _$jscoverage['/underscore.js'].lineData[530] = 0;
  _$jscoverage['/underscore.js'].lineData[531] = 0;
  _$jscoverage['/underscore.js'].lineData[533] = 0;
  _$jscoverage['/underscore.js'].lineData[534] = 0;
  _$jscoverage['/underscore.js'].lineData[535] = 0;
  _$jscoverage['/underscore.js'].lineData[536] = 0;
  _$jscoverage['/underscore.js'].lineData[537] = 0;
  _$jscoverage['/underscore.js'].lineData[539] = 0;
  _$jscoverage['/underscore.js'].lineData[540] = 0;
  _$jscoverage['/underscore.js'].lineData[541] = 0;
  _$jscoverage['/underscore.js'].lineData[542] = 0;
  _$jscoverage['/underscore.js'].lineData[543] = 0;
  _$jscoverage['/underscore.js'].lineData[544] = 0;
  _$jscoverage['/underscore.js'].lineData[545] = 0;
  _$jscoverage['/underscore.js'].lineData[547] = 0;
  _$jscoverage['/underscore.js'].lineData[548] = 0;
  _$jscoverage['/underscore.js'].lineData[551] = 0;
  _$jscoverage['/underscore.js'].lineData[556] = 0;
  _$jscoverage['/underscore.js'].lineData[557] = 0;
  _$jscoverage['/underscore.js'].lineData[562] = 0;
  _$jscoverage['/underscore.js'].lineData[563] = 0;
  _$jscoverage['/underscore.js'].lineData[564] = 0;
  _$jscoverage['/underscore.js'].lineData[565] = 0;
  _$jscoverage['/underscore.js'].lineData[566] = 0;
  _$jscoverage['/underscore.js'].lineData[567] = 0;
  _$jscoverage['/underscore.js'].lineData[568] = 0;
  _$jscoverage['/underscore.js'].lineData[569] = 0;
  _$jscoverage['/underscore.js'].lineData[570] = 0;
  _$jscoverage['/underscore.js'].lineData[572] = 0;
  _$jscoverage['/underscore.js'].lineData[574] = 0;
  _$jscoverage['/underscore.js'].lineData[579] = 0;
  _$jscoverage['/underscore.js'].lineData[580] = 0;
  _$jscoverage['/underscore.js'].lineData[581] = 0;
  _$jscoverage['/underscore.js'].lineData[582] = 0;
  _$jscoverage['/underscore.js'].lineData[588] = 0;
  _$jscoverage['/underscore.js'].lineData[589] = 0;
  _$jscoverage['/underscore.js'].lineData[590] = 0;
  _$jscoverage['/underscore.js'].lineData[592] = 0;
  _$jscoverage['/underscore.js'].lineData[593] = 0;
  _$jscoverage['/underscore.js'].lineData[595] = 0;
  _$jscoverage['/underscore.js'].lineData[600] = 0;
  _$jscoverage['/underscore.js'].lineData[605] = 0;
  _$jscoverage['/underscore.js'].lineData[606] = 0;
  _$jscoverage['/underscore.js'].lineData[607] = 0;
  _$jscoverage['/underscore.js'].lineData[608] = 0;
  _$jscoverage['/underscore.js'].lineData[609] = 0;
  _$jscoverage['/underscore.js'].lineData[611] = 0;
  _$jscoverage['/underscore.js'].lineData[614] = 0;
  _$jscoverage['/underscore.js'].lineData[618] = 0;
  _$jscoverage['/underscore.js'].lineData[619] = 0;
  _$jscoverage['/underscore.js'].lineData[620] = 0;
  _$jscoverage['/underscore.js'].lineData[621] = 0;
  _$jscoverage['/underscore.js'].lineData[622] = 0;
  _$jscoverage['/underscore.js'].lineData[623] = 0;
  _$jscoverage['/underscore.js'].lineData[624] = 0;
  _$jscoverage['/underscore.js'].lineData[626] = 0;
  _$jscoverage['/underscore.js'].lineData[631] = 0;
  _$jscoverage['/underscore.js'].lineData[632] = 0;
  _$jscoverage['/underscore.js'].lineData[636] = 0;
  _$jscoverage['/underscore.js'].lineData[637] = 0;
  _$jscoverage['/underscore.js'].lineData[638] = 0;
  _$jscoverage['/underscore.js'].lineData[639] = 0;
  _$jscoverage['/underscore.js'].lineData[640] = 0;
  _$jscoverage['/underscore.js'].lineData[641] = 0;
  _$jscoverage['/underscore.js'].lineData[642] = 0;
  _$jscoverage['/underscore.js'].lineData[644] = 0;
  _$jscoverage['/underscore.js'].lineData[648] = 0;
  _$jscoverage['/underscore.js'].lineData[649] = 0;
  _$jscoverage['/underscore.js'].lineData[650] = 0;
  _$jscoverage['/underscore.js'].lineData[651] = 0;
  _$jscoverage['/underscore.js'].lineData[652] = 0;
  _$jscoverage['/underscore.js'].lineData[653] = 0;
  _$jscoverage['/underscore.js'].lineData[655] = 0;
  _$jscoverage['/underscore.js'].lineData[657] = 0;
  _$jscoverage['/underscore.js'].lineData[658] = 0;
  _$jscoverage['/underscore.js'].lineData[659] = 0;
  _$jscoverage['/underscore.js'].lineData[661] = 0;
  _$jscoverage['/underscore.js'].lineData[662] = 0;
  _$jscoverage['/underscore.js'].lineData[663] = 0;
  _$jscoverage['/underscore.js'].lineData[665] = 0;
  _$jscoverage['/underscore.js'].lineData[666] = 0;
  _$jscoverage['/underscore.js'].lineData[668] = 0;
  _$jscoverage['/underscore.js'].lineData[676] = 0;
  _$jscoverage['/underscore.js'].lineData[677] = 0;
  _$jscoverage['/underscore.js'].lineData[682] = 0;
  _$jscoverage['/underscore.js'].lineData[683] = 0;
  _$jscoverage['/underscore.js'].lineData[684] = 0;
  _$jscoverage['/underscore.js'].lineData[685] = 0;
  _$jscoverage['/underscore.js'].lineData[687] = 0;
  _$jscoverage['/underscore.js'].lineData[689] = 0;
  _$jscoverage['/underscore.js'].lineData[690] = 0;
  _$jscoverage['/underscore.js'].lineData[692] = 0;
  _$jscoverage['/underscore.js'].lineData[693] = 0;
  _$jscoverage['/underscore.js'].lineData[696] = 0;
  _$jscoverage['/underscore.js'].lineData[704] = 0;
  _$jscoverage['/underscore.js'].lineData[705] = 0;
  _$jscoverage['/underscore.js'].lineData[706] = 0;
  _$jscoverage['/underscore.js'].lineData[707] = 0;
  _$jscoverage['/underscore.js'].lineData[708] = 0;
  _$jscoverage['/underscore.js'].lineData[709] = 0;
  _$jscoverage['/underscore.js'].lineData[715] = 0;
  _$jscoverage['/underscore.js'].lineData[716] = 0;
  _$jscoverage['/underscore.js'].lineData[717] = 0;
  _$jscoverage['/underscore.js'].lineData[718] = 0;
  _$jscoverage['/underscore.js'].lineData[720] = 0;
  _$jscoverage['/underscore.js'].lineData[727] = 0;
  _$jscoverage['/underscore.js'].lineData[728] = 0;
  _$jscoverage['/underscore.js'].lineData[729] = 0;
  _$jscoverage['/underscore.js'].lineData[730] = 0;
  _$jscoverage['/underscore.js'].lineData[731] = 0;
  _$jscoverage['/underscore.js'].lineData[732] = 0;
  _$jscoverage['/underscore.js'].lineData[733] = 0;
  _$jscoverage['/underscore.js'].lineData[735] = 0;
  _$jscoverage['/underscore.js'].lineData[736] = 0;
  _$jscoverage['/underscore.js'].lineData[738] = 0;
  _$jscoverage['/underscore.js'].lineData[741] = 0;
  _$jscoverage['/underscore.js'].lineData[746] = 0;
  _$jscoverage['/underscore.js'].lineData[747] = 0;
  _$jscoverage['/underscore.js'].lineData[748] = 0;
  _$jscoverage['/underscore.js'].lineData[749] = 0;
  _$jscoverage['/underscore.js'].lineData[750] = 0;
  _$jscoverage['/underscore.js'].lineData[751] = 0;
  _$jscoverage['/underscore.js'].lineData[752] = 0;
  _$jscoverage['/underscore.js'].lineData[757] = 0;
  _$jscoverage['/underscore.js'].lineData[758] = 0;
  _$jscoverage['/underscore.js'].lineData[759] = 0;
  _$jscoverage['/underscore.js'].lineData[760] = 0;
  _$jscoverage['/underscore.js'].lineData[761] = 0;
  _$jscoverage['/underscore.js'].lineData[762] = 0;
  _$jscoverage['/underscore.js'].lineData[764] = 0;
  _$jscoverage['/underscore.js'].lineData[765] = 0;
  _$jscoverage['/underscore.js'].lineData[770] = 0;
  _$jscoverage['/underscore.js'].lineData[771] = 0;
  _$jscoverage['/underscore.js'].lineData[772] = 0;
  _$jscoverage['/underscore.js'].lineData[778] = 0;
  _$jscoverage['/underscore.js'].lineData[785] = 0;
  _$jscoverage['/underscore.js'].lineData[786] = 0;
  _$jscoverage['/underscore.js'].lineData[787] = 0;
  _$jscoverage['/underscore.js'].lineData[788] = 0;
  _$jscoverage['/underscore.js'].lineData[789] = 0;
  _$jscoverage['/underscore.js'].lineData[790] = 0;
  _$jscoverage['/underscore.js'].lineData[791] = 0;
  _$jscoverage['/underscore.js'].lineData[792] = 0;
  _$jscoverage['/underscore.js'].lineData[793] = 0;
  _$jscoverage['/underscore.js'].lineData[794] = 0;
  _$jscoverage['/underscore.js'].lineData[796] = 0;
  _$jscoverage['/underscore.js'].lineData[797] = 0;
  _$jscoverage['/underscore.js'].lineData[798] = 0;
  _$jscoverage['/underscore.js'].lineData[799] = 0;
  _$jscoverage['/underscore.js'].lineData[800] = 0;
  _$jscoverage['/underscore.js'].lineData[801] = 0;
  _$jscoverage['/underscore.js'].lineData[802] = 0;
  _$jscoverage['/underscore.js'].lineData[803] = 0;
  _$jscoverage['/underscore.js'].lineData[804] = 0;
  _$jscoverage['/underscore.js'].lineData[805] = 0;
  _$jscoverage['/underscore.js'].lineData[807] = 0;
  _$jscoverage['/underscore.js'].lineData[808] = 0;
  _$jscoverage['/underscore.js'].lineData[809] = 0;
  _$jscoverage['/underscore.js'].lineData[810] = 0;
  _$jscoverage['/underscore.js'].lineData[811] = 0;
  _$jscoverage['/underscore.js'].lineData[813] = 0;
  _$jscoverage['/underscore.js'].lineData[821] = 0;
  _$jscoverage['/underscore.js'].lineData[822] = 0;
  _$jscoverage['/underscore.js'].lineData[824] = 0;
  _$jscoverage['/underscore.js'].lineData[825] = 0;
  _$jscoverage['/underscore.js'].lineData[827] = 0;
  _$jscoverage['/underscore.js'].lineData[828] = 0;
  _$jscoverage['/underscore.js'].lineData[830] = 0;
  _$jscoverage['/underscore.js'].lineData[831] = 0;
  _$jscoverage['/underscore.js'].lineData[832] = 0;
  _$jscoverage['/underscore.js'].lineData[833] = 0;
  _$jscoverage['/underscore.js'].lineData[838] = 0;
  _$jscoverage['/underscore.js'].lineData[839] = 0;
  _$jscoverage['/underscore.js'].lineData[840] = 0;
  _$jscoverage['/underscore.js'].lineData[841] = 0;
  _$jscoverage['/underscore.js'].lineData[842] = 0;
  _$jscoverage['/underscore.js'].lineData[843] = 0;
  _$jscoverage['/underscore.js'].lineData[844] = 0;
  _$jscoverage['/underscore.js'].lineData[845] = 0;
  _$jscoverage['/underscore.js'].lineData[846] = 0;
  _$jscoverage['/underscore.js'].lineData[849] = 0;
  _$jscoverage['/underscore.js'].lineData[856] = 0;
  _$jscoverage['/underscore.js'].lineData[857] = 0;
  _$jscoverage['/underscore.js'].lineData[861] = 0;
  _$jscoverage['/underscore.js'].lineData[862] = 0;
  _$jscoverage['/underscore.js'].lineData[863] = 0;
  _$jscoverage['/underscore.js'].lineData[869] = 0;
  _$jscoverage['/underscore.js'].lineData[870] = 0;
  _$jscoverage['/underscore.js'].lineData[871] = 0;
  _$jscoverage['/underscore.js'].lineData[872] = 0;
  _$jscoverage['/underscore.js'].lineData[873] = 0;
  _$jscoverage['/underscore.js'].lineData[874] = 0;
  _$jscoverage['/underscore.js'].lineData[875] = 0;
  _$jscoverage['/underscore.js'].lineData[876] = 0;
  _$jscoverage['/underscore.js'].lineData[881] = 0;
  _$jscoverage['/underscore.js'].lineData[882] = 0;
  _$jscoverage['/underscore.js'].lineData[883] = 0;
  _$jscoverage['/underscore.js'].lineData[884] = 0;
  _$jscoverage['/underscore.js'].lineData[890] = 0;
  _$jscoverage['/underscore.js'].lineData[891] = 0;
  _$jscoverage['/underscore.js'].lineData[892] = 0;
  _$jscoverage['/underscore.js'].lineData[893] = 0;
  _$jscoverage['/underscore.js'].lineData[894] = 0;
  _$jscoverage['/underscore.js'].lineData[896] = 0;
  _$jscoverage['/underscore.js'].lineData[897] = 0;
  _$jscoverage['/underscore.js'].lineData[903] = 0;
  _$jscoverage['/underscore.js'].lineData[905] = 0;
  _$jscoverage['/underscore.js'].lineData[911] = 0;
  _$jscoverage['/underscore.js'].lineData[912] = 0;
  _$jscoverage['/underscore.js'].lineData[915] = 0;
  _$jscoverage['/underscore.js'].lineData[916] = 0;
  _$jscoverage['/underscore.js'].lineData[917] = 0;
  _$jscoverage['/underscore.js'].lineData[918] = 0;
  _$jscoverage['/underscore.js'].lineData[921] = 0;
  _$jscoverage['/underscore.js'].lineData[922] = 0;
  _$jscoverage['/underscore.js'].lineData[924] = 0;
  _$jscoverage['/underscore.js'].lineData[925] = 0;
  _$jscoverage['/underscore.js'].lineData[926] = 0;
  _$jscoverage['/underscore.js'].lineData[927] = 0;
  _$jscoverage['/underscore.js'].lineData[934] = 0;
  _$jscoverage['/underscore.js'].lineData[935] = 0;
  _$jscoverage['/underscore.js'].lineData[936] = 0;
  _$jscoverage['/underscore.js'].lineData[937] = 0;
  _$jscoverage['/underscore.js'].lineData[938] = 0;
  _$jscoverage['/underscore.js'].lineData[940] = 0;
  _$jscoverage['/underscore.js'].lineData[941] = 0;
  _$jscoverage['/underscore.js'].lineData[945] = 0;
  _$jscoverage['/underscore.js'].lineData[946] = 0;
  _$jscoverage['/underscore.js'].lineData[947] = 0;
  _$jscoverage['/underscore.js'].lineData[948] = 0;
  _$jscoverage['/underscore.js'].lineData[950] = 0;
  _$jscoverage['/underscore.js'].lineData[951] = 0;
  _$jscoverage['/underscore.js'].lineData[955] = 0;
  _$jscoverage['/underscore.js'].lineData[956] = 0;
  _$jscoverage['/underscore.js'].lineData[957] = 0;
  _$jscoverage['/underscore.js'].lineData[958] = 0;
  _$jscoverage['/underscore.js'].lineData[959] = 0;
  _$jscoverage['/underscore.js'].lineData[960] = 0;
  _$jscoverage['/underscore.js'].lineData[962] = 0;
  _$jscoverage['/underscore.js'].lineData[967] = 0;
  _$jscoverage['/underscore.js'].lineData[968] = 0;
  _$jscoverage['/underscore.js'].lineData[969] = 0;
  _$jscoverage['/underscore.js'].lineData[972] = 0;
  _$jscoverage['/underscore.js'].lineData[973] = 0;
  _$jscoverage['/underscore.js'].lineData[974] = 0;
  _$jscoverage['/underscore.js'].lineData[976] = 0;
  _$jscoverage['/underscore.js'].lineData[980] = 0;
  _$jscoverage['/underscore.js'].lineData[981] = 0;
  _$jscoverage['/underscore.js'].lineData[982] = 0;
  _$jscoverage['/underscore.js'].lineData[983] = 0;
  _$jscoverage['/underscore.js'].lineData[984] = 0;
  _$jscoverage['/underscore.js'].lineData[985] = 0;
  _$jscoverage['/underscore.js'].lineData[987] = 0;
  _$jscoverage['/underscore.js'].lineData[991] = 0;
  _$jscoverage['/underscore.js'].lineData[992] = 0;
  _$jscoverage['/underscore.js'].lineData[993] = 0;
  _$jscoverage['/underscore.js'].lineData[994] = 0;
  _$jscoverage['/underscore.js'].lineData[995] = 0;
  _$jscoverage['/underscore.js'].lineData[997] = 0;
  _$jscoverage['/underscore.js'].lineData[1002] = 0;
  _$jscoverage['/underscore.js'].lineData[1003] = 0;
  _$jscoverage['/underscore.js'].lineData[1004] = 0;
  _$jscoverage['/underscore.js'].lineData[1005] = 0;
  _$jscoverage['/underscore.js'].lineData[1007] = 0;
  _$jscoverage['/underscore.js'].lineData[1011] = 0;
  _$jscoverage['/underscore.js'].lineData[1012] = 0;
  _$jscoverage['/underscore.js'].lineData[1013] = 0;
  _$jscoverage['/underscore.js'].lineData[1014] = 0;
  _$jscoverage['/underscore.js'].lineData[1015] = 0;
  _$jscoverage['/underscore.js'].lineData[1016] = 0;
  _$jscoverage['/underscore.js'].lineData[1019] = 0;
  _$jscoverage['/underscore.js'].lineData[1020] = 0;
  _$jscoverage['/underscore.js'].lineData[1021] = 0;
  _$jscoverage['/underscore.js'].lineData[1024] = 0;
  _$jscoverage['/underscore.js'].lineData[1029] = 0;
  _$jscoverage['/underscore.js'].lineData[1033] = 0;
  _$jscoverage['/underscore.js'].lineData[1036] = 0;
  _$jscoverage['/underscore.js'].lineData[1037] = 0;
  _$jscoverage['/underscore.js'].lineData[1038] = 0;
  _$jscoverage['/underscore.js'].lineData[1039] = 0;
  _$jscoverage['/underscore.js'].lineData[1040] = 0;
  _$jscoverage['/underscore.js'].lineData[1041] = 0;
  _$jscoverage['/underscore.js'].lineData[1046] = 0;
  _$jscoverage['/underscore.js'].lineData[1047] = 0;
  _$jscoverage['/underscore.js'].lineData[1051] = 0;
  _$jscoverage['/underscore.js'].lineData[1052] = 0;
  _$jscoverage['/underscore.js'].lineData[1053] = 0;
  _$jscoverage['/underscore.js'].lineData[1054] = 0;
  _$jscoverage['/underscore.js'].lineData[1055] = 0;
  _$jscoverage['/underscore.js'].lineData[1056] = 0;
  _$jscoverage['/underscore.js'].lineData[1058] = 0;
  _$jscoverage['/underscore.js'].lineData[1059] = 0;
  _$jscoverage['/underscore.js'].lineData[1060] = 0;
  _$jscoverage['/underscore.js'].lineData[1062] = 0;
  _$jscoverage['/underscore.js'].lineData[1063] = 0;
  _$jscoverage['/underscore.js'].lineData[1064] = 0;
  _$jscoverage['/underscore.js'].lineData[1065] = 0;
  _$jscoverage['/underscore.js'].lineData[1067] = 0;
  _$jscoverage['/underscore.js'].lineData[1071] = 0;
  _$jscoverage['/underscore.js'].lineData[1072] = 0;
  _$jscoverage['/underscore.js'].lineData[1073] = 0;
  _$jscoverage['/underscore.js'].lineData[1074] = 0;
  _$jscoverage['/underscore.js'].lineData[1075] = 0;
  _$jscoverage['/underscore.js'].lineData[1077] = 0;
  _$jscoverage['/underscore.js'].lineData[1078] = 0;
  _$jscoverage['/underscore.js'].lineData[1079] = 0;
  _$jscoverage['/underscore.js'].lineData[1082] = 0;
  _$jscoverage['/underscore.js'].lineData[1086] = 0;
  _$jscoverage['/underscore.js'].lineData[1091] = 0;
  _$jscoverage['/underscore.js'].lineData[1092] = 0;
  _$jscoverage['/underscore.js'].lineData[1093] = 0;
  _$jscoverage['/underscore.js'].lineData[1094] = 0;
  _$jscoverage['/underscore.js'].lineData[1098] = 0;
  _$jscoverage['/underscore.js'].lineData[1099] = 0;
  _$jscoverage['/underscore.js'].lineData[1100] = 0;
  _$jscoverage['/underscore.js'].lineData[1106] = 0;
  _$jscoverage['/underscore.js'].lineData[1107] = 0;
  _$jscoverage['/underscore.js'].lineData[1108] = 0;
  _$jscoverage['/underscore.js'].lineData[1112] = 0;
  _$jscoverage['/underscore.js'].lineData[1113] = 0;
  _$jscoverage['/underscore.js'].lineData[1114] = 0;
  _$jscoverage['/underscore.js'].lineData[1115] = 0;
  _$jscoverage['/underscore.js'].lineData[1116] = 0;
  _$jscoverage['/underscore.js'].lineData[1117] = 0;
  _$jscoverage['/underscore.js'].lineData[1118] = 0;
  _$jscoverage['/underscore.js'].lineData[1120] = 0;
  _$jscoverage['/underscore.js'].lineData[1125] = 0;
  _$jscoverage['/underscore.js'].lineData[1126] = 0;
  _$jscoverage['/underscore.js'].lineData[1129] = 0;
  _$jscoverage['/underscore.js'].lineData[1131] = 0;
  _$jscoverage['/underscore.js'].lineData[1133] = 0;
  _$jscoverage['/underscore.js'].lineData[1135] = 0;
  _$jscoverage['/underscore.js'].lineData[1136] = 0;
  _$jscoverage['/underscore.js'].lineData[1137] = 0;
  _$jscoverage['/underscore.js'].lineData[1141] = 0;
  _$jscoverage['/underscore.js'].lineData[1143] = 0;
  _$jscoverage['/underscore.js'].lineData[1144] = 0;
  _$jscoverage['/underscore.js'].lineData[1146] = 0;
  _$jscoverage['/underscore.js'].lineData[1147] = 0;
  _$jscoverage['/underscore.js'].lineData[1148] = 0;
  _$jscoverage['/underscore.js'].lineData[1155] = 0;
  _$jscoverage['/underscore.js'].lineData[1159] = 0;
  _$jscoverage['/underscore.js'].lineData[1161] = 0;
  _$jscoverage['/underscore.js'].lineData[1167] = 0;
  _$jscoverage['/underscore.js'].lineData[1170] = 0;
  _$jscoverage['/underscore.js'].lineData[1171] = 0;
  _$jscoverage['/underscore.js'].lineData[1172] = 0;
  _$jscoverage['/underscore.js'].lineData[1176] = 0;
  _$jscoverage['/underscore.js'].lineData[1177] = 0;
  _$jscoverage['/underscore.js'].lineData[1180] = 0;
  _$jscoverage['/underscore.js'].lineData[1188] = 0;
  _$jscoverage['/underscore.js'].lineData[1189] = 0;
  _$jscoverage['/underscore.js'].lineData[1190] = 0;
  _$jscoverage['/underscore.js'].lineData[1191] = 0;
  _$jscoverage['/underscore.js'].lineData[1194] = 0;
  _$jscoverage['/underscore.js'].lineData[1198] = 0;
  _$jscoverage['/underscore.js'].lineData[1199] = 0;
  _$jscoverage['/underscore.js'].lineData[1202] = 0;
  _$jscoverage['/underscore.js'].lineData[1204] = 0;
  _$jscoverage['/underscore.js'].lineData[1205] = 0;
  _$jscoverage['/underscore.js'].lineData[1207] = 0;
  _$jscoverage['/underscore.js'].lineData[1208] = 0;
  _$jscoverage['/underscore.js'].lineData[1212] = 0;
  _$jscoverage['/underscore.js'].lineData[1213] = 0;
  _$jscoverage['/underscore.js'].lineData[1215] = 0;
  _$jscoverage['/underscore.js'].lineData[1216] = 0;
  _$jscoverage['/underscore.js'].lineData[1218] = 0;
  _$jscoverage['/underscore.js'].lineData[1219] = 0;
  _$jscoverage['/underscore.js'].lineData[1223] = 0;
  _$jscoverage['/underscore.js'].lineData[1224] = 0;
  _$jscoverage['/underscore.js'].lineData[1225] = 0;
  _$jscoverage['/underscore.js'].lineData[1229] = 0;
  _$jscoverage['/underscore.js'].lineData[1230] = 0;
  _$jscoverage['/underscore.js'].lineData[1235] = 0;
  _$jscoverage['/underscore.js'].lineData[1236] = 0;
  _$jscoverage['/underscore.js'].lineData[1237] = 0;
  _$jscoverage['/underscore.js'].lineData[1238] = 0;
  _$jscoverage['/underscore.js'].lineData[1242] = 0;
  _$jscoverage['/underscore.js'].lineData[1243] = 0;
  _$jscoverage['/underscore.js'].lineData[1248] = 0;
  _$jscoverage['/underscore.js'].lineData[1249] = 0;
  _$jscoverage['/underscore.js'].lineData[1253] = 0;
  _$jscoverage['/underscore.js'].lineData[1254] = 0;
  _$jscoverage['/underscore.js'].lineData[1255] = 0;
  _$jscoverage['/underscore.js'].lineData[1259] = 0;
  _$jscoverage['/underscore.js'].lineData[1260] = 0;
  _$jscoverage['/underscore.js'].lineData[1261] = 0;
  _$jscoverage['/underscore.js'].lineData[1267] = 0;
  _$jscoverage['/underscore.js'].lineData[1268] = 0;
  _$jscoverage['/underscore.js'].lineData[1269] = 0;
  _$jscoverage['/underscore.js'].lineData[1275] = 0;
  _$jscoverage['/underscore.js'].lineData[1276] = 0;
  _$jscoverage['/underscore.js'].lineData[1277] = 0;
  _$jscoverage['/underscore.js'].lineData[1282] = 0;
  _$jscoverage['/underscore.js'].lineData[1283] = 0;
  _$jscoverage['/underscore.js'].lineData[1287] = 0;
  _$jscoverage['/underscore.js'].lineData[1288] = 0;
  _$jscoverage['/underscore.js'].lineData[1292] = 0;
  _$jscoverage['/underscore.js'].lineData[1293] = 0;
  _$jscoverage['/underscore.js'].lineData[1297] = 0;
  _$jscoverage['/underscore.js'].lineData[1298] = 0;
  _$jscoverage['/underscore.js'].lineData[1302] = 0;
  _$jscoverage['/underscore.js'].lineData[1303] = 0;
  _$jscoverage['/underscore.js'].lineData[1308] = 0;
  _$jscoverage['/underscore.js'].lineData[1309] = 0;
  _$jscoverage['/underscore.js'].lineData[1317] = 0;
  _$jscoverage['/underscore.js'].lineData[1318] = 0;
  _$jscoverage['/underscore.js'].lineData[1319] = 0;
  _$jscoverage['/underscore.js'].lineData[1323] = 0;
  _$jscoverage['/underscore.js'].lineData[1324] = 0;
  _$jscoverage['/underscore.js'].lineData[1328] = 0;
  _$jscoverage['/underscore.js'].lineData[1329] = 0;
  _$jscoverage['/underscore.js'].lineData[1330] = 0;
  _$jscoverage['/underscore.js'].lineData[1334] = 0;
  _$jscoverage['/underscore.js'].lineData[1336] = 0;
  _$jscoverage['/underscore.js'].lineData[1339] = 0;
  _$jscoverage['/underscore.js'].lineData[1340] = 0;
  _$jscoverage['/underscore.js'].lineData[1341] = 0;
  _$jscoverage['/underscore.js'].lineData[1347] = 0;
  _$jscoverage['/underscore.js'].lineData[1348] = 0;
  _$jscoverage['/underscore.js'].lineData[1349] = 0;
  _$jscoverage['/underscore.js'].lineData[1350] = 0;
  _$jscoverage['/underscore.js'].lineData[1355] = 0;
  _$jscoverage['/underscore.js'].lineData[1356] = 0;
  _$jscoverage['/underscore.js'].lineData[1357] = 0;
  _$jscoverage['/underscore.js'].lineData[1358] = 0;
  _$jscoverage['/underscore.js'].lineData[1359] = 0;
  _$jscoverage['/underscore.js'].lineData[1363] = 0;
  _$jscoverage['/underscore.js'].lineData[1364] = 0;
  _$jscoverage['/underscore.js'].lineData[1365] = 0;
  _$jscoverage['/underscore.js'].lineData[1366] = 0;
  _$jscoverage['/underscore.js'].lineData[1368] = 0;
  _$jscoverage['/underscore.js'].lineData[1372] = 0;
  _$jscoverage['/underscore.js'].lineData[1373] = 0;
  _$jscoverage['/underscore.js'].lineData[1377] = 0;
  _$jscoverage['/underscore.js'].lineData[1385] = 0;
  _$jscoverage['/underscore.js'].lineData[1388] = 0;
  _$jscoverage['/underscore.js'].lineData[1389] = 0;
  _$jscoverage['/underscore.js'].lineData[1390] = 0;
  _$jscoverage['/underscore.js'].lineData[1393] = 0;
  _$jscoverage['/underscore.js'].lineData[1394] = 0;
  _$jscoverage['/underscore.js'].lineData[1395] = 0;
  _$jscoverage['/underscore.js'].lineData[1396] = 0;
  _$jscoverage['/underscore.js'].lineData[1397] = 0;
  _$jscoverage['/underscore.js'].lineData[1398] = 0;
  _$jscoverage['/underscore.js'].lineData[1401] = 0;
  _$jscoverage['/underscore.js'].lineData[1402] = 0;
  _$jscoverage['/underscore.js'].lineData[1406] = 0;
  _$jscoverage['/underscore.js'].lineData[1407] = 0;
  _$jscoverage['/underscore.js'].lineData[1408] = 0;
  _$jscoverage['/underscore.js'].lineData[1409] = 0;
  _$jscoverage['/underscore.js'].lineData[1411] = 0;
  _$jscoverage['/underscore.js'].lineData[1416] = 0;
  _$jscoverage['/underscore.js'].lineData[1417] = 0;
  _$jscoverage['/underscore.js'].lineData[1418] = 0;
  _$jscoverage['/underscore.js'].lineData[1419] = 0;
  _$jscoverage['/underscore.js'].lineData[1424] = 0;
  _$jscoverage['/underscore.js'].lineData[1433] = 0;
  _$jscoverage['/underscore.js'].lineData[1437] = 0;
  _$jscoverage['/underscore.js'].lineData[1446] = 0;
  _$jscoverage['/underscore.js'].lineData[1448] = 0;
  _$jscoverage['/underscore.js'].lineData[1449] = 0;
  _$jscoverage['/underscore.js'].lineData[1456] = 0;
  _$jscoverage['/underscore.js'].lineData[1457] = 0;
  _$jscoverage['/underscore.js'].lineData[1458] = 0;
  _$jscoverage['/underscore.js'].lineData[1461] = 0;
  _$jscoverage['/underscore.js'].lineData[1468] = 0;
  _$jscoverage['/underscore.js'].lineData[1469] = 0;
  _$jscoverage['/underscore.js'].lineData[1470] = 0;
  _$jscoverage['/underscore.js'].lineData[1471] = 0;
  _$jscoverage['/underscore.js'].lineData[1472] = 0;
  _$jscoverage['/underscore.js'].lineData[1474] = 0;
  _$jscoverage['/underscore.js'].lineData[1475] = 0;
  _$jscoverage['/underscore.js'].lineData[1476] = 0;
  _$jscoverage['/underscore.js'].lineData[1477] = 0;
  _$jscoverage['/underscore.js'].lineData[1478] = 0;
  _$jscoverage['/underscore.js'].lineData[1479] = 0;
  _$jscoverage['/underscore.js'].lineData[1483] = 0;
  _$jscoverage['/underscore.js'].lineData[1485] = 0;
  _$jscoverage['/underscore.js'].lineData[1488] = 0;
  _$jscoverage['/underscore.js'].lineData[1490] = 0;
  _$jscoverage['/underscore.js'].lineData[1494] = 0;
  _$jscoverage['/underscore.js'].lineData[1495] = 0;
  _$jscoverage['/underscore.js'].lineData[1496] = 0;
  _$jscoverage['/underscore.js'].lineData[1498] = 0;
  _$jscoverage['/underscore.js'].lineData[1499] = 0;
  _$jscoverage['/underscore.js'].lineData[1502] = 0;
  _$jscoverage['/underscore.js'].lineData[1503] = 0;
  _$jscoverage['/underscore.js'].lineData[1507] = 0;
  _$jscoverage['/underscore.js'].lineData[1508] = 0;
  _$jscoverage['/underscore.js'].lineData[1510] = 0;
  _$jscoverage['/underscore.js'].lineData[1514] = 0;
  _$jscoverage['/underscore.js'].lineData[1515] = 0;
  _$jscoverage['/underscore.js'].lineData[1516] = 0;
  _$jscoverage['/underscore.js'].lineData[1517] = 0;
  _$jscoverage['/underscore.js'].lineData[1527] = 0;
  _$jscoverage['/underscore.js'].lineData[1528] = 0;
  _$jscoverage['/underscore.js'].lineData[1532] = 0;
  _$jscoverage['/underscore.js'].lineData[1533] = 0;
  _$jscoverage['/underscore.js'].lineData[1534] = 0;
  _$jscoverage['/underscore.js'].lineData[1535] = 0;
  _$jscoverage['/underscore.js'].lineData[1536] = 0;
  _$jscoverage['/underscore.js'].lineData[1537] = 0;
  _$jscoverage['/underscore.js'].lineData[1538] = 0;
  _$jscoverage['/underscore.js'].lineData[1544] = 0;
  _$jscoverage['/underscore.js'].lineData[1547] = 0;
  _$jscoverage['/underscore.js'].lineData[1548] = 0;
  _$jscoverage['/underscore.js'].lineData[1549] = 0;
  _$jscoverage['/underscore.js'].lineData[1550] = 0;
  _$jscoverage['/underscore.js'].lineData[1551] = 0;
  _$jscoverage['/underscore.js'].lineData[1552] = 0;
  _$jscoverage['/underscore.js'].lineData[1553] = 0;
  _$jscoverage['/underscore.js'].lineData[1558] = 0;
  _$jscoverage['/underscore.js'].lineData[1559] = 0;
  _$jscoverage['/underscore.js'].lineData[1560] = 0;
  _$jscoverage['/underscore.js'].lineData[1561] = 0;
  _$jscoverage['/underscore.js'].lineData[1566] = 0;
  _$jscoverage['/underscore.js'].lineData[1567] = 0;
  _$jscoverage['/underscore.js'].lineData[1572] = 0;
  _$jscoverage['/underscore.js'].lineData[1574] = 0;
  _$jscoverage['/underscore.js'].lineData[1575] = 0;
  _$jscoverage['/underscore.js'].lineData[1585] = 0;
  _$jscoverage['/underscore.js'].lineData[1586] = 0;
  _$jscoverage['/underscore.js'].lineData[1587] = 0;
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
  _$jscoverage['/underscore.js'].branchData['102'] = [];
  _$jscoverage['/underscore.js'].branchData['102'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['106'] = [];
  _$jscoverage['/underscore.js'].branchData['106'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['115'] = [];
  _$jscoverage['/underscore.js'].branchData['115'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['125'] = [];
  _$jscoverage['/underscore.js'].branchData['125'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['126'] = [];
  _$jscoverage['/underscore.js'].branchData['126'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['135'] = [];
  _$jscoverage['/underscore.js'].branchData['135'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['147'] = [];
  _$jscoverage['/underscore.js'].branchData['147'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['147'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['147'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['147'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['147'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['159'] = [];
  _$jscoverage['/underscore.js'].branchData['159'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['160'] = [];
  _$jscoverage['/underscore.js'].branchData['160'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['165'] = [];
  _$jscoverage['/underscore.js'].branchData['165'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['175'] = [];
  _$jscoverage['/underscore.js'].branchData['175'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['176'] = [];
  _$jscoverage['/underscore.js'].branchData['176'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['178'] = [];
  _$jscoverage['/underscore.js'].branchData['178'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['179'] = [];
  _$jscoverage['/underscore.js'].branchData['179'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['190'] = [];
  _$jscoverage['/underscore.js'].branchData['190'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['191'] = [];
  _$jscoverage['/underscore.js'].branchData['191'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['192'] = [];
  _$jscoverage['/underscore.js'].branchData['192'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['193'] = [];
  _$jscoverage['/underscore.js'].branchData['193'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['194'] = [];
  _$jscoverage['/underscore.js'].branchData['194'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['197'] = [];
  _$jscoverage['/underscore.js'].branchData['197'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['197'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['197'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['198'] = [];
  _$jscoverage['/underscore.js'].branchData['198'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['205'] = [];
  _$jscoverage['/underscore.js'].branchData['205'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['220'] = [];
  _$jscoverage['/underscore.js'].branchData['220'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['225'] = [];
  _$jscoverage['/underscore.js'].branchData['225'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['225'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['225'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['234'] = [];
  _$jscoverage['/underscore.js'].branchData['234'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['248'] = [];
  _$jscoverage['/underscore.js'].branchData['248'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['249'] = [];
  _$jscoverage['/underscore.js'].branchData['249'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['250'] = [];
  _$jscoverage['/underscore.js'].branchData['250'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['251'] = [];
  _$jscoverage['/underscore.js'].branchData['251'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['252'] = [];
  _$jscoverage['/underscore.js'].branchData['252'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['261'] = [];
  _$jscoverage['/underscore.js'].branchData['261'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['262'] = [];
  _$jscoverage['/underscore.js'].branchData['262'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['263'] = [];
  _$jscoverage['/underscore.js'].branchData['263'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['264'] = [];
  _$jscoverage['/underscore.js'].branchData['264'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['265'] = [];
  _$jscoverage['/underscore.js'].branchData['265'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['273'] = [];
  _$jscoverage['/underscore.js'].branchData['273'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['274'] = [];
  _$jscoverage['/underscore.js'].branchData['274'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['274'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['275'] = [];
  _$jscoverage['/underscore.js'].branchData['275'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['282'] = [];
  _$jscoverage['/underscore.js'].branchData['282'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['283'] = [];
  _$jscoverage['/underscore.js'].branchData['283'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['308'] = [];
  _$jscoverage['/underscore.js'].branchData['308'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['308'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['308'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['308'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['308'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['308'][6] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['308'][7] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['309'] = [];
  _$jscoverage['/underscore.js'].branchData['309'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['310'] = [];
  _$jscoverage['/underscore.js'].branchData['310'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['312'] = [];
  _$jscoverage['/underscore.js'].branchData['312'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['320'] = [];
  _$jscoverage['/underscore.js'].branchData['320'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['320'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['320'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['320'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['320'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['333'] = [];
  _$jscoverage['/underscore.js'].branchData['333'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['333'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['333'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['333'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['333'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['333'][6] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['333'][7] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['334'] = [];
  _$jscoverage['/underscore.js'].branchData['334'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['335'] = [];
  _$jscoverage['/underscore.js'].branchData['335'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['337'] = [];
  _$jscoverage['/underscore.js'].branchData['337'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['345'] = [];
  _$jscoverage['/underscore.js'].branchData['345'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['345'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['345'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['345'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['345'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['364'] = [];
  _$jscoverage['/underscore.js'].branchData['364'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['364'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['365'] = [];
  _$jscoverage['/underscore.js'].branchData['365'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['368'] = [];
  _$jscoverage['/underscore.js'].branchData['368'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['372'] = [];
  _$jscoverage['/underscore.js'].branchData['372'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['393'] = [];
  _$jscoverage['/underscore.js'].branchData['393'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['394'] = [];
  _$jscoverage['/underscore.js'].branchData['394'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['394'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['394'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['395'] = [];
  _$jscoverage['/underscore.js'].branchData['395'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['395'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['395'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['404'] = [];
  _$jscoverage['/underscore.js'].branchData['404'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['417'] = [];
  _$jscoverage['/underscore.js'].branchData['417'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['430'] = [];
  _$jscoverage['/underscore.js'].branchData['430'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['435'] = [];
  _$jscoverage['/underscore.js'].branchData['435'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['436'] = [];
  _$jscoverage['/underscore.js'].branchData['436'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['437'] = [];
  _$jscoverage['/underscore.js'].branchData['437'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['443'] = [];
  _$jscoverage['/underscore.js'].branchData['443'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['444'] = [];
  _$jscoverage['/underscore.js'].branchData['444'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['450'] = [];
  _$jscoverage['/underscore.js'].branchData['450'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['460'] = [];
  _$jscoverage['/underscore.js'].branchData['460'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['461'] = [];
  _$jscoverage['/underscore.js'].branchData['461'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['461'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['469'] = [];
  _$jscoverage['/underscore.js'].branchData['469'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['469'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['475'] = [];
  _$jscoverage['/underscore.js'].branchData['475'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['476'] = [];
  _$jscoverage['/underscore.js'].branchData['476'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['476'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['484'] = [];
  _$jscoverage['/underscore.js'].branchData['484'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['484'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['494'] = [];
  _$jscoverage['/underscore.js'].branchData['494'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['496'] = [];
  _$jscoverage['/underscore.js'].branchData['496'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['498'] = [];
  _$jscoverage['/underscore.js'].branchData['498'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['498'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['500'] = [];
  _$jscoverage['/underscore.js'].branchData['500'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['502'] = [];
  _$jscoverage['/underscore.js'].branchData['502'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['507'] = [];
  _$jscoverage['/underscore.js'].branchData['507'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['528'] = [];
  _$jscoverage['/underscore.js'].branchData['528'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['533'] = [];
  _$jscoverage['/underscore.js'].branchData['533'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['536'] = [];
  _$jscoverage['/underscore.js'].branchData['536'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['538'] = [];
  _$jscoverage['/underscore.js'].branchData['538'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['539'] = [];
  _$jscoverage['/underscore.js'].branchData['539'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['540'] = [];
  _$jscoverage['/underscore.js'].branchData['540'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['540'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['542'] = [];
  _$jscoverage['/underscore.js'].branchData['542'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['543'] = [];
  _$jscoverage['/underscore.js'].branchData['543'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['547'] = [];
  _$jscoverage['/underscore.js'].branchData['547'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['565'] = [];
  _$jscoverage['/underscore.js'].branchData['565'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['567'] = [];
  _$jscoverage['/underscore.js'].branchData['567'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['569'] = [];
  _$jscoverage['/underscore.js'].branchData['569'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['570'] = [];
  _$jscoverage['/underscore.js'].branchData['570'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['572'] = [];
  _$jscoverage['/underscore.js'].branchData['572'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['589'] = [];
  _$jscoverage['/underscore.js'].branchData['589'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['589'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['592'] = [];
  _$jscoverage['/underscore.js'].branchData['592'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['607'] = [];
  _$jscoverage['/underscore.js'].branchData['607'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['608'] = [];
  _$jscoverage['/underscore.js'].branchData['608'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['622'] = [];
  _$jscoverage['/underscore.js'].branchData['622'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['623'] = [];
  _$jscoverage['/underscore.js'].branchData['623'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['623'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['623'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['624'] = [];
  _$jscoverage['/underscore.js'].branchData['624'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['640'] = [];
  _$jscoverage['/underscore.js'].branchData['640'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['642'] = [];
  _$jscoverage['/underscore.js'].branchData['642'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['651'] = [];
  _$jscoverage['/underscore.js'].branchData['651'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['652'] = [];
  _$jscoverage['/underscore.js'].branchData['652'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['653'] = [];
  _$jscoverage['/underscore.js'].branchData['653'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['655'] = [];
  _$jscoverage['/underscore.js'].branchData['655'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['657'] = [];
  _$jscoverage['/underscore.js'].branchData['657'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['657'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['659'] = [];
  _$jscoverage['/underscore.js'].branchData['659'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['661'] = [];
  _$jscoverage['/underscore.js'].branchData['661'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['663'] = [];
  _$jscoverage['/underscore.js'].branchData['663'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['665'] = [];
  _$jscoverage['/underscore.js'].branchData['665'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['665'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['665'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['665'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['666'] = [];
  _$jscoverage['/underscore.js'].branchData['666'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['683'] = [];
  _$jscoverage['/underscore.js'].branchData['683'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['684'] = [];
  _$jscoverage['/underscore.js'].branchData['684'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['687'] = [];
  _$jscoverage['/underscore.js'].branchData['687'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['692'] = [];
  _$jscoverage['/underscore.js'].branchData['692'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['705'] = [];
  _$jscoverage['/underscore.js'].branchData['705'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['708'] = [];
  _$jscoverage['/underscore.js'].branchData['708'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['716'] = [];
  _$jscoverage['/underscore.js'].branchData['716'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['732'] = [];
  _$jscoverage['/underscore.js'].branchData['732'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['733'] = [];
  _$jscoverage['/underscore.js'].branchData['733'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['735'] = [];
  _$jscoverage['/underscore.js'].branchData['735'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['749'] = [];
  _$jscoverage['/underscore.js'].branchData['749'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['750'] = [];
  _$jscoverage['/underscore.js'].branchData['750'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['760'] = [];
  _$jscoverage['/underscore.js'].branchData['760'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['761'] = [];
  _$jscoverage['/underscore.js'].branchData['761'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['789'] = [];
  _$jscoverage['/underscore.js'].branchData['789'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['791'] = [];
  _$jscoverage['/underscore.js'].branchData['791'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['794'] = [];
  _$jscoverage['/underscore.js'].branchData['794'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['798'] = [];
  _$jscoverage['/underscore.js'].branchData['798'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['798'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['802'] = [];
  _$jscoverage['/underscore.js'].branchData['802'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['802'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['802'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['803'] = [];
  _$jscoverage['/underscore.js'].branchData['803'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['809'] = [];
  _$jscoverage['/underscore.js'].branchData['809'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['810'] = [];
  _$jscoverage['/underscore.js'].branchData['810'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['810'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['827'] = [];
  _$jscoverage['/underscore.js'].branchData['827'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['827'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['827'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['831'] = [];
  _$jscoverage['/underscore.js'].branchData['831'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['833'] = [];
  _$jscoverage['/underscore.js'].branchData['833'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['842'] = [];
  _$jscoverage['/underscore.js'].branchData['842'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['843'] = [];
  _$jscoverage['/underscore.js'].branchData['843'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['844'] = [];
  _$jscoverage['/underscore.js'].branchData['844'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['875'] = [];
  _$jscoverage['/underscore.js'].branchData['875'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['883'] = [];
  _$jscoverage['/underscore.js'].branchData['883'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['893'] = [];
  _$jscoverage['/underscore.js'].branchData['893'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['896'] = [];
  _$jscoverage['/underscore.js'].branchData['896'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['918'] = [];
  _$jscoverage['/underscore.js'].branchData['918'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['918'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['922'] = [];
  _$jscoverage['/underscore.js'].branchData['922'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['924'] = [];
  _$jscoverage['/underscore.js'].branchData['924'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['926'] = [];
  _$jscoverage['/underscore.js'].branchData['926'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['926'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['926'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['935'] = [];
  _$jscoverage['/underscore.js'].branchData['935'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['936'] = [];
  _$jscoverage['/underscore.js'].branchData['936'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['938'] = [];
  _$jscoverage['/underscore.js'].branchData['938'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['940'] = [];
  _$jscoverage['/underscore.js'].branchData['940'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['946'] = [];
  _$jscoverage['/underscore.js'].branchData['946'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['950'] = [];
  _$jscoverage['/underscore.js'].branchData['950'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['959'] = [];
  _$jscoverage['/underscore.js'].branchData['959'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['972'] = [];
  _$jscoverage['/underscore.js'].branchData['972'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['984'] = [];
  _$jscoverage['/underscore.js'].branchData['984'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['994'] = [];
  _$jscoverage['/underscore.js'].branchData['994'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1005'] = [];
  _$jscoverage['/underscore.js'].branchData['1005'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1014'] = [];
  _$jscoverage['/underscore.js'].branchData['1014'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1014'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1014'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1015'] = [];
  _$jscoverage['/underscore.js'].branchData['1015'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1019'] = [];
  _$jscoverage['/underscore.js'].branchData['1019'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1021'] = [];
  _$jscoverage['/underscore.js'].branchData['1021'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1021'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1039'] = [];
  _$jscoverage['/underscore.js'].branchData['1039'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1041'] = [];
  _$jscoverage['/underscore.js'].branchData['1041'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1053'] = [];
  _$jscoverage['/underscore.js'].branchData['1053'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1054'] = [];
  _$jscoverage['/underscore.js'].branchData['1054'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1055'] = [];
  _$jscoverage['/underscore.js'].branchData['1055'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1062'] = [];
  _$jscoverage['/underscore.js'].branchData['1062'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1065'] = [];
  _$jscoverage['/underscore.js'].branchData['1065'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1073'] = [];
  _$jscoverage['/underscore.js'].branchData['1073'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1075'] = [];
  _$jscoverage['/underscore.js'].branchData['1075'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1093'] = [];
  _$jscoverage['/underscore.js'].branchData['1093'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1099'] = [];
  _$jscoverage['/underscore.js'].branchData['1099'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1100'] = [];
  _$jscoverage['/underscore.js'].branchData['1100'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1114'] = [];
  _$jscoverage['/underscore.js'].branchData['1114'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1116'] = [];
  _$jscoverage['/underscore.js'].branchData['1116'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1118'] = [];
  _$jscoverage['/underscore.js'].branchData['1118'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1118'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1129'] = [];
  _$jscoverage['/underscore.js'].branchData['1129'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1129'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1129'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1129'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1131'] = [];
  _$jscoverage['/underscore.js'].branchData['1131'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1131'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1131'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1131'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1133'] = [];
  _$jscoverage['/underscore.js'].branchData['1133'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1133'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1136'] = [];
  _$jscoverage['/underscore.js'].branchData['1136'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1136'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1136'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1136'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1136'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1143'] = [];
  _$jscoverage['/underscore.js'].branchData['1143'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1144'] = [];
  _$jscoverage['/underscore.js'].branchData['1144'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1147'] = [];
  _$jscoverage['/underscore.js'].branchData['1147'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1155'] = [];
  _$jscoverage['/underscore.js'].branchData['1155'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1159'] = [];
  _$jscoverage['/underscore.js'].branchData['1159'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1159'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1161'] = [];
  _$jscoverage['/underscore.js'].branchData['1161'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1161'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1161'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1167'] = [];
  _$jscoverage['/underscore.js'].branchData['1167'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1170'] = [];
  _$jscoverage['/underscore.js'].branchData['1170'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1171'] = [];
  _$jscoverage['/underscore.js'].branchData['1171'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1172'] = [];
  _$jscoverage['/underscore.js'].branchData['1172'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1172'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1172'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1177'] = [];
  _$jscoverage['/underscore.js'].branchData['1177'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1177'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1177'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1177'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1177'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1178'] = [];
  _$jscoverage['/underscore.js'].branchData['1178'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1179'] = [];
  _$jscoverage['/underscore.js'].branchData['1179'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1188'] = [];
  _$jscoverage['/underscore.js'].branchData['1188'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1189'] = [];
  _$jscoverage['/underscore.js'].branchData['1189'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1191'] = [];
  _$jscoverage['/underscore.js'].branchData['1191'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1194'] = [];
  _$jscoverage['/underscore.js'].branchData['1194'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1194'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1202'] = [];
  _$jscoverage['/underscore.js'].branchData['1202'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1205'] = [];
  _$jscoverage['/underscore.js'].branchData['1205'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1207'] = [];
  _$jscoverage['/underscore.js'].branchData['1207'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1208'] = [];
  _$jscoverage['/underscore.js'].branchData['1208'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1215'] = [];
  _$jscoverage['/underscore.js'].branchData['1215'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1216'] = [];
  _$jscoverage['/underscore.js'].branchData['1216'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1219'] = [];
  _$jscoverage['/underscore.js'].branchData['1219'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1219'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1236'] = [];
  _$jscoverage['/underscore.js'].branchData['1236'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1237'] = [];
  _$jscoverage['/underscore.js'].branchData['1237'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1237'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1237'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1237'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1238'] = [];
  _$jscoverage['/underscore.js'].branchData['1238'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1243'] = [];
  _$jscoverage['/underscore.js'].branchData['1243'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1243'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1248'] = [];
  _$jscoverage['/underscore.js'].branchData['1248'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1249'] = [];
  _$jscoverage['/underscore.js'].branchData['1249'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1255'] = [];
  _$jscoverage['/underscore.js'].branchData['1255'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1255'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1255'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1255'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1261'] = [];
  _$jscoverage['/underscore.js'].branchData['1261'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1267'] = [];
  _$jscoverage['/underscore.js'].branchData['1267'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1275'] = [];
  _$jscoverage['/underscore.js'].branchData['1275'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1275'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1275'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1277'] = [];
  _$jscoverage['/underscore.js'].branchData['1277'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1277'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1283'] = [];
  _$jscoverage['/underscore.js'].branchData['1283'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1288'] = [];
  _$jscoverage['/underscore.js'].branchData['1288'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1288'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1293'] = [];
  _$jscoverage['/underscore.js'].branchData['1293'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1293'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1293'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1293'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1293'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1298'] = [];
  _$jscoverage['/underscore.js'].branchData['1298'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1303'] = [];
  _$jscoverage['/underscore.js'].branchData['1303'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1309'] = [];
  _$jscoverage['/underscore.js'].branchData['1309'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1309'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1340'] = [];
  _$jscoverage['/underscore.js'].branchData['1340'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1358'] = [];
  _$jscoverage['/underscore.js'].branchData['1358'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1364'] = [];
  _$jscoverage['/underscore.js'].branchData['1364'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1372'] = [];
  _$jscoverage['/underscore.js'].branchData['1372'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1397'] = [];
  _$jscoverage['/underscore.js'].branchData['1397'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1398'] = [];
  _$jscoverage['/underscore.js'].branchData['1398'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1407'] = [];
  _$jscoverage['/underscore.js'].branchData['1407'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1408'] = [];
  _$jscoverage['/underscore.js'].branchData['1408'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1411'] = [];
  _$jscoverage['/underscore.js'].branchData['1411'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1419'] = [];
  _$jscoverage['/underscore.js'].branchData['1419'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1457'] = [];
  _$jscoverage['/underscore.js'].branchData['1457'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1462'] = [];
  _$jscoverage['/underscore.js'].branchData['1462'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1463'] = [];
  _$jscoverage['/underscore.js'].branchData['1463'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1464'] = [];
  _$jscoverage['/underscore.js'].branchData['1464'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1474'] = [];
  _$jscoverage['/underscore.js'].branchData['1474'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1476'] = [];
  _$jscoverage['/underscore.js'].branchData['1476'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1478'] = [];
  _$jscoverage['/underscore.js'].branchData['1478'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1488'] = [];
  _$jscoverage['/underscore.js'].branchData['1488'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1496'] = [];
  _$jscoverage['/underscore.js'].branchData['1496'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1507'] = [];
  _$jscoverage['/underscore.js'].branchData['1507'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1528'] = [];
  _$jscoverage['/underscore.js'].branchData['1528'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1552'] = [];
  _$jscoverage['/underscore.js'].branchData['1552'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1552'][2] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1552'][3] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1552'][4] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1552'][5] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1585'] = [];
  _$jscoverage['/underscore.js'].branchData['1585'][1] = new BranchData();
  _$jscoverage['/underscore.js'].branchData['1585'][2] = new BranchData();
}
_$jscoverage['/underscore.js'].branchData['1585'][2].init(54186, 28, 'typeof define === \'function\'');
function visit368_1585_2(result) {
  _$jscoverage['/underscore.js'].branchData['1585'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1585'][1].init(54186, 42, 'typeof define === \'function\' && define.amd');
function visit367_1585_1(result) {
  _$jscoverage['/underscore.js'].branchData['1585'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1552'][5].init(121, 16, 'obj.length === 0');
function visit366_1552_5(result) {
  _$jscoverage['/underscore.js'].branchData['1552'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1552'][4].init(99, 17, 'name === \'splice\'');
function visit365_1552_4(result) {
  _$jscoverage['/underscore.js'].branchData['1552'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1552'][3].init(79, 16, 'name === \'shift\'');
function visit364_1552_3(result) {
  _$jscoverage['/underscore.js'].branchData['1552'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1552'][2].init(79, 37, 'name === \'shift\' || name === \'splice\'');
function visit363_1552_2(result) {
  _$jscoverage['/underscore.js'].branchData['1552'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1552'][1].init(79, 58, '(name === \'shift\' || name === \'splice\') && obj.length === 0');
function visit362_1552_1(result) {
  _$jscoverage['/underscore.js'].branchData['1552'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1528'][1].init(12, 15, 'instance._chain');
function visit361_1528_1(result) {
  _$jscoverage['/underscore.js'].branchData['1528'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1507'][1].init(1755, 26, 'settings.variable || \'obj\'');
function visit360_1507_1(result) {
  _$jscoverage['/underscore.js'].branchData['1507'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1496'][1].init(29, 26, 'settings.variable || \'obj\'');
function visit359_1496_1(result) {
  _$jscoverage['/underscore.js'].branchData['1496'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1488'][1].init(1200, 18, '!settings.variable');
function visit358_1488_1(result) {
  _$jscoverage['/underscore.js'].branchData['1488'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1478'][1].init(336, 8, 'evaluate');
function visit357_1478_1(result) {
  _$jscoverage['/underscore.js'].branchData['1478'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1476'][1].init(231, 11, 'interpolate');
function visit356_1476_1(result) {
  _$jscoverage['/underscore.js'].branchData['1476'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1474'][1].init(126, 6, 'escape');
function visit355_1474_1(result) {
  _$jscoverage['/underscore.js'].branchData['1474'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1464'][1].init(99, 28, 'settings.evaluate || noMatch');
function visit354_1464_1(result) {
  _$jscoverage['/underscore.js'].branchData['1464'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1463'][1].init(51, 31, 'settings.interpolate || noMatch');
function visit353_1463_1(result) {
  _$jscoverage['/underscore.js'].branchData['1463'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1462'][1].init(8, 26, 'settings.escape || noMatch');
function visit352_1462_1(result) {
  _$jscoverage['/underscore.js'].branchData['1462'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1457'][1].init(9, 24, '!settings && oldSettings');
function visit351_1457_1(result) {
  _$jscoverage['/underscore.js'].branchData['1457'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1419'][1].init(43, 6, 'prefix');
function visit350_1419_1(result) {
  _$jscoverage['/underscore.js'].branchData['1419'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1411'][1].init(126, 19, '_.isFunction(value)');
function visit349_1411_1(result) {
  _$jscoverage['/underscore.js'].branchData['1411'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1408'][1].init(65, 16, 'value === void 0');
function visit348_1408_1(result) {
  _$jscoverage['/underscore.js'].branchData['1408'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1407'][1].init(17, 14, 'object == null');
function visit347_1407_1(result) {
  _$jscoverage['/underscore.js'].branchData['1407'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1398'][1].init(64, 23, 'testRegexp.test(string)');
function visit346_1398_1(result) {
  _$jscoverage['/underscore.js'].branchData['1398'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1397'][1].init(16, 14, 'string == null');
function visit345_1397_1(result) {
  _$jscoverage['/underscore.js'].branchData['1397'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1372'][1].init(46998, 61, 'Date.now || function() {\n  return new Date().getTime();\n}');
function visit344_1372_1(result) {
  _$jscoverage['/underscore.js'].branchData['1372'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1364'][1].init(9, 11, 'max == null');
function visit343_1364_1(result) {
  _$jscoverage['/underscore.js'].branchData['1364'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1358'][1].init(109, 5, 'i < n');
function visit342_1358_1(result) {
  _$jscoverage['/underscore.js'].branchData['1358'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1340'][1].init(12, 11, 'obj == null');
function visit341_1340_1(result) {
  _$jscoverage['/underscore.js'].branchData['1340'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1309'][2].init(12, 11, 'obj != null');
function visit340_1309_2(result) {
  _$jscoverage['/underscore.js'].branchData['1309'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1309'][1].init(12, 44, 'obj != null && hasOwnProperty.call(obj, key)');
function visit339_1309_1(result) {
  _$jscoverage['/underscore.js'].branchData['1309'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1303'][1].init(12, 14, 'obj === void 0');
function visit338_1303_1(result) {
  _$jscoverage['/underscore.js'].branchData['1303'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1298'][1].init(12, 12, 'obj === null');
function visit337_1298_1(result) {
  _$jscoverage['/underscore.js'].branchData['1298'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1293'][5].init(45, 41, 'toString.call(obj) === \'[object Boolean]\'');
function visit336_1293_5(result) {
  _$jscoverage['/underscore.js'].branchData['1293'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1293'][4].init(28, 13, 'obj === false');
function visit335_1293_4(result) {
  _$jscoverage['/underscore.js'].branchData['1293'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1293'][3].init(28, 58, 'obj === false || toString.call(obj) === \'[object Boolean]\'');
function visit334_1293_3(result) {
  _$jscoverage['/underscore.js'].branchData['1293'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1293'][2].init(12, 12, 'obj === true');
function visit333_1293_2(result) {
  _$jscoverage['/underscore.js'].branchData['1293'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1293'][1].init(12, 74, 'obj === true || obj === false || toString.call(obj) === \'[object Boolean]\'');
function visit332_1293_1(result) {
  _$jscoverage['/underscore.js'].branchData['1293'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1288'][2].init(31, 12, 'obj !== +obj');
function visit331_1288_2(result) {
  _$jscoverage['/underscore.js'].branchData['1288'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1288'][1].init(12, 31, '_.isNumber(obj) && obj !== +obj');
function visit330_1288_1(result) {
  _$jscoverage['/underscore.js'].branchData['1288'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1283'][1].init(12, 40, 'isFinite(obj) && !isNaN(parseFloat(obj))');
function visit329_1283_1(result) {
  _$jscoverage['/underscore.js'].branchData['1283'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1277'][2].init(14, 24, 'typeof obj == \'function\'');
function visit328_1277_2(result) {
  _$jscoverage['/underscore.js'].branchData['1277'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1277'][1].init(14, 33, 'typeof obj == \'function\' || false');
function visit327_1277_1(result) {
  _$jscoverage['/underscore.js'].branchData['1277'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1275'][3].init(44371, 28, 'typeof Int8Array != \'object\'');
function visit326_1275_3(result) {
  _$jscoverage['/underscore.js'].branchData['1275'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1275'][2].init(44343, 24, 'typeof /./ != \'function\'');
function visit325_1275_2(result) {
  _$jscoverage['/underscore.js'].branchData['1275'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1275'][1].init(44343, 56, 'typeof /./ != \'function\' && typeof Int8Array != \'object\'');
function visit324_1275_1(result) {
  _$jscoverage['/underscore.js'].branchData['1275'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1267'][1].init(44097, 25, '!_.isArguments(arguments)');
function visit323_1267_1(result) {
  _$jscoverage['/underscore.js'].branchData['1267'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1261'][1].init(14, 46, 'toString.call(obj) === \'[object \' + name + \']\'');
function visit322_1261_1(result) {
  _$jscoverage['/underscore.js'].branchData['1261'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1255'][4].init(62, 17, 'type === \'object\'');
function visit321_1255_4(result) {
  _$jscoverage['/underscore.js'].branchData['1255'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1255'][3].init(62, 26, 'type === \'object\' && !!obj');
function visit320_1255_3(result) {
  _$jscoverage['/underscore.js'].branchData['1255'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1255'][2].init(39, 19, 'type === \'function\'');
function visit319_1255_2(result) {
  _$jscoverage['/underscore.js'].branchData['1255'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1255'][1].init(39, 49, 'type === \'function\' || type === \'object\' && !!obj');
function visit318_1255_1(result) {
  _$jscoverage['/underscore.js'].branchData['1255'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1249'][1].init(12, 39, 'toString.call(obj) === \'[object Array]\'');
function visit317_1249_1(result) {
  _$jscoverage['/underscore.js'].branchData['1249'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1248'][1].init(43394, 88, 'nativeIsArray || function(obj) {\n  return toString.call(obj) === \'[object Array]\';\n}');
function visit316_1248_1(result) {
  _$jscoverage['/underscore.js'].branchData['1248'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1243'][2].init(22, 18, 'obj.nodeType === 1');
function visit315_1243_2(result) {
  _$jscoverage['/underscore.js'].branchData['1243'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1243'][1].init(15, 25, 'obj && obj.nodeType === 1');
function visit314_1243_1(result) {
  _$jscoverage['/underscore.js'].branchData['1243'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1238'][1].init(158, 24, '_.keys(obj).length === 0');
function visit313_1238_1(result) {
  _$jscoverage['/underscore.js'].branchData['1238'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1237'][4].init(129, 16, 'obj.length === 0');
function visit312_1237_4(result) {
  _$jscoverage['/underscore.js'].branchData['1237'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1237'][3].init(82, 37, '_.isString(obj) || _.isArguments(obj)');
function visit311_1237_3(result) {
  _$jscoverage['/underscore.js'].branchData['1237'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1237'][2].init(64, 55, '_.isArray(obj) || _.isString(obj) || _.isArguments(obj)');
function visit310_1237_2(result) {
  _$jscoverage['/underscore.js'].branchData['1237'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1237'][1].init(43, 77, 'isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))');
function visit309_1237_1(result) {
  _$jscoverage['/underscore.js'].branchData['1237'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1236'][1].init(9, 11, 'obj == null');
function visit308_1236_1(result) {
  _$jscoverage['/underscore.js'].branchData['1236'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1219'][2].init(79, 51, '_.has(b, key) && eq(a[key], b[key], aStack, bStack)');
function visit307_1219_2(result) {
  _$jscoverage['/underscore.js'].branchData['1219'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1219'][1].init(77, 54, '!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))');
function visit306_1219_1(result) {
  _$jscoverage['/underscore.js'].branchData['1219'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1216'][1].init(263, 8, 'length--');
function visit305_1216_1(result) {
  _$jscoverage['/underscore.js'].branchData['1216'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1215'][1].init(207, 27, '_.keys(b).length !== length');
function visit304_1215_1(result) {
  _$jscoverage['/underscore.js'].branchData['1215'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1208'][1].init(13, 41, '!eq(a[length], b[length], aStack, bStack)');
function visit303_1208_1(result) {
  _$jscoverage['/underscore.js'].branchData['1208'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1207'][1].init(232, 8, 'length--');
function visit302_1207_1(result) {
  _$jscoverage['/underscore.js'].branchData['1207'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1205'][1].init(115, 19, 'length !== b.length');
function visit301_1205_1(result) {
  _$jscoverage['/underscore.js'].branchData['1205'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1202'][1].init(2632, 9, 'areArrays');
function visit300_1202_1(result) {
  _$jscoverage['/underscore.js'].branchData['1202'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1194'][2].init(154, 20, 'bStack[length] === b');
function visit299_1194_2(result) {
  _$jscoverage['/underscore.js'].branchData['1194'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1194'][1].init(125, 20, 'aStack[length] === a');
function visit298_1194_1(result) {
  _$jscoverage['/underscore.js'].branchData['1194'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1191'][1].init(2279, 8, 'length--');
function visit297_1191_1(result) {
  _$jscoverage['/underscore.js'].branchData['1191'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1189'][1].init(2222, 12, 'bStack || []');
function visit296_1189_1(result) {
  _$jscoverage['/underscore.js'].branchData['1189'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1188'][1].init(2195, 12, 'aStack || []');
function visit295_1188_1(result) {
  _$jscoverage['/underscore.js'].branchData['1188'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1179'][1].init(158, 40, '\'constructor\' in a && \'constructor\' in b');
function visit294_1179_1(result) {
  _$jscoverage['/underscore.js'].branchData['1179'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1178'][1].init(56, 45, '_.isFunction(bCtor) && bCtor instanceof bCtor');
function visit293_1178_1(result) {
  _$jscoverage['/underscore.js'].branchData['1178'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1177'][5].init(309, 102, 'aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor');
function visit292_1177_5(result) {
  _$jscoverage['/underscore.js'].branchData['1177'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1177'][4].init(286, 125, '_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor');
function visit291_1177_4(result) {
  _$jscoverage['/underscore.js'].branchData['1177'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1177'][3].init(284, 200, '!(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor) && (\'constructor\' in a && \'constructor\' in b)');
function visit290_1177_3(result) {
  _$jscoverage['/underscore.js'].branchData['1177'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1177'][2].init(265, 15, 'aCtor !== bCtor');
function visit289_1177_2(result) {
  _$jscoverage['/underscore.js'].branchData['1177'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1177'][1].init(265, 219, 'aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor) && (\'constructor\' in a && \'constructor\' in b)');
function visit288_1177_1(result) {
  _$jscoverage['/underscore.js'].branchData['1177'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1172'][3].init(35, 20, 'typeof b != \'object\'');
function visit287_1172_3(result) {
  _$jscoverage['/underscore.js'].branchData['1172'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1172'][2].init(11, 20, 'typeof a != \'object\'');
function visit286_1172_2(result) {
  _$jscoverage['/underscore.js'].branchData['1172'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1172'][1].init(11, 44, 'typeof a != \'object\' || typeof b != \'object\'');
function visit285_1172_1(result) {
  _$jscoverage['/underscore.js'].branchData['1172'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1171'][1].init(1351, 10, '!areArrays');
function visit284_1171_1(result) {
  _$jscoverage['/underscore.js'].branchData['1171'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1170'][1].init(1311, 30, 'className === \'[object Array]\'');
function visit283_1170_1(result) {
  _$jscoverage['/underscore.js'].branchData['1170'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1167'][1].init(270, 9, '+a === +b');
function visit282_1167_1(result) {
  _$jscoverage['/underscore.js'].branchData['1167'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1161'][3].init(277, 9, '+a === +b');
function visit281_1161_3(result) {
  _$jscoverage['/underscore.js'].branchData['1161'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1161'][2].init(258, 16, '1 / +a === 1 / b');
function visit280_1161_2(result) {
  _$jscoverage['/underscore.js'].branchData['1161'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1161'][1].init(247, 8, '+a === 0');
function visit279_1161_1(result) {
  _$jscoverage['/underscore.js'].branchData['1161'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1159'][2].init(150, 9, '+b !== +b');
function visit278_1159_2(result) {
  _$jscoverage['/underscore.js'].branchData['1159'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1159'][1].init(132, 9, '+a !== +a');
function visit277_1159_1(result) {
  _$jscoverage['/underscore.js'].branchData['1159'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1155'][1].init(175, 17, '\'\' + a === \'\' + b');
function visit276_1155_1(result) {
  _$jscoverage['/underscore.js'].branchData['1155'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1147'][1].init(196, 30, 'className !== toString.call(b)');
function visit275_1147_1(result) {
  _$jscoverage['/underscore.js'].branchData['1147'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1144'][1].init(84, 14, 'b instanceof _');
function visit274_1144_1(result) {
  _$jscoverage['/underscore.js'].branchData['1144'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1143'][1].init(44, 14, 'a instanceof _');
function visit273_1143_1(result) {
  _$jscoverage['/underscore.js'].branchData['1143'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1136'][5].init(531, 21, 'typeof b !== \'object\'');
function visit272_1136_5(result) {
  _$jscoverage['/underscore.js'].branchData['1136'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1136'][4].init(510, 17, 'type !== \'object\'');
function visit271_1136_4(result) {
  _$jscoverage['/underscore.js'].branchData['1136'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1136'][3].init(510, 42, 'type !== \'object\' && typeof b !== \'object\'');
function visit270_1136_3(result) {
  _$jscoverage['/underscore.js'].branchData['1136'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1136'][2].init(487, 19, 'type !== \'function\'');
function visit269_1136_2(result) {
  _$jscoverage['/underscore.js'].branchData['1136'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1136'][1].init(487, 65, 'type !== \'function\' && type !== \'object\' && typeof b !== \'object\'');
function visit268_1136_1(result) {
  _$jscoverage['/underscore.js'].branchData['1136'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1133'][2].init(413, 7, 'b !== b');
function visit267_1133_2(result) {
  _$jscoverage['/underscore.js'].branchData['1133'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1133'][1].init(397, 7, 'a !== a');
function visit266_1133_1(result) {
  _$jscoverage['/underscore.js'].branchData['1133'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1131'][4].init(331, 7, 'a === b');
function visit265_1131_4(result) {
  _$jscoverage['/underscore.js'].branchData['1131'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1131'][3].init(313, 9, 'b == null');
function visit264_1131_3(result) {
  _$jscoverage['/underscore.js'].branchData['1131'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1131'][2].init(300, 9, 'a == null');
function visit263_1131_2(result) {
  _$jscoverage['/underscore.js'].branchData['1131'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1131'][1].init(300, 22, 'a == null || b == null');
function visit262_1131_1(result) {
  _$jscoverage['/underscore.js'].branchData['1131'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1129'][4].init(206, 15, '1 / a === 1 / b');
function visit261_1129_4(result) {
  _$jscoverage['/underscore.js'].branchData['1129'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1129'][3].init(195, 7, 'a !== 0');
function visit260_1129_3(result) {
  _$jscoverage['/underscore.js'].branchData['1129'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1129'][2].init(195, 26, 'a !== 0 || 1 / a === 1 / b');
function visit259_1129_2(result) {
  _$jscoverage['/underscore.js'].branchData['1129'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1129'][1].init(179, 7, 'a === b');
function visit258_1129_1(result) {
  _$jscoverage['/underscore.js'].branchData['1129'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1118'][2].init(36, 23, 'attrs[key] !== obj[key]');
function visit257_1118_2(result) {
  _$jscoverage['/underscore.js'].branchData['1118'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1118'][1].init(36, 40, 'attrs[key] !== obj[key] || !(key in obj)');
function visit256_1118_1(result) {
  _$jscoverage['/underscore.js'].branchData['1118'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1116'][1].init(143, 10, 'i < length');
function visit255_1116_1(result) {
  _$jscoverage['/underscore.js'].branchData['1116'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1114'][1].init(61, 14, 'object == null');
function visit254_1114_1(result) {
  _$jscoverage['/underscore.js'].branchData['1114'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1100'][1].init(50, 14, '_.isArray(obj)');
function visit253_1100_1(result) {
  _$jscoverage['/underscore.js'].branchData['1100'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1099'][1].init(9, 16, '!_.isObject(obj)');
function visit252_1099_1(result) {
  _$jscoverage['/underscore.js'].branchData['1099'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1093'][1].init(49, 5, 'props');
function visit251_1093_1(result) {
  _$jscoverage['/underscore.js'].branchData['1093'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1075'][1].init(48, 15, 'keys.length > 1');
function visit250_1075_1(result) {
  _$jscoverage['/underscore.js'].branchData['1075'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1073'][1].init(46, 22, '_.isFunction(iteratee)');
function visit249_1073_1(result) {
  _$jscoverage['/underscore.js'].branchData['1073'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1065'][1].init(64, 25, 'iteratee(value, key, obj)');
function visit248_1065_1(result) {
  _$jscoverage['/underscore.js'].branchData['1065'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1062'][1].init(365, 10, 'i < length');
function visit247_1062_1(result) {
  _$jscoverage['/underscore.js'].branchData['1062'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1055'][1].init(11, 15, 'keys.length > 1');
function visit246_1055_1(result) {
  _$jscoverage['/underscore.js'].branchData['1055'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1054'][1].init(86, 22, '_.isFunction(iteratee)');
function visit245_1054_1(result) {
  _$jscoverage['/underscore.js'].branchData['1054'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1053'][1].init(50, 11, 'obj == null');
function visit244_1053_1(result) {
  _$jscoverage['/underscore.js'].branchData['1053'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1041'][1].init(32, 29, 'predicate(obj[key], key, obj)');
function visit243_1041_1(result) {
  _$jscoverage['/underscore.js'].branchData['1041'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1039'][1].init(116, 10, 'i < length');
function visit242_1039_1(result) {
  _$jscoverage['/underscore.js'].branchData['1039'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1021'][2].init(62, 19, 'obj[key] === void 0');
function visit241_1021_2(result) {
  _$jscoverage['/underscore.js'].branchData['1021'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1021'][1].init(44, 37, '!undefinedOnly || obj[key] === void 0');
function visit240_1021_1(result) {
  _$jscoverage['/underscore.js'].branchData['1021'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1019'][1].init(130, 5, 'i < l');
function visit239_1019_1(result) {
  _$jscoverage['/underscore.js'].branchData['1019'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1015'][1].init(113, 14, 'index < length');
function visit238_1015_1(result) {
  _$jscoverage['/underscore.js'].branchData['1015'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1014'][3].init(62, 11, 'obj == null');
function visit237_1014_3(result) {
  _$jscoverage['/underscore.js'].branchData['1014'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1014'][2].init(48, 10, 'length < 2');
function visit236_1014_2(result) {
  _$jscoverage['/underscore.js'].branchData['1014'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1014'][1].init(48, 25, 'length < 2 || obj == null');
function visit235_1014_1(result) {
  _$jscoverage['/underscore.js'].branchData['1014'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['1005'][1].init(11, 22, '_.isFunction(obj[key])');
function visit234_1005_1(result) {
  _$jscoverage['/underscore.js'].branchData['1005'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['994'][1].init(92, 10, 'i < length');
function visit233_994_1(result) {
  _$jscoverage['/underscore.js'].branchData['994'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['984'][1].init(110, 10, 'i < length');
function visit232_984_1(result) {
  _$jscoverage['/underscore.js'].branchData['984'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['972'][1].init(139, 14, 'index < length');
function visit231_972_1(result) {
  _$jscoverage['/underscore.js'].branchData['972'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['959'][1].init(111, 10, 'i < length');
function visit230_959_1(result) {
  _$jscoverage['/underscore.js'].branchData['959'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['950'][1].init(127, 10, 'hasEnumBug');
function visit229_950_1(result) {
  _$jscoverage['/underscore.js'].branchData['950'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['946'][1].init(9, 16, '!_.isObject(obj)');
function visit228_946_1(result) {
  _$jscoverage['/underscore.js'].branchData['946'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['940'][1].init(192, 10, 'hasEnumBug');
function visit227_940_1(result) {
  _$jscoverage['/underscore.js'].branchData['940'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['938'][1].init(130, 15, '_.has(obj, key)');
function visit226_938_1(result) {
  _$jscoverage['/underscore.js'].branchData['938'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['936'][1].init(46, 10, 'nativeKeys');
function visit225_936_1(result) {
  _$jscoverage['/underscore.js'].branchData['936'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['935'][1].init(9, 16, '!_.isObject(obj)');
function visit224_935_1(result) {
  _$jscoverage['/underscore.js'].branchData['935'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['926'][3].init(71, 25, 'obj[prop] !== proto[prop]');
function visit223_926_3(result) {
  _$jscoverage['/underscore.js'].branchData['926'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['926'][2].init(71, 52, 'obj[prop] !== proto[prop] && !_.contains(keys, prop)');
function visit222_926_2(result) {
  _$jscoverage['/underscore.js'].branchData['926'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['926'][1].init(56, 67, 'prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)');
function visit221_926_1(result) {
  _$jscoverage['/underscore.js'].branchData['926'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['924'][1].init(319, 12, 'nonEnumIdx--');
function visit220_924_1(result) {
  _$jscoverage['/underscore.js'].branchData['924'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['922'][1].init(245, 43, '_.has(obj, prop) && !_.contains(keys, prop)');
function visit219_922_1(result) {
  _$jscoverage['/underscore.js'].branchData['922'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['918'][2].init(104, 50, '_.isFunction(constructor) && constructor.prototype');
function visit218_918_2(result) {
  _$jscoverage['/underscore.js'].branchData['918'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['918'][1].init(104, 62, '_.isFunction(constructor) && constructor.prototype || ObjProto');
function visit217_918_1(result) {
  _$jscoverage['/underscore.js'].branchData['918'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['896'][1].init(88, 10, 'times <= 1');
function visit216_896_1(result) {
  _$jscoverage['/underscore.js'].branchData['896'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['893'][1].init(11, 11, '--times > 0');
function visit215_893_1(result) {
  _$jscoverage['/underscore.js'].branchData['893'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['883'][1].init(11, 11, '--times < 1');
function visit214_883_1(result) {
  _$jscoverage['/underscore.js'].branchData['883'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['875'][1].init(90, 3, 'i--');
function visit213_875_1(result) {
  _$jscoverage['/underscore.js'].branchData['875'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['844'][1].init(182, 7, 'callNow');
function visit212_844_1(result) {
  _$jscoverage['/underscore.js'].branchData['844'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['843'][1].init(127, 8, '!timeout');
function visit211_843_1(result) {
  _$jscoverage['/underscore.js'].branchData['843'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['842'][1].init(94, 21, 'immediate && !timeout');
function visit210_842_1(result) {
  _$jscoverage['/underscore.js'].branchData['842'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['833'][1].init(61, 8, '!timeout');
function visit209_833_1(result) {
  _$jscoverage['/underscore.js'].branchData['833'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['831'][1].init(37, 10, '!immediate');
function visit208_831_1(result) {
  _$jscoverage['/underscore.js'].branchData['831'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['827'][3].init(65, 9, 'last >= 0');
function visit207_827_3(result) {
  _$jscoverage['/underscore.js'].branchData['827'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['827'][2].init(50, 11, 'last < wait');
function visit206_827_2(result) {
  _$jscoverage['/underscore.js'].branchData['827'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['827'][1].init(50, 24, 'last < wait && last >= 0');
function visit205_827_1(result) {
  _$jscoverage['/underscore.js'].branchData['827'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['810'][2].init(468, 26, 'options.trailing !== false');
function visit204_810_2(result) {
  _$jscoverage['/underscore.js'].branchData['810'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['810'][1].init(456, 38, '!timeout && options.trailing !== false');
function visit203_810_1(result) {
  _$jscoverage['/underscore.js'].branchData['810'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['809'][1].init(173, 8, '!timeout');
function visit202_809_1(result) {
  _$jscoverage['/underscore.js'].branchData['809'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['803'][1].init(13, 7, 'timeout');
function visit201_803_1(result) {
  _$jscoverage['/underscore.js'].branchData['803'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['802'][3].init(213, 16, 'remaining > wait');
function visit200_802_3(result) {
  _$jscoverage['/underscore.js'].branchData['802'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['802'][2].init(195, 14, 'remaining <= 0');
function visit199_802_2(result) {
  _$jscoverage['/underscore.js'].branchData['802'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['802'][1].init(195, 34, 'remaining <= 0 || remaining > wait');
function visit198_802_1(result) {
  _$jscoverage['/underscore.js'].branchData['802'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['798'][2].init(49, 25, 'options.leading === false');
function visit197_798_2(result) {
  _$jscoverage['/underscore.js'].branchData['798'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['798'][1].init(36, 38, '!previous && options.leading === false');
function visit196_798_1(result) {
  _$jscoverage['/underscore.js'].branchData['798'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['794'][1].init(133, 8, '!timeout');
function visit195_794_1(result) {
  _$jscoverage['/underscore.js'].branchData['794'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['791'][1].init(18, 25, 'options.leading === false');
function visit194_791_1(result) {
  _$jscoverage['/underscore.js'].branchData['791'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['789'][1].init(86, 8, '!options');
function visit193_789_1(result) {
  _$jscoverage['/underscore.js'].branchData['789'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['761'][1].init(117, 22, '!_.has(cache, address)');
function visit192_761_1(result) {
  _$jscoverage['/underscore.js'].branchData['761'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['760'][1].init(60, 6, 'hasher');
function visit191_760_1(result) {
  _$jscoverage['/underscore.js'].branchData['760'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['750'][1].init(158, 7, 'index--');
function visit190_750_1(result) {
  _$jscoverage['/underscore.js'].branchData['750'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['749'][1].init(78, 9, 'index < 1');
function visit189_749_1(result) {
  _$jscoverage['/underscore.js'].branchData['749'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['735'][1].init(233, 27, 'position < arguments.length');
function visit188_735_1(result) {
  _$jscoverage['/underscore.js'].branchData['735'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['733'][1].init(19, 28, 'boundArgs[i] === placeholder');
function visit187_733_1(result) {
  _$jscoverage['/underscore.js'].branchData['733'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['732'][1].init(106, 10, 'i < length');
function visit186_732_1(result) {
  _$jscoverage['/underscore.js'].branchData['732'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['716'][1].init(9, 19, '!_.isFunction(func)');
function visit185_716_1(result) {
  _$jscoverage['/underscore.js'].branchData['716'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['708'][1].init(193, 18, '_.isObject(result)');
function visit184_708_1(result) {
  _$jscoverage['/underscore.js'].branchData['708'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['705'][1].init(9, 38, '!(callingContext instanceof boundFunc)');
function visit183_705_1(result) {
  _$jscoverage['/underscore.js'].branchData['705'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['692'][1].init(214, 12, 'idx < length');
function visit182_692_1(result) {
  _$jscoverage['/underscore.js'].branchData['692'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['687'][1].init(84, 9, 'step || 1');
function visit181_687_1(result) {
  _$jscoverage['/underscore.js'].branchData['687'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['684'][1].init(14, 10, 'start || 0');
function visit180_684_1(result) {
  _$jscoverage['/underscore.js'].branchData['684'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['683'][1].init(9, 12, 'stop == null');
function visit179_683_1(result) {
  _$jscoverage['/underscore.js'].branchData['683'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['666'][1].init(13, 19, 'array[idx] === item');
function visit178_666_1(result) {
  _$jscoverage['/underscore.js'].branchData['666'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['665'][4].init(607, 12, 'idx < length');
function visit177_665_4(result) {
  _$jscoverage['/underscore.js'].branchData['665'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['665'][3].init(595, 8, 'idx >= 0');
function visit176_665_3(result) {
  _$jscoverage['/underscore.js'].branchData['665'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['665'][2].init(595, 24, 'idx >= 0 && idx < length');
function visit175_665_2(result) {
  _$jscoverage['/underscore.js'].branchData['665'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['665'][1].init(569, 7, 'dir > 0');
function visit174_665_1(result) {
  _$jscoverage['/underscore.js'].branchData['665'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['663'][1].init(84, 8, 'idx >= 0');
function visit173_663_1(result) {
  _$jscoverage['/underscore.js'].branchData['663'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['661'][1].init(419, 13, 'item !== item');
function visit172_661_1(result) {
  _$jscoverage['/underscore.js'].branchData['661'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['659'][1].init(56, 19, 'array[idx] === item');
function visit171_659_1(result) {
  _$jscoverage['/underscore.js'].branchData['659'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['657'][2].init(298, 13, 'idx && length');
function visit170_657_2(result) {
  _$jscoverage['/underscore.js'].branchData['657'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['657'][1].init(283, 28, 'sortedIndex && idx && length');
function visit169_657_1(result) {
  _$jscoverage['/underscore.js'].branchData['657'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['655'][1].init(20, 8, 'idx >= 0');
function visit168_655_1(result) {
  _$jscoverage['/underscore.js'].branchData['655'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['653'][1].init(15, 8, 'idx >= 0');
function visit167_653_1(result) {
  _$jscoverage['/underscore.js'].branchData['653'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['652'][1].init(13, 7, 'dir > 0');
function visit166_652_1(result) {
  _$jscoverage['/underscore.js'].branchData['652'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['651'][1].init(55, 22, 'typeof idx == \'number\'');
function visit165_651_1(result) {
  _$jscoverage['/underscore.js'].branchData['651'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['642'][1].init(57, 28, 'iteratee(array[mid]) < value');
function visit164_642_1(result) {
  _$jscoverage['/underscore.js'].branchData['642'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['640'][1].init(126, 10, 'low < high');
function visit163_640_1(result) {
  _$jscoverage['/underscore.js'].branchData['640'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['624'][1].init(13, 37, 'predicate(array[index], index, array)');
function visit162_624_1(result) {
  _$jscoverage['/underscore.js'].branchData['624'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['623'][3].init(151, 14, 'index < length');
function visit161_623_3(result) {
  _$jscoverage['/underscore.js'].branchData['623'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['623'][2].init(137, 10, 'index >= 0');
function visit160_623_2(result) {
  _$jscoverage['/underscore.js'].branchData['623'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['623'][1].init(137, 28, 'index >= 0 && index < length');
function visit159_623_1(result) {
  _$jscoverage['/underscore.js'].branchData['623'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['622'][1].init(98, 7, 'dir > 0');
function visit158_622_1(result) {
  _$jscoverage['/underscore.js'].branchData['622'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['608'][1].init(11, 6, 'values');
function visit157_608_1(result) {
  _$jscoverage['/underscore.js'].branchData['608'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['607'][1].init(68, 10, 'i < length');
function visit156_607_1(result) {
  _$jscoverage['/underscore.js'].branchData['607'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['592'][1].init(121, 14, 'index < length');
function visit155_592_1(result) {
  _$jscoverage['/underscore.js'].branchData['592'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['589'][2].init(18, 39, 'array && _.max(array, getLength).length');
function visit154_589_2(result) {
  _$jscoverage['/underscore.js'].branchData['589'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['589'][1].init(18, 44, 'array && _.max(array, getLength).length || 0');
function visit153_589_1(result) {
  _$jscoverage['/underscore.js'].branchData['589'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['572'][1].init(198, 16, 'j === argsLength');
function visit152_572_1(result) {
  _$jscoverage['/underscore.js'].branchData['572'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['570'][1].init(13, 31, '!_.contains(arguments[j], item)');
function visit151_570_1(result) {
  _$jscoverage['/underscore.js'].branchData['570'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['569'][1].init(105, 14, 'j < argsLength');
function visit150_569_1(result) {
  _$jscoverage['/underscore.js'].branchData['569'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['567'][1].init(38, 24, '_.contains(result, item)');
function visit149_567_1(result) {
  _$jscoverage['/underscore.js'].branchData['567'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['565'][1].init(108, 10, 'i < length');
function visit148_565_1(result) {
  _$jscoverage['/underscore.js'].branchData['565'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['547'][1].init(362, 26, '!_.contains(result, value)');
function visit147_547_1(result) {
  _$jscoverage['/underscore.js'].branchData['547'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['543'][1].init(13, 27, '!_.contains(seen, computed)');
function visit146_543_1(result) {
  _$jscoverage['/underscore.js'].branchData['543'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['542'][1].init(218, 8, 'iteratee');
function visit145_542_1(result) {
  _$jscoverage['/underscore.js'].branchData['542'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['540'][2].init(19, 17, 'seen !== computed');
function visit144_540_2(result) {
  _$jscoverage['/underscore.js'].branchData['540'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['540'][1].init(13, 23, '!i || seen !== computed');
function visit143_540_1(result) {
  _$jscoverage['/underscore.js'].branchData['540'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['539'][1].init(106, 8, 'isSorted');
function visit142_539_1(result) {
  _$jscoverage['/underscore.js'].branchData['539'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['538'][1].init(42, 8, 'iteratee');
function visit141_538_1(result) {
  _$jscoverage['/underscore.js'].branchData['538'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['536'][1].init(265, 10, 'i < length');
function visit140_536_1(result) {
  _$jscoverage['/underscore.js'].branchData['536'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['533'][1].init(126, 16, 'iteratee != null');
function visit139_533_1(result) {
  _$jscoverage['/underscore.js'].branchData['533'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['528'][1].init(9, 22, '!_.isBoolean(isSorted)');
function visit138_528_1(result) {
  _$jscoverage['/underscore.js'].branchData['528'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['507'][1].init(413, 7, '!strict');
function visit137_507_1(result) {
  _$jscoverage['/underscore.js'].branchData['507'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['502'][1].init(59, 7, 'j < len');
function visit136_502_1(result) {
  _$jscoverage['/underscore.js'].branchData['502'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['500'][1].init(74, 7, 'shallow');
function visit135_500_1(result) {
  _$jscoverage['/underscore.js'].branchData['500'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['498'][2].init(62, 40, '_.isArray(value) || _.isArguments(value)');
function visit134_498_2(result) {
  _$jscoverage['/underscore.js'].branchData['498'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['498'][1].init(39, 64, 'isArrayLike(value) && (_.isArray(value) || _.isArguments(value))');
function visit133_498_1(result) {
  _$jscoverage['/underscore.js'].branchData['498'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['496'][1].init(104, 10, 'i < length');
function visit132_496_1(result) {
  _$jscoverage['/underscore.js'].branchData['496'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['494'][1].init(14, 12, 'output || []');
function visit131_494_1(result) {
  _$jscoverage['/underscore.js'].branchData['494'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['484'][2].init(30, 9, 'n == null');
function visit130_484_2(result) {
  _$jscoverage['/underscore.js'].branchData['484'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['484'][1].init(30, 18, 'n == null || guard');
function visit129_484_1(result) {
  _$jscoverage['/underscore.js'].branchData['484'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['476'][2].init(47, 9, 'n == null');
function visit128_476_2(result) {
  _$jscoverage['/underscore.js'].branchData['476'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['476'][1].init(47, 18, 'n == null || guard');
function visit127_476_1(result) {
  _$jscoverage['/underscore.js'].branchData['476'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['475'][1].init(9, 13, 'array == null');
function visit126_475_1(result) {
  _$jscoverage['/underscore.js'].branchData['475'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['469'][2].init(61, 9, 'n == null');
function visit125_469_2(result) {
  _$jscoverage['/underscore.js'].branchData['469'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['469'][1].init(61, 18, 'n == null || guard');
function visit124_469_1(result) {
  _$jscoverage['/underscore.js'].branchData['469'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['461'][2].init(47, 9, 'n == null');
function visit123_461_2(result) {
  _$jscoverage['/underscore.js'].branchData['461'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['461'][1].init(47, 18, 'n == null || guard');
function visit122_461_1(result) {
  _$jscoverage['/underscore.js'].branchData['461'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['460'][1].init(9, 13, 'array == null');
function visit121_460_1(result) {
  _$jscoverage['/underscore.js'].branchData['460'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['450'][1].init(12, 4, 'pass');
function visit120_450_1(result) {
  _$jscoverage['/underscore.js'].branchData['450'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['444'][1].init(43, 16, 'isArrayLike(obj)');
function visit119_444_1(result) {
  _$jscoverage['/underscore.js'].branchData['444'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['443'][1].init(9, 11, 'obj == null');
function visit118_443_1(result) {
  _$jscoverage['/underscore.js'].branchData['443'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['437'][1].init(82, 16, 'isArrayLike(obj)');
function visit117_437_1(result) {
  _$jscoverage['/underscore.js'].branchData['437'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['436'][1].init(34, 14, '_.isArray(obj)');
function visit116_436_1(result) {
  _$jscoverage['/underscore.js'].branchData['436'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['435'][1].init(9, 4, '!obj');
function visit115_435_1(result) {
  _$jscoverage['/underscore.js'].branchData['435'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['430'][1].init(9, 18, '_.has(result, key)');
function visit114_430_1(result) {
  _$jscoverage['/underscore.js'].branchData['430'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['417'][1].init(9, 18, '_.has(result, key)');
function visit113_417_1(result) {
  _$jscoverage['/underscore.js'].branchData['417'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['404'][1].init(20, 9, 'partition');
function visit112_404_1(result) {
  _$jscoverage['/underscore.js'].branchData['404'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['395'][3].init(67, 12, 'b === void 0');
function visit111_395_3(result) {
  _$jscoverage['/underscore.js'].branchData['395'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['395'][2].init(58, 5, 'a < b');
function visit110_395_2(result) {
  _$jscoverage['/underscore.js'].branchData['395'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['395'][1].init(58, 21, 'a < b || b === void 0');
function visit109_395_1(result) {
  _$jscoverage['/underscore.js'].branchData['395'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['394'][3].init(22, 12, 'a === void 0');
function visit108_394_3(result) {
  _$jscoverage['/underscore.js'].branchData['394'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['394'][2].init(13, 5, 'a > b');
function visit107_394_2(result) {
  _$jscoverage['/underscore.js'].branchData['394'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['394'][1].init(13, 21, 'a > b || a === void 0');
function visit106_394_1(result) {
  _$jscoverage['/underscore.js'].branchData['394'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['393'][1].init(70, 7, 'a !== b');
function visit105_393_1(result) {
  _$jscoverage['/underscore.js'].branchData['393'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['372'][1].init(326, 9, 'index < n');
function visit104_372_1(result) {
  _$jscoverage['/underscore.js'].branchData['372'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['368'][1].init(148, 16, 'isArrayLike(obj)');
function visit103_368_1(result) {
  _$jscoverage['/underscore.js'].branchData['368'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['365'][1].init(11, 17, '!isArrayLike(obj)');
function visit102_365_1(result) {
  _$jscoverage['/underscore.js'].branchData['365'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['364'][2].init(9, 9, 'n == null');
function visit101_364_2(result) {
  _$jscoverage['/underscore.js'].branchData['364'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['364'][1].init(9, 18, 'n == null || guard');
function visit100_364_1(result) {
  _$jscoverage['/underscore.js'].branchData['364'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['345'][5].init(110, 19, 'result === Infinity');
function visit99_345_5(result) {
  _$jscoverage['/underscore.js'].branchData['345'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['345'][4].init(85, 21, 'computed === Infinity');
function visit98_345_4(result) {
  _$jscoverage['/underscore.js'].branchData['345'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['345'][3].init(85, 44, 'computed === Infinity && result === Infinity');
function visit97_345_3(result) {
  _$jscoverage['/underscore.js'].branchData['345'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['345'][2].init(58, 23, 'computed < lastComputed');
function visit96_345_2(result) {
  _$jscoverage['/underscore.js'].branchData['345'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['345'][1].init(58, 71, 'computed < lastComputed || computed === Infinity && result === Infinity');
function visit95_345_1(result) {
  _$jscoverage['/underscore.js'].branchData['345'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['337'][1].init(37, 14, 'value < result');
function visit94_337_1(result) {
  _$jscoverage['/underscore.js'].branchData['337'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['335'][1].init(96, 10, 'i < length');
function visit93_335_1(result) {
  _$jscoverage['/underscore.js'].branchData['335'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['334'][1].init(13, 16, 'isArrayLike(obj)');
function visit92_334_1(result) {
  _$jscoverage['/underscore.js'].branchData['334'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['333'][7].init(168, 11, 'obj != null');
function visit91_333_7(result) {
  _$jscoverage['/underscore.js'].branchData['333'][7].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['333'][6].init(138, 25, 'typeof obj[0] != \'object\'');
function visit90_333_6(result) {
  _$jscoverage['/underscore.js'].branchData['333'][6].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['333'][5].init(107, 27, 'typeof iteratee == \'number\'');
function visit89_333_5(result) {
  _$jscoverage['/underscore.js'].branchData['333'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['333'][4].init(107, 56, 'typeof iteratee == \'number\' && typeof obj[0] != \'object\'');
function visit88_333_4(result) {
  _$jscoverage['/underscore.js'].branchData['333'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['333'][3].init(107, 72, '(typeof iteratee == \'number\' && typeof obj[0] != \'object\') && obj != null');
function visit87_333_3(result) {
  _$jscoverage['/underscore.js'].branchData['333'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['333'][2].init(86, 16, 'iteratee == null');
function visit86_333_2(result) {
  _$jscoverage['/underscore.js'].branchData['333'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['333'][1].init(86, 93, 'iteratee == null || (typeof iteratee == \'number\' && typeof obj[0] != \'object\') && obj != null');
function visit85_333_1(result) {
  _$jscoverage['/underscore.js'].branchData['333'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['320'][5].init(111, 20, 'result === -Infinity');
function visit84_320_5(result) {
  _$jscoverage['/underscore.js'].branchData['320'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['320'][4].init(85, 22, 'computed === -Infinity');
function visit83_320_4(result) {
  _$jscoverage['/underscore.js'].branchData['320'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['320'][3].init(85, 46, 'computed === -Infinity && result === -Infinity');
function visit82_320_3(result) {
  _$jscoverage['/underscore.js'].branchData['320'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['320'][2].init(58, 23, 'computed > lastComputed');
function visit81_320_2(result) {
  _$jscoverage['/underscore.js'].branchData['320'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['320'][1].init(58, 73, 'computed > lastComputed || computed === -Infinity && result === -Infinity');
function visit80_320_1(result) {
  _$jscoverage['/underscore.js'].branchData['320'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['312'][1].init(37, 14, 'value > result');
function visit79_312_1(result) {
  _$jscoverage['/underscore.js'].branchData['312'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['310'][1].init(96, 10, 'i < length');
function visit78_310_1(result) {
  _$jscoverage['/underscore.js'].branchData['310'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['309'][1].init(13, 16, 'isArrayLike(obj)');
function visit77_309_1(result) {
  _$jscoverage['/underscore.js'].branchData['309'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['308'][7].init(170, 11, 'obj != null');
function visit76_308_7(result) {
  _$jscoverage['/underscore.js'].branchData['308'][7].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['308'][6].init(140, 25, 'typeof obj[0] != \'object\'');
function visit75_308_6(result) {
  _$jscoverage['/underscore.js'].branchData['308'][6].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['308'][5].init(109, 27, 'typeof iteratee == \'number\'');
function visit74_308_5(result) {
  _$jscoverage['/underscore.js'].branchData['308'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['308'][4].init(109, 56, 'typeof iteratee == \'number\' && typeof obj[0] != \'object\'');
function visit73_308_4(result) {
  _$jscoverage['/underscore.js'].branchData['308'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['308'][3].init(109, 72, '(typeof iteratee == \'number\' && typeof obj[0] != \'object\') && obj != null');
function visit72_308_3(result) {
  _$jscoverage['/underscore.js'].branchData['308'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['308'][2].init(88, 16, 'iteratee == null');
function visit71_308_2(result) {
  _$jscoverage['/underscore.js'].branchData['308'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['308'][1].init(88, 93, 'iteratee == null || (typeof iteratee == \'number\' && typeof obj[0] != \'object\') && obj != null');
function visit70_308_1(result) {
  _$jscoverage['/underscore.js'].branchData['308'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['283'][1].init(64, 12, 'func == null');
function visit69_283_1(result) {
  _$jscoverage['/underscore.js'].branchData['283'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['282'][1].init(18, 6, 'isFunc');
function visit68_282_1(result) {
  _$jscoverage['/underscore.js'].branchData['282'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['275'][1].init(122, 36, '_.indexOf(obj, item, fromIndex) >= 0');
function visit67_275_1(result) {
  _$jscoverage['/underscore.js'].branchData['275'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['274'][2].init(57, 28, 'typeof fromIndex != \'number\'');
function visit66_274_2(result) {
  _$jscoverage['/underscore.js'].branchData['274'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['274'][1].init(57, 37, 'typeof fromIndex != \'number\' || guard');
function visit65_274_1(result) {
  _$jscoverage['/underscore.js'].branchData['274'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['273'][1].init(9, 17, '!isArrayLike(obj)');
function visit64_273_1(result) {
  _$jscoverage['/underscore.js'].branchData['273'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['265'][1].init(62, 43, 'predicate(obj[currentKey], currentKey, obj)');
function visit63_265_1(result) {
  _$jscoverage['/underscore.js'].branchData['265'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['264'][1].init(24, 4, 'keys');
function visit62_264_1(result) {
  _$jscoverage['/underscore.js'].branchData['264'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['263'][1].init(153, 14, 'index < length');
function visit61_263_1(result) {
  _$jscoverage['/underscore.js'].branchData['263'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['262'][1].init(62, 11, 'keys || obj');
function visit60_262_1(result) {
  _$jscoverage['/underscore.js'].branchData['262'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['261'][1].init(56, 32, '!isArrayLike(obj) && _.keys(obj)');
function visit59_261_1(result) {
  _$jscoverage['/underscore.js'].branchData['261'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['252'][1].init(62, 44, '!predicate(obj[currentKey], currentKey, obj)');
function visit58_252_1(result) {
  _$jscoverage['/underscore.js'].branchData['252'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['251'][1].init(24, 4, 'keys');
function visit57_251_1(result) {
  _$jscoverage['/underscore.js'].branchData['251'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['250'][1].init(153, 14, 'index < length');
function visit56_250_1(result) {
  _$jscoverage['/underscore.js'].branchData['250'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['249'][1].init(62, 11, 'keys || obj');
function visit55_249_1(result) {
  _$jscoverage['/underscore.js'].branchData['249'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['248'][1].init(56, 32, '!isArrayLike(obj) && _.keys(obj)');
function visit54_248_1(result) {
  _$jscoverage['/underscore.js'].branchData['248'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['234'][1].init(11, 29, 'predicate(value, index, list)');
function visit53_234_1(result) {
  _$jscoverage['/underscore.js'].branchData['234'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['225'][3].init(185, 10, 'key !== -1');
function visit52_225_3(result) {
  _$jscoverage['/underscore.js'].branchData['225'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['225'][2].init(167, 14, 'key !== void 0');
function visit51_225_2(result) {
  _$jscoverage['/underscore.js'].branchData['225'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['225'][1].init(167, 28, 'key !== void 0 && key !== -1');
function visit50_225_1(result) {
  _$jscoverage['/underscore.js'].branchData['225'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['220'][1].init(22, 16, 'isArrayLike(obj)');
function visit49_220_1(result) {
  _$jscoverage['/underscore.js'].branchData['220'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['205'][1].init(21, 21, 'arguments.length >= 3');
function visit48_205_1(result) {
  _$jscoverage['/underscore.js'].branchData['205'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['198'][1].init(26, 4, 'keys');
function visit47_198_1(result) {
  _$jscoverage['/underscore.js'].branchData['198'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['197'][3].init(264, 14, 'index < length');
function visit46_197_3(result) {
  _$jscoverage['/underscore.js'].branchData['197'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['197'][2].init(250, 10, 'index >= 0');
function visit45_197_2(result) {
  _$jscoverage['/underscore.js'].branchData['197'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['197'][1].init(250, 28, 'index >= 0 && index < length');
function visit44_197_1(result) {
  _$jscoverage['/underscore.js'].branchData['197'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['194'][1].init(20, 4, 'keys');
function visit43_194_1(result) {
  _$jscoverage['/underscore.js'].branchData['194'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['193'][1].init(147, 8, '!initial');
function visit42_193_1(result) {
  _$jscoverage['/underscore.js'].branchData['193'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['192'][1].init(103, 7, 'dir > 0');
function visit41_192_1(result) {
  _$jscoverage['/underscore.js'].branchData['192'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['191'][1].init(64, 11, 'keys || obj');
function visit40_191_1(result) {
  _$jscoverage['/underscore.js'].branchData['191'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['190'][1].init(18, 32, '!isArrayLike(obj) && _.keys(obj)');
function visit39_190_1(result) {
  _$jscoverage['/underscore.js'].branchData['190'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['179'][1].init(24, 4, 'keys');
function visit38_179_1(result) {
  _$jscoverage['/underscore.js'].branchData['179'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['178'][1].init(184, 14, 'index < length');
function visit37_178_1(result) {
  _$jscoverage['/underscore.js'].branchData['178'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['176'][1].init(62, 11, 'keys || obj');
function visit36_176_1(result) {
  _$jscoverage['/underscore.js'].branchData['176'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['175'][1].init(54, 32, '!isArrayLike(obj) && _.keys(obj)');
function visit35_175_1(result) {
  _$jscoverage['/underscore.js'].branchData['175'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['165'][1].init(71, 10, 'i < length');
function visit34_165_1(result) {
  _$jscoverage['/underscore.js'].branchData['165'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['160'][1].init(40, 10, 'i < length');
function visit33_160_1(result) {
  _$jscoverage['/underscore.js'].branchData['160'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['159'][1].init(74, 16, 'isArrayLike(obj)');
function visit32_159_1(result) {
  _$jscoverage['/underscore.js'].branchData['159'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['147'][5].init(96, 25, 'length <= MAX_ARRAY_INDEX');
function visit31_147_5(result) {
  _$jscoverage['/underscore.js'].branchData['147'][5].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['147'][4].init(81, 11, 'length >= 0');
function visit30_147_4(result) {
  _$jscoverage['/underscore.js'].branchData['147'][4].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['147'][3].init(81, 40, 'length >= 0 && length <= MAX_ARRAY_INDEX');
function visit29_147_3(result) {
  _$jscoverage['/underscore.js'].branchData['147'][3].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['147'][2].init(52, 25, 'typeof length == \'number\'');
function visit28_147_2(result) {
  _$jscoverage['/underscore.js'].branchData['147'][2].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['147'][1].init(52, 69, 'typeof length == \'number\' && length >= 0 && length <= MAX_ARRAY_INDEX');
function visit27_147_1(result) {
  _$jscoverage['/underscore.js'].branchData['147'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['135'][1].init(14, 11, 'obj == null');
function visit26_135_1(result) {
  _$jscoverage['/underscore.js'].branchData['135'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['126'][1].init(52, 12, 'nativeCreate');
function visit25_126_1(result) {
  _$jscoverage['/underscore.js'].branchData['126'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['125'][1].init(9, 22, '!_.isObject(prototype)');
function visit24_125_1(result) {
  _$jscoverage['/underscore.js'].branchData['125'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['115'][1].init(488, 18, 'index < startIndex');
function visit23_115_1(result) {
  _$jscoverage['/underscore.js'].branchData['115'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['106'][1].init(122, 14, 'index < length');
function visit22_106_1(result) {
  _$jscoverage['/underscore.js'].branchData['106'][1].ranCondition(result);
  return result;
}_$jscoverage['/underscore.js'].branchData['102'][1].init(18, 18, 'startIndex == null');
function visit21_102_1(result) {
  _$jscoverage['/underscore.js'].branchData['102'][1].ranCondition(result);
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
  _$jscoverage['/underscore.js'].lineData[95]++;
  _.iteratee = function(value, context) {
  _$jscoverage['/underscore.js'].functionData[9]++;
  _$jscoverage['/underscore.js'].lineData[96]++;
  return cb(value, context, Infinity);
};
  _$jscoverage['/underscore.js'].lineData[101]++;
  var restArgs = function(func, startIndex) {
  _$jscoverage['/underscore.js'].functionData[10]++;
  _$jscoverage['/underscore.js'].lineData[102]++;
  startIndex = visit21_102_1(startIndex == null) ? func.length - 1 : +startIndex;
  _$jscoverage['/underscore.js'].lineData[103]++;
  return function() {
  _$jscoverage['/underscore.js'].functionData[11]++;
  _$jscoverage['/underscore.js'].lineData[104]++;
  var length = Math.max(arguments.length - startIndex, 0);
  _$jscoverage['/underscore.js'].lineData[105]++;
  var rest = Array(length);
  _$jscoverage['/underscore.js'].lineData[106]++;
  for (var index = 0; visit22_106_1(index < length); index++) {
    _$jscoverage['/underscore.js'].lineData[107]++;
    rest[index] = arguments[index + startIndex];
  }
  _$jscoverage['/underscore.js'].lineData[109]++;
  switch (startIndex) {
    case 0:
      _$jscoverage['/underscore.js'].lineData[110]++;
      return func.call(this, rest);
    case 1:
      _$jscoverage['/underscore.js'].lineData[111]++;
      return func.call(this, arguments[0], rest);
    case 2:
      _$jscoverage['/underscore.js'].lineData[112]++;
      return func.call(this, arguments[0], arguments[1], rest);
  }
  _$jscoverage['/underscore.js'].lineData[114]++;
  var args = Array(startIndex + 1);
  _$jscoverage['/underscore.js'].lineData[115]++;
  for (index = 0; visit23_115_1(index < startIndex); index++) {
    _$jscoverage['/underscore.js'].lineData[116]++;
    args[index] = arguments[index];
  }
  _$jscoverage['/underscore.js'].lineData[118]++;
  args[startIndex] = rest;
  _$jscoverage['/underscore.js'].lineData[119]++;
  return func.apply(this, args);
};
};
  _$jscoverage['/underscore.js'].lineData[124]++;
  var baseCreate = function(prototype) {
  _$jscoverage['/underscore.js'].functionData[12]++;
  _$jscoverage['/underscore.js'].lineData[125]++;
  if (visit24_125_1(!_.isObject(prototype))) 
    return {};
  _$jscoverage['/underscore.js'].lineData[126]++;
  if (visit25_126_1(nativeCreate)) 
    return nativeCreate(prototype);
  _$jscoverage['/underscore.js'].lineData[127]++;
  Ctor.prototype = prototype;
  _$jscoverage['/underscore.js'].lineData[128]++;
  var result = new Ctor();
  _$jscoverage['/underscore.js'].lineData[129]++;
  Ctor.prototype = null;
  _$jscoverage['/underscore.js'].lineData[130]++;
  return result;
};
  _$jscoverage['/underscore.js'].lineData[133]++;
  var property = function(key) {
  _$jscoverage['/underscore.js'].functionData[13]++;
  _$jscoverage['/underscore.js'].lineData[134]++;
  return function(obj) {
  _$jscoverage['/underscore.js'].functionData[14]++;
  _$jscoverage['/underscore.js'].lineData[135]++;
  return visit26_135_1(obj == null) ? void 0 : obj[key];
};
};
  _$jscoverage['/underscore.js'].lineData[143]++;
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  _$jscoverage['/underscore.js'].lineData[144]++;
  var getLength = property('length');
  _$jscoverage['/underscore.js'].lineData[145]++;
  var isArrayLike = function(collection) {
  _$jscoverage['/underscore.js'].functionData[15]++;
  _$jscoverage['/underscore.js'].lineData[146]++;
  var length = getLength(collection);
  _$jscoverage['/underscore.js'].lineData[147]++;
  return visit27_147_1(visit28_147_2(typeof length == 'number') && visit29_147_3(visit30_147_4(length >= 0) && visit31_147_5(length <= MAX_ARRAY_INDEX)));
};
  _$jscoverage['/underscore.js'].lineData[156]++;
  _.each = _.forEach = function(obj, iteratee, context) {
  _$jscoverage['/underscore.js'].functionData[16]++;
  _$jscoverage['/underscore.js'].lineData[157]++;
  iteratee = optimizeCb(iteratee, context);
  _$jscoverage['/underscore.js'].lineData[158]++;
  var i, length;
  _$jscoverage['/underscore.js'].lineData[159]++;
  if (visit32_159_1(isArrayLike(obj))) {
    _$jscoverage['/underscore.js'].lineData[160]++;
    for (i = 0 , length = obj.length; visit33_160_1(i < length); i++) {
      _$jscoverage['/underscore.js'].lineData[161]++;
      iteratee(obj[i], i, obj);
    }
  } else {
    _$jscoverage['/underscore.js'].lineData[164]++;
    var keys = _.keys(obj);
    _$jscoverage['/underscore.js'].lineData[165]++;
    for (i = 0 , length = keys.length; visit34_165_1(i < length); i++) {
      _$jscoverage['/underscore.js'].lineData[166]++;
      iteratee(obj[keys[i]], keys[i], obj);
    }
  }
  _$jscoverage['/underscore.js'].lineData[169]++;
  return obj;
};
  _$jscoverage['/underscore.js'].lineData[173]++;
  _.map = _.collect = function(obj, iteratee, context) {
  _$jscoverage['/underscore.js'].functionData[17]++;
  _$jscoverage['/underscore.js'].lineData[174]++;
  iteratee = cb(iteratee, context);
  _$jscoverage['/underscore.js'].lineData[175]++;
  var keys = visit35_175_1(!isArrayLike(obj) && _.keys(obj)), length = (visit36_176_1(keys || obj)).length, results = Array(length);
  _$jscoverage['/underscore.js'].lineData[178]++;
  for (var index = 0; visit37_178_1(index < length); index++) {
    _$jscoverage['/underscore.js'].lineData[179]++;
    var currentKey = visit38_179_1(keys) ? keys[index] : index;
    _$jscoverage['/underscore.js'].lineData[180]++;
    results[index] = iteratee(obj[currentKey], currentKey, obj);
  }
  _$jscoverage['/underscore.js'].lineData[182]++;
  return results;
};
  _$jscoverage['/underscore.js'].lineData[186]++;
  var createReduce = function(dir) {
  _$jscoverage['/underscore.js'].functionData[18]++;
  _$jscoverage['/underscore.js'].lineData[189]++;
  var reducer = function(obj, iteratee, memo, initial) {
  _$jscoverage['/underscore.js'].functionData[19]++;
  _$jscoverage['/underscore.js'].lineData[190]++;
  var keys = visit39_190_1(!isArrayLike(obj) && _.keys(obj)), length = (visit40_191_1(keys || obj)).length, index = visit41_192_1(dir > 0) ? 0 : length - 1;
  _$jscoverage['/underscore.js'].lineData[193]++;
  if (visit42_193_1(!initial)) {
    _$jscoverage['/underscore.js'].lineData[194]++;
    memo = obj[visit43_194_1(keys) ? keys[index] : index];
    _$jscoverage['/underscore.js'].lineData[195]++;
    index += dir;
  }
  _$jscoverage['/underscore.js'].lineData[197]++;
  for (; visit44_197_1(visit45_197_2(index >= 0) && visit46_197_3(index < length)); index += dir) {
    _$jscoverage['/underscore.js'].lineData[198]++;
    var currentKey = visit47_198_1(keys) ? keys[index] : index;
    _$jscoverage['/underscore.js'].lineData[199]++;
    memo = iteratee(memo, obj[currentKey], currentKey, obj);
  }
  _$jscoverage['/underscore.js'].lineData[201]++;
  return memo;
};
  _$jscoverage['/underscore.js'].lineData[204]++;
  return function(obj, iteratee, memo, context) {
  _$jscoverage['/underscore.js'].functionData[20]++;
  _$jscoverage['/underscore.js'].lineData[205]++;
  var initial = visit48_205_1(arguments.length >= 3);
  _$jscoverage['/underscore.js'].lineData[206]++;
  return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
};
};
  _$jscoverage['/underscore.js'].lineData[212]++;
  _.reduce = _.foldl = _.inject = createReduce(1);
  _$jscoverage['/underscore.js'].lineData[215]++;
  _.reduceRight = _.foldr = createReduce(-1);
  _$jscoverage['/underscore.js'].lineData[218]++;
  _.find = _.detect = function(obj, predicate, context) {
  _$jscoverage['/underscore.js'].functionData[21]++;
  _$jscoverage['/underscore.js'].lineData[219]++;
  var key;
  _$jscoverage['/underscore.js'].lineData[220]++;
  if (visit49_220_1(isArrayLike(obj))) {
    _$jscoverage['/underscore.js'].lineData[221]++;
    key = _.findIndex(obj, predicate, context);
  } else {
    _$jscoverage['/underscore.js'].lineData[223]++;
    key = _.findKey(obj, predicate, context);
  }
  _$jscoverage['/underscore.js'].lineData[225]++;
  if (visit50_225_1(visit51_225_2(key !== void 0) && visit52_225_3(key !== -1))) 
    return obj[key];
};
  _$jscoverage['/underscore.js'].lineData[230]++;
  _.filter = _.select = function(obj, predicate, context) {
  _$jscoverage['/underscore.js'].functionData[22]++;
  _$jscoverage['/underscore.js'].lineData[231]++;
  var results = [];
  _$jscoverage['/underscore.js'].lineData[232]++;
  predicate = cb(predicate, context);
  _$jscoverage['/underscore.js'].lineData[233]++;
  _.each(obj, function(value, index, list) {
  _$jscoverage['/underscore.js'].functionData[23]++;
  _$jscoverage['/underscore.js'].lineData[234]++;
  if (visit53_234_1(predicate(value, index, list))) 
    results.push(value);
});
  _$jscoverage['/underscore.js'].lineData[236]++;
  return results;
};
  _$jscoverage['/underscore.js'].lineData[240]++;
  _.reject = function(obj, predicate, context) {
  _$jscoverage['/underscore.js'].functionData[24]++;
  _$jscoverage['/underscore.js'].lineData[241]++;
  return _.filter(obj, _.negate(cb(predicate)), context);
};
  _$jscoverage['/underscore.js'].lineData[246]++;
  _.every = _.all = function(obj, predicate, context) {
  _$jscoverage['/underscore.js'].functionData[25]++;
  _$jscoverage['/underscore.js'].lineData[247]++;
  predicate = cb(predicate, context);
  _$jscoverage['/underscore.js'].lineData[248]++;
  var keys = visit54_248_1(!isArrayLike(obj) && _.keys(obj)), length = (visit55_249_1(keys || obj)).length;
  _$jscoverage['/underscore.js'].lineData[250]++;
  for (var index = 0; visit56_250_1(index < length); index++) {
    _$jscoverage['/underscore.js'].lineData[251]++;
    var currentKey = visit57_251_1(keys) ? keys[index] : index;
    _$jscoverage['/underscore.js'].lineData[252]++;
    if (visit58_252_1(!predicate(obj[currentKey], currentKey, obj))) 
      return false;
  }
  _$jscoverage['/underscore.js'].lineData[254]++;
  return true;
};
  _$jscoverage['/underscore.js'].lineData[259]++;
  _.some = _.any = function(obj, predicate, context) {
  _$jscoverage['/underscore.js'].functionData[26]++;
  _$jscoverage['/underscore.js'].lineData[260]++;
  predicate = cb(predicate, context);
  _$jscoverage['/underscore.js'].lineData[261]++;
  var keys = visit59_261_1(!isArrayLike(obj) && _.keys(obj)), length = (visit60_262_1(keys || obj)).length;
  _$jscoverage['/underscore.js'].lineData[263]++;
  for (var index = 0; visit61_263_1(index < length); index++) {
    _$jscoverage['/underscore.js'].lineData[264]++;
    var currentKey = visit62_264_1(keys) ? keys[index] : index;
    _$jscoverage['/underscore.js'].lineData[265]++;
    if (visit63_265_1(predicate(obj[currentKey], currentKey, obj))) 
      return true;
  }
  _$jscoverage['/underscore.js'].lineData[267]++;
  return false;
};
  _$jscoverage['/underscore.js'].lineData[272]++;
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
  _$jscoverage['/underscore.js'].functionData[27]++;
  _$jscoverage['/underscore.js'].lineData[273]++;
  if (visit64_273_1(!isArrayLike(obj))) 
    obj = _.values(obj);
  _$jscoverage['/underscore.js'].lineData[274]++;
  if (visit65_274_1(visit66_274_2(typeof fromIndex != 'number') || guard)) 
    fromIndex = 0;
  _$jscoverage['/underscore.js'].lineData[275]++;
  return visit67_275_1(_.indexOf(obj, item, fromIndex) >= 0);
};
  _$jscoverage['/underscore.js'].lineData[279]++;
  _.invoke = restArgs(function(obj, method, args) {
  _$jscoverage['/underscore.js'].functionData[28]++;
  _$jscoverage['/underscore.js'].lineData[280]++;
  var isFunc = _.isFunction(method);
  _$jscoverage['/underscore.js'].lineData[281]++;
  return _.map(obj, function(value) {
  _$jscoverage['/underscore.js'].functionData[29]++;
  _$jscoverage['/underscore.js'].lineData[282]++;
  var func = visit68_282_1(isFunc) ? method : value[method];
  _$jscoverage['/underscore.js'].lineData[283]++;
  return visit69_283_1(func == null) ? func : func.apply(value, args);
});
});
  _$jscoverage['/underscore.js'].lineData[288]++;
  _.pluck = function(obj, key) {
  _$jscoverage['/underscore.js'].functionData[30]++;
  _$jscoverage['/underscore.js'].lineData[289]++;
  return _.map(obj, _.property(key));
};
  _$jscoverage['/underscore.js'].lineData[294]++;
  _.where = function(obj, attrs) {
  _$jscoverage['/underscore.js'].functionData[31]++;
  _$jscoverage['/underscore.js'].lineData[295]++;
  return _.filter(obj, _.matcher(attrs));
};
  _$jscoverage['/underscore.js'].lineData[300]++;
  _.findWhere = function(obj, attrs) {
  _$jscoverage['/underscore.js'].functionData[32]++;
  _$jscoverage['/underscore.js'].lineData[301]++;
  return _.find(obj, _.matcher(attrs));
};
  _$jscoverage['/underscore.js'].lineData[305]++;
  _.max = function(obj, iteratee, context) {
  _$jscoverage['/underscore.js'].functionData[33]++;
  _$jscoverage['/underscore.js'].lineData[306]++;
  var result = -Infinity, lastComputed = -Infinity, value, computed;
  _$jscoverage['/underscore.js'].lineData[308]++;
  if (visit70_308_1(visit71_308_2(iteratee == null) || visit72_308_3((visit73_308_4(visit74_308_5(typeof iteratee == 'number') && visit75_308_6(typeof obj[0] != 'object'))) && visit76_308_7(obj != null)))) {
    _$jscoverage['/underscore.js'].lineData[309]++;
    obj = visit77_309_1(isArrayLike(obj)) ? obj : _.values(obj);
    _$jscoverage['/underscore.js'].lineData[310]++;
    for (var i = 0, length = obj.length; visit78_310_1(i < length); i++) {
      _$jscoverage['/underscore.js'].lineData[311]++;
      value = obj[i];
      _$jscoverage['/underscore.js'].lineData[312]++;
      if (visit79_312_1(value > result)) {
        _$jscoverage['/underscore.js'].lineData[313]++;
        result = value;
      }
    }
  } else {
    _$jscoverage['/underscore.js'].lineData[317]++;
    iteratee = cb(iteratee, context);
    _$jscoverage['/underscore.js'].lineData[318]++;
    _.each(obj, function(v, index, list) {
  _$jscoverage['/underscore.js'].functionData[34]++;
  _$jscoverage['/underscore.js'].lineData[319]++;
  computed = iteratee(v, index, list);
  _$jscoverage['/underscore.js'].lineData[320]++;
  if (visit80_320_1(visit81_320_2(computed > lastComputed) || visit82_320_3(visit83_320_4(computed === -Infinity) && visit84_320_5(result === -Infinity)))) {
    _$jscoverage['/underscore.js'].lineData[321]++;
    result = v;
    _$jscoverage['/underscore.js'].lineData[322]++;
    lastComputed = computed;
  }
});
  }
  _$jscoverage['/underscore.js'].lineData[326]++;
  return result;
};
  _$jscoverage['/underscore.js'].lineData[330]++;
  _.min = function(obj, iteratee, context) {
  _$jscoverage['/underscore.js'].functionData[35]++;
  _$jscoverage['/underscore.js'].lineData[331]++;
  var result = Infinity, lastComputed = Infinity, value, computed;
  _$jscoverage['/underscore.js'].lineData[333]++;
  if (visit85_333_1(visit86_333_2(iteratee == null) || visit87_333_3((visit88_333_4(visit89_333_5(typeof iteratee == 'number') && visit90_333_6(typeof obj[0] != 'object'))) && visit91_333_7(obj != null)))) {
    _$jscoverage['/underscore.js'].lineData[334]++;
    obj = visit92_334_1(isArrayLike(obj)) ? obj : _.values(obj);
    _$jscoverage['/underscore.js'].lineData[335]++;
    for (var i = 0, length = obj.length; visit93_335_1(i < length); i++) {
      _$jscoverage['/underscore.js'].lineData[336]++;
      value = obj[i];
      _$jscoverage['/underscore.js'].lineData[337]++;
      if (visit94_337_1(value < result)) {
        _$jscoverage['/underscore.js'].lineData[338]++;
        result = value;
      }
    }
  } else {
    _$jscoverage['/underscore.js'].lineData[342]++;
    iteratee = cb(iteratee, context);
    _$jscoverage['/underscore.js'].lineData[343]++;
    _.each(obj, function(v, index, list) {
  _$jscoverage['/underscore.js'].functionData[36]++;
  _$jscoverage['/underscore.js'].lineData[344]++;
  computed = iteratee(v, index, list);
  _$jscoverage['/underscore.js'].lineData[345]++;
  if (visit95_345_1(visit96_345_2(computed < lastComputed) || visit97_345_3(visit98_345_4(computed === Infinity) && visit99_345_5(result === Infinity)))) {
    _$jscoverage['/underscore.js'].lineData[346]++;
    result = v;
    _$jscoverage['/underscore.js'].lineData[347]++;
    lastComputed = computed;
  }
});
  }
  _$jscoverage['/underscore.js'].lineData[351]++;
  return result;
};
  _$jscoverage['/underscore.js'].lineData[355]++;
  _.shuffle = function(obj) {
  _$jscoverage['/underscore.js'].functionData[37]++;
  _$jscoverage['/underscore.js'].lineData[356]++;
  return _.sample(obj, Infinity);
};
  _$jscoverage['/underscore.js'].lineData[363]++;
  _.sample = function(obj, n, guard) {
  _$jscoverage['/underscore.js'].functionData[38]++;
  _$jscoverage['/underscore.js'].lineData[364]++;
  if (visit100_364_1(visit101_364_2(n == null) || guard)) {
    _$jscoverage['/underscore.js'].lineData[365]++;
    if (visit102_365_1(!isArrayLike(obj))) 
      obj = _.values(obj);
    _$jscoverage['/underscore.js'].lineData[366]++;
    return obj[_.random(obj.length - 1)];
  }
  _$jscoverage['/underscore.js'].lineData[368]++;
  var sample = visit103_368_1(isArrayLike(obj)) ? _.clone(obj) : _.values(obj);
  _$jscoverage['/underscore.js'].lineData[369]++;
  var length = getLength(sample);
  _$jscoverage['/underscore.js'].lineData[370]++;
  n = Math.max(Math.min(n, length), 0);
  _$jscoverage['/underscore.js'].lineData[371]++;
  var last = length - 1;
  _$jscoverage['/underscore.js'].lineData[372]++;
  for (var index = 0; visit104_372_1(index < n); index++) {
    _$jscoverage['/underscore.js'].lineData[373]++;
    var rand = _.random(index, last);
    _$jscoverage['/underscore.js'].lineData[374]++;
    var temp = sample[index];
    _$jscoverage['/underscore.js'].lineData[375]++;
    sample[index] = sample[rand];
    _$jscoverage['/underscore.js'].lineData[376]++;
    sample[rand] = temp;
  }
  _$jscoverage['/underscore.js'].lineData[378]++;
  return sample.slice(0, n);
};
  _$jscoverage['/underscore.js'].lineData[382]++;
  _.sortBy = function(obj, iteratee, context) {
  _$jscoverage['/underscore.js'].functionData[39]++;
  _$jscoverage['/underscore.js'].lineData[383]++;
  iteratee = cb(iteratee, context);
  _$jscoverage['/underscore.js'].lineData[384]++;
  return _.pluck(_.map(obj, function(value, index, list) {
  _$jscoverage['/underscore.js'].functionData[40]++;
  _$jscoverage['/underscore.js'].lineData[385]++;
  return {
  value: value, 
  index: index, 
  criteria: iteratee(value, index, list)};
}).sort(function(left, right) {
  _$jscoverage['/underscore.js'].functionData[41]++;
  _$jscoverage['/underscore.js'].lineData[391]++;
  var a = left.criteria;
  _$jscoverage['/underscore.js'].lineData[392]++;
  var b = right.criteria;
  _$jscoverage['/underscore.js'].lineData[393]++;
  if (visit105_393_1(a !== b)) {
    _$jscoverage['/underscore.js'].lineData[394]++;
    if (visit106_394_1(visit107_394_2(a > b) || visit108_394_3(a === void 0))) 
      return 1;
    _$jscoverage['/underscore.js'].lineData[395]++;
    if (visit109_395_1(visit110_395_2(a < b) || visit111_395_3(b === void 0))) 
      return -1;
  }
  _$jscoverage['/underscore.js'].lineData[397]++;
  return left.index - right.index;
}), 'value');
};
  _$jscoverage['/underscore.js'].lineData[402]++;
  var group = function(behavior, partition) {
  _$jscoverage['/underscore.js'].functionData[42]++;
  _$jscoverage['/underscore.js'].lineData[403]++;
  return function(obj, iteratee, context) {
  _$jscoverage['/underscore.js'].functionData[43]++;
  _$jscoverage['/underscore.js'].lineData[404]++;
  var result = visit112_404_1(partition) ? [[], []] : {};
  _$jscoverage['/underscore.js'].lineData[405]++;
  iteratee = cb(iteratee, context);
  _$jscoverage['/underscore.js'].lineData[406]++;
  _.each(obj, function(value, index) {
  _$jscoverage['/underscore.js'].functionData[44]++;
  _$jscoverage['/underscore.js'].lineData[407]++;
  var key = iteratee(value, index, obj);
  _$jscoverage['/underscore.js'].lineData[408]++;
  behavior(result, value, key);
});
  _$jscoverage['/underscore.js'].lineData[410]++;
  return result;
};
};
  _$jscoverage['/underscore.js'].lineData[416]++;
  _.groupBy = group(function(result, value, key) {
  _$jscoverage['/underscore.js'].functionData[45]++;
  _$jscoverage['/underscore.js'].lineData[417]++;
  if (visit113_417_1(_.has(result, key))) 
    result[key].push(value);
  else 
    result[key] = [value];
});
  _$jscoverage['/underscore.js'].lineData[422]++;
  _.indexBy = group(function(result, value, key) {
  _$jscoverage['/underscore.js'].functionData[46]++;
  _$jscoverage['/underscore.js'].lineData[423]++;
  result[key] = value;
});
  _$jscoverage['/underscore.js'].lineData[429]++;
  _.countBy = group(function(result, value, key) {
  _$jscoverage['/underscore.js'].functionData[47]++;
  _$jscoverage['/underscore.js'].lineData[430]++;
  if (visit114_430_1(_.has(result, key))) 
    result[key]++;
  else 
    result[key] = 1;
});
  _$jscoverage['/underscore.js'].lineData[434]++;
  _.toArray = function(obj) {
  _$jscoverage['/underscore.js'].functionData[48]++;
  _$jscoverage['/underscore.js'].lineData[435]++;
  if (visit115_435_1(!obj)) 
    return [];
  _$jscoverage['/underscore.js'].lineData[436]++;
  if (visit116_436_1(_.isArray(obj))) 
    return slice.call(obj);
  _$jscoverage['/underscore.js'].lineData[437]++;
  if (visit117_437_1(isArrayLike(obj))) 
    return _.map(obj, _.identity);
  _$jscoverage['/underscore.js'].lineData[438]++;
  return _.values(obj);
};
  _$jscoverage['/underscore.js'].lineData[442]++;
  _.size = function(obj) {
  _$jscoverage['/underscore.js'].functionData[49]++;
  _$jscoverage['/underscore.js'].lineData[443]++;
  if (visit118_443_1(obj == null)) 
    return 0;
  _$jscoverage['/underscore.js'].lineData[444]++;
  return visit119_444_1(isArrayLike(obj)) ? obj.length : _.keys(obj).length;
};
  _$jscoverage['/underscore.js'].lineData[449]++;
  _.partition = group(function(result, value, pass) {
  _$jscoverage['/underscore.js'].functionData[50]++;
  _$jscoverage['/underscore.js'].lineData[450]++;
  result[visit120_450_1(pass) ? 0 : 1].push(value);
}, true);
  _$jscoverage['/underscore.js'].lineData[459]++;
  _.first = _.head = _.take = function(array, n, guard) {
  _$jscoverage['/underscore.js'].functionData[51]++;
  _$jscoverage['/underscore.js'].lineData[460]++;
  if (visit121_460_1(array == null)) 
    return void 0;
  _$jscoverage['/underscore.js'].lineData[461]++;
  if (visit122_461_1(visit123_461_2(n == null) || guard)) 
    return array[0];
  _$jscoverage['/underscore.js'].lineData[462]++;
  return _.initial(array, array.length - n);
};
  _$jscoverage['/underscore.js'].lineData[468]++;
  _.initial = function(array, n, guard) {
  _$jscoverage['/underscore.js'].functionData[52]++;
  _$jscoverage['/underscore.js'].lineData[469]++;
  return slice.call(array, 0, Math.max(0, array.length - (visit124_469_1(visit125_469_2(n == null) || guard) ? 1 : n)));
};
  _$jscoverage['/underscore.js'].lineData[474]++;
  _.last = function(array, n, guard) {
  _$jscoverage['/underscore.js'].functionData[53]++;
  _$jscoverage['/underscore.js'].lineData[475]++;
  if (visit126_475_1(array == null)) 
    return void 0;
  _$jscoverage['/underscore.js'].lineData[476]++;
  if (visit127_476_1(visit128_476_2(n == null) || guard)) 
    return array[array.length - 1];
  _$jscoverage['/underscore.js'].lineData[477]++;
  return _.rest(array, Math.max(0, array.length - n));
};
  _$jscoverage['/underscore.js'].lineData[483]++;
  _.rest = _.tail = _.drop = function(array, n, guard) {
  _$jscoverage['/underscore.js'].functionData[54]++;
  _$jscoverage['/underscore.js'].lineData[484]++;
  return slice.call(array, visit129_484_1(visit130_484_2(n == null) || guard) ? 1 : n);
};
  _$jscoverage['/underscore.js'].lineData[488]++;
  _.compact = function(array) {
  _$jscoverage['/underscore.js'].functionData[55]++;
  _$jscoverage['/underscore.js'].lineData[489]++;
  return _.filter(array, _.identity);
};
  _$jscoverage['/underscore.js'].lineData[493]++;
  var flatten = function(input, shallow, strict, output) {
  _$jscoverage['/underscore.js'].functionData[56]++;
  _$jscoverage['/underscore.js'].lineData[494]++;
  output = visit131_494_1(output || []);
  _$jscoverage['/underscore.js'].lineData[495]++;
  var idx = output.length;
  _$jscoverage['/underscore.js'].lineData[496]++;
  for (var i = 0, length = getLength(input); visit132_496_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[497]++;
    var value = input[i];
    _$jscoverage['/underscore.js'].lineData[498]++;
    if (visit133_498_1(isArrayLike(value) && (visit134_498_2(_.isArray(value) || _.isArguments(value))))) {
      _$jscoverage['/underscore.js'].lineData[500]++;
      if (visit135_500_1(shallow)) {
        _$jscoverage['/underscore.js'].lineData[501]++;
        var j = 0, len = value.length;
        _$jscoverage['/underscore.js'].lineData[502]++;
        while (visit136_502_1(j < len)) 
          output[idx++] = value[j++];
      } else {
        _$jscoverage['/underscore.js'].lineData[504]++;
        flatten(value, shallow, strict, output);
        _$jscoverage['/underscore.js'].lineData[505]++;
        idx = output.length;
      }
    } else {
      _$jscoverage['/underscore.js'].lineData[507]++;
      if (visit137_507_1(!strict)) {
        _$jscoverage['/underscore.js'].lineData[508]++;
        output[idx++] = value;
      }
    }
  }
  _$jscoverage['/underscore.js'].lineData[511]++;
  return output;
};
  _$jscoverage['/underscore.js'].lineData[515]++;
  _.flatten = function(array, shallow) {
  _$jscoverage['/underscore.js'].functionData[57]++;
  _$jscoverage['/underscore.js'].lineData[516]++;
  return flatten(array, shallow, false);
};
  _$jscoverage['/underscore.js'].lineData[520]++;
  _.without = restArgs(function(array, otherArrays) {
  _$jscoverage['/underscore.js'].functionData[58]++;
  _$jscoverage['/underscore.js'].lineData[521]++;
  return _.difference(array, otherArrays);
});
  _$jscoverage['/underscore.js'].lineData[527]++;
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
  _$jscoverage['/underscore.js'].functionData[59]++;
  _$jscoverage['/underscore.js'].lineData[528]++;
  if (visit138_528_1(!_.isBoolean(isSorted))) {
    _$jscoverage['/underscore.js'].lineData[529]++;
    context = iteratee;
    _$jscoverage['/underscore.js'].lineData[530]++;
    iteratee = isSorted;
    _$jscoverage['/underscore.js'].lineData[531]++;
    isSorted = false;
  }
  _$jscoverage['/underscore.js'].lineData[533]++;
  if (visit139_533_1(iteratee != null)) 
    iteratee = cb(iteratee, context);
  _$jscoverage['/underscore.js'].lineData[534]++;
  var result = [];
  _$jscoverage['/underscore.js'].lineData[535]++;
  var seen = [];
  _$jscoverage['/underscore.js'].lineData[536]++;
  for (var i = 0, length = getLength(array); visit140_536_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[537]++;
    var value = array[i], computed = visit141_538_1(iteratee) ? iteratee(value, i, array) : value;
    _$jscoverage['/underscore.js'].lineData[539]++;
    if (visit142_539_1(isSorted)) {
      _$jscoverage['/underscore.js'].lineData[540]++;
      if (visit143_540_1(!i || visit144_540_2(seen !== computed))) 
        result.push(value);
      _$jscoverage['/underscore.js'].lineData[541]++;
      seen = computed;
    } else {
      _$jscoverage['/underscore.js'].lineData[542]++;
      if (visit145_542_1(iteratee)) {
        _$jscoverage['/underscore.js'].lineData[543]++;
        if (visit146_543_1(!_.contains(seen, computed))) {
          _$jscoverage['/underscore.js'].lineData[544]++;
          seen.push(computed);
          _$jscoverage['/underscore.js'].lineData[545]++;
          result.push(value);
        }
      } else {
        _$jscoverage['/underscore.js'].lineData[547]++;
        if (visit147_547_1(!_.contains(result, value))) {
          _$jscoverage['/underscore.js'].lineData[548]++;
          result.push(value);
        }
      }
    }
  }
  _$jscoverage['/underscore.js'].lineData[551]++;
  return result;
};
  _$jscoverage['/underscore.js'].lineData[556]++;
  _.union = restArgs(function(arrays) {
  _$jscoverage['/underscore.js'].functionData[60]++;
  _$jscoverage['/underscore.js'].lineData[557]++;
  return _.uniq(flatten(arrays, true, true));
});
  _$jscoverage['/underscore.js'].lineData[562]++;
  _.intersection = function(array) {
  _$jscoverage['/underscore.js'].functionData[61]++;
  _$jscoverage['/underscore.js'].lineData[563]++;
  var result = [];
  _$jscoverage['/underscore.js'].lineData[564]++;
  var argsLength = arguments.length;
  _$jscoverage['/underscore.js'].lineData[565]++;
  for (var i = 0, length = getLength(array); visit148_565_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[566]++;
    var item = array[i];
    _$jscoverage['/underscore.js'].lineData[567]++;
    if (visit149_567_1(_.contains(result, item))) 
      continue;
    _$jscoverage['/underscore.js'].lineData[568]++;
    var j;
    _$jscoverage['/underscore.js'].lineData[569]++;
    for (j = 1; visit150_569_1(j < argsLength); j++) {
      _$jscoverage['/underscore.js'].lineData[570]++;
      if (visit151_570_1(!_.contains(arguments[j], item))) 
        break;
    }
    _$jscoverage['/underscore.js'].lineData[572]++;
    if (visit152_572_1(j === argsLength)) 
      result.push(item);
  }
  _$jscoverage['/underscore.js'].lineData[574]++;
  return result;
};
  _$jscoverage['/underscore.js'].lineData[579]++;
  _.difference = restArgs(function(array, rest) {
  _$jscoverage['/underscore.js'].functionData[62]++;
  _$jscoverage['/underscore.js'].lineData[580]++;
  rest = flatten(rest, true, true);
  _$jscoverage['/underscore.js'].lineData[581]++;
  return _.filter(array, function(value) {
  _$jscoverage['/underscore.js'].functionData[63]++;
  _$jscoverage['/underscore.js'].lineData[582]++;
  return !_.contains(rest, value);
});
});
  _$jscoverage['/underscore.js'].lineData[588]++;
  _.unzip = function(array) {
  _$jscoverage['/underscore.js'].functionData[64]++;
  _$jscoverage['/underscore.js'].lineData[589]++;
  var length = visit153_589_1(visit154_589_2(array && _.max(array, getLength).length) || 0);
  _$jscoverage['/underscore.js'].lineData[590]++;
  var result = Array(length);
  _$jscoverage['/underscore.js'].lineData[592]++;
  for (var index = 0; visit155_592_1(index < length); index++) {
    _$jscoverage['/underscore.js'].lineData[593]++;
    result[index] = _.pluck(array, index);
  }
  _$jscoverage['/underscore.js'].lineData[595]++;
  return result;
};
  _$jscoverage['/underscore.js'].lineData[600]++;
  _.zip = restArgs(_.unzip);
  _$jscoverage['/underscore.js'].lineData[605]++;
  _.object = function(list, values) {
  _$jscoverage['/underscore.js'].functionData[65]++;
  _$jscoverage['/underscore.js'].lineData[606]++;
  var result = {};
  _$jscoverage['/underscore.js'].lineData[607]++;
  for (var i = 0, length = getLength(list); visit156_607_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[608]++;
    if (visit157_608_1(values)) {
      _$jscoverage['/underscore.js'].lineData[609]++;
      result[list[i]] = values[i];
    } else {
      _$jscoverage['/underscore.js'].lineData[611]++;
      result[list[i][0]] = list[i][1];
    }
  }
  _$jscoverage['/underscore.js'].lineData[614]++;
  return result;
};
  _$jscoverage['/underscore.js'].lineData[618]++;
  var createPredicateIndexFinder = function(dir) {
  _$jscoverage['/underscore.js'].functionData[66]++;
  _$jscoverage['/underscore.js'].lineData[619]++;
  return function(array, predicate, context) {
  _$jscoverage['/underscore.js'].functionData[67]++;
  _$jscoverage['/underscore.js'].lineData[620]++;
  predicate = cb(predicate, context);
  _$jscoverage['/underscore.js'].lineData[621]++;
  var length = getLength(array);
  _$jscoverage['/underscore.js'].lineData[622]++;
  var index = visit158_622_1(dir > 0) ? 0 : length - 1;
  _$jscoverage['/underscore.js'].lineData[623]++;
  for (; visit159_623_1(visit160_623_2(index >= 0) && visit161_623_3(index < length)); index += dir) {
    _$jscoverage['/underscore.js'].lineData[624]++;
    if (visit162_624_1(predicate(array[index], index, array))) 
      return index;
  }
  _$jscoverage['/underscore.js'].lineData[626]++;
  return -1;
};
};
  _$jscoverage['/underscore.js'].lineData[631]++;
  _.findIndex = createPredicateIndexFinder(1);
  _$jscoverage['/underscore.js'].lineData[632]++;
  _.findLastIndex = createPredicateIndexFinder(-1);
  _$jscoverage['/underscore.js'].lineData[636]++;
  _.sortedIndex = function(array, obj, iteratee, context) {
  _$jscoverage['/underscore.js'].functionData[68]++;
  _$jscoverage['/underscore.js'].lineData[637]++;
  iteratee = cb(iteratee, context, 1);
  _$jscoverage['/underscore.js'].lineData[638]++;
  var value = iteratee(obj);
  _$jscoverage['/underscore.js'].lineData[639]++;
  var low = 0, high = getLength(array);
  _$jscoverage['/underscore.js'].lineData[640]++;
  while (visit163_640_1(low < high)) {
    _$jscoverage['/underscore.js'].lineData[641]++;
    var mid = Math.floor((low + high) / 2);
    _$jscoverage['/underscore.js'].lineData[642]++;
    if (visit164_642_1(iteratee(array[mid]) < value)) 
      low = mid + 1;
    else 
      high = mid;
  }
  _$jscoverage['/underscore.js'].lineData[644]++;
  return low;
};
  _$jscoverage['/underscore.js'].lineData[648]++;
  var createIndexFinder = function(dir, predicateFind, sortedIndex) {
  _$jscoverage['/underscore.js'].functionData[69]++;
  _$jscoverage['/underscore.js'].lineData[649]++;
  return function(array, item, idx) {
  _$jscoverage['/underscore.js'].functionData[70]++;
  _$jscoverage['/underscore.js'].lineData[650]++;
  var i = 0, length = getLength(array);
  _$jscoverage['/underscore.js'].lineData[651]++;
  if (visit165_651_1(typeof idx == 'number')) {
    _$jscoverage['/underscore.js'].lineData[652]++;
    if (visit166_652_1(dir > 0)) {
      _$jscoverage['/underscore.js'].lineData[653]++;
      i = visit167_653_1(idx >= 0) ? idx : Math.max(idx + length, i);
    } else {
      _$jscoverage['/underscore.js'].lineData[655]++;
      length = visit168_655_1(idx >= 0) ? Math.min(idx + 1, length) : idx + length + 1;
    }
  } else {
    _$jscoverage['/underscore.js'].lineData[657]++;
    if (visit169_657_1(sortedIndex && visit170_657_2(idx && length))) {
      _$jscoverage['/underscore.js'].lineData[658]++;
      idx = sortedIndex(array, item);
      _$jscoverage['/underscore.js'].lineData[659]++;
      return visit171_659_1(array[idx] === item) ? idx : -1;
    }
  }
  _$jscoverage['/underscore.js'].lineData[661]++;
  if (visit172_661_1(item !== item)) {
    _$jscoverage['/underscore.js'].lineData[662]++;
    idx = predicateFind(slice.call(array, i, length), _.isNaN);
    _$jscoverage['/underscore.js'].lineData[663]++;
    return visit173_663_1(idx >= 0) ? idx + i : -1;
  }
  _$jscoverage['/underscore.js'].lineData[665]++;
  for (idx = visit174_665_1(dir > 0) ? i : length - 1; visit175_665_2(visit176_665_3(idx >= 0) && visit177_665_4(idx < length)); idx += dir) {
    _$jscoverage['/underscore.js'].lineData[666]++;
    if (visit178_666_1(array[idx] === item)) 
      return idx;
  }
  _$jscoverage['/underscore.js'].lineData[668]++;
  return -1;
};
};
  _$jscoverage['/underscore.js'].lineData[676]++;
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _$jscoverage['/underscore.js'].lineData[677]++;
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);
  _$jscoverage['/underscore.js'].lineData[682]++;
  _.range = function(start, stop, step) {
  _$jscoverage['/underscore.js'].functionData[71]++;
  _$jscoverage['/underscore.js'].lineData[683]++;
  if (visit179_683_1(stop == null)) {
    _$jscoverage['/underscore.js'].lineData[684]++;
    stop = visit180_684_1(start || 0);
    _$jscoverage['/underscore.js'].lineData[685]++;
    start = 0;
  }
  _$jscoverage['/underscore.js'].lineData[687]++;
  step = visit181_687_1(step || 1);
  _$jscoverage['/underscore.js'].lineData[689]++;
  var length = Math.max(Math.ceil((stop - start) / step), 0);
  _$jscoverage['/underscore.js'].lineData[690]++;
  var range = Array(length);
  _$jscoverage['/underscore.js'].lineData[692]++;
  for (var idx = 0; visit182_692_1(idx < length); idx++ , start += step) {
    _$jscoverage['/underscore.js'].lineData[693]++;
    range[idx] = start;
  }
  _$jscoverage['/underscore.js'].lineData[696]++;
  return range;
};
  _$jscoverage['/underscore.js'].lineData[704]++;
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
  _$jscoverage['/underscore.js'].functionData[72]++;
  _$jscoverage['/underscore.js'].lineData[705]++;
  if (visit183_705_1(!(callingContext instanceof boundFunc))) 
    return sourceFunc.apply(context, args);
  _$jscoverage['/underscore.js'].lineData[706]++;
  var self = baseCreate(sourceFunc.prototype);
  _$jscoverage['/underscore.js'].lineData[707]++;
  var result = sourceFunc.apply(self, args);
  _$jscoverage['/underscore.js'].lineData[708]++;
  if (visit184_708_1(_.isObject(result))) 
    return result;
  _$jscoverage['/underscore.js'].lineData[709]++;
  return self;
};
  _$jscoverage['/underscore.js'].lineData[715]++;
  _.bind = restArgs(function(func, context, args) {
  _$jscoverage['/underscore.js'].functionData[73]++;
  _$jscoverage['/underscore.js'].lineData[716]++;
  if (visit185_716_1(!_.isFunction(func))) 
    throw new TypeError('Bind must be called on a function');
  _$jscoverage['/underscore.js'].lineData[717]++;
  var bound = restArgs(function(callArgs) {
  _$jscoverage['/underscore.js'].functionData[74]++;
  _$jscoverage['/underscore.js'].lineData[718]++;
  return executeBound(func, bound, context, this, args.concat(callArgs));
});
  _$jscoverage['/underscore.js'].lineData[720]++;
  return bound;
});
  _$jscoverage['/underscore.js'].lineData[727]++;
  _.partial = restArgs(function(func, boundArgs) {
  _$jscoverage['/underscore.js'].functionData[75]++;
  _$jscoverage['/underscore.js'].lineData[728]++;
  var placeholder = _.partial.placeholder;
  _$jscoverage['/underscore.js'].lineData[729]++;
  var bound = function() {
  _$jscoverage['/underscore.js'].functionData[76]++;
  _$jscoverage['/underscore.js'].lineData[730]++;
  var position = 0, length = boundArgs.length;
  _$jscoverage['/underscore.js'].lineData[731]++;
  var args = Array(length);
  _$jscoverage['/underscore.js'].lineData[732]++;
  for (var i = 0; visit186_732_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[733]++;
    args[i] = visit187_733_1(boundArgs[i] === placeholder) ? arguments[position++] : boundArgs[i];
  }
  _$jscoverage['/underscore.js'].lineData[735]++;
  while (visit188_735_1(position < arguments.length)) 
    args.push(arguments[position++]);
  _$jscoverage['/underscore.js'].lineData[736]++;
  return executeBound(func, bound, this, this, args);
};
  _$jscoverage['/underscore.js'].lineData[738]++;
  return bound;
});
  _$jscoverage['/underscore.js'].lineData[741]++;
  _.partial.placeholder = _;
  _$jscoverage['/underscore.js'].lineData[746]++;
  _.bindAll = restArgs(function(obj, keys) {
  _$jscoverage['/underscore.js'].functionData[77]++;
  _$jscoverage['/underscore.js'].lineData[747]++;
  keys = flatten(keys, false, false);
  _$jscoverage['/underscore.js'].lineData[748]++;
  var index = keys.length;
  _$jscoverage['/underscore.js'].lineData[749]++;
  if (visit189_749_1(index < 1)) 
    throw new Error('bindAll must be passed function names');
  _$jscoverage['/underscore.js'].lineData[750]++;
  while (visit190_750_1(index--)) {
    _$jscoverage['/underscore.js'].lineData[751]++;
    var key = keys[index];
    _$jscoverage['/underscore.js'].lineData[752]++;
    obj[key] = _.bind(obj[key], obj);
  }
});
  _$jscoverage['/underscore.js'].lineData[757]++;
  _.memoize = function(func, hasher) {
  _$jscoverage['/underscore.js'].functionData[78]++;
  _$jscoverage['/underscore.js'].lineData[758]++;
  var memoize = function(key) {
  _$jscoverage['/underscore.js'].functionData[79]++;
  _$jscoverage['/underscore.js'].lineData[759]++;
  var cache = memoize.cache;
  _$jscoverage['/underscore.js'].lineData[760]++;
  var address = '' + (visit191_760_1(hasher) ? hasher.apply(this, arguments) : key);
  _$jscoverage['/underscore.js'].lineData[761]++;
  if (visit192_761_1(!_.has(cache, address))) 
    cache[address] = func.apply(this, arguments);
  _$jscoverage['/underscore.js'].lineData[762]++;
  return cache[address];
};
  _$jscoverage['/underscore.js'].lineData[764]++;
  memoize.cache = {};
  _$jscoverage['/underscore.js'].lineData[765]++;
  return memoize;
};
  _$jscoverage['/underscore.js'].lineData[770]++;
  _.delay = restArgs(function(func, wait, args) {
  _$jscoverage['/underscore.js'].functionData[80]++;
  _$jscoverage['/underscore.js'].lineData[771]++;
  return setTimeout(function() {
  _$jscoverage['/underscore.js'].functionData[81]++;
  _$jscoverage['/underscore.js'].lineData[772]++;
  return func.apply(null, args);
}, wait);
});
  _$jscoverage['/underscore.js'].lineData[778]++;
  _.defer = _.partial(_.delay, _, 1);
  _$jscoverage['/underscore.js'].lineData[785]++;
  _.throttle = function(func, wait, options) {
  _$jscoverage['/underscore.js'].functionData[82]++;
  _$jscoverage['/underscore.js'].lineData[786]++;
  var context, args, result;
  _$jscoverage['/underscore.js'].lineData[787]++;
  var timeout = null;
  _$jscoverage['/underscore.js'].lineData[788]++;
  var previous = 0;
  _$jscoverage['/underscore.js'].lineData[789]++;
  if (visit193_789_1(!options)) 
    options = {};
  _$jscoverage['/underscore.js'].lineData[790]++;
  var later = function() {
  _$jscoverage['/underscore.js'].functionData[83]++;
  _$jscoverage['/underscore.js'].lineData[791]++;
  previous = visit194_791_1(options.leading === false) ? 0 : _.now();
  _$jscoverage['/underscore.js'].lineData[792]++;
  timeout = null;
  _$jscoverage['/underscore.js'].lineData[793]++;
  result = func.apply(context, args);
  _$jscoverage['/underscore.js'].lineData[794]++;
  if (visit195_794_1(!timeout)) 
    context = args = null;
};
  _$jscoverage['/underscore.js'].lineData[796]++;
  return function() {
  _$jscoverage['/underscore.js'].functionData[84]++;
  _$jscoverage['/underscore.js'].lineData[797]++;
  var now = _.now();
  _$jscoverage['/underscore.js'].lineData[798]++;
  if (visit196_798_1(!previous && visit197_798_2(options.leading === false))) 
    previous = now;
  _$jscoverage['/underscore.js'].lineData[799]++;
  var remaining = wait - (now - previous);
  _$jscoverage['/underscore.js'].lineData[800]++;
  context = this;
  _$jscoverage['/underscore.js'].lineData[801]++;
  args = arguments;
  _$jscoverage['/underscore.js'].lineData[802]++;
  if (visit198_802_1(visit199_802_2(remaining <= 0) || visit200_802_3(remaining > wait))) {
    _$jscoverage['/underscore.js'].lineData[803]++;
    if (visit201_803_1(timeout)) {
      _$jscoverage['/underscore.js'].lineData[804]++;
      clearTimeout(timeout);
      _$jscoverage['/underscore.js'].lineData[805]++;
      timeout = null;
    }
    _$jscoverage['/underscore.js'].lineData[807]++;
    previous = now;
    _$jscoverage['/underscore.js'].lineData[808]++;
    result = func.apply(context, args);
    _$jscoverage['/underscore.js'].lineData[809]++;
    if (visit202_809_1(!timeout)) 
      context = args = null;
  } else {
    _$jscoverage['/underscore.js'].lineData[810]++;
    if (visit203_810_1(!timeout && visit204_810_2(options.trailing !== false))) {
      _$jscoverage['/underscore.js'].lineData[811]++;
      timeout = setTimeout(later, remaining);
    }
  }
  _$jscoverage['/underscore.js'].lineData[813]++;
  return result;
};
};
  _$jscoverage['/underscore.js'].lineData[821]++;
  _.debounce = function(func, wait, immediate) {
  _$jscoverage['/underscore.js'].functionData[85]++;
  _$jscoverage['/underscore.js'].lineData[822]++;
  var timeout, args, context, timestamp, result;
  _$jscoverage['/underscore.js'].lineData[824]++;
  var later = function() {
  _$jscoverage['/underscore.js'].functionData[86]++;
  _$jscoverage['/underscore.js'].lineData[825]++;
  var last = _.now() - timestamp;
  _$jscoverage['/underscore.js'].lineData[827]++;
  if (visit205_827_1(visit206_827_2(last < wait) && visit207_827_3(last >= 0))) {
    _$jscoverage['/underscore.js'].lineData[828]++;
    timeout = setTimeout(later, wait - last);
  } else {
    _$jscoverage['/underscore.js'].lineData[830]++;
    timeout = null;
    _$jscoverage['/underscore.js'].lineData[831]++;
    if (visit208_831_1(!immediate)) {
      _$jscoverage['/underscore.js'].lineData[832]++;
      result = func.apply(context, args);
      _$jscoverage['/underscore.js'].lineData[833]++;
      if (visit209_833_1(!timeout)) 
        context = args = null;
    }
  }
};
  _$jscoverage['/underscore.js'].lineData[838]++;
  return function() {
  _$jscoverage['/underscore.js'].functionData[87]++;
  _$jscoverage['/underscore.js'].lineData[839]++;
  context = this;
  _$jscoverage['/underscore.js'].lineData[840]++;
  args = arguments;
  _$jscoverage['/underscore.js'].lineData[841]++;
  timestamp = _.now();
  _$jscoverage['/underscore.js'].lineData[842]++;
  var callNow = visit210_842_1(immediate && !timeout);
  _$jscoverage['/underscore.js'].lineData[843]++;
  if (visit211_843_1(!timeout)) 
    timeout = setTimeout(later, wait);
  _$jscoverage['/underscore.js'].lineData[844]++;
  if (visit212_844_1(callNow)) {
    _$jscoverage['/underscore.js'].lineData[845]++;
    result = func.apply(context, args);
    _$jscoverage['/underscore.js'].lineData[846]++;
    context = args = null;
  }
  _$jscoverage['/underscore.js'].lineData[849]++;
  return result;
};
};
  _$jscoverage['/underscore.js'].lineData[856]++;
  _.wrap = function(func, wrapper) {
  _$jscoverage['/underscore.js'].functionData[88]++;
  _$jscoverage['/underscore.js'].lineData[857]++;
  return _.partial(wrapper, func);
};
  _$jscoverage['/underscore.js'].lineData[861]++;
  _.negate = function(predicate) {
  _$jscoverage['/underscore.js'].functionData[89]++;
  _$jscoverage['/underscore.js'].lineData[862]++;
  return function() {
  _$jscoverage['/underscore.js'].functionData[90]++;
  _$jscoverage['/underscore.js'].lineData[863]++;
  return !predicate.apply(this, arguments);
};
};
  _$jscoverage['/underscore.js'].lineData[869]++;
  _.compose = function() {
  _$jscoverage['/underscore.js'].functionData[91]++;
  _$jscoverage['/underscore.js'].lineData[870]++;
  var args = arguments;
  _$jscoverage['/underscore.js'].lineData[871]++;
  var start = args.length - 1;
  _$jscoverage['/underscore.js'].lineData[872]++;
  return function() {
  _$jscoverage['/underscore.js'].functionData[92]++;
  _$jscoverage['/underscore.js'].lineData[873]++;
  var i = start;
  _$jscoverage['/underscore.js'].lineData[874]++;
  var result = args[start].apply(this, arguments);
  _$jscoverage['/underscore.js'].lineData[875]++;
  while (visit213_875_1(i--)) 
    result = args[i].call(this, result);
  _$jscoverage['/underscore.js'].lineData[876]++;
  return result;
};
};
  _$jscoverage['/underscore.js'].lineData[881]++;
  _.after = function(times, func) {
  _$jscoverage['/underscore.js'].functionData[93]++;
  _$jscoverage['/underscore.js'].lineData[882]++;
  return function() {
  _$jscoverage['/underscore.js'].functionData[94]++;
  _$jscoverage['/underscore.js'].lineData[883]++;
  if (visit214_883_1(--times < 1)) {
    _$jscoverage['/underscore.js'].lineData[884]++;
    return func.apply(this, arguments);
  }
};
};
  _$jscoverage['/underscore.js'].lineData[890]++;
  _.before = function(times, func) {
  _$jscoverage['/underscore.js'].functionData[95]++;
  _$jscoverage['/underscore.js'].lineData[891]++;
  var memo;
  _$jscoverage['/underscore.js'].lineData[892]++;
  return function() {
  _$jscoverage['/underscore.js'].functionData[96]++;
  _$jscoverage['/underscore.js'].lineData[893]++;
  if (visit215_893_1(--times > 0)) {
    _$jscoverage['/underscore.js'].lineData[894]++;
    memo = func.apply(this, arguments);
  }
  _$jscoverage['/underscore.js'].lineData[896]++;
  if (visit216_896_1(times <= 1)) 
    func = null;
  _$jscoverage['/underscore.js'].lineData[897]++;
  return memo;
};
};
  _$jscoverage['/underscore.js'].lineData[903]++;
  _.once = _.partial(_.before, 2);
  _$jscoverage['/underscore.js'].lineData[905]++;
  _.restArgs = restArgs;
  _$jscoverage['/underscore.js'].lineData[911]++;
  var hasEnumBug = !{
  toString: null}.propertyIsEnumerable('toString');
  _$jscoverage['/underscore.js'].lineData[912]++;
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
  _$jscoverage['/underscore.js'].lineData[915]++;
  var collectNonEnumProps = function(obj, keys) {
  _$jscoverage['/underscore.js'].functionData[97]++;
  _$jscoverage['/underscore.js'].lineData[916]++;
  var nonEnumIdx = nonEnumerableProps.length;
  _$jscoverage['/underscore.js'].lineData[917]++;
  var constructor = obj.constructor;
  _$jscoverage['/underscore.js'].lineData[918]++;
  var proto = visit217_918_1(visit218_918_2(_.isFunction(constructor) && constructor.prototype) || ObjProto);
  _$jscoverage['/underscore.js'].lineData[921]++;
  var prop = 'constructor';
  _$jscoverage['/underscore.js'].lineData[922]++;
  if (visit219_922_1(_.has(obj, prop) && !_.contains(keys, prop))) 
    keys.push(prop);
  _$jscoverage['/underscore.js'].lineData[924]++;
  while (visit220_924_1(nonEnumIdx--)) {
    _$jscoverage['/underscore.js'].lineData[925]++;
    prop = nonEnumerableProps[nonEnumIdx];
    _$jscoverage['/underscore.js'].lineData[926]++;
    if (visit221_926_1(prop in obj && visit222_926_2(visit223_926_3(obj[prop] !== proto[prop]) && !_.contains(keys, prop)))) {
      _$jscoverage['/underscore.js'].lineData[927]++;
      keys.push(prop);
    }
  }
};
  _$jscoverage['/underscore.js'].lineData[934]++;
  _.keys = function(obj) {
  _$jscoverage['/underscore.js'].functionData[98]++;
  _$jscoverage['/underscore.js'].lineData[935]++;
  if (visit224_935_1(!_.isObject(obj))) 
    return [];
  _$jscoverage['/underscore.js'].lineData[936]++;
  if (visit225_936_1(nativeKeys)) 
    return nativeKeys(obj);
  _$jscoverage['/underscore.js'].lineData[937]++;
  var keys = [];
  _$jscoverage['/underscore.js'].lineData[938]++;
  for (var key in obj) 
    if (visit226_938_1(_.has(obj, key))) 
      keys.push(key);
  _$jscoverage['/underscore.js'].lineData[940]++;
  if (visit227_940_1(hasEnumBug)) 
    collectNonEnumProps(obj, keys);
  _$jscoverage['/underscore.js'].lineData[941]++;
  return keys;
};
  _$jscoverage['/underscore.js'].lineData[945]++;
  _.allKeys = function(obj) {
  _$jscoverage['/underscore.js'].functionData[99]++;
  _$jscoverage['/underscore.js'].lineData[946]++;
  if (visit228_946_1(!_.isObject(obj))) 
    return [];
  _$jscoverage['/underscore.js'].lineData[947]++;
  var keys = [];
  _$jscoverage['/underscore.js'].lineData[948]++;
  for (var key in obj) 
    keys.push(key);
  _$jscoverage['/underscore.js'].lineData[950]++;
  if (visit229_950_1(hasEnumBug)) 
    collectNonEnumProps(obj, keys);
  _$jscoverage['/underscore.js'].lineData[951]++;
  return keys;
};
  _$jscoverage['/underscore.js'].lineData[955]++;
  _.values = function(obj) {
  _$jscoverage['/underscore.js'].functionData[100]++;
  _$jscoverage['/underscore.js'].lineData[956]++;
  var keys = _.keys(obj);
  _$jscoverage['/underscore.js'].lineData[957]++;
  var length = keys.length;
  _$jscoverage['/underscore.js'].lineData[958]++;
  var values = Array(length);
  _$jscoverage['/underscore.js'].lineData[959]++;
  for (var i = 0; visit230_959_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[960]++;
    values[i] = obj[keys[i]];
  }
  _$jscoverage['/underscore.js'].lineData[962]++;
  return values;
};
  _$jscoverage['/underscore.js'].lineData[967]++;
  _.mapObject = function(obj, iteratee, context) {
  _$jscoverage['/underscore.js'].functionData[101]++;
  _$jscoverage['/underscore.js'].lineData[968]++;
  iteratee = cb(iteratee, context);
  _$jscoverage['/underscore.js'].lineData[969]++;
  var keys = _.keys(obj), length = keys.length, results = {};
  _$jscoverage['/underscore.js'].lineData[972]++;
  for (var index = 0; visit231_972_1(index < length); index++) {
    _$jscoverage['/underscore.js'].lineData[973]++;
    var currentKey = keys[index];
    _$jscoverage['/underscore.js'].lineData[974]++;
    results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
  }
  _$jscoverage['/underscore.js'].lineData[976]++;
  return results;
};
  _$jscoverage['/underscore.js'].lineData[980]++;
  _.pairs = function(obj) {
  _$jscoverage['/underscore.js'].functionData[102]++;
  _$jscoverage['/underscore.js'].lineData[981]++;
  var keys = _.keys(obj);
  _$jscoverage['/underscore.js'].lineData[982]++;
  var length = keys.length;
  _$jscoverage['/underscore.js'].lineData[983]++;
  var pairs = Array(length);
  _$jscoverage['/underscore.js'].lineData[984]++;
  for (var i = 0; visit232_984_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[985]++;
    pairs[i] = [keys[i], obj[keys[i]]];
  }
  _$jscoverage['/underscore.js'].lineData[987]++;
  return pairs;
};
  _$jscoverage['/underscore.js'].lineData[991]++;
  _.invert = function(obj) {
  _$jscoverage['/underscore.js'].functionData[103]++;
  _$jscoverage['/underscore.js'].lineData[992]++;
  var result = {};
  _$jscoverage['/underscore.js'].lineData[993]++;
  var keys = _.keys(obj);
  _$jscoverage['/underscore.js'].lineData[994]++;
  for (var i = 0, length = keys.length; visit233_994_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[995]++;
    result[obj[keys[i]]] = keys[i];
  }
  _$jscoverage['/underscore.js'].lineData[997]++;
  return result;
};
  _$jscoverage['/underscore.js'].lineData[1002]++;
  _.functions = _.methods = function(obj) {
  _$jscoverage['/underscore.js'].functionData[104]++;
  _$jscoverage['/underscore.js'].lineData[1003]++;
  var names = [];
  _$jscoverage['/underscore.js'].lineData[1004]++;
  for (var key in obj) {
    _$jscoverage['/underscore.js'].lineData[1005]++;
    if (visit234_1005_1(_.isFunction(obj[key]))) 
      names.push(key);
  }
  _$jscoverage['/underscore.js'].lineData[1007]++;
  return names.sort();
};
  _$jscoverage['/underscore.js'].lineData[1011]++;
  var createAssigner = function(keysFunc, undefinedOnly) {
  _$jscoverage['/underscore.js'].functionData[105]++;
  _$jscoverage['/underscore.js'].lineData[1012]++;
  return function(obj) {
  _$jscoverage['/underscore.js'].functionData[106]++;
  _$jscoverage['/underscore.js'].lineData[1013]++;
  var length = arguments.length;
  _$jscoverage['/underscore.js'].lineData[1014]++;
  if (visit235_1014_1(visit236_1014_2(length < 2) || visit237_1014_3(obj == null))) 
    return obj;
  _$jscoverage['/underscore.js'].lineData[1015]++;
  for (var index = 1; visit238_1015_1(index < length); index++) {
    _$jscoverage['/underscore.js'].lineData[1016]++;
    var source = arguments[index], keys = keysFunc(source), l = keys.length;
    _$jscoverage['/underscore.js'].lineData[1019]++;
    for (var i = 0; visit239_1019_1(i < l); i++) {
      _$jscoverage['/underscore.js'].lineData[1020]++;
      var key = keys[i];
      _$jscoverage['/underscore.js'].lineData[1021]++;
      if (visit240_1021_1(!undefinedOnly || visit241_1021_2(obj[key] === void 0))) 
        obj[key] = source[key];
    }
  }
  _$jscoverage['/underscore.js'].lineData[1024]++;
  return obj;
};
};
  _$jscoverage['/underscore.js'].lineData[1029]++;
  _.extend = createAssigner(_.allKeys);
  _$jscoverage['/underscore.js'].lineData[1033]++;
  _.extendOwn = _.assign = createAssigner(_.keys);
  _$jscoverage['/underscore.js'].lineData[1036]++;
  _.findKey = function(obj, predicate, context) {
  _$jscoverage['/underscore.js'].functionData[107]++;
  _$jscoverage['/underscore.js'].lineData[1037]++;
  predicate = cb(predicate, context);
  _$jscoverage['/underscore.js'].lineData[1038]++;
  var keys = _.keys(obj), key;
  _$jscoverage['/underscore.js'].lineData[1039]++;
  for (var i = 0, length = keys.length; visit242_1039_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[1040]++;
    key = keys[i];
    _$jscoverage['/underscore.js'].lineData[1041]++;
    if (visit243_1041_1(predicate(obj[key], key, obj))) 
      return key;
  }
};
  _$jscoverage['/underscore.js'].lineData[1046]++;
  var keyInObj = function(value, key, obj) {
  _$jscoverage['/underscore.js'].functionData[108]++;
  _$jscoverage['/underscore.js'].lineData[1047]++;
  return key in obj;
};
  _$jscoverage['/underscore.js'].lineData[1051]++;
  _.pick = restArgs(function(obj, keys) {
  _$jscoverage['/underscore.js'].functionData[109]++;
  _$jscoverage['/underscore.js'].lineData[1052]++;
  var result = {}, iteratee = keys[0];
  _$jscoverage['/underscore.js'].lineData[1053]++;
  if (visit244_1053_1(obj == null)) 
    return result;
  _$jscoverage['/underscore.js'].lineData[1054]++;
  if (visit245_1054_1(_.isFunction(iteratee))) {
    _$jscoverage['/underscore.js'].lineData[1055]++;
    if (visit246_1055_1(keys.length > 1)) 
      iteratee = optimizeCb(iteratee, keys[1]);
    _$jscoverage['/underscore.js'].lineData[1056]++;
    keys = _.allKeys(obj);
  } else {
    _$jscoverage['/underscore.js'].lineData[1058]++;
    iteratee = keyInObj;
    _$jscoverage['/underscore.js'].lineData[1059]++;
    keys = flatten(keys, false, false);
    _$jscoverage['/underscore.js'].lineData[1060]++;
    obj = Object(obj);
  }
  _$jscoverage['/underscore.js'].lineData[1062]++;
  for (var i = 0, length = keys.length; visit247_1062_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[1063]++;
    var key = keys[i];
    _$jscoverage['/underscore.js'].lineData[1064]++;
    var value = obj[key];
    _$jscoverage['/underscore.js'].lineData[1065]++;
    if (visit248_1065_1(iteratee(value, key, obj))) 
      result[key] = value;
  }
  _$jscoverage['/underscore.js'].lineData[1067]++;
  return result;
});
  _$jscoverage['/underscore.js'].lineData[1071]++;
  _.omit = restArgs(function(obj, keys) {
  _$jscoverage['/underscore.js'].functionData[110]++;
  _$jscoverage['/underscore.js'].lineData[1072]++;
  var iteratee = keys[0], context;
  _$jscoverage['/underscore.js'].lineData[1073]++;
  if (visit249_1073_1(_.isFunction(iteratee))) {
    _$jscoverage['/underscore.js'].lineData[1074]++;
    iteratee = _.negate(iteratee);
    _$jscoverage['/underscore.js'].lineData[1075]++;
    if (visit250_1075_1(keys.length > 1)) 
      context = keys[1];
  } else {
    _$jscoverage['/underscore.js'].lineData[1077]++;
    keys = _.map(flatten(keys, false, false), String);
    _$jscoverage['/underscore.js'].lineData[1078]++;
    iteratee = function(value, key) {
  _$jscoverage['/underscore.js'].functionData[111]++;
  _$jscoverage['/underscore.js'].lineData[1079]++;
  return !_.contains(keys, key);
};
  }
  _$jscoverage['/underscore.js'].lineData[1082]++;
  return _.pick(obj, iteratee, context);
});
  _$jscoverage['/underscore.js'].lineData[1086]++;
  _.defaults = createAssigner(_.allKeys, true);
  _$jscoverage['/underscore.js'].lineData[1091]++;
  _.create = function(prototype, props) {
  _$jscoverage['/underscore.js'].functionData[112]++;
  _$jscoverage['/underscore.js'].lineData[1092]++;
  var result = baseCreate(prototype);
  _$jscoverage['/underscore.js'].lineData[1093]++;
  if (visit251_1093_1(props)) 
    _.extendOwn(result, props);
  _$jscoverage['/underscore.js'].lineData[1094]++;
  return result;
};
  _$jscoverage['/underscore.js'].lineData[1098]++;
  _.clone = function(obj) {
  _$jscoverage['/underscore.js'].functionData[113]++;
  _$jscoverage['/underscore.js'].lineData[1099]++;
  if (visit252_1099_1(!_.isObject(obj))) 
    return obj;
  _$jscoverage['/underscore.js'].lineData[1100]++;
  return visit253_1100_1(_.isArray(obj)) ? obj.slice() : _.extend({}, obj);
};
  _$jscoverage['/underscore.js'].lineData[1106]++;
  _.tap = function(obj, interceptor) {
  _$jscoverage['/underscore.js'].functionData[114]++;
  _$jscoverage['/underscore.js'].lineData[1107]++;
  interceptor(obj);
  _$jscoverage['/underscore.js'].lineData[1108]++;
  return obj;
};
  _$jscoverage['/underscore.js'].lineData[1112]++;
  _.isMatch = function(object, attrs) {
  _$jscoverage['/underscore.js'].functionData[115]++;
  _$jscoverage['/underscore.js'].lineData[1113]++;
  var keys = _.keys(attrs), length = keys.length;
  _$jscoverage['/underscore.js'].lineData[1114]++;
  if (visit254_1114_1(object == null)) 
    return !length;
  _$jscoverage['/underscore.js'].lineData[1115]++;
  var obj = Object(object);
  _$jscoverage['/underscore.js'].lineData[1116]++;
  for (var i = 0; visit255_1116_1(i < length); i++) {
    _$jscoverage['/underscore.js'].lineData[1117]++;
    var key = keys[i];
    _$jscoverage['/underscore.js'].lineData[1118]++;
    if (visit256_1118_1(visit257_1118_2(attrs[key] !== obj[key]) || !(key in obj))) 
      return false;
  }
  _$jscoverage['/underscore.js'].lineData[1120]++;
  return true;
};
  _$jscoverage['/underscore.js'].lineData[1125]++;
  var eq, deepEq;
  _$jscoverage['/underscore.js'].lineData[1126]++;
  eq = function(a, b, aStack, bStack) {
  _$jscoverage['/underscore.js'].functionData[116]++;
  _$jscoverage['/underscore.js'].lineData[1129]++;
  if (visit258_1129_1(a === b)) 
    return visit259_1129_2(visit260_1129_3(a !== 0) || visit261_1129_4(1 / a === 1 / b));
  _$jscoverage['/underscore.js'].lineData[1131]++;
  if (visit262_1131_1(visit263_1131_2(a == null) || visit264_1131_3(b == null))) 
    return visit265_1131_4(a === b);
  _$jscoverage['/underscore.js'].lineData[1133]++;
  if (visit266_1133_1(a !== a)) 
    return visit267_1133_2(b !== b);
  _$jscoverage['/underscore.js'].lineData[1135]++;
  var type = typeof a;
  _$jscoverage['/underscore.js'].lineData[1136]++;
  if (visit268_1136_1(visit269_1136_2(type !== 'function') && visit270_1136_3(visit271_1136_4(type !== 'object') && visit272_1136_5(typeof b !== 'object')))) 
    return false;
  _$jscoverage['/underscore.js'].lineData[1137]++;
  return deepEq(a, b, aStack, bStack);
};
  _$jscoverage['/underscore.js'].lineData[1141]++;
  deepEq = function(a, b, aStack, bStack) {
  _$jscoverage['/underscore.js'].functionData[117]++;
  _$jscoverage['/underscore.js'].lineData[1143]++;
  if (visit273_1143_1(a instanceof _)) 
    a = a._wrapped;
  _$jscoverage['/underscore.js'].lineData[1144]++;
  if (visit274_1144_1(b instanceof _)) 
    b = b._wrapped;
  _$jscoverage['/underscore.js'].lineData[1146]++;
  var className = toString.call(a);
  _$jscoverage['/underscore.js'].lineData[1147]++;
  if (visit275_1147_1(className !== toString.call(b))) 
    return false;
  _$jscoverage['/underscore.js'].lineData[1148]++;
  switch (className) {
    case '[object RegExp]':
    case '[object String]':
      _$jscoverage['/underscore.js'].lineData[1155]++;
      return visit276_1155_1('' + a === '' + b);
    case '[object Number]':
      _$jscoverage['/underscore.js'].lineData[1159]++;
      if (visit277_1159_1(+a !== +a)) 
        return visit278_1159_2(+b !== +b);
      _$jscoverage['/underscore.js'].lineData[1161]++;
      return visit279_1161_1(+a === 0) ? visit280_1161_2(1 / +a === 1 / b) : visit281_1161_3(+a === +b);
    case '[object Date]':
    case '[object Boolean]':
      _$jscoverage['/underscore.js'].lineData[1167]++;
      return visit282_1167_1(+a === +b);
  }
  _$jscoverage['/underscore.js'].lineData[1170]++;
  var areArrays = visit283_1170_1(className === '[object Array]');
  _$jscoverage['/underscore.js'].lineData[1171]++;
  if (visit284_1171_1(!areArrays)) {
    _$jscoverage['/underscore.js'].lineData[1172]++;
    if (visit285_1172_1(visit286_1172_2(typeof a != 'object') || visit287_1172_3(typeof b != 'object'))) 
      return false;
    _$jscoverage['/underscore.js'].lineData[1176]++;
    var aCtor = a.constructor, bCtor = b.constructor;
    _$jscoverage['/underscore.js'].lineData[1177]++;
    if (visit288_1177_1(visit289_1177_2(aCtor !== bCtor) && visit290_1177_3(!(visit291_1177_4(_.isFunction(aCtor) && visit292_1177_5(aCtor instanceof aCtor && visit293_1178_1(_.isFunction(bCtor) && bCtor instanceof bCtor)))) && (visit294_1179_1('constructor' in a && 'constructor' in b))))) {
      _$jscoverage['/underscore.js'].lineData[1180]++;
      return false;
    }
  }
  _$jscoverage['/underscore.js'].lineData[1188]++;
  aStack = visit295_1188_1(aStack || []);
  _$jscoverage['/underscore.js'].lineData[1189]++;
  bStack = visit296_1189_1(bStack || []);
  _$jscoverage['/underscore.js'].lineData[1190]++;
  var length = aStack.length;
  _$jscoverage['/underscore.js'].lineData[1191]++;
  while (visit297_1191_1(length--)) {
    _$jscoverage['/underscore.js'].lineData[1194]++;
    if (visit298_1194_1(aStack[length] === a)) 
      return visit299_1194_2(bStack[length] === b);
  }
  _$jscoverage['/underscore.js'].lineData[1198]++;
  aStack.push(a);
  _$jscoverage['/underscore.js'].lineData[1199]++;
  bStack.push(b);
  _$jscoverage['/underscore.js'].lineData[1202]++;
  if (visit300_1202_1(areArrays)) {
    _$jscoverage['/underscore.js'].lineData[1204]++;
    length = a.length;
    _$jscoverage['/underscore.js'].lineData[1205]++;
    if (visit301_1205_1(length !== b.length)) 
      return false;
    _$jscoverage['/underscore.js'].lineData[1207]++;
    while (visit302_1207_1(length--)) {
      _$jscoverage['/underscore.js'].lineData[1208]++;
      if (visit303_1208_1(!eq(a[length], b[length], aStack, bStack))) 
        return false;
    }
  } else {
    _$jscoverage['/underscore.js'].lineData[1212]++;
    var keys = _.keys(a), key;
    _$jscoverage['/underscore.js'].lineData[1213]++;
    length = keys.length;
    _$jscoverage['/underscore.js'].lineData[1215]++;
    if (visit304_1215_1(_.keys(b).length !== length)) 
      return false;
    _$jscoverage['/underscore.js'].lineData[1216]++;
    while (visit305_1216_1(length--)) {
      _$jscoverage['/underscore.js'].lineData[1218]++;
      key = keys[length];
      _$jscoverage['/underscore.js'].lineData[1219]++;
      if (visit306_1219_1(!(visit307_1219_2(_.has(b, key) && eq(a[key], b[key], aStack, bStack))))) 
        return false;
    }
  }
  _$jscoverage['/underscore.js'].lineData[1223]++;
  aStack.pop();
  _$jscoverage['/underscore.js'].lineData[1224]++;
  bStack.pop();
  _$jscoverage['/underscore.js'].lineData[1225]++;
  return true;
};
  _$jscoverage['/underscore.js'].lineData[1229]++;
  _.isEqual = function(a, b) {
  _$jscoverage['/underscore.js'].functionData[118]++;
  _$jscoverage['/underscore.js'].lineData[1230]++;
  return eq(a, b);
};
  _$jscoverage['/underscore.js'].lineData[1235]++;
  _.isEmpty = function(obj) {
  _$jscoverage['/underscore.js'].functionData[119]++;
  _$jscoverage['/underscore.js'].lineData[1236]++;
  if (visit308_1236_1(obj == null)) 
    return true;
  _$jscoverage['/underscore.js'].lineData[1237]++;
  if (visit309_1237_1(isArrayLike(obj) && (visit310_1237_2(_.isArray(obj) || visit311_1237_3(_.isString(obj) || _.isArguments(obj)))))) 
    return visit312_1237_4(obj.length === 0);
  _$jscoverage['/underscore.js'].lineData[1238]++;
  return visit313_1238_1(_.keys(obj).length === 0);
};
  _$jscoverage['/underscore.js'].lineData[1242]++;
  _.isElement = function(obj) {
  _$jscoverage['/underscore.js'].functionData[120]++;
  _$jscoverage['/underscore.js'].lineData[1243]++;
  return !!(visit314_1243_1(obj && visit315_1243_2(obj.nodeType === 1)));
};
  _$jscoverage['/underscore.js'].lineData[1248]++;
  _.isArray = visit316_1248_1(nativeIsArray || function(obj) {
  _$jscoverage['/underscore.js'].functionData[121]++;
  _$jscoverage['/underscore.js'].lineData[1249]++;
  return visit317_1249_1(toString.call(obj) === '[object Array]');
});
  _$jscoverage['/underscore.js'].lineData[1253]++;
  _.isObject = function(obj) {
  _$jscoverage['/underscore.js'].functionData[122]++;
  _$jscoverage['/underscore.js'].lineData[1254]++;
  var type = typeof obj;
  _$jscoverage['/underscore.js'].lineData[1255]++;
  return visit318_1255_1(visit319_1255_2(type === 'function') || visit320_1255_3(visit321_1255_4(type === 'object') && !!obj));
};
  _$jscoverage['/underscore.js'].lineData[1259]++;
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
  _$jscoverage['/underscore.js'].functionData[123]++;
  _$jscoverage['/underscore.js'].lineData[1260]++;
  _['is' + name] = function(obj) {
  _$jscoverage['/underscore.js'].functionData[124]++;
  _$jscoverage['/underscore.js'].lineData[1261]++;
  return visit322_1261_1(toString.call(obj) === '[object ' + name + ']');
};
});
  _$jscoverage['/underscore.js'].lineData[1267]++;
  if (visit323_1267_1(!_.isArguments(arguments))) {
    _$jscoverage['/underscore.js'].lineData[1268]++;
    _.isArguments = function(obj) {
  _$jscoverage['/underscore.js'].functionData[125]++;
  _$jscoverage['/underscore.js'].lineData[1269]++;
  return _.has(obj, 'callee');
};
  }
  _$jscoverage['/underscore.js'].lineData[1275]++;
  if (visit324_1275_1(visit325_1275_2(typeof /./ != 'function') && visit326_1275_3(typeof Int8Array != 'object'))) {
    _$jscoverage['/underscore.js'].lineData[1276]++;
    _.isFunction = function(obj) {
  _$jscoverage['/underscore.js'].functionData[126]++;
  _$jscoverage['/underscore.js'].lineData[1277]++;
  return visit327_1277_1(visit328_1277_2(typeof obj == 'function') || false);
};
  }
  _$jscoverage['/underscore.js'].lineData[1282]++;
  _.isFinite = function(obj) {
  _$jscoverage['/underscore.js'].functionData[127]++;
  _$jscoverage['/underscore.js'].lineData[1283]++;
  return visit329_1283_1(isFinite(obj) && !isNaN(parseFloat(obj)));
};
  _$jscoverage['/underscore.js'].lineData[1287]++;
  _.isNaN = function(obj) {
  _$jscoverage['/underscore.js'].functionData[128]++;
  _$jscoverage['/underscore.js'].lineData[1288]++;
  return visit330_1288_1(_.isNumber(obj) && visit331_1288_2(obj !== +obj));
};
  _$jscoverage['/underscore.js'].lineData[1292]++;
  _.isBoolean = function(obj) {
  _$jscoverage['/underscore.js'].functionData[129]++;
  _$jscoverage['/underscore.js'].lineData[1293]++;
  return visit332_1293_1(visit333_1293_2(obj === true) || visit334_1293_3(visit335_1293_4(obj === false) || visit336_1293_5(toString.call(obj) === '[object Boolean]')));
};
  _$jscoverage['/underscore.js'].lineData[1297]++;
  _.isNull = function(obj) {
  _$jscoverage['/underscore.js'].functionData[130]++;
  _$jscoverage['/underscore.js'].lineData[1298]++;
  return visit337_1298_1(obj === null);
};
  _$jscoverage['/underscore.js'].lineData[1302]++;
  _.isUndefined = function(obj) {
  _$jscoverage['/underscore.js'].functionData[131]++;
  _$jscoverage['/underscore.js'].lineData[1303]++;
  return visit338_1303_1(obj === void 0);
};
  _$jscoverage['/underscore.js'].lineData[1308]++;
  _.has = function(obj, key) {
  _$jscoverage['/underscore.js'].functionData[132]++;
  _$jscoverage['/underscore.js'].lineData[1309]++;
  return visit339_1309_1(visit340_1309_2(obj != null) && hasOwnProperty.call(obj, key));
};
  _$jscoverage['/underscore.js'].lineData[1317]++;
  _.noConflict = function() {
  _$jscoverage['/underscore.js'].functionData[133]++;
  _$jscoverage['/underscore.js'].lineData[1318]++;
  root._ = previousUnderscore;
  _$jscoverage['/underscore.js'].lineData[1319]++;
  return this;
};
  _$jscoverage['/underscore.js'].lineData[1323]++;
  _.identity = function(value) {
  _$jscoverage['/underscore.js'].functionData[134]++;
  _$jscoverage['/underscore.js'].lineData[1324]++;
  return value;
};
  _$jscoverage['/underscore.js'].lineData[1328]++;
  _.constant = function(value) {
  _$jscoverage['/underscore.js'].functionData[135]++;
  _$jscoverage['/underscore.js'].lineData[1329]++;
  return function() {
  _$jscoverage['/underscore.js'].functionData[136]++;
  _$jscoverage['/underscore.js'].lineData[1330]++;
  return value;
};
};
  _$jscoverage['/underscore.js'].lineData[1334]++;
  _.noop = function() {
  _$jscoverage['/underscore.js'].functionData[137]++;
};
  _$jscoverage['/underscore.js'].lineData[1336]++;
  _.property = property;
  _$jscoverage['/underscore.js'].lineData[1339]++;
  _.propertyOf = function(obj) {
  _$jscoverage['/underscore.js'].functionData[138]++;
  _$jscoverage['/underscore.js'].lineData[1340]++;
  return visit341_1340_1(obj == null) ? function() {
  _$jscoverage['/underscore.js'].functionData[139]++;
} : function(key) {
  _$jscoverage['/underscore.js'].functionData[140]++;
  _$jscoverage['/underscore.js'].lineData[1341]++;
  return obj[key];
};
};
  _$jscoverage['/underscore.js'].lineData[1347]++;
  _.matcher = _.matches = function(attrs) {
  _$jscoverage['/underscore.js'].functionData[141]++;
  _$jscoverage['/underscore.js'].lineData[1348]++;
  attrs = _.extendOwn({}, attrs);
  _$jscoverage['/underscore.js'].lineData[1349]++;
  return function(obj) {
  _$jscoverage['/underscore.js'].functionData[142]++;
  _$jscoverage['/underscore.js'].lineData[1350]++;
  return _.isMatch(obj, attrs);
};
};
  _$jscoverage['/underscore.js'].lineData[1355]++;
  _.times = function(n, iteratee, context) {
  _$jscoverage['/underscore.js'].functionData[143]++;
  _$jscoverage['/underscore.js'].lineData[1356]++;
  var accum = Array(Math.max(0, n));
  _$jscoverage['/underscore.js'].lineData[1357]++;
  iteratee = optimizeCb(iteratee, context, 1);
  _$jscoverage['/underscore.js'].lineData[1358]++;
  for (var i = 0; visit342_1358_1(i < n); i++) 
    accum[i] = iteratee(i);
  _$jscoverage['/underscore.js'].lineData[1359]++;
  return accum;
};
  _$jscoverage['/underscore.js'].lineData[1363]++;
  _.random = function(min, max) {
  _$jscoverage['/underscore.js'].functionData[144]++;
  _$jscoverage['/underscore.js'].lineData[1364]++;
  if (visit343_1364_1(max == null)) {
    _$jscoverage['/underscore.js'].lineData[1365]++;
    max = min;
    _$jscoverage['/underscore.js'].lineData[1366]++;
    min = 0;
  }
  _$jscoverage['/underscore.js'].lineData[1368]++;
  return min + Math.floor(Math.random() * (max - min + 1));
};
  _$jscoverage['/underscore.js'].lineData[1372]++;
  _.now = visit344_1372_1(Date.now || function() {
  _$jscoverage['/underscore.js'].functionData[145]++;
  _$jscoverage['/underscore.js'].lineData[1373]++;
  return new Date().getTime();
});
  _$jscoverage['/underscore.js'].lineData[1377]++;
  var escapeMap = {
  '&': '&amp;', 
  '<': '&lt;', 
  '>': '&gt;', 
  '"': '&quot;', 
  "'": '&#x27;', 
  '`': '&#x60;'};
  _$jscoverage['/underscore.js'].lineData[1385]++;
  var unescapeMap = _.invert(escapeMap);
  _$jscoverage['/underscore.js'].lineData[1388]++;
  var createEscaper = function(map) {
  _$jscoverage['/underscore.js'].functionData[146]++;
  _$jscoverage['/underscore.js'].lineData[1389]++;
  var escaper = function(match) {
  _$jscoverage['/underscore.js'].functionData[147]++;
  _$jscoverage['/underscore.js'].lineData[1390]++;
  return map[match];
};
  _$jscoverage['/underscore.js'].lineData[1393]++;
  var source = '(?:' + _.keys(map).join('|') + ')';
  _$jscoverage['/underscore.js'].lineData[1394]++;
  var testRegexp = RegExp(source);
  _$jscoverage['/underscore.js'].lineData[1395]++;
  var replaceRegexp = RegExp(source, 'g');
  _$jscoverage['/underscore.js'].lineData[1396]++;
  return function(string) {
  _$jscoverage['/underscore.js'].functionData[148]++;
  _$jscoverage['/underscore.js'].lineData[1397]++;
  string = visit345_1397_1(string == null) ? '' : '' + string;
  _$jscoverage['/underscore.js'].lineData[1398]++;
  return visit346_1398_1(testRegexp.test(string)) ? string.replace(replaceRegexp, escaper) : string;
};
};
  _$jscoverage['/underscore.js'].lineData[1401]++;
  _.escape = createEscaper(escapeMap);
  _$jscoverage['/underscore.js'].lineData[1402]++;
  _.unescape = createEscaper(unescapeMap);
  _$jscoverage['/underscore.js'].lineData[1406]++;
  _.result = function(object, prop, fallback) {
  _$jscoverage['/underscore.js'].functionData[149]++;
  _$jscoverage['/underscore.js'].lineData[1407]++;
  var value = visit347_1407_1(object == null) ? void 0 : object[prop];
  _$jscoverage['/underscore.js'].lineData[1408]++;
  if (visit348_1408_1(value === void 0)) {
    _$jscoverage['/underscore.js'].lineData[1409]++;
    value = fallback;
  }
  _$jscoverage['/underscore.js'].lineData[1411]++;
  return visit349_1411_1(_.isFunction(value)) ? value.call(object) : value;
};
  _$jscoverage['/underscore.js'].lineData[1416]++;
  var idCounter = 0;
  _$jscoverage['/underscore.js'].lineData[1417]++;
  _.uniqueId = function(prefix) {
  _$jscoverage['/underscore.js'].functionData[150]++;
  _$jscoverage['/underscore.js'].lineData[1418]++;
  var id = ++idCounter + '';
  _$jscoverage['/underscore.js'].lineData[1419]++;
  return visit350_1419_1(prefix) ? prefix + id : id;
};
  _$jscoverage['/underscore.js'].lineData[1424]++;
  _.templateSettings = {
  evaluate: /<%([\s\S]+?)%>/g, 
  interpolate: /<%=([\s\S]+?)%>/g, 
  escape: /<%-([\s\S]+?)%>/g};
  _$jscoverage['/underscore.js'].lineData[1433]++;
  var noMatch = /(.)^/;
  _$jscoverage['/underscore.js'].lineData[1437]++;
  var escapes = {
  "'": "'", 
  '\\': '\\', 
  '\r': 'r', 
  '\n': 'n', 
  '\u2028': 'u2028', 
  '\u2029': 'u2029'};
  _$jscoverage['/underscore.js'].lineData[1446]++;
  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;
  _$jscoverage['/underscore.js'].lineData[1448]++;
  var escapeChar = function(match) {
  _$jscoverage['/underscore.js'].functionData[151]++;
  _$jscoverage['/underscore.js'].lineData[1449]++;
  return '\\' + escapes[match];
};
  _$jscoverage['/underscore.js'].lineData[1456]++;
  _.template = function(text, settings, oldSettings) {
  _$jscoverage['/underscore.js'].functionData[152]++;
  _$jscoverage['/underscore.js'].lineData[1457]++;
  if (visit351_1457_1(!settings && oldSettings)) 
    settings = oldSettings;
  _$jscoverage['/underscore.js'].lineData[1458]++;
  settings = _.defaults({}, settings, _.templateSettings);
  _$jscoverage['/underscore.js'].lineData[1461]++;
  var matcher = RegExp([(visit352_1462_1(settings.escape || noMatch)).source, (visit353_1463_1(settings.interpolate || noMatch)).source, (visit354_1464_1(settings.evaluate || noMatch)).source].join('|') + '|$', 'g');
  _$jscoverage['/underscore.js'].lineData[1468]++;
  var index = 0;
  _$jscoverage['/underscore.js'].lineData[1469]++;
  var source = "__p+='";
  _$jscoverage['/underscore.js'].lineData[1470]++;
  text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
  _$jscoverage['/underscore.js'].functionData[153]++;
  _$jscoverage['/underscore.js'].lineData[1471]++;
  source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
  _$jscoverage['/underscore.js'].lineData[1472]++;
  index = offset + match.length;
  _$jscoverage['/underscore.js'].lineData[1474]++;
  if (visit355_1474_1(escape)) {
    _$jscoverage['/underscore.js'].lineData[1475]++;
    source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
  } else {
    _$jscoverage['/underscore.js'].lineData[1476]++;
    if (visit356_1476_1(interpolate)) {
      _$jscoverage['/underscore.js'].lineData[1477]++;
      source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
    } else {
      _$jscoverage['/underscore.js'].lineData[1478]++;
      if (visit357_1478_1(evaluate)) {
        _$jscoverage['/underscore.js'].lineData[1479]++;
        source += "';\n" + evaluate + "\n__p+='";
      }
    }
  }
  _$jscoverage['/underscore.js'].lineData[1483]++;
  return match;
});
  _$jscoverage['/underscore.js'].lineData[1485]++;
  source += "';\n";
  _$jscoverage['/underscore.js'].lineData[1488]++;
  if (visit358_1488_1(!settings.variable)) 
    source = 'with(obj||{}){\n' + source + '}\n';
  _$jscoverage['/underscore.js'].lineData[1490]++;
  source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + 'return __p;\n';
  _$jscoverage['/underscore.js'].lineData[1494]++;
  var render;
  _$jscoverage['/underscore.js'].lineData[1495]++;
  try {
    _$jscoverage['/underscore.js'].lineData[1496]++;
    render = new Function(visit359_1496_1(settings.variable || 'obj'), '_', source);
  }  catch (e) {
  _$jscoverage['/underscore.js'].lineData[1498]++;
  e.source = source;
  _$jscoverage['/underscore.js'].lineData[1499]++;
  throw e;
}
  _$jscoverage['/underscore.js'].lineData[1502]++;
  var template = function(data) {
  _$jscoverage['/underscore.js'].functionData[154]++;
  _$jscoverage['/underscore.js'].lineData[1503]++;
  return render.call(this, data, _);
};
  _$jscoverage['/underscore.js'].lineData[1507]++;
  var argument = visit360_1507_1(settings.variable || 'obj');
  _$jscoverage['/underscore.js'].lineData[1508]++;
  template.source = 'function(' + argument + '){\n' + source + '}';
  _$jscoverage['/underscore.js'].lineData[1510]++;
  return template;
};
  _$jscoverage['/underscore.js'].lineData[1514]++;
  _.chain = function(obj) {
  _$jscoverage['/underscore.js'].functionData[155]++;
  _$jscoverage['/underscore.js'].lineData[1515]++;
  var instance = _(obj);
  _$jscoverage['/underscore.js'].lineData[1516]++;
  instance._chain = true;
  _$jscoverage['/underscore.js'].lineData[1517]++;
  return instance;
};
  _$jscoverage['/underscore.js'].lineData[1527]++;
  var chainResult = function(instance, obj) {
  _$jscoverage['/underscore.js'].functionData[156]++;
  _$jscoverage['/underscore.js'].lineData[1528]++;
  return visit361_1528_1(instance._chain) ? _(obj).chain() : obj;
};
  _$jscoverage['/underscore.js'].lineData[1532]++;
  _.mixin = function(obj) {
  _$jscoverage['/underscore.js'].functionData[157]++;
  _$jscoverage['/underscore.js'].lineData[1533]++;
  _.each(_.functions(obj), function(name) {
  _$jscoverage['/underscore.js'].functionData[158]++;
  _$jscoverage['/underscore.js'].lineData[1534]++;
  var func = _[name] = obj[name];
  _$jscoverage['/underscore.js'].lineData[1535]++;
  _.prototype[name] = function() {
  _$jscoverage['/underscore.js'].functionData[159]++;
  _$jscoverage['/underscore.js'].lineData[1536]++;
  var args = [this._wrapped];
  _$jscoverage['/underscore.js'].lineData[1537]++;
  push.apply(args, arguments);
  _$jscoverage['/underscore.js'].lineData[1538]++;
  return chainResult(this, func.apply(_, args));
};
});
};
  _$jscoverage['/underscore.js'].lineData[1544]++;
  _.mixin(_);
  _$jscoverage['/underscore.js'].lineData[1547]++;
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
  _$jscoverage['/underscore.js'].functionData[160]++;
  _$jscoverage['/underscore.js'].lineData[1548]++;
  var method = ArrayProto[name];
  _$jscoverage['/underscore.js'].lineData[1549]++;
  _.prototype[name] = function() {
  _$jscoverage['/underscore.js'].functionData[161]++;
  _$jscoverage['/underscore.js'].lineData[1550]++;
  var obj = this._wrapped;
  _$jscoverage['/underscore.js'].lineData[1551]++;
  method.apply(obj, arguments);
  _$jscoverage['/underscore.js'].lineData[1552]++;
  if (visit362_1552_1((visit363_1552_2(visit364_1552_3(name === 'shift') || visit365_1552_4(name === 'splice'))) && visit366_1552_5(obj.length === 0))) 
    delete obj[0];
  _$jscoverage['/underscore.js'].lineData[1553]++;
  return chainResult(this, obj);
};
});
  _$jscoverage['/underscore.js'].lineData[1558]++;
  _.each(['concat', 'join', 'slice'], function(name) {
  _$jscoverage['/underscore.js'].functionData[162]++;
  _$jscoverage['/underscore.js'].lineData[1559]++;
  var method = ArrayProto[name];
  _$jscoverage['/underscore.js'].lineData[1560]++;
  _.prototype[name] = function() {
  _$jscoverage['/underscore.js'].functionData[163]++;
  _$jscoverage['/underscore.js'].lineData[1561]++;
  return chainResult(this, method.apply(this._wrapped, arguments));
};
});
  _$jscoverage['/underscore.js'].lineData[1566]++;
  _.prototype.value = function() {
  _$jscoverage['/underscore.js'].functionData[164]++;
  _$jscoverage['/underscore.js'].lineData[1567]++;
  return this._wrapped;
};
  _$jscoverage['/underscore.js'].lineData[1572]++;
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
  _$jscoverage['/underscore.js'].lineData[1574]++;
  _.prototype.toString = function() {
  _$jscoverage['/underscore.js'].functionData[165]++;
  _$jscoverage['/underscore.js'].lineData[1575]++;
  return '' + this._wrapped;
};
  _$jscoverage['/underscore.js'].lineData[1585]++;
  if (visit367_1585_1(visit368_1585_2(typeof define === 'function') && define.amd)) {
    _$jscoverage['/underscore.js'].lineData[1586]++;
    define('underscore', [], function() {
  _$jscoverage['/underscore.js'].functionData[166]++;
  _$jscoverage['/underscore.js'].lineData[1587]++;
  return _;
});
  }
}());
