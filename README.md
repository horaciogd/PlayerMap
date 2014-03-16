PlayerMap 1.00
==============

PlayerMap 1.00 by Horacio González Diéguez is a script for sound map application development published under a GNU GENERAL PUBLIC LICENSE and originally designed for "Einander zuhören – Stadt-(Ge)Schichten" project.
http://stadt-geschichten.escoitar.org/map

Date: Fri Feb 14 2014

Enjoy the code and drop me a line for comments and questions!
horaciogd at vhplab dot net

Third Part components: SoundManager 2 V2.97a.20131201 - Scott Schiller, jQuery v1.9.1 | jQuery UI v1.10.3 - jQuery Foundation, jQuery UI Touch Punch v0.2.2 - Dave Furfero, Thickbox v3.1 - By Cody Lindley, Google Maps API v3, SoundCloud API


How to
------

**1)** You will need at least a *SoundCloud* account or several of them, depending on the quantity of audio you want to publish. *SoundCloud* service is very limited and you will only be able to upload one hour of audio for each account.

**2)** You will have to create a group to gather all the audio tracks of the map together, this makes possible to avoid *SoundCloud* maximum limit and allows you to work in a collaborative way. Remember that *SoundCloud* groups have a moderator that must approve all contributions.

This is the link to create a group - *http://soundcloud.com/groups/new*


**3)** You will also have to add geographical information to each of the tracks using tags. You will find a field to add tags in the form to edit each audio, copy and paste the geographical information in this field following the example :

*"Lng:-8.88175964", "Lat:42.56693816"*

Remember to write both tags in quotation marks, always use the point to separate decimals and to write tags accurately.

You can find the latitude and longitude of any place using the next website or any other you like better - *http://www.latlong.net/convert-address-to-lat-long.html*


**4)** Upload all script files to your server. You may place them in a folder called map if you want your map to be displayed in an address like the next *tudominio.org/map*


**5)** Finally, edit *index.html* file and write your map address instead of *escribe_aqui_la_url_de_tu_mapa* and your *SoundCloud* group id instead of *escribe_aqui_la_id*. This will be the trickiest step because it isn't easy to find out the your group id.

In order to do that you must first open a *SoundCloud API* URL in your browser as follows:

*http://api.soundcloud.com/resolve.json?url =*
+
*SoundCloud group URL*
+
*&client_id=bfaf07dd601c910773c4c6d7550a0df3*


For example if the address of a group is *https://soundcloud.com/groups/soundmapping-project*, the URL you need to open in your browser would be *http://api.soundcloud.com/resolve.json?url=https://soundcloud.com/groups/soundmapping-project&client_id=bfaf07dd601c910773c4c6d7550a0df3*

By going to this URL, you will get all the information of your group encoded in JSON, don't worry! The second value is just all you need, the id of your group.

	{"kind":"group","id":124361,"created_at":"2013/05/03 14:26:36 +0000","permalink":"soundmapping-project","track_count":3,"members_count":4,"moderated":false,"contributors_count":3,"name":"Soundmapping Project","short_description":"More info: http://listening-city.escoitar.org/spip.php?article5","description":"Trial group for web developent, soundmapping script work in progress!","uri":"http://api.soundcloud.com/groups/124361","artwork_url":"http://a1.sndcdn.com/images/default_avatar_large.png?435a760","permalink_url":"http://soundcloud.com/groups/soundmapping-project","creator":{"id":43649164,"kind":"user","permalink":"mobile-memories","username":"mobile-memories","uri":"http://api.soundcloud.com/users/43649164","permalink_url":"http://soundcloud.com/mobile-memories","avatar_url":"http://a1.sndcdn.com/images/default_avatar_large.png?435a760"}}