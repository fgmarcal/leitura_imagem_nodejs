import express from 'express'
import { customerRouter } from './routes/customerRoute';
import path from "node:path";
import { errorHandler } from '../middleware/ErrorHandler';
import { measureRouter } from './routes/measureRoute';


const app = express();

app.use(express.json({limit:'15mb'}));
app.use(express.urlencoded({limit:'15mb', extended:true}))

app.use(customerRouter)
app.use(measureRouter)


app.use(errorHandler);

app.use('/img', express.static(path.join(__dirname, '../../public/img')))

export {app}