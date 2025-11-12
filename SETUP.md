# Forensic Legal Analyzer - Setup Guide

## System Requirements

### Software Dependencies

✅ **Python 3.11+** (currently: Python 3.11.14)
- No external Python packages required
- Uses only standard library modules:
  - `http.server`
  - `socketserver`
  - `os`
  - `functools`

✅ **Node.js 14.0+** (currently: Node.js v22.21.1)
- npm 10.9.4
- No npm dependencies required
- Zero external packages

## Project Structure

```
4rensic/
├── serve.py                    # Custom development server (recommended)
├── package.json                # npm configuration
├── index-modular.html          # Modular version entry point
├── index.html                  # Original version entry point
└── src/                        # ES6 modules
    ├── analyzers/              # Analysis engines
    ├── components/             # UI components
    ├── data/                   # Statute database (JSON)
    ├── storage/                # Data storage modules
    └── utils/                  # Utility functions
```

## Installation & Setup

### 1. Verify Dependencies

All required dependencies are already installed and configured:

```bash
# Check Python
python3 --version
# Output: Python 3.11.14

# Check Node.js
node --version
# Output: v22.21.1

# Check npm
npm --version
# Output: 10.9.4
```

### 2. Initialize npm (if needed)

```bash
npm install
```

Expected output: `up to date, audited 1 package in 2s`

## Running the Application

### Option 1: Using serve.py (Recommended)

The custom `serve.py` server provides:
- Proper MIME types for ES6 modules
- CORS headers for local development
- Enhanced developer experience
- Detailed startup information

```bash
# Make executable (already done)
chmod +x serve.py

# Run the server
./serve.py

# Or alternatively
python3 serve.py
```

**Server URLs:**
- http://localhost:8000/index-modular.html (Modular Version)
- http://localhost:8000/index.html (Original Version)

### Option 2: Using npm start

```bash
npm start
```

This runs: `python3 -m http.server 8000`

**Server URL:** http://localhost:8000

### Option 3: Using npm run serve

```bash
npm run serve
```

Same as `npm start` - runs the basic Python HTTP server.

## Development Server Features (serve.py)

The custom `serve.py` provides:

1. **Proper MIME Types**
   - `.js` and `.jsx` files: `application/javascript; charset=utf-8`
   - `.json` files: `application/json; charset=utf-8`

2. **CORS Headers**
   - `Access-Control-Allow-Origin: *`
   - `Access-Control-Allow-Methods: GET, POST, OPTIONS`
   - `Access-Control-Allow-Headers: Content-Type`

3. **Developer-Friendly Output**
   - Available endpoints listed on startup
   - Module locations documented
   - Development tips included

## Module System

This project uses **ES6 modules** (type: "module"):

- All JavaScript files use ES6 import/export syntax
- Browser loads modules dynamically
- No bundler required for development
- Modules are cached by the browser

**package.json configuration:**
```json
{
  "type": "module",
  "exports": {
    ".": "./src/main.jsx",
    "./analyzers/*": "./src/analyzers/*.js",
    "./storage/*": "./src/storage/*.js",
    "./utils/*": "./src/utils/*.js",
    "./data/*": "./src/data/*.json"
  }
}
```

## Troubleshooting

### Port Already in Use

If port 8000 is already in use:

```bash
# Find process using port 8000
lsof -i :8000

# Or use an alternative port
python3 serve.py  # Edit PORT variable in serve.py
```

### Module Loading Issues

1. Open browser DevTools (F12)
2. Check the Console tab for errors
3. Check the Network tab for failed module loads
4. Ensure proper MIME types: `application/javascript`

### CORS Errors

If you encounter CORS errors:
- Use `serve.py` instead of basic Python HTTP server
- Check browser console for specific CORS errors
- Ensure server is running on localhost

## Browser Compatibility

Tested with modern browsers supporting ES6 modules:
- Chrome 61+
- Firefox 60+
- Safari 11+
- Edge 16+

## Configuration Files

### serve.py Configuration

Located at: `/home/user/4rensic/serve.py`

Key settings:
- Default port: 8000
- Serves from current working directory
- Configurable via PORT variable (line 12)

### package.json Configuration

Located at: `/home/user/4rensic/package.json`

Key settings:
- Project name: forensic-legal-analyzer
- Version: 2.0.0
- Type: module (ES6)
- Scripts: start, serve, test

## Next Steps

1. **Start the development server:**
   ```bash
   ./serve.py
   ```

2. **Open in browser:**
   - http://localhost:8000/index-modular.html

3. **Begin development:**
   - Edit files in `src/` directory
   - Refresh browser to see changes
   - Monitor DevTools console for errors

## Additional Resources

- `MODULAR_ARCHITECTURE_README.md` - Module architecture details
- `INTEGRATION_GUIDE.md` - Integration instructions
- `README.md` - Project overview
- `USER_GUIDE.md` - User documentation

## Support

For issues or questions:
- Repository: https://github.com/gtgspot/4rensic
- Issues: https://github.com/gtgspot/4rensic/issues

---

**Status:** ✅ All dependencies installed and configured
**Last Updated:** 2025-11-12
