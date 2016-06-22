
// This detects finger swipes on touch devices.
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;
var yDown = null;

function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
}

function handleTouchMove(evt) {

    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            /* left swipe */
            onClickNext();
        } else {
            /* right swipe */
            onClickPrev();
        }
    } else {
        if ( yDiff > 0 ) {
            /* up swipe */
        } else {
            /* down swipe */
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;
}












// Flickr API function
(function() {
	function Flickr() {
		this.init();
	}

	Flickr.prototype = {
		init: function() {
			this.user = "123194585@N06";
			this.album = "72157646849974903";


			window.getPhotos = this.getPhotos;

			this.getJSON();
		},
		getJSON: function() {
			var src = "http://api.flickr.com/services/feeds/photoset.gne?nsid=" + this.user + "&set=" + this.album + "&format=json&jsoncallback=getPhotos";
			var script = document.createElement( "script" );
				script.src = src;
				document.body.appendChild( script );
		},
		getPhotos: function( data ) {
			var limit = 5;

			if( data && data.items ) {
				var items = data.items;

        var gallery = document.createElement("div");
        gallery.id = "gallery";
        var slider = document.createElement("ul");
        slider.id = "image_slider";

				for( var i = 0; i < items.length; ++i ) {
					var item = items[i];
					var n = i + 1;
					if( n <= limit ) {
            var image = document.createElement("img");
            image.src = item.media.m;
            var li = document.createElement("li");
            li.appendChild(image);
            slider.appendChild(li);
            gallery.appendChild(image.cloneNode(true));
					}
				}

        document.querySelector( "#flickr" ).appendChild(slider);
        document.body.insertBefore(gallery, document.querySelector( "#flickr" ));
			}
		}
	};

	document.addEventListener( "DOMContentLoaded", function() {
		var flickrFeed = new Flickr();

	});

})();









// Image slider
var ul;
var li_items;
var imageNumber;
var imageWidth;
var prev, next;
var currentPostion = 0;
var currentImage = 0;


function init(){
	ul = document.getElementById('image_slider');
	li_items = ul.children;
	imageNumber = li_items.length;
	imageWidth = li_items[0].children[0].clientWidth;
	ul.style.width = parseInt(imageWidth * imageNumber) + 'px';
	prev = document.getElementById("prev");
	next = document.getElementById("next");

	prev.onclick = function(){ onClickPrev();};
	next.onclick = function(){ onClickNext();};
}

function animate(opts){
	var start = new Date();
	var id = setInterval(function(){
		var timePassed = new Date() - start;
		var progress = timePassed / opts.duration;
		if (progress > 1){
			progress = 1;
		}
		var delta = opts.delta(progress);
		opts.step(delta);
		if (progress == 1){
			clearInterval(id);
			opts.callback();
		}
	}, opts.delay || 17);
	//return id;
}

function slideTo(imageToGo){
	var direction;
	var numOfImageToGo = Math.abs(imageToGo - currentImage);
	// slide toward left

	direction = currentImage > imageToGo ? 1 : -1;
  currentPostion = -1 * currentImage * li_items[0].children[0].clientWidth;
	var opts = {
		duration:200,
		delta:function(p){return p;},
		step:function(delta){
      console.log(delta);
			ul.style.left = parseInt(currentPostion + direction * delta * li_items[0].children[0].clientWidth * numOfImageToGo) + 'px';
		},
		callback:function(){currentImage = imageToGo;}
	};
	animate(opts);
}

function onClickPrev(){
	if (currentImage === 0){
		slideTo(imageNumber - 1);
	}
	else{
		slideTo(currentImage - 1);
	}
}

function onClickNext(){
	if (currentImage == imageNumber - 1){
		slideTo(0);
	}
	else{
		slideTo(currentImage + 1);
	}
}

window.onload = init;
