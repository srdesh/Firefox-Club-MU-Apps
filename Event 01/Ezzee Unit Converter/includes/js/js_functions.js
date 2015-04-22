// Declaring global variables
var lang, conversion_type, MAX_FLOAT=4;



// Declaring global objects
var PREFIX_ARR = new Object();



// Setting language
lang = to_blank(getcookie("lang"));

if (lang === "")
{
	lang = "en";
}



// Setting prefix arr
PREFIX_ARR =
{
	"pico" : "-12",
	"nano" : "-9",
	"micro" : "-6",
	"milli" : "-3",
	"centi" : "-2",
	"deci" : "-1",
	"multiplier" : "0",
	"deka" : "1",
	"hecto" : "2",
	"kilo" : "3",
	"mega" : "6",
	"giga" : "9",
	"tera" : "12"
};



// Things to do when body is loaded
$("div.container").ready(function()
{
	// Changing the language
	lang_change(lang);
});



// Function to get translation of a given word from LANG array
function getlang(word)
{
	if ((LANG_ARR[lang] !== undefined) && (LANG_ARR[lang][word] !== undefined) && (LANG_ARR[lang][word] !== ""))
	{
		return(LANG_ARR[lang][word]);
	}
	else
	{
		return(word);
	}
}



// Function to set a cookie
function setcookie(name, data)
{
	document.cookie = name + "=" + data;
}



// Function to get a cookie
function getcookie(name)
{
	var str;

	str = document.cookie;

	str = str.split(";");

	$.each(str, function(index, data)
	{
		data = data.split("=");

		if (data[0] === name)
		{
			return(data);
		}
	});

	return(undefined);
}



// Function to change the language
function lang_change(lang_name)
{
	var i;


	// If language name is not given, then fetching the language name from the language dropdown
	if (!lang_name)
	{
		lang_name = $("select.lang_menu").val();
	}


	// Changing the global lang variable
	lang = lang_name;


	// Changing the page title and title text
	$("title").html(getlang("title"));
	$("div.title").html(getlang("title_text"));


	// Changing the main menu button in the convert page
	$("div.convert span.load_main_menu_button").html(getlang("main_menu"));


	// Changing the menu buttons
	$("div.menu_buttons div.left").html("");
	$("div.menu_buttons div.right").html("");

	i = 0;

	$.each(UNIT_ARR.ref, function(index, data)
	{
		if (i < 5)
		{
			$("div.menu_buttons div.left").append("<span class=menu_button onclick=\"load_conv('" + index + "')\">" + getlang(index) + "</span><br />");
		}
		else
		{
			$("div.menu_buttons div.right").append("<span class=menu_button onclick=\"load_conv('" + index + "')\">" + getlang(index) + "</span><br />");
		}

		i++;
	});


	// Changing the unit prefix dropdowns
	$("#from_prefix").html("");
	$("#to_prefix").html("");

	$.each(PREFIX_ARR, function(prefix_name, ten_power)
	{
		if (ten_power == 0)
		{
			$("#from_prefix").append("<option value=" + ten_power + " selected>" + getlang(prefix_name) + "</option>");
			$("#to_prefix").append("<option value=" + ten_power + " selected>" + getlang(prefix_name) + "</option>");
		}
		else
		{
			$("#from_prefix").append("<option value=" + ten_power + ">" + getlang(prefix_name) + "</option>");
			$("#to_prefix").append("<option value=" + ten_power + ">" + getlang(prefix_name) + "</option>");
		}
	});


	// Blanking the from input and to output
	$("#from_input").html("");
	$("#to_output").html("");


	// Changing the from input placeholder
	$("#from_input").attr("placeholder", getlang("from_input_placeholder"));
}



// Function to load the conversion div
function load_conv(conv_type)
{
	if (UNIT_ARR[conv_type] !== undefined)
	{
		// Setting the conversion_type global variable
		conversion_type = conv_type;


		// Changing the unit dropdowns1234
		$("#from_unit").html("");
		$("#to_unit").html("");

		$.each(UNIT_ARR[conv_type], function(unit_name, multiplier)
		{
			$("#from_unit").append("<option value=" + unit_name+ ">" + getlang(unit_name) + "</option>");
			$("#to_unit").append("<option value=" + unit_name + ">" + getlang(unit_name) + "</option>");
		});
	}


	// Hiding the main menu and showing the convert div
	$("div.main_menu").hide(0);
	$("div.convert").show(0);
}



