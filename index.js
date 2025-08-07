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
        const userName = userinfo.first_name //extracting userName from that json object
        return res.json(userName); //return type json
    })
    
    .post((req, res)=>{
        const lastUser = users[users.length - 1];
        const newUserId = parseInt(lastUser.id) + 1;

        // client will send data in the body of the request
        // we can access it using req.body
        const newUserData = req.body;

        //now we will append this to the users array
        users.push({id: newUserId, ...newUserData});

        //we have only pushed it to the array but not saved it to the file
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users) ,(err)=>{
            return res.json({
                message: `thanks for joining us ${newUserData.first_name}!!`,
                userId: newUserId
            });
        });
    })

    .patch((req, res) =>{
        const userId = parseInt(req.params.id);
        const updatedUserData = req.body;
        
        users[userId-1] = updatedUserData;
        fs.writeFile("./MOCK_DATA.json", JSON.stringify, (err)=>{
            return res.json({
                message: `${updatedUserData.first_name} your info is updated successfully`
            });
        });
    })

    .delete((req, res) =>{
        const userId = parseInt(req.params.id);
        const userInfo = users.find((user)=> user.id === userId);

        return res.json({
            message: `sorry to say ${userInfo.first_name} but you are fired`
        });
    });
}


app.listen(PORT, ()=>{
    console.log("server started");
});