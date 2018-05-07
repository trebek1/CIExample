# AdvancedNodeStarter
Starting project for a course on Advanced Node @ Udemy

Part1: Data Caching with Redis
Part2: Automated Headless Browser Testing
Part3: Wiring up Continuous Integration 
part4: Scalable Image Upload

// Why Cache? 
-- Mongo is sorted by index
-- if want to find article by title - need to do 'full collection scan' - search 1 by 1 records until finding the one you are looking for 
-- solve with 1). index for that field - slows down write time and wastes disc space, may not know future fields for indices  
or 2). use caching layer 

Using a redis caching layer 
brew services start redis 
if working redis ping --> PONG 

redis --> key value store. 
use node-redis 
set('KEY', 'VALUE');
GET('HI', (err, val) => console.log(val));
hset('spanish', 'red', 'rojo');
hget('spanish', 'red', console.log);

// gotcha
-- cant store objects in redis -- stringifited to object, object. 
-- if want to store object JSON.stringify(obj) .. 
-- when pulling out use JSON.parse(val) to get object from string version of JSON

// Manipulating Session
const session = 'eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNWFlOWY0NmQxZmJiMzcyYmI2NmNlMTBhIn19';
const Buffer = require('safe-buffer').Buffer;
Buffer.from(session, 'base64').toString('utf8'); 
// '{"passport":{"user":"5ae9f46d1fbb372bb66ce10a"}}'

-- passport just stores user and id on passport object 

How cookie-session works
1). pulls properties session and session.sig from cookie 
2). uses session.sig to ensure session was not manipulated
3). decode 'session' into js object 
4). place that object on req.session

Passport
1). look at req.session and try to find req.session.passport.user
2). if ID stored there, pass to deserializeUser
3). get back a user and assign to req.user

Sesion.sig
key + sig = actual key 
use keygrip 

keygrip
1). const session = 'eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNWFlOWY0NmQxZmJiMzcyYmI2NmNlMTBhIn19';
2). const Keygrip = require('keygrip');
3). const keygrip = new Keygrip(['123123123']);
4). keygrip.sign('session=' + session);
5). keygrip.verify('session=' + session, 'qEhZOfmqrbTYOyBcVfmWp6Jx3yU');

Faking a session for testing: 
1). Create page instance 
2). take existing user ID and generate fake session object with it 
3). sign the session object with keygrip
4). set the session and signature on our page instance as cookies


Continuous Integration 
- Make changes to project that is hosted 
CI - process to merge all code changes into a single branch
CI Server - server that runs automatic checks (tests) on the codebase
to ensure the changes haven't broken anything 

-- make sure code passes and does follow up tests before launching 

1). Push code to github
2). Travis detects pushed code
3). Travis clones project 
4). Travis runs test using .travis.yml
5). if tests are OK, Travis sends an email to us 

YAML is like JSON key value pairs 
JSON to YAML 
nested object -> indentation 
dash - means element in an array
countToFive: 
	- 'one'
	- 'two'
(above is a json array)
docs: docs.travis-ci.com 

language: node_js // javascript  
node_js: 
  - "8" // version 8 of node 
dist: trusty // virtual machine operating system special linux version
services: 
  - mongodb
  - redis-server
env: // array of env variables any time proj runs on servers 
  - NODE_ENV=ci
cache: // since node_modules isnt checked in, save node_modules in cache
// speeds up build 

cache:
  directories: 
    - node_modules
    - client/node_modules
install: 
	npm install  // additional install commands - initial setup of project on servers 
	npm run build // we dont use react server on prod
	// CI setup behaves like prod 
script: execute commands on the command line 
- nohup npm run start & 
- nohup -> if the shell is closed, dont kill anything this command creates (no hangup)
- & -> run this command in a subshell (in the background)
- sleep 3 --> wait for 3 seconds to not run tests too fast 

https://travis-ci.org/ 
-- sync github here then can watch builds on pushes here
-- change to show ci





















