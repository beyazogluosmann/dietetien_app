import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

const sql = postgres(connectionString);
const rows = await sql`select current_database() as name`;

console.log(rows[0].name);

await sql.end();