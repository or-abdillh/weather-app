const selectProv = $("#dataProv");
const selectKota = $("#dataKota");
const selectKec = $("#dataKec");
const btnSubmit = $('#submit');
const btnReset = $('#reset');
const dataArr = [];
var idWilayah;
let kecamatanUser;
let kotaKabUser;
let provinsiUser;

//REQUEST HTTP ENDPOINT 'https://ibnux.github.io/BMKG-importer/cuaca/'
//RENDER DAFTAR PROVINSI
$.ajax({
  url : 'https://ibnux.github.io/BMKG-importer/cuaca/wilayah.json',
  dataType : 'JSON',
  type : 'get',
  success : (result) => {
    $.each(result, (index, data) => {
        dataArr[index] = data.propinsi;
    })
    const dataNoDouble = Array.from(new Set(dataArr));
    $.each(dataNoDouble, (index, prov) => {
      selectProv.append(`
      <option value="${prov}">${prov}</option>
      `);
    })
    selectProv.val('')
  }
});

//EVENT SELECT PROVINSI => KOTA USER
const methodSelectProv = () => {
  const provUser = selectProv.val();
  provinsiUser = provUser;
  selectKota.html(' ');
  selectKec.html(' ');
  //TRIGGER DISABLED ENABLE OPTION KOTA
  selectKota.toggleClass('off');
  //
  $.ajax({
    url: 'https://ibnux.github.io/BMKG-importer/cuaca/wilayah.json',
    dataType: 'JSON',
    type: 'get',
    success: (result) => {
      selectKota.html(' ');
      $.each(result, (i, item) => {
        if (item.propinsi == provUser) {
          selectKota.append(`
           <option value="${item.kota}">${item.kota}</option>
           `);
        }
      });
      //MENGOSONGKAN VALUE SAAT PERTAMA KALI DI RENDER
      selectKota.val(' ');
      //DISABLED ENABLE OPTION KOTA
      if (selectKota.attr('class') == 'off') {
        selectKota.attr('disabled', true);
      } else {
        selectKota.attr('disabled', false);
      }
    }
  })
}

selectProv.on('input', () => {
  methodSelectProv();
})

//EVENT SELECT KOTA => KECAMATAN USER
const methodSelectKota = () => {
  const kotaUser = selectKota.val();
  kotaKabUser = kotaUser;
  //TRIGGER DISABLED ENBALE OPTION KECAMATAN
  selectKec.toggleClass('off');
  //
  $.ajax({
    url: 'https://ibnux.github.io/BMKG-importer/cuaca/wilayah.json',
    dataType: 'JSON',
    type: 'get',
    success: (result) => {
      $.each(result, (i, item) => {
        if (item.kota == kotaUser) {
          selectKec.append(`
             <option value="${item.kecamatan}">${item.kecamatan}</option>
             `);
        }
      });
      selectKec.val(' ');
      //DISABLED ENABLE OPTION KECAMATAN
      if (selectKec.attr('class') == 'off') {
        selectKec.attr('disabled', true);
      } else {
        selectKec.attr('disabled', false);
      }
    }
  })
}

selectKota.on('input', () => {
  methodSelectKota();
})

//EVENT SELECT KECAMATAN => ID WILAYAH
//REQUEST DATA CUACA ENDPOINT 'https://ibnux.github.io/BMKG-importer/cuaca/idWilayah.json'
const methodSelectKec = () => {
  const kecUser = selectKec.val();
  kecamatanUser = kecUser;
  //TRIGER ENABLE DISABLED BUTTON SUBMIT
  btnSubmit.toggleClass('off');
  //
  $.ajax({
    url: 'https://ibnux.github.io/BMKG-importer/cuaca/wilayah.json',
    dataType: 'JSON',
    type: 'get',
    success: (result) => {
      $.each(result, (i, item) => {
        if (item.kecamatan == kecUser) {
          idWilayah = item.id;
        }
      });
      //DISABLED ENABLE BUTTON SUBMIT
      if (btnSubmit.attr('class') == 'off') {
        btnSubmit.attr('disabled', true);
      } else {
        btnSubmit.attr('disabled', false);
      }
    }
  });
}

