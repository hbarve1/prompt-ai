export type PromptPost = {
  _id: string;
  prompt: string;
  tag: string;
  creator: {
    username: string;
  };
};
