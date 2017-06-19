var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 22.663, lng: 120.344},
        zoom: 12
    });
	
	//定位自己
    var infoWindow = new google.maps.InfoWindow({map: map});

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

        infoWindow.setPosition(pos);
        infoWindow.setContent('Your Position.');
        map.setCenter(pos);
      }, function() {
          handleLocationError(true, infoWindow, map.getCenter());
        });
  	} else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
  	}
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                      'Error: The Geolocation service failed.' :
                      'Error: Your browser doesn\'t support geolocation.');
}

function test(){
  var area = document.getElementById("area").value;
  var identity = "使用費收費標準("+document.getElementById("identity").value+")";
  var type = document.getElementById("type").value;
  var cost = document.getElementById("cost").value;

  var add1 = document.getElementById("area");
  $.ajax({
    type:'GET', 
    url:'http://data.kcg.gov.tw/api/action/datastore_search?resource_id=a20be607-53b9-4847-8f9c-fdf682964dc6',

    success:function(data) {
      var myLatLng = {lat: 22.663, lng: 120.344};
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: myLatLng
      });
      var ftype=''
      var lingu_data = ''; 
      for (i = 0; data.result.total > i; i++) {
        var name=data.result.records[i].名稱
        var linguplace = data.result.records[i]['行政區'];
        var linguidentity = data.result.records[i][identity];
        var lingutype = data.result.records[i]['櫃位型']; //搜尋骨灰櫃時雙人式骨灰櫃也會出現 
        var id=data.result.records[i]._id
        if( linguplace.match(area) && lingutype.match(type)){
          if(parseInt(linguidentity)<=parseInt(cost)){  
            lingu_data += '<li>名稱：'+name+'<br/>櫃位型態：'+lingutype+'<br/>類別價位：'+linguidentity+'</li>';
            document.getElementById("lingu_data").innerHTML = lingu_data;
            mark(id,add1,name);
            
          }
        }
      }  
      

      function mark(id,add1,name){
        
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( { address: add1.value+name}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {                
            var Longitude= results[0].geometry.location.lng();
            var Latitude = results[0].geometry.location.lat();

            a=parseFloat(Longitude);
            b=parseFloat(Latitude);
                    
            addmark(id,name)
          }else {

            //alert("資料太多給我確認，我給你全世界!!" );//改，DEMO可以隱藏 的話出現的資料會比較不完全因為程式跑太快
                
                }
        });
      }  

      function addmark(id,name){
      if(id<=10||id>=33){
        ftype=ftype+'<table id="mapinfo" >'+'<tr>'+'<td rowspan="3" id="mapinfo">'
        +data.result.records[id-1].櫃位型+'</td>'+'<td rowspan="3" id="mapinfo">'
        +data.result.records[id-1]['樓  別']+'</td>'+'<td>區民價:'
        +data.result.records[id-1]['使用費收費標準(區民)']+'元</td></tr><tr><td>市民價:'
        +data.result.records[id-1]['使用費收費標準(市民)']+'元</td></tr><tr><td>里民價:'
        +data.result.records[id-1]['使用費收費標準(里民)']+'元</td></tr></table>'+'<br>';
      }else if(id>10 && id<32){
        ftype=ftype+'<table id="mapinfo">'+'<tr>'+'<td rowspan="3" id="mapinfo">'
        +data.result.records[id].櫃位型+'</td>'+'<td rowspan="3" id="mapinfo">'
        +data.result.records[id]['樓  別']+'</td>'+'<td>區民價:'
        +data.result.records[id]['使用費收費標準(區民)']+'元</td></tr><tr><td>市民價:'
        +data.result.records[id]['使用費收費標準(市民)']+'元</td></tr><tr><td>里民價:'
        +data.result.records[id]['使用費收費標準(里民)']+'元</td></tr></table>'+'<br>';
      }else{
        ftype=ftype+'<table id="mapinfo">'+'<tr>'+'<td rowspan="3" id="mapinfo">'
        +data.result.records[10].櫃位型+'</td>'+'<td rowspan="3" id="mapinfo">'
        +data.result.records[10]['樓  別']+'</td>'+'<td>區民價:'
        +data.result.records[10]['使用費收費標準(區民)']+'元</td></tr><tr><td>市民價:'
        +data.result.records[10]['使用費收費標準(市民)']+'元</td></tr><tr><td>里民價:'
        +data.result.records[10]['使用費收費標準(里民)']+'元</td></tr></table>'+'<br>';
      }
        var locate = {lat:b, lng:a};
        var image = {
          url: 'img/mark.png',
          scaledSize: new google.maps.Size(40, 40),
        };

        var marker = new google.maps.Marker({
          position: locate,
          map: map,
          title: 'Hello World!',
          animation: google.maps.Animation.DROP,
          icon: image
        });
                      
        var infowindow = new google.maps.InfoWindow({
          content:
          '<div style="font-family: 微軟正黑體;font-size:20px;color:blue;"><h1>靈骨塔資訊</h1></div>'+
                  '<p style="font-family: 微軟正黑體;font-size:16px;color:red;">名稱:</p>'+name+'<p style="font-family: 微軟正黑體;font-size:16px;color:red;">塔價位:</p>'+ftype
        });

        marker.addListener('click', toggleBounce);
        google.maps.event.addListener( marker, 'click', function() {
          infowindow.open( map, marker );
        });
                        
        function toggleBounce() {
          if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
          } else {
              marker.setAnimation(google.maps.Animation.BOUNCE);
            }
        }
      }   
    }//sucessdata
  });//ajax
}

