const express = require("express")
//import express from "express";
const app = express()
const PORT = 805;
const mysql = require("mysql2");    //to put the install mysql functionalities in a variable
//import mysql from "mysql2";
app.use(express.json());
var cors = require("cors");
//import cors from "cors";
//const { default: AddExpense } = require('../frontend/src/Components/AddExpense');

app.use(cors());



var con = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "root",
    database : "expense",
    port :3307,
});

con.connect(function(err){
    if(err) throw err;
    console.log("Database is Connected");
});



app.post('/user/signup', (req,res) =>{
    console.log("i am inside server")
    
    
    const {name,phone,email,password} = req.body;

    var sql = `INSERT INTO signup (name,phone,email,password) VALUES ("${name}","${phone}", "${email}", "${password}")`;

    con.connect(function (err) {
      if (err) throw err;
      console.log("Database is Connected");

      con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");


          res.status(201).json({
            message: "Successful"
          })
      });

      
    

    //   else{
    //     res.status(201).json({
    //         message: "Unsuccessful"
    //     })
    //   }







    });





    
    res.status(201).json({
        'message': 'signup successful'
    })
});


app.post('/user/addexpense', (req,res)=>{
        console.log('I am inside the server');

        const { description, price, category, notes, date} = req.body;
        var sq2 = `INSERT INTO addexpense (description,price,category,notes,date) VALUES("${description}", "${price}","${category}", "${notes}", "${date}")`;

        con.connect(function (err) {
      if (err) throw err;
      console.log("Database is Connected");

      con.query(sq2, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");


          res.status(201).json({
            message: "Successful"
          })


      });
    

 });

});

app.get('/user/getexpenses', (req,res)=>{
    var sql = `SELECT * from addexpense`;

    con.connect(function(err){
      if (err) throw err;

      con.query(sql,function(err,result) {
         res.status(201).json({
            result
         })
      })

    })

    

})

app.get('/user/totalexpense', (req,res)=> {
     var sql = `SELECT price FROM addexpense`
      con.connect(function(err){
      if (err) throw err;
          
      con.query(sql,function(err,result) {
          
           let sum = 0;
        for(let i = 0; i<result.length;i++){
             sum+=parseInt(result[i].price);
           
        
        }
           console.log(sum);
         res.status(201).json({
            "totalexpense" : sum
         })
      })

})

})



app.get('/user/categoryexpense', (req,res)=>{
    var sql =`SELECT category, SUM(price) FROM addexpense GROUP BY category`;
   

    con.connect(function(err){
        if  (err) throw err;

        con.query(sql, function (err, result) {
            Number.parseInt(result)
          res.status(201).json({
            "categoryexpense" : result
          });
        });
    })
})








app.listen(PORT, ()=>{
    console.log("the server is running on port ", PORT)
});