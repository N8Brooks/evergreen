/** The key used when setting or getting the cookie */
export const COOKIE_USER_NAME = "user-name";

/** Name pattern for users and topics */
export const NAME_PATTERN = /^\w{1,32}$/;

/** Matches URLs between 4 and 2048 character inclusive with no non-escaped characters */
export const URI_PATTERN = /^[\w;,/\?:@\&=\+\$\-\.!~\*'\(\)#]{4,2048}$/;
