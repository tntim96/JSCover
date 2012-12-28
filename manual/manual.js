var toggleIds = [];

function expandAll() {
    for (var i=0; i<toggleIds.length; i++) {
        document.getElementById(toggleIds[i] + 'Toggle').innerHTML = '-';
        document.getElementById(toggleIds[i] + 'Section').style.display = 'block';
    }
}

function collapseAll() {
    for (var i=0; i<toggleIds.length; i++) {
        document.getElementById(toggleIds[i] + 'Toggle').innerHTML = '+';
        document.getElementById(toggleIds[i] + 'Section').style.display = 'none';
    }
}

function toggle_visibility(callerId, id) {
    var caller = document.getElementById(callerId);
    var e = document.getElementById(id);
    if (e.style.display == 'block') {
        caller.innerHTML = '+';
        e.style.display = 'none';
    } else {
        caller.innerHTML = '-';
        e.style.display = 'block';
    }
}