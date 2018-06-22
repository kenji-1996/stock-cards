// Color changing interaction
let openSettings = document.getElementById('openSettings');
openSettings.onclick = function(element) {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('options.html'));
    }
};
/*chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    console.log(tabs);
    //chrome.tabs.executeScript(tabs[0].id, {code: 'document.body.style.backgroundColor = "' + color + '";'});
});*/