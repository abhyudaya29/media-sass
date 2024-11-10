"use client";
import { useState } from 'react';
import { Download, FileAudio } from 'lucide-react'; 

export default function Compress() {
  const [file, setFile] = useState<File | null>(null); 
  const [downloadLink, setDownloadLink] = useState<string | null>(null); 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('audio', file);

    try {
      const response = await fetch('/api/audio-compress', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setDownloadLink(url);  // Set the download link after compression
      } else {
        console.error('Compression failed');
        alert('Compression failed. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Audio Compression</h1>
      
      {/* File input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Choose an audio file</label>
        <input 
          type="file" 
          accept="audio/*" 
          onChange={handleFileChange} 
          className="file-input file-input-bordered w-full max-w-xs" 
        />
      </div>

      {/* Compress button */}
      <button 
        onClick={handleUpload}
        className="btn btn-primary w-full mb-4 flex items-center justify-center"
        disabled={!file}  // Disable button if no file is selected
      >
        <FileAudio className="mr-2" />
        Compress & Download
      </button>

      {/* Download link */}
      {downloadLink && (
        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold mb-2">Compressed File:</h3>
          <a 
            href={downloadLink} 
            download="compressed_audio.mp3"
            className="btn btn-secondary flex items-center justify-center"
          >
            <Download className="mr-2" />
            Download
          </a>
        </div>
      )}
    </div>
  );
}
