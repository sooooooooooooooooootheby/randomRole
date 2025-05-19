import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();

const allowedOrigins = [
    "https://github.com/sooooooooooooooooootheby",
    "http://localhost",
    "http://127.0.0.1"
];

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

// 必须导出为模块而不是监听端口
export default app;