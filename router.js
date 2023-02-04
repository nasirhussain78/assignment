const express = require("express");
const app = express();

const User = require("./userModel");
const mongoose = require("mongoose");
const db = mongoose.connection;
const router = express.Router();

// router.get("/create-task", (req, res) => {
//   User.find({}, (err, users) => {
//     if (err) {
//       return res.send(err);
//     }
//     res.render("create-task", { users });
//   });
// });
app.get('/', async (req, res) => {
    const users = await User.find({}); // find all users
    res.render('index', { users }); // render the index view and pass the users to the view
  });

// router.post("/create-task", (req, res) => {
//   // handle form submission here
// });
app.post('/create-user', (req, res) => {
    const user = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };
  
    db.collection('users').insertOne(user, (err, result) => {
      if (err) {
        console.error(err);
        res.send('Error creating user');
        return;
      }
  
      res.send('User created successfully');
    });
  });
module.exports = router;
