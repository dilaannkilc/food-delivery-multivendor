import AsyncStorage from "@react-native-async-storage/async-storage";

class SimpleEventEmitter {
  private listeners: { [key: string]: Function[] } = {};

  emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(listener => listener(data));
    }
  }

  addListener(event: string, listener: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);

    return {
      removeListener: () => {
        const index = this.listeners[event].indexOf(listener);
        if (index > -1) {
          this.listeners[event].splice(index, 1);
        }
      }
    };
  }

  removeListener(event: string, listener: Function) {
    if (this.listeners[event]) {
      const index = this.listeners[event].indexOf(listener);
      if (index > -1) {
        this.listeners[event].splice(index, 1);
      }
    }
  }

  removeAllListeners(event?: string) {
    if (event) {
      delete this.listeners[event];
    } else {
      this.listeners = {};
    }
  }
}

export const asyncStorageEmitter = new SimpleEventEmitter();

export const setItem = async (key: string, value: string) => {
  await AsyncStorage.setItem(key, value);
  asyncStorageEmitter?.emit(key, { key, value });
};

export const removeItem = async (key: string) => {
  await AsyncStorage.removeItem(key);
  asyncStorageEmitter.emit(key, { key, value: null });
};
