import { create } from "zustand";

interface TagState {
  tags: Tag[];
  addTag: (newTag: Tag) => void;
  updateTag: (idx: number, newValue: string) => void;
  deleteTag: (id: string) => void;
}

export const useTagStore = create<TagState>()((set) => ({
  tags: [],
  result: null,

  addTag: (newTag) => {
    set((state) => ({ tags: [...state.tags, newTag] }));
  },

  updateTag: (idx, newValue) => {
    set((state) => {
      let obj = state.tags[idx];
      obj.value = newValue;
      state.tags[idx] = obj;

      return { tags: [...state.tags] };
    });
  },

  deleteTag: (id) => {
    set((state) => ({ tags: [...state.tags.filter((tag) => tag.id !== id)] }));
  },
}));