selectKec.on('input', () => {
  methodSelectKec();
})

//EVENT TOMBOL SUBMIT
// GET DATA CUACA PER ID WILAYAH
btnSubmit.on('click', () => {
  
  if ($('#ubah-lokasi').data('status') == 'true') {
    localStorage.setItem('isLocationUser', `${provinsiUser}_${kotaKabUser}_${kecamatanUser}_${idWilayah}_true`);
    setTimeout(() => {
      selectProv.val(' ');
      
      selectKota.val(' ');
      selectKota.toggleClass('off');
      selectKota.attr('disabled', true);
      
      selectKec.val(' ');
      selectKec.toggleClass('off');
      selectKec.attr('disabled', true);
      
      ajaxCuaca();
      $('#ubah-lokasi').data('status', 'false');
    }, 300);
  } else {
    //SIMPAN INFO LOKASI USER KE LOCAL STORAGE
    localStorage.setItem('isLocationUser', `${provinsiUser}_${kotaKabUser}_${kecamatanUser}_${idWilayah}_false`);
    
    $('#result-location').html(`
      Lokasi anda saat ini : <i>${provinsiUser}, ${kotaKabUser}, ${kecamatanUser}</i>. <br>Layanan kami siap untuk anda gunakan
      `);
    
    $('#tab-1').toggleClass('tab-off');
    //RISE TAB 2
    setTimeout(() => {
      selectProv.val(' ');
    
      selectKota.val(' ');
      selectKota.toggleClass('off');
      selectKota.attr('disabled', true);
    
      selectKec.val(' ');
      selectKec.toggleClass('off');
      selectKec.attr('disabled', true);
    
      $('#tab-2').toggleClass('tab-off');
      $('#tab-2').toggleClass('tab-on');
    }, 150)
  }
  
})

//EVENT RESET
btnReset.on('click', () => {
  selectProv.val(' ');
  
  selectKota.val(' ');
  selectKota.toggleClass('off');
  selectKota.attr('disabled', true);
  
  selectKec.val(' ');
  selectKec.toggleClass('off');
  selectKec.attr('disabled', true);
  
  btnSubmit.toggleClass('off');
  btnSubmit.attr('disabled', true);
  
  btnReset.toggleClass('off');
});


/*STRUKTUR DATA isLocationUser
[0] => PROVINSI
[1] => KOTA/KABUPATEN
[2] => KECAMATAN
[3] => ID WILAYAH
[4] => STATUS TOMBOL START SUDAH DI KLIK ATAU BELUM : TRUE/FALSE

STRUKTUR DATA suhuUserOption
[0] => STATUS UNIT SUHU : TRUE = FAHRENHEIT, FALSE = CELCIUS*/



//STATE LOADING 
setTimeout(() => {
  $('#loading-tab p').html('Mendapatkan info lokasi');
  if (localStorage.getItem('suhuUserOption') == undefined || localStorage.getItem('suhuUserOption') == null) {
    localStorage.setItem('suhuUserOption', 'false');
  }
}, 1500)

//PENGECEKAN LOKASI USER
//JIKA LOKASI TERSEDIA
//JIKA LOKASI TIDAK TERSEDIA
//INFO LOKASI PADA localStirage.getItem('isLocationUser')
setTimeout(() => {
  
  //JIKA INFO LOKASI USER DITEMUKAN
  if (localStorage.getItem('isLocationUser') != null) {
    $('#loading-tab').toggleClass('tab-off');
    const isLocationUser = localStorage.getItem('isLocationUser');
    const isLocationUserArr = isLocationUser.split('_');
    
    //JIKA USER SUDAH KLIK TOMBOL START MAKA HOME PAGE LANGSUNG TERBUKA
    if (isLocationUserArr[4] == 'true') {
      ajaxCuaca();
      setTimeout( () => {
        $('#home-page').toggleClass('tab-off');
        $('#home-page').toggleClass('tab-on');
        $('#kecamatan-user').html(isLocationUserArr[2] + ',');
      }, 300);
    } else {
      $('#result-location').html(`
        Lokasi anda saat ini : <i>${isLocationUserArr[0]}, ${isLocationUserArr[1]}, ${isLocationUserArr[2]}</i>. <br>Layanan kami siap untuk anda gunakan
      `);
      
      $('#tab-2').toggleClass('tab-off');
      $('#tab-2').toggleClass('tab-on');
    }
  } 
  //JIKA INFO LOKASI USER TIDAK DITEMUKAN
  if (localStorage.getItem('isLocationUser') == null) {
    $('#loading-tab').toggleClass('tab-off');
    $('#tab-1').toggleClass('tab-off');
    $('#tab-1').toggleClass('tab-on');
  }
}, 3000);


