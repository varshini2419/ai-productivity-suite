// pdfWorker.js - Custom worker configuration
import { GlobalWorkerOptions } from 'pdfjs-dist';

// Try multiple CDN sources in order
const workerUrls = [
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js',
  '/pdf.worker.min.js' // Local fallback if you copy the file
];

// Try each URL until one works
export const initPDFWorker = () => {
  let workerInitialized = false;
  
  const tryWorkerUrl = (url) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => {
        console.log('PDF worker loaded from:', url);
        workerInitialized = true;
        resolve(true);
      };
      script.onerror = () => {
        console.warn('Failed to load PDF worker from:', url);
        reject(false);
      };
      document.head.appendChild(script);
    });
  };

  // Try URLs sequentially
  const initialize = async () => {
    for (const url of workerUrls) {
      try {
        await tryWorkerUrl(url);
        GlobalWorkerOptions.workerSrc = url;
        return true;
      } catch {
        continue;
      }
    }
    console.error('All PDF worker URLs failed');
    return false;
  };

  return initialize();
};