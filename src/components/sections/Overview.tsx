import { Shield, Zap, Users, Lock, CheckCircle, AlertTriangle } from 'lucide-react';

export function Overview() {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6">
        <h2 className="text-slate-900 mb-4">Welcome to INT Inc Claude Enterprise</h2>
        <p className="text-slate-700">
          This comprehensive guide provides everything you need to safely and effectively use Claude AI 
          across your role at INT Inc. From baseline security guidelines to advanced workflows, this 
          documentation ensures you maximize productivity while maintaining our SOC 2 Type II compliance standards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-amber-600" />
            <h3 className="text-slate-900">Security First</h3>
          </div>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Zero Data Retention (ZDR) enabled</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Role-based access controls (RBAC)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Comprehensive audit logging</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Prompt injection defense</span>
            </li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-amber-600" />
            <h3 className="text-slate-900">Powerful Features</h3>
          </div>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Real-time web search with citations</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Role-isolated memory (30-day expiry)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Code execution sandbox</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Artifacts for documents & code</span>
            </li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-amber-600" />
            <h3 className="text-slate-900">Role-Specific Profiles</h3>
          </div>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-amber-600">•</span>
              <span><strong>Finance:</strong> Budget analysis, forecasting, cost optimization</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600">•</span>
              <span><strong>Sales:</strong> RFP analysis, proposals, competitive intelligence</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600">•</span>
              <span><strong>Engineering:</strong> Code review, architecture, security analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600">•</span>
              <span><strong>Marketing:</strong> Content creation, campaign strategy, analytics</span>
            </li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-amber-600" />
            <h3 className="text-slate-900">Critical Guardrails</h3>
          </div>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <span>Never output customer PII or credentials</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <span>Escalate decisions &gt;$10K to humans</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <span>All code requires peer review</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <span>Flag uncertainty, never hallucinate</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-slate-900 mb-4">Quick Start Guide</h3>
        <ol className="space-y-3 text-slate-700">
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full flex-shrink-0">1</span>
            <span><strong>Identify your role</strong> (Finance, Sales, Engineering, Marketing, Ops, HR)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full flex-shrink-0">2</span>
            <span><strong>Review the Baseline Prompt</strong> to understand core security guidelines</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full flex-shrink-0">3</span>
            <span><strong>Explore Feature Guides</strong> (web search, memory, artifacts, code, files)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full flex-shrink-0">4</span>
            <span><strong>Read your Role Profile</strong> for specific capabilities and workflows</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full flex-shrink-0">5</span>
            <span><strong>Start asking questions</strong> and apply best practices from this guide</span>
          </li>
        </ol>
      </div>

      <div className="bg-slate-100 border border-slate-300 rounded-lg p-6">
        <h3 className="text-slate-900 mb-4">Document Structure</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700">
          <div>
            <p className="mb-2"><strong>Part 1: Baseline System Prompt</strong></p>
            <p className="text-slate-600">Universal guidelines for all INT Inc users</p>
          </div>
          <div>
            <p className="mb-2"><strong>Part 2: Feature Guides</strong></p>
            <p className="text-slate-600">Web Search, Memory, Artifacts, Code, Files</p>
          </div>
          <div>
            <p className="mb-2"><strong>Part 3: Tools & Connectors</strong></p>
            <p className="text-slate-600">MCP servers, integrations, and skills</p>
          </div>
          <div>
            <p className="mb-2"><strong>Part 4: Role-Specific Profiles</strong></p>
            <p className="text-slate-600">Tailored guidance for each department</p>
          </div>
          <div>
            <p className="mb-2"><strong>Part 5: Best Practices</strong></p>
            <p className="text-slate-600">Prompting, security, and workflow optimization</p>
          </div>
          <div>
            <p className="mb-2"><strong>Part 6: FAQ</strong></p>
            <p className="text-slate-600">20 questions from beginner to advanced</p>
          </div>
        </div>
      </div>

      <div className="border-l-4 border-amber-500 bg-amber-50 p-6 rounded-r-lg">
        <h3 className="text-slate-900 mb-2">Success Criteria</h3>
        <p className="text-slate-700 mb-4">By using Claude safely and effectively, you should:</p>
        <ul className="space-y-2 text-slate-700">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Complete daily tasks <strong>30% faster</strong> with human review gates</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Maintain <strong>zero security incidents</strong> from Claude misuse</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Generate <strong>higher-quality outputs</strong> grounded in research</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span><strong>Escalate decisions appropriately</strong> (not delegate to AI)</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
