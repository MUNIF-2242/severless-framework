// intentHandlers/getTodosForDate.js
const { dynamoDB, TableName } = require("../utils/awsConfig");
const { close } = require("../controllers/lex/lexUtils");

const handleGetTodosForDate = async (event) => {
  const date = event.currentIntent.slots.TodoDate;
  const params = {
    TableName,
    FilterExpression: "contains(createdAt, :date)",
    ExpressionAttributeValues: {
      ":date": date,
    },
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    if (data.Items.length === 0) {
      return close("Fulfilled", `You have no todos for ${date}.`);
    }

    const todoTitles = data.Items.map((item) => item.title).join(", ");
    return close("Fulfilled", `Your todos for ${date} are: ${todoTitles}`);
  } catch (error) {
    console.error("DynamoDB Error:", error);
    return close("Failed", "I couldn't retrieve your todos at the moment.");
  }
};

module.exports = handleGetTodosForDate;
