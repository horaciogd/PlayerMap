PlayerMap 1.01
==============

PlayerMap 1.01 by Horacio González Diéguez is a script for sound map application development published under a GNU GENERAL PUBLIC LICENSE and originally designed for **"Einander zuhören – Stadt-(Ge)Schichten"** project.
http://stadt-geschichten.escoitar.org/map

Date: Tue June 7 2016

Enjoy the code and drop me a line for comments and questions!
horaciogd at vhplab dot net

Third Part components: SoundManager 2 V2.97a.20131201 - *Scott Schiller*, jQuery v1.9.1 | jQuery UI v1.10.3 - *jQuery Foundation*, jQuery UI Touch Punch v0.2.2 - *Dave Furfero*, Thickbox v3.1 - *Cody Lindley*, Google Maps API v3 and SoundCloud API


How to
------


**1) Create a SoundCloud account**

You will need one or several accounts depending on the number of recordings you want to publish. *SoundCloud* service is quite limited and you will only be able to upload a few hours of sound for each account.


**2) Create a group**

*PlayerMap* will show all the tracks added to a *SoundCloud* group. This way, the creation of the sound map can be collaborative, as you will have the opportunity to invite other people to participate in your project. In addition,  you will be able to add as many sounds as you want, even if you you exceed the limit of one account. Just remember that the group moderator must approve all contributions and that it is only possible to create one group per account.

![alt tag](http://www.vhplab.net/PlayerMap/readme/playermap_00.png)
SoundCloud menu to create groups - *http://soundcloud.com/groups/new*


**3) Upload your recordings, add them to the group and use latitude and longitude tags**

In addition to upload your recordings and add them to your *SoundCloud* group you will also have to introduce the location of each of the tracks you publish. For that you must use tags. In the upload form you will find a field to add them, copy and paste the geographical information following this example and remember to write both tags in quotation marks, always use the point to separate decimals and to write accurately.

*"Lat:40.416775", "Lng:-3.703790"*

![alt tag](http://www.vhplab.net/PlayerMap/readme/playermap_01.png)
*SoundCloud* upload form with the latitude and longitude tags you need to use - *https://soundcloud.com/upload*

You can find the latitude and longitude of any place using the following website - *http://www.latlong.net/convert-address-to-lat-long.html*


**4) upload PlayerMap to your server**

After adding some recordings to your group, download the script files from *Github* and upload them to your server. You may place them into a folder called *map* if you want.

![alt tag](http://www.vhplab.net/PlayerMap/readme/playermap_02.png)
Use an FTP browser to upload the files to your server


**5) Edit index.html**

Edit *index.html* script to include the your map's *URL* and your *SoundCloud* group's id. This is step is more complicated because it is not easy to find your group's id.

**a)** In order to find the id of your group, open a *SoundCloud API URL* in your browser composed as follows:

*http://api.soundcloud.com/resolve.json?url =*
+
*SoundCloud group URL*
+
*&client_id=bfaf07dd601c910773c4c6d7550a0df3*

For example, the address of the group that we have created for the demo map is *https://soundcloud.com/groups/my-sound-map*, to get its id we visited the following address *http://api.soundcloud.com/resolve.json?url=https://soundcloud.com/groups/my-sound-map&client_id=bfaf07dd601c910773c4c6d7550a0df3*

**b)** In the browser you will see all information about your group encoded in *JSON*. Don't freak out, the second value in the list is the id of your group!

![alt tag](http://www.vhplab.net/PlayerMap/readme/playermap_03.png)
Find the id of your group using *SoundCloud API*

**c)** After writing  your map's *URL* instead of *escribe_aqui_la_url_de_tu_mapa*, copy and paste the id of your group instead of *escribe_aqui_la_id*. 

![alt tag](http://www.vhplab.net/PlayerMap/readme/playermap_04.png)
Add your map's *URL* and your group's id in *index.html*


**6) Share your sound map with us**

Write us about your experience and share your sound map made with *PlayerMap* with us!

