/**
 * @abstract returns ISO date String
 *
 * @return {String}
 */
export const now_ISO = () => (new Date(Date.now())).toISOString();

/**
 * @abstract returns date String
 *
 * @return {String}
 */
export const now_date = () => (new Date(Date.now())).toDateString();
 
/**
 * @abstract returns milliseconds from epoch date
 *
 * @return {String}
 */
export const now_epoch = () => (new Date().getTime());
