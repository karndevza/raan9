const database = firebase.database();
const orderresult = database.ref("orderno");
const productdata = database.ref("products");
const itemstdata = database.ref("items");


new Vue({

 el : '#app',
 data : {
     textMenu_1: "ออกบิล",
     textMenu_2: "รายงาน",
     textMenu_3: "เก็บเงิน",
     selected:'',
     newItem:'',
     ppayid:'0892343728',
     amount:0,

//  menus: [
//          { id:0, name:'หมูจุ่มชุดเล็ก', type:'อาหาร', price: 89  },
//          { id:1, name:'หมูจุ่มชุดกลาง', type:'อาหาร', price: 159  },
//          { id:2, name:'หมูจุ่มชุดใหญ่', type:'อาหาร', price: 189  },
//          { id:3, name:'น้ำแข็ง', type:'เครื่องดื่ม', price: 5  },
//          { id:4, name:'เบียร์ลีโอ', type:'เครื่องดื่ม', price: 65  },
//          { id:5, name:'เบียร์ช้าง', type:'เครื่องดื่ม', price: 70  },
//          { id:6, name:'วุ้นมะพร้าว', type:'ของหวาน', price: 20  }

//      ],
  products_all:[],
  items_all: [ ],
  items: [ ],
  listmenu: [],
  chkout:[],
  totalall:0,
  
    

 },
 created: function() {
  fetch('product.json').then((response) => {
    return response.json().then((json) => {
      console.log("JSONListmenu", json)
      this.listmenu = json
    })
  })

  productdata.on('child_added',snapshot=>{
    this.products_all.push(snapshot.val()) 
    //console.log(this.products_all);
  })

  itemstdata.on('child_added',snapshot=>{
    this.items_all.push(snapshot.val()) 
    console.log(this.items_all);
  })


},
 methods: {   
  //  savejson: function(){   
  //   //const writeJsonFile = require('write-json-file');
  //   //const fs = require('fs');
  //   var d = new Date();
  //   var orderno = d.toJSON();
  //   var total = this.totalall;
   
  //   console.log(orderno);
  //   console.log(total);
    
  //   this.chkout.push( {orderno:orderno,total:total,data:this.items} )
   
  //   var sampleObject = this.chkout;
  //   console.log(this.chkout);
    
  //   fs.writeFile("./order.json", JSON.stringify(sampleObject), (err) => {
  //       if (err) {
  //           console.error(err);
  //           return;
  //       };
  //       console.log("File has been created");
  //       this.chkout=[];
  //   });   
  //  },

     viewmenu: function(){
        Swal.fire({
            title: '',
            text: 'Modal with a custom image. 1 ',
            imageUrl: 'https://unsplash.it/400/200',
            imageWidth: 100,
            imageHeight: 50,
            imageAlt: 'Custom image',
          },
         )
     },
    addItem: function () {
        var text = this.newItem.trim();
        var idex = text.split(":",1);

        var name = this.listmenu[idex].name;
        var price = this.listmenu[idex].price;
        var qty = 1;

        if (idex) {
          this.items.push({ id:idex[0],name:name,qty:qty,price:price  })
         // console.log(idex[0]);
        
          this.newItem = ''
        }
    },
    total: function () {
        var total =  0;
         this.items.forEach(function(item){
               total+= item.price * item.qty
         });
         this.totalall = total;
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
     checkout: function(index){
      var d = new Date();
      var orderno = d.toJSON();
      var total = this.totalall;
      // ---
        var total = index;
      Swal.fire({
        title: total + ' บาท',
        text: "เก็บเงิน ! " + this.ppayid,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'เก็บเงินสด !'
      }).then((result) => {
        if (result.value) {         
           
          Swal.fire(
             name,
            'เก็บเงินเรียบร้อย..!',
            'success'
          ),
          //this.savejson(); ,data:this.items
          orderresult.push( {id:orderno,total:total,data:this.items} )
          
          this.items=[];
        }
      })
       

     }
 }

});