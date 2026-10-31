const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('dawncraft', {
  launchJava: () => ipcRenderer.invoke('launch-java'),
  launchBedrock: () => ipcRenderer.invoke('launch-bedrock'),
  openUrl: (url) => ipcRenderer.invoke('open-url', url)
});