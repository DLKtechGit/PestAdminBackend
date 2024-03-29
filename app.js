const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { DB_CONNECTION_URL } = require('./env/env')
const app = express();

const AdminAuth = require("./Routes/AdminRoutes/AdminLogin")
const CreateServices = require("./Routes/AdminRoutes/CreateService")
const CompanyData = require("./Routes/AdminRoutes/Company")
const TechnicianData = require("./Routes/AdminRoutes/TechnicianRoutes")
const Tasks = require("./Routes/AdminRoutes/Tasks")

app.get("/", (req, res) => {
    res.send("from get route")
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


app.use('/auth', AdminAuth);
app.use('/services', CreateServices);
app.use('/company', CompanyData);
app.use('/technician', TechnicianData);
app.use('/task', Tasks);

mongoose.connect(DB_CONNECTION_URL, {
    useNewUrlParser: true  
}).then((result) => {
    console.log("MongoDB connected")
}).catch(err => console.log(err));



const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log('Backend Server alive on port ' + PORT)
})