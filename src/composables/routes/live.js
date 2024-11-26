export default function createAndAnimateMarker(map) {
  // Create an SVG Dom Icon for the marker
  var svg = `<svg xmlns="http://www.w3.org/2000/svg" class="svg-icon" width="10px" height="10px">
      <circle cx="5" cy="5" r="4" fill="rgb(250, 127, 0)" stroke-width="1" stroke="black" opacity="1"/>
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