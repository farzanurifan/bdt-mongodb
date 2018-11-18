const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID;

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.set('view engine', 'ejs')

var db
var uri = 'mongodb+srv://farzanurifan:bismillah@bdt-6ij3v.mongodb.net/test'
MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
    if (err) return console.log(err)
    db = client.db('nba')
})

app.listen(3000, () => {
    console.log('listening on 3000')
})

app.get('/', (req, res) => {
    res.redirect('/page/1')
})

app.get('/page/:page', (req, res) => {
    let alldata = 0
    var page = Number(req.params.page)
    db.collection('quotes').find().toArray((err, results) => {
        alldata = results.length
        db.collection('quotes').find().skip(10 * (page - 1)).limit(10).toArray((err, results) => {
            res.render('index.ejs', { quotes: results, page, alldata })
        })
    })
})

app.get('/add', (req, res) => {
    res.render('add.ejs')
})

app.post('/create', (req, res) => {
    db.collection('quotes').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('saved to database')
        res.redirect('/')
    })
})

app.get('/edit/:id', (req, res) => {
    var id = ObjectId(req.params.id)
    db.collection('quotes').find(id).toArray((err, results) => {
        result = results[0]
        res.render('edit.ejs', { quote: result })
    })
})

app.put('/update/:id', (req, res) => {
    var id = ObjectId(req.params.id)
    db.collection('quotes').updateOne({ _id: id }, { $set: req.body }, (err, result) => {
        if (err) return console.log(err)

        console.log('updated to database')
        res.redirect('/')
    })
})

app.delete('/delete/:id', (req, res) => {
    var id = ObjectId(req.params.id)
    db.collection('quotes').deleteOne({ _id: id }, (err, result) => {
        if (err) return console.log(err)

        console.log('deleted from database')
        res.redirect('/')
    })
})