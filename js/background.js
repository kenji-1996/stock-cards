var server = 'http://10.30.43.107:49691';
var licence = 'techgorilla-123';
var active = false;
chrome.storage.sync.get(function (obj) {
    if(obj['server'] && obj['server'] !== null) {
        server = obj['server'];
        console.log('server',server);
    }
    if(obj['active'] && obj['active'] !== null) {
        active = obj['active'];
        console.log('active',active);
    }
    if(obj['licence'] && obj['licence'] !== null) {
        licence = obj['licence'];
    }
    licenseCheck();
});
chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
            chrome.declarativeContent.onPageChanged.addRules([{
                conditions: [new chrome.declarativeContent.PageStateMatcher({pageUrl: {hostEquals: 'my.api.net.au'},})],
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }]);
    });
});

function licenseCheck() {
    if(jQuery) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "https://billing.techgorilla.io/modules/servers/licensing/check.php?license=" + licence,
            success: function (data) {
                if (data.status === 'Active') {
                    chrome.storage.sync.set({active: true}, function () {console.log('active set to true')});
                } else {
                    chrome.storage.sync.set({active: false}, function () { chrome.storage.sync.set({active: true}, function () {console.log('active set to false')});});
                }
            }
        }).done(function () {
        });
    }else{
        alert('License check failed due to jQuery');
    }
}

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

