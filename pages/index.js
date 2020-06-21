console.log('Welcome devs :) join our discord guild! code with me!');

/* create the link element */
var linkElement = document.createElement('link');

/* add attributes */
linkElement.setAttribute('rel', 'stylesheet');
linkElement.setAttribute('href', 'extsrc/index.css');

/* attach to the document head */
document.getElementsByTagName('head')[0].appendChild(linkElement);
