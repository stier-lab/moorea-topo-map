// Camera path for the north-shore fly-through, shared by the map's Tour button and
// record_flythrough.py. Keyframes give the point at the centre of the view; the camera is
// interpolated with Catmull-Rom splines so it moves without stopping at keyframes.
const FLYPATH = {
  duration: 48,                         // seconds
  keys: [
    // t (s), lon, lat, zoom, pitch, bearing
    [0,  -149.835, -17.505, 12.0, 48, 200],   // offshore north, island rising behind
    [7,  -149.858, -17.482, 13.6, 62, 170],   // Opunohu Bay mouth and the pass
    [14, -149.846, -17.472, 14.9, 70, 125],   // north fore reef, spur-and-groove
    [21, -149.836, -17.472, 15.3, 72, 110],   // MCR LTER 1
    [28, -149.820, -17.471, 15.0, 70, 105],   // Cook's Bay pass
    [35, -149.808, -17.469, 15.3, 72, 100],   // MCR LTER 2
    [41, -149.790, -17.478, 14.2, 66, 140],   // back reef and lagoon, heading east
    [48, -149.830, -17.545, 11.6, 50, 170],   // pull back to the whole island
  ],
};

function catmull(p0, p1, p2, p3, u) {
  const u2 = u * u, u3 = u2 * u;
  return 0.5 * ((2 * p1) + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2
                + (-p0 + 3 * p1 - 3 * p2 + p3) * u3);
}

// Camera at time t (s): {center, zoom, pitch, bearing}
function camAt(t) {
  const k = FLYPATH.keys;
  t = Math.max(0, Math.min(FLYPATH.duration, t));
  let i = 0;
  while (i < k.length - 2 && t > k[i + 1][0]) i++;
  const u = (t - k[i][0]) / (k[i + 1][0] - k[i][0]);
  const at = j => k[Math.max(0, Math.min(k.length - 1, j))];
  const v = col => catmull(at(i - 1)[col], at(i)[col], at(i + 1)[col], at(i + 2)[col], u);
  return {center: [v(1), v(2)], zoom: v(3), pitch: Math.min(80, v(4)), bearing: v(5)};
}

if (typeof module !== "undefined") module.exports = {FLYPATH, camAt};
