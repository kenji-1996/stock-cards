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
        chrome.runtime.sendMessage({type: 'license'},function(res) {});
        status.text('Options saved.');
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    })
});

$('#restore').click(function() {
    console.log('attempted to save');
    $('#host').val('my.api.net.au');
    $('#server').val('http://10.30.43.107:49691');
    $('#licence').val('techgorilla-123');
    let host = $('#host').val();
    let server = $('#server').val();
    let licence = $('#license').val();
    chrome.storage.sync.set({host: host,server: server, licence: licence}, function() {
        var status = $('#status');
        chrome.runtime.sendMessage({type: 'license'},function(res) {});
        status.text('Options restored to default.');
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    })
});