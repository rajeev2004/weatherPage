import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
const app=express();
const port=3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const api="d31057db82d2e2d95b457f2677d496e1";
app.get("/",async(req,res)=>{
    res.render("index.ejs");
});
app.post("/details",async(req,res)=>{
    var cityname=req.body.city;
    try{
        const response=await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=1&appid=${api}`);
        var latitude=JSON.stringify(response.data[0].lat);
        var longitude=JSON.stringify(response.data[0].lon);
        const response1=await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api}`)
        res.render("weatherdetails.ejs",{
            name:response1.data.name,
            humidity:response1.data.main.humidity,
            windspeed:response1.data.wind.speed,
            visibility:response1.data.visibility,
            temp:response1.data.main.temp,
            weather:response1.data.weather[0].main,
        });
    }catch(error){
        console.error("failed to make req:",error.message);
        res.render("index.ejs",{
            error:error.message,
        });
    }
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});