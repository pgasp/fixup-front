
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// #region agent log
fetch('http://127.0.0.1:7927/ingest/1372315e-c794-41cc-9964-7462f0803240',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'38b955'},body:JSON.stringify({sessionId:'38b955',location:'index.tsx:entry',message:'module_loaded',data:{},timestamp:Date.now(),hypothesisId:'H-A',runId:'pre-fix'})}).catch(()=>{});
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    fetch('http://127.0.0.1:7927/ingest/1372315e-c794-41cc-9964-7462f0803240',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'38b955'},body:JSON.stringify({sessionId:'38b955',location:'index.tsx:window.onerror',message:'global_error',data:{msg:String(e.message),file:e.filename,line:e.lineno},timestamp:Date.now(),hypothesisId:'H-E',runId:'pre-fix'})}).catch(()=>{});
  });
  window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
    fetch('http://127.0.0.1:7927/ingest/1372315e-c794-41cc-9964-7462f0803240',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'38b955'},body:JSON.stringify({sessionId:'38b955',location:'index.tsx:unhandledrejection',message:'unhandled_promise',data:{reason:String(e.reason)},timestamp:Date.now(),hypothesisId:'H-E',runId:'pre-fix'})}).catch(()=>{});
  });
}
// #endregion

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
// #region agent log
fetch('http://127.0.0.1:7927/ingest/1372315e-c794-41cc-9964-7462f0803240',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'38b955'},body:JSON.stringify({sessionId:'38b955',location:'index.tsx:before_render',message:'about_to_render_app',data:{},timestamp:Date.now(),hypothesisId:'H-A',runId:'pre-fix'})}).catch(()=>{});
// #endregion
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
