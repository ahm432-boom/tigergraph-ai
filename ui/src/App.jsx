import React, { useState } from 'react'
import GraphVisualizer from './components/GraphVisualizer'

function App() {
  const [caseData, setCaseData] = useState(null);

  // Mock case data for demonstration
  const loadMockCase = () => {
    setCaseData({
      case_id: "CASE-101",
      status: "CLOSED",
      verdict: "FRAUD",
      fraud_prob: 0.85,
      exposure: 500,
      pattern: "Card Testing",
      next_best_actions: {
        initial: [],
        final: [{"action": "BLOCK_CARD", "route": "L1_APPROVAL", "reason": "Standard block route."}]
      },
      evidence: {
        nodes: [
          { id: 'CUST-A', label: 'Customer A', group: 'customer' },
          { id: 'CARD-123', label: 'Card 123', group: 'card' },
          { id: 'TXN-1', label: '$4.50', group: 'transaction' },
          { id: 'TXN-2', label: '$2.00', group: 'transaction' },
          { id: 'TXN-3', label: '$550.00', group: 'transaction' },
        ],
        edges: [
          { from: 'CUST-A', to: 'CARD-123', label: 'OWNS' },
          { from: 'CARD-123', to: 'TXN-1', label: 'MADE' },
          { from: 'CARD-123', to: 'TXN-2', label: 'MADE' },
          { from: 'CARD-123', to: 'TXN-3', label: 'MADE' },
        ]
      }
    });
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 flex flex-col items-center">
      <header className="w-full max-w-6xl mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Agentic Fraud Investigation Dashboard</h1>
        <p className="text-gray-600 mt-2">TigerGraph Agentic Hackathon</p>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Panel: Case Details */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Case Summary</h2>
          
          {!caseData ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">No case selected.</p>
              <button 
                onClick={loadMockCase}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
              >
                Load Mock Case
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-500 block">Case ID</span>
                <span className="font-mono font-medium">{caseData.case_id}</span>
              </div>
              <div className="flex justify-between">
                <div>
                  <span className="text-sm text-gray-500 block">Verdict</span>
                  <span className={`font-bold ${caseData.verdict === 'FRAUD' ? 'text-red-600' : 'text-green-600'}`}>
                    {caseData.verdict} ({(caseData.fraud_prob * 100).toFixed(0)}%)
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Status</span>
                  <span className="font-medium text-gray-700">{caseData.status}</span>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500 block">Identified Pattern</span>
                <span className="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm mt-1">
                  {caseData.pattern}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500 block">Exposure</span>
                <span className="font-medium">${caseData.exposure.toFixed(2)}</span>
              </div>
              
              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Next Best Actions</h3>
                {caseData.next_best_actions.final.map((action, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded text-sm mb-2 border border-gray-100">
                    <div className="flex justify-between font-medium mb-1">
                      <span className="text-blue-700">{action.action}</span>
                      <span className="bg-gray-200 text-gray-600 px-2 rounded text-xs leading-5">
                        {action.route}
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs">{action.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Graph Visualization */}
        <div className="md:col-span-2 bg-white rounded-lg shadow border border-gray-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700">Evidence Graph Neighborhood</h2>
          </div>
          <div className="flex-1 min-h-[500px] relative">
            {caseData ? (
              <GraphVisualizer graphData={caseData.evidence} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Select a case to view graph evidence
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
