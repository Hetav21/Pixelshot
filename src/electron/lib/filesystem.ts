import fs from "fs";

export function checkIfFileExists(path: string) {
  if (fs.existsSync(path)) return true;
  return false;
}

export function getContentFromFile(path: string) {
  // Checking if file exists at the given path
  if (checkIfFileExists(path)) {
    console.info("Loading content from file");

    try {
      const content = fs.readFileSync(path, "utf8");
      return content;
    } catch (err) {
      console.warn("Failed loading content");
      console.info("ERROR: \n", err);
      return null;
    }
  } else {
    console.warn("No file found at ", path);
  }

  return null;
}

export function saveFile(content: unknown, path: string) {
  try {
    fs.writeFileSync(path, JSON.stringify(content, null, 2));
    console.debug("DEBUG: \n", "content: \n", content);

    console.log("Content saved to file: ", path);
  } catch (err) {
    console.warn("Failed saving to file");
    console.info("ERROR: \n", err);
  }
}

export function deleteFile(path: string) {
  if (checkIfFileExists(path)) {
    console.log("Deleting file at ", path);
    try {
      fs.unlinkSync(path);
      console.log("File deleted");
    } catch (err) {
      console.warn("Failed deleting file at ", path);
      console.info("ERROR: ", err);
    }
  } else {
    console.warn("Delete failed as no file found at: ", path);
  }
}
