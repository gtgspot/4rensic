/**
 * Table of Provisions Navigator
 *
 * Utility module for navigating and working with the Road Safety Act 1986
 * Table of Provisions. Provides hierarchical navigation, cross-reference
 * mapping, and integration with the YScript rules engine.
 *
 * @version 1.0.0
 * @jurisdiction Victoria, Australia
 * @module TableOfProvisionsNavigator
 */

/**
 * Table of Provisions Navigator Class
 */
export class TableOfProvisionsNavigator {
  constructor() {
    this.toc = null;
    this.initialized = false;
    this.sectionIndex = new Map();
    this.keyProvisions = [];
    this.offenceProvisions = [];
  }

  /**
   * Initialize by loading the Table of Provisions
   * @returns {Promise<void>}
   */
  async init() {
    if (this.initialized) {
      return;
    }

    try {
      const response = await fetch('/src/data/roadSafetyActTableOfProvisions.json');
      if (!response.ok) {
        throw new Error(`Failed to load ToC: ${response.statusText}`);
      }

      this.toc = await response.json();
      this._buildIndexes();
      this.initialized = true;

      console.log('✓ Table of Provisions Navigator initialized');
      console.log(`✓ Act: ${this.toc.metadata.act} (Version ${this.toc.metadata.version})`);
      console.log(`✓ Indexed ${this.sectionIndex.size} sections`);
    } catch (error) {
      console.error('✗ Failed to initialize ToC Navigator:', error);
      throw error;
    }
  }

  /**
   * Build internal indexes for fast lookup
   * @private
   */
  _buildIndexes() {
    const provisions = this.toc.tableOfProvisions;

    // Index all sections
    Object.entries(provisions).forEach(([partKey, part]) => {
      if (part.sections) {
        // Part has direct sections (no divisions)
        Object.entries(part.sections).forEach(([sectionKey, section]) => {
          this._indexSection(section, part.partNumber, null);
        });
      } else if (part.divisions) {
        // Part has divisions
        Object.entries(part.divisions).forEach(([divKey, division]) => {
          Object.entries(division.sections).forEach(([sectionKey, section]) => {
            this._indexSection(section, part.partNumber, division.divisionNumber);
          });
        });
      }
    });
  }

  /**
   * Index a single section
   * @private
   */
  _indexSection(section, partNumber, divisionNumber) {
    const indexEntry = {
      ...section,
      part: partNumber,
      division: divisionNumber
    };

    this.sectionIndex.set(section.number, indexEntry);

    if (section.keyProvision) {
      this.keyProvisions.push(section.number);
    }

    if (section.offenceProvision) {
      this.offenceProvisions.push(section.number);
    }
  }

  /**
   * Get section details
   * @param {string} sectionNumber - Section number (e.g., "49", "55D")
   * @returns {Object|null} Section details or null if not found
   */
  getSection(sectionNumber) {
    return this.sectionIndex.get(sectionNumber) || null;
  }

  /**
   * Get all sections in a part
   * @param {string} partNumber - Part number
   * @returns {Array<Object>} Array of sections in the part
   */
  getPartSections(partNumber) {
    const sections = [];

    for (const [sectionNum, section] of this.sectionIndex) {
      if (section.part === partNumber) {
        sections.push(section);
      }
    }

    return sections.sort((a, b) => this._compareSectionNumbers(a.number, b.number));
  }

  /**
   * Get all sections in a division
   * @param {string} partNumber - Part number
   * @param {string} divisionNumber - Division number
   * @returns {Array<Object>} Array of sections in the division
   */
  getDivisionSections(partNumber, divisionNumber) {
    const sections = [];

    for (const [sectionNum, section] of this.sectionIndex) {
      if (section.part === partNumber && section.division === divisionNumber) {
        sections.push(section);
      }
    }

    return sections.sort((a, b) => this._compareSectionNumbers(a.number, b.number));
  }

