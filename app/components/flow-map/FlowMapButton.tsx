import React from 'react';
import { useNavigate } from '@remix-run/react';
import { motion } from 'framer-motion';
import { Button } from '~/components/ui/Button';
import { classNames } from '~/utils/classNames';

interface FlowMapButtonProps {
  className?: string;
}

export const FlowMapButton: React.FC<FlowMapButtonProps> = ({ className }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/flow-map-choice');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.3 }}
      className={classNames("mt-4 w-full flex justify-center", className)}
    >
      <Button
        onClick={handleClick}
        className="font-sans px-6 py-3 bg-white/10 backdrop-blur-sm border-t border-l border-white/30 border-b border-r border-black/20 shadow-[0_5px_15px_rgba(0,0,0,0.3),0_0_15px_rgba(59,130,246,0.5)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] active:translate-y-px text-black rounded-md hover:bg-white/20 ring-1 ring-blue-500/50 transition-all duration-150 flex items-center gap-2"
      >
        <div className="i-ph:map-trifold text-lg" />
        Begin your Journey with our Flow Map
      </Button>
    </motion.div>
  );
};

export default FlowMapButton;
