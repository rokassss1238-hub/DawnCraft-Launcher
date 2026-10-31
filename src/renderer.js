const status = document.getElementById('status');
const setStatus = (message) => { status.textContent = message; };
document.getElementById('java').addEventListener('click', async () => {
  setStatus('Ieškoma oficialaus Minecraft Launcher...');
  try { const r = await window.dawncraft.launchJava(); setStatus(r.message); }
  catch (e) { setStatus('Nepavyko atidaryti Java Launcher: ' + e.message); }
});
document.getElementById('bedrock').addEventListener('click', async () => {
  setStatus('Bandoma paleisti Minecraft for Windows...');
  try { const r = await window.dawncraft.launchBedrock(); setStatus(r.message); }
  catch (e) { setStatus('Nepavyko paleisti Bedrock: ' + e.message); }
});
document.getElementById('javaInstall').addEventListener('click', async () => {
  await window.dawncraft.openUrl('https://www.minecraft.net/en-us/download');
  setStatus('Atidarytas oficialus Minecraft atsisiuntimo puslapis.');
});
document.getElementById('bedrockInstall').addEventListener('click', async () => {
  await window.dawncraft.openUrl('https://www.xbox.com/games/store/minecraft-for-windows/9nblggh2jhxj');
  setStatus('Atidarytas oficialus Minecraft for Windows puslapis.');
});
document.getElementById('official').addEventListener('click', async () => window.dawncraft.openUrl('https://www.minecraft.net/'));
const offline = document.getElementById('offline');
offline.checked = localStorage.getItem('dawncraft-local-profile') === 'true';
offline.addEventListener('change', () => {
  localStorage.setItem('dawncraft-local-profile', String(offline.checked));
  setStatus(offline.checked ? 'Vietinio profilio nustatymas įjungtas.' : 'Vietinio profilio nustatymas išjungtas.');
});