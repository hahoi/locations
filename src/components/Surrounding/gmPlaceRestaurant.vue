<template>
  <div style="height: 80vh">
    <div class="neighborhood-discovery" ref="neighborhooddiscovery">
      <div class="places-panel panel no-scroll">
        <header class="navbar">
          <div class="search-input">
            <input
              class="place-search-input"
              placeholder="Search nearby places"
            />
            <button class="place-search-button">
              <img
                src="https://fonts.gstatic.com/s/i/googlematerialicons/search/v11/24px.svg"
                alt="search"
              />
            </button>
          </div>
        </header>
        <div class="results">
          <ul class="place-results-list"></ul>
        </div>
        <button class="show-more-button sticky">
          <span>Show More</span>
          <img
            class="right"
            src="https://fonts.gstatic.com/s/i/googlematerialicons/expand_more/v11/24px.svg"
            alt="expand"
          />
        </button>
      </div>
      <div class="details-panel panel"></div>
      <div class="map" ref="map"></div>
      <div class="photo-modal">
        <img alt="place photo" />
        <div>
          <button class="back-button">
            <img
              class="icon"
              src="https://fonts.gstatic.com/s/i/googlematerialicons/arrow_back/v11/24px.svg"
              alt="back"
            />
          </button>
          <div class="photo-text">
            <div class="photo-place"></div>
            <div class="photo-attrs">Photo by <span></span></div>
          </div>
        </div>
      </div>
      <svg
        class="marker-pin"
        xmlns="http://www.w3.org/2000/svg"
        width="26"
        height="38"
        fill="none"
      >
        <path
          d="M13 0C5.817 0 0 5.93 0 13.267c0 7.862 5.59 10.81 9.555 17.624C12.09 35.248 11.342 38 13 38c1.723 0 .975-2.817 3.445-7.043C20.085 24.503 26 21.162 26 13.267 26 5.93 20.183 0 13 0Z"
        />
      </svg>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";

/** Hides a DOM element and optionally focuses on focusEl. */
function hideElement(el, focusEl) {
  el.style.display = "none";
  if (focusEl) focusEl.focus();
}

/** Shows a DOM element that has been hidden and optionally focuses on focusEl. */
function showElement(el, focusEl) {
  el.style.display = "block";
  if (focusEl) focusEl.focus();
}

/** Determines if a DOM element contains content that cannot be scrolled into view. */
function hasHiddenContent(el) {
  const noscroll = window.getComputedStyle(el).overflowY.includes("hidden");
  return noscroll && el.scrollHeight > el.clientHeight;
}

/** Format a Place Type string by capitalizing and replacing underscores with spaces. */
function formatPlaceType(str) {
  const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
  return capitalized.replace(/_/g, " ");
}

/** Initializes an array of zeros with the given size. */
function initArray(arraySize) {
  const array = [];
  while (array.length < arraySize) {
    array.push(0);
  }
  return array;
}

/** Assigns star icons to an object given its rating (out of 5). */
function addStarIcons(obj) {
  if (!obj.rating) return;
  const starsOutOfTen = Math.round(2 * obj.rating);
  const fullStars = Math.floor(starsOutOfTen / 2);
  const halfStars = fullStars !== starsOutOfTen / 2 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  // Express stars as arrays to make iterating in Handlebars easy.
  obj.fullStarIcons = initArray(fullStars);
  obj.halfStarIcons = initArray(halfStars);
  obj.emptyStarIcons = initArray(emptyStars);
}

/**
 * Constructs an array of opening hours by day from a PlaceOpeningHours object,
 * where adjacent days of week with the same hours are collapsed into one element.
 */
function parseDaysHours(openingHours) {
  const daysHours = openingHours.weekday_text
    .map((e) => e.split(/\:\s+/))
    .map((e) => ({ days: e[0].substr(0, 3), hours: e[1] }));

  for (let i = 1; i < daysHours.length; i++) {
    if (daysHours[i - 1].hours === daysHours[i].hours) {
      if (daysHours[i - 1].days.indexOf("-") !== -1) {
        daysHours[i - 1].days = daysHours[i - 1].days.replace(
          /\w+$/,
          daysHours[i].days
        );
      } else {
        daysHours[i - 1].days += " - " + daysHours[i].days;
      }
      daysHours.splice(i--, 1);
    }
  }
  return daysHours;
}

