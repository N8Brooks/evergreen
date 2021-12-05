/** Matches URLs between 4 and 2048 character inclusive with no non-escaped characters */
const URI_PATTERN = /^[\w;,/\?:@&=\+\$\-\.!~\*'\(\)#]{4,2048}$/u;

/** Return if a url is valid using several heuristics */
export const validUrl = (url: unknown): boolean => {
  if (typeof url !== "string") {
    return false;
  }
  if (!URI_PATTERN.test(url)) {
    return false;
  }
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
