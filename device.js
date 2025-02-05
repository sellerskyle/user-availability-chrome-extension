// let instance;

// let device = null;

// class Device {
//   /**
//    *
//    */
//   constructor() {
//     if (instance) {
//       throw new Error("Device already exists!");
//     }

//     instance = this;
//   }

//   getDevice() {
//     console.log(instance, device);
//     return device;
//   }

//   setDevice(device) {
//     console.log(instance, device);
//     device = device;
//     console.log(instance, device);
//   }
// }

// let deviceInstance = Object.freeze(new Device());

let device = null;

export const updateDevice = (newDev) => {
  device = newDev;
};

export const getDevice = () => device;

export const updateStatus = async () => {
  const dev = getDevice();
  if (!!dev) {
    const server = await dev.gatt.connect();
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
