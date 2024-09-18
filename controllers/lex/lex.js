const handleGreetUser = require("../../intentHandlers/greetUser");
const handleGetTodosByKeyword = require("../../intentHandlers/getTodosByKeyword");
const handleGetTodosForDate = require("../../intentHandlers/getTodosForDate");
const { close } = require("./lexUtils");

const handleLexRequest = async (event) => {
  try {
    const intentName = event.currentIntent.name;

    switch (intentName) {
      case "GreetUser":
        return await handleGreetUser(event);
      case "GetTodosForDate":
        return await handleGetTodosForDate(event);
      case "GetTodosByKeyword":
        return await handleGetTodosByKeyword(event);
      default:
        return close("Failed", "Sorry, I didn't understand that request.");
    }
  } catch (error) {
    console.error("Lex Fulfillment Error:", error);
    return close("Failed", "There was an error fulfilling your request.");
  }
};

module.exports = { handleLexRequest };
