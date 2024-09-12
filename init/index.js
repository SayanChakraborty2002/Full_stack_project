const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
   // Assuming `initData` is an object with a `data` property that is an array
   const rawData = initData.data; // Access the data array from initData

  const dataWithOwners = rawData.map((obj) => ({
    ...obj,
    owner: "66d1d62aff9bbed767011189", // Adding the owner field to each object
  }));

  await Listing.insertMany(dataWithOwners);
  console.log("Data was initialized");
};

initDB();
