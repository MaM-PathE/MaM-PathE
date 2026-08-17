import { sql } from "@/lib/db"

export async function initAdminTables() {
  try {
    // Table pour les images de la galerie
    await sql`
      CREATE TABLE IF NOT EXISTS gallery_images (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        image_url TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'image',
        category TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Table pour les vidéos
    await sql`
      CREATE TABLE IF NOT EXISTS videos (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        embed_url TEXT NOT NULL,
        thumbnail_url TEXT,
        category TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Table pour les podcasts
    await sql`
      CREATE TABLE IF NOT EXISTS podcasts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        audio_url TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Table pour les interventions
    await sql`
      CREATE TABLE IF NOT EXISTS interventions (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Table pour les supervisions
    await sql`
      CREATE TABLE IF NOT EXISTS supervisions (
        id SERIAL PRIMARY KEY,
        student_name TEXT NOT NULL,
        project_title TEXT NOT NULL,
        institution TEXT NOT NULL,
        period TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    await sql`ALTER TABLE supervisions ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'ongoing'`
    await sql`UPDATE supervisions SET status = 'ongoing' WHERE status IS NULL OR status NOT IN ('ongoing', 'completed')`

    // Supports de cours et lectures publiés
    await sql`
      CREATE TABLE IF NOT EXISTS course_materials (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        chapter TEXT,
        description TEXT,
        material_type TEXT NOT NULL DEFAULT 'document',
        file_url TEXT,
        video_url TEXT,
        file_name TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("Admin tables initialized successfully")
    return true
  } catch (error) {
    console.error("Error initializing admin tables:", error)
    throw error
  }
}

// Fonctions pour les images de la galerie
export async function getAllGalleryImages() {
  try {
    return await sql`
      SELECT * FROM gallery_images
      WHERE NULLIF(TRIM(image_url), '') IS NOT NULL
      ORDER BY created_at DESC
    `
  } catch (error) {
    console.error("Error in getAllGalleryImages:", error)
    return []
  }
}

export async function addGalleryImage(data: {
  title: string
  image_url: string
  type?: string
  category?: string | null
}) {
  try {
    return await sql`
      INSERT INTO gallery_images (title, image_url, type, category)
      VALUES (${data.title}, ${data.image_url}, ${data.type || "image"}, ${data.category})
      RETURNING *
    `
  } catch (error) {
    console.error("Error in addGalleryImage:", error)
    throw error
  }
}

export async function deleteGalleryImage(id: number) {
  try {
    return await sql`DELETE FROM gallery_images WHERE id = ${id}`
  } catch (error) {
    console.error("Error in deleteGalleryImage:", error)
    throw error
  }
}

// Fonctions pour les vidéos
export async function getAllVideos() {
  try {
    return await sql`SELECT * FROM videos ORDER BY created_at DESC`
  } catch (error) {
    console.error("Error in getAllVideos:", error)
    return []
  }
}

export async function addVideo(data: {
  title: string
  embed_url: string
  thumbnail_url?: string | null
  category?: string | null
}) {
  try {
    return await sql`
      INSERT INTO videos (title, embed_url, thumbnail_url, category)
      VALUES (${data.title}, ${data.embed_url}, ${data.thumbnail_url}, ${data.category})
      RETURNING *
    `
  } catch (error) {
    console.error("Error in addVideo:", error)
    throw error
  }
}

export async function deleteVideo(id: number) {
  try {
    return await sql`DELETE FROM videos WHERE id = ${id}`
  } catch (error) {
    console.error("Error in deleteVideo:", error)
    throw error
  }
}

// Fonctions pour les podcasts
export async function getAllPodcasts() {
  try {
    return await sql`SELECT * FROM podcasts ORDER BY created_at DESC`
  } catch (error) {
    console.error("Error in getAllPodcasts:", error)
    return []
  }
}

export async function addPodcast(data: { title: string; audio_url: string; description?: string | null }) {
  try {
    return await sql`
      INSERT INTO podcasts (title, audio_url, description)
      VALUES (${data.title}, ${data.audio_url}, ${data.description})
      RETURNING *
    `
  } catch (error) {
    console.error("Error in addPodcast:", error)
    throw error
  }
}

export async function deletePodcast(id: number) {
  try {
    return await sql`DELETE FROM podcasts WHERE id = ${id}`
  } catch (error) {
    console.error("Error in deletePodcast:", error)
    throw error
  }
}

// Fonctions pour les interventions
export async function getAllInterventions() {
  try {
    return await sql`SELECT * FROM interventions ORDER BY date DESC`
  } catch (error) {
    console.error("Error in getAllInterventions:", error)
    return []
  }
}

export async function addIntervention(data: {
  title: string
  date: string
  location: string
  description?: string | null
  type: string
}) {
  try {
    return await sql`
      INSERT INTO interventions (title, date, location, description, type)
      VALUES (${data.title}, ${data.date}, ${data.location}, ${data.description}, ${data.type})
      RETURNING *
    `
  } catch (error) {
    console.error("Error in addIntervention:", error)
    throw error
  }
}

export async function deleteIntervention(id: number) {
  try {
    return await sql`DELETE FROM interventions WHERE id = ${id}`
  } catch (error) {
    console.error("Error in deleteIntervention:", error)
    throw error
  }
}

// Fonctions pour les supervisions
export async function getAllSupervisions() {
  try {
    return await sql`SELECT * FROM supervisions ORDER BY created_at DESC`
  } catch (error) {
    console.error("Error in getAllSupervisions:", error)
    return []
  }
}

export async function addSupervision(data: {
  student_name: string
  project_title: string
  institution: string
  period: string
  description?: string | null
  status?: "completed" | "ongoing"
}) {
  try {
    return await sql`
      INSERT INTO supervisions (student_name, project_title, institution, period, description, status)
      VALUES (${data.student_name}, ${data.project_title}, ${data.institution}, ${data.period}, ${data.description}, ${data.status || "ongoing"})
      RETURNING *
    `
  } catch (error) {
    console.error("Error in addSupervision:", error)
    throw error
  }
}

export async function deleteSupervision(id: number) {
  try {
    return await sql`DELETE FROM supervisions WHERE id = ${id}`
  } catch (error) {
    console.error("Error in deleteSupervision:", error)
    throw error
  }
}

export async function getAllCourseMaterials() {
  try {
    return await sql`SELECT * FROM course_materials ORDER BY created_at DESC`
  } catch (error) {
    console.error("Error in getAllCourseMaterials:", error)
    return []
  }
}

export async function addCourseMaterial(data: {
  title: string
  chapter?: string | null
  description?: string | null
  material_type: string
  file_url?: string | null
  video_url?: string | null
  file_name?: string | null
}) {
  return await sql`
    INSERT INTO course_materials (title, chapter, description, material_type, file_url, video_url, file_name)
    VALUES (${data.title}, ${data.chapter}, ${data.description}, ${data.material_type}, ${data.file_url}, ${data.video_url}, ${data.file_name})
    RETURNING *
  `
}

export async function deleteCourseMaterial(id: number) {
  return await sql`DELETE FROM course_materials WHERE id = ${id}`
}
