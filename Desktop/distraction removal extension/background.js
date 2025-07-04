chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeContent") {
    console.log("Received request:", request);
    console.log("Sender info:", sender);
    console.log("Simulating GPT API response...");

    const content = (request.content || "").toLowerCase();
    let reply;
    let isDistraction = false;

    if (sender && sender.tab && sender.tab.url) {
      const url = sender.tab.url.toLowerCase();
      if (
        url.includes("facebook.com") ||
        url.includes("instagram.com") ||
        url.includes("youtube.com") ||
        url.includes("reddit.com") ||
        url.includes("twitter.com") ||
        url.includes("flipkart.com") ||
        url.includes("myntra.com") ||
        url.includes("yournewsite.com")
      ) {
        isDistraction = true;
      }
    }

    if (isDistraction) {
      reply = "Yes";
    } else {
      reply = "No";
    }

    console.log("Simulated GPT Reply:", reply);

    if (reply.includes("Yes")) {
      console.log("Distraction detected! Sending message to content script...");
      if (sender && sender.tab && sender.tab.id) {
        chrome.tabs.sendMessage(sender.tab.id, { action: "showWarning" });
      } else {
        // Fallback: get the active tab in the current window
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          console.log("tabs from chrome.tabs.query:", tabs);
          if (Array.isArray(tabs) && tabs.length > 0 && tabs[0] && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "showWarning" });
          } else {
            console.warn("No active tab found. Cannot send message.");
          }
        });
      }
    } else {
      console.log("No distraction detected.");
    }
  } else if (request.action === "closeTab") {
    if (sender && sender.tab && sender.tab.id) {
      chrome.tabs.remove(sender.tab.id);
    }
  } else {
    console.warn("Invalid message or missing content:", request);
  }
});
