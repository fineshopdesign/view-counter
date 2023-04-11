import { FirebaseApp, initializeApp } from "firebase/app";
import { Database, getDatabase } from "firebase/database"
import { CounterElement } from "./CounterElement";

let current = 0;

export default class ViewCounter {
  databaseUrl: string;
  selector: string;
  app: FirebaseApp;
  database: Database;
  elements: Array<CounterElement>;

  static counters: Array<ViewCounter> = []

  constructor(options: Options) {
    if (!options) throw new Error("Options is required");
    if (typeof options.databaseUrl !== "string") throw new Error("Specify 'databaseUrl' property in Options of type 'string'");
    if (typeof options.selector !== "string") throw new Error("Specify 'selector' property in Options of type 'string'");

    this.databaseUrl = options.databaseUrl;
    this.selector = options.selector;
    this.app = initializeApp({
      databaseURL: this.databaseUrl
    }, `View_Counter_${current}`);
    this.database = getDatabase(this.app);
    this.elements = [];
    this.init();

    ViewCounter.counters.push(this);
    current += 1;
  }

  init() {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(this.selector));
    const _this = this;
    elements.forEach((element) => {
      // @ts-expect-error
      if (typeof element.dataset.path === "string" && !element.viewCounter){
        _this.addElement(element);
      }
    });
  }

  async addElement(element: HTMLElement) {
    if (!(element instanceof HTMLElement)){
      throw new Error("Argument 1 must be of type 'HTMLElement'");
    }
    // @ts-expect-error
    if (element.viewCounter) {
      throw new Error("Provided Element is already in use");
    }
    if (typeof element.dataset.path !== "string") {
      throw new Error("Attribute 'data-path' is required");
    }

    const counterElement = new CounterElement(element, this.database);
    
    // @ts-expect-error
    element.viewCounter = counterElement;
    
    await counterElement.getView();
    await counterElement.increment();

    this.elements.push(counterElement);

    return counterElement;
  }
}
