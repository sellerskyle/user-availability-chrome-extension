// import { getDevice, updateStatus } from "./device.js";

let device = null;

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason !== "install") {
    return;
  }

  await chrome.alarms.create("set-status-alarm", {
    delayInMinutes: 0.5,
    periodInMinutes: 0.5,
  });
  console.log("created");
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  const name = alarm.name;
  console.log(alarm);
  if (name === "set-status-alarm") {
    console.log("alarm fired");
    clients.matchAll().then((clients) => {
      if (clients && clients.length) {
        clients[0].postMessage({
          type: "message",
          action: "updateDevice",
        });
      }
    });
  }
});
