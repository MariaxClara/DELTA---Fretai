export default function createAndAnimateMarker(map) {
  // Create an SVG Dom Icon for the marker
  var svg = `<svg xmlns="http://www.w3.org/2000/svg" class="svg-icon" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="1" y="5" width="22" height="13" rx="2" ry="2"></rect>
      <path d="M5 16v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1"></path>
      <circle cx="6.5" cy="17.5" r="2.5"></circle>
      <circle cx="17.5" cy="17.5" r="2.5"></circle>
      <path d="M2 10h4"></path>
      <path d="M18 10h4"></path>
      <path d="M10 10h4"></path>
    </svg>`;
  var domIcon = new H.map.DomIcon(svg);

  // Define the initial position for the marker (fallback in case geolocation is unavailable)
  var initialPosition = { lat: 50.90978, lng: 10.87203 };

  // Create the marker and add it to the map
  var marker = new H.map.DomMarker(initialPosition, { icon: domIcon });
  //map.addObject(marker);

  // Periodically update the marker's position
  setTimeout(updateMarkerPosition, 500);
  setInterval(updateMarkerPosition, 5000);

  /**
   * Update the marker's position based on the user's current geolocation.
   */
  function updateMarkerPosition() {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
              function (position) {
                  const { latitude, longitude } = position.coords;
                  const newPosition = { lat: latitude, lng: longitude };

                  // Animate the marker's movement to the new position
                  ease(
                      marker.getGeometry(),
                      newPosition,
                      4000,
                      function (coord) {
                          marker.setGeometry(coord);
                      }
                  );
              },
              function (error) {
                  console.error("Geolocation error:", error.message);
              },
              {
                  enableHighAccuracy: true,
                  timeout: 10000,
                  maximumAge: 0
              }
          );
      } else {
          console.warn("Geolocation is not supported by this browser.");
      }
  }
  return marker;
}

/**
* Ease function
* @param   {H.geo.IPoint} startCoord   start geo coordinate
* @param   {H.geo.IPoint} endCoord     end geo coordinate
* @param   {number} durationMs         duration of animation between start & end coordinates
* @param   {function} onStep           callback executed each step
* @param   {function} [onComplete]     callback executed at the end
*/
function ease(
  startCoord = { lat: 0, lng: 0 },
  endCoord = { lat: 1, lng: 1 },
  durationMs = 200,
  onStep = console.log,
  onComplete = function () {}
) {
  var raf = window.requestAnimationFrame || function (f) { window.setTimeout(f, 16); },
      stepCount = durationMs / 16,
      valueIncrementLat = (endCoord.lat - startCoord.lat) / stepCount,
      valueIncrementLng = (endCoord.lng - startCoord.lng) / stepCount,
      sinValueIncrement = Math.PI / stepCount,
      currentValueLat = startCoord.lat,
      currentValueLng = startCoord.lng,
      currentSinValue = 0;

  function step() {
      currentSinValue += sinValueIncrement;
      currentValueLat += valueIncrementLat * (Math.sin(currentSinValue) ** 2) * 2;
      currentValueLng += valueIncrementLng * (Math.sin(currentSinValue) ** 2) * 2;

      if (currentSinValue < Math.PI) {
          onStep({ lat: currentValueLat, lng: currentValueLng });
          raf(step);
      } else {
          onStep(endCoord);
          onComplete();
      }
  }

  raf(step);
}