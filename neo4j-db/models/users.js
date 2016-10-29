const gdb = require('.././connect/graphConnect.js').graphdb;
// const Promise = require("bluebird");
const bcrypt = require("bcrypt-nodejs");
const hashHelp = require('.././security/hash.js');

// var sess;

// name,email,password
module.exports.signIn = (req, res) => {
// redirect to signup when user does not exist
  Users.signIn(req.body, (err,data) => {
    if(data.length > 0) {
      bcrypt.compare(req.body.password, data[0].password, (err, result) =>  {
        if(result){
          sess = req.session;
          sess.email = data[0].email;
          sess.user = data[0].id;
          module.exports.sess = sess;
          res.status(202).send();
        }else{
          res.status(401).send("That email and/or password was not found");
        }
      });
    } else {
      res.status(401).send("That email and/or password was not found");
    }
  });
};


module.exports = {
  signUp: (req, res) => {
    gdb
      .run('MATCH (n:user) WHERE n.email={paremail} RETURN n', {paremail:req.body.email })
      .then(data => {
        if(data.records.length <= 0){
          hashHelp.hashPassword(req.body.password)
          .then(hashed =>{
            req.body.password = hashed;
            gdb
              .run('CREATE(n:user {name:{name}, \
                email:{email}, password:{password}}) \
                RETURN n', {name:req.body.name,
                email:req.body.email,
                password:req.body.password})
              .then(data=>{
                console.log(data);
                var sess = req.session;
                sess.email = data.records[0]._fields[0].properties.email;
                sess.user = data.records[0]._fields[0].identity.low;
                module.exports.sess = sess;
                gdb.close();
                res.status(200).send();
              })
              .catch((err)=>{
                console.log(err);
              })
          })
      }
        // res.status(409).send("The email address you specified is already in use.");
        console.log(data);
        // gdb.close();
    })
    .catch((err)=>{
      console.log(err)
    })
  },

  signIn: (req, res) => {
    // var passwordz = req.body.password;
    gdb
      .run('MATCH (n:patient) WHERE n.email={paremail} RETURN n',
        {paremail:req.body.email })
      .then(data =>{
        console.log(data, data.records[0]._fields[0].properties.email);
        bcrypt.compare(req.body.password, data.records[0]._fields[0].properties.password, (error, result) => {
          if(result){
            var sess = req.session;
            sess.email = data.records[0]._fields[0].properties.email;
            sess.patient = data.records[0]._fields[0].identity.low;
            module.exports.sess = sess;
            res.json({
              properties: data.records[0]._fields[0].properties,
              uid: data.records[0]._fields[0].identity.low
            });
          }
          // else {
          //   res.status(401).send("That email and/or password was not found");
          // }
        })
        // gdb.close();
      })
      .catch(err=>{
        console.log(err);
      })


  }
};
