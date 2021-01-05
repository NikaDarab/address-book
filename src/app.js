/* eslint-disable no-console */
/* eslint-disable quotes */
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { v4: uuid } = require("uuid");
const { NODE_ENV } = require("./config");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(express.json());
app.use(helmet());
app.use(cors());

const addresses = [
  {
    id: "ce20079c-2326-4f17-8ac4-f617bfd28b7f",
    firstName: "nika",
    lastName: "darab",
    address1: "2511 w braker ln",
    address2: "apt 367",
    city: "austin",
    state: "tx",
    zip: "78758",
  },
];
app.get("/", (req, res) => {
  res.send("Welcome to Address Book!");
});

app.get("/address", (req, res) => {
  res.json(addresses);
});

app.post("/address", (req, res) => {
  res.send("add an address");
  //get
  const {
    firstName,
    lastName,
    address1,
    address2,
    city,
    state,
    zip,
  } = req.body;
  console.log(req.body);
  //validate
  //
  const id = uuid();
  const newAddress = {
    id,
    firstName,
    lastName,
    address1,
    address2,
    city,
    state,
    zip,
  };
  addresses.push(newAddress);
  res.status(201).location(`http://localhost:8000/user/${id}`).json({ id: id });
});
app.delete("/address/:id", (req, res) => {
  const { id } = req.params;
  const index = addresses.findIndex((address) => address.id === id);
  if (index === -1) {
    return res.status(400).send("Address not found");
  }
  addresses.splice(index, 1);
  res.status(204).end();
});

//error handling
app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
