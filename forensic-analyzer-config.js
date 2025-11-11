/**
 * Forensic Legal Analyzer - Enhanced Configuration File
 *
 * This independent configuration file centralizes all application settings,
 * CDN dependencies, legal frameworks, statutory test frameworks, word-by-word
 * analysis patterns, and legislative compliance checking for the Forensic
 * Legal Analyzer application.
 *
 * Version: 2.0.0
 * Jurisdiction: Victoria, Australia
 * Last Updated: 2025-11-11
 */

const ForensicAnalyzerConfig = {

  // ============================================================================
  // APPLICATION METADATA
  // ============================================================================

  app: {
    name: 'Forensic Legal Analyzer',
    version: '2.0.0',
    description: 'Victorian Law Compliance Checker and Document Analysis System with Statutory Test Framework',
    jurisdiction: 'Victoria, Australia',
    author: 'Forensic Legal Analysis Team',
    lastUpdated: '2025-11-11',
    features: [
      'Word-by-word linguistic analysis',
      'Line-by-line compliance checking',
      'Statutory test framework validation',
      'Two-limb test assessment (George v Rockett)',
      'Reasonable belief/grounds analysis',
      'Objective vs subjective element detection',
      'Temporal discrepancy detection',
      'Legislative sequence validation'
    ]
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
    },
    mammoth: {
      url: 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js',
      version: '1.6.0',
      description: 'Mammoth.js for DOCX parsing'
    }
  },

  // ============================================================================
  // STATUTORY TEST FRAMEWORKS
  // ============================================================================

  statutoryTests: {

    /**
     * Reasonable Belief Test - Two-Limb Framework
     * Based on George v Rockett (1990) 170 CLR 104
     *
     * The statutory test for "reasonable belief" or "reasonable grounds" is an
     * objective test requiring:
     * 1. Subjective element: Officer must have genuinely formed the belief
     * 2. Objective element: Belief must be based on objectively reasonable grounds
     */
    reasonableBelief: {
      name: 'Reasonable Belief Test',
      caseAuthority: 'George v Rockett (1990) 170 CLR 104',
      jurisdiction: 'Victoria, Australia',
      description: 'Two-limb test for reasonable belief or reasonable grounds',

      // Limb 1: Subjective Element
      subjectiveElement: {
        name: 'Subjective Element - Genuine Formation of Belief',
        description: 'The officer must have genuinely formed the belief or suspicion',
        requiresEvidence: true,
        indicators: [
          'believed',
          'believe',
          'believing',
          'formed the opinion',
          'formed the view',
          'formed the belief',
          'suspected',
          'suspect',
          'suspecting',
          'thought',
          'considered',
          'my belief was',
          'my suspicion was',
          'I believed',
          'I suspected',
          'I formed the opinion'
        ],
        patterns: [
          /\b(?:I\s+)?(?:believed|formed\s+(?:the\s+)?(?:belief|opinion|view))\b/gi,
          /\b(?:I\s+)?(?:suspected|formed\s+(?:a\s+)?suspicion)\b/gi,
          /\b(?:my|the\s+officer'?s)\s+(?:belief|suspicion|opinion|view)\b/gi,
          /\bformed\s+(?:the\s+)?(?:reasonable\s+)?(?:belief|opinion|suspicion)\b/gi
        ],
        complianceCheck: {
          mustContain: ['formed', 'belief', 'suspicion', 'opinion'],
          severity: 'critical',
          defectIfMissing: 'Subjective element of reasonable belief test not established - officer must demonstrate genuine formation of belief'
        }
      },

      // Limb 2: Objective Element
      objectiveElement: {
        name: 'Objective Element - Objectively Reasonable Grounds',
        description: 'The belief must be based on grounds that were, in the circumstances known to the officer at the time, objectively reasonable',
        requiresEvidence: true,
        requiresArticulableFacts: true,
        standardTest: 'Would a hypothetical, reasonable person, with the same information and in the same situation, have formed the same belief?',

        objectiveFactIndicators: [
          'observed',
          'witnessed',
          'saw',
          'noted',
          'detected',
          'measured',
          'recorded',
          'documented',
          'photographed',
          'captured',
          'logged',
          'registered'
        ],

        factualBasisPatterns: [
          /\bobserved\s+(?:that|the|a)\b/gi,
          /\bwitnessed\s+(?:that|the|a)\b/gi,
          /\bsaw\s+(?:that|the|a)\b/gi,
          /\bdetected\s+(?:that|the|a)\b/gi,
          /\bthe\s+vehicle\s+(?:was|appeared|seemed)\b/gi,
          /\bthe\s+driver\s+(?:was|appeared|seemed)\b/gi,
          /\bcrossed\s+the\s+(?:center|centre)\s+line/gi,
          /\berratic(?:ally)?\s+driv/gi,
          /\bsmell(?:ed)?\s+(?:of\s+)?alcohol/gi,
          /\bslurred\s+speech/gi,
          /\bunsteady\s+(?:on\s+(?:his|her|their)\s+)?feet/gi,
          /\bglassy\s+eyes/gi,
          /\bflushed\s+face/gi
        ],

        insufficientGrounds: [
          'appeared nervous',
          'seemed nervous',
          'looked nervous',
          'acted suspiciously',
          'gave the impression',
          'I felt',
          'I thought',
          'hunch',
          'gut feeling',
          'instinct'
        ],

        complianceCheck: {
          mustContain: ['objective', 'facts', 'circumstances', 'grounds'],
          mustNotRelyOnHunch: true,
          severity: 'critical',
          defectIfInsufficient: 'Objective element of reasonable belief test not satisfied - belief must be based on specific, articulable facts, not mere hunch or subjective feeling'
        }
      },

      // Court Assessment Standards
      courtAssessment: {
        description: 'How courts will assess the reasonable belief test',
        assessmentCriteria: [
          'Facts known to the police officer at the time the power was exercised',
          'Whether a hypothetical reasonable person would have formed the same belief',
          'Whether the officer can articulate the factual basis for their belief',
          'Whether the belief was based on specific information that can be justified in court'
        ],
        burden: 'Prosecution bears the burden of proving reasonable grounds existed',
        standard: 'Beyond reasonable doubt (criminal proceedings)'
      },

      // Applicable Victorian Legislation
      applicableSections: [
        {
          act: 'Road Safety Act 1986',
          section: 's.49(1)(g)',
          requirement: 'Officer must have reasonable belief that person has consumed alcohol while in control of motor vehicle',
          preconditions: ['Person in control of motor vehicle', 'On public road', 'Reasonable belief alcohol consumed']
        },
        {
          act: 'Road Safety Act 1986',
          section: 's.49(1)',
          requirement: 'Officer must have reasonable grounds for preliminary breath test',
          preconditions: ['One of the circumstances in s.49(1)(a)-(h) exists']
        },
        {
          act: 'Victoria Police Act 2013',
          section: 'Various',
          requirement: 'Officer must have reasonable grounds for exercise of police powers',
          preconditions: ['Lawful authority', 'Reasonable grounds', 'Proportionate response']
        }
      ]
    },

    /**
     * Reasonable Grounds Test
     * Similar to reasonable belief but applies to different contexts
     */
    reasonableGrounds: {
      name: 'Reasonable Grounds Test',
      description: 'Test for reasonable grounds to believe or suspect',
      standardTest: 'Objective test based on facts and circumstances known at the time',

      indicators: [
        'reasonable grounds',
        'reasonable basis',
        'reasonable cause',
        'grounds to believe',
        'grounds to suspect',
        'basis to believe',
        'cause to suspect'
      ],

      patterns: [
        /\breasonable\s+grounds?\s+(?:to\s+)?(?:believe|suspect)\b/gi,
        /\bgrounds?\s+(?:to\s+)?(?:believe|suspect|think)\b/gi,
        /\breasonable\s+(?:basis|cause)\s+(?:to|for)\b/gi
      ],

      requiredElements: [
        'Factual basis',
        'Objective circumstances',
        'Reasonable person standard',
        'Contemporaneous assessment'
      ]
    }
  },

  // ============================================================================
  // WORD-BY-WORD ANALYSIS PATTERNS
  // ============================================================================

  wordByWordAnalysis: {

    // Legal Modal Verbs - Critical for statutory interpretation
    modalVerbs: {
      mandatory: {
        terms: ['must', 'shall', 'required', 'obliged', 'mandatory', 'duty'],
        severity: 'critical',
        description: 'Mandatory obligations - non-compliance may render act invalid',
        patterns: [
          /\bmust\b/gi,
          /\bshall\b/gi,
          /\brequired\s+to\b/gi,
          /\bobliged\s+to\b/gi,
          /\bmandatory\b/gi,
          /\bduty\s+to\b/gi
        ]
      },
      permissive: {
        terms: ['may', 'might', 'can', 'could', 'permitted', 'allowed'],
        severity: 'medium',
        description: 'Permissive provisions - discretionary power',
        patterns: [
          /\bmay\b/gi,
          /\bmight\b/gi,
          /\bcan\b/gi,
          /\bcould\b/gi,
          /\bpermitted\s+to\b/gi,
          /\ballowed\s+to\b/gi
        ]
      },
      prohibitive: {
        terms: ['must not', 'shall not', 'prohibited', 'forbidden', 'not permitted'],
        severity: 'critical',
        description: 'Prohibitions - breach may constitute offence',
        patterns: [
          /\bmust\s+not\b/gi,
          /\bshall\s+not\b/gi,
          /\bprohibited\b/gi,
          /\bforbidden\b/gi,
          /\bnot\s+permitted\b/gi
        ]
      }
    },

    // Belief and Suspicion Indicators
    beliefSuspicionTerms: {
      subjective: {
        terms: [
          'believed', 'believe', 'believing',
          'suspected', 'suspect', 'suspecting',
          'thought', 'think', 'thinking',
          'felt', 'feel', 'feeling',
          'opinion', 'view', 'impression',
          'appeared', 'seemed', 'looked like'
        ],
        severity: 'high',
        description: 'Subjective belief/suspicion indicators - require objective support',
        requiresObjectiveSupport: true,
        patterns: [
          /\bbelieve[ds]?\b/gi,
          /\bsuspect(?:ed|s|ing)?\b/gi,
          /\bthought\b/gi,
          /\bfelt\b/gi,
          /\bopinion\b/gi,
          /\bview\b/gi,
          /\bappeared\s+to\b/gi,
          /\bseemed\s+to\b/gi
        ]
      },
      objective: {
        terms: [
          'observed', 'witnessed', 'saw', 'noted',
          'detected', 'measured', 'recorded', 'documented',
          'registered', 'captured', 'logged', 'photographed'
        ],
        severity: 'low',
        description: 'Objective observation indicators - support reasonable belief',
        patterns: [
          /\bobserved\b/gi,
          /\bwitnessed\b/gi,
          /\bsaw\b/gi,
          /\bnoted\b/gi,
          /\bdetected\b/gi,
          /\bmeasured\b/gi,
          /\brecorded\b/gi,
          /\bdocumented\b/gi
        ]
      }
    },

    // Temporal Precision Terms
    temporalTerms: {
      precise: {
        terms: ['at', 'on', 'exactly', 'precisely', 'specific time'],
        patterns: [
          /\bat\s+\d{1,2}:\d{2}/gi,  // at 22:45
          /\bon\s+\d{1,2}\s+\w+\s+\d{4}/gi,  // on 10 March 2024
          /\bexactly\s+\d{1,2}:\d{2}/gi
        ],
        severity: 'low',
        description: 'Precise temporal references - good for timeline reconstruction'
      },
      imprecise: {
        terms: ['approximately', 'about', 'around', 'roughly', 'circa'],
        patterns: [
          /\bapproximately\b/gi,
          /\babout\b/gi,
          /\baround\b/gi,
          /\broughly\b/gi,
          /\bcirca\b/gi
        ],
        severity: 'medium',
        description: 'Imprecise temporal references - may cause timeline discrepancies'
      },
      vague: {
        terms: ['sometime', 'later', 'earlier', 'soon', 'recently'],
        patterns: [
          /\bsometime\b/gi,
          /\blater\b/gi,
          /\bearlier\b/gi,
          /\bsoon\b/gi,
          /\brecently\b/gi
        ],
        severity: 'high',
        description: 'Vague temporal references - potential defect in procedural documents'
      }
    },

    // Authority and Power Terms
    authorityTerms: {
      terms: [
        'authorized', 'authorised', 'empowered', 'power', 'authority',
        'pursuant to', 'under section', 'in accordance with',
        'by virtue of', 'enabled by'
      ],
      patterns: [
        /\bauthori[sz]ed(?:\s+(?:to|under|by))?\b/gi,
        /\bempowered\s+(?:to|under|by)\b/gi,
        /\bpursuant\s+to\b/gi,
        /\bunder\s+section\b/gi,
        /\bin\s+accordance\s+with\b/gi,
        /\bby\s+virtue\s+of\b/gi
      ],
      severity: 'high',
      description: 'Authority references - must link to valid statutory power'
    },

    // Compliance Terms
    complianceTerms: {
      compliant: {
        terms: ['complies', 'complied', 'compliance', 'in accordance with', 'satisfied', 'met requirements'],
        severity: 'low',
        description: 'Compliance indicators - positive compliance assertion'
      },
      nonCompliant: {
        terms: ['breach', 'violation', 'non-compliant', 'failed to comply', 'did not satisfy', 'defect'],
        severity: 'critical',
        description: 'Non-compliance indicators - potential legal defect'
      }
    }
  },

  // ============================================================================
  // LINE-BY-LINE ANALYSIS RULES
  // ============================================================================

  lineByLineAnalysis: {

    // Citation Format Rules
    citationRules: {
      section: {
        validFormats: [
          's.49(1)(g)',
          'section 49(1)(g)',
          'sec. 49(1)(g)',
          's 49(1)(g)',
          'Section 49(1)(g)'
        ],
        patterns: [
          /\bs\.?\s*\d+[A-Z]*(?:\(\d+\))?(?:\([a-z]\))?/gi,
          /\bsection\s+\d+[A-Z]*(?:\(\d+\))?(?:\([a-z]\))?/gi,
          /\bsec\.?\s+\d+[A-Z]*(?:\(\d+\))?(?:\([a-z]\))?/gi
        ],
        severity: 'medium',
        checkConsistency: true
      },
      act: {
        validFormats: [
          'Road Safety Act 1986',
          'Evidence Act 2008 (Vic)',
          'Criminal Procedure Act 2009'
        ],
        mustInclude: ['Act', 'year'],
        severity: 'medium'
      },
      case: {
        validFormats: [
          'George v Rockett (1990) 170 CLR 104',
          'Smith v Jones [2024] VR 123',
          'R v Brown [2023] VSC 456'
        ],
        patterns: [
          /\b[A-Z][a-z]+\s+v\.?\s+[A-Z][a-z]+\s+(?:\(\d{4}\)|\[\d{4}\])/g,
          /\bR\s+v\.?\s+[A-Z][a-z]+\s+(?:\(\d{4}\)|\[\d{4}\])/g
        ],
        severity: 'low'
      }
    },

    // Sentence Structure Rules
    sentenceRules: {
      maxLength: {
        words: 40,
        severity: 'low',
        description: 'Sentences exceeding 40 words may affect clarity'
      },
      prohibitedStructures: {
        doubleNegative: {
          patterns: [
            /\bnot\s+un\w+/gi,
            /\bnot\s+in\w+/gi,
            /\bno\s+lack\s+of\b/gi
          ],
          severity: 'medium',
          description: 'Double negatives affect plain meaning interpretation'
        },
        passiveVoice: {
          patterns: [
            /\b(?:was|were|is|are|been)\s+\w+ed\b/gi,
            /\b(?:was|were|is|are|been)\s+being\s+\w+ed\b/gi
          ],
          severity: 'low',
          description: 'Passive voice in procedural documents may obscure responsibility',
          exceptions: ['in legal documents describing past events']
        }
      }
    },

    // Timeline Extraction Rules
    timelineRules: {
      dateFormats: [
        /\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}/g,  // 10/03/2024 or 10-03-2024
        /\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}/gi,  // 10 March 2024
        /\d{4}-\d{2}-\d{2}/g  // 2024-03-10 (ISO format)
      ],
      timeFormats: [
        /\d{1,2}:\d{2}(?::\d{2})?\s*(?:am|pm|AM|PM)?/g,  // 22:45 or 10:45pm
        /\d{1,2}:\d{2}\s+hours/g  // 22:45 hours
      ],
      relativeTime: [
        /\b(?:approximately|about|around)\s+\d{1,2}:\d{2}/gi,
        /\bat\s+approximately\s+\d{1,2}:\d{2}/gi
      ],
      extractionRequired: true,
      crossDocumentComparison: true,
      tolerance: {
        minutes: 5,  // Acceptable time variance between documents
        severity: 'high'  // Severity if variance exceeds tolerance
      }
    }
  },

  // ============================================================================
  // LEGISLATIVE COMPLIANCE CHECKING
  // ============================================================================

  complianceChecking: {

    /**
     * Road Safety Act 1986 Compliance Framework
     */
    roadSafetyAct: {
      section49: {
        name: 'Section 49 - Preliminary Breath Test',
        preconditions: {
          sequence: [
            {
              step: 1,
              requirement: 'Person must be in one of the circumstances listed in s.49(1)(a)-(h)',
              mustExistBefore: 'Power to require preliminary test can be exercised',
              verificationRequired: true
            },
            {
              step: 2,
              requirement: 'Officer must have reasonable belief (for s.49(1)(g))',
              elements: ['Subjective belief formed', 'Objective grounds exist'],
              mustExistBefore: 'Test can be required',
              verificationRequired: true
            },
            {
              step: 3,
              requirement: 'Officer must inform person of requirement and statutory basis',
              mustExistBefore: 'Test is conducted',
              verificationRequired: true
            }
          ],
          circumstances: [
            {
              subsection: 's.49(1)(a)',
              description: 'Person is driver of motor vehicle',
              keywords: ['driver', 'driving', 'drove']
            },
            {
              subsection: 's.49(1)(b)',
              description: 'Person is in charge of motor vehicle',
              keywords: ['in charge', 'control']
            },
            {
              subsection: 's.49(1)(c)',
              description: 'Person was recently driving',
              keywords: ['recently driving', 'recently drove', 'just driving']
            },
            {
              subsection: 's.49(1)(f)',
              description: 'Vehicle involved in accident',
              keywords: ['accident', 'collision', 'crash']
            },
            {
              subsection: 's.49(1)(g)',
              description: 'Reasonable belief person consumed alcohol',
              keywords: ['reasonable belief', 'alcohol', 'consumed', 'drinking'],
              requiresReasonableBelief: true
            }
          ]
        },
        compliance: {
          mustDocument: [
            'Which circumstance under s.49(1) applies',
            'Basis for reasonable belief (if s.49(1)(g))',
            'Time and location of test',
            'That person was informed of requirement'
          ],
          defectsIfMissing: 'critical'
        }
      },

      section55D: {
        name: 'Section 55D - Authority and Conditions',
        preconditions: {
          sequence: [
            {
              step: 1,
              requirement: 'Officer must be authorized under s.55D',
              mustExistBefore: 'Any preliminary test conducted',
              keywords: ['authorized', 'authorised', 'authority'],
              verificationRequired: true
            },
            {
              step: 2,
              requirement: 'Test must be conducted in accordance with conditions',
              mustExistBefore: 'Test result can be relied upon',
              verificationRequired: true
            }
          ]
        },
        compliance: {
          mustDocument: ['Officer authorization', 'Training records', 'Authority under s.55D'],
          defectsIfMissing: 'critical'
        }
      },

      section55E: {
        name: 'Section 55E - Proper Performance',
        preconditions: {
          sequence: [
            {
              step: 1,
              requirement: 'Device must be approved',
              mustExistBefore: 'Test conducted',
              keywords: ['approved', 'approval', 'device'],
              verificationRequired: true
            },
            {
              step: 2,
              requirement: 'Device must be properly maintained',
              mustExistBefore: 'Test conducted',
              keywords: ['maintained', 'maintenance', 'calibrated', 'calibration'],
              verificationRequired: true
            },
            {
              step: 3,
              requirement: 'Device must be in proper working order',
              mustExistBefore: 'Test result can be relied upon',
              keywords: ['proper', 'properly', 'performance', 'working order'],
              verificationRequired: true
            }
          ]
        },
        compliance: {
          mustDocument: [
            'Device approval number',
            'Calibration records',
            'Maintenance logs',
            'That device was in proper working order'
          ],
          defectsIfMissing: 'critical'
        },
        defects: {
          noApprovalNumber: {
            severity: 'critical',
            description: 'Device approval number not documented',
            impact: 's.55E proper performance requirement not satisfied'
          },
          noCalibrationRecords: {
            severity: 'critical',
            description: 'Calibration records not disclosed',
            impact: 'Cannot verify proper performance under s.55E'
          },
          noMaintenanceLog: {
            severity: 'high',
            description: 'Maintenance log not disclosed',
            impact: 'Proper performance indicators incomplete'
          }
        }
      }
    },

    /**
     * Evidence Act 2008 Compliance Framework
     */
    evidenceAct: {
      section137: {
        name: 'Section 137 - Exclusion of Prejudicial Evidence',
        test: 'Court must exclude evidence if probative value substantially outweighed by prejudicial effect',
        triggers: [
          'prejudicial',
          'unfair',
          'probative value',
          'prejudicial effect'
        ],
        assessment: {
          probativeValue: ['Relevance', 'Reliability', 'Significance'],
          prejudicialEffect: ['Unfairness', 'Misuse by jury', 'Difficulty in challenging']
        }
      },

      section138: {
        name: 'Section 138 - Exclusion of Improperly Obtained Evidence',
        test: 'Court may exclude evidence if improperly or illegally obtained',
        triggers: [
          'improperly obtained',
          'illegally obtained',
          'unlawfully obtained',
          'breach',
          'violation'
        ],
        factors: [
          'Probative value of evidence',
          'Importance of evidence in proceeding',
          'Nature of relevant offence',
          'Gravity of impropriety or contravention',
          'Whether impropriety was deliberate or reckless',
          'Whether impropriety was contrary to law',
          'Difficulty of obtaining evidence without impropriety'
        ],
        burden: 'Party seeking exclusion bears burden of proof'
      },

      hearsayRule: {
        name: 'Chapter 3 - Hearsay Rule',
        definition: 'Evidence of previous representation made by person not called as witness',
        triggers: [
          'told',
          'said',
          'stated',
          'reported',
          'informed',
          'represented',
          'heard from'
        ],
        exceptions: [
          {
            section: 's.60',
            name: 'Evidence relevant for non-hearsay purpose',
            description: 'Evidence admissible if relevant for purpose other than hearsay'
          },
          {
            section: 's.63',
            name: 'Exception: civil proceedings',
            description: 'First-hand hearsay admissible in civil proceedings'
          },
          {
            section: 's.65',
            name: 'Exception: criminal proceedings - unavailability',
            description: 'First-hand hearsay admissible if maker unavailable'
          },
          {
            section: 's.66',
            name: 'Exception: criminal proceedings - defendant statements',
            description: 'First-hand hearsay admissible for defendant'
          },
          {
            section: 's.69',
            name: 'Exception: business records',
            description: 'Business records admissible if requirements satisfied'
          }
        ]
      }
    },

    /**
     * Criminal Procedure Act 2009 Compliance Framework
     */
    criminalProcedureAct: {
      part3_3: {
        name: 'Part 3.3 - Disclosure',
        section185: {
          name: 'Section 185 - Defence Disclosure',
          requirements: [
            'Notice of alibi',
            'Expert evidence notice',
            'Notice of authority for prosecution witness'
          ],
          timing: 'As specified in relevant provisions',
          consequences: 'May affect admissibility of evidence'
        },
        section187: {
          name: 'Section 187 - Prosecution Disclosure',
          requirements: [
            'Copy of prosecution brief',
            'All relevant evidence',
            'Exculpatory material',
            'Expert reports',
            'Witness statements'
          ],
          timing: {
            summaryMatters: 'At or before filing hearing',
            indictableMatters: 'Before committal mention date or as ordered'
          },
          ongoingDuty: 'Continuing obligation to disclose relevant material',
          defects: {
            lateDisclosure: {
              severity: 'high',
              impact: 'May warrant adjournment or exclusion of evidence'
            },
            incompleteDisclosure: {
              severity: 'critical',
              impact: 'Procedural unfairness - may result in stay of proceedings'
            }
          }
        }
      }
    }
  },

  // ============================================================================
  // THEME CONFIGURATION
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
  // SEVERITY LEVELS
  // ============================================================================

  severity: {
    levels: ['critical', 'high', 'medium', 'low'],
    definitions: {
      critical: {
        label: 'Critical',
        priority: 1,
        requiresImmediateAction: true,
        description: 'Jurisdictional defects, missing statutory prerequisites, reasonable belief test failure, improper authority'
      },
      high: {
        label: 'High',
        priority: 2,
        requiresImmediateAction: true,
        description: 'Missing s.55E proper performance requirements, incomplete disclosure, timeline discrepancies, missing objective grounds'
      },
      medium: {
        label: 'Medium',
        priority: 3,
        requiresImmediateAction: false,
        description: 'Imprecise temporal references, citation inconsistencies, hearsay issues without clear exception'
      },
      low: {
        label: 'Low',
        priority: 4,
        requiresImmediateAction: false,
        description: 'Passive voice, complex sentences, formatting inconsistencies'
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
  // VICTORIAN PRIMARY LEGISLATION
  // ============================================================================

  victorianLegislation: {
    primaryActs: [
      {
        name: 'Road Safety Act 1986',
        shortName: 'RSA 1986',
        jurisdiction: 'Victoria',
        category: 'Road Safety',
        pattern: /Road\s+Safety\s+Act\s+1986/gi,
        description: 'Road safety offences and procedures',
        keyProvisions: {
          's.49': 'Preliminary breath test requirements',
          's.55D': 'Authority and conditions for tests',
          's.55E': 'Proper performance requirements',
          's.55': 'Evidentiary breath test'
        }
      },
      {
        name: 'Evidence Act 2008 (Vic)',
        shortName: 'EA 2008',
        jurisdiction: 'Victoria',
        category: 'Evidence',
        pattern: /Evidence\s+Act\s+2008/gi,
        description: 'Evidentiary requirements and admissibility',
        keyProvisions: {
          'Chapter 3': 'Hearsay rule and exceptions',
          's.137': 'Exclusion of prejudicial evidence',
          's.138': 'Exclusion of improperly obtained evidence',
          's.69': 'Business records exception'
        }
      },
      {
        name: 'Criminal Procedure Act 2009',
        shortName: 'CPA 2009',
        jurisdiction: 'Victoria',
        category: 'Criminal Procedure',
        pattern: /Criminal\s+Procedure\s+Act\s+2009/gi,
        description: 'Criminal procedure and disclosure requirements',
        keyProvisions: {
          'Part 3.3': 'Disclosure obligations',
          's.185': 'Defence disclosure',
          's.187': 'Prosecution disclosure'
        }
      },
      {
        name: 'Victoria Police Act 2013',
        shortName: 'VPA 2013',
        jurisdiction: 'Victoria',
        category: 'Police Powers',
        pattern: /Victoria\s+Police\s+Act\s+2013/gi,
        description: 'Police powers and authority',
        keyProvisions: {
          'Part 4': 'Police powers and duties'
        }
      },
      {
        name: 'Charter of Human Rights and Responsibilities Act 2006',
        shortName: 'Charter 2006',
        jurisdiction: 'Victoria',
        category: 'Human Rights',
        pattern: /Charter\s+of\s+Human\s+Rights/gi,
        description: 'Human rights protections',
        keyProvisions: {
          's.24': 'Fair hearing',
          's.25': 'Rights in criminal proceedings'
        }
      },
      {
        name: 'Magistrates\' Court Act 1989',
        shortName: 'MCA 1989',
        jurisdiction: 'Victoria',
        category: 'Courts',
        pattern: /Magistrates['']?\s+Court\s+Act\s+1989/gi,
        description: 'Magistrates\' Court jurisdiction and procedures'
      }
    ]
  },

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  utils: {

    /**
     * Analyze text for reasonable belief test compliance
     * @param {string} text - Document text to analyze
     * @returns {Object} Analysis result with subjective and objective elements
     */
    analyzeReasonableBeliefTest(text) {
      const result = {
        subjectiveElementFound: false,
        subjectiveIndicators: [],
        objectiveElementFound: false,
        objectiveFactors: [],
        insufficientGrounds: [],
        compliant: false,
        defects: []
      };

      // Check subjective element
      const subjectivePatterns = ForensicAnalyzerConfig.statutoryTests.reasonableBelief.subjectiveElement.patterns;
      subjectivePatterns.forEach(pattern => {
        const matches = text.match(pattern);
        if (matches) {
          result.subjectiveElementFound = true;
          result.subjectiveIndicators.push(...matches);
        }
      });

      // Check objective element
      const objectivePatterns = ForensicAnalyzerConfig.statutoryTests.reasonableBelief.objectiveElement.factualBasisPatterns;
      objectivePatterns.forEach(pattern => {
        const matches = text.match(pattern);
        if (matches) {
          result.objectiveElementFound = true;
          result.objectiveFactors.push(...matches);
        }
      });

      // Check for insufficient grounds
      const insufficientGrounds = ForensicAnalyzerConfig.statutoryTests.reasonableBelief.objectiveElement.insufficientGrounds;
      insufficientGrounds.forEach(term => {
        const pattern = new RegExp('\\b' + term + '\\b', 'gi');
        if (pattern.test(text)) {
          result.insufficientGrounds.push(term);
        }
      });

      // Determine compliance
      result.compliant = result.subjectiveElementFound && result.objectiveElementFound && result.insufficientGrounds.length === 0;

      // Generate defects
      if (!result.subjectiveElementFound) {
        result.defects.push({
          type: 'Missing Subjective Element',
          severity: 'critical',
          description: 'Subjective element of reasonable belief test not established - officer must demonstrate genuine formation of belief'
        });
      }

      if (!result.objectiveElementFound) {
        result.defects.push({
          type: 'Missing Objective Element',
          severity: 'critical',
          description: 'Objective element of reasonable belief test not satisfied - belief must be based on specific, articulable facts'
        });
      }

      if (result.insufficientGrounds.length > 0) {
        result.defects.push({
          type: 'Insufficient Grounds',
          severity: 'critical',
          description: `Belief appears to be based on insufficient grounds: ${result.insufficientGrounds.join(', ')}. Reasonable belief cannot be based on mere hunch or subjective feeling.`
        });
      }

      return result;
    },

    /**
     * Extract and compare timelines between documents
     * @param {Array} documents - Array of document texts
     * @returns {Object} Timeline comparison with discrepancies
     */
    compareTimelines(documents) {
      const timelines = documents.map((doc, index) => ({
        docIndex: index,
        dates: [],
        times: [],
        events: []
      }));

      // Extract dates and times from each document
      documents.forEach((doc, index) => {
        // Extract dates
        ForensicAnalyzerConfig.lineByLineAnalysis.timelineRules.dateFormats.forEach(pattern => {
          const matches = doc.match(pattern);
          if (matches) {
            timelines[index].dates.push(...matches);
          }
        });

        // Extract times
        ForensicAnalyzerConfig.lineByLineAnalysis.timelineRules.timeFormats.forEach(pattern => {
          const matches = doc.match(pattern);
          if (matches) {
            timelines[index].times.push(...matches);
          }
        });
      });

      // Compare and find discrepancies
      const discrepancies = [];
      // Implementation of comparison logic would go here

      return {
        timelines,
        discrepancies,
        hasDiscrepancies: discrepancies.length > 0
      };
    },

    /**
     * Get CDN script tags
     */
    getCDNScriptTags() {
      const { cdn } = ForensicAnalyzerConfig;
      let html = '';

      html += `<script ${cdn.react.crossorigin ? 'crossorigin' : ''} src="${cdn.react.url}"></script>\n`;
      html += `<script ${cdn.reactDom.crossorigin ? 'crossorigin' : ''} src="${cdn.reactDom.url}"></script>\n`;
      html += `<script src="${cdn.babel.url}"></script>\n`;
      html += `<script src="${cdn.tesseract.url}"></script>\n`;
      html += `<script src="${cdn.pdfjs.url}"></script>\n`;
      if (cdn.mammoth) {
        html += `<script src="${cdn.mammoth.url}"></script>\n`;
      }

      return html;
    },

    /**
     * Initialize PDF.js worker
     */
    initPDFWorker() {
      if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = ForensicAnalyzerConfig.cdn.pdfjs.workerUrl;
      }
    },

    /**
     * Get severity color
     */
    getSeverityColor(severity) {
      return ForensicAnalyzerConfig.severity.colorMapping[severity] || '#e5e7eb';
    }
  },

  // ============================================================================
  // VERSION INFORMATION
  // ============================================================================

  version: {
    config: '2.0.0',
    application: '2.0.0',
    lastUpdated: '2025-11-11',
    changelog: [
      {
        version: '2.0.0',
        date: '2025-11-11',
        changes: [
          'Added statutory test frameworks (reasonable belief, reasonable grounds)',
          'Implemented two-limb test from George v Rockett (1990)',
          'Added word-by-word analysis patterns for modal verbs, belief terms, temporal terms',
          'Added line-by-line analysis rules for citations, sentence structure, timelines',
          'Implemented legislative compliance checking with precondition sequences',
          'Added Road Safety Act s.49, s.55D, s.55E compliance frameworks',
          'Added Evidence Act s.137, s.138, hearsay rule compliance frameworks',
          'Added Criminal Procedure Act Part 3.3 disclosure compliance framework',
          'Added utility functions for reasonable belief test analysis and timeline comparison',
          'Enhanced severity definitions with statutory test focus',
          'Added Mammoth.js CDN for DOCX support'
        ]
      },
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
