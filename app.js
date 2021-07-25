const Express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const CONNECTION_URL = 'mongodb://127.0.0.1:27017';
const DATABASE_NAME = "test";
var user = require('./rests/user');
var post = require('./rests/post');

var app = Express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.set('view engine', 'ejs');
var database, collection;

app.listen(5000, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if (error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("personnel");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});

app.post("/personnel", (request, response) => {
    database.collection("personal").insert(request.body, (error, result) => {
        if (error) {
            return response.status(500).send(error);
        }
        response.send(result.result);
    });
});

app.get("/personnel", (request, response) => {
    collection.find({}).toArray((error, result) => {
        if (error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.put("/personnel", (request, response) => {
    let id = request.query.id;
    collection.findOneAndUpdate({ _id: id },
        { $set: request.body },
        { new: true, upsert: true, returnOriginal: false });
    response.status(200).send(true)
});
app.get('/users/get', user.getUser);
app.post('/users/create', user.createUser);
app.get('/users/get/html', user.getUserHtml);

app.get('/posts/get', post.getPost);
app.post('/posts/create', post.createPost);

