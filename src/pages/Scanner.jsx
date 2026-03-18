import React, { useState, useRef, useEffect } from 'react';
import { Camera, UploadCloud, ChevronRight, ShieldAlert, Droplet, X, Focus } from 'lucide-react';
import '../css/Scanner.css';

export default function Scanner() {
    const [scanState, setScanState] = useState('idle');
    const [scanText, setScanText] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            startScanSimulation();
        }
    };

    const openCamera = async () => {
        try {
            // Changed to 'user' for laptop testing (webcams). 
            // If you deploy to a phone later, change this back to 'environment' for the back camera!
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }
            });

            setScanState('camera');
            streamRef.current = stream;

            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }
            }, 100);

        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Please allow camera permissions in your browser.");
        }
    };

    // 🛠️ THE FIXED CAPTURE FUNCTION
    const capturePhoto = () => {
        console.log("Snap button clicked!"); // Check your browser console to ensure the button is firing

        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            // Ensure the video actually has dimensions before grabbing
            if (video.videoWidth === 0 || video.videoHeight === 0) {
                console.error("Video dimensions not ready yet.");
                return;
            }

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');

            // FLIP THE CANVAS: This makes sure the saved photo isn't backwards
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);

            // Draw the image
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert and save
            const imageUrl = canvas.toDataURL('image/jpeg', 0.9); // 0.9 compresses it slightly for speed
            console.log("Image captured successfully!");

            setSelectedImage(imageUrl);
            stopCamera();
            startScanSimulation();
        } else {
            console.error("Video or Canvas ref is missing.");
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (scanState === 'camera') {
            setScanState('idle');
        }
    };

    useEffect(() => {
        return () => stopCamera();
    }, []);

    const startScanSimulation = () => {
        setScanState('scanning');
        setScanText('Analyzing scale patterns...');
        setTimeout(() => setScanText('Checking disease database...'), 1500);
        setTimeout(() => setScanText('Calculating confidence score...'), 3000);
        setTimeout(() => setScanState('result'), 4500);
    };

    const resetScanner = () => {
        setScanState('idle');
        setSelectedImage(null);
    };

    return (
        <div className="scanner-page">
            <div className="scanner-header">
                <h1>Disease Scanner</h1>
                <p>Upload or snap an image of the affected fish</p>
            </div>

            {scanState === 'idle' && (
                <div className="input-state">
                    <div className="upload-box" onClick={() => fileInputRef.current?.click()}>
                        <UploadCloud size={48} strokeWidth={1.5} />
                        <span>Tap to Upload Photo</span>
                    </div>
                    <div className="divider"><span>OR</span></div>
                    <button className="btn-primary" onClick={openCamera}>
                        <Camera size={20} />
                        Open Camera
                    </button>
                    <input type="file" accept="image/*" className="hidden-input" style={{ display: 'none' }} ref={fileInputRef} onChange={handleImageUpload} />
                </div>
            )}

            {scanState === 'camera' && (
                <div className="flex flex-col items-center gap-4 mt-4 h-full">
                    <div className="relative w-full max-w-sm aspect-[3/4] bg-black rounded-2xl overflow-hidden shadow-lg border-4 border-slate-800">
                        {/* 🛠️ ADDED transform: scaleX(-1) to create the mirror effect */}
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            style={{ transform: 'scaleX(-1)' }}
                            className="w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Focus size={120} className="text-white/50 animate-pulse" strokeWidth={1} />
                        </div>

                        <button onClick={stopCamera} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-red-500 transition-colors z-10">
                            <X size={20} />
                        </button>
                    </div>

                    <canvas ref={canvasRef} style={{ display: 'none' }} />

                    {/* 🛠️ Added explicit z-index and active state to the snap button */}
                    <button
                        onClick={capturePhoto}
                        className="w-16 h-16 bg-white border-4 border-teal-500 rounded-full shadow-lg shadow-teal-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer z-10"
                    >
                        <div className="w-12 h-12 bg-teal-500 rounded-full pointer-events-none"></div>
                    </button>
                    <p className="text-sm text-slate-500">Center the fish in the frame</p>
                </div>
            )}

            {scanState === 'scanning' && (
                <div className="scanning-state">
                    <div className="scan-window">
                        <img src={selectedImage} alt="Scanning" className="scan-image" />
                        <div className="laser"></div>
                    </div>
                    <p className="scan-text">{scanText}</p>
                </div>
            )}

            {scanState === 'result' && (
                <div className="result-state">
                    <div className="result-image-container">
                        <img src={selectedImage} alt="Result" className="scan-image" style={{ opacity: 1 }} />
                        <div className="bounding-box"></div>
                    </div>
                    <div className="result-card">
                        <div className="result-header">
                            <div>
                                <span className="disease-tag"><ShieldAlert size={14} /> Disease Detected</span>
                                <h2>Columnaris</h2>
                                <p className="text-muted">"Cotton Wool Disease"</p>
                            </div>
                            <div className="confidence-score">
                                <div className="confidence-number">88%</div>
                                <div className="text-muted" style={{ fontSize: '10px' }}>Confidence</div>
                            </div>
                        </div>
                        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1rem 0' }} />
                        <h3>Recommended Action</h3>
                        <ul className="action-list">
                            <li className="action-item">
                                <Droplet size={18} color="var(--primary)" />
                                <span>Isolate fish immediately. Treat water with <strong>Potassium Permanganate</strong> (2mg/L).</span>
                            </li>
                        </ul>
                    </div>
                    <div className="button-group">
                        <button onClick={resetScanner} className="btn-secondary">Scan Another</button>
                        <button className="btn-primary flex-1">Save Log <ChevronRight size={18} /></button>
                    </div>
                </div>
            )}
        </div>
    );
}