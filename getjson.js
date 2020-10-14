new Vue({
    el : '#app',
    data : {
   
     items: [ ],
     listmenu: []   
    },
    created: function() {
     fetch('product.json').then((response) => {
       return response.json().then((json) => {
         console.log("JSONListmenu", json)
         this.listmenu = json
       })
     })
    }
   
   });