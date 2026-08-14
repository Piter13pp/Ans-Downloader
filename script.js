(function downloadAnsPdf() {
    console.log("Starting ANS PDF extractor...");

    // 1. Find the element containing the file name
    const fileNameEl = document.getElementById('fileNameField');
    if (!fileNameEl) {
        console.error("Error: Could not find the element with id 'fileNameField'. Make sure you are on the correct tab.");
        return;
    }
    
    const fileName = fileNameEl.innerText.trim();
    console.log(`Target file name extracted: ${fileName}`);

    // 2. Find all tabs in the scroller
    const tabs = document.querySelectorAll('.mdc-tab-scroller__scroll-content .mdc-tab[data-url]');
    let targetUrl = null;

    for (const tab of tabs) {
        const dataUrl = tab.getAttribute('data-url');
        // Check if this tab's URL contains our target file name
        if (dataUrl && dataUrl.includes(fileName)) {
            targetUrl = dataUrl;
            console.log("Match found! Extracted URL.");
            break;
        }
    }

    // Fallback: If for some reason the filename match fails, just grab the active tab's URL
    if (!targetUrl) {
        console.warn("Could not find a URL matching the file name. Trying fallback to the active tab...");
        const activeTab = document.querySelector('.mdc-tab--active[data-url]');
        if (activeTab) {
            targetUrl = activeTab.getAttribute('data-url');
        }
    }

    // 3. Trigger the download
    if (targetUrl) {
        console.log("Downloading from:", targetUrl);
        // Create a temporary anchor element to trigger a clean download/new tab open
        const a = document.createElement('a');
        a.href = targetUrl;
        a.target = '_blank'; // Opens in a new tab, prompting the PDF download/viewer
        a.download = fileName || "exam_result.pdf";
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        console.log("Download triggered successfully!");
    } else {
        console.error("Failed to extract the download URL. The page structure might have changed.");
    }
})();