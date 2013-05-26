function getMessage(number) {
    return 'You selected the number '+number+'.';
}
function getMessage4() {
    return 'You selected the number 4.';
}
function go(element) {
  var message;
  if (element.id === 'radio1') {
    message = 'You selected the number 1.';
  }
  else if (element.id === 'radio2') {
    message = getMessage(2);
  }
  else if (element.id === 'radio3') {
    message = getMessage(3);
  }
  else if (element.id === 'radio4') {
    message = getMessage4();
  }
  var div = document.getElementById('request');
  div.className = 'black';
  div = document.getElementById('result');
  div.innerHTML = '<p>' + message + '</p>';
  div.innerHTML += '<p>If you are running the instrumented version of this program, you can click the "Summary" tab to view a coverage report.</p>';
}
