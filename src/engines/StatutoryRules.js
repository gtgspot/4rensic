/**
 * Statutory Rules Library
 *
 * Machine-executable rule definitions for Victorian statutes.
 * These rules are used by the YScriptEngine to evaluate document compliance.
 *
 * @version 1.0.0
 * @jurisdiction Victoria, Australia
 * @module StatutoryRules
 */

/**
 * Road Safety Act 1986 - Statutory Rules
 */
export const RoadSafetyActRules = [
  /**
   * RSA s.49(1) - Prerequisite for Preliminary Breath Test
   *
   * A member of the police force may require a person to undergo a preliminary
   * breath test if the member has reason to believe that the person:
   * (a) has consumed alcohol or has alcohol in their body; or
   * (b) has consumed a drug or has a drug in their body; and
   * (c) has driven or been in charge of a motor vehicle
   */
  {
    ruleId: "RSA_s49_1_reason_to_believe",
    statute: "Road Safety Act 1986",
    section: "49(1)",
    type: "MANDATORY_PREREQUISITE",
    description: "Officer must have reason to believe person consumed alcohol/drug and drove/was in charge of vehicle",

    condition: {
      operator: "AND",
      requirements: [
        {
          element: "reason_to_believe",
          keywords: [
            "reason to believe",
            "believed that",
            "formed view",
            "formed belief",
            "had reason to believe",
            "reasonable belief",
            "reasonable grounds to believe",
            "suspected",
            "suspicion that"
          ],
          required: true,
          type: "SUBJECTIVE_STATE"
        },
        {
          element: "alcohol_drug_consumption",
          operator: "OR",
          options: [
            "consumed alcohol",
            "has alcohol in body",
            "has alcohol in their body",
            "under influence alcohol",
            "under the influence of alcohol",
            "had been drinking",
            "consumed drug",
            "has drug in body",
            "has drug in their body",
            "under influence drug",
            "under the influence of drug",
            "drug affected"
          ],
          required: true,
          type: "OBJECTIVE_BASIS_SUBSTANCE"
        },
        {
          element: "vehicle_operation",
          operator: "OR",
          options: [
            "driven vehicle",
            "driven a vehicle",
            "driven motor vehicle",
            "driven a motor vehicle",
            "driving vehicle",
            "driving a vehicle",
            "driving motor vehicle",
            "driving a motor vehicle",
            "been in charge vehicle",
            "been in charge of vehicle",
            "been in charge motor vehicle",
            "been in charge of motor vehicle",
            "in charge of vehicle",
            "in charge of motor vehicle",
            "was driving",
            "had been driving"
          ],
          required: true,
          type: "OBJECTIVE_BASIS_OPERATION"
        }
      ]
    },

    evaluation: {
      onSuccess: {
        result: "COMPLIANT",
        message: "Section 49(1) prerequisites satisfied - lawful authority to require preliminary test established"
      },
      onFailure: {
        result: "NON_COMPLIANT",
        severity: "CRITICAL",
        consequence: "No lawful authority to require preliminary breath test - entire procedure invalid",
        remedy: "Test result inadmissible - exclude all evidence obtained as consequence",
        legalPrinciple: "Statutory prerequisite not satisfied - no power to proceed"
      }
    }
  },

  /**
   * RSA s.49(1) - Articulation of Reason to Believe
   *
   * The officer must articulate the specific facts and circumstances that
   * formed the basis of their reason to believe.
   */
  {
    ruleId: "RSA_s49_1_articulation_of_belief",
    statute: "Road Safety Act 1986",
    section: "49(1)",
    type: "MANDATORY_PROCEDURAL",
    description: "Officer must articulate specific facts forming basis of belief",

    condition: {
      operator: "OR",
      requirements: [
        {
          element: "observable_indicators",
          operator: "OR",
          options: [
            "smell of alcohol",
            "smell of liquor",
            "odour of alcohol",
            "odour of liquor",
            "smell alcohol",
            "smelt alcohol",
            "detected smell",
            "red eyes",
            "bloodshot eyes",
            "glassy eyes",
            "slurred speech",
            "unsteady",
            "unsteady on feet",
            "swaying",
            "stumbling",
            "difficulty walking",
            "difficulty balancing",
            "fumbling",
            "slow movements",
            "delayed reactions"
          ],
          required: false,
          type: "PHYSICAL_INDICATORS"
        },
        {
          element: "driving_observations",
          operator: "OR",
          options: [
            "manner of driving",
            "erratic driving",
            "poor driving",
            "swerving",
            "weaving",
            "crossing lanes",
            "crossing centre line",
            "near collision",
            "collision",
            "accident",
            "crashed",
            "hit",
            "struck"
          ],
          required: false,
          type: "DRIVING_INDICATORS"
        },
        {
          element: "admissions",
          operator: "OR",
          options: [
            "admitted",
            "admitted drinking",
            "admitted consuming",
            "stated had drunk",
            "stated had consumed",
            "said had drunk",
            "said had consumed",
            "told me",
            "informed me",
            "declared"
          ],
          required: false,
          type: "VERBAL_INDICATORS"
        },
        {
          element: "circumstantial_evidence",
          operator: "OR",
          options: [
            "empty bottles",
            "empty cans",
            "bottles in vehicle",
            "cans in vehicle",
            "open container",
            "alcohol in vehicle",
            "coming from licensed premises",
            "leaving licensed premises",
            "leaving hotel",
            "leaving pub",
            "leaving bar",
            "leaving nightclub"
          ],
          required: false,
          type: "CIRCUMSTANTIAL_INDICATORS"
        }
      ]
    },

    evaluation: {
      onSuccess: {
        result: "COMPLIANT",
        message: "Officer has articulated specific factual basis for belief"
      },
      onFailure: {
        result: "NON_COMPLIANT",
        severity: "HIGH",
        consequence: "Belief appears to be bare assertion without factual foundation - may be arbitrary",
        remedy: "Challenge lawfulness of requirement on basis of insufficient articulation",
        legalPrinciple: "Officer must provide objective factual basis for subjective belief"
      }
    }
  },

  /**
   * RSA s.55(1) - Evidentiary Breath Test Prerequisites
   *
   * Before requiring an evidentiary breath test, preliminary test must have
   * been positive or officer must have reasonable grounds to believe offense committed.
   */
  {
    ruleId: "RSA_s55_1_evidentiary_test_prerequisite",
    statute: "Road Safety Act 1986",
    section: "55(1)",
    type: "MANDATORY_PREREQUISITE",
    description: "Prerequisites for requiring evidentiary breath test",

    condition: {
      operator: "OR",
      requirements: [
        {
          element: "positive_preliminary_test",
          keywords: [
            "positive preliminary test",
            "preliminary test positive",
            "preliminary breath test positive",
            "PBT positive",
            "preliminary test indicated",
            "preliminary test showed",
            "preliminary test returned positive"
          ],
          required: false,
          type: "TEST_RESULT"
        },
        {
          element: "reasonable_grounds_offense",
          operator: "AND",
          requirements: [
            {
              element: "reasonable_grounds",
              keywords: [
                "reasonable grounds",
                "reasonable grounds to believe",
                "grounds to believe",
                "reasonable belief"
              ],
              required: true,
              type: "SUBJECTIVE_STATE"
            },
            {
              element: "offense_type",
              operator: "OR",
              options: [
                "driving under influence",
                "driving whilst impaired",
                "driving with prescribed content",
                "driving with alcohol",
                "driving with drug",
                "offense against section",
                "committed offense",
                "committed offence"
              ],
              required: true,
              type: "OFFENSE_BELIEF"
            }
          ]
        }
      ]
    },

    evaluation: {
      onSuccess: {
        result: "COMPLIANT",
        message: "Section 55(1) prerequisites satisfied - lawful authority to require evidentiary test"
      },
      onFailure: {
        result: "NON_COMPLIANT",
        severity: "CRITICAL",
        consequence: "No lawful authority to require evidentiary breath test",
        remedy: "Evidentiary test result inadmissible",
        legalPrinciple: "Must have either positive PBT or reasonable grounds to believe offense committed"
      }
    }
  },

  /**
   * RSA s.55D - Proper Administration of Breath Test
   *
   * The breath analysis must be properly conducted in accordance with
   * approved procedures and using approved equipment.
   */
  {
    ruleId: "RSA_s55D_proper_administration",
    statute: "Road Safety Act 1986",
    section: "55D",
    type: "MANDATORY_PROCEDURAL",
    description: "Breath test must be properly administered using approved equipment and procedures",

    condition: {
      operator: "AND",
      requirements: [
        {
          element: "approved_instrument",
          keywords: [
            "approved instrument",
            "approved breath testing instrument",
            "approved breath analysis instrument",
            "approved device",
            "approved apparatus"
          ],
          required: true,
          type: "EQUIPMENT_REQUIREMENT"
        },
        {
          element: "proper_procedure",
          operator: "OR",
          options: [
            "in accordance with procedures",
            "in accordance with approved procedures",
            "following procedures",
            "following approved procedures",
            "properly conducted",
            "properly administered",
            "correctly administered",
            "correct procedure"
          ],
          required: true,
          type: "PROCEDURAL_REQUIREMENT"
        },
        {
          element: "qualified_operator",
          keywords: [
            "qualified operator",
            "trained operator",
            "authorized operator",
            "competent to operate"
          ],
          required: false,
          type: "OPERATOR_REQUIREMENT"
        }
      ]
    },

    evaluation: {
      onSuccess: {
        result: "COMPLIANT",
        message: "Breath test properly administered in accordance with s.55D requirements"
      },
      onFailure: {
        result: "NON_COMPLIANT",
        severity: "CRITICAL",
        consequence: "Breath test not properly administered - result may be unreliable",
        remedy: "Challenge admissibility of breath test result",
        legalPrinciple: "Strict compliance with statutory procedures required for admissibility"
      }
    }
  },

  /**
   * RSA s.56 - Right to Medical Practitioner
   *
   * Person must be informed of right to have sample taken by medical practitioner
   */
  {
    ruleId: "RSA_s56_right_to_medical_practitioner",
    statute: "Road Safety Act 1986",
    section: "56",
    type: "MANDATORY_PROCEDURAL",
    description: "Person must be informed of right to medical practitioner sample",

    condition: {
      operator: "AND",
      requirements: [
        {
          element: "notification_of_right",
          keywords: [
            "informed of right",
            "advised of right",
            "told of right",
            "notified of right",
            "right to have sample taken",
            "right to medical practitioner"
          ],
          required: true,
          type: "NOTIFICATION_REQUIREMENT"
        },
        {
          element: "timing_of_notification",
          keywords: [
            "before",
            "prior to",
            "immediately after",
            "as soon as practicable after"
          ],
          required: false,
          type: "TIMING_REQUIREMENT"
        }
      ]
    },

    evaluation: {
      onSuccess: {
        result: "COMPLIANT",
        message: "Person properly informed of right to medical practitioner sample"
      },
      onFailure: {
        result: "NON_COMPLIANT",
        severity: "HIGH",
        consequence: "Failure to inform of statutory right - procedural irregularity",
        remedy: "May challenge procedure on basis of denial of statutory right",
        legalPrinciple: "Statutory rights must be communicated to ensure procedural fairness"
      }
    }
  },

  /**
   * Generic Rule: Caution Before Questions
   *
   * Before asking incriminatory questions, officer must administer caution
   */
  {
    ruleId: "GENERIC_caution_before_questions",
    statute: "Evidence Act 2008",
    section: "Common Law",
    type: "MANDATORY_PROCEDURAL",
    description: "Caution must be given before asking incriminatory questions",

    condition: {
      operator: "OR",
      requirements: [
        {
          element: "formal_caution",
          keywords: [
            "you are not obliged to say anything",
            "not obliged to say anything",
            "right to remain silent",
            "cautioned",
            "administered caution",
            "gave caution",
            "provided caution"
          ],
          required: false,
          type: "CAUTION"
        },
        {
          element: "no_questions_asked",
          operator: "NOT",
          requirements: [
            {
              element: "incriminatory_questions",
              keywords: [
                "asked if",
                "questioned about",
                "do you admit",
                "did you",
                "have you",
                "were you"
              ],
              required: false,
              type: "QUESTIONING"
            }
          ]
        }
      ]
    },

    evaluation: {
      onSuccess: {
        result: "COMPLIANT",
        message: "Proper caution given or no incriminatory questions asked"
      },
      onFailure: {
        result: "NON_COMPLIANT",
        severity: "HIGH",
        consequence: "Incriminatory questions asked without caution - answers may be inadmissible",
        remedy: "Apply to exclude admissions made without caution",
        legalPrinciple: "Right to silence must be protected - caution required before questions"
      }
    }
  }
];

