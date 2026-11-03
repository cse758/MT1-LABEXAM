
import express from "express";

const app = express();
const PORT = 4000;

app.use(express.json());

let tasks = [
    {
        id: 1,
        taskName: "Develop Login Page",
        assignedTo: "Rahul Sharma",
        status: "Pending",
        priority: "High"
    },
    {
        id: 2,
        taskName: "Create Dashboard",
        assignedTo: "Priya Verma",
        status: "In Progress",
        priority: "Medium"
    },
    {
        id: 3,
        taskName: "Test Application",
        assignedTo: "Amit Kumar",
        status: "Completed",
        priority: "Low"
    }
];

// GET all tasks
app.get("/tasks", (req, res) => {
    res.status(200).json(tasks);
});

// GET task by ID
app.get("/tasks/:id", (req, res) => {
    const task = tasks.find(
        t => t.id === Number(req.params.id)
    );

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    res.status(200).json(task);
});

// POST new task
app.post("/tasks", (req, res) => {
    const { id, taskName, assignedTo, status, priority } = req.body;

    if (
        id === undefined ||
        !taskName ||
        !assignedTo ||
        !status
    ) {
        return res.status(400).json({
            message: "All required fields must be provided"
        });
    }

    if (tasks.some(t => t.id === Number(id))) {
        return res.status(409).json({
            message: "Task ID already exists"
        });
    }

    const newTask = {
        id: Number(id),
        taskName,
        assignedTo,
        status,
        priority: priority || "Medium"
    };

    tasks.push(newTask);

    res.status(201).json({
        message: "Task added successfully",
        task: newTask
    });
});

// PUT update task
app.put("/tasks/:id", (req, res) => {
    const task = tasks.find(
        t => t.id === Number(req.params.id)
    );

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    const { taskName, assignedTo, status, priority } = req.body;

    if (
        (taskName !== undefined && !taskName.trim()) ||
        (assignedTo !== undefined && !assignedTo.trim()) ||
        (status !== undefined && !status.trim()) ||
        (priority !== undefined && !priority.trim())
    ) {
        return res.status(400).json({
            message: "Invalid task details"
        });
    }

    if (taskName !== undefined) task.taskName = taskName;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;

    res.status(200).json({
        message: "Task updated successfully",
        task
    });
});

// DELETE task
app.delete("/tasks/:id", (req, res) => {
    const index = tasks.findIndex(
        t => t.id === Number(req.params.id)
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    const deletedTask = tasks.splice(index, 1);

    res.status(200).json({
        message: "Task deleted successfully",
        task: deletedTask[0]
    });
});

app.listen(PORT, () => {
    console.log(`Express Server running at http://localhost:${PORT}`);
});
