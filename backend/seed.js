require("dotenv").config();
const mongoose = require("mongoose");
const Task = require("./src/models/Task");

const sampleTasks = [
  {
    title: "Learn Linux",
    description: "Practice Linux commands and shell scripting",
    priority: "medium",
    status: "completed"
  },
  {
    title: "Learn Docker",
    description: "Build and run the Task Manager containers",
    priority: "high",
    status: "pending"
  },
  {
    title: "Build Jenkins Pipeline",
    description: "Create CI/CD for the application",
    priority: "high",
    status: "pending"
  },
  {
    title: "Learn Terraform",
    description: "Create AWS infrastructure as code",
    priority: "medium",
    status: "in-progress"
  },
  {
    title: "Deploy to AWS",
    description: "Deploy the application to ECS",
    priority: "high",
    status: "pending"
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Task.deleteMany({});
  await Task.insertMany(sampleTasks);
  console.log("Sample tasks inserted.");
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
