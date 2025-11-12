/**
 * Magistrates' Court Victoria Procedure Checker
 *
 * Specialized analyzer for Magistrates' Court of Victoria criminal procedure compliance.
 * Checks disclosure requirements (CPA s.185-187) and RSA compliance for preliminary breath tests.
 *
 * @version 1.0.0
 * @jurisdiction Victoria, Australia - Magistrates' Court
 */

export class MagistratesCourtChecker {
  constructor() {
    this.initialized = true;
  }

  /**
   * Perform comprehensive court procedure analysis
   * @param {string} documentText - Full document text to analyze
   * @param {Object} options - Analysis options
   * @returns {Object} Comprehensive court compliance results
   */
  async analyzeCourtCompliance(documentText, options = {}) {
    const results = {
      disclosure: null,
      rsaCompliance: null,
      procedural: null,
      courtSubmission: null,
      overallCompliant: true,
      criticalDefects: []
    };

    // Detect document type and apply appropriate analysis
    const docType = this.detectDocumentType(documentText);

    // Check disclosure compliance (for all criminal matters)
    if (options.checkDisclosure !== false) {
      results.disclosure = this.checkDisclosureCompliance(documentText);
      if (!results.disclosure.compliant) {
        results.overallCompliant = false;
        results.criticalDefects.push(...results.disclosure.criticalDefects);
      }
    }

    // Check RSA compliance (if traffic/drink-driving matter)
    if (docType.isTrafficMatter || options.checkRSA) {
      results.rsaCompliance = this.checkRSACompliance(documentText);
      if (!results.rsaCompliance.compliant) {
        results.overallCompliant = false;
        results.criticalDefects.push(...results.rsaCompliance.criticalDefects);
      }
    }

    // Check general procedural compliance
    results.procedural = this.checkProceduralCompliance(documentText);
    if (!results.procedural.compliant) {
      results.overallCompliant = false;
      results.criticalDefects.push(...results.procedural.criticalDefects);
    }

    // Generate court submission draft
    results.courtSubmission = this.generateCourtSubmission(results);

    return results;
  }

  /**
   * Detect document type from content
   * @param {string} text - Document text
   * @returns {Object} Document type analysis
   */
  detectDocumentType(text) {
    const textLower = text.toLowerCase();
    return {
      isTrafficMatter: /breath|alcohol|drink.*driving|pbt|preliminary.*test|bac|blood.*alcohol/i.test(text),
      isCriminalMatter: /charge|offence|offense|criminal|prosecution|informant/i.test(text),
      hasDisclosure: /disclosure|brief|witness.*statement|exhibit/i.test(text),
      hasPoliceEvidence: /police|officer|constable|member.*victoria.*police/i.test(text)
    };
  }

