import { User } from '../types';
import { mockUsers } from '../mock-data/users';
import { delay, simulateError } from './serviceHelpers';

export const userService = {
 getUsers: async (): Promise<User[]> => {
 await delay(400);
 simulateError();
 return [...mockUsers];
 },

 getUserById: async (id: string): Promise<User> => {
 await delay(200);
 simulateError();
 const user = mockUsers.find(u => u.id === id);
 if (!user) throw new Error('User not found');
 return { ...user };
 },

 getCurrentUser: async (): Promise<User> => {
 await delay(100);
 return { ...mockUsers[0] }; // Assume first user is logged in
 }
};
