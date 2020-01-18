$(document).ready(function(){

	// Init ScrollMagic
	var controller = new ScrollMagic.Controller();


	var pinContainer = new ScrollMagic.Scene({
		triggerElement:'.color4',
		triggerHook:0,
		duration:'50%'
	}).setPin('.color4')
	.addTo(controller);
	// build a scene
	var ourScene = new ScrollMagic.Scene({
		triggerElement: '#project01',
		duration: 300,
		triggerHook:0,
		

	})
	.setClassToggle('#project01', 'fade-in') // add class to project01
	.addIndicators({
		name: 'fade scene',
		colorTrigger: 'black',
		colorStart: '#75C695'
	}) // this requires a plugin
	.addTo(controller);



});