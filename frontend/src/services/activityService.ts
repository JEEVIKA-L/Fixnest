import { Activity } from '../types';
import { delay, simulateError, getStorageData, setStorageData } from './serviceHelpers';

let mockActivities = getStorageData<Activity[]>('activities', []);

const syncStorage = () => setStorageData('activities', mockActivities);

export const activityService = {
  getActivitiesByCardId: async (cardId: string): Promise<Activity[]> => {
    await delay(200);
    simulateError();
    return mockActivities
      .filter(a => a.entityId === cardId && a.entityType === 'card')
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  addActivity: async (activityData: Omit<Activity, 'id' | 'createdAt'>): Promise<Activity> => {
    await delay(100);
    const newActivity: Activity = {
      ...activityData,
      id: `act-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    mockActivities.push(newActivity);
    syncStorage();
    return newActivity;
  }
};
