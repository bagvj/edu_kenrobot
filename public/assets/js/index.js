define("app/EventManager",[],function(){function e(e,n){return e+"_"+n}function n(n,t,i){var o=e(n,t),r=a[o];r||(r=[],a[o]=r),r.push(i)}function t(n,t,i){var o=e(n,t),r=a[o];if(r)for(var c=0;c<r.length;c++){var s=r[c];if(s==i){r.splice(c,1);break}}}function i(n,t,i){var o=e(n,t),r=a[o];if(r)for(var c=0;c<r.length;c++){var s=r[c];s(i)}}var a={};return{bind:n,unbind:t,trigger:i}}),define("app/util",[],function(){function e(e){var n=300;$("div.x-message").stop(!0).fadeOut(n/2,function(){$(this).remove()}),e="string"==typeof e?{text:e}:e;var t=e.type||"info",i=e.text,a='<div class="x-message x-message-'+t+'"><i class="x-message-close kenrobot ken-close"></i>'+i+"</div>",o=$(a);$(".x-message-close",o).on("click",function(){o.stop(!0).fadeOut(n/2,function(){o.remove()})}),o.appendTo($(".message-layer")).css({left:($(window).width()-o.width())/2,top:-o.height()}).animate({top:150},n,"swing").delay(2e3).fadeOut(n,function(){o.remove()})}function n(e){e="string"==typeof e?{selector:e}:e;var n=e.selector,t=$(n);if(!t||!t.hasClass("x-dialog"))return!1;var i=e.onConfirm,a=e.onCancel,o=e.onClosing,r=e.onClose,c=e.onShow,s=e.content;s&&$(".x-dialog-content",t).text(s);var u=$(".dialog-layer").addClass("active"),d=function(){t.slideUp(200,function(){t.hide().removeClass("active"),u.removeClass("active"),r&&r()})};return $(".x-dialog-btns .confirm",t).off("click").on("click",function(){o&&0==o()||(d(),i&&i())}),$(".x-dialog-close,.x-dialog-btns .cancel",t).off("click").on("click",function(){o&&0==o()||(d(),a&&a())}),t.css({top:-t.height()}),function(){c&&c(),t.show().addClass("active").animate({top:200},300,"swing")}(),t}function t(){return $(".dialog-layer").hasClass("active")}function i(e,n,t){return n=n||"li",t?e.hasClass("active")?(e.removeClass("active"),!1):(e.parent().find(n+".active").removeClass("active"),e.addClass("active"),!0):e.hasClass("active")?!1:(e.parent().find(n+".active").removeClass("active"),e.addClass("active"),!0)}return{message:e,dialog:n,isInDialog:t,toggleActive:i}}),!function(e){e(jQuery)}(function(e){function n(e){return c.raw?e:encodeURIComponent(e)}function t(e){return c.raw?e:decodeURIComponent(e)}function i(e){return n(c.json?JSON.stringify(e):String(e))}function a(e){0===e.indexOf('"')&&(e=e.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\"));try{return e=decodeURIComponent(e.replace(r," ")),c.json?JSON.parse(e):e}catch(n){}}function o(n,t){var i=c.raw?n:a(n);return e.isFunction(t)?t(i):i}var r=/\+/g,c=e.cookie=function(a,r,s){if(void 0!==r&&!e.isFunction(r)){if(s=e.extend({},c.defaults,s),"number"==typeof s.expires){var u=s.expires,d=s.expires=new Date;d.setTime(+d+864e5*u)}return document.cookie=[n(a),"=",i(r),s.expires?"; expires="+s.expires.toUTCString():"",s.path?"; path="+s.path:"",s.domain?"; domain="+s.domain:"",s.secure?"; secure":""].join("")}for(var l=a?void 0:{},f=document.cookie?document.cookie.split("; "):[],p=0,g=f.length;g>p;p++){var v=f[p].split("="),m=t(v.shift()),h=v.join("=");if(a&&a===m){l=o(h,r);break}a||void 0===(h=o(h))||(l[m]=h)}return l};c.defaults={},e.removeCookie=function(n,t){return void 0===e.cookie(n)?!1:(e.cookie(n,"",e.extend({},t,{expires:-1})),!e.cookie(n))}}),define("vendor/jquery.cookie",function(){}),define("app/user",["vendor/jquery.cookie","./EventManager","./util"],function(e,n,t){function i(){u(),p(),g(),$(".main-header .logo").on("click",h)}function a(){return x?x.id:0}function o(){return x}function r(){return x?x.name:""}function c(e){$.ajax({type:"get",url:"/api/auth/check",dataType:"json"}).done(function(n){var t=0==n.code;x=t?n.user:null,e&&e(t)})}function s(e,n){y=e;var i=t.dialog({selector:".login-dialog",onClosing:function(){y=null,l(!1)}});n=n||"account",$(".switch ."+n,i).click(),"account"==n&&$(".email",i).focus()}function u(){var e=$(".login-dialog"),n=$(".scan",e);$(".switch li",e).on("click",function(){var n=$(this),i=n.data("action"),a=$(".tab-"+i,e);t.toggleActive(a,"div"),t.toggleActive(n),"weixin"==i?l(!0):($(".email",e).focus(),l(!1))}),$(".login-btn",e).on("click",d),$(".qrcode",e).hover(function(t){e.is(":animated")||n.is(":animated")||n.addClass("active").css({left:160,opacity:0}).animate({left:340,opacity:1},400,"swing")},function(t){e.is(":animated")||n.is(":animated")||n.animate({left:440,opacity:0},400,"swing",function(){n.removeClass("active")})}),$("form",e).on("keyup",function(n){13==n.keyCode&&$(".tab-account",e).hasClass("active")&&$(".login-btn",e).trigger("click")})}function d(){var e=$(".login-dialog");$.ajax({type:"POST",url:"/api/auth/login",dataType:"json",data:{email:$(".email",e).val(),password:$(".password",e).val()}}).done(function(i){if(0==i.code)t.message(i.message),$(".x-dialog-close",e).click(),x=i.data,m(),f(),n.trigger("user","login");else if(1==i.code)x=i.data,m(),f();else{var a=$(".message",e);a.addClass("active").text(i.message).delay(2e3).queue(function(){a.removeClass("active").text("").dequeue()})}})}function l(e){if(clearInterval(k),e){var i=$(".login-dialog"),a=function(){var e=$(".qrcode-key",i).val();$.ajax({type:"POST",url:"/api/auth/login/weixin",data:{key:e},dataType:"json"}).done(function(e){0==e.code?(x=e.data,l(!1),$(".x-dialog-close",i).click(),t.message(e.message),m(),f(),n.trigger("user","login")):1==e.code&&(x=e.data,l(!1),m())})};k=setInterval(a,3e3)}}function f(){y&&y()}function p(){var e=$(".user-info"),n=$(".user-menu",e),t=function(){n.hide()};n.on("mouseleave",t),e.on("mouseleave",t),$(".wrap",e).on("mouseover",function(){n.show()}),$("ul > li",n).on("click",v),e.hasClass("active")&&$(".top-menu").css({"margin-right":e.width()})}function g(){var e=$(".copyright"),n=$.cookie("hideCopyright");n?e.remove():(e.addClass("active"),$(".close-btn",e).on("click",function(){e.fadeOut(function(){e.remove(),$.cookie("hideCopyright",!0)})}))}function v(e){var n=$(this),i=n.data("action");switch(i){case"share":t.message("敬请期待");break;case"setting":t.message("敬请期待");break;case"logout":window.location.href="/logout"}}function m(){var e=$(".user-info"),n=$(".top-menu");x?(e.addClass("active"),$(".photo img",e).attr("src",x.avatar_url),$(".name",e).text(x.name),n.css({"margin-right":e.width()})):(e.removeClass("active"),$(".name",e).text(""),$(".photo img",e).attr("src","#"),n.css({"margin-right":0}))}function h(e){c(function(e){e?t.message("你已登录"):s(null,"weixin")})}var x,k,y;return{init:i,getUserId:a,getUserInfo:o,getUserName:r,authCheck:c,showLoginDialog:s}}),define("app/ext/uploader",[],function(){function e(e,n){i=e,a=n,o=window.location.protocol+"//"+window.location.host}function n(e,n){var i=function(i){for(var r,c=0;c<i.length;c++){var s=i[c],u=s.displayName;if(u&&u.toLowerCase().indexOf("arduino")>-1||u.toLowerCase().indexOf("usbmodem")>-1){r=s;break}}return r?void t({action:"serial.connect",portPath:r.path,bitRate:a.bitRate},function(i){return i?void t({action:"upload",url:o+e+"/hex",delay:a.uploadDelay},function(e){t({action:"serial.disconnect",connectionId:i}),n(e?0:4)}):void n(3)}):void n(2)},r=!0,c=function(){t("serial.getDevices",function(e){return e&&0!=e.length?void i(e):void(r?(r=!1,setTimeout(c,1e3)):n(1))})};c()}function t(e,n){e="string"==typeof e?{action:e}:e,n=n||function(){},i.runtime.sendMessage(a.appId,e,n)}var i,a,o;return{init:e,upload:n}}),define("app/ext/agent",["../util","./uploader"],function(e,n){function t(e){u=e,d=o(),n.init(d,u);var t;t=-1!=navigator.userAgent.indexOf("WOW64")||-1!=navigator.userAgent.indexOf("Win64")?64:32;var i="/download/arduino-driver-x"+t+".zip";$(".arduino-driver-dialog .downloadUrl").attr("href",i)}function i(n){return a()&&d?void r(function(e){e?n():c()}):void e.message("啃萝卜扩展目前只支持Chrome浏览器，其它浏览器敬请期待！")}function a(){return navigator.userAgent.toLowerCase().indexOf("chrome")>-1}function o(){return a()?window.chrome:null}function r(e){d.runtime.sendMessage(u.appId,"ping",function(n){e(n&&"ping"==n.action&&"pong"==n.result?!0:!1)})}function c(){e.dialog(".install-dialog")}function s(e,t){i(function(){n.upload(e,t)})}var u,d;return{init:t,upload:s}}),define("app/project",["./EventManager","./util","./user","./ext/agent"],function(e,n,t,i){function a(){y=h();var e=angular.element(".ng-app").scope();e.$on("onRouteChange",v)}function o(){u()}function r(){t.authCheck(function(e){e?d():t.showLoginDialog()})}function c(){t.authCheck(function(e){e?f():t.showLoginDialog()})}function s(){t.authCheck(function(e){e?p():t.showLoginDialog()})}function u(){k().resetProject(),y=h()}function d(){var e=y.id;if(0==e)return void n.message("请先保存");var t=n.dialog(".building-dialog"),i=$(".x-dialog-content",t).text("正在保存...");g(e,!1,function(n){return 0!=n?void i.text("保存失败"):(i.text("保存成功，正在编译..."),void $.ajax({type:"POST",url:"/api/project/build",dataType:"json",data:{id:e}}).done(function(e){return 0!=e.status?void i.text("编译失败"):(i.text("编译成功，正在烧写..."),void l(e.url,i))}))})}function l(e,n){i.upload(e,function(e){var t;switch(e){case 0:t="烧写成功";break;case 1:t="找不到串口";break;case 2:t="找不到arduino";break;case 3:t="连接arduino失败";break;case 4:default:t="烧写失败"}n.text(t)})}function f(){var e=y.id;0==e?p():g(e)}function p(){var e=n.dialog(".save-dialog"),t=$("form",e);$('input[name="name"]',t).val(y.project_name),$('textarea[name="intro"]',t).val(y.project_intro),$('input[name="public-type"][value="'+y.public_type+'"]',t).attr("checked",!0),$(".save-btn",t).off("click").on("click",function(){g(0)})}function g(e,i,a){i=0!=i;var o;if(0==e){var r=$(".save-dialog"),c=$("form",r),s=$('input[name="name"]',c).val();o={id:e,project_name:s,user_id:t.getUserId(),project_intro:$('textarea[name="intro"]',c).val(),project_data:JSON.stringify(x()),public_type:$("input[name='public-type']:checked",c).val()},$(".x-dialog-close",r).click()}else o={id:e,user_id:t.getUserId(),project_data:JSON.stringify(x())};$.ajax({type:"POST",url:"/api/project/save",data:o,dataType:"json"}).done(function(t){0==t.status&&0==e&&(y.id=t.data.project_id,y.project_name=o.project_name,y.project_intro=o.project_intro,y.public_type=o.public_type),i&&n.message(t.message),a&&a(t.status)})}function v(e,n){if(!j){j=!0;var i=n.hash||"";i=/^[0-9a-zA-Z]{6}$/.test(i)?i:"",t.authCheck(function(e){if(!e&&!i)return k().reload(),void(j=!1);var n={};n.user_id=t.getUserId(),i?n.key=i:n.type="last",$.ajax({type:"POST",url:"/api/project/get",dataType:"json",data:n}).done(m)})}}function m(e){if(0!=e.status)return n.message(e.message),k().reload(),void(j=!1);if(y=e.data,"string"==typeof y.project_data)try{y.project_data=JSON.parse(y.project_data)}catch(t){y.project_data={}}k().setProject(y.project_data),j=!1}function h(){return{id:0,user_id:t.getUserId(),project_name:"我的项目",project_intro:"我的项目简介",public_type:1,project_data:{}}}function x(){return k().getProject()}function k(){return angular.element("#api-controller").scope().getApi()}var y,j;return{init:a,create:o,save:c,edit:s,upload:r}}),define("app/topMenu",["./EventManager","./project"],function(e,n){function t(){$(".top-menu > ul > li,.sidebar > ul > li").on("click",i)}function i(e){var n=$(this),t=(n.index(),n.data("action"));switch(t){case"new":a();break;case"save":o();break;case"upload":r()}}function a(){n.create()}function o(){n.save()}function r(){n.upload()}return{init:t}}),define("app/config",[],function(){return{guide:{showIfFirstVisit:!0,autoNextDelay:3e3},extension:{appId:"hhgmonhbodfiplppmcangkmlfkcnilpd",uploadDelay:250,bitRate:115200}}}),define("app/app-index",["./EventManager","./util","./user","./project","./topMenu","./config","./ext/agent"],function(e,n,t,i,a,o,r){function c(){u(),s(),angular.bootstrap(".ng-app",["kenrobot"]),r.init(o.extension),t.init(),i.init(),a.init()}function s(){$.ajaxSetup({headers:{"X-CSRF-TOKEN":$('meta[name="csrf-token"]').attr("content")}})}function u(){if(o.needPV){var e=document.createElement("script");e.src="//hm.baidu.com/hm.js?6518098de0bee39bef219952dbbae669";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)}}return{init:c}}),require.config({baseUrl:"/assets/js",shim:{"vendor/ace/theme-default":{deps:["./ace"]},"vendor/ace/mode-arduino":{deps:["./ace"]},"vendor/ace/snippets/text":{deps:["../ace"]},"vendor/ace/snippets/arduino":{deps:["../ace","./text"]},"vendor/ace/ext-language_tools":{deps:["./ace","./theme-default","./mode-arduino","./snippets/text","./snippets/arduino"]}}}),require(["./app/app-index"],function(e){e.init()}),define("index.js",function(){});