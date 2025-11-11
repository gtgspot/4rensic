/**
 * Forensic Legal Analyzer - Configuration File
 *
 * This independent configuration file centralizes all application settings,
 * CDN dependencies, legal frameworks, and theme customization for the
 * Forensic Legal Analyzer application.
 *
 * Version: 1.0.0
 * Jurisdiction: Victoria, Australia
 * Last Updated: 2025-11-11
 */

const ForensicAnalyzerConfig = {

  // ============================================================================
  // APPLICATION METADATA
  // ============================================================================

  app: {
    name: 'Forensic Legal Analyzer',
    version: '1.0.0',
    description: 'Victorian Law Compliance Checker and Document Analysis System',
    jurisdiction: 'Victoria, Australia',
    author: 'Forensic Legal Analysis Team',
    lastUpdated: '2025-11-11'
  },

  // ============================================================================
  // CDN DEPENDENCIES
  // ============================================================================

  cdn: {
    react: {
      url: 'https://unpkg.com/react@18/umd/react.production.min.js',
      version: '18',
      crossorigin: true,
      description: 'React library for UI components'
    },
    reactDom: {
      url: 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
      version: '18',
      crossorigin: true,
      description: 'React DOM library for rendering'
    },
    babel: {
      url: 'https://unpkg.com/@babel/standalone/babel.min.js',
      version: 'latest',
      description: 'Babel standalone for JSX transformation'
    },
    tesseract: {
      url: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js',
      version: '5',
      description: 'Tesseract.js for OCR text extraction'
    },
    pdfjs: {
      url: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
      workerUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
      version: '3.11.174',
      description: 'PDF.js for PDF text extraction'
    }
  },

  // ============================================================================
  // THEME CONFIGURATION - CSS Custom Properties
  // ============================================================================

  theme: {
    colors: {
      primary: {
        base: '#2563eb',
        dark: '#1d4ed8',
        light: '#eff6ff'
      },
      secondary: {
        base: '#f59e0b',
        light: '#fef3c7'
      },
      success: {
        base: '#16a34a',
        light: '#dcfce7'
      },
      warning: {
        base: '#f59e0b',
        light: '#fef3c7'
      },
      error: {
        base: '#dc2626',
        light: '#fee2e2'
      },
      info: {
        base: '#0284c7',
        light: '#e0f2fe'
      },
      // Neutral color palette
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827'
      },
      // Severity-specific colors
      severity: {
        critical: {
          background: '#fecaca',
          text: '#991b1b'
        },
        high: {
          background: '#fcd34d',
          text: '#92400e'
        },
        medium: {
          background: '#a5f3fc',
          text: '#0e7490'
        },
        low: {
          background: '#bbf7d0',
          text: '#166534'
        }
      }
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      '2xl': '48px'
    },
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      full: '9999px'
    },
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px rgba(0, 0, 0, 0.15)'
    },
    typography: {
      fontSize: {
        xs: '11px',
        sm: '12px',
        base: '14px',
        lg: '16px',
        xl: '18px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px'
      },
      fontFamily: {
        base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        mono: 'Menlo, Monaco, "Courier New", monospace'
      }
    },
    transitions: {
      fast: '150ms ease-in-out',
      base: '250ms ease-in-out',
      slow: '350ms ease-in-out'
    },
    zIndex: {
      dropdown: 1000,
      modal: 2000,
      tooltip: 3000
    }
  },

  // ============================================================================
  // SEVERITY LEVELS CONFIGURATION
  // ============================================================================

  severity: {
    levels: ['critical', 'high', 'medium', 'low'],
    definitions: {
      critical: {
        label: 'Critical',
        priority: 1,
        requiresImmediateAction: true,
        description: 'Acknowledged errors, jurisdictional defects, missing authorizing sections, procedural fairness violations'
      },
      high: {
        label: 'High',
        priority: 2,
        requiresImmediateAction: true,
        description: 'Missing primary legislation references, incomplete court references, mandatory document headers missing'
      },
      medium: {
        label: 'Medium',
        priority: 3,
        requiresImmediateAction: false,
        description: 'Vague temporal references, missing specific statutory provisions, American spelling, inconsistent citations'
      },
      low: {
        label: 'Low',
        priority: 4,
        requiresImmediateAction: false,
        description: 'Grammatical inconsistencies, passive voice in procedural documents, Oxford comma usage issues'
      }
    },
    colorMapping: {
      critical: '#fecaca',
      high: '#fed7aa',
      medium: '#fef3c7',
      low: '#dbeafe'
    }
  },

  // ============================================================================
  // DOCUMENT CLASSIFICATION PATTERNS
  // ============================================================================

  documentTypes: {
    'Statutory Legislation': {
      pattern: /\bact\s+\d{4}\b|primary legislation|statute/i,
      description: 'Primary legislation and statutory acts',
      defaultFramework: 'Victorian Primary Legislation'
    },
    'Delegated Legislation': {
      pattern: /\bregulation|rules|order|instrument\b/i,
      description: 'Subordinate legislation and regulations',
      defaultFramework: 'Victorian Subordinate Instrumentation'
    },
    'Victoria Police Manual': {
      pattern: /\bvictoria police|vpm|police manual|operational procedure/i,
      description: 'Victoria Police operational procedures and manual',
      defaultFramework: 'Victoria Police Act 2013'
    },
    'Disclosure Document': {
      pattern: /\bdisclosure|discovery|prosecution brief/i,
      description: 'Prosecution disclosure and discovery documents',
      defaultFramework: 'Criminal Procedure Act 2009'
    },
    'Evidence Exhibit': {
      pattern: /\bexhibit|evidentiary material|physical evidence/i,
      description: 'Physical evidence and exhibits',
      defaultFramework: 'Evidence Act 2008'
    },
    'Statement': {
      pattern: /\bstatement of|witness statement|affidavit|statutory declaration/i,
      description: 'Witness statements, affidavits, and declarations',
      defaultFramework: 'Evidence Act 2008'
    },
    'Court Order': {
      pattern: /\border of the court|court order|judicial order/i,
      description: 'Court orders and judicial decisions',
      defaultFramework: 'Victorian Court Acts'
    },
    'Evidentiary Certificate': {
      pattern: /\bevidentiary certificate|certificate of|s\.\s*\d+\s+certificate/i,
      description: 'Evidentiary certificates under various acts',
      defaultFramework: 'Evidence Act 2008'
    },
    'Summons': {
      pattern: /\bsummons|witness summons|subpoena/i,
      description: 'Court summons and subpoenas',
      defaultFramework: 'Criminal Procedure Act 2009'
    },
    'Charge Sheet': {
      pattern: /\bcharge sheet|charges|indictment|complaint/i,
      description: 'Criminal charges and indictments',
      defaultFramework: 'Criminal Procedure Act 2009'
    },
    'Submission': {
      pattern: /\bsubmission|written submission|legal submission/i,
      description: 'Legal submissions and written arguments',
      defaultFramework: 'Victorian Court Rules'
    },
    'Deposition': {
      pattern: /\bdeposition|committal|preliminary hearing/i,
      description: 'Depositions and committal proceedings',
      defaultFramework: 'Criminal Procedure Act 2009'
    },
    'Case Law': {
      pattern: /\b[A-Z][a-z]+\s+v\s+[A-Z][a-z]+|\[\d{4}\]|CLR|VR|VSC/,
      description: 'Case law and judicial decisions',
      defaultFramework: 'Victorian Case Law'
    },
    'Legal Narrative': {
      pattern: /\bnarrativ|chronolog|fact pattern|sequence of events/i,
      description: 'Legal narratives and chronologies',
      defaultFramework: 'General Victorian Legal Framework'
    },
    'Court Documentation': {
      pattern: /\bfiling|pleading|court document|notice of/i,
      description: 'General court documentation and filings',
      defaultFramework: 'Victorian Court Rules'
    },
    'General Legal Document': {
      pattern: /.*/,
      description: 'Unclassified legal documents',
      defaultFramework: 'General Victorian Legal Framework'
    }
  },

  // ============================================================================
  // VICTORIAN PRIMARY LEGISLATION
  // ============================================================================

  victorianLegislation: {
    primaryActs: [
      {
        name: 'Criminal Procedure Act 2009',
        shortName: 'CPA 2009',
        jurisdiction: 'Victoria',
        category: 'Criminal Justice',
        pattern: /Criminal\s+Procedure\s+Act\s+2009/gi,
        description: 'Disclosure requirements, court procedures, criminal process',
        keyParts: ['Part 3.3 - Disclosure', 'Part 5.4 - Trial Procedure']
      },
      {
        name: 'Evidence Act 2008 (Vic)',
        shortName: 'EA 2008',
        jurisdiction: 'Victoria',
        category: 'Evidence',
        pattern: /Evidence\s+Act\s+2008/gi,
        description: 'Evidentiary requirements, certificate provisions, admissibility',
        keyParts: ['Chapter 3 - Admissibility', 'Part 4.6 - Certificates']
      },
      {
        name: 'Crimes Act 1958',
        shortName: 'Crimes Act 1958',
        jurisdiction: 'Victoria',
        category: 'Criminal Law',
        pattern: /Crimes\s+Act\s+1958/gi,
        description: 'Substantive criminal law and offences',
        keyParts: ['Part I - General Principles']
      },
      {
        name: 'Charter of Human Rights and Responsibilities Act 2006',
        shortName: 'Charter 2006',
        jurisdiction: 'Victoria',
        category: 'Human Rights',
        pattern: /Charter\s+of\s+Human\s+Rights\s+and\s+Responsibilities\s+Act\s+2006/gi,
        description: 'Human rights protections and obligations',
        keyParts: ['Part 2 - Human Rights', 'Part 3 - Application']
      },
      {
        name: 'Victoria Police Act 2013',
        shortName: 'VPA 2013',
        jurisdiction: 'Victoria',
        category: 'Police',
        pattern: /Victoria\s+Police\s+Act\s+2013/gi,
        description: 'Police powers, duties, and accountability',
        keyParts: ['Part 4 - Police Powers']
      },
      {
        name: 'Sentencing Act 1991',
        shortName: 'SA 1991',
        jurisdiction: 'Victoria',
        category: 'Sentencing',
        pattern: /Sentencing\s+Act\s+1991/gi,
        description: 'Sentencing procedures and principles',
        keyParts: ['Part 1 - General Principles']
      },
      {
        name: 'Children, Youth and Families Act 2005',
        shortName: 'CYFA 2005',
        jurisdiction: 'Victoria',
        category: 'Children',
        pattern: /Children,\s+Youth\s+and\s+Families\s+Act\s+2005/gi,
        description: 'Children and youth justice procedures',
        keyParts: ['Part 5.3 - Criminal Proceedings']
      },
      {
        name: 'Supreme Court Act 1986',
        shortName: 'SCA 1986',
        jurisdiction: 'Victoria',
        category: 'Courts',
        pattern: /Supreme\s+Court\s+Act\s+1986/gi,
        description: 'Supreme Court jurisdiction and procedures',
        keyParts: ['Part 4 - Jurisdiction']
      },
      {
        name: 'Magistrates\' Court Act 1989',
        shortName: 'MCA 1989',
        jurisdiction: 'Victoria',
        category: 'Courts',
        pattern: /Magistrates[\'']?\s+Court\s+Act\s+1989/gi,
        description: 'Magistrates\' Court jurisdiction and procedures',
        keyParts: ['Part 4A - Criminal Procedure']
      },
      {
        name: 'County Court Act 1958',
        shortName: 'CCA 1958',
        jurisdiction: 'Victoria',
        category: 'Courts',
        pattern: /County\s+Court\s+Act\s+1958/gi,
        description: 'County Court jurisdiction and procedures',
        keyParts: ['Part 3 - Jurisdiction']
      },
      {
        name: 'Bail Act 1977',
        shortName: 'BA 1977',
        jurisdiction: 'Victoria',
        category: 'Criminal Justice',
        pattern: /Bail\s+Act\s+1977/gi,
        description: 'Bail considerations and procedures',
        keyParts: ['Part 3 - Grant of Bail']
      },
      {
        name: 'Confiscation Act 1997',
        shortName: 'Confiscation Act 1997',
        jurisdiction: 'Victoria',
        category: 'Criminal Justice',
        pattern: /Confiscation\s+Act\s+1997/gi,
        description: 'Proceeds of crime confiscation',
        keyParts: ['Part 2 - Restraining Orders']
      },
      {
        name: 'Road Safety Act 1986',
        shortName: 'RSA 1986',
        jurisdiction: 'Victoria',
        category: 'Road Safety',
        pattern: /Road\s+Safety\s+Act\s+1986/gi,
        description: 'Road safety offences and procedures',
        keyParts: ['Part 5 - Breath Testing', 'Division 3 - Evidentiary Certificates']
      }
    ],

    // ============================================================================
    // SUBORDINATE LEGISLATION
    // ============================================================================

    subordinateInstrumentation: [
      {
        name: 'Criminal Procedure Regulations',
        parent: 'Criminal Procedure Act 2009',
        pattern: /Criminal\s+Procedure\s+Regulations/gi
      },
      {
        name: 'Evidence (Miscellaneous Provisions) Regulations',
        parent: 'Evidence Act 2008',
        pattern: /Evidence\s+\(Miscellaneous\s+Provisions\s*\)\s+Regulations/gi
      },
      {
        name: 'Victoria Police Regulations',
        parent: 'Victoria Police Act 2013',
        pattern: /Victoria\s+Police\s+Regulations/gi
      },
      {
        name: 'Supreme Court (General Civil Procedure) Rules',
        parent: 'Supreme Court Act 1986',
        pattern: /Supreme\s+Court\s+\(General\s+Civil\s+Procedure\s*\)\s+Rules/gi
      },
      {
        name: 'Magistrates\' Court General Civil Procedure Rules',
        parent: 'Magistrates\' Court Act 1989',
        pattern: /Magistrates[\'']?\s+Court\s+General\s+Civil\s+Procedure\s+Rules/gi
      }
    ]
  },

  // ============================================================================
  // VICTORIAN COURTS
  // ============================================================================

  victorianCourts: {
    courts: [
      {
        name: 'Supreme Court of Victoria',
        shortName: 'SC Vic',
        jurisdiction: 'Victoria',
        level: 'Superior',
        pattern: /Supreme\s+Court\s+of\s+Victoria/gi,
        governingAct: 'Supreme Court Act 1986',
        description: 'Highest court in Victoria, unlimited jurisdiction'
      },
      {
        name: 'County Court of Victoria',
        shortName: 'CC Vic',
        jurisdiction: 'Victoria',
        level: 'Intermediate',
        pattern: /County\s+Court\s+of\s+Victoria/gi,
        governingAct: 'County Court Act 1958',
        description: 'Intermediate jurisdiction, serious criminal matters'
      },
      {
        name: 'Magistrates\' Court of Victoria',
        shortName: 'MC Vic',
        jurisdiction: 'Victoria',
        level: 'Lower',
        pattern: /Magistrates[\'']?\s+Court\s+of\s+Victoria/gi,
        governingAct: 'Magistrates\' Court Act 1989',
        description: 'Lower court, summary offences and committal proceedings'
      },
      {
        name: 'Children\'s Court of Victoria',
        shortName: 'CC Vic',
        jurisdiction: 'Victoria',
        level: 'Specialist',
        pattern: /Children[\'']?s\s+Court\s+of\s+Victoria/gi,
        governingAct: 'Children, Youth and Families Act 2005',
        description: 'Specialist court for children and youth matters'
      },
      {
        name: 'Coroners Court of Victoria',
        shortName: 'Coroners Court',
        jurisdiction: 'Victoria',
        level: 'Specialist',
        pattern: /Coroners\s+Court\s+of\s+Victoria/gi,
        governingAct: 'Coroners Act 2008',
        description: 'Specialist court for coronial inquests'
      }
    ]
  },

  // ============================================================================
  // VICTORIA POLICE PROCEDURES
  // ============================================================================

  victoriaPolice: {
    manualPatterns: [
      /VPM\s+[A-Z0-9-]+/g,
      /Operational\s+Procedure\s+\d+/gi,
      /Victoria\s+Police\s+Manual\s+Section\s+\d+/gi
    ],
    commonProcedures: [
      'VPM-3.1 - Arrest and Custody',
      'VPM-3.2 - Search and Seizure',
      'VPM-4.1 - Breath Testing Procedures',
      'VPM-5.1 - Evidence Collection',
      'VPM-6.1 - Disclosure Requirements'
    ]
  },

  // ============================================================================
  // EVIDENCE ACT SECTIONS
  // ============================================================================

  evidenceRules: {
    patterns: [
      /s\.\s*\d+\s+Evidence\s+Act/gi,
      /section\s+\d+\s+of\s+the\s+Evidence\s+Act/gi,
      /Division\s+\d+\s+of\s+Part\s+\d+\s+of\s+the\s+Evidence\s+Act/gi
    ],
    hearsayExceptions: {
      sections: [60, 61, 62, 63, 64, 65, 66, 67, 68, 69],
      pattern: /s(?:ection)?\s*(?:60|61|62|63|64|65|66|67|68|69)|exception\s+to\s+hearsay/i,
      description: 'Hearsay exceptions under Evidence Act 2008'
    },
    certificates: {
      sections: [
        { section: 's.55E', act: 'Road Safety Act 1986', description: 'Breath testing device certificates' },
        { section: 's.177', act: 'Evidence Act 2008', description: 'Certificate evidence provisions' }
      ]
    }
  },

  // ============================================================================
  // STATUTORY INTERPRETATION PRINCIPLES
  // ============================================================================

  interpretationPrinciples: {
    literalism: {
      name: 'Literal Interpretation',
      description: 'Plain, ordinary meaning of words',
      latinMaxim: 'Verba ita sunt intelligenda ut res magis valeat quam pereat'
    },
    purposive: {
      name: 'Purposive Approach',
      description: 'Legislative purpose and intent',
      latinMaxim: 'Ut res magis valeat quam pereat'
    },
    contextual: {
      name: 'Contextual Analysis',
      description: 'Words within their statutory context',
      latinMaxim: 'Noscitur a sociis'
    },
    harmonious: {
      name: 'Harmonious Construction',
      description: 'Reading provisions together consistently',
      latinMaxim: 'Ut res magis valeat quam pereat'
    },
    latinMaxims: [
      {
        maxim: 'Noscitur a sociis',
        translation: 'A word is known by its associates',
        application: 'Words take meaning from surrounding words'
      },
      {
        maxim: 'Expressio unius est exclusio alterius',
        translation: 'Express mention of one excludes others',
        application: 'Specific list excludes unlisted items'
      },
      {
        maxim: 'Generalia specialibus non derogant',
        translation: 'Specific prevails over general',
        application: 'Specific provisions override general ones'
      },
      {
        maxim: 'Lex posterior derogat priori',
        translation: 'Later law prevails over earlier',
        application: 'More recent legislation takes precedence'
      }
    ]
  },

  // ============================================================================
  // ANALYSIS PRESETS
  // ============================================================================

  analysisPresets: {
    phaseA: [
      'Statutory Procedural Analysis',
      'Contextual Analysis',
      'Jurisprudential Analysis',
      'Objective Textual Analysis',
      'Subjective Intent Analysis',
      'Purposive Analysis',
      'Comparative Cross-Reference Analysis',
      'Evidentiary Standards Analysis'
    ],
    phaseB: {
      name: 'Victorian Statutory Compliance & Cross-Reference',
      checks: [
        'Criminal Procedure Act 2009 compliance',
        'Evidence Act 2008 requirements',
        'Victoria Police Act 2013 procedures',
        'Charter of Human Rights compliance',
        'Victorian Court Acts and Rules',
        'Disclosure timeline compliance',
        'Cross-document narrative consistency',
        'Timeline discrepancy detection'
      ]
    },
    phaseC: {
      name: 'Statutory Interpretation',
      methods: [
        'Literal interpretation',
        'Contextual interpretation',
        'Purposive interpretation',
        'Harmonious construction',
        'Extrinsic aids analysis',
        'Ambiguity resolution'
      ]
    },
    phaseD: {
      name: 'Victorian Magistrates\' Court Criminal Procedure Analysis',
      focus: 'Magistrates\' Court Act 1989 and Criminal Procedure Act 2009 compliance'
    }
  },

  // ============================================================================
  // APPLICATION SETTINGS
  // ============================================================================

  settings: {
    server: {
      defaultPort: 8765,
      localhost: 'http://localhost:8765'
    },
    upload: {
      maxFileSize: 50 * 1024 * 1024, // 50MB in bytes
      supportedFormats: ['.txt', '.doc', '.docx', '.pdf', '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff'],
      supportedMimeTypes: [
        'text/plain',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/png',
        'image/jpeg',
        'image/gif',
        'image/bmp',
        'image/tiff'
      ]
    },
    ocr: {
      enabled: true,
      language: 'eng',
      tesseractOptions: {
        logger: (m) => console.log(m)
      }
    },
    pdf: {
      enabled: true,
      workerEnabled: true
    },
    analysis: {
      enableWordByWord: true,
      enableLineByLine: true,
      enableCrossFileAnalysis: true,
      enableTimelineAnalysis: true,
      enableNarrativeEvaluation: true
    },
    export: {
      format: 'json',
      includeTimestamp: true,
      includeMetadata: true
    },
    ui: {
      showProgressBar: true,
      animationsEnabled: true,
      autoExpandSections: false,
      defaultExpandedSections: []
    }
  },

  // ============================================================================
  // DEFECT CATEGORIES
  // ============================================================================

  defectCategories: {
    linguistic: {
      name: 'Linguistic Defects',
      types: [
        'Spelling errors',
        'Grammar errors',
        'American vs Australian spelling',
        'Legal terminology errors',
        'Punctuation issues',
        'Sentence structure problems'
      ]
    },
    procedural: {
      name: 'Procedural Defects',
      types: [
        'Missing mandatory elements',
        'Timeline discrepancies',
        'Sequence errors',
        'Disclosure non-compliance',
        'Court procedure violations'
      ]
    },
    statutory: {
      name: 'Statutory Defects',
      types: [
        'Missing statutory references',
        'Incorrect section citations',
        'Jurisdictional errors',
        'Non-compliant certificates',
        'Missing authorizations'
      ]
    },
    narrative: {
      name: 'Narrative Defects',
      types: [
        'Factual contradictions',
        'Timeline inconsistencies',
        'Event sequence mismatches',
        'Missing contextual elements',
        'Logical inconsistencies'
      ]
    },
    evidential: {
      name: 'Evidential Defects',
      types: [
        'Hearsay issues',
        'Admissibility concerns',
        'Chain of custody gaps',
        'Certificate defects',
        'Authentication problems'
      ]
    }
  },

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  utils: {
    /**
     * Get CDN script tags as HTML string
     * @returns {string} HTML script tags for all CDN dependencies
     */
    getCDNScriptTags() {
      const { cdn } = ForensicAnalyzerConfig;
      let html = '';

      html += `<script ${cdn.react.crossorigin ? 'crossorigin' : ''} src="${cdn.react.url}"></script>\n`;
      html += `<script ${cdn.reactDom.crossorigin ? 'crossorigin' : ''} src="${cdn.reactDom.url}"></script>\n`;
      html += `<script src="${cdn.babel.url}"></script>\n`;
      html += `<script src="${cdn.tesseract.url}"></script>\n`;
      html += `<script src="${cdn.pdfjs.url}"></script>\n`;

      return html;
    },

    /**
     * Initialize PDF.js worker
     * @returns {void}
     */
    initPDFWorker() {
      if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = ForensicAnalyzerConfig.cdn.pdfjs.workerUrl;
      }
    },

    /**
     * Get color for severity level
     * @param {string} severity - Severity level (critical, high, medium, low)
     * @returns {string} Hex color code
     */
    getSeverityColor(severity) {
      return ForensicAnalyzerConfig.severity.colorMapping[severity] || '#e5e7eb';
    },

    /**
     * Get all Victorian legislation patterns
     * @returns {Array} Array of regex patterns for Victorian legislation
     */
    getVictorianLegislationPatterns() {
      return ForensicAnalyzerConfig.victorianLegislation.primaryActs.map(act => act.pattern);
    },

    /**
     * Get document type from content
     * @param {string} filename - Document filename
     * @param {string} content - Document content
     * @returns {string} Document type classification
     */
    classifyDocument(filename, content) {
      const types = ForensicAnalyzerConfig.documentTypes;

      for (const [type, config] of Object.entries(types)) {
        if (config.pattern.test(content) || config.pattern.test(filename)) {
          return type;
        }
      }

      return 'General Legal Document';
    }
  },

  // ============================================================================
  // VERSION INFORMATION
  // ============================================================================

  version: {
    config: '1.0.0',
    application: '1.0.0',
    lastUpdated: '2025-11-11',
    changelog: [
      {
        version: '1.0.0',
        date: '2025-11-11',
        changes: [
          'Initial configuration file created',
          'Centralized CDN dependencies',
          'Victorian legislation framework defined',
          'Document classification patterns established',
          'Theme and UI configuration separated',
          'Analysis presets documented'
        ]
      }
    ]
  }
};

// Export for use in modules (if supported)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ForensicAnalyzerConfig;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
  window.ForensicAnalyzerConfig = ForensicAnalyzerConfig;
}
