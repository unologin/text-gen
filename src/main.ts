
import vm from 'vm';

import path from 'path';

import { readFileSync } from 'fs';

/**
 * 
 * @param file file contents
 * @returns text blocks, code blocks
 */
export function tokenize(file : string) : [string[], [string, boolean][]]
{
  const starterLength = 2;
  const enderLength = 2;

  const starts = Array.from(file.matchAll(/<\?/g));
  const ends = Array.from(file.matchAll(/\?>/g));

  if (starts.length !== ends.length)
  {
    throw new SyntaxError('Unmatched code start/end tags!');
  }

  const text : string[] = [];
  const code : [string, boolean][] = [];

  starts.forEach((start, i) => 
  {
    const end = ends[i];


    if (start.index === undefined || end.index === undefined)
    {
      throw new SyntaxError('Undefined start/end position.');
    }

    const lastEnd = i > 0 ? (
      (ends[i - 1] as any).index + enderLength) :
      0
    ;

    text.push(file.substr(lastEnd, start.index - lastEnd));

    const isOutput = file[start.index + starterLength] == '=';

    const codeStart = start.index + 
      (isOutput ? starterLength + 1 : starterLength);

    code.push(
      [
        file.substr(
          codeStart,
          end.index - codeStart,
        ),
        isOutput,
      ],
    );
  });

  text.push(
    file.substr(
      (ends[ends.length - 1] as any).index + enderLength,
      file.length,
    ),
  );

  return [text, code];
}

/**
 * @param filePath path of the file to load
 * @param importer load function
 * @returns function which allows to evaluate with args
 */
function importFile(
  filePath : string,
  importer : (filePath: string) => string,
)
{
  return (args : object) => evalTokens(
    tokenize(
      importer(filePath),
    ),
    path.dirname(filePath),
    args,
    importer,
  );
}

/**
 * 
 * @param param0 tokens
 * @param pwd pwd
 * @param vars optional context variables
 * @param importer load function
 * @returns text
 */
function evalTokens(
  [text, code] : ReturnType<typeof tokenize>,
  pwd : string,
  vars : object = {},
  importer : (filePath: string) => string, 
)
{
  let result = '';

  const context = {
    ...vars,
    write: (s: string) => s,
    writeln: (s: string) => s,
    load: (p: string) => importFile(
      path.resolve(pwd, p),
      importer,
    ),
  };

  vm.createContext(context);

  text.forEach((t, i) => 
  {
    result += t;

    if (i < text.length - 1)
    {
      const [js, isOutput] = code[i];

      context.write = (str) => 
      {
        if (!isOutput)
        {
          result += str;
        }

        return str;
      };

      context.writeln = (s) => context.write(s + '\n');

      const evalResult = vm.runInContext(
        js,
        context,
      );

      if (isOutput)
      {
        result += evalResult;
      }
    }
  });

  return result;
}

/**
 * @param file file contents
 * @param pwd containing dir of the file
 * @param vars context variables
 * @param importer load function
 * @returns evaluated file
 */
export function evalFileContents(
  file : string,
  pwd : string = process.env.PWD || '/',
  vars : object = {},
  importer : (f : string) => string= 
  ((str) => readFileSync(str).toString()),
)
{
  return evalTokens(
    tokenize(file),
    pwd,
    vars,
    importer,
  );
}

/**
 * @param filePath file contents
 * @param vars context vars
 * @param importer load function
 * @returns evaluated file
 */
export default function evalFile(
  filePath : string,
  vars : object = {},
  importer : (f : string) => string= 
  ((str) => readFileSync(str).toString()),
)
{
  return evalTokens(
    tokenize(importer(filePath)),
    path.dirname(filePath),
    vars,
    importer,
  );
}
