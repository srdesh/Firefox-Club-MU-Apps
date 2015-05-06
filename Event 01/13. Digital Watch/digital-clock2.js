// (c) 2000-2014 ricocheting.com
// v2.0

dg = new Array();
dg[0]=new Image();dg[0].src="/static/code/javascript/digital-clock/dg0.gif";
dg[1]=new Image();dg[1].src="/static/code/javascript/digital-clock/dg1.gif";
dg[2]=new Image();dg[2].src="/static/code/javascript/digital-clock/dg2.gif";
dg[3]=new Image();dg[3].src="/static/code/javascript/digital-clock/dg3.gif";
dg[4]=new Image();dg[4].src="/static/code/javascript/digital-clock/dg4.gif";
dg[5]=new Image();dg[5].src="/static/code/javascript/digital-clock/dg5.gif";
dg[6]=new Image();dg[6].src="/static/code/javascript/digital-clock/dg6.gif";
dg[7]=new Image();dg[7].src="/static/code/javascript/digital-clock/dg7.gif";
dg[8]=new Image();dg[8].src="/static/code/javascript/digital-clock/dg8.gif";
dg[9]=new Image();dg[9].src="/static/code/javascript/digital-clock/dg9.gif";
dgam=new Image();dgam.src="/static/code/javascript/digital-clock/dgam.gif";
dgpm=new Image();dgpm.src="/static/code/javascript/digital-clock/dgpm.gif";

function dotime(){ 
	var d=new Date();
	var hr=d.getHours(),mn=d.getMinutes(),se=d.getSeconds();

	// set AM or PM
	document.ampm.src=((hr<12)?dgam.src:dgpm.src);

	// adjust from 24hr clock
	if(hr==0){hr=12;}
	else if(hr>12){hr-=12;}

	document.hr1.src = getSrc(hr,10);
	document.hr2.src = getSrc(hr,1);
	document.mn1.src = getSrc(mn,10);
	document.mn2.src = getSrc(mn,1);
	document.se1.src = getSrc(se,10);
	document.se2.src = getSrc(se,1);
}

function getSrc(digit,index){
	return dg[(Math.floor(digit/index)%10)].src;
}

window.onload=function(){
	dotime();
	setInterval(dotime,1000);
}
