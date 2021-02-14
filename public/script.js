let rubric_id = 0;

$(".after-access").hide();

$("#make-rubric").click(function() {
	window.location = "/makeRubric";
});

$("#access-rubric").click(function() {
	//use rubric code
	let code = $("#rubric-code").val();

	$.get("/getRubric", code, function(rubric) {
		// { title: "DEIB Rubric", id: XX, standards: [ { standard: "Listening", id: XX, levels: ["Level 1 Text", "Level 2 Text", "Level 3 Text", "Level 4 Text"] }, ... ] }
		$("#headline").html(rubric.title);
		let standard_template = $("#standard_template");

		// global var tracking (for submission)
		rubric_id = rubric.id;
		standard_ids = [];

		rubric.standards.forEach((standard) => {
			// clone template row
			let standard_row = standard_template.clone();
			standard_row.attr("id", standard.id);

			// add name
			standard_row.find(".standard_name").html(standard.standard);

			// process options
			for (let i = 0; i < standard.levels; i++) {
				let radio = standard_row.find(".option" + i + " input");
				radio.attr("name", standard.id);
				radio.attr("value", i+1);

				let text_area = standard_row.find(".statement" + i + " span");
				text_area.html(standard.levels[i]);
			}

			// dump on page
			standard_row.appendTo("#rubric-to-use");
		});

		$(".form__group").hide();
		$(".buttons").hide();
		$(".after-access").show();
	});
});

//responding to rubric
$("#submit_form").click(function() {
	// verify 

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