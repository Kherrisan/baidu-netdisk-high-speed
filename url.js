function setURL(url) {
  const e = document.getElementById("url");
  e.textContent = url;
  e.select();
  document.execCommand('copy');

  e.onclick = function () {
    e.select();
    document.execCommand('copy');
  }
}