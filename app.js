//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = new mongoose.model("Item", itemsSchema);


app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems) {

      res.render("list", {
        listTitle: "Today",
        newListItems: foundItems
      });
    // }
  })
});

app.post("/", function(req, res) {

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });
  item.save();
  res.redirect("/");

});

app.get("/work", function(req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems
  });
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.post("/delete", function(req,res){
  const checkedItemId = req.body.checkbox
  Item.findByIdAndDelete(checkedItemId, function(err){
  if(!err){
    console.log("Item deleted")
  }
  res.redirect("/")
  })

})
app.listen(3000, function() {
  console.log("Server started on port 3000");
});


    // if (foundItems.length === 0) {
    //   Item.insertMany(defaultItems, function(err) {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       console.log("Successfully saved all items to todolistDB");
    //     }
    //   });
    // } else {

    //
    // const item1 = new Item({
    //   name: "Welcome to your ToDo List"
    // });
    // const item2 = new Item({
    //   name: "Hit the + the button to add a new item"
    // });
    // const item3 = new Item({
    //   name: "<-- Hit this to delete and item"
    // });
    //
    // const defaultItems = [item1, item2, item3];
    //
    // const item4 = new Item({
    //   name: "Some new content"
    // });
    // const item5 = new Item({
    //   name: "Even more"
    // });
    // const item6 = new Item({
    //   name: "Gimme more"
    // });
    //
    // const newItems = [item4, item5, item6];

    // Item.insertMany(newItems, function(err) {
    //   if (err) {
    //     console.log(err)
    //   } else {
    //     console.log(newItems)
    //   }
    //
    // })
