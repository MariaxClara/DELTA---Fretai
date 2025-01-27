import fs from 'fs';
import path from 'path';

// Função para ler e extrair texto de todos os arquivos .txt em uma pasta
export async function extractTextFromTXTs(folderPath) {
  const files = fs.readdirSync(folderPath);
  const txtFiles = files.filter(file => path.extname(file).toLowerCase() === '.txt');
  
  let combinedText = '';

  for (const file of txtFiles) {
    const filePath = path.join(folderPath, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8'); // Lê o conteúdo do arquivo .txt
    combinedText += `\n### Conteúdo do arquivo: ${file} ###\n`;
    combinedText += fileContent;
  }

  return combinedText;
}
