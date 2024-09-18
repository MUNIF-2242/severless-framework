const express = require("express");
const AWS = require("aws-sdk");
const bodyParser = require("body-parser");
const serverless = require("serverless-http");
const todosRoutes = require("./routes/todos");
const lexRoutes = require("./routes/lex"); // Import the new Lex routes

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Initialize the Express app
const app = express();

app.use(bodyParser.json());

// Todos Routes
app.use("/todos", todosRoutes);

// Lex Fulfillment Routes
app.use("/lex", lexRoutes); // Use the new Lex routes

// Export the app as a lambda handler
module.exports.ToDohandler = serverless(app);
