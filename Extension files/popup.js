function runConsoleScript() {
    console.log("Starting ANS PDF extractor...");

    // Directly target the unique scroller container
    const scroller = document.querySelector('.mdc-tab-scroller__scroll-content');

    if (!scroller) {
        alert("Error: Could not find the tab scroller. Make sure you are viewing the exam answers.");
        return;
    }

    // Look for any button inside it that holds the data-url for the PDF
    const tabWithUrl = scroller.querySelector('button[data-url]');

    if (tabWithUrl) {
        const targetUrl = tabWithUrl.getAttribute('data-url');
        console.log("Found URL:", targetUrl);
        
        // Extract filename dynamically from the URL query params
        let fileName = "exam_result.pdf";
        try {
            const urlObj = new URL(targetUrl);
            if (urlObj.searchParams.has('filename')) {
                fileName = urlObj.searchParams.get('filename'); 
            }
        } catch (e) {
            console.warn("Could not parse URL for filename. Using default.");
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
        alert("Failed to find the specific tab with the download URL.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('downloadBtn');
    const statusEl = document.getElementById('status');

    downloadBtn.addEventListener('click', async () => {
        statusEl.textContent = 'Running script...';
        statusEl.className = '';

        try {
            // Get the active tab in the current window
            let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            // Ensure we are only running this on ans.app
            if (tab.url && !tab.url.includes("ans.app")) {
                statusEl.textContent = 'Error: Navigate to ans.app first.';
                statusEl.className = 'error';
                return;
            }

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