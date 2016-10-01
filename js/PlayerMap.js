/*!
 * 
 * GPL v2
 * http://www.gnu.org/licenses/gpl-2.0.txt
 * 
 * PlayerMap 1.00 by Horacio González Diéguez is a script
 * for sound map application development published under a
 * GNU GENERAL PUBLIC LICENSE and originally designed for
 * "Einander zuhören – Stadt-(Ge)Schichten" Project
 * http://stadt-geschichten.escoitar.org/map
 *
 * Date: Fri Feb 14 2014
 * 
 * Enjoy the code and drop me a line for comments and questions!
 * horaciogd at vhplab dot net
 *
 * 
 * Third Part components:
 * SoundManager 2 V2.97a.20131201 - Scott Schiller
 * jQuery v1.9.1 | jQuery UI v1.10.3 - jQuery Foundation
 * jQuery UI Touch Punch v0.2.2 - Dave Furfero
 * Thickbox v3.1 - By Cody Lindley
 * Google Maps API v3
 * SoundCloud API
 * 
 * 
 */
 
// ************ //
// PlayerMap
// ************ //
function PlayerMap() {
	this.div = null;
	this.playerDiv = null;
	this.map = null;
	this.trackIdList = new Array();
    this.openMarker = null;
	this.center = null;
	this.zoom = 0;
	this.id = '';
	this.container = '';
	this.path = '';
	this.group = '';
	this.user = '';
	this.client_id = '';
	this.offset = 0;
	this.limit = 20;
	this.max = 9;
	this.num = 0;
	this.margin_left;
	this.img_size = 50;
	this.img_border = 0;
	this.img_margin = 4;
	this.img_dist = 0;
	this.img_count = 0;
	this.width = 0;
	this.outerWidth = 0;
	this.height = 0;
	this.outerHeight = 0;
	this.stripOffset = 0;
	this.width = 0;
	this.ready = true;
	this.full = true;
	this.info = false;
	this.style = 'full';
	this.default_image = '/images/default_img@2x.png';
	this.default_grey_image = 'images/default_img_grey@2x.png';
	this.volume = 50;
}
PlayerMap.prototype.initialize = function(opts) {
	this.id = opts.id;
	this.container = opts.container;
	this.center = new google.maps.LatLng(opts.lat, opts.lng);
	this.zoom = opts.zoom;
	this.path = opts.path;
	if (typeof opts.user != "undefined") this.user = opts.user;
	if (typeof opts.group != "undefined") this.group = opts.group;
	if (typeof opts.client_id != "undefined") this.client_id = opts.client_id;
	if (typeof opts.img_size != "undefined") this.img_size = opts.img_size;
	if (typeof opts.img_border != "undefined") this.img_border = opts.img_border;
	if (typeof opts.img_margin != "undefined") this.img_margin = opts.img_margin;
	if (typeof opts.default_image != "undefined") this.default_image = opts.default_image;
	if (typeof opts.style != "undefined") this.style = opts.style;
	if (typeof opts.max != "undefined") {
		this.max = opts.max;
		if (this.max%2==0) this.max--;
	}
	this.img_dist = this.img_size + this.img_border*2 + this.img_margin;
	
	if (this.style == 'full') {
		this.width = this.img_dist*9 - this.img_margin;
		this.stripOffset = this.img_dist*4;
		this.height = 126;
	} else {
		var modulo = 1024%this.img_dist;
		this.num = (1024 - modulo)/this.img_dist;
		if (this.num%2==0) this.num--;
		if (this.num > this.max) this.num = this.max;
		this.margin_left = 1 + (this.num - 1)/2;
		this.width = this.img_dist*this.num - this.img_margin;
		this.stripOffset = this.img_dist*(parseInt(this.num/2));
		this.height = 50;
	}
	this.outerWidth = this.width + 22;
	this.outerHeight = this.height + 22;
	
	// create div
	this.div = document.createElement("div");
	this.div.className = "map";
	this.div.id = "map_canvas_"+ this.id;
	$(this.container).append(this.div);
	// initialize background map
	 var styles = [
    {
      stylers: [
        { hue: "#0096ff" },
        { saturation: -30 }
      ]
    }, {
      featureType: "road.highway",
      elementType: "geometry.fill",
      stylers: [
        { lightness: 100 },
      ]
    }, {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        { saturation: -60 }
      ]
    }, {
      featureType: "landscape",
      elementType: "geometry.fill",
      stylers: [
        { lightness: 30 }
      ]
    }, {
      featureType: "poi",
      elementType: "geometry.fill",
      stylers: [
        { saturation: -60 },
        { lightness: 20 }
      ]
    }];
	var styledMap = new google.maps.StyledMapType(styles, {name: "(Ge)Schichten"});
	this.map = new google.maps.Map(document.getElementById("map_canvas_"+this.id), {
		zoom: this.zoom,
		center: this.center,
		disableDefaultUI: true,
		mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
	});
	this.map.mapTypes.set('map_style', styledMap);
	this.map.setMapTypeId('map_style');


    this.createPlayer();
  	// initialize soundManager
  	var self = this;
    soundManager.setup({
		url: this.path +'js/soundmanager2/swf',
		flashVersion: 9,
		useFlashBlock: false,
		useHighPerformance: true,
		wmode: 'transparent',
		useFastPolling: true,
		onready: function() {
			if (self.user!='') {
				self.loadUserData();
			} else {
				// soundcloud groups deprecated!!
				self.loadGroupData();
			}
		}
	});
};
PlayerMap.prototype.createPlayer = function() {
	
	// Container
	this.playerDiv = document.createElement("div");
	this.playerDiv.id = "player_"+ this.id;
	this.playerDiv.className = "player "+ this.style;
	
	// Player header
	var playerHeader = document.createElement("div");
	playerHeader.className = "header";
	var box = document.createElement("div");
	box.className = "box";
	var title1 = document.createElement("h1");
	title1.className = "title";
	var info1 = document.createElement("p");
	info1.className = "info";
	
	// Player image strip
	var strip = document.createElement("div");
	strip.className = "strip";
	var wrapper1 = document.createElement("div");
	wrapper1.className = "wrapper";
	var artwork = document.createElement("ul");
	artwork.className = "artwork";
	
	// Player interface
	var playerInterface = document.createElement("div");
	playerInterface.className = "interface";
	var title2 = document.createElement("h2");
	title2.className = "title";
	var info2 = document.createElement("p");
	info2.className = "info";
	var wrapper2 = document.createElement("ul");
	wrapper2.className = "wrapper";
	var prev = document.createElement("li");
	prev.className = "prev";
	prev.setAttribute("ontouchstart","return true;");
	var play = document.createElement("li");
	play.className = "play";
	play.setAttribute("ontouchstart","return true;");
	var pause = document.createElement("li");
	pause.className = "pause";
	pause.setAttribute("ontouchstart","return true;");
	var next = document.createElement("li");
	next.className = "next";
	next.setAttribute("ontouchstart","return true;");
	var volume = document.createElement("li");
	volume.className = "volume";
	volume.setAttribute("ontouchstart","return true;");
	var pinfo = document.createElement("li");
	pinfo.className = "pinfo";
	pinfo.setAttribute("ontouchstart","return true;");
	var time = document.createElement("li");
	time.className = "time";
	var progress_bar = document.createElement("li");
	progress_bar.className = "progress_bar";
	var span = document.createElement("span");
	
	// Player track list
	var trackList = document.createElement("ol");
	trackList.className = "tracks";
	
	strip.style.width = this.width +"px";
	box.style.width = this.width +"px";
	box.style.height = this.height +"px";
	wrapper1.style.left = this.stripOffset +"px";
	
	if (this.style == 'full') {
		this.playerDiv.style.width = this.outerWidth +"px";
	} else if (this.style == 'ipad') {
		info1.style.width = (this.width - 16) +"px";
		/*info1.style.top = this.height +"px";*/
		this.playerDiv.style.height = this.height +"px";
		playerHeader.style.width = this.outerWidth +"px";
		playerHeader.style.height = this.outerHeight +"px";
		$(playerInterface).css("margin-top", ($(window).innerHeight()-this.height-100)+"px");
	}
	
	// Player header & image strip
	box.appendChild(title1);
	box.appendChild(info1);
	wrapper1.appendChild(artwork);
	strip.appendChild(wrapper1);
	box.appendChild(strip);
	playerHeader.appendChild(box);
	this.playerDiv.appendChild(playerHeader);
	
	// Player interface
	playerInterface.appendChild(title2);
	playerInterface.appendChild(info2);
	wrapper2.appendChild(prev);
	wrapper2.appendChild(play);
	wrapper2.appendChild(pause);
	wrapper2.appendChild(next);
	wrapper2.appendChild(volume);
	wrapper2.appendChild(pinfo);
	wrapper2.appendChild(time);
	progress_bar.appendChild(span);
	wrapper2.appendChild(progress_bar);
	playerInterface.appendChild(wrapper2);
	this.playerDiv.appendChild(playerInterface);
	
	// Player track list
	this.playerDiv.appendChild(trackList);
	
	this.playerDiv.index = 1;
	$(this.container).append(this.playerDiv);
	
};
PlayerMap.prototype.loadGroupData = function() {
	var self = this;
	if ((this.group!='')&&(this.client_id!='')) {
		// load soundcloud group data
		$.getJSON('https://api.soundcloud.com/groups/'+ this.group +'.json?client_id='+ this.client_id +'&callback=?', function(data){
			self.groupData(data);		
		});
	}
};
PlayerMap.prototype.loadUserData = function() {
	var self = this;
	if ((this.user!='')&&(this.client_id!='')) {
		// load soundcloud user data
		$.getJSON('https://api.soundcloud.com/users/'+ this.user +'.json?client_id='+ this.client_id +'&callback=?', function(data){
			self.userData(data);		
		});
	}
};
PlayerMap.prototype.groupData = function(data) {
	var text = data.description;
	if (text!=null) {
		text = text.replace(/\r\n\r\n/g,"<br />");
		$("#player_"+ this.id +" .header p").html(text);
	}
	var name = data.name;
	if (name!=null) {
		$("#player_"+ this.id +" .header h1").html(name);
	}
	this.img_count = data.track_count;
	this.loadGroupTracks();
};
PlayerMap.prototype.userData = function(data) {
	var text = data.description;
	if (text!=null) {
		text = text.replace(/\r\n\r\n/g,"<br />");
		$("#player_"+ this.id +" .header p").html(text);
	}
	var name = data.name;
	if (name!=null) {
		$("#player_"+ this.id +" .header h1").html(name);
	}
	this.img_count = data.track_count;
	this.loaduserTracks();
};
PlayerMap.prototype.loadGroupTracks = function() {
	var self = this;
	// load soundcloud group tracks data
	// get url via alert('https://api.soundcloud.com/groups/'+ this.group +'/tracks.json?client_id='+ this.client_id +'&offset='+ this.offset +'&limit='+ this.limit +'&callback=?');
	$.getJSON('https://api.soundcloud.com/groups/'+ this.group +'/tracks.json?client_id='+ this.client_id +'&offset='+ this.offset +'&limit='+ this.limit +'&callback=?', function(data){
		self.getTracks(data, function(){
			self.loadGroupTracks();
		}, function(){
			self.bindActions();
		});
	});					
};
PlayerMap.prototype.loaduserTracks = function() {
	var self = this;
	// load soundcloud user tracks data
	$.getJSON('https://api.soundcloud.com/users/'+ this.user +'/tracks.json?client_id='+ this.client_id +'&offset='+ this.offset +'&limit='+ this.limit +'&callback=?', function(data){
		self.getTracks(data, function(){
			self.loaduserTracks();
		}, function(){
			self.bindActions();
		});
	});					
};
PlayerMap.prototype.getTracks = function(data, more, callback) {
	// Embed the title of the first track inn the player interface
	$("#player_"+ this.id +" .interface h2").text(data[0].title);
	// Loop through each of the tracks
	var n = this.offset;
	var self = this;
	var count = $(data).length - 1;
	$.each(data, function(index, track) {
		var tag_list = track.tag_list;
		if (tag_list!=null) {
			var tags = tag_list.split(" ");
			var lat, lng;
			track.tags = tags;
			for (var i=0; i<tags.length; i++) {
				var clean = tags[i].toLowerCase();
				var num = clean.indexOf("lat:");
				if (num!=-1) {
					var latData = tags[i].split(":");
					track.lat = parseFloat(latData[1]);
				} else {
					var num = clean.indexOf("lng:");
					if (num!=-1) {
						var lngData = tags[i].split(":");
						track.lng = parseFloat(lngData[1]);
					}
				}
			}
		}
		if ((typeof track.genre != "undefined")&&(typeof track.genre != null)) {
			var clean = track.genre.toLowerCase();
			var num = clean.indexOf("lat:");
			if (num!=-1) {
				var latData = track.genre.split(":");
				track.lat = parseFloat(latData[1]);
			} else {
				var num = clean.indexOf("lng:");
				if (num!=-1) {
					var lngData = track.genre.split(":");
					track.lng = parseFloat(lngData[1]);
				}
			}
		}
		if ((typeof track.lat != "undefined")&&(typeof track.lng != "undefined")) {
			n++;
			track.n = n;
			var artwork_url = track.artwork_url;
			// Create the track Marker
			var text = track.description;
			text = urlify(text.replace(/\n/g," <br />"));
			
			var html = '<h3>'+ track.title +'</h3>';
			if (artwork_url!=null) {
				var artwork_path = artwork_url.split('-large');
				var artwork_link = artwork_path[0]+'-t500x500'+artwork_path[1];
				html += '<a class="thickbox" title="'+track.title+'" href="'+ artwork_link +'"><img src="'+ artwork_url +'" /></a>';
			}
			html += '<p>'+text+'</p>';
			track.marker = new SoundMarker();
			track.marker.initialize({
				lat: track.lat,
				lng: track.lng,
				map: self.map,
				text: html,
				title: track.title,
				path: self.path,
				id: track.id,
				player: self,
			});
			self.trackIdList.push(track.id);
			// Create a list item for each track and associate the track *data* with it.
			// retina icon trick
			/*
    		if(window.devicePixelRatio >= 2) {
    			if (artwork_url!=null) {
					var artwork_path = artwork_url.split('-large');
					artwork_url = artwork_path[0] +'-t300x300'+ artwork_path[1];
					//background_artwork_url = 'http://listening-city.escoitar.org/greyscale.php?image='+ artwork_url;
					background_artwork_url = artwork_url;
				} else {
					var artwork_path = self.default_image.split('.');
					artwork_url = self.path + artwork_path[0] +'@2x.'+ artwork_path[1];
					//background_artwork_url = self.path + artwork_path[0] +'_grey@2x.'+ artwork_path[1];
					background_artwork_url = artwork_url;
				}
    		} else {*/
    			if (artwork_url==null) artwork_url = self.path + self.default_image;
    			background_artwork_url = artwork_url;
    		//}
    		$('<li id="track_'+ track.id +'">'+ track.title +'</li>').data('track', track).appendTo("#player_"+ self.id +" .tracks");
    	
    	
			$('<li id="img_'+ track.id +'" ><img class="background" src="'+ background_artwork_url +'" /><img class="tracklist" src="'+ artwork_url +'" title="'+ track.title +'" /></li>').data({
				id: track.id,
				x: n * self.img_dist,
				num: n,
			}).appendTo("#player_"+ self.id +" .artwork");
			// * Get appropriate stream url depending on whether the playlist is private or public.
			// * If the track includes a *secret_token* add a '&' to the url, else add a '?'.
			// * Finally, append the consumer key and you'll have a working stream url.
			url = track.stream_url;
			(url.indexOf("secret_token") == -1) ? url = url + '?' : url = url + '&';
			url = url + 'client_id=' + self.client_id;
			// Create the sound using SoundManager
			soundManager.createSound({
				// Give the sound an id and the SoundCloud stream url we created above.
				id: 'track_' + track.id,
				url: url,
				// On play & resume add a *playing* class to the main player div.
				// This will be used in the stylesheet to hide/show the play/pause buttons depending on state.
				onplay: function() {
					$("#player_"+ self.id).addClass('playing');
					$("#player_"+ self.id +" .interface h2").html(track.title);
					var text = track.description;
					text = text.replace(/\r\n\r\n/g,"<br />");
					$("#player_"+ self.id +" .interface p").html(text);
				},
				onresume: function() {
					$("#player_"+ self.id).addClass('playing');
				},
				// On pause, remove the *playing* class from the main player div.
				onpause: function() {
					$("#player_"+ self.id).removeClass('playing');
				},
				// When a track finished, call the Next Track function. (Declared at the bottom of this file).
				onfinish: function() {
					self.nextTrack();
				},
				whileplaying: function() {
					var percent = 3 + this.position / track.duration * 97;
					$("#player_"+ self.id +" .interface .time").text(secondsToTime(this.position));
					$("#player_"+ self.id +" .interface .progress_bar span").css('width', percent +'%');
				}
			});
		}
		if(index==count) {
			var loadded = self.trackIdList.length;
			if (loadded==self.img_count) {
				if (callback) callback();
			} else {
				self.offset = loadded;
				if (more) more();
			}
			self.trackIdList.length;
		}
	});
};
PlayerMap.prototype.bindActions = function() {
	var self = this;
	// ## GUI Actions
	// Bind a click event to each list item we created above.
	$("#player_"+ this.id +" .tracks li").click(function(index){
		// Create a track variable, grab the data from it, and find out if it's already playing *(set to active)*
		var $track = $(this),
			data = $track.data('track'),
				playing = $track.is('.active');
		if (playing) {
			// If it is playing: pause it.
			data.marker.stopIcon();
			soundManager.pause('track_' + data.id);				
		} else {
			// If it's not playing: stop all other sounds that might be playing and play the clicked sound.
			$track.siblings('li').each(function(){
				if($(this).hasClass('active')) {
					var oldData = $(this).data('track');
					oldData.marker.stopIcon();
					soundManager.stopAll();
				}
			});
			soundManager.setVolume('track_' + data.id, self.volume);
			soundManager.play('track_' + data.id);
			playingSound = data.id;
			data.marker.showInfoWindow();
			data.marker.playIcon();
			//$(".customWindow .fancybox").fancybox();
		}
		// Finally, toggle the *active* state of the clicked li and remove *active* from and other tracks.
		$track.toggleClass('active').siblings('li').removeClass('active');
	});
	$("#player_"+ this.id +" .artwork li").click(function(){
		var $img = $(this),
			x = $img.data('x'),
				n = $img.data('num'),
					id = $img.data('id');
		self.goTo(n, id);
	});
	var n = self.margin_left;
	$("#player_"+ this.id +" .artwork li").each(function(index) {
		var position = $(this).data('x');
		var last = self.trackIdList.length - self.margin_left;
		
		// images after last position of the strip to the beginning
		if (position >= (last)*self.img_dist) {
			var new_position = -(n)*self.img_dist;
			n--;
			$(this).data('x', new_position)
			$(this).css('left', new_position+'px');
		} else {
			$(this).css('left', position+'px');
		}
		
	});
	
	// Bind a click event to the play / pause button.
	$("#player_"+ this.id +" .play, #player_"+ this.id +" .pause").click(function(){
		if ( $('li').hasClass('active') == true ) {
			// If a track is active, play or pause it depending on current state.
			$('li.active').data('track').marker.stopIcon();
			soundManager.togglePause( 'track_' + $('li.active').data('track').id );	
		} else {
			// If no tracks are active, just play the first one.
			$('li:first').click();
		}
		if ($(this).attr('class')=='pause') {
			$('.current').find('.tracklist').animate({ opacity: '0', }, 'slow');
		} else {
			$('.current').find('.tracklist').animate({ opacity: '1' }, 'slow');
		}
		var s = this;
	});
	// Bind a click event to the next button, calling the Next Track function.
	$("#player_"+ this.id +" .next").click(function(){
		if (self.ready) self.nextTrack();
	});
	// Bind a click event to the previous button, calling the Previous Track function.
	$("#player_"+ this.id +" .prev").click(function(){
		if (self.ready) self.prevTrack();
	});
	// Bind a click event to the volume button, calling the set volume Track function.
	$("#player_"+ this.id +" .volume").css("background-position", "-257px 0");
	$("#player_"+ this.id +" .volume").click(function(){
		if (self.ready) self.setVolume();
	});
	// Bind a click event to the info button, calling the info function.
	$("#player_"+ this.id +" .pinfo").click(function(){
		self.toggleInfo();
	});
	// Bind a click event to the progress bar, calling the set position Track function.
	$("#player_"+ this.id +" .progress_bar").click(function(e){
		var w = $(this).width();
		var x = e.clientX - $(this).offset().left;
		if (self.ready) self.setPosition(x/w);
	});
	if (this.style == 'full') {
		$("#player_"+ this.id).draggable({
			containment: "#map_canvas_"+ self.id
		});
		$("#player_"+ this.id).dblclick(function() {
			self.toggle();
		});
	} else if (this.style == 'ipad') { 
		$("#player_"+ this.id +" .header .info").hide();
		$("#player_"+ this.id +" .header h1").hide();
	}
	$("#player_"+ this.id).show();
	$("#player_"+ this.id +" .next").trigger('click');
};
PlayerMap.prototype.toggle = function() {
	if (this.full) {
		$( "#player_"+ this.id +" .header" ).animate({ width: "4px", height: "4px" }, "slow");
		$( "#player_"+ this.id).animate({ width: "356px" }, "slow");
		$("#player_"+ this.id +" .header h1, #player_"+ this.id +" .header p, #player_"+ this.id +" .strip").fadeOut("slow");
		$("#player_"+ this.id +" .interface").animate({ margin: "0 20px 0 0" }, "slow");
		this.full = false;
	} else {
		$( "#player_"+ this.id +" .header" ).animate({ width: this.width +"px", height: this.height +"px" }, "slow");
		$( "#player_"+ this.id).animate({ width: this.outerWidth +"px" }, "slow");
		$( "#player_"+ this.id +" .header h1, #player_"+ this.id +" .header p, #player_"+ this.id +" .strip" ).fadeIn("slow");
		$("#player_"+ this.id +" .interface").animate({ margin: (this.height + 18) +"px 0 0 0" }, "slow");
		this.full = true;
	}
};
PlayerMap.prototype.toggleInfo = function() {
	var self = this;
	if (this.info) {
		$("#player_"+ this.id +" .header .info").slideUp("slow");
		$("#player_"+ this.id +" .header h1").fadeOut("slow", "swing" , function(){
			$("#player_"+ self.id +" .header .strip").fadeIn("fast");
		});
		this.info = false;
	} else {
		$("#player_"+ this.id +" .header .strip").fadeOut("fast", "swing" , function(){
			$("#player_"+ self.id +" .header .info").slideDown("slow");
			$("#player_"+ self.id +" .header h1").fadeIn();
		});
		this.info = true;
	}
};
PlayerMap.prototype.goTo = function(_n, _id) {
	this.ready = false;
	var ofset = $("#player_"+ this.id +" .artwork").css('left');
	var dist;
	var self = this;
	$("#player_"+ this.id +" .tracks li").each(function() {
		var data = $(this).data('track');
		if(data.id==_id) $(this).click();
	});
	$("#player_"+ this.id +" .artwork li").each(function() {
		var position = (px2int(ofset) + $(this).data('x'));
		var num = $(this).data('num');
		// make transparent current color image
		if (position == 0) {
			$(this).find('.tracklist').animate({ opacity: '0' }, 'slow');
			$(this).removeClass('current');
		} else if (num == _n) {
			$(this).find('.tracklist').animate({ opacity: '1' }, 'slow');
			$(this).addClass('current');
			dist = position;
		}
	});
	$("#player_"+ this.id +" .artwork").animate({ left: '-='+dist }, {
		duration: 'slow',
		progress: function(){
			var ofset = px2int($("#player_"+ self.id +" .artwork").css('left'));
			var prevPosition = $("#player_"+ self.id +" .artwork li:last").data('x');
			var list = new Array();
			$("#player_"+ self.id +" .artwork li").each(function() {
				var position = $(this).data('x') + ofset;
				var last = self.trackIdList.length - self.margin_left;
				
				// first image of the strip to the end when going left
				if ((position <= -(self.margin_left+1)*self.img_dist)&&(dist>=0)){
					var pos = self.trackIdList.length - (self.margin_left + 1);
					var new_position = pos * self.img_dist - ofset;
					$(this).data('x', new_position)
					$(this).css('left', new_position+'px');
			
				// last image from the strip to the beginning when going right
				} else if ((position >= last*self.img_dist)&&(dist<=0)) {
					var new_position = -(self.margin_left)*self.img_dist - ofset;
					$(this).data('x', new_position)
					$(this).css('left', new_position+'px');
					
				}
			});
		},
		complete: function(){
			self.ready = true;
		},
	});				
};
PlayerMap.prototype.nextTrack = function(){
	this.ready = false;
	// Stop all sounds
	soundManager.stopAll();
	// Click the next list item after the current active one. 
	// If it does not exist *(there is no next track)*, click the first list item.
	if ($("#player_"+ this.id +" .tracks li.active").next().click().length == 0 ) {
		$("#player_"+ this.id +" .tracks li:first").click();
	}
	var self = this;
	var ofset = $("#player_"+ this.id +" .artwork").css('left');
	$("#player_"+ this.id +" .artwork li").each(function(index) {
		var position = (px2int(ofset) + $(this).data('x'));
		if (position == 0) {
			$(this).find(".tracklist").animate({ opacity: '0' }, 'slow');
			$(this).removeClass('current');
		} else if (position == self.img_dist) {
			$(this).find(".tracklist").animate({ opacity: '1' }, 'slow');
			$(this).addClass('current');
			
		// first image of the strip to the end
		} else if (position == -(self.margin_left)*self.img_dist){
			var pos = self.trackIdList.length - (self.margin_left);
			var new_position = pos * self.img_dist - px2int(ofset);
			$(this).data('x', new_position)
			$(this).css('left', new_position+'px');
		}
	});
	$("#player_"+ this.id +" .artwork").animate({ left: '-='+self.img_dist }, 'slow', function(){
		self.ready = true;
	});
};
PlayerMap.prototype.prevTrack = function(){
	// Stop all sounds
	soundManager.stopAll();
	// Click the previous list item after the current active one. 
	// If it does not exist *(there is no previous track)*, click the last list item.
	if ( $("#player_"+ this.id +" .tracks li.active").prev().click().length == 0 ) {
		$("#player_"+ this.id +" .tracks li:last").click();
	}
	var self = this;
	var ofset = $("#player_"+ this.id +" .artwork").css('left');
	$("#player_"+ this.id +" .artwork li").each(function(index) {
		var position = (px2int(ofset) + $(this).data('x'));
		var last = self.trackIdList.length - self.margin_left - 1;
		if (position == 0) {
			$(this).find(".tracklist").animate({ opacity: '0' }, 'slow');
			$(this).removeClass('current');
		} else if (position == -self.img_dist) {
			$(this).find(".tracklist").animate({ opacity: '1' }, 'slow');
			$(this).addClass('current');
			
		// last image from the strip to the beginning
		} else if (position >= last*self.img_dist) {
			var new_position = -(self.margin_left + 1)*self.img_dist - px2int(ofset);
			$(this).data('x', new_position)
			$(this).css('left', new_position+'px');
		}
		 
	});
	$("#player_"+ this.id +" .artwork").animate({ left: '+='+self.img_dist }, 'slow', function(){
		self.ready = true;
	});
};
PlayerMap.prototype.setVolume = function(){
	this.volume += 25;
	if (this.volume>100) this.volume = 0;
	var data = $("#player_"+ this.id +" .tracks li.active").data('track');
	if (data) {
		soundManager.setVolume('track_' + data.id, this.volume);
	}
	switch (this.volume) {
		case 0:
			$("#player_"+ this.id +" .volume").css("background-position", "-189px 0");//0
			break;
		case 25:
			$("#player_"+ this.id +" .volume").css("background-position", "-223px 0");//34px
			break;
		case 50:
			$("#player_"+ this.id +" .volume").css("background-position", "-257px 0");//68px
			break;
		case 75:
			$("#player_"+ this.id +" .volume").css("background-position", "-292px 0");//103px
			break;
		case 100:
			$("#player_"+ this.id +" .volume").css("background-position", "-326px 0");//137px
			break;
	}
};
PlayerMap.prototype.setPosition = function(p){
	if (p>=1) this.nextTrack();
	var data = $("#player_"+ this.id +" .tracks li.active").data('track');
	if (data) {
		var sound = soundManager.getSoundById('track_' + data.id);
		soundManager.setPosition('track_' + data.id, parseInt(p*sound.duration));
	}
};

