import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Animate the '#square' element
gsap.to('#square', {
  x: 250,
  duration: 1,
  scrollTrigger: {
    trigger: '#square', // Specify the trigger element
    start: ' center', // Start the animation when the top of the trigger element reaches the center of the viewport
    end: 'bottom center', // End the animation when the bottom of the trigger element reaches the center of the viewport
    scrub: 3, // Smoothly animate as you scroll
    markers: true,
  },
});

gsap.to('#square2', {
  y: 500,

  duration: 3,
  scrollTrigger: {
    trigger: '#square2',
    start: 770,
    end: 'bottom center',
    scrub: 1,
  },
});
