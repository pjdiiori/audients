if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

const multer = require('multer');
const { storage } = require('./cloudindary');
const upload = multer({ storage })

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    try {
        const audients = await db.query('SELECT * FROM audios');
        res.status(200).json({
            status: "success",
            results: audients.rows.length,
            audients: audients.rows
        });
    } catch (err) { console.log(err); }
})


app.post("/upload", upload.single('audioFile'), async (req, res) => {
    // console.log(req.body, req.file);
    try {
        const query = "INSERT INTO\
            audios(title, artist, description, src)\
            VALUES ($1, $2, $3, $4)\
            RETURNING *"
        const {title, artist, description} = req.body;
        const src = req.file.path;
        console.log(req.file);
        const newAudient = await db.query(query, [title, artist, description, src])
        res.status(201).json({
            status: "success",
            audient: newAudient.rows[0]
        })
    } catch (error) {
        console.log(error);
        res.status(400);
    }
})

app.delete("/:id/delete", async (req, res) => {
    try {
        const query = "DELETE FROM audios WHERE id = $1"
        await db.query(query, [req.params.id]);
        res.status(204).json({status:'success'})
    } catch (error) {
        console.log(error);
    }
})

const port = process.env.PORT
// const port = 3000
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})