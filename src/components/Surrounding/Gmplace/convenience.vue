<template>
  <div style="height: calc(100vh - 126px)">
    <div class="neighborhood-discovery" ref="neighborhooddiscovery">
      <div class="places-panel panel no-scroll" ref="PlacesPanel">
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

        <div class="results" ref="resultsTemplate">
          <ul class="place-results-list">
            <template v-for="place in data.places">
              <li class="place-result">
                <div class="text">
                  <button class="name">{{ place.name }}</button>

                  <div class="info" v-if="place.rating">
                    <span>{{ place.rating }}</span>
                    <img
                      src="https://fonts.gstatic.com/s/i/googlematerialicons/star/v15/24px.svg"
                      alt="rating"
                      class="star-icon"
                    />
                    <span v-if="place.numReviews"
                      >&nbsp;&nbsp; ({{ place.numReviews }})評論</span
                    >
                  </div>
                </div>
                <span
                  class="photo"
                  :style="`background-image: url(${place.photos[0].urlSmall});`"
                  aria-label="show photo in viewer"
                  v-if="place.photos"
                ></span>
              </li>
            </template>
          </ul>
        </div>
        <button class="show-more-button sticky">
          <span>顯示更多</span>
          <img
            class="right"
            src="https://fonts.gstatic.com/s/i/googlematerialicons/expand_more/v11/24px.svg"
            alt="expand"
          />
        </button>
      </div>
      <div class="details-panel panel text-h6" ref="DetailsPanel">
        <div class="navbar">
          <button class="back-button">
            <img
              class="icon"
              src="https://fonts.gstatic.com/s/i/googlematerialicons/arrow_back/v11/24px.svg"
              alt="back"
            />
            回上頁(列表)
          </button>
        </div>
        <template v-if="data.detail">
          <header>
            <h2>{{ data.detail.name }}</h2>
            <div class="info">
              <span class="star-rating-numeric" v-if="data.detail.rating">{{
                data.detail.rating
              }}</span>
              <span v-for="star in data.detail.fullStarIcons">
                <img
                  src="https://fonts.gstatic.com/s/i/googlematerialicons/star/v15/24px.svg"
                  alt="full star"
                  class="star-icon"
                />
              </span>
              <span v-for="star in data.detail.halfStarIcons">
                <img
                  src="https://fonts.gstatic.com/s/i/googlematerialicons/star_half/v17/24px.svg"
                  alt="half star"
                  class="star-icon"
                />
              </span>
              <span v-for="star in data.detail.emptyStarIcons">
                <img
                  src="https://fonts.gstatic.com/s/i/googlematerialicons/star_outline/v9/24px.svg"
                  alt="empty star"
                  class="star-icon"
                />
              </span>
            </div>
            <a
              :href="data.detail.url"
              target="_blank"
              v-if="data.detail.numReviews"
              >{{ data.detail.numReviews }}評論</a
            >

            <!-- <span class="price-dollars" v-if="data.detail.priceLevel">
              {{ data.detail.dollarSigns }}$
            </span> -->
            <div class="info">
              <img
                src="https://fonts.gstatic.com/s/i/googlematerialicons/directions_car/v11/24px.svg"
                alt="car travel"
                class="travel-icon"
              />
              <span
                >開車&nbsp;
                {{ data.detail.duration.text }}
              </span>
            </div>
          </header>
          <div class="section">
            <div class="contact" v-if="data.detail.address">
              <img
                src="https://fonts.gstatic.com/s/i/googlematerialicons/place/v10/24px.svg"
                alt="Address"
                class="icon"
              />
              <div class="text">{{ data.detail.address }}</div>
            </div>
            <div class="contact" v-if="data.detail.website">
              <img
                src="https://fonts.gstatic.com/s/i/googlematerialicons/public/v10/24px.svg"
                alt="Website"
                class="icon"
              />
              <div class="text">
                <a :href="data.detail.website" target="_blank">{{
                  data.detail.websiteDomain
                }}</a>
              </div>
            </div>
            <div class="contact" v-if="data.detail.phoneNumber">
              <img
                src="https://fonts.gstatic.com/s/i/googlematerialicons/phone/v10/24px.svg"
                alt="Phone number"
                class="icon"
              />
              <div class="text">{{ data.detail.phoneNumber }}</div>
            </div>
            <div class="contact" v-if="data.detail.openingHours">
              <img
                src="https://fonts.gstatic.com/s/i/googlematerialicons/schedule/v12/24px.svg"
                alt="Opening hours"
                class="icon"
              />
              <div class="text">
                <div v-for="time in data.detail.openingHours">
                  <span class="weekday">{{ time.days }}</span>
                  <span class="hours">{{ time.hours }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="photos section">
            <template
              v-for="photo in data.detail.photos"
              v-if="data.detail.photos"
            >
              <button
                class="photo"
                :style="`background-image: url( ${photo.urlSmall} )`"
                aria-label="show photo in viewer"
              ></button>
            </template>
          </div>
          <div class="reviews section" v-if="data.detail.reviews">
            <p class="attribution">Reviews by Google users</p>
            <template v-for="review in data.detail.reviews">
              <div class="review">
                <a
                  class="reviewer-identity"
                  :href="`${review.author_url}`"
                  target="_blank"
                >
                  <div
                    class="reviewer-avatar"
                    :style="`background-image: url( ${review.profile_photo_url} )`"
                  ></div>
                  <div class="reviewer-name">{{ review.author_name }}</div>
                </a>
                <div class="rating info">
                  <span v-for="star in data.detail.fullStarIcons">
                    <img
                      src="https://fonts.gstatic.com/s/i/googlematerialicons/star/v15/24px.svg"
                      alt="full star"
                      class="star-icon"
                    />
                  </span>
                  <span v-for="star in data.detail.halfStarIcons">
                    <img
                      src="https://fonts.gstatic.com/s/i/googlematerialicons/star_half/v17/24px.svg"
                      alt="half star"
                      class="star-icon"
                    />
                  </span>
                  <span v-for="star in data.detail.emptyStarIcons">
                    <img
                      src="https://fonts.gstatic.com/s/i/googlematerialicons/star_outline/v9/24px.svg"
                      alt="empty star"
                      class="star-icon"
                    />
                  </span>
                  <span class="review-time">{{
                    review.relative_time_description
                  }}</span>
                </div>
                <div class="info">{{ review.text }}</div>
              </div>
            </template>
          </div>
        </template>
      </div>
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
import { ref, reactive, onMounted, nextTick } from "vue";

const props = defineProps({
  center: Object,
  placeId: Array,
});

// console.log(props.center, props.placeId);

const data = reactive({
  places: [],
  detail: null,
});

/* ref =================================*/
const neighborhooddiscovery = ref(null);
const resultsTemplate = ref(null);
const map = ref(null);

/** Hides a DOM element and optionally focuses on focusEl. */
function hideElement(el, focusEl) {
  // console.log("hide", el, focusEl);
  el.style.display = "none";
  if (focusEl) focusEl.focus();
}

/** Shows a DOM element that has been hidden and optionally focuses on focusEl. */
function showElement(el, focusEl) {
  // console.log("show", el, focusEl);
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
  pois: props.placeId,

  // [
  //   { placeId: "ChIJ7bo8UIQXbjQRFkgl26ajSYU" },
  //   { placeId: "ChIJzyf7jZoXbjQRt7aDa1spA4k" },
  //   { placeId: "ChIJvYsuO5sXbjQRu7R8fyAdthk" },
  //   { placeId: "ChIJg716NpQXbjQR0xgO81BU9Ok" },
  //   { placeId: "ChIJpRIuCJAXbjQRJpZaNm3_Bl8" },
  //   { placeId: "ChIJETg4op0XbjQRe__xManuy6Q" },
  //   { placeId: "ChIJzUh2UYQXbjQR6AoWXId9_qY" },
  //   { placeId: "ChIJNRXbw74XbjQRcXgLfefbkSE" },
  //   { placeId: "ChIJSXiBc58XbjQRhyzuxmWhW54" },
  //   { placeId: "ChIJyQCybJoXbjQRWXnM4F9kg5E" },
  //   { placeId: "ChIJrfNIpJgXbjQRiwxdnm0BMKw" },
  //   { placeId: "ChIJy878cJsXbjQRHOQJlwvHHOQ" },
  //   { placeId: "ChIJyd5jt58XbjQRcakRgxvT1MM" },
  //   { placeId: "ChIJW5Yo9kIXbjQRkGQF2T6QVcA" },
  //   { placeId: "ChIJBVBjtYQXbjQRTBE6_Cu7Fzw" },
  //   { placeId: "ChIJjQzv6LwXbjQROqDfqNgUE5w" },
  //   { placeId: "ChIJy_NzvoQXbjQRIvWvKH-Hjzs" },
  //   { placeId: "ChIJEztQyZ8XbjQRSiIrrBshfIE" },
  //   { placeId: "ChIJiQ8Cx4QXbjQREsyGGWFT-g4" },
  // ],

  centerMarker: { icon: "circle" },
  mapRadius: 2000,
  mapOptions: {
    center: props.center || { lat: 22.6829699, lng: 120.4879137 },
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

const widget = CONFIGURATION; //當成this

/* 主程式＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝*/
function NeighborhoodDiscovery(configuration) {
  const widgetEl = neighborhooddiscovery.value;
  widget.center = configuration.mapOptions.center;
  widget.places = configuration.pois || [];

  initializeMap();
  initializePlaceDetails();
  initializeSidePanel();

  // Initialize additional capabilities ----------------------------------
  initializeSearchInput();
  initializeDistanceMatrix();
  initializeDirections();

  // console.log("widget", widget);
  // console.log("data.places", data.places);

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
    widget.map.fitBounds(widget.mapBounds, /* padding= */ 0);
    widget.map.addListener("click", (e) => {
      // Check if user clicks on a POI pin from the base map.
      if (e.placeId) {
        e.stop();
        widget.selectPlaceById(e.placeId);
      }
    });
    widget.map.addListener("zoom_changed", () => {
      // Customize map styling to show/hide default POI pins or text based on zoom level.
      const hideDefaultPoiPins = widget.map.getZoom() < ND_DEFAULT_POI_MIN_ZOOM;
      widget.map.setOptions({
        styles: [
          {
            featureType: "poi",
            elementType: hideDefaultPoiPins ? "labels" : "labels.text",
            stylers: [{ visibility: "off" }],
          },
        ],
      });
    });

    const markerPath = widgetEl
      .querySelector(".marker-pin path")
      .getAttribute("d");
    const drawMarker = function (
      title,
      position,
      fillColor,
      strokeColor,
      labelText
    ) {
      return new google.maps.Marker({
        title: title,
        position: position,
        map: widget.map,
        icon: {
          path: markerPath,
          fillColor: fillColor,
          fillOpacity: 1,
          strokeColor: strokeColor,
          anchor: new google.maps.Point(13, 35),
          labelOrigin: new google.maps.Point(13, 13),
        },
        label: {
          text: labelText,
          color: "white",
          fontSize: "16px",
          fontFamily: "Material Icons",
        },
      });
    };

    // Add marker at the center location (if specified).
    if (configuration.centerMarker && configuration.centerMarker.icon) {
      drawMarker(
        "Home",
        widget.center,
        "#1A73E8",
        "#185ABC",
        configuration.centerMarker.icon
      );
    }

    // Add marker for the specified Place object.
    widget.addPlaceMarker = function (place) {
      // console.log(place);
      place.marker = drawMarker(
        place.name,
        place.coords,
        "#EA4335",
        "#C5221F",
        place.icon
      );
      // console.log(place);
      place.marker.addListener(
        "click",
        () => void widget.selectPlaceById(place.placeId)
      );
    };

    // Fit map to bounds that contain all markers of the specified Place objects.
    widget.updateBounds = function (places) {
      // console.log(places);
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(widget.center);
      for (let place of places) {
        bounds.extend(place.marker.getPosition());
      }
      widget.map.fitBounds(bounds, /* padding= */ 100);
    };

    // Marker used to highlight a place from Autocomplete search.
    widget.selectedPlaceMarker = new google.maps.Marker({
      title: "Point of Interest",
    });
  }

  /** Initializes Place Details service for the widget. */
  function initializePlaceDetails() {
    const detailsService = new google.maps.places.PlacesService(widget.map);
    const placeIdsToDetails = new Map(); // Create object to hold Place results.

    for (let place of widget.places) {
      placeIdsToDetails.set(place.placeId, place);
      place.fetchedFields = new Set(["place_id"]);
    }

    widget.fetchPlaceDetails = function (placeId, fields, callback) {
      if (!placeId || !fields) return;

      // Check for field existence in Place object.
      let place = placeIdsToDetails.get(placeId);
      if (!place) {
        place = {
          placeId: placeId,
          fetchedFields: new Set(["place_id"]),
        };
        placeIdsToDetails.set(placeId, place);
      }
      const missingFields = fields.filter(
        (field) => !place.fetchedFields.has(field)
      );
      if (missingFields.length === 0) {
        callback(place);
        return;
      }

      const request = { placeId: placeId, fields: missingFields };
      let retryCount = 0;

      // 查詢詳細資料，調整格式
      const processResult = function (result, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          if (
            status ===
              google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT &&
            retryCount < 5
          ) {
            const delay = (Math.pow(2, retryCount) + Math.random()) * 500;

            // If query limit has been reached, wait before making another call;
            // Increase wait time of each successive retry with exponential backoff
            // and terminate after five failed attempts.
            // 如果已達到查詢限制，則等待再進行另一個調用；
            // 使用指數退避增加每次連續重試的等待時間
            // 並在五次嘗試失敗後終止。

            setTimeout(
              () => void detailsService.getDetails(request, processResult),
              delay
            );
            retryCount++;
          }
          return;
        }
        // Basic details.
        if (result.name) place.name = result.name;
        if (result.geometry) place.coords = result.geometry.location;
        if (result.formatted_address) place.address = result.formatted_address;
        if (result.photos) {
          place.photos = result.photos
            .map((photo) => ({
              urlSmall: photo.getUrl({ maxWidth: 200, maxHeight: 200 }),
              urlLarge: photo.getUrl({ maxWidth: 1200, maxHeight: 1200 }),
              attrs: photo.html_attributions,
            }))
            .slice(0, ND_NUM_PLACE_PHOTOS_MAX);
        }
        if (result.types) {
          place.type = formatPlaceType(result.types[0]);
          place.icon = ND_MARKER_ICONS_BY_TYPE["_default"];
          for (let type of result.types) {
            if (type in ND_MARKER_ICONS_BY_TYPE) {
              place.type = formatPlaceType(type);
              place.icon = ND_MARKER_ICONS_BY_TYPE[type];
              break;
            }
          }
        }
        if (result.url) place.url = result.url;

        // Contact details.
        if (result.website) {
          place.website = result.website;
          const url = new URL(place.website);
          place.websiteDomain = url.hostname;
        }
        if (result.formatted_phone_number)
          place.phoneNumber = result.formatted_phone_number;
        if (result.opening_hours)
          place.openingHours = parseDaysHours(result.opening_hours);

        // Review details.
        if (result.rating) {
          place.rating = result.rating;
          addStarIcons(place);
        }
        if (result.user_ratings_total)
          place.numReviews = result.user_ratings_total;
        if (result.price_level) {
          place.priceLevel = result.price_level;
          place.dollarSigns = initArray(result.price_level);
        }
        if (result.reviews) {
          place.reviews = result.reviews;
          for (let review of place.reviews) {
            addStarIcons(review);
          }
        }

        for (let field of missingFields) {
          place.fetchedFields.add(field);
        }

        // console.log(place);
        // 這裡設定data.place 會少掉開車資訊
        callback(place);
      };

      // Use result from Place Autocomplete if available.
      if (widget.placeIdsToAutocompleteResults) {
        const autoCompleteResult =
          widget.placeIdsToAutocompleteResults.get(placeId);
        if (autoCompleteResult) {
          processResult(
            autoCompleteResult,
            google.maps.places.PlacesServiceStatus.OK
          );
          return;
        }
      }
      detailsService.getDetails(request, processResult);
    };
  }

  /** Initializes the side panel that holds curated POI results. */
  function initializeSidePanel() {
    const placesPanelEl = widgetEl.querySelector(".places-panel");
    const detailsPanelEl = widgetEl.querySelector(".details-panel");
    const placeResultsEl = widgetEl.querySelector(".place-results-list");
    const showMoreButtonEl = widgetEl.querySelector(".show-more-button");
    const photoModalEl = widgetEl.querySelector(".photo-modal");

    // Show specified POI photo in a modal.
    const showPhotoModal = function (photo, placeName) {
      const prevFocusEl = document.activeElement;
      const imgEl = photoModalEl.querySelector("img");
      imgEl.src = photo.urlLarge;
      const backButtonEl = photoModalEl.querySelector(".back-button");
      backButtonEl.addEventListener("click", () => {
        hideElement(photoModalEl, prevFocusEl);
        imgEl.src = "";
      });
      photoModalEl.querySelector(".photo-place").innerHTML = placeName;
      photoModalEl.querySelector(".photo-attrs span").innerHTML = photo.attrs;
      const attributionEl = photoModalEl.querySelector(".photo-attrs a");
      if (attributionEl) attributionEl.setAttribute("target", "_blank");
      photoModalEl.addEventListener("click", (e) => {
        if (e.target === photoModalEl) {
          hideElement(photoModalEl, prevFocusEl);
          imgEl.src = "";
        }
      });
      showElement(photoModalEl, backButtonEl);
    };

    // Select a place by id and show details.
    let selectedPlaceId;
    widget.selectPlaceById = function (placeId, panToMarker) {
      if (selectedPlaceId === placeId) return;
      selectedPlaceId = placeId;
      const prevFocusEl = document.activeElement;

      const showDetailsPanel = function (place) {
        // detailsPanelEl.innerHTML = detailsTemplate(place);

        const backButtonEl = detailsPanelEl.querySelector(".back-button");
        // console.log(backButtonEl);
        backButtonEl.addEventListener("click", () => {
          hideElement(detailsPanelEl, prevFocusEl);
          selectedPlaceId = undefined;
          widget.updateDirections();
          widget.selectedPlaceMarker.setMap(null);
        });
        detailsPanelEl.querySelectorAll(".photo").forEach((photoEl, i) => {
          photoEl.addEventListener("click", () => {
            showPhotoModal(place.photos[i], place.name);
          });
        });
        showElement(detailsPanelEl, backButtonEl);
        detailsPanelEl.scrollTop = 0;
      };

      const processResult = function (place) {
        if (place.marker) {
          widget.selectedPlaceMarker.setMap(null);
        } else {
          widget.selectedPlaceMarker.setPosition(place.coords);
          widget.selectedPlaceMarker.setMap(widget.map);
        }
        if (panToMarker) {
          widget.map.panTo(place.coords);
        }
        showDetailsPanel(place);
        widget.fetchDuration(place, showDetailsPanel);
        widget.updateDirections(place);
      };

      widget.fetchPlaceDetails(
        placeId,
        [
          "name",
          "types",
          "geometry.location",
          "formatted_address",
          "photo",
          "url",
          "website",
          "formatted_phone_number",
          "opening_hours",
          "rating",
          "user_ratings_total",
          "price_level",
          "review",
        ],
        processResult
      );
    };

    /*
     * Render the specified place objects and append them to the POI list.
     * 列表顯示在螢幕side上
     */
    const renderPlaceResults = function (places, startIndex) {
      // // 因DOM無法正確抓取，先將Ｍarker加上

      places.forEach((resultEl, i) => {
        // const place = places[i - startIndex];
        const place = places[i];
        if (!place) return;

        // console.log("place", place);
        // 加上 Marker
        widget.addPlaceMarker(place);

        // 加入響應式，讓template可見
        data.places.push({
          name: place.name,
          placeId: place.placeId,
          photos: place.photos,
          rating: place.rating,
          numReviews: place.numReviews,
          priceLevel: place.priceLevel,
          type: place.type,
        });
      });
      // console.log(placesPanelEl);
      // console.log(resultsTemplate.value);

      nextTick(() => {
        placeResultsEl
          .querySelectorAll(".place-result")
          .forEach((resultEl, i) => {
            const place = places[i - startIndex];
            if (!place) return;
            // Clicking anywhere on the item selects the place.
            // Additionally, create a button element to make this behavior
            // accessible under tab navigation.
            resultEl.addEventListener("click", () => {
              widget.selectPlaceById(place.placeId, /* panToMarker= */ true);
            });
            resultEl.querySelector(".name").addEventListener("click", (e) => {
              widget.selectPlaceById(place.placeId, /* panToMarker= */ true);
              e.stopPropagation();
            });

            // 若商家沒有地圖會出錯，先做判斷
            const photoEL = resultEl.querySelector(".photo");
            if (photoEL) {
              resultEl
                .querySelector(".photo")
                .addEventListener("click", (e) => {
                  showPhotoModal(place.photos[0], place.name);
                  e.stopPropagation();
                });
            }
            widget.addPlaceMarker(place);
          });
      });
    };

    // Index of next Place object to show in the POI list.
    let nextPlaceIndex = 0;

    // Fetch and show basic info for the next N places.
    const showNextPlaces = function (n) {
      const nextPlaces = widget.places.slice(
        nextPlaceIndex,
        nextPlaceIndex + n
      );
      if (nextPlaces.length < 1) {
        hideElement(showMoreButtonEl);
        return;
      }
      showMoreButtonEl.disabled = true;
      // Keep track of the number of Places calls that have not finished.
      let count = nextPlaces.length;
      for (let place of nextPlaces) {
        const processResult = function (place) {
          count--;
          if (count > 0) return;
          renderPlaceResults(nextPlaces, nextPlaceIndex);
          nextPlaceIndex += n;
          widget.updateBounds(widget.places.slice(0, nextPlaceIndex));
          const hasMorePlacesToShow = nextPlaceIndex < widget.places.length;
          if (hasMorePlacesToShow || hasHiddenContent(placesPanelEl)) {
            showElement(showMoreButtonEl);
            showMoreButtonEl.disabled = false;
          } else {
            hideElement(showMoreButtonEl);
          }
        };
        widget.fetchPlaceDetails(
          place.placeId,
          [
            "name",
            "types",
            "geometry.location",
            "photo",
            "rating",
            "user_ratings_total",
            "price_level",
          ],
          processResult
        );
      }
    };
    showNextPlaces(ND_NUM_PLACES_INITIAL);

    showMoreButtonEl.addEventListener("click", () => {
      placesPanelEl.classList.remove("no-scroll");
      showMoreButtonEl.classList.remove("sticky");
      showNextPlaces(ND_NUM_PLACES_SHOW_MORE);
    });
  }

  /** Initializes Search Input for the widget. */
  function initializeSearchInput() {
    const searchInputEl = widgetEl.querySelector(".place-search-input");
    widget.placeIdsToAutocompleteResults = new Map();

    // Set up Autocomplete on the search input.
    const autocomplete = new google.maps.places.Autocomplete(searchInputEl, {
      types: ["establishment"],
      fields: [
        "place_id",
        "name",
        "types",
        "geometry.location",
        "formatted_address",
        "photo",
        "url",
        "website",
        "formatted_phone_number",
        "opening_hours",
        "rating",
        "user_ratings_total",
        "price_level",
        "review",
      ],
      bounds: widget.mapBounds,
      strictBounds: true,
    });
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      widget.placeIdsToAutocompleteResults.set(place.place_id, place);
      widget.selectPlaceById(place.place_id, /* panToMarker= */ true);
      searchInputEl.value = "";
    });
  }

  /** Initializes Distance Matrix service for the widget. */
  function initializeDistanceMatrix() {
    const distanceMatrixService = new google.maps.DistanceMatrixService();

    // Annotate travel times from the centered location to the specified place.
    widget.fetchDuration = function (place, callback) {
      if (!widget.center || !place || !place.coords || place.duration) return;
      const request = {
        origins: [widget.center],
        destinations: [place.coords],
        travelMode: google.maps.TravelMode.DRIVING,
      };
      distanceMatrixService.getDistanceMatrix(
        request,
        function (result, status) {
          if (status === google.maps.DistanceMatrixStatus.OK) {
            const trip = result.rows[0].elements[0];
            if (trip.status === google.maps.DistanceMatrixElementStatus.OK) {
              place.duration = trip.duration;
              callback(place);

              // 這裡宣染到template
              // console.log(place);
              data.detail = place;
            }
          }
        }
      );
    };
  }

  /** Initializes Directions service for the widget. */
  function initializeDirections() {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      preserveViewport: true,
    });

    // Update directions from the centered location to specified place.
    widget.updateDirections = function (place) {
      if (!widget.center || !place || !place.coords) {
        directionsRenderer.setMap(null);
        return;
      }
      // Use existing results if available.
      if (place.directions) {
        directionsRenderer.setMap(widget.map);
        directionsRenderer.setDirections(place.directions);
        return;
      }
      const request = {
        origin: widget.center,
        destination: place.coords,
        travelMode: google.maps.TravelMode.DRIVING,
      };
      directionsService.route(request, function (result, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          place.directions = result;
          directionsRenderer.setMap(widget.map);
          directionsRenderer.setDirections(result);
        }
      });
    };
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
  font-size: 1.2rem;
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
