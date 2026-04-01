const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function main() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        id TEXT PRIMARY KEY DEFAULT 'global',
        academy_name TEXT DEFAULT 'Course Architect',
        academy_logo TEXT,
        currency TEXT DEFAULT 'USD',
        primary_color TEXT DEFAULT '#cafd00',
        language TEXT DEFAULT 'uz',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // Insert default settings if not exists
    await sql`
      INSERT INTO settings (id, academy_name)
      VALUES ('global', 'Course Architect')
      ON CONFLICT (id) DO NOTHING;
    `;
    
    console.log('Settings table ready.');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

main();
