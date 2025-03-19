import { PrismaClient } from '@prisma/client';

export class PrismaSingleton {
  static #instance: PrismaClient;

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {}

  /**
   * The static getter that controls access to the singleton instance.
   *
   * This implementation ensures there's only one PrismaClient instance.
   */
  public static get instance(): PrismaClient {
    if (!PrismaSingleton.#instance) {
      PrismaSingleton.#instance = new PrismaClient();
    }

    return PrismaSingleton.#instance;
  }
}