  /**
   * Check compliance with CPA disclosure requirements
   * @param {string} documentText - Full document text
   * @returns {Object} Disclosure compliance results
   */
  checkDisclosureCompliance(documentText) {
    const results = {
      compliant: true,
      prosecutionDisclosure: {
        compliant: true,
        required: [],
        present: [],
        missing: []
      },
      defenceDisclosure: {
        compliant: true,
        required: [],
        present: [],
        missing: []
      },
      criticalDefects: []
    };

    // CPA s.187 - Prosecution disclosure requirements
    const requiredProsecution = [
      {
        item: 'Informant statement',
        keywords: ['informant', 'statement of informant', 'police statement'],
        section: 'CPA s.187(1)(a)',
        mandatory: true
      },
      {
        item: 'Witness statements',
        keywords: ['witness statement', 'statement of witness', 'witness', 'deponent'],
        section: 'CPA s.187(1)(b)',
        mandatory: true
      },
      {
        item: 'Exhibit list',
        keywords: ['exhibit', 'list of exhibits', 'exhibit list', 'tendered'],
        section: 'CPA s.187(1)(c)',
        mandatory: true
      },
      {
        item: 'Prior convictions',
        keywords: ['prior conviction', 'criminal history', 'prior offence', 'previous conviction'],
        section: 'CPA s.187(1)(d)',
        mandatory: false
      },
      {
        item: 'Exculpatory material',
        keywords: ['exculpatory', 'favourable to accused', 'inconsistent statement'],
        section: 'CPA s.187(2)',
        mandatory: true
      }
    ];

    requiredProsecution.forEach(req => {
      results.prosecutionDisclosure.required.push(req);
      const found = this.searchInDocument(documentText, req.keywords);

      if (found.present) {
        results.prosecutionDisclosure.present.push({
          item: req.item,
          section: req.section,
          evidence: found.matches
        });
      } else {
        results.prosecutionDisclosure.missing.push({
          item: req.item,
          section: req.section,
          mandatory: req.mandatory
        });

        if (req.mandatory) {
          results.prosecutionDisclosure.compliant = false;
          results.compliant = false;
          results.criticalDefects.push({
            severity: 'CRITICAL',
            category: 'Prosecution Disclosure',
            element: req.item,
            section: req.section,
            consequence: 'Mandatory disclosure not provided - breach of CPA s.187',
            remedy: 'Apply for adjournment or dismissal per CPA s.187(6)'
          });
        }
      }
    });

    // CPA s.185 - Defence disclosure requirements
    const requiredDefence = [
      {
        item: 'Alibi notice',
        keywords: ['alibi', 'notice of alibi', 'different location', 'elsewhere'],
        section: 'CPA s.185(1)',
        mandatory: false,
        conditional: 'Only if alibi defence raised'
      },
      {
        item: 'Expert evidence notice',
        keywords: ['expert', 'expert witness', 'expert evidence', 'expert opinion'],
        section: 'CPA s.185(2)',
        mandatory: false,
        conditional: 'Only if expert evidence to be called'
      },
      {
        item: 'Witness list',
        keywords: ['defence witness', 'witness for defence', 'witness list'],
        section: 'CPA s.185(3)',
        mandatory: false
      },
      {
        item: 'Document list',
        keywords: ['document', 'defence documents', 'list of documents'],
        section: 'CPA s.185(3)',
        mandatory: false
      }
    ];

    requiredDefence.forEach(req => {
      results.defenceDisclosure.required.push(req);
      const found = this.searchInDocument(documentText, req.keywords);

      if (found.present) {
        results.defenceDisclosure.present.push({
          item: req.item,
          section: req.section,
          evidence: found.matches
        });
      } else if (req.mandatory) {
        results.defenceDisclosure.missing.push({
          item: req.item,
          section: req.section,
          conditional: req.conditional
        });
      }
    });

    return results;
  }

