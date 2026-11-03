
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let tasks = [
    {
        id: 1,
        taskName: "Develop Login Page",
        assignedTo: "Rahul Sharma",
        status: "Pending"
    },
    {
        id: 2,
        taskName: "Create Dashboard",
        assignedTo: "Priya Verma",
        status: "In Progress"
    },
    {
        id: 3,
        taskName: "Test Application",
        assignedTo: "Amit Kumar",
        status: "Completed"
    }
];

const server = http.createServer((req, res) => {

    if (req.method === "GET" && req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h1>Welcome to Employee Task Management Application</h1>");
    }

    else if (req.method === "GET" && req.url === "/tasks") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(tasks));
    }

    else if (req.method === "GET" && req.url === "/about") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h1>Employee Task Management Application</h1><p>Manage employee tasks easily.</p>");
    }

    else if (req.method === "GET" && req.url === "/home") {

        const filePath = path.join(__dirname, "public", "index.html");

        fs.readFile(filePath, "utf8", (err, data) => {

            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                return res.end("Error reading HTML file");
            }

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });
    }

    else if (req.method === "POST" && req.url === "/add-task") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const task = JSON.parse(body);

                if (
                    task.id === undefined ||
                    !task.taskName ||
                    !task.assignedTo ||
                    !task.status
                ) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({
                        message: "All fields are required"
                    }));
                }

                if (tasks.some(t => t.id === Number(task.id))) {
                    res.writeHead(409, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({
                        message: "Task ID already exists"
                    }));
                }

                tasks.push(task);

                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    message: "Task added successfully",
                    task: task
                }));

            } catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    message: "Invalid JSON"
                }));
            }
        });
    }

    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Route Not Found");
    }

});

server.listen(3000, () => {
    console.log("HTTP Server running at http://localhost:3000");
});
