/**
 * @abstract returns date String
 *
 * @return {String}
 */
export const now = () => (new Date(Date.now())).toISOString();
 