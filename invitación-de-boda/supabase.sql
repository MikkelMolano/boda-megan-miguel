CREATE TABLE rsvp (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre_completo TEXT NOT NULL,
  nombre_normalizado TEXT NOT NULL UNIQUE, -- clave para upsert
  primer_nombre TEXT,
  apellido TEXT,
  asistencia TEXT NOT NULL,
  restricciones TEXT,
  mensaje TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
