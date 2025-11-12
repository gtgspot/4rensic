/**
 * Outcome Recorder Component
 *
 * Allows users to record court outcomes for analyses, enabling
 * the system to learn which defects are most effective in Victorian courts.
 *
 * @version 1.0.0
 */

export class OutcomeRecorder {
  constructor(database, patternDetector) {
    this.database = database;
    this.patternDetector = patternDetector;
    this.container = null;
    this.currentAnalysisId = null;
    this.currentDefects = [];
  }

  /**
   * Show outcome recording dialog for an analysis
   * @param {number} analysisId - The analysis ID
   * @param {Array} defects - Defects found in the analysis
   * @param {HTMLElement} containerElement - Where to render the dialog
   */
  show(analysisId, defects, containerElement) {
    this.currentAnalysisId = analysisId;
    this.currentDefects = defects;
    this.container = containerElement;

    const html = `
      <div class="outcome-recorder-overlay">
        <div class="outcome-recorder-modal">
          <div class="modal-header">
            <h3>📋 Record Court Outcome</h3>
            <button class="close-btn" onclick="this.closest('.outcome-recorder-overlay').remove()">✕</button>
          </div>

          <div class="modal-body">
            <p class="info-text">
              Help the system learn by recording what happened in court with this case.
              This data will improve future recommendations.
            </p>

            <div class="form-group">
              <label for="outcome-type">Outcome Type *</label>
              <select id="outcome-type" class="form-control">
                <option value="">-- Select Outcome --</option>
                <option value="evidence excluded">Evidence Excluded</option>
                <option value="application successful">Application Successful</option>
                <option value="case dismissed">Case Dismissed</option>
                <option value="evidence admitted">Evidence Admitted</option>
                <option value="application denied">Application Denied</option>
                <option value="case proceeded">Case Proceeded</option>
                <option value="settled">Settled</option>
                <option value="withdrawn">Withdrawn</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="form-group">
              <label>Which Defects Were Raised in Court? *</label>
              <p class="field-hint">Select all that apply:</p>
              <div class="defects-checklist" id="defects-checklist">
                ${this.renderDefectsChecklist(defects)}
              </div>
            </div>

            <div class="form-group">
              <label for="court-response">Court's Response</label>
              <textarea id="court-response" class="form-control" rows="4"
                placeholder="e.g., Magistrate agreed the s.55D directions were inadequate and excluded BAC evidence..."></textarea>
            </div>

            <div class="form-group">
              <label for="effective-arguments">Effective Arguments (Optional)</label>
              <p class="field-hint">What arguments worked well? (one per line)</p>
              <textarea id="effective-arguments" class="form-control" rows="3"
                placeholder="e.g., Cited Walker v Melbourne&#10;Emphasized timing of directions&#10;Referenced s.55D(2) specific language"></textarea>
            </div>

            <div class="form-group">
              <label for="outcome-date">Date of Outcome *</label>
              <input type="date" id="outcome-date" class="form-control" value="${new Date().toISOString().split('T')[0]}">
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="this.closest('.outcome-recorder-overlay').remove()">
              Cancel
            </button>
            <button class="btn btn-primary" id="save-outcome-btn">
              💾 Save Outcome
            </button>
          </div>
        </div>
      </div>
    `;

    containerElement.insertAdjacentHTML('beforeend', html);
    this.addStyles();
    this.attachEventHandlers();
  }

  /**
   * Render defects checklist
   */
  renderDefectsChecklist(defects) {
    if (!defects || defects.length === 0) {
      return '<p class="no-defects">No defects found in this analysis</p>';
    }

    return defects.map((defect, index) => `
      <div class="defect-checkbox-item">
        <input type="checkbox" id="defect-${index}" value="${defect.type}" class="defect-checkbox">
        <label for="defect-${index}">
          <span class="defect-severity severity-${defect.severity?.toLowerCase() || 'low'}">${defect.severity || 'LOW'}</span>
          <span class="defect-type">${defect.type}</span>
        </label>
      </div>
    `).join('');
  }

  /**
   * Attach event handlers
   */
  attachEventHandlers() {
    const saveBtn = document.getElementById('save-outcome-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveOutcome());
    }
  }

