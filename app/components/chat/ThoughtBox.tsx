import { useState, type PropsWithChildren } from 'react';

const ThoughtBox = ({ title, children }: PropsWithChildren<{ title: string }>) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className={`
        bg-bolt-elements-background-depth-2
        shadow-md 
        rounded-lg 
        cursor-pointer 
        transition-all 
        duration-300
        ${isExpanded ? 'max-h-[500px]' : 'max-h-13'}
        overflow-auto
        border border-bolt-elements-borderColor
        my-4
      `}
    >
      <div className="p-4 flex items-center gap-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-bolt-elements-textSecondary font-medium leading-5 text-sm border border-bolt-elements-borderColor">
        <div className="i-ph:brain-thin text-2xl text-blue-500" />
        <div className="div">
          <span className="font-bold text-blue-500">{title}</span>{' '}
          {!isExpanded && <span className="text-bolt-elements-textTertiary"> - Click to expand</span>}
        </div>
      </div>
      <div
        className={`
        transition-opacity 
        duration-300
        p-4 
        rounded-lg 
        ${isExpanded ? 'opacity-100' : 'opacity-0'}
        font-mono text-sm
      `}
      >
        {children}
      </div>
    </div>
  );
};

export default ThoughtBox;
