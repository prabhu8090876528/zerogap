import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './style.css'

class AppErrorBoundary extends React.Component {
  state = { hasError:false }
  static getDerivedStateFromError() { return { hasError:true } }
  componentDidCatch(error) { console.error('GapZero interface error:', error) }
  render() {
    if (this.state.hasError) {
      return <main style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:24,background:'#f5f6fa',fontFamily:'system-ui'}}>
        <section style={{maxWidth:420,padding:24,border:'1px solid #e5e8f0',borderRadius:16,background:'#fff'}}>
          <h1 style={{fontSize:22}}>This screen hit an error.</h1>
          <p style={{fontSize:14,lineHeight:1.6,color:'#68728a'}}>Your saved study records are stored separately in this browser. Reload GapZero to try again.</p>
          <button onClick={()=>window.location.reload()} style={{padding:'10px 14px',border:0,borderRadius:8,background:'#3454dc',color:'#fff',fontWeight:700}}>Reload GapZero</button>
        </section>
      </main>
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppErrorBoundary><App /></AppErrorBoundary>
  </React.StrictMode>,
)
