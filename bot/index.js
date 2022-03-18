const { Telegraf } = require("telegraf");
const axios = require("axios");

const bot = new Telegraf(process.env.BOT_TOKEN);

const menuKeyboard = [
    [
        {
            text: "Кола",
            callback_data: "Cola",
        },
    ],

    [
        {
            callback_data: "Burger",
            text: "Бургер",
        },
        {
            callback_data: "Potato",
            text: "Картошка",
        },
        {
            callback_data: "Salad",
            text: "Салат",
        },
    ],
];

bot.start((ctx) => {
    bot.telegram.sendMessage(ctx.chat.id, "Меню", {
        reply_markup: {
            inline_keyboard: menuKeyboard,
        },
    }).then(message => console.log(message));
});

bot.on("callback_query", (ctx) => {
    axios
        .post(process.env.BACKEND_IP, {
            userId: ctx.update.callback_query.from.id,
            username: ctx.update.callback_query.from.username,
            date: Date.now().toString(),
            order: ctx.update.callback_query.data,
        })
        .then((response) => {
            const hash = response.data;
            bot.telegram.sendMessage(ctx.chat.id, "Ваш талон!", {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "тык!",
                                url: process.env.BACKEND_IP + hash,
                            },
                        ],
                    ],
                },
            }).then(message => console.log(message));
            ctx.answerCbQuery();
        })
        .catch((error) => {
            console.error("error was happened " + error);
        });
});

bot.launch().then(() => {
    console.log("bot was launched");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
