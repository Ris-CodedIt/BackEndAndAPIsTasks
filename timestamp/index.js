// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.get("/api", function (req, res) {

   try{
    const new_time = new Date()
      
    return res.json({unix: new_time.getTime(), utc:`${new_time.toUTCString()}`})
    
   }catch(err){
    console.log(err)
    return res.json({ error : "Invalid Date" })
     
   }
   
});
// your first API endpoint... 
app.get("/api/:date", function (req, res) {
    const str = req.params.date

    let regex =/^\d+$/ 
    let match = str.match(regex)
    let time;
    if(match){
          time = Number(str)
      }else{
          time = str
      }


   try{
    const new_time = time ? new Date(time) : new Date()
    if(isValidDate(new_time)){
      return res.json({unix: new_time.getTime(), utc:`${new_time.toUTCString()}`})
    }else{
      return res.json({ error : "Invalid Date" })
    }
    
   }catch(err){
    console.log(err)
    return res.json({ error : "Invalid Date" })
     
   }
   
});



// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
