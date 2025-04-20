import Cookies from "js-cookie";
import { FolderOpen, ImageIcon, Play, StopCircle, Timer } from "lucide-react";
import { useState } from "react";

export function Navbar({
  isCapturing,
  setIsCapturing,
  interval,
  setInterval,
}: {
  isCapturing: boolean;
  setIsCapturing: React.Dispatch<React.SetStateAction<boolean>>;
  interval: number;
  setInterval: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [format, setFormat] = useState<"png" | "jpg">("png");
  const [folderPath, setFolderPath] = useState("");

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

      const username = Cookies.get("username")!;
      const homeDir = window.electronAPI.getHomeDir();
      const folder = folderPath || `${homeDir}/Desktop`;

      window.electronAPI.startCapturing({
        username,
        interval,
        folderPath: folder,
        format,
      });
      setIsCapturing(true);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-md">
      <div className="mx-auto px-4 py-4">
        {/* Flex container that switches layout based on screen size */}
        <div className="flex flex-col lg:flex-row md:items-center md:justify-between gap-6">
          {/* Logo */}
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Pixelshot
            </h1>
          </div>

          {/* Middle controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
            {/* Interval Input */}
            <div>
              <label
                htmlFor="interval"
                className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1"
              >
                <Timer className="w-4 h-4" /> Interval (seconds)
              </label>
              <input
                id="interval"
                type="number"
                min={1}
                value={interval}
                onChange={(e) => setInterval(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Format Select */}
            <div>
              <label
                htmlFor="format"
                className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1"
              >
                <ImageIcon className="w-4 h-4" /> Image Format
              </label>
              <select
                id="format"
                value={format}
                onChange={(e) => setFormat(e.target.value as "png" | "jpg")}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="png">PNG</option>
                <option value="jpg">JPEG</option>
              </select>
            </div>

            {/* Folder Select */}
            <div>
              <label
                htmlFor="folderPath"
                className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1"
              >
                <FolderOpen className="w-4 h-4" /> Destination Folder
              </label>
              <div className="flex gap-2">
                <input
                  id="folderPath"
                  type="text"
                  readOnly
                  placeholder="Default: Desktop"
                  value={folderPath}
                  className="flex-1 px-3 py-2 border rounded-lg bg-gray-100 text-sm"
                />
                <button
                  onClick={handleSelectFolder}
                  className="px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition"
                >
                  Browse
                </button>
              </div>
            </div>
          </div>

          {/* Start/Stop Button */}
          <div className="flex justify-center md:justify-end">
            <button
              onClick={handleToggleCapture}
              className={`flex items-center gap-2 px-6 py-2 font-semibold rounded-lg text-white transition
                ${isCapturing ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
              `}
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
    </nav>
  );
}
