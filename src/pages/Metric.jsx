import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import '../css/Metric.css';

export default function Metrics() {
    const { pondHistory } = useContext(AppContext);
    return (
        <div className="metrics-page">
            <div className="metrics-header">
                <h1>Pond Analytics</h1>
                <p>Insights from surface camera feeds</p>
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
                            <LineChart data={pondHistory} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                                <Line type="monotone" dataKey="biomass" name="Est. Biomass" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
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
                            <AreaChart data={pondHistory} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
                                <Area type="monotone" dataKey="algae" name="Algae Growth" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorCoverage)" />
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
                            <BarChart data={pondHistory} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="feedWaste" name="Feed Waste" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}