import Store from "electron-store";

const store = new Store<{ sessions: Record<string, Session> }>({
  defaults: {
    sessions: {},
  },
});

export function getSessions(): Record<string, Session> {
  return store.get("sessions", {});
}

export function saveSessions(sessions: Record<string, Session>): void {
  store.set("sessions", sessions);
}
