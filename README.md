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
Input: 

```
# <?= title ?>

You are running node version <?= process.version ?>. 
<?
  if (process.platform === 'linux')
  {
    writeln('You are running Linux :-)')
  }
  else 
  {
    writeln('You are not running Linux :-(')
  }
?>
```
Output
```
# This is the title
You are running node version v16.15.0. 
You are running Linux :-)
```

## Execution modes


There are two execution modes, denoted by the starting tags ```<?``` (silent) and ```<?=``` (direct output). 

```<?= expression ?>``` will write whatever the expression in the tags evaluates to. ```write(...)``` and ```writeln(...)``` are silenced.

```<? expression ?>``` will not output anything unless ```write(...)``` or ```writeln(...)``` is used.


## Imports and re-usable components

Use the ```load(filePath)``` function to load a re-usable component. ```load(filePath)``` will return a function which will render the component with the provided arguments.

`component.src.md`
```
My name is <?=myName ?>
```

In another file:

```
# Component example
<? const myComponent = load('component.src.md'); ?>
<?=myComponent({ myName: 'Alice' })?>


Or:

<? writeln(myComponent({ myName: 'Bob' })) ?>
```

Output:

```
# Component example
My name is Alice

Or:

My name is Bob
```


