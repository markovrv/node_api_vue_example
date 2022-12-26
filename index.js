const express = require("express");
const fs = require("fs");
    
const app = express();
const jsonParser = express.json();
  
app.use(express.static(__dirname + "/public"));
  
const filePath = "users.json";
const content = fs.readFileSync(filePath,"utf8");
var users = JSON.parse(content);

// получение всех пользователей
app.get("/api/users", function(req, res){
    res.send(users);
});

// получение одного пользователя по id
app.get("/api/users/:id", function(req, res){
       
    const id = req.params.id; // получаем id
    let user = users.find(el => el.id == id)

    // отправляем пользователя
    if(user) {
        res.send(user);
    }
    else {
        res.status(404).send();
    }
});

// получение отправленных данных
app.post("/api/users", jsonParser, function (req, res) {
      
    if(!req.body) return res.sendStatus(400);
      
    const userName = req.body.name;
    const userAge = req.body.age;
    let user = {name: userName, age: userAge};
      
    // находим максимальный id
    var id = Math.max.apply(Math,users.map(o=>o.id))
    if(users.length == 0) {
        user.id = 1;
    } else {
    // увеличиваем его на единицу
    user.id = id+1; 
    }

    // добавляем пользователя в массив
    users.push(user);
    data = JSON.stringify(users);
    // перезаписываем файл с новыми данными
    fs.writeFileSync("users.json", data);
    res.send(user);
});

 // удаление пользователя по id
app.delete("/api/users/:id", function(req, res){
       
    const id = req.params.id;

    let index = users.findIndex(el => el.id == id)
    
    if(index > -1){
        // удаляем пользователя из массива по индексу
        users.splice(index, 1);
        data = JSON.stringify(users);
        fs.writeFileSync("users.json", data);
        // отправляем удаленного пользователя
        res.send({id: index});
    }
    else{
        res.status(404).send();
    }
});

// изменение пользователя
app.put("/api/users", jsonParser, function(req, res){
       
    if(!req.body) return res.sendStatus(400);
      
    const userId = req.body.id;
    const userName = req.body.name;
    const userAge = req.body.age;
      
    let user = users.find(el => el.id == userId)

    // изменяем данные у пользователя
    if(user){
        user.age = userAge;
        user.name = userName;
        data = JSON.stringify(users);
        fs.writeFileSync("users.json", data);
        res.send(user);
    }
    else{
        res.status(404).send(user);
    }
});
   
app.listen(3000, function(){
    console.log("http://localhost:3000");
});