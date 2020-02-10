export type KioApi = {
    submitResult: (result: {}) => void;
    getResource: (id: string) => HTMLElement; //TODO is it always an html element?
};

export type KioTaskSettings = { level: string };