const { config } = require("dotenv");
config();

const getBotToken = () => {
  if (process.env.BOT_TOKEN) {
    return process.env.BOT_TOKEN;
  }
  throw new Error("BOT_TOKEN must be provided!");
};

const getBackendUrl = () => {
  if (process.env.BACKEND_URL) {
    return process.env.BACKEND_URL;
  }
  throw new Error("BACKEND_URL must be provided!");
};

module.exports = {
  botToken: getBotToken(),
  backendUrl: getBackendUrl(),
};