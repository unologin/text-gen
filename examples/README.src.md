<? 
/** This is the source file used to generate the projects README.md file. */
?>
# node-text-gen 

```node-text-gen``` is a simple, light weight, zero-dependency CGI-esque text generator.

## Use cases

This tool is especially useful for generating markdown docs that are always up to date and correct. You can use it to generate docs for APIs or any kind of library. 

In fact, this document was generated using ```node-text-gen``` to ensure that all the examples are correct. So the example outputs you are seeing weren't just pasted into this document but generated and therefore reflect the current behavior of the library. The source of this README can be found in the examples directory in the git repository. 

## Usage

```javascript
import textGen from 'node-text-gen';

import { writeFileSync } from 'fs';

// optional: define global variables for your script
const contextVars = 
{
  title: 'This is the title',
  process,
};

writeFileSync(
  // output file (can be markdown or any type of text file such as html)
  'output.md',
  // run textGen on the input file
  textGen('input.src.md', contextVars),
);

```
<?
  let platformExample = loadRaw('platform.src.md');
?>
Input: 

```
<?=platformExample ?>

```
Output
```
<?= 
  load('platform.src.md')(
    {
      title: 'This is the title',
      process,
    },
  )
?>
```

## Execution modes

<?
  // workaround to be able to write these characters
  let opener = '<'+'?';
  let openerOutput = '<'+'?=';
  let closer = '?'+'>';
?>

There are two execution modes, denoted by the starting tags ```<?=opener?>``` (silent) and ```<?=openerOutput?>``` (direct output). 

```<?=openerOutput?> expression <?=closer?>``` will write whatever the expression in the tags evaluates to. ```write(...)``` and ```writeln(...)``` are silenced.

```<?=opener?> expression <?=closer?>``` will not output anything unless ```write(...)``` or ```writeln(...)``` is used.


## Imports and re-usable components

Use the ```load(filePath)``` function to load a re-usable component. ```load(filePath)``` will return a function which will render the component with the provided arguments.

`component.src.md`
<?
  let componentSrc = loadRaw('component.src.md');
  let aliceBobSrc = loadRaw('alice-bob.src.md');
?>
```
<?= componentSrc ?>

```

In another file:

```
<?= aliceBobSrc ?>

```

Output:

```
<?=load('alice-bob.src.md')()?>
```

