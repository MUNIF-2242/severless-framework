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

module.exports = { close };