// ************ //
// SoundMarker
// ************ //
function SoundMarker() {
	this.id = null;
	this.num = null;
	this.r = 0;
	this.open = false;
	this.infoWindow = new InfoBox();
	this.marker = new google.maps.Marker();
	this.player = null;
};
SoundMarker.prototype.initialize = function(opts) {
	this.r = Math.floor((Math.random()*5));
	this.player = opts.player;
	var image;
	// retina icon trick
    if(window.devicePixelRatio >= 2) {
    	image = {
			url: this.player.path +'images/markers/map-marker-'+ this.r +'@2x.png',
			size: new google.maps.Size(148, 148),
			scaledSize: new google.maps.Size(74, 74),
			anchor: new google.maps.Point(37, 74),
		};
	} else {
		image = {
			url: this.player.path +'images/markers/map-marker-'+ this.r +'.png',
			size: new google.maps.Size(74, 74),
			scaledSize: new google.maps.Size(74, 74),
			anchor: new google.maps.Point(37, 74),
		};
	}
	var latlng = new google.maps.LatLng(opts.lat, opts.lng);
	
	this.marker.setOptions({
		position: latlng,
		map: this.player.map,
		icon: image,
		//shadow: shadow,
		title: opts.title,
		optimized: false
	});
	var ao = 0;
	switch (this.r) {
		case 0:
			ao = -7;
			break;
		case 1:
			ao = 6;
			break;
		case 2:
			ao = -0;
			break;
		case 3:
			ao = -3;
			break;
		case 4:
			ao = 3;
			break;
	}
	this.infoWindow.setOptions({
		latlng: latlng,
		map: this.player.map,
		text: opts.text,
		id: opts.id,
		title: opts.title,
		arrowOffset: ao,
	});
	//this.infoWindow.setMap(null);
	
    this.id = opts.id;
	
	var self = this;
	google.maps.event.addListener(this.marker, 'click', function() {
		self.showInfoWindow();
		$("#img_"+self.id).trigger('click');
		//$(".customWindow .fancybox").fancybox();
	});
};
SoundMarker.prototype.showInfoWindow = function() {
	if(!this.open) {
		if(this.player.openMarker) {
			var data = $("#track_"+this.player.openMarker).data('track');
			data.marker.hideInfoWindow();
		}
		this.infoWindow.show(this.player.map);
		this.open = true;
		this.player.openMarker = this.id;
	}
};
SoundMarker.prototype.hideInfoWindow = function() {
	if (this.open) {
		this.infoWindow.hide();
		this.open = false;
	}
};
SoundMarker.prototype.playIcon = function() {
	var image;
	// retina icon trick
	if(window.devicePixelRatio >= 2) {
    	image = {
			url: this.player.path +'images/markers/map-marker-'+ this.r +'o@2x.png',
			size: new google.maps.Size(148, 148),
			scaledSize: new google.maps.Size(74, 74),
			anchor: new google.maps.Point(37, 74),
		};
		//alert(this.player.path +'/squelettes/images/markers/map-marker-'+ this.r +'o@2x.png');
	} else {
		image = {
			url: this.player.path +'images/markers/map-marker-'+ this.r +'o.png',
			size: new google.maps.Size(74, 74),
			scaledSize: new google.maps.Size(74, 74),
			anchor: new google.maps.Point(37, 74),
		};
	}
	this.marker.setIcon(image);
};
SoundMarker.prototype.stopIcon = function() {
	var image;
	// retina icon trick
	if(window.devicePixelRatio >= 2) {
    	image = {
			url: this.player.path +'images/markers/map-marker-'+ this.r +'@2x.png',
			size: new google.maps.Size(148, 148),
			scaledSize: new google.maps.Size(74, 74),
			anchor: new google.maps.Point(37, 74),
		};
	} else {
		image = {
			url: this.player.path +'images/markers/map-marker-'+ this.r +'.png',
			size: new google.maps.Size(74, 74),
			scaledSize: new google.maps.Size(74, 74),
			anchor: new google.maps.Point(37, 74),
		};
	}
	this.marker.setIcon(image);
};