/** Number of POIs to show on widget load. */
const ND_NUM_PLACES_INITIAL = 5;

/** Number of additional POIs to show when 'Show More' button is clicked. */
const ND_NUM_PLACES_SHOW_MORE = 5;

/** Maximum number of place photos to show on the details panel. */
const ND_NUM_PLACE_PHOTOS_MAX = 6;

/** Minimum zoom level at which the default map POI pins will be shown. */
const ND_DEFAULT_POI_MIN_ZOOM = 18;

/** Mapping of Place Types to Material Icons used to render custom map markers. */
const ND_MARKER_ICONS_BY_TYPE = {
  // Full list of icons can be found at https://fonts.google.com/icons
  _default: "circle",
  restaurant: "restaurant",
  cafe: "local_cafe",
  night_club: "nightlife",
  bar: "local_bar",
  park: "park",
  clothing_store: "local_mall",
  department_store: "local_mall",
  electronics_store: "local_mall",
  home_goods_store: "local_mall",
  shopping_mall: "local_mall",
  tourist_attraction: "local_see",
};

const CONFIGURATION = {
  capabilities: {
    search: true,
    distances: true,
    directions: true,
    contacts: true,
    atmospheres: true,
    thumbnails: true,
  },
  pois: [
    { placeId: "ChIJ7bo8UIQXbjQRFkgl26ajSYU" },
    { placeId: "ChIJzyf7jZoXbjQRt7aDa1spA4k" },
    { placeId: "ChIJvYsuO5sXbjQRu7R8fyAdthk" },
    { placeId: "ChIJg716NpQXbjQR0xgO81BU9Ok" },
    { placeId: "ChIJpRIuCJAXbjQRJpZaNm3_Bl8" },
    { placeId: "ChIJETg4op0XbjQRe__xManuy6Q" },
    { placeId: "ChIJzUh2UYQXbjQR6AoWXId9_qY" },
    { placeId: "ChIJNRXbw74XbjQRcXgLfefbkSE" },
    { placeId: "ChIJSXiBc58XbjQRhyzuxmWhW54" },
    { placeId: "ChIJyQCybJoXbjQRWXnM4F9kg5E" },
    { placeId: "ChIJrfNIpJgXbjQRiwxdnm0BMKw" },
    { placeId: "ChIJy878cJsXbjQRHOQJlwvHHOQ" },
    { placeId: "ChIJyd5jt58XbjQRcakRgxvT1MM" },
    { placeId: "ChIJW5Yo9kIXbjQRkGQF2T6QVcA" },
    { placeId: "ChIJBVBjtYQXbjQRTBE6_Cu7Fzw" },
    { placeId: "ChIJjQzv6LwXbjQROqDfqNgUE5w" },
    { placeId: "ChIJy_NzvoQXbjQRIvWvKH-Hjzs" },
    { placeId: "ChIJEztQyZ8XbjQRSiIrrBshfIE" },
    { placeId: "ChIJiQ8Cx4QXbjQREsyGGWFT-g4" },
  ],
  centerMarker: { icon: "circle" },
  mapRadius: 2000,
  mapOptions: {
    center: { lat: 22.6829699, lng: 120.4879137 },
    fullscreenControl: true,
    mapTypeControl: true,
    streetViewControl: false,
    zoom: 16,
    zoomControl: true,
    maxZoom: 20,
  },
  mapsApiKey: "AIzaSyBIp6u_X-pnki-DLedgYWMPQskFSIrstaE",
};
onMounted(() => {
  new NeighborhoodDiscovery(CONFIGURATION);
});

/* ref =================================*/
const neighborhooddiscovery = ref(null);
const map = ref(null);