/**
 * Crimes Act 1958 - Statutory Rules
 */
export const CrimesActRules = [
  /**
   * Arrest without warrant - reasonable grounds
   */
  {
    ruleId: "CRIMES_s458_arrest_reasonable_grounds",
    statute: "Crimes Act 1958",
    section: "458",
    type: "MANDATORY_PREREQUISITE",
    description: "Officer must have reasonable grounds to believe offense committed",

    condition: {
      operator: "AND",
      requirements: [
        {
          element: "reasonable_grounds",
          keywords: [
            "reasonable grounds",
            "reasonable grounds to believe",
            "reasonable suspicion",
            "suspected on reasonable grounds"
          ],
          required: true,
          type: "SUBJECTIVE_STATE"
        },
        {
          element: "offense_commission",
          keywords: [
            "committed offense",
            "committed offence",
            "committing offense",
            "committing offence",
            "about to commit"
          ],
          required: true,
          type: "OFFENSE_ELEMENT"
        }
      ]
    },

    evaluation: {
      onSuccess: {
        result: "COMPLIANT",
        message: "Reasonable grounds for arrest established"
      },
      onFailure: {
        result: "NON_COMPLIANT",
        severity: "CRITICAL",
        consequence: "Arrest unlawful - no reasonable grounds established",
        remedy: "Challenge lawfulness of arrest - seek exclusion of evidence",
        legalPrinciple: "Arrest without warrant requires reasonable grounds"
      }
    }
  }
];

