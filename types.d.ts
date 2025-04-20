// Ipc event payload
// for main process
type EventPayloadMapping = {
  counterTick: number;
};

type UnsubscribeFunction = () => void;

interface Window {
  electronAPI: {
    subscribeCounter: (
      callback: (stats: number) => void,
    ) => UnsubscribeFunction;
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
