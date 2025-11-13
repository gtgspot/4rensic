# YScript Rules-as-Code Preprocessing Engine

## Overview

The **YScript Rules-as-Code Engine** is a sophisticated backend preprocessing system that converts Victorian statutes into machine-executable rules and evaluates uploaded documents against these rules programmatically.

## 🎯 Core Features

- ✅ **Rules-as-Code**: Converts legal statutes into executable rule objects
- ✅ **Logical Operators**: Supports AND, OR, NOT, IF-THEN with nested conditions
- ✅ **Evidence Extraction**: Automatically finds and extracts supporting evidence from documents
- ✅ **Confidence Scoring**: Assigns confidence levels to extracted evidence
- ✅ **Structured Results**: Returns detailed compliance results with consequences and remedies
- ✅ **Multi-Rule Evaluation**: Evaluate documents against multiple rules simultaneously
- ✅ **Forensic Reporting**: Generate comprehensive compliance reports

## 📁 Architecture

### Core Components

```
src/engines/
├── YScriptEngine.js                      # Core rule evaluation engine
├── StatutoryRules.js                     # Rule definitions for Victorian statutes
├── YScriptIntegration.js                 # High-level integration and presets
├── TableOfProvisionsNavigator.js         # ToC navigation and structure
├── index.js                              # Centralized exports
├── README.md                             # This file
├── example-usage.html                    # Interactive YScript demonstration
└── table-of-provisions-browser.html      # Interactive ToC browser
src/data/
└── roadSafetyActTableOfProvisions.json   # Complete Act structure
```

### YScriptEngine.js

The core engine that:
- Parses and validates rule definitions
- Evaluates conditions recursively
- Extracts evidence with context
- Generates compliance reports

### StatutoryRules.js

Pre-defined machine-executable rules for:
- **Road Safety Act 1986**: s.49(1), s.55(1), s.55D, s.56
- **Crimes Act 1958**: s.458 (arrest without warrant)
- **Evidence Act 2008**: s.138 (impropriety/illegality)

### YScriptIntegration.js

High-level integration layer with:
- Preset analyzers for common scenarios
- Document comparison capabilities
- Defect detection
- Forensic report generation
- Table of Provisions integration

### TableOfProvisionsNavigator.js

Structural navigation system providing:
- Complete hierarchical Act structure (Parts, Divisions, Sections)
- Cross-reference mapping between related provisions
- Implementation status tracking
- Priority sections for future rule development
- Search and filter capabilities
- Interactive browser interface

### Table of Provisions (roadSafetyActTableOfProvisions.json)

Complete machine-readable structure of the Road Safety Act 1986 (Vic) Version #127:
- **9 Parts** covering different aspects of road safety
- **Multiple Divisions** with specialized focus areas
- **100+ Sections** with full metadata
- **Cross-references** showing relationships between provisions
- **Implementation tracking** linking sections to YScript rules
- **Priority mapping** for progressive rule implementation

## 📊 Table of Provisions Features

### Structural Framework

The Table of Provisions provides:

1. **Hierarchical Organization**: Parts → Divisions → Sections → Subsections
2. **Metadata**: Full titles, descriptions, and classifications
3. **Relationships**: Cross-references and dependencies between sections
4. **Implementation Status**: Track which sections have rules implemented
5. **Priority System**: HIGH/MEDIUM/LOW priorities for future implementation

### Key Provision Types

- **Key Provisions**: Important sections requiring careful analysis
- **Offence Provisions**: Criminal offences under the Act
- **Procedural Provisions**: Testing and enforcement procedures
- **Evidentiary Provisions**: Rules of evidence and certificates

### Interactive Browser

Open `table-of-provisions-browser.html` to:
- Browse the complete Act structure
- Search sections by keyword
- Filter by Part, Division, or Topic
- View implementation status
- Navigate cross-references
- Identify priority sections

### ToC Integration Example

```javascript
import { createAnalyzerWithToC } from './engines/YScriptIntegration.js';

// Create analyzer with ToC integration
const { analyzer, navigator, analyzeWithContext } = await createAnalyzerWithToC();

// Analyze with structural context
const result = analyzeWithContext(documentText, '49');

console.log('Section:', result.section.title);
console.log('Path:', result.navigationPath);
console.log('Related:', result.relatedSections);
console.log('Compliance:', result.compliant);
```

### Gap Analysis

Identify sections without rules:

```javascript
import { getImplementationGaps, createNavigator } from './engines/index.js';
import { AllStatutoryRules } from './engines/StatutoryRules.js';

const navigator = createNavigator();
await navigator.init();

const gaps = getImplementationGaps(navigator, AllStatutoryRules);

console.log(`${gaps.implemented} of ${gaps.totalKeyProvisions} key provisions implemented`);
console.log('Gaps:', gaps.gapSections);
```

