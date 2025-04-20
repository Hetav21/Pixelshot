// Ipc event payload
// for main process
type EventPayloadMapping = {
  counterTick: number;
  paths: ApiResponse;
  getPaths: Promise<ApiResponse>;
  signUp: Promise<ApiResponse>;
  signIn: Promise<ApiResponse>;
};

type UnsubscribeFunction = () => void;

interface Window {
  electronAPI: {
    subscribeCounter: (
      callback: (stats: number) => void,
    ) => UnsubscribeFunction;
    getPaths: (params: {
      username: Session["username"];
    }) => Promise<ApiResponse>;
    selectFolder: () => Promise<string | null>;
    startCapturing: (options: {
      username: Session["username"];
      interval: number;
      folderPath: string;
      format: "png" | "jpg";
    }) => void;
    stopCapturing: () => void;
    getHomeDir: () => string;
    signIn: (params: {
      username: Session["username"];
      password: Session["password"];
    }) => Promise<ApiResponse>;
    signUp: (params: {
      username: Session["username"];
      password: Session["password"];
    }) => Promise<ApiResponse>;
  };
}

type ApiResponse = {
  success: boolean;
  message: string;
  info?: {
    username?: Session["username"];
    filePaths?: Session["filePaths"];
  };
};

interface Session {
  username: string;
  password: string;
  filePaths: string[];
}