  /**
   * Check compliance with RSA 1986 preliminary breath test requirements
   * @param {string} documentText - Full document text
   * @returns {Object} RSA compliance results
   */
  checkRSACompliance(documentText) {
    const results = {
      compliant: true,
      checklist: {},
      criticalDefects: [],
      proceduralDefects: [],
      evidenceFound: []
    };

    // RSA s.49 - Preliminary breath test requirements
    const requirements = [
      {
        id: 's49_reason_to_believe',
        element: 's.49(1) - Reason to believe',
        keywords: [
          'reason to believe', 'believed that', 'formed.*view', 'formed.*belief',
          'suspected', 'reasonable.*grounds', 'reasonable.*suspicion'
        ],
        regex: /reason to believe|believed that|formed.{0,20}(view|belief|suspicion)|reasonable.{0,20}(grounds|suspicion)/i,
        mandatory: true,
        consequence: 'No lawful authority to require preliminary test',
        remedy: 'Test result inadmissible - entire procedure invalid (George v Rockett principle)'
      },
      {
        id: 's49_specified_indicator',
        element: 's.49(1) - Specified indicator present',
        keywords: [
          'consumed alcohol', 'under.*influence', 'affected.*alcohol',
          'smell.*alcohol', 'odour.*alcohol', 'bloodshot.*eyes', 'slurred.*speech'
        ],
        regex: /consumed alcohol|under.{0,20}influence|affected.{0,20}alcohol|smell.{0,20}alcohol|odour.{0,20}alcohol|bloodshot.{0,20}eyes|slurred.{0,20}speech/i,
        mandatory: true,
        consequence: 'No factual basis for s.49(1) requirement',
        remedy: 'Test invalid - no grounds for reasonable belief established'
      },
      {
        id: 's55D_in_accordance_directions',
        element: 's.55D(1) - Test conducted in accordance with directions',
        keywords: [
          'in accordance with.*direction', 'directions for use', 'as directed',
          'manufacturer.*instructions', 'proper.*procedure'
        ],
        regex: /in accordance with.{0,30}direction|directions for use|as directed|manufacturer.{0,20}instructions|proper.{0,20}procedure/i,
        mandatory: true,
        consequence: 'Test not conducted as required by statute',
        remedy: 'Test result inadmissible - s.55D(1) not satisfied'
      },
      {
        id: 's55D_oral_or_written',
        element: 's.55D(1) - Oral or written directions',
        keywords: [
          'oral.*direction', 'written.*direction', 'instructed', 'told to',
          'directed to', 'requested to.*blow'
        ],
        regex: /oral.{0,20}direction|written.{0,20}direction|instructed|told to|directed to|requested to.{0,20}blow/i,
        mandatory: true,
        consequence: 'No evidence directions given',
        remedy: 'Test may be invalid - no proof of proper directions'
      },
      {
        id: 's55E_proper_performance',
        element: 's.55E - Device operated properly',
        keywords: [
          'device.*operated', 'properly.*performed', 'test.*conducted',
          'functioning.*correctly', 'calibrated', 'maintained'
        ],
        regex: /device.{0,20}operated|properly.{0,20}performed|test.{0,20}conducted|functioning.{0,20}correctly|calibrated|maintained/i,
        mandatory: true,
        consequence: 'No evidence of proper performance',
        remedy: 'Test result unreliable - s.55E not established'
      },
      {
        id: 'device_approved',
        element: 'Device approval - Approved device used',
        keywords: [
          'approved.*device', 'Alcolizer', 'Draeger', 'breath.*analyzer',
          'approved.*instrument', 'device.*approved'
        ],
        regex: /approved.{0,20}device|Alcolizer|Draeger|breath.{0,20}analyzer|approved.{0,20}instrument|device.{0,20}approved/i,
        mandatory: true,
        consequence: 'Device must be approved under RSA',
        remedy: 'Test invalid if unapproved device used'
      },
      {
        id: 'result_documented',
        element: 'Result documentation - Test result recorded',
        keywords: [
          'result', 'reading', 'positive', 'negative', 'recorded',
          'outcome', 'test.*showed'
        ],
        regex: /result|reading|positive|negative|recorded|outcome|test.{0,20}showed/i,
        mandatory: true,
        consequence: 'No record of test result',
        remedy: 'Test result may be inadmissible - no documentation'
      }
    ];

    // Check each requirement
    requirements.forEach(req => {
      const found = req.regex.test(documentText);
      results.checklist[req.id] = found;

      if (found) {
        // Find specific evidence
        const matches = documentText.match(new RegExp(`.{0,100}${req.regex.source}.{0,100}`, 'gi'));
        if (matches) {
          results.evidenceFound.push({
            element: req.element,
            evidence: matches[0].trim(),
            status: 'SATISFIED'
          });
        }
      } else if (req.mandatory) {
        results.compliant = false;
        const defect = {
          severity: 'CRITICAL',
          category: 'RSA Compliance',
          element: req.element,
          section: req.id.replace(/_/g, '.').toUpperCase(),
          consequence: req.consequence,
          remedy: req.remedy,
          status: 'MISSING'
        };

        results.criticalDefects.push(defect);
      }
    });

    return results;
  }