  /**
   * Get part information
   * @param {string} partNumber - Part number
   * @returns {Object|null} Part information
   */
  getPart(partNumber) {
    const partKey = `part${partNumber}`;
    return this.toc.tableOfProvisions[partKey] || null;
  }

  /**
   * Get division information
   * @param {string} partNumber - Part number
   * @param {string} divisionNumber - Division number
   * @returns {Object|null} Division information
   */
  getDivision(partNumber, divisionNumber) {
    const part = this.getPart(partNumber);
    if (!part || !part.divisions) return null;

    const divKey = `division${divisionNumber}`;
    return part.divisions[divKey] || null;
  }

  /**
   * Get all related sections for a given section
   * @param {string} sectionNumber - Section number
   * @returns {Array<Object>} Array of related sections with details
   */
  getRelatedSections(sectionNumber) {
    const section = this.getSection(sectionNumber);
    if (!section || !section.relatedSections) {
      return [];
    }

    return section.relatedSections.map(relNum => {
      const relSection = this.getSection(relNum);
      return {
        number: relNum,
        title: relSection?.title || 'Unknown',
        details: relSection
      };
    });
  }

  /**
   * Get cross-references by topic
   * @param {string} topic - Topic key (e.g., 'alcoholTesting', 'drugTesting')
   * @returns {Object|null} Cross-reference information
   */
  getCrossReferences(topic) {
    return this.toc.crossReferences[topic] || null;
  }

  /**
   * Get all cross-reference topics
   * @returns {Array<string>} Array of topic keys
   */
  getAllTopics() {
    return Object.keys(this.toc.crossReferences);
  }

  /**
   * Get key provisions (important sections)
   * @returns {Array<Object>} Array of key provision details
   */
  getKeyProvisions() {
    return this.keyProvisions.map(num => this.getSection(num));
  }

  /**
   * Get offence provisions
   * @returns {Array<Object>} Array of offence provision details
   */
  getOffenceProvisions() {
    return this.offenceProvisions.map(num => this.getSection(num));
  }

  /**
   * Get sections with implemented rules
   * @returns {Array<Object>} Array of sections with implementation details
   */
  getImplementedSections() {
    const implemented = [];
    const implStatus = this.toc.implementationStatus.rulesImplemented;

    Object.entries(implStatus).forEach(([key, impl]) => {
      const section = this.getSection(impl.section.split('(')[0]);
      implemented.push({
        ...impl,
        sectionDetails: section
      });
    });

    return implemented;
  }

  /**
   * Get priority sections for implementation
   * @param {string} priority - Priority level ('HIGH', 'MEDIUM', 'LOW')
   * @returns {Array<Object>} Array of priority sections
   */
  getPriorityForImplementation(priority = null) {
    const priorities = this.toc.implementationStatus.priorityForImplementation;

    if (priority) {
      return priorities.filter(p => p.priority === priority);
    }

    return priorities;
  }

  /**
   * Search sections by keyword
   * @param {string} keyword - Keyword to search for
   * @returns {Array<Object>} Matching sections
   */
  searchSections(keyword) {
    const lowerKeyword = keyword.toLowerCase();
    const results = [];

    for (const [sectionNum, section] of this.sectionIndex) {
      if (
        section.title.toLowerCase().includes(lowerKeyword) ||
        section.number.toLowerCase().includes(lowerKeyword)
      ) {
        results.push(section);
      }
    }

    return results;
  }

  /**
   * Get section hierarchy breadcrumb
   * @param {string} sectionNumber - Section number
   * @returns {Object} Hierarchical path
   */
  getSectionHierarchy(sectionNumber) {
    const section = this.getSection(sectionNumber);
    if (!section) return null;

    const part = this.getPart(section.part);
    const hierarchy = {
      act: this.toc.metadata.act,
      part: {
        number: section.part,
        title: part?.title || 'Unknown'
      },
      section: {
        number: section.number,
        title: section.title
      }
    };

    if (section.division) {
      const division = this.getDivision(section.part, section.division);
      hierarchy.division = {
        number: section.division,
        title: division?.title || 'Unknown'
      };
    }

    return hierarchy;
  }

