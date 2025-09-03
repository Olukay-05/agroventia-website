'use client';

import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EnvironmentStatusProps {
  showDetails?: boolean;
}

const EnvironmentStatus: React.FC<EnvironmentStatusProps> = ({
  showDetails = false,
}) => {
  const [showEnvVars, setShowEnvVars] = React.useState(false);

  // Check environment variables
  const wixSiteId = process.env.NEXT_PUBLIC_WIX_SITE_ID;
  const wixApiKey = process.env.NEXT_PUBLIC_WIX_API_KEY;
  const nodeEnv = process.env.NODE_ENV;

  const envChecks = [
    {
      name: 'Node Environment',
      status: nodeEnv ? 'success' : 'warning',
      value: nodeEnv || 'not set',
      description: 'Current Node.js environment mode',
    },
    {
      name: 'Wix Site ID',
      status: wixSiteId ? 'success' : 'error',
      value: wixSiteId ? '***' + wixSiteId.slice(-4) : 'not configured',
      description: 'Wix Studio site identifier',
    },
    {
      name: 'Wix API Key',
      status: wixApiKey ? 'success' : 'error',
      value: wixApiKey ? '***' + wixApiKey.slice(-4) : 'not configured',
      description: 'Wix API authentication key',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'warning':
        return <AlertCircle size={16} className="text-yellow-600" />;
      case 'error':
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const overallStatus = envChecks.every(check => check.status === 'success')
    ? 'success'
    : envChecks.some(check => check.status === 'error')
      ? 'error'
      : 'warning';

  return (
    <div className={`p-4 rounded-lg border ${getStatusColor(overallStatus)}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {getStatusIcon(overallStatus)}
          <h3 className="font-semibold">Environment Status</h3>
        </div>

        {showDetails && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEnvVars(!showEnvVars)}
            className="flex items-center gap-2"
          >
            {showEnvVars ? <EyeOff size={14} /> : <Eye size={14} />}
            {showEnvVars ? 'Hide' : 'Show'} Details
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {envChecks.map((check, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(check.status)}
              <span className="font-medium text-sm">{check.name}</span>
            </div>
            <span className="text-sm text-gray-600">{check.value}</span>
          </div>
        ))}
      </div>

      {showDetails && showEnvVars && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium mb-2 text-sm">Environment Variables</h4>
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>NEXT_PUBLIC_WIX_SITE_ID:</strong>
                <pre className="bg-white p-2 rounded border mt-1 overflow-hidden">
                  {wixSiteId || 'undefined'}
                </pre>
              </div>
              <div>
                <strong>NEXT_PUBLIC_WIX_API_KEY:</strong>
                <pre className="bg-white p-2 rounded border mt-1 overflow-hidden">
                  {wixApiKey ? wixApiKey.slice(0, 8) + '...' : 'undefined'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {overallStatus === 'error' && (
        <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded text-sm">
          <strong>Configuration Required:</strong>
          <p className="mt-1">
            Please ensure your Wix environment variables are properly configured
            in your .env.local file for the CMS integration to work correctly.
          </p>
        </div>
      )}

      {overallStatus === 'warning' && (
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-200 rounded text-sm">
          <strong>Partial Configuration:</strong>
          <p className="mt-1">
            Some environment variables may need attention for optimal
            functionality.
          </p>
        </div>
      )}

      {overallStatus === 'success' && (
        <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded text-sm">
          <strong>Configuration Complete:</strong>
          <p className="mt-1">
            All environment variables are properly configured.
          </p>
        </div>
      )}
    </div>
  );
};

export default EnvironmentStatus;
