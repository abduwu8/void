import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Determine the correct dist directory
let distDir = path.join(__dirname, 'dist');
// Check if we're in Render's environment
if (process.env.RENDER && !fs.existsSync(distDir)) {
  // Adjust path for Render's file structure
  distDir = path.join(process.env.RENDER_PROJECT_DIR || '/opt/render/project/src', 'dist');
}

// Serve static files from the dist directory
app.use(express.static(distDir));

// For any route, serve the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 