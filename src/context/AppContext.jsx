import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [systemStatus, setSystemStatus] = useState({
        status: 'normal',
        message: 'System Normal: Awaiting pond scan.'
    });

    const [visionMetrics, setVisionMetrics] = useState([
        { label: 'Water Turbidity', value: 'Pending', subtext: 'Awaiting scan', status: 'good' },
        { label: 'Algae Coverage', value: 'Pending', subtext: 'Awaiting scan', status: 'good' },
        { label: 'Unconsumed Feed', value: 'Pending', subtext: 'Awaiting scan', status: 'good' },
        { label: 'Est. Biomass', value: 'Pending', subtext: 'Awaiting scan', status: 'good' }
    ]);

    const [pondHistory, setPondHistory] = useState([]);

    const [sensorMetrics, setSensorMetrics] = useState([
        { label: 'pH Level', value: '7.2', subtext: 'Optimal (6.5 - 7.5)', status: 'good' },
        { label: 'Temperature', value: '26°C', subtext: 'Optimal (24 - 28°C)', status: 'good' },
        { label: 'Dissolved O2', value: '6.5 mg/L', subtext: 'Safe (> 5.0)', status: 'good' },
        { label: 'Ammonia', value: '0.02 ppm', subtext: 'Safe (< 0.05)', status: 'good' }
    ]);

    const [treatmentLogs, setTreatmentLogs] = useState([]);


    const addTreatmentLog = (newLog) => {
        setTreatmentLogs(prevLogs => [newLog, ...prevLogs]);
    };

    return (
        <AppContext.Provider value={{ systemStatus, visionMetrics, sensorMetrics, treatmentLogs, pondHistory, addTreatmentLog, setVisionMetrics, setSystemStatus, setPondHistory }}>
            {children}
        </AppContext.Provider>
    );
};