$(".after-access").hide();

$("#make-rubric").click(function() {
	window.location = "/makeRubric";
});

$("#access-rubric").click(function() {
	$(".form__group").hide();
	$("#headline").hide();
	$(".buttons").hide();
	$(".after-access").show();

	//use rubric code
	var code = $("#rubric-code").val();

	$.get("/getRubric", code, function(data) {
		//replacing text elements
		$("#category1").html(data[0].category1);
		$("#category2").html(data[0].category2);
		$("#category3").html(data[0].category3);
		$("#category4").html(data[0].category4);

		$("#statement1-1").html(data[0].r1c1);
		$("#statement1-2").html(data[0].r1c2);
		$("#statement1-3").html(data[0].r1c3);
		$("#statement1-4").html(data[0].r1c4);

		$("#statement2-1").html(data[0].r2c1);
		$("#statement2-2").html(data[0].r2c2);
		$("#statement2-3").html(data[0].r2c3);
		$("#statement2-4").html(data[0].r2c4);

		$("#statement3-1").html(data[0].r3c1);
		$("#statement3-2").html(data[0].r3c2);
		$("#statement3-3").html(data[0].r3c3);
		$("#statement3-4").html(data[0].r3c4);

		$("#statement4-1").html(data[0].r4c1);
		$("#statement4-2").html(data[0].r4c2);
		$("#statement4-3").html(data[0].r4c3);
		$("#statement4-4").html(data[0].r4c4);
	});
});

//responding to rubric
$("#submit_form").click(function() {
	var categoryRes1;
	$("[name='options1']").each(function(i) {
		if ($(this).is(":checked")) categoryRes1 = i + 1;
	});

	var categoryRes2;
	$("[name='options2']").each(function(i) {
		if ($(this).is(":checked")) categoryRes2 = i + 1;
	});

	var categoryRes3;
	$("[name='options3']").each(function(i) {
		if ($(this).is(":checked")) categoryRes3 = i + 1;
	});

	var categoryRes4;
	$("[name='options4']").each(function(i) {
		if ($(this).is(":checked")) categoryRes4 = i + 1;
	});

	console.log(
		categoryRes1 +
		" " +
		categoryRes2 +
		" " +
		categoryRes3 +
		" " +
		categoryRes4
	);

	// TODO: SEND RESULTS

	location.reload();
});

$("#exit").click(function() {
	window.location = "/";
});

$("#make-rubric").click(function() {
	// TODO: FORM VALIDATION
	
	// function validateForm() {
	// 	var isValid = true;
	// 	$(".form-control").each(function() {
	// 		if ($(this).val() === "") isValid = false;
	// 	});
	// 	$(".chosen-select").each(function() {
	// 		if ($(this).val() === "") isValid = false;
	// 	});
	// 	return isValid;
	// }
	//if (validateForm() == true) {
	var userData = {
		rubricID: $("#rubricID").val(),

		category1: $("#category1").val(),
		r1c1: $("#r1c1").val(),
		r1c2: $("#r1c2").val(),
		r1c3: $("#r1c3").val(),
		r1c4: $("#r1c4").val(),

		category2: $("#category2").val(),
		r2c1: $("#r2c1").val(),
		r2c2: $("#r2c2").val(),
		r2c3: $("#r2c3").val(),
		r2c4: $("#r2c4").val(),

		category3: $("#category3").val(),
		r3c1: $("#r3c1").val(),
		r3c2: $("#r3c2").val(),
		r3c3: $("#r3c3").val(),
		r3c4: $("#r3c4").val(),

		category4: $("#category4").val(),
		r4c1: $("#r4c1").val(),
		r4c2: $("#r4c2").val(),
		r4c3: $("#r4c3").val(),
		r4c4: $("#r4c4").val(),
	};
	$.post("/addRubric", userData, function(data) {
		if (data == "alert") alert("You have entered a code that already exists!");
		else window.location = "/";
	});
});