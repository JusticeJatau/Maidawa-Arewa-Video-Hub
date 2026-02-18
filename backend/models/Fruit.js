import mongoose from "mongoose";

const fruitSchema = mongoose.Schema({
    name:{type: String, required: true},
    color:{type: String, required: true}
})

const Fruit = mongoose.model("Fruit", fruitSchema)
export default Fruit