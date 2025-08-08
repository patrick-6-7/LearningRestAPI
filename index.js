const express = require('express');
const fs = require('fs');
const users = require('./MOCK_DATA.json');
const app = express();
const PORT = 8000;

const print = (text) => console.log(text);

//middleware to parse json data
app.use(express.urlencoded({ extended: false }));

//Routes
{//home page route=> /api and /
    app.get('/', (req, res) =>{
        return res.end('you are on the home page of a website')
    });
    app.get('/api', (req, res) =>{
        return res.end('you are on the home page of a flutter app')
    });
}

{//users route => /users and /api/users
    app.get('/users', (req, res)=>{
        const html = `
        <ul>
            ${users.map(user => `<li>${user.first_name}</li>`).join('')}
        </ul>
        `;
        return res.send(html);
    });

    app.get('/api/users', (req, res)=>{
        return res.json(users);
    });
}

{//getting user with id route => /user/id and /api/user/id
    app.get('/user/:id', (req, res) =>{
        const id = parseInt(req.params.id); 
        const userinfo = users.find((user) => user.id === id);
        const userName = userinfo.first_name
        const html = `
            <span>${userName}</span>
        `;
        return res.send(html);
    });
}

//as currently we can not perform post patch and delete on our brouser so we need to install posman for this
{//one route handling get post patch and delete requests
    app.route('/api/user/:id')

    .get((req, res)=>{
        // how to get id from the req which i want to process ?
        const id = parseInt(req.params.id); //id type string parsed to int
        const userinfo = users.find((user) => user.id === id); //users.find((user) => user.id === id); returns a json object having id same as reqID
        
        if(userinfo){
            return res.json(userinfo); //return type json
        }
        return res.end('no user found');
    })
    
    .post((req, res)=>{
        const reqToCreateUserWithID = parseInt(req.params.id);
        const userFound = users.find((user)=> user.id === reqToCreateUserWithID);
        
        if(userFound){
            return res.json({
                message: `user alreadExist with user id ${reqToCreateUserWithID}!!`,
            });
        }
        const newUserData = req.body;

        //now we will append this to the users array
        users.push({id: reqToCreateUserWithID, ...newUserData});

        //we have only pushed it to the array but not saved it to the file
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users) ,(err)=>{
            return res.json({
                message: `thanks for joining us ${newUserData.first_name}!!`,
                userId: reqToCreateUserWithID
            });
        });
    })

    .patch((req, res) =>{
        const reqToUpdateUserWithID = parseInt(req.params.id);
        const updatedUserData = req.body;

        const userFound = users.find((user)=> user.id === reqToUpdateUserWithID);
        
        if(userFound){
            if(updatedUserData.id) userFound.id = parseInt(updatedUserData.id);
            if(updatedUserData.first_name) userFound.first_name = updatedUserData.first_name;
            if(updatedUserData.last_name) userFound.last_name = updatedUserData.last_name;
            if(updatedUserData.email) userFound.email = updatedUserData.email;
            if(updatedUserData.gender) userFound.gender = updatedUserData.gender;
            if(updatedUserData.job_title) userFound.job_title = updatedUserData.job_title;
           
            fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err)=>{
                return res.json({
                    message: `${updatedUserData.first_name} your info is updated successfully`
                });
            });
        }
        else{
            return res.json({
                message: `user not found with user id ${reqToUpdateUserWithID}. try updating existing user`
            });
        }
        
        
    })

    .delete((req, res) =>{
        const reqToDeleteUserWithID = parseInt(req.params.id);
        const userIndex = users.findIndex((user) => user.id === reqToDeleteUserWithID);
        
        if (userIndex !== -1) {
            const userName = users[userIndex].first_name;
            const newUsers = users.filter((u) => u.id !== reqToDeleteUserWithID); // removes the element in-place
            console.log(newUsers);
            fs.writeFile("./MOCK_DATA.json", JSON.stringify(newUsers), (err)=>{
                return res.json({
                    message: `${userName} your info is updated successfully`
                });
            });
        }
        else{
            return res.json({
                message: `no user found with user id ${reqToDeleteUserWithID}`
            });
        }
    });
}


app.listen(PORT, ()=>{
    console.log("server started");
});