const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Document = require("./models/Document");
dotenv.config();

const app = express();
mongoose.connect(process.env.MONGODB_URL);

//Using View engine
app.set("view engine", "ejs");

//MiddlewareStack
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    const code = `Welcome to WasteBin! 

Use the commands in top right corner
to create a new file to share with others.`;
    res.render("code-display", {
        code,
        language: "plaintext",
    });
});

app.get("/new", (req, res) => {
    res.render("new");
});

app.post("/save", async (req, res) => {
    const value = req.body.value;
    try {
        const document = await Document.create({ value });
        res.redirect(`/${document.id}`);
    } catch (error) {
        res.render("new", { value });
    }
});

app.get("/:id/duplicate", async (req, res) => {
    const id = req.params.id;
    try {
        const document = await Document.findById(id);
        res.render("new", {
            value: document.value,
        });
    } catch (error) {
        res.redirect(`/${id}`);
    }
});

app.get("/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const document = await Document.findById(id);
        res.render("code-display", { code: document.value, id });
    } catch (error) {
        res.redirect("/");
    }
});

app.listen(process.env.PORT);
