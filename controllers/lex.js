const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.TODOS_TABLE;

// Main handler function for AWS Lex fulfillment
exports.handleLexRequest = async (event) => {
  try {
    const intentName = event.currentIntent.name;

    switch (intentName) {
      case "GreetUser":
        return await handleGreetUser(event);
      case "GetTodosForDate": // Handle by date
        return await handleGetTodosForDate(event);
      case "GetTodosByKeyword": // Handle by keyword
        return await handleGetTodosByKeyword(event);
      default:
        return close("Failed", "Sorry, I didn't understand that request.");
    }
  } catch (error) {
    console.error("Lex Fulfillment Error:", error);
    return close("Failed", "There was an error fulfilling your request.");
  }
};

// Handle "GetTodosByKeyword" intent
const handleGetTodosByKeyword = async (event) => {
  const keyword = event.currentIntent.slots.Keyword; // Assuming Lex passes the keyword in slots
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

// Handle "GreetUser" intent
const handleGreetUser = async (event) => {
  const userName = event.currentIntent.slots.UserName; // User's name slot

  if (!userName) {
    // If userName slot is empty, ask for user's name
    return close("Fulfilled", "Hello! What's your name?");
  }

  // If userName is provided, greet the user and proceed
  return close("Fulfilled", `Hello ${userName}! How can I assist you today?`);
};

// Handle "GetTodosForDate" intent
const handleGetTodosForDate = async (event) => {
  const date = event.currentIntent.slots.TodoDate; // Assuming Lex passes the date in slots
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

// Helper function to format a response for AWS Lex
const close = (fulfillmentState, message) => {
  return {
    dialogAction: {
      type: "Close",
      fulfillmentState: fulfillmentState,
      message: {
        contentType: "PlainText",
        content: message,
      },
    },
  };
};
