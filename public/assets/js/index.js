define("app/EventManager",[],function(){function e(e,t){return e+"_"+t}function t(t,n,i){var o=e(t,n),r=a[o];r||(r=[],a[o]=r),r.push(i)}function n(t,n,i){var o=e(t,n),r=a[o];if(r)for(var s=0;s<r.length;s++){var c=r[s];if(c==i){r.splice(s,1);break}}}function i(t,n,i){var o=e(t,n),r=a[o];if(r)for(var s=0;s<r.length;s++){var c=r[s];c(i)}}var a={};return{bind:t,unbind:n,trigger:i}}),define("app/util",[],function(){function e(e){var t=300;$("div.x-message").stop(!0).fadeOut(t/2,function(){$(this).remove()}),e="string"==typeof e?{text:e}:e;var n=e.type||"info",i=e.text,a='<div class="x-message x-message-'+n+'"><i class="x-message-close kenrobot ken-close"></i>'+i+"</div>",o=$(a);$(".x-message-close",o).on("click",function(){o.stop(!0).fadeOut(t/2,function(){o.remove()})}),o.appendTo($(".message-layer")).css({left:($(window).width()-o.width())/2,top:-o.height()}).animate({top:150},t,"swing").delay(2e3).fadeOut(t,function(){o.remove()})}function t(e){e="string"==typeof e?{selector:e}:e;var t=e.selector,n=$(t);if(!n||!n.hasClass("x-dialog"))return!1;var i=e.onConfirm,a=e.onCancel,o=e.onClosing,r=e.onClose,s=e.onShow,c=e.content;c&&$(".x-dialog-content",n).text(c);var u=$(".dialog-layer").addClass("active"),d=function(e){n.removeClass("dialog-fadeIn").addClass("dialog-fadeOut").delay(300).queue(function(){n.hide().removeClass("dialog-fadeOut"),u.removeClass("active"),r&&r(),e&&e()})};return $(".x-dialog-btns .confirm",n).off("click").on("click",function(){o&&0==o()||d(i)}),$(".x-dialog-close,.x-dialog-btns .cancel",n).off("click").on("click",function(){o&&0==o()||d(a)}),s&&s(),n.stop().show().removeClass("dialog-fadeOut").addClass("dialog-fadeIn"),n}function n(){return $(".dialog-layer").hasClass("active")}function i(e,t,n){return n=n||"active",t?e.hasClass(n)?(e.removeClass(n),!1):(e.siblings("."+n).removeClass(n),e.addClass(n),!0):e.hasClass(n)?!1:(e.siblings("."+n).removeClass(n),e.addClass(n),!0)}function a(e,t){var n=new CustomEvent(e,{detail:t});window.dispatchEvent(n)}return{message:e,dialog:t,isInDialog:n,toggleActive:i,dispatchEvent:a}}),!function(e){e(jQuery)}(function(e){function t(e){return s.raw?e:encodeURIComponent(e)}function n(e){return s.raw?e:decodeURIComponent(e)}function i(e){return t(s.json?JSON.stringify(e):String(e))}function a(e){0===e.indexOf('"')&&(e=e.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\"));try{return e=decodeURIComponent(e.replace(r," ")),s.json?JSON.parse(e):e}catch(t){}}function o(t,n){var i=s.raw?t:a(t);return e.isFunction(n)?n(i):i}var r=/\+/g,s=e.cookie=function(a,r,c){if(void 0!==r&&!e.isFunction(r)){if(c=e.extend({},s.defaults,c),"number"==typeof c.expires){var u=c.expires,d=c.expires=new Date;d.setTime(+d+864e5*u)}return document.cookie=[t(a),"=",i(r),c.expires?"; expires="+c.expires.toUTCString():"",c.path?"; path="+c.path:"",c.domain?"; domain="+c.domain:"",c.secure?"; secure":""].join("")}for(var l=a?void 0:{},f=document.cookie?document.cookie.split("; "):[],p=0,g=f.length;g>p;p++){var v=f[p].split("="),m=n(v.shift()),h=v.join("=");if(a&&a===m){l=o(h,r);break}a||void 0===(h=o(h))||(l[m]=h)}return l};s.defaults={},e.removeCookie=function(t,n){return void 0===e.cookie(t)?!1:(e.cookie(t,"",e.extend({},n,{expires:-1})),!e.cookie(t))}}),define("vendor/jquery.cookie",function(){}),define("app/config",[],function(){return{guide:{showIfFirstVisit:!0,autoNextDelay:3e3},project:{maxCodeLength:10485760},extension:{appId:"hhgmonhbodfiplppmcangkmlfkcnilpd",uploadDelay:250,bitRate:115200}}}),define("app/userApi",["./config"],function(e){function t(){return $.ajax({type:"POST",url:r+"/api/auth/check",data:{id:0},dataType:"json"})}function n(e,t){return $.ajax({type:"POST",url:r+"/api/auth/login",dataType:"json",data:{email:e,password:t}})}function i(e){return $.ajax({type:"POST",url:r+"/api/auth/login/weixin",data:{key:e},dataType:"json"})}function a(){return $.ajax({type:"POST",url:r+"/api/auth/info",data:{id:0},dataType:"json"})}function o(){return $.ajax({type:"POST",url:r+"/api/auth/logout",data:{id:0},dataType:"json"})}var r=e.host||"";return{authCheck:t,login:n,weixinLogin:i,loginInfo:a,logout:o}}),define("app/user",["vendor/jquery.cookie","./EventManager","./util","./config","./userApi"],function(e,t,n,i,a){function o(){l(),v(),m(),$(".user-login li").on("click",k),i.pc&&u().done(x)}function r(){return C?C.id:0}function s(){return C}function c(){return C?C.name:""}function u(e){var t=$.Deferred();return a.authCheck().done(function(e){0==e.status?(C=e.user,t.resolve(e.user)):(C=null,t.reject())}),t}function d(e,t,i){y=e;var a=n.dialog({selector:".login-dialog",onClosing:function(){y=null,p(!1)}});$(".email",a).val(""),$(".password",a).val(""),t=t||"account",$(".switch ."+t,a).click(),i?($(".switch",a).removeClass("active"),$(".login-tips",a).removeClass("active"),$(".register-tips",a).addClass("active"),$(".footer .login-footer",a).removeClass("active"),$(".footer .register-footer",a).addClass("active")):($(".switch",a).addClass("active"),$(".login-tips",a).addClass("active"),$(".register-tips",a).removeClass("active"),$(".footer .login-footer",a).addClass("active"),$(".footer .register-footer",a).removeClass("active")),"account"==t&&$(".email",a).focus()}function l(){var e=$(".login-dialog");i.pc&&a.loginInfo().done(function(t){$(".qrcode-key",e).val(t.key),$(".qrcode",e).attr("src",t.qrcode),$(".forget-password",e).attr("href",t.find_password_url),$(".register",e).attr("href",t.register_url)});var t=$(".scan",e);$(".switch li",e).on("click",function(){var t=$(this),i=t.data("action"),a=$(".tab-"+i,e);n.toggleActive(a),n.toggleActive(t),"weixin"==i?p(!0):($(".email",e).focus(),p(!1))}),$(".login-btn",e).on("click",f);var o;$(".qrcode",e).hover(function(n){e.is(":animated")||(clearTimeout(o),t.stop().show().removeClass("x-fadeOut").addClass("x-fadeIn"))},function(n){e.is(":animated")||(t.removeClass("x-fadeIn").addClass("x-fadeOut"),o=setTimeout(function(){t.hide().removeClass("x-fadeOut")},300))}),$("form",e).on("keyup",function(t){13==t.keyCode&&$(".tab-account",e).hasClass("active")&&$(".login-btn",e).trigger("click")})}function f(){var e=$(".login-dialog"),i=$(".email",e).val(),o=$(".password",e).val();a.login(i,o).done(function(i){if(0==i.status)n.message(i.message),$(".x-dialog-close",e).click(),x(i.data),g(),t.trigger("user","login");else if(1==i.status)x(i.data),g();else{var a=$(".message",e);a.addClass("active").text(i.message).delay(2e3).queue(function(){a.removeClass("active").text("").dequeue()})}})}function p(e){if(clearInterval(j),e){var i=$(".login-dialog"),o=function(){var e=$(".qrcode-key",i).val();a.weixinLogin(e).done(function(e){0==e.status?(p(!1),$(".x-dialog-close",i).click(),n.message(e.message),x(e.data),g(),t.trigger("user","login")):1==e.status&&(p(!1),x(e.data))})};j=setInterval(o,3e3)}}function g(){y&&y()}function v(){var e=$(".user"),t=$(".user-menu",e),n=function(){t.hide()};t.on("mouseleave",n),e.on("mouseleave",n),$(".user-info",e).on("mouseover",function(){t.show()}),$("ul > li",t).on("click",h),e.hasClass("active")&&$(".top-menu").css({"margin-right":e.width()})}function m(){var e=$(".copyright"),t=$.cookie("hideCopyright");t?e.remove():(e.addClass("active"),$(".close-btn",e).on("click",function(){e.fadeOut(function(){e.remove(),$.cookie("hideCopyright",!0)})}))}function h(e){var t=$(this),o=t.data("action");switch(o){case"share":n.message("敬请期待");break;case"setting":n.message("敬请期待");break;case"logout":i.pc?a.logout().done(function(){n.dispatchEvent("app:reload")}):window.location.href="/logout"}}function x(e){C=e;var t=$(".user"),n=$(".top-menu");C?(t.addClass("active"),$(".photo img",t).attr("src",C.avatar_url),$(".name",t).text(C.name),n.css({"margin-right":t.width()})):(t.removeClass("active"),$(".name",t).text(""),$(".photo img",t).attr("src","#"),n.css({"margin-right":0}))}function k(e){var t=$(this).data("action");d(null,"weixin","register"==t)}var C,j,y;return{init:o,getUserId:r,getUserInfo:s,getUserName:c,authCheck:u,showLoginDialog:d}}),define("app/projectApi",["./config","./user","./util"],function(e,t,n){function i(e,n){n=n||"id";var i={};return i.user_id=t.getUserId(),"hash"==n?i.hash=e:"last"==n?i.type="last":i.id=e,$.ajax({type:"POST",url:c+"/api/project/get",data:i,dataType:"json"})}function a(){return $.ajax({type:"POST",url:c+"/api/projects/user",data:{user_id:t.getUserId()},dataType:"json"})}function o(t){return e.pc?window.kenrobot.api.project.save(t):$.ajax({type:"POST",url:c+"/api/project/save",data:t,dataType:"json"})}function r(n){return e.pc?window.kenrobot.api.project.build(n):$.ajax({type:"POST",url:c+"/api/project/build",dataType:"json",data:{id:n,user_id:t.getUserId()}})}function s(n){return e.pc?window.kenrobot.api.project.remove(n):$.ajax({type:"POST",url:c+"/api/project/delete",data:{id:n,user_id:t.getUserId()},dataType:"json"})}var c=e.host||"";return{get:i,getAll:a,save:o,build:r,remove:s}}),define("app/ext/uploader",[],function(){function e(e,t){a=e,o=t,r=window.location.protocol+"//"+window.location.host}function t(e,t){var a=function(i){for(var a,o=0;o<i.length;o++){var r=i[o],c=r.displayName;if(c&&s.test(c)){a=r;break}}return a?void n(e,a.path,t):void t(2,i)},o=!0,r=function(){i("serial.getDevices",function(e){return e&&0!=e.length?void a(e):void(o?(o=!1,setTimeout(r,1e3)):t(1))})};r()}function n(e,t,n){i({action:"serial.connect",portPath:t,bitRate:o.bitRate},function(t){return t?void i({action:"upload",url:r+e+"/hex",delay:o.uploadDelay},function(e){i({action:"serial.disconnect",connectionId:t}),n(e?0:4)}):void n(3)})}function i(e,t){e="string"==typeof e?{action:e}:e,t=t||function(){},a.runtime.sendMessage(o.appId,e,t)}var a,o,r,s=/(arduino)|(\/dev\/cu\.usbmodem)/i;return{init:e,upload:t,resumeUpload:n}}),define("app/ext/agent",["../util","./uploader"],function(e,t){function n(e){d=e,l=o(),t.init(l,d);var n;n=-1!=navigator.userAgent.indexOf("WOW64")||-1!=navigator.userAgent.indexOf("Win64")?64:32;var i="/download/arduino-driver-x"+n+".zip";$(".arduino-driver-dialog .downloadUrl").attr("href",i)}function i(t){return a()&&l?void r(function(e){e?t():s()}):void e.message("啃萝卜扩展目前只支持Chrome浏览器，其它浏览器敬请期待！")}function a(){return navigator.userAgent.toLowerCase().indexOf("chrome")>-1}function o(){return a()?window.chrome:null}function r(e){l.runtime.sendMessage(d.appId,"ping",function(t){e(t&&"ping"==t.action&&"pong"==t.result?!0:!1)})}function s(){e.dialog(".install-dialog")}function c(e,n){i(function(){t.upload(e,n)})}function u(e,n,i){t.resumeUpload(e,n,i)}var d,l;return{init:n,upload:c,resumeUpload:u}}),define("app/project",["./EventManager","./config","./util","./projectApi","./user","./ext/agent"],function(e,t,n,i,a,o){function r(){C=h();var e=angular.element(".ng-app").scope();e.$on("onRouteChange",v)}function s(){k().setProject(),C=h()}function c(){a.authCheck().then(d,a.showLoginDialog)}function u(){t.pc?f():a.authCheck().then(f,a.showLoginDialog)}function d(){var e=C.id;if(0==e)return void n.message("请先保存");var t={};t.isBuilding=!0;var a=n.dialog({selector:".building-dialog",onClosing:function(){return!t.isBuilding}}),r=$(".x-dialog-content",a).text("正在保存...");$(".confirm-btn",a).off("click").on("click",function(){if(!t.resume)return void $(".x-dialog-close",a).click();t.resume=!1;var e=$(".portList",a).val();r.text("正在烧写..."),o.resumeUpload(t.url,e,function(e){var n;switch(e){case 0:n="烧写成功",t.isBuilding=!1;break;case 3:n="连接失败",t.isBuilding=!1;break;case 4:default:n="烧写失败",t.isBuilding=!1}r.html(n)})}),g(e,!1,function(n){return 0!=n?(r.text("保存失败"),void(t.isBuilding=!1)):(r.text("保存成功，正在编译..."),void i.build(e).done(function(e){return 0!=e.status?(r.text("编译失败"),void(t.isBuilding=!1)):(r.text("编译成功，正在烧写..."),void l(e.url,r,t))}))})}function l(e,t,n){o.upload(e,function(i,a){var o;switch(i){case 0:o="烧写成功",n.isBuilding=!1;break;case 1:o="找不到串口",n.isBuilding=!1;break;case 2:o="请选择串口：";for(var r=$('<select class="portList">'),s=0;s<a.length;s++){var c=a[s];$("<option>").text(c.path).attr("title",c.displayName).appendTo(r)}o+=r.prop("outerHTML"),n.resume=!0,n.url=e;break;case 3:o="连接失败",n.isBuilding=!1;break;case 4:default:o="烧写失败",n.isBuilding=!1}t.html(o)})}function f(){var e=C.id;0==e?p():g(e)}function p(){var e=n.dialog(".save-dialog"),t=$("form",e);$('input[name="name"]',t).val(C.project_name),$('textarea[name="intro"]',t).val(C.project_intro),$('input[name="public-type"][value="'+C.public_type+'"]',t).attr("checked",!0),$(".save-btn",t).off("click").on("click",function(){g(0)})}function g(e,o,r){o=0!=o;var s;if(0==e){var c=$(".save-dialog"),u=$("form",c),d=$('input[name="name"]',u).val();s={id:e,project_name:d,user_id:a.getUserId(),project_intro:$('textarea[name="intro"]',u).val(),project_data:JSON.stringify(x()),public_type:$("input[name='public-type']:checked",u).val()},$(".x-dialog-close",c).click()}else s={id:e,user_id:a.getUserId(),project_data:JSON.stringify(x())};return s.project_data.length>t.project.maxCodeLength?void n.showMessage("代码太长"):void i.save(s).done(function(t){0==t.status&&0==e&&(C.id=t.data.project_id,C.project_name=s.project_name,C.project_intro=s.project_intro,C.public_type=s.public_type),o&&n.message(t.message),r&&r(t.status)})}function v(e,t){if(!j){j=!0;var n=t.hash,a=t.action,o=function(){if(a){if("create"==a)return k().reload(),void(j=!1)}else if(n)return void i.get(n,"hash").done(m);k().reload(),j=!1};setTimeout(o,100)}}function m(e){if(0!=e.status)return n.message(e.message),k().reload(),void(j=!1);if(C=e.data,"string"==typeof C.project_data)try{C.project_data=JSON.parse(C.project_data)}catch(t){C.project_data={}}k().setProject(C.project_data),j=!1}function h(){return{id:0,user_id:a.getUserId(),project_name:"我的项目",project_intro:"我的项目简介",public_type:2,project_data:{}}}function x(){return k().getProject()}function k(){return angular.element("#api-controller").scope().getApi()}var C,j;return{init:r,create:s,save:u,upload:c}}),define("app/topMenu",["./EventManager","./project"],function(e,t){function n(){$(".top-menu > ul > li,.sidebar > ul > li").on("click",i)}function i(e){var t=$(this),n=(t.index(),t.data("action"));switch(n){case"new":a();break;case"save":o();break;case"upload":r()}}function a(){t.create()}function o(){t.save()}function r(){t.upload()}return{init:n}}),define("app/guide",["vendor/jquery.cookie","./util"],function(e,t){function n(){o=$(".guide-cover"),$.cookie("has_visit")||($(window).on("keyup",a),o.addClass("active").on("click",a),$(".guide-skip",o).on("click",i),a())}function i(e){$(".guide-highlight").removeClass("guide-highlight"),$(window).off("keyup",a),$(".guide-skip",o).off("click",i),o.off("click",a).removeClass("active").remove(),o=null,$.cookie("has_visit",!0,{expires:365})}function a(e){var n=(new Date).getTime();if(!(r&&r+1e3>n||e&&e.keyCode&&32!=e.keyCode)){r=n;var a=$(".guide-step",o),s=a.filter(".active").index();if(s+=1,s<a.length){o.show(),$(".guide-highlight").removeClass("guide-highlight");var c=a.eq(s);t.toggleActive(c);var u=$(c.data("target"));u.addClass("guide-highlight"),(1==s||2==s)&&$(">button",u).click()}else i()}}var o,r;return{init:n}}),define("app/app-index",["./EventManager","./util","./user","./project","./topMenu","./config","./ext/agent","./guide"],function(e,t,n,i,a,o,r,s){function c(){o.pc||u(),o.pc&&d(),angular.bootstrap(".ng-app",["kenrobot"]),r.init(o.extension),n.init(),i.init(),a.init(),s.init()}function u(){$.ajaxSetup({headers:{"X-CSRF-TOKEN":$('meta[name="csrf-token"]').attr("content")}})}function d(){var e=function(e){t.dispatchEvent("app:openUrl",{url:e})};$("a.open-browser").on("click",function(){return e($(this).attr("href")),!1})}return{init:c}}),require.config({baseUrl:"assets/js",shim:{"vendor/ace/theme-default":{deps:["./ace"]},"vendor/ace/mode-arduino":{deps:["./ace"]},"vendor/ace/snippets/text":{deps:["../ace"]},"vendor/ace/snippets/arduino":{deps:["../ace","./text"]},"vendor/ace/ext-language_tools":{deps:["./ace","./theme-default","./mode-arduino","./snippets/text","./snippets/arduino"]}}}),require(["./app/app-index"],function(e){e.init()}),define("index",function(){});