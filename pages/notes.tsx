// import { useState } from 'react';
// import { ReactMediaRecorder } from 'react-media-recorder';
// import PitchFinder from 'pitchfinder';
// import { Note } from 'tonal';

// export default function Home() {
//   const [notes, setNotes] = useState([]);
//   const [error, setError] = useState(null);

//   const handleStop = (blobUrl, blob) => {
//     // read blob as arrayBuffer
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const audioContext = new AudioContext();
//       audioContext.decodeAudioData(reader.result, (buffer) => {
//         const detectPitch = PitchFinder.YIN();
//         const float32Array = buffer.getChannelData(0); // get a single channel of sound
//         const pitch = detectPitch(float32Array);
//         const midiNumber = PitchFinder.noteFromPitch(pitch);
//         const noteName = Note.fromMidi(midiNumber);
//         setNotes(prevNotes => [...prevNotes, noteName]); // store the detected note
//       }, (error) => {
//         setError(`Error decoding audio data: ${error.message}`);
//       });
//     };
//     reader.onerror = (error) => {
//       setError(`Error reading blob: ${error.message}`);
//     };
//     reader.readAsArrayBuffer(blob);
//   };

//   return (
//     <div>
//       <ReactMediaRecorder
//         audio
//         onStop={handleStop}
//         render={({ status, startRecording, stopRecording, mediaBlobUrl, error }) => (
//           <div>
//             <p>{status}</p>
//             <button onClick={startRecording}>Start Recording</button>
//             <button onClick={stopRecording}>Stop Recording</button>
//             <audio src={mediaBlobUrl} controls />
//             <p>Detected Notes: {notes.join(", ")}</p>
//             {error && <p>Recording Error: {error}</p>}
//             {error && <p>Error: {error}</p>}
//           </div>
//         )}
//       />
//     </div>
//   );
// }

