import React, { useState, useRef } from 'react';
import { Camera, UploadCloud, ChevronRight, ShieldAlert, Droplet } from 'lucide-react';
import '../css/Scanner.css';

export default function Scanner() {
    const [scanState, setScanState] = useState('idle');
    const [scanText, setScanText] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            startScanSimulation();
        }
    };

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
                <p>Upload an image of the affected fish</p>
            </div>

            {scanState === 'idle' && (
                <div className="input-state">
                    <div className="upload-box" onClick={() => fileInputRef.current?.click()}>
                        <UploadCloud size={48} strokeWidth={1.5} />
                        <span>Tap to Upload Photo</span>
                    </div>

                    <div className="divider">
                        <span>OR</span>
                    </div>

                    <button className="btn-primary">
                        <Camera size={20} />
                        Open Camera
                    </button>

                    <input
                        type="file"
                        accept="image/*"
                        className="hidden-input"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                    />
                </div>
            )}

            {scanState === 'scanning' && (
                <div className="scanning-state">
                    <div className="scan-window">
                        <img src={selectedImage || "/api/placeholder/400/400"} alt="Scanning" className="scan-image" />
                        <div className="laser"></div>
                    </div>
                    <p className="scan-text">{scanText}</p>
                </div>
            )}

            {scanState === 'result' && (
                <div className="result-state">
                    <div className="result-image-container">
                        <img src={selectedImage || "/api/placeholder/400/400"} alt="Result" className="scan-image" style={{ opacity: 1 }} />
                        <div className="bounding-box"></div>
                    </div>

                    <div className="result-card">
                        <div className="result-header">
                            <div>
                                <span className="disease-tag">
                                    <ShieldAlert size={14} /> Disease Detected
                                </span>
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
                        <button onClick={resetScanner} className="btn-secondary">
                            Scan Another
                        </button>
                        <button className="btn-primary flex-1">
                            Save Log <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}