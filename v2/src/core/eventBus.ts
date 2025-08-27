
/**
 * @module core/eventBus
 * @description A simple event bus for inter-component communication.
 */

type Listener<T> = (data: T) => void;

class EventBus<E extends string, D extends Record<E, unknown>> {
  private listeners: { [key in E]?: Listener<D[key]>[] } = {};

  public on<T extends E>(event: T, listener: Listener<D[T]>): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]?.push(listener as Listener<D[E]>);
  }

  public off<T extends E>(event: T, listener: Listener<D[T]>): void {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event] = this.listeners[event]?.filter(
      (l) => l !== listener
    );
  }

  public emit<T extends E>(event: T, data: D[T]): void {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event]?.forEach((listener) => listener(data));
  }
}

// Define your application events and their payloads here
interface AppEvents {
    'customEvent': { message: string };
    'notification': { type: 'success' | 'error' | 'info'; message: string };
    'purchaseCompleted': { id: number; amount: number; date: string };
}

const eventBus = new EventBus<keyof AppEvents, AppEvents>();
export default eventBus;
