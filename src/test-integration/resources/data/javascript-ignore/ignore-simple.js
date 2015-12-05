function createRequest() {
//#JSCOVERAGE_IF window.XMLHttpRequest
  if (window.XMLHttpRequest) {
    return new XMLHttpRequest();
  }
//#JSCOVERAGE_ENDIF
//#JSCOVERAGE_IF window.ActiveXObject
  if (window.ActiveXObject) {
    return new ActiveXObject('Msxml2.XMLHTTP');
  }
//#JSCOVERAGE_ENDIF
  throw 'no XMLHttpRequest implementation available';
}

var request = createRequest();