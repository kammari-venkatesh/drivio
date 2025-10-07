import  {createUserRequest,getPendingRequests,deleteUserRequest} from "../Controllers/userrequestcontroller.js"
import express from "express"

const requestrouter =  express.Router()

requestrouter.post('/addrequest',createUserRequest)
requestrouter.get("/pending", getPendingRequests); // <-- new route
requestrouter.delete("/delete/:id", deleteUserRequest);


export default requestrouter
