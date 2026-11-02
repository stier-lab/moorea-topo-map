// Camera paths for the map's fly-throughs, shared by the Fly button and record_flythrough.py.
// Keyframes give the point at the centre of the view; the camera is interpolated with
// Catmull-Rom splines so it moves without stopping at keyframes. Fore-reef points sit on the
// -30 m isobath of merged v2, found by marching out from the island centre every 20 degrees;
// bay points follow the water channel in the 5 m grid. Bearings are unwrapped (may pass 360)
// so the spline never swings the long way round.
const FLYPATHS = {
  north: {name: "North shore", duration: 48, keys: [
    // t (s), lon, lat, zoom, pitch, bearing
    [0,  -149.835, -17.505, 12.0, 48, 200],   // offshore north, island rising behind
    [7,  -149.858, -17.482, 13.6, 62, 170],   // Opunohu Bay mouth and the pass
    [14, -149.846, -17.472, 14.9, 70, 125],   // north fore reef, spur-and-groove
    [21, -149.836, -17.472, 15.3, 72, 110],   // MCR LTER 1
    [28, -149.820, -17.471, 15.0, 70, 105],   // Cook's Bay pass
    [35, -149.808, -17.469, 15.3, 72, 100],   // MCR LTER 2
    [41, -149.790, -17.478, 14.2, 66, 140],   // back reef and lagoon, heading east
    [48, -149.830, -17.545, 11.6, 50, 170],   // pull back to the whole island
  ]},
  bays: {name: "Opunohu and Cook's bays", duration: 50, keys: [
    [0,  -149.855, -17.470, 12.6, 55, 175],   // offshore, both bays ahead
    [7,  -149.856, -17.486, 14.2, 68, 180],   // Opunohu Bay mouth
    [14, -149.857, -17.500, 14.6, 72, 175],   // up the bay, ridges either side
    [20, -149.852, -17.513, 14.4, 72, 150],   // head of Opunohu Bay
    [27, -149.838, -17.512, 13.8, 70, 95],    // over the ridge below Mt Rotui, turning east
    [33, -149.821, -17.506, 14.3, 72, 20],    // head of Cook's Bay, turning north
    [40, -149.821, -17.495, 14.6, 72, 0],     // down Cook's Bay
    [45, -149.822, -17.482, 14.3, 66, 355],   // the pass out to the fore reef
    [50, -149.835, -17.520, 11.8, 52, 350],   // rise and turn back over the island
  ]},
  east: {name: "East coast", duration: 46, keys: [
    [0,  -149.768, -17.476, 12.6, 60, 225],   // offshore northeast, Temae ahead
    [7,  -149.776, -17.469, 14.4, 70, 220],   // northeast fore reef
    [14, -149.751, -17.490, 14.6, 72, 240],   // Temae, the narrowest lagoon
    [21, -149.763, -17.514, 15.0, 72, 255],   // MCR LTER 3
    [28, -149.769, -17.547, 15.0, 72, 280],   // MCR LTER 4
    [35, -149.789, -17.561, 14.6, 70, 300],   // southeast fore reef
    [41, -149.789, -17.590, 14.2, 66, 320],   // south-east corner
    [46, -149.830, -17.545, 11.8, 50, 300],   // pull back to the whole island
  ]},
  southwest: {name: "South and west coasts", duration: 54, keys: [
    [0,  -149.834, -17.603, 12.6, 60, 345],   // offshore south
    [7,  -149.836, -17.605, 14.2, 68, 360],   // south fore reef, wide lagoon behind
    [14, -149.860, -17.597, 14.6, 72, 380],   // southern passes
    [21, -149.875, -17.581, 15.0, 72, 400],   // MCR LTER 5
    [28, -149.889, -17.564, 14.6, 70, 420],   // southwest fore reef
    [34, -149.907, -17.546, 14.6, 72, 440],   // Haapiti
    [40, -149.923, -17.519, 15.0, 72, 460],   // MCR LTER 6
    [47, -149.921, -17.486, 14.4, 68, 480],   // Tiahura, northwest corner
    [54, -149.840, -17.540, 11.8, 50, 460],   // pull back to the whole island
  ]},
  circuit: {name: "Around the island", duration: 90, keys: []},
};
// circuit: the -30 m fore-reef ring every 20 degrees clockwise from north, looking at the island
[[-149.8341, -17.4745], [-149.8095, -17.4708], [-149.7758, -17.4693], [-149.7513, -17.4902],
 [-149.7729, -17.5254], [-149.7684, -17.5472], [-149.7891, -17.5613], [-149.7885, -17.5898],
 [-149.8086, -17.6080], [-149.8361, -17.6052], [-149.8595, -17.5966], [-149.8764, -17.5810],
 [-149.8891, -17.5639], [-149.9074, -17.5462], [-149.9252, -17.5184], [-149.9212, -17.4856],
 [-149.8810, -17.4808], [-149.8550, -17.4798], [-149.8341, -17.4745]]
  .forEach(([lon, lat], i) => FLYPATHS.circuit.keys.push([3 + i * 4.5, lon, lat, 13.6, 66, 180 + 20 * i]));
FLYPATHS.circuit.keys.unshift([0, -149.835, -17.478, 12.6, 60, 175]);
FLYPATHS.circuit.keys.push([90, -149.835, -17.530, 11.6, 50, 540]);
FLYPATHS.circuit.keys[FLYPATHS.circuit.keys.length - 2][0] = 84;

let FLYPATH = FLYPATHS.north;           // the path camAt() and renderAt() follow

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

if (typeof module !== "undefined") module.exports = {FLYPATHS, camAt};
