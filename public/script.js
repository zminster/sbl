let rubric_id = 0;
let standard_rows = 0;
let charts = {};
let chartUpdateFunctions = {};
let code = 0;

$(".after-access").hide();

$("#make-rubric").click(function() {
	window.location = "/makeRubric";
});

$("#access-rubric").click(function() {
	//use rubric code
	code = "/getRubric/" + $("#rubric-code").val();

	$.get(code, function(rubric) {
		// { title: "DEIB Rubric", id: XX, standards: [ { standard: "Listening", id: XX, levels: ["Level 1 Text", "Level 2 Text", "Level 3 Text", "Level 4 Text"] }, ... ] }
		let standard_template = $("#standard_template");

		// global var tracking (for submission)
		rubric_id = rubric.id;

		rubric.standards.forEach((standard) => {
			// clone template row
			standard_rows++;
			let standard_row = standard_template.clone();
			standard_row.attr("id", standard_rows);

			// add name
			standard_row.find(".standard_name").html(standard.standard);

			// process options
			for (let i = 1; i <= standard.levels.length; i++) {
				let radio = standard_row.find(".option" + i + " input");
				radio.attr("name", standard.id);
				radio.attr("value", i);

				let text_area = standard_row.find(".statement" + i + " span");
				text_area.html(standard.levels[i - 1]);
			}

			// dump on page
			standard_row.appendTo("#rubric-to-use");
		});

		$("#headline").hide();
		$(".form__group").hide();
		$(".buttons").hide();
		$(".after-access").show();
	});
});

function updateCharts() {
	$.get(code, function(data) {
		data.standards.forEach((standard) => {
			chartUpdateFunctions[standard.id](standard.levels);
		});
	});
}

$("#access-data").click(function() {
	//use rubric code
	code = "/data/" + $("#rubric-code").val();

	$.get(code, function(data) {
		// { rubric_name: "", standards: [ {id: XX, standard_name: "", levels: [ { label: "", y: }, ... ] }, ... ] }
		$("#headline").html(data.rubric_name);

		data.standards.forEach((standard) => {
			console.log(standard.id);
			// create container for chart
			let container = $("<div class=\"col\" style=\"width:50%; height:400px; display:inline-block;\">");
			container.attr("id", "chartContainer"+standard.id);
			container.appendTo("#after-access-data");

			// create chart attached to container
			charts[standard.id] = new CanvasJS.Chart("chartContainer"+standard.id, {
				animationEnabled: true,
				theme: "dark2",
				title: {
					text: standard.standard_name
				},
				axisY: {
					title: "Respondents",
					includeZero: true
				},
				data: [{
					type: "column",
					indexLabel: "{y}",
					dataPoints: standard.levels
				}]
			});

			chartUpdateFunctions[standard.id] = (dataPoints) => {
				charts[standard.id].options.data[0].dataPoints = dataPoints;
				charts[standard.id].render();
			};
			charts[standard.id].render();
		});

		setInterval(updateCharts, 10000);
		$(".form__group").hide();
		$(".buttons").hide();
		$("#after-access-data").show();
	});
});

$("#submit-rubric").click(function() {
	// validate and build object from all standards
	$("#submit-rubric").prop("disabled", true);
	let choices = [];
	for (let row = 1; row <= standard_rows; row++) {
		let id = $("#" + row).find(".option1 input").attr("name");
		let selected = $("#" + row).find("input[name=" + id + "]:checked");
		if (!selected.val()) {
			alert("A selection is required in each row!");
			$("#submit-rubric").prop("disabled", false);
			return;
		}

		choices.push({
			id: id,
			level: selected.val()
		})
	}

	let submission = {
		rubric_id: rubric_id,
		choices: choices
	};
	$.post("/submitRubric", submission, () => {
		$("#results-received").show();
		setTimeout(() => {
			location.reload();
		}, 5000);
	});
});

$("#exit").click(function() {
	location.reload();
});

$("#make-standard").click(function() {
	standard_rows++;
	let standard = $("tbody tr:first-child").clone();
	for (let i = 0; i < 5; i++) {
		let input = standard.find("td:nth-child(" + (i + 1) + ") input");
		input.attr("name", standard_rows + " " + i);
		input.val("");
	}
	standard.appendTo("#rubric-to-edit tbody");
	$("#standard_count").val(standard_rows + 1);
});