function MostrarDatos(Quien, OK) {

    
 switch (Quien) {
  
  case "embPopup":

    // document.getElementById("embPopup").innerHTML = Resp;
    // console.log(Resp);
    // var mR = document.querySelector(".miRuta");
    // var eT = document.querySelector(".ErrorTipificaciones");

    if (OK[0].getElementsByTagName("Dato")[1].childNodes[0].data != ""){
      window.open(OK[0].getElementsByTagName("Dato")[1].childNodes[0].data, "", "", false);

    }

    //console.log("estamos en el case.");

   break;
 }
}
