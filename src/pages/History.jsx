import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ShieldAlert, CheckCircle, ClipboardList } from 'lucide-react';
import '../css/History.css';

export default function History() {
    const { treatmentLogs } = useContext(AppContext);

    return (
        <div className="history-page">
            <div className="history-header">
                <h1>Treatment Logs</h1>
                <p>Historical record of AI diagnoses and actions</p>
            </div>

            {treatmentLogs.length === 0 ? (
                <div className="empty-state">
                    <ClipboardList size={48} color="var(--border-color)" style={{ margin: '0 auto 1rem' }} />
                    <h3>No logs yet</h3>
                    <p>Scanned fish records will appear here.</p>
                </div>
            ) : (
                <div className="log-list">
                    {treatmentLogs.map((log) => (
                        <div key={log.id} className="log-card">
                            <img src={log.image} alt="Scan thumbnail" className="log-thumbnail" />

                            <div className="log-details">
                                <div className="log-title-row">
                                    <div>
                                        <h3 className="log-disease">{log.disease}</h3>
                                        <div className={`badge ${log.isHealthy ? 'healthy' : 'sick'}`}>
                                            {log.isHealthy ? <CheckCircle size={12} /> : <ShieldAlert size={12} />}
                                            {log.isHealthy ? 'Healthy' : 'Requires Attention'}
                                        </div>
                                    </div>
                                    <span className="log-date">{log.timestamp}</span>
                                </div>

                                {!log.isHealthy && (
                                    <div className="log-action">
                                        <strong>Action:</strong> {log.treatment}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}