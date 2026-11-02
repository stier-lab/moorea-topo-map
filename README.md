# Mo'orea bottom topography — interactive map

*Created: 2026-11-02 · Stier Lab, UC Santa Barbara*

Live map: https://stier-lab.github.io/moorea-topo-map/

Interactive 3D map of Mo'orea's seafloor and land: merged 5 m surface (v2) and 1 m SHOM 2015 LiDAR, metres above local mean sea level. Right-drag (or Ctrl-drag) to tilt and rotate; click for elevation and data source.

- **Data:** derived from the SHOM 2015 LiDAR, KM1416 EM710 multibeam, and the SHOM 20 m and 100 m DEMs. The seafloor beyond the survey edge in 3D view is a cosmetic fill, not bathymetry.
- **Click values** here come from the map tiles (~5 m). Full-resolution values (1 m, uncertainty, LiDAR point counts) come from the lab's local server; see the source repository.
- **Not for navigation.**

This repository holds only the built static site (map tiles, MapLibre GL JS 5.24.0, page code). Source code and processing: `stier-lab/moorea-bottom-topography` (`analysis/webmap/`).
