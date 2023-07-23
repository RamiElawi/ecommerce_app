// const Sequelize=require('sequelize');

// const sequelize=new Sequelize('node_js_course','root','Rami12345678',{
//     dialect: 'mysql',
// host :'localhost'
// });

// module.exports=sequelize;

const mongodb=require('mongodb');

const mongoClient=mongodb.MongoClient;

let _db;
const mongoconnect=callback=>{

    mongoClient.connect('mongodb+srv://Ramielawi:rami1234@firstproject.tezbk4n.mongodb.net/shop?retryWrites=true&w=majority')
    .then(result=>{
        console.log('Conected!');
        // console.log(result);
        _db=result.db();
        callback()
    })
    .catch(err=>{
        console.log(err)
        throw err;
})
}

const getDb = ()=>{
if(_db){
    return _db
}
// throw 'not found database';
}

exports.mongoconnect=mongoconnect;
exports.getDb=getDb;