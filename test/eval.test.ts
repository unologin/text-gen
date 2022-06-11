
import evalFile, {
  evalFileContents,
  tokenize,
} from '../src/main';

describe('tokenize', () => 
{
  it('throws SyntaxError for mismatched opening/closing tags', () => 
  {
    expect(
      () => tokenize('<? ?> <?'),
    ).toThrow(SyntaxError);
  });

  it('splits correct text into tokens', () => 
  {
    const [
      text, code,
    ] = tokenize('The answer is: <?= 42 ?>, or maybe <? write(32)?>.');
  
    expect(text).toStrictEqual(
      ['The answer is: ', ', or maybe ', '.'],
    );
  
    expect(code).toStrictEqual(
      [[' 42 ', true], [' write(32)', false]],
    );
  });
});

test('evalFile', () => 
{
  const result = evalFileContents(
    'The answer is: <?= 40 + 2 ?> ... or maybe <? write(32)?>?',
  );

  expect(result).toBe(
    'The answer is: 42 ... or maybe 32?',
  );
});

test('write(str) does nothing in output mode', () => 
{
  const result = evalFileContents(
    'The answer is: <?= write(40 + 2) ?>!',
  );

  expect(result).toBe(
    'The answer is: 42!',
  );
});

test('vars are available in context', () => 
{
  const result = evalFileContents(
    '<?= foo ?>',
    '',
    { foo: 'bar'},
  );

  expect(result).toBe(
    'bar',
  );
});

test('variables stay in scope', () => 
{
  expect(
    evalFileContents('<? let a = 2 ?>text<?=a?>'),
  ).toBe('text2');
});

test('importing components', () => 
{
  const result = evalFileContents(
    '<? let component = load("component") ?><?= component({ foo: "bar" }) ?>',
    '',
    {},
    // mock importer
    () => '<?= foo ?>',
  );

  expect(result).toBe('bar');
});

test('evalFile', () => 
{
  const code = '<? let a = 2 ?>text<?=a?>';

  expect(
    evalFile('my/file/path.txt', {}, () => code),
  ).toBe(evalFileContents(code));
});
