const database = firebase.database();
const orderresult = database.ref("orderno");
const itemstdata = database.ref("items");


var today = new Date();
var dd = chkt(today.getDate());
var mm = chkt(today.getMonth()+1); 
var yyyy = today.getFullYear();


function chkt(xx){
    if(xx<10){ xx = '0'+xx; }
    return xx;
}

// if(dd<10) 
// { dd='0'+dd;} 
// if(mm<10) 
// { mm='0'+mm;} 
var times = chkt(today.getHours())+':'+chkt(today.getMinutes())+':'+chkt(today.getSeconds());
today = mm+''+dd+''+yyyy;

new Vue({

 el : '#item',
 data : {
     textMenu_1: "ออกบิล",
     textMenu_2: "รายงาน",
     textMenu_3: "เก็บเงิน",
     selected:'',
     newItem:'',
     
    
     itemid:0,
     itemname:'',
     itemtype:'',
     itemprice:0,
     stockqty:0,
     user:"admin",
     editdate:"",
     frmmenu:false,

     



//      ],
  typemenu : [  { id:1,val:"อาหาร" },
                { id:2,val:"เครื่องดื่ม" },
                { id:3,val:"ของหวาน"},
             ],

  items_all: [ ],
  items:[],
  bills_all:[],  
  totalall:0
  
 
    

 },

 created: function() {
    itemstdata.on('child_added',snap=>{
      this.items_all.push(snap.val());
    //   console.log(items_all);
    });

    orderresult.on('child_added',snap=>{
       var totals = 0;
         this.bills_all.push({data:snap.val(),key:snap.key}); 
        
    });  


    // กำหนดค่า itemid เริ่มต้น
    itemstdata.orderByChild("id").limitToLast(1).on("child_added", (snap) => {     
      this.itemid = snap.val().id + 1 ;
      console.log(this.itemid);
    });


},

 methods: {   

    
    addItem: function () {
 
        var idex  = this.itemid;
        var name = this.itemname;
        var type = this.itemtype;
        var price = this.itemprice;
        var sqty = this.stockqty;
        var user = this.user;
        var edate = today;
        this.items = [ { id:idex,name:name,type:type,price,price,stockqty:sqty,user:user,editdate:edate}];


        if (idex) {

         // this.items.push({ id:idex[0],name:name,qty:qty,price:price  })
         console.log( this.items);
         itemstdata.push({id:idex,name:name,type:type,price,price,stockqty:sqty,user:user,editdate:edate });

        ///  clear var 
         itemstdata.orderByChild("id").limitToLast(1).on("child_added", (snap) => {     
          this.itemid = snap.val().id + 1 ;        
        });      
         itemname='';
         itemtype='';
         itemprice=0;
         stockqty=0;
         ///  clear var  
        
         // this.newItem = ''
        }
    },  
    totalbill: function () { // 29/7/63   to
     var total =  0;
     //console.log(this.atotal);
          this.bills_all.forEach(function(item){
                total = total + item.data.total;
                console.log(item.total)
          });
          //this.totalall = total;
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
        text: "เก็บเงิน !",
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