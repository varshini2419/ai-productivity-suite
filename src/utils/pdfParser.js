import * as pdfjsLib from 'pdfjs-dist';

// Try multiple CDN sources for the worker
const PDF_WORKER_URLS = [
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js',
  'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js'
];

// Set worker source with fallbacks
let workerSet = false;
for (const url of PDF_WORKER_URLS) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = url;
    workerSet = true;
    console.log('PDF worker set to:', url);
    break;
  } catch (e) {
    console.warn('Failed to set worker from:', url);
  }
}

if (!workerSet) {
  console.error('Could not set PDF worker from any source');
}

export const extractTextFromPDF = async (file) => {
  // ... rest of your pdfParser.js code
};