import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Badge } from './ui/badge';
import { GitCommit, TrendingUp, Calendar, Target, Lightbulb, Users, Plus, ChevronDown, ChevronUp, X, DollarSign, Globe, AlertTriangle, BarChart3, TrendingDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area } from 'recharts';

export function ProductPage() {
  const navigate = useNavigate();
  const [linkedInInputs, setLinkedInInputs] = useState<{ id: number; value: string }[]>([]);
  const [showLinkedInSection, setShowLinkedInSection] = useState(false);
  const [companyUrl, setCompanyUrl] = useState('');
  const [showCompanyInput, setShowCompanyInput] = useState(false);
  const [nextId, setNextId] = useState(0);
  
  // Mock data flag - set to false to show "Not enough information"
  const hasDeploymentData = true;
  
  // Mock deployment and revenue data
  const deploymentData = [
    { year: '2020', actual: 8.5, potential: 12.0, revenue: 6.2 },
    { year: '2021', actual: 11.2, potential: 14.5, revenue: 8.8 },
    { year: '2022', actual: 14.8, potential: 16.8, revenue: 11.5 },
    { year: '2023', actual: 17.2, potential: 18.0, revenue: 15.1 },
    { year: '2024', actual: 18.0, potential: 18.0, revenue: 17.3 },
  ];

  const handleStartAnalysis = () => {
    navigate('/analysis');
  };

  const addLinkedInInput = () => {
    setLinkedInInputs([...linkedInInputs, { id: nextId, value: '' }]);
    setNextId(nextId + 1);
    setShowLinkedInSection(true);
  };

  const removeLinkedInInput = (id: number) => {
    const newInputs = linkedInInputs.filter(input => input.id !== id);
    setLinkedInInputs(newInputs);
    if (newInputs.length === 0) {
      setShowLinkedInSection(false);
    }
  };

  const updateLinkedInInput = (id: number, value: string) => {
    setLinkedInInputs(linkedInInputs.map(input => 
      input.id === id ? { ...input, value } : input
    ));
  };

  const toggleCompanyInput = () => {
    setShowCompanyInput(!showCompanyInput);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Analyze New Repository Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
          <h2 className="text-gray-900 mb-2">Analyze GitHub Repository</h2>
          <p className="text-gray-600 mb-6">Enter a GitHub repository URL to start a comprehensive analysis</p>

          <div>
            <input
              type="text"
              placeholder="https://github.com/username/repository"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent mb-2"
            />
            
            {/* Add LinkedIn Input Button */}
            <button
              onClick={addLinkedInInput}
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-2 transition-colors"
            >
              <Plus size={16} />
              <span>Add contributor LinkedIn URL</span>
            </button>

            {/* LinkedIn Inputs Section */}
            {showLinkedInSection && (
              <div className="mb-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                {linkedInInputs.map((input) => (
                  <div key={input.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="https://linkedin.com/in/username"
                      value={input.value}
                      onChange={(e) => updateLinkedInInput(input.id, e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                    />
                    <button
                      onClick={() => removeLinkedInInput(input.id)}
                      className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove LinkedIn URL"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Company URL Button */}
            <button
              onClick={toggleCompanyInput}
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4 transition-colors"
            >
              <Plus size={16} />
              <span>Add company URL</span>
            </button>

            {/* Company URL Input Section */}
            {showCompanyInput && (
              <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <input
                  type="text"
                  placeholder="https://company.com"
                  value={companyUrl}
                  onChange={(e) => setCompanyUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                />
              </div>
            )}

            <button 
              onClick={handleStartAnalysis}
              className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Start Analysis
            </button>
          </div>
        </div>

        {/* Top Contributors Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-gray-900 mb-2">Top Contributors - facebook/react</h2>
              <p className="text-gray-600">Key contributors with git history and consistency analysis</p>
            </div>
            <button className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
              <Plus size={18} />
              <span>Add Contributors GitHubs</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Contributor 1 */}
            <div className="border border-gray-200 rounded-lg p-6 hover:border-orange-200 transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white">
                  DS
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">Dan Abramov</h3>
                  <p className="text-gray-500">@gaearon</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <GitCommit size={16} className="text-orange-600" />
                  <span>2,847 commits</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} className="text-orange-600" />
                  <span>Active since 2015</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <TrendingUp size={16} className="text-orange-600" />
                  <span>High consistency - Daily commits</span>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Consistency Score</span>
                  <span className="text-gray-900">95%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '95%' }}></div>
                </div>
              </div>

              <p className="text-gray-600">
                Core maintainer with consistent contributions. Focuses primarily on core features, hooks implementation, and documentation. Shows excellent commit message quality and code review participation.
              </p>
            </div>

            {/* Contributor 2 */}
            <div className="border border-gray-200 rounded-lg p-6 hover:border-orange-200 transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white">
                  SF
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">Sophie Alpert</h3>
                  <p className="text-gray-500">@sophiebits</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <GitCommit size={16} className="text-orange-600" />
                  <span>1,923 commits</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} className="text-orange-600" />
                  <span>Active since 2014</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <TrendingUp size={16} className="text-orange-600" />
                  <span>Moderate consistency - Weekly commits</span>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Consistency Score</span>
                  <span className="text-gray-900">78%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500" style={{ width: '78%' }}></div>
                </div>
              </div>

              <p className="text-gray-600">
                Former engineering manager with deep knowledge of React internals. Specializes in performance optimizations and reconciliation algorithm. Periodic contributions with high impact changes.
              </p>
            </div>

            {/* Contributor 3 */}
            <div className="border border-gray-200 rounded-lg p-6 hover:border-orange-200 transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white">
                  BC
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">Brian Vaughn</h3>
                  <p className="text-gray-500">@bvaughn</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <GitCommit size={16} className="text-orange-600" />
                  <span>1,654 commits</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} className="text-orange-600" />
                  <span>Active since 2016</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <TrendingUp size={16} className="text-orange-600" />
                  <span>High consistency - Multiple commits weekly</span>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Consistency Score</span>
                  <span className="text-gray-900">88%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '88%' }}></div>
                </div>
              </div>

              <p className="text-gray-600">
                Created React DevTools and profiler. Regular contributor with focus on developer experience and debugging tools. Maintains consistent commit patterns with detailed documentation.
              </p>
            </div>

            {/* Contributor 4 */}
            <div className="border border-gray-200 rounded-lg p-6 hover:border-orange-200 transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white">
                  AC
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">Andrew Clark</h3>
                  <p className="text-gray-500">@acdlite</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <GitCommit size={16} className="text-orange-600" />
                  <span>3,156 commits</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} className="text-orange-600" />
                  <span>Active since 2016</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <TrendingUp size={16} className="text-orange-600" />
                  <span>Very high consistency - Daily commits</span>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Consistency Score</span>
                  <span className="text-gray-900">97%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '97%' }}></div>
                </div>
              </div>

              <p className="text-gray-600">
                Lead developer on concurrent React and Suspense features. Most active current contributor with exceptional consistency. Focuses on scheduler, fiber architecture, and experimental features.
              </p>
            </div>
          </div>
        </div>

        {/* Project Overview & Market Reach Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
          <h2 className="text-gray-900 mb-2">Project Overview & Market Reach</h2>
          <p className="text-gray-600 mb-6">Understanding the project's purpose and user base</p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Project Idea */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Lightbulb className="text-orange-600" size={20} />
                </div>
                <h3 className="text-gray-900">Project Idea</h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets developers compose complex UIs from small, isolated pieces of code called "components."
              </p>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2"></div>
                  <p className="text-gray-600">Component-based architecture for reusable UI elements</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2"></div>
                  <p className="text-gray-600">Virtual DOM for optimal rendering performance</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2"></div>
                  <p className="text-gray-600">Unidirectional data flow for predictable state management</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2"></div>
                  <p className="text-gray-600">Rich ecosystem with hooks, context, and concurrent features</p>
                </div>
              </div>
            </div>

            {/* Target Market */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="text-orange-600" size={20} />
                </div>
                <h3 className="text-gray-900">Target Market Reached</h3>
              </div>

              <div className="space-y-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="text-orange-600" size={16} />
                    <span className="text-gray-900">Global Developer Community</span>
                  </div>
                  <p className="text-gray-600">Over 13 million developers worldwide use React for web and mobile development</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 mb-3">Major Companies Using React:</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-white text-gray-700 hover:bg-white border border-gray-200">Meta/Facebook</Badge>
                    <Badge className="bg-white text-gray-700 hover:bg-white border border-gray-200">Netflix</Badge>
                    <Badge className="bg-white text-gray-700 hover:bg-white border border-gray-200">Airbnb</Badge>
                    <Badge className="bg-white text-gray-700 hover:bg-white border border-gray-200">Instagram</Badge>
                    <Badge className="bg-white text-gray-700 hover:bg-white border border-gray-200">Uber</Badge>
                    <Badge className="bg-white text-gray-700 hover:bg-white border border-gray-200">Discord</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <p className="text-orange-600">223k+</p>
                    <p className="text-gray-600">GitHub Stars</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <p className="text-orange-600">15M+</p>
                    <p className="text-gray-600">Weekly NPM Downloads</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Market Insight Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
          <h2 className="text-gray-900 mb-2">Market Insight</h2>
          <p className="text-gray-600 mb-6">Market sizing, metrics, and risk assessment</p>

          {/* Market Sizing - TAM, SAM, SOM */}
          <div className="mb-8">
            <h3 className="text-gray-900 mb-4">Market Sizing Potential</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {/* TAM */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Globe className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h4 className="text-gray-900">TAM</h4>
                    <p className="text-gray-500">Total Addressable Market</p>
                  </div>
                </div>
                <p className="text-gray-900 mb-2">$180B</p>
                <p className="text-gray-600">Global web development market size including all frontend frameworks and libraries</p>
              </div>

              {/* SAM */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Target className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <h4 className="text-gray-900">SAM</h4>
                    <p className="text-gray-500">Serviceable Addressable Market</p>
                  </div>
                </div>
                <p className="text-gray-900 mb-2">$48B</p>
                <p className="text-gray-600">Component-based framework market segment accessible to React</p>
              </div>

              {/* SOM */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-green-600" size={20} />
                  </div>
                  <div>
                    <h4 className="text-gray-900">SOM</h4>
                    <p className="text-gray-500">Serviceable Obtainable Market</p>
                  </div>
                </div>
                <p className="text-gray-900 mb-2">$18B</p>
                <p className="text-gray-600">Current market share based on adoption rates and competitive positioning</p>
              </div>
            </div>
          </div>

          {/* Key Market Metrics */}
          <div className="mb-8">
            <h3 className="text-gray-900 mb-4">Key Market Metrics</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="text-orange-600" size={20} />
                  <h4 className="text-gray-900">Market Growth Rate</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">YoY Growth</span>
                      <span className="text-green-600">+23%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '23%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Developer Adoption Rate</span>
                      <span className="text-orange-600">+35%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-600" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Enterprise Adoption</span>
                      <span className="text-blue-600">+18%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '18%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="text-orange-600" size={20} />
                  <h4 className="text-gray-900">Market Trends</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2"></div>
                    <p className="text-gray-600">Increasing demand for component-based architecture</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2"></div>
                    <p className="text-gray-600">Strong growth in React Native for mobile development</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2"></div>
                    <p className="text-gray-600">Enterprise migration from legacy frameworks accelerating</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2"></div>
                    <p className="text-gray-600">Rising competition from newer frameworks (Vue, Svelte)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Variables */}
          <div>
            <h3 className="text-gray-900 mb-4">Potential Risk Variables</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-red-600 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="text-gray-900 mb-1">Technical Complexity</h4>
                    <p className="text-gray-600">Steep learning curve may limit adoption among junior developers</p>
                    <div className="mt-2">
                      <Badge className="bg-red-600 text-white hover:bg-red-600">High Risk</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-yellow-600 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="text-gray-900 mb-1">Competitive Pressure</h4>
                    <p className="text-gray-600">Emerging frameworks offering simpler alternatives and better performance</p>
                    <div className="mt-2">
                      <Badge className="bg-yellow-600 text-white hover:bg-yellow-600">Medium Risk</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-yellow-600 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="text-gray-900 mb-1">Ecosystem Fragmentation</h4>
                    <p className="text-gray-600">Multiple state management solutions and patterns creating confusion</p>
                    <div className="mt-2">
                      <Badge className="bg-yellow-600 text-white hover:bg-yellow-600">Medium Risk</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-orange-200 bg-orange-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-orange-600 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="text-gray-900 mb-1">Breaking Changes</h4>
                    <p className="text-gray-600">Major version updates requiring significant migration efforts</p>
                    <div className="mt-2">
                      <Badge className="bg-orange-600 text-white hover:bg-orange-600">Medium Risk</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-green-600 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="text-gray-900 mb-1">Corporate Dependency</h4>
                    <p className="text-gray-600">Meta/Facebook ownership - strategic changes could impact direction</p>
                    <div className="mt-2">
                      <Badge className="bg-green-600 text-white hover:bg-green-600">Low Risk</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-green-600 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="text-gray-900 mb-1">Performance Concerns</h4>
                    <p className="text-gray-600">Bundle size and runtime overhead compared to lightweight alternatives</p>
                    <div className="mt-2">
                      <Badge className="bg-green-600 text-white hover:bg-green-600">Low Risk</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deployment & Revenue Performance */}
          <div className="mt-8">
            <h3 className="text-gray-900 mb-4">Deployment & Revenue Performance</h3>
            <div className="border border-gray-200 rounded-lg p-6">
              {hasDeploymentData ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-gray-900 mb-1">Market Capture vs Potential</h4>
                      <p className="text-gray-600">Actual deployment and revenue compared to market sizing potential (in billions USD)</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                        <span className="text-gray-600">Actual Market Share</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        <span className="text-gray-600">Market Potential (SOM)</span>
                      </div>
                    </div>
                  </div>
                  
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={deploymentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="year" 
                        stroke="#6b7280"
                        style={{ fontSize: '14px' }}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        style={{ fontSize: '14px' }}
                        label={{ value: 'Market Value ($B)', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          padding: '12px'
                        }}
                        formatter={(value: number) => `$${value}B`}
                      />
                      <Legend 
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="circle"
                      />
                      <Bar 
                        dataKey="potential" 
                        fill="#d1d5db" 
                        radius={[4, 4, 0, 0]}
                        name="Market Potential (SOM)"
                      />
                      <Bar 
                        dataKey="actual" 
                        fill="#ea580c" 
                        radius={[4, 4, 0, 0]}
                        name="Actual Market Share"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#059669" 
                        strokeWidth={3}
                        dot={{ fill: '#059669', r: 5 }}
                        name="Revenue Generated"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>

                  <div className="grid md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="text-orange-600" size={20} />
                        <h5 className="text-gray-900">Market Capture Rate</h5>
                      </div>
                      <p className="text-orange-600 mb-1">100%</p>
                      <p className="text-gray-600">Reached full SOM potential in 2024</p>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="text-green-600" size={20} />
                        <h5 className="text-gray-900">Revenue Growth</h5>
                      </div>
                      <p className="text-green-600 mb-1">+179%</p>
                      <p className="text-gray-600">Since 2020 baseline</p>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="text-blue-600" size={20} />
                        <h5 className="text-gray-900">Growth Trajectory</h5>
                      </div>
                      <p className="text-blue-600 mb-1">Strong</p>
                      <p className="text-gray-600">Consistent year-over-year expansion</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <BarChart3 className="text-gray-400" size={32} />
                  </div>
                  <h4 className="text-gray-900 mb-2">Not Enough Information</h4>
                  <p className="text-gray-600 text-center max-w-md">
                    Deployment and revenue data is not available for this repository. Additional company information or financial data is needed to generate this analysis.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Analyses Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <h2 className="text-gray-900 mb-2">Recent Analyses</h2>
          <p className="text-gray-600 mb-6">Your repository analysis history</p>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600">Repository</th>
                  <th className="text-left py-3 px-4 text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-gray-600">Code Quality</th>
                  <th className="text-left py-3 px-4 text-gray-600">Health Score</th>
                  <th className="text-left py-3 px-4 text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Row 1 */}
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-gray-900">facebook/react</p>
                      <p className="text-gray-500">https://github.com/facebook/react</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Complete</Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-900">92/100</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Excellent</Badge>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-gray-600">Oct 24, 2025, 12:29 AM</p>
                  </td>
                  <td className="py-4 px-4">
                    <button 
                      onClick={() => navigate('/analysis')}
                      className="text-orange-600 hover:text-orange-700"
                    >
                      View Report
                    </button>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-gray-900">vercel/next.js</p>
                      <p className="text-gray-500">https://github.com/vercel/next.js</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Analyzing</Badge>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-400">-</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-400">-</span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-gray-600">Oct 26, 2025, 12:19 AM</p>
                  </td>
                  <td className="py-4 px-4">
                    <button className="text-orange-600 hover:text-orange-700">
                      View Progress
                    </button>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-gray-900">tensorflow/tensorflow</p>
                      <p className="text-gray-500">https://github.com/tensorflow/tensorflow</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Complete</Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-900">68/100</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Good</Badge>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-gray-600">Oct 19, 2025, 12:29 AM</p>
                  </td>
                  <td className="py-4 px-4">
                    <button 
                      onClick={() => navigate('/analysis')}
                      className="text-orange-600 hover:text-orange-700"
                    >
                      View Report
                    </button>
                  </td>
                </tr>

                {/* Row 4 */}
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-gray-900">microsoft/vscode</p>
                      <p className="text-gray-500">https://github.com/microsoft/vscode</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Complete</Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-900">85/100</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Excellent</Badge>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-gray-600">Oct 15, 2025, 3:45 PM</p>
                  </td>
                  <td className="py-4 px-4">
                    <button 
                      onClick={() => navigate('/analysis')}
                      className="text-orange-600 hover:text-orange-700"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
