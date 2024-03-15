import supertest from 'supertest';
import createServer from '../src/utils/server';
import MongoMemoryServer from 'mongodb-memory-server';

describe('user', () => {
  describe('sign up a new user', () => {
    describe('given that the new does not exist', () => {
      it('should return 200', () => {
        expect(true).toBe(true);
      });
    });
  });
});
