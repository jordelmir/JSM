/**
 * @module core/eventBus
 * @description A simple, type-safe, and resilient event bus for inter-component communication.
 */
import logger from './logger'; // Import the logger for error handling

type Listener<T> = (data: T) => void;

// Define your application events and their payloads here. Exporting for wider use.
export interface AppEvents {
  'customEvent': { message: string };
  'notification': { type: 'success' | 'error' | 'info'; message: string };
  'purchaseCompleted': { id: number; amount: number; date: string };
}

export class EventBus<E extends keyof AppEvents, D extends AppEvents> {
  private static instance: EventBus<keyof AppEvents, AppEvents>;
  private listeners: { [key in E]?: Listener<D[key]>[] } = {};

  // Private constructor for Singleton pattern
  private constructor() {}

  /**
   * Gets the single instance of the EventBus.
   * @returns {EventBus<keyof AppEvents, AppEvents>} The singleton instance.
   */
  public static getInstance(): EventBus<keyof AppEvents, AppEvents> {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Subscribes to an event.
   * The listener function will be called whenever the event is emitted.
   * @template T
   * @param {T} event - The name of the event to subscribe to.
   * @param {Listener<D[T]>} listener - The callback function to execute.
   */
  public on<T extends E>(event: T, listener: Listener<D[T]>): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]?.push(listener as Listener<D[E]>);
  }

  /**
   * Unsubscribes from an event.
   * The listener will no longer be called for the specified event.
   * @template T
   * @param {T} event - The name of the event to unsubscribe from.
   * @param {Listener<D[T]>} listener - The exact listener function to remove.
   */
  public off<T extends E>(event: T, listener: Listener<D[T]>): void {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event] = this.listeners[event]?.filter(
      (l) => l !== listener
    );
  }

  /**
   * Emits an event, calling all subscribed listeners with the provided data.
   * The data payload is type-checked against the event name.
   * @template T
   * @param {T} event - The name of the event to emit.
   * @param {D[T]} data - The data payload for the event.
   */
  public emit<T extends E>(event: T, data: D[T]): void {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event]?.forEach((listener) => {
      try {
        listener(data);
      } catch (error) {
        logger.error(`Error in event listener for event: ${String(event)}`, {
          error,
          eventData: data,
        });
      }
    });
  }
}

const eventBus = EventBus.getInstance();
export default eventBus;
