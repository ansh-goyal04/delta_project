const mongoose=require('mongoose');
const initdata=require('./data.js');
const listing=require('../models/listing.js');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/trivago');

};

const initDb= async()=>{
   await listing.deleteMany({});
   initdata.data=initdata.data.map((obj)=>({...obj,owner:'65c6845effc58e77a3313b77'}));
   await listing.insertMany(initdata.data);
   console.log('data initialised');
};

initDb();
