import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Simple Error Boundary to catch crash errors (like missing env vars)
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif', color: '#333', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f0f9ff' }}>
          <h1 style={{fontSize: '2rem', marginBottom: '1rem'}}>⚠️ 哎呀，出错了</h1>
          <p style={{marginBottom: '0.5rem'}}>程序遇到了一些问题。</p>
          <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '0.5rem', maxWidth: '80%', wordBreak: 'break-all', fontSize: '0.8rem', marginBottom: '2rem' }}>
            {this.state.error?.message}
          </div>
          <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '2rem'}}>如果您在手机上看到此页面，通常是因为 API Key 配置问题。</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold',