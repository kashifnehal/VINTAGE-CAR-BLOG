var express    = require("express"),
    methodoverride = require("method-override")
    app            = express(),
    bodyparser     = require("body-parser"),
    expresssanitizer = require("express-sanitizer");
    mongoose       = require("mongoose");

// APP CONFIG
mongoose.connect("mongodb://localhost:27017/restfullblogapp", { useNewUrlParser: true });
// mongoose.set('useFindAndModify', false);
app.use(express.static("public"));  //for css
app.use(bodyparser.urlencoded({extended: true}));
app.use(expresssanitizer());
app.use(methodoverride("_method"));
app.set("view engine","ejs");

//MONGOOSE/MODEL CONFIG
var blogschema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date, default:Date.now}
});


var blog = mongoose.model("blog",blogschema);

//RESTFUL ROUTES
// blog.create({
//     title:"test blog",
//     image:"https://images.thesouledstore.com/public/theSoul/uploads/catalog/product/1546674127_RahulS_KalMainUdega_TShirt_FrontMockUp.jpg",
//     body: "my favourite tshirt"
// });
 
app.get("/",function(req,res){
    res.redirect("/blogs");
});

//INDEX
app.get("/blogs",function(req,res){
    blog.find({},function(err,blogs){
        if(err){
            console.log("errror in this page")
        }else{
            res.render("index",{blogs:blogs});
        }
    })
});

//NEW ROUTE
app.get("/blogs/new",function(req,res){
    res.render("new");
});

//  CREATE
app.post("/blogs",function(req,res)
{
    // var name = req.body.blog[title];
    // var image = req.body.blog[image];                  ==>> dont need this coz we have used blog[...] in new.ejs
    // var desc = req.body.blog[body];
    // var newcamp = {name:name , image:image, description:desc};

    //using database
    // console.log(req.body);
    // console.log("=======");
    // console.log(req.body);
    blog.create(req.body.blog,function(err,newblog){
        if(err){
            res.render("new")
        }else{
            //redirecting to campgrounds
            res.redirect("/blogs");
        }
    })
});

app.get("/blogs/:id",function(req,res){
    // res.send("this is working");
    blog.findById(req.params.id,function(err,foundblog){
        if(err){
            console.log("there is an error");
        }else{
            res.render("show", {blog:foundblog});
        }
    })
});

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
    blog.findById(req.params.id,function(err,foundblog){
        if(err){
            console.log("there is an error");
        }else{
            res.render("edit", {blog:foundblog});
        }
    })
});

//UPDATE
app.put("/blogs/:id",function(req,res){
    // res.send("edit page reached")
    req.body.blog.body = req.sanitize(req.body.blog.body);
    blog.findOneAndUpdate(req.params.id, req.body.blog, function(err,updateblog){
        if(err){
            res.send("there is an error");
        }else{
            res.redirect("/blogs/ + req.params.id");
        }
    })
});

//DELETE
app.delete("/blogs/:id",function(req,res){
    blog.findOneAndDelete(req.params.id,function(err){
        if(err){
            res.send("there is an error in delete");
        }else{
            res.redirect("/blogs");
        }
    })
})

app.listen(3000,function()
{
    console.log("port started");
});