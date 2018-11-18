const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID;

const logError = (err) => {
    if (err) return console.log(err)
}

const logMessage = (message) => {
    console.log(message)
}

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.set('view engine', 'ejs')

const database = 'nba'
const table = 'quotes'

var db
var uri = 'mongodb+srv://farzanurifan:bismillah@bdt-6ij3v.mongodb.net/test'
MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
    logError(err)
    db = client.db(database)
})

app.listen(3000, () => {
    logMessage('listening on 3000')
})

app.get('/', (req, res) => {
    res.redirect('/page/1')
})

app.get('/page/:page', (req, res) => {
    var page = Number(req.params.page)
    db.collection(table).find().toArray((err, results) => {
        var alldata = results.length
        db.collection(table).find().skip(10 * (page - 1)).limit(10).toArray((err, results) => {
            res.render('index.ejs', { results, page, alldata })
        })
    })
})

app.get('/add', (req, res) => {
    res.render('add.ejs')
})

app.post('/create', (req, res) => {
    db.collection(table).save(req.body, (err, result) => {
        logError(err)
        logMessage('saved to database')
        res.redirect('/')
    })
})

app.get('/edit/:id', (req, res) => {
    var id = ObjectId(req.params.id)
    db.collection(table).find(id).toArray((err, results) => {
        result = results[0]
        res.render('edit.ejs', { result })
    })
})

app.put('/update/:id', (req, res) => {
    var id = ObjectId(req.params.id)
    db.collection(table).updateOne({ _id: id }, { $set: req.body }, (err, result) => {
        logError(err)
        logMessage('updated to database')
        res.redirect('/')
    })
})

app.delete('/delete/:id', (req, res) => {
    var id = ObjectId(req.params.id)
    db.collection(table).deleteOne({ _id: id }, (err, result) => {
        logError(err)
        logMessage('deleted from database')
        res.redirect('/')
    })
})