## 🚀 Quick Start

### Basic Usage

```javascript
import { createAnalyzer } from './engines/YScriptIntegration.js';

// Create analyzer
const analyzer = createAnalyzer();

// Analyze document
const document = "I had reason to believe the driver had consumed alcohol...";
const results = analyzer.analyzeRoadSafetyCompliance(document);

console.log(results.report);
```

### Using Preset Analyzers

```javascript
import { PresetAnalyzers } from './engines/YScriptIntegration.js';

// Use drink driving preset
const results = PresetAnalyzers.DrinkDriving.analyze(documentText);
```

### Single Rule Evaluation

```javascript
const engine = new YScriptEngine();
engine.registerRules(AllStatutoryRules);

const result = engine.evaluateRule('RSA_s49_1_reason_to_believe', documentText);
console.log(result);
```

## 📋 Rule Structure Format

Rules follow a standardized structure:

```javascript
{
  ruleId: "RSA_s49_1_reason_to_believe",
  statute: "Road Safety Act 1986",
  section: "49(1)",
  type: "MANDATORY_PREREQUISITE",
  description: "Officer must have reason to believe...",

  condition: {
    operator: "AND",
    requirements: [
      {
        element: "reason_to_believe",
        keywords: ["reason to believe", "believed that"],
        required: true,
        type: "SUBJECTIVE_STATE"
      },
      {
        element: "alcohol_consumption",
        operator: "OR",
        options: ["consumed alcohol", "has alcohol in body"],
        required: true,
        type: "OBJECTIVE_BASIS"
      }
    ]
  },

  evaluation: {
    onSuccess: {
      result: "COMPLIANT",
      message: "Prerequisites satisfied"
    },
    onFailure: {
      result: "NON_COMPLIANT",
      severity: "CRITICAL",
      consequence: "No lawful authority - procedure invalid",
      remedy: "Test result inadmissible"
    }
  }
}
```

## 🔧 Logical Operators

### AND Operator

All requirements must be satisfied:

```javascript
condition: {
  operator: "AND",
  requirements: [
    { element: "requirement1", ... },
    { element: "requirement2", ... }
  ]
}
```

### OR Operator

At least one requirement must be satisfied:

```javascript
condition: {
  operator: "OR",
  requirements: [
    { element: "option1", ... },
    { element: "option2", ... }
  ]
}
```

### NOT Operator

Condition must NOT be present:

```javascript
condition: {
  operator: "NOT",
  requirements: [
    { element: "prohibited_condition", ... }
  ]
}
```

### IF-THEN Operator

If antecedent is true, consequent must be true:

```javascript
condition: {
  operator: "IF-THEN",
  antecedent: { element: "condition_a", ... },
  consequent: { element: "condition_b", ... }
}
```

## 📊 Result Structure

Evaluation results include:

```javascript
{
  ruleId: "RSA_s49_1_reason_to_believe",
  statute: "Road Safety Act 1986",
  section: "49(1)",
  type: "MANDATORY_PREREQUISITE",
  compliant: false,
  evaluationTime: "15ms",
  timestamp: "2024-01-15T12:00:00.000Z",

  evidence: [
    {
      term: "reason to believe",
      sentence: "I had reason to believe the driver had consumed alcohol",
      sentenceIndex: 2,
      context: "...",
      confidence: 0.9
    }
  ],

  missing: ["vehicle_operation"],

  outcome: {
    result: "NON_COMPLIANT",
    severity: "CRITICAL",
    consequence: "No lawful authority to require preliminary test",
    remedy: "Test result inadmissible",
    details: "Missing: vehicle_operation"
  }
}
```

## 🎓 Advanced Usage

### Finding Defects

```javascript
const defects = analyzer.findDefects(documentText);

console.log('Critical defects:', defects.critical);
console.log('Warnings:', defects.warnings);
console.log('Passed checks:', defects.passed);
```

### Generating Forensic Report

```javascript
const report = analyzer.generateForensicReport(documentText, {
  focusStatute: 'Road Safety Act',
  includeEvidence: true
});

console.log(report.formattedReport);
```

### Comparing Documents

```javascript
const comparison = analyzer.compareDocuments(
  document1,
  document2,
  ['RSA_s49_1_reason_to_believe', 'RSA_s55_1_evidentiary_test_prerequisite']
);

console.log('Better compliance:', comparison.comparison.betterCompliance);
```

### Custom Rule Registration

```javascript
const customRule = {
  ruleId: "CUSTOM_my_rule",
  statute: "Custom Act",
  section: "1",
  type: "MANDATORY_PREREQUISITE",
  condition: { /* ... */ },
  evaluation: { /* ... */ }
};

analyzer.engine.registerRule(customRule);
```

