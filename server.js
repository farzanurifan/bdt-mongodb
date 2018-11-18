const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const express = require('express')
const partials = require('express-partials')
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID;

const database = 'bdt'
const table = 'nba'
const pageItem = 10

const logError = (err) => { if (err) return console.log(err) }
const logMessage = (message) => console.log(message)

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.set('view engine', 'ejs')
app.use(partials())

var db
var uri = 'mongodb+srv://farzanurifan:bismillah@bdt-6ij3v.mongodb.net/test'
MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
    logError(err)
    db = client.db(database)
})

app.listen(3000, () => logMessage('listening on 3000'))

app.get('/', (req, res) => res.redirect('/page/1'))

app.get('/page/:page', (req, res) => {
    var page = Number(req.params.page)
    db.collection(table).find().count((err, results) => {
        var pages = Math.ceil(results / pageItem)
        let first = 2
        let last = 9
        if (page > 6 && !(page > pages - 6)) {
            first = page - 3
            last = page + 3
        }
        else if (page > pages - 6) {
            first = pages - 8
            last = pages - 1
        }
        db.collection(table).find().skip(pageItem * (page - 1)).limit(pageItem).toArray((err, results) => {
            res.render('index.ejs', { results, page, pages, first, last })
        })
    })
})

app.get('/add', (req, res) => res.render('add.ejs'))

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