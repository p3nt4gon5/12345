import React from 'react';
import { ArrowLeft, Construction, Lightbulb, Rocket, Settings } from 'lucide-react';

interface AdminEmptyPageProps {
  onBack: () => void;
}

const AdminEmptyPage: React.FC<AdminEmptyPageProps> = ({ onBack }) => {
  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 mr-4">
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Custom Admin Page</h2>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Construction className="text-white" size={48} />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Coming Soon</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            This space is reserved for future admin features and custom functionality. 
            Stay tuned for exciting updates!
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="text-blue-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Advanced Analytics</h3>
            <p className="text-gray-600 text-sm">
              Detailed insights and reporting tools for better decision making
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Rocket className="text-green-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Performance Tools</h3>
            <p className="text-gray-600 text-sm">
              Monitor and optimize your application's performance metrics
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Settings className="text-purple-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">System Configuration</h3>
            <p className="text-gray-600 text-sm">
              Advanced settings and configuration options for power users
            </p>
          </div>
        </div>

        {/* Placeholder Content */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Ideas Matter</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            This page is intentionally left blank for future customizations. 
            It could be used for custom reports, special admin tools, or any other 
            functionality specific to your needs.
          </p>
          
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <h3 className="font-semibold text-gray-800 mb-3">Potential Features:</h3>
            <ul className="text-left text-gray-600 space-y-2">
              <li>• Custom dashboard widgets</li>
              <li>• Advanced user analytics</li>
              <li>• System health monitoring</li>
              <li>• Bulk operations tools</li>
              <li>• Integration management</li>
              <li>• Custom reporting</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500">
          <p className="text-sm">
            This page was created as a placeholder for future admin functionality.
          </p>
          <p className="text-xs mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminEmptyPage;