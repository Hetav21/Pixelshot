import fs from "fs";
import { getSessions, saveSessions } from "./store.js";
import { ipcWebContentsSend } from "../electron-utils/ipc.js";

/**
 * Retrieve all valid screenshot file paths for a given user session.
 * Cleans up non-existent file paths automatically.
 */
export async function getAllValidPaths(username: string): Promise<ApiResponse> {
  if (!username) {
    return {
      success: false,
      message: "Not a valid username",
    };
  }

  const sessions = getSessions();
  const session = sessions[username];

  if (!session) {
    return {
      success: false,
      message: "Session not found",
    };
  }

  const validPaths = session.filePaths.filter(fs.existsSync);

  if (validPaths.length !== session.filePaths.length) {
    session.filePaths = validPaths;
    saveSessions(sessions);
  }

  return {
    success: true,
    message: "Retrieved file paths successfully",
    info: {
      username,
      filePaths: validPaths,
    },
  };
}

/**
 * Add a new screenshot file path to the user's session.
 */
export function addPath(username: string, filePath: string): ApiResponse {
  const sessions = getSessions();
  const session = sessions[username];

  if (!session) {
    return {
      success: false,
      message: "Session not found",
    };
  }

  if (!session.filePaths.includes(filePath)) {
    session.filePaths.push(filePath);
    saveSessions(sessions);
    return {
      success: true,
      message: "File path added successfully",
      info: {
        username,
        filePaths: session.filePaths,
      },
    };
  }

  return {
    success: true,
    message: "File path already exists",
    info: {
      username,
      filePaths: session.filePaths,
    },
  };
}

/**
 * Delete a screenshot file path from the user's session.
 */
export function deletePath(username: string, filePath: string): ApiResponse {
  const sessions = getSessions();
  const session = sessions[username];

  if (!session) {
    return {
      success: false,
      message: "Session not found",
    };
  }

  const initialLength = session.filePaths.length;
  session.filePaths = session.filePaths.filter((path) => path !== filePath);

  if (session.filePaths.length < initialLength) {
    saveSessions(sessions);
    return {
      success: true,
      message: "File path deleted successfully",
      info: {
        username,
        filePaths: session.filePaths,
      },
    };
  }

  return {
    success: false,
    message: "File path not found",
    info: {
      username,
      filePaths: session.filePaths,
    },
  };
}
