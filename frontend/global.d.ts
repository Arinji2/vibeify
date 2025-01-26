
declare module "eventsource" {
  export = EventSource;
}

declare global {
  var EventSource: typeof import("eventsource");
}
