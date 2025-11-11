# 🔬 Forensic Legal Analyzer

**Version 2.0.0 - Modular Architecture**

A comprehensive Victorian legal document analysis system with statutory compliance checking, defect detection, and intelligent pattern recognition.

[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](package.json)
[![Jurisdiction](https://img.shields.io/badge/jurisdiction-Victoria%2C%20Australia-green.svg)]()

---

## 🎯 Overview

The Forensic Legal Analyzer is a sophisticated tool for analyzing legal documents within the Victorian jurisdiction. It performs deep statutory compliance checking, identifies legal defects, and provides actionable recommendations based on Victorian legislation.

### ✨ Key Features

- **📚 Comprehensive Victorian Statutes Database**
  - Road Safety Act 1986 (s.49, s.55D, s.55E)
  - Evidence Act 2008 (s.59, s.69, s.137, s.138)
  - Criminal Procedure Act 2009 (s.185, s.187)
  - Charter of Human Rights, Victoria Police Act, Magistrates' Court Act

- **🔍 8 Specialized Analysis Presets**
  1. Statutory Procedural Analysis
  2. Contextual Analysis
  3. Jurisprudential Analysis
  4. Objective Textual Analysis
  5. Subjective Intent Analysis
  6. Purposive Analysis
  7. Comparative Cross-Reference
  8. Evidentiary Standards (Victorian)

- **⚖️ Legal Frameworks**
  - George v Rockett (1990) reasonable belief test (two-limb framework)
  - Statutory element compliance checking
  - Disclosure obligation verification
  - Hearsay rule and exceptions

- **🤖 Intelligent Features**
  - Pattern detection and learning
  - Multi-document cross-reference
  - Timeline reconstruction
  - Defect classification (7 categories)
  - IndexedDB persistent storage

- **📤 Multi-Format Support**
  - **Input:** PDF, DOCX, TXT, PNG, JPG (via OCR)
  - **Output:** PDF, DOCX, JSON, CSV

---

## 🚀 Quick Start

### Option 1: Use Modular Version (Recommended)

```bash
# 1. Clone repository
git clone https://github.com/gtgspot/4rensic.git
cd 4rensic

# 2. Start local server (required for ES6 modules)
python3 serve.py
# or
npm start

# 3. Open in browser
open http://localhost:8000/index-modular.html
```

### Option 2: Use Standalone Version

```bash
# Simply open the monolithic HTML file
open index.html
```

---

## 📦 Two Versions Available

### 🆕 **Modular Version v2.0** (index-modular.html)

**Benefits:**
- ✅ Maintainable - Each module has single responsibility
- ✅ Reusable - Import only what you need
- ✅ Testable - Unit test individual modules
- ✅ Scalable - Easy to extend without touching existing code
- ✅ Performance - Browser caches modules separately
- ✅ Independence - Update statutes without changing code

**File Structure:**
```
/src
├── /data               - Victorian Statutes Database (JSON)
├── /analyzers          - Core Analysis Engines
│   ├── VictorianStatuteAnalyzer.js
│   ├── PresetAnalyzers.js
│   ├── CrossReferenceEngine.js
│   └── InterpretationEngine.js
├── /storage            - Persistent Storage & Learning
│   ├── AnalysisDatabase.js
│   ├── PatternDetector.js
│   └── TimelineManager.js
├── /utils              - Reusable Utilities
│   ├── textExtractor.js
│   ├── statuteParser.js
│   ├── defectClassifier.js
│   └── exportManager.js
└── main.jsx            - Application Orchestrator
```

**Usage:**
```javascript
import ForensicAnalyzer from './src/main.jsx';

// Process file
const result = await ForensicAnalyzer.processFile(file);

// Analyze
const analysis = await ForensicAnalyzer.analyzeDocument(text, {
  presets: [1, 2, 8]
});

// Export
await ForensicAnalyzer.exportAnalysis('pdf', 'report.pdf');
```

### 📄 **Standalone Version v1.0** (index.html)

**Benefits:**
- ✅ Zero setup - Just open in browser
- ✅ Self-contained - All code in one file
- ✅ Portable - Easy to distribute

**Use Case:** Quick analysis without setup

---

## 📚 Documentation

### Core Documentation
- **[MODULAR_ARCHITECTURE_README.md](MODULAR_ARCHITECTURE_README.md)** - Complete architecture guide
- **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** - Integration patterns and examples
- **[package.json](package.json)** - Module configuration

### Quick Links
- [Module Import Patterns](#) - How to import and use modules
- [API Reference](#) - Full API documentation
- [Statute Database Schema](#) - Database structure
- [Custom Preset Creation](#) - Adding new analyzers
- [Troubleshooting](#) - Common issues and solutions

---

## 🎓 Usage Examples

### Basic Analysis

```javascript
import app from './src/main.jsx';

// Upload and analyze a file
const file = document.querySelector('input[type="file"]').files[0];

await app.processFile(file);
const analysis = await app.analyzeDocument(file.text);

console.log('Total findings:', analysis.summary.totalFindings);
console.log('Critical issues:', analysis.summary.criticalIssues);
```

### Statute Compliance Check

```javascript
import { VictorianStatuteAnalyzer } from './src/analyzers/VictorianStatuteAnalyzer.js';

const analyzer = new VictorianStatuteAnalyzer();
await analyzer.init();

// Check Road Safety Act s.49 compliance
const s49 = analyzer.checkCompliance(
  documentText,
  'Road_Safety_Act_1986',
  '49'
);

if (!s49.compliant) {
  console.log('Missing elements:', s49.missing);
  s49.missing.forEach(element => {
    console.log(`- ${element.element}: ${element.consequence}`);
  });
}
```

### Reasonable Belief Test (George v Rockett)

```javascript
import { VictorianStatuteAnalyzer } from './src/analyzers/VictorianStatuteAnalyzer.js';

const analyzer = new VictorianStatuteAnalyzer();
await analyzer.init();

const beliefTest = analyzer.analyzeReasonableBeliefTest(documentText);

console.log('Subjective element found:', beliefTest.subjective.found);
console.log('Objective element found:', beliefTest.objective.found);
console.log('Test compliant:', beliefTest.compliant);

if (!beliefTest.compliant) {
  beliefTest.issues.forEach(issue => {
    console.log(`${issue.severity}: ${issue.description}`);
  });
}
```

### Multi-Document Comparison

```javascript
import { CrossReferenceEngine } from './src/analyzers/CrossReferenceEngine.js';

const engine = new CrossReferenceEngine();

engine.addDocument({ name: 'Police Statement', text: policeText });
engine.addDocument({ name: 'Defence Statement', text: defenceText });

const crossRef = engine.analyze();

if (crossRef.dateDiscrepancies.length > 0) {
  console.log('⚠️ Date discrepancies detected:');
  crossRef.dateDiscrepancies.forEach(d => console.log(`  - ${d.description}`));
}
```

### Custom Analysis

```javascript
import { runAnalysis } from './src/analyzers/PresetAnalyzers.js';

// Run specific presets
const results = await runAnalysis(documentText, [1, 8]);  // Statutory + Evidentiary

results.forEach(preset => {
  console.log(`\n${preset.presetName}:`);
  console.log(`  Findings: ${preset.findings.length}`);

  preset.findings.forEach(f => {
    if (f.severity === 'CRITICAL' || f.severity === 'HIGH') {
      console.log(`  [${f.severity}] ${f.type}: ${f.description}`);
    }
  });
});
```

---

## 🔧 Configuration

### Customize Statute Database

Edit `/src/data/victorianStatutes.json`:

```json
{
  "Your_Custom_Act_2025": {
    "fullName": "Your Custom Act 2025 (Vic)",
    "sections": {
      "1": {
        "title": "Your Section",
        "subsections": {
          "1": {
            "elements": [
              {
                "name": "element_name",
                "keywords": ["keyword1", "keyword2"],
                "required": true,
                "absence_consequence": "What happens if missing"
              }
            ]
          }
        }
      }
    }
  }
}
```

### Add Custom Preset

See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md#add-new-preset-analyzer) for detailed instructions.

---

## 🏗️ Architecture

### Three-Phase Analysis System

#### Phase A: Preset Analysis
- 8 specialized analyzers
- Pattern detection
- Timeline extraction

#### Phase B: Cross-Reference (Multi-Document)
- Date/time/location comparison
- Event sequence analysis
- Discrepancy detection

#### Phase C: Legal Interpretation
- Statutory interpretation principles
- Legal issue identification
- Compliance assessment
- Recommendation generation

### Storage Layer

- **IndexedDB** - Persistent analysis storage
- **Pattern Detector** - Machine learning-like pattern recognition
- **Timeline Manager** - Chronological event tracking

---

## 📊 Statute Database

### Current Coverage

| Act | Sections | Elements | Test Frameworks |
|-----|----------|----------|-----------------|
| Road Safety Act 1986 | s.49, s.55D, s.55E | 15+ | George v Rockett |
| Evidence Act 2008 | s.59, s.69, s.137, s.138 | 12+ | Hearsay exceptions |
| Criminal Procedure Act 2009 | s.185, s.187 | 8+ | Disclosure obligations |
| Charter of HR 2006 | s.24, s.25 | 6+ | Fair hearing rights |
| Magistrates' Court Act 1989 | Jurisdiction | 3+ | - |
| Victoria Police Act 2013 | Powers | 2+ | - |

### Database Features

- ✅ Full section text
- ✅ Element breakdown
- ✅ Required keywords
- ✅ Absence consequences
- ✅ Test frameworks
- ✅ Subsection hierarchy
- ✅ Cross-references

---

## 🧪 Testing

### Run Local Server

```bash
python3 serve.py
```

### Test Module Loading

```javascript
// Open browser console on http://localhost:8000/index-modular.html
console.log(ForensicAnalyzer.getStatus());
// Should show: { initialized: true, ... }
```

### Verify Statute Database

```javascript
const response = await fetch('/src/data/victorianStatutes.json');
const statutes = await response.json();
console.log('Loaded acts:', Object.keys(statutes).filter(k => k !== 'metadata'));
```

---

## 🤝 Contributing

### Adding New Statutes

1. Edit `/src/data/victorianStatutes.json`
2. Follow existing structure
3. Include all required fields
4. Test with VictorianStatuteAnalyzer
5. Update documentation

### Adding New Presets

1. Edit `/src/analyzers/PresetAnalyzers.js`
2. Create new preset object
3. Implement `analyze(documentText)` method
4. Add to `getAllPresets()`
5. Document in README

### Reporting Issues

Please report issues with:
- Statute database inaccuracies
- Analysis defects
- Integration problems
- Documentation gaps

---

## 📄 License

**Proprietary License**

Copyright © 2025 Forensic Legal Analysis Team

This software is licensed for use in Victorian legal practice. Unauthorized reproduction or distribution is prohibited.

---

## 🎯 Roadmap

### v2.1.0 (Planned)
- [ ] React UI components
- [ ] Additional Victorian statutes
- [ ] Advanced ML pattern detection
- [ ] API endpoints for remote analysis

### v2.2.0 (Planned)
- [ ] Real-time collaborative analysis
- [ ] Mobile app (using same modules)
- [ ] Cloud storage integration
- [ ] Automated reporting templates

### v3.0.0 (Future)
- [ ] AI-powered legal reasoning
- [ ] Predictive compliance checking
- [ ] Multi-jurisdiction support
- [ ] Integration with case law databases

---

## 📞 Support

For technical support or questions:

- 📧 Email: [support@forensicanalyzer.com](mailto:support@forensicanalyzer.com)
- 📚 Documentation: [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
- 🐛 Issues: [GitHub Issues](https://github.com/gtgspot/4rensic/issues)

---

## 🙏 Acknowledgments

- Victorian Government - Legislative database sources
- George v Rockett (1990) 170 CLR 104 - Reasonable belief framework
- Open source libraries: React, PDF.js, Tesseract.js, jsPDF, Mammoth

---

## 📈 Statistics

- **Lines of Code:** 5,142+ (modular), 11,834 (standalone)
- **Modules:** 13
- **Statutes:** 6+ Acts
- **Presets:** 8 specialized analyzers
- **Test Frameworks:** 3 (reasonable belief, disclosure, hearsay)
- **Defect Categories:** 7
- **Export Formats:** 4 (PDF, DOCX, JSON, CSV)

---

**Built with ❤️ for Victorian Legal Practice**

**Version:** 2.0.0 | **Updated:** 2025-11-11 | **Jurisdiction:** Victoria, Australia
