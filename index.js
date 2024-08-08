const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// In-memory data structures with initial data
let users = [
  { id: uuidv4(), username: 'JohnDoe' },
  { id: uuidv4(), username: 'JaneDoe' },
  { id: uuidv4(), username: 'Alice' },
  { id: uuidv4(), username: 'Bob' },
  { id: uuidv4(), username: 'Charlie' },
];

let chats = [
  {
    id: uuidv4(),
    participants: [users[0].id, users[1].id],
    messages: [],
  },
  {
    id: uuidv4(),
    participants: [users[2].id, users[3].id],
    messages: [],
  },
];

let groups = [
  {
    id: uuidv4(),
    name: 'Group1',
    members: [users[0].id, users[1].id, users[2].id],
    chats: [],
  },
  {
    id: uuidv4(),
    name: 'Group2',
    members: [users[3].id, users[4].id],
    chats: [],
  },
];

let messages = [
  {
    id: uuidv4(),
    sender: users[0].id,
    receiver: users[1].id,
    content: 'Hello, Jane!',
    chatId: chats[0].id,
    type: 'sender',
    timestamp: new Date(),
  },
  {
    id: uuidv4(),
    sender: users[1].id,
    receiver: users[0].id,
    content: 'Hello, John!',
    chatId: chats[0].id,
    type: 'receiver',
    timestamp: new Date(),
  },
];

// Assign initial messages to chats
chats[0].messages.push(messages[0], messages[1]);

// Express routes
app.post('/users', (req, res) => {
  const user = { id: uuidv4(), ...req.body };
  users.push(user);
  res.status(201).send(user);
});

app.post('/chats', (req, res) => {
  const chat = { id: uuidv4(), participants: req.body.participants, messages: [] };
  chats.push(chat);
  res.status(201).send(chat);
});

app.post('/groups', (req, res) => {
  const group = { id: uuidv4(), ...req.body, chats: [] };
  groups.push(group);
  res.status(201).send(group);
});

app.post('/messages', (req, res) => {
  const { senderId, receiverId, content, chatId } = req.body;

  const newMessage = {
    id: uuidv4(),
    sender: senderId,
    receiver: receiverId,
    content,
    type: 'sender',
    timestamp: new Date(),
  };

  messages.push(newMessage);

  // Find the chat and add the message to it
  const chat = chats.find(c => c.id === chatId);
  if (chat) {
    chat.messages.push(newMessage);
  }

  res.status(201).send(newMessage);
});

app.get('/users', (req, res) => {
  res.status(200).send(users);
});

app.get('/chats', (req, res) => {
  res.status(200).send(chats);
});

app.get('/groups', (req, res) => {
  res.status(200).send(groups);
});

app.get('/messages', (req, res) => {
  res.status(200).send(messages);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
