const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
//middleware
app.use(cors());
app.use(express.json());

//routes

//create a todo
app.post("/todos", async(req, res)=>{
    try {
        const {description} = req.body;
        const newTODO = await pool.query("INSERT INTO tododb {description} VALUES($1) RETURNING *;", [description]); 
        res.json(newTODO.rows[0]);
    } catch (e) {
        console.error(e.message);
    }
})
//get all todos
app.get("/todos", async(req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM tododb;");
        res.json(allTodos.rows);
    } catch (error) {
        console.error(error.message);
    }
})
//get a todo
app.get("/todos/:id", async(req, res)=>{
    try {
        const{id} = req.params;
        const todo = await pool.query("SELECT * FROM tododb WHERE todo_id = $1;",[id])
        res.json(todo.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
})
//update a todo
app.put("/todos/:id", async(req, res)=>{
    try {
        const{id} = req.params;
        const{description} = req.body;
        const updateTable = await pool.query("UPDATE tododb SET description = $1 WHERE todo_id = $2;", [description, id]);
        req.json("Todo was updated.");
    } catch (error) {
        console.error(error.message);
    }
})
//delete a todo
app.delete("/todos/:id", async(req, res) =>{
    const {id} = req.params;
    const deleteTodo = await pool.query("DELETE FROM tododb WHERE todo_id = $1;",[id]);
    req.json("Requested todo was deleted.");
})

app.listen(5000, ()=>{
    console.log("server has started on port 5000");
})