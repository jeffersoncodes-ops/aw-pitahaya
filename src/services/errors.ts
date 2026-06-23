export async function extractResponseError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body.error || `Error ${res.status}`;
  } catch {
    return `Error ${res.status}`;
  }
}

export function extractApiError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Error desconocido';
}
