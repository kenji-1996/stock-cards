chrome.storage.sync.get(function (obj) {
    if(obj['server'] && obj['server'] !== null) {
        $('#server').val(obj['server']);
        $('#server_label').addClass('active');
    }
    if(obj['licence'] && obj['licence'] !== null) {
        $('#licence').val(obj['licence']);
        $('#licence_label').addClass('active');
    }
});
$('#save').click(function() {
    console.log('attempted to save');
    let server = $('#server').val();
    let licence = $('#licence').val();
    chrome.storage.sync.set({server: server, licence: licence}, function() {
        chrome.runtime.sendMessage({type: 'license'},function(res) {
            window.close();
        });

    })
});

$('#restore').click(function() {
    console.log('attempted to save');
    $('#server').val('http://10.30.43.107:49691');
    $('#licence').val('techgorilla-123');
    chrome.storage.sync.set({server: $('#server').val(), licence: $('#licence').val()}, function() {
        chrome.runtime.sendMessage({type: 'license'},function(res) {});
    })
});