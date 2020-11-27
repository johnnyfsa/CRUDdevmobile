const express = require('express')
const app = express()
const bodyparse = require('body-parser')
const { ObjectId } = require('mongodb')
const objectID = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://teste:teste123@cluster0.cpmfz.mongodb.net/crud?retryWrites=true&w=majority"

MongoClient.connect(uri, (err, client) => 
{
    if(err)
    return console.log(err)
    db = client.db('crud')

    app.listen(3000, ()=>
    {
        console.log('Servidor rodando na porta 3000')
    })
})

app.use(bodyparse.urlencoded({extended: true}))

app.use(express.static('public'));

app.set('view engine','ejs')

app.route('/edit/:id')
.get((req, res)=>
{
    var id = req.params.id
    db.collection('pessoas').find(ObjectId(id)).toArray(
        (err, result)=>
        {
            if(err) return console.log(err)
            res.render('edit', {data:result})
        })
})

app.route('/edit/:id')
.post((req, res)=>
{
    var id = req.params.id
    var nome = req.body.nome
    var sobrenome = req.body.sobrenome
    var birthday = req.body.birthday
    var gender = req.body.gender
    var email = req.body.email
    var phone = req.body.phone
    var city = req.body.city
    var nick = req.body.nick
    db.collection('pessoas').updateOne(
        {
            _id: ObjectId(id)
        },
        {
            $set:{
                nome: nome,
                sobrenome: sobrenome,
                birthday : birthday,
                gender: gender,
                email: email,
                phone: phone,
                city: city,
                nick: nick
            }
        }, (err, result) =>{
            if(err) return console.log(err)
            res.redirect('/show')
            console.log('Banco atualizado com Sucesso')
        }
    )
})



app.get('/show', (req, res)=>
{
    db.collection('pessoas').find().toArray(
        (err, results) => 
        {
            if(err) return console.log(err)
            console.log(results)
            res.render('show', {data: results})
        }
    )
})

app.get('/', function(req, res)
{
    
    res.render('home')
    res.send('teste')
    
})

app.post('/show', function(req, res){
    db.collection('pessoas').save(req.body, (err, result) =>
    {
        if(err)
        return console.log(err) 
        console.log('salvo no banco')
        res.redirect('/show')
    })
})

app.route('/delete/:id')
.get((req, res) =>
{
    var id = req.params.id
    db.collection('pessoas').deleteOne
    (
        {
            _id: ObjectId(id)
        },
        (err, result) =>
        {
            if(err) return console.log(err)
            console.log('Valor deletado com Sucesso')
            res.redirect('/show')
        }
        
    )
})