export const parallaxDataTitle = [
  {
    start: "self",
    duration: 400,
    easing: "easeIn",
    properties: [
      {
        startValue: 0.4,
        endValue: 0.8,
        property: 'scale',
      },
    ],
  },
];


export const parallaxDataOpacity = nextId => [
  {
    start: nextId,
    duration: 500,
    easing: "linear",
    properties: [
      {
        startValue: 1,
        endValue: 0,
        property: 'opacity',
      },
    ],
  },
];

export const parallaxDataHeader = [
  {
    start: "self",
    duration: 600,
    easing: "easeIn",
    properties: [
      {
        startValue: 0,
        endValue: 8,
        property: 'translateX',
      },
    ],
  },
];

export const parallaxDataProjectLeft = [
  {
    start: "self",
    duration: 550,
    easing: "linear",
    properties: [
      {
        startValue: -1400,
        endValue: 0,
        property: 'translateX',
      },
    ],
  },
];

export const parallaxDataProjectRight = [
  {
    start: "self",
    duration: 550,
    easing: "linear",
    properties: [
      {
        startValue: 1400,
        endValue: 0,
        property: 'translateX',
      },
    ],
  },
];

export const parallaxDataLN = [
  {
    start: "self",
    duration: 200,
    easing: "linear",
    properties: [
      {
        startValue: 280,
        endValue: 0,
        property: 'translateY',
      },
    ],
  },
];

export const parallaxDataPO = [
  {
    start: "self",
    duration: 450,
    easing: "linear",
    properties: [
      {
        startValue: 280,
        endValue: 0,
        property: 'translateY',
      },
    ],
  },
];

export const parallaxDataAN = [
  {
    start: "self",
    duration: 700,
    easing: "linear",
    properties: [
      {
        startValue: 280,
        endValue: 0,
        property: 'translateY',
      },
    ],
  },
];

export const parallaxDataPaper = [
  {
    start: "self",
    duration: 1000,
    easing: "linear",
    properties: [
      {
        startValue: 1,
        endValue: 0,
        property: 'opacity',
      },
      {
        startValue: 1.1,
        endValue: 0,
        property: 'scale',
      },
    ],
  },
];

export const parallaxDataMockup = [
  {
    start: "self",
    duration: 800,
    easing: "linear",
    properties: [
      {
        startValue: 0,
        endValue: 1,
        property: 'scale',
      },
      {
        startValue: 0,
        endValue: 1,
        property: 'opacity',
      }
    ],
  },
];
