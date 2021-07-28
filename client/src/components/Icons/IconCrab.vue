<template>
  <svg
    class="filter-color"
    id="ICONS"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <path
      class="cls-1"
      d="M9.92,9h4.17a5.39,5.39,0,0,1,5.39,5.39v1.34a3.61,3.61,0,0,1-3.61,3.61H8.14a3.61,3.61,0,0,1-3.61-3.61V14.36A5.39,5.39,0,0,1,9.92,9Z"
    />
    <path class="cls-2" d="M5.68,21.62a3.44,3.44,0,0,1,3.45-3.45" />
    <path class="cls-2" d="M3.13,21a3.45,3.45,0,0,1,3.45-3.45" />
    <path class="cls-2" d="M2,18.72a3.44,3.44,0,0,1,3.45-3.44" />
    <path class="cls-2" d="M18.32,21.62a3.44,3.44,0,0,0-3.45-3.45" />
    <path class="cls-2" d="M20.94,21a3.45,3.45,0,0,0-3.44-3.45" />
    <path class="cls-2" d="M22.09,18.72a3.44,3.44,0,0,0-3.44-3.44" />
    <path class="cls-3" d="M3.38,5c0,3.49,1,6.32,2.3,6.32" />
    <path class="cls-3" d="M20.62,5c0,3.49-1,6.32-2.3,6.32" />
    <path
      d="M3.38,4.37l1.15-2a2.3,2.3,0,0,1-2.3,4,2.31,2.31,0,0,1-.84-3.14,2.36,2.36,0,0,1,.84-.85Z"
    />
    <path
      d="M20.62,4.37l-1.15-2a2.3,2.3,0,1,0,3.14.85,2.36,2.36,0,0,0-.84-.85Z"
    />
    <circle cx="8.55" cy="6.1" r="1.15" />
    <circle cx="15.45" cy="6.1" r="1.15" />
  </svg>
</template>

<style>
.filter-color {
  filter: invert(100%) sepia(0%) saturate(7500%) hue-rotate(301deg)
    brightness(102%) contrast(105%);
}
.cls-1,
.cls-2,
.cls-3 {
  stroke: #000;
  stroke-miterlimit: 10;
}
.cls-2 {
  stroke-linecap: round;
}
.cls-2,
.cls-3 {
  stroke-width: 1.2px;
}
</style>
