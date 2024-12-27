import { defineStore } from 'pinia';

interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
}

interface Note {
    id: string;
    title: string;
    todos: TodoItem[];
}

type ActionType = 'ADD' | 'UPDATE' | 'DELETE';

interface HistoryAction {
    type: ActionType;
    noteId: string;
    previousState: Note | null;
    newState: Note | null;
    timestamp: number;
}

export const useNotesStore = defineStore('notes', {
    state: () => ({
        notes: [] as Note[],
        history: [] as HistoryAction[],
        currentHistoryIndex: -1,
    }),
    persist: true,

    actions: {
        addNote(note: Omit<Note, 'id'>) {
            const newNote: Note = {
                id: Date.now().toString(),
                ...note,
            };

            this.addToHistory({
                type: 'ADD',
                noteId: newNote.id,
                previousState: null,
                newState: newNote,
                timestamp: Date.now(),
            });

            this.notes.push(newNote);
        },

        updateNote(noteId: string, updatedNote: Partial<Note>) {
            const index = this.notes.findIndex((note) => note.id === noteId);
            if (index !== -1) {
                const previousState = { ...this.notes[index] };
                const newState = { ...this.notes[index], ...updatedNote };

                this.addToHistory({
                    type: 'UPDATE',
                    noteId,
                    previousState,
                    newState,
                    timestamp: Date.now(),
                });

                this.notes[index] = newState;
            }
        },

        deleteNote(noteId: string) {
            const index = this.notes.findIndex((note) => note.id === noteId);
            if (index !== -1) {
                const previousState = { ...this.notes[index] };

                this.addToHistory({
                    type: 'DELETE',
                    noteId,
                    previousState,
                    newState: null,
                    timestamp: Date.now(),
                });

                this.notes.splice(index, 1);
            }
        },

        addTodo(noteId: string, todoText: string) {
            const note = this.notes.find((note) => note.id === noteId);
            if (note) {
                const previousState = { ...note };
                const newTodo: TodoItem = {
                    id: Date.now().toString(),
                    text: todoText,
                    completed: false,
                };
                note.todos.push(newTodo);
                this.updateNote(noteId, note);
            }
        },

        toggleTodo(noteId: string, todoId: string) {
            const note = this.notes.find((note) => note.id === noteId);
            if (note) {
                const todo = note.todos.find((todo) => todo.id === todoId);
                if (todo) {
                    const previousState = { ...note };
                    todo.completed = !todo.completed;
                    this.updateNote(noteId, note);
                }
            }
        },

        addToHistory(action: HistoryAction) {
            this.history = this.history.slice(0, this.currentHistoryIndex + 1);
            this.history.push(action);
            this.currentHistoryIndex++;
        },

        undo() {
            if (this.currentHistoryIndex >= 0) {
                const action = this.history[this.currentHistoryIndex];

                switch (action.type) {
                    case 'ADD':
                        this.notes = this.notes.filter(
                            (note) => note.id !== action.noteId
                        );
                        break;

                    case 'UPDATE':
                        if (action.previousState) {
                            const index = this.notes.findIndex(
                                (note) => note.id === action.noteId
                            );
                            if (index !== -1) {
                                this.notes[index] = { ...action.previousState };
                            }
                        }
                        break;

                    case 'DELETE':
                        if (action.previousState) {
                            this.notes.push({ ...action.previousState });
                        }
                        break;
                }

                this.currentHistoryIndex--;
            }
        },

        redo() {
            if (this.currentHistoryIndex < this.history.length - 1) {
                this.currentHistoryIndex++;
                const action = this.history[this.currentHistoryIndex];

                switch (action.type) {
                    case 'ADD':
                        if (action.newState) {
                            this.notes.push({ ...action.newState });
                        }
                        break;

                    case 'UPDATE':
                        if (action.newState) {
                            const index = this.notes.findIndex(
                                (note) => note.id === action.noteId
                            );
                            if (index !== -1) {
                                this.notes[index] = { ...action.newState };
                            }
                        }
                        break;

                    case 'DELETE':
                        this.notes = this.notes.filter(
                            (note) => note.id !== action.noteId
                        );
                        break;
                }
            }
        },
    },
});
