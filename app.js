const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const https = require("https");
require("dotenv").config();

const app = express();
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static(__dirname));

app.get("/",function(req,res){
    res.sendFile(__dirname +"/signup.html");

});

app.post("/",function(req,res){

    const firstname = req.body.firstName;
    const secondname = req.body.secondName;
    const email = req.body.inputEmail;
    
    const data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_field: {
                    FNAME : firstname,
                    LNAME : secondname
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us6.api.mailchimp.com/3.0/lists/"+process.env.LIST_ID;

    const option = {
        method: "POST",
        auth: "th3gent1em4n:" + process.env.API_KEY
    }

    const request = https.request(url, option, function(response){
        
        if(response.statusCode === 200)
        {
            res.sendFile(__dirname +"/success.html", function(){
                console.log("Successfully Added");
            });
        }
        else{
            res.sendFile(__dirname +"/failure.html", function(){
                console.log("Uh! Oh! Failed");
            });
        }
        
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })
    console.log(request.status);
    request.write(jsonData);
    request.end();
});

app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Your server is running @ port:3000");
});


// 63d9f370238e47ba50bc5cc3bc65d742-us6
// e2a90ef793