// ************ //
// InfoBox
// ************ //
function InfoBox() {
	google.maps.OverlayView.call(this);
	this.latlng_ = null;
	this.text = null;
	this.title = null;
	this.id = null;
	this.map_ = null;
	this.offsetVertical_ = 0;
	this.offsetHorizontal_ = -63;
	this.height_ = 0;
	this.width_ = 350;
	this.boundsChangedListener_ = null;
	this.arrowOffset = 43;
	this.windowOffset = 106;
	this.arrowDiv = null;
};
/* InfoBox extends GOverlay class from the Google Maps API */
InfoBox.prototype = new google.maps.OverlayView();
InfoBox.prototype.setOptions = function(opts) {
	this.latlng_ = opts.latlng;
	this.text = opts.text;
	this.title = opts.title;
	if (typeof opts.arrowOffset != "undefined") this.arrowOffset += opts.arrowOffset;
	this.id = opts.id;
	this.map_ = opts.map;
	var me = this;
	/*
	this.boundsChangedListener_ = google.maps.event.addListener(this.map_, "bounds_changed", function() {
		return me.panMap.apply(me);
	});
	*/
};
/* Creates the DIV representing this InfoBox */
InfoBox.prototype.remove = function() {
  if (this.div_) {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
  }
};
/* Redraw the Bar based on the current projection and zoom level */
InfoBox.prototype.draw = function() {
  // Creates the element if it doesn't exist already.
  this.createElement();
  if (!this.div_) return;

  // Calculate the DIV coordinates of two opposite corners of our bounds to
  // get the size and position of our Bar
  var pixPosition = this.getProjection().fromLatLngToDivPixel(this.latlng_);
  if (!pixPosition) return;

  // Now position our DIV based on the DIV coordinates of our bounds
  this.div_.style.width = this.width_ + "px";
  this.div_.style.left = parseInt(pixPosition.x + this.offsetHorizontal_) + "px";
  this.div_.style.top = parseInt(pixPosition.y + this.offsetVertical_ - this.windowOffset) + "px";
  //this.arrowDiv.style.top = parseInt(this.offsetVertical_*(-1) - this.arrowOffset) + "px";
  this.div_.style.display = 'block';
  //$("a.fancybox").fancybox();
  tb_init('a.thickbox');
  var windowHeight = $('#window_'+ this.id).height();
  if (this.offsetVertical_ != windowHeight*(-1)) {
	this.offsetVertical_ = -$('#window_'+ this.id).height();
	this.div_.style.top = parseInt(pixPosition.y + this.offsetVertical_ - this.windowOffset) + "px";
	//this.arrowDiv.style.top = parseInt(this.offsetVertical_*(-1) - this.arrowOffset) + "px";
	this.panMap();
  }
};
/* Creates the DIV representing this InfoBox in the floatPane.  If the panes
 * object, retrieved by calling getPanes, is null, remove the element from the
 * DOM.  If the div exists, but its parent is not the floatPane, move the div
 * to the new pane.
 * Called from within draw.  Alternatively, this can be called specifically on
 * a panes_changed event.
 */
