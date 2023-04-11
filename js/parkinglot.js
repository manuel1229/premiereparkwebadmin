$(document).ready(function() {

    loadData();

    // $('#parkingslotsTable').on('processing.dt', function(e, settings, processing) {
    //   if (processing) {
    //     // Show loading indicator here
    //     $('#loading-indicator').show();
    //   } else {
    //     // Hide loading indicator here
    //     $('#loading-indicator').hide();
    //   }
    // });
    
    // // Hide loading indicator on DataTable draw event
    // table.on('draw.dt', function() {
    //   if (!table.processing()) {
    //     // Hide loading indicator here
    //     $('#loading-indicator').hide();
    //   }
    // });
   
  
});



    var firebaseConfig = {
    apiKey: "AIzaSyBqrc1pxMV7cJ-YH0pr2S6RrS8K-6keDjw",
    authDomain: "premierepark-80f15.firebaseapp.com",
    projectId: "premierepark-80f15",
    storageBucket: "premierepark-80f15.appspot.com",
    messagingSenderId: "412523529245",
    appId: "1:412523529245:web:effaa8472a1e9448d732f4",
    measurementId: "G-Y8PJX4BWDE"
  };
  firebase.initializeApp(firebaseConfig);
  
  // Reference to Firestore collection
  var parkingslotsRef = firebase.firestore().collection("parkingslots");
  var  activeownerRef = firebase.firestore().collection("activeowner");

  var db = firebase.firestore();

  const editicon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f3deba" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>';
  const deleteicon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16"><path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/></svg>';
  
  var filleliminate;
  var filledit;
  
  
  
  var dataSet1 = [];

  var table = $('#parkingslotsTable').DataTable({
    pageLength : 5,
    lengthMenu : [[5, 10, 20, -1], [5, 10, 20, 'All']],
    searching: true,
    data: dataSet1,
    columnDefs: [
            {
                targets: [1],
                visible: false,
            },
          
             {
            targets: -1,
                orderable: false,
                defaultContent: "<div class='wrapper text-center'><div class='btn-group'><button class='btnEdit btn btn-success' data-toggle='tooltip' title='Edit'>"+editicon+"</button><button class='btnDelete btn btn-danger' data-toggle='tooltip' title='Delete'>"+deleteicon+"</button></div></div>"
             }
    ]
});
    


function loadData() {
  // Show the loading indicator
  //  document.getElementById("loading-row").style.display = "table-row";

  // Reset the table data
  table.clear().draw();

  // Fetch data from Firestore
  z = 1;
  parkingslotsRef.orderBy('slotnumber', "asc").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      var ps = doc.data();
      dataSet1 = [z, doc.id, ps.slotowner, ps.slotnumber, ps.slotfloor, ps.status]
      z++;
      table.rows.add([dataSet1]).draw();
    });

    // Hide the loading indicator
    //  document.getElementById("loading-row").style.display = "none";
  });
}


    
    $('#parkingslotsTable').on('click', '.btnDelete', function(){
      Swal.fire({
        title: 'Are you sure you want to delete this record?',
        // text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        reverseButtons: true ,
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          var row = $(this).closest('tr');
          var data = table.row(row).data();
          var id = data[1];
          // delete record from Firestore
          parkingslotsRef.doc(id).delete().then(function() {
            console.log("Document successfully deleted!");
            const table1 = $("#parkingvenueTable").DataTable();
            table1.clear().draw(); 
            loadData();
          }).catch(function(error) {
            console.error("Error removing document: ", error);
          });
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        }
      })
    });
  
  
    // Add event listeners for edit and delete buttons
    $('#parkingslotsTable').on('click', '.btnEdit', function() {
      var row = $(this).closest('tr');
      var data = table.row(row).data();
      var id = data[1];
      var slotowner = data[2];
      var slotnumber = data[3];
      var slotfloor = data[4];
      var status = data[5];
      // open edit form and pre-fill fields with current data
      // handle form submission and update Firestore
      $('#changeData input[name="eid"]').val(id);
      // $('#eid').val(id);
      $('#changeData input[name="slotnumberE"]').val(slotnumber);
      $('#changeData input[name="slotfloorE"]').val(slotfloor);
      $('#changeData input[name="slotownerE"]').val(slotowner);
      $('#changeData input[name="statusE"][value="' + status + '"]').prop('checked', true); 
      $('#exampleModal').modal('show');
    });
  
   
  
    // Handle edit form submission
    // $('#changeData').on('submit', function(e) {
    //   e.preventDefault();
    //   var currentid = $('#changeData input[name="eid"]').val();
    //   var slotnumber = Number($('#changeData input[name="slotnumberE"]').val());
    //   var slotfloor = $('#changeData input[name="slotfloorE"]').val();
    //   var status = $('#changeData input[name="statusE"]:checked').val();
    
    //   parkingslotsRef.where("slotnumber", "==", slotnumber).get().then(function(querySnapshot) {
    //     if (querySnapshot.empty || (querySnapshot.docs.length === 1 && querySnapshot.docs[0].id === currentid)) {
    //       parkingslotsRef.doc(currentid).update({
    //         slotnumber: slotnumber,
    //         slotfloor: slotfloor,
    //         status: status
    //       }).then(function() {
    //         Swal.fire({
    //           icon: 'success',
    //           title: 'Record updated successfully',
    //         });
    
    //         const table1 = $("#parkingslotsTable").DataTable();
    //         table1.clear().draw();
    //         loadData();
    //         $('#exampleModal').modal('hide');
    //       }).catch(function(error) {
    //         console.error("Error updating document: ", error);
    //       });
    //     } else {
    //       Swal.fire({
    //         icon: 'warning',
    //         title: 'Slot already exists',
    //       });
    //     }
    //   }).catch(function(error) {
    //     console.error("Error getting documents: ", error);
    //   });
    // });


    $('#changeData').on('submit', function(e) {
      e.preventDefault();
      var currentid = $('#changeData input[name="eid"]').val();
      var slotnumber = Number($('#changeData input[name="slotnumberE"]').val());
      var slotowner = $('#changeData select[name="slotownerE"]').val();
      var slotfloor = $('#changeData input[name="slotfloorE"]').val();
      var status = $('#changeData input[name="statusE"]:checked').val();
    
      parkingslotsRef.where("slotnumber", "==", slotnumber)
                     .where("slotowner", "==", slotowner)
                     .get().then(function(querySnapshot) {
        if (querySnapshot.empty || (querySnapshot.docs.length === 1 && querySnapshot.docs[0].id === currentid)) {
          parkingslotsRef.doc(currentid).update({
            slotnumber: slotnumber,
            slotowner: slotowner,
            slotfloor: slotfloor,
            status: status
          }).then(function() {
            Swal.fire({
              icon: 'success',
              title: 'Record updated successfully',
            });
    
            const table1 = $("#parkingslotsTable").DataTable();
            table1.clear().draw();
            loadData();
            $('#exampleModal').modal('hide');
          }).catch(function(error) {
            console.error("Error updating document: ", error);
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Slot already exists for this owner',
          });
        }
      }).catch(function(error) {
        console.error("Error getting documents: ", error);
      });
    });
    
    const slotnum = document.getElementById('slotC');

