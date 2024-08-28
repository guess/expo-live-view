import {
  BehaviorSubject,
  filter,
  map,
  Observable,
  of,
  Subscription,
  switchMap,
  zip,
} from 'rxjs';
import LiveChannel from './LiveChannel';
import { isNotNull } from 'expo-live-view/utils/rxjs';
import { LiveSocket } from './LiveSocket';

export class PhoenixRepo {
  private url: string;
  private _subscription?: Subscription;
  private _socket$ = new BehaviorSubject<LiveSocket | null>(null);
  private _params$: BehaviorSubject<object | null>;

  constructor(url: string, params?: object) {
    this.url = url;
    this._params$ = new BehaviorSubject(params || null);
  }

  updateParams(params: object) {
    this._params$.next(params);
  }

  connect() {
    this._subscription = buildSocket(this.url, this._params$).subscribe(
      (socket) => {
        this._socket$.next(socket);
      }
    );
  }

  disconnect() {
    this.socket?.disconnect();
    this._subscription?.unsubscribe();
  }

  createChannel$(topic: string, params?: object): Observable<LiveChannel> {
    return this._socket$.pipe(
      filter(isNotNull),
      map((socket) => new LiveChannel(socket, { topic, params }))
    );
  }

  get socket(): LiveSocket | null {
    return this._socket$.value;
  }

  get socket$(): Observable<LiveSocket> {
    return this._socket$.asObservable().pipe(filter(isNotNull));
  }
}

const buildSocket = (
  url: string,
  params$: Observable<object | null>
): Observable<LiveSocket> => {
  return params$.pipe(
    filter(isNotNull),
    map((token) => {
      const socket = new LiveSocket(url, {
        params: { token },
        logger: (kind: string, msg: string, data: any) => {
          console.debug(`${kind}: ${msg}`, data);
        },
      });
      socket.connect();
      return socket;
    }),
    switchMap((socket) => {
      return zip(
        of(socket),
        socket.getEventStream$(socket.topic, 'livestate-connect')
      );
    }),
    map(([socket, _isConnected]) => socket)
  );
};
