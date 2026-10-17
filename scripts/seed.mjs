import { randomBytes, scryptSync } from "node:crypto";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

const sql = postgres(connectionString);
const passwordHash = hashPassword("demo");

await sql`truncate table diet_list, client_account, client, dietitian cascade`;

const [selin] = await sql`
  insert into dietitian (name, email, password_hash)
  values ('Selin Kara', 'selin@clinic.demo', ${passwordHash})
  returning id
`;

const [emre] = await sql`
  insert into dietitian (name, email, password_hash)
  values ('Emre Aksoy', 'emre@clinic.demo', ${passwordHash})
  returning id
`;

const [elifClient] = await sql`
  insert into client (name, phone, note, dietitian_id)
  values ('Elif Yılmaz', '532 000 00 11', 'Laktoz hassasiyeti', ${selin.id})
  returning id
`;

const [kerem] = await sql`
  insert into client (name, phone, note, dietitian_id)
  values ('Kerem Aydın', '532 000 00 22', 'Akşamları dışarıda yiyor', ${emre.id})
  returning id
`;

await sql`
  insert into client_account (client_id, email, password_hash)
  values (${elifClient.id}, 'elif@clinic.demo', ${passwordHash})
`;

await sql`
  insert into diet_list (client_id, author_id, body, status)
  values (
    ${elifClient.id},
    ${selin.id},
    ${"Pazartesi\nKahvaltı: 2 yumurta, peynir, domates\nÖğle: mercimek çorba, yoğurt\nAkşam: ızgara balık, salata"},
    'sent'
  )
`;

await sql`
  insert into diet_list (client_id, author_id, body, status)
  values (
    ${kerem.id},
    ${emre.id},
    ${"Salı\nKahvaltı: yulaf, muz\nÖğle: tavuk, bulgur, salata\nAkşam: çorba, yoğurt"},
    'draft'
  )
`;

const counts = await sql`
  select
    (select count(*) from dietitian) as dietitians,
    (select count(*) from client) as clients,
    (select count(*) from client_account) as accounts,
    (select count(*) from diet_list) as lists
`;

console.log(counts[0]);

await sql.end();