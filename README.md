# notesapp
A simple note adding service. This service is running on 3 node.js servers. 
Authentication is happening via Bearer tokens.
## Technologies
Node.js, Express.js, Mongoose ODM, MongoDB
## Tested OS
Ubuntu 16.04
## Installing via GitHub
Just clone the repository in a common location or inside your project:
```
https://github.com/nineeshk/notesapp.git
```
I have cloned to my /var/www. Now changing directory to notesapp
```
nineesh@ubuntu:cd /var/www/notesapp
```
Run npm install
```
nineesh@ubuntu:/var/www/notesapp$ npm install`
```
Now run the 3 nodejs servers on separate terminals.

```

nineesh@ubuntu:/var/www/notesapp$ node server.js

nineesh@ubuntu:/var/www/notesapp$ node server1.js

nineesh@ubuntu:/var/www/notesapp$ node server2.js

```

# Sample Postman requests
#### User - Signup
```
Workflow: Client <-> server1 <-> server2
Method: POST
Action: localhost:3000/user/signup
Data: {"email": "nineeshk@gmail.com", "password": "password", "firstname": "Nineesh", "lastname": "K", "address": "Varapuzha"}
Response: {"Message": "Successfully completed sign-up."}```
```
#### User - Login
```
Workflow: Client <-> server1 <-> server2
Method: POST
Action: localhost:3000/user/login
Data: {"email": "nineeshk@gmail.com", "password": "password"}
Response: {"Bearer token":"0fn49PZLa4UlDpSaQoEmOwKm6Vwl0DX3"}

```
**Note - From here on use your Bearer token for further requests.

#### User - All (List all users) Access only for authorized user.
```
Workflow: Client <-> server1 <-> server2
Method: GET
Action: localhost:3000/user/all
Data: 
Authorization: 
	Type: Bearer Token
	Token: 0fn49PZLa4UlDpSaQoEmOwKm6Vwl0DX3
Response: [{"firstname":"Nineesh","lastname":"K","address":"Varapuzha","_id":"5ea2cd1d6bc3c92c7347c4b7","user":{"email":"nineeshk@gmail.com"}}]
```
#### Create - Note. Access only for authorized user.
```

Workflow: Client <-> server1 <-> server2 <-> server3
Method: POST
Action: localhost:3000/notes/create
Data: {"notetext" : "My first note."}
Authorization: 
	Type: Bearer Token
	Token: 0fn49PZLa4UlDpSaQoEmOwKm6Vwl0DX3
Response: {"message":"Note created"}
```
#### Notes - All (List all notes) (One can see his and others notes) Access only for authorized user.
```

Workflow: Client <-> server1 <-> server2 <-> server3
Method: GET
Action: localhost:3000/notes/all
Data: 
Authorization: 
	Type: Bearer Token
	Token: 0fn49PZLa4UlDpSaQoEmOwKm6Vwl0DX3
Response: [{"notetext":"My first note.","user":{"email":"nineeshk@gmail.com","_id":"5ea2cd1c6bc3c92c7347c4b6"},"userprofile":{"firstname":"Nineesh","lastname":"K","address":"Varapuzha","_id":"5ea2cd1d6bc3c92c7347c4b7"},"notesid":1}]
```
#### Note - Update (Anybody can update anybody's note) Access only for authorized user.
```

Workflow: Client <-> server1 <-> server2 <-> server3
Method: POST
Action: localhost:3000/notes/update
Data: {"id":"1", "notetext": "My first note. Still I made an update, just now."}
Authorization: 
	Type: Bearer Token
	Token: 0fn49PZLa4UlDpSaQoEmOwKm6Vwl0DX3
Response:{"message":"Note updated"}
```
#### Notes - All (List all notes) Access only for authorized user.
```

Workflow: Client <-> server1 <-> server2 <-> server3
Method: GET
Action: localhost:3000/notes/all
Data: 
Authorization: 
	Type: Bearer Token
	Token: 0fn49PZLa4UlDpSaQoEmOwKm6Vwl0DX3
Response: [{"notetext":"My first note. Still I made an update, just now.","user":{"email":"nineeshk@gmail.com","_id":"5ea2cd1c6bc3c92c7347c4b6"},"userprofile":{"firstname":"Nineesh","lastname":"K","address":"Varapuzha","_id":"5ea2cd1d6bc3c92c7347c4b7"},"notesid":1}]
```
#### Note - Delete (Anybody can delete anybody's note) Access only for authorized user.
```

Workflow: Client <-> server1 <-> server2 <-> server3
Method: DELETE
Action: localhost:3000/notes/delete/1
Authorization: 
	Type: Bearer Token
	Token: 0fn49PZLa4UlDpSaQoEmOwKm6Vwl0DX3
Response: {"Message":"Note deleted"}
```
#### User - Logout. Access only for authorized user.
```

Workflow: Client <-> server1 <-> server2
Method: GET
Action: localhost:3000/user/logout
Authorization: 
	Type: Bearer Token
	Token: 0fn49PZLa4UlDpSaQoEmOwKm6Vwl0DX3
Response: {"Message": "Successfully logged out."}
```
### Todo's
```
1. Handle unwanted urls for.eg. - 
	Original - localhost:3000/notes/delete/1
	Invalid - localhost:3000/notes/delete/1/1
2. A logged in user can view, update and delete only his notes.
3. Logged in user's - userprofile

```

