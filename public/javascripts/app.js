function getArticles(saved) {
  console.log("get articles called")
  $("#results").empty()
  $.getJSON(`/api/article/${saved}`, function (res) {
    var rowElement = $("<div>").attr({ class: "row" })
    res.forEach(function (e) {
      var col = $("<div>").attr({ class: "col-lg-3 col-md-4" })
      var card = $("<div>").attr({ class: "card mx-auto my-2", style: "width: 17rem; height: 20rem;" })
      var cardBody = $("<div>").attr({ class: "card-body" })
      var link = $("<a>").attr({ href: e.url }).append(e.headLine)
      var cardHeading = $("<h5>").attr({ class: "card-title" })
      cardHeading.append(link)
      var cardP = $("<p>").attr({ class: "card-test" }).append(e.summary.slice(0, 100))
      cardBody.append(cardHeading)
      cardBody.append(cardP)
      if(!e.saved){
        var button = $("<button>").attr({ class: "btn btn-danger save-article", 'data-id': e._id }).data("id", e.id).append("Save Article")
        cardBody.append(button)
      }
      else if(e.saved)
      {
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
    $.get(`api/scrape/`,function(){
      getArticles("unsaved");
    });
  })

  $(document).on("click", ".save-article", function () {
    var id = $(this).data("id");
    $.ajax({
      url: `api/article/`,
      type: "PUT",
      data: {id: id, saved: true }
    });
    getArticles("unsaved")
  });

  $(document).on("click", ".delete", function () {
    console.log("delete")
    var id = $(this).data("id");
    $.ajax({
      url: `api/article/`,
      type: 'DELETE',
      data: { id: id }
    });
    getArticles("saved")
  });


  $(document).on("click", ".notes", function(){
    $('#myModal').modal('show');
  })

