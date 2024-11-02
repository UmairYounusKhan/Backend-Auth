import 'dotenv/config';
import express from 'express';
import bcrypt from 'bcryptjs'
import cors from 'cors'
import mongoose from 'mongoose';
import userModel from './models/useSchema.js';

const app = express()
const port = process.env.PORT || 4065;
const DBURI = process.env.MONGODB_URI;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 app.use(cors())



mongoose.connect(DBURI)


mongoose.connection.on("connected",()=>{
    console.log("Mongo DB Connected")

});
mongoose.connection.on("error",(err)=>{
    console.log("Mongo DB Errorrs")

});

app.get('/', (req, res) => {
    res.send('Wellcome to Dashboard')
})


// 
// 
app.post("/signup", async (req,res)=>{
    const {firstName, lastName, email, password} = req.body;

    if(!firstName || !lastName || !email || !password){
        res.json({
            message : "Please fill all the fields",
            status : false
        });
        return;
    }

    const EmailExist = await userModel.findOne({email})
    if (EmailExist !== null){
        res.json({
            message:"Email Exist",
            status: false
        })
        return
    }

    const hashPassword = await bcrypt.hash(password, 15);
    console.log("hashPassword", hashPassword);

    let userObj={
        firstName,
        lastName,
        email,
        password : hashPassword
    };
    const userresponse = await userModel.create(userObj);

    res.json({
        message : "User Account Created",
        status: true
    })
    res.send("Post Created")
});



// 
// 
// user login

app.post("/login", async (req,res)=>{
    const {email, password} = req.body;
    console.log( email, password);

    if(!email || !password){
        res.json({
            message:"required field is missing",
            status:false
        })
        return;
    }

    const loginemailExist = await userModel.findOne({email})

    if(!loginemailExist){
        res.json({
            message:"Invalid Email & Password",
            status:false
        })
        return;
    };

    const comparePassword = await bcrypt.compare(password, loginemailExist.password);

    if (!comparePassword){
        res.json({
            message:"Invalid Email & Password",
            status:false
        });
        return;
    }
    res.json({
        message:"Login Successfully",
        status:true
    })


})





// 
// 
// 
app.listen(port, () => {
    console.log(`Server Starting now...  ${port}`)
})