/* 主程式＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝*/
function NeighborhoodDiscovery(configuration) {
  const widget = CONFIGURATION; //當成this

  const widgetEl = neighborhooddiscovery.value;
  widget.center = configuration.mapOptions.center;
  widget.places = configuration.pois || [];
  initializeMap();
  // console.log(widget.center);

  function initializeMap() {
    const mapOptions = configuration.mapOptions;
    widget.mapBounds = new google.maps.Circle({
      center: widget.center,
      radius: configuration.mapRadius,
    }).getBounds();
    mapOptions.restriction = { latLngBounds: widget.mapBounds };
    mapOptions.mapTypeControlOptions = {
      position: google.maps.ControlPosition.TOP_RIGHT,
    };
    widget.map = new google.maps.Map(
      widgetEl.querySelector(".map"),
      mapOptions
    );
    console.log(widget.map);
  }
} //end NeighborhoodDiscovery

/** Initializes the interactive map and adds place markers. */
</script>
<style scoped>
.neighborhood-discovery {
  box-sizing: border-box;
  font-family: "Roboto", sans-serif;
  height: 100%;
  position: relative;
  width: 100%;
}

.neighborhood-discovery a {
  color: #4285f4;
  text-decoration: none;
}

.neighborhood-discovery button {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font: inherit;
  font-size: inherit;
  padding: 0;
}

.neighborhood-discovery .info {
  color: #555;
  font-size: 0.9em;
  margin-top: 0.3em;
}

.neighborhood-discovery .panel {
  background: white;
  bottom: 0;
  box-sizing: border-box;
  left: 0;
  overflow-y: auto;
  position: absolute;
  top: 0;
  width: 20em;
}

.neighborhood-discovery .panel.no-scroll {
  overflow-y: hidden;
}

.neighborhood-discovery .photo {
  background-color: #dadce0;
  background-position: center;
  background-size: cover;
  border-radius: 0.3em;
  cursor: pointer;
}

.neighborhood-discovery .navbar {
  background: white;
  position: sticky;
  top: 0;
  z-index: 2;
}

.neighborhood-discovery .right {
  float: right;
}

.neighborhood-discovery .star-icon {
  filter: invert(88%) sepia(60%) saturate(2073%) hue-rotate(318deg)
    brightness(93%) contrast(104%);
  height: 1.2em;
  margin-right: -0.3em;
  margin-top: -0.08em;
  vertical-align: top;
  width: 1.2em;
}

.neighborhood-discovery .star-icon:last-child {
  margin-right: 0.2em;
}

.neighborhood-discovery .travel-icon {
  height: 1.2em;
  margin-top: -0.08em;
  vertical-align: top;
}

.neighborhood-discovery .map {
  bottom: 0;
  left: 20em;
  position: absolute;
  right: 0;
  top: 0;
}

@media only screen and (max-width: 640px) {
  .neighborhood-discovery .panel {
    right: 0;
    top: 50%;
    width: unset;
  }

  .neighborhood-discovery .map {
    bottom: 50%;
    left: 0;
  }
}

/* --------------------------- PLACES PANEL --------------------------- */

.neighborhood-discovery .places-panel {
  box-shadow: 0 0 10px rgb(60 64 67 / 28%);
  z-index: 1;
}

.neighborhood-discovery .places-panel header {
  padding: 0.5em;
}

.neighborhood-discovery .search-input input {
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3em;
  box-sizing: border-box;
  font-size: 1em;
  height: 2.2em;
  padding: 0 2.5em 0 1em;
  width: 100%;
}

.neighborhood-discovery .search-input button {
  position: absolute;
  right: 0.8em;
  top: 0.8em;
}

.neighborhood-discovery .show-more-button {
  bottom: 0.5em;
  display: none;
  left: 28%;
  line-height: 1.5em;
  padding: 0.6em;
  position: relative;
  width: 44%;
}

