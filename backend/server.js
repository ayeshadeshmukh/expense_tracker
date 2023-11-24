const express = require("express");
const jwt = require("jsonwebtoken");
//import express from "express";
const app = express();
const PORT = 805;
const mysql = require("mysql2"); //to put the install mysql functionalities in a variable
//import mysql from "mysql2";
app.use(express.json());
var cors = require("cors");
//import cors from "cors";
//const { default: AddExpense } = require('../frontend/src/Components/AddExpense');

app.use(cors());
const generateToken = require("./config/generateToken");
const protect = require("./Middleware/Protect");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "expense",
  port: 3307,
});


app.post("/user/signup", (req, res) => {
  console.log("i am inside server");

  const { name, phone, email, password } = req.body;

  var sql = `INSERT INTO signup (name,phone,email,password) VALUES ("${name}","${phone}", "${email}", "${password}")`;

  con.connect(function (err) {
    if (err) throw err;
    console.log("Database is Connected");

    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");

      res.status(201).json({
        message: "Successful",
      });
    });

    //   else{
    //     res.status(201).json({
    //         message: "Unsuccessful"
    //     })
    //   }
  });
});

app.post("/user/signin", (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);
  var sql = `SELECT * from signup where email = '${email}'`;

  con.connect((error) => {
    if (error) {
      throw error;
    }

    con.query(sql, (err, result) => {
      if (err) {
        throw err;
      }
      console.log(result);

      if (result.length == 0) {
        res.status(201).json({
          error: "User does not exist",
        });
      } else if (result[0].password == password) {
        res.status(201).json({
          name: result[0].name,
          phone: result[0].phone,
          email: result[0].email,
          token: generateToken(result[0].email),
        });
      }
    });
  });
});

app.post("/user/addexpense", protect, (req, res) => {
  console.log("I am inside the server");

  const { description, price, category, notes, date,month,year } = req.body;
  var sq2 = `INSERT INTO addexpense (email,description,price,category,notes,date,month,year) VALUES("${req.myemail}","${description}", "${price}","${category}", "${notes}", "${date}", "${month}", "${year}")`;

  con.connect(function (err) {
    if (err) throw err;
    console.log("Database is Connected");

    con.query(sq2, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");

      res.status(201).json({
        message: "Successful",
      });
    });
  });
});

app.get("/user/getexpenses", protect, (req, res) => {
  var {month,year} = req.query;
  console.log(month,year);
  var sql = `SELECT * from addexpense where email = "${req.myemail}" AND month = "${month}" AND year = "${year}"`;

  con.connect(function (err) {
    if (err) throw err;

    con.query(sql, function (err, result) {
      res.status(201).json({
        result,
      });
    });
  });
});

app.get("/user/totalexpense", protect, (req, res) => {
   var {month,year} = req.query;

  var sql = `SELECT price FROM addexpense where email = '${req.myemail}'AND '${month}' AND '${year}'`;
  con.connect(function (err) {
    if (err) throw err;

    con.query(sql, function (err, result) {
      if (result.length == 0) {
        res.status(201).json({
          totalexpense: 0,
        });
      } else {
        let sum = 0;
        for (let i = 0; i < result.length; i++) {
          sum += parseInt(result[i].price);
        }
        console.log(sum);
        res.status(201).json({
          totalexpense: sum,
        });
      }
    });
  });
});

app.get("/user/categoryexpense", protect, (req, res) => {
   var {month,year} = req.query;

 // var sql = `SELECT category, SUM(price) FROM addexpense GROUP BY category where email = '${req.myemail}'`;
  var sql = `SELECT category, SUM(price) FROM addexpense WHERE email = '${req.myemail}'AND '${month}' AND '${year}' GROUP BY category`;


  con.connect(function (err) {
    if (err) throw err;

    con.query(sql, function (err, result) {
      if (result.length == 0) {
        res.status(201).json({
          categoryexpense: 0,
        });
      } else {
        Number.parseInt(result);
        res.status(201).json({
          categoryexpense: result,
        });
      }
    });
  });
});

app.get("/my/tracker", protect, (req, res) => {
  const { id } = req.query;
  console.log(id);
  var sql = `SELECT * FROM addexpense WHERE id = ${id}`;

  con.connect(function (err) {
    if (err) throw err;

    con.query(sql, function (err, result) {
      res.status(201).json({
        data: result,
      });
    });
  });
});

app.listen(PORT, () => {
  console.log("the server is running on port ", PORT);
});
