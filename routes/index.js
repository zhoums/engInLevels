let js={
  "label":"fdsafdsafdsa",
  "value":"value"
}
let router = app=>{
  app.get('/', function(req, res, next) {
    res.json(js);
  });
  app.get('/users', function(req, res, next) {
    res.send('respond with a resource');
  });
}

module.exports = router;
