chrome.runtime.onInstalled.addListener(function() {
    var server = 'http://10.30.43.107:49691';
    var licence = 'techgorilla-123';
    var host = 'my.api.net.au';
    var active = false;
    chrome.storage.sync.get(function (obj) {
        if(obj['server'] == undefined || obj['server'] == null) {
            chrome.storage.sync.set({server: server}, function () {});
        }
        if(obj['licence'] == undefined || obj['licence'] == null) {
            chrome.storage.sync.set({licence: licence}, function () {});
        }
        if(obj['host'] == undefined || obj['host'] == null) {
            chrome.storage.sync.set({host: host}, function () {});
        }
    });
    chrome.storage.sync.set({active:active}, function() {});
    chrome.storage.sync.get(function (obj) {
        if(obj['server'] && obj['server'] !== null) {
            server = obj['server'];
        }
    });
    licenseCheck();
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
            chrome.declarativeContent.onPageChanged.addRules([{
                conditions: [new chrome.declarativeContent.PageStateMatcher({pageUrl: {hostEquals: 'my.api.net.au'},})],
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }]);
    });
});

function licenseCheck() {
    if(jQuery) {
        chrome.storage.sync.get(function (obj) {
            var license,active;
            if(obj['licence'] && obj['licence'] !== null) {
                licence = obj['licence'];
            }else{
                alert('no license set');
            }
            $.ajax({
                type: "GET",
                dataType: "json",
                url: "https://billing.techgorilla.io/modules/servers/licensing/stock-cards-check.php?license=" + licence,
                success: function (data) {

                }
            }).done(function (data) {
                console.log(data);
                if (data.status === 'Active') {
                    chrome.storage.sync.set({active: true}, function () {console.log('Valid license'); });
                } else {
                    chrome.storage.sync.set({active: false}, function () { console.log('Invalid license'); });
                }
            });
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
        if(request.type == "options") {
            chrome.runtime.openOptionsPage();
            return true;
        }
        if(request.type == "license") {
            licenseCheck();
            return true;
        }
    });

function checkDB(request, sender, sendResponse) {
    chrome.storage.sync.get(function (obj) {
        var resp = sendResponse;
        $.ajax({
            type: "GET",
            dataType: "json",
            url: obj['server'] + "/partcode?code=" + request.partcode,
            success: function (data) {
                resp({result: data, element: request.element});
            }
        });
    });
}

