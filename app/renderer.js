const intervalInput = document.getElementById("interval");
const formatSelect = document.getElementById("format");
const folderInput = document.getElementById("folderPath");
const selectFolderBtn = document.getElementById("selectFolder");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

const os = require("os");

selectFolderBtn.addEventListener("click", async () => {
  const folder = await window.electronAPI.selectFolder();
  if (folder) folderInput.value = folder;
});

startBtn.addEventListener("click", () => {
  const interval = parseInt(intervalInput.value, 10);
  const format = formatSelect.value;
  const folderPath = folderInput.value || `${os.homedir()}/Desktop`;

  if (!interval || !format) {
    alert("Please enter a valid interval and format.");
    return;
  }

  window.electronAPI.startCapturing({ interval, folderPath, format });
});

stopBtn.addEventListener("click", () => {
  window.electronAPI.stopCapturing();
});
