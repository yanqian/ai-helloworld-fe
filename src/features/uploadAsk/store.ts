import { create } from 'zustand';
import type { AskResponse, UploadAskState, UploadDocument } from './types';

const initialState: UploadAskState = {
  documents: [],
  sessions: [],
  logs: [],
  isLoadingDocs: false,
  isUploading: false,
  isAsking: false,
};

export const useUploadAskStore = create<UploadAskState & {
  setDocuments: (docs: UploadDocument[]) => void;
  setSessions: (sessions: UploadAskState['sessions']) => void;
  setLogs: (logs: UploadAskState['logs']) => void;
  startUpload: () => void;
  failUpload: (message: string) => void;
  finishUpload: () => void;
  startAsk: () => void;
  failAsk: (message: string) => void;
  resolveAsk: (resp: AskResponse) => void;
  setLoadingDocs: (loading: boolean) => void;
}>((set) => ({
  ...initialState,
  setDocuments: (docs) =>
    set((state) => ({
      ...state,
      documents: docs,
      isLoadingDocs: false,
    })),
  setSessions: (sessions) =>
    set((state) => ({
      ...state,
      sessions,
    })),
  setLogs: (logs) =>
    set((state) => ({
      ...state,
      logs,
    })),
  startUpload: () =>
    set((state) => ({
      ...state,
      isUploading: true,
      error: undefined,
    })),
  failUpload: (message) =>
    set((state) => ({
      ...state,
      isUploading: false,
      error: message,
    })),
  finishUpload: () =>
    set((state) => ({
      ...state,
      isUploading: false,
      error: undefined,
    })),
  startAsk: () =>
    set((state) => ({
      ...state,
      isAsking: true,
      askError: undefined,
    })),
  failAsk: (message) =>
    set((state) => ({
      ...state,
      isAsking: false,
      askError: message,
    })),
  resolveAsk: (resp) =>
    set((state) => ({
      ...state,
      isAsking: false,
      askError: undefined,
      answer: resp.answer,
      sources: resp.sources ?? [],
      latencyMs: resp.latencyMs,
      sessionId: resp.sessionId,
      logs: [
        ...state.logs,
        {
          id: resp.sessionId,
          queryText: state.currentQuery ?? '',
          responseText: resp.answer,
          createdAt: new Date().toISOString(),
          latencyMs: resp.latencyMs,
          sources: resp.sources,
        },
      ],
    })),
  setLoadingDocs: (loading) =>
    set((state) => ({
      ...state,
      isLoadingDocs: loading,
    })),
}));
