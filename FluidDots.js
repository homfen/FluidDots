function FluidDots(el, option) {
	el = el || document.body;
	option = option || {};

	var background = option.background || '#000';
	var radius = option.radisu || 1;
	var color = option.color || 'rgba(106, 210, 231, 0.5)';
	var margin = option.margin || 40;
	var start = option.start || 8;
	var range = option.range || 15;
	var interval = option.interval || 15;


	var particleHolder = [];
	var canvas = null;

	this.el = el;
	this.option = {
		background: background,
		radius: radius,
		color: color,
		margin: margin,
		start: start,
		range: range,
		interval: interval
	};
	this.canvas = canvas;

	init();

	function init() {
		canvas = document.createElement('canvas');
		el.appendChild(canvas);
		canvas.width = el.offsetWidth;
		canvas.height = el.offsetHeight;
		canvas.addEventListener('mousemove', MouseMove, false);
		lastMouse = {
			x: -1,
			y: -1
		};
		mouse = {
			x: 0,
			y: 0
		};

		function MouseMove(event) {
			lastMouse.x = mouse.x;
			lastMouse.y = mouse.y;
			mouse.x = event.pageX - canvas.offsetLeft;
			mouse.y = event.pageY - canvas.offsetLeft;
		}
		var wl = canvas.width / margin - 1;
		var hl = canvas.height / margin - 1;
		for (i = 1; i < hl; i++) {
			for (j = 1; j < wl; j++) {
				particleHolder.push(new generateParticles(i, j));
			}
		}

		function generateParticles(i, j) {
			this.x = j * margin;
			this.y = i * margin;
			this.color = color;
			this.rad = radius;
		}

		animate();
	};

	function animate() {
		if (animate.timeout) {
			clearInterval(animate.timeout);
		}
		if (Math.abs(lastMouse.x - mouse.x) < 2 && Math.abs(lastMouse.y - mouse.y) < 2) {
			animate.timeout = setTimeout(animate, 10);
			return;
		}

		if (animate.interval) {
			clearInterval(animate.interval);
		}
		var step = start;
		draw(range, step);
		
		animate.interval = setInterval(function () {
			if (step < range * 0.65) {
				step += 0.08;
				draw(range, step);
			}
			else {
				step = 0;
				clearInterval(animate.interval);
			}
		}, interval);

		animate.timeout = setTimeout(animate, 10);
	}

	function draw(range, step) {
		var context = canvas.getContext('2d');
		context.fillStyle = background;
		context.fillRect(0, 0, canvas.width, canvas.height);
		maxDistance = canvas.width / 2;
		for (var j = 0; j < particleHolder.length; j++) {
			var p = particleHolder[j];
			var distanceX = p.x - mouse.x;
			var distanceY = p.y - mouse.y;
			particleDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
			if (particleDistance > maxDistance) {
				rate = 0;
			}
			else {
				rate = (maxDistance - particleDistance) / maxDistance;
			}
			context.beginPath();
			context.fillStyle = p.color;
			context.arc(p.x - distanceX * rate / (range - step) / 2,
				p.y - distanceY * rate / (range - step) / 4,
				p.rad * (1 + rate * step / 4), Math.PI * 2, false);
			context.fill();
		}
	}
}