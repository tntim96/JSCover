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