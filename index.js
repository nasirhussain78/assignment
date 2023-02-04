const express = require('express');
const router = require('./router');
const exceljs = require("exceljs");

const app = express();
const path = require('path')
// app.use('/create-task', router);
// const mongodb = require('mongodb');
const mongoose = require('mongoose')
// const handlebars = require('handlebars');
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.set('views',path.join(__dirname,'views'))
// to set the views folder
app.set('view engine','hbs')

  app.get('/', (req, res) => {
    res.render('home');
});

mongoose.connect("mongodb+srv://taabish:2AWiE5SYFXDH7l56@cluster0.3ygaxxf.mongodb.net/userTask?retryWrites=true&w=majority",{
    useNewUrlParser:true
})
.then(()=>console.log("MongoDb connected"))
.catch(err=>console.log(err))

// const db = mongoose.connection;
  app.listen(process.env.PORT || 3000, function() {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String
});

const User = mongoose.model('User', userSchema);

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  taskName: String,
  taskType: String
});

const Task = mongoose.model('Task', taskSchema);

app.get('/users', (req, res) => {
  User.find({})
    .then(users => {
      res.render('users', {users: users});
    })
    .catch(error => {
      console.log(error);
    });
});

app.post('/users', (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone
  });

  user.save()
    .then(() => {
      res.redirect('/users');
    })
    .catch(error => {
      console.log(error);
    });
});

app.get('/tasks', (req, res) => {
  User.find({})
    .then(users => {
      res.render('tasks', { users });
    })
    .catch(error => {
      console.log(error);
    });
});

app.post('/tasks', (req, res) => {
  User.findById(req.body.user)
    .then(user => {
      const task = new Task({
        user: user._id,
        taskName: req.body.taskName,
        taskType: req.body.taskType
      });

      task.save()
        .then(() => {
          res.redirect('/tasks');
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      console.log(error);
    });
});




app.get("/export", (req, res) => {
  User.find({})
    .then(users => {
      Task.find({})
        .populate("user")
        .then(tasks => {
          const workbook = new exceljs.Workbook();
          const userSheet = workbook.addWorksheet("User");
          const taskSheet = workbook.addWorksheet("Task");

          // Add user data to the user sheet
          userSheet.addRow(["Name", "Email", "Phone"]);
          users.forEach(user => {
            userSheet.addRow([user.name, user.email, user.phone]);
          });

          // Add task data to the task sheet
          taskSheet.addRow(["Task Name", "Task Type", "Assigned To"]);
          tasks.forEach(task => {
            taskSheet.addRow([
              task.taskName,
              task.taskType,
              task.user.name
            ]);
          });

          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );
          res.setHeader(
            "Content-Disposition",
            'attachment; filename="data.xlsx"'
          );
          return workbook.xlsx.write(res);
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send("Error generating Excel file");
    });
});