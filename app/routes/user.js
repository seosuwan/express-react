import express from "express"
import cors from 'cors'
import dotenv from 'dotenv'
import passport from 'passport'
import UserService from '../services/user.js'
dotenv.config()
const mongoUri = process.env.MONGO_URI
const port = process.env.PORT
const jwtSecret = process.env.JWT_SECERT
const origin = process.env.ORIGIN
const corsOptions = {
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200
}
const app = express()
app.use(cors());
app.use(function (_req, res, next) {
    
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept",
    );
    next();
});
app.post('/join', cors(corsOptions), (req, res) => {
    UserService().join(req, res)
})
app.post('/login', 
    cors(corsOptions), (req, res) => {
    UserService().login(req, res)
})
app.post('/loadMyInfoAPI', cors(corsOptions), (req, res) => {
    UserService().loadMyInfoAPI(req, res)
})

app.get(
    '/logout',
    //passport.authenticate('jwt', {session: false}),
    function (req, res) {
        console.log(' logout 진입 ')
        //UserService().logout(req, res)
        //req.logout();
        res.json({message: 'ok'});
    }
);
export default app