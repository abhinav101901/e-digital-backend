// const express = require("express")
// const Razorpay = require("razorpay")
// require("dotenv").config
// const cors = require("cors")
// const app = express()

// const mongoose = require('mongoose');
// const multer=require("multer")

// const PORT = 5000

// const custumerModel = require("./custumerModel")

// app.use(express.json());
// app.use(express.urlencoded({extended:false}))
// app.use(cors())

// mongoose.set({strictQuery:true})

// mongoose.connect("mongodb+srv://abhinav:abhi123@cluster0.qicwtqo.mongodb.net/E-digital",
// {dbName:"E-digital"},
// {useNewUrlParser:true})
//     .then(() => console.log("MongoDb is connected"))
//     .catch(err => console.log(err))

// app.post("/order", async(req, res) => {
//     try{
//     const razorpay = new Razorpay({
//         key_id: "rzp_test_xqOqc1IPbd7504",
//         key_secret: "2LhPauugQv8Li4fEr5GOT4QK"
//     });

//     const options = req.body;
//     const order = await razorpay.orders.create(options);

//     if(!order){
//         return res.status(500).send("Error");
//     }
//     res.json(order);
// }
// catch(err){
//     console.log(err);
//     res.status(500).send("Error")
// }
// });



// app.post("/uploadForm",async(req,res)=>{
//     try{
//         let data=req.body
//         let createData = await custumerModel.create(data)
//         res.json(createData)

//     }catch(err){
//         console.log(err)
//     }

// });


// app.listen(PORT,()=>{
//     console.log("Listing on Port", PORT)
// })










const express = require("express");
const mongoose = require('mongoose');
const multer = require("multer");
const cors = require("cors");
const Razorpay = require("razorpay")

const app = express();
const PORT = 5000;

app.use(express.json()); // Add this line to parse JSON data
app.use(express.urlencoded({ extended: false }));
app.use(cors());

mongoose.set({ strictQuery: true })

mongoose.connect("mongodb+srv://abhinav:abhi123@cluster0.qicwtqo.mongodb.net/E-digital",
    { dbName: "E-digital" },
    { useNewUrlParser: true })
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))


const userSchema = new mongoose.Schema({
    fullName: String,
    contactNumber: String,
    document: String,
    images: [String], // Array to store image filenames
});
const User = mongoose.model('User', userSchema);

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'uploads/'); // Specify the upload directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Use a unique filename
    },

});

const upload = multer({ storage: storage });

app.post('/upload', upload.array('images', 5), async (req, res) => {
    try {
        const { fullName, contactNumber, document, images } = req.body;
        console.log(req.body);
        // Create a new user with the provided information
        const newUser = new User({
            fullName,
            contactNumber,
            document,
            images,
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User information and images uploaded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.post("/order", async(req, res) => {
    try{
    const razorpay = new Razorpay({
        key_id: "rzp_test_JbFAIAiuBvcOR1",
        key_secret: "NVs6EwScsY5SFd97HNQY4hlS"
    });

    const options = req.body;
    const order = await razorpay.orders.create(options);

    if(!order){
        return res.status(500).send("Error");
    }
    res.json(order);
}
catch(err){
    console.log(err);
    res.status(500).send("Error")
}
});


app.get("/getAllData",async(req,res)=>{
    try{
        const data = await User.find()
        res.json(data)
    }
    catch(err){
        console.log(err)
        res.status(500).send("err")
    }
})

app.use("/",(req,res)=>{
    res.json({message:"hello from express App"});
});


app.listen(PORT, () => {
    console.log("Listening on Port", PORT);
});
