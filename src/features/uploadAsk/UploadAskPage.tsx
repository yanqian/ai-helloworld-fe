import { UploadForm } from './components/UploadForm';
import { DocumentList } from './components/DocumentList';
import { AskPanel } from './components/AskPanel';
import { AnswerCard } from './components/AnswerCard';
import { HistoryList } from './components/HistoryList';
import { useUploadAsk } from './hooks/useUploadAsk';

export const UploadAskPage = () => {
  const {
    documents,
    sessions,
    logs,
    isLoadingDocs,
    isUploading,
    isAsking,
    error,
    askError,
    answer,
    sources,
    latencyMs,
    sessionId,
    uploadDocument,
    askQuestion,
    refreshDocuments,
    selectSession,
  } = useUploadAsk();

  const processedDocs = documents.filter((doc) => doc.status === 'processed');

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1 space-y-4">
        <UploadForm onUpload={uploadDocument} isUploading={isUploading} error={error} />
        <DocumentList documents={documents} isLoading={isLoadingDocs} onRefresh={refreshDocuments} />
        <HistoryList
          logs={logs}
          sessions={sessions}
          selectedSessionId={sessionId}
          onSelectSession={selectSession}
        />
      </div>

      <div className="lg:col-span-2 space-y-4">
        <AskPanel
          onAsk={askQuestion}
          documents={processedDocs}
          isAsking={isAsking}
          error={askError}
        />
        <AnswerCard answer={answer} sources={sources} latencyMs={latencyMs} />
      </div>
    </div>
  );
};
