const TODO = 1
const DOING = 2
const DONE = 3

$(document).ready(function(){
    $("#save-button").unbind().click(function(){
        if($("#title").data("idtask")){
            url = "http://localhost:8000/tasks/" + $("#title").data("idtask") + "/"
            type = 'PUT'
        }
        else{
            url = "http://localhost:8000/tasks/"
            type = 'POST'
        }
        data = {}
        data["title"] = $("#title").val()
        data["description"] = $("#description").val()
        $.ajax({
            url:url,
            type:type,
            data:data,
            headers: {"Authorization": "JWT " + sessionStorage.getItem('validationToken')},
            success: function(response){
                location.reload()
            },
            error: function(response){
                // toast message
                toastr.options = {
                    "positionClass": "toast-bottom-center",
                    "showDuration": "700",
                    "hideDuration": "700",
                    "timeOut": "3000",
                    "extendedTimeOut": "700",
                    "showEasing": "swing",
                    "hideEasing": "linear",
                    "showMethod": "fadeIn",
                    "hideMethod": "fadeOut"
                }
                Command: toastr["error"]("Nao foi possivel salvar task", "tente novamente")
            }
        });
    });

    $.ajax({
        url:"http://localhost:8000/tasks/",
        type: 'GET',
        headers: {"Authorization": "JWT " + sessionStorage.getItem('validationToken')},
        success: function(response){
            response.results.forEach(function(result){
                card = cardBuilder(result)
                if(result.status == TODO)   
                    $("#todo-area").append(card)
                else if(result.status == DOING)
                    $("#doing-area").append(card)
                else if(result.status == DONE)
                    $("#done-area").append(card)
            });
            deleteListener()
            editListener()
            changeStatusListener()
        },
        error: function(response){
            toastr.options = {
                    "positionClass": "toast-bottom-center",
                    "showDuration": "700",
                    "hideDuration": "700",
                    "timeOut": "3000",
                    "extendedTimeOut": "700",
                    "showEasing": "swing",
                    "hideEasing": "linear",
                    "showMethod": "fadeIn",
                    "hideMethod": "fadeOut"
                }
            Command: toastr["error"]("Nao foi possivel carregar tasks", "tente novamente")
        }
    });
});

// This function recieves and object and creat a HTML card with the info of the object
var cardBuilder = function(data){
    card = "<div class='card' data-idtask='"+data.id+"' data-idstatus='"+ data.status +"'>"+
                "<div class='card-body'>"+
                    "<div class='row'>"+
                        "<div class='col-7'>"+
                            "<h5 class='card-title'>"+ data.title +"</h5>"+
                        "</div>"+
                        "<div class='col-5'>"+
                            "<div class='row card-buttons'>"+
                                "<a href='#' class='btn btn-primary btn-edit' id='edit'><i class='fa fa-edit' style='font-size:24px'></i></a>"+
                                "<a href='#' class='btn btn-danger btn-delete' id='delete'><i class='fa fa-trash-o' style='font-size:24px'></i></a>"+
                            "</div>"+
                        "</div>"+
                    "</div>"+
                    "<div class='row'>"+
                        "<div class='col-7'>"+
                            "<p class='card-text'>"+ data.description +"</p>"+
                        "</div>"+
                    "</div>"+
                    "<div class='row'>"+
                        "<div class='col-6'>"+
                            (data.status != 1 ? "<button data-idstatus='"+ data.status +"' class='btn btn-ligth btn-move' id='previous-status'>move to last status</button>" : "")+
                        "</div>"+
                        "<div class='col-6'>"+
                           (data.status != 3 ? "<button data-idstatus='"+ data.status +"' class='btn btn-ligth btn-move' id='next-status'>move to next status</button>" : "")+
                        "</div>"+
                    "</div>"+
                "</div>"+
            "</div>"
    return card
}

var deleteListener = function(){
    $(".btn-delete").unbind().click(function(){
        $card = $(this).parents(".card")
        id = $card.data("idtask")
        $.ajax({
            url: "http://localhost:8000/tasks/"+id,
            type: 'delete',
            headers: {"Authorization": "JWT " + sessionStorage.getItem('validationToken')},
            success: function(){
                $card.hide()
                toastr.options = {
                    "positionClass": "toast-bottom-center",
                    "showDuration": "700",
                    "hideDuration": "700",
                    "timeOut": "3000",
                    "extendedTimeOut": "700",
                    "showEasing": "swing",
                    "hideEasing": "linear",
                    "showMethod": "fadeIn",
                    "hideMethod": "fadeOut"
                }
                Command: toastr["success"]("task excluida com sucesso", "sucesso")
            },
            error: function(response){
                toastr.options = {
                    "positionClass": "toast-bottom-center",
                    "showDuration": "700",
                    "hideDuration": "700",
                    "timeOut": "3000",
                    "extendedTimeOut": "700",
                    "showEasing": "swing",
                    "hideEasing": "linear",
                    "showMethod": "fadeIn",
                    "hideMethod": "fadeOut"
                }
                Command: toastr["error"]("Nao foi possivel excluir task", "tente novamente")
            }
        })
    });
}

var editListener = function(){
    $(".btn-edit").unbind().click(function(){
        $card = $(this).parents(".card")
        title = $card.find(".card-title").text()
        description = $card.find(".card-text").text()
        $("#title").val(title)
        $("#title").data("idtask", $card.data("idtask"))
        $("#description").val(description)
        $("#taskModal").modal('toggle')
    });
}


var changeStatusListener = function(){
    $(".btn-move").unbind().click(function(){
        data = {}
        data["status"] = $(this).data("idstatus")
        if($(this).attr("id") == "next-status")
            data["status"] += 1
        else if($(this).attr("id") == "previous-status")
            data["status"] -= 1
        $card = $(this).parents(".card")
        id = $card.data("idtask")
        $.ajax({
            url: "http://localhost:8000/tasks/"+id+"/update_status/",
            type: 'put',
            data:data,
            headers: {"Authorization": "JWT " + sessionStorage.getItem('validationToken')},
            success: function(){
                location.reload()
            },
            error: function(response){
                toastr.options = {
                    "positionClass": "toast-bottom-center",
                    "showDuration": "700",
                    "hideDuration": "700",
                    "timeOut": "3000",
                    "extendedTimeOut": "700",
                    "showEasing": "swing",
                    "hideEasing": "linear",
                    "showMethod": "fadeIn",
                    "hideMethod": "fadeOut"
                }
                Command: toastr["error"]("Nao foi possivel alterar status", "tente novamente")
            }
        });
    });
}