## 📈 Available Presets

### DrinkDriving
Analyzes Road Safety Act compliance for drink driving procedures:
- s.49(1) - Reason to believe
- s.49(1) - Articulation of belief
- s.55(1) - Evidentiary test prerequisites
- s.55D - Proper administration
- s.56 - Right to medical practitioner

### PreliminaryBreathTest
Focuses on preliminary breath test prerequisites:
- s.49(1) - Reason to believe
- s.49(1) - Articulation of belief

### EvidentiaryyBreathTest
Focuses on evidentiary breath test procedures:
- s.55(1) - Evidentiary test prerequisites
- s.55D - Proper administration
- s.56 - Right to medical practitioner

### ArrestLawfulness
Analyzes arrest procedures:
- Crimes Act s.458 - Arrest reasonable grounds
- Generic - Caution before questions

## 🔍 Evidence Extraction

The engine automatically extracts evidence with:

### Context Preservation
Each match includes surrounding sentences for context

### Confidence Scoring
- **1.0** - Exact match
- **0.9** - Word boundary match
- **0.7** - Partial match within sentence
- **0.5** - Loose match

### Sentence Indexing
Evidence is indexed by sentence position for easy reference back to source document

## 📝 Rule Types

### MANDATORY_PREREQUISITE
Must be satisfied for procedure to be lawful. Failure is CRITICAL.

### MANDATORY_PROCEDURAL
Required procedural step. Failure may be HIGH or CRITICAL severity.

### DISCRETIONARY_EXCLUSION
Triggers judicial discretion (e.g., Evidence Act s.138).

## 🛠️ API Reference

### YScriptEngine

```javascript
// Core engine methods
engine.registerRule(rule)
engine.registerRules(rules)
engine.evaluateRule(ruleId, documentText)
engine.evaluateMultipleRules(ruleIds, documentText)
engine.generateReport(results)
engine.getRules()
engine.getHistory()
engine.exportRules()
engine.importRules(jsonString)
```

### YScriptDocumentAnalyzer

```javascript
// High-level analyzer methods
analyzer.loadAllRules()
analyzer.loadStatuteRules(statute)
analyzer.analyzeRoadSafetyCompliance(documentText, options)
analyzer.analyzeSection(statute, section, documentText)
analyzer.quickCheck(ruleId, documentText)
analyzer.findDefects(documentText)
analyzer.generateForensicReport(documentText, options)
analyzer.getSuggestedRemedies(results)
analyzer.compareDocuments(doc1, doc2, ruleIds)
analyzer.getStatistics()
```

## 🧪 Testing

Open `example-usage.html` in a browser to:
- Test with sample compliant/non-compliant documents
- Analyze custom documents
- Demonstrate logical operators
- View evidence extraction
- Generate reports

## 📚 Statutory Coverage

### Currently Implemented

✅ Road Safety Act 1986
- Section 49(1) - Preliminary breath test authority
- Section 55(1) - Evidentiary test prerequisites
- Section 55D - Proper administration
- Section 56 - Right to medical practitioner

✅ Crimes Act 1958
- Section 458 - Arrest without warrant

✅ Evidence Act 2008
- Section 138 - Impropriety/illegality

### Extensible Design
Add new rules by following the rule structure format. See StatutoryRules.js for examples.

## 🔐 Use Cases

1. **Document Review**: Analyze police briefs for procedural compliance
2. **Defect Identification**: Automatically find critical legal defects
3. **Training**: Train officers on proper procedure documentation
4. **Quality Assurance**: Systematic compliance checking
5. **Expert Analysis**: Support expert witness evidence preparation
6. **Bulk Analysis**: Process multiple documents for patterns

## 💡 Best Practices

### Rule Design
- Use specific, unambiguous keywords
- Include common variations and synonyms
- Set appropriate severity levels
- Provide clear consequences and remedies

### Document Analysis
- Use appropriate preset for scenario
- Review evidence extraction for accuracy
- Consider context of extracted evidence
- Generate full forensic reports for complex cases

### Integration
- Load only needed rules for performance
- Cache analyzer instances when processing multiple documents
- Use debug mode during development
- Export rules for backup/sharing

## 🚧 Future Enhancements

Potential additions:
- Machine learning for improved evidence extraction
- Natural language processing for better context understanding
- Time-based rule versioning (statute amendments)
- Interactive rule builder UI
- Case law integration
- Precedent analysis

## 📄 License

Proprietary - Victoria, Australia jurisdiction

## 👥 Support

For issues or questions about the YScript engine, consult:
- This README
- Example usage file (example-usage.html)
- Source code comments
- Rule definitions in StatutoryRules.js

---

**Version**: 1.0.0
**Last Updated**: January 2025
**Jurisdiction**: Victoria, Australia
