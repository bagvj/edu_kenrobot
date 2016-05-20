define("app/EventManager",[],function(){function e(e,t){return e+"_"+t}function t(t,n,i){var o=e(t,n),r=a[o];r||(r=[],a[o]=r),r.push(i)}function n(t,n,i){var o=e(t,n),r=a[o];if(r)for(var s=0;s<r.length;s++){var c=r[s];if(c==i){r.splice(s,1);break}}}function i(t,n,i){var o=e(t,n),r=a[o];if(r)for(var s=0;s<r.length;s++){var c=r[s];c(i)}}var a={};return{bind:t,unbind:n,trigger:i}}),define("app/util",[],function(){function e(e){var t=300;$("div.x-message").stop(!0).fadeOut(t/2,function(){$(this).remove()}),e="string"==typeof e?{text:e}:e;var n=e.type||"info",i=e.text,a='<div class="x-message x-message-'+n+'"><i class="x-message-close kenrobot ken-close"></i>'+i+"</div>",o=$(a);$(".x-message-close",o).on("click",function(){o.stop(!0).fadeOut(t/2,function(){o.remove()})}),o.appendTo($(".message-layer")).css({left:($(window).width()-o.width())/2,top:-o.height()}).animate({top:150},t,"swing").delay(2e3).fadeOut(t,function(){o.remove()})}function t(e){e="string"==typeof e?{selector:e}:e;var t=e.selector,n=$(t);if(!n||!n.hasClass("x-dialog"))return!1;var i=e.onConfirm,a=e.onCancel,o=e.onClosing,r=e.onClose,s=e.onShow,c=e.content;c&&$(".x-dialog-content",n).text(c);var u=$(".dialog-layer").addClass("active"),d=function(e){n.removeClass("dialog-fadeIn").addClass("dialog-fadeOut").delay(300).queue(function(){n.hide().removeClass("dialog-fadeOut"),u.removeClass("active"),r&&r(),e&&e()})};return $(".x-dialog-btns .confirm",n).off("click").on("click",function(){o&&0==o()||d(i)}),$(".x-dialog-close,.x-dialog-btns .cancel",n).off("click").on("click",function(){o&&0==o()||d(a)}),s&&s(),n.stop().show().removeClass("dialog-fadeOut").addClass("dialog-fadeIn"),n}function n(){return $(".dialog-layer").hasClass("active")}function i(e,t){return t?e.hasClass("active")?(e.removeClass("active"),!1):(e.siblings(".active").removeClass("active"),e.addClass("active"),!0):e.hasClass("active")?!1:(e.siblings(".active").removeClass("active"),e.addClass("active"),!0)}return{message:e,dialog:t,isInDialog:n,toggleActive:i}}),!function(e){e(jQuery)}(function(e){function t(e){return s.raw?e:encodeURIComponent(e)}function n(e){return s.raw?e:decodeURIComponent(e)}function i(e){return t(s.json?JSON.stringify(e):String(e))}function a(e){0===e.indexOf('"')&&(e=e.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\"));try{return e=decodeURIComponent(e.replace(r," ")),s.json?JSON.parse(e):e}catch(t){}}function o(t,n){var i=s.raw?t:a(t);return e.isFunction(n)?n(i):i}var r=/\+/g,s=e.cookie=function(a,r,c){if(void 0!==r&&!e.isFunction(r)){if(c=e.extend({},s.defaults,c),"number"==typeof c.expires){var u=c.expires,d=c.expires=new Date;d.setTime(+d+864e5*u)}return document.cookie=[t(a),"=",i(r),c.expires?"; expires="+c.expires.toUTCString():"",c.path?"; path="+c.path:"",c.domain?"; domain="+c.domain:"",c.secure?"; secure":""].join("")}for(var l=a?void 0:{},f=document.cookie?document.cookie.split("; "):[],p=0,g=f.length;g>p;p++){var v=f[p].split("="),m=n(v.shift()),h=v.join("=");if(a&&a===m){l=o(h,r);break}a||void 0===(h=o(h))||(l[m]=h)}return l};s.defaults={},e.removeCookie=function(t,n){return void 0===e.cookie(t)?!1:(e.cookie(t,"",e.extend({},n,{expires:-1})),!e.cookie(t))}}),define("vendor/jquery.cookie",function(){}),define("app/userApi",[],function(){function e(){return $.ajax({type:"POST",url:"/api/auth/check",data:{id:0},dataType:"json"})}function t(e,t){return $.ajax({type:"POST",url:"/api/auth/login",dataType:"json",data:{email:e,password:t}})}function n(e){return $.ajax({type:"POST",url:"/api/auth/login/weixin",data:{key:e},dataType:"json"})}return{authCheck:e,login:t,weixinLogin:n}}),define("app/user",["vendor/jquery.cookie","./EventManager","./util","./userApi"],function(e,t,n,i){function a(){d(),g(),v(),$(".user-login li").on("click",x)}function o(){return k?k.id:0}function r(){return k}function s(){return k?k.name:""}function c(e){var t=$.Deferred();return i.authCheck().done(function(e){0==e.status?(k=e.user,t.resolve()):(k=null,t.reject())}),t}function u(e,t,i){j=e;var a=n.dialog({selector:".login-dialog",onClosing:function(){j=null,f(!1)}});t=t||"account",$(".switch ."+t,a).click(),i?($(".switch",a).removeClass("active"),$(".login-tips",a).removeClass("active"),$(".register-tips",a).addClass("active"),$(".footer .login-footer",a).removeClass("active"),$(".footer .register-footer",a).addClass("active")):($(".switch",a).addClass("active"),$(".login-tips",a).addClass("active"),$(".register-tips",a).removeClass("active"),$(".footer .login-footer",a).addClass("active"),$(".footer .register-footer",a).removeClass("active")),"account"==t&&$(".email",a).focus()}function d(){var e=$(".login-dialog"),t=$(".scan",e);$(".switch li",e).on("click",function(){var t=$(this),i=t.data("action"),a=$(".tab-"+i,e);n.toggleActive(a),n.toggleActive(t),"weixin"==i?f(!0):($(".email",e).focus(),f(!1))}),$(".login-btn",e).on("click",l);var i;$(".qrcode",e).hover(function(n){e.is(":animated")||(clearTimeout(i),t.stop().show().removeClass("x-fadeOut").addClass("x-fadeIn"))},function(n){e.is(":animated")||(t.removeClass("x-fadeIn").addClass("x-fadeOut"),i=setTimeout(function(){t.hide().removeClass("x-fadeOut")},300))}),$("form",e).on("keyup",function(t){13==t.keyCode&&$(".tab-account",e).hasClass("active")&&$(".login-btn",e).trigger("click")})}function l(){var e=$(".login-dialog"),a=$(".email",e).val(),o=$(".password",e).val();i.login(a,o).done(function(i){if(0==i.status)n.message(i.message),$(".x-dialog-close",e).click(),k=i.data,h(),p(),t.trigger("user","login");else if(1==i.status)k=i.data,h(),p();else{var a=$(".message",e);a.addClass("active").text(i.message).delay(2e3).queue(function(){a.removeClass("active").text("").dequeue()})}})}function f(e){if(clearInterval(C),e){var a=$(".login-dialog"),o=function(){var e=$(".qrcode-key",a).val();i.weixinLogin(e).done(function(e){0==e.status?(k=e.data,f(!1),$(".x-dialog-close",a).click(),n.message(e.message),h(),p(),t.trigger("user","login")):1==e.status&&(k=e.data,f(!1),h())})};C=setInterval(o,3e3)}}function p(){j&&j()}function g(){var e=$(".user"),t=$(".user-menu",e),n=function(){t.hide()};t.on("mouseleave",n),e.on("mouseleave",n),$(".user-info",e).on("mouseover",function(){t.show()}),$("ul > li",t).on("click",m),e.hasClass("active")&&$(".top-menu").css({"margin-right":e.width()})}function v(){var e=$(".copyright"),t=$.cookie("hideCopyright");t?e.remove():(e.addClass("active"),$(".close-btn",e).on("click",function(){e.fadeOut(function(){e.remove(),$.cookie("hideCopyright",!0)})}))}function m(e){var t=$(this),i=t.data("action");switch(i){case"share":n.message("敬请期待");break;case"setting":n.message("敬请期待");break;case"logout":window.location.href="/logout"}}function h(){var e=$(".user"),t=$(".top-menu");k?(e.addClass("active"),$(".photo img",e).attr("src",k.avatar_url),$(".name",e).text(k.name),t.css({"margin-right":e.width()})):(e.removeClass("active"),$(".name",e).text(""),$(".photo img",e).attr("src","#"),t.css({"margin-right":0}))}function x(e){var t=$(this).data("action");u(null,"weixin","register"==t)}var k,C,j;return{init:a,getUserId:o,getUserInfo:r,getUserName:s,authCheck:c,showLoginDialog:u}}),define("app/projectApi",["./user"],function(e){function t(t,n){n=n||"id";var i={};return i.user_id=e.getUserId(),"hash"==n?i.hash=t:"last"==n?i.type="last":i.id=t,$.ajax({type:"POST",url:"/api/project/get",data:i,dataType:"json"})}function n(){return $.ajax({type:"POST",url:"/api/projects/user",data:{user_id:e.getUserId()},dataType:"json"})}function i(e){return $.ajax({type:"POST",url:"/api/project/save",data:e,dataType:"json"})}function a(t){return $.ajax({type:"POST",url:"/api/project/build",dataType:"json",data:{id:t,user_id:e.getUserId()}})}function o(t){return $.ajax({type:"POST",url:"/api/project/delete",data:{id:t,user_id:e.getUserId()},dataType:"json"})}return{get:t,getAll:n,save:i,build:a,remove:o}}),define("app/ext/uploader",[],function(){function e(e,t){a=e,o=t,r=window.location.protocol+"//"+window.location.host}function t(e,t){var a=function(i){for(var a,o=0;o<i.length;o++){var r=i[o],c=r.displayName;if(c&&s.test(c)){a=r;break}}return a?void t(2,i):void n(e,a.path,t)},o=!0,r=function(){i("serial.getDevices",function(e){return e&&0!=e.length?void a(e):void(o?(o=!1,setTimeout(r,1e3)):t(1))})};r()}function n(e,t,n){i({action:"serial.connect",portPath:t,bitRate:o.bitRate},function(t){return t?void i({action:"upload",url:r+e+"/hex",delay:o.uploadDelay},function(e){i({action:"serial.disconnect",connectionId:t}),n(e?0:4)}):void n(3)})}function i(e,t){e="string"==typeof e?{action:e}:e,t=t||function(){},a.runtime.sendMessage(o.appId,e,t)}var a,o,r,s=/(arduino)|(\/dev\/cu\.usbmodem)/i;return{init:e,upload:t,resumeUpload:n}}),define("app/ext/agent",["../util","./uploader"],function(e,t){function n(e){d=e,l=o(),t.init(l,d);var n;n=-1!=navigator.userAgent.indexOf("WOW64")||-1!=navigator.userAgent.indexOf("Win64")?64:32;var i="/download/arduino-driver-x"+n+".zip";$(".arduino-driver-dialog .downloadUrl").attr("href",i)}function i(t){return a()&&l?void r(function(e){e?t():s()}):void e.message("啃萝卜扩展目前只支持Chrome浏览器，其它浏览器敬请期待！")}function a(){return navigator.userAgent.toLowerCase().indexOf("chrome")>-1}function o(){return a()?window.chrome:null}function r(e){l.runtime.sendMessage(d.appId,"ping",function(t){e(t&&"ping"==t.action&&"pong"==t.result?!0:!1)})}function s(){e.dialog(".install-dialog")}function c(e,n){i(function(){t.upload(e,n)})}function u(e,n,i){t.resumeUpload(e,n,i)}var d,l;return{init:n,upload:c,resumeUpload:u}}),define("app/project",["./EventManager","./util","./projectApi","./user","./ext/agent"],function(e,t,n,i,a){function o(){C=h();var e=angular.element(".ng-app").scope();e.$on("onRouteChange",v)}function r(){k().setProject(),C=h()}function s(){i.authCheck().then(d,i.showLoginDialog)}function c(){i.authCheck().then(f,i.showLoginDialog)}function u(){i.authCheck().then(p,i.showLoginDialog)}function d(){var e=C.id;if(0==e)return void t.message("请先保存");var i={};i.isBuilding=!0;var o=t.dialog({selector:".building-dialog",onClosing:function(){return!i.isBuilding}}),r=$(".x-dialog-content",o).text("正在保存...");$(".confirm-btn",o).off("click").on("click",function(){if(!i.resume)return void $(".x-dialog-close",o).click();i.resume=!1;var e=$(".portList",o).val();a.resumeUpload(i.url,e,function(e){var t;switch(e){case 0:t="烧写成功",i.isBuilding=!1;break;case 3:t="连接失败",i.isBuilding=!1;break;case 4:default:t="烧写失败",i.isBuilding=!1}r.html(t)})}),g(e,!1,function(t){return 0!=t?(r.text("保存失败"),void(i.isBuilding=!1)):(r.text("保存成功，正在编译..."),void n.build(e).done(function(e){return 0!=e.status?(r.text("编译失败"),void(i.isBuilding=!1)):(r.text("编译成功，正在烧写..."),void l(e.url,r,i))}))})}function l(e,t,n){a.upload(e,function(i,a){var o;switch(i){case 0:o="烧写成功",n.isBuilding=!1;break;case 1:o="找不到串口",n.isBuilding=!1;break;case 2:o="请选择串口：";for(var r=$('<select class="portList">'),s=0;s<a.length;s++){var c=a[s];$("<option>").text(c.path).attr("title",c.displayName).appendTo(r)}o+=r.prop("outerHTML"),n.resume=!0,n.url=e;break;case 3:o="连接失败",n.isBuilding=!1;break;case 4:default:o="烧写失败",n.isBuilding=!1}t.html(o)})}function f(){var e=C.id;0==e?p():g(e)}function p(){var e=t.dialog(".save-dialog"),n=$("form",e);$('input[name="name"]',n).val(C.project_name),$('textarea[name="intro"]',n).val(C.project_intro),$('input[name="public-type"][value="'+C.public_type+'"]',n).attr("checked",!0),$(".save-btn",n).off("click").on("click",function(){g(0)})}function g(e,a,o){a=0!=a;var r;if(0==e){var s=$(".save-dialog"),c=$("form",s),u=$('input[name="name"]',c).val();r={id:e,project_name:u,user_id:i.getUserId(),project_intro:$('textarea[name="intro"]',c).val(),project_data:JSON.stringify(x()),public_type:$("input[name='public-type']:checked",c).val()},$(".x-dialog-close",s).click()}else r={id:e,user_id:i.getUserId(),project_data:JSON.stringify(x())};n.save(r).done(function(n){0==n.status&&0==e&&(C.id=n.data.project_id,C.project_name=r.project_name,C.project_intro=r.project_intro,C.public_type=r.public_type),a&&t.message(n.message),o&&o(n.status)})}function v(e,t){if(!j){j=!0;var a=t.hash||"";a=/^[0-9a-zA-Z]{6}$/.test(a)?a:"";var o=function(){var e=a?"hash":"last";n.get(a,e).done(m)};i.authCheck().then(o,function(){a?o():(k().reload(),j=!1)})}}function m(e){if(0!=e.status)return t.message(e.message),k().reload(),void(j=!1);if(C=e.data,"string"==typeof C.project_data)try{C.project_data=JSON.parse(C.project_data)}catch(n){C.project_data={}}k().setProject(C.project_data),j=!1}function h(){return{id:0,user_id:i.getUserId(),project_name:"我的项目",project_intro:"我的项目简介",public_type:0,project_data:{}}}function x(){return k().getProject()}function k(){return angular.element("#api-controller").scope().getApi()}var C,j;return{init:o,create:r,save:c,edit:u,upload:s}}),define("app/topMenu",["./EventManager","./project"],function(e,t){function n(){$(".top-menu > ul > li,.sidebar > ul > li").on("click",i)}function i(e){var t=$(this),n=(t.index(),t.data("action"));switch(n){case"new":a();break;case"save":o();break;case"upload":r()}}function a(){t.create()}function o(){t.save()}function r(){t.upload()}return{init:n}}),define("app/config",[],function(){return{guide:{showIfFirstVisit:!0,autoNextDelay:3e3},extension:{appId:"hhgmonhbodfiplppmcangkmlfkcnilpd",uploadDelay:250,bitRate:115200}}}),define("app/app-index",["./EventManager","./util","./user","./project","./topMenu","./config","./ext/agent"],function(e,t,n,i,a,o,r){function s(){c(),angular.bootstrap(".ng-app",["kenrobot"]),r.init(o.extension),n.init(),i.init(),a.init()}function c(){$.ajaxSetup({headers:{"X-CSRF-TOKEN":$('meta[name="csrf-token"]').attr("content")}})}return{init:s}}),require.config({baseUrl:"/assets/js",shim:{"vendor/ace/theme-default":{deps:["./ace"]},"vendor/ace/mode-arduino":{deps:["./ace"]},"vendor/ace/snippets/text":{deps:["../ace"]},"vendor/ace/snippets/arduino":{deps:["../ace","./text"]},"vendor/ace/ext-language_tools":{deps:["./ace","./theme-default","./mode-arduino","./snippets/text","./snippets/arduino"]}}}),require(["./app/app-index"],function(e){e.init()}),define("index",function(){});