const express = require('express');
const jade = require('jade');

const port = process.env.PORT || 3210;
const app = express();


app.get('/', (req, res) => {
  const locals = {};

  res.send(jade.renderFile('templates/index.jade', locals));
});

app.use('/public', express.static('public'));
app.listen(port);