  /**
   * Check general procedural compliance
   * @param {string} documentText - Full document text
   * @returns {Object} Procedural compliance results
   */
  checkProceduralCompliance(documentText) {
    const results = {
      compliant: true,
      checks: [],
      criticalDefects: []
    };

    const procedures = [
      {
        name: 'Officer identification',
        keywords: ['officer', 'constable', 'police', 'member.*police', 'informant'],
        mandatory: true
      },
      {
        name: 'Date and time recorded',
        keywords: ['date', 'time', 'on.*20\\d{2}', 'at.*\\d{1,2}:\\d{2}', 'hours'],
        mandatory: true
      },
      {
        name: 'Location specified',
        keywords: ['at.*road', 'street', 'location', 'place', 'highway', 'address'],
        mandatory: true
      },
      {
        name: 'Accused identified',
        keywords: ['accused', 'defendant', 'driver', 'person.*charged', 'name.*address'],
        mandatory: true
      },
      {
        name: 'Rights advised',
        keywords: ['rights', 'right to.*lawyer', 'right to.*silence', 'caution', 'warned'],
        mandatory: false
      }
    ];

    procedures.forEach(proc => {
      const found = this.searchInDocument(documentText, proc.keywords);
      const check = {
        procedure: proc.name,
        mandatory: proc.mandatory,
        satisfied: found.present,
        evidence: found.matches
      };

      results.checks.push(check);

      if (!found.present && proc.mandatory) {
        results.compliant = false;
        results.criticalDefects.push({
          severity: 'HIGH',
          category: 'Procedural Compliance',
          element: proc.name,
          consequence: 'Essential procedural requirement not documented',
          remedy: 'May render evidence inadmissible or unreliable'
        });
      }
    });

    return results;
  }

  /**
   * Search for keywords in document
   * @param {string} text - Document text
   * @param {Array<string>} keywords - Keywords to search for
   * @returns {Object} Search results
   */
  searchInDocument(text, keywords) {
    const results = {
      present: false,
      matches: []
    };

    keywords.forEach(keyword => {
      // Handle regex patterns
      const pattern = keyword.includes('.*') || keyword.includes('\\')
        ? new RegExp(keyword, 'gi')
        : new RegExp(`\\b${this.escapeRegex(keyword)}\\b`, 'gi');

      const matches = text.match(new RegExp(`.{0,80}${pattern.source}.{0,80}`, 'gi'));
      if (matches) {
        results.present = true;
        results.matches.push(...matches.map(m => m.trim()));
      }
    });

    // Remove duplicates
    results.matches = [...new Set(results.matches)];

    return results;
  }

  /**
   * Identify critical defects from compliance results
   * @param {Object} checklist - Compliance checklist
   * @returns {Array} Critical defects
   */
  identifyCriticalDefects(checklist) {
    const defects = [];

    // RSA s.49(1) - Reason to believe
    if (!checklist.s49_reason_to_believe) {
      defects.push({
        severity: 'CRITICAL',
        element: 's.49(1) reason to believe',
        section: 'Road Safety Act 1986 s.49(1)',
        consequence: 'No lawful authority to require preliminary test',
        remedy: 'Test result inadmissible - entire procedure invalid',
        authority: 'George v Rockett (1990) 170 CLR 104 - reasonable belief requires both subjective and objective elements'
      });
    }

    // RSA s.55D(1) - In accordance with directions
    if (!checklist.s55D_in_accordance_directions) {
      defects.push({
        severity: 'CRITICAL',
        element: 's.55D(1) in accordance with directions',
        section: 'Road Safety Act 1986 s.55D(1)',
        consequence: 'Test not conducted as required by statute',
        remedy: 'Test result inadmissible - s.55D(1) not satisfied',
        authority: 'RSA s.55D(1) mandatory requirement'
      });
    }

    // RSA s.55E - Proper performance
    if (!checklist.s55E_proper_performance) {
      defects.push({
        severity: 'CRITICAL',
        element: 's.55E proper performance',
        section: 'Road Safety Act 1986 s.55E',
        consequence: 'No evidence device operated properly',
        remedy: 'Test result unreliable and inadmissible',
        authority: 'RSA s.55E requires proof of proper performance'
      });
    }

    // Approved device
    if (!checklist.device_approved) {
      defects.push({
        severity: 'CRITICAL',
        element: 'Approved device requirement',
        section: 'Road Safety Act 1986 - Regulations',
        consequence: 'Use of unapproved device invalidates test',
        remedy: 'Test result inadmissible - device not approved',
        authority: 'Only approved devices may be used under RSA'
      });
    }

    return defects;
  }

