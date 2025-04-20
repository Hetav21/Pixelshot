import Store from "electron-store";
import { comparePasswords, hashPassword } from "../lib/passwords.js";

// Define schema for the *values* inside the `sessions` object
const store = new Store<{ sessions: Record<string, Session> }>({
  defaults: {
    sessions: {},
  },
});

function getSessions(): Record<string, Session> {
  return store.get("sessions", {});
}

function saveSessions(sessions: Record<string, Session>): void {
  store.set("sessions", sessions);
}

export async function signUp(
  username: string,
  password: string,
): Promise<ApiResponse> {
  try {
    if (!username || !password) {
      return {
        success: false,
        message: "Username and password are required.",
      };
    }

    const filePaths: string[] = [];
    const sessions = getSessions();

    if (sessions[username]) {
      return {
        success: false,
        message: "Username already exists",
      };
    }

    const hashedPassword = await hashPassword(password);

    console.log(password, hashedPassword);

    sessions[username] = {
      username,
      password: hashedPassword,
      filePaths,
    };
    saveSessions(sessions);

    return {
      success: true,
      message: "Session created successfully",
      info: {
        username,
        filePaths,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred during session creation: " + error,
    };
  }
}

export async function signIn(
  username: string,
  password: string,
): Promise<ApiResponse> {
  try {
    if (!username || !password) {
      return {
        success: false,
        message: "Username and password are required.",
      };
    }

    const sessions = getSessions();
    const session = sessions[username];

    if (!session) {
      return {
        success: false,
        message: "Username does not exist",
      };
    }

    const isPasswordCorrect = await comparePasswords(
      password,
      session.password,
    );

    if (!isPasswordCorrect) {
      return {
        success: false,
        message: "Incorrect password",
      };
    }

    return {
      success: true,
      message: "Login successful",
      info: {
        username: session.username,
        filePaths: session.filePaths,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred during login: " + error,
    };
  }
}
