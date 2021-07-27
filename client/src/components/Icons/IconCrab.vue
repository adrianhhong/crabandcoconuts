<template>
  <svg
    id="ICONS"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    class="filter-white"
  >
    <path
      class="cls-1"
      d="M10.89,8.5h2.22a5.39,5.39,0,0,1,5.39,5.39v0a3.61,3.61,0,0,1-3.61,3.61H9.11A3.61,3.61,0,0,1,5.5,13.89v0A5.39,5.39,0,0,1,10.89,8.5Z"
    />
    <path class="cls-2" d="M6.5,19.5a3,3,0,0,1,3-3" />
    <path class="cls-2" d="M4.28,19a3,3,0,0,1,3-3" />
    <path class="cls-2" d="M3.28,17a3,3,0,0,1,3-3" />
    <path class="cls-2" d="M17.5,19.5a3,3,0,0,0-3-3" />
    <path class="cls-2" d="M19.78,19a3,3,0,0,0-3-3" />
    <path class="cls-2" d="M20.78,17a3,3,0,0,0-3-3" />
    <path class="cls-3" d="M4.5,5c0,3,.89,5.5,2,5.5" />
    <path class="cls-3" d="M19.5,5c0,3-.89,5.5-2,5.5" />
    <path d="M4.5,4.5l1-1.73a2,2,0,1,1-2.73.73,2,2,0,0,1,.73-.73Z" />
    <path
      d="M19.5,4.5l-1-1.73a2,2,0,1,0,2.73.73,2,2,0,0,0-.73-.73Z"
    />
    <circle cx="9" cy="6" r="1" />
    <circle cx="15" cy="6" r="1" />
  </svg>
</template>

<style>
.cls-1,
.cls-2,
.cls-3 {
  stroke: #000;
  stroke-miterlimit: 10;
}
.cls-2,
.cls-3 {
  fill: none;
  stroke-width: 1.2px;
}
.cls-2 {
  stroke-linecap: round;
}
.filter-white {
  filter: invert(100%) sepia(0%) saturate(7500%) hue-rotate(301deg)
    brightness(102%) contrast(105%);
}
</style>
