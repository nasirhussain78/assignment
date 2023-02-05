import express from 'express'
const router = express.Router();
import userController from '../controllers/controller.js';
const app = express();
import path from 'path';

const directory = path.dirname(import.meta.url);

app.set('views', path.join(directory, 'views'))

app.set('view engine', 'hbs')
//render home
router.get('/', (req, res) => {
  res.render('home');
});



router.get('/users',userController.getAllUsers);
router.get('/tasks',userController.getTasks);



router.post('/users',userController.createUser)




router.post('/tasks',userController.createTask)



router.get('/export',userController.export)



export default router