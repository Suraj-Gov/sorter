import express = require("express");
import cors = require("cors");
import dotenv = require("dotenv");
import { Pool } from "pg";
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();

app.use(
  cors({
    allowedHeaders: ["https://suraj-gov.github.io/sorter", "localhost:3000"],
  })
);
app.use(express.json());

app.get("/", async (_, res) => {
  const visitorCount = await pool.query("SELECT SUM(count) FROM visitors");
  res.send({
    status: "awake",
    count: visitorCount.rows[0].sum,
  });
});

app.get("/hello", async (req, res) => {
  const visits = await pool.query({
    text: "SELECT * FROM visitors WHERE ip_address = $1",
    values: [req.ip],
  });
  if (visits.rowCount === 0) {
    await pool.query({
      text: "INSERT INTO visitors VALUES ($1, $2)",
      values: [req.ip, new Date()],
    });
    res.send({
      status: "newVisitor",
    });
  } else {
    const timeSinceLastVisit =
      (new Date().getTime() - visits.rows[0].last_visited) / (1000 * 60);
    // convert to minutes
    if (timeSinceLastVisit > 10) {
      await pool.query({
        text:
          "UPDATE visitors SET count = $1, last_visited = $2 WHERE ip_address = $3",
        values: [visits.rows[0].count + 1, new Date(), req.ip],
      });
      res.send({
        status: "newVisitor",
      });
    } else
      res.send({
        status: "oldVisitor",
      });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`listening at ${process.env.PORT}`);
});
