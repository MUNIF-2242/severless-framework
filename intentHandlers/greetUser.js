const { close } = require("../controllers/lex/lexUtils");

const handleGreetUser = async (event) => {
  const userName = event.currentIntent.slots.UserName;

  if (!userName) {
    return close("Fulfilled", "Hello! What's your name?");
  }

  return close(
    "Fulfilled",
    `Hello ${userName}! How can I assist you today for your todos?`
  );
};

module.exports = handleGreetUser;
