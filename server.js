const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const visitsFile = path.join(__dirname, "visits.txt");
const logsFile = path.join(__dirname, "logs.txt");

// Function to log requests
function logRequest(method, url) {
  const timestamp = new Date().toISOString().replace("T", " ").split(".")[0];
  const log = `[${timestamp}] ${method} ${url}\n`;
  fs.appendFileSync(logsFile, log);
}

const server = http.createServer((req, res) => {
  logRequest(req.method, req.url);

  // ROUTE: /visit
  if (req.method === "GET" && req.url === "/visit") {
    let count = 0;

    if (fs.existsSync(visitsFile)) {
      count = parseInt(fs.readFileSync(visitsFile, "utf8")) || 0;
    }

    count++;
    fs.writeFileSync(visitsFile, count.toString());

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(`Visit Count: ${count}`);
  }

  // ROUTE: /count
  else if (req.method === "GET" && req.url === "/count") {
    if (!fs.existsSync(visitsFile)) {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("No Visits Recorded");
    } else {
      const count = fs.readFileSync(visitsFile, "utf8");
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(`Total Visits: ${count}`);
    }
  }

  // ROUTE: /reset
  else if (req.method === "GET" && req.url === "/reset") {
    fs.writeFileSync(visitsFile, "0");
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Visit Counter Reset Successfully");
  }

  // 404 HANDLER
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Route Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});