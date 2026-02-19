const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const logFile = path.join(__dirname, "requests.log");

const server = http.createServer((req, res) => {
  const route = req.url;
  const method = req.method;
  const dateTime = new Date().toLocaleString();

  // Log format
  const log = `${dateTime} | ${method} | ${route}\n`;

  // Append log to file
  fs.appendFile(logFile, log, (err) => {
    if (err) console.error("Logging error:", err);
  });

  // Route handling
  res.writeHead(200, { "Content-Type": "text/plain" });

  if (route === "/") {
    res.end("Home Page");
  } 
  else if (route === "/about") {
    res.end("About Page");
  } 
  else if (route === "/contact") {
    res.end("Contact Page");
  } 
  else {
    res.writeHead(404);
    res.end("404 - Page Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
