require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const shortid = require("shortid");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const urlparser = require("url");

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const dns = require("dns");
const mongo = mongoose
  .connect(
    "mongodb+srv://jaydeepp:otouYTJipiLBfhTI@cluster0.jnvgpkn.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("connected to mongodb"))
  .catch((err) => {
    console.log(err);
    console.log("error in connect mongoose");
  });
app.use(cors());
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

const UrlShortnerSchema = mongoose.Schema({
  original_url: { type: String },
  short_url: { type: Number },
});

const UrlShortner = mongoose.model("UrlShortnerSchema", UrlShortnerSchema);
// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});
app.post("/api/shorturl", async (req, res) => {
  const original_url = req.body.url;

  dns.lookup(urlparser.parse(original_url).hostname, async (err, address) => {
    if (!address) {
      res.json({ error: "invalid url" });
    } else {
      const short_url_data = await UrlShortner.find({});
      let short_url = short_url_data.length + 1;
      const data = new UrlShortner({
        original_url: original_url,
        short_url: short_url,
      });
      await data.save();
      // const short_url = cnt + 1;
      return res.json(data);
    }
  });
});
app.get("/api/shorturl/:shorturl", async (req, res) => {
  const shorturl = req.params.shorturl;
  const short_url_data = await UrlShortner.findOne({ short_url: shorturl });
  console.log(short_url_data);
  if (short_url_data.original_url) {
    return res.redirect(short_url_data.original_url);
  }
});
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
