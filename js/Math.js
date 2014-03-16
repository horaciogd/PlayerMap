function px2int(str) {
	var pos = str.indexOf('px');
	return parseInt(str.substring(0, pos));
}
function secondsToTime(m){
	var milliseconds = m % 1000;
	var seconds = Math.floor((m / 1000) % 60);
	if (seconds<10) seconds = '0'+seconds;
	var minutes = Math.floor((m / (60 * 1000)) % 60);
	if (minutes<10) minutes = '0'+minutes;
	return minutes + ":" + seconds;
}