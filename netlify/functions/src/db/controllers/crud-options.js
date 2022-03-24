//insert
const insert = (db,callback)=>{
    db.collection('HussainsCollection').insertOne({name:'Hussain', age: 18},(err,result)=>{
if(err) console.log(err)
        console.log(result.ops);
        callback();
    })
}
const insertMany = (db,callback)=>{
db.collection('HussainsCollection').insertMany([{name:'Hussain', age: 18},{name:"Arif", age: 50}],(err,result)=>{
if(err) console.log(err)
        console.log(result.ops);
        callback();
    })
}

//find
const findDocument = (db,callback)=>{
    db.collection('HussainsCollection').find({name:'Hussain'}).toArray((err,docs)=>{
        console.log(docs);
        callback();
    })
}

//update
const updateDocument=  (db,callback)=>{
    db.collection('HussainsCollection').updateOne({name: 'Ali'} , {$set : {name: 'Hussain'}} , (err,result)=>{
       if(err) console.log(err)
        console.log('1 document updated');
        callback()
    })
}
const updateMany=  (db,callback)=>{
    db.collection('HussainsCollection').updateMany({name: 'Ali'} , {$set : {name: 'Hussain'}} , (err,result)=>{
       if(err) console.log(err)
        console.log(result.result.nModified + ' documents have been updated');
        callback()
    })
}

//delete
const deleteOne = (db,callback)=>{
    db.collection('HussainsCollection').deleteOne({name: 'Arif'} , (err,result)=>{
       if(err) console.log(err)
        console.log(result.deletedCount + ' have been deleted' );
        callback()
    })
})

const deleteMany=  (db,callback)=>{
    db.collection('HussainsCollection').deleteMany({name: 'Arif'} , (err,result)=>{
       if(err) console.log(err)
        console.log(result.deletedCount + ' have been deleted');
        callback()
    })
}