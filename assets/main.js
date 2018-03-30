$(document).ready(function() {


    /* Left menu hover */
    $('#leftMenu .nav-item').hover(function() {
        $('#leftMenu').toggleClass('menu-with-text');
    });

    /* activate input of the form */
    $('.form-group').on('click','.read-only-input, .edit-icon', function(event) {
        var group = $(this).closest('.input-group');
        var input = $(group).find('input')[0];
        var span = $(group).find('span')[0];
        $(input).toggleClass('d-none');
        $(span).toggleClass('d-none');
        $(input).focus();
    });

    var availableTags = [
        "ActionScript",
        "AppleScript",
        "Asp",
        "BASIC",
        "C",
        "C++",
        "Clojure",
        "COBOL",
        "ColdFusion",
        "Erlang",
        "Fortran",
        "Groovy",
        "Haskell",
        "Java",
        "JavaScript",
        "Lisp",
        "Perl",
        "PHP",
        "Python",
        "Ruby",
        "Scala",
        "Scheme"
    ];
    $( "#genreTags" ).autocomplete({
        source: availableTags
    });

    /* Update text holder on focusing out of the input field */
    $('.read-edit input').blur(function() {
        var group = $(this).closest('.input-group');
        var input = $(group).find('input')[0];
        var span = $(group).find('span')[0];
        if( $(input).val() != 'undefined' || $(input).val().length != 0 ) {
            $(span).text($(input).val());
        }
        $(input).toggleClass('d-none');
        $(span).toggleClass('d-none');
    
    });


    // radio button for album/track selection:
    $('#album-radio').on('click', function() {
        $(this).find('input').prop('checked', true);
    });
    $('#track-radio').on('click', function() {
        $(this).find('input').prop('checked', true);
    });


    // upload file by using button
    $('#file-false-input').on('click', function(){
        $("#file-input").click();
    });
    $('#file-input').on('change', function() {
        // $('#file-holder').find("p").addClass('d-none');

        var input = $("#file-input");
        if (input.length == 1) {
            var fd = new FormData();
            var i = $("#progressWrapper").find("[id*='upload-line-']").length;
            if( i == 0) {
                createProgressSection();
            }
            createProgressLayoutLine(input[0].files[0].name, i);
            fd.append('file', input[0].files[0]);
            uploadData(fd, i);
        }
    });


    /* Checkbox with image (check/uncheck logic) */
    $('.check-icon').on('click', function(event) {
        event.preventDefault();
        var check = $(this).closest('.form-check').find('input');
        var image = $(this).closest('.form-check').find('img')[0];
        if($(check).is(":checked")) {
            $(check).prop( "checked", false );
            $(image).attr('src', 'assets/images/checkbox-green.png');
        } else {
            $(check).prop( "checked", true );
            $(image).attr('src', 'assets/images/checkbox-green-purple.png');
        }
    });


    /* Datepicker jquery */
    $( "#releaseDate" ).datepicker({
        altFormat: "yy-mm-dd",
        onSelect: function(dateText, inst) {
            var group = $(this).closest('.input-group');
            var span = $(group).find('span')[0];
            $(span).text(dateText);
        }
    });

    // Getter
    var altFormat = $( "#releaseDate" ).datepicker( "option", "altFormat" );

    // Setter
    $( "#releaseDate" ).datepicker( "option", "altFormat", "mm/dd/yy" );


});


// function for handling drag and drop for uploading file
function handleFileDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.

    if ( files.length == 1 ) {
        var fd = new FormData();
        var i = $("#progressWrapper").find("[id*='upload-line-']").length;
        if( i == 0) {
            createProgressSection();
        }
        createProgressLayoutLine(files[0].name, i);
        fd.append('file', files[0]);
        uploadData(fd, i);
    }
    handleDragLeave(evt);
    

    // for (var i = 0; i < files.length; i++) {
        // createProgressLayoutLine(files[i].name, i);
        // fd.append('file', files[i]);
        // uploadData(fd)
    // }
}


// Sending AJAX request and upload file
function uploadData(formdata, i){
    // console.log("pred ajaxom");
    var post_url = 'upload.php';
    var form_data = formdata;

    $.ajax({
        url : post_url,
        type: "POST",
        data : form_data,
        contentType: false,
        cache: false,
        processData:false,
        xhr: function(){
            //upload Progress
            var xhr = $.ajaxSettings.xhr();
            if (xhr.upload) {
                xhr.upload.addEventListener('progress', function(event) {
                    var percent = 0;
                    var position = event.loaded || event.position;
                    var total = event.total;
                    if (event.lengthComputable) {
                        percent = Math.ceil(position / total * 100);
                    }
                    //update progressbar
                    $("#upload-line-" + i).find(".progress-bar").css("width", + percent + "%");
                    $("#upload-line-" + i).find(".progress-procent").css("width", + percent + "%");
                    $("#upload-line-" + i).find(".progress-procent").text(percent + "%");
                }, true);
            }
            return xhr;
        },
        mimeType:"multipart/form-data"
    }).done(function(res){ //
        // $(my_form_id)[0].reset(); //reset form
        // $(result_output).html(res); //output response from server
        // submit_btn.val("Upload").prop( "disabled", false); //enable submit button once ajax is done
        console.log('ajax response: ', res);
    });
}


// handle Drag over while uploading file
function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    $('.drop-section').css('border-color', '#9dcc7a');
}


// handle Drag leave while uploading file
function handleDragLeave(event) {
    $('.drop-section').css('border-color', '#7a70b3');
}


// create progress layout section
function createProgressSection() {
    $("#detailsSectionW").removeClass('col-xl-9').addClass('col-xl-6');
    $("#progressWrapper").removeClass('d-none');
    $("#uploadSectionW").removeClass('col-xl-3').addClass('col-xl-6');
    $("#typeFile").removeClass('col-sm-12').addClass('col-sm-5');
    $("#uploadBox").removeClass('col-sm-12').addClass('col-sm-5');
}


// remove progress layout section
function removeProgressSection() {
    $("#detailsSectionW").removeClass('col-xl-6').addClass('col-xl-9');
    $("#progressWrapper").addClass('d-none');
    $("#uploadSectionW").removeClass('col-xl-6').addClass('col-xl-3');
    $("#typeFile").removeClass('col-sm-5').addClass('col-sm-12');
    $("#uploadBox").removeClass('col-sm-5').addClass('col-sm-12');
}

// Add new progress bar line
function createProgressLayoutLine(fileName, i) {
    $("#uploadDefault").clone().appendTo("#progressWrapper")
        .toggleClass('d-none')
        .attr('id', 'upload-line-' + i)
        .find('.file-name').text(fileName);
}


// remove a progress bar line
function removeProgressLayoutLine() {
    console.log('hajd ovo da vidimo');
}


// remove uploaded file
function removeUploadedFile(but, event) {
    event.preventDefault();
    $(but).closest('.progress-row').remove();
    var numberOfProgressLines = $("#progressWrapper").find("[id*='upload-line-']").length;
    if( numberOfProgressLines == 0) {
        removeProgressSection();
    }
    
}