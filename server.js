const http = require("http");
const fs = require("fs");
const url = require("url");

const PORT = 3000;
const FILE_NAME = "notes.txt";

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname === "/add" && req.method === "GET") {
    const note = parsedUrl.query.note;

    if (!note) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      return res.end("400 Bad Request");
    }

    fs.appendFile(FILE_NAME, note + "\n", (err) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end("Error Writing File");
      }

      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Note Added Successfully");
    });
  }


  else if (pathname === "/notes" && req.method === "GET") {
    fs.readFile(FILE_NAME, "utf8", (err, data) => {
      if (err || data.trim() === "") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        return res.end("No Notes Found");
      }

      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(data);
    });
  }

  else if (pathname === "/clear" && req.method === "GET") {
    fs.writeFile(FILE_NAME, "", (err) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end("Error Clearing Notes");
      }

      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("All Notes Deleted");
    });
  }


  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});