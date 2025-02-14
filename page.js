let characteristic = null;

let options = {
  filters: [{ services: ["4fafc201-1fb5-459e-8fcc-c5c9c331914b"] }],
};

document.querySelector("#connection").onclick = () => {
  if (!characteristic) {
    navigator.bluetooth
      .requestDevice(options)
      .then(async (incoming) => {
        let device = incoming;
        let server = await device.gatt.connect();
        let service = await server.getPrimaryService(
          "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
        );
        characteristic = await service.getCharacteristic(
          "beb5483e-36e1-4688-b7f5-ea07361b26a8"
        );

        document.querySelector(
          "#connection"
        ).textContent = `Disconnect from ${incoming.name}`;
        document.querySelector("#status").style.backgroundColor = "black";
        console.log(document.querySelector("#status"));
      })
      .catch((error) => console.error(`Something went wrong. ${error}`));
  } else {
    document.querySelector("#connection").textContent = "Connect";
    document.querySelector("#status").style.backgroundColor = "black";
    characteristic.service.device.gatt.disconnect();
  }
};

document.querySelector("#write").onclick = async () => {
  await updateStatus();
};

navigator.serviceWorker.addEventListener("message", async (event) => {
  if (event.data.action === "updateDevice") {
    console.log("callback hit");
    await updateStatus();
  }
});

const updateStatus = async () => {
  if (!!characteristic) {
    const currentTabs = await chrome.tabs.query({});

    const isCurrentlyInMeeting =
      currentTabs?.some(
        (t) => t.url.includes("meet.google.com") && t.title.includes("Meet -")
      ) ?? false;

    document.querySelector("#status").style.backgroundColor =
      isCurrentlyInMeeting ? "red" : "green";

    const val = new Uint8Array(1);
    val[0] = isCurrentlyInMeeting ? 1 : 0;
    const response = await characteristic.writeValueWithResponse(val.buffer);
    console.log(response);
  }
};
