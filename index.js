const express = require("express");
const app = express();
const dotenv = require('dotenv');
const connectDatabase = require("./config/dataBase");
const TodoTask = require("./model/TodoTask");

dotenv.config({ path: './config/config.env' });

// Connecting to database
connectDatabase();

app.set("view engine", "ejs");
const path = require('path')
// app.use('/static', express.static(path.join(__dirname, 'public')))
app.use("/static", express.static("public"));

// Urlencoded will allow us to extract the data from the form by adding her to the body property of the request.
app.use(express.urlencoded({ extended: true }));

app.post('/', async (req, res) => {
    // console.log(req.body);
    const todoTask = new TodoTask({
        content: req.body.content
    });

    try {
        await todoTask.save();
        res.redirect("/");
        console.log(todoTask);
    } catch (error) {
        res.redirect("/");
    }
});

app.get('/', (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});

// UPDATE
app.route("/edit/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
        res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
}).post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    })
})

// DELETE
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/")
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
});
