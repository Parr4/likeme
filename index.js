import express from "express";
import fs from "fs";
const app = express();
import cors from "cors";
app.use(express.json());
app.use(cors());

import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "Fparr41616",
  database: "likeme",
  allowExitOnIdle: true,
});

const getDate = async () => {
  const result = await pool.query("SELECT NOW()");
  console.log(result);
};

getDate();

app.get("/posts", (req, res) => {
  try {
    const data = fs.readFileSync("./src/db/posts.json", "utf-8");
    const posts = JSON.parse(data);
    res.json(posts);
    console.log(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/posts", (req, res) => {
  try {
    const data = fs.readFileSync("./src/db/posts.json", "utf-8");
    const posts = JSON.parse(data);
    const newPost = req.body;
    posts.push(newPost);
    fs.writeFileSync("./src/db/posts.json", JSON.stringify(posts));
    res.status(201).send("Nuevo post creado");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/posts/:id", (req, res) => {
  try {
    const postId = req.params.id;
    const data = fs.readFileSync("./src/db/posts.json", "utf-8");
    const posts = JSON.parse(data);
    // console.log(posts.filter(item => item.id != postId));
    const postfiltro = posts.filter(item => item.id != postId);
    console.log("filtro" , postfiltro);
    fs.writeFileSync("./src/db/posts.json",
      JSON.stringify(postfiltro)
    );
    res.send("Post Eliminado");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/posts/like/:id", (req, res) => {
    try{
        const postId = req.params.id
        const data = fs.readFileSync("./src/db/posts.json", "utf-8");
        const posts = JSON.parse(data);
        const postIndex =  posts.findIndex((post) => parseInt(post.id) === parseInt(postId));
        const postLike = posts[postIndex].likes ? posts[postIndex].likes : false
        // if (postLike === undefined){postLike = false}
        console.log(postLike)
        const post = posts[postIndex]
        // postLike = !postLike
        if (postIndex === -1) {
            res.status(404).json({ error: "Post no encontrado" });
          } else {
            posts[postIndex] = {
              ...posts[postIndex].likes = !postLike,
              ...post
              
            };
            fs.writeFileSync("./src/db/posts.json", JSON.stringify(posts));
            res.json(postLike).send("like actualizado").status(200);
    }
} catch(error) {
    res.status(500).json({ error: error.message });
  }})

app.listen(3000, console.log("¡Servidor encendido!"));
