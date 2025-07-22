const db=require('../Utils/database');

module.exports=class register{

constructor(id,name,description,photo){
      this.id=id;
      this.name=name;
      this.description=description;
      this.photo=photo;
}

save() {
        if(this.id){
        return db.execute(
          'UPDATE clubs SET name=?,description=?,photo=? WHERE id=?',
          [ this.name , this.description , this.photo , this.id ] 
        );
        }
    else{
        return db.execute(
          'INSERT INTO clubs(id,name,description,photo) VALUES(? , ? , ? ,?)',
          [this.id,this.name,this.description,this.photo]
        );
        }
}

static fetchAll(){
  return db.execute('select * from clubs')
}

static findById(id){
  return db.execute('SELECT * FROM clubs WHERE clubs.id = ?', [id]);
}

};