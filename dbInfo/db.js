const mongoose = require('mongoose')
mongoose.set('strictQuery', false);

async function startDb(){
    await mongoose.connect("mongodb+srv://leojardim5:210872fj@clus.nlffmt6.mongodb.net/?retryWrites=true&w=majority")
}

module.exports = startDb