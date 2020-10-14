const database = firebase.database();
const orderresult = database.ref("orderno");
const productdata = database.ref("products");
const itemstdata = database.ref("items");
//const axios = require('axios');


var today = new Date();
var dd = chkt(today.getDate());
var mm = chkt(today.getMonth()+1); 
var yyyy = today.getFullYear();
var timestamp = chkt(today.getHours())+':'+chkt(today.getMinutes())+':'+chkt(today.getSeconds());
var timesnum = chkt(today.getHours())+''+chkt(today.getMinutes())+''+chkt(today.getSeconds());
// if(dd<10) 
// { dd='0'+dd;} 
// if(mm<10) 
// { mm='0'+mm;} 
function chkt(xx){
    xx = ( xx<10 ) ? '0'+xx : xx ;
  //if(xx<10){ xx = '0'+xx; }
  return xx;
}

function genno(str){
  //console.log(str);
  var res =  parseInt(str) + 1;
  //console.log(res);
   return res;
}

function rep(len, chr) { 
  return new Array(len+1).join(chr);
}

function pad(number, length) {
   
  var str = '' + number;
  while (str.length < length) {
      str = '0' + str;
  }
 
  return str;

}

// function makeGetRequest(path, queryObj) { 
//   axios.post(path,  queryObj ).then( 
  function makeGetRequest(path) { 
    axios.get(path).then( 
    (response) => { 
     // var result = response.data; 
      //console.log(result); 
      return response.data;
    }, 
    (error) => { 
      console.log(error); 
    } 
  ); 
} 


today = dd+''+mm+''+yyyy;

new Vue({

 el : '#app',
 data : {
     textMenu_1: "ออกบิล",
     textMenu_2: "รายงาน",
     textMenu_3: "เก็บเงิน",
     selected:'',
     newItem:'',
     docno:0,
     docid:0,
     promtpayid:"0892343728",

//      ],
  promtpay_data:[],
  products_all:[],
  items_all: [ ],
  items: [ ],
  listmenu: [],
  chkout:[],
  totalall:0, 
    

 },
 created: function() {
  // fetch('product.json').then((response) => {
  //   return response.json().then((json) => {
  //     //console.log("JSONListmenu", json)
  //     this.listmenu = json
  //   })
  // })

  productdata.on('child_added',snapshot=>{
    this.products_all.push(snapshot.val()) 
    //console.log(this.products_all);
  })

  itemstdata.on('child_added',snapshot=>{
    this.items_all.push(snapshot.val()); 
    this.listmenu.push(snapshot.val()); 
    //console.log(this.items_all);
  })


  orderresult.orderByChild("id").limitToLast(1).on("child_added", (snap) => {  
    this.docno = 0;
    this.docid = 0;
    var ndocno = genno(snap.val().docno);  
    var ndocid = pad(genno(snap.val().id),6);   
    this.docno = ndocno;    
    this.docid =  ndocid ;   
  });
  

},
 methods: {   


   
     viewmenu: function(){     
      var amt = this.totalall;
      var url = "http://localhost/ppqr/index.php?id="+this.promtpayid+"&amt="+amt;   
      axios.get(url).then( 
        (response) => { 
          this.promtpay_data  = response.data;      
        }, 
        (error) => { 
          console.log(error); 
        } )
      


      //this.promtpay_data   =  makeGetRequest(url) 
      //console.log( this.promtpay_data );
        Swal.fire({
            title: '',
            text: 'พร้อมเพย์ ' + this.promtpayid + " ราคา : " +  amt + " บาท",
            imageUrl: this.promtpay_data.dataimg,
            imageWidth: 200,
            imageHeight: 150,
            imageAlt: 'Custom image',
          },
         )
     },
     addItems: function (data) {
      var idex = "";        
      idex = data.toString();    
      console.log(idex);
      var id = this.listmenu[idex].id;     
      var name = this.listmenu[idex].name;     
      console.log(name);
      var price = this.listmenu[idex].price;
      var qty = 1;
     
      if (idex) {
        this.items.push({ itemid:idex[0],name:name,qty:qty,price:price  })
       //console.log(idex[0]);
      
        this.newItem = ''
      }
     },
    
    addItem: function () {
        var idex = "";
        var text = this.newItem.trim();
          idex = text.split(":",1);
         console.log("text: "+text);     
       

        var name = this.listmenu[idex].name;
        var price = this.listmenu[idex].price;
        var qty = 1;

        if (idex) {
          this.items.push({ itemid:idex[0],name:name,qty:qty,price:price  })
         //console.log(idex[0]);
        
          this.newItem = ''
        }
    },
    total: function () {
      var amt = 0;
      var url = "";        
     
      
        var total =  0;
         this.items.forEach(function(item){
               total+= item.price * item.qty
         });
         this.totalall = total; 
         amt = total;  
         url = "http://localhost/ppqr/index.php?id="+this.promtpayid+"&amt="+amt;  
        
         axios.get(url).then( 
          (response) => { 
            this.promtpay_data  = response.data;  
          }, 
          (error) => { 
            console.log(error); 
          } )

        return total;   
    },
    removeItem: function(index){
         //   console.log(index)
          //  this.items.slice(index,1);
           var name = this.items[index].name;
           Swal.fire({
            title: name + ' ?',
            text: "ต้องการ ลบ รายการนี้หรือไม่ !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ลบทันที !'
          }).then((result) => {
            if (result.value) {
                this.items.splice(index,1);
              Swal.fire(
                 name,
                'ทำการลบเรียบร้อย..!',
                'success'
              )
            }
          })
    },
    plusQty: function(index){
            this.items[index].qty += 1;
   
       },
    minusQty: function(index){  
     this.items[index].qty -= 1;
       if (this.items[index].qty <= 0){
           //this.items[index].qty = 0;
          // removeItem(index);
           this.items.splice(index,1);
         }
     },  
    
     getpromtpay: function(amt){
      var url = "http://localhost/ppqr/index.php?id="+this.promtpayid+"&amt="+amt;
      //queryObj = { id: this.promtpayid ,amt:amt};
      //promtpay_data = makeGetRequest(url);    
      //console.log(promtpay_data)

      axios.get(url).then( 
        (response) => { 
          promtpay_data  = response.data; 
          console.log(promtpay_data.dataimg); 
          //return result;
        }, 
        (error) => { 
          console.log(error); 
        } )

     },
     checkout: function(index){
      //var d = new Date();
      //var orderno = d.toJSON();
      var orderno = today+''+timesnum;
      var docid = this.docid;
      var docno = this.docno;
      var d_date = today;
      var d_time = timestamp;
      var total = this.totalall;
      // ---
      var total = index;
      Swal.fire({
        title: total + ' บาท',
      //  text: "เก็บเงิน !",
       // icon: 'warning',

        text: 'แสกน พร้อมเพย์ ' + this.promtpayid + " ราคา : " +  total + " บาท",
        imageUrl: this.promtpay_data.dataimg,
        imageWidth: 250,
        imageHeight: 250,
        
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ชำระเงิน'
      }).then((result) => {
        if (result.value) {         
           
          Swal.fire(
             name,
            'เก็บเงินเรียบร้อย..!',
            'success'
          ),
          //this.savejson(); ,data:this.items
          orderresult.push( {id:docid,docno:docno,date:d_date,time:d_time,total:total,data:this.items} )
          
          this.items=[];
        }
      })
       

     }
 }

});