const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient
app.use(bodyParser.urlencoded({ extended: true }))


var db
var uri = 'mongodb+srv://farzanurifan:bismillah@bdt-6ij3v.mongodb.net/test'

MongoClient.connect(uri, (err, client) => {
    if (err) return console.log(err)
    db = client.db('nba')

    app.listen(3000, () => {
        console.log('listening on 3000')
    })

    app.get('/', (req, res) => {
        db.collection('quotes').find().toArray(function (err, results) {
            console.log(results)
            // send HTML file populated with quotes here
            res.sendFile(__dirname + '/index.html')
        })
    })

    app.post('/quotes', (req, res) => {
        console.log(req.body)
        db.collection('quotes').save(req.body, (err, result) => {
            if (err) return console.log(err)

            console.log('saved to database')
            res.redirect('/')
        })
    })
})

