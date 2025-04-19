interface Window {
  electronAPI: {
    selectFolder: () => Promise<string | null>;
    startCapturing: (options: {
      interval: number;
      folderPath: string;
      format: "png" | "jpg";
    }) => void;
    stopCapturing: () => void;
    getHomeDir: () => string;
  };
}
