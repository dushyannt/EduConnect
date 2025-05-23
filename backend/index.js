const { error } = require("console");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// Routes importing 
const userRoute = require("./routes/signup_login");
const semester_route = require('./routes/semester_route_showing_courses')
const add_course_route = require('./routes/add_some_courses')
const pdf_route = require('./routes/pdf_in_course')
const announcement_route = require('./routes/announcement')
const signout_route = require('./routes/singout')
const result_route = require('./routes/result')
const individual_course = require('./routes/gpa_for_courses')
const link_route = require('./routes/links_adding')
const pyq_route = require('./routes/pyq_for_course')
const admin_route = require('./routes/admin_to_admin')
const get_profile = require('./routes/edit_profile');
// middlleware importing
const {check_login} = require('./middlewares/check_for_login')
const {check_admin} = require('./middlewares/check_type')

const app = express();
const port = 5000;

// mongodb+srv://iib2022038:acKZwVv2fnUYcNDT@cluster0.0ouumue.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

// MAKING CONNNECTION WITH DATABASE
// .connect("mongodb+srv://iib2022038:acKZwVv2fnUYcNDT@cluster0.0ouumue.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
mongoose
  .connect("mongodb+srv://iib2022038:acKZwVv2fnUYcNDT@cluster0.0ouumue.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(console.log("database connected"))
  .catch((err) => console.log(err.message));
  
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });
  app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(200).send();
  });

// MIDDLEWARE FOR PARSING DATA INTO UNDERSTANDABLE FORM BY SERVER
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());


// LOGIN ROUTE
app.use("/signup", userRoute);

// routes to make someone teacher / admin 
app.use('/admin', check_login ,check_admin ,admin_route);

// ROUTE THAT SHOW THE COURSES FOR THE STUDENT FOR THE SEMESTER HE CHOOSES ASSUMED DEPARTMENT IS RETRIVED AND SEND IN BODY
app.use('/semester', check_login , semester_route);
app.use('/get_info', check_login , get_profile);
// ADD SOME COURSES
app.use('/add_courses', check_login , add_course_route )

// only admin can ADD PDF in the notes section courses and other can only access the uploaded
app.use("/course/pdf", check_login , pdf_route)

// admin to add links through the link section and other can only access the uploaded
app.use("/course/links" , check_login ,  link_route )

// admin to add and other can only access the uploaded
app.use("/course/pyq" , check_login ,  pyq_route )

// announcement route
app.use('/announcements' , check_login ,announcement_route)

// result for overall semester
app.use('/result', check_login , result_route)

// result for some course 
app.use('/result/course', check_login , individual_course)

// signout route
app.use('/signout', check_login ,signout_route)

app.listen(port, () => console.log("server is running on " + port));
