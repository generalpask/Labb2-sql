var cache;

var inputId = $('input[name="id"');
var inputName = $('input[name="name"');
var inputUrl = $('input[name="url"');
var inputPostText = $('textarea[name="postText"');

var putrbtn = $('input[value="PUT"]');

function getAll(callback) {
    $.ajax({
        type: 'GET',
        url: '/posts',
        error: function() {
            $('.info').removeClass('success').addClass('error').html("There was a GET error");
        },
        success: function(result) {
            $('.table').html(JSON.stringify(result, undefined, 4));
            cache = result;
            callback && callback();
        }
    });
}

$(document).ready(function() {
    getAll(function() {
        $('.info').removeClass('error').addClass('success').html("GET success");
    });
});

// Disable id field if req type is POST (ids is generated automatically by the server)
$('input[name="type"]').change(function() {
    var postrbtn = $('input[value="POST"]');

    if ($(postrbtn).is(':checked')) {
        $(inputId).prop("disabled", true);
    }
    else {
        $(inputId).prop("disabled", false);
    }
});

// Autofill fields for updating
$('input[name="id"]').bind("keyup", function() {
    var inputIdVal = $(inputId).val();

    if ($(putrbtn).is(':checked')) {
        if (inputIdVal.length == 3) {
            getAll();
            console.log(cache);
            var item;
            for (var i = 0; i < cache.length; i++) {
                if (cache[i].id == inputIdVal) {
                    item = cache[i];
                    console.log("found: " + item.id);
                }
                else {
                    continue;
                }
            }
            if (!item) {
                $('.info').removeClass('success').addClass('error').html("id " + inputIdVal + " not found");
                $(inputName).val("");
                $(inputUrl).val("");
                $(inputPostText).val("");
                $(inputPostText).autogrow();
            }
            else {
                $('.info').removeClass('error').addClass('success').html("id " + inputIdVal + " found");

                $(inputName).val(item.name);
                $(inputUrl).val(item.url);
                $(inputPostText).val(item.postText);
                $(inputPostText).autogrow();
            }
        }
        else {
            return;
        }
    }
    else {
        return;
    }
});

$('.submitsql').click(function(){
    
    event.preventDefault();

    var type = $('input[name="type"]:checked').val();
    console.log("type: "+type);

    if (type == "PUT" || type == "DELETE") {
        var postId = $('input[name="id"]').val();

        if (postId) {
            $.ajax({
                type: type,
                url: '/posts/' + postId,
                contentType: "application/x-www-form-urlencoded",
                data: $('.sqlform').serialize(),

                error: function() {
                    $('.info').addClass('error').html("There was a " + type + " error");
                },

                success: function(result) {
                    getAll(function() {
                        $('.info').removeClass('error').addClass('success').html(type + " success");
                        console.log(type + " success");
                    });
                }
            });
        }
        else {
            $('.info').removeClass('success').addClass('error').html(type + " error: Please fill out the id field.");
        }
    }
    else {
        $.ajax({
            type: type,
            url: '/posts',
            contentType: "application/x-www-form-urlencoded",
            data: $('.sqlform').serialize(),

            error: function() {
                $('.info').addClass('error').html("There was a " + type + " error");
            },

            success: function(result) {
                getAll(function() {
                    $('.info').removeClass('error').addClass('success').html(type + " success");
                    console.log(type + " success");
                });
            }
        });
    }



    // Clear inputs
    $('input[type="text"], textarea[type="text"]').val("");
    $('input[type="radio"]').prop('checked', false);
});