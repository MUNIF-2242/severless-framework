const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.TODOS_TABLE;

module.exports = { AWS, dynamoDB, TableName };
