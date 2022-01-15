import Store from 'electron-store';

const CreateGlobalStore = (path: string, options?: any) => {
  return new Store({
    watch: true,
    cwd: path,
    accessPropertiesByDotNotation: true,
    ...options,
  });
};

export default CreateGlobalStore;