.neighborhood-discovery .show-more-button.sticky {
  background: white;
  border-radius: 1.5em;
  box-shadow: 0 4px 10px rgb(60 64 67 / 28%);
  position: sticky;
  z-index: 2;
}

.neighborhood-discovery .show-more-button:disabled {
  opacity: 0.5;
}

.neighborhood-discovery .place-results-list {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.neighborhood-discovery .place-result {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  cursor: pointer;
  display: flex;
  padding: 0.8em;
}

.neighborhood-discovery .place-result .text {
  flex-grow: 1;
}

.neighborhood-discovery .place-result .name {
  font-size: 1em;
  font-weight: 500;
  text-align: left;
}

.neighborhood-discovery .place-result .photo {
  flex: 0 0 4em;
  height: 4em;
  margin-left: 0.8em;
}

/* -------------------------- DETAILS PANEL --------------------------- */

.neighborhood-discovery .details-panel {
  display: none;
  z-index: 20;
}

.neighborhood-discovery .details-panel .back-button {
  color: #4285f4;
  padding: 0.9em;
}

.neighborhood-discovery .details-panel .back-button .icon {
  /* Match link color #4285f4 */
  filter: invert(47%) sepia(71%) saturate(2372%) hue-rotate(200deg)
    brightness(97%) contrast(98%);
  height: 1.2em;
  width: 1.2em;
  vertical-align: bottom;
}

.neighborhood-discovery .details-panel header {
  padding: 0.9em;
}

.neighborhood-discovery .details-panel h2 {
  font-size: 1.4em;
  font-weight: 400;
  margin: 0;
}

.neighborhood-discovery .details-panel .section {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  padding: 0.9em;
}

.neighborhood-discovery .details-panel .contact {
  align-items: center;
  display: flex;
  font-size: 0.9em;
  margin: 0.8em 0;
}

.neighborhood-discovery .details-panel .contact .icon {
  width: 1.5em;
  height: 1.5em;
}

.neighborhood-discovery .details-panel .contact .text {
  margin-left: 1em;
}

.neighborhood-discovery .details-panel .contact .weekday {
  display: inline-block;
  width: 5em;
}

.neighborhood-discovery .details-panel .photos {
  text-align: center;
}

.neighborhood-discovery .details-panel .photo {
  display: inline-block;
  height: 5.5em;
  width: 5.5em;
}

.neighborhood-discovery .details-panel .review {
  margin-top: 1.2em;
}

.neighborhood-discovery .details-panel .review .reviewer-avatar {
  background-repeat: no-repeat;
  background-size: cover;
  float: left;
  height: 1.8em;
  margin-right: 0.8em;
  width: 1.8em;
}

.neighborhood-discovery .details-panel .review .reviewer-name {
  color: #202124;
  font-weight: 500;
  line-height: 1.8em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.neighborhood-discovery .details-panel .review .rating {
  margin: 0.5em 0;
}

.neighborhood-discovery .details-panel .attribution {
  color: #777;
  margin: 0;
  font-size: 0.8em;
  font-style: italic;
}

/* --------------------------- PHOTO MODAL ---------------------------- */

.neighborhood-discovery .photo-modal {
  background: rgba(0, 0, 0, 0.8);
  display: none;
  height: 100%;
  position: fixed;
  width: 100%;
  z-index: 100;
}

.neighborhood-discovery .photo-modal > img {
  bottom: 0;
  left: 0;
  margin: auto;
  max-height: 100%;
  max-width: 100%;
  position: absolute;
  right: 0;
  top: 0;
}

.neighborhood-discovery .photo-modal > div {
  border-radius: 0.4em;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  margin: 1em;
  padding: 0.9em;
  position: absolute;
}

.neighborhood-discovery .photo-modal .back-button .icon {
  filter: brightness(0) invert(1);
  margin: 0.4em 0.6em 0 0;
}

.neighborhood-discovery .photo-modal .photo-text {
  float: right;
}

.neighborhood-discovery .photo-modal .photo-attrs {
  font-size: 0.8em;
  margin-top: 0.3em;
}
</style>
