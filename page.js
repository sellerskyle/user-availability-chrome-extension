let device = null;

let options = {
  filters: [{ services: ["4fafc201-1fb5-459e-8fcc-c5c9c331914b"] }],
};

document.querySelector("button").onclick = () =>
  navigator.bluetooth
    .requestDevice(options)
    .then((incoming) => {
      //   device.setDevice(incoming);
      //   window.device = incoming;
      //   updateDevice(incoming);
      device = incoming;

      console.log(`Name: ${incoming.name}`);
      // Do something with the device.
    })
    .catch((error) => console.error(`Something went wrong. ${error}`));

document.querySelector("#write").onclick = async () => {
  //   const dev = device;
  //   const dev = device.getDevice();
  console.log(dev);
  await updateStatus();
};

navigator.serviceWorker.addEventListener("message", async (event) => {
  if (event.data.action === "updateDevice") {
    console.log("callback hit");
    await updateStatus();
  }
});

const updateStatus = async () => {
  if (!!device) {
    const server = await device.gatt.connect();
    console.log(server);
    const service = await server.getPrimaryService(
      "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
    );
    console.log(service);
    const characteristic = await service.getCharacteristic(
      "beb5483e-36e1-4688-b7f5-ea07361b26a8"
    );
    console.log(characteristic);
    const currentTabs = await chrome.tabs.query({});

    const isCurrentlyInMeeting =
      currentTabs?.some(
        (t) => t.url.includes("meet.google.com") && t.title.includes("Meet -")
      ) ?? false;

    const val = new Uint8Array(1);
    val[0] = isCurrentlyInMeeting ? 1 : 0;
    const response = await characteristic.writeValueWithResponse(val.buffer);
    console.log(response);
  }
};
