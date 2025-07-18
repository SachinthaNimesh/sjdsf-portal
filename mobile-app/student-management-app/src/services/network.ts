import * as Network from 'expo-network';
import { getQueuedRequests, deleteQueuedRequest } from './database';

export const checkInternetConnection = async () => {
  try {
    const networkState = await Network.getNetworkStateAsync();
    return networkState.isConnected && networkState.isInternetReachable;
  } catch (error) {
    console.error('Error checking internet connection:', error);
    return false;
  }
};

export const syncQueuedRequests = async () => {
  try {
    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      return;
    }

    const queuedRequests = await getQueuedRequests();
    console.log('Found queued requests:', queuedRequests.length);

    for (const request of queuedRequests) {
      try {
        const response = await fetch(request.endpoint, {
          method: request.method,
          headers: JSON.parse(request.headers),
          body: request.body,
        });

        if (response.ok) {
          await deleteQueuedRequest(request.id!);
          console.log(`Successfully synced and deleted request ${request.id}`);
        } else {
          console.error(`Failed to sync request ${request.id}:`, await response.text());
        }
      } catch (error) {
        console.error(`Error syncing request ${request.id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error during sync:', error);
  }
}; 