  /**
   * Save the recorded outcome
   */
  async saveOutcome() {
    const outcomeType = document.getElementById('outcome-type')?.value;
    const courtResponse = document.getElementById('court-response')?.value || '';
    const effectiveArgumentsText = document.getElementById('effective-arguments')?.value || '';
    const outcomeDate = document.getElementById('outcome-date')?.value;

    // Validate required fields
    if (!outcomeType) {
      alert('Please select an outcome type');
      return;
    }

    if (!outcomeDate) {
      alert('Please enter the date of the outcome');
      return;
    }

    // Get selected defects
    const selectedDefects = Array.from(document.querySelectorAll('.defect-checkbox:checked'))
      .map(checkbox => checkbox.value);

    if (selectedDefects.length === 0) {
      alert('Please select at least one defect that was raised in court');
      return;
    }

    // Parse effective arguments
    const effectiveArguments = effectiveArgumentsText
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.trim());

    const outcomeData = {
      outcome: outcomeType,
      defectsRaised: selectedDefects,
      courtResponse: courtResponse,
      effectiveArguments: effectiveArguments,
      date: new Date(outcomeDate).toISOString()
    };

    try {
      // Save to database
      await this.database.saveOutcome(this.currentAnalysisId, outcomeData);

      // Update pattern detector
      await this.patternDetector.learnFromOutcome(this.currentAnalysisId, outcomeData);

      // Show success message
      this.showSuccessMessage();

      // Close dialog after delay
      setTimeout(() => {
        document.querySelector('.outcome-recorder-overlay')?.remove();
      }, 2000);

    } catch (error) {
      console.error('Failed to save outcome:', error);
      alert('Failed to save outcome. Please try again.');
    }
  }

  /**
   * Show success message
   */
  showSuccessMessage() {
    const modalBody = document.querySelector('.outcome-recorder-modal .modal-body');
    if (modalBody) {
      modalBody.innerHTML = `
        <div class="success-message">
          <div class="success-icon">✅</div>
          <h3>Outcome Recorded Successfully!</h3>
          <p>The system has learned from this outcome and will use it to improve future recommendations.</p>
        </div>
      `;
    }
  }

  /**
   * Add CSS styles
   */
  addStyles() {
    if (document.getElementById('outcome-recorder-styles')) return;

    const styles = `
      <style id="outcome-recorder-styles">
        .outcome-recorder-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .outcome-recorder-modal {
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 2px solid #e2e8f0;
        }

        .modal-header h3 {
          margin: 0;
          color: #2d3748;
          font-size: 20px;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          color: #a0aec0;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #edf2f7;
          color: #2d3748;
        }

        .modal-body {
          padding: 20px;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 20px;
          border-top: 2px solid #e2e8f0;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .field-hint {
          font-size: 12px;
          color: #718096;
          margin: 5px 0;
        }

        .form-control {
          width: 100%;
          padding: 10px;
          border: 2px solid #e2e8f0;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .form-control:focus {
          outline: none;
          border-color: #667eea;
        }

        .defects-checklist {
          max-height: 200px;
          overflow-y: auto;
          border: 2px solid #e2e8f0;
          border-radius: 6px;
          padding: 10px;
          background: #f7fafc;
        }

        .defect-checkbox-item {
          display: flex;
          align-items: center;
          padding: 8px;
          margin-bottom: 5px;
          background: white;
          border-radius: 4px;
        }

        .defect-checkbox-item input[type="checkbox"] {
          margin-right: 10px;
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .defect-checkbox-item label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          margin: 0;
          font-weight: normal;
        }

        .defect-severity {
          display: inline-block;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .severity-critical {
          background: #feb2b2;
          color: #742a2a;
        }

        .severity-high {
          background: #fbd38d;
          color: #7c2d12;
        }

        .severity-medium {
          background: #faf089;
          color: #744210;
        }

        .severity-low {
          background: #9ae6b4;
          color: #22543d;
        }

        .defect-type {
          font-size: 13px;
          color: #2d3748;
        }

        .no-defects {
          text-align: center;
          color: #a0aec0;
          padding: 20px;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
          background: #e2e8f0;
          color: #4a5568;
        }

        .btn-secondary:hover {
          background: #cbd5e0;
        }

        .info-text {
          font-size: 13px;
          color: #4a5568;
          margin-bottom: 20px;
          padding: 12px;
          background: #edf2f7;
          border-radius: 6px;
          border-left: 3px solid #667eea;
        }

        .success-message {
          text-align: center;
          padding: 40px 20px;
        }

        .success-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .success-message h3 {
          color: #2d3748;
          margin-bottom: 10px;
        }

        .success-message p {
          color: #4a5568;
          font-size: 14px;
        }
      </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
  }
}

export default OutcomeRecorder;
