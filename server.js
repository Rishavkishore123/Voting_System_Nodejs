const express= require('express');


const app= express();

app.use(express.json());

app.use((req, res, next) => {
    next();
});

const userRoutes= require('./Routes/userRoutes');
const party= require('./Routes/party');


app.use('/user',userRoutes);
app.use('/umeedwar',party);


app.listen(8009,()=>{
    console.log("Server is running")
})






