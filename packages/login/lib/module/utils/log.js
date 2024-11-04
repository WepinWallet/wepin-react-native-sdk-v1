export default class LOG {
  static test = console.warn.bind(global.console, '[SDK][test] ');
  static warn = console.warn.bind(global.console, '[SDK][warn] ');
  static error = console.error.bind(global.console, '[SDK][error] ');
  static todo = console.warn.bind(global.console, '[SDK][todo] ');
  static assert = console.assert.bind(global.console);
  static debug = (_thisArg, ..._argArray) => {}; //for product
  // public static debug =
  //   process.env.NODE_ENV !== 'development'
  //     ? () => { }
  //     : console.log.bind(window.console, '[SDK][debug]')
}
//# sourceMappingURL=log.js.map