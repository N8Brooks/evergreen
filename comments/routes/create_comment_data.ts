import { superstruct } from "../deps.ts";

const { size, object, string } = superstruct;

export const CreateCommentData = object({
  text: size(string(), 0, 1024),
});
