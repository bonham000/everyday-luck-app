import { AsyncStorage } from "react-native";
import { Note } from "./AppContext";

class StorageModule {
  USERNAME_KEY = "USERNAME";
  NOTES_KEY = "NOTES_KEY";

  getUsername = async () => {
    const username = await AsyncStorage.getItem(this.USERNAME_KEY);
    return username || "";
  };

  setUsername = async (username: string) => {
    await AsyncStorage.setItem(this.USERNAME_KEY, username);
  };

  getSavedNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem(this.NOTES_KEY);
      if (!savedNotes) {
        return [];
      } else {
        return JSON.parse(savedNotes);
      }
    } catch (err) {
      return [];
    }
  };

  persistNotes = async (notes: ReadonlyArray<Note>) => {
    await AsyncStorage.setItem(this.NOTES_KEY, JSON.stringify(notes));
  };
}

export default new StorageModule();
