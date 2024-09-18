const { dynamoDB, TableName } = require("../utils/awsConfig");
const { close } = require("../controllers/lex/lexUtils");

const handleGetTodosByKeyword = async (event) => {
  const keyword = event.currentIntent.slots.Keyword;
  const params = {
    TableName,
    FilterExpression: "contains(title, :keyword)",
    ExpressionAttributeValues: {
      ":keyword": keyword,
    },
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    if (data.Items.length === 0) {
      return close("Fulfilled", `No todos found with keyword "${keyword}".`);
    }

    const todoTitles = data.Items.map((item) => item.title).join(", ");
    return close(
      "Fulfilled",
      `Todos containing "${keyword}" are: ${todoTitles}`
    );
  } catch (error) {
    console.error("DynamoDB Error:", error);
    return close("Failed", "I couldn't retrieve your todos at the moment.");
  }
};

module.exports = handleGetTodosByKeyword;
