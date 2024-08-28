import { Channel, Socket } from '@guess/phoenix-js';
import { BehaviorSubject, filter, map, Observable, Subject } from 'rxjs';

export type LiveSocketEvent = { topic: string; type: string; event: any };

export class LiveSocket {
  topic: string;
  socket: Socket;
  private subject = new Subject<LiveSocketEvent>();
  private connected$ = new BehaviorSubject<boolean>(false);

  constructor(url: string, options?: object) {
    this.topic = url;
    this.socket = new Socket(url, options);
  }

  connect() {
    if (!this.isConnected) {
      this.socket.onError((error: any) =>
        this.emitError(this.topic, 'socket error', error)
      );
      this.socket.onOpen((resp: any) =>
        this.emit(this.topic, 'livestate-connect', resp)
      );
      this.socket.connect();
      this.connected$.next(true);
    }
  }

  disconnect() {
    this.socket.disconnect();
    this.connected$.next(false);
  }

  get isConnected(): boolean {
    return this.connected$.getValue();
  }

  channel(topic: string, params?: object): Channel {
    return this.socket.channel(topic, params);
  }

  emit(topic: string, type: string, event: any) {
    this.subject.next({ topic, type, event });
  }

  emitServerError(topic: string, error: any) {
    this.emit(topic, 'livestate-error', { detail: error });
  }

  emitError(topic: string, type: string, error: any): void {
    this.emit(topic, 'livestate-error', {
      detail: {
        type,
        message: this.extractMessage(error),
      },
    });
  }

  private extractMessage(error: any): string {
    if (error && typeof error === 'object') {
      const message = [error.reason, error.name, error.message].find(
        (value) => value
      );
      console.debug(message);
      return message;
    } else if (typeof error === 'string') {
      return error;
    }
    return 'Unknown error';
  }

  getEventStream$(topic: string, type: string): Observable<LiveSocketEvent> {
    return this.subject.asObservable().pipe(
      filter((event: LiveSocketEvent) => event.topic === topic),
      filter((event: LiveSocketEvent) => event.type === type),
      map((event: LiveSocketEvent) => event.event)
    );
  }
}
