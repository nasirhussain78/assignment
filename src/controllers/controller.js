import userModel from "../models/userModel.js";
import taskModel from "../models/taskModel.js";
import exceljs from "exceljs";

const validateEmail = email => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  
  const validatePhone = phone => {
    const re = /^\d{10}$/;
    return re.test(String(phone));
  };



class UserController {


    async createUser(req, res) {

        const data = req.body;
        const { name, email, phone } = data;
      
        if (!validateEmail(email)) {
          res.render("users", {
            error: "Invalid email format",
            
          });
          return;
        }
      
        if (!validatePhone(phone)) {
          res.render("users", {
            error: "Invalid phone number format",
            
          });
          return;
        }

        await userModel.create(data)
        .then(() => {
             res.redirect('/users');
           })
           .catch(error => {
             console.log(error);
           });

    }
    

    async createTask(req, res) {
        userModel.findById(req.body.user)
            .then(user => {
                const task = new taskModel({
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
    }


    async getAllUsers(req, res) {
        userModel.find({})
            .then(users => {
                res.render('users', { users: users });
            })
            .catch(error => {
                console.log(error);
            });
    }


    async getTasks(req, res) {
        userModel.find({})
            .then(users => {
                res.render('tasks', { users });
            })
            .catch(error => {
                console.log(error);
            });
    }



    async export(req, res) {
        userModel.find({})
            .then(users => {
                taskModel.find({})
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
    }


}

export default new UserController()
