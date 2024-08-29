import express from "express"
import asyncify from "express-asyncify";
import { MeasureController } from "../controller/measure/MeasureController";


const measureRouter = asyncify(express.Router());
const measureController = new MeasureController();

measureRouter
    .route('/upload')
    .post(measureController.upload)
measureRouter
    .route('/confirm')
    .patch(measureController.confirm)

export {measureRouter};