// Add an event listener to the input element
slotnum.addEventListener('input', function() {
  // Remove any non-numeric characters
  this.value = this.value.replace(/[^0-9]/g, '');
});

const floornum = document.getElementById('floorC');

// Add an event listener to the input element
floornum.addEventListener('input', function() {
  // Remove any non-numeric characters
  this.value = this.value.replace(/[^0-9]/g, '');
});



function checkSlotAvailability(slotnumber) {
  // use where clause to filter documents by slot and floor
  var query = parkingslotsRef.where("slotnumber", "==", slotnumber);

  // execute the query and return a promise
  return query.get().then(function (querySnapshot) {
    // if the query returns no documents, the slot is available
    if (querySnapshot.empty) {
      return true;
    }
    // otherwise, the slot is already taken
    else {
      return false;
    }
  });
}



// define the submit handler for the form
$("#submitData").submit(function (event) {
  event.preventDefault();

  // get the values from the form
  var slotnumber = Number($("#slotC").val());
  var slotfloor = $("#floorC").val();

  // check if the slot is available
  checkSlotAvailability(slotnumber).then(function (available) {
    if (available) {
      // add the new document to the collection
      parkingslotsRef.add({
        slotnumber: slotnumber,
        slotfloor: slotfloor,
        status: $('input[name="type"]:checked').val(),
      });

      // close the modal
      $("#exampleModal1").modal("hide");

      // clear the form values
      $("#slotC").val("");
      $("#floorC").val("");
      $('input[name="type"][value="Type 1"]').prop("checked", true);

      // show a success message
   
      Swal.fire({
        // position: 'top-mid',
        icon: 'success',
        title: 'Record added successfully',
      })
      

      const table1 = $("#parkingslotsTable").DataTable();

      table1.clear().draw(); 
        
      loadData();
    } else {
      // show an error message if the slot is already taken
      Swal.fire({
        icon: 'Warning',
        title: 'Slot already taken',
      });
    }
  });
});


var selectBox = document.getElementById("slotownerE");
var options = "";

var dbs= firebase.firestore();

db.collection("slotowners")
  .orderBy('name', "asc")
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      options += "<option value='" + doc.data().name + "'>" + doc.data().name + "</option>";
    });

    selectBox.innerHTML = options;
  })
  .catch(function(error) {
    console.log("Error getting documents: ", error);
  });





  