/**
 * Evidence Act 2008 - Statutory Rules
 */
export const EvidenceActRules = [
  /**
   * s.138 - Impropriety or illegality in obtaining evidence
   */
  {
    ruleId: "EVIDENCE_s138_impropriety",
    statute: "Evidence Act 2008",
    section: "138",
    type: "DISCRETIONARY_EXCLUSION",
    description: "Evidence obtained improperly or illegally may be excluded",

    condition: {
      operator: "OR",
      requirements: [
        {
          element: "impropriety",
          keywords: [
            "impropriety",
            "improperly obtained",
            "procedural irregularity",
            "breach of procedure"
          ],
          required: false,
          type: "IMPROPRIETY"
        },
        {
          element: "illegality",
          keywords: [
            "illegally obtained",
            "unlawful",
            "unlawfully obtained",
            "breach of law",
            "contravention"
          ],
          required: false,
          type: "ILLEGALITY"
        }
      ]
    },

    evaluation: {
      onSuccess: {
        result: "NON_COMPLIANT",
        message: "Evidence may have been obtained improperly or illegally - s.138 discretion engaged",
        severity: "HIGH"
      },
      onFailure: {
        result: "COMPLIANT",
        message: "No evidence of impropriety or illegality in obtaining evidence"
      }
    }
  }
];

