chrome.storage.sync.get(function (obj) {
    if(obj['host'] && obj['host'] !== null) {
        $('#host').val(obj['host']);
    }
    if(obj['server'] && obj['server'] !== null) {
        $('#server').val(obj['server']);
    }
    if(obj['licence'] && obj['licence'] !== null) {
        $('#licence').val(obj['licence']);
    }
});
$('#save').click(function() {
    console.log('attempted to save');
    let host = $('#host').val();
    let server = $('#server').val();
    let licence = $('#licence').val();
    chrome.storage.sync.set({host: host,server: server, licence: licence}, function() {
        var status = $('#status');
        status.text('Options saved.');
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    })
    /*chrome.storage.sync.set({host: host}, function() {
        //console.log('color is ' + item);
    })*/
});