InfoBox.prototype.createElement = function() {
  var panes = this.getPanes();
  var div = this.div_;
  if (!div) {
    // This does not handle changing panes.  You can set the map to be null and
    // then reset the map to move the div.
    div = this.div_ = document.createElement("div");
    div.className = "customWindow";
    div.id = "window_"+ this.id;
    div.style.position = "absolute";
    //div.style.width = this.width_ + "px";
    //div.style.height = this.height_ + "px";
    var contentDiv = document.createElement("div");
    contentDiv.className = "contentDiv";
    contentDiv.innerHTML = this.text;

    var topDiv = document.createElement("div");
    topDiv.className = "closeWrapper";
    var closeImg = document.createElement("div");
    closeImg.className = "closeImg";
    topDiv.appendChild(closeImg);
	
    this.arrowDiv = document.createElement("div");
    this.arrowDiv.className = "arrowDiv";
	this.arrowDiv.style.left = this.arrowOffset+"px";
    
	function removeInfoBox(ib) {
      return function() {
      	//ib.hide(false);
        ib.setMap(null);
      };
    }
    google.maps.event.addDomListener(closeImg, 'click', removeInfoBox(this));

    div.appendChild(topDiv);
    div.appendChild(contentDiv);
    div.appendChild(this.arrowDiv);
    
    div.style.display = 'none';
    panes.floatPane.appendChild(div);
    this.panMap();
  } else if (div.parentNode != panes.floatPane) {
    // The panes have changed.  Move the div.
    div.parentNode.removeChild(div);
    panes.floatPane.appendChild(div);
  } else {
    // The panes have not changed, so no need to create or move the div.
    //alert($('#window_'+ this.id).height() +" "+ this.id);
    // hay que calcular el tamaño de la ventana despues de abrirla porque si no lo hace mal, además hay que sumar 26 del margen en este punto devuelve un alto correcto
  }
};
/* Pan the map to fit the InfoBox. */
InfoBox.prototype.panMap = function() {

  //this.offsetVertical_ = (-1)*($('#window_'+ this.id).height()/2 +50);
  //this.offsetVertical_ = 0;
  
  //(-1)*($('#window_'+ this.id).height());

  // if we go beyond map, pan map
  var map = this.map_;
  var bounds = map.getBounds();
  if (!bounds) return;

  // The position of the infowindow
  var position = this.latlng_;

  // The dimension of the infowindow
  var iwWidth = this.width_;
  var iwHeight = this.height_;

  // The offset position of the infowindow
  var iwOffsetX = this.offsetHorizontal_;
  var iwOffsetY = this.offsetVertical_;

  // Padding on the infowindow
  var padX = 0;
  var padY = 0;

  // The degrees per pixel
  var mapDiv = map.getDiv();
  var mapWidth = mapDiv.offsetWidth;
  var mapHeight = mapDiv.offsetHeight;
  var boundsSpan = bounds.toSpan();
  var longSpan = boundsSpan.lng();
  var latSpan = boundsSpan.lat();
  var degPixelX = longSpan / mapWidth;
  var degPixelY = latSpan / mapHeight;

  // The bounds of the map
  var mapWestLng = bounds.getSouthWest().lng();
  var mapEastLng = bounds.getNorthEast().lng();
  var mapNorthLat = bounds.getNorthEast().lat();
  var mapSouthLat = bounds.getSouthWest().lat();
  
  var tempMapNorthLat = mapSouthLat + (mapNorthLat-mapSouthLat) * 0.7;
  var tempMapSouthLat = mapSouthLat + (mapNorthLat-mapSouthLat) * 0.3;
  var mapNorthLat = tempMapNorthLat;
  var mapSouthLat = tempMapSouthLat;
  
  var tempMapWestLng = mapEastLng + (mapWestLng-mapEastLng) * 0.7;
  var tempMapEastLng = mapEastLng + (mapWestLng-mapEastLng) * 0.3;
  var mapWestLng = tempMapWestLng;
  var mapEastLng = tempMapEastLng;
  
  // The bounds of the infowindow
  var iwWestLng = position.lng() + (iwOffsetX - padX) * degPixelX;
  var iwEastLng = position.lng() + (iwOffsetX + iwWidth + padX) * degPixelX;
  var iwNorthLat = position.lat() - (iwOffsetY - padY) * degPixelY;
  var iwSouthLat = position.lat() - (iwOffsetY + iwHeight + padY) * degPixelY;

  // calculate center shift
  var shiftLng =
      (iwWestLng < mapWestLng ? mapWestLng - iwWestLng : 0) +
      (iwEastLng > mapEastLng ? mapEastLng - iwEastLng : 0);
  var shiftLat =
      (iwNorthLat > mapNorthLat ? mapNorthLat - iwNorthLat : 0) +
      (iwSouthLat < mapSouthLat ? mapSouthLat - iwSouthLat : 0);

  // The center of the map
  var center = map.getCenter();

  // The new map center
  var centerX = center.lng() - shiftLng;
  var centerY = center.lat() - shiftLat;

  // center the map to the new shifted center
  map.setCenter(new google.maps.LatLng(centerY, centerX));
  // Remove the listener after panning is complete.
  /*
  google.maps.event.removeListener(this.boundsChangedListener_);
  this.boundsChangedListener_ = null;
  */
  
};
InfoBox.prototype.hide = function() {
	this.setMap(null);
};
InfoBox.prototype.show = function(map) {
	this.setMap(map);
};									


function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
        return '<a href="' + url + '">' + url + '</a>';
    })
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
}
