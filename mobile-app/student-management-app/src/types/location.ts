export interface LocationInfo {
    latitude: number | null;
    longitude: number | null;
    loading: boolean;
    error: string | null;
}

export interface UseLocationOptions {
    enableRetry?: boolean;
    maxRetries?: number;
    timeoutMs?: number;
}