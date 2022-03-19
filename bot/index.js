const { Telegraf } = require("telegraf");
const axios = require("axios");
const { botToken, backendUrl } = require("./token");

const bot = new Telegraf(botToken);

const menuKeyboard = [
  [
    {
      text: "Кола",
      callback_data: "Кола",
    },
  ],

  [
    {
      callback_data: "Бургер",
      text: "Бургер",
    },
    {
      callback_data: "Картошка",
      text: "Картошка",
    },
    {
      callback_data: "Салат",
      text: "Салат",
    },
  ],
];

bot.start((ctx) => {
  bot.telegram
    .sendMessage(ctx.chat.id, "Меню", {
      reply_markup: {
        inline_keyboard: menuKeyboard,
      },
    });
});

bot.on("callback_query", (ctx) => {
  axios
    .post(`http://${backendUrl}`, {
      userId: ctx.update.callback_query.from.id,
      username: ctx.update.callback_query.from.username,
      date: Date.now().toString(),
      order: ctx.update.callback_query.data,
    })
    .then((response) => {
      bot.telegram.sendMessage(ctx.chat.id, `Ваш заказ: ${ctx.update.callback_query.data}\nНажмите кнопку для получения чека`, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Чек",
                url: `${backendUrl}/${response.data}`,
              },
            ],
          ],
        },
      });
    })
    .catch((error) => {
      console.error("error: " + error);
    });
});

bot.launch().then(() => {
  console.info("bot was launched");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));