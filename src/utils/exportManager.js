/**
 * Export Manager Utility
 *
 * Handles exporting analysis results to various formats (PDF, DOCX, JSON, CSV).
 *
 * @version 1.0.0
 */

export class ExportManager {
  constructor() {
    this.supportedFormats = ['pdf', 'docx', 'json', 'csv', 'court-submission'];
  }

  /**
   * Export analysis results
   * @param {Object} results - Analysis results
   * @param {string} format - Export format
   * @param {string} fileName - Output file name
   */
  async export(results, format, fileName) {
    if (!this.supportedFormats.includes(format.toLowerCase())) {
      throw new Error(`Unsupported format: ${format}`);
    }

    switch (format.toLowerCase()) {
      case 'pdf':
        return await this.exportToPDF(results, fileName);
      case 'docx':
        return await this.exportToDOCX(results, fileName);
      case 'json':
        return this.exportToJSON(results, fileName);
      case 'csv':
        return this.exportToCSV(results, fileName);
      case 'court-submission':
        return await this.exportCourtSubmission(results, fileName);
      default:
        throw new Error(`No exporter for format: ${format}`);
    }
  }

  /**
   * Export to PDF
   * @param {Object} results - Analysis results
   * @param {string} fileName - Output file name
   */
  async exportToPDF(results, fileName) {
    if (typeof jspdf === 'undefined') {
      throw new Error('jsPDF library not loaded');
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text('Forensic Legal Analysis Report', 20, 20);

    // Date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);

    // Add content
    let y = 40;
    doc.setFontSize(12);

    if (results.presetName) {
      doc.text(`Analysis Type: ${results.presetName}`, 20, y);
      y += 10;
    }

    doc.text(`Word Count: ${results.wordCount || 'N/A'}`, 20, y);
    y += 10;
    doc.text(`Line Count: ${results.lineCount || 'N/A'}`, 20, y);
    y += 20;

    // Findings
    if (results.findings && results.findings.length > 0) {
      doc.setFontSize(14);
      doc.text('Findings:', 20, y);
      y += 10;

      doc.setFontSize(10);
      results.findings.slice(0, 20).forEach((finding, idx) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }

        doc.text(`${idx + 1}. [${finding.severity}] ${finding.type}`, 20, y);
        y += 7;
        const description = doc.splitTextToSize(finding.description, 170);
        doc.text(description, 25, y);
        y += description.length * 7 + 5;
      });
    }

