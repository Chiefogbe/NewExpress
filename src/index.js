import express, { response } from 'express'
import dotenv from 'dotenv'
dotenv.config()

const PORT=process.env.PORT||3000
const app=express()
app.use(express.json())

const logginMiddleware=(req,res,next)=>{
  console.log(`${req.method} - ${res.url}`)
  next()
}

// app.use(logginMiddleware )

const mockUsers=[
  {id:1,name:"Silas",color:"red"},
  {id:2,name:"Andrew",color:"blue"},
  {id:3,name:"Stephen",color:"yellow"},
]

const resolveMiddleware=(req, res, next)=>{
  const {params:{id}}=req
  const parseId=parseInt(id)
  if(isNaN(parseId)){
    return res.sendStatus(400)
  }
  const findUserIndex=mockUsers.findIndex((user)=>user.id===parseId)
  if(findUserIndex===-1){
    return res.sendStatus(404)
  } 
  req.findUserIndex=findUserIndex;
  next()

}

app.delete('/api/user/:id', (req,res)=>{
  const {findUserIndex}=req
  mockUsers.splice(findUserIndex, 1)
  return res.sendStatus(200)
})

app.patch('/api/user/:id', resolveMiddleware, (req,res)=>{
  const {body, findUserIndex}=req
  mockUsers[findUserIndex]={...mockUsers[findUserIndex], ...body}
  return res.sendStatus(200)
})

app.put('/api/user/:id', resolveMiddleware, (req,res)=>{
  const {body, findUserIndex}=req
  mockUsers[findUserIndex]={id:mockUsers[findUserIndex].id, ...body}
  return res.sendStatus(200)
})

app.post('/api/user', (req,res)=>{
  const {body}=req;
  const newuser={id: mockUsers[mockUsers.length -1].id + 1, ...body}
  mockUsers.push(newuser)
  return res.status(201).send(newuser)
})

app.get('/api', (req,res)=>{
  res.status(200).send({message:'Welcome to express class.'})
})

app.get('/api/user', (req,res)=>{
  const{query:{filter, value}}=req
  
  if(filter && value){
    return res.send(mockUsers.filter((user)=>user[filter].includes(value)))
  }
  return res.send(mockUsers)
})


app.get('/api/user/:id', resolveMiddleware, (req,res)=>{
  const {findUserIndex}=req
  const findUser=mockUsers[findUserIndex]
  if(!findUser){
    return res.sendStatus(404)
  }
  return res.send(findUser)
})


app.listen(PORT, ()=>{
  console.log(`App is listening on port ${PORT}`)
})