import { useStore } from '@nanostores/react';
import { memo, useMemo, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import {
  CodeMirrorEditor,
  type EditorDocument,
  type EditorSettings,
  type OnChangeCallback as OnEditorChange,
  type OnSaveCallback as OnEditorSave,
  type OnScrollCallback as OnEditorScroll,
} from '~/components/editor/codemirror/CodeMirrorEditor';
import { PanelHeader } from '~/components/ui/PanelHeader';
import { PanelHeaderButton } from '~/components/ui/PanelHeaderButton';
import { Button } from '~/components/ui/Button';
import type { FileMap } from '~/lib/stores/files';
import type { FileHistory } from '~/types/actions';
import { themeStore } from '~/lib/stores/theme';
import { WORK_DIR } from '~/utils/constants';
import { renderLogger } from '~/utils/logger';
import { isMobile } from '~/utils/mobile';
import { FileBreadcrumb } from './FileBreadcrumb';
import { FileTree } from './FileTree';
import { DEFAULT_TERMINAL_SIZE, TerminalTabs } from './terminal/TerminalTabs';
import { workbenchStore } from '~/lib/stores/workbench';
import { CodeExplainer, ProjectContextExplainer, CodeQuickTips } from './code-explainer';
import { PromptBetterButton, PromptBetterPanel } from './prompt-better';

interface EditorPanelProps {
  files?: FileMap;
  unsavedFiles?: Set<string>;
  editorDocument?: EditorDocument;
  selectedFile?: string | undefined;
  isStreaming?: boolean;
  fileHistory?: Record<string, FileHistory>;
  onEditorChange?: OnEditorChange;
  onEditorScroll?: OnEditorScroll;
  onFileSelect?: (value?: string) => void;
  onFileSave?: OnEditorSave;
  onFileReset?: () => void;
}

const DEFAULT_EDITOR_SIZE = 100 - DEFAULT_TERMINAL_SIZE;

const editorSettings: EditorSettings = { tabSize: 2 };

export const EditorPanel = memo(
  ({
    files,
    unsavedFiles,
    editorDocument,
    selectedFile,
    isStreaming,
    fileHistory,
    onFileSelect,
    onEditorChange,
    onEditorScroll,
    onFileSave,
    onFileReset,
  }: EditorPanelProps) => {
    renderLogger.trace('EditorPanel');

    const theme = useStore(themeStore);
    const showTerminal = useStore(workbenchStore.showTerminal);

    const activeFileSegments = useMemo(() => {
      if (!editorDocument) {
        return undefined;
      }

      return editorDocument.filePath.split('/');
    }, [editorDocument]);

    const activeFileUnsaved = useMemo(() => {
      return editorDocument !== undefined && unsavedFiles?.has(editorDocument.filePath);
    }, [editorDocument, unsavedFiles]);

    const [showExplainer, setShowExplainer] = useState(false);
  const [showQuickTips, setShowQuickTips] = useState(false);
    const [showProjectContext, setShowProjectContext] = useState(false);

    return (
      <PanelGroup direction="vertical">
        <Panel defaultSize={showTerminal ? DEFAULT_EDITOR_SIZE : 100} minSize={20}>
          <PanelGroup direction="horizontal">
            <Panel defaultSize={20} minSize={10} collapsible>
              <div className="flex flex-col border-r border-bolt-elements-borderColor h-full">
                <PanelHeader>
                  <div className="i-ph:tree-structure-duotone shrink-0" />
                  Files
                </PanelHeader>
                <FileTree
                  className="h-full"
                  files={files}
                  hideRoot
                  unsavedFiles={unsavedFiles}
                  fileHistory={fileHistory}
                  rootFolder={WORK_DIR}
                  selectedFile={selectedFile}
                  onFileSelect={onFileSelect}
                />
              </div>
            </Panel>
            <PanelResizeHandle />
            <Panel className="flex flex-col" defaultSize={80} minSize={20}>
              <PanelHeader className="overflow-x-auto">
                {activeFileSegments?.length && (
                  <div className="flex items-center flex-1 text-sm">
                    <FileBreadcrumb pathSegments={activeFileSegments} files={files} onFileSelect={onFileSelect} />
                    {activeFileUnsaved && (
                      <div className="flex gap-1 ml-auto -mr-1.5">
                        <PanelHeaderButton onClick={onFileSave}>
                          <div className="i-ph:floppy-disk-duotone" />
                          Save
                        </PanelHeaderButton>
                        <PanelHeaderButton onClick={onFileReset}>
                          <div className="i-ph:clock-counter-clockwise-duotone" />
                          Reset
                        </PanelHeaderButton>
                      </div>
                    )}
                  </div>
                )}
              </PanelHeader>
              <div className="h-full flex-1 overflow-hidden relative">
                <div className="absolute top-2 right-2 z-10 flex gap-2">
                  {/* Project Context button commented out
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowProjectContext(prev => !prev)}
                    title="Project Context"
                    className="bg-bolt-elements-background-depth-1 shadow-sm border border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-2"
                  >
                    <div className="i-ph:map-trifold text-purple-500" />
                  </Button>
                  */}
                  <PromptBetterButton title="PromptBetter - Learn to communicate with AI" />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowQuickTips(prev => !prev)}
                    title="Quick tips about this code"
                    className="bg-bolt-elements-background-depth-1 shadow-sm border border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-2"
                  >
                    <div className="i-ph:lightbulb-filament text-amber-500" />
                  </Button>
                </div>
                <CodeMirrorEditor
                  theme={theme}
                  editable={!isStreaming && editorDocument !== undefined}
                  settings={editorSettings}
                  doc={editorDocument}
                  autoFocusOnDocumentChange={!isMobile()}
                  onScroll={onEditorScroll}
                  onChange={onEditorChange}
                  onSave={onFileSave}
                />
                <CodeExplainer
                  filePath={editorDocument?.filePath}
                  isVisible={showExplainer}
                  onClose={() => setShowExplainer(false)}
                />
                <ProjectContextExplainer
                  filePath={editorDocument?.filePath}
                  isVisible={showProjectContext}
                  onClose={() => setShowProjectContext(false)}
                />
                <CodeQuickTips
                  filePath={editorDocument?.filePath}
                  isVisible={showQuickTips}
                  onClose={() => setShowQuickTips(false)}
                />
              </div>
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle />
        <TerminalTabs />
      </PanelGroup>
    );
  },
);
