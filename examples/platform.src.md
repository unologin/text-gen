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