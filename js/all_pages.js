function http_get (url, data) {
    var result;

    $.ajax({
        type: 'get',
        async: false,
        url: url,
        data: data,
        dataType: 'json',
        statusCode: {
            200: function (response) {
                result = {
                    status: 200,
                    response: response
                };
            },
            // No Content
            204: function (response) {
                result = {
                    status: 409
                };
            },
            403: function (response) {
                result = {
                    status: 403
                };
            },
            404: function (response) {
                result = {
                    status: 404
                };
            },
            406: function (response) {
                result = {
                    status: 406
                };
            },
            409: function (response) {
                result = {
                    status: 409
                };
            },
            // Bad Gateway
            502: function (response) {
                result = {
                    status: 502
                };
            }
        }
    });

    return result;
}

function http_post (url, data) {
    var result;

    $.ajax({
        type: 'POST',
        async: false,
        contentType: 'application/json',
        url: url,
        dataType: 'json',
        data: JSON.stringify(data),
        statusCode: {
            // OK
            200: function (response) {
                result = {
                    status: 200,
                    response: response
                };
            },
            // No Content
            204: function (response) {
                result = {
                    status: 409
                };
            },
            // Bad request
            400: function (response) {
                result = {
                    status: 400,
                    response: JSON.parse(response.responseText)
                };
            },
            // Not found
            404: function (response) {
                result = {
                    status: 404,
                };
            },
            // Not Acceptable
            406: function (response) {
                result = {
                    status: 406
                };
            },
            // Conflict
            409: function (response) {
                result = {
                    status: 409
                };
            },
            // Bad Gateway
            502: function (response) {
                result = {
                    status: 502
                };
            }
        }
    });

    return result;
}

function http_post_async (url, data) {
    var result;

    $.ajax({
        type: 'POST',
        async: true,
        contentType: 'application/json',
        url: url,
        dataType: 'json',
        data: JSON.stringify(data),
        error: function () {
            result = {
                status: 400
            }
        },
        statusCode: {
            // OK
            200: function(response) {

                result = {
                    status: 200,
                    response: response
                };
            },
            // OK
            201: function(response) {

                result = {
                    status: 201,
                    response: response
                };
            },
            // Bad request
            400: function(response) {

                result = {
                    status: 400,
                    response: JSON.parse(response.responseText)
                };
            },
            // Not found
            404: function(response) {

                result = {
                    status: 404,
                    //response: JSON.parse(response.responseText)
                };
            },
            // Not Acceptable
            406: function (response) {

                result = {
                    status: 406
                };
            },
            // Conflict
            409: function(response) {

                result = {
                    status: 409,
                    response: JSON.parse(response.responseText)
                };
            },
            // Bad Gateway
            502: function (response) {

                result = {
                    status: 502
                };
            }
        }
    });

    return result;
}

function checkAuthorization() {
    var response = http_get('./api/authenticate', {id: $.cookie("user.id"), hashKey: $.cookie("user.hashKey"), role: $.cookie("user.role")});
    if (response.status != 200) {
        location.reload();
        return;
    }
}

$('body').on('click', 'a#exit', function() {
    deleteAllCookies();
    window.location.href = '#/';
    return false
});

function deleteAllCookies() {
    var cookies = $.cookie();

    $.each(cookies, function (item, cookie) {
        $.removeCookie(item);
    });
}

$.fn.jsonify = function (options) {
    var settings = $.extend({
        stringify : false
    }, options);
    var json = {};
    $.each(this.serializeArray(), function() {
        if (json[this.name]) {
            if (!json[this.name].push)
                json[this.name] = [json[this.name]];
            json[this.name].push(this.value || '');
        } else
            json[this.name] = this.value || '';
    });
    if(settings.stringify)
        return JSON.stringify(json);
    else
        return json;
};

function empty (e) {
    switch(e) {
        case "":
        case 0:
        case "0":
        case null:
        case false:
        case undefined:
            return true;
        default :
            return false;
    }
}

function setNumeric () {
    $("input.numeric")
        .bind('paste', function(event) {
            event.preventDefault();
            var value = event.originalEvent.clipboardData.getData('Text');
            $(this).val(value.replace(/,/g,"."));
        })
        .numeric()
        .keydown(function (e) {
            var key = e.which ? e.which : event.keyCode;
            if (key == 110 || key == 188 || key == 190) {
                e.preventDefault();
                var value = $(this).val();
                $(this).val(value + ".");
            }
        });
}

Date.prototype.getMySQLDate = function () {
	var year, month, day, hours, minutes, seconds;
	year = String(this.getFullYear());
	month = String(this.getMonth() + 1);
	if (month.length == 1) {
		month = "0" + month;
	}
	day = String(this.getDate());
	if (day.length == 1) {
		day = "0" + day;
	}
	// should return something like: 2011-06-16
	return year + "-" + month + "-" + day;
}

Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}

$.fn.hasAttr = function (name) {
   return this.attr(name) !== undefined;
};

function loadMultipleJS (filenames) {
    if (filenames.length > 0) {

        var filename = filenames.shift();

        var fileref = document.createElement('script');
        fileref.setAttribute("type", "text/javascript");
        fileref.setAttribute("src", filename);
        fileref.setAttribute("async", "false");
        fileref.setAttribute("defer", "defer");

        var list = document.getElementsByTagName('script');
        var flag = false;

        if (filenames.length != 0) {
            var i = list.length;
            while (i--) {
                if (list[i].src.replace(/^.*[\\\/]/, '') === filename.replace(/^.*[\\\/]/, '')) {
                    flag = true;
                    break;
                }
            }
            i = list.length;
            while (i--) {
                if ($(list[i]).attr('one_page_script') == 'true') {
                    list[i].parentNode.removeChild(list[i]);
                }
            }
        } else {
            fileref.setAttribute("one_page_script", "true");
            flag = false;
        }

        fileref.onload = function(){
            loadMultipleJS(filenames);
        }

        if (!flag) {
            document.getElementsByTagName("head")[0].appendChild(fileref);
        } else {
            loadMultipleJS(filenames);
        }

    }
}

function loadMultipleCSS (filenames) {
    if (filenames.length > 0) {

        var filename = filenames.shift();

        var fileref = document.createElement('link');
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename);
        fileref.setAttribute("async", "false");

        var list = document.getElementsByTagName('link');
        var flag = false;

        var i = list.length;
        while (i--) {
            if (list[i].href.replace(/^.*[\\\/]/, '') === filename.replace(/^.*[\\\/]/, '')) {
                flag = true;
                break;
            }
        }

        fileref.onload = function(){
            loadMultipleCSS(filenames);
        }

        if (!flag) {
            document.getElementsByTagName("head")[0].appendChild(fileref);
        } else {
            loadMultipleCSS(filenames);
        }

    }
}

function loadjscssfile (filename) {
    var fileref = document.createElement('script');
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", filename);
    fileref.setAttribute("defer", "defer");
    if (typeof fileref != "undefined") {
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }
}