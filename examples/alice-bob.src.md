# Component example
<? const myComponent = load('component.src.md'); ?>
<?=myComponent({ myName: 'Alice' })?>


Or:

<? writeln(myComponent({ myName: 'Bob' })) ?>