//FUNCTION RENDER HTML MAIN CONTENT
const renderMainContent = (kodeCuaca, cuaca, tanggalCuaca, tempC, humidity, suhuOption) => {
  let suhu;
  if (suhuOption == 'true') {
    suhu = 'C';
  } else {
    suhu = 'F';
  }
  
  $('#now-weather').html(`
    <div class="col-12 shadow" style="background-color: #427BFF;border-radius: 16px; margin: auto!important; overflow-x: hidden">
      <div class="row">
        <img class="mt-2" style="width: 55%!important; margin: auto" src="https://ibnux.github.io/BMKG-importer/icon/${kodeCuaca}.png"/>
      </div>
                            
      <div class="row text-center">
        <h3 style="font-weight: 700; color: white">${cuaca}</h3>
        <p class="" style="color: #CBCBCB">${tanggalCuaca}</p>
      </div>
                            
      <div class="row text-center d-flex justify-content-center">
        <div class="col-6">
          <h1 style="font-size: 5em!important; color: white; font-weight: 700">${tempC}°<sup style="font-size: .5em">${suhu}</sup></h1>
          <img src="img/humidity.png" style="width: 35%!important" />
          <p style="color: #CBCBCB">${humidity}%</p>
        </div>
      </div>
    </div>
 `);
}

const renderNowTabCuaca = (jam, kodeCuaca) => {
  $('#tab-cuaca').append(`
    <div id="now" class="m-1 text-center shadow-sm bg-primary" style="border: 1px solid white; border-radius: 8px; min-width: 80px!important; order: 1;">
      <p class="m-0" style="font-weight: 700; color: white;">${jam}:00</p>
      <img class="mt-3" style="width: 80%!important" src="https://ibnux.github.io/BMKG-importer/icon/${kodeCuaca}.png"/>
      <p style="color: white; font-weight: 700">Now</p>
    </div>
  `);
}
const renderTabCuaca = (jam, kodeCuaca, index, tempC, status) => {
  if (status == true) {
    $('#tab-cuaca').append(`
        <div class="m-1 text-center border shadow-sm" style="border-radius: 8px; min-width: 80px!important; order: ${index + 2};>
          <p class="m-0" style="font-weight: 700; color: #CBCBCB">Besok</p>
          <img class="m-0" style="width: 80%!important" src="https://ibnux.github.io/BMKG-importer/icon/${kodeCuaca}.png"/>
          <p style="color: #333333; font-weight: 700">${tempC}°</p>
        </div>
      `);
  } else {
    $('#tab-cuaca').append(`
      <div class="m-1 text-center border shadow-sm" style="border-radius: 8px; min-width: 80px!important; order: ${index + 2};>
        <p class="m-0" style="font-weight: 700; color: #CBCBCB">${jam}:00</p>
        <img class="m-0" style="width: 80%!important" src="https://ibnux.github.io/BMKG-importer/icon/${kodeCuaca}.png"/>
        <p style="color: #333333; font-weight: 700">${tempC}°</p>
      </div>
    `);
  }
}

