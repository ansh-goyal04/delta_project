const express=require('express');
const app=express();
const session=require('express-session');
const flash= require('connect-flash');


app.use(session({secret:'secretcode',saveUninitialized:true,resave:false}));

app.listen(300,()=>{
    console.log('listening to port 300');

});

app.get('/register',(req,res)=>{
    let {name='ansh'}=req.query;
    req.session.name=name;
    res.send(name);
});

app.get('/hello',(req,res)=>{
    res.send(`hello ${req.session.name}`);
})