// Function to load the main menu
function load_main_menu()
{
	// Clearing the input and output boxes
	$("#from_input").val("");
	$("#to_output").html("");


	// Hiding the convert div and showing the main menu
	$("div.convert").hide(0);
	$("div.main_menu").show(0);
}



// Convert function
function convert()
{
	var from_ten_power, from_unit, from_input, from_mult, to_ten_power, to_unit, to_mult, to_mult_num, to_output, ten;


	// Setting default BigNumber precision
	BigNumber.defaultPrecision = 100;


	// Getting data
	from_ten_power = parseInt($("#from_prefix").val());
	from_unit = $("#from_unit").val();
	from_input = parseFloat($("#from_input").val()).toFixed(MAX_FLOAT);
	from_mult = UNIT_ARR[conversion_type][from_unit];

	to_ten_power = parseInt($("#to_prefix").val());
	to_unit = $("#to_unit").val();
	to_mult = UNIT_ARR[conversion_type][to_unit];


	// Validating input
	if ((from_input < 0.0) || (from_input > 9999.0))
	{
		return(false);
	}


	// Creating big number objects (some are not needed to be objects as they are small enough and the functions accept direct numbers too)
	from_mult = new BigNumber(from_mult);
	from_input = new BigNumber(from_input);

	to_mult = new BigNumber(to_mult);
	to_output = new BigNumber(0);

	ten = new BigNumber("10");


	// Calculating
	from_ten_power -= to_ten_power;

	to_output = new BigNumber(from_input);
	to_output = to_output.multiply(from_mult);
	to_output = to_output.multiply(ten.pow(from_ten_power));

	if (to_mult.compare(1) !== 0)
	{
		to_output = to_output.divide(to_mult);	// Division by 1 seems to be buggy, so avoiding it
	}


	// Updating the output
	$("#to_output").html(num_translate(to_output));
}



// Function to translate a given number array into the given language (and to scientific notation if needed)
function num_translate(num)
{
	var str="", new_str="", float_num=-1;


	// Making the number string
	$.each(num._d, function(i, dig)
	{
		if (i == num._f)
		{
			str += ".";
			float_num = 0;
		}

		str += dig;

		if (float_num >= 0)
		{
			float_num++;
		}
	});


	// Changing the string to scientific notation if needed
	if ((num.compare(1000000) > 0) || (num.compare(0.000001) < 0) || (float_num > 6))
	{
		str = str_to_exp(str);
	}


	// Translating the string
	new_str = "";

	$.each(str.split(""), function(index, chr)
	{
		if ((chr >= 0) && (chr <= 9))
		{
			new_str += getlang(chr);
		}
		else if (chr === ".")
		{
			new_str += getlang("point");
		}
		else if (chr === "e")
		{
			new_str += getlang("e");
		}
		else
		{
			new_str += chr;
		}
	});


	return(new_str);
}



// Function to turn a number string into exponential
function str_to_exp(str)
{
	var e, prev_point_pos, new_point_pos;


	// Finding the point's previous position and removing the point
	prev_point_pos = str.indexOf(".");

	if (prev_point_pos < 0)
	{
		prev_point_pos = str.length;
	}
	else
	{
		str = str.split(".").join("");
	}


	// Finding the point's new position (just after the first non-zero digit)
	new_point_pos = -1;

	$.each(str.split(""), function(i, chr)
	{
		if ((parseInt(chr) > 0) && (parseInt(chr) <= 9))
		{
			new_point_pos = i + 1;
			return(false);
		}
	});

	if (new_point_pos < 0)	// If no non-zero digit found, then the entire string is 0
	{
		return("0");
	}


	// Rounding the float part to MAX_FLOAT digits and placing the point in the new position
	float_part = str.substr(new_point_pos);

	if (float_part.length > MAX_FLOAT)
	{
		dig = parseInt(float_part.charAt(MAX_FLOAT-1));

		if (parseInt(float_part.charAt(MAX_FLOAT)) > 4)
		{
			dig++;
		}

		float_part = float_part.substr(0, MAX_FLOAT-1) + dig;
	}

	str = str.substr(new_point_pos-1, 1);	// Note that anything before the position 'new_point_pos-1' is 0

	if (float_part !== "")
	{
		str += "." + float_part
	}


	// Calculating the value of E
	e = prev_point_pos - new_point_pos;

	if (e !== 0)
	{
		str += "e" + e;
	}


	// Returning the string
	return(str);
}



// Function to change 'undefined' and 'null' to an empty string
function to_blank(str)
{
	if ((str === undefined) || (str === null)) 
	{
		return("");
	}
	else
	{
		return(str);
	}
}