const convertTanggal = () => {
  let bulan;
  let tanggal = new Date().getDate();
  let hari;
  
  switch (new Date().getDay()) {
    case 0 : hari = 'Ahad';
    break;
    case 1 : hari = 'Senin';
    break;
    case 2 : hari = 'Selasa';
    break;
    case 3 : hari = 'Rabu';
    break;
    case 4 : hari = 'Kamis';
    break;
    case 5 : hari = 'Jumat';
    break;
    case 6 : hari = 'Sabtu';
    break;
  }
  
  switch (new Date().getMonth()) {
    case 0: bulan = 'Januari';
    break;
    case 1: bulan = 'Februari';
    break;
    case 2: bulan = 'Maret';
    break;
    case 3: bulan = 'April';
    break;
    case 4: bulan = 'Mei';
    break;
    case 5: bulan = 'Juni';
    break;
    case 6: bulan = 'Juli';
    break;
    case 7: bulan = 'Agustus';
    break;
    case 8: bulan = 'September';
    break;
    case 9: bulan = 'Oktober';
    break;
    case 10: bulan = 'November';
    break;
    case 11: bulan = 'Desember';
    break;
  }
  
  return hari+', '+tanggal+' '+bulan;
}

const ajaxCuaca = () => {
  
  const lokasiUser = localStorage.getItem('isLocationUser').split('_');
  kecamatanUser = lokasiUser[2];
  $('#kecamatan-user').html(kecamatanUser+',');
  
  $('now-weather').html('');
  $('#tab-cuaca').html('');
  
  $.ajax({
    url: `https://ibnux.github.io/BMKG-importer/cuaca/${lokasiUser[3]}.json`,
    dataType: 'JSON',
    type: 'get',
    success: (data) => {
      //console.table(data)
      $.each(data, (index, item) => {
        const jamCuacaTanggal = item.jamCuaca.split(' ');
  
        const jamCuaca = jamCuacaTanggal[1].split(':');
        const jam = jamCuaca[0];
  
        const tanggalCuaca = jamCuacaTanggal[0].split('-');
        
        const tanggal = tanggalCuaca[2]; //STRING
        const tanggalInt = parseInt(tanggal); //INTEGER
  
        const now = new Date().getHours();
        
        let suhu;
        let suhuOption;
        if (localStorage.getItem('suhuUserOption') == 'true') {
          suhu = item.tempF;
          suhuOption = 'false';
          $('#ubah-unit').data('suhu', 'true');
          $('#ubah-unit').html('Ubah unit /  F°')
          
        } else {
          suhu = item.tempC;
          suhuOption = 'true';
          $('#ubah-unit').data('suhu', 'false');
          $('#ubah-unit').html('Ubah unit /  C°')
        }
        
  
        if (tanggal == new Date().getDate()) {
          if (now >= 00 && now < 6) {
            if (jam == '00') {
              //TAB CUACA
              renderNowTabCuaca(jam, item.kodeCuaca);
              //MAIN CONTENT
              renderMainContent(item.kodeCuaca, item.cuaca, convertTanggal(), suhu, item.humidity, suhuOption);
            } else {
              renderTabCuaca(jam, item.kodeCuaca, index, suhu, false);
            }
          }
  
          else if (now >= 6 && now < 12) {
            if (jam == '06') {
              //TAB CUACA
              renderNowTabCuaca(jam, item.kodeCuaca);
              //MAIN CONTENT
              renderMainContent(item.kodeCuaca, item.cuaca, convertTanggal(), suhu, item.humidity, suhuOption);
            } else {
              renderTabCuaca(jam, item.kodeCuaca, index, suhu, false);
            }
          }
  
          else if (now >= 12 && now < 18) {
            if (jam == '12') {
              //TAB CUACA
              renderNowTabCuaca(jam, item.kodeCuaca);
              //MAIN CONTENT
              renderMainContent(item.kodeCuaca, item.cuaca, convertTanggal(), suhu, item.humidity, suhuOption);
            } else {
              renderTabCuaca(jam, item.kodeCuaca, index, suhu, false);
            }
          }
  
          else if (now >= 18 && now <= 23) {
            if (jam == '18') {
              //TAB CUACA
              renderNowTabCuaca(jam, item.kodeCuaca);
              //MAIN CONTENT
              renderMainContent(item.kodeCuaca, item.cuaca, convertTanggal(), suhu, item.humidity, suhuOption);
            } else {
              renderTabCuaca(jam, item.kodeCuaca, index, suhu, false);
            }
          }
        }
  
        if (tanggalInt == new Date().getDate() + 1) {
          renderTabCuaca(jam, item.kodeCuaca, index, suhu, true)
        }
      })
    }
  });
}

