import express from "express"
import asyncify from "express-asyncify";
import { CustomerController } from "../controller/customer/CustomerController";


const customerRouter = asyncify(express.Router());
const customerController = new CustomerController();

customerRouter
    .route('/[:customer_code]/list')
    .get(customerController.getCustomer)
