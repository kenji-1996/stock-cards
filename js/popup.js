// Color changing interaction
let openSettings = document.getElementById('openSettings');
openSettings.onclick = function(element) {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('options.html'));
    }
};

$( "form" ).submit(function( event ) {
    event.preventDefault();
    var input = $( "input:first" ).val();
    chrome.runtime.sendMessage({
        type: 'barcode',
        partcode: input,
    }, function (response) {
        if (response) {
            console.log(response.result.data[0].TradeName);
        }
    });
});

$( "#submitSearch" ).click(function( ) {
    let input = $('#server').val();
    chrome.runtime.sendMessage({
        type: 'log',
        consoleLog: input,
    });
    chrome.runtime.sendMessage({
        type: 'barcode',
        partcode: input,
    }, function (response) {
        if (response) {
            console.log(response.result.data[0].TradeName);
        }
    });
});


/*chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    console.log(tabs);
    //chrome.tabs.executeScript(tabs[0].id, {code: 'document.body.style.backgroundColor = "' + color + '";'});
});*/