const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

app.use(cors)

app.use(express.json())
const User = require("./model/User")

mongoose.connect("mongodb+srv://paragsoni:paragsoni@cluster0.nvcdn.mongodb.net/User?retryWrites=true&w=majority").then(()=>{
	console.log("Connected to the database")
}).catch((err)=>{
	console.log("some error occured")
})

app.use(require("./router/auth"))


app.listen(7000, () => {
	console.log('Server started on 7000')
})