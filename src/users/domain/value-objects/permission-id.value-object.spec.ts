import { PermissionId } from './permission-id.value-object';

describe('PermissionId', () => {
  describe('constructor', () => {
    it('should create PermissionId with valid value', () => {
      const validId = '123e4567-e89b-12d3-a456-426614174000';
      const permissionId = new PermissionId(validId);

      expect(permissionId).toBeInstanceOf(PermissionId);
      expect(permissionId.value).toBe(validId);
    });

    it('should throw error when value is empty', () => {
      expect(() => new PermissionId('' as any)).toThrow(
        'Permission ID cannot be empty',
      );
    });

    it('should throw error when value is only whitespace', () => {
      expect(() => new PermissionId('   ' as any)).toThrow(
        'Permission ID cannot be empty',
      );
    });
  });

  describe('generate', () => {
    it('should generate a new PermissionId with valid UUID format', () => {
      const permissionId = PermissionId.generate();

      expect(permissionId).toBeInstanceOf(PermissionId);
      expect(permissionId.value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });

    it('should generate unique UUIDs on multiple calls', () => {
      const permissionId1 = PermissionId.generate();
      const permissionId2 = PermissionId.generate();

      expect(permissionId1.value).not.toBe(permissionId2.value);
    });
  });

  describe('toString', () => {
    it('should return the value as string', () => {
      const validId = '123e4567-e89b-12d3-a456-426614174000';
      const permissionId = new PermissionId(validId);

      expect(permissionId.toString()).toBe(validId);
    });
  });

  describe('equals', () => {
    it('should be equal when values are the same', () => {
      const id1 = new PermissionId('123e4567-e89b-12d3-a456-426614174000');
      const id2 = new PermissionId('123e4567-e89b-12d3-a456-426614174000');

      expect(id1.equals(id2)).toBe(true);
    });

    it('should not be equal when values are different', () => {
      const id1 = new PermissionId('123e4567-e89b-12d3-a456-426614174000');
      const id2 = new PermissionId('987fcdeb-51a2-43d1-b789-987654321000');

      expect(id1.equals(id2)).toBe(false);
    });
  });
});
