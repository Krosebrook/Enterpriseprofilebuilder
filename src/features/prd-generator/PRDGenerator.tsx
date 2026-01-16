/**
 * PRD Generator Component
 * Main interface for generating Product Requirements Documents
 */

import React, { useState } from 'react';
import { prdGenerator } from '../../lib/prd/prdGenerator';
import { PRDDocument, formatPRDAsMarkdown } from '../../lib/prd/prdTemplate';
import { FileText, Download, Copy, RefreshCw, Loader2, Check } from 'lucide-react';

// Configuration constants
const MAX_FILENAME_LENGTH = 30;

interface GenerationProgress {
  currentSection: string;
  progress: number;
  completed: boolean;
}

export function PRDGenerator() {
  const [featureIdea, setFeatureIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [generatedPRD, setGeneratedPRD] = useState<PRDDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!featureIdea.trim()) {
      setError('Please enter a feature idea');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedPRD(null);
    setProgress({ currentSection: 'Starting...', progress: 0, completed: false });

    try {
      const prd = await prdGenerator.generatePRD(featureIdea, (p) => {
        setProgress(p);
      });
      
      setGeneratedPRD(prd);
      setProgress({ currentSection: 'Complete', progress: 100, completed: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate PRD');
      console.error('PRD Generation Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedPRD) return;

    const markdown = formatPRDAsMarkdown(generatedPRD);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Generate safe filename
    const sanitizedFeature = generatedPRD.featureIdea
      .substring(0, MAX_FILENAME_LENGTH)
      .replace(/[^a-z0-9]/gi, '-')
      .replace(/-+/g, '-') // Replace consecutive hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    
    a.download = `PRD-${sanitizedFeature || 'document'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!generatedPRD) return;

    const markdown = formatPRDAsMarkdown(generatedPRD);
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleReset = () => {
    setFeatureIdea('');
    setGeneratedPRD(null);
    setError(null);
    setProgress(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 bg-emerald-100 rounded-lg">
          <FileText className="w-8 h-8 text-emerald-600" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            PRD Generator
          </h1>
          <p className="text-gray-600">
            Generate comprehensive, production-grade Product Requirements Documents using AI.
            Simply describe your feature idea, and get a complete PRD with all 13 essential sections.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <label htmlFor="feature-idea" className="block text-sm font-medium text-gray-700 mb-2">
          Feature Idea
        </label>
        <textarea
          id="feature-idea"
          value={featureIdea}
          onChange={(e) => setFeatureIdea(e.target.value)}
          placeholder="Describe your feature or product idea here. For example: 'A real-time collaborative whiteboard for remote teams with drawing tools, sticky notes, and video chat integration.'"
          className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
          disabled={isGenerating}
        />
        
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="mt-4 flex gap-3">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !featureIdea.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Generate PRD
              </>
            )}
          </button>

          {generatedPRD && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              New PRD
            </button>
          )}
        </div>
      </div>

      {/* Progress Indicator */}
      {progress && isGenerating && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">
              {progress.currentSection}
            </span>
            <span className="text-sm text-gray-500">
              {progress.progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Generated PRD */}
      {generatedPRD && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Actions Bar */}
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Generated PRD</h2>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>

          {/* PRD Content Preview */}
          <div className="p-6">
            <PRDPreview prd={generatedPRD} />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * PRD Preview Component
 */
function PRDPreview({ prd }: { prd: PRDDocument }) {
  const sections = [
    { id: 'executiveSummary', title: '1. Executive Summary' },
    { id: 'problemStatement', title: '2. Problem Statement' },
    { id: 'targetAudience', title: '3. Target Audience / User Personas' },
    { id: 'functionalRequirements', title: '4. Functional Requirements' },
    { id: 'nonFunctionalRequirements', title: '5. Non-Functional Requirements' },
    { id: 'userStories', title: '6. User Stories & Acceptance Criteria' },
    { id: 'technicalArchitecture', title: '7. Technical Architecture Overview' },
    { id: 'apiDesign', title: '8. API Design' },
    { id: 'uiUxConsiderations', title: '9. UI/UX Considerations' },
    { id: 'securityCompliance', title: '10. Security & Compliance' },
    { id: 'testingStrategy', title: '11. Testing Strategy' },
    { id: 'deploymentPlan', title: '12. Deployment & DevOps Plan' },
    { id: 'risksAndAssumptions', title: '13. Assumptions, Risks & Open Questions' },
  ];

  return (
    <div className="space-y-6">
      {/* Metadata */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{prd.metadata.title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Feature:</span>
            <p className="font-medium text-gray-900">{prd.featureIdea}</p>
          </div>
          <div>
            <span className="text-gray-500">Version:</span>
            <p className="font-medium text-gray-900">{prd.metadata.version}</p>
          </div>
          <div>
            <span className="text-gray-500">Status:</span>
            <p className="font-medium text-gray-900">{prd.metadata.status}</p>
          </div>
          <div>
            <span className="text-gray-500">Created:</span>
            <p className="font-medium text-gray-900">
              {new Date(prd.metadata.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Sections */}
      {sections.map((section) => {
        const content = (prd.sections as any)[section.id];
        if (!content) return null;

        return (
          <div key={section.id} className="space-y-2">
            <h4 className="text-lg font-semibold text-gray-900">{section.title}</h4>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
              {content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
