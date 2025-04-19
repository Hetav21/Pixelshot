import { useState } from "react";

function App() {
  const [interval, setInterval] = useState(10);
  const [format, setFormat] = useState<"png" | "jpg">("png");
  const [folderPath, setFolderPath] = useState("");

  const handleSelectFolder = async () => {
    const folder = await window.electronAPI.selectFolder();
    if (folder) setFolderPath(folder);
  };

  const handleStart = () => {
    if (!interval || !format) {
      alert("Please enter a valid interval and format.");
      return;
    }

    const homeDir = window.electronAPI.getHomeDir();
    const folder = folderPath || `${homeDir}/Desktop`;
    window.electronAPI.startCapturing({ interval, folderPath: folder, format });
  };

  const handleStop = () => {
    window.electronAPI.stopCapturing();
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-center mb-6">
        📸 Screenshot App
      </h2>

      <div className="mb-5">
        <label className="block mb-2 font-medium" htmlFor="interval">
          Interval (seconds):
        </label>
        <input
          type="number"
          id="interval"
          value={interval}
          min={1}
          onChange={(e) => setInterval(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-5">
        <label className="block mb-2 font-medium" htmlFor="format">
          Image Format:
        </label>
        <select
          id="format"
          value={format}
          onChange={(e) => setFormat(e.target.value as "png" | "jpg")}
          className="w-full p-2 border rounded"
        >
          <option value="png">PNG</option>
          <option value="jpg">JPEG</option>
        </select>
      </div>

      <div className="mb-5">
        <label className="block mb-2 font-medium" htmlFor="folderPath">
          Destination Folder:
        </label>
        <input
          type="text"
          id="folderPath"
          readOnly
          value={folderPath}
          placeholder="Default: Desktop"
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={handleSelectFolder}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Browse
        </button>
      </div>

      <div className="text-center">
        <button
          onClick={handleStart}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
        >
          ▶ Start Capturing
        </button>
        <button
          onClick={handleStop}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          ⏹ Stop
        </button>
      </div>
    </div>
  );
}

export default App;
