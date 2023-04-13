import { FirebaseApp, initializeApp } from "firebase/app";
import { Database, getDatabase } from "firebase/database"
import { CounterElement } from "./CounterElement";

export interface Options {
  databaseUrl: string;
  selector?: string | null;
  abbreviation?: boolean;
}

export default class ViewCounter {
  databaseUrl: string;
  selector: string | null;
  app: FirebaseApp;
  database: Database;
  elements: Array<CounterElement>;
  abbreviation: boolean;

  static counters: Array<ViewCounter> = []
  static current = 0;

  constructor(options: Options) {
    if (!options) throw new Error("Options is required");
    if (typeof options.databaseUrl !== "string") throw new Error("Specify 'databaseUrl' property in Options of type 'string'");

    this.databaseUrl = options.databaseUrl;
    this.selector = typeof options.selector === "string" ? options.selector : null;
    this.abbreviation = options.abbreviation === true;
    this.app = initializeApp({
      databaseURL: this.databaseUrl
    }, `View_Counter_${ViewCounter.current}`);
    this.database = getDatabase(this.app);
    this.elements = [];
    this.init();

    ViewCounter.counters.push(this);
    ViewCounter.current += 1;
  }

  init() {
    if (typeof this.selector === "string") {
      const elements = Array.from(document.querySelectorAll<HTMLElement>(this.selector));
      const _this = this;
      elements.forEach((element) => {
        // @ts-expect-error
        if (typeof element.dataset.path === "string" && !element.viewCounter) {
          _this.addElement(element);
        }
      });
    }
  }

  async addElement(element: HTMLElement) {
    if (!(element instanceof HTMLElement)) {
      throw new Error("Argument 1 must be of type 'HTMLElement'");
    }
    // @ts-expect-error
    if (element.viewCounter) {
      throw new Error("Provided Element is already in use");
    }
    if (typeof element.dataset.path !== "string") {
      throw new Error("Attribute 'data-path' is required");
    }

    const counterElement = new CounterElement(element, this.database, this.abbreviation);

    // @ts-expect-error
    element.viewCounter = counterElement;

    await counterElement.getView();
    await counterElement.increment();

    this.elements.push(counterElement);

    return counterElement;
  }
}
