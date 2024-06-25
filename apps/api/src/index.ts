import express from "express";


const app = express();

app.use(express.json())

app.get("/", async (req, res) => {

 
});

app.post("/", async (req, res) => {
  const { key, data }: { key: string, data: string } = req.body;
});

const httpServer = app.listen(8080, () => console.log("server running on port 8080..."));