  /**
   * Get navigation path as string
   * @param {string} sectionNumber - Section number
   * @returns {string} Formatted navigation path
   */
  getNavigationPath(sectionNumber) {
    const hierarchy = this.getSectionHierarchy(sectionNumber);
    if (!hierarchy) return '';

    let path = `Part ${hierarchy.part.number} - ${hierarchy.part.title}`;

    if (hierarchy.division) {
      path += ` › Division ${hierarchy.division.number} - ${hierarchy.division.title}`;
    }

    path += ` › s.${hierarchy.section.number} ${hierarchy.section.title}`;

    return path;
  }

  /**
   * Get all parts with their structure
   * @returns {Array<Object>} Complete structure
   */
  getCompleteStructure() {
    const structure = [];

    Object.entries(this.toc.tableOfProvisions).forEach(([partKey, part]) => {
      const partStructure = {
        number: part.partNumber,
        title: part.title,
        divisions: [],
        sections: []
      };

      if (part.divisions) {
        Object.entries(part.divisions).forEach(([divKey, division]) => {
          const divStructure = {
            number: division.divisionNumber,
            title: division.title,
            sections: Object.values(division.sections)
          };
          partStructure.divisions.push(divStructure);
        });
      } else if (part.sections) {
        partStructure.sections = Object.values(part.sections);
      }

      structure.push(partStructure);
    });

    return structure;
  }

  /**
   * Get statistics about the Act
   * @returns {Object} Statistics
   */
  getStatistics() {
    const parts = Object.keys(this.toc.tableOfProvisions).length;
    const schedules = Object.keys(this.toc.schedules).length;

    let divisions = 0;
    Object.values(this.toc.tableOfProvisions).forEach(part => {
      if (part.divisions) {
        divisions += Object.keys(part.divisions).length;
      }
    });

    return {
      act: this.toc.metadata.act,
      version: this.toc.metadata.version,
      currentTo: this.toc.metadata.currentTo,
      parts,
      divisions,
      sections: this.sectionIndex.size,
      schedules,
      keyProvisions: this.keyProvisions.length,
      offenceProvisions: this.offenceProvisions.length,
      implementedRules: Object.keys(this.toc.implementationStatus.rulesImplemented).length,
      priorityForImplementation: this.toc.implementationStatus.priorityForImplementation.length
    };
  }

  /**
   * Check if a section has implemented rules
   * @param {string} sectionNumber - Section number
   * @returns {Object|null} Implementation details or null
   */
  getImplementationStatus(sectionNumber) {
    const implStatus = this.toc.implementationStatus.rulesImplemented;

    for (const [key, impl] of Object.entries(implStatus)) {
      if (impl.section.startsWith(sectionNumber)) {
        return impl;
      }
    }

    return null;
  }

  /**
   * Compare section numbers for sorting
   * @private
   */
  _compareSectionNumbers(a, b) {
    // Extract numeric part and letter part
    const aMatch = a.match(/^(\d+)([A-Z]*)$/);
    const bMatch = b.match(/^(\d+)([A-Z]*)$/);

    if (!aMatch || !bMatch) {
      return a.localeCompare(b);
    }

    const aNum = parseInt(aMatch[1]);
    const bNum = parseInt(bMatch[1]);

    if (aNum !== bNum) {
      return aNum - bNum;
    }

    // Same number, compare letters
    return aMatch[2].localeCompare(bMatch[2]);
  }

  /**
   * Get metadata
   * @returns {Object} Act metadata
   */
  getMetadata() {
    return this.toc.metadata;
  }

  /**
   * Export ToC as JSON
   * @returns {string} JSON string
   */
  exportToJSON() {
    return JSON.stringify(this.toc, null, 2);
  }
}

/**
 * Factory function to create navigator
 * @returns {TableOfProvisionsNavigator} Navigator instance
 */
export function createNavigator() {
  return new TableOfProvisionsNavigator();
}

/**
 * Default export
 */
export default TableOfProvisionsNavigator;
