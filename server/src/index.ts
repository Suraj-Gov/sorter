import express from "express";
import cors from "cors";
import { Pool } from "pg";
require("dotenv").config();

const pool = new Pool({
  // user: "eqgxqykspnclej",
  // database: "d4f56rpnfrfi57",
  // host: "ec2-107-20-153-39.compute-1.amazonaws.com",
  // port: 5432,
  // password: process.env.DB_PASS,
  connectionString:
    "postgres://eqgxqykspnclej:ddd8d9280de2710272cbbdf31dcf83994ede77e05b921812c3d14538a6f3c581@ec2-107-20-153-39.compute-1.amazonaws.com:5432/d4f56rpnfrfi57",
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
