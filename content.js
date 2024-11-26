let timeout = null;
document.addEventListener('selectionchange', function() {
    clearTimeout(timeout);
    timeout = setTimeout(function() {
        var selectedText = window.getSelection().toString();
        if (selectedText.length > 0) {
            console.log("Selected text: " + selectedText);
            chrome.runtime.sendMessage({action: "searchText", text: selectedText}, function(response) {
                alert(response.answer);
            });
        }
    }, 500); // 延时500毫秒
});
