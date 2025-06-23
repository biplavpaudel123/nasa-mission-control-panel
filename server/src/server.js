const http = require("http");
const mongoose= require('mongoose');

const app= require('./app');


const MONGO_URL="mongodb+srv://nasanode:RkjyYIrRYCOldP99@cluster0.t4m1sri.mongodb.net/nasa?retryWrites=true&w=majority&appName=Cluster0";

const {loadPlanetsData}= require ('./models/planets.model');
const { error } = require("console");

const PORT=process.env.PORT || 8000;


const server=http.createServer(app);

mongoose.connection.once('open',()=>{
    console.log('MongoDB connection ready');
});

mongoose.connection.on('error',(err)=>{
    console.error(err);
})

async function startServer(){
    await mongoose.connect(MONGO_URL);
    await loadPlanetsData();
    server.listen(PORT,()=>{
        console.log(`Listening on port ${PORT}`);
    })
};

startServer();


