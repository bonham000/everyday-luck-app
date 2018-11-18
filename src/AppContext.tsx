import React from "react";

export interface Note {
  title: string;
  content: string;
  dateCreated: string;
}

export interface AppContextShape {
  notes: ReadonlyArray<Note>;
  handleAddNote: (note: Note) => void;
  handleEditNote: (note: Note, prevDateString: string) => void;
  handleDeleteNote: (noteDate: string) => void;
  handleResetName: () => void;
  handleClearNotes: () => void;
}

const AppContext = React.createContext({
  notes: [] as ReadonlyArray<Note>,
  handleAddNote: (note: Note) => {
    return;
  },
  handleEditNote: (note: Note, prevDateString: string) => {
    return;
  },
  handleDeleteNote: (noteDate: string) => {
    return;
  },
  handleResetName: () => {
    return;
  },
  handleClearNotes: () => {
    return;
  },
});

export default AppContext;