/**
 * All Statutory Rules Combined
 */
export const AllStatutoryRules = [
  ...RoadSafetyActRules,
  ...CrimesActRules,
  ...EvidenceActRules
];

/**
 * Get rules by statute
 * @param {string} statute - Statute name
 * @returns {Array<Object>} Rules for that statute
 */
export function getRulesByStatute(statute) {
  return AllStatutoryRules.filter(rule =>
    rule.statute.toLowerCase().includes(statute.toLowerCase())
  );
}

/**
 * Get rules by section
 * @param {string} statute - Statute name
 * @param {string} section - Section number
 * @returns {Array<Object>} Rules for that section
 */
export function getRulesBySection(statute, section) {
  return AllStatutoryRules.filter(rule =>
    rule.statute.toLowerCase().includes(statute.toLowerCase()) &&
    rule.section === section
  );
}

/**
 * Get rules by type
 * @param {string} type - Rule type (MANDATORY_PREREQUISITE, MANDATORY_PROCEDURAL, etc.)
 * @returns {Array<Object>} Rules of that type
 */
export function getRulesByType(type) {
  return AllStatutoryRules.filter(rule => rule.type === type);
}

/**
 * Get critical rules (those with CRITICAL severity on failure)
 * @returns {Array<Object>} Critical rules
 */
export function getCriticalRules() {
  return AllStatutoryRules.filter(rule =>
    rule.evaluation.onFailure.severity === 'CRITICAL'
  );
}

/**
 * Search rules by keyword
 * @param {string} keyword - Keyword to search for
 * @returns {Array<Object>} Matching rules
 */
export function searchRules(keyword) {
  const lowerKeyword = keyword.toLowerCase();
  return AllStatutoryRules.filter(rule =>
    rule.description.toLowerCase().includes(lowerKeyword) ||
    rule.statute.toLowerCase().includes(lowerKeyword) ||
    rule.section.includes(lowerKeyword)
  );
}

/**
 * Default export
 */
export default {
  RoadSafetyActRules,
  CrimesActRules,
  EvidenceActRules,
  AllStatutoryRules,
  getRulesByStatute,
  getRulesBySection,
  getRulesByType,
  getCriticalRules,
  searchRules
};
