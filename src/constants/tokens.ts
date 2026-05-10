export const colors = {
  ink:           '#0B0D12',
  ink2:          '#0F1320',
  ink3:          '#151A2A',
  surface:       '#1A2034',
  surface2:      '#1F273F',
  line:          'rgba(255,255,255,0.08)',
  lineStrong:    'rgba(255,255,255,0.16)',
  vermilion:     '#FF4D2E',
  vermilionDeep: '#D4361A',
  vermilionGlow: 'rgba(255,77,46,0.35)',
  cyan:          '#7DF9FF',
  cyanDeep:      '#2DC8D8',
  gold:          '#D4A857',
  goldSoft:      '#E8C788',
  text:          '#F2F0EA',
  textMuted:     '#9AA2B5',
  textDim:       '#5C6378',
  success:       '#4ADE80',
} as const;

export const fonts = {
  jpDisplay: 'ShipporiMincho',
  jpBody:    'ZenKakuGothicNew',
  display:   'InstrumentSerif',
  body:      'Geist',
  mono:      'JetBrainsMono',
} as const;

export const radii = {
  card:   12,
  button: 8,
  sm:     4,
} as const;

export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
} as const;
