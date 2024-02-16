import mongoose, { Schema } from "mongoose"
import dotenv from "dotenv"

//get variables from .env
dotenv.config()

//connect to local mongoose server
mongoose.connect(process.env.MONGO_URI)

mongoose.connection
.on("open", () => console.log("Connected to Mongoose"))
.on("error", (error) => console.log(error))

const userSchema = new Schema({
    username: String,
    password: String
})

export const User = mongoose.model("User", userSchema)

