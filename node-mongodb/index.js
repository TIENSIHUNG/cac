// const MongoClient = require('mongodb').MongoClient;
// const assert = require('assert');

// const url = 'mongodb://localhost:27017/';
// const dbname = 'conFusion';
// const dboper = require('./operations');
// MongoClient.connect(url).then((client)=>{
//     console.log('Connectd correctly to server');
//     const db = client.db(dbname);

//     dboper.insertDocument(db, {name:"Barbecue", description:"Grilled beef"},"dishes").then((result)=>{
//         console.log("Insert Document:\n", result.ops);
//         return dboper.findDocumnet(db,"dishes");
//     }).then((docs)=>{
//         console.log("Found Documnet:\n",docs);
//         return dboper.updateDocument(db, {name: "Pizza"},{description: "Updated Test"},"dishes");


//     }).then((result)=>{
//         console.log("Updated Documnet:\n",result.result);
//         return dboper.findDocumnet(db, "dishes");
//     }).then((docs)=>{
//         console.log("Found Updated Documnet:\n",docs);
//         return client.close();
//     }).catch((err)=> console.log(err));
    
// }).catch((err)=> console.log(err));

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';
const dboper = require('./operations');
MongoClient.connect(url).then((client)=>{
    console.log('Connected correctly to server');
    const db = client.db(dbname);

    dboper.insertDocument(db, {name:"Barbecue", description:"Grilled beef"},"dishes").then((result)=>{
        console.log("Insert Document:\n", result.ops);
        return dboper.findDocument(db,"dishes");
    }).then((docs)=>{
        console.log("Found Document:\n",docs);
        return dboper.updateDocument(db, {name: "Pizza"},{description: "Updated Test"},"dishes");
    }).then((result)=>{
        console.log("Updated Document:\n",result.result);
        return dboper.findDocument(db, "dishes");
    }).then((docs)=>{
        console.log("Found Updated Document:\n",docs);
        return client.close();
    }).catch((err)=> console.log(err));
}).catch((err)=> console.log(err));

