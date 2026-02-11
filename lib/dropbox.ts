const DROPBOX_TOKEN_URL = 'https://api.dropboxapi.com/oauth2/token';
const DROPBOX_API_URL = 'https://api.dropboxapi.com/2';

const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif']);

export interface DropboxConfig {
  appKey: string;
  appSecret: string;
  refreshToken: string;
  sourceFolder: string;
}

interface DropboxTokenResponse {
  access_token: string;
}

interface DropboxListFolderEntry {
  '.tag': string;
  path_display?: string;
}

interface DropboxListFolderResponse {
  entries: DropboxListFolderEntry[];
  cursor: string;
  has_more: boolean;
}

function normalizeFolder(folder: string): string {
  if (!folder) return '/incoming';
  if (!folder.startsWith('/')) return `/${folder}`;
  return folder;
}

function isImagePath(path: string): boolean {
  const ext = path.split('.').pop()?.toLowerCase();
  return !!ext && IMAGE_EXTENSIONS.has(ext);
}

export function getDropboxConfigFromEnv(): DropboxConfig {
  const appKey = process.env.DROPBOX_APP_KEY;
  const appSecret = process.env.DROPBOX_APP_SECRET;
  const refreshToken = process.env.DROPBOX_REFRESH_TOKEN;
  const sourceFolder = normalizeFolder(process.env.DROPBOX_SOURCE_FOLDER ?? '/incoming');

  if (!appKey || !appSecret || !refreshToken) {
    throw new Error('Missing Dropbox env vars: DROPBOX_APP_KEY, DROPBOX_APP_SECRET, DROPBOX_REFRESH_TOKEN');
  }

  return { appKey, appSecret, refreshToken, sourceFolder };
}

export async function refreshDropboxAccessToken(config: DropboxConfig): Promise<string> {
  const auth = Buffer.from(`${config.appKey}:${config.appSecret}`).toString('base64');
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: config.refreshToken
  });

  const res = await fetch(DROPBOX_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body.toString(),
    cache: 'no-store'
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Dropbox token refresh failed (${res.status}): ${text}`);
  }

  const json = (await res.json()) as DropboxTokenResponse;
  if (!json.access_token) {
    throw new Error('Dropbox token refresh missing access_token');
  }

  return json.access_token;
}

async function callDropbox<T>(accessToken: string, path: string, body: object): Promise<T> {
  const res = await fetch(`${DROPBOX_API_URL}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
    cache: 'no-store'
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Dropbox API ${path} failed (${res.status}): ${text}`);
  }

  return (await res.json()) as T;
}

export async function listDropboxImageFiles(accessToken: string, sourceFolder: string): Promise<string[]> {
  const first = await callDropbox<DropboxListFolderResponse>(accessToken, '/files/list_folder', {
    path: normalizeFolder(sourceFolder),
    recursive: true,
    include_media_info: false,
    include_deleted: false,
    include_non_downloadable_files: false
  });

  const entries = [...first.entries];
  let cursor = first.cursor;
  let hasMore = first.has_more;

  while (hasMore) {
    const next = await callDropbox<DropboxListFolderResponse>(accessToken, '/files/list_folder/continue', { cursor });
    entries.push(...next.entries);
    cursor = next.cursor;
    hasMore = next.has_more;
  }

  return entries
    .filter((entry) => entry['.tag'] === 'file' && !!entry.path_display)
    .map((entry) => entry.path_display as string)
    .filter(isImagePath);
}

export async function getDropboxTemporaryLink(accessToken: string, dropboxPath: string): Promise<string> {
  const response = await callDropbox<{ link: string }>(accessToken, '/files/get_temporary_link', {
    path: dropboxPath
  });

  if (!response.link) {
    throw new Error(`No temporary link returned for ${dropboxPath}`);
  }

  return response.link;
}
