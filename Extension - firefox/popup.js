function runConsoleScript() {
    console.log("Starting ANS PDF extractor...");

    
    const activeTab = document.querySelector('.mdc-tab-scroller__scroll-content button[data-url]');

    if (!activeTab) {
        alert("Error: Could not find the tab containing the PDF URL. Make sure you are viewing the exam answers.");
        return;
    }

    const targetUrl = activeTab.getAttribute('data-url');

    if (targetUrl) {
        console.log("Downloading from:", targetUrl);
        
        let fileName = "exam_result.pdf";
        try {
            const urlObj = new URL(targetUrl);
            if (urlObj.searchParams.has('filename')) {
                fileName = urlObj.searchParams.get('filename'); 
            } else {
                const pathSegments = urlObj.pathname.split('/');
                const lastSegment = pathSegments[pathSegments.length - 1];
                if (lastSegment && lastSegment.endsWith('.pdf')) {
                    fileName = decodeURIComponent(lastSegment);
                }
            }
        } catch (e) {
            console.warn("Could not parse URL for filename. Using default name.");
        }

        const a = document.createElement('a');
        a.href = targetUrl;
        a.target = '_blank'; 
        a.download = fileName;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        console.log("Download triggered successfully!");
    } else {
        alert("Failed to extract the download URL from the tab.");
    }
}

// New function to check if the required element exists on the page
function checkPageValidity() {
    const validButton = document.querySelector('.mdc-tab-scroller__scroll-content button[data-url]');
    return !!validButton; // Returns true if it exists, false otherwise
}

document.addEventListener('DOMContentLoaded', async () => {
    const downloadBtn = document.getElementById('downloadBtn');
    const statusEl = document.getElementById('status');

    try {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // Ensure we are only running this on ans.app
        if (!tab.url || !tab.url.includes("ans.app")) {
            downloadBtn.disabled = true;
            downloadBtn.textContent = 'Open ans.app to download';
            return;
        }

        // Instantly check the page for the correct button
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: checkPageValidity
        }, (results) => {
            if (results && results[0] && results[0].result) {
                // The correct element was found!
                downloadBtn.disabled = false;
                downloadBtn.textContent = 'Download PDF';
            } else {
                // The element is missing
                downloadBtn.disabled = true;
                downloadBtn.textContent = 'Open an exam to download';
            }
        });
    } catch (error) {
        statusEl.textContent = 'Extension error: ' + error.message;
        statusEl.className = 'error';
    }

    downloadBtn.addEventListener('click', async () => {
        statusEl.textContent = 'Running script...';
        statusEl.className = '';

        try {
            let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: runConsoleScript
            }, () => {
                statusEl.textContent = 'Script executed! Check your tabs/downloads.';
                statusEl.className = 'success';
            });
        } catch (error) {
            statusEl.textContent = 'Unexpected error: ' + error.message;
            statusEl.className = 'error';
        }
    });
});