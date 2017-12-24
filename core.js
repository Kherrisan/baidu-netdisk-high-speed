var actualCode = "Object.defineProperty(navigator,'platform',{get:function(){return '';}});";
var s = document.createElement('script');
s.textContent = actualCode;
document.documentElement.appendChild(s);
s.remove();
