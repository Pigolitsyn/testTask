const express = require("express")
const hashFunction  = require("./utilities/hashFunction")
const { Order } = require("./entities/order")

const app = express()
app.use(express.json())
const port = 8080

const mongoose = require("mongoose")
const uri = "mongodb+srv://pigolitsyn:ASDFJfjfjwepoivjLKJSEPVAKWEJPAIOJ@cluster0.fit8g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

mongoose.connection.close()

mongoose.connect(uri).then(() => {
    console.log("successful connection to mongo atlas")
}).catch(err => console.log(err));


app.get("/:order", async (req, res) => {
    const order = await Order.findOne({hash: req.params.order})
    if (order) {
        res.send(`
            <div>
                Id пользователя: ${order.userId}<br>
                Заказ пользователя: ${order.order}<br>
                Имя пользователя: ${order.username}<br>
                Время заказа: ${order.date.toTimeString()}
            </div>`
        )
    } else {
        res.send("Заказ не был найден")
    }
})

app.post("/", async (req, res) => {
    console.log("Request")
    const concatenatedString = req.body.userId + req.body.username + req.body.date + req.body.order
    const hash = hashFunction(concatenatedString);
    await Order.create({
        hash: hash,
        userId: req.body.userId,
        username: req.body.username,
        date: req.body.date,
        order: req.body.order,
    }).catch(error => console.error("error: " + error))
    res.send(hash)
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})