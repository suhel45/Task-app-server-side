const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const cors = require('cors');
const port = 5000

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('node server running')
})


//c7tuiu9XgxQQPwFh
//Task-app


const uri = "mongodb+srv://Task-app:c7tuiu9XgxQQPwFh@cluster0.dwtnipt.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        const TaskCollections = client.db('Task-app').collection('tasks');
        const completedTaskCollections = client.db('Task-app').collection('completedTask');
        app.post('/add',async(req,res)=>{
          const task = req.body;
           console.log(task);
           const result = await TaskCollections.insertOne(task);
           res.send(result)
        })
        app.get('/my-task',async(req,res)=>{
          const email = req.query.email;
          const query={
            email:email
        }
        const myTask = await TaskCollections.find(query).toArray();
        res.send(myTask);
        })
        app.get('/my-task/:id',async(req,res)=>{
          const id = req.params.id;
          const query = {_id:ObjectId(id)}
          const result = await TaskCollections.find(query).toArray();
          res.send(result);
        })

        app.put('/update-task/:id',async(req,res)=>{
          const id = req.params.id;
          const filter = {_id:ObjectId(id)}
          const user = req.body;
          console.log(user)
          const option = {upsert:true}
          const updatedUser = {
            $set:{
              task:user.task
            }
          }
          const result = await TaskCollections.updateOne(filter,updatedUser,option)
          res.send(result);
        })
        app.post('/completed-task',async(req,res)=>{
          const completedTask = req.body;
          const result = await completedTaskCollections.insertOne(completedTask);
          res.send(result)

        })
        app.get('/completed-task',async(req,res)=>{
          const email = req.query.email;
          console.log(email);
          const query={
            email:email
        }
        const completedTask = await completedTaskCollections.find(query).toArray();
        res.send(completedTask);
        })
        app.delete('/task/:ids',async(req,res)=>{
          const id = req.params.ids;
          console.log(id);
          const filter = {_id:ObjectId(id)}
          const result = await TaskCollections.deleteOne(filter);
          res.send(result);
      })
      app.delete('/DeleteTask/:ids',async(req,res)=>{
        const id = req.params.ids;
        console.log(id);
        const filter = {_id:ObjectId(id)}
        const result = await completedTaskCollections.deleteOne(filter);
        res.send(result);
    })
        

    }
    finally{

    }
}
run().catch(e=>console.log(e))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})