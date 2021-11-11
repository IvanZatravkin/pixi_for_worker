const listeners = (function () {
  const listeners = [];
  const addEventListener = (...args) => listeners.push(args);
  self.document = {
    createElement(type) {
      if (type === "canvas") {
        return new OffscreenCanvas(0, 0);
      } else {
        console.log("CreateElement called with type = ", type);

        return {
          style: {},
          addEventListener,
        };
      }
    },
    body: {
      appendChild() {},
    },
    addEventListener,
  };

  self.window = {
    console: self.console,
    addEventListener,
    navigator: {},
    document: self.document,
    removeEventListener: function () {},
    WebGLRenderingContext: self.WebGL2RenderingContext || self.WebGL2RenderingContext,
    location: {},
  };
  return listeners;
})();

importScripts("pixi_v6.2.0_worker.js");
console.log("PIXI---", PIXI);

let canvas;
const start = (event) => {
  const { canvas } = event.data;
  canvas.addEventListener = (...args) => listeners.push(args);
  canvas.style = {};
  const app = new PIXI.Application({
    width: 800,
    height: 600,
    view: event.data.canvas,
    backgroundColor: 0x1099bb,
    backgroundAlpha: 1,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
  });

  const container = new PIXI.Container();
  app.stage.addChild(container);
  // center
  container.x = 0;
  container.y = 0;
  container.interactive = true;
  container.interactiveChildren = true;
  // center
  container.pivot.x = container.width / 2;
  container.pivot.y = container.height / 2;

  // Rectangle
  const graphics = new PIXI.Graphics();
  graphics.beginFill(0xde3249);
  graphics.lineStyle(2, "#ff3300");
  graphics.drawRect(0, 0, 100, 100);
  graphics.moveTo(5, 5);
  graphics.lineTo(200, 200);
  graphics.endFill();
  container.addChild(graphics);
  container.on("mousemove", e => {
    graphics.x = e.data.global.x;
    graphics.y = e.data.global.y;
  })
}

self.addEventListener("message", (event) => {
  switch (event.data.type) {
    case "start":
      start(event);
      break;
    case "event":
      const fn = listeners.find(([t]) => t === event.data.event.type);
      event.data.event.data.target = canvas;
      event.data.event.data.preventDefault = () => void 0;
      if (fn) {
        fn[1](event.data.event.data);
      }
      break;
  }
});
