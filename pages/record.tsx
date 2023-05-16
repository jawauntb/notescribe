import React, { useState, useRef, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import styles from '../styles/Record.module.css';

const Record: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [notes, setNotes] = useState<string[]>([]);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<BlobPart[]>([]);

  useEffect(() => {
    const handleDataAvailable = (e: BlobEvent) => {
      if (e.data.size > 0) {
        recordedChunks.current.push(e.data);
      }
    };

    const handleStop = async () => {
      const blob = new Blob(recordedChunks.current);
      const audioURL = URL.createObjectURL(blob);
      setAudioURL(audioURL);
      recordedChunks.current = [];

      const formData = new FormData();
      formData.append('file', blob, 'recording.wav');

      const response = await fetch('https://notescribe.jawaunbrown.repl.co/extract_notes', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.error('Failed to extract notes', response);
        return;
      }

      const data = await response.json();
      setNotes(data.notes);
    };

    const initMediaRecorder = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = handleDataAvailable;
    
      mediaRecorder.current.addEventListener('stop', handleStop);
    };
    

    initMediaRecorder();
  }, []);

  const handleStartRecording = () => {
    mediaRecorder.current?.start();
    setRecording(true);
  };

  const handleStopRecording = () => {
    mediaRecorder.current?.stop();
    setRecording(false);
  };
  

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={recording ? handleStopRecording : handleStartRecording}>
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
      {audioURL && <AudioPlayer src={audioURL} />}
      {notes.length > 0 && <div className={styles.notes}>Notes: {notes.join(', ')}</div>}
    </div>
  );
};

export default Record;
