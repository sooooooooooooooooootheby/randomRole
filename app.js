import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const allowedOrigins = [
    "https://github.com/sooooooooooooooooootheby",
    "http://localhost",
    "http://127.0.0.1"
];
const PORT = 3006;

const role = [];
const roleDir = path.resolve("./role");
function readDirRecursive(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(readDirRecursive(filePath));
        } else {
            results.push(filePath);
        }
    });
    return results;
}
role.push(...readDirRecursive(roleDir));

const app = express();

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error("Not allowed by CORS"));
        }
    }
}));

app.get("/", async (req, res) => {
    const imageFiles = role.filter(file =>
        /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(file)
    );
    if (imageFiles.length === 0) {
        return res.status(404).send("No image files found.");
    }
    const randomIndex = Math.floor(Math.random() * imageFiles.length);
    const randomImagePath = imageFiles[randomIndex];
    res.sendFile(randomImagePath);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
