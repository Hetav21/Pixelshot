import { useState } from "react";
import { useCounter } from "./hooks/useCounter";
import { FolderOpen, ImageIcon, Timer, Play, StopCircle } from "lucide-react";

function App() {
  const [interval, setInterval] = useState(10);
  const [format, setFormat] = useState<"png" | "jpg">("png");
  const [folderPath, setFolderPath] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);

  const counter = useCounter();

  const handleSelectFolder = async () => {
    const folder = await window.electronAPI.selectFolder();
    if (folder) setFolderPath(folder);
  };

  const handleToggleCapture = () => {
    if (isCapturing) {
      window.electronAPI.stopCapturing();
      setIsCapturing(false);
    } else {
      if (!interval || !format) {
        alert("Please enter a valid interval and format.");
        return;
      }

      const homeDir = window.electronAPI.getHomeDir();
      const folder = folderPath || `${homeDir}/Desktop`;

      window.electronAPI.startCapturing({
        interval,
        folderPath: folder,
        format,
      });
      setIsCapturing(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6 transition-all">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Pixelshot
        </h1>

        {counter !== null && counter > 0 && (
          <div className="text-center text-gray-600 font-medium">
            Capturing in
            <span className="mx-2 font-semibold text-blue-600">{counter}</span>
            seconds
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="interval"
            className="font-semibold text-gray-700 flex items-center gap-2"
          >
            <Timer className="w-4 h-4" /> Interval (seconds)
          </label>
          <input
            type="number"
            id="interval"
            min={1}
            value={interval}
            onChange={(e) => setInterval(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="format"
            className="font-semibold text-gray-700 flex items-center gap-2"
          >
            <ImageIcon className="w-4 h-4" /> Image Format
          </label>
          <select
            id="format"
            value={format}
            onChange={(e) => setFormat(e.target.value as "png" | "jpg")}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="png">PNG</option>
            <option value="jpg">JPEG</option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="folderPath"
            className="font-semibold text-gray-700 flex items-center gap-2"
          >
            <FolderOpen className="w-4 h-4" /> Destination Folder
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="folderPath"
              readOnly
              placeholder="Default: Desktop"
              value={folderPath}
              className="flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-sm focus:outline-none"
            />
            <button
              onClick={handleSelectFolder}
              className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
            >
              Browse
            </button>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <button
            onClick={handleToggleCapture}
            className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg transition
              ${
                isCapturing
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
          >
            {isCapturing ? (
              <>
                <StopCircle className="w-4 h-4" /> Stop Capturing
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Start Capturing
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
