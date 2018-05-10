window.onload=function(){
    ele1=document.getElementById('led1');
    ele2=document.getElementById('led2');
    ele3=document.getElementById('led3');
    ele4=document.getElementById('led4');
    nd1=new NumbericDisplay(ele1);
    nd2=new NumbericDisplay(ele2);
    nd3=new NumbericDisplay(ele3);
    nd4=new NumbericDisplay(ele4);
    // nd1.inner(data1);
    /*
    let i=0;
    setInterval(function(){
        data1.char=i++;
        nd1.inner(data1);
        nd2.inner(data1);
        nd3.inner(data1);
        nd4.inner(data1);
        if(i>9)i=0;
    },1000)
    */
}

var data1={
    char:1,
    // dot=false,
    // colon=false,
    color:'#00e',
}

var NumbericDisplay=function(ele){
    this.nums=[
        [0,2,3,4,5,6],          //0
        [4,6],                  //1
        [0,1,2,4,5],            //2
        [0,1,2,4,6],            //3
        [1,3,4,6],              //4
        [0,1,2,3,6],            //5
        [0,1,2,3,5,6],            //6
        [0,3,4,6],              //7
        [0,1,2,3,4,5,6],        //8
        [0,1,2,3,4,6],          //9        
    ]
    this.inters=[
        [7]                     //点
        [8,9]                   //冒号
    ]
    // this.data=data;
    // this.svg=svg;
    this.ele=ele;    
    ele.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="40px" height="80px" viewBox="0 0 220 400" style="background-color:#eee"><polygon class="piece-0" points="30,20 170,20 180,30 165,45 35,45 20,30"></polygon><polygon class="piece-1" points="32,190 168,190 180,202 168,215 32,215 20,202"></polygon><polygon class="piece-2" points="30,380 170,380 180,370 165,355 35,355 20,370"></polygon><polygon class="piece-3" points="6,42 17,33 31,47 31,186 17,199 6,188"></polygon><polygon class="piece-4" points="194,42 183,33 169,47 169,186 183,199 194,188"></polygon><polygon class="piece-5" points="6,358 17,367 31,353 31,218 17,204 6,216"></polygon><polygon class="piece-6" points="194,358 183,367 169,353 169,218 183,204 194,216"></polygon><circle class="piece-7" cx="206" cy="370" r="12"></circle><circle class="piece-8" cx="100" cy="140" r="15"></circle><circle class="piece-9" cx="100" cy="300" r="15"></circle></svg>';
    this.numpieces=ele.getElementsByTagName('polygon');
    this.interpieces=ele.getElementsByTagName('circle');
    
}
NumbericDisplay.prototype={    
    inner:function(data){
        var now=new Date();
        console.log(now.getTime());
        this.data=data;
        for(let i=0,m=this.numpieces.length;i<m;i++){
            this.numpieces[i].style.fill='#ddd';
        }
        for(let i=0,m=this.interpieces.length;i<m;i++){
            this.interpieces[i].style.fill='#ddd';
        }
        if(!isNaN(this.data.char)){
            console.log(data.char);
            // console.log(this.numpieces);
            // console.log(this.interpieces);            
            for(let j=0,m=this.nums[this.data.char].length;j<m;j++){
                this.numpieces[this.nums[this.data.char][j]].style.fill=this.data.color;
            }
        }else{

        }
    },
    changeLedNumber:function(data){
        
    }
}

var changeLedNumber=function(data,obj){

}
