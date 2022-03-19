const express = require("express");
const hashFunction = require("./utilities/hashFunction");
const Order = require("./entities/order");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
const port = 8080;

const uri =
  "mongodb+srv://pigolitsyn:ASDFJfjfjwepoivjLKJSEPVAKWEJPAIOJ@cluster0.fit8g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose
  .connect(uri)
  .then(() => {
    console.log("successful connection to mongo atlas");
  })
  .catch((err) => console.error(err));

app.get("/:orderHash", async (req, res) => {
  const order = await Order.findOne({ hash: req.params.orderHash });
  if (order) {
    res.send(`
            <div style="margin: 1rem; padding: 1rem; -webkit-box-shadow: 0px 0px 15px -5px rgba(34, 60, 80, 0.57);
            -moz-box-shadow: 0px 0px 15px -5px rgba(34, 60, 80, 0.57);
            box-shadow: 0px 0px 15px -5px rgba(34, 60, 80, 0.57); border-radius: 4px; width: 300px">
                Id пользователя: ${order.userId}<br>
                Заказ пользователя: ${order.order}<br>
                Имя пользователя: ${order.username}<br>
                Время заказа: ${order.date.toTimeString()}<br>
                -------------------------------------<br><br>
                Хеш-сумма вашего заказа: ${order.hash}
            </div>`);
  } else {
    res.send("Заказ не был найден");
  }
});

app.post("/", async (req, res) => {
  const concatenatedString =
    req.body.userId + req.body.username + req.body.date + req.body.order;
  const hash = hashFunction(concatenatedString);
  await Order.create({
    hash: hash,
    userId: req.body.userId,
    username: req.body.username,
    date: req.body.date,
    order: req.body.order,
  }).catch((error) => console.error("error: " + error));
  res.send(hash);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});