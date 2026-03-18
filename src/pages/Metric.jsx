import React from 'react';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import '../css/Metric.css';

// --- MOCK DATA ---//
const growthData = [
    { day: 'Mon', tilipiaSize: 12.1, catfishSize: 14.5 },
    { day: 'Tue', tilipiaSize: 12.2, catfishSize: 14.8 },
    { day: 'Wed', tilipiaSize: 12.4, catfishSize: 15.1 },
    { day: 'Thu', tilipiaSize: 12.7, catfishSize: 15.5 },
    { day: 'Fri', tilipiaSize: 13.0, catfishSize: 16.0 },
    { day: 'Sat', tilipiaSize: 13.3, catfishSize: 16.4 },
    { day: 'Sun', tilipiaSize: 13.5, catfishSize: 16.9 },
];

const algaeData = [
    { time: '6 AM', coverage: 5 },
    { time: '9 AM', coverage: 8 },
    { time: '12 PM', coverage: 15 },
    { time: '3 PM', coverage: 18 },
    { time: '6 PM', coverage: 12 },
    { time: '9 PM', coverage: 7 },
];

const feedWasteData = [
    { day: 'Mon', wasteGrams: 450 },
    { day: 'Tue', wasteGrams: 380 },
    { day: 'Wed', wasteGrams: 410 },
    { day: 'Thu', wasteGrams: 200 },
    { day: 'Fri', wasteGrams: 150 },
    { day: 'Sat', wasteGrams: 120 },
    { day: 'Sun', wasteGrams: 90 },
];

export default function Metrics() {
    return (
        <div className="metrics-page">
            <div className="metrics-header">
                <h1>Pond Analytics</h1>
                <p>AI-driven insights from surface camera feeds</p>
            </div>

            <div className="charts-grid">

                {/* CHART 1: Estimated Growth Trajectory */}
                <div className="chart-card">
                    <div className="chart-title">
                        <span>Estimated Growth (cm)</span>
                        <span className="chart-badge">Optical Tracking</span>
                    </div>
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <LineChart data={growthData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                                <Line type="monotone" dataKey="tilipiaSize" name="Tilapia" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="catfishSize" name="Catfish" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* CHART 2: Algae Surface Coverage */}
                <div className="chart-card">
                    <div className="chart-title">
                        <span>Algae Surface Coverage (%)</span>
                        <span className="chart-badge" style={{ backgroundColor: '#fef2f2', color: '#991b1b' }}>Daily Bloom</span>
                    </div>
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <AreaChart data={algaeData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <defs>
                                    <linearGradient id="colorCoverage" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="coverage" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorCoverage)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* CHART 3: Unconsumed Feed Waste */}
                <div className="chart-card">
                    <div className="chart-title">
                        <span>Unconsumed Feed Waste (g)</span>
                        <span className="chart-badge" style={{ backgroundColor: '#fef9c3', color: '#854d0e' }}>Cost Saver</span>
                    </div>
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <BarChart data={feedWasteData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="wasteGrams" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}