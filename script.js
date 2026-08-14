(function downloadAnsPdf() {
    console.log("Starting ANS PDF extractor...");

    // Find the active tab inside the scroller that has a data-url attribute
    const activeTab = document.querySelector('.mdc-tab-scroller__scroll-content .mdc-tab--active[data-url]') || 
                      document.querySelector('.mdc-tab-scroller__scroll-content .mdc-tab[data-url]');

    if (!activeTab) {
        console.error("Error: Could not find the tab containing the PDF URL. Make sure you are viewing the exam answers.");
        return;
    }

    const targetUrl = activeTab.getAttribute('data-url');

    if (targetUrl) {
        console.log("Downloading from:", targetUrl);
        
        // Try to extract a meaningful filename from the URL, fallback to default
        let fileName = "exam_result.pdf";
        try {
            const urlObj = new URL(targetUrl);
            if (urlObj.searchParams.has('filename')) {
                // Gets '19309812.pdf' from '?filename=19309812.pdf'
                fileName = urlObj.searchParams.get('filename'); 
            } else {
                // Fallback: extract the raw filename from the path (e.g. '20c779.pdf')
                const pathSegments = urlObj.pathname.split('/');
                const lastSegment = pathSegments[pathSegments.length - 1];
                if (lastSegment && lastSegment.endsWith('.pdf')) {
                    fileName = decodeURIComponent(lastSegment);
                }
            }
        } catch (e) {
            console.warn("Could not parse URL for filename. Using default name.");
        }

        // Create a temporary anchor element to trigger the download
        const a = document.createElement('a');
        a.href = targetUrl;
        a.target = '_blank'; 
        a.download = fileName;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        console.log("Download triggered successfully!");
    } else {
        console.error("Failed to extract the download URL from the tab.");
    }
})();