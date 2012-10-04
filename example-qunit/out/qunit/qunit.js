try {
  if (typeof top === 'object' && top !== null && typeof top.opener === 'object' && top.opener !== null) {
    // this is a browser window that was opened from another window

    if (! top.opener._$jscoverage) {
      top.opener._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null) {
    // this is a browser window

    try {
      if (typeof top.opener === 'object' && top.opener !== null && top.opener._$jscoverage) {
        top._$jscoverage = top.opener._$jscoverage;
      }
    }
    catch (e) {}

    if (! top._$jscoverage) {
      top._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null && top._$jscoverage) {
    this._$jscoverage = top._$jscoverage;
  }
}
catch (e) {}
if (! this._$jscoverage) {
  this._$jscoverage = {};
}
if (! _$jscoverage['qunit/qunit.js']) {
  _$jscoverage['qunit/qunit.js'] = [];
  _$jscoverage['qunit/qunit.js'][11] = 0;
  _$jscoverage['qunit/qunit.js'][13] = 0;
  _$jscoverage['qunit/qunit.js'][25] = 0;
  _$jscoverage['qunit/qunit.js'][26] = 0;
  _$jscoverage['qunit/qunit.js'][27] = 0;
  _$jscoverage['qunit/qunit.js'][28] = 0;
  _$jscoverage['qunit/qunit.js'][29] = 0;
  _$jscoverage['qunit/qunit.js'][31] = 0;
  _$jscoverage['qunit/qunit.js'][36] = 0;
  _$jscoverage['qunit/qunit.js'][37] = 0;
  _$jscoverage['qunit/qunit.js'][38] = 0;
  _$jscoverage['qunit/qunit.js'][39] = 0;
  _$jscoverage['qunit/qunit.js'][42] = 0;
  _$jscoverage['qunit/qunit.js'][44] = 0;
  _$jscoverage['qunit/qunit.js'][46] = 0;
  _$jscoverage['qunit/qunit.js'][49] = 0;
  _$jscoverage['qunit/qunit.js'][50] = 0;
  _$jscoverage['qunit/qunit.js'][51] = 0;
  _$jscoverage['qunit/qunit.js'][54] = 0;
  _$jscoverage['qunit/qunit.js'][55] = 0;
  _$jscoverage['qunit/qunit.js'][56] = 0;
  _$jscoverage['qunit/qunit.js'][58] = 0;
  _$jscoverage['qunit/qunit.js'][59] = 0;
  _$jscoverage['qunit/qunit.js'][60] = 0;
  _$jscoverage['qunit/qunit.js'][61] = 0;
  _$jscoverage['qunit/qunit.js'][62] = 0;
  _$jscoverage['qunit/qunit.js'][64] = 0;
  _$jscoverage['qunit/qunit.js'][68] = 0;
  _$jscoverage['qunit/qunit.js'][69] = 0;
  _$jscoverage['qunit/qunit.js'][70] = 0;
  _$jscoverage['qunit/qunit.js'][77] = 0;
  _$jscoverage['qunit/qunit.js'][78] = 0;
  _$jscoverage['qunit/qunit.js'][79] = 0;
  _$jscoverage['qunit/qunit.js'][82] = 0;
  _$jscoverage['qunit/qunit.js'][83] = 0;
  _$jscoverage['qunit/qunit.js'][88] = 0;
  _$jscoverage['qunit/qunit.js'][90] = 0;
  _$jscoverage['qunit/qunit.js'][95] = 0;
  _$jscoverage['qunit/qunit.js'][102] = 0;
  _$jscoverage['qunit/qunit.js'][104] = 0;
  _$jscoverage['qunit/qunit.js'][105] = 0;
  _$jscoverage['qunit/qunit.js'][107] = 0;
  _$jscoverage['qunit/qunit.js'][108] = 0;
  _$jscoverage['qunit/qunit.js'][109] = 0;
  _$jscoverage['qunit/qunit.js'][111] = 0;
  _$jscoverage['qunit/qunit.js'][112] = 0;
  _$jscoverage['qunit/qunit.js'][114] = 0;
  _$jscoverage['qunit/qunit.js'][118] = 0;
  _$jscoverage['qunit/qunit.js'][120] = 0;
  _$jscoverage['qunit/qunit.js'][122] = 0;
  _$jscoverage['qunit/qunit.js'][123] = 0;
  _$jscoverage['qunit/qunit.js'][126] = 0;
  _$jscoverage['qunit/qunit.js'][127] = 0;
  _$jscoverage['qunit/qunit.js'][130] = 0;
  _$jscoverage['qunit/qunit.js'][131] = 0;
  _$jscoverage['qunit/qunit.js'][132] = 0;
  _$jscoverage['qunit/qunit.js'][135] = 0;
  _$jscoverage['qunit/qunit.js'][136] = 0;
  _$jscoverage['qunit/qunit.js'][138] = 0;
  _$jscoverage['qunit/qunit.js'][140] = 0;
  _$jscoverage['qunit/qunit.js'][143] = 0;
  _$jscoverage['qunit/qunit.js'][144] = 0;
  _$jscoverage['qunit/qunit.js'][149] = 0;
  _$jscoverage['qunit/qunit.js'][150] = 0;
  _$jscoverage['qunit/qunit.js'][151] = 0;
  _$jscoverage['qunit/qunit.js'][152] = 0;
  _$jscoverage['qunit/qunit.js'][154] = 0;
  _$jscoverage['qunit/qunit.js'][155] = 0;
  _$jscoverage['qunit/qunit.js'][157] = 0;
  _$jscoverage['qunit/qunit.js'][160] = 0;
  _$jscoverage['qunit/qunit.js'][163] = 0;
  _$jscoverage['qunit/qunit.js'][164] = 0;
  _$jscoverage['qunit/qunit.js'][165] = 0;
  _$jscoverage['qunit/qunit.js'][166] = 0;
  _$jscoverage['qunit/qunit.js'][167] = 0;
  _$jscoverage['qunit/qunit.js'][168] = 0;
  _$jscoverage['qunit/qunit.js'][169] = 0;
  _$jscoverage['qunit/qunit.js'][172] = 0;
  _$jscoverage['qunit/qunit.js'][178] = 0;
  _$jscoverage['qunit/qunit.js'][179] = 0;
  _$jscoverage['qunit/qunit.js'][181] = 0;
  _$jscoverage['qunit/qunit.js'][182] = 0;
  _$jscoverage['qunit/qunit.js'][183] = 0;
  _$jscoverage['qunit/qunit.js'][185] = 0;
  _$jscoverage['qunit/qunit.js'][186] = 0;
  _$jscoverage['qunit/qunit.js'][188] = 0;
  _$jscoverage['qunit/qunit.js'][189] = 0;
  _$jscoverage['qunit/qunit.js'][190] = 0;
  _$jscoverage['qunit/qunit.js'][191] = 0;
  _$jscoverage['qunit/qunit.js'][193] = 0;
  _$jscoverage['qunit/qunit.js'][194] = 0;
  _$jscoverage['qunit/qunit.js'][196] = 0;
  _$jscoverage['qunit/qunit.js'][197] = 0;
  _$jscoverage['qunit/qunit.js'][198] = 0;
  _$jscoverage['qunit/qunit.js'][203] = 0;
  _$jscoverage['qunit/qunit.js'][204] = 0;
  _$jscoverage['qunit/qunit.js'][205] = 0;
  _$jscoverage['qunit/qunit.js'][207] = 0;
  _$jscoverage['qunit/qunit.js'][211] = 0;
  _$jscoverage['qunit/qunit.js'][212] = 0;
  _$jscoverage['qunit/qunit.js'][216] = 0;
  _$jscoverage['qunit/qunit.js'][217] = 0;
  _$jscoverage['qunit/qunit.js'][219] = 0;
  _$jscoverage['qunit/qunit.js'][220] = 0;
  _$jscoverage['qunit/qunit.js'][222] = 0;
  _$jscoverage['qunit/qunit.js'][225] = 0;
  _$jscoverage['qunit/qunit.js'][226] = 0;
  _$jscoverage['qunit/qunit.js'][227] = 0;
  _$jscoverage['qunit/qunit.js'][228] = 0;
  _$jscoverage['qunit/qunit.js'][230] = 0;
  _$jscoverage['qunit/qunit.js'][231] = 0;
  _$jscoverage['qunit/qunit.js'][236] = 0;
  _$jscoverage['qunit/qunit.js'][237] = 0;
  _$jscoverage['qunit/qunit.js'][238] = 0;
  _$jscoverage['qunit/qunit.js'][239] = 0;
  _$jscoverage['qunit/qunit.js'][240] = 0;
  _$jscoverage['qunit/qunit.js'][241] = 0;
  _$jscoverage['qunit/qunit.js'][242] = 0;
  _$jscoverage['qunit/qunit.js'][245] = 0;
  _$jscoverage['qunit/qunit.js'][246] = 0;
  _$jscoverage['qunit/qunit.js'][247] = 0;
  _$jscoverage['qunit/qunit.js'][248] = 0;
  _$jscoverage['qunit/qunit.js'][249] = 0;
  _$jscoverage['qunit/qunit.js'][254] = 0;
  _$jscoverage['qunit/qunit.js'][262] = 0;
  _$jscoverage['qunit/qunit.js'][264] = 0;
  _$jscoverage['qunit/qunit.js'][268] = 0;
  _$jscoverage['qunit/qunit.js'][271] = 0;
  _$jscoverage['qunit/qunit.js'][272] = 0;
  _$jscoverage['qunit/qunit.js'][274] = 0;
  _$jscoverage['qunit/qunit.js'][276] = 0;
  _$jscoverage['qunit/qunit.js'][277] = 0;
  _$jscoverage['qunit/qunit.js'][279] = 0;
  _$jscoverage['qunit/qunit.js'][280] = 0;
  _$jscoverage['qunit/qunit.js'][282] = 0;
  _$jscoverage['qunit/qunit.js'][283] = 0;
  _$jscoverage['qunit/qunit.js'][285] = 0;
  _$jscoverage['qunit/qunit.js'][286] = 0;
  _$jscoverage['qunit/qunit.js'][292] = 0;
  _$jscoverage['qunit/qunit.js'][295] = 0;
  _$jscoverage['qunit/qunit.js'][296] = 0;
  _$jscoverage['qunit/qunit.js'][298] = 0;
  _$jscoverage['qunit/qunit.js'][305] = 0;
  _$jscoverage['qunit/qunit.js'][309] = 0;
  _$jscoverage['qunit/qunit.js'][310] = 0;
  _$jscoverage['qunit/qunit.js'][311] = 0;
  _$jscoverage['qunit/qunit.js'][315] = 0;
  _$jscoverage['qunit/qunit.js'][316] = 0;
  _$jscoverage['qunit/qunit.js'][317] = 0;
  _$jscoverage['qunit/qunit.js'][320] = 0;
  _$jscoverage['qunit/qunit.js'][324] = 0;
  _$jscoverage['qunit/qunit.js'][327] = 0;
  _$jscoverage['qunit/qunit.js'][328] = 0;
  _$jscoverage['qunit/qunit.js'][329] = 0;
  _$jscoverage['qunit/qunit.js'][332] = 0;
  _$jscoverage['qunit/qunit.js'][333] = 0;
  _$jscoverage['qunit/qunit.js'][336] = 0;
  _$jscoverage['qunit/qunit.js'][347] = 0;
  _$jscoverage['qunit/qunit.js'][348] = 0;
  _$jscoverage['qunit/qunit.js'][351] = 0;
  _$jscoverage['qunit/qunit.js'][356] = 0;
  _$jscoverage['qunit/qunit.js'][357] = 0;
  _$jscoverage['qunit/qunit.js'][359] = 0;
  _$jscoverage['qunit/qunit.js'][364] = 0;
  _$jscoverage['qunit/qunit.js'][366] = 0;
  _$jscoverage['qunit/qunit.js'][367] = 0;
  _$jscoverage['qunit/qunit.js'][370] = 0;
  _$jscoverage['qunit/qunit.js'][371] = 0;
  _$jscoverage['qunit/qunit.js'][372] = 0;
  _$jscoverage['qunit/qunit.js'][373] = 0;
  _$jscoverage['qunit/qunit.js'][376] = 0;
  _$jscoverage['qunit/qunit.js'][377] = 0;
  _$jscoverage['qunit/qunit.js'][378] = 0;
  _$jscoverage['qunit/qunit.js'][379] = 0;
  _$jscoverage['qunit/qunit.js'][381] = 0;
  _$jscoverage['qunit/qunit.js'][382] = 0;
  _$jscoverage['qunit/qunit.js'][385] = 0;
  _$jscoverage['qunit/qunit.js'][386] = 0;
  _$jscoverage['qunit/qunit.js'][389] = 0;
  _$jscoverage['qunit/qunit.js'][390] = 0;
  _$jscoverage['qunit/qunit.js'][395] = 0;
  _$jscoverage['qunit/qunit.js'][396] = 0;
  _$jscoverage['qunit/qunit.js'][398] = 0;
  _$jscoverage['qunit/qunit.js'][399] = 0;
  _$jscoverage['qunit/qunit.js'][400] = 0;
  _$jscoverage['qunit/qunit.js'][401] = 0;
  _$jscoverage['qunit/qunit.js'][402] = 0;
  _$jscoverage['qunit/qunit.js'][403] = 0;
  _$jscoverage['qunit/qunit.js'][413] = 0;
  _$jscoverage['qunit/qunit.js'][421] = 0;
  _$jscoverage['qunit/qunit.js'][422] = 0;
  _$jscoverage['qunit/qunit.js'][424] = 0;
  _$jscoverage['qunit/qunit.js'][426] = 0;
  _$jscoverage['qunit/qunit.js'][434] = 0;
  _$jscoverage['qunit/qunit.js'][435] = 0;
  _$jscoverage['qunit/qunit.js'][437] = 0;
  _$jscoverage['qunit/qunit.js'][438] = 0;
  _$jscoverage['qunit/qunit.js'][439] = 0;
  _$jscoverage['qunit/qunit.js'][440] = 0;
  _$jscoverage['qunit/qunit.js'][441] = 0;
  _$jscoverage['qunit/qunit.js'][444] = 0;
  _$jscoverage['qunit/qunit.js'][445] = 0;
  _$jscoverage['qunit/qunit.js'][459] = 0;
  _$jscoverage['qunit/qunit.js'][467] = 0;
  _$jscoverage['qunit/qunit.js'][475] = 0;
  _$jscoverage['qunit/qunit.js'][483] = 0;
  _$jscoverage['qunit/qunit.js'][491] = 0;
  _$jscoverage['qunit/qunit.js'][499] = 0;
  _$jscoverage['qunit/qunit.js'][503] = 0;
  _$jscoverage['qunit/qunit.js'][508] = 0;
  _$jscoverage['qunit/qunit.js'][509] = 0;
  _$jscoverage['qunit/qunit.js'][510] = 0;
  _$jscoverage['qunit/qunit.js'][513] = 0;
  _$jscoverage['qunit/qunit.js'][514] = 0;
  _$jscoverage['qunit/qunit.js'][515] = 0;
  _$jscoverage['qunit/qunit.js'][517] = 0;
  _$jscoverage['qunit/qunit.js'][519] = 0;
  _$jscoverage['qunit/qunit.js'][521] = 0;
  _$jscoverage['qunit/qunit.js'][523] = 0;
  _$jscoverage['qunit/qunit.js'][524] = 0;
  _$jscoverage['qunit/qunit.js'][525] = 0;
  _$jscoverage['qunit/qunit.js'][527] = 0;
  _$jscoverage['qunit/qunit.js'][528] = 0;
  _$jscoverage['qunit/qunit.js'][530] = 0;
  _$jscoverage['qunit/qunit.js'][531] = 0;
  _$jscoverage['qunit/qunit.js'][533] = 0;
  _$jscoverage['qunit/qunit.js'][534] = 0;
  _$jscoverage['qunit/qunit.js'][535] = 0;
  _$jscoverage['qunit/qunit.js'][538] = 0;
  _$jscoverage['qunit/qunit.js'][540] = 0;
  _$jscoverage['qunit/qunit.js'][549] = 0;
  _$jscoverage['qunit/qunit.js'][555] = 0;
  _$jscoverage['qunit/qunit.js'][561] = 0;
  _$jscoverage['qunit/qunit.js'][562] = 0;
  _$jscoverage['qunit/qunit.js'][564] = 0;
  _$jscoverage['qunit/qunit.js'][565] = 0;
  _$jscoverage['qunit/qunit.js'][569] = 0;
  _$jscoverage['qunit/qunit.js'][570] = 0;
  _$jscoverage['qunit/qunit.js'][571] = 0;
  _$jscoverage['qunit/qunit.js'][572] = 0;
  _$jscoverage['qunit/qunit.js'][574] = 0;
  _$jscoverage['qunit/qunit.js'][582] = 0;
  _$jscoverage['qunit/qunit.js'][632] = 0;
  _$jscoverage['qunit/qunit.js'][633] = 0;
  _$jscoverage['qunit/qunit.js'][640] = 0;
  _$jscoverage['qunit/qunit.js'][641] = 0;
  _$jscoverage['qunit/qunit.js'][642] = 0;
  _$jscoverage['qunit/qunit.js'][643] = 0;
  _$jscoverage['qunit/qunit.js'][645] = 0;
  _$jscoverage['qunit/qunit.js'][646] = 0;
  _$jscoverage['qunit/qunit.js'][650] = 0;
  _$jscoverage['qunit/qunit.js'][653] = 0;
  _$jscoverage['qunit/qunit.js'][656] = 0;
  _$jscoverage['qunit/qunit.js'][658] = 0;
  _$jscoverage['qunit/qunit.js'][661] = 0;
  _$jscoverage['qunit/qunit.js'][666] = 0;
  _$jscoverage['qunit/qunit.js'][667] = 0;
  _$jscoverage['qunit/qunit.js'][670] = 0;
  _$jscoverage['qunit/qunit.js'][675] = 0;
  _$jscoverage['qunit/qunit.js'][680] = 0;
  _$jscoverage['qunit/qunit.js'][693] = 0;
  _$jscoverage['qunit/qunit.js'][696] = 0;
  _$jscoverage['qunit/qunit.js'][697] = 0;
  _$jscoverage['qunit/qunit.js'][705] = 0;
  _$jscoverage['qunit/qunit.js'][706] = 0;
  _$jscoverage['qunit/qunit.js'][707] = 0;
  _$jscoverage['qunit/qunit.js'][709] = 0;
  _$jscoverage['qunit/qunit.js'][710] = 0;
  _$jscoverage['qunit/qunit.js'][713] = 0;
  _$jscoverage['qunit/qunit.js'][714] = 0;
  _$jscoverage['qunit/qunit.js'][717] = 0;
  _$jscoverage['qunit/qunit.js'][718] = 0;
  _$jscoverage['qunit/qunit.js'][721] = 0;
  _$jscoverage['qunit/qunit.js'][722] = 0;
  _$jscoverage['qunit/qunit.js'][723] = 0;
  _$jscoverage['qunit/qunit.js'][724] = 0;
  _$jscoverage['qunit/qunit.js'][725] = 0;
  _$jscoverage['qunit/qunit.js'][726] = 0;
  _$jscoverage['qunit/qunit.js'][732] = 0;
  _$jscoverage['qunit/qunit.js'][733] = 0;
  _$jscoverage['qunit/qunit.js'][734] = 0;
  _$jscoverage['qunit/qunit.js'][741] = 0;
  _$jscoverage['qunit/qunit.js'][742] = 0;
  _$jscoverage['qunit/qunit.js'][743] = 0;
  _$jscoverage['qunit/qunit.js'][746] = 0;
  _$jscoverage['qunit/qunit.js'][747] = 0;
  _$jscoverage['qunit/qunit.js'][748] = 0;
  _$jscoverage['qunit/qunit.js'][754] = 0;
  _$jscoverage['qunit/qunit.js'][758] = 0;
  _$jscoverage['qunit/qunit.js'][759] = 0;
  _$jscoverage['qunit/qunit.js'][762] = 0;
  _$jscoverage['qunit/qunit.js'][763] = 0;
  _$jscoverage['qunit/qunit.js'][766] = 0;
  _$jscoverage['qunit/qunit.js'][769] = 0;
  _$jscoverage['qunit/qunit.js'][771] = 0;
  _$jscoverage['qunit/qunit.js'][772] = 0;
  _$jscoverage['qunit/qunit.js'][774] = 0;
  _$jscoverage['qunit/qunit.js'][781] = 0;
  _$jscoverage['qunit/qunit.js'][783] = 0;
  _$jscoverage['qunit/qunit.js'][784] = 0;
  _$jscoverage['qunit/qunit.js'][786] = 0;
  _$jscoverage['qunit/qunit.js'][790] = 0;
  _$jscoverage['qunit/qunit.js'][791] = 0;
  _$jscoverage['qunit/qunit.js'][794] = 0;
  _$jscoverage['qunit/qunit.js'][804] = 0;
  _$jscoverage['qunit/qunit.js'][805] = 0;
  _$jscoverage['qunit/qunit.js'][806] = 0;
  _$jscoverage['qunit/qunit.js'][808] = 0;
  _$jscoverage['qunit/qunit.js'][809] = 0;
  _$jscoverage['qunit/qunit.js'][810] = 0;
  _$jscoverage['qunit/qunit.js'][811] = 0;
  _$jscoverage['qunit/qunit.js'][813] = 0;
  _$jscoverage['qunit/qunit.js'][814] = 0;
  _$jscoverage['qunit/qunit.js'][815] = 0;
  _$jscoverage['qunit/qunit.js'][818] = 0;
  _$jscoverage['qunit/qunit.js'][820] = 0;
  _$jscoverage['qunit/qunit.js'][821] = 0;
  _$jscoverage['qunit/qunit.js'][822] = 0;
  _$jscoverage['qunit/qunit.js'][825] = 0;
  _$jscoverage['qunit/qunit.js'][828] = 0;
  _$jscoverage['qunit/qunit.js'][830] = 0;
  _$jscoverage['qunit/qunit.js'][837] = 0;
  _$jscoverage['qunit/qunit.js'][838] = 0;
  _$jscoverage['qunit/qunit.js'][841] = 0;
  _$jscoverage['qunit/qunit.js'][849] = 0;
  _$jscoverage['qunit/qunit.js'][850] = 0;
  _$jscoverage['qunit/qunit.js'][851] = 0;
  _$jscoverage['qunit/qunit.js'][853] = 0;
  _$jscoverage['qunit/qunit.js'][855] = 0;
  _$jscoverage['qunit/qunit.js'][856] = 0;
  _$jscoverage['qunit/qunit.js'][859] = 0;
  _$jscoverage['qunit/qunit.js'][860] = 0;
  _$jscoverage['qunit/qunit.js'][861] = 0;
  _$jscoverage['qunit/qunit.js'][864] = 0;
  _$jscoverage['qunit/qunit.js'][866] = 0;
  _$jscoverage['qunit/qunit.js'][868] = 0;
  _$jscoverage['qunit/qunit.js'][875] = 0;
  _$jscoverage['qunit/qunit.js'][876] = 0;
  _$jscoverage['qunit/qunit.js'][879] = 0;
  _$jscoverage['qunit/qunit.js'][880] = 0;
  _$jscoverage['qunit/qunit.js'][881] = 0;
  _$jscoverage['qunit/qunit.js'][883] = 0;
  _$jscoverage['qunit/qunit.js'][886] = 0;
  _$jscoverage['qunit/qunit.js'][902] = 0;
  _$jscoverage['qunit/qunit.js'][927] = 0;
  _$jscoverage['qunit/qunit.js'][928] = 0;
  _$jscoverage['qunit/qunit.js'][931] = 0;
  _$jscoverage['qunit/qunit.js'][932] = 0;
  _$jscoverage['qunit/qunit.js'][935] = 0;
  _$jscoverage['qunit/qunit.js'][941] = 0;
  _$jscoverage['qunit/qunit.js'][942] = 0;
  _$jscoverage['qunit/qunit.js'][944] = 0;
  _$jscoverage['qunit/qunit.js'][946] = 0;
  _$jscoverage['qunit/qunit.js'][948] = 0;
  _$jscoverage['qunit/qunit.js'][949] = 0;
  _$jscoverage['qunit/qunit.js'][950] = 0;
  _$jscoverage['qunit/qunit.js'][951] = 0;
  _$jscoverage['qunit/qunit.js'][957] = 0;
  _$jscoverage['qunit/qunit.js'][958] = 0;
  _$jscoverage['qunit/qunit.js'][961] = 0;
  _$jscoverage['qunit/qunit.js'][962] = 0;
  _$jscoverage['qunit/qunit.js'][963] = 0;
  _$jscoverage['qunit/qunit.js'][964] = 0;
  _$jscoverage['qunit/qunit.js'][965] = 0;
  _$jscoverage['qunit/qunit.js'][968] = 0;
  _$jscoverage['qunit/qunit.js'][971] = 0;
  _$jscoverage['qunit/qunit.js'][972] = 0;
  _$jscoverage['qunit/qunit.js'][973] = 0;
  _$jscoverage['qunit/qunit.js'][977] = 0;
  _$jscoverage['qunit/qunit.js'][978] = 0;
  _$jscoverage['qunit/qunit.js'][979] = 0;
  _$jscoverage['qunit/qunit.js'][983] = 0;
  _$jscoverage['qunit/qunit.js'][984] = 0;
  _$jscoverage['qunit/qunit.js'][986] = 0;
  _$jscoverage['qunit/qunit.js'][987] = 0;
  _$jscoverage['qunit/qunit.js'][988] = 0;
  _$jscoverage['qunit/qunit.js'][990] = 0;
  _$jscoverage['qunit/qunit.js'][991] = 0;
  _$jscoverage['qunit/qunit.js'][994] = 0;
  _$jscoverage['qunit/qunit.js'][995] = 0;
  _$jscoverage['qunit/qunit.js'][997] = 0;
  _$jscoverage['qunit/qunit.js'][998] = 0;
  _$jscoverage['qunit/qunit.js'][1000] = 0;
  _$jscoverage['qunit/qunit.js'][1001] = 0;
  _$jscoverage['qunit/qunit.js'][1002] = 0;
  _$jscoverage['qunit/qunit.js'][1004] = 0;
  _$jscoverage['qunit/qunit.js'][1009] = 0;
  _$jscoverage['qunit/qunit.js'][1010] = 0;
  _$jscoverage['qunit/qunit.js'][1012] = 0;
  _$jscoverage['qunit/qunit.js'][1013] = 0;
  _$jscoverage['qunit/qunit.js'][1015] = 0;
  _$jscoverage['qunit/qunit.js'][1018] = 0;
  _$jscoverage['qunit/qunit.js'][1019] = 0;
  _$jscoverage['qunit/qunit.js'][1020] = 0;
  _$jscoverage['qunit/qunit.js'][1021] = 0;
  _$jscoverage['qunit/qunit.js'][1022] = 0;
  _$jscoverage['qunit/qunit.js'][1024] = 0;
  _$jscoverage['qunit/qunit.js'][1025] = 0;
  _$jscoverage['qunit/qunit.js'][1026] = 0;
  _$jscoverage['qunit/qunit.js'][1027] = 0;
  _$jscoverage['qunit/qunit.js'][1028] = 0;
  _$jscoverage['qunit/qunit.js'][1029] = 0;
  _$jscoverage['qunit/qunit.js'][1031] = 0;
  _$jscoverage['qunit/qunit.js'][1033] = 0;
  _$jscoverage['qunit/qunit.js'][1034] = 0;
  _$jscoverage['qunit/qunit.js'][1035] = 0;
  _$jscoverage['qunit/qunit.js'][1036] = 0;
  _$jscoverage['qunit/qunit.js'][1037] = 0;
  _$jscoverage['qunit/qunit.js'][1038] = 0;
  _$jscoverage['qunit/qunit.js'][1041] = 0;
  _$jscoverage['qunit/qunit.js'][1043] = 0;
  _$jscoverage['qunit/qunit.js'][1048] = 0;
  _$jscoverage['qunit/qunit.js'][1049] = 0;
  _$jscoverage['qunit/qunit.js'][1050] = 0;
  _$jscoverage['qunit/qunit.js'][1053] = 0;
  _$jscoverage['qunit/qunit.js'][1054] = 0;
  _$jscoverage['qunit/qunit.js'][1058] = 0;
  _$jscoverage['qunit/qunit.js'][1062] = 0;
  _$jscoverage['qunit/qunit.js'][1067] = 0;
  _$jscoverage['qunit/qunit.js'][1068] = 0;
  _$jscoverage['qunit/qunit.js'][1069] = 0;
  _$jscoverage['qunit/qunit.js'][1070] = 0;
  _$jscoverage['qunit/qunit.js'][1075] = 0;
  _$jscoverage['qunit/qunit.js'][1076] = 0;
  _$jscoverage['qunit/qunit.js'][1077] = 0;
  _$jscoverage['qunit/qunit.js'][1078] = 0;
  _$jscoverage['qunit/qunit.js'][1080] = 0;
  _$jscoverage['qunit/qunit.js'][1082] = 0;
  _$jscoverage['qunit/qunit.js'][1083] = 0;
  _$jscoverage['qunit/qunit.js'][1086] = 0;
  _$jscoverage['qunit/qunit.js'][1089] = 0;
  _$jscoverage['qunit/qunit.js'][1092] = 0;
  _$jscoverage['qunit/qunit.js'][1093] = 0;
  _$jscoverage['qunit/qunit.js'][1096] = 0;
  _$jscoverage['qunit/qunit.js'][1097] = 0;
  _$jscoverage['qunit/qunit.js'][1105] = 0;
  _$jscoverage['qunit/qunit.js'][1123] = 0;
  _$jscoverage['qunit/qunit.js'][1124] = 0;
  _$jscoverage['qunit/qunit.js'][1127] = 0;
  _$jscoverage['qunit/qunit.js'][1128] = 0;
  _$jscoverage['qunit/qunit.js'][1131] = 0;
  _$jscoverage['qunit/qunit.js'][1134] = 0;
  _$jscoverage['qunit/qunit.js'][1141] = 0;
  _$jscoverage['qunit/qunit.js'][1143] = 0;
  _$jscoverage['qunit/qunit.js'][1144] = 0;
  _$jscoverage['qunit/qunit.js'][1145] = 0;
  _$jscoverage['qunit/qunit.js'][1146] = 0;
  _$jscoverage['qunit/qunit.js'][1152] = 0;
  _$jscoverage['qunit/qunit.js'][1153] = 0;
  _$jscoverage['qunit/qunit.js'][1156] = 0;
  _$jscoverage['qunit/qunit.js'][1165] = 0;
  _$jscoverage['qunit/qunit.js'][1166] = 0;
  _$jscoverage['qunit/qunit.js'][1172] = 0;
  _$jscoverage['qunit/qunit.js'][1173] = 0;
  _$jscoverage['qunit/qunit.js'][1174] = 0;
  _$jscoverage['qunit/qunit.js'][1177] = 0;
  _$jscoverage['qunit/qunit.js'][1178] = 0;
  _$jscoverage['qunit/qunit.js'][1181] = 0;
  _$jscoverage['qunit/qunit.js'][1182] = 0;
  _$jscoverage['qunit/qunit.js'][1185] = 0;
  _$jscoverage['qunit/qunit.js'][1186] = 0;
  _$jscoverage['qunit/qunit.js'][1189] = 0;
  _$jscoverage['qunit/qunit.js'][1190] = 0;
  _$jscoverage['qunit/qunit.js'][1191] = 0;
  _$jscoverage['qunit/qunit.js'][1195] = 0;
  _$jscoverage['qunit/qunit.js'][1196] = 0;
  _$jscoverage['qunit/qunit.js'][1200] = 0;
  _$jscoverage['qunit/qunit.js'][1206] = 0;
  _$jscoverage['qunit/qunit.js'][1207] = 0;
  _$jscoverage['qunit/qunit.js'][1209] = 0;
  _$jscoverage['qunit/qunit.js'][1211] = 0;
  _$jscoverage['qunit/qunit.js'][1213] = 0;
  _$jscoverage['qunit/qunit.js'][1214] = 0;
  _$jscoverage['qunit/qunit.js'][1216] = 0;
  _$jscoverage['qunit/qunit.js'][1217] = 0;
  _$jscoverage['qunit/qunit.js'][1218] = 0;
  _$jscoverage['qunit/qunit.js'][1220] = 0;
  _$jscoverage['qunit/qunit.js'][1221] = 0;
  _$jscoverage['qunit/qunit.js'][1222] = 0;
  _$jscoverage['qunit/qunit.js'][1223] = 0;
  _$jscoverage['qunit/qunit.js'][1224] = 0;
  _$jscoverage['qunit/qunit.js'][1226] = 0;
  _$jscoverage['qunit/qunit.js'][1228] = 0;
  _$jscoverage['qunit/qunit.js'][1229] = 0;
  _$jscoverage['qunit/qunit.js'][1232] = 0;
  _$jscoverage['qunit/qunit.js'][1233] = 0;
  _$jscoverage['qunit/qunit.js'][1237] = 0;
  _$jscoverage['qunit/qunit.js'][1238] = 0;
  _$jscoverage['qunit/qunit.js'][1241] = 0;
  _$jscoverage['qunit/qunit.js'][1244] = 0;
  _$jscoverage['qunit/qunit.js'][1245] = 0;
  _$jscoverage['qunit/qunit.js'][1246] = 0;
  _$jscoverage['qunit/qunit.js'][1248] = 0;
  _$jscoverage['qunit/qunit.js'][1252] = 0;
  _$jscoverage['qunit/qunit.js'][1253] = 0;
  _$jscoverage['qunit/qunit.js'][1254] = 0;
  _$jscoverage['qunit/qunit.js'][1256] = 0;
  _$jscoverage['qunit/qunit.js'][1257] = 0;
  _$jscoverage['qunit/qunit.js'][1258] = 0;
  _$jscoverage['qunit/qunit.js'][1259] = 0;
  _$jscoverage['qunit/qunit.js'][1260] = 0;
  _$jscoverage['qunit/qunit.js'][1261] = 0;
  _$jscoverage['qunit/qunit.js'][1262] = 0;
  _$jscoverage['qunit/qunit.js'][1267] = 0;
  _$jscoverage['qunit/qunit.js'][1268] = 0;
  _$jscoverage['qunit/qunit.js'][1270] = 0;
  _$jscoverage['qunit/qunit.js'][1271] = 0;
  _$jscoverage['qunit/qunit.js'][1275] = 0;
  _$jscoverage['qunit/qunit.js'][1276] = 0;
  _$jscoverage['qunit/qunit.js'][1277] = 0;
  _$jscoverage['qunit/qunit.js'][1279] = 0;
  _$jscoverage['qunit/qunit.js'][1280] = 0;
  _$jscoverage['qunit/qunit.js'][1282] = 0;
  _$jscoverage['qunit/qunit.js'][1283] = 0;
  _$jscoverage['qunit/qunit.js'][1284] = 0;
  _$jscoverage['qunit/qunit.js'][1286] = 0;
  _$jscoverage['qunit/qunit.js'][1287] = 0;
  _$jscoverage['qunit/qunit.js'][1290] = 0;
  _$jscoverage['qunit/qunit.js'][1291] = 0;
  _$jscoverage['qunit/qunit.js'][1292] = 0;
  _$jscoverage['qunit/qunit.js'][1296] = 0;
  _$jscoverage['qunit/qunit.js'][1297] = 0;
  _$jscoverage['qunit/qunit.js'][1299] = 0;
  _$jscoverage['qunit/qunit.js'][1300] = 0;
  _$jscoverage['qunit/qunit.js'][1302] = 0;
  _$jscoverage['qunit/qunit.js'][1303] = 0;
  _$jscoverage['qunit/qunit.js'][1305] = 0;
  _$jscoverage['qunit/qunit.js'][1310] = 0;
  _$jscoverage['qunit/qunit.js'][1311] = 0;
  _$jscoverage['qunit/qunit.js'][1315] = 0;
  _$jscoverage['qunit/qunit.js'][1317] = 0;
  _$jscoverage['qunit/qunit.js'][1318] = 0;
  _$jscoverage['qunit/qunit.js'][1319] = 0;
  _$jscoverage['qunit/qunit.js'][1322] = 0;
  _$jscoverage['qunit/qunit.js'][1323] = 0;
  _$jscoverage['qunit/qunit.js'][1324] = 0;
  _$jscoverage['qunit/qunit.js'][1329] = 0;
  _$jscoverage['qunit/qunit.js'][1330] = 0;
  _$jscoverage['qunit/qunit.js'][1333] = 0;
  _$jscoverage['qunit/qunit.js'][1334] = 0;
  _$jscoverage['qunit/qunit.js'][1335] = 0;
  _$jscoverage['qunit/qunit.js'][1336] = 0;
  _$jscoverage['qunit/qunit.js'][1337] = 0;
  _$jscoverage['qunit/qunit.js'][1338] = 0;
  _$jscoverage['qunit/qunit.js'][1342] = 0;
  _$jscoverage['qunit/qunit.js'][1345] = 0;
  _$jscoverage['qunit/qunit.js'][1346] = 0;
  _$jscoverage['qunit/qunit.js'][1347] = 0;
  _$jscoverage['qunit/qunit.js'][1348] = 0;
  _$jscoverage['qunit/qunit.js'][1351] = 0;
  _$jscoverage['qunit/qunit.js'][1352] = 0;
  _$jscoverage['qunit/qunit.js'][1356] = 0;
  _$jscoverage['qunit/qunit.js'][1359] = 0;
  _$jscoverage['qunit/qunit.js'][1360] = 0;
  _$jscoverage['qunit/qunit.js'][1361] = 0;
  _$jscoverage['qunit/qunit.js'][1362] = 0;
  _$jscoverage['qunit/qunit.js'][1363] = 0;
  _$jscoverage['qunit/qunit.js'][1365] = 0;
  _$jscoverage['qunit/qunit.js'][1369] = 0;
  _$jscoverage['qunit/qunit.js'][1370] = 0;
  _$jscoverage['qunit/qunit.js'][1373] = 0;
  _$jscoverage['qunit/qunit.js'][1374] = 0;
  _$jscoverage['qunit/qunit.js'][1375] = 0;
  _$jscoverage['qunit/qunit.js'][1379] = 0;
  _$jscoverage['qunit/qunit.js'][1380] = 0;
  _$jscoverage['qunit/qunit.js'][1382] = 0;
  _$jscoverage['qunit/qunit.js'][1383] = 0;
  _$jscoverage['qunit/qunit.js'][1386] = 0;
  _$jscoverage['qunit/qunit.js'][1389] = 0;
  _$jscoverage['qunit/qunit.js'][1390] = 0;
  _$jscoverage['qunit/qunit.js'][1394] = 0;
  _$jscoverage['qunit/qunit.js'][1395] = 0;
  _$jscoverage['qunit/qunit.js'][1396] = 0;
  _$jscoverage['qunit/qunit.js'][1401] = 0;
  _$jscoverage['qunit/qunit.js'][1403] = 0;
  _$jscoverage['qunit/qunit.js'][1404] = 0;
  _$jscoverage['qunit/qunit.js'][1405] = 0;
  _$jscoverage['qunit/qunit.js'][1407] = 0;
  _$jscoverage['qunit/qunit.js'][1408] = 0;
  _$jscoverage['qunit/qunit.js'][1409] = 0;
  _$jscoverage['qunit/qunit.js'][1416] = 0;
  _$jscoverage['qunit/qunit.js'][1419] = 0;
  _$jscoverage['qunit/qunit.js'][1420] = 0;
  _$jscoverage['qunit/qunit.js'][1421] = 0;
  _$jscoverage['qunit/qunit.js'][1422] = 0;
  _$jscoverage['qunit/qunit.js'][1423] = 0;
  _$jscoverage['qunit/qunit.js'][1425] = 0;
  _$jscoverage['qunit/qunit.js'][1431] = 0;
  _$jscoverage['qunit/qunit.js'][1437] = 0;
  _$jscoverage['qunit/qunit.js'][1438] = 0;
  _$jscoverage['qunit/qunit.js'][1443] = 0;
  _$jscoverage['qunit/qunit.js'][1444] = 0;
  _$jscoverage['qunit/qunit.js'][1449] = 0;
  _$jscoverage['qunit/qunit.js'][1451] = 0;
  _$jscoverage['qunit/qunit.js'][1455] = 0;
  _$jscoverage['qunit/qunit.js'][1463] = 0;
  _$jscoverage['qunit/qunit.js'][1467] = 0;
  _$jscoverage['qunit/qunit.js'][1471] = 0;
  _$jscoverage['qunit/qunit.js'][1486] = 0;
  _$jscoverage['qunit/qunit.js'][1487] = 0;
  _$jscoverage['qunit/qunit.js'][1491] = 0;
  _$jscoverage['qunit/qunit.js'][1494] = 0;
  _$jscoverage['qunit/qunit.js'][1495] = 0;
  _$jscoverage['qunit/qunit.js'][1498] = 0;
  _$jscoverage['qunit/qunit.js'][1499] = 0;
  _$jscoverage['qunit/qunit.js'][1501] = 0;
  _$jscoverage['qunit/qunit.js'][1505] = 0;
  _$jscoverage['qunit/qunit.js'][1506] = 0;
  _$jscoverage['qunit/qunit.js'][1507] = 0;
  _$jscoverage['qunit/qunit.js'][1508] = 0;
  _$jscoverage['qunit/qunit.js'][1509] = 0;
  _$jscoverage['qunit/qunit.js'][1510] = 0;
  _$jscoverage['qunit/qunit.js'][1513] = 0;
  _$jscoverage['qunit/qunit.js'][1514] = 0;
  _$jscoverage['qunit/qunit.js'][1515] = 0;
  _$jscoverage['qunit/qunit.js'][1518] = 0;
  _$jscoverage['qunit/qunit.js'][1519] = 0;
  _$jscoverage['qunit/qunit.js'][1523] = 0;
  _$jscoverage['qunit/qunit.js'][1531] = 0;
  _$jscoverage['qunit/qunit.js'][1534] = 0;
  _$jscoverage['qunit/qunit.js'][1536] = 0;
  _$jscoverage['qunit/qunit.js'][1541] = 0;
  _$jscoverage['qunit/qunit.js'][1543] = 0;
  _$jscoverage['qunit/qunit.js'][1545] = 0;
  _$jscoverage['qunit/qunit.js'][1547] = 0;
  _$jscoverage['qunit/qunit.js'][1548] = 0;
  _$jscoverage['qunit/qunit.js'][1549] = 0;
  _$jscoverage['qunit/qunit.js'][1551] = 0;
  _$jscoverage['qunit/qunit.js'][1554] = 0;
  _$jscoverage['qunit/qunit.js'][1556] = 0;
  _$jscoverage['qunit/qunit.js'][1557] = 0;
  _$jscoverage['qunit/qunit.js'][1558] = 0;
  _$jscoverage['qunit/qunit.js'][1562] = 0;
  _$jscoverage['qunit/qunit.js'][1563] = 0;
  _$jscoverage['qunit/qunit.js'][1565] = 0;
  _$jscoverage['qunit/qunit.js'][1566] = 0;
  _$jscoverage['qunit/qunit.js'][1570] = 0;
  _$jscoverage['qunit/qunit.js'][1575] = 0;
  _$jscoverage['qunit/qunit.js'][1576] = 0;
  _$jscoverage['qunit/qunit.js'][1577] = 0;
  _$jscoverage['qunit/qunit.js'][1578] = 0;
  _$jscoverage['qunit/qunit.js'][1581] = 0;
  _$jscoverage['qunit/qunit.js'][1582] = 0;
  _$jscoverage['qunit/qunit.js'][1583] = 0;
  _$jscoverage['qunit/qunit.js'][1584] = 0;
  _$jscoverage['qunit/qunit.js'][1587] = 0;
  _$jscoverage['qunit/qunit.js'][1589] = 0;
  _$jscoverage['qunit/qunit.js'][1596] = 0;
  _$jscoverage['qunit/qunit.js'][1609] = 0;
  _$jscoverage['qunit/qunit.js'][1610] = 0;
  _$jscoverage['qunit/qunit.js'][1611] = 0;
  _$jscoverage['qunit/qunit.js'][1613] = 0;
  _$jscoverage['qunit/qunit.js'][1614] = 0;
  _$jscoverage['qunit/qunit.js'][1616] = 0;
  _$jscoverage['qunit/qunit.js'][1617] = 0;
  _$jscoverage['qunit/qunit.js'][1620] = 0;
  _$jscoverage['qunit/qunit.js'][1621] = 0;
  _$jscoverage['qunit/qunit.js'][1623] = 0;
  _$jscoverage['qunit/qunit.js'][1624] = 0;
  _$jscoverage['qunit/qunit.js'][1626] = 0;
  _$jscoverage['qunit/qunit.js'][1628] = 0;
  _$jscoverage['qunit/qunit.js'][1629] = 0;
  _$jscoverage['qunit/qunit.js'][1630] = 0;
  _$jscoverage['qunit/qunit.js'][1631] = 0;
  _$jscoverage['qunit/qunit.js'][1632] = 0;
  _$jscoverage['qunit/qunit.js'][1634] = 0;
  _$jscoverage['qunit/qunit.js'][1635] = 0;
  _$jscoverage['qunit/qunit.js'][1638] = 0;
  _$jscoverage['qunit/qunit.js'][1642] = 0;
  _$jscoverage['qunit/qunit.js'][1643] = 0;
  _$jscoverage['qunit/qunit.js'][1646] = 0;
  _$jscoverage['qunit/qunit.js'][1647] = 0;
  _$jscoverage['qunit/qunit.js'][1649] = 0;
  _$jscoverage['qunit/qunit.js'][1650] = 0;
  _$jscoverage['qunit/qunit.js'][1652] = 0;
  _$jscoverage['qunit/qunit.js'][1653] = 0;
  _$jscoverage['qunit/qunit.js'][1654] = 0;
  _$jscoverage['qunit/qunit.js'][1655] = 0;
  _$jscoverage['qunit/qunit.js'][1656] = 0;
  _$jscoverage['qunit/qunit.js'][1658] = 0;
  _$jscoverage['qunit/qunit.js'][1661] = 0;
  _$jscoverage['qunit/qunit.js'][1662] = 0;
  _$jscoverage['qunit/qunit.js'][1663] = 0;
  _$jscoverage['qunit/qunit.js'][1664] = 0;
  _$jscoverage['qunit/qunit.js'][1665] = 0;
  _$jscoverage['qunit/qunit.js'][1666] = 0;
  _$jscoverage['qunit/qunit.js'][1667] = 0;
  _$jscoverage['qunit/qunit.js'][1668] = 0;
  _$jscoverage['qunit/qunit.js'][1669] = 0;
  _$jscoverage['qunit/qunit.js'][1670] = 0;
  _$jscoverage['qunit/qunit.js'][1671] = 0;
  _$jscoverage['qunit/qunit.js'][1672] = 0;
  _$jscoverage['qunit/qunit.js'][1673] = 0;
  _$jscoverage['qunit/qunit.js'][1674] = 0;
  _$jscoverage['qunit/qunit.js'][1675] = 0;
  _$jscoverage['qunit/qunit.js'][1676] = 0;
  _$jscoverage['qunit/qunit.js'][1677] = 0;
  _$jscoverage['qunit/qunit.js'][1678] = 0;
  _$jscoverage['qunit/qunit.js'][1684] = 0;
  _$jscoverage['qunit/qunit.js'][1685] = 0;
  _$jscoverage['qunit/qunit.js'][1686] = 0;
  _$jscoverage['qunit/qunit.js'][1688] = 0;
  _$jscoverage['qunit/qunit.js'][1690] = 0;
  _$jscoverage['qunit/qunit.js'][1693] = 0;
  _$jscoverage['qunit/qunit.js'][1697] = 0;
  _$jscoverage['qunit/qunit.js'][1698] = 0;
  _$jscoverage['qunit/qunit.js'][1700] = 0;
  _$jscoverage['qunit/qunit.js'][1701] = 0;
  _$jscoverage['qunit/qunit.js'][1702] = 0;
  _$jscoverage['qunit/qunit.js'][1704] = 0;
  _$jscoverage['qunit/qunit.js'][1707] = 0;
  _$jscoverage['qunit/qunit.js'][1710] = 0;
  _$jscoverage['qunit/qunit.js'][1713] = 0;
  _$jscoverage['qunit/qunit.js'][1726] = 0;
  _$jscoverage['qunit/qunit.js'][1732] = 0;
  _$jscoverage['qunit/qunit.js'][1736] = 0;
  _$jscoverage['qunit/qunit.js'][1737] = 0;
  _$jscoverage['qunit/qunit.js'][1739] = 0;
  _$jscoverage['qunit/qunit.js'][1741] = 0;
  _$jscoverage['qunit/qunit.js'][1742] = 0;
  _$jscoverage['qunit/qunit.js'][1748] = 0;
  _$jscoverage['qunit/qunit.js'][1749] = 0;
  _$jscoverage['qunit/qunit.js'][1750] = 0;
  _$jscoverage['qunit/qunit.js'][1751] = 0;
  _$jscoverage['qunit/qunit.js'][1752] = 0;
  _$jscoverage['qunit/qunit.js'][1754] = 0;
  _$jscoverage['qunit/qunit.js'][1755] = 0;
  _$jscoverage['qunit/qunit.js'][1756] = 0;
  _$jscoverage['qunit/qunit.js'][1757] = 0;
  _$jscoverage['qunit/qunit.js'][1758] = 0;
  _$jscoverage['qunit/qunit.js'][1760] = 0;
  _$jscoverage['qunit/qunit.js'][1761] = 0;
  _$jscoverage['qunit/qunit.js'][1764] = 0;
  _$jscoverage['qunit/qunit.js'][1770] = 0;
  _$jscoverage['qunit/qunit.js'][1771] = 0;
  _$jscoverage['qunit/qunit.js'][1772] = 0;
  _$jscoverage['qunit/qunit.js'][1773] = 0;
  _$jscoverage['qunit/qunit.js'][1776] = 0;
  _$jscoverage['qunit/qunit.js'][1780] = 0;
  _$jscoverage['qunit/qunit.js'][1783] = 0;
  _$jscoverage['qunit/qunit.js'][1784] = 0;
  _$jscoverage['qunit/qunit.js'][1787] = 0;
  _$jscoverage['qunit/qunit.js'][1788] = 0;
  _$jscoverage['qunit/qunit.js'][1790] = 0;
  _$jscoverage['qunit/qunit.js'][1792] = 0;
  _$jscoverage['qunit/qunit.js'][1820] = 0;
  _$jscoverage['qunit/qunit.js'][1824] = 0;
  _$jscoverage['qunit/qunit.js'][1825] = 0;
  _$jscoverage['qunit/qunit.js'][1828] = 0;
  _$jscoverage['qunit/qunit.js'][1829] = 0;
  _$jscoverage['qunit/qunit.js'][1832] = 0;
  _$jscoverage['qunit/qunit.js'][1833] = 0;
  _$jscoverage['qunit/qunit.js'][1836] = 0;
  _$jscoverage['qunit/qunit.js'][1837] = 0;
  _$jscoverage['qunit/qunit.js'][1841] = 0;
  _$jscoverage['qunit/qunit.js'][1845] = 0;
  _$jscoverage['qunit/qunit.js'][1846] = 0;
  _$jscoverage['qunit/qunit.js'][1847] = 0;
  _$jscoverage['qunit/qunit.js'][1850] = 0;
  _$jscoverage['qunit/qunit.js'][1851] = 0;
  _$jscoverage['qunit/qunit.js'][1852] = 0;
  _$jscoverage['qunit/qunit.js'][1856] = 0;
  _$jscoverage['qunit/qunit.js'][1873] = 0;
  _$jscoverage['qunit/qunit.js'][1874] = 0;
  _$jscoverage['qunit/qunit.js'][1875] = 0;
  _$jscoverage['qunit/qunit.js'][1879] = 0;
  _$jscoverage['qunit/qunit.js'][1880] = 0;
  _$jscoverage['qunit/qunit.js'][1881] = 0;
  _$jscoverage['qunit/qunit.js'][1886] = 0;
  _$jscoverage['qunit/qunit.js'][1889] = 0;
  _$jscoverage['qunit/qunit.js'][1890] = 0;
  _$jscoverage['qunit/qunit.js'][1891] = 0;
  _$jscoverage['qunit/qunit.js'][1896] = 0;
  _$jscoverage['qunit/qunit.js'][1899] = 0;
  _$jscoverage['qunit/qunit.js'][1900] = 0;
  _$jscoverage['qunit/qunit.js'][1901] = 0;
  _$jscoverage['qunit/qunit.js'][1903] = 0;
  _$jscoverage['qunit/qunit.js'][1904] = 0;
  _$jscoverage['qunit/qunit.js'][1908] = 0;
  _$jscoverage['qunit/qunit.js'][1915] = 0;
  _$jscoverage['qunit/qunit.js'][1916] = 0;
  _$jscoverage['qunit/qunit.js'][1919] = 0;
  _$jscoverage['qunit/qunit.js'][1923] = 0;
  _$jscoverage['qunit/qunit.js'][1930] = 0;
  _$jscoverage['qunit/qunit.js'][1931] = 0;
  _$jscoverage['qunit/qunit.js'][1934] = 0;
  _$jscoverage['qunit/qunit.js'][1938] = 0;
  _$jscoverage['qunit/qunit.js'][1945] = 0;
  _$jscoverage['qunit/qunit.js'][1951] = 0;
  _$jscoverage['qunit/qunit.js'][1952] = 0;
  _$jscoverage['qunit/qunit.js'][1953] = 0;
  _$jscoverage['qunit/qunit.js'][1955] = 0;
  _$jscoverage['qunit/qunit.js'][1961] = 0;
  _$jscoverage['qunit/qunit.js'][1962] = 0;
  _$jscoverage['qunit/qunit.js'][1965] = 0;
  _$jscoverage['qunit/qunit.js'][1968] = 0;
  _$jscoverage['qunit/qunit.js'][1969] = 0;
  _$jscoverage['qunit/qunit.js'][1972] = 0;
  _$jscoverage['qunit/qunit.js'][1975] = 0;
  _$jscoverage['qunit/qunit.js'][1976] = 0;
  _$jscoverage['qunit/qunit.js'][1977] = 0;
  _$jscoverage['qunit/qunit.js'][1981] = 0;
  _$jscoverage['qunit/qunit.js'][1982] = 0;
  _$jscoverage['qunit/qunit.js'][1983] = 0;
  _$jscoverage['qunit/qunit.js'][1987] = 0;
  _$jscoverage['qunit/qunit.js'][1988] = 0;
  _$jscoverage['qunit/qunit.js'][1989] = 0;
  _$jscoverage['qunit/qunit.js'][1993] = 0;
  _$jscoverage['qunit/qunit.js'][1995] = 0;
  _$jscoverage['qunit/qunit.js'][1996] = 0;
  _$jscoverage['qunit/qunit.js'][1998] = 0;
  _$jscoverage['qunit/qunit.js'][2003] = 0;
  _$jscoverage['qunit/qunit.js'][2008] = 0;
  _$jscoverage['qunit/qunit.js'][2009] = 0;
  _$jscoverage['qunit/qunit.js'][2013] = 0;
}
_$jscoverage['qunit/qunit.js'].source = ["/**"," * QUnit v1.11.0pre - A JavaScript Unit Testing Framework"," *"," * http://qunitjs.com"," *"," * Copyright 2012 jQuery Foundation and other contributors"," * Released under the MIT license."," * http://jquery.org/license"," */","","(function( window ) {","","var QUnit,","\tconfig,","\tonErrorFnPrev,","\ttestId = 0,","\tfileName = (sourceFromStacktrace( 0 ) || \"\" ).replace(/(:\\d+)+\\)?/, \"\").replace(/.+\\//, \"\"),","\ttoString = Object.prototype.toString,","\thasOwn = Object.prototype.hasOwnProperty,","\t// Keep a local reference to Date (GH-283)","\tDate = window.Date,","\tdefined = {","\tsetTimeout: typeof window.setTimeout !== \"undefined\",","\tsessionStorage: (function() {","\t\tvar x = \"qunit-test-string\";","\t\ttry {","\t\t\tsessionStorage.setItem( x, x );","\t\t\tsessionStorage.removeItem( x );","\t\t\treturn true;","\t\t} catch( e ) {","\t\t\treturn false;","\t\t}","\t}())","};","","function Test( settings ) {","\textend( this, settings );","\tthis.assertions = [];","\tthis.testNumber = ++Test.count;","}","","Test.count = 0;","","Test.prototype = {","\tinit: function() {","\t\tvar a, b, li,","        tests = id( \"qunit-tests\" );","","\t\tif ( tests ) {","\t\t\tb = document.createElement( \"strong\" );","\t\t\tb.innerHTML = this.name;","","\t\t\t// `a` initialized at top of scope","\t\t\ta = document.createElement( \"a\" );","\t\t\ta.innerHTML = \"Rerun\";","\t\t\ta.href = QUnit.url({ testNumber: this.testNumber });","","\t\t\tli = document.createElement( \"li\" );","\t\t\tli.appendChild( b );","\t\t\tli.appendChild( a );","\t\t\tli.className = \"running\";","\t\t\tli.id = this.id = \"qunit-test-output\" + testId++;","","\t\t\ttests.appendChild( li );","\t\t}","\t},","\tsetup: function() {","\t\tif ( this.module !== config.previousModule ) {","\t\t\tif ( config.previousModule ) {","\t\t\t\trunLoggingCallbacks( \"moduleDone\", QUnit, {","\t\t\t\t\tname: config.previousModule,","\t\t\t\t\tfailed: config.moduleStats.bad,","\t\t\t\t\tpassed: config.moduleStats.all - config.moduleStats.bad,","\t\t\t\t\ttotal: config.moduleStats.all","\t\t\t\t});","\t\t\t}","\t\t\tconfig.previousModule = this.module;","\t\t\tconfig.moduleStats = { all: 0, bad: 0 };","\t\t\trunLoggingCallbacks( \"moduleStart\", QUnit, {","\t\t\t\tname: this.module","\t\t\t});","\t\t} else if ( config.autorun ) {","\t\t\trunLoggingCallbacks( \"moduleStart\", QUnit, {","\t\t\t\tname: this.module","\t\t\t});","\t\t}","","\t\tconfig.current = this;","","\t\tthis.testEnvironment = extend({","\t\t\tsetup: function() {},","\t\t\tteardown: function() {}","\t\t}, this.moduleTestEnvironment );","","\t\trunLoggingCallbacks( \"testStart\", QUnit, {","\t\t\tname: this.testName,","\t\t\tmodule: this.module","\t\t});","","\t\t// allow utility functions to access the current test environment","\t\t// TODO why??","\t\tQUnit.current_testEnvironment = this.testEnvironment;","","\t\tif ( !config.pollution ) {","\t\t\tsaveGlobal();","\t\t}","\t\tif ( config.notrycatch ) {","\t\t\tthis.testEnvironment.setup.call( this.testEnvironment );","\t\t\treturn;","\t\t}","\t\ttry {","\t\t\tthis.testEnvironment.setup.call( this.testEnvironment );","\t\t} catch( e ) {","\t\t\tQUnit.pushFailure( \"Setup failed on \" + this.testName + \": \" + ( e.message || e ), extractStacktrace( e, 1 ) );","\t\t}","\t},","\trun: function() {","\t\tconfig.current = this;","","\t\tvar running = id( \"qunit-testresult\" );","","\t\tif ( running ) {","\t\t\trunning.innerHTML = \"Running: &lt;br/&gt;\" + this.name;","\t\t}","","\t\tif ( this.async ) {","\t\t\tQUnit.stop();","\t\t}","","\t\tif ( config.notrycatch ) {","\t\t\tthis.callback.call( this.testEnvironment, QUnit.assert );","\t\t\treturn;","\t\t}","","\t\ttry {","\t\t\tthis.callback.call( this.testEnvironment, QUnit.assert );","\t\t} catch( e ) {","\t\t\tQUnit.pushFailure( \"Died on test #\" + (this.assertions.length + 1) + \" \" + this.stack + \": \" + ( e.message || e ), extractStacktrace( e, 0 ) );","\t\t\t// else next test will carry the responsibility","\t\t\tsaveGlobal();","","\t\t\t// Restart the tests if they're blocking","\t\t\tif ( config.blocking ) {","\t\t\t\tQUnit.start();","\t\t\t}","\t\t}","\t},","\tteardown: function() {","\t\tconfig.current = this;","\t\tif ( config.notrycatch ) {","\t\t\tthis.testEnvironment.teardown.call( this.testEnvironment );","\t\t\treturn;","\t\t} else {","\t\t\ttry {","\t\t\t\tthis.testEnvironment.teardown.call( this.testEnvironment );","\t\t\t} catch( e ) {","\t\t\t\tQUnit.pushFailure( \"Teardown failed on \" + this.testName + \": \" + ( e.message || e ), extractStacktrace( e, 1 ) );","\t\t\t}","\t\t}","\t\tcheckPollution();","\t},","\tfinish: function() {","\t\tconfig.current = this;","\t\tif ( config.requireExpects &amp;&amp; this.expected == null ) {","\t\t\tQUnit.pushFailure( \"Expected number of assertions to be defined, but expect() was not called.\", this.stack );","\t\t} else if ( this.expected != null &amp;&amp; this.expected != this.assertions.length ) {","\t\t\tQUnit.pushFailure( \"Expected \" + this.expected + \" assertions, but \" + this.assertions.length + \" were run\", this.stack );","\t\t} else if ( this.expected == null &amp;&amp; !this.assertions.length ) {","\t\t\tQUnit.pushFailure( \"Expected at least one assertion, but none were run - call expect(0) to accept zero assertions.\", this.stack );","\t\t}","","\t\tvar assertion, a, b, i, li, ol,","\t\t\ttest = this,","\t\t\tgood = 0,","\t\t\tbad = 0,","\t\t\ttests = id( \"qunit-tests\" );","","\t\tconfig.stats.all += this.assertions.length;","\t\tconfig.moduleStats.all += this.assertions.length;","","\t\tif ( tests ) {","\t\t\tol = document.createElement( \"ol\" );","\t\t\tol.className = \"qunit-assert-list\";","","\t\t\tfor ( i = 0; i &lt; this.assertions.length; i++ ) {","\t\t\t\tassertion = this.assertions[i];","","\t\t\t\tli = document.createElement( \"li\" );","\t\t\t\tli.className = assertion.result ? \"pass\" : \"fail\";","\t\t\t\tli.innerHTML = assertion.message || ( assertion.result ? \"okay\" : \"failed\" );","\t\t\t\tol.appendChild( li );","","\t\t\t\tif ( assertion.result ) {","\t\t\t\t\tgood++;","\t\t\t\t} else {","\t\t\t\t\tbad++;","\t\t\t\t\tconfig.stats.bad++;","\t\t\t\t\tconfig.moduleStats.bad++;","\t\t\t\t}","\t\t\t}","","\t\t\t// store result when possible","\t\t\tif ( QUnit.config.reorder &amp;&amp; defined.sessionStorage ) {","\t\t\t\tif ( bad ) {","\t\t\t\t\tsessionStorage.setItem( \"qunit-test-\" + this.module + \"-\" + this.testName, bad );","\t\t\t\t} else {","\t\t\t\t\tsessionStorage.removeItem( \"qunit-test-\" + this.module + \"-\" + this.testName );","\t\t\t\t}","\t\t\t}","","\t\t\tif ( bad === 0 ) {","\t\t\t\taddClass( ol, \"qunit-collapsed\" );","\t\t\t}","","\t\t\t// `b` initialized at top of scope","\t\t\tb = document.createElement( \"strong\" );","\t\t\tb.innerHTML = this.name + \" &lt;b class='counts'&gt;(&lt;b class='failed'&gt;\" + bad + \"&lt;/b&gt;, &lt;b class='passed'&gt;\" + good + \"&lt;/b&gt;, \" + this.assertions.length + \")&lt;/b&gt;\";","","\t\t\taddEvent(b, \"click\", function() {","\t\t\t\tvar next = b.nextSibling.nextSibling,","\t\t\t\t\tcollapsed = hasClass( next, \"qunit-collapsed\" );","\t\t\t\t( collapsed ? removeClass : addClass )( next, \"qunit-collapsed\" );","\t\t\t});","","\t\t\taddEvent(b, \"dblclick\", function( e ) {","\t\t\t\tvar target = e &amp;&amp; e.target ? e.target : window.event.srcElement;","\t\t\t\tif ( target.nodeName.toLowerCase() == \"span\" || target.nodeName.toLowerCase() == \"b\" ) {","\t\t\t\t\ttarget = target.parentNode;","\t\t\t\t}","\t\t\t\tif ( window.location &amp;&amp; target.nodeName.toLowerCase() === \"strong\" ) {","\t\t\t\t\twindow.location = QUnit.url({ testNumber: test.testNumber });","\t\t\t\t}","\t\t\t});","","\t\t\t// `li` initialized at top of scope","\t\t\tli = id( this.id );","\t\t\tli.className = bad ? \"fail\" : \"pass\";","\t\t\tli.removeChild( li.firstChild );","\t\t\ta = li.firstChild;","\t\t\tli.appendChild( b );","\t\t\tli.appendChild ( a );","\t\t\tli.appendChild( ol );","","\t\t} else {","\t\t\tfor ( i = 0; i &lt; this.assertions.length; i++ ) {","\t\t\t\tif ( !this.assertions[i].result ) {","\t\t\t\t\tbad++;","\t\t\t\t\tconfig.stats.bad++;","\t\t\t\t\tconfig.moduleStats.bad++;","\t\t\t\t}","\t\t\t}","\t\t}","","\t\trunLoggingCallbacks( \"testDone\", QUnit, {","\t\t\tname: this.testName,","\t\t\tmodule: this.module,","\t\t\tfailed: bad,","\t\t\tpassed: this.assertions.length - bad,","\t\t\ttotal: this.assertions.length","\t\t});","","\t\tQUnit.reset();","","\t\tconfig.current = undefined;","\t},","","\tqueue: function() {","\t\tvar bad,","\t\t\ttest = this;","","\t\tsynchronize(function() {","\t\t\ttest.init();","\t\t});","\t\tfunction run() {","\t\t\t// each of these can by async","\t\t\tsynchronize(function() {","\t\t\t\ttest.setup();","\t\t\t});","\t\t\tsynchronize(function() {","\t\t\t\ttest.run();","\t\t\t});","\t\t\tsynchronize(function() {","\t\t\t\ttest.teardown();","\t\t\t});","\t\t\tsynchronize(function() {","\t\t\t\ttest.finish();","\t\t\t});","\t\t}","","\t\t// `bad` initialized at top of scope","\t\t// defer when previous test run passed, if storage is available","\t\tbad = QUnit.config.reorder &amp;&amp; defined.sessionStorage &amp;&amp;","\t\t\t\t\t\t+sessionStorage.getItem( \"qunit-test-\" + this.module + \"-\" + this.testName );","","\t\tif ( bad ) {","\t\t\trun();","\t\t} else {","\t\t\tsynchronize( run, true );","\t\t}","\t}","};","","// Root QUnit object.","// `QUnit` initialized at top of scope","QUnit = {","","\t// call on start of module test to prepend name to all tests","\tmodule: function( name, testEnvironment ) {","\t\tconfig.currentModule = name;","\t\tconfig.currentModuleTestEnvironment = testEnvironment;","\t\tconfig.modules[name] = true;","\t},","","\tasyncTest: function( testName, expected, callback ) {","\t\tif ( arguments.length === 2 ) {","\t\t\tcallback = expected;","\t\t\texpected = null;","\t\t}","","\t\tQUnit.test( testName, expected, callback, true );","\t},","","\ttest: function( testName, expected, callback, async ) {","\t\tvar test,","\t\t\tname = \"&lt;span class='test-name'&gt;\" + escapeInnerText( testName ) + \"&lt;/span&gt;\";","","\t\tif ( arguments.length === 2 ) {","\t\t\tcallback = expected;","\t\t\texpected = null;","\t\t}","","\t\tif ( config.currentModule ) {","\t\t\tname = \"&lt;span class='module-name'&gt;\" + config.currentModule + \"&lt;/span&gt;: \" + name;","\t\t}","","\t\ttest = new Test({","\t\t\tname: name,","\t\t\ttestName: testName,","\t\t\texpected: expected,","\t\t\tasync: async,","\t\t\tcallback: callback,","\t\t\tmodule: config.currentModule,","\t\t\tmoduleTestEnvironment: config.currentModuleTestEnvironment,","\t\t\tstack: sourceFromStacktrace( 2 )","\t\t});","","\t\tif ( !validTest( test ) ) {","\t\t\treturn;","\t\t}","","\t\ttest.queue();","\t},","","\t// Specify the number of expected assertions to gurantee that failed test (no assertions are run at all) don't slip through.","\texpect: function( asserts ) {","\t\tif (arguments.length === 1) {","\t\t\tconfig.current.expected = asserts;","\t\t} else {","\t\t\treturn config.current.expected;","\t\t}","\t},","","\tstart: function( count ) {","\t\tconfig.semaphore -= count || 1;","\t\t// don't start until equal number of stop-calls","\t\tif ( config.semaphore &gt; 0 ) {","\t\t\treturn;","\t\t}","\t\t// ignore if start is called more often then stop","\t\tif ( config.semaphore &lt; 0 ) {","\t\t\tconfig.semaphore = 0;","\t\t\tQUnit.pushFailure( \"Called start() while already started (QUnit.config.semaphore was 0 already)\", null, sourceFromStacktrace(2) );","\t\t\treturn;","\t\t}","\t\t// A slight delay, to avoid any current callbacks","\t\tif ( defined.setTimeout ) {","\t\t\twindow.setTimeout(function() {","\t\t\t\tif ( config.semaphore &gt; 0 ) {","\t\t\t\t\treturn;","\t\t\t\t}","\t\t\t\tif ( config.timeout ) {","\t\t\t\t\tclearTimeout( config.timeout );","\t\t\t\t}","","\t\t\t\tconfig.blocking = false;","\t\t\t\tprocess( true );","\t\t\t}, 13);","\t\t} else {","\t\t\tconfig.blocking = false;","\t\t\tprocess( true );","\t\t}","\t},","","\tstop: function( count ) {","\t\tconfig.semaphore += count || 1;","\t\tconfig.blocking = true;","","\t\tif ( config.testTimeout &amp;&amp; defined.setTimeout ) {","\t\t\tclearTimeout( config.timeout );","\t\t\tconfig.timeout = window.setTimeout(function() {","\t\t\t\tQUnit.ok( false, \"Test timed out\" );","\t\t\t\tconfig.semaphore = 1;","\t\t\t\tQUnit.start();","\t\t\t}, config.testTimeout );","\t\t}","\t}","};","","// Asssert helpers","// All of these must call either QUnit.push() or manually do:","// - runLoggingCallbacks( \"log\", .. );","// - config.current.assertions.push({ .. });","QUnit.assert = {","\t/**","\t * Asserts rough true-ish result.","\t * @name ok","\t * @function","\t * @example ok( \"asdfasdf\".length &gt; 5, \"There must be at least 5 chars\" );","\t */","\tok: function( result, msg ) {","\t\tif ( !config.current ) {","\t\t\tthrow new Error( \"ok() assertion outside test context, was \" + sourceFromStacktrace(2) );","\t\t}","\t\tresult = !!result;","","\t\tvar source,","\t\t\tdetails = {","\t\t\t\tmodule: config.current.module,","\t\t\t\tname: config.current.testName,","\t\t\t\tresult: result,","\t\t\t\tmessage: msg","\t\t\t};","","\t\tmsg = escapeInnerText( msg || (result ? \"okay\" : \"failed\" ) );","\t\tmsg = \"&lt;span class='test-message'&gt;\" + msg + \"&lt;/span&gt;\";","","\t\tif ( !result ) {","\t\t\tsource = sourceFromStacktrace( 2 );","\t\t\tif ( source ) {","\t\t\t\tdetails.source = source;","\t\t\t\tmsg += \"&lt;table&gt;&lt;tr class='test-source'&gt;&lt;th&gt;Source: &lt;/th&gt;&lt;td&gt;&lt;pre&gt;\" + escapeInnerText( source ) + \"&lt;/pre&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;\";","\t\t\t}","\t\t}","\t\trunLoggingCallbacks( \"log\", QUnit, details );","\t\tconfig.current.assertions.push({","\t\t\tresult: result,","\t\t\tmessage: msg","\t\t});","\t},","","\t/**","\t * Assert that the first two arguments are equal, with an optional message.","\t * Prints out both actual and expected values.","\t * @name equal","\t * @function","\t * @example equal( format( \"Received {0} bytes.\", 2), \"Received 2 bytes.\", \"format() replaces {0} with next argument\" );","\t */","\tequal: function( actual, expected, message ) {","\t\tQUnit.push( expected == actual, actual, expected, message );","\t},","","\t/**","\t * @name notEqual","\t * @function","\t */","\tnotEqual: function( actual, expected, message ) {","\t\tQUnit.push( expected != actual, actual, expected, message );","\t},","","\t/**","\t * @name deepEqual","\t * @function","\t */","\tdeepEqual: function( actual, expected, message ) {","\t\tQUnit.push( QUnit.equiv(actual, expected), actual, expected, message );","\t},","","\t/**","\t * @name notDeepEqual","\t * @function","\t */","\tnotDeepEqual: function( actual, expected, message ) {","\t\tQUnit.push( !QUnit.equiv(actual, expected), actual, expected, message );","\t},","","\t/**","\t * @name strictEqual","\t * @function","\t */","\tstrictEqual: function( actual, expected, message ) {","\t\tQUnit.push( expected === actual, actual, expected, message );","\t},","","\t/**","\t * @name notStrictEqual","\t * @function","\t */","\tnotStrictEqual: function( actual, expected, message ) {","\t\tQUnit.push( expected !== actual, actual, expected, message );","\t},","","\t\"throws\": function( block, expected, message ) {","\t\tvar actual,","\t\t\texpectedOutput = expected,","\t\t\tok = false;","","\t\t// 'expected' is optional","\t\tif ( typeof expected === \"string\" ) {","\t\t\tmessage = expected;","\t\t\texpected = null;","\t\t}","","\t\tconfig.current.ignoreGlobalErrors = true;","\t\ttry {","\t\t\tblock.call( config.current.testEnvironment );","\t\t} catch (e) {","\t\t\tactual = e;","\t\t}","\t\tconfig.current.ignoreGlobalErrors = false;","","\t\tif ( actual ) {","\t\t\t// we don't want to validate thrown error","\t\t\tif ( !expected ) {","\t\t\t\tok = true;","\t\t\t\texpectedOutput = null;","\t\t\t// expected is a regexp","\t\t\t} else if ( QUnit.objectType( expected ) === \"regexp\" ) {","\t\t\t\tok = expected.test( actual );","\t\t\t// expected is a constructor","\t\t\t} else if ( actual instanceof expected ) {","\t\t\t\tok = true;","\t\t\t// expected is a validation function which returns true is validation passed","\t\t\t} else if ( expected.call( {}, actual ) === true ) {","\t\t\t\texpectedOutput = null;","\t\t\t\tok = true;","\t\t\t}","","\t\t\tQUnit.push( ok, actual, expectedOutput, message );","\t\t} else {","\t\t\tQUnit.pushFailure( message, null, 'No exception was thrown.' );","\t\t}","\t}","};","","/**"," * @deprecate since 1.8.0"," * Kept assertion helpers in root for backwards compatibility"," */","extend( QUnit, QUnit.assert );","","/**"," * @deprecated since 1.9.0"," * Kept global \"raises()\" for backwards compatibility"," */","QUnit.raises = QUnit.assert[ \"throws\" ];","","/**"," * @deprecated since 1.0.0, replaced with error pushes since 1.3.0"," * Kept to avoid TypeErrors for undefined methods."," */","QUnit.equals = function() {","\tQUnit.push( false, false, false, \"QUnit.equals has been deprecated since 2009 (e88049a0), use QUnit.equal instead\" );","};","QUnit.same = function() {","\tQUnit.push( false, false, false, \"QUnit.same has been deprecated since 2009 (e88049a0), use QUnit.deepEqual instead\" );","};","","// We want access to the constructor's prototype","(function() {","\tfunction F() {}","\tF.prototype = QUnit;","\tQUnit = new F();","\t// Make F QUnit's constructor so that we can add to the prototype later","\tQUnit.constructor = F;","}());","","/**"," * Config object: Maintain internal state"," * Later exposed as QUnit.config"," * `config` initialized at top of scope"," */","config = {","\t// The queue of tests to run","\tqueue: [],","","\t// block until document ready","\tblocking: true,","","\t// when enabled, show only failing tests","\t// gets persisted through sessionStorage and can be changed in UI via checkbox","\thidepassed: false,","","\t// by default, run previously failed tests first","\t// very useful in combination with \"Hide passed tests\" checked","\treorder: true,","","\t// by default, modify document.title when suite is done","\taltertitle: true,","","\t// when enabled, all tests must call expect()","\trequireExpects: false,","","\t// add checkboxes that are persisted in the query-string","\t// when enabled, the id is set to `true` as a `QUnit.config` property","\turlConfig: [","\t\t{","\t\t\tid: \"noglobals\",","\t\t\tlabel: \"Check for Globals\",","\t\t\ttooltip: \"Enabling this will test if any test introduces new properties on the `window` object. Stored as query-strings.\"","\t\t},","\t\t{","\t\t\tid: \"notrycatch\",","\t\t\tlabel: \"No try-catch\",","\t\t\ttooltip: \"Enabling this will run tests outside of a try-catch block. Makes debugging exceptions in IE reasonable. Stored as query-strings.\"","\t\t}","\t],","","\t// Set of all modules.","\tmodules: {},","","\t// logging callback queues","\tbegin: [],","\tdone: [],","\tlog: [],","\ttestStart: [],","\ttestDone: [],","\tmoduleStart: [],","\tmoduleDone: []","};","","// Initialize more QUnit.config and QUnit.urlParams","(function() {","\tvar i,","\t\tlocation = window.location || { search: \"\", protocol: \"file:\" },","\t\tparams = location.search.slice( 1 ).split( \"&amp;\" ),","\t\tlength = params.length,","\t\turlParams = {},","\t\tcurrent;","","\tif ( params[ 0 ] ) {","\t\tfor ( i = 0; i &lt; length; i++ ) {","\t\t\tcurrent = params[ i ].split( \"=\" );","\t\t\tcurrent[ 0 ] = decodeURIComponent( current[ 0 ] );","\t\t\t// allow just a key to turn on a flag, e.g., test.html?noglobals","\t\t\tcurrent[ 1 ] = current[ 1 ] ? decodeURIComponent( current[ 1 ] ) : true;","\t\t\turlParams[ current[ 0 ] ] = current[ 1 ];","\t\t}","\t}","","\tQUnit.urlParams = urlParams;","","\t// String search anywhere in moduleName+testName","\tconfig.filter = urlParams.filter;","","\t// Exact match of the module name","\tconfig.module = urlParams.module;","","\tconfig.testNumber = parseInt( urlParams.testNumber, 10 ) || null;","","\t// Figure out if we're running the tests from a server or not","\tQUnit.isLocal = location.protocol === \"file:\";","}());","","// Export global variables, unless an 'exports' object exists,","// in that case we assume we're in CommonJS (dealt with on the bottom of the script)","if ( typeof exports === \"undefined\" ) {","\textend( window, QUnit );","","\t// Expose QUnit object","\twindow.QUnit = QUnit;","}","","// Extend QUnit object,","// these after set here because they should not be exposed as global functions","extend( QUnit, {","\tconfig: config,","","\t// Initialize the configuration options","\tinit: function() {","\t\textend( config, {","\t\t\tstats: { all: 0, bad: 0 },","\t\t\tmoduleStats: { all: 0, bad: 0 },","\t\t\tstarted: +new Date(),","\t\t\tupdateRate: 1000,","\t\t\tblocking: false,","\t\t\tautostart: true,","\t\t\tautorun: false,","\t\t\tfilter: \"\",","\t\t\tqueue: [],","\t\t\tsemaphore: 1","\t\t});","","\t\tvar tests, banner, result,","\t\t\tqunit = id( \"qunit\" );","","\t\tif ( qunit ) {","\t\t\tqunit.innerHTML =","\t\t\t\t\"&lt;h1 id='qunit-header'&gt;\" + escapeInnerText( document.title ) + \"&lt;/h1&gt;\" +","\t\t\t\t\"&lt;h2 id='qunit-banner'&gt;&lt;/h2&gt;\" +","\t\t\t\t\"&lt;div id='qunit-testrunner-toolbar'&gt;&lt;/div&gt;\" +","\t\t\t\t\"&lt;h2 id='qunit-userAgent'&gt;&lt;/h2&gt;\" +","\t\t\t\t\"&lt;ol id='qunit-tests'&gt;&lt;/ol&gt;\";","\t\t}","","\t\ttests = id( \"qunit-tests\" );","\t\tbanner = id( \"qunit-banner\" );","\t\tresult = id( \"qunit-testresult\" );","","\t\tif ( tests ) {","\t\t\ttests.innerHTML = \"\";","\t\t}","","\t\tif ( banner ) {","\t\t\tbanner.className = \"\";","\t\t}","","\t\tif ( result ) {","\t\t\tresult.parentNode.removeChild( result );","\t\t}","","\t\tif ( tests ) {","\t\t\tresult = document.createElement( \"p\" );","\t\t\tresult.id = \"qunit-testresult\";","\t\t\tresult.className = \"result\";","\t\t\ttests.parentNode.insertBefore( result, tests );","\t\t\tresult.innerHTML = \"Running...&lt;br/&gt;&amp;nbsp;\";","\t\t}","\t},","","\t// Resets the test setup. Useful for tests that modify the DOM.","\treset: function() {","\t\tvar fixture = id( \"qunit-fixture\" );","\t\tif ( fixture ) {","\t\t\tfixture.innerHTML = config.fixture;","\t\t}","\t},","","\t// Trigger an event on an element.","\t// @example triggerEvent( document.body, \"click\" );","\ttriggerEvent: function( elem, type, event ) {","\t\tif ( document.createEvent ) {","\t\t\tevent = document.createEvent( \"MouseEvents\" );","\t\t\tevent.initMouseEvent(type, true, true, elem.ownerDocument.defaultView,","\t\t\t\t0, 0, 0, 0, 0, false, false, false, false, 0, null);","","\t\t\telem.dispatchEvent( event );","\t\t} else if ( elem.fireEvent ) {","\t\t\telem.fireEvent( \"on\" + type );","\t\t}","\t},","","\t// Safe object type checking","\tis: function( type, obj ) {","\t\treturn QUnit.objectType( obj ) == type;","\t},","","\tobjectType: function( obj ) {","\t\tif ( typeof obj === \"undefined\" ) {","\t\t\t\treturn \"undefined\";","\t\t// consider: typeof null === object","\t\t}","\t\tif ( obj === null ) {","\t\t\t\treturn \"null\";","\t\t}","","\t\tvar match = toString.call( obj ).match(/^\\[object\\s(.*)\\]$/),","\t\t\ttype = match &amp;&amp; match[1] || \"\";","","\t\tswitch ( type ) {","\t\t\tcase \"Number\":","\t\t\t\tif ( isNaN(obj) ) {","\t\t\t\t\treturn \"nan\";","\t\t\t\t}","\t\t\t\treturn \"number\";","\t\t\tcase \"String\":","\t\t\tcase \"Boolean\":","\t\t\tcase \"Array\":","\t\t\tcase \"Date\":","\t\t\tcase \"RegExp\":","\t\t\tcase \"Function\":","\t\t\t\treturn type.toLowerCase();","\t\t}","\t\tif ( typeof obj === \"object\" ) {","\t\t\treturn \"object\";","\t\t}","\t\treturn undefined;","\t},","","\tpush: function( result, actual, expected, message ) {","\t\tif ( !config.current ) {","\t\t\tthrow new Error( \"assertion outside test context, was \" + sourceFromStacktrace() );","\t\t}","","\t\tvar output, source,","\t\t\tdetails = {","\t\t\t\tmodule: config.current.module,","\t\t\t\tname: config.current.testName,","\t\t\t\tresult: result,","\t\t\t\tmessage: message,","\t\t\t\tactual: actual,","\t\t\t\texpected: expected","\t\t\t};","","\t\tmessage = escapeInnerText( message ) || ( result ? \"okay\" : \"failed\" );","\t\tmessage = \"&lt;span class='test-message'&gt;\" + message + \"&lt;/span&gt;\";","\t\toutput = message;","","\t\tif ( !result ) {","\t\t\texpected = escapeInnerText( QUnit.jsDump.parse(expected) );","\t\t\tactual = escapeInnerText( QUnit.jsDump.parse(actual) );","\t\t\toutput += \"&lt;table&gt;&lt;tr class='test-expected'&gt;&lt;th&gt;Expected: &lt;/th&gt;&lt;td&gt;&lt;pre&gt;\" + expected + \"&lt;/pre&gt;&lt;/td&gt;&lt;/tr&gt;\";","","\t\t\tif ( actual != expected ) {","\t\t\t\toutput += \"&lt;tr class='test-actual'&gt;&lt;th&gt;Result: &lt;/th&gt;&lt;td&gt;&lt;pre&gt;\" + actual + \"&lt;/pre&gt;&lt;/td&gt;&lt;/tr&gt;\";","\t\t\t\toutput += \"&lt;tr class='test-diff'&gt;&lt;th&gt;Diff: &lt;/th&gt;&lt;td&gt;&lt;pre&gt;\" + QUnit.diff( expected, actual ) + \"&lt;/pre&gt;&lt;/td&gt;&lt;/tr&gt;\";","\t\t\t}","","\t\t\tsource = sourceFromStacktrace();","","\t\t\tif ( source ) {","\t\t\t\tdetails.source = source;","\t\t\t\toutput += \"&lt;tr class='test-source'&gt;&lt;th&gt;Source: &lt;/th&gt;&lt;td&gt;&lt;pre&gt;\" + escapeInnerText( source ) + \"&lt;/pre&gt;&lt;/td&gt;&lt;/tr&gt;\";","\t\t\t}","","\t\t\toutput += \"&lt;/table&gt;\";","\t\t}","","\t\trunLoggingCallbacks( \"log\", QUnit, details );","","\t\tconfig.current.assertions.push({","\t\t\tresult: !!result,","\t\t\tmessage: output","\t\t});","\t},","","\tpushFailure: function( message, source, actual ) {","\t\tif ( !config.current ) {","\t\t\tthrow new Error( \"pushFailure() assertion outside test context, was \" + sourceFromStacktrace(2) );","\t\t}","","\t\tvar output,","\t\t\tdetails = {","\t\t\t\tmodule: config.current.module,","\t\t\t\tname: config.current.testName,","\t\t\t\tresult: false,","\t\t\t\tmessage: message","\t\t\t};","","\t\tmessage = escapeInnerText( message ) || \"error\";","\t\tmessage = \"&lt;span class='test-message'&gt;\" + message + \"&lt;/span&gt;\";","\t\toutput = message;","","\t\toutput += \"&lt;table&gt;\";","","\t\tif ( actual ) {","\t\t\toutput += \"&lt;tr class='test-actual'&gt;&lt;th&gt;Result: &lt;/th&gt;&lt;td&gt;&lt;pre&gt;\" + escapeInnerText( actual ) + \"&lt;/pre&gt;&lt;/td&gt;&lt;/tr&gt;\";","\t\t}","","\t\tif ( source ) {","\t\t\tdetails.source = source;","\t\t\toutput += \"&lt;tr class='test-source'&gt;&lt;th&gt;Source: &lt;/th&gt;&lt;td&gt;&lt;pre&gt;\" + escapeInnerText( source ) + \"&lt;/pre&gt;&lt;/td&gt;&lt;/tr&gt;\";","\t\t}","","\t\toutput += \"&lt;/table&gt;\";","","\t\trunLoggingCallbacks( \"log\", QUnit, details );","","\t\tconfig.current.assertions.push({","\t\t\tresult: false,","\t\t\tmessage: output","\t\t});","\t},","","\turl: function( params ) {","\t\tparams = extend( extend( {}, QUnit.urlParams ), params );","\t\tvar key,","\t\t\tquerystring = \"?\";","","\t\tfor ( key in params ) {","\t\t\tif ( !hasOwn.call( params, key ) ) {","\t\t\t\tcontinue;","\t\t\t}","\t\t\tquerystring += encodeURIComponent( key ) + \"=\" +","\t\t\t\tencodeURIComponent( params[ key ] ) + \"&amp;\";","\t\t}","\t\treturn window.location.pathname + querystring.slice( 0, -1 );","\t},","","\textend: extend,","\tid: id,","\taddEvent: addEvent","\t// load, equiv, jsDump, diff: Attached later","});","","/**"," * @deprecated: Created for backwards compatibility with test runner that set the hook function"," * into QUnit.{hook}, instead of invoking it and passing the hook function."," * QUnit.constructor is set to the empty F() above so that we can add to it's prototype here."," * Doing this allows us to tell if the following methods have been overwritten on the actual"," * QUnit object."," */","extend( QUnit.constructor.prototype, {","","\t// Logging callbacks; all receive a single argument with the listed properties","\t// run test/logs.html for any related changes","\tbegin: registerLoggingCallback( \"begin\" ),","","\t// done: { failed, passed, total, runtime }","\tdone: registerLoggingCallback( \"done\" ),","","\t// log: { result, actual, expected, message }","\tlog: registerLoggingCallback( \"log\" ),","","\t// testStart: { name }","\ttestStart: registerLoggingCallback( \"testStart\" ),","","\t// testDone: { name, failed, passed, total }","\ttestDone: registerLoggingCallback( \"testDone\" ),","","\t// moduleStart: { name }","\tmoduleStart: registerLoggingCallback( \"moduleStart\" ),","","\t// moduleDone: { name, failed, passed, total }","\tmoduleDone: registerLoggingCallback( \"moduleDone\" )","});","","if ( typeof document === \"undefined\" || document.readyState === \"complete\" ) {","\tconfig.autorun = true;","}","","QUnit.load = function() {","\trunLoggingCallbacks( \"begin\", QUnit, {} );","","\t// Initialize the config, saving the execution queue","\tvar banner, filter, i, label, len, main, ol, toolbar, userAgent, val, urlConfigCheckboxes, moduleFilter,","\t    numModules = 0,","\t    moduleFilterHtml = \"\",","\t\turlConfigHtml = \"\",","\t\toldconfig = extend( {}, config );","","\tQUnit.init();","\textend(config, oldconfig);","","\tconfig.blocking = false;","","\tlen = config.urlConfig.length;","","\tfor ( i = 0; i &lt; len; i++ ) {","\t\tval = config.urlConfig[i];","\t\tif ( typeof val === \"string\" ) {","\t\t\tval = {","\t\t\t\tid: val,","\t\t\t\tlabel: val,","\t\t\t\ttooltip: \"[no tooltip available]\"","\t\t\t};","\t\t}","\t\tconfig[ val.id ] = QUnit.urlParams[ val.id ];","\t\turlConfigHtml += \"&lt;input id='qunit-urlconfig-\" + val.id + \"' name='\" + val.id + \"' type='checkbox'\" + ( config[ val.id ] ? \" checked='checked'\" : \"\" ) + \" title='\" + val.tooltip + \"'&gt;&lt;label for='qunit-urlconfig-\" + val.id + \"' title='\" + val.tooltip + \"'&gt;\" + val.label + \"&lt;/label&gt;\";","\t}","","\tmoduleFilterHtml += \"&lt;label for='qunit-modulefilter'&gt;Module: &lt;/label&gt;&lt;select id='qunit-modulefilter' name='modulefilter'&gt;&lt;option value='' \" + ( config.module === undefined  ? \"selected\" : \"\" ) + \"&gt;&lt; All Modules &gt;&lt;/option&gt;\";","\tfor ( i in config.modules ) {","\t\tif ( config.modules.hasOwnProperty( i ) ) {","\t\t\tnumModules += 1;","\t\t\tmoduleFilterHtml += \"&lt;option value='\" + encodeURIComponent(i) + \"' \" + ( config.module === i ? \"selected\" : \"\" ) + \"&gt;\" + i + \"&lt;/option&gt;\";","\t\t}","\t}","\tmoduleFilterHtml += \"&lt;/select&gt;\";","","\t// `userAgent` initialized at top of scope","\tuserAgent = id( \"qunit-userAgent\" );","\tif ( userAgent ) {","\t\tuserAgent.innerHTML = navigator.userAgent;","\t}","","\t// `banner` initialized at top of scope","\tbanner = id( \"qunit-header\" );","\tif ( banner ) {","\t\tbanner.innerHTML = \"&lt;a href='\" + QUnit.url({ filter: undefined, module: undefined, testNumber: undefined }) + \"'&gt;\" + banner.innerHTML + \"&lt;/a&gt; \";","\t}","","\t// `toolbar` initialized at top of scope","\ttoolbar = id( \"qunit-testrunner-toolbar\" );","\tif ( toolbar ) {","\t\t// `filter` initialized at top of scope","\t\tfilter = document.createElement( \"input\" );","\t\tfilter.type = \"checkbox\";","\t\tfilter.id = \"qunit-filter-pass\";","","\t\taddEvent( filter, \"click\", function() {","\t\t\tvar tmp,","\t\t\t\tol = document.getElementById( \"qunit-tests\" );","","\t\t\tif ( filter.checked ) {","\t\t\t\tol.className = ol.className + \" hidepass\";","\t\t\t} else {","\t\t\t\ttmp = \" \" + ol.className.replace( /[\\n\\t\\r]/g, \" \" ) + \" \";","\t\t\t\tol.className = tmp.replace( / hidepass /, \" \" );","\t\t\t}","\t\t\tif ( defined.sessionStorage ) {","\t\t\t\tif (filter.checked) {","\t\t\t\t\tsessionStorage.setItem( \"qunit-filter-passed-tests\", \"true\" );","\t\t\t\t} else {","\t\t\t\t\tsessionStorage.removeItem( \"qunit-filter-passed-tests\" );","\t\t\t\t}","\t\t\t}","\t\t});","","\t\tif ( config.hidepassed || defined.sessionStorage &amp;&amp; sessionStorage.getItem( \"qunit-filter-passed-tests\" ) ) {","\t\t\tfilter.checked = true;","\t\t\t// `ol` initialized at top of scope","\t\t\tol = document.getElementById( \"qunit-tests\" );","\t\t\tol.className = ol.className + \" hidepass\";","\t\t}","\t\ttoolbar.appendChild( filter );","","\t\t// `label` initialized at top of scope","\t\tlabel = document.createElement( \"label\" );","\t\tlabel.setAttribute( \"for\", \"qunit-filter-pass\" );","\t\tlabel.setAttribute( \"title\", \"Only show tests and assertons that fail. Stored in sessionStorage.\" );","\t\tlabel.innerHTML = \"Hide passed tests\";","\t\ttoolbar.appendChild( label );","","\t\turlConfigCheckboxes = document.createElement( 'span' );","\t\turlConfigCheckboxes.innerHTML = urlConfigHtml;","\t\taddEvent( urlConfigCheckboxes, \"change\", function( event ) {","\t\t\tvar params = {};","\t\t\tparams[ event.target.name ] = event.target.checked ? true : undefined;","\t\t\twindow.location = QUnit.url( params );","\t\t});","\t\ttoolbar.appendChild( urlConfigCheckboxes );","","\t\tif (numModules &gt; 1) {","\t\t\tmoduleFilter = document.createElement( 'span' );","\t\t\tmoduleFilter.setAttribute( 'id', 'qunit-modulefilter-container' );","\t\t\tmoduleFilter.innerHTML = moduleFilterHtml;","\t\t\taddEvent( moduleFilter, \"change\", function() {","\t\t\t\tvar selectBox = moduleFilter.getElementsByTagName(\"select\")[0],","\t\t\t\t    selectedModule = decodeURIComponent(selectBox.options[selectBox.selectedIndex].value);","","\t\t\t\twindow.location = QUnit.url( { module: ( selectedModule === \"\" ) ? undefined : selectedModule } );","\t\t\t});","\t\t\ttoolbar.appendChild(moduleFilter);","\t\t}","\t}","","\t// `main` initialized at top of scope","\tmain = id( \"qunit-fixture\" );","\tif ( main ) {","\t\tconfig.fixture = main.innerHTML;","\t}","","\tif ( config.autostart ) {","\t\tQUnit.start();","\t}","};","","addEvent( window, \"load\", QUnit.load );","","// `onErrorFnPrev` initialized at top of scope","// Preserve other handlers","onErrorFnPrev = window.onerror;","","// Cover uncaught exceptions","// Returning true will surpress the default browser handler,","// returning false will let it run.","window.onerror = function ( error, filePath, linerNr ) {","\tvar ret = false;","\tif ( onErrorFnPrev ) {","\t\tret = onErrorFnPrev( error, filePath, linerNr );","\t}","","\t// Treat return value as window.onerror itself does,","\t// Only do our handling if not surpressed.","\tif ( ret !== true ) {","\t\tif ( QUnit.config.current ) {","\t\t\tif ( QUnit.config.current.ignoreGlobalErrors ) {","\t\t\t\treturn true;","\t\t\t}","\t\t\tQUnit.pushFailure( error, filePath + \":\" + linerNr );","\t\t} else {","\t\t\tQUnit.test( \"global failure\", extend( function() {","\t\t\t\tQUnit.pushFailure( error, filePath + \":\" + linerNr );","\t\t\t}, { validTest: validTest } ) );","\t\t}","\t\treturn false;","\t}","","\treturn ret;","};","","function done() {","\tconfig.autorun = true;","","\t// Log the last module results","\tif ( config.currentModule ) {","\t\trunLoggingCallbacks( \"moduleDone\", QUnit, {","\t\t\tname: config.currentModule,","\t\t\tfailed: config.moduleStats.bad,","\t\t\tpassed: config.moduleStats.all - config.moduleStats.bad,","\t\t\ttotal: config.moduleStats.all","\t\t});","\t}","","\tvar i, key,","\t\tbanner = id( \"qunit-banner\" ),","\t\ttests = id( \"qunit-tests\" ),","\t\truntime = +new Date() - config.started,","\t\tpassed = config.stats.all - config.stats.bad,","\t\thtml = [","\t\t\t\"Tests completed in \",","\t\t\truntime,","\t\t\t\" milliseconds.&lt;br/&gt;\",","\t\t\t\"&lt;span class='passed'&gt;\",","\t\t\tpassed,","\t\t\t\"&lt;/span&gt; tests of &lt;span class='total'&gt;\",","\t\t\tconfig.stats.all,","\t\t\t\"&lt;/span&gt; passed, &lt;span class='failed'&gt;\",","\t\t\tconfig.stats.bad,","\t\t\t\"&lt;/span&gt; failed.\"","\t\t].join( \"\" );","","\tif ( banner ) {","\t\tbanner.className = ( config.stats.bad ? \"qunit-fail\" : \"qunit-pass\" );","\t}","","\tif ( tests ) {","\t\tid( \"qunit-testresult\" ).innerHTML = html;","\t}","","\tif ( config.altertitle &amp;&amp; typeof document !== \"undefined\" &amp;&amp; document.title ) {","\t\t// show &#10006; for good, &#10004; for bad suite result in title","\t\t// use escape sequences in case file gets loaded with non-utf-8-charset","\t\tdocument.title = [","\t\t\t( config.stats.bad ? \"\\u2716\" : \"\\u2714\" ),","\t\t\tdocument.title.replace( /^[\\u2714\\u2716] /i, \"\" )","\t\t].join( \" \" );","\t}","","\t// clear own sessionStorage items if all tests passed","\tif ( config.reorder &amp;&amp; defined.sessionStorage &amp;&amp; config.stats.bad === 0 ) {","\t\t// `key` &amp; `i` initialized at top of scope","\t\tfor ( i = 0; i &lt; sessionStorage.length; i++ ) {","\t\t\tkey = sessionStorage.key( i++ );","\t\t\tif ( key.indexOf( \"qunit-test-\" ) === 0 ) {","\t\t\t\tsessionStorage.removeItem( key );","\t\t\t}","\t\t}","\t}","","\t// scroll back to top to show results","\tif ( window.scrollTo ) {","\t\twindow.scrollTo(0, 0);","\t}","","\trunLoggingCallbacks( \"done\", QUnit, {","\t\tfailed: config.stats.bad,","\t\tpassed: passed,","\t\ttotal: config.stats.all,","\t\truntime: runtime","\t});","}","","/** @return Boolean: true if this test should be ran */","function validTest( test ) {","\tvar include,","\t\tfilter = config.filter &amp;&amp; config.filter.toLowerCase(),","\t\tmodule = config.module &amp;&amp; config.module.toLowerCase(),","\t\tfullName = (test.module + \": \" + test.testName).toLowerCase();","","\t// Internally-generated tests are always valid","\tif ( test.callback &amp;&amp; test.callback.validTest === validTest ) {","\t\tdelete test.callback.validTest;","\t\treturn true;","\t}","","\tif ( config.testNumber ) {","\t\treturn test.testNumber === config.testNumber;","\t}","","\tif ( module &amp;&amp; ( !test.module || test.module.toLowerCase() !== module ) ) {","\t\treturn false;","\t}","","\tif ( !filter ) {","\t\treturn true;","\t}","","\tinclude = filter.charAt( 0 ) !== \"!\";","\tif ( !include ) {","\t\tfilter = filter.slice( 1 );","\t}","","\t// If the filter matches, we need to honour include","\tif ( fullName.indexOf( filter ) !== -1 ) {","\t\treturn include;","\t}","","\t// Otherwise, do the opposite","\treturn !include;","}","","// so far supports only Firefox, Chrome and Opera (buggy), Safari (for real exceptions)","// Later Safari and IE10 are supposed to support error.stack as well","// See also https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error/Stack","function extractStacktrace( e, offset ) {","\toffset = offset === undefined ? 3 : offset;","","\tvar stack, include, i, regex;","","\tif ( e.stacktrace ) {","\t\t// Opera","\t\treturn e.stacktrace.split( \"\\n\" )[ offset + 3 ];","\t} else if ( e.stack ) {","\t\t// Firefox, Chrome","\t\tstack = e.stack.split( \"\\n\" );","\t\tif (/^error$/i.test( stack[0] ) ) {","\t\t\tstack.shift();","\t\t}","\t\tif ( fileName ) {","\t\t\tinclude = [];","\t\t\tfor ( i = offset; i &lt; stack.length; i++ ) {","\t\t\t\tif ( stack[ i ].indexOf( fileName ) != -1 ) {","\t\t\t\t\tbreak;","\t\t\t\t}","\t\t\t\tinclude.push( stack[ i ] );","\t\t\t}","\t\t\tif ( include.length ) {","\t\t\t\treturn include.join( \"\\n\" );","\t\t\t}","\t\t}","\t\treturn stack[ offset ];","\t} else if ( e.sourceURL ) {","\t\t// Safari, PhantomJS","\t\t// hopefully one day Safari provides actual stacktraces","\t\t// exclude useless self-reference for generated Error objects","\t\tif ( /qunit.js$/.test( e.sourceURL ) ) {","\t\t\treturn;","\t\t}","\t\t// for actual exceptions, this is useful","\t\treturn e.sourceURL + \":\" + e.line;","\t}","}","function sourceFromStacktrace( offset ) {","\ttry {","\t\tthrow new Error();","\t} catch ( e ) {","\t\treturn extractStacktrace( e, offset );","\t}","}","","function escapeInnerText( s ) {","\tif ( !s ) {","\t\treturn \"\";","\t}","\ts = s + \"\";","\treturn s.replace( /[\\&amp;&lt;&gt;]/g, function( s ) {","\t\tswitch( s ) {","\t\t\tcase \"&amp;\": return \"&amp;amp;\";","\t\t\tcase \"&lt;\": return \"&amp;lt;\";","\t\t\tcase \"&gt;\": return \"&amp;gt;\";","\t\t\tdefault: return s;","\t\t}","\t});","}","","function synchronize( callback, last ) {","\tconfig.queue.push( callback );","","\tif ( config.autorun &amp;&amp; !config.blocking ) {","\t\tprocess( last );","\t}","}","","function process( last ) {","\tfunction next() {","\t\tprocess( last );","\t}","\tvar start = new Date().getTime();","\tconfig.depth = config.depth ? config.depth + 1 : 1;","","\twhile ( config.queue.length &amp;&amp; !config.blocking ) {","\t\tif ( !defined.setTimeout || config.updateRate &lt;= 0 || ( ( new Date().getTime() - start ) &lt; config.updateRate ) ) {","\t\t\tconfig.queue.shift()();","\t\t} else {","\t\t\twindow.setTimeout( next, 13 );","\t\t\tbreak;","\t\t}","\t}","\tconfig.depth--;","\tif ( last &amp;&amp; !config.blocking &amp;&amp; !config.queue.length &amp;&amp; config.depth === 0 ) {","\t\tdone();","\t}","}","","function saveGlobal() {","\tconfig.pollution = [];","","\tif ( config.noglobals ) {","\t\tfor ( var key in window ) {","\t\t\t// in Opera sometimes DOM element ids show up here, ignore them","\t\t\tif ( !hasOwn.call( window, key ) || /^qunit-test-output/.test( key ) ) {","\t\t\t\tcontinue;","\t\t\t}","\t\t\tconfig.pollution.push( key );","\t\t}","\t}","}","","function checkPollution( name ) {","\tvar newGlobals,","\t\tdeletedGlobals,","\t\told = config.pollution;","","\tsaveGlobal();","","\tnewGlobals = diff( config.pollution, old );","\tif ( newGlobals.length &gt; 0 ) {","\t\tQUnit.pushFailure( \"Introduced global variable(s): \" + newGlobals.join(\", \") );","\t}","","\tdeletedGlobals = diff( old, config.pollution );","\tif ( deletedGlobals.length &gt; 0 ) {","\t\tQUnit.pushFailure( \"Deleted global variable(s): \" + deletedGlobals.join(\", \") );","\t}","}","","// returns a new Array with the elements that are in a but not in b","function diff( a, b ) {","\tvar i, j,","\t\tresult = a.slice();","","\tfor ( i = 0; i &lt; result.length; i++ ) {","\t\tfor ( j = 0; j &lt; b.length; j++ ) {","\t\t\tif ( result[i] === b[j] ) {","\t\t\t\tresult.splice( i, 1 );","\t\t\t\ti--;","\t\t\t\tbreak;","\t\t\t}","\t\t}","\t}","\treturn result;","}","","function extend( a, b ) {","\tfor ( var prop in b ) {","\t\tif ( b[ prop ] === undefined ) {","\t\t\tdelete a[ prop ];","","\t\t// Avoid \"Member not found\" error in IE8 caused by setting window.constructor","\t\t} else if ( prop !== \"constructor\" || a !== window ) {","\t\t\ta[ prop ] = b[ prop ];","\t\t}","\t}","","\treturn a;","}","","function addEvent( elem, type, fn ) {","\tif ( elem.addEventListener ) {","\t\telem.addEventListener( type, fn, false );","\t} else if ( elem.attachEvent ) {","\t\telem.attachEvent( \"on\" + type, fn );","\t} else {","\t\tfn();","\t}","}","","function hasClass( elem, name ) {","\treturn (\" \" + elem.className + \" \").indexOf(\" \" + name + \" \") &gt; -1;","}","","function addClass( elem, name ) {","\tif ( !hasClass( elem, name ) ) {","\t\telem.className += (elem.className ? \" \" : \"\") + name;","\t}","}","","function removeClass( elem, name ) {","\tvar set = \" \" + elem.className + \" \";","\t// Class name may appear multiple times","\twhile ( set.indexOf(\" \" + name + \" \") &gt; -1 ) {","\t\tset = set.replace(\" \" + name + \" \" , \" \");","\t}","\t// If possible, trim it for prettiness, but not neccecarily","\telem.className = window.jQuery ? jQuery.trim( set ) : ( set.trim ? set.trim() : set );","}","","function id( name ) {","\treturn !!( typeof document !== \"undefined\" &amp;&amp; document &amp;&amp; document.getElementById ) &amp;&amp;","\t\tdocument.getElementById( name );","}","","function registerLoggingCallback( key ) {","\treturn function( callback ) {","\t\tconfig[key].push( callback );","\t};","}","","// Supports deprecated method of completely overwriting logging callbacks","function runLoggingCallbacks( key, scope, args ) {","\t//debugger;","\tvar i, callbacks;","\tif ( QUnit.hasOwnProperty( key ) ) {","\t\tQUnit[ key ].call(scope, args );","\t} else {","\t\tcallbacks = config[ key ];","\t\tfor ( i = 0; i &lt; callbacks.length; i++ ) {","\t\t\tcallbacks[ i ].call( scope, args );","\t\t}","\t}","}","","// Test for equality any JavaScript type.","// Author: Philippe Rath&#233; &lt;prathe@gmail.com&gt;","QUnit.equiv = (function() {","","\t// Call the o related callback with the given arguments.","\tfunction bindCallbacks( o, callbacks, args ) {","\t\tvar prop = QUnit.objectType( o );","\t\tif ( prop ) {","\t\t\tif ( QUnit.objectType( callbacks[ prop ] ) === \"function\" ) {","\t\t\t\treturn callbacks[ prop ].apply( callbacks, args );","\t\t\t} else {","\t\t\t\treturn callbacks[ prop ]; // or undefined","\t\t\t}","\t\t}","\t}","","\t// the real equiv function","\tvar innerEquiv,","\t\t// stack to decide between skip/abort functions","\t\tcallers = [],","\t\t// stack to avoiding loops from circular referencing","\t\tparents = [],","","\t\tgetProto = Object.getPrototypeOf || function ( obj ) {","\t\t\treturn obj.__proto__;","\t\t},","\t\tcallbacks = (function () {","","\t\t\t// for string, boolean, number and null","\t\t\tfunction useStrictEquality( b, a ) {","\t\t\t\tif ( b instanceof a.constructor || a instanceof b.constructor ) {","\t\t\t\t\t// to catch short annotaion VS 'new' annotation of a","\t\t\t\t\t// declaration","\t\t\t\t\t// e.g. var i = 1;","\t\t\t\t\t// var j = new Number(1);","\t\t\t\t\treturn a == b;","\t\t\t\t} else {","\t\t\t\t\treturn a === b;","\t\t\t\t}","\t\t\t}","","\t\t\treturn {","\t\t\t\t\"string\": useStrictEquality,","\t\t\t\t\"boolean\": useStrictEquality,","\t\t\t\t\"number\": useStrictEquality,","\t\t\t\t\"null\": useStrictEquality,","\t\t\t\t\"undefined\": useStrictEquality,","","\t\t\t\t\"nan\": function( b ) {","\t\t\t\t\treturn isNaN( b );","\t\t\t\t},","","\t\t\t\t\"date\": function( b, a ) {","\t\t\t\t\treturn QUnit.objectType( b ) === \"date\" &amp;&amp; a.valueOf() === b.valueOf();","\t\t\t\t},","","\t\t\t\t\"regexp\": function( b, a ) {","\t\t\t\t\treturn QUnit.objectType( b ) === \"regexp\" &amp;&amp;","\t\t\t\t\t\t// the regex itself","\t\t\t\t\t\ta.source === b.source &amp;&amp;","\t\t\t\t\t\t// and its modifers","\t\t\t\t\t\ta.global === b.global &amp;&amp;","\t\t\t\t\t\t// (gmi) ...","\t\t\t\t\t\ta.ignoreCase === b.ignoreCase &amp;&amp;","\t\t\t\t\t\ta.multiline === b.multiline &amp;&amp;","\t\t\t\t\t\ta.sticky === b.sticky;","\t\t\t\t},","","\t\t\t\t// - skip when the property is a method of an instance (OOP)","\t\t\t\t// - abort otherwise,","\t\t\t\t// initial === would have catch identical references anyway","\t\t\t\t\"function\": function() {","\t\t\t\t\tvar caller = callers[callers.length - 1];","\t\t\t\t\treturn caller !== Object &amp;&amp; typeof caller !== \"undefined\";","\t\t\t\t},","","\t\t\t\t\"array\": function( b, a ) {","\t\t\t\t\tvar i, j, len, loop;","","\t\t\t\t\t// b could be an object literal here","\t\t\t\t\tif ( QUnit.objectType( b ) !== \"array\" ) {","\t\t\t\t\t\treturn false;","\t\t\t\t\t}","","\t\t\t\t\tlen = a.length;","\t\t\t\t\tif ( len !== b.length ) {","\t\t\t\t\t\t// safe and faster","\t\t\t\t\t\treturn false;","\t\t\t\t\t}","","\t\t\t\t\t// track reference to avoid circular references","\t\t\t\t\tparents.push( a );","\t\t\t\t\tfor ( i = 0; i &lt; len; i++ ) {","\t\t\t\t\t\tloop = false;","\t\t\t\t\t\tfor ( j = 0; j &lt; parents.length; j++ ) {","\t\t\t\t\t\t\tif ( parents[j] === a[i] ) {","\t\t\t\t\t\t\t\tloop = true;// dont rewalk array","\t\t\t\t\t\t\t}","\t\t\t\t\t\t}","\t\t\t\t\t\tif ( !loop &amp;&amp; !innerEquiv(a[i], b[i]) ) {","\t\t\t\t\t\t\tparents.pop();","\t\t\t\t\t\t\treturn false;","\t\t\t\t\t\t}","\t\t\t\t\t}","\t\t\t\t\tparents.pop();","\t\t\t\t\treturn true;","\t\t\t\t},","","\t\t\t\t\"object\": function( b, a ) {","\t\t\t\t\tvar i, j, loop,","\t\t\t\t\t\t// Default to true","\t\t\t\t\t\teq = true,","\t\t\t\t\t\taProperties = [],","\t\t\t\t\t\tbProperties = [];","","\t\t\t\t\t// comparing constructors is more strict than using","\t\t\t\t\t// instanceof","\t\t\t\t\tif ( a.constructor !== b.constructor ) {","\t\t\t\t\t\t// Allow objects with no prototype to be equivalent to","\t\t\t\t\t\t// objects with Object as their constructor.","\t\t\t\t\t\tif ( !(( getProto(a) === null &amp;&amp; getProto(b) === Object.prototype ) ||","\t\t\t\t\t\t\t( getProto(b) === null &amp;&amp; getProto(a) === Object.prototype ) ) ) {","\t\t\t\t\t\t\t\treturn false;","\t\t\t\t\t\t}","\t\t\t\t\t}","","\t\t\t\t\t// stack constructor before traversing properties","\t\t\t\t\tcallers.push( a.constructor );","\t\t\t\t\t// track reference to avoid circular references","\t\t\t\t\tparents.push( a );","","\t\t\t\t\tfor ( i in a ) { // be strict: don't ensures hasOwnProperty","\t\t\t\t\t\t\t\t\t// and go deep","\t\t\t\t\t\tloop = false;","\t\t\t\t\t\tfor ( j = 0; j &lt; parents.length; j++ ) {","\t\t\t\t\t\t\tif ( parents[j] === a[i] ) {","\t\t\t\t\t\t\t\t// don't go down the same path twice","\t\t\t\t\t\t\t\tloop = true;","\t\t\t\t\t\t\t}","\t\t\t\t\t\t}","\t\t\t\t\t\taProperties.push(i); // collect a's properties","","\t\t\t\t\t\tif (!loop &amp;&amp; !innerEquiv( a[i], b[i] ) ) {","\t\t\t\t\t\t\teq = false;","\t\t\t\t\t\t\tbreak;","\t\t\t\t\t\t}","\t\t\t\t\t}","","\t\t\t\t\tcallers.pop(); // unstack, we are done","\t\t\t\t\tparents.pop();","","\t\t\t\t\tfor ( i in b ) {","\t\t\t\t\t\tbProperties.push( i ); // collect b's properties","\t\t\t\t\t}","","\t\t\t\t\t// Ensures identical properties name","\t\t\t\t\treturn eq &amp;&amp; innerEquiv( aProperties.sort(), bProperties.sort() );","\t\t\t\t}","\t\t\t};","\t\t}());","","\tinnerEquiv = function() { // can take multiple arguments","\t\tvar args = [].slice.apply( arguments );","\t\tif ( args.length &lt; 2 ) {","\t\t\treturn true; // end transition","\t\t}","","\t\treturn (function( a, b ) {","\t\t\tif ( a === b ) {","\t\t\t\treturn true; // catch the most you can","\t\t\t} else if ( a === null || b === null || typeof a === \"undefined\" ||","\t\t\t\t\ttypeof b === \"undefined\" ||","\t\t\t\t\tQUnit.objectType(a) !== QUnit.objectType(b) ) {","\t\t\t\treturn false; // don't lose time with error prone cases","\t\t\t} else {","\t\t\t\treturn bindCallbacks(a, callbacks, [ b, a ]);","\t\t\t}","","\t\t\t// apply transition with (1..n) arguments","\t\t}( args[0], args[1] ) &amp;&amp; arguments.callee.apply( this, args.splice(1, args.length - 1 )) );","\t};","","\treturn innerEquiv;","}());","","/**"," * jsDump Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com |"," * http://flesler.blogspot.com Licensed under BSD"," * (http://www.opensource.org/licenses/bsd-license.php) Date: 5/15/2008"," *"," * @projectDescription Advanced and extensible data dumping for Javascript."," * @version 1.0.0"," * @author Ariel Flesler"," * @link {http://flesler.blogspot.com/2008/05/jsdump-pretty-dump-of-any-javascript.html}"," */","QUnit.jsDump = (function() {","\tfunction quote( str ) {","\t\treturn '\"' + str.toString().replace( /\"/g, '\\\\\"' ) + '\"';","\t}","\tfunction literal( o ) {","\t\treturn o + \"\";","\t}","\tfunction join( pre, arr, post ) {","\t\tvar s = jsDump.separator(),","\t\t\tbase = jsDump.indent(),","\t\t\tinner = jsDump.indent(1);","\t\tif ( arr.join ) {","\t\t\tarr = arr.join( \",\" + s + inner );","\t\t}","\t\tif ( !arr ) {","\t\t\treturn pre + post;","\t\t}","\t\treturn [ pre, inner + arr, base + post ].join(s);","\t}","\tfunction array( arr, stack ) {","\t\tvar i = arr.length, ret = new Array(i);","\t\tthis.up();","\t\twhile ( i-- ) {","\t\t\tret[i] = this.parse( arr[i] , undefined , stack);","\t\t}","\t\tthis.down();","\t\treturn join( \"[\", ret, \"]\" );","\t}","","\tvar reName = /^function (\\w+)/,","\t\tjsDump = {","\t\t\t// type is used mostly internally, you can fix a (custom)type in advance","\t\t\tparse: function( obj, type, stack ) {","\t\t\t\tstack = stack || [ ];","\t\t\t\tvar inStack, res,","\t\t\t\t\tparser = this.parsers[ type || this.typeOf(obj) ];","","\t\t\t\ttype = typeof parser;","\t\t\t\tinStack = inArray( obj, stack );","","\t\t\t\tif ( inStack != -1 ) {","\t\t\t\t\treturn \"recursion(\" + (inStack - stack.length) + \")\";","\t\t\t\t}","\t\t\t\tif ( type == \"function\" )  {","\t\t\t\t\tstack.push( obj );","\t\t\t\t\tres = parser.call( this, obj, stack );","\t\t\t\t\tstack.pop();","\t\t\t\t\treturn res;","\t\t\t\t}","\t\t\t\treturn ( type == \"string\" ) ? parser : this.parsers.error;","\t\t\t},","\t\t\ttypeOf: function( obj ) {","\t\t\t\tvar type;","\t\t\t\tif ( obj === null ) {","\t\t\t\t\ttype = \"null\";","\t\t\t\t} else if ( typeof obj === \"undefined\" ) {","\t\t\t\t\ttype = \"undefined\";","\t\t\t\t} else if ( QUnit.is( \"regexp\", obj) ) {","\t\t\t\t\ttype = \"regexp\";","\t\t\t\t} else if ( QUnit.is( \"date\", obj) ) {","\t\t\t\t\ttype = \"date\";","\t\t\t\t} else if ( QUnit.is( \"function\", obj) ) {","\t\t\t\t\ttype = \"function\";","\t\t\t\t} else if ( typeof obj.setInterval !== undefined &amp;&amp; typeof obj.document !== \"undefined\" &amp;&amp; typeof obj.nodeType === \"undefined\" ) {","\t\t\t\t\ttype = \"window\";","\t\t\t\t} else if ( obj.nodeType === 9 ) {","\t\t\t\t\ttype = \"document\";","\t\t\t\t} else if ( obj.nodeType ) {","\t\t\t\t\ttype = \"node\";","\t\t\t\t} else if (","\t\t\t\t\t// native arrays","\t\t\t\t\ttoString.call( obj ) === \"[object Array]\" ||","\t\t\t\t\t// NodeList objects","\t\t\t\t\t( typeof obj.length === \"number\" &amp;&amp; typeof obj.item !== \"undefined\" &amp;&amp; ( obj.length ? obj.item(0) === obj[0] : ( obj.item( 0 ) === null &amp;&amp; typeof obj[0] === \"undefined\" ) ) )","\t\t\t\t) {","\t\t\t\t\ttype = \"array\";","\t\t\t\t} else if ( obj.constructor === Error.prototype.constructor ) {","\t\t\t\t\ttype = \"error\";","\t\t\t\t} else {","\t\t\t\t\ttype = typeof obj;","\t\t\t\t}","\t\t\t\treturn type;","\t\t\t},","\t\t\tseparator: function() {","\t\t\t\treturn this.multiline ?\tthis.HTML ? \"&lt;br /&gt;\" : \"\\n\" : this.HTML ? \"&amp;nbsp;\" : \" \";","\t\t\t},","\t\t\t// extra can be a number, shortcut for increasing-calling-decreasing","\t\t\tindent: function( extra ) {","\t\t\t\tif ( !this.multiline ) {","\t\t\t\t\treturn \"\";","\t\t\t\t}","\t\t\t\tvar chr = this.indentChar;","\t\t\t\tif ( this.HTML ) {","\t\t\t\t\tchr = chr.replace( /\\t/g, \"   \" ).replace( / /g, \"&amp;nbsp;\" );","\t\t\t\t}","\t\t\t\treturn new Array( this._depth_ + (extra||0) ).join(chr);","\t\t\t},","\t\t\tup: function( a ) {","\t\t\t\tthis._depth_ += a || 1;","\t\t\t},","\t\t\tdown: function( a ) {","\t\t\t\tthis._depth_ -= a || 1;","\t\t\t},","\t\t\tsetParser: function( name, parser ) {","\t\t\t\tthis.parsers[name] = parser;","\t\t\t},","\t\t\t// The next 3 are exposed so you can use them","\t\t\tquote: quote,","\t\t\tliteral: literal,","\t\t\tjoin: join,","\t\t\t//","\t\t\t_depth_: 1,","\t\t\t// This is the list of parsers, to modify them, use jsDump.setParser","\t\t\tparsers: {","\t\t\t\twindow: \"[Window]\",","\t\t\t\tdocument: \"[Document]\",","\t\t\t\terror: function(error) {","\t\t\t\t\treturn \"Error(\\\"\" + error.message + \"\\\")\";","\t\t\t\t},","\t\t\t\tunknown: \"[Unknown]\",","\t\t\t\t\"null\": \"null\",","\t\t\t\t\"undefined\": \"undefined\",","\t\t\t\t\"function\": function( fn ) {","\t\t\t\t\tvar ret = \"function\",","\t\t\t\t\t\t// functions never have name in IE","\t\t\t\t\t\tname = \"name\" in fn ? fn.name : (reName.exec(fn) || [])[1];","","\t\t\t\t\tif ( name ) {","\t\t\t\t\t\tret += \" \" + name;","\t\t\t\t\t}","\t\t\t\t\tret += \"( \";","","\t\t\t\t\tret = [ ret, QUnit.jsDump.parse( fn, \"functionArgs\" ), \"){\" ].join( \"\" );","\t\t\t\t\treturn join( ret, QUnit.jsDump.parse(fn,\"functionCode\" ), \"}\" );","\t\t\t\t},","\t\t\t\tarray: array,","\t\t\t\tnodelist: array,","\t\t\t\t\"arguments\": array,","\t\t\t\tobject: function( map, stack ) {","\t\t\t\t\tvar ret = [ ], keys, key, val, i;","\t\t\t\t\tQUnit.jsDump.up();","\t\t\t\t\tkeys = [];","\t\t\t\t\tfor ( key in map ) {","\t\t\t\t\t\tkeys.push( key );","\t\t\t\t\t}","\t\t\t\t\tkeys.sort();","\t\t\t\t\tfor ( i = 0; i &lt; keys.length; i++ ) {","\t\t\t\t\t\tkey = keys[ i ];","\t\t\t\t\t\tval = map[ key ];","\t\t\t\t\t\tret.push( QUnit.jsDump.parse( key, \"key\" ) + \": \" + QUnit.jsDump.parse( val, undefined, stack ) );","\t\t\t\t\t}","\t\t\t\t\tQUnit.jsDump.down();","\t\t\t\t\treturn join( \"{\", ret, \"}\" );","\t\t\t\t},","\t\t\t\tnode: function( node ) {","\t\t\t\t\tvar a, val,","\t\t\t\t\t\topen = QUnit.jsDump.HTML ? \"&amp;lt;\" : \"&lt;\",","\t\t\t\t\t\tclose = QUnit.jsDump.HTML ? \"&amp;gt;\" : \"&gt;\",","\t\t\t\t\t\ttag = node.nodeName.toLowerCase(),","\t\t\t\t\t\tret = open + tag;","","\t\t\t\t\tfor ( a in QUnit.jsDump.DOMAttrs ) {","\t\t\t\t\t\tval = node[ QUnit.jsDump.DOMAttrs[a] ];","\t\t\t\t\t\tif ( val ) {","\t\t\t\t\t\t\tret += \" \" + a + \"=\" + QUnit.jsDump.parse( val, \"attribute\" );","\t\t\t\t\t\t}","\t\t\t\t\t}","\t\t\t\t\treturn ret + close + open + \"/\" + tag + close;","\t\t\t\t},","\t\t\t\t// function calls it internally, it's the arguments part of the function","\t\t\t\tfunctionArgs: function( fn ) {","\t\t\t\t\tvar args,","\t\t\t\t\t\tl = fn.length;","","\t\t\t\t\tif ( !l ) {","\t\t\t\t\t\treturn \"\";","\t\t\t\t\t}","","\t\t\t\t\targs = new Array(l);","\t\t\t\t\twhile ( l-- ) {","\t\t\t\t\t\t// 97 is 'a'","\t\t\t\t\t\targs[l] = String.fromCharCode(97+l);","\t\t\t\t\t}","\t\t\t\t\treturn \" \" + args.join( \", \" ) + \" \";","\t\t\t\t},","\t\t\t\t// object calls it internally, the key part of an item in a map","\t\t\t\tkey: quote,","\t\t\t\t// function calls it internally, it's the content of the function","\t\t\t\tfunctionCode: \"[code]\",","\t\t\t\t// node calls it internally, it's an html attribute value","\t\t\t\tattribute: quote,","\t\t\t\tstring: quote,","\t\t\t\tdate: quote,","\t\t\t\tregexp: literal,","\t\t\t\tnumber: literal,","\t\t\t\t\"boolean\": literal","\t\t\t},","\t\t\tDOMAttrs: {","\t\t\t\t//attributes to dump from nodes, name=&gt;realName","\t\t\t\tid: \"id\",","\t\t\t\tname: \"name\",","\t\t\t\t\"class\": \"className\"","\t\t\t},","\t\t\t// if true, entities are escaped ( &lt;, &gt;, \\t, space and \\n )","\t\t\tHTML: false,","\t\t\t// indentation unit","\t\t\tindentChar: \"  \",","\t\t\t// if true, items in a collection, are separated by a \\n, else just a space.","\t\t\tmultiline: true","\t\t};","","\treturn jsDump;","}());","","// from Sizzle.js","function getText( elems ) {","\tvar i, elem,","\t\tret = \"\";","","\tfor ( i = 0; elems[i]; i++ ) {","\t\telem = elems[i];","","\t\t// Get the text from text nodes and CDATA nodes","\t\tif ( elem.nodeType === 3 || elem.nodeType === 4 ) {","\t\t\tret += elem.nodeValue;","","\t\t// Traverse everything else, except comment nodes","\t\t} else if ( elem.nodeType !== 8 ) {","\t\t\tret += getText( elem.childNodes );","\t\t}","\t}","","\treturn ret;","}","","// from jquery.js","function inArray( elem, array ) {","\tif ( array.indexOf ) {","\t\treturn array.indexOf( elem );","\t}","","\tfor ( var i = 0, length = array.length; i &lt; length; i++ ) {","\t\tif ( array[ i ] === elem ) {","\t\t\treturn i;","\t\t}","\t}","","\treturn -1;","}","","/*"," * Javascript Diff Algorithm"," *  By John Resig (http://ejohn.org/)"," *  Modified by Chu Alan \"sprite\""," *"," * Released under the MIT license."," *"," * More Info:"," *  http://ejohn.org/projects/javascript-diff-algorithm/"," *"," * Usage: QUnit.diff(expected, actual)"," *"," * QUnit.diff( \"the quick brown fox jumped over\", \"the quick fox jumps over\" ) == \"the  quick &lt;del&gt;brown &lt;/del&gt; fox &lt;del&gt;jumped &lt;/del&gt;&lt;ins&gt;jumps &lt;/ins&gt; over\""," */","QUnit.diff = (function() {","\tfunction diff( o, n ) {","\t\tvar i,","\t\t\tns = {},","\t\t\tos = {};","","\t\tfor ( i = 0; i &lt; n.length; i++ ) {","\t\t\tif ( ns[ n[i] ] == null ) {","\t\t\t\tns[ n[i] ] = {","\t\t\t\t\trows: [],","\t\t\t\t\to: null","\t\t\t\t};","\t\t\t}","\t\t\tns[ n[i] ].rows.push( i );","\t\t}","","\t\tfor ( i = 0; i &lt; o.length; i++ ) {","\t\t\tif ( os[ o[i] ] == null ) {","\t\t\t\tos[ o[i] ] = {","\t\t\t\t\trows: [],","\t\t\t\t\tn: null","\t\t\t\t};","\t\t\t}","\t\t\tos[ o[i] ].rows.push( i );","\t\t}","","\t\tfor ( i in ns ) {","\t\t\tif ( !hasOwn.call( ns, i ) ) {","\t\t\t\tcontinue;","\t\t\t}","\t\t\tif ( ns[i].rows.length == 1 &amp;&amp; typeof os[i] != \"undefined\" &amp;&amp; os[i].rows.length == 1 ) {","\t\t\t\tn[ ns[i].rows[0] ] = {","\t\t\t\t\ttext: n[ ns[i].rows[0] ],","\t\t\t\t\trow: os[i].rows[0]","\t\t\t\t};","\t\t\t\to[ os[i].rows[0] ] = {","\t\t\t\t\ttext: o[ os[i].rows[0] ],","\t\t\t\t\trow: ns[i].rows[0]","\t\t\t\t};","\t\t\t}","\t\t}","","\t\tfor ( i = 0; i &lt; n.length - 1; i++ ) {","\t\t\tif ( n[i].text != null &amp;&amp; n[ i + 1 ].text == null &amp;&amp; n[i].row + 1 &lt; o.length &amp;&amp; o[ n[i].row + 1 ].text == null &amp;&amp;","\t\t\t\t\t\tn[ i + 1 ] == o[ n[i].row + 1 ] ) {","","\t\t\t\tn[ i + 1 ] = {","\t\t\t\t\ttext: n[ i + 1 ],","\t\t\t\t\trow: n[i].row + 1","\t\t\t\t};","\t\t\t\to[ n[i].row + 1 ] = {","\t\t\t\t\ttext: o[ n[i].row + 1 ],","\t\t\t\t\trow: i + 1","\t\t\t\t};","\t\t\t}","\t\t}","","\t\tfor ( i = n.length - 1; i &gt; 0; i-- ) {","\t\t\tif ( n[i].text != null &amp;&amp; n[ i - 1 ].text == null &amp;&amp; n[i].row &gt; 0 &amp;&amp; o[ n[i].row - 1 ].text == null &amp;&amp;","\t\t\t\t\t\tn[ i - 1 ] == o[ n[i].row - 1 ]) {","","\t\t\t\tn[ i - 1 ] = {","\t\t\t\t\ttext: n[ i - 1 ],","\t\t\t\t\trow: n[i].row - 1","\t\t\t\t};","\t\t\t\to[ n[i].row - 1 ] = {","\t\t\t\t\ttext: o[ n[i].row - 1 ],","\t\t\t\t\trow: i - 1","\t\t\t\t};","\t\t\t}","\t\t}","","\t\treturn {","\t\t\to: o,","\t\t\tn: n","\t\t};","\t}","","\treturn function( o, n ) {","\t\to = o.replace( /\\s+$/, \"\" );","\t\tn = n.replace( /\\s+$/, \"\" );","","\t\tvar i, pre,","\t\t\tstr = \"\",","\t\t\tout = diff( o === \"\" ? [] : o.split(/\\s+/), n === \"\" ? [] : n.split(/\\s+/) ),","\t\t\toSpace = o.match(/\\s+/g),","\t\t\tnSpace = n.match(/\\s+/g);","","\t\tif ( oSpace == null ) {","\t\t\toSpace = [ \" \" ];","\t\t}","\t\telse {","\t\t\toSpace.push( \" \" );","\t\t}","","\t\tif ( nSpace == null ) {","\t\t\tnSpace = [ \" \" ];","\t\t}","\t\telse {","\t\t\tnSpace.push( \" \" );","\t\t}","","\t\tif ( out.n.length === 0 ) {","\t\t\tfor ( i = 0; i &lt; out.o.length; i++ ) {","\t\t\t\tstr += \"&lt;del&gt;\" + out.o[i] + oSpace[i] + \"&lt;/del&gt;\";","\t\t\t}","\t\t}","\t\telse {","\t\t\tif ( out.n[0].text == null ) {","\t\t\t\tfor ( n = 0; n &lt; out.o.length &amp;&amp; out.o[n].text == null; n++ ) {","\t\t\t\t\tstr += \"&lt;del&gt;\" + out.o[n] + oSpace[n] + \"&lt;/del&gt;\";","\t\t\t\t}","\t\t\t}","","\t\t\tfor ( i = 0; i &lt; out.n.length; i++ ) {","\t\t\t\tif (out.n[i].text == null) {","\t\t\t\t\tstr += \"&lt;ins&gt;\" + out.n[i] + nSpace[i] + \"&lt;/ins&gt;\";","\t\t\t\t}","\t\t\t\telse {","\t\t\t\t\t// `pre` initialized at top of scope","\t\t\t\t\tpre = \"\";","","\t\t\t\t\tfor ( n = out.n[i].row + 1; n &lt; out.o.length &amp;&amp; out.o[n].text == null; n++ ) {","\t\t\t\t\t\tpre += \"&lt;del&gt;\" + out.o[n] + oSpace[n] + \"&lt;/del&gt;\";","\t\t\t\t\t}","\t\t\t\t\tstr += \" \" + out.n[i].text + nSpace[i] + pre;","\t\t\t\t}","\t\t\t}","\t\t}","","\t\treturn str;","\t};","}());","","// for CommonJS enviroments, export everything","if ( typeof exports !== \"undefined\" ) {","\textend(exports, QUnit);","}","","// get at whatever the global object is, like window in browsers","}( (function() {return this;}.call()) ));"];
_$jscoverage['qunit/qunit.js'][11]++;
(function(window) {
  _$jscoverage['qunit/qunit.js'][13]++;
  var QUnit, config, onErrorFnPrev, testId = 0, fileName = (sourceFromStacktrace(0) || "").replace(/(:\d+)+\)?/, "").replace(/.+\//, ""), toString = Object.prototype.toString, hasOwn = Object.prototype.hasOwnProperty, Date = window.Date, defined = {setTimeout: typeof window.setTimeout !== "undefined", sessionStorage: (function() {
  _$jscoverage['qunit/qunit.js'][25]++;
  var x = "qunit-test-string";
  _$jscoverage['qunit/qunit.js'][26]++;
  try {
    _$jscoverage['qunit/qunit.js'][27]++;
    sessionStorage.setItem(x, x);
    _$jscoverage['qunit/qunit.js'][28]++;
    sessionStorage.removeItem(x);
    _$jscoverage['qunit/qunit.js'][29]++;
    return true;
  }  catch (e) {
  _$jscoverage['qunit/qunit.js'][31]++;
  return false;
}
}())};
  _$jscoverage['qunit/qunit.js'][36]++;
  function Test(settings) {
    _$jscoverage['qunit/qunit.js'][37]++;
    extend(this, settings);
    _$jscoverage['qunit/qunit.js'][38]++;
    this.assertions = [];
    _$jscoverage['qunit/qunit.js'][39]++;
    this.testNumber = ++Test.count;
  }
  _$jscoverage['qunit/qunit.js'][42]++;
  Test.count = 0;
  _$jscoverage['qunit/qunit.js'][44]++;
  Test.prototype = {init: function() {
  _$jscoverage['qunit/qunit.js'][46]++;
  var a, b, li, tests = id("qunit-tests");
  _$jscoverage['qunit/qunit.js'][49]++;
  if (tests) {
    _$jscoverage['qunit/qunit.js'][50]++;
    b = document.createElement("strong");
    _$jscoverage['qunit/qunit.js'][51]++;
    b.innerHTML = this.name;
    _$jscoverage['qunit/qunit.js'][54]++;
    a = document.createElement("a");
    _$jscoverage['qunit/qunit.js'][55]++;
    a.innerHTML = "Rerun";
    _$jscoverage['qunit/qunit.js'][56]++;
    a.href = QUnit.url({testNumber: this.testNumber});
    _$jscoverage['qunit/qunit.js'][58]++;
    li = document.createElement("li");
    _$jscoverage['qunit/qunit.js'][59]++;
    li.appendChild(b);
    _$jscoverage['qunit/qunit.js'][60]++;
    li.appendChild(a);
    _$jscoverage['qunit/qunit.js'][61]++;
    li.className = "running";
    _$jscoverage['qunit/qunit.js'][62]++;
    li.id = this.id = "qunit-test-output" + testId++;
    _$jscoverage['qunit/qunit.js'][64]++;
    tests.appendChild(li);
  }
}, setup: function() {
  _$jscoverage['qunit/qunit.js'][68]++;
  if (this.module !== config.previousModule) {
    _$jscoverage['qunit/qunit.js'][69]++;
    if (config.previousModule) {
      _$jscoverage['qunit/qunit.js'][70]++;
      runLoggingCallbacks("moduleDone", QUnit, {name: config.previousModule, failed: config.moduleStats.bad, passed: config.moduleStats.all - config.moduleStats.bad, total: config.moduleStats.all});
    }
    _$jscoverage['qunit/qunit.js'][77]++;
    config.previousModule = this.module;
    _$jscoverage['qunit/qunit.js'][78]++;
    config.moduleStats = {all: 0, bad: 0};
    _$jscoverage['qunit/qunit.js'][79]++;
    runLoggingCallbacks("moduleStart", QUnit, {name: this.module});
  } else {
    _$jscoverage['qunit/qunit.js'][82]++;
    if (config.autorun) {
      _$jscoverage['qunit/qunit.js'][83]++;
      runLoggingCallbacks("moduleStart", QUnit, {name: this.module});
    }
  }
  _$jscoverage['qunit/qunit.js'][88]++;
  config.current = this;
  _$jscoverage['qunit/qunit.js'][90]++;
  this.testEnvironment = extend({setup: function() {
}, teardown: function() {
}}, this.moduleTestEnvironment);
  _$jscoverage['qunit/qunit.js'][95]++;
  runLoggingCallbacks("testStart", QUnit, {name: this.testName, module: this.module});
  _$jscoverage['qunit/qunit.js'][102]++;
  QUnit.current_testEnvironment = this.testEnvironment;
  _$jscoverage['qunit/qunit.js'][104]++;
  if (!config.pollution) {
    _$jscoverage['qunit/qunit.js'][105]++;
    saveGlobal();
  }
  _$jscoverage['qunit/qunit.js'][107]++;
  if (config.notrycatch) {
    _$jscoverage['qunit/qunit.js'][108]++;
    this.testEnvironment.setup.call(this.testEnvironment);
    _$jscoverage['qunit/qunit.js'][109]++;
    return;
  }
  _$jscoverage['qunit/qunit.js'][111]++;
  try {
    _$jscoverage['qunit/qunit.js'][112]++;
    this.testEnvironment.setup.call(this.testEnvironment);
  }  catch (e) {
  _$jscoverage['qunit/qunit.js'][114]++;
  QUnit.pushFailure("Setup failed on " + this.testName + ": " + (e.message || e), extractStacktrace(e, 1));
}
}, run: function() {
  _$jscoverage['qunit/qunit.js'][118]++;
  config.current = this;
  _$jscoverage['qunit/qunit.js'][120]++;
  var running = id("qunit-testresult");
  _$jscoverage['qunit/qunit.js'][122]++;
  if (running) {
    _$jscoverage['qunit/qunit.js'][123]++;
    running.innerHTML = "Running: <br/>" + this.name;
  }
  _$jscoverage['qunit/qunit.js'][126]++;
  if (this.async) {
    _$jscoverage['qunit/qunit.js'][127]++;
    QUnit.stop();
  }
  _$jscoverage['qunit/qunit.js'][130]++;
  if (config.notrycatch) {
    _$jscoverage['qunit/qunit.js'][131]++;
    this.callback.call(this.testEnvironment, QUnit.assert);
    _$jscoverage['qunit/qunit.js'][132]++;
    return;
  }
  _$jscoverage['qunit/qunit.js'][135]++;
  try {
    _$jscoverage['qunit/qunit.js'][136]++;
    this.callback.call(this.testEnvironment, QUnit.assert);
  }  catch (e) {
  _$jscoverage['qunit/qunit.js'][138]++;
  QUnit.pushFailure("Died on test #" + (this.assertions.length + 1) + " " + this.stack + ": " + (e.message || e), extractStacktrace(e, 0));
  _$jscoverage['qunit/qunit.js'][140]++;
  saveGlobal();
  _$jscoverage['qunit/qunit.js'][143]++;
  if (config.blocking) {
    _$jscoverage['qunit/qunit.js'][144]++;
    QUnit.start();
  }
}
}, teardown: function() {
  _$jscoverage['qunit/qunit.js'][149]++;
  config.current = this;
  _$jscoverage['qunit/qunit.js'][150]++;
  if (config.notrycatch) {
    _$jscoverage['qunit/qunit.js'][151]++;
    this.testEnvironment.teardown.call(this.testEnvironment);
    _$jscoverage['qunit/qunit.js'][152]++;
    return;
  } else {
    _$jscoverage['qunit/qunit.js'][154]++;
    try {
      _$jscoverage['qunit/qunit.js'][155]++;
      this.testEnvironment.teardown.call(this.testEnvironment);
    }    catch (e) {
  _$jscoverage['qunit/qunit.js'][157]++;
  QUnit.pushFailure("Teardown failed on " + this.testName + ": " + (e.message || e), extractStacktrace(e, 1));
}
  }
  _$jscoverage['qunit/qunit.js'][160]++;
  checkPollution();
}, finish: function() {
  _$jscoverage['qunit/qunit.js'][163]++;
  config.current = this;
  _$jscoverage['qunit/qunit.js'][164]++;
  if (config.requireExpects && this.expected == null) {
    _$jscoverage['qunit/qunit.js'][165]++;
    QUnit.pushFailure("Expected number of assertions to be defined, but expect() was not called.", this.stack);
  } else {
    _$jscoverage['qunit/qunit.js'][166]++;
    if (this.expected != null && this.expected != this.assertions.length) {
      _$jscoverage['qunit/qunit.js'][167]++;
      QUnit.pushFailure("Expected " + this.expected + " assertions, but " + this.assertions.length + " were run", this.stack);
    } else {
      _$jscoverage['qunit/qunit.js'][168]++;
      if (this.expected == null && !this.assertions.length) {
        _$jscoverage['qunit/qunit.js'][169]++;
        QUnit.pushFailure("Expected at least one assertion, but none were run - call expect(0) to accept zero assertions.", this.stack);
      }
    }
  }
  _$jscoverage['qunit/qunit.js'][172]++;
  var assertion, a, b, i, li, ol, test = this, good = 0, bad = 0, tests = id("qunit-tests");
  _$jscoverage['qunit/qunit.js'][178]++;
  config.stats.all += this.assertions.length;
  _$jscoverage['qunit/qunit.js'][179]++;
  config.moduleStats.all += this.assertions.length;
  _$jscoverage['qunit/qunit.js'][181]++;
  if (tests) {
    _$jscoverage['qunit/qunit.js'][182]++;
    ol = document.createElement("ol");
    _$jscoverage['qunit/qunit.js'][183]++;
    ol.className = "qunit-assert-list";
    _$jscoverage['qunit/qunit.js'][185]++;
    for (i = 0; i < this.assertions.length; i++) {
      _$jscoverage['qunit/qunit.js'][186]++;
      assertion = this.assertions[i];
      _$jscoverage['qunit/qunit.js'][188]++;
      li = document.createElement("li");
      _$jscoverage['qunit/qunit.js'][189]++;
      li.className = assertion.result ? "pass" : "fail";
      _$jscoverage['qunit/qunit.js'][190]++;
      li.innerHTML = assertion.message || (assertion.result ? "okay" : "failed");
      _$jscoverage['qunit/qunit.js'][191]++;
      ol.appendChild(li);
      _$jscoverage['qunit/qunit.js'][193]++;
      if (assertion.result) {
        _$jscoverage['qunit/qunit.js'][194]++;
        good++;
      } else {
        _$jscoverage['qunit/qunit.js'][196]++;
        bad++;
        _$jscoverage['qunit/qunit.js'][197]++;
        config.stats.bad++;
        _$jscoverage['qunit/qunit.js'][198]++;
        config.moduleStats.bad++;
      }
    }
    _$jscoverage['qunit/qunit.js'][203]++;
    if (QUnit.config.reorder && defined.sessionStorage) {
      _$jscoverage['qunit/qunit.js'][204]++;
      if (bad) {
        _$jscoverage['qunit/qunit.js'][205]++;
        sessionStorage.setItem("qunit-test-" + this.module + "-" + this.testName, bad);
      } else {
        _$jscoverage['qunit/qunit.js'][207]++;
        sessionStorage.removeItem("qunit-test-" + this.module + "-" + this.testName);
      }
    }
    _$jscoverage['qunit/qunit.js'][211]++;
    if (bad === 0) {
      _$jscoverage['qunit/qunit.js'][212]++;
      addClass(ol, "qunit-collapsed");
    }
    _$jscoverage['qunit/qunit.js'][216]++;
    b = document.createElement("strong");
    _$jscoverage['qunit/qunit.js'][217]++;
    b.innerHTML = this.name + " <b class='counts'>(<b class='failed'>" + bad + "</b>, <b class='passed'>" + good + "</b>, " + this.assertions.length + ")</b>";
    _$jscoverage['qunit/qunit.js'][219]++;
    addEvent(b, "click", function() {
  _$jscoverage['qunit/qunit.js'][220]++;
  var next = b.nextSibling.nextSibling, collapsed = hasClass(next, "qunit-collapsed");
  _$jscoverage['qunit/qunit.js'][222]++;
  (collapsed ? removeClass : addClass)(next, "qunit-collapsed");
});
    _$jscoverage['qunit/qunit.js'][225]++;
    addEvent(b, "dblclick", function(e) {
  _$jscoverage['qunit/qunit.js'][226]++;
  var target = e && e.target ? e.target : window.event.srcElement;
  _$jscoverage['qunit/qunit.js'][227]++;
  if (target.nodeName.toLowerCase() == "span" || target.nodeName.toLowerCase() == "b") {
    _$jscoverage['qunit/qunit.js'][228]++;
    target = target.parentNode;
  }
  _$jscoverage['qunit/qunit.js'][230]++;
  if (window.location && target.nodeName.toLowerCase() === "strong") {
    _$jscoverage['qunit/qunit.js'][231]++;
    window.location = QUnit.url({testNumber: test.testNumber});
  }
});
    _$jscoverage['qunit/qunit.js'][236]++;
    li = id(this.id);
    _$jscoverage['qunit/qunit.js'][237]++;
    li.className = bad ? "fail" : "pass";
    _$jscoverage['qunit/qunit.js'][238]++;
    li.removeChild(li.firstChild);
    _$jscoverage['qunit/qunit.js'][239]++;
    a = li.firstChild;
    _$jscoverage['qunit/qunit.js'][240]++;
    li.appendChild(b);
    _$jscoverage['qunit/qunit.js'][241]++;
    li.appendChild(a);
    _$jscoverage['qunit/qunit.js'][242]++;
    li.appendChild(ol);
  } else {
    _$jscoverage['qunit/qunit.js'][245]++;
    for (i = 0; i < this.assertions.length; i++) {
      _$jscoverage['qunit/qunit.js'][246]++;
      if (!this.assertions[i].result) {
        _$jscoverage['qunit/qunit.js'][247]++;
        bad++;
        _$jscoverage['qunit/qunit.js'][248]++;
        config.stats.bad++;
        _$jscoverage['qunit/qunit.js'][249]++;
        config.moduleStats.bad++;
      }
    }
  }
  _$jscoverage['qunit/qunit.js'][254]++;
  runLoggingCallbacks("testDone", QUnit, {name: this.testName, module: this.module, failed: bad, passed: this.assertions.length - bad, total: this.assertions.length});
  _$jscoverage['qunit/qunit.js'][262]++;
  QUnit.reset();
  _$jscoverage['qunit/qunit.js'][264]++;
  config.current = undefined;
}, queue: function() {
  _$jscoverage['qunit/qunit.js'][268]++;
  var bad, test = this;
  _$jscoverage['qunit/qunit.js'][271]++;
  synchronize(function() {
  _$jscoverage['qunit/qunit.js'][272]++;
  test.init();
});
  _$jscoverage['qunit/qunit.js'][274]++;
  function run() {
    _$jscoverage['qunit/qunit.js'][276]++;
    synchronize(function() {
  _$jscoverage['qunit/qunit.js'][277]++;
  test.setup();
});
    _$jscoverage['qunit/qunit.js'][279]++;
    synchronize(function() {
  _$jscoverage['qunit/qunit.js'][280]++;
  test.run();
});
    _$jscoverage['qunit/qunit.js'][282]++;
    synchronize(function() {
  _$jscoverage['qunit/qunit.js'][283]++;
  test.teardown();
});
    _$jscoverage['qunit/qunit.js'][285]++;
    synchronize(function() {
  _$jscoverage['qunit/qunit.js'][286]++;
  test.finish();
});
  }
  _$jscoverage['qunit/qunit.js'][292]++;
  bad = QUnit.config.reorder && defined.sessionStorage && +sessionStorage.getItem("qunit-test-" + this.module + "-" + this.testName);
  _$jscoverage['qunit/qunit.js'][295]++;
  if (bad) {
    _$jscoverage['qunit/qunit.js'][296]++;
    run();
  } else {
    _$jscoverage['qunit/qunit.js'][298]++;
    synchronize(run, true);
  }
}};
  _$jscoverage['qunit/qunit.js'][305]++;
  QUnit = {module: function(name, testEnvironment) {
  _$jscoverage['qunit/qunit.js'][309]++;
  config.currentModule = name;
  _$jscoverage['qunit/qunit.js'][310]++;
  config.currentModuleTestEnvironment = testEnvironment;
  _$jscoverage['qunit/qunit.js'][311]++;
  config.modules[name] = true;
}, asyncTest: function(testName, expected, callback) {
  _$jscoverage['qunit/qunit.js'][315]++;
  if (arguments.length === 2) {
    _$jscoverage['qunit/qunit.js'][316]++;
    callback = expected;
    _$jscoverage['qunit/qunit.js'][317]++;
    expected = null;
  }
  _$jscoverage['qunit/qunit.js'][320]++;
  QUnit.test(testName, expected, callback, true);
}, test: function(testName, expected, callback, async) {
  _$jscoverage['qunit/qunit.js'][324]++;
  var test, name = "<span class='test-name'>" + escapeInnerText(testName) + "</span>";
  _$jscoverage['qunit/qunit.js'][327]++;
  if (arguments.length === 2) {
    _$jscoverage['qunit/qunit.js'][328]++;
    callback = expected;
    _$jscoverage['qunit/qunit.js'][329]++;
    expected = null;
  }
  _$jscoverage['qunit/qunit.js'][332]++;
  if (config.currentModule) {
    _$jscoverage['qunit/qunit.js'][333]++;
    name = "<span class='module-name'>" + config.currentModule + "</span>: " + name;
  }
  _$jscoverage['qunit/qunit.js'][336]++;
  test = new Test({name: name, testName: testName, expected: expected, async: async, callback: callback, module: config.currentModule, moduleTestEnvironment: config.currentModuleTestEnvironment, stack: sourceFromStacktrace(2)});
  _$jscoverage['qunit/qunit.js'][347]++;
  if (!validTest(test)) {
    _$jscoverage['qunit/qunit.js'][348]++;
    return;
  }
  _$jscoverage['qunit/qunit.js'][351]++;
  test.queue();
}, expect: function(asserts) {
  _$jscoverage['qunit/qunit.js'][356]++;
  if (arguments.length === 1) {
    _$jscoverage['qunit/qunit.js'][357]++;
    config.current.expected = asserts;
  } else {
    _$jscoverage['qunit/qunit.js'][359]++;
    return config.current.expected;
  }
}, start: function(count) {
  _$jscoverage['qunit/qunit.js'][364]++;
  config.semaphore -= count || 1;
  _$jscoverage['qunit/qunit.js'][366]++;
  if (config.semaphore > 0) {
    _$jscoverage['qunit/qunit.js'][367]++;
    return;
  }
  _$jscoverage['qunit/qunit.js'][370]++;
  if (config.semaphore < 0) {
    _$jscoverage['qunit/qunit.js'][371]++;
    config.semaphore = 0;
    _$jscoverage['qunit/qunit.js'][372]++;
    QUnit.pushFailure("Called start() while already started (QUnit.config.semaphore was 0 already)", null, sourceFromStacktrace(2));
    _$jscoverage['qunit/qunit.js'][373]++;
    return;
  }
  _$jscoverage['qunit/qunit.js'][376]++;
  if (defined.setTimeout) {
    _$jscoverage['qunit/qunit.js'][377]++;
    window.setTimeout(function() {
  _$jscoverage['qunit/qunit.js'][378]++;
  if (config.semaphore > 0) {
    _$jscoverage['qunit/qunit.js'][379]++;
    return;
  }
  _$jscoverage['qunit/qunit.js'][381]++;
  if (config.timeout) {
    _$jscoverage['qunit/qunit.js'][382]++;
    clearTimeout(config.timeout);
  }
  _$jscoverage['qunit/qunit.js'][385]++;
  config.blocking = false;
  _$jscoverage['qunit/qunit.js'][386]++;
  process(true);
}, 13);
  } else {
    _$jscoverage['qunit/qunit.js'][389]++;
    config.blocking = false;
    _$jscoverage['qunit/qunit.js'][390]++;
    process(true);
  }
}, stop: function(count) {
  _$jscoverage['qunit/qunit.js'][395]++;
  config.semaphore += count || 1;
  _$jscoverage['qunit/qunit.js'][396]++;
  config.blocking = true;
  _$jscoverage['qunit/qunit.js'][398]++;
  if (config.testTimeout && defined.setTimeout) {
    _$jscoverage['qunit/qunit.js'][399]++;
    clearTimeout(config.timeout);
    _$jscoverage['qunit/qunit.js'][400]++;
    config.timeout = window.setTimeout(function() {
  _$jscoverage['qunit/qunit.js'][401]++;
  QUnit.ok(false, "Test timed out");
  _$jscoverage['qunit/qunit.js'][402]++;
  config.semaphore = 1;
  _$jscoverage['qunit/qunit.js'][403]++;
  QUnit.start();
}, config.testTimeout);
  }
}};
  _$jscoverage['qunit/qunit.js'][413]++;
  QUnit.assert = {ok: function(result, msg) {
  _$jscoverage['qunit/qunit.js'][421]++;
  if (!config.current) {
    _$jscoverage['qunit/qunit.js'][422]++;
    throw new Error("ok() assertion outside test context, was " + sourceFromStacktrace(2));
  }
  _$jscoverage['qunit/qunit.js'][424]++;
  result = !!result;
  _$jscoverage['qunit/qunit.js'][426]++;
  var source, details = {module: config.current.module, name: config.current.testName, result: result, message: msg};
  _$jscoverage['qunit/qunit.js'][434]++;
  msg = escapeInnerText(msg || (result ? "okay" : "failed"));
  _$jscoverage['qunit/qunit.js'][435]++;
  msg = "<span class='test-message'>" + msg + "</span>";
  _$jscoverage['qunit/qunit.js'][437]++;
  if (!result) {
    _$jscoverage['qunit/qunit.js'][438]++;
    source = sourceFromStacktrace(2);
    _$jscoverage['qunit/qunit.js'][439]++;
    if (source) {
      _$jscoverage['qunit/qunit.js'][440]++;
      details.source = source;
      _$jscoverage['qunit/qunit.js'][441]++;
      msg += "<table><tr class='test-source'><th>Source: </th><td><pre>" + escapeInnerText(source) + "</pre></td></tr></table>";
    }
  }
  _$jscoverage['qunit/qunit.js'][444]++;
  runLoggingCallbacks("log", QUnit, details);
  _$jscoverage['qunit/qunit.js'][445]++;
  config.current.assertions.push({result: result, message: msg});
}, equal: function(actual, expected, message) {
  _$jscoverage['qunit/qunit.js'][459]++;
  QUnit.push(expected == actual, actual, expected, message);
}, notEqual: function(actual, expected, message) {
  _$jscoverage['qunit/qunit.js'][467]++;
  QUnit.push(expected != actual, actual, expected, message);
}, deepEqual: function(actual, expected, message) {
  _$jscoverage['qunit/qunit.js'][475]++;
  QUnit.push(QUnit.equiv(actual, expected), actual, expected, message);
}, notDeepEqual: function(actual, expected, message) {
  _$jscoverage['qunit/qunit.js'][483]++;
  QUnit.push(!QUnit.equiv(actual, expected), actual, expected, message);
}, strictEqual: function(actual, expected, message) {
  _$jscoverage['qunit/qunit.js'][491]++;
  QUnit.push(expected === actual, actual, expected, message);
}, notStrictEqual: function(actual, expected, message) {
  _$jscoverage['qunit/qunit.js'][499]++;
  QUnit.push(expected !== actual, actual, expected, message);
}, "throws": function(block, expected, message) {
  _$jscoverage['qunit/qunit.js'][503]++;
  var actual, expectedOutput = expected, ok = false;
  _$jscoverage['qunit/qunit.js'][508]++;
  if (typeof expected === "string") {
    _$jscoverage['qunit/qunit.js'][509]++;
    message = expected;
    _$jscoverage['qunit/qunit.js'][510]++;
    expected = null;
  }
  _$jscoverage['qunit/qunit.js'][513]++;
  config.current.ignoreGlobalErrors = true;
  _$jscoverage['qunit/qunit.js'][514]++;
  try {
    _$jscoverage['qunit/qunit.js'][515]++;
    block.call(config.current.testEnvironment);
  }  catch (e) {
  _$jscoverage['qunit/qunit.js'][517]++;
  actual = e;
}
  _$jscoverage['qunit/qunit.js'][519]++;
  config.current.ignoreGlobalErrors = false;
  _$jscoverage['qunit/qunit.js'][521]++;
  if (actual) {
    _$jscoverage['qunit/qunit.js'][523]++;
    if (!expected) {
      _$jscoverage['qunit/qunit.js'][524]++;
      ok = true;
      _$jscoverage['qunit/qunit.js'][525]++;
      expectedOutput = null;
    } else {
      _$jscoverage['qunit/qunit.js'][527]++;
      if (QUnit.objectType(expected) === "regexp") {
        _$jscoverage['qunit/qunit.js'][528]++;
        ok = expected.test(actual);
      } else {
        _$jscoverage['qunit/qunit.js'][530]++;
        if (actual instanceof expected) {
          _$jscoverage['qunit/qunit.js'][531]++;
          ok = true;
        } else {
          _$jscoverage['qunit/qunit.js'][533]++;
          if (expected.call({}, actual) === true) {
            _$jscoverage['qunit/qunit.js'][534]++;
            expectedOutput = null;
            _$jscoverage['qunit/qunit.js'][535]++;
            ok = true;
          }
        }
      }
    }
    _$jscoverage['qunit/qunit.js'][538]++;
    QUnit.push(ok, actual, expectedOutput, message);
  } else {
    _$jscoverage['qunit/qunit.js'][540]++;
    QUnit.pushFailure(message, null, 'No exception was thrown.');
  }
}};
  _$jscoverage['qunit/qunit.js'][549]++;
  extend(QUnit, QUnit.assert);
  _$jscoverage['qunit/qunit.js'][555]++;
  QUnit.raises = QUnit.assert["throws"];
  _$jscoverage['qunit/qunit.js'][561]++;
  QUnit.equals = function() {
  _$jscoverage['qunit/qunit.js'][562]++;
  QUnit.push(false, false, false, "QUnit.equals has been deprecated since 2009 (e88049a0), use QUnit.equal instead");
};
  _$jscoverage['qunit/qunit.js'][564]++;
  QUnit.same = function() {
  _$jscoverage['qunit/qunit.js'][565]++;
  QUnit.push(false, false, false, "QUnit.same has been deprecated since 2009 (e88049a0), use QUnit.deepEqual instead");
};
  _$jscoverage['qunit/qunit.js'][569]++;
  (function() {
  _$jscoverage['qunit/qunit.js'][570]++;
  function F() {
  }
  _$jscoverage['qunit/qunit.js'][571]++;
  F.prototype = QUnit;
  _$jscoverage['qunit/qunit.js'][572]++;
  QUnit = new F();
  _$jscoverage['qunit/qunit.js'][574]++;
  QUnit.constructor = F;
}());
  _$jscoverage['qunit/qunit.js'][582]++;
  config = {queue: [], blocking: true, hidepassed: false, reorder: true, altertitle: true, requireExpects: false, urlConfig: [{id: "noglobals", label: "Check for Globals", tooltip: "Enabling this will test if any test introduces new properties on the `window` object. Stored as query-strings."}, {id: "notrycatch", label: "No try-catch", tooltip: "Enabling this will run tests outside of a try-catch block. Makes debugging exceptions in IE reasonable. Stored as query-strings."}], modules: {}, begin: [], done: [], log: [], testStart: [], testDone: [], moduleStart: [], moduleDone: []};
  _$jscoverage['qunit/qunit.js'][632]++;
  (function() {
  _$jscoverage['qunit/qunit.js'][633]++;
  var i, location = window.location || {search: "", protocol: "file:"}, params = location.search.slice(1).split("&"), length = params.length, urlParams = {}, current;
  _$jscoverage['qunit/qunit.js'][640]++;
  if (params[0]) {
    _$jscoverage['qunit/qunit.js'][641]++;
    for (i = 0; i < length; i++) {
      _$jscoverage['qunit/qunit.js'][642]++;
      current = params[i].split("=");
      _$jscoverage['qunit/qunit.js'][643]++;
      current[0] = decodeURIComponent(current[0]);
      _$jscoverage['qunit/qunit.js'][645]++;
      current[1] = current[1] ? decodeURIComponent(current[1]) : true;
      _$jscoverage['qunit/qunit.js'][646]++;
      urlParams[current[0]] = current[1];
    }
  }
  _$jscoverage['qunit/qunit.js'][650]++;
  QUnit.urlParams = urlParams;
  _$jscoverage['qunit/qunit.js'][653]++;
  config.filter = urlParams.filter;
  _$jscoverage['qunit/qunit.js'][656]++;
  config.module = urlParams.module;
  _$jscoverage['qunit/qunit.js'][658]++;
  config.testNumber = parseInt(urlParams.testNumber, 10) || null;
  _$jscoverage['qunit/qunit.js'][661]++;
  QUnit.isLocal = location.protocol === "file:";
}());
  _$jscoverage['qunit/qunit.js'][666]++;
  if (typeof exports === "undefined") {
    _$jscoverage['qunit/qunit.js'][667]++;
    extend(window, QUnit);
    _$jscoverage['qunit/qunit.js'][670]++;
    window.QUnit = QUnit;
  }
  _$jscoverage['qunit/qunit.js'][675]++;
  extend(QUnit, {config: config, init: function() {
  _$jscoverage['qunit/qunit.js'][680]++;
  extend(config, {stats: {all: 0, bad: 0}, moduleStats: {all: 0, bad: 0}, started: +new Date(), updateRate: 1000, blocking: false, autostart: true, autorun: false, filter: "", queue: [], semaphore: 1});
  _$jscoverage['qunit/qunit.js'][693]++;
  var tests, banner, result, qunit = id("qunit");
  _$jscoverage['qunit/qunit.js'][696]++;
  if (qunit) {
    _$jscoverage['qunit/qunit.js'][697]++;
    qunit.innerHTML = "<h1 id='qunit-header'>" + escapeInnerText(document.title) + "</h1>" + "<h2 id='qunit-banner'></h2>" + "<div id='qunit-testrunner-toolbar'></div>" + "<h2 id='qunit-userAgent'></h2>" + "<ol id='qunit-tests'></ol>";
  }
  _$jscoverage['qunit/qunit.js'][705]++;
  tests = id("qunit-tests");
  _$jscoverage['qunit/qunit.js'][706]++;
  banner = id("qunit-banner");
  _$jscoverage['qunit/qunit.js'][707]++;
  result = id("qunit-testresult");
  _$jscoverage['qunit/qunit.js'][709]++;
  if (tests) {
    _$jscoverage['qunit/qunit.js'][710]++;
    tests.innerHTML = "";
  }
  _$jscoverage['qunit/qunit.js'][713]++;
  if (banner) {
    _$jscoverage['qunit/qunit.js'][714]++;
    banner.className = "";
  }
  _$jscoverage['qunit/qunit.js'][717]++;
  if (result) {
    _$jscoverage['qunit/qunit.js'][718]++;
    result.parentNode.removeChild(result);
  }
  _$jscoverage['qunit/qunit.js'][721]++;
  if (tests) {
    _$jscoverage['qunit/qunit.js'][722]++;
    result = document.createElement("p");
    _$jscoverage['qunit/qunit.js'][723]++;
    result.id = "qunit-testresult";
    _$jscoverage['qunit/qunit.js'][724]++;
    result.className = "result";
    _$jscoverage['qunit/qunit.js'][725]++;
    tests.parentNode.insertBefore(result, tests);
    _$jscoverage['qunit/qunit.js'][726]++;
    result.innerHTML = "Running...<br/>&nbsp;";
  }
}, reset: function() {
  _$jscoverage['qunit/qunit.js'][732]++;
  var fixture = id("qunit-fixture");
  _$jscoverage['qunit/qunit.js'][733]++;
  if (fixture) {
    _$jscoverage['qunit/qunit.js'][734]++;
    fixture.innerHTML = config.fixture;
  }
}, triggerEvent: function(elem, type, event) {
  _$jscoverage['qunit/qunit.js'][741]++;
  if (document.createEvent) {
    _$jscoverage['qunit/qunit.js'][742]++;
    event = document.createEvent("MouseEvents");
    _$jscoverage['qunit/qunit.js'][743]++;
    event.initMouseEvent(type, true, true, elem.ownerDocument.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    _$jscoverage['qunit/qunit.js'][746]++;
    elem.dispatchEvent(event);
  } else {
    _$jscoverage['qunit/qunit.js'][747]++;
    if (elem.fireEvent) {
      _$jscoverage['qunit/qunit.js'][748]++;
      elem.fireEvent("on" + type);
    }
  }
}, is: function(type, obj) {
  _$jscoverage['qunit/qunit.js'][754]++;
  return QUnit.objectType(obj) == type;
}, objectType: function(obj) {
  _$jscoverage['qunit/qunit.js'][758]++;
  if (typeof obj === "undefined") {
    _$jscoverage['qunit/qunit.js'][759]++;
    return "undefined";
  }
  _$jscoverage['qunit/qunit.js'][762]++;
  if (obj === null) {
    _$jscoverage['qunit/qunit.js'][763]++;
    return "null";
  }
  _$jscoverage['qunit/qunit.js'][766]++;
  var match = toString.call(obj).match(/^\[object\s(.*)\]$/), type = match && match[1] || "";
  _$jscoverage['qunit/qunit.js'][769]++;
  switch (type) {
    case "Number":
      _$jscoverage['qunit/qunit.js'][771]++;
      if (isNaN(obj)) {
        _$jscoverage['qunit/qunit.js'][772]++;
        return "nan";
      }
      _$jscoverage['qunit/qunit.js'][774]++;
      return "number";
    case "String":
    case "Boolean":
    case "Array":
    case "Date":
    case "RegExp":
    case "Function":
      _$jscoverage['qunit/qunit.js'][781]++;
      return type.toLowerCase();
  }
  _$jscoverage['qunit/qunit.js'][783]++;
  if (typeof obj === "object") {
    _$jscoverage['qunit/qunit.js'][784]++;
    return "object";
  }
  _$jscoverage['qunit/qunit.js'][786]++;
  return undefined;
}, push: function(result, actual, expected, message) {
  _$jscoverage['qunit/qunit.js'][790]++;
  if (!config.current) {
    _$jscoverage['qunit/qunit.js'][791]++;
    throw new Error("assertion outside test context, was " + sourceFromStacktrace());
  }
  _$jscoverage['qunit/qunit.js'][794]++;
  var output, source, details = {module: config.current.module, name: config.current.testName, result: result, message: message, actual: actual, expected: expected};
  _$jscoverage['qunit/qunit.js'][804]++;
  message = escapeInnerText(message) || (result ? "okay" : "failed");
  _$jscoverage['qunit/qunit.js'][805]++;
  message = "<span class='test-message'>" + message + "</span>";
  _$jscoverage['qunit/qunit.js'][806]++;
  output = message;
  _$jscoverage['qunit/qunit.js'][808]++;
  if (!result) {
    _$jscoverage['qunit/qunit.js'][809]++;
    expected = escapeInnerText(QUnit.jsDump.parse(expected));
    _$jscoverage['qunit/qunit.js'][810]++;
    actual = escapeInnerText(QUnit.jsDump.parse(actual));
    _$jscoverage['qunit/qunit.js'][811]++;
    output += "<table><tr class='test-expected'><th>Expected: </th><td><pre>" + expected + "</pre></td></tr>";
    _$jscoverage['qunit/qunit.js'][813]++;
    if (actual != expected) {
      _$jscoverage['qunit/qunit.js'][814]++;
      output += "<tr class='test-actual'><th>Result: </th><td><pre>" + actual + "</pre></td></tr>";
      _$jscoverage['qunit/qunit.js'][815]++;
      output += "<tr class='test-diff'><th>Diff: </th><td><pre>" + QUnit.diff(expected, actual) + "</pre></td></tr>";
    }
    _$jscoverage['qunit/qunit.js'][818]++;
    source = sourceFromStacktrace();
    _$jscoverage['qunit/qunit.js'][820]++;
    if (source) {
      _$jscoverage['qunit/qunit.js'][821]++;
      details.source = source;
      _$jscoverage['qunit/qunit.js'][822]++;
      output += "<tr class='test-source'><th>Source: </th><td><pre>" + escapeInnerText(source) + "</pre></td></tr>";
    }
    _$jscoverage['qunit/qunit.js'][825]++;
    output += "</table>";
  }
  _$jscoverage['qunit/qunit.js'][828]++;
  runLoggingCallbacks("log", QUnit, details);
  _$jscoverage['qunit/qunit.js'][830]++;
  config.current.assertions.push({result: !!result, message: output});
}, pushFailure: function(message, source, actual) {
  _$jscoverage['qunit/qunit.js'][837]++;
  if (!config.current) {
    _$jscoverage['qunit/qunit.js'][838]++;
    throw new Error("pushFailure() assertion outside test context, was " + sourceFromStacktrace(2));
  }
  _$jscoverage['qunit/qunit.js'][841]++;
  var output, details = {module: config.current.module, name: config.current.testName, result: false, message: message};
  _$jscoverage['qunit/qunit.js'][849]++;
  message = escapeInnerText(message) || "error";
  _$jscoverage['qunit/qunit.js'][850]++;
  message = "<span class='test-message'>" + message + "</span>";
  _$jscoverage['qunit/qunit.js'][851]++;
  output = message;
  _$jscoverage['qunit/qunit.js'][853]++;
  output += "<table>";
  _$jscoverage['qunit/qunit.js'][855]++;
  if (actual) {
    _$jscoverage['qunit/qunit.js'][856]++;
    output += "<tr class='test-actual'><th>Result: </th><td><pre>" + escapeInnerText(actual) + "</pre></td></tr>";
  }
  _$jscoverage['qunit/qunit.js'][859]++;
  if (source) {
    _$jscoverage['qunit/qunit.js'][860]++;
    details.source = source;
    _$jscoverage['qunit/qunit.js'][861]++;
    output += "<tr class='test-source'><th>Source: </th><td><pre>" + escapeInnerText(source) + "</pre></td></tr>";
  }
  _$jscoverage['qunit/qunit.js'][864]++;
  output += "</table>";
  _$jscoverage['qunit/qunit.js'][866]++;
  runLoggingCallbacks("log", QUnit, details);
  _$jscoverage['qunit/qunit.js'][868]++;
  config.current.assertions.push({result: false, message: output});
}, url: function(params) {
  _$jscoverage['qunit/qunit.js'][875]++;
  params = extend(extend({}, QUnit.urlParams), params);
  _$jscoverage['qunit/qunit.js'][876]++;
  var key, querystring = "?";
  _$jscoverage['qunit/qunit.js'][879]++;
  for (key in params) {
    _$jscoverage['qunit/qunit.js'][880]++;
    if (!hasOwn.call(params, key)) {
      _$jscoverage['qunit/qunit.js'][881]++;
      continue;
    }
    _$jscoverage['qunit/qunit.js'][883]++;
    querystring += encodeURIComponent(key) + "=" + encodeURIComponent(params[key]) + "&";
  }
  _$jscoverage['qunit/qunit.js'][886]++;
  return window.location.pathname + querystring.slice(0, -1);
}, extend: extend, id: id, addEvent: addEvent});
  _$jscoverage['qunit/qunit.js'][902]++;
  extend(QUnit.constructor.prototype, {begin: registerLoggingCallback("begin"), done: registerLoggingCallback("done"), log: registerLoggingCallback("log"), testStart: registerLoggingCallback("testStart"), testDone: registerLoggingCallback("testDone"), moduleStart: registerLoggingCallback("moduleStart"), moduleDone: registerLoggingCallback("moduleDone")});
  _$jscoverage['qunit/qunit.js'][927]++;
  if (typeof document === "undefined" || document.readyState === "complete") {
    _$jscoverage['qunit/qunit.js'][928]++;
    config.autorun = true;
  }
  _$jscoverage['qunit/qunit.js'][931]++;
  QUnit.load = function() {
  _$jscoverage['qunit/qunit.js'][932]++;
  runLoggingCallbacks("begin", QUnit, {});
  _$jscoverage['qunit/qunit.js'][935]++;
  var banner, filter, i, label, len, main, ol, toolbar, userAgent, val, urlConfigCheckboxes, moduleFilter, numModules = 0, moduleFilterHtml = "", urlConfigHtml = "", oldconfig = extend({}, config);
  _$jscoverage['qunit/qunit.js'][941]++;
  QUnit.init();
  _$jscoverage['qunit/qunit.js'][942]++;
  extend(config, oldconfig);
  _$jscoverage['qunit/qunit.js'][944]++;
  config.blocking = false;
  _$jscoverage['qunit/qunit.js'][946]++;
  len = config.urlConfig.length;
  _$jscoverage['qunit/qunit.js'][948]++;
  for (i = 0; i < len; i++) {
    _$jscoverage['qunit/qunit.js'][949]++;
    val = config.urlConfig[i];
    _$jscoverage['qunit/qunit.js'][950]++;
    if (typeof val === "string") {
      _$jscoverage['qunit/qunit.js'][951]++;
      val = {id: val, label: val, tooltip: "[no tooltip available]"};
    }
    _$jscoverage['qunit/qunit.js'][957]++;
    config[val.id] = QUnit.urlParams[val.id];
    _$jscoverage['qunit/qunit.js'][958]++;
    urlConfigHtml += "<input id='qunit-urlconfig-" + val.id + "' name='" + val.id + "' type='checkbox'" + (config[val.id] ? " checked='checked'" : "") + " title='" + val.tooltip + "'><label for='qunit-urlconfig-" + val.id + "' title='" + val.tooltip + "'>" + val.label + "</label>";
  }
  _$jscoverage['qunit/qunit.js'][961]++;
  moduleFilterHtml += "<label for='qunit-modulefilter'>Module: </label><select id='qunit-modulefilter' name='modulefilter'><option value='' " + (config.module === undefined ? "selected" : "") + ">< All Modules ></option>";
  _$jscoverage['qunit/qunit.js'][962]++;
  for (i in config.modules) {
    _$jscoverage['qunit/qunit.js'][963]++;
    if (config.modules.hasOwnProperty(i)) {
      _$jscoverage['qunit/qunit.js'][964]++;
      numModules += 1;
      _$jscoverage['qunit/qunit.js'][965]++;
      moduleFilterHtml += "<option value='" + encodeURIComponent(i) + "' " + (config.module === i ? "selected" : "") + ">" + i + "</option>";
    }
  }
  _$jscoverage['qunit/qunit.js'][968]++;
  moduleFilterHtml += "</select>";
  _$jscoverage['qunit/qunit.js'][971]++;
  userAgent = id("qunit-userAgent");
  _$jscoverage['qunit/qunit.js'][972]++;
  if (userAgent) {
    _$jscoverage['qunit/qunit.js'][973]++;
    userAgent.innerHTML = navigator.userAgent;
  }
  _$jscoverage['qunit/qunit.js'][977]++;
  banner = id("qunit-header");
  _$jscoverage['qunit/qunit.js'][978]++;
  if (banner) {
    _$jscoverage['qunit/qunit.js'][979]++;
    banner.innerHTML = "<a href='" + QUnit.url({filter: undefined, module: undefined, testNumber: undefined}) + "'>" + banner.innerHTML + "</a> ";
  }
  _$jscoverage['qunit/qunit.js'][983]++;
  toolbar = id("qunit-testrunner-toolbar");
  _$jscoverage['qunit/qunit.js'][984]++;
  if (toolbar) {
    _$jscoverage['qunit/qunit.js'][986]++;
    filter = document.createElement("input");
    _$jscoverage['qunit/qunit.js'][987]++;
    filter.type = "checkbox";
    _$jscoverage['qunit/qunit.js'][988]++;
    filter.id = "qunit-filter-pass";
    _$jscoverage['qunit/qunit.js'][990]++;
    addEvent(filter, "click", function() {
  _$jscoverage['qunit/qunit.js'][991]++;
  var tmp, ol = document.getElementById("qunit-tests");
  _$jscoverage['qunit/qunit.js'][994]++;
  if (filter.checked) {
    _$jscoverage['qunit/qunit.js'][995]++;
    ol.className = ol.className + " hidepass";
  } else {
    _$jscoverage['qunit/qunit.js'][997]++;
    tmp = " " + ol.className.replace(/[\n\t\r]/g, " ") + " ";
    _$jscoverage['qunit/qunit.js'][998]++;
    ol.className = tmp.replace(/ hidepass /, " ");
  }
  _$jscoverage['qunit/qunit.js'][1000]++;
  if (defined.sessionStorage) {
    _$jscoverage['qunit/qunit.js'][1001]++;
    if (filter.checked) {
      _$jscoverage['qunit/qunit.js'][1002]++;
      sessionStorage.setItem("qunit-filter-passed-tests", "true");
    } else {
      _$jscoverage['qunit/qunit.js'][1004]++;
      sessionStorage.removeItem("qunit-filter-passed-tests");
    }
  }
});
    _$jscoverage['qunit/qunit.js'][1009]++;
    if (config.hidepassed || defined.sessionStorage && sessionStorage.getItem("qunit-filter-passed-tests")) {
      _$jscoverage['qunit/qunit.js'][1010]++;
      filter.checked = true;
      _$jscoverage['qunit/qunit.js'][1012]++;
      ol = document.getElementById("qunit-tests");
      _$jscoverage['qunit/qunit.js'][1013]++;
      ol.className = ol.className + " hidepass";
    }
    _$jscoverage['qunit/qunit.js'][1015]++;
    toolbar.appendChild(filter);
    _$jscoverage['qunit/qunit.js'][1018]++;
    label = document.createElement("label");
    _$jscoverage['qunit/qunit.js'][1019]++;
    label.setAttribute("for", "qunit-filter-pass");
    _$jscoverage['qunit/qunit.js'][1020]++;
    label.setAttribute("title", "Only show tests and assertons that fail. Stored in sessionStorage.");
    _$jscoverage['qunit/qunit.js'][1021]++;
    label.innerHTML = "Hide passed tests";
    _$jscoverage['qunit/qunit.js'][1022]++;
    toolbar.appendChild(label);
    _$jscoverage['qunit/qunit.js'][1024]++;
    urlConfigCheckboxes = document.createElement('span');
    _$jscoverage['qunit/qunit.js'][1025]++;
    urlConfigCheckboxes.innerHTML = urlConfigHtml;
    _$jscoverage['qunit/qunit.js'][1026]++;
    addEvent(urlConfigCheckboxes, "change", function(event) {
  _$jscoverage['qunit/qunit.js'][1027]++;
  var params = {};
  _$jscoverage['qunit/qunit.js'][1028]++;
  params[event.target.name] = event.target.checked ? true : undefined;
  _$jscoverage['qunit/qunit.js'][1029]++;
  window.location = QUnit.url(params);
});
    _$jscoverage['qunit/qunit.js'][1031]++;
    toolbar.appendChild(urlConfigCheckboxes);
    _$jscoverage['qunit/qunit.js'][1033]++;
    if (numModules > 1) {
      _$jscoverage['qunit/qunit.js'][1034]++;
      moduleFilter = document.createElement('span');
      _$jscoverage['qunit/qunit.js'][1035]++;
      moduleFilter.setAttribute('id', 'qunit-modulefilter-container');
      _$jscoverage['qunit/qunit.js'][1036]++;
      moduleFilter.innerHTML = moduleFilterHtml;
      _$jscoverage['qunit/qunit.js'][1037]++;
      addEvent(moduleFilter, "change", function() {
  _$jscoverage['qunit/qunit.js'][1038]++;
  var selectBox = moduleFilter.getElementsByTagName("select")[0], selectedModule = decodeURIComponent(selectBox.options[selectBox.selectedIndex].value);
  _$jscoverage['qunit/qunit.js'][1041]++;
  window.location = QUnit.url({module: (selectedModule === "") ? undefined : selectedModule});
});
      _$jscoverage['qunit/qunit.js'][1043]++;
      toolbar.appendChild(moduleFilter);
    }
  }
  _$jscoverage['qunit/qunit.js'][1048]++;
  main = id("qunit-fixture");
  _$jscoverage['qunit/qunit.js'][1049]++;
  if (main) {
    _$jscoverage['qunit/qunit.js'][1050]++;
    config.fixture = main.innerHTML;
  }
  _$jscoverage['qunit/qunit.js'][1053]++;
  if (config.autostart) {
    _$jscoverage['qunit/qunit.js'][1054]++;
    QUnit.start();
  }
};
  _$jscoverage['qunit/qunit.js'][1058]++;
  addEvent(window, "load", QUnit.load);
  _$jscoverage['qunit/qunit.js'][1062]++;
  onErrorFnPrev = window.onerror;
  _$jscoverage['qunit/qunit.js'][1067]++;
  window.onerror = function(error, filePath, linerNr) {
  _$jscoverage['qunit/qunit.js'][1068]++;
  var ret = false;
  _$jscoverage['qunit/qunit.js'][1069]++;
  if (onErrorFnPrev) {
    _$jscoverage['qunit/qunit.js'][1070]++;
    ret = onErrorFnPrev(error, filePath, linerNr);
  }
  _$jscoverage['qunit/qunit.js'][1075]++;
  if (ret !== true) {
    _$jscoverage['qunit/qunit.js'][1076]++;
    if (QUnit.config.current) {
      _$jscoverage['qunit/qunit.js'][1077]++;
      if (QUnit.config.current.ignoreGlobalErrors) {
        _$jscoverage['qunit/qunit.js'][1078]++;
        return true;
      }
      _$jscoverage['qunit/qunit.js'][1080]++;
      QUnit.pushFailure(error, filePath + ":" + linerNr);
    } else {
      _$jscoverage['qunit/qunit.js'][1082]++;
      QUnit.test("global failure", extend(function() {
  _$jscoverage['qunit/qunit.js'][1083]++;
  QUnit.pushFailure(error, filePath + ":" + linerNr);
}, {validTest: validTest}));
    }
    _$jscoverage['qunit/qunit.js'][1086]++;
    return false;
  }
  _$jscoverage['qunit/qunit.js'][1089]++;
  return ret;
};
  _$jscoverage['qunit/qunit.js'][1092]++;
  function done() {
    _$jscoverage['qunit/qunit.js'][1093]++;
    config.autorun = true;
    _$jscoverage['qunit/qunit.js'][1096]++;
    if (config.currentModule) {
      _$jscoverage['qunit/qunit.js'][1097]++;
      runLoggingCallbacks("moduleDone", QUnit, {name: config.currentModule, failed: config.moduleStats.bad, passed: config.moduleStats.all - config.moduleStats.bad, total: config.moduleStats.all});
    }
    _$jscoverage['qunit/qunit.js'][1105]++;
    var i, key, banner = id("qunit-banner"), tests = id("qunit-tests"), runtime = +new Date() - config.started, passed = config.stats.all - config.stats.bad, html = ["Tests completed in ", runtime, " milliseconds.<br/>", "<span class='passed'>", passed, "</span> tests of <span class='total'>", config.stats.all, "</span> passed, <span class='failed'>", config.stats.bad, "</span> failed."].join("");
    _$jscoverage['qunit/qunit.js'][1123]++;
    if (banner) {
      _$jscoverage['qunit/qunit.js'][1124]++;
      banner.className = (config.stats.bad ? "qunit-fail" : "qunit-pass");
    }
    _$jscoverage['qunit/qunit.js'][1127]++;
    if (tests) {
      _$jscoverage['qunit/qunit.js'][1128]++;
      id("qunit-testresult").innerHTML = html;
    }
    _$jscoverage['qunit/qunit.js'][1131]++;
    if (config.altertitle && typeof document !== "undefined" && document.title) {
      _$jscoverage['qunit/qunit.js'][1134]++;
      document.title = [(config.stats.bad ? "\u2716" : "\u2714"), document.title.replace(/^[\u2714\u2716] /i, "")].join(" ");
    }
    _$jscoverage['qunit/qunit.js'][1141]++;
    if (config.reorder && defined.sessionStorage && config.stats.bad === 0) {
      _$jscoverage['qunit/qunit.js'][1143]++;
      for (i = 0; i < sessionStorage.length; i++) {
        _$jscoverage['qunit/qunit.js'][1144]++;
        key = sessionStorage.key(i++);
        _$jscoverage['qunit/qunit.js'][1145]++;
        if (key.indexOf("qunit-test-") === 0) {
          _$jscoverage['qunit/qunit.js'][1146]++;
          sessionStorage.removeItem(key);
        }
      }
    }
    _$jscoverage['qunit/qunit.js'][1152]++;
    if (window.scrollTo) {
      _$jscoverage['qunit/qunit.js'][1153]++;
      window.scrollTo(0, 0);
    }
    _$jscoverage['qunit/qunit.js'][1156]++;
    runLoggingCallbacks("done", QUnit, {failed: config.stats.bad, passed: passed, total: config.stats.all, runtime: runtime});
  }
  _$jscoverage['qunit/qunit.js'][1165]++;
  function validTest(test) {
    _$jscoverage['qunit/qunit.js'][1166]++;
    var include, filter = config.filter && config.filter.toLowerCase(), module = config.module && config.module.toLowerCase(), fullName = (test.module + ": " + test.testName).toLowerCase();
    _$jscoverage['qunit/qunit.js'][1172]++;
    if (test.callback && test.callback.validTest === validTest) {
      _$jscoverage['qunit/qunit.js'][1173]++;
      delete test.callback.validTest;
      _$jscoverage['qunit/qunit.js'][1174]++;
      return true;
    }
    _$jscoverage['qunit/qunit.js'][1177]++;
    if (config.testNumber) {
      _$jscoverage['qunit/qunit.js'][1178]++;
      return test.testNumber === config.testNumber;
    }
    _$jscoverage['qunit/qunit.js'][1181]++;
    if (module && (!test.module || test.module.toLowerCase() !== module)) {
      _$jscoverage['qunit/qunit.js'][1182]++;
      return false;
    }
    _$jscoverage['qunit/qunit.js'][1185]++;
    if (!filter) {
      _$jscoverage['qunit/qunit.js'][1186]++;
      return true;
    }
    _$jscoverage['qunit/qunit.js'][1189]++;
    include = filter.charAt(0) !== "!";
    _$jscoverage['qunit/qunit.js'][1190]++;
    if (!include) {
      _$jscoverage['qunit/qunit.js'][1191]++;
      filter = filter.slice(1);
    }
    _$jscoverage['qunit/qunit.js'][1195]++;
    if (fullName.indexOf(filter) !== -1) {
      _$jscoverage['qunit/qunit.js'][1196]++;
      return include;
    }
    _$jscoverage['qunit/qunit.js'][1200]++;
    return !include;
  }
  _$jscoverage['qunit/qunit.js'][1206]++;
  function extractStacktrace(e, offset) {
    _$jscoverage['qunit/qunit.js'][1207]++;
    offset = offset === undefined ? 3 : offset;
    _$jscoverage['qunit/qunit.js'][1209]++;
    var stack, include, i, regex;
    _$jscoverage['qunit/qunit.js'][1211]++;
    if (e.stacktrace) {
      _$jscoverage['qunit/qunit.js'][1213]++;
      return e.stacktrace.split("\n")[offset + 3];
    } else {
      _$jscoverage['qunit/qunit.js'][1214]++;
      if (e.stack) {
        _$jscoverage['qunit/qunit.js'][1216]++;
        stack = e.stack.split("\n");
        _$jscoverage['qunit/qunit.js'][1217]++;
        if (/^error$/i.test(stack[0])) {
          _$jscoverage['qunit/qunit.js'][1218]++;
          stack.shift();
        }
        _$jscoverage['qunit/qunit.js'][1220]++;
        if (fileName) {
          _$jscoverage['qunit/qunit.js'][1221]++;
          include = [];
          _$jscoverage['qunit/qunit.js'][1222]++;
          for (i = offset; i < stack.length; i++) {
            _$jscoverage['qunit/qunit.js'][1223]++;
            if (stack[i].indexOf(fileName) != -1) {
              _$jscoverage['qunit/qunit.js'][1224]++;
              break;
            }
            _$jscoverage['qunit/qunit.js'][1226]++;
            include.push(stack[i]);
          }
          _$jscoverage['qunit/qunit.js'][1228]++;
          if (include.length) {
            _$jscoverage['qunit/qunit.js'][1229]++;
            return include.join("\n");
          }
        }
        _$jscoverage['qunit/qunit.js'][1232]++;
        return stack[offset];
      } else {
        _$jscoverage['qunit/qunit.js'][1233]++;
        if (e.sourceURL) {
          _$jscoverage['qunit/qunit.js'][1237]++;
          if (/qunit.js$/.test(e.sourceURL)) {
            _$jscoverage['qunit/qunit.js'][1238]++;
            return;
          }
          _$jscoverage['qunit/qunit.js'][1241]++;
          return e.sourceURL + ":" + e.line;
        }
      }
    }
  }
  _$jscoverage['qunit/qunit.js'][1244]++;
  function sourceFromStacktrace(offset) {
    _$jscoverage['qunit/qunit.js'][1245]++;
    try {
      _$jscoverage['qunit/qunit.js'][1246]++;
      throw new Error();
    }    catch (e) {
  _$jscoverage['qunit/qunit.js'][1248]++;
  return extractStacktrace(e, offset);
}
  }
  _$jscoverage['qunit/qunit.js'][1252]++;
  function escapeInnerText(s) {
    _$jscoverage['qunit/qunit.js'][1253]++;
    if (!s) {
      _$jscoverage['qunit/qunit.js'][1254]++;
      return "";
    }
    _$jscoverage['qunit/qunit.js'][1256]++;
    s = s + "";
    _$jscoverage['qunit/qunit.js'][1257]++;
    return s.replace(/[\&<>]/g, function(s) {
  _$jscoverage['qunit/qunit.js'][1258]++;
  switch (s) {
    case "&":
      _$jscoverage['qunit/qunit.js'][1259]++;
      return "&amp;";
    case "<":
      _$jscoverage['qunit/qunit.js'][1260]++;
      return "&lt;";
    case ">":
      _$jscoverage['qunit/qunit.js'][1261]++;
      return "&gt;";
    default:
      _$jscoverage['qunit/qunit.js'][1262]++;
      return s;
  }
});
  }
  _$jscoverage['qunit/qunit.js'][1267]++;
  function synchronize(callback, last) {
    _$jscoverage['qunit/qunit.js'][1268]++;
    config.queue.push(callback);
    _$jscoverage['qunit/qunit.js'][1270]++;
    if (config.autorun && !config.blocking) {
      _$jscoverage['qunit/qunit.js'][1271]++;
      process(last);
    }
  }
  _$jscoverage['qunit/qunit.js'][1275]++;
  function process(last) {
    _$jscoverage['qunit/qunit.js'][1276]++;
    function next() {
      _$jscoverage['qunit/qunit.js'][1277]++;
      process(last);
    }
    _$jscoverage['qunit/qunit.js'][1279]++;
    var start = new Date().getTime();
    _$jscoverage['qunit/qunit.js'][1280]++;
    config.depth = config.depth ? config.depth + 1 : 1;
    _$jscoverage['qunit/qunit.js'][1282]++;
    while (config.queue.length && !config.blocking) {
      _$jscoverage['qunit/qunit.js'][1283]++;
      if (!defined.setTimeout || config.updateRate <= 0 || ((new Date().getTime() - start) < config.updateRate)) {
        _$jscoverage['qunit/qunit.js'][1284]++;
        config.queue.shift()();
      } else {
        _$jscoverage['qunit/qunit.js'][1286]++;
        window.setTimeout(next, 13);
        _$jscoverage['qunit/qunit.js'][1287]++;
        break;
      }
    }
    _$jscoverage['qunit/qunit.js'][1290]++;
    config.depth--;
    _$jscoverage['qunit/qunit.js'][1291]++;
    if (last && !config.blocking && !config.queue.length && config.depth === 0) {
      _$jscoverage['qunit/qunit.js'][1292]++;
      done();
    }
  }
  _$jscoverage['qunit/qunit.js'][1296]++;
  function saveGlobal() {
    _$jscoverage['qunit/qunit.js'][1297]++;
    config.pollution = [];
    _$jscoverage['qunit/qunit.js'][1299]++;
    if (config.noglobals) {
      _$jscoverage['qunit/qunit.js'][1300]++;
      for (var key in window) {
        _$jscoverage['qunit/qunit.js'][1302]++;
        if (!hasOwn.call(window, key) || /^qunit-test-output/.test(key)) {
          _$jscoverage['qunit/qunit.js'][1303]++;
          continue;
        }
        _$jscoverage['qunit/qunit.js'][1305]++;
        config.pollution.push(key);
      }
    }
  }
  _$jscoverage['qunit/qunit.js'][1310]++;
  function checkPollution(name) {
    _$jscoverage['qunit/qunit.js'][1311]++;
    var newGlobals, deletedGlobals, old = config.pollution;
    _$jscoverage['qunit/qunit.js'][1315]++;
    saveGlobal();
    _$jscoverage['qunit/qunit.js'][1317]++;
    newGlobals = diff(config.pollution, old);
    _$jscoverage['qunit/qunit.js'][1318]++;
    if (newGlobals.length > 0) {
      _$jscoverage['qunit/qunit.js'][1319]++;
      QUnit.pushFailure("Introduced global variable(s): " + newGlobals.join(", "));
    }
    _$jscoverage['qunit/qunit.js'][1322]++;
    deletedGlobals = diff(old, config.pollution);
    _$jscoverage['qunit/qunit.js'][1323]++;
    if (deletedGlobals.length > 0) {
      _$jscoverage['qunit/qunit.js'][1324]++;
      QUnit.pushFailure("Deleted global variable(s): " + deletedGlobals.join(", "));
    }
  }
  _$jscoverage['qunit/qunit.js'][1329]++;
  function diff(a, b) {
    _$jscoverage['qunit/qunit.js'][1330]++;
    var i, j, result = a.slice();
    _$jscoverage['qunit/qunit.js'][1333]++;
    for (i = 0; i < result.length; i++) {
      _$jscoverage['qunit/qunit.js'][1334]++;
      for (j = 0; j < b.length; j++) {
        _$jscoverage['qunit/qunit.js'][1335]++;
        if (result[i] === b[j]) {
          _$jscoverage['qunit/qunit.js'][1336]++;
          result.splice(i, 1);
          _$jscoverage['qunit/qunit.js'][1337]++;
          i--;
          _$jscoverage['qunit/qunit.js'][1338]++;
          break;
        }
      }
    }
    _$jscoverage['qunit/qunit.js'][1342]++;
    return result;
  }
  _$jscoverage['qunit/qunit.js'][1345]++;
  function extend(a, b) {
    _$jscoverage['qunit/qunit.js'][1346]++;
    for (var prop in b) {
      _$jscoverage['qunit/qunit.js'][1347]++;
      if (b[prop] === undefined) {
        _$jscoverage['qunit/qunit.js'][1348]++;
        delete a[prop];
      } else {
        _$jscoverage['qunit/qunit.js'][1351]++;
        if (prop !== "constructor" || a !== window) {
          _$jscoverage['qunit/qunit.js'][1352]++;
          a[prop] = b[prop];
        }
      }
    }
    _$jscoverage['qunit/qunit.js'][1356]++;
    return a;
  }
  _$jscoverage['qunit/qunit.js'][1359]++;
  function addEvent(elem, type, fn) {
    _$jscoverage['qunit/qunit.js'][1360]++;
    if (elem.addEventListener) {
      _$jscoverage['qunit/qunit.js'][1361]++;
      elem.addEventListener(type, fn, false);
    } else {
      _$jscoverage['qunit/qunit.js'][1362]++;
      if (elem.attachEvent) {
        _$jscoverage['qunit/qunit.js'][1363]++;
        elem.attachEvent("on" + type, fn);
      } else {
        _$jscoverage['qunit/qunit.js'][1365]++;
        fn();
      }
    }
  }
  _$jscoverage['qunit/qunit.js'][1369]++;
  function hasClass(elem, name) {
    _$jscoverage['qunit/qunit.js'][1370]++;
    return (" " + elem.className + " ").indexOf(" " + name + " ") > -1;
  }
  _$jscoverage['qunit/qunit.js'][1373]++;
  function addClass(elem, name) {
    _$jscoverage['qunit/qunit.js'][1374]++;
    if (!hasClass(elem, name)) {
      _$jscoverage['qunit/qunit.js'][1375]++;
      elem.className += (elem.className ? " " : "") + name;
    }
  }
  _$jscoverage['qunit/qunit.js'][1379]++;
  function removeClass(elem, name) {
    _$jscoverage['qunit/qunit.js'][1380]++;
    var set = " " + elem.className + " ";
    _$jscoverage['qunit/qunit.js'][1382]++;
    while (set.indexOf(" " + name + " ") > -1) {
      _$jscoverage['qunit/qunit.js'][1383]++;
      set = set.replace(" " + name + " ", " ");
    }
    _$jscoverage['qunit/qunit.js'][1386]++;
    elem.className = window.jQuery ? jQuery.trim(set) : (set.trim ? set.trim() : set);
  }
  _$jscoverage['qunit/qunit.js'][1389]++;
  function id(name) {
    _$jscoverage['qunit/qunit.js'][1390]++;
    return !!(typeof document !== "undefined" && document && document.getElementById) && document.getElementById(name);
  }
  _$jscoverage['qunit/qunit.js'][1394]++;
  function registerLoggingCallback(key) {
    _$jscoverage['qunit/qunit.js'][1395]++;
    return function(callback) {
  _$jscoverage['qunit/qunit.js'][1396]++;
  config[key].push(callback);
};
  }
  _$jscoverage['qunit/qunit.js'][1401]++;
  function runLoggingCallbacks(key, scope, args) {
    _$jscoverage['qunit/qunit.js'][1403]++;
    var i, callbacks;
    _$jscoverage['qunit/qunit.js'][1404]++;
    if (QUnit.hasOwnProperty(key)) {
      _$jscoverage['qunit/qunit.js'][1405]++;
      QUnit[key].call(scope, args);
    } else {
      _$jscoverage['qunit/qunit.js'][1407]++;
      callbacks = config[key];
      _$jscoverage['qunit/qunit.js'][1408]++;
      for (i = 0; i < callbacks.length; i++) {
        _$jscoverage['qunit/qunit.js'][1409]++;
        callbacks[i].call(scope, args);
      }
    }
  }
  _$jscoverage['qunit/qunit.js'][1416]++;
  QUnit.equiv = (function() {
  _$jscoverage['qunit/qunit.js'][1419]++;
  function bindCallbacks(o, callbacks, args) {
    _$jscoverage['qunit/qunit.js'][1420]++;
    var prop = QUnit.objectType(o);
    _$jscoverage['qunit/qunit.js'][1421]++;
    if (prop) {
      _$jscoverage['qunit/qunit.js'][1422]++;
      if (QUnit.objectType(callbacks[prop]) === "function") {
        _$jscoverage['qunit/qunit.js'][1423]++;
        return callbacks[prop].apply(callbacks, args);
      } else {
        _$jscoverage['qunit/qunit.js'][1425]++;
        return callbacks[prop];
      }
    }
  }
  _$jscoverage['qunit/qunit.js'][1431]++;
  var innerEquiv, callers = [], parents = [], getProto = Object.getPrototypeOf || function(obj) {
  _$jscoverage['qunit/qunit.js'][1438]++;
  return obj.__proto__;
}, callbacks = (function() {
  _$jscoverage['qunit/qunit.js'][1443]++;
  function useStrictEquality(b, a) {
    _$jscoverage['qunit/qunit.js'][1444]++;
    if (b instanceof a.constructor || a instanceof b.constructor) {
      _$jscoverage['qunit/qunit.js'][1449]++;
      return a == b;
    } else {
      _$jscoverage['qunit/qunit.js'][1451]++;
      return a === b;
    }
  }
  _$jscoverage['qunit/qunit.js'][1455]++;
  return {"string": useStrictEquality, "boolean": useStrictEquality, "number": useStrictEquality, "null": useStrictEquality, "undefined": useStrictEquality, "nan": function(b) {
  _$jscoverage['qunit/qunit.js'][1463]++;
  return isNaN(b);
}, "date": function(b, a) {
  _$jscoverage['qunit/qunit.js'][1467]++;
  return QUnit.objectType(b) === "date" && a.valueOf() === b.valueOf();
}, "regexp": function(b, a) {
  _$jscoverage['qunit/qunit.js'][1471]++;
  return QUnit.objectType(b) === "regexp" && a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline && a.sticky === b.sticky;
}, "function": function() {
  _$jscoverage['qunit/qunit.js'][1486]++;
  var caller = callers[callers.length - 1];
  _$jscoverage['qunit/qunit.js'][1487]++;
  return caller !== Object && typeof caller !== "undefined";
}, "array": function(b, a) {
  _$jscoverage['qunit/qunit.js'][1491]++;
  var i, j, len, loop;
  _$jscoverage['qunit/qunit.js'][1494]++;
  if (QUnit.objectType(b) !== "array") {
    _$jscoverage['qunit/qunit.js'][1495]++;
    return false;
  }
  _$jscoverage['qunit/qunit.js'][1498]++;
  len = a.length;
  _$jscoverage['qunit/qunit.js'][1499]++;
  if (len !== b.length) {
    _$jscoverage['qunit/qunit.js'][1501]++;
    return false;
  }
  _$jscoverage['qunit/qunit.js'][1505]++;
  parents.push(a);
  _$jscoverage['qunit/qunit.js'][1506]++;
  for (i = 0; i < len; i++) {
    _$jscoverage['qunit/qunit.js'][1507]++;
    loop = false;
    _$jscoverage['qunit/qunit.js'][1508]++;
    for (j = 0; j < parents.length; j++) {
      _$jscoverage['qunit/qunit.js'][1509]++;
      if (parents[j] === a[i]) {
        _$jscoverage['qunit/qunit.js'][1510]++;
        loop = true;
      }
    }
    _$jscoverage['qunit/qunit.js'][1513]++;
    if (!loop && !innerEquiv(a[i], b[i])) {
      _$jscoverage['qunit/qunit.js'][1514]++;
      parents.pop();
      _$jscoverage['qunit/qunit.js'][1515]++;
      return false;
    }
  }
  _$jscoverage['qunit/qunit.js'][1518]++;
  parents.pop();
  _$jscoverage['qunit/qunit.js'][1519]++;
  return true;
}, "object": function(b, a) {
  _$jscoverage['qunit/qunit.js'][1523]++;
  var i, j, loop, eq = true, aProperties = [], bProperties = [];
  _$jscoverage['qunit/qunit.js'][1531]++;
  if (a.constructor !== b.constructor) {
    _$jscoverage['qunit/qunit.js'][1534]++;
    if (!((getProto(a) === null && getProto(b) === Object.prototype) || (getProto(b) === null && getProto(a) === Object.prototype))) {
      _$jscoverage['qunit/qunit.js'][1536]++;
      return false;
    }
  }
  _$jscoverage['qunit/qunit.js'][1541]++;
  callers.push(a.constructor);
  _$jscoverage['qunit/qunit.js'][1543]++;
  parents.push(a);
  _$jscoverage['qunit/qunit.js'][1545]++;
  for (i in a) {
    _$jscoverage['qunit/qunit.js'][1547]++;
    loop = false;
    _$jscoverage['qunit/qunit.js'][1548]++;
    for (j = 0; j < parents.length; j++) {
      _$jscoverage['qunit/qunit.js'][1549]++;
      if (parents[j] === a[i]) {
        _$jscoverage['qunit/qunit.js'][1551]++;
        loop = true;
      }
    }
    _$jscoverage['qunit/qunit.js'][1554]++;
    aProperties.push(i);
    _$jscoverage['qunit/qunit.js'][1556]++;
    if (!loop && !innerEquiv(a[i], b[i])) {
      _$jscoverage['qunit/qunit.js'][1557]++;
      eq = false;
      _$jscoverage['qunit/qunit.js'][1558]++;
      break;
    }
  }
  _$jscoverage['qunit/qunit.js'][1562]++;
  callers.pop();
  _$jscoverage['qunit/qunit.js'][1563]++;
  parents.pop();
  _$jscoverage['qunit/qunit.js'][1565]++;
  for (i in b) {
    _$jscoverage['qunit/qunit.js'][1566]++;
    bProperties.push(i);
  }
  _$jscoverage['qunit/qunit.js'][1570]++;
  return eq && innerEquiv(aProperties.sort(), bProperties.sort());
}};
}());
  _$jscoverage['qunit/qunit.js'][1575]++;
  innerEquiv = function() {
  _$jscoverage['qunit/qunit.js'][1576]++;
  var args = [].slice.apply(arguments);
  _$jscoverage['qunit/qunit.js'][1577]++;
  if (args.length < 2) {
    _$jscoverage['qunit/qunit.js'][1578]++;
    return true;
  }
  _$jscoverage['qunit/qunit.js'][1581]++;
  return (function(a, b) {
  _$jscoverage['qunit/qunit.js'][1582]++;
  if (a === b) {
    _$jscoverage['qunit/qunit.js'][1583]++;
    return true;
  } else {
    _$jscoverage['qunit/qunit.js'][1584]++;
    if (a === null || b === null || typeof a === "undefined" || typeof b === "undefined" || QUnit.objectType(a) !== QUnit.objectType(b)) {
      _$jscoverage['qunit/qunit.js'][1587]++;
      return false;
    } else {
      _$jscoverage['qunit/qunit.js'][1589]++;
      return bindCallbacks(a, callbacks, [b, a]);
    }
  }
}(args[0], args[1]) && arguments.callee.apply(this, args.splice(1, args.length - 1)));
};
  _$jscoverage['qunit/qunit.js'][1596]++;
  return innerEquiv;
}());
  _$jscoverage['qunit/qunit.js'][1609]++;
  QUnit.jsDump = (function() {
  _$jscoverage['qunit/qunit.js'][1610]++;
  function quote(str) {
    _$jscoverage['qunit/qunit.js'][1611]++;
    return '"' + str.toString().replace(/"/g, '\\"') + '"';
  }
  _$jscoverage['qunit/qunit.js'][1613]++;
  function literal(o) {
    _$jscoverage['qunit/qunit.js'][1614]++;
    return o + "";
  }
  _$jscoverage['qunit/qunit.js'][1616]++;
  function join(pre, arr, post) {
    _$jscoverage['qunit/qunit.js'][1617]++;
    var s = jsDump.separator(), base = jsDump.indent(), inner = jsDump.indent(1);
    _$jscoverage['qunit/qunit.js'][1620]++;
    if (arr.join) {
      _$jscoverage['qunit/qunit.js'][1621]++;
      arr = arr.join("," + s + inner);
    }
    _$jscoverage['qunit/qunit.js'][1623]++;
    if (!arr) {
      _$jscoverage['qunit/qunit.js'][1624]++;
      return pre + post;
    }
    _$jscoverage['qunit/qunit.js'][1626]++;
    return [pre, inner + arr, base + post].join(s);
  }
  _$jscoverage['qunit/qunit.js'][1628]++;
  function array(arr, stack) {
    _$jscoverage['qunit/qunit.js'][1629]++;
    var i = arr.length, ret = new Array(i);
    _$jscoverage['qunit/qunit.js'][1630]++;
    this.up();
    _$jscoverage['qunit/qunit.js'][1631]++;
    while (i--) {
      _$jscoverage['qunit/qunit.js'][1632]++;
      ret[i] = this.parse(arr[i], undefined, stack);
    }
    _$jscoverage['qunit/qunit.js'][1634]++;
    this.down();
    _$jscoverage['qunit/qunit.js'][1635]++;
    return join("[", ret, "]");
  }
  _$jscoverage['qunit/qunit.js'][1638]++;
  var reName = /^function (\w+)/, jsDump = {parse: function(obj, type, stack) {
  _$jscoverage['qunit/qunit.js'][1642]++;
  stack = stack || [];
  _$jscoverage['qunit/qunit.js'][1643]++;
  var inStack, res, parser = this.parsers[type || this.typeOf(obj)];
  _$jscoverage['qunit/qunit.js'][1646]++;
  type = typeof parser;
  _$jscoverage['qunit/qunit.js'][1647]++;
  inStack = inArray(obj, stack);
  _$jscoverage['qunit/qunit.js'][1649]++;
  if (inStack != -1) {
    _$jscoverage['qunit/qunit.js'][1650]++;
    return "recursion(" + (inStack - stack.length) + ")";
  }
  _$jscoverage['qunit/qunit.js'][1652]++;
  if (type == "function") {
    _$jscoverage['qunit/qunit.js'][1653]++;
    stack.push(obj);
    _$jscoverage['qunit/qunit.js'][1654]++;
    res = parser.call(this, obj, stack);
    _$jscoverage['qunit/qunit.js'][1655]++;
    stack.pop();
    _$jscoverage['qunit/qunit.js'][1656]++;
    return res;
  }
  _$jscoverage['qunit/qunit.js'][1658]++;
  return (type == "string") ? parser : this.parsers.error;
}, typeOf: function(obj) {
  _$jscoverage['qunit/qunit.js'][1661]++;
  var type;
  _$jscoverage['qunit/qunit.js'][1662]++;
  if (obj === null) {
    _$jscoverage['qunit/qunit.js'][1663]++;
    type = "null";
  } else {
    _$jscoverage['qunit/qunit.js'][1664]++;
    if (typeof obj === "undefined") {
      _$jscoverage['qunit/qunit.js'][1665]++;
      type = "undefined";
    } else {
      _$jscoverage['qunit/qunit.js'][1666]++;
      if (QUnit.is("regexp", obj)) {
        _$jscoverage['qunit/qunit.js'][1667]++;
        type = "regexp";
      } else {
        _$jscoverage['qunit/qunit.js'][1668]++;
        if (QUnit.is("date", obj)) {
          _$jscoverage['qunit/qunit.js'][1669]++;
          type = "date";
        } else {
          _$jscoverage['qunit/qunit.js'][1670]++;
          if (QUnit.is("function", obj)) {
            _$jscoverage['qunit/qunit.js'][1671]++;
            type = "function";
          } else {
            _$jscoverage['qunit/qunit.js'][1672]++;
            if (typeof obj.setInterval !== undefined && typeof obj.document !== "undefined" && typeof obj.nodeType === "undefined") {
              _$jscoverage['qunit/qunit.js'][1673]++;
              type = "window";
            } else {
              _$jscoverage['qunit/qunit.js'][1674]++;
              if (obj.nodeType === 9) {
                _$jscoverage['qunit/qunit.js'][1675]++;
                type = "document";
              } else {
                _$jscoverage['qunit/qunit.js'][1676]++;
                if (obj.nodeType) {
                  _$jscoverage['qunit/qunit.js'][1677]++;
                  type = "node";
                } else {
                  _$jscoverage['qunit/qunit.js'][1678]++;
                  if (toString.call(obj) === "[object Array]" || (typeof obj.length === "number" && typeof obj.item !== "undefined" && (obj.length ? obj.item(0) === obj[0] : (obj.item(0) === null && typeof obj[0] === "undefined")))) {
                    _$jscoverage['qunit/qunit.js'][1684]++;
                    type = "array";
                  } else {
                    _$jscoverage['qunit/qunit.js'][1685]++;
                    if (obj.constructor === Error.prototype.constructor) {
                      _$jscoverage['qunit/qunit.js'][1686]++;
                      type = "error";
                    } else {
                      _$jscoverage['qunit/qunit.js'][1688]++;
                      type = typeof obj;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  _$jscoverage['qunit/qunit.js'][1690]++;
  return type;
}, separator: function() {
  _$jscoverage['qunit/qunit.js'][1693]++;
  return this.multiline ? this.HTML ? "<br />" : "\n" : this.HTML ? "&nbsp;" : " ";
}, indent: function(extra) {
  _$jscoverage['qunit/qunit.js'][1697]++;
  if (!this.multiline) {
    _$jscoverage['qunit/qunit.js'][1698]++;
    return "";
  }
  _$jscoverage['qunit/qunit.js'][1700]++;
  var chr = this.indentChar;
  _$jscoverage['qunit/qunit.js'][1701]++;
  if (this.HTML) {
    _$jscoverage['qunit/qunit.js'][1702]++;
    chr = chr.replace(/\t/g, "   ").replace(/ /g, "&nbsp;");
  }
  _$jscoverage['qunit/qunit.js'][1704]++;
  return new Array(this._depth_ + (extra || 0)).join(chr);
}, up: function(a) {
  _$jscoverage['qunit/qunit.js'][1707]++;
  this._depth_ += a || 1;
}, down: function(a) {
  _$jscoverage['qunit/qunit.js'][1710]++;
  this._depth_ -= a || 1;
}, setParser: function(name, parser) {
  _$jscoverage['qunit/qunit.js'][1713]++;
  this.parsers[name] = parser;
}, quote: quote, literal: literal, join: join, _depth_: 1, parsers: {window: "[Window]", document: "[Document]", error: function(error) {
  _$jscoverage['qunit/qunit.js'][1726]++;
  return "Error(\"" + error.message + "\")";
}, unknown: "[Unknown]", "null": "null", "undefined": "undefined", "function": function(fn) {
  _$jscoverage['qunit/qunit.js'][1732]++;
  var ret = "function", name = "name" in fn ? fn.name : (reName.exec(fn) || [])[1];
  _$jscoverage['qunit/qunit.js'][1736]++;
  if (name) {
    _$jscoverage['qunit/qunit.js'][1737]++;
    ret += " " + name;
  }
  _$jscoverage['qunit/qunit.js'][1739]++;
  ret += "( ";
  _$jscoverage['qunit/qunit.js'][1741]++;
  ret = [ret, QUnit.jsDump.parse(fn, "functionArgs"), "){"].join("");
  _$jscoverage['qunit/qunit.js'][1742]++;
  return join(ret, QUnit.jsDump.parse(fn, "functionCode"), "}");
}, array: array, nodelist: array, "arguments": array, object: function(map, stack) {
  _$jscoverage['qunit/qunit.js'][1748]++;
  var ret = [], keys, key, val, i;
  _$jscoverage['qunit/qunit.js'][1749]++;
  QUnit.jsDump.up();
  _$jscoverage['qunit/qunit.js'][1750]++;
  keys = [];
  _$jscoverage['qunit/qunit.js'][1751]++;
  for (key in map) {
    _$jscoverage['qunit/qunit.js'][1752]++;
    keys.push(key);
  }
  _$jscoverage['qunit/qunit.js'][1754]++;
  keys.sort();
  _$jscoverage['qunit/qunit.js'][1755]++;
  for (i = 0; i < keys.length; i++) {
    _$jscoverage['qunit/qunit.js'][1756]++;
    key = keys[i];
    _$jscoverage['qunit/qunit.js'][1757]++;
    val = map[key];
    _$jscoverage['qunit/qunit.js'][1758]++;
    ret.push(QUnit.jsDump.parse(key, "key") + ": " + QUnit.jsDump.parse(val, undefined, stack));
  }
  _$jscoverage['qunit/qunit.js'][1760]++;
  QUnit.jsDump.down();
  _$jscoverage['qunit/qunit.js'][1761]++;
  return join("{", ret, "}");
}, node: function(node) {
  _$jscoverage['qunit/qunit.js'][1764]++;
  var a, val, open = QUnit.jsDump.HTML ? "&lt;" : "<", close = QUnit.jsDump.HTML ? "&gt;" : ">", tag = node.nodeName.toLowerCase(), ret = open + tag;
  _$jscoverage['qunit/qunit.js'][1770]++;
  for (a in QUnit.jsDump.DOMAttrs) {
    _$jscoverage['qunit/qunit.js'][1771]++;
    val = node[QUnit.jsDump.DOMAttrs[a]];
    _$jscoverage['qunit/qunit.js'][1772]++;
    if (val) {
      _$jscoverage['qunit/qunit.js'][1773]++;
      ret += " " + a + "=" + QUnit.jsDump.parse(val, "attribute");
    }
  }
  _$jscoverage['qunit/qunit.js'][1776]++;
  return ret + close + open + "/" + tag + close;
}, functionArgs: function(fn) {
  _$jscoverage['qunit/qunit.js'][1780]++;
  var args, l = fn.length;
  _$jscoverage['qunit/qunit.js'][1783]++;
  if (!l) {
    _$jscoverage['qunit/qunit.js'][1784]++;
    return "";
  }
  _$jscoverage['qunit/qunit.js'][1787]++;
  args = new Array(l);
  _$jscoverage['qunit/qunit.js'][1788]++;
  while (l--) {
    _$jscoverage['qunit/qunit.js'][1790]++;
    args[l] = String.fromCharCode(97 + l);
  }
  _$jscoverage['qunit/qunit.js'][1792]++;
  return " " + args.join(", ") + " ";
}, key: quote, functionCode: "[code]", attribute: quote, string: quote, date: quote, regexp: literal, number: literal, "boolean": literal}, DOMAttrs: {id: "id", name: "name", "class": "className"}, HTML: false, indentChar: "  ", multiline: true};
  _$jscoverage['qunit/qunit.js'][1820]++;
  return jsDump;
}());
  _$jscoverage['qunit/qunit.js'][1824]++;
  function getText(elems) {
    _$jscoverage['qunit/qunit.js'][1825]++;
    var i, elem, ret = "";
    _$jscoverage['qunit/qunit.js'][1828]++;
    for (i = 0; elems[i]; i++) {
      _$jscoverage['qunit/qunit.js'][1829]++;
      elem = elems[i];
      _$jscoverage['qunit/qunit.js'][1832]++;
      if (elem.nodeType === 3 || elem.nodeType === 4) {
        _$jscoverage['qunit/qunit.js'][1833]++;
        ret += elem.nodeValue;
      } else {
        _$jscoverage['qunit/qunit.js'][1836]++;
        if (elem.nodeType !== 8) {
          _$jscoverage['qunit/qunit.js'][1837]++;
          ret += getText(elem.childNodes);
        }
      }
    }
    _$jscoverage['qunit/qunit.js'][1841]++;
    return ret;
  }
  _$jscoverage['qunit/qunit.js'][1845]++;
  function inArray(elem, array) {
    _$jscoverage['qunit/qunit.js'][1846]++;
    if (array.indexOf) {
      _$jscoverage['qunit/qunit.js'][1847]++;
      return array.indexOf(elem);
    }
    _$jscoverage['qunit/qunit.js'][1850]++;
    for (var i = 0, length = array.length; i < length; i++) {
      _$jscoverage['qunit/qunit.js'][1851]++;
      if (array[i] === elem) {
        _$jscoverage['qunit/qunit.js'][1852]++;
        return i;
      }
    }
    _$jscoverage['qunit/qunit.js'][1856]++;
    return -1;
  }
  _$jscoverage['qunit/qunit.js'][1873]++;
  QUnit.diff = (function() {
  _$jscoverage['qunit/qunit.js'][1874]++;
  function diff(o, n) {
    _$jscoverage['qunit/qunit.js'][1875]++;
    var i, ns = {}, os = {};
    _$jscoverage['qunit/qunit.js'][1879]++;
    for (i = 0; i < n.length; i++) {
      _$jscoverage['qunit/qunit.js'][1880]++;
      if (ns[n[i]] == null) {
        _$jscoverage['qunit/qunit.js'][1881]++;
        ns[n[i]] = {rows: [], o: null};
      }
      _$jscoverage['qunit/qunit.js'][1886]++;
      ns[n[i]].rows.push(i);
    }
    _$jscoverage['qunit/qunit.js'][1889]++;
    for (i = 0; i < o.length; i++) {
      _$jscoverage['qunit/qunit.js'][1890]++;
      if (os[o[i]] == null) {
        _$jscoverage['qunit/qunit.js'][1891]++;
        os[o[i]] = {rows: [], n: null};
      }
      _$jscoverage['qunit/qunit.js'][1896]++;
      os[o[i]].rows.push(i);
    }
    _$jscoverage['qunit/qunit.js'][1899]++;
    for (i in ns) {
      _$jscoverage['qunit/qunit.js'][1900]++;
      if (!hasOwn.call(ns, i)) {
        _$jscoverage['qunit/qunit.js'][1901]++;
        continue;
      }
      _$jscoverage['qunit/qunit.js'][1903]++;
      if (ns[i].rows.length == 1 && typeof os[i] != "undefined" && os[i].rows.length == 1) {
        _$jscoverage['qunit/qunit.js'][1904]++;
        n[ns[i].rows[0]] = {text: n[ns[i].rows[0]], row: os[i].rows[0]};
        _$jscoverage['qunit/qunit.js'][1908]++;
        o[os[i].rows[0]] = {text: o[os[i].rows[0]], row: ns[i].rows[0]};
      }
    }
    _$jscoverage['qunit/qunit.js'][1915]++;
    for (i = 0; i < n.length - 1; i++) {
      _$jscoverage['qunit/qunit.js'][1916]++;
      if (n[i].text != null && n[i + 1].text == null && n[i].row + 1 < o.length && o[n[i].row + 1].text == null && n[i + 1] == o[n[i].row + 1]) {
        _$jscoverage['qunit/qunit.js'][1919]++;
        n[i + 1] = {text: n[i + 1], row: n[i].row + 1};
        _$jscoverage['qunit/qunit.js'][1923]++;
        o[n[i].row + 1] = {text: o[n[i].row + 1], row: i + 1};
      }
    }
    _$jscoverage['qunit/qunit.js'][1930]++;
    for (i = n.length - 1; i > 0; i--) {
      _$jscoverage['qunit/qunit.js'][1931]++;
      if (n[i].text != null && n[i - 1].text == null && n[i].row > 0 && o[n[i].row - 1].text == null && n[i - 1] == o[n[i].row - 1]) {
        _$jscoverage['qunit/qunit.js'][1934]++;
        n[i - 1] = {text: n[i - 1], row: n[i].row - 1};
        _$jscoverage['qunit/qunit.js'][1938]++;
        o[n[i].row - 1] = {text: o[n[i].row - 1], row: i - 1};
      }
    }
    _$jscoverage['qunit/qunit.js'][1945]++;
    return {o: o, n: n};
  }
  _$jscoverage['qunit/qunit.js'][1951]++;
  return function(o, n) {
  _$jscoverage['qunit/qunit.js'][1952]++;
  o = o.replace(/\s+$/, "");
  _$jscoverage['qunit/qunit.js'][1953]++;
  n = n.replace(/\s+$/, "");
  _$jscoverage['qunit/qunit.js'][1955]++;
  var i, pre, str = "", out = diff(o === "" ? [] : o.split(/\s+/), n === "" ? [] : n.split(/\s+/)), oSpace = o.match(/\s+/g), nSpace = n.match(/\s+/g);
  _$jscoverage['qunit/qunit.js'][1961]++;
  if (oSpace == null) {
    _$jscoverage['qunit/qunit.js'][1962]++;
    oSpace = [" "];
  } else {
    _$jscoverage['qunit/qunit.js'][1965]++;
    oSpace.push(" ");
  }
  _$jscoverage['qunit/qunit.js'][1968]++;
  if (nSpace == null) {
    _$jscoverage['qunit/qunit.js'][1969]++;
    nSpace = [" "];
  } else {
    _$jscoverage['qunit/qunit.js'][1972]++;
    nSpace.push(" ");
  }
  _$jscoverage['qunit/qunit.js'][1975]++;
  if (out.n.length === 0) {
    _$jscoverage['qunit/qunit.js'][1976]++;
    for (i = 0; i < out.o.length; i++) {
      _$jscoverage['qunit/qunit.js'][1977]++;
      str += "<del>" + out.o[i] + oSpace[i] + "</del>";
    }
  } else {
    _$jscoverage['qunit/qunit.js'][1981]++;
    if (out.n[0].text == null) {
      _$jscoverage['qunit/qunit.js'][1982]++;
      for (n = 0; n < out.o.length && out.o[n].text == null; n++) {
        _$jscoverage['qunit/qunit.js'][1983]++;
        str += "<del>" + out.o[n] + oSpace[n] + "</del>";
      }
    }
    _$jscoverage['qunit/qunit.js'][1987]++;
    for (i = 0; i < out.n.length; i++) {
      _$jscoverage['qunit/qunit.js'][1988]++;
      if (out.n[i].text == null) {
        _$jscoverage['qunit/qunit.js'][1989]++;
        str += "<ins>" + out.n[i] + nSpace[i] + "</ins>";
      } else {
        _$jscoverage['qunit/qunit.js'][1993]++;
        pre = "";
        _$jscoverage['qunit/qunit.js'][1995]++;
        for (n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++) {
          _$jscoverage['qunit/qunit.js'][1996]++;
          pre += "<del>" + out.o[n] + oSpace[n] + "</del>";
        }
        _$jscoverage['qunit/qunit.js'][1998]++;
        str += " " + out.n[i].text + nSpace[i] + pre;
      }
    }
  }
  _$jscoverage['qunit/qunit.js'][2003]++;
  return str;
};
}());
  _$jscoverage['qunit/qunit.js'][2008]++;
  if (typeof exports !== "undefined") {
    _$jscoverage['qunit/qunit.js'][2009]++;
    extend(exports, QUnit);
  }
}((function() {
  return this;
}.call())));
