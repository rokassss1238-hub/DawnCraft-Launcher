const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 1120, height: 760, minWidth: 900, minHeight: 620,
    backgroundColor: '#071426', autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, nodeIntegration: false, sandbox: true
    }
  });
  win.loadFile(path.join(__dirname, 'index.html'));
}
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

const javaCandidates = [
  path.join(process.env['ProgramFiles'] || 'C:\\Program Files', 'Minecraft Launcher', 'MinecraftLauncher.exe'),
  path.join(process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)', 'Minecraft Launcher', 'MinecraftLauncher.exe')
];
function findJavaLauncher() { return javaCandidates.find(p => fs.existsSync(p)) || null; }

ipcMain.handle('open-url', async (_event, url) => {
  const allowed = ['https://www.minecraft.net/', 'https://www.minecraft.net/en-us/download', 'https://www.xbox.com/', 'ms-windows-store://'];
  if (typeof url !== 'string' || !allowed.some(prefix => url.startsWith(prefix))) throw new Error('Nuoroda neleidžiama.');
  await shell.openExternal(url); return true;
});
ipcMain.handle('launch-java', async () => {
  const launcher = findJavaLauncher();
  if (launcher) {
    const child = spawn(launcher, [], { detached: true, stdio: 'ignore' }); child.unref();
    return { ok: true, message: 'Atidarytas oficialus Minecraft Launcher.' };
  }
  await shell.openExternal('https://www.minecraft.net/en-us/download');
  return { ok: false, needsInstall: true, message: 'Oficialus Minecraft Launcher nerastas. Atidarytas atsisiuntimo puslapis.' };
});
ipcMain.handle('launch-bedrock', async () => new Promise((resolve) => {
  const child = spawn('cmd.exe', ['/c', 'start', '', 'minecraft://'], { detached: true, stdio: 'ignore', windowsHide: true });
  child.on('error', async () => {
    await shell.openExternal('https://www.xbox.com/games/store/minecraft-for-windows/9nblggh2jhxj');
    resolve({ ok: false, needsInstall: true, message: 'Minecraft for Windows nerastas arba neįdiegtas. Atidarytas oficialus puslapis.' });
  });
  child.on('spawn', () => { child.unref(); resolve({ ok: true, message: 'Išsiųsta Minecraft for Windows paleidimo užklausa.' }); });
}));