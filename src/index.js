#!/usr/bin/env node

'use strict';

const program = require('commander');
const path = require('path');
var admin = require("firebase-admin");

function initFirebaseAdmin(conf_file) {

  if(!path.isAbsolute(conf_file))
         conf_file = process.cwd() + '/' + conf_file;

     const conf = require(conf_file);

     var serviceAccount = require(conf.credential);

     admin.initializeApp({
       credential: admin.credential.cert(serviceAccount),
       databaseURL: conf.databaseURL
     });
}

function writeEncoded(value) {
  process.stdout.write(JSON.stringify(value) + '\n', function(){process.exit();});
}

function errorHandler(error) {
  writeEncoded({'success': false, 'error': { 'code': error.code, 'message': error.message}});
}

program
  .version('1.0.0')

program
  .command('add')
  .option('-c, --config <file>','Configuration file')
  .option('-e, --email <email>','User email address')
  .option('-p, --password <pass>', 'User password')
  .option('-d, --display [name]', 'User display name')
  .option('-u, --uid [uid_value]', 'Use id as uid value instead of a internal one')
  .action(function(options){

    initFirebaseAdmin(options.config);
    
    let user = {
      email: options.email,
      password: options.password
    };

    if(options.display)
      user.displayName = options.display;

    if(options.uid)
      user.uid = options.uid;

    admin.auth().createUser(user)
    .then(function(userRecord) {
      writeEncoded({success: true, uid:  userRecord.uid});
    })
    .catch(errorHandler);
});

program
  .command('update')
  .option('-c, --config <file>','Configuration file')
  .option('-e, --email [email]','User email address')
  .option('-p, --password [pass]', 'User password')
  .option('-d, --display [name]', 'User display name')
  .option('-u, --uid <uid_value>', 'User id for lookup')
  .action(function(options){

    initFirebaseAdmin(options.config);
    
    let user = {}

    if(options.email)
      user.email = options.email;

    if(options.password)
      user.password = options.password;

    if(options.display)
      user.displayName = options.display;

    if(Object.keys(user).length === 0)
       writeEncoded({success: false, error: {code: 'no-content', message: 'Nothing to update'}});

    admin.auth().updateUser(options.uid, user)
    .then(function(userRecord) {
      writeEncoded({success: true, user:  userRecord});
    })
    .catch(errorHandler);
});

program
  .command('remove')
  .option('-u, --uid <uid_value>','User unique id')
  .option('-c, --config <file>','Configuration file')
  .action(function(options){

     initFirebaseAdmin(options.config);

     admin.auth().deleteUser(options.uid)
      .then(function() {
          writeEncoded({'success': true, 'uid': options.uid});
       })
      .catch(errorHandler);

});

program
  .command('verify')
  .option('-t, --token <token>','User token from client')
  .option('-c, --config <file>','Configuration file')
  .action(function(options){

     initFirebaseAdmin(options.config);

     admin.auth().verifyIdToken(options.token)
      .then(function(decodedToken) {
          writeEncoded({'success': true, 'uid': decodedToken.uid});
       })
      .catch(errorHandler);

});

program.parse(process.argv);

