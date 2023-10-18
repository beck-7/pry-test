import axios from "axios";
import { create } from "zustand";

interface TagState {
  tags: ITag[];
  selectData: ISelectData[];
  addTag: (newTag: ITag) => void;
  updateTag: (idx: number, newValue: string) => void;
  deleteTag: (id: string) => void;
  fetchData: () => void;
}

export const useTagStore = create<TagState>()((set) => ({
  tags: [],
  selectData: [],

  addTag: (newTag) => {
    set((state) => ({ tags: [...state.tags, newTag] }));
  },

  updateTag: (idx, newValue) => {
    set((state) => {
      let obj = state.tags[idx];
      obj.name = newValue;
      state.tags[idx] = obj;

      return { tags: [...state.tags] };
    });
  },

  deleteTag: (id) => {
    set((state) => ({ tags: [...state.tags.filter((tag) => tag.id !== id)] }));
  },

  fetchData: async () => {
    try {
      const res = await axios.get(
        "https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete"
      );
      set(() => ({ selectData: res.data }));
      return res.data;
    } catch (err) {
      console.error(err);
    }
  },
}));
