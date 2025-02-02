require('dotenv').config();
const express = require('express');
const cors = require('cors');
let bodyParser = require("body-parser")
const app = express();
const UrlStore = {
  "1":"test"
}
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

function isValidHttpUrl(string) {
  try {
    const newUrl = new URL(string);
    return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


app.post('/api/shorturl', function(req, res) {
    const url = req.body.url
    if(isValidHttpUrl(url)){
     let num =  Object.keys(UrlStore).length + 1 
    //  console.log(UrlStore.length) 
     UrlStore[`${num}`]  = url 
     return res.json({ original_url : url, short_url : num})
    }else{
      res.json({ error: 'invalid url' })
    }

});

app.get('/api/shorturl/:url', function(req, res) {
    const url = req.params.url
    let act_url = UrlStore[`${url}`]
     return res.redirect(act_url)
});
 

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
