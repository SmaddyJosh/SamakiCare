import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { AlertTriangle, CheckCircle, Eye, Wifi } from 'lucide-react';
import '../css/Dashboard.css';

export default function Dashboard() {
    const { systemStatus, visionMetrics, sensorMetrics } = useContext(AppContext);

    return (
        <div className="dashboard-container">


            <div className={`alert-banner ${systemStatus.status === 'warning' ? 'warning' : 'normal'}`}>
                {systemStatus.status === 'warning' ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
                <div>
                    <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>
                        {systemStatus.status === 'warning' ? 'Action Required' : 'System Normal'}
                    </h2>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>{systemStatus.message}</p>
                </div>
            </div>


            <div>
                <div className="section-header">
                    <Eye size={20} color="var(--primary)" />
                    <h3>Optical AI Analysis</h3>
                </div>
                <div className="metrics-grid">
                    {visionMetrics.map((m, i) => (
                        <div key={i} className="metric-card vision">
                            <span className="metric-label">{m.label}</span>
                            <span className={`metric-value ${m.status === 'alert' ? 'alert' : ''}`}>
                                {m.value}
                            </span>
                            <span className="metric-subtext" style={{ color: m.status === 'alert' ? '#dc2626' : 'var(--text-muted)' }}>
                                {m.subtext}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
                <div className="section-header">
                    <Wifi size={18} color="var(--text-muted)" />
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Hardware Sensor Analysis</h3>
                </div>
                <div className="metrics-grid">
                    {sensorMetrics.map((m, i) => (
                        <div key={i} className="metric-card sensor">
                            <span className="metric-label">{m.label}</span>
                            <span className={`metric-value ${m.status === 'alert' ? 'alert' : ''}`}>
                                {m.value}
                            </span>
                            <span className="metric-subtext">{m.subtext}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}