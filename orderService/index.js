const express = require("express")
const app = express()
const port = 8080

const mongoose = require("mongoose")
const uri = "mongodb+srv://pigolitsyn:ASDFJfjfjwepoivjLKJSEPVAKWEJPAIOJ@cluster0.fit8g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

mongoose.connect(uri).then(() => {
    console.log("successful connection to mongo atlas")
}).catch(err => console.log(err));

const OrderSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    username: {
        type: String,
    },
    order: {
        type: String,
    },
    date: {
        type: Date,
    },
    hash: {
        type: String,
        unique: true,
    }
})

const Order = mongoose.model('Order', OrderSchema)

const hashFunction = s => {
    let a = 1, c = 0, h, o;
    if (s) {
        a = 0;
        for (h = s.length - 1; h >= 0; h--) {
            o = s.charCodeAt(h);
            a = (a<<6&268435455) + o + (o<<14);
            c = a & 266338304;
            a = c!==0?a^c>>21:a;
        }
    }
    return String(a);
};

app.use(express.json())

app.get("/:order", async (req, res) => {
    console.log(req.params.order)
    const order = await Order.findOne({hash: req.params.order})
    res.send(order)
})

app.post("/", async (req, res) => {
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