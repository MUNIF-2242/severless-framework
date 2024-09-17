const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

// Initialize DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.TODOS_TABLE;

// GET all todos
exports.getTodos = async (req, res) => {
  const params = { TableName };
  try {
    const data = await dynamoDB.scan(params).promise();
    res.json(data.Items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST a new todo
exports.createTodos = async (req, res) => {
  const { title } = req.body;
  const params = {
    TableName,
    Item: {
      id: uuidv4(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    },
  };
  try {
    await dynamoDB.put(params).promise();
    res.status(201).json(params.Item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET a single todo by ID
exports.getSingleTodos = async (req, res) => {
  const params = {
    TableName,
    Key: {
      id: req.params.id,
    },
  };
  try {
    const data = await dynamoDB.get(params).promise();
    if (!data.Item) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(data.Item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH (update) a todo by ID
exports.updateTodos = async (req, res) => {
  const { title, completed } = req.body;
  const params = {
    TableName,
    Key: {
      id: req.params.id,
    },
    UpdateExpression: "set #t = :title, completed = :completed",
    ExpressionAttributeNames: { "#t": "title" },
    ExpressionAttributeValues: {
      ":title": title,
      ":completed": completed,
    },
    ReturnValues: "ALL_NEW",
  };
  try {
    const data = await dynamoDB.update(params).promise();
    res.json(data.Attributes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE a todo by ID
exports.deleteTodos = async (req, res) => {
  const params = {
    TableName,
    Key: {
      id: req.params.id,
    },
  };
  try {
    await dynamoDB.delete(params).promise();
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
