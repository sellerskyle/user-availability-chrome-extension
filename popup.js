//TODO: if tab exists, pull it up instead
const currentTabs = await chrome.tabs.query({});

const tab = currentTabs.find((t) => t.title === "User Availability");
console.log(currentTabs, tab);
if (!!tab) {
  await chrome.tabs.update(tab.id, { active: true });
  await chrome.windows.update(tab.windowId, { focused: true });
} else {
  chrome.tabs.create({ url: "page.html" });
}
