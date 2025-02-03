const express = require('express')
require('dotenv').config()
const cors = require('cors')
let bodyParser = require("body-parser")
const {User, Exercise} = require("./db")

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}
 
const app = express()

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


// create user

app.post('/api/users', async(req, res) => {
  let username = req.body.username
  if(!username) return res.json({error: "Invalid input"})
  
  let user = new User({username:username})
  await user.save((err,data)=>{
    if(err){
      console.log(err)
      return res.json({error: "Invalid input"})
    }
    console.log("data: ", data)
    return res.json({username: data.username, _id: data._id})
  })
});


// get users
app.get('/api/users', async(req, res) => {
  let ourUsers = null
  let ourUsersList = []
  
  await User.find((err,data)=>{
    if(err){
      console.log(err)
      return res.json({error: "Invalid input"})
    }
    ourUsers= data
    
  })

  // console.log("userz", ourUsers)
  if(ourUsers === null) return res.json({error: "Invalid input"})

  ourUsers.forEach((entry)=>{
    let dst = {"_id": entry._id,"username":entry.username}
    ourUsersList.push(dst)
  })


  return res.send(ourUsersList)
});


// create post
app.post('/api/users/:_id/exercises', async(req, res) => {
  const user_id = req.params._id
  const description = req.body.description
  const date = req.body?.date || null
  const duration = req.body.duration
  let actual_date  = null
  let ourUser = null

  if(date){
    let dt = new Date(date)
    actual_date = isValidDate(dt) ? dt : new Date()
  }else{
    actual_date = new Date()
  }

  
  await User.findById({_id:user_id},(err,data)=>{
    if(err){
      console.log(err)
      return res.json({error: "Invalid input"})
    }
     ourUser = data
  })
  // console.log("user", ourUser)
  if(ourUser === null) return res.json({error: "Invalid input"})
  let exercise = new Exercise({duration: duration, description: description, date: actual_date , user_id: ourUser._id})
  await exercise.save((err,data)=>{
    if(err){
      console.log(err)
      return res.json({error: "Invalid input"})
    }
    let dst = new Date(data.date)
    return res.json({username: ourUser.username, description: data.description, duration: data.duration , date: dst.toDateString(), _id: ourUser._id})
  })
});


// app.get("/api/users/:_id/logs", async(req,res)=>{
//   const user_id = req.params._id
//   const from = req.query?.from || ""
//   const to = req.query?.to || ""
//   const limit = req.query?.duration || null
//   let ourExercise  = null
//   let ourUser = null
//   let logs = []

//   await User.findById({_id:user_id},(err,data)=>{
//     if(err){
//       console.log(err)
//       return res.json({error: "Invalid input 1"})
//     }
//      ourUser = data
//   })

//   console.log("user", ourUser)
//   if(ourUser === null) return res.json({error: "Invalid input 1"})

// if(from && to && limit){
//   await Exercise.find({user_id:user_id, date: { $gte: from, $lte: to }},)
//                 .limit(Number(limit), (err,data)=>{
//                   if(err){
//                     console.log(err)
//                     return res.json({error: "Invalid input 3"})
//                   }
//                    ourExercise = data
//                 })
// }
// else{
//   await Exercise.find({user_id:user_id},(err,data)=>{
//     if(err){
//       console.log(err)
//       return res.json({error: "Invalid input 3"})
//     }
//      ourExercise = data
//   })
// }

// if(ourExercise){
//   ourExercise.forEach(element => {
//           let dat = new Date(element.date)
//         let dts = {description: element.description, duration: element.duration, date: dat.toDateString() }
//         logs.push(dts)
//   }); 
// }

// return res.json({username: ourUser.username ,count: logs.length ,_id: ourUser._id,  log: logs})


  
// })


app.get('/api/users/:_id/logs', (req, res) => {

  let fromParam = req.query.from;
  let toParam = req.query.to;
  let limitParam = req.query.limit;  
  let userId = req.params._id;

  // If limit param exists set it to an integer
  limitParam = limitParam ? parseInt(limitParam): limitParam

  User.findById(userId, (err, userFound) => {
    if (err) return console.log(err);
    // console.log(userFound);
    
      let queryObj = {
        user_id: userId
      };
      // If we have a date add date params to the query
      if (fromParam || toParam){
    
          queryObj.date = {}
          if (fromParam){
            queryObj.date['$gte'] = fromParam;
          }
          if (toParam){
            queryObj.date['$lte'] = toParam;
          }
        }

    
    Exercise.find(queryObj).limit(limitParam).exec((err, exercises) => {
      if (err) return console.log(err);
  
      let resObj = 
        {_id: userFound._id,
         username: userFound.username
        }
  
      exercises = exercises.map((x) => {
        return {
          description: x.description,
          duration: x.duration,
          date: new Date(x.date).toDateString()
        }
      })
      resObj.log = exercises;
      resObj.count = exercises.length;
      console.log(resObj)
      res.json(resObj);
    })
    
  })
})










const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
