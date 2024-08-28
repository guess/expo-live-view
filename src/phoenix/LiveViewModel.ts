import { isNotNull } from '../utils/rxjs';
import { snakeToCamel } from '../utils/snakeToCamel';

import type { AnnotationsMap } from 'mobx';
import { makeObservable, observable, runInAction } from 'mobx';
import { set } from 'lodash';
import { BehaviorSubject, filter, Subscription, switchMap } from 'rxjs';
import LiveChannel from './LiveChannel';
import type { LiveStateChange, LiveStatePatch } from './LiveChannel';
import type { PhoenixRepo } from './PhoenixRepo';

export class LiveViewModel {
  protected repo: PhoenixRepo;
  protected _channel$ = new BehaviorSubject<LiveChannel | null>(null);
  private _subscriptions: Subscription[] = [];
  protected observableProps: Set<string> = new Set();
  protected topic: string;
  private subscriptions: Subscription[] = [];

  constructor(repo: PhoenixRepo, topic: string) {
    this.repo = repo;
    this.topic = topic;
    this.setupAutoUpdate();
    this.doOnConnect(() => this.onConnect());
    this.doOnChange((resp) => this.onChange(resp));
    this.doOnPatch((resp) => this.onPatch(resp));
  }

  makeObservable<T extends object, AdditionalKeys extends PropertyKey = never>(
    target: T,
    annotations?: AnnotationsMap<T, NoInfer<AdditionalKeys>>
  ) {
    if (annotations) {
      Object.entries(annotations).forEach(([key, value]) => {
        if (
          value === observable ||
          value === observable.deep ||
          value === observable.ref ||
          value === observable.shallow ||
          value === observable.struct
        ) {
          console.debug(`Tracking observable: ${key}`);
          this.observableProps.add(key);
        }
      });
    }

    makeObservable(target, annotations);
  }

  get channel() {
    return this._channel$.value!;
  }

  get channel$() {
    return this._channel$.asObservable().pipe(filter(isNotNull));
  }

  connect() {
    this.join();

    return () => {
      this.leave();
      this.onDisconnect();
    };
  }

  join() {
    this._subscriptions.push(
      this.repo.createChannel$(this.topic).subscribe((channel: LiveChannel) => {
        this._channel$.next(channel);
        console.debug('joining channel: ', this.channel.topic);
        this.channel.join();
      })
    );
  }

  leave() {
    if (this.channel) {
      console.debug('leaving channel: ', this.channel?.topic);
      this.channel?.leave();
    }
    this._subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  pushEvent(eventType: string, payload: any) {
    this.channel.pushEvent(eventType, payload);
  }

  setValueFromPath(path: string[], value: any): any {
    const topLevelProp = path[0];
    const restOfPath = path.slice(1);
    let finalValue;

    if (!topLevelProp) return null;

    runInAction(() => {
      if (restOfPath.length === 0) {
        // If it's a top-level property, just set it directly
        (this as any)[topLevelProp] = value;
        finalValue = value;
      } else {
        // For nested properties, create a new object
        const currentValue = (this as any)[topLevelProp];
        const newValue = { ...currentValue };
        set(newValue, restOfPath, value);
        (this as any)[topLevelProp] = newValue;
        finalValue = newValue;
      }
    });

    return finalValue;
  }

  subscribeToChannelEvent(eventType: string, callback: (resp: any) => void) {
    this._subscriptions.push(
      this.channel$
        .pipe(switchMap((channel) => channel.getEventsForType$(eventType)))
        .subscribe(callback)
    );
  }

  onConnect() {}
  onDisconnect() {}
  onChange(_change: LiveStateChange) {}
  onPatch(_patch: LiveStatePatch) {}

  doOnConnect(callback: () => void) {
    this.subscribeToChannelEvent('livestate-connect', callback);
  }

  doOnPatch(callback: (resp: LiveStatePatch) => void) {
    this.subscribeToChannelEvent('livestate-patch', callback);
  }

  doOnChange(callback: (resp: LiveStateChange) => void) {
    this.subscribeToChannelEvent('livestate-change', callback);
  }

  addSubscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  private setupAutoUpdate() {
    this.doOnChange((resp: any) => {
      const {
        detail: { state },
      } = resp;
      this.updateObservableProps(this, state);
    });
  }

  private updateObservableProps(target: any, source: any) {
    Object.keys(source).forEach((serverKey) => {
      const key = snakeToCamel(serverKey);
      if (this.observableProps.has(key)) {
        const value = source[serverKey];
        console.debug(`Updating ${key} to`, value);

        runInAction(() => {
          target[key] = value;
        });
      }
    });
  }
}
