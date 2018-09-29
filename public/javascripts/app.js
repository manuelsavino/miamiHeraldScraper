
function getArticles(saved) {
  $("#results").empty()
  //call to scrape the miami herald site and build the cards based on the response
  $.getJSON(`/api/article/status/${saved}`, function (res) {
    var rowElement = $("<div>").attr({ class: "row" })
    res.forEach(function (e) {
      var col = $("<div>").attr({ class: "col-lg-3 col-md-4" })
      var card = $("<div>").attr({ class: "card mx-auto my-2", style: "width: 17rem; height: 20rem;" })
      // if (e.imgURL) {
      //   var img = $("<img>").attr({ class: "card-img-top", src: e.imgURL })
      //   card.append(img)
      // }
      var cardBody = $("<div>").attr({ class: "card-body" })
      var link = $("<a>").attr({ href: e.url }).append(e.headLine)
      var cardHeading = $("<h5>").attr({ class: "card-title" })
      cardHeading.append(link)
      cardBody.append(cardHeading)
      // if (!e.imgURL) {
      var cardP = $("<p>").attr({ class: "card-test" }).append(e.summary.slice(0, 100))
      // }

      cardBody.append(cardP)
      //if the ari
      if (!e.saved) {
        var button = $("<button>").attr({ class: "btn btn-success save-article", 'data-id': e._id }).data("id", e.id).append("Save Article")
        cardBody.append(button)
      }
      else if (e.saved) {
        var notesButton = $("<button>").attr({ class: "btn btn-primary notes", 'data-id': e._id }).data("id", e.id).append("Notes")
        var deleteButton = $("<button>").attr({ class: "btn btn-danger delete", 'data-id': e._id }).data("id", e.id).append("X")
        cardBody.append(notesButton)
        cardBody.append(deleteButton)
      }
      card.append(cardBody)
      col.append(card)
      rowElement.append(card)
      $("#results").append(rowElement)
    })
  })
}


$(".scrape").on("click", function () {
  $.get(`api/scrape/`, function () {
    getArticles("unsaved");
  });
})


$(document).on("click", ".save-article", function () {
  var id = $(this).data("id");
  $.ajax({
    url: `api/article/`,
    type: "PUT",
    data: { id: id, saved: true }
  });
  getArticles("unsaved")
});

$(document).on("click", ".delete", function () {
  var id = $(this).data("id");
  $.ajax({
    url: `api/article/`,
    type: 'DELETE',
    data: { id: id }
  });
  getArticles("saved")
});


$(document).on("click", ".notes", function () {
  var id = $(this).data("id")
  $.getJSON(`/api/article/${id}`, function (res) {
    console.log(res)
    $(".modal-title").text("Notes for:" + res.headLine)
    $(".newNote").attr('data-id', id)
    if (res.note) {
      res.note.forEach(e => {
        var note = $("<li>").attr({ class: "list-group-item" }).append(e.body)
        var deleteButton = $("<button>").attr({ class: "btn btn-outline-danger btn-sm float-right deleteNote", 'data-id': e._id }).append("X")
        note.append(deleteButton)
        $(".list-group").append(note)
      })
    }
  })
  $('#myModal').modal('show');
})

$(".newNote").on("click", function () {
  var note = $("#message-text").val()
  var data = {
    id: $(this).data("id"),
    body: note
  }
  console.log("before Post")
  if (data.body) {
    console.log("calling post")
    $.post('/api/article/note/', data, function (data) {

    })
  }
  $('#myModal').modal('hide');
})


$(".closeIt").on("click", function () {
  // resetModal()
})

function resetModal() {

}

$("#myModal").on("hidden.bs.modal", function () {
  $(".list-group").empty()
  $("#message-text").val('')
  $(".newNote").data("id", "")
  console.log("modal closed")
})

$(document).on("click", ".deleteNote", function () {
  var id = $(this).data("id")
  $.ajax({
    url: `api/note/`,
    type: 'DELETE',
    data: { id: id }
  });

  $('#myModal').modal('hide');
  resetModal()
})
