//open data base;
let db;
let openRequest = indexedDB.open('myDataBase');

openRequest.addEventListener('success' ,(e)=>{

    console.log("DB is successfully opened ");
    db = openRequest.result;
})

openRequest.addEventListener('error' ,(e)=>{
console.log("we found some error ");
})

openRequest.addEventListener('upgradeneeded' ,(e)=>{
console.log("DB has been upgraded")

db = openRequest.result;


db.createObjectStore('video' ,{keyPath:"id"})

db.createObjectStore('image' ,{keyPath:"id" })
})