  /**
   * Generate court-ready submission document
   * @param {Object} complianceResults - Full compliance analysis results
   * @returns {Object} Court submission document
   */
  generateCourtSubmission(complianceResults) {
    const submission = {
      title: 'SUBMISSION ON ADMISSIBILITY OF EVIDENCE',
      matterType: 'Magistrates\' Court of Victoria - Criminal Jurisdiction',
      generatedDate: new Date().toLocaleDateString('en-AU'),
      sections: []
    };

    // Executive Summary
    submission.sections.push({
      heading: 'EXECUTIVE SUMMARY',
      content: this.generateExecutiveSummary(complianceResults)
    });

    // Disclosure Issues
    if (complianceResults.disclosure && !complianceResults.disclosure.compliant) {
      submission.sections.push({
        heading: 'DISCLOSURE COMPLIANCE (CPA ss.185-187)',
        content: this.generateDisclosureSubmission(complianceResults.disclosure)
      });
    }

    // RSA Compliance Issues
    if (complianceResults.rsaCompliance && !complianceResults.rsaCompliance.compliant) {
      submission.sections.push({
        heading: 'ROAD SAFETY ACT COMPLIANCE',
        content: this.generateRSASubmission(complianceResults.rsaCompliance)
      });
    }

    // Procedural Issues
    if (complianceResults.procedural && !complianceResults.procedural.compliant) {
      submission.sections.push({
        heading: 'PROCEDURAL COMPLIANCE',
        content: this.generateProceduralSubmission(complianceResults.procedural)
      });
    }

    // Relief Sought
    submission.sections.push({
      heading: 'RELIEF SOUGHT',
      content: this.generateReliefSought(complianceResults)
    });

    return submission;
  }

  /**
   * Generate executive summary for court submission
   * @param {Object} results - Compliance results
   * @returns {string} Executive summary text
   */
  generateExecutiveSummary(results) {
    const defectCount = results.criticalDefects.length;
    const categories = [...new Set(results.criticalDefects.map(d => d.category))];

    let summary = `This submission addresses ${defectCount} critical defect${defectCount !== 1 ? 's' : ''} `;
    summary += `identified in the prosecution evidence, affecting:\n\n`;

    categories.forEach(cat => {
      const count = results.criticalDefects.filter(d => d.category === cat).length;
      summary += `• ${cat}: ${count} defect${count !== 1 ? 's' : ''}\n`;
    });

    summary += `\nThe Court is respectfully requested to find the evidence inadmissible and/or dismiss the charge(s) `;
    summary += `on the basis that fundamental statutory and procedural requirements have not been satisfied.`;

    return summary;
  }

  /**
   * Generate disclosure-specific submission section
   * @param {Object} disclosure - Disclosure compliance results
   * @returns {string} Disclosure submission text
   */
  generateDisclosureSubmission(disclosure) {
    let content = 'APPLICABLE LAW:\n';
    content += 'Criminal Procedure Act 2009 (Vic) ss.185-187 impose mandatory disclosure obligations.\n\n';

    content += 'FACTS:\n';
    if (disclosure.prosecutionDisclosure.missing.length > 0) {
      content += 'The following prosecution disclosure is missing:\n';
      disclosure.prosecutionDisclosure.missing.forEach(item => {
        content += `• ${item.item} (${item.section})${item.mandatory ? ' - MANDATORY' : ''}\n`;
      });
    }

    content += '\nANALYSIS:\n';
    content += 'The prosecution has failed to comply with mandatory disclosure obligations under CPA s.187.\n';
    content += 'This represents a fundamental breach of procedural fairness and the accused\'s right to a fair trial.\n\n';

    content += 'RELIEF SOUGHT:\n';
    content += 'Pursuant to CPA s.187(6):\n';
    content += '1. Adjournment until full disclosure provided; OR\n';
    content += '2. Exclusion of undisclosed evidence; OR\n';
    content += '3. Dismissal of charge(s) if disclosure cannot be provided.\n';

    return content;
  }

