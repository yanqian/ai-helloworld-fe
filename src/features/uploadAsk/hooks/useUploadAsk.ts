import { useCallback, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useServices } from '@/providers/ServiceProvider';
import { askQuestion, fetchDocuments, fetchSessions, fetchSessionLogs, uploadDocument } from '../api';
import { useUploadAskStore } from '../store';

export const useUploadAsk = () => {
  const { httpClient, apiBaseUrl } = useServices();
  const { token } = useAuth();
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
    setDocuments,
    setSessions,
    setLogs,
    setLoadingDocs,
    startUpload,
    failUpload,
    finishUpload,
    startAsk,
    failAsk,
    resolveAsk,
  } = useUploadAskStore();

  const refreshDocuments = useCallback(async () => {
    setLoadingDocs(true);
    try {
      const resp = await fetchDocuments(httpClient);
      setDocuments(resp.items ?? []);
    } catch (err) {
      failUpload((err as Error).message);
    }
  }, [failUpload, httpClient, setDocuments, setLoadingDocs]);

  const refreshSessions = useCallback(async () => {
    try {
      const resp = await fetchSessions(httpClient);
      setSessions(resp.sessions ?? []);
    } catch {
      // ignore session errors for now
    }
  }, [httpClient, setSessions]);

  const loadSessionLogs = useCallback(
    async (id: string) => {
      try {
        const resp = await fetchSessionLogs(httpClient, id);
        setLogs(resp.logs ?? []);
      } catch {
        // ignore log errors for now
      }
    },
    [httpClient, setLogs],
  );

  const handleUpload = useCallback(
    async (file: File, title?: string) => {
      if (!token) {
        failUpload('You must be signed in to upload.');
        return;
      }
      startUpload();
      try {
        await uploadDocument({ apiBaseUrl, token, file, title });
        await refreshDocuments();
      } catch (err) {
        failUpload((err as Error).message || 'Upload failed');
      } finally {
        finishUpload();
      }
    },
    [apiBaseUrl, failUpload, finishUpload, refreshDocuments, startUpload, token],
  );

  const handleAsk = useCallback(
    async (query: string, documentIds: string[]) => {
      startAsk();
      useUploadAskStore.setState({ currentQuery: query });
      try {
        const resp = await askQuestion(httpClient, {
          query,
          documentIds,
          sessionId,
        });
        resolveAsk(resp);
        if (resp.sessionId) {
          await refreshSessions();
          await loadSessionLogs(resp.sessionId);
        }
      } catch (err) {
        failAsk((err as Error).message || 'Request failed');
      }
    },
    [failAsk, httpClient, loadSessionLogs, refreshSessions, resolveAsk, sessionId, startAsk],
  );

  useEffect(() => {
    refreshDocuments();
    refreshSessions();
  }, [refreshDocuments, refreshSessions]);

  return {
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
    uploadDocument: handleUpload,
    askQuestion: handleAsk,
    refreshDocuments,
    refreshSessions,
    loadSessionLogs,
  };
};
