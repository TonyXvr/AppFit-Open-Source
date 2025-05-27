import { json, type MetaFunction } from '@remix-run/cloudflare';
import { useNavigate } from '@remix-run/react';
import { Header } from '~/components/header/Header';
import BackgroundRays from '~/components/ui/BackgroundRays';
import { Button } from '~/components/ui/Button';
import { motion } from 'framer-motion';

export const meta: MetaFunction = () => {
  return [
    { title: 'Flow Map Choice - AppFit' },
    { name: 'description', content: 'Choose your design approach' }
  ];
};

export const loader = () => json({});

export default function FlowMapChoice() {
  const navigate = useNavigate();

  const handleFlowMapClick = () => {
    navigate('/flow-map');
  };

  const handleUIPreviewClick = () => {
    // This will be implemented later
    navigate('/ui-preview-flow');
  };

  return (
    <div className="flex flex-col h-full w-full bg-bolt-elements-background-depth-1">
      <BackgroundRays />
      <Header />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-bolt-elements-textPrimary mb-4">
              Choose Your Design Approach
            </h1>
            <p className="text-lg text-bolt-elements-textSecondary max-w-2xl mx-auto">
              Select how you want to design your project
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Flow Map Option */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-bolt-elements-background-depth-2 rounded-xl p-6 border border-bolt-elements-borderColor hover:border-purple-500/30 transition-all duration-300 flex flex-col"
            >
              <div className="flex-1">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <div className="i-ph:map-trifold text-3xl text-purple-500" />
                </div>
                <h2 className="text-xl font-semibold text-bolt-elements-textPrimary mb-3 text-center">
                  Flow Map Builder
                </h2>
                <p className="text-bolt-elements-textSecondary mb-6 text-center">
                  Build your project step by step with our guided flow map process. Define layout, design system, and functionality.
                </p>
              </div>
              <Button
                onClick={handleFlowMapClick}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white"
              >
                Use Flow Map Builder
              </Button>
            </motion.div>

            {/* UI Preview Option */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-bolt-elements-background-depth-2 rounded-xl p-6 border border-bolt-elements-borderColor hover:border-blue-500/30 transition-all duration-300 flex flex-col"
            >
              <div className="flex-1">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <div className="i-ph:image text-3xl text-blue-500" />
                </div>
                <h2 className="text-xl font-semibold text-bolt-elements-textPrimary mb-3 text-center">
                  UI Preview Flow
                </h2>
                <p className="text-bolt-elements-textSecondary mb-6 text-center">
                  Generate visual UI previews and choose from different design concepts before proceeding to implementation.
                </p>
              </div>
              <Button
                onClick={handleUIPreviewClick}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                Use UI Preview Flow
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
