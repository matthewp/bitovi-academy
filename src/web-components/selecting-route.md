@page learn-web-components/select-a-route Selecting a route
@parent learn-web-components 6
@description Learn more about lit-html, with its special syntax for setting up event listeners and for passing properties to child components.

@body

## The problem

In this section we will:

- Listen for when the user selects a bus route from the list.
- Show a checkmark next to the selected route in the list.
- Display the selected route overlaying the map component.
- Get a list of vehicles for this route from the CTA bus tracker API.
- Pass the vehicles to `<google-map-view>`.

## How to solve this problem

- Use [lit-html](https://lit-html.polymer-project.org/)'s `@` syntax to listen to a __click__ event on each bus route in the list.
- Call a function, `_pickRoute()` that will be used to set the chosen route, call to the CTA bus tracker API to get a list of vehicles and then call `update()` on our component which triggers a rerender.
- Add some HTML to the footer to display the selected route as an overlay to the map component.
- Use lit-html's `.` (dot) syntax to pass properties to child components.

## What you need to know
- Like elements in the light DOM (the DOM the page renders with), elements in the shadow DOM can have event listeners. So you can use normal DOM methods like [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector) to find elements, and [addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) to listen to events.
- Use `connectedCallback()` to set up event listeners.
- Use `disconnectedCallback()` to remove event listeners. Using both of these lifecycle callbacks ensures there won't be memory leaks in your component.
- lit-html has a shorthand in its templating syntax for listening to events. `@click=${fn}` is a way to set up an event listener on an element. It *looks* like an attribute, but is not added as an attribute. Instead it calls `addEventListener()` under the hood. This allows you to have declarative templates that include information like the events listening to.
- Likewise, lit-html has a shorthand for setting properties. The __dot__ notation, or `.vehicles=${vehicles}`. The dot is like setting a property in JavaScript, `foo.bar = 'baz'`. Like with event listeners, this is not part of HTML, but rather something that lit-html is layering over-top, to allow more declarative templating and less need for manual DOM manipulation.


## The solution

Set an `@click` listener on each bus route item that calls a `_pickRoute()` function. Set that function to fetch the list of vehicles for the selected route. Call `update()` immediately and when the vehicles are available. Finally pass the list of vehicles to `<google-map-view>` view the `.vehicles` syntax. In the next section we'll take these vehicles and display them as markers on the map.

```html
<bus-tracker></bus-tracker>

<style>
html,
body {
  height: 100%;
}
body {
  font-family: "Catamaran", sans-serif;
  background-color: #f2f2f2;
  display: flex;
  flex-direction: column;
  margin: 0;
}
</style>
<template id="bt-template">
  <style>
    :host {
      display: flex;
      flex-direction: column;
    }

    .top {
      flex-grow: 1;
      overflow-y: auto;
      height: 10%;
      display: flex;
      flex-direction: column;
    }

    footer {
      height: 250px;
      position: relative;
    }
    .gmap {
      width: 100%;
      height: 250px;
      background-color: grey;
    }

    header {
      box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.1);
      background-color: #313131;
      color: white;
      min-height: 60px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      line-height: 1.2;
    }

    header h1 {
      text-align: center;
      font-size: 18px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0;
    }
    .route-selected {
      line-height: 1;
      position: absolute;
      z-index: 1;
      text-align: right;
      background: rgba(6, 6, 6, 0.6);
      top: 10px;
      right: 10px;
      padding: 6px 10px;
      color: white;
      border-radius: 2px; border: none;
      cursor: pointer;
    }
    .route-selected small {
      display: block;
      font-size: 14px;
      color: #ddd;
    }
    .route-selected .error-message {
      font-size: 14px;
      background-color: #ff5722;
      border-radius: 10px;
      padding: 4px 8px 1px;
      margin-top: 5px;
    }
    .routes-list {
      padding: 20px 0;
      margin: 0;
      overflow-y: auto;
    }
    .routes-list li {
      list-style: none;
      cursor: pointer;
      background: white;
      border: 1px solid #dedede;
      margin: 1% 2%;
      border-radius: 25px;
      color: #2196f3;
      width: 41%;
      display: inline-flex;
      font-size: 14px;
      line-height: 1.2;
    }
    .routes-list li:hover {
      border-color: transparent;
      background-color: #008eff;
      color: white;
      box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.2);
    }
    .routes-list li .check {
      display: none;
    }
    .routes-list li.active {
      color: #666;
      background-color: #e8e8e8;
    }
    .routes-list li.active .check {
      display: inline-block;
      margin-left: 5px;
      color: #2cc532;
    }
    .routes-list li.active:hover {
      border-color: #dedede;
      box-shadow: none;
    }
    .routes-list button {
      width: 100%;
      padding: 8px 8px 6px;
      border: none;
      border-radius: 25px;
      background: transparent;
      text-align: left;
      font: inherit;
      color: inherit;
    }
    .route-number {
      display: inline-block;
      border-right: 1px solid #dedede;
      padding-right: 5px;
      margin-right: 5px;
      min-width: 18px;
      text-align: right;
    }
    p {
      text-align: center;
      margin: 0;
      color: #ccc;
      font-size: 14px;
    }
  </style>
</template>
<template id="gmap-template">
  <style>
    .gmap {
      width: 100%;
      height: 250px;
      background-color: grey;
    }
  </style>
  <div class="gmap"></div>
</template>
<script type="module">
import { html, render } from "https://unpkg.com/lit-html@1.0.0/lit-html.js";

const template = document.querySelector('#gmap-template');

const googleAPI = new Promise(resolve => {
  const script = document.createElement("script");
  script.src =
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyD7POAQA-i16Vws48h4yRFVGBZzIExOAJI";
  document.body.appendChild(script);
  script.onload = resolve;
});

class GoogleMapView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    let nodes = document.importNode(template.content, true);
    this.shadowRoot.append(nodes);
  }

  async connectedCallback() {
    await googleAPI;

    let gmap = this.shadowRoot.querySelector('.gmap');
    this.map = new google.maps.Map(gmap, {
      zoom: 10,
      center: {
        lat: 41.881,
        lng: -87.623
      }
    });
  }
}

customElements.define('google-map-view', GoogleMapView);

const proxyUrl = "https://can-cors.herokuapp.com/";
const token = "?key=piRYHjJ5D2Am39C9MxduHgRZc&format=json";
const apiRoot = "http://www.ctabustracker.com/bustime/api/v2/";
const getRoutesEndpoint = apiRoot + "getroutes" + token;
const getVehiclesEndpoint = apiRoot + "getvehicles" + token;
const styles = document.querySelector('#bt-template').content.cloneNode(true).firstElementChild;

class StatefulPromise {
  constructor(promise, component) {
    this.promise = promise;
    this.component = component;

    this.state = "pending";
    this.value = null;
    this.listen();
  }

  listen() {
    let onSuccess = value => {
      this.value = value;
      this.state = "resolved";
      this.component.update();
    };

    let onFailure = error => {
      this.error = error;
      this.state = "rejected";
      this.component.update();
    };

    this.promise.then(onSuccess, onFailure);
  }

  isPending() {
    return this.state === "pending";
  }

  isResolved() {
    return this.state === "resolved";
  }

  isRejected() {
    return this.state === "rejected";
  }
}

class BusTracker extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.title = "Chicago CTA Bus Tracker";
  }

  connectedCallback() {
    this._getRoutes();
    this._getVehicles();
    this.update();
  }

  update() {
    render(this.render(), this.shadowRoot);
  }

  _getRoutes() {
    let promise = fetch(proxyUrl + getRoutesEndpoint)
      .then(response => response.json())
      .then(data => data["bustime-response"].routes);

    this.routes = new StatefulPromise(promise, this);
  }

  _getVehicles(route) {
    let promise;

    if (route) {
      promise = fetch(proxyUrl + getVehiclesEndpoint + "&rt=" + route.rt)
        .then(response => response.json())
        .then(data => {
          if (data["bustime-response"].error) {
            return Promise.reject(data["bustime-response"].error[0]);
          } else {
            return data["bustime-response"].vehicle;
          }
        });
    } else {
      promise = Promise.resolve();
    }

    this.vehicles = new StatefulPromise(promise, this);
  }

  _pickRoute(route) {
    this.route = route;
    this._getVehicles(route);
    this.update();
  }

  render() {
    return html`
      ${styles}
      <div class="top">
        <header>
          <h1>${this.title}</h1>
          ${this.routes.isPending()
            ? html`
                <p>Loading routes…</p>
              `
            : ""}
        </header>

        <ul class="routes-list">
          ${this.routes.isResolved()
            ? this.routes.value.map(
                route => html`
                  <li
                    class=${this.route === route ? "active" : ""}
                  >
                    <button type="button"
                      @@click=${() => this._pickRoute(route)}
                    >
                      <span class="route-number">${route.rt}</span>
                      <span class="route-name">${route.rtnm}</span>
                      <span class="check">✔</span>
                    </button>
                  </li>
                `
              )
            : ""}
        </ul>
      </div>
      <footer>
      ${this.route
        ? html`
            <button
              class="route-selected"
              @@click="${() => this._pickRoute(this.route)}}"
            >
              <small>Route ${this.route.rt}:</small> ${this.route.rtnm}
              ${this.vehicles.isRejected()
                ? html`
                    <div class="error-message">
                      No vehicles available for this route
                    </div>
                  `
                : ""}
            </button>
          `
        : ""}

        <google-map-view
          .vehicles=${this.vehicles.value}
        ></google-map-view>
      </footer>
    `;
  }
}

customElements.define("bus-tracker", BusTracker);
</script>
```
@highlight 3-15,270-294,317,330-350,only
@codepen