const rootDir=require('../Utils/path');
const fs=require('fs');
const path=require('path');

// fake data base
const registration=[];
module.exports=class register{
constructor(email,topic,message){
      this.email=email;
      this.topic=topic;
      this.message=message;
}
save(){
      register.fetchAll((file) =>{
      file.push(this);
      const homeDataPath=path.join(rootDir,'data','home.json');
      fs.writeFile(homeDataPath,JSON.stringify(file), error =>{
            console.log("File writing there!",error);
      });
}
);
}
static fetchAll (callback){
      const homeDataPath=path.join(rootDir,'data','home.json');
      fs.readFile(homeDataPath, (err,data)=>{
          callback((err==null) ?  JSON.stringify(data) :  []);
      })
}
}