import { Pool } from "pg";

const pool = new Pool({
  user: "eqgxqykspnclej",
  password: process.env.DB_PASS,
  host: "ec2-107-20-153-39.compute-1.amazonaws.com",
  database: "d4f56rpnfrfi57",
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
  // idleTimeoutMillis: 2000,
  // connectionTimeoutMillis: 1000,
  max: 2,
  keepAlive: false,
});

pool.on("connect", () => {
  console.log("connected ✅");
});

pool.on("remove", () => {
  console.log("disconnected ❌");
});

export default pool;
