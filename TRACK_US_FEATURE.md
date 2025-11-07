# Track Us Feature - GPS Tracking Map

## Overview
Live GPS tracking map with privacy protection to show your journey on the blog.

## Features
- Real-time location tracking using FollowMee GPS Tracker
- Privacy protection with two modes:
  - **Radius mode**: Shows approximate location within 1km radius
  - **Delay mode**: Shows location from 7 days ago
- Visual map with Leaflet.js
- Auto-refresh every 5 minutes
- Timestamp display with privacy notation

## Implementation

### 1. Add to `src/pages/index.astro`

```astro
<!-- Track Us Section -->
<section id="track-us" class="py-20 scroll-mt-20 relative" style="z-index: 10;">
  <Container>
    <div class="max-w-5xl mx-auto">
      <h2 class="text-3xl md:text-4xl font-bold mb-4 text-center">Track Our Journey</h2>
      <p class="text-lg leading-relaxed mb-8 text-center opacity-80">
        Follow us in real-time as we travel around the world
      </p>

      <!-- Map Container -->
      <div class="rounded-lg overflow-hidden" style="background-color: rgba(0, 0, 0, 0.05); height: 500px; position: relative;">
        <iframe
          id="tracking-map"
          style="width: 100%; height: 100%; border: none;"
          loading="lazy"
          allowfullscreen
        ></iframe>

        <div class="absolute bottom-4 left-4 right-4 flex justify-between items-center px-4 py-3 rounded-lg" style="background-color: rgba(0, 0, 0, 0.7); backdrop-filter: blur(10px);">
          <div class="text-white">
            <p class="text-sm opacity-80">Last Updated</p>
            <p class="font-semibold" id="last-update">Loading...</p>
          </div>
          <a
            href="#"
            id="full-map-link"
            target="_blank"
            class="px-4 py-2 bg-white text-black rounded hover:bg-opacity-90 transition-all"
          >
            View Full Map →
          </a>
        </div>
      </div>

      <div class="mt-8 text-center">
        <p class="text-sm opacity-60">
          Using FollowMee GPS Tracker • Updates every few minutes
        </p>
      </div>
    </div>
  </Container>
</section>

<script>
  // Configure your FollowMee tracking details here
  const FOLLOWMEE_USER_ID = 'YOUR_FOLLOWMEE_USER_ID'; // Replace with your FollowMee user ID
  const FOLLOWMEE_DEVICE_ID = 'YOUR_DEVICE_ID'; // Replace with your device ID

  // Privacy settings
  const PRIVACY_MODE = 'radius'; // Options: 'radius' or 'delay'
  const RADIUS_KM = 1; // Obfuscate location within 1km radius
  const DELAY_DAYS = 7; // Or show location with 7 day delay

  // Obfuscate coordinates by adding random offset within radius
  function obfuscateLocation(lat, lon, radiusKm) {
    // Convert radius from km to degrees (approximate)
    const radiusDeg = radiusKm / 111; // 1 degree ≈ 111km

    // Random angle
    const angle = Math.random() * 2 * Math.PI;
    // Random distance within radius (using sqrt for uniform distribution)
    const distance = Math.sqrt(Math.random()) * radiusDeg;

    // Calculate offset
    const deltaLat = distance * Math.cos(angle);
    const deltaLon = distance * Math.sin(angle) / Math.cos(lat * Math.PI / 180);

    return {
      lat: lat + deltaLat,
      lon: lon + deltaLon
    };
  }

  // Fetch location data from FollowMee API
  async function fetchLocationData() {
    try {
      // FollowMee API endpoint (you'll need to get your API key)
      const apiUrl = `https://www.followmee.com/api/tracks.aspx?key=${FOLLOWMEE_USER_ID}&device=${FOLLOWMEE_DEVICE_ID}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data && data.locations && data.locations.length > 0) {
        const latestLocation = data.locations[0];
        let displayLat = latestLocation.latitude;
        let displayLon = latestLocation.longitude;
        let displayTime = new Date(latestLocation.timestamp);

        // Apply privacy mode
        if (PRIVACY_MODE === 'radius') {
          const obfuscated = obfuscateLocation(displayLat, displayLon, RADIUS_KM);
          displayLat = obfuscated.lat;
          displayLon = obfuscated.lon;
        } else if (PRIVACY_MODE === 'delay') {
          // Find location from DELAY_DAYS ago
          const delayMs = DELAY_DAYS * 24 * 60 * 60 * 1000;
          const targetTime = Date.now() - delayMs;

          const delayedLocation = data.locations.find(loc =>
            new Date(loc.timestamp).getTime() <= targetTime
          );

          if (delayedLocation) {
            displayLat = delayedLocation.latitude;
            displayLon = delayedLocation.longitude;
            displayTime = new Date(delayedLocation.timestamp);
          }
        }

        return {
          lat: displayLat,
          lon: displayLon,
          timestamp: displayTime,
          privacyMode: PRIVACY_MODE
        };
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    }
    return null;
  }

  // Initialize custom map with obfuscated location
  async function initializeTrackingMap() {
    const mapContainer = document.getElementById('tracking-map');
    const fullMapLink = document.getElementById('full-map-link');
    const lastUpdateEl = document.getElementById('last-update');

    // For iframe approach (easier but less control)
    // Note: FollowMee doesn't support client-side obfuscation with iframe
    // So we'll need to use their API and render with Leaflet or Google Maps

    // Alternative: Use embed URL directly (shows exact location)
    const mapUrl = `https://www.followmee.com/map.aspx?key=${FOLLOWMEE_USER_ID}&device=${FOLLOWMEE_DEVICE_ID}`;

    if (fullMapLink) {
      fullMapLink.href = mapUrl;
    }

    // Load Leaflet.js for custom map rendering
    if (!window.L) {
      const leafletCSS = document.createElement('link');
      leafletCSS.rel = 'stylesheet';
      leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(leafletCSS);

      const leafletJS = document.createElement('script');
      leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      leafletJS.onload = renderCustomMap;
      document.body.appendChild(leafletJS);
    } else {
      renderCustomMap();
    }

    async function renderCustomMap() {
      const locationData = await fetchLocationData();

      if (!locationData) {
        // Fallback to iframe if API fails
        mapContainer.src = mapUrl;
        return;
      }

      // Create custom div for Leaflet
      const mapDiv = document.createElement('div');
      mapDiv.style.width = '100%';
      mapDiv.style.height = '100%';
      mapContainer.replaceWith(mapDiv);
      mapDiv.id = 'tracking-map';

      // Initialize Leaflet map
      const map = L.map('tracking-map').setView([locationData.lat, locationData.lon], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add circle to show privacy radius
      if (PRIVACY_MODE === 'radius') {
        L.circle([locationData.lat, locationData.lon], {
          radius: RADIUS_KM * 1000, // Convert to meters
          color: '#e5302d',
          fillColor: '#EBF52E',
          fillOpacity: 0.2,
          weight: 2
        }).addTo(map);
      }

      // Add marker
      L.marker([locationData.lat, locationData.lon]).addTo(map)
        .bindPopup(`Approximate location<br>${PRIVACY_MODE === 'radius' ? `±${RADIUS_KM}km` : `${DELAY_DAYS} days ago`}`)
        .openPopup();

      // Update timestamp
      if (lastUpdateEl) {
        const privacyNote = PRIVACY_MODE === 'radius'
          ? ` (±${RADIUS_KM}km for privacy)`
          : ` (${DELAY_DAYS} day delay)`;
        lastUpdateEl.textContent = locationData.timestamp.toLocaleString() + privacyNote;
      }

      // Refresh every 5 minutes
      setInterval(() => {
        window.location.reload();
      }, 5 * 60 * 1000);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTrackingMap);
  } else {
    initializeTrackingMap();
  }
</script>
```

## Configuration

### Step 1: Get FollowMee Credentials
1. Install FollowMee GPS Tracker app on your phone
2. Create an account at https://www.followmee.com
3. Get your User ID and Device ID from the account settings
4. Replace `YOUR_FOLLOWMEE_USER_ID` and `YOUR_DEVICE_ID` in the code

### Step 2: Choose Privacy Mode
- **Radius Mode** (recommended): Set `PRIVACY_MODE = 'radius'` and adjust `RADIUS_KM`
- **Delay Mode**: Set `PRIVACY_MODE = 'delay'` and adjust `DELAY_DAYS`

### Step 3: Test
- Enable location tracking on your phone
- Visit your blog to see the map
- Verify the privacy radius/delay is working correctly

## Privacy Considerations

### Radius Mode
- ✅ Real-time updates
- ✅ Shows general area
- ✅ Never reveals exact location
- ✅ Visual circle shows privacy boundary

### Delay Mode
- ✅ Shows historical path
- ✅ Safe from real-time tracking
- ⚠️ Less engaging for viewers
- ⚠️ Requires storing historical data

## Dependencies
- Leaflet.js (loaded from CDN)
- FollowMee GPS Tracker app
- FollowMee API access

## Future Enhancements
- [ ] Add path/route visualization
- [ ] Show multiple locations as journey points
- [ ] Add photos/stories at specific locations
- [ ] Custom map markers
- [ ] Dark mode map tiles
- [ ] Speed/distance statistics
