var server = 'http://10.30.43.107:49691';
var licence = 'techgorilla-123';
chrome.storage.sync.get(function (obj) {
    if(obj['server'] && obj['server'] !== null) {
        server = obj['server'];
        console.log('server',server);
    }
    if(obj['licence'] && obj['licence'] !== null) {
        licence = obj['licence'];
    }
});

chrome.runtime.onInstalled.addListener(function() {
    //run license check
    chrome.storage.sync.set({color: '#3aa757'}, function() {
        //console.log("The color is green.");
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostEquals: 'my.api.net.au'},
            })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

chrome.runtime.onStartup.addListener(function() {
    alert('test');
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.type == "partCode") {
            checkDB(request,sender,sendResponse);
            return true;
        }
    });

function checkDB(request, sender, sendResponse) {
    var resp = sendResponse;
    $.ajax({
        type: "GET",
        dataType: "json",
        url: server + "/partcode?code=" + request.partcode,
        success: function (data) {
            resp({result: data, element: request.element});
        }
    })
}

