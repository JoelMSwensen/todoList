//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://Onyx_Admin:Minda@1998@cluster0-ll84a.mongodb.net/todolistDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = new mongoose.model("Item", itemsSchema);

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("list", listSchema);

app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems) {

      res.render("list", {
        listTitle: "Today",
        newListItems: foundItems
      });
    // }
  })
});

app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, function(err, foundList){
    if(!err){
      if(!foundList){
        const list = new List({
          name: customListName,
          items:[]
        });
        list.save();
        res.redirect("/" + customListName);
      }else{
        res.render("list",{listTitle: foundList.name, newListItems: foundList.items});
      }
    }
  });
});



app.post("/", function(req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if(listName === "Today"){
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList){
      let x = foundList.items;
      x.push(item);
      //for some reason foundList.items.push(item)
      //was giving the error "can't push to undefined. using a mid let (x) solved it"
      foundList.save();
      res.redirect("/" + listName);
    })
  }


});

// app.get("/work", function(req, res) {
//   res.render("list", {
//     listTitle: "Work List",
//     newListItems: workItems
//   });
// });

// app.get("/lists", function(req,res){
//   res.render("lists");
// })

// app.get("/lists/:newList/", function(req,res){
//   const listName = req.params.newList;
//   console.log(listName);
//   res.render("list", {
//     listTitle: listName
//   })
//
// })

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err){
      if (!err) {
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (!err){
        res.redirect("/" + listName);
      }
    });
  }


});

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
