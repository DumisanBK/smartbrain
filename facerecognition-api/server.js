const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();

app.use(express.json());

app.use(cors())

const database = {
    users : [
        {
            id : '123',
            name : 'Brown',
            email : 'brown@gmail.com',
            password : 'password',
            entries : 0,
            joined : new Date()
        },
        {
            id : '124',
            name : 'Joanna',
            email : 'joanna@gmail.com',
            password : 'chocolate',
            entries : 0,
            joined : new Date()
        },
    ]
}

app.get('/', (req, res)=>{
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    
// bcrypt.compare("bacon", hash, null, function(err, hash){
// })
// bcrypt.hash("bacon", null, null, function(err, hash){
// })

   if(req.body.email === database.users[0].email &&
      req.body.password === database.users[0].password){
       res.json(database.users[0]);
    }
    else {
       res.status(400).json('error loggin in')
    }
})


app.post('/register', (req,res)=> {
    const {email, name, password} = req.body;
    bcrypt.hash(password , null, null, function(err, hash){
        console.log(hash)
    })
    database.users.push(
        {
            id : '125',
            name : name,
            email : email,
            entries : 0,
            joined : new Date()
        })

        res.json(database.users[database.users.length-1])
})

app.get('/profile/:id', (req, res)=>{
  const { id } = req.params;
  let found = false;
  database.users.forEach(
      user => {
          if(user.id === id){
              res.json(user)
              found = true;
          }
      })
      if(!found){
        res.status(404).json('not found');
      }

})

app.put('/image', (req, res)=>{
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id){
            found = true;
            user.entries++
            return res.json(user.entries)
        }
        })
        if(!found){
          res.status(404).json('not found');
        }
})

app.listen(3000, ()=> {
    console.log('app is running on port 3000')
})