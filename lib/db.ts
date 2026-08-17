import { neon, type NeonQueryFunction } from "@neondatabase/serverless"

// Connexion lazy : neon() n'est instancié qu'au premier appel réel (runtime),
// jamais au chargement du module. Cela évite l'erreur "No database connection
// string was provided" lors de la collecte des données de page au build.
let _sql: NeonQueryFunction<false, false> | null = null

function getSql(): NeonQueryFunction<false, false> {
  if (!_sql) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error("DATABASE_URL is not set. Cannot establish database connection.")
    }
    _sql = neon(connectionString)
  }
  return _sql
}

// Proxy qui délègue tout appel/propriété à la connexion lazy.
// Permet de conserver l'API `sql\`...\`` inchangée dans tout le codebase.
export const sql = new Proxy((() => {}) as unknown as NeonQueryFunction<false, false>, {
  apply(_target, _thisArg, args: unknown[]) {
    const client = getSql()
    // @ts-expect-error - délégation dynamique du tagged template / appel
    return client(...args)
  },
  get(_target, prop, receiver) {
    const client = getSql()
    const value = Reflect.get(client as object, prop, receiver)
    return typeof value === "function" ? value.bind(client) : value
  },
})

// Initialize the database with required tables
export async function initializeDatabase() {
  // Create the blog_posts table
  await sql`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `

  // Create the contact_messages table
  await sql`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `
}
