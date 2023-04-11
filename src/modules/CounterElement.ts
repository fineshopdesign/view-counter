import { Database, DatabaseReference, get, increment, ref, set } from "firebase/database";
import { isNumber } from "./Utils";

export class CounterElement {
  element: HTMLElement;
  database: Database;
  ref: DatabaseReference;
  config;
  current = 0;

  constructor(element: HTMLElement, database: Database) {
    this.element = element;
    this.database = database;
    this.config = (() => {
      const config = Object.assign({}, {
        path: "",
        increment: 0
      }, element.dataset);

      const increment = Number(config.increment);
      config.increment = isNumber(increment) ? increment : 0;

      return config;
    })();
    this.ref = ref(this.database, this.config.path);
  }

  async getView() {
    const snapshot = await get(this.ref);
    const data = snapshot.exists() ? snapshot.val() : null;
    const current: string = isNumber(data) ? data : 0;
    this.element.setAttribute("data-view", current);
    this.current = current as never;
    return this.current;
  }

  async increment(number?: number) {
    const increase = isNumber(number) ? number as number : this.config.increment;
    if (increase > 0) {
      try {
        await set(this.ref, increment(increase));
        this.current += increase;
      } catch(error) {
        console.error(error);
      }
    }
    this.element.setAttribute("data-view", this.current as never);
    return this.current;
  }
}
