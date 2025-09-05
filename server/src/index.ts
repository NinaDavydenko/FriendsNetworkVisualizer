import express from "express";

import { people } from "../data/people.json";

const app = express();

const cors = require('cors');
app.use(cors({ origin: '*' }));

app.use(express.json());

app.get("/people", (_req, res) => res.json(people));

app.post("/people", (req, res) => {
  const newPerson = req.body;
  people.push(newPerson);
  return res.json(newPerson);
});

app.get("/people/:id", (req, res) => {
  const personId = req.params.id;
  const person = people.find(p => p.id === personId);

  if (!person) {
    return res.status(404).json({ message: "Person not found" });
  }

  res.json(person);
});

app.patch("/people/:id", (req, res) => {
  const personId = req.params.id;
  const index = people.findIndex((p) => p.id === personId);

  if (index === -1) {
    return res.status(404).json({ message: "Person not found" });
  }

  const updatedData = req.body;
  people[index] = { ...people[index], ...updatedData };

  return res.json(people[index]);
});


const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
