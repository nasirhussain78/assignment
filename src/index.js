import express from 'express';

import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import route from './routes/router.js'
import path from 'path';
const app = express()


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.set('view engine', 'hbs')
app.use('/',route);


mongoose.connect("mongodb+srv://nasirhussain7878:llo5gS70CAxajLIs@cluster0.neahs.mongodb.net/HackerkernelAssignment?authSource=admin&replicaSet=atlas-udybrv-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true", {
  useNewUrlParser: true
})
  .then(() => console.log("MongoDb connected"))
  .catch(err => console.log(err))


app.listen(process.env.PORT || 3000, function () {
  console.log('Express app running on port ' + (process.env.PORT || 3000))
});