//EVENT TOMBOL START
$('#start').on('click', () => {
 
  const lokasiUser = localStorage.getItem('isLocationUser').split('_');
  kecamatanUser = lokasiUser[2];
  
  //TANDAI USER YG SUDAH START
  localStorage.setItem('isLocationUser', `${lokasiUser[0]}_${lokasiUser[1]}_${lokasiUser[2]}_${lokasiUser[3]}_true`)
  
  //PENGECEKAN JAM DAN TANGGAL
  //REQUEST API
  ajaxCuaca();
  
  setTimeout(() => {
    $('#tab-2').toggleClass('tab-off');
    $('#kecamatan-user').html(kecamatanUser+',');
    $('#home-page').toggleClass('tab-off');
    $('#home-page').toggleClass('tab-on');
  }, 400);
});

//EVENT NAVIGASI
$('#nav-left').on('click', () => {
  setTimeout(() => {
    $('#menu-left').toggleClass('nav-open');
  }, 400)
})

//EVENT X MENU
$('#close-nav').on('click', () => {
  setTimeout(() => {
    $('#menu-left').toggleClass('nav-close');
    $('#menu-left').toggleClass('nav-open');
    setTimeout(() => {
      $('#menu-left').toggleClass('nav-close');
    }, 400)
  }, 350);
})

//FUNCTION BUTTON KELUAR
document.addEventListener('click', (e) => {
  if (e.target.getAttribute('id') == 'button-true') {
    console.log('ok')
    setTimeout(() => {
      window.close();
    }, 500)
  }
})

//EVENT NAV RIGHT
$('#nav-right').on('click', () => {
  setTimeout(() => {
    $('#refresh').toggleClass('option-on')
  }, 300)
})

//EVENT TOMBOL REFRESH 
$('#refresh').on('click', () => {
  setTimeout( () => {
    $('#refresh').toggleClass('option-on');
  },300);
  
  setTimeout( () => {
    $('#tab-refresh').toggleClass('refresh-off')
    $('#tab-refresh').toggleClass('refresh-on');
  }, 500);
  
  setTimeout(() => {
    $('#now-weather').html('');
    $('#tab-cuaca').html('');
    ajaxCuaca();
  }, 2000)
  
  setTimeout( () => {
    $('#tab-refresh').toggleClass('refresh-on')
    $('#tab-refresh').toggleClass('refresh-off');
  }, 3500);
});

//EVENT UBAH UNIT 
$('#ubah-unit').on('click', () => {
  
  if ($('#ubah-unit').data('suhu') == 'true') {
    localStorage.setItem('suhuUserOption', 'false')
    $('#ubah-unit').data('suhu', 'false');
    $('#now-weather').html('');
    $('#tab-cuaca').html('');
    ajaxCuaca();
  } else {
    localStorage.setItem('suhuUserOption', 'true');
    $('#ubah-unit').data('suhu', 'true');
    $('#now-weather').html('');
    $('#tab-cuaca').html('');
    ajaxCuaca();
  }
})

//EVENT UBAH LOKASI
$('#ubah-lokasi').on('click', () => {
  $('#ubah-lokasi').data('status', 'true');
});

$('#close-modal').on('click', () => {
  $('#ubah-lokasi').data('status', 'false');
  setTimeout(() => {
    selectProv.val(' ');
    
    selectKota.val(' ');
    selectKota.toggleClass('off');
    selectKota.attr('disabled', true);
    
    selectKec.val(' ');
    selectKec.toggleClass('off');
    selectKec.attr('disabled', true);
  }, 300)
});