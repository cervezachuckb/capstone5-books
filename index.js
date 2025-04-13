import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;

const API_URL = "https://covers.openlibrary.org/b/isbn/";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "readBooks",
  password: "6138blancA4&",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

app.get("/", async (req, res) => {
  let today = new Date();
  let month = months[today.getMonth()];
  let weekday = days[today.getDay()];
  let day = today.getDate();
  try {
    const result = await db.query("SELECT * FROM books ORDER BY id ASC");
    items = result.rows;
    console.log(result.rows);
    
    res.render("index.ejs", {
    listTitle: weekday + " " + month + " " + day,
    listBooks: items
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/addABook", async (req, res) => {
    res.render("addBook.ejs");
});

app.post("/add", async (req, res) => {
  const item = req.body.newBook;
  const item2 = req.body.newBookFirst;
  const item3 = req.body.newBookLast;
  const item4 = req.body.newBookisbn;
  await db.query("INSERT INTO books (bookTitle, authorFirstName, authorLastName) VALUES ($1, $2, $3)", [item, item2, item3])
  res.redirect("/");
});

// app.post("/edit", async (req, res) = {
// const newTask = req.body.updatedItemTitle;
// const newTaskId = req.body.updatedItemId;
// await db.query("UPDATE items SET title = ($1) WHERE id = ($2)", [newTask, newTaskId]);
// res.redirect("/");
// });


// app.post("/delete", async (req, res) = {
// const deleteTask = req.body.deleteItemId;
// await db.query("DELETE FROM items WHERE id = ($1)", [deleteTask]);
// });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
