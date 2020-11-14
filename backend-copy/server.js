import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import dbSchema from './dbschema.js';
import Pusher from 'pusher';


//app config
const app = express()
const port = process.env.PORT || 8000

//middleware
app.use(express.json());
app.use(cors());

const pusher = new Pusher({
    appId: "1104111",
    key: "496c68147e4fc5df8d4d",
    secret: "83b3a305f988a0bb82be",
    cluster: "us2",
    useTLS: true
  });

//db config
const connectionUrl = 'mongodb+srv://admin:nkCYhMzXAMMfVjcF@cluster0.xczs9.mongodb.net/merndb?retryWrites=true&w=majority';
mongoose.connect(connectionUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//pusher stuff
mongoose.connection.once('open', () => {
    console.log("DB is connected");
    const changeStream = mongoose.connection.collection('conversations').watch();

    changeStream.on('change', (change) => {
        if(change.operationType === 'insert'){
            console.log("Pusher triggered")
            pusher.trigger('channels', 'newChannel', {
                'change': change
            })
        }else if(change.operationType === 'update'){
            pusher.trigger('conversation', 'newMessage', {
                'change': change
            })
        }else{
            console.log("Error triggering Pusher")
        }
    })

})

//api routing
app.get('/', (req, res) => res.status(200).send('Hello World'))

app.post('/new/channel', (req, res) => {
    const dbData = req.body
    dbSchema.create(dbData, (err, data) => {
        if(err){
            res.status(500).send(err)
        }else{
            res.status(201).send(data)
        }
    })
})

app.get('/get/channelList', (req, res) => {
    dbSchema.find((err, data) => {
        if(err){
            res.status(500).send(err)
        }else{
            let channels = []
            data.map((channelData) => {
                const channelInfo = {
                    id: channelData._id,
                    name: channelData.channelName
                }
                channels.push(channelInfo)
            })
            res.status(200).send(data)
        }
    })
})

app.post('/new/message', (req, res) => {
    const id = req.query._id
    const newMsg = req.body

    dbSchema.update(
        { _id: req.query.id},
        {$push: {conversation: req.body} },
        (err, data) => {
            if(err){
                console.log("Error saving message")
                console.log(err)
                res.status(500).send(err)
            }else{
                res.status(201).send(data)
            }
        }
    )
})

app.get('/get/data', (req, res) => {
    dbSchema.find((err, data) => {
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
})

app.get('/get/conversation', (req, res) => {
    const id = req.query.id
    dbSchema.find({ _id: id}, (err, data) => {
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
})

//listen
app.listen(port, () => console.log(`Listening from localhost: ${port}`))