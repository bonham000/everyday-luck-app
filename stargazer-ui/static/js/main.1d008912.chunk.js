(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{13:function(e,t,a){e.exports=a(22)},21:function(e,t,a){},22:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),s=a(2),o=a.n(s),c=a(1),i=a.n(c),l=a(3),h=a(6),d=a(7),u=a(11),m=a(8),p=a(12),f=a(9),g=a.n(f),w=a(10),v=a(4),E=function(e,t){if(0===t.data.photos.length&&console.warn("Found zero photos in the Android screenshots data, did you run the Stargazer tool first to record screenshots for your app?"),0===e.data.photos.length&&console.warn("Found zero photos in the iOS screenshots data, did you run the Stargazer tool first to record screenshots for your app?"),0===e.data.photos.length&&0===t.data.photos.length)throw new Error("No photo data exists!");var a=N(e,t),n=new Map,s=e.data,o=s.os,c=s.width,i=s.height;s.photos.forEach(function(e){var t=e.name,a=e.screenshot;n.set(t,Object(v.a)({},o,r.a.createElement("img",{height:.75*i,width:.75*c,alt:t,src:a,className:"ScreenImage"})))});var l=t.data,h=l.os,d=l.width,u=l.height;return l.photos.forEach(function(e){var t=e.name,s=e.screenshot,o=n.get(t);n.set(t,Object(v.a)({ios:o&&o.ios||r.a.createElement(S,{height:.75*a.height,width:.75*a.width})},h,r.a.createElement("img",{height:.75*u,width:.75*d,alt:t,src:s,className:"ScreenImage"})))}),Array.from(n.entries()).map(function(e){var t=Object(w.a)(e,2),n=t[0],s=t[1];return{name:n,data:{ios:s.ios,android:s.android||r.a.createElement(S,{height:.75*a.height,width:.75*a.width})}}})},S=function(e){var t=e.height,a=e.width;return r.a.createElement("div",{className:"Placeholder",style:{height:.75*t,width:.75*a}},r.a.createElement("p",{className:"PlaceholderText"},"No Image Yet"))},N=function(e,t){try{return{height:e.data.height,width:e.data.width}}catch(a){return{height:t.data.height,width:t.data.width}}},b=function(){return window.innerWidth>975},k=function(e){function t(e){var a;return Object(h.a)(this,t),(a=Object(u.a)(this,Object(m.a)(t).call(this,e))).renderScreenNamesList=function(){return a.state.names.filter(function(e){return e.toLowerCase().includes(a.state.search.toLowerCase())}).map(function(e){return r.a.createElement("p",{key:e,className:"ScreenNameOption",onClick:function(){return a.scroll(e)}},e)})},a.renderScreenshotsItem=function(e){var t=e.name,n=e.data,s=n.ios,o=n.android,c=a.state.desktop;return r.a.createElement("div",{key:t,className:"Screenshot",ref:function(e){return a.assignRef(t,e)}},r.a.createElement("p",{className:"ScreenshotName"},t),r.a.createElement("div",{className:"DeviceContainer",style:{margin:"auto",width:c?"68vw":"auto",flexDirection:c?"row":"column"}},r.a.createElement("div",{className:"Device"},r.a.createElement("p",{className:"DeviceTitle"},"iOS"),s),r.a.createElement("div",{className:"Device"},r.a.createElement("p",{className:"DeviceTitle"},"Android"),o)))},a.clearSearch=function(){a.setState({search:""})},a.handleSearch=function(e){a.setState({search:e.currentTarget.value})},a.assignRef=function(e,t){a[e]=t},a.scroll=function(e){try{o.a.findDOMNode(a[e]).scrollIntoView({behavior:"instant",block:"start"})}catch(t){console.warn("Tried to find and scroll to DOM node using ref ".concat(e," but failed..."))}},a.updateWindowDimensions=function(){a.setState({desktop:b()})},a.fetchScreenshotsData=Object(l.a)(i.a.mark(function e(){var t,n,r;return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,a.fetchData("ios");case 2:return t=e.sent,e.next=5,a.fetchData("android");case 5:n=e.sent,t&&n?(r=E(t,n),a.setState({loading:!1,data:r,dates:{ios:t.timestamp,android:n.timestamp},names:r.map(function(e){return e.name})})):(console.log("Error fetching iOS and Android screenshots data!"),a.setErrorState());case 7:case"end":return e.stop()}},e)})),a.fetchData=function(){var e=Object(l.a)(i.a.mark(function e(t){var n,r;return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,fetch("".concat(".","/").concat(t,"-data.json"),{headers:{pragma:"no-cache","cache-control":"no-cache"}});case 3:return n=e.sent,e.next=6,n.json();case 6:return r=e.sent,e.abrupt("return",r);case 10:e.prev=10,e.t0=e.catch(0),console.log("Could not fetch screenshots source JSON for device: ".concat(t)),a.setErrorState();case 14:case"end":return e.stop()}},e,null,[[0,10]])}));return function(t){return e.apply(this,arguments)}}(),a.setErrorState=function(){a.setState({error:!0,loading:!1})},a.state={dates:{ios:"",android:""},search:"",data:[],names:[],error:!1,loading:!0,desktop:b()},a}return Object(p.a)(t,e),Object(d.a)(t,[{key:"componentDidMount",value:function(){var e=Object(l.a)(i.a.mark(function e(){return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:window.addEventListener("resize",this.updateWindowDimensions),this.fetchScreenshotsData();case 2:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this;if(this.state.loading)return r.a.createElement("div",{className:"Cover"},r.a.createElement("p",null,"Sending Astronauts... \ud83d\udc69\u200d\ud83d\ude80"),r.a.createElement("p",null,"Launching Satellites... \ud83d\udef0"),r.a.createElement("p",null,"Stargazer System Booting Up... \ud83d\udd2d"));if(this.state.error)return r.a.createElement("div",{className:"Cover"},r.a.createElement("p",null,"Stargazer System is down... \ud83e\udd15"),r.a.createElement("p",null,"Please check the"," ",r.a.createElement("a",{href:"https://github.com/tenx-tech/stargazer",target:"_blank"},"documentation")," ","for details."));var t=this.state.desktop;return r.a.createElement("div",{className:"App"},r.a.createElement("header",{className:"AppHeader"},r.a.createElement("img",{src:g.a,className:"AppLogo",alt:"logo"}),r.a.createElement("p",{className:"HeaderTitle"},"Stargazer UI"),t&&r.a.createElement("a",{target:"_blank",className:"GitHub Repo",rel:"noopener noreferrer",href:"https://github.com/tenx-tech/stargazer"},"GitHub")),t&&r.a.createElement("div",{className:"TimestampBlock"},r.a.createElement("p",null,"iOS updated on"," ",r.a.createElement("b",null,new Date(this.state.dates.ios).toDateString()),"."),r.a.createElement("p",null,"Android updated on"," ",r.a.createElement("b",null,new Date(this.state.dates.android).toDateString()),".")),t&&r.a.createElement("div",{className:"SideBar"},r.a.createElement("div",{className:"SearchBar"},r.a.createElement("input",{autoFocus:!0,placeholder:"Filter (".concat(this.state.data.length," total screens)"),className:"SearchInput",value:this.state.search,onChange:this.handleSearch}),this.state.search&&r.a.createElement("p",{className:"ClearSearch",onClick:this.clearSearch},"x")),r.a.createElement("div",{className:"NamesList"},this.renderScreenNamesList())),r.a.createElement("div",{className:"ScreenshotContainer",style:{paddingLeft:t?300:0}},this.state.data.map(function(t){return e.renderScreenshotsItem(t)})))}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this.updateWindowDimensions)}}]),t}(n.Component);a(21),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(k,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},9:function(e,t,a){e.exports=a.p+"static/media/stargazer.1a235b8d.png"}},[[13,1,2]]]);
//# sourceMappingURL=main.1d008912.chunk.js.map