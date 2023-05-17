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
  const recordTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleDataAvailable = (e: BlobEvent) => {
      if (e.data.size > 0) {
        recordedChunks.current.push(e.data);
      }
    };

    const handleStop = () => {
      const blob = new Blob(recordedChunks.current);
      const audioURL = URL.createObjectURL(blob);
      setAudioURL(audioURL);
      recordedChunks.current = [];
    };

    const initMediaRecorder = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = handleDataAvailable;
      mediaRecorder.current.addEventListener('stop', handleStop);
    };

    initMediaRecorder();
  }, []);

  const sendAudioData = async () => {
    const blob = new Blob(recordedChunks.current);
    const formData = new FormData();
    formData.append('file', blob, 'recording.wav');

    const response = await fetch('https://notescribebackend.jawaunbrown.repl.co/extract_notes', {
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

  const handleStartRecording = () => {
    mediaRecorder.current?.start();
    setRecording(true);
    recordTimeout.current = setTimeout(() => {
      handleStopRecording();
    }, 15000); // Stop recording after 15 seconds
  };

  const handleStopRecording = () => {
    clearTimeout(recordTimeout.current!);
    mediaRecorder.current?.stop();
    setRecording(false);
    setTimeout(() => sendAudioData(), 3000);
  };

  const handleDeleteRecording = () => {
    setAudioURL("");
    setNotes([]);
  };

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={recording ? handleStopRecording : handleStartRecording}>
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
      {audioURL && (
        <div className={styles.audioContainer}>
          <AudioPlayer src={audioURL} />
          <button className={styles.deleteButton} onClick={handleDeleteRecording}>X</button>
        </div>
      )}
      {notes.length > 0 && <div className={styles.notes}>Notes: {notes.join(', ')}</div>}
    </div>
  );
};

export default Record;