    // Save PDF
    doc.save(fileName || 'analysis-report.pdf');
  }

  /**
   * Export to DOCX
   * @param {Object} results - Analysis results
   * @param {string} fileName - Output file name
   */
  async exportToDOCX(results, fileName) {
    if (typeof docx === 'undefined') {
      throw new Error('docx library not loaded');
    }

    // Create document content
    const { Document, Paragraph, TextRun, Packer } = docx;

    const paragraphs = [
      new Paragraph({
        children: [
          new TextRun({
            text: 'Forensic Legal Analysis Report',
            bold: true,
            size: 32
          })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Generated: ${new Date().toLocaleString()}`,
            size: 20
          })
        ]
      }),
      new Paragraph({ text: '' }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Analysis Type: ${results.presetName || 'N/A'}`,
            bold: true
          })
        ]
      }),
      new Paragraph({ text: `Word Count: ${results.wordCount || 'N/A'}` }),
      new Paragraph({ text: `Line Count: ${results.lineCount || 'N/A'}` }),
      new Paragraph({ text: '' }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'Findings:',
            bold: true,
            size: 24
          })
        ]
      })
    ];

    // Add findings
    if (results.findings) {
      results.findings.forEach((finding, idx) => {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${idx + 1}. [${finding.severity}] ${finding.type}`,
                bold: true
              })
            ]
          })
        );
        paragraphs.push(
          new Paragraph({ text: finding.description })
        );
        paragraphs.push(new Paragraph({ text: '' }));
      });
    }

    const doc = new Document({
      sections: [{
        properties: {},
        children: paragraphs
      }]
    });

    // Generate and download
    const blob = await Packer.toBlob(doc);
    this.downloadBlob(blob, fileName || 'analysis-report.docx');
  }

  /**
   * Export to JSON
   * @param {Object} results - Analysis results
   * @param {string} fileName - Output file name
   */
  exportToJSON(results, fileName) {
    const json = JSON.stringify(results, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    this.downloadBlob(blob, fileName || 'analysis-report.json');
  }

  /**
   * Export to CSV
   * @param {Object} results - Analysis results
   * @param {string} fileName - Output file name
   */
  exportToCSV(results, fileName) {
    if (!results.findings || results.findings.length === 0) {
      throw new Error('No findings to export');
    }

    // CSV header
    const headers = ['Type', 'Severity', 'Description', 'Location'];
    const rows = [headers.join(',')];

    // CSV rows
    results.findings.forEach(finding => {
      const row = [
        this.escapeCSV(finding.type || ''),
        this.escapeCSV(finding.severity || ''),
        this.escapeCSV(finding.description || ''),
        this.escapeCSV(finding.location || '')
      ];
      rows.push(row.join(','));
    });

    const csv = rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    this.downloadBlob(blob, fileName || 'analysis-report.csv');
  }

  /**
   * Download blob as file
   * @param {Blob} blob - Data blob
   * @param {string} fileName - File name
   */
  downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Escape string for CSV
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  escapeCSV(str) {
    if (typeof str !== 'string') return '';
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  /**
   * Export court submission to DOCX
   * @param {Object} results - Analysis results (must include courtCompliance)
   * @param {string} fileName - Output file name
   */
  async exportCourtSubmission(results, fileName) {
    if (typeof docx === 'undefined') {
      throw new Error('docx library not loaded');
    }

    if (!results.courtCompliance || !results.courtCompliance.courtSubmission) {
      throw new Error('No court submission data available. Run court compliance analysis first.');
    }

    const submission = results.courtCompliance.courtSubmission;
    const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer } = docx;

    const paragraphs = [];

    // Title page
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: submission.title || 'SUBMISSION TO THE COURT',
            bold: true,
            size: 32,
            allCaps: true
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      })
    );

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: submission.matterType || 'Magistrates\' Court of Victoria',
            size: 24,
            bold: true
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      })
    );

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Date: ${submission.generatedDate || new Date().toLocaleDateString('en-AU')}`,
            size: 20
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      })
    );

    // Add page break
    paragraphs.push(new Paragraph({ text: '', pageBreakBefore: true }));

    // Add each section
    if (submission.sections && submission.sections.length > 0) {
      submission.sections.forEach((section, idx) => {
        // Section heading
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.heading,
                bold: true,
                size: 28,
                underline: true
              })
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          })
        );

        // Section content
        const contentLines = section.content.split('\n');
        contentLines.forEach(line => {
          if (line.trim()) {
            // Check if line is a subheading (ALL CAPS followed by colon)
            const isSubheading = /^[A-Z\s]+:/.test(line);

            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    bold: isSubheading,
                    size: isSubheading ? 24 : 22
                  })
                ],
                spacing: { before: isSubheading ? 200 : 100, after: 100 },
                indent: line.startsWith('  ') ? { left: 720 } : line.startsWith('• ') || line.match(/^\d+\./) ? { left: 360 } : undefined
              })
            );
          } else {
            // Empty line for spacing
            paragraphs.push(new Paragraph({ text: '' }));
          }
        });

        // Add spacing between sections
        if (idx < submission.sections.length - 1) {
          paragraphs.push(new Paragraph({ text: '', spacing: { after: 400 } }));
        }
      });
    }

    // Footer
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '\n\n___________________________\nGenerated by Forensic Legal Analyzer',
            size: 18,
            italics: true
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 800 }
      })
    );

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440,    // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        },
        children: paragraphs
      }]
    });

    // Generate and download
    const blob = await Packer.toBlob(doc);
    this.downloadBlob(blob, fileName || 'court-submission.docx');
  }
}

export default ExportManager;
