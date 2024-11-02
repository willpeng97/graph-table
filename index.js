// 先初始化一個空圖表
const ctx = $("#chartCanvas")[0].getContext("2d");
let chart;

// 更新圖表的函數
function updateChart(chartType, timeRange) {
	const data = fetchData(timeRange); // 模擬取得數據的函數

	// 移除先前的圖表
	if (chart) {
		chart.destroy();
	}

	// 根據選擇的圖表類型建立新圖表
	chart = new Chart(ctx, {
		type: chartType,
		data: {
			labels: data.labels,
			datasets: [
				{
					label: "數據集",
					data: data.values,
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
		},
	});
}

// 模擬取得數據
function fetchData(timeRange) {
	const labels = [];
	const values = [];

	switch (timeRange) {
		case "week":
			labels.push("周一", "周二", "周三", "周四", "周五", "周六", "周日");
			values.push(10, 20, 30, 40, 50, 60, 70);
			break;
		case "month":
			for (let i = 1; i <= 30; i++) {
				labels.push(`Day ${i}`);
				values.push(Math.floor(Math.random() * 100));
			}
			break;
		case "year":
			labels.push(
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
				"12月"
			);
			values.push(100, 150, 200, 130, 160, 190, 220, 140, 170, 200, 180, 210);
			break;
	}

	return { labels, values };
}

// 監聽下拉選單的變化
$("#chartType").on("change", function () {
	const chartType = $(this).val();
	const timeRange = $("#timeRange").val();
	updateChart(chartType, timeRange);
});

$("#timeRange").on("change", function () {
	const chartType = $("#chartType").val();
	const timeRange = $(this).val();
	updateChart(chartType, timeRange);
});

// 初始化圖表
updateChart("line", "week");
