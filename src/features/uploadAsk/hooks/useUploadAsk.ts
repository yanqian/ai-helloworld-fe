import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useServices } from '@/providers/ServiceProvider';
import { askQuestion, fetchDocuments, fetchSessions, fetchSessionLogs, uploadDocument } from '../api';
import { useUploadAskStore } from '../store';

export const useUploadAsk = () => {
  const { httpClient, apiBaseUrl } = useServices();
  const { token } = useAuth();
  const logRequestSeq = useRef(0);
  const {
    documents,
    sessions,
    logs,
    isLoadingDocs,
    isUploading,
    isAsking,
    error,
    askError,
    historyError,
    answer,
    sources,
    latencyMs,
    sessionId,
    selectSession,
    setHistoryError,
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
      setHistoryError(undefined);
    } catch (err) {
      setHistoryError((err as Error)?.message || 'Unable to load sessions');
    }
  }, [httpClient, setHistoryError, setSessions]);

  const loadSessionLogs = useCallback(
    async (id: string) => {
      const requestId = ++logRequestSeq.current;
      try {
        const resp = await fetchSessionLogs(httpClient, id);
        if (requestId === logRequestSeq.current) {
          setHistoryError(undefined);
          setLogs(resp.logs ?? []);
        }
      } catch (err) {
        if (requestId === logRequestSeq.current) {
          setHistoryError((err as Error)?.message || 'Unable to load session history');
        }
      }
    },
    [httpClient, setHistoryError, setLogs],
  );

  const handleSelectSession = useCallback(
    async (id?: string) => {
      logRequestSeq.current += 1;
      selectSession(id);
      setHistoryError(undefined);
      if (id) {
        await loadSessionLogs(id);
      } else {
        setLogs([]);
      }
    },
    [loadSessionLogs, selectSession, setHistoryError, setLogs],
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
          await handleSelectSession(resp.sessionId);
        }
      } catch (err) {
        failAsk((err as Error).message || 'Request failed');
      }
    },
    [failAsk, handleSelectSession, httpClient, refreshSessions, resolveAsk, sessionId, startAsk],
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
    historyError,
    answer,
    sources,
    latencyMs,
    sessionId,
    selectSession: handleSelectSession,
    uploadDocument: handleUpload,
    askQuestion: handleAsk,
    refreshDocuments,
    refreshSessions,
    loadSessionLogs,
  };
};
