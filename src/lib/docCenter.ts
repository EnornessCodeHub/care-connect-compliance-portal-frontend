export type DocFolder = {
  id: string;
  name: string;
  parentId: string | null;
  childFolderIds: string[];
  fileIds: string[];
  shared: { 
    internal: string[]; 
    external: string[]; 
    publicToken?: string; // Unique token for public access
    publicUrl?: string; // Generated public URL
  };
  createdAt: string;
};

export type DocFile = {
  id: string;
  name: string;
  folderId: string;
  size: number;
  createdAt: string;
  content?: string; // Base64 data URL or file content
  type?: string; // MIME type
  publicToken?: string; // Unique token for public access
  publicUrl?: string; // Generated public URL
};

export type DocState = {
  folders: Record<string, DocFolder>;
  files: Record<string, DocFile>;
  rootFolderIds: string[];
};

const STORAGE_KEY = "cc_doc_center";

export function loadDocState(): DocState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as DocState;
  } catch {}

  // initialize with one sample folder
  const folderId = `f_${Date.now()}`;
  const initial: DocState = {
    folders: {
      [folderId]: {
        id: folderId,
        name: "NDIS Core Module",
        parentId: null,
        childFolderIds: [],
        fileIds: [],
        shared: { internal: [], external: [] },
        createdAt: new Date().toISOString(),
      },
    },
    files: {},
    rootFolderIds: [folderId],
  };
  saveDocState(initial);
  return initial;
}

export function saveDocState(state: DocState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function listFolders(parentId: string | null, state: DocState): DocFolder[] {
  if (parentId === null) {
    return state.rootFolderIds.map((id) => state.folders[id]).filter(Boolean);
  }
  const parent = state.folders[parentId];
  if (!parent) return [];
  return parent.childFolderIds.map((id) => state.folders[id]).filter(Boolean);
}

export function listFiles(folderId: string, state: DocState): DocFile[] {
  const folder = state.folders[folderId];
  if (!folder) return [];
  return folder.fileIds.map((id) => state.files[id]).filter(Boolean);
}

export function getFolder(folderId: string, state: DocState): DocFolder | undefined {
  return state.folders[folderId];
}

export function createFolder(name: string, parentId: string | null, state: DocState): DocState {
  const id = `f_${Date.now()}`;
  const folder: DocFolder = {
    id,
    name: name.trim(),
    parentId,
    childFolderIds: [],
    fileIds: [],
    shared: { internal: [], external: [] },
    createdAt: new Date().toISOString(),
  };
  const next: DocState = {
    ...state,
    folders: { ...state.folders, [id]: folder },
    rootFolderIds: parentId === null ? [id, ...state.rootFolderIds] : state.rootFolderIds,
  };
  if (parentId) {
    const parent = next.folders[parentId];
    if (parent) {
      parent.childFolderIds = [id, ...parent.childFolderIds];
    }
  }
  saveDocState(next);
  return next;
}

export function addFile(name: string, size: number, folderId: string, state: DocState, content?: string, type?: string): DocState {
  const id = `fi_${Date.now()}`;
  const file: DocFile = { 
    id, 
    name: name.trim(), 
    size, 
    folderId, 
    createdAt: new Date().toISOString(),
    content,
    type
  };
  const next: DocState = {
    ...state,
    files: { ...state.files, [id]: file },
  };
  const folder = next.folders[folderId];
  if (folder) folder.fileIds = [id, ...folder.fileIds];
  saveDocState(next);
  return next;
}

export function updateFolderShare(
  folderId: string,
  options: { internal?: string[]; external?: string[] },
  state: DocState
): DocState {
  const next: DocState = { ...state, folders: { ...state.folders } };
  const f = { ...next.folders[folderId] };
  f.shared = {
    internal: options.internal ?? f.shared.internal,
    external: options.external ?? f.shared.external,
    // Preserve public sharing data if it exists
    publicToken: f.shared.publicToken,
    publicUrl: f.shared.publicUrl,
  };
  next.folders[folderId] = f;
  saveDocState(next);
  return next;
}

export function renameFolder(folderId: string, name: string, state: DocState): DocState {
  const next: DocState = { ...state, folders: { ...state.folders } };
  const f = next.folders[folderId];
  if (!f) return state;
  next.folders[folderId] = { ...f, name: name.trim() };
  saveDocState(next);
  return next;
}

export function deleteFolder(folderId: string, state: DocState): DocState {
  const next: DocState = {
    ...state,
    folders: { ...state.folders },
    files: { ...state.files },
    rootFolderIds: [...state.rootFolderIds],
  };

  const removeFromParent = (id: string, parentId: string | null) => {
    if (parentId === null) {
      next.rootFolderIds = next.rootFolderIds.filter((rid) => rid !== id);
      return;
    }
    const parent = next.folders[parentId];
    if (parent) {
      parent.childFolderIds = parent.childFolderIds.filter((cid) => cid !== id);
    }
  };

  const deleteRecursive = (id: string) => {
    const folder = next.folders[id];
    if (!folder) return;
    // delete children first
    folder.childFolderIds.forEach((cid) => deleteRecursive(cid));
    // delete files within this folder
    folder.fileIds.forEach((fid) => {
      delete next.files[fid];
    });
    // detach from parent/root lists
    removeFromParent(id, folder.parentId);
    // finally delete the folder
    delete next.folders[id];
  };

  deleteRecursive(folderId);
  saveDocState(next);
  return next;
}

// Generate unique public token
export function generatePublicToken(): string {
  return `pub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Generate public URL
export function generatePublicUrl(token: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/share/${token}`;
}

// Enable public sharing for folder
export function enablePublicShare(folderId: string, state: DocState): DocState {
  const next: DocState = { ...state, folders: { ...state.folders } };
  const folder = next.folders[folderId];
  if (!folder) return state;
  
  if (!folder.shared.publicToken) {
    const token = generatePublicToken();
    folder.shared = {
      ...folder.shared,
      publicToken: token,
      publicUrl: generatePublicUrl(token)
    };
  }
  saveDocState(next);
  return next;
}

// Enable public sharing for file
export function enableFilePublicShare(fileId: string, state: DocState): DocState {
  const next: DocState = { ...state, files: { ...state.files } };
  const file = next.files[fileId];
  if (!file) return state;
  
  if (!file.publicToken) {
    const token = generatePublicToken();
    file.publicToken = token;
    file.publicUrl = generatePublicUrl(token);
  }
  saveDocState(next);
  return next;
}

// Get folder/file by public token
export function getFolderByPublicToken(token: string, state: DocState): DocFolder | undefined {
  return Object.values(state.folders).find(f => f.shared.publicToken === token);
}

export function getFileByPublicToken(token: string, state: DocState): DocFile | undefined {
  return Object.values(state.files).find(f => f.publicToken === token);
}

export function renameFile(fileId: string, name: string, state: DocState): DocState {
  const next: DocState = { ...state, files: { ...state.files } };
  const f = next.files[fileId];
  if (!f) return state;
  next.files[fileId] = { ...f, name: name.trim() };
  saveDocState(next);
  return next;
}

export function deleteFile(fileId: string, state: DocState): DocState {
  const next: DocState = { ...state, files: { ...state.files }, folders: { ...state.folders } };
  const file = next.files[fileId];
  if (!file) return state;
  
  // Remove file from folder's fileIds
  const folder = next.folders[file.folderId];
  if (folder) {
    folder.fileIds = folder.fileIds.filter((id) => id !== fileId);
  }
  
  // Delete the file
  delete next.files[fileId];
  saveDocState(next);
  return next;
}


