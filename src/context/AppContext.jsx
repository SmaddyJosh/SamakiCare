import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [systemStatus, setSystemStatus] = useState({
        status: 'warning', // 'normal' or 'warning'
        message: 'Warning: Pond B pH is critically high (8.5)'
    });

    const [metrics, setMetrics] = useState([
        { label: 'Temperature', value: '26°C', ideal: '24-28°C', status: 'good' },
        { label: 'pH Level', value: '8.5', ideal: '6.5-7.5', status: 'alert' },
        { label: 'Ammonia', value: '0.02 ppm', ideal: '<0.05 ppm', status: 'good' },
        { label: 'Dissolved O2', value: '6.5 mg/L', ideal: '>5 mg/L', status: 'good' },
    ]);

    return (
        <AppContext.Provider value={{ systemStatus, metrics }}>
            {children}
        </AppContext.Provider>
    );
};