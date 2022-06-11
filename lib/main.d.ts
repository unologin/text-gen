/**
 *
 * @param file file contents
 * @returns text blocks, code blocks
 */
export declare function tokenize(file: string): [string[], [string, boolean][]];
/**
 * @param file file contents
 * @param pwd containing dir of the file
 * @param vars context variables
 * @param importer load function
 * @returns evaluated file
 */
export declare function evalFileContents(file: string, pwd?: string, vars?: object, importer?: (f: string) => string): string;
/**
 * @param filePath file contents
 * @param vars context vars
 * @param importer load function
 * @returns evaluated file
 */
export default function evalFile(filePath: string, vars?: object, importer?: (f: string) => string): string;
