const ctx = $("#chartCanvas")[0].getContext("2d");
let chart;

// 文档加载完成后执行初始化
$(document).ready(async function () {
	initEventListeners(); // 初始化事件监听
	initDateRangePicker(); // 初始化日期選擇器
	await updateChart(); // 初始化图表

	// 每分钟刷新图表和表格的数据
	// setInterval(async () => {
	// 	await updateChart();
	// }, 10000); // 60000 毫秒 = 1 分钟
});

// 加载 JSON 数据并返回
async function fetchData(timePeriod) {
	const response = await fetch("chartData.json");
	const data = await response.json();
	return data[timePeriod];
}

// 更新图表的函数
async function updateChart(dateRange) {
	const chartType = $("#chartType").val();
	const timePeriod = $("#timePeriod").val();

	if (timePeriod === "day") {
		$(".timePeriodPicker").removeClass("d-none");
	} else {
		$(".timePeriodPicker").addClass("d-none");
	}

	let rawData = await fetchData(timePeriod);

	if (dateRange) {
		// 設定篩選的日期範圍，並轉換為 YY/MM/DD 格式
		const startDate = dateRange.split(" - ")[0].slice(2); // 轉為 "24/01/11"
		const endDate = dateRange.split(" - ")[1].slice(2); // 轉為 "24/01/27"

		// 使用 filter 篩選符合範圍的日期
		rawData = rawData.filter((item) => {
			return item.label >= startDate && item.label <= endDate;
		});
	}

	const labels = rawData.map((item) => item.label);
	const values = rawData.map((item) => item.value);

	if (chart) {
		chart.destroy();
	}

	chart = new Chart(ctx, {
		type: chartType,
		data: {
			labels: labels,
			datasets: [
				{
					label: "数据集",
					data: values,
					backgroundColor: "rgba(75, 192, 192, 0.2)",
					borderColor: "rgba(75, 192, 192, 1)",
					borderWidth: 1,
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				y: {
					beginAtZero: true,
				},
			},
			plugins: {
				legend: {
					position: "bottom",
				},
			},
			animation: false, // 停用動畫
		},
	});

	updateTable(labels, values);
}

// 更新表格的函数
function updateTable(labels, values) {
	const tableBody = $("#gridTable tbody");
	tableBody.empty();

	labels.forEach((label, index) => {
		const row = `<tr>
					<td scope="col">${label}</td>
            		<td scope="col">${values[index]}</td>
                </tr>`;
		tableBody.append(row);
	});
}

// 初始化事件监听
function initEventListeners() {
	$("#chartType").on("change", function () {
		updateChart();
	});

	$("#timePeriod").on("change", function () {
		updateChart();
	});

	$(".switchBtn").on("click", function () {
		$(".switchBtn").removeClass("selected");
		$(this).addClass("selected");
	});
	$("#dateRange").on("change", function () {
		updateChart(this.value);
	});
}

// 初始化日期選擇器
function initDateRangePicker() {
	// 計算過去30天的日期
	var startDate = moment().subtract(29, "days"); // 29天前
	var endDate = moment(); // 當前日期

	$("#dateRange").daterangepicker({
		startDate: startDate, // 設置預設的開始日期
		endDate: endDate, // 設置預設的結束日期
		locale: {
			format: "YYYY/MM/DD",
			applyLabel: "確定",
			cancelLabel: "取消",
			fromLabel: "開始日期",
			toLabel: "結束日期",
			customRangeLabel: "自訂日期區間",
			daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
			monthNames: [
				"1月",
				"2月",
				"3月",
				"4月",
				"5月",
				"6月",
				"7月",
				"8月",
				"9月",
				"10月",
				"11月",
				"12月",
			],
			firstDay: 1,
		},
		ranges: {
			今天: [moment(), moment()],
			昨天: [moment().subtract(1, "days"), moment().subtract(1, "days")],
			"過去 7 天": [moment().subtract(6, "days"), moment()],
			"過去 30 天": [moment().subtract(29, "days"), moment()],
			本月: [moment().startOf("month"), moment().endOf("month")],
			上個月: [
				moment().subtract(1, "month").startOf("month"),
				moment().subtract(1, "month").endOf("month"),
			],
		},
		alwaysShowCalendars: true,
	});
}
