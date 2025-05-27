import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
// @ts-ignore
import { HeaderActionButtons } from './HeaderActionButtons.client';
// @ts-ignore
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
// @ts-ignore
import { AuthButtons } from './AuthButtons.client';
import WithTooltip from '~/components/ui/Tooltip';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import surveyStyles from './SurveyButton.module.scss';

export function Header() {
  const chat = useStore(chatStore);

  return (
    <TooltipPrimitive.Provider delayDuration={300}>
      <header
        className={classNames('flex items-center p-5 border-b h-[var(--header-height)]', {
          'border-transparent': !chat.started,
          'border-bolt-elements-borderColor': chat.started,
        })}
      >
      <div className="flex items-center gap-2 z-logo text-bolt-elements-textPrimary cursor-pointer">
        <div className="i-ph:sidebar-simple-duotone text-xl" />
        <a href="/" className="text-2xl font-semibold text-accent flex items-center">
          <div className="flex items-center">
            {/* <img src="/logo.svg" alt="AppFit logo" className="w-[30px] h-[30px] mr-2" /> */}
            <span className="font-bold text-xl">AppFit</span>
          </div>
        </a>
      </div>

      {/* Survey link and Auth buttons */}
      <div className="flex-1 flex justify-end mr-4 items-center gap-4">
        <WithTooltip
          tooltip="Help us improve AppFit by sharing your feedback!"
          position="bottom"
          delay={300}
        >
          <a
            href="https://forms.gle/WffJcLHbv2kMJDte9"
            target="_blank"
            rel="noopener noreferrer"
            className={classNames(
              "px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-md font-medium shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2 text-sm",
              surveyStyles.surveyButton
            )}
          >
            <span className={classNames("i-ph:star-fill text-yellow-300 text-lg", surveyStyles.starIcon)}></span>
            <span>Take Survey</span>
          </a>
        </WithTooltip>
        <ClientOnly>
          {() => <AuthButtons />}
        </ClientOnly>
      </div>
      {chat.started && ( // Display ChatDescription and HeaderActionButtons only when the chat has started.
        <>
          <span className="flex-1 px-4 truncate text-center text-bolt-elements-textPrimary">
            <ClientOnly>{() => <ChatDescription />}</ClientOnly>
          </span>
          <ClientOnly>
            {() => (
              <div className="mr-1">
                <HeaderActionButtons />
              </div>
            )}
          </ClientOnly>
        </>
      )}
    </header>
    </TooltipPrimitive.Provider>
  );
}
