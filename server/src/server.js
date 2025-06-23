const http = require("http");
const mongoose= require('mongoose');
const path= require("path")
const env=require('dotenv');

const app= require('./app');
const {loadPlanetsData}= require ('./models/planets.model');

const PORT=process.env.PORT || 8000;

const server=http.createServer(app);


env.config({ path: __dirname + '/../../.env'});

mongoose.connection.once('open',()=>{
    console.log('MongoDB connection ready');
});

mongoose.connection.on('error',(err)=>{
    console.error(err);
})

async function startServer(){
    await mongoose.connect(process.env.MONGO_URL);
    await loadPlanetsData();
    server.listen(PORT,()=>{
        console.log(`Listening on port ${PORT}`);
    })
};

startServer();


