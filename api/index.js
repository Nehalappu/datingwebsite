import express from 'express';
import mongoose from 'mongoose';
mongoose.connect('mongodb+srv://nehal:Nehal123%40@datingapp.7l7qk.mongodb.net/datingapp?retryWrites=true&w=majority&appName=datingapp')
.then(()=>{
    console.log('mongo connected');
})
.catch(err=>{
    console.log(err);
})
const app=express();
app.listen(3000,()=>{
    console.log('server on 3000');
});