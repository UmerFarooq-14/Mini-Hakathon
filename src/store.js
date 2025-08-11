    import { create } from 'zustand';
    import { persist } from 'zustand/middleware';

    const useAppStore = create(
      persist(
        (set) => ({
          userId:"",
          setUserId: (id) => set(() => ({userId:id})),
        }),
        {
          name: 'app-storage', // A unique name for your persisted store
        }
      )
    );

    export default  useAppStore