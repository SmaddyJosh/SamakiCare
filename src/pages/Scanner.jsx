
import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AppContext } from '../context/AppContext'; // Import the context
import { Camera, UploadCloud, ChevronRight, ShieldAlert, Droplet, X, Focus, CheckCircle, Fish } from 'lucide-react';
import '../css/Scanner.css';

export default function Scanner() {
    const [scanState, setScanState] = useState('idle');
    const [scanText, setScanText] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [scanResult, setScanResult] = useState(null);

    const { addTreatmentLog } = useContext(AppContext);
    const navigate = useNavigate();

    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);


    const [scanMode, setScanMode] = useState('fish'); // 'fish' or 'pond'
    const { setVisionMetrics, setSystemStatus, setPondHistory } = useContext(AppContext);


    const analyzePondWithGemini = async (imageBase64) => {
        setScanState('scanning');
        setScanText('Analyzing water conditions...');

        try {
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


            const base64Data = imageBase64.split(',')[1];

            const prompt = `
        You are an aquaculture AI. Analyze this image of a fish pond. 
        Return ONLY a valid, raw JSON array (no markdown formatting, no \`\`\`json) containing 4 objects with these exact keys: label, value, subtext, status.
        
        Estimate these 4 metrics based on the visual evidence:
        1. "Water Turbidity" (value: Clear/Muddy/Green, status: 'good' or 'alert')
        2. "Algae Coverage" (value: estimate %, status: 'good' or 'alert')
        3. "Unconsumed Feed" (value: Low/High, status: 'good' or 'alert')
        4. "Est. Biomass" (value: estimate avg fish length in cm if visible, otherwise 'Unknown', status: 'good')
      `;

            const image = {
                inlineData: { data: base64Data, mimeType: "image/jpeg" }
            };

            const result = await model.generateContent([prompt, image]);
            const responseText = result.response.text();

            const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            const newMetrics = JSON.parse(cleanJson);


            setVisionMetrics(newMetrics);


            const biomassMetric = newMetrics.find(m => m.label === "Est. Biomass");
            const algaeMetric = newMetrics.find(m => m.label === "Algae Coverage");
            const feedMetric = newMetrics.find(m => m.label === "Unconsumed Feed");

            const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


            const numBiomass = biomassMetric ? parseFloat(biomassMetric.value) || 13.5 : 13.5;
            const numAlgae = algaeMetric ? parseFloat(algaeMetric.value) || 10 : 10;
            const numFeed = feedMetric && feedMetric.value.toLowerCase().includes('high') ? 400 : 100;

            setPondHistory(prev => [
                ...prev,
                { time: timeNow, biomass: numBiomass, algae: numAlgae, feedWaste: numFeed }
            ]);


            const hasAlert = newMetrics.some(m => m.status === 'alert');
            setSystemStatus({
                status: hasAlert ? 'warning' : 'normal',
                message: hasAlert
                    ? ' Alert: Poor water conditions detected. Action required.'
                    : ' Analysis Complete: Pond conditions look healthy.'
            });


            navigate('/');
            setScanState('idle');
        } catch (error) {
            console.error(" Error:", error);
            setScanText('Error communicating with Gemini API.');
            setTimeout(() => setScanState('idle'), 3000);
        }
    };


    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Image = reader.result;
                setSelectedImage(base64Image);
                if (scanMode === 'pond') {
                    analyzePondWithGemini(base64Image);
                } else {
                    sendToPythonAPI(file);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveLog = () => {
        if (!scanResult) return;

        const newLog = {
            id: Date.now(),
            timestamp: new Date().toLocaleString(),
            image: selectedImage,
            disease: scanResult.top_class.replace(/_/g, " "),
            isHealthy: scanResult.is_healthy,
            confidence: (scanResult.confidence * 100).toFixed(1),
            treatment: scanResult.is_healthy ? "None required" : "Isolate and treat with Potassium Permanganate (2mg/L)",
            status: 'Active'
        };

        addTreatmentLog(newLog);
        navigate('/history');
    };


    const openCamera = async () => {
        try {
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

    const capturePhoto = async () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            if (video.videoWidth === 0 || video.videoHeight === 0) return;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');

            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
            setSelectedImage(imageUrl);
            stopCamera();


            if (scanMode === 'pond') {
                analyzePondWithGemini(imageUrl);
            } else {
                const res = await fetch(imageUrl);
                const blob = await res.blob();
                sendToPythonAPI(blob);
            }
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (scanState === 'camera') setScanState('idle');
    };

    useEffect(() => {
        return () => stopCamera();
    }, []);


    const sendToPythonAPI = async (imageFileOrBlob) => {
        setScanState('scanning');
        setScanText('Uploading to AI Server...');

        try {

            const formData = new FormData();
            formData.append("file", imageFileOrBlob, "fish_scan.jpg");

            setScanText('Analyzing neural network predictions...');


            const response = await fetch(`${import.meta.env.VITE_API_URL}/predict`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Server error");

            const data = await response.json();
            console.log("Python Response:", data); // Check console to see the raw data!

            setScanResult(data);
            setScanState('result');

        } catch (error) {
            console.error("API Error:", error);
            setScanText('Connection Error: Is the Python server running?');
            setTimeout(() => resetScanner(), 3000);
        }
    };

    const resetScanner = () => {
        setScanState('idle');
        setSelectedImage(null);
        setScanResult(null);
    };

    return (
        <div className="scanner-page">
            <div className="scanner-header">
                <h1>Disease Scanner</h1>
                <p>Upload or snap an image of the affected fish or Pond</p>
            </div>


            {scanState === 'idle' && (
                <div className="input-state">

                    <div className="scan-mode-toggle">
                        <button
                            className={`toggle-btn ${scanMode === 'fish' ? 'active' : 'inactive'}`}
                            onClick={() => setScanMode('fish')}
                        >
                            <Fish size={18} />
                            Fish Scan
                        </button>
                        <button
                            className={`toggle-btn ${scanMode === 'pond' ? 'active' : 'inactive'}`}
                            onClick={() => setScanMode('pond')}
                        >
                            <Droplet size={18} />
                            Pond Scan
                        </button>
                    </div>

                    <div className="upload-box" onClick={() => fileInputRef.current?.click()}>
                        <UploadCloud size={48} strokeWidth={1.5} />
                        <span>Tap to Upload Photo</span>
                    </div>
                    <div className="divider"><span>OR</span></div>
                    <button className="btn-primary" onClick={openCamera}>
                        <Camera size={20} />
                        Open Camera
                    </button>
                    <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleImageUpload} />
                </div>
            )}


            {scanState === 'camera' && (
                <div className="camera-mode-container">
                    <div className="camera-video-wrapper">
                        <video ref={videoRef} autoPlay playsInline style={{ transform: 'scaleX(-1)' }} className="camera-video" />
                        <div className="camera-focus-overlay">
                            <Focus size={120} strokeWidth={1} />
                        </div>
                        <button onClick={stopCamera} className="camera-close-btn">
                            <X size={20} />
                        </button>
                    </div>
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    <button onClick={capturePhoto} className="camera-capture-btn">
                        <div className="camera-capture-btn-inner"></div>
                    </button>
                    <p className="camera-hint-text">Center the fish in the frame</p>
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

            {scanState === 'result' && scanResult && (
                <div className="result-state">
                    <div className="result-image-container">
                        <img src={selectedImage} alt="Result" className="scan-image" style={{ opacity: 1 }} />

                        {!scanResult.is_healthy && <div className="bounding-box"></div>}
                    </div>

                    <div className="result-card">
                        <div className="result-header">
                            <div>

                                {scanResult.is_healthy ? (
                                    <span className="disease-tag" style={{ color: '#10b981' }}>
                                        <CheckCircle size={14} /> Healthy Fish
                                    </span>
                                ) : (
                                    <span className="disease-tag" style={{ color: '#ef4444' }}>
                                        <ShieldAlert size={14} /> Disease Detected
                                    </span>
                                )}


                                <h2 style={{ textTransform: 'capitalize', margin: '0.25rem 0' }}>
                                    {scanResult.top_class.replace(/_/g, " ")}
                                </h2>
                            </div>

                            <div className="confidence-score">
                                <div className="confidence-number" style={{ color: scanResult.is_healthy ? '#10b981' : 'var(--primary)' }}>
                                    {(scanResult.confidence * 100).toFixed(1)}%
                                </div>
                                <div className="text-muted" style={{ fontSize: '10px' }}>Confidence</div>
                            </div>
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1rem 0' }} />

                        <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '1rem', lineHeight: '1.5' }}>
                            {scanResult.message}
                        </p>


                        {!scanResult.is_healthy && (
                            <>
                                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Recommended Action</h3>
                                <ul className="action-list">
                                    <li className="action-item" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
                                        <Droplet size={18} color="#dc2626" />
                                        <span>Please isolate this fish immediately and consult local vet guidelines for <strong>{scanResult.top_class.replace(/_/g, " ")}</strong>.</span>
                                    </li>
                                </ul>
                            </>
                        )}
                    </div>

                    <div className="button-group">
                        <button onClick={resetScanner} className="btn-secondary">Scan Another</button>
                        <button onClick={handleSaveLog} className="btn-primary flex-1">Save Log <ChevronRight size={18} /></button>
                    </div>
                </div>
            )}
        </div>
    );
}