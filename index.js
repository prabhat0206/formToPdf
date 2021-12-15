const express = require("express");
const path = require("path");
const ejs = require("ejs");
const htmlPdf = require("html-pdf");
const bodyParser = require("body-parser");
const sendEmail = require("./mail");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 5000;

// To run this server add .env file in root folder and add these values:
// 1. NODE_EMAIL_USER
// 2. NODE_EMAIL_PASSWORD
// 3. NODE_PORT=587

app.set("view engine", "ejs");
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.static(path.join(__dirname, "assets")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const htmlToPdfBuffer = async (pathname, params) => {
  const html = await ejs.renderFile(pathname, params);
  const options = {
    format: "Letter",
    zoomFactor: "0.6",
    border: {
      top: "1in",
      bottom: "1in",
    },
  };
  return new Promise((resolve, reject) => {
    htmlPdf.create(html, options).toBuffer((err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
};

app.post("/sendPdfOnEmail", async (req, res) => {
  const data = req.body;
  const pdfFile = await htmlToPdfBuffer("views/index.ejs", {
    data: data,
  });
  sendEmail(pdfFile, req.body.email);
  res.json({
    status: 200,
  });
});

app.listen(process.env.PORT, () => {
  console.log("listen on url http://localhost:" + port);
});
