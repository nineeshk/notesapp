# notesapp
A simple note adding service. This service is running on 3 node.js servers.
## Installing via GitHub
Just clone the repository in a common location or inside your project:
```
https://github.com/nineeshk/notesapp.git
```
I have cloned to /var/www. Now change directory to notesapp
```
nineesh@ubuntu:cd /var/www/notesapp
```
Run npm install
```
nineesh@ubuntu:/var/www/notesapp$ npm install`
```
## Sample requests
#### User - Signup
```
Method: POST
Action: localhost:3000/user/signup
Data: {"email": "nineeshk@gmail.com", "password": "password", "firstname": "Nineesh", "lastname": "K", "address": "Varapuzha"}
Response: {"Message": "Successfully completed sign-up."}```
```
#### User - Login
```
Method: POST
Action: localhost:3000/user/login
Data: {"email": "nineeshk@gmail.com", "password": "password"}
Response: {"Bearer token":"0fn49PZLa4UlDpSaQoEmOwKm6Vwl0DX3"}
** You have to use your Bearer token for further requests.
```
#### User - All (List all users) Access only for authorized user.
```
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
Method: DELETE
Action: localhost:3000/notes/delete/1
Authorization: 
	Type: Bearer Token
	Token: 0fn49PZLa4UlDpSaQoEmOwKm6Vwl0DX3
Response: {"Message":"Note deleted"}
```
#### User - Logout. Access only for authorized user.
```
Method: GET
Action: localhost:3000/user/logout
Authorization: 
	Type: Bearer Token
	Token: 0fn49PZLa4UlDpSaQoEmOwKm6Vwl0DX3
Response: {"Message": "Successfully logged out."}
```
