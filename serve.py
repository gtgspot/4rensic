#!/usr/bin/env python3
"""
Simple HTTP Server for Forensic Legal Analyzer
Serves ES6 modules with proper MIME types
"""

import http.server
import socketserver
import os
from functools import partial

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

        # Set proper MIME types for ES6 modules
        if self.path.endswith('.js') or self.path.endswith('.jsx'):
            self.send_header('Content-Type', 'application/javascript; charset=utf-8')
        elif self.path.endswith('.json'):
            self.send_header('Content-Type', 'application/json; charset=utf-8')

        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

if __name__ == '__main__':
    Handler = partial(MyHTTPRequestHandler, directory=os.getcwd())

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"""
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║       🔬 Forensic Legal Analyzer v2.0 - Development Server    ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

Server running at: http://localhost:{PORT}

📖 Available endpoints:
   • http://localhost:{PORT}/index-modular.html  (Modular Version)
   • http://localhost:{PORT}/index.html          (Original Version)

📁 Module locations:
   • /src/main.jsx              (Main Application)
   • /src/analyzers/            (Analysis Engines)
   • /src/storage/              (Data Storage)
   • /src/utils/                (Utilities)
   • /src/data/                 (Statute Database)

🛠️  Development tips:
   • Open browser DevTools to see module loading
   • Check Network tab for ES6 module imports
   • Console shows initialization progress
   • Modules are cached by browser

Press Ctrl+C to stop the server
        """)

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n✅ Server stopped")
            pass
