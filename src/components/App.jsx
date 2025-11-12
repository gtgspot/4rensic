/**
 * Main Application Component
 *
 * Integrates all React components for forensic legal analysis
 * including timeline, cross-reference, and pattern insights.
 *
 * @version 2.1.0
 */

import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from './ErrorBoundary.jsx';
import { FileUploader } from './FileUploader.jsx';
import { AnalysisResults } from './AnalysisResults.jsx';
import { DefectTimeline } from './DefectTimeline.jsx';
import { CrossReferenceMatrix } from './CrossReferenceMatrix.jsx';
import { PatternInsights } from './PatternInsights.jsx';

export const App = ({ analyzer }) => {
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedPresets, setSelectedPresets] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('results'); // results, timeline, crossref, patterns

  // Load analysis history on mount
  useEffect(() => {
    loadHistoryAndPatterns();
  }, []);

  // Auto-update after analysis completion
  useEffect(() => {
    if (currentAnalysis) {
      updateAfterAnalysis();
    }
  }, [currentAnalysis]);

  const loadHistoryAndPatterns = async () => {
    try {
      const history = await analyzer.getHistory();
      setAnalysisHistory(history);

      const learnedPatterns = analyzer.getLearnedPatterns();
      setPatterns(learnedPatterns);

      console.log('✅ Loaded history and patterns:', {
        historyCount: history.length,
        patternsCount: learnedPatterns.length
      });
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const updateAfterAnalysis = async () => {
    console.log('🔄 Updating after analysis completion...');

    try {
      // Reload history
      const history = await analyzer.getHistory();
      setAnalysisHistory(history);

      // Reload patterns
      const learnedPatterns = analyzer.getLearnedPatterns();
      setPatterns(learnedPatterns);

      // Get current documents
      const status = analyzer.getStatus();
      setDocuments(analyzer.documents || []);

      console.log('✅ Analysis saved and system updated');
    } catch (error) {
      console.error('Error updating after analysis:', error);
    }
  };

  const handleFileProcessed = async (file) => {
    try {
      const result = await analyzer.processFile(file);
      setDocuments([...analyzer.documents]);
      console.log('✅ File processed:', result);
      return result;
    } catch (error) {
      console.error('Error processing file:', error);
      throw error;
    }
  };

  const handleAnalyze = async (documentText) => {
    setIsAnalyzing(true);

    try {
      const analysis = await analyzer.analyzeDocument(documentText, {
        presets: selectedPresets
      });

      setCurrentAnalysis(analysis);
      console.log('✅ Analysis complete');

      return analysis;
    } catch (error) {
      console.error('❌ Analysis error:', error);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExport = async (format) => {
    if (!currentAnalysis) return;

    try {
      await analyzer.exportAnalysis(format, `forensic-analysis-${Date.now()}.${format}`);
      console.log(`✅ Exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('❌ Export error:', error);
      alert(`Export failed: ${error.message}`);
    }
  };

  const handleClearData = async () => {
    if (confirm('Are you sure you want to clear all analysis data? This cannot be undone.')) {
      try {
        await analyzer.clearData();
        setCurrentAnalysis(null);
        setAnalysisHistory([]);
        setPatterns([]);
        setDocuments([]);
        console.log('✅ All data cleared');
      } catch (error) {
        console.error('Error clearing data:', error);
      }
    }
  };

  // Extract timeline data from current analysis
  const timelineData = currentAnalysis?.phases?.timeline || null;
  const allFindings = currentAnalysis?.phases?.presetAnalysis?.flatMap(p => p.findings || []) || [];

  // Extract cross-reference data
  const crossRefData = currentAnalysis?.phases?.crossReference || null;

  return (
    <div className="forensic-app">
      {/* Header Stats */}
      <div className="app-stats">
        <div className="stat-item">
          <div className="stat-label">Total Analyses</div>
          <div className="stat-value">{analysisHistory.length}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Documents Loaded</div>
          <div className="stat-value">{documents.length}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Patterns Detected</div>
          <div className="stat-value">{patterns.length}</div>
        </div>
        <div className="stat-item">
          <button onClick={handleClearData} className="clear-btn">
            🗑️ Clear Data
          </button>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="upload-section">
        <FileUploader
          onFileProcessed={handleFileProcessed}
          onAnalyze={handleAnalyze}
          selectedPresets={selectedPresets}
          onPresetsChange={setSelectedPresets}
          availablePresets={analyzer.getPresets()}
          isAnalyzing={isAnalyzing}
        />
      </div>

      {/* Tab Navigation */}
      {currentAnalysis && (
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            📊 Results
          </button>
          <button
            className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            📅 Timeline
          </button>
          <button
            className={`tab-btn ${activeTab === 'crossref' ? 'active' : ''}`}
            onClick={() => setActiveTab('crossref')}
          >
            🔗 Cross-Reference
          </button>
          <button
            className={`tab-btn ${activeTab === 'patterns' ? 'active' : ''}`}
            onClick={() => setActiveTab('patterns')}
          >
            🧠 Patterns
          </button>
        </div>
      )}

      {/* Content Area */}
      <div className="content-area">
        <ErrorBoundary key={activeTab}>
          {activeTab === 'results' && (
            <AnalysisResults
              analysis={currentAnalysis}
              onExport={handleExport}
            />
          )}

          {activeTab === 'timeline' && (
            <DefectTimeline
              timeline={timelineData}
              findings={allFindings}
            />
          )}

          {activeTab === 'crossref' && (
            <CrossReferenceMatrix
              crossRefData={crossRefData}
              documents={documents}
            />
          )}

          {activeTab === 'patterns' && (
            <PatternInsights
              patterns={patterns}
              analysisHistory={analysisHistory}
            />
          )}
        </ErrorBoundary>
      </div>

      <style jsx>{`
        .forensic-app {
          max-width: 1400px;
          margin: 0 auto;
        }

        .app-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .stat-item {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .stat-label {
          font-size: 13px;
          color: #718096;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #2d3748;
        }

        .clear-btn {
          width: 100%;
          padding: 12px;
          background: #f56565;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clear-btn:hover {
          background: #c53030;
          transform: translateY(-2px);
        }

        .upload-section {
          margin-bottom: 20px;
        }

        .tab-navigation {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          background: white;
          padding: 15px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .tab-btn {
          flex: 1;
          padding: 12px 20px;
          background: #f7fafc;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #4a5568;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab-btn:hover {
          background: #edf2f7;
          border-color: #cbd5e0;
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: #667eea;
        }

        .content-area {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          min-height: 400px;
        }

        @media (max-width: 768px) {
          .app-stats {
            grid-template-columns: 1fr;
          }

          .tab-navigation {
            flex-wrap: wrap;
          }

          .tab-btn {
            font-size: 12px;
            padding: 10px 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default App;
