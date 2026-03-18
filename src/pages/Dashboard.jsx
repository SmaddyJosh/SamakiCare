import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import '../css/Dashboard.css';

export default function Dashboard() {
    const { systemStatus, metrics } = useContext(AppContext);

    return (
        <div className="dashboard-container">
            <div className={`alert-banner ${systemStatus.status}`}>
                {systemStatus.status === 'warning' ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
                <div>
                    <h2>{systemStatus.status === 'warning' ? 'Action Required' : 'System Normal'}</h2>
                    <p>{systemStatus.message}</p>
                </div>
            </div>

            <div>
                <h3 className="section-title">Live Pond Metrics</h3>
                <div className="metrics-grid">
                    {metrics.map((m, i) => (
                        <div key={i} className="metric-card">
                            <span className="metric-label">{m.label}</span>
                            <span className={`metric-value ${m.status === 'alert' ? 'alert' : ''}`}>
                                {m.value}
                            </span>
                            <span className="metric-ideal">Ideal: {m.ideal}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}