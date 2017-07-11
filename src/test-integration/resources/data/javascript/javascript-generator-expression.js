// https://developer.mozilla.org/en/New_in_JavaScript_1.8

let it = makeIterator();
try {
  while (true) {
    document.write(it.next() + "<br>\n");
  }
} catch (err) {
  document.write("End of record.<br>\n");
}

function handleResults( results ) {
  for ( let i in results )
    ;
}
handleResults(makeIterator());

it = (1 for(a in x) for(b in y));
