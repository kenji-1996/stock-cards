chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.get(function (obj) {
        var server = 'http://10.30.43.107:49691';
        var licence = 'techgorilla-123';
        var host = 'my.api.net.au';
        if(obj['server'] === undefined || obj['server'] === null) {
            chrome.storage.sync.set({server: server}, function () {});
        }
        if(obj['licence'] === undefined || obj['licence'] === null) {
            chrome.storage.sync.set({licence: licence}, function () {});
        }
        if(obj['host'] === undefined || obj['host'] === null) {
            chrome.storage.sync.set({host: host}, function () {});
        }
    });
    chrome.storage.sync.set({active:false}, function() {});
    licenseCheck();
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
            chrome.declarativeContent.onPageChanged.addRules([{
                conditions: [new chrome.declarativeContent.PageStateMatcher()],
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }]);
    });
});
setInterval(licenseCheck, 60000); //Check license every 2 minutes
function licenseCheck() {
    chrome.storage.sync.get(function (obj) {
        var license,active;
        if(obj['licence'] && obj['licence'] !== null) {
            licence = obj['licence'];
        }
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "https://billing.techgorilla.io/modules/servers/licensing/stock-cards-check.php?license=" + licence,
        }).done(function (data) {
            if (data.status === 'Active') {
                console.log('license valid');
                chrome.storage.sync.set({active: true}, function () {});
            } else {
                console.log('license invalid');
                chrome.storage.sync.set({active: false}, function () {});
            }
        });
    });
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.type == "partCode") {
            checkDB(request,sender,sendResponse);
            return true;
        }
        if(request.type == "barcode") {
            checkBarcode(request,sender,sendResponse);
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
        if(request.type == "newTab") {
            newTab(request,sender,sendResponse);
            return true;
        }
        if(request.type == "log") {
            console.log(request.consoleLog);
            return true;
        }
    });

function newTab(request,sender,sendResponse) {
    chrome.storage.sync.get(function (obj) {
        let validLicense =  obj['active'];
        if(validLicense) {
            console.log('valid license')
            var newURL = "https://www.chemistwarehouse.com.au/search/go?w=" + request.searchQuery;
            chrome.tabs.create({ url: newURL });
        }else{
            console.log('invalid license');
        }
    });
    //var newURL = "https://www.chemistwarehouse.com.au/search/go?w=" + request.searchQuery;
    //chrome.tabs.create({ url: newURL });
}

function checkDB(request, sender, sendResponse) {
        chrome.storage.sync.get(function (obj) {
            let validLicense =  obj['active'];
            if(validLicense) {
            var resp = sendResponse;
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    url: obj['server'] + "/partcode?code=" + request.partcode + "&name=" + request.name,
                    success: function (data) {
                        resp({result: data, element: request.element});
                    }
                });
            }else{
                console.log('invalid license');
            }
        });
}

function checkBarcode(request, sender, sendResponse) {
    chrome.storage.sync.get(function (obj) {
        let validLicense =  obj['active'];
        if(validLicense) {
            console.log('valid license');
            var resp = sendResponse;
            $.ajax({
                type: "GET",
                dataType: "json",
                url: obj['server'] + "/barcode?code=" + request.partcode,
                success: function (data) {
                    let newURL = "https://www.chemistwarehouse.com.au/search/go?w=" + data.data[0].TradeName;
                    chrome.tabs.create({ url: newURL });
                    resp({result: data, element: request.element});
                },
                error: function(data) {
                    let newURL = "https://www.chemistwarehouse.com.au/search/go?w=" + request.partcode;
                    chrome.tabs.create({ url: newURL });
                    resp({result: data, element: request.element});
                }
            });
        }else{
            alert('invalid license');
        }

    });
}

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        for (var i = 0; i < details.requestHeaders.length; ++i) {
            if (details.requestHeaders[i].name === 'User-Agent') {
                details.requestHeaders.splice(i, 1);
                break;
            }
        }
        return {requestHeaders: details.requestHeaders};
    },
    {urls: ["<all_urls>"]},
    ["blocking", "requestHeaders"]);