const mongoose=require('mongoose');
const UserSchema=mongoose.Schema({
name:{
type:String,
require:[true,'Name is required']
},
email:{
      type:String,
      require:[true,'Email is required'],
      unique:true
},
password:{
      type:String,
      require:[true,'Password is required']
}
});
module.exports=mongoose.model('userdb',UserSchema);