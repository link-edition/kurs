import fs from 'fs';
import path from 'path';

const PUBLIC_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function saveFileLocally(file: File, subfolder: string = '') {
  const uploadDir = path.join(PUBLIC_UPLOAD_DIR, subfolder);
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  const filePath = path.join(uploadDir, fileName);
  
  fs.writeFileSync(filePath, buffer);
  
  // Return the public path
  return subfolder ? `/uploads/${subfolder}/${fileName}` : `/uploads/${fileName}`;
}
