const router = require("express").Router()
const uuid = require("uuid");
const Pool = require('pg').Pool

console.log(process.env.DB_HOST)

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PWD,
    port: process.env.DB_PORT,
})

router.get("/", (req, res) => {
    pool.query("SELECT * FROM event", (error, result) => {
        if(error) throw error;
        res.status(200).json({ events: result.rows })
    })
})

router.post("/", (req, res) => {
    const ID = uuid.v4(), name = req.body.name, author = req.body.author;
    pool.query("INSERT INTO event (id, name, author) VALUES ($1, $2, $3)", [ID, name, author], (error) => {
        if(error) throw error;
        res.status(201).json({ name, id: ID, author })
    });    

});

router.put("/:idThing", (req, res) => {
    const { name, author } = req.body
    pool.query("UPDATE event SET name = $1, author = $2 WHERE id = $3", [name, author, req.params.idThing], (error) => {
        if(error) throw error;
        res.status(200).json({ success: true })
    })
});

router.delete("/:idThing", (req, res) => {
    pool.query("DELETE FROM event WHERE id = $1", [req.params.idThing], (error) => {
        if(error) throw error;
        res.status(200).json({ success: true })
    })
});

module.exports = router