  /**
   * Generate RSA-specific submission section
   * @param {Object} rsaCompliance - RSA compliance results
   * @returns {string} RSA submission text
   */
  generateRSASubmission(rsaCompliance) {
    let content = 'APPLICABLE LAW:\n';
    content += 'Road Safety Act 1986 (Vic) ss.49, 55D, 55E\n';
    content += 'George v Rockett (1990) 170 CLR 104 - two-limb reasonable belief test\n\n';

    content += 'FACTS:\n';
    content += 'The following statutory requirements are not satisfied:\n\n';

    rsaCompliance.criticalDefects.forEach(defect => {
      content += `${defect.element}:\n`;
      content += `  Section: ${defect.section}\n`;
      content += `  Issue: ${defect.consequence}\n`;
      content += `  Authority: ${defect.remedy}\n\n`;
    });

    content += 'ANALYSIS:\n';
    content += 'The preliminary breath test procedure does not comply with mandatory statutory requirements.\n';
    content += 'Each defect is fatal to the admissibility of the evidence obtained.\n\n';

    content += 'LEGAL PRINCIPLES:\n';
    content += '• George v Rockett: Reasonable belief requires subjective and objective elements\n';
    content += '• s.55D(1): Test must be conducted in accordance with directions (mandatory)\n';
    content += '• s.55E: Proper performance must be established by prosecution\n';
    content += '• Approved device: Only approved devices admissible under RSA\n\n';

    content += 'RELIEF SOUGHT:\n';
    content += '1. Preliminary breath test result ruled inadmissible\n';
    content += '2. All subsequent evidence (evidentiary breath test, etc.) excluded as "fruit of poisoned tree"\n';
    content += '3. Charge(s) dismissed for want of admissible evidence\n';

    return content;
  }

  /**
   * Generate procedural submission section
   * @param {Object} procedural - Procedural compliance results
   * @returns {string} Procedural submission text
   */
  generateProceduralSubmission(procedural) {
    let content = 'PROCEDURAL DEFECTS IDENTIFIED:\n\n';

    procedural.criticalDefects.forEach(defect => {
      content += `${defect.element}:\n`;
      content += `  Issue: ${defect.consequence}\n`;
      content += `  Impact: ${defect.remedy}\n\n`;
    });

    return content;
  }

  /**
   * Generate relief sought section
   * @param {Object} results - Full compliance results
   * @returns {string} Relief sought text
   */
  generateReliefSought(results) {
    let content = 'The accused respectfully seeks the following orders:\n\n';

    let orderNum = 1;

    if (results.rsaCompliance && !results.rsaCompliance.compliant) {
      content += `${orderNum}. That the preliminary breath test evidence be ruled inadmissible;\n`;
      orderNum++;
      content += `${orderNum}. That all evidence obtained as a consequence of the invalid preliminary breath test be excluded;\n`;
      orderNum++;
    }

    if (results.disclosure && !results.disclosure.compliant) {
      content += `${orderNum}. That the matter be adjourned to permit full disclosure by the prosecution;\n`;
      orderNum++;
      content += `${orderNum}. In the alternative, that undisclosed evidence be excluded;\n`;
      orderNum++;
    }

    content += `${orderNum}. That the charge(s) be dismissed; OR\n`;
    orderNum++;
    content += `${orderNum}. Such other orders as the Court deems just.\n`;

    return content;
  }

  /**
   * Escape special regex characters
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

// Export for use in modules
export default MagistratesCourtChecker;
