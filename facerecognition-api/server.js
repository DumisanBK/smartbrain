const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');


const db = knex({
    client : 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'smartbrain'
    }
});


const app = express();

app.use(express.json());

app.use(cors())

app.get('/', (req, res)=>{
    db.select('*').from('users')
           .then(data => {
               res.json(data)
        })
        .catch(err => console.log(err));
})

app.post('/signin', (req, res) => {
    db.select('email', 'hashpassword').from('login')
    .where('email', '=', req.body.email)
    .then(data =>{
        const isValid = bcrypt.compareSync(req.body.password, data[0].hashpassword);
        console.log(isValid);
        if(isValid){
        return db.select('*').from('users')
         .where('email', '=', req.body.email)
         .then(user => {
             console.log(user)
             res.json(user[0])
         })
         .catch(err => res.status(400).json('unable to get user'))
        }
        else{
            res.status(400).json('wrong credentials');
        }
    })
    .catch(err => res.status(400).res.json('wrong credentials'))
})


app.post('/register', (req, res)=> {
   const {email, name, password} = req.body;
    const hash = bcrypt.hashSync(password)
   db('login')
       .insert({
           hashpassword: hash,
           email: email
       })
       .into('login')
       .catch(err => res.status(400).json('unable to register'));

    db('users')
        .insert({
         email: email,
         name: name,
         joined : new Date()
        }).then(user => {
            console.log(user)
            res.json(user[0]);
        })
      .catch(err => res.status(400).json('unable to register'));
        
})

app.get('/profile/:id', (req, res)=>{
  const { id } = req.params;

 db.select('*').from('users')
 .where({id: id})
 .then(user => {
     if(user.length){
        res.json(user)
     }else{
        res.status(400).json('Not found')
     }
     
    })
 .catch(err => res.status(400).json('error getting user'))
 

})

app.put('/image', (req, res)=>{
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .then( entries =>{
        res.json(entries[0])
    })
    .catch(err => res.status(400).json('Unable to get entries'))
})

app.listen(3000, ()=> {
    console.log('app is running on port 3000')
})