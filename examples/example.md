# Example
This is an example of how to use autodoc with markdown.
Can be any text file, really.

<?
    writeln('hello world')
?>

# Modules
You can import modules / components as functions:

<?
    const test = load('./module.md')
?>

And then re-use them:

<?= test({ title: 'Title 1', content: 'Content 1' }) ?>

<?= test({ title: 'Title 2', content: 'Content 2' }) ?>
