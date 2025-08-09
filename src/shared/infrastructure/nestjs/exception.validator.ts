/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  EntityNotFoundException,
  ValidationException,
} from '@shared/domain/exceptions';

/**
 * Decorador que maneja automáticamente las excepciones de dominio
 * y las convierte a excepciones HTTP apropiadas de NestJS
 */
export function HandleDomainExceptions<T = unknown>(
  target: object,
  propertyName: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  const originalMethod = descriptor.value as (...args: unknown[]) => unknown;

  descriptor.value = async function (
    this: object,
    ...args: unknown[]
  ): Promise<T> {
    try {
      const result = originalMethod.apply(this, args);

      // Si el método devuelve una promesa, la esperamos
      if (result instanceof Promise) {
        return await result;
      }
      return result;
    } catch (error: unknown) {
      // Manejo específico de excepciones de dominio
      if (error instanceof ValidationException) {
        throw new BadRequestException((error as Error).message);
      } else if (error instanceof EntityNotFoundException) {
        throw new NotFoundException((error as Error).message);
      }

      // Re-lanzar cualquier otra excepción sin modificar
      throw error;
    }
  };

  return descriptor;
}
