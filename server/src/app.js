const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const apiv1= require('./routes/apiv1')

const app= express();

app.use(cors({
    origin:'http://localhost:3000',
}
));

app.use(morgan('combined'));//logging

app.use(express.json());
app.use(express.static(path.join(__dirname,'..','public')))
app.use('/v1',apiv1);
app.get('/*name',(req,res)=>{ //update in v5 must change /* to /*name
    res.sendFile(path.join(__dirname,'..','public','index.html'));
})

module.exports=app;